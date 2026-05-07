# Run and deploy your AI Studio app

![GHBanner](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

This contains everything you need to run your app locally.

View your app in AI Studio: [open in AI Studio](https://ai.studio/apps/drive/19leIl_NfW_XwW4TpZ7j_ClQ7ycNzVxGH)

## 快速开始

### 本地运行（开发模式）

**前置要求**：Node.js

1. 安装依赖：
   ```bash
   npm install
   ```

2. 运行开发服务器：
   ```bash
   npm run dev
   ```

3. **配置 API 密钥（可选）**：
   - 打开应用 → 点击右侧"设置"菜单
   - 从 [硅基流动控制台](https://www.siliconflow.cn/account/api-keys) 获取 API 密钥
   - 在"API Key"字段粘贴密钥
   - 点击"保存配置"按钮

**注意**：如果不配置 API 密钥，应用将使用本地模拟数据进行分析，仍可正常预览所有功能。

### 部署到 Vercel（生产环境）

1. 推送代码到 GitHub：
   ```bash
   git push origin main
   ```

2. 打开 [Vercel](https://vercel.com) 并导入此仓库作为新项目

3. 在 Vercel 项目设置中添加环境变量：
   ```
   SILICONFLOW_API_KEY=<your_siliconflow_api_key>
   ```

4. 构建设置保持默认：
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. 点击"Deploy"部署项目

部署完成后，用户访问您的应用时将使用真实的硅基流动 AI 模型进行分析。

## 环境变量配置

### 本地开发（可选）

创建 `.env.local` 文件（git 会忽略此文件）：

```env
VITE_SILICONFLOW_API_KEY=sk-xxxxxxxxxxxxx
```

### Vercel 部署（必须）

在 Vercel 项目设置中设置环境变量：

- `SILICONFLOW_API_KEY`: 硅基流动 API 密钥

从 [硅基流动控制台](https://www.siliconflow.cn/account/api-keys) 获取 API 密钥。

## 技术栈

- **前端框架**: React 19 + TypeScript
- **UI 库**: Tailwind CSS + Recharts
- **构建工具**: Vite 6
- **后端**: Vercel Serverless Functions
- **AI 模型**: 硅基流动 - DeepSeek-V4-Flash

## 项目结构

```
├── src/
│   ├── components/       # React 组件
│   ├── services/         # API 服务
│   ├── App.tsx          # 主应用
│   └── types.ts         # TypeScript 类型定义
├── api/
│   └── analyze.ts       # Vercel API 端点
├── dist/                # 构建输出
└── vercel.json         # Vercel 配置
```

## 常见问题

### Q: 怎样获取硅基流动 API 密钥？
A: 访问 [硅基流动官网](https://www.siliconflow.cn/) → 注册登录 → 进入 [API 密钥管理](https://www.siliconflow.cn/account/api-keys) → 创建新的 API 密钥

### Q: 本地调试时如何测试真实 API？
A: 在"设置"页面输入您的 API 密钥后，应用会使用真实的硅基流动 API 进行分析

### Q: API 调用失败怎么办？
A: 应用会自动回退到本地模拟分析。检查：
- API 密钥是否正确
- 网络连接是否正常
- API 请求是否超时（超过 60 秒）
