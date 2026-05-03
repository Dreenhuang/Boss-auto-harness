const PROMPTS = {
  react: {
    prompt: 'React logo with blue circular atom icon, modern minimalist design, gradient background from blue to cyan, clean UI elements floating around, abstract technology concept, high quality digital illustration',
    tags: ['frontend', 'javascript', 'library', 'component'],
    applicableCards: ['React基础', 'JSX语法', 'Hooks详解', '状态管理']
  },
  vue: {
    prompt: 'Vue.js logo with green V shape emblem, modern web development interface, gradient green to teal background, component tree visualization, clean code editor aesthetic, professional tech illustration',
    tags: ['frontend', 'javascript', 'framework', 'progressive'],
    applicableCards: ['Vue3入门', 'Composition API', '响应式原理', '组件通信']
  },
  python: {
    prompt: 'Python programming language symbol with blue and yellow snake logo, data science visualization background, code snippets floating, modern tech aesthetic, clean minimal design, professional illustration',
    tags: ['backend', 'language', 'data-science', 'ai'],
    applicableCards: ['Python基础', 'Django框架', '数据分析', '自动化脚本']
  },
  docker: {
    prompt: 'Docker container ship logo with blue whale mascot, microservices architecture visualization, container boxes stacking, cloud infrastructure background, modern DevOps concept, clean tech illustration',
    tags: ['devops', 'container', 'deployment', 'cloud'],
    applicableCards: ['Docker入门', '容器化部署', 'Docker Compose', '镜像管理']
  },
  api: {
    prompt: 'API connection concept with network nodes, RESTful architecture diagram, JSON data flowing between client server, modern interface design, blue purple gradient background, abstract tech visualization',
    tags: ['backend', 'protocol', 'integration', 'microservice'],
    applicableCards: ['API基础', 'RESTful设计', '接口调试', '第三方集成']
  },
  database: {
    prompt: 'Database management system concept with table structures, SQL query visualization, data storage icons, modern server room aesthetic, blue technology theme, clean information architecture illustration',
    tags: ['backend', 'storage', 'sql', 'data'],
    applicableCards: ['MySQL入门', '数据库设计', '查询优化', 'NoSQL对比']
  },
  cloud: {
    prompt: 'Cloud computing concept with AWS Azure style servers, scalable infrastructure, data centers in clouds, modern SaaS platform visualization, gradient sky blue background, futuristic tech illustration',
    tags: ['infrastructure', 'scalability', 'saas', 'deployment'],
    applicableCards: ['云计算基础', 'AWS入门', '服务器选择', '成本优化']
  },
  ai: {
    prompt: 'Artificial intelligence concept with neural network visualization, brain circuit patterns, machine learning algorithms, deep learning layers, futuristic purple blue gradient, modern AI technology illustration',
    tags: ['ai', 'machine-learning', 'automation', 'future'],
    applicableCards: ['AI基础', 'Prompt工程', 'ChatGPT应用', 'AI产品经理']
  }
}

export function getPromptForTech(techName) {
  const key = techName.toLowerCase().trim()
  if (PROMPTS[key]) return PROMPTS[key]

  return {
    prompt: `${techName} technology concept, modern minimalist design, professional digital illustration, gradient background, clean tech aesthetic, abstract visualization`,
    tags: [techName.toLowerCase(), 'technology'],
    applicableCards: [techName]
  }
}

export function calculateSimilarity(cardTags, imageTags) {
  const cardSet = new Set(cardTags.map(t => t.toLowerCase()))
  const imageSet = new Set(imageTags.map(t => t.toLowerCase()))

  const intersection = [...cardSet].filter(t => imageSet.has(t)).length
  const union = new Set([...cardSet, ...imageSet]).size

  if (union === 0) return 0
  return intersection / union
}

export { PROMPTS }
