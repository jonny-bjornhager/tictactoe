import { animated, useTransition } from '@react-spring/web';
import { useEffect, useRef } from 'react';

import { Portal } from '../portal/portal';

import s from './modal.module.css';

export interface ModalProps {
  children: React.ReactNode;
  isOpen?: boolean;
  container?: Element | null | string;
  toggle?: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  children,
  container = '#portal',
  isOpen,
  toggle,
}) => {
  const nodeRef = useRef<Element | null | undefined>(null);

  const duration = 300;

  const backdropTransition = useTransition(isOpen, {
    from: { opacity: 0, backdropFilter: 'blur(0px) brightness(100%)' },
    enter: { opacity: 1, backdropFilter: 'blur(3px) brightness(50%)' },
    leave: { opacity: 0, backdropFilter: 'blur(0px) brightness(100%)' },
    config: { duration: duration },
  });

  const bodyTransition = useTransition(isOpen, {
    from: { opacity: 0, transform: 'translateY(-20px)' },
    enter: { opacity: 1, transform: 'translateY(0)' },
    leave: { opacity: 0, transform: 'translateY(-20px)' },
    config: { duration: duration },
  });

  useEffect(() => {
    if (container && typeof container !== 'string') {
      nodeRef.current = container;
    }
    if (typeof container === 'string') {
      nodeRef.current = document.querySelector(container);
    }
  }, []);

  // If no container, return null
  if (!nodeRef.current) {
    return null;
  }

  const backdropTransitions = backdropTransition((style, item) => {
    if (!item) {
      return null;
    }
    return (
      <animated.div onClick={toggle} className={s['backdrop']} style={style}>
        {bodyTransition((bodyStyle, bodyItem) => {
          if (!bodyItem) {
            return null;
          }
          return (
            <animated.div className={s['body']} style={bodyStyle}>
              {children}
            </animated.div>
          );
        })}
      </animated.div>
    );
  });

  return <Portal node={nodeRef.current}>{backdropTransitions}</Portal>;
};
