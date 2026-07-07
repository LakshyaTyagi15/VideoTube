import { useState, useEffect } from 'react';
import { getWatchHistory } from '../api/auth';
import VideoCard from '../components/VideoCard';
import { PageLoader, EmptyState } from '../components/ui/Loader';
import { HiOutlineClock } from 'react-icons/hi';

export default function History() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await getWatchHistory();
            setVideos(res.data.data || []);
        } catch {
            setVideos([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <PageLoader />;

    return (
        <div>
            <h1 className="text-xl font-semibold mb-6">Watch History</h1>
            {videos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {videos.map((video) => <VideoCard key={video._id} video={video} />)}
                </div>
            ) : (
                <EmptyState
                    icon={HiOutlineClock}
                    title="No watch history"
                    description="Videos you watch will appear here."
                />
            )}
        </div>
    );
}
