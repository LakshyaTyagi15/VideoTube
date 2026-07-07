import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { HiOutlineHeart, HiHeart, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { toggleTweetLike } from '../api/likes';
import { deleteTweet, updateTweet } from '../api/tweets';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function TweetCard({ tweet, onDelete, onUpdate }) {
    const { user } = useAuth();
    const tweetOwner = tweet.ownerDetails || tweet.owner;
    const [isLiked, setIsLiked] = useState(tweet.isLiked || false);
    const [likesCount, setLikesCount] = useState(tweet.likesCount || 0);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(tweet.content);

    const isOwner = user?._id === tweetOwner?._id;

    const handleLike = async () => {
        try {
            await toggleTweetLike(tweet._id);
            setIsLiked(!isLiked);
            setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
        } catch {
            toast.error('Failed to like tweet');
        }
    };

    const handleDelete = async () => {
        try {
            await deleteTweet(tweet._id);
            toast.success('Tweet deleted');
            onDelete?.(tweet._id);
        } catch {
            toast.error('Failed to delete tweet');
        }
    };

    const handleUpdate = async () => {
        if (!editContent.trim()) return;
        try {
            await updateTweet(tweet._id, { content: editContent });
            setIsEditing(false);
            toast.success('Tweet updated');
            onUpdate?.(tweet._id, editContent);
        } catch {
            toast.error('Failed to update tweet');
        }
    };

    return (
        <div className="bg-bg-card border border-border-primary rounded-xl p-4 hover:border-border-secondary transition-colors">
            <div className="flex gap-3">
                <Link to={`/channel/${tweetOwner?.userName}`} className="flex-shrink-0">
                    <img
                        src={tweetOwner?.avatar}
                        alt={tweetOwner?.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                </Link>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <Link to={`/channel/${tweetOwner?.userName}`} className="font-medium text-sm hover:text-accent transition-colors">
                            {tweetOwner?.fullName}
                        </Link>
                        <span className="text-xs text-text-muted">@{tweetOwner?.userName}</span>
                        <span className="text-xs text-text-muted">·</span>
                        <span className="text-xs text-text-muted">
                            {tweet.createdAt && formatDistanceToNow(new Date(tweet.createdAt), { addSuffix: true })}
                        </span>
                    </div>

                    {isEditing ? (
                        <div className="space-y-2">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full bg-bg-secondary border border-border-primary rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-accent"
                                rows={3}
                            />
                            <div className="flex gap-2">
                                <button onClick={handleUpdate} className="px-3 py-1.5 bg-accent hover:bg-accent-hover text-white text-xs rounded-lg">Save</button>
                                <button onClick={() => { setIsEditing(false); setEditContent(tweet.content); }} className="px-3 py-1.5 bg-bg-tertiary hover:bg-bg-hover text-xs rounded-lg">Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">{tweet.content}</p>
                    )}

                    <div className="flex items-center gap-4 mt-3">
                        <button onClick={handleLike} className="flex items-center gap-1.5 text-xs text-text-muted hover:text-accent transition-colors group">
                            {isLiked ? <HiHeart className="w-4 h-4 text-accent" /> : <HiOutlineHeart className="w-4 h-4 group-hover:text-accent" />}
                            <span>{likesCount}</span>
                        </button>
                        {isOwner && !isEditing && (
                            <>
                                <button onClick={() => setIsEditing(true)} className="text-text-muted hover:text-text-primary transition-colors">
                                    <HiOutlinePencil className="w-4 h-4" />
                                </button>
                                <button onClick={handleDelete} className="text-text-muted hover:text-danger transition-colors">
                                    <HiOutlineTrash className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
