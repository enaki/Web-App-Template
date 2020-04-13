var myVar;

function section1Function() {
    //alert("Page is loaded");
    document.getElementById("data_curenta").innerHTML = show_date();
    display_time();
    document.getElementById("url_curent").innerHTML = window.location.href;
    window.navigator.geolocation.getCurrentPosition(showPosition);
    document.getElementById("browser_utilizat").innerHTML = window.navigator.appName + " " + window.navigator.appVersion;
    document.getElementById("sistem_operare").innerHTML = window.navigator.platform;

    change_pen_color();
    myVar = setInterval(display_time, 1000);
}

function display_time() {
    try{
        document.getElementById("timp_curent").innerHTML = show_time();
    }
    catch(err){
        console.log("Cleared succesfully");
        clearInterval(myVar);
    }
}

function showPosition(position) {
    document.getElementById("locatie").innerHTML = "Lat: " + position.coords.latitude + " Lon: " + position.coords.longitude;
}

function show_date() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = String(today.getFullYear());
    return mm + '/' + dd + '/' + yyyy;
}

function show_time() {
    let today = new Date();
    return String(today.getHours()).padStart(2, '0') + ":" + String(today.getMinutes()).padStart(2, '0') + ":" + String(today.getSeconds()).padStart(2, '0');
}

function section2Function_LOTO() {
    console.log("test");
    var temp = [];
    var temp_in = [];
    text = "</br>Numerele câștigătoare sunt: <span class=\"loto_out_response\">";
    const regex = /[A-F0-9]{2}/g;
    for (var i = 0; i < 8; i++) {

        temp_in[i] = document.getElementById('loto_in_' + i).value;
        if (temp_in[i].toString().length != 2) {
            alert("Invalid input!");
            return;
        }
        //console.log(temp_in[i]);
        found = temp_in[i].toString().match(/[A-F0-9]{2}/g);
        //console.log(found);
        if (found == null) {
            alert("Invalid input!");
            return;
        }
        temp_in[i] = parseInt("0x" + temp_in[i]);
    }
    console.log(temp_in);
    for (i = 0; i < 7; i++) {
        temp[i] = Math.floor(Math.random() * 255);
        text = text.concat(temp[i].toString(16).toUpperCase().padStart(2, '0') + ", ")
    }
    temp[7] = Math.floor(Math.random() * 255);
    text = text.concat(temp[7].toString(16).toUpperCase().padStart(2, '0') + ".</span>")
    //intersection
    //temp = [31, 47, 0, 1, 2, 3, 4, 5];    //exemplu
    temp_distinct = new Set(temp);
    temp_distinct_in = new Set(temp_in);
    intersection = new Set([...temp_distinct].filter(x => temp_distinct_in.has(x)));
    text = text.concat("</br>" + "Ați ghicit în total <span class=\"loto_out_response\">" + intersection.size + "</span> elemente.")
    document.getElementById("loto_out").innerHTML = text;
}

function change_canvas_color() {
    let canvas = document.getElementById("section3_canvas");
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = document.getElementById("change_canvas_color").value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

}

function change_pen_color() {
    let canvas = document.getElementById("section3_canvas");
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = document.getElementById("change_pen_color").value;
    ctx.strokeStyle = document.getElementById("change_pen_color").value;;
}

var firstTime = true;
var x1, y1;

function drawRectangle() {
    if (firstTime) {
        let canvas = document.getElementById("section3_canvas");
        const rect = canvas.getBoundingClientRect()
        x1 = event.clientX - rect.left;
        y1 = event.clientY - rect.top;
        console.log("First time x: " + x1 + " y: " + y1);
        firstTime = false;
    } else {
        let canvas = document.getElementById("section3_canvas");
        const rect = canvas.getBoundingClientRect()
        let x2 = event.clientX - rect.left;
        let y2 = event.clientY - rect.top;
        console.log("Second time x: " + x2 + " y: " + y2);

        let ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.rect(x1, y1, x2 - x1, y2 - y1);
        ctx.stroke();
        firstTime = true;
    }
}

function section4Line_insert() {
    let table = document.getElementById("javascript_table");
    try {
        var number_columns = table.rows[0].cells.length;
    } catch (e) {
        number_columns = 0;
    }
    let number_rows = table.rows.length;

    let index = document.getElementById("table_position_insert").value;
    if (index == null) {
        index = 0;
    } else if (index > number_rows) {
        index = number_rows;
    }

    let color = document.getElementById("change_table_bg").value;

    let new_row = table.insertRow(index);
    new_row.style.background = color;

    let i = 0;
    for (i = 0; i < number_columns; i++) {
        new_row.insertCell(i);
    }

}

function section4Column_insert() {
    let table = document.getElementById("javascript_table");
    try {
        var number_columns = table.rows[0].cells.length;
    } catch (e) {
        section4Line_insert();
        number_columns = table.rows[0].cells.length
    }
    let number_rows = table.rows.length;

    let index = document.getElementById("table_position_insert").value;
    if (index == null) {
        index = 0;
    } else if (index > number_columns) {
        index = number_columns;
    }

    let color = document.getElementById("change_table_bg").value;

    let rows = table.rows;
    let i = 0;
    for (i = 0; i < number_rows; i++) {
        let new_cell = rows[i].insertCell(index);
        new_cell.style.background = color
    }
}

function section4Line_delete() {
    let table = document.getElementById("javascript_table");
    let number_rows = table.rows.length;
    if (number_rows == 0) {
        alert("Tabelul nu are linii");
        return;
    }
    let index = document.getElementById("table_position_insert").value;
    if (index == null) {
        index = 0;
    } else if (index >= number_rows) {
        index = number_rows - 1;
    }

    table.deleteRow(index);
}

function section4Column_delete() {
    let table = document.getElementById("javascript_table");
    let number_rows = table.rows.length;
    if (number_rows == 0) {
        alert("Tabelul nu are linii");
        return;
    }
    let number_columns = table.rows[0].cells.length;
    if (number_columns == 0) {
        alert("Tabelul nu are coloane");
        return;
    }
    let index = document.getElementById("table_position_insert").value;
    if (index == null) {
        index = 0;
    } else if (index >= number_columns) {
        index = number_columns - 1;
    }
    let rows = table.rows;
    let i = 0;
    for (i = 0; i < number_rows; i++) {
        rows[i].deleteCell(index);
    }
}

function changeLayout_4x1() {
    document.getElementById("text_section").className = "text section d4x1";
}

function changeLayout_1x4() {
    document.getElementById("text_section").className = "text section d1x4";
}

function changeLayout_2x2() {
    document.getElementById("text_section").className = "text section d2x2";
}

function schimbaContinut(resursa, jsFisier, jsFunctie) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("continut").innerHTML = this.responseText;
            if (jsFisier) {
                var elementScript = document.createElement('script');
                elementScript.src = "http://code.jquery.com/jquery-1.7.1.min.js"
                elementScript.onload = function () {
                    //console.log("hello");
                    if (jsFunctie) {
                        window[jsFunctie]();
                    }
                };
                elementScript.src = jsFisier;
                document.head.appendChild(elementScript);
            } else {
                if (jsFunctie) {
                    window[jsFunctie]();
                }
            }
        }
    };
    xhttp.open("GET", resursa + ".html", true);
    xhttp.send();
}