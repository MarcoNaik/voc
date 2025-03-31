import type { CallAnalysis } from '../types';

// Function to upload audio file to OpenAI and get structured analysis
export async function analyzeCallAudio(
  audioFile: File,
  customMetrics: string[] = [],
): Promise<CallAnalysis> {
  try {
    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('model', 'whisper-1');

    // First, transcribe the audio file
    const transcriptionResponse = await fetch(
      'https://api.openai.com/v1/audio/transcriptions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: formData,
      },
    );

    if (!transcriptionResponse.ok) {
      const errorData = await transcriptionResponse.json().catch(() => ({}));
      throw new Error(
        `Transcription failed: ${
          transcriptionResponse.statusText || 'Unknown error'
        } ${errorData.error?.message ? `- ${errorData.error.message}` : ''}`,
      );
    }

    const transcriptionData = await transcriptionResponse.json();
    const transcription = transcriptionData.text;

    // Then, analyze the transcription with GPT-3.5
    const defaultMetrics = ['tension', 'tonality', 'relevance'];
    const allMetrics = [...defaultMetrics, ...customMetrics];

    const analysisPrompt = {
      messages: [
        {
          role: 'system',
          content: `You are an expert call center analyst. Analyze this customer service call transcript and provide a structured JSON output.
          Break the conversation into segments by speaker (agent or customer).
          For each segment, provide metrics on a scale of 1-10 for: ${allMetrics.join(
            ', ',
          )}.
          Also identify key moments, summarize the call, and provide insights about both the customer and agent.
          Return your analysis as a JSON object with this exact structure:
          {
            "segments": [
              {
                "speaker": "agent" or "customer",
                "text": "what was said",
                "start_time": 0, (estimated time in seconds)
                "end_time": 0, (estimated time in seconds)
                "metrics": {
                  "tension": 1-10,
                  "tonality": 1-10,
                  "relevance": 1-10,
                  ... (other metrics as requested)
                }
              }
            ],
            "summary": "summarize the call content",
            "key_moments": [
              {
                "description": "description of key moment",
                "timestamp": 0, (estimated time in seconds)
                "importance": 1-10
              }
            ],
            "customer_info": {
              "sentiment": "description of customer sentiment",
              "needs": ["need1", "need2"],
              "satisfaction_level": 1-10
            },
            "agent_info": {
              "performance": 1-10,
              "strengths": ["strength1", "strength2"],
              "improvement_areas": ["area1", "area2"]
            }
          }`,
        },
        {
          role: 'user',
          content: transcription,
        },
      ],
      model: 'gpt-3.5-turbo',
      response_format: { type: 'json_object' },
    };

    try {
      const analysisResponse = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
          body: JSON.stringify(analysisPrompt),
        },
      );

      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json().catch(() => ({}));
        throw new Error(
          `Analysis failed: ${analysisResponse.statusText || 'Unknown error'} ${
            errorData.error?.message ? `- ${errorData.error.message}` : ''
          }`,
        );
      }

      const analysisData = await analysisResponse.json();
      let analysis;

      try {
        // Parse the content as JSON
        analysis = JSON.parse(analysisData.choices[0].message.content);

        // Validate the structure of the analysis
        validateAnalysisStructure(analysis);

        return analysis as CallAnalysis;
      } catch (parseError) {
        console.error('Error parsing or validating analysis:', parseError);
        throw new Error(
          `Failed to parse analysis results: ${
            parseError instanceof Error ? parseError.message : 'Invalid JSON'
          }`,
        );
      }
    } catch (error) {
      console.error('Error during analysis:', error);
      // If the first attempt fails, retry with gpt-3.5-turbo without the response format
      if (
        analysisPrompt.model === 'gpt-3.5-turbo' &&
        analysisPrompt.response_format
      ) {
        console.log('Retrying with different parameters...');
        const fallbackPrompt = {
          ...analysisPrompt,
          response_format: undefined,
          messages: [
            {
              role: 'system',
              content: `You are an expert call center analyst. Analyze this customer service call transcript and provide a structured JSON output.
              Break the conversation into segments by speaker (agent or customer).
              For each segment, provide metrics on a scale of 1-10 for: ${allMetrics.join(
                ', ',
              )}.
              Also identify key moments, summarize the call, and provide insights about both the customer and agent.
              Return your response as a valid JSON object with the structure exactly as follows:
              {
                "segments": [
                  {
                    "speaker": "agent|customer",
                    "text": "spoken text",
                    "start_time": number in seconds,
                    "end_time": number in seconds,
                    "metrics": { 
                      "tension": number, 
                      "tonality": number, 
                      "relevance": number,
                      ... additional custom metrics
                    }
                  }
                ],
                "summary": "summary text",
                "key_moments": [
                  {
                    "description": "moment description",
                    "timestamp": number in seconds,
                    "importance": number from 1-10
                  }
                ],
                "customer_info": {
                  "sentiment": "sentiment description",
                  "needs": ["need1", "need2"],
                  "satisfaction_level": number from 1-10
                },
                "agent_info": {
                  "performance": number from 1-10,
                  "strengths": ["strength1", "strength2"],
                  "improvement_areas": ["area1", "area2"]
                }
              }`,
            },
            ...analysisPrompt.messages.slice(1),
          ],
        };

        const fallbackResponse = await fetch(
          'https://api.openai.com/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            },
            body: JSON.stringify(fallbackPrompt),
          },
        );

        if (!fallbackResponse.ok) {
          const errorData = await fallbackResponse.json().catch(() => ({}));
          throw new Error(
            `Fallback analysis failed: ${
              fallbackResponse.statusText || 'Unknown error'
            } ${
              errorData.error?.message ? `- ${errorData.error.message}` : ''
            }`,
          );
        }

        const fallbackData = await fallbackResponse.json();
        // Handle potential non-JSON responses gracefully
        try {
          const fallbackAnalysis = JSON.parse(
            fallbackData.choices[0].message.content,
          );

          // Validate the structure
          validateAnalysisStructure(fallbackAnalysis);

          return fallbackAnalysis as CallAnalysis;
        } catch (parseError) {
          console.error(
            'Error parsing JSON from fallback response:',
            parseError,
          );

          // Create a minimal valid structure with the content we have
          return createMinimalValidAnalysis(transcription);
        }
      }

      throw error; // Re-throw if we're not doing a fallback
    }
  } catch (error) {
    console.error('Error analyzing call:', error);
    throw error;
  }
}

// Function to validate the structure of the analysis
function validateAnalysisStructure(analysis: Partial<CallAnalysis>): void {
  // Check if analysis has all required top-level properties
  if (!analysis.segments || !Array.isArray(analysis.segments)) {
    throw new Error('Missing or invalid segments array');
  }

  if (typeof analysis.summary !== 'string') {
    throw new Error('Missing or invalid summary');
  }

  if (!analysis.key_moments || !Array.isArray(analysis.key_moments)) {
    throw new Error('Missing or invalid key_moments array');
  }

  if (!analysis.customer_info || typeof analysis.customer_info !== 'object') {
    throw new Error('Missing or invalid customer_info');
  }

  if (!analysis.agent_info || typeof analysis.agent_info !== 'object') {
    throw new Error('Missing or invalid agent_info');
  }

  // We don't throw errors for segments content - we'll handle those with null checks in the components
}

// Function to create a minimal valid analysis when all else fails
function createMinimalValidAnalysis(transcription: string): CallAnalysis {
  return {
    segments: [
      {
        speaker: 'agent',
        text: transcription || 'No transcript available',
        start_time: 0,
        end_time: 60,
        metrics: {
          tension: 5,
          tonality: 5,
          relevance: 5,
        },
      },
    ],
    summary:
      'Analysis could not be properly generated. Here is the raw transcript: ' +
      (transcription?.substring(0, 200) + '...' || 'No transcript available'),
    key_moments: [],
    customer_info: {
      sentiment: 'Could not analyze sentiment',
      needs: ['Could not identify needs'],
      satisfaction_level: 5,
    },
    agent_info: {
      performance: 5,
      strengths: ['Could not identify strengths'],
      improvement_areas: ['Could not identify improvement areas'],
    },
  };
}
