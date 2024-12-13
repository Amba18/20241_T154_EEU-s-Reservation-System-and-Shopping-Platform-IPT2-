import { useParams } from 'react-router-dom';
import classes from './foodEdit.module.css';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { add, getById, update } from '../../services/foodService';
import Title from '../../components/Title/Title';
import InputContainer from '../../components/InputContainer/InputContainer';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { uploadImage } from '../../services/uploadService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function FoodEditPage() {
  const { foodId } = useParams();
  const [imageUrl, setImageUrl] = useState();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [pendingFoodData, setPendingFoodData] = useState(null);
  const [popupAction, setPopupAction] = useState(''); // 'create' or 'update'
  const isEditMode = !!foodId;

  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (!isEditMode) return;

    getById(foodId).then(food => {
      if (!food) return;
      reset(food);
      setImageUrl(food.imageUrl);
    });
  }, [foodId]);

  const submit = foodData => {
    setPendingFoodData(foodData);
    setPopupAction(isEditMode ? 'update' : 'create'); // Determine action
    setIsPopupOpen(true);
  };

  const handleAdd = async () => {
    const food = { ...pendingFoodData, imageUrl };
    const newFood = await add(food);
    toast.success(`Food "${food.name}" added successfully!`);
    navigate('/admin/editFood/' + newFood.id, { replace: true });
    setIsPopupOpen(false); // Close popup
  };

  const handleUpdate = async () => {
    const food = { ...pendingFoodData, imageUrl };
    await update(food);
    toast.success(`Food "${food.name}" updated successfully!`);
    setIsPopupOpen(false); // Close popup
  };

  const handleCancel = () => {
    setPendingFoodData(null);
    setPopupAction('');
    setIsPopupOpen(false); // Close popup
  };

  const upload = async event => {
    setImageUrl(null);
    const imageUrl = await uploadImage(event);
    setImageUrl(imageUrl);
  };

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <Title title={isEditMode ? 'Edit Item' : 'Add Item'} />

        {/* Popup Modal */}
        {isPopupOpen && (
          <div className={classes.popupOverlay}>
            <div className={classes.popup}>
              <p>
                {popupAction === 'update'
                  ? 'Are you sure you want to update this food item?'
                  : 'Are you sure you want to create this food item?'}
              </p>
              <div className={classes.popupButtons}>
                <Button
                  type="button"
                  text="Yes, Proceed"
                  onClick={popupAction === 'update' ? handleUpdate : handleAdd}
                />
                <Button
                  type="button"
                  text="Cancel"
                  onClick={handleCancel}
                />
              </div>
            </div>
          </div>
        )}

        <form
          className={classes.form}
          onSubmit={handleSubmit(submit)}
          noValidate
        >
          <InputContainer label="Select Image">
            <input type="file" onChange={upload} accept="image/jpeg" />
          </InputContainer>

          {imageUrl && (
            <a href={imageUrl} className={classes.image_link} target="blank">
              <img src={imageUrl} alt="Uploaded" />
            </a>
          )}

          <Input
            type="text"
            label="Name"
            {...register('name', { required: true, minLength: 5 })}
            error={errors.name}
          />

          <Input
            type="number"
            label="Price"
            {...register('price', { required: true })}
            error={errors.price}
          />

          <Input
            type="text"
            label="Tags"
            {...register('tags')}
            error={errors.tags}
          />

          <Input
            type="text"
            label="Origins"
            {...register('origins', { required: true })}
            error={errors.origins}
          />

          <Button type="submit" text={isEditMode ? 'Update' : 'Create'} />
        </form>
      </div>
    </div>
  );
}
