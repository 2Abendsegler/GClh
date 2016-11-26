// ==UserScript==
// @name           GC Del Ad
// @version        0.1
// @description    gc delete advertising
// @grant          GM_log
// @include        http://www.geocaching.com/*
// @include        https://www.geocaching.com/*
// @include        http://labs.geocaching.com/*
// @include        https://labs.geocaching.com/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @require http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js
// @require http://cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.2/dropbox.min.js
// ==/UserScript==

// Werbung gc.com entfernen.
    try {
        $('#ctl00_uxBanManWidget').children().remove();
        $('#div-message-center-ad').remove();
        $('#ctl00_ContentBody_divContentSide').children().remove();
        $('#ctl00_ContentBody_uxBanManWidget').children().remove();
        $('#Content').find('aside').children().remove();
    } catch (e) {
        gc_error("Werbung GC.com", e);
    }

// Error-Logging.
    function gc_error(modul, err) {
        var txt = "ERROR - " + modul + " - " + document.location.href + ": " + err.message + "\nStacktrace:\n" + err.stack 
                + (err.stacktrace ? ("\n" + err.stacktrace) : "");
        if (typeof(console) != "undefined") {
            console.error(txt);
        }
        if (typeof(GM_log) != "undefined") {
            GM_log(txt);
        }
    }

