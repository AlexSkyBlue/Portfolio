'use client';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

export default function CalendarApp({ isOpen, onClose }) {
    if (!isOpen) return null;

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentDate = today.getDate();

    // Obtener días del mes
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Domingo

    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: firstDayIndex }, (_, i) => i);
    const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const monthName = today.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="absolute inset-0 z-[60] bg-black/40 backdrop-blur-md flex items-center justify-center p-6"
            onClick={onClose}
        >
            <div
                className="bg-white/90 backdrop-blur-2xl w-full max-w-4xl h-[70vh] rounded-[2rem] shadow-2xl flex overflow-hidden border border-white/40"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Barra lateral */}
                <div className="w-1/3 bg-gray-50/50 border-r border-gray-200/50 p-8 flex flex-col justify-between">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-800 capitalize mb-2">{today.toLocaleDateString('es-ES', { weekday: 'long' })}</h2>
                        <h1 className="text-8xl font-black text-red-500 mb-6">{currentDate}</h1>
                        <p className="text-xl text-gray-500 font-medium">No hay eventos programados para hoy.</p>
                    </div>
                    <button onClick={onClose} className="bg-gray-200/80 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-bold transition-colors">
                        Cerrar Calendario
                    </button>
                </div>

                {/* Cuadrícula del Calendario */}
                <div className="w-2/3 p-10 flex flex-col">
                    <h2 className="text-3xl font-bold text-gray-800 capitalize mb-8">{monthName}</h2>

                    <div className="grid grid-cols-7 gap-4 mb-4">
                        {weekDays.map(day => (
                            <div key={day} className="text-center text-sm font-bold text-gray-400 uppercase">{day}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-4 flex-1">
                        {emptyDays.map(empty => <div key={`empty-${empty}`} />)}

                        {daysArray.map(day => (
                            <div
                                key={day}
                                className={`flex items-center justify-center text-xl font-semibold rounded-full aspect-square transition-all
                  ${day === currentDate ? 'bg-red-500 text-white shadow-md shadow-red-500/30' : 'text-gray-700 hover:bg-gray-100 cursor-pointer'}`}
                            >
                                {day}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}