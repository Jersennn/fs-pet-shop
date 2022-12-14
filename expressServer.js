import express from "express";
import { readFile, writeFile } from "node:fs/promises";

const server = express();
const port = 3001;

server.use(express.json());


//accept get request to /pets, return pets and 200
server.get("/pets", (req, res, next) => {
    readFile("./pets.json", "utf-8").then((text) => {
        res.setHeader("Content-type", "application/json");
        res.json(JSON.parse(text));
    })
})

server.get("/pets/:index", (req, res, next) => {
    const index = req.params.index;
    readFile("./pets.json", "utf-8").then((text) => {
        const pets = JSON.parse(text);
        const selectedPet = pets[index];
        if (index >= 0 && index <= pets.length -1) {
            res.json(selectedPet);
        } else {
            res.set("Content-type", "text/plain");
            res.status(404);
            res.end("Not Found");
        }
    })
    .catch((error) => {
        console.log("got error");
        next(error);
    });
});

server.post("/pets", (req, res, next) => {
    const pet = req.body;
    const reqFields = [`name`, `kind`, `age`];
    const errors = [];
    for (let field of reqFields) {
        if (pet[field] === undefined) {
            errors.push(`Missing pet ${field}`);
        }
    }
    if (pet.age && typeof pet.age !== "number") {
        errors.push("Pet age must be a number");
    }
    if (errors.length > 0) {
        res.status(422);
        res.send(error.join(" "));

    } else {
        readFile("./pets.json", "utf-8").then((text) => {
            const pets = JSON.parse(text);
            pets.push(pet);
            return writeFile("./pets.json", JSON.stringify(pets));
        }).then(() => {
            res.status(201);
            res.send(JSON.stringify(pet));
        }).catch(error => {
            next(error);
        })
    }
})


server.use((req, res) => {
    res.status(500);
    res.send("Internal Server Error");
})


server.listen(port, () => {
    console.log(`listening on ${port}`)
});