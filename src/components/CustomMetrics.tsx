import { useState } from 'react';
import type { CustomMetric } from '../types';

interface CustomMetricsProps {
  onAddMetric: (metric: CustomMetric) => void;
  onRemoveMetric: (metricName: string) => void;
  metrics: CustomMetric[];
}

const CustomMetrics = ({
  onAddMetric,
  onRemoveMetric,
  metrics,
}: CustomMetricsProps) => {
  const [metricName, setMetricName] = useState('');
  const [metricDescription, setMetricDescription] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddMetric = () => {
    if (metricName.trim() === '') return;

    const newMetric: CustomMetric = {
      name: metricName.trim().toLowerCase(),
      description:
        metricDescription.trim() || `Measure of ${metricName.trim()}`,
    };

    onAddMetric(newMetric);
    setMetricName('');
    setMetricDescription('');
  };

  return (
    <div className="mx-auto mt-6 w-full max-w-2xl rounded-lg bg-white p-4 shadow">
      <div
        className="flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-medium text-gray-700">
          Custom Analysis Parameters
        </h3>
        <button type="button" className="text-blue-600 hover:text-blue-800">
          {isExpanded ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      {isExpanded ? (
        <div className="mt-4 space-y-4">
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Metric name (e.g. empathy)"
                value={metricName}
                onChange={(e) => setMetricName(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Description (optional)"
                value={metricDescription}
                onChange={(e) => setMetricDescription(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={handleAddMetric}
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add
            </button>
          </div>

          {metrics.length > 0 && (
            <div className="mt-4">
              <h4 className="mb-2 text-sm font-medium text-gray-700">
                Current Custom Parameters:
              </h4>
              <div className="flex flex-wrap gap-2">
                {metrics.map((metric) => (
                  <div
                    key={metric.name}
                    className="flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm"
                  >
                    <span className="mr-1">{metric.name}</span>
                    <button
                      type="button"
                      onClick={() => onRemoveMetric(metric.name)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-2 text-sm text-gray-600">
            <p>
              Add custom parameters to analyze in the call on a scale from 1-10.
            </p>
            <p>Default parameters include: tension, tonality, and relevance.</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CustomMetrics;
