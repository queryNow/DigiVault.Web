import React from 'react';
import { ChevronDown, FileSpreadsheet, FileCheck, FileImage, FileCog, FileWarning } from 'lucide-react';

export function getDocumentIcon(type: string) {
  switch (type) {
    case 'Financial':
      return <FileSpreadsheet className="h-5 w-5 text-emerald-500" />;
    case 'Legal Document':
      return <FileCheck className="h-5 w-5 text-blue-500" />;
    case 'Marketing':
      return <FileImage className="h-5 w-5 text-purple-500" />;
    case 'Technical':
      return <FileCog className="h-5 w-5 text-gray-500" />;
    default:
      return <FileWarning className="h-5 w-5 text-yellow-500" />;
  }
}

export function FilterButton({ label, options, value, onChange }: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
      >
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  );
}