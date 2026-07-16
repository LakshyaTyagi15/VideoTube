import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllTweets, createTweet } from '../api/tweets';
import TweetCard from '../components/TweetCard';
import Button from '../components/ui/Button';
import { PageLoader, EmptyState } from '../components/ui/Loader';
import { HiOutlineChatAlt2 } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function Tweets() {
    const { user, isAuthenticated } = useAuth();
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState('');
    const [posting, setPosting] = useState(false);

    useEffect(() => {
        fetchTweets();
    }, []);

    const fetchTweets = async () => {
        try {
            const res = await getAllTweets({ page: 1, limit: 50 });
            setTweets(res.data.data || []);
        } catch {
            setTweets([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePost = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        setPosting(true);
        try {
            const res = await createTweet({ content });
            const newTweet = res.data.data;
            newTweet.ownerDetails = { _id: user._id, userName: user.userName, fullName: user.fullName, avatar: user.avatar };
            setTweets([newTweet, ...tweets]);
            setContent('');
            toast.success('Tweet posted!');
        } catch {
            toast.error('Failed to post tweet');
        } finally {
            setPosting(false);
        }
    };

    if (loading) return <PageLoader />;

    return (
        <div className="max-w-2xl mx-auto">

            {isAuthenticated && (
                <form onSubmit={handlePost} className="mb-6">
                    <div className="flex gap-3">
                        <img src={user.avatar} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                        <div className="flex-1">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="What's on your mind?"
                                className="w-full bg-bg-card border border-border-primary rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-accent placeholder:text-text-muted min-h-[80px] transition-colors"
                                rows={3}
                                id="tweet-input"
                            />
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-text-muted">{content.length}/500</span>
                                <Button type="submit" disabled={posting || !content.trim()} size="sm" id="tweet-submit">
                                    {posting ? 'Posting...' : 'Tweet'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            )}

            {tweets.length > 0 ? (
                <div className="space-y-3">
                    {tweets.map((tweet) => (
                        <TweetCard
                            key={tweet._id}
                            tweet={tweet}
                            onDelete={(id) => setTweets(tweets.filter(t => t._id !== id))}
                            onUpdate={(id, newContent) => setTweets(tweets.map(t => t._id === id ? { ...t, content: newContent } : t))}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={HiOutlineChatAlt2}
                    title="No tweets yet"
                    description={isAuthenticated ? "Share your first thought with the community!" : "Sign in to start tweeting."}
                />
            )}
        </div>
    );
}
