var assert = require("assert");
var progress = require("../js/progress.js");

assert.strictEqual(progress.computePercent(0, 0), null);
assert.strictEqual(progress.computePercent(100, 40), 60);
assert.strictEqual(progress.computePercent(10, 15), 0);
assert.strictEqual(progress.activeStep(null, ""), 0);
assert.strictEqual(progress.activeStep(20, ""), 1);
assert.strictEqual(progress.activeStep(70, ""), 2);
assert.strictEqual(progress.activeStep(95, ""), 3);
assert.strictEqual(progress.activeStep(10, "Starting Lua..."), 3);
assert.strictEqual(progress.baseName("materials/models/crate.vmt"), "crate.vmt");
assert.strictEqual(progress.toSteam2("76561197960287930"), "STEAM_0:0:11101");
assert.strictEqual(progress.toSteam2("not-an-id"), "not-an-id");
assert.strictEqual(progress.parseSchemaVersion('Schema.version = "1.4.2"'), "1.4.2");
assert.strictEqual(progress.parseSchemaVersion("Schema.version = '0.9'"), "0.9");
assert.strictEqual(progress.parseSchemaVersion("Schema.name = \"SEOW\"\nSchema.version = 2"), "2");
assert.strictEqual(progress.parseSchemaVersion("Schema.name = \"SEOW\""), "");

console.log("progress tests passed");
