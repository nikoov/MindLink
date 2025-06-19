
import { Heart } from 'lucide-react';
import React from 'react';

interface AssessmentData {
  confidence: number;
  empathy: number;
  questionQuality: number;
}

interface AssessmentPanelProps {
  assessment: AssessmentData;
}

const AssessmentPanel: React.FC<AssessmentPanelProps> = ({ assessment }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-slate-800 flex items-center">
        <Heart className="w-5 h-5 mr-2" />
        Therapist Assessment
      </h3>
      
      {Object.entries(assessment).map(([key, value]) => (
        <div key={key} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="capitalize text-slate-600">{key.replace(/([A-Z])/g, ' $1')}</span>
            <span className="font-medium">{Math.round(value)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${value}%`,
                backgroundColor: value > 80 ? '#10B981' : value > 60 ? '#F59E0B' : '#EF4444'
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssessmentPanel;