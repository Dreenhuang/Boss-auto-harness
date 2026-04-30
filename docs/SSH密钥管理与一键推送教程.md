# SSH密钥管理与一键推送教程

> **版本**: v1.0.0 | **更新日期**: 2026-04-30 | **作者**: Boss-harness (woshiboss666)

---

## 目录
- [一、一键推送（最简方式）](#一键推送)
- [二、SSH密钥完整教程](#ssh密钥教程)
- [三、常见问题排查](#常见问题)

---

## 一、一键推送（最简方式）

### 方法：使用一键推送脚本

**以后更新代码只需运行：**

```powershell
cd "k:\chanbpin4.0\120.产品经理技能包 4.0"
powershell -ExecutionPolicy Bypass -File push-to-all-repos.ps1
```

脚本会自动：
1. 检测代码变更并commit
2. 自动创建Gitee仓库（如果不存在）
3. 推送到Gitee
4. （可选）推送到GitHub（需要配置Token）

### 配置GitHub Token（可选）

编辑 `push-to-all-repos.ps1`，找到第11行：

```powershell
$GITHUB_TOKEN = ""  # 填入你的GitHub Classic PAT
```

**获取GitHub Token步骤：**
1. 打开 https://github.com/settings/tokens/new
2. 选择 **Generate new token (classic)**（注意：必须选classic，不是Fine-grained）
3. Note填：`Boss-auto-harness`
4. 勾选 **repo**（全部权限）
5. 点击 **Generate token**
6. 复制生成的 `ghp_xxxx...` 字符串
7. 粘贴到脚本的 `$GITHUB_TOKEN = "ghp_你的Token"`

---

## 二、SSH密钥完整教程

### 2.1 什么是SSH密钥？

SSH密钥是一对文件：
- **私钥**（`id_ed25519_github`）：留在你电脑上，绝不能泄露
- **公钥**（`id_ed25519_github.pub`）：上传到GitHub/Gitee，用于身份验证

有了SSH密钥，推送代码时不需要每次都输入密码。

### 2.2 生成新的SSH密钥

打开PowerShell，运行：

```powershell
# 生成Ed25519类型密钥（推荐，比RSA更安全且更快）
ssh-keygen -t ed25519 -C "你的邮箱@gmail.com" -f "$env:USERPROFILE\.ssh\id_ed25519_github" -N '""'
```

- `-t ed25519`：密钥类型
- `-C`：备注（通常用邮箱）
- `-f`：保存路径
- `-N '""'`：空密码（不用输入密码）

成功后会生成两个文件：
- `C:\Users\你的用户名\.ssh\id_ed25519_github`（私钥）
- `C:\Users\你的用户名\.ssh\id_ed25519_github.pub`（公钥）

### 2.3 将公钥添加到GitHub/Gitee

**查看公钥内容：**
```powershell
Get-Content "$env:USERPROFILE\.ssh\id_ed25519_github.pub"
```

复制输出的整行内容（以 `ssh-ed25519` 开头）。

**添加到GitHub：**
1. 打开 https://github.com/settings/keys
2. 点击 **New SSH key**
3. Title填：`我的电脑`
4. Key框粘贴公钥内容
5. 点击 **Add SSH key**

**添加到Gitee：**
1. 打开 https://gitee.com/profile/ssh_keys
2. 点击 **添加公钥**
3. 标题填：`我的电脑`
4. 公钥框粘贴同一串公钥
5. 点击 **确定**

### 2.4 配置SSH使用指定密钥

创建SSH配置文件：

```powershell
# 以管理员身份运行PowerShell，然后执行：
$config = @"
# GitHub
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_github
    IdentitiesOnly yes

# Gitee
Host gitee.com
    HostName gitee.com
    User git
    IdentityFile ~/.ssh/id_ed25519_github
    IdentitiesOnly yes
"@
Set-Content -Path "$env:USERPROFILE\.ssh\config" -Value $config -Encoding UTF8
```

### 2.5 启动SSH Agent并加载密钥

每次开机后需要加载密钥（或设置自动加载）：

```powershell
# 启动SSH Agent服务
Set-Service ssh-agent -StartupType Automatic
Start-Service ssh-agent

# 加载密钥
ssh-add "$env:USERPROFILE\.ssh\id_ed25519_github"

# 验证是否加载成功
ssh-add -l
```

看到类似输出说明成功：
```
256 SHA256:xxxxx 你的邮箱 (ED25519)
```

### 2.6 测试SSH连接

```powershell
# 测试GitHub
ssh -T git@github.com
# 应该输出：Hi woshiboss666! You've successfully authenticated...

# 测试Gitee
ssh -T git@gitee.com
# 应该输出：Welcome to Gitee.com, woshiboss666!
```

---

## 三、使用SSH推送代码

### 3.1 首次推送

```powershell
# 进入项目目录
cd "k:\chanbpin4.0\120.产品经理技能包 4.0"

# 初始化Git（如果还没有）
git init
git config user.name "woshiboss666"
git config user.email "woshiboss666@gmail.com"

# 添加并提交
git add .
git commit -m "feat: 首次提交"

# 添加远程仓库（SSH方式）
git remote add origin git@gitee.com:woshiboss666/Boss-auto-harness.git

# 推送
git push -u origin main
```

### 3.2 后续更新

```powershell
git add .
git commit -m "fix: 修复了xxx问题"
git push
```

### 3.3 同时推送到GitHub和Gitee

```powershell
# 添加第二个远程仓库
git remote add github git@github.com:woshiboss666/Boss-auto-harness.git

# 推送到Gitee
git push origin main

# 推送到GitHub
git push github main
```

---

## 四、常见问题排查

### Q1: 推送时要求输入密码

**原因**：SSH Agent未启动或密钥未加载

**解决**：
```powershell
# 启动Agent并加载密钥
Start-Service ssh-agent
ssh-add "$env:USERPROFILE\.ssh\id_ed25519_github"
```

### Q2: Permission denied (publickey)

**原因**：公钥未添加到平台或SSH配置有误

**排查步骤**：
```powershell
# 1. 检查Agent是否加载了密钥
ssh-add -l

# 2. 测试连接
ssh -T git@gitee.com -v  # 加-v查看调试信息

# 3. 确认公钥已添加到平台
# 重新执行 2.3 步骤
```

### Q3: 每次开机都要重新ssh-add

**解决**：创建开机自动加载脚本

```powershell
# 创建启动脚本
$startupDir = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup"
$startupScript = "$startupDir\ssh-add-boss.ps1"

$content = @'
Start-Service ssh-agent -ErrorAction SilentlyContinue
ssh-add "$env:USERPROFILE\.ssh\id_ed25519_github" 2>$null
'@
Set-Content -Path $startupScript -Value $content -Encoding UTF8
```

### Q4: GitHub Token创建仓库失败

**原因**：使用了Fine-grained PAT而不是Classic PAT

**解决**：
1. 打开 https://github.com/settings/tokens
2. 点击 **Generate new token** → 选择 **Generate new token (classic)**
3. 勾选 **repo** 权限
4. 复制新的Token到推送脚本

### Q5: 想换一台电脑使用

**步骤**：
1. 在新电脑生成新的SSH密钥（执行 2.2）
2. 公钥添加到GitHub/Gitee（执行 2.3）
3. 配置SSH config（执行 2.4）
4. 克隆项目：`git clone git@gitee.com:woshiboss666/Boss-auto-harness.git`

---

## 五、安全提醒

1. **永远不要分享私钥文件**（`id_ed25519_github`，没有`.pub`后缀的那个）
2. **不要把私钥上传到代码仓库**
3. **定期轮换密钥**（建议每6个月重新生成一次）
4. **如果怀疑密钥泄露，立即在GitHub/Gitee删除对应公钥并重新生成**

---

## 六、快速参考卡片

### 常用命令速查

| 操作 | 命令 |
|------|------|
| 生成密钥 | `ssh-keygen -t ed25519 -C "邮箱" -f "$env:USERPROFILE\.ssh\id_ed25519_github" -N '""'` |
| 查看公钥 | `Get-Content "$env:USERPROFILE\.ssh\id_ed25519_github.pub"` |
| 加载密钥 | `ssh-add "$env:USERPROFILE\.ssh\id_ed25519_github"` |
| 验证加载 | `ssh-add -l` |
| 测试连接 | `ssh -T git@gitee.com` |
| 一键推送 | `powershell -ExecutionPolicy Bypass -File push-to-all-repos.ps1` |
| 查看远程仓库 | `git remote -v` |
| 添加远程仓库 | `git remote add origin git@gitee.com:用户名/仓库名.git` |

---

*本教程由 Boss-auto-harness 团队编写，最后更新于 2026-04-30。*
