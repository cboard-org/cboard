import { ELEVENLABS_API_BASE_URL } from '../../../constants';

class ElevenLabsEngine {
  constructor() {
    this.apiKey = null;
  }

  initialize(apiKey) {
    this.apiKey = apiKey;
  }

  isInitialized() {
    return this.apiKey !== null;
  }

  validateApiKeyFormat(apiKey) {
    const apiKeyRegex = /^sk_[a-f0-9]{48}$/;
    return apiKeyRegex.test(apiKey);
  }

  async getElevenLabsVoices() {
    if (!this.isInitialized()) {
      return [];
    }

    try {
      const response = await fetch(`${ELEVENLABS_API_BASE_URL}/v2/voices`, {
        method: 'GET',
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

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
              stability: settings.stability,
              similarity_boost: settings.similarity_boost,
              style: settings.style
            },
            model_id: settings.model_id || 'elevenlabs_multilingual_v2'
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

  reset() {
    this.apiKey = null;
  }
}

const elevenLabsEngine = new ElevenLabsEngine();
export default elevenLabsEngine;
