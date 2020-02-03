var botCount = 0;
var questionIds = [];
var questions = [];
var room;
var hash;
var socketsOpen = [];
var botAnswerIndex = 0;
var windowWidth = 0;
var gameType;
var currentBox;
var findingGames = 0;
var players = [];

function initiate() {
    if (questionIds.length == 0) {
        if (room == null) {
            var handle = function (response) {
                if (response != null) {
                    if (response != "" && response.length == 6) {
                        room = response;
                        setupGameInfo();
                    } else {
                        if (response == "") {
                            openMainMenu();
                        } else {
                            var cont = new ContentBox();
                            cont.openBox("Error", "Your game ID was either blank or was not of appropriate length.");
                        }
                    }
                }
            }
            var inputBox = new InputBox(handle);
            inputBox.openBox("Enter the game ID", "number");
        }
    } else {
        openMainMenu();
    }
}
/*
var handle_2 = function (response) {
    if (response != null) {
        if (!response) {

        } else {

        }
    }
    selectBox.setHandler(handle_2);
    selectBox.openBox("Options:", "+", "-", "green", "red");
}
*/

document.addEventListener("keyup", function (event) {
    if (document.getElementById("closePrompt")) {
        event.stopImmediatePropagation();
    }
});
var obfs = function () {

    var codes = JSON.parse('{"v2/join":["roomHash"],"v2/rejoin":["roomHash",3,5],"v2/getQuestions":["roomHash",3,8],"v2/proceedGame":["questionId",3,6],"v2/playerGameOver":["roomHash",3,8]}');

    var f = function (n, t) {
        var e = codes[t]
          , a = replac(n, e[0]);
        a = a || t;
        var r = a.length;
        return e[1] && e[2] && (r = e[1]),
        a.slice(0, r)
    }

    var o = function (n, t, e) {
        switch (e.length) {
            case 0:
                return n.call(t);
            case 1:
                return n.call(t, e[0]);
            case 2:
                return n.call(t, e[0], e[1]);
            case 3:
                return n.call(t, e[0], e[1], e[2])
        }
        return n.apply(t, e)
    }

    var a = function (n) {
        for (var t = 1; t < arguments.length; t++) {
            var e = null != arguments[t] ? arguments[t] : {}
              , a = Object.keys(e);
            "function" == typeof Object.getOwnPropertySymbols && (a = a.concat(Object.getOwnPropertySymbols(e).filter(function (n) {
                return Object.getOwnPropertyDescriptor(e, n).enumerable
            }))),
            a.forEach(function (t) {
                r(n, t, e[t])
            })
        }
        return n
    }

    var isString = function (a) {
        return typeof a == "string"
    }

    var r = function (n, t, e) {
        return t in n ? Object.defineProperty(n, t, {
            value: e,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : n[t] = e,
        n
    }

    var ab = function (n, t) {
        var e = n + t;
        return e > u ? b + (e - u) - 1 : e < b ? u - (b - e) + 1 : e
    }

    var obfuscateData = function (n, t, e) {
        return doObfuscation(n, t || m, {
            resultModifier: function (n, t) {
                var e = doObfuscation(t, m)
                   , a = String.fromCharCode(p + e.length);
                return "".concat(e).concat(n).concat(a).concat(w)
            },
            keySumExtractor: function (n, b) {
                return n.charCodeAt(0) + n.charCodeAt(n.length - 1)
            },
            offsetAdder: function (n, t, e, a) {
                return e % 2 == 0 ? a(n, t) : a(n, -t)
            },
            miscDataForLogging: e
        })
    }

    var m = "quizizz.com"
          , p = 33
          , u = 65535
          , b = 0
          , w = 1;

    this.obfuscate = function (n, t) {
        var e = n.messageName
          , r = n.payload
          , i = (n.count,
        n.timeout,
        a({}, n));
        switch (e) {
            case "v2/join":
            case "v2/rejoin":
            case "v2/getQuestions":
            case "v2/proceedGame":
            case "v2/playerGameOver":
                var o = f(r, e);
                i.payload = {
                    odata: (0,
                    obfuscateData)(JSON.stringify(i.payload), o, e)
                }
        }
        return i
    }

    var replac = function (a, b) {
        if (b == "questionId" || b == "roomHash") {
            switch (b) {
                case "questionId":
                    return a.questionId;
                default:
                    return a.roomHash;
            }
        }
        return JSON.stringify(a) != "{}" ? a : b;

    }

    var g = {
        resultModifier: function (n, t) {
            return n;
        },
        keySumExtractor: function (n, b) {
            return n.charCodeAt(0);
        },
        offsetAdder: function (n, t, e, a) {
            return a(n, t);
        },
        miscDataForLogging: ""
    }

    v = {
        stringModifier: function (n, t, e) {
            return n
        },
        keySumExtractor: function (n, t) {
            return n.charCodeAt(0)
        },
        offsetAdder: function (n, t, e, a) {
            return a(n, t)
        },
        miscDataForLogging: ""
    }

    var isFunction = function (functionToCheck) {
        return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
    }

    var doObfuscation = function (n, t) {
        var e = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        e = replac(e, g);
        for (var a = isFunction(t) ? t(n, e) : t, r = "", i = e.keySumExtractor(a, n), o = 0; o < n.length; o++) {
            var s = n.charCodeAt(o)
              , c = e.offsetAdder(s, i, o, ab);
            r += String.fromCharCode(c)
        }
        var d = e.resultModifier(r, a, i);
        return d
    }

    var doDeobfuscation = function (n, t) {
        var e = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        e = replac(e, v);
        var a = ""
          , r = isFunction(t) ? t(n, e) : t
          , i = -e.keySumExtractor(r, n)
          , o = e.stringModifier(n, r, i);
        isString(o) || (o = n);
        for (var s = 0; s < o.length; s++) {
            var c = o.charCodeAt(s)
              , d = e.offsetAdder(c, i, s, ab);
            a += String.fromCharCode(d)
        }
        return a
    }

    var i = function () {
        var n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : ""
          , t = (arguments.length > 1 && arguments[1],
        n.charCodeAt(n.length - 2) - p);
        return doDeobfuscation(n.slice(0, t), m)
    }

    this.deObfuscateData = function (n, t) {
        return doDeobfuscation(n, i, {
            stringModifier: function (n, t, e) {
                var a = n.charCodeAt(n.length - 2) - p;
                return n.slice(a, -2)
            },
            keySumExtractor: function (n, b) {
                return n.charCodeAt(0) + n.charCodeAt(n.length - 1)
            },
            offsetAdder: function (n, t, e, a) {
                return e % 2 == 0 ? a(n, t) : a(n, -t)
            },
            miscDataForLogging: t
        })
    }

}

function openMainMenu() {
    var handle = function (response) {
        if (response != null) {
            if (!response) {
                if (!hash) {
                    infobox.openBox("Error", "This function is currently disabled. Enter a game ID to continue.");
                    return;
                }
                var handle_1 = function (response) {
                    if (response != null) {
                        if (!response) {
                            var handle_2 = function (response) {
                                var playerName = response;
                                if (response != null && response != "") {
                                    var handle_3 = function (response) {
                                        if (response != null) {
                                            if (parseInt(response) == 0) {
                                                changePlayerScore(playerName, false, parseInt(response));
                                            } else {
                                                changePlayerScore(playerName, true, parseInt(response));
                                            }
                                        }
                                    }
                                    inputBox.setHandler(handle_3);
                                    inputBox.openBox("Enter the players score (very high scores may not be registered correctly)", "number");
                                }
                            }
                            inputBox.setHandler(handle_2)
                            inputBox.openBox("Enter the player's username");

                        } else {
                            var obj = JSON.parse(localStorage.previousContext);
                            var playerName = obj.currentPlayer.playerId;
                            var handle_2 = function (response) {
                                if (response != null) {
                                    var handle_2 = function (response) {
                                        if (response != null) {
                                            if (parseInt(response) == 0) {
                                                changePlayerScore(playerName, false, parseInt(response), response);
                                            } else {
                                                changePlayerScore(playerName, true, parseInt(response), response);
                                            }
                                        }
                                    }
                                    inputBox.setHandler(handle_2)
                                    inputBox.openBox("Enter the average time to answer each question (seconds)", "number");

                                }
                            }
                            if (playerName != null) {
                                inputBox.setHandler(handle_2);
                                inputBox.openBox("Enter a score (very high scores may not be registered correctly)", "number");
                            } else {
                                infobox.openBox("Error", "You are not in the game!");
                            }
                        }
                    }
                }
                selectBox.setHandler(handle_1);
                selectBox.openBox("Options:", "Other players", "Yourself", "#999900", "#999900");
            } else {
                if (response == 2) {
                    var handle_1 = function (response) {
                        if (response != null) {
                            if (response != 2) {
                                if (!hash) {
                                    infobox.openBox("Error", "This function is currently disabled. Enter a game ID to continue.");
                                    return;
                                }
                                if (socketsOpen.length == 0) {
                                    var generatedSid = [];
                                    generateSid(generatedSid);
                                    setTimeout(function () {
                                        var sock = new SpoofedSocket(room, generatedSid[0]);
                                        sock.addBots = true;
                                        socketsOpen.push(sock);
                                        setTimeout(function () {
                                            sock.changeGameState(!response ? "start" : "");
                                        }, 500);
                                    }, 500);
                                } else
                                    socketsOpen[0].changeGameState(!response ? "start" : "");
                            } else {
                                var handler_2 = function (response) {
                                    if (response != null) {
                                        if (response == 2) {
                                            var handler_3 = function (response) {
                                                if (!response) {
                                                    if (!hash) {
                                                        infobox.openBox("Error", "This function is currently disabled. Enter a game ID to continue.");
                                                        return;
                                                    }
                                                    if (socketsOpen.length == 0) {
                                                        var generatedSid = [];
                                                        generateSid(generatedSid);
                                                        setTimeout(function () {
                                                            var sock = new SpoofedSocket(room, generatedSid[0]);
                                                            sock.addBots = true;
                                                            sock.playersToKick = sock.playersToKick.concat(players);
                                                            socketsOpen.push(sock);
                                                        }, 500);
                                                    } else {
                                                        socketsOpen[0].playersToKick = socketsOpen[0].playersToKick.concat(players);
                                                    }
                                                } else {
                                                    if (response == 2) {

                                                        var handle_4 = function (response) {
                                                            if (response != null) {
                                                                if (!response) {
                                                                    var data = JSON.stringify(players);
                                                                    infobox.openBox("Players:", data);
                                                                } else {                                                                 

                                                                }
                                                            }
                                                        }
                                                        selectBox.setHandler(handle_4);
                                                        selectBox.openBox("Options:", "List Player Names", "Get Current Answer", "#999900", "#999900");
                                                    } else {
                                                        infobox.openBox("Error", "This function has been disabled, as it is too harmful.");                                              
                                                    }
                                                }
                                            }
                                            selectBox.setHandler(handler_3);
                                            selectBox.openBox("Options: ", "Kick All Players", "Find Live Games", "red", "#999900");
                                            selectBox.addButton("List Player Names");
                                        } else {
                                            if (!hash) {
                                                infobox.openBox("Error", "This function is currently disabled. Enter a game ID to continue.");
                                                return;
                                            }
                                            if (!response) {
                                                var handler_3 = function (response) {
                                                    if (socketsOpen.length == 0) {
                                                        var generatedSid = [];
                                                        generateSid(generatedSid);
                                                        setTimeout(function () {
                                                            var sock = new SpoofedSocket(room, generatedSid[0]);
                                                            sock.addBots = true;
                                                            sock.playersToKick.push(response);
                                                            socketsOpen.push(sock);
                                                        }, 500);
                                                    } else {
                                                        socketsOpen[0].playersToKick.push(response);
                                                    }
                                                }
                                                inputBox.setHandler(handler_3);
                                                inputBox.openBox("Enter the player name to kick");
                                            } else {
                                                if (players.length == 0) {
                                                    infobox.openBox("Error", "No players were in the game when you first connected. Reload and reconnect with the game ID to try again.")
                                                    return;
                                                }
                                                else {
                                                    var handler_2 = function (response) {
                                                        if (response != null) {
                                                            for (var x in players) {
                                                                changePlayerScore(players[x], !response);
                                                            }
                                                        }
                                                    }
                                                    selectBox.setHandler(handler_2);
                                                    selectBox.openBox("Options:", "+", "-", "green", "red");
                                                }
                                            }
                                        }
                                    }
                                }
                                selectBox.setHandler(handler_2);
                                selectBox.openBox("Options: ", "Kick Player", "Change All Scores", "red", "red");
                                selectBox.addButton("Other");
                            }
                        }
                    }
                    selectBox.setHandler(handle_1);
                    selectBox.openBox("Options: (The first two only work for live games)", "Start Game", "End Game", "red", "red");
                    selectBox.addButton("Other");
                } else {
                    if (!hash) {
                        infobox.openBox("Error", "This function is currently disabled. Enter a game ID to continue.");
                        return;
                    }
                    var handle_1 = function (response) {
                        if (response != null) {
                            if (!response) {
                                if (socketsOpen.length == 0) {
                                    infobox.openBox("Error", "No bots have been added!");
                                } else {
                                    var handle_2 = function (response) {
                                        if (response != null) {
                                            for (var x = botAnswerIndex; x < botAnswerIndex + 5; x++, botAnswerIndex++) {
                                                if (socketsOpen[0].botNames.length - 1 < x) {
                                                    return;
                                                }
                                                socketsOpen[0].submitBotAnswer(socketsOpen[0].botNames[x], !response);
                                            }
                                        }
                                    }
                                    selectBox.setHandler(handle_2);
                                    selectBox.openBox("Options:", "+", "-", "green", "red");
                                }
                            } else {
                                var handle_2 = function (response) {
                                    if (response != null) {
                                        var numberOfBots = parseInt(response);
                                        if (numberOfBots < 201) {
                                            var handle_3 = function (response) {
                                                if (response != null) {
                                                    if (!response) {
                                                        var handle_4 = function (response) {
                                                            if (response != null && response != "" /*&& response.length <= 24*/) {
                                                                var generatedSid = [];
                                                                generateSid(generatedSid);
                                                                setTimeout(function () {
                                                                    botCount += numberOfBots;
                                                                    if (socketsOpen.length == 0) {
                                                                        var sock = new SpoofedSocket(room, generatedSid[0]);
                                                                        sock.addBots = true;
                                                                        sock.keyword = response;
                                                                        socketsOpen.push(sock);
                                                                    } else {
                                                                        socketsOpen[0].keyword = response;
                                                                    }
                                                                }, 500);

                                                            }
                                                        }
                                                        inputBox.setHandler(handle_4);
                                                        inputBox.openBox("Enter the keyword to be used");
                                                    } else {
                                                        var generatedSid = [];
                                                        generateSid(generatedSid);
                                                        setTimeout(function () {
                                                            botCount += numberOfBots;
                                                            if (socketsOpen.length == 0) {
                                                                var sock = new SpoofedSocket(room, generatedSid[0]);
                                                                sock.addBots = true;
                                                                socketsOpen.push(sock);
                                                            } else {
                                                                socketsOpen[0].keyword = null;
                                                            }
                                                        }, 500);

                                                    }
                                                }
                                            }
                                            selectBox.setHandler(handle_3);
                                            selectBox.openBox("Use a keyword in the bot names?", "Yes", "No", "#999900", "#999900");
                                        } else {
                                            infobox.openBox("Error", "No more than 200 bots may be added at once.");
                                        }
                                    }
                                }
                                inputBox.setHandler(handle_2);
                                inputBox.openBox("Enter the number of bots (200 or fewer)", "number");
                            }
                        }
                    }
                    selectBox.setHandler(handle_1);
                    selectBox.openBox("Options:", "Bot scoring", "Add bots", "#999900", "#999900");
                }
            }
        }
    }

    var inputBox = new InputBox();
    var selectBox = new SelectionBox(handle);
    var infobox = new ContentBox();

    if (!currentBox) {
        selectBox.openBox("Options:", "Scoring", "Botting", "#999900", "#999900");
        selectBox.addButton("Other");
    }
}

function changePlayerScore(playerName, positive, score, time) {
    var obfsObj = new obfs();
    var help = getCompat(questionIds.length, score);
    var firstTime = time;
    for (var x in questionIds) {
        var neg = Math.random();
        var deviation = Math.floor(Math.random() * (8 - 3) + 3);
        time = ((time != null) ? Math.abs(parseInt((((neg < 0.5) ? (parseInt(time) + deviation) : (parseInt(time) - deviation))).toString() + "057")) : 10000);
        var request = new XMLHttpRequest();
        request.open("POST", "https://game.quizizz.com/play/v2/proceedGame");
        request.setRequestHeader("Content-type", "application/json");
        request.setRequestHeader("Accept", "application/json");
        var preData = { "messageName": "v2/proceedGame", "payload": { "roomHash": "a", "playerId": "abcd", "questionId": "57ec0995af7ede4572337913", "response": { "questionId": "57ec0995af7ede4572337913", "isCorrect": false, "timeTaken": ((time != 0) ? time : 0), "response": 3, "score": 0, "type": "MCQ" } } };
        preData.payload.response.isCorrect = positive || false;
        preData.payload.response.score = score ? x == 0 ? help[0] + help[1] : help[1] : (positive ? Math.floor(Math.random() * 1000000) : -Math.floor(Math.random() * 1000000));
        preData.payload.questionId = preData.payload.response.questionId = questionIds[x];
        preData.payload.roomHash = hash;
        preData.payload.playerId = playerName;
        var data = JSON.stringify(obfsObj.obfuscate(preData, null).payload);
        request.send(data);
        time = firstTime;
    }
}

function changePlayerScorePercent(playerName, positive, score, time, percent) {
    var obfsObj = new obfs();
    var help = getCompat(questionIds.length, score);
    var firstTime = time;
    var firstPercent = percent;
    for (var x in questionIds) {
        var neg = Math.random();
        var deviation = Math.floor(Math.random() * (8 - 3) + 3);
        time = ((time != null) ? Math.abs(parseInt((((neg < 0.5) ? (parseInt(time) + deviation) : (parseInt(time) - deviation))).toString() + "057")) : 10000);
        var request = new XMLHttpRequest();
        request.open("POST", "https://game.quizizz.com/play/v2/proceedGame");
        request.setRequestHeader("Content-type", "application/json");
        request.setRequestHeader("Accept", "application/json");
        var preData = { "messageName": "v2/proceedGame", "payload": { "roomHash": "a", "playerId": "abcd", "questionId": "57ec0995af7ede4572337913", "response": { "questionId": "57ec0995af7ede4572337913", "isCorrect": false, "timeTaken": ((time != 0) ? time : 0), "response": 3, "score": 0, "type": "MCQ" } } };
        preData.payload.response.isCorrect = positive || false;
        preData.payload.response.score = score ? x == 0 ? help[0] + help[1] : help[1] : (positive ? Math.floor(Math.random() * 1000000) : -Math.floor(Math.random() * 1000000));
        preData.payload.questionId = preData.payload.response.questionId = questionIds[x];
        preData.payload.roomHash = hash;
        preData.payload.playerId = playerName;
        var data = JSON.stringify(obfsObj.obfuscate(preData, null).payload);
        request.send(data);
        time = firstTime;
    }
}

function InputBox(handler) {
    if (document.getElementById("closePrompt")) {
        handler();
        return;
    }
    var embeddedDiv = document.createElement("div");
    var self = this;
    this.handler = handler;

    var closeButton, inputField, okButton;

    this.openBox = function (query, inputtype) {
        var divData = '<div id="overlayBack" style="background-color: white; opacity: 0.55; display: block; position: fixed; width: 100%; top: 0px; left: 0px; z-index:10; height: 100%"></div><div id="selectionBox" style="display:block; margin: 8px; width: 550px; box-shadow: 0 0 3pt 10pt black; text-align:center; border-radius: 10px; left: ' + ((windowWidth / 2 - 275) + "px") + '; top: 100px; position: fixed; z-index:11">    <div>        <div id="headerSelbox" style="background-color: dimgrey; font: 20px Helvetica; padding: 15px; ">            <button id="closePrompt" style="background-color: red; color: white; padding: 3px 17px; border: 2px solid red; font: 15px arial; float: right">X</button>            <div id="questionText">Question goes here?</div>        </div>        <div id="contentSelbox" style="background-color:darkgrey; padding: 20px">            <input id="inputField" style="background-color: red; padding: 10px 25px; font: 15px arial; border: 2px solid black" type="' + ((inputtype != null) ? inputtype : "text") + '" maxlength="1000"/>            <button id="submitOption" style="background-color: darkgoldenrod; color: white; padding: 10px 25px; border: 2px solid black; font: 15px arial">Ok</button>        </div>        <div id="footerSelbox" style="background-color: dimgrey; padding: 10px"></div>    </div></div>';

        embeddedDiv.innerHTML = divData;
        document.body.appendChild(embeddedDiv);

        closeButton = document.getElementById("closePrompt");
        inputField = document.getElementById("inputField");
        okButton = document.getElementById("submitOption");

        if (query != null) {
            document.getElementById("questionText").innerText = query;
        }
        embeddedDiv.style.display = "block";

        closeButton.addEventListener("click", function () {
            self.closeBox();
            self.handler();
        });

        okButton.addEventListener("click", function () {
            self.closeBox();
            self.handler(inputField.value);
        });
        currentBox = this;
    }

    this.closeBox = function (hand) {
        embeddedDiv.remove();
        currentBox = null;
        if (hand)
            handler()
    }

    this.setHandler = function (newHandler) {
        self.handler = newHandler;
    }

}

function ContentBox() {
    if (document.getElementById("closePrompt")) {
        handler();
        return;
    }
    var embeddedDiv = document.createElement("div");
    var self = this;

    var closeButton, title, content;

    this.openBox = function (titletext, contenttext) {
        var divData = '<div id="overlayBack" style="background-color: white; opacity: 0.55; display: block; position: fixed; width: 100%; top: 0px; left: 0px; z-index:10; height: 100%"></div>    <div id="selectionBox" style="display:block; margin: 8px; width: 550px; box-shadow: 0 0 3pt 10pt black; text-align:center; border-radius: 10px; left: ' + ((windowWidth / 2 - 275) + "px") + '; top: 100px; position: fixed; z-index:11">        <div>            <div id="headerSelbox" style="background-color: dimgrey; font: 20px Helvetica; padding: 15px; ">                <button id="closePrompt" style="background-color: red; color: white; padding: 3px 17px; border: 2px solid red; font: 15px arial; float: right">X</button>                <div id="titleContent">Alert!</div>            </div>            <div id="contentSelbox" style="background-color:darkgrey; padding: 3px; height: 350px">                <div id="contentInBox" style="font: 17px arial;">Alert message.</div>            </div>            <div id="footerSelbox" style="background-color: dimgrey; padding: 10px"></div>        </div>    </div>'
        embeddedDiv.innerHTML = divData;
        document.body.appendChild(embeddedDiv);

        closeButton = document.getElementById("closePrompt");
        title = document.getElementById("titleContent");
        content = document.getElementById("contentInBox");

        if (contenttext != null) {
            content.innerText = contenttext;
        }
        if (titletext != null) {
            title.innerText = titletext;
        }
        embeddedDiv.style.display = "block";

        closeButton.addEventListener("click", function () {
            self.closeBox();
        });
        currentBox = this;
    }

    this.closeBox = function () {
        embeddedDiv.remove();
        currentBox = null;
    }
}

function SelectionBox(handler) {
    if (document.getElementById("closePrompt")) {
        handler();
        return;
    }
    var embeddedDiv = document.createElement("div");
    var self = this;

    var closeButton, buttonOne, buttonTwo;
    this.handler = handler;
    this.openBox = function (query, button1, button2, button1color, button2color) {
        var divData = '<div id="overlayBack" style="background-color: white; opacity: 0.65; display: block; position: fixed; width: 100%; height: 100%; top: 0px; left: 0px; z-index:10"></div><div id="selectionBox" style="display:block; margin: 8px; width: 550px; box-shadow: 0 0 3pt 10pt black; text-align:center; border-radius: 10px; left: ' + ((windowWidth / 2 - 275) + "px") + '; top: 100px; position: fixed; z-index:11">    <div>        <div id="headerSelbox" style="background-color: dimgrey; font: 20px Helvetica; padding: 15px; ">            <button id="closePrompt" style="background-color: red; color: white; padding: 3px 17px; border: 2px solid red; font: 15px arial; float: right">X</button>            <div id="questionText" style="color: black">Alert!</div>        </div>        <div id="contentSelbox" style="background-color:darkgrey; padding: 20px">            <button id="optionOneB" style="background-color: ' + ((button1color != null) ? button1color : "darkgoldenrod") + '; color: white; padding: 10px 25px; border: 2px solid black; font: 15px arial">Ok</button>            <button id="optionTwoB" style="background-color: ' + ((button2color != null) ? button2color : "darkgoldenrod") + '; color: white; padding: 10px 25px; border: 2px solid black; font: 15px arial">Cancel</button>            <button id="addedButton" style="background-color: #999900; color: white; padding: 10px 25px; border: 2px solid black; font: 15px arial"></button>        </div>        <div id="footerSelbox" style="background-color: dimgrey; padding: 10px"></div>    </div></div>'
        embeddedDiv.innerHTML = divData;
        document.body.appendChild(embeddedDiv);

        closeButton = document.getElementById("closePrompt");
        buttonOne = document.getElementById("optionOneB");
        buttonTwo = document.getElementById("optionTwoB");
        buttonThree = document.getElementById("addedButton");
        buttonThree.style.display = "none";

        if (button1 != null) {
            buttonOne.innerText = button1;
        }
        if (button2 != null) {
            buttonTwo.innerText = button2;
        }
        if (query != null) {
            document.getElementById("questionText").innerText = query;
        }
        embeddedDiv.style.display = "block";

        closeButton.addEventListener("click", function () {
            self.closeBox();
            self.handler();
        });

        buttonOne.addEventListener("click", function () {
            self.closeBox();
            self.handler(0);
        });

        buttonTwo.addEventListener("click", function () {
            self.closeBox();
            self.handler(1);
        });

        buttonThree.addEventListener("click", function () {
            if (buttonThree.innerText != "") {
                self.closeBox();
                self.handler(2);
            }
        });
        currentBox = this;
    }

    this.addButton = function (text) {
        document.getElementById("addedButton").style.display = "inline";
        document.getElementById("addedButton").innerText = text;
    }

    this.setHandler = function (newHandler) {
        self.handler = newHandler;
    }

    this.closeBox = function (hand) {
        document.getElementById("addedButton").innerText = "";
        embeddedDiv.remove();
        currentBox = null;
        if (hand)
            handler()
    }
}

function generateSid(ref) {
    var response;
    var request = new XMLHttpRequest();
    request.open("GET", "https://socket.quizizz.com/socket.io/?EIO=3&transport=polling&t=MRbG7sl");
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            response = request.response;
            var a = response.split('sid":"')[1];
            response = a.split('","u')[0];
            ref.push(response);
        }
    }
    request.send();
}

function setupGameInfo() {
    var h = [];
    generateSid(h);
    setTimeout(function () {
        if (h != null) {
            var socket = new SpoofedSocket(room, h);
            socket.reopen = false;
            setTimeout(function () {
                if (socket.hash == null) {
                    room = null;
                    var inf = new ContentBox();
                    inf.openBox("Error", "Invalid game id");
                    return;
                }
                questionIds = socket.questionIds;
                questions = socket.questions;
                console.log(questions);
                hash = socket.hash;
                socket.closeSocket();
            }, 3000);
        }
    }, 500);

}

function fixString(toFix) {
    var numberOfI = (toFix.match(/\\/g) || []).length;
    for (var x = 0; x < numberOfI; x++) {
        var ind = toFix.indexOf("\\");
        if (ind == -1) {
            return toFix;
        }
        var ind_2 = ind + 6;
        if (toFix[ind + 1] != "u") {
            ind_2 = ind + 2;
        }
        var toReplace = toFix.substring(ind, ind_2);
        toFix = toFix.replace(toReplace, eval("'" + toReplace + "'"));
    }
    return toFix;
}

function getCompat(numberOfQuestions, score) {
    for (var x = Math.abs(score) ; x > 0; x--) {
        if (Number.isInteger(x / numberOfQuestions)) {
            return [score > 0 ? score - x : score + x, score > 0 ? x / numberOfQuestions : -x / numberOfQuestions];
        }
    }
    return [0, 1]
}

function SpoofedSocket(roomId, sid) {
    var self = this;

    this.botNames = [];
    var obfsObj = new obfs();
    var joinMessage = { "messageName": "v2/join", "payload": { "roomHash": "5c0c7b1bf9029d001a723af5", "player": { "id": "abcd", "origin": "web", "isGoogleAuth": false, "avatarId": null, "startSource": "gameCode|typed", "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36", "uid": "e5517258-e0c2-45e4-a0b8-ad24aa5932af", "expName": "avpicker_main", "expSlot": "0" } }, "count": 1, "timeout": 5000 };
    var getQuestionsMessage = { "messageName": "v2/getQuestions", "payload": { "roomHash": "5c0c7b1bf9029d001a723af5" }, "count": 1, "timeout": 5000 }
    var startGame = ["startGame", { "roomHash": "5c0f041372af25001acbf469" }]
    var endGame = ["getReport", { "roomHash": "5c0f041372af25001acbf469" }]
    var kickPlayerR = ["deletePlayer", { "playerId": "", "roomHash": "", "hostId": "" }]
    this.handlerCounts = 0;
    this.addBots = false;
    this.keyword = null;
    var requestsSent = 420;
    var requestLimit = 430;
    this.hash = null;
    this.isClosed = false;
    this.questionIds = [];
    this.questions = [];
    this.reopen = true;
    this.findLiveGames = true;
    var currentCode;
    this.playersToKick = [];
    var hostId;

    this.ws = new WebSocket("wss://socket.quizizz.com/socket.io/?EIO=3&transport=websocket&sid=" + sid);

    this.ws.onopen = function () {
        self.ws.send('2probe');
    };

    this.ws.onmessage = function (event) {
        var recieved = event.data;
        if (recieved === "3probe") {
            self.ws.send("5");
        } else if (recieved === "40") {
            if (!self.findLiveGames)
                self.ws.send(requestsSent++ + '["v2/checkRoom", {"roomCode": "' + roomId + '"}]');
            else
                sendCheckForRoom();
        } else if (recieved.includes('["v2/checkRoom",')) {
            var a = recieved.split('Room","')[1];
            var prefinal = a.split('","ty')[0];
            var final = prefinal.split('"]')[0];
            var deobfuscated = JSON.parse(obfsObj.deObfuscateData(fixString(final), "v2/checkRoom"));
            if (!self.findLiveGames) {
                self.hash = deobfuscated.hash;
                if (self.hash == null) {
                    self.closeSocket();
                }
                var toSendQuestions = getQuestionsMessage;
                toSendQuestions.payload.roomHash = self.hash;
                var toSend = obfsObj.obfuscate(toSendQuestions, null).payload;
                self.ws.send(requestsSent++ + JSON.stringify(["v2/getQuestions", toSend]));
            } else {
                var date, now;
                if (deobfuscated) {
                    date = new Date(deobfuscated.createdAt);
                    now = new Date();
                }
                if (deobfuscated && deobfuscated.type == "live" && deobfuscated.options != null && (now.getHours() - date.getHours() < 1)) {
                    currentBox && currentBox.closeBox(1);
                    new ContentBox().openBox("Game Found", "A live game has been found! The game ID is " + currentCode + ".");
                    findingGames = 0;
                    self.reopen = false;
                    self.ws.close();
                } else {
                    if (requestsSent >= requestLimit) {
                        self.ws.close();
                    } else
                        sendCheckForRoom();
                }
            }
        } else if (recieved.includes('v2/getQuestions')) {
            var prefinal = recieved.split('tions",')[1];
            var whole = JSON.parse(prefinal.substring(0, prefinal.length - 1));
            var final = JSON.parse(prefinal.slice(0, prefinal.length - 1));
            for (var x in final.questions) {
                self.questionIds.push(x);
            }
            for (var x in whole.questions) {
                self.questions.push(whole.questions[x]);
            }
            self.intervalLoop = setInterval(self.handler, 50);
        } else if (recieved.includes('v2/join')) {
            var a = recieved.split('join","')[1];
            var final = a.split('"]')[0];
            var deobfuscated = JSON.parse(obfsObj.deObfuscateData(fixString(final), "v2/join"));
            if (deobfuscated) {
                hostId = deobfuscated.room.hostId;
                if (deobfuscated.room.players) {
                    deobfuscated.room.players.push("");
                    for (var x in deobfuscated.room.players) {
                        if (players.indexOf(deobfuscated.room.players[x].playerId) == -1)
                            players.push(deobfuscated.room.players[x].playerId);
                    }
                } else {

                }
            }
        }
    };

    var sendJoinReq = function (name) {
        if (requestsSent >= requestLimit) {
            self.closeSocket();
        } else {
            var req = joinMessage;
            req.payload.player.id = name;
            req.payload.roomHash = self.hash;
            var toSend = requestsSent++ + JSON.stringify(["v2/join", obfsObj.obfuscate(req, null).payload]);
            self.ws.send(toSend);
        }
    }

    var sendCheckForRoom = function () {
        var code = "";
        for (var x = 0; x < 6; x++) {
            code += Math.floor(Math.random() * 10).toString();
        }
        currentCode = code;
        self.ws.send(requestsSent++ + '["v2/checkRoom", {"roomCode": "' + code + '"}]');
    }

    this.ws.onclose = function () {
        clearInterval(self.intervalLoop);
        if (self.reopen) {
            var generatedSid = [];
            generateSid(generatedSid);
            setTimeout(function () {
                var sock = new SpoofedSocket(room, generatedSid[0]);
                sock.keyword = self.keyword;
                sock.botNames = self.botNames;
                sock.addBots = self.addBots;
                sock.findLiveGames = self.findLiveGames;
                sock.playersToKick = self.playersToKick;
                if (!self.findLiveGames) {
                    socketsOpen.pop();
                    socketsOpen.push(sock);
                } else
                    findingGames = 1;
            }, 500);
        }
    }

    this.intervalLoop;

    var kickPlayer = function (name) {
        var req = kickPlayerR;
        req[1].hostId = hostId;
        req[1].playerId = name;
        req[1].roomHash = hash;
        var toSend = requestsSent++ + (JSON.stringify(req));
        self.ws.send(toSend);
    }

    this.handler = function () {
        self.handlerCounts += 50;
        if (requestsSent >= requestLimit) {
            self.closeSocket();
        } else {
            if (self.playersToKick.length != 0) {
                kickPlayer(self.playersToKick[self.playersToKick.length - 1]);
                self.playersToKick.pop();
            }
            if (self.addBots) {
                if (botCount > 0) {
                    self.addBot();
                    botCount--;
                }
            }
        }
        if ((self.handlerCounts / 1000) > 10) {
            self.ws.send('2');
            self.handlerCounts = 0;
        }
    }

    this.generateBotName = function () {
        if (self.keyword == null) {
            return Math.floor(Math.random() * 1000000);
        } else {
            var name = self.randomlyCapatalize(self.keyword);
            if (self.botNames.indexOf(name) == -1) {
                return name;
            } else {
                if (name.length < 22)
                    return self.botNames.indexOf(name + "_" + Math.floor(Math.random() * 10000)) == -1 ? name + "_" + Math.floor(Math.random() * 10000) : Math.floor(Math.random() * 1000000);
            }
        }
    }

    this.randomlyCapatalize = function (word) {
        var length = word.length;
        var newWord = "";
        for (var x in word) {
            if (Math.round(Math.random())) {
                newWord += isLowerCase(word[x]) ? word[x].toUpperCase() : word[x].toLowerCase();
            } else {
                newWord += word[x];
            }
        }
        return newWord;
    }

    var isLowerCase = function (char) {
        return char == char.toLowerCase();
    }

    this.changeGameState = function (state) {
        requestLimit++;
        var preData;
        if (state == "start")
            preData = startGame;
        else
            preData = endGame;
        preData[1].roomHash = self.hash;
        var data = requestsSent++ + (JSON.stringify(preData));
        self.ws.send(data);
    }

    this.addBot = function () {
        var generatedName = self.botNames.indexOf(self.keyword) == -1 && self.keyword != null ? self.keyword : self.generateBotName();
        self.botNames.push(generatedName.toString());
        var preToSend = joinMessage;
        preToSend.payload.player.id = generatedName.toString();
        preToSend.payload.roomHash = self.hash;
        var toSend = requestsSent++ + JSON.stringify(["v2/join", obfsObj.obfuscate(preToSend, null).payload]);
        self.ws.send(toSend);
    }

    this.submitBotAnswer = function (name, positive) {
        changePlayerScore(name, positive);
    }

    this.closeSocket = function () {
        self.ws.close();
    }

}
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
      if (request.message === "clicked_browser_action") {
          initiate();
          console.log("wus goo2d");
      }
  }
);

var srcInject = chrome.extension.getURL("toInject.js");
var objInject = document.createElement("script");
objInject.src = srcInject;
document.head.appendChild(objInject);

document.addEventListener("recieveWidth", function (recieved) {
    windowWidth = recieved.detail;
})
