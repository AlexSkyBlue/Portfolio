'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TabletHome from './tabletHome';
import LockScreen from './lockScreen';

export default function HomeClient() {
  const [unlocked, setUnlocked] = useState(false);

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
          <LockScreen onUnlock={() => setUnlocked(true)} />
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
