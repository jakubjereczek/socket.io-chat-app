const jwt = require('jsonwebtoken');

// function authoricate(req, res, next) {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (token === null)
//         return res.status(401).json({
//             message: "Authorization error (token is null)",
//         })

//     jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err, user) => {
//         if (err)
//             return res.status(401).json({
//                 message: "Authorization error (token is invalid)",
//             })
//         req.user = user;
//         next();
//     })

// }


function authoricateSocket(socket, next) {
    const token = socket.handshake.query.token;
    const refreshToken = socket.handshake.query.refreshToken;
    console.log('token ' + token);
    console.log('refreshToken ' + refreshToken);

    if (token === null && refreshToken === null)
        return next(new Error("Authorizations tockens are null"))

    jwt.verify(token, process.env.JWT_SECRET_TOKEN, async (err, user) => {
        // tutaj generownowanie
        if (err) {
            // token jest niepoprawny, ale refresh token sie zgadza to dopuszczamy i regerenujemy nowy 
            try {
                await jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET)

                const accessToken = jwt.sign({ _id: doc._id, name: doc.name }, process.env.JWT_SECRET_TOKEN, { expiresIn: 86400 });
                // ??
                socket.decoded = accessToken;
                next();
            } catch {
                return next(new Error("Authorization error (token and refreshToken is invalid)"))
            }
        }
        socket.decoded = user;
        next();
    })

}



module.exports = authoricateSocket;