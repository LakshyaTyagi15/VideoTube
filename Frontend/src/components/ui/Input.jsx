import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
    return (
        <div className="space-y-1.5">
            {label && <label className="block text-sm font-medium text-text-secondary">{label}</label>}
            <input
                ref={ref}
                className={`w-full bg-bg-secondary border ${error ? 'border-danger' : 'border-border-primary'} rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors ${className}`}
                {...props}
            />
            {error && <p className="text-xs text-danger">{error}</p>}
        </div>
    );
});

Input.displayName = 'Input';
export default Input;
