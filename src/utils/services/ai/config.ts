export const AI_CONFIG = {
  models: {
    chat: 'gpt-4o',
    embedding: 'text-embedding-3-large',
    analysis: 'gpt-4-32k',
  },
  
  maxContextLengths: {
    chat: 8192,
    analysis: 32768,
    summary: 4096
  },

  rateLimits: {
    requestsPerMinute: 60,
    tokensPerMinute: 90000
  },

  retryConfig: {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000
  },

  prompts: {
    documentAnalysis: `Analyze this document and provide comprehensive insights:

    Consider:
    1. Key themes and topics
    2. Important entities and relationships
    3. Financial data and metrics
    4. Risk factors and compliance issues
    5. Action items and recommendations
    6. Data visualization suggestions

    Format your response with clear sections:
    - Summary
    - Key Insights
    - Recommendations
    - Visualizations`,

    investmentAnalysis: `Analyze this investment opportunity:

    Consider:
    1. Market conditions and trends
    2. Risk factors and mitigation
    3. Expected returns and timeline
    4. Compliance requirements
    5. Strategic recommendations

    Format your response with clear sections:
    - Investment Analysis
    - Risk Assessment
    - Recommendations
    - Next Steps`,

    riskAnalysis: `Analyze potential risks and provide mitigation strategies:

    Consider:
    1. Market risks
    2. Operational risks
    3. Compliance risks
    4. Financial risks
    5. Mitigation strategies

    Format your response with clear sections:
    - Risk Assessment
    - Risk Metrics
    - Mitigation Strategies
    - Monitoring Plan`,

    complianceAnalysis: `Analyze compliance status and requirements:

    Consider:
    1. Regulatory requirements
    2. Documentation status
    3. Potential violations
    4. Required actions
    5. Monitoring needs

    Format your response with clear sections:
    - Compliance Status
    - Gaps Analysis
    - Required Actions
    - Monitoring Plan`
  }
};

export const AZURE_OPENAI_CONFIG = {
  endpoint: 'https://mahes-m6zrjxu5-swedencentral.cognitiveservices.azure.com',
  apiKey: 'E7JkxIgXgViSYeBJ4tJ4ACmFI8ZgHpj2dxyLzmyMubnVPt3g8VtGJQQJ99BBACfhMk5XJ3w3AAAAACOGS2oh',
  deployments: {
    chat: 'gpt-4o',
    embedding: 'text-embedding-3-large',
    analysis: 'gpt-4-32k'
  }
};