import s from './button.module.css';

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button onClick={onClick} className={s['btn']}>
      {children}
    </button>
  );
};
