import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

/**
 * Subtle scroll-linked scale/y on chapter media. Overflow clipped by parent.
 */
export default function ChapterMediaMotion({ children, className = '' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-5%', '5%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [1, 1, 1] : [1.07, 1.02, 1.07]);

  return (
    <div ref={ref} className={`chapter-media-motion-root${className ? ` ${className}` : ''}`}>
      <motion.div className="chapter-media-motion" style={{ y, scale }}>
        {children}
      </motion.div>
    </div>
  );
}
