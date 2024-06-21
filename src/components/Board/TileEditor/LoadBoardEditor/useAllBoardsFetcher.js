import { useState } from 'react';
import API from '../../../../api';

const useAllBoardsFetcher = () => {
  const [allBoards, setBoards] = useState(null);
  const [totalPages, setTotalBoards] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBoards = async ({ page = 1 }) => {
    try {
      const LIMIT = 10;
      setLoading(true);
      setError(null);
      const response = await API.getMyBoards({
        limit: LIMIT,
        sort: '-createdAt',
        page: page
      });
      setBoards(response.data);
      const totalPages = response.total / LIMIT;
      setTotalBoards(totalPages);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  return { fetchBoards, allBoards, totalPages, loading, error };
};

export default useAllBoardsFetcher;
