import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

interface PostCardProps {
  confessionId: string;
}

export function PostCard({ confessionId }: PostCardProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLiking, setIsLiking] = useState(false);

  const confession = useQuery(api.confessions.getConfessionWithUser, { id: confessionId });
  const likeConfession = useMutation(api.confessions.likeConfession);

  if (!confession) {
    return null;
  }

  const handleLike = async () => {
    if (isLiking) return;

    try {
      setIsLiking(true);
      await likeConfession({ confessionId });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to like confession',
        variant: 'destructive',
      });
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/confession/${confessionId}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link copied',
      description: 'Confession link copied to clipboard',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <img
          src={confession.user.image_url}
          alt={confession.user.username}
          className="w-8 h-8 rounded-full"
        />
        <div>
          <p className="font-medium">{confession.user.username}</p>
          <p className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(confession._creationTime), { addSuffix: true })}
          </p>
        </div>
      </div>

      {confession.text && <p className="mb-4 whitespace-pre-wrap">{confession.text}</p>}

      {confession.fileUrl && (
        <div className="mb-4">
          <img
            src={confession.fileUrl}
            alt="Confession attachment"
            className="max-h-96 w-full object-contain rounded-lg"
          />
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center gap-1 ${confession.isLiked ? 'text-red-500' : ''}`}
        >
          <Heart className="w-4 h-4" fill={confession.isLiked ? 'currentColor' : 'none'} />
          <span>{confession.likesCount}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/confession/${confessionId}`)}
          className="flex items-center gap-1"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{confession.commentsCount}</span>
        </Button>

        <Button variant="ghost" size="sm" onClick={handleShare} className="flex items-center gap-1">
          <Share2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
