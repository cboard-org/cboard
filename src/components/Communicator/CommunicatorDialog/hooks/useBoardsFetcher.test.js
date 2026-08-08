import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import useBoardsFetcher from './useBoardsFetcher';
import { SECTIONS } from '../CommunicatorDialog.constants';

jest.mock('../../../../api', () => ({
  __esModule: true,
  default: {
    getMyBoards: jest.fn(),
    getPublicBoards: jest.fn(),
    getBoard: jest.fn()
  }
}));

const makeBoards = n =>
  Array.from({ length: n }, (_, i) => ({
    id: `board-${i}`,
    name: `Board ${i}`,
    author: 'Author'
  }));

// Captures the hook's return value on every render so tests can assert on it.
const Harness = ({ hookArgs, onResult }) => {
  const result = useBoardsFetcher(hookArgs);
  onResult(result);
  return null;
};

const renderHook = hookArgs => {
  let latest;
  const onResult = result => {
    latest = result;
  };
  let wrapper;
  act(() => {
    wrapper = mount(<Harness hookArgs={hookArgs} onResult={onResult} />);
  });
  return {
    get: () => latest,
    rerender: nextArgs =>
      act(() => {
        wrapper.setProps({ hookArgs: nextArgs });
      })
  };
};

describe('useBoardsFetcher (communicator local source)', () => {
  it('paginates the communicator boards (12 per page)', () => {
    const communicatorBoards = makeBoards(14);
    const { get } = renderHook({
      section: SECTIONS.MY_COMMUNICATOR,
      search: '',
      communicatorBoards,
      availableBoards: [],
      userData: {}
    });

    expect(get().total).toBe(14);
    expect(get().totalPages).toBe(2);
    expect(get().boards).toHaveLength(12);

    act(() => get().goToPage(2));
    expect(get().boards).toHaveLength(2);
    expect(get().page).toBe(2);
  });

  it('filters by name/author with the search term', () => {
    const communicatorBoards = [
      { id: 'a', name: 'Animals', author: 'X' },
      { id: 'b', name: 'Food', author: 'X' },
      { id: 'c', name: 'Numbers', author: 'Animals fan' }
    ];
    const { get, rerender } = renderHook({
      section: SECTIONS.MY_COMMUNICATOR,
      search: '',
      communicatorBoards,
      availableBoards: [],
      userData: {}
    });

    expect(get().total).toBe(3);

    rerender({
      section: SECTIONS.MY_COMMUNICATOR,
      search: 'animals',
      communicatorBoards,
      availableBoards: [],
      userData: {}
    });

    // matches "Animals" (name) and "Animals fan" (author), case-insensitive
    expect(get().total).toBe(2);
  });

  it('removes a board from the visible list optimistically', () => {
    const communicatorBoards = makeBoards(3);
    const { get } = renderHook({
      section: SECTIONS.MY_COMMUNICATOR,
      search: '',
      communicatorBoards,
      availableBoards: [],
      userData: {}
    });

    expect(get().boards).toHaveLength(3);
    act(() => get().removeBoardFromList('board-1'));
    expect(get().boards).toHaveLength(2);
    expect(get().boards.find(b => b.id === 'board-1')).toBeUndefined();
  });
});
