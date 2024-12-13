import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import classes from './profilePage.module.css';
import Title from '../../components/Title/Title';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import ChangePassword from '../../components/ChangePassword/ChangePassword';

export default function ProfilePage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const { user, updateProfile } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [pendingUserData, setPendingUserData] = useState(null); // Store form data temporarily

  const submit = userData => {
    setPendingUserData(userData); // Store data temporarily
    setIsModalOpen(true); // Open modal
  };

  const handleUpdate = () => {
    updateProfile(pendingUserData); // Update profile with stored data
    setIsModalOpen(false); // Close modal
  };

  const handleCancel = () => {
    setPendingUserData(null); // Clear data
    setIsModalOpen(false); // Close modal
  };

  return (
    <div className={classes.container}>
      <div className={classes.details}>
        <Title title="Update Profile" />

        {/* Modal */}
        {isModalOpen && (
          <div className={classes.modalOverlay}>
            <div className={classes.modal}>
              <p>Are you sure you want to update your profile?</p>
              <div className={classes.modalButtons}>
                <Button
                  type="button"
                  text="Yes, Update"
                  onClick={handleUpdate}
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
            defaultValue={user.name}
            type="text"
            label="Name"
            {...register('name', {
              required: true,
              minLength: 5,
            })}
            error={errors.name}
          />
          <Input
            defaultValue={user.address}
            type="text"
            label="Address"
            {...register('address', {
              required: true,
              minLength: 10,
            })}
            error={errors.address}
          />

          <Button type="submit" text="Update" backgroundColor="#009e84" />
        </form>

        <ChangePassword />
      </div>
    </div>
  );
}
