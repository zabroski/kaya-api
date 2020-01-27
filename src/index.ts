import "reflect-metadata";
import {createConnection, getRepository} from "typeorm";
import {User} from "./entity/User";
import express = require('express');
import { Deliverer } from "./entity/Deliverer";
import { Merchant } from "./entity/Merchant";
import { Delivery } from "./entity/Delivery";
import { Address } from "./entity/Address";

const app = express()
const port = 3000

app.use(express.json());
app.use(express.urlencoded())


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
});

app.post('/create-delivery/:delivererId', (req, res) => {
    createConnection().then(async (connection) => {
        const deliverer = await getRepository(Deliverer).findOne(req.params.delivererId); 
        console.log(req.body)
        console.log(req.body.addresses[0].street);
        const merchant = await getRepository(Merchant).findOne(1);
     

        if(deliverer === undefined) {
            await connection.close();
            res.send("deliverer not found", 404);
        } else {
            const delivery = new Delivery();
            delivery.deliverer = deliverer;
            delivery.merchant = merchant;

            const pickUpAddress = new Address();
            pickUpAddress.type = req.body.addresses[0].type;
            pickUpAddress.street = req.body.addresses[0].street;
            pickUpAddress.zipCode = req.body.addresses[0].zipCode;
            pickUpAddress.country = req.body.addresses[0].country;
            pickUpAddress.city =  req.body.addresses[0].city;


            // pickUpAddress.type = "pickup";
            // pickUpAddress.street = "235 w 116th";
            // pickUpAddress.zipCode = "10026";
            // pickUpAddress.country = "United State of America";
            // pickUpAddress.city = "new york";
            // pickUpAddress.delivery = delivery;

            const droppOffAddress = new Address();
            droppOffAddress.type = "dropOff";
            droppOffAddress.street = "300 central park";
            droppOffAddress.zipCode = "10021";
            droppOffAddress.country = "United State of America";
            droppOffAddress.city = "new york";
            console.log(req.params)
            // droppOffAddress.delivery = delivery;


            // pickUpAddress.delivery = delivery
            delivery.addresses = [pickUpAddress, droppOffAddress];
            // delivery.addresses.push(droppOffAddress);



            // await connection.manager.save(droppOffAddress);
            // await connection.manager.save(pickUpAddress);
            await connection.manager.save(delivery);
            await connection.close();

            res.send(`New delivery with id ${delivery.id} will be delivered by deliverer ${delivery.deliverer.firstName}`)
        }


    })



    // res.send(req.params.delivererId)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

