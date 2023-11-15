// const jwt = require("jsonwebtoken");
// var { promisify } = require("util");

// async function auth(req, res, next) {
//     if (!req.headers.authorization) {
//         return res.status(401).json({ message: 'please log in' });
//     } try {
//         var decoded = await promisify(jwt.verify)(req.headers.authorization, process.env.SECRET)
//         console.log(decoded);
//     } catch (err) {
//         res.status(401).json({ message: 'not authorized' });
//     }
//     next();
// }
// module.exports = auth;

//    "start": "SET SECRET=654Dubizzle&&nodemon index"  old start
const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Please Login First' });
    }

    try {
        const decoded = jwt.verify(token, '654Dubizzle');
        console.log(decoded);
        req.id = decoded.userId;
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Not authorized asasn' });
    }
};


//router.use(authMiddleware.protect); to protect any route just put this line