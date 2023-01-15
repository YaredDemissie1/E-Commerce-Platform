import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const cartItems = useSelector(state => state.cart.items);
  const user = useSelector(state => state.user.currentUser);

  return (
    <nav>
      <div className="nav-wrapper">
        <Link to="/" className="brand-logo">E-Shop</Link>
        <ul className="right">
          <li><Link to="/products">Products</Link></li>
          <li><Link to="/cart">Cart ({cartItems.length})</Link></li>
          {user ? (
            <li><Link to="/profile">Profile</Link></li>
          ) : (
            <li><Link to="/login">Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 