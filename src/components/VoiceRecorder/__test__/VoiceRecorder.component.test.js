import React from 'react';
import { shallow } from 'enzyme';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import VoiceRecorder, {
  VoiceRecorder as Recorder
} from '../VoiceRecorder.component';
import messages from '../VoiceRecorder.messages';

jest.mock('../VoiceRecorder.messages', () => ({
  record: { id: 'record' },
  play: { id: 'play' },
  clear: { id: 'clear' },
  attachAudioFile: { id: 'attachAudioFile' },
  audioFileError: { id: 'audioFileError' }
}));

describe('VoiceRecorder tests', () => {
  const props = {
    src: 'string',
    onChange: jest.fn(),
    onClick: jest.fn(),
    user: { email: 'test@qa.com' }
  };

  test('default renderer', () => {
    shallowMatchSnapshot(<VoiceRecorder {...props} />);
  });

  test('attaches a selected audio file as a tile sound without recording', async () => {
    let resolveSound;
    const sound = new Promise((resolve) => {
      resolveSound = resolve;
    });
    const onChange = jest.fn(resolveSound);
    const wrapper = shallow(
      <Recorder intl={{ formatMessage: ({ id }) => id }} onChange={onChange} />
    );
    const picker = wrapper.find('input[type="file"]');
    const file = new File(['sample audio'], 'sample.mp3', {
      type: 'audio/mpeg'
    });

    expect(picker.prop('accept')).toBe('audio/*');
    picker.simulate('change', {
      currentTarget: { files: [file], value: file.name }
    });

    await expect(sound).resolves.toBe(
      'data:audio/mpeg;base64,c2FtcGxlIGF1ZGlv'
    );
    expect(onChange).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });

  test('keeps the existing sound when the selected file is not audio', () => {
    const onChange = jest.fn();
    const wrapper = shallow(
      <Recorder
        src="data:audio/mpeg;base64,AA=="
        intl={{ formatMessage: ({ id }) => id }}
        onChange={onChange}
      />
    );
    const file = new File(['sample text'], 'sample.txt', {
      type: 'text/plain'
    });
    wrapper.find('input[type="file"]').simulate('change', {
      currentTarget: { files: [file], value: file.name }
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(wrapper.find('[role="alert"]').prop('children')).toBe(
      messages.audioFileError.id
    );
    wrapper.unmount();
  });
});
