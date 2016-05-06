const mongoose = require('mongoose');
const schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const address = {
    building: String, 
    coord: [Number], 
    street: String, 
    zipcode: String
};

const grade = {
    date: Date, 
    grade: String, 
    score: Number
};

const restaurant = {
    address: address,
    borough: String,
    cuisine: String,
    grades: [grade],
    name: String,
    restaurant_id: String
};
const restaurantSchema = new schema(restaurant);
const restaurantModel = mongoose.model('restaurant', restaurantSchema);

const url = 'mongodb://localhost:27017/test';
mongoose.connect(url);
const db = mongoose.connection;

let connected = false;

db.on('error', console.error.bind(console, 'connection error: '));
// db.once('open', () => {
//     console.log('connect success!');
//     connected = true;
//     restaurantModel.findOne({'address.zipcode': "10462"}, "address")
//     .exec()
//     .then((data) => console.log(data));
// });

function findOne(cond, sel) {
    console.log(cond, sel);
    cond = cond ? cond : {};
    if(!connected){
        return new Promise((resolve, reject) => {
            db.once('open', () => {
                console.log('connect success!');
                connected = true;
                restaurantModel.findOne(cond, sel)
                .exec()
                .then((data) => {
                    console.log(data);
                    resolve(data);
                }, (e) => reject(e));
            });
        });
    } else {
        return new Promise((resolve, reject) => {
            restaurantModel.findOne(cond, sel)
            .exec((err, data) => {
                if(err || !data){
                    console.error('findOne catch error: ', err);
                    return reject(err? err : new Error("no data find!"));
                }
                console.log(data);
                return resolve(data);
            })
            // .then((data) => {
            //     console.log(data[sel]);
            //     resolve(data[sel]);
            // }, (e) => {
            //     console.error('findOne catch error: ', e);
            //     reject(e);
            // });
        });
    }
}

module.exports.findOne = findOne;