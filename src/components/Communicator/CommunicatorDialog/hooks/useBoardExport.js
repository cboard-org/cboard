import { useCallback } from 'react';
import messages from '../CommunicatorDialog.messages';
import { MEDIUM_FONT_SIZE } from '../../../Settings/Export/Export.constants';

const useBoardExport = ({ intl, showNotification }) => {
  const exportBoard = useCallback(
    async (board) => {
      try {
        // Loaded lazily: Export.helpers pulls in pdfmake + vfs_fonts (~1.7MB)
        // at module scope, which we only want paid for on an actual export.
        const { openboardExportOneAdapter } =
          await import('../../../Settings/Export/Export.helpers');
        await openboardExportOneAdapter(board, intl);
        showNotification(
          intl.formatMessage(messages.boardExported, { name: board.name })
        );
      } catch (err) {
        showNotification(
          intl.formatMessage(messages.boardExportError, { name: board.name })
        );
      }
    },
    [intl, showNotification]
  );

  const exportBoardToPdf = useCallback(
    async (board) => {
      try {
        // Same lazy-load rationale as exportBoard above.
        const { pdfExportAdapter } =
          await import('../../../Settings/Export/Export.helpers');
        await pdfExportAdapter([board], MEDIUM_FONT_SIZE, intl);
        showNotification(
          intl.formatMessage(messages.boardExported, { name: board.name })
        );
      } catch (err) {
        showNotification(
          intl.formatMessage(messages.boardExportError, { name: board.name })
        );
      }
    },
    [intl, showNotification]
  );

  return { exportBoard, exportBoardToPdf };
};

export default useBoardExport;
