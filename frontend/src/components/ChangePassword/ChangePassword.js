import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Title from '../Title/Title';
import Input from '../Input/Input';
import Button from '../Button/Button';
import { useAuth } from '../../hooks/useAuth';
import classes from './ChangePassword.module.css'; // Ensure you style the modal appropriately

export default function ChangePassword() {
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();

  const { changePassword } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [pendingPasswords, setPendingPasswords] = useState(null); // Temporarily store passwords

  const submit = passwords => {
    setPendingPasswords(passwords); // Save passwords temporarily
    setIsModalOpen(true); // Open confirmation modal
  };

  const handleChangePassword = () => {
    changePassword(pendingPasswords); // Proceed with password change
    setIsModalOpen(false); // Close modal
  };

  const handleCancel = () => {
    setPendingPasswords(null); // Clear temporary passwords
    setIsModalOpen(false); // Close modal
  };

  return (
    <div>
      <Title title="Change Password" />

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className={classes.modalOverlay}>
          <div className={classes.modal}>
            <p>Are you sure you want to change your password?You'll be logged out after you change you password</p>
            <div className={classes.modalButtons}>
              <Button
                type="button"
                text="Yes, Change"
                onClick={handleChangePassword}
                backgroundColor="#009e84"
              />
              <Button
                type="button"
                text="Cancel"
                onClick={handleCancel}
                backgroundColor="#d9534f"
              />
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(submit)}>
        <Input
          type="password"
          label="Current Password"
          {...register('currentPassword', {
            required: true,
          })}
          error={errors.currentPassword}
        />

        <Input
          type="password"
          label="New Password"
          {...register('newPassword', {
            required: true,
            minLength: 5,
          })}
          error={errors.newPassword}
        />

        <Input
          type="password"
          label="Confirm Password"
          {...register('confirmNewPassword', {
            required: true,
            validate: value =>
              value !== getValues('newPassword')
                ? 'Passwords do not match'
                : true,
          })}
          error={errors.confirmNewPassword}
        />

        <Button type="submit" text="Change" />
      </form>
    </div>
  );
}
