var myVar = setInterval(display_time, 1000);

function section1Function() {
    //alert("Page is loaded");
    document.getElementById("data_curenta").innerHTML = show_date();
    display_time();
    document.getElementById("url_curent").innerHTML = window.location.href;
    window.navigator.geolocation.getCurrentPosition(showPosition);
    document.getElementById("browser_utilizat").innerHTML = window.navigator.appName + " " + window.navigator.appVersion; 
    document.getElementById("sistem_operare").innerHTML = window.navigator.platform;
}

function display_time(){
    document.getElementById("timp_curent").innerHTML = show_time();
}

function showPosition(position){
    document.getElementById("locatie").innerHTML = "Lat: " + position.coords.latitude + " Lon: " + position.coords.longitude;
}

function show_date(){
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth()+1).padStart(2, '0');
    let yyyy = String(today.getFullYear());
    return mm + '/' + dd + '/' + yyyy;
}

function show_time(){
    let today = new Date();
    return String(today.getHours()).padStart(2, '0') + ":" + String(today.getMinutes()).padStart(2, '0') + ":" + String(today.getSeconds()).padStart(2, '0');
}

function section2Function_LOTO(){
    console.log("test");
    var temp = [];
    let i = 0;
    text = "Numerele câștigătoare sunt: ";

    for (i = 0; i < 7; i++){
        temp[i] = Math.floor(Math.random() * 255);
        text = text.concat(temp[i].toString() + ", ")
    }
    temp[7] = Math.floor(Math.random() * 255);
    text = text.concat(temp[7].toString() + ".")
    

    document.getElementById("loto_out").innerHTML = text;
}