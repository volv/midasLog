midasLog

Going to eventually persist logs from Kongregate Chat rooms.

npm install  

npm start

Open up localhost:8080

To get data go to kongregate.com. Find and join an active chat room for one of their games  

(I'm using http://www.kongregate.com/games/HolydayStudios/midas-gold-plus)

Open the console:

```function sendMidasData() {
  var midasData = {};

  var midasUserRows = Array.from(document.querySelectorAll(".user_row"));
  var midasUserList = midasUserRows.filter(f=>f.querySelector(".username")).map(m=>m.querySelector(".username"));
  var midasUserNames = midasUserList.map(m => m.getAttribute("username"));

  midasData.userNames = midasUserNames;

  var messages = [];
  var midasMessages = Array.from(document.querySelectorAll(".chat-message"));
  midasMessages.forEach(each => {
    var message = {}
    if (!each.querySelector(".timestamp")) return;
    message.timeStamp = each.querySelector(".timestamp").innerText;
    message.userName = each.querySelector(".username").getAttribute("username"); 
    message.message = each.querySelector(".message").innerText;
    messages.push(message);
  });

  midasData.messages = messages;

  fetch("http://localhost:8080/volvpost", {
    method: "post",
    mode: "cors",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(midasData)
    })

  .then((data) => { console.log(`Sent MidasData @ ${new Date()}`); console.dir(midasData); } );

}

var sendingMidas = setInterval(sendMidasData, 10000);
```

Paste that to start sending user and chat data to the server every 10 seconds. Leave game window open

Switch back to localhost:8080 window to see updates.