import { motion, useReducedMotion } from 'motion/react';

const EASE = [0.22, 1, 0.36, 1];

/**
 * Shared section title entrance: kicker then title with blur → sharp.
 */
export default function RevealTitle({
  kicker,
  title,
  as: TitleTag = 'h2',
  className = '',
  titleClassName = 'home-sec-title',
  align = 'start',
}) {
  const reduce = useReducedMotion();
  const MotionTitle = motion[TitleTag] || motion.h2;

  const initial = reduce ? false : { opacity: 0, y: 18, filter: 'blur(8px)' };
  const shown = { opacity: 1, y: 0, filter: 'blur(0px)' };

  return (
    <header className={`home-sec-head${className ? ` ${className}` : ''}`} data-align={align}>
      {kicker ? (
        <motion.p
          className="chapter-kicker"
          initial={initial}
          whileInView={shown}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {kicker}
        </motion.p>
      ) : null}
      {title ? (
        <MotionTitle
          className={titleClassName}
          initial={initial}
          whileInView={shown}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.85, ease: EASE, delay: reduce ? 0 : 0.08 }}
        >
          {title}
        </MotionTitle>
      ) : null}
    </header>
  );
}
