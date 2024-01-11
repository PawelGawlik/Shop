const APP = {};
APP.search = document.getElementsByClassName("search")[0];
APP.display = document.getElementsByClassName("display")[0];

// metody do pracy z wyszukiwarką przedmiotów

APP.searchMethods = {
    input: APP.search.getElementsByTagName("input")[0],
    button: APP.search.getElementsByTagName("button")[0],
    pname: {},
    pcreate: function (content, parent) {                        // tworzenie elementów p
        const p = document.createElement("p");
        p.innerText = content;
        parent.appendChild(p);
    },
    divcreate: function () {
        const div = document.createElement("div");
        APP.display.appendChild(div);
        return div;
    },
    searching: function () {
        const self = this;
        fetch("/search", {
            method: "post",
            body: self.input.value,
            headers: { "Content-Type": "text/plain" }
        }).then((res) => {
            return res.json();
        }).then((data) => {
            this.input.value = "";
            data.forEach(el => {
                const img = document.createElement("img");
                img.setAttribute("src", el.source + `,${el.picture.toString("base64")}`);
                const div = this.divcreate();
                div.appendChild(img);
                this.pcreate(el.id, div);
                this.pcreate(el.name, div);
                this.pcreate(el.price, div);
                this.pcreate(el.desc, div);
            });
        })
    }
}

APP.searchMethods.button.addEventListener("click", APP.searchMethods.searching.bind(APP.searchMethods));