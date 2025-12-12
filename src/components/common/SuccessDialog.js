import React, { useEffect, useState } from 'react';
import './SuccessDialog.css';

const SuccessDialog = ({ 
  isOpen, 
  title = 'Sucesso!',
  message = 'Operação realizada com sucesso.',
  countdown = 3,
  onClose
}) => {
  const [secondsLeft, setSecondsLeft] = useState(countdown);

  useEffect(() => {
    if (!isOpen) return;
    
    setSecondsLeft(countdown);
    
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (typeof onClose === 'function') {
            onClose();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, countdown, onClose]);

  if (!isOpen) return null;

  return (
    <div className="success-dialog-overlay">
      <div className="success-dialog">
        <div className="success-dialog-icon">✓</div>
        <div className="success-dialog-header">
          <h2>{title}</h2>
        </div>
        <div className="success-dialog-body">
          <p>{message}</p>
          <div className="countdown">
            <p>Redirecionando em <strong>{secondsLeft}</strong> segundo{secondsLeft !== 1 ? 's' : ''}...</p>
            <div className="countdown-bar">
              <div className="countdown-progress" style={{ width: `${(secondsLeft / countdown) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessDialog;