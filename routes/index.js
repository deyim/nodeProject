exports.index = function(req,res){
    if(req.user){
        res.render('hihi', {user:req.user})
    }
    else{
        res.render('login');
    }

}

