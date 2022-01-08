const exclude = [
    "religious",
    "political",
    "sexist",
    "racist",
    "explicit",
    "nothing",
];
const types = [
    "Any",
    "Miscellaneous",
    "Dark",
    "Coding",
    "Halloween",
    "Pun",
    "Christmas",
];
let categories;
if (window.localStorage.categories == null) {
    window.localStorage.setItem("categories", "nsfw");
}
categories = window.localStorage.getItem("categories");

let type;
if (window.localStorage.type == null) {
    window.localStorage.setItem("type", "Any");
}
type = window.localStorage.getItem("type");

function toTitleCase(string) {
    return string.charAt(0).toUpperCase() + string.substr(1).toLowerCase();
}

async function getJoke() {
    const response = await fetch(`/joke/${type}/${categories}`);
    const { ids, values, flags } = await response.json();

    makeHTMLChanges();

    if (values[1] == undefined || values[2] == undefined) {
        getJoke();
    } else {
        for (let i in ids) {
            document.getElementById(ids[i]).textContent = values[i];
        }
    }

    for (let i in flags) {
        document.getElementById("flags").innerHTML += `
        <p id="flag${i}" class="type flag">${toTitleCase(flags[i])}</p>`;
    }

    for (let i in exclude) {
        const categoriesElem = document.getElementById(exclude[i]);

        categoriesElem.addEventListener("click", (event) => {
            updateCategories(exclude[i]);
        });
    }

    for (let i in types) {
        const typeElem = document.getElementById(types[i]);

        typeElem.addEventListener("click", (event) => {
            updateType(types[i]);
        });
    }
}

function makeHTMLChanges() {
    let form = `
    <h1>Preferences Form</h1><br>
    <span  class="center" style="margin-bottom: 1rem;">Edit form according to your joke Preference and hit refresh. Preferences stay valid only on this window.<br><br></span>
    <span>Exclude:</span>
    <div class="table-grid">`;
    for (let i in exclude) {
        form += `
        <label id="${exclude[i]}">
            <input
                type="checkbox"
            />
        ${toTitleCase(exclude[i])}
        </label>
        `;
    }

    form += `
    </div>
    <span>Type: </span>
    <div class="table-grid">`;
    for (let i in types) {
        form += `
        <label id="${types[i]}">
            <input
                type="radio"
                name="types"
            />
        ${types[i]}
        </label>`;
    }
    form = "<form>" + form + "</div></form>";

    document.querySelector("main").innerHTML = `
    <h1>Random Joke Generator</h1>
    <p>Hit Refresh to load a Joke</p>
    <div class="group">
        <div id="flags">
            <p id="category" class="type"></p>
        </div>
        <p id="setup" class="joke"></p>
        <p id="delivery" class="joke"></p>
        <p id="author" style="width: 100%; text-align: right"> - Unknown</p>
    </div>`;
    document.querySelector("footer").innerHTML = form;
}

function updateCategories(ex) {
    if (ex == "nothing") {
        categories = "nsfw";
        window.localStorage.setItem("categories", "nsfw");
    } else {
        categories += `%2C${ex}`;
        window.localStorage.setItem("categories", categories);
    }
}

function updateType(param) {
    type = param;
    window.localStorage.setItem("type", param);
    console.log(type);
}

getJoke();
