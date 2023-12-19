const mongoose  = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

main()
.then(()=>{
    console.log("connected to server");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initdb = async()=>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj, owner: "657f83539c50b31a91084e44"}));
    await Listing.insertMany(initdata.data);
    console.log("data was initialised");
};

initdb();
