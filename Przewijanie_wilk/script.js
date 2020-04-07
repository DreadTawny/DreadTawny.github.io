Date.prototype.formatOutput = () => {
    let d = new Date()
    let month = ""
    d.getMonth() +1 < 10 ? month = `0${d.getMonth()+1}` : month = d.getMonth()+1
    return `${d.getDate()}.${month}.${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
}
addEventListener("load", () => {
    let d = new Date()
    let s = new Stoper()
    s.start()
    document.getElementById("header").innerHTML = d.formatOutput()
    const inputFields = document.querySelectorAll("input")
    let h = new Handler(inputFields,s)
    let field
    for(field of inputFields){
        h.checkIfEmpty()  
         field.addEventListener("focusin", () => s.startField())
        field.addEventListener("focusout", event =>{
            h.checkIfEmpty()
            s.stopField()
            document.getElementById(`${event.target.id}Time`).innerHTML = `Czas wypełnienia pola: ${s.y}s. Średnia ilośc znaków na minute: ${((event.target.value.length)*(60/s.y)).toFixed(2)}`
            if(event.target.id=="birthdateForm") h.peselComp(event.target)
            if(event.target.id=="peselForm") {
                h.dateCheck(event.target)
                h.genderCheck(event.target)
            }
        } )
        field.addEventListener("mouseover", event =>  h.styleChangeOnOver(event.target))
    }
    const gender = document.getElementById("genderForm")
    gender.addEventListener("focusout", () =>{
     h.checkIfEmptyGender("repeat")
     h.genderCheck(document.getElementById("peselForm"))
    })
    gender.addEventListener("mouseover", event => h.styleChangeOnOver(gender))
})
addEventListener("scroll", () => {
    let max = document.body.scrollHeight - innerHeight
    let percent = (pageYOffset/max) * 100
    document.querySelector("#scroll").style.height = `${percent}%`
    document.querySelector("#scroll").style.backgroundColor = `rgb(${Math.floor(percent)*2},${Math.floor(percent)},100)`
    document.getElementById("scrollStatus").style.color = `rgb(${Math.floor(percent)*2},${percent},100)`
    document.getElementById("scrollStatus").innerHTML = `${percent.toFixed(2)}%`
})
class Stoper {
    start() {
        this.timer = setInterval(()=>this.x+=1,1000)
        console.log(this.x)
    }
    stop() {
        clearInterval(this.timer)
    }
    startField() {
        this._y = 0
        this.timerField = setInterval(()=>this._y+=1,100)
    }
    stopField() {
        clearInterval(this.timerField)
    }
    get y() {
        return this._y/10
    }
    timer
    timerField
    _y = 0
    x = 0
}
class Handler {
    constructor(fieldList,s) {
        this.fieldList = fieldList
        this.status = 0
        this.stoper = s 
    }
    clearTable() {
        this.full = []
        this.empty = []
    }
    full = []
    empty = []
    possibilityTable = [81,1,21,41,61]
    peselComp(targeted,status) {
        let peselFirst = targeted.value.slice(2,4)
        let birthdate = targeted.value.slice(0,4)
        if(birthdate >=1800 && birthdate <=1899){
            peselFirst+=(Number(targeted.value.slice(5,7) -1) + this.possibilityTable[0]) + targeted.value.slice(8,10)
            if(!status) document.getElementById("peselForm").value= peselFirst
        }
        else if (birthdate >= 1900 && birthdate <=1999) {
            console.log("test")
            peselFirst+=`0${(Number(targeted.value.slice(5,7) -1) + this.possibilityTable[1])}` + targeted.value.slice(8,10)
            if(!status)document.getElementById("peselForm").value= peselFirst
        }
        else if (birthdate >= 2000 && birthdate <=2099) {
            peselFirst+=(Number(targeted.value.slice(5,7) -1) + this.possibilityTable[2]) + targeted.value.slice(8,10)
            if(!status)document.getElementById("peselForm").value= peselFirst
        }
        else alert("Niepoprawna data")
        return peselFirst
    }
    dateCheck(pesel) {
        if(!document.getElementById("birthdateForm").value) return
        if(this.peselComp(document.getElementById("birthdateForm"),true) != pesel.value.slice(0,6)) {
            alert("Niepoprawny pesel/data")
        }
    }
    genderCheck(pesel) {
        let gender = document.getElementById("genderForm").selectedOptions[0].value
        if(!gender=="null") return
        if(gender == "men") if(pesel.value.slice(9,10)%2 == 0 || pesel.value.slice(9,10) == 0) alert("Niepoprawny pesel/płeć")
        else if(pesel.value.slice(9,10)%2 != 0) alert("Niepoprawny pesel/płeć")
    }
    checkIfEmpty() {
        let field
        for (field of this.fieldList){
            const targeted =  document.getElementById(`${field.id.slice(0,field.id.length-4)}`)
            let callValue = field.value
            if(callValue){
                targeted.parentNode.style.backgroundColor = "green" 
                targeted.innerHTML = callValue
                this.full.push(targeted.parentNode.firstChild.innerHTML)
            } 
            else {
                targeted.parentNode.style.backgroundColor = "red"
                targeted.innerHTML = callValue
                this.empty.push(targeted.parentNode.firstChild.innerHTML)
            }
        }
        this.checkIfEmptyGender()
        document.getElementById("formStatus").innerHTML = `Puste: ${this.empty.join(", ")}. <br/><br/> Wypełnione: ${this.full.join(", ")}`
        this.progressBar()
        this.clearTable()
}
checkIfEmptyGender (status) {

    const genderTarget = document.getElementById("gender")
    const calledGender = document.getElementById("genderForm").selectedOptions[0]
    if(calledGender.value == "null"){
        genderTarget.parentNode.style.backgroundColor = "red"
        genderTarget.innerHTML = calledGender.innerHTML 
        this.empty.push(genderTarget.parentNode.firstChild.innerHTML)
    }    
    else {
        genderTarget.parentNode.style.backgroundColor= "green"
        genderTarget.innerHTML = calledGender.innerHTML
        this.full.push(genderTarget.parentNode.firstChild.innerHTML)
    }
    if(status){
        this.checkIfEmpty()
        return
    }
    if(this.empty.length == 0) {
        this.stoper.stop()
        document.getElementById("complitionTime").innerHTML = `Czas wypełnienia formularza: ${this.stoper.x}s`
    }
}
    styleChangeOnOver(field) {
        field.style.boxShadow = "2px 5px lightblue"
        field.addEventListener("mouseout", () => field.style.boxShadow = "")
    }
    progressBar() {
        let x = this.empty.length + this.full.length
        let percent = this.full.length/x * 100
        document.getElementById("progressBarComplition").style.width = `${percent}%`
        document.getElementById("progressBarComplition").firstChild.innerHTML = `Wypełniono formularz w: <br/>${percent.toFixed(2)}%`
    }
}