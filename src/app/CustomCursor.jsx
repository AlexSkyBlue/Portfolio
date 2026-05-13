'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor({ settings }) {
    // =========================================================
    // 1. MOTOR CURSIFY (0 LAG) USANDO USEMOTIONVALUE
    // =========================================================
    // En lugar de useState, usamos useMotionValue que actualiza el DOM directamente a 60+ FPS
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Creamos "resortes" (springs) para que el cursor y la estela sigan el ratón suavemente
    const cursorX = useSpring(mouseX, { stiffness: 1000, damping: 40 });
    const cursorY = useSpring(mouseY, { stiffness: 1000, damping: 40 });

    // La estela clásica es un resorte más "flojo" para que se quede atrás
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
    // 2. DETECCIÓN DE EVENTOS DEL RATÓN
    // =========================================================
    useEffect(() => {
        const clickSound = new Audio('https://www.soundjay.com/buttons/sounds/button-30.mp3');
        clickSound.volume = 0.3;

        const handleMouseMove = (e) => {
            // Actualizamos los MotionValues directamente (¡Esto evita el lag!)
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);

            const target = e.target;
            if (target.closest('button') || target.closest('a') || target.closest('.cursor-pointer')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
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

    // =========================================================
    // 3. MOTOR DE PARTÍCULAS CANVAS (Estilo "Fluid Cursor" de Cursify)
    // =========================================================
    useEffect(() => {
        if (config.trailType !== 'particles') return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrameId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        const onMouseMoveCanvas = (e) => {
            // Genera 3 partículas por cada movimiento ligero del ratón
            for (let i = 0; i < 3; i++) {
                particles.push({
                    x: e.clientX,
                    y: e.clientY,
                    size: Math.random() * 4 + 1, // Tamaño aleatorio
                    life: 1, // Opacidad
                    vx: (Math.random() - 0.5) * 4, // Dispersión en X
                    vy: (Math.random() - 0.5) * 4  // Dispersión en Y
                });
            }
        };
        window.addEventListener('mousemove', onMouseMoveCanvas);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                let p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.02; // Velocidad con la que se desvanecen

                if (p.life <= 0) {
                    particles.splice(i, 1);
                    i--;
                    continue;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

                // Transforma el "life" en opacidad Hexadecimal
                const alpha = Math.max(0, Math.floor(p.life * 255)).toString(16).padStart(2, '0');
                ctx.fillStyle = `${config.color}${alpha}`;
                ctx.fill();
            }
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMoveCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [config.trailType, config.color]);

    return (
        <>
            {/* 1. RASTRO DE PARTÍCULAS (Canvas) */}
            {config.trailType === 'particles' && (
                <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9997]" />
            )}

            {/* 2. ESTELA CLÁSICA (Framer Motion Values) */}
            {config.trailType === 'classic' && (
                <motion.div
                    className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-difference rounded-full opacity-50"
                    style={{
                        x: trailX,
                        y: trailY,
                        translateX: '-50%',
                        translateY: '-50%',
                        backgroundColor: config.color,
                        width: 24,
                        height: 24
                    }}
                />
            )}

            {/* 3. PUNTERO PRINCIPAL (Framer Motion Values) */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                    width: 40,
                    height: 40
                }}
                animate={{
                    scale: isClicking ? 0.7 : isHovering ? 1.5 : 1,
                }}
                transition={{ scale: { type: 'spring', stiffness: 400, damping: 25 } }}
            >
                {/* DISEÑOS DEL CURSOR */}
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