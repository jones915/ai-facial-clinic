# AI面诊系统 - 部署说明

## 已完成配置

### ✅ 通义千问 VL API
- API Key: 已配置
- 模型: qwen-vl-max

### ✅ 飞书多维表格
- App ID: cli_a937d98809389bd6
- App Secret: 已配置
- 多维表格: https://acnloq0see1t.feishu.cn/base/R1stb6avYalmCXsgiHPcE4C5nLe

---

## Vercel 环境变量配置

在 Vercel 项目设置中添加以下环境变量：

### 步骤：

1. 打开 https://vercel.com/dashboard
2. 选择 `ai-facial-clinic` 项目
3. 点击 **Settings** → **Environment Variables**
4. 添加以下变量：

| Name | Value |
|------|-------|
| `QWEN_API_KEY` | `sk-5935809bf5964498b3e4d3fbf03d70b7` |
| `FEISHU_APP_ID` | `cli_a937d98809389bd6` |
| `FEISHU_APP_SECRET` | `wu1ZKBcX5F3sSaQxjYHQwhv1rvC4LGcP` |
| `BITABLE_APP_TOKEN` | `R1stb6avYalmCXsgiHPcE4C5nLe` |

5. 点击 **Save**
6. 重新部署项目（Deployments → 点击最新部署 → Redeploy）

---

## 本地测试

```bash
# 进入项目目录
cd /workspace/projects/workspace/ai-facial-clinic

# 启动后端服务
cd server && node index.js

# 启动前端（另一个终端）
npm run dev
```

访问: http://localhost:5173

---

## 飞书应用权限配置

确保飞书应用已开通以下权限：

1. 打开 https://open.feishu.cn/app/cli_a937d98809389bd6
2. 进入「权限管理」
3. 添加以下权限：
   - `bitable:record` - 查看、评论、编辑和管理多维表格
   - `bitable:app:readonly` - 获取多维表格元数据
4. 发布应用版本

---

## API 端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/analyze` | POST | AI面诊分析 |
| `/api/health` | GET | 健康检查 |
| `/api/config` | GET | 获取配置信息 |
