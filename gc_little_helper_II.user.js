// ==UserScript==
// @name           GC little helper II
// @namespace      http://www.amshove.net
//--> $$000FE Begin of change
// @version        0.2.2.2
//<-- $$000FE End of change
// @include        http://www.geocaching.com/*
// @include        https://www.geocaching.com/*
// @include        http://labs.geocaching.com/*
// @include        https://labs.geocaching.com/*
// @include        http://maps.google.tld/*
// @include        http://www.google.tld/maps*
// @include        https://maps.google.tld/*
// @include        https://www.google.tld/maps*
// @exclude        *www.geocaching.com/seek/sendtogps.aspx*
// @exclude        *www.geocaching.com/blog/*
// @exclude        *www.geocaching.com/brandedpromotions/*
// @exclude        *www.geocaching.com/jobs/*
// @resource jscolor http://www.amshove.net/greasemonkey/js/jscolor/jscolor.js
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @require http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js
// @require http://cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.2/dropbox.min.js
// @description    Some little things to make life easy (on www.geocaching.com).
// @copyright      Torsten Amshove <torsten@amshove.net>
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_log
// @grant          GM_addStyle
// @grant          GM_listValues
// @grant          GM_xmlhttpRequest
// @grant          GM_getResourceText
// @grant          GM_registerMenuCommand
// @grant          GM_info
// ==/UserScript==

//*************************************************************************************************************************************************
// Kennz.  | Datum      | Entwickler    | zuVers. |
//*************************************************************************************************************************************************
// $$#  FE | Jan.2017   | FE            | 0.2.2.1 | 
// Change: [Enhancement #14] Hervorhebung geänderter Koordinaten flexibler gestalten. Danke an LittleJohn für die Vorarbeit.
// New: [Enhancement #30] Make colored illustration of versions in config selectable.
// Fix: [Bug #31] When using "Log your visit (inline)" and clicking "All visited" for the trackables list opens an empty new tab.
//*************************************************************************************************************************************************
// $$071FE | Jan.2017   | FE            | 0.2.2   | 
// New: In den Latest logs den Logtext anzeigen beim Drueberfahren mit der Maus. Wie bei der VIP Liste.  
// ------------------------------------------------------------------------------------------------------------------------------------------------
// $$070FE | Jan.2017   | FE            | 0.2.2   | 
// New: Sprache auf default Sprache aendern. Default Sprache im GClh Config hinterlegen. Hintergrund sind die Apps ..., die die Sprache abaendern.
// Change: GClh Config: Title bei Ueberschrift und obere Links wieder mal ueberarbeitet.
// Fix: GC Seite Jobs funktioniert nicht mit GClh, ist ja auch nicht notwendig. Seite excludieren.
// Fix: Linklist/Seachfield fälschlich in Map/Labs aufgebaut (Issue #24)
// ------------------------------------------------------------------------------------------------------------------------------------------------
// $$007CF | Jan.2017   | CF            | 0.2.2   |
// Bugfix: Configuration Menu: Remove cache types: APE und GPS Maze
// Bugfix: Map: Disable complete event category if event, cito, mega, giga is disabled (remove GPS maze)
// ------------------------------------------------------------------------------------------------------------------------------------------------
// $$069FE | Jan.2017   | FE/DieBatzen  | 0.2.2   | Issue #2
// Fix: Overview map in listing: zoom in/out loses cache marker. If you zoom in/out the overview map in a cache listing, the cache marker gets 
//      replaced by a default marker and the static image shows an error message. The reason is that GME changes the cache image link and 
//      therefore the proper marker creation fails.
// ------------------------------------------------------------------------------------------------------------------------------------------------
// $$006CF | Jan.2017   | CF            | 0.2.2   |
// Bugfix: cache types which are hidden by default are not shown disabled
// ------------------------------------------------------------------------------------------------------------------------------------------------
// $$005CF | Jan.2017   | CF            | 0.2.2   |
// Change: Configuration Menu: Reorder map options
//    * Move options "Hide sidebar by default", "Hide header by default" up
//    * Move option "Add link to Google Maps on GC Map" and child "Switch to Google Maps in same browser tab" into section Google Maps page
//    * Move option "Show Hillshadow by default" closer to layer section
//    * In case option Replace layercontrol by GClh is unchecked - depended options are hidden
//    * Some smaller fixes in the Map option sections
// ------------------------------------------------------------------------------------------------------------------------------------------------
// $$004CF | Jan.2017   | CF            | 0.2.2   |
// Change: Configuration menu: improve layer selection
// ------------------------------------------------------------------------------------------------------------------------------------------------
// $$003CF | Jan.2017   | CF            | 0.2.2   |
// New: Map: Default Geocaching Layer
// ------------------------------------------------------------------------------------------------------------------------------------------------
// $$002CF | Jan.2017   | CF            | 0.2.2   |
// Change: Configuration menu: new map icons for cache types
// ------------------------------------------------------------------------------------------------------------------------------------------------
// $$001CF | Jan.2017   | CF            | 0.2.2   |
// New: Configuration menu: clickable label text for checkboxes
//*************************************************************************************************************************************************
// $$068FE | Jan.2017   | FE            | 0.2.1   |
// New: Downloadzaehler simulieren.
// ------------------------------------------------------------------------------------------------------------------------------------------------
// $$067FE | Jan.2017   | FE            | 0.2.1   |
// New: Cache Listing: Latest Logs Symbole im Kopf des Listings anzeigen. Über GClh Config steuern.
// ------------------------------------------------------------------------------------------------------------------------------------------------
// $$066FE | Jan.2017   | FE            | 0.2.1   |
// New: GClh Config: GClh Sync als neue Bookmark zum Aufruf aus Linklist eingerichtet.
// Change: GClh Config: Links im Kopf vom GClh Config überarbeitet.
// ------------------------------------------------------------------------------------------------------------------------------------------------
// $$065FE | Dez.2016   | FE            | 0.2.1   |
// New: Logs anzeigen: Wenn nicht alle eigenen Logs geladen werden, weil beispielsweise das Laden der Seite über den Browser gestoppt wurde, dann
//      angeben wieviele Logs geladen wurden und das Datum des letzten geladenen Logs angeben, Cache und Trackables. (Wird das Laden der Seite
//      über den Browser gestoppt, funktioniert nicht mehr alles auf der Seite, so z.B. die Linklist.)
// ------------------------------------------------------------------------------------------------------------------------------------------------
// $$064FE | Dez.2016   | FE            | 0.2.1   |
// New: Cache Listing: Make VIP lists hideable. Über GClh Config steuern.
//*************************************************************************************************************************************************
// $$063FE | Dez.2016   | FE            | 0.1     |
// Fix: Bei Eigenen Favoriten kein VIP Icon aufbauen. Hier steht gegebenenfalls das Pseudonym des Owners.
// Fix: Save HomeCoords von Account Settings Seite funktionierte nicht mehr.
// Fix: Select Buttons in einer Bookmarkliste aufbauen, aber nicht bei der Ablistung aller Bookmarklisten.
// Fix: In Bookmarkliste nach dem Löschen von Einträgen (...bookmarks/bulk.aspx...) fehlt Zebra.
// Fix: Farbliche Logkennzeichnung für User mit Sonderzeichen [] korrigiert.
// ------------------------------------------------------------------------------------------------------------------------------------------------
// $$062FE | Dez.2016   | FE            | 0.1     |
// Change: Spezielle Links Profile Tabs, Nearest Lists/Map, Own Trackables, GClh Config, GClh Sync und Find Player mit rechter und linker 
//         Maustaste funktionsfähig machen mit Standard Contextmenü und postback. (War bei $$058 auf die Schnelle nicht machbar gewesen.)
// ------------------------------------------------------------------------------------------------------------------------------------------------
// $$061FE | Dez.2016   | FE            | 0.1     |
// Change: Check Updates verlegt und ohne functions aufgebaut.
// Change: Hide Avatar umgelegt.
// Change: Config und Sync Aufrufe zusammengelegt und umgebaut. Rechte, linke Maus überall ok.
// ------------------------------------------------------------------------------------------------------------------------------------------------
// $$060FE | Dez.2016   | FE            | 0.1     |
// Change: Umstellung GClh (2As) als eigenständig ohne GClh. (Nicht dokumentiert.)
// Change: Bisherige Doku entfernt. (Nicht dokumentiert.)
// Change: Umstellung Änderungskennzeichen. Entwicklerkennzeichen für eigene Nummerierung je Entwickler eingebaut. (Nicht dokumentiert.)
// Change: newParameter umgebaut, so dass sie weiter verwendbar sind. (Nicht dokumentiert.)
// Change: Link zu alter deutscher Anleitung entfernt und Link github angepaßt.
//*************************************************************************************************************************************************
// $$000FE | Aug.2016   | FE            | 11.7    |
// Versionierung, bei neuen Versionen beachten.
//*************************************************************************************************************************************************

var jqueryInit = function (c) {
    if (typeof c.$ === "undefined") {
        c.$ = c.$ || unsafeWindow.$ || window.$ || null;
    }
    if (typeof c.jQuery === "undefined") {
        c.jQuery = c.jQuery || unsafeWindow.jQuery || window.jQuery || null;
    }

    var jqueryInitDeref = new jQuery.Deferred();

    jqueryInitDeref.resolve();

    return jqueryInitDeref.promise();
};

var quitOnAdFrames = function (c) {
    var quitOnAdFramesDeref = new jQuery.Deferred();
    if (window.name.substring(0, 18) !== 'google_ads_iframe_') {
        quitOnAdFramesDeref.resolve();
    }
    else {
        quitOnAdFramesDeref.reject();
    }

    return quitOnAdFramesDeref.promise();
};

var browserInit = function (c) {
    var browserInitDeref = new jQuery.Deferred();
    c.CONFIG = {};
    c.browser = "firefox";

    if (typeof(chrome) != "undefined") {
        c.browser = "chrome";

        c.unsafeWindow = window;

        //Only for migration
        if ((typeof(c.GM_getValue) === "undefined" || (c.GM_getValue.toString && c.GM_getValue.toString().indexOf("not supported") !== -1)) && typeof(localStorage) !== "undefined") {
            c.GM_getValue = function (key, defaultValue) {
                var result = localStorage.getItem(key);
                if (!result || result == "undefined") {
                    return defaultValue;
                }
                else {
                    var type = result[0];
                    switch (type) {
                        case 'b':
                            result = result.substring(1);
                            return result == 'true';
                        case 'n':
                            result = result.substring(1);
                            return Number(result);
                        case 's':
                            result = result.substring(1);
                            return String(result);
                        default:
                            return result;
                    }
                }
            };
        }

        if (typeof(c.GM_setValue) == "undefined" || (c.GM_setValue.toString && c.GM_setValue.toString().indexOf("not supported") != -1)) {
            c.GM_setValue = function (key, defaultValue) {
                console.log("Dummy GM_setValue");
            }
        }

        if ((typeof(c.GM_listValues) === "undefined" || (c.GM_listValues.toString && c.GM_listValues.toString().indexOf("not supported") !== -1)) && typeof(localStorage) !== "undefined") {
            c.GM_listValues = function () {
                return Object.keys(localStorageCache);
            };
        }

        if (typeof(c.GM_xmlhttpRequest) == "undefined" || (c.GM_xmlhttpRequest.toString && c.GM_xmlhttpRequest.toString().indexOf("not supported") != -1)) {
            c.GM_xmlhttpRequest = function (requestData) {
                var httpReq = new window.XMLHttpRequest();
                if (requestData["onreadystatechange"]) {
                    httpReq.onreadystatechange = function (data) {
                        requestData["onreadystatechange"](this);
                    }
                }

                if (requestData["onload"]) {
                    httpReq.onload = function (data) {
                        if (this.status == 200) {
                            requestData["onload"](this);
                        }
                    }
                }

                if (requestData["onerror"]) {
                    httpReq.onload = function (data) {
                        requestData["onerror"](this);
                    }
                }

                httpReq.open(requestData.method, requestData.url);

                if (requestData.headers) {
                    for (var header in requestData.headers) {
                        if (header == "User-Agent" || header == "Origin" || header == "Cookie" || header == "Cookie2" || header == "Referer") {
                            continue;
                        }
                        httpReq.setRequestHeader(header, requestData.headers[header]);
                    }
                }

                httpReq.send(typeof requestData.data == 'undefined' ? null : requestData.data);
            }
        }

		var initialConfigRecv = false;
        chrome.runtime.sendMessage({"getGclhConfig": ""}, function (data) {
			if(initialConfigRecv){
				return;
			}
			initialConfigRecv = true;
            if (typeof(data) !== "undefined") {
                c.CONFIG = data;
            }
            else {
                c.CONFIG = {};
            }

            browserInitDeref.resolve();
        });
    }
    else if (browser === "firefox") {
        // Check for Scriptish bug in Fennec browser (http://www.geoclub.de/viewtopic.php?f=117&t=62130&p=983614#p983614)
        c.GM_setValue("browser", browser);
        var test_browser = c.GM_getValue("browser");
        if (!test_browser) {
            //console.log("Scriptish GM_getValue bug detected");
            var GM_getValue_Orig = c.GM_getValue;
            c.GM_getValue = function (key, def) {
                return GM_getValue_Orig("scriptvals.GClittlehelper@httpwww.amshove.net." + key, def);
            }
        }

        c.CONFIG = JSON.parse(GM_getValue("CONFIG", '{}'));

        browserInitDeref.resolve();
    }
    else {
        c.CONFIG = JSON.parse(GM_getValue("CONFIG", '{}'));

        browserInitDeref.resolve();
    }

    return browserInitDeref.promise();
};

var constInit = function (c) {
    var constInitDeref = new jQuery.Deferred();

    // Set defaults
    c.scriptName = GM_info.script.name;
    c.scriptVersion = GM_info.script.version;
    c.scriptNameConfig = "GC little helper Config II";
    c.scriptNameSync = "GC little helper Sync II";
    c.scriptShortNameConfig = "GClh Config II";
    c.scriptShortNameSync = "GClh Sync II";
    c.anzCustom = 10;
    c.anzTemplates = 10;
    c.bookmarks_def = new Array(16, 18, 13, 14, 17, 12);
//--> $$061FE Begin of insert
    c.defaultConfigLink = "https://www.geocaching.com/my/default.aspx#GClhShowConfig";
    c.defaultSyncLink = "https://www.geocaching.com/my/default.aspx#GClhShowSync";
//<-- $$061FE End of insert

    // define bookmarks
    // New Bookmarks under custom_Bookmarks ..
    c.bookmarks = new Array();
    // WICHTIG: Die Reihenfolge darf hier auf keinen Fall geändert werden, weil dadurch eine falsche Zuordnung zu den 
    //          gespeicherten Userdaten erfolgen würde! Weiter unten gibt es noch einen Bereich mit Bookmarks, die quasi
    //          noch hinten dran gehängt werden.
    bookmark("Watchlist", "https://www.geocaching.com/my/watchlist.aspx", c.bookmarks);
    bookmark("Logs Geocaches", "https://www.geocaching.com/my/geocaches.aspx", c.bookmarks);
    bookmark("Own Geocaches", "https://www.geocaching.com/my/owned.aspx", c.bookmarks);
    bookmark("Logs Trackables", "https://www.geocaching.com/my/travelbugs.aspx", c.bookmarks);
    bookmark("Trackables Inventory", "https://www.geocaching.com/my/inventory.aspx", c.bookmarks);
    bookmark("Trackables Collection", "https://www.geocaching.com/my/collection.aspx", c.bookmarks);
    bookmark("Logs Benchmarks", "https://www.geocaching.com/my/benchmarks.aspx", c.bookmarks);
    bookmark("Member Features", "https://www.geocaching.com/my/subscription.aspx", c.bookmarks);
    bookmark("Friends", "https://www.geocaching.com/my/myfriends.aspx", c.bookmarks);
    bookmark("Account Details", "https://www.geocaching.com/account/default.aspx", c.bookmarks);
    bookmark("Public Profile", "https://www.geocaching.com/profile/", c.bookmarks);
    bookmark("Search GC (old adv.)", "https://www.geocaching.com/seek/nearest.aspx", c.bookmarks);
    bookmark("Routes", "https://www.geocaching.com/my/userroutes.aspx#find", c.bookmarks);
    bookmark("Field Notes Upload", "https://www.geocaching.com/my/uploadfieldnotes.aspx", c.bookmarks);
    bookmark("Pocket Queries", "https://www.geocaching.com/pocket/default.aspx", c.bookmarks);
    bookmark("Pocket Queries Saved", "https://www.geocaching.com/pocket/default.aspx#DownloadablePQs", c.bookmarks);
    bookmark("Bookmarks", "https://www.geocaching.com/bookmarks/default.aspx", c.bookmarks);
    bookmark("Notifications", "https://www.geocaching.com/notify/default.aspx", c.bookmarks);
//--> $$062FE Begin of change
//    profileBookmark("Find Player", "lnk_findplayer", c.bookmarks);
    profileSpecialBookmark("Find Player", "#GClhShowFindPlayer", "lnk_findplayer", c.bookmarks);
//<-- $$062FE End of change
    bookmark("E-Mail", "https://www.geocaching.com/email/default.aspx", c.bookmarks);
    bookmark("Statbar", "https://www.geocaching.com/my/statbar.aspx", c.bookmarks);
    bookmark("Guidelines", "https://www.geocaching.com/about/guidelines.aspx", c.bookmarks);
    profileSpecialBookmark(c.scriptShortNameConfig, "https://www.geocaching.com/my/default.aspx#GClhShowConfig", "lnk_gclhconfig", c.bookmarks);
    externalBookmark("Forum", "http://forums.groundspeak.com/", c.bookmarks);
    externalBookmark("Blog", "https://www.geocaching.com/blog/", c.bookmarks);
    bookmark("Feedback", "https://www.geocaching.com/feedback/", c.bookmarks);
    externalBookmark("Geoclub", "http://www.geoclub.de/", c.bookmarks);
//--> $$062FE Begin of change
//    profileBookmark("Public Profile Geocaches", "lnk_profilegeocaches", c.bookmarks);
//    profileBookmark("Public Profile Trackables", "lnk_profiletrackables", c.bookmarks);
//    profileBookmark("Public Profile Gallery", "lnk_profilegallery", c.bookmarks);
//    profileBookmark("Public Profile Lists", "lnk_profilebookmarks", c.bookmarks);
    profileSpecialBookmark("Public Profile Geocaches", "https://www.geocaching.com/profile/default.aspx?#gclhpb#ctl00$ContentBody$ProfilePanel1$lnkUserStats", "lnk_profilegeocaches", c.bookmarks);
    profileSpecialBookmark("Public Profile Trackables", "https://www.geocaching.com/profile/default.aspx?#gclhpb#ctl00$ContentBody$ProfilePanel1$lnkCollectibles", "lnk_profiletrackables", c.bookmarks);
    profileSpecialBookmark("Public Profile Gallery", "https://www.geocaching.com/profile/default.aspx?#gclhpb#ctl00$ContentBody$ProfilePanel1$lnkGallery", "lnk_profilegallery", c.bookmarks);
    profileSpecialBookmark("Public Profile Lists", "https://www.geocaching.com/profile/default.aspx?#gclhpb#ctl00$ContentBody$ProfilePanel1$lnkLists", "lnk_profilebookmarks", c.bookmarks);
//<-- $$062FE End of change
    bookmark("Profile", "https://www.geocaching.com/my/", c.bookmarks);
//--> $$062FE Begin of change
//    profileBookmark("Nearest List", "lnk_nearestlist", c.bookmarks);
//    profileBookmark("Nearest Map", "lnk_nearestmap", c.bookmarks);
//    profileBookmark("Nearest List (w/o Founds)", "lnk_nearestlist_wo", c.bookmarks);
//    profileBookmark("Own Trackables", "lnk_my_trackables", c.bookmarks);
    profileSpecialBookmark("Nearest List", "https://www.geocaching.com/seek/nearest.aspx?#gclhpb#errhomecoord", "lnk_nearestlist", c.bookmarks);
    profileSpecialBookmark("Nearest Map", "https://www.geocaching.com/seek/nearest.aspx?#gclhpb#errhomecoord", "lnk_nearestmap", c.bookmarks);
    profileSpecialBookmark("Nearest List (w/o Founds)", "https://www.geocaching.com/seek/nearest.aspx?#gclhpb#errhomecoord", "lnk_nearestlist_wo", c.bookmarks);
    profileSpecialBookmark("Own Trackables", "https://www.geocaching.com/track/search.aspx?#gclhpb#errowntrackables", "lnk_my_trackables", c.bookmarks);
//<-- $$062FE End of change
//--> $$070FE Begin of insert
    c.langus = new Array("Català", "Čeština", "Dansk", "Deutsch", "English", "Ελληνικά", "Eesti", "Español", "Français", "Italiano", "日本語", "한국어", "Latviešu", "Lëtzebuergesch", "Magyar", "Nederlands", "Norsk, Bokmål", "Polski", "Português", "Română", "Русский", "Slovenščina", "Suomi", "Svenska");
//<-- $$070FE End of insert

    c.gclhConfigKeysIgnoreForBackup = {
        "token": true,
        "settings_configsync_configid": true,
        "doPostBack_after_redirect": true,
        "dbToken": true,
        "hide_contribute": true
    };
    c.global_log_it_icon = "data:image/png;base64,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";
    c.global_mail_icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAKCAYAAAC9vt6cAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oHHg0gKjtwF3IAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAABdElEQVQoz4WRMaviUBSEv5s8H8RO0Eq00SiCRMQigoiCYC2I/hhbwd8g1lpZWFioECwl2IqIwT5iGdDCK94tlhf27cK+gWmGYZg5R9i2rUzTpFAooOs6AEIINE1DCPEPv/T3+81yuURMJhNlmiYAtVqNSCTCT7her6zXa6SUaFJKms0m8XicxWLB5XIJjUqpkAD3+53tdovruvT7faSUfHyZi8UiyWQSx3HwfZ96vY4QIgy73W5sNhssy6LRaIRztT+rxWIxer0eUkpms1moe57HfD6n0+lQKpXQdT1s9fH3PqUUmUwG13UZjUaUy2V2ux2WZRGNRlFKfWv2LSAIAlzXJQgCBoMBz+eTw+HAcDjE8zym0ynVapVsNhtOCAOOxyOn04l8Pk+73Qbg8/OTSqWCUopcLkcikWC/33M+n2m1Wr9fPh6PVTqdxjAMbNvGMIwf3+j7Po7j8Hg8EJZlqW63SyqVQtO08Dj/gxCC1+vFarXiF7aOl1qte6kYAAAAAElFTkSuQmCC";
    c.global_gc_icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAIAAABt+uBvAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKMUlEQVR42u2deVxTVxbH+8d8Oq0sQYqorYMoJAGqiEvFBQEFzIYEAhRQwAXpoIV0cC2oHVBERSm4Vz7aquCg1bFDtXasthWtQAUUEBEVEIIhmQCy7wTnJIHHy0JMIIEE3v38Ppq8d/Pefd/ce865950X3rH1MZ3rNQWTTAGcd+C/mfQJmGQK4GCAMEAYIAwQBggDhAHCAGGAMGGAMEAYIG0A5DbBaoWhyiV1ImMr1/Eq10y6kdoBrdiw4Otzu+PO7FJEB07vVET7kiKsPSaiz2LDmHQ0Zd+xC/sV0z6o/FZBTfdQO7UD2now+I2qS3tHmw1jsnjLPurp6VH5ibYd+kztgDbHBYlOllOYcfnmuY7OdplNKS4rfFpaIL09uzCzhFUssbGlrdnGYxL6LHM8P+Tzu1UOaEvcevUDOtALqKi0YLLD+zA6pNux5+T26ct1QBEJTPT2iqpSImXS8/KiUQ2orwdB2XRg/TSX99J+u4RuRF5xNqCBmjPcjMzJOrlPMkXbG5vrnddZr45wl273qAXEramCC7OgGdz8Iw3ZmJ79i8my9xnMJQHbaWakcb9m3YCNHZ0dayLdTJ3fy32SNYYAQUm5lgQbndfZwsBpbm2sa3zd2tZiHzDzSErs1VsX5vsQmluburq7QmMC8GT90Bh/me2WBWgyt4atcjs9rDYISje/GzrR9fQrpy7FfxpO9t20oqW1GYZSbX31vqQdYImq67ht7a3B//SGXjaDPvF/tRwFAQlH6Ad2q4gh0T6pP51hccq0rAfV1PFWR3gt9LNyCJwVfzbK2n1iREJoUUl++P4geAsX3DcG2R5hSyxdx+Mpuj/c/tdA7ZYJSKSP3T4g0nDA1/MLx2t3voeAQDsAQedPOL83Kz+d38OHt3UNNefTToLhsHQ1wJP17PwJJ1IPXr9zeZ63ieAKqQZfJmyU0245gNAyJ+k4BFpdvPHtoM3TcA8xUcnKS3dcPYvBdCJS9UV1rN2NLWg4c5IevIBphO/m5Z1dHUMHJDqyOVnPbeOiotJ8LQBUyS3fEO03Zem7x1Pj4O3Ow0wiFWdNN0bZESMYGmCn5bdbJiDAjT6UhCxo48E/aLoXK6t8vmilFXgr0dvOrs6QaN+PxWeeC/ymwySoqaVRKUAwWsEPrtpGm+P1EYGqB+NUoh/BNwHxhBa4eXDh6Ldgdwh9Aw25GDwFtySA+PuD/yoDqHcuBj7x5v20lVspBIo+9EfRXgIFd/Dbr7TGBiGlsblBeDTjXmNB0gVLBC9Eyxd4sk5kYmiLrOEmExCfz0fXefzi0ZpIOoTmsJfBdJD4YjS3B6FL/NloS8Gai6Aa2OaLP3+XmLyHFDyHQBFYa6HlNnDdsIDNYw0CkKjcuHt1ga8Z2D6tiaSR0tBUhyxZgMnYkRiKBJOnrxwGNKKeBbvmeU8te/VicIAEg7qrU2siaYk5B0wmem0EFQf2G703My/dgmbYN9wmzPM2ragqGxwgbZpqoIvnP5aKrl/o2pdJV/gt62c8WRdhBCFffVOdagHdyvjxqdz4aMQA8Wo5M+iIi9FLTvtGZvvizuyyoOKQQCb8wDpVAWpqaYhMDIMYksF0FAX3mgUIZklmJJ2+K8cVvng00NKqS5BNv/sn64pWi4YI6GFRln2gJZg50THvPLipcUZ698ktwAWp09BUP1ATIbpzXGNDC/nE1scUPJ0nkzREQI+fP5zmMs4a9VlGmL3G9SAGcxlSwW4VXv7MCymcavatjGut7S1D7EGBX7oiMSTIjKRb8CxHgwCBI7cPsEAqOAfN6nmj3ELXEAE9evonWJ/+FZIVEGSEaRAgQQSEujzK3+cp632GbqTdQxejPw69WGa4NDKAuDVVBIouUoEaMn/4Af37lxQitd8IQntyCjM0BRCLUwa+Y2R7EO81F33/Gk/WO30lUVMAwbwBDcg5yGb4AUFx+3wJKoHAKGC7m6YAesWtQAOCkETZqbZKAO1PikCHGvA9SfuK4QAUFuPPrWFX8ViInpU/QS+Szf/UhMUpr+JVKi6Yl0kD4vBecarfKrZI3Gr2uf+cgCAeOcJsxuRydimyF8Sr5TJjA4cjPwhmFTApRwT9GZlhISut6ApvlTCKETuCNd0YNs4Q7ELLSI7gIxLNmEkXq4AlUGEZZhggDNDYAASTnd7cQleB4K2ECQRjKajjaihLMrMHDaWMdK+xV6GGCVBojH8lt7yiqhQEfhTE4rzcEheELNeDSMHzKznlor1SKpHWS3bJHM8PxXIUPSaxuOUQTygkgS9/e0zAq+WE7fVXOyCItaSDtPNpJ81RsaKt77SBUvNkFogJIfCRAIRkQKiwQJQ7MoBuZVxDVhSFWQZ6paxnGKD+wuax0HNFCPlTfzqDARIrzkGz0NXWRrqpAxCYv9wnmaCcwgxQduF9gR7ff/D4jwcFoHt/FtzLyr8rUmZeembeHXihEYB2HfkCPBdSDRwTTIJUDmjtDp+pTuOmOumATEDLhP/2aaq4piz962wPQlZeukYAgi9qmosOKnnFIPH8HpUDOpy8F70wJjeNSDd0j39jc72mDLGurk6HQEt0E+HI9Y2vVQvoxt2r6K9hIEHMcfaH45plg6B8cyne0tWg31RTcbuOblEtoLzibLS7lBnELl5FLCx5pHFGWpCp2Fg7U7jmIExwMlgePDu/OFu1gGrrq6XWNFCJSGS9kCjfhr472hoHCArYHTxFD/pO7KmI1vYWdbh5O3/CAEl5BjLXoTULUHNrE4PpCB5XqfBEKUCB22mST5atMFzkZ65Ibx15QIMrSgGKOhaOJEoI8/v013/lVddQq+mB4rABSr1+GlmcB0t36lK84jdyNR1Q8o9J19MvDxEQBFzgyGBYLfQzz+l7lGg0AHpeXmRBG48n6zL3Br4STzJUChCLUwaAfDe71NTxtGkuJr+0tbeSgucgGYyWroYRCRuLSvNFyU5KAWrvaJvr9bdth0K0bLIqv0Qd2wT2Ah2zQEgJpoQaYvv12eh7ub/O9VJiNk8K/sQ73Gn0AHpZ+YJA0bce4IBEqv705ToSTx3IBxQW479wpVl3d/fo6UEwmpavny3A5G6syFnkAzqRGoen6PJec0cPIMGTHJ0dSd8nzPM2gchliIBgymrq8q7MBBetj4Ngvnby4kE7fwuYkQhvZgwGEPRHk2V/uXr7wigE1OuJOtvvP/x955Ew+wArIg0nsEHuStig+qY6IhV3SPnnWbQykq6oKrubc0siu0M+IAgOlq6ZsSaSPiYAvRE+4KmUm4eycivNaa3NWAHE53dL3ziUDyjqeDhEm3KWfsY6oHu5t6OOb5b/IOOYBqS598W2HfpsOGwQY3Lb0B6Rl1m2HgxWOyD654uPpsQePh/zdiXvPaKoYm0YYl5slsfEhHO7j6TEKiKFf4dpP10831xN6S9GavjxLBkRozC9Rgt/ogtLoMKEAcIAYYAwQBggDBAGCAOECQOEAcIAqR0Q9uez5P/5rP8DWTplYkml8pkAAAAASUVORK5CYII=";
    c.global_message_icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAKCAMAAABsSeXqAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAq1BMVEX/AAAuLi43NzdERERTU1NcXFyBgYGFhYWIiIiJiYmLi4uMjIyNjY2Ojo6Pj4+QkJCRkZGSkpKTk5OUlJSVlZWYmJiampqcnJyenp6fn5+goKCioqKkpKSpqamqqqqrq6uvr6+xsbG2tra4uLi9vb2/v7/CwsLMzMzQ0NDT09PU1NTZ2dnb29vn5+fp6enu7u7x8fHy8vL09PT19fX29vb6+vr8/Pz+/v7///+lQzgqAAAAAXRSTlMAQObYZgAAAIxJREFUCB01wQcSgjAQBdC1Y28LCrGGIoIKomb//U9mJjO8R053MPK88WQ6my+W682qR06Qpj+0nmFADuN+fAAigia5fJiskhmoThmsl8oNmByGlRyAcvsGhIlIMzMAkUxplRuBMDkM1CJobhCpDZgKzRaKcw1LUMXXhsnxdfpFK1Y+OZ3hPgpb0a7/B4B/GcUl57niAAAAAElFTkSuQmCC";
    c.global_stop_ignore_icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAmVBMVEX////Nzc3Pzs/S0tLW1tbX19fZ2dnc3Nzf39/h4eHiDRXjGCDkGyPkHiblJCvlKTHmLDPmLzbmMjnnNTznO0HoQEfoQ0npRkzrVFrt7O3uc3jveX7v7+/wgobwhYnx8fHyk5by8vLzmZzznqH0oaT0pKf0p6r2srX4xsj5z9D5+fn61Nb6+vr7+/v8/Pz98fH9/f3+9vf//Py/jJ9UAAAAAXRSTlMAQObYZgAAAK9JREFUGBkFwQlCwjAURdH7yG8NsUyiIloMLWE0kcj+F+c5APReko8AALdGkiS1GYCbkw2ZHE0uAzRSUwCqVwv0MpMVgGoa4ElDMVkBiJqCU6XYZPsLZBlIQLHJ9msVXnYCpwoUW89P17R++8MrAnzOwxHui2+iXAVm5xSOkFbQylcIP6SQuHSQnazPsxOkcBhfgdxK2i3vcAjdCMAwNW2W42X//PEAAOCxf+82I/wDKl0NPPJFCYkAAAAASUVORK5CYII=";
    c.global_restore_icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAA5FBMVEX////q6uqEhITR0dEfHx9HR0f7+/v8/Pz+/v6vr68LCwtHR0b4+Pj+/v6Dg4MBAQEJCQg0NDR3d3fOzs729vZZWVk/Pz/Pz8/+/v68vLwHBwcGBgajo6P4+Pi/v78WFhYLCwvX19fT09IlJSQmJiZqamokJCSHh4fr6+s5OTlHR0f9/fybm5oHBweCgoL39/dUVFT19fX09PRWVlbExMT+/v6xsbFpaWlDQ0P6+vogICAXFxfj4+OWlpYTExPZ2dktLS3V1dXu7u5wcHDs7Oz8/PzJyckCAgIEBAMEBAQAAAAAAADG7gw5AAAAAXRSTlMAQObYZgAAAIVJREFUGBlVwecOQUEQBtBP+4FEDTdKdC43WkIQvYXZmfd/HxlLsnsOrFgcnkQyBVc6887CkcuTKRRLZfxUmAyxiFQDqFqdDLGoRhOq1SYWxdTpQvX6IoPhiMlQiK/xRCJgOiOew1osIwArljX+NgC2soNnfzjCdToHcF2uN7jujyc8L1gfFdIUEEvB1dMAAAAASUVORK5CYII=";

    constInitDeref.resolve();
    return constInitDeref.promise();
};

var variablesInit = function (c) {
    var variablesInitDeref = new jQuery.Deferred();

    c.userInfo = c.userInfo || window.userInfo || null;
    c.isLoggedIn = c.isLoggedIn || window.isLoggedIn || null;
    c.userDefinedCoords = c.userDefinedCoords || window.userDefinedCoords || null;
    c.userToken = c.userToken || window.userToken || null;

    c.http = "http";
    if (document.location.href.toLowerCase().indexOf("https") === 0) {
        c.http = "https";
    }
    c.global_imageGallery = false;    
    c.global_dependents = new Array();    

    // Settings: Submit Log on F2
    c.settings_submit_log_button = getValue("settings_submit_log_button", true);
    // Settings: Log Inline
    c.settings_log_inline = getValue("settings_log_inline", true);
    c.settings_log_inline_tb = getValue("settings_log_inline_tb", false);
    c.settings_log_inline_pmo4basic = getValue("settings_log_inline_pmo4basic", false);
    // Settings: Show Bookmarks
    c.settings_bookmarks_show = getValue("settings_bookmarks_show", true);
	c.settings_change_header_layout = getValue("settings_change_header_layout", true);
    // Settings: Bookmarks on Top
    c.settings_bookmarks_on_top = getValue("settings_bookmarks_on_top", true);
    c.settings_bookmarks_top_menu = getValue("settings_bookmarks_top_menu", "true");
    c.settings_bookmarks_search = getValue("settings_bookmarks_search", "true");
    c.settings_bookmarks_search_default = getValue("settings_bookmarks_search_default", "");
    // Settings: Redirect to Map
    c.settings_redirect_to_map = getValue("settings_redirect_to_map", false);
    // Settings: Hide Facebook
    c.settings_hide_facebook = getValue("settings_hide_facebook", false);
    // Settings: Hide SocialShare
    c.settings_hide_socialshare = getValue("settings_hide_socialshare", false);
    // Settings: Hide Disclaimer
    c.settings_hide_disclaimer = getValue("settings_hide_disclaimer", true);
    // Settings: Hide Cache Notes
    c.settings_hide_cache_notes = getValue("settings_hide_cache_notes", false);
    // Settings: Hide Cache Notes if empty
    c.settings_hide_empty_cache_notes = getValue("settings_hide_empty_cache_notes", true);
    // Settings: Show all Logs
    c.settings_show_all_logs = getValue("settings_show_all_logs", true);
    c.settings_show_all_logs_count = getValue("settings_show_all_logs_count", "5");
    // Settings: Decrypt Hint
    c.settings_decrypt_hint = getValue("settings_decrypt_hint", false);
    // Settings: Add visitCount to geochecker.com  links
    c.settings_visitCount_geocheckerCom = getValue("settings_visitCount_geocheckerCom", false);
    // Settings: Show Smilies & BBCode
    c.settings_show_bbcode = getValue("settings_show_bbcode", true);
    // Settings: Show mail-Link
    c.settings_show_mail = getValue("settings_show_mail", true);
    // Settings: Show Coord-Link in Mail
    c.settings_show_mail_coordslink = getValue("settings_show_mail_coordslink", false);
    //Settings: Schriftgröße im Menü in Pixel
    c.settings_font_size_menu = getValue("settings_font_size_menu", 15);
    //Settings: Schriftgröße im Untermenü in Pixel
    c.settings_font_size_submenu = getValue("settings_font_size_submenu", 13);
    //Settings: Horizontale Abstände zwischen den Menüs in Pixel 
    c.settings_distance_menu = getValue("settings_distance_menu", 8);
    //Settings: Vertikale Abstände zwischen den Untermenüs in Pixel
    c.settings_distance_submenu = getValue("settings_distance_submenu", 8);
    //Settings: Schriftfarbe im Menü und im Submenü
    c.settings_font_color_menu_submenu = getValue("settings_font_color_menu_submenu", "93B516");
    //Settings: Anzahl Zeilen bei Menüs in horizontaler Ausrichtung
    c.settings_menu_number_of_lines = getValue("settings_menu_number_of_lines", 1);
    // Settings: Show Separator bei Menüs in horizontaler Ausrichtung
    c.settings_menu_show_separator = getValue("settings_menu_show_separator", false);
    // Settings: Menüs rechts ausrichten
    c.settings_menu_float_right = getValue("settings_menu_float_right", false);
    // Settings: GC Tour is working
    c.settings_gc_tour_is_working = getValue("settings_gc_tour_is_working", false);
    // Settings: Show smaller User-Settings-Message-Area top right
    c.settings_show_smaller_area_top_right = getValue("settings_show_smaller_area_top_right", true);
    // Settings: Show smaller Geocaching Link top left
    c.settings_show_smaller_gc_link = getValue("settings_show_smaller_gc_link", true);
    // Settings: Show Message-Link
    c.settings_show_message = getValue("settings_show_message", true);
    // Settings: Show Coord-Link in Message
    c.settings_show_message_coordslink = getValue("settings_show_message_coordslink", false);
    // Settings: Show Stop Ignoring Link
    c.settings_show_remove_ignoring_link = getValue("settings_show_remove_ignoring_link", true);
    // Settings: Zeilen in gewöhnlichen Listen in Zebra einfärben
    c.settings_show_common_lists_in_zebra = getValue("settings_show_common_lists_in_zebra", true);
    // Settings: Founds in Zeilen in gewöhnlichen Listen einfärben
    c.settings_show_common_lists_color_user = getValue("settings_show_common_lists_color_user", true);
    // Settings: Zeilen in Cache Listings in Zebra einfärben
    c.settings_show_cache_listings_in_zebra = getValue("settings_show_cache_listings_in_zebra", false);
    // Settings: Zeilen in Cache Listings für User einfärben
    c.settings_show_cache_listings_color_user = getValue("settings_show_cache_listings_color_user", false);
    // Settings: Zeilen in Cache Listings für Owner einfärben
    c.settings_show_cache_listings_color_owner = getValue("settings_show_cache_listings_color_owner", false);
    // Settings: Zeilen in Cache Listings für Reviewer einfärben
    c.settings_show_cache_listings_color_reviewer = getValue("settings_show_cache_listings_color_reviewer", false);
    // Settings: Zeilen in Cache Listings für VIPs einfärben
    c.settings_show_cache_listings_color_vip = getValue("settings_show_cache_listings_color_vip", false);
    // Settings: Zeilen in TB Listings in Zebra einfärben
    c.settings_show_tb_listings_in_zebra = getValue("settings_show_tb_listings_in_zebra", false);
    // Settings: Zeilen in TB Listings für User einfärben
    c.settings_show_tb_listings_color_user = getValue("settings_show_tb_listings_color_user", true);
    // Settings: Zeilen in TB Listings für Owner einfärben
    c.settings_show_tb_listings_color_owner = getValue("settings_show_tb_listings_color_owner", true);
    // Settings: Zeilen in TB Listings für Reviewer einfärben
    c.settings_show_tb_listings_color_reviewer = getValue("settings_show_tb_listings_color_reviewer", false);
    // Settings: Zeilen in TB Listings für VIPs einfärben
    c.settings_show_tb_listings_color_vip = getValue("settings_show_tb_listings_color_vip", false);
    //Settings: Farbe um Zeilen in Zebra einzufärben
    c.settings_lines_color_zebra = getValue("settings_lines_color_zebra", "EBECED");
    //Settings: Farbe um Zeilen für User bzw. founds einzufärben
    c.settings_lines_color_user = getValue("settings_lines_color_user", "C2E0C3");
    //Settings: Farbe um Zeilen für Owner einzufärben
    c.settings_lines_color_owner = getValue("settings_lines_color_owner", "E0E0C3");
    //Settings: Farbe um Zeilen für Reviewer einzufärben
    c.settings_lines_color_reviewer = getValue("settings_lines_color_reviewer", "EAD0C3");
    //Settings: Farbe um Zeilen für VIP einzufärben
    c.settings_lines_color_vip = getValue("settings_lines_color_vip", "F0F0A0");
    // Settings: Show Mail Link beside User in "All my VIPs" List in Profile
    c.settings_show_mail_in_allmyvips = getValue("settings_show_mail_in_allmyvips", true);
    // Settings: Show Mail Link beside User in "VIP-List" in Listing
    c.settings_show_mail_in_viplist = getValue("settings_show_mail_in_viplist", true);
    // Settings: Save GClh Config on F2
    c.settings_f2_save_gclh_config = getValue("settings_f2_save_gclh_config", true);
    // Settings: Call GClh Config on F4
    c.settings_f4_call_gclh_config = getValue("settings_f4_call_gclh_config", true);
    // Settings: Anzahl Caches und Anzahl selektierte Caches in Bookmark Listen anzeigen
    c.settings_show_sums_in_bookmark_lists = getValue("settings_show_sums_in_bookmark_lists", true);
    // Settings: Anzahl Caches und Anzahl selektierte Caches in Watchlist anzeigen
    c.settings_show_sums_in_watchlist = getValue("settings_show_sums_in_watchlist", true);
    // Settings: Hide Warning Message
    c.settings_hide_warning_message = getValue("settings_hide_warning_message", true);
    // Settings: Show info message if GClh data are saved
    c.settings_show_save_message = getValue("settings_show_save_message", true);
    // Settings: Show Map Overview
    c.settings_map_overview_build = getValue("settings_map_overview_build", true);
    //Settings: Map zoom value
    c.settings_map_overview_zoom = getValue("settings_map_overview_zoom", 11);
    //Settings: Loggen über Standard "Log It" Icons zu Premium Only Caches für Basic Members
    c.settings_logit_for_basic_in_pmo = getValue("settings_logit_for_basic_in_pmo", false);
    //Settings: Count cache matrix in own statistic
    c.settings_count_own_matrix = getValue("settings_count_own_matrix", true);
    //Settings: Count cache matrix in foreign statistic
    c.settings_count_foreign_matrix = getValue("settings_count_foreign_matrix", true);
    //Settings: Show next cache matrix in own statistic
    c.settings_count_own_matrix_show_next = getValue("settings_count_own_matrix_show_next", true);
    //Settings: Show for next ... matrixes 
    c.settings_count_own_matrix_show_count_next = getValue("settings_count_own_matrix_show_count_next", 2);
    //Settings: Show next cache matrix in color
    c.settings_count_own_matrix_show_color_next = getValue("settings_count_own_matrix_show_color_next", "5151FB");
    //Settings: Generate cache search links with radius ... km 
    c.settings_count_own_matrix_links_radius = getValue("settings_count_own_matrix_links_radius", 25);
    //Settings: Show caches in a map/list
    c.settings_count_own_matrix_links = getValue("settings_count_own_matrix_links", "map");
    //Settings: Hide left sidebar on Google Maps 
    c.settings_hide_left_sidebar_on_google_maps = getValue("settings_hide_left_sidebar_on_google_maps", true);
    //Settings: Add link to GC Map on Google Maps 
    c.settings_add_link_gc_map_on_google_maps = getValue("settings_add_link_gc_map_on_google_maps", true);
    //Settings: Switch to GC Map in same browser tab 
    c.settings_switch_to_gc_map_in_same_tab = getValue("settings_switch_to_gc_map_in_same_tab", false);
    //Settings: Add link to Google Maps on GC Map 
    c.settings_add_link_google_maps_on_gc_map = getValue("settings_add_link_google_maps_on_gc_map", true);
    //Settings: Switch to Google Maps in same browser tab
    c.settings_switch_to_google_maps_in_same_tab = getValue("settings_switch_to_google_maps_in_same_tab", false);
    //Settings: Sort default links for the Linklist    // Sort Linklist
    c.settings_sort_default_bookmarks = getValue("settings_sort_default_bookmarks", true);
//--> $$064FE Begin of insert
    //Settings: Make VIP lists in cache listing hideable.
    c.settings_make_vip_lists_hideable = getValue("settings_make_vip_lists_hideable", true);
//<-- $$064FE End of insert
//--> $$067FE Begin of insert
    // Settings: Show latest logs symbols at the top
    c.settings_show_latest_logs_symbols = getValue("settings_show_latest_logs_symbols", true);
    // Settings: Count of latest logs symbols at the top
    c.settings_show_latest_logs_symbols_count = getValue("settings_show_latest_logs_symbols_count", 5);
//<-- $$067FE End of insert
//--> $$070FE Begin of insert
    // Settings: Set default language
    c.settings_set_default_langu = getValue("settings_set_default_langu", false);
    // Settings: Default language
    c.settings_default_langu = getValue("settings_default_langu", "English");
//<-- $$070FE End of insert
//--> $$#30FE Begin of insert
    // Settings: Hide colored illustration of versions
    c.settings_hide_colored_versions = getValue("settings_hide_colored_versions", false);
//<-- $$#30FE End of insert
    // Settings: Show EventDay
    c.settings_show_eventday = getValue("settings_show_eventday", true);
    c.settings_date_format = getValue("settings_date_format", "MM/dd/yyyy");
    // Settings: Show google-maps Link
    c.settings_show_google_maps = getValue("settings_show_google_maps", true);
    // Settings: Show Log It Icon
    c.settings_show_log_it = getValue("settings_show_log_it", true);
    // Settings: Show Profile-Link on display of Caches found or created by user
    c.settings_show_nearestuser_profil_link = getValue("settings_show_nearestuser_profil_link", true);
    // Settings: Show Homezone
    c.settings_show_homezone = getValue("settings_show_homezone", true);
    c.settings_homezone_radius = getValue("settings_homezone_radius", "10");
    c.settings_homezone_color = getValue("settings_homezone_color", "#0000FF");
    c.settings_homezone_opacity = getValue("settings_homezone_opacity", 10);
    // Settings: Multi Homezone
    c.settings_multi_homezone = JSON.parse(getValue("settings_multi_homezone", "{}"));
    // Settings: Hill Shadow
    c.settings_show_hillshadow = getValue("settings_show_hillshadow", false);
    c.settings_map_layers = getValue("settings_map_layers", "").split("###");
    // Settings: default Map
    c.map_url = "https://www.geocaching.com/map/default.aspx";
    // Settings: default Log Type
    c.settings_default_logtype = getValue("settings_default_logtype", "-1");
    c.settings_default_logtype_event = getValue("settings_default_logtype_event", c.settings_default_logtype);
    c.settings_default_logtype_owner = getValue("settings_default_logtype_owner", c.settings_default_logtype);
    // Settings: default TB-Log Type
    c.settings_default_tb_logtype = getValue("settings_default_tb_logtype", "-1");
    // Settings: Bookmarklist
    c.settings_bookmarks_list = JSON.parse(getValue("settings_bookmarks_list", JSON.stringify(c.bookmarks_def)).replace(/, (?=,)/g, ",null"));
    if (c.settings_bookmarks_list.length == 0) {
        c.settings_bookmarks_list = c.bookmarks_def;
    }
    // Settings: Sync
    c.settings_sync_last = new Date(getValue("settings_sync_last", "Thu Jan 01 1970 01:00:00 GMT+0100 (Mitteleuropäische Zeit)"));
    c.settings_sync_hash = getValue("settings_sync_hash", "");
    c.settings_sync_time = getValue("settings_sync_time", 36000000);  // 10 Stunden
    c.settings_sync_autoImport = getValue("settings_sync_autoImport", false);

    // Settinks: Dynamic Map
    c.settings_hide_advert_link = getValue('settings_hide_advert_link', true);
    c.settings_hide_spoilerwarning = getValue('settings_hide_spoilerwarning', true);
    c.settings_hide_hint = getValue('settings_hide_hint', true);
    c.settings_strike_archived = getValue('settings_strike_archived', true);
    c.settings_highlight_usercoords = getValue('settings_highlight_usercoords', true);
//--> $$#14FE Begin of insert
    c.settings_highlight_usercoords_bb = getValue('settings_highlight_usercoords_bb', false);
    c.settings_highlight_usercoords_it = getValue('settings_highlight_usercoords_it', false);
//<-- $$#14FE End of insert
    c.settings_map_hide_found = getValue('settings_map_hide_found', false);
    c.settings_map_hide_hidden = getValue('settings_map_hide_hidden', false);
    c.settings_map_hide_2 = getValue('settings_map_hide_2', false);
    c.settings_map_hide_9 = getValue('settings_map_hide_9', false);
    c.settings_map_hide_5 = getValue('settings_map_hide_5', false);
    c.settings_map_hide_3 = getValue('settings_map_hide_3', false);
    c.settings_map_hide_6 = getValue('settings_map_hide_6', false);
    c.settings_map_hide_453 = getValue('settings_map_hide_453', false);
    c.settings_map_hide_7005 = getValue('settings_map_hide_7005', false);
    c.settings_map_hide_13 = getValue('settings_map_hide_13', false);
    c.settings_map_hide_1304 = getValue('settings_map_hide_1304', false);
    c.settings_map_hide_4 = getValue('settings_map_hide_4', false);
    c.settings_map_hide_11 = getValue('settings_map_hide_11', false);
    c.settings_map_hide_137 = getValue('settings_map_hide_137', false);
    c.settings_map_hide_8 = getValue('settings_map_hide_8', false);
    c.settings_map_hide_1858 = getValue('settings_map_hide_1858', false);
    c.settings_show_fav_percentage = getValue('settings_show_fav_percentage', false);
    c.settings_show_vip_list = getValue('settings_show_vip_list', true);
    c.settings_show_owner_vip_list = getValue('settings_show_owner_vip_list', true);
    c.settings_autovisit = getValue("settings_autovisit", "true");
    c.settings_show_thumbnails = getValue("settings_show_thumbnails", true);
    c.settings_imgcaption_on_top = getValue("settings_imgcaption_on_top", false);
    c.settings_hide_avatar = getValue("settings_hide_avatar", false);
    c.settings_show_big_gallery = getValue("settings_show_big_gallery", false);
    c.settings_automatic_friend_reset = getValue("settings_automatic_friend_reset", true);
    c.settings_show_long_vip = getValue("settings_show_long_vip", false);
    c.settings_load_logs_with_gclh = getValue("settings_load_logs_with_gclh", true);
    c.settings_map_add_layer = getValue("settings_map_add_layer", true);
    c.settings_map_default_layer = getValue("settings_map_default_layer", "OpenStreetMap Default");
    c.settings_hide_map_header = getValue("settings_hide_map_header", false);
    c.settings_replace_log_by_last_log = getValue("settings_replace_log_by_last_log", false);
    c.settings_hide_top_button = getValue("settings_hide_top_button", false);
    c.settings_show_real_owner = getValue("settings_show_real_owner", false);
    c.settings_hide_visits_in_profile = getValue("settings_hide_visits_in_profile", false);
    c.settings_log_signature_on_fieldnotes = getValue("settings_log_signature_on_fieldnotes", true);
    c.settings_map_hide_sidebar = getValue("settings_map_hide_sidebar", false);
    c.settings_hover_image_max_size = getValue("settings_hover_image_max_size", 600);
    c.settings_vip_show_nofound = getValue("settings_vip_show_nofound", false);
    c.settings_use_gclh_layercontrol = getValue("settings_use_gclh_layercontrol", true);
    c.settings_fixed_pq_header = getValue("settings_fixed_pq_header", false);

    // Settings: Custom Bookmarks
    var num = c.bookmarks.length;
    for (var i = 0; i < c.anzCustom; i++) {
        c.bookmarks[num] = Object();

        if (getValue("settings_custom_bookmark[" + i + "]", "") != "") {
            c.bookmarks[num]['href'] = getValue("settings_custom_bookmark[" + i + "]");
        } else {
            c.bookmarks[num]['href'] = "#";
        }

        if (getValue("settings_bookmarks_title[" + num + "]", "") != "") {
            c.bookmarks[num]['title'] = getValue("settings_bookmarks_title[" + num + "]");
        } else {
            c.bookmarks[num]['title'] = "Custom" + i;
            setValue("settings_bookmarks_title[" + num + "]", bookmarks[num]['title']);
        }

        if (getValue("settings_custom_bookmark_target[" + i + "]", "") != "") {
            c.bookmarks[num]['target'] = getValue("settings_custom_bookmark_target[" + i + "]");
            c.bookmarks[num]['rel'] = "external";
        } else {
            c.bookmarks[num]['target'] = "";
        }

        c.bookmarks[num]['custom'] = true;
        num++;
    }

    // Some more Bookmarks ..
//--> $$062FE Begin of change
//    profileBookmark("Public Profile Souvenirs", "lnk_profilesouvenirs", c.bookmarks);
    profileSpecialBookmark("Public Profile Souvenirs", "https://www.geocaching.com/profile/default.aspx?#gclhpb#ctl00$ContentBody$ProfilePanel1$lnkSouvenirs", "lnk_profilesouvenirs", c.bookmarks);
//<-- $$062FE End of change
    bookmark("Statistics", "https://www.geocaching.com/my/statistics.aspx", c.bookmarks);
    bookmark("Field Notes", "https://www.geocaching.com/my/fieldnotes.aspx", c.bookmarks);
//--> $$062FE Begin of change
//    profileBookmark("Public Profile Statistics", "lnk_profilestatistics", c.bookmarks);
    profileSpecialBookmark("Public Profile Statistics", "https://www.geocaching.com/profile/default.aspx?#gclhpb#ctl00$ContentBody$ProfilePanel1$lnkStatistics", "lnk_profilestatistics", c.bookmarks);
//<-- $$062FE End of change
    bookmark("Geocaches RecViewed", "https://www.geocaching.com/my/recentlyviewedcaches.aspx", c.bookmarks);
    bookmark("Search TB", "https://www.geocaching.com/track/travelbug.aspx", c.bookmarks);
    bookmark("Search Geocoin", "https://www.geocaching.com/track/geocoin.aspx", c.bookmarks);
    externalBookmark("Geocaches Labs", "https://labs.geocaching.com/", c.bookmarks);
    bookmark("Search GC", "https://www.geocaching.com/play/search/", c.bookmarks);
    bookmark("Geocache Hide", "https://www.geocaching.com/play/hide/", c.bookmarks);
    bookmark("Message Center", "https://www.geocaching.com/account/messagecenter", c.bookmarks);
    bookmark("Search GC (old)", "https://www.geocaching.com/seek/", c.bookmarks);
    bookmark("Glossary of Terms", "https://www.geocaching.com/about/glossary.aspx", c.bookmarks);
    bookmark("Event Calendar", "https://www.geocaching.com/calendar/", c.bookmarks);
    bookmark("Geocache Adoption", "https://www.geocaching.com/adopt/", c.bookmarks);
    externalBookmark("Flopps Karte", "http://flopp-caching.de/", c.bookmarks);
    externalBookmark("Geokrety", "http://geokrety.org/", c.bookmarks);
    externalBookmark("Project Geocaching", "http://project-gc.com/", c.bookmarks);
    bookmark("Search TB adv.", "https://www.geocaching.com/track/search.aspx", c.bookmarks);
    bookmark("View Geocache Map", "https://www.geocaching.com/map/", c.bookmarks);
//--> $$066FE Begin of insert
    profileSpecialBookmark(scriptShortNameSync, defaultSyncLink, "lnk_gclhsync", c.bookmarks);
//<-- $$066FE End of insert

    // Settings: Custom Bookmark-title
    c.bookmarks_orig_title = new Array();
    for (var i = 0; i < c.bookmarks.length; i++) {
        if (getValue("settings_bookmarks_title[" + i + "]", "") != "") {
            c.bookmarks_orig_title[i] = c.bookmarks[i]['title']; // Needed for configuration
            c.bookmarks[i]['title'] = getValue("settings_bookmarks_title[" + i + "]");
        }
    }

    try {
        if (c.userToken === null) {
            //Get Userdata from site context and add them to the extension context
            c.userData = $('#aspnetForm script:not([src])').filter(function () {
                return this.innerHTML.indexOf("ccConversions") != -1;
            }).html();

            if (c.userData !== null) {
                if (typeof c.userData !== "undefined") {
                    c.userData = c.userData.replace('{ID: ', '{"ID": ');

                    var regex = /([a-zA-Z0-9öÖäÄüÜß]+)([ ]?=[ ]?)(((({.+})(;)))|(((\[.+\])(;)))|(((".+")(;)))|((('.+')(;)))|(([^'"{\[].+)(;)))/g;

                    var match;
                    while (match = regex.exec(userData)) {
                        if (match[1] == "eventCacheData") continue;   // Workaround fuer event-Listings (da ist ne Funktion in dem Script-Element)
                        var data = (match[6] || match[10] || match[14] || match[18] || match[21]).trim();

                        if (data.charAt(0) == '"' || data.charAt(0) == "'") {
                            data = data.slice(1, data.length - 1);
                        }

                        data = data.trim();

                        if (data.charAt(0) == '{' || data.charAt(0) == '[') {
                            data = JSON.parse(data);
                        }

                        if (typeof c.chromeUserData === "undefined") {
                            c.chromeUserData = {};
                        }

                        c.chromeUserData[match[1].replace('"', '').replace("'", "").trim()] = data;
                    }

                    if (c.chromeUserData["userInfo"]) {
                        c.userInfo = chromeUserData["userInfo"];
                    }
                    if (c.chromeUserData["isLoggedIn"]) {
                        c.isLoggedIn = chromeUserData["isLoggedIn"];
                    }
                    if (c.chromeUserData["userDefinedCoords"]) {
                        c.userDefinedCoords = c.chromeUserData["userDefinedCoords"];
                    }
                    if (c.chromeUserData["userToken"]) {
                        c.userToken = c.chromeUserData["userToken"];
                    }
                }
            }
        }
    } catch (e) {
        gclh_error("Error parsing userdata from page.", e);
    }

    variablesInitDeref.resolve();
    return variablesInitDeref.promise();
};

var start = function (c) {
    quitOnAdFrames()
        .then(function () {
            return jqueryInit(c);
        })
        .then(function () {
            return browserInit(c);
        })
        .then(function () {
            return constInit(c);
        })
        .then(function () {
            return variablesInit(c);
        })
        .done(function () {
            if (document.location.href.match(/^(http|https):\/\/maps\.google\./) || document.location.href.match(/^(http|https):\/\/www\.google\.[a-zA-Z.]*\/maps/)) {
                mainGMaps();
            }
            else {
                mainGC();
            }
        });
};

// Improve Google Maps page. 
var mainGMaps = function () {
    try {
        // Add link to GC Map on Google Maps page.
        if ( settings_add_link_gc_map_on_google_maps ) {
            function addGcButton( waitCount ) {
                if ( document.getElementById("gbsfw") ) {
                    var code = "";
                    code += "    function openGcMap(){";
                    code += "        var matches = document.location.href.match(/@(-?[0-9.]*),(-?[0-9.]*),([0-9.]*)z/);";
                    code += "        if (matches != null) {";
                    code += "            var zoom = matches[3];";
                    code += "        } else {";
                    // Bei Earth gibt es kein z für Zoom sondern ein m für Meter. Meter in Zoom umrechnen. 
                    code += "            var matches = document.location.href.match(/@(-?[0-9.]*),(-?[0-9.]*),([0-9.]*)m/);";
                    code += "            if (matches != null) {";
                    code += "                var zoom = 26 - Math.round( Math.log2( matches[3] ) );";
                    code += "            }";
                    code += "        }";
                    code += "        if (matches != null) {";
                    code += "            var matchesMarker = document.location.href.match(/!3d(-?[0-9.]*)!4d(-?[0-9.]*)/);";
                    code += "            if (matchesMarker != null) {";
                    code += "                var url = '" + map_url + "?lat=' + matchesMarker[1] + '&lng=' + matchesMarker[2] + '#?ll=' + matches[1] + ',' + matches[2] + '&z=' + zoom;";
                    code += "            } else {";
                    code += "                var url = '" + map_url + "?lat=' + matches[1] + '&lng=' + matches[2] + '&z=' + zoom;";
                    code += "            }";
                    if ( settings_switch_to_gc_map_in_same_tab ) {
                        code += "        location = url;"; 
                    } else {
                        code += "        window.open( url );"; 
                    }
                    code += "        } else {";
                    code += "            alert('This map has no geographical coordinates in its link. Just zoom or drag the map, afterwards this will work fine.');";
                    code += "        }";
                    code += "    }";
                    var script = document.createElement("script");
                    script.innerHTML = code;
    
                    var div = document.createElement("div");
                    div.setAttribute("style", "display: inline-block; vertical-align: middle;");
                    var aTag = document.createElement("a");
                    aTag.setAttribute("onClick", "openGcMap();");
                    aTag.setAttribute("title", "Geocaching Map");
                    var url = "url('" + http + "://www.geocaching.com/images/about/logos/geocaching/Logo_Geocaching_color_notext_32.png')";
                    aTag.setAttribute("style", "display: inline-block; vertical-align: middle; height: 32px; width: 32px; background-image: " + url + ";");
                    var side = document.getElementById("gbsfw").parentNode;

                    div.appendChild(script);
                    div.appendChild(aTag);
                    side.parentNode.insertBefore(div, side);
                } else {
                    waitCount++;
                    if ( waitCount <= 50 ) {  // 10 Sekunden lang
                        setTimeout( function () { addGcButton( waitCount ) }, 200); 
                    } else return;
                }
            }
            addGcButton( 0 );
        }
        
        // Hide left sidebar on Google Maps.
        if ( settings_hide_left_sidebar_on_google_maps ) {
            function hideLeftSidebar( waitCount ) {
                if ( document.getElementById("gbsfw") &&  // Nur weil das hier eines der letzten Teile ist, die aufgebaut werden.
                     document.getElementsByClassName("widget-pane-toggle-button")[0] && 
                     document.getElementsByClassName("widget-pane")[0]                  ) {
                    if ( !document.getElementsByClassName("widget-pane")[0].className.match("widget-pane-collapsed") ) { 
                        document.getElementsByClassName("widget-pane-toggle-button")[0].click();
                    }
                } else {
                    waitCount++;
                    if ( waitCount <= 15 ) {  // 15 Sekunden lang (10 Sekunden hatten bei den Earth Tests nicht immer ausgereicht).
                        setTimeout( function () { hideLeftSidebar( waitCount ) }, 1000); 
                    } else return;
                }
            }
            hideLeftSidebar( 0 );
        }
    } catch (e) {
        gclh_error("mainGMaps", e);
    }
};

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
// Helper
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
var mainGC = function () {
//--> $$062FE Begin of delete
//// Run after Redirect
//    if (getValue("doPostBack_after_redirect") != "") {
//        try {
//            var postbackValue = getValue("doPostBack_after_redirect", "");
//            if (typeof(unsafeWindow.__doPostBack) == "function") {
//                if ( document.location.href.match(/^https?:\/\/www\.geocaching\.com\/profile/) ) {
//                    $('html').css("background-color", "white");
//                    $('#ProfileTabs').remove();
//                    $('footer').remove();
//                }
//                unsafeWindow.__doPostBack(postbackValue, "");
//            }
//        } catch (e) {
//            gclh_error("Run after Redirect", e);
//        }
//        setValue("doPostBack_after_redirect", "");
//    }
//<-- $$062FE End of delete 

//--> $$062FE Begin of insert
// Run after Redirect
    try {
        if (typeof(unsafeWindow.__doPostBack) == "function") {
            var splitter = document.location.href.split("#");
            if ( splitter && splitter[1] && splitter[1] == "gclhpb" && splitter[2] && splitter[2] != "" ) {
                var postbackValue = splitter[2];
                // Home Coords in GClh übernehmen.
                if ( postbackValue == "errhomecoord" ) {
                    var mess = "To use this link, GClh has to know your home coordinates. \n"
                             + "Do you want to go to the special area and let GClh save \n"
                             + "your home coordinates automatically?\n\n"
                             + "(You have then nothing to do at the following page.)\n"
                             + "(Go ahead with your work.)";
                    if ( window.confirm(mess) ) {
                        document.location.href = http + "://www.geocaching.com/account/settings/homelocation";
                    } else {
                        document.location.href = document.location.href.replace("?#"+splitter[1]+"#"+splitter[2]+"#", "");
                    }
                // uid, own trackables in GClh übernehmen.
                } else if ( postbackValue == "errowntrackables" ) {
                    var mess = "To use this link, GClh has to know the identification of \n"
                             + "your trackables. Do you want to go to your profile and \n"
                             + "let GClh save the identification (uid) automatically?\n\n"
                             + "(You have then nothing to do at the following page.)\n"
                             + "(Go ahead with your work.)";
                    if ( window.confirm(mess) ) {
                        document.location.href = http + "://www.geocaching.com/my/default.aspx";
                    } else {
                        document.location.href = document.location.href.replace("?#"+splitter[1]+"#"+splitter[2], "");
                    }
                // Postbacks.
                } else {
                    if ( document.location.href.match(/^https?:\/\/www\.geocaching\.com\/profile/) ) {
                        $('html').css("background-color", "white");
                        $('#divContentSide').css("height", "1000px");
                        $('#ProfileTabs').remove();
                        $('footer').remove();
                    }
                    document.location.href = "";
                    unsafeWindow.__doPostBack(postbackValue, ""); 
                }
            }
        }
    } catch (e) {
        gclh_error("Run after Redirect", e);
    }
//<-- $$062FE End of insert
    
//--> $$070FE Begin of insert
// Set language to default language.
    try {
        if ( settings_set_default_langu ) {
            var languLine = $('.language-list > li > a:contains(' + settings_default_langu + ')');
            if ( !languLine[0] ) {
                var languLine = $('.dropdown-menu > li > a:contains(' + settings_default_langu + ')');
            }
            if ( languLine[0] ) {
                if ( languLine[0].className == "selected" || languLine[0].parentNode.className == "selected" );
                else {
                    var event  = document.createEvent("MouseEvent");
                    event.initEvent("click", true, true);
                    languLine[0].dispatchEvent(event);
                }
            }
        }
    } catch (e) {
        gclh_error("set language to default language", e);
    }
//<-- $$070FE End of insert
    
    function getElementsByClass(classname) {
        var result = new Array();
        var all_elements = document.getElementsByTagName("*");

        for (var i = 0; i < all_elements.length; i++) {
            if (all_elements[i].className == classname) {
                result.push(all_elements[i]);
            }
        }

        return result;
    }

    function in_array(search, arr) {
        for (var i = 0; i < arr.length; i++) if (arr[i] == search) return true;
        return false;
    }

    function caseInsensitiveSort(a, b) {  // http://www.codingforums.com/showthread.php?t=10477
        var ret = 0;
        a = a.toLowerCase();
        b = b.toLowerCase();
        if (a > b)
            ret = 1;
        if (a < b)
            ret = -1;
        return ret;
    }

    function urlencode(s) {
        s = s.replace(/&amp;/g, "&");
        s = encodeURIComponent(s);  //Kodiert alle außer den folgenden Zeichen: A bis Z und a bis z und - _ . ! ~ * ' ( )
        s = s.replace(/~/g, "%7e");
        s = s.replace(/'/g, "%27");
        s = s.replace(/%26amp%3b/g, "%26");
        s = s.replace(/ /g, "+");
        //GC.com codiert - _ . ! * ( ) selbst nicht, daher wird dies hier auch nicht extra behandel
        return s;
    }

    function urldecode(s) {
        s = s.replace(/\+/g, " ");
        s = s.replace(/%7e/g, "~");
        s = s.replace(/%27/g, "'");
        s = decodeURIComponent(s);
        return s;
    }

    function html_to_str(s) {
        s = s.replace(/\&amp;/g, "&");
        s = s.replace(/\&nbsp;/g, " ");
        return s;
    }

    function trim(s) {
        var whitespace = ' \n ';
        for (var i = 0; i < whitespace.length; i++) {
            while (s.substring(0, 1) == whitespace.charAt(i)) {
                s = s.substring(1, s.length);
            }
            while (s.substring(s.length - 1, s.length) == whitespace.charAt(i)) {
                s = s.substring(0, s.length - 1);
            }
        }

        if (s.substring(s.length - 6, s.length) == "&nbsp;") s = s.substring(0, s.length - 6);

        return s;
    }

// Helper: from N/S/E/W Deg Min.Sec to Dec
    function toDec(coords) {
        var match = coords.match(/([0-9]+)°([0-9]+)\.([0-9]+)′(N|S), ([0-9]+)°([0-9]+)\.([0-9]+)′(W|E)/);

        if (match) {
            var dec1 = parseInt(match[1], 10) + (parseFloat(match[2] + "." + match[3]) / 60);
            if (match[4] == "S") dec1 = dec1 * -1;
            dec1 = Math.round(dec1 * 10000000) / 10000000;

            var dec2 = parseInt(match[5], 10) + (parseFloat(match[6] + "." + match[7]) / 60);
            if (match[8] == "W") dec2 = dec2 * -1;
            dec2 = Math.round(dec2 * 10000000) / 10000000;

            return new Array(dec1, dec2);
        }
        else {
            match = coords.match(/(N|S) ([0-9]+)°? ([0-9]+)\.([0-9]+) (E|W) ([0-9]+)°? ([0-9]+)\.([0-9]+)/);

            if (match) {
                var dec1 = parseInt(match[2], 10) + (parseFloat(match[3] + "." + match[4]) / 60);
                if (match[1] == "S") dec1 = dec1 * -1;
                dec1 = Math.round(dec1 * 10000000) / 10000000;

                var dec2 = parseInt(match[6], 10) + (parseFloat(match[7] + "." + match[8]) / 60);
                if (match[5] == "W") dec2 = dec2 * -1;
                dec2 = Math.round(dec2 * 10000000) / 10000000;

                return new Array(dec1, dec2);
            }
            else {
                match = coords.match(/(N|S) ([0-9]+) ([0-9]+) ([0-9]+)\.([0-9]+) (E|W) ([0-9]+) ([0-9]+) ([0-9]+)\.([0-9]+)/);

                if (match) {
                    var dec1 = parseInt(match[2], 10) + (parseFloat(match[3]) / 60) + (parseFloat(match[4] + "." + match[5]) / 3600);
                    if (match[1] == "S") dec1 = dec1 * -1;
                    dec1 = Math.round(dec1 * 10000000) / 10000000;

                    var dec2 = parseInt(match[7], 10) + (parseFloat(match[8]) / 60) + (parseFloat(match[9] + "." + match[10]) / 3600);
                    if (match[6] == "W") dec2 = dec2 * -1;
                    dec2 = Math.round(dec2 * 10000000) / 10000000;

                    return new Array(dec1, dec2);
                }
                else {
                    match = coords.match(/(N|S) ([0-9]+) ([0-9]+) ([0-9]+\..[0-9].) (E|W) ([0-9]+) ([0-9]+) ([0-9]+\..[0-9].)/);

                    if (match) {
                        var dec1 = parseInt(match[2], 10) + (parseFloat(match[3]) / 60) + (parseFloat(match[4]) / 3600);
                        if (match[1] == "S") dec1 = dec1 * -1;
                        dec1 = Math.round(dec1 * 10000000) / 10000000;

                        var dec2 = parseInt(match[6], 10) + (parseFloat(match[7]) / 60) + (parseFloat(match[8]) / 3600);
                        if (match[5] == "W") dec2 = dec2 * -1;
                        dec2 = Math.round(dec2 * 10000000) / 10000000;

                        return new Array(dec1, dec2);
                    } else {
                        return false;
                    }
                }
            }
        }
    }

// Helper: from Deg to DMS
    function DegtoDMS(coords) {
        var match = coords.match(/^(N|S) ([0-9][0-9]). ([0-9][0-9])\.([0-9][0-9][0-9]) (E|W) ([0-9][0-9][0-9]). ([0-9][0-9])\.([0-9][0-9][0-9])$/);
        if (!match) return "";

        var lat1 = parseInt(match[2], 10);
        var lat2 = parseInt(match[3], 10);
        var lat3 = parseFloat("0." + match[4]) * 60;
        lat3 = Math.round(lat3 * 10000) / 10000;

        var lng1 = parseInt(match[6], 10);
        var lng2 = parseInt(match[7], 10);
        var lng3 = parseFloat("0." + match[8]) * 60;
        lng3 = Math.round(lng3 * 10000) / 10000;

        return match[1] + " " + lat1 + "° " + lat2 + "' " + lat3 + "\" " + match[5] + " " + lng1 + "° " + lng2 + "' " + lng3 + "\"";
    }

// Helper: from Dec to Deg
    function DectoDeg(lat, lng) {
        lat = lat / 10000000;
        var pre = "";
        if (lat > 0) pre = "N";
        else {
            pre = "S";
            lat = lat * -1;
        }
        var tmp1 = parseInt(lat);
        var tmp2 = (lat - tmp1) * 60;
        tmp1 = String(tmp1);
        if (tmp1.length == 1) tmp1 = "0" + tmp1;
        tmp2 = Math.round(tmp2 * 10000) / 10000;
        tmp2 = String(tmp2);
        if (tmp2.length == 0) tmp2 = tmp2 + "0.000";
        else if (tmp2.length == 1) tmp2 = tmp2 + ".000";
        else if (tmp2.length == 2) tmp2 = tmp2 + ".000";
        else if (tmp2.length == 3) tmp2 = tmp2 + "000";
        else if (tmp2.length == 4) tmp2 = tmp2 + "00";
        else if (tmp2.length == 5) tmp2 = tmp2 + "0";
        var new_lat = pre + " " + tmp1 + "° " + tmp2;

        lng = lng / 10000000;
        var pre = "";
        if (lng > 0) pre = "E";
        else {
            pre = "W";
            lng = lng * -1;
        }
        var tmp1 = parseInt(lng);
        var tmp2 = (lng - tmp1) * 60;
        tmp1 = String(tmp1);
        if (tmp1.length == 2) tmp1 = "0" + tmp1;
        else if (tmp1.length == 1) tmp1 = "00" + tmp1;
        tmp2 = Math.round(tmp2 * 10000) / 10000;
        tmp2 = String(tmp2);
        if (tmp2.length == 0) tmp2 = tmp2 + "0.000";
        else if (tmp2.length == 1) tmp2 = tmp2 + ".000";
        else if (tmp2.length == 2) tmp2 = tmp2 + ".000";
        else if (tmp2.length == 3) tmp2 = tmp2 + "000";
        else if (tmp2.length == 4) tmp2 = tmp2 + "00";
        else if (tmp2.length == 5) tmp2 = tmp2 + "0";
        var new_lng = pre + " " + tmp1 + "° " + tmp2;

        return new_lat + " " + new_lng;
    }

//--> $$062FE Begin of delete
//// check whether the user has set his home coordinates
//    function homeCoordinatesSet() {
//        if (getValue("home_lat", 0) == 0 || getValue("home_lng") == 0) {
//            if (window.confirm("To use this link, you have to set your home coordinates.")) {
//                document.location.href = https + "://www.geocaching.com/account/ManageLocations.aspx";
//            }
//            return false;
//        }
//        return true;
//    }
//<-- $$062FE End of delete 

//--> $$062FE Begin of delete
//// Events für spezielle Links der Linklist aufbauen. Beispiel: Links zu den Tabs des Öffentlichen Profiles. 
//    function addLinkEvent(name, fkt, stopOldContextmenu, buildNewContextmenu) {
//        if (document.getElementsByName(name).length > 0) {
//            var links = document.getElementsByName(name);
//            for (var i = 0; i < links.length; i++) {
//                // Click Event aufbauen.
//                links[i].addEventListener('click', function(event){fkt(event)}, false);
//                // Contextmenu (rechte Maustaste) für den Link übergehen, weil eine Auswahl nicht funktioniert. Contextmenu sperren. 
//                if ( stopOldContextmenu == true ) links[i].oncontextmenu = function(){return false;};
//                // Neues "Contextmenu" als direkten Link in neuem Tab aufbauen. 
//                if ( buildNewContextmenu == true && links[i].id ) $('#'+links[i].id).bind('contextmenu.new', function(event){fkt(event)});
//            }
//        }
//    }
//<-- $$062FE End of delete 

// Close the Overlays, Find Player and GClh-Configuration
    function btnClose( clearUrl ) {
        if (document.getElementById('bg_shadow')) document.getElementById('bg_shadow').style.display = "none";
        if (document.getElementById('settings_overlay')) document.getElementById('settings_overlay').style.display = "none";
        if (document.getElementById('sync_settings_overlay')) document.getElementById('sync_settings_overlay').style.display = "none";
        if (document.getElementById('findplayer_overlay')) document.getElementById('findplayer_overlay').style.display = "none";
        if ( clearUrl != false ) {
            document.location.href = clearUrlAppendix( document.location.href, false );
        }
    }

// Function to get the Finds out of the login-Text-Box
    function get_my_finds() {
        var finds = "";
        if ($('.li-user-info').children().length >= 2) {
            if ( $('.li-user-info').children().next().text() ) {
                finds = parseInt($('.li-user-info').children().next().text().match(/[0-9,\.]+/)[0].replace(/[,\.]/,""));
            }
        }
        return finds;
    }

// Sucht den Original Usernamen des Owners aus dem Listing
    function get_real_owner() {
        if (document.getElementById("ctl00_ContentBody_bottomSection")) {
            var links = document.getElementById("ctl00_ContentBody_bottomSection").getElementsByTagName("a");
            for (var i = 0; i < links.length; i++) {
                var match = links[i].href.match(/\/seek\/nearest\.aspx\?u\=(.*)$/);
                if (match) {
                    return urldecode(match[1]);
                }
            }
            return false;
        } else return false;
    }

// Versteckt den Header in der Map-Ansicht
    function hide_map_header() {
        var header = document.getElementsByTagName("header");
        if (header[0].style.display != "none") {  // Header verstecken
            header[0].style.display = "none";
            document.getElementById("Content").style.top = 0;
        } else { // Header zeigen
            header[0].style.display = "block";
            document.getElementById("Content").style.top = "63px";
        }
    }

// Last Log-Text speichern fuer TB-Log-Template
    try {
        if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/log\.aspx/) && document.getElementById("ctl00_ContentBody_LogBookPanel1_btnSubmitLog")) {
            function send_log(e) {
                setValue("last_logtext", document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').value);
            }

            document.getElementById("ctl00_ContentBody_LogBookPanel1_btnSubmitLog").addEventListener('click', send_log, true);
        }
    } catch (e) {
        gclh_error("Last-Log-Text speichern", e);
    }

// F2 zum Log abschicken
    try {
        if (settings_submit_log_button && (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/log\.aspx\?(id|guid|ID|wp|LUID|PLogGuid)\=/) || document.location.href.match(/^https?:\/\/www\.geocaching\.com\/track\/log\.aspx\?(id|wid|guid|ID|PLogGuid)\=/)) && document.getElementById("ctl00_ContentBody_LogBookPanel1_btnSubmitLog")) {
            var but = document.getElementById("ctl00_ContentBody_LogBookPanel1_btnSubmitLog");
            but.value = document.getElementById("ctl00_ContentBody_LogBookPanel1_btnSubmitLog").value + " (F2)";
            function keydown(e) {
                if (e.keyCode == 113) {
                    if ( !check_config_page() ) {
                        document.getElementById("ctl00_ContentBody_LogBookPanel1_btnSubmitLog").click();
                    }
                }
            }

            window.addEventListener('keydown', keydown, true);
        }
    } catch (e) {
        gclh_error("F2 logging", e);
    }

// F2 zum PQ speichern
    try {
        if (settings_submit_log_button && (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/pocket\/gcquery\.aspx/)) && document.getElementById("ctl00_ContentBody_btnSubmit")) {
            var but = document.getElementById("ctl00_ContentBody_btnSubmit");
            but.value = document.getElementById("ctl00_ContentBody_btnSubmit").value + " (F2)";
            function keydown(e) {
                if (e.keyCode == 113) {
                    if ( !check_config_page() ) {
                        document.getElementById("ctl00_ContentBody_btnSubmit").click();
                    }
                }
            }

            window.addEventListener('keydown', keydown, true);
        }
    } catch (e) {
        gclh_error("F2 save PQ", e);
    }

// F2 Bookmark speichern
    try {
        // "Create a Bookmark" und "Edit a Bookmark".
        if ( settings_submit_log_button ) {
            // "Create a Bookmark" entry und "Edit a Bookmark" entry.
            if ( document.location.href.match(/^https?:\/\/www\.geocaching\.com\/bookmarks\/mark\.aspx/) && 
                 document.getElementById("ctl00_ContentBody_Bookmark_btnCreate")                            ) {
                var but = document.getElementById("ctl00_ContentBody_Bookmark_btnCreate");
                but.value = document.getElementById("ctl00_ContentBody_Bookmark_btnCreate").value + " (F2)";
                function keydown_bm(e) {
                    if (e.keyCode == 113) {
                        if ( !check_config_page() ) {
                            document.getElementById("ctl00_ContentBody_Bookmark_btnCreate").click();
                        }
                    }
                }
                window.addEventListener('keydown', keydown_bm, true);
            }
            // "Bookmark Pocket Query", also aus einer Bookmark eine PQ erzeugen.
            if ( document.location.href.match(/^https?:\/\/www\.geocaching\.com\/pocket\/bmquery\.aspx/) && 
                 document.getElementById("ctl00_ContentBody_btnSubmit")                            ) {
                var but = document.getElementById("ctl00_ContentBody_btnSubmit");
                but.value = document.getElementById("ctl00_ContentBody_btnSubmit").value + " (F2)";
                function keydown_pq(e) {
                    if (e.keyCode == 113) {
                        if ( !check_config_page() ) {
                            document.getElementById("ctl00_ContentBody_btnSubmit").click();
                        }
                    }
                }
                window.addEventListener('keydown', keydown_pq, true);
            }
        }
    } catch (e) {
        gclh_error("F2 save Bookmark", e);
    }

// Aufruf GClh Config per F4 Taste. Nur auf den erlaubten Seiten und auch nur, wenn man nicht schon im GClh Config ist.
    try {
        function keydown(e) {
            if (e.keyCode == 115) {
                if ( !check_config_page() ) {
//--> $$061FE Begin of change
//                    if ( checkTaskAllowed( "GClh Config", true ) == true ) {
//                        gclh_showConfig();
//                    }
                    if ( checkTaskAllowed( "GClh Config", false ) == true ) gclh_showConfig();
                    else document.location.href = defaultConfigLink;
//<-- $$061FE End of change
                }
            }
        }
        if ( settings_f4_call_gclh_config ) {
            if ( !check_config_page() ) {
//--> $$061FE Begin of change
//                if ( checkTaskAllowed( "GClh Config", false ) == true ) {
//                    window.addEventListener('keydown', keydown, true);
//                }
                window.addEventListener('keydown', keydown, true);
//<-- $$061FE End of change
            }
        }
    } catch (e) {
        gclh_error("F4 call GClh Config", e);
    }

// Change Header layout (Umbau)
    change_header_layout:
    try {
        if (settings_change_header_layout) {
            if ( isMemberInPmoCache() ) {
                if ( document.getElementById("ctl00_siteHeader") ) { document.getElementById("ctl00_siteHeader").remove(); }
                break change_header_layout;
            }

            // Alle Seiten: Grundeinstellungen:
            // ----------
            var head = document.getElementsByTagName('head')[0];
            var style = document.createElement('style');
            var style_tmp = document.createElement('style');
            style.type = 'text/css';

            // Font-Size für Menüs bzw. Font-Size für Untermenüs in Pixel.
            var font_size_menu = parseInt(settings_font_size_menu);
            if ( (font_size_menu == 0) || (font_size_menu < 0) || (font_size_menu > 16) ) font_size_menu = 15;
            var font_size_submenu = parseInt(settings_font_size_submenu);
            if ( (font_size_submenu == 0) || (font_size_submenu < 0) || (font_size_submenu > 16) ) font_size_submenu = 13;

            // Abstand zwischen Menüs bzw. Abstand zwischen Untermenüs in Pixel.
            var distance_menu = parseInt(settings_distance_menu);
            if ( (distance_menu < 0) || (distance_menu > 99) ) distance_menu = ( 50 / 2 );
            else distance_menu = ( distance_menu / 2 );
            if ( settings_bookmarks_top_menu == false && settings_menu_show_separator == true ) distance_menu = ( distance_menu / 2 );
            var distance_submenu = parseInt(settings_distance_submenu);
            if ( (distance_submenu < 0) || (distance_submenu > 32) ) distance_submenu = ( 8 );      // ( 8 / 2 )
            else distance_submenu = ( distance_submenu );                                           // ( ... / 2 )

            // Font-Color in Menüs und Untermenüs.
            var font_color = settings_font_color_menu_submenu;
            if ( font_color == "" ) { font_color = "93B516" }; 

            // Menüweite berechnen.
            var new_width = 950;
            var new_width_menu = 950;
            var new_width_menu_cut_old = 0;
            var new_padding_right = 0;
            if ( getValue("settings_new_width") > 0) {
                new_width = parseInt( getValue("settings_new_width") );
            }
            if (settings_show_smaller_area_top_right) { 
                new_padding_right = 261 - 14;
                if (settings_show_smaller_gc_link) {
                    new_width_menu = new_width - 261 + 20 - 28; 
                    new_width_menu_cut_old = 28;
                } else {
                    new_width_menu = new_width - 261 + 20 - 190; 
                    new_width_menu_cut_old = 190;
                }
            } else { 
                new_padding_right = 418 - 14;
                if (settings_show_smaller_gc_link) {
                    new_width_menu = new_width - 418 + 20 - 28; 
                    new_width_menu_cut_old = 28;
                } else {
                    new_width_menu = new_width - 418 + 20 - 190;
                    new_width_menu_cut_old = 190;
                }
            }    
            
            // Member Upgrade Button entfernen. (Er wurde bei den Abstandsberechnungen vergessen, nun muß er auf jedenfall dran glauben.)
            $('.li-upgrade').remove();
            $('.li-membership').remove();
            
            // Beschriftung "Messages" des Message Center Icons entfernen, Title "Message Center" setzen, Strich entfernen.
            if (settings_show_smaller_area_top_right) { 
                $('.messagecenterheaderwidget').find(".link-text").remove();                 // Altes Seiten Design
                $('.messagecenterheaderwidget').find(".link-text-msg-center").remove();      // Account Settings, Message Center (neues Seiten Design)
                $('.messagecenterheaderwidget').find(".msg-center-link-text").remove();      // Cache suchen, Cache verstecken (neues Seiten Design)
                var mess_head = getElementsByClass("messagecenterheaderwidget li-messages");
                for (var mh = 0; mh < mess_head.length; mh++) {
                    mess_head[mh].setAttribute("title", "Message Center"); 
                    if ( mess_head[mh].children[0].className !== "message-center-icon" ) {
                        mess_head[mh].children[0].remove();
                    }
                }
            }
            
            
            // Global verwendete Attribute zur Darstellung der Objekte im Header setzen.
            style.innerHTML += 
                // Schriftfarbe im Menü setzen. Bei Auswahl in weiss.
                ".#m li a, .#m li a:link, .#m li a:visited, .#m li {color: #" + font_color + " !important;}" +
                ".#m li a:hover, .#m li a:focus {color: #FFFFFF !important; outline: unset !important;}" +
                // Schriftfarbe im Untermenü setzen.
                ".#sm li a:visited {color: #" + font_color + " !important;}" +
                // Schriftgröße im Menü auf 16 stellen.
                ".#m {font-size: 16px !important;}" +
                // Schriftgröße im Menü einstellen.
                ".#m li, .#m li a, .#m li input {font-size: " + font_size_menu + "px !important;}" +
                // Abstände im Menü einstellen.
                "ul.#m > li {margin-left: " + distance_menu + "px !important; margin-right: " + distance_menu + "px !important;} ul.#m li a {padding: .25em .25em .25em 0 !important;}" +
                // Schriftgröße im Untermenü auf 16 stellen.
                "ul.#sm, ul.#sm li {font-size: 16px !important;}" +
                // Schriftgröße im Untermenü einstellen.
                "ul.#sm li a {font-size: " + font_size_submenu + "px !important;}" +
                // Abstände im Untermenü einstellen.
                "ul.#sm li a {margin: " + distance_submenu + "px 1em !important; padding: 0 0.5em !important;}" +
                // Menühöhe einstellen, ansonsten verschiebt sich alles bei anderen Schriftgrößen.
                ".#m {height: 35px !important;}" +
                // Ein Verschieben des Submenüs unterbinden.
                ".#sm {margin-left: 0 !important}"; 
            
            // Vertikales Menu grundsätzlich ausrichten.
            if ( settings_bookmarks_top_menu ) {
                // Menüzeilenhöhe auf 16 stellen.
                style.innerHTML += "ul.#m {line-height: 16px;}";       
                // Zwischen Menüname und Submenü keine Lücke lassen, sonst klappt das nicht mit dem einfachen Aufklappen. 
                style.innerHTML += ".#m li a, .#m li a:link, .#m li a:visited {margin-bottom: 10px;} ul.#sm {margin-top: -6px;}";
            // Horizontales Menu grundsätzlich ausrichten.
            } else {                     
                // Menüzeilenhöhe auf 16 stellen.
                style.innerHTML += "ul.#m {line-height: 16px !important;}";       
                // Zeilenabstand setzen in Abhängigkeit von der Anzahl Zeilen.
                if      ( settings_menu_number_of_lines == 2 ) style.innerHTML += "ul.#m li a {padding-top: 4px !important; padding-bottom: 4px !important;}"; 
                else if ( settings_menu_number_of_lines == 3 ) style.innerHTML += "ul.#m li a {padding-top: 1px !important; padding-bottom: 1px !important;}"; 
            }
            
            // Account Settings, Message Center, Cache suchen oder Cache verstecken (neues Seiten Design):
            // ----------
            if ( is_page("settings") || is_page("messagecenter") || is_page("find_cache") || is_page("hide_cache") ) {
                // Geocaching Logos ersetzen und verschieben, sofern das gewünscht ist.
                for (var i = 0; i < 2; i++) {
                    if ( $('.wrapper').find(".logo").get(i) ) {
                        var side = $('.wrapper').find(".logo").get(i);
                        changeGcLogo(side);
                    }
                }

                // Weitere Attribute für neues Seiten Design zur Darstellung der Objekte im Header setzen.
                style.innerHTML += 
                    // Menüweite setzen.
                    ".#m {width: " + new_width_menu + "px !important;}" +
                    "nav .wrapper {padding-right: " + new_padding_right + "px !important;}" +
                    "header, nav, footer {min-width: " + (new_width + 40) + "px !important;}" +
                    "nav .wrapper {max-width: unset; width: unset;}" +
                    // Rest.
                    "nav .wrapper {border-bottom: unset; margin: unset;}";
                
                // Hauptbereich nach oben schieben.
                if ( is_page("find_cache") || is_page("hide_cache") ) {
                    // Wenn Menu rechts ausgerichtet ist.
                    if ( settings_menu_float_right ) style.innerHTML += ".main {margin-top: -76px;} .reveal-modal.search-filters {margin-top: -10px;}";
                    else style.innerHTML += ".main {margin-top: -73px;} .reveal-modal.search-filters {margin-top: -10px;}";
                }
                else style.innerHTML += ".main {margin-top: -64px;}";
                // Platzieren des neuen Logos verursacht Fehler in der Plazierung des Videos. Folgendes korrigiert das quasi.
                if ( is_page("hide_cache") ) style.innerHTML += ".video iframe {width: 90%;}";

                // Vertikales Menu weiter ausrichten.
                if ( settings_bookmarks_top_menu ) {
                    // Header nach oben schieben.
                    style.innerHTML += "nav .wrapper {top: -69px;} .profile-panel {top: -16px !important}";
                    // Menu und Searchfield ausrichten in Abhängigkeit von der Schriftgröße.
                    style.innerHTML += "ul.#m > li {margin-top: " + ( 3 + ( 16 - font_size_menu ) / 2 ) + "px;}";
                    // Logoverschiebung weiter unten.
                    var logoMarginTop = 0;
                // Horizontales Menu weiter ausrichten.
                } else {
                    // Ausrichtung Submenu.
                    if ( is_page("find_cache") || is_page("hide_cache") ) style.innerHTML += "ul.#sm {top: 26px;}";
                    if ( is_page("settings") || is_page("messagecenter") ) style.innerHTML += "ul.#sm {top: 22px;}";
                    // Ausrichtung Header und Logoverschiebung weiter unten in Abhängigkeit von den Anzahl Zeilen.
                    if        ( settings_menu_number_of_lines == 1 ) {
                        style.innerHTML += "nav .wrapper {top: -66px;} .profile-panel {top: -19px !important}"; 
                        var logoMarginTop = -3;
                    } else if ( settings_menu_number_of_lines == 2 ) {
                        style.innerHTML += "nav .wrapper {top: -78px;} .profile-panel {top:  -7px !important}"; 
                        var logoMarginTop = 9;
                    } else if ( settings_menu_number_of_lines == 3 ) {
                        style.innerHTML += "nav .wrapper {top: -84px;} .profile-panel {top:  -1px !important}";
                        var logoMarginTop = 15;
                    }
                }

                // Bereich links ausrichten in Abhängigkeit davon, ob Logo geändert wird und ob GC Tour im Einsatz ist. 
                if      ( !settings_show_smaller_gc_link && !settings_gc_tour_is_working ) {
                    style.innerHTML += "#l {margin-left: -11px; margin-top: " + (  2 + logoMarginTop) + "px; fill: #ffffff;} .#m {margin-left: 190px !important;}"; }
                else if ( !settings_show_smaller_gc_link && settings_gc_tour_is_working ) {
                    style.innerHTML += "#l {margin-left: -11px; margin-top: " + (-15 + logoMarginTop) + "px; fill: #ffffff;} .#m {margin-left: 190px !important;}"; }
                else if ( settings_show_smaller_gc_link && !settings_gc_tour_is_working ) {
                    style.innerHTML += "#l {margin-left: -17px; margin-top: " + (  2 + logoMarginTop) + "px; width: 35px;}   .#m {margin-left:  28px !important;}"; }
                else if ( settings_show_smaller_gc_link && settings_gc_tour_is_working ) {
                    style.innerHTML += "#l {margin-left: -17px; margin-top: " + (-15 + logoMarginTop) + "px; width: 35px;}   .#m {margin-left:  28px !important;}"; }

                // Bereich rechts ausrichten und zusammenschieben.
                if (settings_show_smaller_area_top_right) { 
                    style.innerHTML += 
                        // Rechten Bereich anpassen, damit er so aussieht wie auf den anderen Seiten.
                        ".profile-panel {margin-right: -2em}" +
                        // User und Setting Icon etwas zusammenschieben
                        ".profile-panel .li-user-toggle {margin-left: 0.5em;}" +
                        // Setting Icon und Message Icon etwas zusammenschieben und Username auf 115px begrenzen.
                        ".profile-panel .li-messages, .profile-panel .li-messages_gclh {padding: 22px 0em 22px 1em;}" +     // Message Center Fehler
                        ".profile-panel > li {padding-right: 0; padding-left: 6px; padding-top: 12px;}" +
                        ".profile-panel .user-avatar ~ span {max-width: 115px;}" +
                        // Senkrechter Strich vor Message Icon entfernen.
                        ".profile-panel > li + li::before {border-left: unset}";
                }
            }

            // Geotours:
            // ----------
            else if ( is_page("geotours") ) {
                // Geocaching Logo ersetzen und verschieben, sofern das gewünscht ist.
                if ( $('#HDHomeLink').get(0) ) {
                    var side = $('#HDHomeLink').get(0);
                    changeGcLogo(side);
                }

                // Weitere Attribute für neues Seiten Design zur Darstellung der Objekte im Header setzen.
                style.innerHTML += 
                    // Menüweite setzen.
                    "nav .container {width: " + ( new_width_menu + new_width_menu_cut_old ) + "px !important;}" +
                    "header, nav, footer {min-width: " + (new_width + 40) + "px !important;}" +
                    "header .container, nav .container {max-width: unset;}" +
                    // Keine Linie.
                    "nav .container {border-bottom: unset; margin: unset;}" +
                    // Content etwas zurechtrücken.
                    "#Content .container, .span-24 {margin-top: -1em !important; margin-bottom: 1em !important; padding: 0;}";

                // Vertikales Menu weiter ausrichten.
                if ( settings_bookmarks_top_menu ) {
                    // Header nach oben schieben.
                    style.innerHTML += "nav .container {margin-top: -69px !important;}";
                    // Menu und Searchfield ausrichten in Abhängigkeit von der Schriftgröße.
                    style.innerHTML += "ul.#m > li {margin-top: " + ( 3 + ( 16 - font_size_menu ) / 2 ) + "px;}";
                    // Logoverschiebung weiter unten.
                    var logoMarginTop = 0;
                    // Wenn links ausgerichtet, dann float zurücksetzen, weil das leichte Verschiebungen verursacht.
                    if ( settings_menu_float_right == false ) style.innerHTML += ".#m > li {float: unset}";
                // Horizontales Menu weiter ausrichten.
                } else {
                    // Ausrichtung Submenu.
                    style.innerHTML += "ul.#sm {top: 25px;}";
                    // Ausrichtung Header und Logoverschiebung weiter unten in Abhängigkeit von den Anzahl Zeilen.
                    style.innerHTML += ".#m > li {float: unset}";
                    if        ( settings_menu_number_of_lines == 1 ) {
                        style.innerHTML += "nav .container {margin-top: -66px;}";
                        var logoMarginTop = -3;
                    } else if ( settings_menu_number_of_lines == 2 ) {
                        style.innerHTML += "nav .container {margin-top: -78px;}";
                        var logoMarginTop = 9;
                    } else if ( settings_menu_number_of_lines == 3 ) {
                        style.innerHTML += "nav .container {margin-top: -83px;}";
                        var logoMarginTop = 14; 
                    }
                }

                // Bereich links ausrichten in Abhängigkeit davon, ob Logo geändert wird und ob GC Tour im Einsatz ist. 
                if      ( !settings_show_smaller_gc_link && !settings_gc_tour_is_working ) {
                    style.innerHTML += "#l {margin-left: -11px; margin-top: " + (  2 + logoMarginTop) + "px; fill: #ffffff;} .#m {margin-left: 190px !important;}"; }
                else if ( !settings_show_smaller_gc_link && settings_gc_tour_is_working ) {
                    style.innerHTML += "#l {margin-left: -11px; margin-top: " + (-15 + logoMarginTop) + "px; fill: #ffffff;} .#m {margin-left: 190px !important;}"; }
                else if ( settings_show_smaller_gc_link && !settings_gc_tour_is_working ) {
                    style.innerHTML += "#l {margin-left: -17px; margin-top: " + (  2 + logoMarginTop) + "px; width: 35px;}   .#m {margin-left:  28px !important;}"; }
                else if ( settings_show_smaller_gc_link && settings_gc_tour_is_working ) {
                    style.innerHTML += "#l {margin-left: -17px; margin-top: " + (-15 + logoMarginTop) + "px; width: 35px;}   .#m {margin-left:  28px !important;}"; }

                // Bereich rechts ausrichten und zusammenschieben.
                if (settings_show_smaller_area_top_right) { 
                    style.innerHTML += 
                        // User und Setting Icon etwas zusammenschieben
                        ".profile-panel .li-user-toggle {margin-left: 0.5em; padding: 0.43em 0.6em;}" +
                        // Setting Icon und Message Icon etwas zusammenschieben und Username auf 115px begrenzen.
                        ".profile-panel .li-messages, .profile-panel .li-messages_gclh {padding: 22px 0em 22px 1em;}" +     // Message Center Fehler
                        ".profile-panel > li {padding-right: 0; padding-left: 6px; padding-top: 12px;}" +
                        ".profile-panel .user-avatar ~ span {max-width: 115px;}" +
                        // Senkrechter Strich vor Message Icon entfernen.
                        ".profile-panel > li + li::before {border-left: unset}";
                }
            }
            // Labs:
            // ----------
            else if ( is_page("labs") ) {
                // Geocaching Logo ersetzen und verschieben, sofern das gewünscht ist.
                if ( $('.title').children(0).get(0) ) {
                    var side = $('.title').children(0).get(0);
                    changeGcLogo(side);
                }

                // Weitere Attribute für neues Seiten Design zur Darstellung der Objekte im Header setzen.
                style.innerHTML += 
                    // Menüweite setzen und Submenu korrigieren.
                    ".#m {width: " + new_width_menu + "px !important;}" +
                    ".#sm {margin-top: -6px !important;}" +
                    // Rest.
                    ".header-container, footer-container {min-width: " + (new_width + 40) + "px !important;}" +
                    "header.wrapper {width: unset; margin: unset !important;}" +  
                    ".header-container .title {padding: unset;}" +
                    ".title {margin: 18px 0 0 3px !important;}" +
                    ".title img {max-height: unset !important}" +
                    "#newgclogo {margin-left: -6px !important;}" +
                    // Das ist das "menu" bei den Settings.
                    ".menu {right: 54px !important;}" +
                    // Spalt zwischen Header und Content lassen wie bei find und hide.
                    ".events-map, .breadcrumb {top: 2px;}";
                // Profile Panel platzieren in Abhängigkeit von Linklist. 
                if ( settings_bookmarks_on_top ) style.innerHTML += ".profile-panel {margin: -66px 50px 0 0;}";
                else style.innerHTML += ".profile-panel {margin: 0px 50px 0 0;}";
                // Wenn Menu rechts ausgerichtet ist.
                if ( settings_menu_float_right ) style.innerHTML += "ul.Menu {left: 14px;}";

                // Vertikales Menu weiter ausrichten.
                if ( settings_bookmarks_top_menu ) {
                    // Menu und Searchfield ausrichten in Abhängigkeit von der Schriftgröße.
                    style.innerHTML += "ul.#m > li {margin-top: " + ( 3 + ( 16 - font_size_menu ) / 2 ) + "px;}";
                // Horizontales Menu weiter ausrichten in Abhängigkeit von den Anzahl Zeilen.
                } else {
                    if      ( settings_menu_number_of_lines == 1 ) style.innerHTML += "ul.#m {top: 3px;}"; 
                    else if ( settings_menu_number_of_lines == 2 ) style.innerHTML += "ul.#m {top: -8px;}"; 
                    else if ( settings_menu_number_of_lines == 3 ) style.innerHTML += "ul.#m {top: -13px; padding-left: 10px !important;}";
                }

                // Bereich links ausrichten in Abhängigkeit davon, ob Logo geändert wird und ob GC Tour im Einsatz ist. 
                if      ( !settings_show_smaller_gc_link && !settings_gc_tour_is_working ) {
                    style.innerHTML += "#l {margin-left: -11px; margin-top:   2px; fill: #ffffff;} .#m {margin-left: 190px !important;}"; }
                else if ( !settings_show_smaller_gc_link && settings_gc_tour_is_working ) {
                    style.innerHTML += "#l {margin-left: -11px; margin-top: -15px; fill: #ffffff;} .#m {margin-left: 190px !important;}"; }
                else if ( settings_show_smaller_gc_link && !settings_gc_tour_is_working ) {
                    style.innerHTML += "#l {margin-left: -17px; margin-top:   2px; width: 35px;}   .#m {margin-left:  28px !important;}"; }
                else if ( settings_show_smaller_gc_link && settings_gc_tour_is_working ) {
                    style.innerHTML += "#l {margin-left: -17px; margin-top: -15px; width: 35px;}   .#m {margin-left:  28px !important;}"; }

                // Bereich rechts ausrichten und zusammenschieben.
                if (settings_show_smaller_area_top_right) { 
                    style.innerHTML += 
                        // User und Setting Icon etwas zusammenschieben
                        ".profile-panel .li-user-toggle {margin-left: 0.5em; padding: 0.43em 0.6em;}" +
                        // Username auf 115px begrenzen.
                        ".user-avatar {max-width: 115px;}";  
                }
            }
            // Karte:
            // ----------
            else if ( is_page("map") ) {
                // Geocaching Logo ersetzen und verschieben, sofern das gewünscht ist.
                if ( $('.MapsLogo').get(0) ) {
                    var side = $('.MapsLogo').get(0);
                    changeGcLogo(side);
                }
                
                // Weitere Attribute für Karte zur Darstellung der Objekte im Header setzen.
                style.innerHTML += 
                    // Menüweite setzen und Submenu korrigieren.
                    ".#m {width: " + new_width_menu + "px !important;}" +
                    "header.row {min-width: " + (new_width + 57) + "px !important;}" +
                    ".#m {margin-left: 28px; left: 14px; top: -24px;}" +
                    ".#sm {margin-top: -6px !important;}" +
                    // Rechten Bereich anpassen, damit er so aussieht wie auf den anderen Seiten.
                    ".ProfileWidget {margin-right: -1em}" +
                    // Searchfield ausrichten.
                    "input {margin-top: 0px}";

                // Vertikales Menu weiter ausrichten.
                if ( settings_bookmarks_top_menu ) {
                    // Menu und Searchfield ausrichten in Abhängigkeit von der Schriftgröße.
                    style.innerHTML += "ul.#m > li {margin-top: " + ( 3 + ( 16 - font_size_menu ) / 2 ) + "px;}";
                // Horizontales Menu weiter ausrichten in Abhängigkeit von den Anzahl Zeilen.
                } else {
                    if      ( settings_menu_number_of_lines == 1 ) style.innerHTML += "ul.#m {top: -20px;}"; 
                    else if ( settings_menu_number_of_lines == 2 ) style.innerHTML += "ul.#m {top: -31px;}"; 
                    else if ( settings_menu_number_of_lines == 3 ) style.innerHTML += "ul.#m {top: -36px;}"; // padding-left: 10px !important;}";
                }

                // Bereich links ausrichten in Abhängigkeit davon, ob Logo geändert wird und ob GC Tour im Einsatz ist. 
                if      ( !settings_show_smaller_gc_link && !settings_gc_tour_is_working ) {
                    style.innerHTML += "#l {margin-left:  -7px; margin-top:   2px; fill: #ffffff;} .#m {margin-left: 190px !important; margin-top: -13px !important}"; }
                else if ( !settings_show_smaller_gc_link && settings_gc_tour_is_working ) {
                    style.innerHTML += "#l {margin-left:  -7px; margin-top: -15px; fill: #ffffff;} .#m {margin-left: 190px !important;}"; }
                else if ( settings_show_smaller_gc_link && !settings_gc_tour_is_working ) {
                    style.innerHTML += "#l {margin-left: -13px; margin-top:   2px; width: 35px;}   .#m {margin-left:  28px !important; margin-top: -15px !important}"; }
                else if ( settings_show_smaller_gc_link && settings_gc_tour_is_working ) {
                    style.innerHTML += "#l {margin-left: -13px; margin-top: -15px; width: 35px;}   .#m {margin-left:  28px !important;}"; }

                // Bereich rechts ausrichten und zusammenschieben.
                if (settings_show_smaller_area_top_right) { 
                    style.innerHTML += 
                        // User und Setting Icon etwas zusammenschieben und Username auf 115px begrenzen.
                        ".logged-in-user .li-user-toggle {margin-left: 0.5em; padding: 0.43em 0.6em;}" +
                        "header .logged-in-user > li {padding-left: 6px; padding-right: 13px;}" +
                        ".SignedInProfileLink .li-user-info span:first-child {max-width: 115px;}" +
                        // Setting Icon und Message Icon etwas zusammenschieben
                        ".logged-in-user .li-messages, .logged-in-user .li-messages_gclh {padding: 22px 1em 22px 0em;}";    // Message Center Fehler
                }
            }

            // Altes Seiten Design und restliche Seiten:
            // ----------
            else {
                // Geocaching Logo ersetzen und verschieben, sofern das gewünscht ist.
                if (document.getElementById('ctl00_ctl23_A1')) {
                    var side = document.getElementById('ctl00_ctl23_A1');
                    changeGcLogo(side);
                }

                // Aufbau Menü im Header mit move Navigation (nicht mehr move Navigation Container).
                // Menü in den Header verschieben. 
                $('#ctl00_siteHeader').find(".container").prepend($('#Navigation').remove().get().reverse());

                // Weitere Attribute für altes Seiten Design zur Darstellung der Objekte im Header setzen.
                style.innerHTML += 
                    // Menüweite setzen.
                    "nav .container {width: " + ( new_width_menu + new_width_menu_cut_old ) + "px !important;}" +
                    // Rechts und links keinen Platz im Header verlieren.
                    "header {padding: 0;}" +
                    // Menü Container nicht begrenzen, keine Linie, Schrift zentrieren und nach links ausrichten.
                    "nav .container {border-bottom: 0;}" +
                    "nav .container {float: left; margin-left: -2px; margin-top: -4px;}" +
                    ".container {min-width: unset;}";

                // Vertikales Menu weiter ausrichten.
                if ( settings_bookmarks_top_menu ) {
                    // Menu und Searchfield ausrichten in Abhängigkeit von der Schriftgröße.
                    style.innerHTML += "ul.#m {top: " + ( 3 + ( 16 - font_size_menu ) / 2 ) + "px;}";  
                // Horizontales Menu weiter ausrichten in Abhängigkeit von der Anzahl Zeilen.
                } else {
                    if      ( settings_menu_number_of_lines == 1 ) style.innerHTML += "ul.#m {top:   4px !important;}"; 
                    else if ( settings_menu_number_of_lines == 2 ) style.innerHTML += "ul.#m {top:  -8px !important;}"; 
                    else if ( settings_menu_number_of_lines == 3 ) style.innerHTML += "ul.#m {top: -13px !important;}"; 
                }

                // Bereich links ausrichten in Abhängigkeit davon, ob Logo geändert wird und ob GC Tour im Einsatz ist. 
                if      ( !settings_show_smaller_gc_link && !settings_gc_tour_is_working ) {
                    style.innerHTML += "#l {margin-left: -11px; margin-top:   2px; fill: #ffffff;} .#m {margin-left: 190px !important;}"; }
                else if ( !settings_show_smaller_gc_link && settings_gc_tour_is_working ) {
                    style.innerHTML += "#l {margin-left: -11px; margin-top: -15px; fill: #ffffff;} .#m {margin-left: 190px !important;}"; }
                else if ( settings_show_smaller_gc_link && !settings_gc_tour_is_working ) {
                    style.innerHTML += "#l {margin-left: -17px; margin-top:   2px; width: 35px;}   .#m {margin-left:  28px !important;}"; }
                else if ( settings_show_smaller_gc_link && settings_gc_tour_is_working ) {
                    style.innerHTML += "#l {margin-left: -17px; margin-top: -15px; width: 35px;}   .#m {margin-left:  28px !important;}"; }
                
                // Bereich rechts ausrichten und zusammenschieben.
                if (settings_show_smaller_area_top_right) { 
                    style.innerHTML += 
                        // User und Setting Icon etwas zusammenschieben und Username auf 115px begrenzen.
                        ".logged-in-user .li-user-toggle {margin-left: 0.5em; padding: 0.43em 0.6em;}" +
                        "header .logged-in-user > li {padding-left: 6px; padding-right: 13px;}" +
                        ".SignedInProfileLink .li-user-info span:first-child {max-width: 115px;}" +
                        // Setting Icon und Message Icon etwas zusammenschieben
                        ".logged-in-user .li-messages, .logged-in-user .li-messages_gclh {padding: 22px 1em 22px 0em;}";    // Message Center Fehler
                }
            }

            // Alle Seiten: Platzhalter umsetzen:
            // ----------
            // Bei Account Settings und Message Center werden menu, submenu und logo so geschrieben.
            if ( is_page("settings") || is_page("messagecenter") ) {
                style_tmp.innerHTML = style.innerHTML.replace(/#m/gi, "menu"); style.innerHTML = style_tmp.innerHTML;
                style_tmp.innerHTML = style.innerHTML.replace(/#sm/gi, "submenu"); style.innerHTML = style_tmp.innerHTML;
                style_tmp.innerHTML = style.innerHTML.replace(/#l/gi, "nav .logo"); style.innerHTML = style_tmp.innerHTML;
            } 
            // Bei Cache suchen, Cache verstecken und Geotours werden Menu, SubMenu und logo so geschrieben.
            else if ( is_page("find_cache") || is_page("hide_cache") || is_page("geotours") ) {
                style_tmp.innerHTML = style.innerHTML.replace(/#m/gi, "menu"); style.innerHTML = style_tmp.innerHTML;
                style_tmp.innerHTML = style.innerHTML.replace(/#sm/gi, "submenu"); style.innerHTML = style_tmp.innerHTML;
                style_tmp.innerHTML = style.innerHTML.replace(/#l/gi, "nav .logo"); style.innerHTML = style_tmp.innerHTML;
            }
            // Bei Labs werden Menu, SubMenu und title (logo) so geschrieben.
            else if ( is_page("labs") ) {
                style_tmp.innerHTML = style.innerHTML.replace(/#m/gi, "Menu"); style.innerHTML = style_tmp.innerHTML;
                style_tmp.innerHTML = style.innerHTML.replace(/#sm/gi, "SubMenu"); style.innerHTML = style_tmp.innerHTML;
                style_tmp.innerHTML = style.innerHTML.replace(/#l/gi, ".title"); style.innerHTML = style_tmp.innerHTML;
            }
            // In Karte werden Menu, SubMenu und MapsLogo so geschrieben.
            else if ( is_page("map") ) {
                style_tmp.innerHTML = style.innerHTML.replace(/#m/gi, "Menu"); style.innerHTML = style_tmp.innerHTML;
                style_tmp.innerHTML = style.innerHTML.replace(/#sm/gi, "SubMenu"); style.innerHTML = style_tmp.innerHTML;
                style_tmp.innerHTML = style.innerHTML.replace(/#l/gi, ".MapsLogo"); style.innerHTML = style_tmp.innerHTML;
            }
            // Im alten Seiten Design werden Menu, SubMenu und Logo so geschrieben.
            else {
                style_tmp.innerHTML = style.innerHTML.replace(/#m/gi, "Menu"); style.innerHTML = style_tmp.innerHTML;
                style_tmp.innerHTML = style.innerHTML.replace(/#sm/gi, "SubMenu"); style.innerHTML = style_tmp.innerHTML;
                style_tmp.innerHTML = style.innerHTML.replace(/#l/gi, "nav .Logo"); style.innerHTML = style_tmp.innerHTML;
            }
            
            head.appendChild(style);
        }
    } catch (e) {
        gclh_error("Change Header layout", e);
    }

// GC Logo ändern.
    function changeGcLogo(side) {
        if (settings_show_smaller_gc_link) {
            // Logo entfernen.
            if (side.children[0]) {
                side.children[0].remove();
            }
            // Neues Logo aufbauen 
            var gc_link = document.createElement("a");
            var gc_img = document.createElement("img");
            gc_img.setAttribute("style", "clip: unset; width: 35px; margin-top: -3px;"); 
            gc_img.setAttribute("title", "Geocaching");
            gc_img.setAttribute("id", "newgclogo");
            gc_img.setAttribute("src", global_gc_icon);
            gc_link.appendChild(gc_img);
            gc_link.setAttribute("href", http + "://www.geocaching.com");
            side.appendChild(gc_link);
        }
    }
    
// New Width (Umbau)
// (Die Menüweite wird bei Change Header Layout gesetzt.)
    new_width:
    try {
        // Im neuen Seiten Design, bei Geotours, bei Labs Caches und bei Karten hier keine Anpassungen vornehmen.
        if ( is_page("messagecenter") || is_page("settings") || is_page("hide_cache") || is_page("find_cache") || is_page("geotours") || is_page("labs") || is_page("map") ) break new_width;

        if (getValue("settings_new_width") > 0) {
            var new_width = parseInt( getValue("settings_new_width") );
            var css = "";
            
            // Header- und Fußbereich:
            css += "header, nav, footer {min-width: " + (new_width + 40) + "px !important;}";
            css += "header .container, nav .container {max-width: unset;}";
            
            // Bei folgenden Seiten keine weiteren Anpassungen vornehmen. 
            if ( document.location.href.match(/\/\/www\.geocaching\.com\/pocket\/gcquery\.aspx/) ||      // Pocket Query: Einstellungen zur Selektion
                 document.location.href.match(/\/\/www\.geocaching\.com\/pocket\/bmquery\.aspx/)    );   // Pocket Query aus Bockmarkliste: Einstellungen zur Selektion     
            else {
            
                // Weitere Anpassungen auf allen Seiten:
                css += "#Content .container, #Content .span-24, .span-24 {width: " + new_width + "px;}";
                css += ".CacheStarLabels.span-6 {width: " + ((new_width - 300 - 190 - 10 - 10) / 2) + "px !important;}";
                css += ".span-6.right {width: " + ((new_width - 300 - 190 - 10 - 10) / 2) + "px !important;}";
                css += ".span-8 {width: " + ((new_width - 330 - 10) / 2) + "px !important;}";
                css += ".span-10 {width: " + ((new_width - 170) / 2) + "px !important;}";
                css += ".span-15 {width: " + (new_width - 360) + "px !important;}";
                css += ".span-16 {width: " + (new_width - 320 - 10) + "px !important;}";
                css += ".span-17 {width: " + (new_width - 300) + "px !important;}";
                css += ".span-19 {width: " + (new_width - 200) + "px !important;}";
                css += ".span-20 {width: " + (new_width - 160) + "px;}";
                css += ".LogDisplayRight {width: " + (new_width - 180) + "px !important;}";
                css += "#log_tabs .LogDisplayRight {width: " + (new_width - 355) + "px !important;}";
                css += "#uxBookmarkListName {width: " + ( new_width - 470 - 5 ) + "px !important;}";
                css += "table.TrackableItemLogTable div {width: " + (new_width - 160) + "px !important; max-width: unset;}";
                css += ".UserSuppliedContent {max-width: unset; width: unset;}";

                // Besonderheiten:
                if (is_page("cache_listing")                                                 ) {
                    css += ".span-9 {width: " + (new_width - 300 - 270 - 13 - 13 - 10) + "px !important;}";
                }
                else if (document.location.href.match(/\/my\/statistics\.aspx/)              ) {
                    css += ".StatsTable {width: " + (new_width - 250) + "px !important;}";
                }
                else if (document.location.href.match(/\/profile\/\?guid/)                ||
                         document.location.href.match(/\/profile\/\B/)                       ) {
                    css += ".span-9 {width: " + ((new_width - 250) / 2) + "px !important;}";
                    css += ".StatsTable {width: " + (new_width - 250 - 30) + "px !important;}";
                }

            }
            appendCssStyle( css );
        }
    } catch (e) {
        gclh_error("new width", e);
    }
    
// Remove gc.com Links in Navigation (Umbau)
    try {
        if ( document.getElementsByClassName("Menu").length > 0 ) {
            var liste = document.getElementsByClassName("Menu")[0];
            var links = $('ul.Menu a');
        }
        else if ( document.getElementsByClassName("menu").length > 0 ) {
            var liste = document.getElementsByClassName("menu")[0];
            var links = $('ul.menu a');
        }
        if ( links ) {
            for (var i = 0; i < (links.length -1); i++) {
                if      ( links[i].className.match(/dropdown/i) && links[i].href.match(/\/guide\/$/)            && getValue('remove_navi_learn'))     liste.removeChild(links[i].parentNode);
                else if ( links[i].className.match(/dropdown/i) && links[i].href.match(/\/play\/search/)        && getValue('remove_navi_play'))      liste.removeChild(links[i].parentNode);
                else if ( links[i].className.match(/dropdown/i) && links[i].href.match(/\/forums\/$/)           && getValue('remove_navi_community')) liste.removeChild(links[i].parentNode);
                else if ( links[i].className.match(/dropdown/i) && links[i].href.match(/shop\.geocaching\.com/) && getValue('remove_navi_shop'))      liste.removeChild(links[i].parentNode);
            }
        }
    } catch (e) {
        gclh_error("remove gc.com links", e);
    }

// Bookmarks on top
    try {
        if ( settings_bookmarks_on_top ) {
//--> $$070FE Begin of change
//            // Bei Labs Caches gibt es kein Menu, Menu aufbauen.
//            if ( is_page("labs") ) {
            // Bei Labs Caches gibt es kein Menu, Menu aufbauen. Nur wenn Change Header Layout aktiviert ist.
            if ( is_page("labs") && settings_change_header_layout ) {
//<-- $$070FE End of change
                if ( $('.profile-panel')[0] ) {
                    var mainMenu = document.createElement("ul");
                    mainMenu.setAttribute("class", "Menu");
                    $('.profile-panel')[0].parentNode.insertBefore(mainMenu, $('.profile-panel')[0]);
                    css = buildCoreCss();
                    appendCssStyle( css );
                }
            }
//--> $$070FE Begin of change
//            // Bei Karten gibt es kein Menu, Menu aufbauen.
//            else if ( is_page("map") ) {
            // Bei Karten gibt es kein Menu, Menu aufbauen. Nur wenn Change Header Layout aktiviert ist.
            else if ( is_page("map") && settings_change_header_layout ) {
//<-- $$070FE End of change
                if ( $('.ProfileWidget')[0] ) {
                    var mainMenu = document.createElement("ul");
                    mainMenu.setAttribute("class", "Menu");
                    $('.ProfileWidget')[0].parentNode.insertBefore(mainMenu, $('.ProfileWidget')[0]);
                    css = buildCoreCss();
                    appendCssStyle( css );
                }
            }
        }
        
        if (settings_bookmarks_on_top && (document.getElementsByClassName("Menu").length > 0 || document.getElementsByClassName("menu").length > 0)){
            if(document.getElementsByClassName("Menu").length > 0) var nav_list = document.getElementsByClassName("Menu")[0];
            else var nav_list = document.getElementsByClassName("menu")[0];
            
            var menu = document.createElement("li");

            var headline = document.createElement("a");

            if ( settings_bookmarks_top_menu || settings_change_header_layout == false ) {   // Navi vertikal
                headline.setAttribute("href", "#");
                headline.setAttribute("class", "Dropdown");
                headline.setAttribute("accesskey", "7");
                headline.innerHTML = "Linklist";
                menu.appendChild(headline);

                var submenu = document.createElement("ul");
                $(submenu).addClass("SubMenu").addClass("submenu");
                menu.appendChild(submenu);

                for (var i = 0; i < settings_bookmarks_list.length; i++) {
                    var x = settings_bookmarks_list[i];
                    if (typeof(x) == "undefined" || x == "" || typeof(x) == "object") continue;

                    var sublink = document.createElement("li");
                    var hyperlink = document.createElement("a");

                    for (attr in bookmarks[x]) {
                        if (attr != "custom" && attr != "title") hyperlink.setAttribute(attr, bookmarks[x][attr]);
                    }
                    hyperlink.appendChild(document.createTextNode(bookmarks[x]['title']));

                    sublink.appendChild(hyperlink);
                    submenu.appendChild(sublink);
                }
                nav_list.appendChild(menu);

                // Bei Labs Caches hover aufbauen.
                // Und auf den Seiten Suchen, Verstecken, Geotours, Account Setting, Message Center und in Karten wird die Linklist ohne Event aufgebaut, hover aufbauen. 
                if ( is_page("labs") || is_page("find_cache") || is_page("hide_cache") || is_page("geotours") || is_page("settings") || is_page("messagecenter") || is_page("map")) {
                    buildHover();
                }

            } else {                             // Navi horizontal
                for (var i = 0; i < settings_bookmarks_list.length; i++) {
                    var x = settings_bookmarks_list[i];
                    if (typeof(x) == "undefined" || x == "" || typeof(x) == "object") continue;

                    var sublink = document.createElement("li");
                    var hyperlink = document.createElement("a");

                    for (attr in bookmarks[x]) {
                        if (attr != "custom" && attr != "title") hyperlink.setAttribute(attr, bookmarks[x][attr]);
                    }
                    hyperlink.appendChild(document.createTextNode(bookmarks[x]['title']));

                    sublink.appendChild(hyperlink);
                    nav_list.appendChild(sublink);
                    
                }
            }

            // Search field
            if (settings_bookmarks_search) {
                var code = "function gclh_search(){";
                code += "  var search = document.getElementById('navi_search').value;";
                code += "  if(search.match(/^GC[A-Z0-9]{1,10}\\b/i) || search.match(/^TB[A-Z0-9]{1,10}\\b/i)) document.location.href = 'http://coord.info/'+search;";
                code += "  else if(search.match(/^[A-Z0-9]{6}\\b$/i)) document.location.href = 'https://www.geocaching.com/track/details.aspx?tracker='+search;";
                code += "  else document.location.href = 'https://www.geocaching.com/seek/nearest.aspx?navi_search='+search;";
                code += "}";

                var script = document.createElement("script");
                script.innerHTML = code;
                document.getElementsByTagName("body")[0].appendChild(script);

                var searchfield = "<li><input onKeyDown='if(event.keyCode==13) { gclh_search(); return false; }' type='text' size='6' name='navi_search' id='navi_search' style='padding: 1px; font-weight: bold; font-family: sans-serif; border: 2px solid #778555; border-radius: 7px 7px 7px 7px; -moz-border-radius: 7px; -khtml-border-radius: 7px; background-color:#d8cd9d' value='" + settings_bookmarks_search_default + "'></li>";
                if ( is_page("labs") ) $(".Menu").append(searchfield);
                else $(".Menu, .menu").append(searchfield);
            }

            //Chrome menu hover fix / Language selector fix
            if (browser == "chrome") {
                injectPageScriptFunction(function () {
                    $('ul.Menu, ul.menu').children().hover(function () {
                            $(this).addClass('hover');
                            $('ul:first', this).css('visibility', 'visible');
                        },
                        function () {
                            $(this).removeClass('hover');
                            $('ul:first', this).css('visibility', 'hidden');
                        }
                    );
					var head = document.getElementsByTagName('head')[0];
					var style = document.createElement('style');
					style.type = 'text/css';
					style.innerHTML = ".SubMenu{ margin-top: -10px !important;} .submenu{ margin-top: -3px !important;}";
					head.appendChild(style);

                    //Language selector fix
                    $('.LanguageSelector script').remove().appendTo('.LanguageSelector');
                 }, "()");
            }

            if ( settings_menu_show_separator ) {
                if ( settings_bookmarks_top_menu || settings_change_header_layout == false );   // Navi vertikal
                else {                                                                          // Navi horizontal
                    var menuChilds = $('ul.Menu, ul.menu')[0].children;
                    for (var i = 1; i < menuChilds.length; i += 2) {
                        var separator = document.createElement("li");
                        separator.appendChild(document.createTextNode("|"));
                        menuChilds[i].parentNode.insertBefore(separator, menuChilds[i]);
                    }
                }
            }

            // Vertikale Menüs rechts ausrichten, falls gewünscht und möglich.
            if ( settings_bookmarks_top_menu && settings_menu_float_right && settings_change_header_layout ) {
                if ( $('ul.Menu, ul.menu')[0] ) {
                    var menu = $('ul.Menu, ul.menu')[0];
                    var menuChilds = $('ul.Menu, ul.menu')[0].children;
                    for (var i = 0; i < menuChilds.length; i++) {
                        var child = menu.removeChild(menu.children[menuChilds.length-1-i]);
                        child.setAttribute("style", "float: right;");
                        menu.appendChild(child);
                    }
                }
            }
        }
    } catch (e) {
        gclh_error("Linklist on top", e);
    }

// Hover aufbauen im Menü.
// (Das muss ganz hinten in der Verarbeitung aufgebaut werden.)   
    function buildHover() {
        $('ul.Menu, ul.menu').children().hover(function () {
                $(this).addClass('hover');
                $(this).addClass('open');
                $('ul:first', this).css('visibility', 'visible');
            },
            function () {
                $(this).removeClass('hover');
                $(this).removeClass('open');
                $('ul:first', this).css('visibility', 'hidden');
            }
        );
    }

// CSS für Menu aus coreCSS aufbauen.                
    function buildCoreCss(){
        var css = "";
        css += "ul.Menu,ul.SubMenu {padding:0; list-style:none;}";
        css += "ul.Menu li,ul.SubMenu li {padding:0;}";
        css += "ul.Menu {margin-left:210px; position:relative; z-index:100}";
        css += "ul.Menu li {zoom:1;}";
        css += "ul.Menu>li {display:inline-block; margin-left:1.5em; margin-right:.25em; padding:0;}";
        css += "ul.Menu>li>a:hover,ul.Menu>li>a:focus {color:#93b516;}";
        css += "ul.Menu li a {cursor:pointer; display:block; margin:0; padding:.25em .75em;}";
        css += "ul.SubMenu {background:#fefcf1; border:2px solid #82aa13; border-radius:3px; margin-top:.25em; padding-top:1em; padding-bottom:1em;}";
        css += "ul .SubMenu::after {background:url(https://www.geocaching.com/images/tlnMasters/dropdown-triangle@2x.png) no-repeat 50% 50%; background-size:contain; content:''; height:10px; position:absolute; top:-11px; left:-2px; width:28px;}";
        css += "ul.SubMenu li {font-size:.85em; margin:0; white-space:nowrap;}";
        css += "ul.SubMenu li a:hover,ul.SubMenu li a:focus {background-color:#e3dfc9; border-radius:3px;}";
        css += "ul.Menu li.hover {position:relative;}";
        css += "ul.Menu li.hover .SubMenu {display:block;}";
        css += "ul.Menu ul {display:none; position:absolute; top:100%; left:0;}";
        css += ".SubMenu.menu-mobile {display:none;}";
        css += "ul.Menu ul li {float:none;}";
        css += ".Menu li a,.Menu li a:link,.Menu li a:visited {color:#2d4f15; text-decoration:none;}";
        css += ".SubMenu li a,.SubMenu li a:link,.SubMenu li a:visited {color:#5f452a;}";
        return css;
    }
    
// Bookmark-Liste im Profil, Linklist on Profile                                                  
    try {
        if (settings_bookmarks_show && document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\//) && document.getElementById("ctl00_ContentBody_WidgetMiniProfile1_LoggedInPanel")) {
            var side = document.getElementById("ctl00_ContentBody_WidgetMiniProfile1_LoggedInPanel");

            var div0 = document.createElement("div");
            div0.setAttribute("class", "YourProfileWidget");
            div0.setAttribute("style", "margin-left: -1px; margin-right: -1px;");     // Wegen doppeltem Border 1px
            var header = document.createElement("h3");
            header.setAttribute("class", "WidgetHeader");
            header.appendChild(document.createTextNode(" Linklist"));

            var div = document.createElement("div");
            div.setAttribute("class", "WidgetBody");

            var ul = document.createElement("ul");

            for (var i = 0; i < settings_bookmarks_list.length; i++) {
                var x = settings_bookmarks_list[i];
                if (typeof(x) == "undefined" || x == "" || typeof(x) == "object") continue;
                var a = document.createElement("a");

                for (attr in bookmarks[x]) {
                  if (attr != "custom" && attr != "title") {
                      if (attr == "name" || attr == "id")  a.setAttribute(attr, bookmarks[x][attr]+"_profile");
                      else a.setAttribute(attr, bookmarks[x][attr]);
                  }
                }

                a.appendChild(document.createTextNode(bookmarks[x]['title']));

                var li = document.createElement("li");
                li.appendChild(a);

                ul.appendChild(li);
            }
            
            div.appendChild(ul);
            div0.appendChild(header);
            div0.appendChild(div);
            side.appendChild(div0);
        }
    } catch (e) {
        gclh_error("Linklist in Profile", e);
    }

// Bezeichnung des Ignore Links durch Stop Ignoring ersetzen, wenn der Cache bereits auf der Ignore Liste steht.
    stop_ignoring:
    try {
        if ( is_page("cache_listing") == false ) break stop_ignoring;
        if ( settings_show_remove_ignoring_link == false ) break stop_ignoring;

        // Bookmark Listen Bereiche besorgen und verarbeiten.
        if ( document.getElementsByClassName("BookmarkList").length > 0 ) {
            var listenBereiche = document.getElementsByClassName("BookmarkList");
            for (var i = 0; i < listenBereiche.length; i++) {

                // Bookmark Listen besorgen, in denen der Cache gelistet ist, und verarbeiten.
                var listen = listenBereiche[i].getElementsByTagName("a");
                for (var j = 0; (j+1) < listen.length; j++) {

                    // Wenn es sich um Ignore Bookmark Liste des Users handelt. (Zugehöriger User steht direkt im Anschluss an die Bookmark Liste.)
                    if ( ( listen[j].href.match(/geocaching\.com\/bookmarks\/view\.aspx\?guid=/) ) &&
                         ( listen[j].text == "Ignore List" ) &&                                          // Die heißt auch in anderen Sprachen so.
                         ( listen[j+1].href.match(/geocaching\.com\/profile\/\?guid=/) ) &&
                         ( listen[j+1].text == $('.li-user-info').children().first().text() ) ) {

                        // Bereich mit den Links "Watch", Ignore" ... besorgen und verarbeiten.
                        var cdnLinksBereich = document.getElementsByClassName("CacheDetailNavigation NoPrint");
                        for (var k = 0; k < cdnLinksBereich.length; k++) {

                            // Liste der Links "Watch", Ignore" ... besorgen und verarbeiten.
                            var cdnLinks = cdnLinksBereich[k].getElementsByTagName("a");
                            for (var m = 0; m < cdnLinks.length; m++) {

                                // Wenn es sich um "Ignore" Link handelt, dann die Linkbezeichnung in Stop Ignoring ändern und das Icon ersetzen. 
                                // (Icon ändern geht wohl nicht mit setAttribute.)
                                if (cdnLinks[m].href.match(/\/bookmarks\/ignore\.aspx\?guid/)) {
                                    cdnLinks[m].innerHTML = "Stop Ignoring";
                                    var head = document.getElementsByTagName('head')[0];
                                    var style = document.createElement('style');
                                    style.type = 'text/css';
                                    style.innerHTML = '.CacheDetailNavigation a[href*="ignore.aspx"]{ background-image: url(' + global_stop_ignore_icon + '); }';
                                    head.appendChild(style);
                                }
                            }
                        }
                    }
                }
            }
        }
     } catch (e) {
        gclh_error("stop ignoring", e);
     }

// Wenn Warnmeldung über Down Time ... vorhanden ist, prüfen, ob sie identisch ist mit der bereits gesicherten, gegebenenfalls verbergen 
// bzw. Button erzeugen zum Verbergen.
    try {
        if ( settings_hide_warning_message ) {
            if ( $('.WarningMessage')[0] ) {
                var content = '"' + $('.WarningMessage')[0].innerHTML + '"';
                if ( content == getValue( "warningMessageContent" ) ) {
                    // Mouse Events vorbereiten für Warnmeldung temporär anzuzeigen und wieder zu verbergen.
                    warnMessagePrepareMouseEvents();
                }
                else { 
                    // Button in der Warnmeldung aufbauen (hoffe ich), um Meldung das erste Mal zu verbergen. 
                    var div = document.createElement("div");
                    div.setAttribute("class", "GoAwayWarningMessage");
                    div.setAttribute("title", "Go away message");
                    div.setAttribute("style", "float: right; width: 70px; color: rgb(255, 255, 255); box-sizing: border-box; border: 2px solid rgb(255, 255, 255); opacity: 0.7; cursor: pointer; border-radius: 3px; margin-right: 2px; margin-top: 2px; text-align: center;");        
                    div.appendChild(document.createTextNode("Go away"));
                    div.addEventListener("click", warnMessageHideAndSave, false);
                    $('.WarningMessage')[0].parentNode.insertBefore(div, $('.WarningMessage')[0]);
                }
            }
        }
    } catch (e) {
        gclh_error("Hide Warning Message", e);
    }
    
// Warnmeldung verbergen und sichern.
    function warnMessageHideAndSave() {
        // Warnmeldung verbergen und Inhalt sichern (mit allem Gedöhns), damit wir beim nächsten mal sofort verbergen können.
        $('.WarningMessage').fadeOut(1000, "linear");
        var content =  '"' + $('.WarningMessage')[0].innerHTML + '"';
        setValue("warningMessageContent", content);
        $('.GoAwayWarningMessage')[0].style.display = "none";

        // Mouse Events vorbereiten für Warnmeldung temporär anzuzeigen und wieder zu verbergen.
        warnMessagePrepareMouseEvents();
    }
// Mouse Events vorbereiten für Warnmeldung temporär anzuzeigen und wieder zu verbergen. 
    function warnMessagePrepareMouseEvents() {    
        // Balken im rechten Headerbereich zur erneuten Aktivierung der Warnmeldung.
        var divShow = document.createElement("div");
        divShow.setAttribute("class", "ShowWarningMessage");   
        divShow.setAttribute("style", "z-index: 1004; float: right; right: 0px; width: 6px; background-color: rgb(224, 183, 10); height: 65px; position: absolute;");        
        $('.WarningMessage')[0].parentNode.insertBefore(divShow, $('.WarningMessage')[0]);

        // Bereich für die Aufnahme des Mouseout Events, um die Warnmeldung wieder zu verbergen. Das ist notwendig, weil die eigentliche Warnmeldung 
        // nicht durchgängig vorhanden ist (padding) und nicht klar ist, wie eine Warnmelung morgen aussieht. 
        var divHide = document.createElement("div");
        divHide.setAttribute("class", "HideWarningMessage");   
        divHide.setAttribute("style", "z-index: 1004; height: 110px; position: absolute; right: 0px; left: 0px;");        
        $('.WarningMessage')[0].parentNode.insertBefore(divHide, $('.WarningMessage')[0]);
        
        // Anfangszustand herstellen wie bei Mouseout Event, also verbergen. 
        warnMessageMouseOut();
    }  
// Warnmeldung temporär wieder anzeigen.
    function warnMessageMouseOver() {
        $('.ShowWarningMessage')[0].style.display = "none";
        $('.WarningMessage')[0].style.display = "";
        $('.HideWarningMessage')[0].style.display = "";
        $('.HideWarningMessage')[0].addEventListener("mouseout", warnMessageMouseOut, false);
    }    
// Warnmeldung wieder verbergen.
    function warnMessageMouseOut() {
        $('.WarningMessage')[0].style.display = "none";
        $('.HideWarningMessage')[0].style.display = "none";
        $('.ShowWarningMessage')[0].style.display = "";
        $('.ShowWarningMessage')[0].addEventListener("mouseover", warnMessageMouseOver, false);
    }    

// Überblicks Karte der Cache Lokation oben rechts im Cache Listing eingebaut.
    try {
        if ( settings_map_overview_build && is_page("cache_listing") && document.getElementById("ctl00_ContentBody_detailWidget") ) {
            var side = document.getElementById("ctl00_ContentBody_detailWidget");
            var box = document.createElement("div");
            var body = document.createElement("div");
            var map = document.createElement("div");
            var zoomControl = document.createElement("div");
            var zoomPlus = document.createElement("img");
            var zoomMinus = document.createElement("img");

            box.setAttribute("class", "CacheDetailNavigationWidget");
            box.setAttribute("style", "margin-top: 1.5em;");
            body.setAttribute("id", "gclh_map_overview");
            body.setAttribute("class", "WidgetBody");
            body.setAttribute("style", "padding: 0;");
            map.setAttribute("id", "gclh_map_static_values"); 
            map.setAttribute("style", "height: 248px; width: 248px;");  
            [ map.style.backgroundImage, map.value ] = buildMapValues( settings_map_overview_zoom );
            zoomControl.setAttribute("style", "padding: 3px 0px 0px 3px; width: 16px; float: left;");
            zoomPlus.setAttribute("style", "opacity: 0.75; cursor: pointer;");
            zoomPlus.setAttribute("title", "Zoom in");
            zoomPlus.src = "https://www.geocaching.com/images/zoom_in.png";
            zoomPlus.addEventListener('click', mapZoomIn, false);
            zoomMinus.setAttribute("style", "opacity: 0.75; cursor: pointer;");
            zoomMinus.setAttribute("title", "Zoom out");
            zoomMinus.src = "https://www.geocaching.com/images/zoom_out.png";
            zoomMinus.addEventListener('click', mapZoomOut, false);

            zoomControl.appendChild(zoomPlus);
            zoomControl.appendChild(zoomMinus);
            map.appendChild(zoomControl);
            body.appendChild(map);
            box.appendChild(body);
            side.parentNode.insertBefore(box, side);
        }
    } catch (e) {
        gclh_error("build map overview", e);
    }
    
// Url und Zoomwert für die Überblicks Karte aufbauen.     
    function buildMapValues( zoom_value ) {
        var coords = new Array("", "");
        var gc_type = "";

        if ( zoom_value < 1 ) zoom_value = 1;
        if ( zoom_value > 19 ) zoom_value = 19;

        if ( document.getElementById('uxLatLon') ) var coords = toDec(document.getElementById("uxLatLon").innerHTML);
//--> $$069FE Begin of change
//        if ( $("img:first", "a[href='/about/cache_types.aspx']")[0] ) {
//            var src_arr = $("img:first", "a[href='/about/cache_types.aspx']").attr("src").split("/");
        if ( $(".cacheImage").find("img").attr("src") ) {
            var src_arr = $(".cacheImage").find("img").attr("src").split("/");
//<-- $$069FE End of change
            var gc_type = src_arr[src_arr.length - 1].split(".")[0];
        }
        var url = 'url(' + http + '://maps.google.com/maps/api/staticmap?zoom=' + zoom_value + '&size=248x248' + '&maptype=roadmap&' 
                + 'markers=icon:http://www.geocaching.com/images/wpttypes/pins/' + gc_type + '.png' + '|' + coords[0] + ',' + coords[1] + ')';
        return [ url, zoom_value ];                    
    }
// In Karte hinein zoomen.
    function mapZoomIn() {
        if ( document.getElementById("gclh_map_static_values") ) {
            var map = document.getElementById("gclh_map_static_values");
            [ map.style.backgroundImage, map.value ] = buildMapValues( parseInt(map.value) + 1 );
        }
    }
// Aus Karte heraus zoomen.
    function mapZoomOut() {
        if ( document.getElementById("gclh_map_static_values") ) {
            var map = document.getElementById("gclh_map_static_values");
            [ map.style.backgroundImage, map.value ] = buildMapValues( parseInt(map.value) - 1 );
        }
    }
    
// Aplly Search Field in Navigation
    try {
        if ( document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/nearest\.aspx\?navi_search=/) ) {
            var matches = document.location.href.match(/\?navi_search=(.*)/);
            if (matches) {
                document.getElementById("ctl00_ContentBody_LocationPanel1_OriginText").value = urldecode(matches[1]).replace(/%20/g, " ");
                
                function click_search() {
                    document.getElementById("ctl00_ContentBody_LocationPanel1_btnLocale").click();
                }
                window.addEventListener("load", click_search, false);
            }
        }
    } catch (e) {
        gclh_error("Apply the Search", e);
    }

// Show Favourite percentage.
    try {
        if (settings_show_fav_percentage && is_page("cache_listing")) {
            function gclh_load_score( waitCount ) {
                unsafeWindow.showFavoriteScore();

                if ( document.getElementsByClassName("favorite-container")[0] &&
                     document.getElementsByClassName("favorite-score")[0].innerHTML.match("%") &&
                     document.getElementsByClassName("favorite-dropdown")[0]                      ) {

                    // Box mit Schleifchen/Herz, Anzahl Favoriten, Text "Favorites" und Drop-Down-Pfeil.                       
                    var fav = document.getElementsByClassName("favorite-container")[0];
                    if (fav) {
                        // Prozentzahl und Text.
                        var score = document.getElementsByClassName("favorite-score")[0].innerHTML.match(/(.*%)\.*/);
                        if (score && score[1]) {
                            // Eigener Favoritenpunkt. Wenn class hideMe vorhanden ist, dann habe ich keinen                   
                            // Favoritenpunkt vergeben. Ist sie nicht vorhanden, dann habe ich einen Favoritenpunkt vergeben.  
                            var myfav = document.getElementById("pnlFavoriteCache");
                            var myfavHTML = "";
                            if (myfav) {
                                if (myfav.className.match("hideMe")) {
                                    myfavHTML = '&nbsp;<img src="' + http + '://www.geocaching.com/images/icons/reg_user.gif" />';
                                } else {
                                    myfavHTML = '&nbsp;<img src="' + http + '://www.geocaching.com/images/icons/prem_user.gif" />';
                                }
                            }
                            
                            // Favoritenbox ändern.
                            fav.getElementsByTagName("span")[0].nextSibling.remove();  // Text Favoriten
                            fav.innerHTML += score[1];
                            fav.innerHTML += myfavHTML;
                            // Dropdown anpassen.
                            if ( document.getElementsByClassName("favorite-dropdown")[0] ) {
                                var dd = document.getElementsByClassName("favorite-dropdown")[0];
                                dd.style.borderTop = "1px solid #f0edeb";
                                dd.style.borderTopLeftRadius = "5px";
                                dd.style.minWidth = "190px";
                            }
                        }
                    }
                } else {
                    waitCount++;
                    if ( waitCount <= 100 ) {  // 10 Sekunden lang
                        setTimeout( function () { gclh_load_score( waitCount ) }, 100); 
                    } else return;
                }
            }
            gclh_load_score( 0 );
        }
    } catch (e) {
        gclh_error("Show Favourite percentage", e);
    }

// Show Real Owner
    try {
        if (is_page("cache_listing") && document.getElementById("ctl00_ContentBody_mcd1")) {
            var real_owner = get_real_owner();
            var owner_link = false;
            var links = document.getElementById("ctl00_ContentBody_mcd1").getElementsByTagName("a");
            for (var i = 0; i < links.length; i++) {
                if (links[i].href.match(/\/profile\/\?guid\=/)) {
                    owner_link = links[i];
                    break;
                }
            }

            if (owner_link && real_owner) {
                var pseudo = owner_link.innerHTML;
                if (settings_show_real_owner) {
                    owner_link.innerHTML = real_owner;
                    owner_link.title = pseudo;
                } else {
                    owner_link.innerHTML = pseudo;
                    owner_link.title = real_owner;
                }
            }
        }
    } catch (e) {
        gclh_error("Show Real Owner", e);
    }

// Highlight related web page link
    try {
        if (is_page("cache_listing") && document.getElementById("ctl00_ContentBody_uxCacheUrl")) {
            var lnk = document.getElementById("ctl00_ContentBody_uxCacheUrl");

            var html = "<fieldset class=\"DisclaimerWidget\">";
            html += "  <legend class=\"warning\">Please note</legend>";
            html += "  <p class=\"NoBottomSpacing\">";
            html += lnk.parentNode.innerHTML;
            html += "  </p>";
            html += "</fieldset>";

            lnk.parentNode.innerHTML = html;
        }
    } catch (e) {
        gclh_error("Highlight Related Web page", e);
    }

// Show other Coord-Formats in Listing
    try {
        if (is_page("cache_listing") && document.getElementById('uxLatLon')) {
            var box = document.getElementById('ctl00_ContentBody_LocationSubPanel'); //.childNodes[0];
            box.innerHTML = box.innerHTML.replace("<br>", "");
            var coords = document.getElementById('uxLatLon').innerHTML;
            var dec = toDec(coords);
            var lat = dec[0];
            var lng = dec[1];
            if (lat < 0) lat = "S " + (lat * -1);
            else lat = "N " + lat;
            if (lng < 0) lng = "W " + (lng * -1);
            else lng = "E " + lng;
            box.innerHTML += " - Dec: " + lat + " " + lng;

            var dms = DegtoDMS(coords);
            box.innerHTML += " - DMS: " + dms;

            box.innerHTML = "<font style='font-size: 10px;'>" + box.innerHTML + "</font><br>";
        }
        // ... and on print-page
        if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/cdpf\.aspx/)) {
            var box = getElementsByClass("UTM Meta")[0];
            var coords = getElementsByClass("LatLong Meta")[0];
            if (box && coords) {
                var match = coords.innerHTML.match(/((N|S) [0-9][0-9]. [0-9][0-9]\.[0-9][0-9][0-9] (E|W) [0-9][0-9][0-9]. [0-9][0-9]\.[0-9][0-9][0-9])/);
                if (match && match[1]) {
                    coords = match[1];
                    var dec = toDec(coords);
                    var lat = dec[0];
                    var lng = dec[1];
                    if (lat < 0) lat = "S " + (lat * -1);
                    else lat = "N " + lat;
                    if (lng < 0) lng = "W " + (lng * -1);
                    else lng = "E " + lng;
                    box.innerHTML += "<br>Dec: " + lat + " " + lng;

                    var dms = DegtoDMS(coords);
                    box.innerHTML += "<br>DMS: " + dms;
                }
            }
        }
    } catch (e) {
        gclh_error("Show other coord-formats", e);
    }

// Show Map-It button at Listing
    try {
        if (is_page("cache_listing") && document.getElementById('uxLatLon')) {
            var coords = toDec(document.getElementById("uxLatLon").innerHTML);
            var link;
            if (document.getElementById("uxLatLonLink") != null) { //If server deliver userDefinedCoords.status="fail", then link will be null
                link = document.getElementById("uxLatLonLink").parentNode;
            }
            else {
                link = document.getElementById("uxLatLon").parentNode;
            }
            var a = document.createElement("a");
            var small = document.createElement("small");
            a.setAttribute("href", map_url + "?ll=" + coords[0] + "," + coords[1]);
            a.appendChild(document.createTextNode("Map this Location"));
            small.appendChild(document.createTextNode(" - "));
            small.appendChild(a);
            link.appendChild(small);
        }
    } catch (e) {
        gclh_error("Map It Button", e);
    }

//--> $$067FE Begin of insert
//--> $$071FE Begin of change (Größere Anpassungen ohne zeilenweise Änderungsdokumentation.)
// Show the latest logs symbols in cache listings.
    try {
        if ( is_page("cache_listing") && settings_show_latest_logs_symbols && settings_load_logs_with_gclh ) {
            function showLatestLogsSymbols( waitCount ) {
                var logs = $(('#cache_logs_table', '#cache_logs_table2')).find('tbody tr.log-row'); 
                if ( logs.length > 0 ) {
                    var lateLogs = new Array();
                    for (var i = 0; i < logs.length; i++) {
                        if ( settings_show_latest_logs_symbols_count == i ) break;
                        var lateLog = new Object();
                        lateLog['user'] = $(logs[i]).find('.logOwnerProfileName').find('a[href*="/profile/?guid="]').text();
                        lateLog['id'] = $(logs[i]).find('.logOwnerProfileName').find('a[href*="/profile/?guid="]').attr('id');
                        lateLog['src'] = $(logs[i]).find('.LogType').find('img[src*="/images/logtypes/"]').attr('src');
                        lateLog['type'] = $(logs[i]).find('.LogType').find('img[src*="/images/logtypes/"]').attr('title');
                        lateLog['date'] = $(logs[i]).find('.LogDate').text();
                        lateLog['log'] = $(logs[i]).find('.LogContent').children().clone();
                        lateLogs[i] = lateLog;
                    }
                    if ( lateLogs.length > 0 && document.getElementById("ctl00_ContentBody_mcd1").parentNode ) {
                        var side = document.getElementById("ctl00_ContentBody_mcd1").parentNode;
                        side.style.display = "initial";
                        var div = document.createElement("div");
                        var divTitle = "";
                        div.id = "gclh_latest_logs";
                        div.setAttribute("style", "float: right; padding-right: 0; padding-top: 2px;");
                        div.appendChild(document.createTextNode("Latest logs:"));
                        for (var i = 0; i < lateLogs.length; i++) {
                            var a = document.createElement("a");
                            a.className = "gclh_latest_log";
                            a.href = "#" + lateLogs[i]['id'];
                            var img = document.createElement("img");
                            img.src = lateLogs[i]['src'];
                            img.setAttribute("style", "padding-left: 2px; vertical-align: bottom;");
                            img.title = img.alt = "";
                            var log_text = document.createElement("span");
                            log_text.title = "";
                            log_text.innerHTML = "<img src='" + lateLogs[i]['src'] + "'> <b>" + lateLogs[i]['user'] + " - " + lateLogs[i]['date'] + "</b><br/>";
                            a.appendChild(img);
                            for (var j = 1; j < lateLogs[i]['log'].length; j++) {
                                log_text.appendChild(lateLogs[i]['log'][j]);
                            }
                            a.appendChild(log_text);
                            div.appendChild(a);
                            divTitle += ( divTitle == "" ? "" : "\n" ) + lateLogs[i]['type'] + " - " + lateLogs[i]['date'] + " - " + lateLogs[i]['user'];
                        }
                        div.title = divTitle;
                        side.appendChild(div);
                        
                        if ( getValue("settings_new_width") > 0 ) var new_width = parseInt( getValue("settings_new_width") ) - 310 - 180;
                        else var new_width = 950 - 310 - 180;
                        var css = "a.gclh_latest_log:hover {position: relative;}"
                                + "a.gclh_latest_log span {display: none; position: absolute; left: -" + new_width + "px; width: " + new_width + "px;"
                                +     " padding: 5px; text-decoration:none; text-align:left; vertical-align:top; color: #000000;}"
                                + "a.gclh_latest_log:hover span {font-size: 13px; display: block; top: 16px; border: 1px solid #8c9e65;"
                                +     " background-color:#dfe1d2; z-index:10000;}";
                        appendCssStyle(css);
                    }
                } else {
                    waitCount++;
                    if ( waitCount <= 100 ) {  // 50 Sekunden lang (Beispiel: GC4MEGA mit ~ 40 Sekunden)
                        setTimeout( function () { showLatestLogsSymbols( waitCount ) }, 500); 
                    } else return;
                }
            }
            showLatestLogsSymbols( 0 );
        }
    } catch (e) {
        gclh_error("Show the latest logs symbols", e);
    }
//<-- $$071FE End of change
//<-- $$067FE End of insert

// Map on create pocketQuery-page
    try {
        if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/pocket\/gcquery\.aspx/)) {
            $('.LatLongTable').after('<img style="position:absolute;top: 8px; left: 300px;height:350px;width:450px;" id="gclh_map">').parent().css("style", "relative");
            $('.LatLongTable input').change(function () {
                var coordType = document.getElementsByName("ctl00$ContentBody$LatLong")[0].value;
                var northField = $('#ctl00_ContentBody_LatLong\\:_selectNorthSouth')[0];
                var northSouth = $(northField.options[northField.selectedIndex]).text().replace('.', '');
                var westField = $('#ctl00_ContentBody_LatLong\\:_selectEastWest')[0];
                var westEast = $(westField.options[westField.selectedIndex]).text().replace('.', '');

                var lat = "";
                var lng = "";
                switch (coordType) {
                    case "2": //DMS
                        lat = northSouth + " " + $('#ctl00_ContentBody_LatLong__inputLatDegs')[0].value + " " + $('#ctl00_ContentBody_LatLong__inputLatMins')[0].value + ' ' + $('#ctl00_ContentBody_LatLong__inputLatSecs')[0].value;
                        lng = westEast + " " + $('#ctl00_ContentBody_LatLong__inputLongDegs')[0].value + " " + $('#ctl00_ContentBody_LatLong__inputLongMins')[0].value + ' ' + $('#ctl00_ContentBody_LatLong__inputLongSecs')[0].value;
                        var converted = toDec(lat + " " + lng);
                        lat = converted[0];
                        lng = converted[1];
                        break;
                    case "1": //MinDec
                        lat = northSouth + " " + $('#ctl00_ContentBody_LatLong__inputLatDegs')[0].value + " " + $('#ctl00_ContentBody_LatLong__inputLatMins')[0].value;
                        lng = westEast + " " + $('#ctl00_ContentBody_LatLong__inputLongDegs')[0].value + " " + $('#ctl00_ContentBody_LatLong__inputLongMins')[0].value;
                        var converted = toDec(lat + " " + lng);
                        lat = converted[0];
                        lng = converted[1];
                        break;
                    case "0": //DegDec
                        lat = (northSouth == "S" ? "-" : "") + $('#ctl00_ContentBody_LatLong__inputLatDegs')[0].value;
                        lng = (westEast == "W" ? "-" : "") + $('#ctl00_ContentBody_LatLong__inputLongDegs')[0].value;
                        break;
                }
                $('#gclh_map').attr("src", 'http://staticmap.openstreetmap.de/staticmap.php?center=' + lat + ',' + lng + '&zoom=15&size=450x350&markers=' + lat + ',' + lng + ',ol-marker');
            });
            $('.LatLongTable input').change();
        }
    } catch (e) {
        gclh_error("map on create pocketQuery page", e);
    }

// Name for PocketQuery from Bookmark
    try {
        if ((document.location.href.match(/^https?:\/\/www\.geocaching\.com\/pocket\/bmquery\.aspx/)) && document.getElementById("ctl00_ContentBody_lnkListName")) {
            document.getElementById('ctl00_ContentBody_tbName').value = document.getElementById("ctl00_ContentBody_lnkListName").innerHTML;
            document.getElementById('ctl00_ContentBody_cbIncludePQNameInFileName').checked = true;
        }
    } catch (e) {
        gclh_error("PQ-Name from Bookmark", e);
    }

// Show refresh button for PocketQuery Page
    try {
        if ((document.location.href.match(/^https?:\/\/www\.geocaching\.com\/pocket/)) && document.getElementById("uxCreateNewPQ")) {
            document.getElementById('uxCreateNewPQ').parentNode.parentNode.parentNode.innerHTML += "<p><a href='" + http + "://www.geocaching.com/pocket/default.aspx' title='Refresh Page'>Refresh Page</a></p>";
        }
    } catch (e) {
        gclh_error("Refresh button on PQ-Page", e);
    }

// Highlight column of current day on PocketQuery Page
    try {
        if ((document.location.href.match(/^https?:\/\/www\.geocaching\.com\/pocket/)) && document.getElementById("ActivePQs")) {
            var matches = document.getElementById('ActivePQs').childNodes[1].innerHTML.match(/([A-Za-z]*),/);
            if (matches) {
                var highlight = 0;
                switch (matches[1]) {
                    case "Sunday":
                        highlight = 11;
                        break;
                    case "Monday":
                        highlight = 13;
                        break;
                    case "Tuesday":
                        highlight = 15;
                        break;
                    case "Wednesday":
                        highlight = 17;
                        break;
                    case "Thursday":
                        highlight = 19;
                        break;
                    case "Friday":
                        highlight = 21;
                        break;
                    case "Saturday":
                        highlight = 23;
                        break;
                }

                if (highlight > 0) {
                    var trs = document.getElementById("pqRepeater").getElementsByTagName("tr");

                    for (var i = 0; i < trs.length; i++) {
                        if (i == (trs.length - 1)) highlight -= 4;
                        trs[i].childNodes[highlight].style.backgroundColor = "#E3DDC2";
                    }
                }
            }
        }
    } catch (e) {
        gclh_error("Highlight column on PQ-Page", e);
    }

// Fixed header for PocketQuery
    try {
        if (settings_fixed_pq_header && document.location.href.match(/^https?:\/\/www\.geocaching\.com\/pocket/) && document.getElementById("pqRepeater")) {
            //scrolify based on http://stackoverflow.com/questions/673153/html-table-with-fixed-headers
            function scrolify(tblAsJQueryObject, height) {
                var oTbl = window.$(tblAsJQueryObject);

                // for very large tables you can remove the four lines below
                // and wrap the table with <div> in the mark-up and assign
                // height and overflow property

                var oTblDiv = window.$("<div/>");
                oTblDiv.css('height', height);
                oTblDiv.css('overflow-y', 'auto');
                oTblDiv.css("margin-bottom", oTbl.css("margin-bottom"));
                oTbl.css("margin-bottom", "0px")
                oTbl.wrap(oTblDiv);

                // save original width
                oTbl.attr("data-item-original-width", oTbl.width());
                oTbl.find('thead tr td').each(function () {
                    window.$(this).attr("data-item-original-width", (unsafeWindow || window).$(this).width());
                });
                oTbl.find('tbody tr:eq(0) td').each(function () {
                    window.$(this).attr("data-item-original-width", (unsafeWindow || window).$(this).width());
                });


                // clone the original table
                var newTbl = oTbl.clone();

                // remove table header from original table
                oTbl.find('thead tr').remove();
                // remove table body from new table
                newTbl.find('tbody tr').remove();

                oTbl.parent().before(newTbl);
                newTbl.wrap("<div/>");

                // replace ORIGINAL COLUMN width
                newTbl.width(newTbl.attr('data-item-original-width'));
                newTbl.find('thead tr td').each(function () {
                    window.$(this).width(window.$(this).attr("data-item-original-width"));
                });
                oTbl.width(oTbl.attr('data-item-original-width'));
                oTbl.find('tbody tr:eq(0) td').each(function () {
                    window.$(this).width(window.$(this).attr("data-item-original-width"));
                });
            }

            if (browser === "firefox") {
                exportFunction(scrolify, unsafeWindow, {defineAs: "scrolify"});
                unsafeWindow.scrolify(unsafeWindow.$('#pqRepeater'), 300);
            }
            else {

                scrolify(unsafeWindow.$('#pqRepeater'), 300);
            }

            unsafeWindow.$('#ActivePQs').css("padding-right", "0px");
        }
    } catch (e) {
        gclh_error("Fixed header for PocketQuery", e);
    }

// Sum up all FP and BM entries on public profile pages
    try {
        if (is_page("publicProfile")) {
            $('#ctl00_ContentBody_ProfilePanel1_pnlBookmarks h3').each(function (i, e) {
                $(e).text($(e).text() + ' (' + $(e).next().find('tbody tr').length + ')');
            });
        }
    } catch (e) {
        gclh_error("Sum up all FP and BM entries on public profile pages", e);
    }

// Redirect to Map (von Search Liste direkt in Karte springen)
    if (settings_redirect_to_map && document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/nearest\.aspx\?/)) {
        if (!document.location.href.match(/&disable_redirect/) && !document.location.href.match(/key=/) && !document.location.href.match(/ul=/) && document.getElementById('ctl00_ContentBody_LocationPanel1_lnkMapIt')) {
            document.getElementById('ctl00_ContentBody_LocationPanel1_lnkMapIt').click();
        }
    }

// Hide Facebook
    try {
        if (settings_hide_facebook) {
            if (document.getElementById('ctl00_uxSignIn')) {
                document.getElementById('ctl00_uxSignIn').parentNode.style.display = "none";
            }
            if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/login(.*)/) && document.getElementById("ctl00_ContentBody_LoginPanel")) {
                var loginpanelfb = getElementsByClass("LoginWithFacebook")[0];
                loginpanelfb.parentNode.removeChild(loginpanelfb);
            }
        }
    } catch (e) {
        gclh_error("Hide Facebook", e);
    }

// Hide Socialshare
    try {
        if (settings_hide_socialshare && document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/log\.aspx?(.*)/) && document.getElementById('sharing_container')) {
            var socialshare = document.getElementById('sharing_container');
            socialshare.style.display = "none";
        }
        if (settings_hide_socialshare && document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/log\.aspx?(.*)/) && document.getElementById('uxSocialSharing')) {
            var uxSocialSharing = document.getElementById('uxSocialSharing');
            uxSocialSharing.style.display = "none";
        }
    } catch (e) {
        gclh_error("Hide SocialShare", e);
    }

// Activate fancybox for pictures in the description
    try {
        if (is_page("cache_listing") && typeof unsafeWindow.$.fancybox != "undefined") {
            unsafeWindow.$('a[rel="lightbox"]').fancybox();
        }
    } catch (e) {
        gclh_error("Activate fancybox", e);
    }

// Hide Disclaimer
    try {
        if (settings_hide_disclaimer && is_page("cache_listing")) {
            var disc = getElementsByClass('Note Disclaimer')[0]; // New Listing design
            if (disc) {
                disc.parentNode.removeChild(disc);
            } else {
                var disc = getElementsByClass('DisclaimerWidget')[0];
                if (disc) {
                    disc.parentNode.removeChild(disc);
                }
            }
        }
        if (settings_hide_disclaimer && document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/cdpf\.aspx/)) {
            var disc = getElementsByClass('TermsWidget no-print')[0];
            if (disc) {
                disc.parentNode.removeChild(disc);
            }
        }
    } catch (e) {
        gclh_error("Hide Disclaimer", e);
    }

// Hide on print-page
    try {
        if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/cdpf\.aspx/)) {
            document.getElementById("pnlDisplay").removeChild(document.getElementById("Footer"));
        }
    } catch (e) {
        gclh_error("Hide on print-page", e);
    }

// remove paragraph containing the link to the advertisement instructions (not the advertisements itself!)
    try {
        if (settings_hide_advert_link) {
            var links = document.getElementsByTagName('a');
            for (var i = 0; i < links.length; i++) {
                if (links[i].href.indexOf('advertising.aspx') > 0) {
                    var del = links[i];
                    if ( is_page("messagecenter") || document.location.href.match(/^https:\/\/www\.geocaching\.com\/account\/lists/) ) {
                        while (del.parentNode != null && (del.parentNode.nodeName != 'ASIDE')) {
                           del = del.parentNode;
                        }    
                    }
                    else {                    
                        while (del.parentNode != null && (del.parentNode.nodeName != 'P')) {
                            del = del.parentNode;
                        }    
                    }
                    if (del.parentNode) {
                        del.parentNode.removeChild(del);
                    }
                    break;
                }
            }
        }
    } catch (e) {
        gclh_error("Hide Advert-Link", e);
    }

// Improve calendar-Link in Events
    try {
        if (is_page("cache_listing") && document.getElementById("calLinks")) {
            function calendar_link() {
                var div = document.getElementById("calLinks");
                var links = div.getElementsByTagName("a");
                for (var i = 0; i < links.length; i++) {
                    if (links[i].title == "Google") {
                        var link = links[i].href.split("&");
                        var new_link = link[0] + "&" + link[1] + "&" + link[2];

                        var loc = link[4].split("(");

                        new_link += "&" + loc[0].substr(0, loc[0].length - 3) + "&details=" + loc[1].substr(0, loc[1].length - 1) + "&" + link[5];

                        links[i].href = new_link;
                    }
                }
            }

            window.addEventListener("load", calendar_link, false); // Div wird erst nachtraeglich gefuellt, deswegen auf load warten
        }
    } catch (e) {
        gclh_error("improve calendar-link", e);
    }

// remove "Warning! Spoilers may be included in the descriptions or links."
    try {
        if (settings_hide_spoilerwarning && is_page("cache_listing")) {
            var findCounts = document.getElementById('ctl00_ContentBody_lblFindCounts');
            if (findCounts) {
                var para = findCounts.nextSibling.nextSibling.nextSibling.nextSibling;
                if (para && para.nodeName == 'P') {
                    para.innerHTML = "&nbsp;";
                    para.style.height = "0";
                    para.className = para.className + ' Clear';
                    //get more space for links, when spoiler is hidden
                    document.getElementById('ctl00_ContentBody_uxLogbookLink').parentNode.style.width = "100%";
                }
            }
        }
    } catch (e) {
        gclh_error("Hide spoilerwarning", e);
    }

// Hide Cache Notes
    try {
        if (settings_hide_cache_notes && is_page("cache_listing")) {
            var disc = getElementsByClass('NotesWidget')[0];
            if (disc) {
                disc.parentNode.removeChild(disc);
            } else {
                var disc = getElementsByClass('Note PersonalCacheNote')[0]; // New Listing design
                if (disc) {
                    disc.parentNode.removeChild(disc);
                }
            }
        }
    } catch (e) {
        gclh_error("Hide Cache Notes (COMPLETE)", e);
    }

// Hide/Show Cache Notes
    try {
        if (settings_hide_empty_cache_notes && !settings_hide_cache_notes && is_page("cache_listing")) {
            var box = getElementsByClass('NotesWidget')[0];
            if (!box) box = getElementsByClass('Note PersonalCacheNote')[0]; // New Listing design
            if (box) {
                var description = decode_innerHTML( box.getElementsByTagName("strong")[0] );
                var description = description.replace(":", "");
                var code =
                    "function hide_notes() {" +
                    "  if(document.getElementById('box_notes').style.display == 'none') {" +
                    "    document.getElementById('box_notes').style.display = 'block';" +
                    "    if ( document.getElementById('show_hide_personal_cache_notes') ) {" +
                    "      document.getElementById('show_hide_personal_cache_notes').innerHTML = 'Hide " + description + "'" +
                    "    }" +
                    "  } else {" +
                    "    document.getElementById('box_notes').style.display = 'none';" +
                    "    if ( document.getElementById('show_hide_personal_cache_notes') ) {" +
                    "      document.getElementById('show_hide_personal_cache_notes').innerHTML = 'Show " + description + "'" +
                    "    }" +
                    "  }" +
                    "}";

                var script = document.createElement("script");
                script.innerHTML = code;
                document.getElementsByTagName("body")[0].appendChild(script);

                box.setAttribute("id", "box_notes");
                var link = document.createElement("font");
                link.innerHTML = "<a id='show_hide_personal_cache_notes' href='javascript:void(0);' onClick='hide_notes();'>Hide " + description + "</a>";
                link.setAttribute("style", "font-size: 12px;");
                box.parentNode.insertBefore(link, box);

                function hide_on_load() {
                    var notes = getElementsByClass('NotesWidget')[0];
                    if (!notes) notes = getElementsByClass('Note PersonalCacheNote')[0]; // New Listing design
                    var notesText = document.getElementById("cache_note").innerHTML;
                    if (notesText != null && (notesText == "Click to enter a note" || notesText == "Klicken zum Eingeben einer Notiz")) {
                        notes.style.display = "none";
                        if ( document.getElementById('show_hide_personal_cache_notes') ) { 
                            document.getElementById('show_hide_personal_cache_notes').innerHTML = 'Show ' + description;
                        }
                    }
                }

                window.addEventListener("load", hide_on_load, false);
            }
        }
    } catch (e) {
        gclh_error("Hide Cache Notes", e);
    }

// Hide Hint
    try {
        if (settings_hide_hint && is_page("cache_listing")) {
            //replace hint by a link which shows the hint dynamically
            var hint = document.getElementById('div_hint');
            if (hint) {
                var para = hint.previousSibling; // Neues Listing-Layout
                if (para.nodeName != "P") para = hint.previousSibling.previousSibling; // Altes Layout

                if (para && para.nodeName == 'P') {
                    if (trim(hint.innerHTML).length > 0) {
                        var label = para.getElementsByTagName('strong')[0];
                        var code =
                            "function hide_hint() {" +
                            "  var hint = document.getElementById('div_hint');" +
                            "  if(hint.style.display == 'none') {" +
                            "    hint.style.display = 'block';" +
                            "    if ( document.getElementById('ctl00_ContentBody_lnkDH') ) {" +
                            "      document.getElementById('ctl00_ContentBody_lnkDH').innerHTML = 'Hide'" +
                            "    }" +
                            "  } else {" +
                            "    hint.style.display = 'none';" +
                            "    if ( document.getElementById('ctl00_ContentBody_lnkDH') ) {" +
                            "      document.getElementById('ctl00_ContentBody_lnkDH').innerHTML = 'Show'" +
                            "    }" +
                            "  }" +
                            "    hint.innerHTML = convertROTStringWithBrackets(hint.innerHTML);" +
                            "  return false;" +
                            "}";

                        var script = document.createElement("script");
                        script.innerHTML = code;
                        document.getElementsByTagName("body")[0].appendChild(script);
                        if ( document.getElementById("ctl00_ContentBody_lnkDH") ) {
                            var link = document.getElementById("ctl00_ContentBody_lnkDH");
                            link.setAttribute('onclick', 'hide_hint();');
                            link.setAttribute('title', 'Show/Hide ' + decode_innerHTML(label));
                            link.setAttribute('href', 'javascript:void(0);');
                            link.setAttribute('style', 'font-size: 12px;');
                            link.innerHTML = 'Show';
                        }
                        hint.style.marginBottom = '1.5em';
                    }
                    hint.style.display = 'none';

                    // remove hint description
                    var decryptKey = document.getElementById('dk');
                    if (decryptKey) {
                        decryptKey.parentNode.removeChild(decryptKey);
                    }
                }
            }
        }
    } catch (e) {
        gclh_error("Hide Hint", e);
    }

// Show disabled/archived caches with strikeout in title
    try {
        if (settings_strike_archived && is_page("cache_listing")) {
            var warnings = getElementsByClass('OldWarning');
            if (warnings[0]) {
                var cacheTitle = document.getElementById('ctl00_ContentBody_CacheName');
                if (cacheTitle) {
                    var parent = cacheTitle.parentNode;
                    if (parent) {
                        parent.removeChild(cacheTitle);
                        var strike = document.createElement('strike');
                        parent.appendChild(strike);
                        strike.appendChild(cacheTitle);
                    }
                }
            }
        }
    } catch (e) {
        gclh_error("Strike Archived", e);
    }

// Highlight Usercoords
    try {
//--> $$#14FE Begin of change
        if ( is_page("cache_listing") ) {
            var css = (settings_highlight_usercoords ? ".myLatLon{ color: #FF0000; " : ".myLatLon{ color: unset; ") 
                    + (settings_highlight_usercoords_bb ? "border-bottom: 2px solid #999; " : "border-bottom: unset; ")
                    + (settings_highlight_usercoords_it ? "font-style: italic; }" : "font-style: unset; }");
            appendCssStyle(css);
        }
//<-- $$#14FE End of change
    } catch (e) {
        gclh_error("Highlight Usercoords", e);
    }

// Decrypt Hint
    try {
        if (settings_decrypt_hint && !settings_hide_hint && is_page("cache_listing")) {
            if (document.getElementById('ctl00_ContentBody_EncryptionKey')) {
                if (browser == "chrome") {
                    injectPageScript("(function(){ dht(); })()");
                }
                else {
                    unsafeWindow.dht(document.getElementById("ctl00_ContentBody_lnkDH"));
                }

                // remove hint description
                var decryptKey = document.getElementById('dk');
                if (decryptKey) {
                    decryptKey.parentNode.removeChild(decryptKey);
                }
            }
        }
        if (settings_decrypt_hint && document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/cdpf\.aspx/)) {
            if (document.getElementById('uxDecryptedHint')) document.getElementById('uxDecryptedHint').style.display = 'none';
            if (document.getElementById('uxEncryptedHint')) document.getElementById('uxEncryptedHint').style.display = '';
        }
    } catch (e) {
        gclh_error("Decrypt Hint", e);
    }

// BBCode helper function
    function gclh_add_insert_fkt(id) {
        var code = "function gclh_insert(aTag,eTag){"; // http://aktuell.de.selfhtml.org/artikel/javascript/bbcode/
        code += "  var input = document.getElementById('" + id + "');";
        code += "  if(typeof input.selectionStart != 'undefined'){";
        code += "    var start = input.selectionStart;";
        code += "    var end = input.selectionEnd;";
        code += "    var insText = input.value.substring(start, end);";
        code += "    input.value = input.value.substr(0, start) + aTag + insText + eTag + input.value.substr(end);";
        code += "    /* Anpassen der Cursorposition */";
        code += "    var pos;";
        code += "    if (insText.length == 0) {";
        code += "      pos = start + aTag.length;";
        code += "    } else {";
        code += "      pos = start + aTag.length + insText.length + eTag.length;";
        code += "    }";
        code += "    input.selectionStart = pos;";
        code += "    input.selectionEnd = pos;";
        code += "  }";
        code += "  input.focus();";
        code += "}";

        var script = document.createElement("script");
        script.innerHTML = code;
        document.getElementsByTagName("body")[0].appendChild(script);
    }

// Show Smilies & BBCode --- http://www.cachewiki.de/wiki/Formatierung
    try {
        if (settings_show_bbcode && (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/log\.aspx\?(id|guid|ID|wp|LUID|PLogGuid)\=/) || document.location.href.match(/^https?:\/\/www\.geocaching\.com\/track\/log\.aspx\?(id|wid|guid|ID|LUID|PLogGuid)\=/)) && document.getElementById('litDescrCharCount')) {
            // Get finds to replace #found# variable
            finds = get_my_finds();
            // Aktuelles Datum und aktuelle Zeit ermitteln zum Ersetzen von #Date#, #Time# und #DateTime#.
            [ aDate, aTime, aDateTime ] = getDateTime();
            var me = $('.li-user-info').children().first().text();            

            gclh_add_insert_fkt("ctl00_ContentBody_LogBookPanel1_uxLogInfo");

            var code = "function gclh_insert_from_div(id){";
            code += "  var finds = '" + finds + "';";
            code += "  var aDate = '" + aDate + "';";
            code += "  var aTime = '" + aTime + "';";
            code += "  var aDateTime = '" + aDateTime + "';";
            code += "  var me = '" + me + "';";
            code += "  var settings_replace_log_by_last_log = " + settings_replace_log_by_last_log + ";";
            code += "  var owner = document.getElementById('ctl00_ContentBody_LogBookPanel1_WaypointLink').nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerHTML;";
            code += "  var input = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo');";
            code += "  var inhalt = document.getElementById(id).innerHTML;";
            code += "  inhalt = inhalt.replace(/\\&amp\\;/g,'&');";
            code += "  if(finds){";
            code += "    inhalt = inhalt.replace(/#found_no#/g,finds);";
            code += "    finds++;";
            code += "    inhalt = inhalt.replace(/#found#/g,finds);";
            code += "  }";
            code += "  if(aDate){";
            code += "    inhalt = inhalt.replace(/#Date#/ig, aDate);";
            code += "  }";
            code += "  if(aTime){";
            code += "    inhalt = inhalt.replace(/#Time#/ig, aTime);";
            code += "  }";
            code += "  if(aDateTime){";
            code += "    inhalt = inhalt.replace(/#DateTime#/ig, aDateTime);";
            code += "  }";
            code += "  if(me){";
            code += "    inhalt = inhalt.replace(/#me#/g,me);";
            code += "  }";
            code += "  if(owner){";
            code += "    inhalt = inhalt.replace(/#owner#/g,owner);";
            code += "  }";
            code += "  if(id.match(/last_log/) && settings_replace_log_by_last_log){";
            code += "    input.value = inhalt;";
            code += "  }else{";
            code += "    if(typeof input.selectionStart != 'undefined' && inhalt){";
            code += "      var start = input.selectionStart;";
            code += "      var end = input.selectionEnd;";
            code += "      var insText = input.value.substring(start, end);";
            code += "      input.value = input.value.substr(0, start) + inhalt + input.value.substr(end);";
            code += "      /* Anpassen der Cursorposition */";
            code += "      var pos;";
            code += "      pos = start + inhalt.length;";
            code += "      input.selectionStart = pos;";
            code += "      input.selectionEnd = pos;";
            code += "    }";
            code += "  }";
            code += "  input.focus();";
            code += "}";

            var script = document.createElement("script");
            script.innerHTML = code;
            document.getElementsByTagName("body")[0].appendChild(script);

            var box = document.getElementById('litDescrCharCount');
            var liste = "<br><p style='margin: 5px;'>";
            liste += "<a href='#' onClick='gclh_insert(\"[:)]\",\"\"); return false;'><img src='" + http + "://www.geocaching.com/images/icons/icon_smile.gif' border='0'></a>&nbsp;&nbsp;";
            liste += "<a href='#' onClick='gclh_insert(\"[:D]\",\"\"); return false;'><img src='" + http + "://www.geocaching.com/images/icons/icon_smile_big.gif' border='0'></a>&nbsp;&nbsp;";
            liste += "<a href='#' onClick='gclh_insert(\"[8D]\",\"\"); return false;'><img src='" + http + "://www.geocaching.com/images/icons/icon_smile_cool.gif' border='0'></a>&nbsp;&nbsp;";
            liste += "<a href='#' onClick='gclh_insert(\"[:I]\",\"\"); return false;'><img src='" + http + "://www.geocaching.com/images/icons/icon_smile_blush.gif' border='0'></a>&nbsp;&nbsp;";
            liste += "<a href='#' onClick='gclh_insert(\"[:P]\",\"\"); return false;'><img src='" + http + "://www.geocaching.com/images/icons/icon_smile_tongue.gif' border='0'></a>";
            liste += "</p><p style='margin: 5px;'>";
            liste += "<a href='#' onClick='gclh_insert(\"[}:)]\",\"\"); return false;'><img src='" + http + "://www.geocaching.com/images/icons/icon_smile_evil.gif' border='0'></a>&nbsp;&nbsp;";
            liste += "<a href='#' onClick='gclh_insert(\"[;)]\",\"\"); return false;'><img src='" + http + "://www.geocaching.com/images/icons/icon_smile_wink.gif' border='0'></a>&nbsp;&nbsp;";
            liste += "<a href='#' onClick='gclh_insert(\"[:o)]\",\"\"); return false;'><img src='" + http + "://www.geocaching.com/images/icons/icon_smile_clown.gif' border='0'></a>&nbsp;&nbsp;";
            liste += "<a href='#' onClick='gclh_insert(\"[B)]\",\"\"); return false;'><img src='" + http + "://www.geocaching.com/images/icons/icon_smile_blackeye.gif' border='0'></a>&nbsp;&nbsp;";
            liste += "<a href='#' onClick='gclh_insert(\"[8]\",\"\"); return false;'><img src='" + http + "://www.geocaching.com/images/icons/icon_smile_8ball.gif' border='0'></a>";
            liste += "</p><p style='margin: 5px;'>";
            liste += "<a href='#' onClick='gclh_insert(\"[:(]\",\"\"); return false;'><img src='" + http + "://www.geocaching.com/images/icons/icon_smile_sad.gif' border='0'></a>&nbsp;&nbsp;";
            liste += "<a href='#' onClick='gclh_insert(\"[8)]\",\"\"); return false;'><img src='" + http + "://www.geocaching.com/images/icons/icon_smile_shy.gif' border='0'></a>&nbsp;&nbsp;";
            liste += "<a href='#' onClick='gclh_insert(\"[:O]\",\"\"); return false;'><img src='" + http + "://www.geocaching.com/images/icons/icon_smile_shock.gif' border='0'></a>&nbsp;&nbsp;";
            liste += "<a href='#' onClick='gclh_insert(\"[:(!]\",\"\"); return false;'><img src='" + http + "://www.geocaching.com/images/icons/icon_smile_angry.gif' border='0'></a>&nbsp;&nbsp;";
            liste += "<a href='#' onClick='gclh_insert(\"[xx(]\",\"\"); return false;'><img src='" + http + "://www.geocaching.com/images/icons/icon_smile_dead.gif' border='0'></a>";
            liste += "</p><p style='margin: 5px;'>";
            liste += "<a href='#' onClick='gclh_insert(\"[|)]\",\"\"); return false;'><img src='" + http + "://www.geocaching.com/images/icons/icon_smile_sleepy.gif' border='0'></a>&nbsp;&nbsp;";
            liste += "<a href='#' onClick='gclh_insert(\"[:X]\",\"\"); return false;'><img src='" + http + "://www.geocaching.com/images/icons/icon_smile_kisses.gif' border='0'></a>&nbsp;&nbsp;";
            liste += "<a href='#' onClick='gclh_insert(\"[^]\",\"\"); return false;'><img src='" + http + "://www.geocaching.com/images/icons/icon_smile_approve.gif' border='0'></a>&nbsp;&nbsp;";
            liste += "<a href='#' onClick='gclh_insert(\"[V]\",\"\"); return false;'><img src='" + http + "://www.geocaching.com/images/icons/icon_smile_dissapprove.gif' border='0'></a>&nbsp;&nbsp;";
            liste += "<a href='#' onClick='gclh_insert(\"[?]\",\"\"); return false;'><img src='" + http + "://www.geocaching.com/images/icons/icon_smile_question.gif' border='0'></a>";
            liste += "</p><br>";
            liste += "Templates:<br>";
            for (var i = 0; i < anzTemplates; i++) {
                if (getValue("settings_log_template_name[" + i + "]", "") != "") {
                    liste += "<div id='gclh_template[" + i + "]' style='display: none;'>" + getValue("settings_log_template[" + i + "]", "") + "</div>";
                    liste += "<a href='#' onClick='gclh_insert_from_div(\"gclh_template[" + i + "]\"); return false;' style='color: #000000; text-decoration: none; font-weight: normal;'> - " + getValue("settings_log_template_name[" + i + "]", "") + "</a><br>";
                }
            }
            if (getValue("last_logtext", "") != "") {
                liste += "<div id='gclh_template[last_log]' style='display: none;'>" + getValue("last_logtext", "") + "</div>";
                liste += "<a href='#' onClick='gclh_insert_from_div(\"gclh_template[last_log]\"); return false;' style='color: #000000; text-decoration: none; font-weight: normal;'> - [Last Cache-Log]</a><br>";
            }
            box.innerHTML = liste;
        }
    } catch (e) {
        gclh_error("Show Smilies & BBCode", e);
    }

// Maxlength of Logtext and unsaved warning
    try {
        if ((document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/log\.aspx\?(id|guid|ID|wp|LUID|PLogGuid)\=/) || document.location.href.match(/^https?:\/\/www\.geocaching\.com\/track\/log\.aspx\?(id|wid|guid|ID|LUID|PLogGuid)\=/)) && document.getElementById('litDescrCharCount')) {
            var changed = false;

            function limitLogText(limitField) {
                changed = true; // Logtext hat sich geaendert - Warnung beim Seite verlassen
                // aus gc.com Funktion "checkLogInfoLength"
                var editor = $('#ctl00_ContentBody_LogBookPanel1_uxLogInfo');
                var limitNum = parseInt($('#ctl00_ContentBody_LogBookPanel1_uxLogInfo').attr("CKEMaxLength"));
                var length = editor.val().replace(/\n/g, "\r\n").length;
                var diff = length - editor.val().length;
                if (length > limitNum) {
                    limitField.value = limitField.value.substring(0, (limitNum - diff));
                    counterelement.innerHTML = '<font color="red">' + length + '/' + limitNum + '</font>';
                    limitField.scrollTop = limitField.scrollHeight;
                    limitField.selectionStart = 4000;
                    limitField.selectionEnd = 4000;
                } else {
                    counterelement.innerHTML = length + '/' + limitNum;
                }
            }

            // Meldung bei ungespeichertem Log
            window.onbeforeunload = function () {
                if (changed) {
                    return "You have changed a log and haven't saved it yet - Do you want to leave this page and lose your changes?"; // Text wird nicht angezeigt bei FF sondern deren default
                }
            }
            document.getElementById("ctl00_ContentBody_LogBookPanel1_btnSubmitLog").addEventListener("click", function () {
                changed = false;
            }, false); // Damit die Meldung nicht beim Submit kommt

            var logfield = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo');
            logfield.addEventListener("keyup", function () {
                limitLogText(logfield);
            }, false);
            logfield.addEventListener("change", function () {
                limitLogText(logfield);
            }, false);

            var counterpos = document.getElementById('litDescrCharCount').parentNode;
            var counterspan = document.createElement('p');
            counterspan.id = "logtextcounter";
            counterspan.innerHTML = "<b>Loglength:</b><br />";
            var counterelement = document.createElement('span');
            counterelement.innerHTML = "0/4000";
            counterspan.appendChild(counterelement);
            counterpos.appendChild(counterspan);
        }
    } catch (e) {
        gclh_error("Maxlength of Logtext and unsaved warning", e);
    }

// Show Eventday beside Date
    try {
        if (settings_show_eventday && is_page("cache_listing") && document.getElementById('cacheDetails') && document.getElementById('cacheDetails').getElementsByTagName("img")[0].src.match(/.*\/images\/WptTypes\/(6|453|13|7005).gif/)) { //Event, MegaEvent, Cito, GigaEvent
            if (document.getElementById('cacheDetails').getElementsByTagName("span")) {
                var spanelem = document.getElementById("ctl00_ContentBody_mcd2");
                var datetxt = spanelem.innerHTML.substr(spanelem.innerHTML.indexOf(":") + 2).replace(/^\s+|\s+$/g, '');
                var month_names = new Object();
                month_names["Jan"] = 1;
                month_names["Feb"] = 2;
                month_names["Mrz"] = 3;
                month_names["Mar"] = 3;
                month_names["Apr"] = 4;
                month_names["May"] = 5;
                month_names["Jun"] = 6;
                month_names["Jul"] = 7;
                month_names["Aug"] = 8;
                month_names["Sep"] = 9;
                month_names["Oct"] = 10;
                month_names["Nov"] = 11;
                month_names["Dec"] = 12;
                // settings_date_format:
                //   yyyy-MM-dd
                //   yyyy/MM/dd
                //   MM/dd/yyyy
                //   dd/MM/yyyy
                //   dd/MMM/yyyy
                //   MMM/dd/yyyy
                //   dd MMM yy
                var day = 0;
                var month = 0;
                var year = 0;
                switch (settings_date_format) {
                    case "yyyy-MM-dd":
                        var match = datetxt.match(/([0-9]{4})-([0-9]{2})-([0-9]{2})/);
                        if (match) {
                            day = match[3];
                            month = match[2];
                            year = match[1];
                        }
                        break;
                    case "yyyy/MM/dd":
                        var match = datetxt.match(/([0-9]{4})\/([0-9]{2})\/([0-9]{2})/);
                        if (match) {
                            day = match[3];
                            month = match[2];
                            year = match[1];
                        }
                        break;
                    case "MM/dd/yyyy":
                        var match = datetxt.match(/([0-9]{2})\/([0-9]{2})\/([0-9]{4})/);
                        if (match) {
                            day = match[2];
                            month = match[1];
                            year = match[3];
                        }
                        break;
                    case "dd/MM/yyyy":
                        var match = datetxt.match(/([0-9]{2})\/([0-9]{2})\/([0-9]{4})/);
                        if (match) {
                            day = match[1];
                            month = match[2];
                            year = match[3];
                        }
                        break;
                    case "dd/MMM/yyyy":
                        var match = datetxt.match(/([0-9]{2})\/([A-Za-z]{3})\/([0-9]{4})/);
                        if (match) {
                            day = match[1];
                            month = month_names[match[2]];
                            year = match[3];
                        }
                        break;
                    case "MMM/dd/yyyy":
                        var match = datetxt.match(/([A-Za-z]{3})\/([0-9]{2})\/([0-9]{4})/);
                        if (match) {
                            day = match[2];
                            month = month_names[match[1]];
                            year = match[3];
                        }
                        break;
                    case "dd MMM yy":
                        var match = datetxt.match(/([0-9]{2}) ([A-Za-z]{3}) ([0-9]{2})/);
                        if (match) {
                            day = match[1];
                            month = month_names[match[2]];
                            year = parseInt(match[3]) + 2000;
                        }
                        break;
                }

                if (month != 0) month--;
                var d = new Date(year, month, day);
                if (d != "Invalid Date" && !(day == 0 && month == 0 && year == 0)) {
                    var weekday = new Array(7);
                    weekday[0] = "Sunday";
                    weekday[1] = "Monday";
                    weekday[2] = "Tuesday";
                    weekday[3] = "Wednesday";
                    weekday[4] = "Thursday";
                    weekday[5] = "Friday";
                    weekday[6] = "Saturday";
                    var text = " (" + weekday[d.getDay()] + ") ";
                } else var text = " (date format mismatch - see settings) ";
                var text_elem = document.createTextNode(text);
                spanelem.insertBefore(text_elem, spanelem.childNodes[1]);
            }
        }
    } catch (e) {
        gclh_error("Show DoW on Events", e);
    }

// Show eMail-Link and Show Message-Center-Link beside Username. 
// (Nicht in den Logs zum Cache Listing, das erfolgt später bei Log-Template.)    
    show_mail_and_message_icon:
    try {
        // Nicht auf der Mail oder Message Seite selbst ausführen. 
        if ( document.getElementById("ctl00_ContentBody_SendMessagePanel1_SendEmailPanel") ||
             document.getElementById("messageArea")                                           ) {
            break show_mail_and_message_icon;
        }   
        
        // Cache, TB und Aktiv User Infos ermitteln.     
        [ global_gc, global_tb, global_code, global_name, global_info_mail, global_info_message, global_activ_username ] = getGcTbUserInfo();                            

        if ( ( settings_show_mail || settings_show_message ) ) {
            // Öffentliches Profil:
            if ( is_page("publicProfile") ) {
                if ( document.getElementById("ctl00_ContentBody_ProfilePanel1_lnkEmailUser") ) {
                    // guid ermitteln.  
                    var guid = document.getElementById("ctl00_ContentBody_ProfilePanel1_lnkEmailUser").href.match(/https?:\/\/www\.geocaching\.com\/email\/\?guid=(.*)/);
                    guid = guid[1];
                    // User und Side ermitteln.
                    if ( document.getElementById("ctl00_ContentBody_ProfilePanel1_lblMemberName") ) {
                        var username = decode_innerHTML(document.getElementById("ctl00_ContentBody_ProfilePanel1_lblMemberName")); 
                        var side = document.getElementById("ctl00_ContentBody_ProfilePanel1_lblMemberName");
                    }
                    // Message und Mail Icon aufbauen mit guid. 
                    buildSendIcons( side, username, "per guid" );
                }
            }
            // Restliche Seiten:
            else {
                // Alle Links zu Usern ermitteln und verarbeiten.
                var links = document.getElementsByTagName('a');
                for (var i = 0; i < links.length; i++) {
                    if ( links[i].href.match(/https?:\/\/www\.geocaching\.com\/profile\/\?guid=/) ) {
                        // Avatare werden auch mal mit guid versehen, hier sollen aber keine Icons erzeugt werden.
                        // Z.B. Avatar mit guid bei "Users Who Favorited This Cache".
                        if ( links[i].children[0] && ( links[i].children[0].tagName == "IMG" || links[i].children[0].tagName == "img" ) ) {
                            continue;
                        }
                        // guid ermitteln.  
                        var guid = links[i].href.match(/https?:\/\/www\.geocaching\.com\/profile\/\?guid=(.*)/);
                        guid = guid[1];
                        // User ermitteln.
                        var username = decode_innerHTML(links[i]);
                        // Message und Mail Icon aufbauen mit guid.
                        buildSendIcons( links[i], username, "per guid" );
                    }
                }
            }
        }
    } catch (e) {
        gclh_error("show mail and message icon", e);
    }
   
// Cache, TB, Aktiv User Infos ermitteln.     
    function getGcTbUserInfo() {
        var g_gc = false;
        var g_tb = false;
        var g_code = "";
        var g_name = "";
        var g_info_mail = "";
        var g_info_message = "";
        var g_activ_username = "";

        if ( ( settings_show_mail || settings_show_message ) ) {

            // Im Cache Listing: Cache Name und Cache Code ermitteln.
            if ( document.getElementById('ctl00_ContentBody_CacheName') ) {
                g_gc = true;
                g_name = document.getElementById('ctl00_ContentBody_CacheName').innerHTML;
                if ( document.getElementById('ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode') ) {
                    g_code = document.getElementById('ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode').innerHTML;
                }
            } 
            // Im TB Listing: TB Name und TB Code ermitteln.
            else if ( document.getElementById('ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode') ) {
                g_tb = true;
                g_code = document.getElementById('ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode').innerHTML;
                if ( document.getElementById('ctl00_ContentBody_lbHeading') ) {
                    g_name = document.getElementById('ctl00_ContentBody_lbHeading').innerHTML;
                }
            }
            // Im Log view. 
            else if ( document.getElementById('ctl00_ContentBody_LogBookPanel1_lbLogText') ) {
                // Im Log view vom Cache: Cache Name ermitteln.
                if ( document.getElementById('ctl00_ContentBody_LogBookPanel1_lbLogText').childNodes[4] && 
                     document.getElementById('ctl00_ContentBody_LogBookPanel1_lbLogText').childNodes[4].href.match(/\/cache_details\.aspx\?guid=/) ) {
                    g_gc = true;
                    g_name = document.getElementById('ctl00_ContentBody_LogBookPanel1_lbLogText').childNodes[4].innerHTML;
                }    
                // Im Log view vom TB: TB Name ermitteln.
                if ( document.getElementById('ctl00_ContentBody_LogBookPanel1_lbLogText').childNodes[4] && 
                     document.getElementById('ctl00_ContentBody_LogBookPanel1_lbLogText').childNodes[4].href.match(/\/track\/details\.aspx\?guid=/) ) {
                    g_tb = true;
                    g_name = document.getElementById('ctl00_ContentBody_LogBookPanel1_lbLogText').childNodes[4].innerHTML;
                }    
            }
            // Im Log post.
            else if ( document.getElementById('ctl00_ContentBody_LogBookPanel1_WaypointLink') ) {
                // Im Log post vom Cache: Cache Name ermitteln.
                if ( document.getElementById('ctl00_ContentBody_LogBookPanel1_WaypointLink').parentNode.children[2] && 
                     document.getElementById('ctl00_ContentBody_LogBookPanel1_WaypointLink').parentNode.children[2].href.match(/\/cache_details\.aspx\?guid=/) ) {
                    g_gc = true;
                    g_name = document.getElementById('ctl00_ContentBody_LogBookPanel1_WaypointLink').parentNode.children[2].innerHTML;
                }
                // Im Log post vom TB: TB Name ermitteln.
                if ( document.getElementById('ctl00_ContentBody_LogBookPanel1_WaypointLink').parentNode.children[2] && 
                     document.getElementById('ctl00_ContentBody_LogBookPanel1_WaypointLink').parentNode.children[2].href.match(/\/track\/details\.aspx\?guid=/) ) {
                    g_tb = true;
                    g_name = document.getElementById('ctl00_ContentBody_LogBookPanel1_WaypointLink').parentNode.children[2].innerHTML;
                }    
            }

            // Link zum Cache oder zum TB bzw. Coord Info zum Cache oder zum TB aufbauen.
            if ( g_name != "" ) {
                if ( g_code != "" ) {
                    if ( settings_show_mail && settings_show_mail_coordslink ) g_info_mail = " ( http://coord.info/" + g_code + " )";  
                    else g_info_mail = " ( " + g_code + " )";
                    if ( settings_show_message && settings_show_message_coordslink ) g_info_message = " ( http://coord.info/" + g_code + " )";  
                    else g_info_message = " ( " + g_code + " )";
                }
            }
                
            // Aktiven User Namen ermitteln.
            g_activ_username = $('.li-user-info').children().first().text();
        }
        return [ g_gc, g_tb, g_code, g_name, g_info_mail, g_info_message, g_activ_username ];
    }
    
// Message Icon und Mail Icon aufbauen. 
    function buildSendIcons( b_side, b_username, b_art ) {
        if ( b_art == "per guid" ) {
            // guid prüfen.
            if ( guid == "" || guid == undefined ) return;
            if ( guid.match(/\#/) ) return;
            // Keine Verarbeitung für Stat Bar.
            if ( b_side.innerHTML.match(/https?:\/\/img\.geocaching\.com\/stats\/img\.aspx/) ) return;
        }
        else {
            if ( b_username == "" || b_username == undefined ) return;
        }
        
        // Side prüfen.
        if ( b_side == "" || b_side == undefined ) return;

        // User prüfen.
        if ( b_username == undefined ) return;
        if ( global_activ_username == "" || global_activ_username == undefined ) return;
        // User nur verarbeiten, wenn es sich nicht um den aktiven User handelt. Man schickt sich selbst keine Mail/Message.
        if ( b_username == global_activ_username ) return;
        // Wenn es sich um den Owner handelt, dann echten Owner setzen und nicht gegebenenfalls den abweichenden Owner aus dem Listing "A cache by". 
        // (Der Owner wird bereits in der Funktion get_real_owner dekodiert, die Funktion decode_innerHTML ist hier nicht notwendig.)
        if ( b_side.parentNode.id == "ctl00_ContentBody_mcd1" ) {
            var owner = get_real_owner();
            b_username = owner;
        }
        // Wenn es sich hier um den User "In the hands of ..." im TB Listing handelt, dann prüfen ob der Aktive Username dort enthalten ist und 
        // gegebenenfalls keine Mail, Message erzeugen. Außerdem darf kein Username übergeben werden, weil der nicht bekannt ist, es ist nur 
        // die guid des Users bekannt.
        var username_send = b_username;
        if ( b_side.id == "ctl00_ContentBody_BugDetails_BugLocation" ) {
            if ( b_username.match(global_activ_username) ) return;
            b_username = "";
            username_send = "user";
        }

        // Message Icon erzeugen.
        if ( settings_show_message && b_art == "per guid" ) {
            var message_link = document.createElement("a");
            var message_img = document.createElement("img");
            message_img.setAttribute("style", "margin-left: 0px; margin-right: 0px"); 
            message_img.setAttribute("title", "Send a message to " + username_send);
            message_img.setAttribute("src", global_message_icon);
            message_link.appendChild(message_img);
            // gcCode oder tbCode nicht nutzen, damit keine Standard Message aufgebaut wird. Die deaktivierten Punkte können 
            // dann aktiviert werden, wenn die Erzeugung des eigenen Inhaltes sich als nicht praktikabel herausstellt. 
            if ( global_gc && global_code != "" ) {
                // message_link.setAttribute("href", http + "://www.geocaching.com/account/messagecenter?recipientId=" + guid + "&gcCode=" + global_code); 
                message_link.setAttribute("href", http + "://www.geocaching.com/account/messagecenter?recipientId=" + guid + "&text=Hi " + b_username + ",%0A%0A" + global_name + global_info_message); 
            }    
            else if ( global_tb && global_code != ""  ) { 
                // message_link.setAttribute("href", http + "://www.geocaching.com/account/messagecenter?recipientId=" + guid + "&tbCode=" + global_code);
                message_link.setAttribute("href", http + "://www.geocaching.com/account/messagecenter?recipientId=" + guid + "&text=Hi " + b_username + ",%0A%0A" + global_name + global_info_message); 
            }
            else {
                // message_link.setAttribute("href", http + "://www.geocaching.com/account/messagecenter?recipientId=" + guid);
                message_link.setAttribute("href", http + "://www.geocaching.com/account/messagecenter?recipientId=" + guid + "&text=Hi " + b_username + ",%0A%0A" + global_name + global_info_message);
            }
            b_side.parentNode.insertBefore(message_link, b_side.nextSibling);
            b_side.parentNode.insertBefore(document.createTextNode(" "), b_side.nextSibling);

            // "Message this owner" und das Icon entfernen, falls es da ist.             
            $('#ctl00_ContentBody_mcd1').find(".message__owner").remove();      // Im Cache Listing
            $('.BugDetailsList').find(".message__owner").remove();              // Im TB Listing
        }

        // Mail Icon erzeugen.
        if ( settings_show_mail ) {
            var mail_link = document.createElement("a");
            var mail_img = document.createElement("img");
            mail_img.setAttribute("style", "margin-left: 0px; margin-right: 0px"); 
            mail_img.setAttribute("title", "Send a mail to " + username_send);
            mail_img.setAttribute("src", global_mail_icon);
            mail_link.appendChild(mail_img);
            if ( b_art == "per guid" ) {
                mail_link.setAttribute("href", http + "://www.geocaching.com/email/?guid=" + guid + "&text=Hi " + b_username + ",%0A%0A" + global_name + global_info_mail);
                b_side.parentNode.insertBefore(mail_link, b_side.nextSibling);
                b_side.parentNode.insertBefore(document.createTextNode(" "), b_side.nextSibling);
            }
            else {
                b_side.appendChild(document.createTextNode(" "));
                mail_link.setAttribute("href", http + "://www.geocaching.com/email/?u=" + urlencode(b_username) + "&text=Hi " + b_username + ",%0A%0A" + global_name + global_info_mail);
                b_side.appendChild(mail_link);
                b_side.appendChild(document.createTextNode(" "));
            }
        }
        return;
    }    

// Switch title-color to red, if cache is archived & rename the gallery-link to prevent destroying the layout on to many images ("view the " wegnehmen)
    try {
        if (is_page("cache_listing")) {

            if (document.getElementById("ctl00_ContentBody_uxGalleryImagesLink")) document.getElementById("ctl00_ContentBody_uxGalleryImagesLink").innerHTML = document.getElementById("ctl00_ContentBody_uxGalleryImagesLink").innerHTML.replace("View the ", "");

            var warnings = getElementsByClass("OldWarning");
            for (var i = 0; i < warnings.length; i++) {
                if (warnings[i].innerHTML.match(/(archived|archiviert)/)) {
                    if (document.getElementById("ctl00_ContentBody_CacheName")) document.getElementById("ctl00_ContentBody_CacheName").parentNode.style.color = '#8C0B0B';
                    break;
                }
            }
        }
    } catch (e) {
        gclh_error("Switch title-color", e);
    }

// Improve EMail-Site
    try {
        if (settings_show_mail && document.location.href.match(/^https?:\/\/www\.geocaching\.com\/email\//) && document.getElementById("ctl00_ContentBody_SendMessagePanel1_tbMessage")) {
            // Prevent deleting content
            injectPageScriptFunction(function(){
                var oldClearSearch = clearSearch;
                clearSearch = function(obj) {
                    if (obj.id !== "ctl00_ContentBody_SendMessagePanel1_tbMessage"){
                        oldClearSearch(obj);
                    }
                };
            },"()");

            document.getElementById("ctl00_ContentBody_SendMessagePanel1_tbMessage").setAttribute("onfocus", "");

            // Default settings
            document.getElementById("ctl00_ContentBody_SendMessagePanel1_chkSendAddress").checked = getValue("email_sendaddress", "checked");
            document.getElementById("ctl00_ContentBody_SendMessagePanel1_chkEmailCopy").checked = getValue("email_mailcopy", "checked");

            function chgDefaultSendaddress() {
                setValue("email_sendaddress", document.getElementById("ctl00_ContentBody_SendMessagePanel1_chkSendAddress").checked);
            }

            function chgDefaultMailcopy() {
                setValue("email_mailcopy", document.getElementById("ctl00_ContentBody_SendMessagePanel1_chkEmailCopy").checked);
            }

            document.getElementById('ctl00_ContentBody_SendMessagePanel1_chkSendAddress').addEventListener("click", chgDefaultSendaddress, false);
            document.getElementById('ctl00_ContentBody_SendMessagePanel1_chkEmailCopy').addEventListener("click", chgDefaultMailcopy, false);

            // Grab Text from URL
            var matches = document.location.href.match(/&text=(.*)/);
            if (matches) document.getElementById("ctl00_ContentBody_SendMessagePanel1_tbMessage").innerHTML = decodeURIComponent(matches[1]);

            // Add Mail-Signature
            if (getValue("settings_mail_signature", "") != "") {
                var me = "#me#";
				var newName = $('.li-user-info').children().first().text();
                if (newName) me = newName;
                document.getElementById("ctl00_ContentBody_SendMessagePanel1_tbMessage").innerHTML += "\n\n" + getValue("settings_mail_signature").replace(/#me#/g, me);
            }
        }
    } catch (e) {
        gclh_error("Improve E-Mail-Site", e);
    }

// Improve Message Site.
// - Problematisch ist hier der verzögerte Aufbau der Seite. Das Textarea, zur Aufnahme des Message Inhaltes, wird erst später auf der 
//   Seite aufgebaut, so dass das Seiten Load Event schon längst erledigt ist. Nach 3 bis 6 Sekunden wird der Inhalt der Message offenbar 
//   auch gelöscht und es muß erneut ein Update durchgeführt werden. Das Ganze geht mit Feld value wie auch mit innerHTML. Im Moment werden 
//   10 Sekunden lang Updates durchgeführt, sofern das Feld leer ist. Das behindert den User nicht, es sei denn es ist wieder leer.   
// - Im Title des Message Center Icon oben rechts werden nach Ablauf der function Daten wie folgt hinterlegt: 
//   Werte in zehntel Sekunden, 20 bedeutet also 2,0 Sekunden, 3 bedeutet 0,3 Sekunden. Die Zeiten sind nur in etwa verläßlich, wenn eine
//   einzige Zeitmessung stattfindet. Wird diese Verarbeitung in mehreren Tabs quasi gleichzeitig ausgeführt, dann teilen sich scheinbar
//   alle die Zeiten, sodass dann als Zeitmessung nur entsprechende Teiler der Zeit angegeben werden.    
//   ( Textarea erstmals gefunden / Feld value erstmals gefüllt / Updates auf das Feld weil leer getrennt durch Komma ) 
//   ( 20                         / 21                          / 20,33,                                              )    
// - Zeitweise und nur bei bestimmten Usern hört der grüne Loader nicht mehr auf zu dudeln. Das hat nichts mit den hiesigen Dingen zu tun.
//   Am Besten den GClh abschalten und ohne nochmal versuchen - gleiches Verhalten. Womöglich haben diese User bisher noch nicht mit dem 
//   Message Center gearbeitet. Versucht man es fünf Minuten später nochmal identisch, dann funktioniert es. 
// - Ich kann das Ganze hier nicht besser. :)     
    try {
        if ( settings_show_message && is_page("messagecenter") && document.location.href.match(/&text=(.*)/) ) {      

            var val = "";
            // Grab Text from URL.
            var matches = document.location.href.match(/&text=(.*)/);
            val = decodeURIComponent(matches[1]);
            // Add Mail-Signature
            if ( getValue("settings_mail_signature", "" ) != "") {
                var me = "#me#";
	            var newName = $('.li-user-info > span:nth-child(2)').text();
                if (newName) me = newName;
                val += "\n\n" + getValue("settings_mail_signature").replace(/#me#/g, me);
            }
            
            function upd() {
                var checkafter = "Message Center";
                var firstUpd = "";
                var firstUpdDone = "";
                var allUpds = "";
                
                var rep = setInterval( tryUpdate, 100 ); 
                var repeatCounter = 0;
                
                function tryUpdate() {
                    repeatCounter++;
                    if ( repeatCounter > 100 ) {
                        checkafter += " ( " + firstUpd + " / " + firstUpdDone + " / " + allUpds + " )";
                        document.getElementsByClassName("message-center-icon")[1].setAttribute("title", checkafter); 
                        document.getElementsByClassName("messagecenterheaderwidget")[1].setAttribute("title", checkafter); 
                        clearInterval(rep);  
                    } else {
                        if ( document.getElementsByClassName("draft-textarea")[0] ) {
                            if ( document.getElementsByClassName("draft-textarea")[0].value == "" ) {
                                if ( firstUpd == "" ) firstUpd = repeatCounter;
                                allUpds += repeatCounter + ",";
                                document.getElementsByClassName("draft-textarea")[0].value = val;
                                if ( document.getElementsByClassName("draft-textarea autosize")[0] ) {
                                    document.getElementsByClassName("draft-textarea autosize")[0].setAttribute("style", "max-height: 200px; height: 180px;");
                                }
                            } else {
                                if ( firstUpdDone == "" )  firstUpdDone = repeatCounter;
                            }
                        }
                    }
                }
            }            
            upd();
        }
    } catch (e) {
        gclh_error("Improve Message Site", e);
    }
    
// Default Log Type && Log Signature
    try {
        if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/log\.aspx\?(id|guid|ID|PLogGuid|wp)\=/) && document.getElementById('ctl00_ContentBody_LogBookPanel1_ddLogType') && $('#ctl00_ContentBody_LogBookPanel1_lbConfirm').length == 0) {
            if (!document.location.href.match(/\&LogType\=/) && !document.location.href.match(/PLogGuid/)) {
                var cache_type = document.getElementById("ctl00_ContentBody_LogBookPanel1_WaypointLink").nextSibling.childNodes[0].title;
                var select_val = "-1";

                if (cache_type.match(/event/i)) {
                    select_val = settings_default_logtype_event;
                }

                //Ownername == Username
                else if ($('.PostLogList').find('a[href*="https://www.geocaching.com/profile/?guid="]').text().trim() == $('.li-user-info').children().text().trim()) {
                    select_val = settings_default_logtype_owner;
                }
                else {
                    select_val = settings_default_logtype;
                }


                var select = document.getElementById('ctl00_ContentBody_LogBookPanel1_ddLogType');
                var childs = select.children;

                if (select.value == "-1") {
                    for (var i = 0; i < childs.length; i++) {
                        if (childs[i].value == select_val) {
                            select.selectedIndex = i;
                        }
                    }
                }
            }

            // Signature
            if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/log\.aspx\?PLogGuid\=/)) {
                if (settings_log_signature_on_fieldnotes) document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML += getValue("settings_log_signature", "");
            } else {
                document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML += getValue("settings_log_signature", "");
            }

            // Set Cursor to Pos1
            function gclh_setFocus() {
                var input = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo');
                if (input) {
                    try {
                        input.selectionStart = 0;
                        input.selectionEnd = 0;
                        input.focus();
                    }
                    catch (e) {
                        // TODO: according to Google this exception occurs if the text field is not visible,
                        // but I have no clue what exactly is wrong here
                    }
                }
            }

            window.addEventListener("load", gclh_setFocus, false);

            // Replace variable
            if ($('.li-user-info').children().length > 0) {
                var finds = get_my_finds();
                var me = $('.li-user-info').children().first().text();
                var owner = document.getElementById('ctl00_ContentBody_LogBookPanel1_WaypointLink').nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerHTML;
                document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#found_no#/g, finds);
                finds++;
                document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#found#/g, finds);
                document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#me#/g, me);
                document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#owner#/g, owner);
                // Aktuelles Datum und aktuelle Zeit ermitteln und ersetzen von #Date#, #Time# und #DateTime#.
                [ aDate, aTime, aDateTime ] = getDateTime();
                document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#Date#/ig, aDate);
                document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#Time#/ig, aTime);
                document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#DateTime#/ig, aDateTime);
            }
        }
    } catch (e) {
        gclh_error("Default Log-Type & Signature (CACHE)", e);
    }

// Default TB Log Type && Log Signature
    try {
        if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/track\/log\.aspx/)) {
            if (settings_default_tb_logtype != "-1" && !document.location.href.match(/\&LogType\=/)) {
                var select = document.getElementById('ctl00_ContentBody_LogBookPanel1_ddLogType');
                var childs = select.children;

                for (var i = 0; i < childs.length; i++) {
                    if (childs[i].value == settings_default_tb_logtype) {
                        select.selectedIndex = i;
                    }
                }
            }

            // Signature
            if (document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo') && document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML == "") document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = getValue("settings_tb_signature", "");

            // Set Cursor to Pos1
            function gclh_setFocus() {
                var input = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo');
                if (input) {
                    try {
                        input.selectionStart = 0;
                        input.selectionEnd = 0;
                        input.focus();
                    } catch (e) {
                        // TODO: according to Google this exception occurs if the text field is not visible,
                        // but I have no clue what exactly is wrong here
                    }
                }
            }

            window.addEventListener("load", gclh_setFocus, false);

            // Replace variable
            if ($('.li-user-info').children().length > 0) {
                var finds = get_my_finds();
                var me = $('.li-user-info').children().first().text();
                var owner = document.getElementById('ctl00_ContentBody_LogBookPanel1_WaypointLink').nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerHTML;
                document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#found_no#/g, finds);
                finds++;
                document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#found#/g, finds);
                document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#me#/g, me);
                document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#owner#/g, owner);
                // Aktuelles Datum und aktuelle Zeit ermitteln und ersetzen von #Date#, #Time# und #DateTime#.
                [ aDate, aTime, aDateTime ] = getDateTime();
                document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#Date#/ig, aDate);
                document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#Time#/ig, aTime);
                document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#DateTime#/ig, aDateTime);
            }
        }
    } catch (e) {
        gclh_error("Default Log-Type und Signature (TB)", e);
    }

// Show Coin-series in TB-Listing
    try {
        if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/track\/details\.aspx/)) {
            var dl = getElementsByClass('BugDetailsList')[0];

            if (dl) {
                if (document.getElementById("ctl00_ContentBody_BugTypeImage") && document.getElementById("ctl00_ContentBody_BugTypeImage").alt) {
                    dl.innerHTML += "<dt>Series:</dt><dd>" + document.getElementById("ctl00_ContentBody_BugTypeImage").alt + "</dd>";
                }
            }
        }
    } catch (e) {
        gclh_error("Show Coin Series", e);
    }

// Improve Friendlist
    try {
        if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/myfriends\.aspx/)) {
            var friends = getElementsByClass("FriendText");
            var day = new Date().getDate();
            var last_check = parseInt(getValue("friends_founds_last", "0"), 10);

            if (settings_automatic_friend_reset && last_check != day) {
                for (var i = 0; i < friends.length; i++) {
                    var friend = friends[i];
                    var name = friend.getElementsByTagName("a")[0];

                    //Founds
                    if (getValue("friends_founds_new_" + name.innerHTML)) {
                        setValue("friends_founds_" + name.innerHTML, getValue("friends_founds_new_" + name.innerHTML));
                    }

                    //Hides
                    if (getValue("friends_hides_new_" + name.innerHTML)) {
                        setValue("friends_hides_" + name.innerHTML, getValue("friends_hides_new_" + name.innerHTML));
                    }
                }
                setValue("friends_founds_last", day);
            }

            for (var i = 0; i < friends.length; i++) {
                var friend = friends[i];
                var name = friend.getElementsByTagName("a")[0];
                var add = "";

                //founds
                var founds = parseInt(trim(friend.getElementsByTagName("dd")[4].innerHTML).replace(/[,.]*/g, ""));
                if (isNaN(founds))founds = 0;
                var last_founds = getValue("friends_founds_" + name.innerHTML);

                if (typeof(last_founds) == "undefined") last_founds = founds;
                if ((founds - last_founds) > 0) add = " <font color='#00AA00'><b>(+" + (founds - last_founds) + ")</b></font>";
                setValue("friends_founds_new_" + name.innerHTML, founds);
                if (founds == 0) {
                    friend.getElementsByTagName("dd")[4].innerHTML = founds + "&nbsp;";
                } else {
                    friend.getElementsByTagName("dd")[4].innerHTML = "<a href='/seek/nearest.aspx?ul=" + urlencode(name.innerHTML) + "&disable_redirect'>" + founds + "</a>&nbsp;" + add;
                }


                //hides
                add = "";
                var hides = parseInt(trim(friend.getElementsByTagName("dd")[5].innerHTML).replace(/[,.]*/g, ""));
                if (isNaN(hides))hides = 0;
                var last_hides = getValue("friends_hides_" + name.innerHTML);

                if (typeof(last_hides) == "undefined") last_hides = hides;
                if ((hides - last_hides) > 0) add = " <font color='#00AA00'><b>(+" + (hides - last_hides) + ")</b></font>";
                setValue("friends_hides_new_" + name.innerHTML, hides);
                if (hides == 0) {
                    friend.getElementsByTagName("dd")[5].innerHTML = hides + "&nbsp;";
                } else {
                    friend.getElementsByTagName("dd")[5].innerHTML = "<a href='/seek/nearest.aspx?u=" + urlencode(name.innerHTML) + "&disable_redirect'>" + hides + "</a>&nbsp;" + add;
                }


                //Location
                var friendlocation = trim(friend.getElementsByTagName("dd")[3].getElementsByTagName("span")[0].innerHTML);
                if (friendlocation != "" && friendlocation.length > 3) {
                    friend.getElementsByTagName("dd")[3].getElementsByTagName("span")[0].innerHTML = "<a href='http://maps.google.de/?q=" + (friendlocation.replace(/&/g, "")) + "' target='_blank'>" + friendlocation + "</a>";
                }


                //bottom line
//--> $$062FE Begin of change
//                friend.getElementsByTagName("p")[0].innerHTML = "<a name='lnk_profilegallery2' href='" + name.href + "'>Gallery</a> | " + friend.getElementsByTagName("p")[0].innerHTML;
                friend.getElementsByTagName("p")[0].innerHTML = "<a name='lnk_profilegallery2' href='" + name.href + '#gclhpb#ctl00$ContentBody$ProfilePanel1$lnkGallery' + "'>Gallery</a> | " + friend.getElementsByTagName("p")[0].innerHTML;
//<-- $$062FE End of change
            }

            function gclh_reset_counter() {
                var friends = getElementsByClass("FriendText");

                for (var i = 0; i < friends.length; i++) {
                    var friend = friends[i];
                    var name = friend.getElementsByTagName("a")[0];
                    var founds = 0;
                    var hides = 0;

                    founds = getValue("friends_founds_new_" + name.innerHTML, 0);
                    setValue("friends_founds_" + name.innerHTML, founds);
                    if (founds == 0) friend.getElementsByTagName("dd")[4].innerHTML = "0&nbsp;";
                    else friend.getElementsByTagName("dd")[4].innerHTML = "<a href='/seek/nearest.aspx?ul=" + urlencode(name.innerHTML) + "&disable_redirect'>" + founds + "</a>";

                    hides = getValue("friends_hides_new_" + name.innerHTML, 0);
                    setValue("friends_hides_" + name.innerHTML, hides);
                    if (hides == 0) friend.getElementsByTagName("dd")[5].innerHTML = "0&nbsp;";
                    else friend.getElementsByTagName("dd")[5].innerHTML = "<a href='/seek/nearest.aspx?u=" + urlencode(name.innerHTML) + "&disable_redirect'>" + hides + "</a>&nbsp;";
                }
            }

            var button = document.createElement("input");
            button.setAttribute("type", "button");
            button.setAttribute("value", "Reset counter");
            button.addEventListener("click", gclh_reset_counter, false);

            document.getElementById('ctl00_ContentBody_FindUserPanel1_GetUsers').parentNode.insertBefore(button, document.getElementById('ctl00_ContentBody_FindUserPanel1_GetUsers').nextSibling);
        }
    } catch (e) {
        gclh_error("Improve Friendlist", e);
    }

// Show Google-Maps Link on Cache Listing Page
    try {
        if (settings_show_google_maps && is_page("cache_listing") && document.getElementById("ctl00_ContentBody_uxViewLargerMap") && document.getElementById("uxLatLon") && document.getElementById("ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode")) {
            var ref_link = document.getElementById("ctl00_ContentBody_uxViewLargerMap");
            var box = ref_link.parentNode;

            box.appendChild(document.createElement("br"));

            var link = document.createElement("a");
            link.setAttribute("class", "lnk");
            link.setAttribute("target", "_blank");
            link.setAttribute("title", "Show area at Google Maps");
            var matches = ref_link.href.match(/\?lat=(-?[0-9.]*)&lng=(-?[0-9.]*)/);
            var latlng = matches[1] + "," + matches[2];
            // &ll sorgt für Zentrierung der Seite beim Marker auch wenn die linke Sidebar aufklappt. Zoom 18 setzen, weil GC Map eigentlich nicht mehr kann.
            link.setAttribute("href", "https://maps.google.de/maps?q=" + latlng + "&ll=" + latlng + "&z=18");

            var img = document.createElement("img");
            img.setAttribute("src", "/images/silk/map_go.png");
            link.appendChild(img);

            link.appendChild(document.createTextNode(" "));

            var span = document.createElement("span");
            span.appendChild(document.createTextNode("Show area on Google Maps"));
            link.appendChild(span);

            box.appendChild(link);
        }
    } catch (e) {
        gclh_error("Show google maps link", e);
    }

// Show "Log It"-Button
    try {
        if (settings_show_log_it && document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/nearest\.aspx\?/)) {
            var links = document.getElementsByTagName("a");

            for (var i = 0; i < links.length; i++) {
                if (links[i].href.match(/^https?:\/\/www\.geocaching\.com\/seek\/cache_details\.aspx\?.*/) && links[i].innerHTML.match(/^<span>/)) {
                    links[i].parentNode.innerHTML = links[i].parentNode.innerHTML.replace("<br>", "<a title='Log it' href='" + links[i].href.replace("cache_details", "log") + "'><img src='/images/stockholm/16x16/add_comment.gif'></a><br>");
                } else if (links[i].href.match(/^https?:\/\/www\.geocaching\.com\/geocache\/.*/) && links[i].innerHTML.match(/^<span>/)) {
                    var match = links[i].href.match(/^https?:\/\/www\.geocaching\.com\/geocache\/([^_]*)/);
                    links[i].parentNode.innerHTML = links[i].parentNode.innerHTML.replace("<br>", "<a title='Log it' href='" + http + "://www.geocaching.com/seek/log.aspx?wp=" + match[1] + "'><img src='/images/stockholm/16x16/add_comment.gif'></a><br>");
                }
            }
        }
    } catch (e) {
        gclh_error("Log It Button", e);
    }

// Show Profile-Link on display of Caches found or created by user
    try {
        if (settings_show_nearestuser_profil_link && document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/nearest\.aspx/) && document.location.href.match(/(ul|u)=/)) {
            if (document.getElementById("ctl00_ContentBody_LocationPanel1_OriginLabel")) {
                var urluser = document.location.href.match(/(ul|u)=(.*)/);
                urluser = urldecode( urluser[2].replace(/&([A-Za-z0-9]+)=(.*)/, "") );
                urluser = urluser.replace(/&disable_redirect/, "");
                urluser = urluser.replace(/#(.*)/, "");
                var linkelement = document.createElement("a");
                linkelement.href = "/profile/?u=" + urluser;
                linkelement.innerHTML = urluser;
                var textelement = document.getElementById("ctl00_ContentBody_LocationPanel1_OriginLabel");
                textelement.innerHTML = textelement.innerHTML.replace(/: (.*)/, ": ");
                textelement.appendChild(linkelement);
            }
        }
    } catch (e) {
        gclh_error("Show Profile Link", e);
    }

// Improve Bookmark-List
    try {
        if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/bookmarks\/view\.aspx\?guid=/)) {
            var box = document.getElementById("ctl00_ContentBody_lbHeading").parentNode.parentNode.parentNode;
            var matches = document.location.href.match(/guid=([a-zA-Z0-9-]*)/);
            var uuid = matches[1];

            box.childNodes[3].innerHTML += "<br><a title=\"Download as kml\" href='" + http + "://www.geocaching.com/kml/bmkml.aspx?bmguid=" + uuid + "'>Download as kml</a><br><a title=\"Show in google maps\" href='http://maps.google.com/?q=https://www.geocaching.com/kml/bmkml.aspx?bmguid=" + uuid + "' target='_blank'>Show in google maps</a>";
        }
        if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/bookmarks\/default\.aspx/) || document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/lists\.aspx/)) {
            var links = document.getElementsByTagName("a");

            for (var i = 0; i < links.length; i++) {
                if (links[i].title == "Download Google Earth KML") {

                    var matches = links[i].href.match(/guid=([a-zA-Z0-9-]*)/);
                    links[i].parentNode.innerHTML += "<br><a title='Show in google maps' href='http://maps.google.com/?q=https://www.geocaching.com/kml/bmkml.aspx?bmguid=" + matches[1] + "' target='_blank'>Show in google maps</a>";
                }
            }
        }
    } catch (e) {
        gclh_error("Improve Bookmark-List", e);
    }

// Add buttons to bookmarks-lists and watchlist to select caches
    try {
        var current_page;
//--> $$063FE Begin of change
//        if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/bookmarks/)) current_page = "bookmark"
//        else if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/watchlist/)) current_page = "watch"
        if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/bookmarks/) &&
            !document.location.href.match(/^https?:\/\/www\.geocaching\.com\/bookmarks\/default/)) current_page = "bookmark"
        else if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/watchlist\.aspx/)) current_page = "watch"
//<-- $$063FE End of change

        if (!!current_page) {
            var checkbox_selector = 'input[type=checkbox]';
            var table = $('table.Table').first(); //On watchlist, ignore the trackable-table so use only first table here
            var rows = table.find('tbody tr');
            var checkboxes = table.find(checkbox_selector);

            if (table.length > 0 && rows.length > 0 && checkboxes.length > 0) {
                //Add section to table
                var button_wrapper = $('<td colspan="10">Select caches: </td>');
                var button_template = $('<a style="cursor:pointer; margin-right: 10px;" />');
                if ( current_page == "bookmark" ) sums = sumsCreateFields( settings_show_sums_in_bookmark_lists );
                else sums = sumsCreateFields( settings_show_sums_in_watchlist );
                sumsCountAll();
                sumsSetEventsForCheckboxes( table.find('tbody tr').find(checkbox_selector) );

                button_wrapper.append(button_template.clone().text('All').click(function () {
                    checkboxes.prop('checked', 'true');
                    sumsCountChecked_SelectionAll();
                }));
                sumsOutputFields( button_wrapper, "All" );
                button_wrapper.append(button_template.clone().text('None').click(function () {
                    checkboxes.prop('checked', false);
                    sumsCountChecked_SelectionNone();
                }));
                button_wrapper.append(button_template.clone().text('Invert').click(function () {
                    checkboxes.each(function () {
                        this.checked = !this.checked;
                    });
                    sumsCountChecked_SelectionInvert();
                }));

                button_wrapper.append($('<span style="margin-right:10px">|</span>'));

                if (current_page !== "watch") { // Hide on watchlist
                    button_wrapper.append(button_template.clone().text('Found').click(function () {
                        table.find('img[src*="found"]').closest('tr').find(checkbox_selector).each(function () {
                            this.checked = !this.checked;
                        });
                        sumsCountCheckedAll();
                    }));
                    sumsOutputFields( button_wrapper, "Found" );
                }
                button_wrapper.append(button_template.clone().text('Archived').click(function () {
                    table.find('span.Strike.OldWarning,span.Strike.Warning').closest('tr').find(checkbox_selector).each(function () {
                        this.checked = !this.checked;
                    });
                    sumsCountCheckedAll();
                }));
                sumsOutputFields( button_wrapper, "Archived" );
                button_wrapper.append(button_template.clone().text('Deactivated').click(function () {
                    table.find('span.Strike:not(.OldWarning,.Warning)').closest('tr').find(checkbox_selector).each(function () {
                        this.checked = !this.checked;
                    });
                    sumsCountCheckedAll();
                }));
                sumsOutputFields( button_wrapper, "Deactivated" );

                var tfoot = $('<tfoot />').append($('<tr />').append(button_wrapper));
                table.append(tfoot);

                checkboxes.prop('checked', false);
                sumsChangeAllFields();
            }
        }
    } catch (e) {
        gclh_error("Add buttons to bookmark list and watchlist", e);
    }

// Funktionen für die Ermittlung und Ausgabe der Anzahl Caches und der Anzahl der selektierten Caches in Bookmark Listen, Watchlist ...   
    // Summenfelder für Anzahl Caches definieren und Configparameter setzen.
    function sumsCreateFields( configParameter ) {
        var sums = new Object();
        sums["All"] = 0;
        sums["chAll"] = 0;
        sums["Found"] = 0;
        sums["chFound"] = 0;
        sums["Archived"] = 0;
        sums["chArchived"] = 0;
        sums["Deactivated"] = 0;
        sums["chDeactivated"] = 0;
        sums["configParameter"] = configParameter;
      return sums;
    }
    // Anzahl Caches ermitteln. 
    function sumsCountAll() {
        if ( sums["configParameter"] == false ) return;
        sums["All"] = table.find('tbody tr').find(checkbox_selector).length;
        sums["Found"] = table.find('tbody tr').find('img[src*="found"]').length;
        sums["Archived"] = table.find('tbody tr').find('span.Strike.OldWarning,span.Strike.Warning').length;
        sums["Deactivated"] = table.find('tbody tr').find('span.Strike:not(.OldWarning,.Warning)').length;
    }
    // Events für die Checkboxen setzen.
    function sumsSetEventsForCheckboxes( checkboxes ) {
        if ( sums["configParameter"] == false ) return;
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].addEventListener("click", function () { sumsCountChecked_Click( this ); } , false);
        }
    }
    // Platzhalter für die Anzahl Caches aufbauen.     
    function sumsOutputFields( side, kind ) {
        if ( sums["configParameter"] == false ) return;
        var out = document.createElement('span');
        out.setAttribute("style", "font-size: 85%; font-style: italic; margin-left: -6px; margin-right: 10px;");
        out.setAttribute("id", "sums_caches_" + kind);
        out.appendChild(document.createTextNode( "" ));
        side.append(out);
    }
    // Werte für die Anzahl Caches ändern.   
    function sumsChangeAllFields() {
        if ( sums["configParameter"] == false ) return;
        sumsChangeFields( "All", sums["chAll"], sums["All"] )
        sumsChangeFields( "Found", sums["chFound"], sums["Found"] )
        sumsChangeFields( "Archived", sums["chArchived"], sums["Archived"] )
        sumsChangeFields( "Deactivated", sums["chDeactivated"], sums["Deactivated"] )
    }
    // Werte für die Anzahl Caches ändern.  
    function sumsChangeFields( kind, sums_ch, sums ) {
        if ( sums["configParameter"] == false ) return;
        var outSums = "(" + sums_ch + "|" + sums + ")";
        var outTitle = sums_ch + " of " + sums + " caches selected"; 
        var outId = "sums_caches_" + kind; 
        if ( document.getElementById( outId ) ) {
            var side = document.getElementById( outId );
            side.setAttribute( "title", outTitle );
            side.innerHTML = outSums;
        }
    }
    // Anzahl markierte Caches für Selektion All ermitteln und setzen. 
    function sumsCountChecked_SelectionAll() {
        if ( sums["configParameter"] == false ) return;
        sums["chAll"] = sums["All"];
        sums["chFound"] = sums["Found"];
        sums["chArchived"] = sums["Archived"];
        sums["chDeactivated"] = sums["Deactivated"];
        sumsChangeAllFields();
    }
    // Anzahl markierte Caches für Selektion None ermitteln und setzen.
    function sumsCountChecked_SelectionNone() {
        if ( sums["configParameter"] == false ) return;
        sums["chAll"] = 0;
        sums["chFound"] = 0;
        sums["chArchived"] = 0;
        sums["chDeactivated"] = 0;
        sumsChangeAllFields();
    }
    // Anzahl markierte Caches für Selektion Invert ermitteln und setzen.
    function sumsCountChecked_SelectionInvert() {
        if ( sums["configParameter"] == false ) return;
        sums["chAll"] = sums["All"] - sums["chAll"];
        sums["chFound"] = sums["Found"] - sums["chFound"];
        sums["chArchived"] = sums["Archived"] - sums["chArchived"];
        sums["chDeactivated"] = sums["Deactivated"] - sums["chDeactivated"];
        sumsChangeAllFields();
    }
    // Anzahl markierte Caches für Click auf Checkbox ermitteln. 
    function sumsCountChecked_Click( checkbox ) {
        if ( checkbox.checked ) sums["chAll"]++;
        else  sums["chAll"]--;
        var cbId = checkbox.id; 
        if ( $('#'+cbId).closest('tr').find('img[src*="found"]').length > 0 ) {          
                if ( checkbox.checked ) sums["chFound"]++;
                else  sums["chFound"]--;
        }
        if ( $('#'+cbId).closest('tr').find('span.Strike.OldWarning,span.Strike.Warning').length > 0 ) {          
                if ( checkbox.checked ) sums["chArchived"]++;
                else  sums["chArchived"]--;
        }
        if ( $('#'+cbId).closest('tr').find('span.Strike:not(.OldWarning,.Warning)').length > 0 ) {          
                if ( checkbox.checked ) sums["chDeactivated"]++;
                else  sums["chDeactivated"]--;
        }
        sumsChangeAllFields();
    }
    // Anzahl markierter Caches für alles ermitteln. 
    function sumsCountCheckedAll() {
        if ( sums["configParameter"] == false ) return;
        sums["chAll"] = table.find('tbody tr').find(checkbox_selector + ':checked').length;
        sums["chFound"] = table.find('tbody tr').find('img[src*="found"]').closest('tr').find(checkbox_selector + ':checked').length;
        sums["chArchived"] = table.find('tbody tr').find('span.Strike.OldWarning,span.Strike.Warning').closest('tr').find(checkbox_selector + ':checked').length;
        sums["chDeactivated"] = table.find('tbody tr').find('span.Strike:not(.OldWarning,.Warning)').closest('tr').find(checkbox_selector + ':checked').length;
        sumsChangeAllFields();
    } 
    
// Hide Map Header
    try {
        if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/map\//)) {
            function checkMapLeaflet( waitCount ) {
                if ( document.getElementsByClassName("leaflet-container")[0] ) {
                    // Map Header verbergen.
                    if (settings_hide_map_header) {
                        hide_map_header();
                    }
                    // Button in Sidebar aufbauen "Hide/Show Header".
                    var sidebar = document.getElementById("searchtabs");
                    var link = document.createElement("a");
                    link.appendChild(document.createTextNode("Hide/Show Header"));
                    link.href = "#";
                    link.addEventListener("click", hide_map_header, false);
                    // Link in der Sidebar der Karten komplett anzeigen und auch nicht mehr überblenden.
                    sidebar.setAttribute("style", "height: 63px !important; margin-top: 6px !important;"); 
                    // Link in der Sidebar rechts orientieren wegen möglichem GC Tour script.
                    link.setAttribute("style", "float: right; padding-right: 3px;"); 
                    sidebar.appendChild(link);
                } else {
                    waitCount++;
                    if ( waitCount <= 50 ) {  // 5 Sekunden lang
                        setTimeout( function () { checkMapLeaflet( waitCount ) }, 100); 
                    } else {
                        return;
                    }
                }
            }
            checkMapLeaflet( 0 );
//--> $$003CF Begin of insert 	
            setTimeout(function() {
                $.ajax({
                        type: "POST",
                        url: "/account/oauth/token",
                        timeout: 10000
                    })
                    .done(function(r) {
                        all_map_layers["Geocaching"].accessToken = r.access_token;
                    });
            }, 0);
//<-- $$003CF End of insert 			
        }
    } catch (e) {
        gclh_error("Hide Map Header", e);
    }

// Map-Layers
    var all_map_layers = new Object();
// gc.com Default-Layers
//--> $$003CF Begin of insert 			
    all_map_layers["Geocaching"] = {
        tileUrl: "https://maptiles{s}.geocaching.com/tile/{z}/{x}/{y}.png?token={accessToken}",
        accessToken: '',
        subdomains: ['01', '02', '03', '04', '05', '06', '07', '08'],
        minZoom: 0,
        maxZoom: 18
    };
//<-- $$003CF End of insert 
    all_map_layers["OpenStreetMap Default"] = {
        tileUrl: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    };
    all_map_layers["OpenStreetMap German Style"] = {
        tileUrl: "http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png",
        attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    };
    all_map_layers["OpenStreetMap Black and White"] = {
        tileUrl: "http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png",
        attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    };

    all_map_layers["Thunderforest OpenCycleMap"] = {
        tileUrl: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
        attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    };
    all_map_layers["Thunderforest Transport"] = {
        tileUrl: "http://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png",
        attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    };
    all_map_layers["Thunderforest Landscape"] = {
        tileUrl: "http://{s}.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png",
        attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    };

    all_map_layers["Stamen Toner"] = {
        tileUrl: "http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png",
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; ' + "Map data {attribution.OpenStreetMap}",
        subdomains: "abcd",
        minZoom: 0,
        maxZoom: 20
    };
    all_map_layers["Stamen Terrain"] = {
        tileUrl: "http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png",
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; ' + "Map data {attribution.OpenStreetMap}",
        subdomains: "abcd",
        minZoom: 4,
        maxZoom: 18
    };
    all_map_layers["Stamen Watercolor"] = {
        tileUrl: "http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png",
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; ' + "Map data {attribution.OpenStreetMap}",
        subdomains: "abcd",
        minZoom: 3,
        maxZoom: 16
    };

    all_map_layers["Esri WorldStreetMap"] = {
        tileUrl: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
        attribution: "Tiles &copy; Esri"
    };
    all_map_layers["Esri DeLorme"] = {
        tileUrl: "http://server.arcgisonline.com/ArcGIS/rest/services/Specialty/DeLorme_World_Base_Map/MapServer/tile/{z}/{y}/{x}",
        attribution: "Tiles &copy; Esri &mdash; Copyright: \u00a92012 DeLorme",
        maxZoom: 11
    };
    all_map_layers["Esri WorldTopoMap"] = {
        tileUrl: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community"
    };
    all_map_layers["Esri WorldImagery"] = {
        tileUrl: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
    };
    all_map_layers["Esri OceanBasemap"] = {
        tileUrl: "http://services.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}",
        attribution: "Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri",
        maxZoom: 11
    };
    all_map_layers["Esri NatGeoWorldMap"] = {
        tileUrl: "http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
        attribution: "Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC"
    };

// GClh additional Layers
    all_map_layers["OpenStreetMap Hike and Bike"] = {
        tileUrl: "http://toolserver.org/tiles/hikebike/{z}/{x}/{y}.png",
        attribution: 'Map and map data \u00a9 2012 <a href="http://www.openstreetmap.org" target=\'_blank\'>OpenStreetMap</a> and contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>.',
        tileSize: 256,
        minZoom: 0,
        maxZoom: 20
    };
    all_map_layers["Google Maps"] = {
        tileUrl: "http://mt.google.com/vt?x={x}&y={y}&z={z}",
        attribution: "Google Maps",
        tileSize: 256,
        minZoom: 0,
        maxZoom: 20
    };
    all_map_layers["Google Maps Satellite"] = {
        tileUrl: "http://mt.google.com/vt?lyrs=s&x={x}&y={y}&z={z}",
        attribution: "Google Maps",
        tileSize: 256,
        minZoom: 3,
        maxZoom: 20
    };
    all_map_layers["Google Maps Hybrid"] = {
        tileUrl: "http://mt0.google.com/vt/lyrs=s,m@110&hl=en&x={x}&y={y}&z={z}",
        attribution: "Google Maps",
        tileSize: 256,
        minZoom: 0,
        maxZoom: 20
    };

// Map-Overlays
    var map_overlays = new Object();
    map_overlays["Hillshadow"] = {
        tileUrl: "http://{s}.tiles.wmflabs.org/hillshading/{z}/{x}/{y}.png",
        attribution: 'hillshadow \u00a9 <a href="http://tiles.wmflabs.org/" target=\'_blank\'>tiles.wmflabs.org</a>',
        tileSize: 256,
        minZoom: 0,
        maxZoom: 17
    };
    map_overlays["Public Transport Lines"] = {
        tileUrl: "http://openptmap.org/tiles/{z}/{x}/{y}.png",
        attribution: 'Public Transport Lines\u00a9 <a href="http://openptmap.org/" target=\'_blank\'>OpenPTMap</a>',
        tileSize: 256,
        minZoom: 0,
        maxZoom: 17
    };

// Add additional Layers to Map & Select Default-Layer, add Hill-Shadow, add Homezone
    try {
        if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/map\//)) {
            // Auswahl nur bestimmter Layer
            var map_layers = new Object();
            if (settings_map_layers == "" || settings_map_layers.length < 1) map_layers = all_map_layers;
            else {
                for (var i = 0; i < settings_map_layers.length; i++) map_layers[settings_map_layers[i]] = all_map_layers[settings_map_layers[i]];
            }

            function addLayer( waitCount ) {
                // Prüfen, ob die Layer schon vorhanden sind. 
                if ( $('.leaflet-control-layers-base').find('input.leaflet-control-layers-selector')[0] ) {
                    injectPageScriptFunction(function (map_layers, map_overlays, settings_map_default_layer, settings_show_hillshadow) {
                        window["GCLittleHelper_MapLayerHelper"] = function (map_layers, map_overlays, settings_map_default_layer, settings_show_hillshadow) {
                            if (!window.MapSettings.Map) {
                                setTimeout(function () {
                                    window["GCLittleHelper_MapLayerHelper"](map_layers, map_overlays, settings_map_default_layer, settings_show_hillshadow)
                                }, 10);
                            }
                            else {
                                var layerControl = new window.L.Control.Layers();
                                var layerToAdd = null;
                                var defaultLayer = null;
                                var hillshadowLayer = null;
                                for (name in map_layers) {
                                    layerToAdd = new L.tileLayer(map_layers[name].tileUrl, map_layers[name]);
                                    layerControl.addBaseLayer(layerToAdd, name);
                                    if (name == settings_map_default_layer) {
                                        defaultLayer = layerToAdd;
                                    }
                                    else if (defaultLayer == null) {
                                        defaultLayer = layerToAdd;
                                    }
                                }
                                for (name in map_overlays) {
                                    layerToAdd = new L.tileLayer(map_overlays[name].tileUrl, map_overlays[name])
                                    layerControl.addOverlay(layerToAdd, name);
                                    if (name == "hillshadow") {
                                        hillshadowLayer = layerToAdd;
                                    }
                                }

                                window.MapSettings.Map.addControl(layerControl);
                                $(".leaflet-control-layers-base").first().find("input").attr('checked', false);
                                $(".leaflet-control-layers").first().remove();
                                for (layerId in window.MapSettings.Map._layers) {
                                    if (window.MapSettings.Map._layers[layerId]._url !== -1) {
                                        window.MapSettings.Map.removeLayer(window.MapSettings.Map._layers[layerId]);
                                        break;
                                    }
                                }
                                window.MapSettings.Map.addLayer(defaultLayer);
                                if (settings_show_hillshadow) {
                                    $(".leaflet-control-layers-overlays").find("input").first().click();
                                }

                            }
                        };

                        window["GCLittleHelper_MapLayerHelper"](map_layers, map_overlays, settings_map_default_layer, settings_show_hillshadow);
                    }, "(" + JSON.stringify(map_layers) + "," + JSON.stringify(map_overlays) + ",'" + settings_map_default_layer + "'," + settings_show_hillshadow + ")");

                } else {
                    waitCount++;
                    if ( waitCount <= 100 ) {  // 5 Sekunden lang
                        setTimeout( function () { addLayer( waitCount ) }, 50); 
                    } else return;
                }
            }
            if (settings_use_gclh_layercontrol) setTimeout( function () { addLayer( 0 ) }, 1000); // 1 Sekunde warten, um Layercontrol von GC Map Enhancements zu ueberschreiben

            //Function called when map is loaded
            function gclh_map_loaded() {
                if (settings_map_hide_sidebar) {
                    var links = document.getElementsByTagName("a");
                    if (document.getElementById("searchtabs").parentNode.style.left != "-355px")
                        for (var i = 0; i < links.length; i++) {
                            if (links[i].className.match(/ToggleSidebar/)) {
                                links[i].click();
                                break;
                            }
                        }
                    function hideSidebarRest( waitCount ) {
                        if ( document.getElementsByClassName("groundspeak-control-findmylocation")[0] &&
                             document.getElementsByClassName("leaflet-control-scale")[0]              &&
                             document.getElementsByClassName("leaflet-control-zoom")[0]                  ) {
                            // Wenn externe Kartenfilter vorhanden sind, dann gibt es keinen Balken zur Sidebar.
                            if ( document.location.href.match(/&asq=/) ) var styleLeft = "15px";
                            else var styleLeft = "30px";
                            document.getElementsByClassName("groundspeak-control-findmylocation")[0].style.left = styleLeft;
                            document.getElementsByClassName("leaflet-control-scale")[0].style.left = styleLeft;
                            document.getElementsByClassName("leaflet-control-zoom")[0].style.left = styleLeft;
                        } else {
                            waitCount++;
                            if ( waitCount <= 50 ) {  // 10 Sekunden
                                setTimeout( function () { hideSidebarRest( waitCount ) }, 200); 
                            } else return;
                        }
                    } 
                    hideSidebarRest( 0 );
                }
                
                function addHomeZoneMap(unsafeWindow, home_lat, home_lng, settings_homezone_radius, settings_homezone_color, settings_homezone_opacity) {
                    //remove duplicate # if exists
                    settings_homezone_color = settings_homezone_color.replace("##", "#");

                    if (unsafeWindow == "none") {
                        unsafeWindow = window;
                    }

                    if (typeof home_lat == "undefined" || typeof home_lng == "undefined" || home_lat == null || home_lng == null) {
                        return;
                    }

                    var opacity = settings_homezone_opacity / 100;
                    var opacity2 = opacity + 0.1;

                    var latlng = new unsafeWindow.L.LatLng((home_lat / 10000000), (home_lng / 10000000));
                    var options = {
                        color: settings_homezone_color,
                        weight: 1,
                        opacity: opacity2,
                        fillOpacity: opacity,
                        clickable: false
                    };
                    var circle = new unsafeWindow.L.Circle(latlng, settings_homezone_radius * 1000, options);
                    unsafeWindow.MapSettings.Map.addLayer(circle);
                }

                // Die Circles werden manchmal zu früh aufgebaut, dann blinken sie kurz auf und sind dann auch schon wieder verschwunden.
                // Das passiert insbesondere beim Kartenaufruf ohne Koordinaten, also beispielsweise aus dem Menü Play. Auf was man warten
                // soll ist mir nicht klar. Ich nehme Ähnliches wie oben bei hideSidebarRest.
                function checkForAddHomeZoneMap( waitCount ) {
                    if ( document.getElementsByClassName("groundspeak-control-findmylocation")[0] &&
                         document.getElementsByClassName("leaflet-control-scale")[0]                 ) {
                        // Show Homezone-Circle on Map
                        if (settings_show_homezone) {
                            if (browser === "chrome" || browser === "firefox") {
                                injectPageScriptFunction(addHomeZoneMap, "('" + "none" + "', " + getValue("home_lat") + ", " + getValue("home_lng") + ", " + settings_homezone_radius + ", '#" + settings_homezone_color + "', " + settings_homezone_opacity + ")");
                            }
                            else {
                                addHomeZoneMap(unsafeWindow, getValue("home_lat"), getValue("home_lng"), settings_homezone_radius, "#" + settings_homezone_color, settings_homezone_opacity);
                            }
                            // Show Multi-Homezone-Circle on Map
                            for (var i in settings_multi_homezone) {
                                var curHz = settings_multi_homezone[i];
                                if (browser === "chrome" || browser === "firefox") {
                                    injectPageScriptFunction(addHomeZoneMap, "('" + "none" + "', " + curHz.lat + ", " + curHz.lng + ", " + curHz.radius + ", '#" + curHz.color + "', " + curHz.opacity + ")");
                                }
                                else {
                                    addHomeZoneMap(unsafeWindow, curHz.lat, curHz.lng, curHz.radius, "#" + curHz.color, curHz.opacity);
                                }
                            }
                        }
                    } else {
                        waitCount++;
                        if ( waitCount <= 50 ) {  // 10 Sekunden
                            setTimeout( function () { checkForAddHomeZoneMap( waitCount ) }, 200); 
                        } else return;
                    }
                }
                checkForAddHomeZoneMap( 0 );
            }

            window.addEventListener("load", gclh_map_loaded, false);
            appendCssStyle(".leaflet-control-layers-base {min-width: 200px;}");
        }
    } catch (e) {
        gclh_error("Add Layers & Homezone to map", e);
    }

// Add link to Google Maps on GC Map.
    try {
        if ( is_page("map") && settings_add_link_google_maps_on_gc_map ) {
            function addGoogleButton( waitCount ) {
                // Prüfen, ob die Layers schon vorhanden sind, erst dann den Button hinzufügen. 
                if ( $('.leaflet-control-layers-base').find('input.leaflet-control-layers-selector')[0] ) {
                    // Damit Button nicht ständig den Platz wechselt, um 1 Sekunde verzögern, dann sollte er links von den anderen Buttons stehen. 
                    setTimeout( function () { 
                        var code = "";
                        code += "    function openGoogleMaps(){";
                        // Mögliche URL Zusammensetzungen, Beispiele:
                        // 1. https://www.geocaching.com/map/default.aspx?lat=50.889233&lng=13.386967#?ll=50.89091,13.39551&z=14
                        //    https://www.geocaching.com/map/default.aspx?lat=50.889233&lng=13.386967#clist?ll=50.89172,13.36779&z=14
                        //    https://www.geocaching.com/map/default.aspx?lat=50.889233&lng=13.386967#pq?ll=50.89204,13.36667&z=14
                        //    https://www.geocaching.com/map/default.aspx?lat=50.889233&lng=13.386967#search?ll=50.89426,13.35955&z=14
                        // 2. https://www.geocaching.com/map/?ll=50.89093,13.38437#?ll=50.89524,13.35912&z=14
                        // 3. https://www.geocaching.com/map/#?ll=50.95397,6.9713&z=15
                        code += "        var matches = document.location.href.match(/\\?ll=(-?[0-9.]*),(-?[0-9.]*)&z=([0-9.]*)/);"; // Beispiel 1., 2. und 3. hinten
                        code += "        var matchesMarker = document.location.href.match(/\\?lat=(-?[0-9.]*)&lng=(-?[0-9.]*)/);";  // Beispiel 1. vorne
                        code += "        if (matchesMarker == null) {";  
                        code += "            var matchesMarker = document.location.href.match(/\\?ll=(-?[0-9.]*),(-?[0-9.]*)#/);";  // Beispiel 2. vorne
                        code += "            if (matchesMarker == null) {";  
                        code += "                var matchesMarker = matches;";                                                     // Beispiel 3.
                        code += "            }";
                        code += "        }";
                        code += "        if (matches != null && matchesMarker != null) {";
                        code += "            var url = 'https://maps.google.de/maps?q=' + matchesMarker[1] + ',' + matchesMarker[2] + '&z=' + matches[3] + '&ll=' + matches[1] + ',' + matches[2];";
                        if ( settings_switch_to_google_maps_in_same_tab ) {
                            code += "        location = url;"; 
                        } else {
                            code += "        window.open( url );"; 
                        }
                        code += "        } else {";
                        code += "            alert('This map has no geographical coordinates in its link. Just zoom or drag the map, afterwards this will work fine.');";
                        code += "        }";
                        code += "    }";
                        var script = document.createElement("script");
                        script.innerHTML = code;
    
                        var div = document.createElement("div");
                        div.setAttribute("class", "leaflet-control-layers leaflet-control");
                        var aTag = document.createElement("a");
                        aTag.setAttribute("id", "gclh_google_button");
                        aTag.setAttribute("class", "leaflet-control-layers-toggle");
                        aTag.setAttribute("onClick", "openGoogleMaps();");
                        aTag.setAttribute("title", "Show area on Google Maps");
                        aTag.setAttribute("style", "background-image: url('/images/silk/map_go.png'); cursor: pointer;");
                        var side = document.getElementsByClassName("leaflet-top leaflet-right")[0];

                        div.appendChild(script);
                        div.appendChild(aTag);
                        side.appendChild(div);
                    
                        // Damit auch mehr als 2 Buttons handlebar sind, also auch beispielsweise noch GC Vote.
                        appendCssStyle(".leaflet-control-layers + .leaflet-control {position: unset; right: unset;} .leaflet-control {clear: unset}");
                    }, 1000);
                } else {
                    waitCount++;
                    if ( waitCount <= 50 ) {  // 10 Sekunden lang
                        setTimeout( function () { addGoogleButton( waitCount ) }, 200); 
                    } else return;
                }
            }
            addGoogleButton( 0 );
        }
    } catch (e) {
        gclh_error("add link google maps on gc map", e);
    }
      
// Hide found/hidden Caches on Map
    try {
        if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/map\//) && !document.location.href.match(/^https?:\/\/www\.geocaching\.com\/map\/default.aspx\?pq/)) { // Nicht bei PQ-Anzeige
            function hideFoundCaches() {
                // Kartenfilter bei externen Filtern (beispielsweise aus play/search) nicht verändern.
                if ( document.location.href.match(/&asq=/) ) return;
                var button = unsafeWindow.document.getElementById("m_myCaches").childNodes[1];
                if (button) {
                    button.click();
                }
            }

            if (settings_map_hide_found) {
                window.addEventListener("load", hideFoundCaches, false);
            }

            function hideHiddenCaches() {
                if ( document.location.href.match(/&asq=/) ) return;
                var button = unsafeWindow.document.getElementById("m_myCaches").childNodes[3];
                if (button) {
                    button.click();
                }
            }

            if (settings_map_hide_hidden) {
                window.addEventListener("load", hideHiddenCaches, false);
            }

            // Apply Cache Type Filter
            function hideCacheTypes() {
                if ( document.location.href.match(/&asq=/) ) return;
                // Cache Types auf hidden setzen.
                if (settings_map_hide_2    && document.getElementById("Legend2"))    { document.getElementById("Legend2").click();    document.getElementById("Legend2").setAttribute("class", "ct_toggle ct2 ct_untoggled"); }
                if (settings_map_hide_9    && document.getElementById("Legend9"))    { document.getElementById("Legend9").click();    document.getElementById("Legend9").setAttribute("class", "ct_toggle ct9 ct_untoggled"); }
                if (settings_map_hide_5    && document.getElementById("Legend5"))    { document.getElementById("Legend5").click();    document.getElementById("Legend5").setAttribute("class", "ct_toggle ct5 ct_untoggled"); }
                if (settings_map_hide_3    && document.getElementById("Legend3"))    { document.getElementById("Legend3").click();    document.getElementById("Legend3").setAttribute("class", "ct_toggle ct3 ct_untoggled"); }
                if (settings_map_hide_6    && document.getElementById("Legend6"))    { document.getElementById("Legend6").click();    document.getElementById("Legend6").setAttribute("class", "ct_toggle ct6 ct_untoggled"); }
                if (settings_map_hide_453  && document.getElementById("Legend453"))  { document.getElementById("Legend453").click();  document.getElementById("Legend453").setAttribute("class", "ct_toggle ct453 ct_untoggled"); }
                if (settings_map_hide_7005 && document.getElementById("Legend7005")) { document.getElementById("Legend7005").click(); document.getElementById("Legend7005").setAttribute("class", "ct_toggle ct7005 ct_untoggled"); }
                if (settings_map_hide_13   && document.getElementById("Legend13"))   { document.getElementById("Legend13").click();   document.getElementById("Legend13").setAttribute("class", "ct_toggle ct13 ct_untoggled"); }
                if (settings_map_hide_1304 && document.getElementById("Legend1304")) { document.getElementById("Legend1304").click(); document.getElementById("Legend1304").setAttribute("class", "ct_toggle ct1304 ct_untoggled"); }
                if (settings_map_hide_4    && document.getElementById("Legend4"))    { document.getElementById("Legend4").click();    document.getElementById("Legend4").setAttribute("class", "ct_toggle ct4 ct_untoggled"); }
                if (settings_map_hide_11   && document.getElementById("Legend11"))   { document.getElementById("Legend11").click();   document.getElementById("Legend11").setAttribute("class", "ct_toggle ct11 ct_untoggled"); }
                if (settings_map_hide_137  && document.getElementById("Legend137"))  { document.getElementById("Legend137").click();  document.getElementById("Legend137").setAttribute("class", "ct_toggle ct137 ct_untoggled"); }
                if (settings_map_hide_8    && document.getElementById("Legend8"))    { document.getElementById("Legend8").click();    document.getElementById("Legend8").setAttribute("class", "ct_toggle ct8 ct_untoggled"); }
                if (settings_map_hide_1858 && document.getElementById("Legend1858")) { document.getElementById("Legend1858").click(); document.getElementById("Legend1858").setAttribute("class", "ct_toggle ct1858 ct_untoggled"); }
                // Gesamte Reihen zu den Cache Types auf hidden setzen.
                if (settings_map_hide_2) document.getElementById("LegendGreen").childNodes[0].setAttribute("class", "a_cat_displayed cat_untoggled");
                if (settings_map_hide_3) document.getElementById("LegendYellow").childNodes[0].setAttribute("class", "a_cat_displayed cat_untoggled");
                if (settings_map_hide_6 && settings_map_hide_453 && settings_map_hide_7005 && settings_map_hide_13) document.getElementById("LegendRed").childNodes[0].setAttribute("class", "a_cat_displayed cat_untoggled");
                if (settings_map_hide_4 && settings_map_hide_11 && settings_map_hide_137) document.getElementById("chkLegendWhite").childNodes[0].setAttribute("class", "a_cat_displayed cat_untoggled");
                if (settings_map_hide_8 && settings_map_hide_5 && settings_map_hide_1858) document.getElementById("chkLegendBlue").childNodes[0].setAttribute("class", "a_cat_displayed cat_untoggled");                
            }
            window.addEventListener("load", hideCacheTypes, false);
        }
    } catch (e) {
        gclh_error("Hide found/hidden Caches / Cache Types on Map", e);
    }

// Display Google-Maps warning. Hier wird eine Warnmeldung ausgegeben, wenn Leaflet-Map nicht aktiv ist.                        
    try {
        if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/map\//)) {
            function checkMap( waitCount ) {
                // Wenn Leaflet-Map aktiv ist dann ist alles ok, aktiv merken.
                if ( document.getElementsByClassName("leaflet-container")[0] ) {
                    setValue("gclhLeafletMapActive", true);
                    return;
                }
                // Wenn die Auswahl zu "Set Map Preferences" gerade angezeigt wird, dann wird keine Leaflet-Map kommen,
                // deshalb machen wir hier nichts.
                if ( document.getElementsByClassName("container")[0] ) {
                    return;
                }
                waitCount++;
                if ( waitCount <= 5 ) {  // 5 Sekunden lang
                    setTimeout( function () { checkMap( waitCount ) }, 1000); 
                } else {
                    // Wenn Leaflet-Map nicht aktiv und die Auswahl zu "Set Map Preferences" auch nicht angezeigt wird,
                    // dann ist wohl Google aktiv. Prüfen, ob zuvor Leaflet-Map aktiv war, der Status sich also geändert 
                    // hat, dann Meldung ausgeben und neuen Status "nicht aktiv" merken.
                    if ( getValue("gclhLeafletMapActive", true) ) {
                        var mess = "Please note that GC little helper only supports\n"
                                 + "the Leaflet-Map. You are using the Google-Map.\n\n"
                                 + "You can change the map in the left sidebar with \n"
                                 + "the button \"Set Map Preferences\".";
                        alert( mess );
                        setValue("gclhLeafletMapActive", false);
                    }
                }
            }
            checkMap( 0 );
        }
    } catch (e) {
        gclh_error("Display Google-Maps warning", e);
    }

// Count Fav-points
    try {
        if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/favorites\.aspx/)) {
            var table = getElementsByClass("Table BottomSpacing")[0];
            if (table) {
                var imgs = table.getElementsByTagName("img");
                var stats = new Object();
                var count = 0;
                if (imgs) {
                    for (var i = 0; i < imgs.length; i++) {
                        // Mail, Message und VIP Icons beim Zählen nicht beachten.
                        if ( imgs[i].title.match(/Send a m/) || imgs[i].title.match(/VIP/) ) continue;
                        if (imgs[i].src) {
                            if (!stats[imgs[i].src]) stats[imgs[i].src] = 0;
                            stats[imgs[i].src]++;
                            count++;
                        }
                    }
                }

                var tr = document.createElement("tr");

                var td = document.createElement("td");
                td.style.backgroundColor = "#DFE1D2";
                tr.appendChild(td);

                var td = document.createElement("td");
                td.style.backgroundColor = "#DFE1D2";
                tr.appendChild(td);

                var td = document.createElement("td");
                for (src in stats) {
                    var img = document.createElement("img");
                    img.src = src;
                    td.appendChild(img);
                    td.appendChild(document.createTextNode(" " + stats[src] + "  "));
                }
                td.style.backgroundColor = "#DFE1D2";
                tr.appendChild(td);

                var td = document.createElement("td");
                td.appendChild(document.createTextNode("Sum: " + count));
                td.style.backgroundColor = "#DFE1D2";
                tr.appendChild(td);

                table.appendChild(tr);
            }
        }
    } catch (e) {
        gclh_error("Count Fav-Points", e);
    }

// Improve Fieldnotes
    try {
        if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/fieldnotes\.aspx/)) {
            function gclh_select_all() {
                var state = document.getElementById("gclh_all").checked;
                var all = document.getElementsByTagName("input");
                for (var i = 0; i < all.length; i++) {
                    if (all[i].id.match(/ctl00_ContentBody_LogList/)) {
                        all[i].checked = state;
                    }
                }
            }

            //Mark duplicate field notes
            var existingNotes = {};
            var link = null;
            var date = null;
            var type = null;
            $('.Table tr').each(function (i, e) {
                link = $(e).find('td a[href*="cache_details.aspx?guid"]');
                if (link.length > 0) {
                    date = $($(e).find('td')[2]).text();
                    type = $($(e).find('td')[3]).text();
                    if (existingNotes[link[0].href + date + type]) {
                        $(existingNotes[link[0].href + date + type]).find('td').css("background-color", "#FE9C9C");
                        $(e).find('td').css("background-color", "#FE9C9C");
                    }
                    else {
                        existingNotes[link[0].href + date + type] = e;
                    }
                }
            });

            var table = getElementsByClass("Table")[0];
            if (table) {
                var stats = new Object();
                var types = new Object();
                var count = 0;
                var imgs = table.getElementsByTagName("img");
                for (var i = 0; i < imgs.length; i++) {
                    if (imgs[i].src.match(/images\/logtypes/)) {
                        count++;
                        if (!stats[imgs[i].src]) stats[imgs[i].src] = 0;
                        stats[imgs[i].src]++;
                    } else {
                        if (!types[imgs[i].src]) types[imgs[i].src] = 0;
                        types[imgs[i].src]++;
                    }
                }

                // Select All - on Top
                var a = document.createElement("a");
                a.href = "javascript:void(0);";
                var img = document.createElement("img");
                img.width = 16;
                img.height = 16;
                img.src = "/images/silk/tick.png";
                img.alt = "Click to Check/Uncheck all Items";
                a.addEventListener("click", function () {
                    document.getElementById("gclh_all").click();
                }, false);
                a.appendChild(img);
                table.childNodes[1].childNodes[1].childNodes[1].appendChild(a);

                // Summenzeile
                var tr = document.createElement("tr");

                var td = document.createElement("td");
                var checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.title = "Select All";
                checkbox.id = "gclh_all";
                checkbox.addEventListener("click", gclh_select_all, false);
                td.appendChild(checkbox);
                td.style.backgroundColor = "#DFE1D2";
                tr.appendChild(td);

                var td = document.createElement("td");
                for (src in types) {
                    var img = document.createElement("img");
                    img.src = src;
                    td.appendChild(img);
                    td.appendChild(document.createTextNode(" " + types[src] + "  "));
                }
                td.style.backgroundColor = "#DFE1D2";
                tr.appendChild(td);

                var td = document.createElement("td");
                td.style.verticalAlign = "top";
                var b = document.createElement("b");
                b.appendChild(document.createTextNode("Statistics"));
                td.appendChild(b);
                td.style.backgroundColor = "#DFE1D2";
                tr.appendChild(td);

                var td = document.createElement("td");
                for (src in stats) {
                    var img = document.createElement("img");
                    img.src = src;
                    td.appendChild(img);
                    td.appendChild(document.createTextNode(" " + stats[src] + "  "));
                }
                td.style.backgroundColor = "#DFE1D2";
                tr.appendChild(td);

                var td = document.createElement("td");
                td.appendChild(document.createTextNode("Sum: " + count));
                td.style.backgroundColor = "#DFE1D2";
                tr.appendChild(td);

                table.appendChild(tr);
            }
        }
    } catch (e) {
        gclh_error("Improve Fieldnotes", e);
    }

// Edit-Link to own Caches in Profile
    try {
        if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/(default\.aspx|owned\.aspx)$/) || document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/$/)) {
            var links = document.getElementsByTagName("a");

            for (var i = 0; i < links.length; i++) {
                if (links[i].href.match(/\/seek\/cache_details\.aspx\?/)) {
                    var headline = links[i].parentNode.parentNode.parentNode.childNodes[1].innerHTML;
                    if (headline) {
                        var match = links[i].href.match(/\/seek\/cache_details\.aspx\?guid=(.*)/);
                        if (match[1]) links[i].parentNode.innerHTML += " <a href='/hide/report.aspx?guid=" + match[1] + "'><img src='/images/stockholm/16x16/page_white_edit.gif'></a>";
                    }
                }
            }
        }

        // Image-Link at own caches
        if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/owned\.aspx/)) {
            var links = document.getElementsByTagName("a");

            for (var i = 0; i < links.length; i++) {
                if (links[i].href.match(/\/seek\/cache_details\.aspx\?/)) {
                    var headline = links[i].parentNode.parentNode.parentNode.childNodes[1].innerHTML;
                    if (headline) {
                        var match = links[i].href.match(/\/seek\/cache_details\.aspx\?guid=(.*)/);
                        if (match[1]) links[i].parentNode.innerHTML += " <a href='/seek/gallery.aspx?guid=" + match[1] + "'><img src='/images/stockholm/16x16/photos.gif'></a>";
                    }
                }
            }
        }
    } catch (e) {
        gclh_error("Additinal Links to own Caches in Profile", e);
    }

// Hide TBs/Coins in Profile
    try {
        if (settings_hide_visits_in_profile && document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\//)) {
            $(".Table.WordWrap tr").filter(function (index) {
                return $(this).find("img[src$='logtypes/75.png']").length !== 0;
            }).remove();
        }
    } catch (e) {
        gclh_error("Hide TBs/Coins in Profile", e);
    }

// Post log from Listing (inline)
    try {
        // iframe aufbauen und verbergen.             
        if (settings_log_inline && is_page("cache_listing") && document.getElementById("ctl00_ContentBody_MapLinks_MapLinks")) {
            var links = document.getElementsByTagName('a');

            var menu = false;
            var watch = false;
            var gallery = false;
            for (var i = 0; i < links.length; i++) {
                if (links[i].href.match(/log\.aspx\?ID/) && !menu) {
                    menu = links[i];
                } else if (links[i].href.match(/gallery\.aspx/) && !gallery && links[i].parentNode.tagName.toLowerCase() == "li") {
                    gallery = links[i];
                } else if (links[i].href.match(/watchlist\.aspx/) && !watch) {
                    watch = links[i];
                }
            }

            var head = document.getElementById("ctl00_ContentBody_MapLinks_MapLinks").parentNode.parentNode.nextSibling;

            function hide_iframe() {
                var frame = document.getElementById('gclhFrame');
                if (frame.style.display == "") frame.style.display = "none";
                else frame.style.display = "";
            }

            if (head && menu) {
                var match = menu.href.match(/\?ID=(.*)/);
                if (match && match[1]) {
                    var iframe = document.createElement("iframe");
                    iframe.setAttribute("id", "gclhFrame");
                    iframe.setAttribute("width", "100%");
                    iframe.setAttribute("height", "600px");
                    iframe.setAttribute("style", "border-top: 1px solid #b0b0b0; border-right: 0px; border-bottom: 1px solid #b0b0b0; border-left: 0px; overflow: auto; display: none;");
                    iframe.setAttribute("src", http + "://www.geocaching.com/seek/log.aspx?ID=" + match[1] + "&gclh=small");

                    var a = document.createElement("a");
                    a.setAttribute("href", "#gclhLogIt");
                    a.setAttribute("name", "gclhLogIt");
                    var img = document.createElement("img");
                    img.setAttribute("src", global_log_it_icon);
                    img.setAttribute("style", "margin-left: -10px;");
                    img.setAttribute("border", "0");
                    a.appendChild(img);
                    a.addEventListener("click", hide_iframe, false);

                    head.parentNode.insertBefore(a, head);
                    head.parentNode.insertBefore(iframe, head);
                }

                var a = document.createElement("a");
                a.setAttribute("href", "#gclhLogIt");
                a.setAttribute("class", "lnk");
                a.setAttribute("style", "padding:0px;");
                a.innerHTML = "<img src='/images/stockholm/16x16/comment_add.gif'> <span style='padding-left:4px;'>Log your visit (inline)</span>";
                a.addEventListener("click", hide_iframe, false);

                var li = document.createElement('li');
                li.appendChild(a);

                var link = false;
                if (gallery) link = gallery;
                else link = watch;

                if (link) link.parentNode.parentNode.insertBefore(li, link.parentNode);
            }
        }
        
        // Im aufgebauten iframe, quasi nicht im Cache Listing.                   
        if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/log\.aspx\?(.*)\&gclh\=small/)) { // Hide everything to be smart for the iframe :)
            if (document.getElementsByTagName('html')[0]) document.getElementsByTagName('html')[0].style.backgroundColor = "#FFFFFF";

            if (document.getElementsByTagName("header")[0]) document.getElementsByTagName("header")[0].style.display = "none";

            if (document.getElementById("Navigation")) document.getElementById("Navigation").style.display = "none";

            if (document.getElementById('ctl00_divBreadcrumbs')) document.getElementById('ctl00_divBreadcrumbs').style.display = "none";

            if (getElementsByClass('BottomSpacing')[0]) getElementsByClass('BottomSpacing')[0].style.display = "none";
            if (getElementsByClass('BottomSpacing')[1]) getElementsByClass('BottomSpacing')[1].style.display = "none";

            if (document.getElementById('divAdvancedOptions')) document.getElementById('divAdvancedOptions').style.display = "none";
            if (!settings_log_inline_tb && document.getElementById('ctl00_ContentBody_LogBookPanel1_TBPanel')) document.getElementById('ctl00_ContentBody_LogBookPanel1_TBPanel').style.display = "none";

            if (document.getElementById('ctl00_ContentBody_uxVistOtherListingLabel')) document.getElementById('ctl00_ContentBody_uxVistOtherListingLabel').style.display = "none";
            if (document.getElementById('ctl00_ContentBody_uxVistOtherListingGC')) document.getElementById('ctl00_ContentBody_uxVistOtherListingGC').style.display = "none";
            if (document.getElementById('ctl00_ContentBody_uxVisitOtherListingButton')) document.getElementById('ctl00_ContentBody_uxVisitOtherListingButton').style.display = "none";

            if (document.getElementById('ctl00_divContentSide')) document.getElementById('ctl00_divContentSide').style.display = "none";

            if (document.getElementById('UtilityNav')) document.getElementById('UtilityNav').style.display = "none";

            if (document.getElementsByTagName("footer")[0]) document.getElementsByTagName("footer")[0].style.display = "none";

            if (getElementsByClass('container')[1]) getElementsByClass('container')[1].style.display = "inline";

            var links = document.getElementsByTagName("a");
            for (var i = 0; i < links.length; i++) {
//--> $$#31FE Begin of change
                if ( !links[i].id.match(/(AllDroppedOff|AllVisited|AllClear)/i) ) {    
                    links[i].setAttribute("target", "_blank");
                }
//<-- $$#31FE End of change
            }
            var css = "";
            css += "#Content, #Content .container, .span-20 {width: " + ( parseInt( getValue("settings_new_width") ) - 60 ) + "px;} ";
            css += ".PostLogList .Textarea {height: 175px;} ";
            appendCssStyle(css);
        }
    } catch (e) {
        gclh_error("Inline Logging", e);
    }

// Post log from PMO-Listing as Basic Member(inline)
    try {
        // iframe aufbauen und verbergen.             
        if ( settings_log_inline_pmo4basic && is_page("cache_listing") && 
             ( document.getElementById("ctl00_ContentBody_memberComparePanel") || 
               document.getElementsByClassName("pmo-banner")[0]                ||
               document.getElementsByClassName("pmo-upsell")[0]                   ) ) {
            function hide_iframe() {
                var frame = document.getElementById('gclhFrame');
                if (frame.style.display == "") frame.style.display = "none";
                else frame.style.display = "";
            }

            var idParameter = null;
            if (document.URL.match(/wp=[a-zA-Z0-9]*|guid=[a-zA-Z0-9-]*|id=[0-9]*/)) idParameter = document.URL.match(/wp=[a-zA-Z0-9]*|guid=[a-zA-Z0-9-]*|id=[0-9]*/)[0];
            if (!idParameter | idParameter == "") idParameter = "wp=" + document.URL.match(/\/geocache\/([^_]*)/)[1];

            var iframe = document.createElement("iframe");
            iframe.setAttribute("id", "gclhFrame");
            iframe.setAttribute("width", "100%");
            iframe.setAttribute("height", "600px");
            iframe.setAttribute("style", "margin-bottom: 50px; border-top: 1px solid #b0b0b0; border-right: 0px; border-bottom: 1px solid #b0b0b0; border-left: 0px; overflow: auto; display: none;");
            iframe.setAttribute("src", http + "://www.geocaching.com/seek/log.aspx?" + idParameter + "&gclh=small");

            var a = document.createElement("a");
            a.setAttribute("href", "#gclhLogIt");
            a.setAttribute("name", "gclhLogIt");
            a.setAttribute("style", "border-bottom: 0px;");
            var img = document.createElement("img");
            img.setAttribute("src", global_log_it_icon);
            img.setAttribute("style", "margin-left: 350px; margin-top: 40px; margin-bottom: 50px;");
            img.setAttribute("border", "0");
            a.appendChild(img);
            a.addEventListener("click", hide_iframe, false);

            var banner = document.getElementsByClassName("pmo-banner")[0];

            banner.parentNode.insertBefore(a, banner);
            banner.parentNode.insertBefore(iframe, banner);
        }
        // Im aufgebauten iframe, quasi nicht im Cache Listing.                   
        else if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/log\.aspx\?(ID|guid|wp)\=[a-zA-Z0-9-]*\&gclh\=small/)) { // Hide everything to be smart for the iframe :)
            if (document.getElementsByTagName('html')[0]) document.getElementsByTagName('html')[0].style.backgroundColor = "#FFFFFF";

            if (document.getElementsByTagName("header")[0]) document.getElementsByTagName("header")[0].style.display = "none";

            if (document.getElementById('ctl00_divBreadcrumbs')) document.getElementById('ctl00_divBreadcrumbs').style.display = "none";

            if (getElementsByClass('BottomSpacing')[0]) getElementsByClass('BottomSpacing')[0].style.display = "none";
            if (getElementsByClass('BottomSpacing')[1]) getElementsByClass('BottomSpacing')[1].style.display = "none";

            if (document.getElementById('divAdvancedOptions')) document.getElementById('divAdvancedOptions').style.display = "none";
            if (!settings_log_inline_tb && document.getElementById('ctl00_ContentBody_LogBookPanel1_TBPanel')) document.getElementById('ctl00_ContentBody_LogBookPanel1_TBPanel').style.display = "none";

            if (document.getElementById('ctl00_ContentBody_uxVistOtherListingLabel')) document.getElementById('ctl00_ContentBody_uxVistOtherListingLabel').style.display = "none";
            if (document.getElementById('ctl00_ContentBody_uxVistOtherListingGC')) document.getElementById('ctl00_ContentBody_uxVistOtherListingGC').style.display = "none";
            if (document.getElementById('ctl00_ContentBody_uxVisitOtherListingButton')) document.getElementById('ctl00_ContentBody_uxVisitOtherListingButton').style.display = "none";

            if (document.getElementById('ctl00_divContentSide')) document.getElementById('ctl00_divContentSide').style.display = "none";

            if (document.getElementById('UtilityNav')) document.getElementById('UtilityNav').style.display = "none";

            if (document.getElementsByTagName("footer")[0]) document.getElementsByTagName("footer")[0].style.display = "none";

            if (getElementsByClass('container')[1]) getElementsByClass('container')[1].style.display = "inline";

            var links = document.getElementsByTagName("a");
            for (var i = 0; i < links.length; i++) {
//--> $$#31FE Begin of change
                if ( !links[i].id.match(/(AllDroppedOff|AllVisited|AllClear)/i) ) {    
                    links[i].setAttribute("target", "_blank");
                }
//<-- $$#31FE End of change
            }
            var css = "";
            css += "#Content, #Content .container, .span-20 {width: 780px;} ";
            css += ".PostLogList .Textarea {height: 175px;} ";
            appendCssStyle(css);
        }
    } catch (e) {
        gclh_error("Inline PMO Logging", e);
    }

// Loggen über Standard "Log It" Icons zu Premium Only Caches für Basic Members.  
    try {
        if ( settings_logit_for_basic_in_pmo ) {
            if ( document.getElementsByClassName('premium') ) { 
                var premiumTeile = document.getElementsByClassName('premium');
                for (var i = 0; i < premiumTeile.length; i++) {
                    if ( premiumTeile[i].href.match(/\/seek\/log\.aspx\?ID=/) ) {
                        premiumTeile[i].addEventListener("click", function() { buildLogItLink( this ); }, false);
                    }
                }
            }
        }
    } catch (e) {
        gclh_error("logit for basic in pmo", e);
    }

// Link ausführen trotz Tool Tipp.
    function buildLogItLink( premiumTeil ) {
        if ( premiumTeil.href.match(/\/seek\/log\.aspx\?ID=/) ) {
            if ( premiumTeil.href.match(/www\.geocaching\.com\//) ) { var href = premiumTeil.href; }
            else { var href = "https://www.geocaching.com" +  premiumTeil.href; }
            location = href;
        }
    }   
    
// Append '&visitcount=1' to all geochecker.com links (on listing pages)
    try {
        if (settings_visitCount_geocheckerCom && is_page("cache_listing")) {
            $('a[href^="http://www.geochecker.com/index.php?code="]').filter(':not([href*="visitcount=1"])').attr('href', function (i, str) {
                return str + '&visitcount=1';
            }).attr('rel', 'noreferrer');
        }
    } catch (e) {
        gclh_error("Append '&visitcount=1' to all geochecker.com links (on listing pages)", e);
    }

// Show amount of different Coins in public profile
    try {
        if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/profile\//) && document.getElementById('ctl00_ContentBody_ProfilePanel1_lnkCollectibles') && document.getElementById('ctl00_ContentBody_ProfilePanel1_lnkCollectibles').className == "Active") {

            function gclh_coin_stats(table_id) {
                var table = document.getElementById(table_id).getElementsByTagName("table");
                table = table[0];
                var rows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
                var sums = new Object();
                sums["tbs"] = 0;
                sums["coins"] = 0;
                sums["patches"] = 0;
                sums["signal"] = 0;
                sums["unknown"] = 0;
                var diff = new Object();
                diff["tbs"] = 0;
                diff["coins"] = 0;
                diff["patches"] = 0;
                diff["signal"] = 0;
                diff["unknown"] = 0;

                for (var i = 0; i < (rows.length - 1); i++) {
                    if (rows[i].innerHTML.match(/travel bug/i)) {
                        diff["tbs"]++;
                        sums["tbs"] += parseInt(rows[i].childNodes[5].innerHTML, 10);
                    } else if (rows[i].innerHTML.match(/geocoin/i)) {
                        diff["coins"]++;
                        sums["coins"] += parseInt(rows[i].childNodes[5].innerHTML, 10);
                    } else if (rows[i].innerHTML.match(/geopatch/i)) {
                        diff["patches"]++;
                        sums["patches"] += parseInt(rows[i].childNodes[5].innerHTML, 10);
                    } else if (rows[i].innerHTML.match(/signal/i)) {
                        diff["signal"]++;
                        sums["signal"] += parseInt(rows[i].childNodes[5].innerHTML, 10);
                    } else {
                        diff["unknown"]++;
                        sums["unknown"] += parseInt(rows[i].childNodes[5].innerHTML, 10);
                    }
                }

                var tfoot = table.getElementsByTagName("tfoot")[0];
                var tr = document.createElement("tr");
                var td = document.createElement("td");
                var new_table = "";
                td.colSpan = 3;

                new_table += "<table>";
                new_table += "  <tr>";
                new_table += "    <td></td>";
                new_table += "    <td><b>Sum</b></td>";
                new_table += "    <td><b>Different</b></td>";
                new_table += "  </tr>";
                new_table += "  <tr>";
                new_table += "    <td><b>Travel Bugs:</b></td>";
                new_table += "    <td style='text-align: center;'>" + sums["tbs"] + "</td>";
                new_table += "    <td style='text-align: center;'>" + diff["tbs"] + "</td>";
                new_table += "  </tr>";
                new_table += "  <tr>";
                new_table += "    <td><b>Geocoins:</b></td>";
                new_table += "    <td style='text-align: center;'>" + sums["coins"] + "</td>";
                new_table += "    <td style='text-align: center;'>" + diff["coins"] + "</td>";
                new_table += "  </tr>";
                new_table += "  <tr>";
                new_table += "    <td><b>Geopatches:</b></td>";
                new_table += "    <td style='text-align: center;'>" + sums["patches"] + "</td>";
                new_table += "    <td style='text-align: center;'>" + diff["patches"] + "</td>";
                new_table += "  </tr>";
                new_table += "  <tr>";
                new_table += "    <td><b>Signal Tags:</b></td>";
                new_table += "    <td style='text-align: center;'>" + sums["signal"] + "</td>";
                new_table += "    <td style='text-align: center;'>" + diff["signal"] + "</td>";
                new_table += "  </tr>";
                if (sums["unknown"] > 0 || diff["unknown"] > 0) {
                    new_table += "  <tr>";
                    new_table += "    <td><b>Unknown:</b></td>";
                    new_table += "    <td style='text-align: center;'>" + sums["unknown"] + "</td>";
                    new_table += "    <td style='text-align: center;'>" + diff["unknown"] + "</td>";
                    new_table += "  </tr>";
                    new_table += "</table>";
                }

                td.innerHTML = new_table;

                tr.appendChild(td);
                tfoot.appendChild(tr);
            }

            if ( document.getElementById("ctl00_ContentBody_ProfilePanel1_dlCollectibles") ) gclh_coin_stats("ctl00_ContentBody_ProfilePanel1_dlCollectibles");
            if ( document.getElementById("ctl00_ContentBody_ProfilePanel1_dlCollectiblesOwned") ) gclh_coin_stats("ctl00_ContentBody_ProfilePanel1_dlCollectiblesOwned");
        }
    } catch (e) {
        gclh_error("Show Coin-Sums", e);
    }

// Auto-Visit
    try {
        if (settings_autovisit && document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/log\.aspx/) && !document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/log\.aspx\?LUID=/) && !document.getElementById('ctl00_ContentBody_LogBookPanel1_CoordInfoLinkControl1_uxCoordInfoCode')) {
            function gclh_autovisit_save() {
                var match = this.value.match(/([0-9]*)/);
                if (!this.checked) {
                    setValue("autovisit_" + match[1], false);
                } else {
                    setValue("autovisit_" + match[1], true);
                }
            }

            // Add new option
            var selects = document.getElementsByTagName("select");
            for (var i = 0; i < selects.length; i++) {
                if (selects[i].id.match(/ctl00_ContentBody_LogBookPanel1_uxTrackables_repTravelBugs_ctl[0-9]*_ddlAction/)) {
                    var val = selects[i].childNodes[1].value;
                    var autovisit = document.createElement("input");
                    autovisit.setAttribute("type", "checkbox");
                    autovisit.setAttribute("id", selects[i].id + "_auto");
                    autovisit.setAttribute("value", val);
                    if (getValue("autovisit_" + val, false)) {
                        autovisit.setAttribute("checked", "checked");
                        selects[i].selectedIndex = 2;
                    }
                    autovisit.addEventListener("click", gclh_autovisit_save, false);

                    selects[i].parentNode.appendChild(autovisit);
                    selects[i].parentNode.appendChild(document.createTextNode(" AutoVisit"));
                }
            }

            // Select AutoVisit
            function gclh_autovisit() {
                var logtype = document.getElementById("ctl00_ContentBody_LogBookPanel1_ddLogType").value;
                if (logtype == 2 || logtype == 10 || logtype == 11) {
                    var selects = document.getElementsByTagName("select");
                    for (var i = 0; i < selects.length; i++) {
                        if (selects[i].id.match(/ctl00_ContentBody_LogBookPanel1_uxTrackables_repTravelBugs_ctl[0-9]*_ddlAction/)) {
                            var val = selects[i].childNodes[1].value;
                            if (getValue("autovisit_" + val, false)) {
                                var logoptions = selects[i].getElementsByTagName("option");
                                for (var k = 0; k < logoptions.length; k++) {
                                    if (logoptions[k].value == val + "_Visited") {
                                        selects[i].selectedIndex = k;
                                        break;
                                    }
                                }
                                document.getElementById("ctl00_ContentBody_LogBookPanel1_uxTrackables_hdnSelectedActions").value += val + "_Visited,";
                            }
                        }
                    }
                } else {
                    var selects = document.getElementsByTagName("select");
                    for (var i = 0; i < selects.length; i++) {
                        if (selects[i].id.match(/ctl00_ContentBody_LogBookPanel1_uxTrackables_repTravelBugs_ctl[0-9]*_ddlAction/) && selects[i].value.match(/_Visited/)) {
                            selects[i].selectedIndex = 0;
                        }
                    }
                }
                if (unsafeWindow.setSelectedActions) {
                    unsafeWindow.setSelectedActions();
                }
            }

            if (document.getElementById("ctl00_ContentBody_LogBookPanel1_ddLogType")) {
                window.addEventListener("load", gclh_autovisit, false);
                document.getElementById("ctl00_ContentBody_LogBookPanel1_ddLogType").addEventListener("click", gclh_autovisit, false);
            }
        }
    } catch (e) {
        gclh_error("Autovisit", e);
    }

// VIP
    try {
        if ( settings_show_vip_list                                                                    && 
             !isMemberInPmoCache()                                                                     &&
             $('.li-user-info').children().first()                                                     && 
             !document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/geocaches\.aspx/)    &&         // Nicht bei Geocaching Logs
             !document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/travelbugs\.aspx/)   &&         // Nicht bei Travelbugs
             !document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/benchmarks\.aspx/)   &&         // Nicht bei Benchmarks
//--> $$063FE Begin of insert
             !document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/favorites\.aspx/)    &&         // Nicht bei Eigene Favoriten, weil hier auch gegebenenfalls das Pseudonym steht
//<-- $$063FE End of insert
             ( is_page("cache_listing")                                                                   ||      // Cache Listing
               document.location.href.match(/^https?:\/\/www\.geocaching\.com\/track\/details\.aspx/)     ||      // TB Listing
               document.location.href.match(/^https?:\/\/www\.geocaching\.com\/(seek|track)\/log\.aspx/)  ||      // Post, Edit, View Cache-Logs und TB-Logs
               document.location.href.match(/^https?:\/\/www\.geocaching\.com\/email\/\?guid=/)           ||      // Mail schreiben
               document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/inventory\.aspx/)      ||      // TB Inventar
//--> $$063FE Begin of delete
//               document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/favorites\.aspx/)      ||      // Eigene Favoriten
//<-- $$063FE End of delete 
               document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my/)                       ||      // Profil
               document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/default\.aspx/)        ||      // Profil (Quicklist)
               document.location.href.match(/^https?:\/\/www\.geocaching\.com\/profile\//)                ||      // Öffentliches Profil
               document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/myfriends\.aspx/)         )) { // Friends
            var img_vip_off = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAKCAYAAAC9vt6cAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sHDhEzBX83tZcAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAsElEQVQoz6WSsQ2DUAxEz4gdfkdBQQUlDAU9E0ALHQWLsMAfA8o/BNVLkYCS0ETkGstn6+kk2yShPxRLEtxjmJmio8nzXN57SZL3XkVRnEtHNTNlWaZ5nj9AAHRdR9M0ANR1Td/38Iz2UZdlIUmS0zsB67rinGPfd5xzbNt2AUgiTVOmaboCAMqypG1bqqo6ve8E77oAhmEgiiLGcbwHCCEQxzEhhJ8B9hrcPqP9+0gPbh/tf/c8szwAAAAASUVORK5CYII=";
            var img_vip_on = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAKCAYAAAC9vt6cAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sHDhE0Aq4StvMAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAzklEQVQoz6WSwQvBcBTHP7/lanFT3DdzV9yw+RNc8E/s6A/YSa6KUrs4u4omB6KUKJoc5a+Q5rRlOCz7Xl7feu/zXu89AXjEUAKgszb/KrbKPSTfDJo2t8MdgNvhzrBlB0l+tMo9+o0R+8kxgASAgqFynrsAnGYumqF+deysTepmhZW9/QZouoLrXHk+nlwWVzRd+TnytOtQahfDOwBI51LImSTLwQo5I5POpn5O8Cnp3WiGyma8o1BXIi8yDKgpCEmQr0YHCMCLc0YR95Fe0bc6eQ97MqYAAAAASUVORK5CYII=";
            var vips = getValue("vips", false);
            if (!vips) vips = new Array();
            else {
                if (vips.match(/\\x/)) {  // Temporary fix for old data ..
                    vips = vips.replace(/\\x21/g, "!");
                    vips = vips.replace(/\\x22/g, "\"");
                    vips = vips.replace(/\\x23/g, "#");
                    vips = vips.replace(/\\x24/g, "$");
                    vips = vips.replace(/\\x25/g, "%");
                    vips = vips.replace(/\\x26/g, "&");
                    vips = vips.replace(/\\x27/g, "'");
                    vips = vips.replace(/\\x28/g, "(");
                    vips = vips.replace(/\\x29/g, ")");
                    vips = vips.replace(/\\x2A/g, "*");
                    vips = vips.replace(/\\x2B/g, "+");
                    vips = vips.replace(/\\x2C/g, ",");
                    vips = vips.replace(/\\x2F/g, "/");
                    vips = vips.replace(/\\x3A/g, ":");
                    vips = vips.replace(/\\x3B/g, ";");
                    vips = vips.replace(/\\x3C/g, "<");
                    vips = vips.replace(/\\x3D/g, "=");
                    vips = vips.replace(/\\x3E/g, ">");
                    vips = vips.replace(/\\x3F/g, "?");
                    vips = vips.replace(/\\x40/g, "@");
                    vips = vips.replace(/\\x5B/g, "[");
                    vips = vips.replace(/\\x5C/g, "\\");
                    vips = vips.replace(/\\x5D/g, "]");
                    vips = vips.replace(/\\x5E/g, "^");
                    vips = vips.replace(/\\x60/g, "`");
                    vips = vips.replace(/\\x7B/g, "{");
                    vips = vips.replace(/\\x7C/g, "|");
                    vips = vips.replace(/\\x7D/g, "}");
                    vips = vips.replace(/\\x7E/g, "~");
                    vips = vips.replace(/\\xA0/g, " ");
                    vips = vips.replace(/\\xA1/g, "¡");
                    vips = vips.replace(/\\xA2/g, "¢");
                    vips = vips.replace(/\\xA3/g, "£");
                    vips = vips.replace(/\\xA4/g, "¤");
                    vips = vips.replace(/\\xA5/g, "¥");
                    vips = vips.replace(/\\xA6/g, "¦");
                    vips = vips.replace(/\\xA7/g, "§");
                    vips = vips.replace(/\\xA8/g, "¨");
                    vips = vips.replace(/\\xA9/g, "©");
                    vips = vips.replace(/\\xAA/g, "ª");
                    vips = vips.replace(/\\xAB/g, "«");
                    vips = vips.replace(/\\xAC/g, "¬");
                    vips = vips.replace(/\\xAD/g, "­");
                    vips = vips.replace(/\\xAE/g, "®");
                    vips = vips.replace(/\\xAF/g, "¯");
                    vips = vips.replace(/\\xB0/g, "°");
                    vips = vips.replace(/\\xB1/g, "±");
                    vips = vips.replace(/\\xB2/g, "²");
                    vips = vips.replace(/\\xB3/g, "³");
                    vips = vips.replace(/\\xB4/g, "´");
                    vips = vips.replace(/\\xB5/g, "µ");
                    vips = vips.replace(/\\xB6/g, "¶");
                    vips = vips.replace(/\\xB7/g, "·");
                    vips = vips.replace(/\\xB8/g, "¸");
                    vips = vips.replace(/\\xB9/g, "¹");
                    vips = vips.replace(/\\xBA/g, "º");
                    vips = vips.replace(/\\xBB/g, "»");
                    vips = vips.replace(/\\xBC/g, "¼");
                    vips = vips.replace(/\\xBD/g, "½");
                    vips = vips.replace(/\\xBE/g, "¾");
                    vips = vips.replace(/\\xBF/g, "¿");
                    vips = vips.replace(/\\xC0/g, "À");
                    vips = vips.replace(/\\xC1/g, "Á");
                    vips = vips.replace(/\\xC2/g, "Â");
                    vips = vips.replace(/\\xC3/g, "Ã");
                    vips = vips.replace(/\\xC4/g, "Ä");
                    vips = vips.replace(/\\xC5/g, "Å");
                    vips = vips.replace(/\\xC6/g, "Æ");
                    vips = vips.replace(/\\xC7/g, "Ç");
                    vips = vips.replace(/\\xC8/g, "È");
                    vips = vips.replace(/\\xC9/g, "É");
                    vips = vips.replace(/\\xCA/g, "Ê");
                    vips = vips.replace(/\\xCB/g, "Ë");
                    vips = vips.replace(/\\xCC/g, "Ì");
                    vips = vips.replace(/\\xCD/g, "Í");
                    vips = vips.replace(/\\xCE/g, "Î");
                    vips = vips.replace(/\\xCF/g, "Ï");
                    vips = vips.replace(/\\xD0/g, "Ð");
                    vips = vips.replace(/\\xD1/g, "Ñ");
                    vips = vips.replace(/\\xD2/g, "Ò");
                    vips = vips.replace(/\\xD3/g, "Ó");
                    vips = vips.replace(/\\xD4/g, "Ô");
                    vips = vips.replace(/\\xD5/g, "Õ");
                    vips = vips.replace(/\\xD6/g, "Ö");
                    vips = vips.replace(/\\xD7/g, "×");
                    vips = vips.replace(/\\xD8/g, "Ø");
                    vips = vips.replace(/\\xD9/g, "Ù");
                    vips = vips.replace(/\\xDA/g, "Ú");
                    vips = vips.replace(/\\xDB/g, "Û");
                    vips = vips.replace(/\\xDC/g, "Ü");
                    vips = vips.replace(/\\xDD/g, "Ý");
                    vips = vips.replace(/\\xDE/g, "Þ");
                    vips = vips.replace(/\\xDF/g, "ß");
                    vips = vips.replace(/\\xE0/g, "à");
                    vips = vips.replace(/\\xE1/g, "á");
                    vips = vips.replace(/\\xE2/g, "â");
                    vips = vips.replace(/\\xE3/g, "ã");
                    vips = vips.replace(/\\xE4/g, "ä");
                    vips = vips.replace(/\\xE5/g, "å");
                    vips = vips.replace(/\\xE6/g, "æ");
                    vips = vips.replace(/\\xE7/g, "ç");
                    vips = vips.replace(/\\xE8/g, "è");
                    vips = vips.replace(/\\xE9/g, "é");
                    vips = vips.replace(/\\xEA/g, "ê");
                    vips = vips.replace(/\\xEB/g, "ë");
                    vips = vips.replace(/\\xEC/g, "ì");
                    vips = vips.replace(/\\xED/g, "í");
                    vips = vips.replace(/\\xEE/g, "î");
                    vips = vips.replace(/\\xEF/g, "ï");
                    vips = vips.replace(/\\xF0/g, "ð");
                    vips = vips.replace(/\\xF1/g, "ñ");
                    vips = vips.replace(/\\xF2/g, "ò");
                    vips = vips.replace(/\\xF3/g, "ó");
                    vips = vips.replace(/\\xF4/g, "ô");
                    vips = vips.replace(/\\xF5/g, "õ");
                    vips = vips.replace(/\\xF6/g, "ö");
                    vips = vips.replace(/\\xF7/g, "÷");
                    vips = vips.replace(/\\xF8/g, "ø");
                    vips = vips.replace(/\\xF9/g, "ù");
                    vips = vips.replace(/\\xFA/g, "ú");
                    vips = vips.replace(/\\xFB/g, "û");
                    vips = vips.replace(/\\xFC/g, "ü");
                    vips = vips.replace(/\\xFD/g, "ý");
                    vips = vips.replace(/\\xFE/g, "þ");
                    vips = vips.replace(/\\xFF/g, "ÿ");
                }
                vips = vips.replace(/, (?=,)/g, ",null");
                vips = JSON.parse(vips);
            }
            var myself = $('.li-user-info').children().first().text();
            var gclh_build_vip_list = function () {
            };

            // Add to VIP - image
            function gclh_add_vip() {
                var user = this.name;

                vips.push(user);
                vips.sort(caseInsensitiveSort);
                setValue("vips", JSON.stringify(vips));

                var icons = document.getElementsByName(user);
                for (var i = 0; i < icons.length; i++) {
                    var img = icons[i].childNodes[0];
                    img.setAttribute("src", img_vip_on);
                    img.setAttribute("title", "Remove " + user + " from VIP-List");
                    icons[i].removeEventListener("click", gclh_add_vip, false);
                    icons[i].addEventListener("click", gclh_del_vip, false);
                }

                gclh_build_vip_list();
                setLinesColorVip( user );
            }

            function gclh_del_vip() {
                var vips_new = new Array();
                var user = this.name;

                for (var i = 0; i < vips.length; i++) {
                    if (vips[i] != user) vips_new.push(vips[i]);
                }
                vips = vips_new;
                setValue("vips", JSON.stringify(vips));

                var icons = document.getElementsByName(user);
                for (var i = 0; i < icons.length; i++) {
                    var img = icons[i].childNodes[0];
                    img.setAttribute("src", img_vip_off);
                    img.setAttribute("title", "Add " + user + " to VIP-List");
                    icons[i].removeEventListener("click", gclh_del_vip, false);
                    icons[i].addEventListener("click", gclh_add_vip, false);
                }

                gclh_build_vip_list();
                setLinesColorVip( user );
            }

            // Listing
            if (is_page("cache_listing")) {
                var all_users = new Array();
                var log_infos = new Object();
                var log_infos_long = new Array();
                var index = 0;
                var links = document.getElementsByTagName('a');
                var owner = "";
                var owner_name = "";
                if (document.getElementById('ctl00_ContentBody_mcd1')) {
                    owner = get_real_owner();
                    if (!owner) owner = urldecode(document.getElementById('ctl00_ContentBody_mcd1').childNodes[1].innerHTML);
                    owner_name = owner;
                }

                for (var i = 0; i < links.length; i++) {
                    if (links[i].href.match(/https?:\/\/www\.geocaching\.com\/profile\/\?guid=/) && links[i].parentNode.className != "logOwnerStats" && !links[i].childNodes[0].src) {
                        if (links[i].id) links[i].name = links[i].id; // To be able to jump to this location

                        var matches = links[i].href.match(/https?:\/\/www\.geocaching\.com\/profile\/\?guid=([a-zA-Z0-9]*)/);
                        var user = decode_innerHTML(links[i]);
                        if (links[i].parentNode.id == "ctl00_ContentBody_mcd1") {
                            user = owner;
                        }

                        // Icon
                        var link = document.createElement("a");
                        var img = document.createElement("img");
                        img.setAttribute("border", "0");
                        link.appendChild(img);
                        link.setAttribute("href", "javascript:void(0);");
                        link.setAttribute("name", user);

                        if (in_array(user, vips)) {
                            img.setAttribute("src", img_vip_on);
                            img.setAttribute("title", "Remove " + user + " from VIP-List");
                            link.addEventListener("click", gclh_del_vip, false);
                        } else {
                            img.setAttribute("src", img_vip_off);
                            img.setAttribute("title", "Add " + user + " to VIP-List");
                            link.addEventListener("click", gclh_add_vip, false);
                        }

                        links[i].parentNode.insertBefore(link, links[i].nextSibling);
                        links[i].parentNode.insertBefore(document.createTextNode(" "), links[i].nextSibling);
                    }
                }

                // Show VIP List
                var map = document.getElementById("ctl00_ContentBody_detailWidget");
                var box = document.createElement("div");
                var headline = document.createElement("h3");
                var body = document.createElement("div");
                box.setAttribute("class", "CacheDetailNavigationWidget NoPrint");
                headline.setAttribute("class", "WidgetHeader");
                body.setAttribute("class", "WidgetBody");
                body.setAttribute("id", "gclh_vip_list");
                headline.innerHTML = "<img width=\"16\" height=\"16\" title=\"VIP-List\" alt=\"VIP-List\" src=\"" + http + "://www.geocaching.com/images/icons/icon_attended.gif\"> VIP-List";
//--> $$064FE Begin of change
                if ( settings_make_vip_lists_hideable ) {
                    headline.innerHTML = "<img id='lnk_gclh_vip_list' title='' src='' style='cursor: pointer'> " + headline.innerHTML;
                }
//<-- $$064FE End of change
                box.appendChild(headline);
                box.appendChild(body);
                box.setAttribute("style", "margin-top: 1.5em;");
                map.parentNode.insertBefore(box, map);
//--> $$064FE Begin of insert
                if ( settings_make_vip_lists_hideable ) {
                    showHideBoxCL("lnk_gclh_vip_list", true);
                    document.getElementById("lnk_gclh_vip_list").addEventListener("click", function() {showHideBoxCL(this.id, false)}, false);
                }
//<-- $$064FE End of insert

                // Show VIP List "not found"
                if (settings_vip_show_nofound) {
                    var box2 = document.createElement("div");
                    var headline2 = document.createElement("h3");
                    var body2 = document.createElement("div");
                    box2.setAttribute("class", "CacheDetailNavigationWidget NoPrint");
                    headline2.setAttribute("class", "WidgetHeader");
                    body2.setAttribute("class", "WidgetBody");
                    body2.setAttribute("id", "gclh_vip_list_nofound");
                    headline2.innerHTML = "<img width=\"16\" height=\"16\" title=\"VIP-List\" alt=\"VIP-List\" src=\"" + http + "://www.geocaching.com/images/icons/icon_attended.gif\"> VIP-List \"not found\"";
//--> $$064FE Begin of change  
                    if ( settings_make_vip_lists_hideable ) {
                        headline2.innerHTML = "<img id='lnk_gclh_vip_list_nofound' title='' src='' style='cursor: pointer'> " + headline2.innerHTML;
                    }
//<-- $$064FE End of change
                    box2.appendChild(headline2);
                    box2.appendChild(body2);
                    box2.innerHTML = box2.innerHTML;
                    map.parentNode.insertBefore(box2, map);
//--> $$064FE Begin of insert
                    if ( settings_make_vip_lists_hideable ) {
                        showHideBoxCL("lnk_gclh_vip_list_nofound", true);
                        document.getElementById("lnk_gclh_vip_list_nofound").addEventListener("click", function() {showHideBoxCL(this.id, false)}, false);
                    }
//<-- $$064FE End of insert
                }

                var css = "a.gclh_log:hover { " +
                    "  text-decoration:underline;" +
                    "  position: relative;" +
                    "}" +
                    "a.gclh_log span {" +
                    "  display: none;" +
                    "  position: absolute;" +
                    "  top:-310px;" +
                    "  left:-705px;" +
                    "  width: 700px;" +
                    "  padding: 2px;" +
                    "  text-decoration:none;" +
                    "  text-align:left;" +
                    "  vertical-align:top;" +
                    "  color: #000000;" +
                    "}" +
                    "a.gclh_log:hover span { " +
                    "  display: block;" +
                    "  top: 10px;" +
                    "  border: 1px solid #8c9e65;" +
                    "  background-color:#dfe1d2;" +
                    "  z-index:10000;" +
                    "}";
                GM_addStyle(css);

                gclh_build_vip_list = function () {
                    var show_owner = settings_show_owner_vip_list;
                    var list = document.getElementById("gclh_vip_list");
                    list.innerHTML = "";

                    // Liste "not found"-VIPs
                    var list_nofound = false;
                    if (document.getElementById("gclh_vip_list_nofound")) {
                        list_nofound = document.getElementById("gclh_vip_list_nofound");
                        list_nofound.innerHTML = "";
                    }
                    users_found = new Array();

                    function gclh_build_long_list() {
                        if ( getValue("settings_load_logs_with_gclh") == false ) return;
                        for (var i = 0; i < log_infos_long.length; i++) {
                            var user = log_infos_long[i]["user"];
                            if (in_array(user, vips) || user == owner_name) {
                                if (!log_infos_long[i]["date"]) continue;

                                if (log_infos_long[i]["icon"].match(/\/(2|10)\.png$/)) users_found.push(user); // fuer not found liste

                                var span = document.createElement("span");
                                var profile = document.createElement("a");
                                profile.setAttribute("href", http + "://www.geocaching.com/profile/?u=" + urlencode(user));
                                profile.innerHTML = user;
                                if (owner_name && owner_name == user) {
                                    profile.style.color = '#8C0B0B';
                                } else if (user == myself) {
                                    profile.style.color = '#778555';
                                }
                                if ( settings_show_mail_in_viplist && settings_show_mail && settings_show_vip_list ) noBreakInLine( profile, 93, user );
                                else noBreakInLine( profile, 112, user );
                                span.appendChild(profile);

                                // VIP-Link
                                var link = document.createElement("a");
                                var img = document.createElement("img");
                                img.setAttribute("border", "0");
                                link.appendChild(img);
                                link.setAttribute("href", "javascript:void(0);");
                                link.setAttribute("name", user);

                                if (owner_name && owner_name == user && !in_array(user, vips)) {
                                    img.setAttribute("src", img_vip_off);
                                    img.setAttribute("title", "Add " + user + " to VIP-List");
                                    link.addEventListener("click", gclh_add_vip, false);
                                } else {
                                    img.setAttribute("src", img_vip_on);
                                    img.setAttribute("title", "Remove " + user + " from VIP-List");
                                    link.addEventListener("click", gclh_del_vip, false);
                                }

                                // Log-Date and Link
                                var log_text = document.createElement("span");
                                log_text.innerHTML = "<img src='" + log_infos_long[i]["icon"] + "'> <b>" + user + " - " + log_infos_long[i]["date"] + "</b><br/>" + log_infos_long[i]["log"];
                                var log_img = document.createElement("img");
                                var log_link = document.createElement("a");
                                log_link.setAttribute("href", "#" + log_infos_long[i]["id"]);
                                log_link.className = "gclh_log";
                                log_link.addEventListener("click", function () {
                                    document.getElementById("gclh_load_all_logs").click();
                                }, false);
                                log_img.setAttribute("src", log_infos_long[i]["icon"]);
                                log_img.setAttribute("border", "0");
                                log_link.appendChild(document.createTextNode(log_infos_long[i]["date"]));
                                log_link.appendChild(log_text);

                                list.appendChild(log_img);
                                list.appendChild(document.createTextNode("   "));
                                list.appendChild(log_link);
                                list.appendChild(document.createTextNode("   "));
                                list.appendChild(span);
                                list.appendChild(document.createTextNode("   "));
                                list.appendChild(link);
                                if ( settings_show_mail_in_viplist && settings_show_mail && settings_show_vip_list ) buildSendIcons( list, user, "per u" );
                                list.appendChild(document.createElement("br"));
                            }
                        }
                    }

                    function gclh_build_list(user) {
                        if ( getValue("settings_load_logs_with_gclh") == false ) return;
                        if (!show_owner && owner_name && owner_name == user) return true;
                        if (in_array(user, all_users) || (owner_name == user)) {
                            var span = document.createElement("span");
                            var profile = document.createElement("a");
                            profile.setAttribute("href", http + "://www.geocaching.com/profile/?u=" + urlencode(user));
                            profile.innerHTML = user;
                            if (show_owner && owner_name && owner_name == user) {
                                span.appendChild(document.createTextNode("Owner: "));
                                show_owner = false;
                            } else if (user == myself) {
                                span.appendChild(document.createTextNode("Me: "));
                            }
                            span.appendChild(profile);

                            // VIP-Link
                            var link = document.createElement("a");
                            var img = document.createElement("img");
                            img.setAttribute("border", "0");
                            link.appendChild(img);
                            link.setAttribute("href", "javascript:void(0);");
                            link.setAttribute("name", user);

                            if (owner_name && owner_name == user && !in_array(user, vips)) {
                                img.setAttribute("src", img_vip_off);
                                img.setAttribute("title", "Add " + user + " to VIP-List");
                                link.addEventListener("click", gclh_add_vip, false);
                            } else {
                                img.setAttribute("src", img_vip_on);
                                img.setAttribute("title", "Remove " + user + " from VIP-List");
                                link.addEventListener("click", gclh_del_vip, false);
                            }

                            list.appendChild(span);
                            list.appendChild(document.createTextNode("   "));
                            list.appendChild(link);
                            if ( settings_show_mail_in_viplist && settings_show_mail && settings_show_vip_list ) buildSendIcons( list, user, "per u" );
 
                            // Log-Links
                            for (var x = 0; x < log_infos[user].length; x++) {
                                if (log_infos[user][x] && log_infos[user][x]["icon"] && log_infos[user][x]["id"]) {
                                    if (log_infos[user][x]["icon"].match(/\/(2|10)\.png$/)) users_found.push(user); // fuer not found liste

                                    var image = document.createElement("img");
                                    var log_text = document.createElement("span");
                                    log_text.innerHTML = "<img src='" + log_infos[user][x]["icon"] + "'> <b>" + user + " - " + log_infos[user][x]["date"] + "</b><br/>" + log_infos[user][x]["log"];
                                    image.setAttribute("src", log_infos[user][x]["icon"]);
                                    image.setAttribute("border", "0");

                                    if (log_infos[user][x]["date"]) {
                                        image.setAttribute("title", log_infos[user][x]["date"]);
                                        image.setAttribute("alt", log_infos[user][x]["date"]);
                                    }

                                    var a = document.createElement("a");
                                    a.setAttribute("href", "#" + log_infos[user][x]["id"]);
                                    a.className = "gclh_log";
                                    a.addEventListener("click", function () {
                                        document.getElementById("gclh_load_all_logs").click();
                                    }, false);
                                    a.appendChild(image);
                                    a.appendChild(log_text);

                                    list.appendChild(document.createTextNode(" "));
                                    list.appendChild(a);
                                }
                            }

                            list.appendChild(document.createElement("br"));
                        }
                    }

                    owner_name = html_to_str(owner_name);
                    if (settings_show_long_vip) {
                        gclh_build_long_list();
                    } else {
                        if (!log_infos[owner_name]) {
                            log_infos[owner_name] = new Array();
                        }
                        gclh_build_list(owner_name);
                        for (var i = 0; i < vips.length; i++) {
                            gclh_build_list(vips[i]);
                        }
                    }

                    // "Not found"-Liste erstellen
                    if (document.getElementById("gclh_vip_list_nofound")) {
                        for (var i = 0; i < vips.length; i++) {
                            if ( getValue("settings_load_logs_with_gclh") == false ) break;
                            var user = vips[i];
                            if (in_array(user, users_found)) continue;

                            var span = document.createElement("span");
                            var profile = document.createElement("a");
                            profile.setAttribute("href", http + "://www.geocaching.com/profile/?u=" + urlencode(user));
                            profile.innerHTML = user;
                            if (owner_name && owner_name == user) {
                                continue;
                            } else if (user == myself) {
                                continue;
                            }
                            span.appendChild(profile);

                            // VIP-Link
                            var link = document.createElement("a");
                            var img = document.createElement("img");
                            img.setAttribute("border", "0");
                            link.appendChild(img);
                            link.setAttribute("href", "javascript:void(0);");
                            link.setAttribute("name", user);

                            img.setAttribute("src", img_vip_on);
                            img.setAttribute("title", "Remove " + user + " from VIP-List");
                            link.addEventListener("click", gclh_del_vip, false);

                            list_nofound.appendChild(span);
                            list_nofound.appendChild(document.createTextNode("   "));
                            list_nofound.appendChild(link);
                            if ( settings_show_mail_in_viplist && settings_show_mail && settings_show_vip_list ) buildSendIcons( list_nofound, user, "per u" );
                            list_nofound.appendChild(document.createElement("br"));
                        }
                    }
                }
                gclh_build_vip_list();
                
            } else if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\//) && document.getElementById("ctl00_ContentBody_uxBanManWidget")) {
                var widget = document.createElement("div");
                var headline = document.createElement("h3");
                var box = document.createElement("div");

                widget.setAttribute("class", "YourProfileWidget");
                headline.setAttribute("class", "WidgetHeader");
                headline.appendChild(document.createTextNode("All my VIPs"));
                var box2 = document.createElement("div");
                box2.setAttribute("class", "WidgetBody");
                box2.setAttribute("style", "padding: 0;");   // Wegen 2 WidgetBodys
                box.setAttribute("id", "box_vips");
                box.setAttribute("class", "WidgetBody");

                widget.appendChild(headline);
                widget.appendChild(box2);
                box2.appendChild(box);
                document.getElementById("ctl00_ContentBody_uxBanManWidget").parentNode.insertBefore(widget, document.getElementById("ctl00_ContentBody_uxBanManWidget"));

                gclh_build_vip_list = function () {
                    var box = document.getElementById("box_vips");
                    if (!box) return false;
                    box.innerHTML = "";

                    for (var i = 0; i < vips.length; i++) {
                        var user = vips[i];
                        var span = document.createElement("span");
                        var profile = document.createElement("a");
                        profile.setAttribute("href", http + "://www.geocaching.com/profile/?u=" + urlencode(user));
                        profile.innerHTML = user;
                        span.appendChild(profile);

                        // VIP-Link
                        var link = document.createElement("a");
                        var img = document.createElement("img");
                        img.setAttribute("border", "0");
                        link.appendChild(img);
                        link.setAttribute("href", "javascript:void(0);");
                        link.setAttribute("name", user);
                        img.setAttribute("src", img_vip_on);
                        img.setAttribute("title", "Remove " + user + " from VIP-List");
                        link.addEventListener("click", gclh_del_vip, false);

                        box.appendChild(span);
                        box.appendChild(document.createTextNode("   "));
                        box.appendChild(link);
                        if ( settings_show_mail_in_allmyvips && settings_show_mail && settings_show_vip_list ) buildSendIcons( box, user, "per u" );
                        box.appendChild(document.createElement("br"));
                    }
                }
                gclh_build_vip_list();
                
            } else if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/myfriends\.aspx/)) {
                // Friendlist - VIP-Icon
                gclh_build_vip_list = function () {
                } // There is no list to show, but ths function will be called from gclh_del_vip/gclh_add_vip
                var links = document.getElementsByTagName('a');
                for (var i = 0; i < links.length; i++) {
                    if (links[i].href.match(/https?:\/\/www\.geocaching\.com\/profile\/\?guid=/) && links[i].id) {

                        // VIP-Link
                        var user = links[i].innerHTML.replace(/&amp;/, '&');
                        var link = document.createElement("a");
                        var img = document.createElement("img");
                        img.setAttribute("border", "0");
                        link.appendChild(img);
                        link.setAttribute("href", "javascript:void(0);");
                        link.setAttribute("name", user);

                        if (in_array(user, vips)) {
                            img.setAttribute("src", img_vip_on);
                            img.setAttribute("title", "Remove " + user + " from VIP-List");
                            link.addEventListener("click", gclh_del_vip, false);
                        } else {
                            img.setAttribute("src", img_vip_off);
                            img.setAttribute("title", "Add " + user + " to VIP-List");
                            link.addEventListener("click", gclh_add_vip, false);
                        }

                        links[i].parentNode.insertBefore(link, links[i].nextSibling);
                        links[i].parentNode.insertBefore(document.createTextNode("   "), links[i].nextSibling);
                    }
                }
            } else if ( document.location.href.match(/^https?:\/\/www\.geocaching\.com\/track\/details\.aspx/)     ||
                        document.location.href.match(/^https?:\/\/www\.geocaching\.com\/(seek|track)\/log\.aspx/)  ||
                        document.location.href.match(/^https?:\/\/www\.geocaching\.com\/email\/\?guid=/)           ||
//--> $$063FE Begin of change
//                        document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/inventory\.aspx/)      ||
//                        document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/favorites\.aspx/)         ) {
//                // TB Listing. Post, Edit, View Cache-Logs und TB-Logs. Mail schreiben. Eigene Favoriten. - VIP-Icon.
                        document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/inventory\.aspx/)         ) {
                // TB Listing. Post, Edit, View Cache-Logs und TB-Logs. Mail schreiben. - VIP-Icon.
//<-- $$063FE End of change
                gclh_build_vip_list = function () {
                } // There is no list to show, but this function will be called from gclh_del_vip/gclh_add_vip
                var links = document.getElementsByTagName('a');
                
                for (var i = 0; i < links.length; i++) {
                    if (links[i].href.match(/https?:\/\/www\.geocaching\.com\/profile\/\?guid=/)) {

                        // Wenn es sich hier um den User "In the hands of ..." im TB Listing handelt, dann nicht weitermachen, weil der 
                        // Username nicht wirklich bekannt ist.
                        if ( links[i].id == "ctl00_ContentBody_BugDetails_BugLocation" ) continue;

                        var matches = links[i].href.match(/https?:\/\/www\.geocaching\.com\/profile\/\?guid=([a-zA-Z0-9]*)/);
                        var user = decode_innerHTML(links[i]);

                        // Icon
                        var link = document.createElement("a");
                        var img = document.createElement("img");
                        img.setAttribute("border", "0");
                        img.setAttribute("style", "margin-left: 0px; margin-right: 0px;");
                        link.appendChild(img);
                        link.setAttribute("href", "javascript:void(0);");
                        link.setAttribute("name", user);

                        if (in_array(user, vips)) {
                            img.setAttribute("src", img_vip_on);
                            img.setAttribute("title", "Remove " + user + " from VIP-List");
                            link.addEventListener("click", gclh_del_vip, false);
                        } else {
                            img.setAttribute("src", img_vip_off);
                            img.setAttribute("title", "Add " + user + " to VIP-List");
                            link.addEventListener("click", gclh_add_vip, false);
                        }

                        links[i].parentNode.insertBefore(link, links[i].nextSibling);
                        links[i].parentNode.insertBefore(document.createTextNode(" "), links[i].nextSibling);
                    }
                }
            } else if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/profile\//) && document.getElementById("ctl00_ContentBody_ProfilePanel1_lblMemberName")) {
                // Public Profile - VIP-Icon
                gclh_build_vip_list = function () {
                } // There is no list to show, but ths function will be called from gclh_del_vip/gclh_add_vip
                var user = document.getElementById("ctl00_ContentBody_ProfilePanel1_lblMemberName").innerHTML.replace(/&amp;/, '&');
                var link = document.createElement("a");
                var img = document.createElement("img");
                img.setAttribute("border", "0");
                link.appendChild(img);
                link.setAttribute("href", "javascript:void(0);");
                link.setAttribute("name", user);

                if (in_array(user, vips)) {
                    img.setAttribute("src", img_vip_on);
                    img.setAttribute("title", "Remove " + user + " from VIP-List");
                    link.addEventListener("click", gclh_del_vip, false);
                } else {
                    img.setAttribute("src", img_vip_off);
                    img.setAttribute("title", "Add " + user + " to VIP-List");
                    link.addEventListener("click", gclh_add_vip, false);
                }

                document.getElementById("ctl00_ContentBody_ProfilePanel1_lblMemberName").appendChild(document.createTextNode(" "));
                img.setAttribute("style", "margin-left: 0px; margin-right: 0px"); 
                document.getElementById("ctl00_ContentBody_ProfilePanel1_lblMemberName").appendChild(link);
            }
        }
    } catch (e) {
        gclh_error("VIP", e);
    }

// Improve inventory list in cache listing.
    try {
        if ( is_page("cache_listing") ) {
            // Trackable Namen kürzen, damit nicht umgebrochen wird, und Title setzen.
            if ( document.getElementById("ctl00_ContentBody_uxTravelBugList_uxInventoryLabel") ) {
                var inventoryWidget = document.getElementById("ctl00_ContentBody_uxTravelBugList_uxInventoryLabel").parentNode.parentNode;
                var inventoryWidgetBody = inventoryWidget.getElementsByClassName("WidgetBody")[0];
                var inventory = inventoryWidgetBody.getElementsByTagName("span");
                for ( var i = 0; i < inventory.length; i++ ) {
                    noBreakInLine( inventory[i], 203, inventory[i].innerHTML );
                }
            }
        }
    } catch (e) {
        gclh_error("improve inventory list in cache listing", e);
    }
    
//--> $$065FE Begin of insert
// Wenn nicht alle eigenen Logs geladen werden, weil beispielsweise das Laden der Seite über den Browser gestoppt wurde, dann 
// angeben wieviele Logs geladen wurden und das Datum des letzten geladenen Logs angeben.
    try {
        if ( document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/logs\.aspx?/) ) {
            if ( document.getElementById("divContentMain") && document.getElementById("divContentMain").children[2] && document.getElementsByTagName("tr")[0] ) {
                var result = document.getElementById("divContentMain").children[2];
                var count = result.innerHTML.match(/\s+(\d+)\s+/);
                if ( count ) {
                    var loaded = document.getElementsByTagName("tr").length;
                    if ( parseInt(count[1]) > loaded ) {
                        if ( document.getElementsByTagName("tr")[loaded-1].children[2] &&
                             document.getElementsByTagName("tr")[loaded-1].children[2].innerHTML.match(/(\S+)/) ) var lastLog = loaded-1;
                        else if ( document.getElementsByTagName("tr")[loaded-2].children[2] &&
                                  document.getElementsByTagName("tr")[loaded-2].children[2].innerHTML.match(/(\S+)/) ) var lastLog = loaded-2;
                        else var lastLog = "";
                        if ( lastLog != "" ) var dateLastLog =  ". Last date is " + document.getElementsByTagName("tr")[lastLog].children[2].innerHTML.replace(/\s/g, "");
                        else var dateLastLog = ""; 
                        result.innerHTML = result.innerHTML + " (Only " + loaded + " logs loaded" + dateLastLog + ".)";
                    }
                }
            }
        }
    } catch (e) {
        gclh_error("stopped logs loaded", e);
    }
//<-- $$065FE End of insert
    
// Improve "My Profile"   
    try {
        if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my/)) {
            var code = "function hide_box(i){";
            code += "  if(document.getElementById('box_'+i).style.display == 'none'){";
            code += "    document.getElementById('box_'+i).style.display = 'block';";
            code += "    document.getElementById('lnk_'+i).src = '" + http + "://www.geocaching.com/images/minus.gif';";
            code += "    document.getElementById('lnk_'+i).title = 'hide';";
            code += "  }else{";
            code += "    document.getElementById('box_'+i).style.display = 'none';";
            code += "    document.getElementById('lnk_'+i).src = '" + http + "://www.geocaching.com/images/plus.gif';";
            code += "    document.getElementById('lnk_'+i).title = 'show';";
            code += "  }";
            code += "}";

            var script = document.createElement("script");
            script.innerHTML = code;
//--> $$064FE Begin of change
//            document.getElementsByTagName("body")[0].appendChild(script);
            if ( document.getElementsByTagName("body")[0] ) document.getElementsByTagName("body")[0].appendChild(script);
//<-- $$064FE End of change

            var boxes = getElementsByClass("WidgetHeader");

            function saveStates() {
                // Wenn Linklist angezeigt wird, dann mit Speicherindex "i" von Linklist beginnen, er ist 0. Ansonsten mit 1 beginnen.                
                if ( settings_bookmarks_show ) var i = 0;
                else var i = 1;
                // Alle gefundenen WidgetBody "wb" verarbeiten und ihnen den zugehörigen Speicherindex "i" zuordnen. 
                for (var wb = 0; wb < boxes.length; wb++) {
                    var box = boxes[wb].parentNode.getElementsByClassName('WidgetBody')[0];
                    if (typeof(box) == "undefined") continue;
                    var show = box.style.display;
                    if (typeof(show) == "undefined" || show != "none") show = "block";
                    setValue("show_box[" + i + "]", show);
                    i++;
                }
            }

            // Wenn Linklist angezeigt wird, dann mit Speicherindex "i" von Linklist beginnen, er ist 0. Ansonsten mit 1 beginnen.                
            if ( settings_bookmarks_show ) var i = 0;
            else var i = 1;
            // Alle gefundenen WidgetBody "wb" verarbeiten und ihnen den zugehörigen Speicherindex "i" zuordnen. 
            for (var wb = 0; wb < boxes.length; wb++) {
                var box = boxes[wb].parentNode.getElementsByClassName('WidgetBody')[0];
                if (typeof(box) != "undefined") {
                    box.setAttribute("id", "box_" + i);
                    if (typeof(getValue("show_box[" + i + "]")) != "undefined") box.style.display = getValue("show_box[" + i + "]");
                    if (box.style.display == "none") {
                        boxes[wb].innerHTML = "<img id='lnk_" + i + "' src='" + http + "://www.geocaching.com/images/plus.gif' onClick='hide_box(\"" + i + "\");' title='show' style='cursor: pointer'> " + boxes[wb].innerHTML;
                    } else {
                        boxes[wb].innerHTML = "<img id='lnk_" + i + "' src='" + http + "://www.geocaching.com/images/minus.gif' onClick='hide_box(\"" + i + "\");' title='hide' style='cursor: pointer'> " + boxes[wb].innerHTML;
                    }
                    document.getElementById("lnk_" + i).addEventListener("click", saveStates, false);
                }
                i++;
            }
        }
    } catch (e) {
        gclh_error("Improve MyProfile", e);
    }

// Show thumbnails
    try {
        if (settings_show_thumbnails && (is_page("cache_listing") || document.location.href.match(/^https?:\/\/www\.geocaching\.com\/(seek\/gallery\.aspx?|track\/details\.aspx?|track\/gallery\.aspx?|profile\/)/))) {
            // my: Großes Bild; at: Kleines Bild; Man gibt an, wo sich die beiden berühren. Es scheint so, dass zuerst horizontal und 
            // anschließend vertikal benannt werden muss. "top left" erzeugt dem entsprechend nur den default, also center. Das legt
            // zumindest die Ausrichtung aus den Tests nahe. Ein Arbeiten mit plus oder minus an zwei Stellen oder an einer in Verbindung 
            // mit einem center führen zu Randerweiterungen und Verschiebung der Bildnamen. Da die kleinen Bilder im zugehörigen Bereich 
            // links angeordnet sind und, rechts also ein großer Bereich leer ist, kann mit einem rechten Rand für die Bildberührung 
            // nicht gearbeitet werden. 
            // Änderungen bei "collision" haben keine einschlägigen Verbesserungen gebracht hinsichtlich der Erreichbarkeit aller Bilder. 
            // - my: "left bottom", at: "left bottom-10",: Könnte auch noch nutzbar sein.
            // - my: "left bottom-15", at: "left-50 bottom",: Geht wohl auch, zuckt aber mehr.
            function placeToolTip(element, stop) {
                $('a.gclh_thumb:hover span').position({
                    my: "center bottom",
                    at: "center top",
                    of: "a.gclh_thumb:hover",
                    collision: "flipfit flipfit"
                });
                if (!stop) {
                    $('a.gclh_thumb:hover span img').load(function () {
                        placeToolTip(element, true);
                    });
                }
            }

            var links = document.getElementsByTagName("a");

            var css = "a.gclh_thumb:hover { " +
                "  text-decoration:underline;" +
                "  position: relative;" +
                "}" +
                "a.gclh_thumb {" +
				"overflow: visible !important; max-width: none !important;}" +
				"a.gclh_thumb span {" +
                "  visibility: hidden;" +
                "  position: absolute;" +
                "  top:-310px;" +
                "  left:0px;" +
                "  padding: 2px;" +
                "  text-decoration:none;" +
                "  text-align:left;" +
                "  vertical-align:top;" +
                "}" +
                "a.gclh_thumb:hover span { " +
                "  visibility: visible;" +
                    //"  top: 10px;" +
                "  z-index: 100;" +
                "  border: 1px solid #8c9e65;" +
                "  background-color:#dfe1d2;" +
                "  text-decoration: none !important;" +
                "}" +
                "a.gclh_thumb:hover img {margin-bottom: -4px;}" +
                "a.gclh_thumb img {margin-bottom: -4px;}" +
                ".gclh_max {" +
                "  max-height: " + settings_hover_image_max_size + "px;" +
                "  max-width:  " + settings_hover_image_max_size + "px;" +
                "}";

            GM_addStyle(css);

            if (is_page("cache_listing") && settings_load_logs_with_gclh ) {
                var newImageTmpl = "<!-- .gclh_vip -->" +
                    "          <a class='tb_images lnk gclh_thumb' onmouseover='placeToolTip(this);' rel='fb_images_${LogID}' href='" + http + "://img.geocaching.com/cache/log/${FileName}' title='${Descr}'>" +
                    "              <img title='${Name}' alt='${Name}' src='" + http + "://img.geocaching.com/cache/log/thumb/${FileName}'/>";
                if (settings_imgcaption_on_top) {
                    newImageTmpl += "<span>${Name}<img class='gclh_max' src='" + http + "://img.geocaching.com/cache/log/thumb/large/${FileName}'></span>";
                } else {
                    newImageTmpl += "<span><img class='gclh_max' src='" + http + "://img.geocaching.com/cache/log/thumb/large/${FileName}'>${Name}</span>";
                }
                newImageTmpl += "</a>&nbsp;&nbsp;" +
                "";

                if (browser == "chrome") {
                    $("#tmpl_CacheLogImagesTitle").template("tmplCacheLogImagesTitle");
                    $("#tmpl_CacheLogImages").html(newImageTmpl).template("tmplCacheLogImages");
                    $("#tmpl_CacheLogRow").template("tmplCacheLogRow");
                }

                var code = "function gclh_updateTmpl() { " +
                    "  delete $.template['tmplCacheLogImages'];" +
                    "  $.template(\"tmplCacheLogImages\",\"" + newImageTmpl + "\");" +
                    "}" +
                    "gclh_updateTmpl();";

                code += placeToolTip.toString();

                var script = document.createElement("script");
                script.innerHTML = code;
                document.getElementsByTagName("body")[0].appendChild(script);
            }

            for (var i = 0; i < links.length; i++) {
                // Dass bei Spoilern die Bilder nicht aufgebaut werden, funktioniert nicht. Ein entsprechendes Coding im eigenen Log Template ist
                // derzeit nicht vorhanden.
                if (is_page("cache_listing") && links[i].href.match(/^https?:\/\/img\.geocaching\.com\/cache/) ) {
                    var span = document.createElement("span");
                    var thumb = document.createElement("img");
                    var thumb_link = links[i].href;

                    if (thumb_link.match(/cache\/log/)) {
                        thumb_link = thumb_link.replace(/cache\/log/, "cache/log/thumb");
                    } else {
                        thumb.style.height = "100px";
                        thumb.style.border = "1px solid black";
                    }
                    thumb.src = thumb_link;
                    thumb.title = links[i].innerHTML;
                    thumb.alt = links[i].innerHTML;

                    links[i].className = links[i].className + " gclh_thumb";
                    links[i].onmouseover = placeToolTip;

                    var big_img = document.createElement("img");
                    big_img.src = links[i].href;
                    big_img.className = "gclh_max";

                    span.appendChild(big_img);

                    var name = links[i].innerHTML;
                    links[i].innerHTML = "";
                    links[i].appendChild(thumb);
                    links[i].innerHTML += "<br>" + name;

                    links[i].appendChild(span);
                // Bilder Gallery Cache, TB und Profil:
                } else if ( document.location.href.match(/^https?:\/\/www\.geocaching\.com\/(seek\/gallery\.aspx?|track\/gallery\.aspx?|profile\/)/) && 
                     links[i].href.match(/^https?:\/\/img\.geocaching\.com\/(cache|track)\//) && links[i].childNodes[1] && links[i].childNodes[1].tagName == 'IMG') {
                    global_imageGallery = true;
                    var thumb = links[i].childNodes[1];
                    var span = document.createElement('span');
                    var img = document.createElement('img');

                    img.src = thumb.src.replace(/thumb\//, "");
                    img.className = "gclh_max";

                    if (settings_imgcaption_on_top) {
                        // Bezeichnung des Bildes.
                        span.appendChild(document.createTextNode(thumb.parentNode.parentNode.childNodes[5].innerHTML));
                        span.appendChild(img);
                    } else {
                        span.appendChild(img);
                        // Bezeichnung des Bildes.
                        span.appendChild(document.createTextNode(thumb.parentNode.parentNode.childNodes[5].innerHTML));
                    }

                    links[i].className = links[i].className + " gclh_thumb";
                    links[i].onmouseover = placeToolTip;

                    links[i].appendChild(span);
                }
                // Bilder im TB Listing:
                else if ( document.location.href.match(/^https?:\/\/www\.geocaching\.com\/track\/details\.aspx?/) &&
                          links[i].href.match(/^https?:\/\/img\.geocaching\.com\/track/) ) {
                    // Bestehendes a tag (track/log/large) um class und Event ergänzen.
                    links[i].className = links[i].className + " gclh_thumb";
                    links[i].onmouseover = placeToolTip;
                    // Bestehendes img tag (track/log/thumb) um title ergänzen und Bezeichnung für Bild merken.
                    var imgDesc = "";
                    var imgTag = links[i].getElementsByTagName("img");
                    for (var j = 0; j < imgTag.length; j++) {
                        imgTag[j].title = imgTag[j].alt;
                        imgDesc = imgTag[j].alt;
                        break;
                    }
                    // Neues img tag mit großem Bild aufbauen.
                    var big_img = document.createElement("img");
                    big_img.className = "gclh_max";
                    big_img.src = links[i].href.replace(/track\/log\/large/, "track/log/thumb/large/");
                    big_img.setAttribute("style", "margin-right: unset; margin-bottom: unset;");
                    // Neues span tag mit neuem img tag mit großem Bild aufbauen.
                    var span = document.createElement("span");
                    if (settings_imgcaption_on_top) {
                        span.appendChild(document.createTextNode( imgDesc ));
                        span.appendChild(big_img);
                    } else {
                        span.appendChild(big_img);
                        span.appendChild(document.createTextNode( imgDesc ));
                    }
                    // Neues img und neues span einbauen.
                    links[i].appendChild(span);
                }
            }
        }
        
    } catch (e) {
        gclh_error("Show Thumbnails", e);
    }

// Show gallery-Images in 2 instead of 4 cols
    try {
        if (settings_show_big_gallery && document.location.href.match(/^https?:\/\/www\.geocaching\.com\/(seek\/gallery\.aspx?|track\/gallery\.aspx?|profile\/)/)) {
            var links = document.getElementsByTagName("a");
            var tds = new Array();
            // Make images bigger
            for (var i = 0; i < links.length; i++) {
                if (links[i].href.match(/^https?:\/\/img\.geocaching\.com\/(cache|track)\//) && links[i].childNodes[1] && links[i].childNodes[1].tagName == 'IMG') {
                    var thumb = links[i].childNodes[1];
                    thumb.style.width = "300px";
                    thumb.style.height = "auto";
                    thumb.src = thumb.src.replace(/thumb\//, "");
                    tds.push(thumb.parentNode.parentNode);
                }
            }

            // Change from 4 Cols to 2
            if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/(seek\/gallery\.aspx?|track\/gallery\.aspx?)/) && tds.length > 1 && document.getElementById("ctl00_ContentBody_GalleryItems_DataListGallery")) {
                var tbody = document.createElement("tbody");
                var tr = document.createElement("tr");
                var x = 0;
                for (var i = 0; i < tds.length; i++) {
                    if (x == 0) {
                        tr.appendChild(tds[i]);
                        x++;
                    } else {
                        tr.appendChild(tds[i]);
                        tbody.appendChild(tr);
                        tr = document.createElement("tr");
                        x = 0;
                    }
                }
                if (x != 0) { //einzelnes Bild uebrig
                    tr.appendChild(document.createElement("td"));
                    tbody.appendChild(tr);
                }
                document.getElementById("ctl00_ContentBody_GalleryItems_DataListGallery").removeChild(document.getElementById("ctl00_ContentBody_GalleryItems_DataListGallery").firstChild);
                document.getElementById("ctl00_ContentBody_GalleryItems_DataListGallery").appendChild(tbody);
            } else if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/profile\//) && tds.length > 1 && document.getElementById("ctl00_ContentBody_ProfilePanel1_UserGallery_DataListGallery")) {
                var tbody = document.createElement("tbody");
                var tr = document.createElement("tr");
                var x = 0;
                for (var i = 0; i < tds.length; i++) {
                    if (x == 0) {
                        tr.appendChild(tds[i]);
                        x++;
                    } else {
                        tr.appendChild(tds[i]);
                        tbody.appendChild(tr);
                        tr = document.createElement("tr");
                        x = 0;
                    }
                }
                if (x != 0) { //einzelnes Bild uebrig
                    tr.appendChild(document.createElement("td"));
                    tbody.appendChild(tr);
                }
                document.getElementById("ctl00_ContentBody_ProfilePanel1_UserGallery_DataListGallery").removeChild(document.getElementById("ctl00_ContentBody_ProfilePanel1_UserGallery_DataListGallery").firstChild);
                document.getElementById("ctl00_ContentBody_ProfilePanel1_UserGallery_DataListGallery").appendChild(tbody);
            }
        }
    } catch (e) {
        gclh_error("Show Bigger Images", e);
    }

// Log-Template definieren
    log_template:
    try {
        if ( !is_page("cache_listing") ) break log_template;
        
        var new_tmpl = "";
        new_tmpl += 
            '    <tr class="log-row" data-encoded="${IsEncoded}" >' +
            '        <td>' +
            '            <div class="FloatLeft LogDisplayLeft" >' +
            '                <p class="logOwnerProfileName">' +
            '                    <strong>' +
            '                        <a id="${LogID}" name="${LogID}" href="/profile/?guid=${AccountGuid}">${UserName}</a>' +
            '                    </strong>' +
            '                </p>' +
            '                <p class="logIcons">' +
            '                    <strong>' +
            '                        <a class="logOwnerBadge">' +
            '                            {{if creator}}<img title="${creator.GroupTitle}" src="${creator.GroupImageUrl}" style="vertical-align: baseline;">{{/if}}</a>';
        if (settings_show_vip_list) new_tmpl += 
            '                        <a href="javascript:void(0);" name="${UserName}" class="gclh_vip"><img class="gclh_vip" border=0 style="margin-left: 0px; margin-right: 0px"></a>';
        if (settings_show_mail) new_tmpl += 
            '                        {{if UserName !== "' + global_activ_username + '" }}' +
            '                        <a href="' + http + '://www.geocaching.com/email/?guid=${AccountGuid}&text=Hi ${UserName},%0A%0A' + global_name + global_info_mail + '"><img border=0 title="Send a mail to ${UserName}" src="' + global_mail_icon + '"></a>' +
            '                        {{/if}}';
        // gcCode oder tbCode nicht nutzen, damit keine Standard Message aufgebaut wird. Der deaktivierte Punkt kann 
        // dann aktiviert werden, wenn die Erzeugung des eigenen Inhaltes sich als nicht praktikabel herausstellt. 
        if (settings_show_message) new_tmpl += 
            '                        {{if UserName !== "' + global_activ_username + '" }}' +
            // '                        <a href="' + http + '://www.geocaching.com/account/messagecenter?recipientId=${AccountGuid}&gcCode=' + global_code + '"><img border=0 title="Send a message to ${UserName}" src="' + global_message_icon + '"></a>' +
            '                        <a href="' + http + '://www.geocaching.com/account/messagecenter?recipientId=${AccountGuid}&text=Hi ${UserName},%0A%0A' + global_name + global_info_message + '"><img border=0 title="Send a message to ${UserName}" src="' + global_message_icon + '"></a>' +
            '                        {{/if}}';
        new_tmpl += 
            '                        &nbsp;&nbsp;' +
            '                        <a title="Top" href="#gclh_top" style="color: #000000; text-decoration: none; float: right; padding-left: 6px;">↑</a>' +
            '                    </strong>' +
            '                </p>' +
            '                <p class="logOwnerAvatar">' +
            '                    <a href="/profile/?guid=${AccountGuid}">';
        if (!settings_hide_avatar) new_tmpl +=
            '                        {{if AvatarImage}}' +
            '                        <img width="48" height="48" src="' + http + '://img.geocaching.com/user/avatar/${AvatarImage}">' +
            '                        {{else}}' +
            '                        <img width="48" height="48" src="/images/default_avatar.jpg">' +
            '                        {{/if}}';
        new_tmpl += 
            '                </a></p>' +
            '                <p class="logOwnerStats">' +
            '                    {{if GeocacheFindCount > 0 }}' +
            '                    <img title="Caches Found" src="/images/icons/icon_smile.png"> ${GeocacheFindCount}' +
            '                    {{/if}}' +
            '                </p>' +
            '            </div>' +
            '            <div class="FloatLeft LogDisplayRight">' +
            '                <div class="HalfLeft LogType">' +
            '                    <strong>' +
            '                        <img title="${LogType}" alt="${LogType}" src="/images/logtypes/${LogTypeImage}">&nbsp;${LogType}</strong></div>' +
            '                <div class="HalfRight AlignRight">' +
            '                    <span class="minorDetails LogDate">${Visited}</span></div>' +
            // "markdown-output" sorgt für die richtige Aufbereitung der Logs, insbesondere nach unten und oben.
            // Gleichzeitig schneidet es aber auch die Bilder beim drüberfahren mit der Maus an den Rändern ab, 
            // entsprechend der Maße des Logs. Deshalb Bilder aus diesem Bereich rausnehmen class="TableLogContent".       
            '                <div class="Clear LogContent markdown-output">' +
            '                    {{if LatLonString.length > 0}}' +
            '                    <strong>${LatLonString}</strong>' +
            '                    {{/if}}' +
            '                    <p class="LogText">{{html LogText}}</p>' +
            '                </div>' +
            '                {{if Images.length > 0}}' +
            '                <div class="TableLogContent">' +
            '                    <table cellspacing="0" cellpadding="3" class="LogImagesTable">';
        if (settings_show_thumbnails) new_tmpl += 
            '                        <tr><td>';
        new_tmpl += 
            '                            {{tmpl(Images) "tmplCacheLogImages"}}';
        if (settings_show_thumbnails) new_tmpl += 
            '                        </td></tr>';
        new_tmpl += 
            '                    </table>' +
            '                </div>' +
            '                {{/if}}' +
            '                <div class="AlignRight">' +
            '                    <small><a title="View Log" href="/seek/log.aspx?LUID=${LogGuid}" target="_blank">' +
            '                    {{if (userInfo.ID==AccountID)}}' +
            '                    View / Edit Log / Images' +
            '                    {{else}}' +
            '                    View Log' +
            '                    {{/if}}' +
            '                    </a></small>&nbsp;' +
            '                    {{if (userInfo.ID==AccountID)}}' +
            '                    <small><a title="Upload Image" href="/seek/upload.aspx?LID=${LogID}" target="_blank">Upload Image</a></small>' +
            '                    {{/if}}' +
            '                </div>' +
            '            </div>' +
            '        </td>' +
            '    </tr>';
    
        var css = ""; 
        // Log Text noch etwas ausrichten, keinen Platz in der Höhe verlieren.    
        css += ".LogDisplayRight .LogText {min-height: unset; padding-top: 1.5em;}";
        css += ".markdown-output {margin: unset;}";  
        if ( !settings_hide_avatar ) css += ".markdown-output {min-height: 6em;}";
        // Bilderrahmen im Log noch etwas ausrichten und Trenner von Text und User auch hier einbauen. 
        css += ".TableLogContent {padding-left: 0.5em; border-left: 1px solid #d7d7d7;}";
        // Länge der Usernamen in den Logs beschränken, damit sie nicht umgebrochen werden. 
        css += ".logOwnerProfileName {max-width: 135px; display: inline-block; overflow: hidden; vertical-align: bottom; white-space: nowrap; text-overflow: ellipsis;}";
        appendCssStyle( css );
        
    } catch (e) {
        gclh_error("define log-template", e);
    }

// Hide greenToTopButton
    if (settings_hide_top_button) {
        $("#topScroll").attr("id", "_topScroll").hide();
    }

// Overwrite Log-Template and Log-Load-Function
    try {
        if (settings_load_logs_with_gclh && is_page("cache_listing") && !document.getElementById("ctl00_divNotSignedIn") && document.getElementById('tmpl_CacheLogRow')) {
            // to Top Link
            var a = document.createElement("a");
            a.setAttribute("href", "#");
            a.setAttribute("name", "gclh_top");
            document.getElementsByTagName("body")[0].insertBefore(a, document.getElementsByTagName("body")[0].childNodes[0]);

            var new_tmpl_block = document.createElement("script");
            new_tmpl_block.type = "text/x-jquery-tmpl";
            new_tmpl_block.innerHTML = new_tmpl;
            new_tmpl_block.setAttribute("id", "tmpl_CacheLogRow_gclh");
            document.getElementsByTagName("body")[0].appendChild(new_tmpl_block);

            //Override the standart templates (for pre-LogLoad use)
            document.getElementById('tmpl_CacheLogRow').innerHTML = new_tmpl;
            var elem = unsafeWindow.$('#tmpl_CacheLogRow')[0];
            unsafeWindow.$.removeData(elem, "tmpl");
            unsafeWindow.$("#tmpl_CacheLogRow").template("tmplCacheLogRow");

            if (browser === "chrome" || browser === "firefox") {
                injectPageScriptFunction(function () {
                    var elem = window.$('#tmpl_CacheLogRow')[0];
                    window.$.removeData(elem, "tmpl");
                    window.$("#tmpl_CacheLogRow").template("tmplCacheLogRow");
                }, "()");
            }

            //Reinit initalLogs
            var tbody = (document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table")).getElementsByTagName("tbody");
            if (tbody.length > 0) {
                tbody = tbody[0];
                if (tbody.children.length > 0) {
                    var initialLogData = chromeUserData.initalLogs || unsafeWindow.initalLogs || initalLogs;
                    var inclAvatars = chromeUserData.includeAvatars || unsafeWindow.includeAvatars || includeAvatars;
                    var newInitalLogs = $("#tmpl_CacheLogRow").tmpl(initialLogData.data, {
                        includeAvatars: inclAvatars
                    });

                    for (var j = 0; j < newInitalLogs.length && j < tbody.children.length; j++) {
                        unsafeWindow.$(tbody.children[j]).replaceWith(newInitalLogs[j]);
                    }

                    injectPageScript("$('a.tb_images').fancybox({'type': 'image', 'titlePosition': 'inside'});");

                    gclh_add_vip_icon();
                    setLinesColorInCacheListing();
                }
            }

            function loadListener(e) {
                gclh_add_vip_icon();
                setLinesColorInCacheListing();
            }

            (document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table")).addEventListener('DOMNodeInserted', loadListener);

            if (browser === "firefox") {
                window.addEventListener("message", function (ev) {
                    if (ev.origin !== "https://www.geocaching.com" && ev.origin !== "https://www.geocaching.com") {
                        return;
                    }

                    if (ev.data === "gclh_add_vip_icon") {
                        gclh_add_vip_icon();
                    }
                    if (ev.data === "setLinesColorInCacheListing") {
                        setLinesColorInCacheListing();
                    }
                });

                function addNewLogLines(escapedLogLines) {
                    var unsafeWindow = unsafeWindow || window;
                    var logs = JSON.parse(decodeURIComponent(escapedLogLines));
                    var newBody = unsafeWindow.$(document.createElement("TBODY"));
                    unsafeWindow.$("#tmpl_CacheLogRow_gclh").tmpl(logs).appendTo(newBody);
                    unsafeWindow.$(document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table")).append(newBody.children());
                    $('a.tb_images').fancybox({'type': 'image', 'titlePosition': 'inside'});
                }
            }

            function disablePageAutoScroll() {
                var unsafeWindow = (typeof(unsafeWindow) == "undefined" ? window : unsafeWindow);
                unsafeWindow.currentPageIdx = 2;
                unsafeWindow.totalPages = 1;
                unsafeWindow.isBusy = true;
                unsafeWindow.initalLogs = initalLogs = {
                    "status": "success",
                    "data": [],
                    "pageInfo": {"idx": 2, "size": 0, "totalRows": 1, "totalPages": 1, "rows": 1}
                };
            }

            // Helper: Add VIP-Icon
            function gclh_add_vip_icon() {
                var elements = $(document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table")).find("a.gclh_vip").not(".gclh_vip_hasIcon");

                for (var i = 0; i < elements.length; i++) {
                    var link = elements[i];
                    var img = link.childNodes[0];
                    var user = link.name;
                    
                    if (in_array(user, vips)) {
                        img.src = img_vip_on;
                        img.title = "Remove " + user + " from VIP-List";
                        link.addEventListener("click", gclh_del_vip, false);
                    } else {
                        img.src = img_vip_off;
                        img.title = "Add " + user + " to VIP-List";
                        link.addEventListener("click", gclh_add_vip, false);
                    }

                    unsafeWindow.$(link).addClass("gclh_vip_hasIcon");

                }
            }

            // Rebuild function - but with full control :)
            function gclh_dynamic_load(logs, num) {
                var isBusy = false;
                var gclh_currentPageIdx = 1, gclh_totalPages = 1;
                var logInitialLoaded = false;
                var browser = (typeof(chrome) !== "undefined") ? "chrome" : "firefox";

                unsafeWindow.$(window).endlessScroll({
                    fireOnce: true,
                    fireDelay: 500,
                    bottomPixels: (($(document).height() - $("#cache_logs_container").offset().top) + 50),
                    ceaseFire: function () {
                        // stop the scrolling if the last page is reached.
                        return (gclh_totalPages < gclh_currentPageIdx);
                    },
                    callback: function () {
                        if (!isBusy && !document.getElementById("gclh_all_logs_marker")) {
                            isBusy = true;
                            $("#pnlLazyLoad").show();

                            if (browser === "firefox") {
                                var logsToAdd = logs.slice(num, num + 10);
                                addNewLogLines(encodeURIComponent(JSON.stringify(logsToAdd)));
                                num += logsToAdd.length;

                                //gclh_add_vip_icon();
                                window.postMessage("gclh_add_vip_icon", "https://www.geocaching.com");
                                window.postMessage("setLinesColorInCacheListing", "https://www.geocaching.com");
                            }
                            else {
                                for (var i = 0; i < 10; i++) {
                                    if (logs[num]) {
                                        var newBody = unsafeWindow.$(document.createElement("TBODY"));
                                        unsafeWindow.$("#tmpl_CacheLogRow_gclh").tmpl(logs[num]).appendTo(newBody);
                                        injectPageScript("$('a.tb_images').fancybox({'type': 'image', 'titlePosition': 'inside'});");
                                        unsafeWindow.$(document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table")).append(newBody.children());
                                    }
                                    num++; // num kommt vom vorherigen laden "aller" logs
                                }

                                gclh_add_vip_icon();
                                setLinesColorInCacheListing();
                            }
                            if (!settings_hide_top_button) $("#topScroll").fadeIn();

                            $("#pnlLazyLoad").hide();
                            isBusy = false;
                        }
                    }
                });
            }

            // Load all Logs-Link
            function gclh_load_all_link(logs) {
                function gclh_load_all_logs() {
                    if (logs) {
                        var tbodys = (document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table")).getElementsByTagName("tbody");
                        for (var i = 0; i < tbodys.length; i++) {
                            (document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table")).removeChild(tbodys[i]);
                        }

                        if (browser === "firefox") {
                            injectPageScript("var unsafeWindow = unsafeWindow||window; " + gclh_dynamic_load.toString() + " var settings_hide_top_button=" + settings_hide_top_button + "; ");
                            injectPageScript("(" + addNewLogLines.toString() + ")(\"" + encodeURIComponent(JSON.stringify(logs)) + "\");");

                            window.postMessage("gclh_add_vip_icon", "https://www.geocaching.com");
                            window.postMessage("setLinesColorInCacheListing", "https://www.geocaching.com");

                        }
                        else {
                            for (var i = 0; i < logs.length; i++) {
                                if (logs[i]) {
                                    var newBody = unsafeWindow.$(document.createElement("TBODY"));
                                    unsafeWindow.$("#tmpl_CacheLogRow_gclh").tmpl(logs[i]).appendTo(newBody);
                                    injectPageScript("$('a.tb_images').fancybox({'type': 'image', 'titlePosition': 'inside'});");
                                    unsafeWindow.$(document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table")).append(newBody.children());
                                }
                            }

                            gclh_add_vip_icon();
                            setLinesColorInCacheListing();
                        }
                        // Marker to disable dynamic log-load
                        var marker = document.createElement("a");
                        marker.setAttribute("id", "gclh_all_logs_marker");
                        document.getElementsByTagName("body")[0].appendChild(marker);
                    }
                }

                var load_all = document.createElement("a");
                load_all.appendChild(document.createTextNode("Show all logs"));
                load_all.setAttribute("href", "javascript:void(0);");
                load_all.setAttribute("id", "gclh_load_all_logs");
                document.getElementById("ctl00_ContentBody_uxLogbookLink").parentNode.appendChild(document.createTextNode(" | "));
                document.getElementById("ctl00_ContentBody_uxLogbookLink").parentNode.appendChild(load_all);

                document.getElementById("ctl00_ContentBody_uxLogbookLink").parentNode.style.margin = "0";
                var para = document.getElementById('ctl00_ContentBody_lblFindCounts').nextSibling.nextSibling.nextSibling.nextSibling;
                if (para && para.nodeName == 'P') {
                    para.className = para.className + ' Clear';
                }

                load_all.addEventListener("click", gclh_load_all_logs, false);
            }

            // Filter Log-Types
            function gclh_filter_logs(logs) {
                function gclh_filter_logs() {
                    if (!this.childNodes[0]) return false;
                    var log_type = this.childNodes[0].title;
                    if (!log_type) return false;
                    if (!logs) return false;

                    var tbodys = (document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table")).getElementsByTagName("tbody");
                    for (var i = 0; i < tbodys.length; i++) {
                        (document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table")).removeChild(tbodys[i]);
                    }
                    if (browser === "firefox") {
                        var logsToAdd = [];

                        for (var i = 0; i < logs.length; i++) {
                            if (logs[i] && logs[i].LogType == log_type) {
                                logsToAdd.push(logs[i]);
                            }
                        }

                        injectPageScript("var unsafeWindow = unsafeWindow||window; " + gclh_dynamic_load.toString() + " var settings_hide_top_button=" + settings_hide_top_button + "; ");
                        injectPageScript("(" + addNewLogLines.toString() + ")(\"" + encodeURIComponent(JSON.stringify(logsToAdd)) + "\");");

                        window.postMessage("gclh_add_vip_icon", "https://www.geocaching.com");
                        window.postMessage("setLinesColorInCacheListing", "https://www.geocaching.com");
                    }
                    else {
                        for (var i = 0; i < logs.length; i++) {
                            if (logs[i] && logs[i].LogType == log_type) {
                                var newBody = unsafeWindow.$(document.createElement("TBODY"));
                                unsafeWindow.$("#tmpl_CacheLogRow_gclh").tmpl(logs[i]).appendTo(newBody);
                                injectPageScript("$('a.tb_images').fancybox({'type': 'image', 'titlePosition': 'inside'});");
                                unsafeWindow.$(document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table")).append(newBody.children());
                            }
                        }

                        gclh_add_vip_icon();
                        setLinesColorInCacheListing();
                    }

                    // Marker to disable dynamic log-load
                    var marker = document.createElement("a");
                    marker.setAttribute("id", "gclh_all_logs_marker");
                    document.getElementsByTagName("body")[0].appendChild(marker);
                }

                if (!document.getElementById("ctl00_ContentBody_lblFindCounts").childNodes[0]) return false;
                var legend = document.getElementById("ctl00_ContentBody_lblFindCounts").childNodes[0];
                var new_legend = document.createElement("p");
                new_legend.className = "LogTotals";

                for (var i = 0; i < legend.childNodes.length; i++) {
                    if (legend.childNodes[i].tagName == "IMG") {
                        var link = document.createElement("a");
                        link.setAttribute("href", "javascript:void(0);");
                        link.style.textDecoration = 'none';
                        link.addEventListener("click", gclh_filter_logs, false);

                        link.appendChild(legend.childNodes[i].cloneNode(true));
                        i++;
                        link.appendChild(legend.childNodes[i].cloneNode(true));
                        new_legend.appendChild(link);
                    }
                }
                document.getElementById('ctl00_ContentBody_lblFindCounts').replaceChild(new_legend, legend);
            }

            function gclh_search_logs(logs) {
                function gclh_search(e) {
                    if (e.keyCode != 13) return false;
                    if (!logs) return false;
                    var search_text = this.value;
                    if (!search_text) return false;

                    var regexp = new RegExp("(" + search_text + ")", "i");

                    var tbodys = (document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table")).getElementsByTagName("tbody");
                    for (var i = 0; i < tbodys.length; i++) {
                        (document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table")).removeChild(tbodys[i]);
                    }
                    if (browser === "firefox") {
                        var logsToAdd = [];

                        for (var i = 0; i < logs.length; i++) {
                            if (logs[i] && (logs[i].UserName.match(regexp) || logs[i].LogText.match(regexp))) {
                                logsToAdd.push(logs[i]);
                            }
                        }

                        injectPageScript("var unsafeWindow = unsafeWindow||window; " + gclh_dynamic_load.toString() + " var settings_hide_top_button=" + settings_hide_top_button + "; ");
                        injectPageScript("(" + addNewLogLines.toString() + ")(\"" + encodeURIComponent(JSON.stringify(logsToAdd)) + "\");");

                        window.postMessage("gclh_add_vip_icon", "https://www.geocaching.com");
                        window.postMessage("setLinesColorInCacheListing", "https://www.geocaching.com");

                    }
                    else {
                        for (var i = 0; i < logs.length; i++) {
                            if (logs[i] && (logs[i].UserName.match(regexp) || logs[i].LogText.match(regexp))) {
                                var newBody = unsafeWindow.$(document.createElement("TBODY"));
                                unsafeWindow.$("#tmpl_CacheLogRow_gclh").tmpl(logs[i]).appendTo(newBody);
                                injectPageScript("$('a.tb_images').fancybox({'type': 'image', 'titlePosition': 'inside'});");
                                unsafeWindow.$(document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table")).append(newBody.children());
                            }
                        }

                        gclh_add_vip_icon();
                        setLinesColorInCacheListing();
                    }

                    // Marker to disable dynamic log-load
                    var marker = document.createElement("a");
                    marker.setAttribute("id", "gclh_all_logs_marker");
                    document.getElementsByTagName("body")[0].appendChild(marker);
                }

                if (!document.getElementById("ctl00_ContentBody_lblFindCounts").childNodes[0]) return false;
                var form = document.createElement("form");
                var search = document.createElement("input");
                form.setAttribute("action", "javascript:void(0);");
                form.appendChild(search);
                form.style.display = "inline";
                search.setAttribute("type", "text");
                search.setAttribute("size", "10");
                search.addEventListener("keyup", gclh_search, false);
                document.getElementById('ctl00_ContentBody_lblFindCounts').childNodes[0].appendChild(document.createTextNode("Search in logtext: "));
                document.getElementById('ctl00_ContentBody_lblFindCounts').childNodes[0].appendChild(form);
            }

            // Load "num" Logs
            function gclh_load_logs(num) {
                var data = new Array();
                var requestCount = 1;
                var logs = new Array();
                var numPages = 1;
                var curIdx = 1;

                if (document.getElementById("gclh_vip_list")) {
                    var span_loading = document.createElement("span");
                    span_loading.innerHTML = '<img src="/images/loading2.gif" class="StatusIcon" alt="Loading" />Loading Cache Logs...';
                    document.getElementById("gclh_vip_list").appendChild(span_loading);
                }
                if (document.getElementById("gclh_vip_list_nofound")) {
                    var span_loading = document.createElement("span");
                    span_loading.innerHTML = '<img src="/images/loading2.gif" class="StatusIcon" alt="Loading" />Loading Cache Logs...';
                    document.getElementById("gclh_vip_list_nofound").appendChild(span_loading);
                }

                function gclh_load_helper(count) {

                    var url = http + "://www.geocaching.com/seek/geocache.logbook?tkn=" + userToken + "&idx=" + curIdx + "&num=100&decrypt=false";
                    //$("#pnlLazyLoad").show();

                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        onload: function (response) {

                            requestCount--;
                            var dataElement = JSON.parse(response.responseText);
                            data[dataElement.pageInfo.idx] = dataElement;
                            gclh_log("Loading Logs Status: " + response.statusText + " - idx: " + dataElement.pageInfo.idx);

                            if (numPages == 1) {
                                numPages = data[count].pageInfo.totalPages;
                                for (curIdx = 2; curIdx <= numPages; curIdx++) {
                                    requestCount++;
                                    gclh_load_helper(curIdx);
                                }
                                ;
                            }

                            if (requestCount <= 0) {
                                gclh_load_dataHelper();
                            }
                        }
                    });
                }

                function gclh_load_dataHelper() {
                    logs = new Array();
                    // disable scroll Function on Page
                    if (browser === "chrome" || browser === "firefox") {
                        injectPageScriptFunction(disablePageAutoScroll, "()");
                    }
                    else {
                        disablePageAutoScroll();
                    }

                    if (browser !== "firefox") {
                        (document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table")).removeEventListener('DOMNodeInserted', loadListener);
                    }

                    // Hide initial Logs
                    var tbodys = document.getElementById("cache_logs_table").getElementsByTagName("tbody");
                    if (tbodys.length > 0) {
                        var shownLogs = tbodys[0].children.length;
                        if (shownLogs > 0 && num < shownLogs) {
                            num = shownLogs;
                        }
                    }
                    
                    var tableContent = unsafeWindow.$("#cache_logs_table").after('<table id="cache_logs_table2" class="LogsTable NoBottomSpacing"> </table>').hide().children().remove();
                    unsafeWindow.$(tableContent).find('tbody').children().remove();
                    unsafeWindow.$('#cache_logs_table2').append(tableContent);
                    $(tableContent).find('.log-row').remove();

                    //$("#pnlLazyLoad").hide();
                    for (var z = 1; z <= numPages; z++) {
                        var json = data[z];

                        logs = logs.concat(json.data);


                        for (var i = 0; i < json.data.length; i++) {
                            var user = json.data[i].UserName;

                            if (settings_show_vip_list) {
                                all_users.push(user);

                                if (!log_infos[user]) log_infos[user] = new Array();
                                log_infos[user][index] = new Object();
                                log_infos[user][index]["icon"] = "/images/logtypes/" + json.data[i].LogTypeImage;
                                log_infos[user][index]["id"] = json.data[i].LogID;
                                log_infos[user][index]["date"] = json.data[i].Visited;
                                log_infos[user][index]["log"] = json.data[i].LogText;
                                log_infos_long[index] = new Object();
                                log_infos_long[index]["user"] = user;
                                log_infos_long[index]["icon"] = "/images/logtypes/" + json.data[i].LogTypeImage;
                                log_infos_long[index]["id"] = json.data[i].LogID;
                                log_infos_long[index]["date"] = json.data[i].Visited;
                                log_infos_long[index]["log"] = json.data[i].LogText;
                                index++;
                            }
                        }

                    }

                    // Add Links
                    gclh_load_all_link(logs); // Load all Logs
                    gclh_filter_logs(logs); // Filter Logs
                    gclh_search_logs(logs); // Search Field

                    if (browser === "firefox") {
                        var logsToAdd = logs.slice(0, num);
                        injectPageScript("var unsafeWindow = unsafeWindow||window; " + gclh_dynamic_load.toString() + " var settings_hide_top_button=" + settings_hide_top_button + "; ");
                        injectPageScript(addNewLogLines.toString());
                        injectPageScript("(" + addNewLogLines.toString() + ")(\"" + encodeURIComponent(JSON.stringify(logsToAdd)) + "\"); gclh_dynamic_load(JSON.parse(decodeURIComponent(\"" + encodeURIComponent(JSON.stringify(logs)) + "\"))," + num + ");");

                        if (settings_show_vip_list) {
                            gclh_build_vip_list();
                            window.postMessage("gclh_add_vip_icon", "https://www.geocaching.com");
                        }
                        window.postMessage("setLinesColorInCacheListing", "https://www.geocaching.com");
                    } else {
                        for (var i = 0; i < num; i++) {
                            if (logs[i]) {
                                var newBody = unsafeWindow.$(document.createElement("TBODY"));
                                unsafeWindow.$("#tmpl_CacheLogRow_gclh").tmpl(logs[i]).appendTo(newBody);
                                injectPageScript("$('a.tb_images').fancybox({'type': 'image', 'titlePosition': 'inside'});");
                                unsafeWindow.$(document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table")).append(newBody.children());
                            }
                        }
                        gclh_dynamic_load(logs, num);

                        if (settings_show_vip_list) {
                            gclh_build_vip_list();
                            gclh_add_vip_icon();
                        }
                        setLinesColorInCacheListing();
                    }
                }
                gclh_load_helper(1);
            }
            if (settings_show_all_logs) {
                if (settings_show_all_logs_count == 0) gclh_load_logs(5000);
                else gclh_load_logs(settings_show_all_logs_count);
            } else gclh_load_logs(5);
        }
    } catch (e) {
        gclh_error("Replace Log-Loading function", e);
    }

// Zeilen in Cache Listings in Zebra und für User, für Owner, für Reviewer und für VIP einfärben.
    function setLinesColorInCacheListing() {
        if ( is_page("cache_listing") ) {
            // ('find("tr")' reicht hier nicht wegen der Bilder.)               
            var lines = $( document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table") ).find("tbody").find("tr.log-row");
            var owner = get_real_owner();
            setLinesColorInZebra( settings_show_cache_listings_in_zebra, lines, 1 );
            setLinesColorUser( "settings_show_cache_listings_color", "user,owner,reviewer,vips", lines, 1, owner );
        }                
    }
    
// Bei Click auf VIP Icon, Einfärbung für VIP neu machen.
    function setLinesColorVip( user ) {
        if ( is_page("cache_listing") ) {
            var lines = $( document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table") ).find("tbody").find("tr.log-row");
            var count = 1;
            var owner = get_real_owner();
            var parameterStamm = "settings_show_cache_listings_color";
        }
        else if ( document.location.href.match(/^https?:\/\/www\.geocaching\.com\/track\/details\.aspx/) ) {
            var lines = $("table.Table").find("tbody").find("tr");  
            var count = 2;
            var owner = document.getElementById("ctl00_ContentBody_BugDetails_BugOwner").innerHTML;
            var parameterStamm = "settings_show_tb_listings_color";
        }
        var linesNew = new Array();
        for (var i = 0; i < lines.length; i++) {
            var aTags = lines[i].getElementsByTagName("a");
            for (var j = 0; j < aTags.length; j++) {
                if ( aTags[j].getAttribute("name") == user ) { 
                    for (var k = 0; k < count; k++) {
                        linesNew.push(lines[i+k]);
                    }
                }
            }
        }
        if ( linesNew.length > 0 ) {
            setLinesColorUser( parameterStamm, "user,owner,reviewer,vips", linesNew, count, owner );
        }
    }

// Farben für Zeilen in gewöhnlichen Listen und im TB Listing setzen. Nicht im Cache Listing.    
    try {
        // Hintergrund der Tabellenzeilen/Listzeilen einheitlich einfärben.
        var css = "table.Table tr.AlternatingRow td, .AlternatingRow, table.Table tr td.AlternatingRow { background-color: #" + getValue( "settings_lines_color_zebra") + " !important; }"
                + "table.Table tr.TertiaryRow td, .TertiaryRow, table.Table tr td.TertiaryRow { background-color: #" + getValue( "settings_lines_color_user") + " !important; }"
                + "table.Table tr.QuaternaryRow td, .QuaternaryRow, table.Table tr td.QuaternaryRow { background-color: #" + getValue( "settings_lines_color_owner") + " !important; }"
                + "table.Table tr.QuinaryRow td, .QuinaryRow, table.Table tr td.QuinaryRow { background-color: #" + getValue( "settings_lines_color_reviewer") + " !important; }"
                + "table.Table tr.SenaryRow td, .SenaryRow, table.Table tr td.SenaryRow { background-color: #" + getValue( "settings_lines_color_vip") + " !important; }";
        appendCssStyle( css );

        // Bookmarklisten: Zeilen in Bookmarklisten in Zebra einfärben und die Funde des Users einfärben.
        // Die Bookmarklisten scheinen die einzigen Listen, bei denen das nicht vorgesehen ist.
//--> $$063FE Begin of change
//        if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/bookmarks\/view\.aspx\?guid=/)) {
        if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/bookmarks\/(view\.aspx\?guid=|bulk\.aspx\?listid=)/)) {
//<-- $$063FE End of change
            var lines = $("table.Table").find("tbody").find("tr");
            setLinesColorInZebra( settings_show_common_lists_in_zebra, lines, 2 );
            setLinesColorUser( "settings_show_common_lists_color", "user", lines, 2, "" );
        }
        // TB Listing: Zeilen in TB Listings in Zebra, für User, für Owner, für Reviewer und für VIP einfärben.
        else if ( document.location.href.match(/^https?:\/\/www\.geocaching\.com\/track\/details\.aspx\?/) ) {
            var lines = $("table.Table").find("tbody").find("tr");  
            if ( lines.length > 1 ) {
                var linesNew = lines.slice(0, -1);
                var owner = document.getElementById("ctl00_ContentBody_BugDetails_BugOwner").innerHTML;
                setLinesColorInZebra( settings_show_tb_listings_in_zebra, linesNew, 2 );
                setLinesColorUser( "settings_show_tb_listings_color", "user,owner,reviewer,vips", linesNew, 2, owner );
            }
        }
        // Andere Listen: Bei Zeilen in anderen Listen gegebenenfalls Einfärbung für Zebra oder User entfernen.
        else if ( !is_page("cache_listing") ) {
            if ( settings_show_common_lists_in_zebra == false ){
                var lines = $("table").find("tbody").find("tr");
                var replaceSpec = /(AlternatingRow)(\s*)/g;
                setLinesColorNone( lines, replaceSpec );
            }            
            if ( settings_show_common_lists_color_user == false ){
                var lines = $("table").find("tbody").find("tr");
                var replaceSpec = /(TertiaryRow)(\s*)/g;
                setLinesColorNone( lines, replaceSpec );

                // Wenn der User nicht eingefärbt werden soll, Zebra aber ausgewählt ist, dann muss Zebra leider explizit 
                // gesetzt werden, weil nur ein Wert im Standard gesetzt wurde, hier eben der Wert für User - blöd.
                if ( settings_show_common_lists_in_zebra ) {
                    if ( document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/nearest\.aspx\?/)          ||      // - Pocket Query oder ähnlich 
                         document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/recentlyviewedcaches\.aspx/)    ) {  //   oder Recently Viewed,
                        var lines = $("table.Table").find("tbody").find("tr").slice(1);                                           //   dann Überschrift weglassen.
                        setLinesColorInZebra( settings_show_tb_listings_in_zebra, lines, 1 );                                     //   Einzeilig.
                    }
                }
            }            
        }
    } catch (e) {
        gclh_error("Color lines in lists", e);
    }
    
// Fix decrypted Hint linefeeds
    try {
        if (document.getElementById('div_hint')) {
            function gclh_repair_hint() {
                document.getElementById('div_hint').innerHTML = document.getElementById('div_hint').innerHTML.replace(/<c>/g, "<p>");
                document.getElementById('div_hint').innerHTML = document.getElementById('div_hint').innerHTML.replace(/<\/c>/g, "</p>");
            }

            gclh_repair_hint();
            document.getElementById('ctl00_ContentBody_lnkDH').addEventListener("click", gclh_repair_hint, false);
        }
    } catch (e) {
        gclh_error("Fix decrypted Hint linefeed", e);
    }

// Hide Navi on SignIn-Overlay
    try {
        function hide_navi() {
            var navi = document.getElementById('Navigation');
            if (navi.style.display == "") navi.style.display = "none";
            else navi.style.display = "";
        }

        if (document.getElementById('hlSignIn')) document.getElementById('hlSignIn').addEventListener("click", hide_navi, false);
        if (document.getElementById('ctl00_hlSignInClose')) document.getElementById('ctl00_hlSignInClose').addEventListener("click", hide_navi, false);
    } catch (e) {
        gclh_error("Hide Navi on SignIn-Overlay", e);
    }

//--> $$063FE Begin of delete (Größere Anpassungen ohne zeilenweise Änderungsdokumentation.)
//// Save HomeCoords for special bookmarks - From Manage Home Location
//    try {
//        if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/account\/ManageLocations\.aspx/)) {
//            function setCoordsHelper() {
//                if (document.getElementById("LatLng")) {
//                    var search_value = document.getElementById("LatLng").innerHTML;
//
//                    if (search_value.match(/([0-9]+)°([0-9]+)\.([0-9]+)′(N|S), ([0-9]+)°([0-9]+)\.([0-9]+)′(W|E)/) || search_value.match(/^(N|S) ([0-9][0-9]). ([0-9][0-9])\.([0-9][0-9][0-9]) (E|W) ([0-9][0-9][0-9]). ([0-9][0-9])\.([0-9][0-9][0-9])$/)) {
//                        var latlng = toDec(search_value);
//
//                        if (getValue("home_lat", 0) != parseInt(latlng[0] * 10000000)) setValue("home_lat", parseInt(latlng[0] * 10000000)); // * 10000000 because GM don't know float
//                        if (getValue("home_lng", 0) != parseInt(latlng[1] * 10000000)) setValue("home_lng", parseInt(latlng[1] * 10000000));
//                    }
//                }
//            }
//
//            window.addEventListener("load", setCoordsHelper, false); // On first hit, the search-field is filled after loading - so we have to wait
//        }
//
//        // Save HomeCoords - From Account Details
//        if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/account\/default\.aspx/)) {
//            var link = document.getElementById('ctl00_ContentBody_uxMapLocations_ctl01_uxMapLocation');
//
//            if (link) {
//                var match = link.innerHTML.match(/((N|S) [0-9][0-9]. [0-9][0-9]\.[0-9][0-9][0-9] (E|W) [0-9][0-9][0-9]. [0-9][0-9]\.[0-9][0-9][0-9])/);
//                if (match[1]) {
//                    var latlng = toDec(match[1]);
//
//                    if (getValue("home_lat", 0) != parseInt(latlng[0] * 10000000)) setValue("home_lat", parseInt(latlng[0] * 10000000)); // * 10000000 because GM don't know float
//                    if (getValue("home_lng", 0) != parseInt(latlng[1] * 10000000)) setValue("home_lng", parseInt(latlng[1] * 10000000));
//                }
//            }
//        }
//    } catch (e) {
//        gclh_error("Save Homecoords", e);
//    }
//<-- $$063FE End of delete 

//--> $$063FE Begin of insert (Größere Anpassungen ohne zeilenweise Änderungsdokumentation.)
// Save HomeCoords.
    try {
        if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/account\/settings\/homelocation/)) {
            saveHomeCoords();
            document.getElementById('Query').addEventListener('change', saveHomeCoords, false);
        }
    } catch (e) {
        gclh_error('Save Homecoords', e);
    } 
//<-- $$063FE End of insert

//--> $$063FE Begin of insert
// Save HomeCoords.
    function saveHomeCoords() {
        if (document.getElementById('Query')) {
            var link = document.getElementById('Query');
            if (link) {
                var match = link.value.match(/((N|S) ([0-9]+)° ([0-9]+)\.([0-9]+)′ (E|W) ([0-9]+)° ([0-9]+)\.([0-9]+)′)/);
                if (match && match[1]) {
                    match[1] = match[1].replace(/′/g, '');
                    var latlng = toDec(match[1]);
                    if (getValue('home_lat', 0) != parseInt(latlng[0] * 10000000)) {
                        setValue('home_lat', parseInt(latlng[0] * 10000000)); // * 10000000 because GM don't know float
                    }
                    if (getValue('home_lng', 0) != parseInt(latlng[1] * 10000000)) {
                        setValue('home_lng', parseInt(latlng[1] * 10000000));
                    }
                }
            }
        }
    } 
//<-- $$063FE End of insert
    
// Save uid for special bookmarks - From My Profile
    try {
        if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\//)) {
            var links = document.getElementsByTagName("a");

            for (var i = 0; i < links.length; i++) {
                if (links[i].href.match(/\/track\/search\.aspx\?o=1\&uid=/)) {
                    var uid = links[i].href.match(/\/track\/search\.aspx\?o=1\&uid=(.*)/);
                    uid = uid[1];

                    if (getValue("uid", "") != uid) setValue("uid", uid);
                }
            }
        }
    } catch (e) {
        gclh_error("Save uid", e);
    }

// Improve cache matrix on statistics page and profile page and handle cache search links in list or map.
    try {
        // Soll eigene Statistik gepimpt werden.
        if ( ( settings_count_own_matrix || settings_count_own_matrix_show_next ) && 
             ( document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/statistics\.aspx/)     ||
               document.location.href.match(/^https?:\/\/www\.geocaching\.com\/profile\/$/)               ||
               document.location.href.match(/^https?:\/\/www\.geocaching\.com\/profile\/#$/)              ||
               document.location.href.match(/^https?:\/\/www\.geocaching\.com\/profile\/default\.aspx$/)  ||
               document.location.href.match(/^https?:\/\/www\.geocaching\.com\/profile\/default\.aspx#$/) ||
               ( document.location.href.match(/^https?:\/\/www\.geocaching\.com\/profile\/(\?guid=|\?u=)/)   && 
                 document.getElementById('ctl00_ContentBody_lblUserProfile').innerHTML.match(": " + $('.li-user-info').children().first().text()) ) ) ) {
            var own = true;
        // Soll fremde Statistik gepimpt werden.
        } else if ( settings_count_foreign_matrix && 
                    document.location.href.match(/^https?:\/\/www\.geocaching\.com\/profile\/(\?guid=|\?u=)/) && 
                    !document.getElementById('ctl00_ContentBody_lblUserProfile').innerHTML.match(": " + $('.li-user-info').children().first().text()) ) {
            var own = false;
        } else var own = "";
        // Wenn Statistik gepimpt werden soll.
        if ( own !== "" ) {
            // Matrix ermitteln.
            if ( document.getElementById('ctl00_ContentBody_StatsDifficultyTerrainControl1_uxDifficultyTerrainTable') ) {
                var table = document.getElementById('ctl00_ContentBody_StatsDifficultyTerrainControl1_uxDifficultyTerrainTable');
            } else if ( document.getElementById("ctl00_ContentBody_ProfilePanel1_StatsDifficultyTerrainControl1_uxDifficultyTerrainTable") ) {
                var table = document.getElementById("ctl00_ContentBody_ProfilePanel1_StatsDifficultyTerrainControl1_uxDifficultyTerrainTable");
            }
            if (table) {
                // Matrixerfüllung berechnen. 
                var smallest = parseInt(table.getElementsByClassName("stats_cellfooter_grandtotal")[0].innerHTML);
                var count = 0;
                var cells = table.getElementsByTagName('td');
                for (var i = 0; i < cells.length; i++) {
                    var cell = cells[i];
                    if ( cell.id.match(/^([1-9]{1})(_{1})([1-9]{1})$/) ) {
                        if ( parseInt(cell.innerHTML) == smallest ) {
                            count++;
                        } else if ( parseInt(cell.innerHTML) < smallest ) {
                            smallest = parseInt(cell.innerHTML);
                            count = 1;
                        }
                    }
                }
                // Matrixerfüllung ausgeben. 
                if ( ( own == true && settings_count_own_matrix == true )      ||
                     ( own == false && settings_count_foreign_matrix == true )    ) {
                    if ( smallest > 0 ) var matrix = " (" + smallest + " complete and (" + (81 - count) + "/81))";
                    else var matrix = " (" + (81 - count) + "/81)";
                    if ( document.getElementById('uxDifficultyTerrainHelp').previousSibling ) {
                        var side = document.getElementById('uxDifficultyTerrainHelp').previousSibling;
                        side.nodeValue += matrix;
                    }
                }
                // Nächste mögliche Matrixes farblich kennzeichnen und Search Link und Title setzen. 
                if ( own == true && settings_count_own_matrix_show_next == true ) {
                    var from = smallest;
                    var to = smallest - 1 + parseInt(settings_count_own_matrix_show_count_next);
                    var color = "#" + settings_count_own_matrix_show_color_next;
                    for (var i = 0; i < cells.length; i++) {
                        var cell = cells[i];
                        if ( cell.id.match(/^([1-9]{1})(_{1})([1-9]{1})$/) ) {
                            if ( from <= parseInt(cell.innerHTML) && parseInt(cell.innerHTML) <= to ) {
                                cell.style.color = "black";
                                var diff = parseInt(cell.innerHTML) - from;
                                switch (diff) {
                                    case 0: cell.style.backgroundColor = color;  break;
                                    case 1: cell.style.backgroundColor = color + "99"; break;
                                    case 2: cell.style.backgroundColor = color + "65"; break;
                                    case 3: cell.style.backgroundColor = color + "40"; break;
                                }
                                if ( settings_count_own_matrix_links_radius != 0 ) {
                                    var terrain = parseInt(cell.id.match(/^([1-9]{1})(_{1})([1-9]{1})$/)[3]) * 0.5 + 0.5;
                                    var difficulty = parseInt(cell.id.match(/^([1-9]{1})(_{1})([1-9]{1})$/)[1]) * 0.5 + 0.5;
                                    var user = $('.li-user-info').children().first().text();
                                    var aTag = document.createElement('a');
                                    aTag.href = "/play/search/?origin=" + DectoDeg(getValue("home_lat"), getValue("home_lng"))
                                              + "&radius=" + settings_count_own_matrix_links_radius + "km" 
                                              + "&t=" + terrain + "&d=" + difficulty + "&nfb[0]=" + user + "&f=2&o=2&nfb\[1\]=GClh";
                                    if ( settings_count_own_matrix_links == "map" ) aTag.href += "#GClhMap";
                                    else aTag.href += "#searchResultsTable";
                                    aTag.title = "Search D" + difficulty + "/T" + terrain + " radius " + settings_count_own_matrix_links_radius + " km from home";
                                    aTag.target = "_blank";
                                    aTag.style.color = "black";
                                    aTag.appendChild(document.createTextNode( cell.innerHTML ));
                                    cell.innerHTML = "";
                                    cell.appendChild(aTag);
                                }
                            }
                        }
                    }
                }
            }
        }
        // Handle cache search links in list or map.
        if ( document.location.href.match(/^https?:\/\/www\.geocaching\.com\/play\/search\/@(.*)&nfb\[1\]=GClh/) ) {
            $('#map_container').remove();
            $('.selected-filters').remove();
            if ( document.location.href.match(/#GClhMap/) ) {
                if ( document.getElementsByClassName('btn-map-these') ) {
                    location.replace(document.getElementsByClassName('btn-map-these')[0].href);
                    $('.content-slide').remove();
                }
            }
        }
    } catch (e) {
        gclh_error("improve cache matrix", e);
    }

// add mailto-link to profilpage
    try {
        if ((isLocation("/profile/?guid=") || isLocation("/profile/default.aspx?guid=") || isLocation("/profile/?u=") || isLocation("/profile/default.aspx?u=") || isLocation("/profile/?id=") || isLocation("/profile/default.aspx?id=")) && document.getElementById('ctl00_ContentBody_ProfilePanel1_lnkEmailUser')) {
            var messagelink = document.getElementById('ctl00_ContentBody_ProfilePanel1_lnkEmailUser');
            var messagelinktext = messagelink.innerHTML;
            if (messagelinktext.match(/^.+@.+\..+$/)) {
                var mailtolink = document.createElement('a');
                mailtolink.href = "mailto:" + messagelinktext + '?subject=[GC]';
                mailtolink.appendChild(document.createTextNode("(@)"));
                var messagelinkparent = messagelink.parentNode;
                messagelinkparent.appendChild(document.createTextNode(" "));
                messagelinkparent.appendChild(mailtolink);
            }
        }
    } catch (e) {
        gclh_error("add mailto-link to profilepage", e);
    }

// Hide Avatars option. Checkbox zum Avatar in Settings, Preferences anpassen, wenn GClh Logs laden soll: "Show other geocachers' profile photos in logs". 
    try {
        if ( settings_load_logs_with_gclh && 
             document.location.href.match(/^https?:\/\/www\.geocaching\.com\/account\/settings\/preferences/) && 
             document.getElementById("ShowAvatarsInCacheLogs")                                                   ) {
            
            var avatar_checkbox = document.getElementById("ShowAvatarsInCacheLogs");
            avatar_checkbox.checked = !settings_hide_avatar;
            avatar_checkbox.disabled = true;

            var avatar_head = avatar_checkbox.parentNode;
            avatar_head.style.cursor = "unset";
            avatar_head.style.opacity = "0.5";
            
            var link = document.createElement("a");
//--> $$061FE Begin of change
//            link.setAttribute("href", "/my/#GClhShowConfig#a#settings_hide_avatar");
//            link.setAttribute("target", "_blank");
            link.setAttribute("href", "/my/default.aspx#GClhShowConfig#a#settings_hide_avatar");
//<-- $$061FE End of change
            link.appendChild(document.createTextNode("here"));
            
            var hinweis = document.createElement("span");
            hinweis.setAttribute("class", "label");
//--> $$061FE Begin of change
//            hinweis.appendChild(document.createTextNode("You are using \"GC little helper\" - you have to change this option "));
            hinweis.appendChild(document.createTextNode("You are using \"" + scriptName + "\" - you have to change this option "));
//<-- $$061FE End of change
            hinweis.appendChild(link);
            hinweis.appendChild(document.createTextNode("."));

            avatar_head.appendChild(hinweis);
        }
    } catch (e) {
        gclh_error("Hide gc.com Avatar-Option", e);
    }

//--> $$061FE $$062FE Begin of insert (Größere Anpassungen ohne zeilenweise Änderungsdokumentation. Und von unten bei Config nach hier verlegt.)
// Aufbau Links zum Aufruf von Config, Sync und Find Player. 
    try {
        // GClh Config und Sync bei Greasemonkey ins Menu eintragen.
        if (this.GM_registerMenuCommand) {
            if ( checkTaskAllowed( "GClh Config", false ) == true ) GM_registerMenuCommand(scriptNameConfig, gclh_showConfig); 
            else GM_registerMenuCommand(scriptNameConfig, callConfigDefault); 
            if ( checkTaskAllowed( "GClh Sync", false ) == true ) GM_registerMenuCommand(scriptNameSync, gclh_showSync); 
            else GM_registerMenuCommand(scriptNameSync, callSyncDefault);
        }
        
        // GClh Config, Sync und Find Player Aufrufe aus Linklist heraus.
        if ( checkTaskAllowed( "GClh Config", false ) == true ) {
            if ( document.getElementsByName("lnk_gclhconfig")[0] ) {
                document.getElementsByName("lnk_gclhconfig")[0].href = "#GClhShowConfig";
                document.getElementsByName("lnk_gclhconfig")[0].addEventListener('click', gclh_showConfig, false);
            }
        }
        if ( checkTaskAllowed( "GClh Sync", false ) == true ) {
            if ( document.getElementsByName("lnk_gclhsync")[0] ) {
                document.getElementsByName("lnk_gclhsync")[0].href = "#GClhShowSync";
                document.getElementsByName("lnk_gclhsync")[0].addEventListener('click', gclh_showSync, false);
            }
        }
        if ( checkTaskAllowed( "Find Player", false ) == true ) {
            if ( document.getElementsByName("lnk_findplayer")[0] ) {
                document.getElementsByName("lnk_findplayer")[0].href = "#GClhShowFindPlayer";
                document.getElementsByName("lnk_findplayer")[0].addEventListener('click', createFindPlayerForm, false);
            }
        }

        // GClh Config, Sync und Find Player Aufrufe mit Zusatz #GClhShowConfig bzw. #GClhShowSync bzw. #GClhShowFindPlayer. 
        // 2. Schritt derzeit im Link bei Settings, Preferences Avatar, teils in den Links aus der Linklist, teils in GM Menü, 
        // mit rechter Maustaste aus Links neben Avatar auf Profile Seite und teils F4 bei Aufruf Config.    
        if (document.location.href.match(/#GClhShowConfig/)) {
            document.location.href = clearUrlAppendix( document.location.href, true );
            setTimeout(gclh_showConfig, 5);
        }
        if (document.location.href.match(/#GClhShowSync/)) {
            document.location.href = clearUrlAppendix( document.location.href, true );
            setTimeout(gclh_showSync, 5);
        }           
        if (document.location.href.match(/#GClhShowFindPlayer/)) {
            document.location.href = clearUrlAppendix( document.location.href, true );
            setTimeout(createFindPlayerForm, 5);
        }           

        // Profile Seite.
        if ( is_page("profile") && document.getElementById('ctl00_ContentBody_WidgetMiniProfile1_memberProfileLink') ) {
            
            // GClh Config und Sync Links neben Avatar im Profile. 
            var lnk_config = " | <a href='#GClhShowConfig' id='gclh_config_lnk' name='gclh_config_lnk' style='margin-left: 58px; font-size: 0.9em;'>" + scriptShortNameConfig + "</a>";
            var lnk_sync = " | <a href='#GClhShowSync' id='gclh_sync_lnk' name='gclh_sync_lnk' style='font-size: 0.9em;'>" + scriptShortNameSync + "</a>";
            document.getElementById('ctl00_ContentBody_WidgetMiniProfile1_memberProfileLink').parentNode.innerHTML += lnk_config + lnk_sync;
            document.getElementById('gclh_config_lnk').addEventListener('click', gclh_showConfig, false);
            document.getElementById('gclh_sync_lnk').addEventListener('click', gclh_showSync, false);

            // Linklist Ablistung rechts im Profile.
            if ( document.getElementsByName("lnk_gclhconfig_profile")[0] ) {
                document.getElementsByName("lnk_gclhconfig_profile")[0].href = "#GClhShowConfig";
                document.getElementsByName("lnk_gclhconfig_profile")[0].addEventListener('click', gclh_showConfig, false);
            }
            if ( document.getElementsByName("lnk_gclhsync_profile")[0] ) {
                document.getElementsByName("lnk_gclhsync_profile")[0].href = "#GClhShowSync";
                document.getElementsByName("lnk_gclhsync_profile")[0].addEventListener('click', gclh_showSync, false);
            }
            if ( document.getElementsByName("lnk_findplayer_profile")[0] ) {
                document.getElementsByName("lnk_findplayer_profile")[0].href = "#GClhShowFindPlayer";
                document.getElementsByName("lnk_findplayer_profile")[0].addEventListener('click', createFindPlayerForm, false);
            }
        }
        
        // GClh Config und Sync Aufrufe von anderen Seiten auf die Profile Seite mit Zusatz #GClhShowConfig bzw. #GClhShowSync. 
        // Derzeit teils in GM Menü (1. Schritt) verwendet.    
        function callConfigDefault() document.location.href = defaultConfigLink;
        function callSyncDefault() document.location.href = defaultSyncLink;

    } catch (e) {
        gclh_error("Aufbau Links zum Aufruf von Config, Sync und Find Player", e);
    }
//<-- $$061FE $$062FE End of insert
       
//--> $$062FE Begin of insert (Größere Anpassungen ohne zeilenweise Änderungsdokumentation.)
// Special Links aus Linklist versorgen.
    try {
        // Links zu Nearest Lists/Map in Linklist und in Ablistung der Listlist im Profile setzen. 
        if (getValue("home_lat", 0) != 0 && getValue("home_lng") != 0) {
            // Nearest List.
            var link = http + "://www.geocaching.com/seek/nearest.aspx?lat=" + (getValue("home_lat") / 10000000) + "&lng=" + (getValue("home_lng") / 10000000) + "&dist=25&disable_redirect";
            if ( document.getElementsByName("lnk_nearestlist")[0] ) document.getElementsByName("lnk_nearestlist")[0].href = link;
            if ( document.getElementsByName("lnk_nearestlist_profile")[0] ) document.getElementsByName("lnk_nearestlist_profile")[0].href = link;
            // Nearest Map.
            var link = map_url + "?lat=" + (getValue("home_lat") / 10000000) + "&lng=" + (getValue("home_lng") / 10000000);
            if ( document.getElementsByName("lnk_nearestmap")[0] ) document.getElementsByName("lnk_nearestmap")[0].href = link;
            if ( document.getElementsByName("lnk_nearestmap_profile")[0] ) document.getElementsByName("lnk_nearestmap_profile")[0].href = link;
            // Nearest List without Founds.
            var link = http + "://www.geocaching.com/seek/nearest.aspx?lat=" + (getValue("home_lat") / 10000000) + "&lng=" + (getValue("home_lng") / 10000000) + "&dist=25&f=1&disable_redirect";
            if ( document.getElementsByName("lnk_nearestlist_wo")[0] ) document.getElementsByName("lnk_nearestlist_wo")[0].href = link;
            if ( document.getElementsByName("lnk_nearestlist_wo_profile")[0] ) document.getElementsByName("lnk_nearestlist_wo_profile")[0].href = link;
        }

        // Links zu den eigenen Trackables setzen. 
        if (getValue("uid", "") != "") {
            var link = http + "://www.geocaching.com/track/search.aspx?o=1&uid=" + getValue("uid");
            if ( document.getElementsByName("lnk_my_trackables")[0] ) document.getElementsByName("lnk_my_trackables")[0].href = link;
            if ( document.getElementsByName("lnk_my_trackables_profile")[0] ) document.getElementsByName("lnk_my_trackables_profile")[0].href = link;
        }
    } catch (e) {
        gclh_error("Special Links", e);
    }
//<-- $$062FE End of insert
    
// Add Download Link to Labs cache Pages
    try {
        if (document.location.href.match(/^https?:\/\/labs\.geocaching\.com\/Adventures\/Details\/(\w|\-)*/)) {
            // removing -> background-image: -moz-linear-gradient(left center , rgba(157, 178, 81, 0) 0%, #9db251 100%);
            // This gets a clearer view, if more than one Navigation Button is Displayed
            for(var i=0 ; i < document.styleSheets.length ; i++){
                if(document.styleSheets[i].href && document.styleSheets[i].href.match(/^https?:\/\/labs\.geocaching\.com\/Content\/css\/main\?[v]\=\w*/)){
                    document.styleSheets[i].cssRules[384].style['background-image'] = "none";
                }
            }

            // Example Path for Site      /Adventures/Details/90ced6d4-0a22-4c19-a491-7ae17d489c60
            // Example Path for Download  /Adventures/DetailsAsGPX/90ced6d4-0a22-4c19-a491-7ae17d489c60
            // Get current Path with GUID and create download Path
            pathName = window.location.pathname;
            pathValues = pathName.split("/");
            downloadPath = "/Adventures/DetailsAsGPX/" + pathValues[3];

            // Move existing Leaderboard Button to the left
            // Create new Button with Download Link
            $('#leaderboard')
                .css({
                    "margin-right" : "0px",
                    "padding-right": "9px",
                    "padding-left" : "9px",
                    "right"        : "184px"
                })
                .parent()
                .append(
                    '<a id="dl_link" class="link-leaderboard" href="' + downloadPath + '" style="padding-left: 9px;">Download‌ as‌ GPX‌ File</a>'
                );
        }
    } catch (e) {
        gclh_error("Lab Gpx Downlad Link hinzufügen", e);
    }

//--> $$061FE Begin of insert (Größere Anpassungen ohne zeilenweise Änderungsdokumentation.)
// Check for Updates.
    try {
        var next_check = parseInt(getValue("update_next_check"), 10);
        if (!next_check) next_check = 0;
        var time = new Date().getTime();

        if ( next_check < time) {
            var url = "https://github.com/2Abendsegler/GClh/raw/master/gc_little_helper_II.user.js";
            var token = getValue("token", "");
            if (token == "") setValue("token", "" + Math.random());
            time += 1 * 60 * 60 * 1000; // 1 Stunde warten, bis zum nächsten Check.
            setValue('update_next_check', time.toString());
            
            if (GM_xmlhttpRequest) {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    onload: function (result) {
                        try {
                            var version = result.responseText.match(/\/\/\s\@version(.*)/);
                            if ( version ) {
                                var new_version = version[1].replace(/\s/g, "");
                                if ( new_version != scriptVersion ) {
                                    var currVersion = "version " + scriptVersion;
                                    var text = "Version " + new_version + " of script \""+ scriptName + "\" is available.\n" +
                                               "You are currently using " + currVersion + ".\n\n" +
                                               "Click OK to upgrade.\n";
                                    if (window.confirm(text)) {
                                        window.open(url, '_blank');
                                    } else { 
                                        time += 7 * 60 * 60 * 1000; // 1+7 Stunden warten, bis zum nächsten Check.
                                        setValue('update_next_check', time.toString());
                                    }
                                }
                            }
                        } catch (e) { 
                            gclh_error("Check for updates, onload", e); 
                        }
                    }
                });
            }
        }
        var declaredVersion = getValue("declared_version", scriptVersion);
        if ( declaredVersion != scriptVersion ) {
            setValue("declared_version", scriptVersion);
            simulateDownloadCounter();
        }
    } catch (e) {
        gclh_error("Check for updates", e);
    }
//<-- $$061FE End of insert

////////////////////////////////////////////////////////////////////////////
// Functions Helper (fun2)
////////////////////////////////////////////////////////////////////////////
// CSS Style hinzufügen.
    function appendCssStyle( css ) {
        var head = document.getElementsByTagName('head')[0];
        var style = document.createElement('style');
        style.innerHTML = css;
        style.type = 'text/css';
        head.appendChild(style);
    }

// HTML dekodieren, also beispielsweise: "&amp;" in "&" 
// (Beispiel: User "Rajko & Dominik".)
    function decode_innerHTML(variable_mit_innerHTML) {
        var elem = document.createElement('textarea');
        elem.innerHTML = variable_mit_innerHTML.innerHTML;
        variable_decode = elem.value;
        variable_new = variable_decode.trim();
        return variable_new;
    }

// Zu lange Zeilen "kürzen", damit nicht umgebrochen wird.
    function noBreakInLine( n_side, n_maxwidth, n_title ) {
        if ( n_side == "" || n_side == undefined ) return;
        if ( n_maxwidth == 0 ) return;
        n_side.setAttribute("style", "max-width: " + n_maxwidth + "px; display: inline-block; overflow: hidden; vertical-align: bottom; white-space: nowrap; text-overflow: ellipsis;");
        if ( n_title != "" ) {
            n_side.setAttribute("title", n_title);
        }
        return;
    }

// Tabellenzeilen in Zebra Look einfärben bzw. Einfärbung entfernen.    
    function setLinesColorInZebra( parameter, lines, linesTogether ) {
        if ( lines.length == 0 ) return;
        var replaceSpec = /(AlternatingRow)(\s*)/g;
        var setSpec = "AlternatingRow";
        
        // Wenn eine Einfärbung nicht stattfinden soll.
        if ( parameter == false ) {
            setLinesColorNone( lines, replaceSpec );
        }
        // Wenn eine Einfärbung stattfinden soll.
        else {
            // Die Zeilen im ersten Zeilenbereich gegebenenfalls auf hell zurücksetzen.        
            for ( var i = 0; i < lines.length; i += (2 * linesTogether) ) {
                for ( var j = 0; j < linesTogether; j++) {
                    if ( lines[i+j].className.match( replaceSpec ) ) {
                        var newClass = lines[i+j].className.replace( replaceSpec, "" );
                        lines[i+j].setAttribute("class", newClass);
                    }
                }        
            }
            // Die Zeilen im zweiten Zeilenbereich gegebenenfalls an erster Stelle auf dunkel setzen.
            for ( var i = linesTogether; i < lines.length; i += (2 * linesTogether) ) {
                for ( var j = 0; j < linesTogether; j++) {
                    if ( lines[i+j].className.match( replaceSpec ) );
                    else {
                        if ( lines[i+j].getAttribute("class") == (undefined|null|"") ) var oldClass = "";
                        else var oldClass = " " + lines[i+j].getAttribute("class");
                        lines[i+j].setAttribute("class", setSpec + oldClass);
                    }
                }
            }
        }
    }
    
// Tabellenzeilen für User und Owner einfärben bzw. Einfärbung entfernen.    
    function setLinesColorUser( parameterStamm, tasks, lines, linesTogether, owner ) {
        if ( lines.length == 0 ) return;
        var user = $('.li-user-info').children().first().text();
        if ( owner == undefined ) var owner = "";
        var vips = getValue("vips");
//--> $$063FE Begin of insert
        vips = vips.replace(/, (?=,)/g, ",null");
        vips = JSON.parse(vips);
//<-- $$063FE End of insert
        
        var setSpecUser = "TertiaryRow";
        var setSpecOwner = "QuaternaryRow";
        var setSpecReviewer = "QuinaryRow";
        var setSpecVip = "SenaryRow";
        var replaceSpecUser = /(TertiaryRow)(\s*)/g;
        var replaceSpecVip = /(SenaryRow)(\s*)/g;

        var parameter = new Array();
        if ( tasks.match("user") ) parameter["user"] = getValue( parameterStamm + "_user" );
        else parameter["user"] = "";
        if ( tasks.match("owner") ) parameter["owner"] = getValue( parameterStamm + "_owner" );
        else parameter["owner"] = "";
        if ( tasks.match("reviewer") ) parameter["reviewer"] = getValue( parameterStamm + "_reviewer" );
        else parameter["reviewer"] = "";
        if ( tasks.match("vip") ) parameter["vip"] = getValue( parameterStamm + "_vip" );
        else parameter["vip"] = "";

        // Wenn eine Einfärbung für den User nicht stattfinden soll, dann entfernen.
        if ( parameter["user"] == false ) {
            setLinesColorNone( lines, replaceSpecUser );
        }
        
        // Wenn eine Einfärbung stattfinden soll.
        if ( parameter["user"] == true || parameter["owner"] == true || parameter["reviewer"] == true || parameter["vip"] == true ) {
            for ( var i = 0; i < lines.length; i += linesTogether ) {
                var newClass = "";
                var aTags = lines[i].getElementsByTagName("a");
                var imgTags = lines[i].getElementsByTagName("img");
                
                // Anhand der guid prüfen, ob eine Einfärbung in diesem Zeilenbereich für User oder Owner notwendig ist.
                // Verarbeitung für die Seiten: Cache Listing, TB Listing
                if ( parameter["user"] || parameter["owner"] ) {
                    for (var j = 0; j < aTags.length; j++) {
                        if ( aTags[j].href.match(/\/profile\/\?guid=/) ) {
                            if ( decode_innerHTML( aTags[j] ) == user && parameter["user"] ) newClass = setSpecUser;
                            else if ( decode_innerHTML( aTags[j] ) == owner && parameter["owner"] ) newClass = setSpecOwner;
                            break;
                        }
                    }
                    // Anhand des Found Icons prüfen, ob eine Einfärbung in diesem Zeilenbereich für den User notwendig ist.
                    // Verarbeitung für die Seiten: Bookmark Listen
                    if ( newClass == "" && parameter["user"] ) {
                        for (var j = 0; j < imgTags.length; j++) {
                            if ( imgTags[j].src.match(/\/found\./) ) {
                                newClass = setSpecUser;
                                break;
                            }
                        }
                    }
                }                    
                // Anhand des Admin Icons prüfen, ob eine Einfärbung in diesem Zeilenbereich für den Reviewer notwendig ist.
                // Verarbeitung für die Seiten: Cache Listing, TB Listing
                if ( newClass == "" && parameter["reviewer"] ) {
                    for (var j = 0; j < imgTags.length; j++) {
                        if ( imgTags[j].src.match(/\/icon_admin\./) ) {
                            newClass = setSpecReviewer;
                            break;
                        }
                    }
                }
                // Anhand des titles zum VIP Icon und der guid der VIP prüfen, ob eine Einfärbung in diesem Zeilenbereich für eine VIP notwendig ist.
                // Beachten, dass sich eine VIP auch während der Seitendarstellung ändern kann.
                // Verarbeitung für die Seiten: Cache Listing, TB Listing
                if ( newClass == "" && parameter["vip"] && vips ) {
                    // Farbe für VIP zurücksetzen.
                    for (var j = 0; j < linesTogether; j++) {
                        if ( lines[i+j].className.match( replaceSpecVip ) ) {
                            var replaceClass = lines[i+j].className.replace( replaceSpecVip, "" );
                            lines[i+j].setAttribute("class", replaceClass);
                        }
                    }
                    // Wenn VIP Icon gesetzt ist und guid in der VIPS Area vorhanden ist, dann merken, dass Farbe für VIP gesetzt werden muss.
                    for (var j = 0; j < imgTags.length; j++) {
                        if ( imgTags[j].title.match(/from VIP-List/) ) {
                            for (var k = 0; k < aTags.length; k++) {
                                if ( aTags[k].href.match(/\/profile\/\?guid=/) ) {
//--> $$063FE Begin of change
//                                    if ( vips.match( decode_innerHTML( aTags[k] ) ) ) {
                                    if (in_array(decode_innerHTML( aTags[k] ), vips) ) {
//<-- $$063FE End of change
                                        newClass = setSpecVip;
                                    }
                                    break;
                                }
                            }
                            break;
                        }
                    }
                }

                // Wenn eine Einfärbung notwendig ist. 
                // Prüfen, ob die Einfärbung noch nicht vorhanden ist, und gegebenenfalls dann an erster Stelle einbauen.
                if ( newClass != "" ) {
                    for (var j = 0; j < linesTogether; j++) {
                        if ( lines[i+j].className.match( newClass ) ); 
                        else {
                            if ( lines[i+j].getAttribute("class") == null ) var oldClass = "";
                            else var oldClass = " " + lines[i+j].getAttribute("class");
                            lines[i+j].setAttribute("class", newClass + oldClass );
                        }
                    }
                }
            }
        }
    }

// Spezifikation für die Einfärbung der Zeile entfernen.
    function setLinesColorNone( lines, replSpez ) {
        if ( lines.length == 0 ) return;
        for ( var i = 0; i < lines.length; i++ ) {
            if ( lines[i].className.match( replSpez ) ) {
                var newClass = lines[i].className.replace( replSpez, "" );
                lines[i].setAttribute("class", newClass);
            }
        }
    }
    
// Neue Parameter im GClh Config hervorheben und Info setzen, zu welcher Version ein Parameter dazugekommen ist. 
// Info kann auch ohne Hervorhebung verwendet werden, muß dann aber in jeder Zeile hinterlegt werden.
// Aufbau idealerweise in eigenen Zeilen, damit man irgendwann man schnell Zeilen rausschmeißen kann, wenn die Infos alt sind: 
//--> $$000FE Begin of change                                               | Hier.
    newParameterOn1 = "<div  style='background-color: rgba(240, 223, 198, 0.6); width: 100%; height: 100%; padding: 2px 0px 2px 2px; margin-left: -2px;'>";
    newParameterOn2 = "<div  style='background-color: rgba(240, 223, 198, 1.0); width: 100%; height: 100%; padding: 2px 0px 2px 2px; margin-left: -2px;'>";
    newParameterOn3 = "<div  style='background-color: rgba(240, 223, 198, 0.3); width: 100%; height: 100%; padding: 2px 0px 2px 2px; margin-left: -2px;'>";
    newParameterLL1 = '<span style="background-color: rgba(240, 223, 198, 0.6); float: right; padding-top: 25px; width: 100%; margin: -22px 2px 0px 0px;"></span>'; 
    newParameterLL2 = '<span style="background-color: rgba(240, 223, 198, 1.0); float: right; padding-top: 25px; width: 100%; margin: -22px 2px 0px 0px;"></span>'; 
    newParameterLL3 = '<span style="background-color: rgba(240, 223, 198, 0.3); float: right; padding-top: 25px; width: 100%; margin: -22px 2px 0px 0px;"></span>'; 
//<-- $$000FE End of change
    function newParameterVersionSetzen(version) {
        var newParameterVers = "<span style='font-size: 70%; font-style: italic; float: right; margin-top: -14px; margin-right: 4px;' ";
        if ( version != "" ) { newParameterVers += "title='Implemented with version " + version + "'>" + version + "</span>"; }         
        else { newParameterVers += "></span>"; }
//--> $$#30FE Begin of insert
        if ( settings_hide_colored_versions ) newParameterVers = "";
//<-- $$#30FE End of insert
        return newParameterVers;
    }
    newParameterOff = "</div>";
    function newParameterLLVersionSetzen(version) {
        var newParameterVers = '<span style="font-size: 70%; font-style: italic; margin-top: 10px; margin-left: -192px; position: absolute; cursor: default;"';
        if ( version != "" ) { newParameterVers += 'title="Implemented with version ' + version + '">' + version + '</span>'; }         
        else { newParameterVers += '></span>'; }
//--> $$#30FE Begin of insert
        if ( settings_hide_colored_versions ) newParameterVers = "";
//<-- $$#30FE End of insert
        return newParameterVers;
    }
//--> $$#30FE Begin of insert
    if ( settings_hide_colored_versions ) newParameterOn1 = newParameterOn2 = newParameterOn3 = newParameterLL1 = newParameterLL2 = newParameterLL3 = newParameterOff = "";
//<-- $$#30FE End of insert

//--> $$068FE Begin of insert
// Downloadzähler simulieren, weil GitHub das wohl nicht kann.
    function simulateDownloadCounter() {
        GM_xmlhttpRequest({
            method: "GET",
//--> $$000FE Begin of change
            url: "https://goo.gl/4ZBbxW",  // Installationszähler Version 0.2.2.1
//<-- $$000FE End of change
            onload: function (result) {
            }
        });
    }
//<-- $$068FE End of insert
    
// Seite abdunkeln. 
    function buildBgShadow() {
        var shadow = document.createElement("div");
        shadow.setAttribute("id", "bg_shadow");
        // z-index sorgt dafür, dass Menü auch nicht eingabebereit ist.
        shadow.setAttribute("style", "z-index:1000; width: 100%; height: 100%; background-color: #000000; position:fixed; top: 0; left: 0; opacity: 0.5; filter: alpha(opacity=50);");
        document.getElementsByTagName('body')[0].appendChild(shadow);
        document.getElementById('bg_shadow').addEventListener("click", btnClose, false);
    }

// Check, ob man sich im GClh Config befindet.
    function check_config_page () {
        var config_page = false;
        if ( document.getElementById('bg_shadow') && document.getElementById("bg_shadow").style.display == "" ) {
            if ( document.getElementById("settings_overlay") && document.getElementById("settings_overlay").style.display == "" ) {
                config_page = true;
            }
        }
        return config_page;            
    }
    
// Prüfen, ob die spezielle Verarbeitung auf der aktuellen Seite erlaubt ist.
// Spezielle Verarbeitungen sind derzeit: GClh Config, GClh Config Sync, Find Player.
    function checkTaskAllowed( task, doAlert ) {
        if ( ( document.location.href.match(/^https?:\/\/www\.wherigo\.com/)    || 
               document.location.href.match(/^https?:\/\/www\.waymarking\.com/) ||
               isMemberInPmoCache()                                                ) ||
             ( task != "Find Player" && 
               ( document.location.href.match(/^https?:\/\/www\.geocaching\.com\/(map|play|account)\//) ||
                 document.location.href.match(/^https?:\/\/labs\.geocaching\.com/)                         ) ) ) {
            if ( doAlert != false ) {
                var mess = "This GC little helper functionality is not available at this page.\n\n"
                         + "Please go to the \"My profile\" page, there is anyway all of these \n"
                         + "functionality available. ( www.geocaching.com/my )";
                alert( mess );
            }
            return false;
        } 
        return true;
    }
    
// Zusatz in der Url, eingeleitet durch "#", zurücksetzen bis auf "#". 
    function clearUrlAppendix( url, onlyTheFirst ) {
        var urlSplit = url.split('#');
        var newUrl = "";
        if ( onlyTheFirst ) {
            newUrl = url.replace(urlSplit[1], "").replace("##", "#");
        } else {
            newUrl = urlSplit[0] + "#";
        }
        return newUrl;
    }
    
// Prüfen ob ein Basic Member in einem PMO Cache loggen möchte.
    function isMemberInPmoCache() {
        if ( is_page("cache_listing") &&
             document.getElementsByClassName("pmo-banner")[0] && document.getElementsByClassName("pmo-upsell")[0] ) {
            return true;
        } else {
            return false;
        }
    }            

// Aktuelles Datum und aktuelle Zeit ermitteln und aufbereiten.
    function getDateTime() {
        var now = new Date();
        var aDate = $.datepicker.formatDate( 'dd.mm.yy', now );
        var hrs = now.getHours();
        var min = now.getMinutes();
        hrs = ((hrs < 10) ? '0' + hrs : hrs);
        min = ((min < 10) ? '0' + min : min);
        var aTime = hrs+':'+min;
        var aDateTime = aDate+' '+aTime;
        return [ aDate, aTime, aDateTime ];
    }

//--> $$064FE Begin of insert
// Show, hide Box. Beispielsweise die beiden VIP Boxen im Cache Listing. Kann aber auch für andere Dinge genutzt werden.
    function showHideBoxCL( id_lnk, first ) {
        var name_show_box = id_lnk.replace("lnk_", "show_box_");
        var id_box = id_lnk.replace("lnk_", "");
        var show_box = getValue(name_show_box, true); 
        if ( document.getElementById(id_lnk) ) var lnk = document.getElementById(id_lnk);
        if ( document.getElementById(id_box) ) var box = $('#' + id_box);
        if ( !box ) {
            if ( document.getElementsByClassName(id_box) ) var box = $('.' + id_box);
        }
        if ( lnk && box ) {
            if ( ( show_box == true && first == true )   ||
                 ( show_box == false && first == false )    ) {
                setShowHide( lnk, "hide" );
                box.show();
                setValue(name_show_box, true);
            } else {
                setShowHide( lnk, "show" );
                box.hide();
                setValue(name_show_box, false);
            }
        } 
    }

// Show bzw. hide setzen.
    function setShowHide( row, whatToDo ) {
        if ( whatToDo == "show" ) {
            row.title = "show"; 
            row.src = http + "://www.geocaching.com/images/plus.gif";
        } else {
            row.title = "hide"; 
            row.src = http + "://www.geocaching.com/images/minus.gif";
        }
    }
//<-- $$064FE End of insert

//--> $$062FE Begin of insert (Größere Anpassungen ohne zeilenweise Änderungsdokumentation.)
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
// Find Player
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
// Create and hide the "Find Player" Form
    function createFindPlayerForm() {
        // Alle eventuellen Verarbeitungen schließen.
        btnClose();
        // Prüfen, ob die aktuelle Seite für eine Verarbeitung geeignet ist.
        if ( checkTaskAllowed( "Find Player", true ) == false ) return;

        if (document.getElementById('bg_shadow')) {
            if (document.getElementById('bg_shadow').style.display == "none") {
                document.getElementById('bg_shadow').style.display = "";
            }
        } else {
            buildBgShadow();
        }

        if (document.getElementById('findplayer_overlay') && document.getElementById('findplayer_overlay').style.display == "none") {
            document.getElementById('findplayer_overlay').style.display = "";
        } else {
            var html = "";
            html += "#findplayer_overlay {";
            html += "  background-color: #d8cd9d; ";
            html += "  width:350px;";
            html += "  border: 2px solid #778555; ";
            html += "  overflow: auto; ";
            html += "  padding:10px; ";
            html += "  position: absolute; ";
            html += "  left:30%; ";
            html += "  top:60px; ";
            html += "  z-index:1001; ";
            html += "  -moz-border-radius:30px; ";
            html += "  -khtml-border-radius:30px; ";
            html += "  border-radius: 30px;";
            html += "  overflow: auto;";
            html += "}";
            html += ".gclh_form {";
            html += "  background-color: #d8cd9d !important;";
            html += "  border: 2px solid #778555 !important;";
            html += "  -moz-border-radius: 7px;";
            html += "  -khtml-border-radius: 7px;";
            html += "  border-radius: 7px !important;";
            html += "  padding-left: 5px !important;";
            html += "  padding-right: 5px !important;";
            html += "  font-family: inherit;";
            html += "  font-size: 13px !important;";
            html += "  font-weight: normal !important;";
            html += "  margin: 0px !important;";
            html += "  color: rgb(0, 0, 0) !important;";
            html += "  padding-top: 0px !important;";
            html += "  padding-bottom: 0px !important;";
            html += "  box-shadow: unset !important;";
            html += "  display: unset;";
            html += "}";
            var form_side = document.getElementsByTagName('body')[0];
            var form_style = document.createElement("style");
            form_style.appendChild(document.createTextNode(html));
            form_side.appendChild(form_style);

            // Overlay erstellen
            var html = "";
            html += "<h3 style='margin:5px; font-weight: bold; font-size: 19.5px; line-height: 1; color: #594a42;'>Find Player</h3>";
            html += "<form style='text-align: unset;' action=\"/find/default.aspx\" method=\"post\" name=\"aspnetForm\" >";
            html += "<input class='gclh_form' type='hidden' name='__VIEWSTATE' value=''>";
            if ( is_page("settings") || is_page("map") || is_page("labs") ) {
                html += "<input style='width: 171px; height: 20px;' class='gclh_form' id='findplayer_field' class=\"Text\" type=\"text\" maxlength=\"100\" name=\"ctl00$ContentBody$FindUserPanel1$txtUsername\"/>";
            } else if ( is_page("messagecenter") || is_page("find_cache") || is_page("hide_cache") || is_page("geotours") ) {
                html += "<input style='width: 175px; height: 24px;' class='gclh_form' id='findplayer_field' class=\"Text\" type=\"text\" maxlength=\"100\" name=\"ctl00$ContentBody$FindUserPanel1$txtUsername\"/>";
            } else {
                html += "<input style='height: 20px;' class='gclh_form' id='findplayer_field' class=\"Text\" type=\"text\" maxlength=\"100\" name=\"ctl00$ContentBody$FindUserPanel1$txtUsername\"/>";
            }
            if ( is_page("messagecenter") || is_page("find_cache") || is_page("hide_cache") || is_page("geotours") || is_page("map") || is_page("labs") ) {
                html += " <input style='cursor: pointer; height: 24px;' class='gclh_form' type=\"submit\" value=\"Go\" name=\"ctl00$ContentBody$FindUserPanel1$GetUsers\"/>"; 
                html += " <input style='cursor: pointer; height: 24px;' class='gclh_form' id='btn_close1' type='button' value='close'>";
            } else {
                html += " <input style='cursor: pointer;' class='gclh_form' type=\"submit\" value=\"Go\" name=\"ctl00$ContentBody$FindUserPanel1$GetUsers\"/>"; 
                html += " <input style='cursor: pointer;' class='gclh_form' id='btn_close1' type='button' value='close'>";
            }
            html += "</form>";
            var form_div = document.createElement("div");
            form_div.setAttribute("id", "findplayer_overlay");
            form_div.setAttribute("align", "center");
            form_div.innerHTML = html;
            form_div.appendChild(document.createTextNode(""));
            form_side.appendChild(form_div);

            document.getElementById("findplayer_field").focus();
            document.getElementById('btn_close1').addEventListener("click", btnClose, false);
        }
        // Fokusierung auf Verarbeitung, damit Menüs einklappen. 
        document.getElementById("findplayer_overlay").click();
        // Stell den Cursor ins Feld. 
        document.getElementById("findplayer_field").focus();
    }
//<-- $$062FE End of insert

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
// Config
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
    function checkboxy(setting_id, label) {
        // Hier werden auch gegebenenfalls "Clone" von Parametern verarbeitet. (Siehe Erläuterung weiter unten bei "setEventsForDoubleParameters".) 
        var setting_idX = setting_id;
        setting_id = setting_idX.replace(/(X[0-9]*)/, "");
//--> $$001CF Begin of change	
        return "<input type='checkbox' " + (getValue(setting_id) ? "checked='checked'" : "" ) + " id='" + setting_idX + "'><label for='" + setting_idX + "'>" + label + "</label>";
//<-- $$001CF end of change
    }

    function show_help(text) {
        return " <a class='gclh_info' style='cursor: help' href='javascript:void(0);'><b>?</b><span class='gclh_span'>" + text + "</span></a>";
    }

    function create_config_css() {
        var css = document.createElement("style");
        var html = "";
        html += ".settings_overlay {";
        html += "  background-color: #d8cd9d; ";
        html += "  width:600px;";
        html += "  border: 2px solid #778555; ";
        html += "  overflow: auto; ";
        html += "  padding:10px; ";
        html += "  position: absolute; ";
        html += "  left:30%; ";
        html += "  top:10px; ";
        html += "  z-index:1001; ";
        html += "  -moz-border-radius:30px; ";
        html += "  -khtml-border-radius:30px; ";
        html += "  border-radius: 30px;";
        html += "  overflow: auto;";
        html += "}";
        html += "";
        html += ".gclh_headline {";
        html += "  height: 21px; ";
        html += "  margin:5px; ";
        html += "  background-color: #778555; ";
        html += "  color: #FFFFFF;";
        html += "  -moz-border-radius:30px; ";
        html += "  -khtml-border-radius:30px; ";
        html += "  border-radius: 30px;";
        html += "  text-align: center;";
        html += "}";
        html += "";
        html += ".gclh_headline2 {";
        html += "  margin: 5px;";
        html += "}";
        html += "";
        html += ".gclh_content {";
        html += "  padding: 2px 10px 10px 10px;";
        html += "  font-family: Verdana;";
        html += "  font-size: 14px;";
        html += "}";
        html += "";
        html += ".gclh_form {";
        html += "  background-color: #d8cd9d;";
        html += "  border: 2px solid #778555;";
        html += "  -moz-border-radius: 7px;";
        html += "  -khtml-border-radius: 7px;";
        html += "  border-radius: 7px;";
        html += "  padding-left: 5px;";
        html += "  padding-right: 5px;";
        html += "}";
        html += ".gclh_ref {";
        html += "  color: #000000;";
        html += "  text-decoration: none;";
        html += "  border-bottom: dotted 1px black;";
        html += "}";
        html += "";
        html += ".gclh_small {";
        html += "  font-size: 10px;";
        html += "}";
        html += "";
        // Highlight
        html += "a.gclh_info {";
        html += "  color: #000000;";
        html += "  text-decoration: none;";
        html += "}";
        html += "";
        html += "a.gclh_info:hover {";
        html += "  position: relative;";
        html += "}";
        html += "";
        html += "a.gclh_info span {";
        html += "  visibility: hidden;";
        html += "  position: absolute; top:-310px; left:0px;";
        html += "  padding: 2px;";
        html += "  text-decoration: none;";
        html += "  text-align: left;";
        html += "  vertical-align: top;";
        html += "  font-size: 12px;";
        html += "  z-index: 105;";
        html += "}";
        html += "";
        html += "a.gclh_info:hover span {";
        html += "  width: 250px;";
        html += "  visibility: visible;";
        html += "  top: 10px;";
        html += "  left: -125px;";
        html += "  font-weight: normal;";
        html += "  border: 1px solid #000000;";
        html += "  background-color: #d8cd9d;";
        html += "}";
        html += "";
        html += ".multi_homezone_settings {";
        html += "  width: 50%;";
        html += "  padding: 10px 0;";
        html += "  margin: 10px 0 10px 10px;";
        html += "  border: 1px solid #CFC0B8;";
        html += "  border-width: 1px 0;";
        html += "}";
        html += ".multi_homezone_element {";
        html += "  margin-bottom: 10px;";
        html += "}";
        css.innerHTML = html;
        document.getElementsByTagName('body')[0].appendChild(css);
    }

// Configuration Menu
    function gclh_showConfig() {
        // Alle eventuellen Verarbeitungen schließen ohne Url zu clearen.
        btnClose( false );
        // Prüfen, ob die aktuelle Seite für eine Verarbeitung geeignet ist. Dazu sollte es aber eigentlich gar nicht kommen.
        if ( checkTaskAllowed( "GClh Config", true ) == false ) return;

        // the configuration is always displayed at the top, so scroll away from logs or other lower stuff
        window.scroll(0, 0);

        if (document.getElementById('bg_shadow')) {
            // If shadow-box already created, just show it
            if (document.getElementById('bg_shadow').style.display == "none") {
                document.getElementById('bg_shadow').style.display = "";
            }
        } else {
            buildBgShadow();
        }

        if (document.getElementById('settings_overlay') && document.getElementById('settings_overlay').style.display == "none") {
            // If menu already created, just show it
            document.getElementById('settings_overlay').style.display = "";
        } else {
            create_config_css();
            var div = document.createElement("div");
            div.setAttribute("id", "settings_overlay");
            div.setAttribute("class", "settings_overlay");
            var html = "";
//--> $$070FE Begin of change
//            html += "<h3 class='gclh_headline'>" + scriptNameConfig + " <font class='gclh_small'>v" + scriptVersion + "</font></h3>";
            html += "<h3 class='gclh_headline' title='Some little things to make life easy (on www.geocaching.com).' >" + scriptNameConfig + " <font class='gclh_small'>v" + scriptVersion + "</font></h3>";
//<-- $$070FE End of change
            html += "<div class='gclh_content'>";
//--> $$060FE Begin of change
//            html += "&nbsp;" + "<font class='gclh_small'><a href='https://github.com/amshove/GC_little_helper/wiki/German-Help' target='_blank'>Hier</a> gibt es eine deutsche Anleitung zu den Einstellungen.</font><br>";
//            html += "&nbsp;" + "<font class='gclh_small'>Contribute to GClh on <a href='https://github.com/amshove/GC_little_helper' target='_blank'>github.com</a></font>";
//--> $$066FE Begin of delete
//            html += "&nbsp;" + "<font class='gclh_small'>Contribute to GClh on <a href='https://github.com/2Abendsegler/GC_little_helper_2AS' target='_blank'>github.com</a></font>";
//<-- $$066FE End of delete 
//<-- $$060FE End of change
//--> $$066FE Begin of change
//            html += "<br><br>";
//--> $$070FE Begin of change
//            html += "&nbsp;" + "<font class='gclh_small' style='float: right' ><a href='http://geoclub.de/forum/viewtopic.php?f=117&t=79372' target='_blank'>Help</a>, <a href='https://raw.githubusercontent.com/2Abendsegler/GClh/master/Changelog.txt' target='_blank'>Changelog</a>, <a href='https://rawgit.com/2Abendsegler/GClh/master/Wish list.pdf' target='_blank'>Wish list</a>, <a href='https://github.com/2Abendsegler/GClh' target='_blank'>GitHub</a></font>";
            html += "&nbsp;" + "<font style='float: right; font-size: 12px; ' >";
            html += "<a href='http://geoclub.de/forum/viewforum.php?f=117' title='Help, is available on the geoclub forum' target='_blank'>Help</a> | ";
            html += "<a href='https://raw.githubusercontent.com/2Abendsegler/GClh/master/Changelog.txt' title='Changelog, on GitHub' target='_blank'>Changelog</a> | ";
            html += "<a href='https://github.com/2Abendsegler/GClh/issues?q=is:issue is:open sort:created-desc' title='Open issues, on GitHub' target='_blank'>Open issues</a> | ";
            html += "<a href='https://github.com/2Abendsegler/GClh/issues?q=is:issue is:open label:\"tag: wish\" sort:created-desc' title='Open wishes, on GitHub' target='_blank'>Open wishes</a> | ";
            html += "<a href='https://github.com/2Abendsegler/GClh' title='GitHub' target='_blank'>GitHub</a></font>";
//<-- $$070FE End of change
            html += "<br>";
//<-- $$066FE End of change
            html += "<h4 class='gclh_headline2'>Global</h4>";
            html += "&nbsp;" + "Home-Coords: <input class='gclh_form' type='text' size='21' id='settings_home_lat_lng' value='" + DectoDeg(getValue("home_lat"), getValue("home_lng")) + "'>" + show_help("The Home-Coords are filled automatically if you update your Home-Coords on gc.com. If it doesn\'t work you can insert them here. These coords are used for some special links (nearest list, nearest map, ..) and for the homezone circle on the map.") + "<br>";
//--> $$070FE Begin of insert
            html += newParameterOn2;
            html += checkboxy('settings_set_default_langu', 'Set default language ');
            html += "<select class='gclh_form' id='settings_default_langu'>";
            for ( var i = 0; i < langus.length; i++ ){
                html += "  <option value='" + langus[i] + "' " + (settings_default_langu == langus[i] ? "selected='selected'" : "") + ">" + langus[i] + "</option>";
            }
            html += "</select>" + show_help("Here you can change the default language to set on gc pages, in the case, apps changed the language.<br><br>The gc pages map, labs and message-center have no possibility to change a language. On these pages nothing will done.<br><br>For the future is planned to make the GClh multilingual. Until that is realized, the GClh is only in english.") + "<br>";
            html += newParameterVersionSetzen(0.2) + newParameterOff;
//<-- $$070FE End of insert
            html += checkboxy('settings_change_header_layout', "Change header layout") + show_help("Change the header layout to save some vertical space.") + "<br/>";
            html += newParameterOn1;
            html += " &nbsp; " + checkboxy('settings_show_smaller_gc_link', 'Show smaller geocaching link top left') + show_help("With this option you can choose a smaller display of the geocaching link top left of every page. <br><br>This option requires \"Change header layout\".") + "<br/>";
            html += " &nbsp; " + checkboxy('settings_show_smaller_area_top_right', 'Show smaller user, settings, message area top right') + show_help("With this option you can choose a smaller display of the area top right with the user, settings and message center icons and description of every page. <br><br>This option requires \"Change header layout\".") + "<br/>";
            html += " &nbsp; " + checkboxy('settings_gc_tour_is_working', 'Reserve a place for GC Tour icon') + show_help("If the script GC Tour is running, you can reserve a place top left of every page for the GC Tour icon. <br><br>This option requires \"Change header layout\".") + "<br/>";
            html += newParameterVersionSetzen(0.1) + newParameterOff;
			html += checkboxy('settings_bookmarks_on_top', "Show <a class='gclh_ref' href='#gclh_linklist' id='gclh_linklist_link_1'>Linklist</a> on top") + show_help("Show the Linklist on the top of the page - beside the other links of gc.com. You can configure the links at the end of this configuration page.<br><br>Some of the features of the linklist on top, like for example the font size or the distance between drop-down links, requires \"Change header layout\". Details you can see at the end of this configuration page by the features of the Linklist.") + "<br/>";
            html += checkboxy('settings_hide_advert_link', 'Hide link to advertisement instructions') + "<br/>";
            html += "&nbsp;" + "Page-Width: <input class='gclh_form' type='text' size='2' id='settings_new_width' value='" + getValue("settings_new_width", 950) + "'> px" + show_help("With this option you can expand the small layout. The default value of gc.com is 950 px.") + "<br>";
            html += checkboxy('settings_automatic_friend_reset', 'Reset difference counter on friendlist automatically') + show_help("If you enable this option, the difference counter at friendlist will automatically reset if you have seen the difference and if the day changed.") + "<br/>";
            html += checkboxy('settings_hide_facebook', 'Hide Facebook login') + "<br/>";
            html += checkboxy('settings_hide_socialshare', 'Hide social sharing Facebook and Twitter') + "<br/>";
            html += checkboxy('settings_fixed_pq_header', 'Show fixed header in PQ list') + "<br/>";
            html += newParameterOn1;
            html += checkboxy('settings_show_sums_in_bookmark_lists', 'Show number of caches in bookmark lists') + show_help("With this option the number of caches and the number of selected caches in the categories \"All\", \"Found\", \"Archived\" and \"Deactivated\", corresponding to the select buttons, are shown in bookmark lists at the end of the list.") + "<br/>";
            html += checkboxy('settings_hide_warning_message', 'Hide warning message') + show_help("With this option you can choose the possibility to hide a potential warning message of the masters of gc.com. <br><br>One example is the down time warning message which comes from time to time and is placed unnecessarily a lot of days at the top of pages. You can hide it except for a small line in the top right side of the pages. You can activate the warning message again if your mouse goes to this area. <br><br>If the warning message is deleted of the masters, this small area is deleted too.") + "<br/>";
            html += newParameterVersionSetzen(0.1) + newParameterOff;
            html += "<br>";
            html += newParameterOn1;
            html += "&nbsp;" + "Show lines in";
            html += "<span style='margin-left: 40px;' >lists</span>" + show_help("Lists are all common lists but not the TB listing and not the cache listing.");
            html += "<span style='margin-left: 30px;' >cache listings</span>";
            html += "<span style='margin-left: 32px;' >TB listings</span>";
            html += "<span style='margin-left: 30px;' >in color</span>" + "<br>";
            html += "&nbsp;" + "- for zebra:";
            html += "<span style='margin-left: 14px;' ></span>" + show_help("With this options you can color every second line in the specified lists in the specified \"alternating\" color.");
            html += "<input type='checkbox' style='margin-left:  23px;' " + (getValue('settings_show_common_lists_in_zebra') ? "checked='checked'" : "" ) + " id='settings_show_common_lists_in_zebra'></span>";
            html += "<input type='checkbox' style='margin-left:  56px;' " + (getValue('settings_show_cache_listings_in_zebra') ? "checked='checked'" : "" ) + " id='settings_show_cache_listings_in_zebra'></span>" + show_help("This option requires \"Load logs with GClh\".");
            html += "<input type='checkbox' style='margin-left:  95px;' " + (getValue('settings_show_tb_listings_in_zebra') ? "checked='checked'" : "" ) + " id='settings_show_tb_listings_in_zebra'></span>";
            html += "<input class='gclh_form color' type='text' style='margin-left: 86px;' size=5 id='settings_lines_color_zebra' value='" + getValue("settings_lines_color_zebra", "EBECED") + "'>";
            html += "<img src=" + global_restore_icon + " id='restore_settings_lines_color_zebra' title='back to default' style='width: 12px; cursor: pointer;'>" + "<br>";
            html += "&nbsp;" + "- for you:";
            html += "<span style='margin-left: 27px;' ></span>" + show_help("With this options you can color your logs respectively your founds in the specified lists in the specified color.");
            html += "<input type='checkbox' style='margin-left:  23px;' " + (getValue('settings_show_common_lists_color_user') ? "checked='checked'" : "" ) + " id='settings_show_common_lists_color_user'></span>";
            html += "<input type='checkbox' style='margin-left:  56px;' " + (getValue('settings_show_cache_listings_color_user') ? "checked='checked'" : "" ) + " id='settings_show_cache_listings_color_user'></span>" + show_help("This option requires \"Load logs with GClh\".");
            html += "<input type='checkbox' style='margin-left:  95px;' " + (getValue('settings_show_tb_listings_color_user') ? "checked='checked'" : "" ) + " id='settings_show_tb_listings_color_user'></span>";
            html += "<input class='gclh_form color' type='text' style='margin-left: 86px;' size=5 id='settings_lines_color_user' value='" + getValue("settings_lines_color_user", "C2E0C3") + "'>";
            html += "<img src=" + global_restore_icon + " id='restore_settings_lines_color_user' title='back to default' style='width: 12px; cursor: pointer;'>" + "<br>";
            html += "&nbsp;" + "- for owners:";
            html += "<input type='checkbox' style='margin-left: 111px;' " + (getValue('settings_show_cache_listings_color_owner') ? "checked='checked'" : "" ) + " id='settings_show_cache_listings_color_owner'></span>" + show_help("This option requires \"Load logs with GClh\".");
            html += "<input type='checkbox' style='margin-left:  95px;' " + (getValue('settings_show_tb_listings_color_owner') ? "checked='checked'" : "" ) + " id='settings_show_tb_listings_color_owner'></span>";
            html += "<input class='gclh_form color' type='text' style='margin-left: 86px;' size=5 id='settings_lines_color_owner' value='" + getValue("settings_lines_color_owner", "E0E0C3") + "'>";
            html += "<img src=" + global_restore_icon + " id='restore_settings_lines_color_owner' title='back to default' style='width: 12px; cursor: pointer;'>" + "<br>";
            html += "&nbsp;" + "- for reviewers:";
            html += "<input type='checkbox' style='margin-left:  96px;' " + (getValue('settings_show_cache_listings_color_reviewer') ? "checked='checked'" : "" ) + " id='settings_show_cache_listings_color_reviewer'></span>" + show_help("This option requires \"Load logs with GClh\".");
            html += "<input type='checkbox' style='margin-left:  95px;' " + (getValue('settings_show_tb_listings_color_reviewer') ? "checked='checked'" : "" ) + " id='settings_show_tb_listings_color_reviewer'></span>";
            html += "<input class='gclh_form color' type='text' style='margin-left: 86px;' size=5 id='settings_lines_color_reviewer' value='" + getValue("settings_lines_color_reviewer", "EAD0C3") + "'>";
            html += "<img src=" + global_restore_icon + " id='restore_settings_lines_color_reviewer' title='back to default' style='width: 12px; cursor: pointer;'>" + "<br>";
            html += "&nbsp;" + "- for VIPs:";
            html += "<input type='checkbox' style='margin-left: 131px;' " + (getValue('settings_show_cache_listings_color_vip') ? "checked='checked'" : "" ) + " id='settings_show_cache_listings_color_vip'></span>" + show_help("This option requires \"Load logs with GClh\" and \"Show VIP list\".");
            html += "<input type='checkbox' style='margin-left:  95px;' " + (getValue('settings_show_tb_listings_color_vip') ? "checked='checked'" : "" ) + " id='settings_show_tb_listings_color_vip'></span>" + show_help("This option requires \"Show VIP list\".");
            html += "<input class='gclh_form color' type='text' style='margin-left: 72px;' size=5 id='settings_lines_color_vip' value='" + getValue("settings_lines_color_vip", "F0F0A0") + "'>";
            html += "<img src=" + global_restore_icon + " id='restore_settings_lines_color_vip' title='back to default' style='width: 12px; cursor: pointer;'>" + "<br>";
            html += newParameterVersionSetzen(0.1) + newParameterOff;
            html += "";
            html += "<br>";
            html += "";
            html += "<h4 class='gclh_headline2' title='this page'>GClh Config / Sync</h4>";
            html += newParameterOn1;
            html += checkboxy('settings_f4_call_gclh_config', 'Call GClh Config on F4') + show_help("With this option you are able to call the GClh Config page (this page) by pressing F4.") + "<br/>";
            html += checkboxy('settings_f2_save_gclh_config', 'Save GClh Config on F2') + show_help("With this option you are able to save the GClh Config page (this page) by pressing F2 instead of scrolling to the bottom and choose the save button.") + "<br/>";
            html += newParameterVersionSetzen(0.1) + newParameterOff;
            html += checkboxy('settings_sync_autoImport', 'Auto apply DB Sync') + show_help("If you enable this option, settings from dropbox will be applied automatically about GClh Sync every 10 hours.") + "<br/>";
            html += newParameterOn1;
            html += checkboxy('settings_show_save_message', 'Show info message if GClh data are saved') + show_help("With this option an info message is displayed if the GClh Config data are saved respectively if the GClh Sync data are imported.") + "<br/>";
            // Sort Linklist
            html += checkboxy('settings_sort_default_bookmarks', 'Sort default links for the Linklist') + show_help("With this option you can sort the default links for the Linklist by description. Your selection, sort or not, will done first by the next new start of the GClh Config. You can configure these default links to use in your Linklist at the end of this configuration page.") + "<br/>";
            html += newParameterVersionSetzen(0.1) + newParameterOff;
//--> $$#30FE Begin of insert
            html += newParameterOn2;
            html += checkboxy('settings_hide_colored_versions', 'Hide colored illustration of versions') + show_help("With this option the colored illustration of the versions and the version numbers in GClh Config are selectable. A change at this option evolute its effect only after a save.") + "<br/>";
            html += newParameterVersionSetzen(0.2) + newParameterOff;
//<-- $$#30FE End of insert
            html += "";
            html += "<br>";
            html += "";
            html += "<h4 class='gclh_headline2'>Nearest list</h4>";
            html += checkboxy('settings_redirect_to_map', 'Redirect to map') + show_help("If you enable this option, you will be automatically redirected from nearest list to map.") + "<br/>";
            html += checkboxy('settings_show_log_it', 'Show GClh \"Log it\" icon (too for basic members for PMO)') + show_help("The GClh \"Log it\" icon is displayed beside cache titles in nearest lists. If you click it, you will be redirected directly to the log form. <br><br>You can use it too as basic member to log Premium Member Only (PMO) caches.") + "<br/>";
            html += checkboxy('settings_show_nearestuser_profil_link', 'Show profile link on search for created / found by caches') + show_help("This option adds an link to the user profile when searching for caches created or found by a certain user") + "<br/>";
            html += "<br>";
            html += "";
            html += "<h4 class='gclh_headline2'>Maps</h4>";
            html += checkboxy('settings_show_homezone', 'Show Homezone') + "<br>";
            html += "&nbsp; " + "- Radius: <input class='gclh_form' type='text' size='1' id='settings_homezone_radius' value='" + settings_homezone_radius + "' style='margin-left: 5px;'> km" + show_help("This option draws a circle of X kilometers around your home coordinates on the map.") + "<br>";
            html += "&nbsp; " + "- Color: <input class='gclh_form color' type='text' size='5' id='settings_homezone_color' value='" + settings_homezone_color + "' style='margin-left: 15px'>" + show_help("Here you can change the color of your Homezone circle.") + "<br>";
            html += "&nbsp; " + "- Opacity: <input class='gclh_form' type='text' size='1' id='settings_homezone_opacity' value='" + settings_homezone_opacity + "'> %" + show_help("Here you can change the opacity of your Homezone circle.") + "<br>";
            //Multi-Homezone
            html += "<div class='multi_homezone_settings' style='width: 60%;'><b>Multi Homezone</b>"
            var multi_hz_el = "<div class='multi_homezone_element'>"
            multi_hz_el += "- Coords: <input class='gclh_form coords' type='text' size='21' value='" + DectoDeg(getValue("home_lat"), getValue("home_lng")) + " 'style='margin-left: 1px;'>" + "<br>";
            multi_hz_el += "- Radius: <input class='gclh_form radius' type='text' size='1' value='1' style='margin-left: 5px;'> km" + show_help("This option draws a circle of X kilometers around your home coordinates on the map.") + "<br>";
            multi_hz_el += "- Color: <input class='gclh_form color' type='text' size='5' value='#0000FF' style='margin-left: 15px;'>" + show_help("Here you can change the color of your Homezone circle.") + "<br>";
            multi_hz_el += "- Opacity: <input class='gclh_form opacity' type='text' size='1' value='10'> %" + show_help("Here you can change the opacity of your Homezone circle.") + "<br>";
            multi_hz_el += "<button class='remove' type='button' style='cursor: pointer; border: 2px solid #778555; border-radius: 7px;'>remove</button>";
            multi_hz_el += "</div>"
            for (var i in settings_multi_homezone) {
                var hzel = settings_multi_homezone[i];
                var newHzEl = $('<div>').append($(multi_hz_el));
                newHzEl.find('.coords').attr('value', DectoDeg(hzel.lat, hzel.lng));
                newHzEl.find('.radius').attr('value', hzel.radius);
                newHzEl.find('.color').attr('value', hzel.color);
                newHzEl.find('.opacity').attr('value', hzel.opacity);
                html += newHzEl.html();
            }
            html += "<div class='wrapper'></div><button type='button' class='addentry' style='cursor: pointer; border: 2px solid #778555; border-radius: 7px;'>create further Homezone</button></div>"
            html += "<div style='margin-top: 9px; margin-left: 5px'><b>Hide Map Elements</b></div>";
            html += checkboxy('settings_map_hide_sidebar', 'Hide sidebar by default') + show_help("If you want to hide the sidebar on the map, just select this option.") + "<br/>";
            html += checkboxy('settings_hide_map_header', 'Hide header by default') + show_help("If you want to hide the header of the map, just select this option.") + "<br/>";
            html += checkboxy('settings_map_hide_found', 'Hide found caches by default') + show_help("This is a premium feature - it enables automatically the option to hide your found caches on map.") + "<br/>";
            html += checkboxy('settings_map_hide_hidden', 'Hide own caches by default') + show_help("This is a premium feature - it enables automatically the option to hide your caches on map.") + "<br/>";
            html += "&nbsp;" + "Hide cache types by default: " + show_help("This is a premium feature - it enables automatically the option to hide the specific cache type.") + "<br/>";
//--> $$002CF Begin of changes
            var imgStyle = "style='padding-top: 4px; vertical-align: bottom;'"; 
            html += " &nbsp; " + checkboxy('settings_map_hide_2', "<img "+imgStyle+"src='" + http + "://www.geocaching.com/map/images/mapicons/2.png' title='Traditional'>") + "<br/>";
            html += " &nbsp; " + checkboxy('settings_map_hide_3', "<img "+imgStyle+"src='" + http + "://www.geocaching.com/map/images/mapicons/3.png' title='Multi-Cache'>") + "<br/>";
            html += " &nbsp; " + checkboxy('settings_map_hide_6', "<img "+imgStyle+"src='" + http + "://www.geocaching.com/map/images/mapicons/6.png' title='Event'>") + " &nbsp; " + checkboxy('settings_map_hide_13', "<img "+imgStyle+"src='" + http + "://www.geocaching.com/map/images/mapicons/13.png' title='Cache In Trash Out'>") + " &nbsp; " + checkboxy('settings_map_hide_453', "<img "+imgStyle+"src='" + http + "://www.geocaching.com/map/images/mapicons/453.png' title='Mega-Event'>") + " &nbsp; " + checkboxy('settings_map_hide_7005', "<img "+imgStyle+"src='" + http + "://www.geocaching.com/map/images/mapicons/7005.png' title='Giga-Event'>") + "<br/>";
            html += " &nbsp; " + checkboxy('settings_map_hide_137', "<img "+imgStyle+"src='" + http + "://www.geocaching.com/map/images/mapicons/137.png' title='EarthCache'>") + " &nbsp; " + checkboxy('settings_map_hide_4', "<img "+imgStyle+"src='" + http + "://www.geocaching.com/map/images/mapicons/4.png' title='Virtual'>") + " &nbsp; " + checkboxy('settings_map_hide_11', "<img "+imgStyle+"src='" + http + "://www.geocaching.com/map/images/mapicons/11.png' title='Webcam'>") + "<br/>";
            html += " &nbsp; " + checkboxy('settings_map_hide_8', "<img "+imgStyle+"src='" + http + "://www.geocaching.com/map/images/mapicons/8.png' title='Mystery'>") + " &nbsp; " + checkboxy('settings_map_hide_5', "<img "+imgStyle+"src='" + http + "://www.geocaching.com/map/images/mapicons/5.png' title='Letterbox'>") + " &nbsp; " + checkboxy('settings_map_hide_1858', "<img "+imgStyle+"src='" + http + "://www.geocaching.com/map/images/mapicons/1858.png' title='Wherigo'>") + "<br/>";
//<-- $$002CF End of changes
//--> $$004CF Begin of change
            html += "<div style='margin-top: 9px; margin-left: 5px'><b>Layers in map</b>" + show_help("Here you can select the map layers which should be added into the layer menu with the map. With this option you can reduce the long list to the layers you really need. If the right list of layers is empty, all will be displayed. If you use other scripts like \"Geocaching Map Enhancements\" GClh will overwrite its layercontrol. With this option you can disable GClh layers to use the layers from gc.com or GME.") + "</div>";				
            html += checkboxy('settings_use_gclh_layercontrol', 'Replace layercontrol by GClh') + show_help("If you use other scripts like \"Geocaching Map Enhancements\" GClh will overwrite its layercontrol. With this option you can disable GClh layers to use the layers from gc.com or GME.") + "<br/>";
            
            html += "<div id='MapLayersConfiguration' style='display: "+(settings_use_gclh_layercontrol?"block":"none")+";'>";
            html += "<table cellspacing='0' cellpadding='0' border='0'><tbody>";
            html += "<tr>";
            html += "<td><select class='gclh_form' style='width: 250px;' id='settings_maplayers_unavailable' multiple='single' size='7'></select></td>";
            html += "<td><input style='padding-left: 2px; padding-right: 2px; cursor: pointer;' class='gclh_form' type='button' value='>' id='btn_map_layer_right'><br><br><input style='padding-left: 2px; padding-right: 2px; cursor: pointer;' class='gclh_form' type='button' value='<' id='btn_map_layer_left'></td>";
            html += "<td><select class='gclh_form' style='width: 250px;' id='settings_maplayers_available' multiple='single' size='7'></select></td>";
            html += "</tr>";
//--> $$070FE Begin of change
//            html += "<tr><td colspan='3'>Default layer: <code><span id='settings_mapdefault_layer'>"+settings_map_default_layer +"</span></code>";
            html += "<tr><td colspan='3'>Default layer: <code><span id='settings_mapdefault_layer'>" + (settings_map_default_layer ? settings_map_default_layer:"<i>not available</i>") +"</span></code>";
//<-- $$070FE End of change
            html += "&nbsp;" + show_help("Here you can select the map source you want to use as default in the map. Select a layer from the right list 'Shown layers' and push the button 'Set Default Layer'.");
            html += "<span style='float: right; margin-top: 0px;' ><input style='padding-left: 2px; padding-right: 2px; cursor: pointer;' class='gclh_form' type='button' value='Set Default Layer' id='btn_set_default_layer'></span><br/><span style='margin-left: -4px'></span>";
            html += checkboxy('settings_show_hillshadow', 'Show Hillshadow by default') + show_help("If you want 3D-like-Shadow to be displayed by default, activate this function. Option \"Replace layercontrol by GClh\" must be enabled.") + "<br/>";
            html += "</td></tr>";
            html += "</tbody></table></div>";
//<-- $004CF End of change            
            html += "<div style='margin-top: 9px; margin-left: 5px'><b>Google Maps page</b></div>";
            html += newParameterOn1;
            html += checkboxy('settings_hide_left_sidebar_on_google_maps', 'Hide left sidebar on Google Maps by default') + show_help("With this option you can blended the left sidebar on the Google Maps page out.") + "<br/>";
            html += checkboxy('settings_add_link_gc_map_on_google_maps', 'Add link to GC Map on Google Maps') + show_help("With this option an icon are placed on the Google Maps page to link to the same area in GC Map.") + "<br/>";
            html += " &nbsp; " + checkboxy('settings_switch_to_gc_map_in_same_tab', 'Switch to GC Map in same browser tab') + show_help("With this option you can switch from Google Maps to GC Map in the same browser tab.<br><br>This option requires \"Add link to GC Map on Google Maps\".") + "<br/>";
            html += checkboxy('settings_add_link_google_maps_on_gc_map', 'Add link to Google Maps on GC Map') + show_help("With this option an icon are placed on the GC Map page to link to the same area in Google Maps.") + "<br/>";
            html += " &nbsp; " + checkboxy('settings_switch_to_google_maps_in_same_tab', 'Switch to Google Maps in same browser tab') + show_help("With this option you can switch from GC Map to Google Maps in the same browser tab.<br><br>This option requires \"Add link to Google Maps on GC Map\".") + "<br/>";
            html += newParameterVersionSetzen(0.1) + newParameterOff;
            html += "";
            html += "<br>";
            html += "";
            html += "<h4 class='gclh_headline2'>Profile / Statistic <a style='margin-left: 0px'>" + show_help("This section include your profile pages (\/my\/ and \/profile\/ pages) with for example your founded caches and trackables, your earned souvenirs, your image gallery, your statistic ... <br><br>Also the section include the profile pages of the others.") + "</a></h4>";
            html += checkboxy('settings_bookmarks_show', "Show <a class='gclh_ref' href='#gclh_linklist' id='gclh_linklist_link_2'>Linklist</a> in your profile") + show_help("Show the Linklist at the right side in your profile. You can configure the links in the Linklist at the end of this page.") + "<br/>";
            html += checkboxy('settings_hide_visits_in_profile', 'Hide TB/Coin visits in your profile') + "<br/>";
            html += checkboxy('settings_show_thumbnails', 'Show thumbnails of images') + show_help("With this option the images are displayed as thumbnails to have a preview. If you hover over a thumbnail, you can see the big one.<br><br>This works in cache and TB logs, in the cache and TB image galleries and in the profile image galleries. <br><br><u>Best practice in image galleries:</u> Let the thumbnails as much as possible at the top or at the bottom of your screen. It should be better to hover with your mouse from the right side of your screen to the left side as inverse.") + "&nbsp; Max size of big image: <input class='gclh_form' size=2 type='text' id='settings_hover_image_max_size' value='" + settings_hover_image_max_size + "'> px <br/>";
            html += "&nbsp; " + checkboxy('settings_imgcaption_on_top', 'Show caption on top') + show_help("This option requires \"Show thumbnails of images\".") + "<br/>";
            html += checkboxy('settings_show_big_gallery', 'Show bigger images in gallery') + show_help("With this option the images in the galleries of caches, TBs and profiles are displayed bigger and not in 4 columns, but in 2 columns.") + "<br/>";
            html += newParameterOn1;
            content_settings_show_mail_in_allmyvips = checkboxy('settings_show_mail_in_allmyvips', 'Show mail link beside user in "All my VIPs" list in your profile') + show_help("With this option there will be an small mail icon beside every username in the list with all your VIPs (All my VIPs) on your profile page. With this icon you get directly to the mail page to mail to this user. <br><br>This option requires \"Show mail link beside usernames\" and \"Show VIP list\".") + "<br>";
            html += content_settings_show_mail_in_allmyvips;
            html += checkboxy('settings_show_sums_in_watchlist', 'Show number of caches in your watchlist') + show_help("With this option the number of caches and the number of selected caches in the categories \"All\", \"Archived\" and \"Deactivated\", corresponding to the select buttons, are shown in your watchlist at the end of the list.") + "<br/>";
            html += checkboxy('settings_count_own_matrix', 'Calculate your cache matrix') + show_help("With this option the count of found difficulty and terrain combinations and the count of complete matrixes are calculated and shown above the cache matrix on your statistic page.") + "<br/>";
            html += checkboxy('settings_count_foreign_matrix', 'Calculate other users cache matrix') + show_help("With this option the count of found difficulty and terrain combinations and the count of complete matrixes are calculated and shown above the cache matrix on other users statistic page.") + "<br/>";
            html += checkboxy('settings_count_own_matrix_show_next', 'Mark D/T combinations for your next possible cache matrix') + show_help("With this option the necessary difficulty and terrain combinations to reach the next possible complete matrixes are marked in your cache matrix on your statistic page.") + "<br/>";
            html += " &nbsp; &nbsp;" + "Highlight next <select class='gclh_form' id='settings_count_own_matrix_show_count_next' >";
            for ( var i = 1; i < 5; i++ ) { 
                html += "  <option value='" + i + "' " + (settings_count_own_matrix_show_count_next == i ? "selected=\"selected\"" : "") + ">" + i + "</option>";
            }
            html += "</select> matrixes in color <input class='gclh_form color' type='text' size=5 id='settings_count_own_matrix_show_color_next' style='margin-left: 0px;' value='" + getValue("settings_count_own_matrix_show_color_next", "5151FB") + "'>";
            html += "<img src=" + global_restore_icon + " id='restore_settings_count_own_matrix_show_color_next' title='back to default' style='width: 12px; cursor: pointer;'>" + show_help("With this option you can choose the count and the color of highlighted next possible complete matrixes in your cache matrix on your statistic page.<br><br>This option requires \"Mark D/T combinations for your next possible cache matrix\".") + "<br>";
            html += " &nbsp; &nbsp;" + "Generate cache search links with radius <select class='gclh_form' id='settings_count_own_matrix_links_radius' >";
            for ( var i = 0; i < 201; i++ ) { 
                html += "  <option value='" + i + "' " + (settings_count_own_matrix_links_radius == i ? "selected=\"selected\"" : "") + ">" + i + "</option>";
            }
            html += "</select> km" + show_help("With this option cache search links with the inserted radius in km are generated for the highlighted difficulty and terrain combinations. With a radius of 0 km there are no links generated. The default radius is 25 km.<br><br>This option requires \"Mark D/T combinations for your next possible cache matrix\".") + "<br>";
            html += " &nbsp; &nbsp;" + "Show the searched caches in a <select class='gclh_form' id='settings_count_own_matrix_links'>";
            html += "  <option value='map' " + (settings_count_own_matrix_links == "map" ? "selected=\"selected\"" : "") + ">map</option>";
            html += "  <option value='list' " + (settings_count_own_matrix_links == "list" ? "selected=\"selected\"" : "") + ">list</option>";
            html += "</select>" + show_help("With this option the searched caches are shown in a map or in a list.<br><br>This option requires \"Mark D/T combinations for your next possible cache matrix\".") + "<br>";
            html += checkboxy('settings_logit_for_basic_in_pmo', 'Log PMO caches by standard \"Log It\" icon (for basic members)') + show_help("With this option basic members are able to choose the standard \"Log It\" icon to call the logging screen for premium only caches. The tool tipp blocked not longer this call. You can have the same result by using the right mouse across the \"Log It\" icon and then new tab. <br>The \"Log It\" icon is besides the caches for example in the \"Recently Viewed Caches\" list and in your profile.") + "<br/>";
            html += newParameterVersionSetzen(0.1) + newParameterOff;
            html += "";
            html += "<br>";
            html += "";
            html += "<h4 class='gclh_headline2'>Listing</h4>";
            html += checkboxy('settings_log_inline', 'Log cache from listing (inline)') + show_help("With the inline log you can open a log form inside the listing, without loading a new page.") + "<br/>"; 
            content_settings_log_inline_tb = "&nbsp; " + checkboxy('settings_log_inline_tb', 'Show TB list') + show_help("With this option you can select, if the TB list should be shown in inline logs.<br><br>This option requires \"Log cache from listing (inline)\" or \"Log cache from listing for PMO (for basic members)\".") + "<br>";
            html += content_settings_log_inline_tb;
            html += checkboxy('settings_log_inline_pmo4basic', 'Log cache from listing for PMO (for basic members)') + show_help("With this option you can select, if inline logs should appear for Premium-Member-Only caches althought you are a basic member (logging of PMO caches by basic members is allowed by Groundspeak).") + "<br/>";
            html += content_settings_log_inline_tb.replace("settings_log_inline_tb", "settings_log_inline_tbX0");  
            html += checkboxy('settings_hide_empty_cache_notes', 'Hide cache notes if empty') + show_help("This is a premium feature - you can hide the personal cache notes if they are empty. There will be a link to show them to add a note.") + "<br/>";
            html += checkboxy('settings_hide_cache_notes', 'Hide cache notes completely') + show_help("This is a premium feature - you can hide the personal cache notes completely, if you don't want to use them.") + "<br/>";
            html += checkboxy('settings_hide_disclaimer', 'Hide disclaimer') + "<br/>";
            html += checkboxy('settings_hide_spoilerwarning', 'Hide spoiler warning') + "<br/>";
            html += checkboxy('settings_hide_top_button', 'Hide green top button') + show_help("Hides the green \"To Top\" button, which appears if you are reading logs.") + "<br/>";
            html += checkboxy('settings_show_all_logs', 'Show at least ') + " <input class='gclh_form' type='text' size='2' id='settings_show_all_logs_count' value='" + settings_show_all_logs_count + "'> logs (0 = all)" + show_help("With this option you can choose how many logs should be shown at least if you load the listing - if you type 0, all logs are shown by default.") + "<br>";
            html += checkboxy('settings_hide_hint', 'Hide hints behind a link') + show_help("This option hides the hints behind a link - you have to click it to display the hints (already decrypted). This option remove also the hint description.") + "<br/>";
            html += checkboxy('settings_decrypt_hint', 'Decrypt hints') + show_help("This option decrypt the hints and remove also the hint description.") + "<br/>";
            html += checkboxy('settings_visitCount_geocheckerCom', 'Show statistic on geochecker.com sites') + show_help("This option adds '&visitCount=1' to all geochecker.com links. This will show some statistics on geochecker.com site like the count of site visits and the count of right and wrong attempts. Firefox and all browser besides Chrome will use the redirector service anonym.to !") + "<br/>";
            html += checkboxy('settings_show_eventday', 'Show weekday of an event') + show_help("With this option the day of the week will be displayed next to the date.") + " Date format: <select class='gclh_form' id='settings_date_format'>";
            html += "  <option " + (settings_date_format == "yyyy-MM-dd" ? "selected='selected'" : "") + " value='yyyy-MM-dd'> 2012-01-21</option>";
            html += "  <option " + (settings_date_format == "yyyy/MM/dd" ? "selected='selected'" : "") + " value='yyyy/MM/dd'> 2012/01/21</option>";
            html += "  <option " + (settings_date_format == "MM/dd/yyyy" ? "selected='selected'" : "") + " value='MM/dd/yyyy'> 01/21/2012</option>";
            html += "  <option " + (settings_date_format == "dd/MM/yyyy" ? "selected='selected'" : "") + " value='dd/MM/yyyy'> 21/01/2012</option>";
            html += "  <option " + (settings_date_format == "dd/MMM/yyyy" ? "selected='selected'" : "") + " value='dd/MMM/yyyy'> 21/Jan/2012</option>";
            html += "  <option " + (settings_date_format == "MMM/dd/yyyy" ? "selected='selected'" : "") + " value='MMM/dd/yyyy'> Jan/21/2012</option>";
            html += "  <option " + (settings_date_format == "dd MMM yy" ? "selected='selected'" : "") + " value='dd MMM yy'> 21 Jan 12</option>";
            html += "</select>" + show_help("If you have changed the date format on gc.com, you have to change it here to. Instead the day of week may be wrong.") + "<br/>";
            html += checkboxy('settings_show_mail', 'Show mail link beside usernames') + show_help("With this option there will be an small mail icon beside every username. With this icon you get directly to the mail page to mail to this user. If you click it when you are in a listing, the cachename and GCID will be inserted into the mail form - you don't have to remember it :) ") + "<br/>";
            html += "&nbsp; " + checkboxy('settings_show_mail_coordslink', 'Show coord link in mail') + show_help("With this option the GC/TB code in the mail is displayed as coord.info link. <br><br>This option requires \"Show mail link beside usernames\".") + "<br/>";
            html += newParameterOn1;
            content_settings_show_mail_in_viplist = "&nbsp; " + checkboxy('settings_show_mail_in_viplist', 'Show mail link beside user in "VIP-List" in listing') + show_help("With this option there will be an small mail icon beside every username in the VIP lists on the cache listing page. With this icon you get directly to the mail page to mail to this user. <br><br>This option requires \"Show mail link beside usernames\", \"Show VIP list\" and \"Load logs with GClh\".") + "<br>";
            html += content_settings_show_mail_in_viplist;
            html += "&nbsp; " + content_settings_show_mail_in_allmyvips.replace("settings_show_mail_in_allmyvips", "settings_show_mail_in_allmyvipsX0"); 
            html += checkboxy('settings_show_message', 'Show message link beside usernames') + show_help("With this option there will be an small message icon beside every username. With this icon you get directly to the message page to send a message to this user. If you click it when you are in a listing, the cachename and GC code respectively the TB name and the TB code will be inserted into the message form.") + "<br/>";
            html += "&nbsp; " + checkboxy('settings_show_message_coordslink', 'Show coord link in message') + show_help("With this option the GC/TB code in the message is displayed as coord.info link. <br><br>This option requires \"Show message link beside usernames\".") + "<br/>";
            html += newParameterVersionSetzen(0.1) + newParameterOff;
            html += checkboxy('settings_show_google_maps', 'Show link to Google Maps') + show_help("This option shows a link at the top of the second map in the listing. With this link you get directly to Google Maps in the area, where the cache is.") + "<br/>";
            html += checkboxy('settings_strike_archived', 'Strike through title of archived/disabled caches') + "<br/>";
//--> $$#14FE Begin of change
            html += newParameterOn2;
            html += "&nbsp;" + "Highlight user changed coords with " + checkboxy('settings_highlight_usercoords', 'red textcolor ') + checkboxy('settings_highlight_usercoords_bb', 'underline ') + checkboxy('settings_highlight_usercoords_it', 'italic') + "<br/>";
            html += newParameterVersionSetzen(0.2) + newParameterOff;
//<-- $$#14FE End of change
            html += checkboxy('settings_show_fav_percentage', 'Show percentage of favourite points') + show_help("This option loads the favourite stats of a cache in the backround and display the percentage under the amount of favourites a cache got.") + "<br/>";
//--> $$067FE Begin of insert
            html += newParameterOn2;
            html += checkboxy('settings_show_latest_logs_symbols', 'Show the ');
            html += "<select class='gclh_form' id='settings_show_latest_logs_symbols_count'>";
            for ( var i = 1; i < 11; i++ ){
                html += "  <option value='" + i + "' " + (settings_show_latest_logs_symbols_count == i ? "selected=\"selected\"" : "") + ">" + i + "</option>";
            }
            html += "</select> latest logs symbols at the top" + show_help("With this option, the choosen count of the latest logs symbols is shown at the top of the cache listing. <br><br>This option requires \"Load logs with GClh\".") + "<br>";
            html += newParameterVersionSetzen(0.2) + newParameterOff;
//<-- $$067FE End of insert
            html += newParameterOn1;
            html += checkboxy('settings_show_remove_ignoring_link', 'Show \"Stop Ignoring\", if cache is already ignored') + show_help("This option replace the \"Ignore\" link description with the \"Stop Ignoring\" link description in the cache listing, if the cache is already ignored.") + "<br/>";
            html += checkboxy('settings_map_overview_build', 'Show cache location in overview map') + show_help("With this option there will be an additional map top right in the cache listing as an overview of the cache location. This was available in the gc.com standard earlier.") + "<br/>";
            html += " &nbsp; &nbsp;" + "Map zoom value: <select class='gclh_form' id='settings_map_overview_zoom'>";
            for ( var i = 1; i < 20; i++ ){
                html += "  <option value='" + i + "' " + (settings_map_overview_zoom == i ? "selected=\"selected\"" : "") + ">" + i + "</option>";
            }
            html += "</select>" + show_help("With this option you can choose the zoom value to start in the map. \"1\" is the hole world and \"19\" is the maximal enlargement. Default is \"11\". <br><br>This option requires \"Show cache location in overview map\".") + "<br>";
            html += newParameterVersionSetzen(0.1) + newParameterOff;
            html += checkboxy('settings_show_vip_list', 'Show VIP list') + show_help("The VIP list is a list, displayed at the right side on a cache listing. You can add any user to your VIP list by clicking the little VIP icon beside the username. If it is green, this person is a VIP. The VIP list only shows VIPs and the logs of VIPs, which already posted a log to this cache. With this option you are able to see which of your VIPs already found this cache. On your profile page there is an overview of all your VIPs.") + "<br/>";
            html += "&nbsp; " + checkboxy('settings_show_owner_vip_list', 'Show owner in VIP list')  + show_help("If you enable this option, the owner is a VIP for the cache, so you can see, what happened with the cache (disable, maint, enable, ..). <br><br>This option requires \"Show VIP list\".")+ "<br/>";
            html += "&nbsp; " + checkboxy('settings_show_long_vip', 'Show long VIP list (one row per log)') + show_help("This is another type of displaying the VIP list. If you disable this option you get the short list - one row per VIP and the logs as icons beside the VIP. If you enable this option, there is a row for every log.<br><br>This option requires \"Show VIP list\".") + "<br/>";
            html += "&nbsp; " + checkboxy('settings_vip_show_nofound', 'Show a list of VIPs who have not found the cache') + show_help("This option enables an additional VIP list with VIPs who have not found the cache.<br><br>This option requires \"Show VIP list\".") + "<br>";
//--> $$064FE Begin of insert
            html += newParameterOn2;
            html += "&nbsp; " + checkboxy('settings_make_vip_lists_hideable', 'Make VIP lists in listing hideable') + show_help("With this option you can hide and show the VIP lists \"VIP-List\" and \"VIP-List not found\" in cache listing with one click.<br><br>This option requires \"Show VIP list\".") + "<br>";
            html += newParameterVersionSetzen(0.2) + newParameterOff;
//<-- $$064FE End of insert
            html += newParameterOn1;
            html += content_settings_show_mail_in_viplist.replace("settings_show_mail_in_viplist", "settings_show_mail_in_viplistX0");  
            html += "&nbsp; " + content_settings_show_mail_in_allmyvips.replace("settings_show_mail_in_allmyvips", "settings_show_mail_in_allmyvipsX1"); 
            html += newParameterVersionSetzen(0.1) + newParameterOff;
            html += checkboxy('settings_show_thumbnailsX0', 'Show thumbnails of images') + show_help("With this option the images are displayed as thumbnails to have a preview. If you hover over a thumbnail, you can see the big one. <br><br>This works in cache and TB logs, in the cache and TB image galleries and in the profile image galleries. <br><br><u>Best practice in image galleries:</u> Let the thumbnails as much as possible at the top or at the bottom of your screen. It should be better to hover with your mouse from the right side of your screen to the left side as inverse.") + "&nbsp; Max size of big image: <input class='gclh_form' size=2 type='text' id='settings_hover_image_max_sizeX0' value='" + settings_hover_image_max_size + "'> px <br/>";
            html += "&nbsp; " + checkboxy('settings_imgcaption_on_topX0', 'Show caption on top') + show_help("This option requires \"Show thumbnails of images\".") + "<br/>";
            html += checkboxy('settings_show_big_galleryX0', 'Show bigger images in gallery') + show_help("With this option the images in the galleries of caches, TBs and profiles are displayed bigger and not in 4 columns, but in 2 columns.") + "<br/>";
            html += checkboxy('settings_hide_avatar', 'Hide avatars in listing') + show_help("This option hides the avatars in logs. This prevents loading the hundreds of images. You have to change the option here, because GClh overrides the log-load-logic of gc.com, so the avatar option of gc.com doesn't work with GClh.") + "<br/>";
            html += checkboxy('settings_load_logs_with_gclh', 'Load logs with GClh') + show_help("This option should be enabled. <br><br>You just should disable it, if you have problems with loading the logs. <br><br>If this option is disabled, there are no VIP-, mail-, message- and top icons, no line colors and no mouse activated big images at the logs. Also the VIP lists, hide avatars, log filter and log search won't work.") + "<br/>";
            html += checkboxy('settings_show_real_owner', 'Show real owner name') + show_help("If the option is enabled, GClh will replace the pseudonym a owner took to publish the cache with the real owner name.") + "<br/>";
            html += "<br>";
            html += "";
            html += "<h4 class='gclh_headline2'>Logging</h4>";
            html += checkboxy('settings_submit_log_button', 'Submit log, Pocket Query or Bookmark on F2') + show_help("With this option you are able to submit your log by pressing F2 instead of scrolling to the bottom and move the mouse to the button. This feature also works to save Pocket Queries or Bookmarks.") + "<br/>";
            html += checkboxy('settings_show_bbcode', 'Show smilies') + show_help("This option displays smilies options beside the log form. If you click on a smilie, it is inserted into your log.") + "<br/>";
            html += checkboxy('settings_autovisit', 'Enable \"AutoVisit\" feature for TBs/Coins') + show_help("With this option you are able to select TBs/Coins which should be automatically set to \"visited\" on every log. You can select \"AutoVisit\" for each TB/Coin in the list on the bottom of the log form.") + "<br/>";
            html += checkboxy('settings_replace_log_by_last_log', 'Replace log by last log template') + show_help("If you enable this option, the last log template will replace the whole log. If you disable it, it will be appended to the log.") + "<br/>";
            html += checkboxy('settings_show_log_itX0', 'Show GClh \"Log it\" icon (too for basic members for PMO)') + show_help("The GClh \"Log it\" icon is displayed beside cache titles in nearest lists. If you click it, you will be redirected directly to the log form. <br><br>You can use it too as basic member to log Premium Member Only (PMO) caches.") + "<br/>";
            html += newParameterOn1;
            html += checkboxy('settings_logit_for_basic_in_pmoX0', 'Log PMO caches by standard \"Log It\" icon (for basic members)') + show_help("With this option basic members are able to choose the standard \"Log It\" icon to call the logging screen for premium only caches. The tool tipp blocked not longer this call. You can have the same result by using the right mouse across the \"Log It\" icon and then new tab. <br>The \"Log It\" icon is besides the caches for example in the \"Recently Viewed Caches\" list and in your profile.") + "<br/>";
            html += newParameterVersionSetzen(0.1) + newParameterOff;
            html += "&nbsp;" + "Log templates:" + show_help("Log templates are pre-defined texts like \"!!! I got the FTF !!!\". All your templates are shown beside the log form. You just have to click to a template and it will be placed in your log. <br><br>Also you are able to use variables: #found# will be replaced with your amount of found caches and will be added with 1 - #found_no# is the same without the +1 - #me# with your username (useful for different accounts at one computer) - #owner# with the name of the owner - #date#, #time# and #datetime# ... . The smilies option has to be enabled. <br><br>Note: You have to set a title and a text - click to the edit icon beside the template to edit the text.") + "<font class='gclh_small'> (Smilies have to be enabled - #found# will be replaced with founds+1 -</font>" + "<br>";
            html += "&nbsp;" + "<font class='gclh_small'>#found_no# with founds - #me# with you - #owner# ... - #date#, #time# and #datetime# ...)</font>" + "<br>";
            for (var i = 0; i < anzTemplates; i++) {
                html += "&nbsp;" + "<input class='gclh_form' type='text' size='15' id='settings_log_template_name[" + i + "]' value='" + getValue('settings_log_template_name[' + i + ']', '') + "'> ";
                html += "<a onClick=\"if(document.getElementById(\'settings_log_template_div[" + i + "]\').style.display == \'\') document.getElementById(\'settings_log_template_div[" + i + "]\').style.display = \'none\'; else document.getElementById(\'settings_log_template_div[" + i + "]\').style.display = \'\'; return false;\" href='#'><img src='" + http + "://www.geocaching.com/images/stockholm/16x16/page_white_edit.gif' border='0'></a><br>";
                html += "<div id='settings_log_template_div[" + i + "]' style='display: none;'>&nbsp;&nbsp;&nbsp;&nbsp;<textarea class='gclh_form' rows='6' cols='30' id='settings_log_template[" + i + "]'>&zwnj;" + getValue("settings_log_template[" + i + "]", "") + "</textarea></div>";
            }
            html += "&nbsp;" + "Default log type: &nbsp; &nbsp; &nbsp; &nbsp; <select class='gclh_form' id='settings_default_logtype' style='margin-left: 8px;'>";
            html += "  <option value=\"-1\" " + (settings_default_logtype == "-1" ? "selected=\"selected\"" : "") + ">- Select type of log -</option>";
            html += "  <option value=\"2\" " + (settings_default_logtype == "2" ? "selected=\"selected\"" : "") + ">Found it</option>";
            html += "  <option value=\"3\" " + (settings_default_logtype == "3" ? "selected=\"selected\"" : "") + ">Didn't find it</option>";
            html += "  <option value=\"4\" " + (settings_default_logtype == "4" ? "selected=\"selected\"" : "") + ">Write note</option>";
            html += "  <option value=\"7\" " + (settings_default_logtype == "7" ? "selected=\"selected\"" : "") + ">Needs archived</option>";
            html += "  <option value=\"45\" " + (settings_default_logtype == "45" ? "selected=\"selected\"" : "") + ">Needs maintenance</option>";
            html += "</select>" + show_help("If you set this option, the selected value will be selected automatically, if you open a log page.") + "<br>";

            html += "&nbsp;" + "Default event log type: <select class='gclh_form' id='settings_default_logtype_event' style='margin-left: 4px;'>";
            html += "  <option value=\"-1\" " + (settings_default_logtype_event == "-1" ? "selected=\"selected\"" : "") + ">- Select type of log -</option>";
            html += "  <option value=\"4\" " + (settings_default_logtype_event == "4" ? "selected=\"selected\"" : "") + ">Write note</option>";
            html += "  <option value=\"7\" " + (settings_default_logtype_event == "7" ? "selected=\"selected\"" : "") + ">Needs archived</option>";
            html += "  <option value=\"9\" " + (settings_default_logtype_event == "9" ? "selected=\"selected\"" : "") + ">Will attend</option>";
            html += "  <option value=\"10\" " + (settings_default_logtype_event == "10" ? "selected=\"selected\"" : "") + ">Attended</option>";
            html += "</select>" + show_help("If you set this option, the selected value will be selected automatically, if you open a log page of an event.") + "<br>";

            html += "&nbsp;" + "Default owner log type: <select class='gclh_form' id='settings_default_logtype_owner'>";
            html += "  <option value=\"-1\" " + (settings_default_logtype_owner == "-1" ? "selected=\"selected\"" : "") + ">- Select type of log -</option>";
            html += "  <option value=\"4\" " + (settings_default_logtype_owner == "4" ? "selected=\"selected\"" : "") + ">Write note</option>";
            html += "  <option value=\"5\" " + (settings_default_logtype_owner == "5" ? "selected=\"selected\"" : "") + ">Archive</option>";
            html += "  <option value=\"23\" " + (settings_default_logtype_owner == "23" ? "selected=\"selected\"" : "") + ">Enable listing</option>";
            html += "  <option value=\"18\" " + (settings_default_logtype_owner == "18" ? "selected=\"selected\"" : "") + ">Post reviewer note</option>";
            html += "</select>" + show_help("If you set this option, the selected value will be selected automatically, if you open a log page of one of your own caches.") + "<br>";

            html += "&nbsp;" + "Default TB log type: &nbsp; &nbsp; <select class='gclh_form' id='settings_default_tb_logtype' style='margin-left: 4px;'>";
            html += "  <option value=\"-1\" " + (settings_default_tb_logtype == "-1" ? "selected=\"selected\"" : "") + ">- Select type of log -</option>";
            html += "  <option value=\"13\" " + (settings_default_tb_logtype == "13" ? "selected=\"selected\"" : "") + ">Retrieve from ..</option>";
            html += "  <option value=\"19\" " + (settings_default_tb_logtype == "19" ? "selected=\"selected\"" : "") + ">Grab it from ..</option>";
            html += "  <option value=\"4\" " + (settings_default_tb_logtype == "4" ? "selected=\"selected\"" : "") + ">Write note</option>";
            html += "  <option value=\"48\" " + (settings_default_tb_logtype == "48" ? "selected=\"selected\"" : "") + ">Discovered it</option>";
            html += "</select>" + show_help("If you set this option, the selected value will be selected automatically, if you open a log page.") + "<br>";
            html += "&nbsp;" + "Cache log signature:" + show_help("The signature will automatically be inserted into your logs. <br><br>Also you are able to use variables: #found# will be replaced with your amount of found caches and will be added with 1 - #found_no# is the same without the +1 - #me# with your username (useful for different accounts at one computer) - #owner# with the name of the owner - #date#, #time# and #datetime# ... .") + " <font class='gclh_small'>(#found# will be replaced with founds+1 - #found_no# with founds - </font><br>";
            html += "&nbsp;" + "<font class='gclh_small'>#me# with you - #owner# ... - #date#, #time# and #datetime# ...)</font><br>";
            html += "&nbsp;" + "<textarea class='gclh_form' rows='8' cols='40' id='settings_log_signature'>&zwnj;" + getValue("settings_log_signature", "") + "</textarea><br>";
            html += checkboxy('settings_log_signature_on_fieldnotes', 'Add log signature on Field Notes logs') + show_help('If this option is disabled, the log signature will not be used by logs out of Field Notes - you can use it, if you already have an signature in your Field Notes.') + "<br>";
            html += "&nbsp;" + "TB log signature:" + show_help("The signature will automatically be inserted into your TB logs. <br><br>Also you are able to use variables: #found# will be replaced with your amount of found caches and will be added with 1 - #found_no# is the same without the +1 - #me# with your username (useful for different accounts at one computer) - #owner# with the name of the owner - #date#, #time# and #datetime# ... .") + " <font class='gclh_small'>(#found# will be replaced with founds+1 - #found_no# with founds - </font><br>";
            html += "&nbsp;" + "<font class='gclh_small'>#me# with you - #owner# ... - #date#, #time# and #datetime# ...)</font><br>";
            html += "&nbsp;" + "<textarea class='gclh_form' rows='8' cols='40' id='settings_tb_signature'>&zwnj;" + getValue("settings_tb_signature", "") + "</textarea><br>";
            html += "<br>";
            html += "";
            html += "<h4 class='gclh_headline2'>Mail/Message form</h4>";
            html += "&nbsp;" + "Signature: &nbsp; &nbsp; &nbsp; " + show_help("The signature will automatically be inserted into your mails and messages. #me# will be replaced with your username.") + " <font class='gclh_small'>(#me# will be replaced with your username.)</font><br>";
            html += "&nbsp;" + "<textarea class='gclh_form' rows='8' cols='40' id='settings_mail_signature'>&zwnj;" + getValue("settings_mail_signature", "") + "</textarea><br>";
            html += "<br>";
            html += "";
            html += "<h4 class='gclh_headline2'><a name='gclh_linklist'></a>Linklist / Navigation" + show_help("In this section you can configure your personal Linklist which is shown on the top of the page and/or in your profile. You can activate it on top of this configuration page respectively in the \"Profile / Statistic\" section.") + " <a class='gclh_small' href='#gclh_linklist' id='gclh_show_linklist_btn'>show</a></h4>";
            html += "<div id='gclh_settings_linklist' style='display: none;'>";
            html += "&nbsp;" + "Remove from Navigation:" + show_help("Here you can select, which of the original gc.com links should be removed to make room for your Linklist.") + "<br>";
            html += "<input type='checkbox' " + (getValue('remove_navi_learn') ? "checked='checked'" : "" ) + " id='remove_navi_learn'> Learn<br>";
            html += "<input type='checkbox' " + (getValue('remove_navi_play') ? "checked='checked'" : "" ) + " id='remove_navi_play'> Play<br>";
            html += "<input type='checkbox' " + (getValue('remove_navi_community') ? "checked='checked'" : "" ) + " id='remove_navi_community'> Community<br>";
            html += "<input type='checkbox' " + (getValue('remove_navi_shop') ? "checked='checked'" : "" ) + " id='remove_navi_shop'> Shop<br>";
            html += "<br>";
            html += "<input type='checkbox' " + (settings_bookmarks_search ? "checked='checked'" : "" ) + " id='settings_bookmarks_search'> Show searchfield - Default value: <input class='gclh_form' type='text' id='settings_bookmarks_search_default' value='" + settings_bookmarks_search_default + "' size='4'>" + show_help("If you enable this option, there will be a searchfield on the top of the page beside the links. In this field you can search for GCIDs, TBIDs, tracking numbers, coordinates, ... - also you can define a default value if you want (like GC...).<br><br>This option requires \"Show Linklist on top\".") + "<br>";

            html += "<input type='radio' " + (settings_bookmarks_top_menu ? "checked='checked'" : "" ) + " name='top_menu' id='settings_bookmarks_top_menu' style='margin-top: 9px;'> Show Linklist at menu as drop-down list" + show_help("With this option your Linklist will be shown at the navigation menu as a drop-down list beside the others.<br><br>This option requires \"Change header layout\".") + "<br>";
            html += "<div id='box_top_menu_v' style='margin-left: 21px; margin-bottom: 2px; height: 141px;' >";
            html += newParameterOn1;
            html += checkboxy('settings_menu_float_right', 'Arrange the menu right') + show_help("With this option you can arrange the navigation menu with the Linklist and the other drop-down lists in the right direction. The default is an orientation in the left direction.<br><br>This option requires \"Change header layout\" and \"Show Linklist on top\".") + "<br/>";
            html += "&nbsp;" + "Font color: <input class='gclh_form color' type='text' size=5 id='settings_font_color_menu_submenu' value='" + getValue("settings_font_color_menu_submenu", "93B516") + "'>";
            html += "<img src=" + global_restore_icon + " id='restore_settings_font_color_menu_submenu' title='back to default' style='width: 12px; cursor: pointer;'>" + show_help("With this option you can choose the font color at the navigation menu and the drop-down lists. The default font color is 93B516 (lime green).<br><br>This option requires \"Change header layout\".") + "<br>";
            html += "&nbsp;" + "Font size at menu: <select class='gclh_form' id='settings_font_size_menu' style='margin-left: 116px;'>";  
            for ( var i = 6; i < 17; i++ ) { 
                html += "  <option value='" + i + "' " + (settings_font_size_menu == i ? "selected=\"selected\"" : "") + ">" + i + "</option>";
            }
            html += "</select> px" + show_help("With this option you can choose the font size at the navigation menu in pixel. The default font size is 15 pixel.<br><br>This option requires \"Change header layout\".") + "<br>";
            html += "&nbsp;" + "Distance between menu entries: <select class='gclh_form' id='settings_distance_menu' style='margin-left: 22px;'>";  
            for ( var i = 0; i < 100; i++ ) {
                html += "  <option value='" + i + "' " + (settings_distance_menu == i ? "selected=\"selected\"" : "") + ">" + i + "</option>";
            }
            html += "</select> px" + show_help("With this option you can choose the distance between the navigation menu entries in horizontal direction in pixel. <br><br>This option requires \"Change header layout\".") + "<br>";
            html += "&nbsp;" + "Font size at drop-down lists: <select class='gclh_form' id='settings_font_size_submenu' style='margin-left: 44px;'>";  
            for ( var i = 6; i < 17; i++ ) { 
                html += "  <option value='" + i + "' " + (settings_font_size_submenu == i ? "selected=\"selected\"" : "") + ">" + i + "</option>";
            }
            html += "</select> px" + show_help("With this option you can choose the font size at the drop-down lists in pixel. The default font size is 13 pixel.<br><br>This option requires \"Change header layout\".") + "<br>";
            html += "&nbsp;" + "Distance between drop-down links: <select class='gclh_form' id='settings_distance_submenu'>";  
            for ( var i = 0; i < 33; i++ ) {
                html += "  <option value='" + i + "' " + (settings_distance_submenu == i ? "selected=\"selected\"" : "") + ">" + i + "</option>";
            }
            html += "</select> px" + show_help("With this option you can choose the distance between the drop-down links in vertical direction in pixel. <br><br>This option requires \"Change header layout\".") + "<br>";
            html += newParameterVersionSetzen(0.1) + newParameterOff;
            html += "</div>";
            
            html += "<input type='radio' " + (settings_bookmarks_top_menu ? "" : "checked='checked'" ) + " name='top_menu' id='settings_bookmarks_top_menu_h'> Show Linklist in horizontal direction" + show_help("If you enable this option, the links in your Linklist will be shown direct on the top of the page - side by side.<br><br>This option requires \"Change header layout\" and \"Show Linklist on top\".") + "<br>";
            html += "<div id='box_top_menu_h' style='margin-left: 21px; height: 138px;' >";
            html += newParameterOn1;
            html += "&nbsp;" + "Font color: <input class='gclh_form color' type='text' size=5 id='settings_font_color_menu_submenuX0' value='" + getValue("settings_font_color_menu_submenu", "93B516") + "'>";
            html += "<img src=" + global_restore_icon + " id='restore_settings_font_color_menu_submenuX0' title='back to default' style='width: 12px; cursor: pointer;'>" + show_help("With this option you can choose the font color at the links. The default font color is 93B516 (lime green).<br><br>This option requires \"Change header layout\" and \"Show Linklist on top\".") + "<br>";
            html += "&nbsp;" + "Font size at the links: <select class='gclh_form' id='settings_font_size_menuX0' style='margin-left: 43px;'>";  
            for ( var i = 6; i < 17; i++ ) { 
                html += "  <option value='" + i + "' " + (settings_font_size_menu == i ? "selected=\"selected\"" : "") + ">" + i + "</option>";
            }
            html += "</select> px" + show_help("With this option you can choose the font size at the links in pixel. The default font size is 15 pixel.<br><br>This option requires \"Change header layout\" and \"Show Linklist on top\".") + "<br>";
            html += "&nbsp;" + "Distance between the links: <select class='gclh_form' id='settings_distance_menuX0' style='margin-left: 2px;'>";  
            for ( var i = 0; i < 100; i++ ) {
                html += "  <option value='" + i + "' " + (settings_distance_menu == i ? "selected=\"selected\"" : "") + ">" + i + "</option>";
            }
            html += "</select> px" + show_help("With this option you can choose the distance between the links in horizontal direction in pixel. <br><br>This option requires \"Change header layout\" and \"Show Linklist on top\".") + "<br>";
            html += "&nbsp;" + "Number of lines for all links: <select class='gclh_form' id='settings_menu_number_of_lines'>";
            html += "  <option value=\"1\" " + (settings_menu_number_of_lines == "1" ? "selected=\"selected\"" : "") + ">1</option>";
            html += "  <option value=\"2\" " + (settings_menu_number_of_lines == "2" ? "selected=\"selected\"" : "") + ">2</option>";
            html += "  <option value=\"3\" " + (settings_menu_number_of_lines == "3" ? "selected=\"selected\"" : "") + ">3</option>";
            html += "</select>" + show_help("With this option you can choose the number of lines which are necessary to include all the links of the Linklist in the header of the page.<br><br>This option requires \"Change header layout\" and \"Show Linklist on top\".") + "<br>";
            html += "<input type='checkbox' " + (getValue('settings_menu_show_separator') ? "checked='checked'" : "" ) + " id='settings_menu_show_separator'> Show separator between the links" + show_help("This option requires \"Change header layout\" and \"Show Linklist on top\".") + "<br>";
            html += "&nbsp;" + "Font size at gc.com drop-down lists: <select class='gclh_form' id='settings_font_size_submenuX0' style='margin-left: 44px;'>";  
            for ( var i = 6; i < 17; i++ ) { 
                html += "  <option value='" + i + "' " + (settings_font_size_submenu == i ? "selected=\"selected\"" : "") + ">" + i + "</option>";
            }
            html += "</select> px" + show_help("With this option you can only choose the font size at the remaining gc.com drop-down lists in pixel. The default font size is 13 pixel.<br><br>This option requires \"Change header layout\" and \"Show Linklist on top\".") + "<br>";
            html += "&nbsp;" + "Distance between gc.com drop-down links: <select class='gclh_form' id='settings_distance_submenuX0'>";  
            for ( var i = 0; i < 33; i++ ) {
                html += "  <option value='" + i + "' " + (settings_distance_submenu == i ? "selected=\"selected\"" : "") + ">" + i + "</option>";
            }
            html += "</select> px" + show_help("With this option you can only choose the distance between the remaining gc.com drop-down links in vertical direction in pixel. <br><br>This option requires \"Change header layout\" and \"Show Linklist on top\".") + "<br>";
            html += newParameterVersionSetzen(0.1) + newParameterOff;
            html += "</div>";
            html += "<br>";

            // Linklist/Bookmarks: (BEGIN) Rechte Spalte mit den für die Linklist ausgewählten Bookmarks.
            // -------------------
            var firstCust = 0;
            for (var j = 0; j < bookmarks.length; j++) {
                if (bookmarks[j].custom) {
                    firstCust = j;
                    break;
                }
            }
            html += "<div style='float:right; width:197px;margin-left:10px;' div>";
            // Überschrift, rechte Spalte:
            html += "    <p style='margin-top:5px;margin-bottom:3px;font-family: Verdana;font-size: 14px;font-style: normal;font-weight: bold;'>Linklist" + show_help("The Linklist requires \"Show Linklist on top\" or \"Show Linklist in profile\".") + "</p>";
            html += "    <table class='gclh_form' style='width:100%; margin-top: -1px;'>";
            // Ausgewählte Bookmarks für die Linklist, rechte Spalte:
            html += "        <tbody id='gclh_LinkListTop'>";
            var order = JSON.parse(getValue("settings_bookmarks_list", "[]").replace(/, (?=,)/g, ",null"));
            // Platzhalter, falls noch keine Bookmarks für die Linklist ausgewählt wurden.
            if (order.length == 0) {
                html += "        <tr style='height: 25px;' class='gclh_LinkListPlaceHolder'>";
                html += "            <td style='padding: 0px;' >Drop here...</td>";
                html += "        </tr>";
            }
            else {
                for (var i = 0; i < order.length; i++) {
                    if (typeof(order[i]) == "undefined") continue;
                    if (typeof(order[i]) == "object") continue;
                    if (typeof(bookmarks[order[i]]) == "undefined") continue;
                    // Wenn custom Bookmark.
                    if (bookmarks[order[i]].custom) {
                        var text = (typeof(bookmarks_orig_title[order[i]]) != "undefined" && bookmarks_orig_title[order[i]] != "" ? bookmarks_orig_title[order[i]] : bookmarks[order[i]]['title']);
                        var textTitle = "Custom" + (order[i] - firstCust);
                        if ( !text.match(/(\S+)/) ) text = textTitle;
                    // Wenn default Bookmark.
                    } else {
                        var text = bookmarks[order[i]]['title'];
                        var textTitle = (typeof(bookmarks_orig_title[order[i]]) != "undefined" && bookmarks_orig_title[order[i]] != "" ? bookmarks_orig_title[order[i]] : bookmarks[order[i]]['title']);
                    }
                    var textName = textTitle;
                    html += "    <tr style='height: 25px;' class='gclh_LinkListInlist' id='gclh_LinkListTop_" + order[i] + "' name='" + textName + "' title='" + textTitle + "'>";
                    html += "        <td style='padding: 0px; vertical-align: top; text-overflow: ellipsis; max-width: 166px; overflow: hidden; white-space: nowrap;'>";
                    html += "            <img style='height: 12px; margin-right: 3px; cursor: grab;' title='' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAXCAQAAACo/wdSAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA82lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjardA/SgNBHMXx70TULloE67mAgmu15eQPi2ARYopsqkxmBw1hd4fZn3/2Bh7B43iDFIIXUVJbqARLwU/1eM2DB+rZDPujzjGUlcRsYvJZPteHGw7YAwDrmmDG4yuAqq48vynYvqEAXk/NsD/ib/ZdiAK8AEnhGwd8AKsHCQJqAfSW6yCgBOitp5MBqCegK/5RAAZ1aOPq5lb0eZqm2hT10uvrthFfNvqycnUMdbTiC+B7A+Aoi7bVmS1Lq5OzhH83y+f6K71PUYA62ey6HXcX73/+7FzAJ0sbODDOTdGSAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAEsSURBVHjapNKrS4NhFAbw376NwUAQ1rwgiIJgcrjo/gLFNIs3lrSYlgxLgphsgrgiODStCA4Ei0EM8olNEARBsAriYEkw7OK34SX4hBPO87znOee8J7asCzNe3UcTQRdddCm0+L2g36ldcSnHDqR6BVNC8x3xmmvjUUE70aAVOw8CKYetktv2QEm5Y5kMFBTwZk7JGBi2blUDRfmmxa2MGgbBACqyHts9lOU86cW9jCoJFfu+R92CdKDuN7wG/sC/BfGEgqTyD/Smp0DKgaOvz+kg7cyOeNNiRWgC77TitNBss4eaG0wK5d2CO2uujeLCRWyZpF0b4MUQno2ALVs+Yq2TyzvUF12QJefRMauykVu8kWnS0T08yKqAPTnP7XQiUrZh1ZW6k+i0nwMAV0JH/Qo6+gQAAAAASUVORK5CYII=' />";
                    html +=              text;
                    html += "        </td>";
                    html += "        <td style='padding: 0px;'>";
                    html += "            <img style='height: 20px; margin-left: 0px; vertical-align: top; cursor: pointer;' title ='' class='gclh_LinkListDelIcon' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAAEgBckRAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAADZBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDQuMi4yLWMwNjMgNTMuMzUyNjI0LCAyMDA4LzA3LzMwLTE4OjA1OjQxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOklwdGM0eG1wQ29yZT0iaHR0cDovL2lwdGMub3JnL3N0ZC9JcHRjNHhtcENvcmUvMS4wL3htbG5zLyIKICAgeG1wUmlnaHRzOldlYlN0YXRlbWVudD0iaHR0cDovL2Jsb2cuYWRkaWN0ZWR0b2NvZmZlZS5kZSIKICAgcGhvdG9zaG9wOkF1dGhvcnNQb3NpdGlvbj0iIj4KICAgPGRjOnJpZ2h0cz4KICAgIDxyZGY6QWx0PgogICAgIDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+wqkgICAgICAgICAgICYjeEE7IDIwMDkgYnkgT2xpdmVyIFR3YXJkb3dza2k8L3JkZjpsaT4KICAgIDwvcmRmOkFsdD4KICAgPC9kYzpyaWdodHM+CiAgIDxkYzpjcmVhdG9yPgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaT5PbGl2ZXIgVHdhcmRvd3NraTwvcmRmOmxpPgogICAgPC9yZGY6U2VxPgogICA8L2RjOmNyZWF0b3I+CiAgIDxkYzp0aXRsZT4KICAgIDxyZGY6QWx0PgogICAgIDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCIvPgogICAgPC9yZGY6QWx0PgogICA8L2RjOnRpdGxlPgogICA8eG1wUmlnaHRzOlVzYWdlVGVybXM+CiAgICA8cmRmOkFsdD4KICAgICA8cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiLz4KICAgIDwvcmRmOkFsdD4KICAgPC94bXBSaWdodHM6VXNhZ2VUZXJtcz4KICAgPElwdGM0eG1wQ29yZTpDcmVhdG9yQ29udGFjdEluZm8KICAgIElwdGM0eG1wQ29yZTpDaUFkckV4dGFkcj0iIgogICAgSXB0YzR4bXBDb3JlOkNpQWRyQ2l0eT0iIgogICAgSXB0YzR4bXBDb3JlOkNpQWRyUmVnaW9uPSIiCiAgICBJcHRjNHhtcENvcmU6Q2lBZHJQY29kZT0iIgogICAgSXB0YzR4bXBDb3JlOkNpQWRyQ3RyeT0iIgogICAgSXB0YzR4bXBDb3JlOkNpVGVsV29yaz0iIgogICAgSXB0YzR4bXBDb3JlOkNpRW1haWxXb3JrPSIiCiAgICBJcHRjNHhtcENvcmU6Q2lVcmxXb3JrPSIiLz4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PgiL5zQAABAwSURBVHjaYvz//z8DNsACYzz18fzPyMbK8P/XbwbpLdsZGUE6QIJcIiIM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' />";
                    html += "        </td>";
                    html += "    </tr>";
                }
            }
            html += "        </tbody>";
            html += "    </table>";
            html += "</div>";

            // Linklist/Bookmarks: Die beiden linken Spalten mit den möglichen Bookmarks und den gegebenenfalls abweichenden Bezeichnungen und Seitenbuttons.
            // -------------------
            // Bookmarks nach der Bezeichnung sortieren, falls gewünscht.                          // Sort Linklist
            sortBookmarksByDescription();                                                          // Sort Linklist
            
            html += "    <table>";
            // Überschrift.
            html += "        <thead>";
            html += "            <tr>";
            html += "                <td align='center' style='padding-left: 60px;'>" + show_help("Here you can choose the links you want to use in your Linklist. Also you are able to select a custom name for the link (like PQ for Pocket Query).<br>If there is a text field, then it is a custom link. In this text field you can type any URL you want to be added to the Linklist. The checkbox behind defines, if the link should be opened in a new window.<br><br>If you have problems to drag & drop the lower links because the Linklist area is not on the screen, then use the arrow high button on your keyboard during you hold the mouseclick.") + "</td>";
            html += "                <td>" + show_help("Here you can choose the link descriptions to your links.") + "</td>";
            html += "            </tr>";
            html += "        </thead>";
            // Zwei Spalten mit den möglichen Bookmarks und den gegebenenfalls abweichenden Bezeichnungen:
            html += "        <tbody>";

            var cust = 0;
            for (var i = 0; i < bookmarks.length; i++) {
                var num = bookmarks[i]['number'];                                                  // Sort Linklist
                html += "        <tr>";
                // Erste Spalte mit den möglichen Bookmarks:
                html += "            <td style='padding: 0px 2px 1px 2px; width: 201px; z-index: 1004;' align='left' class='gclh_LinkListElement' id='gclh_LinkListElement_" + num + "' >"; // Sort Linklist
                html += "                <img style='height:12px;margin-right:3px; cursor: grab;' title='' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAtCAQAAACKL8qfAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA82lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjardA/SgNBHMXx70TULloE67mAgmu15eQPi2ARYopsqkxmBw1hd4fZn3/2Bh7B43iDFIIXUVJbqARLwU/1eM2DB+rZDPujzjGUlcRsYvJZPteHGw7YAwDrmmDG4yuAqq48vynYvqEAXk/NsD/ib/ZdiAK8AEnhGwd8AKsHCQJqAfSW6yCgBOitp5MBqCegK/5RAAZ1aOPq5lb0eZqm2hT10uvrthFfNvqycnUMdbTiC+B7A+Aoi7bVmS1Lq5OzhH83y+f6K71PUYA62ey6HXcX73/+7FzAJ0sbODDOTdGSAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAFESURBVHja7JbBR0RRFMZ/975piFZDiogYHi0eebxVDKVFJGJ280Srp/6A/oOIaVlDpX0UbYdhaFPEWw0xGiI9ZjXE8BieWkxp0+beU7R43+auvp9zr3O+e1QIUKGKTxETZcTc0AIVQoNdbHVG5HhbHGEvnyfHO2EBiSY0JWRyNV0hoqepkwkAGQeamB2GloAhEfcqBJhlDZ9JI/uImCb9cV8Ipd7FCE2O+F+IX+iLwue5zKKxN6VNMkZMc8mKVQEp+xyrEK6oCu6x6njznIueYkYLYw/Kmmd5ar1wLULUNRDRtLSn7NEuAAPWqRBQNk6tFkmeWjniz1MLXKYMvQn9b8QmDeYsCnhgm64KIeAOx3bUWXI8OMW1fogSrxoMJ/SHXQthbiUaOBRsWwkXGrilxpsV4JENBl+tVSQw/M9GxHQAPgYA/ixGIgPoxNsAAAAASUVORK5CYII=' />";
                // Wenn custom Bookmark.
                if (typeof(bookmarks[i]['custom']) != "undefined" && bookmarks[i]['custom'] == true) {
                    html += "            <input style='padding-left: 2px; padding-right: 2px;' class='gclh_form' type='text' id='settings_custom_bookmark[" + cust + "]' value='" + bookmarks[i]['href'] + "' size='15'> ";
                    html += "            <input type='checkbox' style='margin-left: 1px;' title='Open in new window' " + (bookmarks[i]['target'] == "_blank" ? "checked='checked'" : "" ) + " id='settings_custom_bookmark_target[" + cust + "]'>";
                    cust++;
                // Wenn default Bookmark.
                } else {
                    html += "            <a class='gclh_ref' ";
                    for (attr in bookmarks[i]) {
                        if (attr != "title") {
                            html +=      attr + "='" + bookmarks[i][attr] + "' ";
                        }
                    }
                    var outTitle = (typeof(bookmarks_orig_title[num]) != "undefined" && bookmarks_orig_title[num] != "" ? bookmarks_orig_title[num] : bookmarks[i]['title']);  // Sort Linklist
                    html += "            >" + outTitle + "</a>";                                   // Sort Linklist
                    if ( num >= 49 && num <= 65 ) {
                        html +=          newParameterLL1;
                    }
//--> $$066FE Begin of insert
                    if ( num >= 66 && num <= 66 ) {
                        html +=          newParameterLL2;
                    }
//<-- $$066FE End of insert
                }
                html += "            </td>";
                // Zweite Spalte mit gegebenenfalls abweichenden Bezeichnungen:
                html += "            <td align='left' style='padding: 0px 2px 1px 2px;'>";
                html += "                <input style='padding-left: 2px; padding-right: 2px;' class='gclh_form' id='bookmarks_name[" + num + "]' type='text' size='15' value='" + getValue("settings_bookmarks_title[" + num + "]", "") + "'>"; // Sort Linklist
                if ( num >= 49 && num <= 65 ) {
                    html +=              newParameterLLVersionSetzen(0.1);
                }
//--> $$066FE Begin of insert
                if ( num >= 66 && num <= 66 ) {
                    html +=              newParameterLLVersionSetzen(0.2);
                }
//<-- $$066FE End of insert
                html += "            </td>";
                html += "        </tr>";
            }
            html += "        </tbody>";
            html += "    </table>";
            html += "</div>";

            html += "<br>";
            html += "";
            html += "<br>";
            // Beim Aufbau der GClh Config Seite die Bezeichnung des Save Buttons (save bzw. save (F2))  
            // über Function setValueInSaveButton versorgen. 
            html += "&nbsp;" + "<input style='padding-left: 2px; padding-right: 2px; cursor: pointer;' class='gclh_form' type='button' value='" + setValueInSaveButton() + "' id='btn_save'> <input style='padding-left: 2px; padding-right: 2px; cursor: pointer;' class='gclh_form' type='button' value='save&upload' id='btn_saveAndUpload'> <input class='gclh_form' type='button' value='close' id='btn_close2' style='cursor: pointer;'> <div width='400px' align='right' class='gclh_small' style='float: right;'>GC little helper by <a href='http://www.amshove.net/' target='_blank'>Torsten Amshove</a></div>";
            html += "</div>";

            // Linklist/Bookmarks: Linklist/Bookmarks und Events aufbauen. Anfangsbestand der Linklist bei den Bookmarks kennzeichnen.
            // -------------------
            // Linklist/Bookmarks aufbauen.
            div.innerHTML = html;
            document.getElementsByTagName('body')[0].appendChild(div);

//--> $$004CF Begin of change
            // Map / Layers
            // -------------------
            function layerOption( name, selected ) {
            		return "<option value='" + name + "' " + (selected ? "selected='selected'" : "") + ">" + name + "</option>";
            }
            $("#btn_map_layer_right").click(function () {
                var source = "#settings_maplayers_unavailable";
                var destination = "#settings_maplayers_available";
                $(source+" option:selected").each(function() {
                    var name = $(this).html();
                    if ( name == settings_map_default_layer ) {
                        $("#settings_mapdefault_layer").html(name);
                    }
                    $(destination).append(layerOption( name , (settings_map_default_layer == name) ));
                });
                $(source+" option:selected").remove();
            });	
            $("#btn_map_layer_left").click(function () {
                var source = "#settings_maplayers_available";
                var destination = "#settings_maplayers_unavailable";
                $(source+" option:selected").each(function() {
                    var name = $(this).html();
                    if ( name == settings_map_default_layer ) {
                        $("#settings_mapdefault_layer").html("<i>not available</i>");
//--> $$070FE Begin of insert
                        settings_map_default_layer = "";
//<-- $$070FE End of insert
                    }
                    $(destination).append(layerOption( name , false ));
                });
                $(source+" option:selected").remove();
            });
            $("#btn_set_default_layer").click(function () {
                $("#settings_maplayers_available option:selected").each(function() {
                    var name = $(this).html();
                    $("#settings_mapdefault_layer").html(name);
                    settings_map_default_layer = name;
                });
            });
            // fill layer lists
            var layerListAvailable="";
            var layerListUnAvailable="";
            for (name in all_map_layers) {
                if ( settings_map_layers.indexOf(name) != -1 ) {
                    $("#settings_maplayers_available").append(layerOption( name ,(settings_map_default_layer == name)) );
                } else {
                    $("#settings_maplayers_unavailable").append(layerOption( name , false ) );
                }
            }
//<-- $$004CF End of change

//--> $$005CF Begin of change
            $("#settings_use_gclh_layercontrol").click(function () {
                $("#MapLayersConfiguration").toggle();
            });
//<-- $$005CF End of change

            // Bookmarks.
            for (var i = 0; i < bookmarks.length; i++) {
                // Input Events in Bookmarks aufbauen, Spalte 2, abweichende Bezeichnungen.
                document.getElementById('bookmarks_name[' + i + ']').addEventListener("input", updateByInputDescription, false);
                // Anfangsbestand der Linklist bei den Bookmarks kennzeichnen.
                // Prüfen, ob Bookmark in der Linklist vorhanden ist. Cursor und Opacity entsprechend setzen.
                if ( document.getElementById('gclh_LinkListTop_' + i) ) {
                    flagBmInLl( document.getElementById('gclh_LinkListElement_' + i), false, "not-allowed", "0.4", "Already available in Linklist" );
                }
            }

            // Linklist.
            var elem = document.getElementsByClassName('gclh_LinkListInlist');
            for (var i = 0; i < elem.length; i++) {
                // Mousedown und Mouseup Events in Linklist aufbauen, rechte Spalte, Move Icon und Bezeichnung. 
                // (Delete Icon wird hier nicht berücksichtigt.)
                elem[i].children[0].children[0].addEventListener("mousedown", function(event){changeAttrMouse(event, this, "move")}, false); // Move Icon
                elem[i].children[0].addEventListener("mousedown", function(event){changeAttrMouse(event, this, "desc")}, false);             // Description
                elem[i].children[0].children[0].addEventListener("mouseup", function(event){changeAttrMouse(event, this, "move")}, false);   // Move Icon
                elem[i].children[0].addEventListener("mouseup", function(event){changeAttrMouse(event, this, "desc")}, false);               // Description
            }

            // Linklist/Bookmarks: Delete Icon in rechter Spalte.
            // -------------------
            $(".gclh_LinkListDelIcon").click(function () {
                var row = this.parentNode.parentNode;
                var tablebody = row.parentNode;
                $(row).remove();
                if (tablebody.children.length == 0) {
                    $('<tr class="gclh_LinkListPlaceHolder"><td>Drop here...</td></tr>').appendTo(tablebody);
                }
                // Entsprechende Bookmark als nicht vorhanden in der Linklist kennzeichnen.
                var index = this.parentNode.parentNode.id.replace("gclh_LinkListTop_", "");
                flagBmInLl( document.getElementById("gclh_LinkListElement_" + index), false, "grab", "1", "" );  
            });

            // Linklist/Bookmarks: Drag and Drop von linker Spalte in rechte Spalte und sortieren in rechter Spalte.
            // -------------------
            $(".gclh_LinkListElement").draggable({
                revert: "invalid",
                helper: "clone",
                start: function (event, ui) {
                    $(ui.helper).addClass("gclh_form");
                },
                stop: function (event, ui) {
                    $(ui.helper).removeClass("gclh_form");
                }
            });

            $("#gclh_LinkListTop").droppable({
                accept: function (d) {
                    if (!d.hasClass("gclh_LinkListInlist") && d.hasClass("gclh_LinkListElement")) {
                        // Wenn dragging stattfindet und nicht schon wenn click stattgefunden hat, Cursor und Opacity passend setzen.
                        if ( $('.gclh_LinkListElement.ui-draggable-dragging').length != 0 ) {
                            var index = d[0].id.replace("gclh_LinkListElement_", "");
                            if ( document.getElementById("gclh_LinkListTop_" + index) ) {
                                flagBmInLl( d[0].parentNode.children[2], true, "not-allowed", "1", "" ); 
                            } else {
                                flagBmInLl( d[0].parentNode.children[2], true, "grabbing", "1", "" );  
                                return true;
                            }
                        }
                    }
                },
                drop: function (event, ui) {
                    // Gegebenenfalls Platzhalter entfernen.
                    $(this).find(".gclh_LinkListPlaceHolder").remove();
                    // Index ermitteln.
                    var index = ui.draggable[0].id.replace("gclh_LinkListElement_", "");
                    // Wenn custom Bookmark.
                    if ( ui.draggable[0].children[1].id.match("custom") ) {
                        var textTitle = "Custom" + ui.draggable[0].children[1].id.replace("settings_custom_bookmark[", "").replace("]", "");
                    // Wenn default Bookmark.
                    } else {
                        var textTitle = ui.draggable[0].children[1].innerHTML;
                    }
                    // Abweichende Bezeichnung der Bookmark ermitteln. Falls leer, dann default Bezeichnung nehmen.
                    var text = document.getElementById("bookmarks_name["+index+"]").value;
                    if ( !text.match(/(\S+)/) ) text = textTitle;
                    var textName = textTitle;
                    // Bookmark in Linklist aufbauen.
                    var htmlRight = "";
                    htmlRight += "   <td style='padding: 0px; vertical-align: top; text-overflow: ellipsis; max-width: 166px; overflow: hidden; white-space: nowrap;'>";
                    htmlRight += "       <img style='height: 12px; margin-right: 3px; cursor: grab;' title ='' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAXCAQAAACo/wdSAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA82lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjardA/SgNBHMXx70TULloE67mAgmu15eQPi2ARYopsqkxmBw1hd4fZn3/2Bh7B43iDFIIXUVJbqARLwU/1eM2DB+rZDPujzjGUlcRsYvJZPteHGw7YAwDrmmDG4yuAqq48vynYvqEAXk/NsD/ib/ZdiAK8AEnhGwd8AKsHCQJqAfSW6yCgBOitp5MBqCegK/5RAAZ1aOPq5lb0eZqm2hT10uvrthFfNvqycnUMdbTiC+B7A+Aoi7bVmS1Lq5OzhH83y+f6K71PUYA62ey6HXcX73/+7FzAJ0sbODDOTdGSAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAEsSURBVHjapNKrS4NhFAbw376NwUAQ1rwgiIJgcrjo/gLFNIs3lrSYlgxLgphsgrgiODStCA4Ei0EM8olNEARBsAriYEkw7OK34SX4hBPO87znOee8J7asCzNe3UcTQRdddCm0+L2g36ldcSnHDqR6BVNC8x3xmmvjUUE70aAVOw8CKYetktv2QEm5Y5kMFBTwZk7JGBi2blUDRfmmxa2MGgbBACqyHts9lOU86cW9jCoJFfu+R92CdKDuN7wG/sC/BfGEgqTyD/Smp0DKgaOvz+kg7cyOeNNiRWgC77TitNBss4eaG0wK5d2CO2uujeLCRWyZpF0b4MUQno2ALVs+Yq2TyzvUF12QJefRMauykVu8kWnS0T08yKqAPTnP7XQiUrZh1ZW6k+i0nwMAV0JH/Qo6+gQAAAAASUVORK5CYII=' />"; 
                    htmlRight +=         text;
                    htmlRight += "   </td>";
                    htmlRight += "   <td style='padding: 0px;'>";
                    htmlRight += "       <img class='gclh_LinkListDelIcon' style='height: 20px; margin-left: 0px; vertical-align: top; cursor: pointer;' title ='' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAAEgBckRAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAADZBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDQuMi4yLWMwNjMgNTMuMzUyNjI0LCAyMDA4LzA3LzMwLTE4OjA1OjQxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOklwdGM0eG1wQ29yZT0iaHR0cDovL2lwdGMub3JnL3N0ZC9JcHRjNHhtcENvcmUvMS4wL3htbG5zLyIKICAgeG1wUmlnaHRzOldlYlN0YXRlbWVudD0iaHR0cDovL2Jsb2cuYWRkaWN0ZWR0b2NvZmZlZS5kZSIKICAgcGhvdG9zaG9wOkF1dGhvcnNQb3NpdGlvbj0iIj4KICAgPGRjOnJpZ2h0cz4KICAgIDxyZGY6QWx0PgogICAgIDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+wqkgICAgICAgICAgICYjeEE7IDIwMDkgYnkgT2xpdmVyIFR3YXJkb3dza2k8L3JkZjpsaT4KICAgIDwvcmRmOkFsdD4KICAgPC9kYzpyaWdodHM+CiAgIDxkYzpjcmVhdG9yPgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaT5PbGl2ZXIgVHdhcmRvd3NraTwvcmRmOmxpPgogICAgPC9yZGY6U2VxPgogICA8L2RjOmNyZWF0b3I+CiAgIDxkYzp0aXRsZT4KICAgIDxyZGY6QWx0PgogICAgIDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCIvPgogICAgPC9yZGY6QWx0PgogICA8L2RjOnRpdGxlPgogICA8eG1wUmlnaHRzOlVzYWdlVGVybXM+CiAgICA8cmRmOkFsdD4KICAgICA8cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiLz4KICAgIDwvcmRmOkFsdD4KICAgPC94bXBSaWdodHM6VXNhZ2VUZXJtcz4KICAgPElwdGM0eG1wQ29yZTpDcmVhdG9yQ29udGFjdEluZm8KICAgIElwdGM0eG1wQ29yZTpDaUFkckV4dGFkcj0iIgogICAgSXB0YzR4bXBDb3JlOkNpQWRyQ2l0eT0iIgogICAgSXB0YzR4bXBDb3JlOkNpQWRyUmVnaW9uPSIiCiAgICBJcHRjNHhtcENvcmU6Q2lBZHJQY29kZT0iIgogICAgSXB0YzR4bXBDb3JlOkNpQWRyQ3RyeT0iIgogICAgSXB0YzR4bXBDb3JlOkNpVGVsV29yaz0iIgogICAgSXB0YzR4bXBDb3JlOkNpRW1haWxXb3JrPSIiCiAgICBJcHRjNHhtcENvcmU6Q2lVcmxXb3JrPSIiLz4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PgiL5zQAABAwSURBVHjaYvz//z8DNsACYzz18fzPyMbK8P/XbwbpLdsZGUE6QIJcIiIM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' />";
                    htmlRight += "   </td>";
                    var row = $("<tr style='height: 25px;' class='gclh_LinkListInlist' id='gclh_LinkListTop_" + index + "' name='" + textName + "' title='" + textTitle + "'></tr>").html(htmlRight);
                    // Entsprechende Bookmark als vorhanden in der Linklist kennzeichnen.
                    flagBmInLl( document.getElementById("gclh_LinkListElement_" + index), false, "not-allowed", "0.4", "Already available in Linklist" );  
                    // Click Event für Delete Icon aufbauen.
                    row.find(".gclh_LinkListDelIcon").click(function () {
                        var row = this.parentNode.parentNode;
                        var tablebody = row.parentNode;
                        $(row).remove();
                        if (tablebody.children.length == 0) {
                            $('<tr class="gclh_LinkListPlaceHolder"><td>Drop here...</td></tr>').appendTo(tablebody);
                        }
                    });
                    $(row).appendTo(this);
                }
            }).sortable({
                items: "tr:not(.gclh_LinkListPlaceHolder)"
            });
            // Linklist/Bookmarks: (END)
            // -------------------

            //Colorpicker
            if (typeof opera == "object" || typeof(chrome) != "undefined") {
                $('.gclh_form.color:not(.withPicker)').each(function (i, e) {
                    var homezonepic = new jscolor.color(e, {
                        required: true,
                        adjust: true,
                        hash: true,
                        caps: true,
                        pickerMode: 'HSV',
                        pickerPosition: 'right'
                    });
                    $(e).addClass("withPicker");
                });
            }
            else {
                var code = GM_getResourceText("jscolor");
                code += 'new jscolor.init();'
                var script = document.createElement("script");
                script.innerHTML = code;
                document.getElementsByTagName("body")[0].appendChild(script);
            }

            //Multi-Homezone
            function gclh_init_multi_homecoord_remove_listener($el) {
                $el.find('.remove').click(function () {
                    $(this).closest('.multi_homezone_element').remove()
                });
            }

            //initialize remove listener for present elements
            gclh_init_multi_homecoord_remove_listener($('.multi_homezone_settings'));
            //initialize add listener for multi homecoord entries
            $('.multi_homezone_settings .addentry').click(function () {
                var $newEl = $(multi_hz_el);
                $('.multi_homezone_settings .wrapper').append($newEl);
                //initialize remove listener for new element
                gclh_init_multi_homecoord_remove_listener($newEl);
                //reinit jscolor
                if (typeof opera == "object" || typeof(chrome) != "undefined") {
                    $('.gclh_form.color:not(.withPicker)').each(function (i, e) {
                        var homezonepic = new jscolor.color(e, {
                            required: true,
                            adjust: true,
                            hash: true,
                            caps: true,
                            pickerMode: 'HSV',
                            pickerPosition: 'right'
                        });
                        $(e).addClass("withPicker");
                    });
                }
                else {
                    var script = document.createElement("script");
                    script.innerHTML = 'new jscolor.init();';
                    document.getElementsByTagName("body")[0].appendChild(script);
                }
            });

            function gclh_show_linklist() {
                var linklist = document.getElementById('gclh_settings_linklist');
                var lnk = document.getElementById('gclh_show_linklist_btn');
                // Die Links zur Linklist hin sollen sie auch anzeigen, also nicht einklappen.
                if ( this.id == 'gclh_linklist_link_1' || this.id == 'gclh_linklist_link_2' ) {
                    if ( linklist.style.display == '' ) return;
                }
                if (linklist.style.display == 'none') {
                    linklist.style.display = '';
                    lnk.innerHTML = "hide";
                } else {
                    linklist.style.display = 'none';
                    lnk.innerHTML = "show";
                }
            }

            document.getElementById('gclh_show_linklist_btn').addEventListener("click", gclh_show_linklist, false);
            document.getElementById('gclh_linklist_link_1').addEventListener("click", gclh_show_linklist, false);
            document.getElementById('gclh_linklist_link_2').addEventListener("click", gclh_show_linklist, false);

            // Give the buttons an function
            document.getElementById('btn_close2').addEventListener("click", btnClose, false);
            document.getElementById('btn_save').addEventListener("click", function () {
                btnSave("normal");
            }, false);
            document.getElementById('btn_saveAndUpload').addEventListener("click", function () {
                btnSave("upload");
            }, false);
            document.getElementById('settings_bookmarks_on_top').addEventListener("click", handleRadioTopMenu, false);
            document.getElementById('settings_bookmarks_top_menu').addEventListener("click", handleRadioTopMenu, false);
            document.getElementById('settings_bookmarks_top_menu_h').addEventListener("click", handleRadioTopMenu, false);
            handleRadioTopMenu( true );
            
            document.getElementById('settings_load_logs_with_gclh').addEventListener("click", alert_settings_load_logs_with_gclh, false);
            document.getElementById('restore_settings_lines_color_zebra').addEventListener("click", restoreField, false);
            document.getElementById('restore_settings_lines_color_user').addEventListener("click", restoreField, false);
            document.getElementById('restore_settings_lines_color_owner').addEventListener("click", restoreField, false);
            document.getElementById('restore_settings_lines_color_reviewer').addEventListener("click", restoreField, false);
            document.getElementById('restore_settings_lines_color_vip').addEventListener("click", restoreField, false);
            document.getElementById('restore_settings_font_color_menu_submenu').addEventListener("click", restoreField, false);
            document.getElementById('restore_settings_font_color_menu_submenuX0').addEventListener("click", restoreField, false);
            document.getElementById('restore_settings_count_own_matrix_show_color_next').addEventListener("click", restoreField, false);
            
            // Events setzen für Parameter, die im GClh Config mehrfach ausgegeben wurden, weil sie zu mehreren Themen gehören. Es handelt sich hier 
            // um den Parameter selbst. In der Function werden die Events für den Parameter selbst (beispielsweise "settings_show_mail_in_viplist") und dessen 
            // "Clone" gesetzt, die hinten mit einem "X" und eine Nummerierung von 0 bis 9 enden können (beispielsweise "settings_show_mail_in_viplistX0").
            setEventsForDoubleParameters( "settings_show_mail_in_viplist", "click" );
            setEventsForDoubleParameters( "settings_show_mail_in_allmyvips", "click" );
            setEventsForDoubleParameters( "settings_log_inline_tb", "click" );
            setEventsForDoubleParameters( "settings_font_color_menu_submenu", "input" );
            setEventsForDoubleParameters( "settings_font_color_menu_submenu", "change" );
            setEventsForDoubleParameters( "settings_font_size_menu", "input" );
            setEventsForDoubleParameters( "settings_distance_menu", "input" );
            setEventsForDoubleParameters( "settings_font_size_submenu", "input" );
            setEventsForDoubleParameters( "settings_distance_submenu", "input" );
            setEventsForDoubleParameters( "settings_show_log_it", "click" );
            setEventsForDoubleParameters( "settings_logit_for_basic_in_pmo", "click" );
            setEventsForDoubleParameters( "settings_show_thumbnails", "click" );
            setEventsForDoubleParameters( "settings_hover_image_max_size", "input" );
            setEventsForDoubleParameters( "settings_imgcaption_on_top", "click" );
            setEventsForDoubleParameters( "settings_show_big_gallery", "click" );

            // Events setzen für Parameter, die im GClh Config eine Abhängigkeit derart auslösen, dass andere Parameter aktiviert bzw. deaktiviert 
            // werden müssen. Beispielsweise können Mail Icons in der VIP List (Parameter "settings_show_mail_in_viplist") nur dann aufgebaut werden,
            // wenn Mail Icons überhaupt erzeugt werden sollen (Parameter "settings_show_mail"). 
            // Die angedachten "Clone" (siehe oben) müssen hier auch berücksichtigt werden.
            setEventsForDependentParameters( "settings_change_header_layout", "settings_show_smaller_gc_link" );
            setEventsForDependentParameters( "settings_change_header_layout", "settings_show_smaller_area_top_right" );
            setEventsForDependentParameters( "settings_change_header_layout", "settings_gc_tour_is_working" );
            setEventsForDependentParameters( "settings_change_header_layout", "settings_font_color_menu_submenu" );
            setEventsForDependentParameters( "settings_change_header_layout", "restore_settings_font_color_menu_submenu" );
            setEventsForDependentParameters( "settings_change_header_layout", "settings_bookmarks_top_menu" );
            setEventsForDependentParameters( "settings_change_header_layout", "settings_bookmarks_top_menu_h" );
            setEventsForDependentParameters( "settings_change_header_layout", "settings_menu_float_right" );
            setEventsForDependentParameters( "settings_change_header_layout", "settings_font_size_menu" );
            setEventsForDependentParameters( "settings_change_header_layout", "settings_distance_menu" );
            setEventsForDependentParameters( "settings_change_header_layout", "settings_font_size_submenu" );
            setEventsForDependentParameters( "settings_change_header_layout", "settings_distance_submenu" );
            setEventsForDependentParameters( "settings_change_header_layout", "settings_menu_number_of_lines" );
            setEventsForDependentParameters( "settings_change_header_layout", "settings_menu_show_separator" );
            setEventsForDependentParameters( "settings_bookmarks_on_top", "settings_bookmarks_top_menu_h" );
            setEventsForDependentParameters( "settings_bookmarks_on_top", "settings_bookmarks_search" );
            setEventsForDependentParameters( "settings_bookmarks_on_top", "settings_bookmarks_search_default" );
            setEventsForDependentParameters( "settings_bookmarks_on_top", "settings_menu_float_right" );
            setEventsForDependentParameters( "settings_bookmarks_on_top", "settings_menu_number_of_lines" );
            setEventsForDependentParameters( "settings_bookmarks_on_top", "settings_menu_show_separator" );
            setEventsForDependentParameters( "settings_load_logs_with_gclh", "settings_show_mail_in_viplist" );
            setEventsForDependentParameters( "settings_load_logs_with_gclh", "settings_show_cache_listings_in_zebra" );
            setEventsForDependentParameters( "settings_load_logs_with_gclh", "settings_show_cache_listings_color_user" );
            setEventsForDependentParameters( "settings_load_logs_with_gclh", "settings_show_cache_listings_color_owner" );
            setEventsForDependentParameters( "settings_load_logs_with_gclh", "settings_show_cache_listings_color_reviewer" );
            setEventsForDependentParameters( "settings_load_logs_with_gclh", "settings_show_cache_listings_color_vip" );
            setEventsForDependentParameters( "settings_show_vip_list", "settings_show_cache_listings_color_vip" );
            setEventsForDependentParameters( "settings_show_vip_list", "settings_show_tb_listings_color_vip" );
            setEventsForDependentParameters( "settings_show_vip_list", "settings_show_owner_vip_list" );
            setEventsForDependentParameters( "settings_show_vip_list", "settings_show_long_vip" );
            setEventsForDependentParameters( "settings_show_vip_list", "settings_vip_show_nofound" );
            setEventsForDependentParameters( "settings_show_vip_list", "settings_show_mail_in_viplist" );
            setEventsForDependentParameters( "settings_show_vip_list", "settings_show_mail_in_allmyvips" );
//--> $$064FE Begin of insert
            setEventsForDependentParameters( "settings_show_vip_list", "settings_make_vip_lists_hideable" );
//<-- $$064FE End of insert
            setEventsForDependentParameters( "settings_log_inline", "settings_log_inline_tb", false );
            setEventsForDependentParameters( "settings_log_inline_pmo4basic", "settings_log_inline_tb", false );
            setEventsForDependentParameters( "settings_show_mail", "settings_show_mail_coordslink" );
            setEventsForDependentParameters( "settings_show_mail", "settings_show_mail_in_viplist" );
            setEventsForDependentParameters( "settings_show_mail", "settings_show_mail_in_allmyvips" );
            setEventsForDependentParameters( "settings_show_message", "settings_show_message_coordslink" );
            setEventsForDependentParameters( "settings_show_thumbnails", "settings_hover_image_max_size" );
            setEventsForDependentParameters( "settings_show_thumbnails", "settings_imgcaption_on_top" );
            setEventsForDependentParameters( "settings_show_thumbnailsX0", "settings_hover_image_max_size" );
            setEventsForDependentParameters( "settings_show_thumbnailsX0", "settings_imgcaption_on_top" );
            setEventsForDependentParameters( "settings_map_overview_build", "settings_map_overview_zoom" );
            setEventsForDependentParameters( "settings_count_own_matrix_show_next", "settings_count_own_matrix_show_count_next" );
            setEventsForDependentParameters( "settings_count_own_matrix_show_next", "settings_count_own_matrix_show_color_next" );
            setEventsForDependentParameters( "settings_count_own_matrix_show_next", "restore_settings_count_own_matrix_show_color_next" );
            setEventsForDependentParameters( "settings_count_own_matrix_show_next", "settings_count_own_matrix_links_radius" );
            setEventsForDependentParameters( "settings_count_own_matrix_show_next", "settings_count_own_matrix_links" );
            setEventsForDependentParameters( "settings_add_link_gc_map_on_google_maps", "settings_switch_to_gc_map_in_same_tab" );
            setEventsForDependentParameters( "settings_add_link_google_maps_on_gc_map", "settings_switch_to_google_maps_in_same_tab" );
//--> $$067FE Begin of insert
            setEventsForDependentParameters( "settings_show_latest_logs_symbols", "settings_show_latest_logs_symbols_count" );
            setEventsForDependentParameters( "settings_load_logs_with_gclh", "settings_show_latest_logs_symbols" );
            setEventsForDependentParameters( "settings_load_logs_with_gclh", "settings_show_latest_logs_symbols_count" );
//<-- $$067FE End of insert
            // Abhängigkeiten der Linklist Parameter.            
            for (var i = 0; i < 100; i++) {
                // 2. Spalte: Links für die Custom Bookmarks.
                if ( document.getElementById("gclh_LinkListElement_" + i)) {
                    setEventsForDependentParameters( "settings_bookmarks_on_top", "gclh_LinkListElement_" + i, false );
                    setEventsForDependentParameters( "settings_bookmarks_show", "gclh_LinkListElement_" + i, false );
                }
                if ( document.getElementById("settings_custom_bookmark[" + i + "]")) {
                    setEventsForDependentParameters( "settings_bookmarks_on_top", "settings_custom_bookmark[" + i + "]", false );
                    setEventsForDependentParameters( "settings_bookmarks_show", "settings_custom_bookmark[" + i + "]", false );
                }
                // 3. Spalte: Target für die Links für die Custom Bookmarks.
                if ( document.getElementById("settings_custom_bookmark_target[" + i + "]")) {
                    setEventsForDependentParameters( "settings_bookmarks_on_top", "settings_custom_bookmark_target[" + i + "]", false );
                    setEventsForDependentParameters( "settings_bookmarks_show", "settings_custom_bookmark_target[" + i + "]", false );
                }
                // 4. Spalte: Bezeichnungen.
                if ( document.getElementById("bookmarks_name[" + i + "]")) {
                    setEventsForDependentParameters( "settings_bookmarks_on_top", "bookmarks_name[" + i + "]", false );
                    setEventsForDependentParameters( "settings_bookmarks_show", "bookmarks_name[" + i + "]", false );
                } else {
                    break;
                }
            }
            // 5. Spalte: Linklist.
            setEventsForDependentParameters( "settings_bookmarks_on_top", "gclh_LinkListTop", false );
            setEventsForDependentParameters( "settings_bookmarks_show", "gclh_LinkListTop", false );
            
            // Anfangsbesetzung herstellen bei den Abhängigkeiten.
            setStartForDependentParameters();

            // Die Checkbox settings_f2_save_gclh, die regelt, ob ein Save aus der GClh Config Seite per 
            // F2 Taste durchgeführt werden darf, mit Event versehen, um beim Anwählen der Checkbox die 
            // Bezeichnung im Save Button dynamisch anzupassen.
            document.getElementById('settings_f2_save_gclh_config').addEventListener("click", setValueInSaveButton, false);
            
            // Positionierung innerhalb des GClh Config bei Aufrufen.
            if (document.location.href.match(/#a#/i)) {
                document.location.href = document.location.href.replace(/#a#/i, "#");
                var diff = 4; 
                if (document.location.href.match(/#llb#/i)) {
                    if ( document.getElementById('settings_bookmarks_top_menu').checked ) diff += 141 - 6;
                    else diff += 165 - 25;
                }
                if (document.location.href.match(/#(ll|llb)#/i)) {
                    document.location.href = document.location.href.replace(/#(ll|llb)#/i, "#");
                    gclh_show_linklist();
                }
                if ( document.location.href.match(/#(\S+)/) ) {
                    var arg = document.location.href.match(/#(.*)/);
                    if ( arg ) {
                        document.location.href = clearUrlAppendix( document.location.href, false );
                        $('html,body').animate( { scrollTop: ($('#'+arg[1]).offset().top) - diff } , 1500 , "swing" );
                    }
                }
            }
        }

        // Fokusierung auf Verarbeitung, damit Menüs einklappen. 
        document.getElementById("settings_overlay").click();

        // Bei Taste F2 ein Save im GClh Config durchführen wie per "save" Button:
        // - Add Event dafür, wenn man sich im GClh Config befindet.
        if ( check_config_page() ) {
            window.addEventListener('keydown', keydown, true);
        }
        // - Event handling dafür.
        //   Das hinzugefügte Event wird nicht unbedingt ausgeführt, deshalb muss sichergestellt werden, dass man sich bei einem F2 immer noch im 
        //   GClh Config befindet, sonst würde hierfür ein Save durchgeführt, obwohl die F2 Taste irgendwo anders betätigt wurde!  
        function keydown(e) {
            if ( check_config_page() ) {
                if ( document.getElementById("settings_f2_save_gclh_config").checked ) {
                    if (e.keyCode == 113) {
                        document.getElementById("btn_save").click();
                    }
                }
            }
        }

        // Save Button
        function btnSave(type) {
            // Scrolle zum Anfang der Seite und blende GClh Config aus.
            window.scroll(0, 0);
            $("#settings_overlay").fadeOut(400);    
            document.location.href = clearUrlAppendix( document.location.href, false );
            if ( document.getElementById("settings_show_save_message").checked ) {
                showSaveForm();
            }
            var settings = {};

            function setValue(key, value) {
                settings[key] = value;
            }

            var value = document.getElementById("settings_home_lat_lng").value;
            var latlng = toDec(value);
            if (latlng) {
                if (getValue("home_lat", 0) != parseInt(latlng[0] * 10000000)) setValue("home_lat", parseInt(latlng[0] * 10000000)); // * 10000000 because GM don't know float
                if (getValue("home_lng", 0) != parseInt(latlng[1] * 10000000)) setValue("home_lng", parseInt(latlng[1] * 10000000));
            }
            setValue("settings_bookmarks_search_default", document.getElementById('settings_bookmarks_search_default').value);
            setValue("settings_show_all_logs_count", document.getElementById('settings_show_all_logs_count').value);
            //Homezone
            setValue("settings_homezone_radius", document.getElementById('settings_homezone_radius').value);
            setValue("settings_homezone_color", document.getElementById('settings_homezone_color').value);
            if (document.getElementById('settings_homezone_opacity').value <= 100 && document.getElementById('settings_homezone_opacity').value >= 0) setValue("settings_homezone_opacity", document.getElementById('settings_homezone_opacity').value);
            //Multi-Homezone

            var settings_multi_homezone = {};
            var $hzelements = $('.multi_homezone_element');
            for (var i = 0; i < $hzelements.length; i++) {
                var $curEl = $hzelements.eq(i);
                settings_multi_homezone[i] = {};
                var latlng = toDec($curEl.find('.coords:eq(0)').val());
                settings_multi_homezone[i].lat = parseInt(latlng[0] * 10000000);// * 10000000 because GM don't know float
                settings_multi_homezone[i].lng = parseInt(latlng[1] * 10000000);
                settings_multi_homezone[i].radius = $curEl.find('.radius:eq(0)').val();
                settings_multi_homezone[i].color = $curEl.find('.color:eq(0)').val();
                settings_multi_homezone[i].opacity = $curEl.find('.opacity:eq(0)').val();
            }
            setValue("settings_multi_homezone", JSON.stringify(settings_multi_homezone));

            setValue("settings_new_width", document.getElementById('settings_new_width').value);
            setValue("settings_date_format", document.getElementById('settings_date_format').value);
            setValue("settings_default_logtype", document.getElementById('settings_default_logtype').value);
            setValue("settings_default_logtype_event", document.getElementById('settings_default_logtype_event').value);
            setValue("settings_default_logtype_owner", document.getElementById('settings_default_logtype_owner').value);
            setValue("settings_default_tb_logtype", document.getElementById('settings_default_tb_logtype').value);
            setValue("settings_mail_signature", document.getElementById('settings_mail_signature').value.replace(/‌/g, "")); // Fix: Entfernt das Steuerzeichen
            setValue("settings_log_signature", document.getElementById('settings_log_signature').value.replace(/‌/g, ""));
            setValue("settings_tb_signature", document.getElementById('settings_tb_signature').value.replace(/‌/g, ""));
            setValue("settings_map_default_layer", settings_map_default_layer );
            setValue("settings_hover_image_max_size", document.getElementById('settings_hover_image_max_size').value);
            setValue("settings_font_size_menu", document.getElementById('settings_font_size_menu').value);
            setValue("settings_font_size_submenu", document.getElementById('settings_font_size_submenu').value);
            setValue("settings_distance_menu", document.getElementById('settings_distance_menu').value);
            setValue("settings_distance_submenu", document.getElementById('settings_distance_submenu').value);
            setValue("settings_font_color_menu_submenu", document.getElementById('settings_font_color_menu_submenu').value);
            setValue("settings_menu_number_of_lines", document.getElementById('settings_menu_number_of_lines').value);
            setValue("settings_lines_color_zebra", document.getElementById('settings_lines_color_zebra').value);
            setValue("settings_lines_color_user", document.getElementById('settings_lines_color_user').value);
            setValue("settings_lines_color_owner", document.getElementById('settings_lines_color_owner').value);
            setValue("settings_lines_color_reviewer", document.getElementById('settings_lines_color_reviewer').value);
            setValue("settings_lines_color_vip", document.getElementById('settings_lines_color_vip').value);
            setValue("settings_map_overview_zoom", document.getElementById('settings_map_overview_zoom').value);
            setValue("settings_count_own_matrix_show_count_next", document.getElementById('settings_count_own_matrix_show_count_next').value);
            setValue("settings_count_own_matrix_show_color_next", document.getElementById('settings_count_own_matrix_show_color_next').value);
            setValue("settings_count_own_matrix_links_radius", document.getElementById('settings_count_own_matrix_links_radius').value);
            setValue("settings_count_own_matrix_links", document.getElementById('settings_count_own_matrix_links').value);
//--> $$067FE Begin of insert
            setValue("settings_show_latest_logs_symbols_count", document.getElementById('settings_show_latest_logs_symbols_count').value);
//<-- $$067FE End of insert
//--> $$070FE Begin of insert
            setValue("settings_default_langu", document.getElementById('settings_default_langu').value);
//<-- $$070FE End of insert

            var new_map_layers = document.getElementById('settings_maplayers_available');
            var new_settings_map_layers = new Array();
            for (var i = 0; i < new_map_layers.options.length; i++) {
                new_settings_map_layers.push(new_map_layers.options[i].value);
            }
            setValue('settings_map_layers', new_settings_map_layers.join("###"));

            var checkboxes = new Array(
                'settings_submit_log_button',
                'settings_log_inline',
                'settings_log_inline_pmo4basic',
                'settings_log_inline_tb',
                'settings_bookmarks_show',
                'settings_bookmarks_on_top',
				'settings_change_header_layout',
                'settings_bookmarks_search',
                'settings_redirect_to_map',
                'settings_hide_facebook',
                'settings_hide_socialshare',
                'settings_hide_disclaimer',
                'settings_hide_cache_notes',
                'settings_hide_empty_cache_notes',
                'settings_show_all_logs',
                'settings_decrypt_hint',
                'settings_visitCount_geocheckerCom',
                'settings_show_bbcode',
                'settings_show_eventday',
                'settings_show_mail',
                'settings_show_mail_coordslink',
                'settings_gc_tour_is_working',
                'settings_show_smaller_gc_link',
                'settings_show_smaller_area_top_right',
                'settings_menu_show_separator',
                'settings_menu_float_right',
                'settings_show_message',
                'settings_show_message_coordslink',
                'settings_show_remove_ignoring_link',
                'settings_show_common_lists_in_zebra',
                'settings_show_common_lists_color_user',
                'settings_show_cache_listings_in_zebra',
                'settings_show_cache_listings_color_user',
                'settings_show_cache_listings_color_owner',
                'settings_show_cache_listings_color_reviewer',
                'settings_show_cache_listings_color_vip',
                'settings_show_tb_listings_in_zebra',
                'settings_show_tb_listings_color_user',
                'settings_show_tb_listings_color_owner',
                'settings_show_tb_listings_color_reviewer',
                'settings_show_tb_listings_color_vip',
                'settings_show_mail_in_allmyvips',
                'settings_show_mail_in_viplist',
                'settings_f2_save_gclh_config',
                'settings_f4_call_gclh_config',
                'settings_show_sums_in_bookmark_lists',
                'settings_show_sums_in_watchlist',
                'settings_hide_warning_message',
                'settings_show_save_message',
                'settings_map_overview_build',
                'settings_logit_for_basic_in_pmo',
                'settings_count_own_matrix',
                'settings_count_foreign_matrix',
                'settings_count_own_matrix_show_next',
                'settings_hide_left_sidebar_on_google_maps',
                'settings_add_link_gc_map_on_google_maps',
                'settings_switch_to_gc_map_in_same_tab',
                'settings_add_link_google_maps_on_gc_map',
                'settings_switch_to_google_maps_in_same_tab',
                'settings_sort_default_bookmarks',                                                 // Sort Linklist
//--> $$064FE Begin of insert
                'settings_make_vip_lists_hideable',
//<-- $$064FE End of insert
//--> $$067FE Begin of insert
                'settings_show_latest_logs_symbols',
//<-- $$067FE End of insert
//--> $$070FE Begin of insert
                'settings_set_default_langu',
//<-- $$070FE End of insert
//--> $$#30FE Begin of insert
                'settings_hide_colored_versions',
//<-- $$#30FE End of insert
                'settings_show_google_maps',
                'settings_show_log_it',
                'settings_show_nearestuser_profil_link',
                'settings_show_homezone',
                'settings_show_hillshadow',
                'remove_navi_learn',
                'remove_navi_partnering',
                'remove_navi_play',
                'remove_navi_profile',
                'remove_navi_community',
                'remove_navi_videos',
                'remove_navi_shop',
                'remove_navi_social',
                'settings_bookmarks_top_menu',
                'settings_hide_advert_link',
                'settings_hide_spoilerwarning',
                'settings_hide_top_button',
                'settings_hide_hint',
                'settings_strike_archived',
                'settings_highlight_usercoords',
//--> $$#14FE Begin of insert
                'settings_highlight_usercoords_bb',
                'settings_highlight_usercoords_it',
//<-- $$#14FE End of insert
                'settings_map_hide_found',
                'settings_map_hide_hidden',
                'settings_map_hide_2',
                'settings_map_hide_9',
                'settings_map_hide_5',
                'settings_map_hide_3',
                'settings_map_hide_6',
                'settings_map_hide_453',
                'settings_map_hide_7005',
                'settings_map_hide_13',
                'settings_map_hide_1304',
                'settings_map_hide_4',
                'settings_map_hide_11',
                'settings_map_hide_137',
                'settings_map_hide_8',
                'settings_map_hide_1858',
                'settings_show_fav_percentage',
                'settings_show_vip_list',
                'settings_show_owner_vip_list',
                'settings_autovisit',
                'settings_show_thumbnails',
                'settings_imgcaption_on_top',
                'settings_hide_avatar',
                'settings_show_big_gallery',
                'settings_automatic_friend_reset',
                'settings_show_long_vip',
                'settings_load_logs_with_gclh',
                'settings_hide_map_header',
                'settings_replace_log_by_last_log',
                'settings_show_real_owner',
                'settings_hide_visits_in_profile',
                'settings_log_signature_on_fieldnotes',
                'settings_vip_show_nofound',
                'settings_use_gclh_layercontrol',
                'settings_fixed_pq_header',
                'settings_sync_autoImport',
                'settings_map_hide_sidebar'
            );
            for (var i = 0; i < checkboxes.length; i++) {
                if ( document.getElementById(checkboxes[i]) ) {
                    setValue(checkboxes[i], document.getElementById(checkboxes[i]).checked);
                }
            }

            // Save Log-Templates
            for (var i = 0; i < anzTemplates; i++) {
                var name = document.getElementById('settings_log_template_name[' + i + ']');
                var text = document.getElementById('settings_log_template[' + i + ']');
                if (name && text) {
                    setValue('settings_log_template_name[' + i + ']', name.value);
                    setValue('settings_log_template[' + i + ']', text.value.replace(/‌/g, "")); // Fix: Entfernt das Steuerzeichen
                }
            }

            // Save Linklist/Bookmarks: Rechte Spalte.                                   
            // Create the settings_bookmarks_list Array (gclh_LinkListTop) 
            var queue = $("#gclh_LinkListTop tr:not(.gclh_LinkListPlaceHolder)");
            var tmp = new Array();
            for (var i = 0; i < queue.length; i++) {
                tmp[i] = queue[i].id.replace("gclh_LinkListTop_", "");
            }
            setValue("settings_bookmarks_list", JSON.stringify(tmp));

            // Save Linklist/Bookmarks: Abweichende Bezeichnungen, mittlere Spalte.      
            for (var i = 0; i < bookmarks.length; i++) {
                if (document.getElementById('bookmarks_name[' + i + ']') && document.getElementById('bookmarks_name[' + i + ']') != "") { // Set custom name
                    setValue("settings_bookmarks_title[" + i + "]", document.getElementById('bookmarks_name[' + i + ']').value);
                }
            }

            // Save Linklist/Bookmarks: Custom Links, URL und target, linke Spalte.      
            for (var i = 0; i < anzCustom; i++) {
                setValue("settings_custom_bookmark[" + i + "]", document.getElementById("settings_custom_bookmark[" + i + "]").value);
                if (document.getElementById('settings_custom_bookmark_target[' + i + ']').checked) setValue('settings_custom_bookmark_target[' + i + ']', "_blank");
                else setValue('settings_custom_bookmark_target[' + i + ']', "");
            }

            setValueSet(settings).done(function () {
                if (type === "upload") {
                    gclh_sync_DBSave().done(function () {
                        window.location.reload(false);
                    });
                }
                else {
                    window.location.reload(false);
                }
            });
            if ( getValue("settings_show_save_message") ) {
                document.getElementById("save_overlay_h3").innerHTML = "saved";
                if (type === "upload") $("#save_overlay").fadeOut(400);    
            }
        }
    }

////////////////////////////////////////////////////////////////////////////
// Functions Config (fun3)
////////////////////////////////////////////////////////////////////////////
// Radio Buttons zur Linklist verarbeiten.
    function handleRadioTopMenu( first ) {
        if ( first == true ) {
            var time = 0;
            var timeShort = 0;
        } else {
            var time = 500;
            var timeShort = 450;
        }
        // Wenn Linklist nicht on top angezeigt werden soll, dann muss unbedingt vertikales Menu aktiv sein, falls nicht vertikales Menu setzen.
        if ( !document.getElementById("settings_bookmarks_on_top").checked && !document.getElementById("settings_bookmarks_top_menu").checked ) {
            document.getElementById("settings_bookmarks_top_menu").click();
        }
        if ( document.getElementById('settings_bookmarks_top_menu').checked ) {
            if ( document.getElementById('box_top_menu_v').style.display != "block" ) {
                $("#box_top_menu_v").animate({height: "141px"}, time);
                document.getElementById('box_top_menu_v').style.display = "block";
                setTimeout(function() {
                    $("#box_top_menu_h").animate({height: "0px"}, time);
                    setTimeout(function() {
                        document.getElementById('box_top_menu_h').style.display = "none";
                    }, timeShort);  
                }, time);  
            }
        }
        if ( document.getElementById('settings_bookmarks_top_menu_h').checked ) {
            if ( document.getElementById('box_top_menu_h').style.display != "block" ) {
                $("#box_top_menu_h").animate({height: "165px"}, time);
                document.getElementById('box_top_menu_h').style.display = "block";
                setTimeout(function() {
                    $("#box_top_menu_v").animate({height: "0px"}, time);  
                    setTimeout(function() {
                        document.getElementById('box_top_menu_v').style.display = "none";
                    }, timeShort);  
                }, time);  
            }
        }   
    }

// Events setzen für Parameter, die im GClh Config mehrfach ausgegeben wurden, weil sie zu mehreren Themen gehören. Es handelt sich hier 
// um den Parameter selbst. Hier werden die Events für den Parameter selbst (beispielsweise "settings_show_mail_in_viplist") und dessen 
// "Clone" gesetzt, die hinten mit einem "X" und eine Nummerierung von 0 bis 9 enden können (beispielsweise "settings_show_mail_in_viplistX0").
    function setEventsForDoubleParameters( parameterName, event ) {
        var paId = parameterName;
        if ( document.getElementById( paId ) ) {
            document.getElementById( paId ).addEventListener(event, function () { handleEventsForDoubleParameters( this ); } , false);
            for (var i = 0; i < 10; i++) {
                var paIdX = paId + "X" + i;
                if ( document.getElementById( paIdX ) ) {
                    document.getElementById( paIdX ).addEventListener(event, function () { handleEventsForDoubleParameters( this ); } , false);
                }
            }
        }
    }

// Handling von Events zu Parametern, die im GClh Config mehrfach ausgegeben wurden, weil sie zu mehreren Themen gehören. Es kann sich hier
// um den Parameter selbst handeln (beispielsweise "settings_show_mail_in_viplist"), oder um dessen "Clone", die hinten mit einem "X" und 
// eine Nummerierung von 0 bis 9 enden können (beispielsweise "settings_show_mail_in_viplistX0"). Hier wird der Wert des eventauslösenden 
// Parameters, das kann auch ein Clon sein, an den eigentlichen Parameter und dessen Clone weitergereicht.    
    function handleEventsForDoubleParameters( parameter ) {
        var paId = parameter.id.replace(/(X[0-9]*)/, "");
        if ( document.getElementById( paId ) ) {
            if ( document.getElementById( paId ).type == "checkbox" ) {
                document.getElementById( paId ).checked = parameter.checked;
                for (var i = 0; i < 10; i++) {
                    var paIdX = paId + "X" + i;
                    if ( document.getElementById( paIdX ) ) {
                        document.getElementById( paIdX ).checked = parameter.checked;
                    }
                }
            } else if ( parameter.id.match(/_color_/) ) {
                document.getElementById( paId ).value = parameter.value;
                document.getElementById( paId ).style.backgroundColor = "#" + parameter.value;
                document.getElementById( paId ).style.color = parameter.style.color;
                for (var i = 0; i < 10; i++) {
                    var paIdX = paId + "X" + i;
                    if ( document.getElementById( paIdX ) ) {
                        document.getElementById( paIdX ).value = parameter.value;
                        document.getElementById( paIdX ).style.backgroundColor = "#" + parameter.value;
                        document.getElementById( paIdX ).style.color = parameter.style.color;
                    }
                }
            } else {
                document.getElementById( paId ).value = parameter.value;
                for (var i = 0; i < 10; i++) {
                    var paIdX = paId + "X" + i;
                    if ( document.getElementById( paIdX ) ) {
                        document.getElementById( paIdX ).value = parameter.value;
                    }
                }
            }
        }
    }

// Events setzen für Parameter, die im GClh Config eine Abhängigkeit derart auslösen, dass andere Parameter aktiviert bzw. deaktiviert 
// werden müssen. Beispielsweise können Mail Icons in der VIP List (Parameter "settings_show_mail_in_viplist") nur dann aufgebaut werden,
// wenn Mail Icons überhaupt erzeugt werden sollen (Parameter "settings_show_mail"). 
// Die angedachten "Clone" (siehe oben) müssen hier auch berücksichtigt werden.
    function setEventsForDependentParameters( parameterName, parameterNameDependent, allActivated ) {
        var paId = parameterName;
        var paIdDep = parameterNameDependent;
        var countDep = global_dependents.length;
        if ( allActivated != false ) allActivated = true;
        
        // Wenn Parameter und abhängiger Parameter existieren, dann für Parameter ein Event setzen, falls nicht schon vorhanden
        // und Parameter und abhängigen Parameter merken.
        if ( document.getElementById( paId ) && document.getElementById( paIdDep ) ) {
            var available = false;
            for (var i = 0; i < countDep; i++) {
                if ( global_dependents[i]["paId"] == paId ) {
                    available = true;
                    break;
                }
            }
            if ( available == false ) {
                document.getElementById( paId ).addEventListener("click", function () { handleEventsForDependentParameters( this ); } , false);
            }
            
            global_dependents[countDep] = new Object();
            global_dependents[countDep]["paId"] = paId;
            global_dependents[countDep]["paIdDep"] = paIdDep;
            global_dependents[countDep]["allActivated"] = allActivated;

            // Alle möglichen Clone zum abhängigen Parameter suchen.
            for (var i = 0; i < 10; i++) {
                var paIdDepX = paIdDep + "X" + i;

                // Wenn Clone zum abhängigen Parameter existiert, dann Parameter und Clone zum abhängigen Parameter merken.
                if ( document.getElementById( paIdDepX ) ) {
                    countDep++;
                    global_dependents[countDep] = new Object();
                    global_dependents[countDep]["paId"] = paId;
                    global_dependents[countDep]["paIdDep"] = paIdDepX;
                    global_dependents[countDep]["allActivated"] = allActivated;
                } else {
                    break;
                }
            }
        }
    }
// Anfangsbesetzung herstellen.    
    function setStartForDependentParameters() {
        var countDep = global_dependents.length;
        var paIdCompare = "";
        
        // Sort nach paId.
        global_dependents.sort(function(a, b){
            if(a.paId < b.paId) return -1;
            if(a.paId > b.paId) return 1;
            return 0;
        })
        var copy_global_dependents = global_dependents;

        for (var i = 0; i < countDep; i++) {
            if ( paIdCompare != copy_global_dependents[i]["paId"] ) {
                if ( document.getElementById( copy_global_dependents[i]["paId"] ) ) {     
                    var parameter = document.getElementById( copy_global_dependents[i]["paId"] );
                    handleEventsForDependentParameters( parameter );
                }
                paIdCompare = copy_global_dependents[i]["paId"];
            }
        }
    }
// Handling von Events zu Parametern, die im GClh Config eine Abhängigkeit derart auslösen, dass andere Parameter aktiviert bzw. deaktiviert 
// werden müssen. Beispielsweise können Mail Icons in der VIP List (Parameter "settings_show_mail_in_viplist") nur dann aufgebaut werden,
// wenn Mail Icons überhaupt erzeugt werden sollen (Parameter "settings_show_mail"). 
// Die angedachten "Clone" (siehe oben) müssen hier auch berücksichtigt werden.
    function handleEventsForDependentParameters( parameter ) {
        var paId = parameter.id;
        var countDep = global_dependents.length;
        var copy_global_dependents = global_dependents;

        // Wenn der Parameter existiert, dann im Array der abhängigen Parameter nachsehen, welche abhängigen Parameter es dazu gibt.
        if ( document.getElementById( paId ) ) {
            for (var i = 0; i < countDep; i++) {
                if ( global_dependents[i]["paId"] == paId ) {

                    // Wenn der abhängige Parameter existiert.
                    if ( document.getElementById( global_dependents[i]["paIdDep"] ) ) {

                        // Wenn der Parameter markiert ist, dann soll der abhängige Parameter aktiviert werden. Zuvor muß jedoch gegebenenfalls 
                        // geprüft werden, ob alle Parameter zu diesem abhängigen Parameter aktiviert werden sollen. Nur dann darf der abhängige 
                        // Parameter aktiviert werden. (Beispiel ist abhängiger Parameter "settings_show_mail_in_viplist", der von zwei 
                        // Parametern abhängig ist, nämlich "settings_show_mail" und "settings_show_vip_list".)
                        if ( parameter.checked ) {
                            if ( checkDisabledForDependentParameters( global_dependents[i]["paIdDep"] ) ) {
                                var activate = true;
                                if ( global_dependents[i]["allActivated"] ) {
                                    for (var k = 0; k < countDep; k++) {
                                        if ( copy_global_dependents[k]["paIdDep"] == global_dependents[i]["paIdDep"] &&
                                             copy_global_dependents[k]["paId"] != global_dependents[i]["paId"]          ) {
                                            if ( document.getElementById( copy_global_dependents[k]["paId"] ) &&
                                                 document.getElementById( copy_global_dependents[k]["paId"] ).checked );
                                            else {
                                                activate = false;
                                                break;
                                            }
                                        }
                                    }
                                }
                                if ( activate ) {        
                                    disableDependentParameters( global_dependents[i]["paIdDep"], false );
                                }
                            }
                        }
                        
                        // Wenn der Parameter nicht markiert ist, dann soll der abhängige Parameter deaktiviert werden. Zuvor muß jedoch gegebenenfalls 
                        // geprüft werden, ob alle Parameter zu diesem abhängigen Parameter deaktiviert werden sollen. Nur dann darf der abhängige 
                        // Parameter deaktiviert werden. (Beispiel ist abhängiger Parameter Linklistparameter, die von zwei Parametern abhängig sind, 
                        // nämlich "settings_bookmarks_on_top" und "settings_bookmarks_show".)
                        else {
                            if ( !checkDisabledForDependentParameters( global_dependents[i]["paIdDep"] ) ) {
                                var deactivate = true;
                                if ( global_dependents[i]["allActivated"] != true ) {
                                    for (var k = 0; k < countDep; k++) {
                                        if ( copy_global_dependents[k]["paIdDep"] == global_dependents[i]["paIdDep"] &&
                                             copy_global_dependents[k]["paId"] != global_dependents[i]["paId"]          ) {
                                            if ( document.getElementById( copy_global_dependents[k]["paId"] ) &&
                                                 document.getElementById( copy_global_dependents[k]["paId"] ).checked ) {
                                                deactivate = false;
                                                break;
                                            }
                                        }
                                    }
                                }
                                if ( deactivate ) {        
                                    disableDependentParameters( global_dependents[i]["paIdDep"], true );
                                }
                            }
                        }
                    }
                }                 
            }
        }
    }
// Prüfen, ob disabled.
    function checkDisabledForDependentParameters( id ) {
        var elem = document.getElementById( id );
        var elem$ = $("#"+id);
        if ( ( elem.disabled )                                                             ||
             ( elem$.hasClass("ui-droppable") && elem$.hasClass("ui-droppable-disabled") ) ||
             ( elem$.hasClass("ui-draggable") && elem$.hasClass("ui-draggable-disabled") )    ) {
            return true;
        } else {
            return false;
        }
    }
// Disabled setzen bzw. entfernen.
    function disableDependentParameters( id, set ) {
        var elem = document.getElementById( id );
        var elem$ = $("#"+id);
        if ( elem$.hasClass("ui-droppable") ) {
            elem$.droppable( "option", "disabled", set );
            elem$.sortable( "option", "disabled", set );
        } else if ( elem$.hasClass("ui-draggable") ) {
            elem$.draggable( "option", "disabled", set );
        } else {
            elem.disabled = set;
            if ( id.match(/_color_/) ) {
                if ( set == true ) elem.style.opacity = "0.5";
                else elem.style.opacity = "1";
            }
            // Alle möglichen Clone zum abhängigen Parameter suchen und ebenfalls verarbeiten.
            for (var j = 0; j < 10; j++) {
                var paIdDepX = id + "X" + j;
                if ( document.getElementById( paIdDepX ) ) {
                    document.getElementById( paIdDepX ).disabled = set;
                    if ( id.match(/_color_/) ) {
                        if ( set == true ) document.getElementById( paIdDepX ).style.opacity = "0.5";
                        else document.getElementById( paIdDepX ).style.opacity = "1";
                    }
                } else {
                    break;
                }
            }
        }
    }

// Warnung ausgeben, wenn die Logs nicht durch GClh geladen werden sollen.
    function alert_settings_load_logs_with_gclh() {
        if ( !document.getElementById("settings_load_logs_with_gclh").checked ) {
            var mess = "If this option is disabled, there are no VIP-, mail-, message- and \n"
                     + "top icons, no line colors and no mouse activated big images at the \n"
                     + "logs. Also the VIP lists, hide avatars, log filter and log search \n"
//--> $$067FE Begin of change
//                     + "won't work.";
                     + "and the latest logs won't work.";
//<-- $$067FE End of change
            alert( mess );
        }
    }

// Feldinhalt auf default zurücksetzen. 
    function restoreField() {
        if ( document.getElementById( this.id ).disabled ) return;
        var fieldId = this.id.replace(/restore_/, "");
        var field = document.getElementById( fieldId );
        if ( this.id.match(/_color/) ) {
            switch (fieldId) {
                case "settings_lines_color_zebra": field.value = "EBECED"; field.style.color = "black"; break;
                case "settings_lines_color_user": field.value = "C2E0C3"; field.style.color = "black";  break;
                case "settings_lines_color_owner": field.value = "E0E0C3"; field.style.color = "black";  break;  
                case "settings_lines_color_reviewer": field.value = "EAD0C3"; field.style.color = "black";  break;
                case "settings_lines_color_vip": field.value = "F0F0A0"; field.style.color = "black";  break;     
                case "settings_font_color_menu_submenu": 
                    field.value = "93B516"; 
                    field.style.color = "black"; 
                    if ( document.getElementById("restore_settings_font_color_menu_submenuX0") &&
                         document.getElementById("settings_font_color_menu_submenuX0").value != field.value ) {
                        document.getElementById("restore_settings_font_color_menu_submenuX0").click();
                    }
                    break;     
                case "settings_font_color_menu_submenuX0": 
                    field.value = "93B516"; 
                    field.style.color = "black"; 
                    if ( document.getElementById("restore_settings_font_color_menu_submenu") &&
                         document.getElementById("settings_font_color_menu_submenu").value != field.value ) {
                        document.getElementById("restore_settings_font_color_menu_submenu").click();
                    }
                    break;     
                case "settings_count_own_matrix_show_color_next": field.value = "5151FB"; field.style.color = "white"; break;     
            }                
            field.style.backgroundColor = "#" + field.value;
        }
    }

// Function, um die Bezeichnung des Save Buttons (save bzw. save (F2)) beim Aufbau der GClh Config Seite und 
// später dynamisch durch Checkbox Aktivitäten zu versorgen.
    function setValueInSaveButton() {
        wert = "save";
        // Nach dem Aufbau der GClh Config Seite.
        if ( document.getElementById("settings_f2_save_gclh_config") ) { 
            if ( document.getElementById("settings_f2_save_gclh_config").checked ) { 
                wert = "save (F2)"; 
            }
            document.getElementById('btn_save').setAttribute("value", wert);
            return;
        }
        // Vor dem Aufbau der GClh Config Seite.
        else {
            if ( settings_f2_save_gclh_config ) {
                wert = "save (F2)";
            }
            return wert;
        }
    }
    
// Info ausgeben, dass gespeichert wurde.
    function showSaveForm() {
        if ( document.getElementById('save_overlay') ) {
        } else {
            var html = "";
            html += "#save_overlay {background-color: #d8cd9d; width:560px; margin-left: 20px; border: 2px solid #778555; overflow: auto; padding:10px; position: absolute; left:30%; top:70px; z-index:1004; border-radius: 10px; }";
            html += ".gclh_form {background-color: #d8cd9d; border: 2px solid #778555; padding-left: 5px; padding-right: 5px; }";
            var form_side = document.getElementsByTagName('body')[0];
            var form_style = document.createElement("style");
            form_style.appendChild(document.createTextNode(html));
            form_side.appendChild(form_style);

            html = "<h3 id='save_overlay_h3'></h3>";
            var form_div = document.createElement("div");
            form_div.setAttribute("id", "save_overlay");
            form_div.setAttribute("align", "center");
            form_div.innerHTML = html;
            form_div.appendChild(document.createTextNode(""));
            form_side.appendChild(form_div);
        }
        document.getElementById("save_overlay_h3").innerHTML = "save...";       
        document.getElementById('save_overlay').style.display = "";
    }

// Änderungen an abweichenden Bezeichnungen in Spalte 2, in Value in Spalte 3 updaten.
    function updateByInputDescription() {
        // Ids ermitteln für die linke und die rechte Spalte.
        var idColLeft = this.id.replace("bookmarks_name[", "gclh_LinkListElement_").replace("]", "");
        var idColRight = this.id.replace("bookmarks_name[", "gclh_LinkListTop_").replace("]", "");
        // Bezeichnung ermitteln.
        if ( this.value.match(/(\S+)/) ) var description = this.value;
        else {
            if ( document.getElementById(idColLeft).children[1].id.match("custom") ) {
                var description = "Custom" + document.getElementById(idColLeft).children[1].id.replace("settings_custom_bookmark[", "").replace("]", "");
                this.value = description;
            } else {
                var description = document.getElementById(idColLeft).children[1].innerHTML;
            }
        }
        // Änderung an abweichender Bezeichnung in Spalte 2 in Value in Spalte 3 updaten.
        if ( document.getElementById(idColRight).children[0].childNodes[2] ) {
            document.getElementById(idColRight).children[0].childNodes[2].nodeValue = description;
        }
    }

// Attribute ändern bei Mousedown und Mouseup in rechter Spalte, Move Icon und Bezeichnung.
    function changeAttrMouse( event, elem, obj ) {
        if ( event.type == "mousedown" ) {
            elem.style.cursor = "grabbing";
        } else {
            if ( obj == "move" )      elem.style.cursor = "grab"; 
            else if ( obj == "desc" ) elem.style.cursor = "unset"; 
        }
    }

// Bookmark kennzeichnen entsprechend ob sie, oder ob sie nicht, in der Linklist vorhanden ist.
    function flagBmInLl( tdBmEntry, doDragging, setCursor, setOpacity, setTitle ) {
        if ( doDragging ) {
            tdBmEntry.style.cursor = setCursor;
            tdBmEntry.style.opacity = setOpacity;
            tdBmEntry.children[0].style.cursor = setCursor;
            tdBmEntry.children[0].style.opacity = setOpacity;
            tdBmEntry.children[1].style.cursor = setCursor;
            tdBmEntry.children[1].style.opacity = setOpacity;
        } else {                                                        
            tdBmEntry.children[0].style.cursor = setCursor;
            tdBmEntry.children[0].style.opacity = setOpacity;
            tdBmEntry.children[0].title = setTitle;
        }
    }

// Sort Linklist.
    function sortBookmarksByDescription() {
        // Bookmarks für eine Sortierung aufbereiten. Wird immer benötigt, auch wenn nicht sortiert wird.
        var cust = 0;
        for (var i = 0; i < bookmarks.length; i++) {
            bookmarks[i]['number'] = i;
            // Wenn custom Bookmark.
            if (typeof(bookmarks[i]['custom']) != "undefined" && bookmarks[i]['custom'] == true) {
                bookmarks[i]['sortTitle'] = cust;
                cust++;
            // Wenn default Bookmark.
            } else {
                bookmarks[i]['sortTitle'] = (typeof(bookmarks_orig_title[i]) != "undefined" && bookmarks_orig_title[i] != "" ? bookmarks_orig_title[i] : bookmarks[i]['title']);
                bookmarks[i]['sortTitle'] = bookmarks[i]['sortTitle'].toLowerCase().replace(/ä/g,"a").replace(/ö/g,"o").replace(/ü/g,"u").replace(/ß/g,"s");
            }
        }
        // Bookmarks nach sortTitle sortieren, falls gewünscht.
        if ( settings_sort_default_bookmarks ) {
            bookmarks.sort(function(a, b){
                if ( (typeof(a.custom) != "undefined" && a.custom == true) && !(typeof(b.custom) != "undefined" && b.custom == true) ) {
                    // Custom Bookmark a nach hinten transportieren, also  a > b.
                    return 1;  
                } else if ( !(typeof(a.custom) != "undefined" && a.custom == true) && (typeof(b.custom) != "undefined" && b.custom == true) ) {
                    // Custom Bookmark b nach hinten transportieren, also  a < b.
                    return -1;
                }
                if ( a.sortTitle < b.sortTitle ) return -1;
                if ( a.sortTitle > b.sortTitle ) return 1;
                return 0;
            })
        }
    }
    
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
// Sync
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
//--> $$061FE Begin of delete
//    if (is_page("profile") || (settings_sync_autoImport && (settings_sync_last.toString() === "Invalid Date" || (new Date() - settings_sync_last) > settings_sync_time)) ){
//<-- $$061FE End of delete 
    // Sync: get config data
    function sync_getConfigData() {
        var data = {};
        var value = null;
        for (key in CONFIG) {
            if (!gclhConfigKeysIgnoreForBackup[key]) {
                value = getValue(key, null);
                if (value != null) {
                    data[key] = value;
                }
            }
        }
        return JSON.stringify(data, undefined, 2);
    }

    // Sync: Set config data
    function sync_setConfigData(data){
        var parsedData = JSON.parse(data);
        var settings = {};
        for(key in parsedData){
            if(!gclhConfigKeysIgnoreForBackup[key]){
                settings[key] = parsedData[key];
            }
        }
        setValueSet(settings).done(function (){
        });
    }

    var gclh_sync_DB_Client = null;

    function gclh_sync_DB_CheckAndCreateClient(userToken) {
        var deferred = $.Deferred();
        if (gclh_sync_DB_Client != null && gclh_sync_DB_Client.isAuthenticated()) {
            deferred.resolve();
            return deferred.promise();
        }
        $('#syncDBLoader').show();
        setValue("dbToken", "");
        gclh_sync_DB_Client = null;
        if (document.getElementById('btn_DBSave') && document.getElementById('btn_DBLoad')) {
            document.getElementById('btn_DBSave').disabled = true;
            document.getElementById('btn_DBLoad').disabled = true;
        }

        var client = new Dropbox.Client({key: "b992jnfyidj32v3", sandbox: true, token: userToken});

        client.authDriver(new Dropbox.AuthDriver.Popup({
            rememberUser: true,
            receiverUrl: "https://www.geocaching.com/my/default.aspx"
        }));

        client.authenticate(function (error, client) {
            $('#syncDBLoader').hide();
            if (error || !client.isAuthenticated()) {
                alert("Error connecting to dropbox");
                return;
            }
            gclh_sync_DB_Client = client;
            if (document.getElementById('btn_DBSave') && document.getElementById('btn_DBLoad')) {
                document.getElementById('btn_DBSave').disabled = false;
                document.getElementById('btn_DBLoad').disabled = false;
            }

            deferred.resolve();
        });

        return deferred.promise();
    }

    function gclh_sync_DBSave() {
        var deferred = $.Deferred();
        gclh_sync_DB_CheckAndCreateClient().done(function(){
            $('#syncDBLoader').show();

            gclh_sync_DB_Client.writeFile("GCLittleHelperSettings.json", sync_getConfigData(), {}, function () {
                $('#syncDBLoader').hide();
                deferred.resolve();
            });
        }).fail(function(){deferred.reject();});
        return deferred.promise();
    }

    function gclh_sync_DBLoad() {
        var deferred = $.Deferred();
        gclh_sync_DB_CheckAndCreateClient().done(function(){
            $('#syncDBLoader').show();

            gclh_sync_DB_Client.readFile("GCLittleHelperSettings.json", {}, function (error, data) {
                if (data != null && data != "") {
                    sync_setConfigData(data);
                    $('#syncDBLoader').hide();
                    deferred.resolve();
                }
            });
        }).fail(function(){deferred.reject();});
        return deferred.promise();
    }

    function gclh_sync_DBHash() {
        var deferred = $.Deferred();

        gclh_sync_DB_CheckAndCreateClient().done(function(){
            $('#syncDBLoader').show();

            gclh_sync_DB_Client.stat("GCLittleHelperSettings.json", {}, function (error, data) {
                if (data != null && data != "") {
                    deferred.resolve(data.versionTag);
                }
            });
        }).fail(function(){deferred.reject();});;
        return deferred.promise();
    }

    // Sync: Configuration Menu
//--> $$061FE Begin of change
//    function gclh_sync_showConfig() {
    function gclh_showSync() {
//<-- $$061FE End of change
        // Alle eventuellen Verarbeitungen schließen.
        btnClose();

        // the configuration is always displayed at the top, so scroll away from logs or other lower stuff
        scroll(0, 0);

        if (document.getElementById('bg_shadow')) {
            // If shadow-box already created, just show it
            if (document.getElementById('bg_shadow').style.display == "none") {
                document.getElementById('bg_shadow').style.display = "";
            }
        } else {
            buildBgShadow();
        }

        if (document.getElementById('sync_settings_overlay') && document.getElementById('sync_settings_overlay').style.display == "none") {
            // If menu already created, just show it
            document.getElementById('sync_settings_overlay').style.display = "";
        } else {
            create_config_css();

            var div = document.createElement("div");
            div.setAttribute("id", "sync_settings_overlay");
            div.setAttribute("class", "settings_overlay");
            var html = "";
            html += "<h3 class='gclh_headline'>" + scriptNameSync + " <font class='gclh_small'>v" + scriptVersion + "</font></h3>";
            html += "<div class='gclh_content'>";
            html += "<h3 id='syncDBLabel' style='cursor: pointer;'>DropBox <font class='gclh_small'>(Click to hide/show)</font></h3>";
            html += "<div style='display:none;' id='syncDB' >";
            html += "<img style='display:none;height: 40px;' id='syncDBLoader' src='data:image/gif;base64,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'>";
            html += "<br>";
            html += "<input class='gclh_form' type='button' value='save to DropBox' id='btn_DBSave' style='cursor: pointer;' disabled> ";
            html += "<input class='gclh_form' type='button' value='load from DropBox' id='btn_DBLoad' style='cursor: pointer;' disabled>";
            html += "</div>";
            html += "<br>";
            html += "<h3 id='syncManualLabel' style='cursor: pointer;'>Manual <font class='gclh_small'>(Click to hide/show)</font></h3>";
            html += "<div style='display:none;'  id='syncManual' >";
            html += "<pre class='gclh_form' style='width: 550px; height: 300px; overflow: auto;' type='text' value='' id='configData' size='20' contenteditable='true'></pre>";
            html += "<br>";
            html += "<br>";
            html += "<input class='gclh_form' type='button' value='export' id='btn_ExportConfig' style='cursor: pointer;'> ";
            html += "<input class='gclh_form' type='button' value='import' id='btn_ImportConfig' style='cursor: pointer;'>";
            html += "</div>";
            html += "<br>";
            html += "<br>";
            html += "<input class='gclh_form' type='button' value='close' id='btn_close3' style='cursor: pointer;'>";
            html += "</div>";
            div.innerHTML = html;

            document.getElementsByTagName('body')[0].appendChild(div);
            document.getElementById('btn_close3').addEventListener("click", btnClose, false);

            document.getElementById('btn_ExportConfig').addEventListener("click", function () {
                document.getElementById('configData').innerText = sync_getConfigData();
            }, false);
            document.getElementById('btn_ImportConfig').addEventListener("click", function () {
                var data = document.getElementById('configData').innerText;
                if (data == null || data == "" || data == " ") {
                    alert("No data");
                    return;
                }
                try {
                    sync_setConfigData(data);
//--> $$061FE Begin of insert
                    // Scrolle zum Anfang der Seite und blende GClh Sync aus.
                    window.scroll(0, 0);
//<-- $$061FE End of insert
                    $("#sync_settings_overlay").fadeOut(400);    
                    if ( settings_show_save_message ) {
                        showSaveForm();
                        document.getElementById("save_overlay_h3").innerHTML = "imported";       
                    }
                    //Reload page
                    if (document.location.href.indexOf("#") == -1 || document.location.href.indexOf("#") == document.location.href.length - 1) {
                        $('html, body').animate({scrollTop: 0}, 0);
                        document.location.reload(true);
                    }
                    else {
                        document.location.replace(document.location.href.slice(0, document.location.href.indexOf("#")));
                    }
                } catch (e) {
                    alert("Invalid format");
                }
            }, false);

            document.getElementById('btn_DBSave').addEventListener("click", function () {
                gclh_sync_DBSave();
            }, false);

            document.getElementById('btn_DBLoad').addEventListener("click", function () {
                gclh_sync_DBLoad().done(function () {
                    //Reload page
                    if (document.location.href.indexOf("#") == -1 || document.location.href.indexOf("#") == document.location.href.length - 1) {
                        $('html, body').animate({scrollTop: 0}, 0);
                        document.location.reload(true);
                    }
                    else {
                        document.location.replace(document.location.href.slice(0, document.location.href.indexOf("#")));
                    }
                });
            }, false);

            $('#syncDBLabel').click(function () {
                $('#syncDB').toggle();
                gclh_sync_DB_CheckAndCreateClient();
            });
            $('#syncManualLabel').click(function () {
                $('#syncManual').toggle();
            });
        }
        // Fokusierung auf Verarbeitung, damit Menüs einklappen. 
        document.getElementById("sync_settings_overlay").click();
    } // <-- gclh_showSync

//--> $$061FE Begin of insert
    if ( (settings_sync_autoImport && (settings_sync_last.toString() === "Invalid Date" || (new Date() - settings_sync_last) > settings_sync_time)) ){
//<-- $$061FE End of insert
        if (document.URL.indexOf("#access_token") != -1) {
            $("body").hide();
            Dropbox.AuthDriver.Popup.oauthReceiver();
        }
//--> $$061FE Begin of delete (Größere Anpassungen ohne zeilenweise Änderungsdokumentation. Und nach oben verlegt.)
//        else if (is_page("profile")) {
//            if (this.GM_registerMenuCommand && !document.location.href.match(/^https?:\/\/www\.geocaching\.com\/map\//)) {
//                GM_registerMenuCommand(scriptNameSync, gclh_sync_showConfig); 
//            }
//            if ((document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/[#a-zA-Z-_]*$/) || document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/default\.aspx/)) && document.getElementById('ctl00_ContentBody_WidgetMiniProfile1_memberProfileLink')) {
//                var lnk = document.createElement("a");
//                lnk.id = "gclh_sync_lnk";
//                lnk.name = "gclh_sync_lnk";
//                lnk.href = "#";
//                lnk.innerHTML = scriptShortNameSync;
//                lnk.setAttribute("style", "font-size: 0.9em;");
//                document.getElementById('ctl00_ContentBody_WidgetMiniProfile1_memberProfileLink').parentNode.appendChild(document.createTextNode(" | "));
//                document.getElementById('ctl00_ContentBody_WidgetMiniProfile1_memberProfileLink').parentNode.appendChild(lnk);
//                addLinkEvent('gclh_sync_lnk', gclh_sync_showConfig, true, false );
//            }
//        }
//<-- $$061FE End of delete 

        if (settings_sync_autoImport && (settings_sync_last.toString() === "Invalid Date" || (new Date() - settings_sync_last) > settings_sync_time) && document.URL.indexOf("#access_token") === -1) {
            gclh_sync_DBHash().done(function (hash) {
                if (hash != settings_sync_hash) {
                    gclh_sync_DBLoad().done(function () {
                        settings_sync_last = new Date();
                        settings_sync_hash = hash;
                        setValue("settings_sync_last", settings_sync_last.toString()).done(function(){
							setValue("settings_sync_hash", settings_sync_hash).done(function(){
								if (is_page("profile")) {
									//Reload page
									if (document.location.href.indexOf("#") == -1 || document.location.href.indexOf("#") == document.location.href.length - 1) {
										$('html, body').animate({scrollTop: 0}, 0);
										document.location.reload(true);
									}
									else {
										document.location.replace(document.location.href.slice(0, document.location.href.indexOf("#")));
									}
								}
							});
						});
                    });
                }
            });
        }
    } // Sync
};

////////////////////////////////////////////////////////////////////////////
// Functions global (fun4)
////////////////////////////////////////////////////////////////////////////
// create a bookmark to a page in the geocaching.com name space
function bookmark(title, href, bookmarkArray) {
    var bm = new Object();
    bookmarkArray[bookmarkArray.length] = bm;
    bm['href'] = href;
    bm['title'] = title;
    return bm;
}

// create a bookmark to an external site
function externalBookmark(title, href, bookmarkArray) {
    var bm = bookmark(title, href, bookmarkArray);
    bm['rel'] = "external";
    bm['target'] = "_blank";
}

// create a bookmark to a profile sub site
function profileBookmark(title, id, bookmarkArray) {
    var bm = bookmark(title, "#", bookmarkArray);
    bm['id'] = id;
    bm['name'] = id;
}

// Doppelte Linkbestückung mit "href" hier direkt und mit "name" für spätere Eventzuordnung.
// Derzeitige Nutzung nur für Aufruf GClh Config: 1. für "href" Link zu Seite "My Profile" von anderer Seite, per Link GClh Config
// in Linklist heraus und 2. für Event Verarbeitung auf Seite "My Profile" per Link GClh Config in Linklist heraus.
function profileSpecialBookmark(title, href, name, bookmarkArray) {
    var bm = bookmark(title, href, bookmarkArray);
    bm['name'] = name;
}

// check if the current document location matches the given path
function isLocation(path) {
    path = path.toLowerCase();
    if (path.indexOf("http") != 0) {
        if (path.charAt(0) != '/') {
            path = "/" + path;
        }
        path = http + "://www.geocaching.com" + path;
    }
    return document.location.href.toLowerCase().indexOf(path) == 0;
}

// Logging function
function gclh_log(log) {
    var txt = "GClh_LOG - " + document.location.href + ": " + log;
    if (typeof(console) != "undefined") {
        console.info(txt);
    }
    else if (typeof(GM_log) != "undefined") {
        GM_log(txt);
    }
}

// Error-Logging function
function gclh_error(modul, err) {
    var txt = "GClh_ERROR - " + modul + " - " + document.location.href + ": " + err.message + "\nStacktrace:\n" + err.stack + (err.stacktrace ? ("\n" + err.stacktrace) : "");
    if (typeof(console) != "undefined") {
        console.error(txt);
    }
    if (typeof(GM_log) != "undefined") {
        GM_log(txt);
    }
}

function setValue(name, value) {
    var defer = $.Deferred();
    CONFIG[name] = value;
    if (browser === "chrome") {
		var data2Store = {};
		data2Store[name] = value;
        chrome.runtime.sendMessage({setGclhConfig: data2Store}, function () {
            defer.resolve();
        });
    }
    else {
        GM_setValue("CONFIG", JSON.stringify(CONFIG));
        defer.resolve();
    }

    return defer.promise();
}

function setValueSet(data) {
    var defer = $.Deferred();
	var data2Store = {};

    for (key in data) {
        CONFIG[key] = data[key];
        data2Store[key] = data[key];
    }

    if (browser === "chrome") {
        chrome.runtime.sendMessage({setGclhConfig: data2Store}, function (e) {
            defer.resolve();
        });
    }
    else {
        GM_setValue("CONFIG", JSON.stringify(CONFIG));
        defer.resolve();
    }

    return defer.promise();
}

function getValue(name, defaultValue) {
    if (CONFIG[name] === undefined) { // Zum Migrieren aus dem alten Speicherformat

        CONFIG[name] = GM_getValue(name, defaultValue);

        if (defaultValue === undefined) {
            return undefined;
        }

        setValue(name, CONFIG[name]);
    }

    return CONFIG[name];
}

// Wrapper, um zu pruefen auf welche Seite der Link zeigt - um zu vermeiden, die URL-Abfrage mehrfach im Quelltext wiederholen zu muessen
function is_link(name, url) {
    switch (name) {
        case "cache_listing":
            if (url.match(/^https?:\/\/www\.geocaching\.com\/seek\/cache_details\.aspx/) || document.location.href.match(/^https?:\/\/www\.geocaching\.com\/geocache\//)) return true;
            else return false;
            break;
        case "profile":
            if (url.match(/^http:\/\/www\.geocaching\.com\/my\/default\.aspx/) || document.location.href.match(/^http:\/\/www\.geocaching\.com\/my/) || url.match(/^https:\/\/www\.geocaching\.com\/my\/default\.aspx/) || document.location.href.match(/^https:\/\/www\.geocaching\.com\/my/)) return true;
            else return false;
            break;
        case "publicProfile":
            if (url.match(/^http:\/\/www\.geocaching\.com\/profile/) || url.match(/^https:\/\/www\.geocaching\.com\/profile/)) return true;
            else return false;
            break;
		case "map":
			if (url.match(/^http:\/\/www\.geocaching\.com\/map/) || url.match(/^https:\/\/www\.geocaching\.com\/map/)) return true;
			else return false;
			break;
		case "find_cache":
			if (url.match(/^https:\/\/www\.geocaching\.com\/play\/search/)) return true;
			else return false;
			break;
		case "hide_cache":
            if (url.match(/^https:\/\/www\.geocaching\.com\/play\/hide/)) return true;
			else return false;
			break;
		case "settings":
            if (url.match(/^https:\/\/www\.geocaching\.com\/account\/settings/)) return true;
            else if (url.match(/^https:\/\/www\.geocaching\.com\/account\/lists/)) return true;
			else return false;
			break;
		case "messagecenter":
            if (url.match(/^https:\/\/www\.geocaching\.com\/account\/messagecenter/)) return true;
			else return false;
			break;
        case "geotours":
			if (url.match(/^https:\/\/www\.geocaching\.com\/play\/geotours/)) return true;
			else return false;
			break;
        case "labs":
			if (url.match(/^https:\/\/labs\.geocaching\.com/)) return true;
			else return false;
			break;
        default:
            return false;
    }
}

// Wrapper fuer die aktuelle Seite (siehe is_link)
function is_page(name) {
    return is_link(name, document.location.href);
}

//Helperfunctions to inject functions into site context
function injectPageScript(scriptContent) {
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.innerHTML = scriptContent;
    var pageHead = document.getElementsByTagName("head")[0];
    pageHead.appendChild(script);
}

function injectPageScriptFunction(funct, functCall) {
    injectPageScript("(" + funct.toString() + ")" + functCall + ";");
}

start(this);
