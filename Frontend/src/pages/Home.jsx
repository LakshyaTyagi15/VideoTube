import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllVideos } from '../api/videos';
import VideoCard from '../components/VideoCard';
import { VideoCardSkeleton, EmptyState } from '../components/ui/Loader';
import { HiOutlineVideoCamera } from 'react-icons/hi';

export default function Home() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query') || '';

    useEffect(() => {
        fetchVideos();
    }, [page, query]);

    const fetchVideos = async () => {
        setLoading(true);
        try {
            const res = await getAllVideos({ page, limit: 12, query, sortBy: 'createdAt', sortType: 'desc' });
            setVideos(res.data.data.docs || res.data.data || []);
            setTotalPages(res.data.data.totalPages || 1);
        } catch {
            setVideos([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {query && (
                <div className="mb-6">
                    <h1 className="text-xl font-semibold">
                        Search results for "<span className="text-accent">{query}</span>"
                    </h1>
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {Array.from({ length: 8 }).map((_, i) => <VideoCardSkeleton key={i} />)}
                </div>
            ) : videos.length === 0 ? (
                <EmptyState
                    icon={HiOutlineVideoCamera}
                    title={query ? 'No videos found' : 'No videos yet'}
                    description={query ? 'Try different search terms' : 'Be the first to publish a video!'}
                />
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {videos.map((video) => <VideoCard key={video._id} video={video} />)}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 text-sm bg-bg-tertiary rounded-lg hover:bg-bg-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2 text-sm text-text-muted">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 text-sm bg-bg-tertiary rounded-lg hover:bg-bg-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
