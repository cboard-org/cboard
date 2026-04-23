# Communication History Feature

## Overview

The Communication History feature enables tracking and exporting detailed reports of AAC (Augmentative and Alternative Communication) usage in Cboard. This feature is designed for therapists, educators, and caregivers to monitor communication patterns and progress over time.

## Features

### 1. Automatic Tracking
- **Symbol Selection**: Every symbol/pictogram selected is recorded with timestamp
- **Phrase Construction**: Complete phrases are tracked when spoken
- **User Actions**: Clear and backspace actions are logged
- **Session Management**: Interactions are grouped by session for analysis

### 2. Data Collection
Each interaction records:
- **Timestamp**: Exact date and time of interaction
- **Type**: Symbol, phrase, clear, or backspace action
- **Content**: Label and associated image/pictogram
- **Metadata**: Board ID, vocalization text, symbol count
- **User Information**: User ID and session ID (if available)

### 3. PDF Report Generation
Professional PDF reports include:
- **Summary Statistics**:
  - Total interactions count
  - Symbol vs phrase breakdown
  - Session information
  - Peak usage times
  - Most frequently used words/symbols

- **Detailed History**:
  - Chronological list of all interactions
  - Date and time stamps
  - Content with pictograms (if enabled)
  - Session grouping

- **Export Options**:
  - Date range filtering (today, last week, last month, custom)
  - User filtering (for multi-user setups)
  - Include/exclude images
  - Include/exclude metadata

### 4. Privacy & Security
- **Local Storage**: Data stored locally on device
- **User Control**: Clear history at any time
- **No External Sharing**: Data never shared without explicit consent
- **Session Isolation**: Each user's data kept separate

## Usage

### For Users

1. **Access the Feature**:
   - Navigate to Settings → Communication Report

2. **View Statistics**:
   - See overview of communication activity
   - Monitor progress over time

3. **Export Report**:
   - Click "Export PDF Report"
   - Select date range and options
   - Download professional PDF document

4. **Clear History**:
   - Click "Clear History" to remove all data
   - Confirmation required to prevent accidental deletion

### For Developers

#### Adding Communication Tracking

```javascript
import { trackSymbolSelection } from './CommunicationHistory.actions';

// Track when user selects a symbol
const tile = {
  id: 'tile123',
  label: 'Water',
  image: 'water.png',
  boardId: 'board456'
};

trackSymbolSelection(tile, userId, sessionId);
```

#### Accessing History Data

```javascript
// In Redux connected component
const mapStateToProps = state => ({
  communicationHistory: state.communicationHistory.entries
});
```

#### Generating Reports

```javascript
import PDFReportService from './services/PDFReportService';

const reportData = {
  entries: communicationHistory,
  userId: 'user@example.com',
  userName: 'John Doe',
  dateRange: { from: '2024-01-01', to: '2024-01-31' }
};

await PDFReportService.generateCommunicationReport(reportData);
```

## Architecture

### Redux Store Structure
```javascript
{
  communicationHistory: {
    entries: [
      {
        id: 'unique_id',
        type: 'symbol|phrase|clear|backspace',
        label: 'Text content',
        image: 'image_url',
        timestamp: 'ISO 8601 date',
        userId: 'user_identifier',
        sessionId: 'session_identifier',
        metadata: { /* additional data */ }
      }
    ],
    isExporting: false,
    exportError: null,
    lastExport: 'ISO 8601 date'
  }
}
```

### Components
- **CommunicationHistory**: Main settings page component
- **ExportDialog**: PDF export configuration dialog
- **PDFReportService**: PDF generation service

### Actions
- `addCommunicationEntry`: Add new interaction
- `trackSymbolSelection`: Track symbol click
- `trackPhraseSpoken`: Track phrase vocalization
- `clearCommunicationHistory`: Clear all or user-specific data

## Clinical Benefits

### For Therapists
- **Progress Monitoring**: Track communication development over time
- **Pattern Analysis**: Identify frequently used vocabulary
- **Session Planning**: Data-driven therapy planning
- **Documentation**: Professional reports for insurance/records

### For Educators
- **Curriculum Planning**: Understand student communication needs
- **IEP Documentation**: Support for Individual Education Plans
- **Parent Communication**: Share progress with families

### For Families
- **Home Practice**: Monitor AAC usage at home
- **Progress Sharing**: Share reports with therapy team
- **Motivation**: Visualize communication growth

## Future Enhancements

Potential improvements for future versions:
- Cloud synchronization across devices
- Advanced analytics and visualizations
- Custom report templates
- API for third-party integrations
- Machine learning insights
- Multi-language report generation

## Support

For questions or issues related to the Communication History feature:
- Email: support@cboard.io
- GitHub Issues: https://github.com/cboard-org/cboard/issues

## License

This feature is part of Cboard and is licensed under GPL-3.0.