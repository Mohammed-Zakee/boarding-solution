'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

export default function ImageCarousel({ images, title }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    if (!images || images.length === 0) {
        return (
            <div className="image-carousel-empty">
                <p>No images available</p>
            </div>
        );
    }

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToImage = (index) => {
        setCurrentIndex(index);
    };

    return (
        <>
            {/* Main Carousel */}
            <div className="image-carousel">
                {/* Main Image */}
                <div className="carousel-main-image">
                    <img
                        src={images[currentIndex]}
                        alt={`${title} - Image ${currentIndex + 1}`}
                        onClick={() => setIsFullscreen(true)}
                    />

                    {/* Zoom Button */}
                    <button
                        className="carousel-zoom-btn"
                        onClick={() => setIsFullscreen(true)}
                        title="View fullscreen"
                    >
                        <ZoomIn size={20} />
                    </button>

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                className="carousel-btn carousel-btn-prev"
                                onClick={prevImage}
                                aria-label="Previous image"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                className="carousel-btn carousel-btn-next"
                                onClick={nextImage}
                                aria-label="Next image"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}

                    {/* Image Counter */}
                    <div className="carousel-counter">
                        {currentIndex + 1} / {images.length}
                    </div>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className="carousel-thumbnails">
                        {images.map((img, index) => (
                            <div
                                key={index}
                                className={`carousel-thumbnail ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => goToImage(index)}
                            >
                                <img src={img} alt={`Thumbnail ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Fullscreen Modal */}
            {isFullscreen && (
                <div className="carousel-fullscreen" onClick={() => setIsFullscreen(false)}>
                    <button
                        className="carousel-fullscreen-close"
                        onClick={() => setIsFullscreen(false)}
                    >
                        <X size={32} />
                    </button>

                    <img
                        src={images[currentIndex]}
                        alt={`${title} - Fullscreen`}
                        onClick={(e) => e.stopPropagation()}
                    />

                    {images.length > 1 && (
                        <>
                            <button
                                className="carousel-fullscreen-btn carousel-fullscreen-prev"
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            >
                                <ChevronLeft size={48} />
                            </button>
                            <button
                                className="carousel-fullscreen-btn carousel-fullscreen-next"
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            >
                                <ChevronRight size={48} />
                            </button>
                        </>
                    )}

                    <div className="carousel-fullscreen-counter">
                        {currentIndex + 1} / {images.length}
                    </div>
                </div>
            )}
        </>
    );
}
