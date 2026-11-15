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

## Configuration

No API key or other setup is needed. The search API is public: the client sends no credentials, and the server limits access by CORS origin (`app.cboard.io` in production, `localhost` in development).

The client in `src/api/cboard-symbols.js` picks its base URL in this order:

1. `REACT_APP_CBOARD_SYMBOLS_API_BASE`, if set.
2. `http://localhost:3000/api/cboard-symbols` in development (`npm start`).
3. `https://cbuilder.cboard.io/api/cboard-symbols` otherwise.

`npm start` also serves Cboard on port 3000. To search Cboard Symbols during local development, either run cboard-ai-builder on port 3000 and Cboard on another port, or point Cboard at production:

```env
REACT_APP_CBOARD_SYMBOLS_API_BASE=https://cbuilder.cboard.io/api/cboard-symbols
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
   ```
4. MongoDB query searches for "house" in English translations
5. Returns array of pictograms with all skin tone variants
6. Frontend selects appropriate variant based on user's skin tone preference
7. Results displayed in grid layout

### Skin Tone Synchronization

The integration automatically syncs skin tone between ARASAAC and Cboard Symbols:

| ARASAAC Value | Cboard Symbols Value |
| ------------- | -------------------- |
| `white`       | `skin_light`         |
| `black`       | `skin_dark`          |
| `mulatto`     | `skin_medium`        |
| `asian`       | `skin_medium_light`  |
| `aztec`       | `skin_medium_dark`   |
| (default)     | `skin_emoji`         |

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
- [ ] Test with the API unreachable (should fail silently, no crash)

### Running Unit Tests

```bash
cd cboard
npm test -- SymbolSearch.component.test.js
```

The suite currently has one test, a shallow render snapshot (`default renderer`).

### Testing API Endpoint

```bash
# Test English search
curl https://cbuilder.cboard.io/api/cboard-symbols/pictograms/en/search/house

# Test Spanish search
curl https://cbuilder.cboard.io/api/cboard-symbols/pictograms/es/search/casa
```

## Troubleshooting

### "No results found" for Cboard Symbols

**Symptoms**: Other providers work, but Cboard Symbols returns no results

**Solutions**:

1. Check which base URL the client is using (see [Configuration](#configuration)). In development it defaults to `localhost:3000`, which is Cboard itself unless cboard-ai-builder runs there.
2. Restart Cboard after changing `.env`
3. Check browser console for API errors
4. Test API endpoint with curl (see Testing section)

### CORS Errors

**Symptoms**: Browser console shows "blocked by CORS policy"

**Root Causes**:

- Frontend running on different origin than backend expects
- Missing required headers (e.g., `traceparent`, `request-id`)
- Backend not running or not accessible

**Solutions**:

1. **Verify ports**: Backend on `localhost:3000`, frontend on `localhost:3001` (or any port)
2. **Restart both applications** after changing `.env`
3. **Clear browser cache**: Hard refresh with `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
4. **Check backend is running**: Visit `http://localhost:3000` in browser

**How CORS Works** (for reference):

- Backend allows ALL `http://localhost:*` origins (any port) in development
- Backend allows `https://app.cboard.io` in production
- Allowed headers include: `Content-Type`, `request-id`, `x-request-id`, `traceparent`, `tracestate`
- No additional configuration needed - it's automatic!

**Verify CORS Headers** (in browser DevTools → Network tab):

```
Response Headers should include:
  Access-Control-Allow-Origin: http://localhost:3001
  Access-Control-Allow-Headers: Content-Type, request-id, x-request-id, traceparent, tracestate
  Access-Control-Allow-Methods: GET, OPTIONS
```

### Skin Tone Not Updating

**Symptoms**: Changing skin tone doesn't affect Cboard Symbols

**Solutions**:

1. Verify `mapArasaacToCboardSkinTone()` is imported correctly
2. Check `handleSkinToneChange` re-runs `getSuggestions`, which calls `fetchCboardSymbolsSuggestions` when Cboard Symbols is enabled
3. Verify variant selection logic in suggestions mapping

### Performance Issues

**Symptoms**: Search is slow or times out

**Solutions**:

1. Check network tab in browser DevTools for slow requests
2. Verify API timeout is set to 10s (see `src/api/cboard-symbols.js`)
3. Check MongoDB indexes in backend (should index `translations.{lang}.normalizedConcept`)
4. Consider implementing IndexedDB caching (future enhancement)

## Files

- `src/api/cboard-symbols.js` - Cboard Symbols API client
- `src/components/Board/SymbolSearch/SymbolSearch.component.js` - Cboard Symbols provider
- `src/components/Board/SymbolSearch/SymbolSearch.messages.js` - Messages
- `src/components/Board/SymbolSearch/SymbolSearch.component.test.js` - Tests

## API Reference

### Search Endpoint

```
GET https://cbuilder.cboard.io/api/cboard-symbols/pictograms/{language}/search/{searchtext}
```

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

A search with no matches returns `200` with an empty array.

**Error Responses**:

- `500 Internal Server Error`: Server error

The client treats any non-2xx response, including `404`, as no results.

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
3. Contact: support@cboard.io

## License

This integration maintains the same license as the Cboard project (GPL-3.0).
