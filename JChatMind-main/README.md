# JChatMind Agent 工程说明

本目录是 InsightMesh Agent 的核心 Agent 工程，基于 JChatMind 代码整理，用于开放式能力测评中的“企业知识库混合检索 Agent”。

## 工程结构

```text
JChatMind-main/
├─ jchatmind/   # Spring Boot Agent 后端
├─ ui/          # React + Ant Design 前端
├─ examples/    # 示例页面
└─ LICENSE
```

## 后端能力

- Agent Think-Execute Loop。
- Agent 状态机：THINKING、EXECUTING、DONE、ERROR。
- 工具调用框架：知识库、数据库、文件系统、邮件、直接回答、终止工具。
- RAG 链路：Markdown 解析、文档切分、bge-m3 embedding、PostgreSQL + pgvector 相似度检索。
- 多模型支持：DeepSeek、智谱等 ChatClient 可扩展。
- SSE 状态推送：实时展示 Agent 执行过程。

## 前端能力

- Agent 创建与管理。
- 知识库创建与文档管理。
- 聊天会话与执行过程展示。
- 与后端 REST API 和 SSE 接口联动。

## 后端运行

准备：

- JDK 17。
- PostgreSQL。
- pgvector 扩展。
- Ollama embedding 服务，模型为 `bge-m3`。

```bash
cd jchatmind
./mvnw spring-boot:run
```

Windows：

```powershell
cd jchatmind
.\mvnw.cmd spring-boot:run
```

配置文件位于：

```text
jchatmind/src/main/resources/application.yaml
```

需要按本地环境修改数据库账号、模型 API Key 和邮件配置。

## 前端运行

```bash
cd ui
npm install
npm run dev
```

## 编译验证

后端：

```bash
cd jchatmind
.\mvnw.cmd -DskipTests compile
```

前端：

```bash
cd ui
npm run build
```

## 与本次测评的关系

本工程对应开放式能力测评，完整设计说明见：

```text
../docs/Agent设计说明.md
```

根目录 README 已将本工程、LoRA 微调流程文档和 Three.js 官网整合为统一提交作品。

