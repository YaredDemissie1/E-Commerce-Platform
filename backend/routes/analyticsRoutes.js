const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', [auth, admin], async (req, res) => {
  try {
    // Get total sales and orders
    const orders = await Order.find({ isPaid: true });
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Get total customers
    const totalCustomers = await User.countDocuments({ isAdmin: false });

    // Get sales by date for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesByDate = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: "$totalPrice" }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          date: "$_id",
          total: 1,
          _id: 0
        }
      }
    ]);

    res.json({
      stats: {
        totalSales,
        totalOrders,
        averageOrderValue,
        totalCustomers
      },
      salesByDate
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 