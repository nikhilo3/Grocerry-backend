const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const amqplib = require("amqplib");
const {
  APP_SECRET,
  QUEUE_NAME,
  EXCHANGE_NAME,
  MSG_QUEUE_URL,
  CUSTOMER_BINDING_KEY,
} = require("../config");

//Utility functions
module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

module.exports.GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

module.exports.ValidatePassword = async (
  enteredPassword,
  savedPassword,
  salt
) => {
  return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
};

module.exports.GenerateSignature = async (payload) => {
  try {
    console.log('enter generate')
    return await jwt.sign(payload, 'mysecret', { expiresIn: "30d" }); 
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports.ValidateSignature = async (req) => {
  console.log(req);
  try {
    const signature = req.get("Authorization");
    console.log("signature" + signature);
    const payload = await jwt.verify(signature.split(" ")[1], 'mysecret');
    console.log(payload);
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports.FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};

/* ---------------------------------------------------------Message Broker -------------------------------------------------------*/

// create a channel
// module.exports.CreateChannel = async () => {
//   try {
//     if (process.env.USE_RABBITMQ !== 'true') {
//       console.log("RabbitMQ connection is disabled.");
//       return null;
//     }

//     const connection = await amqplib.connect(process.env.MSG_QUEUE_URL);
//     const channel = await connection.createChannel();
//     await channel.assertExchange(process.env.EXCHANGE_NAME, "direct", { durable: true });
//     return channel;
//   } catch (error) {
//     console.error("Failed to connect to RabbitMQ:", error.message);
//     return null;
//   }
// };



// subscribe messages
// module.exports.SubscribeMessage = async (channel, service, binding_key) => {
//   if (!channel) {
//     console.log("No RabbitMQ channel available. Skipping message subscription.");
//     return;
//   }
//   const appQueue = await channel.assertQueue(QUEUE_NAME);
//   channel.bindQueue(appQueue.queue, EXCHANGE_NAME, CUSTOMER_BINDING_KEY);
//   channel.consume(appQueue.queue, (data) => {
//     console.log("received data in customer service");
//     console.log(data.content.toString());
//     service.SubscribeEvents(data.content.toString());
//     channel.ack(data);
//   });
// };
