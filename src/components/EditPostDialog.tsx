import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface EditPostDialogProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPost: Post) => void;
}

export const EditPostDialog: React.FC<EditPostDialogProps> = ({ post, isOpen, onClose, onSave }) => {
  const [title, setTitle] = React.useState(post?.title || '');
  const [body, setBody] = React.useState(post?.body || '');

  React.useEffect(() => {
    if (post) {
      setTitle(post.title);
      setBody(post.body);
    }
  }, [post]);

  const handleSave = () => {
    if (post) {
      onSave({ ...post, title, body });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Input
              placeholder="Post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Textarea
              placeholder="Post content"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};