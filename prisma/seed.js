const { mainSeeder } = require("./seeders/main");

mainSeeder()
	.then(() => {
		console.log("Main seeder  ran successfully");
	})
	.catch((e) => {
		console.error(e);
		process.exit(1);
	});
