let db;

const DBNAME = 'songsDB'
const COLLNAME = 'songs'

let deferredPrompt;
    
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
        db = event.target.result
        console.log('success')
        listDB()

    }

    //create a collection
    createDB(COLLNAME,{ autoIncrement : true, keyPath:'id' },['name'],request)


})


window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const install = document.querySelector('#install')
    const button = addButton()
    install.appendChild(button)
});



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

const addData = (db,name,item) => {
    const transaction = db.transaction([name],'readwrite')
    transaction.onerror = (err)=>{
        console.error(err)
    }
    transaction.oncomplete = (e)=>{
        console.log('complete!')
    }
    const objectStore = transaction.objectStore(name);
    objectStore.add(item)
}

const getAllData = (db,nameCol,callback) =>{

    const transaction = db.transaction([nameCol],'readonly')
    transaction.onerror = (err)=>{
        console.error(err)
    }
    transaction.oncomplete = (e)=>{
        console.log('complete!')
    }

    const objectStore = transaction.objectStore(nameCol);

    objectStore.openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          callback(cursor)
          cursor.continue();
        }
      };
}


const handleDB = (item)=>{
    //add an item
    addData(db,COLLNAME,item)
}

const listDB = ()=>{
    if(db){
        const list = document.querySelector('#col2');
        const container = document.createElement('div')
        list.append(container)
        getAllData(db,COLLNAME, (cursor) =>{
            const {id,songName,type,like} = cursor.value

            const wrapper = document.createElement('ul')
            const header = document.createElement('p')
            const liName = document.createElement('li')
            const liType = document.createElement('li')
            const liLike = document.createElement('li')

            header.innerText = `Canción ${id}`
            liName.innerText = songName
            liType.innerText = type
            liLike.innerText = like ? 'Mi favorito 😍' : 'No significa nada para mi 🥶'

            wrapper.append(header)
            wrapper.append(liName)
            wrapper.append(liType)
            wrapper.append(liLike)
            container.append(wrapper)
        })
    }
}



const submitHandler = ()=>{
    const form = document.querySelector('#form')
    form.addEventListener('submit',event=>{
        event.preventDefault()
        console.log(event)
        const songName = document.querySelector('input[name="songName"]').value;
        const type = document.querySelector('input[name="type"]').value;
        const like = document.querySelector('input[name="like"]').checked;
    
        const item = {songName,type,like}
    
        handleDB(item)

        location.reload()
    })    

}

window.addEventListener('DOMContentLoaded',()=>{
    submitHandler()
})

const handleInstall = async (e)=>{
    if(deferredPrompt){
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
        if (outcome === 'accepted') {
            e.target.parentNode.removeChild(e.target)
        }
    }
}

const addButton = ()=>{
    const button = document.createElement('button')
    button.innerText = 'Install'
    button.addEventListener('click',handleInstall)
    button.classList.add('button')
    return button
}