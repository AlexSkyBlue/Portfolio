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
  const [clima, setClima] = useState({ temp: null, desc: '', ciudad: '', weatherCode: null });

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

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          // === Obtener ciudad ===
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=es`
          );
          const geoData = await geoRes.json();
          const ciudad = geoData.address?.city || geoData.address?.town || geoData.address?.village || geoData.address?.state || geoData.address?.county || "";

          // === Obtener clima actual ===
          const meteoRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`
          );
          const meteoData = await meteoRes.json();
          const temp = Math.round(meteoData?.current_weather?.temperature ?? 0);
          const weatherCode = meteoData?.current_weather?.weathercode ?? null;

          let desc = "Clima desconocido";
          switch (weatherCode) {
            case 0: desc = "Despejado"; break;
            case 1:
            case 2:
            case 3: desc = "Parcialmente nublado"; break;
            case 45:
            case 48: desc = "Neblina"; break;
            case 51:
            case 53:
            case 55: desc = "Llovizna"; break;
            case 61:
            case 63:
            case 65: desc = "Lluvia"; break;
            case 71:
            case 73:
            case 75: desc = "Nieve"; break;
            case 80:
            case 81:
            case 82: desc = "Chubascos"; break;
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
        console.error('Error en geolocalización:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0,
      }
    );
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

  function getClimaIcon(weatherCode) {
    switch (weatherCode) {
      case 0: return <Icon icon="wi:day-sunny" width={38} color="#f7b801" />; // Despejado
      case 1:
      case 2:
      case 3: return <Icon icon="wi:day-cloudy" width={150} color="#7ecfff" />; // Parcialmente nublado
      case 45:
      case 48: return <Icon icon="wi:fog" width={38} color="#bdbdbd" />; // Neblina
      case 51:
      case 53:
      case 55: return <Icon icon="wi:sprinkle" width={38} color="#76bfff" />; // Llovizna
      case 61:
      case 63:
      case 65: return <Icon icon="wi:rain" width={38} color="#539edb" />; // Lluvia
      case 71:
      case 73:
      case 75: return <Icon icon="wi:snow" width={38} color="#b3e5fc" />; // Nieve
      case 80:
      case 81:
      case 82: return <Icon icon="wi:showers" width={38} color="#65a4e0" />; // Chubascos
      default: return <Icon icon="wi:cloud" width={38} color="#bdbdbd" />;
    }
  }


  return (
    <div className="relative min-h-screen w-full bg-gradient-to-tr from-orange-300 via-purple-300 to-blue-400 flex flex-col items-center justify-top overflow-hidden">

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

      <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto mt-16 pb-28">

        {/* Widgets estilo iPad */}
        <div className="flex flex-col gap-4 w-full self-center">
          {/* Widget hora + clima */}
          <div className="bg-white/70 rounded-2xl p-8 shadow flex flex-col items-center h-min w-full">
            {loadingClima ? (
              <div className="w-full flex flex-col items-center">
                <Icon icon="wi:cloud-refresh" width={80} color="#007bff" />
                <span className="text-2xl font-semibold mt-2 text-blue-700">Detectando ubicación...</span>
              </div>
            ) : (
              <div className="w-full flex flex-row items-center">
                <div className="flex flex-col items-center text-center">
                  <span className="text-lg font-bold text-gray-700 mb-2">
                    {clima.ciudad ? clima.ciudad + ', Chile' : 'Ubicación desconocida'}
                  </span>
                  <div className="flex flex-row items-center">
                    <span className="">{getClimaIcon(clima.weatherCode, 120)}</span>
                    <span className="text-5xl font-bold text-blue-600">
                      {clima.temp !== null ? `${clima.temp}°C` : '--'}
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-blue-800 whitespace-nowrap">
                    Está <span className="capitalize">{clima.desc}</span>
                  </span>
                </div>
                
                <div className="w-full flex flex-col items-center text-center">
                  <span className="text-4xl text-right font-bold text-gray-800">Hora Actual</span>
                  <span className="text-7xl text-right font-normal text-gray-800 mt-2">{hora}</span>
                </div>
              </div>
            )}
          </div>


          {/* Widget calendario */}
          {/* <div className="bg-white/80 rounded-2xl p-4 shadow flex flex-col items-start">
            <span className="text-sm text-gray-600 font-semibold">
              {new Date().toLocaleDateString('es-CL', { weekday: 'long', day: '2-digit', month: 'short' })}
            </span>
            <span className="text-xl font-bold text-pink-500">No hay eventos hoy</span>
          </div> */}
          {/* Widget noticias */}
          {/* <div className="bg-white/70 rounded-2xl p-3 shadow flex flex-col items-start">
            <span className="text-xs font-bold text-red-500 mb-1">Noticias</span>
            <span className="text-xs text-gray-800">• React 19 lanza nueva feature para SSR.</span>
            <span className="text-xs text-gray-800">• ¡Chile gana la copa de...!</span>
          </div> */}
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
