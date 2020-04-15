function incarcaPersoane() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            populateTable(this);
        }
    };
    xhttp.open("GET", "resurse/persoane.xml", true);
    xhttp.send();
  }

  function populateTable(xml) {
    var i, j;
    console.log(xml);
    var xmlDoc = xml.responseXML;
    console.log(xmlDoc);
    var table="<table class=\"table_style_2\"><tr><th>Nume</th><th>Prenume</th><th>Varsta</th><th>Tara</th><th>Localitate</th><th>Adresa</th><th>Limbi Materna</th></tr>";
    var x = xmlDoc.getElementsByTagName("persoana");
    console.log(x.length);
    for (i = 0; i < x.length; i++) { 
        let nume = x[i].getElementsByTagName("nume")[0].childNodes[0].nodeValue;
        let prenume = x[i].getElementsByTagName("prenume")[0].childNodes[0].nodeValue;
        let varsta = x[i].getElementsByTagName("varsta")[0].childNodes[0].nodeValue;
        table += "<tr><td>" + nume + "</td><td>" + prenume + "</td><td>" + varsta + "</td>";
        let adresa = x[i].getElementsByTagName("adresa")[0];
        let tara = adresa.getElementsByTagName("tara")[0].childNodes[0].nodeValue;
        let localitate = adresa.getElementsByTagName("localitate")[0].childNodes[0].nodeValue;
        let strada = adresa.getElementsByTagName("strada")[0].childNodes[0].nodeValue;
        let numar = adresa.getElementsByTagName("numar")[0].childNodes[0].nodeValue;
        let limba = x[i].getElementsByTagName("limba_materna")[0].childNodes[0].nodeValue;
        table += "<td>" + tara + "</td>"
        table += "<td>" + localitate + "</td>"
        table += "<td>" + strada + " " + numar + "</td>"
        table += "<td>" + limba + "</td></tr>"
    }
    table += "</table>";
    document.getElementById("persoane_xml_populate").innerHTML = table;
  }

function Verifica_User(){
    let user = document.getElementById("username_verify").value;
    let password = document.getElementById("password_verify").value;
    console.log("Verify : " + user + " " + password)

    $.getJSON("../resurse/utilizatori.json", function(json_users) {
        console.log(json_users);
        for (var i = 0; i < json_users.length; i++) {
            console.log("Item 1: " + json_users[i].utilizator + " " + json_users[i].parola)
            if (user == json_users[i].utilizator){
                if (password == json_users[i].parola){
                    document.getElementById("verifica_account").innerHTML = "Username-ul și parola sunt corecte"
                    document.getElementById("verifica_account").style="color: greenyellow";
                    return;
                }
                //un singur utilizator cu acelasi username
                break;            }
            console.log(json_users[i]["parola"]);    
        }
        document.getElementById("verifica_account").innerHTML = "Username-ul și parola sunt incorecte"
        document.getElementById("verifica_account").style="color: cyan";
       
    });
}