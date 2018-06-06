module.exports = ()=>{
    const express = require('express');
    const route = express.Router();
    const controller = require('../controllers/3_stores_controller');

    //products - index
    route.get('/products', controller.productsIndex);
    //products - show
    route.get('/products/:id', controller.findProduct, controller.productsShow);
    //products - update
    route.post('/products/:id/', controller.findProduct, controller.productsUpdate);
    //products - delete
    route.get('/products/:id/delete', controller.findProduct, controller.productsDelete);


    //posts - index
    route.get('/posts', controller.postsIndex);
    //posts - show
    route.get('/posts/:id', controller.findPost, controller.postsShow);
    //posts - update
    route.post('/posts/:id/', controller.findPost, controller.postsUpdate);
    //posts - delete
    route.get('/posts/:id/delete', controller.findPost, controller.postsDelete);


     //messages - index
     route.get('/messages', controller.messagesIndex);
     //messages - show
     route.get('/messages/:id', controller.findMessage, controller.messagesShow);
     //messages - update
     route.post('/messages/:id/', controller.findMessage, controller.messagesUpdate);
     //messages - delete
     route.get('/messages/:id/delete', controller.findMessage, controller.messagesDelete);


    //comments - index
    route.get('/comments', controller.commentsIndex);
    //comments - show
    route.get('/comments/:id', controller.findComment, controller.commentsShow);
    //comments - update
    route.post('/comments/:id/', controller.findComment, controller.commentsUpdate);
    //comments - delete
    route.get('/comments/:id/delete', controller.findComment, controller.commentsDelete);

    //comments - index
    route.get('/notices', controller.noticesIndex);
    //comments - show
    route.get('/notices/:id', controller.findNotice, controller.noticesShow);
    //comments - update
    route.post('/notices/:id/', controller.findNotice, controller.noticesUpdate);
    //comments - delete
    route.get('/notices/:id/delete', controller.findNotice, controller.noticesDelete);
    

    return route;
}