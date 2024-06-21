import { useState } from 'react';
import API from '../../../../api';

const useAllBoardsFetcher = () => {
  const [allBoards, setBoards] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.getMyBoards({
        limit: null,
        sort: '-createdAt'
      });
      const allBoards = response.data;
      setBoards(allBoards);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  return { fetchBoards, allBoards, loading, error };
};

export default useAllBoardsFetcher;
