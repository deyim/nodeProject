module.exports = ()=>{
    const express = require('express');
    const route = express.Router();
    const controller = require('../controllers/2_stores_controller');

    //products - index
    route.get('/products', controller.productsIndex)
        .post('/products', controller.productsStatusChange);
    //products - add
    route.get('/products/add', controller.productsAdd)
        .post('/products/add', controller.productsCreate);
    route.get('/products/getproductcode', controller.productsGetProductcode);
    route.get('/products/updatenation', controller.productsUpdateNation);
    route.get('/products/updatecity', controller.productsUpdateCity);
    route.get('/products/deletecity', controller.deleteCity)
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
     route.get('/messages/received', controller.messagesReceivedIndex);
     route.get('/messages/sent', controller.messagesSentIndex);
     route.post('/messages', controller.messagesMultipleDelete);
     //messages - show
     
     route.get('/messages/:message_id', controller.findMessage, controller.messagesShow);
     route.get('/messages/receivers/:message_id/', controller.findMessage, controller.messagesShowReceivers);
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
 
    //notice - index
    route.get('/notices', controller.noticesIndex)
        .post('/notices', controller.noticesMultipleDelete);

    route.get('/notices/add', controller.noticesAdd)
        .post('/notices/add', controller.noticeCreate);
    //notice - show
    route.get('/notices/:notice_id', controller.findNotice, controller.noticesShow);
    //notice - update
    route.post('/notices/:notice_id', controller.findNotice, controller.noticesUpdate);
    //notice - delete
    route.get('/notices/:notice_id/delete', controller.findNotice, controller.noticesDelete);
    

    return route;
}