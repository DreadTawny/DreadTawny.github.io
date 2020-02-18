class Printer {
    constructor() {
        this.avgPage = 100 / document.getElementById("avgPage").value
        this.printTime = document.getElementById("printTimer").value 
        this.pricePage = document.getElementById("pricePage").value 
        this.priceInk = document.getElementById("priceInk").value 
        document.getElementById("stop").addEventListener("click",()=> clearInterval(this.timer))
        if(this.checkValues()) alert("Wrong values")
        else this.timer = this.print()
    }
    pageCount = 500
    inkLeft = 100
    avgPage
    printTime
    pricePage
    priceInk
    inkUsed = 0
    pageUsed = 0
    actualPricePage = {
        priceE: 0,
        priceZl: 0,
        price$:0
    }
    actualPriceInk = {
        priceE: 0,
        priceZl: 0,
        price$: 0
    }
    print() {
        let timer = setInterval(() => {
            this.changeBackground()
            this.pageCount--
            this.inkLeft-=this.avgPage
            document.getElementById("pageLeft").innerHTML = this.pageCount
            document.getElementById("inkLeft").innerHTML = this.inkLeft.toFixed(2) + "%"
            if(this.pageCount<=0){
                this.pageCount = 500
                this.pageUsed++
                this.countCost()
            }
            if(this.inkLeft<=0){
                this.inkLeft = 100
                this.inkUsed++
                this.countCost()
            }
        },this.printTime/10)
        return timer
    }
    checkValues() {
        let pattern = /(^\d*\.\d{0,2}[e,z,$]$)|(^\d*[e,z,$]$)/
        if(!pattern.test(this.pricePage) || !pattern.test(this.priceInk)) return true
        else {
            let currencyCheckPage = this.pricePage.slice(this.pricePage.length-1, this.pricePage.length)
            this.pricePage = Number(this.pricePage.slice(0, this.pricePage.length-1))
            let currencyCheckInk = this.priceInk.slice(this.priceInk.length-1, this.priceInk.length)
            this.priceInk = Number(this.priceInk.slice(0, this.priceInk.length-1))
            let objectCheck = [{
                currency: currencyCheckPage,
                price: this.actualPricePage,
                input:  this.pricePage 
            }, {
                currency: currencyCheckInk,
                price: this.actualPriceInk,
                input: this.priceInk
            }]
            for(let i=0; i<2;i++){
                switch(objectCheck[i].currency){
                    case "e":
                        objectCheck[i].price.priceZl = objectCheck[i].input * 4.25
                        objectCheck[i].price.priceE = objectCheck[i].input
                        objectCheck[i].price.price$ = objectCheck[i].input * 1.08
                        break;
                    case "z":
                        objectCheck[i].price.priceZl = objectCheck[i].input
                        objectCheck[i].price.priceE = objectCheck[i].input *  0.24
                        objectCheck[i].price.price$ = objectCheck[i].input * 0.26
                        break;
                    case "$":
                        objectCheck[i].price.priceZl = objectCheck[i].input * 3.92
                        objectCheck[i].price.priceE = objectCheck[i].input * 0.92
                        objectCheck[i].price.price$ = objectCheck[i].input 
                        break;
                }
            }
        }
    }   
    countCost() {
        document.getElementById("costEuro").innerHTML = (this.pageUsed * this.actualPricePage.priceE + this.inkUsed * this.actualPriceInk.priceE).toFixed(2) + "Euro"
        document.getElementById("costZl").innerHTML = (this.pageUsed * this.actualPricePage.priceZl + this.inkUsed * this.actualPriceInk.priceZl).toFixed(2) + "Zł"
        document.getElementById("cost$").innerHTML = (this.pageUsed * this.actualPricePage.price$ + this.inkUsed * this.actualPriceInk.price$).toFixed(2) + "$"
    }
    changeBackground() {
        document.body.style.backgroundColor = "rgb("+(this.pageCount+this.inkLeft*5)/4+",255,255)"
    }
}
console.log(`sdsadasdasd ${121342132123}`)