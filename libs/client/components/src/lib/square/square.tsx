import clsx from 'clsx';

import s from './square.module.css';

interface SquareProps {
    onClick: () => void;
    value: string | null;
}

export const Square: React.FC<SquareProps> = ({ onClick, value }) => {
    const classNames = clsx({
        [s['square']]: true,
        [s['x']]: value === 'x',
        [s['o']]: value === 'o',
    });
    return (
        <div className={classNames}>
            <button type="button" aria-label="Game square" onClick={onClick} />
        </div>
    );
};
