

self.onmessage = function(event) {
    console.log("i am the worker and i received " + event.data);
    if (event.data == "clear_table"){
        self.postMessage("clear_please");
    } else {
        jsonToTabelRow(event.data);
    }
};

function jsonToTabelRow(json){
    json = JSON.parse(json);
    tabel_row = "<tr><td>" + json['id'] +"</td><td>" + json['nume'] + "</td><td>" + json['cantitate'] + "</td></tr>";
    //console.log("i am the worker and i send back " + tabel_row);
    self.postMessage(tabel_row);
}