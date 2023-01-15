const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendOrderConfirmation = async (order, userEmail) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Order Confirmation #${order._id}`,
      html: `
        <h1>Thank you for your order!</h1>
        <h2>Order Details:</h2>
        <p>Order ID: ${order._id}</p>
        <p>Total: $${order.totalPrice}</p>
        <h3>Items:</h3>
        ${order.orderItems.map(item => `
          <div>
            <p>${item.name} x ${item.quantity} - $${item.price}</p>
          </div>
        `).join('')}
        <h3>Shipping Address:</h3>
        <p>${order.shippingAddress.address}</p>
        <p>${order.shippingAddress.city}, ${order.shippingAddress.postalCode}</p>
        <p>${order.shippingAddress.country}</p>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = {
  sendOrderConfirmation
}; 