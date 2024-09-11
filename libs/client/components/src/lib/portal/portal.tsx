import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
  node?: Element | null | undefined;
}

export const Portal: React.FC<PortalProps> = ({ children, node }) => {
  if (!node) {
    return null;
  }
  return createPortal(children, node);
};
