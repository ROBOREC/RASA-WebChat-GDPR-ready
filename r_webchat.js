function injectCSS() {
  var link = document.createElement("link");
  link.href = "https://roborec.chat/widget.css";
  link.type = "text/css";
  link.rel = "stylesheet";
  document.getElementsByTagName("head")[0].appendChild(link);
  var custom_style = '<style>';
  if (window.webchatSettings.submit_color != null) {
    custom_style += '#webchat-submit { background-color: '+window.webchatSettings.submit_color+'}'
  }
  if (window.webchatSettings.webchat_color != null) {
    custom_style += '.widget-chips { color: '+window.webchatSettings.webchat_color+'}';
    custom_style += '.widget-chips { border-color: '+window.webchatSettings.webchat_color+'}';
    custom_style += '.widget-chips:hover { background: '+window.webchatSettings.webchat_color+'}';
    custom_style += '#webchat-toggler { background: '+window.webchatSettings.webchat_color+'}';
    custom_style += '.webchat-header { background-color: '+window.webchatSettings.webchat_color+'}';
    custom_style += '#webchat-messages .message-item.outgoing-message .message-content { background-color: '+window.webchatSettings.webchat_color+'}';
  }
  custom_style += '</style>';
  if (custom_style != "<style></style>") {
    document.head.insertAdjacentHTML("beforeend", custom_style);
  }
}

function injectWidget() {
  var widget = `
  <div id="webchat-toggler"><i class="webchat-material material-comment"></i></div>
  <div id="webchat" style="opacity:0;display:none;">
      <div class="webchat-header">
          <div class="webchat-header-title">
            <h4>Bot</h4>
          </div>
          <div class="webchat-header-action">
            <div id="webchat-minimize">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 18 18"><path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path></svg>
            </div>
          </div>
      </div>
      <div class="webchat-body" tabindex="-1">
          <div id="webchat-messages" class="scroller"></div>
      </div>
      <div class="webchat-footer">
          <form action="">
              <input type="text" id="webchat-input" class="webchat-form-control" placeholder="Enter your message :-)">
              <div>
                  <button id="webchat-submit" type="button"> <i class="faweb fa-send"></i></button>
              </div>
          </form>
      </div>
  </div>
  `;
  var newNode = document.createElement("div");
  newNode.innerHTML = widget;
  document.body.appendChild(newNode);
}

function enableWidget() {
  document.getElementById("webchat-toggler").addEventListener("click", function() {
    var open = 0;
    document.getElementById("webchat").classList.toggle('is-visible');
    document.getElementById('webchat').style.opacity = "";
    document.getElementsByClassName("webchat-material")[0].classList.toggle('material-comment');
    document.getElementsByClassName("webchat-material")[0].classList.toggle('material-close');
    if (document.getElementById("webchat").classList.contains("is-visible")) {
      open = 1;
      scrollToBottomOfResults();
    }
    setSettingsState("open", open);
  });

  document.getElementById("webchat-minimize").addEventListener("click", function() {
    document.getElementById("webchat").classList.toggle('is-visible');
    document.getElementById('webchat').style.opacity = "";
    document.getElementsByClassName("webchat-material")[0].classList.toggle('material-comment');
    document.getElementsByClassName("webchat-material")[0].classList.toggle('material-close');
    setSettingsState("open", 0);
  });

  document.getElementById("webchat-submit").addEventListener("click", function() {
    var message = document.getElementById("webchat-input").value;
    if (message.trim() != "") {
      document.getElementById("webchat-input").value = "";
      setUserResponse(message);
      if (message != "/restart") {
          sendMessage(message);
      } else {
          restartWebchat();
      }
    }
  });

  document.getElementById("webchat-input").addEventListener("keypress", function (event) {
    if (event.keyCode == 13) {
      // prevent submitting
      event.preventDefault();
      var message = document.getElementById("webchat-input").value;
      if (message.trim() != "") {
        document.getElementById("webchat-input").value = "";
        setUserResponse(message);
        if (message != "/restart") {
            sendMessage(message);
        } else {
            restartWebchat();
        }
      }
    }
  });

  document.addEventListener('click', function (event) {
  	if (event.target.matches('.widget-chips')) {
      var payload = event.target.getAttribute('data-payload');
      setUserResponse(event.target.innerHTML);
      sendMessage(payload);
  	}
  }, false);
}

function openWebchatIfNotOpened(data) {

    var init_timeout = (window.webchatSettings.init_action_after_s>0) ? window.webchatSettings.init_action_after_s*1000:1000;
    init_timeout = (!isUndefined(data[2]))?data[2]:init_timeout;

    if (data[0] && !document.getElementById("webchat").classList.contains("is-visible")) {
      document.getElementById("webchat-toggler").click();
    }
    if (window.webchatSettings.init_action.length>0 && !data[1]) {
        setTimeout(function() {
            init_message = window.webchatSettings.init_action;
            init_buttons_key = "";
            if (window.webchatSettings.actions_by_path) {
                Object.keys(window.webchatSettings.actions_by_path).forEach(function(key) {
                    if (document.URL.indexOf(key) > -1) {
                        init_message = window.webchatSettings.actions_by_path[key]["text"];
                        if (!isUndefined(window.webchatSettings.actions_by_path[key]["buttons"])) {
                            init_buttons_key = key;
                        }
                        // try
                        if (isUndefined(init_message)) {
                            init_message =  window.webchatSettings.actions_by_path[key];
                        }
                    }
                });
            }

            if (isUndefined(init_message)) {
                init_message = "Welcome! I am available 24/7";
            }

            window.init_message = init_message;
            setBotResponse([{"text": init_message}]);
            if (init_buttons_key != "") {
                addButtons(window.webchatSettings.actions_by_path[init_buttons_key]["buttons"]);
                window.init_buttons_key = init_buttons_key;
            }
            //sendMessage(window.webchatSettings.init_action);
            if (document.getElementById("webchat").classList.contains("is-visible")) {
                return false;
            } else {
                document.getElementById("webchat-toggler").click();
            }
        }, init_timeout);
    }

    setTimeout(function (event) {
        scrollToBottomOfResults();
    }, 100);
}

function restoreState() {
  e = getLocalStorage();
  var t = document.getElementById("webchat-messages");
  if (e.settings.lastaction) {
    var secondsDiff = Math.abs((new Date().getTime() - e.settings.lastaction) / 1000);
    if (secondsDiff>900) {
      // delete whole localstorage if the last action is older than 15 minutes
      window.localStorage.removeItem('webchat');
      return [0,0]
    }
  }

  var had_messages = 0;
  var was_open = (e.settings.open)?1:0;

  if (e.messages.length>0) {
    e.messages.forEach(function(m) {
        if (m.from == "user") {
          t.insertAdjacentHTML("beforeend", '<div class="message-item outgoing-message"><div class="message-content">' + m.text +  '</div></div>');
        } else if (m.from == "bot") {
            t.insertAdjacentHTML("beforeend", '<div class="message-item"><div class="message-content">' + m.text +  '</div></div>');
        }
        had_messages = 1;
    });
  }
  scrollToBottomOfResults();
  return [was_open, had_messages];
}

function getLocalStorage() {
    var e = localStorage.getItem("webchat");
    e = e ? JSON.parse(e) : {"settings":{}, "messages":[]};
    return e;
}

function setLocalStorage(e) {
    localStorage.setItem("webchat", JSON.stringify(e));
}

function setMessagesState(from, text) {
    e = getLocalStorage();
    e.messages.push({"from": from, "text": text});
    setLocalStorage(e);
}

function setSettingsState(key, value) {
    e = getLocalStorage();
    e.settings[key] = value;
    setLocalStorage(e);
}

// handle IE
function newAjaxRequest() {
  var activexmodes=["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"] //activeX versions to check for in IE
  if (window.ActiveXObject) { //Test for support for ActiveXObject in IE first (as XMLHttpRequest in IE7 is broken)
    for (var i=0; i<activexmodes.length; i++) {
      try {
        return new ActiveXObject(activexmodes[i])
      }
      catch (e) {
        //suppress error
      }
    }
  }
  else if (window.XMLHttpRequest) { // if Mozilla, Safari etc
    return new XMLHttpRequest()
  } else {
    return false
  }
}

function minimalizeWebchat() {
    document.getElementById("webchat-minimize").click()
}

function restartWebchat() {
    window.localStorage.removeItem('webchat');
    document.querySelector('#webchat-messages').innerHTML = '';
    setSettingsState("open", 1);
    openWebchatIfNotOpened([1,0,0]);
}

// send message
function sendMessage(message) {
    var xhr = newAjaxRequest();
    var url = window.webchatSettings.url + "/webhooks/rest/webhook";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            setBotResponse(json);
        }
    };

    xhr.timeout = 5000;
    xhr.ontimeout = function () {
        var xhr1 = createCORSRequest('GET', window.webchatSettings.url + "/webhooks/rest/webhook");
        xhr1.timeout = 1000;
        xhr1.ontimeout = function() { setBotResponse(); };
        xhr1.onerror = function() { setBotResponse(); };
        xhr1.send();
    }

    var data = JSON.stringify({"message": message, "sender": window.webchatSettings.sender});
    xhr.send(data);
}

// set responses + scroll to bottom
function setUserResponse (message) {
    var target = document.getElementById("webchat-messages");
    target.insertAdjacentHTML("beforeend", '<div class="message-item outgoing-message"><div class="message-content">' + message +  '</div></div>');
    setMessagesState("user", message);
    setSettingsState("lastaction", new Date().getTime());
    scrollToBottomOfResults();
}

function setBotResponse(response) {
    var target = document.getElementById("webchat-messages");
    setTimeout(function () {
    if (isUndefined(response)) {
        var fallback = "Cant connect, please try again later...";
        var bot_response = '<div class="message-item"><div class="message-content">' + fallback +  '</div></div>';
        target.insertAdjacentHTML("beforeend", bot_response);
        setMessagesState("bot", fallback);
        scrollToBottomOfResults();
    } else {
        for (i = 0; i < response.length; i++) {
            if (response[i].hasOwnProperty("text")) {
                if (response[i].text == "exit") {
                    setTimeout(function () {
                    minimalizeWebchat();
                    }, 2500);
                    continue;
                }
                var bot_response = '<div class="message-item"><div class="message-content">' + response[i].text +  '</div></div>';
                target.insertAdjacentHTML("beforeend", bot_response);
                setMessagesState("bot", response[i].text);
            }
            if (response[i].hasOwnProperty("image")) {
                var bot_response = '<div class="message-item"><div class="message-content"><img class="imgcard" src="' + response[i].image +  '"></div></div>';
                target.insertAdjacentHTML("beforeend", bot_response);
                setMessagesState("bot", '<img class="imgcard" src="' + response[i].image +  '">');
            }
            if (response[i].hasOwnProperty("buttons")) {
                addButtons(response[i].buttons);
            }
        }
        setSettingsState("lastaction", new Date().getTime());
        scrollToBottomOfResults();
        }
    }, 500);
}

function addButtons(response) {
	setTimeout(function () {
        var target = document.getElementById("webchat-messages");
        var buttons = '<div class="widget-buttons">';
        for (i = 0; i < response.length; i++) {
    		buttons += '<div class="widget-chips" data-payload=\'' + (response[i].payload) + '\'>' + response[i].title + '</div>';
    	}
        buttons += "</div>";
        target.insertAdjacentHTML("beforeend", buttons);
        setMessagesState("bot", buttons);
    	scrollToBottomOfResults();
	}, 1000);
}

function scrollToBottomOfResults() {
    document.getElementById("webchat-messages").scrollIntoView(false);
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function isUndefined(obj){
    return obj === void 0;
}

function createCORSRequest(method, url){
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        xhr = null;
    }
    return xhr;
}

var webchatWidget = {
    run: function() {
        injectCSS();
        injectWidget();
        enableWidget();
        openWebchatIfNotOpened(restoreState());
        var re = 1;
        var chat_id = getCookie("chat_id");
        if (!chat_id) {
            re = 0;
            chat_id = uuidv4();
            setCookie("chat_id", chat_id, 365);
        }
        window.webchatSettings.sender = chat_id;
    },
    init: function() {
        // if is alive
        var xhr = createCORSRequest('GET', window.webchatSettings.url + "/webhooks/rest/webhook");
        xhr.onload = function() { webchatWidget.run(); };
        xhr.send();
    }
};
webchatWidget.init();
