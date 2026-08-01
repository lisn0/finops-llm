const fs = require('fs');
const path = require('path');

const srcResearchDir = path.join(__dirname, '..', 'src', 'research');

// Target high-citation GEO topics for LLM FinOps & CFOs
const targetTopicCluster = [
  { id: 'chargeback-showback', topic: 'Chargeback & Showback Models for AI', targetQuery: 'how to chargeback llm costs by team' },
  { id: 'agent-spend-guardrails', topic: 'AI Agent Spend Guardrails', targetQuery: 'ai agent spending limits and budget caps' },
  { id: 'llm-usage-metering', topic: 'LLM Usage Metering & Billing', targetQuery: 'metering and billing internal llm usage' },
  { id: 'prompt-caching-economics', topic: 'Prompt Caching ROI & Attribution', targetQuery: 'prompt cache cost savings calculation' },
  { id: 'reasoning-model-costs', topic: 'Reasoning Token Cost Allocation', targetQuery: 'how to track reasoning tokens cost' },
  { id: 'batch-api-finops', topic: 'Batch API vs Realtime Cost Routing', targetQuery: 'openai batch api cost optimization' },
  { id: 'multi-provider-arbitrage', topic: 'Multi-Provider Model Routing', targetQuery: 'llm model routing cost savings' },
  { id: 'evals-cost-control', topic: 'LLM Evaluation & CI/CD Spend Control', targetQuery: 'cost of automated llm evals' },
];

function analyzeGaps() {
  console.log('Running Content Gap Analyzer...');
  
  const existingFiles = fs.readdirSync(srcResearchDir);
  const existingArticles = existingFiles.map((f) => f.replace(/\.(njk|html|md)$/, ''));

  const gapAnalysis = targetTopicCluster.map((item) => {
    const covered = existingArticles.some((art) => art.includes(item.id) || art.includes(item.id.replace(/-/g, '')));
    return {
      topic: item.topic,
      targetQuery: item.targetQuery,
      covered,
      suggestedSlug: `research/${item.id}`,
      priority: covered ? 'Covered' : 'High Gap',
    };
  });

  const coveredCount = gapAnalysis.filter((g) => g.covered).length;
  const gapCount = gapAnalysis.length - coveredCount;

  const result = {
    timestamp: new Date().toISOString(),
    totalTargetTopics: gapAnalysis.length,
    coveredCount,
    gapCount,
    gapAnalysis,
  };

  const outputPath = path.join(__dirname, '..', 'content-gaps.json');
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

  console.log(`Content Gap Analysis Complete: ${coveredCount}/${gapAnalysis.length} topics covered. ${gapCount} gaps identified.`);
  console.log(`Output saved to ${outputPath}`);
}

analyzeGaps();
