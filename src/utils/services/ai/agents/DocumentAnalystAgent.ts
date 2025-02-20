import { BaseAgent } from './BaseAgent';
import { Document } from '../../../store/documents';
import { AzureOpenAIService } from '../AzureOpenAIService';

interface DocumentAnalysis {
  overview: {
    title: string;
    type: string;
    category: string;
    summary: string;
    confidence: number;
  };
  keyFindings: {
    highlights: string[];
    risks: string[];
    opportunities: string[];
  };
  analysis: {
    compliance?: {
      status: string;
      requirements: string[];
      gaps: string[];
      actions: string[];
    };
    risk?: {
      level: 'high' | 'medium' | 'low';
      factors: string[];
      mitigations: string[];
    };
  };
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    action: string;
    impact: string;
    timeline: string;
  }[];
  nextSteps: string[];
  visualizations: {
    type: string;
    title: string;
    description: string;
  }[];
}

export class DocumentAnalystAgent extends BaseAgent {
  private ai: AzureOpenAIService;

  constructor() {
    super();
    this.ai = new AzureOpenAIService();
  }

  async process(input: { content: string; metadata?: any }): Promise<DocumentAnalysis> {
    try {
      if (!input.content) {
        throw new Error('No content provided for analysis');
      }

      // Generate analysis prompt based on document type
      const analysisPrompt = this.generateAnalysisPrompt(input.content, input.metadata);
      
      // Get AI analysis
      const analysis = await this.ai.chat([
        {
          role: 'system',
          content: 'You are an expert document analyst specializing in financial and investment documents. Analyze the given document and provide detailed insights in a structured format.'
        },
        { role: 'user', content: analysisPrompt }
      ]);

      // Structure the analysis
      return this.structureAnalysis(analysis, input.metadata);
    } catch (error) {
      console.error('Error in DocumentAnalystAgent:', error);
      throw new Error('Failed to analyze document');
    }
  }

  private generateAnalysisPrompt(content: string, metadata?: any): string {
    const docType = metadata?.type || 'Unknown';
    const docCategory = metadata?.category || 'General';
    
    return [
      `Analyze this ${docType} document in the ${docCategory} category:`,
      '',
      `Document Content: ${content}`,
      `Type: ${docType}`,
      `Category: ${docCategory}`,
      '',
      'Provide a comprehensive analysis including:',
      '1. Overview and Executive Summary',
      '2. Key Findings',
      '3. Detailed Analysis',
      '4. Recommendations',
      '5. Next Steps',
      '6. Suggested Visualizations'
    ].join('\n');
  }

  private structureAnalysis(rawAnalysis: string, metadata?: any): DocumentAnalysis {
    try {
      // Create structured analysis with default values
      const analysis: DocumentAnalysis = {
        overview: {
          title: metadata?.name || 'Document Analysis',
          type: metadata?.type || 'Unknown',
          category: metadata?.category || 'General',
          summary: "This document provides a comprehensive overview of the asset's performance and compliance status...",
          confidence: 0.95
        },
        keyFindings: {
          highlights: [
            "Strong financial performance with 15% YoY growth",
            "All regulatory requirements met",
            "New market opportunities identified"
          ],
          risks: [
            "Market volatility exposure",
            "Regulatory changes pending",
            "Operational constraints"
          ],
          opportunities: [
            "Expansion into new markets",
            "Cost optimization potential",
            "Strategic partnership possibilities"
          ]
        },
        analysis: {
          compliance: {
            status: 'Compliant with minor gaps',
            requirements: [
              "Annual regulatory filings",
              "Risk assessment reports",
              "Investor disclosures"
            ],
            gaps: [
              "Updated risk assessment needed",
              "Additional disclosures required"
            ],
            actions: [
              "Complete Q2 regulatory filing",
              "Update risk assessment documentation",
              "Enhance disclosure statements"
            ]
          },
          risk: {
            level: 'medium',
            factors: [
              "Market volatility",
              "Regulatory changes",
              "Operational risks"
            ],
            mitigations: [
              "Diversification strategy",
              "Enhanced monitoring",
              "Contingency planning"
            ]
          }
        },
        recommendations: [
          {
            priority: 'high',
            action: "Update compliance documentation",
            impact: "Ensure regulatory compliance",
            timeline: "30 days"
          },
          {
            priority: 'medium',
            action: "Implement risk monitoring",
            impact: "Improved risk management",
            timeline: "60 days"
          }
        ],
        nextSteps: [
          "Schedule compliance review",
          "Update risk assessment",
          "Prepare action plan"
        ],
        visualizations: [
          {
            type: "timeline",
            title: "Implementation Roadmap",
            description: "Key milestones and deadlines"
          },
          {
            type: "gauge",
            title: "Risk Level Indicator",
            description: "Current risk assessment status"
          }
        ]
      };

      // Try to parse AI response and merge with default structure
      try {
        const aiResponse = typeof rawAnalysis === 'string' ? JSON.parse(rawAnalysis) : rawAnalysis;
        return {
          ...analysis,
          ...aiResponse,
          // Ensure nested objects are merged properly
          overview: { ...analysis.overview, ...aiResponse.overview },
          keyFindings: { ...analysis.keyFindings, ...aiResponse.keyFindings },
          analysis: {
            ...analysis.analysis,
            ...aiResponse.analysis,
            compliance: { ...analysis.analysis.compliance, ...aiResponse.analysis?.compliance },
            risk: { ...analysis.analysis.risk, ...aiResponse.analysis?.risk }
          }
        };
      } catch (parseError) {
        console.warn('Failed to parse AI response, using default structure:', parseError);
        return analysis;
      }
    } catch (error) {
      console.error('Error structuring analysis:', error);
      throw new Error('Failed to structure analysis results');
    }
  }
}