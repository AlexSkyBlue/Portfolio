'use client';
import { useState, useEffect } from 'react'; // Asegúrate de importar useEffect
import { AnimatePresence, motion } from 'framer-motion';
import TabletHome from './tabletHome';
import LockScreen from './lockScreen';

export default function HomeClient() {
  // Usaremos solo esta variable para saber si está desbloqueado
  const [unlocked, setUnlocked] = useState(false);

  // 1. AL CARGAR: Revisar si ya desbloqueaste antes
  useEffect(() => {
    const sessionUnlocked = sessionStorage.getItem("isUnlocked");
    if (sessionUnlocked === "true") {
      setUnlocked(true);
    }
  }, []);

  // 2. FUNCIÓN DE DESBLOQUEO
  const handleUnlock = () => {
    setUnlocked(true);
    sessionStorage.setItem("isUnlocked", "true");
  };

  // 3. NUEVA FUNCIÓN DE BLOQUEO (Borra la sesión y oculta la tablet)
  const handleLock = () => {
    setUnlocked(false);
    sessionStorage.removeItem("isUnlocked");
  };

  return (
    <AnimatePresence mode="wait">
      {!unlocked ? (
        <motion.div
          className='overflow-hidden'
          key="lock"
          initial={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -80 }}
          transition={{ duration: 0.4 }}
        >
          <LockScreen onUnlock={handleUnlock} />
        </motion.div>
      ) : (
        <motion.div
          key="home"
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 80 }}
          transition={{ duration: 0.5 }}
        >
          {/* 4. Le pasamos la función a la tablet */}
          <TabletHome onLock={handleLock} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}