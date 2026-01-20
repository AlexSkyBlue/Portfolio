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

  // 2. FUNCIÓN DE DESBLOQUEO: Esta es la que faltaba definir
  const handleUnlock = () => {
    setUnlocked(true);
    sessionStorage.setItem("isUnlocked", "true"); // <--- Aquí guardamos el estado
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
          {/* 3. Pasamos la nueva función handleUnlock aquí */}
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
          <TabletHome />
        </motion.div>
      )}
    </AnimatePresence>
  );
}