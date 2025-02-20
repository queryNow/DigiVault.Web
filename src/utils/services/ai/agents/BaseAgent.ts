import { MockAIService } from '../MockAIService';
import { ChatRequestMessage } from '@azure/openai';

class BaseAgent {
  protected ai: MockAIService;
  protected context: Record<string, unknown> = {};

  constructor() {
    this.ai = new MockAIService();
  }

  protected async chatCompletion(messages: ChatRequestMessage[]) {
    try {
      const response = await this.ai.chat(messages);
      return this.parseResponse(response);
    } catch (error) {
      console.error('Error in chat completion:', error);
      throw new Error('Failed to process request');
    }
  }

  protected parseResponse(response: string) {
    try {
      // First try to parse as JSON
      if (typeof response === 'string') {
        try {
          return JSON.parse(response);
        } catch (e) {
          // If not valid JSON, return structured response
          return {
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
        }
      }
      return response;
    } catch (error) {
      console.error('Error parsing response:', error);
      throw new Error('Failed to parse analysis response');
    }
  }

  protected setContext(key: string, value: unknown) {
    this.context[key] = value;
  }

  protected getContext(key: string) {
    return this.context[key];
  }
}

export { BaseAgent };