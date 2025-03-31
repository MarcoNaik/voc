import type { DialogueSegment } from '../types';

interface DialogueTimelineProps {
  segments: DialogueSegment[];
}

const DialogueTimeline = ({ segments }: DialogueTimelineProps) => {
  // Check if segments array is valid
  if (!segments || !Array.isArray(segments) || segments.length === 0) {
    return (
      <div className="w-full rounded-lg bg-yellow-50 p-6 shadow">
        <h3 className="mb-4 text-xl font-semibold text-yellow-800">
          No Conversation Data
        </h3>
        <p className="text-yellow-700">
          No conversation segments were found in the analysis results.
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
    <div className="w-full">
      <h3 className="mb-4 text-xl font-semibold">Conversation Timeline</h3>
      <div className="space-y-4">
        {segments.map((segment, index) => (
          <div
            key={index}
            className={`rounded-lg p-4 ${
              segment.speaker === 'agent'
                ? 'border-l-4 border-blue-500 bg-blue-50'
                : 'border-l-4 border-gray-500 bg-gray-50'
            }`}
          >
            <div className="mb-2 flex items-start justify-between">
              <div className="flex items-center">
                <div
                  className={`font-medium ${
                    segment.speaker === 'agent'
                      ? 'text-blue-700'
                      : 'text-gray-700'
                  }`}
                >
                  {segment.speaker === 'agent' ? 'Agent' : 'Customer'}
                </div>
                <div className="ml-2 text-sm text-gray-500">
                  {formatTime(segment.start_time || 0)} -{' '}
                  {formatTime(segment.end_time || 0)}
                </div>
              </div>
            </div>

            <p className="mb-3 text-gray-700">
              {segment.text || 'No transcript available'}
            </p>

            {segment.metrics && typeof segment.metrics === 'object' ? (
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {Object.entries(segment.metrics).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <span className="mr-2 text-xs capitalize text-gray-500">
                      {key}:
                    </span>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className={`h-2 rounded-full ${getMetricColor(
                          key,
                          value || 0,
                        )}`}
                        style={{ width: `${(value || 0) * 10}%` }}
                      ></div>
                    </div>
                    <span className="ml-1 text-xs">{value || 0}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="italic text-gray-500">
                No metrics available for this segment
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to get color based on metric type and value
const getMetricColor = (metricName: string, value: number): string => {
  // For tension, high values are negative
  if (metricName === 'tension') {
    if (value >= 7) return 'bg-red-500';
    if (value >= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  // For others, higher values are generally positive
  if (value >= 7) return 'bg-green-500';
  if (value >= 4) return 'bg-yellow-500';
  return 'bg-red-500';
};

export default DialogueTimeline;
