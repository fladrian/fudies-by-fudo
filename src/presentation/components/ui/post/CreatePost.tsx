import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { PostForm, Button } from '@presentation/components';

export const CreatePost = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleToggle = () => {
    setIsVisible((prev) => !prev);
  };


  return (
    <div className="relative">
      <div className='flex justify-end mb-4'>
        <Button
          onClick={handleToggle}
          variant={isVisible ? 'secondary' : 'primary'}
          leftIcon={isVisible ? <X size={16} /> : <Plus size={16} />}
        >
          {isVisible ? 'Cancel' : 'New Post'}
        </Button>
      </div>
      {isVisible && (
        <PostForm
          onSuccess={handleToggle}
          onCancel={handleToggle}
        />
      )}
    </div>
  );
};

