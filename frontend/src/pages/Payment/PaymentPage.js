import React, { useState, useEffect } from 'react';
import classes from './paymentPage.module.css';
import { getNewOrderForCurrentUser, pay } from '../../services/orderService';
import Title from '../../components/Title/Title';
import OrderItemsList from '../../components/OrderItemsList/OrderItemsList';

export default function PaymentPage() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getNewOrderForCurrentUser();
        setOrder(data);
      } catch {
        setError('Loading......');
      }
    };
    fetchOrder();
  }, []);

  const sendDataToGoogleSheet = async (order) => {
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbw4hgeCBRA6st06iho2UM-AKYKRhzqzCNzHXr2Mst-65vqxeinwCasatTCtezw0TMOU2A/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email: order.email,
          name: order.name,
          paymentID: order._id,  // Assuming _id is the payment ID
          totalPrice: order.totalPrice, // Assuming totalPrice is part of the order
        }),
      });

      const result = await response.text();
      console.log(result); // Logs the response from the Google Apps Script
    } catch (error) {
      console.error("Error sending data to Google Sheets:", error);
    }
  };

  const handleConfirm = async () => {
    if (!order?._id) return;

    setLoading(true);
    setError(null);

    try {
      const updatedOrder = await pay(null, 'RECEIVED', order._id);
      if (updatedOrder) {
        // Send the order data to Google Sheets
        await sendDataToGoogleSheet(order);

        window.location.href = '/orders/NEW'; // Redirect to the orders page
      } else {
        // Handle failure scenario
        setError('Payment failed. Please try again.');
      }
    } catch (err) {
      console.error('Error during status update:', err);
      window.location.href = 'Failed Purchase';
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className={classes.error}>{error}</div>;
  if (!order) return <div>Loading...</div>;

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <Title title="Payment Slip" fontSize="1.6rem" />
        <div className={classes.summary}>
          <div>
            <h3>Email:</h3>
            <span>{order.email}</span>
          </div>
          <div>
            <h3>Name:</h3>
            <span>{order.name}</span>
          </div>
          <div>
            <h3>Address:</h3>
            <span>{order.address}</span>
          </div>
        </div>
        <OrderItemsList order={order} />
        <button
          className={classes.confirmButton}
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Confirm'}
        </button>
      </div>
    </div>
  );
}
