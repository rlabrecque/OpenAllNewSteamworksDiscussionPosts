// ==UserScript==
// @name        Open all new Steamworks Discussion posts
// @namespace   http://rileylabrecque.com/
// @description Opens all the Steam discussion topics with new posts in a group
// @include     http*://steamcommunity.com/groups/steamworks/discussions*
// @version     1
// @grant       none
// ==/UserScript==


var g_sStatusText = document.createTextNode('');
var g_nUnreadForums = 0;

main();

function main() {
    'use strict';

    //console.log('main');
    var container = document.getElementsByClassName('rightbox')[0]; // TODO, UGLY

    var div = document.createElement('div');
    div.className = 'rule';
    container.appendChild(div);

    div = document.createElement('div');
    div.className = 'content';
    {
        var button = document.createElement('a');
        button.className = 'btn_darkblue_white_innerfade btn_medium';
        button.onclick = OnClick;
        {
            var span = document.createElement('span');
            {
                var spanText = document.createTextNode("Open All New Posts");
                span.appendChild(spanText);
            }
            button.appendChild(span);
        }
        div.appendChild(button);

        div.appendChild(document.createElement('br'));

        var statusSpan = document.createElement('span');
        statusSpan.appendChild(g_sStatusText);
        div.appendChild(statusSpan);
    }
    container.appendChild(div);
}

function OnClick() {
    var listOfUnreadForums = document.getElementsByClassName('rightbox_list_option forum_list_unread');

    if(listOfUnreadForums.length === 0) {
        g_sStatusText.nodeValue = "There are no forums with new posts.";
        return;
    }

    for(var i = 0; i < listOfUnreadForums.length; ++i) {
        var a = listOfUnreadForums[i].lastElementChild.lastElementChild.lastElementChild;
        //console.log(a.href);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = HTTPCallback;
        xhr.open("GET", a.href, true);
        xhr.responseType = "document";
        xhr.send();
    }

    g_nUnreadForums = listOfUnreadForums.length;
    g_sStatusText.nodeValue = "Opening all posts in " + g_nUnreadForums + ' forums.';
}

function HTTPCallback() {
    if( this.readyState != XMLHttpRequest.DONE) {
        return;
    }

    if(this.status != 200) {
        console.log("Some sort of failure in HTTPCallback - status" + this.status);
        return;
    }

    var doc = this.responseXML;
    //console.log("CALLBACK: " + doc.title);

    var listOfUnreadTopics = doc.getElementsByClassName('forum_topic  unread');
    for(var i = 0; i < listOfUnreadTopics.length; ++i) {
        var a = listOfUnreadTopics[i].firstElementChild;
        window.open(a.href, '_blank');
    }
    // TODO: If the Page 2 (etc) may have unread topics check there.
}
