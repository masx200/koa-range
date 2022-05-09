var fs = require("fs");
var route = require("koa-route");
var range = require("../");
var Koa = require("koa");

// const assert = require("assert");
var app = new Koa();
exports.app = app;
var rawbody = new Buffer(1024);
app.use(range);
app.use(
    route.get("/", async function (ctx) {
        ctx.body = rawbody;
    })
);
app.use(
    route.post("/", async function (ctx) {
        ctx.status = 200;
    })
);
app.use(
    route.get("/json", async function (ctx) {
        ctx.body = { foo: "bar" };
    })
);
app.use(
    route.get("/string", async function (ctx) {
        ctx.body = "koa-range";
    })
);
app.use(
    route.get("/stream", async function (ctx) {
        ctx.body = fs.createReadStream("./README.md");
    })
);
app.use(
    route.get("/empty", async function (ctx) {
        ctx.body = undefined;
        ctx.status = 304;
    })
);
app.on("error", function (err) {
    throw err;
});
