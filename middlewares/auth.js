const { getUser } = require('../services/auth');

function checkForAuthentication(req, res, next){
    const tokenCookie = req.cookies?.authorization;
    req.user = null;
    if(!tokenCookie)
        return next();

    const token = tokenCookie;
    const user = getUser(token);

    req.user = user;
    next();
}

function restrictTo(role = []){
    return function(req, res, next){
        if(!req.user)
            return res.redirect('/login');
        
        if(role.length && !role.includes(req.user.role))
            return res.end("Unauthorized");

        next();
    }
}

module.exports = { 
    checkForAuthentication,
    restrictTo,
 };
