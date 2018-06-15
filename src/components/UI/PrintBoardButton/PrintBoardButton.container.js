import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import PrintBoardButton from './PrintBoardButton.component';
import PrintBoardDialog from './PrintBoardDialog.component';
import messages from './PrintBoardButton.messages';
import { pdfExportAdapter } from '../../Settings/Export/Export.helpers';

class PrintBoardButtonContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openDialog: false
    };
  }

  openPrintBoardDialog() {
    this.setState({ openDialog: true });
  }

  closePrintBoardDialog() {
    this.setState({ openDialog: false });
  }

  onPrintCurrentBoard() {
    const { boardData, intl } = this.props;
    const currentBoard = boardData.boards.find(
      board => board.id === boardData.activeBoardId
    );
    pdfExportAdapter([currentBoard], intl);
  }

  onPrintFullBoardSet() {
    const { boardData, intl } = this.props;
    pdfExportAdapter(boardData.boards, intl);
  }

  render() {
    const { intl } = this.props;
    const label = intl.formatMessage(messages.printBoard);
    return (
      <div>
        <PrintBoardButton
          label={label}
          onClick={this.openPrintBoardDialog.bind(this)}
          {...this.props}
        />

        <PrintBoardDialog
          title={label}
          open={this.state.openDialog}
          onClose={this.closePrintBoardDialog.bind(this)}
          onPrintCurrentBoard={this.onPrintCurrentBoard.bind(this)}
          onPrintFullBoardSet={this.onPrintFullBoardSet.bind(this)}
        />
      </div>
    );
  }
}

PrintBoardButtonContainer.propTypes = {
  intl: intlShape.isRequired,
  boardData: PropTypes.object,
  disabled: PropTypes.bool
};

const mapStateToProps = state => ({
  boardData: state.board
});

export default connect(mapStateToProps)(injectIntl(PrintBoardButtonContainer));
