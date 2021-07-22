import React, { useState } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import messages from './Settings.messages';
import { FormattedMessage } from 'react-intl';
// import Swiper JS
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper/core';
import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import 'swiper/components/pagination/pagination.min.css';

import './Settings.css';

SwiperCore.use([Navigation, Pagination]);

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
  displaySection: [
    {
      src: '../../../images/tour/settingsTour/enableDarkThemeOpt.png',
      alt: messages.enableBlackTheme
    },
    {
      src: '../../../images/tour/settingsTour/hideTheOutputBarOpt.png',
      alt: messages.hideOutputBar
    }
  ]
};

function SettingsTour({ intl }) {
  const [title, setTitle] = useState(
    <FormattedMessage {...messages.walkthroughSettings} />
  );

  const handleOnSlideChange = (sectionEnabled, index) => {
    for (const section in settingsTourImages) {
      if (section === sectionEnabled) {
        setTitle(
          <FormattedMessage
            {...settingsTourImages[sectionEnabled][index].alt}
          />
        );
        // console.log(msg);
        // return msg;
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
              handleOnSlideChange('displaySection', swiper.realIndex);
            }}
            onInit={swiper => {
              console.log('hola');
              handleOnSlideChange('displaySection', swiper.realIndex);
            }}
          >
            {settingsTourImages.displaySection.map(obj => {
              return (
                <SwiperSlide>
                  <img
                    key={obj.alt}
                    src={obj.src}
                    alt={obj.alt}
                    width="100%"
                    height="100%"
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div>{title}</div>
        </div>
      )
    },
    {
      hideCloseButton: true,
      target: '[href="/settings/scanning"]',
      content: (
        <div>
          <Swiper
            navigation={true}
            pagination={true}
            className="mySwiper"
            onSlideChange={swiper => {
              console.log(swiper);
              //handleOnSlideChange(swiper.)
            }}
          >
            {settingsTourImages.displaySection.map((obj, index) => {
              return (
                <SwiperSlide>
                  <img
                    key={obj.alt}
                    src={obj.src}
                    alt={obj.alt}
                    width="100%"
                    height="100%"
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div>{title}</div>
        </div>
      )
    },
    {
      hideCloseButton: true,
      target: '[href="/settings/navigation"]',
      content: (
        <div>
          <FormattedMessage {...messages.walkthroughNavigationAndButton} />
        </div>
      )
    }
  ];
  return (
    <div>
      <Swiper />
      <Joyride
        callback={data => {
          const { status } = data;
          if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            if (true) {
              //     disableTour({
              //         disableCommunicatorTour: { isPublicBoardsEnabled: false }
              //     });
            }
          }
        }}
        steps={SettingsTourSteps}
        continuous={true}
        showSkipButton={true}
        //disableScrollParentFix={true}
        showProgress={false}
        disableOverlayClose={true}
        run={true}
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
export default SettingsTour;
