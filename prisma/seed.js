const { BusinessSeeder } = require("./seeders/business");
const { mainSeeder } = require("./seeders/main");

mainSeeder()
  .then((workspace) => {
    console.log("Main seeder  ran successfully");
    const businessSeeder = new BusinessSeeder(workspace.workspace);
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
