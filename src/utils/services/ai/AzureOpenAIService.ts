import { OpenAIClient, AzureKeyCredential, ChatRequestMessage } from '@azure/openai';
import { AZURE_OPENAI_CONFIG, AI_CONFIG } from './config';

export class AzureOpenAIService {
  private client: OpenAIClient;
  private deploymentName: string;

  constructor() {
    const { endpoint, apiKey, deployments } = AZURE_OPENAI_CONFIG;

    if (!endpoint || !apiKey) {
      throw new Error('Azure OpenAI configuration is missing required values');
    }

    this.client = new OpenAIClient(
      endpoint,
      new AzureKeyCredential(apiKey)
    );
    this.deploymentName = deployments.chat;
  }

  async chat(messages: ChatRequestMessage[], options = {}) {
    try {
      const result = await this.client.getChatCompletions(
        this.deploymentName,
        messages,
        {
          temperature: 0.7,
          maxTokens: 2000,
          n: 1,
          stop: null,
          ...options
        }
      );

      if (!result.choices[0]?.message) {
        throw new Error('No response content received from Azure OpenAI');
      }

      return result.choices[0].message.content || '';
    } catch (error: any) {
      console.error('Error in Azure OpenAI chat:', error);
      throw new Error('Azure OpenAI Error: ' + (error.message || 'Unknown error'));
    }
  }

  async analyzeDocument(content: string) {
    try {
      const messages = [
        { role: 'system', content: AI_CONFIG.prompts.documentAnalysis },
        { role: 'user', content }
      ];

      return this.chat(messages, {
        temperature: 0.3,
        maxTokens: 2500
      });
    } catch (error) {
      console.error('Error in document analysis:', error);
      throw new Error('Failed to analyze document');
    }
  }
}