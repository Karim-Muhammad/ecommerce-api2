// executable file to seed products data into the database
// Usage: node src/database/seeders/products.js -i

require("dotenv").config();
const fs = require("fs");
const colors = require("colors");

const products = JSON.parse(
  fs.readFileSync(`${process.cwd()}/src/database/factories/products.json`)
);

console.log(`${process.cwd()}/src/database/factories/products.json`);

const dbConnection = require(`../../utils/setup-connection-db`);

dbConnection();

const Product = require("../../models/Product");

const insertData = async () => {
  try {
    await Product.insertMany(products);
    console.log("Data inserted successfully", colors.green.inverse);
    process.exit(1);
  } catch (error) {
    console.log(error);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log("Data destroyed successfully".colors.red.inverse);
    process.exit(1);
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "-i") {
  insertData();
} else if (process.argv[2] === "-d") {
  destroyData();
}
