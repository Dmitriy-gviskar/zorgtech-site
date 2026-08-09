import { motion } from 'motion/react';

export default function Reveal({ children, className = '', delay = 0, y = 28 }) {
  return (
    <motion.div
      className={`reveal${className ? ` ${className}` : ''}`}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}
    >
      {children}
    </motion.div>
  );
}
