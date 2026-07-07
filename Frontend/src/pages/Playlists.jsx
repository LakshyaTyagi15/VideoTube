import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserPlaylists, createPlaylist, deletePlaylist } from '../api/playlists';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { PageLoader, EmptyState } from '../components/ui/Loader';
import { HiOutlineCollection, HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export default function Playlists() {
    const { user } = useAuth();
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newPlaylist, setNewPlaylist] = useState({ name: '', description: '' });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        if (user) fetchPlaylists();
    }, [user]);

    const fetchPlaylists = async () => {
        try {
            const res = await getUserPlaylists(user._id);
            setPlaylists(res.data.data || []);
        } catch {
            setPlaylists([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newPlaylist.name.trim()) return;
        setCreating(true);
        try {
            await createPlaylist(newPlaylist);
            setShowModal(false);
            setNewPlaylist({ name: '', description: '' });
            fetchPlaylists();
            toast.success('Playlist created');
        } catch {
            toast.error('Failed to create playlist');
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (playlistId) => {
        try {
            await deletePlaylist(playlistId);
            setPlaylists(playlists.filter(p => p._id !== playlistId));
            toast.success('Playlist deleted');
        } catch {
            toast.error('Failed to delete playlist');
        }
    };

    if (loading) return <PageLoader />;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-semibold">Your Playlists</h1>
                <Button onClick={() => setShowModal(true)} size="sm" id="create-playlist-btn">
                    <HiOutlinePlus className="w-4 h-4" />
                    New Playlist
                </Button>
            </div>

            {playlists.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {playlists.map((playlist) => (
                        <div key={playlist._id} className="bg-bg-card border border-border-primary rounded-xl p-5 hover:border-border-secondary transition-colors group">
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium line-clamp-1">{playlist.name}</h3>
                                    <p className="text-sm text-text-muted line-clamp-2 mt-1">{playlist.description}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(playlist._id)}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-bg-hover text-text-muted hover:text-danger transition-all ml-2"
                                >
                                    <HiOutlineTrash className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex items-center gap-2 mt-3 text-xs text-text-muted">
                                <span>{playlist.video?.length || 0} videos</span>
                                <span>·</span>
                                <span>{playlist.createdAt && formatDistanceToNow(new Date(playlist.createdAt), { addSuffix: true })}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={HiOutlineCollection}
                    title="No playlists yet"
                    description="Create a playlist to organize your favorite videos."
                />
            )}

            {/* Create Playlist Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Playlist">
                <form onSubmit={handleCreate} className="space-y-4">
                    <Input label="Name" placeholder="My Playlist" value={newPlaylist.name} onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })} id="playlist-name" />
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-text-secondary">Description</label>
                        <textarea
                            placeholder="What's this playlist about?"
                            value={newPlaylist.description}
                            onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
                            className="w-full bg-bg-secondary border border-border-primary rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent resize-none transition-colors"
                            rows={3}
                            id="playlist-description"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button type="submit" disabled={creating} id="playlist-create-submit">
                            {creating ? 'Creating...' : 'Create'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
