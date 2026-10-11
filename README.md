# 方块疾行网页版

这是一个纯静态网页游戏。玩家只需要打开网址即可游玩，不需要登录、下载客户端或安装插件。

## 项目结构

```text
zhi-2/
├─ outputs/                    最终网站目录，也是服务器上传目录
│  ├─ index.html               游戏页面、样式和游戏逻辑
│  └─ assets/
│     ├─ avatar.jpg            玩家头像
│     └─ game-over.jpg         游戏结束图片
├─ deploy/nginx/
│  └─ block-dash.conf          香港服务器 Nginx 配置模板
├─ .github/workflows/
│  └─ pages.yml                GitHub Pages 自动发布配置
├─ scripts/
│  ├─ check-site.mjs           发布前完整性检查
│  └─ serve-production.mjs     带生产安全头的本地预览
├─ .gitignore                  Git 排除规则
└─ README.md                   本说明
```

## 是否需要构建

不需要。

项目没有 npm 依赖，也没有 React、Vue 或打包工具。`outputs` 中已经是浏览器可以直接运行的最终文件。

如电脑安装了 Node.js，可以在项目根目录运行发布检查：

```bash
node scripts/check-site.mjs
```

需要按生产安全配置预览时，运行：

```bash
node scripts/serve-production.mjs
```

然后打开 `http://127.0.0.1:4174/`。按 `Ctrl+C` 可以停止预览。

## 上传到 GitHub 的文件

上传以下内容：

- `outputs/`
- `deploy/`
- `scripts/`
- `.gitignore`
- `README.md`

不要上传密码、服务器私钥、HTTPS 证书、`.env` 文件、缓存和依赖目录。`.gitignore` 已经排除了这些内容。

当前 GitHub 仓库：<https://github.com/wang3284675378-png/xiaowang-run>

当前公开试玩网址：<https://wang3284675378-png.github.io/xiaowang-run/>

`main` 分支每次有新提交时，GitHub Actions 会自动把 `outputs` 目录发布到试玩网址。

## GitHub 发布状态

项目已经上传到 `wang3284675378-png/xiaowang-run`，GitHub Pages 和 HTTPS 已启用。发布工作流只上传 `outputs`，不会把源码检查脚本或服务器配置暴露为网站文件。

## 部署到香港服务器

以后准备好香港服务器和域名后，按以下顺序操作：

1. 在服务器安装 Nginx。
2. 创建网站目录 `/var/www/block-dash`。
3. 把本地 `outputs` 目录里面的全部内容上传到 `/var/www/block-dash`。
4. 把 `deploy/nginx/block-dash.conf` 复制到服务器的 Nginx 网站配置目录。
5. 将配置中的 `game.example.com` 改成自己的域名。
6. 检查 Nginx 配置并重新加载 Nginx。
7. 在域名服务商处把域名解析到香港服务器 IP。
8. 使用服务器面板或受信任的证书工具为域名启用 HTTPS。
9. 用安卓、iPhone 和电脑分别打开正式网址测试。

不同服务器系统的 Nginx 配置目录可能不同。如果使用宝塔、1Panel 等服务器面板，可以直接新建“静态网站”，网站根目录选择 `/var/www/block-dash`，再上传 `outputs` 中的内容。

## 每次更新游戏

1. 先运行 `node scripts/check-site.mjs`。
2. 提交并推送到 GitHub 的 `main` 分支。
3. 等待仓库 Actions 页面中的 `Deploy GitHub Pages` 显示绿色成功状态。
4. 打开公开试玩网址并刷新检查。

如果使用普通 Git 克隆目录，更新命令为：

```bash
node scripts/check-site.mjs
git add .
git commit -m "更新游戏"
git push
```

正式迁移到香港服务器后，还需要把 `outputs` 中发生变化的文件同步到服务器网站目录。
