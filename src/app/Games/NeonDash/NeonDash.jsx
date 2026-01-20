'use client';
import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

const NeonDash = () => {
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        let gameSpeed = 7;
        let frameCount = 0;
        let gravityDir = 1;
        let currentMode = 'cube';
        let isHolding = false; // Nueva variable para saber si mantienes presionado

        const player = {
            x: 150,
            y: canvas.height / 2,
            size: 40,
            color: "#ff00ff",
            dy: 0,
            jumpForce: 14,
            gravity: 0.8,
            grounded: false,
            rotation: 0
        };

        let worldObjects = [];
        let particles = [];

        const createParticles = (x, y, color) => {
            for (let i = 0; i < 8; i++) {
                particles.push({
                    x, y,
                    dx: (Math.random() - 0.5) * 10,
                    dy: (Math.random() - 0.5) * 10,
                    life: 1.0, color
                });
            }
        };

        // Esta función solo se activa UNA VEZ cuando presionas la tecla (para saltar con el cubo)
        const handleJumpStart = () => {
            if (gameOver) return;

            const nearOrb = worldObjects.find(obj =>
                obj.type === 'jump_orb' &&
                Math.hypot(player.x - obj.x, player.y - obj.y) < 80
            );

            if (nearOrb) {
                player.dy = -player.jumpForce * 1.3 * gravityDir;
                createParticles(nearOrb.x, nearOrb.y, '#ffff00');
                return;
            }

            if (currentMode === 'cube' && player.grounded) {
                player.dy = -player.jumpForce * gravityDir;
                player.grounded = false;
            }
        };

        // Event Listeners corregidos para detectar "Mantener Presionado"
        const onKeyDown = (e) => {
            if (e.code === 'Space') {
                if (gameOver) {
                    window.location.reload();
                    return;
                }
                if (!isHolding) handleJumpStart(); // Solo salta si es el inicio de la pulsación
                isHolding = true;
            }
        };
        const onKeyUp = (e) => { if (e.code === 'Space') isHolding = false; };

        const onMouseDown = () => {
            if (gameOver) return;
            if (!isHolding) handleJumpStart();
            isHolding = true;
        };
        const onMouseUp = () => isHolding = false;
        // Si el mouse sale de la ventana, dejamos de "presionar"
        const onMouseLeave = () => isHolding = false;

        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        canvas.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        canvas.addEventListener('mouseleave', onMouseLeave);

        const spawnObject = () => {
            frameCount++;
            const currentGround = canvas.height - 100;
            const currentCeiling = 100;

            const isInverted = gravityDir === -1;
            const spawnBaseY = isInverted ? currentCeiling : currentGround;

            if (frameCount % 60 === 0) {
                const rand = Math.random();
                const xPos = canvas.width + 100;

                if (rand < 0.3) {
                    const platY = isInverted ? spawnBaseY + 150 : spawnBaseY - 180;
                    const orbY = isInverted ? spawnBaseY + 50 : spawnBaseY - 80;

                    worldObjects.push({ type: 'platform', x: xPos, y: platY, w: 350, h: 30, color: '#00ccff' });
                    worldObjects.push({ type: 'jump_orb', x: xPos - 200, y: orbY, color: '#ffff00' });
                }
                else if (rand < 0.5) {
                    const type = Math.random() > 0.5 ? 'portal_grav' : 'portal_ship';
                    const portalY = isInverted ? spawnBaseY + 40 : spawnBaseY - 190;
                    worldObjects.push({ type, x: xPos, y: portalY, w: 40, h: 150, color: type === 'portal_grav' ? '#ffff00' : '#00ff44' });
                }
                else if (rand < 0.8) {
                    const spikeY = isInverted ? spawnBaseY : spawnBaseY - 40;
                    worldObjects.push({ type: 'spike', x: xPos, y: spikeY, w: 40, h: 40, color: '#ff4444', flipped: isInverted });
                }
                else {
                    const sawY = isInverted ? spawnBaseY + 80 : spawnBaseY - 80;
                    worldObjects.push({ type: 'saw', x: xPos, y: sawY, r: 25, color: '#ffffff' });
                }
            }
        };

        const update = () => {
            const currentGround = canvas.height - 100;
            const currentCeiling = 100;

            // 1. Aplicar Gravedad Base
            player.dy += player.gravity * gravityDir;

            // 2. LÓGICA DE NAVE (Modo Avión)
            if (currentMode === 'ship') {
                if (isHolding) {
                    // Si mantienes presionado, aplicamos fuerza contraria a la gravedad
                    // Ajusta el 1.5 si quieres que suba más rápido o más lento
                    player.dy -= 1.6 * gravityDir;
                }

                // Limitar velocidad terminal de la nave para que no sea incontrolable
                const maxShipSpeed = 10;
                if (player.dy > maxShipSpeed) player.dy = maxShipSpeed;
                if (player.dy < -maxShipSpeed) player.dy = -maxShipSpeed;
            }

            player.y += player.dy;
            player.grounded = false;

            // Colisiones Suelo/Techo
            if (player.y > currentGround - player.size) {
                player.y = currentGround - player.size;
                player.dy = 0;
                player.grounded = true;
                if (gravityDir === -1) setGameOver(true);
            }
            if (player.y < currentCeiling) {
                player.y = currentCeiling;
                player.dy = 0;
                player.grounded = true;
                if (gravityDir === 1) setGameOver(true);
            }

            if (!player.grounded && currentMode === 'cube') player.rotation += 0.15 * gravityDir;
            else if (currentMode === 'ship') {
                // Rotar la nave suavemente según su velocidad vertical
                player.rotation = player.dy * 0.1;
            } else {
                player.rotation = 0;
            }

            worldObjects.forEach((obj, index) => {
                obj.x -= gameSpeed;

                if (obj.type === 'platform') {
                    if (player.x < obj.x + obj.w && player.x + player.size > obj.x &&
                        player.y < obj.y + obj.h && player.y + player.size > obj.y) {

                        const buffer = 20;
                        if (gravityDir === 1 && player.dy >= 0 && player.y + player.size <= obj.y + buffer) {
                            player.y = obj.y - player.size;
                            player.dy = 0;
                            player.grounded = true;
                        }
                        else if (gravityDir === -1 && player.dy <= 0 && player.y >= obj.y + obj.h - buffer) {
                            player.y = obj.y + obj.h;
                            player.dy = 0;
                            player.grounded = true;
                        }
                        else {
                            setGameOver(true);
                        }
                    }
                }
                else if (obj.type === 'spike' || obj.type === 'saw') {
                    const dist = Math.hypot(player.x + 20 - obj.x, player.y + 20 - obj.y);
                    if (dist < 30) setGameOver(true);
                }
                else if (obj.type.startsWith('portal') && player.x < obj.x + obj.w && player.x + player.size > obj.x && player.y < obj.y + obj.h && player.y + player.size > obj.y) {
                    if (obj.type === 'portal_grav') gravityDir *= -1;
                    if (obj.type === 'portal_ship') {
                        currentMode = currentMode === 'cube' ? 'ship' : 'cube';
                        // Resetear rotación al cambiar
                        player.rotation = 0;
                    }
                    worldObjects.splice(index, 1);
                    createParticles(player.x, player.y, obj.color);
                }

                if (obj.x < -200) {
                    worldObjects.splice(index, 1);
                    setScore(s => s + 1);
                }
            });

            particles.forEach((p, i) => {
                p.x += p.dx; p.y += p.dy; p.life -= 0.02;
                if (p.life <= 0) particles.splice(i, 1);
            });

            gameSpeed += 0.001;
        };

        const draw = () => {
            const currentGround = canvas.height - 100;
            const currentCeiling = 100;

            ctx.fillStyle = '#050508';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Grid
            ctx.strokeStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            for (let i = 0; i < canvas.width; i += 50) {
                ctx.beginPath();
                ctx.moveTo(i - (frameCount * 2 % 50), currentCeiling);
                ctx.lineTo(i - (frameCount * 2 % 50), currentGround);
                ctx.stroke();
            }

            // Líneas Neón
            ctx.strokeStyle = '#00f2ff';
            ctx.lineWidth = 4;
            ctx.shadowBlur = 10; ctx.shadowColor = '#00f2ff';
            ctx.beginPath(); ctx.moveTo(0, currentGround); ctx.lineTo(canvas.width, currentGround); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, currentCeiling); ctx.lineTo(canvas.width, currentCeiling); ctx.stroke();
            ctx.shadowBlur = 0;

            worldObjects.forEach(obj => {
                ctx.shadowBlur = 15; ctx.shadowColor = obj.color;
                ctx.fillStyle = obj.color;
                if (obj.type === 'platform') ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
                if (obj.type === 'jump_orb') {
                    ctx.beginPath(); ctx.arc(obj.x, obj.y, 15, 0, Math.PI * 2); ctx.fill();
                }
                if (obj.type === 'saw') {
                    ctx.save(); ctx.translate(obj.x, obj.y); ctx.rotate(frameCount * 0.2);
                    ctx.beginPath(); for (let i = 0; i < 8; i++) {
                        ctx.lineTo(Math.cos(i * Math.PI / 4) * obj.r, Math.sin(i * Math.PI / 4) * obj.r);
                        ctx.lineTo(Math.cos(i * Math.PI / 4 + 0.2) * obj.r * 1.5, Math.sin(i * Math.PI / 4 + 0.2) * obj.r * 1.5);
                    } ctx.fill(); ctx.restore();
                }
                if (obj.type === 'spike') {
                    ctx.beginPath();
                    if (obj.flipped) {
                        ctx.moveTo(obj.x, obj.y); ctx.lineTo(obj.x + obj.w / 2, obj.y + obj.h); ctx.lineTo(obj.x + obj.w, obj.y);
                    } else {
                        ctx.moveTo(obj.x, obj.y + obj.h); ctx.lineTo(obj.x + obj.w / 2, obj.y); ctx.lineTo(obj.x + obj.w, obj.y + obj.h);
                    }
                    ctx.fill();
                }
                if (obj.type.startsWith('portal')) {
                    ctx.globalAlpha = 0.6; ctx.fillRect(obj.x, obj.y, obj.w, obj.h); ctx.globalAlpha = 1.0;
                    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);
                }
            });

            particles.forEach(p => {
                ctx.globalAlpha = p.life; ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, 4, 4);
            });
            ctx.globalAlpha = 1;

            ctx.save();
            ctx.translate(player.x + player.size / 2, player.y + player.size / 2);
            ctx.rotate(player.rotation);
            ctx.shadowBlur = 20; ctx.shadowColor = player.color;
            ctx.fillStyle = player.color;
            if (currentMode === 'ship') {
                ctx.scale(1, gravityDir);
                // Dibujo de nave mejorado
                ctx.beginPath();
                ctx.moveTo(-15, -10);
                ctx.lineTo(25, 0);
                ctx.lineTo(-15, 10);
                ctx.lineTo(-5, 0); // Cola
                ctx.fill();
            } else {
                ctx.fillRect(-20, -20, 40, 40);
                // Ojos del cubo para darle dirección
                ctx.fillStyle = 'white';
                ctx.fillRect(5, -10, 8, 8);
                ctx.fillRect(15, -10, 4, 8);
            }
            ctx.restore();

            if (!gameOver) {
                update(); spawnObject();
                animationFrameId = requestAnimationFrame(draw);
            }
        };

        draw();
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
            canvas.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            canvas.removeEventListener('mouseleave', onMouseLeave);
        };
    }, [gameOver]);

    return (
        <div className="fixed inset-0 bg-black overflow-hidden cursor-crosshair select-none">
            <Link
                href="/"
                className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-bold hover:bg-white/20 hover:scale-105 transition-all group"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:text-cyan-400 transition-colors">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                <span className="text-sm font-mono group-hover:text-cyan-400 transition-colors">EXIT OS</span>
            </Link>
            <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-10">
                <h1 className="text-6xl font-black text-white italic tracking-tighter opacity-20">NEON DASH</h1>
                <p className="text-cyan-400 font-mono text-4xl font-bold mt-2">SCORE: {score * 10}</p>
            </div>

            <canvas ref={canvasRef} className="block w-full h-full" />

            {gameOver && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl z-50">
                    <h2 className="text-8xl font-black text-white mb-4 animate-bounce">HAS MUERTO</h2>
                    <p className="text-fuchsia-500 text-2xl font-bold mb-8">PUNTUACIÓN FINAL: {score * 10}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-12 py-4 bg-cyan-500 text-black font-black text-2xl rounded-full hover:scale-110 transition-transform shadow-[0_0_30px_rgba(0,255,255,0.5)] cursor-pointer"
                    >
                        REINTENTAR
                    </button>
                </div>
            )}

            <div className="absolute bottom-4 left-4 text-white/30 text-xs font-mono pointer-events-none z-10">
                [SPACE / MANTENER CLICK] SALTAR O VOLAR
            </div>
        </div>
    );
};

export default NeonDash;