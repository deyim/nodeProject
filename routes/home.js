exports.homepage = function(req,res){
    res.render('home', {user:req.user});
}