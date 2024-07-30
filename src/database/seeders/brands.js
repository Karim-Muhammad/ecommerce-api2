// executable file to seed products data into the database
// Usage: node src/database/seeders/products.js -i

require("dotenv").config();
const fs = require("fs");
const colors = require("colors");

const brands = JSON.parse(
  fs.readFileSync(`${process.cwd()}/src/database/factories/brands.json`)
);

console.log(`${process.cwd()}/src/database/factories/brands.json`);

const dbConnection = require(`../../utils/setup-connection-db`);

dbConnection();

const Brand = require("../../models/Brand");

const insertData = async () => {
  try {
    await Brand.insertMany(brands);
    console.log(colors.green.inverse("Data inserted successfully"));
    process.exit(1);
  } catch (error) {
    console.log(error);
  }
};

const destroyData = async () => {
  try {
    await Brand.deleteMany();
    console.log(colors.red.inverse("Data destroyed successfully"));
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
