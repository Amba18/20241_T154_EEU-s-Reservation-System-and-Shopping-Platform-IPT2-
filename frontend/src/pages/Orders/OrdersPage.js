import React, { useEffect, useReducer, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAll, getAllStatus } from '../../services/orderService';
import classes from './ordersPage.module.css';
import Title from '../../components/Title/Title';
import DateTime from '../../components/DateTime/DateTime';
import Price from '../../components/Price/Price';
import NotFound from '../../components/NotFound/NotFound';

const initialState = {};
const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'ALL_STATUS_FETCHED':
      return { ...state, allStatus: payload };
    case 'ORDERS_FETCHED':
      return { ...state, orders: payload };
    default:
      return state;
  }
};

const filterOrdersByDate = (orders, filterType) => {
  const now = new Date();
  return orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    switch (filterType) {
      case 'day':
        return now.toDateString() === orderDate.toDateString();
      case 'week':
        const firstDayOfWeek = now.getDate() - now.getDay(); // Sunday as the first day
        const lastDayOfWeek = firstDayOfWeek + 6; // Saturday as the last day
        return orderDate >= new Date(now.setDate(firstDayOfWeek)) && orderDate <= new Date(now.setDate(lastDayOfWeek));
      case 'month':
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      case 'year':
        return orderDate.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  });
};

export default function OrdersPage() {
  const [{ allStatus, orders }, dispatch] = useReducer(reducer, initialState);
  const [filterTime, setFilterTime] = useState('day'); // Default filter is by day

  const { filter } = useParams();

  useEffect(() => {
    getAllStatus().then(status => {
      dispatch({ type: 'ALL_STATUS_FETCHED', payload: status });
    });
    getAll(filter).then(orders => {
      dispatch({ type: 'ORDERS_FETCHED', payload: orders });
    });
  }, [filter]);

  const productsOrderedNew = {}; // Track products in 'NEW' status
  const productsOrderedReceived = {}; // Track products in 'RECEIVED' status
  const productSales = {}; // Track total sales for products
  let totalSales = 0;

  // Filter orders for the selected time
  const filteredOrders = filterOrdersByDate(orders || [], filterTime);

  // Process orders by status
  filteredOrders.forEach(order => {
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
      <Title title="Sales Report and Orders" margin="1.5rem 0 0 .2rem" fontSize="1.9rem" />

      <div className={classes.reportAndOrdersContainer}>
        {/* Sales Report Section */}
        <div className={classes.salesReport}>
          <h3>Sales Report: </h3>
          <div className={classes.timeFilters}>
            <button onClick={() => setFilterTime('day')}>Today</button>
            <button onClick={() => setFilterTime('week')}>This Week</button>
            <button onClick={() => setFilterTime('month')}>This Month</button>
            <button onClick={() => setFilterTime('year')}>This Year</button>
          </div>

          {/* Display products with NEW status */}
          {filter === 'NEW' && (
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

          {/* Display products with RECEIVED status */}
          {filter === 'RECEIVED' && (
            <div>
              <h4>Total Sales from RECEIVED Orders: <Price price={totalSales} /></h4>
              <h5>Products Sold:</h5>
              <ul>
                {Object.entries(productsOrderedReceived).map(([productId, count]) => {
                  const product = productsOrderedNew[productId] || {}; // Fallback to NEW data for consistency
                  return (
                    <li key={productId}>
                      {product.name}: {count} units, <Price price={productSales[productId]} />
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Display all orders */}
          {(filter === 'ALL' || !filter) && (
            <div>
              <h4>Total Sales: <Price price={totalSales} /></h4>
              <h5>Products Sold:</h5>
              <ul>
                {Object.entries(productsOrderedReceived).map(([productId, count]) => {
                  const product = productsOrderedNew[productId] || {}; // Fallback to NEW data for consistency
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

        {/* Orders Section */}
        
        <div className={classes.ordersSection}>
          {allStatus && (
            <div className={classes.all_status}>
              <Link to="/orders" className={!filter ? classes.selected : ''}>
                All
              </Link>
              {allStatus.map(state => (
                <Link
                  key={state}
                  className={state === filter ? classes.selected : ''}
                  to={`/orders/${state}`}
                >
                  {state}
                </Link>
              ))}
            </div>
          )}

          {orders?.length === 0 && (
            <NotFound
              linkRoute={filter ? '/orders' : '/'}
              linkText={filter ? 'Show All' : 'Go To Home Page'}
            />
          )}

          {orders &&
            orders.map(order => (
              <div key={order.id} className={classes.order_summary}>
                <div className={classes.header}>
                  <span>{order.id}</span>
                  <span>
                    <DateTime date={order.createdAt} />
                  </span>
                  <span>{order.status}</span>
                </div>
                <div className={classes.items}>
                  {order.items.map(item => (
                    <Link key={item.food.id} to={`/food/${item.food.id}`}>
                      <img src={item.food.imageUrl} alt={item.food.name} />
                    </Link>
                  ))}
                </div>
                <div className={classes.footer}>
                  <div>
                    <Link to={`/track/${order.id}`}>Show Order</Link>
                  </div>
                  <div>
                    <span className={classes.price}>
                      <Price price={order.totalPrice} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
