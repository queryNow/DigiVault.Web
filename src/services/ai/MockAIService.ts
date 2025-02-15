import { ChatRequestMessage } from '@azure/openai';
import { AzureOpenAIService } from './AzureOpenAIService';

export class MockAIService {
  private ai: AzureOpenAIService;

  constructor() {
    this.ai = new AzureOpenAIService();
  }

  async chat(messages: ChatRequestMessage[], options = {}) {
    try {
      const response = await this.ai.chat(messages, options);
      return this.ensureValidResponse(response);
    } catch (error) {
      console.error('Error in AI service:', error);
      throw new Error('Failed to process request');
    }
  }

  async analyzeDocument(content: string) {
    try {
      const response = await this.ai.analyzeDocument(content);
      return this.ensureValidResponse(response);
    } catch (error) {
      console.error('Error analyzing document:', error);
      throw new Error('Failed to analyze document');
    }
  }

  private ensureValidResponse(response: string) {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(response);
      return JSON.stringify(parsed);
    } catch (e) {
      // If not valid JSON, return structured response
      const structured = {
        overview: {
          title: 'Analysis Report',
          type: 'General Analysis',
          category: 'Analysis',
          summary: response.substring(0, 200) + '...',
          confidence: 0.8
        },
        keyFindings: {
          highlights: [response.substring(0, 100)],
          risks: [],
          opportunities: []
        },
        analysis: {},
        recommendations: [],
        nextSteps: [],
        visualizations: []
      };
      return JSON.stringify(structured);
    }
  }
}