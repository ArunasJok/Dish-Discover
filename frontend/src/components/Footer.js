
import React from 'react';
import './Footer.css'; 

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Dish Discover. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
