import API from './api.js';

jest.mock('../store');

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn()
};

beforeAll(() => {
  API.axiosInstance = mockAxiosInstance;
});

Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: true
});

const mockElevenLabsVoices = {
  voices: [
    {
      voice_id: 'voice-123',
      name: 'Pepito',
      category: 'premade',
      description: 'American male voice',
      labels: { accent: 'american', age: 'middle aged', gender: 'male' }
    },
    {
      voice_id: 'voice-456',
      name: 'Pepita',
      category: 'premade',
      description: 'American female voice',
      labels: { accent: 'american', age: 'young', gender: 'female' }
    }
  ]
};

describe('ElevenLabs API calls', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    mockAxiosInstance.get.mockClear();
    mockAxiosInstance.post.mockClear();
    navigator.onLine = true;

    jest.restoreAllMocks();
  });

  afterEach(() => {
    mockAxiosInstance.get.mockReset();
    mockAxiosInstance.post.mockReset();
  });

  describe('saveElevenLabsApiKey', () => {
    it('saves API key to localStorage', () => {
      const apiKey = 'sk_123456789012345678901234567890123456789012345678';
      API.saveElevenLabsApiKey(apiKey);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'elevenlabs_api_key',
        apiKey
      );
    });
  });

  describe('getElevenLabsApiKey', () => {
    it('returns API key from localStorage', () => {
      const apiKey = 'sk_123456789012345678901234567890123456789012345678';
      localStorageMock.getItem.mockReturnValue(apiKey);

      const result = API.getElevenLabsApiKey();

      expect(localStorageMock.getItem).toHaveBeenCalledWith(
        'elevenlabs_api_key'
      );
      expect(result).toBe(apiKey);
    });

    it('returns empty string when no API key is stored', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = API.getElevenLabsApiKey();

      expect(result).toBe('');
    });
  });

  describe('validateElevenLabsApiKeyFormat', () => {
    it('validates correct API key format', () => {
      const validApiKey = 'sk_123456789012345678901234567890123456789012345678';
      const result = API.validateElevenLabsApiKeyFormat(validApiKey);
      expect(result).toBe(true);
    });

    it('rejects invalid API key format - wrong prefix', () => {
      const invalidApiKey =
        'invalid_123456789012345678901234567890123456789012345678';
      const result = API.validateElevenLabsApiKeyFormat(invalidApiKey);
      expect(result).toBe(false);
    });

    it('rejects invalid API key format - wrong length', () => {
      const invalidApiKey = 'sk_123456';
      const result = API.validateElevenLabsApiKeyFormat(invalidApiKey);
      expect(result).toBe(false);
    });

    it('rejects invalid API key format - invalid characters', () => {
      const invalidApiKey =
        'sk_12345678901234567890123456789012345678901234567g';
      const result = API.validateElevenLabsApiKeyFormat(invalidApiKey);
      expect(result).toBe(false);
    });
  });

  describe('validateElevenLabsApiKey', () => {
    it('returns invalid result for malformed API key', async () => {
      const invalidApiKey = 'invalid-key';

      const result = await API.validateElevenLabsApiKey(invalidApiKey);

      expect(result).toEqual({
        isValid: false,
        error: 'INVALID_FORMAT',
        message: 'Invalid API key format'
      });
    });

    it('returns invalid result when offline', async () => {
      const validApiKey = 'sk_123456789012345678901234567890123456789012345678';
      navigator.onLine = false;

      const result = await API.validateElevenLabsApiKey(validApiKey);

      expect(result).toEqual({
        isValid: false,
        error: 'NO_INTERNET',
        message: 'No internet connection'
      });
    });

    it('returns valid result when API key is valid and voices are returned', async () => {
      const validApiKey = 'sk_123456789012345678901234567890123456789012345678';
      localStorageMock.getItem.mockReturnValue(validApiKey);

      jest
        .spyOn(API, 'getElevenLabsVoices')
        .mockResolvedValue(mockElevenLabsVoices.voices);

      const result = await API.validateElevenLabsApiKey(validApiKey);

      expect(result).toEqual({
        isValid: true,
        error: null,
        message: 'API key is valid'
      });
    });

    it('returns invalid result when no voices are returned', async () => {
      const validApiKey = 'sk_123456789012345678901234567890123456789012345678';
      localStorageMock.getItem.mockReturnValue(validApiKey);

      jest.spyOn(API, 'getElevenLabsVoices').mockResolvedValue([]);

      const result = await API.validateElevenLabsApiKey(validApiKey);

      expect(result).toEqual({
        isValid: false,
        error: 'UNAUTHORIZED',
        message: 'API key unauthorized or expired'
      });
    });

    it('handles 401 error response', async () => {
      const validApiKey = 'sk_123456789012345678901234567890123456789012345678';
      const error = {
        response: { status: 401 }
      };

      jest.spyOn(API, 'getElevenLabsVoices').mockRejectedValue(error);

      const result = await API.validateElevenLabsApiKey(validApiKey);

      expect(result).toEqual({
        isValid: false,
        error: 'UNAUTHORIZED',
        message: 'API key unauthorized or expired'
      });
    });

    it('handles network error', async () => {
      const validApiKey = 'sk_123456789012345678901234567890123456789012345678';
      const error = new Error('Network error');

      jest.spyOn(API, 'getElevenLabsVoices').mockRejectedValue(error);

      const result = await API.validateElevenLabsApiKey(validApiKey);

      expect(result).toEqual({
        isValid: false,
        error: 'NETWORK_ERROR',
        message: 'Failed to validate API key'
      });
    });
  });

  describe('getElevenLabsVoices', () => {
    it('returns empty array when no API key is stored', async () => {
      jest.spyOn(API, 'getElevenLabsApiKey').mockReturnValue('');

      const result = await API.getElevenLabsVoices();

      expect(result).toEqual([]);
    });

    it('fetches voices successfully', async () => {
      const apiKey = 'sk_123456789012345678901234567890123456789012345678';
      jest.spyOn(API, 'getElevenLabsApiKey').mockReturnValue(apiKey);

      const expectedUrl = 'https://api.elevenlabs.io/v1/voices';
      const expectedHeaders = { 'xi-api-key': apiKey };
      const expectedConfig = {
        headers: expectedHeaders,
        timeout: 10000
      };

      mockAxiosInstance.get.mockResolvedValue({
        status: 200,
        data: mockElevenLabsVoices
      });

      const result = await API.getElevenLabsVoices();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        expectedUrl,
        expectedConfig
      );
      expect(result).toEqual(mockElevenLabsVoices.voices);
    });

    it('returns empty array on API error', async () => {
      const apiKey = 'sk_123456789012345678901234567890123456789012345678';
      jest.spyOn(API, 'getElevenLabsApiKey').mockReturnValue(apiKey);

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      mockAxiosInstance.get.mockRejectedValue(new Error('API Error'));

      const result = await API.getElevenLabsVoices();

      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        'ElevenLabs API error:',
        'API Error'
      );

      consoleSpy.mockRestore();
    });

    it('handles response with no voices property', async () => {
      const apiKey = 'sk_123456789012345678901234567890123456789012345678';
      jest.spyOn(API, 'getElevenLabsApiKey').mockReturnValue(apiKey);

      mockAxiosInstance.get.mockResolvedValue({ status: 200, data: {} });

      const result = await API.getElevenLabsVoices();

      expect(result).toEqual([]);
    });
  });

  describe('synthesizeSpeechElevenLabs', () => {
    const text = 'Hello, world!';
    const voiceId = 'voice-123';
    const apiKey = 'sk_123456789012345678901234567890123456789012345678';

    it('returns undefined when no API key is stored', async () => {
      jest.spyOn(API, 'getElevenLabsApiKey').mockReturnValue('');

      const result = await API.synthesizeSpeechElevenLabs(text, voiceId);

      expect(result).toBeUndefined();
    });

    it('throws error when offline', async () => {
      jest.spyOn(API, 'getElevenLabsApiKey').mockReturnValue(apiKey);
      navigator.onLine = false;

      await expect(
        API.synthesizeSpeechElevenLabs(text, voiceId)
      ).rejects.toThrow('No internet connection');
    });

    it('synthesizes speech successfully with default settings', async () => {
      jest.spyOn(API, 'getElevenLabsApiKey').mockReturnValue(apiKey);
      const mockBlob = new Blob(['audio data'], { type: 'audio/mpeg' });

      const expectedUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
      const expectedHeaders = {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg'
      };
      const expectedPayload = {
        text,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      };
      const expectedConfig = {
        headers: expectedHeaders,
        responseType: 'blob',
        timeout: 10000
      };

      mockAxiosInstance.post.mockResolvedValue({ status: 200, data: mockBlob });

      const result = await API.synthesizeSpeechElevenLabs(text, voiceId);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        expectedUrl,
        expectedPayload,
        expectedConfig
      );
      expect(result).toBe(mockBlob);
    });

    it('synthesizes speech with custom settings', async () => {
      jest.spyOn(API, 'getElevenLabsApiKey').mockReturnValue(apiKey);
      const mockBlob = new Blob(['audio data'], { type: 'audio/mpeg' });
      const customSettings = {
        stability: 0.8,
        similarity_boost: 0.7,
        model_id: 'eleven_multilingual_v2'
      };

      const expectedPayload = {
        text,
        voice_settings: {
          stability: 0.8,
          similarity_boost: 0.7
        },
        stability: 0.8,
        similarity_boost: 0.7,
        model_id: 'eleven_multilingual_v2'
      };

      mockAxiosInstance.post.mockResolvedValue({ status: 200, data: mockBlob });

      await API.synthesizeSpeechElevenLabs(text, voiceId, customSettings);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        expect.any(String),
        expectedPayload,
        expect.any(Object)
      );
    });

    it('throws error on 401 unauthorized response', async () => {
      jest.spyOn(API, 'getElevenLabsApiKey').mockReturnValue(apiKey);

      const error = {
        response: { status: 401 }
      };
      mockAxiosInstance.post.mockRejectedValue(error);

      await expect(
        API.synthesizeSpeechElevenLabs(text, voiceId)
      ).rejects.toThrow('API key unauthorized or expired');
    });

    it('throws error on 429 rate limit response', async () => {
      jest.spyOn(API, 'getElevenLabsApiKey').mockReturnValue(apiKey);

      const error = {
        response: { status: 429 }
      };
      mockAxiosInstance.post.mockRejectedValue(error);

      await expect(
        API.synthesizeSpeechElevenLabs(text, voiceId)
      ).rejects.toThrow('Rate limit exceeded');
    });

    it('throws error on timeout', async () => {
      jest.spyOn(API, 'getElevenLabsApiKey').mockReturnValue(apiKey);

      const error = {
        code: 'ECONNABORTED'
      };
      mockAxiosInstance.post.mockRejectedValue(error);

      await expect(
        API.synthesizeSpeechElevenLabs(text, voiceId)
      ).rejects.toThrow('Request timed out');
    });

    it('throws generic error for other failures', async () => {
      jest.spyOn(API, 'getElevenLabsApiKey').mockReturnValue(apiKey);

      const error = new Error('Generic network error');
      mockAxiosInstance.post.mockRejectedValue(error);

      await expect(
        API.synthesizeSpeechElevenLabs(text, voiceId)
      ).rejects.toThrow('Generic network error');
    });

    it('throws default error message when no error message is provided', async () => {
      jest.spyOn(API, 'getElevenLabsApiKey').mockReturnValue(apiKey);

      const error = {};
      mockAxiosInstance.post.mockRejectedValue(error);

      await expect(
        API.synthesizeSpeechElevenLabs(text, voiceId)
      ).rejects.toThrow('Failed to synthesize speech');
    });

    it('throws error for non-200 status response', async () => {
      jest.spyOn(API, 'getElevenLabsApiKey').mockReturnValue(apiKey);

      mockAxiosInstance.post.mockResolvedValue({
        status: 500,
        data: 'Server error'
      });

      await expect(
        API.synthesizeSpeechElevenLabs(text, voiceId)
      ).rejects.toThrow('Failed to synthesize speech');
    });
  });
});
