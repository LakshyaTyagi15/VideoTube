import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export default function VideoCard({ video }) {
    const owner = video.owner;

    const formatViews = (views) => {
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
        if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
        return views?.toString() || '0';
    };

    const timeAgo = video.createdAt
        ? formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })
        : '';

    return (
        <Link to={`/video/${video._id}`} className="group block" id={`video-card-${video._id}`}>
            {/* Thumbnail */}
            <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-bg-tertiary">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                />
                {video.duration && (
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                        {formatDuration(video.duration)}
                    </span>
                )}
            </div>

            {/* Info */}
            <div className="flex gap-3">
                {owner && (
                    <Link to={`/channel/${owner.userName}`} onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
                        <img
                            src={owner.avatar}
                            alt={owner.fullName || owner.userName}
                            className="w-9 h-9 rounded-full object-cover"
                        />
                    </Link>
                )}
                <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium line-clamp-2 leading-snug group-hover:text-accent transition-colors">
                        {video.title}
                    </h3>
                    {owner && (
                        <p className="text-xs text-text-muted mt-1 hover:text-text-secondary">
                            {owner.fullName || owner.userName}
                        </p>
                    )}
                    <p className="text-xs text-text-muted mt-0.5">
                        {formatViews(video.views)} views{timeAgo ? ` • ${timeAgo}` : ''}
                    </p>
                </div>
            </div>
        </Link>
    );
}

function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
