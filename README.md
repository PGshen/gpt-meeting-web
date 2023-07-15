<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2023-04-29 22:27:47
 * @LastEditTime: 2023-07-15 21:56:13
-->
# gpt-meeting-web
## 零、是干嘛的
1. 这是一个基于GPT的API开发的小项目。众所周知目前GPT的上下文支持就是每次把历史消息都再次发出去，方法很「简单粗暴」，而这个项目简单的说就只做了一件事：就是让上下文组织更灵活，以支持完成更加复杂一些的任务。
2. 项目最初的灵感来源是「头脑风暴」和「6顶思考帽」。头脑风暴在进行的过程中，每个环节关注的重点不同，需要不同的角色发挥作用，这一过程正好是和6顶思考帽的使用契合的。6顶思考帽的灵活配合使用可以达成不同的目的，再延伸之后就有了这个项目「会议meeting」或者叫讨论会。
3. 基于以上，项目最主要实现以下3个功能
   1. 任务流程图的编排，每个环节完成一件事，串起来完成一项相对复杂的任务（也理解为会议议程设计）。
   2. 让GPT自问自答，完成联想。
   3. 让GPT分别扮演不同的角色，对同一个话题进行讨论。
4. 可能的应用场景
   1. 头脑风暴
   2. 快速联想
   3. 快速评估
   4. 多角色对话
  
> 其他介绍请参考后端项目：[gpt-meeting-service](https://github.com/PGshen/gpt-meeting-service)

# 开发相关
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