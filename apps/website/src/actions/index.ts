import {
  collectSubscription,
  createPaymentLink,
  getProducts,
  validPayment,
} from "./payments";

export const server = {
  getProducts,
  createPaymentLink,
  validPayment,
  collectSubscription,
};
