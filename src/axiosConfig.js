// src/axiosConfig.js

import axios from 'axios';

// Cấu hình axios interceptor
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            // Xóa thông tin xác thực từ local storage
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('fullname');

            // Chuyển hướng người dùng về trang login
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axios;
