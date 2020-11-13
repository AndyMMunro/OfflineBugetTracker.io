let db;
//  creating DB
const request = window.indexedDB.open("ledger", 1);

// schema
request.onupgradeneeded = event => {
  const db = event.target.result;

  // object creation and key name and liner cataloging for query purposes
  db.createObjectStore("pendingTrans",{autoIncrement: true});
};

// varifies online connectivity
request.onsuccess = event => {
  db = event.target.result;
  if(navigator.onLine)
  {
    checkDatabase();
  }
};

request.onerror = event => {
  console.log("Dooh!!", + event.target.errorCode);
};

function saveRecord(record){
  // creats order for read & write capabilities so data doesnt get over written
  const transaction = db.transaction(["pendingTrans"], "readwrite");

  // grants access to storeed data
  const store = transaction.objectStore("pendingTrans");

  // place data in store
  store.add(record);

};

function checkDatabase(){
  const transaction = db.transaction(["pendingTrans"], "readwrite");
  const store = transaction.objectStore("pendingTrans");
  const getAll = store.getAll();

  getAll.onsuccess = () => {
    if (getAll.result.length > 0){
      fetch("/api/transaction/bulk", {
        method: "POST",
        body:JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, test/plain, */*",
          "Content-Type": "application/json"
        }
      })
      .then(res => res.json())
      .then(()=> {
        // if works opens tran in browserdb
       // creates order for read & write capabilities so data doesnt get over written
        const transaction = db.transaction(["pendingTrans"], "readwrite");

        // grants access to storeed data
        const store = transaction.objectStore("pendingTrans");

        // place data in store
        store.clear();
      });
    }
  } ;
}

// listens for internet connecton
window.addEventListener("online", checkDatabase);