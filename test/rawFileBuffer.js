var fs = require("fs");

var rawFileBuffer = fs.readFileSync("./README.md") + "";
exports.rawFileBuffer = rawFileBuffer;
