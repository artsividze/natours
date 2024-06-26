/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51P5Lu6KCRlY0qZEyvKeixykij0bLKv6PvZ2luaX8Rm6wlEWziLNcQcVAqbOSXLJv7BRZSD1NQ2wMgsISJdJEey8N00aPb6zBzi'
);
export const bookTour = async tourId => {
  try {
    //1)Get chekout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);
    //2) create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
