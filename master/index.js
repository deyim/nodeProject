const express = require('express');
const app = express();

const testRoutes = require('./routes/test_routes')();
app.use('/', testRoutes);
 
app.listen(4020, () => {
    console.log('Master listening on port 4020');
});


module.exports = app;