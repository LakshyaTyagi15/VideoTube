import { useState, useEffect } from 'react';
import { getLikedVideos } from '../api/likes';
import VideoCard from '../components/VideoCard';
import { PageLoader, EmptyState } from '../components/ui/Loader';
import { HiOutlineThumbUp } from 'react-icons/hi';

export default function LikedVideos() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLikedVideos();
    }, []);

    const fetchLikedVideos = async () => {
        try {
            const res = await getLikedVideos();
            const likedList = res.data.data || [];
            // Backend returns 'likedVideo' with 'ownerDetails' — map to VideoCard's expected shape
            setVideos(likedList.map(item => {
                const v = item.likedVideo;
                if (!v) return null;
                return { ...v, owner: v.ownerDetails || v.owner };
            }).filter(Boolean));
        } catch {
            setVideos([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <PageLoader />;

    return (
        <div>
            <h1 className="text-xl font-semibold mb-6">Liked Videos</h1>
            {videos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {videos.map((video) => <VideoCard key={video._id} video={video} />)}
                </div>
            ) : (
                <EmptyState
                    icon={HiOutlineThumbUp}
                    title="No liked videos"
                    description="Videos you like will appear here."
                />
            )}
        </div>
    );
}
