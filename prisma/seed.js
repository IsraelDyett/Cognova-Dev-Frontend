const { businessSeeder } = require("./seeders/business");
const { mainSeeder } = require("./seeders/main");

mainSeeder()
  .then("Main seeder  ran successfully")
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

// businessSeeder()
//   .then("Business seeder  ran successfully")
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   });
