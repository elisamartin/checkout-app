import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProductPage from './ProductPage';
import CheckoutPage from './CheckoutPage';
import PaymentSuccess from './PaymentSuccess';
import PaymentFailure from './PaymentFailure';
import './index.css';

function App() {
  return (
    <Router>
      <div>
      <nav className="navbar">
          <div className="logo">
            <Link to="/">
              <img src="./logo.png" alt="Logo" />
            </Link>
          </div>
          <div className="nav-buttons">
            <Link to="/" className="nav-button">The White T</Link>
          </div>
        </nav>
        <Routes>
          <Route exact path="/checkout" element={<CheckoutPage />} />
          <Route path="/" element={<ProductPage />} />
          <Route path="/checkout/success" element={<PaymentSuccess />} />
          <Route path="/checkout/failure" element={<PaymentFailure />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
