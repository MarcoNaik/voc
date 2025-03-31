# Call Analysis AI

A React application that analyzes customer service call recordings using OpenAI's structured outputs.

## Features

- Upload audio files of customer service calls
- AI analysis provides structured insights:
  - Dialogue breakdown with tension, tonality, and relevance metrics
  - Call summary with key moments
  - Customer sentiment and needs analysis
  - Agent performance evaluation
- Add custom parameters to analyze beyond the defaults
- Visual presentation of all metrics

## Technology Stack

- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- OpenAI API for audio transcription and analysis

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```
4. Run the development server:
   ```
   npm run dev
   ```

## How It Works

1. The application allows users to upload audio files
2. The audio is sent to OpenAI's Whisper API for transcription
3. The transcript is then analyzed by GPT-4 with structured outputs
4. The analysis results are displayed in a user-friendly interface

## License

MIT
