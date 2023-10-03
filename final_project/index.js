// index.js è il file principale del progetto, che contiene il codice per avviare il server e definire le rotte
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
    // Ottieni il token dal cookie della sessione
    const token = req.session.token;
        // Verifica il token
        if (token) {
            jwt.verify(token, 'your-secret-key', (err, user) => {
                if (err) {
                    // Il token non è valido
                    res.sendStatus(403);  // Forbidden
                } else {
                    // Il token è valido, salva l'utente nella richiesta e procedi
                    req.user = user;
                    next();
                }
            });
        } else {
            // Non c'è token, l'utente non è autenticato
            res.sendStatus(401);  // Unauthorized
        }
    });

 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
