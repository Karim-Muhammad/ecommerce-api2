const fs = require("fs");

const products = JSON.parse(
  fs.readFile(`${process.cwd()}/factories/products.json`, "utf-8")
);

require("dotenv").config();

const dbConnection = require(`../../utils/setup-connection-db`);

dbConnection();

const Product = require("../../models/Product");

const insertData = async () => {
  try {
    await Product.insertMany(products);
    console.log("Data inserted successfully");
    process.exit(1);
  } catch (error) {
    console.log(error);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log("Data destroyed successfully");
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
