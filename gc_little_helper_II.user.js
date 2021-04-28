// ==UserScript==
// @name             GC little helper II
// @namespace        http://www.amshove.net
//--> $$000 Begin of change
// @version          0.7.2
//<-- $$000 End of change
// @include          http*://www.geocaching.com/*
// @include          http*://labs.geocaching.com/*
// @include          http*://maps.google.tld/*
// @include          http*://www.google.tld/maps*
// @include          http*://www.openstreetmap.org*
// @exclude          /^https?://www\.geocaching\.com/(login|jobs|brandedpromotions|promotions|blog|seek/sendtogps)/
// @resource jscolor https://raw.githubusercontent.com/2Abendsegler/GClh/master/data/jscolor.js
// @require          http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @require          http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js
// @require          http://cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.2/dropbox.min.js
// @require          https://raw.githubusercontent.com/2Abendsegler/GClh/master/data/gclh_icons.js
// @description      Some little things to make life easy (on www.geocaching.com).
// @copyright        Torsten Amshove <torsten@amshove.net>
// @author           Torsten Amshove; 2Abendsegler
// @license          GNU General Public License v2.0
// @grant            GM_getValue
// @grant            GM_setValue
// @grant            GM_log
// @grant            GM_addStyle
// @grant            GM_listValues
// @grant            GM_xmlhttpRequest
// @grant            GM_getResourceText
// @grant            GM_registerMenuCommand
// @grant            GM_info
// ==/UserScript==

////////////////////////////////////////////////////////////////////////////
// $$000 | Versionierung, bei neuen Versionen beachten.
////////////////////////////////////////////////////////////////////////////

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
    } else {
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
        c.GM_setValue("browser", browser);
        c.CONFIG = JSON.parse(GM_getValue("CONFIG", '{}'));
        browserInitDeref.resolve();
    } else if (browser === "firefox") {
        // Check for Scriptish bug in Fennec browser (http://www.geoclub.de/viewtopic.php?f=117&t=62130&p=983614#p983614).
        c.GM_setValue("browser", browser);
        var test_browser = c.GM_getValue("browser");
        if (!test_browser) {
            var GM_getValue_Orig = c.GM_getValue;
            c.GM_getValue = function (key, def) {
                return GM_getValue_Orig("scriptvals.GClittlehelper@httpwww.amshove.net." + key, def);
            };
        }
        c.CONFIG = JSON.parse(GM_getValue("CONFIG", '{}'));
        browserInitDeref.resolve();
    } else {
        c.CONFIG = JSON.parse(GM_getValue("CONFIG", '{}'));
        browserInitDeref.resolve();
    }
    return browserInitDeref.promise();
};

var constInit = function (c) {
    var constInitDeref = new jQuery.Deferred();

    c.scriptName = GM_info.script.name;
    c.scriptVersion = GM_info.script.version;
    c.scriptNameConfig = c.scriptName.replace("helper", "helper Config");
    c.scriptNameSync = c.scriptName.replace("helper", "helper Sync");
    c.scriptShortNameConfig = "GClh Config II";
    c.scriptShortNameSync = "GClh Sync II";
    c.anzCustom = 10;
    c.anzTemplates = 10;
    c.bookmarks_def = new Array(22, 31, 16, 14, 32, 33, 48, "0", 8, 18, 54, 51, 55, 47, 10, 2, 35, 9, 17, 67, 23, 68);
    c.defaultConfigLink = "https://www.geocaching.com/my/default.aspx#GClhShowConfig";
    c.defaultSyncLink = "https://www.geocaching.com/my/default.aspx#GClhShowSync";

    // Define bookmarks.
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
    profileSpecialBookmark("Find Player", "#GClhShowFindPlayer", "lnk_findplayer", c.bookmarks);
    bookmark("E-Mail", "https://www.geocaching.com/email/default.aspx", c.bookmarks);
    bookmark("Statbar", "https://www.geocaching.com/my/statbar.aspx", c.bookmarks);
    bookmark("Guidelines", "https://www.geocaching.com/about/guidelines.aspx", c.bookmarks);
    profileSpecialBookmark(c.scriptShortNameConfig, "https://www.geocaching.com/my/default.aspx#GClhShowConfig", "lnk_gclhconfig", c.bookmarks);
    externalBookmark("Forum Groundspeak", "http://forums.groundspeak.com/", c.bookmarks);
    externalBookmark("Blog Groundspeak", "https://www.geocaching.com/blog/", c.bookmarks);
    bookmark("Feedback Groundspeak", "https://www.geocaching.com/feedback/", c.bookmarks);
    externalBookmark("Geoclub", "http://www.geoclub.de/", c.bookmarks);
    profileSpecialBookmark("Public Profile Geocaches", "https://www.geocaching.com/profile/default.aspx?#gclhpb#ctl00$ContentBody$ProfilePanel1$lnkUserStats", "lnk_profilegeocaches", c.bookmarks);
    profileSpecialBookmark("Public Profile Trackables", "https://www.geocaching.com/profile/default.aspx?#gclhpb#ctl00$ContentBody$ProfilePanel1$lnkCollectibles", "lnk_profiletrackables", c.bookmarks);
    profileSpecialBookmark("Public Profile Gallery", "https://www.geocaching.com/profile/default.aspx?#gclhpb#ctl00$ContentBody$ProfilePanel1$lnkGallery", "lnk_profilegallery", c.bookmarks);
    profileSpecialBookmark("Public Profile Lists", "https://www.geocaching.com/profile/default.aspx?#gclhpb#ctl00$ContentBody$ProfilePanel1$lnkLists", "lnk_profilebookmarks", c.bookmarks);
    bookmark("Profile", "https://www.geocaching.com/my/", c.bookmarks);
    profileSpecialBookmark("Nearest List", "https://www.geocaching.com/seek/nearest.aspx?#gclhpb#errhomecoord", "lnk_nearestlist", c.bookmarks);
    profileSpecialBookmark("Nearest Map", "https://www.geocaching.com/seek/nearest.aspx?#gclhpb#errhomecoord", "lnk_nearestmap", c.bookmarks);
    profileSpecialBookmark("Nearest List (w/o Founds)", "https://www.geocaching.com/seek/nearest.aspx?#gclhpb#errhomecoord", "lnk_nearestlist_wo", c.bookmarks);
    profileSpecialBookmark("Own Trackables", "https://www.geocaching.com/track/search.aspx?#gclhpb#errowntrackables", "lnk_my_trackables", c.bookmarks);

    c.langus =      new Array("Català", "Čeština", "Dansk", "Deutsch", "English", "Ελληνικά", "Eesti", "Español", "Français", "Italiano", "日本語", "한국어", "Latviešu", "Lëtzebuergesch", "Magyar", "Nederlands", "Norsk, Bokmål", "Polski", "Português", "Română", "Русский", "Slovenščina", "Suomi", "Svenska");
    c.langus_code = new Array("ca",     "cs",      "da",    "de",      "en",      "el",       "et",    "es",      "fr",       "it",       "ja",     "ko",    "lv",       "lb",             "hu",     "nl",         "nb",            "pl",     "pt",        "ro",     "ru",      "sl",          "fi",    "sv"     );
    c.langus_flag_url = "https://raw.githubusercontent.com/2Abendsegler/GClh/master/images/flag_##.png";

    c.gclhConfigKeysIgnoreForBackup = {
        "token": true,
        "dbToken": true
    };

    iconsInit();

    c.all_map_layers = new Object();     // gc.com Default-Layers
    c.all_map_layers = {
         "Geocaching" : { tileUrl: "https://maptiles{s}.geocaching.com/tile/{z}/{x}/{y}.png?token={accessToken}",  accessToken: '',  subdomains: ['01', '02', '03', '04', '05', '06', '07', '08'],  minZoom: 0,  maxZoom: 18 }
        ,"OpenStreetMap Default" : { tileUrl: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",  attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>' }
        ,"OpenStreetMap German Style" : { tileUrl: "http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png",  attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>' }
        ,"OpenStreetMap Black and White" : { tileUrl: "http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png",  attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>' }
        ,"Thunderforest OpenCycleMap" : { tileUrl: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",  attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>' }
        ,"Thunderforest Transport" : { tileUrl: "http://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png",  attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>' }
        ,"Thunderforest Landscape" : { tileUrl: "http://{s}.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png",  attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>' }
        ,"Stamen Toner" : { tileUrl: "http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png",  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; ' + "Map data {attribution.OpenStreetMap}",  subdomains: "abcd",  minZoom: 0,  maxZoom: 20 }
        ,"Stamen Terrain" : { tileUrl: "http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png",  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; ' + "Map data {attribution.OpenStreetMap}",  subdomains: "abcd",  minZoom: 4,  maxZoom: 18 }
        ,"Stamen Watercolor" : { tileUrl: "http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png",  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; ' + "Map data {attribution.OpenStreetMap}",  subdomains: "abcd",  minZoom: 3,  maxZoom: 16 }
        ,"Esri WorldStreetMap" : { tileUrl: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",  attribution: "Tiles &copy; Esri" }
        ,"Esri DeLorme" : { tileUrl: "http://server.arcgisonline.com/ArcGIS/rest/services/Specialty/DeLorme_World_Base_Map/MapServer/tile/{z}/{y}/{x}",  attribution: "Tiles &copy; Esri &mdash; Copyright: \u00a92012 DeLorme",  maxZoom: 11 }
        ,"Esri WorldTopoMap" : { tileUrl: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",  attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community" }
        ,"Esri WorldImagery" : { tileUrl: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",  attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community" }
        ,"Esri OceanBasemap" : { tileUrl: "http://services.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}",  attribution: "Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri",  maxZoom: 11 }
        ,"Esri NatGeoWorldMap" : { tileUrl: "http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",  attribution: "Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC" }
        ,"OpenStreetMap Hike and Bike" : { tileUrl: "http://toolserver.org/tiles/hikebike/{z}/{x}/{y}.png",  attribution: 'Map and map data \u00a9 2012 <a href="http://www.openstreetmap.org" target=\'_blank\'>OpenStreetMap</a> and contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>.',  tileSize: 256,  minZoom: 0,  maxZoom: 20 }
        ,"Google Maps" : { tileUrl: "http://mt.google.com/vt?x={x}&y={y}&z={z}",  attribution: "Google Maps",  tileSize: 256,  minZoom: 0,  maxZoom: 20 }
        ,"Google Maps Satellite" : { tileUrl: "http://mt.google.com/vt?lyrs=s&x={x}&y={y}&z={z}",  attribution: "Google Maps",  tileSize: 256,  minZoom: 3,  maxZoom: 20 }
        ,"Google Maps Hybrid" : { tileUrl: "http://mt0.google.com/vt/lyrs=s,m@110&hl=en&x={x}&y={y}&z={z}",  attribution: "Google Maps",  tileSize: 256,  minZoom: 0,  maxZoom: 20 }
    };

    c.map_overlays = new Object();
    c.map_overlays = {
         "Hillshadow" : { tileUrl: "http://{s}.tiles.wmflabs.org/hillshading/{z}/{x}/{y}.png",  attribution: 'hillshadow \u00a9 <a href="http://tiles.wmflabs.org/" target=\'_blank\'>tiles.wmflabs.org</a>',  tileSize: 256,  minZoom: 0,  maxZoom: 17 }
        ,"Public Transport Lines" : { tileUrl: "http://openptmap.org/tiles/{z}/{x}/{y}.png",  attribution: 'Public Transport Lines\u00a9 <a href="http://openptmap.org/" target=\'_blank\'>OpenPTMap</a>',  tileSize: 256,  minZoom: 0,  maxZoom: 17 }
    };

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
    if (document.location.href.toLowerCase().indexOf("https") === 0) { c.http = "https"; }
    c.global_imageGallery = false;
    c.global_dependents = new Array();
    c.global_mod_reset = false;
    c.global_rc_data = "";
    c.global_rc_status = "";
    c.settings_submit_log_button = getValue("settings_submit_log_button", true);
    c.settings_log_inline = getValue("settings_log_inline", true);
    c.settings_log_inline_tb = getValue("settings_log_inline_tb", false);
    c.settings_log_inline_pmo4basic = getValue("settings_log_inline_pmo4basic", true);
    c.settings_bookmarks_show = getValue("settings_bookmarks_show", true);
    c.settings_change_header_layout = getValue("settings_change_header_layout", true);
    c.settings_fixed_header_layout = getValue("settings_fixed_header_layout", false);
    c.settings_remove_logo = getValue("settings_remove_logo", false);
    c.settings_remove_message_in_header = getValue("settings_remove_message_in_header", false);
    c.settings_bookmarks_on_top = getValue("settings_bookmarks_on_top", true);
    c.settings_bookmarks_top_menu = getValue("settings_bookmarks_top_menu", "true");
    c.settings_bookmarks_search = getValue("settings_bookmarks_search", "true");
    c.settings_bookmarks_search_default = getValue("settings_bookmarks_search_default", "");
    c.settings_redirect_to_map = getValue("settings_redirect_to_map", false);
    c.settings_new_width = getValue("settings_new_width", 1000);
    c.settings_hide_facebook = getValue("settings_hide_facebook", true);
    c.settings_hide_socialshare = getValue("settings_hide_socialshare", true);
    c.settings_hide_disclaimer = getValue("settings_hide_disclaimer", true);
    c.settings_hide_cache_notes = getValue("settings_hide_cache_notes", false);
    c.settings_hide_empty_cache_notes = getValue("settings_hide_empty_cache_notes", true);
    c.settings_show_all_logs = getValue("settings_show_all_logs", true);
    c.settings_show_all_logs_count = getValue("settings_show_all_logs_count", "30");
    c.settings_decrypt_hint = getValue("settings_decrypt_hint", true);
    c.settings_visitCount_geocheckerCom = getValue("settings_visitCount_geocheckerCom", true);
    c.settings_show_bbcode = getValue("settings_show_bbcode", true);
    c.settings_show_mail = getValue("settings_show_mail", true);
    c.settings_font_size_menu = getValue("settings_font_size_menu", 15);
    c.settings_font_size_submenu = getValue("settings_font_size_submenu", 13);
    c.settings_distance_menu = getValue("settings_distance_menu", 8);
    c.settings_distance_submenu = getValue("settings_distance_submenu", 8);
    c.settings_font_color_menu_submenu = getValue("settings_font_color_menu_submenu", "93B516");
    c.settings_menu_number_of_lines = getValue("settings_menu_number_of_lines", 1);
    c.settings_menu_show_separator = getValue("settings_menu_show_separator", false);
    c.settings_menu_float_right = getValue("settings_menu_float_right", false);
    c.settings_gc_tour_is_working = getValue("settings_gc_tour_is_working", false);
    c.settings_show_smaller_area_top_right = getValue("settings_show_smaller_area_top_right", true);
    c.settings_show_smaller_gc_link = getValue("settings_show_smaller_gc_link", true);
    c.settings_show_message = getValue("settings_show_message", true);
    c.settings_show_remove_ignoring_link = getValue("settings_show_remove_ignoring_link", true);
    c.settings_show_common_lists_in_zebra = getValue("settings_show_common_lists_in_zebra", true);
    c.settings_show_common_lists_color_user = getValue("settings_show_common_lists_color_user", true);
    c.settings_show_cache_listings_in_zebra = getValue("settings_show_cache_listings_in_zebra", false);
    c.settings_show_cache_listings_color_user = getValue("settings_show_cache_listings_color_user", true);
    c.settings_show_cache_listings_color_owner = getValue("settings_show_cache_listings_color_owner", true);
    c.settings_show_cache_listings_color_reviewer = getValue("settings_show_cache_listings_color_reviewer", true);
    c.settings_show_cache_listings_color_vip = getValue("settings_show_cache_listings_color_vip", true);
    c.settings_show_tb_listings_in_zebra = getValue("settings_show_tb_listings_in_zebra", true);
    c.settings_show_tb_listings_color_user = getValue("settings_show_tb_listings_color_user", true);
    c.settings_show_tb_listings_color_owner = getValue("settings_show_tb_listings_color_owner", true);
    c.settings_show_tb_listings_color_reviewer = getValue("settings_show_tb_listings_color_reviewer", true);
    c.settings_show_tb_listings_color_vip = getValue("settings_show_tb_listings_color_vip", true);
    c.settings_lines_color_zebra = getValue("settings_lines_color_zebra", "EBECED");
    c.settings_lines_color_user = getValue("settings_lines_color_user", "C2E0C3");
    c.settings_lines_color_owner = getValue("settings_lines_color_owner", "E0E0C3");
    c.settings_lines_color_reviewer = getValue("settings_lines_color_reviewer", "EAD0C3");
    c.settings_lines_color_vip = getValue("settings_lines_color_vip", "F0F0A0");
    c.settings_show_mail_in_allmyvips = getValue("settings_show_mail_in_allmyvips", true);
    c.settings_show_mail_in_viplist = getValue("settings_show_mail_in_viplist", true);
    c.settings_process_vup = getValue("settings_process_vup", false);
    c.settings_show_vup_friends = getValue("settings_show_vup_friends", false);
    c.settings_vup_hide_avatar = getValue("settings_vup_hide_avatar", false);
    c.settings_vup_hide_log = getValue("settings_vup_hide_log", false);
    c.settings_f2_save_gclh_config = getValue("settings_f2_save_gclh_config", true);
    c.settings_f4_call_gclh_config = getValue("settings_f4_call_gclh_config", true);
    c.settings_f10_call_gclh_sync = getValue("settings_f10_call_gclh_sync", true);
    c.settings_show_sums_in_bookmark_lists = getValue("settings_show_sums_in_bookmark_lists", true);
    c.settings_show_sums_in_watchlist = getValue("settings_show_sums_in_watchlist", true);
    c.settings_hide_warning_message = getValue("settings_hide_warning_message", true);
    c.settings_show_save_message = getValue("settings_show_save_message", true);
    c.settings_map_overview_build = getValue("settings_map_overview_build", true);
    c.settings_map_overview_zoom = getValue("settings_map_overview_zoom", 11);
    c.settings_logit_for_basic_in_pmo = getValue("settings_logit_for_basic_in_pmo", true);
    c.settings_log_statistic = getValue("settings_log_statistic", true);
    c.settings_log_statistic_percentage = getValue("settings_log_statistic_percentage", true);
    c.settings_log_statistic_reload = getValue("settings_log_statistic_reload", 8);
    c.settings_count_own_matrix = getValue("settings_count_own_matrix", true);
    c.settings_count_foreign_matrix = getValue("settings_count_foreign_matrix", true);
    c.settings_count_own_matrix_show_next = getValue("settings_count_own_matrix_show_next", true);
    c.settings_count_own_matrix_show_count_next = getValue("settings_count_own_matrix_show_count_next", 2);
    c.settings_count_own_matrix_show_color_next = getValue("settings_count_own_matrix_show_color_next", "5151FB");
    c.settings_count_own_matrix_links_radius = getValue("settings_count_own_matrix_links_radius", 25);
    c.settings_count_own_matrix_links = getValue("settings_count_own_matrix_links", "map");
    c.settings_hide_left_sidebar_on_google_maps = getValue("settings_hide_left_sidebar_on_google_maps", true);
    c.settings_add_link_gc_map_on_google_maps = getValue("settings_add_link_gc_map_on_google_maps", true);
    c.settings_switch_to_gc_map_in_same_tab = getValue("settings_switch_to_gc_map_in_same_tab", false);
    c.settings_add_link_google_maps_on_gc_map = getValue("settings_add_link_google_maps_on_gc_map", true);
    c.settings_switch_to_google_maps_in_same_tab = getValue("settings_switch_to_google_maps_in_same_tab", false);
    c.settings_add_link_gc_map_on_osm = getValue("settings_add_link_gc_map_on_osm", true);
    c.settings_switch_from_osm_to_gc_map_in_same_tab = getValue("settings_switch_from_osm_to_gc_map_in_same_tab", false);
    c.settings_add_link_osm_on_gc_map = getValue("settings_add_link_osm_on_gc_map", true);
    c.settings_switch_to_osm_in_same_tab = getValue("settings_switch_to_osm_in_same_tab", false);
    c.settings_add_link_flopps_on_gc_map = getValue("settings_add_link_flopps_on_gc_map", true);
    c.settings_switch_to_flopps_in_same_tab = getValue("settings_switch_to_flopps_in_same_tab", false);
    c.settings_add_link_geohack_on_gc_map = getValue("settings_add_link_geohack_on_gc_map", true);
    c.settings_switch_to_geohack_in_same_tab = getValue("settings_switch_to_geohack_in_same_tab", false);
    c.settings_sort_default_bookmarks = getValue("settings_sort_default_bookmarks", true);
    c.settings_make_vip_lists_hideable = getValue("settings_make_vip_lists_hideable", true);
    c.settings_show_latest_logs_symbols = getValue("settings_show_latest_logs_symbols", true);
    c.settings_show_latest_logs_symbols_count = getValue("settings_show_latest_logs_symbols_count", 5);
    c.settings_set_default_langu = getValue("settings_set_default_langu", false);
    c.settings_default_langu = getValue("settings_default_langu", "English");
    c.settings_hide_colored_versions = getValue("settings_hide_colored_versions", false);
    c.settings_make_config_main_areas_hideable = getValue("settings_make_config_main_areas_hideable", true);
    c.settings_faster_profile_trackables = getValue("settings_faster_profile_trackables", false);
    c.settings_show_eventday = getValue("settings_show_eventday", true);
    c.settings_date_format = getValue("settings_date_format", "yyyy-MM-dd");
    c.settings_show_google_maps = getValue("settings_show_google_maps", true);
    c.settings_show_log_it = getValue("settings_show_log_it", true);
    c.settings_show_nearestuser_profil_link = getValue("settings_show_nearestuser_profil_link", true);
    c.settings_show_homezone = getValue("settings_show_homezone", true);
    c.settings_homezone_radius = getValue("settings_homezone_radius", "10");
    c.settings_homezone_color = getValue("settings_homezone_color", "#0000FF");
    c.settings_homezone_opacity = getValue("settings_homezone_opacity", 10);
    c.settings_multi_homezone = JSON.parse(getValue("settings_multi_homezone", "{}"));
    c.settings_show_hillshadow = getValue("settings_show_hillshadow", false);
    c.settings_map_layers = getValue("settings_map_layers", "").split("###");
    c.map_url = "https://www.geocaching.com/map/default.aspx";
    c.settings_default_logtype = getValue("settings_default_logtype", "-1");
    c.settings_default_logtype_event = getValue("settings_default_logtype_event", c.settings_default_logtype);
    c.settings_default_logtype_owner = getValue("settings_default_logtype_owner", c.settings_default_logtype);
    c.settings_default_tb_logtype = getValue("settings_default_tb_logtype", "-1");
    c.settings_bookmarks_list = JSON.parse(getValue("settings_bookmarks_list", JSON.stringify(c.bookmarks_def)).replace(/, (?=,)/g, ",null"));
    if (c.settings_bookmarks_list.length == 0) {
        c.settings_bookmarks_list = c.bookmarks_def;
    }
    c.settings_sync_last = new Date(getValue("settings_sync_last", "Thu Jan 01 1970 01:00:00 GMT+0100 (Mitteleuropäische Zeit)"));
    c.settings_sync_hash = getValue("settings_sync_hash", "");
    c.settings_sync_time = getValue("settings_sync_time", 36000000);  // 10 Stunden
    c.settings_sync_autoImport = getValue("settings_sync_autoImport", false);
    c.settings_hide_advert_link = getValue('settings_hide_advert_link', true);
    c.settings_hide_spoilerwarning = getValue('settings_hide_spoilerwarning', true);
    c.settings_hide_hint = getValue('settings_hide_hint', true);
    c.settings_strike_archived = getValue('settings_strike_archived', true);
    c.settings_highlight_usercoords = getValue('settings_highlight_usercoords', true);
    c.settings_highlight_usercoords_bb = getValue('settings_highlight_usercoords_bb', false);
    c.settings_highlight_usercoords_it = getValue('settings_highlight_usercoords_it', true);
    c.settings_map_hide_found = getValue('settings_map_hide_found', true);
    c.settings_map_hide_hidden = getValue('settings_map_hide_hidden', true);
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
    c.settings_show_fav_percentage = getValue('settings_show_fav_percentage', true);
    c.settings_show_vip_list = getValue('settings_show_vip_list', true);
    c.settings_show_owner_vip_list = getValue('settings_show_owner_vip_list', true);
    c.settings_autovisit = getValue("settings_autovisit", "true");
    c.settings_show_thumbnails = getValue("settings_show_thumbnails", true);
    c.settings_imgcaption_on_top = getValue("settings_imgcaption_on_top", false);
    c.settings_hide_avatar = getValue("settings_hide_avatar", false);
    c.settings_link_big_listing = getValue("settings_link_big_listing", true);
    c.settings_show_big_gallery = getValue("settings_show_big_gallery", false);
    c.settings_automatic_friend_reset = getValue("settings_automatic_friend_reset", false);
    c.settings_show_long_vip = getValue("settings_show_long_vip", false);
    c.settings_load_logs_with_gclh = getValue("settings_load_logs_with_gclh", true);
    c.settings_map_add_layer = getValue("settings_map_add_layer", true);
    c.settings_map_default_layer = getValue("settings_map_default_layer", "OpenStreetMap Default");
    c.settings_hide_map_header = getValue("settings_hide_map_header", false);
    c.settings_spoiler_strings = getValue("settings_spoiler_strings", "spoiler|hinweis|hint");
    c.settings_replace_log_by_last_log = getValue("settings_replace_log_by_last_log", false);
    c.settings_hide_top_button = getValue("settings_hide_top_button", false);
    c.settings_show_real_owner = getValue("settings_show_real_owner", false);
    c.settings_hide_archived_in_owned = getValue("settings_hide_archived_in_owned", false);
    c.settings_hide_visits_in_profile = getValue("settings_hide_visits_in_profile", false);
    c.settings_log_signature_on_fieldnotes = getValue("settings_log_signature_on_fieldnotes", true);
    c.settings_map_hide_sidebar = getValue("settings_map_hide_sidebar", true);
    c.settings_hover_image_max_size = getValue("settings_hover_image_max_size", 600);
    c.settings_vip_show_nofound = getValue("settings_vip_show_nofound", true);
    c.settings_use_gclh_layercontrol = getValue("settings_use_gclh_layercontrol", true);
    c.settings_fixed_pq_header = getValue("settings_fixed_pq_header", false);
    c.settings_friendlist_summary = getValue("settings_friendlist_summary", true);
    c.settings_friendlist_summary_viponly = getValue("settings_friendlist_summary_viponly", false);
    c.settings_search_data = JSON.parse(getValue("settings_search_data", "[]"));
    c.settings_search_enable_user_defined = getValue("settings_search_enable_user_defined",true);
    c.settings_pq_warning = getValue("settings_pq_warning",true);
    c.settings_pq_set_cachestotal = getValue("settings_pq_set_cachestotal",true);
    c.settings_pq_cachestotal = getValue("settings_pq_cachestotal",1000);
    c.settings_pq_option_ihaventfound = getValue("settings_pq_option_ihaventfound",true);
    c.settings_pq_option_idontown = getValue("settings_pq_option_idontown",true);
    c.settings_pq_option_ignorelist = getValue("settings_pq_option_ignorelist",true);
    c.settings_pq_option_isenabled = getValue("settings_pq_option_isenabled",true);
    c.settings_pq_option_filename = getValue("settings_pq_option_filename",true);
    c.settings_pq_set_terrain = getValue("settings_pq_set_terrain",true);
    c.settings_pq_set_difficulty = getValue("settings_pq_set_difficulty",true);
    c.settings_pq_difficulty = getValue("settings_pq_difficulty",">=");
    c.settings_pq_difficulty_score = getValue("settings_pq_difficulty_score","1");
    c.settings_pq_terrain = getValue("settings_pq_terrain",">=");
    c.settings_pq_terrain_score = getValue("settings_pq_terrain_score","1");
    c.settings_pq_automatically_day = getValue("settings_pq_automatically_day",false);
    c.settings_mail_icon_new_win = getValue("settings_mail_icon_new_win",false);
    c.settings_message_icon_new_win = getValue("settings_message_icon_new_win",false);
    c.settings_hide_cache_approvals = getValue("settings_hide_cache_approvals", true);
    c.settings_driving_direction_link = getValue("settings_driving_direction_link",true);
    c.settings_driving_direction_parking_area = getValue("settings_driving_direction_parking_area",false);
    c.settings_show_elevation_of_waypoints = getValue("settings_show_elevation_of_waypoints", true);
    c.settings_distance_units = getValue("settings_distance_units", "");
    c.settings_img_warning = getValue("settings_img_warning", false);
    c.settings_fieldnotes_old_fashioned = getValue("settings_fieldnotes_old_fashioned", false);
    c.settings_remove_banner = getValue("settings_remove_banner", false);
    c.settings_remove_banner_to_mylists_new = getValue("settings_remove_banner_to_mylists_new", true);
    c.settings_remove_banner_to_mylists_old = getValue("settings_remove_banner_to_mylists_old", false);
    c.settings_remove_banner_for_garminexpress = getValue("settings_remove_banner_for_garminexpress", true);
    c.settings_compact_layout_bm_lists = getValue("settings_compact_layout_bm_lists", false);
    c.settings_compact_layout_list_of_bm_lists = getValue("settings_compact_layout_list_of_bm_lists", false);

    // Settings: Custom Bookmarks.
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
    // Some more Bookmarks.
    profileSpecialBookmark("Public Profile Souvenirs", "https://www.geocaching.com/profile/default.aspx?#gclhpb#ctl00$ContentBody$ProfilePanel1$lnkSouvenirs", "lnk_profilesouvenirs", c.bookmarks);
    bookmark("Statistics", "https://www.geocaching.com/my/statistics.aspx", c.bookmarks);
    bookmark("Field Notes", "https://www.geocaching.com/my/fieldnotes.aspx", c.bookmarks);
    profileSpecialBookmark("Public Profile Statistics", "https://www.geocaching.com/profile/default.aspx?#gclhpb#ctl00$ContentBody$ProfilePanel1$lnkStatistics", "lnk_profilestatistics", c.bookmarks);
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
    profileSpecialBookmark(scriptShortNameSync, defaultSyncLink, "lnk_gclhsync", c.bookmarks);
    externalBookmark("Forum Geoclub", "http://geoclub.de/forum/index.php", c.bookmarks);
    externalBookmark("Changelog", "https://github.com/2Abendsegler/GClh/blob/master/docu/changelog.md#readme", c.bookmarks);
    // Settings: Remove GC Menu from Navigation.
    c.remove_navi_learn = getValue("remove_navi_learn", false);
    c.remove_navi_play = getValue("remove_navi_play", false);
    c.remove_navi_community = getValue("remove_navi_community", false);
    c.remove_navi_shop = getValue("remove_navi_shop", false);
    // Settings: Custom Bookmark-title.
    c.bookmarks_orig_title = new Array();
    for (var i = 0; i < c.bookmarks.length; i++) {
        if (getValue("settings_bookmarks_title[" + i + "]", "") != "") {
            c.bookmarks_orig_title[i] = c.bookmarks[i]['title']; // Needed for configuration
            c.bookmarks[i]['title'] = getValue("settings_bookmarks_title[" + i + "]");
        }
    }

    try {
        if (c.userToken === null) {
            // Get Userdata from site context and add them to the extension context.
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
            } else if (document.location.href.match(/^(http|https):\/\/www\.openstreetmap\.org/ )) {
                mainOSM();
            } else {
                mainGC();
            }
        });
};

////////////////////////////////////////////////////////////////////////////
// Google Maps
////////////////////////////////////////////////////////////////////////////
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
                        setTimeout( function () { addGcButton( waitCount ); }, 200);
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
                        setTimeout( function () { hideLeftSidebar( waitCount ); }, 1000);
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
// Openstreetmap
////////////////////////////////////////////////////////////////////////////
// Improve Openstreetmap.
var mainOSM = function () {
    try {
        // Add link to GC Map on Openstreetmap.
        function addGCButton( wait ) {
            // console.log("addGCButton("+wait+")");
            if ( document.location.href.match(/^(http|https):\/\/www\.openstreetmap\.org\/(.*)#map=/ ) && $(".control-key").length ) {
                if ( settings_add_link_gc_map_on_osm  ) {
                    var code = '<div class="control-gc leaflet-control"><a class="control-button" href="#" data-original-title="Geocaching.com" style="outline: medium none;"><span class="icon" title="Geocaching Map" style="margin: 5px; display: inline-block; vertical-align: middle; height: 32px; width: 32px; background-image: url(\''+global_gc_icon_sw+'\'); background-size: 25px 25px;  background-position: center; background-repeat: no-repeat;"></span></a></div>';
                    $(".control-share").after(code);

                    $(".control-gc").click( function () {
                        var matches = document.location.href.match(/=([0-9]+)\/(-?[0-9.]*)\/(-?[0-9.]*)/);
                        if (matches != null) {
                            var url = map_url + '?lat=' + matches[2] + '&lng=' + matches[3] + '#?ll=' + matches[2] + ',' + matches[3] + '&z=' + matches[1];
                            // console.log( "settings_switch_from_osm_to_gc_map_in_same_tab: "+ settings_switch_from_osm_to_gc_map_in_same_tab );
                            if ( settings_switch_from_osm_to_gc_map_in_same_tab ) {
                                location = url;
                            } else {
                                window.open( url );
                            }
                        } else {
                            alert('This map has no geographical coordinates in its link. Just zoom or drag the map, afterwards this will work fine.');
                        }
                    });
                    // console.log("addGCButton("+wait+") - found it");
                }
            } else {
                wait++;
                if ( wait < 50 ) { setTimeout( function() { addGCButton(wait); }, 100 ); }
            }
        }
        addGCButton(0);
    } catch (e) {
        gclh_error("mainOSM", e);
    }
};

////////////////////////////////////////////////////////////////////////////
// Helper
////////////////////////////////////////////////////////////////////////////
var mainGC = function () {

// Run after Redirect
    if (typeof(unsafeWindow.__doPostBack) == "function") {
        try {
            var splitter = document.location.href.split("#");
            if ( splitter && splitter[1] && splitter[1] == "gclhpb" && splitter[2] && splitter[2] != "" ) {
                var postbackValue = splitter[2];
                // Home Coords in GClh übernehmen.
                if ( postbackValue == "errhomecoord" ) {
                    var mess = "To use this link, GClh has to know your home coordinates. \n"
                             + "Do you want to go to the special area and let GClh save \n"
                             + "your home coordinates automatically?\n\n"
                             + "GClh will save it automatically. You have nothing to do at the\n"
                             + "following page \"Home Location\", except, to choose your link again.";
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
                             + "GClh will save it automatically. You have nothing to do at the\n"
                             + "following page \"Your Profile\", except, to choose your link again.";
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
        } catch (e) {
            gclh_error("Run after Redirect", e);
        }
    }

// Set language to default language.
    if ( settings_set_default_langu ) {
        try {
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
        } catch (e) {
            gclh_error("set language to default language", e);
        }
    }

// Faster loading profile trackables without images.
    if ( settings_faster_profile_trackables &&
         document.location.href.match(/^https?:\/\/www\.geocaching\.com\/profile/) &&
         document.getElementById("ctl00_ContentBody_ProfilePanel1_lnkCollectibles") &&
         document.getElementById("ctl00_ContentBody_ProfilePanel1_lnkCollectibles").className == "Active" ) {
        try {
            window.stop();
            $('table.Table').find('tbody tr td a img').each( function () { this.src = "/images/icons/16/watch.png"; this.title = ""; this.style.paddingLeft = "15px"; } );
        } catch (e) {
            gclh_error("Faster loading profile trackables", e);
        }
    }

// Migration: Installationszähler. Aktuelle TB Rules laden. Migrationsaufgaben erledigen.
    var declaredVersion = getValue("declared_version");
    if ( declaredVersion != scriptVersion ) {
        try {
            instCount(declaredVersion);
//--> $$065 Begin of insert
//<-- $$065 End of insert
            migrationTasks();
        } catch (e) {
            gclh_error("migration", e);
        }
    }

// Redirect to Map (von Search Liste direkt in Karte springen).
    if (settings_redirect_to_map && document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/nearest\.aspx\?/)) {
        if (!document.location.href.match(/&disable_redirect=/) && !document.location.href.match(/key=/) && !document.location.href.match(/ul=/) && document.getElementById('ctl00_ContentBody_LocationPanel1_lnkMapIt')) {
            document.getElementById('ctl00_ContentBody_LocationPanel1_lnkMapIt').click();
        }
    }

// Last Log-Text speichern fuer TB-Log-Template.
    if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/log\.aspx/) && document.getElementById("ctl00_ContentBody_LogBookPanel1_btnSubmitLog")) {
        try {
            function send_log(e) {
                setValue("last_logtext", document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').value);
            }
            document.getElementById("ctl00_ContentBody_LogBookPanel1_btnSubmitLog").addEventListener('click', send_log, true);
        } catch (e) {
            gclh_error("Last-Log-Text speichern", e);
        }
    }

// F2 zum Log abschicken (Cache und TB).
    if (settings_submit_log_button && (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/log\.aspx\?(id|guid|ID|wp|LUID|PLogGuid)\=/) || document.location.href.match(/^https?:\/\/www\.geocaching\.com\/track\/log\.aspx\?(id|wid|guid|ID|LUID|PLogGuid)\=/)) && document.getElementById("ctl00_ContentBody_LogBookPanel1_btnSubmitLog")) {
        try {
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
        } catch (e) {
            gclh_error("F2 logging", e);
        }
    }

// F2 zum PQ speichern.
    if (settings_submit_log_button && (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/pocket\/gcquery\.aspx/)) && document.getElementById("ctl00_ContentBody_btnSubmit")) {
        try {
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
        } catch (e) {
            gclh_error("F2 save PQ", e);
        }
    }

// F2 Bookmark speichern.
    if ( settings_submit_log_button ) {
        // "Create a Bookmark" entry und "Edit a Bookmark" entry.
        if ( document.location.href.match(/^https?:\/\/www\.geocaching\.com\/bookmarks\/mark\.aspx/) &&
             document.getElementById("ctl00_ContentBody_Bookmark_btnCreate")                            ) {
            try {
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
            } catch (e) {
                gclh_error("F2 save Bookmark", e);
            }
        }
        // "Bookmark Pocket Query", also aus einer Bookmark eine PQ erzeugen.
        if ( document.location.href.match(/^https?:\/\/www\.geocaching\.com\/pocket\/bmquery\.aspx/) &&
             document.getElementById("ctl00_ContentBody_btnSubmit")                            ) {
            try {
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
            } catch (e) {
                gclh_error("F2 save Bookmark Pocket Query", e);
            }
        }
    }

// F2 hide cache process speichern.
    if (settings_submit_log_button && document.location.href.match(/^https?:\/\/www\.geocaching\.com\/hide\//)) {
        try {
            var id = "";
            if (document.getElementById("btnContinue")) id = "btnContinue";
            else if (document.getElementById("btnSubmit")) id = "btnSubmit";
            else if (document.getElementById("btnNext")) id = "btnNext";
            else if (document.getElementById("ctl00_ContentBody_btnSubmit")) id = "ctl00_ContentBody_btnSubmit";
            else if (document.getElementById("ctl00_ContentBody_Attributes_btnUpdate")) id = "ctl00_ContentBody_Attributes_btnUpdate";
            else if (document.getElementById("ctl00_ContentBody_WaypointEdit_uxSubmitIt")) id = "ctl00_ContentBody_WaypointEdit_uxSubmitIt";
            if (id != "") {
                var but = document.getElementById(id);
                but.value = document.getElementById(id).value + " (F2)";
                function keydown(e) {
                    if (e.keyCode == 113) {
                        if ( !check_config_page() ) {
                            document.getElementById(id).click();
                        }
                    }
                }
                window.addEventListener('keydown', keydown, true);
            }
        } catch (e) {
            gclh_error("F2 hide cache process speichern", e);
        }
    }

// Aufruf GClh Config per F4 Taste. Nur auf den erlaubten Seiten und auch nur, wenn man nicht schon im GClh Config ist.
    if ( settings_f4_call_gclh_config ) {
        function keydown(e) {
            if (e.keyCode == 115) {
                if ( !check_config_page() ) {
                    if ( checkTaskAllowed( "GClh Config", false ) == true ) gclh_showConfig();
                    else document.location.href = defaultConfigLink;
                }
            }
        }
        try {
            if ( !check_config_page() ) {
                window.addEventListener('keydown', keydown, true);
            }
        } catch (e) {
            gclh_error("F4 call GClh Config", e);
        }
    }

// Aufruf GClh Sync per F10 Taste. Nur auf den erlaubten Seiten und auch nur, wenn man nicht schon im GClh Sync ist. Nicht im Config Reset Modus.
    if ( settings_f10_call_gclh_sync ) {
        function keydown(e) {
            if (e.keyCode == 121) {
                if ( !check_sync_page() && !global_mod_reset ) {
                    if ( checkTaskAllowed( "GClh Sync", false ) == true ) gclh_showSync();
                    else document.location.href = defaultSyncLink;
                }
            }
        }
        try {
            if ( !check_sync_page() ) {
                window.addEventListener('keydown', keydown, true);
            }
        } catch (e) {
            gclh_error("F10 call GClh Sync", e);
        }
    }

// Change Header layout.
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
            if ( font_color == "" ) { font_color = "93B516"; };

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
                if (settings_remove_message_in_header) {
                    $('.messagecenterheaderwidget').remove();
                } else {
                    $('.messagecenterheaderwidget').find(".link-text").remove();                 // Altes Seiten Design
                    $('.messagecenterheaderwidget').find(".link-text-msg-center").remove();      // Account Settings, Message Center (neues Seiten Design)
                    $('.messagecenterheaderwidget').find(".msg-center-link-text").remove();      // Cache suchen, Cache verstecken (neues Seiten Design)
                    var mess_head = document.getElementsByClassName("messagecenterheaderwidget li-messages");
                    for (var mh = 0; mh < mess_head.length; mh++) {
                        mess_head[mh].setAttribute("title", "Message Center");
                        if ( mess_head[mh].children[0].className !== "message-center-icon" ) {
                            mess_head[mh].children[0].remove();
                        }
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
                } else style.innerHTML += ".main {margin-top: -64px;}";
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
                if (settings_remove_logo && settings_show_smaller_gc_link) {
                    document.getElementById('ctl00_ctl23_A1').remove();
                    style.innerHTML += "nav .container {margin-left: -45px !important;}";
                } else {
                    // Geocaching Logo ersetzen und verschieben, sofern das gewünscht ist.
                    if (document.getElementById('ctl00_ctl23_A1')) {
                        var side = document.getElementById('ctl00_ctl23_A1');
                        changeGcLogo(side);
                    }
                }

                // Aufbau Menü im Header mit move Navigation (nicht mehr move Navigation Container).
                // Menü in den Header verschieben.
                $('#ctl00_siteHeader').find(".container").prepend($('#Navigation').remove().get().reverse());

                // Weitere Attribute für altes Seiten Design zur Darstellung der Objekte im Header setzen.
                if (settings_fixed_header_layout) {
                    style.innerHTML += "nav .container {width: " + ( new_width - 450 ) + "px !important;} header .container {width: " + new_width + "px;} header .ProfileWidget {margin-right: 10px;}";
                } else {
                    // Menüweite setzen.
                    style.innerHTML += "nav .container {width: " + ( new_width_menu + new_width_menu_cut_old ) + "px !important;}";
                }
                style.innerHTML +=
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
            // Bei Cache suchen, Cache verstecken und Geotours werden menu, submenu und logo so geschrieben.
            } else if ( is_page("find_cache") || is_page("hide_cache") || is_page("geotours") ) {
                style_tmp.innerHTML = style.innerHTML.replace(/#m/gi, "menu"); style.innerHTML = style_tmp.innerHTML;
                style_tmp.innerHTML = style.innerHTML.replace(/#sm/gi, "submenu"); style.innerHTML = style_tmp.innerHTML;
                style_tmp.innerHTML = style.innerHTML.replace(/#l/gi, "nav .logo"); style.innerHTML = style_tmp.innerHTML;
            // Bei Labs werden Menu, SubMenu und title (logo) so geschrieben.
            } else if ( is_page("labs") ) {
                style_tmp.innerHTML = style.innerHTML.replace(/#m/gi, "Menu"); style.innerHTML = style_tmp.innerHTML;
                style_tmp.innerHTML = style.innerHTML.replace(/#sm/gi, "SubMenu"); style.innerHTML = style_tmp.innerHTML;
                style_tmp.innerHTML = style.innerHTML.replace(/#l/gi, ".title"); style.innerHTML = style_tmp.innerHTML;
            // In Karte werden Menu, SubMenu und MapsLogo so geschrieben.
            } else if ( is_page("map") ) {
                style_tmp.innerHTML = style.innerHTML.replace(/#m/gi, "Menu"); style.innerHTML = style_tmp.innerHTML;
                style_tmp.innerHTML = style.innerHTML.replace(/#sm/gi, "SubMenu"); style.innerHTML = style_tmp.innerHTML;
                style_tmp.innerHTML = style.innerHTML.replace(/#l/gi, ".MapsLogo"); style.innerHTML = style_tmp.innerHTML;
            // Im alten Seiten Design werden Menu, SubMenu und Logo so geschrieben.
            } else {
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
            // Neues Logo aufbauen.
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

// New Width (Die Menüweite wird bei Change Header Layout gesetzt.).
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
                css += ".UserSuppliedContent {max-width: unset;}";

                // Besonderheiten:
                if (!is_page("cache_listing") ) {
                    css += ".UserSuppliedContent {width: " + (new_width - 200) + "px;}";
                }
                if (is_page("cache_listing") ) {
                    css += ".span-9 {width: " + (new_width - 300 - 270 - 13 - 13 - 10) + "px !important;}";
                } else if ( document.location.href.match(/\/my\/statistics\.aspx/) ||
                            ( document.location.href.match(/\/\/www\.geocaching\.com\/profile\//) &&
                              document.getElementById("ctl00_ContentBody_ProfilePanel1_lnkStatistics") &&
                              document.getElementById("ctl00_ContentBody_ProfilePanel1_lnkStatistics").className == "Active" ) ) {
                    css += ".span-9 {width: " + ((new_width - 280) / 2) + "px !important; margin-right: 30px;} .last {margin-right: 0px;}";
                    css += ".StatsTable {width: " + (new_width - 250) + "px !important;}";
                } else if ( document.location.href.match(/\/\/www\.geocaching\.com\/profile\//) ) {
                    if ( document.getElementById("ctl00_ContentBody_ProfilePanel1_lnkCollectibles") &&
                         document.getElementById("ctl00_ContentBody_ProfilePanel1_lnkCollectibles").className == "Active" ) {
                        css += ".span-9 {width: " + ((new_width - 220) / 2) + "px !important;} .prepend-1 {padding-left: 10px;}";
                    } else {
                        css += ".span-9 {width: " + ((new_width - 250) / 2) + "px !important;}";
                        css += ".StatsTable {width: " + (new_width - 250 - 30) + "px !important;}";
                    }
                }
            }
            appendCssStyle( css );
        }
    } catch (e) {
        gclh_error("new width", e);
    }

// Remove gc.com Links in Navigation.
    try {
        if ( document.getElementsByClassName("Menu").length > 0 ) {
            var liste = document.getElementsByClassName("Menu")[0];
            var links = $('ul.Menu a');
        } else if ( document.getElementsByClassName("menu").length > 0 ) {
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

// Bookmarks on top.
    try {
        if ( settings_bookmarks_on_top ) {
            // Bei Labs Caches gibt es kein Menu, Menu aufbauen. Nur wenn Change Header Layout aktiviert ist.
            if ( is_page("labs") && settings_change_header_layout ) {
                if ( $('.profile-panel')[0] ) {
                    var mainMenu = document.createElement("ul");
                    mainMenu.setAttribute("class", "Menu");
                    $('.profile-panel')[0].parentNode.insertBefore(mainMenu, $('.profile-panel')[0]);
                    css = buildCoreCss();
                    appendCssStyle( css );
                }
            // Bei Karten gibt es kein Menu, Menu aufbauen. Nur wenn Change Header Layout aktiviert ist.
            } else if ( is_page("map") && settings_change_header_layout ) {
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
            if (document.getElementsByClassName("Menu").length > 0) var nav_list = document.getElementsByClassName("Menu")[0];
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

            // Search field.
            if (settings_bookmarks_search) {
                var code = "function gclh_search_logs(){";
                code += "  var search = document.getElementById('navi_search').value.trim();";
                code += "  if(search.match(/^GC[A-Z0-9]{1,10}\\b/i) || search.match(/^TB[A-Z0-9]{1,10}\\b/i)) document.location.href = 'http://coord.info/'+search;";
                code += "  else if(search.match(/^[A-Z0-9]{6}\\b$/i)) document.location.href = 'https://www.geocaching.com/track/details.aspx?tracker='+search;";
                code += "  else document.location.href = 'https://www.geocaching.com/seek/nearest.aspx?navi_search='+search;";
                code += "}";

                var script = document.createElement("script");
                script.innerHTML = code;
                document.getElementsByTagName("body")[0].appendChild(script);

                var searchfield = "<li><input onKeyDown='if(event.keyCode==13) { gclh_search_logs(); return false; }' type='text' size='6' name='navi_search' id='navi_search' style='padding: 1px; font-weight: bold; font-family: sans-serif; border: 2px solid #778555; border-radius: 7px 7px 7px 7px; -moz-border-radius: 7px; -khtml-border-radius: 7px; background-color:#d8cd9d' value='" + settings_bookmarks_search_default + "'></li>";
                if ( is_page("labs") ) $(".Menu").append(searchfield);
                else $(".Menu, .menu").append(searchfield);
            }

            // Chrome menu hover fix.
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
    // Hover aufbauen im Menü. (Das muss ganz hinten in der Verarbeitung aufgebaut werden.)
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

// Bookmark-Liste im Profil, Linklist on Profile.
    if (settings_bookmarks_show && document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\//) && document.getElementById("ctl00_ContentBody_WidgetMiniProfile1_LoggedInPanel")) {
        try {
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
        } catch (e) {
            gclh_error("Linklist in Profile", e);
        }
    }

// Bezeichnung des Ignore Links durch Stop Ignoring ersetzen, wenn der Cache bereits auf der Ignore Liste steht.
    if ( is_page("cache_listing") && settings_show_remove_ignoring_link ) {
        // Bookmark Listen Bereiche besorgen und verarbeiten.
        if ( document.getElementsByClassName("BookmarkList").length > 0 ) {
            try {
                var listenBereiche = document.getElementsByClassName("BookmarkList");
                for (var i = 0; i < listenBereiche.length; i++) {
                    // Bookmark Listen besorgen, in denen der Cache gelistet ist, und verarbeiten.
                    var listen = listenBereiche[i].getElementsByTagName("a");
                    for (var j = 0; (j+1) < listen.length; j++) {
                        // Wenn es sich um Ignore Bookmark Liste des Users handelt. (Zugehöriger User steht direkt im Anschluss an die Bookmark Liste.)
                        if ( ( listen[j].href.match(/geocaching\.com\/bookmarks\/view\.aspx\?guid=/) ) &&
                             ( listen[j].text == "Ignore List" ) &&                                          // Die heißt auch in anderen Sprachen so.
                             ( listen[j+1].href.match(/geocaching\.com\/profile\/\?guid=/) ) &&
                             ( listen[j+1].text == $('.li-user-info').last().children().first().text() ) ) {
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
            } catch (e) {
                gclh_error("stop ignoring", e);
            }
        }
    }

// Wenn Warnmeldung über Down Time ... vorhanden ist, prüfen, ob sie identisch ist mit der bereits gesicherten, gegebenenfalls verbergen
// bzw. Button erzeugen zum Verbergen.
    if ( settings_hide_warning_message ) {
        if ( $('.WarningMessage')[0] ) {
            try {
                var content = '"' + $('.WarningMessage')[0].innerHTML + '"';
                if ( content == getValue( "warningMessageContent" ) ) {
                    // Mouse Events vorbereiten für Warnmeldung temporär anzuzeigen und wieder zu verbergen.
                    warnMessagePrepareMouseEvents();
                } else {
                    // Button in der Warnmeldung aufbauen (hoffe ich), um Meldung das erste Mal zu verbergen.
                    var div = document.createElement("div");
                    div.setAttribute("class", "GoAwayWarningMessage");
                    div.setAttribute("title", "Go away message");
                    div.setAttribute("style", "float: right; width: 70px; color: rgb(255, 255, 255); box-sizing: border-box; border: 2px solid rgb(255, 255, 255); opacity: 0.7; cursor: pointer; border-radius: 3px; margin-right: 2px; margin-top: 2px; text-align: center;");
                    div.appendChild(document.createTextNode("Go away"));
                    div.addEventListener("click", warnMessageHideAndSave, false);
                    $('.WarningMessage')[0].parentNode.insertBefore(div, $('.WarningMessage')[0]);
                }
            } catch (e) {
                gclh_error("Hide Warning Message", e);
            }
        }
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
    if ( settings_map_overview_build && is_page("cache_listing") && document.getElementById("ctl00_ContentBody_detailWidget") ) {
        try {
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
        } catch (e) {
            gclh_error("build map overview", e);
        }
    }
    // Url und Zoomwert für die Überblicks Karte aufbauen.
    function buildMapValues( zoom_value ) {
        var coords = new Array("", "");
        var gc_type = "";

        if ( zoom_value < 1 ) zoom_value = 1;
        if ( zoom_value > 19 ) zoom_value = 19;

        if ( document.getElementById('uxLatLon') ) var coords = toDec(document.getElementById("uxLatLon").innerHTML);
        if ( $(".cacheImage").find("img").attr("src") ) {
            var src_arr = $(".cacheImage").find("img").attr("src").split("/");
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

// Aplly Search Field in Navigation.
    if ( document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/nearest\.aspx\?navi_search=/) ) {
        try {
            var matches = document.location.href.match(/\?navi_search=(.*)/);
            if (matches) {
                document.getElementById("ctl00_ContentBody_LocationPanel1_OriginText").value = urldecode(matches[1]).replace(/%20/g, " ");

                function click_search() {
                    document.getElementById("ctl00_ContentBody_LocationPanel1_btnLocale").click();
                }
                window.addEventListener("load", click_search, false);
            }
        } catch (e) {
            gclh_error("Apply the Search", e);
        }
    }

// Show Favourite percentage.
    if (settings_show_fav_percentage && is_page("cache_listing")) {
        try {
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
                        setTimeout( function () { gclh_load_score( waitCount ); }, 100);
                    } else return;
                }
            }
            gclh_load_score( 0 );
        } catch (e) {
            gclh_error("Show Favourite percentage", e);
        }
    }

// Show Real Owner.
    if (is_page("cache_listing") && document.getElementById("ctl00_ContentBody_mcd1")) {
        try {
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
        } catch (e) {
            gclh_error("Show Real Owner", e);
        }
    }

// Highlight related web page link.
    if (is_page("cache_listing") && document.getElementById("ctl00_ContentBody_uxCacheUrl")) {
        try {
            var lnk = document.getElementById("ctl00_ContentBody_uxCacheUrl");

            var html = "<fieldset class=\"DisclaimerWidget\">";
            html += "  <legend class=\"warning\">Please note</legend>";
            html += "  <p class=\"NoBottomSpacing\">";
            html += lnk.parentNode.innerHTML;
            html += "  </p>";
            html += "</fieldset>";

            lnk.parentNode.innerHTML = html;
        } catch (e) {
            gclh_error("Highlight Related Web page", e);
        }
    }

// Show other Coord-Formats in Listing.
    if (is_page("cache_listing") && document.getElementById('uxLatLon')) {
        try {
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
        } catch (e) {
            gclh_error("Show other coord-formats", e);
        }
    }

// Show other Coord-Formats on print-page.
    if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/cdpf\.aspx/)) {
        try {
            var box = document.getElementsByClassName("UTM Meta")[0];
            var coords = document.getElementsByClassName("LatLong Meta")[0];
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
        } catch (e) {
            gclh_error("Show other coord-formats print-page", e);
        }
    }

// Show Map-It button at Listing.
    if (is_page("cache_listing") && document.getElementById('uxLatLon')) {
        try {
            var coords = toDec(document.getElementById("uxLatLon").innerHTML);
            var link;
            if (document.getElementById("uxLatLonLink") != null) { //If server deliver userDefinedCoords.status="fail", then link will be null
                link = document.getElementById("uxLatLonLink").parentNode;
            } else {
                link = document.getElementById("uxLatLon").parentNode;
            }
            var a = document.createElement("a");
            var small = document.createElement("small");
            a.setAttribute("href", map_url + "?ll=" + coords[0] + "," + coords[1]);
            a.appendChild(document.createTextNode("Map this Location"));
            small.appendChild(document.createTextNode(" - "));
            small.appendChild(a);
            link.appendChild(small);
        } catch (e) {
            gclh_error("Map It Button", e);
        }
    }

// Show the latest logs symbols in cache listings.
    if ( is_page("cache_listing") && settings_show_latest_logs_symbols && settings_load_logs_with_gclh ) {
        try {
            function showLatestLogsSymbols( waitCount ) {
                var logs = $(('#cache_logs_table', '#cache_logs_table2')).find('tbody tr.log-row:not(.display_none)');
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
                        setTimeout( function () { showLatestLogsSymbols( waitCount ); }, 500);
                    } else return;
                }
            }
            showLatestLogsSymbols( 0 );
        } catch (e) {
            gclh_error("Show the latest logs symbols", e);
        }
    }

// Set default value for new pocket queries and handle warning.
    // Helper function marks two PQ options, which are in rejection.
    function markPqOptionsAreInRejection( idOption1, idOption2 ) {
        var status = false;
        if ( $("#"+idOption1).is(':checked') && $("#"+idOption2).is(':checked') ) {
            $("label[for='"+idOption1+"']").css('background-color','#ffff00');
            $("label[for='"+idOption2+"']").css('background-color','#ffff00');
            $("label[for='"+idOption1+"']").css('color','#ff0000');
            $("label[for='"+idOption2+"']").css('color','#ff0000');
            status = true;
        } else {
            $("label[for='"+idOption1+"']").css('background-color','#ffffff');
            $("label[for='"+idOption2+"']").css('background-color','#ffffff');
            $("label[for='"+idOption1+"']").css('color','#000000');
            $("label[for='"+idOption2+"']").css('color','#000000');
        }
        return status;
    }

    // Helper function to find PQ options, which are in rejection.
    function verifyPqOptions() {
        var status = false;

        status = status | markPqOptionsAreInRejection( "ctl00_ContentBody_cbOptions_0", "ctl00_ContentBody_cbOptions_1" ); // I haven't found / I have found
        status = status | markPqOptionsAreInRejection( "ctl00_ContentBody_cbOptions_2", "ctl00_ContentBody_cbOptions_3" ); // I don't vs. own	I own
        status = status | markPqOptionsAreInRejection( "ctl00_ContentBody_cbOptions_4", "ctl00_ContentBody_cbOptions_5" ); // Are available to all users	vs. Are for members only
        status = status | markPqOptionsAreInRejection( "ctl00_ContentBody_cbOptions_8", "ctl00_ContentBody_cbOptions_9" ); // Found in the last 7 days  vs.	Have not been found
        status = status | markPqOptionsAreInRejection( "ctl00_ContentBody_cbOptions_12", "ctl00_ContentBody_cbOptions_13" ); // Is Disabled  vs.	Is Enabled

        if ( status ) {
            $("#warning").show();
        } else {
            $("#warning").hide();
        }
    }

    // Set default value ONLY for new pocket queries.
    if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/pocket\/gcquery\.aspx/)) {
        try {
            // Mark all elements for an easier access.
            var pqelements = [
                { index: 0, id: "gclhpq_QueryName", child: "#ctl00_ContentBody_tbName" },
                { index: 1, id: "gclhpq_DaysOfGenerate", child: "#ctl00_ContentBody_cbDays" },
                { index: 2, id: "gclhpq_CachesTotal", child: "#ctl00_ContentBody_tbResults" },
                { index: 3, id: "gclhpq_AnyType", child: "#ctl00_ContentBody_rbTypeAny" },
                { index: 4, id: "gclhpq_Types", child: "#ctl00_ContentBody_cbTaxonomy" },
                { index: 5, id: "gclhpq_AnyContainer", child: "#ctl00_ContentBody_rbContainerAny" },
                { index: 6, id: "gclhpq_Container", child: "#ctl00_ContentBody_rbContainerSelect" },
                { index: 7, id: "gclhpq_Options", child: "#ctl00_ContentBody_cbOptions" },
                { index: 8, id: "gclhpq_", child: "" }, // And
                { index: 9, id: "gclhpq_Difficulty", child: "#ctl00_ContentBody_cbDifficulty" },
                { index: 10, id: "gclhpq_Terrain", child: "#ctl00_ContentBody_cbTerrain" },
                { index: 11, id: "gclhpq_Within", child: "#ctl00_ContentBody_rbNone" },
                { index: 12, id: "gclhpq_Origin", child: "#ctl00_ContentBody_rbOriginNone" },
                { index: 13, id: "gclhpq_Radius", child: "#ctl00_ContentBody_tbRadius" },
                { index: 14, id: "gclhpq_PlacedDuring", child: "#ctl00_ContentBody_rbPlacedNone" },
                { index: 15, id: "gclhpq_AttributesIncludes", child: "#ctl00_ContentBody_ctlAttrInclude_dtlAttributeIcons" },
                { index: 16, id: "gclhpq_AttributesExcludes", child: "#ctl00_ContentBody_ctlAttrExclude_dtlAttributeIcons" },
                { index: 17, id: "gclhpq_Output", child: ".PQOutputList" },
                { index: 18, id: "gclhpq_SubmitDelete", child: "#ctl00_ContentBody_btnSubmit" },
            ];

            $( "#ctl00_ContentBody_QueryPanel > *[class!='Validation']" ).each(function( index ) {
                for ( var i=0; i<pqelements.length; i++) {
                    if ( pqelements[i].child.length > 0 ) {
                        if ( $(this).find(pqelements[i].child).length > 0 ) {
                            // console.log( "index: " + index + " " + pqelements[i].child + " -> " + pqelements[i].id );
                            $(this).attr('id',pqelements[i].id);
                            break;
                        }
                    }
                }
            });
            $("#gclhpq_Options").next().attr('id',"gclhpq_And");

            if ( ( $("p.Success").length<=0 ) && (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/pocket\/gcquery\.aspx$/) ||
                document.location.href.match(/^https?:\/\/www\.geocaching\.com\/pocket\/gcquery\.aspx\/ll=/)) ) {

                if ( settings_pq_set_cachestotal ) {
                    $("#ctl00_ContentBody_tbResults").val(settings_pq_cachestotal);
                }
                if ( settings_pq_option_ihaventfound ) {
                    $("#ctl00_ContentBody_cbOptions_0").prop('checked', true);
                    $("#ctl00_ContentBody_cbOptions_1").prop('checked', false); // avoid conflicts
                }
                if ( settings_pq_option_idontown ) {
                    $("#ctl00_ContentBody_cbOptions_2").prop('checked', true);
                    $("#ctl00_ContentBody_cbOptions_3").prop('checked', false); // avoid conflicts
                }
                if ( settings_pq_option_ignorelist ) {
                    $("#ctl00_ContentBody_cbOptions_6").prop('checked', true);
                }
                if ( settings_pq_option_isenabled ) {
                    $("#ctl00_ContentBody_cbOptions_13").prop('checked', true);
                    $("#ctl00_ContentBody_cbOptions_12").prop('checked', false); // avoid conflicts
                }
                if ( settings_pq_option_filename ) {
                    $("#ctl00_ContentBody_cbIncludePQNameInFileName").prop('checked', true);
                }
                if ( settings_pq_set_difficulty ) {
                    $("#ctl00_ContentBody_cbDifficulty").prop('checked', true);
                    $("#ctl00_ContentBody_ddDifficulty").val( settings_pq_difficulty );
                    $("#ctl00_ContentBody_ddDifficultyScore").val( settings_pq_difficulty_score );
                }
                if ( settings_pq_set_terrain ) {
                    $("#ctl00_ContentBody_cbTerrain").prop('checked', true);
                    $("#ctl00_ContentBody_ddTerrain").val( settings_pq_terrain );
                    $("#ctl00_ContentBody_ddTerrainScore").val( settings_pq_terrain_score );
                }
                if ( settings_pq_automatically_day ) {
                    var servertime = $("#gclhpq_DaysOfGenerate").find("legend").text();
                    if ( servertime.match(/.*Sunday.*/) ) {
                        $("#ctl00_ContentBody_cbDays_0").prop('checked', true);
                    } else if ( servertime.match(/.*Monday.*/) ) {
                        $("#ctl00_ContentBody_cbDays_1").prop('checked', true);
                    } else if ( servertime.match(/.*Tuesday.*/) ) {
                        $("#ctl00_ContentBody_cbDays_2").prop('checked', true);
                    } else if ( servertime.match(/.*Wednesday.*/) ) {
                        $("#ctl00_ContentBody_cbDays_3").prop('checked', true);
                    } else if ( servertime.match(/.*Thursday.*/) ) {
                        $("#ctl00_ContentBody_cbDays_4").prop('checked', true);
                    } else if ( servertime.match(/.*Friday.*/) ) {
                        $("#ctl00_ContentBody_cbDays_5").prop('checked', true);
                    } else if ( servertime.match(/.*Saturday.*/) ) {
                        $("#ctl00_ContentBody_cbDays_6").prop('checked', true);
                    } else {
                        // do nothing
                    }
                }
            }
            if ( settings_pq_warning ) {
                $("#ctl00_ContentBody_cbOptions").after("<div id='warning' style='display: none; border: 1px solid #dfdf80; background-color: #ffffa5; padding: 10px;'><div style='float: left'><img src='https://www.geocaching.com/play/Content/ui-icons/icons/global/attention.svg'></div><div>&nbsp;&nbsp;One or more options are in conflict and creates an empty result set. Please change your selection.</div></div>");
                for ( var i=0; i<=13; i++ ) {
                    $("#ctl00_ContentBody_cbOptions_"+i ).change( verifyPqOptions );
                }
                verifyPqOptions();
            }
        } catch (e) {
            gclh_error("pq set default value and warning", e);
        }
    }

// Map on create pocketQuery-page.
    if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/pocket\/gcquery\.aspx/)) {
        try {
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
        } catch (e) {
            gclh_error("map on create pocketQuery page", e);
        }
    }

// Name for PocketQuery from Bookmark.
    if ((document.location.href.match(/^https?:\/\/www\.geocaching\.com\/pocket\/bmquery\.aspx/)) && document.getElementById("ctl00_ContentBody_lnkListName")) {
        try {
            if ( document.getElementById('ctl00_ContentBody_tbName').value == "" ) {
                document.getElementById('ctl00_ContentBody_tbName').value = document.getElementById("ctl00_ContentBody_lnkListName").innerHTML;
            }
            document.getElementById('ctl00_ContentBody_cbIncludePQNameInFileName').checked = true;
        } catch (e) {
            gclh_error("PQ-Name from Bookmark", e);
        }
    }

// Show refresh button for PocketQuery Page.
    if ((document.location.href.match(/^https?:\/\/www\.geocaching\.com\/pocket/)) && document.getElementById("uxCreateNewPQ")) {
        try {
            var p = document.createElement("p");
            p.innerHTML = "<a href='" + http + "://www.geocaching.com/pocket/default.aspx' title='Refresh Page'>Refresh Page</a>";
            document.getElementById('uxCreateNewPQ').parentNode.parentNode.parentNode.appendChild(p);
        } catch (e) {
            gclh_error("Refresh button on PQ-Page", e);
        }
    }

// Highlight column of current day on PocketQuery Page.
    if ((document.location.href.match(/^https?:\/\/www\.geocaching\.com\/pocket/)) && document.getElementById("ActivePQs")) {
        try {
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
        } catch (e) {
            gclh_error("Highlight column on PQ-Page", e);
        }
    }

// Fixed header for PocketQuery.
    if (settings_fixed_pq_header && document.location.href.match(/^https?:\/\/www\.geocaching\.com\/pocket/) && document.getElementById("pqRepeater")) {
        try {
            // Scrolify based on http://stackoverflow.com/questions/673153/html-table-with-fixed-headers .
            function scrolify(tblAsJQueryObject, height) {
                var oTbl = window.$(tblAsJQueryObject);
                var oTblDiv = window.$("<div/>");
                oTblDiv.css('height', height);
                oTblDiv.css('overflow-y', 'auto');
                oTblDiv.css("margin-bottom", oTbl.css("margin-bottom"));
                oTbl.css("margin-bottom", "0px");
                oTbl.wrap(oTblDiv);

                // Save original width.
                oTbl.attr("data-item-original-width", oTbl.width());
                oTbl.find('thead tr td').each(function () {
                    window.$(this).attr("data-item-original-width", (unsafeWindow || window).$(this).width());
                });
                oTbl.find('tbody tr:eq(0) td').each(function () {
                    window.$(this).attr("data-item-original-width", (unsafeWindow || window).$(this).width());
                });

                // Clone the original table.
                var newTbl = oTbl.clone();

                // Remove table header from original table.
                oTbl.find('thead tr').remove();
                // Remove table body from new table.
                newTbl.find('tbody tr').remove();

                oTbl.parent().before(newTbl);
                newTbl.wrap("<div/>");

                // Replace ORIGINAL COLUMN width.
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
            } else {
                scrolify(unsafeWindow.$('#pqRepeater'), 300);
            }

            unsafeWindow.$('#ActivePQs').css("padding-right", "0px");
        } catch (e) {
            gclh_error("Fixed header for PocketQuery", e);
        }
    }

// Sum up all FP and BM entries on public profile pages.
    if (is_page("publicProfile")) {
        try {
            $('#ctl00_ContentBody_ProfilePanel1_pnlBookmarks h3').each(function (i, e) {
                $(e).text($(e).text() + ' (' + $(e).next().find('tbody tr').length + ')');
            });
        } catch (e) {
            gclh_error("Sum up all FP and BM entries on public profile pages", e);
        }
    }

// Hide Facebook.
    if (settings_hide_facebook) {
        if (document.getElementById('ctl00_uxSignIn')) {
            try {
                document.getElementById('ctl00_uxSignIn').parentNode.style.display = "none";
            } catch (e) {
                gclh_error("Hide Facebook1", e);
            }
        }
        if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/login(.*)/) && document.getElementById("ctl00_ContentBody_LoginPanel")) {
            try {
                var loginpanelfb = document.getElementsByClassName("LoginWithFacebook")[0];
                loginpanelfb.parentNode.removeChild(loginpanelfb);
            } catch (e) {
                gclh_error("Hide Facebook2", e);
            }
        }
    }

// Hide Socialshare.
    if (settings_hide_socialshare && document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/log\.aspx?(.*)/) && document.getElementById('sharing_container')) {
        try {
            var socialshare = document.getElementById('sharing_container');
            socialshare.style.display = "none";
        } catch (e) {
            gclh_error("Hide SocialShare1", e);
        }
    }
    if (settings_hide_socialshare && document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/log\.aspx?(.*)/) && document.getElementById('uxSocialSharing')) {
        try {
            var uxSocialSharing = document.getElementById('uxSocialSharing');
            uxSocialSharing.style.display = "none";
        } catch (e) {
            gclh_error("Hide SocialShare2", e);
        }
    }

// Activate fancybox for pictures in the description.
    try {
        if (is_page("cache_listing") && typeof unsafeWindow.$.fancybox != "undefined") {
            unsafeWindow.$('a[rel="lightbox"]').fancybox();
        }
    } catch (e) {
        gclh_error("Activate fancybox", e);
    }

// Hide Disclaimer.
    if (settings_hide_disclaimer && is_page("cache_listing")) {
        try {
            var disc = document.getElementsByClassName('Note Disclaimer')[0]; // New Listing design
            if (disc) {
                disc.parentNode.removeChild(disc);
            } else {
                var disc = document.getElementsByClassName('DisclaimerWidget')[0];
                if (disc) {
                    disc.parentNode.removeChild(disc);
                }
            }
        } catch (e) {
            gclh_error("Hide Disclaimer1", e);
        }
    }
    if (settings_hide_disclaimer && document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/cdpf\.aspx/)) {
        try {
            var disc = document.getElementsByClassName('TermsWidget no-print')[0];
            if (disc) {
                disc.parentNode.removeChild(disc);
            }
        } catch (e) {
            gclh_error("Hide Disclaimer2", e);
        }
    }

// Hide on print-page.
    if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/cdpf\.aspx/)) {
        try {
            document.getElementById("pnlDisplay").removeChild(document.getElementById("Footer"));
        } catch (e) {
            gclh_error("Hide on print-page", e);
        }
    }

// Remove paragraph containing the link to the advertisement instructions (not the advertisements itself!).
    if (settings_hide_advert_link) {
        try {
            var links = document.getElementsByTagName('a');
            for (var i = 0; i < links.length; i++) {
                if (links[i].href.indexOf('advertising.aspx') > 0) {
                    var del = links[i];
                    if ( is_page("messagecenter") || document.location.href.match(/^https:\/\/www\.geocaching\.com\/account\/lists/) ) {
                        while (del.parentNode != null && (del.parentNode.nodeName != 'ASIDE')) {
                           del = del.parentNode;
                        }
                    } else {
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
        } catch (e) {
            gclh_error("Hide Advert-Link", e);
        }
    }

// Improve calendar-Link in Events.
    if (is_page("cache_listing") && document.getElementById("calLinks")) {
        try {
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
        } catch (e) {
            gclh_error("improve calendar-link", e);
        }
    }

// Remove "Warning! Spoilers may be included in the descriptions or links.".
    if (settings_hide_spoilerwarning && is_page("cache_listing")) {
        try {
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
        } catch (e) {
            gclh_error("Hide spoilerwarning", e);
        }
    }

// Hide Cache Notes.
    if (settings_hide_cache_notes && is_page("cache_listing")) {
        try {
            var disc = document.getElementsByClassName('Note PersonalCacheNote')[0]; // New Listing design
            if (disc) {
                disc.parentNode.removeChild(disc);
            } else {
                var disc = document.getElementsByClassName('NotesWidget')[0];
                if (disc) {
                    disc.parentNode.removeChild(disc);
                }
            }
        } catch (e) {
            gclh_error("Hide Cache Notes (COMPLETE)", e);
        }
    }

// Hide/Show Cache Notes.
    if (settings_hide_empty_cache_notes && !settings_hide_cache_notes && is_page("cache_listing")) {
        try {
            var box = document.getElementsByClassName('Note PersonalCacheNote')[0]; // New Listing design
            if (!box) box = document.getElementsByClassName('NotesWidget')[0];
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

                var notes = document.getElementsByClassName('Note PersonalCacheNote')[0]; // New Listing design
                if (!notes) notes = document.getElementsByClassName('NotesWidget')[0];
                var notesText = document.getElementById("cache_note").innerHTML;
                if (notesText != null && (notesText == "" || notesText == "Click to enter a note" || notesText == "Klicken zum Eingeben einer Notiz")) {
                    notes.style.display = "none";
                    if ( document.getElementById('show_hide_personal_cache_notes') ) {
                        document.getElementById('show_hide_personal_cache_notes').innerHTML = 'Show ' + description;
                    }
                }
            }
        } catch (e) {
            gclh_error("Hide Cache Notes", e);
        }
    }

// Hide Hint.
    if (settings_hide_hint && is_page("cache_listing")) {
        try {
            // Replace hint by a link which shows the hint dynamically.
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

                    // Remove hint description.
                    var decryptKey = document.getElementById('dk');
                    if (decryptKey) {
                        decryptKey.parentNode.removeChild(decryptKey);
                    }
                }
            }
        } catch (e) {
            gclh_error("Hide Hint", e);
        }
    }

// Show disabled/archived caches with strikeout in title.
    if (settings_strike_archived && is_page("cache_listing")) {
        try {
            var warnings = $('ul.OldWarning > li');
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
        } catch (e) {
            gclh_error("Strike Archived", e);
        }
    }

// Highlight Usercoords.
    if ( is_page("cache_listing") ) {
        try {
            var css = (settings_highlight_usercoords ? ".myLatLon{ color: #FF0000; " : ".myLatLon{ color: unset; ")
                    + (settings_highlight_usercoords_bb ? "border-bottom: 2px solid #999; " : "border-bottom: unset; ")
                    + (settings_highlight_usercoords_it ? "font-style: italic; }" : "font-style: unset; }");
            appendCssStyle(css);
        } catch (e) {
            gclh_error("Highlight Usercoords", e);
        }
    }

// Decrypt Hint.
    if (settings_decrypt_hint && !settings_hide_hint && is_page("cache_listing")) {
        try {
            if (document.getElementById('ctl00_ContentBody_EncryptionKey')) {
                if (browser == "chrome") {
                    injectPageScript("(function(){ dht(); })()");
                } else {
                    unsafeWindow.dht(document.getElementById("ctl00_ContentBody_lnkDH"));
                }

                // Remove hint description.
                var decryptKey = document.getElementById('dk');
                if (decryptKey) {
                    decryptKey.parentNode.removeChild(decryptKey);
                }
            }
        } catch (e) {
            gclh_error("Decrypt Hint1", e);
        }
    }
    if (settings_decrypt_hint && document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/cdpf\.aspx/)) {
        try {
            if (document.getElementById('uxDecryptedHint')) document.getElementById('uxDecryptedHint').style.display = 'none';
            if (document.getElementById('uxEncryptedHint')) document.getElementById('uxEncryptedHint').style.display = '';
        } catch (e) {
            gclh_error("Decrypt cdpf Hint2", e);
        }
    }

// BBCode helper function.
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

// Show Smilies & BBCode --- http://www.cachewiki.de/wiki/Formatierung.
    if (settings_show_bbcode && (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/log\.aspx\?(id|guid|ID|wp|LUID|PLogGuid)\=/) || document.location.href.match(/^https?:\/\/www\.geocaching\.com\/track\/log\.aspx\?(id|wid|guid|ID|LUID|PLogGuid)\=/)) && document.getElementById('litDescrCharCount')) {
        try {
            // Get finds to replace #found# variable.
            finds = get_my_finds();
            [ aDate, aTime, aDateTime ] = getDateTime();
            var me = $('.li-user-info').last().children().first().text();
            [ aGCTBName, aGCTBLink, aGCTBNameLink, aLogDate ] = getGCTBInfo();

            gclh_add_insert_fkt("ctl00_ContentBody_LogBookPanel1_uxLogInfo");

            var code = "function gclh_insert_from_div(id){";
            code += "  var finds = '" + finds + "';";
            code += "  var aDate = '" + aDate + "';";
            code += "  var aTime = '" + aTime + "';";
            code += "  var aDateTime = '" + aDateTime + "';";
            code += "  var me = '" + me + "';";
            code += "  var aGCTBName = '" + aGCTBName + "';";
            code += "  var aGCTBLink = '" + aGCTBLink + "';";
            code += "  var aGCTBNameLink = '" + aGCTBNameLink + "';";
            code += "  if ( document.getElementById('uxDateVisited') ) { var aLogDate = document.getElementById('uxDateVisited').value; }";
            code += "  var settings_replace_log_by_last_log = " + settings_replace_log_by_last_log + ";";
            code += "  var owner = document.getElementById('ctl00_ContentBody_LogBookPanel1_WaypointLink').nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerHTML;";
            code += "  var input = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo');";
            code += "  var inhalt = document.getElementById(id).innerHTML;";
            // 2 Zeilen von DieBatzen ausgeliehen, um "<" und ">" richtig darzustellen.
            code += "  var textarea = document.createElement('textarea');";
            code += "  var inhalt = $('<textarea>').html(inhalt).val();";
            code += "  inhalt = inhalt.replace(/\\&amp\\;/g,'&');";
            code += "  if(finds){";
            code += "    inhalt = inhalt.replace(/#found_no#/ig, finds);";
            code += "    finds++;";
            code += "    inhalt = inhalt.replace(/#found#/ig, finds);";
            code += "  }";
            code += "  if(aDate){inhalt = inhalt.replace(/#Date#/ig, aDate);}";
            code += "  if(aTime){inhalt = inhalt.replace(/#Time#/ig, aTime);}";
            code += "  if(aDateTime){inhalt = inhalt.replace(/#DateTime#/ig, aDateTime);}";
            code += "  if(me){inhalt = inhalt.replace(/#me#/ig, me);}";
            code += "  if(aGCTBName){inhalt = inhalt.replace(/#GCTBName#/ig, aGCTBName);}";
            code += "  if(aGCTBLink){inhalt = inhalt.replace(/#GCTBLink#/ig, aGCTBLink);}";
            code += "  if(aGCTBNameLink){inhalt = inhalt.replace(/#GCTBNameLink#/ig, aGCTBNameLink);}";
            code += "  if(aLogDate){inhalt = inhalt.replace(/#LogDate#/ig, aLogDate);}";
            code += "  if(owner){inhalt = inhalt.replace(/#owner#/ig, owner);}";
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
        } catch (e) {
            gclh_error("Show Smilies & BBCode", e);
        }
    }

// Maxlength of Logtext and unsaved warning.
    if ((document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/log\.aspx\?(id|guid|ID|wp|LUID|PLogGuid)\=/) || document.location.href.match(/^https?:\/\/www\.geocaching\.com\/track\/log\.aspx\?(id|wid|guid|ID|LUID|PLogGuid)\=/)) && document.getElementById('litDescrCharCount')) {
        try {
            var changed = false;

            function limitLogText(limitField) {
                changed = true; // Logtext hat sich geaendert - Warnung beim Seite verlassen
                // Aus gc.com Funktion "checkLogInfoLength".
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

            // Meldung bei ungespeichertem Log.
            window.onbeforeunload = function () {
                if (changed) {
                    return "You have changed a log and haven't saved it yet - Do you want to leave this page and lose your changes?"; // Text wird nicht angezeigt bei FF sondern deren default
                }
            };
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
        } catch (e) {
            gclh_error("Maxlength of Logtext and unsaved warning", e);
        }
    }

// Show Eventday beside Date.
    if (settings_show_eventday && is_page("cache_listing") && document.getElementById('cacheDetails') && document.getElementById('cacheDetails').getElementsByTagName("img")[0].src.match(/.*\/images\/WptTypes\/(6|453|13|7005).gif/)) { //Event, MegaEvent, Cito, GigaEvent
        if (document.getElementById('cacheDetails').getElementsByTagName("span")) {
            try {
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
                    case "dd.MM.yyyy":
                        var match = datetxt.match(/([0-9]{1,2})\.([0-9]{1,2})\.([0-9]{4})/);
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
            } catch (e) {
                gclh_error("Show DoW on Events", e);
            }
        }
    }

// Show eMail-Link and Show Message-Center-Link beside Username. (Nicht in den Logs zum Cache Listing, das erfolgt später bei Log-Template.)
    show_mail_and_message_icon:
    try {
        // Cache, TB und Aktiv User Infos ermitteln.
        [ global_gc, global_tb, global_code, global_name, global_link, global_activ_username, global_founds, global_date, global_time, global_dateTime] = getGcTbUserInfo();

        // Nicht auf der Mail oder Message Seite selbst ausführen.
        if ( document.getElementById("ctl00_ContentBody_SendMessagePanel1_SendEmailPanel") ||
             document.getElementById("messageArea")                                           ) {
            break show_mail_and_message_icon;
        }

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
            // Restliche Seiten:
            } else {
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
        var g_link = "";
        var g_founds = "";
        var g_date = "";
        var g_time = "";
        var g_dateTime = "";
        var g_activ_username = "";

        if ( ( settings_show_mail || settings_show_message ) ) {
            // Im Cache Listing: Cache Name und Cache Code ermitteln.
            if ( document.getElementById('ctl00_ContentBody_CacheName') ) {
                g_gc = true;
                g_name = document.getElementById('ctl00_ContentBody_CacheName').innerHTML;
                if ( document.getElementById('ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode') ) {
                    g_code = document.getElementById('ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode').innerHTML;
                }
            // Im TB Listing: TB Name und TB Code ermitteln.
            } else if ( document.getElementById('ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode') ) {
                g_tb = true;
                g_code = document.getElementById('ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode').innerHTML;
                if ( document.getElementById('ctl00_ContentBody_lbHeading') ) {
                    g_name = document.getElementById('ctl00_ContentBody_lbHeading').innerHTML;
                }
            // Im Log view.
            } else if ( document.getElementById('ctl00_ContentBody_LogBookPanel1_lbLogText') ) {
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
            // Im Log post.
            } else if ( document.getElementById('ctl00_ContentBody_LogBookPanel1_WaypointLink') ) {
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

            // Code und Link zum Cache bzw. zum TB aufbauen.
            if ( g_code != "" ) {
                g_link = "(http://coord.info/" + g_code + ")";
                g_code = "(" + g_code + ")";
            }
            // Eigene Founds und aktuelles Datum, Zeit.
            g_founds = get_my_finds();
            [ g_date, g_time, g_dateTime ] = getDateTime();
            // Aktiven User Namen ermitteln.
            g_activ_username = $('.li-user-info').last().children().first().text();
        }
        return [ g_gc, g_tb, g_code, g_name, g_link, g_activ_username, g_founds, g_date, g_time, g_dateTime ];
    }
    // Message Icon und Mail Icon aufbauen.
    function buildSendIcons( b_side, b_username, b_art ) {
        if ( b_art == "per guid" ) {
            // guid prüfen.
            if ( guid == "" || guid == undefined ) return;
            if ( guid.match(/\#/) ) return;
            // Keine Verarbeitung für Stat Bar.
            if ( b_side.innerHTML.match(/https?:\/\/img\.geocaching\.com\/stats\/img\.aspx/) ) return;
        } else {
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

        // Message, Mail Template aufbauen.
        template = urlencode( buildSendTemplate().replace(/#Receiver#/ig, b_username) );

        // Message Icon erzeugen.
        if ( settings_show_message && b_art == "per guid" ) {
            var message_link = document.createElement("a");
            var message_img = document.createElement("img");
            message_img.setAttribute("style", "margin-left: 0px; margin-right: 0px");
            message_img.setAttribute("title", "Send a message to " + username_send);
            message_img.setAttribute("src", global_message_icon);
            message_link.appendChild(message_img);
            if ( settings_message_icon_new_win ) message_link.setAttribute("target", "_blank");
            message_link.setAttribute("href", http + "://www.geocaching.com/account/messagecenter?recipientId=" + guid + "&text=" + template);
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
            if ( settings_mail_icon_new_win ) mail_link.setAttribute("target", "_blank");
            if ( b_art == "per guid" ) {
                mail_link.setAttribute("href", http + "://www.geocaching.com/email/?guid=" + guid + "&text=" + template);
                b_side.parentNode.insertBefore(mail_link, b_side.nextSibling);
                b_side.parentNode.insertBefore(document.createTextNode(" "), b_side.nextSibling);
            } else {
                b_side.appendChild(document.createTextNode(" "));
                mail_link.setAttribute("href", http + "://www.geocaching.com/email/?u=" + urlencode(b_username) + "&text=" + template);
                b_side.appendChild(mail_link);
                b_side.appendChild(document.createTextNode(" "));
            }
        }
    }
    // Message, Mail Template aufbauen, bis auf Empfänger.
    function buildSendTemplate() {
        var template = getValue("settings_mail_signature", "");
        var trimIt = (template.length == template.trim().length);
        template = template.replace(/#Found#/ig, global_founds+1).replace(/#Found_no#/ig, global_founds).replace(/#Me#/ig, global_activ_username);
        template = template.replace(/#Date#/ig, global_date).replace(/#Time#/ig, global_time).replace(/#DateTime#/ig, global_dateTime);
        template = template.replace(/#GCTBName#/ig, global_name).replace(/#GCTBCode#/ig, global_code).replace(/#GCTBLink#/ig, global_link);
        if (trimIt) template = template.trim();
        return template;
    }

// Switch title-color to red, if cache is archived & rename the gallery-link to prevent destroying the layout on to many images ("view the " wegnehmen).
    if (is_page("cache_listing")) {
        try {
            if (document.getElementById("ctl00_ContentBody_uxGalleryImagesLink")) document.getElementById("ctl00_ContentBody_uxGalleryImagesLink").innerHTML = document.getElementById("ctl00_ContentBody_uxGalleryImagesLink").innerHTML.replace("View the ", "");
            var warnings = $('ul.OldWarning > li');
            for (var i = 0; i < warnings.length; i++) {
                if (warnings[i].innerHTML.match(/(archived|archiviert)/)) {
                    if (document.getElementById("ctl00_ContentBody_CacheName")) document.getElementById("ctl00_ContentBody_CacheName").parentNode.style.color = '#8C0B0B';
                    break;
                }
            }
        } catch (e) {
            gclh_error("Switch title-color", e);
        }
    }

// Improve Mail-Site.
    if (settings_show_mail && document.location.href.match(/^https?:\/\/www\.geocaching\.com\/email\//) && document.getElementById("ctl00_ContentBody_SendMessagePanel1_tbMessage")) {
        try {
            // Prevent deleting content.
            injectPageScriptFunction(function(){
                var oldClearSearch = clearSearch;
                clearSearch = function(obj) {
                    if (obj.id !== "ctl00_ContentBody_SendMessagePanel1_tbMessage"){
                        oldClearSearch(obj);
                    }
                };
            },"()");

            document.getElementById("ctl00_ContentBody_SendMessagePanel1_tbMessage").setAttribute("onfocus", "");

            // Default settings.
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

            // Grab mail template from URL.
            var matches = document.location.href.match(/&text=(.*)/);
            if (matches) {
                document.getElementById("ctl00_ContentBody_SendMessagePanel1_tbMessage").innerHTML = decodeURIComponent(matches[1]);
            // Build mail template.
            } else {
                template = buildSendTemplate().replace(/#Receiver#/ig, "");
                document.getElementById("ctl00_ContentBody_SendMessagePanel1_tbMessage").innerHTML = template;
            }
        } catch (e) {
            gclh_error("Improve E-Mail-Site", e);
        }
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
    if ( settings_show_message && is_page("messagecenter") && document.location.href.match(/&text=(.*)/) ) {
        try {
            var val = "";
            // Grab message template from URL.
            var matches = document.location.href.match(/&text=(.*)/);
            val = decodeURIComponent(matches[1]);

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
        } catch (e) {
            gclh_error("Improve Message Site", e);
        }
    }

// Add link to waypoint list and cache logs in cache detail navigation (sidebar) (issue #253).
    if ( is_page("cache_listing") ) {
        if ( getWaypointTable().length > 0 ) {
            $(".CacheDetailNavigation:first > ul:first").append('<li><a href="#ctl00_ContentBody_bottomSection">Go to Waypoint list</a></li>');
        }
        $("#cache_logs_container").prev("div").attr('id','logs_section');
        $(".CacheDetailNavigation:first > ul:first").append('<li><a href="#logs_section">Go to logs</a></li>');

        var css = "";
        css += '.CacheDetailNavigation a[href*="#ctl00_ContentBody_bottomSection"]{';
        css += "background-image:url(/images/icons/16/waypoints.png);";
        css += "}";
        css += '.CacheDetailNavigation a[href*="#logs_section"]{';
        css += "background-image:url(" + global_logs_icon + ");";
        css += "}";
        appendCssStyle( css );
    }

    // Returns a jQuery object of the waypoint list in a cache listing or the waypoint list.
    function getWaypointTable() {
        var tbl = $("#ctl00_ContentBody_Waypoints");
        if ( tbl.length<=0 ) {
            tbl = $("#ctl00_ContentBody_WaypointList");
        }
        return tbl;
    }

// Driving direction for every waypoint (issue #252).
    if ( settings_driving_direction_link && (
        is_page("cache_listing") ||
        document.location.href.match(/^https?:\/\/www\.geocaching\.com\/hide\/wptlist.aspx/) ) ) {

        try {
            var tbl = getWaypointTable();
            var length = tbl.find("tbody > tr").length;
            for ( var i=0; i<length/2; i++ ) {
                var row1st = tbl.find("tbody > tr").eq(i*2);

                var name = row1st.find("td:eq(5)").text().trim();
                var icon = row1st.find("td:eq(2) > img").attr('src');
                var cellCoordinates = row1st.find("td:eq(6)");
                var tmp_coords = toDec(cellCoordinates.text().trim());
                if ( ( !settings_driving_direction_parking_area || icon.match(/pkg.jpg/g) ) && typeof tmp_coords[0] !== 'undefined' && typeof tmp_coords[1] !== 'undefined') {
                    var link = "http://maps.google.com/maps?f=d&hl=en&saddr="+getValue("home_lat", 0)/10000000+","+getValue("home_lng", 0)/10000000+"%20(Home%20Location)&daddr=";
                    row1st.find("td:last").append('<a title="Driving Directions" href="'+link+tmp_coords[0]+","+tmp_coords[1]+" ("+name+')" target="_blank"><img src="/images/icons/16/directions.png"></a>');
                    // TODO: check if home_coords defined
                }
            }
        } catch( e ) {
            gclh_error( "Driving direction for Waypoints: ", e );
        }
    }

// Show button, which open Flopp's Map with all waypoints of a cache and open Flopp's Map.
// TODO: settings
    if ( is_page("cache_listing") ||
        document.location.href.match(/^https?:\/\/www\.geocaching\.com\/hide\/wptlist.aspx/) ) {

        try {
            var css = "";
            css += ".GClhdropbtn {";
            css += "    background-color: #4CAF50;";
            css += "    color: white;";
            css += "    padding: 10px;";
            css += "    font-size: 16px;";
            css += "    border: none;";
            css += "    cursor: pointer;";
            css += "}";
            css += ".GClhdropdown {";
            css += "    position: relative;";
            css += "    display: inline-block;";
            css += "}";
            css += ".GClhdropdown-content {";
            css += "    display: none;";
            css += "    position: absolute;";
            css += "    background-color: #f9f9f9;";
            css += "    min-width: 160px;";
            css += "    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);";
            css += "    z-index: 1;";
            css += "}";
            css += ".GClhdropdown-content-layer {";
            css += "    color: black;";
            css += "    padding: 5px 16px 5px 16px;";
            css += "    text-decoration: none;";
            css += "    display: block;";
            css += "}";
            css += ".GClhdropdown-content-info {";
            css += "    color: black;";
            css += "    background-color: #ffffa5;";
            css += "    padding: 5px 16px 5px 16px;";
            css += "    text-decoration: none;";
            css += "    display: none;";
            css += "}";
            css += ".GClhdropdown-content-layer:hover {";
            css += "    background-color: #e1e1e1;";
            css += "    cursor: pointer;";
            css += "}";
            css += ".GClhdropdown-content-info:hover {";
            css += "    background-color: #ffffa5;";
            css += "    cursor: default;";
            css += "}";
            css += ".GClhdropdown:hover .GClhdropdown-content {";
            css += "    display: block;";
            css += "}";
            css += ".GClhdropdown:hover .GClhdropbtn {";
            css += "    background-color: #3e8e41;";

            css += "}";
            appendCssStyle( css );

            var tbl = $('#ctl00_ContentBody_Waypoints');
            if ( tbl.length == 0 ) {
                tbl = $('#ctl00_ContentBody_WaypointList');
            }
            tbl = tbl.next("p");

            tbl.append('<div class="GClhdropdown"><div id="ShowWaypointsOnFloppsMap" class="GClhdropbtn">Show waypoints on Flopp\'s Map with &#8230;</div><div id="FloppsMapLayers" class="GClhdropdown-content"></div></div>');

            $('#FloppsMapLayers').append('<div id="floppsmap-warning" class="GClhdropdown-content-info"><b>WARNING:</b> There are too many waypoints in the listing. Flopp\'s Map allows only a limited number of waypoints. Not all waypoints are shown.</div>');

            $('#FloppsMapLayers').append('<div class="GClhdropdown-content-layer" data-map="OSM">Openstreetmap</div>');
            $('#FloppsMapLayers').append('<div class="GClhdropdown-content-layer" data-map="OSM/DE">German Style</div>');
            $('#FloppsMapLayers').append('<div class="GClhdropdown-content-layer" data-map="OCM">OpenCycleMap</div>');
            $('#FloppsMapLayers').append('<div class="GClhdropdown-content-layer" data-map="TOPO">OpenTopMap</div>');
            $('#FloppsMapLayers').append('<div class="GClhdropdown-content-layer" data-map="roadmap">Google Maps</div>');
            $('#FloppsMapLayers').append('<div class="GClhdropdown-content-layer" data-map="satellite">Google Maps Satellite</div>');
            $('#FloppsMapLayers').append('<div class="GClhdropdown-content-layer" data-map="hybrid">Google Maps Hybrid</div>');
            $('#FloppsMapLayers').append('<div class="GClhdropdown-content-layer" data-map="terrain">Google Maps Terrain</div>');

            var status = {};
            var waypoints = extractWaypointsFromListing();
            // console.log(waypoints);
            var link = buildFloppsMapLink( waypoints, 'OSM', false, status );
            if ( status.limited == true ) {
                $("#floppsmap-warning").show();
            } else {
                $("#floppsmap-warning").hide();
            }

            function openFloppsMap( map ) {
                var waypoints = extractWaypointsFromListing();
                var link = buildFloppsMapLink( waypoints, map, false, {} );
                window.open( link );
            }

            $('#ShowWaypointsOnFloppsMap').click( function() {
                openFloppsMap("");
            });

            $('.GClhdropdown-content-layer').click( function() {
                var map = $(this).data('map');
                openFloppsMap(map);
            });
        } catch( e ) {
            gclh_error("Show button Flopp's Map and open Flopp's Map", e);
        }
    }

    // Helper function: trim a decimal value to a given number of digits.
    function roundTO(val, decimals) { return Number(Math.round(val+'e'+decimals)+'e-'+decimals); }

    // This function reads the table with the additional waypoints.
    function getAdditionalWaypoints() {
        var addWP  = [];
        try {
            var tbl = document.getElementById('ctl00_ContentBody_Waypoints');
            if ( tbl == null ) {
                tbl = document.getElementById('ctl00_ContentBody_WaypointList');
            }
            if ( tbl == null ) return;

            if (tbl.getElementsByTagName('tbody')) {
                var tblbdy = tbl.getElementsByTagName('tbody')[0];
                var tr_list = tblbdy.getElementsByTagName('tr');

                for (var i=0; i < tr_list.length/2; i++) {
                    var td_list = tr_list[2*i].getElementsByTagName('td');
                    var td_list2nd = tr_list[2*i+1].getElementsByTagName('td');
                    var waypoint = {};

                    if (td_list[3]) {
                        waypoint.icon = td_list[2].getElementsByTagName("img")[0].getAttribute("src");
                        waypoint.prefix = td_list[3].textContent.trim();
                        waypoint.lookup = td_list[4].textContent.trim();
                        waypoint.name = td_list[5].getElementsByTagName("a")[0].textContent;

                        var oDiv = td_list[5];
                        var firstText = "";
                        for (var j = 0; j < oDiv.childNodes.length; j++) {
                            var curNode = oDiv.childNodes[j];
                            if (curNode.nodeName === "#text") {
                                firstText += curNode.nodeValue.trim();
                            }
                        }
                        waypoint.subtype_name = firstText;

                        waypoint.link = td_list[5].getElementsByTagName("a")[0].getAttribute("href");

                        // /images/icons/icon_viewable.jpg

                        var subtype = "";
                        var icon = waypoint.icon;
                        if ( icon.match(/trailhead.jpg/g) ) {
                            subtype = "Trailhead";
                        } else if ( icon.match(/flag.jpg/g) ) {
                            subtype = "Final Location";
                        } else if ( icon.match(/pkg.jpg/g) ) {
                            subtype = "Parking Area";
                        } else if ( icon.match(/stage.jpg/g) ) {
                            subtype = "Physical Stage";
                        } else if ( icon.match(/puzzle.jpg/g) ) {
                            subtype = "Virtual Stage";
                        } else if ( icon.match(/waypoint.jpg/g) ) {
                            subtype = "Reference Point";
                        } else {
                            gclh_log("ERROR: getAdditionalWaypoints(): problem with waypoint "+waypoint.lookup+"/"+waypoint.prefix+ " - unknown waypoint type ("+icon+")");
                        }
                        waypoint.subtype = subtype;

                        waypoint.visible = false;
                        tmp_coords = toDec(td_list[6].textContent.trim());
                        if (typeof tmp_coords[0] !== 'undefined' && typeof tmp_coords[1] !== 'undefined') {
                            waypoint.latitude = tmp_coords[0];
                            waypoint.longitude = tmp_coords[1];
                            waypoint.visible = true;
                        }
                        waypoint.note = td_list2nd[2].textContent.trim();
                        waypoint.type = "waypoint";
                        addWP.push(waypoint);
                    }
                }
            }
        } catch(e) {
            gclh_error("getAdditionalWaypoints(): " ,e);
        }
        return addWP;
    }

    // This function reads the table with the additional waypoints.
    // TODO: Find a better name and use getListingCoordinates.
    function getListingCoordinatesX() {
        var addWP  = [];
        try {
            var waypoint = {};
            var gccode = "n/a";
            var gcname = "n/a";
            if (document.getElementById('ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode')) {
                gccode = document.getElementById('ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode').textContent;
            }
            if (document.getElementById('ctl00_ContentBody_CacheName')) {
                gcname = document.getElementById('ctl00_ContentBody_CacheName').textContent;
            }

            if ((typeof(unsafeWindow.userDefinedCoords) != 'undefined') && (unsafeWindow.userDefinedCoords.data.isUserDefined==true)) {
                waypoint = {};
                waypoint.visible = true;
                waypoint.latitude = roundTO(unsafeWindow.userDefinedCoords.data.newLatLng[0],6);
                waypoint.longitude = roundTO(unsafeWindow.userDefinedCoords.data.newLatLng[1],6);
                waypoint.lookup = gccode;
                waypoint.prefix = "";
                waypoint.name = gcname;
                waypoint.note = "";
                waypoint.type = "listing";
                waypoint.subtype = "changed";
                waypoint.cachetype = document.getElementById('cacheDetails').getElementsByClassName('cacheImage')[0].getElementsByTagName('img')[0].getAttribute('title');
                waypoint.link = document.location.href;
                addWP.push(waypoint);

                waypoint = {};
                waypoint.latitude = roundTO(unsafeWindow.userDefinedCoords.data.oldLatLng[0],6);
                waypoint.longitude = roundTO(unsafeWindow.userDefinedCoords.data.oldLatLng[1],6);
            } else if (document.getElementById('ctl00_ContentBody_uxViewLargerMap')) {
                var tmp_coords = document.getElementById('ctl00_ContentBody_uxViewLargerMap').getAttribute('href').match(/(-)*(\d{1,3}).(\d{1,6})/g);
                waypoint.latitude = tmp_coords[0];
                waypoint.longitude = tmp_coords[1];
            } else {
                gclh_log("ERROR: getListingCoordinatesX(): warning: listing coordinates are not found.");
            }
            waypoint.visible = true;
            waypoint.lookup = gccode;
            waypoint.prefix = "";
            waypoint.name = gcname;
            waypoint.note = "";
            waypoint.type = "listing";
            waypoint.subtype = "origin";
            waypoint.link = document.location.href;
            waypoint.cachetype = document.getElementById('cacheDetails').getElementsByClassName('cacheImage')[0].getElementsByTagName('img')[0].getAttribute('title');

            addWP.push(waypoint); // TODO: added only if listing coordinates available
        } catch(e) {
            gclh_error("getListingCoordinatesX(): " ,e);
        }
        return addWP;
    }

    function getLongDescriptionCoordinates() {
        return [];
    }

    function getPersonalNoteCoordinates() {
        return [];
    }

    function extractWaypointsFromListing() {
        var waypoints = [];
        waypoints = waypoints.concat(getListingCoordinatesX());
        waypoints = waypoints.concat(getAdditionalWaypoints());
        waypoints = waypoints.concat(getLongDescriptionCoordinates());
        waypoints = waypoints.concat(getPersonalNoteCoordinates());
        return waypoints;
    }

    // Functions to calculate the tile numbers X/Y from latitude/longitude or reverse.
    function lat2tile(lat,zoom)  { return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); }
    function long2tile(lon,zoom) { return (Math.floor((lon+180)/360*Math.pow(2,zoom))); }
    function tile2long(x,z) { return (x/Math.pow(2,z)*360-180); }
    function tile2lat(y,z) { var n=Math.PI-2*Math.PI*y/Math.pow(2,z); return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n)))); }

    // Function to convert string to the Flopps Map specification.
    function floppsMapWaypoint( waypoint, id, radius, name ) {
        name = name.replace(/[^a-zA-Z0-9_\-]/g,'_'); // A–Z, a–z, 0–9, - und _
        return id+':'+waypoint.latitude+':'+waypoint.longitude+':'+radius+':'+name;
    }

    // Creates from a list of waypoints an permanent link to Flopps Map.
    function buildFloppsMapLink( waypoints, map, shortnames, status ) {
        var url = "";
        var floppsWaypoints = [];

        var Latmax = -90.0;
        var Latmin = 90.0;
        var Lonmax = -180.0;
        var Lonmin = 180.0;
        var count = 0;

        for ( var i=0; i<waypoints.length; i++) {
            var waypoint = waypoints[i];
            if ( waypoint !== undefined && waypoint.visible == true ) {
                if ( waypoint.type == "waypoint" ) {
                    var id = String.fromCharCode(65+Math.floor(count%26))+Math.floor(count/26+1); // create Flopps Map id: A1-A9 B1-B9 ....
                    var radius = (( waypoint.subtype == "Physical Stage" || waypoint.subtype == "Final Location" ) ? "161" : "");
                    floppsWaypoints.push( floppsMapWaypoint( waypoint, id, radius, waypoint.name ) );
                    count++;
                } else if ( waypoint.type == "listing" && waypoint.subtype == "origin" ) {
                    var radius = 0;
                    if ( waypoint.cachetype == "Traditional Cache" ) {
                        radius = 161;
                    } else if ( waypoint.cachetype == "Mystery Cache" ) {
                        radius = 3000;
                    }
                    floppsWaypoints.push(floppsMapWaypoint( waypoint, "O", radius, waypoint.lookup+'_ORIGIN' ));
                } else if ( waypoint.type == "listing" && waypoint.subtype == "changed" ) {
                    floppsWaypoints.push(floppsMapWaypoint( waypoint, "C", 161, waypoint.lookup+'_CHANGED' ));
                }
                Latmax = Math.max( Latmax, waypoint.latitude );
                Latmin = Math.min( Latmin, waypoint.latitude );
                Lonmax = Math.max( Lonmax, waypoint.longitude );
                Lonmin = Math.min( Lonmin, waypoint.longitude );
            }
        }

        var browserZoomLevel = window.devicePixelRatio;
        var floppsMapWidth = Math.round(window.innerWidth*browserZoomLevel)-280; // minus width of sidebar
        var floppsMapHeigth = Math.round(window.innerHeight*browserZoomLevel)-50; // minus height of header
        var zoom=-1;
        // console.log( "Calculate zoom level for Flopp's Map" + " (width="+floppsMapWidth+"px heigth="+floppsMapHeigth+"px)" );
        for ( zoom=23; zoom>=0; zoom--) {
            // Calculate tile boundary box.
            var tileY_min = lat2tile(Latmin,zoom);
            var tileY_max = lat2tile(Latmax,zoom);
            var tiles_Y = Math.abs(tileY_min-tileY_max+1); // boundary box heigth in number of tiles
            var tileX_min = long2tile(Lonmin,zoom);
            var tileX_max = long2tile(Lonmax,zoom);
            var tiles_X = Math.abs(tileX_max-tileX_min+1); // boundary box width in  number of tiles
            // console.log( "  Tiles @ zoom="+zoom+": Xmin="+tileX_min+" Xmas="+tileX_max+" ΔX="+tiles_X+" => "+tiles_X*256+"px | Ymin="+tileY_min+" Ymax="+tileY_max+" ΔY="+tiles_Y+" => "+tiles_Y*256+"px" );

            // Calculate width and height of boundary rectangle (in pixel).
            var latDelta = Math.abs(tile2lat(tileY_max,zoom)-tile2lat(tileY_min+1,zoom));
            var latPixelPerDegree = tiles_Y*256/latDelta;
            var boundaryHeight = latPixelPerDegree*(Latmax-Latmin);
            // console.log("boundaryHeight:  zoom="+zoom+" latDelta="+latDelta+"° * latPixelPerDegree="+latPixelPerDegree+"px/° = "+boundaryHeight+"px");

            var longDelta = Math.abs(tile2long(tileX_max+1,zoom)-tile2long(tileX_min,zoom));
            var longPixelPerDegree = tiles_X*256/longDelta;
            var boundaryWidth = longPixelPerDegree*(Lonmax-Lonmin);
            // console.log("boundaryWidth: zoom="+zoom+" longDelta="+longDelta+"° longPixelPerDegree="+longPixelPerDegree+"px/° ="+boundaryWidth+"px");

            if ( (boundaryHeight < floppsMapHeigth ) && (boundaryWidth < floppsMapWidth ) ) {
                break;
            }
        }

        // TODO: problems if the zoom level to big
        // TODO: danksagugng

        var url = "";
        status.limited = false;

        for ( var i=0; i<floppsWaypoints.length; i++) {
            var nextWaypoint = floppsWaypoints[i];
            // Limited the waypoint part to 2000 (+3) characters.
            if ( (url.length+nextWaypoint.length+1)>2003 ) {
                status.limited = true;
                status.numbers = i;
                break;
            }
            url += ( ( i == 0 ) ? '&m=' : '*' );
            url += nextWaypoint;
        }
        var center_latitude = ((Latmax+90.0)+(Latmin+90.0))/2-90.0;
        var center_longitude = ((Lonmax+180.0)+(Lonmin+180.0))/2-180.0;

        var maxZoom = { 'OSM': 18, 'OSM/DE': 18, 'OCM': 17, 'MQ': 17, 'OUTD': 17, 'TOPO': 15, 'roadmap':20, 'terrain':20, 'hybrid': 20 };
        zoom = Math.min(zoom,maxZoom[map]);
        var url = 'http://flopp.net/'+'?c='+center_latitude+':'+center_longitude+'&z='+zoom+'&t='+map+url;

        url += '&d=O:C';
        return encodeURI(url);
    }

// Added elevation to every additional waypoint with shown coordinates (issue #250).
    if ( settings_show_elevation_of_waypoints && (
        is_page("cache_listing") ||
        document.location.href.match(/^https?:\/\/www\.geocaching\.com\/hide\/wptlist.aspx/) ) ) {

        try {
            function formatElevation( elevation ) {
                return ((elevation>=0)?"+":"")+(( settings_distance_units != "Imperial" )?(Math.round(elevation) + "m"):(Math.round(elevation*3.28084) + "ft"));
            }

            function addElevationToWaypoints(responseDetails) {
                try {
                    json = JSON.parse(responseDetails.responseText);
                    if ( json.status != "OK" ) {
                        gclh_log( "addElevationToWaypoints(): not results for elevation. status="+json.status );
                        gclh_log( "addElevationToWaypoints():    "+json.error_message );
                    }

                    var tbl = getWaypointTable();
                    if ( tbl.length > 0 ) {
                        var length = tbl.find("tbody > tr").length;
                        for ( var i=0; i<length/2; i++ ) {
                            var heightString = "";
                            var title = "Elevation not available!";
                            var json = JSON.parse(responseDetails.responseText);
                            if (typeof json.results[i].elevation !== "number") {
                                heightString = "n/a";
                                title = "Elevation not available - no answer";
                            } else {
                                heightString = formatElevation(json.results[i].elevation);
                                title = "Elevation";
                                if ( json.results[i].location.lat == -90 ) {
                                    heightString = "???"; // for waypoints with hidden coordinates
                                    title = "Elevation not available - unknown location";
                                }
                            }
                            tbl.find("tbody > tr:eq("+(i*2)+") > td:eq(7)").html('<span title="'+title+'">'+heightString+'</span>'  );
                        }
                    }

                    var index = json.results.length-1;
                    if ( $("#uxLatLonLinkElevation").length > 0 ) {
                        if ( index >= 0 ) {
                            $("#uxLatLonLinkElevation").html(formatElevation(json.results[index].elevation));
                        } else {
                            gclh_log("addElevationToWaypoints(): Error: index out of range");
                        }
                    }
                } catch(e) {
                    gclh_error( "addElevationToWaypoints(): ", e);
                }
            }

            var locations="";
            var tbl = getWaypointTable();
            if ( tbl.length > 0 ) {
                tbl.find("thead > tr > th:eq(6)").after('<th scope="col">Elevation</th>'); // added header Elevation after Coordinate
                var length = tbl.find("tbody > tr").length;
                for ( var i=0; i<length/2; i++ ) {
                    var cellNote = tbl.find("tbody > tr:eq("+(i*2+1)+") > td:eq(2)");
                    var colspan = cellNote.attr('colspan');
                    cellNote.attr('colspan',colspan+1);

                    var row1st = tbl.find("tbody > tr").eq(i*2);

                    var cellCoordinates = row1st.find("td:eq(6)");
                    var tmp_coords = toDec(cellCoordinates.text().trim());
                    if (typeof tmp_coords[0] !== 'undefined' && typeof tmp_coords[1] !== 'undefined') {
                        locations += (locations.length == 0 ? "" : "|") + tmp_coords[0]+","+tmp_coords[1];
                    } else {
                        locations += (locations.length == 0 ? "" : "|") + "-90.0,-180.0"; // for waypoints without visible coordinates
                    }

                    row1st.find("td:eq(6)").after('<td>???</td>');
                }
            }

            var waypoint = getListingCoordinates(false);
            if ( waypoint !== undefined ) {
                $("#uxLatLonLink").after('<span title="Elevation">&nbsp;&nbsp;&nbsp;Elevation:&nbsp;<span id="uxLatLonLinkElevation">???</span></span>');
                locations += (locations.length == 0 ? "" : "|") + waypoint.latitude+","+waypoint.longitude;
            }

            GM_xmlhttpRequest({
                method: 'GET',
                url: "https://maps.googleapis.com/maps/api/elevation/json?sensor=false&locations=" + locations,
                onload: addElevationToWaypoints,
                onerror: function() { gclh_log("Elevation: ERROR: request elevation for waypoints failed!"); }
            });
        } catch(e) {
            gclh_error( "AddElevation", e );
        }
    }

    // Returns true in case of modified coordinates.
    function areListingCoordinatesModified() {
        if ((typeof(unsafeWindow.userDefinedCoords) != 'undefined') && (unsafeWindow.userDefinedCoords.data.isUserDefined==true)) {
            return true;
        }
        return false;
    }

    // Returns the listing coordinates as an array. In case of user changed listing coordinates, the changed coords are returned.
    // If the parameter original true, always the original listing coordinates are returned.
    function getListingCoordinates( original ) {
        var waypoint = undefined;
        if (areListingCoordinatesModified()) {
            waypoint = { latitude : undefined, longitude : undefined };
            if ( (typeof(original) != 'undefined') && original == true ) {
                waypoint.latitude = unsafeWindow.userDefinedCoords.data.oldLatLng[0];
                waypoint.longitude = unsafeWindow.userDefinedCoords.data.oldLatLng[1];
            } else {
                waypoint.latitude = unsafeWindow.userDefinedCoords.data.newLatLng[0];
                waypoint.longitude = unsafeWindow.userDefinedCoords.data.newLatLng[1];
            }
        } else {
            var listingCoords = $('#ctl00_ContentBody_uxViewLargerMap');
            if ( listingCoords.length > 0 && listingCoords.attr('href').length > 0 ) {
                var tmp_coords = listingCoords.attr('href').match(/(-)*(\d{1,3}).(\d{1,6})/g);
                if ( typeof(tmp_coords[0]) !== undefined && typeof(tmp_coords[1]) !== undefined ) {
                    waypoint = { latitude : undefined, longitude : undefined };
                    waypoint.latitude = tmp_coords[0];
                    waypoint.longitude = tmp_coords[1];
                }
            }
        }
        return waypoint;
    }

// Fieldnotes auf alte Verarbeitung umbiegen und nicht über die neue Log Seite gehen.
    if (settings_fieldnotes_old_fashioned && document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/fieldnotes\.aspx/)) {
        try {
            var aTag = document.getElementsByTagName('a');
            if (aTag) {
                for (var i = 0; i < aTag.length; i++) {
                    if (aTag[i].href.match(/fieldnotes\.aspx\?composeLog=true/i)) {
                        var matches = aTag[i].href.match(/&draftGuid=(.*)&/i);
                        if (matches && matches[1]) {
                            aTag[i].href = "https://www.geocaching.com/seek/log.aspx?PLogGuid=" + matches[1];
                        }
                    }
                }
            }
        } catch (e) {
            gclh_error("Fieldnotes auf alte Verarbeitung umbiegen", e);
        }
    }

// Default Log Type && Log Signature.
    if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/log\.aspx\?(id|guid|ID|PLogGuid|wp)\=/) && document.getElementById('ctl00_ContentBody_LogBookPanel1_ddLogType') && $('#ctl00_ContentBody_LogBookPanel1_lbConfirm').length == 0) {
        try {
            if (!document.location.href.match(/\&LogType\=/) && !document.location.href.match(/PLogGuid/)) {
                var cache_type = document.getElementById("ctl00_ContentBody_LogBookPanel1_WaypointLink").nextSibling.childNodes[0].title;
                var select_val = "-1";

                if (cache_type.match(/event/i)) {
                    select_val = settings_default_logtype_event;
                }

                // Ownername == Username.
                else if ($('.PostLogList').find('a[href*="https://www.geocaching.com/profile/?guid="]').text().trim() == $('.li-user-info').last().children().text().trim()) {
                    select_val = settings_default_logtype_owner;
                } else {
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

            // Signature.
            if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/log\.aspx\?PLogGuid\=/)) {
                if (settings_log_signature_on_fieldnotes) document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML += getValue("settings_log_signature", "");
            } else {
                document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML += getValue("settings_log_signature", "");
            }

            // Set Cursor to Pos1.
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

            // Replace variable.
            if ($('.li-user-info').last().children().length > 0) {
                var finds = get_my_finds();
                var me = $('.li-user-info').last().children().first().text();
                var owner = document.getElementById('ctl00_ContentBody_LogBookPanel1_WaypointLink').nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerHTML;
                document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#found_no#/ig, finds);
                finds++;
                document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#found#/ig, finds).replace(/#me#/ig, me).replace(/#owner#/ig, owner);
                [ aDate, aTime, aDateTime ] = getDateTime();
                document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#Date#/ig, aDate).replace(/#Time#/ig, aTime).replace(/#DateTime#/ig, aDateTime);
                [ aGCTBName, aGCTBLink, aGCTBNameLink, aLogDate ] = getGCTBInfo();
                document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#GCTBName#/ig, aGCTBName).replace(/#GCTBLink#/ig, aGCTBLink).replace(/#GCTBNameLink#/ig, aGCTBNameLink).replace(/#LogDate#/ig, aLogDate);
            }
        } catch (e) {
            gclh_error("Default Log-Type & Signature (CACHE)", e);
        }
    }

// Default TB Log Type && Log Signature.
    if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/track\/log\.aspx/)) {
        try {
            if (settings_default_tb_logtype != "-1" && !document.location.href.match(/\&LogType\=/)) {
                var select = document.getElementById('ctl00_ContentBody_LogBookPanel1_ddLogType');
                var childs = select.children;

                for (var i = 0; i < childs.length; i++) {
                    if (childs[i].value == settings_default_tb_logtype) {
                        select.selectedIndex = i;
                    }
                }
            }

            // Signature.
            if (document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo') && document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML == "") document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = getValue("settings_tb_signature", "");

            // Set Cursor to Pos1.
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

            // Replace variable.
            if ($('.li-user-info').last().children().length > 0) {
                var finds = get_my_finds();
                var me = $('.li-user-info').last().children().first().text();
                var owner = document.getElementById('ctl00_ContentBody_LogBookPanel1_WaypointLink').nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerHTML;
                document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#found_no#/ig, finds);
                finds++;
                document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#found#/ig, finds).replace(/#me#/ig, me).replace(/#owner#/ig, owner);
                [ aDate, aTime, aDateTime ] = getDateTime();
                document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#Date#/ig, aDate).replace(/#Time#/ig, aTime).replace(/#DateTime#/ig, aDateTime);
                [ aGCTBName, aGCTBLink, aGCTBNameLink, aLogDate ] = getGCTBInfo();
                document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML.replace(/#GCTBName#/ig, aGCTBName).replace(/#GCTBLink#/ig, aGCTBLink).replace(/#GCTBNameLink#/ig, aGCTBNameLink).replace(/#LogDate#/ig, aLogDate);
            }
        } catch (e) {
            gclh_error("Default Log-Type und Signature (TB)", e);
        }
    }

// Show Coin-series in TB-Listing.
    if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/track\/details\.aspx/)) {
        try {
            var dl = document.getElementsByClassName('BugDetailsList')[0];
            if (dl) {
                if (document.getElementById("ctl00_ContentBody_BugTypeImage") && document.getElementById("ctl00_ContentBody_BugTypeImage").alt) {
                    dl.innerHTML += "<dt>Series:</dt><dd>" + document.getElementById("ctl00_ContentBody_BugTypeImage").alt + "</dd>";
                }
            }
        } catch (e) {
            gclh_error("Show Coin Series", e);
        }
    }

// Improve Friendlist.
    if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/myfriends\.aspx/)) {
        try {
            var friends = document.getElementsByClassName("FriendText");
            var day = new Date().getDate();
            var last_check = parseInt(getValue("friends_founds_last", "0"), 10);

            if (settings_automatic_friend_reset && last_check != day) {
                for (var i = 0; i < friends.length; i++) {
                    var friend = friends[i];
                    var name = friend.getElementsByTagName("a")[0];
                    // Founds.
                    if (getValue("friends_founds_new_" + name.innerHTML)) {
                        setValue("friends_founds_" + name.innerHTML, getValue("friends_founds_new_" + name.innerHTML));
                    }
                    // Hides.
                    if (getValue("friends_hides_new_" + name.innerHTML)) {
                        setValue("friends_hides_" + name.innerHTML, getValue("friends_hides_new_" + name.innerHTML));
                    }
                }
                setValue("friends_founds_last", day);
                var last_autoreset = getValue("friends_founds_last_autoreset");
                if (typeof(last_autoreset) != "undefined") {
                   setValue("friends_founds_last_reset", last_autoreset);
                }
                setValue("friends_founds_last_autoreset", new Date().getTime());
            }

            // Klasse fuer die Links anlegen.
            var myf = "a.myfriends:hover { " +
                 "  text-decoration:underline;" +
                 "}" +
                 "a.myfriends {" +
                 "  color:#00AA00;" +
                 "  text-decoration:none;" +
                 "}";
            GM_addStyle(myf);

            var sNewF = "";  // new finds
            var sNewH = "";  // new hides

            var myvips = getValue("vips", false);
            if (!myvips) {
                myvips = new Array();
            } else {
                myvips = myvips.replace(/, (?=,)/g, ",null");
                myvips = JSON.parse(myvips);
            }

            for (var i = 0; i < friends.length; i++) {
                var friend = friends[i];
                var name = friend.getElementsByTagName("a")[0];
                var add = "";

                // Founds.
                var founds = parseInt(trim(friend.getElementsByTagName("dd")[3].innerHTML).replace(/[,.]*/g, ""));
                if (isNaN(founds))founds = 0;
                var last_founds = getValue("friends_founds_" + name.innerHTML);
                if (typeof(last_founds) == "undefined") {
                    last_founds = founds;
                    setValue("friends_founds_" + name.innerHTML, last_founds);
                }
                if ((founds - last_founds) > 0) add = " <font color='#00AA00'><b>(+" + (founds - last_founds) + ")</b></font>";
                setValue("friends_founds_new_" + name.innerHTML, founds);

                // Wenn neue Founds, dann User und Funddifferenz als Link zu string hinzufuegen (ggf. nur VIPs).
                if  ((settings_friendlist_summary_viponly && in_array(name.innerHTML, myvips)) || (!settings_friendlist_summary_viponly)) {
                    if ((founds - last_founds) > 0) {
                        if (sNewF != "") sNewF = sNewF + ",&nbsp;";
                        var sHlp = name.innerHTML + " (";
                        if ((founds - last_founds) > 0) sHlp = sHlp + "+";
                        else sHlp = sHlp + "-";
                        sHlp = sHlp + (founds - last_founds) + ")";
                        sNewF = sNewF + "<a class='myfriends' href='/seek/nearest.aspx?ul=" + urlencode(name.innerHTML) + "&disable_redirect='>" + sHlp + "</a>";
                    }
                }
                if (founds == 0) {
                    friend.getElementsByTagName("dd")[3].innerHTML = founds + "&nbsp;";
                } else {
                    friend.getElementsByTagName("dd")[3].innerHTML = "<a href='/seek/nearest.aspx?ul=" + urlencode(name.innerHTML) + "&disable_redirect='>" + founds + "</a>&nbsp;" + add;
                }

                // Hides.
                add = "";
                var hides = parseInt(trim(friend.getElementsByTagName("dd")[4].innerHTML).replace(/[,.]*/g, ""));
                if (isNaN(hides))hides = 0;
                var last_hides = getValue("friends_hides_" + name.innerHTML);
                if (typeof(last_hides) == "undefined") {
                    last_hides = hides;
                    setValue("friends_hides_" + name.innerHTML, last_hides);
                }
                if ((hides - last_hides) > 0) add = " <font color='#00AA00'><b>(+" + (hides - last_hides) + ")</b></font>";
                setValue("friends_hides_new_" + name.innerHTML, hides);

                // Wenn neue Hides, dann User und Funddifferenz als Link zu string hinzufuegen (ggf. nur VIPs).
                if  ((settings_friendlist_summary_viponly && in_array(name.innerHTML, myvips)) || (!settings_friendlist_summary_viponly)) {
                    if ((hides - last_hides) > 0) {
                        if (sNewH != "") sNewH = sNewH + ",&nbsp;";
                        var sHlp = name.innerHTML + " (";
                        if ((hides - last_hides) > 0) sHlp = sHlp + "+";
                        else sHlp = sHlp + "-";
                        sHlp = sHlp + (hides - last_hides) + ")";
                        sNewH = sNewH + "<a class='myfriends' href='/seek/nearest.aspx?u=" + urlencode(name.innerHTML) + "&disable_redirect='>" + sHlp + "</a>";
                    }
                }

                if (hides == 0) {
                    friend.getElementsByTagName("dd")[4].innerHTML = hides + "&nbsp;";
                } else {
                    friend.getElementsByTagName("dd")[4].innerHTML = "<a href='/seek/nearest.aspx?u=" + urlencode(name.innerHTML) + "&disable_redirect='>" + hides + "</a>&nbsp;" + add;
                }

                // Location.
                var friendlocation = trim(friend.getElementsByTagName("dd")[2].getElementsByTagName("span")[0].innerHTML);
                if (friendlocation != "" && friendlocation != "not listed" && friendlocation.length > 3) {
                    friend.getElementsByTagName("dd")[2].getElementsByTagName("span")[0].innerHTML = "<a href='http://maps.google.de/?q=" + (friendlocation.replace(/&/g, "")) + "' target='_blank'>" + friendlocation + "</a>";
                }

                // Bottom line.
                friend.getElementsByTagName("p")[0].innerHTML = "<a name='lnk_profilegallery2' href='" + name.href + '#gclhpb#ctl00$ContentBody$ProfilePanel1$lnkGallery' + "'>Gallery</a> | " + friend.getElementsByTagName("p")[0].innerHTML;
            }

            function gclh_reset_counter() {
                var friends = document.getElementsByClassName("FriendText");
                var resetTime = new Date().getTime();
                setValue("friends_founds_last_reset", resetTime);
                if (settings_automatic_friend_reset) setValue("friends_founds_last_autoreset", resetTime);

                for (var i = 0; i < friends.length; i++) {
                    var friend = friends[i];
                    var name = friend.getElementsByTagName("a")[0];
                    var founds = 0;
                    var hides = 0;

                    founds = getValue("friends_founds_new_" + name.innerHTML, 0);
                    setValue("friends_founds_" + name.innerHTML, founds);
                    if (founds == 0) friend.getElementsByTagName("dd")[3].innerHTML = "0&nbsp;";
                    else friend.getElementsByTagName("dd")[3].innerHTML = "<a href='/seek/nearest.aspx?ul=" + urlencode(name.innerHTML) + "&disable_redirect='>" + founds + "</a>";

                    hides = getValue("friends_hides_new_" + name.innerHTML, 0);
                    setValue("friends_hides_" + name.innerHTML, hides);
                    if (hides == 0) friend.getElementsByTagName("dd")[4].innerHTML = "0&nbsp;";
                    else friend.getElementsByTagName("dd")[4].innerHTML = "<a href='/seek/nearest.aspx?u=" + urlencode(name.innerHTML) + "&disable_redirect='>" + hides + "</a>&nbsp;";
                }

                if (settings_friendlist_summary) {
                    // Wenn Reset, dann Differenzen nicht mehr anzeigen...
                    var divFH = document.getElementsByClassName("divFHclass");
                    for (var i = 0; i < divFH.length; i++) {
                        var divC = divFH[i];
                        divC.innerHTML = "";
                    }
                    // und "last reset" aktualisieren.
                    var spanTTs = document.getElementsByClassName("spanTclass");
                    var ld1 = getValue("friends_founds_last_reset", 0);
                    spanTTs[0].innerHTML = '<br><br>Last reset was 0 seconds ago (' + new Date(parseInt(ld1, 10)).toLocaleString() + ')';
                }
            }

            if (settings_friendlist_summary) {
                // "last reset" anzeigen.
                var spanT = document.createElement("span");
                var ld = getValue("friends_founds_last_reset", 0);
                // Fix for first call...
                if (ld == 0) {
                   ld = new Date().getTime();
                   setValue("friends_founds_last_reset", ld);
                }
                spanT.className = "spanTclass";
                spanT.style.color  = "gray";
                spanT.style.fontSize = "smaller";
                spanT.innerHTML = '<br>Last reset was ' + getDateDiffString(new Date().getTime(), ld) + ' ago (' +
                    new Date(parseInt(ld, 10)).toLocaleString() + ')';
                if ((sNewH == "") && (sNewF == "")) spanT.innerHTML = '<br>' + spanT.innerHTML;
                document.getElementById('ctl00_ContentBody_btnAddFriend').parentNode.insertBefore(spanT, document.getElementById('ctl00_ContentBody_btnAddFriend').nextSibling);

                // Wenn neue Hides -> anzeigen.
                if (sNewH != "") {
                    var boxH = document.createElement("div");
                    boxH.innerHTML = "<br><b>New hides by:</b> " + sNewH;
                    boxH.className = 'divFHclass';
                    document.getElementById('ctl00_ContentBody_btnAddFriend').parentNode.insertBefore(boxH, document.getElementById('ctl00_ContentBody_btnAddFriend').nextSibling);
                }

                // Wenn neue Founds -> anzeigen.
                if (sNewF != "") {
                    var boxF = document.createElement("div");
                    boxF.innerHTML = "<br><b>New finds by:</b> " + sNewF;
                    boxF.className = 'divFHclass';
                    document.getElementById('ctl00_ContentBody_btnAddFriend').parentNode.insertBefore(boxF, document.getElementById('ctl00_ContentBody_btnAddFriend').nextSibling);
                }
            }

            var button = document.createElement("input");
            button.setAttribute("type", "button");
            button.setAttribute("value", "Reset counter");
            button.setAttribute("style", "height: 35px;");
            button.addEventListener("click", gclh_reset_counter, false);
            document.getElementById('ctl00_ContentBody_btnAddFriend').parentNode.insertBefore(button, document.getElementById('ctl00_ContentBody_btnAddFriend').nextSibling);
        } catch (e) {
            gclh_error("Improve Friendlist", e);
        }
    }

// Show Google-Maps Link on Cache Listing Page.
    if (settings_show_google_maps && is_page("cache_listing") && document.getElementById("ctl00_ContentBody_uxViewLargerMap") && document.getElementById("uxLatLon") && document.getElementById("ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode")) {
        try {
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
        } catch (e) {
            gclh_error("Show google maps link", e);
        }
    }

// Show "Log It"-Button.
    if (settings_show_log_it && document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/nearest\.aspx\?/)) {
        try {
            var links = document.getElementsByTagName("a");
            for (var i = 0; i < links.length; i++) {
                if (links[i].href.match(/^https?:\/\/www\.geocaching\.com\/seek\/cache_details\.aspx\?.*/) && links[i].innerHTML.match(/^<span>/)) {
                    links[i].parentNode.innerHTML = links[i].parentNode.innerHTML.replace("<br>", "<a title='Log it' href='" + links[i].href.replace("cache_details", "log") + "'><img src='/images/stockholm/16x16/add_comment.gif'></a><br>");
                } else if (links[i].href.match(/^https?:\/\/www\.geocaching\.com\/geocache\/.*/) && links[i].innerHTML.match(/^<span>/)) {
                    var match = links[i].href.match(/^https?:\/\/www\.geocaching\.com\/geocache\/([^_]*)/);
                    links[i].parentNode.innerHTML = links[i].parentNode.innerHTML.replace("<br>", "<a title='Log it' href='" + http + "://www.geocaching.com/seek/log.aspx?wp=" + match[1] + "'><img src='/images/stockholm/16x16/add_comment.gif'></a><br>");
                }
            }
        } catch (e) {
            gclh_error("Log It Button", e);
        }
    }

// Show Profile-Link on display of Caches found or created by user.
    if (settings_show_nearestuser_profil_link && document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/nearest\.aspx/) && document.location.href.match(/(ul|u)=/)) {
        if (document.getElementById("ctl00_ContentBody_LocationPanel1_OriginLabel")) {
            try {
                var urluser = document.location.href.match(/(ul|u)=(.*)/);
                urluser = urldecode( urluser[2].replace(/&([A-Za-z0-9]+)=(.*)/, "") );
                urluser = urluser.replace(/&disable_redirect=/, "");
                urluser = urluser.replace(/#(.*)/, "");
                var linkelement = document.createElement("a");
                linkelement.href = "/profile/?u=" + urluser;
                linkelement.innerHTML = urluser;
                var textelement = document.getElementById("ctl00_ContentBody_LocationPanel1_OriginLabel");
                textelement.innerHTML = textelement.innerHTML.replace(/: (.*)/, ": ");
                textelement.appendChild(linkelement);
            } catch (e) {
                gclh_error("Show Profile Link", e);
            }
        }
    }

// Improve bookmark lists.
    if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/bookmarks\/(view\.aspx\?guid=|bulk\.aspx\?listid=|view\.aspx\?code=)/) && document.getElementById('ctl00_ContentBody_QuickAdd')) {
        try {
            // Prepare links "Download as kml" and "Show in google maps".
            if (document.location.href.match(/guid=([a-zA-Z0-9-]*)/)) {
                var matches = document.location.href.match(/guid=([a-zA-Z0-9-]*)/);
                if (matches && matches[1]) {
                    var uuidx = matches[1];
                    var kml = "<a style=\"padding-right: 20px;\" title=\"Download as kml\" href='" + http + "://www.geocaching.com/kml/bmkml.aspx?bmguid=" + uuidx + "'>Download as kml</a>";
                    var gm = "<a title=\"Show in google maps\" href='http://maps.google.com/?q=https://www.geocaching.com/kml/bmkml.aspx?bmguid=" + uuidx + "' target='_blank'>Show in google maps</a>";
                }
            }
            // Compact layout for bookmark lists.
            if (settings_compact_layout_bm_lists) {
                // Header:
                var div = document.getElementById('ctl00_ContentBody_QuickAdd');
                div.children[1].childNodes[1].remove();
                div.children[1].childNodes[0].remove();
                div.children[0].remove();
                div.setAttribute("style", "margin-bottom: 1px; float: left;");
                document.getElementById('ctl00_ContentBody_btnAddBookmark').setAttribute("style", "margin-top: 1px; margin-left: -1px;");
                document.getElementById('ctl00_ContentBody_ListInfo_uxListOwner').parentNode.parentNode.children[4].remove();
                document.getElementById('ctl00_ContentBody_ListInfo_uxListOwner').parentNode.parentNode.children[3].remove();
                document.getElementById('ctl00_ContentBody_ListInfo_uxListOwner').parentNode.style.marginBottom = "0px";
                if (uuidx) document.getElementById('ctl00_ContentBody_ListInfo_uxListOwner').parentNode.innerHTML += "<span style='float: right; padding-right: 210px;'>" + kml + gm + "</span>";
                // Lines:
                appendCssStyle("table.Table th, table.Table td {border-left: 1px solid #fff; border-right: 1px solid #fff;} tr.BorderTop td {border-top: 1px solid #fff;} table.Table th {border-bottom: 2px solid #fff;} td {vertical-align: baseline !important;} table.Table img {vertical-align: baseline !important; margin-bottom: -3px;}");
                var lines = $('table.Table tbody').find('tr');
                for (var i = 0; i < lines.length; i += 2) {
                    if (!lines[i].className.match(/BorderTop/)) lines[i].className += " BorderTop";
                    lines[i].children[1].childNodes[3].outerHTML = "&nbsp;&nbsp;";
                    lines[i].children[1].style.whiteSpace = "nowrap";
                    lines[i].children[5].style.whiteSpace = "nowrap";
                    if (lines[i+1].children[1].innerHTML == "") lines[i+1].style.fontSize = "0px";
                }
                // Footer:
                $('#ctl00_ContentBody_ListInfo_btnDelete').closest('p').append($('#ctl00_ContentBody_btnCreatePocketQuery').remove().get().reverse());
                document.getElementById('ctl00_ContentBody_uxAboutPanel').remove();
            // No compact layout for bookmark lists, only build links.
            } else {
                if (uuidx) document.getElementById("ctl00_ContentBody_lbHeading").parentNode.parentNode.parentNode.childNodes[3].innerHTML += "<br>" + kml + "<br>" + gm;
            }
        } catch (e) {
            gclh_error("Improve bookmark lists", e);
        }
    }

// Improve list of bookmark lists.
    if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/bookmarks\/default\.aspx/) || document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/lists\.aspx/)) {
        try {
            // Compact layout for list of bookmark lists.
            if (settings_compact_layout_list_of_bm_lists) {
                // Header:
                appendCssStyle(".ListManagementFavoritesWidget, .ListsManagemntWatchlistWidget {margin: 0 0 1.5em; padding: 0.5em;}");
                $('#divContentMain div h2').first().remove();
                $('#divContentMain p.NoBottomSpacing').first().remove();
                $('#divContentMain div h3').first().closest('div').remove();
                $('#ctl00_ContentBody_hlCreateNewBookmarkList').closest('p').prop("style", "margin: 0 0 0.5em");
                // Lines:
                $('table.Table thead tr')[0].children[1].innerHTML = "Status";
                $('table.Table thead tr')[0].children[5].innerHTML = "PQ";
                $('table.Table thead tr')[0].children[6].innerHTML = "KML";
                var th = document.createElement("th");
                th.setAttribute("scope", "col");
                th.appendChild(document.createTextNode("GMaps"));
                $('table.Table thead tr')[0].append(th);
                var lines = $('table.Table tbody tr');
                for (var i = 0; i < lines.length; i++) {
                    while (lines[i].children[2].childNodes[2]) {
                        lines[i].children[2].childNodes[2].remove();
                    }
                    lines[i].children[4].children[0].innerHTML = '<img src="/images/icons/16/edit.png" style="vertical-align: middle; padding-right: 8px;" alt="Edit">';
                    lines[i].children[4].children[1].innerHTML = '<img src="/images/icons/16/watch.png" style="vertical-align: middle; padding-right: 8px;" alt="View">';
                    lines[i].children[4].children[2].innerHTML = '<img src="/images/icons/16/delete.png" style="vertical-align: middle;" alt="Delete">';
                    lines[i].children[4].childNodes[4].remove();
                    lines[i].children[4].childNodes[2].remove();
                    lines[i].children[5].children[0].innerHTML = '<img src="/images/icons/16/bookmark_pq.png" style="vertical-align: middle;" alt="Create PQ">';
                    lines[i].children[6].children[0].innerHTML = '<img src="/images/icons/16/download.png" style="vertical-align: middle;" alt="Download">';
                    var td = document.createElement("td");
                    var matches = lines[i].children[6].children[0].href.match(/guid=([a-zA-Z0-9-]*)/);
                    if (matches && matches[1]) {
                        td.innerHTML = "<a title='Show in google maps' href='http://maps.google.com/?q=https://www.geocaching.com/kml/bmkml.aspx?bmguid=" + matches[1] + "' target='_blank'><img src='/images/silk/map_go.png' style='vertical-align: middle;' alt='GMaps'></a>";
                    }
                    lines[i].append(td);
                }
                // Footer:
                $('#divContentMain div ul').first().remove();
            // No compact layout for list of bookmark lists, only build link.
            } else {
                var lines = $('table.Table tbody tr');
                for (var i = 0; i < lines.length; i++) {
                    var matches = lines[i].children[6].children[0].href.match(/guid=([a-zA-Z0-9-]*)/);
                    if (matches && matches[1]) {
                        lines[i].children[6].innerHTML += "<br><a title='Show in google maps' href='http://maps.google.com/?q=https://www.geocaching.com/kml/bmkml.aspx?bmguid=" + matches[1] + "' target='_blank'>Show in google maps</a>";
                    }
                }
            }
        } catch (e) {
            gclh_error("Improve list of bookmark lists", e);
        }
    }

// Add buttons to bookmark lists and watchlist to select caches.
    var current_page;
    if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/bookmarks/) &&
        !document.location.href.match(/^https?:\/\/www\.geocaching\.com\/bookmarks\/default/)) current_page = "bookmark";
    else if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/watchlist\.aspx/)) current_page = "watch";

    if (!!current_page) {
        try {
            var checkbox_selector = 'input[type=checkbox]';
            var table = $('table.Table').first(); //On watchlist, ignore the trackable-table so use only first table here
            var rows = table.find('tbody tr');
            var checkboxes = table.find(checkbox_selector);

            if (table.length > 0 && rows.length > 0 && checkboxes.length > 0) {
                // Add section to table.
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
        } catch (e) {
            gclh_error("Add buttons to bookmark list and watchlist", e);
        }
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
        sumsChangeFields( "All", sums["chAll"], sums["All"] );
        sumsChangeFields( "Found", sums["chFound"], sums["Found"] );
        sumsChangeFields( "Archived", sums["chArchived"], sums["Archived"] );
        sumsChangeFields( "Deactivated", sums["chDeactivated"], sums["Deactivated"] );
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

// Hide Map Header.
    if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/map\//)) {
        try {
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
                        setTimeout( function () { checkMapLeaflet( waitCount ); }, 100);
                    } else {
                        return;
                    }
                }
            }
            checkMapLeaflet( 0 );
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
        } catch (e) {
            gclh_error("Hide Map Header", e);
        }
    }

// Add additional Layers to Map & Select Default-Layer, add Hill-Shadow, add Homezone.
    if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/map\//)) {
        try {
            // Auswahl nur bestimmter Layer.
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
                                    window["GCLittleHelper_MapLayerHelper"](map_layers, map_overlays, settings_map_default_layer, settings_show_hillshadow);
                                }, 10);
                            } else {
                                var layerControl = new window.L.Control.Layers();
                                var layerToAdd = null;
                                var defaultLayer = null;
                                var hillshadowLayer = null;
                                for (name in map_layers) {
                                    layerToAdd = new L.tileLayer(map_layers[name].tileUrl, map_layers[name]);
                                    layerControl.addBaseLayer(layerToAdd, name);
                                    if (name == settings_map_default_layer) {
                                        defaultLayer = layerToAdd;
                                    } else if (defaultLayer == null) {
                                        defaultLayer = layerToAdd;
                                    }
                                }
                                for (name in map_overlays) {
                                    layerToAdd = new L.tileLayer(map_overlays[name].tileUrl, map_overlays[name]);
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
                        setTimeout( function () { addLayer( waitCount ); }, 50);
                    } else return;
                }
            }
            if (settings_use_gclh_layercontrol) setTimeout( function () { addLayer( 0 ); }, 1000); // 1 Sekunde warten, um Layercontrol von GC Map Enhancements zu ueberschreiben

            // Function called when map is loaded.
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
                                setTimeout( function () { hideSidebarRest( waitCount ); }, 200);
                            } else return;
                        }
                    }
                    hideSidebarRest( 0 );
                }

                function addHomeZoneMap(unsafeWindow, home_lat, home_lng, settings_homezone_radius, settings_homezone_color, settings_homezone_opacity) {
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
                            } else {
                                addHomeZoneMap(unsafeWindow, getValue("home_lat"), getValue("home_lng"), settings_homezone_radius, "#" + settings_homezone_color, settings_homezone_opacity);
                            }
                            // Show Multi-Homezone-Circle on Map
                            for (var i in settings_multi_homezone) {
                                var curHz = settings_multi_homezone[i];
                                if (browser === "chrome" || browser === "firefox") {
                                    injectPageScriptFunction(addHomeZoneMap, "('" + "none" + "', " + curHz.lat + ", " + curHz.lng + ", " + curHz.radius + ", '#" + curHz.color + "', " + curHz.opacity + ")");
                                } else {
                                    addHomeZoneMap(unsafeWindow, curHz.lat, curHz.lng, curHz.radius, "#" + curHz.color, curHz.opacity);
                                }
                            }
                        }
                    } else {
                        waitCount++;
                        if ( waitCount <= 50 ) {  // 10 Sekunden
                            setTimeout( function () { checkForAddHomeZoneMap( waitCount ); }, 200);
                        } else return;
                    }
                }
                checkForAddHomeZoneMap( 0 );
            }

            window.addEventListener("load", gclh_map_loaded, false);
            appendCssStyle(".leaflet-control-layers-base {min-width: 200px;}");
        } catch (e) {
            gclh_error("Add Layers & Homezone to map", e);
        }
    }

// Add link to Google Maps on GC Map.
    if ( is_page("map") && ( settings_add_link_google_maps_on_gc_map || settings_add_link_osm_on_gc_map || settings_add_link_flopps_on_gc_map || settings_add_link_geohack_on_gc_map ) ) {
        try {
            function getMapCooords() {
                // Mögliche URL Zusammensetzungen, Beispiele:
                // 1. https://www.geocaching.com/map/default.aspx?lat=50.889233&lng=13.386967#?ll=50.89091,13.39551&z=14
                //    https://www.geocaching.com/map/default.aspx?lat=50.889233&lng=13.386967#clist?ll=50.89172,13.36779&z=14
                //    https://www.geocaching.com/map/default.aspx?lat=50.889233&lng=13.386967#pq?ll=50.89204,13.36667&z=14
                //    https://www.geocaching.com/map/default.aspx?lat=50.889233&lng=13.386967#search?ll=50.89426,13.35955&z=14
                // 2. https://www.geocaching.com/map/?ll=50.89093,13.38437#?ll=50.89524,13.35912&z=14
                // 3. https://www.geocaching.com/map/#?ll=50.95397,6.9713&z=15

                var matches = document.location.href.match(/\\?ll=(-?[0-9.]*),(-?[0-9.]*)&z=([0-9.]*)/); // Beispiel 1., 2. und 3. hinten
                var matchesMarker = document.location.href.match(/\\?lat=(-?[0-9.]*)&lng=(-?[0-9.]*)/);  // Beispiel 1. vorne
                if (matchesMarker == null) {
                    var matchesMarker = document.location.href.match(/\\?ll=(-?[0-9.]*),(-?[0-9.]*)#/);  // Beispiel 2. vorne
                    if (matchesMarker == null) {
                        var matchesMarker = matches;                                                     // Beispiel 3.
                    }
                }
                var coords = null;
                if ( matches != null && matchesMarker != null ) {
                    coords = new Object();
                    coords.zoom = matches[3];
                    coords.lat = matches[1];
                    coords.lon = matches[2];
                    coords.markerLat = matchesMarker[1];
                    coords.markerLon = matchesMarker[2];

                    var latd = coords.lat;
                    var lond = coords.lon;
                    sign = latd > 0 ? 1 : -1 ;
                    coords.latOrient = latd > 0 ? 'N' : 'S' ;
                    latd *= sign ;
                    coords.latDeg = Math.floor ( latd ) ;
                    coords.latMin = Math.floor ( ( latd - coords.latDeg ) * 60 ) ;
                    coords.latSec = Math.floor ( ( latd - coords.latDeg - coords.latMin / 60 ) * 3600 ) ;
                    sign = lond > 0 ? 1 : -1 ;
                    coords.lonOrient = lond > 0 ? 'E' : 'W' ;
                    lond *= sign ;
                    coords.lonDeg = Math.floor ( lond ) ;
                    coords.lonMin = Math.floor ( ( lond - coords.lonDeg ) * 60 ) ;
                    coords.lonSec = Math.floor ( ( lond - coords.lonDeg - coords.lonMin / 60 ) * 3600 ) ;
                }
                return coords;
            }

            var urlGoogleMaps = 'https://maps.google.de/maps?q={markerLat},{markerLon}&z={zoom}&ll={lat},{lon}';
            var urlOSM = 'https://www.openstreetmap.org/?#map={zoom}/{lat}/{lon}';
            var urlFlopps = 'http://flopp.net/?c={lat}:{lon}&z={zoom}&t=OSM&f=n&m=&d=';
            var urlGeoHack = "https://tools.wmflabs.org/geohack/geohack.php?pagename=Geocaching&params={latDeg}_{latMin}_{latSec}_{latOrient}_{lonDeg}_{lonMin}_{lonSec}_{lonOrient}";

            function replaceData( str, coords ) {
                re = new RegExp( "\{[a-zA-Z]+\}", "g");
                var replacements = str.match(re);
                if ( replacements != null ) {
                    for ( var i=0; i<replacements.length; i++ ) {
                        var replacement = replacements[i];
                        var name = replacement.substring(1,replacement.length-1);
                        if ( name in coords ) {
                            str = str.replace( replacement, coords[name] );
                        }
                    }
                }
                return str;
            }

            function callGeoService( url, in_same_tab ) {
                var coords = getMapCooords();
                if ( coords != null ) {
                    url = replaceData( url, coords );
                    if ( in_same_tab ) {
                      location = url;
                    } else {
                      window.open( url );
                    }
                } else {
                    alert('This map has no geographical coordinates in its link. Just zoom or drag the map, afterwards this will work fine.');
                }
            }

            function initGeoServiceControl( ) {
                var div = document.createElement("div");
                div.setAttribute("id", "gclh_geoservices_control");
                div.setAttribute("class", "leaflet-control-layers leaflet-control");
                var aTag = document.createElement("a");
                aTag.setAttribute("id", "gclh_google_button");
                aTag.setAttribute("class", "leaflet-control-layers-toggle");
                aTag.setAttribute("title", "Show area on Google Maps");
                aTag.setAttribute("style", "background-image: url('/images/silk/map_go.png');");
                var side = document.getElementsByClassName("leaflet-top leaflet-right")[0];

                div.appendChild(aTag);
                side.appendChild(div);

                $("#gclh_geoservices_control").append('<div id="gclh_geoservices_list" class="leaflet-control-layers-base" style="display: none;"></div>');
                $("#gclh_geoservices_list").append('<b style="padding:5px; font-size:120%; color: #000000;">Go to ...</b>');
                if ( settings_add_link_google_maps_on_gc_map ) {
                    $("#gclh_geoservices_list").append('<a id="gclh_geoservice_googlemaps" style="padding: 5px; cursor: pointer; color: #000;" >Google Maps</a>');
                }
                if ( settings_add_link_osm_on_gc_map ) {
                    $("#gclh_geoservices_list").append('<a id="gclh_geoservice_osm" style="padding: 5px; cursor: pointer; color: #000;">Openstreepmap</a>');
                }
                if ( settings_add_link_flopps_on_gc_map ) {
                    $("#gclh_geoservices_list").append('<a id="gclh_geoservice_flopps" style="padding: 5px; cursor: pointer; color: #000;">Flopp\'s Map</a>');
                }
                if ( settings_add_link_geohack_on_gc_map ) {
                    $("#gclh_geoservices_list").append('<a id="gclh_geoservice_geohack" style="padding: 5px; cursor: pointer; color: #000;">GeoHack</a>');
                }

                $("#gclh_geoservice_googlemaps").click( function() { callGeoService( urlGoogleMaps, settings_switch_to_google_maps_in_same_tab ); }  );
                $("#gclh_geoservice_osm").click( function() { callGeoService( urlOSM, settings_switch_to_osm_in_same_tab ); } );
                $("#gclh_geoservice_flopps").click( function() { callGeoService( urlFlopps, settings_switch_to_flopps_in_same_tab ); } );
                $("#gclh_geoservice_geohack").click( function() { callGeoService( urlGeoHack, settings_switch_to_geohack_in_same_tab ); } );

                $("#gclh_geoservices_control").hover(
                    function() {
                        $("#gclh_geoservices_control").addClass("leaflet-control-layers-expanded");
                        $("#gclh_google_button").hide();
                        $("#gclh_geoservices_list").show();
                    },
                    function() {
                        $("#gclh_geoservices_control").removeClass("leaflet-control-layers-expanded");
                        $("#gclh_geoservices_list").hide();
                        $("#gclh_google_button").show();
                    }
                );

                // Damit auch mehr als 2 Buttons handlebar sind, also auch beispielsweise noch GC Vote.
                appendCssStyle(".leaflet-control-layers + .leaflet-control {position: unset; right: unset;} .leaflet-control {clear: unset}");
            }

            function attachGeoServiceControl( waitCount ) {
                // Prüfen, ob die Layers schon vorhanden sind, erst dann den Button hinzufügen.
                if ( $('.leaflet-control-layers-base').find('input.leaflet-control-layers-selector')[0] ) {
                    // Damit Button nicht ständig den Platz wechselt, um 1 Sekunde verzögern, dann sollte er links von den anderen Buttons stehen.
                    setTimeout( initGeoServiceControl, 1000);
                } else {
                    waitCount++;
                    if ( waitCount <= 50 ) {  // 10 Sekunden lang
                        setTimeout( function () { attachGeoServiceControl( waitCount ); }, 200);
                    } else return;
                }
            }
            attachGeoServiceControl( 0 );

        } catch (e) {
            gclh_error("add link google maps on gc map", e);
        }
    }

// Hide found/hidden Caches on Map.
    if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/map\//) && !document.location.href.match(/^https?:\/\/www\.geocaching\.com\/map\/default.aspx\?pq/)) { // Nicht bei PQ-Anzeige
        try {
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
            // Apply Cache Type Filter.
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
        } catch (e) {
            gclh_error("Hide found/hidden Caches / Cache Types on Map", e);
        }
    }

// Display Google-Maps warning. Hier wird eine Warnmeldung ausgegeben, wenn Leaflet-Map nicht aktiv ist.
    if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/map\//)) {
        try {
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
                    setTimeout( function () { checkMap( waitCount ); }, 1000);
                } else {
                    // Wenn Leaflet-Map nicht aktiv und die Auswahl zu "Set Map Preferences" auch nicht angezeigt wird,
                    // dann ist wohl Google aktiv. Prüfen, ob zuvor Leaflet-Map aktiv war, der Status sich also geändert
                    // hat, dann Meldung ausgeben und neuen Status "nicht aktiv" merken.
                    if ( getValue("gclhLeafletMapActive", true) ) {
                        var mess = "Please note, that GC little helper only supports\n"
                                 + "the Leaflet-Map. You are using the Google-Map.\n\n"
                                 + "You can change the map in the left sidebar with \n"
                                 + "the button \"Set Map Preferences\".";
                        alert( mess );
                        setValue("gclhLeafletMapActive", false);
                    }
                }
            }
            checkMap( 0 );
        } catch (e) {
            gclh_error("Display Google-Maps warning", e);
        }
    }

// Count Fav-points.
    if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/favorites\.aspx/)) {
        try {
            var table = document.getElementsByClassName("Table BottomSpacing")[0];
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
        } catch (e) {
            gclh_error("Count Fav-Points", e);
        }
    }

// Improve Fieldnotes.
    if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/fieldnotes\.aspx/)) {
        try {
            function gclh_select_all() {
                var state = document.getElementById("gclh_all").checked;
                var all = document.getElementsByTagName("input");
                for (var i = 0; i < all.length; i++) {
                    if (all[i].id.match(/ctl00_ContentBody_LogList/)) {
                        all[i].checked = state;
                    }
                }
            }

            // Mark duplicate field notes.
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

            var table = document.getElementsByClassName("Table")[0];
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

                // Select All - on Top.
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

                // Summenzeile.
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
        } catch (e) {
            gclh_error("Improve Fieldnotes", e);
        }
    }

// Edit-Link to own Caches in Profile.
    if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/(default\.aspx|owned\.aspx)$/) || document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/$/)) {
        try {
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
        } catch (e) {
            gclh_error("Additinal Links to own Caches in Profile1", e);
        }
    }

// Image-Link at own caches.
    if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/owned\.aspx/)) {
        try {
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
        } catch (e) {
            gclh_error("Additinal Links to own Caches in Profile2", e);
        }
    }

// Hide archived at own caches.
    if (settings_hide_archived_in_owned && document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/owned\.aspx/)) {
        try {
            var links = document.getElementsByTagName("a");
            for (var i = 0; i < links.length; i++) {
                if (links[i].href.match(/\/seek\/cache_details\.aspx\?/)) {
                    var archived = links[i].classList.contains("OldWarning");
                    if (archived) {
                        links[i].parentNode.parentNode.style.display = 'none';
                    }
                }
            }
        } catch (e) {
            gclh_error("Failed to hide archived caches in owned list", e);
        }
    }

// Hide TBs/Coins in Profile.
    if (settings_hide_visits_in_profile && document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\//)) {
        try {
            $(".Table.WordWrap tr").filter(function (index) {
                return $(this).find("img[src$='logtypes/75.png']").length !== 0;
            }).remove();
        } catch (e) {
            gclh_error("Hide TBs/Coins in Profile", e);
        }
    }

// Post log from Listing (inline).
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
            if (document.getElementsByClassName('BottomSpacing')[0]) document.getElementsByClassName('BottomSpacing')[0].style.display = "none";
            if (document.getElementsByClassName('BottomSpacing')[1]) document.getElementsByClassName('BottomSpacing')[1].style.display = "none";
            if (document.getElementById('divAdvancedOptions')) document.getElementById('divAdvancedOptions').style.display = "none";
            if (!settings_log_inline_tb && document.getElementById('ctl00_ContentBody_LogBookPanel1_TBPanel')) document.getElementById('ctl00_ContentBody_LogBookPanel1_TBPanel').style.display = "none";
            if (document.getElementById('ctl00_ContentBody_uxVistOtherListingLabel')) document.getElementById('ctl00_ContentBody_uxVistOtherListingLabel').style.display = "none";
            if (document.getElementById('ctl00_ContentBody_uxVistOtherListingGC')) document.getElementById('ctl00_ContentBody_uxVistOtherListingGC').style.display = "none";
            if (document.getElementById('ctl00_ContentBody_uxVisitOtherListingButton')) document.getElementById('ctl00_ContentBody_uxVisitOtherListingButton').style.display = "none";
            if (document.getElementById('ctl00_divContentSide')) document.getElementById('ctl00_divContentSide').style.display = "none";
            if (document.getElementById('UtilityNav')) document.getElementById('UtilityNav').style.display = "none";
            if (document.getElementsByTagName("footer")[0]) document.getElementsByTagName("footer")[0].style.display = "none";
            if (document.getElementsByClassName('container')[1]) document.getElementsByClassName('container')[1].style.display = "inline";
            var links = document.getElementsByTagName("a");
            for (var i = 0; i < links.length; i++) {
                if ( !links[i].id.match(/(AllDroppedOff|AllVisited|AllClear)/i) ) {
                    links[i].setAttribute("target", "_blank");
                }
            }
            var css = "";
            css += "#Content, #Content .container, .span-20 {width: " + ( parseInt( getValue("settings_new_width") ) - 60 ) + "px;} ";
            css += ".PostLogList .Textarea {height: 175px;} ";
            appendCssStyle(css);
        }
    } catch (e) {
        gclh_error("Inline Logging", e);
    }

// Post log from PMO-Listing as Basic Member(inline).
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

        // Im aufgebauten iframe, quasi nicht im Cache Listing.
        } else if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/log\.aspx\?(ID|guid|wp)\=[a-zA-Z0-9-]*\&gclh\=small/)) { // Hide everything to be smart for the iframe :)
            if (document.getElementsByTagName('html')[0]) document.getElementsByTagName('html')[0].style.backgroundColor = "#FFFFFF";
            if (document.getElementsByTagName("header")[0]) document.getElementsByTagName("header")[0].style.display = "none";
            if (document.getElementById('ctl00_divBreadcrumbs')) document.getElementById('ctl00_divBreadcrumbs').style.display = "none";
            if (document.getElementsByClassName('BottomSpacing')[0]) document.getElementsByClassName('BottomSpacing')[0].style.display = "none";
            if (document.getElementsByClassName('BottomSpacing')[1]) document.getElementsByClassName('BottomSpacing')[1].style.display = "none";
            if (document.getElementById('divAdvancedOptions')) document.getElementById('divAdvancedOptions').style.display = "none";
            if (!settings_log_inline_tb && document.getElementById('ctl00_ContentBody_LogBookPanel1_TBPanel')) document.getElementById('ctl00_ContentBody_LogBookPanel1_TBPanel').style.display = "none";
            if (document.getElementById('ctl00_ContentBody_uxVistOtherListingLabel')) document.getElementById('ctl00_ContentBody_uxVistOtherListingLabel').style.display = "none";
            if (document.getElementById('ctl00_ContentBody_uxVistOtherListingGC')) document.getElementById('ctl00_ContentBody_uxVistOtherListingGC').style.display = "none";
            if (document.getElementById('ctl00_ContentBody_uxVisitOtherListingButton')) document.getElementById('ctl00_ContentBody_uxVisitOtherListingButton').style.display = "none";
            if (document.getElementById('ctl00_divContentSide')) document.getElementById('ctl00_divContentSide').style.display = "none";
            if (document.getElementById('UtilityNav')) document.getElementById('UtilityNav').style.display = "none";
            if (document.getElementsByTagName("footer")[0]) document.getElementsByTagName("footer")[0].style.display = "none";
            if (document.getElementsByClassName('container')[1]) document.getElementsByClassName('container')[1].style.display = "inline";
            var links = document.getElementsByTagName("a");
            for (var i = 0; i < links.length; i++) {
                if ( !links[i].id.match(/(AllDroppedOff|AllVisited|AllClear)/i) ) {
                    links[i].setAttribute("target", "_blank");
                }
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
    if ( settings_logit_for_basic_in_pmo ) {
        if ( document.getElementsByClassName('premium') ) {
            try {
                var premiumTeile = document.getElementsByClassName('premium');
                for (var i = 0; i < premiumTeile.length; i++) {
                    if ( premiumTeile[i].href.match(/\/seek\/log\.aspx\?ID=/) ) {
                        premiumTeile[i].addEventListener("click", function() { buildLogItLink( this ); }, false);
                    }
                }
            } catch (e) {
                gclh_error("logit for basic in pmo", e);
            }
        }
    }
    // Link ausführen trotz Tool Tipp.
    function buildLogItLink( premiumTeil ) {
        if ( premiumTeil.href.match(/\/seek\/log\.aspx\?ID=/) ) {
            if ( premiumTeil.href.match(/www\.geocaching\.com\//) ) { var href = premiumTeil.href; }
            else { var href = "https://www.geocaching.com" +  premiumTeil.href; }
            location = href;
        }
    }

// Append '&visitcount=1' to all geochecker.com links (on listing pages).
    if (settings_visitCount_geocheckerCom && is_page("cache_listing")) {
        try {
            $('a[href^="http://www.geochecker.com/index.php?code="]').filter(':not([href*="visitcount=1"])').attr('href', function (i, str) {
                return str + '&visitcount=1';
            }).attr('rel', 'noreferrer');
        } catch (e) {
            gclh_error("Append '&visitcount=1' to all geochecker.com links (on listing pages)", e);
        }
    }

// Show amount of different Coins in public profile.
    if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/profile\//) && document.getElementById('ctl00_ContentBody_ProfilePanel1_lnkCollectibles') && document.getElementById('ctl00_ContentBody_ProfilePanel1_lnkCollectibles').className == "Active") {
        try {
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
        } catch (e) {
            gclh_error("Show Coin-Sums", e);
        }
    }

//--> $$065 Begin of insert
//<-- $$065 End of insert

// Auto-Visit.
    if (settings_autovisit && document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/log\.aspx/) && !document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/log\.aspx\?LUID=/) && !document.getElementById('ctl00_ContentBody_LogBookPanel1_CoordInfoLinkControl1_uxCoordInfoCode')) {
        try {
            function gclh_autovisit_save() {
                var match = this.value.match(/([0-9]*)/);
                if (!this.checked) {
                    setValue("autovisit_" + match[1], false);
                } else {
                    setValue("autovisit_" + match[1], true);
                }
            }

            // Add new option.
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

            // Select AutoVisit.
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
        } catch (e) {
            gclh_error("Autovisit", e);
        }
    }

// VIP. VUP.
    try {
        if ( settings_show_vip_list                                                                    &&
             !isMemberInPmoCache()                                                                     &&
             $('.li-user-info').last().children().first()                                              &&
             !document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/geocaches\.aspx/)    &&         // Nicht bei Geocaching Logs
             !document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/travelbugs\.aspx/)   &&         // Nicht bei Travelbugs
             !document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/benchmarks\.aspx/)   &&         // Nicht bei Benchmarks
             !document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/favorites\.aspx/)    &&         // Nicht bei Eigene Favoriten, weil hier auch gegebenenfalls das Pseudonym steht
             ( is_page("cache_listing")                                                                   ||      // Cache Listing
               document.location.href.match(/^https?:\/\/www\.geocaching\.com\/track\/details\.aspx/)     ||      // TB Listing
               document.location.href.match(/^https?:\/\/www\.geocaching\.com\/(seek|track)\/log\.aspx/)  ||      // Post, Edit, View Cache-Logs und TB-Logs
               document.location.href.match(/^https?:\/\/www\.geocaching\.com\/email\/\?guid=/)           ||      // Mail schreiben
               document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/inventory\.aspx/)      ||      // TB Inventar
               document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my/)                       ||      // Profil
               document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/default\.aspx/)        ||      // Profil (Quicklist)
               document.location.href.match(/^https?:\/\/www\.geocaching\.com\/profile\//)                ||      // Öffentliches Profil
               document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/myfriends\.aspx/)         )) { // Friends
            var myself = $('.li-user-info').last().children().first().text();
            var gclh_build_vip_list = function () {};

            // Arrays für VIPs, VUPs aufbauen:
            // ---------------
            var global_vips = getValue("vips", false);
            if (!global_vips) global_vips = new Array();
            else {
                global_vips = global_vips.replace(/, (?=,)/g, ",null");
                global_vips = JSON.parse(global_vips);
            }
            if (settings_process_vup) {
                var global_vups = getValue("vups", false);
                if (!global_vups) global_vups = new Array();
                else {
                    global_vups = global_vups.replace(/, (?=,)/g, ",null");
                    global_vups = JSON.parse(global_vups);
                }
            } else global_vups = new Array();

            // Add to VIPs, VUPs:
            // ---------------
            function gclh_add_vip() {
                [global_vips, global_vups] = gclh_add_vipvup(this.name, global_vips, "vip", global_vups, "vup");
                gclh_build_vip_list();
                setLinesColorVip(this.name);
            }
            function gclh_add_vup() {
                [global_vups, global_vips] = gclh_add_vipvup(this.name, global_vups, "vup", global_vips, "vip");
                gclh_build_vip_list();
                setLinesColorVip(this.name);
            }
            function gclh_add_vipvup(user, addAry, addDesc, delAry, delDesc){
                addAry.push(user);
                addAry.sort(caseInsensitiveSort);
                setValue(addDesc+"s", JSON.stringify(addAry));
                var icons = document.getElementsByName(user);
                for (var i = 0; i < icons.length; i++) {
                    var img = icons[i].childNodes[0];
                    if (img.getAttribute("class") == "gclh_"+addDesc) {
                        img.setAttribute("src", (addDesc == "vip" ? global_img_vip_on : global_img_vup_on));
                        img.setAttribute("title", "Remove " + user + " from " + addDesc.toUpperCase() + "-List");
                        icons[i].removeEventListener("click", (addDesc == "vip" ? gclh_add_vip : gclh_add_vup), false);
                        icons[i].addEventListener("click", (addDesc == "vip" ? gclh_del_vip : gclh_del_vup), false);

                        if (addDesc == "vup" && is_page("cache_listing")) {
                            var rows = $(icons[i]).closest('td').find('.LogContent').children();
                            if (rows && rows[0]) {
                                rows[0].innerHTML = "censored";
                                rows[0].style.fontStyle = "unset";
                                for (var k = 1; k < rows.length; k++) {
                                    rows[k].style.display = "none";
                                }
                            }
                        }
                    }
                }
                if (in_array(user, delAry)) delAry = gclh_del_vipvup(user, delAry, delDesc);
                return [addAry, delAry];
            }

            // Del from VIPs, VUPs:
            // ---------------
            function gclh_del_vip() {
                global_vips = gclh_del_vipvup(this.name, global_vips, "vip");
                gclh_build_vip_list();
                setLinesColorVip(this.name);
            }
            function gclh_del_vup() {
                global_vups = gclh_del_vipvup(this.name, global_vups, "vup");
                gclh_build_vip_list();
                setLinesColorVip(this.name);
            }
            function gclh_del_vipvup(user, delAry, delDesc) {
                var delAryNew = new Array();
                for (var i = 0; i < delAry.length; i++) {
                    if (delAry[i] != user) delAryNew.push(delAry[i]);
                }
                delAry = delAryNew;
                setValue(delDesc+"s", JSON.stringify(delAry));
                var icons = document.getElementsByName(user);
                for (var i = 0; i < icons.length; i++) {
                    var img = icons[i].childNodes[0];
                    if (img.getAttribute("class") == "gclh_"+delDesc){
                        img.setAttribute("src", (delDesc == "vip" ? global_img_vip_off : global_img_vup_off));
                        img.setAttribute("title", "Add " + user + " to " + delDesc.toUpperCase() + "-List");
                        icons[i].removeEventListener("click", (delDesc == "vip" ? gclh_del_vip : gclh_del_vup), false);
                        icons[i].addEventListener("click", (delDesc == "vip" ? gclh_add_vip : gclh_add_vup), false);

                        if (delDesc == "vup" && is_page("cache_listing")) {
                            var rows = $(icons[i]).closest('td').find('.LogContent').children();
                            if (rows && rows[0]) {
                                if (rows.length == 1) {
                                    rows[0].innerHTML = "please refresh page";
                                    rows[0].style.fontStyle = "italic";
                                } else {
                                    rows[0].innerHTML = "";
                                    for (var k = 1; k < rows.length; k++) {
                                        rows[k].style.display = "";
                                    }
                                }
                            }
                        }
                    }
                }
                return delAry;
            }

            // Build VIP, VUP Icons:
            // ---------------
            function gclh_build_vipvup(user, ary, desc, link) {
                if (link == undefined) {
                    var link = document.createElement("a");
                    var img = document.createElement("img");
                    link.appendChild(img);
                } else var img = link.childNodes[0];

                img.setAttribute("class", "gclh_"+desc);
                img.setAttribute("border", "0");
                link.setAttribute("href", "javascript:void(0);");
                link.setAttribute("name", user);
                if (in_array(user, ary)) {
                    img.setAttribute("src", (desc == "vip" ? global_img_vip_on : global_img_vup_on));
                    img.setAttribute("title", "Remove " + user + " from " + desc.toUpperCase() + "-List");
                    link.addEventListener("click", (desc == "vip" ? gclh_del_vip : gclh_del_vup), false);
                } else {
                    img.setAttribute("src", (desc == "vip" ? global_img_vip_off : global_img_vup_off));
                    img.setAttribute("title", "Add " + user + " to " + desc.toUpperCase() + "-List");
                    link.addEventListener("click", (desc == "vip" ? gclh_add_vip : gclh_add_vup), false);
                }
                return link;
            }

            // Listing:
            // --------
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
                    if (links[i].href.match(/https?:\/\/www\.geocaching\.com\/profile\/\?guid=/) && links[i].parentNode.className != "logOwnerStats" && links[i].childNodes[0] && !links[i].childNodes[0].src) {
                        if (links[i].id) links[i].name = links[i].id; // To be able to jump to this location

                        var matches = links[i].href.match(/https?:\/\/www\.geocaching\.com\/profile\/\?guid=([a-zA-Z0-9]*)/);
                        var user = decode_innerHTML(links[i]);
                        if (links[i].parentNode.id == "ctl00_ContentBody_mcd1") {
                            user = owner;
                        }
                        // Build VUP Icon.
                        if (settings_process_vup && user != global_activ_username) {
                            link = gclh_build_vipvup(user, global_vups, "vup");
                            links[i].parentNode.insertBefore(link, links[i].nextSibling);
                            links[i].parentNode.insertBefore(document.createTextNode(" "), links[i].nextSibling);
                        }
                        // Build VIP Icon.
                        link = gclh_build_vipvup(user, global_vips, "vip");
                        links[i].parentNode.insertBefore(link, links[i].nextSibling);
                        links[i].parentNode.insertBefore(document.createTextNode(" "), links[i].nextSibling);
                    }
                }

                // Show VIP List.
                var map = document.getElementById("ctl00_ContentBody_detailWidget");
                var box = document.createElement("div");
                var headline = document.createElement("h3");
                var body = document.createElement("div");
                box.setAttribute("class", "CacheDetailNavigationWidget NoPrint");
                headline.setAttribute("class", "WidgetHeader");
                body.setAttribute("class", "WidgetBody");
                body.setAttribute("id", "gclh_vip_list");
                headline.innerHTML = "<img width='16' height='16' style='margin-bottom: -2px;' title='Very important person List' alt='VIP-List' src='" + http + "://www.geocaching.com/images/icons/icon_attended.gif\'> VIP-List";
                if ( settings_make_vip_lists_hideable ) {
                    headline.innerHTML = "<img id='lnk_gclh_vip_list' title='' src='' style='cursor: pointer'> " + headline.innerHTML;
                }
                box.appendChild(headline);
                box.appendChild(body);
                box.setAttribute("style", "margin-top: 1.5em;");
                map.parentNode.insertBefore(box, map);
                if ( settings_make_vip_lists_hideable ) {
                    showHideBoxCL("lnk_gclh_vip_list", true);
                    document.getElementById("lnk_gclh_vip_list").addEventListener("click", function() { showHideBoxCL(this.id, false); }, false);
                }

                // Show VIP List "not found".
                if (settings_vip_show_nofound) {
                    var box2 = document.createElement("div");
                    var headline2 = document.createElement("h3");
                    var body2 = document.createElement("div");
                    box2.setAttribute("class", "CacheDetailNavigationWidget NoPrint");
                    headline2.setAttribute("class", "WidgetHeader");
                    body2.setAttribute("class", "WidgetBody");
                    body2.setAttribute("id", "gclh_vip_list_nofound");
                    headline2.innerHTML = "<img width='16' height='16' style='margin-bottom: -2px;' title='Very important person List \"not found\"' alt='VIP-List \"not found\"' src='" + http + "://www.geocaching.com/images/icons/icon_attended.gif'> VIP-List \"not found\"";
                    if ( settings_make_vip_lists_hideable ) {
                        headline2.innerHTML = "<img id='lnk_gclh_vip_list_nofound' title='' src='' style='cursor: pointer'> " + headline2.innerHTML;
                    }
                    box2.appendChild(headline2);
                    box2.appendChild(body2);
                    box2.innerHTML = box2.innerHTML;
                    map.parentNode.insertBefore(box2, map);
                    if ( settings_make_vip_lists_hideable ) {
                        showHideBoxCL("lnk_gclh_vip_list_nofound", true);
                        document.getElementById("lnk_gclh_vip_list_nofound").addEventListener("click", function() { showHideBoxCL(this.id, false); }, false);
                    }
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

                    // Liste "not found"-VIPs.
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
                            if (in_array(user, global_vips) || user == owner_name) {
                                if (!log_infos_long[i]["date"]) continue;

                                if (log_infos_long[i]["icon"].match(/\/(2|10)\.png$/)) users_found.push(user); // fuer not found liste

                                var span = document.createElement("span");
                                var profile = document.createElement("a");
                                profile.setAttribute("href", http + "://www.geocaching.com/profile/?u=" + urlencode(user));
                                profile.innerHTML = user;
                                if ( settings_show_mail_in_viplist && settings_show_mail && settings_show_vip_list ) noBreakInLine( profile, 93, user );
                                else noBreakInLine( profile, 112, user );
                                if (owner_name && owner_name == user) profile.style.color = '#8C0B0B';
                                else if (user == myself) profile.style.color = 'rgb(91, 200, 51)';
                                span.appendChild(profile);
                                // Build VIP Icon. Wenn es Owner ist und Owner in VUP array, dann VUP Icon.
                                if (owner_name && owner_name == user && in_array(user, global_vups)) link = gclh_build_vipvup(user, global_vups, "vup");
                                else link = gclh_build_vipvup(user, global_vips, "vip");
                                // Log-Date and Link.
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
                            // Build VIP Icon. Wenn es Owner ist und Owner in VUP array, dann VUP Icon.
                            if (owner_name && owner_name == user && in_array(user, global_vups)) link = gclh_build_vipvup(user, global_vups, "vup");
                            else link = gclh_build_vipvup(user, global_vips, "vip");
                            list.appendChild(span);
                            list.appendChild(document.createTextNode("   "));
                            list.appendChild(link);
                            if ( settings_show_mail_in_viplist && settings_show_mail && settings_show_vip_list ) buildSendIcons( list, user, "per u" );

                            // Log-Links.
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
                        for (var i = 0; i < global_vips.length; i++) {
                            gclh_build_list(global_vips[i]);
                        }
                    }

                    // "Not found"-Liste erstellen.
                    if (document.getElementById("gclh_vip_list_nofound")) {
                        for (var i = 0; i < global_vips.length; i++) {
                            if ( getValue("settings_load_logs_with_gclh") == false ) break;
                            var user = global_vips[i];
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
                            // Build VIP Icon.
                            link = gclh_build_vipvup(user, global_vips, "vip");
                            list_nofound.appendChild(span);
                            list_nofound.appendChild(document.createTextNode("   "));
                            list_nofound.appendChild(link);
                            if ( settings_show_mail_in_viplist && settings_show_mail && settings_show_vip_list ) buildSendIcons( list_nofound, user, "per u" );
                            list_nofound.appendChild(document.createElement("br"));
                        }
                    }
                };
                gclh_build_vip_list();

            // Profile:
            // --------
            } else if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\//) && document.getElementById("ctl00_ContentBody_uxBanManWidget")) {
                function build_box_vipvup(desc) {
                    var widget = document.createElement("div");
                    var headline = document.createElement("h3");
                    var box = document.createElement("div");

                    widget.setAttribute("class", "YourProfileWidget");
                    headline.setAttribute("class", "WidgetHeader");
                    headline.appendChild(document.createTextNode("All my " + desc.toUpperCase() + "s"));
                    var box2 = document.createElement("div");
                    box2.setAttribute("class", "WidgetBody");
                    box2.setAttribute("style", "padding: 0;");   // Wegen 2 WidgetBodys
                    box.setAttribute("id", "box_" + desc + "s");
                    box.setAttribute("class", "WidgetBody");

                    widget.appendChild(headline);
                    widget.appendChild(box2);
                    box2.appendChild(box);
                    document.getElementById("ctl00_ContentBody_uxBanManWidget").parentNode.insertBefore(widget, document.getElementById("ctl00_ContentBody_uxBanManWidget"));
                }
                function fill_box_vipvup(ary, desc) {
                    var box = document.getElementById("box_" + desc + "s");
                    if (!box) return false;
                    box.innerHTML = "";

                    for (var i = 0; i < ary.length; i++) {
                        var user = ary[i];
                        var span = document.createElement("span");
                        var profile = document.createElement("a");
                        profile.setAttribute("href", http + "://www.geocaching.com/profile/?u=" + urlencode(user));
                        profile.innerHTML = user;
                        span.appendChild(profile);
                        // Build VIP, VUP Icon.
                        link = gclh_build_vipvup(user, ary, desc);
                        box.appendChild(span);
                        box.appendChild(document.createTextNode("   "));
                        box.appendChild(link);
                        if ( settings_show_mail_in_allmyvips && settings_show_mail && settings_show_vip_list ) buildSendIcons( box, user, "per u" );
                        box.appendChild(document.createElement("br"));
                    }
                }
                build_box_vipvup("vip");
                fill_box_vipvup(global_vips, "vip");
                if (settings_process_vup) {
                    build_box_vipvup("vup");
                    fill_box_vipvup(global_vups, "vup");
                }
                // Verarbeitung wird durch gclh_add... und gclh_del... angestoßen. Dadurch werden beide Listen hier neu aufgebaut.
                gclh_build_vip_list = function () {
                    fill_box_vipvup(global_vips, "vip");
                    if (settings_process_vup) {
                        fill_box_vipvup(global_vups, "vup");
                    }
                };

            // Friends list:
            // -------------
            } else if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/myfriends\.aspx/)) {
                gclh_build_vip_list = function () {
                    // Delete VIP, VUP Icons. Sie werden bei einer Deaktivierung bzw. Aktivierung immer neu aufgebaut. Dadurch wird verhindert, dass
                    // das VUP Icon nicht stehen bleibt, wenn es als Ersatz für das VIP Icon eingebaut wurde und das VUP Icon nun deaktiviert wurde.
                    $('.gclh_vip').closest('a').remove();
                    $('.gclh_vup').closest('a').remove();
                    // VIP, VUP Icons aufbauen.
                    var links = document.getElementsByTagName('a');
                    for (var i = 0; i < links.length; i++) {
                        if (links[i].href.match(/https?:\/\/www\.geocaching\.com\/profile\/\?guid=/) && links[i].id) {
                            var user = links[i].innerHTML.replace(/&amp;/, '&');
                            // Build VUP Icon.
                            if (settings_process_vup && settings_show_vup_friends) {
                                link = gclh_build_vipvup(user, global_vups, "vup");
                                links[i].parentNode.insertBefore(link, links[i].nextSibling);
                                links[i].parentNode.insertBefore(document.createTextNode("   "), links[i].nextSibling);
                            }
                            // Build VIP Icon. Wenn User in VUP array, dann VUP Icon, wenn ansonsten das Icon nicht angezeigt werden würde.
                            if (settings_process_vup && !settings_show_vup_friends && in_array(user, global_vups)) link = gclh_build_vipvup(user, global_vups, "vup");
                            else link = gclh_build_vipvup(user, global_vips, "vip");
                            links[i].parentNode.insertBefore(link, links[i].nextSibling);
                            links[i].parentNode.insertBefore(document.createTextNode("   "), links[i].nextSibling);
                        }
                    }
                };
                gclh_build_vip_list();

            // TB Listing. Post, Edit, View Cache-Logs und TB-Logs. Mail schreiben.
            // ---------------
            } else if ( document.location.href.match(/^https?:\/\/www\.geocaching\.com\/track\/details\.aspx/)     ||
                        document.location.href.match(/^https?:\/\/www\.geocaching\.com\/(seek|track)\/log\.aspx/)  ||
                        document.location.href.match(/^https?:\/\/www\.geocaching\.com\/email\/\?guid=/)           ||
                        document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/inventory\.aspx/)         ) {
                gclh_build_vip_list = function () {}; // There is no list to show, but this function will be called from gclh_del_vip/gclh_add_vip
                var links = document.getElementsByTagName('a');

                for (var i = 0; i < links.length; i++) {
                    if (links[i].href.match(/https?:\/\/www\.geocaching\.com\/profile\/\?guid=/)) {
                        // Wenn es sich hier um den User "In the hands of ..." im TB Listing handelt, dann nicht weitermachen, weil der
                        // Username nicht wirklich bekannt ist.
                        if ( links[i].id == "ctl00_ContentBody_BugDetails_BugLocation" ) continue;
                        var matches = links[i].href.match(/https?:\/\/www\.geocaching\.com\/profile\/\?guid=([a-zA-Z0-9]*)/);
                        var user = decode_innerHTML(links[i]);
                        // Build VUP Icon.
                        if (settings_process_vup && user != global_activ_username) {
                            link = gclh_build_vipvup(user, global_vups, "vup");
                            link.children[0].setAttribute("style", "margin-left: 0px; margin-right: 0px;");
                            links[i].parentNode.insertBefore(link, links[i].nextSibling);
                            links[i].parentNode.insertBefore(document.createTextNode(" "), links[i].nextSibling);
                        }
                        // Build VIP Icon.
                        link = gclh_build_vipvup(user, global_vips, "vip");
                        link.children[0].setAttribute("style", "margin-left: 0px; margin-right: 0px;");
                        links[i].parentNode.insertBefore(link, links[i].nextSibling);
                        links[i].parentNode.insertBefore(document.createTextNode(" "), links[i].nextSibling);
                    }
                }

            // Public Profile:
            // ---------------
            } else if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/profile\//) && document.getElementById("ctl00_ContentBody_ProfilePanel1_lblMemberName")) {
                gclh_build_vip_list = function () {}; // There is no list to show, but ths function will be called from gclh_del_vip/gclh_add_vip
                var user = document.getElementById("ctl00_ContentBody_ProfilePanel1_lblMemberName").innerHTML.replace(/&amp;/, '&');
                // Build VIP Icon.
                link = gclh_build_vipvup(user, global_vips, "vip");
                link.children[0].setAttribute("style", "margin-left: 0px; margin-right: 0px");
                document.getElementById("ctl00_ContentBody_ProfilePanel1_lblMemberName").appendChild(document.createTextNode(" "));
                document.getElementById("ctl00_ContentBody_ProfilePanel1_lblMemberName").appendChild(link);
                // Build VUP Icon.
                if (settings_process_vup && user != global_activ_username) {
                    link = gclh_build_vipvup(user, global_vups, "vup");
                    link.children[0].setAttribute("style", "margin-left: 0px; margin-right: 0px");
                    document.getElementById("ctl00_ContentBody_ProfilePanel1_lblMemberName").appendChild(document.createTextNode(" "));
                    document.getElementById("ctl00_ContentBody_ProfilePanel1_lblMemberName").appendChild(link);
                }
            }
        }
    } catch (e) {
        gclh_error("VIP", e);
    }

// Improve inventory list in cache listing.
    if ( is_page("cache_listing") ) {
        // Trackable Namen kürzen, damit nicht umgebrochen wird, und Title setzen.
        if ( document.getElementById("ctl00_ContentBody_uxTravelBugList_uxInventoryLabel") ) {
            try {
                var inventoryWidget = document.getElementById("ctl00_ContentBody_uxTravelBugList_uxInventoryLabel").parentNode.parentNode;
                var inventoryWidgetBody = inventoryWidget.getElementsByClassName("WidgetBody")[0];
                var inventory = inventoryWidgetBody.getElementsByTagName("span");
                for ( var i = 0; i < inventory.length; i++ ) {
                    noBreakInLine( inventory[i], 203, inventory[i].innerHTML );
                }
            } catch (e) {
                gclh_error("improve inventory list in cache listing", e);
            }
        }
    }

// Wenn nicht alle eigenen Logs geladen werden, weil beispielsweise das Laden der Seite über den Browser gestoppt wurde, dann
// angeben wieviele Logs geladen wurden und das Datum des letzten geladenen Logs angeben.
    if ( document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/logs\.aspx?/) ) {
        if ( document.getElementById("divContentMain") && document.getElementById("divContentMain").children[2] && document.getElementsByTagName("tr")[0] ) {
            try {
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
            } catch (e) {
                gclh_error("stopped logs loaded", e);
            }
        }
    }

// Improve "My Profile".
    if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my/)) {
        try {
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
            if ( document.getElementsByTagName("body")[0] ) document.getElementsByTagName("body")[0].appendChild(script);

            var boxes = document.getElementsByClassName("WidgetHeader");

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
        } catch (e) {
            gclh_error("Improve MyProfile", e);
        }
    }

// Link to bigger pictures for owner added images.
    if (settings_link_big_listing && is_page("cache_listing")) {
        var a = document.getElementsByTagName("a");
        for(var i = 0; i < a.length; i++) {
            if ((a[i].href.search('img.geocaching.com') > 0) && (a[i].href.search('/large/') > 0)) {
                a[i].href = a[i].href.replace('/large/', '/');
            }
        }
    }

// Show warning for not available images.
    if (settings_img_warning && is_page("cache_listing")) {
        try {
            // Function for images in listing.
            function checkImage(element, newUrl, oldUrl) {
                var img = new Image();
                img.onerror =
                    function(){
                        var hlp = element.title + '\n\n';
                        element.title = hlp.trim() + element.src;
                        element.src = newUrl;
                        element.ondblclick =
                            function(){
                                alert('Original image URL:\n\n' + oldUrl);
                            };
                    };
                img.src = element.src;
            }
            // Function for background image.
            function checkBGImage(element, newUrl) {
                var img = new Image();
                if (element.background.length == 0) return;
                img.onerror =
                    function(){
                        element.background = newUrl;
                    };
                img.src = element.background;
            }
            // Check all images in listing.
            var idElements = ["ctl00_ContentBody_ShortDescription", "ctl00_ContentBody_LongDescription"];
            for (var idx = 0; idx < idElements.length; idx++) {
                var a = document.getElementById(idElements[idx]).getElementsByTagName("img");
                for(var i = 0; i < a.length; i++) {
                    checkImage(a[i], 'https://rawgit.com/2Abendsegler/GClh/master/images/image_not_available.svg', a[i].src);
                }
            }
            // Check background image(s).
            var a = document.getElementsByTagName("body");
            for (var i = 0; i < a.length; i++) {
                checkBGImage(a[i], 'https://rawgit.com/2Abendsegler/GClh/master/images/image_not_available_background.svg');
            }
        } catch (e) {
            gclh_error("Show warning for not available images", e);
        }
    }

// Show thumbnails.
    if (settings_show_thumbnails && (is_page("cache_listing") || document.location.href.match(/^https?:\/\/www\.geocaching\.com\/(seek\/gallery\.aspx?|track\/details\.aspx?|track\/gallery\.aspx?|profile\/)/))) {
        try {
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

            // Um Profile Foto herum Pseudo a Tag aufbauen.
            var profileFoto = false;
            if ( is_page("publicProfile") && document.getElementById("ctl00_ContentBody_ProfilePanel1_lnkProfile") &&
                 document.getElementById("ctl00_ContentBody_ProfilePanel1_lnkProfile").className == "Active" &&
                 document.getElementById("ctl00_ContentBody_ProfilePanel1_uxProfilePhoto") ) {
                var profileFoto = true;
                var image = document.getElementById("ctl00_ContentBody_ProfilePanel1_uxProfilePhoto");
                var aPseudo = document.createElement("a");
                aPseudo.appendChild(image.cloneNode(true));
                image.parentNode.replaceChild(aPseudo, image);
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

            var regexp = new RegExp(settings_spoiler_strings, "i");

            for (var i = 0; i < links.length; i++) {
                if ( is_page("cache_listing") && links[i].href.match(/^https?:\/\/img\.geocaching\.com\/cache/) ) {
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

                    if ( settings_spoiler_strings != "" && links[i].innerHTML.match(regexp) ) {  // Spoiler String
                        var div = document.createElement("div");
                        div.innerHTML = "Spoiler warning";
                        div.setAttribute("style", "transform: rotate(-30grad); width: 130px; position: relative; top: -90px; left: -5px; font-size: 15px;");
                        links[i].childNodes[0].src = "https://raw.githubusercontent.com/2Abendsegler/GClh/master/images/gclh_logo.png";
                        links[i].childNodes[0].style.opacity = "0.05";
                        links[i].childNodes[3].remove();
                        links[i].parentNode.appendChild(div);
                    }

                // Bilder Gallery Cache, TB und Profil:
                } else if ( document.location.href.match(/^https?:\/\/www\.geocaching\.com\/(seek\/gallery\.aspx?|track\/gallery\.aspx?|profile\/)/) &&
                            links[i].href.match(/^https?:\/\/img\.geocaching\.com\/(cache|track)\//) && links[i].childNodes[1] && links[i].childNodes[1].tagName == 'IMG' ) {
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

                    if ( document.location.href.match(/^https?:\/\/www\.geocaching\.com\/seek\/gallery\.aspx?/) ) {
                        if ( settings_spoiler_strings != "" && links[i].dataset.title && links[i].dataset.title.match(regexp) ) {  // Spoiler String
                            var div = document.createElement("div");
                            div.innerHTML = "Spoiler warning";
                            div.setAttribute("style", "transform: rotate(-30grad); width: 130px; position: relative; top: -110px; left: -5px; font-size: 15px;");
                            links[i].childNodes[1].src = "https://raw.githubusercontent.com/2Abendsegler/GClh/master/images/gclh_logo.png";
                            links[i].childNodes[1].style.opacity = "0.05";
                            links[i].childNodes[1].style.height = "100px";
                            links[i].childNodes[2].remove();
                            links[i].parentNode.appendChild(div);
                        }
                    }

                // Bilder im TB Listing:
                } else if ( document.location.href.match(/^https?:\/\/www\.geocaching\.com\/track\/details\.aspx?/) &&
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

                // Profile Foto:
                } else if ( profileFoto && links[i].childNodes[0] && links[i].childNodes[0].tagName == 'IMG' &&
                            links[i].childNodes[0].src.match(/^https?:\/\/img\.geocaching\.com\/user\/avatar/) ) {
                    var thumb = links[i].childNodes[0];
                    var img = document.createElement('img');
                    img.src = thumb.src.replace(/img\.geocaching\.com\/user\/avatar/, "s3.amazonaws.com/gs-geo-images");
                    img.className = "gclh_max";
                    var span = document.createElement('span');
                    span.appendChild(img);
                    links[i].className += " gclh_thumb";
                    links[i].onmouseover = placeToolTip;
                    links[i].appendChild(span);
                }
            }
        } catch (e) {
            gclh_error("Show Thumbnails", e);
        }
    }

// Show gallery-Images in 2 instead of 4 cols.
    if (settings_show_big_gallery && document.location.href.match(/^https?:\/\/www\.geocaching\.com\/(seek\/gallery\.aspx?|track\/gallery\.aspx?|profile\/)/)) {
        try {
            var links = document.getElementsByTagName("a");
            var tds = new Array();
            // Make images bigger.
            for (var i = 0; i < links.length; i++) {
                if (links[i].href.match(/^https?:\/\/img\.geocaching\.com\/(cache|track)\//) && links[i].childNodes[1] && links[i].childNodes[1].tagName == 'IMG') {
                    var thumb = links[i].childNodes[1];
                    thumb.style.width = "300px";
                    thumb.style.height = "auto";
                    thumb.src = thumb.src.replace(/thumb\//, "");
                    tds.push(thumb.parentNode.parentNode);
                }
            }

            // Change from 4 Cols to 2.
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
        } catch (e) {
            gclh_error("Show Bigger Images", e);
        }
    }

// Log-Template definieren.
    if ( is_page("cache_listing") ) {
        try {
            global_MailTemplate = urlencode( buildSendTemplate().replace(/#Receiver#/ig, "__Receiver__") );
            global_MailTemplate = global_MailTemplate.replace(/__Receiver__/ig, "${UserName}");

            var vupUserString = 'if UserName == "#" ';
            var vupHideAvatarString  = 'if (UserName != "#" ';
            var vupHideCompleteLog = vupUserString;
            if (settings_process_vup && global_vups && global_vups.length > 0) {
                for (var i = 0; i < global_vups.length; i++) {
                    vupUserString += '|| UserName == "' + global_vups[i] + '"';
                    if (settings_vup_hide_avatar) vupHideAvatarString += '&& UserName !== "' + global_vups[i] + '"';
                }
                if (settings_vup_hide_avatar && settings_vup_hide_log) vupHideCompleteLog = vupUserString;
            }
            vupHideAvatarString  += ')';

            var mailNewWin = "";
            if ( settings_mail_icon_new_win) mailNewWin = 'target="_blank" ';
            var messageNewWin = "";
            if ( settings_message_icon_new_win) messageNewWin = 'target="_blank" ';

            var new_tmpl = "";
            new_tmpl +=
                '    {{' + vupHideCompleteLog  + '}}' +
                '    <tr class="log-row display_none" data-encoded="${IsEncoded}" style="display:none" >' +
                '    {{else}}' +
                '    <tr class="log-row" data-encoded="${IsEncoded}" >' +
                '    {{/if}}' +
                '        <td>' +
                '            <div class="FloatLeft LogDisplayLeft" >' +
                '                <p class="logOwnerProfileName">' +
                '                    <strong>' +
                '                    {{' + vupHideAvatarString  + '}}' +
                '                        <a id="${LogID}" name="${LogID}" href="/profile/?guid=${AccountGuid}">${UserName}</a>' +
                '                    {{else}}' +
                '                        <a id="${LogID}" name="${LogID}" href="/profile/?guid=${AccountGuid}">V.U.P.</a>' +
                '                    {{/if}}' +
                '                    </strong>' +
                '                </p>' +
                '                <p class="logIcons">' +
                '                    <strong>' +
                '                        <a class="logOwnerBadge">' +
                '                            {{if creator}}<img title="${creator.GroupTitle}" src="${creator.GroupImageUrl}" style="vertical-align: baseline;">{{/if}}</a>';
            if (settings_show_vip_list) new_tmpl +=
                '                        <a href="javascript:void(0);" name="${UserName}" class="gclh_vip"><img class="gclh_vip" border=0 style="margin-left: 0px; margin-right: 0px"></a>';
            if (settings_process_vup) new_tmpl +=
                '                        {{if UserName !== "' + global_activ_username + '" }}' +
                '                        <a href="javascript:void(0);" name="${UserName}" class="gclh_vup"><img class="gclh_vup" border=0 style="margin-left: 0px; margin-right: 0px"></a>' +
                '                        {{/if}}';
            if (settings_show_mail) new_tmpl +=
                '                        {{if UserName !== "' + global_activ_username + '" }}' +
                '                        <a ' + mailNewWin + 'href="' + http + '://www.geocaching.com/email/?guid=${AccountGuid}&text=' + global_MailTemplate + '"><img border=0 title="Send a mail to ${UserName}" src="' + global_mail_icon + '"></a>' +
                '                        {{/if}}';
            if (settings_show_message) new_tmpl +=
                '                        {{if UserName !== "' + global_activ_username + '" }}' +
                '                        <a ' + messageNewWin + 'href="' + http + '://www.geocaching.com/account/messagecenter?recipientId=${AccountGuid}&text=' + global_MailTemplate + '"><img border=0 title="Send a message to ${UserName}" src="' + global_message_icon + '"></a>' +
                '                        {{/if}}';
            new_tmpl +=
                '                        &nbsp;&nbsp;' +
                '                        <a title="Top" href="#gclh_top" style="color: #000000; text-decoration: none; float: right; padding-left: 6px;">↑</a>' +
                '                    </strong>' +
                '                </p>' +
                '                <p class="logOwnerAvatar">' +
                '                    <a href="/profile/?guid=${AccountGuid}">';
            if (!settings_hide_avatar) new_tmpl +=
                '                        {{' + vupHideAvatarString  + ' && AvatarImage}}' +
                '                        <img width="48" height="48" src="' + http + '://img.geocaching.com/user/avatar/${AvatarImage}">' +
                '                        {{else}}' +
                '                        <img width="48" height="48" src="/images/default_avatar.jpg">' +
                '                        {{/if}}';
            new_tmpl +=
                '                </a></p>' +
                '                <p class="logOwnerStats">' +
                '                    {{' + vupHideAvatarString  + ' && (GeocacheFindCount > 0) }}' +
                '                    <img title="Caches Found" src="/images/icons/icon_smile.png"> ${GeocacheFindCount}' +
                '                    {{/if}}' +
                '                </p>' +
                '            </div>' +
                '            <div class="FloatLeft LogDisplayRight">' +
                '                <div class="HalfLeft LogType">' +
                '                    <strong>' +
                '                        <img title="${LogType}" alt="${LogType}" src="/images/logtypes/${LogTypeImage}">&nbsp;${LogType}</strong><small class="gclh_logCounter"></small></div>' +
                '                <div class="HalfRight AlignRight">' +
                '                    <span class="minorDetails LogDate">${Visited}</span></div>' +
                '                <div class="Clear LogContent markdown-output">' +
                '                    {{if LatLonString.length > 0}}' +
                '                    <strong>${LatLonString}</strong>' +
                '                    {{/if}}' +
                '                    {{' + vupUserString + '}}' +
                '                    <p class="LogText">censored</p>' +
                '                    {{else}}' +
                '                    <p class="LogText">{{html LogText}}</p>' +
                '                    {{/if}}' +
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
    }

// Hide greenToTopButton.
    if (settings_hide_top_button) {
        $("#topScroll").attr("id", "_topScroll").hide();
    }

// Overwrite Log-Template and Log-Load-Function.
    if (settings_load_logs_with_gclh && is_page("cache_listing") && !document.getElementById("ctl00_divNotSignedIn") && document.getElementById('tmpl_CacheLogRow')) {
        try {
            // To Top Link.
            var a = document.createElement("a");
            a.setAttribute("href", "#");
            a.setAttribute("name", "gclh_top");
            document.getElementsByTagName("body")[0].insertBefore(a, document.getElementsByTagName("body")[0].childNodes[0]);

            var new_tmpl_block = document.createElement("script");
            new_tmpl_block.type = "text/x-jquery-tmpl";
            new_tmpl_block.innerHTML = new_tmpl;
            new_tmpl_block.setAttribute("id", "tmpl_CacheLogRow_gclh");
            document.getElementsByTagName("body")[0].appendChild(new_tmpl_block);

            // Override the standart templates (for pre-LogLoad use).
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

            // Reinit initalLogs.
            var tbody = (document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table")).getElementsByTagName("tbody");
            if (tbody.length > 0) {
                tbody = tbody[0];
                if (tbody.children.length > 0 && browser != "chrome") {
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

            // Build VIP Icons.
            function gclh_add_vip_icon() {
                var elements = $(document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table")).find("a.gclh_vip").not(".gclh_vip_hasIcon");
                for (var i = 0; i < elements.length; i++) {
                    var link = elements[i];
                    link = gclh_build_vipvup(link.name, global_vips, "vip", link); // Ist oben bei VIP. VUP.
                    unsafeWindow.$(link).addClass("gclh_vip_hasIcon");
                }
                if (settings_process_vup) gclh_add_vup_icon();
            }
            // Build VUP Icons.
            function gclh_add_vup_icon() {
                var elements = $(document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table")).find("a.gclh_vup").not(".gclh_vup_hasIcon");
                for (var i = 0; i < elements.length; i++) {
                    var link = elements[i];
                    link = gclh_build_vipvup(link.name, global_vups, "vup", link); // Ist oben bei VIP. VUP.
                    unsafeWindow.$(link).addClass("gclh_vup_hasIcon");
                }
            }

            // Rebuild function - but with full control.
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
                        // Stop the scrolling if the last page is reached.
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
                                window.postMessage("gclh_add_vip_icon", "https://www.geocaching.com");
                                window.postMessage("setLinesColorInCacheListing", "https://www.geocaching.com");
                            } else {
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

            // Load all logs.
            function gclh_load_all(logs) {
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
                        } else {
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
                        setMarkerDisableDynamicLogLoad();
                        if (document.getElementById("gclh_show_log_counter")) document.getElementById("gclh_show_log_counter").style.visibility = "";
                    }
                }

                var load_all = document.createElement("a");
                load_all.appendChild(document.createTextNode("Show all logs"));
                load_all.setAttribute("href", "javascript:void(0);");
                load_all.setAttribute("id", "gclh_load_all_logs");
                document.getElementById("ctl00_ContentBody_uxLogbookLink").parentNode.appendChild(document.createTextNode(" | "));
                document.getElementById("ctl00_ContentBody_uxLogbookLink").parentNode.appendChild(load_all);
                showLogCounterLink();

                document.getElementById("ctl00_ContentBody_uxLogbookLink").parentNode.style.margin = "0";
                var para = document.getElementById('ctl00_ContentBody_lblFindCounts').nextSibling.nextSibling.nextSibling.nextSibling;
                if (para && para.nodeName == 'P') {
                    para.className = para.className + ' Clear';
                }

                load_all.addEventListener("click", gclh_load_all_logs, false);
            }

            // Filter logs.
            function gclh_filter(logs) {
                function gclh_filter_logs() {
                    if (!this.childNodes[0]) return false;
                    var log_type = this.childNodes[0].title;
                    if (!log_type) return false;
                    if (log_type.match(/VIP/)) log_type = "VIP";
                    if (this.name && this.name == "vip_list") {
                        document.getElementById("ctl00_ContentBody_lblFindCounts").scrollIntoView();
                        window.scrollBy(0, -30);
                    }
                    if (settings_show_owner_vip_list) var vip_owner = get_real_owner();
                    else var vip_owner = "#";
                    if (!logs) return false;

                    var tbodys = (document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table")).getElementsByTagName("tbody");
                    for (var i = 0; i < tbodys.length; i++) {
                        (document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table")).removeChild(tbodys[i]);
                    }
                    if (browser === "firefox") {
                        var logsToAdd = [];
                        for (var i = 0; i < logs.length; i++) {
                            if (logs[i] && (logs[i].LogType == log_type || (log_type == "VIP" && (in_array(logs[i].UserName, global_vips) || logs[i].UserName == vip_owner)))) {
                                logsToAdd.push(logs[i]);
                            }
                        }
                        injectPageScript("var unsafeWindow = unsafeWindow||window; " + gclh_dynamic_load.toString() + " var settings_hide_top_button=" + settings_hide_top_button + "; ");
                        injectPageScript("(" + addNewLogLines.toString() + ")(\"" + encodeURIComponent(JSON.stringify(logsToAdd)) + "\");");
                        window.postMessage("gclh_add_vip_icon", "https://www.geocaching.com");
                        window.postMessage("setLinesColorInCacheListing", "https://www.geocaching.com");
                    } else {
                        for (var i = 0; i < logs.length; i++) {
                            if (logs[i] && (logs[i].LogType == log_type || (log_type == "VIP" && (in_array(logs[i].UserName, global_vips) || logs[i].UserName == vip_owner)))) {
                                var newBody = unsafeWindow.$(document.createElement("TBODY"));
                                unsafeWindow.$("#tmpl_CacheLogRow_gclh").tmpl(logs[i]).appendTo(newBody);
                                injectPageScript("$('a.tb_images').fancybox({'type': 'image', 'titlePosition': 'inside'});");
                                unsafeWindow.$(document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table")).append(newBody.children());
                            }
                        }
                        gclh_add_vip_icon();
                        setLinesColorInCacheListing();
                    }
                    setMarkerDisableDynamicLogLoad();
                    if (document.getElementById("gclh_show_log_counter")) document.getElementById("gclh_show_log_counter").style.visibility = "hidden";
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
                if (settings_show_vip_list) {
                    var link = document.createElement("a");
                    link.setAttribute("href", "javascript:void(0);");
                    link.setAttribute("style", "text-decoration: 'none'; padding-right: 18px;");
                    link.setAttribute("name", "logs");
                    link.addEventListener("click", gclh_filter_logs, false);
                    var img = document.createElement("img");
                    img.setAttribute("src", global_logs_vip_icon);
                    img.setAttribute("title", "VIP logs");
                    link.appendChild(img);
                    new_legend.appendChild(link);
                }
                document.getElementById('ctl00_ContentBody_lblFindCounts').replaceChild(new_legend, legend);

                if (document.getElementById("lnk_gclh_vip_list")) {
                    var side = document.getElementById("lnk_gclh_vip_list").parentNode;
                    var link = document.createElement("a");
                    link.setAttribute("href", "javascript:void(0);");
                    link.setAttribute("style", "padding-left: 12px;");
                    link.setAttribute("name", "vip_list");
                    link.addEventListener("click", gclh_filter_logs, false);
                    var img = document.createElement("img");
                    img.setAttribute("src", global_logs_vip_icon);
                    img.setAttribute("style", "margin-bottom: -2px;");
                    img.setAttribute("title", "VIP logs");
                    link.appendChild(img);
                    side.appendChild(link);
                }
            }

            // Search logs.
            function gclh_search(logs) {
                function gclh_search_logs(e) {
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
                    } else {
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
                    setMarkerDisableDynamicLogLoad();
                    if (document.getElementById("gclh_show_log_counter")) document.getElementById("gclh_show_log_counter").style.visibility = "hidden";
                }

                if (!document.getElementById("ctl00_ContentBody_lblFindCounts").childNodes[0]) return false;
                var form = document.createElement("form");
                var search = document.createElement("input");
                form.setAttribute("action", "javascript:void(0);");
                form.appendChild(search);
                form.style.display = "inline";
                search.setAttribute("type", "text");
                search.setAttribute("size", "10");
                search.addEventListener("keyup", gclh_search_logs, false);
                document.getElementById('ctl00_ContentBody_lblFindCounts').childNodes[0].appendChild(document.createTextNode("Search in logtext: "));
                document.getElementById('ctl00_ContentBody_lblFindCounts').childNodes[0].appendChild(form);
            }

            // Marker to disable dynamic log-load.
            function setMarkerDisableDynamicLogLoad() {
                var marker = document.createElement("a");
                marker.setAttribute("id", "gclh_all_logs_marker");
                document.getElementsByTagName("body")[0].appendChild(marker);
                $("#pnlLazyLoad").hide();
            }

            // Load "num" Logs.
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
                    // Disable scroll Function on Page.
                    if (browser === "chrome" || browser === "firefox") {
                        injectPageScriptFunction(disablePageAutoScroll, "()");
                    } else {
                        disablePageAutoScroll();
                    }

                    if (browser !== "firefox") {
                        (document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table")).removeEventListener('DOMNodeInserted', loadListener);
                    }

                    // Hide initial Logs.
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
                    gclh_load_all(logs);
                    gclh_filter(logs);
                    gclh_search(logs);

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
                var logsCount = parseInt(settings_show_all_logs_count);
                if (logsCount == 0) logsCount = 5000;
                else if (logsCount < 26) logsCount = 26;
                else if (logsCount%2 != 0) logsCount += 1;
                gclh_load_logs( logsCount);
            } else gclh_load_logs(30);
        } catch (e) {
            gclh_error("Replace Log-Loading function", e);
        }
    }
    // Zeilen in Cache Listings in Zebra und für User, für Owner, für Reviewer und für VIP einfärben.
    function setLinesColorInCacheListing() {
        if ( is_page("cache_listing") ) {
            // ('find("tr")' reicht hier nicht wegen der Bilder.)
            var lines = $( document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table") ).find("tbody").find("tr.log-row:not(.gclh_colored,.display_none)");
            lines.addClass("gclh_colored");
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
        } else if ( document.location.href.match(/^https?:\/\/www\.geocaching\.com\/track\/details\.aspx/) ) {
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
        if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/bookmarks\/(view\.aspx\?guid=|bulk\.aspx\?listid=|view\.aspx\?code=)/) && document.getElementById('ctl00_ContentBody_QuickAdd')) {
            var lines = $("table.Table").find("tbody").find("tr");
            setLinesColorInZebra( settings_show_common_lists_in_zebra, lines, 2 );
            setLinesColorUser( "settings_show_common_lists_color", "user", lines, 2, "" );
        // TB Listing: Zeilen in TB Listings in Zebra, für User, für Owner, für Reviewer und für VIP einfärben.
        } else if ( document.location.href.match(/^https?:\/\/www\.geocaching\.com\/track\/details\.aspx\?/) ) {
            var lines = $("table.Table").find("tbody").find("tr");
            if ( lines.length > 1 ) {
                var linesNew = lines.slice(0, -1);
                var owner = document.getElementById("ctl00_ContentBody_BugDetails_BugOwner").innerHTML;
                setLinesColorInZebra( settings_show_tb_listings_in_zebra, linesNew, 2 );
                setLinesColorUser( "settings_show_tb_listings_color", "user,owner,reviewer,vips", linesNew, 2, owner );
            }
        // Andere Listen: Bei Zeilen in anderen Listen gegebenenfalls Einfärbung für Zebra oder User entfernen.
        } else if ( !is_page("cache_listing") ) {
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
                        setLinesColorInZebra( settings_show_common_lists_in_zebra, lines, 1 );                                    //   Einzeilig.
                    }
                }
            }
        }
    } catch (e) {
        gclh_error("Color lines in lists", e);
    }

// Fix decrypted Hint linefeeds.
    if (document.getElementById('div_hint')) {
        try {
            function gclh_repair_hint() {
                document.getElementById('div_hint').innerHTML = document.getElementById('div_hint').innerHTML.replace(/<c>/g, "<p>");
                document.getElementById('div_hint').innerHTML = document.getElementById('div_hint').innerHTML.replace(/<\/c>/g, "</p>");
            }
            gclh_repair_hint();
            document.getElementById('ctl00_ContentBody_lnkDH').addEventListener("click", gclh_repair_hint, false);
        } catch (e) {
            gclh_error("Fix decrypted Hint linefeed", e);
        }
    }

// Hide Navi on SignIn-Overlay.
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

// Save HomeCoords.
    if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/account\/settings\/homelocation/)) {
        try {
            saveHomeCoords();
            document.getElementById('Query').addEventListener('change', saveHomeCoords, false);
        } catch (e) {
            gclh_error('Save Homecoords', e);
        }
    }
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

// Save uid for special bookmarks - From My Profile.
    if (document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\//)) {
        try {
            var links = document.getElementsByTagName("a");
            for (var i = 0; i < links.length; i++) {
                if (links[i].href.match(/\/track\/search\.aspx\?o=1\&uid=/)) {
                    var uid = links[i].href.match(/\/track\/search\.aspx\?o=1\&uid=(.*)/);
                    uid = uid[1];
                    if (getValue("uid", "") != uid) setValue("uid", uid);
                }
            }
        } catch (e) {
            gclh_error("Save uid", e);
        }
    }

// Improve cache matrix on statistics page and profile page and handle cache search links in list or map.
    try {
        // Soll eigene Statistik gepimpt werden.
        if ( ( settings_count_own_matrix || settings_count_own_matrix_show_next ) && isOwnStatisticsPage() ) {
            var own = true;
        // Soll fremde Statistik gepimpt werden.
        } else if ( settings_count_foreign_matrix &&
                    document.location.href.match(/^https?:\/\/www\.geocaching\.com\/profile\/(.*)(\?guid=|\?u=)/) &&
                    !document.getElementById('ctl00_ContentBody_lblUserProfile').innerHTML.match(": " + $('.li-user-info').last().children().first().text()) ) {
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
                // Nächste mögliche Matrix farblich kennzeichnen und Search Link und Title setzen.
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
                                cell.style.backgroundColor = color;
                                switch (diff) {
                                    case 1: cell.style.backgroundColor = cell.style.backgroundColor.replace(/rgb/i, "rgba").replace(/\)/, ",0.6)"); break;
                                    case 2: cell.style.backgroundColor = cell.style.backgroundColor.replace(/rgb/i, "rgba").replace(/\)/, ",0.4)"); break;
                                    case 3: cell.style.backgroundColor = cell.style.backgroundColor.replace(/rgb/i, "rgba").replace(/\)/, ",0.25)"); break;
                                }
                                if ( settings_count_own_matrix_links_radius != 0 ) {
                                    var terrain = parseInt(cell.id.match(/^([1-9]{1})(_{1})([1-9]{1})$/)[3]) * 0.5 + 0.5;
                                    var difficulty = parseInt(cell.id.match(/^([1-9]{1})(_{1})([1-9]{1})$/)[1]) * 0.5 + 0.5;
                                    var user = $('.li-user-info').last().children().first().text();
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

// Improve own statistics page and own profile page with own log statistic.
    if ( settings_log_statistic && isOwnStatisticsPage() ) {
        try {
            getLogStatistic( "cache", "https://www.geocaching.com/my/logs.aspx?s=1" );
            getLogStatistic( "track", "https://www.geocaching.com/my/logs.aspx?s=2" );
        } catch (e) {
            gclh_error("improve own log statistic", e);
        }
    }
    function getLogStatistic( type, url, manual ) {
        var logsName = (type == "cache" ? "Cache":"Trackable") + " logs";
        var logsId = "gclh_" + type + "_logs_";

        var get_last = parseInt(getValue(logsId + "get_last"), 10);
        if (!get_last) get_last = 0;
        var reload_after = (settings_log_statistic_reload === "" ? "0" : parseInt(settings_log_statistic_reload, 10) * 60 * 60 * 1000);
        var time = new Date().getTime();

        if ( ( reload_after != 0 && ( get_last + reload_after ) < time ) || manual == true ) {
            if ( manual != true ) outputLogStatisticHeaderFooter( type, logsName, logsId, url );
            outputLogStatisticClear( type, logsName, logsId );
            outputLogStatisticAddWait( type, logsName, logsId );

            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    var logCount = new Array();
                    for (var i = 0; i < 101; i++) {
                        var count = response.responseText.match(new RegExp( "/images/logtypes/" + i + ".png", "g"));
                        if ( count ) {
                            // Das "?" in "(.*?)" bedeutet "nicht gierig", das heißt es wird das erste Vorkommen verwendet.
                            var title = response.responseText.match('/images/logtypes/' + i + '.png"(.*?)title="(.*?)"');
                            if ( title && title[2] ) {
                                if ( type == "track" ) {
                                    if      ( i == 4 )  var lt = "&lt=3";
                                    else if ( i == 13 ) var lt = "&lt=5";
                                    else if ( i == 14 ) var lt = "&lt=10";
                                    else if ( i == 19 ) var lt = "&lt=2";
                                    else if ( i == 48 ) var lt = "&lt=48";
                                    else if ( i == 75 ) var lt = "&lt=75";
                                    else                var lt = "";
                                } else var lt = "&lt=" + i;
                                var logType = new Object();
                                logType["src"] = "/images/logtypes/" + i + ".png";
                                logType["title"] = title[2];
                                logType["href"] = url + lt;
                                logType["count"] = count.length;
                                logType["no"] = i;
                                logCount[logCount.length] = logType;
                            }
                        }
                    }
                    if ( logCount.length > 0 ) setValue( logsId + "get_last", time );
                    setValue( logsId + "count", JSON.stringify(logCount) );
                    var now = new Date().getTime();
                    var generated = Math.ceil(( now - time ) / ( 60 * 1000 )); // In Minuten
                    outputLogStatisticClear( type, logsName, logsId );
                    outputLogStatistic( type, logsName, logsId, generated );
                }
            });
        } else if ( reload_after == 0 && get_last == 0 ) {
            outputLogStatisticHeaderFooter( type, logsName, logsId, url );
            outputLogStatisticDummy( type, logsName, logsId );
        } else {
            var generated = Math.ceil(( time - get_last ) / ( 60 * 1000 )); // In Minuten
            outputLogStatisticHeaderFooter( type, logsName, logsId, url );
            outputLogStatisticClear( type, logsName, logsId );
            outputLogStatistic( type, logsName, logsId, generated );
        }
    }
    function outputLogStatisticHeaderFooter( type, logsName, logsId, url ) {
        if ( (document.getElementById("ctl00_ContentBody_StatsChronologyControl1_YearlyBreakdown") || document.getElementById("ctl00_ContentBody_ProfilePanel1_StatsChronologyControl1_YearlyBreakdown")) ) {
            var side = (document.getElementById("ctl00_ContentBody_StatsChronologyControl1_YearlyBreakdown") || document.getElementById("ctl00_ContentBody_ProfilePanel1_StatsChronologyControl1_YearlyBreakdown"));
        }
        if ( side ) {
            var div = document.createElement("div");
            div.className = (type == "cache" ? "span-9":"span-9 last");
            var html = '';
            html += '    <br> <h3> <a href="' + url + '" title="' + logsName + '" style="text-decoration: unset; color: rgb(89, 74, 66)" >Total ' + logsName + ':</a> </h3>';
            html += '    <table class="Table">';
            html += '        <thead> <tr> <th scope="col"> Name </th> <th scope="col" class="AlignRight">' + (settings_log_statistic_percentage ? " % " : " ") + '</th> <th scope="col" class="AlignRight"> Count </th> </tr> </thead>';
            html += '        <tfoot style="font-style: normal;">';
            html += '            <tr>';
            html += '                <td><a href="' + url + '" title="' + logsName + '" style="text-decoration: unset; color: rgb(89, 74, 66)" >Total ' + logsName + ':</a></td>';
            html += '                <td id="' + logsId + 'percentage" class="AlignRight"></td>';
            html += '                <td id="' + logsId + 'total" class="AlignRight"></td>';
            html += '            </tr>';
            html += '            <tr>';
            html += '                <td style="background-color: unset; line-height: 1em;"><span id="' + logsId + 'generated" style="font-size: 11px;" ></span></td>';
            html += '                <td class="AlignRight" style="background-color: unset; line-height: 1em;"></td>';
            html += '                <td class="AlignRight" style="background-color: unset; line-height: 1em;"><a id="' + logsId + 'reload" href="javascript:void(0);" style="font-size: 11px;" ></a></td>';
            html += '            </tr>';
            html += '        </tfoot>';
            html += '        <tbody id="' + logsId + 'body"> </tbody>';
            html += '    </table>';
            div.innerHTML = html;
            side.appendChild(div);
            document.getElementById(logsId + "reload").addEventListener( "click", function() { getLogStatistic( type, url, true ); }, false);
        }
    }
    function outputLogStatistic( type, logsName, logsId, generated ) {
        var logCount = getValue(logsId + "count");
        if ( logCount ) logCount = JSON.parse(logCount.replace(/, (?=,)/g, ",null"));
        if ( logCount.length > 0 && document.getElementById(logsId + "body") ) {
            var side = document.getElementById(logsId + "body");
            logCount.sort(function (entryA, entryB) {
                if (entryA.count < entryB.count) return 1;
                if (entryA.count > entryB.count) return -1;
                return 0;
            });
            var total = 0;
            logCount.forEach(function(entry) { total += entry.count; });
            for (var i = 0; i < logCount.length; i++) {
                var tr = document.createElement("tr");
                var html = '';
                html += '    <td class="AlignLeft">';
                html += '        <a title="' + logCount[i]["title"] + ' logs" href="' + logCount[i]["href"] + '" style="text-decoration: unset;" >';
                html += '            <img src="' + logCount[i]["src"] + '" style="vertical-align: sub;" >';
                html += '            <span style="text-decoration: underline; margin-left: 4px;" >' + logCount[i]["title"] + '</span>';
                html += '        </a>';
                html += '    </td>';
                html += '    <td class="AlignRight"> <span>' + (settings_log_statistic_percentage ? (Math.round(logCount[i]["count"] * 100 * 100 / total) / 100).toFixed(2) : "") + '</span> </td>';
                html += '    <td class="AlignRight"> <span>' + logCount[i]["count"] + '</span> </td>';
                tr.innerHTML = html;
                side.appendChild(tr);
            }
            if ( document.getElementById(logsId + "total") ) document.getElementById(logsId + "total").innerHTML = total;
            if ( document.getElementById(logsId + "generated") ) {
                document.getElementById(logsId + "generated").innerHTML = "Generated " + buildTimeString(generated) + " ago";
                var reload_after = parseInt(settings_log_statistic_reload, 10) * 60;
                if ( reload_after > 0 ) document.getElementById(logsId + "generated").title = "Automated reload in " + buildTimeString(reload_after - generated);
            }
            if ( document.getElementById(logsId + "reload") ) {
                document.getElementById(logsId + "reload").innerHTML = "Reload";
                document.getElementById(logsId + "reload").title = "Reload " + logsName;
            }
        } else {
            outputLogStatisticDummy( type, logsName, logsId );
        }
    }
    function buildTimeString(min) {
        if      ( min < 2 )    return (min + " minute");
        else if ( min < 121 )  return (min + " minutes");
        else if ( min < 2881 ) return ("more than " + Math.floor( min / 60 ) + " hours");
        else                   return ("more than " + Math.floor( min / (60*24) ) + " days");
    }
    function outputLogStatisticClear( type, logsName, logsId ) {
        $("#" + logsId + "body").children().each(function () { this.remove(); });
        if ( document.getElementById(logsId + "total") ) document.getElementById(logsId + "total").innerHTML = "";
        if ( document.getElementById(logsId + "generated") ) document.getElementById(logsId + "generated").innerHTML = document.getElementById(logsId + "generated").title = "";
        if ( document.getElementById(logsId + "reload") ) document.getElementById(logsId + "reload").innerHTML = document.getElementById(logsId + "reload").title = "";
    }
    function outputLogStatisticAddWait( type, logsName, logsId ) {
        if ( document.getElementById(logsId + "body") ) {
            var side = document.getElementById(logsId + "body");
            var span_loading = document.createElement("span");
            span_loading.setAttribute("style", "line-height: 36px; margin-left: 5px;");
            span_loading.innerHTML = '<img src="/images/loading2.gif" title="Loading" alt="Loading" style="vertical-align: sub;" />  Loading ' + logsName + ' ...';
            side.appendChild(span_loading);
        }
    }
    function outputLogStatisticDummy( type, logsName, logsId ) {
        if ( document.getElementById(logsId + "body") ) {
            var side = document.getElementById(logsId + "body");
            var span_dummy = document.createElement("span");
            span_dummy.setAttribute("style", "margin-left: 5px;");
            side.appendChild(span_dummy);
        }
        if ( document.getElementById(logsId + "reload") ) {
            document.getElementById(logsId + "reload").innerHTML = "Load";
            document.getElementById(logsId + "reload").title = "Load " + logsName;
        }
    }

// Add mailto-link to profilpage.
    if ((isLocation("/profile/?guid=") || isLocation("/profile/default.aspx?guid=") || isLocation("/profile/?u=") || isLocation("/profile/default.aspx?u=") || isLocation("/profile/?id=") || isLocation("/profile/default.aspx?id=")) && document.getElementById('ctl00_ContentBody_ProfilePanel1_lnkEmailUser')) {
        try {
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
        } catch (e) {
            gclh_error("add mailto-link to profilepage", e);
        }
    }

// Hide Avatars option. Checkbox zum Avatar in Settings, Preferences anpassen, wenn GClh Logs laden soll: "Show other geocachers' profile photos in logs".
    if ( settings_load_logs_with_gclh &&
         document.location.href.match(/^https?:\/\/www\.geocaching\.com\/account\/settings\/preferences/) &&
         document.getElementById("ShowAvatarsInCacheLogs")                                                   ) {
        try {
            var avatar_checkbox = document.getElementById("ShowAvatarsInCacheLogs");
            avatar_checkbox.checked = !settings_hide_avatar;
            avatar_checkbox.disabled = true;
            var avatar_head = avatar_checkbox.parentNode;
            avatar_head.style.cursor = "unset";
            avatar_head.style.opacity = "0.5";
            var link = document.createElement("a");
            link.setAttribute("href", "/my/default.aspx#GClhShowConfig#a#settings_hide_avatar");
            link.appendChild(document.createTextNode("here"));
            var hinweis = document.createElement("span");
            hinweis.setAttribute("class", "label");
            hinweis.appendChild(document.createTextNode("You are using \"" + scriptName + "\" - you have to change this option "));
            hinweis.appendChild(link);
            hinweis.appendChild(document.createTextNode("."));

            avatar_head.appendChild(hinweis);

            var units = $("#DistanceUnits:checked").val();
            if ( units != settings_distance_units ) {
                setValue( 'settings_distance_units', units );
                settings_distance_units = units;
            }
        } catch (e) {
            gclh_error("Hide gc.com Avatar-Option", e);
        }
    }

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
            var lnk_config = " | <br><a href='#GClhShowConfig' id='gclh_config_lnk' name='gclh_config_lnk' style='font-size: 0.9em;' title='" + scriptShortNameConfig + " v" + scriptVersion + (settings_f4_call_gclh_config ? " / Key F4":"") + "' >" + scriptShortNameConfig + "</a>";
            var lnk_sync = " | <a href='#GClhShowSync' id='gclh_sync_lnk' name='gclh_sync_lnk' style='font-size: 0.9em;' title='" + scriptShortNameSync + " v" + scriptVersion + (settings_f10_call_gclh_sync ? " / Key F10":"") + "' >" + scriptShortNameSync + "</a>";
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
        // Chrome cannot handle functions without curly brackets!
        function callConfigDefault() { document.location.href = defaultConfigLink; }
        function callSyncDefault() { document.location.href = defaultSyncLink; }
    } catch (e) {
        gclh_error("Aufbau Links zum Aufruf von Config, Sync und Find Player", e);
    }

// Special Links aus Linklist versorgen.
    try {
        setSpecialLinks();
    } catch (e) {
        gclh_error("Special Links", e);
    }
    function setSpecialLinks() {
        // Links zu Nearest Lists/Map in Linklist, im Config und in Ablistung der Listlist im Profile setzen.
        if (getValue("home_lat", 0) != 0 && getValue("home_lng") != 0) {
            var link = http + "://www.geocaching.com/seek/nearest.aspx?lat=" + (getValue("home_lat") / 10000000) + "&lng=" + (getValue("home_lng") / 10000000) + "&dist=25&disable_redirect=";
            if ( document.getElementsByName("lnk_nearestlist")[0] ) document.getElementsByName("lnk_nearestlist")[0].href = link;
            if ( document.getElementsByName("lnk_nearestlist")[1] ) document.getElementsByName("lnk_nearestlist")[1].href = link;
            if ( document.getElementsByName("lnk_nearestlist_profile")[0] ) document.getElementsByName("lnk_nearestlist_profile")[0].href = link;
            var link = map_url + "?lat=" + (getValue("home_lat") / 10000000) + "&lng=" + (getValue("home_lng") / 10000000);
            if ( document.getElementsByName("lnk_nearestmap")[0] ) document.getElementsByName("lnk_nearestmap")[0].href = link;
            if ( document.getElementsByName("lnk_nearestmap")[1] ) document.getElementsByName("lnk_nearestmap")[1].href = link;
            if ( document.getElementsByName("lnk_nearestmap_profile")[0] ) document.getElementsByName("lnk_nearestmap_profile")[0].href = link;
            var link = http + "://www.geocaching.com/seek/nearest.aspx?lat=" + (getValue("home_lat") / 10000000) + "&lng=" + (getValue("home_lng") / 10000000) + "&dist=25&f=1&disable_redirect=";
            if ( document.getElementsByName("lnk_nearestlist_wo")[0] ) document.getElementsByName("lnk_nearestlist_wo")[0].href = link;
            if ( document.getElementsByName("lnk_nearestlist_wo")[1] ) document.getElementsByName("lnk_nearestlist_wo")[1].href = link;
            if ( document.getElementsByName("lnk_nearestlist_wo_profile")[0] ) document.getElementsByName("lnk_nearestlist_wo_profile")[0].href = link;
        }
        // Links zu den eigenen Trackables in Linklist, im Config und in Ablistung der Listlist im Profile setzen.
        if (getValue("uid", "") != "") {
            var link = http + "://www.geocaching.com/track/search.aspx?o=1&uid=" + getValue("uid");
            if ( document.getElementsByName("lnk_my_trackables")[0] ) document.getElementsByName("lnk_my_trackables")[0].href = link;
            if ( document.getElementsByName("lnk_my_trackables")[1] ) document.getElementsByName("lnk_my_trackables")[1].href = link;
            if ( document.getElementsByName("lnk_my_trackables_profile")[0] ) document.getElementsByName("lnk_my_trackables_profile")[0].href = link;
        }
    }

// Add Download Link to Labs cache Pages.
    if (document.location.href.match(/^https?:\/\/labs\.geocaching\.com\/Adventures\/Details\/(\w|\-)*/)) {
        try {
            // Removing -> background-image: -moz-linear-gradient(left center , rgba(157, 178, 81, 0) 0%, #9db251 100%);
            // This gets a clearer view, if more than one Navigation Button is Displayed.
            for(var i=0 ; i < document.styleSheets.length ; i++){
                if (document.styleSheets[i].href && document.styleSheets[i].href.match(/^https?:\/\/labs\.geocaching\.com\/Content\/css\/main\?[v]\=\w*/)) {
                    document.styleSheets[i].cssRules[384].style['background-image'] = "none";
                }
            }
            // Example Path for Site      /Adventures/Details/90ced6d4-0a22-4c19-a491-7ae17d489c60
            // Example Path for Download  /Adventures/DetailsAsGPX/90ced6d4-0a22-4c19-a491-7ae17d489c60
            // Get current Path with GUID and create download Path
            pathName = window.location.pathname;
            pathValues = pathName.split("/");
            downloadPath = "/Adventures/DetailsAsGPX/" + pathValues[3];
            // Move existing Leaderboard Button to the left.
            // Create new Button with Download Link.
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
        } catch (e) {
            gclh_error("Lab Gpx Downlad Link hinzufügen", e);
        }
    }

// Auto check checkboxes on hide cache process.
    try {
        if (settings_hide_cache_approvals && document.location.href.match(/^https?:\/\/www\.geocaching\.com\/hide\/(report|description)\.aspx/)) {
            $("#ctl00_ContentBody_cbAgreement").prop('checked', true);
            $("#ctl00_ContentBody_chkUnderstand").prop('checked', true);
            $("#ctl00_ContentBody_chkDisclaimer").prop('checked', true);
        }
    } catch (e) {
        gclh_error("Auto check checkboxes on hide cache process", e);
    }

// Banner zu neuen Themen entfernen.
    if (settings_remove_banner) {
        try {
            if (settings_remove_banner_to_mylists_new) $('#divContentMain').find('div.banner').find('a[href*="/account/lists"]').closest('div.banner').remove();
            if (settings_remove_banner_to_mylists_old) $('#activationAlert').find('div.container').find('a[href*="/my/lists.aspx"]').closest('#activationAlert').remove();
            if (settings_remove_banner_for_garminexpress) $('#Content').find('div.banner').find('#uxSendToGarminBannerLink').closest('div.banner').remove();
        } catch (e) {
            gclh_error("remove banner", e);
        }
    }

// Check for Upgrade.
    try {
        function checkForUpgrade( manual ) {
            var next_check = parseInt(getValue("update_next_check"), 10);
            if (!next_check) next_check = 0;
            var time = new Date().getTime();

            if ( next_check < time || manual == true ) {
                var url = "https://raw.githubusercontent.com/2Abendsegler/GClh/master/gc_little_helper_II.user.js";
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
                                                   "Click OK to upgrade.\n\n" +
                                                   "(After upgrade, please refresh your page.)\n";
                                        if (window.confirm(text)) {
                                            btnClose();
                                            window.open(url, '_blank');
                                        } else {
                                            time += 7 * 60 * 60 * 1000; // 1+7 Stunden warten, bis zum nächsten Check.
                                            setValue('update_next_check', time.toString());
                                        }
                                    } else if ( manual == true ) {
                                        var text = "Version " + scriptVersion + " of script \""+ scriptName + "\" \n" +
                                                   "is the latest and actual version.\n";
                                        alert(text);
                                    }
                                }
                            } catch (e) {
                                gclh_error("Check for updates, onload", e);
                            }
                        }
                    });
                }
            }
        }
        checkForUpgrade( false );
    } catch (e) {
        gclh_error("Check for updgrade", e);
    }

// Special days.
    if (is_page("cache_listing")) {
        try {
            var now = new Date();
            var year = now.getYear() + 1900;
            var month = now.getMonth() + 1;
            var date = now.getDate();
            // Ostern 2017.
            if (date >= 16 && date <= 17 && month == 4 && year == 2017) {
                $(".CacheDetailNavigation:first > ul:first").append('<li><img src="https://raw.githubusercontent.com/2Abendsegler/GClh/master/images/easter_bunny_001.jpg" style="margin-bottom: -35px;" title="Happy Easter"></li>');
            }
        } catch (e) {
            gclh_error("Special days", e);
        }
    }

////////////////////////////////////////////////////////////////////////////
// Functions Helper (fun1)
////////////////////////////////////////////////////////////////////////////
    function in_array(search, arr) {
        for (var i = 0; i < arr.length; i++) if (arr[i] == search) return true;
        return false;
    }

    function caseInsensitiveSort(a, b) {
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
        s = encodeURIComponent(s);  // Kodiert alle außer den folgenden Zeichen: A bis Z und a bis z und - _ . ! ~ * ' ( )
        s = s.replace(/~/g, "%7e");
        s = s.replace(/'/g, "%27");
        s = s.replace(/%26amp%3b/g, "%26");
        s = s.replace(/ /g, "+");
        // GC.com codiert - _ . ! * ( ) selbst nicht, daher wird dies hier auch nicht extra behandel
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

// Change coordinates from N/S/E/W Deg Min.Sec to Dec
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
        } else {
            match = coords.match(/(N|S) ([0-9]+)°? ([0-9]+)\.([0-9]+) (E|W) ([0-9]+)°? ([0-9]+)\.([0-9]+)/);

            if (match) {
                var dec1 = parseInt(match[2], 10) + (parseFloat(match[3] + "." + match[4]) / 60);
                if (match[1] == "S") dec1 = dec1 * -1;
                dec1 = Math.round(dec1 * 10000000) / 10000000;

                var dec2 = parseInt(match[6], 10) + (parseFloat(match[7] + "." + match[8]) / 60);
                if (match[5] == "W") dec2 = dec2 * -1;
                dec2 = Math.round(dec2 * 10000000) / 10000000;

                return new Array(dec1, dec2);
            } else {
                match = coords.match(/(N|S) ([0-9]+) ([0-9]+) ([0-9]+)\.([0-9]+) (E|W) ([0-9]+) ([0-9]+) ([0-9]+)\.([0-9]+)/);

                if (match) {
                    var dec1 = parseInt(match[2], 10) + (parseFloat(match[3]) / 60) + (parseFloat(match[4] + "." + match[5]) / 3600);
                    if (match[1] == "S") dec1 = dec1 * -1;
                    dec1 = Math.round(dec1 * 10000000) / 10000000;

                    var dec2 = parseInt(match[7], 10) + (parseFloat(match[8]) / 60) + (parseFloat(match[9] + "." + match[10]) / 3600);
                    if (match[6] == "W") dec2 = dec2 * -1;
                    dec2 = Math.round(dec2 * 10000000) / 10000000;

                    return new Array(dec1, dec2);
                } else {
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

// Change coordinates from Deg to DMS.
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

// Change coordinates from Dec to Deg.
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

// Close the Overlays, Find Player and GClh-Configuration.
    function btnClose( clearUrl ) {
        if ( global_mod_reset ) {
            rcClose();
            return;
        }
        if (document.getElementById('bg_shadow')) document.getElementById('bg_shadow').style.display = "none";
        if (document.getElementById('settings_overlay')) document.getElementById('settings_overlay').style.display = "none";
        if (document.getElementById('sync_settings_overlay')) document.getElementById('sync_settings_overlay').style.display = "none";
        if (document.getElementById('findplayer_overlay')) document.getElementById('findplayer_overlay').style.display = "none";
        if ( clearUrl != false ) document.location.href = clearUrlAppendix( document.location.href, false );
    }

// Function to get the Finds out of the login-Text-Box.
    function get_my_finds() {
        var finds = "";
        if ($('.li-user-info').last().children().length >= 2) {
            if ( $('.li-user-info').last().children().next().text() ) {
                finds = parseInt($('.li-user-info').last().children().next().text().match(/[0-9,\.]+/)[0].replace(/[,\.]/,""));
            }
        }
        return finds;
    }

// Sucht den Original Usernamen des Owners aus dem Listing.
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

// Versteckt den Header in der Map-Ansicht.
    function hide_map_header() {
        var header = document.getElementsByTagName("header");
        if (header[0].style.display != "none") {
            header[0].style.display = "none";
            document.getElementById("Content").style.top = 0;
        } else {
            header[0].style.display = "block";
            document.getElementById("Content").style.top = "63px";
        }
    }

// CSS Style hinzufügen.
    function appendCssStyle( css ) {
        var head = document.getElementsByTagName('head')[0];
        var style = document.createElement('style');
        style.innerHTML = css;
        style.type = 'text/css';
        head.appendChild(style);
    }

// HTML dekodieren, also beispielsweise: "&amp;" in "&" (Beispiel: User "Rajko & Dominik".)
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
        // Wenn eine Einfärbung stattfinden soll.
        } else {
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
        var user = $('.li-user-info').last().children().first().text();
        if ( owner == undefined ) var owner = "";
        var vips = getValue("vips");
        if (vips != false) {
            vips = vips.replace(/, (?=,)/g, ",null");
            vips = JSON.parse(vips);
        }

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
                                    if (in_array(decode_innerHTML( aTags[k] ), vips) ) {
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
//--> $$000 Begin of change                                                 | Hier, v0.8 done
    newParameterOn1 = "<div  style='background-color: rgba(240, 223, 198, 0.6); width: 100%; height: 100%; padding: 2px 0px 2px 2px; margin-left: -2px;'>";
    newParameterOn2 = "<div  style='background-color: rgba(240, 223, 198, 1.0); width: 100%; height: 100%; padding: 2px 0px 2px 2px; margin-left: -2px;'>";
    newParameterOn3 = "<div  style='background-color: rgba(240, 223, 198, 0.3); width: 100%; height: 100%; padding: 2px 0px 2px 2px; margin-left: -2px;'>";
    newParameterLL1 = '<span style="background-color: rgba(240, 223, 198, 0.6); float: right; padding-top: 25px; width: 100%; margin: -22px 2px 0px 0px;"></span>';
    newParameterLL2 = '<span style="background-color: rgba(240, 223, 198, 1.0); float: right; padding-top: 25px; width: 100%; margin: -22px 2px 0px 0px;"></span>';
    newParameterLL3 = '<span style="background-color: rgba(240, 223, 198, 0.3); float: right; padding-top: 25px; width: 100%; margin: -22px 2px 0px 0px;"></span>';
//<-- $$000 End of change
    function newParameterVersionSetzen(version) {
        var newParameterVers = "<span style='font-size: 70%; font-style: italic; float: right; margin-top: -14px; margin-right: 4px;' ";
        if ( version != "" ) { newParameterVers += "title='Implemented with version " + version + "'>" + version + "</span>"; }
        else { newParameterVers += "></span>"; }
        if ( settings_hide_colored_versions ) newParameterVers = "";
        return newParameterVers;
    }
    newParameterOff = "</div>";
    function newParameterLLVersionSetzen(version) {
        var newParameterVers = '<span style="font-size: 70%; font-style: italic; margin-top: 10px; margin-left: -192px; position: absolute; cursor: default;"';
        if ( version != "" ) { newParameterVers += 'title="Implemented with version ' + version + '">' + version + '</span>'; }
        else { newParameterVers += '></span>'; }
        if ( settings_hide_colored_versions ) newParameterVers = "";
        return newParameterVers;
    }
    if ( settings_hide_colored_versions ) newParameterOn1 = newParameterOn2 = newParameterOn3 = newParameterLL1 = newParameterLL2 = newParameterLL3 = newParameterOff = "";

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

// Check, ob man sich im GClh Sync befindet.
    function check_sync_page () {
        var sync_page = false;
        if ( document.getElementById('bg_shadow') && document.getElementById("bg_shadow").style.display == "" ) {
            if ( document.getElementById("sync_settings_overlay") && document.getElementById("sync_settings_overlay").style.display == "" ) {
                sync_page = true;
            }
        }
        return sync_page;
    }

// Prüfen, ob die spezielle Verarbeitung auf der aktuellen Seite erlaubt ist. Spezielle Verarbeitungen sind derzeit: GClh Config, GClh Config Sync, Find Player.
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

// Installationszähler simulieren, weil GitHub das wohl nicht kann.
    function instCount(declaredVersion) {
        var side = document.getElementsByTagName("body")[0];
        var div = document.createElement("div");
        div.id = "gclh_simu";
        div.setAttribute("style", "margin-top: -50px;");
        var prop = ' style="border: none; visibility: hidden; width: 2px; height: 2px;" alt="">';
//--> $$000 Begin of change
        var code = '<img src="https://c.andyhoppe.com/1485234805"' + prop +
                   '<img src="https://c.andyhoppe.com/1485234771"' + prop +
                   '<img src="https://s07.flagcounter.com/countxl/mHeY/bg_FFFFFF/txt_000000/border_CCCCCC/columns_6/maxflags_60/viewers_0/labels_1/pageviews_1/flags_0/percent_0/"' + prop +
                   '<img src="https://www.easycounter.com/counter.php?fuppertv071"' + prop;
//<-- $$000 End of change
        div.innerHTML = code;
        side.appendChild(div);
        setValue("declared_version", scriptVersion);
        setTimeout(function() { $("#gclh_simu").remove(); }, 4000);
    }

// Migrationsaufgaben erledigen für eine neue Version.
    function migrationTasks() {
        // Migrate Mail signature to Mail template (zu v0.4).
        if (getValue("migration_task_01", false) != true) {
            if (settings_show_mail || settings_show_message) {
                var template = "Hi #Receiver#,";
                if (getValue("settings_show_mail_coordslink") == true || getValue("settings_show_message_coordslink") == true ) template += "\n\n#GCTBName# #GCTBLink#";
                if (getValue("settings_mail_signature", "") != "") template += "\n\n" + getValue("settings_mail_signature");
                setValue("settings_mail_signature", template);
            }
            setValue("migration_task_01", true);
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

// GC/TB Name, GC/TB Link, GC/TB Name Link und vorläufiges LogDate ermitteln.
    function getGCTBInfo() {
        var GCTBName = ""; var GCTBLink = ""; var GCTBNameLink = ""; var LogDate = "";
        if ( document.getElementById("ctl00_ContentBody_LogBookPanel1_WaypointLink").nextSibling.nextSibling ) {
            var GCTBName = document.getElementById("ctl00_ContentBody_LogBookPanel1_WaypointLink").nextSibling.nextSibling.nextSibling.innerHTML;
            GCTBName = GCTBName.replace(/'/g,"");
            var GCTBLink = document.getElementById("ctl00_ContentBody_LogBookPanel1_WaypointLink").href;
            var GCTBNameLink = "[" + GCTBName + "](" + GCTBLink + ")";
        }
        if ( document.getElementById('uxDateVisited') ) var LogDate = document.getElementById('uxDateVisited').value;
        return [ GCTBName, GCTBLink, GCTBNameLink, LogDate ];
    }

// Show, hide Box setzen. Beispielsweise die beiden VIP Boxen im Cache Listing. Kann aber auch für andere Dinge genutzt werden.
    function showHideBoxCL( id_lnk, first ) {
        if ( id_lnk.match("lnk_gclh_config_") ) var is_config = true;
        else is_config = false;
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
                setShowHide( lnk, "hide", is_config );
                box.show();
                var showHide = "hide";
                setValue(name_show_box, true);
                if ( !first && is_config ) {
                    document.getElementById(id_lnk).scrollIntoView();
                    window.scrollBy(0, -8);
                }
            } else {
                setShowHide( lnk, "show", is_config );
                box.hide();
                var showHide = "show";
                setValue(name_show_box, false);
            }
            return showHide;
        }
    }
    function setShowHide( row, whatToDo, is_config ) {
        if ( whatToDo == "show" ) {
            row.title = "show";
            if ( is_config == true ) row.src = global_plus_config2;
            else row.src = http + "://www.geocaching.com/images/plus.gif";
        } else {
            row.title = "hide";
            if ( is_config == true ) row.src = global_minus_config2;
            else row.src = http + "://www.geocaching.com/images/minus.gif";
        }
    }

// Show Log Counter.
    function showLogCounterLink() {
        var a = document.createElement("a");
        a.appendChild(document.createTextNode("Show log counter"));
        a.setAttribute("href", "javascript:void(0);");
        a.setAttribute("title", "Show log counter for log type and total");
        a.setAttribute("id", "gclh_show_log_counter");
        a.setAttribute("style", "float: right");
        a.addEventListener("click", showLogCounter, false);
        document.getElementById("ctl00_ContentBody_uxLogbookLink").parentNode.appendChild(a);
        document.getElementById("ctl00_ContentBody_uxLogbookLink").parentNode.style.width = "100%";
        appendCssStyle(".gclh_logCounter {font-size: 10px !important; padding-left: 6px; font-style: italic;}");
    }
    function showLogCounter() {
        try {
            var logCounter = new Object();
            logCounter["all"] = 0;
            var logTypes = document.getElementsByClassName("LogTotals")[0].getElementsByTagName("a");
            for (var i = 0; i < logTypes.length; i++) {
                var matches = logTypes[i].innerHTML.replace(/(,|\.)/g, "").match(/>(\s*)(\d+)/);
                if (matches && matches[2]) {
                    logCounter[logTypes[i].childNodes[0].title] = parseInt(matches[2]);
                    logCounter["all"] += parseInt(matches[2]);
                }
            }
            if (logCounter["all"] != 0) {
                var logs = $('#cache_logs_table2').find('tbody tr td').find('.LogType');
                for (var i = 0; i < logs.length; i++) {
                    var log = logs[i];
                    if (log && log.children[1] && log.children[0].children[0].title && logCounter[log.children[0].children[0].title]) {
                        var logTyp = log.children[0].children[0].title;
                        log.children[1].innerHTML = " Log " + logCounter[logTyp] + " / Total Log " + logCounter["all"];
                        logCounter[logTyp]--;
                        logCounter["all"]--;
                    }
                }
            }
        } catch (e) {
            gclh_error("showLogCounter", e);
        }
    }

// Prüfen, ob die Seite die eigene Statistik ist.
    function isOwnStatisticsPage(){
        if ( ( document.location.href.match(/^https?:\/\/www\.geocaching\.com\/my\/statistics\.aspx/)            ) ||
             ( document.location.href.match(/^https?:\/\/www\.geocaching\.com\/profile/) &&
               document.getElementById("ctl00_ContentBody_ProfilePanel1_lnkStatistics") &&
               document.getElementById("ctl00_ContentBody_ProfilePanel1_lnkStatistics").className == "Active" &&
               document.getElementById('ctl00_ContentBody_lblUserProfile').innerHTML.match(": " + $('.li-user-info').last().children().first().text()) ) ) {
            return true;
        } else return false;
    }

////////////////////////////////////////////////////////////////////////////
// User defined searchs
////////////////////////////////////////////////////////////////////////////
    function create_config_css_search() {
        var css = document.createElement("style");
        var html = "";
        html += ".btn-context {";
        html += "   border: 0;    height: 40px;    margin-top: -4px;    text-indent: -9999px;    width: 30px;    margin-left: -8px; margin-right: 10px;";
        html += "}";
        html += ".btn-user {";
        html += "   background-color: transparent;";
        html += "   background-image: none;";
        html += "   clear: both;";
        html += "   color: #fff;";
        html += "   font-size: .85em;";
        html += "   margin-bottom: 1.75em;";
        html += "   margin-top: 1.75em;";
        html += "   padding-left: 3em;";
        html += "   padding-right: 3em;  ";
        html += "   border: 2px solid #ffffff;";
        html += "   border-radius: 0;";
        html += "}";
        html += ".btn-user-active, .btn-user:hover, .btn-user:active {";
        html += "   background-color: #00b265;";
        html += "   border: 2px solid #00b265;";
        html += "}";
        html += "";
        html += ".btn-iconsvg svg {";
        html += "    width: 22px;";
        html += "    height: 22px;";
        html += "    margin-right: 3px;";
        html += "}       ";
        css.innerHTML = html;
        document.getElementsByTagName('body')[0].appendChild(css);
    }

    function saveFilterSet() {
        setValue("settings_search_data", JSON.stringify(settings_search_data));
    }

    function actionOpen( id ) {
        for (var i = 0; i < settings_search_data.length; i++) {
            if ( settings_search_data[i].id == id ) {
                document.location.href = settings_search_data[i].url;
                break;
            }
        }
    }

    // SaveSas
    function actionRename( id, name ) {
        for (var i = 0; i < settings_search_data.length; i++) {
            if ( settings_search_data[i].id == id ) {
                settings_search_data[i].name = name;
                saveFilterSet();
                break;
            }
        }
    }

    function actionUpdate( id, page ) {
        for (var i = 0; i < settings_search_data.length; i++) {
            if ( settings_search_data[i].id == id ) {
                settings_search_data[i].url = page.split("#")[0];
                saveFilterSet();
                break;
            }
        }
    }

    function actionNew( name, page ) {
        // Find latest id.
        var i = settings_search_data.length;
        var id = -1;
        for (var i = 0; i < settings_search_data.length; i++) {
            if ( id < settings_search_data[i].id ) { id = settings_search_data[i].id; }
        }
        settings_search_data[i] = {};
        settings_search_data[i].id = id+1;
        settings_search_data[i].name = name;
        settings_search_data[i].url = page.split("#")[0];
        saveFilterSet();
    }

    // Delete
    function actionSearchDelete( id ) {
        var settings_search_data_tmp = [];
        for (var i = 0; i < settings_search_data.length; i++) {
            if ( settings_search_data[i].id != id ) {
                settings_search_data_tmp[settings_search_data_tmp.length] = settings_search_data[i];
            }
        }
        settings_search_data = settings_search_data_tmp;
        saveFilterSet();
    }

    function updateUI() {
        if ( $("#searchContextMenu").length == 0 ) {
            var html = "";
            html += '<div id="searchContextMenu" class="pop-modal" style="top: auto; left: auto; width: 100%; position: absolute;">';

            html += '<div id="filter-new" class="add-menu" style="display: none;"><label for="newListName">Save current Filter Set</label>';
            html += '<div class="input-control active">';
            html += '<input id="nameSearch" name="newListName" maxlength="150" placeholder="New Name" type="text">';
            html += '<div class="add-list-status"><button id= "btn-save" class="add-list-submit" type="button" style="display: inline-block;">Save</button></div></div>';
            html += '</div>';

            html += '<div id="filter-edit" class="add-menu" style="display: none;"><label for="newListName">Edit Filter Set <i><span id="filterName"></span></i></label>';
            html += '<div class="input-control active">';
            html += '<input id="filter-name-rename" name="newListName" maxlength="150" placeholder="New Name" type="text">';
            html += '<div class="add-list-status"><button id= "btn-rename" class="add-list-submit" type="button" style="display: inline-block;">Rename</button></div>';
            html += '<div id="div-btn-update" class="add-list-status"><button id="btn-update" class="add-list-submit" type="button" style="display: inline-block;">Update</button></div>';
            html += '</div></div>';

            html += '<label class="add-list-label">Available Filter Sets</label>';
            html += '<ul id="filterlist" class="add-list"></ul>';

            html += '</div>';
            $( "#ctxMenu" ).html(html);

            $('#btn-save').click( function() {
                var name = $("#nameSearch").val();
                if ( name == "" ) {
                    alert("Insert name!");
                    $("#nameSearch").css('background-color', '#ffc9c9');
                    return;
                } else {
                    actionNew( name, document.location.href );
                    $("#nameSearch").css('background-color', '#ffffff');
                }
                hideCtxMenu();
            });

            // rename
            $('#btn-rename').click( function() {
                var id = $(this).data('id');
                var name = $("#filter-name-rename").val();
                actionRename( id, name );
                updateUI();
            });
            // update
            $('#btn-update').click( function() {
                var id = $(this).data('id');
                var update = (document.location.href.indexOf("?")>=0?true:false);
                if ( update ) {
                    actionUpdate( id, document.location.href );
                    hideCtxMenu();
                }
            });
        }
        $("#filter-edit").hide();
        if ( $(".results").length != 0 ) {
            $("#filter-new").show();
        }

        var html = "";
        if ( settings_search_data.length ) {
            settings_search_data.sort(function(a, b){ return a.name.toUpperCase()>b.name.toUpperCase(); });
        }

        for (var i = 0; i < settings_search_data.length; i++) {
            html += '<li data-id="'+settings_search_data[i].id+'">';
            var id = 'data-id="'+settings_search_data[i].id+'"';
            var t = (settings_search_data[i].url == document.location.href.split("#")[0])?true:false;
            html += '<button type="button" class="btn-item-action action-open" '+id+'>'+(t?'<b>':'')+settings_search_data[i].name+(t?'</b>':'')+'</button>';
            html += '<div type="button" title="Remove Filter Set" class="status btn-iconsvg action-delete" '+id+'><svg class="icon icon-svg-button" role="presentation"><use xlink:href="/account/Content/ui-icons/sprites/global.svg#icon-delete"></use></svg></div>';
            html += '<div type="button" title="Change Filter Set" class="status btn-iconsvg action-rename" '+id+'><svg class="icon icon-svg-button" role="presentation"><use xlink:href="/account/Content/ui-icons/sprites/global.svg#icon-more"></use></svg></div>';
            html += '</li>';
        }
        $( "#filterlist" ).html(html);

        // save
        $('.action-open').click( function() {
            var id = $(this).data('id');
            actionOpen( id );
        });
        // delete
        $('.action-delete').click( function() {
            var id = $(this).data('id');
            actionSearchDelete( id );
            updateUI();
        });
        // rename
        $('.action-rename').click( function() {
            var id = $(this).data('id');
            $('#filter-new').hide();
            $('#filter-edit').show();
            $('#btn-rename').data('id', id );
            $('#btn-update').data('id', id );

            var update = (document.location.href.indexOf("?")>=0?true:false);
            if ( update ) {
                $('#div-btn-update').show();
            } else {
                $('#div-btn-update').hide();
            }

            $("#filter-name-rename").val("n/a");
            for (var i = 0; i < settings_search_data.length; i++) {
                if ( settings_search_data[i].id == id ) {
                    $("#filter-name-rename").val(settings_search_data[i].name);
                    $('#filterName').text(settings_search_data[i].name);
                    break;
                }
            }
        });
    }

    function hideCtxMenu() {
        $('#ctxMenu').hide();
        $('#filterCtxMenu').removeClass( 'btn-user-active' );
    }

    if ( settings_search_enable_user_defined && is_page("find_cache") ) {
        try {
            if ( !( $(".results").length || settings_search_data.length ) ) {
            } else {
                create_config_css_search();

                $( ".filters-toggle" ).append('&nbsp;<button id="filterCtxMenu" class="btn btn-user" type="button">Manage Filter Sets</button>  '); // &#x2630;
                $( ".filters-toggle" ).append('<div id="ctxMenu" style="display:none;"></div>');

                $('#filterCtxMenu').click( function() {
                    var element = $('#ctxMenu');
                    if ( element.css('display') == 'none' ){
                       updateUI();
                       element.show();
                       $(this).addClass( 'btn-user-active' );
                    } else {
                       element.hide();
                       $(this).removeClass( 'btn-user-active' );
                    }
                });

                var currentFilter = "";
                for (var i = 0; i < settings_search_data.length; i++) {
                    if ( settings_search_data[i].url == document.location.href.split("#")[0] ) {
                        currentFilter = "Current Filter Set: "+settings_search_data[i].name;
                    }
                }
                $(".button-group-dynamic").append('<span>'+currentFilter+'</span>');

                // Helper function to close the dialog div if a mouse click outside.
                $(document).mouseup(function (e) {
                    var container = $('#ctxMenu');
                    if ( container.css('display') != 'none' ) {
                        if ( !container.is(e.target) && !($('#filterCtxMenu').is(e.target)) && // if the target of the click isn't the container...
                            container.has(e.target).length === 0 ) { // ... nor a descendant of the container
                            container.hide();
                            $('#filterCtxMenu').removeClass( 'btn-user-active' );
                        }
                    }
                    return false;
                });
            }
        } catch (e) {
            gclh_error("Error in 'User defined search' modifications", e);
        }
    }

////////////////////////////////////////////////////////////////////////////
// Find Player
////////////////////////////////////////////////////////////////////////////
// Create and hide the "Find Player" Form.
    function createFindPlayerForm() {
        btnClose();
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

////////////////////////////////////////////////////////////////////////////
// Config
////////////////////////////////////////////////////////////////////////////
    function checkboxy(setting_id, label) {
        // Hier werden auch gegebenenfalls "Clone" von Parametern verarbeitet. (Siehe Erläuterung weiter unten bei "setEventsForDoubleParameters".)
        var setting_idX = setting_id;
        setting_id = setting_idX.replace(/(X[0-9]*)/, "");
        return "<input type='checkbox' " + (getValue(setting_id) ? "checked='checked'" : "" ) + " id='" + setting_idX + "'><label for='" + setting_idX + "'>" + label + "</label>";
    }
    function show_help(text) { return " <a class='gclh_info'><b>?</b><span class='gclh_span'>" + text + "</span></a>"; }
    function show_help2(text) { return " <a class='gclh_info gclh_info2'><b>?</b><span class='gclh_span'>" + text + "</span></a>"; }
    function show_help_big(text) { return " <a class='gclh_info gclh_info_big'><b>?</b><span class='gclh_span'>" + text + "</span></a>"; }
    function show_help_rc(text) { return " <a class='gclh_info gclh_info_rc'><b>?</b><span class='gclh_span'>" + text + "</span></a>"; }

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
        html += "}";
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
        html += ".gclh_headline2 {margin: 12px 5px 5px -2px;}";
        html += ".gclh_content {";
        html += "  padding: 2px 10px 10px 10px;";
        html += "  font-family: Verdana;";
        html += "  font-size: 14px;";
        html += "}";
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
        html += ".gclh_small {";
        html += "  font-size: 10px;";
        html += "}";
        html += "a.gclh_info {";
        html += "  color: #000000;";
        html += "  text-decoration: none;";
        html += "  cursor: help;";
        html += "}";
        html += "a.gclh_info:hover {";
        html += "  position: relative;";
        html += "}";
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
        html += "a.gclh_info:hover span {";
        html += "  width: 250px;";
        html += "  visibility: visible;";
        html += "  top: 10px;";
        html += "  left: -125px;";
        html += "  font-weight: normal;";
        html += "  border: 1px solid #000000;";
        html += "  background-color: #d8cd9d;";
        html += "}";
        html += "a.gclh_info2:hover span {";
        html += "  left: -100px !important;";
        html += "}";
        html += "a.gclh_info_big:hover span {";
        html += "  width: 350px !important;";
        html += "}";
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
        html += "a.gclh_info_rc:hover span {";
        html += "  width: 500px !important;";
        html += "  left: -245px !important;";
        html += "}";
        html += ".gclh_rc_area {";
        html += "  width: 540px;";
        html += "  background-color: #d8cd9d;";
        html += "  border: 1px solid #778555;";
        html += "  padding: 20px;";
        html += "  z-index: 1001;";
        html += "  -moz-border-radius: 30px;";
        html += "  -khtml-border-radius: 30px;";
        html += "  border-radius: 30px;";
        html += "  margin-top: 15px;";
        html += "}";
        html += ".gclh_rc_area_button {";
        html += "  margin-left: 185px;";
        html += "}";
        html += ".gclh_rc_form {";
        html += "  background-color: #d8cd9d;";
        html += "  border: 2px solid #778555;";
        html += "  -moz-border-radius: 7px;";
        html += "  -khtml-border-radius: 7px;";
        html += "  border-radius: 7px;";
        html += "  padding-left: 5px;";
        html += "  padding-right: 5px;";
        html += "  margin-left: 15px;";
        html += "  cursor: pointer;";
        html += "}";
        css.innerHTML = html;
        document.getElementsByTagName('body')[0].appendChild(css);
    }

    var dt_display = [ ["greater than or equal to",">="], ["equal to","="], ["less than or equal to","<="] ];
    var dt_score = [ ["1","1"], ["1.5","1.5"], ["2","2"], ["2.5","2.5"], ["3","3"], ["3.5","3.5"], ["4","4"], ["4.5","4.5"], ["5","5"] ];
    function gclh_createSelectOptionCode( id, data, selectedValue ) {
        var html = "";
        html += '<select class="gclh_form" id="'+id+'">';
        for ( var i = 0; i < data.length; i++ ){
            html += "  <option value='" + data[i][1] + "' " + (selectedValue == data[i][1] ? "selected='selected'" : "") + "> " + data[i][0] + "</option>";
        }
        html += '</select>';
        return html;
    }

// Configuration Menu.
    function gclh_showConfig() {
        btnClose( false );
        if ( checkTaskAllowed( "GClh Config", true ) == false ) return;
        window.scroll(0, 0);

        if (document.getElementById('bg_shadow')) {
            if (document.getElementById('bg_shadow').style.display == "none") {
                document.getElementById('bg_shadow').style.display = "";
            }
        } else {
            buildBgShadow();
        }
        // Hauptbereiche im Config gegebenenfalls hideable machen.
        if ( settings_make_config_main_areas_hideable && !document.location.href.match(/#a#/i) ) {
            var prepareHideable = "<img id='lnk_gclh_config_#name#' title='' src='' style='cursor: pointer'> ";
        } else var prepareHideable = "";

        if (document.getElementById('settings_overlay') && document.getElementById('settings_overlay').style.display == "none") {
            document.getElementById('settings_overlay').style.display = "";
        } else {
            create_config_css();
            var div = document.createElement("div");
            div.setAttribute("id", "settings_overlay");
            div.setAttribute("class", "settings_overlay");
            var html = "";
            html += "<h3 class='gclh_headline' title='Some little things to make life easy (on www.geocaching.com).' >" + scriptNameConfig + " <font class='gclh_small'>v" + scriptVersion + "</font></h3>";
            html += "<div class='gclh_content'>";
            html += "<div id='gclh_config_content1'>";
            html += "&nbsp;" + "<font style='float: right; font-size: 11px; ' >";
            html += "<a href='http://geoclub.de/forum/viewforum.php?f=117' title='Help, is available on the Geoclub forum' target='_blank'>Help</a> | ";
            html += "<a href='https://github.com/2Abendsegler/GClh/issues?q=is:issue is:open sort:created-desc' title='Open issues, on GitHub' target='_blank'>Open issues</a> | ";
            html += "<a href='https://github.com/2Abendsegler/GClh/issues?q=is:issue is:open label:\"tag: wish\" sort:created-desc' title='Open wishes, on GitHub' target='_blank'>Open wishes</a> | ";
            html += "<a href='https://github.com/2Abendsegler/GClh/blob/master/docu/changelog.md#readme' title='Changelog, on GitHub' target='_blank'>Changelog</a> | ";
            html += "<a id='check_for_upgrade' href='#' style='cursor: pointer' title='Check for upgrade script'>Check for upgrade</a> | ";
            html += "<a href='https://github.com/2Abendsegler/GClh/tree/master' title='GitHub' target='_blank'>GitHub</a> | ";
            html += "<a id='rc_link' href='#' style='cursor: pointer' title='Reset some configuration data'>Reset</a></font>";
            html += "</div>";

            html += "<div id='gclh_config_content2'>";
            html += "<div id='rc_area' class='gclh_rc_area'>";
            html += "<input type='radio' name='rc' checked='checked' id='rc_standard' class='gclh_rc'><label for='rc_standard'>Reset to standard configuration</label>" + show_help_rc("This option should help you to come back to an efficient configuration set, after some experimental or other motivated changes. This option load a reasonable standard configuration and overwrite your configuration data in parts. <br><br>The following data are not overwrited: Home-coords; homezone and multi homezone; date format; log templates; cache log, TB log and other signatures; friends data; links in Linklist and differing description and custom links. <br>Dynamic data, like for example autovisits for named trackables, are not overwrited too.<br><br>After reset, choose button \"close\" and go to Config to skim over the set of data.") + "<br/>";
            html += "<input type='radio' name='rc' id='rc_temp' class='gclh_rc'><label for='rc_temp'>Reset dynamic and unused data</label>" + show_help_rc("This option reorganize the configuration set. Unused parameters of older script versions are deleted. And all the dynamic data, especially the autovisit settings for every TB, are deleted too.<br><br>After reset, choose button \"close\".") + "<br><br>";
            html += "<input type='radio' name='rc' id='rc_homecoords' class='gclh_rc'><label for='rc_homecoords'>Reset your own home-coords</label>" + show_help_rc("This option could help you with problems around your home-coords, like for example with your main homezone, with nearest lists or with your home-coords itself. Your home-coords are not deleted at gc.com, but only in GClh. <br><br>After reset, you have to go to the account settings page of gc.com to the area \"Home Location\", so that GClh can save your home-coords again automatically. You have only to go to this page, you have nothing to do at this page, GClh save your home-coords automatically. <br>Or you enter your home-coords manually in GClh. <br><br>At last, choose button \"close\".");
            html += "<font class='gclh_small'> (After reset, go to <a href='https://www.geocaching.com/account/settings/homelocation' target='_blank'>Home Location</a> )</font>" + "<br/>";
            html += "<input type='radio' name='rc' id='rc_uid' class='gclh_rc'><label for='rc_uid'>Reset your own id for your trackables</label>" + show_help_rc("This option could help you with problems with your own trackables lists, which based on an special id, the uid. The uid are not deleted at gc.com, but only in GClh. <br><br>After reset, you have to go to your profile page of gc.com, so that GClh can save your uid again automatically. You have only to go to this page, you have nothing to do at this page, GClh save the uid automatically. <br><br>At last, choose button \"close\".");
            html += "<font class='gclh_small'> (After reset, go to <a href='https://www.geocaching.com/my/' target='_blank'>Your Profile</a> )</font>" + "<br><br>";
            html += "<div class='gclh_rc_area_button'>";
            html += "<img id='rc_doing' src='' title='' alt='' style='margin-top: 4px; margin-left: -25px; position: absolute;' /><input class='gclh_rc_form' type='button' value='reset' id='rc_reset_button'> <input style='cursor: pointer;' class='gclh_rc_form' type='button' value='close' id='rc_close_button'>";
            html += "</div>";
            html += "<pre class='gclh_form' style='width: 525px; height: 220px; overflow: auto; margin-bottom: 0px; font-size: 12px;' type='text' value='' id='rc_configData' contenteditable='true'></pre>";
            html += "</div>";
            html += "</div>";

            html += "<div id='gclh_config_content3'>";
            html += "<br>";
            html += "<h4 class='gclh_headline2'>"+prepareHideable.replace("#name#","global")+"Global</h4>";
            html += "<div id='gclh_config_global'>";
            html += "&nbsp;" + "Home-Coords: <input class='gclh_form' type='text' size='21' id='settings_home_lat_lng' value='" + DectoDeg(getValue("home_lat"), getValue("home_lng")) + "'>" + show_help("The Home-Coords are filled automatically if you update your Home-Coords on gc.com. If it doesn\'t work you can insert them here. These coords are used for some special links (nearest list, nearest map, ..) and for the homezone circle on the map.") + "<br>";
            html += checkboxy('settings_set_default_langu', 'Set default language ');
            html += "<select class='gclh_form' id='settings_default_langu'>";
            for ( var i = 0; i < langus.length; i++ ){
                html += "  <option value='" + langus[i] + "' " + (settings_default_langu == langus[i] ? "selected='selected'" : "") + "> " + langus[i] + "</option>";
            }
            html += "</select>" + show_help("Here you can change the default language to set on gc pages, in the case, apps changed the language.<br><br>The gc pages map, labs and message-center have no possibility to change a language. On these pages nothing will done.<br><br>For the future is planned to make the GClh multilingual. Until that is realized, the GClh is only in english.") + "<br>";
            html += checkboxy('settings_change_header_layout', "Change header layout") + show_help("Change the header layout to save some vertical space.") + "<br/>";
            html += " &nbsp; " + checkboxy('settings_show_smaller_gc_link', 'Show smaller geocaching link top left') + show_help("With this option you can choose a smaller display of the geocaching link top left of every page. <br><br>This option requires \"Change header layout\".") + "<br/>";
            html += " &nbsp; &nbsp; " + checkboxy('settings_remove_logo', 'Remove logo in header') + show_help_big("With this option you can remove the logo in the header. This is an easy feature with some restrictions. <br><br>This feature is available at all pages in the older design like for example cache and TB listings, bookmarks, pocket queries, nearest lists, profiles, statistics, watchlists and field notes, to name just a few. <br><br>At maps and at the pages in the newer design it is not available. <br>Also this feature is not fully integrated in the diverse possibilities of the header layout and the navigation menus. <br><br>This option require \"Change header layout\" and \"Show smaller geocaching link top left\".") + "<br>";
            html += " &nbsp; " + checkboxy('settings_show_smaller_area_top_right', 'Show smaller user, settings, message area top right') + show_help("With this option you can choose a smaller display of the area top right with the user, settings and message center icons and description of every page. <br><br>This option requires \"Change header layout\".") + "<br>";
            html += " &nbsp; &nbsp; " + checkboxy('settings_remove_message_in_header', 'Remove message center in header') + show_help_big("With this option you can remove the complete message center in the header. You will not be informed longer about new messages. <br><br>This option requires \"Change header layout\" and \"Show smaller user, settings, message area top right\".") + "<br>";
            html += " &nbsp; " + checkboxy('settings_gc_tour_is_working', 'Reserve a place for GC Tour icon') + show_help("If the script GC Tour is running, you can reserve a place top left of every page for the GC Tour icon. <br><br>This option requires \"Change header layout\".") + "<br/>";
            html += " &nbsp; " + checkboxy('settings_fixed_header_layout', 'Arrange header layout on content') + show_help_big("With this option you can arrange the header width on the width of the content of the page. This is an easy feature with some restrictions, like for example the available place, especially for horizontal navigation menues. <br><br>The fixed header is available at all pages in the older design like for example cache and TB listings, bookmarks, pocket queries, nearest lists, profiles, statistics, watchlists and field notes, to name just a few. <br><br>At maps and at the pages in the newer design it is not available, partly because the content of the pages are not yet in an accurate width, like the newer search cache page or the message center page. Also this feature is not fully integrated in the diverse possibilities of the header layout and the navigation menus. But we hope the friends of this specific header design can deal with it. <br><br>This option requires \"Change header layout\".") + "<br>";
			html += checkboxy('settings_bookmarks_on_top', "Show <a class='gclh_ref' href='#gclh_linklist' id='gclh_linklist_link_1'>Linklist</a> on top") + show_help("Show the Linklist on the top of the page - beside the other links of gc.com. You can configure the links at the end of this configuration page.<br><br>Some of the features of the linklist on top, like for example the font size or the distance between drop-down links, requires \"Change header layout\". Details you can see at the end of this configuration page by the features of the Linklist.") + "<br>";
            html += checkboxy('settings_hide_advert_link', 'Hide link to advertisement instructions') + "<br/>";
            html += "&nbsp;" + "Page-Width: <input class='gclh_form' type='text' size='2' id='settings_new_width' value='" + getValue("settings_new_width", 1000) + "'> px" + show_help("With this option you can expand the small layout. The default value of gc.com is 950 px.") + "<br>";
            html += checkboxy('settings_hide_facebook', 'Hide Facebook login') + "<br/>";
            html += checkboxy('settings_hide_socialshare', 'Hide social sharing Facebook and Twitter') + "<br/>";
            html += checkboxy('settings_hide_warning_message', 'Hide warning message') + show_help("With this option you can choose the possibility to hide a potential warning message of the masters of gc.com. <br><br>One example is the down time warning message which comes from time to time and is placed unnecessarily a lot of days at the top of pages. You can hide it except for a small line in the top right side of the pages. You can activate the warning message again if your mouse goes to this area. <br><br>If the warning message is deleted of the masters, this small area is deleted too.") + "<br/>";
            html += checkboxy('settings_search_enable_user_defined', 'Enable user defined Filter Sets for geocache searchs') + show_help("This features enables you to store favourites filter settings in the geocache search and call them quickly.") + "<br/>";
            html += newParameterOn3;
            html += checkboxy('settings_hide_cache_approvals', 'Auto set approvals in hide cache process') + show_help("This option activates the checkboxes for approval the guidelines and the terms of use agreement in the hide cache process.") + "<br/>";
            html += newParameterVersionSetzen(0.6) + newParameterOff;
            html += newParameterOn2;
            html += checkboxy('settings_remove_banner', 'Remove banner') + "<br/>";
            html += " &nbsp; " + checkboxy('settings_remove_banner_to_mylists_new', 'to new designed \"My Lists\" page ') + checkboxy('settings_remove_banner_to_mylists_old', 'to old \"My Lists\" page') + "<br/>";
            html += " &nbsp; " + checkboxy('settings_remove_banner_for_garminexpress', 'for \"Garmin Express\"') + "<br/>";
            html += newParameterVersionSetzen(0.8) + newParameterOff;
            html += checkboxy('settings_submit_log_button', 'Submit log, Pocket Query, Bookmark or hide cache on F2') + show_help("With this option you are able to submit your log by pressing F2 instead of scrolling to the bottom and move the mouse to the button. <br><br>This feature also works to submit Pocket Queries and Bookmarks. <br><br>And it works on the whole hide cache process with all of the buttons \"Continue\", \"Continue Anyway\", \"Save and Preview\", \"Submit Changes\", \"Update Attributes\", \"Create Waypoint\" and \"Update Waypoint\" of the create and the change functionality.") + "<br/>";
            html += "<br>";
            html += "&nbsp;" + "Show lines in";
            html += "<span style='margin-left: 40px;' >lists</span>" + show_help("Lists are all common lists but not the TB listing and not the cache listing.");
            html += "<span style='margin-left: 30px;' >cache listings</span>";
            html += "<span style='margin-left: 32px;' >TB listings</span>";
            html += "<span style='margin-left: 30px;' >in color</span>" + "<br>";
            html += "&nbsp;" + "- for zebra:" + show_help2("With this options you can color every second line in the specified lists in the specified \"alternating\" color.");
            html += "<input type='checkbox' style='margin-left:  37px;' " + (getValue('settings_show_common_lists_in_zebra') ? "checked='checked'" : "" ) + " id='settings_show_common_lists_in_zebra'></span>";
            html += "<input type='checkbox' style='margin-left:  56px;' " + (getValue('settings_show_cache_listings_in_zebra') ? "checked='checked'" : "" ) + " id='settings_show_cache_listings_in_zebra'></span>" + show_help("This option requires \"Load logs with GClh\".");
            html += "<input type='checkbox' style='margin-left:  95px;' " + (getValue('settings_show_tb_listings_in_zebra') ? "checked='checked'" : "" ) + " id='settings_show_tb_listings_in_zebra'></span>";
            html += "<input class='gclh_form color' type='text' style='margin-left: 86px;' size=5 id='settings_lines_color_zebra' value='" + getValue("settings_lines_color_zebra", "EBECED") + "'>";
            html += "<img src=" + global_restore_icon + " id='restore_settings_lines_color_zebra' title='back to default' style='width: 12px; cursor: pointer;'>" + "<br>";
            html += "&nbsp;" + "- for you:" + show_help2("With this options you can color your logs respectively your founds in the specified lists in the specified color.");
            html += "<input type='checkbox' style='margin-left:  50px;' " + (getValue('settings_show_common_lists_color_user') ? "checked='checked'" : "" ) + " id='settings_show_common_lists_color_user'></span>";
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
            html += "</div>";

            html += "<h4 class='gclh_headline2' title='this page'>"+prepareHideable.replace("#name#","config")+"GClh Config / Sync</h4>";
            html += "<div id='gclh_config_config'>";
            html += checkboxy('settings_f4_call_gclh_config', 'Call GClh Config on F4') + show_help("With this option you are able to call the GClh Config page (this page) by pressing F4.") + "<br/>";
            html += checkboxy('settings_f2_save_gclh_config', 'Save GClh Config on F2') + show_help("With this option you are able to save the GClh Config page (this page) by pressing F2 instead of scrolling to the bottom and choose the save button.") + "<br/>";
            html += checkboxy('settings_f10_call_gclh_sync', 'Call GClh Sync on F10') + show_help("With this option you are able to call the GClh Sync page by pressing F10.") + "<br/>";
            html += checkboxy('settings_sync_autoImport', 'Auto apply DB Sync') + show_help("If you enable this option, settings from dropbox will be applied automatically about GClh Sync every 10 hours.") + "<br/>";
            html += checkboxy('settings_show_save_message', 'Show info message if GClh data are saved') + show_help("With this option an info message is displayed if the GClh Config data are saved respectively if the GClh Sync data are imported.") + "<br/>";
            html += checkboxy('settings_sort_default_bookmarks', 'Sort default links for the Linklist') + show_help("With this option you can sort the default links for the Linklist by description. Your selection, sort or not, will done first by the next new start of the GClh Config. You can configure these default links to use in your Linklist at the end of this configuration page.") + "<br/>";
            html += checkboxy('settings_hide_colored_versions', 'Hide colored illustration of versions') + show_help("With this option the colored illustration of the versions and the version numbers in GClh Config are selectable. A change at this option evolute its effect only after a save.") + "<br/>";
            html += checkboxy('settings_make_config_main_areas_hideable', 'Make main areas in GClh Config hideable') + show_help("With this option you can hide and show the main areas in GClh Config with one click. A change at this option evolute its effect only after a save.") + "<br/>";
            html += "</div>";

            html += "<h4 class='gclh_headline2'>"+prepareHideable.replace("#name#","nearestlist")+"Nearest list</h4>";
            html += "<div id='gclh_config_nearestlist'>";
            html += checkboxy('settings_redirect_to_map', 'Redirect cache search lists to map display') + show_help("If you enable this option, you will be automatically redirected from the older cache search lists (nearest lists) to map display.") + "<br/>";
            html += checkboxy('settings_show_log_it', 'Show GClh \"Log it\" icon (too for basic members for PMO)') + show_help("The GClh \"Log it\" icon is displayed beside cache titles in nearest lists. If you click it, you will be redirected directly to the log form. <br><br>You can use it too as basic member to log Premium Member Only (PMO) caches.") + "<br/>";
            html += checkboxy('settings_show_nearestuser_profil_link', 'Show profile link on search for created / found by caches') + show_help("This option adds an link to the user profile when searching for caches created or found by a certain user") + "<br/>";
            html += "</div>";

            html += "<h4 class='gclh_headline2'>"+prepareHideable.replace("#name#","bm")+"Bookmark list</h4>";
            html += "<div id='gclh_config_bm'>";
            html += checkboxy('settings_show_sums_in_bookmark_lists', 'Show number of caches in bookmark lists') + show_help("With this option the number of caches and the number of selected caches in the categories \"All\", \"Found\", \"Archived\" and \"Deactivated\", corresponding to the select buttons, are shown in bookmark lists at the end of the list.") + "<br/>";
            html += newParameterOn2;
            html += checkboxy('settings_compact_layout_bm_lists', 'Show compact layout in bookmark lists') + "<br/>";
            html += checkboxy('settings_compact_layout_list_of_bm_lists', 'Show compact layout in list of bookmark lists') + "<br/>";
            html += newParameterVersionSetzen(0.8) + newParameterOff;
            html += "</div>";

            html += "<h4 class='gclh_headline2'>"+prepareHideable.replace("#name#","pq")+"Pocket Query</h4>";
            html += "<div id='gclh_config_pq'>";
            html += checkboxy('settings_fixed_pq_header', 'Show fixed header in PQ list') + "<br/>";
            html += newParameterOn3;
            html += checkboxy('settings_pq_warning', "Get a warning in case of empty pocket queries") + show_help("Show a message if one or more options are in conflict. This helps to avoid empty pocket queries.") + "<br/>";
            html += newParameterVersionSetzen(0.6) + newParameterOff;
            html += "<div style='margin-top: 9px; margin-left: 5px'><b>Default values for new Pocket Query</b></div>";
            html += newParameterOn3;
            html += checkboxy('settings_pq_set_cachestotal', "Set number of caches to ") + "<input class='gclh_form' size=3 type='text' id='settings_pq_cachestotal' value='" + settings_pq_cachestotal + "'>&nbsp;" + show_help("Specifies the default value for total caches.") + "<br/>";
            html += checkboxy('settings_pq_option_ihaventfound', "Enable option '<i>I haven't found</i>' by default") + show_help("This activates the option '<i>I haven't found</i>' by default.") + "<br/>";
            html += checkboxy('settings_pq_option_idontown', "Enable option '<i>I don't own</i>' by default") + show_help("This activates the option '<i>I don't own</i>' by default.") + "<br/>";
            html += checkboxy('settings_pq_option_ignorelist', "Enable option '<i>Are not on my ignore list</i>' by default") + show_help("This activates the option '<i>Are not on my ignore list</i>' by default.") + "<br/>";
            html += checkboxy('settings_pq_option_isenabled', "Enable option '<i>Is Enabled</i>' by default") + show_help("This activates the option '<i>Is Enabled</i>' by default.") + "<br/>";
            html += checkboxy('settings_pq_option_filename', "Enable option '<i>Include PQ name in download file name</i>' by default") + show_help("This activates the option '<i>Include PQ name in download file name</i>' by default.") + "<br/>";
            html += checkboxy('settings_pq_set_difficulty', "Set difficulity ");
            html += gclh_createSelectOptionCode( "settings_pq_difficulty", dt_display, settings_pq_difficulty );
            html += '&nbsp;';
            html += gclh_createSelectOptionCode( "settings_pq_difficulty_score", dt_score, settings_pq_difficulty_score );
            html += " by default" + show_help("Specifies the default settings for difficulty score.") + "<br/>";
            html += checkboxy('settings_pq_set_terrain', "Set terrain ");
            html += gclh_createSelectOptionCode( "settings_pq_terrain", dt_display, settings_pq_terrain );
            html += '&nbsp;';
            html += gclh_createSelectOptionCode( "settings_pq_terrain_score", dt_score, settings_pq_terrain_score );
            html += " by default" + show_help("Specifies the default settings for terrain score.") + "<br/>";
            html += checkboxy('settings_pq_automatically_day', "Generate PQ today") + show_help("Use the server time to set the week day for creation.") + "<br/>";
            html += newParameterVersionSetzen(0.6) + newParameterOff;
            html += "</div>";

            html += "<h4 class='gclh_headline2'>"+prepareHideable.replace("#name#","maps")+"Maps</h4>";
            html += "<div id='gclh_config_maps'>";
            html += checkboxy('settings_show_homezone', 'Show Homezone') + "<br>";
            html += "&nbsp; " + "- Radius: <input class='gclh_form' type='text' size='1' id='settings_homezone_radius' value='" + settings_homezone_radius + "' style='margin-left: 5px;'> km" + show_help("This option draws a circle of X kilometers around your home coordinates on the map.") + "<br>";
            html += "&nbsp; " + "- Color: <input class='gclh_form color' type='text' size='5' id='settings_homezone_color' value='" + settings_homezone_color + "' style='margin-left: 15px'>" + show_help("Here you can change the color of your Homezone circle.") + "<br>";
            html += "&nbsp; " + "- Opacity: <input class='gclh_form' type='text' size='1' id='settings_homezone_opacity' value='" + settings_homezone_opacity + "'> %" + show_help("Here you can change the opacity of your Homezone circle.") + "<br>";
            //Multi-Homezone
            html += "<div class='multi_homezone_settings' style='width: 60%;'><b>Multi Homezone</b>";
            var multi_hz_el = "<div class='multi_homezone_element'>";
            multi_hz_el += "- Coords: <input class='gclh_form coords' type='text' size='21' value='" + DectoDeg(getValue("home_lat"), getValue("home_lng")) + " 'style='margin-left: 1px;'>" + "<br>";
            multi_hz_el += "- Radius: <input class='gclh_form radius' type='text' size='1' value='1' style='margin-left: 5px;'> km" + show_help("This option draws a circle of X kilometers around your home coordinates on the map.") + "<br>";
            multi_hz_el += "- Color: <input class='gclh_form color' type='text' size='5' value='#0000FF' style='margin-left: 15px;'>" + show_help("Here you can change the color of your Homezone circle.") + "<br>";
            multi_hz_el += "- Opacity: <input class='gclh_form opacity' type='text' size='1' value='10'> %" + show_help("Here you can change the opacity of your Homezone circle.") + "<br>";
            multi_hz_el += "<button class='remove' type='button' style='cursor: pointer; border: 2px solid #778555; border-radius: 7px;'>remove</button>";
            multi_hz_el += "</div>";
            for (var i in settings_multi_homezone) {
                var hzel = settings_multi_homezone[i];
                var newHzEl = $('<div>').append($(multi_hz_el));
                newHzEl.find('.coords').attr('value', DectoDeg(hzel.lat, hzel.lng));
                newHzEl.find('.radius').attr('value', hzel.radius);
                newHzEl.find('.color').attr('value', hzel.color);
                newHzEl.find('.opacity').attr('value', hzel.opacity);
                html += newHzEl.html();
            }
            html += "<div class='wrapper'></div><button type='button' class='addentry' style='cursor: pointer; border: 2px solid #778555; border-radius: 7px;'>create further Homezone</button></div>";
            html += "<div style='margin-top: 9px; margin-left: 5px'><b>Hide Map Elements</b></div>";
            html += checkboxy('settings_map_hide_sidebar', 'Hide sidebar by default') + show_help("If you want to hide the sidebar on the map, just select this option.") + "<br/>";
            html += checkboxy('settings_hide_map_header', 'Hide header by default') + show_help("If you want to hide the header of the map, just select this option.") + "<br/>";
            html += checkboxy('settings_map_hide_found', 'Hide found caches by default') + show_help("This is a premium feature - it enables automatically the option to hide your found caches on map.") + "<br/>";
            html += checkboxy('settings_map_hide_hidden', 'Hide own caches by default') + show_help("This is a premium feature - it enables automatically the option to hide your caches on map.") + "<br/>";
            html += "&nbsp;" + "Hide cache types by default: " + show_help("This is a premium feature - it enables automatically the option to hide the specific cache type.") + "<br/>";

            var imgStyle = "style='padding-top: 4px; vertical-align: bottom;'";
            var imageBaseUrl = http + "://www.geocaching.com/map/images/mapicons/";
            html += " &nbsp; " + checkboxy('settings_map_hide_2', "<img "+imgStyle+" src='" + imageBaseUrl + "2.png' title='Traditional'>") + "<br/>";
            html += " &nbsp; " + checkboxy('settings_map_hide_3', "<img "+imgStyle+" src='"  + imageBaseUrl + "3.png' title='Multi-Cache'>") + "<br/>";

            html += " &nbsp; " + checkboxy('settings_map_hide_6', "<img "+imgStyle+" src='" + imageBaseUrl + "6.png' title='Event'>");
            html += " &nbsp; " + checkboxy('settings_map_hide_13', "<img "+imgStyle+" src='" + imageBaseUrl + "13.png' title='Cache In Trash Out'>");
            html += " &nbsp; " + checkboxy('settings_map_hide_453', "<img "+imgStyle+" src='" + imageBaseUrl + "453.png' title='Mega-Event'>");
            html += " &nbsp; " + checkboxy('settings_map_hide_7005', "<img "+imgStyle+" src='" + imageBaseUrl + "7005.png' title='Giga-Event'>") + "<br/>";

            html += " &nbsp; " + checkboxy('settings_map_hide_137', "<img "+imgStyle+" src='" + imageBaseUrl + "137.png' title='EarthCache'>");
            html += " &nbsp; " + checkboxy('settings_map_hide_4', "<img "+imgStyle+" src='" + imageBaseUrl + "4.png' title='Virtual'>");
            html += " &nbsp; " + checkboxy('settings_map_hide_11', "<img "+imgStyle+" src='" + imageBaseUrl + "11.png' title='Webcam'>") + "<br/>";

            html += " &nbsp; " + checkboxy('settings_map_hide_8', "<img "+imgStyle+" src='" + imageBaseUrl + "8.png' title='Mystery'>");
            html += " &nbsp; " + checkboxy('settings_map_hide_5', "<img "+imgStyle+" src='" + imageBaseUrl + "5.png' title='Letterbox'>");
            html += " &nbsp; " + checkboxy('settings_map_hide_1858', "<img "+imgStyle+" src='" + imageBaseUrl + "1858.png' title='Wherigo'>") + "<br/>";

            html += "<div style='margin-top: 9px; margin-left: 5px'><b>Layers in map</b>" + show_help("Here you can select the map layers which should be added into the layer menu with the map. With this option you can reduce the long list to the layers you really need. If the right list of layers is empty, all will be displayed. If you use other scripts like \"Geocaching Map Enhancements\" GClh will overwrite its layercontrol. With this option you can disable GClh layers to use the layers from gc.com or GME.") + "</div>";
            html += checkboxy('settings_use_gclh_layercontrol', 'Replace layercontrol by GClh') + show_help("If you use other scripts like \"Geocaching Map Enhancements\" GClh will overwrite its layercontrol. With this option you can disable GClh layers to use the layers from gc.com or GME.") + "<br/>";

            html += "<div id='MapLayersConfiguration' style='display: "+(settings_use_gclh_layercontrol?"block":"none")+";'>";
            html += "<table cellspacing='0' cellpadding='0' border='0'><tbody>";
            html += "<tr>";
            html += "<td><select class='gclh_form' style='width: 250px;' id='settings_maplayers_unavailable' multiple='single' size='7'></select></td>";
            html += "<td><input style='padding-left: 2px; padding-right: 2px; cursor: pointer;' class='gclh_form' type='button' value='>' id='btn_map_layer_right'><br><br><input style='padding-left: 2px; padding-right: 2px; cursor: pointer;' class='gclh_form' type='button' value='<' id='btn_map_layer_left'></td>";
            html += "<td><select class='gclh_form' style='width: 250px;' id='settings_maplayers_available' multiple='single' size='7'></select></td>";
            html += "</tr>";
            html += "<tr><td colspan='3'>Default layer: <code><span id='settings_mapdefault_layer'>" + (settings_map_default_layer ? settings_map_default_layer:"<i>not available</i>") +"</span></code>";
            html += "&nbsp;" + show_help("Here you can select the map source you want to use as default in the map. Select a layer from the right list 'Shown layers' and push the button 'Set Default Layer'.");
            html += "<span style='float: right; margin-top: 0px;' ><input style='padding-left: 2px; padding-right: 2px; cursor: pointer;' class='gclh_form' type='button' value='Set Default Layer' id='btn_set_default_layer'></span><br/><span style='margin-left: -4px'></span>";
            html += checkboxy('settings_show_hillshadow', 'Show Hillshadow by default') + show_help("If you want 3D-like-Shadow to be displayed by default, activate this function. Option \"Replace layercontrol by GClh\" must be enabled.") + "<br/>";
            html += "</td></tr>";
            html += "</tbody></table></div>";
            html += "<div style='margin-top: 9px; margin-left: 5px'><b>Google Maps page</b></div>";
            html += checkboxy('settings_hide_left_sidebar_on_google_maps', 'Hide left sidebar on Google Maps by default') + show_help("With this option you can blended the left sidebar on the Google Maps page out.") + "<br/>";
            html += checkboxy('settings_add_link_gc_map_on_google_maps', 'Add link to GC Map on Google Maps') + show_help("With this option an icon are placed on the Google Maps page to link to the same area in GC Map.") + "<br/>";
            html += " &nbsp; " + checkboxy('settings_switch_to_gc_map_in_same_tab', 'Switch to GC Map in same browser tab') + show_help("With this option you can switch from Google Maps to GC Map in the same browser tab.<br><br>This option requires \"Add link to GC Map on Google Maps\".") + "<br/>";
            html += checkboxy('settings_add_link_google_maps_on_gc_map', 'Add link to Google Maps on GC Map') + show_help("With this option an icon are placed on the GC Map page to link to the same area in Google Maps.") + "<br/>";
            html += " &nbsp; " + checkboxy('settings_switch_to_google_maps_in_same_tab', 'Switch to Google Maps in same browser tab') + show_help("With this option you can switch from GC Map to Google Maps in the same browser tab.<br><br>This option requires \"Add link to Google Maps on GC Map\".") + "<br/>";
            html += "<div style='margin-top: 9px; margin-left: 5px'><b>Openstreetmap page</b></div>";
            html += checkboxy('settings_add_link_gc_map_on_osm', 'Add link to GC Map on Openstreetmap') + show_help("With this option an icon are placed on the OpenstreetMap page to link to the same area in GC Map.") + "<br/>";
            html += " &nbsp; " + checkboxy('settings_switch_from_osm_to_gc_map_in_same_tab', 'Switch to GC Map in same browser tab') + show_help("With this option you can switch from Openstreetmap to GC Map in the same browser tab.<br><br>This option requires \"Add link to GC Map on OpenstreetMap\".") + "<br/>";
            html += checkboxy('settings_add_link_osm_on_gc_map', 'Add link to Openstreetmap on GC Map') + show_help("With this option an icon are placed on the GC Map page to link to the same area in Openstreetmap.") + "<br/>";
            html += " &nbsp; " + checkboxy('settings_switch_to_osm_in_same_tab', 'Switch to Openstreetmap in same browser tab') + show_help("With this option you can switch from GC Map to Openstreetmap in the same browser tab.<br><br>This option requires \"Add link to Openstreetmap on GC Map\".") + "<br/>";
            html += "<div style='margin-top: 9px; margin-left: 5px'><b>Flopp's Map page</b></div>";
            html += checkboxy('settings_add_link_flopps_on_gc_map', 'Add link to Flopp\'s Map on GC Map') + show_help("With this option an icon are placed on the GC Map page to link to the same area in Flopp\'s Map.") + "<br/>";
            html += " &nbsp; " + checkboxy('settings_switch_to_flopps_in_same_tab', 'Switch to Flopp\'s Map in same browser tab') + show_help("With this option you can switch from GC Map to Flopp\'s Map in the same browser tab.<br><br>This option requires \"Add link to Flopp\'s Map on GC Map\".") + "<br/>";
            html += "<div style='margin-top: 9px; margin-left: 5px'><b>GeoHack page</b></div>";
            html += checkboxy('settings_add_link_geohack_on_gc_map', 'Add link to GeoHack on GC Map') + show_help("With this option an icon are placed on the GC Map page to link to the same area in GeoHack.") + "<br/>";
            html += " &nbsp; " + checkboxy('settings_switch_to_geohack_in_same_tab', 'Switch to GeoHack in same browser tab') + show_help("With this option you can switch from GC Map to GeoHack in the same browser tab.<br><br>This option requires \"Add link to GeoHack on GC Map\".") + "<br/>";
            html += "</div>";

            html += "<h4 class='gclh_headline2'>"+prepareHideable.replace("#name#","profile")+"Profile <span style='font-size: 14px'>" + show_help2("This section include your profile pages (\/my\/ and \/profile\/ pages) with for example your founded caches and trackables, your earned souvenirs, your image gallery, your statistic ... <br><br>Also the section include the profile pages of the others.") + "</span></h4>";
            html += "<div id='gclh_config_profile'>";
            html += checkboxy('settings_bookmarks_show', "Show <a class='gclh_ref' href='#gclh_linklist' id='gclh_linklist_link_2'>Linklist</a> in your profile") + show_help("Show the Linklist at the right side in your profile. You can configure the links in the Linklist at the end of this page.") + "<br/>";
            html += checkboxy('settings_hide_visits_in_profile', 'Hide TB/Coin visits in your profile') + "<br/>";
            html += checkboxy('settings_show_thumbnails', 'Show thumbnails of images') + show_help("With this option the images are displayed as thumbnails to have a preview. If you hover over a thumbnail, you can see the big one.<br><br>This works in cache and TB logs, in the cache and TB image galleries, in public profile for the avatar and in the profile image gallery.") + "&nbsp; Max size of big image: <input class='gclh_form' size=2 type='text' id='settings_hover_image_max_size' value='" + settings_hover_image_max_size + "'> px <br/>";
            html += "&nbsp; " + checkboxy('settings_imgcaption_on_top', 'Show caption on top') + show_help("This option requires \"Show thumbnails of images\".") + "<br/>";
            html += checkboxy('settings_show_big_gallery', 'Show bigger images in gallery') + show_help("With this option the images in the galleries of caches, TBs and profiles are displayed bigger and not in 4 columns, but in 2 columns.");
            var content_geothumbs = "<font class='gclh_small' style='margin-left: 80px; margin-top: -10px; position: absolute;'> (Alternative: <a href='https://benchmarks.org.uk/greasemonkey/geothumbs.php' target='_blank'>Geothumbs</a> " + show_help("A great alternative to the GClh bigger image functionality with \"Show thumbnails of images\" and \"Show bigger images in gallery\", provides the script Geothumbs (Geocaching Thumbnails). <br><br>The script works like GClh with Firefox as Greasemonkey script and with Google Chrome and Opera as Tampermonkey script. <br><br>If you use Geothumbs, you have to uncheck both GClh bigger image functionality.") + ")</font>" + "<br/>";
            html += content_geothumbs;
            var content_settings_show_mail_in_allmyvips = checkboxy('settings_show_mail_in_allmyvips', 'Show mail link beside user in "All my VIPs" list in your profile') + show_help("With this option there will be an small mail icon beside every username in the list with all your VIPs (All my VIPs) on your profile page. With this icon you get directly to the mail page to mail to this user. <br>(VIP: Very important person)<br><br>This option requires \"Show mail link beside usernames\" and \"Show VIP list\".") + "<br>";
            html += content_settings_show_mail_in_allmyvips;
            html += checkboxy('settings_show_sums_in_watchlist', 'Show number of caches in your watchlist') + show_help("With this option the number of caches and the number of selected caches in the categories \"All\", \"Archived\" and \"Deactivated\", corresponding to the select buttons, are shown in your watchlist at the end of the list.") + "<br/>";
            html += checkboxy('settings_logit_for_basic_in_pmo', 'Log PMO caches by standard \"Log It\" icon (for basic members)') + show_help("With this option basic members are able to choose the standard \"Log It\" icon to call the logging screen for premium only caches. The tool tipp blocked not longer this call. You can have the same result by using the right mouse across the \"Log It\" icon and then new tab. <br>The \"Log It\" icon is besides the caches for example in the \"Recently Viewed Caches\" list and in your profile.") + "<br/>";
            html += checkboxy('settings_hide_archived_in_owned', 'Hide archived caches in owned list') + "<br/>";

            html += "<div style='margin-top: 9px; margin-left: 5px'><b>Friends</b></div>";
            html += checkboxy('settings_automatic_friend_reset', 'Reset difference counter on friendlist automatically') + show_help("If you enable this option, the difference counter at friendlist will automatically reset if you have seen the difference and if the day changed.") + "<br/>";
            html += checkboxy('settings_friendlist_summary', 'Show summary for new finds/hides in friends list') + show_help("With this option you can show a summary of all new finds/hides of your friends on the friends list page") + "<br/>";
            html += " &nbsp; " + checkboxy('settings_friendlist_summary_viponly', 'Show summary only for friends in VIP list') + show_help("With this option you can choose to show the summary only for friends who are also marked as VIP.") + "<br/>";
            var content_settings_process_vup = checkboxy('settings_process_vup', 'Process VUPs') + show_help("With this option you can activate the processing to add any user to a VUP list by clicking the little VUP icon beside the username. If it is red, this person is a VUP. For such persons in cache logs will only shown \"censored\" instead of the log text. On your profile page there is an overview of all your VUPs.<br>(VUP: Very unimportant person)<br><br>This option requires \"Show VIP list\".") + "<br>";
            html += content_settings_process_vup;
            var content_settings_show_vup_friends = checkboxy('settings_show_vup_friends', 'Show VUP icons on friends list') + show_help("With this option you can choose if VUP icons are shown addional on friends list or not. If you deactivate this option and a friend is a VUP, then the VIP icon is replaced by the VUP icon anyway.<br>(VUP: Very unimportant person)<br>(VIP: Very important person)<br><br>This option requires \"Process VUPs\" and \"Show VIP list\".") + "<br>";
            html += " &nbsp; " + content_settings_show_vup_friends;

            html += "<div style='margin-top: 9px; margin-left: 5px'><b>Trackables</b></div>";
            html += checkboxy('settings_faster_profile_trackables', 'Load trackables faster without images') + show_help("With this option, you can stop the load on the trackable pages after the necessary datas are loaded. You disclaim of the lengthy load of the images of the trackables. This procedure is much faster as load all datas, because every image is loaded separate and not in a bigger bundle like it is for the non image data.") + "<br/>";
//--> $$065 Begin of insert
//<-- $$065 End of insert

            html += "<div style='margin-top: 9px; margin-left: 5px'><b>Statistic</b></div>";
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
            html += checkboxy('settings_log_statistic', 'Calculate number of cache and trackable logs for each logtype') + show_help("With this option, you can build a statistic for your own cache and trackable logs for each logtype on your own statistic and your own profile page.") + "<br/>";
            html += "&nbsp; " + checkboxy('settings_log_statistic_percentage', 'Show percentage column') + "<br/>";
            html += " &nbsp; &nbsp;" + "Automated load/reload after <select class='gclh_form' id='settings_log_statistic_reload' >";
            html += "  <option value='' " + (settings_log_statistic_reload == '' ? "selected=\"selected\"" : "") + "></option>";
            for ( var i = 1; i < 49; i++ ) {
                html += "  <option value='" + i + "' " + (settings_log_statistic_reload == i ? "selected=\"selected\"" : "") + ">" + i + "</option>";
            }
            html += "</select> hours" + show_help("Choose no hours, if you want to load/reload only manual.") + "<br/>";
            html += "</div>";

            html += "<h4 class='gclh_headline2'>"+prepareHideable.replace("#name#","listing")+"Listing</h4>";
            html += "<div id='gclh_config_listing'>";
            html += checkboxy('settings_log_inline', 'Log cache from listing (inline)') + show_help("With the inline log you can open a log form inside the listing, without loading a new page.") + "<br/>";
            var content_settings_log_inline_tb = "&nbsp; " + checkboxy('settings_log_inline_tb', 'Show TB list') + show_help("With this option you can select, if the TB list should be shown in inline logs.<br><br>This option requires \"Log cache from listing (inline)\" or \"Log cache from listing for PMO (for basic members)\".") + "<br>";
            html += content_settings_log_inline_tb;
            html += checkboxy('settings_log_inline_pmo4basic', 'Log cache from listing for PMO (for basic members)') + show_help("With this option you can select, if inline logs should appear for Premium-Member-Only caches althought you are a basic member (logging of PMO caches by basic members is allowed by Groundspeak).") + "<br/>";
            html += content_settings_log_inline_tb.replace("settings_log_inline_tb", "settings_log_inline_tbX0");
            html += checkboxy('settings_hide_empty_cache_notes', 'Hide cache notes if empty') + show_help("This is a premium feature - you can hide the personal cache notes if they are empty. There will be a link to show them to add a note.") + "<br/>";
            html += checkboxy('settings_hide_cache_notes', 'Hide cache notes completely') + show_help("This is a premium feature - you can hide the personal cache notes completely, if you don't want to use them.") + "<br/>";
            html += checkboxy('settings_hide_disclaimer', 'Hide disclaimer') + "<br/>";
            html += checkboxy('settings_hide_spoilerwarning', 'Hide spoiler warning') + "<br/>";
            html += checkboxy('settings_hide_top_button', 'Hide the green "To Top" button') + show_help("Hide the green \"To Top\" button, which appears if you are reading logs.") + "<br/>";
            html += checkboxy('settings_show_all_logs', 'Show at least ') + " <input class='gclh_form' type='text' size='2' id='settings_show_all_logs_count' value='" + settings_show_all_logs_count + "'> logs (0 = all)" + show_help("With this option you can choose how many logs should be shown at least if you load the listing - if you type 0, all logs are shown by default.") + "<br>";
            html += checkboxy('settings_hide_hint', 'Hide hints behind a link') + show_help("This option hides the hints behind a link - you have to click it to display the hints (already decrypted). This option remove also the hint description.") + "<br/>";
            html += checkboxy('settings_decrypt_hint', 'Decrypt hints') + show_help("This option decrypt the hints and remove also the hint description.") + "<br/>";
            html += checkboxy('settings_visitCount_geocheckerCom', 'Show statistic on geochecker.com sites') + show_help("This option adds '&visitCount=1' to all geochecker.com links. This will show some statistics on geochecker.com site like the count of site visits and the count of right and wrong attempts. Firefox and all browser besides Chrome will use the redirector service anonym.to !") + "<br/>";
            html += checkboxy('settings_show_eventday', 'Show weekday of an event') + show_help("With this option the day of the week will be displayed next to the date.") + " Date format: <select class='gclh_form' id='settings_date_format'>";
            html += "  <option " + (settings_date_format == "yyyy-MM-dd" ? "selected='selected'" : "") + " value='yyyy-MM-dd'> 2016-12-31</option>";
            html += "  <option " + (settings_date_format == "yyyy/MM/dd" ? "selected='selected'" : "") + " value='yyyy/MM/dd'> 2016/12/31</option>";
            html += "  <option " + (settings_date_format == "MM/dd/yyyy" ? "selected='selected'" : "") + " value='MM/dd/yyyy'> 12/31/2016</option>";
            html += "  <option " + (settings_date_format == "dd/MM/yyyy" ? "selected='selected'" : "") + " value='dd/MM/yyyy'> 31/12/2016</option>";
            html += "  <option " + (settings_date_format == "dd.MM.yyyy" ? "selected='selected'" : "") + " value='dd.MM.yyyy'> 31.12.2016</option>";
            html += "  <option " + (settings_date_format == "dd/MMM/yyyy" ? "selected='selected'" : "") + " value='dd/MMM/yyyy'> 31/Dec/2016</option>";
            html += "  <option " + (settings_date_format == "MMM/dd/yyyy" ? "selected='selected'" : "") + " value='MMM/dd/yyyy'> Dec/31/2016</option>";
            html += "  <option " + (settings_date_format == "dd MMM yy" ? "selected='selected'" : "") + " value='dd MMM yy'> 31 Dec 16</option>";
            html += "</select>" + show_help("If you have changed the date format on gc.com, you have to change it here to. Instead the day of week may be wrong.") + "<br/>";
            html += checkboxy('settings_show_mail', 'Show mail link beside usernames') + show_help("With this option there will be an small mail icon beside every username. With this icon you get directly to the mail form to mail to this user. If you click it for example when you are in a listing, the cachename or GC code can be inserted into the mail form about placeholder in the mail / message form template.") + "<br/>";
            var content_settings_show_mail_in_viplist = "&nbsp; " + checkboxy('settings_show_mail_in_viplist', 'Show mail link beside user in "VIP-List" in listing') + show_help("With this option there will be an small mail icon beside every username in the VIP lists on the cache listing page. With this icon you get directly to the mail page to mail to this user. <br>(VIP: Very important person)<br><br>This option requires \"Show mail link beside usernames\", \"Show VIP list\" and \"Load logs with GClh\".") + "<br>";
            html += content_settings_show_mail_in_viplist;
            html += "&nbsp; " + content_settings_show_mail_in_allmyvips.replace("settings_show_mail_in_allmyvips", "settings_show_mail_in_allmyvipsX0");
            html += newParameterOn3;
            html += "&nbsp; " + checkboxy('settings_mail_icon_new_win', 'Open mail form in new tab')  + show_help("If you enable this option, the mail form will open in a new tab.<br><br>This option requires \"Show mail link beside usernames\".")+ "<br/>";
            html += newParameterVersionSetzen(0.6) + newParameterOff;
            html += checkboxy('settings_show_message', 'Show message link beside usernames') + show_help("With this option there will be an small message icon beside every username. With this icon you get directly to the message form to send a message to this user. If you click it for example when you are in a listing, the cachename or GC code can be inserted into the message form about placeholder in the mail / message form template.") + "<br/>";
            html += newParameterOn3;
            html += "&nbsp; " + checkboxy('settings_message_icon_new_win', 'Open message form in new tab')  + show_help("If you enable this option, the message form will open in a new tab.<br><br>This option requires \"Show message link beside usernames\".")+ "<br/>";
            html += newParameterVersionSetzen(0.6) + newParameterOff;
            html += checkboxy('settings_show_google_maps', 'Show link to Google Maps') + show_help("This option shows a link at the top of the second map in the listing. With this link you get directly to Google Maps in the area, where the cache is.") + "<br/>";
            html += checkboxy('settings_strike_archived', 'Strike through title of archived/disabled caches') + "<br/>";
            html += "&nbsp;" + "Highlight user changed coords with " + checkboxy('settings_highlight_usercoords', 'red textcolor ') + checkboxy('settings_highlight_usercoords_bb', 'underline ') + checkboxy('settings_highlight_usercoords_it', 'italic') + "<br/>";
            html += checkboxy('settings_show_fav_percentage', 'Show percentage of favourite points') + show_help("This option loads the favourite stats of a cache in the backround and display the percentage under the amount of favourites a cache got.") + "<br/>";
            html += checkboxy('settings_show_latest_logs_symbols', 'Show the ');
            html += "<select class='gclh_form' id='settings_show_latest_logs_symbols_count'>";
            for ( var i = 1; i < 11; i++ ){
                html += "  <option value='" + i + "' " + (settings_show_latest_logs_symbols_count == i ? "selected=\"selected\"" : "") + ">" + i + "</option>";
            }
            html += "</select> latest logs symbols at the top" + show_help("With this option, the choosen count of the latest logs symbols is shown at the top of the cache listing. <br><br>This option requires \"Load logs with GClh\".") + "<br>";
            html += checkboxy('settings_show_remove_ignoring_link', 'Show \"Stop Ignoring\", if cache is already ignored') + show_help("This option replace the \"Ignore\" link description with the \"Stop Ignoring\" link description in the cache listing, if the cache is already ignored.") + "<br/>";
            html += checkboxy('settings_map_overview_build', 'Show cache location in overview map') + show_help("With this option there will be an additional map top right in the cache listing as an overview of the cache location. This was available in the gc.com standard earlier.") + "<br/>";
            html += " &nbsp; &nbsp;" + "Map zoom value: <select class='gclh_form' id='settings_map_overview_zoom'>";
            for ( var i = 1; i < 20; i++ ){
                html += "  <option value='" + i + "' " + (settings_map_overview_zoom == i ? "selected=\"selected\"" : "") + ">" + i + "</option>";
            }
            html += "</select>" + show_help("With this option you can choose the zoom value to start in the map. \"1\" is the hole world and \"19\" is the maximal enlargement. Default is \"11\". <br><br>This option requires \"Show cache location in overview map\".") + "<br>";
            html += checkboxy('settings_show_vip_list', 'Show VIP list') + show_help("The VIP list is a list, displayed at the right side on a cache listing. You can add any user to your VIP list by clicking the little VIP icon beside the username. If it is green, this person is a VIP. The VIP list only shows VIPs and the logs of VIPs, which already posted a log to this cache. With this option you are able to see which of your VIPs already found this cache. On your profile page there is an overview of all your VIPs.<br>(VIP: Very important person)") + "<br/>";
            html += "&nbsp; " + checkboxy('settings_show_owner_vip_list', 'Show owner in VIP list')  + show_help("If you enable this option, the owner is a VIP for the cache, so you can see, what happened with the cache (disable, maint, enable, ..). Then the owner is shown not only in VIP-list but also in VIP logs.<br>(VIP: Very important person)<br><br>This option requires \"Show VIP list\".")+ "<br/>";
            html += "&nbsp; " + checkboxy('settings_show_long_vip', 'Show long VIP list (one row per log)') + show_help("This is another type of displaying the VIP list. If you disable this option you get the short list - one row per VIP and the logs as icons beside the VIP. If you enable this option, there is a row for every log.<br>(VIP: Very important person)<br><br>This option requires \"Show VIP list\".") + "<br/>";
            html += "&nbsp; " + checkboxy('settings_vip_show_nofound', 'Show a list of VIPs who have not found the cache') + show_help("This option enables an additional VIP list with VIPs who have not found the cache.<br>(VIP: Very important person)<br><br>This option requires \"Show VIP list\".") + "<br>";
            html += "&nbsp; " + checkboxy('settings_make_vip_lists_hideable', 'Make VIP lists in listing hideable') + show_help("With this option you can hide and show the VIP lists \"VIP-List\" and \"VIP-List not found\" in cache listing with one click.<br>(VIP: Very important person)<br><br>This option requires \"Show VIP list\".") + "<br>";
            html += content_settings_show_mail_in_viplist.replace("settings_show_mail_in_viplist", "settings_show_mail_in_viplistX0");
            html += "&nbsp; " + content_settings_show_mail_in_allmyvips.replace("settings_show_mail_in_allmyvips", "settings_show_mail_in_allmyvipsX1");
            html += "&nbsp; " + content_settings_process_vup.replace("settings_process_vup", "settings_process_vupX0");
            html += " &nbsp; &nbsp; " + content_settings_show_vup_friends.replace("settings_show_vup_friends", "settings_show_vup_friendsX0");
            html += " &nbsp; &nbsp; " + checkboxy('settings_vup_hide_avatar', 'Also hide name, avatar and counter from log') + show_help("With this option you can also hide the cacher name, his avatar and his found counter<br><br>This option requires \"Process VUPs\" and \"Show VIP list\".") + "<br>";
            html += " &nbsp; &nbsp; &nbsp; " + checkboxy('settings_vup_hide_log', 'Hide complete log') + show_help("With this option you can hide the complete log of the cacher.<br><br>This option requires \"Also hide name, avatar and counter from log\", \"Process VUPs\" and \"Show VIP list\".") + "<br>";
            html += checkboxy('settings_link_big_listing', 'Replace image links in cache listing to bigger image') + show_help("With this option the links of owner images in the cache listing points to the bigger, original image.") + "<br/>";
            html += checkboxy('settings_show_thumbnailsX0', 'Show thumbnails of images') + show_help("With this option the images are displayed as thumbnails to have a preview. If you hover over a thumbnail, you can see the big one.<br><br>This works in cache and TB logs, in the cache and TB image galleries, in public profile for the avatar and in the profile image gallery.") + "&nbsp; Max size of big image: <input class='gclh_form' size=2 type='text' id='settings_hover_image_max_sizeX0' value='" + settings_hover_image_max_size + "'> px <br/>";
            html += " &nbsp; &nbsp;" + "Spoiler-Filter: <input class='gclh_form' type='text' id='settings_spoiler_strings' value='" + settings_spoiler_strings + "'> " + show_help("If one of these words is found in the caption of the image, there will be no real thumbnail. It is to prevent seeing spoilers. Words have to be divided by |. If the field is empty, no checking is done. Default is \"spoiler|hinweis|hint\".<br><br>This option requires \"Show thumbnails of images\".") + "<br/>";
            html += "&nbsp; " + checkboxy('settings_imgcaption_on_topX0', 'Show caption on top') + show_help("This option requires \"Show thumbnails of images\".") + "<br/>";
            html += checkboxy('settings_show_big_galleryX0', 'Show bigger images in gallery') + show_help("With this option the images in the galleries of caches, TBs and profiles are displayed bigger and not in 4 columns, but in 2 columns.");
            html += content_geothumbs;
            html += checkboxy('settings_hide_avatar', 'Hide avatars in listing') + show_help("This option hides the avatars in logs. This prevents loading the hundreds of images. You have to change the option here, because GClh overrides the log-load-logic of gc.com, so the avatar option of gc.com doesn't work with GClh.") + "<br/>";
            html += checkboxy('settings_load_logs_with_gclh', 'Load logs with GClh') + show_help("This option should be enabled. <br><br>You just should disable it, if you have problems with loading the logs. <br><br>If this option is disabled, there are no VIP-, mail-, message- and top icons, no line colors and no mouse activated big images at the logs. Also the VIP lists, hide avatars, log filter and log search won't work.") + "<br/>";
            html += checkboxy('settings_show_real_owner', 'Show real owner name') + show_help("If the option is enabled, GClh will replace the pseudonym a owner took to publish the cache with the real owner name.") + "<br/>";
            html += newParameterOn1;
            html += checkboxy('settings_img_warning', 'Show warning for unavailable images') + show_help("With this option the images in the cache listing will be checked for existence before loading. If an image is unreachable or dosen't exists, a placeholder is shown. After a double click on the placeholder, the original image link will be shown.") + "<br/>";
            html += checkboxy('settings_driving_direction_link', 'Show link to Google driving direction for every waypoint') + show_help("Shows for every waypoint in the waypoint list a link to Google driving direction from home location to coordinates of the waypoint.") + "<br/>";
            html += "&nbsp; " + checkboxy('settings_driving_direction_parking_area', 'Only for parking area waypoints') + show_help("Shows only a link to the Google driving direction for waypoints of type parking area.") + "<br/>";
            html += checkboxy('settings_show_elevation_of_waypoints', 'Show elevations for waypoints and listing coordinates') + show_help("Shows the elevation of every additional waypoint and the (changed) listing coordinates.") + "<br/>";
            html += " &nbsp; &nbsp;" + "Measure unit can be set in <a href=\"https://www.geocaching.com/account/settings/preferences\">Preferences</a>" + "<br/>";
            html += newParameterVersionSetzen(0.7) + newParameterOff;
            html += "</div>";

            html += "<h4 class='gclh_headline2'>"+prepareHideable.replace("#name#","logging")+"Logging</h4>";
            html += "<div id='gclh_config_logging'>";
            html += checkboxy('settings_show_bbcode', 'Show smilies') + show_help("This option displays smilies options beside the log form. If you click on a smilie, it is inserted into your log.") + "<br/>";
            html += checkboxy('settings_autovisit', 'Enable \"AutoVisit\" feature for TBs/Coins') + show_help("With this option you are able to select TBs/Coins which should be automatically set to \"visited\" on every log. You can select \"AutoVisit\" for each TB/Coin in the list on the bottom of the log form.") + "<br/>";
            html += checkboxy('settings_replace_log_by_last_log', 'Replace log by last log template') + show_help("If you enable this option, the last log template will replace the whole log. If you disable it, it will be appended to the log.") + "<br/>";
            html += checkboxy('settings_show_log_itX0', 'Show GClh \"Log it\" icon (too for basic members for PMO)') + show_help("The GClh \"Log it\" icon is displayed beside cache titles in nearest lists. If you click it, you will be redirected directly to the log form. <br><br>You can use it too as basic member to log Premium Member Only (PMO) caches.") + "<br/>";
            html += checkboxy('settings_logit_for_basic_in_pmoX0', 'Log PMO caches by standard \"Log It\" icon (for basic members)') + show_help("With this option basic members are able to choose the standard \"Log It\" icon to call the logging screen for premium only caches. The tool tipp blocked not longer this call. You can have the same result by using the right mouse across the \"Log It\" icon and then new tab. <br>The \"Log It\" icon is besides the caches for example in the \"Recently Viewed Caches\" list and in your profile.") + "<br/>";
            html += newParameterOn1;
            html += checkboxy('settings_fieldnotes_old_fashioned', 'Logging fieldnotes old-fashioned') + show_help("This option deactivates the logging of fieldnotes by the new log page (looks like a phone app) and activates logging of fieldnotes by the old-fashioned log page.") + "<br/>";
            html += newParameterVersionSetzen(0.7) + newParameterOff;
            var placeholderDescription = "Possible placeholder:<br>&nbsp; #Found# : Your founds + 1<br>&nbsp; #Found_no# : Your founds<br>&nbsp; #Me# : Your username<br>&nbsp; #Owner# : Username of the owner<br>&nbsp; #Date# : Actual date<br>&nbsp; #Time# : Actual time in format hh:mm<br>&nbsp; #DateTime# : Actual date actual time<br>&nbsp; #GCTBName# : GC or TB name<br>&nbsp; #GCTBLink# : GC or TB link<br>&nbsp; #GCTBNameLink# : GC or TB name as a link<br>&nbsp; #LogDate# : Content of field \"Date Logged\"<br>(Upper and lower case is not required in the placeholder name.)";
            html += "&nbsp;" + "Log templates:" + show_help("Log templates are pre-defined texts like \"!!! I got the FTF !!!\". All your templates are shown beside the log form. You just have to click to a template and it will be placed in your log. <br><br>Also you are able to use placeholder for variables which will be replaced in the log. The smilies option has to be enabled. <br><br>Note: You have to set a title and a text - click to the edit icon beside the template to edit the text.") + " &nbsp; (Possible placeholder:" + show_help_big(placeholderDescription) + ")<br>";
            html += "<font class='gclh_small' style='font-style: italic; margin-left: 240px; margin-top: 25px; width: 320px; position: absolute; z-index: -1;' >Bitte beachte, dass Logtemplates nützlich sind, um automatisiert die Fundzahl, das Funddatum und ähnliches im Log einzutragen, dass aber Cache Owner Menschen sind, die sich über individuelle Logs zu ihrem Cache freuen. Beim Geocachen geht es nicht nur darum, die eigene Statistik zu puschen, sondern auch darum, etwas zu erleben. Bitte nimm dir doch etwas Zeit, den Ownern etwas wiederzugeben, indem du ihnen von Deinen Erlebnissen berichtest und ihnen gute Logs schreibst. Dann wird es auch in Zukunft Cacher geben, die sich gerne die Mühe machen, neue Caches auszulegen. Die Logtemplates sind also nützlich, können aber niemals ein vollständiges Log ersetzen.</font>";
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
            html += "&nbsp;" + "Cache log signature:" + show_help("The signature will automatically be inserted into your logs. <br><br>Also you are able to use placeholder for variables which will be replaced in the log.") + " &nbsp; (Possible placeholder:" + show_help_big(placeholderDescription) + ")<br>";
            html += "&nbsp;" + "<textarea class='gclh_form' rows='8' cols='40' id='settings_log_signature'>&zwnj;" + getValue("settings_log_signature", "") + "</textarea><br>";
            html += checkboxy('settings_log_signature_on_fieldnotes', 'Add log signature on Field Notes logs') + show_help('If this option is disabled, the log signature will not be used by logs out of Field Notes - you can use it, if you already have an signature in your Field Notes.') + "<br>";
            html += "&nbsp;" + "TB log signature:" + show_help("The signature will automatically be inserted into your TB logs. <br><br>Also you are able to use placeholder for variables which will be replaced in the log.") + " &nbsp; (Possible placeholder:" + show_help_big(placeholderDescription) + ")<br>";
            html += "&nbsp;" + "<textarea class='gclh_form' rows='8' cols='40' id='settings_tb_signature'>&zwnj;" + getValue("settings_tb_signature", "") + "</textarea><br>";
            html += "</div>";

            html += "<h4 class='gclh_headline2'>"+prepareHideable.replace("#name#","mail")+"Mail / Message form</h4>";
            html += "<div id='gclh_config_mail'>";
            var placeholderDescriptionMail = "Possible placeholder Mail / Message form:<br>&nbsp; #Found# : Your founds + 1<br>&nbsp; #Found_no# : Your founds<br>&nbsp; #Me# : Your username<br>&nbsp; #Receiver# : Username of the receiver<br>&nbsp; #Date# : Actual date<br>&nbsp; #Time# : Actual time in format hh:mm<br>&nbsp; #DateTime# : Actual date actual time<br>&nbsp; #GCTBName# : GC or TB name<br>&nbsp; #GCTBCode# : GC or TB code in brackets<br>&nbsp; #GCTBLink# : GC or TB link in brackets<br>(Upper and lower case is not required in the placeholder name.)";
            html += "&nbsp;" + "Template:&nbsp;" + show_help2("The template will automatically be inserted into your mails and messages. <br><br>Also you are able to use placeholder for variables which will be replaced in the mail and in the message.") + " &nbsp; (Possible placeholder:" + show_help_big(placeholderDescriptionMail) + ")<br>";
            html += "&nbsp;" + "<textarea class='gclh_form' rows='8' cols='40' id='settings_mail_signature'>&zwnj;" + getValue("settings_mail_signature", "") + "</textarea><br>";
            html += "</div>";

            html += "<h4 class='gclh_headline2'><a name='gclh_linklist'></a>"+prepareHideable.replace("#name#","linklist")+"Linklist / Navigation <span style='font-size: 14px'>" + show_help("In this section you can configure your personal Linklist which is shown on the top of the page and/or in your profile. You can activate it on top of this configuration page respectively in the \"Profile / Statistic\" section.") + "</span></h4>";
            html += "<div id='gclh_config_linklist'>";
            html += "&nbsp;" + "Remove from Navigation:" + show_help("Here you can select, which of the original gc.com links should be removed to make room for your Linklist.") + "<br>";
            html += "<input type='checkbox' " + (getValue('remove_navi_learn') ? "checked='checked'" : "" ) + " id='remove_navi_learn'> Learn<br>";
            html += "<input type='checkbox' " + (getValue('remove_navi_play') ? "checked='checked'" : "" ) + " id='remove_navi_play'> Play<br>";
            html += "<input type='checkbox' " + (getValue('remove_navi_community') ? "checked='checked'" : "" ) + " id='remove_navi_community'> Community<br>";
            html += "<input type='checkbox' " + (getValue('remove_navi_shop') ? "checked='checked'" : "" ) + " id='remove_navi_shop'> Shop<br>";
            html += "<br>";
            html += "<input type='checkbox' " + (settings_bookmarks_search ? "checked='checked'" : "" ) + " id='settings_bookmarks_search'> Show searchfield - Default value: <input class='gclh_form' type='text' id='settings_bookmarks_search_default' value='" + settings_bookmarks_search_default + "' size='4'>" + show_help("If you enable this option, there will be a searchfield on the top of the page beside the links. In this field you can search for GCIDs, TBIDs, tracking numbers, coordinates, ... - also you can define a default value if you want (like GC...).<br><br>This option requires \"Show Linklist on top\".") + "<br>";

            html += "<input type='radio' " + (settings_bookmarks_top_menu ? "checked='checked'" : "" ) + " name='top_menu' id='settings_bookmarks_top_menu' style='margin-top: 9px;'> Show Linklist at menu as drop-down list" + show_help("With this option your Linklist will be shown at the navigation menu as a drop-down list beside the others.<br><br>This option requires \"Change header layout\".") + "<br>";
            html += "<div id='box_top_menu_v' style='margin-left: 21px; margin-bottom: 2px; height: 141px;' >";
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
            html += "</div>";

            html += "<input type='radio' " + (settings_bookmarks_top_menu ? "" : "checked='checked'" ) + " name='top_menu' id='settings_bookmarks_top_menu_h'> Show Linklist in horizontal direction" + show_help("If you enable this option, the links in your Linklist will be shown direct on the top of the page - side by side.<br><br>This option requires \"Change header layout\" and \"Show Linklist on top\".") + "<br>";
            html += "<div id='box_top_menu_h' style='margin-left: 21px; height: 138px;' >";
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
            html += "</div>";
            html += "<br>";

            // Linklist/Bookmarks: Rechte Spalte mit den für die Linklist ausgewählten Bookmarks.
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
            html += "    <p style='margin-top:5px;margin-bottom:3px;font-family: Verdana;font-size: 14px;font-style: normal;font-weight: bold;'>Linklist" + show_help("In this column you can organize your Linklist. With the left button you can grab and move an element forwards or backwards. With the right button you can delete an element from the Linklist. You delete the element only from the Linklist, in the left columns the element is preserved.<br><br>The Linklist requires \"Show Linklist on top\" or \"Show Linklist in profile\".") + "</p>";
            html += "    <table class='gclh_form' style='width:100%; margin-top: -1px;'>";
            // Ausgewählte Bookmarks für die Linklist, rechte Spalte:
            html += "        <tbody id='gclh_LinkListTop'>";
            var order = JSON.parse(getValue("settings_bookmarks_list", "[]").replace(/, (?=,)/g, ",null"));
            // Platzhalter, falls noch keine Bookmarks für die Linklist ausgewählt wurden.
            if (order.length == 0) {
                html += "        <tr style='height: 25px;' class='gclh_LinkListPlaceHolder'>";
                html += "            <td style='padding: 0px;' >Drop here...</td>";
                html += "        </tr>";
            } else {
                for (var i = 0; i < order.length; i++) {
                    if (typeof(order[i]) == "undefined") continue;
                    if (typeof(order[i]) == "object") continue;
                    if (typeof(bookmarks[order[i]]) == "undefined") continue;
                    if (bookmarks[order[i]].custom) {
                        var text = (typeof(bookmarks_orig_title[order[i]]) != "undefined" && bookmarks_orig_title[order[i]] != "" ? bookmarks_orig_title[order[i]] : bookmarks[order[i]]['title']);
                        var textTitle = "Custom" + (order[i] - firstCust);
                        if ( !text.match(/(\S+)/) ) text = textTitle;
                    } else {
                        var text = bookmarks[order[i]]['title'];
                        var textTitle = (typeof(bookmarks_orig_title[order[i]]) != "undefined" && bookmarks_orig_title[order[i]] != "" ? bookmarks_orig_title[order[i]] : bookmarks[order[i]]['title']);
                    }
                    var textName = textTitle;
                    html += "    <tr style='height: 25px;' class='gclh_LinkListInlist' id='gclh_LinkListTop_" + order[i] + "' name='" + textName + "' title='" + textTitle + "'>";
                    html += "        <td style='padding: 0px; vertical-align: top; text-overflow: ellipsis; max-width: 166px; overflow: hidden; white-space: nowrap;'>";
                    html += "            <img style='height: 12px; margin-right: 3px; cursor: grab;' title='Grab it' src='" + global_grab_it_icon + "'/>";
                    html +=              text;
                    html += "        </td>";
                    html += "        <td style='padding: 0px;'>";
                    html += "            <img style='height: 20px; margin-left: 0px; vertical-align: top; cursor: pointer;' title ='Delete it' class='gclh_LinkListDelIcon' src='" + global_del_it_icon + "'/>";
                    html += "        </td>";
                    html += "    </tr>";
                }
            }
            html += "        </tbody>";
            html += "    </table>";
            html += "</div>";

            // Linklist/Bookmarks: Die beiden linken Spalten mit den möglichen Bookmarks und den gegebenenfalls abweichenden Bezeichnungen und Seitenbuttons.
            // -------------------
            // Bookmarks nach der Bezeichnung sortieren, falls gewünscht.
            sortBookmarksByDescription();

            html += "    <table>";
            // Überschrift.
            html += "        <thead>";
            html += "            <tr>";
            html += "                <td align='center'>" + show_help2("In this column you can choose the standard links you want to use in your Linklist.<br><br>If there is a text field, then it is a custom link. In this text field you can type any URL you want to be added to the Linklist. The checkbox behind defines, if the link should be opened in a new window.<br><br>With the left button you can grab and move an element to the Linklist.<br><br>If you have problems to drag & drop the lower links because the Linklist area is not on the screen, then use the arrow high button on your keyboard during you hold the mouseclick.") + "</td>";
            html += "                <td>" + show_help("In this column you can type a differing description for the standard link, if it is a standard link. <br><br>If it is a custom link, you have to type a decription for the custom link. <br><br>If you have problems to drag & drop the lower links because the Linklist area is not on the screen, then use the arrow high button on your keyboard during you hold the mouseclick.") + "</td>";
            html += "            </tr>";
            html += "        </thead>";
            // Zwei Spalten mit den möglichen Bookmarks und den gegebenenfalls abweichenden Bezeichnungen:
            html += "        <tbody>";
            var cust = 0;
            for (var i = 0; i < bookmarks.length; i++) {
                var num = bookmarks[i]['number'];
                html += "        <tr>";
                // Erste Spalte mit den möglichen Bookmarks:
                html += "            <td style='padding: 0px 2px 1px 2px; width: 201px; z-index: 1004;' align='left' class='gclh_LinkListElement' id='gclh_LinkListElement_" + num + "' >";
                html += "                <img style='height:12px;margin-right:3px; cursor: grab;' title='' src='"+global_grab_it2_icon+"' />";
                if (typeof(bookmarks[i]['custom']) != "undefined" && bookmarks[i]['custom'] == true) {
                    html += "            <input style='padding-left: 2px; padding-right: 2px;' class='gclh_form' type='text' title='Custom link' id='settings_custom_bookmark[" + cust + "]' value='" + bookmarks[i]['href'] + "' size='15'> ";
                    html += "            <input type='checkbox' style='margin-left: 1px;' title='Open in new window' " + (bookmarks[i]['target'] == "_blank" ? "checked='checked'" : "" ) + " id='settings_custom_bookmark_target[" + cust + "]'>";
                    cust++;
                } else {
                    html += "            <a class='gclh_ref' title='Standard link with description' ";
                    for (attr in bookmarks[i]) {
                        if (attr != "title") {
                            html +=      attr + "='" + bookmarks[i][attr] + "' ";
                        }
                    }
                    var outTitle = (typeof(bookmarks_orig_title[num]) != "undefined" && bookmarks_orig_title[num] != "" ? bookmarks_orig_title[num] : bookmarks[i]['title']);
                    html += "            >" + outTitle + "</a>";
                    // Kennzeichnung neuer Parameter in Linklist Bereich.
                    // if ( num >= 67 && num <= 67 ) {
                    //     html +=          newParameterLL?;
                    // }
                }
                html += "            </td>";
                // Zweite Spalte mit gegebenenfalls abweichenden Bezeichnungen:
                html += "            <td align='left' style='padding: 0px 2px 1px 2px;'>";
                if (typeof(bookmarks[i]['custom']) != "undefined" && bookmarks[i]['custom'] == true) {
                    html += "                <input style='padding-left: 2px; padding-right: 2px;' class='gclh_form' title='Description for custom link' id='bookmarks_name[" + num + "]' type='text' size='15' value='" + getValue("settings_bookmarks_title[" + num + "]", "") + "'>";
                } else {
                    html += "                <input style='padding-left: 2px; padding-right: 2px;' class='gclh_form' title='Differing description for standard link' id='bookmarks_name[" + num + "]' type='text' size='15' value='" + getValue("settings_bookmarks_title[" + num + "]", "") + "'>";
                    // Kennzeichnung neuer Parameter in Linklist Bereich.
                    // if ( num >= 67 && num <= 67 ) {
                    //     html +=              newParameterLLVersionSetzen(?);
                    // }
                }
                html += "            </td>";
                html += "        </tr>";
            }
            html += "        </tbody>";
            html += "    </table>";
            html += "</div>";

            html += "<br>";
            html += "";
            html += "<br>";
            html += "&nbsp;" + "<input style='padding-left: 2px; padding-right: 2px; cursor: pointer;' class='gclh_form' type='button' value='" + setValueInSaveButton() + "' id='btn_save'> <input style='padding-left: 2px; padding-right: 2px; cursor: pointer;' class='gclh_form' type='button' value='save&upload' id='btn_saveAndUpload'> <input class='gclh_form' type='button' value='close' id='btn_close2' style='cursor: pointer;'>";
            html += "<div width='400px' align='right' class='gclh_small' style='float: right; margin-top: -5px;'>GC little helper, Copyright © 2010 <a href='http://www.amshove.net/' target='_blank'>Torsten Amshove</a></div>";
            html += "<div width='400px' align='right' class='gclh_small' style='float: right; margin-top: -15px;'>License: <a href='https://github.com/2Abendsegler/GClh/blob/master/docu/license.md#readme' target='_blank' title='GNU General Public License Version 2'>GPLv2</a>, Warranty: <a href='https://github.com/2Abendsegler/GClh/blob/master/docu/warranty.md#readme' target='_blank' title='GC little helper comes with ABSOLUTELY NO WARRANTY'>NO</a></div>";
            html += "</div>";
            html += "</div>";

            // Config Content: aufbauen, Reset Area verbergen und Special Links Nearest List/Map und Own Trackables versorgen.
            // ---------------
            div.innerHTML = html;
            document.getElementsByTagName('body')[0].appendChild(div);
            $('#gclh_config_content2').hide();
            setSpecialLinks();

            // Config Content: Hauptbereiche hideable machen.
            // ---------------
            function makeConfigAreaHideable( configArea ) {
                if ( document.getElementById("lnk_gclh_config_" + configArea) ) {
                    showHideBoxCL("lnk_gclh_config_" + configArea, true);
                    document.getElementById("lnk_gclh_config_" + configArea).addEventListener("click", function() {showHideBoxCL(this.id, false);}, false);
                    // Show or hide all the areas in config with one click to a plus, minus icon with the right mouse.
                    document.getElementById("lnk_gclh_config_" + configArea).oncontextmenu = function(){return false;};
                    $('#lnk_gclh_config_' + configArea).bind('contextmenu.new', function() {showHideConfigAll(this.id, false);});
                }
            }
            // Wenn Hauptbereiche im Config hideable gemacht werden sollen, dann Anfangsbestand und Events setzen.
            if ( settings_make_config_main_areas_hideable && !document.location.href.match(/#a#/i) ) {
                makeConfigAreaHideable("global");
                makeConfigAreaHideable("config");
                makeConfigAreaHideable("nearestlist");
                makeConfigAreaHideable("bm");
                makeConfigAreaHideable("pq");
                makeConfigAreaHideable("maps");
                makeConfigAreaHideable("profile");
                makeConfigAreaHideable("listing");
                makeConfigAreaHideable("logging");
                makeConfigAreaHideable("mail");
                makeConfigAreaHideable("linklist");
            }

            // Linklist/Bookmarks: Events aufbauen und Anfangsbestand der Linklist bei den Bookmarks kennzeichnen.
            // -------------------
            for (var i = 0; i < bookmarks.length; i++) {
                // Input Events in Bookmarks aufbauen, Spalte 2, abweichende Bezeichnungen.
                document.getElementById('bookmarks_name[' + i + ']').addEventListener("input", updateByInputDescription, false);
                // Anfangsbestand der Linklist bei den Bookmarks kennzeichnen.
                // Prüfen, ob Bookmark in der Linklist vorhanden ist. Cursor und Opacity entsprechend setzen.
                if ( document.getElementById('gclh_LinkListTop_' + i) ) {
                    flagBmInLl( document.getElementById('gclh_LinkListElement_' + i), false, "not-allowed", "0.4", "Already available in Linklist" );
                } else {
                    flagBmInLl( document.getElementById('gclh_LinkListElement_' + i), false, "grab", "1", "Grab it" );
                }
            }
            var elem = document.getElementsByClassName('gclh_LinkListInlist');
            for (var i = 0; i < elem.length; i++) {
                // Mousedown und Mouseup Events in Linklist aufbauen, rechte Spalte, Move Icon und Bezeichnung.
                // (Delete Icon wird hier nicht berücksichtigt.)
                elem[i].children[0].children[0].addEventListener("mousedown", function(event){changeAttrMouse(event, this, "move");}, false); // Move Icon
                elem[i].children[0].addEventListener("mousedown", function(event){changeAttrMouse(event, this, "desc");}, false);             // Description
                elem[i].children[0].children[0].addEventListener("mouseup", function(event){changeAttrMouse(event, this, "move");}, false);   // Move Icon
                elem[i].children[0].addEventListener("mouseup", function(event){changeAttrMouse(event, this, "desc");}, false);               // Description
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
                flagBmInLl( document.getElementById("gclh_LinkListElement_" + index), false, "grab", "1", "Grab it" );
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
                    htmlRight += "       <img style='height: 12px; margin-right: 3px; cursor: grab;' title ='Grab it' src='"+global_grab_it_icon+"' />";
                    htmlRight +=         text;
                    htmlRight += "   </td>";
                    htmlRight += "   <td style='padding: 0px;'>";
                    htmlRight += "       <img class='gclh_LinkListDelIcon' style='height: 20px; margin-left: 0px; vertical-align: top; cursor: pointer;' title ='Delete it' src='" + global_del_it_icon + "' />";
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

            // Map / Layers:
            // -------------
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
                        settings_map_default_layer = "";
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
            // Fill layer lists.
            var layerListAvailable="";
            var layerListUnAvailable="";

            // Wenn bisher keine Layer ausgewählt wurden, dann alle auswählen, so wie es auch auf der Karte gehandhabt wird.
            if (settings_map_layers == "" || settings_map_layers.length < 1) {
                for (name in all_map_layers) {
                    $("#settings_maplayers_available").append(layerOption( name ,(settings_map_default_layer == name)) );
                }
            } else {
                for (name in all_map_layers) {
                    if ( settings_map_layers.indexOf(name) != -1 ) {
                        $("#settings_maplayers_available").append(layerOption( name ,(settings_map_default_layer == name)) );
                    } else {
                        $("#settings_maplayers_unavailable").append(layerOption( name , false ) );
                    }
                }
            }

            $("#settings_use_gclh_layercontrol").click(function () {
                $("#MapLayersConfiguration").toggle();
            });

            // Colorpicker:
            // ------------
            var code = GM_getResourceText("jscolor");
            code += 'new jscolor.init();';
            var script = document.createElement("script");
            script.innerHTML = code;
            document.getElementsByTagName("body")[0].appendChild(script);

            // Multi-Homezone:
            // ---------------
            function gclh_init_multi_homecoord_remove_listener($el) {
                $el.find('.remove').click(function () {
                    $(this).closest('.multi_homezone_element').remove();
                });
            }

            // Initialize remove listener for present elements.
            gclh_init_multi_homecoord_remove_listener($('.multi_homezone_settings'));
            // Initialize add listener for multi homecoord entries.
            $('.multi_homezone_settings .addentry').click(function () {
                var $newEl = $(multi_hz_el);
                $('.multi_homezone_settings .wrapper').append($newEl);
                // Initialize remove listener for new element.
                gclh_init_multi_homecoord_remove_listener($newEl);
                // Reinit jscolor.
                if (typeof(chrome) != "undefined") {
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
                } else {
                    var script = document.createElement("script");
                    script.innerHTML = 'new jscolor.init();';
                    document.getElementsByTagName("body")[0].appendChild(script);
                }
            });

            // Rest:
            // -----
            function gclh_show_linklist() {
                if ( document.getElementById('lnk_gclh_config_linklist').title == "show" ) {
                    document.getElementById('lnk_gclh_config_linklist').click();
                }
            }

            document.getElementById('check_for_upgrade').addEventListener("click", function () { checkForUpgrade( true ); }, false);
            document.getElementById('rc_link').addEventListener("click", rcPrepare, false);
            document.getElementById('rc_reset_button').addEventListener("click", rcReset, false);
            document.getElementById('rc_close_button').addEventListener("click", rcClose, false);
            document.getElementById('gclh_linklist_link_1').addEventListener("click", gclh_show_linklist, false);
            document.getElementById('gclh_linklist_link_2').addEventListener("click", gclh_show_linklist, false);

            document.getElementById('btn_close2').addEventListener("click", btnClose, false);
            document.getElementById('btn_save').addEventListener("click", function () { btnSave("normal"); }, false);
            document.getElementById('btn_saveAndUpload').addEventListener("click", function () { btnSave("upload"); }, false);
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
//--> $$065 Begin of insert
//<-- $$065 End of insert
            document.getElementById('settings_process_vup').addEventListener("click", alert_settings_process_vup, false);
            document.getElementById('settings_process_vupX0').addEventListener("click", alert_settings_process_vup, false);

            // Events setzen für Parameter, die im GClh Config mehrfach ausgegeben wurden, weil sie zu mehreren Themen gehören. Es handelt sich hier
            // um den Parameter selbst. In der Function werden die Events für den Parameter selbst (beispielsweise "settings_show_mail_in_viplist") und dessen
            // "Clone" gesetzt, die hinten mit einem "X" und eine Nummerierung von 0 bis 9 enden können (beispielsweise "settings_show_mail_in_viplistX0").
            setEventsForDoubleParameters( "settings_show_mail_in_viplist", "click" );
            setEventsForDoubleParameters( "settings_show_mail_in_allmyvips", "click" );
            setEventsForDoubleParameters( "settings_process_vup", "click" );
            setEventsForDoubleParameters( "settings_show_vup_friends", "click" );
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
            setEventsForDependentParameters( "settings_change_header_layout", "settings_remove_logo" );
            setEventsForDependentParameters( "settings_show_smaller_gc_link", "settings_remove_logo" );
            setEventsForDependentParameters( "settings_change_header_layout", "settings_show_smaller_area_top_right" );
            setEventsForDependentParameters( "settings_change_header_layout", "settings_remove_message_in_header" );
            setEventsForDependentParameters( "settings_show_smaller_area_top_right", "settings_remove_message_in_header" );
            setEventsForDependentParameters( "settings_change_header_layout", "settings_gc_tour_is_working" );
            setEventsForDependentParameters( "settings_change_header_layout", "settings_fixed_header_layout" );
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
            setEventsForDependentParameters( "settings_show_vip_list", "settings_make_vip_lists_hideable" );
            setEventsForDependentParameters( "settings_show_vip_list", "settings_process_vup" );
            setEventsForDependentParameters( "settings_show_vip_list", "settings_show_vup_friends" );
            setEventsForDependentParameters( "settings_process_vup", "settings_show_vup_friends" );
            setEventsForDependentParameters( "settings_process_vupX0", "settings_show_vup_friends" );
            setEventsForDependentParameters( "settings_process_vup", "settings_vup_hide_avatar" );
            setEventsForDependentParameters( "settings_process_vup", "settings_vup_hide_log" );
            setEventsForDependentParameters( "settings_process_vupX0", "settings_vup_hide_avatar" );
            setEventsForDependentParameters( "settings_process_vupX0", "settings_vup_hide_log" );
            setEventsForDependentParameters( "settings_vup_hide_avatar", "settings_vup_hide_log"  );
            setEventsForDependentParameters( "settings_log_inline", "settings_log_inline_tb", false );
            setEventsForDependentParameters( "settings_log_inline_pmo4basic", "settings_log_inline_tb", false );
            setEventsForDependentParameters( "settings_show_mail", "settings_show_mail_in_viplist" );
            setEventsForDependentParameters( "settings_show_mail", "settings_show_mail_in_allmyvips" );
            setEventsForDependentParameters( "settings_show_mail", "settings_mail_icon_new_win" );
            setEventsForDependentParameters( "settings_show_message", "settings_message_icon_new_win" );
            setEventsForDependentParameters( "settings_show_thumbnails", "settings_hover_image_max_size" );
            setEventsForDependentParameters( "settings_show_thumbnails", "settings_spoiler_strings" );
            setEventsForDependentParameters( "settings_show_thumbnails", "settings_imgcaption_on_top" );
            setEventsForDependentParameters( "settings_show_thumbnailsX0", "settings_hover_image_max_size" );
            setEventsForDependentParameters( "settings_show_thumbnailsX0", "settings_spoiler_strings" );
            setEventsForDependentParameters( "settings_show_thumbnailsX0", "settings_imgcaption_on_top" );
            setEventsForDependentParameters( "settings_map_overview_build", "settings_map_overview_zoom" );
            setEventsForDependentParameters( "settings_count_own_matrix_show_next", "settings_count_own_matrix_show_count_next" );
            setEventsForDependentParameters( "settings_count_own_matrix_show_next", "settings_count_own_matrix_show_color_next" );
            setEventsForDependentParameters( "settings_count_own_matrix_show_next", "restore_settings_count_own_matrix_show_color_next" );
            setEventsForDependentParameters( "settings_count_own_matrix_show_next", "settings_count_own_matrix_links_radius" );
            setEventsForDependentParameters( "settings_count_own_matrix_show_next", "settings_count_own_matrix_links" );
            setEventsForDependentParameters( "settings_add_link_gc_map_on_google_maps", "settings_switch_to_gc_map_in_same_tab" );
            setEventsForDependentParameters( "settings_add_link_google_maps_on_gc_map", "settings_switch_to_google_maps_in_same_tab" );
            setEventsForDependentParameters( "settings_add_link_gc_map_on_osm", "settings_switch_from_osm_to_gc_map_in_same_tab" );
            setEventsForDependentParameters( "settings_add_link_osm_on_gc_map", "settings_switch_to_osm_in_same_tab" );
            setEventsForDependentParameters( "settings_add_link_flopps_on_gc_map", "settings_switch_to_flopps_in_same_tab" );
            setEventsForDependentParameters( "settings_add_link_geohack_on_gc_map", "settings_switch_to_geohack_in_same_tab" );
            setEventsForDependentParameters( "settings_show_latest_logs_symbols", "settings_show_latest_logs_symbols_count" );
            setEventsForDependentParameters( "settings_load_logs_with_gclh", "settings_show_latest_logs_symbols" );
            setEventsForDependentParameters( "settings_log_statistic", "settings_log_statistic_reload" );
            setEventsForDependentParameters( "settings_log_statistic", "settings_log_statistic_percentage" );
            setEventsForDependentParameters( "settings_friendlist_summary", "settings_friendlist_summary_viponly" );
            setEventsForDependentParameters( "settings_remove_banner", "settings_remove_banner_to_mylists_new" );
            setEventsForDependentParameters( "settings_remove_banner", "settings_remove_banner_to_mylists_old" );
            setEventsForDependentParameters( "settings_remove_banner", "settings_remove_banner_for_garminexpress" );
            setEventsForDependentParameters( "settings_driving_direction_link", "settings_driving_direction_parking_area" );
//--> $$065 Begin of insert
//<-- $$065 End of insert
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
        //   GClh Config befindet, sonst würde hierfür ein Save durchgeführt, obwohl die F2 Taste irgendwo anders betätigt wurde! Im Config Reset Modus nichts tun.
        function keydown(e) {
            if ( check_config_page() ) {
                if ( document.getElementById("settings_f2_save_gclh_config").checked && !global_mod_reset ) {
                    if (e.keyCode == 113) {
                        document.getElementById("btn_save").click();
                    }
                }
            }
        }

        // Save Button.
        function btnSave(type) {
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
            setValue("settings_spoiler_strings", document.getElementById('settings_spoiler_strings').value);
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
            setValue("settings_show_latest_logs_symbols_count", document.getElementById('settings_show_latest_logs_symbols_count').value);
            setValue("settings_default_langu", document.getElementById('settings_default_langu').value);
            setValue("settings_log_statistic_reload", document.getElementById('settings_log_statistic_reload').value);
            setValue("settings_pq_cachestotal", document.getElementById('settings_pq_cachestotal').value);
            setValue("settings_pq_difficulty", document.getElementById('settings_pq_difficulty').value);
            setValue("settings_pq_difficulty_score", document.getElementById('settings_pq_difficulty_score').value);
            setValue("settings_pq_terrain", document.getElementById('settings_pq_terrain').value);
            setValue("settings_pq_terrain_score", document.getElementById('settings_pq_terrain_score').value);
//--> $$065 Begin of insert
//<-- $$065 End of insert

            // Map Layers in vorgegebener Reihenfolge übernehmen.
            var new_map_layers_available = document.getElementById('settings_maplayers_available');
            var new_settings_map_layers = new Array();
            for (name in all_map_layers) {
                for (var i = 0; i < new_map_layers_available.options.length; i++) {
                    if ( name == new_map_layers_available.options[i].value ) {
                        new_settings_map_layers.push(new_map_layers_available.options[i].value);
                        break;
                    }
                }
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
                'settings_fixed_header_layout',
                'settings_remove_logo',
                'settings_remove_message_in_header',
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
                'settings_gc_tour_is_working',
                'settings_show_smaller_gc_link',
                'settings_show_smaller_area_top_right',
                'settings_menu_show_separator',
                'settings_menu_float_right',
                'settings_show_message',
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
                'settings_process_vup',
                'settings_show_vup_friends',
                'settings_vup_hide_avatar',
                'settings_vup_hide_log',
                'settings_f2_save_gclh_config',
                'settings_f4_call_gclh_config',
                'settings_f10_call_gclh_sync',
                'settings_show_sums_in_bookmark_lists',
                'settings_show_sums_in_watchlist',
                'settings_hide_warning_message',
                'settings_show_save_message',
                'settings_map_overview_build',
                'settings_logit_for_basic_in_pmo',
                'settings_log_statistic',
                'settings_log_statistic_percentage',
                'settings_count_own_matrix',
                'settings_count_foreign_matrix',
                'settings_count_own_matrix_show_next',
                'settings_hide_left_sidebar_on_google_maps',
                'settings_add_link_gc_map_on_google_maps',
                'settings_switch_to_gc_map_in_same_tab',
                'settings_add_link_google_maps_on_gc_map',
                'settings_switch_to_google_maps_in_same_tab',
                'settings_add_link_osm_on_gc_map',
                'settings_switch_to_osm_in_same_tab',
                'settings_add_link_gc_map_on_osm',
                'settings_switch_from_osm_to_gc_map_in_same_tab',
                'settings_add_link_flopps_on_gc_map',
                'settings_switch_to_flopps_in_same_tab',
                'settings_add_link_geohack_on_gc_map',
                'settings_switch_to_geohack_in_same_tab',
                'settings_sort_default_bookmarks',
                'settings_make_vip_lists_hideable',
                'settings_show_latest_logs_symbols',
                'settings_set_default_langu',
                'settings_hide_colored_versions',
                'settings_make_config_main_areas_hideable',
                'settings_faster_profile_trackables',
//--> $$065 Begin of insert
//<-- $$065 End of insert
                'settings_show_google_maps',
                'settings_show_log_it',
                'settings_show_nearestuser_profil_link',
                'settings_show_homezone',
                'settings_show_hillshadow',
                'remove_navi_learn',
                'remove_navi_play',
                'remove_navi_community',
                'remove_navi_shop',
                'settings_bookmarks_top_menu',
                'settings_hide_advert_link',
                'settings_hide_spoilerwarning',
                'settings_hide_top_button',
                'settings_hide_hint',
                'settings_strike_archived',
                'settings_highlight_usercoords',
                'settings_highlight_usercoords_bb',
                'settings_highlight_usercoords_it',
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
                'settings_link_big_listing',
                'settings_show_big_gallery',
                'settings_automatic_friend_reset',
                'settings_show_long_vip',
                'settings_load_logs_with_gclh',
                'settings_hide_map_header',
                'settings_replace_log_by_last_log',
                'settings_show_real_owner',
                'settings_hide_archived_in_owned',
                'settings_hide_visits_in_profile',
                'settings_log_signature_on_fieldnotes',
                'settings_vip_show_nofound',
                'settings_use_gclh_layercontrol',
                'settings_fixed_pq_header',
                'settings_sync_autoImport',
                'settings_map_hide_sidebar',
                'settings_friendlist_summary',
                'settings_friendlist_summary_viponly',
                'settings_search_enable_user_defined',
                'settings_pq_warning',
                'settings_pq_set_cachestotal',
                'settings_pq_option_ihaventfound',
                'settings_pq_option_idontown',
                'settings_pq_option_ignorelist',
                'settings_pq_option_isenabled',
                'settings_pq_option_filename',
                'settings_pq_set_difficulty',
                'settings_pq_set_terrain',
                'settings_pq_automatically_day',
                'settings_mail_icon_new_win',
                'settings_message_icon_new_win',
                'settings_hide_cache_approvals',
                'settings_driving_direction_link',
                'settings_driving_direction_parking_area',
                'settings_show_elevation_of_waypoints',
                'settings_img_warning',
                'settings_fieldnotes_old_fashioned',
                'settings_remove_banner',
                'settings_remove_banner_to_mylists_new',
                'settings_remove_banner_to_mylists_old',
                'settings_remove_banner_for_garminexpress',
                'settings_compact_layout_bm_lists',
                'settings_compact_layout_list_of_bm_lists'
            );
            for (var i = 0; i < checkboxes.length; i++) {
                if ( document.getElementById(checkboxes[i]) ) {
                    setValue(checkboxes[i], document.getElementById(checkboxes[i]).checked);
                }
            }

            // Save Log-Templates.
            for (var i = 0; i < anzTemplates; i++) {
                var name = document.getElementById('settings_log_template_name[' + i + ']');
                var text = document.getElementById('settings_log_template[' + i + ']');
                if (name && text) {
                    setValue('settings_log_template_name[' + i + ']', name.value);
                    setValue('settings_log_template[' + i + ']', text.value.replace(/‌/g, "")); // Fix: Entfernt das Steuerzeichen
                }
            }

            // Save Linklist/Bookmarks: Rechte Spalte.
            // Create the settings_bookmarks_list Array (gclh_LinkListTop).
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
                } else {
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
// Functions Config (fun2)
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
            if (a.paId < b.paId) return -1;
            if (a.paId > b.paId) return 1;
            return 0;
        });
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
    // Handling der Events.
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
                     + "and the latest logs won't work.";
            alert( mess );
        }
    }

// Wenn VUPs im Config deaktiviert wird und es sind VUPs vorhanden, dann Confirm Meldung, dass die VUPs gelöscht werden.
// Ansonsten können Konstellationen entstehen, mit Usern, die gleichzeitig VIP und VUP sind.
    function alert_settings_process_vup() {
        if ((!document.getElementById("settings_process_vup").checked || !document.getElementById("settings_process_vupX0").checked) && getValue("vups")) {
            var vups = getValue("vups");
            vups = vups.replace(/, (?=,)/g, ",null");
            vups = JSON.parse(vups);
            if (vups.length > 0) {
                var text = "You have " + vups.length + " VUPs (very unimportant persons) saved. \n"
                         + "If you disable this feature of VUP processing, the VUPs\n"
                         + "are deleted. Please note, it can not be revoked.\n\n"
                         + "Click OK to delete the VUPs now and disable the feature.";
                if (window.confirm(text)) {
                    var vups = new Array();
                    setValue("vups", JSON.stringify(vups));
                } else {
                    document.getElementById("settings_process_vup").checked = "checked";
                    document.getElementById("settings_process_vupX0").checked = "checked";
                }
            }
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

// Function, um die Bezeichnung des Save Buttons (save bzw. save (F2)) zu versorgen.
    function setValueInSaveButton() {
        wert = "save";
        // Nach dem Aufbau der GClh Config Seite.
        if ( document.getElementById("settings_f2_save_gclh_config") ) {
            if ( document.getElementById("settings_f2_save_gclh_config").checked ) {
                wert = "save (F2)";
            }
            document.getElementById('btn_save').setAttribute("value", wert);
            return;
        // Vor dem Aufbau der GClh Config Seite.
        } else {
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
            });
        }
    }

// Show or hide all the areas in config with one click to a plus, minus icon with the right mouse.
    function showHideConfigAll(id_lnk) {
        showHide = showHideBoxCL(id_lnk, false);
        // Alle anderen Boxen identisch aufbauen.
        setShowHideConfigAll("gclh_config_global", showHide);
        setShowHideConfigAll("gclh_config_config", showHide);
        setShowHideConfigAll("gclh_config_nearestlist", showHide);
        setShowHideConfigAll("gclh_config_bm", showHide);
        setShowHideConfigAll("gclh_config_pq", showHide);
        setShowHideConfigAll("gclh_config_maps", showHide);
        setShowHideConfigAll("gclh_config_profile", showHide);
        setShowHideConfigAll("gclh_config_listing", showHide);
        setShowHideConfigAll("gclh_config_logging", showHide);
        setShowHideConfigAll("gclh_config_mail", showHide);
        setShowHideConfigAll("gclh_config_linklist", showHide);
        if (showHide == "show") window.scroll(0, 0);
        else {
            document.getElementById(id_lnk).scrollIntoView();
            window.scrollBy(0, -8);
        }
    }
    function setShowHideConfigAll( stamm, whatToDo ) {
        document.getElementById("lnk_"+stamm).title = (whatToDo == "show" ? "show" : "hide");
        document.getElementById("lnk_"+stamm).src = (whatToDo == "show" ? global_plus_config2 : global_minus_config2);
        if (whatToDo == "show") $('#'+stamm).hide();
        else $('#'+stamm).show();
        setValue("show_box_"+stamm, (whatToDo == "show" ? false : true));
    }

// Reset Config functions.
    function rcPrepare() {
        global_mod_reset = true;
        if (document.getElementById('settings_overlay')) document.getElementById('settings_overlay').style.overflow = "hidden";
        $('#gclh_config_content1').hide();
        $('#gclh_config_content3').hide();
        $('#gclh_config_content2').show(600);
    }
    function rcReset() {
        try {
            if (document.getElementById("rc_standard").checked || document.getElementById("rc_temp").checked) {
                if (!window.confirm("Click OK to reset the data. \nPlease note, this process can not be revoked.")) return;
            }
            if (document.getElementById("rc_doing")) document.getElementById("rc_doing").src = "/images/loading2.gif";
            if (document.getElementById("rc_reset_button")) document.getElementById("rc_reset_button").disabled = true;
            if (document.getElementById("rc_homecoords").checked) {
                var keysDel = new Array();
                keysDel[keysDel.length] = "home_lat";
                keysDel[keysDel.length] = "home_lng";
                rcConfigDataDel(keysDel);
            }
            if (document.getElementById("rc_uid").checked) {
                var keysDel = new Array();
                keysDel[keysDel.length] = "uid";
                rcConfigDataDel(keysDel);
            }
            if (document.getElementById("rc_standard").checked) {
//--> $$000 Begin of change
                // Beachten, dass neue Parameter vermutlich in diese Datei aufgenommen werden müssen.
                rcGetData("https://raw.githubusercontent.com/2Abendsegler/GClh/master/data/config_standard.txt", "st");
//<-- $$000 End of change
            }
            if (document.getElementById("rc_temp").checked) {
                rcGetData("https://raw.githubusercontent.com/2Abendsegler/GClh/master/gc_little_helper_II.user.js", "js");
            }
        } catch (e) {
            gclh_error("reset config data", e);
        }
    }
    function rcGetData(url, name) {
        global_rc_data = global_rc_status = "";
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function (response) {
                global_rc_status = parseInt(response.status);
                global_rc_data = response.responseText;
            }
        });
        function rcCheckDataLoad(waitCount, name) {
            if (global_rc_data == "" || global_rc_status != 200) {
                waitCount++;
                if ( waitCount <= 25 ) setTimeout( function () { rcCheckDataLoad(waitCount, name); }, 200);
                else {
                    alert("Can not load file with " + (name == "st" ? "standard configuration data":"script data") + ".\nNothing changed.");
                    if (document.getElementById("rc_doing")) setTimeout( function () { document.getElementById("rc_doing").src = ""; }, 500);
                }
            } else {
                if (name == "st") rcConfigDataChange(global_rc_data);
                if (name == "js") rcConfigDataNotInUseDel(global_rc_data);
            }
        }
        rcCheckDataLoad(0, name);
    }
    function rcConfigDataDel(data) {
        var config_tmp = {};
        var changed = false;
        for (key in CONFIG) {
            var del = false;
            for (var i = 0; i < data.length; i++) {
                if (key == data[i]) {
                    changed = true;
                    del = true;
                    document.getElementById('rc_configData').innerText += "delete: " + data[i] + ": " + CONFIG[key] + "\n";
                    break;
                }
            }
            if (!del) {
                config_tmp[key] = CONFIG[key];
            }
        }
        CONFIG = config_tmp;
        rcConfigUpdate(changed);
    }
    function rcConfigDataChange(stData) {
        var data = JSON.parse(stData);
        var changed = false;
        for (key in data) {
            if (data[key] != CONFIG[key]) {
                changed = true;
                document.getElementById('rc_configData').innerText += "change: " + key + ": " + CONFIG[key] + " -> " + data[key] + "\n";
                CONFIG[key] = data[key];
            }
        }
        rcConfigUpdate(changed);
    }
    function rcConfigDataNotInUseDel(data) {
//--> $$000 Begin of change
        // Beachten, dass neue Parameter womöglich neue Ausnahmeregeln hervorrufen, die hier berücksichtigt werden müssen.
//<-- $$000 End of change
        var config_tmp = {};
        var changed = false;
        for (key in CONFIG) {
            var kkey = key.split("[");
            var kkey = kkey[0];
            if (kkey.match(/^(vips|dbToken|token|uid)$/) ||
                kkey.match(/^(show_box|friends_founds_|friends_hides_)/) ||
                kkey.match(/^gclh_(.*)(_logs_get_last|_logs_count)$/)       ) {
                config_tmp[key] = CONFIG[key];
            } else if (kkey.match(/autovisit_(\d+)/)) {
                changed = true;
                document.getElementById('rc_configData').innerText += "delete: " + key + ": " + CONFIG[key] + "\n";
            } else if (data.match(kkey)) {
                config_tmp[key] = CONFIG[key];
            } else {
                changed = true;
                document.getElementById('rc_configData').innerText += "delete: " + key + ": " + CONFIG[key] + "\n";
            }
        }
        CONFIG = config_tmp;
        rcConfigUpdate(changed);
    }
    function rcConfigUpdate(changed) {
        setTimeout( function () {
            if (document.getElementById("rc_doing")) document.getElementById("rc_doing").src = "";
            if (document.getElementById("rc_reset_button")) document.getElementById("rc_reset_button").disabled = false;
        }, 500);
        if (changed) {
            var defer = $.Deferred();
            GM_setValue("CONFIG", JSON.stringify(CONFIG));
            defer.resolve();
            return defer.promise();
        } else {
            document.getElementById('rc_configData').innerText += "(nothing to change)\n";
        }
    }
    function rcClose() {
        window.scroll(0, 0);
        $("#settings_overlay").fadeOut(400);
        document.location.href = clearUrlAppendix( document.location.href, false );
        window.location.reload(false);
    }

//--> $$065 Begin of insert
//<-- $$065 End of insert

////////////////////////////////////////////////////////////////////////////
// Sync
////////////////////////////////////////////////////////////////////////////
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

    function sync_setConfigData(data){
        var parsedData = JSON.parse(data);
        var settings = {};
        for(key in parsedData){
            if (!gclhConfigKeysIgnoreForBackup[key]) {
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

    function gclh_showSync() {
        btnClose();
        scroll(0, 0);

        if (document.getElementById('bg_shadow')) {
            if (document.getElementById('bg_shadow').style.display == "none") {
                document.getElementById('bg_shadow').style.display = "";
            }
        } else {
            buildBgShadow();
        }

        if (document.getElementById('sync_settings_overlay') && document.getElementById('sync_settings_overlay').style.display == "none") {
            document.getElementById('sync_settings_overlay').style.display = "";
        } else {
            create_config_css();

            var div = document.createElement("div");
            div.setAttribute("id", "sync_settings_overlay");
            div.setAttribute("class", "settings_overlay");
            var html = "";
            html += "<h3 class='gclh_headline'>" + scriptNameSync + " <font class='gclh_small'>v" + scriptVersion + "</font></h3>";
            html += "<div class='gclh_content'>";
            html += "<h3 id='syncDBLabel' style='cursor: pointer;'>DropBox <font class='gclh_small'>(Click to hide/show)<span style='color: #d14f4f;'> (Not yet fully supported)</span></font></h3>";
            html += "<div style='display:none;' id='syncDB' >";
            html += "<img style='display:none;height: 40px;' id='syncDBLoader' src='"+global_syncDBLoader_icon+"'>";
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
                    window.scroll(0, 0);
                    $("#sync_settings_overlay").fadeOut(400);
                    if ( settings_show_save_message ) {
                        showSaveForm();
                        document.getElementById("save_overlay_h3").innerHTML = "imported";
                    }
                    // Reload page
                    if (document.location.href.indexOf("#") == -1 || document.location.href.indexOf("#") == document.location.href.length - 1) {
                        $('html, body').animate({scrollTop: 0}, 0);
                        document.location.reload(true);
                    } else {
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
                    // Reload page
                    if (document.location.href.indexOf("#") == -1 || document.location.href.indexOf("#") == document.location.href.length - 1) {
                        $('html, body').animate({scrollTop: 0}, 0);
                        document.location.reload(true);
                    } else {
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

    if ( (settings_sync_autoImport && (settings_sync_last.toString() === "Invalid Date" || (new Date() - settings_sync_last) > settings_sync_time)) ){
        if (document.URL.indexOf("#access_token") != -1) {
            $("body").hide();
            Dropbox.AuthDriver.Popup.oauthReceiver();
        }

        if (settings_sync_autoImport && (settings_sync_last.toString() === "Invalid Date" || (new Date() - settings_sync_last) > settings_sync_time) && document.URL.indexOf("#access_token") === -1) {
            gclh_sync_DBHash().done(function (hash) {
                if (hash != settings_sync_hash) {
                    gclh_sync_DBLoad().done(function () {
                        settings_sync_last = new Date();
                        settings_sync_hash = hash;
                        setValue("settings_sync_last", settings_sync_last.toString()).done(function(){
                            setValue("settings_sync_hash", settings_sync_hash).done(function(){
                                if (is_page("profile")) {
                                    // Reload page
                                    if (document.location.href.indexOf("#") == -1 || document.location.href.indexOf("#") == document.location.href.length - 1) {
                                        $('html, body').animate({scrollTop: 0}, 0);
                                        document.location.reload(true);
                                    } else {
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
}; // end of mainGC

////////////////////////////////////////////////////////////////////////////
// Functions global (fun3)
////////////////////////////////////////////////////////////////////////////
// Create a bookmark to a page in the geocaching.com name space.
function bookmark(title, href, bookmarkArray) {
    var bm = new Object();
    bookmarkArray[bookmarkArray.length] = bm;
    bm['href'] = href;
    bm['title'] = title;
    return bm;
}

// Create a bookmark to an external site.
function externalBookmark(title, href, bookmarkArray) {
    var bm = bookmark(title, href, bookmarkArray);
    bm['rel'] = "external";
    bm['target'] = "_blank";
}

// Create a bookmark to a profile sub site.
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

//--> $$065 Begin of insert
//<-- $$065 End of insert

// Check if the current document location matches the given path.
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

// Logging function.
function gclh_log(log) {
    var txt = "GClh_LOG - " + document.location.href + ": " + log;
    if (typeof(console) != "undefined") {
        console.info(txt);
    } else if (typeof(GM_log) != "undefined") {
        GM_log(txt);
    }
}

// Error-Logging function.
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
    GM_setValue("CONFIG", JSON.stringify(CONFIG));
    defer.resolve();
    return defer.promise();
}

function setValueSet(data) {
    var defer = $.Deferred();
	var data2Store = {};
    for (key in data) {
        CONFIG[key] = data[key];
        data2Store[key] = data[key];
    }
    GM_setValue("CONFIG", JSON.stringify(CONFIG));
    defer.resolve();
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

// Wrapper, um zu pruefen auf welche Seite der Link zeigt.
function is_link(name, url) {
	var status = false;
    switch (name) {
        case "cache_listing":
            if ((url.match(/^https?:\/\/www\.geocaching\.com\/seek\/cache_details\.aspx/) || url.match(/^https?:\/\/www\.geocaching\.com\/geocache\//) ) && !document.getElementById("cspSubmit") && !document.getElementById("cspGoBack")) status = true;
            break;
        case "profile":
            if (url.match(/^https?:\/\/www\.geocaching\.com\/my(\/default\.aspx)?/) ) status = true;
            break;
        case "publicProfile":
            if (url.match(/^https?:\/\/www\.geocaching\.com\/profile/)) status = true;
            break;
        case "map":
            if (url.match(/^https?:\/\/www\.geocaching\.com\/map/)) status = true;
            break;
        case "find_cache":
            if (url.match(/^https?:\/\/www\.geocaching\.com\/play\/(search|geocache)/)) status = true;
            break;
        case "hide_cache":
            if (url.match(/^https?:\/\/www\.geocaching\.com\/play\/hide/)) status = true;
            break;
        case "settings":
            if (url.match(/^https?:\/\/www\.geocaching\.com\/account\/(settings|lists)/)) status = true;
            break;
        case "messagecenter":
            if (url.match(/^https?:\/\/www\.geocaching\.com\/account\/messagecenter/)) status = true;
            break;
        case "geotours":
            if (url.match(/^https?:\/\/www\.geocaching\.com\/play\/geotours/)) status = true;
            break;
        case "labs":
            if (url.match(/^https?:\/\/labs\.geocaching\.com/)) status = true;
            break;
        default:
            gclh_error( "is_link", "is_link( "+name+", ... ): unknown name" );
            break;
    }
    // debugging output
    // status ? (gclh_log( "is_link( "+name+", "+url+"): " + status )) : false;
    return status;
}

// Wrapper fuer die aktuelle Seite (siehe is_link).
function is_page(name) {
    return is_link(name, document.location.href);
}

// Helperfunctions to inject functions into site context.
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

// Funktionen fuer die Zeitdifferenzen.
function adjustPlural(singularWord, timesNumber) {
    return singularWord + ((Math.abs(timesNumber) != 1) ? "s" : "");
}

// Calculates the difference between two dates and returns it as a "humanized" string
// borrowed from http://userscripts.org/scripts/show/36353
function getDateDiffString(dateNew, dateOld) {
    var dateDiff = new Date(dateNew - dateOld);
    dateDiff.setUTCFullYear(dateDiff.getUTCFullYear() - 1970); // Substracts 1970 years to compensate Date.getTime's (Unix) epoch (1 Jan 1970 00:00:00 UTC)
    var strDateDiff = "", timeunitValue = 0;
    var timeunitsHash = {year: "getUTCFullYear", month: "getUTCMonth", day: "getUTCDate",
                         hour: "getUTCHours", minute: "getUTCMinutes", second: "getUTCSeconds", millisecond: "getUTCMilliseconds"};

    for (var timeunitName in timeunitsHash) {
        timeunitValue = dateDiff[timeunitsHash[timeunitName]]() - ((timeunitName == "day") ? 1 : 0);
        if (timeunitValue !== 0) {
            if ((timeunitName == "millisecond") && (strDateDiff.length !== 0)) { continue; } // Milliseconds won't be added unless the difference is less than 1 second
            strDateDiff += ((strDateDiff.length === 0) ? "" : ", ") + // Adds a comma as separator if another time unit has already been added
                            timeunitValue + " " + adjustPlural(timeunitName, timeunitValue);
        }
    }
    // Replaces the last comma with an "and" to humanize the string
    strDateDiff = strDateDiff.replace(/,([^,]*)$/, " and$1");

    return strDateDiff;
}

start(this);
