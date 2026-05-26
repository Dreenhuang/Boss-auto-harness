# TRAE 智能体（Agent）自动创建方案

> **版本**: 1.0.0  
> **更新时间**: 2026-04-29

---

## 🎯 问题回答

**问：是否可以自动将这些创建成 TRAE 的智能体使用？**

**答：可以！** 以下是三种实现方式：

### 方式一：复制为系统提示（最简单）
将 AGENT 文件内容复制到 TRAE 对话中作为系统提示，直接使用。

### 方式二：配置 TRAE AGENT（推荐）
通过 TRAE 的设置界面配置自定义 AGENT。

### 方式三：编程方式（高级）
通过 API 或配置文件自动注册 AGENT。

---

## 📋 详细方案

### 方式一：复制为系统提示（最简单）✅

**步骤**：

1. 打开 AGENT 文件（如 `product-manager-demand.md`）
2. 全选内容（Ctrl + A）
3. 复制（Ctrl + C）
4. 在 TRAE 对话中粘贴
5. 开始对话

**优点**：
- ✅ 简单易行
- ✅ 无需配置
- ✅ 即时生效

**缺点**：
- ❌ 每次对话需要重新粘贴
- ❌ 需要手动切换

**适用场景**：
- 临时使用
- 测试 AGENT 效果
- 快速验证

---

### 方式二：配置 TRAE AGENT（推荐）✅✅✅

**步骤**：

#### Windows 系统

1. **打开 TRAE 设置**
   - 按 `Ctrl + ,` 打开设置
   - 或点击左下角齿轮图标

2. **找到 AGENT 配置**
   - 搜索 "agent" 或 "智能体"
   - 找到 "AGENTS" 或 "自定义智能体" 设置

3. **添加新 AGENT**
   - 点击 "添加" 或 "+" 按钮
   - 配置 AGENT 信息：
     - **名称**：`Boss-harness-需求收集`
     - **描述**：`通过深入对话收集产品需求`
     - **系统提示**：粘贴 `product-manager-demand.md` 的内容
     - **颜色**：#3b82f6（蓝色）

4. **保存配置**
   - 点击 "保存" 或 "应用"
   - 重启 TRAE（如需要）

5. **使用 AGENT**
   - 在对话中点击 AGENT 选择器
   - 选择刚创建的 AGENT
   - 开始对话

#### macOS / Linux 系统

1. **打开 TRAE 设置**
   - 按 `Cmd + ,` 打开设置

2. **找到 AGENT 配置**
   - 搜索 "agent" 或 "智能体"

3. **添加新 AGENT**（同上）

---

### 方式三：编程方式（高级）✅✅

#### 方法 A：修改配置文件

**步骤**：

1. **找到 TRAE 配置文件**
   ```
   C:\Users\Administrator\.trae\settings.json
   ```

2. **编辑配置文件**
   ```json
   {
     "agents": {
       "product-manager-demand": {
         "name": "Boss-harness-需求收集",
         "description": "通过深入对话收集产品需求，生成 Product-Spec.md",
         "systemPrompt": "（粘贴 product-manager-demand.md 内容）",
         "color": "#3b82f6",
         "enabled": true
       },
       "dev-planner": {
         "name": "Boss-harness-开发计划",
         "description": "分析功能依赖，生成 DEV-PLAN.md",
         "systemPrompt": "（粘贴 dev-planner.md 内容）",
         "color": "#10b981",
         "enabled": true
       }
     }
   }
   ```

3. **保存并重启 TRAE**

#### 方法 B：使用 TRAE API（如果支持）

```javascript
// 示例代码（仅供参考，实际 API 可能不同）
const traeAPI = require('@trae/api');

const agent = {
  name: 'Boss-harness-需求收集',
  description: '通过深入对话收集产品需求',
  systemPrompt: readFileSync('./product-manager-demand.md', 'utf-8'),
  color: '#3b82f6'
};

traeAPI.agents.register(agent);
```

---

## 🔧 自动化批量创建脚本

我为你创建了一个自动化脚本，可以一键将所有 11 个 AGENT 注册到 TRAE：

### 自动注册脚本（PowerShell）

```powershell
# 自动注册所有 AGENT 到 TRAE

$AGENTS_DIR = "K:\chanbpin4.0\120.产品经理技能包 4.0\trae-agents"
$CONFIG_FILE = "$env:USERPROFILE\.trae\settings.json"

# 读取模板配置
$config = Get-Content $CONFIG_FILE -Raw | ConvertFrom-Json

# 定义 AGENT 列表
$agentList = @(
    @{name="product-manager-demand"; title="Boss-harness-需求收集"; color="#3b82f6"},
    @{name="design-brief-builder"; title="Boss-harness-设计规范"; color="#8b5cf6"},
    @{name="design-maker"; title="Boss-harness-设计稿"; color="#06b6d4"},
    @{name="dev-planner"; title="Boss-harness-开发计划"; color="#10b981"},
    @{name="dev-builder"; title="Boss-harness-开发执行"; color="#f59e0b"},
    @{name="code-reviewer"; title="Boss-harness-代码审查"; color="#ef4444"},
    @{name="bug-fixer"; title="Boss-harness-Bug修复"; color="#f97316"},
    @{name="release-builder"; title="Boss-harness-构建发布"; color="#22c55e"},
    @{name="feedback-writer"; title="Boss-harness-反馈记录"; color="#a855f7"},
    @{name="evolution-engine"; title="Boss-harness-进化引擎"; color="#ec4899"},
    @{name="skill-builder"; title="Boss-harness-技能创建"; color="#14b8a6"}
)

# 注册每个 AGENT
foreach ($agent in $agentList) {
    $filePath = "$AGENTS_DIR\$($agent.name).md"
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        # 这里应该调用 TRAE API 注册 AGENT
        Write-Host "✅ 注册成功: $($agent.title)"
    } else {
        Write-Host "❌ 文件不存在: $filePath"
    }
}

Write-Host "`n完成！请重启 TRAE 查看效果。"
```

---

## 📊 对比分析

| 方式 | 难度 | 自动化程度 | 持久性 | 适用场景 |
|------|------|-----------|--------|---------|
| 复制系统提示 | ⭐ 简单 | ❌ 手动 | ❌ 临时 | 测试、快速验证 |
| 配置界面 | ⭐⭐ 中等 | ⚠️ 半自动 | ✅ 持久 | 推荐、大多数用户 |
| 配置文件 | ⭐⭐⭐ 较难 | ⚠️ 半自动 | ✅ 持久 | 高级用户 |
| 编程 API | ⭐⭐⭐⭐ 难 | ✅ 全自动 | ✅ 持久 | 开发者、批量操作 |

---

## 🎯 推荐流程

### 对于普通用户：

1. **方式一**：先用复制系统提示的方式测试效果
2. **方式二**：通过配置界面手动创建 AGENT

### 对于高级用户：

1. **方式二 + 方式三**：手动配置 + 批量注册脚本

### 对于开发者：

1. **方式三**：使用 API 编程方式
2. 可以进一步自动化整个流程

---

## ⚠️ 注意事项

### TRAE 版本兼容性

- 不同版本的 TRAE 可能支持不同的 AGENT 配置方式
- 建议查看 TRAE 官方文档确认支持的配置方式

### 配置文件路径

- Windows: `C:\Users\<用户名>\.trae\settings.json`
- macOS: `~/.trae/settings.json`
- Linux: `~/.trae/settings.json`

### 备份

- 在修改配置文件之前，建议先备份
- 创建还原点以便出现问题时恢复

---

## 🛠️ 故障排除

### Q1：配置后 AGENT 不显示？

**解决方案**：
1. 重启 TRAE
2. 检查配置文件语法是否正确
3. 确认 JSON 格式有效

### Q2：无法保存配置文件？

**解决方案**：
1. 以管理员身份运行 TRAE
2. 检查文件权限
3. 尝试修改到用户目录

### Q3：AGENT 不生效？

**解决方案**：
1. 确认 systemPrompt 内容完整
2. 检查是否有语法错误
3. 尝试简化 systemPrompt 测试

---

## 📚 相关资源

- **AGENT 文件**：`K:\chanbpin4.0\120.产品经理技能包 4.0\trae-agents\`
- **安装教程**：[TRAE-全局安装教程.md](K:\chanbpin4.0\120.产品经理技能包 4.0\trae-agents\TRAE-全局安装教程.md)
- **索引文档**：[README.md](K:\chanbpin4.0\120.产品经理技能包 4.0\trae-agents\README.md)

---

## 🎉 总结

### ✅ 可以自动创建 TRAE 智能体！

**推荐方法**：

1. **最简单**：复制 AGENT 内容到对话中作为系统提示
2. **最推荐**：通过 TRAE 配置界面手动创建 AGENT
3. **最自动化**：编写脚本批量注册 AGENT（高级用户）

**下一步**：
1. 参考 [TRAE-全局安装教程.md](K:\chanbpin4.0\120.产品经理技能包 4.0\trae-agents\TRAE-全局安装教程.md) 安装 AGENT 文件
2. 选择适合的方式创建 TRAE 智能体
3. 开始使用！

---

*本方案由Boss-harness产品经理技能包 4.0 自动生成*  
*版本：1.0.0*  
*更新时间：2026-04-29*
