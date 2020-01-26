import "reflect-metadata";
import {createConnection, AdvancedConsoleLogger} from "typeorm";
import {User} from "./entity/User";
import express = require('express');
import { Deliverer } from "./entity/Deliverer";
import { Merchant } from "./entity/Merchant";

const app = express()
const port = 3000


// createConnection().then(async connection => {

//     console.log("Inserting a new user into the database...");
//     const user = new User();
//     user.firstName = "Timber";
//     user.lastName = "Saw";
//     user.age = 25;
//     await connection.manager.save(user);
//     console.log("Saved a new user with id: " + user.id);



//     const deliverer = new Deliverer();
//     deliverer.firstName = "Raye";
//     deliverer.lastName = "Grady";
//     // deliverer.phoneNumber = 2554356666;
//     await connection.manager.save(deliverer);


//     const merchant = new Merchant();
//     merchant.firstName = "Laurent";
//     merchant.lastName = "Breleur";
//     // deliverer.phoneNumber = 2554356666;
//     await connection.manager.save( merchant);


//     console.log("Loading users from the database...");
//     const users = await connection.manager.find(User);
//     const deliverers = await connection.manager.find(Deliverer);
//     const merchants = await connection.manager.find(Merchant);
//     console.log("Loaded users: ", users);
//     console.log("Loaded deliverers: ",deliverers);
//     console.log("Loaded merchant: ",merchants);

//     console.log("Here you can setup and run express/koa/any other framework.");

// }).catch(error => console.log(error));


app.get('/', (req, res) => res.send('Hello World!'))
app.get('/deliverers', (req, res) => {

    createConnection().then(async (connection) => {
        const deliverers = await connection.manager.find(Deliverer);
        res.send(deliverers);

    });
    
  
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

