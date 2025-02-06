import { useInfiniteQuery } from '@tanstack/react-query';
import { postService } from '@/services/api';
import { Post } from '@/types';

export const usePosts = (userId: number | null) => {
  return useInfiniteQuery<Post[], Error>({
    queryKey: ['posts', userId],
    queryFn: ({ pageParam = 1 }) => {
      if (userId === null) {
        return Promise.resolve([]);
      }
      return postService.getPostsByUser(userId, pageParam as number);
    },
    enabled: userId !== null,
    getNextPageParam: (lastPage, allPages) => 
      lastPage.length > 0 ? allPages.length + 1 : undefined
  });
};