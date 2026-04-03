import React, { useEffect, useState } from 'react';
import { MapContainer as LeafletMap, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Loader from '../Common/Loader';
import { useTheme } from '../../context/ThemeContext';

// Fix for default Leaflet marker icons not displaying correctly in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const RecenterCenter = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(position);
    }, [map, position]);
    return null;
};

const MapContainer = ({
    center = [28.6139, 77.2090], // Default: New Delhi
    zoom = 13,
    children,
    className = "h-64 sm:h-80 md:h-[500px] w-full"
}) => {
    const [mounted, setMounted] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="h-64 flex items-center justify-center bg-white/5 rounded-2xl"><Loader size="small" /></div>;

    const tileUrl = theme === 'dark' 
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

    return (
        <div className={`${className} glass rounded-[2rem] border border-[var(--border-color)] p-3 sm:p-4 shadow-2xl relative overflow-hidden group hover:neon-border transition-all duration-500`}>
            <div className="w-full h-full bg-black rounded-[1.5rem] md:rounded-[2rem] relative overflow-hidden flex flex-col">
                <LeafletMap
                    center={center}
                    zoom={zoom}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%', position: 'absolute', inset: 0 }}
                    zoomControl={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                        url={tileUrl}
                    />
                    <RecenterCenter position={center} />
                    {children}
                </LeafletMap>

                <div className="absolute inset-0 pointer-events-none z-[400] bg-gradient-to-b from-transparent to-[var(--bg-color)] opacity-40" />

                {/* Pulse Pin overlay over the leaflet map */}
                <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-[500] pointer-events-none">
                    <div className="w-8 h-8 bg-primary rounded-full animate-ping opacity-75" />
                    <div className="absolute top-0 left-0 w-8 h-8 bg-primary rounded-full shadow-[0_0_30px_rgba(124,58,237,1)] border-2 border-white/20 flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapContainer;
