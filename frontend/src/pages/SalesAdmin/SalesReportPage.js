import React, { useEffect, useState } from 'react';
import { getAll } from '../../services/orderService';
import Price from '../../components/Price/Price';
import classes from './SalesReportPage.module.css'; // Create a new CSS file for this page

const SalesReportPage = () => {
  const [filterTime, setFilterTime] = useState('day');
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    getAll().then(fetchedOrders => {
      setOrders(fetchedOrders);
    });
  }, []);

  const productsOrderedNew = {}; 
  const productsOrderedReceived = {}; 
  const productSales = {}; 
  let totalSales = 0;

  // Process orders by status
  orders.forEach(order => {
    if (order.status === 'NEW') {
      order.items.forEach(item => {
        productsOrderedNew[item.food.id] = item.food;
      });
    } else if (order.status === 'RECEIVED') {
      order.items.forEach(item => {
        const productIncome = item.food.price * item.quantity;
        productsOrderedReceived[item.food.id] = (productsOrderedReceived[item.food.id] || 0) + item.quantity;
        productSales[item.food.id] = (productSales[item.food.id] || 0) + productIncome;
        totalSales += productIncome;
      });
    }
  });

  return (
    <div className={classes.container}>
      <h3>Sales Report</h3>

      <div className={classes.timeFilters}>
        <button onClick={() => setFilterTime('day')}>Today</button>
        <button onClick={() => setFilterTime('week')}>This Week</button>
        <button onClick={() => setFilterTime('month')}>This Month</button>
        <button onClick={() => setFilterTime('year')}>This Year</button>
      </div>

      {filterTime === 'NEW' && (
        <div>
          <h4>Products with NEW Status:</h4>
          <ul>
            {Object.values(productsOrderedNew).map(product => (
              <li key={product.id}>
                <img src={product.imageUrl} alt={product.name} width="50" />
                {product.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {filterTime === 'RECEIVED' && (
        <div>
          <h4>Total Sales from RECEIVED Orders: <Price price={totalSales} /></h4>
          <h5>Products Sold:</h5>
          <ul>
            {Object.entries(productsOrderedReceived).map(([productId, count]) => {
              const product = productsOrderedNew[productId] || {}; 
              return (
                <li key={productId}>
                  {product.name}: {count} units, <Price price={productSales[productId]} />
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {(filterTime === 'ALL' || !filterTime) && (
        <div>
          <h4>Total Sales: <Price price={totalSales} /></h4>
          <h5>Products Sold:</h5>
          <ul>
            {Object.entries(productsOrderedReceived).map(([productId, count]) => {
              const product = productsOrderedNew[productId] || {}; 
              return (
                <li key={productId}>
                  {product.name}: {count} units, <Price price={productSales[productId]} />
                </li>
              );
            })}
          </ul>
          <h5>Products with NEW Status:</h5>
          <ul>
            {Object.values(productsOrderedNew).map(product => (
              <li key={product.id}>
                <img src={product.imageUrl} alt={product.name} width="50" />
                {product.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SalesReportPage;
