# RASA-WebChat-GDPR-ready
Roborec RASA webchat is a simple chat widget written in a plain javascript for an easy setup in the REST channel of AI assistants RASA platform. It supports welcome message with predefined payloads.

Roborec webchat is GDPR ready, because it connects directly your server with an users browser. Commonly used RASA webchats send all user data through ngrok.io or Socket.io services (these services are not GDPR compliant).

Advanced version of the RASA webchat, incl. support, is available with standard Roborec chatbot & virtual assistant engine. It can be connected to RASA, IBM Watson Assistant (Conversations) or Google Dialogflow. For more, see https://roborec.biz/.

## Installation
**Server:** We do recommend to have your RASA instance accessible via https and domain name, not just IP address. Of course, you need to enable the REST channel in RASA setup.
 
**Website:** All you have to do is to place the snippet of javascript showed below WHEREVER in your HTML code, and it will automatically inject the widget to the head of your code. 

You can use this RASA webchat with an existing CMS platforms like Wordpress, Wix, Joomla - just add the HTML code into the page body.

## Parameters 
```
    1) init_action -> text which will be sent by bot to the user proactively
    2) init_action_after_s -> after the specified number of seconds the message from 1) will be send
    3) url -> url of your RASA rest channel (for example "https://example.yourserver.com")
    4) submit_color -> css color name, hex or rgb (anything the css will recognize) - defaulting to #135afe
    5) webchat_color -> color of webchat (same format like No 4) - defaulting to #135afe
    6) actions_by_path -> you can set custom welcome texts / buttons for a defined page slug

```

## Examples
1) Simple RASA webchat, default color, no proactivity:
```
    <script>
    window.webchatSettings = {
        // url of your RASA REST server
        url: "https://yourserver.com",
    },
    function() {
        var t = window,
            e = document,
            a = function() {
                var t = e.createElement("script");
                // url of webchat widget file
                t.type = "text/javascript", t.async = !0, t.src = "https://yourserver.com/r_webchat.js";
                var a = e.getElementsByTagName("script")[0];
                a.parentNode.insertBefore(t, a)
            };
        t.attachEvent ? t.attachEvent("onload", a) : t.addEventListener("load", a, !1)
    }();
    </script>
```

2) RASA webchat with welcome message "Hi, how can I help you?" after 5 seconds on any page BUT /test - where the message is "Welcome to TEST page. Select your question...":
```
    <script>
    window.webchatSettings = {
        init_action: "Hi, how can I help you?",
        init_action_after_s: 5,
        url: "https://yourserver.com",
        submit_color: '#287de7',
        webchat_color: '#287de7',
        actions_by_path: {
        "test": {
          "text": "Welcome to TEST page. Select your question:",
          "buttons": [
            {"title": "Problem 1", "payload": "/intent1"},
            {"title": "Problem 2", "payload": "/intent2"},
          ],
        }
},
    function() {
        var t = window,
            e = document,
            a = function() {
                var t = e.createElement("script");
                t.type = "text/javascript", t.async = !0, t.src = "https://yourserver.com/r_webchat.js";
                var a = e.getElementsByTagName("script")[0];
                a.parentNode.insertBefore(t, a)
            };
        t.attachEvent ? t.attachEvent("onload", a) : t.addEventListener("load", a, !1)
    }();
    </script>
```




