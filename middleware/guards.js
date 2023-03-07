const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const db = require("../model/helper");

/*get token from header and check if registered user*/
function _getToken(req) {
    if ( !('authorization' in req.headers) ) {
        return '';
    }

    let authHeader = req.headers['authorization'];
    let [str, token] = authHeader.split(' ');

    return (str === 'Bearer') ? token : '';
}

function ensureUserLoggedIn(req, res, next) {
    let token = _getToken(req);

    try {
        jwt.verify(token, SECRET_KEY);
        next();
    } catch (err) {
        res.status(401).send({ error: 'Unauthorized.'});
    }
}

async function ensureIsAdmin(req, res, next) {
    let token = _getToken(req);
    
    try { 
        let payload = jwt.verify(token, SECRET_KEY);
        // console.log(payload);
        /* select isAdmin for userid in payload, if for that id isAdmin in db is true/1, next()
        alternatively, check if isAdmin in DB is true where payload === userID */
        let result = await db(`SELECT isAdmin FROM users WHERE id = ${payload.userId};`);
        // console.log(result.data[0].isAdmin);
        if (result.data[0].isAdmin === 1) {
            next();
        } else {
            res.status(403).send({ error: 'Forbidden.' });
        }
    } catch (err) {
        res.status(401).send({ error: 'Unauthorized.'})
    }
}

module.exports = {
    ensureUserLoggedIn,
    ensureIsAdmin
};