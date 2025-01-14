import React from 'react';

const Login = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: '22rem' }}>
        <h1 className="text-center mb-4">Login</h1>
        <form>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Your email address"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Your password"
              required
            />
          </div>
          <button
            type="submit"
            className="btn w-100"
            style={{ backgroundColor: '#27485D', color: '#ffffff' }}
          >
            Login
          </button>
        </form>
        <div className="text-center mt-3">
          Don’t have an account? <a href="/Signup" className="text-decoration-none">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
