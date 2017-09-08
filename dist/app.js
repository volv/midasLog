var app = new Vue({
  el: '#app',
  data: {
    userNames: [],
    messages: [],
    filterText: "",
    timer: 10,
    show: 10,
  },
  computed: {
    lastX: function() {
      if (this.filterText && this.filterText.length > 0) {
        let filtered = this.messages.filter(function(f) {
          let fText = app.filterText.toLowerCase();
          return f.userName.toLowerCase().includes(fText) || f.message.toLowerCase().includes(fText);
        })
        let sliceStart = (filtered.length-this.show > 0) ? filtered.length-this.show : 0;
        return filtered.slice(sliceStart);
      }
      let sliceStart = (this.messages.length-this.show > 0) ? this.messages.length-this.show : 0;
      return this.messages.slice(sliceStart);
    },
    sortedUserNames: function() {
      return this.userNames.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    }
  },
  methods: {
    scrollDown: function() {
      var container = document.getElementById("messageContainer");
      container.scrollTop = container.scrollHeight;
    }
  }
})

let init = (() => {
  var socket = io("localhost:3000");
  socket.on('update', function(msg){
    let data = JSON.parse(msg);
    app.messages = data.messages;
    app.userNames = data.userNames;
    app.timer = 10;
  });

  setInterval(() => {
    app.timer -= 0.01
  }, 10);

  app.scrollDown();
})();