import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../../components/Input/Input';
import Title from '../../components/Title/Title';
import classes from './registerPage.module.css';
import Button from '../../components/Button/Button';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ReCAPTCHA from 'react-google-recaptcha';
import { GoogleOAuthProvider} from '@react-oauth/google';

export default function RegisterPage() {
  const auth = useAuth();
  const { user, register } = auth;
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const returnUrl = params.get('returnUrl');
  const [captchaToken, setCaptchaToken] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const {
    handleSubmit,
    register: formRegister,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!user) return;
  
    returnUrl ? navigate(returnUrl) : navigate('/');
  }, [user, navigate, returnUrl]);
  

  const handleCaptchaChange = (value) => {
    setCaptchaToken(value);
  };

  const submit = async (data) => {
    if (!captchaToken) {
      setAlertMessage('Please complete the CAPTCHA');
      setShowAlert(true);
      return;
    }

    await register({ ...data, captchaToken });
  };

  const password = watch('password');


  const passwordValidation = {
    required: 'Password is required',
    validate: {
      hasLength: (value) => 
        value.length >= 8 || 'Password must be at least 8 characters long',
      hasUpperCase: (value) => 
        /[A-Z]/.test(value) || 'Password must contain at least one uppercase letter',
      hasLowerCase: (value) => 
        /[a-z]/.test(value) || 'Password must contain at least one lowercase letter',
      hasNumber: (value) => 
        /[0-9]/.test(value) || 'Password must contain at least one number',
      hasSpecialChar: (value) => 
        /[!@#$%^&*(),.?":{}|<>]/.test(value) || 'Password must contain at least one special character',
    }
  };

  return (
    <GoogleOAuthProvider clientId="88168214477-9ast8v319dtkumlimsbvb5cu82o63htg.apps.googleusercontent.com">
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
          <Title title="Register" />
          <form onSubmit={handleSubmit(submit)} noValidate>
            <Input
              type="text"
              label="Name"
              {...formRegister('name', {
                required: 'Name is required',
                minLength: 5,
              })}
              error={errors.name}
            />

            <Input
              type="email"
              label="Email"
              {...formRegister('email', {
                required: 'Email is required',
                validate: {
                  isEmail: (value) =>
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value) || 'Invalid email address',
                },
              })}
              error={errors.email}
            />

            <Input
              type="password"
              label="Password"
              {...formRegister('password', passwordValidation)}
              error={errors.password}
            />

            <Input
              type="password"
              label="Confirm Password"
              {...formRegister('confirmPassword', {
                required: 'Confirm Password is required',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
              error={errors.confirmPassword}
            />

            <Input
              type="text"
              label="Address"
              {...formRegister('address', {
                required: 'Address is required',
              })}
              error={errors.address}
            />

            <div className={classes.captchaContainer}>
              <ReCAPTCHA
                sitekey="6LcxjHsqAAAAALJ2f3fg4OjNJ5Dg6wn6ruj2kGrD" // Replace this with your actual site key
                onChange={handleCaptchaChange}
              />
            </div>

            <Button type="submit" text="Register" />

            <div className={classes.login}>
              Already have an account? &nbsp;
              <Link to={`/login${returnUrl ? '?returnUrl=' + returnUrl : ''}`}>
                Login here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}