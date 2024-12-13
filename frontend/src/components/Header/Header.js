import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import classes from './header.module.css';

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
  };

  const fetchWeather = async () => {
    try {
      const response = await fetch(
        `http://dataservice.accuweather.com/currentconditions/v1/2-262396_1_AL?apikey=jleGpnIAcGUPhBOy1GEt06Q2wPRS6pfP`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setWeatherData(data[0]);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeatherData(null);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <header className={classes.header}>
      <div className={classes.container}>
        <Link to="/" className={classes.logo}>
          EEU Reservation
        </Link>
        {weatherData && (
          <div className={classes.weather}>
            <span>{weatherData.WeatherText}</span>
            <span>{weatherData.Temperature.Metric.Value}°{weatherData.Temperature.Metric.Unit}</span>
          </div>
        )}
        <nav>
          <ul>
            {user ? (
              <li className={classes.menu_container}>
                <Link to="/dashboard">{user.name}</Link>
                <div className={classes.menu}>
                  <Link to="/profile">Profile</Link>
                  <Link to="/orders">Orders</Link>
                  <a onClick={() => setIsLogoutModalOpen(true)}>Logout</a>
                </div>
              </li>
            ) : (
              <Link to="/login">Login</Link>
            )}
            {user && !user.isAdmin && (
              <li>
                <Link to="/cart">
                  Cart
                  {cart.totalCount > 0 && (
                    <span className={classes.cart_count}>
                      {cart.totalCount}
                    </span>
                  )}
                </Link>
              </li>
            )}
          </ul>
        </nav>

        
      </div>

      {isLogoutModalOpen && (
        <div className={classes.modal}>
          <div className={classes.modal_content}>
            <p>Are you sure you want to logout?</p>
            <div className={classes.modal_actions}>
              <button onClick={handleLogout} className={classes.confirm_button}>
                Yes
              </button>
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className={classes.cancel_button}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
