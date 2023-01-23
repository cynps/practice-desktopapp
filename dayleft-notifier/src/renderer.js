const setButton = document.getElementById("btn");
const titleInput = document.getElementById("title");
const dateInput = document.getElementById("date");
const messageText = document.getElementById("message");
setButton.addEventListener("click", () => {
    const title = titleInput.value;
    const date = dateInput.value;
    window.electronAPI.setTitle(title);
    window.electronAPI.upsert(title, date);
    messageText.innerText = title;
});
window.electronAPI.onUpdateCounter((_event, value) => {
    messageText.innerText = value;
});