import { apiClient } from '@/lib/axios';
import { User, Post } from '@/types/index'; 

export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await apiClient.get('/users');
    return response.data;
  },
  
  async getUserById(id: number): Promise<User> {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  }
};

export const postService = {
  async getPostsByUser(userId: number, page = 1, limit = 5): Promise<Post[]> {
    const response = await apiClient.get('/posts', {
      params: { userId, _page: page, _limit: limit }
    });
    return response.data;
  },

  async updatePost(post: Post): Promise<Post> {
    const response = await apiClient.put(`/posts/${post.id}`, post);
    return response.data;
  },

  async deletePost(postId: number): Promise<void> {
    await apiClient.delete(`/posts/${postId}`);
  }
};