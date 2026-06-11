import type { AITool } from '@types-app/AITool';

export interface CopilotCriteria {
  scale: 'small' | 'medium' | 'enterprise';
  budget: 'low-cost' | 'balanced' | 'premium';
  cloud: 'aws' | 'azure' | 'gcp' | 'hybrid' | 'on-prem';
  compliance: 'soc2' | 'hipaa' | 'gdpr' | 'none';
  openSourcePreferred: boolean;
  latencyLimit: 'real-time' | 'standard' | 'batch';
  ragRequired: boolean;
  agenticRequired: boolean;
}

export interface BlueprintSlot {
  slotLabel: string;
  tool: AITool | null;
  roleDescription: string;
  deploymentRecommendation: string;
}

export interface ArchitectureBlueprint {
  title: string;
  description: string;
  slots: BlueprintSlot[];
  tradeoffs: string[];
  complianceWarnings: string[];
  estimatedOperationalCostIndex: number; // 0-100 (lower is cheaper)
}

class CopilotEngine {
  generateBlueprint(tools: AITool[], criteria: CopilotCriteria): ArchitectureBlueprint {
    const slots: BlueprintSlot[] = [];
    const tradeoffs: string[] = [];
    const complianceWarnings: string[] = [];
    let costIndex = 50;

    // Helper to find a tool by id prefix or substring
    const findTool = (categoryName: string, queryStr: string, fallbackId?: string): AITool | null => {
      const candidates = tools.filter(t => t.category === categoryName);
      let match = candidates.find(c => c.name.toLowerCase().includes(queryStr.toLowerCase()) || c.id.toLowerCase().includes(queryStr.toLowerCase()));
      if (!match && fallbackId) {
        match = candidates.find(c => c.id === fallbackId);
      }
      return match || (candidates[0] || null);
    };

    // ─── 1. LLM SELECTION ───
    let llmTool: AITool | null = null;
    if (criteria.openSourcePreferred || criteria.budget === 'low-cost') {
      llmTool = findTool('LLM Models', 'DeepSeek', 'llm-deepseek-r1');
      if (llmTool) {
        tradeoffs.push(`Selected open-weights model ${llmTool.name} to avoid vendor lock-in and optimize token cost.`);
        costIndex -= 15;
      }
    } else if (criteria.cloud === 'azure') {
      llmTool = findTool('LLM Models', 'GPT-4o', 'llm-gpt4o');
      if (llmTool) {
        tradeoffs.push(`Selected ${llmTool.name} for enterprise Azure backend integration and high reasoning compliance.`);
        costIndex += 15;
      }
    } else if (criteria.cloud === 'aws') {
      llmTool = findTool('LLM Models', 'Claude', 'llm-claude35');
      if (llmTool) {
        tradeoffs.push(`Selected ${llmTool.name} for AWS Bedrock native context handling and coding capabilities.`);
        costIndex += 10;
      }
    } else {
      llmTool = findTool('LLM Models', 'GPT-4o', 'llm-gpt4o');
    }

    slots.push({
      slotLabel: 'Foundation LLM',
      tool: llmTool,
      roleDescription: 'Central reasoning core for generation, planning, and task execution.',
      deploymentRecommendation: criteria.openSourcePreferred
        ? 'Self-host via vLLM on private Kubernetes'
        : `Serverless cloud API endpoints via ${criteria.cloud.toUpperCase()}`,
    });

    // ─── 2. VECTOR DATABASE SELECTION ───
    let vectorTool: AITool | null = null;
    if (criteria.openSourcePreferred) {
      vectorTool = findTool('Vector Databases', 'Qdrant', 'db-qdrant');
      if (vectorTool) tradeoffs.push(`Selected ${vectorTool.name} to support high-performance on-prem vector search.`);
    } else if (criteria.scale === 'small' || criteria.budget === 'low-cost') {
      vectorTool = findTool('Vector Databases', 'pgvector', 'db-pgvector');
    } else {
      vectorTool = findTool('Vector Databases', 'Pinecone', 'db-pinecone');
      if (vectorTool) {
        tradeoffs.push(`Selected managed ${vectorTool.name} to reduce operational overhead for large scale semantic indices.`);
        costIndex += 5;
      }
    }

    slots.push({
      slotLabel: 'Vector Database',
      tool: vectorTool,
      roleDescription: 'Stores high-dimensional embeddings for semantic retrieval & long-term RAG memory.',
      deploymentRecommendation: criteria.openSourcePreferred
        ? 'Deploy containerized cluster with persistent volume claims'
        : 'Managed SaaS cloud tenant',
    });

    // ─── 3. AGENTIC ORCHESTRATION ───
    let orchTool: AITool | null = null;
    if (criteria.agenticRequired) {
      orchTool = findTool('Agent Frameworks', 'LangGraph', 'agent-langgraph');
      if (orchTool) tradeoffs.push('Selected LangGraph for deterministic state machine cyclic agent graphs.');
    } else if (criteria.ragRequired) {
      orchTool = findTool('RAG Frameworks', 'LlamaIndex', 'rag-llamaindex');
    } else {
      orchTool = findTool('RAG Frameworks', 'LangChain', 'rag-langchain');
    }

    slots.push({
      slotLabel: 'Orchestration & Agents',
      tool: orchTool,
      roleDescription: 'Manages application state, context memory, and executes RAG/Agent tools.',
      deploymentRecommendation: 'Python application microservice deployed to Kubernetes node groups.',
    });

    // ─── 4. OBSERVABILITY STACK ───
    let obsTool: AITool | null = null;
    if (criteria.openSourcePreferred || criteria.budget === 'low-cost') {
      obsTool = findTool('Observability', 'Phoenix', 'obs-phoenix');
      if (obsTool) costIndex -= 10;
    } else {
      obsTool = findTool('Observability', 'LangSmith', 'obs-langsmith');
      if (obsTool) costIndex += 10;
    }

    slots.push({
      slotLabel: 'Observability & Tracing',
      tool: obsTool,
      roleDescription: 'Traces token counts, system latency, cost anomalies, and LLM call spans.',
      deploymentRecommendation: criteria.openSourcePreferred ? 'Self-hosted Docker instances' : 'SaaS platform webhook integrations',
    });

    // ─── 5. INFERENCE / SERVING SERVERS ───
    let serveTool: AITool | null = null;
    if (criteria.openSourcePreferred || criteria.cloud === 'on-prem') {
      serveTool = findTool('Inference Engines', 'vLLM', 'inf-vllm');
    } else if (criteria.cloud === 'aws') {
      serveTool = findTool('Cloud AI Platforms', 'Bedrock', 'plat-bedrock');
    } else if (criteria.cloud === 'azure') {
      serveTool = findTool('Cloud AI Platforms', 'Azure AI', 'plat-azureai');
    } else {
      serveTool = findTool('Inference Engines', 'vLLM', 'inf-vllm');
    }

    slots.push({
      slotLabel: 'Inference Infrastructure',
      tool: serveTool,
      roleDescription: 'Provides high-throughput serving with paged attention and model parallel configurations.',
      deploymentRecommendation: criteria.openSourcePreferred
        ? 'Deploy on multi-node GPU instances (A100/H100) running Ray'
        : 'Enterprise cloud console subscription with auto-scaling instances',
    });

    // ─── 6. EVALUATION STACK ───
    let evalTool: AITool | null = findTool('AI Evaluation Tools', 'DeepEval', 'aieval-deepeval');
    if (!evalTool) {
      evalTool = findTool('Evaluation Frameworks', 'Ragas', 'eval-ragas');
    }

    slots.push({
      slotLabel: 'Evaluation & Test Harness',
      tool: evalTool,
      roleDescription: 'Calculates factual correctness, prompt drift, and retrieval scores dynamically.',
      deploymentRecommendation: 'Integrated into CI/CD regression build runs (GitHub Actions / GitLab pipelines).',
    });

    // ─── 7. GOVERNANCE & PRIVACY ───
    let govTool: AITool | null = null;
    if (criteria.compliance !== 'none') {
      govTool = findTool('Compliance Tools', 'OneTrust', 'comp-onetrust');
      if (govTool) {
        tradeoffs.push(`Included ${govTool.name} for global privacy assessments and audit readiness logs.`);
        costIndex += 15;
      }
    } else {
      govTool = findTool('Lineage Tools', 'OpenLineage', 'line-openlineage');
    }

    slots.push({
      slotLabel: 'Governance & Lineage',
      tool: govTool,
      roleDescription: 'Tracks data lineage, registers AI policies, and satisfies corporate transparency guidelines.',
      deploymentRecommendation: criteria.compliance !== 'none'
        ? 'SaaS compliance catalog portal'
        : 'Automated collectors integrated into Spark or pipeline runtimes',
    });

    // ─── Compliance Checks ───
    if (criteria.compliance === 'hipaa') {
      if (llmTool && !llmTool.compliance.toLowerCase().includes('hipaa')) {
        complianceWarnings.push(`Caution: ${llmTool.name} does not explicitly declare HIPAA certification in standard tiers. A BAA contract is required.`);
      }
      if (vectorTool && !vectorTool.compliance.toLowerCase().includes('hipaa')) {
        complianceWarnings.push(`Warning: Vector storage ${vectorTool.name} requires dedicated enterprise private link configurations to satisfy HIPAA compliance.`);
      }
    } else if (criteria.compliance === 'gdpr') {
      if (criteria.cloud === 'aws' || criteria.cloud === 'azure' || criteria.cloud === 'gcp') {
        if (!criteria.openSourcePreferred) {
          complianceWarnings.push('Note: Multi-tenant SaaS LLM calls process user prompt data in shared cloud regions. Ensure localized EU regions are selected.');
        }
      }
    }

    if (criteria.agenticRequired && criteria.compliance !== 'none') {
      complianceWarnings.push('Architecture Warning: Autonomous multi-agent loops can generate unpredictable paths. Active real-time guardrail scanning is highly recommended.');
    }

    // Adjust title
    let title = 'Enterprise Cloud Native Blueprint';
    let description = 'Highly managed cloud architecture providing low latency and zero maintenance overhead.';
    
    if (criteria.openSourcePreferred) {
      title = 'Self-Hosted Sovereign AI Stack';
      description = 'Complete, private infrastructure designed for high data privacy and zero vendor platform dependencies.';
    } else if (criteria.budget === 'low-cost') {
      title = 'Cost Optimized AI Pipeline';
      description = 'Minimal cost setup leveraging open-weights and embedded database runtimes.';
    } else if (criteria.agenticRequired) {
      title = 'Production Multi-Agent Architecture';
      description = 'Structured agent mesh blueprint supporting context-aware loops, tracking, and evaluation.';
    }

    return {
      title,
      description,
      slots,
      tradeoffs,
      complianceWarnings,
      estimatedOperationalCostIndex: Math.max(10, Math.min(100, costIndex)),
    };
  }
}

export const copilotEngine = new CopilotEngine();
