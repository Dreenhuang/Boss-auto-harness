# Boss-auto-harness v2.0 安装指南

---

## 📋 系统要求

### 硬件要求
| 项目 | 最低配置 | 推荐配置 |
|------|---------|---------|
| CPU | Intel i3 / AMD Ryzen 3 | Intel i5 / AMD Ryzen 5 |
| 内存 | 8 GB | 16 GB |
| 磁盘空间 | 5 GB 可用 | 10 GB 可用 |

### 软件要求
| 项目 | 版本要求 |
|------|---------|
| Node.js | >= 18.0.0 |
| Bun | >= 1.0.0 |
| Git | >= 2.30.0 |

### 支持的操作系统
- ✅ Windows 10 / 11 (64位)
- ✅ macOS 10.15+
- ✅ Linux (Ubuntu 20.04+, CentOS 8+)

---

## 🚀 安装步骤

### 方法一：一键安装（推荐）

#### Windows 用户
```powershell
# 打开 PowerShell（以管理员身份运行）
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
iwr -Uri "https://raw.githubusercontent.com/Dreenhuang/Boss-auto-harness/main/install/install.ps1" -OutFile "install.ps1"
.\install.ps1
```

#### macOS / Linux 用户
```bash
# 打开终端
curl -sSL https://raw.githubusercontent.com/Dreenhuang/Boss-auto-harness/main/install/install.sh | bash
```

### 方法二：手动安装

#### 1. 克隆项目
```bash
git clone https://github.com/Dreenhuang/Boss-auto-harness.git
cd Boss-auto-harness
```

#### 2. 安装依赖
```bash
bun install
```

#### 3. 配置全局路径
```bash
# Linux/macOS
echo 'export PATH="$PATH:$(pwd)/bin"' >> ~/.bashrc
source ~/.bashrc

# Windows PowerShell
$env:PATH += ";$(Get-Location)\bin"
[Environment]::SetEnvironmentVariable("PATH", $env:PATH, "User")
```

#### 4. 验证安装
```bash
boss --version
# 输出: Boss-auto-harness v2.0.0
```

---

## ⚙️ 配置说明

### 配置文件位置
```
~/.boss-harness/config.json  # Linux/macOS
%USERPROFILE%\.boss-harness\config.json  # Windows
```

### 配置项说明
```json
{
  "api_tokens": {
    "github_pat": "your-github-pat",
    "gitee_pat": "your-gitee-pat",
    "minimax_api_key": "your-minimax-key"
  },
  "default_platform": "github",
  "verbose": false
}
```

---

## 🎯 快速开始

### 1. 在任意项目中启动 Boss 模式
```bash
cd your-project
boss
```

### 2. 使用核心技能
```bash
# 需求收集
boss product-spec-builder

# 开发计划
boss dev-planner

# 代码开发
boss dev-builder

# 质量检查
boss quality-gate

# 一键发布
boss release-builder
```

### 3. 触发词列表
在 TRAE IDE 中输入以下任意关键字即可触发：
- `boss`
- `boss模式`
- `boss开发`
- `Boss-harness`
- `全自动开发`

---

## ❌ 常见问题

### Q1: 安装时提示权限不足
**解决方案：**
```bash
# Linux/macOS
sudo chmod +x install.sh
sudo ./install.sh

# Windows
# 以管理员身份运行 PowerShell
```

### Q2: 无法连接到 GitHub
**解决方案：**
1. 检查网络连接
2. 配置代理（如需）
3. 验证 PAT 是否正确配置

### Q3: Boss 模式不触发
**解决方案：**
1. 确保 TRAE IDE 已正确安装
2. 检查是否在项目目录中
3. 重启 IDE 后重试

### Q4: 缺少依赖报错
**解决方案：**
```bash
bun install
bun update
```

### Q5: 图片生成失败
**解决方案：**
1. 检查 MiniMax API Key 是否配置正确
2. 检查 API 配额是否用尽（每日50张）

---

## 📞 技术支持

### 官方资源
- 项目仓库: https://github.com/Dreenhuang/Boss-auto-harness
- 文档站点: https://boss-auto-harness.github.io
- Issues: https://github.com/Dreenhuang/Boss-auto-harness/issues

### 联系我们
- 邮箱: support@boss-harness.dev
- 社区: https://discord.gg/boss-harness

---

## 📝 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|---------|
| v2.0.0 | 2026-04-30 | 全面优化，新增熵治理、技术债管理、跨平台支持 |
| v1.5.0 | 2026-03-15 | 新增图片生成、Git自动化、监控告警 |
| v1.0.0 | 2026-01-01 | 初始版本发布 |

---

**Boss-auto-harness** - AI 编程工程化助手  
*让AI编程更智能、更高效、更可靠*

---

## 📁 目录结构

```
Boss-auto-harness/
├── agents/              # AI Agent 定义
├── skills/              # 核心技能模块
├── rules/               # 规则配置
├── docs/                # 文档
├── install/             # 安装脚本
├── trae-agents/         # TRAE 集成
├── memory/              # 记忆存储
├── bin/                 # 可执行文件
├── README.md            # 项目说明
├── INSTALL.md           # 安装指南
└── USER-GUIDE.md        # 使用手册
```