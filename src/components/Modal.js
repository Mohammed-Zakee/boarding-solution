'use client';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

export default function Modal({
    isOpen,
    onClose,
    title,
    message,
    type = 'info', // 'success', 'error', 'warning', 'info'
    confirmText = 'OK',
    cancelText = 'Cancel',
    onConfirm,
    showCancel = false
}) {
    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const icons = {
        success: <CheckCircle className="modal-icon success" size={48} />,
        error: <AlertCircle className="modal-icon error" size={48} />,
        warning: <AlertTriangle className="modal-icon warning" size={48} />,
        info: <Info className="modal-icon info" size={48} />
    };

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div className="modal-backdrop" onClick={onClose} />

            {/* Modal */}
            <div className="modal-container">
                <div className={`modal-content ${type}`}>
                    {/* Close button */}
                    <button className="modal-close" onClick={onClose} aria-label="Close">
                        <X size={20} />
                    </button>

                    {/* Icon */}
                    <div className="modal-icon-container">
                        {icons[type]}
                    </div>

                    {/* Title */}
                    {title && <h2 className="modal-title">{title}</h2>}

                    {/* Message */}
                    <p className="modal-message">{message}</p>

                    {/* Actions */}
                    <div className="modal-actions">
                        {showCancel && (
                            <button className="modal-btn modal-btn-cancel" onClick={onClose}>
                                {cancelText}
                            </button>
                        )}
                        <button className="modal-btn modal-btn-confirm" onClick={handleConfirm}>
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
