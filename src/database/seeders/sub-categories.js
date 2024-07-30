// executable file to seed products data into the database
// Usage: node src/database/seeders/products.js -i

require("dotenv").config();
const fs = require("fs");
const colors = require("colors");

const subCategories = JSON.parse(
  fs.readFileSync(`${process.cwd()}/src/database/factories/sub-categories.json`)
);

console.log(`${process.cwd()}/src/database/factories/sub-categories.json`);

const dbConnection = require(`../../utils/setup-connection-db`);

dbConnection();

const SubCategory = require("../../models/SubCategory");

const insertData = async () => {
  try {
    await SubCategory.insertMany(subCategories);
    console.log(colors.green.inverse("Data inserted successfully"));
    process.exit(1);
  } catch (error) {
    console.log(error);
  }
};

const destroyData = async () => {
  try {
    await SubCategory.deleteMany();
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
