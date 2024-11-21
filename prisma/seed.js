const { BusinessSeeder } = require("./seeders/business");
const { mainSeeder } = require("./seeders/main");

mainSeeder()
  .then((data) => {
    console.log("Main seeder  ran successfully");
    const businessSeeder = new BusinessSeeder(data.workspace, data.sellerBotId);
    businessSeeder
      .seed()
      .then("Business seeder  ran successfully")
      .catch((e) => {
        console.error(e);
        process.exit(1);
      });
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
