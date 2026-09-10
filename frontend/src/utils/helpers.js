/**
 * helpers.js
 * Utility methods for string escaping, formatting, and DOM helpers.
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function formatMetricKey(key) {
  const map = {
    lighthouse: 'Lighthouse Score',
    fcp: 'First Contentful Paint',
    bundleSize: 'Gzip Bundle',
    rps: 'Requests / Sec',
    latency: 'Avg Response Time',
    uptime: 'Availability SLA',
    hallucinationRate: 'Hallucination Rate',
    groundingScore: 'Context Grounding',
    llmModel: 'Active LLM Model',
    embedDims: 'Embedding Dims',
    recallAt10: 'HNSW Recall@10',
    hnswQps: 'Vector Search QPS',
    conns: 'Conn Pool Limit',
    transpSpeed: 'ACID Latency',
    cacheLatency: 'Redis Cache Hit',
    ciBuildTime: 'CI/CD Runtime',
    containerSize: 'Alpine Container',
    policiesTracked: 'Coverage Types',
    renewalNotice: 'Renewal Notice',
    searchLatency: 'Query Latency',
    modulesPreserved: 'Knowledge Retention',
    onboardingSpeed: 'Trainee Ramp-up',
    activeTrainees: 'Cohort Scale',
    workflowSpeed: 'Efficiency Gain',
    spreadsheetsReplaced: 'Manual Process Removed',
    apiEndpoints: 'Production APIs',
    fps: 'Frame Rate',
    ragGrounding: 'Factual Grounding',
    vectorDimensions: 'Vector Length'
  };
  return map[key] || key.replace(/([A-Z])/g, ' $1').toLowerCase();
}

export function formatMarkdown(text) {
  if (!text) return '';
  let escaped = escapeHtml(text);
  // Bold **text**
  escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Code `code`
  escaped = escaped.replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.08);padding:1px 5px;border-radius:3px;color:#34d399;">$1</code>');
  // Bullets
  escaped = escaped.replace(/^\s*[\-\*]\s+(.*)$/gm, '<li style="margin-left:1.2rem;">$1</li>');
  // Newlines
  escaped = escaped.replace(/\n/g, '<br/>');
  return escaped;
}
