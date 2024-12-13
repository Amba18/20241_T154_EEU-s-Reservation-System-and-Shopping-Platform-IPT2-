import React from 'react';
import classes from './input.module.css';

function Input({ type, defaultValue, onChange, onBlur, name, error, label }, ref) {
  const getErrorMessage = () => {
    if (!error) return;
    if (error.message) return error.message;

    // Default messages
    switch (error.type) {
      case 'required':
        return 'This field is required';
      case 'minLength':
        return 'Field is too short';
      default:
        return '*';
    }
  };

  return (
    <div className={classes.inputContainer}>
      <input
        defaultValue={defaultValue}
        className={classes.input}
        type={type}
        placeholder={label} // Use the label as placeholder
        ref={ref}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
      />
      {error && <div className={classes.error}>{getErrorMessage()}</div>}
    </div>
  );
}

export default React.forwardRef(Input);
