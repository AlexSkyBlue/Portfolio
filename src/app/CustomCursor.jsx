'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);

    useEffect(() => {
        // Sonido de clic (Efecto UI tech/moderno). 
        // Puedes cambiar esta URL por un archivo local en tu carpeta /public (ej: '/click.mp3')
        const clickSound = new Audio('https://www.soundjay.com/buttons/sounds/button-30.mp3');
        clickSound.volume = 0.3;

        const updateMousePosition = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });

            // Detectar si estamos sobre un enlace, botón o algo con cursor-pointer
            const target = e.target;
            if (target.closest('button') || target.closest('a') || target.closest('.cursor-pointer')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        const handleMouseDown = () => {
            setIsClicking(true);
            // Clonamos el nodo para que si haces clics muy rápidos, el sonido no se corte
            clickSound.cloneNode().play().catch(() => { });
        };

        const handleMouseUp = () => setIsClicking(false);

        window.addEventListener('mousemove', updateMousePosition);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 w-10 h-10 rounded-full border-2 border-white pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center"
            animate={{
                x: mousePosition.x - 20, // -20 para centrar exactamente el círculo de 40px
                y: mousePosition.y - 20,
                scale: isClicking ? 0.6 : isHovering ? 1.5 : 1,
                backgroundColor: isClicking ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0)",
            }}
            transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
        >
            {/* Puntito central que desaparece al hacer hover */}
            <motion.div
                className="w-1.5 h-1.5 bg-white rounded-full"
                animate={{ opacity: isHovering ? 0 : 1 }}
            />
        </motion.div>
    );
}