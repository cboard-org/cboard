import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';

import FullScreenDialog from '../../UI/FullScreenDialog';

export class GooglePhotosSearch extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    open: PropTypes.bool,
    //maxSuggestions: PropTypes.number,
    //onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  };

  static defaultProps = {
    open: false
    //maxSuggestions: 16
  };

  render() {
    const { open, onClose } = this.props;
    return (
      <div>
        <FullScreenDialog
          open={open}
          buttons={null}
          transition="fade"
          onClose={onClose}
        >
          {/* <FilterBar
                options={this.state.symbolSets}
                onChange={this.handleChangeOption}
                /> */}
        </FullScreenDialog>
      </div>
    );
  }
}

export default injectIntl(GooglePhotosSearch);
