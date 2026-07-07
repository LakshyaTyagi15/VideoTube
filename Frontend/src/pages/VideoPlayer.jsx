import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVideoById } from '../api/videos';
import { getVideoComments, addComment, deleteComment } from '../api/comments';
import { toggleVideoLike } from '../api/likes';
import { toggleSubscription } from '../api/subscriptions';
import { useAuth } from '../context/AuthContext';
import { PageLoader, EmptyState } from '../components/ui/Loader';
import Button from '../components/ui/Button';
import { HiOutlineThumbUp, HiThumbUp, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export default function VideoPlayer() {
    const { videoId } = useParams();
    const { user } = useAuth();
    const [video, setVideo] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscribersCount, setSubscribersCount] = useState(0);

    useEffect(() => {
        fetchVideo();
        fetchComments();
    }, [videoId]);

    const fetchVideo = async () => {
        try {
            const res = await getVideoById(videoId);
            const v = res.data.data;
            setVideo(v);
            setIsLiked(v.isLiked || false);
            setLikesCount(v.likesCount || 0);
            setIsSubscribed(v.owner?.isSubscribed || false);
            setSubscribersCount(v.owner?.subscribersCount || 0);
        } catch {
            toast.error('Failed to load video');
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const res = await getVideoComments(videoId, { page: 1, limit: 50 });
            setComments(res.data.data.docs || res.data.data || []);
        } catch { /* silently fail */ }
    };

    const handleLike = async () => {
        try {
            await toggleVideoLike(videoId);
            setIsLiked(!isLiked);
            setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
        } catch {
            toast.error('Please sign in to like');
        }
    };

    const handleSubscribe = async () => {
        try {
            await toggleSubscription(video.owner._id);
            setIsSubscribed(!isSubscribed);
            setSubscribersCount(prev => isSubscribed ? prev - 1 : prev + 1);
        } catch {
            toast.error('Please sign in to subscribe');
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        try {
            await addComment(videoId, { content: commentText });
            setCommentText('');
            fetchComments();
            toast.success('Comment added');
        } catch {
            toast.error('Failed to add comment');
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId);
            setComments(comments.filter(c => c._id !== commentId));
            toast.success('Comment deleted');
        } catch {
            toast.error('Failed to delete comment');
        }
    };

    if (loading) return <PageLoader />;
    if (!video) return <EmptyState title="Video not found" description="This video may have been removed." />;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Video Player */}
                    <div className="aspect-video bg-black rounded-xl overflow-hidden">
                        <video
                            src={video.videoFile}
                            controls
                            autoPlay
                            className="w-full h-full"
                            poster={video.thumbnail}
                            id="video-player"
                        />
                    </div>

                    {/* Title & Actions */}
                    <div>
                        <h1 className="text-xl font-semibold leading-snug">{video.title}</h1>
                        <div className="flex flex-wrap items-center justify-between gap-4 mt-3">
                            <div className="flex items-center gap-4">
                                {/* Channel Info */}
                                <Link to={`/channel/${video.owner?.userName}`} className="flex items-center gap-3">
                                    <img src={video.owner?.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                                    <div>
                                        <p className="text-sm font-medium hover:text-accent transition-colors">{video.owner?.fullName}</p>
                                        <p className="text-xs text-text-muted">{subscribersCount} subscribers</p>
                                    </div>
                                </Link>
                                {user?._id !== video.owner?._id && (
                                    <Button
                                        onClick={handleSubscribe}
                                        variant={isSubscribed ? 'secondary' : 'primary'}
                                        size="sm"
                                        id="subscribe-btn"
                                    >
                                        {isSubscribed ? 'Subscribed' : 'Subscribe'}
                                    </Button>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleLike}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${isLiked ? 'bg-accent-muted text-accent' : 'bg-bg-tertiary hover:bg-bg-hover text-text-secondary'
                                        }`}
                                    id="like-btn"
                                >
                                    {isLiked ? <HiThumbUp className="w-5 h-5" /> : <HiOutlineThumbUp className="w-5 h-5" />}
                                    {likesCount}
                                </button>
                                <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-bg-tertiary text-sm text-text-secondary">
                                    <HiOutlineEye className="w-4 h-4" />
                                    {video.views} views
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-bg-card rounded-xl p-4 text-sm text-text-secondary leading-relaxed">
                        <p className="text-xs text-text-muted mb-2">
                            {video.createdAt && formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
                        </p>
                        <p className="whitespace-pre-wrap">{video.description}</p>
                    </div>

                    {/* Comments */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">{comments.length} Comments</h3>

                        {user && (
                            <form onSubmit={handleAddComment} className="flex gap-3 mb-6">
                                <img src={user.avatar} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Add a comment..."
                                        className="w-full bg-transparent border-b border-border-primary py-2 text-sm focus:outline-none focus:border-accent placeholder:text-text-muted transition-colors"
                                        id="comment-input"
                                    />
                                    {commentText.trim() && (
                                        <div className="flex justify-end gap-2 mt-2">
                                            <Button variant="ghost" size="sm" type="button" onClick={() => setCommentText('')}>Cancel</Button>
                                            <Button size="sm" type="submit" id="comment-submit">Comment</Button>
                                        </div>
                                    )}
                                </div>
                            </form>
                        )}

                        <div className="space-y-4">
                            {comments.map((comment) => (
                                <div key={comment._id} className="flex gap-3 group">
                                    <Link to={`/channel/${comment.owner?.userName}`}>
                                        <img src={comment.owner?.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <Link to={`/channel/${comment.owner?.userName}`} className="text-sm font-medium hover:text-accent transition-colors">
                                                @{comment.owner?.userName}
                                            </Link>
                                            <span className="text-xs text-text-muted">
                                                {comment.createdAt && formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-text-secondary mt-0.5">{comment.content}</p>
                                    </div>
                                    {user?._id === comment.owner?._id && (
                                        <button
                                            onClick={() => handleDeleteComment(comment._id)}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-bg-hover text-text-muted hover:text-danger transition-all"
                                        >
                                            <HiOutlineTrash className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar placeholder */}
                <div className="hidden lg:block">
                    <div className="bg-bg-card border border-border-primary rounded-xl p-4">
                        <h4 className="text-sm font-medium text-text-muted mb-3">More from {video.owner?.fullName}</h4>
                        <p className="text-xs text-text-muted">Related videos will appear here.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
