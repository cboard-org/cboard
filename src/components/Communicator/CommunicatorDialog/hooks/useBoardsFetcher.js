import { useState, useEffect, useRef, useCallback } from 'react';
import API from '../../../../api';
import { SECTIONS, BOARDS_PAGE_LIMIT } from '../CommunicatorDialog.constants';

/**
 * Client-side filtering + pagination, used for the communicator section (which
 * reads from redux) and as a fallback for the API-backed sections when the
 * request fails. Mirrors the legacy `findBoards` helper.
 */
const filterLocalBoards = (boards, criteria, page, search = '') => {
  let result = boards;
  for (const [key, value] of Object.entries(criteria)) {
    result = result.filter(
      (board) =>
        (board.hasOwnProperty(key) && board[key] === value) ||
        !board.hasOwnProperty(key)
    );
  }
  if (search) {
    const re = new RegExp(search, 'i');
    result = result.filter(
      (board) => re.test(board.name) || re.test(board.author)
    );
  }
  return {
    total: result.length,
    data: result.slice((page - 1) * BOARDS_PAGE_LIMIT, page * BOARDS_PAGE_LIMIT)
  };
};

/**
 * Fetches the boards for the active dashboard section with page-based
 * pagination and search. Keeps redux-derived inputs in refs so the fetch
 * callback stays stable and never loops on array identity changes.
 */
const useBoardsFetcher = ({
  section,
  search,
  communicatorBoards,
  availableBoards,
  userData
}) => {
  const [boards, setBoards] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const communicatorBoardsRef = useRef(communicatorBoards);
  const availableBoardsRef = useRef(availableBoards);
  const userDataRef = useRef(userData);
  communicatorBoardsRef.current = communicatorBoards;
  availableBoardsRef.current = availableBoards;
  userDataRef.current = userData;

  const requestIdRef = useRef(0);

  const doFetch = useCallback(async (pageArg, searchArg, sectionArg) => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setLoading(true);
    setError(null);
    try {
      let result = { data: [], total: 0 };
      switch (sectionArg) {
        case SECTIONS.MY_COMMUNICATOR:
          result = filterLocalBoards(
            communicatorBoardsRef.current,
            {},
            pageArg,
            searchArg
          );
          break;
        case SECTIONS.COMMUNITY:
          try {
            result = await API.getPublicBoards({
              limit: BOARDS_PAGE_LIMIT,
              page: pageArg,
              search: searchArg
            });
          } catch (err) {
            result = filterLocalBoards(
              availableBoardsRef.current,
              { isPublic: true, hidden: false },
              pageArg,
              searchArg
            );
          }
          break;
        case SECTIONS.MY_BOARDS:
          try {
            result = await API.getMyBoards({
              limit: BOARDS_PAGE_LIMIT,
              page: pageArg,
              search: searchArg
            });
          } catch (err) {
            result = filterLocalBoards(
              availableBoardsRef.current,
              { email: userDataRef.current.email, hidden: false },
              pageArg,
              searchArg
            );
          }
          break;
        default:
          break;
      }
      if (requestIdRef.current !== requestId) {
        return;
      }
      setBoards(result.data || []);
      setTotal(result.total || 0);
    } catch (err) {
      if (requestIdRef.current !== requestId) {
        return;
      }
      setError(err);
      setBoards([]);
      setTotal(0);
    } finally {
      if (requestIdRef.current === requestId) {
        setLoading(false);
      }
    }
  }, []);

  // Section or search change always resets to page 1 and refetches.
  useEffect(() => {
    setPage(1);
    doFetch(1, search, section);
  }, [doFetch, search, section]);

  const goToPage = useCallback(
    (newPage) => {
      setPage(newPage);
      doFetch(newPage, search, section);
    },
    [doFetch, search, section]
  );

  const refetch = useCallback(
    () => doFetch(page, search, section),
    [doFetch, page, search, section]
  );

  useEffect(() => {
    if (!loading && page > 1 && boards.length === 0 && total > 0) {
      goToPage(page - 1);
    }
  }, [loading, page, boards.length, total, goToPage]);

  const removeBoardFromList = useCallback((id) => {
    setBoards((prev) => prev.filter((board) => board.id !== id));
    setTotal((prev) => Math.max(prev - 1, 0));
  }, []);

  const replaceBoardInList = useCallback((updated) => {
    setBoards((prev) =>
      prev.map((board) => (board.id === updated.id ? updated : board))
    );
  }, []);

  const totalPages = Math.ceil(total / BOARDS_PAGE_LIMIT);

  return {
    boards,
    total,
    totalPages,
    page,
    goToPage,
    loading,
    error,
    refetch,
    setBoards,
    removeBoardFromList,
    replaceBoardInList
  };
};

export default useBoardsFetcher;
