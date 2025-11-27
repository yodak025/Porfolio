class Pair {
    constructor(ico, dsp) {
        this.icon = document.getElementById(ico);
        this.display = document.getElementById(dsp);
    }
}

function createPairs(ico, dsp) {
    let pairs = [];
    for (let i = 0; i < ico.length; i++) {
        pairs.push(new Pair(ico[i], dsp[i]));
    }
    return pairs;
}

class Display {
    constructor(pairs) {
        this.pairs = pairs;
        this.displays = [];
        //this.displays.append(defaultDisplay);
        pairs.forEach(element => {
            this.displays.push(element.display);
        });

        this.pairs.forEach(pair => {
            pair.icon.onclick = () => {
                this.displays.forEach(display => {
                    if (pair.display == display) {
                        display.style.display = "flex";
                    }else{
                        display.style.display = "none";
                    }
                });
            }
        });
    }
}