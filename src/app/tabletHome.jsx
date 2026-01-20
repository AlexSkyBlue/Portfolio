'use client';
import { Icon } from '@iconify/react';
import { toast } from "react-toastify";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Para la animación de la carpeta

const dockApps = [
  { icon: <Icon icon="logos:apple" width={32} />, name: 'Apple', url: '#' },
  { icon: <Icon icon="solar:cloud-bold" width={32} color="#007bff" />, name: 'Weather', url: '#' },
  { icon: <Icon icon="mdi:calendar" width={32} color="#c2185b" />, name: 'Calendar', url: '#' },
];

export default function TabletHome() {
  const [hora, setHora] = useState('--:--:--');
  const [zona, setZona] = useState('');
  const [clima, setClima] = useState({ temp: null, desc: '', ciudad: '', weatherCode: null });
  const [loadingClima, setLoadingClima] = useState(true);
  const [activeFolder, setActiveFolder] = useState(null);

  useEffect(() => {
    const savedFolder = sessionStorage.getItem("currentFolder");
    if (savedFolder) {
      setActiveFolder(savedFolder);
    }
  }, []);

  // Hora y zona en tiempo real
  useEffect(() => {
    const zonaActual = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setZona(zonaActual);
    const interval = setInterval(() => {
      setHora(
        new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Ubicación + clima Open-Meteo
  useEffect(() => {
    if (!navigator.geolocation) {
      setLoadingClima(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=es`);
          const geoData = await geoRes.json();
          const ciudad = geoData.address?.city || geoData.address?.town || geoData.address?.village || geoData.address?.state || geoData.address?.county || "";

          const meteoRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`);
          const meteoData = await meteoRes.json();
          const temp = Math.round(meteoData?.current_weather?.temperature ?? 0);
          const weatherCode = meteoData?.current_weather?.weathercode ?? null;

          let desc = "Clima desconocido";
          switch (weatherCode) {
            case 0: desc = "Despejado"; break;
            case 1: case 2: case 3: desc = "Parcialmente nublado"; break;
            case 45: case 48: desc = "Neblina"; break;
            case 51: case 53: case 55: desc = "Llovizna"; break;
            case 61: case 63: case 65: desc = "Lluvia"; break;
            case 71: case 73: case 75: desc = "Nieve"; break;
            case 80: case 81: case 82: desc = "Chubascos"; break;
            default: desc = "Clima variable";
          }
          setClima({ temp, desc, ciudad, weatherCode });
        } catch (err) {
          setClima({ temp: null, desc: "No disponible", ciudad: "", weatherCode: null });
        }
        setLoadingClima(false);
      },
      (error) => {
        setLoadingClima(false);
        setClima({ temp: null, desc: "No disponible", ciudad: "", weatherCode: null });
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  }, []);

  const copyGmail = () => {
    const email = "parraalex2001@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
      toast.success("¡Correo copiado al portapapeles!", {
        position: "top-center", autoClose: 2000, theme: "dark"
      });
    });
  };

  // Tus aplicaciones originales
  const apps = [
    { icon: <Icon icon="logos:github-icon" width={38} color='#080808' />, name: 'GitHub', url: 'https://github.com/AlexSkyBlue', onClick: copyGmail },
    { icon: <Icon icon="logos:linkedin-icon" width={38} color="#0B65C3" />, name: 'LinkedIn', url: 'https://linkedin.com/in/alex-parra-salinas/' },
    { icon: <Icon icon="logos:google-gmail" width={38} color="#d93025" />, name: 'Gmail', url: 'mailto:parraalex2001@gmail.com', isGmail: true },
    { icon: <Icon icon="logos:chrome" width={38} color="#4285F4" />, name: 'Web', url: 'https://alexskyblue.cl' },
  ];

  // NUEVO: Apps exclusivas para la carpeta de Juegos
  const gameApps = [
    { icon: <img src="/logo_neon_dash.png" className="w-full h-full object-cover rounded-lg" alt="Neon Dash" />, name: 'Neon Dash', url: '/Games/NeonDash' },
    // Puedes agregar más aquí
  ];

  function getClimaIcon(weatherCode) {
    switch (weatherCode) {
      case 0: return <Icon icon="wi:day-sunny" width={38} color="#f7b801" />;
      case 1: case 2: case 3: return <Icon icon="wi:day-cloudy" width={150} color="#7ecfff" />;
      default: return <Icon icon="wi:cloud" width={38} color="#bdbdbd" />;
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-tr from-orange-300 via-purple-300 to-blue-400 flex flex-col items-center justify-top overflow-hidden">

      {/* Barra de estado (Original) */}
      <div className="absolute top-0 left-0 w-full px-8 py-2 flex justify-between items-center text-base text-white font-semibold z-20">
        <span>{hora}</span>
        <span className="flex gap-2 items-center">
          <span>100%</span>
          <Icon icon="bi:battery-full" width={18} />
        </span>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto mt-16 pb-28">

        {/* Widgets estilo iPad (Originales) */}
        <div className="flex flex-col gap-4 w-full self-center">
          <div className="bg-white/70 rounded-2xl p-8 shadow flex flex-col items-center h-min w-full">
            {loadingClima ? (
              <div className="w-full flex flex-col items-center">
                <Icon icon="wi:cloud-refresh" width={80} color="#007bff" />
                <span className="text-2xl font-semibold mt-2 text-blue-700">Detectando ubicación...</span>
              </div>
            ) : (
              <div className="w-full flex flex-row items-center">
                <div className="flex flex-col items-center text-center">
                  <span className="text-lg font-bold text-gray-700 mb-2">{clima.ciudad ? clima.ciudad + ', Chile' : 'Ubicación desconocida'}</span>
                  <div className="flex flex-row items-center">
                    <span>{getClimaIcon(clima.weatherCode)}</span>
                    <span className="text-5xl font-bold text-blue-600 ml-2">{clima.temp !== null ? `${clima.temp}°C` : '--'}</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-800 capitalize">Está {clima.desc}</span>
                </div>
                <div className="w-full flex flex-col items-center text-center">
                  <span className="text-4xl font-bold text-gray-800">Hora Actual</span>
                  <span className="text-7xl font-normal text-gray-800 mt-2">{hora}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Grid de apps (Actualizado con Carpeta) */}
        <div className="flex-1 grid grid-cols-5 gap-7 place-content-center">
          {/* Apps originales */}
          {apps.map((app, i) => (
            <a key={i} href={app.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group"
              onClick={(app.isGmail) ? (e) => { e.preventDefault(); copyGmail(); } : undefined}>
              <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                {app.icon}
              </div>
              <span className="mt-2 text-[13px] text-gray-900 drop-shadow font-medium">{app.name}</span>
            </a>
          ))}

          {/* ICONO DINÁMICO DE LA CARPETA "GAMES" */}
          <div onClick={() => {
            setActiveFolder('Games');
            sessionStorage.setItem("currentFolder", "Games");
          }} className="flex flex-col items-center cursor-pointer group active:scale-95 transition-transform">
            <div className="w-16 h-16 bg-white/40 backdrop-blur-md rounded-2xl border border-white/30 grid grid-cols-2 p-2 gap-1 shadow-lg overflow-hidden">
              {/* Previsualización mini de juegos */}
              <div className="bg-pink-500 rounded-sm scale-75"></div>
              <div className="bg-cyan-500 rounded-sm scale-75"></div>
              <div className="bg-yellow-400 rounded-sm scale-75"></div>
              <div className="bg-blue-500 rounded-sm scale-75 opacity-50"></div>
            </div>
            <span className="mt-2 text-[13px] text-gray-900 font-medium">Games</span>
          </div>
        </div>
      </div>

      {/* MODAL DE CARPETA ABIERTA */}
      <AnimatePresence>
        {activeFolder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => {
              setActiveFolder(null);
              sessionStorage.removeItem("currentFolder"); // <--- BORRAR DE MEMORIA
            }}
            className="absolute inset-0 z-50 bg-black/30 backdrop-blur-xl flex items-center justify-center p-10"
          >
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/40 w-full max-w-xl p-10 rounded-[3rem] border border-white/20 shadow-2xl"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8 ml-2">{activeFolder}</h2>
              <div className="grid grid-cols-4 gap-8">
                {gameApps.map((game, i) => (
                  <a key={i} href={game.url} className="flex flex-col items-center group">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      {game.icon}
                    </div>
                    <span className="mt-3 text-sm text-gray-900 font-semibold">{game.name}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dock (Original) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/60 rounded-2xl px-8 py-3 flex gap-6 shadow-xl backdrop-blur-md">
        {dockApps.map((app, i) => (
          <a key={i} href={app.url} className="w-12 h-12 bg-white rounded-xl shadow flex items-center justify-center hover:scale-110 transition-transform duration-200">
            {app.icon}
          </a>
        ))}
      </div>
    </div>
  );
}