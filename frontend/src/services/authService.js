import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // Update to point to your local API

export const sendVerificationCode = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/send-verification-code`, { email });
    return response.data; // Expected { success: true, code: "123456" }
  } catch (error) {
    console.error('Error sending verification code:', error);
    return { success: false, message: error.response?.data?.message || 'Failed to send verification code' };
  }
};

export const verifyCode = async (email, code) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/verify-code`, { email, code });
    return response.data; // Expected { success: true }
  } catch (error) {
    console.error('Error verifying code:', error);
    return { success: false, message: error.response?.data?.message || 'Failed to verify code' };
  }
};
