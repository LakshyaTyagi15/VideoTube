export function Spinner({ size = 'md' }) {
    const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
    return (
        <div className={`${sizes[size]} border-2 border-border-secondary border-t-accent rounded-full animate-spin`} />
    );
}

export function PageLoader() {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Spinner size="lg" />
        </div>
    );
}

export function VideoCardSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="aspect-video bg-bg-tertiary rounded-xl mb-3" />
            <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-bg-tertiary flex-shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-bg-tertiary rounded w-3/4" />
                    <div className="h-3 bg-bg-tertiary rounded w-1/2" />
                </div>
            </div>
        </div>
    );
}

export function EmptyState({ icon: Icon, title, description }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4">
            {Icon && <Icon className="w-16 h-16 text-text-muted mb-4" />}
            <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
            {description && <p className="text-sm text-text-muted max-w-sm">{description}</p>}
        </div>
    );
}
