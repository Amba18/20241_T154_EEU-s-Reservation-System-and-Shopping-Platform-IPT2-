import React, { useState, useEffect } from 'react';
import classes from './paymentPage.module.css';
import { getNewOrderForCurrentUser, confirmOrder } from '../../services/orderService';
import Title from '../../components/Title/Title';
import OrderItemsList from '../../components/OrderItemsList/OrderItemsList';

export default function PaymentPage() {
  const [order, setOrder] = useState();

  useEffect(() => {
    getNewOrderForCurrentUser().then(data => setOrder(data));
  }, []);

  const handleConfirmOrder = async () => {
    try {
      const response = await confirmOrder();
      if (response && response.orderId) {
        alert('Order has been confirmed and paid.');
        setOrder(prevOrder => ({
          ...prevOrder,
          status: 'PAYED',
        }));
      }
    } catch (error) {
      console.error('Error confirming order:', error);
      alert('There was an error confirming your order.');
    }
  };

  if (!order) return;

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <Title title="Payment Slip" fontSize="1.6rem" />
        <div className={classes.summary}>
          <div>
            <h3>Name:</h3>
            <span>{order.name}</span>
          </div>
          <div>
            <h3>Address:</h3>
            <span>{order.address}</span>
          </div>
        </div>
        <div>
          <br />
          <button onClick={handleConfirmOrder}>Confirm Order</button>
        </div>
        <OrderItemsList order={order} />
      </div>
    </div>
  );
}
