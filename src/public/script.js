const urlParams = new URLSearchParams(window.location.search);
const key = urlParams.get('key');
const counter = document.getElementById("counter");
const info = document.getElementById("info");
const buttons = document.getElementById("buttons");
console.log(key);

var socket = io();

socket.on("update", (value) => 
{
    var parsed = Number(value);
    counter.innerHTML = value;
});

socket.on("id", (newKey) => 
{
    console.log("Your socket ID", newKey);
    info.innerHTML = window.location.href + "?key=" + newKey;
})

function launchCounter()
{
    console.log("not joining, set new room");
    socket.emit("host");
}

function joinCounter(key)
{
    console.log("trying to join room with key", key);
    socket.emit("join", key);
}

socket.on("ready", () => {
    if(key)
    {
        // hide buttons
        buttons.style.display = "none";
        joinCounter(key);
    }
    else
        launchCounter();
});

document.getElementById("plus").addEventListener("click", e => 
{
    var value = document.getElementById("increment").value;
    socket.emit("+", value);
});

document.getElementById("minus").addEventListener("click", e => 
{
    socket.emit("-", value);
});

document.getElementById("reset").addEventListener("click", e => 
{
    socket.emit("r");
});