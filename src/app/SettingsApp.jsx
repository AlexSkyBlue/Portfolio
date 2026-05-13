'use client';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const wallpaperCollections = [
    { category: "Jujutsu Kaisen", images: ["https://wallpapers.com/images/hd/jujutsu-kaisen-desktop-6sgnzve7mydcuoyq.jpg"] },
    { category: "Solo Leveling", images: ["https://images6.alphacoders.com/137/1372163.jpeg", "https://wallpapercave.com/wp/wp13898557.jpg", "https://www.wallsnapy.com/img_gallery/close-up-sung-jin-woo-with-glowing-dagger-solo-leveling-4k-pc-wallpaper-451.jpg", "https://media.gq.com.mx/photos/683387a84e72b2e5bfc9ccc0/16:9/w_1920,c_limit/solo%20leveling%20anime.jpg"] },
    { category: "Kimetsu no Yaiba", images: ["https://wallpapercat.com/w/full/4/3/7/182723-3840x2160-desktop-4k-demon-slayer-kimetsu-no-yaiba-background-photo.jpg", "https://images.alphacoders.com/136/1363137.png", "https://wallpapercave.com/wp/wp6437579.jpg", "https://wallpapercave.com/wp/wp6822444.jpg"] },
    { category: "Mushoku Tensei", images: ["https://wallpapercat.com/w/full/8/9/a/25114-1920x1080-desktop-full-hd-mushoku-tensei-jobless-reincarnation-wallpaper-image.jpg", "https://4kwallpapers.com/images/walls/thumbs_3t/22933.jpg"] },
    { category: "Kaiju No. 8", images: ["https://4kwallpapers.com/images/walls/thumbs_3t/23664.jpg", "https://storage.googleapis.com/games-aktsk-jp-2022.appspot.com/1/2029/08/20250805_k8_EN_2.png"] },
    { category: "Berserk", images: ["https://wallpapercave.com/wp/wp13652536.jpg", "https://wallpapercave.com/wp/wp2746086.jpg", "https://wallpapercave.com/wp/wp14918106.webp", "https://images3.alphacoders.com/801/thumb-1920-801556.png"] },
    { category: "Gachiakuta", images: ["https://wallpapercave.com/wp/wp15694371.jpg", "https://wallpapercave.com/wp/wp15694362.png", "https://4kwallpapers.com/images/walls/thumbs_3t/22724.jpg", "https://images4.alphacoders.com/139/1398691.jpg", "https://images2.alphacoders.com/139/1398243.jpg"] },
    { category: "Record of Ragnarok", images: ["https://images2.alphacoders.com/115/thumb-1920-1154072.jpg", "https://images4.alphacoders.com/140/1404912.jpg", "https://wallpapercave.com/wp/wp14628600.jpg"] },
    { category: "Kengan Ashura", images: ["https://images6.alphacoders.com/137/thumb-1920-1372401.png", "https://wallpapers.com/images/hd/ohma-tokita-4o7rgm2komt7ckv8.jpg", "https://images.wallpapersden.com/image/download/netflix-kengan-ashura_bmZtZWiUmZqaraWkpJRnZWltrWZmamc.jpg"] },
    { category: "Dorohedoro", images: ["https://images2.alphacoders.com/140/thumb-1920-1407673.png", "http://desktophut.com/images/thumb_1675712022_301005.jpg"] }
];

export default function SettingsApp({ isOpen, onClose, currentBg, onSelectWallpaper, cursorSettings, onUpdateCursor }) {
    const [activeTab, setActiveTab] = useState('wallpapers');
    const [volume, setVolume] = useState(50);

    if (!isOpen) return null;

    // Lista expandida de diseños para el grid
    const cursorStyles = [
        { id: 'outline_dot', name: 'Anillo + Punto', icon: 'solar:target-bold' },
        { id: 'solid_ring', name: 'Anillo Sólido', icon: 'solar:vinyl-bold' },
        { id: 'minimal_dot', name: 'Punto Mínimo', icon: 'solar:add-circle-bold' },
        { id: 'crosshair_plus', name: 'Mira Pro', icon: 'solar:crosshairs-bold' },
    ];

    // Tipos de rastros bonitos
    const trailTypes = [
        { id: 'none', name: 'Sin Rastro' },
        { id: 'classic', name: 'Estela Elástica' },
        { id: 'particles', name: 'Sistema de Partículas (Bonito)' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="absolute inset-0 z-[60] bg-black/40 backdrop-blur-md flex items-center justify-center p-6 cursor-auto"
            onClick={onClose}
        >
            <div
                className="bg-white/95 backdrop-blur-2xl w-full max-w-6xl h-[85vh] rounded-[2rem] shadow-2xl flex overflow-hidden border border-white/40"
                onClick={(e) => e.stopPropagation()}
            >
                {/* MENU LATERAL */}
                <div className="w-1/4 bg-gray-50/50 border-r border-gray-200/50 flex flex-col p-4">
                    <div className="px-4 py-6">
                        <h2 className="text-2xl font-bold text-gray-800">Ajustes</h2>
                    </div>
                    <nav className="flex flex-col gap-2 overflow-y-auto custom-scrollbar">
                        {/* General */}
                        <button onClick={() => setActiveTab('general')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'general' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200/50'}`}>
                            <Icon icon="solar:settings-bold" width={24} /> General
                        </button>
                        {/* Fondos */}
                        <button onClick={() => setActiveTab('wallpapers')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'wallpapers' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200/50'}`}>
                            <Icon icon="solar:gallery-bold" width={24} /> Fondos
                        </button>
                        {/* Cursor Custom (EXPANDIDO) */}
                        <button onClick={() => setActiveTab('cursor')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'cursor' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200/50'}`}>
                            <Icon icon="solar:mouse-circle-bold" width={24} /> Cursor Custom
                        </button>
                        {/* Sonido */}
                        <button onClick={() => setActiveTab('sound')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'sound' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200/50'}`}>
                            <Icon icon="solar:volume-loud-bold-duotone" width={24} /> Sonido
                        </button>
                    </nav>
                    <div className="mt-auto px-4 pb-4">
                        <button onClick={onClose} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-bold transition-colors">
                            Cerrar Ajustes
                        </button>
                    </div>
                </div>

                {/* CONTENIDO PRINCIPAL */}
                <div className="w-3/4 flex flex-col bg-white overflow-hidden">
                    {/* TAB: FONDOS */}
                    {activeTab === 'wallpapers' && (
                        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                            <h3 className="text-3xl font-bold text-gray-800 mb-8">Elige un Fondo</h3>
                            <button onClick={() => onSelectWallpaper(null)} className="mb-10 flex items-center gap-3 bg-gradient-to-r from-orange-400 to-blue-500 p-4 rounded-2xl text-white font-bold hover:scale-[1.02] transition-transform shadow-lg cursor-pointer">
                                <Icon icon="solar:refresh-circle-bold" width={28} /> Restaurar Fondo Clásico
                            </button>
                            {wallpaperCollections.map((col, index) => (
                                <div key={index} className="mb-10">
                                    <h4 className="text-xl font-semibold text-gray-700 mb-4">{col.category}</h4>
                                    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
                                        {col.images.map((imgUrl, imgIdx) => (
                                            <div key={imgIdx} onClick={() => onSelectWallpaper(imgUrl)} className="min-w-[280px] h-[160px] relative rounded-2xl overflow-hidden cursor-pointer snap-start group border-4 border-transparent hover:border-blue-500 transition-all shadow-md">
                                                <img src={imgUrl} alt={col.category} className="w-full h-full object-cover" />
                                                {currentBg === imgUrl && (
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                        <Icon icon="solar:check-circle-bold" width={48} className="text-white drop-shadow-lg" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* TAB: CURSOR CUSTOM (EXPANDIDO) */}
                    {activeTab === 'cursor' && (
                        <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
                            <h3 className="text-3xl font-bold text-gray-800 mb-8 tracking-tight">Personalizar Cursor</h3>

                            <div className="space-y-10 max-w-2xl">
                                {/* Estilo Base (El Grid Bonito) */}
                                <div>
                                    <h4 className="text-lg font-bold text-gray-800 mb-4 ml-1">Diseño del Puntero</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {cursorStyles.map(style => (
                                            <button
                                                key={style.id}
                                                onClick={() => onUpdateCursor({ ...cursorSettings, style: style.id })}
                                                className={`p-5 rounded-2xl border-2 capitalize flex flex-row items-center gap-4 cursor-pointer transition-all ${cursorSettings.style === style.id ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-inner' : 'border-gray-100 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:border-gray-200'}`}
                                            >
                                                <div className={`p-3 rounded-full ${cursorSettings.style === style.id ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                                    <Icon icon={style.icon} width={28} className={cursorSettings.style === style.id ? 'text-blue-600' : 'text-gray-500'} />
                                                </div>
                                                <span className="font-bold text-lg">{style.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Tipo de Rastro (Select Bonito) */}
                                <div>
                                    <h4 className="text-lg font-bold text-gray-800 mb-4 ml-1">Efecto de Rastro y Seguimiento</h4>
                                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between gap-6">
                                        <div className="flex items-center gap-3">
                                            <Icon icon="solar:graph-up-bold-duotone" width={32} className="text-blue-500" />
                                            <div>
                                                <p className="font-bold text-gray-800 text-lg">Tipo de Estela</p>
                                                <p className="text-gray-500 text-sm">Cambia la física y forma del rastro.</p>
                                            </div>
                                        </div>
                                        {/* Select nativo pero con clases Tailwind para iPad */}
                                        <select
                                            value={cursorSettings.trailType}
                                            onChange={(e) => onUpdateCursor({ ...cursorSettings, trailType: e.target.value })}
                                            className="bg-white border border-gray-200 rounded-full px-5 py-3 text-lg font-semibold text-gray-800 cursor-pointer shadow-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all outline-none"
                                        >
                                            {trailTypes.map(trail => (
                                                <option key={trail.id} value={trail.id}>{trail.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Color de Acento (Ya estaba) */}
                                <div>
                                    <h4 className="text-lg font-bold text-gray-800 mb-4 ml-1">Color de Acento</h4>
                                    <div className="flex items-center gap-6 bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm">
                                        <input
                                            type="color"
                                            value={cursorSettings.color}
                                            onChange={(e) => onUpdateCursor({ ...cursorSettings, color: e.target.value })}
                                            className="w-16 h-16 rounded-xl cursor-pointer border-4 border-white shadow-xl p-0 outline-none"
                                        />
                                        <div>
                                            <p className="font-bold text-gray-800 text-lg">Personaliza el Color</p>
                                            <p className="text-gray-500 text-sm">Afecta tanto al puntero como al rastro elegido.</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* TAB: SONIDO */}
                    {activeTab === 'sound' && (
                        <div className="flex-1 p-10">
                            <h3 className="text-3xl font-bold text-gray-800 mb-8">Sonido y Volumen</h3>
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-6">
                                <Icon icon="solar:volume-small-outline" width={32} className="text-gray-400" />
                                <input
                                    type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(e.target.value)}
                                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                                <Icon icon="solar:volume-up-outline" width={32} className="text-gray-400" />
                                <span className="text-lg font-bold text-gray-600 w-12">{volume}%</span>
                            </div>
                        </div>
                    )}

                    {/* TAB: GENERAL */}
                    {activeTab === 'general' && (
                        <div className="flex-1 p-10">
                            <h3 className="text-3xl font-bold text-gray-800 mb-8">General</h3>
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <p className="text-gray-600 font-medium">Tablet OS V1.0</p>
                                <p className="text-gray-400 text-sm mt-2">Desarrollado por AlexSkyBlue.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}