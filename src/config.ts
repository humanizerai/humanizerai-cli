import { HumanizeRaiAPI } from './api';

export function getApi(): HumanizeRaiAPI {
  const apiKey = process.env.HUMANIZERAI_API_KEY;
  if (!apiKey) {
    console.error('Error: HUMANIZERAI_API_KEY is not set.');
    console.error('');
    console.error('Set it with:');
    console.error('  export HUMANIZERAI_API_KEY=hum_your_api_key');
    console.error('');
    console.error('Get your API key at https://humanizerai.com/dashboard');
    process.exit(1);
  }

  const apiUrl = process.env.HUMANIZERAI_API_URL;
  return new HumanizeRaiAPI({ apiKey, apiUrl });
}
