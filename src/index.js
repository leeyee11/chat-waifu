"use strict";
const { LAppDelegate } = require("./live2d/AppDelegate");

window.onload = () => LAppDelegate.mount(document.querySelector('#character'));
window.onbeforeunload = LAppDelegate.unmount;

window.addEventListener('hit:Head',
  function () {
    const msgs = document.querySelector('#messages')
    if (msgs.classList.contains('hidden')) {
      msgs.classList.remove('hidden');
    } else {
      msgs.classList.add('hidden');
    }
  }
)

const app = new Vue({
  el: '#messages',
  data: {
    messages: [],
    visible: false,
    user: {
      input: "",
    }
  },
  watch: {
    messages: function() {
      this.$nextTick(()=>{
        $(this.$refs.history).animate({
          scrollTop: $(this.$refs.history)
            .prop('scrollHeight') + 'px'
        }, 300);
      })
    }

  },
  methods: {
    submit: function () {
      const userMsg = this.user.input.trim();
      window.dispatchEvent(new Event('input:message',{message: userMsg}));

      this.messages.push({
        sender: 'user',
        content: userMsg
      });
      fetch('/api/user/input',{
        method: 'POST',
        body: userMsg
      }).then((resp) => resp.text())
        .then((answer) => {
          this.messages.push({
            sender: 'bot',
            content: answer
          })
        })
      this.user.input = "";
    }
  }
})