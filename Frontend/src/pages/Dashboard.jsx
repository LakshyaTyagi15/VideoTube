import { useState, useEffect } from 'react';
import { getChannelStats, getChannelVideos } from '../api/dashboard';
import { togglePublishStatus, deleteVideo } from '../api/videos';
import { PageLoader, EmptyState } from '../components/ui/Loader';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { publishVideo } from '../api/videos';
import { useAuth } from '../context/AuthContext';
import { HiOutlineEye, HiOutlineUsers, HiOutlineVideoCamera, HiOutlineThumbUp, HiOutlinePlus, HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const statCards = [
    { key: 'totalViews', label: 'Total Views', icon: HiOutlineEye, color: 'text-blue-400' },
    { key: 'totalSubscribers', label: 'Subscribers', icon: HiOutlineUsers, color: 'text-green-400' },
    { key: 'totalVideos', label: 'Total Videos', icon: HiOutlineVideoCamera, color: 'text-accent' },
    { key: 'totalLikes', label: 'Total Likes', icon: HiOutlineThumbUp, color: 'text-pink-400' },
];

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({});
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const [uploadData, setUploadData] = useState({ title: '', description: '' });
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, videosRes] = await Promise.all([getChannelStats(), getChannelVideos()]);
            setStats(statsRes.data.data || {});
            setVideos(videosRes.data.data || []);
        } catch {
            /* silently fail */
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePublish = async (videoId) => {
        try {
            await togglePublishStatus(videoId);
            setVideos(videos.map(v => v._id === videoId ? { ...v, isPublished: !v.isPublished } : v));
            toast.success('Publish status updated');
        } catch {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (videoId) => {
        try {
            await deleteVideo(videoId);
            setVideos(videos.filter(v => v._id !== videoId));
            toast.success('Video deleted');
        } catch {
            toast.error('Failed to delete video');
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadData.title || !videoFile || !thumbnail) {
            toast.error('Title, video file, and thumbnail are required');
            return;
        }
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('title', uploadData.title);
            fd.append('description', uploadData.description);
            fd.append('videoFile', videoFile);
            fd.append('thumbnail', thumbnail);
            await publishVideo(fd);
            setShowUpload(false);
            setUploadData({ title: '', description: '' });
            setVideoFile(null);
            setThumbnail(null);
            fetchData();
            toast.success('Video published!');
        } catch {
            toast.error('Failed to upload video');
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <PageLoader />;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-semibold">Dashboard</h1>
                    <p className="text-sm text-text-muted mt-1">Welcome back, {user?.fullName}</p>
                </div>
                <Button onClick={() => setShowUpload(true)} id="upload-video-btn">
                    <HiOutlinePlus className="w-4 h-4" />
                    Upload Video
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map(({ key, label, icon: Icon, color }) => (
                    <div key={key} className="bg-bg-card border border-border-primary rounded-xl p-5 hover:border-border-secondary transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2 rounded-lg bg-bg-tertiary ${color}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold">{stats[key] || 0}</p>
                        <p className="text-xs text-text-muted mt-1">{label}</p>
                    </div>
                ))}
            </div>

            {/* Videos Table */}
            <div className="bg-bg-card border border-border-primary rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border-primary">
                    <h2 className="font-semibold">Your Videos</h2>
                </div>

                {videos.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border-primary text-left text-xs text-text-muted uppercase tracking-wider">
                                    <th className="px-5 py-3 font-medium">Video</th>
                                    <th className="px-5 py-3 font-medium hidden sm:table-cell">Published</th>
                                    <th className="px-5 py-3 font-medium hidden md:table-cell">Views</th>
                                    <th className="px-5 py-3 font-medium hidden md:table-cell">Date</th>
                                    <th className="px-5 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {videos.map((video) => (
                                    <tr key={video._id} className="border-b border-border-primary last:border-0 hover:bg-bg-hover/50 transition-colors">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <img src={video.thumbnail} alt="" className="w-20 h-12 rounded-lg object-cover bg-bg-tertiary flex-shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium line-clamp-1">{video.title}</p>
                                                    <p className="text-xs text-text-muted line-clamp-1">{video.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 hidden sm:table-cell">
                                            <button
                                                onClick={() => handleTogglePublish(video._id)}
                                                className={`text-xs px-2.5 py-1 rounded-full font-medium ${video.isPublished ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'
                                                    }`}
                                            >
                                                {video.isPublished ? 'Published' : 'Draft'}
                                            </button>
                                        </td>
                                        <td className="px-5 py-3 text-sm text-text-muted hidden md:table-cell">{video.views}</td>
                                        <td className="px-5 py-3 text-sm text-text-muted hidden md:table-cell">
                                            {video.createdAt && formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => handleDelete(video._id)}
                                                    className="p-1.5 rounded-lg hover:bg-bg-hover text-text-muted hover:text-danger transition-colors"
                                                >
                                                    <HiOutlineTrash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8">
                        <EmptyState icon={HiOutlineVideoCamera} title="No videos yet" description="Upload your first video to get started." />
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            <Modal isOpen={showUpload} onClose={() => setShowUpload(false)} title="Upload Video">
                <form onSubmit={handleUpload} className="space-y-4">
                    <Input label="Title" placeholder="Enter video title" value={uploadData.title} onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })} id="upload-title" />
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-text-secondary">Description</label>
                        <textarea
                            placeholder="Describe your video"
                            value={uploadData.description}
                            onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                            className="w-full bg-bg-secondary border border-border-primary rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent resize-none transition-colors"
                            rows={3}
                            id="upload-description"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-text-secondary">Video File *</label>
                        <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} className="w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-bg-tertiary file:text-text-primary hover:file:bg-bg-hover" id="upload-video-file" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-text-secondary">Thumbnail *</label>
                        <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} className="w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-bg-tertiary file:text-text-primary hover:file:bg-bg-hover" id="upload-thumbnail" />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="secondary" type="button" onClick={() => setShowUpload(false)}>Cancel</Button>
                        <Button type="submit" disabled={uploading} id="upload-submit">
                            {uploading ? 'Uploading...' : 'Publish'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
