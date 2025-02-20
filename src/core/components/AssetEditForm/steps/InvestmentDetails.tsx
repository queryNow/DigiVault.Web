import React from 'react';

const PAYMENT_FREQUENCY = ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual'];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY'];
const RISK_LEVELS = ['Low', 'Medium', 'High'];

interface InvestmentDetailsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function InvestmentDetails({ formData, setFormData }: InvestmentDetailsProps) {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-red-50 to-rose-50 p-6 rounded-lg border border-red-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
              Currency
            </label>
            <select
              id="currency"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {CURRENCIES.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="targetValue" className="block text-sm font-medium text-gray-700">
              Target Value
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">{formData.currency}</span>
              </div>
              <input
                type="number"
                id="targetValue"
                value={formData.targetValue}
                onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                className="mt-1 block w-full pl-12 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="minimumInvestment" className="block text-sm font-medium text-gray-700">
              Minimum Investment
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">{formData.currency}</span>
              </div>
              <input
                type="number"
                id="minimumInvestment"
                value={formData.minimumInvestment}
                onChange={(e) => setFormData({ ...formData, minimumInvestment: e.target.value })}
                className="mt-1 block w-full pl-12 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="expectedReturn" className="block text-sm font-medium text-gray-700">
              Expected Return (%)
            </label>
            <input
              type="number"
              id="expectedReturn"
              value={formData.expectedReturn}
              onChange={(e) => setFormData({ ...formData, expectedReturn: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="investmentTerm" className="block text-sm font-medium text-gray-700">
              Investment Term (months)
            </label>
            <input
              type="number"
              id="investmentTerm"
              value={formData.investmentTerm}
              onChange={(e) => setFormData({ ...formData, investmentTerm: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="paymentFrequency" className="block text-sm font-medium text-gray-700">
              Payment Frequency
            </label>
            <select
              id="paymentFrequency"
              value={formData.paymentFrequency}
              onChange={(e) => setFormData({ ...formData, paymentFrequency: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Frequency</option>
              {PAYMENT_FREQUENCY.map(frequency => (
                <option key={frequency} value={frequency}>{frequency}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="riskLevel" className="block text-sm font-medium text-gray-700">
              Risk Level
            </label>
            <select
              id="riskLevel"
              value={formData.riskLevel}
              onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Risk Level</option>
              {RISK_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}