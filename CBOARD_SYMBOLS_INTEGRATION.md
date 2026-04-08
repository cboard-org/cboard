# Cboard Symbols Integration Guide

This document explains how to set up and use the Cboard Symbols integration in the main Cboard application.

## Overview

Cboard Symbols is a curated symbol library from the cboard-ai-builder project that has been integrated as a **4th symbol provider** alongside:
- Mulberry (local)
- Global Symbols (API)
- ARASAAC (hybrid with IndexedDB)

## Features

✅ **Search Cboard Symbols** via production API at `https://cbuilder.cboard.io`  
✅ **Skin Tone Support** - Syncs automatically with ARASAAC skin tone selection  
✅ **6 Skin Tone Variants**: emoji, light, medium-light, medium, medium-dark, dark  
✅ **Internationalized Search** - Supports all Cboard languages  
✅ **Enabled by Default** - Available to all users immediately  
✅ **Graceful Degradation** - Falls back silently if API unavailable  

## Setup Instructions

### 1. Generate API Key

Generate a secure API key that will be shared between both applications:

```bash
openssl rand -base64 32
```

Example output:
```
aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890ABCD==
```

### 2. Configure Backend (cboard-ai-builder)

Add the API key to `/cboard-ai-builder/.env`:

```env
# API Key for Cboard main app to access Cboard Symbols
CBOARD_API_KEY=aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890ABCD==
```

### 3. Configure Frontend (cboard)

Add the **same** API key to `/cboard/.env`:

```env
# Cboard Symbols API Key (must match backend)
REACT_APP_CBOARD_SYMBOLS_API_KEY=aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890ABCD==
```

### 4. Restart Both Applications

```bash
# In cboard-ai-builder
npm run dev

# In cboard
npm start
```

## How It Works

### Architecture

```
User types in SymbolSearch
         ↓
  Debounced (300ms)
         ↓
  getSuggestions()
         ↓
  ┌──────┴──────┬──────────┬────────────┐
  ↓             ↓          ↓            ↓
Mulberry    ARASAAC   Global       Cboard
(local)  (IndexedDB) Symbols      Symbols
                        ↓            ↓
                    External     Production
                      API           API
                                    ↓
                         https://cbuilder.cboard.io
                                    ↓
                           [API Key Check]
                                    ↓
                            MongoDB Query
                                    ↓
                         Results with Variants
```

### API Request Flow

1. User types "house" in SymbolSearch
2. After 300ms debounce, `fetchCboardSymbolsSuggestions('house')` is called
3. API client sends request:
   ```
   GET https://cbuilder.cboard.io/api/cboard-symbols/pictograms/en/search/house
   Headers: X-API-Key: <your-api-key>
   ```
4. Backend validates API key
5. MongoDB query searches for "house" in English translations
6. Returns array of pictograms with all skin tone variants
7. Frontend selects appropriate variant based on user's skin tone preference
8. Results displayed in grid layout

### Skin Tone Synchronization

The integration automatically syncs skin tone between ARASAAC and Cboard Symbols:

| ARASAAC Value | Cboard Symbols Value |
|---------------|---------------------|
| `white`       | `skin_light`        |
| `black`       | `skin_dark`         |
| `mulatto`     | `skin_medium`       |
| `asian`       | `skin_medium_light` |
| `aztec`       | `skin_medium_dark`  |
| (default)     | `skin_emoji`        |

When a user changes the skin tone slider, both ARASAAC and Cboard Symbols results update automatically.

## Testing

### Manual Testing Checklist

- [ ] Open Tile Editor and click Search button
- [ ] Verify 4 providers appear in FilterBar (Mulberry, Global Symbols, ARASAAC, Cboard Symbols)
- [ ] Type "house" and verify results appear from Cboard Symbols
- [ ] Toggle Cboard Symbols on/off and verify results update
- [ ] Change skin tone and verify Cboard Symbols update
- [ ] Select a Cboard Symbol and verify it saves to tile
- [ ] Test in multiple languages (en, es, pt, fr)
- [ ] Test with slow network (results should still appear)
- [ ] Test with API key removed (should fail silently, no crash)

### Running Unit Tests

```bash
cd cboard
npm test -- SymbolSearch.component.test.js
```

Expected output:
```
PASS  src/components/Board/SymbolSearch/SymbolSearch.component.test.js
  SymbolSearch tests
    ✓ default renderer
    ✓ includes Cboard Symbols in symbolSets
    ✓ has isFetchingCboardSymbols in state
    ✓ fetchCboardSymbolsSuggestions calls API with correct params
    ✓ fetchCboardSymbolsSuggestions transforms API response correctly
    ✓ showInclusivityOptions is true when ARASAAC or Cboard Symbols enabled
    ✓ skin tone syncs between ARASAAC and Cboard Symbols
    ✓ getSuggestions calls fetchCboardSymbolsSuggestions when enabled
    ✓ getSuggestions does not call fetchCboardSymbolsSuggestions when disabled
```

### Testing API Endpoint

```bash
# Replace with your actual API key
API_KEY="aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890ABCD=="

# Test English search
curl -H "X-API-Key: $API_KEY" \
  https://cbuilder.cboard.io/api/cboard-symbols/pictograms/en/search/house

# Test Spanish search
curl -H "X-API-Key: $API_KEY" \
  https://cbuilder.cboard.io/api/cboard-symbols/pictograms/es/search/casa

# Test without API key (should return 401)
curl https://cbuilder.cboard.io/api/cboard-symbols/pictograms/en/search/house
```

## Troubleshooting

### "No results found" for Cboard Symbols

**Symptoms**: Other providers work, but Cboard Symbols returns no results

**Solutions**:
1. Check API key is set in `.env` (both frontend and backend)
2. Verify keys match exactly (no extra spaces)
3. Restart both applications after changing `.env`
4. Check browser console for API errors
5. Test API endpoint with curl (see Testing section)

### "401 Unauthorized" Error

**Symptoms**: Console shows "Unauthorized - check API key"

**Solutions**:
1. Verify `CBOARD_API_KEY` is set in cboard-ai-builder `.env`
2. Verify `REACT_APP_CBOARD_SYMBOLS_API_KEY` is set in cboard `.env`
3. Ensure both keys are identical
4. Check environment variables are loaded: `console.log(process.env.REACT_APP_CBOARD_SYMBOLS_API_KEY)`

### CORS Errors

**Symptoms**: Browser console shows "blocked by CORS policy"

**Root Causes**:
- Frontend running on different origin than backend expects
- Missing required headers (e.g., `traceparent`, `request-id`)
- Backend not running or not accessible

**Solutions**:
1. **Verify ports**: Backend on `localhost:3000`, frontend on `localhost:3001` (or any port)
2. **Check API key**: Must be set in both `.env` files
3. **Restart both applications** after changing `.env`
4. **Clear browser cache**: Hard refresh with `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
5. **Check backend is running**: Visit `http://localhost:3000` in browser

**How CORS Works** (for reference):
- Backend allows ALL `http://localhost:*` origins (any port) in development
- Backend allows `https://app.cboard.io` in production
- Allowed headers include: `X-API-Key`, `Content-Type`, `request-id`, `x-request-id`, `traceparent`, `tracestate`
- No additional configuration needed - it's automatic!

**Verify CORS Headers** (in browser DevTools → Network tab):
```
Response Headers should include:
  Access-Control-Allow-Origin: http://localhost:3001
  Access-Control-Allow-Headers: X-API-Key, Content-Type, request-id, x-request-id, traceparent, tracestate
  Access-Control-Allow-Methods: GET, OPTIONS
```

### Skin Tone Not Updating

**Symptoms**: Changing skin tone doesn't affect Cboard Symbols

**Solutions**:
1. Verify `mapArasaacToCboardSkinTone()` is imported correctly
2. Check `fetchCboardSymbolsSuggestions` is called in `handleSkinToneChange`
3. Verify variant selection logic in suggestions mapping

### Performance Issues

**Symptoms**: Search is slow or times out

**Solutions**:
1. Check network tab in browser DevTools for slow requests
2. Verify API timeout is set to 10s (see `/cboard/src/api/cboard-symbols.js`)
3. Check MongoDB indexes in backend (should index `translations.{lang}.normalizedConcept`)
4. Consider implementing IndexedDB caching (future enhancement)

## File Changes Summary

### Backend (cboard-ai-builder)

**New Files**:
- `/src/middleware/apiKey.ts` - API key validation middleware
- `/API_KEY_SETUP.md` - API key setup documentation

**Modified Files**:
- `/src/app/api/cboard-symbols/pictograms/[language]/search/[searchtext]/route.ts` - Added API key auth
- `/.env` - Added `CBOARD_API_KEY`

### Frontend (cboard)

**New Files**:
- `/src/api/cboard-symbols.js` - Cboard Symbols API client
- `/CBOARD_SYMBOLS_INTEGRATION.md` - This file

**Modified Files**:
- `/src/components/Board/SymbolSearch/SymbolSearch.component.js` - Added Cboard Symbols provider
- `/src/components/Board/SymbolSearch/SymbolSearch.messages.js` - Added messages
- `/src/components/Board/SymbolSearch/SymbolSearch.component.test.js` - Added tests
- `/.env` - Added `REACT_APP_CBOARD_SYMBOLS_API_KEY`

## API Reference

### Search Endpoint

```
GET https://cbuilder.cboard.io/api/cboard-symbols/pictograms/{language}/search/{searchtext}
```

**Headers**:
- `X-API-Key` (required): Your API key

**Path Parameters**:
- `language` (string): 2-letter ISO language code (e.g., "en", "es", "pt")
- `searchtext` (string): URL-encoded search query

**Response** (200):
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "url": "https://example.com/symbol.png",
    "userId": "user123",
    "originalLanguage": "en",
    "translations": {
      "en": {
        "concept": "house",
        "normalizedConcept": "house",
        "keywords": ["home", "building"]
      },
      "es": {
        "concept": "casa",
        "normalizedConcept": "casa",
        "keywords": ["hogar", "vivienda"]
      }
    },
    "variants": [
      {
        "url": "https://example.com/symbol-emoji.png",
        "skinTone": "skin_emoji"
      },
      {
        "url": "https://example.com/symbol-light.png",
        "skinTone": "skin_light"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing API key
- `404 Not Found`: No results for search query
- `500 Internal Server Error`: Server error

## Future Enhancements

### Phase 2 (Future)
- [ ] Add IndexedDB caching for offline support
- [ ] Display user ratings in search results
- [ ] Sort by relevance score and user ratings
- [ ] Add symbol preview on hover
- [ ] Show symbol metadata (author, date)

### Phase 3 (Future)
- [ ] Allow users to contribute symbols
- [ ] Add symbol collections/categories
- [ ] Implement advanced filtering
- [ ] Add symbol usage analytics
- [ ] Create symbol recommendations

## Support

For issues or questions:
1. Check this documentation
2. Review GitHub issues: [cboard-org/cboard](https://github.com/cboard-org/cboard/issues)
3. Check API setup: `/cboard-ai-builder/API_KEY_SETUP.md`
4. Contact: support@cboard.io

## License

This integration maintains the same license as the Cboard project (GPL-3.0).
