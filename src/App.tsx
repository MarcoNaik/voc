import { useState } from 'react';
import AudioUploader from './components/AudioUploader';
import CustomMetrics from './components/CustomMetrics';
import DialogueTimeline from './components/DialogueTimeline';
import CallInsights from './components/CallInsights';
import { analyzeCallAudio } from './api/openai';
import type { CallAnalysis, CustomMetric } from './types';

const App = () => {
  const [customMetrics, setCustomMetrics] = useState<CustomMetric[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<CallAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddMetric = (metric: CustomMetric) => {
    if (customMetrics.some((m) => m.name === metric.name)) {
      alert(`A metric with the name "${metric.name}" already exists.`);
      return;
    }
    setCustomMetrics([...customMetrics, metric]);
  };

  const handleRemoveMetric = (metricName: string) => {
    setCustomMetrics(
      customMetrics.filter((metric) => metric.name !== metricName),
    );
  };

  const handleFileSelect = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const metricNames = customMetrics.map((metric) => metric.name);
      const result = await analyzeCallAudio(file, metricNames);
      setAnalysis(result);
    } catch (err) {
      console.error('Error analyzing call:', err);

      // Create more user-friendly error messages
      let errorMessage = 'An unknown error occurred';

      if (err instanceof Error) {
        // Handle common OpenAI API errors
        const message = err.message;

        if (message.includes('API key')) {
          errorMessage =
            'Invalid or missing API key. Please check your .env file.';
        } else if (message.includes('rate limit')) {
          errorMessage = 'Rate limit exceeded. Please try again later.';
        } else if (message.includes('billing')) {
          errorMessage =
            'Billing issue with your OpenAI account. Please check your account status.';
        } else if (message.includes('Transcription failed')) {
          errorMessage =
            'Failed to transcribe audio. Please ensure your file is a clear audio recording.';
        } else if (message.includes('Analysis failed')) {
          errorMessage =
            'Analysis failed. The AI model couldn\'t process your request.';
        } else {
          // Use the actual error message if none of the common cases
          errorMessage = message;
        }
      }

      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-10 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Call Analysis AI
          </h1>
          <p className="text-gray-600">
            Upload a customer service call recording for AI-powered analysis
          </p>
        </header>

        <main className="space-y-8">
          <AudioUploader
            onFileSelect={handleFileSelect}
            isLoading={isAnalyzing}
          />

          <CustomMetrics
            onAddMetric={handleAddMetric}
            onRemoveMetric={handleRemoveMetric}
            metrics={customMetrics}
          />

          {isAnalyzing ? (
            <div className="py-10 text-center">
              <div className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                <div className="animate-pulse">
                  Analyzing your call recording...
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                This may take a minute or two depending on the length of the
                recording.
              </p>
            </div>
          ) : null}

          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    An error occurred
                  </h3>
                  <div className="mt-1 text-sm text-red-700">{error}</div>
                  <div className="mt-2 text-xs text-gray-600">
                    <p>Common troubleshooting steps:</p>
                    <ul className="mt-1 list-disc pl-5">
                      <li>Check your OpenAI API key in the .env file</li>
                      <li>
                        Ensure your audio file is supported (mp3, mp4, mpeg,
                        mpga, m4a, wav, or webm)
                      </li>
                      <li>
                        Try a shorter audio sample if your file is very large
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {analysis && !isAnalyzing ? (
            <div className="space-y-10">
              <CallInsights analysis={analysis} />
              <DialogueTimeline segments={analysis.segments} />
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default App;
