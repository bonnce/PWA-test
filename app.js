let db;

const DBNAME = 'songsDB'
const COLLNAME = 'songs'

window.addEventListener('load',()=>{
    //initialize indexedDB
    getIndexedDB();

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register("sw.js");
    }

    const request = openDB(DBNAME,1)
    request.onerror = (error)=>{
        console.error(error)
    }
    request.onsuccess = (event)=>{
        db = event.result
    }

    //create a collection
    createDB(COLLNAME,{ autoIncrement : true, keyPath:'id' },['name'],request)
})

const getIndexedDB = ()=>{
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    // No use "var indexedDB = ..." Si no está en una función.
    // Por otra parte, puedes necesitar referencias a algun objeto window.IDB*:
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
}

const openDB = (name,version)=>{
    return window.indexedDB.open(name,version)
}

const createDB = (name, options,index,request)=>{
    request.onupgradeneeded = (event)=>{
        const db = event.target.result
        const objectStore = db.createObjectStore(name, options);
        index.forEach((i)=>{
            objectStore.createIndex(i, i, { unique: false });
        })        
    }
}

const dbAdd = (db,name,item) => {
    const transaction = db.transaction([name],'readwrite')
    const objectStore = transaction.objectStore(name);
    objectStore.add(item)
}


const handleDB = (item)=>{
    //add an item
    dbAdd(db,COLLNAME,item)
}



const submitHandler = ()=>{
        
    const songName = document.querySelector('input[name="songName"]');
    const type = document.querySelector('#input[name="type"]');
    const like = document.querySelector('#input[name="like"]');

    const item = {songName,type,like}
    
    handleDB(item)
}
