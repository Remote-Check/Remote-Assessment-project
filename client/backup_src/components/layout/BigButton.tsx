import React from 'react';

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  iconEnd?: React.ReactNode;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export const BigButton: React.FC<Props> = ({ variant = 'primary', children, onClick, icon, iconEnd, disabled, style }) => {
  const cls = `btn btn-lg btn-${variant}${disabled ? ' btn-disabled' : ''}`;
  return (
    <button className={cls} onClick={onClick} disabled={disabled} style={style}>
      {icon}
      <span>{children}</span>
      {iconEnd}
    </button>
  );
};
