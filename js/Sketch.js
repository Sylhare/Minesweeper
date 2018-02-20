var board;
var timer = new Timer();
var WIN = {
    name: "win",
    //img: "../img/trophy.svg" // uncomment if on a local server 
    text: ["Congratulation!", "br", "you beat the game!"]
};
var LOSE = {
    name: "lose",
    //img: "../img/skull.svg", //if on a local server
    text: ["BOOOM !!", "br", "you've exploded!"]
};


/*
------------------------------------------------------------------

                        DOM Modifications

------------------------------------------------------------------
*/

function createCanvas(body, id, width, height) {
    /* Create a canvas and but it in "body" can be any tagnamed element, id, width and height of teh canvas can be configured */
    var canvas = document.createElement("canvas");

    canvas.id = id || "board";
    canvas.width = width || 258;
    canvas.height = height || 258;
    //canvas.oncontextmenu = "javascript:return false;";

    body.appendChild(canvas);

    return document.getElementById(canvas.id);
}

function updateTextNode(id, text) {
    /* Update text node of the defined id with text */
    var node = document.getElementById(id);
    node.textContent = text || "error"; //Firefox
    node.innerText = text || "error"; //IE
}

function addTextNode(parentId, text, id) {
    /* Add a text node under a parentId with a defined id in the HTML */
    var element = document.createElement("span");
    var p = text || "error";
    var node = document.createTextNode(p);
    var parent = document.getElementById(parentId);

    element.appendChild(node);
    element.id = id || "info";
    element.classList.add("info");

    parent.appendChild(element);
    //parent.insertBefore(element, parent.childNodes[0]);
}

function removeChildren(parent) {
    /* Remove all children from the id node */
    var p = document.getElementById(parent) || parent;

    while (p.firstChild) {
        p.removeChild(p.firstChild);
    }
}

function addAlert(type) {
    /* Add a custom alert with a text as the message and type win or lose */
    var text, content = document.getElementById("customAlert-content");

    timer.stop();
    removeChildren(content);

    for (var i = 0; i < type.text.length; i++) {
        text = type.text[i];
        if (text === "br") {
            content.appendChild(document.createElement(text));
        } else {
            content.appendChild(document.createTextNode(text));
        }
    }
    document.getElementById("alertContainer").style.visibility = "visible";
    document.getElementById("alert-img").src = type.img;
}

function removeAlert() {
    /* Remove the custom alert */

    document.getElementById("alertContainer").style.visibility = "hidden";
    setup(document.getElementById("board")); // restart the game, /!\ "board" is default value  
}


/*
------------------------------------------------------------------

                        Listeners

------------------------------------------------------------------
*/

function getMousePos(canvas, evt) {
    /* Return the position of the mouse within the canvas */
    var rect = canvas.getBoundingClientRect();
    return {
        x: Math.round(evt.clientX - rect.left),
        y: Math.round(evt.clientY - rect.top)
    };
}

function addListener(canvas, event) {
    /* Creates the listener to catch events in the canvas */

    canvas.addEventListener(event, function (evt) {
        var pos = getMousePos(canvas, evt);
        evt.preventDefault(); // Prevent the default behaviour of the event (for right click)
        board.update(pos.x, pos.y, evt.type, canvas);
    });
}

function addStartListener(canvas, event) {
    /* the listener for the start of the game */

    var handler = function () {
        timer.start();
        setTimer("timer");
    };

    canvas.addEventListener(event, handler, {once: true});

}

function addExplodeListener(canvas) {
    /* Creates the listener and handler for the explode event in the board */

    canvas.addEventListener("explode", function (evt) {
        var explosion = new Explosion(evt.detail.x, evt.detail.y);
        var exploding = setInterval(function () {
            board.draw(canvas);
            explosion.update(canvas);
        }, 1000 / 15);
        // So we don't have too many running
        setTimeout(function () {
            clearInterval(exploding);
        }, 900);
    }, false);
}

function addStatusListener(canvas) {
    /* Adds listener for the game status (win or lose) */

    canvas.addEventListener(WIN.name, function () {
        addAlert(WIN);
    }, false);

    canvas.addEventListener(LOSE.name, function () {
        setTimeout(function () {
            addAlert(LOSE);
        }, 500);

    }, false);

}


/*
------------------------------------------------------------------

                        Game start up

------------------------------------------------------------------
*/


function setTimer(id) {
    /* Set the timer and update the html with the specified id */

    setInterval(function () {
        updateTextNode(id, timer.counter);
    }, 1000);
}

function setup(canvas) {
    /* Setup the minesweeper game */

    timer.reset();

    board = new Board(64);
    //board = new Board(canvas);
    board.draw(canvas);

    updateTextNode("mines", board.mineNumber);
    addStartListener(canvas, "click");
}

window.onload = function () {
    /* Main of the program, defines what is being done when the page loads */

    var body = document.getElementById("game");
    //var body = document.getElementsByTagName("body")[0];
    var canvas = createCanvas(body); //Used also in Zone.js and Board.js to draw the game
    var ctx = canvas.getContext("2d");

    addListener(canvas, "mousemove");
    addListener(canvas, "click");
    addListener(canvas, "contextmenu");
    addExplodeListener(canvas);
    addStatusListener(canvas);
    addTextNode("game-info", 0, "mines");
    setup(canvas);
    //setTimer("timer");
};


/* So that you can load the image without a local server (still need internet); */
WIN.img = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjQ0OS4xOTlweCIgaGVpZ2h0PSI0NDkuNDM4cHgiIHZpZXdCb3g9IjY5LjU4IDE3MS4zNjQgNDQ5LjE5OSA0NDkuNDM4IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDY5LjU4IDE3MS4zNjQgNDQ5LjE5OSA0NDkuNDM4IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8cGF0aCBmaWxsPSIjNTdCNDgyIiBkPSJNMjgzLjU4LDYyMC44MDJjLTEzLjUyMi0wLjM5Ni0yNi44NDgtMi4yOTMtNDAuMDAyLTUuMzg4Yy00NC42NDMtMTAuNTAzLTgyLjY0OC0zMi41NjktMTEzLjg3Ni02Ni4wOTEKCQljLTI0Ljk2MS0yNi43OTUtNDIuMjg1LTU3Ljk2Ni01Mi4wMzItOTMuMzEzYy01LjQ3OC0xOS44NjQtOC4zNDQtNDAuMTE1LTguMDczLTYwLjY5YzAuNzE2LTU0LjMzMywxOC4xOTQtMTAyLjYxOCw1My4yNy0xNDQuMjcxCgkJYzI3LjI0NS0zMi4zNTQsNjEuMTE3LTU1LjEyOCwxMDEuMjI5LTY4LjQ0MWMzMS44ODEtMTAuNTgxLDY0LjYwNS0xMy42NDMsOTcuOTI2LTkuNDAzCgkJYzU0LjgzMyw2Ljk3NywxMDAuNzgzLDMxLjI3MiwxMzguMjc0LDcxLjY5NGMxMC43NjQsMTEuNjA0LDIwLjAzOSwyNC4zNzgsMjcuOTU0LDM4LjEwOWMwLjM0LDAuNTksMC41MjEsMS4yNzEsMC43NzYsMS45MQoJCWMtMS41NjgsMC4wOS0yLjUxNi0xLjA3OS0zLjYxOC0xLjg2Yy0yLjY3NS0xLjg5LTUuMjA1LTMuOTk0LTcuOTM2LTUuNzk2Yy0xMS4xMTctNy4zNC0yMi4yNzEtMTQuNjI2LTMzLjQ0Ny0yMS44NzkKCQljLTcuMzkxLTQuNzk2LTE0LjgzOS05LjUwMS0yMi4zMzctMTQuMjk3Yy0wLjQ4Miw1LjE2MiwwLjM4NiwxMC4xNi0wLjQ3NiwxNS4xMDRjLTAuMDQ0LTQuMzk0LTAuMTQ2LTguNzg4LTAuMTA0LTEzLjE4MQoJCWMwLjAxNy0xLjc1NC0wLjQ4OC0yLjQ1My0yLjM3OS0yLjQ0Yy0xMC43OTUsMC4wNzQtMjEuNTkxLDAuMDI5LTMyLjM4NiwwLjAyOGMtMS4wOTEsMC0yLjI1OC0wLjE0MS0yLjcxMiwxLjI1MQoJCWMtMS40NzcsMC4zMTMtMS4wMzYsMS41MjEtMC45OTMsMi4zOTNjMC4xMTUsMi4zMzUtMC42OTMsMi41ODMtMi40OTgsMS4zNTFjLTIuNDk2LTEuNzA1LTUuMDQ4LTMuMzMxLTcuNTc0LTQuOTkxCgkJYy0zMC44NjgsMC02MS43MzYtMC4wMDEtOTIuNjA0LDAuMDA3Yy0xLjM5NSwwLTIuNzksMC4wOTEtNC4xODYsMC4xNGMtNi44NzItMC4wMjEtMTMuNzQ0LTAuMDQyLTIwLjYxNy0wLjA2MwoJCWMwLjE4NC0xLjMwOSwwLjM2Ny0yLjYxNywwLjU2OS00LjA2NWMtMS44OTUsMS4xMzctMi43MjIsMy4yNS00LjYzMSw0LjEzOWMtNC45NTEtMC4yNjMtOS45MDItMC4yNC0xNC44NTQtMC4wMjEKCQljLTUuNzUzLTAuMDQ0LTExLjUwNy0wLjA1OS0xNy4yNi0wLjE0N2MtMi4zMi0wLjAzNS0zLjg4OSwwLjE4Mi0yLjE3OSwzLjA3NGMwLjQ0NCwwLjc1MSwwLjE0OSwxLjkzOSwwLjE5MywyLjkyNwoJCWMwLjIxOCwyLjIwOS0wLjM1NCwyLjY2Mi0yLjMxMSwxLjI4NWMtMy40MzYtMi40MTctNi42MDEtNS4yMjYtMTAuMzI3LTcuMjI3Yy0xLjY5Ny0wLjAxNy0zLjM5NC0wLjA3LTUuMDktMC4wNDYKCQljLTEwLjQ3NSwwLjE0OC0yMC45NTQtMC4yOTktMzEuNDI2LDAuMjI4Yy0wLjIwMS0wLjA3MS0wLjQwMS0wLjE0MS0wLjYwMi0wLjIxMmMtMC4yMDgsMC40MjctMC41OTQsMC44NTQtMC41OTYsMS4yODIKCQljLTAuMDM1LDcuODUzLTAuMDIyLDE1LjcwNi0wLjAyNiwyMy41NThjMCwwLjc3MSwwLjE4NiwxLjM3OSwxLjA3LDEuNTA2YzAuNTA0LDMuMDIxLDAuNzE5LDYuMDk2LDEuMDgzLDkuMTE5CgkJYzAuNzEsNS44OTEsMS42NDUsMTEuNzMxLDIuNDc4LDE3LjU5OWMxLjE2Miw4LjE3NywzLjEyOSwxNi4xNTYsNS4yNTMsMjQuMDY5YzIuNzQyLDEwLjIyMiw2LjEzMSwyMC4yNzEsMTAuNTU2LDI5Ljk0MQoJCWMzLjEyOCw2LjgzNyw2LjI4OCwxMy43NTEsMTAuNjQ5LDE5Ljc4OGM2LjgyMSw5LjQ0LDE1LjA1MiwxNy43MDUsMjQuMDUyLDI1LjE5NWM4LjM1OSw2Ljk1NSwxNy4yMDksMTMuMTk4LDI2LjMzMiwxOS4wNjcKCQljOC44NDIsNS42ODgsMTguNDY2LDEwLjE0NiwyNi41NzUsMTYuOTk1YzEuODY3LDEuNTc3LDQuNDM2LDIuNjY3LDQuNzc2LDUuMzY5YzAuODk1LDcuMTA0LDEuMTQ2LDE0LjA0NC01LjU0NiwxOS4wNzQKCQljLTIuMTkyLDEuNjQ4LTMuMDQxLDcuMjMyLTEuMjEzLDkuMDc1YzIuODU5LDIuODg0LDQuMjg5LDYuMTI2LDUuMDAxLDEwLjAyNGMwLjU2MSwzLjA2NCwwLjk2Niw1Ljg0NC0wLjIxOSw4Ljk2NQoJCWMtMC43MjIsMS45MDQtMy4yNiw0LjU3NCwwLjExMiw2LjU1NGMyLjE5OCwxLjI5LDEuNzgzLDIuNjk2LDAuNTg3LDQuMzFjLTAuNDcsMC42MzUtMS4wOCwxLjE3Ni0xLjQ4NSwxLjg0NQoJCWMtNy4wODMsMTEuNjkzLTE1LjgyNiwyMS44ODItMjcuNDk4LDI5LjE3NWMtNS40OTMsMy40MzUtMTEuMjU0LDYuNDgxLTE4LjAyOCw2Ljk1MWMtMy44MjgsMC4yNjYtNC40ODYsMS40MTctNC40MDIsNS41OTcKCQljLTAuODkzLDAuMDUyLTEuNzg1LDAuMTMzLTIuNjc5LDAuMTQ3Yy01LjY4MywwLjA5NC03Ljc1OSwyLjE1NC03Ljc2OSw3Ljc1NGMtMC4wMDgsNC4zNzktMC4xMTMsOC43NjMsMC4wMzksMTMuMTM3CgkJYzAuMDg1LDIuNDU0LTAuNjI4LDQuMDc5LTIuODUsNS4zNWMtMy4wNDQsMS43MzktMy42NzQsNy44MTctMS4yOTIsMTAuMzI0YzUuMTQzLDQuNDI5LDExLjA0NCw3Ljc4MSwxNi42MTksMTEuNTg0CgkJQzI0Ni45OTYsNTk2LjM2NiwyNjUuMzE2LDYwOC41NDIsMjgzLjU4LDYyMC44MDJ6Ii8+Cgk8cGF0aCBmaWxsPSIjNDY5NDZBIiBkPSJNMjgzLjU4LDYyMC44MDJjLTE4LjI2NC0xMi4yNi0zNi41ODQtMjQuNDM2LTU0Ljc1Ni0zNi44MjhjLTUuNTc1LTMuODAzLTExLjQ3Ni03LjE1NS0xNi42MTktMTEuNTg0CgkJYzQzLjM5Ni0wLjAyOCw4Ni43OTMtMC4wNiwxMzAuMTg5LTAuMDg5YzEwLjg5OS0wLjAwNywyMS44LDAuMDA0LDMyLjY5OC0wLjAzNGMxLjAwMS0wLjAwMywyLjE1OSwwLjQzNCwyLjgyMS0xLjAwNwoJCWMxLjE5NS0yLjYwMi0wLjI0NC04LjEwMy0yLjc5Ni05LjUxNWMtMS42MjMtMC44OTgtMi4yMjItMi4wODMtMi4xNzktMy44NzljMC4wOC0zLjQ5OC0wLjA3OS03LjAwMywwLjA0Mi0xMC40OTkKCQljMC4yNzEtNy44MTQsMC4xMDQtMTEuOTEyLTEwLjgzMi0xMS42NDljMC4wNzQtNC40MTYsMC4wOTktNC41NzItNC4xNDEtNS4yMDRjLTUuMTA5LTAuNzYyLTkuNzk0LTIuNjM5LTE0LjMwMS00Ljk5NwoJCWMtMTUuMDU3LTcuODgtMjUuMTEtMjAuNjQtMzMuNzg4LTM0Ljc0OGMtMC43ODUtMS4yNzQtMC4xOTQtMS42NjIsMC42NjEtMi4zMzhjMS4wMzUtMC44MTMsMi43OC0xLjUzNSwxLjk1My0zLjIxNgoJCWMtMC43MTctMS40NTgtMC43MDEtMy4wNDgtMS40NTMtNC41MDdjLTEuODQzLTMuNTc1LDAuMTczLTEzLjI3NSwzLjEwMy0xNi4wODdjNC4wNTQtMy44ODYsMy45ODQtOS4wNDQtMC40MTgtMTIuNTE1CgkJYy0xLjk2My0xLjU0OC0zLjY2OS0zLjI1LTQuMTY0LTUuNjA4Yy0wLjU0OS0yLjYxMi0wLjc2OC01LjM3LTAuNjE2LTguMDM0YzAuMTU4LTIuODA5LDAuMDc0LTUuOTM5LDIuNjkyLTcuOTE4CgkJYzQuOTUzLTMuNzQsOS42ODQtNy45MDgsMTUuMDQxLTEwLjk1NmMyMC4zNzEtMTEuNTg1LDM5LjQ5Ni0yNC42ODQsNTUuNTIxLTQyLjAyNGMxMS42My0xMi41ODUsMTguNjI1LTI3LjY1OSwyNC4zNS00My40NzkKCQljMy4wOTMtOC41NDYsNS41MTItMTcuMjgyLDcuNTc3LTI2LjE1MmMxLjc2Mi03LjU3MSwzLjE4NS0xNS4xODgsNC4zMTktMjIuODVjMS40MTgtOS41NzEsMi4xODgtMTkuMjI3LDIuNzI5LTI4Ljg5MwoJCWMwLjg2LTQuOTQ1LTAuMDA4LTkuOTQyLDAuNDc2LTE1LjEwNGM3LjQ5OSw0Ljc5NiwxNC45NDYsOS41MDEsMjIuMzM3LDE0LjI5N2MxMS4xNzYsNy4yNTMsMjIuMzMsMTQuNTM5LDMzLjQ0NywyMS44NzkKCQljMi43MjksMS44MDIsNS4yNjEsMy45MDYsNy45MzYsNS43OTZjMS4xMDQsMC43ODEsMi4wNSwxLjk1LDMuNjE4LDEuODZjNS43Nyw4LjM1LDkuNjIsMTcuNjcsMTMuNDgxLDI2Ljk2MwoJCWM1LjIyMiwxMi41NjEsOS4zMjUsMjUuNTI3LDExLjY5NiwzOC45MDJjMS41MDksOC41MTEsMi44MDEsMTcuMDk0LDMuNTczLDI1Ljc2MmMwLjYyOCw3LjA2MywxLjA0OCwxNC4wOTMsMC45OTQsMjEuMTU5CgkJYy0wLjM2Nyw0OC4yMjItMTQuNjcyLDkxLjkzOC00Mi45NjksMTMwLjk0N2MtMjQuMzc5LDMzLjYwOC01NS44NDMsNTguNTI5LTk0LjAyNyw3NC44MzUKCQljLTIyLjg1NSw5Ljc1OS00Ni43MTMsMTUuNTItNzEuNTYxLDE3LjEyOEMzMDEuMzMzLDYyMS4xOSwyOTIuNDY0LDYyMS4zMTYsMjgzLjU4LDYyMC44MDJ6Ii8+Cgk8cGF0aCBmaWxsPSIjRkJDQjIxIiBkPSJNNDIxLjIxNiwyNTYuMTkxYy0wLjU0Miw5LjY2Ni0xLjMxMywxOS4zMjItMi43MjksMjguODkzYy0xLjEzNiw3LjY2Mi0yLjU1OSwxNS4yNzktNC4zMTksMjIuODUKCQljLTIuMDY1LDguODctNC40ODQsMTcuNjA2LTcuNTc3LDI2LjE1MmMtNS43MjUsMTUuODItMTIuNzIsMzAuODk0LTI0LjM1LDQzLjQ3OWMtMTYuMDIzLDE3LjM0LTM1LjE0OCwzMC40MzktNTUuNTIxLDQyLjAyNAoJCWMtNS4zNTcsMy4wNDgtMTAuMDg4LDcuMjE2LTE1LjA0MSwxMC45NTZjLTIuNjE4LDEuOTc5LTIuNTM0LDUuMTA5LTIuNjkyLDcuOTE4Yy0wLjE1LDIuNjY0LDAuMDY3LDUuNDIyLDAuNjE3LDguMDM0CgkJYzAuNDk0LDIuMzU4LDIuMiw0LjA2Miw0LjE2Myw1LjYwOGM0LjQwMiwzLjQ3MSw0LjQ3Miw4LjYyOSwwLjQxOCwxMi41MTVjLTIuOTMsMi44MTItNC45NDQsMTIuNTEyLTMuMTAzLDE2LjA4NwoJCWMwLjc1MiwxLjQ1OSwwLjczNiwzLjA0OSwxLjQ1Myw0LjUwN2MwLjgyNywxLjY4Mi0wLjkxOCwyLjQwMS0xLjk1MywzLjIxNmMtMC44NTUsMC42NzYtMS40NDYsMS4wNjMtMC42NjEsMi4zMzgKCQljOC42NzgsMTQuMTA4LDE4LjczMSwyNi44NjgsMzMuNzg4LDM0Ljc0OGM0LjUwNywyLjM1OCw5LjE5LDQuMjM1LDE0LjMwMSw0Ljk5N2M0LjIzOCwwLjYzMyw0LjIxNSwwLjc4OCw0LjE0LDUuMjA0CgkJYy0yMy44MjIsMC4wMjctNDcuNjQ2LDAuMDYzLTcxLjQ2NywwLjA3NGMtNi41NzYsMC4wMDMtMTMuMTUyLTAuMDcyLTE5LjcyOC0wLjExMWMtMS41LTEuODQ2LTAuNzYyLTMuMjU4LDAuNjk0LTQuNzcyCgkJYzMuODk3LTQuMDYyLDcuNzA1LTguMTkzLDEwLjcwNS0xMy4wMjFjMi44MzctNC41NjUsNC40NTctOS41NjMsNS45LTE0LjY3OGMxLjMwMy00LjYxOCwyLjQzNS05LjI0OSwxLjg3NS0xNC4wNwoJCWMtMC4xOTYtMS42ODcsMC4wMjEtMy4zNTQtMC4xMDUtNC45NTJjLTAuMjE0LTIuNzE5LDEuMjk3LTQuOTI5LDEuNDA1LTcuNDkzYzAuMjMzLTUuNTQ2LTAuODQzLTEwLjgwNC0zLjAxMy0xNS44ODYKCQljLTAuODQ3LTEuOTgxLTAuODMyLTMuODE5LDAuMjUtNS45NDNjMS4wOTgtMi4xNTYsMy4wNzgtMy43NjUsMy4zOC02LjQ3OWMwLjc3OC02Ljk4LDEuOTg2LTEzLjg0NC0wLjU5OC0yMC44MDgKCQljLTIuNjEyLTcuMDQxLTQuNzYxLTE0LjI2MS02Ljk0Ny0yMS40NTNjLTEuODEtNS45NTUtMy45MTMtMTEuODk1LTQuOTE5LTE4LjAwMWMtMS4yMi03LjQwMi0yLjk1LTE0LjcwMi00LjEwOS0yMi4xMjYKCQljLTEuNDQtOS4yMTgtMi4yMDctMTguNDktMy4wODMtMjcuNzI4Yy0wLjg5MS05LjM5OC0wLjAyNC0xOC45MjctMC43MzUtMjguMzk1Yy0wLjQ0OC01Ljk2NSwwLjI3Mi0xMS45NDIsMC40ODMtMTcuOTE0CgkJYzAuMjE5LTYuMTg4LTAuMzU0LTEyLjQzLDAuMjM3LTE4LjU3YzAuOTA0LTkuMzk0LDEuNDQ0LTE4LjgwOCwyLjE4Ni0yOC4yMDljMC4xMjctMS42MTYsMC4yNzgtMy4wOTksMS4yMjEtNC40MzIKCQljMS4zOTYtMC4wNDksMi43OTEtMC4xNDEsNC4xODYtMC4xNDFjMzAuODY4LTAuMDA5LDYxLjczNi0wLjAwNyw5Mi42MDQtMC4wMDdjLTAuMTEzLDAuNzg0LTAuMjI0LDEuNTY5LTAuMzM5LDIuMzUzCgkJYy0wLjg5NCw2LjA4OC0yLjI5NCwxMi4xMDktMi4yNzUsMTguMzE2YzAuMDA1LDEuOTc1LDAuNDc0LDIuNTI3LDIuNDIzLDEuNDhjNi41NzUtMy41MzQsMTAuMDUxLTkuMDI2LDEwLjczOS0xNi4zODEKCQljMS4xMTItMS4xOTQsMC41MDYtMi41ODcsMC40NTUtMy45MTZjMC4wMjEtMC4yMDIsMC4wNDMtMC40MDMsMC4wNjQtMC42MDRjMC40NTQtMS4zOTMsMS42MjEtMS4yNTIsMi43MTItMS4yNTIKCQljMTAuNzk2LDAuMDAxLDIxLjU5MiwwLjA0NiwzMi4zODYtMC4wMjhjMS44OTEtMC4wMTMsMi4zOTYsMC42ODYsMi4zNzksMi40NEM0MjEuMDY5LDI0Ny40MDMsNDIxLjE3MiwyNTEuNzk4LDQyMS4yMTYsMjU2LjE5MXoKCQkgTTM1MS40MTYsMzg2LjcyOGMwLjY0Ni0wLjIxOCwwLjk1My0wLjI0MywxLjE1NS0wLjRjOS4wMzQtNy4wNDgsMTcuMzk2LTE0Ljc3NCwyNC4wNjMtMjQuMTc1CgkJYzcuNzI4LTEwLjg5NiwxMi4zMjQtMjMuMjg0LDE2Ljc3Ni0zNS43MTRjNS40NjEtMTUuMjQ3LDguOTcyLTMwLjk4MSwxMS4wMi00Ny4wMjhjMC44OTYtNy4wMTQsMS4zNzctMTQuMDgsMi4wMTItMjEuMTI2CgkJYzAuMTA4LTEuMjEzLDAuMTM2LTIuNTg4LTEuNjAxLTIuNjQyYy0yLjc5NS0wLjA4Ny01LjU5NS0wLjA2Ny04LjM5Mi0wLjAzOWMtMS4wMTIsMC4wMS0xLjUxNywwLjY4OC0xLjk0OSwxLjU4MgoJCWMtNC42Nyw5LjYxMS0xMS44MTgsMTYuNTk0LTIxLjk0NywyMC4yNjljLTEuNjI4LDAuNTkxLTEuOTM4LDEuNDg1LTIuMDkxLDMuMDQ5Yy0xLjIxOSwxMi40OTYtMi40MzcsMjQuOTk1LTMuODkxLDM3LjQ2NAoJCWMtMS4xNDQsOS43OTMtMi40MDgsMTkuNTczLTQuMzE5LDI5LjI2M2MtMS44ODcsOS41NjItMy45MzgsMTkuMDc0LTYuNjU5LDI4LjQ0QzM1NC41MTgsMzc5LjM2OCwzNTIuNjM1LDM4Mi43NjIsMzUxLjQxNiwzODYuNzI4egoJCSIvPgoJPHBhdGggZmlsbD0iI0ZCQ0IyMSIgZD0iTTIxNywyNDYuNTkyYy0wLjA0NC0wLjk4OCwwLjI1MS0yLjE3Ni0wLjE5My0yLjkyN2MtMS43MDktMi44OTItMC4xNDEtMy4xMDksMi4xNzktMy4wNzQKCQljNS43NTMsMC4wODgsMTEuNTA3LDAuMTAzLDE3LjI1OSwwLjE0N2MwLjgzNSwyLjAyMSwyLjcwOSw0LjA3NC0wLjE4OCw1Ljk3OWMtMy41MDUtMC4wOTUtNi4xNjUtMi43NzEtOS42OTgtMy4yMzcKCQljLTAuMTgzLDEuMjY1LDAuNzE0LDEuODY5LDEuMzM5LDIuNTQ5YzIuNjc2LDIuOTEzLDUuMzA0LDUuODc4LDguMTI0LDguNjQ4YzIuMDEzLDEuOTc5LDIuMjE1LDMuODE1LDAuOTY4LDYuMzU0CgkJYy0xLjY1LDMuMzYxLTIuODM3LDYuOTUtNC4zMzIsMTAuNzE0YzIuNDctMC4wMzUsMy4xNDktMi4xMDQsNC43ODUtMi40ODRjMS4xMDksMi40NzUsMS40LDUuMTExLDEuMzM3LDcuNzY5CgkJYy0wLjExMyw0Ljc3NSwwLjQ5OCw5LjUyNywwLjgyMiwxNC4yNTdjMC40MzEsNi4yODMsMC45OTQsMTIuNTg0LDEuNTM4LDE4Ljg3MmMwLjE2NSwxLjkwNywxLjA4NSwzLjgsMC45MTksNS41CgkJYy0wLjQ4Miw0LjkzNiwxLjAzMSw5LjU3MywxLjUwNCwxNC4zNDhjMC41MDUsNS4xLDEuNDQ3LDEwLjE0OSwyLjI5NCwxNS4yMWMxLjExMyw2LjY0OCwxLjgzLDEzLjQwMSwzLjQ1NywxOS45MjIKCQljMi4wMyw4LjEzOSwzLjg1MSwxNi4zMDIsNy4xNiwyNC4xODljMi43NTksNi41NzgsNi4xMjMsMTIuNjk0LDkuODA2LDE4LjY1M2M0LjkyNyw3Ljk2NSwxMS4wMTUsMTUuMDg5LDE3Ljc3NywyMS42MDQKCQljMC43MTEsMC42ODQsMS41MzQsMS4zMjIsMS41MjgsMi40NjZjLTAuMDE3LDMuNDk5LDAuMzMsNy4wNDYtMC4xNDEsMTAuNDgxYy0wLjQ4NiwzLjU1LTEuMTU4LDcuMDY4LTMuNjg1LDEwLjE0NgoJCWMtMS45NDQsMi4zNjctMi4zMzUsNS45NTgtMC41NDgsOC42MDJjMy4xNTksNC42NywzLjcxMiw5Ljg2MywzLjY1OSwxNS4wODRjLTAuMDQ0LDQuMzg0LTMuMDIyLDguNzMxLTAuMDU1LDEzLjE1NgoJCWMtMC45ODIsOC4wNS0zLjgwNSwxNS41NzUtOC4zNTksMjIuMDk4Yy00LjA1MSw1LjgwMi05LjcxOCwxMC4zMTQtMTUuNjI1LDE0LjM0OGMtMS43ODEsMS4yMTYtMy40MTYsMi42NTYtNS4yNDQsMy43OQoJCWMtMi4zOTEsMS40ODItNC41NjUsMy4wNzYtNS40MDQsNS45MzVjLTcuNzQzLTAuMDA0LTE1LjQ4Ny0wLjAwNy0yMy4yMy0wLjAxYy0wLjA4NC00LjE4LDAuNTc1LTUuMzMxLDQuNDAyLTUuNTk3CgkJYzYuNzczLTAuNDcsMTIuNTM1LTMuNTE4LDE4LjAyOC02Ljk1MWMxMS42NzEtNy4yOTMsMjAuNDE1LTE3LjQ4LDI3LjQ5OC0yOS4xNzVjMC40MDUtMC42NjksMS4wMTYtMS4yMSwxLjQ4NS0xLjg0NQoJCWMxLjE5Ni0xLjYxMiwxLjYxMS0zLjAyLTAuNTg3LTQuMzFjLTMuMzcyLTEuOTc5LTAuODM0LTQuNjQ4LTAuMTEyLTYuNTU0YzEuMTg1LTMuMTIxLDAuNzc5LTUuODk4LDAuMjE5LTguOTY1CgkJYy0wLjcxMi0zLjg5OC0yLjE0Mi03LjE0MS01LjAwMS0xMC4wMjRjLTEuODI4LTEuODQzLTAuOTc5LTcuNDI3LDEuMjEzLTkuMDc0YzYuNjkyLTUuMDMxLDYuNDQxLTExLjk3Myw1LjU0Ni0xOS4wNzUKCQljLTAuMzQtMi43MDItMi45MS0zLjc5Mi00Ljc3Ni01LjM2OWMtOC4xMDgtNi44NDktMTcuNzMzLTExLjMwNy0yNi41NzUtMTYuOTk1Yy05LjEyMy01Ljg2OS0xNy45NzMtMTIuMTEyLTI2LjMzMi0xOS4wNjcKCQljLTktNy40OS0xNy4yMzEtMTUuNzU1LTI0LjA1Mi0yNS4xOTVjLTQuMzYxLTYuMDM3LTcuNTIxLTEyLjk1MS0xMC42NDktMTkuNzg4Yy00LjQyNS05LjY3LTcuODE0LTE5LjcyLTEwLjU1Ni0yOS45NDEKCQljLTIuMTI0LTcuOTE0LTQuMDkxLTE1Ljg5My01LjI1My0yNC4wNjljLTAuODMzLTUuODY3LTEuNzY4LTExLjcwOC0yLjQ3OC0xNy41OTljLTAuMzY0LTMuMDIzLTAuNTgtNi4wOTgtMS4wODMtOS4xMTkKCQljMC4wMzMtMi4xNzYsMC4wNjUtNC4zNTMsMC4wOTgtNi41M2MwLjAxOS02LjUzNCwwLjAzNy0xMy4wNjksMC4wNTYtMTkuNjA0YzEwLjQ3Mi0wLjUyNywyMC45NS0wLjA4LDMxLjQyNS0wLjIyOAoJCWMxLjY5Ni0wLjAyNCwzLjM5MywwLjAyOSw1LjA5LDAuMDQ1YzAuMjE2LDEuNzcxLDAuMzcxLDMuNTUyLDAuNjYxLDUuMzEyYzEuMjM1LDcuNTAyLDQuMzQzLDEzLjc1LDExLjcwNCwxNy4wMzkKCQljMS4wMzEsMC40NjEsMi42MTYsMS43MzEsMi41MjktMC44ODdDMjE5LjA4MSwyNTYuODYyLDIxOC42MzgsMjUxLjYzNywyMTcsMjQ2LjU5MnogTTE4OC40NDYsMjU1LjU4NAoJCWMtMS4wNjUsMC0xLjQ2NC0wLjAwMS0xLjg2NCwwYy00LjQxNSwwLjAxOC00LjU0OCwwLjAyMy00LjM2NSw0LjI5NmMwLjU3MSwxMy4yNzEsMi40MDgsMjYuMzk5LDUuMjAyLDM5LjM2NgoJCWMyLjc2NywxMi44NDYsNi43NiwyNS4zMjksMTEuNDUyLDM3LjYyOWM2LjU0MiwxNy4xNTcsMTYuMDA0LDMyLjE2NywzMC4yMDYsNDRjMS43NTMsMS40NjEsMy40MjgsMy4wMTYsNS4xNTQsNC41MQoJCWMwLjY3MSwwLjU4MSwxLjUxLDAuNjc3LDIuMjMyLDAuMjU4YzAuODA1LTAuNDY3LDAuMDU1LTEuMDA2LTAuMTM4LTEuNDk3Yy0yLjYxNy02LjY3Ny00LjQwNi0xMy42MDUtNi4wOTQtMjAuNTU1CgkJYy0yLjc3OS0xMS40NC00LjU1Ny0yMy4wNTMtNi4yNjgtMzQuNjk5Yy0xLjQ2OS05Ljk5My0yLjYwNy0yMC4wMy0zLjc2OS0zMC4wNDRjLTAuNjgtNS44NjEtMS43ODEtMTEuNzgyLTEuNDUxLTE3Ljc3CgkJYzAuMDk3LTEuNzU1LTAuNjUzLTIuNzc4LTIuNTI5LTMuNDc1Yy05LjA2My0zLjM2Ny0xNi40NDgtOC45MzctMjAuODA5LTE3Ljc0OUMxOTMuNzAxLDI1Ni40MTIsMTkxLjY2LDI1NC42MzEsMTg4LjQ0NiwyNTUuNTg0eiIKCQkvPgoJPHBhdGggZmlsbD0iIzM2MzYzNSIgZD0iTTIyNi43NTYsNTM1LjY3OGM3Ljc0MywwLjAwMywxNS40ODcsMC4wMDYsMjMuMjMsMC4wMDljNi45OS0wLjAwMiwxMy45NzgtMC4wMDQsMjAuOTY3LTAuMDA2CgkJYzYuNTc2LDAuMDM5LDEzLjE1MiwwLjExNCwxOS43MjgsMC4xMTFjMjMuODIzLTAuMDExLDQ3LjY0NS0wLjA0Nyw3MS40NjctMC4wNzRjMTAuOTM4LTAuMjYzLDExLjEwNCwzLjgzNSwxMC44MzMsMTEuNjQ5CgkJYy0wLjEyMSwzLjQ5NiwwLjAzOCw3LjAwMS0wLjA0MiwxMC40OTljLTAuMDQzLDEuNzk2LDAuNTU2LDIuOTc5LDIuMTc5LDMuODc5YzIuNTUyLDEuNDEyLDMuOTkxLDYuOTEzLDIuNzk2LDkuNTE1CgkJYy0wLjY2MiwxLjQzOS0xLjgyLDEuMDA0LTIuODIxLDEuMDA3Yy0xMC44OTgsMC4wMzgtMjEuNzk5LDAuMDI3LTMyLjY5OCwwLjAzNGMtNDMuMzk2LDAuMDI5LTg2Ljc5MiwwLjA2MS0xMzAuMTg5LDAuMDg5CgkJYy0yLjM4MS0yLjUwNy0xLjc1Mi04LjU4NSwxLjI5Mi0xMC4zMjRjMi4yMjItMS4yNzEsMi45MzYtMi44OTYsMi44NS01LjM1Yy0wLjE1Mi00LjM3NC0wLjA0Ny04Ljc1OC0wLjAzOS0xMy4xMzcKCQljMC4wMS01LjU5OSwyLjA4Ni03LjY2LDcuNzY5LTcuNzU0QzIyNC45NzEsNTM1LjgxMSwyMjUuODYzLDUzNS43MjksMjI2Ljc1Niw1MzUuNjc4eiIvPgoJPHBhdGggZmlsbD0iI0ZDRDk1RSIgZD0iTTI3MC45NTMsNTM1LjY4MWMtNi45ODksMC4wMDItMTMuOTc4LDAuMDA0LTIwLjk2NywwLjAwNmMwLjgzOS0yLjg1NiwzLjAxMy00LjQ1LDUuNDA0LTUuOTM0CgkJYzEuODI4LTEuMTM0LDMuNDYzLTIuNTc0LDUuMjQ0LTMuNzljNS45MDctNC4wMzIsMTEuNTc0LTguNTQ2LDE1LjYyNS0xNC4zNDhjNC41NTQtNi41MjEsNy4zNzYtMTQuMDQ4LDguMzU5LTIyLjA5OAoJCWMtMi45NjgtNC40MjUsMC4wMS04Ljc3MiwwLjA1NS0xMy4xNTZjMC4wNTMtNS4yMjEtMC41LTEwLjQxNC0zLjY1OS0xNS4wODRjLTEuNzg3LTIuNjQ0LTEuMzk2LTYuMjMzLDAuNTQ4LTguNjAyCgkJYzIuNTI2LTMuMDc2LDMuMTk4LTYuNTk2LDMuNjg1LTEwLjE0NmMwLjQ3MS0zLjQzNywwLjEyNS02Ljk4MiwwLjE0MS0xMC40ODFjMC4wMDYtMS4xNDQtMC44MTctMS43ODItMS41MjgtMi40NjYKCQljLTYuNzYzLTYuNTE1LTEyLjg1MS0xMy42MzgtMTcuNzc3LTIxLjYwNGMtMy42ODQtNS45NTctNy4wNDctMTIuMDc1LTkuODA2LTE4LjY1MmMtMy4zMDktNy44ODctNS4xMjktMTYuMDUtNy4xNi0yNC4xODkKCQljLTEuNjI3LTYuNTIxLTIuMzQ0LTEzLjI3NC0zLjQ1Ny0xOS45MjJjLTAuODQ3LTUuMDYxLTEuNzg5LTEwLjExLTIuMjk0LTE1LjIxYy0wLjQ3My00Ljc3NS0xLjk4Ni05LjQxMi0xLjUwNC0xNC4zNDgKCQljMC4xNjYtMS43MDEtMC43NTQtMy41OTMtMC45MTktNS41Yy0wLjU0NC02LjI4OC0xLjEwNy0xMi41ODktMS41MzgtMTguODcyYy0wLjMyNS00LjczLTAuOTM2LTkuNDgyLTAuODIyLTE0LjI1NwoJCWMwLjA2My0yLjY1OC0wLjIyOC01LjI5NC0xLjMzNy03Ljc2OWMxLjg0My0xLjU3MSwzLjc3NC0zLjA1MSw1LjUwNC00LjczOGMxLjc4OC0xLjc0MiwzLjQ5Mi0xLjg2Niw1LjU1NC0wLjUyMwoJCWMzLjIwOCwyLjA5MSw2LjUwMiw0LjA1LDkuNzU2LDYuMDcyYzAuNTMxLDAuMzMsMS4xNywwLjYxOSwxLjY1MiwwLjIwOWMwLjY3MS0wLjU3MSwwLjMzNS0xLjM0Ni0wLjE3Mi0xLjgyNgoJCWMtMy4zNTctMy4xNzUtNC4zOTYtNy44NDgtNy4zNDQtMTEuMzFjLTAuNzQ1LTAuODc1LTEuOTctMi4wODctMS40NDQtMy40MjJjMS42ODYtNC4yNzYsMi4zNjUtOC44ODcsNC40MTEtMTMuMDM0CgkJYzYuODczLDAuMDIxLDEzLjc0NiwwLjA0MiwyMC42MTcsMC4wNjNjLTAuOTQyLDEuMzMzLTEuMDk0LDIuODE2LTEuMjIxLDQuNDMyYy0wLjc0MSw5LjQwMS0xLjI4MSwxOC44MTYtMi4xODYsMjguMjA5CgkJYy0wLjU5MSw2LjE0LTAuMDE5LDEyLjM4Mi0wLjIzNywxOC41N2MtMC4yMTEsNS45NzItMC45MzEsMTEuOTQ5LTAuNDgzLDE3LjkxNGMwLjcxMSw5LjQ2Ny0wLjE1NSwxOC45OTYsMC43MzUsMjguMzk1CgkJYzAuODc1LDkuMjM4LDEuNjQyLDE4LjUxLDMuMDgzLDI3LjcyOGMxLjE2LDcuNDI0LDIuODg5LDE0LjcyNCw0LjEwOSwyMi4xMjZjMS4wMDYsNi4xMDYsMy4xMDksMTIuMDQ2LDQuOTE5LDE4LjAwMQoJCWMyLjE4Nyw3LjE5MSw0LjMzNSwxNC40MTIsNi45NDcsMjEuNDUzYzIuNTgzLDYuOTY0LDEuMzc1LDEzLjgyNiwwLjU5OCwyMC44MDhjLTAuMzAyLDIuNzE1LTIuMjgyLDQuMzIyLTMuMzgsNi40NzkKCQljLTEuMDgyLDIuMTI0LTEuMDk3LDMuOTYyLTAuMjUsNS45NDNjMi4xNjksNS4wODIsMy4yNDYsMTAuMzQsMy4wMTMsMTUuODg2Yy0wLjEwOCwyLjU2NC0xLjYxOSw0Ljc3NC0xLjQwNSw3LjQ5NAoJCWMwLjEyNiwxLjU5Ny0wLjA5MSwzLjI2NiwwLjEwNSw0Ljk1MWMwLjU2MSw0LjgyMS0wLjU3MSw5LjQ1Mi0xLjg3NSwxNC4wN2MtMS40NDQsNS4xMTUtMy4wNjMsMTAuMTExLTUuOSwxNC42NzgKCQljLTMsNC44MjYtNi44MDgsOC45NTktMTAuNzA1LDEzLjAyMUMyNzAuMTkxLDUzMi40MjMsMjY5LjQ1Myw1MzMuODM1LDI3MC45NTMsNTM1LjY4MXoiLz4KCTxwYXRoIGZpbGw9IiNGRUZFRkUiIGQ9Ik0yNTUuMTYyLDI0MC42ODdjLTIuMDQ2LDQuMTQ3LTIuNzI1LDguNzU4LTQuNDExLDEzLjAzNGMtMC41MjYsMS4zMzUsMC42OTksMi41NDcsMS40NDQsMy40MjIKCQljMi45NDksMy40NjIsMy45ODcsOC4xMzUsNy4zNDQsMTEuMzFjMC41MDcsMC40OCwwLjg0MywxLjI1NCwwLjE3MiwxLjgyNmMtMC40ODIsMC40MS0xLjEyMSwwLjEyMS0xLjY1Mi0wLjIwOQoJCWMtMy4yNTQtMi4wMjEtNi41NDgtMy45ODEtOS43NTYtNi4wNzJjLTIuMDYzLTEuMzQzLTMuNzY3LTEuMjE5LTUuNTU0LDAuNTIzYy0xLjczLDEuNjg3LTMuNjYxLDMuMTY3LTUuNTA0LDQuNzM4CgkJYy0xLjYzNiwwLjM3OS0yLjMxNSwyLjQ0OS00Ljc4NSwyLjQ4NGMxLjQ5NS0zLjc2NCwyLjY4Mi03LjM1Myw0LjMzMi0xMC43MTRjMS4yNDctMi41MzgsMS4wNDUtNC4zNzUtMC45NjgtNi4zNTQKCQljLTIuODE5LTIuNzctNS40NDgtNS43MzUtOC4xMjQtOC42NDhjLTAuNjI1LTAuNjgtMS41MjItMS4yODQtMS4zMzktMi41NDljMy41MzMsMC40NjYsNi4xOTMsMy4xNDIsOS42OTgsMy4yMzcKCQljMi4wOCwxLjUzMyw0LjU4NywxLjkxMyw2Ljk5NywyLjUxOGMwLjM3NSwwLjA5NCwxLjAyNS0wLjI0LDEuMzEyLTAuNTc3YzIuMjQyLTIuNjM0LDUuMDQ3LTQuNzkzLDYuNzMzLTcuODk4CgkJYzEuOTA5LTAuODg4LDIuNzM2LTMuMDAyLDQuNjMxLTQuMTM5QzI1NS41MjksMjM4LjA2OSwyNTUuMzQ2LDIzOS4zNzgsMjU1LjE2MiwyNDAuNjg3eiIvPgoJPHBhdGggZmlsbD0iIzQ2OTQ2QSIgZD0iTTM4My4xMTUsMjQ2LjM3MWMtMC42ODgsNy4zNTUtNC4xNjQsMTIuODQ3LTEwLjczOSwxNi4zODFjLTEuOTQ5LDEuMDQ3LTIuNDE4LDAuNDk1LTIuNDIzLTEuNDgKCQljLTAuMDItNi4yMDcsMS4zODMtMTIuMjI5LDIuMjc0LTE4LjMxNmMwLjExNi0wLjc4NCwwLjIyNy0xLjU2OSwwLjM0LTIuMzUzYzIuNTI4LDEuNjYsNS4wODEsMy4yODYsNy41NzYsNC45OTEKCQljMS44MDUsMS4yMzIsMi42MTMsMC45ODUsMi40OTgtMS4zNTFjLTAuMDQzLTAuODcyLTAuNDgyLTIuMDgxLDAuOTkzLTIuMzkzYy0wLjAyMSwwLjIwMi0wLjA0NCwwLjQwNC0wLjA2MywwLjYwNQoJCUMzODIuNzkzLDI0My42ODgsMzgzLjM2NywyNDUuMDc3LDM4My4xMTUsMjQ2LjM3MXoiLz4KCTxwYXRoIGZpbGw9IiM0Njk0NkEiIGQ9Ik0yMTcsMjQ2LjU5MmMxLjYzOCw1LjA0NCwyLjA4MSwxMC4yNywyLjI1NSwxNS41MjFjMC4wODcsMi42MTktMS40OTgsMS4zNDgtMi41MjksMC44ODcKCQljLTcuMzYxLTMuMjktMTAuNDY5LTkuNTM3LTExLjcwNC0xNy4wMzljLTAuMjktMS43NTktMC40NDQtMy41NDEtMC42NjEtNS4zMTJjMy43MjcsMi4wMDEsNi44OTEsNC44MTEsMTAuMzI3LDcuMjI4CgkJQzIxNi42NDYsMjQ5LjI1NCwyMTcuMjE4LDI0OC44MDEsMjE3LDI0Ni41OTJ6Ii8+Cgk8cGF0aCBmaWxsPSIjRkNEOTVFIiBkPSJNMjUxLjEsMjQwLjc2Yy0xLjY4NywzLjEwNS00LjQ5MSw1LjI2NC02LjczMyw3Ljg5OGMtMC4yODcsMC4zMzctMC45MzcsMC42NzEtMS4zMTIsMC41NzcKCQljLTIuNDEtMC42MDUtNC45MTctMC45ODUtNi45OTctMi41MThjMi44OTctMS45MDQsMS4wMjMtMy45NTgsMC4xODgtNS45NzlDMjQxLjE5NywyNDAuNTIsMjQ2LjE0OCwyNDAuNDk3LDI1MS4xLDI0MC43NnoiLz4KCTxwYXRoIGZpbGw9IiM0Njk0NkEiIGQ9Ik0xNjcuNzkxLDI2MC40MzZjLTAuMDMzLDIuMTc3LTAuMDY1LDQuMzU0LTAuMDk4LDYuNTNjLTAuODg1LTAuMTI3LTEuMDcxLTAuNzM1LTEuMDctMS41MDYKCQljMC4wMDQtNy44NTMtMC4wMDktMTUuNzA2LDAuMDI2LTIzLjU1OGMwLjAwMS0wLjQyOCwwLjM4OC0wLjg1NCwwLjU5NS0xLjI4MmMtMC4wMzEsNC40NjktMC4xNTMsOC45MzgtMC4wNTQsMTMuNDA0CgkJQzE2Ny4yMzcsMjU2LjE1OSwxNjYuNjc1LDI1OC4zODksMTY3Ljc5MSwyNjAuNDM2eiIvPgoJPHBhdGggZmlsbD0iI0ZDRDk1RSIgZD0iTTE2Ny43OTEsMjYwLjQzNmMtMS4xMTYtMi4wNDctMC41NTQtNC4yNzYtMC42MDEtNi40MTJjLTAuMS00LjQ2NiwwLjAyMi04LjkzNiwwLjA1NC0xMy40MDQKCQljMC4yMDEsMC4wNzEsMC40MDIsMC4xNDIsMC42MDMsMC4yMTJDMTY3LjgyOCwyNDcuMzY2LDE2Ny44MSwyNTMuOTAxLDE2Ny43OTEsMjYwLjQzNnoiLz4KCTxwYXRoIGZpbGw9IiM0Njk0NkEiIGQ9Ik0zNTEuNDE2LDM4Ni43MjhjMS4yMTktMy45NjYsMy4xMDItNy4zNTksNC4xNzctMTEuMDU3YzIuNzIzLTkuMzY3LDQuNzcyLTE4Ljg3OCw2LjY1OS0yOC40NAoJCWMxLjkxMS05LjY4OSwzLjE3Ny0xOS40Nyw0LjMxOS0yOS4yNjNjMS40NTQtMTIuNDcsMi42NzItMjQuOTY5LDMuODkxLTM3LjQ2NGMwLjE1Mi0xLjU2NCwwLjQ2My0yLjQ1OCwyLjA5MS0zLjA0OQoJCWMxMC4xMjktMy42NzUsMTcuMjc3LTEwLjY1NywyMS45NDctMjAuMjY5YzAuNDM0LTAuODk0LDAuOTM4LTEuNTcyLDEuOTQ5LTEuNTgyYzIuNzk3LTAuMDI4LDUuNTk3LTAuMDQ4LDguMzkyLDAuMDM5CgkJYzEuNzM1LDAuMDU0LDEuNzA5LDEuNDI5LDEuNjAxLDIuNjQyYy0wLjYzNSw3LjA0Ni0xLjExNSwxNC4xMTItMi4wMTIsMjEuMTI2Yy0yLjA0OCwxNi4wNDYtNS41NTksMzEuNzgxLTExLjAyLDQ3LjAyOAoJCWMtNC40NTIsMTIuNDMtOS4wNSwyNC44MTctMTYuNzc2LDM1LjcxNGMtNi42NjYsOS40LTE1LjAyNywxNy4xMjctMjQuMDYzLDI0LjE3NUMzNTIuMzY5LDM4Ni40ODUsMzUyLjA2MywzODYuNTEsMzUxLjQxNiwzODYuNzI4egoJCSIvPgoJPHBhdGggZmlsbD0iIzU3QjQ4MiIgZD0iTTM4My4xMTUsMjQ2LjM3MWMwLjI1Mi0xLjI5NC0wLjMyMi0yLjY4NCwwLjQ1Ni0zLjkxNkMzODMuNjIxLDI0My43ODQsMzg0LjIyOCwyNDUuMTc3LDM4My4xMTUsMjQ2LjM3MXoiCgkJLz4KCTxwYXRoIGZpbGw9IiM0Njk0NkEiIGQ9Ik0xODguNDQ2LDI1NS41ODRjMy4yMTQtMC45NTMsNS4yNTQsMC44MjgsNi45NTgsNC4yN2M0LjM2MSw4LjgxMywxMS43NDYsMTQuMzgyLDIwLjgwOSwxNy43NDkKCQljMS44NzUsMC42OTcsMi42MjUsMS43MiwyLjUyOSwzLjQ3NWMtMC4zMyw1Ljk4OCwwLjc3MSwxMS45MDksMS40NTEsMTcuNzdjMS4xNjIsMTAuMDE0LDIuMywyMC4wNTIsMy43NjksMzAuMDQ0CgkJYzEuNzExLDExLjY0NiwzLjQ4OSwyMy4yNTksNi4yNjgsMzQuNjk5YzEuNjg4LDYuOTQ5LDMuNDc3LDEzLjg3Nyw2LjA5NCwyMC41NTVjMC4xOTMsMC40OTEsMC45NDMsMS4wMywwLjEzOCwxLjQ5NwoJCWMtMC43MjIsMC40MTktMS41NjIsMC4zMjMtMi4yMzItMC4yNThjLTEuNzI2LTEuNDk0LTMuNDAxLTMuMDQ5LTUuMTU0LTQuNTFjLTE0LjIwMi0xMS44MzMtMjMuNjY0LTI2Ljg0Mi0zMC4yMDYtNDQKCQljLTQuNjkxLTEyLjMwMS04LjY4NS0yNC43ODQtMTEuNDUyLTM3LjYyOWMtMi43OTMtMTIuOTY2LTQuNjMxLTI2LjA5NS01LjIwMi0zOS4zNjZjLTAuMTgzLTQuMjczLTAuMDUtNC4yNzksNC4zNjUtNC4yOTYKCQlDMTg2Ljk4MiwyNTUuNTgzLDE4Ny4zODEsMjU1LjU4NCwxODguNDQ2LDI1NS41ODR6Ii8+CjwvZz4KPC9zdmc+Cg==";
LOSE.img = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjM4MC40NTNweCIgaGVpZ2h0PSIzNzkuODI4cHgiIHZpZXdCb3g9IjEwNC44MjUgNC4wMDYgMzgwLjQ1MyAzNzkuODI4IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDEwNC44MjUgNC4wMDYgMzgwLjQ1MyAzNzkuODI4IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8cGF0aCBmaWxsPSIjRkM5MDIzIiBkPSJNMzEyLjk3MywzODIuOTA2Yy01MC4xNzksNC43MDUtOTUuMjAzLTguNTAyLTEzNC45MzgtMzkuMzYyYy0yOC42NTYtMjIuMjU2LTQ5LjAzMy01MC41MzktNjEuNTQxLTg0Ljc1NwoJCWMtOS4zNDgtMjUuNTc1LTEzLjIxOS01MS44MzItMTEuMTA3LTc4Ljc0MmMzLjAxMy0zOC4zOTYsMTYuMzY5LTczLjAxNSw0MC4yOTMtMTAzLjVjMTkuNTk4LTI0Ljk3Myw0My45NzgtNDMuNyw3Mi44MjEtNTYuNTIzCgkJYzE5LjkyNi04Ljg1OCw0MC44OS0xMy43Niw2Mi43NzQtMTUuNDQzYzIyLjcwOS0xLjc0Nyw0NC45MTksMC40OTIsNjYuNTYzLDYuODJjMzMuMDM0LDkuNjU4LDYxLjY1NSwyNi45OTgsODUuMzc1LDUyLjE1NgoJCWMyMS45MjIsMjMuMjUyLDM3LjIyMiw1MC4zMjYsNDUuMzg2LDgxLjEzYzYuNDM3LDI0LjI3OCw4Ljc2NCw0OS4wNSw0LjU2NCw3NC4wOTRjLTAuNDA1LDIuNDE2LDAuNSw1LjA0MS0xLjE0Niw3LjI1OAoJCWMtMi40NDEsMC4zMjUtNC4xNjUtMC45NjYtNS42Mi0yLjY0N2MtMTEuNTgxLTEzLjM3NC0yNC42NzMtMjUuMjY5LTM3LjA4MS0zNy44MjdjLTE5LjIxLTE5LjQ0Mi0zOC42MjMtMzguNjg2LTU3Ljk1MS01OC4wMTIKCQljLTEuNzY4LTEuNzY3LTMuNDc2LTMuNjAyLTUuNjQxLTQuOTE4Yy03Ljg1OS02Ljg5Ni0xNC43NTQtMTQuODM5LTIzLjkzOS0yMC4yNzZjLTIxLjk0OS0xMi45OS00NS4zNDItMTguNTg2LTcwLjc3NC0xNS4xNzIKCQljLTIxLjU3MSwyLjg5Ni00MC43NzYsMTEuMDY4LTU2Ljc4NCwyNS44OTVjLTEzLjUsMTIuNTA1LTIyLjUyMSwyNy41NDctMjYuMjE5LDQ1Ljk5NGMtNC41LDIyLjQ1MiwwLjUyNCw0Mi40NywxMi42MzgsNjEuMjkyCgkJYzUuMjc1LDguMTk2LDUuMjI3LDEwLjQ0LTAuOTY5LDE4LjgyNGMtNi4zMDksOC41MzgtNy4wMTMsMTcuMjc5LTIuMjMyLDI2LjY4M2MxLjg4OSwzLjcxNiw1LjQzNCw1LjgwNSw3Ljk4Niw4Ljg0NQoJCWMxLjgxNSwyLjU3OCw0LjEzMyw0LjY4MSw2LjQ4NSw2Ljc1MmMwLjQzNCwwLjUwMiwwLjg5MiwxLjA0OCwwLjk0LDEuNzAzYzAuNTQsNy4yNTQsNC4zOTMsMTIuNTUyLDkuOTAxLDE2Ljg4NAoJCWMxLjQwOCwyLjA4NywzLjI1NCwzLjc3OCw1LjAxOSw1LjU0MmMyMy43NzUsMjMuNzgsNDcuNTY5LDQ3LjU0Miw3MS4yOTgsNzEuMzY4QzMxMC43MywzNzguNjI5LDMxMy4zMjcsMzc5Ljg1MiwzMTIuOTczLDM4Mi45MDZ6IgoJCS8+Cgk8cGF0aCBmaWxsPSIjQ0Q3NDFEIiBkPSJNMzEyLjk3MywzODIuOTA2Yy0xMi44ODctMTMuMDIxLTI1Ljc0OC0yNi4wNjktMzguNjY3LTM5LjA1N2MtMTMuMDQ2LTEzLjExNC0yNi4xNTctMjYuMTYzLTM5LjIyLTM5LjI1OQoJCWMtMS4xNjEtMS4xNjMtMi42MDctMi4xMTctMy4xNC0zLjgwOGMxLjQ1Ny0wLjk2NiwyLjkwOS0wLjMyMSw0LjMyMywwLjA3N2M0Ljg2NiwxLjM3Miw5LjU5LDEuMTA4LDE0LjA1Ny0xLjMyMQoJCWMyLjg3OS0xLjU2Niw1LjU5Mi0xLjYzMSw4LjU0Ny0wLjE0N2M2LjI1NiwzLjE0LDEyLjUxMSwzLjI1NSwxOC41MjItMC42ODJjMi43MzYtMS43OTIsNS4yMTYtMS40MzUsNy45MTMsMC4xNzEKCQljNi40MjgsMy44MjksMTMuMDA2LDMuODY5LDE5LjQwOS0wLjAxM2MyLjkzOC0xLjc4Miw1LjUtMS42OTUsOC4zNjUsMC4wODJjNS44NjksMy42NDMsMTIuMDIxLDMuNzA5LDE4LjA5NCwwLjYwNgoJCWMzLjE1MS0xLjYwOSw1Ljg3NS0xLjIzNCw5LjAwNiwwLjEzNmMxMS44MSw1LjE2OCwyMy4yMTItMC41MTEsMjYuMTItMTMuMTc0YzEuMjYtNS40OSwzLjUwMS05LjQ2Niw4LjUzOS0xMi42NDYKCQljMTIuMDI2LTcuNTg5LDE0LjM0Mi0yMyw1Ljg2MS0zNC41NjdjLTYuNjE5LTkuMDI5LTYuNjY0LTEwLjY5Ni0wLjUzMy0xOS45NTVjMTguNTA5LTI3Ljk1MSwxOC4wMy02My44NjItMS4xOC05MS4xNjMKCQljLTEuMzA3LTEuODU0LTMuMTctMy41NTItMi41NC02LjIyN2MxLjk3MiwwLjM4LDIuOTk5LDIuMDE2LDQuMjcsMy4yODVjMzAuNDc0LDMwLjQ0NSw2MC45MDUsNjAuOTMsOTEuNDIxLDkxLjMzMQoJCWMzLjIyNywzLjIxMyw1LjIyOSw3LjczMyw5Ljg4Myw5LjQ1N2MtMS4xOSwxMi4zMDgtNC43ODgsMjQuMDM0LTkuMjQxLDM1LjQ0NWMtMTkuMTExLDQ4Ljk3My01Mi44MjMsODQuNDUzLTEwMC40NjksMTA2LjMxNQoJCUMzNTMuNjA0LDM3Ni4zOCwzMzMuNzY4LDM4MS44NjMsMzEyLjk3MywzODIuOTA2eiIvPgoJPHBhdGggZmlsbD0iI0ZFRkVGRSIgZD0iTTM3Ni40NDYsMTIxLjk2MmM2LjEzOSw4Ljg4NiwxMS44MzksMTcuOTM0LDE0LjkzNiwyOC40ODZjNy41MDksMjUuNTg2LDMuNTEzLDQ5LjI0NS0xMS4yMSw3MS4yNjIKCQljLTQuNjc2LDYuOTkxLTQuNjA0LDkuMTE1LDAuODU4LDE1Ljg1NGMxMC4xNDIsMTIuNTA4LDcuMjgzLDMwLjM5Mi02LjU2MywzOC4yMDZjLTQuMTk3LDIuMzY5LTUuNzg5LDUuMzI1LTYuNDc3LDkuNzI0CgkJYy0xLjc0OCwxMS4xODktMTAuMjk2LDE5LjA3Mi0yMS4xMzEsMTcuMDc2Yy03LjkyMS0xLjQ1OS0xNS4wMjEtMi40OTQtMjIuODAyLDAuMjA0Yy00LjMxMSwxLjQ5NS04Ljg3Ny0wLjU3OC0xMi42NDktMy4yMTUKCQljLTEuOTIxLTEuMzQzLTMuMjYxLTEuMzY0LTUuMjQ3LTAuMDQ0Yy03LjIwNSw0Ljc4Ny0xNC42MzksNC44NTktMjEuOTQ3LDAuMTg4Yy0yLjA0NC0xLjMwNy0zLjUyMy0xLjU0NC01LjcyOS0wLjA1MgoJCWMtNi44NTIsNC42MzUtMTQuMDIzLDQuNDUzLTIxLjE1MiwwLjQ3MmMtMS4zMTktMC43MzctMi41MzgtMS44MjYtNC4wODMtMC43MTJjLTYuODI1LDQuOTI0LTEzLjk4OSw0LjIzOS0yMS4zMDYsMS4zNzIKCQljLTYuODM3LTQuNDA2LTkuODExLTExLjAwNi0xMC42ODItMTguODAxYy0xLjUwOS0yLjY2MS00LTQuMzQxLTYuMjU0LTYuMjU5Yy03Ljk5Mi01LjgxNC0xMi41OC0xMy4zMjEtMTIuMDA5LTIzLjU0OAoJCWMwLjMzMi01LjkzNywzLjA3MS0xMC43MjksNi41ODYtMTUuMjQ3YzQuNjk5LTYuMDQsNC44NDUtOC41NTYsMC42OC0xNC42NDNjLTExLjE1My0xNi4yOTgtMTYuNzI1LTM0LjI1Ny0xNS4xMjYtNTQuMDAzCgkJYzEuNzU3LTIxLjcwMiwxMS4wMzctNDAuMTQ0LDI2LjgwNi01NC45NTljMjMuOTMzLTIyLjQ4Nyw1My4wNDYtMzEuMTA2LDg1LjE0Ny0yNy43OTljMjYuMDUsMi42ODUsNDguODIyLDEzLjU4NSw2Ni41MDcsMzMuNjczCgkJQzM3NC40NzIsMTIwLjE4OCwzNzUuNDk0LDEyMS4wNDQsMzc2LjQ0NiwxMjEuOTYyeiIvPgoJPHBhdGggZmlsbD0iI0JDN0QzQiIgZD0iTTIxNS4wMDksMjc1LjcyNGMyLjk3MiwxLjE5OSw1Ljk3NywyLjM2Niw2LjI1NCw2LjI1OUMyMTguNTgxLDI4MC40OTQsMjE2LjQwOCwyNzguNDk1LDIxNS4wMDksMjc1LjcyNHoiCgkJLz4KCTxwYXRoIGZpbGw9IiMzMzMzMzMiIGQ9Ik0yNDguODg2LDE3NS45NDVjMTYuMjMyLDAuMDI5LDMxLjYyLDE1LjQ5NSwzMS41NzQsMjkuMTE4Yy0wLjAyMyw2Ljk0My0zLjc0MiwxMC44NTktMTAuNzkyLDEwLjczOQoJCWMtMy45NS0wLjA2Ni03Ljg4Ny0wLjg5Ni0xMS44MjktMS4zODRjLTUuMjgxLTAuNjU0LTEwLjUyMS0xLjA4MS0xNS44MjQsMC4xNTZjLTYuODcxLDEuNjAzLTExLjE5OC0xLjU3LTEyLjEzOS04LjY0NwoJCWMtMC45OTYtNy40OTksMC41MDktMTQuNTg0LDQuMzY2LTIwLjk5OEMyMzguMDc5LDE3OC41NTEsMjQ0LjI1MSwxNzYuMDgzLDI0OC44ODYsMTc1Ljk0NXoiLz4KCTxwYXRoIGZpbGw9IiMzMzMzMzMiIGQ9Ik0zNjAuMzYyLDIwMS4yNjZjMC42NjksMTAuNjk3LTMuNzU1LDE0LjY5MS0xNC4wOTcsMTIuODk2Yy03LjE3OC0xLjI0Ni0xNC4yMjcsMC4yODktMjEuMjcsMS4zMjUKCQljLTEyLjU5OCwxLjg1NC0xOC4zNjMtNC45NzQtMTQuMjA0LTE3LjAwOGMyLjY5NC03Ljc5NSw3LjU2OC0xMy45ODYsMTQuNDU5LTE4LjQwM2MxNS41MDktOS45NDMsMzIuMjczLTEuODIsMzQuNzUyLDE2LjcyMgoJCUMzNjAuMjAxLDE5OC4yNzYsMzYwLjI0NiwxOTkuNzc1LDM2MC4zNjIsMjAxLjI2NnoiLz4KCTxwYXRoIGZpbGw9IiMzMzMzMzMiIGQ9Ik0zMTMuMjkyLDI1Ny4xOWMwLjM0NSw4LjA5My0yLjA5MSwxMC41MDQtNy43MjUsNy45MjNjLTcuMTk0LTMuMjk3LTEzLjYwNC0zLjMxNC0yMC44MzItMC4wNDIKCQljLTUuODk2LDIuNjY5LTguNDQ5LDAuNDY3LTguMDU5LTUuOTg4YzAuNjE1LTEwLjE3OSw1LTE4LjgxNCwxMi4xMzYtMjUuOTI5YzQuMzkyLTQuMzc4LDguMDAxLTQuMzI3LDEyLjUxNywwLjE1NgoJCUMzMDguMzY0LDI0MC4yOTUsMzEyLjM4MiwyNDguODY4LDMxMy4yOTIsMjU3LjE5eiIvPgo8L2c+Cjwvc3ZnPgo=";
