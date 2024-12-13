
import React from 'react';
import classes from './confirmModal.module.css';

export default function ConfirmModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className={classes.modal_overlay}>
      <div className={classes.modal}>
        <h2>Confirm Checkout</h2>
        <p>Are you sure you want to proceed to checkout?</p>
        <div className={classes.button_container}>
          <button 
            className={classes.cancel_button} 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className={classes.confirm_button} 
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
} 