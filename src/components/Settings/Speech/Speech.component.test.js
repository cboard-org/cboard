import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import Speech from './Speech.component';

jest.mock('./Speech.messages', () => {
  return {
    higher: {
      id: 'cboard.components.Settings.Speech.higher',
      defaultMessage: 'Higher'
    },
    lower: {
      id: 'cboard.components.Settings.Speech.lower',
      defaultMessage: 'Lower'
    },
    faster: {
      id: 'cboard.components.Settings.Speech.faster',
      defaultMessage: 'Faster'
    },
    slower: {
      id: 'cboard.components.Settings.Speech.slower',
      defaultMessage: 'Slower'
    },
    pitch: {
      id: 'cboard.components.Settings.Speech.pitch',
      defaultMessage: 'Pitch'
    },
    pitchDescription: {
      id: 'cboard.components.Settings.Speech.pitchDescription',
      defaultMessage: 'Make the voice use a higher or lower pitch'
    },
    rate: {
      id: 'cboard.components.Settings.Speech.rate',
      defaultMessage: 'Rate'
    },
    rateDescription: {
      id: 'cboard.components.Settings.Speech.rateDescription',
      defaultMessage: 'Make the voice speak faster or slower'
    },
    speech: {
      id: 'cboard.components.Settings.Speech.speech',
      defaultMessage: 'Speech'
    },
    sampleSentence: {
      id: 'cboard.components.Settings.Speech.sampleSentence',
      defaultMessage: 'Hi! This is my voice.'
    },
    voice: {
      id: 'cboard.components.Settings.Speech.voice',
      defaultMessage: 'Voice'
    }
  };
});

describe('Speech tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<Speech />);
  });
});
