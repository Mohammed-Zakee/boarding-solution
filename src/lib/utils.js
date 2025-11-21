import imageCompression from 'browser-image-compression';
import axios from 'axios';

// Image Compression
export const compressImage = async (file) => {
    const options = {
        maxSizeMB: 0.5, // Max 500KB
        maxWidthOrHeight: 1024,
        useWebWorker: true,
    };

    try {
        const compressedFile = await imageCompression(file, options);
        return compressedFile;
    } catch (error) {
        console.error('Error compressing image:', error);
        return file; // Return original if compression fails
    }
};

// Convert File to Base64
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

// Geocoding (Convert Address to Lat/Lng)
// Note: You'll need to get a Google Maps API key from https://console.cloud.google.com/
// Enable "Geocoding API" in your Google Cloud project
export const geocodeAddress = async (address) => {
    const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE';

    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
        );

        if (response.data.results && response.data.results.length > 0) {
            const location = response.data.results[0].geometry.location;
            return {
                lat: location.lat,
                lng: location.lng,
                formattedAddress: response.data.results[0].formatted_address
            };
        } else {
            // Fallback to Colombo center if geocoding fails
            return {
                lat: 6.9271,
                lng: 79.8612,
                formattedAddress: address
            };
        }
    } catch (error) {
        console.error('Geocoding error:', error);
        // Fallback to Colombo center
        return {
            lat: 6.9271,
            lng: 79.8612,
            formattedAddress: address
        };
    }
};

// Format currency (LKR)
export const formatCurrency = (amount) => {
    return `Rs. ${amount.toLocaleString('en-LK')}`;
};

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
};

// Time ago formatter
export const timeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return past.toLocaleDateString();
};
