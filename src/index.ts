import "reflect-metadata";
import {createConnection, AdvancedConsoleLogger} from "typeorm";
import {User} from "./entity/User";
import express = require('express');
import { Deliverer } from "./entity/Deliverer";

const app = express()
const port = 3000


createConnection().then(async connection => {

    console.log("Inserting a new user into the database...");
    const user = new User();
    user.firstName = "Timber";
    user.lastName = "Saw";
    user.age = 25;
    await connection.manager.save(user);
    console.log("Saved a new user with id: " + user.id);



    // const deliverer = new Deliverer();
    // deliverer.firstName = "Raye";
    // deliverer.lastName = "Grady";
    // deliverer.phoneNumber = 2554356666;
    // await connection.manager.save(deliverer);


    console.log("Loading users from the database...");
    const users = await connection.manager.find(User);
    const deliverers = await connection.manager.find(Deliverer);
    console.log("Loaded users: ", users);

    console.log("Here you can setup and run express/koa/any other framework.");

}).catch(error => console.log(error));


app.get('/', (req, res) => res.send('Hello World!'))
app.get('/deliverers', (req, res) => {
    const deliverers = [];

    deliverers.push({
        id:2,
        lastName:'Toto',
        firstName: 'Tata',
        phonenumber:'333-333-3333'
    });

    deliverers.push({
        id:4,
        lastName:'maman',
        firstName: 'mom',
        phonenumber:'333-333-3333',
    });

    res.send(deliverers);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

