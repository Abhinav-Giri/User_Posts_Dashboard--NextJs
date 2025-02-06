import React, { useState } from 'react';
import { Post } from '@/types';
import { Button } from '../ui/button';

interface EditPostDialogProps {
  post: Post | null;
  onSave: (post: Post) => void;
  onClose: () => void;
}

export const EditPostDialog: React.FC<EditPostDialogProps> = ({ 
  post, 
  onSave, 
  onClose 
}) => {
  const [title, setTitle] = useState(post?.title || '');
  const [body, setBody] = useState(post?.body || '');

  const handleSave = () => {
    if (post) {
      onSave({ ...post, title, body });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl mb-4">Edit Post</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 mb-4"
          placeholder="Post Title"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full border p-2 mb-4 h-32"
          placeholder="Post Content"
        />
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  );
};
