const { app } = require("./app");
const { createServer } = require("http");
const { fetch } = require("undici");
const assert = require("assert");
describe("range requests with json", function () {
    it("should return 206 with partial content", async function () {
        const server = createServer(app.callback());
        const port = await new Promise((resolve, reject) => {
            server.on("error", reject);
            server.listen(() => {
                // console.log(server.address());
                resolve(server.address().port);
            });
        });
        const response = await fetch(`http://localhost:${port}/json`, {
            headers: {
                range: "bytes=0-5",
            },
        });
        assert.equal(response.status, 206);
        assert.equal(response.headers.get("Accept-Ranges"), "bytes");
        assert.equal(response.headers.get("Content-Range"), "bytes 0-5/13");
        assert.equal(response.headers.get("Content-Length"), "6");
        const text = await response.text();
        assert.equal(text, '{"foo"');
        server.close();
        // request(app.listen())
        //     .get("/json")
        //     .set("range", "bytes=0-5")
        //     .expect("Accept-Ranges", "bytes")
        //     .expect("Content-Range", "bytes 0-5/13")
        //     .expect("Content-Length", "6")
        //     .expect(206)
        //     .end(function (err, res) {
        //         should.not.exist(err);
        //         res.text.should.equal('{"foo"');
        //         done();
        //     });
    });

    it("should return 206 with single byte range", async function () {
        const server = createServer(app.callback());
        const port = await new Promise((resolve, reject) => {
            server.on("error", reject);
            server.listen(() => {
                // console.log(server.address());
                resolve(server.address().port);
            });
        });
        const response = await fetch(`http://localhost:${port}/json`, {
            headers: {
                range: "bytes=2-2",
            },
        });
        assert.equal(response.status, 206);
        assert.equal(response.headers.get("Accept-Ranges"), "bytes");
        assert.equal(response.headers.get("Content-Range"), "bytes 2-2/13");
        assert.equal(response.headers.get("Content-Length"), "1");
        const text = await response.text();
        assert.equal(text, "f");
        server.close();
        // request(app.listen())
        //     .get("/json")
        //     .set("range", "bytes=2-2")
        //     .expect("Accept-Ranges", "bytes")
        //     .expect("Content-Range", "bytes 2-2/13")
        //     .expect("Content-Length", "1")
        //     .expect(206)
        //     .end(function (err, res) {
        //         should.not.exist(err);
        //         res.text.should.equal("f");
        //         done();
        //     });
    });
});
