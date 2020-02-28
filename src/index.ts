import "reflect-metadata";
import {createConnection, createQueryBuilder, getRepository, Connection, MongoEntityManager, getConnection} from "typeorm";
// import {User} from "./entity/User";
import express = require('express');
import { Deliverer } from "./entity/Deliverer";
import { Merchant } from "./entity/Merchant";
import { Delivery } from "./entity/Delivery";
import { Address } from "./entity/Address";

import { passport , jwtSign, authorized} from'./auth';

const authRouter = require('./router/authRouter')

const app = express()
const port = 3000
let cors = require('cors')


app.use(express.json());
app.use(express.urlencoded());
app.use(cors());


app.use("/auth", authRouter);
app.use("/app", authorized);
app.use(passport.initialize())

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/deliverers', (req, res) => {

    createConnection().then(async (connection) => {
        const deliverers = await connection.manager.find(Deliverer);
        const deliverer = new Deliverer();
        deliverer.email;
        deliverer.password,
        await connection.close();

        res.send(deliverers);
    });
});




// app.get('/deliveries', (req, res) => {
//     createConnection().then(async (connection) => {
//         const deliveries = await connection.manager.find(Delivery);
//         await connection.close();

//         res.send(deliveries)
//     }) 
// })


app.get('/deliveries', (req, res) => {
    createConnection().then(async (connection) => {
        // const deliveries = await getConnection()
        const deliveries =  await connection
            .getRepository(Delivery)
            .createQueryBuilder("delivery")
            .leftJoinAndSelect("delivery.merchant", "merchant")
            .leftJoinAndSelect("delivery.deliverer", "deliverer")
            .leftJoinAndSelect("delivery.addresses", "addresses")
            .getMany();
        await connection.close();
        res.send(deliveries)
    }) 
});


app.get('/deliveries-history', (req, res) => {
    createConnection().then(async (connection) => {
        const deliveries =  await connection
            .getRepository(Delivery)
            .createQueryBuilder("delivery")
            .leftJoinAndSelect("delivery.merchant", "merchant")
            .leftJoinAndSelect("delivery.deliverer", "deliverer")
            .leftJoinAndSelect("delivery.addresses", "addresses")
            .where("delivery.status = 'done'" )
            .getMany();
        await connection.close();
        res.send(deliveries)
    }) 
});



app.get('/transit-deliveries', (req, res) => {
    createConnection().then(async (connection) => {
        const deliveries =  await connection
            .getRepository(Delivery)
            .createQueryBuilder("delivery")
            .leftJoinAndSelect("delivery.merchant", "merchant")
            .leftJoinAndSelect("delivery.deliverer", "deliverer")
            .leftJoinAndSelect("delivery.addresses", "addresses")
            .addOrderBy("delivery.id", "DESC")
            .where("delivery.status = 'in transit'" )
            .getMany();
        await connection.close();
        res.send(deliveries)
    }) 
})


app.get('/new-deliveries', (req, res) => {
    createConnection().then(async (connection) => {
        const deliveries =  await connection
            .getRepository(Delivery)
            .createQueryBuilder("delivery")
            .leftJoinAndSelect("delivery.merchant", "merchant")
            .leftJoinAndSelect("delivery.deliverer", "deliverer")
            .leftJoinAndSelect("delivery.addresses", "addresses")
            .addOrderBy("delivery.id", "DESC")
            .where("delivery.status = 'new'" )
            .getMany();
        await connection.close();
        res.send(deliveries)
    }) 
})


app.get('/accepted-deliveries', (req, res) => {
    createConnection().then(async (connection) => {
        const deliveries =  await connection
            .getRepository(Delivery)
            .createQueryBuilder("delivery")
            .leftJoinAndSelect("delivery.merchant", "merchant")
            .leftJoinAndSelect("delivery.deliverer", "deliverer")
            .leftJoinAndSelect("delivery.addresses", "addresses")
            .addOrderBy("delivery.id", "DESC")
            .where("delivery.status = 'accepted'" ) //or
            .getMany();
        await connection.close();
        res.send(deliveries)
    }) 
})





app.post('/create-delivery/:delivererId', (req, res) => {
    createConnection().then(async (connection) => {
        const deliverer = await getRepository(Deliverer).findOne(req.params.delivererId); 
        // console.log(req.body)
        // console.log(req.body.addresses[0].street);
        const merchant = await getRepository(Merchant).findOne(1);

        if(deliverer === undefined) {
            await connection.close();
            res.send("deliverer not found", 404);
        } else {
            const delivery = new Delivery();
                delivery.deliverer = deliverer;
                delivery.merchant = merchant;
                delivery.status = "new"
                
            const pickUpAddress = new Address();
                pickUpAddress.type = req.body.addresses[0].type;
                pickUpAddress.street = req.body.addresses[0].street;
                pickUpAddress.zipCode = req.body.addresses[0].zipCode;
                pickUpAddress.country = req.body.addresses[0].country;
                pickUpAddress.city =  req.body.addresses[0].city;

            const droppOffAddress = new Address();
                droppOffAddress.type = req.body.addresses[0].type;
                droppOffAddress.street = req.body.addresses[0].street;
                droppOffAddress.zipCode = req.body.addresses[0].zipCode;
                droppOffAddress.country = req.body.addresses[0].country;
                droppOffAddress.city =  req.body.addresses[0].city;
                console.log(req.params)

                delivery.addresses = [pickUpAddress, droppOffAddress];
            // await connection.manager.save(droppOffAddress);
            // await connection.manager.save(pickUpAddress);
            await connection.manager.save(delivery);
            await connection.close();

            res.send(`New delivery with id ${delivery.id} will be delivered by deliverer ${delivery.deliverer.firstName}`)
        }
    })
})

app.post('/accept-delivery/:deliveryId',(req, res) => {
    createConnection().then(async (connection) => {
    const delivery = await getRepository(Delivery).findOne(req.params.delivererId);
    if (delivery  === undefined) {
        await connection.close();
        res.send("delivery not found", 404)
    } else {
        await connection.manager.update(Delivery, req.params.deliveryId, {status: "accepted"})
        await connection.close();
         res.send(delivery)
    }
    })
});

app.post('/confirm-pickup/:deliveryId',(req, res) => {
    createConnection().then(async (connection) => {
        const delivery = await getRepository(Delivery).findOne(req.params.deliveryId);
        if (delivery === undefined) {
            await connection.close();
            res.send("delivery not found",404)
        } else {
           delivery.status = "in transit";
           await connection.manager.update(Delivery, req.params.deliveryId, {status: "in transit"})
           await connection.close();
           
           res.send(delivery);
        } 
    })

    
})

app.post('/confirm-dropoff/:deliveryId',(req, res) => {
    createConnection().then(async (connection) => {
    const delivery = await getRepository(Delivery).findOne(req.params.delivererId);
    if (delivery  === undefined) {
        await connection.close();
        res.send("delivery not found", 404)
    } else {
        delivery.status = "done";
        // res.send(delivery)
        await connection.manager.update(Delivery, req.params.deliveryId, {status: "done"})
        await connection.close();
         res.send(delivery)

    }
    })
});








app.listen(port, () => console.log(`Example app listening on port ${port}!`))

