import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import PrintBoardButton from './PrintBoardButton.component';
import PrintBoardDialog from './PrintBoardDialog.component';
import messages from './PrintBoardButton.messages';
// import { pdfExportAdapter } from '../../Settings/Export/Export.helpers';

class PrintBoardButtonContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openDialog: false,
      loading: false
    };
  }

  componentDidMount() {
    this.exportHelpers = import('../../Settings/Export/Export.helpers');
  }

  openPrintBoardDialog() {
    this.setState({ openDialog: true });
  }

  closePrintBoardDialog() {
    this.setState({ openDialog: false });
  }

  async onPrintCurrentBoard() {
    this.setState({ loading: true });
    const { boardData, intl } = this.props;
    const currentBoard = boardData.boards.find(
      board => board.id === boardData.activeBoardId
    );

    const { pdfExportAdapter } = await this.exportHelpers;
    pdfExportAdapter([currentBoard], intl);
    this.setState({ loading: false });
  }

  async onPrintFullBoardSet() {
    this.setState({ loading: true });
    const { boardData, intl } = this.props;
    const { pdfExportAdapter } = await this.exportHelpers;
    pdfExportAdapter(boardData.boards, intl);
    this.setState({ loading: false });
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
          loading={this.state.loading}
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
