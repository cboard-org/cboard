import { ELEVENLABS_API_BASE_URL } from '../../../constants';

export function validateApiKeyFormat(apiKey) {
  const apiKeyRegex = /^sk_[a-f0-9]{48}$/;
  return apiKeyRegex.test(apiKey);
}

export class ElevenLabsEngine {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('ElevenLabs API key is required');
    }
    if (!validateApiKeyFormat(apiKey)) {
      throw new Error('Invalid ElevenLabs API key format');
    }
    this.apiKey = apiKey;
  }

  isInitialized() {
    return this.apiKey !== null;
  }

  async getElevenLabsPersonalVoices() {
    if (!this.isInitialized()) {
      return [];
    }

    try {
      const response = await fetch(
        `${ELEVENLABS_API_BASE_URL}/v2/voices?voice_type=personal`,
        {
          method: 'GET',
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error('ElevenLabs API error:', error.message);
      return [];
    }
  }

  async synthesizeSpeechElevenLabs(text, voiceId, settings = {}) {
    if (!this.isInitialized()) {
      throw new Error('ElevenLabs engine not initialized');
    }

    try {
      const response = await fetch(
        `${ELEVENLABS_API_BASE_URL}/v1/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text,
            voice_settings: {
              stability: settings.stability ?? 0.5,
              similarity_boost: settings.similarity_boost ?? 0.75,
              ...(settings.style !== undefined && { style: settings.style })
            },
            model_id: settings.model_id || 'eleven_turbo_v2_5'
          })
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('API key unauthorized or expired');
        }
        if (response.status === 429) {
          throw new Error('Rate limit exceeded');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.blob();
    } catch (error) {
      if (
        error.message.includes('unauthorized') ||
        error.message.includes('401')
      ) {
        throw new Error('API key unauthorized or expired');
      }
      if (error.message.includes('429')) {
        throw new Error('Rate limit exceeded');
      }
      throw new Error(error.message || 'Failed to synthesize speech');
    }
  }

  async testConnection() {
    if (!this.isInitialized()) {
      throw new Error('ElevenLabs engine not initialized');
    }

    try {
      const response = await fetch(`${ELEVENLABS_API_BASE_URL}/v1/user`, {
        method: 'GET',
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 400) {
          return { isValid: false, error: 'UNAUTHORIZED' };
        }
        return { isValid: false, error: `HTTP_${response.status}` };
      }

      return { isValid: true };
    } catch (error) {
      return { isValid: false, error: 'CONNECTION_ERROR' };
    }
  }

  reset() {
    this.apiKey = null;
  }
}
