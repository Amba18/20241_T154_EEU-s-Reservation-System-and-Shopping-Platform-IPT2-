import React from 'react';
import { Link } from 'react-router-dom';
import Price from '../Price/Price';
import classes from './orderItemsList.module.css';

export default function OrderItemsList({ order }) {
  // Function to calculate the total sales of each product if the order is RECEIVED
  const calculateTotalSales = () => {
    if (order.status === 'RECEIVED') {
      return order.items.reduce((total, item) => total + item.price, 0);
    }
    return 0;
  };

  return (
    <table className={classes.table}>
      <tbody>
        <tr>
          <td colSpan="5">
            <h3>Order ID: {order._id}</h3> {/* Display the order ID */}
          </td>
        </tr>
        <tr>
          <td colSpan="5">
            <h3>Order Items:</h3>
          </td>
        </tr>
        {order.items.map(item => (
          <tr key={item.food.id}>
            <td>
              <Link to={`/food/${item.food.id}`}>
                <img src={item.food.imageUrl} alt={item.food.name} />
              </Link>
            </td>
            <td>{item.food.name}</td>
            <td>
              <Price price={item.food.price} />
            </td>
            <td>{item.quantity}</td>
            <td>
              <Price price={item.price} />
            </td>
          </tr>
        ))}

        <tr>
          <td colSpan="3"></td>
          <td>
            <strong>Total :</strong>
          </td>
          <td>
            <Price price={order.totalPrice} />
          </td>
        </tr>

        {/* Display total sales if order status is RECEIVED */}
        {order.status === 'RECEIVED' && (
          <tr>
            <td colSpan="4">
              <div className={classes.salesContainer}>
                <strong>Total Sales: </strong>
                <Price price={calculateTotalSales()} />
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
