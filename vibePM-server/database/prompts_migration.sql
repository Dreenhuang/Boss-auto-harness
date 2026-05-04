-- 提示词管理表
CREATE TABLE IF NOT EXISTS prompt_templates (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT DEFAULT '',
  content TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'general',
  variables JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 插入默认提示词
INSERT INTO prompt_templates (key, name, description, content, category, variables) VALUES
('image_generation', '图片生成提示词', '用于MiniMax AI图片生成的默认提示词模板', '生成一张高质量的技术概念图，主题：{techName}。要求：现代扁平化设计风格，配色以红色(#FF2442)和白色为主，简洁明了，适合作为学习卡片的封面图。不要包含任何文字。', 'ai', '["techName"]'),

('content_summary', '内容摘要生成', '自动生成学习卡片摘要', '请为以下技术内容生成一段简洁的摘要（100字以内），适合小白用户理解：\n\n{content}\n\n要求：用通俗易懂的语言，突出核心概念。', 'ai', '["content"]'),

('learning_path_guide', '学习路径引导', '为用户生成个性化学习建议', '用户当前水平：{level}\n学习目标：{goals}\n\n请生成一段个性化的学习路径引导语，鼓励用户坚持学习。', 'ai', '["level", "goals"]'),

('welcome_message', '欢迎消息', '新用户注册后的欢迎消息', '欢迎加入Vibe PM！\n\n我们为你准备了{pathCount}条精选学习路径，涵盖产品经理、前端开发、AI工具等热门领域。\n\n点击"开始学习"，开启你的技术成长之旅！', 'system', '["pathCount"]'),

('daily_tip', '每日学习提示', '每日推送的学习小贴士', '今日学习小贴士：\n\n{tip}\n\n坚持学习，每天进步一点点！', 'system', '["tip"]')

ON CONFLICT (key) DO NOTHING;

CREATE TRIGGER prompts_updated_at BEFORE UPDATE ON prompt_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at();
