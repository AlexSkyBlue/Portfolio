'use client';
import { Icon } from '@iconify/react';
import { toast } from "react-toastify";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import CustomCursor from './CustomCursor';
import WeatherWidget from './WeatherWidget';
import SpotifyWidget from './SpotifyWidget';
import AppGrid from './AppGrid';
import SettingsApp from './SettingsApp';
import CalendarApp from './CalendarApp';

// 1. DOCK APPS
const dockApps = [
  { id: 'settings', icon: <Icon icon="solar:settings-bold" width={32} color="#4b5563" />, name: 'Ajustes' },
  { id: 'calendar', icon: <Icon icon="mdi:calendar" width={32} color="#c2185b" />, name: 'Calendario' },
];

// 2. VARIANTES DE ANIMACIÓN
const carouselVariants = {
  enter: (direction) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0.5 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (direction) => ({ zIndex: 0, x: direction < 0 ? '100%' : '-100%', opacity: 0.5 })
};

export default function TabletHome() {
  const [hora, setHora] = useState('--:--:--');
  const [clima, setClima] = useState({ temp: null, desc: '', ciudad: '', weatherCode: null });
  const [loadingClima, setLoadingClima] = useState(true);

  const [activeFolder, setActiveFolder] = useState(null);
  const [[currentPage, direction], setPage] = useState([0, 0]);

  const [bgImage, setBgImage] = useState(null);
  const [openApp, setOpenApp] = useState(null);

  const paginate = (newDirection) => {
    let next = currentPage + newDirection;
    if (next >= 2) next = 0;
    if (next < 0) next = 1;
    setPage([next, newDirection]);
  };

  useEffect(() => {
    const savedFolder = sessionStorage.getItem("currentFolder");
    if (savedFolder) setActiveFolder(savedFolder);
    const savedBg = localStorage.getItem("tabletWallpaper");
    if (savedBg) setBgImage(savedBg);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHora(new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) { setLoadingClima(false); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&accept-language=es`);
          const geoData = await geoRes.json();
          const meteoRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&current_weather=true&timezone=auto`);
          const meteoData = await meteoRes.json();
          setClima({ temp: Math.round(meteoData?.current_weather?.temperature ?? 0), desc: "Despejado", ciudad: geoData.address?.city || "Santiago", weatherCode: meteoData?.current_weather?.weathercode });
        } catch (err) { }
        setLoadingClima(false);
      }
    );
  }, []);

  const handleSelectWallpaper = (url) => {
    setBgImage(url);
    if (url) localStorage.setItem("tabletWallpaper", url);
    else localStorage.removeItem("tabletWallpaper");
    toast.success("Wallpaper actualizado", { theme: "dark", autoClose: 1000 });
  };

  const copyGmail = () => {
    navigator.clipboard.writeText("parraalex2001@gmail.com").then(() => {
      toast.success("¡Correo copiado al portapapeles!", { position: "top-center", autoClose: 2000, theme: "dark" });
    });
  };

  const handleOpenFolder = (id) => {
    setActiveFolder(id);
    sessionStorage.setItem("currentFolder", id);
  };

  // 3. APPS DEL ESCRITORIO
  const desktopPages = [
    [
      { type: 'app', id: 'github', icon: <Icon icon="logos:github-icon" width={38} color='#080808' />, name: 'GitHub', url: 'https://github.com/AlexSkyBlue' },
      { type: 'app', id: 'linkedin', icon: <Icon icon="logos:linkedin-icon" width={38} color="#0B65C3" />, name: 'LinkedIn', url: 'https://linkedin.com/in/alex-parra-salinas/' },
      { type: 'app', id: 'gmail', icon: <Icon icon="logos:google-gmail" width={38} color="#d93025" />, name: 'Gmail', isGmail: true },
      { type: 'app', id: 'web', icon: <Icon icon="logos:chrome" width={38} color="#4285F4" />, name: 'Web', url: 'https://alexskyblue.cl' },
      { type: 'folder', id: 'Games', name: 'Games' }
    ],
    [
      { type: 'app', id: 'figma', icon: <Icon icon="logos:figma" width={38} />, name: 'Figma', url: '#' },
      { type: 'app', id: 'vscode', icon: <Icon icon="logos:visual-studio-code" width={38} />, name: 'VS Code', url: '#' },
    ]
  ];

  // 4. APPS DENTRO DE CARPETAS
  const gameApps = [
    { type: 'app', id: 'neon', icon: <img src="/logo_neon_dash.png" className="w-full h-full object-cover rounded-lg" alt="Neon Dash" />, name: 'Neon Dash', url: '/Games/NeonDash' },
  ];

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-tr from-orange-300 via-purple-300 to-blue-400 overflow-hidden select-none">
      <CustomCursor />

      {/* Fondo Dinámico */}
      <div className={`absolute inset-0 w-full h-full transition-all duration-700 bg-cover bg-center ${!bgImage ? 'bg-gradient-to-tr from-orange-300 via-purple-300 to-blue-400' : ''}`} style={bgImage ? { backgroundImage: `url(${bgImage})` } : {}} />
      {bgImage && <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />}

      {/* Barra de Estado */}
      <div className="absolute top-0 left-0 w-full px-8 py-2 flex justify-between items-center text-base text-white font-semibold z-30 pointer-events-none drop-shadow-md">
        <span>{hora}</span>
        <span className="flex gap-2 items-center">100% <Icon icon="bi:battery-full" width={18} /></span>
      </div>

      {/* Carrusel Principal */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentPage} custom={direction} variants={carouselVariants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 30 }}
          drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={1} onDragEnd={(e, { offset }) => { if (offset.x < -50) paginate(1); else if (offset.x > 50) paginate(-1); }}
          className="absolute inset-0 w-full h-full flex flex-col items-center pt-24 pb-40 px-6 cursor-grab active:cursor-grabbing z-10"
        >
          {currentPage === 0 ? (
            <>
              <WeatherWidget loadingClima={loadingClima} clima={clima} hora={hora} />
              <AppGrid apps={desktopPages[0]} onOpenFolder={handleOpenFolder} onCopyGmail={copyGmail} />
            </>
          ) : (
            <>
              <SpotifyWidget />
              <AppGrid apps={desktopPages[1]} onOpenFolder={handleOpenFolder} onCopyGmail={copyGmail} />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Puntos de Paginación */}
      <div className="absolute bottom-32 w-full flex justify-center gap-3 z-30 pointer-events-none drop-shadow-md">
        {desktopPages.map((_, i) => (
          <button key={i} onClick={() => { const dir = i > currentPage ? 1 : -1; if (i !== currentPage) setPage([i, dir]); }} className={`w-2 h-2 rounded-full transition-all duration-300 pointer-events-auto ${currentPage === i ? "bg-white w-4" : "bg-white/40 hover:bg-white/60"}`} />
        ))}
      </div>

      {/* Modales: Ajustes y Calendario (SOLUCIÓN A LOS 2 ERRORES) */}
      <AnimatePresence>
        {openApp === 'settings' && (
          <SettingsApp key="app-settings" isOpen={true} onClose={() => setOpenApp(null)} currentBg={bgImage} onSelectWallpaper={handleSelectWallpaper} />
        )}
        {openApp === 'calendar' && (
          <CalendarApp key="app-calendar" isOpen={true} onClose={() => setOpenApp(null)} />
        )}
      </AnimatePresence>

      {/* Modal de Carpetas (CORRECCIÓN EXTRA PREVENTIVA) */}
      <AnimatePresence>
        {activeFolder && (
          <motion.div key="folder-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setActiveFolder(null); sessionStorage.removeItem("currentFolder"); }} className="absolute inset-0 z-50 bg-black/30 backdrop-blur-xl flex items-center justify-center p-10">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white/40 w-full max-w-xl p-10 rounded-[3rem] border border-white/20 shadow-2xl">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 ml-2">{activeFolder}</h2>
              <AppGrid apps={activeFolder === 'Games' ? gameApps : []} onOpenFolder={() => { }} onCopyGmail={() => { }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dock Inferior */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/60 rounded-3xl px-8 py-3 flex gap-6 shadow-2xl backdrop-blur-md z-40 border border-white/40">
        {dockApps.map((app) => (
          <div key={app.id} onClick={() => setOpenApp(app.id)} className="w-14 h-14 bg-white rounded-xl shadow flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
            {app.icon}
          </div>
        ))}
      </div>
    </div>
  );
}