const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js"); // Corrected import path

async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust', {
            user: 'root',
            pass: 'example',
            authSource: 'admin',
        });
        console.log("Database is connected");
    } catch (err) {
        console.error("Connection failed:", err);
        process.exit(1);
    }
}

main()
    .then(() => initDB())
    .catch((err) => {
        console.error("Initialization failed:", err);
    });

    async function initDB() {
        try {
            await Listing.deleteMany({});
            console.log("Existing data cleared.");
            initData.data= initData.data.map((obj)=>({...obj, owner: "6791f6c3a3460dc7ffc4c861"}));
            await Listing.insertMany(initData.data);
            console.log("Initial data inserted.");
        } catch (err) {
            console.error("Failed to initialize the database:", err);
        }
    }
    