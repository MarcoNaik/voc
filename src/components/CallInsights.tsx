import type { CallAnalysis } from '../types';

interface CallInsightsProps {
  analysis: CallAnalysis;
}

const CallInsights = ({ analysis }: CallInsightsProps) => {
  // Check if analysis is undefined or missing required properties
  if (
    !analysis ||
    !analysis.summary ||
    !analysis.key_moments ||
    !analysis.customer_info ||
    !analysis.agent_info
  ) {
    return (
      <div className="rounded-lg bg-yellow-50 p-6 shadow">
        <h3 className="mb-4 text-xl font-semibold text-yellow-800">
          Incomplete Analysis Data
        </h3>
        <p className="text-yellow-700">
          The analysis data is incomplete or in an unexpected format. This might
          be due to an API limitation or error.
        </p>
      </div>
    );
  }

  const formatTime = (seconds: number): string => {
    if (typeof seconds !== 'number') return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Summary */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-xl font-semibold">Call Summary</h3>
        <p className="text-gray-700">{analysis.summary}</p>
      </div>

      {/* Key Moments */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-xl font-semibold">Key Moments</h3>
        <div className="space-y-3">
          {analysis.key_moments && analysis.key_moments.length > 0 ? (
            analysis.key_moments.map((moment, index) => (
              <div key={index} className="border-l-4 border-blue-500 py-2 pl-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {moment.description || 'Unnamed moment'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTime(moment.timestamp)}
                  </span>
                </div>
                <div className="mt-1 flex items-center">
                  <span className="mr-2 text-xs text-gray-500">
                    Importance:
                  </span>
                  <div className="h-1.5 w-24 rounded-full bg-gray-200">
                    <div
                      className="h-1.5 rounded-full bg-blue-500"
                      style={{ width: `${(moment.importance || 5) * 10}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="italic text-gray-500">No key moments identified</p>
          )}
        </div>
      </div>

      {/* Customer Information */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-xl font-semibold">Customer Insights</h3>
        <div className="space-y-4">
          <div>
            <h4 className="mb-1 text-sm font-medium text-gray-700">
              Overall Sentiment
            </h4>
            <p className="text-gray-600">
              {analysis.customer_info.sentiment || 'Not analyzed'}
            </p>
          </div>
          <div>
            <h4 className="mb-1 text-sm font-medium text-gray-700">
              Identified Needs
            </h4>
            {analysis.customer_info.needs &&
            analysis.customer_info.needs.length > 0 ? (
              <ul className="list-inside list-disc text-gray-600">
                {analysis.customer_info.needs.map((need, index) => (
                  <li key={index}>{need}</li>
                ))}
              </ul>
            ) : (
              <p className="italic text-gray-500">
                No specific needs identified
              </p>
            )}
          </div>
          <div>
            <h4 className="mb-1 text-sm font-medium text-gray-700">
              Satisfaction Level
            </h4>
            <div className="flex items-center">
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className={`h-2 rounded-full ${
                    (analysis.customer_info.satisfaction_level || 0) >= 7
                      ? 'bg-green-500'
                      : (analysis.customer_info.satisfaction_level || 0) >= 4
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                  style={{
                    width: `${
                      (analysis.customer_info.satisfaction_level || 0) * 10
                    }%`,
                  }}
                ></div>
              </div>
              <span className="ml-2 text-sm">
                {analysis.customer_info.satisfaction_level || 0}/10
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Information */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-xl font-semibold">Agent Performance</h3>
        <div className="space-y-4">
          <div>
            <h4 className="mb-1 text-sm font-medium text-gray-700">
              Overall Performance
            </h4>
            <div className="flex items-center">
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className={`h-2 rounded-full ${
                    (analysis.agent_info.performance || 0) >= 7
                      ? 'bg-green-500'
                      : (analysis.agent_info.performance || 0) >= 4
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                  style={{
                    width: `${(analysis.agent_info.performance || 0) * 10}%`,
                  }}
                ></div>
              </div>
              <span className="ml-2 text-sm">
                {analysis.agent_info.performance || 0}/10
              </span>
            </div>
          </div>
          <div>
            <h4 className="mb-1 text-sm font-medium text-gray-700">
              Strengths
            </h4>
            {analysis.agent_info.strengths &&
            analysis.agent_info.strengths.length > 0 ? (
              <ul className="list-inside list-disc text-gray-600">
                {analysis.agent_info.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            ) : (
              <p className="italic text-gray-500">No strengths identified</p>
            )}
          </div>
          <div>
            <h4 className="mb-1 text-sm font-medium text-gray-700">
              Areas for Improvement
            </h4>
            {analysis.agent_info.improvement_areas &&
            analysis.agent_info.improvement_areas.length > 0 ? (
              <ul className="list-inside list-disc text-gray-600">
                {analysis.agent_info.improvement_areas.map((area, index) => (
                  <li key={index}>{area}</li>
                ))}
              </ul>
            ) : (
              <p className="italic text-gray-500">
                No improvement areas identified
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallInsights;
