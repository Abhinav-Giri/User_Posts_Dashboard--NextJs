import { useInfiniteQuery } from 'react-query';
import axios from 'axios';

export const useInfinitePosts = (userId: number | null) => {
  return useInfiniteQuery(
    ['posts', userId],
    async ({ pageParam = 1 }) => {
      const limit = 5;
      const start = (pageParam - 1) * limit;
      const { data } = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?userId=${userId}&_start=${start}&_limit=${limit}`
      );
      return data;
    },
    {
      enabled: !!userId,
      getNextPageParam: (_, pages) => pages.length + 1,
    }
  );
};