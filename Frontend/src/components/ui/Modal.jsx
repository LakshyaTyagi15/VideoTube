import { useEffect } from 'react';
import { HiOutlineX } from 'react-icons/hi';

export default function Modal({ isOpen, onClose, title, children }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-bg-secondary border border-border-primary rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between p-5 border-b border-border-primary sticky top-0 bg-bg-secondary rounded-t-2xl z-10">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-bg-hover transition-colors" id="modal-close">
                        <HiOutlineX className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-5">{children}</div>
            </div>
        </div>
    );
}
