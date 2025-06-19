import { BarChart3 } from 'lucide-react';

interface AssessmentData {
  confidence: number;
  empathy: number;
  questionQuality: number;
}

interface AssessmentPanelProps {
  assessment: AssessmentData;
}

const getFeedback = (assessment: AssessmentData) => {
  const strengths = [];
  const suggestions = [];
  if (assessment.confidence > 80) strengths.push('High confidence in responses');
  else suggestions.push('Work on expressing more confidence');
  if (assessment.empathy > 80) strengths.push('Strong empathy shown');
  else suggestions.push('Try to show more empathy');
  if (assessment.questionQuality > 80) strengths.push('Excellent question quality');
  else suggestions.push('Ask more open-ended, high-quality questions');
  return { strengths, suggestions };
};

const mockAdvancedAnalytics = {
  summary: "You are demonstrating strong empathy and open-ended questioning. Consider focusing more on confidence and pacing.",
  strengths: ["Empathy", "Open-ended questions"],
  weaknesses: ["Confidence", "Pacing"],
  suggestions: [
    "Try to project more confidence in your responses.",
    "Slow down and give the patient more time to respond.",
    "Continue using open-ended questions to encourage deeper discussion."
  ]
};

const AssessmentPanel: React.FC<AssessmentPanelProps> = ({ assessment }) => {
  const feedback = getFeedback(assessment);
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-slate-800 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2" /> Assessment
      </h3>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-600">Confidence</span>
            <span className="text-slate-800">{assessment.confidence}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${assessment.confidence}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-600">Empathy</span>
            <span className="text-slate-800">{assessment.empathy}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${assessment.empathy}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-600">Question Quality</span>
            <span className="text-slate-800">{assessment.questionQuality}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all duration-300"
              style={{ width: `${assessment.questionQuality}%` }}
            />
          </div>
        </div>
      </div>

      {/* Feedback section */}
      <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
        <div className="font-semibold text-slate-700 mb-1">Feedback</div>
        <div className="text-green-700 text-sm mb-1">
          <span className="font-semibold">Strengths:</span> {feedback.strengths.join(', ') || '—'}
        </div>
        <div className="text-yellow-700 text-sm">
          <span className="font-semibold">Suggestions:</span> {feedback.suggestions.join(', ') || '—'}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="font-semibold text-blue-700 mb-1">Advanced Analytics</div>
        <div className="text-blue-900 text-sm mb-2">{mockAdvancedAnalytics.summary}</div>
        <div className="text-green-700 text-sm mb-1">
          <span className="font-semibold">Strengths:</span> {mockAdvancedAnalytics.strengths.join(', ')}
        </div>
        <div className="text-red-700 text-sm mb-1">
          <span className="font-semibold">Weaknesses:</span> {mockAdvancedAnalytics.weaknesses.join(', ')}
        </div>
        <div className="text-blue-800 text-sm">
          <span className="font-semibold">Suggestions:</span>
          <ul className="list-disc ml-5">
            {mockAdvancedAnalytics.suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPanel; 