import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import classes from './loginPage.module.css';
import Title from '../../components/Title/Title';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import ReCAPTCHA from 'react-google-recaptcha';
import { EMAIL } from '../../constants/patterns';

export default function LoginPage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [params] = useSearchParams();
  const returnUrl = params.get('returnUrl');
  const [captchaToken, setCaptchaToken] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if (!user) return;

    returnUrl ? navigate(returnUrl) : navigate('/');
  }, [user]);

  const handleCaptchaChange = (value) => {
    setCaptchaToken(value);
  };

  const submit = async ({ email, password }) => {
    if (!captchaToken) {
      setAlertMessage('Please complete the CAPTCHA');
      setShowAlert(true);
      return;
    }
  
    try {
      await login(email, password, captchaToken);
    } catch (error) {
      const errorMessage = error.response?.data || 'An unexpected error occurred';
      setAlertMessage(errorMessage);
      setShowAlert(true);
    }
  };
  

  return (
    <div className={classes.container}>
      {showAlert && (
        <div className={classes.alertOverlay} onClick={() => setShowAlert(false)}>
          <div className={classes.alertBox}>
            <div className={classes.alertContent}>
              <p>{alertMessage}</p>
              <button className={classes.alertButton} onClick={() => setShowAlert(false)}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={classes.details}>
        <Title title="Login" />
        <form onSubmit={handleSubmit(submit)} noValidate>
          <Input
            type="email"
            label="Email"
            {...register('email', {
              required: true,
              pattern: EMAIL,
            })}
            error={errors.email}
          />

          <Input
            type="password"
            label="Password"
            {...register('password', {
              required: true,
            })}
            error={errors.password}
          />

          <div className={classes.captchaContainer}>
            <ReCAPTCHA
              sitekey="6LcxjHsqAAAAALJ2f3fg4OjNJ5Dg6wn6ruj2kGrD" // Replace with your actual site key
              onChange={handleCaptchaChange}
            />
          </div>

          <Button type="submit" text="Login" />

          <div className={classes.register}>
            New user? &nbsp;
            <Link to={`/register${returnUrl ? '?returnUrl=' + returnUrl : ''}`}>
              Register here!
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}