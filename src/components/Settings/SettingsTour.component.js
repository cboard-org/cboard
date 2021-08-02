import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Joyride, { STATUS } from 'react-joyride';
import messages from './Settings.messages';
import { FormattedMessage, intlShape } from 'react-intl';
// import Swiper JS
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper/core';
import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import 'swiper/components/pagination/pagination.min.css';

import './Settings.css';

SwiperCore.use([Navigation, Pagination]);

const propTypes = {
  isSettingsTourEnabled: PropTypes.bool.isRequired,
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
  }
};

const settingsTourImages = {
  display: [
    {
      src: '../../../images/tour/settingsTour/enableDarkThemeOpt.png',
      alt: messages.enableBlackTheme
    },
    {
      src: '../../../images/tour/settingsTour/hideTheOutputBarOpt.png',
      alt: messages.hideOutputBar
    }
  ],
  scanning: [
    {
      src: '../../../images/tour/settingsTour/enableScanning2.gif',
      alt: messages.enableScanning
    }
  ],
  navigation: [
    {
      src: '../../../images/tour/settingsTour/enableContextAwareBackButton.png',
      alt: messages.enableScanning
    },
    {
      src: '../../../images/tour/settingsTour/showSharePhraseButton.png',
      alt: messages.enableScanning
    },
    {
      src:
        '../../../images/tour/settingsTour/removeSymbolsFromTheOutputBar.png',
      alt: messages.enableScanning
    }
  ]
};

function SettingsTour({ intl, disableTour, isSettingsTourEnabled }) {
  const [tooltipDescription, settooltipDescription] = useState(null);

  const [imagesArr, setImagesArr] = useState(null);

  // useEffect(() => {
  //   let loadedImages = { display: [], scanning: [], navigation: [] }
  //   for (let section in settingsTourImages) {
  //     settingsTourImages[section].forEach(el => {
  //       let img = new Image()
  //       img.onload = () => {
  //         loadedImages[section].push(<img src={el.src} alt={intl.formatMessage(el.alt)} key={intl.formatMessage(el.alt)} />);
  //       }
  //       img.src = el.src
  //       img.alt = el.alt
  //       img.key = el.alt
  //     })
  //   }
  //   setImagesArr(loadedImages);
  // }, [intl]);

  const handleOnSlideChange = (sectionEnabled, index) => {
    for (const section in settingsTourImages) {
      if (section === sectionEnabled) {
        settooltipDescription(
          <FormattedMessage
            {...settingsTourImages[sectionEnabled][index].alt}
          />
        );
      }
    }
  };

  let SettingsTourSteps = [
    {
      target: 'body',
      placement: 'center',
      hideCloseButton: true,
      content: (
        <h2>
          <FormattedMessage {...messages.walkthroughSettings} />
        </h2>
      )
    },
    {
      hideCloseButton: true,
      target: '[href="/settings/language"]',
      content: (
        <div>
          <FormattedMessage {...messages.walkthroughLanguage} />
        </div>
      )
    },
    {
      hideCloseButton: true,
      target: '[href="/settings/speech"]',
      content: (
        <div>
          <FormattedMessage {...messages.walkthroughSpeech} />
        </div>
      )
    },
    {
      hideCloseButton: true,
      target: '[href="/settings/export"]',
      content: (
        <div>
          <FormattedMessage {...messages.walkthroughExport} />
        </div>
      )
    },
    {
      hideCloseButton: true,
      target: '[href="/settings/import"]',
      content: (
        <div>
          <FormattedMessage {...messages.walkthroughImport} />
        </div>
      )
    },
    {
      hideCloseButton: true,
      target: '[href="/settings/display"]',
      content: (
        <div>
          <Swiper
            navigation={true}
            pagination={true}
            className="mySwiper"
            onSlideChange={swiper => {
              console.log('Slide index changed to: ', swiper.activeIndex);
              handleOnSlideChange('display', swiper.realIndex);
            }}
            onInit={swiper => {
              console.log('hola');
              handleOnSlideChange('display', swiper.realIndex);
            }}
          >
            {imagesArr &&
              imagesArr['display'].map((img, idx) => (
                <SwiperSlide key={`slide-${idx}`}>{img}</SwiperSlide>
              ))}
          </Swiper>
          <div>{tooltipDescription}</div>
        </div>
      )
    },
    {
      hideCloseButton: true,
      target: '[href="/settings/scanning"]',
      content: (
        <div>
          {/* //id="cosa" style={{ visibility: "hidden" }}> */}
          <Swiper
            navigation={true}
            pagination={true}
            className="mySwiper"
            watchOverflow={true}
            onSlideChange={swiper => {
              console.log('Slide index changed to: ', swiper.activeIndex);
              handleOnSlideChange('scanning', swiper.realIndex);
            }}
            onInit={swiper => {
              console.log('hola');
              handleOnSlideChange('scanning', swiper.realIndex);
              // document.getElementById("cosa").style.visibility = "visible"
            }}
          >
            {imagesArr &&
              imagesArr['scanning'].map((img, idx) => (
                <SwiperSlide key={`slide-${idx}`}>{img}</SwiperSlide>
              ))}
          </Swiper>
          <div>{tooltipDescription}</div>
        </div>
      )
    },
    {
      hideCloseButton: true,
      target: '[href="/settings/navigation"]',
      content: (
        <div>
          <Swiper
            navigation={true}
            pagination={true}
            className="mySwiper"
            onSlideChange={swiper => {
              console.log('Slide index changed to: ', swiper.activeIndex);
              handleOnSlideChange('navigation', swiper.realIndex);
            }}
            onInit={swiper => {
              console.log('hola');
              handleOnSlideChange('navigation', swiper.realIndex);
            }}
          >
            {imagesArr &&
              imagesArr['navigation'].map((img, idx) => (
                <SwiperSlide key={`slide-${idx}`}>{img}</SwiperSlide>
              ))}
          </Swiper>
          <div>{tooltipDescription}</div>
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
            disableTour({ isSettingsTourEnabled: false });
          }
        }}
        steps={SettingsTourSteps}
        continuous={true}
        showSkipButton={true}
        //disableScrollParentFix={true}
        showProgress={false}
        disableOverlayClose={true}
        run={true} //{isSettingsTourEnabled}
        scrollOffset={500}
        spotlightPadding={0}
        styles={joyRideStyles}
        scrollDuration={100}
        disableBeacon={true}
        locale={{
          last: intl.formatMessage(messages.walkthroughEndTour),
          skip: intl.formatMessage(messages.walkthroughCloseTour)
        }}
      />
    </div>
  );
}
SettingsTour.propTypes = propTypes;

export default SettingsTour;
