import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import ReceiverLoopPanel from './ReceiverLoopPanel.component';
import * as symbolMatching from '../../../common/communicationSupport/symbolMatching';

const mockedMatches = [
  {
    token: '想',
    matchType: 'exact',
    tile: {
      id: 'want',
      boardId: 'home',
      boardName: '首页',
      tile: {
        id: 'want',
        label: '想',
        image: '/want.png'
      }
    }
  },
  {
    token: '喝',
    matchType: 'exact',
    tile: {
      id: 'drink-verb',
      boardId: 'home',
      boardName: '首页',
      tile: {
        id: 'drink-verb',
        label: '喝',
        image: '/drink-verb.png'
      }
    }
  },
  {
    token: '水',
    matchType: 'exact',
    tile: {
      id: 'water',
      boardId: 'home',
      boardName: '首页',
      tile: {
        id: 'water',
        label: '水',
        image: '/water.png'
      }
    }
  }
];

jest.mock('../../../common/communicationSupport/symbolMatching', () => ({
  buildCommunicationTileCatalog: jest.fn(),
  createCommunicationOutputFromMatches: jest.fn(),
  matchTextToCommunicationTiles: jest.fn()
}));

jest.mock('../Symbol', () => {
  return function MockSymbol(props) {
    return <div className="MockSymbol">{props.label}</div>;
  };
});

async function setInput(wrapper, value) {
  const textField = wrapper.find('ForwardRef(TextField)').at(0);
  await act(async () => {
    textField.prop('onChange')({
      target: { value }
    });
  });
  wrapper.update();
}

describe('ReceiverLoopPanel', () => {
  const onApplyOutput = jest.fn();
  const onAppendHistory = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    onApplyOutput.mockClear();
    onAppendHistory.mockClear();
    symbolMatching.buildCommunicationTileCatalog.mockReturnValue([
      {
        id: 'drink',
        boardName: '饮品',
        labels: ['饮料'],
        synonyms: ['喝的'],
        tile: {
          id: 'drink',
          label: '饮料',
          image: '/drink.png'
        }
      }
    ]);
    symbolMatching.matchTextToCommunicationTiles.mockReturnValue({
      matches: mockedMatches,
      matchRate: 1
    });
    symbolMatching.createCommunicationOutputFromMatches.mockImplementation(
      matches =>
        matches
          .filter(item => item.tile && item.tile.tile)
          .map(item => ({
            id: item.tile.tile.id,
            label: item.tile.tile.label,
            image: item.tile.tile.image
          }))
    );
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('supports a text-token-image receiver loop without wrapper dependencies', async () => {
    const wrapper = mount(
      <ReceiverLoopPanel
        boards={[]}
        intl={null}
        onApplyOutput={onApplyOutput}
        onJumpBoard={jest.fn()}
        onAppendHistory={onAppendHistory}
        historyItems={[]}
      />
    );

    await setInput(wrapper, '我想喝水');

    wrapper
      .find('ForwardRef(Button)')
      .filterWhere(node => node.text() === '生成图片序列')
      .first()
      .simulate('click');

    await act(async () => {
      jest.runAllTimers();
    });
    wrapper.update();

    expect(wrapper.text()).toContain('预览图片：想 / 喝 / 水');

    wrapper
      .find('ForwardRef(Button)')
      .filterWhere(node => node.text() === '右移')
      .at(0)
      .simulate('click');
    wrapper.update();

    expect(wrapper.text()).toContain('预览图片：喝 / 想 / 水');

    wrapper
      .find('ForwardRef(Button)')
      .filterWhere(node => node.text() === '换图')
      .at(2)
      .simulate('click');
    wrapper.update();

    wrapper
      .find('button')
      .filterWhere(node => node.text().includes('饮料'))
      .first()
      .simulate('click');
    wrapper.update();

    expect(wrapper.text()).toContain('预览图片：喝 / 想 / 饮料');

    wrapper
      .find('ForwardRef(Button)')
      .filterWhere(node => node.text() === '发送到输出栏')
      .first()
      .simulate('click');

    expect(onApplyOutput).toHaveBeenCalledWith([
      {
        id: 'drink-verb',
        label: '喝',
        image: '/drink-verb.png'
      },
      {
        id: 'want',
        label: '想',
        image: '/want.png'
      },
      {
        id: 'drink',
        label: '饮料',
        image: '/drink.png'
      }
    ]);
    expect(onAppendHistory).toHaveBeenCalledWith({
      direction: 'receive',
      inputText: '我想喝水',
      labels: ['喝', '想', '饮料']
    });
  });
});
