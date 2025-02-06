import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { Search, Edit2, Trash2, ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInfinitePosts } from './hooks/useInfiniteScroll';
import { EditPostDialog } from './components/EditPostDialog';
import { useInView } from 'react-intersection-observer';

type SortField = 'name' | 'company' | 'email';

const useUsers = () => {
  return useQuery<User[]>('users', async () => {
    const { data } = await axios.get('https://jsonplaceholder.typicode.com/users');
    return data;
  });
};

const UserCard: React.FC<{
  user: User;
  isSelected: boolean;
  onClick: () => void;
}> = ({ user, isSelected, onClick }) => {
  return (
    <Card 
      className={`mb-4 cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-lg">{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-600">
            {user.address.street}, {user.address.suite}
            <br />
            {user.address.city}, {user.address.zipcode}
          </p>
          <p className="text-sm font-medium text-gray-800">{user.company.name}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const PostCard: React.FC<{
  post: Post;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ post, onEdit, onDelete }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle className="text-lg">{post.title}</CardTitle>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{post.body}</p>
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  
  const { ref, inView } = useInView();
  const queryClient = useQueryClient();

  const { data: users, isLoading: usersLoading, isError: usersError } = useUsers();
  const { 
    data: postsPages,
    fetchNextPage,
    hasNextPage,
    isLoading: postsLoading,
    isError: postsError
  } = useInfinitePosts(selectedUserId);

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  // Mutations
  const updatePostMutation = useMutation(
    async (updatedPost: Post) => {
      const { data } = await axios.put(
        `https://jsonplaceholder.typicode.com/posts/${updatedPost.id}`,
        updatedPost
      );
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['posts', selectedUserId]);
      },
    }
  );

  const deletePostMutation = useMutation(
    async (postId: number) => {
      await axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`);
      return postId;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['posts', selectedUserId]);
      },
    }
  );

  if (usersLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Loading users...</div>
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl text-red-500">Error loading users. Please try again later.</div>
      </div>
    );
  }

  const filteredUsers = users
    ?.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortField) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'company':
          return a.company.name.localeCompare(b.company.name);
        case 'email':
          return a.email.localeCompare(b.email);
        default:
          return 0;
      }
    });

  const allPosts = postsPages?.pages.flat() || [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-6 text-3xl font-bold">Users & Posts Dashboard</h1>
          
          {/* Search and Sort Controls */}
          <div className="mb-6 flex flex-wrap gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search users by name or email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={sortField} onValueChange={(value: SortField) => setSortField(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="company">Sort by Company</SelectItem>
                <SelectItem value="email">Sort by Email</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Users List */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                {filteredUsers?.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    isSelected={user.id === selectedUserId}
                    onClick={() => setSelectedUserId(user.id)}
                  />
                ))}
              </div>
            </div>

            {/* Posts List */}
            <div className="lg:col-span-2">
              {selectedUserId ? (
                <>
                  <h2 className="mb-4 text-2xl font-bold">
                    Posts by {users?.find((u) => u.id === selectedUserId)?.name}
                  </h2>
                  {postsLoading && !allPosts.length ? (
                    <div>Loading posts...</div>
                  ) : postsError ? (
                    <div className="text-red-500">Error loading posts. Please try again later.</div>
                  ) : (
                    <div className="space-y-4">
                      {allPosts.map((post) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          onEdit={() => setEditingPost(post)}
                          onDelete={() => deletePostMutation.mutate(post.id)}
                        />
                      ))}
                      <div ref={ref} className="h-4" />
                      {hasNextPage && (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => fetchNextPage()}
                        >
                          Load More <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  Select a user to view their posts
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <EditPostDialog
        post={editingPost}
        isOpen={!!editingPost}
        onClose={() => setEditingPost(null)}
        onSave={(updatedPost) => {
          updatePostMutation.mutate(updatedPost);
          setEditingPost(null);
        }}
      />
    </div>
  );
};

export default Dashboard;