const ShoppingService = require("../services/shopping-service");
const UserAuth = require("./middlewares/auth");
const { SubscribeMessage, PublishMessage } = require("../utils");
const { CUSTOMER_BINDING_KEY } = require("../config");
var jwt = require('jsonwebtoken');

module.exports = (app) => {

  const service = new ShoppingService();
  // SubscribeMessage(channel,service);

  app.get('/', (req, res, next) => {
    return res.json({ message: 'Hello shopping' });
  });

  app.post("/order", async (req, res, next) => {



    // const { _id } = req.user;

    const { products, total, address, status, token } = req.body;

    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InFxQGdtYWlsLmNvbSIsIl9pZCI6IjY3MDZhNjA0MzMzYzgxMDAwMzRkN2Q2MCIsImlhdCI6MTcyOTAwNzQyNywiZXhwIjoxNzMxNTk5NDI3fQ.S2zP9pZpBcx9H2QSjowx3nWa3X0XYdYX2t61v8m3WEE'
    const decode = jwt.verify(token, 'mysecret');
    console.log(decode);
    const _id = decode._id;


    const { data } = await service.PlaceOrder({ _id, products, total, address, status });

    // const payload = await service.GetOrderPayload(_id, data, "CREATE_ORDER");

    // PublishCustomerEvent(payload);
    // PublishMessage(channel,CUSTOMER_BINDING_KEY, JSON.stringify(payload));

    res.status(200).json(data);
  });

  app.get("/orders", UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    const { data } = await service.GetOrders(_id);

    res.status(200).json(data);
  });

  app.put("/cart", UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    const { data } = await service.AddToCart(_id, req.body._id);

    res.status(200).json(data);
  });

  app.delete("/cart/:id", UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    const { data } = await service.AddToCart(_id, req.body._id);

    res.status(200).json(data);
  });

  app.get("/cart", UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    const { data } = await service.GetCart({ _id });

    return res.status(200).json(data);
  });

  //payment
  app.post("/pay", async (req, res, next) => {
    const amount = req.body.total;
    const { data } = await service.CompletePayment({ amount });

    if (data.error) {

      return res.status(500).json({
        message: 'failed payment',
      });
    }

    return res.status(200).json(data);
  });

  app.get("/getAll", async (req, res, next) => {
    const { data } = await service.GetAll();
    if (data.error) {
      return res.status(500).json({
        message: 'failed to get orders',
      });
    }
    return res.status(200).json(data);
  })

  app.get("/whoami", (req, res, next) => {
    return res.status(200).json({ msg: "/shoping : I am Shopping Service" });
  });
};
