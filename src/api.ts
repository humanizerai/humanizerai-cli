export interface HumanizeRaiConfig {
  apiKey: string;
  apiUrl?: string;
}

export interface DetectResponse {
  score: {
    overall: number;
    perplexity: number;
    burstiness: number;
    readability: number;
    satPercent: number;
    simplicity: number;
    ngramScore: number;
    averageSentenceLength: number;
  };
  wordCount: number;
  sentenceCount: number;
  verdict: string;
}

export interface HumanizeResponse {
  humanizedText: string;
  score: {
    before: number;
    after: number;
  };
  wordsProcessed: number;
  credits: {
    subscriptionRemaining: number;
    topUpRemaining: number;
    totalRemaining: number;
  };
}

export interface CreditsResponse {
  credits: {
    subscription: number;
    topUp: number;
    total: number;
  };
  plan: string;
  billingCycleEnd: string | null;
}

export class HumanizeRaiAPI {
  private apiKey: string;
  private apiUrl: string;

  constructor(config: HumanizeRaiConfig) {
    this.apiKey = config.apiKey;
    this.apiUrl = config.apiUrl || 'https://humanizerai.com/api/v1';
  }

  private async request<T>(endpoint: string, options: any = {}): Promise<T> {
    const url = `${this.apiUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
      const msg = (error as any).message || `API Error (${response.status})`;
      throw new Error(msg);
    }

    return (await response.json()) as T;
  }

  async detect(text: string): Promise<DetectResponse> {
    return this.request<DetectResponse>('/detect', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async humanize(text: string, intensity: string = 'medium'): Promise<HumanizeResponse> {
    return this.request<HumanizeResponse>('/humanize', {
      method: 'POST',
      body: JSON.stringify({ text, intensity }),
    });
  }

  async credits(): Promise<CreditsResponse> {
    return this.request<CreditsResponse>('/credits', {
      method: 'GET',
    });
  }
}
