export default function Button({ children, variant = 'primary', size = 'md', className = '', disabled, ...props }) {
    const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-accent hover:bg-accent-hover text-white',
        secondary: 'bg-bg-tertiary hover:bg-bg-hover text-text-primary border border-border-primary',
        ghost: 'hover:bg-bg-hover text-text-secondary hover:text-text-primary',
        danger: 'bg-danger/10 hover:bg-danger/20 text-danger',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs gap-1.5',
        md: 'px-4 py-2 text-sm gap-2',
        lg: 'px-6 py-2.5 text-base gap-2',
    };

    return (
        <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={disabled} {...props}>
            {children}
        </button>
    );
}
