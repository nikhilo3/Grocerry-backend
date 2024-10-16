const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const amqplib = require("amqplib");
const {
  APP_SECRET,
} = require("../config"); 
// const { SHOPPING_BINDING_KEY } = require("../../../customer/src/config");

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
    return await jwt.sign(payload, 'mysecret', { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports.ValidateSignature = async (req) => {
  try {
    const signature = req.get("Authorization");
    console.log("sig",signature.split(" ")[1]);
    const payload = await jwt.verify(signature.split(" ")[1], 'mysecret');
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

module.exports.PublishCustomerEvent = async (payload) => {
  axios.post("http://localhost:8000/customer/app-events/", {
    payload,
  });

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

// // publish messages
// module.exports.PublishMessage = async (channel, binding_key, message) => {
//   try {
//     channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
//     console.log("Sent: ", message);
//   } catch (error) {
//     throw error;
//   }
// };

// // subscribe messages
// module.exports.SubscribeMessage = async (channel, service) => {
//   const appQueue = await channel.assertQueue(QUEUE_NAME);
//   channel.bindQueue(appQueue.queue, EXCHANGE_NAME, SHOPPING_BINDING_KEY);
//   channel.consume(appQueue.queue, (data) => {
//     console.log("received data in shopping service");
//     console.log(data.content.toString());
//     service.SubscribeEvents(data.content.toString());
//     channel.ack(data);
//   });
// };
