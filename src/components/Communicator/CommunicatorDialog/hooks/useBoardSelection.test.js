import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import useBoardSelection from './useBoardSelection';

const Harness = ({ hookArgs, onResult }) => {
  onResult(useBoardSelection(hookArgs));
  return null;
};

const render = initialArgs => {
  let latest;
  let wrapper;
  act(() => {
    wrapper = mount(
      <Harness hookArgs={initialArgs} onResult={result => (latest = result)} />
    );
  });
  return {
    get: () => latest,
    setArgs: nextArgs => {
      act(() => {
        wrapper.setProps({ hookArgs: nextArgs });
      });
    }
  };
};

const boards = [{ id: 'b1' }, { id: 'b2' }];

describe('useBoardSelection', () => {
  it('starts with nothing selected', () => {
    const { get } = render({ boards, section: 's1', search: '', page: 1 });
    expect(get().selectedBoard).toBe(null);
  });

  it('resolves the selected board from the list', () => {
    const { get } = render({ boards, section: 's1', search: '', page: 1 });

    act(() => {
      get().select('b2');
    });

    expect(get().selectedBoard).toEqual({ id: 'b2' });
  });

  it('clears the selection when the section changes', () => {
    const args = { boards, section: 's1', search: '', page: 1 };
    const { get, setArgs } = render(args);

    act(() => {
      get().select('b2');
    });
    setArgs({ ...args, section: 's2' });

    expect(get().selectedBoard).toBe(null);
  });

  it('clears the selection when the search changes', () => {
    const args = { boards, section: 's1', search: '', page: 1 };
    const { get, setArgs } = render(args);

    act(() => {
      get().select('b2');
    });
    setArgs({ ...args, search: 'com' });

    expect(get().selectedBoard).toBe(null);
  });

  it('clears the selection when the page changes', () => {
    const args = { boards, section: 's1', search: '', page: 1 };
    const { get, setArgs } = render(args);

    act(() => {
      get().select('b2');
    });
    setArgs({ ...args, page: 2 });

    expect(get().selectedBoard).toBe(null);
  });

  it('drops a selection whose board left the list', () => {
    const args = { boards, section: 's1', search: '', page: 1 };
    const { get, setArgs } = render(args);

    act(() => {
      get().select('b2');
    });
    setArgs({ ...args, boards: [{ id: 'b1' }] });

    expect(get().selectedBoard).toBe(null);
  });

  it('returns focus to the registered trigger on clear', () => {
    const { get } = render({ boards, section: 's1', search: '', page: 1 });
    const focus = jest.fn();

    act(() => {
      get().registerTrigger('b2', { focus });
      get().select('b2');
    });
    act(() => {
      get().clear();
    });

    expect(focus).toHaveBeenCalled();
    expect(get().selectedBoard).toBe(null);
  });
});
