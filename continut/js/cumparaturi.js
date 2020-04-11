class AbstractStorage{
    getItem(){
        throw new Error("Abstract addItem method");
    }

    setItem(produse){
        throw new Error("Abstract setItem method");
    }

    removeItem(){
        throw new Error("Abstract removeItem method");
    }
}

class ProductLocalStorageApi extends AbstractStorage{
    getItem(resolve){
        let temp = localStorage.getItem('product')
        return resolve(temp)
    }

    setItem(produse){
        localStorage.setItem('product', JSON.stringify(produse));
    }

    removeItem(){
        localStorage.removeItem('product');
    }
}
var db;
var storage_type = 0;

class ProductIndexedDB extends AbstractStorage{
    constructor(){
        super();
        var openRequest = indexedDB.open('produse', 3);
        openRequest.onupgradeneeded = function(e) {
            db = e.target.result;
            //console.log(db)
            console.log('running onupgradeneeded');
            if (!db.objectStoreNames.contains('products')) {
                var storeOS = db.createObjectStore('products', {keyPath: 'id'});
            }
        };
    };
    
    setItem(produse){
        var DBOpenRequest = indexedDB.open('produse', 3);
        
        DBOpenRequest.onsuccess = function(e) {
            db = DBOpenRequest.result;
            console.log(db);
            var transaction = db.transaction(['products'], 'readwrite');
            var objectStore = transaction.objectStore('products');
            
            produse.forEach(function(produs) {
                
                var request = objectStore.put({id : produs.id, value: produs});
                request.onsuccess = function(event) {
                    console.log("IndexDB Insertion Succesfull")
                };
            });
        }
        DBOpenRequest.onerror = function(e) {
            console.log("Error opening the database for insertion");
        }
    };

    getItem(resolve){
        self = this;

        var DBOpenRequest = indexedDB.open('produse', 3);
        console.log('---------INSIDE GET----------');
        DBOpenRequest.onsuccess = function(e) {
            db = DBOpenRequest.result;
            var transaction = db.transaction(['products'], 'readwrite');
            var objectStore = transaction.objectStore('products');

            var db_items = [];
            objectStore.openCursor().onsuccess = function(event) {
                var cursor = event.target.result;
                if(cursor) {
                    //console.log("Another item "  );
                    //console.log(cursor.value.value);        //cursor value is the result of an indexdb request
                    db_items.push(cursor.value.value)
                    cursor.continue();
                } else {
                    //console.log('Entries all displayed.');
                    //console.log(db_items);
                    console.log('---------INSIDE GET OUT----------');
                    if (resolve == null)
                        return JSON.stringify(db_items)
                    else
                        resolve(JSON.stringify(db_items));
                }
            };
        }
    }

    removeItem(){
        var DBOpenRequest = indexedDB.open('produse', 3);
        
        DBOpenRequest.onsuccess = function(e) {
            db = DBOpenRequest.result;
            var transaction = db.transaction(['products'], 'readwrite');
            var objectStore = transaction.objectStore('products');
            var request = objectStore.clear();
            request.onsuccess = function(event) {
                console.log("IndexDB Delete Succesfull")
            };
        }
    }
}

class Produs{
    constructor(id, nume, cantitate){
        this.id = id;
        this.nume = nume;
        this.cantitate = cantitate;
    }
    toString(){
        return "<tr><td>" + this.id +"</td><td>" + this.nume + "</td><td>" + this.cantitate + "</td></tr>";
    }

    static from(json){
        return Object.assign(new Produs(), json);
    }
}

var mySlave;
var myStorage;

function startWorker() {
    if (typeof(Worker) !== "undefined") {
        if (typeof(w) == "undefined") {
            mySlave = new Worker("js/worker.js");
        }
        mySlave.onmessage = function(event) {
            console.log("Received message from worker");
            if (event.data == "clear_please"){
                document.getElementById("lista_cumparaturi").innerHTML = "<tr><th>Id</th><th>Produs</th><th>Cantitate</th></tr>";
            } else {
                document.getElementById("lista_cumparaturi").innerHTML += event.data;
            }
        };
    } else {
        alert("No Web browser support");
    }
}

function stopWorker() {
    mySlave.terminate();
    mySlave = undefined;
}

function Cumpara(){
    let numeProdus = document.getElementById("cumparaturi_nume").value;
    let cantitate = document.getElementById("cumparaturi_cantitate").value;
    if (cantitate == "" || numeProdus == ""){
        return;
    }

    var promise = new Promise(function(resolve){
        myStorage.getItem(resolve)
    });
    promise.then(function(produse){
        console.log("Getting products from the database");
        //console.log(produse);
        if (produse == null){
            produse = [];
        } else {
            produse = JSON.parse(produse);
        }

        produse = produse.map(json_item => Produs.from(json_item));

        let id = produse.length + 1;
        var new_product = new Produs(id, numeProdus, cantitate)

        mySlave.postMessage(JSON.stringify(new_product));
        produse.push(new_product)
        
        //console.log(produse);
        myStorage.setItem(produse);})
    
}

function populateTableCumparaturiOnLoad(){
    if (storage_type == 0){
        myStorage = new ProductLocalStorageApi();
    } else {
        myStorage = new ProductIndexedDB();
    }
    var promise = new Promise(function(resolve){
        myStorage.getItem(resolve)
    });
    promise.then(function(produse){
        //console.log(produse);
        if (produse == null){
            produse = [];
        } else {
            produse = JSON.parse(produse);
        }
        produse = produse.map(json_item => Produs.from(json_item));
        text = ""
        produse.forEach(item =>
            text += item.toString()
        )
        document.getElementById("lista_cumparaturi").innerHTML ="<tr><th>Id</th><th>Produs</th><th>Cantitate</th></tr>" + text;

        startWorker();
    });
}

function clearTable(){
    var promise = new Promise(function(){
        myStorage.removeItem();
        mySlave.postMessage("clear_table");
    });
    promise.then(function(){
        console.log("Cleared Succesfully");
    });
}

function changeStorage(){
    if(document.getElementById('api_storage').checked) {
        storage_type = 0;
        console.log("Change database to APIstorage");
        document.getElementById("db_name_cumparaturi").innerHTML = "Using the STORAGE API";
    }
    else if(document.getElementById('index_db').checked) {
        storage_type = 1;
        console.log("Change database to INDEX_DB")
        document.getElementById("db_name_cumparaturi").innerHTML = "Using the DB INDEX";
    }
    populateTableCumparaturiOnLoad();
}
