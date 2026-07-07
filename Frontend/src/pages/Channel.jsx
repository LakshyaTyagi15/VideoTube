import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getChannelProfile } from '../api/auth';
import { getAllVideos } from '../api/videos';
import { getUserTweets } from '../api/tweets';
import { toggleSubscription } from '../api/subscriptions';
import { getUserPlaylists } from '../api/playlists';
import { useAuth } from '../context/AuthContext';
import VideoCard from '../components/VideoCard';
import TweetCard from '../components/TweetCard';
import { PageLoader, EmptyState } from '../components/ui/Loader';
import Button from '../components/ui/Button';
import { HiOutlineVideoCamera, HiOutlineChatAlt2, HiOutlineCollection } from 'react-icons/hi';
import toast from 'react-hot-toast';

const tabs = [
    { id: 'videos', label: 'Videos', icon: HiOutlineVideoCamera },
    { id: 'tweets', label: 'Tweets', icon: HiOutlineChatAlt2 },
    { id: 'playlists', label: 'Playlists', icon: HiOutlineCollection },
];

export default function Channel() {
    const { userName } = useParams();
    const { user } = useAuth();
    const [channel, setChannel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('videos');
    const [videos, setVideos] = useState([]);
    const [tweets, setTweets] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscribersCount, setSubscribersCount] = useState(0);

    useEffect(() => {
        fetchChannel();
    }, [userName]);

    useEffect(() => {
        if (channel) {
            if (activeTab === 'videos') fetchVideos();
            else if (activeTab === 'tweets') fetchTweets();
            else if (activeTab === 'playlists') fetchPlaylists();
        }
    }, [activeTab, channel]);

    const fetchChannel = async () => {
        setLoading(true);
        try {
            const res = await getChannelProfile(userName);
            const ch = res.data.data;
            setChannel(ch);
            setIsSubscribed(ch.isSubscribed || false);
            setSubscribersCount(ch.subscribersCount || 0);
        } catch {
            toast.error('Channel not found');
        } finally {
            setLoading(false);
        }
    };

    const fetchVideos = async () => {
        try {
            const res = await getAllVideos({ userId: channel._id, limit: 20 });
            setVideos(res.data.data.docs || res.data.data || []);
        } catch { setVideos([]); }
    };

    const fetchTweets = async () => {
        try {
            const res = await getUserTweets(channel._id);
            setTweets(res.data.data || []);
        } catch { setTweets([]); }
    };

    const fetchPlaylists = async () => {
        try {
            const res = await getUserPlaylists(channel._id);
            setPlaylists(res.data.data || []);
        } catch { setPlaylists([]); }
    };

    const handleSubscribe = async () => {
        try {
            await toggleSubscription(channel._id);
            setIsSubscribed(!isSubscribed);
            setSubscribersCount(prev => isSubscribed ? prev - 1 : prev + 1);
        } catch {
            toast.error('Please sign in to subscribe');
        }
    };

    if (loading) return <PageLoader />;
    if (!channel) return <EmptyState title="Channel not found" />;

    const isOwner = user?._id === channel._id;

    return (
        <div className="max-w-6xl mx-auto">
            {/* Cover Image */}
            <div className="h-32 sm:h-48 rounded-2xl overflow-hidden bg-bg-tertiary mb-4">
                {channel.coverImage && (
                    <img src={channel.coverImage} alt="Cover" className="w-full h-full object-cover" />
                )}
            </div>

            {/* Channel Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 px-2">
                <img
                    src={channel.avatar}
                    alt={channel.fullName}
                    className="w-20 h-20 rounded-full object-cover border-4 border-bg-primary -mt-10 sm:-mt-6"
                />
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">{channel.fullName}</h1>
                    <div className="flex items-center gap-2 text-sm text-text-muted mt-1">
                        <span>@{channel.userName}</span>
                        <span>·</span>
                        <span>{subscribersCount} subscribers</span>
                        {channel.channelsSubscribedToCount !== undefined && (
                            <>
                                <span>·</span>
                                <span>{channel.channelsSubscribedToCount} subscriptions</span>
                            </>
                        )}
                    </div>
                </div>
                {!isOwner && (
                    <Button
                        onClick={handleSubscribe}
                        variant={isSubscribed ? 'secondary' : 'primary'}
                        id="channel-subscribe-btn"
                    >
                        {isSubscribed ? 'Subscribed' : 'Subscribe'}
                    </Button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border-primary mb-6 overflow-x-auto scrollbar-hidden">
                {tabs.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === id
                                ? 'border-accent text-accent'
                                : 'border-transparent text-text-muted hover:text-text-primary'
                            }`}
                    >
                        <Icon className="w-4 h-4" />
                        {label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'videos' && (
                videos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {videos.map((v) => <VideoCard key={v._id} video={v} />)}
                    </div>
                ) : (
                    <EmptyState icon={HiOutlineVideoCamera} title="No videos yet" description="This channel hasn't published any videos." />
                )
            )}

            {activeTab === 'tweets' && (
                tweets.length > 0 ? (
                    <div className="space-y-3 max-w-2xl">
                        {tweets.map((tweet) => (
                            <TweetCard
                                key={tweet._id}
                                tweet={tweet}
                                onDelete={(id) => setTweets(tweets.filter(t => t._id !== id))}
                                onUpdate={(id, content) => setTweets(tweets.map(t => t._id === id ? { ...t, content } : t))}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState icon={HiOutlineChatAlt2} title="No tweets yet" description="This channel hasn't posted any tweets." />
                )
            )}

            {activeTab === 'playlists' && (
                playlists.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {playlists.map((playlist) => (
                            <div key={playlist._id} className="bg-bg-card border border-border-primary rounded-xl p-4 hover:border-border-secondary transition-colors">
                                <h3 className="font-medium text-sm mb-1">{playlist.name}</h3>
                                <p className="text-xs text-text-muted line-clamp-2">{playlist.description}</p>
                                <p className="text-xs text-text-muted mt-2">{playlist.video?.length || 0} videos</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState icon={HiOutlineCollection} title="No playlists yet" description="This channel hasn't created any playlists." />
                )
            )}
        </div>
    );
}
