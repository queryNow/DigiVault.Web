import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardCheck, 
  Building2, 
  Briefcase, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { useAssetStore } from '../../store/assets';
import BasicDetails from './steps/BasicDetails';
import AssetClassification from './steps/AssetClassification';
import InvestmentDetails from './steps/InvestmentDetails';
import Documents from './steps/Documents';
import Review from './steps/Review';

// Reduced steps for better UX
const STEPS = [
  { title: 'Basic Details', icon: ClipboardCheck },
  { title: 'Asset Classification', icon: Building2 },
  { title: 'Investment Details', icon: Briefcase },
  { title: 'Documents', icon: FileText },
  { title: 'Review', icon: AlertCircle }
];

const defaultFormData = {
  name: '',
  description: '',
  shortDescription: '',
  assetStatus: '',
  visibility: 'private',
  tags: [],
  assetClass: '',
  subClass: '',
  sector: '',
  region: '',
  country: '',
  managerName: '',
  managerEmail: '',
  managerPhone: '',
  companyName: '',
  regulatoryLicenses: [],
  targetValue: '',
  minimumInvestment: '',
  expectedReturn: '',
  investmentTerm: '',
  currency: 'USD',
  paymentFrequency: '',
  riskLevel: '',
  riskFactors: [],
  regulatoryCompliance: [],
  investorRestrictions: '',
  documents: []
};

interface AssetEditFormProps {
  asset?: any;
  mode: 'create' | 'edit';
}

export default function AssetEditForm({ asset, mode }: AssetEditFormProps) {
  const navigate = useNavigate();
  const { createAsset, updateAsset } = useAssetStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(asset ? {
    ...defaultFormData,
    ...asset,
    tags: asset.tags || [],
    regulatoryLicenses: asset.regulatoryLicenses || [],
    riskFactors: asset.riskFactors || [],
    regulatoryCompliance: asset.regulatoryCompliance || [],
    documents: asset.documents || []
  } : defaultFormData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (mode === 'create') {
        await createAsset(formData);
      } else {
        await updateAsset(asset.id, formData);
      }
      navigate('/assets');
    } catch (error) {
      console.error('Error saving asset:', error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicDetails formData={formData} setFormData={setFormData} />;
      case 2:
        return <AssetClassification formData={formData} setFormData={setFormData} />;
      case 3:
        return <InvestmentDetails formData={formData} setFormData={setFormData} />;
      case 4:
        return <Documents formData={formData} setFormData={setFormData} />;
      case 5:
        return <Review formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {mode === 'create' ? 'Create New Asset' : 'Edit Asset'}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {mode === 'create' 
            ? 'Complete all required information to create and tokenize your asset.'
            : 'Update the asset information and save your changes.'}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <nav aria-label="Progress">
          <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.title} className="md:flex-1">
                  <button
                    onClick={() => setCurrentStep(index + 1)}
                    className={`group w-full`}
                  >
                    <div className={`
                      px-6 py-4 flex items-center text-sm font-medium rounded-lg
                      ${currentStep === index + 1
                        ? 'bg-indigo-600 text-white'
                        : currentStep > index + 1
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-500 shadow-sm border border-gray-300'
                      }
                    `}>
                      <Icon className="h-5 w-5 mr-3" />
                      <span>{step.title}</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* Form content */}
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="p-6">
          {renderStepContent()}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          className={`
            inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md
            ${currentStep === 1
              ? 'text-gray-400 bg-gray-50 cursor-not-allowed'
              : 'text-gray-700 bg-white hover:bg-gray-50'
            }
          `}
          disabled={currentStep === 1}
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => {
            if (currentStep === STEPS.length) {
              handleSubmit(new Event('submit') as any);
            } else {
              setCurrentStep((prev) => Math.min(STEPS.length, prev + 1));
            }
          }}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          {currentStep === STEPS.length ? (mode === 'create' ? 'Create Asset' : 'Save Changes') : 'Next'}
        </button>
      </div>
    </div>
  );
}