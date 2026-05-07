# 🚀 硅基流动 API 集成 - 快速入门

## ✅ 已完成的集成

您的 LieBot 项目现已完整支持硅基流动 API：

### 1. **API 端点实现** 
- ✅ [api/analyze.ts](../api/analyze.ts) - Vercel serverless 函数
- ✅ 支持硅基流动 OpenAI 兼容 API
- ✅ 模型：`deepseek-ai/DeepSeek-V4-Flash`
- ✅ JSON 响应自动解析和验证
- ✅ 错误自动降级到本地分析

### 2. **前端服务优化**
- ✅ [services/siliconflow.ts](../services/siliconflow.ts) - API 调用服务
- ✅ 60 秒超时控制
- ✅ 自动错误处理和降级
- ✅ localStorage 密钥管理

### 3. **用户界面完善**
- ✅ [components/Settings.tsx](../components/Settings.tsx) - 配置面板
- ✅ API 密钥输入和存储
- ✅ 连接状态显示
- ✅ 本地存储提示

### 4. **Vercel 部署准备**
- ✅ [vercel.json](../vercel.json) - Vercel 配置
- ✅ [api/analyze.ts](../api/analyze.ts) - 服务端函数
- ✅ [@vercel/node](../package.json) - 依赖已添加

---

## 🔧 本地运行步骤

### 1️⃣ 安装依赖
```bash
npm install
```

### 2️⃣ 启动开发服务
```bash
npm run dev
```

应用将在 `http://localhost:3002/` 启动（端口可能因占用而变化）

### 3️⃣ 配置 API 密钥

#### 获取硅基流动 API 密钥：
1. 访问 [硅基流动官网](https://www.siliconflow.cn/)
2. 注册或登录账户
3. 进入 [API 密钥管理](https://www.siliconflow.cn/account/api-keys)
4. 点击"创建密钥"
5. 复制 API 密钥

#### 在应用中配置：
1. 打开应用，点击右侧"设置"菜单
2. 在"API Key"字段粘贴您的密钥
3. 点击"保存配置"按钮
4. 页面会显示"API 密钥已配置"✅

### 4️⃣ 测试分析功能
1. 返回"检测"页面
2. 从案例中选择一个或自己输入聊天内容
3. 点击"AI深度测谎分析"按钮
4. 等待结果（应该调用真实的硅基流动 API）

---

## 🌐 Vercel 部署步骤

### 前置条件
- 代码已推送到 GitHub
- 硅基流动 API 密钥已获取

### 部署流程

#### 1️⃣ 连接 Vercel
1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 账户登录
3. 点击"New Project"
4. 选择您的 LieBot 仓库
5. 点击"Import"

#### 2️⃣ 配置环境变量
在 Vercel 项目设置中：
1. 进入 "Settings" → "Environment Variables"
2. 添加新变量：
   - **名称**: `SILICONFLOW_API_KEY`
   - **值**: 您的 API 密钥
3. 点击"Save"

#### 3️⃣ 配置构建设置
- **Build Command**: `npm run build` ✓（已默认）
- **Output Directory**: `dist` ✓（已默认）
- **Install Command**: `npm install` ✓（已默认）

#### 4️⃣ 部署
点击"Deploy"按钮，Vercel 会自动：
1. 安装依赖
2. 构建应用
3. 部署 API 函数和前端代码
4. 生成您的应用 URL

部署完成后，您的应用将在公网上正常运行，并调用真实的硅基流动 API。

---

## 🧪 测试 API 连接

### 本地测试
```bash
# 浏览器控制台测试
fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: ['用户: 我是一个反诈专家', '对方: 你能帮我分析诈骗吗?']
  })
}).then(r => r.json()).then(console.log)
```

### 生产测试
- 访问您的 Vercel 应用 URL
- 完整测试检测和分析功能

---

## ⚠️ 常见问题

### Q: API 密钥在哪里保存？
**A:** 
- **本地开发**: 存储在浏览器 localStorage（安全）
- **Vercel 生产**: 存储在 Vercel 环境变量（服务端，不暴露）

### Q: 无法连接硅基流动 API？
**A:** 检查以下几点：
- ✓ API 密钥是否正确复制
- ✓ 硅基流动账户是否有足够的额度
- ✓ 网络连接是否正常
- ✓ API 端点是否可达：https://api.siliconflow.cn/

### Q: API 调用失败会怎样？
**A:** 自动降级到本地模拟分析，用户可以继续使用应用

### Q: 如何查看 API 调用日志？
**A:** 
- **本地**: 浏览器开发者工具 → Network 标签
- **Vercel**: Vercel Dashboard → Deployments → Logs

---

## 📊 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                    浏览器前端                             │
│  ┌──────────────────────────────────────────────────┐   │
│  │         React + TypeScript                       │   │
│  │  • DetectionWorkspace: 聊天分析界面              │   │
│  │  • Settings: API 密钥配置                        │   │
│  │  • siliconFlowService: API 调用                  │   │
│  └──────────────────────────────────────────────────┘   │
│                        ↓                                  │
│                   fetch('/api/analyze')                  │
└─────────────────────────────────────────────────────────┘
                         ↓
        ┌────────────────────────────────┐
        │      Vercel Serverless         │
        │    ┌──────────────────────┐    │
        │    │  api/analyze.ts      │    │
        │    │  ✓ CORS 处理         │    │
        │    │  ✓ 环境变量获取      │    │
        │    │  ✓ 请求转发          │    │
        │    │  ✓ 响应解析          │    │
        │    └──────────────────────┘    │
        └────────────────────────────────┘
                         ↓
        ┌────────────────────────────────┐
        │      硅基流动 API               │
        │  https://api.siliconflow.cn    │
        │  Model: DeepSeek-V4-Flash      │
        │  ✓ 文本分析                    │
        │  ✓ 风险评分                    │
        │  ✓ JSON 响应                   │
        └────────────────────────────────┘
```

---

## 📝 文件清单

已修改/创建的文件：
- ✅ [api/analyze.ts](../api/analyze.ts) - API 端点
- ✅ [services/siliconflow.ts](../services/siliconflow.ts) - 服务
- ✅ [components/Settings.tsx](../components/Settings.tsx) - 配置 UI
- ✅ [package.json](../package.json) - 依赖更新
- ✅ [vercel.json](../vercel.json) - Vercel 配置
- ✅ [.env.example](../.env.example) - 环境变量示例
- ✅ [README.md](../README.md) - 项目文档

---

## 🎯 下一步

1. **本地测试** ← 现在就可以做
   - 输入 API 密钥
   - 测试分析功能

2. **部署到 Vercel** ← 推荐
   - GitHub 推送代码
   - 连接 Vercel
   - 设置环境变量

3. **分享应用**
   - 获得公网 URL
   - 分享给用户

---

## 📞 支持

遇到问题？
- 检查浏览器控制台错误消息
- 查看 Vercel 部署日志
- 验证 API 密钥是否有效
- 确保硅基流动账户有余额

祝您使用愉快！🎉
