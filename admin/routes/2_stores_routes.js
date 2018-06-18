module.exports = ()=>{
    const express = require('express');
    const route = express.Router();
    const controller = require('../controllers/2_stores_controller');

    //products - index
    route.get('/products', controller.productsIndex)
        .post('/products', controller.productsStatusChange);
     //products - add
     route.get('/products/add', controller.productsAdd)
     .post('/products/create', controller.productsCreate);
        //products - show
    route.get('/products/:product_id', controller.findProduct, controller.productsShow)
        .post('/products/:product_id/', controller.findProduct, controller.productsUpdate);
   
    //products - delete
    route.get('/products/:id/delete', controller.findProduct, controller.productsDelete);


    //posts - index
    route.get('/posts', controller.postsIndex)
        .post('/posts', controller.postsMultipleDelete)
    //posts - show
    route.get('/posts/:post_id', controller.findPost, controller.postsShow)
        .post('/posts/:post_id/', controller.findPost, controller.postsUpdate);
    //posts - delete
    route.get('/posts/:post_id/delete', controller.findPost, controller.postsDelete);


     //messages - index
     route.get('/messages', controller.messagesIndex)
        .post('/messages', controller.messagesMultipleDelete);
     //messages - show
     route.get('/messages/:message_id', controller.findMessage, controller.messagesShow);
     //messages - delete
     route.get('/messages/:messagae_id/delete', controller.findMessage, controller.messagesDelete);


    //comments - index
    route.get('/comments', controller.commentsIndex)
        .post('/comments', controller.commentsMultipleDelete);
    //comments - show
    route.get('/comments/:comment_id', controller.findComment, controller.commentsShow);
    //comments - update
    
    //comments - delete
    route.get('/comments/:comment_id/delete', controller.findComment, controller.commentsDelete);

    //comments - index
    route.get('/notices', controller.noticesIndex)
        .post('/notices', controller.noticesMultipleDelete);
    //comments - show
    route.get('/notices/:notice_id', controller.findNotice, controller.noticesShow);
    //comments - update
    route.post('/notices/:notice_id', controller.findNotice, controller.noticesUpdate);
    //comments - delete
    route.get('/notices/:notice_id/delete', controller.findNotice, controller.noticesDelete);
    

    return route;
}