import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  FileText, 
  Building2, 
  AlertTriangle, 
  Shield,
  X,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Loader2,
  Check,
  TrendingUp,
  Clock,
  Tag,
  Eye,
  ArrowUp,
  ArrowDown,
  Info,
  BarChart,
  PieChart,
  LineChart,
  Mail,
  Search,
  Users
} from 'lucide-react';
import { useAssetStore } from '../store/assets';
import { useDocumentStore } from '../store/documents';
import { 
  DocumentAnalystAgent, 
  InvestmentAdvisorAgent,
  RiskAnalystAgent,
  ComplianceMonitorAgent 
} from '../services/ai/agents';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ContextItem {
  type: 'asset' | 'document';
  id: string;
  name: string;
}

const QUICK_ACTIONS = [
  {
    id: 'analyze-document',
    label: 'Analyze Document',
    icon: FileText,
    prompt: 'Please analyze the selected document and provide insights.'
  },
  {
    id: 'investment-advice',
    label: 'Investment Advice',
    icon: Building2,
    prompt: 'Please provide investment analysis and recommendations for the selected asset.'
  },
  {
    id: 'risk-assessment',
    label: 'Risk Assessment',
    icon: AlertTriangle,
    prompt: 'Please assess the risks associated with the selected asset.'
  },
  {
    id: 'compliance-check',
    label: 'Compliance Check',
    icon: Shield,
    prompt: 'Please check compliance status and requirements for the selected asset.'
  }
];

function formatAnalysisResponse(response: any) {
  if (!response) {
    throw new Error('No response data');
  }

  try {
    const data = typeof response === 'string' ? JSON.parse(response) : response;

    if (!data.overview || !data.keyFindings) {
      throw new Error('Invalid response structure');
    }

    return (
      <div className="space-y-6">
        {/* Overview Section */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {data.overview.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {data.overview.summary}
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <Tag className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Type</div>
                  <div className="text-sm text-gray-900">{data.overview.type}</div>
                </div>
              </div>
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Category</div>
                  <div className="text-sm text-gray-900">{data.overview.category}</div>
                </div>
              </div>
              <div className="flex items-center">
                <Info className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Confidence</div>
                  <div className="text-sm text-gray-900">{(data.overview.confidence * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Findings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Highlights */}
          <div className="bg-green-50 rounded-lg border border-green-200 p-6">
            <h4 className="text-sm font-medium text-green-800 flex items-center">
              <Check className="h-5 w-5 mr-2" />
              Key Highlights
            </h4>
            <ul className="mt-4 space-y-3">
              {data.keyFindings.highlights.map((highlight: string, index: number) => (
                <li key={index} className="flex items-start">
                  <ArrowUp className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-green-700">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Risks */}
          <div className="bg-red-50 rounded-lg border border-red-200 p-6">
            <h4 className="text-sm font-medium text-red-800 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Risk Factors
            </h4>
            <ul className="mt-4 space-y-3">
              {data.keyFindings.risks.map((risk: string, index: number) => (
                <li key={index} className="flex items-start">
                  <ArrowDown className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-red-700">{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
            <h4 className="text-sm font-medium text-blue-800 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Opportunities
            </h4>
            <ul className="mt-4 space-y-3">
              {data.keyFindings.opportunities.map((opportunity: string, index: number) => (
                <li key={index} className="flex items-start">
                  <ArrowUp className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-blue-700">{opportunity}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Analysis Details */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Analysis</h3>
          </div>
          <div className="px-4 py-5 sm:p-6 space-y-6">
            {/* Financial Analysis */}
            {data.analysis.financial && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Financial Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.analysis.financial.metrics.map((metric: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        {metric.trend === 'up' ? (
                          <ArrowUp className="h-4 w-4 text-green-500 mr-2" />
                        ) : metric.trend === 'down' ? (
                          <ArrowDown className="h-4 w-4 text-red-500 mr-2" />
                        ) : (
                          <div className="w-4 mr-2" />
                        )}
                        <span className="text-sm text-gray-500">{metric.name}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{metric.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Risk Analysis */}
            {data.analysis.risk && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Risk Assessment</h4>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Risk Level</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        data.analysis.risk.level === 'high' ? 'bg-red-100 text-red-800' :
                        data.analysis.risk.level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {data.analysis.risk.level.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Risk Factors</h5>
                      <ul className="space-y-2">
                        {data.analysis.risk.factors.map((factor: string, index: number) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Mitigation Strategies</h5>
                      <ul className="space-y-2">
                        {data.analysis.risk.mitigations.map((strategy: string, index: number) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <Shield className="h-4 w-4 text-blue-500 mr-2" />
                            {strategy}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recommendations</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              {data.recommendations.map((rec: any, index: number) => (
                <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                    rec.priority === 'high' ? 'bg-red-500' :
                    rec.priority === 'medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`} />
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">{rec.action}</h4>
                    <p className="mt-1 text-sm text-gray-500">{rec.impact}</p>
                    <div className="mt-2 flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-500">Timeline: {rec.timeline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error formatting analysis response:', error);
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error Processing Response</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Unable to format the analysis response. Please try again.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showContext, setShowContext] = useState(true);
  const [selectedContext, setSelectedContext] = useState<ContextItem[]>([]);
  
  const { assets } = useAssetStore();
  const { documents } = useDocumentStore();

  // Initialize agents
  const documentAnalyst = new DocumentAnalystAgent();
  const investmentAdvisor = new InvestmentAdvisorAgent();
  const riskAnalyst = new RiskAnalystAgent();
  const complianceMonitor = new ComplianceMonitorAgent();

  const handleSend = async () => {
    if (!input.trim()) return;

    // Validate context selection based on request type
    const needsAsset = input.toLowerCase().includes('investment') || 
                      input.toLowerCase().includes('risk') || 
                      input.toLowerCase().includes('compliance');
                      
    if (needsAsset && !selectedContext.some(item => item.type === 'asset')) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Please select an asset to analyze first.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    const newMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setLoading(true);

    try {
      let response = '';

      // Get selected document and asset data
      const selectedDoc = selectedContext
        .filter(item => item.type === 'document')
        .map(item => documents.find(d => d.id === item.id))[0];

      const selectedAsset = selectedContext
        .filter(item => item.type === 'asset')
        .map(item => assets.find(a => a.id === item.id))[0];

      // Determine which agent to use based on the message content
      if (input.toLowerCase().includes('document') || input.toLowerCase().includes('analyze')) {
        if (!selectedDoc) {
          throw new Error('No document selected for analysis');
        }
        const result = await documentAnalyst.process({
          content: selectedDoc.name,
          metadata: {
            id: selectedDoc.id,
            name: selectedDoc.name,
            type: selectedDoc.type,
            category: selectedDoc.category,
            metadata: selectedDoc.metadata
          }
        });
        response = result;
      } else if (input.toLowerCase().includes('investment')) {
        if (!selectedAsset) {
          throw new Error('No asset selected for investment analysis');
        }
        const result = await investmentAdvisor.process({
          asset: selectedAsset,
          investorProfile: {},
          marketConditions: {}
        });
        response = result;
      } else if (input.toLowerCase().includes('risk')) {
        if (!selectedAsset) {
          throw new Error('No asset selected for risk analysis');
        }
        const result = await riskAnalyst.process({
          asset: selectedAsset,
          marketData: {},
          historicalPerformance: {}
        });
        response = result;
      } else if (input.toLowerCase().includes('compliance')) {
        if (!selectedAsset) {
          throw new Error('No asset selected for compliance check');
        }
        const selectedDocs = selectedContext
          .filter(item => item.type === 'document')
          .map(item => documents.find(d => d.id === item.id))
          .filter(Boolean) as Document[];

        const result = await complianceMonitor.process({
          asset: selectedAsset,
          documents: selectedDocs,
          regulations: []
        });
        response = result;
      } else {
        response = "I'm not sure how to help with that specific request. Could you please ask about documents, investments, risks, or compliance?";
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error processing request:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: `Error: ${error.message || 'An error occurred while processing your request.'}`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action: typeof QUICK_ACTIONS[0]) => {
    // First check if we have required context
    const needsAsset = action.prompt.toLowerCase().includes('investment') || 
                      action.prompt.toLowerCase().includes('risk') || 
                      action.prompt.toLowerCase().includes('compliance');

    if (needsAsset && !selectedContext.some(item => item.type === 'asset')) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Please select an asset first before using this quick action.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    setInput(action.prompt);
  };

  const toggleContextItem = (item: ContextItem) => {
    setSelectedContext(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.filter(i => i.id !== item.id);
      }
      return [...prev, item];
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex h-[calc(100vh-8rem)]">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bot className="h-6 w-6 text-indigo-600" />
                <h2 className="ml-2 text-lg font-medium text-gray-900">AI Assistant</h2>
              </div>
              <button
                onClick={() => setShowContext(!showContext)}
                className="text-gray-400 hover:text-gray-500"
              >
                {showContext ? <ChevronRight /> : <ChevronLeft />}
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-wrap gap-2">
              {QUICK_ACTIONS.map(action => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <action.icon className="h-4 w-4 mr-2 text-gray-500" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-3xl rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}
                >
                  {message.role === 'user' ? (
                    <p className="text-sm">{message.content}</p>
                  ) : (
                    formatAnalysisResponse(message.content)
                  )}
                  <div
                    className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-indigo-200' : 'text-gray-500'
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                  <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Context Panel */}
        {showContext && (
          <div className="w-80 ml-6 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Context</h3>
              <p className="mt-1 text-sm text-gray-500">
                Select assets and documents to analyze
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Assets */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Assets</h4>
                <div className="space-y-2">
                  {assets.map(asset => (
                    <div
                      key={asset.id}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                        selectedContext.some(item => item.id === asset.id)
                          ? 'bg-indigo-50 border border-indigo-200'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => toggleContextItem({
                        type: 'asset',
                        id: asset.id,
                        name: asset.name
                      })}
                    >
                      <div className="flex items-center">
                        <Building2 className="h-5 w-5 text-gray-400" />
                        <span className="ml-2 text-sm text-gray-900">
                          {asset.name}
                        </span>
                      </div>
                      {selectedContext.some(item => item.id === asset.id) && (
                        <Check className="h-4 w-4 text-indigo-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Documents</h4>
                <div className="space-y-2">
                  {documents.map(doc => (
                    <div
                      key={doc.id}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                        selectedContext.some(item => item.id === doc.id)
                          ? 'bg-indigo-50 border border-indigo-200'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => toggleContextItem({
                        type: 'document',
                        id: doc.id,
                        name: doc.name
                      })}
                    >
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <span className="ml-2 text-sm text-gray-900">
                          {doc.name}
                        </span>
                      </div>
                      {selectedContext.some(item => item.id === doc.id) && (
                        <Check className="h-4 w-4 text-indigo-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}