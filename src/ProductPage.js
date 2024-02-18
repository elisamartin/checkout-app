import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import tshirtImg from './tshirt.jpg'

class ProductPage extends React.Component {
  render() {
    return (
      <div className="container">
        <h2>The White T</h2>
        <div className="product">
          <img src={tshirtImg} alt="Product" />
          <div className="product-details">
            <p>Introducing our classic cotton tee designed for everyday comfort and style. Featuring a timeless crew neck design and a range of vibrant colors to choose from, it's the perfect staple piece for any wardrobe. Elevate your everyday look with our must-have essential.</p>
            <h3>24.99€</h3>
            <Link to="/checkout" className="checkout-link">Buy Now</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductPage;
