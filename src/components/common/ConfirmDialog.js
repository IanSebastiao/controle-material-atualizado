import React, { useState, useEffect } from 'react';
import './ConfirmDialog.css';

const ConfirmDialog = ({ 
  isOpen, 
  title = 'Confirmar ação',
  message = 'Tem certeza que deseja continuar?',
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDanger = false,
  showUndoTimer = false,
  undoTimeout = 5
}) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(undoTimeout);

  useEffect(() => {
    if (!isConfirmed) {
      setSecondsLeft(undoTimeout);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (typeof onConfirm === 'function') {
            onConfirm();
          }
          setIsConfirmed(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isConfirmed, onConfirm, undoTimeout]);

  if (!isOpen) return null;

  const handleConfirmClick = () => {
    if (showUndoTimer) {
      setIsConfirmed(true);
    } else {
      if (typeof onConfirm === 'function') {
        onConfirm();
      }
    }
  };

  const handleCancelClick = () => {
    setIsConfirmed(false);
    if (typeof onCancel === 'function') {
      onCancel();
    }
  };

  const handleUndoClick = () => {
    setIsConfirmed(false);
  };

  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        {!isConfirmed ? (
          <>
            <div className="confirm-dialog-header">
              <h2>{title}</h2>
            </div>
            <div className="confirm-dialog-body">
              <p>{message}</p>
            </div>
            <div className="confirm-dialog-footer">
              <button 
                className="btn btn-secondary" 
                onClick={handleCancelClick}
              >
                {cancelText}
              </button>
              <button 
                className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`}
                onClick={handleConfirmClick}
              >
                {confirmText}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="confirm-dialog-header">
              <h2>Exclusão agendada</h2>
            </div>
            <div className="confirm-dialog-body">
              <p className="undo-message">O item será excluído em <strong>{secondsLeft}</strong> segundo{secondsLeft !== 1 ? 's' : ''}.</p>
              <div className="undo-countdown-bar">
                <div 
                  className="undo-countdown-progress" 
                  style={{ width: `${(secondsLeft / undoTimeout) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="confirm-dialog-footer">
              <button 
                className="btn btn-secondary" 
                onClick={handleUndoClick}
              >
                Desfazer
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmDialog;