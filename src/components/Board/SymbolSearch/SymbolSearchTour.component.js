import React from 'react';
import PropTypes from 'prop-types';
import Joyride, { STATUS } from 'react-joyride';
import messages from './SymbolSearch.messages';
import { FormattedMessage, intlShape } from 'react-intl';
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper/core';
import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import 'swiper/components/pagination/pagination.min.css';

import './SymbolSearch.css';

SwiperCore.use([Navigation, Pagination, Autoplay]);

const propTypes = {
  isSymbolSearchTourEnabled: PropTypes.bool.isRequired,
  disableTour: PropTypes.func.isRequired,
  intl: intlShape.isRequired
};

const joyRideStyles = {
  options: {
    arrowColor: '#eee',
    backgroundColor: '#eee',
    primaryColor: '#aa00ff',
    textColor: '#333',
    width: 500,
    zIndex: 10000
  },
  tooltipContent: {
    padding: '5px 5px'
  }
};

function SymbolSearchTour({ intl, disableTour, isSymbolSearchTourEnabled }) {
  const symbolSearchTourSteps = [
    {
      target: 'body',
      placement: 'center',
      hideCloseButton: true,
      content: (
        <div>
          <h2>
            <FormattedMessage {...messages.walkthroughSymbolSearch} />
          </h2>
          <h5>
            <FormattedMessage {...messages.walkthroughSymbolSearchDesc} />
          </h5>
        </div>
      )
    },
    {
      target: '#SkinToneOptions',
      hideCloseButton: true,
      content: (
        <div>
          <h2>
            <FormattedMessage {...messages.skinToneOptionsTitle} />
          </h2>
          <h5>
            <FormattedMessage {...messages.skinToneOptionsDesc} />
          </h5>
        </div>
      )
    },
    {
      target: '#HairColorOptions',
      hideCloseButton: true,
      content: (
        <div>
          <h2>
            <FormattedMessage {...messages.hairColorOptionsTitle} />
          </h2>
          <h5>
            <FormattedMessage {...messages.hairColorOptionsDesc} />
          </h5>
        </div>
      )
    }
  ];

  return (
    <div>
      <Joyride
        callback={data => {
          const { status } = data;
          if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            disableTour({ isSymbolSearchTourEnabled: false });
          }
        }}
        steps={symbolSearchTourSteps}
        continuous={true}
        showSkipButton={true}
        showProgress={false}
        disableOverlayClose={true}
        run={isSymbolSearchTourEnabled}
        scrollOffset={500}
        spotlightPadding={4}
        styles={joyRideStyles}
        scrollDuration={100}
        disableBeacon={true}
        locale={{
          last: intl.formatMessage(messages.walkthroughEndTour),
          skip: intl.formatMessage(messages.walkthroughCloseTour),
          next: intl.formatMessage(messages.walkthroughNext),
          back: intl.formatMessage(messages.walkthroughBack)
        }}
      />
    </div>
  );
}
SymbolSearchTour.propTypes = propTypes;

export default SymbolSearchTour;
