<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2023-04-29 22:27:47
 * @LastEditTime: 2023-07-15 20:56:21
-->
## 技术选型
- 语言：TypeScript
- 构建工具：vite
- 框架：vue3
- UI： element-plus
- 状态管理: Pinia
- 路由：vue-router
- SSE： microsoft/fetch-event-source
- 模版编排：antv X6
- 图：antv G6

## 建议环境
- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## 跑起来
```
# 如果服务端也在本地，需要本地hosts添加如下记录，或者修改vite.config.js文件里的proxy配置
127.0.0.1	gpt-meeting-service

# 依赖安装
pnpm install

# 本地运行
pnpm run dev

# 打包
pnpm run build
```

## docker镜像构建
```
docker build -t gpt-meeting-web:v1 .
```