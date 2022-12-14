import http from "node:http";
import {readFile, writeFile} from "node:fs/promises"
const petRegExp = /^\/pets\/(.*)$/;

const server = http.createServer((req, res) => {
    const {method, url} = req;
    if (method === "POST" && url === "/pets") {
        let body = "";
        req.on("data",(chunk) => {
            body += chunk;
        });
        req.on("end", () => {
            readFile("./pets.json", "utf-8")
            .then((text) => {
                const pets = JSON.parse(text);
                pets.push(JSON.parse(body));
                return writeFile("./pets.json", JSON.stringify(pets));
                })
                .then(() => {
                    res.end("Pet Created");
                })
        });
    } else if (method === "GET" && url === "/pets") {
        readFile("./pets.json", "utf-8").then((text) => {
        res.setHeader("Content-type", "application/json");
        res.end(text);
        });
    } else if (method === "GET" && petRegExp.test(url)) {
        const matches = petRegExp.exec(url);
        const index = matches[1];
        readFile("./pets.json", "utf-8").then((text) => {
            const pets = JSON.parse(text);
            const selectedPet = pets[index];
            if (index >= 0 && index <= pets.length-1) {
                res.setHeader("Content-type", "application/json");
                res.end(JSON.stringify(selectedPet));
            } else {
                res.setHeader("Content-type", "text/plain");
                res.statusCode = 404;
                res.end("Not Found");
            }
        });
    } else {
        res.end("Unknown Request")
    } 
});

server.listen(3000, () => {
    console.log(`Server running on port 3000`);
});
