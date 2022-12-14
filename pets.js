// #!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";

const subcommand = process.argv[2];
if (subcommand === "read") {
    const petIndex = process.argv[3];
    readFile("./pets.json", "utf-8").then((text) => {
        const pets = JSON.parse(text);
        if (petIndex === undefined) {
            console.log(pets);
        } else if (petIndex > pets.length-1) {
            console.error("Usage: node pets.js read INDEX")
        } else if (petIndex < 0) {
            console.error("Usage: node pets.js read INDEX");
            process.exit(1);
        } else {
            console.log(pets[petIndex]);
        }
    });
} else if (subcommand === "create") {
    const age = Number(process.argv[3]);
    const kind = process.argv[4];
    const name = process.argv[5];
    const pet = {age, kind, name};
    readFile("./pets.json", "utf-8").then((text) => {
        const pets = JSON.parse(text);
        pets.push(pet);
        return writeFile("./pets.json", JSON.stringify(pets));
        }).catch((err) => {
            console.log("error");
        });
} else if (subcommand === "update") {
    const age = process.argv[3]
    const kind = process.argv[4];
    const name = process.argv[5];
    const pet = {age, kind, name}
    readFile("./pets.json", "utf-8").then((text) => {
        const pets = JSON.parse(text);
        return writeFile("./pets.json", )
    })

} else if (subcommand === "destroy") {
    const petIndex = process.argv[3];
    readFile("./pets.json", "utf-8").then((text) => {
        const pets = JSON.parse(text);
        pets.splice();
        console.log(pets);
    })
} else {
    console.error("Usage: node pets.js [read | create | update | destroy]");
    process.exit(1);
}


