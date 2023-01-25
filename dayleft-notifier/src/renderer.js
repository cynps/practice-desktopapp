const setButton = document.getElementById("btn");
const titleInput = document.getElementById("title");
const dateInput = document.getElementById("date");
// const messageText = document.getElementById("message");
// const counter = document.getElementById("counter");
// const getButton = document.getElementById("getBtn");
const deleteButton = document.getElementById("delete");
const dataTableElem = document.getElementById("dataTable");

// debug-mode
const d = false; 

const insertTabelTd = (title, date) => {
    const dispDate = calcDayLast(date);
    const trElem = dataTableElem.tBodies[0].insertRow(-1);

    // TODO
    // 削除用チェックボックス
    let check = document.createElement("input");
    check.setAttribute("type", "checkbox");
    const cellElemCheck = trElem.insertCell(-1);
    cellElemCheck.appendChild(check);

    // 表示用
    if (dispDate >= 0) {
        message = title + "(" + date + ") まであと " + dispDate + "日";
    } else {
        message = title + "(" + date + ") から " + (dispDate * -1) + "日経過";
    }
    const text = document.createTextNode(message);
    const cellElem = trElem.insertCell(-1);
    cellElem.appendChild(text);
    // cellElem.setAttribute("onclick", "mainWindow.webContents.send('delete-title'),")
}

const calcDayLast = (date) => {
    if (d) console.log("calcDaylast");    
    if (d) console.log(date);
    const targetDate = new Date(date);
    if (d) console.log(targetDate);
    const today = new Date();
    if (d) console.log(today);

    const millisecDay = 24 * 60 * 60 * 1000;
    result = Math.floor((targetDate - today) / millisecDay);
    if (d) console.log(result);
    
    return result;
}

setButton.addEventListener("click", () => {
    const title = titleInput.value;
    const date = dateInput.value;
    // window.electronAPI.setTitle(title);
    insertTabelTd(title, date);
    window.electronAPI.upsert(title, date);
    // messageText.innerHTML = title;
});

deleteButton.addEventListener("click", () => {
    // const title = 
});

// getButton.addEventListener("click", async () => {
//     testParam = window.electronAPI.syncTest();
//     console.log("sync test api");
//     console.log(testParam);

//     // dataArray = await window.electronAPI.initDb();
//     // console.log("eventlistener onload");
//     // console.log(await dataArray);
// });

window.addEventListener("load", async () => {
    if (d) console.log("eventlistener onload");
    // const dataArray = new Promise(await window.electronAPI.initDb());
    // dataArray
    //     .then(console.log(dataArray));
    const dataArray = await window.electronAPI.initDb();
    if (d) console.log(dataArray);
    for (i=0; i<dataArray.length; ++i) {
        insertTabelTd(dataArray[i]["title"], dataArray[i]["date"]);
    }
});

// window.electronAPI.onUpdateCounter((_event, value) => {
//     messageText.innerHTML = value;
// });

// window.electronAPI.onUpdateCounter((event, value) => {
//     const oldValue = Number(counter.innerText);
//     const newValue = oldValue + value;
//     counter.innerText = newValue;
//     event.sender.send("counter-value", newValue);
// });
