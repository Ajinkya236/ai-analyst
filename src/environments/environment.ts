export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  appName: 'AI Analyst',
  version: '1.0.0',
  features: {
    aiAgents: true,
    dataUpload: true,
    memoGeneration: true,
    analytics: true,
    sharing: true
  },
  ai: {
    openaiApiKey: '',
    anthropicApiKey: '',
    defaultModel: 'gpt-4',
    maxTokens: 4000,
    temperature: 0.7
  },
  storage: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedFileTypes: ['.pdf', '.docx', '.ppt', '.pptx', '.mp4', '.mp3', '.txt'],
    retentionDays: 365
  },
  ui: {
    theme: 'light',
    language: 'en',
    autoSaveInterval: 60000, // 1 minute
    animationDuration: 300
  }
};
