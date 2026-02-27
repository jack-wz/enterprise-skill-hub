# Enterprise Skill Hub 部署指南

## 📋 前置要求

- Node.js >= 18.0.0
- npm 或 pnpm
- SQLite3

## 🚀 快速部署

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 服务器配置
PORT=3000
NODE_ENV=production

# 日志配置
LOG_LEVEL=info

# LLM Provider Keys（按需配置）
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
GOOGLE_API_KEY=

# 数据库配置
DATABASE_PATH=./data/skill-hub.db
```

### 3. 构建项目

```bash
npm run build
```

### 4. 启动服务

**开发模式:**
```bash
npm run dev
```

**生产模式:**
```bash
npm start
```

### 5. 验证安装

```bash
curl http://localhost:3000/health
```

预期响应:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-27T12:00:00.000Z",
  "uptime": 123.456,
  "version": "3.0.0"
}
```

## 🔧 Docker 部署（可选）

```bash
docker build -t enterprise-skill-hub .
docker run -d -p 3000:3000 -v ./data:/app/data enterprise-skill-hub
```

## 📊 监控

- 健康检查：`GET /health`
- 日志文件：`logs/combined.log`
- 错误日志：`logs/error.log`

## 🔐 安全建议

1. 生产环境设置 `NODE_ENV=production`
2. 使用反向代理（Nginx/Caddy）
3. 配置 HTTPS
4. 定期备份数据库
5. 限制 API 访问频率

## 📝 故障排除

### 端口被占用

```bash
lsof -i :3000
kill -9 <PID>
```

### 依赖安装失败

```bash
rm -rf node_modules package-lock.json
npm install
```

### 数据库错误

```bash
rm ./data/skill-hub.db
npm start
```

## 📞 支持

- GitHub Issues: https://github.com/jack-wz/enterprise-skill-hub/issues
- 文档：https://github.com/jack-wz/enterprise-skill-hub/docs
