const APP = {};
APP.display = document.getElementsByClassName("display")[0];
APP.div = document.getElementsByTagName("div")[0];

// metody do operowania na divie z produktami

APP.displayMethods = {
    divs: 0,
    maxprice: 0,
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
    loophandle: function (param) {
        const img = document.createElement("img");
        img.setAttribute("src", param.source + `,${param.picture.toString("base64")}`);
        const div = this.divcreate();
        div.appendChild(img);
        this.pcreate(param.id, div);
        this.pcreate(param.name, div);
        this.pcreate(param.price, div);
        this.pcreate(param.desc, div);
    },
    start: async function () {
        await fetch("/items").then((res) => {
            return res.json();
        }).then((data) => {
            this.divs = data.length;
            const priceArr = [...data]
            priceArr.sort((param1, param2) => {
                return Number(param1.price) - Number(param2.price);
            })
            this.maxprice = Number(priceArr[priceArr.length - 1].price);
            data.forEach(this.loophandle.bind(this));
        })
        return {
            divs: this.divs,
            maxprice: this.maxprice
        }
    }
}

// metody do sortowania przedmiotów

APP.sortMethods = {
    inputs: APP.div.getElementsByTagName("input"),
    form: APP.div.getElementsByTagName("form")[0],
    divs: 0,
    maxprice: 0,
    start: function ({ divs, maxprice }) {
        if (!divs) {
            this.inputs[2].value = 0;
        } else {
            this.inputs[2].value = maxprice;
        }
    },
    sort: async function () {
        const queryArr = location.search.split("?")[1].split("&");
        const priceQuery = queryArr[0].split("=");
        const boardQuery = queryArr[1].split("=");
        await fetch("/items").then((res) => {
            return res.json();
        }).then((data) => {
            this.divs = data.length;
            const priceArr = [...data]
            priceArr.sort((param1, param2) => {
                return Number(param1.price) - Number(param2.price);
            })
            this.maxprice = Number(priceArr[priceArr.length - 1].price);
            const filteredArr = data.filter((el) => {
                return Number(el.price) <= boardQuery[1];
            })
            let UpDownArr = filteredArr.sort((param1, param2) => {
                return Number(param1.price) - Number(param2.price);
            })
            if (priceQuery[1] === "down") {
                UpDownArr.reverse();
            }
            UpDownArr.forEach(APP.displayMethods.loophandle.bind(APP.displayMethods));
        })
        return {
            divs: this.divs,
            maxprice: this.maxprice
        }
    }
}
if (location.search === "") {
    APP.displayMethods.start().then((data) => {
        APP.sortMethods.start(data);
    })
} else {
    APP.sortMethods.sort().then((data) => {
        APP.sortMethods.start(data);
    });
}