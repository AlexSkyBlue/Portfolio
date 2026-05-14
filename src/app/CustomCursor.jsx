'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor({ settings }) {
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    const cursorX = useSpring(mouseX, { stiffness: 1000, damping: 40 });
    const cursorY = useSpring(mouseY, { stiffness: 1000, damping: 40 });
    const trailX = useSpring(mouseX, { stiffness: 150, damping: 20 });
    const trailY = useSpring(mouseY, { stiffness: 150, damping: 20 });

    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const canvasRef = useRef(null);

    const config = {
        style: settings?.style || 'outline_dot',
        color: settings?.color || '#000000',
        trailType: settings?.trailType || 'none',
    };

    // =========================================================
    // MOTOR MULTI-EFECTOS (HTML5 CANVAS A 60FPS)
    // =========================================================
    useEffect(() => {
        if (config.trailType === 'none' || config.trailType === 'classic') return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrameId;
        let hueCounter = 0; // Para el efecto arcoíris

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        // Generador de partículas según el modo
        const onMouseMoveCanvas = (e) => {
            hueCounter += 5; // Avanzar el color del arcoíris

            if (config.trailType === 'particles') {
                for (let i = 0; i < 2; i++) {
                    particles.push({
                        x: e.clientX, y: e.clientY, size: Math.random() * 4 + 1, life: 1,
                        vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3
                    });
                }
            }
            else if (config.trailType === 'fluid') {
                particles.push({
                    x: e.clientX, y: e.clientY, size: Math.random() * 15 + 15, life: 1,
                    vx: 0, vy: 0 // Fluido no se mueve mucho, solo se queda en su lugar
                });
            }
            else if (config.trailType === 'bubble') {
                if (Math.random() > 0.5) { // No tantas burbujas
                    particles.push({
                        x: e.clientX, y: e.clientY, size: Math.random() * 5 + 5, life: 1,
                        vx: (Math.random() - 0.5) * 2, vy: Math.random() * -2 - 1 // Flotan hacia arriba
                    });
                }
            }
            else if (config.trailType === 'rainbow') {
                particles.push({
                    x: e.clientX, y: e.clientY, size: Math.random() * 6 + 4, life: 1,
                    vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2,
                    color: `hsl(${hueCounter % 360}, 100%, 60%)` // Color estático de la partícula
                });
            }
            else if (config.trailType === 'snowflake') {
                if (Math.random() > 0.4) {
                    particles.push({
                        x: e.clientX, y: e.clientY, size: Math.random() * 3 + 1, life: 1,
                        vx: (Math.random() - 0.5) * 1, vy: Math.random() * 2 + 1, // Caen con gravedad
                        angle: Math.random() * 360
                    });
                }
            }
        };

        // Generador de "Ripples" (Ondas al hacer clic)
        const onMouseClickCanvas = (e) => {
            if (config.trailType === 'ripple') {
                particles.push({ x: e.clientX, y: e.clientY, size: 5, life: 1, vx: 0, vy: 0, isRipple: true });
            }
        };

        window.addEventListener('mousemove', onMouseMoveCanvas);
        window.addEventListener('mousedown', onMouseClickCanvas);

        // Bucle de Físicas y Renderizado
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                let p = particles[i];

                // Físicas base
                p.x += p.vx;
                p.y += p.vy;

                // Físicas especiales por modo
                if (config.trailType === 'snowflake') {
                    p.angle += 0.1;
                    p.x += Math.sin(p.angle) * 0.5; // Balanceo de nieve
                    p.life -= 0.01;
                } else if (config.trailType === 'fluid') {
                    p.life -= 0.02;
                    p.size += 0.5; // Expansión fluida
                } else if (config.trailType === 'bubble') {
                    p.life -= 0.015;
                    p.size += 0.2; // Las burbujas crecen al subir
                } else if (p.isRipple) {
                    p.life -= 0.02;
                    p.size += 3; // Onda rápida
                } else {
                    p.life -= 0.03; // Partículas normales
                }

                if (p.life <= 0) {
                    particles.splice(i, 1);
                    i--;
                    continue;
                }

                // DIBUJADO
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

                const alpha = Math.max(0, p.life).toFixed(2);

                if (config.trailType === 'bubble' || p.isRipple) {
                    // Solo borde para burbujas y ondas
                    ctx.strokeStyle = p.color ? p.color.replace(')', `, ${alpha})`).replace('hsl', 'hsla') : `rgba(${hexToRgb(config.color)}, ${alpha})`;
                    ctx.lineWidth = p.isRipple ? 3 : 1.5;
                    ctx.stroke();
                } else {
                    // Relleno sólido
                    ctx.fillStyle = p.color ? p.color.replace(')', `, ${alpha})`).replace('hsl', 'hsla') : `rgba(${hexToRgb(config.color)}, ${alpha})`;
                    ctx.fill();
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMoveCanvas);
            window.removeEventListener('mousedown', onMouseClickCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [config.trailType, config.color]);

    // Utilidad para convertir Hex a RGB para el Canvas
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0,0,0';
    }

    // =========================================================
    // EVENTOS DEL PUNTERO PRINCIPAL
    // =========================================================
    useEffect(() => {
        const clickSound = new Audio('https://www.soundjay.com/buttons/sounds/button-30.mp3');
        clickSound.volume = 0.3;

        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            const target = e.target;
            setIsHovering(!!(target.closest('button') || target.closest('a') || target.closest('.cursor-pointer')));
        };

        const handleMouseDown = () => {
            setIsClicking(true);
            clickSound.cloneNode().play().catch(() => { });
        };
        const handleMouseUp = () => setIsClicking(false);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [mouseX, mouseY]);

    return (
        <>
            {config.trailType !== 'none' && config.trailType !== 'classic' && (
                <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9997]"
                    style={{ filter: config.trailType === 'fluid' ? 'blur(8px)' : 'none' }}
                />
            )}

            {config.trailType === 'classic' && (
                <motion.div
                    className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-difference rounded-full opacity-50"
                    style={{ x: trailX, y: trailY, translateX: '-50%', translateY: '-50%', backgroundColor: config.color, width: 24, height: 24 }}
                />
            )}

            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center"
                style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%', width: 40, height: 40 }}
                animate={{ scale: isClicking ? 0.7 : isHovering ? 1.5 : 1 }}
                transition={{ scale: { type: 'spring', stiffness: 400, damping: 25 } }}
            >
                {config.style === 'outline_dot' && (
                    <div className="w-full h-full rounded-full border-2 flex items-center justify-center transition-colors" style={{ borderColor: config.color }}>
                        <motion.div className="w-1.5 h-1.5 rounded-full transition-colors" style={{ backgroundColor: config.color }} animate={{ opacity: isHovering ? 0 : 1 }} />
                    </div>
                )}
                {config.style === 'solid_ring' && (
                    <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors" style={{ borderColor: config.color }}>
                        <div className="w-full h-full rounded-full transition-colors" style={{ backgroundColor: config.color }} />
                    </div>
                )}
                {config.style === 'minimal_dot' && (
                    <div className="w-3 h-3 rounded-full transition-colors" style={{ backgroundColor: config.color }} />
                )}
                {config.style === 'crosshair_plus' && (
                    <div className="relative w-8 h-8">
                        <div className="absolute top-1/2 left-0 w-full h-[2px] -translate-y-1/2 transition-colors" style={{ backgroundColor: config.color }} />
                        <div className="absolute top-0 left-1/2 w-[2px] h-full -translate-x-1/2 transition-colors" style={{ backgroundColor: config.color }} />
                        <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors" style={{ backgroundColor: config.color }} />
                    </div>
                )}
            </motion.div>
        </>
    );
}