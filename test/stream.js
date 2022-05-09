const { app } = require("./app");
const { createServer } = require("http");
const { fetch } = require("undici");
const assert = require("assert");
const { rawFileBuffer } = require("./rawFileBuffer");
describe("range requests with stream", function () {
    it("should return 206 with partial content", async function () {
        const server = createServer(app.callback());
        const port = await new Promise((resolve, reject) => {
            server.on("error", reject);
            server.listen(() => {
                // console.log(server.address());
                resolve(server.address().port);
            });
        });
        const response = await fetch(`http://localhost:${port}/stream`, {
            headers: { range: "bytes=0-99" },
        });
        // console.log(response);
        // assert.equal(response.status, 206);
        assert.equal(response.status, 206);
        assert.equal(response.headers.get("Accept-Ranges"), "bytes");
        assert(response.headers.get("Content-Range").startsWith("bytes 0-99/"));
        const text = await response.text();
        assert.equal(text, rawFileBuffer.slice(0, 100));
        server.close();
        // request(app.listen())
        //     .get("/stream")
        //     .set("range", "bytes=0-99")
        //     // .expect("Transfer-Encoding", "chunked")
        //     .expect("Accept-Ranges", "bytes")
        //     .expect("Content-Range", "bytes 0-99/*")
        //     .expect(206)
        //     .end(function (err, res) {
        //         should.not.exist(err);
        //         res.text.should.equal(rawFileBuffer.slice(0, 100));
        //         done();
        //     });
    });

    it("should return 206 with open ended range", async function () {
        const server = createServer(app.callback());
        const port = await new Promise((resolve, reject) => {
            server.on("error", reject);
            server.listen(() => {
                // console.log(server.address());
                resolve(server.address().port);
            });
        });
        const response = await fetch(`http://localhost:${port}/stream`, {
            headers: { range: "bytes=0-" },
        });
        assert.equal(response.status, 206);
        const text = await response.text();
        assert(text.startsWith(rawFileBuffer.slice(0, 300)));
        server.close();
        // request(app.listen())
        //     .get("/stream")
        //     .set("range", "bytes=0-")
        //     // .expect("Transfer-Encoding", "chunked")
        //     .expect(206)
        //     .end(function (err, res) {
        //         // assert(!err);
        //         should.not.exist(err);
        //         res.text.should.startWith(rawFileBuffer.slice(0, 300));
        //         done();
        //     });
    });
});
