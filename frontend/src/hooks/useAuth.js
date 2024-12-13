import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import * as userService from '../services/userService';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(userService.getUser());

  const login = async (email, password, captchaToken) => {
    const loggedInUser = await userService.login(email, password, captchaToken);
    setUser(loggedInUser);
  };

  const register = async (registerData) => {
    const registeredUser = await userService.register(registerData);
    setUser(registeredUser);
  };

  const loginWithGoogle = async (tokenId) => {
    const loggedInUser = await userService.loginWithGoogle(tokenId);
    setUser(loggedInUser);
  };

  const logout = () => {
    userService.logout();
    setUser(null);
  };

  const updateProfile = async (user) => {
    const updatedUser = await userService.updateProfile(user);
    toast.success('Profile Update Was Successful');
    if (updatedUser) setUser(updatedUser);
  };

  const changePassword = async (passwords) => {
    await userService.changePassword(passwords);
    logout();
    toast.success('Password Changed Successfully, Please Login Again!');
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, loginWithGoogle, updateProfile, changePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};