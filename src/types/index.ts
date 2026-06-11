import type { Category, CategoryMeta } from './AITool';

export * from './AITool';
export * from './FilterState';
export * from './ComparisonState';

// ─── Category Registry ────────────────────────────────────────────────────────

export const CATEGORY_REGISTRY: CategoryMeta[] = [
  { id: 'llm-models',             label: 'LLM Models' as Category,              csvFile: 'llm_models.csv',              icon: '🧠', color: '#6366f1', description: 'Large language models',                trending: true  },
  { id: 'embedding-models',       label: 'Embedding Models' as Category,        csvFile: 'embedding_models.csv',        icon: '🔢', color: '#8b5cf6', description: 'Text & vector embeddings',             trending: false },
  { id: 'multimodal-models',      label: 'Multimodal Models' as Category,       csvFile: 'multimodal_models.csv',       icon: '🎨', color: '#a855f7', description: 'Vision, audio, and text models',       trending: true  },
  { id: 'agent-frameworks',       label: 'Agent Frameworks' as Category,        csvFile: 'agent_frameworks.csv',        icon: '🤖', color: '#ec4899', description: 'Autonomous AI agent systems',           trending: true  },
  { id: 'rag-frameworks',         label: 'RAG Frameworks' as Category,          csvFile: 'rag_frameworks.csv',          icon: '📚', color: '#f43f5e', description: 'Retrieval-augmented generation',        trending: true  },
  { id: 'vector-databases',       label: 'Vector Databases' as Category,        csvFile: 'vector_databases.csv',        icon: '🗄️', color: '#ef4444', description: 'Vector similarity search databases',    trending: false },
  { id: 'ai-apis',                label: 'AI APIs' as Category,                 csvFile: 'ai_apis.csv',                 icon: '🔌', color: '#f97316', description: 'AI model APIs and endpoints',           trending: false },
  { id: 'cloud-ai-platforms',     label: 'Cloud AI Platforms' as Category,      csvFile: 'cloud_ai_platforms.csv',      icon: '☁️', color: '#eab308', description: 'Cloud-managed AI services',             trending: false },
  { id: 'llmops',                 label: 'LLMOps' as Category,                  csvFile: 'observability_tools.csv',     icon: '⚙️', color: '#84cc16', description: 'LLM ops & lifecycle management',        trending: true  },
  { id: 'agentops',               label: 'AgentOps' as Category,                csvFile: 'agent_frameworks.csv',        icon: '🕹️', color: '#22c55e', description: 'Agent orchestration & ops',             trending: true  },
  { id: 'observability',          label: 'Observability' as Category,           csvFile: 'observability_tools.csv',     icon: '📊', color: '#10b981', description: 'AI observability & monitoring',         trending: false },
  { id: 'ai-security',            label: 'AI Security' as Category,             csvFile: 'ai_security_tools.csv',       icon: '🛡️', color: '#14b8a6', description: 'AI security & safety tools',            trending: true  },
  { id: 'ai-governance',          label: 'AI Governance' as Category,           csvFile: 'governance_tools.csv',        icon: '⚖️', color: '#06b6d4', description: 'AI governance & compliance',            trending: false },
  { id: 'mlops',                  label: 'MLOps' as Category,                   csvFile: 'deployment_tools.csv',        icon: '🔄', color: '#0ea5e9', description: 'ML operations & pipelines',             trending: false },
  { id: 'deployment-tools',       label: 'Deployment Tools' as Category,        csvFile: 'deployment_tools.csv',        icon: '🚀', color: '#3b82f6', description: 'AI model deployment platforms',        trending: false },
  { id: 'streaming-platforms',    label: 'Streaming Platforms' as Category,     csvFile: 'streaming_platforms.csv',     icon: '📡', color: '#6366f1', description: 'Real-time streaming for AI',            trending: false },
  { id: 'feature-stores',         label: 'Feature Stores' as Category,          csvFile: 'feature_stores.csv',          icon: '🏪', color: '#8b5cf6', description: 'Feature engineering stores',           trending: false },
  { id: 'evaluation-frameworks',  label: 'Evaluation Frameworks' as Category,   csvFile: 'evaluation_tools.csv',        icon: '📋', color: '#d946ef', description: 'LLM evaluation & benchmarking',        trending: true  },
  { id: 'inference-engines',      label: 'Inference Engines' as Category,       csvFile: 'inference_engines.csv',       icon: '⚡', color: '#f59e0b', description: 'High-performance inference runtimes',   trending: true  },
  { id: 'ai-ide-tools',           label: 'AI IDE Tools' as Category,            csvFile: 'ai_ide_tools.csv',            icon: '💻', color: '#10b981', description: 'AI-powered development tools',          trending: true  },
  { id: 'gpu-platforms',          label: 'GPU Platforms' as Category,           csvFile: 'gpu_platforms.csv',           icon: '🎮', color: '#ef4444', description: 'GPU cloud & acceleration platforms',   trending: false },
  { id: 'data-pipelines',         label: 'Data Pipelines' as Category,          csvFile: 'orchestration_tools.csv',     icon: '🔗', color: '#f97316', description: 'Data ingestion & pipeline tools',       trending: false },
  { id: 'workflow-orchestration', label: 'Workflow Orchestration' as Category,  csvFile: 'orchestration_tools.csv',     icon: '🎯', color: '#84cc16', description: 'AI workflow orchestration',             trending: false },
  
  // V2 Category Extensions
  { id: 'bi-tools',               label: 'BI Tools' as Category,                csvFile: 'bi_tools.csv',                icon: '📈', color: '#3b82f6', description: 'Business intelligence & reports',     trending: false },
  { id: 'dashboard-platforms',    label: 'Dashboard Platforms' as Category,     csvFile: 'dashboard_platforms.csv',     icon: '🖥️', color: '#06b6d4', description: 'Visual dashboards & analytics',        trending: false },
  { id: 'sql-engines',            label: 'SQL Engines' as Category,             csvFile: 'sql_engines.csv',             icon: '💾', color: '#0ea5e9', description: 'Distributed SQL & query runtimes',       trending: true  },
  { id: 'data-science-tools',     label: 'Data Science Tools' as Category,      csvFile: 'data_science_tools.csv',      icon: '📓', color: '#a855f7', description: 'Notebooks & DS experiment suites',     trending: false },
  { id: 'experiment-tracking',    label: 'Experiment Tracking' as Category,     csvFile: 'experiment_tracking.csv',     icon: '🧪', color: '#ec4899', description: 'ML metadata & run logs trackers',      trending: true  },
  { id: 'visualization-libraries',label: 'Visualization Libraries' as Category, csvFile: 'visualization_libraries.csv', icon: '📊', color: '#f43f5e', description: 'Scientific visualization libraries',     trending: false },
  { id: 'ml-frameworks',          label: 'ML Frameworks' as Category,           csvFile: 'ml_frameworks.csv',           icon: '📦', color: '#f97316', description: 'Traditional ML modeling packages',       trending: false },
  { id: 'ml-algorithms',          label: 'ML Algorithms' as Category,           csvFile: 'ml_algorithms.csv',           icon: '📐', color: '#eab308', description: 'Supervised/unsupervised algorithms',     trending: false },
  { id: 'recommendation-systems', label: 'Recommendation Systems' as Category,  csvFile: 'recommendation_systems.csv',  icon: '🤝', color: '#84cc16', description: 'Match & recommend ML engine stacks',    trending: false },
  { id: 'time-series-tools',      label: 'Time Series Tools' as Category,       csvFile: 'time_series_tools.csv',       icon: '📈', color: '#10b981', description: 'Forecasting & anomaly tools',           trending: false },
  { id: 'ai-sdlc-tools',          label: 'AI SDLC Tools' as Category,           csvFile: 'ai_sdlc_tools.csv',           icon: '🛠️', color: '#14b8a6', description: 'AI software development lifecycle',     trending: true  },
  { id: 'model-registry',         label: 'Model Registries' as Category,        csvFile: 'model_registry.csv',          icon: '🗂️', color: '#0ea5e9', description: 'Versioned ML model deployment assets',   trending: false },
  { id: 'feature-engineering',    label: 'Feature Engineering' as Category,     csvFile: 'feature_engineering.csv',     icon: '🏗️', color: '#3b82f6', description: 'Data pipelines & feature creation',     trending: false },
  { id: 'distributed-ai',         label: 'Distributed AI' as Category,          csvFile: 'distributed_ai.csv',          icon: '🕸️', color: '#6366f1', description: 'Multi-GPU distributed training',        trending: true  },
  { id: 'ai-evaluation-tools',    label: 'AI Evaluation Tools' as Category,     csvFile: 'ai_evaluation_tools.csv',     icon: '🎯', color: '#8b5cf6', description: 'LLM & RAG testing benchmarks',          trending: true  },
  { id: 'ai-safety-tools',        label: 'AI Safety Tools' as Category,         csvFile: 'ai_safety_tools.csv',         icon: '🛡️', color: '#ef4444', description: 'Guardrails & safety frameworks',        trending: true  },
  { id: 'lineage-tools',          label: 'Lineage Tools' as Category,           csvFile: 'lineage_tools.csv',           icon: '⛓️', color: '#f59e0b', description: 'Data lineage & tracking suites',        trending: false },
  { id: 'compliance-tools',       label: 'Compliance Tools' as Category,        csvFile: 'compliance_tools.csv',        icon: '⚖️', color: '#10b981', description: 'AI regulation & audit platforms',       trending: false },
];
