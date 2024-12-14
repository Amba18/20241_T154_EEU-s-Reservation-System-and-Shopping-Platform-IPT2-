import { Router } from 'express';
import handler from 'express-async-handler';
import auth from '../middleware/auth.mid.js';
import { BAD_REQUEST, UNAUTHORIZED } from '../constants/httpStatus.js';
import { OrderModel } from '../models/order.model.js';
import { OrderStatus } from '../constants/orderStatus.js';
import { UserModel } from '../models/user.model.js';
import { sendEmailReceipt } from '../helpers/mail.helper.js';

const router = Router();
router.use(auth);

// Create a new order
router.post(
  '/create',
  handler(async (req, res) => {
    const order = req.body;

    if (order.items.length <= 0) {
      return res.status(BAD_REQUEST).send('Cart Is Empty!');
    }

    // Delete any existing new orders for the user
    await OrderModel.deleteOne({
      
      user: req.user.id,
      status: OrderStatus.NEW,
    });

    const newOrder = new OrderModel({ ...order, user: req.user.id,email: order.email, });
    await newOrder.save();
    res.send(newOrder);
  })
);

// Update order payment and optionally set status
router.put(
  '/pay',
  handler(async (req, res) => {
    const { paymentId, status, orderId } = req.body;

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(BAD_REQUEST).send('Order Not Found!');
    }

    if (paymentId) {
      order.paymentId = paymentId;
    }

    if (status) {
      order.status = status;
    }

    await order.save();

    if (status === OrderStatus.RECEIVED) {
      sendEmailReceipt(order); // Send email receipt for received orders
    }

    res.send(order);
  })
);

// Update order status to RECEIVED
router.put(
  '/markAsReceived/:orderId',
  handler(async (req, res) => {
    const { orderId } = req.params;

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(BAD_REQUEST).send('Order Not Found!');
    }

    order.status = OrderStatus.RECEIVED;
    await order.save();

    sendEmailReceipt(order); // Send email receipt for received orders
    res.send(order);
  })
);

// Track an order by ID
router.get(
  '/track/:orderId',
  handler(async (req, res) => {
    const { orderId } = req.params;
    const user = await UserModel.findById(req.user.id);

    const filter = {
      _id: orderId,
    };

    if (!user.isAdmin) {
      filter.user = user._id;
    }

    const order = await OrderModel.findOne(filter);

    if (!order) {
      return res.status(UNAUTHORIZED).send('Order Not Found or Unauthorized');
    }
Lis
    res.send(order);
  })
);

// Get a new order for the current user
router.get(
  '/newOrderForCurrentUser',
  handler(async (req, res) => {
    const order = await getNewOrderForCurrentUser(req);
    if (order) {
      res.send(order);
    } else {
      res.status(BAD_REQUEST).send('No new order found');
    }
  })
);

// Get all order statuses
router.get('/allstatus', (req, res) => {
  const allStatus = Object.values(OrderStatus);
  res.send(allStatus);
});

// Get orders by status or all orders
router.get(
  '/:status?',
  handler(async (req, res) => {
    const status = req.params.status;
    const user = await UserModel.findById(req.user.id);
    const filter = {};

    if (!user.isAdmin) {
      filter.user = user._id;
    }
    if (status) {
      filter.status = status;
    }

    const orders = await OrderModel.find(filter).sort('-createdAt');
    res.send(orders);
  })
);

// Helper to fetch a new order for the current user
const getNewOrderForCurrentUser = async (req) =>
  await OrderModel.findOne({
    user: req.user.id,
    status: OrderStatus.NEW,
  }).populate('user');

export default router;
