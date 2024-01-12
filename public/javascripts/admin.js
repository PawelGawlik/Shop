const APP = {};
APP.search = document.getElementsByClassName("search")[0];
APP.display = document.getElementsByClassName("display")[0];

// metody do pracy z wyszukiwarką przedmiotów

APP.searchMethods = {
    input: APP.search.getElementsByTagName("input")[0],
    button: APP.search.getElementsByClassName("find")[0],
    alls: APP.search.getElementsByClassName("all"),
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
    buttoncreate: function (parent) {
        const button = document.createElement("button");
        button.innerText = "Usuń";
        parent.appendChild(button);
        return button;
    },
    removediv: function () {                                  // usuwa wyświetlone przedmioty
        [...APP.display.children].forEach((el) => {
            el.remove();
        })
    },
    delfun: function (param1, param2) {
        confirm("Usuń przedmiot");                             // funkcja usuwająca przedmiot z bazy
        fetch("/", {
            method: "post",
            body: param1,
            headers: { "Content-Type": "text/plain" }
        }).then(() => {
            param2.remove();
        })
    },
    loophandle: function (el) {
        const img = document.createElement("img");
        img.setAttribute("src", el.source + `,${el.picture.toString("base64")}`);
        const div = this.divcreate();
        div.appendChild(img);
        this.pcreate(el.id, div);
        this.pcreate(el.name, div);
        this.pcreate(el.price, div);
        this.pcreate(el.desc, div);
        const button = this.buttoncreate(div);
        button.onclick = this.delfun.bind(this, el.id, div);
    },
    all: function (param) {
        this.removediv();
        fetch("/all", {
            method: "post",
            body: param,
            headers: { "Content-Type": "text/plain" }
        }).then((res) => {
            return res.json();;
        }).then((data) => {
            data.forEach(this.loophandle.bind(this));
        })
    },
    delorshow: function (param) {
        if (param === "del") {
            let message = prompt('Wpisz frazę: "usuń wszystko"');
            if (message.toLowerCase() === "usuń wszystko") {
                this.all(param);
            }
            else {
                return;
            }
        } else {
            this.all(param);
        }
    },
    searching: function () {
        this.removediv();
        const self = this;
        fetch("/search", {
            method: "post",
            body: self.input.value,
            headers: { "Content-Type": "text/plain" }
        }).then((res) => {
            return res.json();
        }).then((data) => {
            this.input.value = "";
            data.forEach(this.loophandle.bind(this));
        })
    }
}

APP.searchMethods.button.addEventListener("click", APP.searchMethods.searching.bind(APP.searchMethods));
APP.searchMethods.alls[0].addEventListener("click", () => {
    APP.searchMethods.delorshow("show");
})
APP.searchMethods.alls[1].addEventListener("click", () => {
    APP.searchMethods.delorshow("del");
})