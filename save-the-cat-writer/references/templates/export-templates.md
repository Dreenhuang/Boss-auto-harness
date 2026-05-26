# 导出格式模板指南

> 本文档提供救猫咪编剧助手生成内容的各种导出格式模板。包括Markdown、HTML、Fountain、Final Draft等格式的详细规范。

---

## 支持的导出格式

| 格式 | 扩展名 | 主要用途 | 推荐指数 |
|------|--------|----------|----------|
| Markdown | .md | 对话查看、文档编辑、GitHub | ⭐⭐⭐⭐⭐ |
| HTML | .html | 浏览器预览、打印 | ⭐⭐⭐⭐ |
| Fountain | .fountain | 专业编剧软件 | ⭐⭐⭐⭐ |
| Final Draft | .fdx | Final Draft软件 | ⭐⭐⭐ |

---

## 1. Markdown格式 (.md)

Markdown是最通用的格式，适合在各种环境中查看和编辑。

### 标准Markdown模板

```markdown
# [项目标题]

## 基本信息

| 项目 | 内容 |
|------|------|
| 类型 | [电影类型] |
| 时长 | [页数]页 |
| 创建日期 | [日期] |
| 状态 | [草稿/完成] |

## Logline

[一句话故事概念]

## 主题陈述

当[角色做某事]时，[主题/教训]变得清晰。

---

## 角色介绍

### 主角

**姓名**：[名字]
**身份**：[职业/背景]
**缺陷**：[性格缺陷]
**欲望**：[外在追求]
**需求**：[内在需要]
**救猫咪时刻**：[描述]

### B故事角色

**姓名**：[名字]
**与主角关系**：[关系描述]
**角色功能**：[功能描述]

### 反派/障碍

**名称**：[名字/类型]
**核心威胁**：[威胁描述]

---

## 15节拍表

| 节拍 | 页码 | 标题 | 核心任务 | 关键情节点 |
|------|------|------|----------|------------|
| 1 | 1 | 开场画面 | [任务] | [情节点] |
| 2 | 5 | 主题阐明 | [任务] | [情节点] |
| 3 | 1-10 | 铺垫 | [任务] | [情节点] |
| 4 | 12 | 催化剂 | [任务] | [情节点] |
| 5 | 12-25 | 争执 | [任务] | [情节点] |
| 6 | 25 | 第二幕衔接点 | [任务] | [情节点] |
| 7 | 30 | B故事 | [任务] | [情节点] |
| 8 | 30-55 | 游戏时间 | [任务] | [情节点] |
| 9 | 55 | 中点 | [任务] | [情节点] |
| 10 | 55-75 | 坏人逼近 | [任务] | [情节点] |
| 11 | 75 | 一无所有 | [任务] | [情节点] |
| 12 | 75-85 | 灵魂黑夜 | [任务] | [情节点] |
| 13 | 85 | 第三幕衔接点 | [任务] | [情节点] |
| 14 | 85-110 | 结局 | [任务] | [情节点] |
| 15 | 110 | 终场画面 | [任务] | [情节点] |

---

## 详细场景描述

### 第一幕：设定（第1-25页）

#### [场景1] 开场画面（第1页）

**场景描述**：
[详细描述]

**情感基调**：[基调描述]

**关键台词**：
> [台词内容]

---

### [继续其他场景...]

---

## 剧本节选

### 第一幕：设定

---

**场景1**

内景 公寓 - 早晨

[描述主角在狭小公寓里的早晨，显示他的日常生活和孤独感]

约翰（独白）：
每天醒来，我都在问自己同一个问题。

[约翰看着窗外的城市，眼神迷茫]

约翰（继续）：
这一切是为了什么？

---

**场景2**

内景 办公室 - 白天

[约翰在公司里，被上司训斥]

上司：
约翰，你这个报告又出问题了！

[约翰低头听着，不敢反驳]

---

```

---

## 2. HTML格式 (.html)

HTML格式可以直接在浏览器中打开，有美化的样式。

### 标准HTML模板

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[项目标题] - 剧本</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
            line-height: 1.8;
            color: #333;
            background-color: #f5f5f5;
            padding: 40px 20px;
        }
        
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            padding: 60px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        h1 {
            font-size: 2.5em;
            text-align: center;
            margin-bottom: 30px;
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 20px;
        }
        
        h2 {
            font-size: 1.8em;
            margin: 40px 0 20px;
            color: #34495e;
            border-left: 4px solid #3498db;
            padding-left: 15px;
        }
        
        h3 {
            font-size: 1.4em;
            margin: 30px 0 15px;
            color: #2c3e50;
        }
        
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        
        .info-table th,
        .info-table td {
            border: 1px solid #ddd;
            padding: 12px 15px;
            text-align: left;
        }
        
        .info-table th {
            background-color: #3498db;
            color: white;
            width: 25%;
        }
        
        .beat-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 0.9em;
        }
        
        .beat-table th,
        .beat-table td {
            border: 1px solid #ddd;
            padding: 10px 8px;
            text-align: left;
            vertical-align: top;
        }
        
        .beat-table th {
            background-color: #2c3e50;
            color: white;
        }
        
        .beat-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        
        .logline {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            border-radius: 8px;
            margin: 25px 0;
            font-size: 1.1em;
            line-height: 1.8;
        }
        
        .theme {
            background-color: #ecf0f1;
            padding: 20px;
            border-left: 4px solid #27ae60;
            margin: 20px 0;
        }
        
        .character {
            background: #f9f9f9;
            padding: 20px;
            margin: 15px 0;
            border-radius: 5px;
        }
        
        .character h3 {
            color: #3498db;
            margin-top: 0;
        }
        
        .scene {
            margin: 30px 0;
            padding: 20px;
            background: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
        }
        
        .scene-header {
            font-weight: bold;
            color: #2c3e50;
            font-size: 1.1em;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px dashed #ccc;
        }
        
        .scene-content {
            margin-left: 20px;
        }
        
        .scene-location {
            color: #7f8c8d;
            font-style: italic;
        }
        
        .dialogue {
            margin: 10px 0 10px 40px;
        }
        
        .character-name {
            font-weight: bold;
            color: #e74c3c;
        }
        
        .action {
            margin: 10px 0;
            margin-left: 20px;
            color: #555;
        }
        
        .note {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
        }
        
        footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #7f8c8d;
            font-size: 0.9em;
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .container {
                box-shadow: none;
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>[项目标题]</h1>
        
        <h2>基本信息</h2>
        <table class="info-table">
            <tr>
                <th>类型</th>
                <td>[电影类型]</td>
            </tr>
            <tr>
                <th>时长</th>
                <td>[页数]页</td>
            </tr>
            <tr>
                <th>创建日期</th>
                <td>[日期]</td>
            </tr>
            <tr>
                <th>状态</th>
                <td>[草稿/完成]</td>
            </tr>
        </table>
        
        <h2>Logline</h2>
        <div class="logline">
            [一句话故事概念]
        </div>
        
        <h2>主题陈述</h2>
        <div class="theme">
            当[角色做某事]时，[主题/教训]变得清晰。
        </div>
        
        <h2>角色介绍</h2>
        
        <div class="character">
            <h3>主角</h3>
            <p><strong>姓名：</strong>[名字]</p>
            <p><strong>身份：</strong>[职业/背景]</p>
            <p><strong>缺陷：</strong>[性格缺陷]</p>
            <p><strong>欲望：</strong>[外在追求]</p>
            <p><strong>需求：</strong>[内在需要]</p>
        </div>
        
        <div class="character">
            <h3>B故事角色</h3>
            <p><strong>姓名：</strong>[名字]</p>
            <p><strong>与主角关系：</strong>[关系描述]</p>
            <p><strong>角色功能：</strong>[功能描述]</p>
        </div>
        
        <h2>15节拍表</h2>
        <table class="beat-table">
            <thead>
                <tr>
                    <th>节拍</th>
                    <th>页码</th>
                    <th>核心任务</th>
                    <th>关键情节点</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>开场画面</td>
                    <td>1</td>
                    <td>[任务]</td>
                    <td>[情节点]</td>
                </tr>
                <tr>
                    <td>主题阐明</td>
                    <td>5</td>
                    <td>[任务]</td>
                    <td>[情节点]</td>
                </tr>
                <!-- 继续其他节拍... -->
            </tbody>
        </table>
        
        <h2>剧本预览</h2>
        
        <div class="scene">
            <div class="scene-header">
                场景1 - 内景 公寓 - 早晨
            </div>
            <div class="scene-content">
                <p class="action">[描述主角在狭小公寓里的早晨，显示他的日常生活和孤独感]</p>
                <p class="dialogue"><span class="character-name">约翰</span>（独白）：</p>
                <p class="dialogue">每天醒来，我都在问自己同一个问题。</p>
                <p class="action">[约翰看着窗外的城市，眼神迷茫]</p>
                <p class="dialogue"><span class="character-name">约翰</span>（继续）：</p>
                <p class="dialogue">这一切是为了什么？</p>
            </div>
        </div>
        
        <footer>
            <p>本剧本由救猫咪编剧助手生成</p>
            <p>基于布莱克·斯奈德《救猫咪》编剧理论</p>
        </footer>
    </div>
</body>
</html>
```

---

## 3. Fountain格式 (.fountain)

Fountain是一种纯文本的剧本格式，可被多种专业软件支持。

### Fountain基础语法

```fountain
Title: 项目标题
Credit: Written by
Author: 作者
Draft date: 日期
Contact: 联系信息

===

# 第一幕：设定

## 场景1

INT. 公寓 - 早晨

描述主角在狭小公寓里的早晨，显示他的日常生活和孤独感。

约翰
(独白)
每天醒来，我都在问自己同一个问题。

[约翰看着窗外的城市，眼神迷茫]

约翰
(继续)
这一切是为了什么？

**约翰走进浴室，对着镜子发呆**

他们说，人到中年就开始思考人生。
可我才二十八。

---

## 场景2

INT. 办公室 - 白天

约翰在公司里，被上司训斥。上司看起来很生气。

上司
约翰，你这个报告又出问题了！

[约翰低头听着，不敢反驳]

上司
你知道这是第几次了吗？

JOHN nods silently, his eyes fixed on the floor.

上司
我需要你在下班前给我一份新的报告。
```

### Fountain关键语法说明

| 语法 | 示例 | 说明 |
|------|------|------|
| 标题页 | `Title: 标题` | 剧本标题 |
| 章节 | `= 第一幕 =` | 第一幕标记 |
| 场景标题 | `INT. 地点 - 时间` | 场景位置和时间 |
| 动作描述 | `[描述内容]` 或裸行 | 场景描述 |
| 角色名 | `角色名` | 对话角色 |
| 对话 | `对话内容` | 对话文字 |
| 括号动作 | `(动作)` | 角色动作/语气 |
| 切换 | `> 切换内容 <` | 特殊切换 |
| 注释 | `[[注释内容]]` | 不显示的注释 |

---

## 4. Final Draft格式 (.fdx)

Final Draft是业界标准的剧本软件格式，使用XML结构。

### fdx基础结构

```xml
<?xml version="1.0" encoding="UTF-8"?>
<FinalDraft DocumentType="Script" Template="No" Version="5">
    <Content>
        <Paragraph Type="Scene Heading">
            <Text>INT. 公寓 - 早晨</Text>
        </Paragraph>
        <Paragraph Type="Action">
            <Text>描述主角在狭小公寓里的早晨，显示他的日常生活和孤独感。</Text>
        </Paragraph>
        <Paragraph Type="Character">
            <Text>约翰</Text>
        </Paragraph>
        <Paragraph Type="Dialogue">
            <Text>每天醒来，我都在问自己同一个问题。</Text>
        </Paragraph>
        <Paragraph Type="Action">
            <Text>约翰看着窗外的城市，眼神迷茫</Text>
        </Paragraph>
        <Paragraph Type="Character">
            <Text>约翰</Text>
        </Paragraph>
        <Paragraph Type="Parenthetical">
            <Text>(继续)</Text>
        </Paragraph>
        <Paragraph Type="Dialogue">
            <Text>这一切是为了什么？</Text>
        </Paragraph>
    </Content>
    <TitlePage>
        <Content>
            <Paragraph Type="Title">
                <Text>项目标题</Text>
            </Paragraph>
            <Paragraph Type="Credit">
                <Text>Written by</Text>
            </Paragraph>
            <Paragraph Type="Author">
                <Text>作者</Text>
            </Paragraph>
        </Content>
    </TitlePage>
</FinalDraft>
```

---

## 导出功能使用指南

### 在对话中使用

```
用户：导出为HTML格式

AI：好的，我为你生成HTML格式的剧本。内容包括：
- 完整的15节拍表
- 角色介绍
- 主题陈述
- 剧本预览（可选完整剧本）

[生成HTML内容]

你可以：
1. 直接复制以上内容，保存为.html文件
2. 或告诉我需要导出为其他格式（Markdown/Fountain）
```

### 批量导出

```
用户：我需要所有生成的内容都导出

AI：好的，我为你生成完整的项目包：
1. 项目概述.md - 故事概念和类型选择
2. 15节拍表.md - 完整的结构框架
3. 角色设计.md - 所有角色设定
4. 完整剧本.md - 完整剧本内容
5. 项目.html - 可在浏览器预览的综合版本

需要我生成哪个格式的版本？
```

---

## 格式转换工具推荐

| 工具 | 支持格式 | 网址 |
|------|----------|------|
| Fountainizer | TXT → Fountain | fountainizer.com |
| Highland | Fountain ↔ PDF | highland.app |
| WriterSolo | 多格式转换 | writersolo.com |
| Draftable | 在线比较 | draftable.com |

---

*最后更新：2026年05月26日*
