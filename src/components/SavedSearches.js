'use client';
import { useState, useEffect } from 'react';
import { Bookmark, Trash2, Search } from 'lucide-react';

export default function SavedSearches({ onSearchSelect }) {
    const [savedSearches, setSavedSearches] = useState([]);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [searchName, setSearchName] = useState('');

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('savedSearches') || '[]');
        setSavedSearches(saved);
    }, []);

    const saveCurrentSearch = (filters) => {
        if (!searchName.trim()) return;

        const newSearch = {
            id: Date.now(),
            name: searchName,
            filters,
            createdAt: new Date().toISOString()
        };

        const updated = [newSearch, ...savedSearches];
        localStorage.setItem('savedSearches', JSON.stringify(updated));
        setSavedSearches(updated);
        setSearchName('');
        setShowSaveDialog(false);
    };

    const deleteSearch = (id) => {
        const updated = savedSearches.filter(s => s.id !== id);
        localStorage.setItem('savedSearches', JSON.stringify(updated));
        setSavedSearches(updated);
    };

    const applySearch = (search) => {
        if (onSearchSelect) {
            onSearchSelect(search.filters);
        }
    };

    return (
        <div className="saved-searches">
            <div className="section-header">
                <h3><Bookmark size={20} /> Saved Searches</h3>
                <button
                    onClick={() => setShowSaveDialog(true)}
                    className="btn btn-sm btn-primary"
                >
                    Save Current
                </button>
            </div>

            {savedSearches.length === 0 ? (
                <div className="empty-state">
                    <Search size={48} />
                    <p>No saved searches yet</p>
                    <small>Save your frequent searches for quick access</small>
                </div>
            ) : (
                <div className="searches-list">
                    {savedSearches.map((search) => (
                        <div key={search.id} className="search-card">
                            <div className="search-info" onClick={() => applySearch(search)}>
                                <h4>{search.name}</h4>
                                <p className="search-details">
                                    {Object.entries(search.filters)
                                        .filter(([_, v]) => v)
                                        .map(([k, v]) => `${k}: ${v}`)
                                        .join(', ')}
                                </p>
                                <span className="search-date">
                                    Saved {new Date(search.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <button
                                onClick={() => deleteSearch(search.id)}
                                className="delete-btn"
                                title="Delete search"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {showSaveDialog && (
                <div className="save-dialog-overlay" onClick={() => setShowSaveDialog(false)}>
                    <div className="save-dialog" onClick={(e) => e.stopPropagation()}>
                        <h3>Save Current Search</h3>
                        <input
                            type="text"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            placeholder="e.g., Near SLIIT under 15k"
                            className="input-field"
                            autoFocus
                        />
                        <div className="dialog-actions">
                            <button onClick={() => setShowSaveDialog(false)} className="btn btn-secondary">
                                Cancel
                            </button>
                            <button
                                onClick={() => saveCurrentSearch({})}
                                className="btn btn-primary"
                                disabled={!searchName.trim()}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
