const { BusinessSeeder } = require("./seeders/business");
const { mainSeeder } = require("./seeders/main");

// mainSeeder()
//   .then("Main seeder  ran successfully")
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   });
const businessSeeder = new BusinessSeeder()
businessSeeder.seed()
  .then("Business seeder  ran successfully")
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
