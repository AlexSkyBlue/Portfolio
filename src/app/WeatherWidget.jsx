import { Icon } from '@iconify/react';

export default function WeatherWidget({ loadingClima, clima, hora }) {
    // Movimos la función del icono del clima aquí adentro
    function getClimaIcon(weatherCode) {
        switch (weatherCode) {
            case 0: return <Icon icon="wi:day-sunny" width={38} color="#f7b801" />;
            case 1: case 2: case 3: return <Icon icon="wi:day-cloudy" width={150} color="#7ecfff" />;
            default: return <Icon icon="wi:cloud" width={38} color="#bdbdbd" />;
        }
    }

    return (
        <div className="bg-white/70 rounded-2xl px-8 py-4 shadow flex flex-col items-center w-full max-w-4xl mb-10">
            {loadingClima ? (
                <div className="w-full flex flex-col items-center">
                    <Icon icon="wi:cloud-refresh" width={80} color="#007bff" />
                    <span className="text-2xl font-semibold mt-2 text-blue-700">Detectando ubicación...</span>
                </div>
            ) : (
                <div className="w-full flex flex-row items-center">
                    <div className="flex flex-col items-center text-center w-1/2">
                        <span className="text-lg font-bold text-gray-700 mb-2">
                            {clima.ciudad ? clima.ciudad + ', Chile' : 'Ubicación desconocida'}
                        </span>
                        <div className="flex flex-row items-center">
                            <span>{getClimaIcon(clima.weatherCode)}</span>
                            <span className="text-5xl font-bold text-blue-600 ml-2">
                                {clima.temp !== null ? `${clima.temp}°C` : '--'}
                            </span>
                        </div>
                        <span className="text-2xl font-bold text-blue-800 capitalize">Está {clima.desc}</span>
                    </div>
                    <div className="w-full flex flex-col items-center text-center w-1/2">
                        <span className="text-4xl font-bold text-gray-800">Hora Actual</span>
                        <span className="text-7xl font-normal text-gray-800 mt-2">{hora}</span>
                    </div>
                </div>
            )}
        </div>
    );
}