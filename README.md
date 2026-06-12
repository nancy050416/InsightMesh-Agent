# InsightMesh Agent

企业知识库混合检索 Agent 作品包，面向招聘测评提交。项目围绕“企业内部知识检索、任务规划与可解释问答”场景，将现有 Agent 工程改造成一个完整的提交作品，并补齐 LoRA 微调流程文档与 Three.js 沉浸式产品官网。

## 提交内容

| 测评项 | 对应目录 | 交付物 |
| --- | --- | --- |
| 规范式能力测评 | `docs/LoRA微调全流程.md` | 标准化 LoRA 微调全流程 Markdown 文档 |
| 应用式能力测评 | `web-3d/` | Three.js 沉浸式 3D 多页面公司官网源码，包含公司介绍、解决方案、客户场景、技术架构和联系方式 |
| 开放式能力测评 | `JChatMind-main/` + `docs/Agent设计说明.md` | 企业知识库混合检索 Agent 源码与设计说明 |

## 项目定位

InsightMesh Agent 解决企业内部“资料散、检索慢、答案不可追溯”的问题。系统将文档知识库、向量检索、关键词检索、工具调用和 Agent Loop 组合起来，让用户可以用自然语言完成以下任务：

- 查询制度、技术文档、项目资料，并返回引用来源。
- 让 Agent 拆解复杂问题，自动决定是否调用知识库、文件、数据库或邮件工具。
- 对多轮执行过程进行实时可视化，避免黑盒等待。
- 支持后续接入领域微调模型，提升企业术语、流程和问答风格的一致性。

## 核心能力

- **Agent Loop**：基于 Thinking / Executing / Done / Error 状态机进行多步规划与工具执行。
- **工具调用框架**：将数据库、文件系统、邮件、知识库、直接回答等能力抽象为可扩展工具。
- **RAG 检索链路**：Markdown 文档解析、切块、Embedding、pgvector 相似度检索、答案生成。
- **混合检索方案**：设计层面补充关键词召回 + 向量召回 + RRF 融合 + rerank + 引用输出。
- **多模型架构**：通过 ChatClientRegistry 管理不同模型客户端，便于切换 DeepSeek、智谱等模型。
- **实时反馈**：通过 SSE 将 Agent 执行状态推送到前端。

## 目录说明

```text
.
├─ README.md
├─ docs/
│  ├─ Agent设计说明.md
│  ├─ LoRA微调全流程.md
│  ├─ Three.js官网设计说明.md
│  └─ 提交邮件模板.md
├─ web-3d/
│  ├─ src/
│  ├─ index.html
│  ├─ package.json
│  └─ README.md
└─ JChatMind-main/
   ├─ jchatmind/      # Spring Boot Agent 后端
   ├─ ui/             # React 管理界面
   ├─ examples/
   ├─ LICENSE
   └─ README.md       # 原始项目说明，仅作来源保留
```

## 快速运行

## 在线演示

Three.js 沉浸式 3D 多页面公司官网已部署为 GitHub Pages：

```text
https://nancy050416.github.io/InsightMesh-Agent/
```

说明：该在线演示对应“应用式能力测评”，用于让评审直接浏览公司官网效果。官网包含首页、公司、方案、案例、技术和联系页面，按钮会进入独立页面。Agent 后端涉及数据库、模型 API Key、Ollama embedding 服务和邮件配置，出于成本与安全考虑不直接部署公网服务，完整源码、架构和本地运行方式已在仓库中提供。

### 1. 运行 3D 官网

```bash
cd web-3d
npm install
npm run dev
```

默认访问 `http://localhost:5173`。

### 2. 运行 Agent 后端

准备 PostgreSQL、pgvector 与 Ollama embedding 服务：

```bash
ollama pull bge-m3
ollama serve
```

修改 `JChatMind-main/jchatmind/src/main/resources/application.yaml` 中的数据库、模型和 API Key 配置，然后执行：

```bash
cd JChatMind-main/jchatmind
./mvnw spring-boot:run
```

Windows 可使用：

```powershell
.\mvnw.cmd spring-boot:run
```

### 3. 运行 Agent 前端

```bash
cd JChatMind-main/ui
npm install
npm run dev
```

## 评审亮点

- **创新**：将 Agent Loop、RAG、混合检索、SSE 可视化、领域 LoRA 方案组合成一个可落地的企业知识检索产品。
- **规范**：README、设计文档、LoRA 文档、官网设计说明和运行说明完整，便于复现和评审。
- **简洁**：提交结构按三项测评拆分，评委可以快速定位每个交付物。
- **注释**：关键工程模块保留必要说明，官网代码对核心 3D 场景和交互逻辑有注释。

## 来源与改造说明

Agent 工程基于 `JChatMind-main.zip` 中的 JChatMind 项目进行作品化整理。当前提交保留原 `LICENSE` 与原始 README，新增本仓库根 README、测评文档、产品化场景说明和 Three.js 官网。提交时建议说明“基于 JChatMind 进行企业知识库混合检索场景改造”，避免被误解为完全从零原创。
