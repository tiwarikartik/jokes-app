const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
const express = require("express");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Starting Server at Port ${port}`));
app.use(express.static("public"));

app.get("/joke/:type/:blacklistTags", async (request, response) => {
    const data = await fetch(
        `https://${process.env.API_URL}/joke/${request.params.type}?type=twopart&format=json&blacklistFlags=${request.params.blacklistTags}`,
        {
            method: "GET",
            headers: {
                "x-rapidapi-host": process.env.API_URL,
                "x-rapidapi-key": process.env.API_KEY,
            },
        }
    )
        .then((response) => response.json())
        .then((data) => {
            let arr = [];
            let category = data.category;

            switch (category) {
                case "Misc":
                    category = "Miscellaneous";
                    break;
                case "Programming":
                    category = "Coding";
                    break;
                case "Spooky":
                    category = "Halloween";
                    break;
            }

            for (let property in data.flags) {
                let value = data.flags[property];
                if (value == true) arr.push(property.toString());
            }
            return {
                ids: ["category", "setup", "delivery"],
                values: [category, data.setup, data.delivery],
                flags: arr,
            };
        })
        .catch((err) => {
            console.error(err);
        });

    response.json(data);
});
