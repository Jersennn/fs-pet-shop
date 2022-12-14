import express from "express";
import { readFile, writeFile } from "node:fs/promises";
import postgres from "postgres";

// connect to database
const sql = postgres({database: "petshop"});

const server = express();
const port = 3001;

server.use(express.json());

// accept get request to /pets, return pets and 200
server.get("/pets", (req, res) => {
    sql`SELECT * FROM pets`.then(pets => {
        res.json(pets);
        res.status(200);
    })
    // readFile("./pets.json", "utf-8").then((text) => {
    //     res.setHeader("Content-type", "application/json");
    //     res.json(JSON.parse(text));
    // })
})

// USING A GET REQUEST FOR SPECIFIC PET
server.get("/pets/:id", (req, res, next) => {
    const id = req.params.id;
    sql`SELECT * FROM pets WHERE id = ${id}`.then((result) => {
        if (result.length === 0) {
            res.set("Content-type", "text/plain");
            res.status(404);
            res.send("Not Found");
        } else {
            res.json(result[0]);
        }
    }).catch(next)
});

// USING A POST REQUEST
server.post("/pets", (req, res, next) => {
    const pet = req.body;
    const reqFields = ["age", "kind", "name"];
    const errors = [];
    for (let field of reqFields) {
        if (pet[field] === undefined) {
            errors.push(`Missing pet ${field}`);
        }
    }
    if (pet.age && typeof pet.age !== "number") {
        errors.push("Pet age must be a number");
    }
    const {age, kind, name} = pet;

    if (errors.length > 0) {
        res.status(422);
        res.send(error.join(" "));

    } else {
        sql`INSERT INTO pets (age, kind, name) VALUES (${age}, ${kind}, ${name})RETURNING *`.then((result) => {
            res.status(201);
            res.json(result[0]);
        })
    }
});

// USING A PATCH REQUEST
server.patch("/pets/:id", (req, res, next) => {
    const id = req.params.id;
    const pet = req.body;
    const {age, kind, name} = pet;
    sql`
    UPDATE pets
    SET ${sql(req.body)}
    WHERE id = ${id} RETURNING *
    `.then((result) => {
        res.send(result[0]);
    });
});

// USING A DELETE REQUEST
server.delete("/pets/:index", (req, res) => {
    const {index} = req.params;
    sql`DELETE FROM pets WHERE id = ${index} RETURNING *`.then((result) => {
        res.send(result[0]);
    })
})


server.use((req, res) => {
    res.status(500);
    res.send("Internal Server Error");
})


server.listen(port, () => {
    console.log(`listening on ${port}`)
});