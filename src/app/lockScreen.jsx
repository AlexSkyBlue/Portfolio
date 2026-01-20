"use client";
import { useRef } from "react";
import { toast } from "react-toastify";
import { motion, useMotionValue, useAnimation } from "framer-motion";
import Hyperspeed from '@/reactbits/Backgrounds/Hyperspeed/Hyperspeed';
import BlurText from "@/reactbits/TextAnimations/BlurText/BlurText";
import { Icon } from "@iconify/react";

export default function LockScreen({ onUnlock }) {
  const unlocking = useRef(false);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const dragThreshold = 120; // Menos distancia para hacerlo cómodo

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

  // Se desbloquea si arrastras suficiente en cualquier dirección
  const handleUnlock = async (_, info) => {
    if (unlocking.current) return;
    const delta = Math.sqrt(info.offset.x ** 2 + info.offset.y ** 2);
    if (delta > dragThreshold) {
      unlocking.current = true;
      await controls.start({
        opacity: 0,
        scale: 1.07,
        transition: { duration: 0.22, ease: [0.36, 0.66, 0.04, 1] }
      });
      onUnlock();
    } else {
      controls.start({ x: 0, y: 0, scale: 1, transition: { type: 'spring', stiffness: 380, damping: 30 } });
    }
  };

  return (
    <motion.div
      className="relative min-h-screen w-full overflow-hidden touch-none select-none"
      initial={{ opacity: 1, scale: 1 }}
      animate={controls}
      drag
      dragElastic={0.14}
      dragMomentum={true}
      dragConstraints={false}
      style={{ x, y, touchAction: "none" }}
      onDragEnd={handleUnlock}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background Hyperspeed */}
      <div className="fixed inset-0 z-0 opacity-50 pointer-events-none">
        <Hyperspeed
          effectOptions={{
            onSpeedUp: () => { },
            onSlowDown: () => { },
            distortion: 'turbulentDistortion',
            length: 400,
            roadWidth: 10,
            islandWidth: 2,
            lanesPerRoad: 4,
            fov: 90,
            fovSpeedUp: 150,
            speedUp: 2,
            carLightsFade: 0.4,
            totalSideLightSticks: 20,
            lightPairsPerRoadWay: 40,
            shoulderLinesWidthPercentage: 0.05,
            brokenLinesWidthPercentage: 0.1,
            brokenLinesLengthPercentage: 0.5,
            lightStickWidth: [0.12, 0.5],
            lightStickHeight: [1.3, 1.7],
            movingAwaySpeed: [60, 80],
            movingCloserSpeed: [-120, -160],
            carLightsLength: [400 * 0.03, 400 * 0.2],
            carLightsRadius: [0.05, 0.14],
            carWidthPercentage: [0.3, 0.5],
            carShiftX: [-0.8, 0.8],
            carFloorSeparation: [0, 5],
            colors: {
              roadColor: 0x080808,
              islandColor: 0x0a0a0a,
              background: 0x000000,
              shoulderLines: 0xFFFFFF,
              brokenLines: 0xFFFFFF,
              leftCars: [0xD856BF, 0x6750A2, 0xC247AC],
              rightCars: [0x03B3C3, 0x0E5EA5, 0x324555],
              sticks: 0x03B3C3,
            }
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen justify-center items-center p-6">
        <div className="flex flex-col-reverse sm:flex-row gap-16 items-center w-full max-w-3xl mx-auto">
          <img
            src="https://avatars.githubusercontent.com/u/101909211?v=4"
            alt="AlexSkyBlue | Ingeniero Informático y Front End Developer"
            width={250}
            height={250}
            className="rounded-full shadow-xl bg-[#111] sm:mb-0 mb-4"
            style={{ objectFit: "cover" }}
          />
          <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
            <BlurText
              text="AlexSkyBlue"
              className="text-4xl sm:text-5xl font-extrabold text-white mb-2"
              blurAmount={18}
              duration={1.4}
            />
            <BlurText
              text="Ingeniero Informático"
              className="text-2xl text-[#d4e0fa] font-semibold mb-1"
              blurAmount={10}
              duration={1.2}
            />
            <BlurText
              text="Front End Developer"
              className="text-xl text-[#54d0fa] font-medium mb-4"
              blurAmount={8}
              duration={1.1}
            />
          </div>
        </div>
        <BlurText
          text="Contáctame en"
          className="text-2xl font-semibold text-white mt-6 mb-3"
          blurAmount={16}
          duration={2.0}
        />

        <nav className="flex flex-wrap gap-4 justify-center sm:justify-start items-center mb-4" aria-label="Links principales">
          <a
            href="https://github.com/AlexSkyBlue"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[#23273c] bg-[#181a29] px-5 py-2 text-white flex items-center gap-2 hover:bg-[#23273c] transition font-medium"
            aria-label="GitHub de AlexSkyBlue"
          >
            {/* SVG */}
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .5C5.64.5.5 5.66.5 12.11c0 5.15 3.29 9.52 7.86 11.07.58.1.79-.25.79-.55v-2.14c-3.2.7-3.88-1.54-3.88-1.54-.53-1.37-1.29-1.74-1.29-1.74-1.06-.72.08-.71.08-.71 1.18.08 1.81 1.23 1.81 1.23 1.04 1.8 2.73 1.28 3.39.98.11-.76.41-1.28.75-1.57-2.55-.3-5.23-1.28-5.23-5.68 0-1.26.45-2.29 1.2-3.09-.12-.3-.52-1.53.11-3.2 0 0 .97-.31 3.18 1.18.92-.26 1.92-.4 2.91-.4.99 0 1.99.14 2.91.4 2.21-1.49 3.18-1.18 3.18-1.18.63 1.67.23 2.9.11 3.2.75.8 1.2 1.83 1.2 3.09 0 4.41-2.68 5.37-5.24 5.67.42.37.8 1.09.8 2.2v3.26c0 .3.21.65.8.55 4.56-1.55 7.85-5.92 7.85-11.07C23.5 5.66 18.36.5 12 .5z"/></svg>
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/alex-parra-salinas/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[#0072b1] bg-[#0a66c2] px-5 py-2 text-white flex items-center gap-2 hover:bg-[#005f8a] transition font-medium"
            aria-label="LinkedIn de AlexSkyBlue"
          >
            {/* SVG */}
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.45 20.45h-3.554v-5.569c0-1.327-.025-3.038-1.852-3.038-1.853 0-2.136 1.445-2.136 2.938v5.669h-3.554v-11.5h3.413v1.569h.049c.475-.9 1.637-1.852 3.371-1.852 3.601 0 4.266 2.37 4.266 5.455v6.328zM5.337 8.881c-1.144 0-2.071-.927-2.071-2.071 0-1.144.927-2.071 2.071-2.071s2.071.927 2.071 2.071c0 1.144-.927 2.071-2.071 2.071zm1.777 11.569H3.56v-11.5h3.554v11.5zm15.39-19.5h-18.3C2.014.95 0 2.963 0 5.29v13.42c0 2.327 2.014 4.34 4.304 4.34h18.3c2.29 0 4.304-2.013 4.304-4.34V5.29c0-2.327-2.014-4.34-4.304-4.34z"/></svg>
            LinkedIn
          </a>
          <a
            href="mailto:parraalex2001@gmail.com"
            className="rounded-full border border-[#dd4b39] bg-[#ea4335] px-5 py-2 text-white flex items-center gap-2 hover:bg-[#c23321] transition font-medium"
            aria-label="Gmail de AlexSkyBlue"
            onClick={copyGmail}
          >
            {/* SVG */}
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12.713l11.985-9.713h-23.97z"/><path d="M12 13.5l-12-9.75v15.75c0 1.104.896 2 2 2h20c1.104 0 2-.896 2-2v-15.75z"/></svg>
            Gmail
          </a>
        </nav>

        {/* Indicador de slide */}
        <div className="w-full flex flex-col items-center mt-12">
          <div className="text-blue-100 text-xl mb-3">Desliza en cualquier dirección para desbloquear</div>
              <Icon icon="hugeicons:move"  width={50} />
          </div>
        </div>
    </motion.div>
  );
}
