'use client';
import { Icon } from '@iconify/react';
import { toast } from "react-toastify";
import { useEffect, useState } from 'react';

const dockApps = [
  { icon: <Icon icon="logos:apple" width={32} />, name: 'Apple', url: '#' },
  { icon: <Icon icon="solar:cloud-bold" width={32} color="#007bff" />, name: 'Weather', url: '#' },
  { icon: <Icon icon="mdi:calendar" width={32} color="#c2185b" />, name: 'Calendar', url: '#' },
];

export default function TabletHome() {
  const [hora, setHora] = useState('--:--:--');
  const [zona, setZona] = useState('');
  const [clima, setClima] = useState({ temp: null, desc: '', ciudad: '' });
  const [loadingClima, setLoadingClima] = useState(true);

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

  // Ubicación + clima Open-Meteo (gratis)
  useEffect(() => {
    if (!navigator.geolocation) {
      setLoadingClima(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        // Ciudad
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=es`);
        const geoData = await geoRes.json();
        const ciudad = geoData?.results?.[0]?.name || "Tu zona";

        // Clima
        const meteoRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`);
        const meteoData = await meteoRes.json();
        const temp = Math.round(meteoData?.current_weather?.temperature ?? 0);

        let desc = "Clima desconocido";
        switch(meteoData?.current_weather?.weathercode) {
          case 0: desc = "Despejado"; break;
          case 1: case 2: case 3: desc = "Parcialmente nublado"; break;
          case 45: case 48: desc = "Neblina"; break;
          case 51: case 53: case 55: desc = "Llovizna"; break;
          case 61: case 63: case 65: desc = "Lluvia"; break;
          case 71: case 73: case 75: desc = "Nieve"; break;
          case 80: case 81: case 82: desc = "Chubascos"; break;
          default: desc = "Clima variable";
        }
        setClima({ temp, desc, ciudad });
      } catch {
        setClima({ temp: null, desc: "No disponible", ciudad: "" });
      }
      setLoadingClima(false);
    }, () => setLoadingClima(false), { enableHighAccuracy: true });
  }, []);

  // Copia mail
    const copyGmail = () => {
        const email = "parraalex2001@gmail.com";
        navigator.clipboard.writeText(email).then(() => {
            toast.success("¡Correo copiado al portapapeles!", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                theme: "dark"
            });
        });
    };

    const apps = [
        { icon: <Icon icon="logos:github-icon" width={38} color='#080808'/>, name: 'GitHub', url: 'https://github.com/AlexSkyBlue', onClick: copyGmail },
        { icon: <Icon icon="logos:linkedin-icon" width={38} color="#0B65C3" />, name: 'LinkedIn', url: 'https://linkedin.com/in/alex-parra-salinas/' },
        { icon: <Icon icon="logos:google-gmail" width={38} color="#d93025" />, name: 'Gmail', url: 'mailto:parraalex2001@gmail.com', isGmail: true },
        { icon: <Icon icon="logos:chrome" width={38} color="#4285F4" />, name: 'Web', url: 'https://alexskyblue.cl' },
    ];

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-tr from-orange-300 via-purple-300 to-blue-400 flex flex-col items-center justify-center overflow-hidden">

      {/* Barra de estado */}
      <div className="absolute top-0 left-0 w-full px-8 py-2 flex justify-between items-center text-base text-white font-semibold z-20">
        <span>{hora}</span>
        <span className="flex gap-2 items-center">
          <span>100%</span>
          <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <rect x="1" y="6" width="18" height="12" rx="3" fill="currentColor" />
            <rect x="19" y="10" width="2.5" height="4" rx="1" fill="currentColor" />
          </svg>
        </span>
      </div>

      <div className="flex flex-row gap-6 w-full max-w-6xl mx-auto mt-16 pb-28">

        {/* Widgets estilo iPad */}
        <div className="flex flex-col gap-4 w-72">
          {/* Widget hora + clima */}
          <div className="bg-white/70 rounded-2xl p-4 shadow flex flex-col items-start min-h-[110px]">
            <span className="text-lg font-bold text-blue-800 flex items-center gap-2">
                <Icon icon="wi:cloud-refresh" width={38} color="#007bff" /> {clima.ciudad || "Detectando..."}
            </span>

            <span className="text-3xl font-bold text-blue-500 tracking-wide">{hora}</span>
            <span className="text-xs text-gray-700">Zona: {zona || "Desconocida"}</span>
            {loadingClima ? (
              <span className="text-sm text-gray-600">Cargando clima...</span>
            ) : clima.temp !== null ? (
              <span className="text-sm text-blue-900">{clima.temp}°C - {clima.desc}</span>
            ) : (
              <span className="text-sm text-red-700">Clima no disponible</span>
            )}
          </div>
          {/* Widget calendario */}
          <div className="bg-white/80 rounded-2xl p-4 shadow flex flex-col items-start">
            <span className="text-sm text-gray-600 font-semibold">
              {new Date().toLocaleDateString('es-CL', { weekday: 'long', day: '2-digit', month: 'short' })}
            </span>
            <span className="text-xl font-bold text-pink-500">No hay eventos hoy</span>
          </div>
          {/* Widget noticias */}
          <div className="bg-white/70 rounded-2xl p-3 shadow flex flex-col items-start">
            <span className="text-xs font-bold text-red-500 mb-1">Noticias</span>
            <span className="text-xs text-gray-800">• React 19 lanza nueva feature para SSR.</span>
            <span className="text-xs text-gray-800">• ¡Chile gana la copa de...!</span>
          </div>
        </div>

        {/* Grid de apps */}
        <div className="flex-1 grid grid-cols-5 gap-7 place-content-center">
          {apps.map((app, i) => (
            <a
              key={i}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center group"
              {...(app.isGmail && {
                onClick: (e) => {
                  e.preventDefault();
                  copyGmail();
                }
              })}
            >
              <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                {app.icon}
              </div>
              <span className="mt-2 text-[13px] text-gray-900 drop-shadow font-medium">{app.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Dock estilo iPad */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/60 rounded-2xl px-8 py-3 flex gap-6 shadow-xl backdrop-blur-md">
        {dockApps.map((app, i) => (
          <a
            key={i}
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center group"
          >
            <div className="w-12 h-12 bg-white rounded-xl shadow flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              {app.icon}
            </div>
          </a>
        ))}
      </div>

      {/* Puntos de páginas (pager dots) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-gray-700 opacity-70" />
        <div className="w-2 h-2 rounded-full bg-white/80" />
        <div className="w-2 h-2 rounded-full bg-gray-700 opacity-70" />
      </div>
    </div>
  );
}
