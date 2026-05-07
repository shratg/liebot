# 🔧 本地配置和 Vercel 部署完整指南

## 1️⃣ **本地配置 - API 密钥和模型设置**

### 在本地开发中配置 API

#### **方式 1️⃣ : 通过 Settings 界面（推荐）** ✅

这是最简单的方法，无需修改代码：

1. **启动开发服务器**
   ```bash
   npm run dev
   ```

2. **打开应用**
   - 访问 `http://localhost:3002/` 或显示的地址

3. **进入 Settings（设置）页面**
   - 点击右侧导航栏的"设置"选项
   
4. **配置三个字段**
   
   | 字段 | 值 | 获取方式 |
   |------|-----|---------|
   | **AI 提供商** | 硅基流动 (SiliconFlow) | 自动 |
   | **模型名称** | `deepseek-ai/DeepSeek-V4-Flash` | 自动 |
   | **API 端点** | `https://api.siliconflow.cn/v1/chat/completions` | 自动 |
   | **API Key** | `sk-xxxxx...` | 从硅基流动获取 |

5. **获取 API 密钥的步骤**
   - 访问 [硅基流动官网](https://www.siliconflow.cn/)
   - 点击"登录/注册"
   - 进入个人账户
   - 左侧菜单 → "API Keys" 或 [直接访问](https://www.siliconflow.cn/account/api-keys)
   - 点击"Create New Key"或"创建密钥"
   - 复制生成的密钥

6. **粘贴密钥并保存**
   - 在 Settings 中的"API Key"字段粘贴密钥
   - 点击"保存配置"按钮
   - 看到"✅ API 密钥已配置"表示成功

7. **验证配置成功**
   - 打开浏览器开发者工具（F12）
   - 切换到 Console 标签
   - 返回"检测"页面，点击"AI深度测谎分析"
   - 如果看到以下日志说明成功：
     ```
     ✅ 使用用户配置的 API 密钥，直接调用硅基流动 API
     ✅ 正在调用硅基流动 API... https://api.siliconflow.cn/v1/chat/completions
     ✅ 硅基流动 API 响应: {...}
     ```

#### **方式 2️⃣ : 环境变量配置**

如果您想要在本地开发时使用环境变量（可选）：

1. **创建 `.env.local` 文件**
   ```bash
   cd d:\Edge-download\LieBot-detector-main\ (1)\\LieBot-detector-main
   echo "VITE_SILICONFLOW_API_KEY=sk-your-key-here" > .env.local
   ```

2. **或直接用文本编辑器**
   - 在项目根目录创建 `.env.local` 文件
   - 内容如下：
   ```env
   VITE_SILICONFLOW_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. **注意**：`.env.local` 会被 git 忽略，不会上传到仓库

### 📍 代码中的关键配置位置

如果您想了解代码如何处理配置：

| 功能 | 文件位置 | 说明 |
|------|--------|------|
| **API 密钥管理** | `services/siliconflow.ts` | 从 localStorage 读取密钥 |
| **Settings 界面** | `components/Settings.tsx` | 用户输入密钥的地方 |
| **API 调用逻辑** | `services/siliconflow.ts` (第 20-100 行) | 直接调用硅基流动 API |
| **响应解析** | `services/siliconflow.ts` (第 85-110 行) | JSON 提取和验证 |

### 🔍 本地调试技巧

**打开浏览器控制台查看详细日志**：

```javascript
// 查看保存的 API 密钥是否存在
console.log(localStorage.getItem('siliconflow_api_key'))

// 查看 Network 标签
// 搜索 "siliconflow.cn" 可以看到 API 请求
// 查看请求头中是否有 Authorization
```

---

## 2️⃣ **Vercel 部署 - 详细步骤**

### 前置条件

- ✅ 代码已推送到 GitHub
- ✅ 硅基流动 API 密钥已获取
- ✅ 有 Vercel 账户（可用 GitHub 登录）

### 🚀 部署步骤

#### **步骤 1: 准备 GitHub 仓库**

```bash
# 1. 初始化 git（如果还没有）
git init

# 2. 添加所有文件
git add .

# 3. 提交代码
git commit -m "Add LieBot detector with SiliconFlow API integration"

# 4. 添加远程仓库（替换 your-username 和 your-repo）
git remote add origin https://github.com/your-username/your-repo.git

# 5. 推送到 GitHub
git branch -M main
git push -u origin main
```

#### **步骤 2: 在 Vercel 创建项目**

1. **访问 Vercel**
   - 打开 [vercel.com](https://vercel.com)
   - 用 GitHub 账号登录（或注册）

2. **新建项目**
   - 点击 "Add New" → "Project"
   - 或直接点击 "New Project"

3. **导入 GitHub 仓库**
   - 在"Import Git Repository"中搜索您的仓库名
   - 选择您刚才推送的仓库
   - 点击 "Import"

#### **步骤 3: 配置构建设置**

默认 Vercel 应该已经正确识别 Vite 项目，但请确认：

- **Project Name**: 自动填充，可以修改
- **Framework**: 应该显示 "Vite"
- **Build Command**: `npm run build` ✓
- **Output Directory**: `dist` ✓
- **Install Command**: `npm install` ✓

如果都正确，点击 "Deploy" 进行初次部署。

#### **步骤 4: 添加环境变量（重要！）**

1. **部署完成后进入项目设置**
   - 在 Vercel Dashboard 中选择您的项目
   - 点击 "Settings" 标签

2. **进入环境变量配置**
   - 左侧菜单 → "Environment Variables"
   - 或直接访问: `https://vercel.com/dashboard/[project-name]/settings/environment-variables`

3. **添加环境变量**
   
   | 变量名 | 值 | 说明 |
   |-------|-----|------|
   | `SILICONFLOW_API_KEY` | `sk-xxxxx...` | 硅基流动 API 密钥 |
   
   - **Name**: `SILICONFLOW_API_KEY`
   - **Value**: 粘贴您的硅基流动 API 密钥
   - **Environment**: 选择 `Production` 和 `Preview`（两个都选）
   - 点击 "Save"

4. **重新部署应用**
   
   由于您添加了新的环境变量，需要重新部署：
   
   - 回到 "Deployments" 标签
   - 找到最新的部署
   - 点击右边的三个点 "..."
   - 选择 "Redeploy"
   
   或者推送新的提交到 GitHub：
   ```bash
   git commit --allow-empty -m "Trigger redeploy with env vars"
   git push
   ```

#### **步骤 5: 验证部署**

1. **部署完成**
   - 等待部署完成（通常 1-2 分钟）
   - 看到"✓ Domains Production"表示成功

2. **访问您的应用**
   - 点击显示的 URL（如 `https://your-project.vercel.app`）
   - 或在 "Deployments" 中点击 URL

3. **测试 API 调用**
   - 打开应用
   - 进入"检测"页面
   - 选择一个案例
   - 点击"AI深度测谎分析"
   - 应该看到真实的硅基流动 API 分析结果

4. **查看服务器日志**
   - 在 Vercel Dashboard → "Deployments" 中选择最新部署
   - 点击 "Logs" 查看实时日志
   - 可以看到 API 调用和响应信息

### 🔗 Vercel 中的关键文件

| 文件 | 位置 | 作用 |
|------|------|------|
| **API 端点** | `/api/analyze.ts` | Vercel 自动部署为 `/api/analyze` |
| **构建配置** | `vite.config.ts` | Vite 构建配置 |
| **Vercel 配置** | `vercel.json` | Vercel 专有配置 |
| **项目配置** | `package.json` | 依赖和脚本 |

---

## 📊 对比总结

### 本地开发 vs Vercel 生产

| 方面 | 本地开发 | Vercel 生产 |
|------|---------|----------|
| **API 调用方式** | 用户输入密钥 → 直接调用硅基流动 | `/api/analyze` → 环境变量 → 硅基流动 |
| **密钥存储** | localStorage（浏览器本地） | 环境变量（Vercel 服务器）|
| **访问方式** | `http://localhost:3002/` | `https://your-project.vercel.app` |
| **密钥安全** | ⚠️ 用户自行管理 | ✅ 服务器端保护 |
| **配置修改** | Settings UI | Vercel Dashboard |

### API 密钥选项

#### 选项 1: 推荐 ⭐⭐⭐
```
本地: Settings UI 输入密钥
生产: Vercel 环境变量存储
```

#### 选项 2: 使用环境文件
```
本地: .env.local 文件
生产: Vercel 环境变量
```

---

## ❓ 常见问题

### Q: 本地修改代码后如何看到效果？
**A:** 保存文件后，Vite 会自动热更新。如果没有自动刷新，按 Ctrl+Shift+R 强制刷新。

### Q: 如何在 Vercel 上更改 API 密钥？
**A:** 
1. Vercel Dashboard → 您的项目
2. Settings → Environment Variables
3. 找到 `SILICONFLOW_API_KEY` → 点击编辑
4. 修改值并保存
5. 项目会自动重新部署

### Q: 部署后提示 API 密钥无效？
**A:** 
- 检查密钥是否复制正确（没有多余空格）
- 确保环境变量已保存
- 检查是否选择了 "Production" 环境
- 可能需要重新部署（"Redeploy"）

### Q: 生产环境如何调试 API 问题？
**A:**
1. Vercel Dashboard → Deployments → 最新部署
2. 点击 "Logs" 查看实时日志
3. 看 `/api/analyze` 的请求和响应

### Q: 想要更换模型怎么办？
**A:** 修改代码中的模型名称
- **本地**：不支持 UI 修改，需要编辑代码
- **代码位置**：`services/siliconflow.ts` 第 45 行
- 修改：`model: 'deepseek-ai/DeepSeek-V4-Flash'`
- 其他可用模型见硅基流动文档

### Q: 如何查看 API 的实时调用记录？
**A:**
- **本地**：浏览器 Network 标签
- **生产**：Vercel Logs 或硅基流动后台

---

## 🔐 安全建议

1. **永远不要提交 API 密钥到 Git**
   - `.env.local` 已在 `.gitignore` 中
   - 确保不要手动提交 `.env.local`

2. **Vercel 环境变量会被隐藏**
   - Vercel 不会在日志中显示密钥值
   - 但要避免在调用中 log 密钥

3. **定期轮换密钥**
   - 建议每个月更换一次
   - 硅基流动 Dashboard 可以生成新密钥

---

## 📞 快速参考

### 本地配置
```bash
# 1. 启动开发服务
npm run dev

# 2. 打开 Settings 输入密钥
# 3. 点击"保存配置"

# 完成！
```

### Vercel 部署
```bash
# 1. 推送到 GitHub
git push origin main

# 2. Vercel 自动部署（1-2 分钟）

# 3. Settings → Environment Variables
#    添加: SILICONFLOW_API_KEY=sk-xxx

# 4. Redeploy 应用

# 完成！
```

---

这就是全部配置和部署步骤！有任何问题随时问我 🚀
