// auth.js

// Function to check if user is authenticated
export const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
};

// Function to store token in localStorage
export const setToken = (token) => {
    localStorage.setItem('token', token);
};

// Function to retrieve token from localStorage
export const getToken = () => {
    return localStorage.getItem('token');
};

// Function to remove token from localStorage
export const removeToken = () => {
    localStorage.removeItem('token');
};

export const setUsername = (username) => {
    localStorage.setItem('username', username);
};

export const getUsername = () => {
    return localStorage.getItem('username');
};

export const removeUsername = () => {
    localStorage.removeItem('username');
};

export const setFullname = (fullname) => {
    localStorage.setItem('fullname', fullname);
};

export const getFullname = () => {
    return localStorage.getItem('fullname');
};

export const removeFullname = () => {
    localStorage.removeItem('fullname');
};

// Function to handle login (including storing token)
export const login = (token, username, fullname) => {
    setToken(token);
    // alert(username, fullname);
    setUsername(username)
    setFullname(fullname)
};

// Function to handle logout (including removing token)
export const logout = () => {
    removeToken();
    removeUsername();
    removeFullname();
};
