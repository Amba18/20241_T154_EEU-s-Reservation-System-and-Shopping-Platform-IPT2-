import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getById, updateUser } from '../../services/userService';
import { useParams } from 'react-router-dom';
import classes from './userEdit.module.css';
import Title from '../../components/Title/Title';
import Input from '../../components/Input/Input';
import { EMAIL } from '../../constants/patterns';
import Button from '../../components/Button/Button';

export default function UserEditPage() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { userId } = useParams();
  const isEditMode = userId;

  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [pendingUserData, setPendingUserData] = useState(null); // Store form data temporarily

  useEffect(() => {
    if (isEditMode) loadUser();
  }, [userId]);

  const loadUser = async () => {
    const user = await getById(userId);
    reset(user);
  };

  const submit = userData => {
    setPendingUserData(userData); // Temporarily store form data
    setIsModalOpen(true); // Open confirmation modal
  };

  const handleConfirm = async () => {
    if (pendingUserData) {
      await updateUser(pendingUserData); // Proceed with the update
    }
    setIsModalOpen(false); // Close modal
  };

  const handleCancel = () => {
    setPendingUserData(null); // Clear stored data
    setIsModalOpen(false); // Close modal
  };

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <Title title={isEditMode ? 'Edit User' : 'Add User'} />

        {/* Confirmation Modal */}
        {isModalOpen && (
          <div className={classes.modalOverlay}>
            <div className={classes.modal}>
              <p>Are you sure you want to submit the form?</p>
              <div className={classes.modalButtons}>
                <Button
                  type="button"
                  text="Yes, Submit"
                  onClick={handleConfirm}
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

        <form onSubmit={handleSubmit(submit)} noValidate>
          <Input
            label="Name"
            {...register('name', { required: true, minLength: 3 })}
            error={errors.name}
          />
          <Input
            label="Email"
            {...register('email', { required: true, pattern: EMAIL })}
            error={errors.email}
          />
          <Input
            label="Address"
            {...register('address', { required: true, minLength: 5 })}
            error={errors.address}
          />

          <Input label="Is Admin" type="checkbox" {...register('isAdmin')} />
          <Button type="submit" text="Submit" />
        </form>
      </div>
    </div>
  );
}
