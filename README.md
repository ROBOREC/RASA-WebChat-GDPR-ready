# RASA-WebChat-GDPR-ready
Pure JS app, alternative for JQuery/REACT webchat for RASA
not ngrok - must be connected to server via https + domain name (not just IP address)

First message 
channel REST -

## Installation

Server: We do recommend to have your RASA instance accessible via https and domain name, not just IP address. Of course, you need to enable the REST channel.
 
**Website** All you have to do is to place the snippet of javascript showed below WHEREVER in your html code, and it will automatically inject the widget to the head of your code. 

You can use it with an existing platforms like Wordpress, Wix, Joomla - just include html code into the page body.

```
## Parameters 
`    1) init_action -> text which will be sent by bot to the user proactively
    2) init_action_after_s -> after this number of seconds the message from 1) will be send
`
```


Simple webchat, no proactivity:

```
    <script>
    window.webchatSettings = {
        init_action: "Hi, how can I help you?",
        init_action_after_s: 5,
       // url of your RASA REST server
        url: "https://rasa-bot.roborec.chat",
    },
    function() {
        var t = window,
            e = document,
            a = function() {
                var t = e.createElement("script");
                // url of webchat widget file
                t.type = "text/javascript", t.async = !0, t.src = "https://roborec.chat/widget-simple.js";
                var a = e.getElementsByTagName("script")[0];
                a.parentNode.insertBefore(t, a)
            };
        t.attachEvent ? t.attachEvent("onload", a) : t.addEventListener("load", a, !1)
    }();
    </script>
```
