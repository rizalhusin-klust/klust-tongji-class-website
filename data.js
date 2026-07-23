// data.js - Course Agenda, Resources, Transcripts, and Translations

const courseData = {
  // Overall Course Meta
  courseTitleEn: "AI-Powered Pedagogy Masterclass",
  courseTitleZh: "AI 智能教学大师课",
  courseSubtitleEn: "Mastering NotebookLM, Gems & Canvas",
  courseSubtitleZh: "精通 NotebookLM、Gems 与 Canvas",
  
  // Instructors
  instructors: [
    {
      name: "Rizal Husin",
      roleEn: "Masterclass Facilitator, FABE KLUST",
      roleZh: "大师课主讲人, 建筑与生态环境学院 KLUST",
      avatar: "avatar.png",
      bioEn: "Specialist in AI-driven curriculum design, digital pedagogy integration, and agentic workflows in postgraduate education.",
      bioZh: "专注于 AI 驱动的课程设计、数字化教学整合以及研究生教育中的智能体工作流。"
    }
  ],

  // Agenda Sessions
  sessions: [
    {
      id: "session-1",
      tag: "Session 1",
      titleEn: "Introduction & Housekeeping: The AI Teaching Assistant Revolution",
      titleZh: "导言与会务说明：AI 助教革命",
      duration: 76, // seconds for testing convenience (normally 1200 / 20 mins)
      videoUrl: "https://docs.google.com/videos/d/1luM82AxzNOoRNMpXMxo7WOjk6zSNxJlG4PudVPC3998/play?usp=sharing",
      overviewEn: "Setting the stage for postgraduate students and future educators. This session covers a quick interactive poll on AI usage in lesson planning, followed by an overview of shifting from general chatbots to source-grounded and persona-based educational agents.",
      overviewZh: "为研究生及未来的教师奠定基础。本节内容包括关于教案设计中 AI 使用情况的快速互动投票，随后概述如何从通用聊天机器人转向来源扎实且基于特定角色的教育智能体。",
      resources: [
        { name: "Masterclass Slides (PDF)", url: "#", type: "pdf" },
        { name: "KLUST AI Education Guidelines", url: "https://klust.edu.my/", type: "link" }
      ],
      transcript: [
        { time: 0, textEn: "Hello everyone, and welcome to the KLUST-Tongji Masterclass on AI-Powered Pedagogy.", textZh: "大家好，欢迎来到 KLUST-同济 AI 智能教学大师课。" },
        { time: 5, textEn: "In this workshop, we will explore three key tools: NotebookLM, Gemini Gems, and Workspace Canvas.", textZh: "在本次工作坊中，我们将探索三个核心工具：NotebookLM、Gemini Gems 和 Workspace Canvas。" },
        { time: 11, textEn: "Our focus today is shifting from generic search engines to source-grounded learning aids.", textZh: "我们今天的重点是从通用的搜索引擎转向基于信源的辅助学习工具。" },
        { time: 17, textEn: "We want to build systems that act as co-teachers, helping us prepare courses and support students.", textZh: "我们希望构建能够充当“助教”的系统，帮助我们准备课程并支持学生。" },
        { time: 24, textEn: "Let us start by looking at how AI is transforming classrooms and reducing lesson planning workloads.", textZh: "让我们首先来看看 AI 如何变革课堂并减轻教案设计的负担。" },
        { time: 31, textEn: "Remember, the goal is not to replace human instruction, but to amplify its effectiveness.", textZh: "请记住，我们的目标不是取代人类教学，而是放大其效果。" },
        { time: 38, textEn: "We will check how personalized education can become scalable and highly interactive.", textZh: "我们将看看个性化教育如何实现规模化和高度互动。" },
        { time: 45, textEn: "Let's review the session roadmap and get ready for our hands-on labs.", textZh: "让我们一起来看一下课程路线图，为我们的动手实验做好准备。" },
        { time: 52, textEn: "I encourage you to participate in our live polls throughout this session. Let's begin!", textZh: "我鼓励大家在整个课程中积极参与我们的实时投票。让我们开始吧！" }
      ]
    },
    {
      id: "session-2",
      tag: "Session 2",
      titleEn: "Gemini Notebook (NotebookLM) & Source-Grounded AI",
      titleZh: "Gemini 笔记 (NotebookLM) 与信源扎实型 AI",
      duration: 71, // seconds matching the actual video length
      videoUrl: "https://drive.google.com/file/d/198FI9VuESg3u9muvx-ZZa5NkuvOY3zIh/view?usp=sharing",
      overviewEn: "Turn your graduate research papers and curriculum guidelines into an active co-teacher. This session guides participants through NotebookLM setup, source document uploading, literature synthesis, and creating interactive quizzes directly from source texts.",
      overviewZh: "将您的研究生研究论文和课程大纲转化为活跃的“合作教师”。本节将指导参与者进行 NotebookLM 设置、上传源文档、进行文献合成，并直接根据源文本创建互动测验。",
      resources: [
        { name: "NotebookLM Platform", url: "https://notebooklm.google.com/", type: "link" },
        { name: "Sample Syllabus PDF for Upload", url: "#", type: "file" },
        { name: "Audio Overview (Podcast) Guide", url: "#", type: "pdf" }
      ],
      transcript: [
        { time: 0, textEn: "Welcome to this video on implementing source-grounded pedagogy using NotebookLM. We will guide you through a structured, hands-on workflow for your practice exercise.", textZh: "欢迎收看这期关于使用 NotebookLM 实施基于信源教学法的视频。我们将引导您完成一个结构化的、亲自动手的实践练习工作流。" },
        { time: 8, textEn: "This session focuses on mastering an end-to-end studio workflow. You will gain experience in active document ingestion and generating reviews, moving from initial setup to verifying inline citations for reliable output.", textZh: "本节的重点是掌握端到端的工坊工作流。您将获得主动文档导入和生成评审的经验，从初始设置一直到验证行内引用以确保输出的可靠性。" },
        { time: 23, textEn: "Step 1 is to prepare your workspace. Begin by opening NotebookLM, creating a new dedicated notebook for your module, and uploading your syllabus and core reference PDFs.", textZh: "第一步是准备您的工作区。首先打开 NotebookLM，为您的模块创建一个新的专用笔记本，并上传您的教学大纲和核心参考 PDF。" },
        { time: 33, textEn: "In step 2, you will generate your study materials. Start by formulating prompts for specific learning outcomes, request a structural summary based on your sources, and finally, verify all citations to ensure accuracy.", textZh: "第二步，您将生成学习材料。首先针对特定的学习成果设计提示词，要求系统根据您的源材料生成结构化摘要，最后验证所有引用以确保准确性。" },
        { time: 47, textEn: "For step 3, we will engage in active practice. You will have a 10-minute timer for your tasks. Please follow the provided lab documentation closely, and feel free to ask for assistance.", textZh: "第三步，我们将进行主动实践。您将有 10 分钟的时间来完成任务。请密切遵循提供的实验文档指南，如有疑问，请随时寻求协助。" },
        { time: 58, textEn: "To wrap up, here are some final recommendations: ensure your files are in a compatible format, and remember that clear document structuring with headings will significantly improve the precision of your results.", textZh: "最后，这里有一些最终建议：确保您的文件格式兼容，并记住，带有清晰标题的文档结构将显著提高摘要结果的准确性。" }
      ]
    },
    {
      id: "coffee-break",
      tag: "Break",
      titleEn: "Coffee & Networking Break",
      titleZh: "咖啡与社交茶歇",
      duration: 900, // 15 minutes (900 seconds)
      videoUrl: null, // Indicates coffee break (show screen & timer)
      overviewEn: "A short 15-minute break to stretch, grab some coffee, and network with your postgraduate peers and workshop hosts.",
      overviewZh: "一个短暂的 15 分钟茶歇，伸展一下身体，喝杯咖啡，并与您的研究生同行和工作坊主持人进行交流。",
      resources: [
        { name: "KLUST Networking Lobby", url: "#", type: "link" }
      ],
      transcript: []
    },
    {
      id: "session-3",
      tag: "Session 3",
      titleEn: "Interactive Lesson AI: Gemini Gems & Canvas Co-Writing",
      titleZh: "互动课程 AI：Gemini Gems 与 Canvas 协同写作",
      duration: 90, // seconds
      videoUrl: "https://drive.google.com/file/d/1Xn8ov2RrpFmRE3_PCB0NpoC_HWOSo5um/view?usp=sharing",
      overviewEn: "Dive into custom instruction engineering. Part A covers configuring custom Gemini Gems (such as Socratic Tutors and Lesson Hook builders). Part B demonstrates using Google Workspace Canvas alongside Gemini to co-write, expand, and localize 45-minute active lesson plans.",
      overviewZh: "深入研究自定义指令工程。A 部分介绍配置自定义 Gemini Gems（例如苏格拉底式导师和课程切入点构建器）。B 部分展示了如何并肩使用 Google Workspace Canvas 和 Gemini 来协同编写、扩写以及本地化 45 分钟的主动式教案。",
      resources: [
        { name: "Gemini Custom Gems Portal", url: "https://gemini.google.com/gems", type: "link" },
        { name: "Socratic Persona Prompt Template", url: "#", type: "file" },
        { name: "Workspace Canvas Guide", url: "#", type: "pdf" }
      ],
      transcript: [
        { time: 0, textEn: "Welcome to Session 3. Today, we look at custom agents and collaborative workspaces.", textZh: "欢迎来到第三场。今天，我们来看看自定义智能体和协作工作区。" },
        { time: 6, textEn: "First, we will build a Custom Gem. Think of a Gem as a chat assistant with persistent guidelines.", textZh: "首先，我们将构建一个自定义 Gem。可以将 Gem 视作一个带有持久性指南的聊天助手。" },
        { time: 13, textEn: "We want to program a 'Socratic Tutor' Gem that asks probing questions instead of giving direct answers.", textZh: "我们想编写一个“苏格拉底导师” Gem，它会提出启发性的问题，而不是直接给出答案。" },
        { time: 21, textEn: "By writing clear instructions, we force the AI to encourage critical thinking.", textZh: "通过编写清晰的指令，我们促使 AI 去鼓励学生进行批判性思考。" },
        { time: 28, textEn: "Look at the prompt template in your Resources tab to copy the master instructions.", textZh: "请查看“资源”选项卡中的提示词模板，以复制核心指令。" },
        { time: 35, textEn: "Next, we move to Google Workspace Canvas. This is the co-writing side-panel.", textZh: "接下来，我们转到 Google Workspace Canvas。这是协同写作的侧边栏。" },
        { time: 42, textEn: "Instead of writing in a separate chat window, we write directly inside our Doc.", textZh: "我们不需要在单独的聊天窗口中编写，而是直接在我们的文档中编写。" },
        { time: 49, textEn: "We can highlight a paragraph and ask Gemini to 'elaborate', 'simplify', or 'translate to Chinese'.", textZh: "我们可以选中一个段落，然后让 Gemini 进行“详细阐述”、“简化”或“翻译成中文”。" },
        { time: 57, textEn: "This contextual collaboration makes instructional design three times faster.", textZh: "这种情境下的协同合作使教学设计速度提升了三倍。" },
        { time: 65, textEn: "For this segment's challenge, you will draft a lesson plan outline for a topic of your choice.", textZh: "在本小节的挑战中，您将为您选择的一个主题起草一份教学计划大纲。" },
        { time: 73, textEn: "Make sure you include a warm-up hook, a core activity, and a Socratic exit ticket.", textZh: "确保您的设计中包含一个导入切入点、一个核心活动以及一个苏格拉底式的“出门证”测验。" },
        { time: 81, textEn: "We'll review your drafts and see how Workspace Canvas assists with formatting.", textZh: "我们将审查您的草案，并看看 Workspace Canvas 如何协助排版。" },
        { time: 88, textEn: "Let's open our editors and start drafting.", textZh: "让我们打开编辑器开始起草吧。" }
      ]
    },
    {
      id: "session-4",
      tag: "Session 4",
      titleEn: "Concluding & Discussion: Ethics, Guardrails & Future Classrooms",
      titleZh: "总结与讨论：伦理、安全网与未来课堂",
      duration: 55, // seconds
      videoUrl: "https://drive.google.com/file/d/1TjTQGC3nmO1lqFO-HcTrw_x4tpJEqfYd/view?usp=sharing",
      overviewEn: "Rapid-fire showcase of student-designed Gems and syllabus guidelines. The session concludes with a panel discussion on pedagogical ethics, AI-driven assessment integrity, establishing classroom guardrails, and an open Q&A forum.",
      overviewZh: "学生设计的 Gems 和教学大纲指南的快速展示。本节最后将举行关于教学伦理、AI 驱动评估的诚信度、建立课堂防线以及开放式问答论坛的小组讨论。",
      resources: [
        { name: "AI Ethics in Education Brief", url: "#", type: "pdf" },
        { name: "Classroom AI Guardrails Template", url: "#", type: "file" }
      ],
      transcript: [
        { time: 0, textEn: "Welcome to our final session. We are going to showcase our projects.", textZh: "欢迎来到我们的最后一节课。我们将展示我们的项目成果。" },
        { time: 5, textEn: "I would like two volunteers to share the custom Gems they created.", textZh: "我想请两位志愿者来分享他们创建的自定义 Gems。" },
        { time: 11, textEn: "Seeing how different subjects configure Socratic tutors is extremely insightful.", textZh: "了解不同学科如何配置苏格拉底式导师是非常有启发性的。" },
        { time: 17, textEn: "Next, we must talk about the elephant in the room: academic integrity.", textZh: "接下来，我们必须谈谈显而易见却常被回避的问题：学术诚信。" },
        { time: 24, textEn: "How do we prevent students from copy-pasting answers without understanding them?", textZh: "我们如何防止学生在不理解的情况下直接复制粘贴答案？" },
        { time: 31, textEn: "The key is design. Focus assessments on critical analysis and personalization.", textZh: "关键在于设计。将评估的重点放在批判性分析和个性化表达上。" },
        { time: 38, textEn: "We should create clear guardrails and teach students ethical AI literacy.", textZh: "我们应该建立清晰的安全网，并教授学生合乎伦理的 AI 素养。" },
        { time: 44, textEn: "We will conclude with an open Q&A. Ask your final questions in the portal.", textZh: "最后我们将以开放式问答结束。请在门户中提出您的最终问题。" },
        { time: 50, textEn: "Thank you for joining. I hope these tools empower your future teaching careers.", textZh: "感谢大家的参与。我希望这些工具能为你们未来的教学事业赋能。" }
      ]
    }
  ],

  // Translation Dictionary
  translations: {
    en: {
      nav_title: "KLUST-Tongji ECT",
      nav_subtitle: "Postgrad Teaching Masterclass",
      lang_btn: "中文 / English",

      progress_label: "Course Progress",
      outline_title: "Course Agenda",
      min: "min",
      sec: "sec",
      locked: "Locked",
      overview: "Overview",
      transcript: "Transcript",
      notebook: "Notebook",
      qa: "Q&A",

      resources: "Resources",
      about_instructors: "About the Facilitators",
      skills_covered: "Skills Covered",
      active_session: "Active Session",
      duration_label: "Duration",
      total_time: "Total Time",
      note_placeholder: "Type a note at the current video timestamp... Press Enter to save.",
      btn_save_note: "Save Note",
      btn_export_notes: "Export Notes (.md)",
      no_notes: "No notes taken yet. Type in the box above to add a timestamped note.",
      qa_title_placeholder: "Question Title (e.g. NotebookLM PDF Limits)",
      qa_body_placeholder: "Write details of your question here...",
      btn_post_question: "Post Question",
      no_questions: "No questions asked yet. Be the first to start a thread!",
      reply_placeholder: "Write a reply...",
      btn_reply: "Reply",

      break_desc: "Break time! Grab a drink and network.",
      break_timer: "Time Remaining",
      break_resume: "Click outline items to resume class.",
      seconds: "seconds",
      unlocked: "Unlocked",
      status_active: "Active",
      status_completed: "Completed"
    },
    zh: {
      nav_title: "KLUST-Tongji ECT",
      nav_subtitle: "研究生教学大师课",
      lang_btn: "English / 中文",

      progress_label: "课程进度",
      outline_title: "课程大纲",
      min: "分钟",
      sec: "秒",
      locked: "未解锁",
      overview: "课程概述",
      transcript: "课堂实录",
      notebook: "学习笔记",
      qa: "问答互动",

      resources: "学习资源",
      about_instructors: "关于课程导师",
      skills_covered: "涵盖技能",
      active_session: "当前活跃小节",
      duration_label: "课时长度",
      total_time: "总课时",
      note_placeholder: "在当前视频时间点添加笔记... 按回车键或点击保存。",
      btn_save_note: "保存笔记",
      btn_export_notes: "导出笔记 (.md)",
      no_notes: "暂无笔记。在上方输入框中输入，即可添加带时间戳的笔记。",
      qa_title_placeholder: "问题标题 (例如 NotebookLM 的文件上传限制)",
      qa_body_placeholder: "在此处详细描述您的问题...",
      btn_post_question: "发布问题",
      no_questions: "暂无提问。快来发布第一个问题吧！",
      reply_placeholder: "编写回复...",
      btn_reply: "回复",

      break_desc: "茶歇时间！喝杯咖啡，活动一下筋骨吧。",
      break_timer: "剩余时间",
      break_resume: "点击大纲项目以继续上课。",
      seconds: "秒",
      unlocked: "已解锁",
      status_active: "进行中",
      status_completed: "已完成"
    }
  }
};
