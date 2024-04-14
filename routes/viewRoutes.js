const express = require('express');
const viewsController = require('../controllers/viewController');
const authcontroller = require('../controllers/authController');
const bookingcontroller = require('../controllers/bookingController');

const router = express.Router({ mergeParams: true });

router.get(
  '/',
  bookingcontroller.createBookingCheckout,
  authcontroller.isLoggedIn,
  viewsController.getOverview
);
router.get('/tour/:slug', authcontroller.isLoggedIn, viewsController.getTour);
router.get('/tour/:slug', authcontroller.isLoggedIn, viewsController.getTour);
router.get('/login', authcontroller.isLoggedIn, viewsController.getLoginFrom);
router.get('/me', authcontroller.protect, viewsController.getAccount);
router.get('/my-tours', authcontroller.protect, viewsController.getMyTours);

router.post(
  '/submit-user-data',
  authcontroller.protect,
  viewsController.updateUserData
);

module.exports = router;
