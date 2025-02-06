'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {  usePosts } from '../hooks/usePosts';
import { useUsers } from '../hooks/useUsers';

import { postService } from '@/services/api';
import { EditPostDialog } from '@/components/dashboard/EditPostDialog';
import { Button } from '@/components/ui/button';
import { Post, User } from '../types/index';

const queryClient = new QueryClient();

const Dashboard: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: users, isLoading: usersLoading } = useUsers();
  const { 
    data: postsPages, 
    fetchNextPage, 
    hasNextPage 
  } = usePosts(selectedUserId);

  const handleUpdatePost = async (updatedPost: Post) => {
    try {
      await postService.updatePost(updatedPost);
      queryClient.invalidateQueries({ queryKey: ['posts', selectedUserId] });
      setEditingPost(null);
    } catch (error) {
      console.error('Failed to update post', error);
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      await postService.deletePost(postId);
      queryClient.invalidateQueries({ queryKey: ['posts', selectedUserId] });
    } catch (error) {
      console.error('Failed to delete post', error);
    }
  };

  const filteredUsers = users?.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allPosts = postsPages?.pages.flat() || [];

  return (
    <div className="container mx-auto p-4">
      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 mb-4 border"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Users List */}
        <div className="space-y-2">
          {filteredUsers?.map(user => (
            <div 
              key={user.id} 
              onClick={() => setSelectedUserId(user.id)}
              className={`p-4 border rounded cursor-pointer ${
                selectedUserId === user.id ? 'bg-blue-100' : ''
              }`}
            >
              <h3 className="font-bold">{user.name}</h3>
              <p>{user.email}</p>
            </div>
          ))}
        </div>

        {/* Posts List */}
        <div className="md:col-span-2">
          {selectedUserId && (
            <div>
              <h2 className="text-2xl mb-4">Posts</h2>
              {allPosts.map(post => (
                <div key={post.id} className="border p-4 mb-2">
                  <h3 className="font-bold">{post.title}</h3>
                  <p>{post.body}</p>
                  <div className="mt-2 space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setEditingPost(post)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleDeletePost(post.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
              {hasNextPage && (
                <Button onClick={() => fetchNextPage()}>
                  Load More Posts
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {editingPost && (
        <EditPostDialog
          post={editingPost}
          onSave={handleUpdatePost}
          onClose={() => setEditingPost(null)}
        />
      )}
    </div>
  );
};

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}