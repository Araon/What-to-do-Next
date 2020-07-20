const express = require('express');
const { urlencoded } = require('express');
const path = require('path');
const pageRouter = require('./routes/pages')
const app = express();

// for body parser
app.use(express.urlencoded( { extended: false}));


// Serving the static files
app.use(express.static('public'));

// routers
app.use('/', pageRouter);

// error : 404
app.use((req, res, next) => {
    var err = new Error('Page not found');
    err.status = 404;
    next(err);
})

// Handling error
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(err.message);
});





// setting up the serveer
app.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
});



module.exports = app;