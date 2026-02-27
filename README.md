# Enterprise Skill Hub 🦞

企业级 AI Agent 协作平台

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)

## 🌟 核心功能

- **📬 多会话收件箱** - 管理数百个并发 AI 会话
- **🧠 多 LLM 路由** - 支持 Anthropic/OpenAI/Google/Ollama/OpenRouter
- **🔄 事件驱动架构** - 自动触发工作流
- **📝 自动文档生成** - 会话记录和学习

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 健康检查
curl http://localhost:3000/health
```

## 📚 文档

- [部署指南](./DEPLOYMENT.md)
- [API 文档](./docs/API.md)
- [配置说明](./docs/CONFIG.md)

## 📦 技术栈

- **运行时**: Node.js 18+
- **语言**: TypeScript
- **Web 框架**: Express
- **数据库**: SQLite
- **验证**: Zod

## 📄 许可证

MIT License
