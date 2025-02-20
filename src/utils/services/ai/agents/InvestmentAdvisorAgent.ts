import { BaseAgent } from './BaseAgent';
import { Asset } from '../../../utils/types';

export class InvestmentAdvisorAgent extends BaseAgent {
  async process(input: {
    asset: Asset;
    investorProfile: any;
    marketConditions: any;
  }): Promise<string> {
    try {
      const { asset } = input;

      return `
Investment Analysis for ${asset.name}

Key Details:
- Expected Return: ${asset.expectedReturn}%
- Investment Term: ${asset.investmentTerm} months
- Minimum Investment: ${asset.minimumInvestment}
- Risk Level: ${asset.riskLevel}

Key Findings:
1. Asset shows potential for strong returns
2. Investment timeline aligns with market cycles
3. Risk level is appropriate for the asset class

Recommendations:
1. Review investment documentation
2. Consider portfolio allocation
3. Monitor market conditions

Next Steps:
- Conduct due diligence
- Review investment terms
- Assess risk tolerance alignment
      `.trim();
    } catch (error) {
      console.error('Error in InvestmentAdvisorAgent:', error);
      throw new Error('Failed to analyze investment opportunity');
    }
  }
}