import axios from 'axios';

axios.interceptors.request.use(
  (req) => {
    try {
      // Safely retrieve the 'user' item from local storage
      const user = localStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user); // Parse the JSON string
        const token = parsedUser.token; // Extract the token
        if (token) {
          req.headers['access_token'] = token; // Add the token to the request header
        }
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
    }
    return req;
  },
  (error) => {
    console.error('Error in request interceptor:', error);
    return Promise.reject(error); // Forward the error for handling
  }
);
