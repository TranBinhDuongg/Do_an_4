import React from 'react';

export function Header({ title, subtitle }) {
  return (
    <header className="header">
      <h1>{title}</h1>
      {subtitle && <p style={{ color: '#64748b', marginTop: '0.25rem' }}>{subtitle}</p>}
    </header>
  );
}
