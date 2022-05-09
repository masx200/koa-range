var request = require("supertest");
var should = require("should");

const { app } = require("./app");
describe("normal requests", function () {
    it("should return 200 without range", function (done) {
        const server = app.listen();
        request(server)
            .get("/")
            .expect("Accept-Ranges", "bytes")
            .expect(200)
            .end(() => {
                done();
                server.close();
            });
    });

    it("should return 200 when method not GET", function (done) {
        const server = app.listen();
        request(server)
            .post("/")
            .set("range", "bytes=0-300")
            .expect("Accept-Ranges", "bytes")
            .expect(200)
            .end(() => {
                done();
                server.close();
            });
    });
});

describe("range requests", function () {
    it("should return 206 with partial content", function (done) {
        const server = app.listen();
        request(server)
            .get("/")
            .set("range", "bytes=0-299")
            .expect("Content-Length", "300")
            .expect("Accept-Ranges", "bytes")
            .expect("Content-Range", "bytes 0-299/1024")
            .expect(206)
            .end(() => {
                done();
                server.close();
            });
    });

    it("should return 200 when using oversized end", function (done) {
        const server = app.listen();
        request(server)
            .get("/")
            .set("range", "bytes=0-1024") // 1025 bytes in total > 1024
            .expect("Content-Length", "1024")
            .expect("Accept-Ranges", "bytes")
            .expect("Content-Range", "bytes 0-1023/1024")
            .expect(200)
            .end(() => {
                done();
                server.close();
            });
    });

    it("should return 206 with partial content when using oversized end", function (done) {
        const server = app.listen();
        request(server)
            .get("/")
            .set("range", "bytes=1000-1024")
            .expect("Content-Length", "24")
            .expect("Accept-Ranges", "bytes")
            .expect("Content-Range", "bytes 1000-1023/1024")
            .expect(206)
            .end(() => {
                done();
                server.close();
            });
    });

    it("should return 400 with PUT", function (done) {
        const server = app.listen();
        request(server)
            .put("/")
            .set("range", "bytes=0-299")
            .expect("Accept-Ranges", "bytes")
            .expect(400)
            .end(() => {
                done();
                server.close();
            });
    });

    it("should return 416 with invalid range", function (done) {
        const server = app.listen();
        request(server)
            .get("/")
            .set("range", "bytes=400-300")
            .expect("Accept-Ranges", "bytes")
            .expect(416)
            .end(() => {
                done();
                server.close();
            });
    });

    it("should return 416 with invalid range", function (done) {
        const server = app.listen();
        request(server)
            .get("/")
            .set("range", "bytes=x-300")
            .expect("Accept-Ranges", "bytes")
            .expect(416)
            .end(() => {
                done();
                server.close();
            });
    });

    it("should return 416 with invalid range", function (done) {
        const server = app.listen();
        request(server)
            .get("/")
            .set("range", "bytes=400-x")
            .expect("Accept-Ranges", "bytes")
            .expect(416)
            .end(() => {
                done();
                server.close();
            });
    });

    it("should return 416 with invalid range", function (done) {
        const server = app.listen();
        request(server)
            .get("/")
            .set("range", "bytes")
            .expect("Accept-Ranges", "bytes")
            .expect(416)
            .end(() => {
                done();
                server.close();
            });
    });
});

describe("range requests with string", function () {
    it("should return 206 with partial content", function (done) {
        const server = app.listen();
        request(server)
            .get("/string")
            .set("range", "bytes=0-5")
            .expect("Accept-Ranges", "bytes")
            .expect("Content-Range", "bytes 0-5/9")
            .expect("Content-Length", "6")
            .expect(206)
            .end(function (err, res) {
                should.not.exist(err);
                res.text.should.equal("koa-ra");
                done();
                server.close();
            });
    });

    it("should return 206 with open ended range", function (done) {
        const server = app.listen();
        request(server)
            .get("/string")
            .set("range", "bytes=3-")
            .expect("Accept-Ranges", "bytes")
            .expect("Content-Range", "bytes 3-8/9")
            .expect("Content-Length", "6")
            .expect(206)
            .end(function (err, res) {
                should.not.exist(err);
                res.text.should.equal("-range");
                done();
                server.close();
            });
    });
});

describe("range requests with empty body", function () {
    it("should return 304", function (done) {
        const server = app.listen();
        request(server)
            .get("/empty")
            .set("range", "bytes=1-")
            .expect(304)
            .end(function (err, res) {
                should.not.exist(err);
                done();
                server.close();
            });
    });
});
