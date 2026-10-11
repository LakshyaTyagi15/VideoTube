import { useState, useEffect } from 'react';
import { deleteWatchHistory, getWatchHistory } from '../api/auth';
import VideoCard from '../components/VideoCard';
import { PageLoader, EmptyState } from '../components/ui/Loader';
import { HiOutlineClock, HiOutlineTrash } from 'react-icons/hi';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { toast } from 'react-hot-toast';

export default function History() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

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

    const handleDeleteHistory = async () => {
        setDeleting(true);
        try {
            await deleteWatchHistory();

            setVideos([]);
            setShowDeleteModal(false);
            toast.success('Watch history deleted');
        } catch {
            toast.error('Failed to delete watch history');
        } finally {
            setDeleting(false);
        }
    }

    if (loading) return <PageLoader />;

    return (
        <div>
            {/* <h1 className="text-xl font-semibold mb-6">Watch History</h1>
             */}

            <div className='flex items-center justify-between mb-6'>
                <h1 className='text-xl font-semibold'>Watch History</h1>
                {videos.length > 0 && (<Button variant='secondary' onClick={() => setShowDeleteModal(true)}><HiOutlineTrash className='w-4 h-4' />Clear History</Button>)}
            </div>
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

            <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete watch history?">
                <p className='text-sm text-text-muted'>This will permanently remove every video from watch history</p>

                <div className='flex justify-end gap-2 mt-6'>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={deleting}>Cancel</Button>

                    <Button onClick={handleDeleteHistory} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete History'}</Button>
                </div>
            </Modal>
        </div>
    );
}
