  import React from 'react';
  import { useCart } from '../../hooks/useCart';
  import { useAuth } from '../../hooks/useAuth';
  import { useNavigate } from 'react-router-dom';
  import { useState } from 'react';
  import { useForm } from 'react-hook-form';
  import { toast } from 'react-toastify';
  import { createOrder } from '../../services/orderService';
  import classes from './checkoutPage.module.css';
  import Title from '../../components/Title/Title';
  import Input from '../../components/Input/Input';
  import Button from '../../components/Button/Button';
  import OrderItemsList from '../../components/OrderItemsList/OrderItemsList';
  export default function CheckoutPage() {
    const { cart, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [order, setOrder] = useState({ ...cart });

    const {
      register,
      formState: { errors },
      handleSubmit,
    } = useForm();

    const submit = async data => {
      await createOrder({ 
        ...order, 
        email:data.email,
        name: data.name, 
        address: data.address,
        addressLatLng: { lat: 0, lng: 0 }
      });
      clearCart();
      navigate('/payment');
    };

    return (
      <>
        <form onSubmit={handleSubmit(submit)} className={classes.container}>
          <div className={classes.content}>
            <Title title="Order Form" fontSize="1.6rem" />
            <div className={classes.inputs}>
            <Input
                defaultValue={user.email}
                label="Email"
                {...register('email')}
                error={errors.email}
              />
              <Input
                defaultValue={user.name}
                label="Name"
                {...register('name')}
                error={errors.name}
              />
              <Input
                defaultValue={user.address}
                label="Address"
                {...register('address')}
                error={errors.address}
              />
            </div>
            <OrderItemsList order={order} />
          </div>

          <div className={classes.buttons_container}>
            <div className={classes.buttons}>
              <Button
                type="button"
                text="Back to Cart"
                width="100%"
                height="3rem"
                fontSize="1rem"
                onClick={() => navigate('/cart')}
                backgroundColor="red"
                color="white"
              />
              <Button
                type="submit"
                text="Check payment Slip"
                width="100%"
                height="3rem"
                fontSize="1rem"
              />
            </div>
          </div>
        </form>
      </>
    );
  }
