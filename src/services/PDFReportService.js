import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from '../vfs_fonts';
import moment from 'moment';
import { FONTS } from '../components/Settings/Export/Export.constants';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  Roboto: FONTS['Roboto'],
};

const COLORS = {
  primary: '#4CAF50',
  secondary: '#2196F3',
  text: '#333333',
  lightGray: '#F5F5F5',
  border: '#DDDDDD',
};

class PDFReportService {
  constructor() {
    this.pageSize = 'A4';
    this.pageMargins = [40, 60, 40, 60];
  }

  async generateCommunicationReport(data) {
    const {
      entries = [],
      userId = 'Unknown',
      userName = 'User',
      dateRange = {},
    } = data;

    const docDefinition = {
      pageSize: this.pageSize,
      pageMargins: this.pageMargins,
      header: this.createHeader(),
      footer: this.createFooter(),
      content: [
        this.createTitle(),
        this.createReportInfo(userName, userId, dateRange, entries.length),
        this.createSummarySection(entries),
        {
          text: 'Communication History',
          style: 'sectionHeader',
          pageBreak: 'before',
        },
        this.createEntriesTable(entries),
      ],
      styles: this.getStyles(),
      defaultStyle: {
        font: 'Roboto',
      },
    };

    return new Promise((resolve, reject) => {
      try {
        const pdfDoc = pdfMake.createPdf(docDefinition);
        pdfDoc.download(
          `communication_report_${moment().format('YYYY-MM-DD_HHmmss')}.pdf`,
        );
        resolve({ success: true });
      } catch (error) {
        reject(error);
      }
    });
  }

  createHeader() {
    return (currentPage, pageCount) => ({
      columns: [
        {
          text: 'Cboard Communication Report',
          style: 'headerText',
          alignment: 'left',
          margin: [40, 20, 0, 0],
        },
        {
          text: `Page ${currentPage} of ${pageCount}`,
          style: 'headerText',
          alignment: 'right',
          margin: [0, 20, 40, 0],
        },
      ],
    });
  }

  createFooter() {
    return {
      columns: [
        {
          text: `Generated on ${moment().format('MMMM DD, YYYY HH:mm')}`,
          style: 'footerText',
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
      ],
    };
  }

  createTitle() {
    return {
      text: 'Communication History Report',
      style: 'mainTitle',
      alignment: 'center',
      margin: [0, 0, 0, 30],
    };
  }

  createReportInfo(userName, userId, dateRange, totalEntries) {
    const fromDate = dateRange.from
      ? moment(dateRange.from).format('MMM DD, YYYY')
      : 'Beginning';
    const toDate = dateRange.to
      ? moment(dateRange.to).format('MMM DD, YYYY')
      : 'Present';

    return {
      style: 'infoSection',
      table: {
        widths: ['30%', '70%'],
        body: [
          [
            { text: 'User Name:', style: 'label' },
            { text: userName, style: 'value' },
          ],
          [
            { text: 'User ID:', style: 'label' },
            { text: userId, style: 'value' },
          ],
          [
            { text: 'Date Range:', style: 'label' },
            { text: `${fromDate} - ${toDate}`, style: 'value' },
          ],
          [
            { text: 'Total Interactions:', style: 'label' },
            { text: totalEntries.toString(), style: 'value' },
          ],
        ],
      },
      layout: 'noBorders',
      margin: [0, 0, 0, 30],
    };
  }

  createSummarySection(entries) {
    const symbolCount = entries.filter((e) => e.type === 'symbol').length;
    const phraseCount = entries.filter((e) => e.type === 'phrase').length;
    const clearCount = entries.filter((e) => e.type === 'clear').length;
    const backspaceCount = entries.filter((e) => e.type === 'backspace').length;

    const frequentWords = this.getFrequentWords(entries);
    const sessionsData = this.getSessionsData(entries);

    return [
      {
        text: 'Summary Statistics',
        style: 'sectionHeader',
        margin: [0, 0, 0, 15],
      },
      {
        columns: [
          {
            width: '50%',
            stack: [
              {
                text: 'Interaction Types',
                style: 'subHeader',
                margin: [0, 0, 0, 10],
              },
              {
                ul: [
                  `Symbols/Words: ${symbolCount}`,
                  `Phrases: ${phraseCount}`,
                  `Clear Actions: ${clearCount}`,
                  `Backspace Actions: ${backspaceCount}`,
                ],
                style: 'summaryList',
              },
            ],
          },
          {
            width: '50%',
            stack: [
              {
                text: 'Session Information',
                style: 'subHeader',
                margin: [0, 0, 0, 10],
              },
              {
                ul: [
                  `Total Sessions: ${sessionsData.totalSessions}`,
                  `Average Interactions per Session: ${
                    sessionsData.avgInteractions
                  }`,
                  `Most Active Day: ${sessionsData.mostActiveDay}`,
                  `Peak Hour: ${sessionsData.peakHour}`,
                ],
                style: 'summaryList',
              },
            ],
          },
        ],
        margin: [0, 0, 0, 20],
      },
      {
        text: 'Most Frequently Used Words/Symbols',
        style: 'subHeader',
        margin: [0, 10, 0, 10],
      },
      {
        table: {
          widths: ['60%', '40%'],
          body: [
            [
              { text: 'Word/Symbol', style: 'tableHeader' },
              { text: 'Frequency', style: 'tableHeader' },
            ],
            ...frequentWords.map((item) => [
              { text: item.word, style: 'tableCell' },
              { text: item.count.toString(), style: 'tableCell' },
            ]),
          ],
        },
        layout: this.getTableLayout(),
        margin: [0, 0, 0, 30],
      },
    ];
  }

  createEntriesTable(entries) {
    const sortedEntries = [...entries].sort(
      (a, b) => moment(b.timestamp).valueOf() - moment(a.timestamp).valueOf(),
    );

    const tableBody = [
      [
        { text: 'Date & Time', style: 'tableHeader' },
        { text: 'Type', style: 'tableHeader' },
        { text: 'Content', style: 'tableHeader' },
        { text: 'Details', style: 'tableHeader' },
      ],
    ];

    sortedEntries.forEach((entry) => {
      const row = [
        {
          text: moment(entry.timestamp).format('MMM DD, YYYY HH:mm:ss'),
          style: 'tableCell',
          fontSize: 9,
        },
        {
          text: this.formatType(entry.type),
          style: 'tableCell',
          fontSize: 9,
        },
        {
          text: this.formatContent(entry),
          style: 'tableCell',
          fontSize: 9,
        },
        {
          text: this.formatDetails(entry),
          style: 'tableCell',
          fontSize: 8,
        },
      ];
      tableBody.push(row);
    });

    return {
      table: {
        headerRows: 1,
        widths: ['22%', '15%', '38%', '25%'],
        body: tableBody,
      },
      layout: this.getTableLayout(),
    };
  }

  formatType(type) {
    const typeMap = {
      symbol: 'Symbol',
      phrase: 'Phrase',
      pictogram: 'Pictogram',
      clear: 'Clear',
      backspace: 'Backspace',
    };
    return typeMap[type] || type;
  }

  formatContent(entry) {
    if (entry.type === 'phrase' && entry.symbols) {
      return entry.symbols.map((s) => s.label || '').join(' ');
    }
    return entry.label || '-';
  }

  formatDetails(entry) {
    const details = [];

    if (entry.metadata) {
      if (entry.metadata.symbolCount) {
        details.push(`${entry.metadata.symbolCount} symbols`);
      }
      if (entry.metadata.hasImages) {
        details.push('Has images');
      }
      if (entry.metadata.vocalization) {
        details.push(`Spoken: "${entry.metadata.vocalization}"`);
      }
    }

    if (entry.sessionId) {
      details.push(`Session: ${entry.sessionId.substring(0, 8)}`);
    }

    return details.join(', ') || '-';
  }

  getFrequentWords(entries, limit = 10) {
    const wordCount = {};

    entries.forEach((entry) => {
      if (entry.type === 'symbol' && entry.label) {
        const word = entry.label.toLowerCase();
        wordCount[word] = (wordCount[word] || 0) + 1;
      } else if (entry.type === 'phrase' && entry.symbols) {
        entry.symbols.forEach((symbol) => {
          if (symbol.label) {
            const word = symbol.label.toLowerCase();
            wordCount[word] = (wordCount[word] || 0) + 1;
          }
        });
      }
    });

    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([word, count]) => ({ word, count }));
  }

  getSessionsData(entries) {
    const sessions = {};
    const dayActivity = {};
    const hourActivity = {};

    entries.forEach((entry) => {
      const sessionId = entry.sessionId || 'default';
      const day = moment(entry.timestamp).format('dddd');
      const hour = moment(entry.timestamp).hour();

      sessions[sessionId] = (sessions[sessionId] || 0) + 1;
      dayActivity[day] = (dayActivity[day] || 0) + 1;
      hourActivity[hour] = (hourActivity[hour] || 0) + 1;
    });

    const totalSessions = Object.keys(sessions).length;
    const totalInteractions = entries.length;
    const avgInteractions =
      totalSessions > 0 ? Math.round(totalInteractions / totalSessions) : 0;

    const mostActiveDay =
      Object.entries(dayActivity).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      'N/A';

    const peakHour = Object.entries(hourActivity).sort(
      ([, a], [, b]) => b - a,
    )[0];
    const peakHourFormatted = peakHour
      ? `${peakHour[0]}:00 - ${parseInt(peakHour[0]) + 1}:00`
      : 'N/A';

    return {
      totalSessions,
      avgInteractions,
      mostActiveDay,
      peakHour: peakHourFormatted,
    };
  }

  getTableLayout() {
    return {
      hLineWidth: (i, node) =>
        i === 0 || i === node.table.body.length ? 1 : 0.5,
      vLineWidth: () => 0.5,
      hLineColor: () => COLORS.border,
      vLineColor: () => COLORS.border,
      paddingLeft: () => 8,
      paddingRight: () => 8,
      paddingTop: () => 4,
      paddingBottom: () => 4,
      fillColor: (rowIndex) => {
        if (rowIndex === 0) return COLORS.primary;
        return rowIndex % 2 === 0 ? COLORS.lightGray : null;
      },
    };
  }

  getStyles() {
    return {
      mainTitle: {
        fontSize: 24,
        bold: true,
        color: COLORS.primary,
      },
      sectionHeader: {
        fontSize: 16,
        bold: true,
        color: COLORS.primary,
        margin: [0, 15, 0, 10],
      },
      subHeader: {
        fontSize: 13,
        bold: true,
        color: COLORS.secondary,
      },
      headerText: {
        fontSize: 10,
        color: COLORS.text,
      },
      footerText: {
        fontSize: 9,
        color: COLORS.text,
      },
      label: {
        fontSize: 11,
        bold: true,
        color: COLORS.text,
      },
      value: {
        fontSize: 11,
        color: COLORS.text,
      },
      tableHeader: {
        bold: true,
        fontSize: 11,
        color: 'white',
        fillColor: COLORS.primary,
      },
      tableCell: {
        fontSize: 10,
        color: COLORS.text,
      },
      summaryList: {
        fontSize: 11,
        color: COLORS.text,
        lineHeight: 1.5,
      },
      infoSection: {
        margin: [0, 0, 0, 20],
      },
    };
  }

  async generateImageFromURL(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const maxWidth = 50;
        const maxHeight = 50;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        resolve({
          image: canvas.toDataURL(),
          width: width,
          height: height,
        });
      };
      img.onerror = () => {
        resolve(null);
      };
      img.src = url;
    });
  }
}

const pdfReportService = new PDFReportService();
export default pdfReportService;
