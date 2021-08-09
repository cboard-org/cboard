import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Joyride, { STATUS } from 'react-joyride';
import messages from './Settings.messages';
import { FormattedMessage, intlShape } from 'react-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper/core';
import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import 'swiper/components/pagination/pagination.min.css';

import './Settings.css';
import { isCordova } from '../../cordova-util';

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
    width: 700,
    zIndex: 10000
  }
};

const imgFolderPath = '../../../images/tour/settingsTour/';
let settingsTourImages = {
  display: [
    {
      src: imgFolderPath + 'elementsSize.png',
      description: messages.uiSizeDescrip,
      title: messages.uiSizeTitle
    },
    {
      src: imgFolderPath + 'fontSize.png',
      description: messages.fontSizeDescrip,
      title: messages.fontSizeTitle
    },
    {
      src: imgFolderPath + 'hideTheOutputBarOpt.png',
      description: messages.hideOutputBarDescrip,
      title: messages.hideOutputBarTitle
    },
    {
      src: imgFolderPath + 'labelPosition.png',
      description: messages.labelPositionDescrip,
      title: messages.labelPositionTitle
    },
    {
      src: imgFolderPath + 'enableDarkThemeOpt.png',
      description: messages.enableDarkThemeDescrip,
      title: messages.enableDarkThemeTitle
    }
  ],
  scanning: [
    {
      src: imgFolderPath + 'enableScanning2.gif',
      description: messages.enableScanningDescrip,
      title: messages.enableScanningTitle
    }
  ],
  navigation: [
    {
      src: imgFolderPath + 'enableContextAwareBackButton.png',
      description: messages.enableContextAwareBackButtonDescrip,
      title: messages.enableContextAwareBackButtonTitle
    },
    {
      src: imgFolderPath + 'showSharePhraseButton.png',
      description: messages.showSharePhraseButtonDescrip,
      title: messages.showSharePhraseButtonTitle
    },
    {
      src: imgFolderPath + 'removeSymbolsFromTheOutputBar.png',
      description: messages.removeSymbolsFromTheOutputBarDescrip,
      title: messages.removeSymbolsFromTheOutputBarTitle
    },
    {
      src: imgFolderPath + 'folderVocalization.png',
      description: messages.folderVocalizationDescrip,
      title: messages.folderVocalizationTitle
    }
  ]
};

function SettingsTour({ intl, disableTour, isSettingsTourEnabled }) {
  const [tooltipSwiperText, setTooltipSwiperText] = useState({
    title: '',
    description: ''
  });

  const handleOnSlideChange = (sectionEnabled, index) => {
    for (const section in settingsTourImages) {
      if (section === sectionEnabled) {
        setTooltipSwiperText({
          title: (
            <FormattedMessage
              {...settingsTourImages[sectionEnabled][index].title}
            />
          ),
          description: (
            <div className="Settings_Tour_Description">
              <FormattedMessage
                {...settingsTourImages[sectionEnabled][index].description}
              />
            </div>
          )
        });
      }
    }
  };

  let settingsTourSteps = [
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
          <h2 className="Settings_Tour_Tooltip_Swiper_Title">
            {tooltipSwiperText.title}
          </h2>
          <Swiper
            navigation={true}
            pagination={true}
            className="mySwiper"
            onSlideChange={swiper => {
              handleOnSlideChange('display', swiper.realIndex);
            }}
            onInit={swiper => {
              handleOnSlideChange('display', swiper.realIndex);
            }}
          >
            {settingsTourImages.display.map((imgData, inx) => (
              <SwiperSlide key={`slide-${inx}`}>
                <div className="swiperSlideContentContainer">
                  <img
                    src={imgData.src}
                    alt={intl.formatMessage(imgData.title)}
                    key={intl.formatMessage(imgData.title)}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div>{tooltipSwiperText.description}</div>
        </div>
      )
    },
    {
      hideCloseButton: true,
      target: '[href="/settings/scanning"]',
      content: (
        <div>
          <h2 className="Settings_Tour_Tooltip_Swiper_Title">
            {tooltipSwiperText.title}
          </h2>
          <Swiper
            navigation={true}
            pagination={true}
            className="mySwiper"
            watchOverflow={true}
            onSlideChange={swiper => {
              handleOnSlideChange('scanning', swiper.realIndex);
            }}
            onInit={swiper => {
              handleOnSlideChange('scanning', swiper.realIndex);
            }}
          >
            {settingsTourImages.scanning.map((imgData, inx) => (
              <SwiperSlide key={intl.formatMessage(imgData.title)}>
                <div className="swiperSlideContentContainer">
                  <img
                    src={imgData.src}
                    alt={intl.formatMessage(imgData.title)}
                    key={intl.formatMessage(imgData.title)}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div>{tooltipSwiperText.description}</div>
        </div>
      )
    },
    {
      hideCloseButton: true,
      target: '[href="/settings/navigation"]',
      content: (
        <div>
          <h2 className="Settings_Tour_Tooltip_Swiper_Title">
            {tooltipSwiperText.title}
          </h2>
          <Swiper
            navigation={true}
            pagination={true}
            className="mySwiper"
            onSlideChange={swiper => {
              handleOnSlideChange('navigation', swiper.realIndex);
            }}
            onInit={swiper => {
              handleOnSlideChange('navigation', swiper.realIndex);
            }}
          >
            {settingsTourImages.navigation.map((imgData, inx) => (
              <SwiperSlide key={intl.formatMessage(imgData.title)}>
                <div className="swiperSlideContentContainer">
                  <img
                    src={imgData.src}
                    alt={intl.formatMessage(imgData.title)}
                    key={intl.formatMessage(imgData.title)}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div>{tooltipSwiperText.description}</div>
        </div>
      )
    }
  ];

  const formatStepsForCordova = () => {
    settingsTourSteps.forEach((step, indx) => {
      if (step.target !== 'body') {
        const target = step.target;
        const searchTerm = '/';
        const indexOfFirst = target.indexOf(searchTerm);
        const newTarget =
          target.substring(0, indexOfFirst) +
          '#' +
          target.substring(indexOfFirst);
        settingsTourSteps[indx].target = newTarget;
      }
    });
    for (const section in settingsTourImages) {
      settingsTourImages[section].forEach((img, indx) => {
        const src = img.src;
        const searchTerm = '/images';
        const indexOfFirst = src.indexOf(searchTerm);
        const tableOfContents = src.substring(0, indexOfFirst - 1);
        const srcCva = src.replace(tableOfContents, '');
        console.log(srcCva);
        settingsTourImages[section][indx].src = srcCva;
      });
    }
  };

  if (isCordova()) formatStepsForCordova();

  return (
    <div>
      <Joyride
        callback={data => {
          const { status } = data;
          if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            disableTour({ isSettingsTourEnabled: false });
          }
        }}
        steps={settingsTourSteps}
        continuous={true}
        showSkipButton={true}
        //disableScrollParentFix={true}
        showProgress={false}
        disableOverlayClose={true}
        run={isSettingsTourEnabled}
        scrollOffset={500}
        spotlightPadding={0}
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
SettingsTour.propTypes = propTypes;

export default SettingsTour;
