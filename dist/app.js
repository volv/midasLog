var app = new Vue({
  el: '#app',
  data: {
    userNames: [],
    messages: [],
    filterText: "",
    matches: 0,
    timer: 10,
    show: 10,
  },
  computed: {
    lastX: function() {
      if (this.filterText && this.filterText.length > 0) {
        let filtered = this.messages.filter(function(f) {
          let fText = this.filterText.toLowerCase();
          return f.userName.toLowerCase().includes(fText) || f.message.toLowerCase().includes(fText);
        });

        let sliceStart = (filtered.length-this.show > 0) ? filtered.length-this.show : 0;
        this.matches = filtered.length;
        return filtered.slice(sliceStart);
      }

      this.matches = this.messages.length;
      let sliceStart = (this.messages.length-this.show > 0) ? this.messages.length-this.show : 0;
      return this.messages.slice(sliceStart);
    },
    sortedUserNames: function() {
      return this.userNames.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    }
  },
  methods: {
    scrollDown: function() {
      let container = document.getElementById("messageContainer");
      container.scrollTop = container.scrollHeight;
    }
  }
})

let init = (() => {
  var socket = io("localhost:3000");

  socket.on('startup', function(data) {
    console.log("receiving startup", data)
    app.messages = data;
    setUpdates();
  })

  function setUpdates() {
    socket.on('update', function(msg){
      let data = JSON.parse(msg);

      app.messages = app.messages.concat(data.messages);
      app.userNames = data.userNames;
      if (data.messages.length > 0) {
        socket.emit("updateDB", data.messages)
        Vue.nextTick(app.scrollDown);
      }
      app.timer = 10;
    });
  }

  setInterval(() => {
    app.timer -= 0.1
  }, 100);

  Vue.nextTick(app.scrollDown);
})();