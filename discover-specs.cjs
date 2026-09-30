const { readdirSync } = require("node:fs");

for (const file of readdirSync("tests")) {
	if (file.endsWith(".spec.ts")) {
		console.log(`tests/${file}`);
	}
}