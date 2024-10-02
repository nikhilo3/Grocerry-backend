const express = require('express');
const { PORT } = require('./config');
const { databaseConnection } = require('./database');
const expressApp = require('./express-app');
// const { CreateChannel } = require('./utils');

const StartServer = async() => {

    const app = express();
    
    await databaseConnection();
    
    // const channel = await CreateChannel();

    await expressApp(app);

    app.listen(PORT, () => {
        console.log(`listening to port ${PORT}`);
    })
    .on('error', (err) => {
        console.log(err);
        process.exit();
    })
}

StartServer();









// const express = require('express');
// const { PORT } = require('./config'); // This is usually ignored in serverless
// const { databaseConnection } = require('./database');
// const expressApp = require('./express-app');

// const app = express();

// const StartServer = async () => {
//     await databaseConnection();
//     await expressApp(app);
// };

// // Call StartServer only for local development
// if (require.main === module) {
//     StartServer();
    
//     // For local testing
//     app.listen(PORT, () => {
//         console.log(`Listening to port ${PORT}`);
//     }).on('error', (err) => {
//         console.log(err);
//         process.exit();
//     });
// }

// // Export the app for Vercel
// module.exports = app;