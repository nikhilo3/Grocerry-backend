const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/customer", proxy("https://grocerry-backend.vercel.app"));
app.use("/shopping", proxy("https://grocerry-backend-shopping.vercel.app"));
app.use("/product", proxy("https://grocerry-backend-2sir.vercel.app")); // products

app.listen(8000, () => {
  console.log("Gateway is Listening to Port 8000");
});