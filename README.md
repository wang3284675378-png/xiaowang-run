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

GitHub 建议只用来保存代码。正式给抖音粉丝访问的网址建议指向香港服务器，这样访问入口和源码仓库互相独立。

## 第一次保存到 GitHub

先在 GitHub 网站新建一个空仓库，再在本项目根目录执行下面的命令。把示例地址换成自己的仓库地址：

```bash
git init
git add .
git commit -m "发布方块疾行网页版"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

执行最后一条命令才会真正上传。本项目整理过程没有替你执行上传。

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
2. 将改动保存到 GitHub。
3. 重新上传 `outputs` 中发生变化的文件。
4. 清理浏览器或 CDN 缓存后检查正式网站。
