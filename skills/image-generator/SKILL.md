---
name: image-generator
description: 当用户需要生成图片、设计素材、图标、封面时使用。默认通过 MiniMax API 文生图，用户指定 seedream 时切换火山引擎 API。支持配额管理、多风格多尺寸，图片保存到项目 assets 目录。
---

[任务]
    根据用户的文字描述生成图片。支持产品素材、UI 设计参考、图标、封面、插画等多种场景。
    默认使用 MiniMax API（image-01 模型），用户明确要求 seedream 模型时切换到火山引擎 API。
    生成的图片保存到项目的 assets 目录，可直接在代码中引用。

[依赖检测]
    Skill 启动时第一步自动执行。

    必需：
    - MiniMax API Key（MINIMAX_API_KEY 环境变量）→ 缺失则提示用户配置

    可选（仅 seedream 模式需要）：
    - 火山引擎 API Key（VOLC_API_KEY 环境变量）→ 缺失则提示用户配置

    可选（增强生成质量）：
    - Design-Brief.md → 有则根据设计风格生成更匹配的图片
    - Product-Spec.md → 有则根据产品定位生成更精准的素材

[第一性原则]
    **需求翻译原则**：用户说"做个好看的图"不是需求。把模糊描述翻译成具体的画面描述、风格、构图、色调，翻译完复述给用户确认。
    **风格一致原则**：如果项目有 Design-Brief.md，生成的图片必须和设计规范保持一致。色彩、风格、氛围不能跑偏。
    **实用优先原则**：生成的是产品素材，不是艺术作品。关注可用性：尺寸对不对、能不能当封面、能不能放 UI 里。
    **批量生成原则**：一次需求尽量生成 2-4 张候选图，让用户选最合适的，不要只给一张赌运气。
    **配额保护原则**：MiniMax API 每日限额 50 张。上午（0-12点）最多用 30 张，下午/晚上（12-24点）可用至 50 张。每次生成前必须检查当日已用数量，超限则拒绝并提示。
    **联网优先**：涉及图片风格、设计趋势时先 WebSearch 确认当前流行方向。

[文件结构]
    ```
    image-generator/
    └── SKILL.md
    ```

[API 配置]

    [MiniMax API（默认）]
        API 端点：https://api.minimaxi.com/v1/image_generation
        请求方式：REST API (POST)
        超时设置：60 秒
        默认模型：image-01
        认证方式：Bearer Token

        请求头：
        ```
        Authorization: Bearer [MINIMAX_API_KEY]
        Content-Type: application/json
        ```

        请求体格式：
        ```json
        {
            "model": "image-01",
            "prompt": "[图片描述，最长1500字符]",
            "aspect_ratio": "1:1",
            "n": 1,
            "response_format": "base64"
        }
        ```

        参数说明：
        - model：必填，"image-01"
        - prompt：必填，图片文本描述，最长 1500 字符
        - aspect_ratio：可选，默认 "1:1"，支持 "1:1"、"16:9"、"9:16"、"4:3"、"3:4"、"21:9"
        - n：可选，单次生成图片数量，范围 [1, 9]，默认 1
        - seed：可选，随机种子，相同 seed + 参数可复现结果
        - response_format：可选，"url" 或 "base64"，默认 "url"

        响应格式：
        ```json
        {
            "data": {
                "image_base64": ["base64_string_1", "base64_string_2"]
            }
        }
        ```
        当 response_format 为 "url" 时，返回 image_urls 字段。

    [火山引擎 Seedream API（仅用户指定 seedream 时使用）]
        API 端点：https://ark.cn-beijing.volces.com/api/v3/images/generations
        请求方式：REST API (POST)
        超时设置：60 秒
        模型：doubao-seedream-3.0-t2i
        认证方式：Bearer Token

        请求头：
        ```
        Authorization: Bearer [VOLC_API_KEY]
        Content-Type: application/json
        ```

        请求体格式：
        ```json
        {
            "model": "doubao-seedream-3.0-t2i",
            "prompt": "[图片描述]",
            "size": "1024x1024",
            "n": 1,
            "seed": -1
        }
        ```

[配额管理规则]
    **每日限额**：MiniMax API 50 张/日

    **分时段配额**：
    - 上午（00:00 - 11:59）：最多使用 30 张
    - 下午/晚上（12:00 - 23:59）：最多使用 50 张（全天总额）

    **配额追踪机制**：
    - 每次生成前检查当前时间和当日已用数量
    - 当日已用数量记录在项目根目录 `.image-quota.json` 文件中
    - 文件格式：
    ```json
    {
        "date": "2026-04-30",
        "minimax_used": 12,
        "seedream_used": 0,
        "log": [
            {"time": "10:23", "api": "minimax", "count": 3, "prompt_summary": "product banner"},
            {"time": "14:05", "api": "minimax", "count": 2, "prompt_summary": "app icon"}
        ]
    }
    ```
    - 每日零点自动重置（检测到 date 不是今天时重置）
    - 跨日不累计

    **配额检查流程**：
    1. 读取 `.image-quota.json`
    2. 检查 date 是否为今天 → 不是则重置计数
    3. 获取当前小时 → 判断时段
    4. 检查 minimax_used + 本次请求数 是否超过时段限额
    5. 超限 → 拒绝生成，提示用户"今日配额已用完，剩余 X 张"
    6. 未超限 → 执行生成 → 更新计数和日志

[输出风格]
    **语态**：
    - 像专业的设计素材采购员：高效、精准、不废话
    - 给出明确的图片描述，不模糊

    **原则**：
    - × 绝不直接用用户的原始描述当 prompt（太模糊）
    - × 绝不生成和设计规范冲突的图片
    - × 绝不生成尺寸不对的图片
    - × 绝不在配额不足时强行生成
    - ✓ 每次生成前先翻译需求为具体 prompt
    - ✓ 生成后检查图片质量和风格匹配度
    - ✓ 保存到合理的目录结构
    - ✓ 每次生成前检查配额，告知用户剩余量

    **典型表达**：
    - "你要做个封面图，我理解的是：深色背景、科技感、产品名称居中、简洁几何元素。对吗？"
    - "根据你的 Design Brief（冷色、极简、专业），我生成 3 张候选：A 深蓝渐变、B 深灰+金色、C 纯黑+白色线条"
    - "配额提醒：今日已用 28/50 张（上午限额 30 张），剩余 2 张。建议精简需求或等下午再生成。"

[工作流程]
    [第一步：需求理解]
        1. 接收用户的图片需求
        2. 判断是否指定 seedream 模型：
           - 用户说"用 seedream"、"seedream 模型"、"豆包模型" → 使用火山引擎 API
           - 其他情况 → 默认使用 MiniMax API
        3. 判断图片类型：
           - 产品素材（封面、Banner、背景图）
           - UI 设计参考（界面截图风格的参考图）
           - 图标/Logo
           - 插画/装饰图
        4. 检查是否有 Design-Brief.md → 提取风格约束
        5. 检查是否有 Product-Spec.md → 提取产品定位

    [第二步：配额检查]
        1. 读取 `.image-quota.json`
        2. 检查日期，非今日则重置
        3. 根据当前时段判断可用配额
        4. 计算本次生成需要消耗的配额数（= n 参数值）
        5. 配额不足 → 提示用户剩余量，建议减少生成数量或等时段变更
        6. 配额充足 → 继续

    [第三步：Prompt 工程]
        1. 把用户描述翻译成具体的英文 prompt（MiniMax API 对英文 prompt 效果更好）
        2. Prompt 结构：
           - 主体描述（what）
           - 风格描述（style：根据 Design Brief 或用户偏好）
           - 构图描述（composition）
           - 色调描述（color palette）
           - 质量描述（quality：high quality, professional, 4K, detailed）
        3. 如有 Design-Brief.md → 注入风格关键词
        4. prompt 总长度不超过 1500 字符
        5. 展示翻译后的 prompt 给用户确认

    [第四步：调用 API 生成]

        [MiniMax API 调用流程（默认）]
            1. 构建请求体：
               ```json
               {
                   "model": "image-01",
                   "prompt": "[翻译后的英文 prompt]",
                   "aspect_ratio": "[根据图片类型选择]",
                   "n": [生成数量，考虑配额]",
                   "response_format": "base64"
               }
               ```
            2. 设置请求头：Authorization + Content-Type
            3. 发送 POST 请求到 https://api.minimaxi.com/v1/image_generation
            4. 检查响应状态码：
               - 200 → 解析响应，提取 base64 图片数据
               - 401 → API Key 无效，提示用户检查
               - 429 → 请求频率超限，等待后重试
               - 500 → 服务端错误，稍后重试
            5. 解码 base64 数据为图片文件
            6. 保存到项目 assets 目录

        [Seedream API 调用流程（仅用户指定时）]
            1. 构建请求体：
               ```json
               {
                   "model": "doubao-seedream-3.0-t2i",
                   "prompt": "[翻译后的 prompt]",
                   "size": "[根据图片类型选择]",
                   "n": 1,
                   "seed": -1
               }
               ```
            2. 设置请求头：Authorization + Content-Type
            3. 发送 POST 请求到火山引擎端点
            4. 处理响应，保存图片

    [第五步：保存和记录]
        1. 确定保存路径：
           - 产品素材：`<project-name>/assets/images/`
           - 图标：`<project-name>/assets/icons/`
           - 设计参考：`<project-name>/assets/references/`
        2. 文件命名：`[类型]-[描述]-[序号].png`
           例：`banner-hero-dark-01.png`
        3. 如目录不存在则创建
        4. 保存图片文件
        5. 更新 `.image-quota.json`：
           - 增加已用计数
           - 添加生成日志（时间、API、数量、prompt 摘要）

    [第六步：结果展示]
        向用户展示：
        - 生成的图片数量和路径
        - 每张图片的用途建议
        - 如有多张候选，推荐最合适的一张
        - 当前配额状态：已用 X/50 张
        - 提供重新生成或调整的选项

[图片类型 Prompt 模板]

    **产品封面/Banner**：
    "Professional [product type] banner, [style keywords from Design Brief], [color palette], clean layout, modern design, high quality, 4K"
    aspect_ratio: "16:9"

    **UI 设计参考**：
    "UI design reference for [feature name], [layout description], [style keywords], modern interface, professional, clean, high quality"
    aspect_ratio: "16:9"

    **图标**：
    "Minimalist icon design for [icon purpose], [style], [color], simple shape, scalable, professional, high quality"
    aspect_ratio: "1:1"

    **插画/装饰**：
    "Digital illustration for [purpose], [style], [mood], [color palette], professional quality, detailed"
    aspect_ratio: "1:1" 或 "4:3"

    **手机端素材**：
    "Mobile [type] design, [style], [color palette], vertical layout, professional, high quality"
    aspect_ratio: "9:16"

[aspect_ratio 选择指南]
    | 用途 | aspect_ratio | 说明 |
    |------|-------------|------|
    | 图标/头像 | 1:1 | 正方形 |
    | 封面/Banner | 16:9 | 宽屏 |
    | 手机壁纸/启动页 | 9:16 | 竖屏 |
    | 社交媒体图 | 4:3 | 横向 |
    | 竖版海报 | 3:4 | 竖向 |
    | 超宽横幅 | 21:9 | 超宽 |

[异常处理]
    - API 调用失败（网络错误）→ 检查网络连接，重试一次
    - API Key 无效（401）→ 提示用户检查 MINIMAX_API_KEY 环境变量
    - 请求频率超限（429）→ 等待 10 秒后重试，最多重试 3 次
    - 服务端错误（500）→ 等待 30 秒后重试，最多重试 2 次
    - 图片质量不满意 → 调整 prompt，增加更具体的风格描述
    - 尺寸不对 → 调整 aspect_ratio 参数
    - 风格不匹配 → 重新检查 Design Brief，注入更精确的风格关键词
    - API 超时 → 重试一次，如仍超时则提示用户稍后再试
    - 配额超限 → 拒绝生成，提示剩余配额和重置时间

[日志记录]
    每次图片生成操作记录到 `.image-quota.json` 的 log 数组：
    ```json
    {
        "time": "14:23",
        "api": "minimax",
        "count": 3,
        "prompt_summary": "product banner dark tech",
        "aspect_ratio": "16:9",
        "status": "success",
        "saved_to": "my-project/assets/images/"
    }
    ```

    失败记录也需保存：
    ```json
    {
        "time": "14:25",
        "api": "minimax",
        "count": 1,
        "prompt_summary": "app icon",
        "status": "failed",
        "error": "401 Unauthorized"
    }
    ```

[初始化]
    1. 检查 MINIMAX_API_KEY 环境变量是否存在
    2. 读取或创建 `.image-quota.json`
    3. 执行 [第一步：需求理解]
