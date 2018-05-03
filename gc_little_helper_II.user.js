// ==UserScript==
// @name             GC little helper II
// @namespace        http://www.amshove.net
//--> $$000
// @version          0.9.5
//<-- $$000
// @include          http*://www.geocaching.com/*
// @include          http*://maps.google.tld/*
// @include          http*://www.google.tld/maps*
// @include          http*://www.openstreetmap.org*
// @exclude          /^https?://www\.geocaching\.com/(login|jobs|careers|brandedpromotions|promotions|blog|help|seek/sendtogps|profile/profilecontent)/
// @resource jscolor https://raw.githubusercontent.com/2Abendsegler/GClh/master/data/jscolor.js
// @require          http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @require          http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js
// @require          https://cdnjs.cloudflare.com/ajax/libs/dropbox.js/2.5.2/Dropbox-sdk.min.js
// @require          https://raw.githubusercontent.com/2Abendsegler/GClh/master/data/gclh_defi.js
// @require          https://www.geocaching.com/scripts/MarkdownDeepLib.min.js
// @require          https://www.geocaching.com/scripts/SmileyConverter.js
// @connect          maps.googleapis.com
// @connect          raw.githubusercontent.com
// @connect          api.open-elevation.com
// @description      Some little things to make life easy (on www.geocaching.com).
// @copyright        2010-2016 Torsten Amshove, 2017-2018 2Abendsegler, 2018 Ruko2010
// @author           Torsten Amshove; 2Abendsegler; Ruko2010
// @icon             https://raw.githubusercontent.com/2Abendsegler/GClh/master/images/gclh_logo.png
// @license          GNU General Public License v2.0
// @grant            GM_getValue
// @grant            GM_setValue
// @grant            GM_log
// @grant            GM_xmlhttpRequest
// @grant            GM_getResourceText
// @grant            GM_info
// ==/UserScript==

var start = function(c) {
    checkRunningOnce();
    quitOnAdFrames()
        .then(function() {return jqueryInit(c);})
        .then(function() {return browserInit(c);})
        .then(function() {return constInit(c);})
        .then(function() {return variablesInit(c);})
        .done(function() {
            if (document.location.href.match(/^https?:\/\/maps\.google\./) || document.location.href.match(/^https?:\/\/www\.google\.[a-zA-Z.]*\/maps/)) {
                mainGMaps();
            } else if (document.location.href.match(/^https?:\/\/www\.openstreetmap\.org/)) {
                mainOSM();
            } else if (document.location.href.match(/^https?:\/\/www\.geocaching\.com/)) {
                mainGC();
            }
        });
};

var checkRunningOnce = function(c) {
    if (document.getElementsByTagName('head')[0]) {
        if (document.getElementById('GClh_II_running')) alert('The script "GC little helper II" is already running.\nPlease make sure that it runs only once.');
        else appendMetaId("GClh_II_running");
    }
};

var quitOnAdFrames = function(c) {
    var quitOnAdFramesDeref = new jQuery.Deferred();
    if(window.name) {
        if (window.name.substring(0, 18) !== 'google_ads_iframe_') quitOnAdFramesDeref.resolve();
        else quitOnAdFramesDeref.reject();
    }
    else {
        quitOnAdFramesDeref.resolve();
    }
    return quitOnAdFramesDeref.promise();
};

var jqueryInit = function(c) {
    if (typeof c.$ === "undefined") c.$ = c.$ || unsafeWindow.$ || window.$ || null;
    if (typeof c.jQuery === "undefined") c.jQuery = c.jQuery || unsafeWindow.jQuery || window.jQuery || null;
    var jqueryInitDeref = new jQuery.Deferred();
    jqueryInitDeref.resolve();
    return jqueryInitDeref.promise();
};

var browserInit = function(c) {
    var browserInitDeref = new jQuery.Deferred();
    c.CONFIG = {};
    // Browser ermitteln. Opera ... ist auch chrome.
    c.browser = (typeof(chrome) !== "undefined") ? "chrome" : "firefox";
    c.GM_setValue("browser", browser);
    c.CONFIG = JSON.parse(GM_getValue("CONFIG", '{}'));
    // Ist Tampermonkey der Scriptmanager.
    c.isTM = (typeof GM_info != "undefined" && typeof GM_info.scriptHandler != "undefined" && GM_info.scriptHandler == "Tampermonkey") ? true : false;
    c.GM_setValue("isTampermonkey", isTM);
    browserInitDeref.resolve();
    return browserInitDeref.promise();
};

var constInit = function(c) {
    var constInitDeref = new jQuery.Deferred();

    c.scriptName = GM_info.script.name;
    c.scriptVersion = GM_info.script.version;
    c.scriptNameConfig = c.scriptName.replace("helper", "helper Config");
    c.scriptNameSync = c.scriptName.replace("helper", "helper Sync");
    c.scriptShortNameConfig = "GClh Config II";
    c.scriptShortNameSync = "GClh Sync II";
    c.anzCustom = 10;
    c.anzTemplates = 10;
    c.bookmarks_def = new Array(31, 69, 14, 16, 32, 33, 48, "0", 8, 18, 54, 51, 55, 47, 10, 2, 35, 9, 17, 67, 23, 22, 66, 68);
    c.defaultConfigLink = "/my/default.aspx#GClhShowConfig";
    c.defaultSyncLink = "/my/default.aspx#GClhShowSync";
    c.defaultFindPlayerLink = "/my/default.aspx#GClhShowFindPlayer";
    c.urlScript = "https://raw.githubusercontent.com/2Abendsegler/GClh/master/gc_little_helper_II.user.js";
    c.urlConfigSt = "https://raw.githubusercontent.com/2Abendsegler/GClh/master/data/config_standard.txt";
    c.urlChangelog = "https://github.com/2Abendsegler/GClh/blob/master/docu/changelog.md#readme";
    c.urlDocu = "https://github.com/2Abendsegler/GClh/blob/master/docu/";
    c.urlImages = "https://raw.githubusercontent.com/2Abendsegler/GClh/master/images/";
    c.urlImagesSvg = "https://rawgit.com/2Abendsegler/GClh/master/images/";
    // Define bookmarks:
    c.bookmarks = new Array();
    // WICHTIG: Die Reihenfolge darf hier auf keinen Fall geändert werden, weil dadurch eine falsche Zuordnung zu den gespeicherten Userdaten erfolgen würde!
    bookmark("Watchlist", "/my/watchlist.aspx", c.bookmarks);
    bookmark("Logs Geocaches", "/my/geocaches.aspx", c.bookmarks);
    bookmark("Own Geocaches", "/my/owned.aspx", c.bookmarks);
    bookmark("Logs Trackables", "/my/travelbugs.aspx", c.bookmarks);
    bookmark("Trackables Inventory", "/my/inventory.aspx", c.bookmarks);
    bookmark("Trackables Collection", "/my/collection.aspx", c.bookmarks);
    bookmark("Logs Benchmarks", "/my/benchmarks.aspx", c.bookmarks);
    bookmark("Member Features", "/my/subscription.aspx", c.bookmarks);
    bookmark("Friends", "/my/myfriends.aspx", c.bookmarks);
    bookmark("Account Details", "/account/default.aspx", c.bookmarks);
    bookmark("Public Profile", "/profile/", c.bookmarks);
    bookmark("Search GC (old adv.)", "/seek/nearest.aspx", c.bookmarks);
    bookmark("Routes", "/my/userroutes.aspx#find", c.bookmarks);
    bookmark("Drafts Upload", "/my/uploadfieldnotes.aspx", c.bookmarks);
    bookmark("Pocket Queries", "/pocket/default.aspx", c.bookmarks);
    bookmark("Pocket Queries Saved", "/pocket/default.aspx#DownloadablePQs", c.bookmarks);
    bookmark("Bookmarks", "/bookmarks/default.aspx", c.bookmarks);
    bookmark("Notifications", "/notify/default.aspx", c.bookmarks);
    profileSpecialBookmark("Find Player", defaultFindPlayerLink, "lnk_findplayer", c.bookmarks);
    bookmark("E-Mail", "/email/default.aspx", c.bookmarks);
    bookmark("Statbar", "/my/statbar.aspx", c.bookmarks);
    bookmark("Guidelines", "/about/guidelines.aspx", c.bookmarks);
    profileSpecialBookmark(c.scriptShortNameConfig, "/my/default.aspx#GClhShowConfig", "lnk_gclhconfig", c.bookmarks);
    externalBookmark("Forum Groundspeak", "http://forums.groundspeak.com/", c.bookmarks);
    externalBookmark("Blog Groundspeak", "/blog/", c.bookmarks);
    bookmark("Favorites", "/my/favorites.aspx", c.bookmarks);
    externalBookmark("Geoclub", "http://www.geoclub.de/", c.bookmarks);
    profileSpecialBookmark("Public Profile Geocaches", "/profile/default.aspx?#gclhpb#ctl00_ContentBody_ProfilePanel1_lnkUserStats", "lnk_profilegeocaches", c.bookmarks);
    profileSpecialBookmark("Public Profile Trackables", "/profile/default.aspx?#gclhpb#ctl00_ContentBody_ProfilePanel1_lnkCollectibles", "lnk_profiletrackables", c.bookmarks);
    profileSpecialBookmark("Public Profile Gallery", "/profile/default.aspx?#gclhpb#ctl00_ContentBody_ProfilePanel1_lnkGallery", "lnk_profilegallery", c.bookmarks);
    profileSpecialBookmark("Public Profile Lists", "/profile/default.aspx?#gclhpb#ctl00_ContentBody_ProfilePanel1_lnkLists", "lnk_profilebookmarks", c.bookmarks);
    bookmark("Dashboard", "/my/", c.bookmarks);
    profileSpecialBookmark("Nearest List", "/seek/nearest.aspx?#gclhpb#errhomecoord", "lnk_nearestlist", c.bookmarks);
    profileSpecialBookmark("Nearest Map", "/seek/nearest.aspx?#gclhpb#errhomecoord", "lnk_nearestmap", c.bookmarks);
    profileSpecialBookmark("Nearest List (w/o Founds)", "/seek/nearest.aspx?#gclhpb#errhomecoord", "lnk_nearestlist_wo", c.bookmarks);
    profileSpecialBookmark("Own Trackables", "/track/search.aspx?#gclhpb#errowntrackables", "lnk_my_trackables", c.bookmarks);
    // Custom Bookmarks.
    var num = c.bookmarks.length;
    for (var i = 0; i < c.anzCustom; i++) {
        c.bookmarks[num] = Object();
        if (getValue("settings_custom_bookmark[" + i + "]", "") != "") c.bookmarks[num]['href'] = getValue("settings_custom_bookmark[" + i + "]");
        else c.bookmarks[num]['href'] = "#";
        if (getValue("settings_bookmarks_title[" + num + "]", "") != "") c.bookmarks[num]['title'] = getValue("settings_bookmarks_title[" + num + "]");
        else {
            c.bookmarks[num]['title'] = "Custom" + i;
            setValue("settings_bookmarks_title[" + num + "]", bookmarks[num]['title']);
        }
        if (getValue("settings_custom_bookmark_target[" + i + "]", "") != "") {
            c.bookmarks[num]['target'] = getValue("settings_custom_bookmark_target[" + i + "]");
            c.bookmarks[num]['rel'] = "external";
        } else c.bookmarks[num]['target'] = "";
        c.bookmarks[num]['custom'] = true;
        num++;
    }
    // More Bookmarks.
    profileSpecialBookmark("Public Profile Souvenirs", "/profile/default.aspx?#gclhpb#ctl00_ContentBody_ProfilePanel1_lnkSouvenirs", "lnk_profilesouvenirs", c.bookmarks);
    bookmark("Statistics", "/my/statistics.aspx", c.bookmarks);
    bookmark("Drafts", "/my/fieldnotes.aspx", c.bookmarks);
    profileSpecialBookmark("Public Profile Statistics", "/profile/default.aspx?#gclhpb#ctl00_ContentBody_ProfilePanel1_lnkStatistics", "lnk_profilestatistics", c.bookmarks);
    bookmark("Geocaches RecViewed", "/my/recentlyviewedcaches.aspx", c.bookmarks);
    bookmark("Search TB", "/track/travelbug.aspx", c.bookmarks);
    bookmark("Search Geocoin", "/track/geocoin.aspx", c.bookmarks);
    externalBookmark("Geocaches Labs", "https://labs.geocaching.com/", c.bookmarks);
    bookmark("Search GC", "/play/search/", c.bookmarks);
    bookmark("Geocache Hide", "/play/hide/", c.bookmarks);
    bookmark("Message Center", "/account/messagecenter", c.bookmarks);
    bookmark("Search GC (old)", "/seek/", c.bookmarks);
    bookmark("Glossary of Terms", "/about/glossary.aspx", c.bookmarks);
    bookmark("Event Calendar", "/calendar/", c.bookmarks);
    bookmark("Geocache Adoption", "/adopt/", c.bookmarks);
    externalBookmark("Flopps Karte", "http://flopp-caching.de/", c.bookmarks);
    externalBookmark("Geokrety", "http://geokrety.org/", c.bookmarks);
    externalBookmark("Project Geocaching", "http://project-gc.com/", c.bookmarks);
    bookmark("Search TB adv.", "/track/search.aspx", c.bookmarks);
    bookmark("Map", "/map/", c.bookmarks);
    profileSpecialBookmark(scriptShortNameSync, defaultSyncLink, "lnk_gclhsync", c.bookmarks);
    externalBookmark("Forum Geoclub", "http://geoclub.de/forum/index.php", c.bookmarks);
    externalBookmark("Changelog GClh II", urlChangelog, c.bookmarks);
    bookmark("Lists", "/my/lists.aspx", c.bookmarks);
    bookmark("Souvenirs", "/my/souvenirs.aspx", c.bookmarks);
    bookmark("Friend League", "/play/friendleague", c.bookmarks);
    bookmark("Trackables", "/track/", c.bookmarks);
    bookmark("GeoTours", "/play/geotours", c.bookmarks);
    // Custom Bookmark-title.
    c.bookmarks_orig_title = new Array();
    for (var i = 0; i < c.bookmarks.length; i++) {
        if (getValue("settings_bookmarks_title[" + i + "]", "") != "") {
            c.bookmarks_orig_title[i] = c.bookmarks[i]['title'];
            c.bookmarks[i]['title'] = getValue("settings_bookmarks_title[" + i + "]");
        }
    }

    c.gclhConfigKeysIgnoreForBackup = {"declared_version": true, "migration_task_01": true, "update_next_check": true};

    iconsInit(c);
    langInit(c);
    layersInit(c);
    elevationServicesDataInit(c);
    country_idInit(c);

    constInitDeref.resolve();
    return constInitDeref.promise();
};

var variablesInit = function(c) {
    var variablesInitDeref = new jQuery.Deferred();

    c.userInfo = c.userInfo || window.userInfo || null;
    c.isLoggedIn = c.isLoggedIn || window.isLoggedIn || null;
    c.userDefinedCoords = c.userDefinedCoords || window.userDefinedCoords || null;
    c.userToken = c.userToken || window.userToken || null;
    c.http = "http";
    if (document.location.href.toLowerCase().indexOf("https") === 0) c.http = "https";
    c.global_dependents = new Array();
    c.global_mod_reset = false;
    c.global_rc_data = "";
    c.global_rc_status = "";
    c.settings_submit_log_button = getValue("settings_submit_log_button", true);
    c.settings_log_inline = getValue("settings_log_inline", false);
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
    c.settings_font_size_menu = getValue("settings_font_size_menu", 16);
    c.settings_font_size_submenu = getValue("settings_font_size_submenu", 15);
    c.settings_distance_menu = getValue("settings_distance_menu", 16);
    c.settings_distance_submenu = getValue("settings_distance_submenu", 8);
    c.settings_font_color_menu_submenu = getValue("settings_font_color_menu_submenu", "93B516");
    c.settings_font_color_menu = getValue("settings_font_color_menu", getValue("settings_font_color_menu_submenu", "93B516"));
    c.settings_font_color_submenu = getValue("settings_font_color_submenu", getValue("settings_font_color_menu_submenu", "93B516"));
    c.settings_menu_number_of_lines = getValue("settings_menu_number_of_lines", 1);
    c.settings_menu_show_separator = getValue("settings_menu_show_separator", false);
    c.settings_menu_float_right = getValue("settings_menu_float_right", false);
    c.settings_gc_tour_is_working = getValue("settings_gc_tour_is_working", false);
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
    c.settings_process_vup = getValue("settings_process_vup", true);
    c.settings_show_vup_friends = getValue("settings_show_vup_friends", false);
    c.settings_vup_hide_avatar = getValue("settings_vup_hide_avatar", false);
    c.settings_vup_hide_log = getValue("settings_vup_hide_log", false);
    c.settings_f2_save_gclh_config = getValue("settings_f2_save_gclh_config", true);
    c.settings_esc_close_gclh_config = getValue("settings_esc_close_gclh_config", true);
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
    if (c.settings_bookmarks_list.length == 0) c.settings_bookmarks_list = c.bookmarks_def;
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
    c.settings_spoiler_strings = getValue("settings_spoiler_strings", "spoiler|hinweis");
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
    c.settings_primary_elevation_service = getValue("settings_primary_elevation_service", 1);
    c.settings_secondary_elevation_service = getValue("settings_secondary_elevation_service", 2);
    c.settings_distance_units = getValue("settings_distance_units", "");
    c.settings_img_warning = getValue("settings_img_warning", false);
    c.settings_fieldnotes_old_fashioned = getValue("settings_fieldnotes_old_fashioned", false);
    c.settings_my_lists_old_fashioned = getValue("settings_my_lists_old_fashioned", false);
    c.settings_remove_banner = getValue("settings_remove_banner", false);
    c.settings_remove_banner_for_garminexpress = getValue("settings_remove_banner_for_garminexpress", false);
    c.settings_remove_banner_blue = getValue("settings_remove_banner_blue", false);
    c.settings_compact_layout_bm_lists = getValue("settings_compact_layout_bm_lists", true);
    c.settings_compact_layout_list_of_bm_lists = getValue("settings_compact_layout_list_of_bm_lists", true);
    c.settings_compact_layout_pqs = getValue("settings_compact_layout_pqs", true);
    c.settings_compact_layout_list_of_pqs = getValue("settings_compact_layout_list_of_pqs", true);
    c.settings_compact_layout_nearest = getValue("settings_compact_layout_nearest", true);
    c.settings_compact_layout_recviewed = getValue("settings_compact_layout_recviewed", true);
    c.settings_map_links_statistic = getValue("settings_map_links_statistic", true);
    c.settings_improve_add_to_list_height = getValue("settings_improve_add_to_list_height", 205);
    c.settings_improve_add_to_list = getValue("settings_improve_add_to_list", true);
    c.remove_navi_play = getValue("remove_navi_play", false);
    c.remove_navi_community = getValue("remove_navi_community", false);
    c.remove_navi_shop = getValue("remove_navi_shop", false);
    c.settings_show_flopps_link = getValue("settings_show_flopps_link", true);
    c.settings_show_brouter_link = getValue("settings_show_brouter_link", true);
    c.settings_show_default_links = getValue("settings_show_default_links", true);
    c.settings_bm_changed_and_go = getValue("settings_bm_changed_and_go", true);
    c.settings_show_tb_inv = getValue("settings_show_tb_inv", true);
    c.settings_but_search_map = getValue("settings_but_search_map", true);
    c.settings_but_search_map_new_tab = getValue("settings_but_search_map_new_tab", false);
    c.settings_show_pseudo_as_owner = getValue("settings_show_pseudo_as_owner", true);
    c.settings_fav_proz_pqs = getValue("settings_fav_proz_pqs", true);
    c.settings_fav_proz_nearest = getValue("settings_fav_proz_nearest", true);
    c.settings_fav_proz_recviewed = getValue("settings_fav_proz_recviewed", true);
    c.settings_show_all_logs_but = getValue("settings_show_all_logs_but", true);
    c.settings_show_log_counter_but = getValue("settings_show_log_counter_but", true);
    c.settings_show_bigger_avatars_but = getValue("settings_show_bigger_avatars_but", true);
    c.settings_hide_feedback_icon = getValue("settings_hide_feedback_icon", false);
    c.settings_compact_layout_new_dashboard = getValue("settings_compact_layout_new_dashboard", false);
    c.settings_show_draft_indicator = getValue("settings_show_draft_indicator", true);
    c.settings_show_enhanced_map_popup = getValue("settings_show_enhanced_map_popup", true);
    c.settings_show_latest_logs_symbols_count_map = getValue("settings_show_latest_logs_symbols_count_map", 10);
    c.settings_modify_new_drafts_page = getValue("settings_modify_new_drafts_page", true);

    try {
        if (c.userToken === null) {
            c.userData = $('#aspnetForm script:not([src])').filter(function() {
                return this.innerHTML.indexOf("ccConversions") != -1;
            }).html();
            if (c.userData !== null) {
                if (typeof c.userData !== "undefined") {
                    c.userData = c.userData.replace('{ID: ', '{"ID": ');
                    var regex = /([a-zA-Z0-9öÖäÄüÜß]+)([ ]?=[ ]?)(((({.+})(;)))|(((\[.+\])(;)))|(((".+")(;)))|((('.+')(;)))|(([^'"{\[].+)(;)))/g;
                    var match;
                    while (match = regex.exec(userData)) {
                        if (match[1] == "eventCacheData") continue;
                        var data = (match[6] || match[10] || match[14] || match[18] || match[21]).trim();
                        if (data.charAt(0) == '"' || data.charAt(0) == "'") data = data.slice(1, data.length - 1);
                        data = data.trim();
                        if (data.charAt(0) == '{' || data.charAt(0) == '[') data = JSON.parse(data);
                        if (typeof c.chromeUserData === "undefined") c.chromeUserData = {};
                        c.chromeUserData[match[1].replace('"', '').replace("'", "").trim()] = data;
                    }
                    if (c.chromeUserData["userInfo"]) c.userInfo = chromeUserData["userInfo"];
                    if (c.chromeUserData["isLoggedIn"]) c.isLoggedIn = chromeUserData["isLoggedIn"];
                    if (c.chromeUserData["userDefinedCoords"]) c.userDefinedCoords = c.chromeUserData["userDefinedCoords"];
                    if (c.chromeUserData["userToken"]) c.userToken = c.chromeUserData["userToken"];
                }
            }
        }
    } catch(e) {gclh_error("Error parsing userdata from page:",e);}

    variablesInitDeref.resolve();
    return variablesInitDeref.promise();
};

//////////////////////////////
// Google Maps
//////////////////////////////
var mainGMaps = function() {
    try {
        // Add link to GC Map on Google Maps page.
        if (settings_add_link_gc_map_on_google_maps) {
            function addGcButton(waitCount) {
                if (document.getElementById("gbsfw")) {
                    var code = "";
                    code += "function openGcMap(){";
                    code += "  var matches = document.location.href.match(/@(-?[0-9.]*),(-?[0-9.]*),([0-9.]*)z/);";
                    code += "  if (matches != null) {";
                    code += "    var zoom = matches[3];";
                    code += "  } else {";
                    // Bei Earth gibt es kein z für Zoom sondern ein m für Meter. Meter in Zoom umrechnen.
                    code += "    var matches = document.location.href.match(/@(-?[0-9.]*),(-?[0-9.]*),([0-9.]*)m/);";
                    code += "    if (matches != null) {";
                    code += "      var zoom = 26 - Math.round(Math.log2(matches[3]));";
                    code += "    }";
                    code += "  }";
                    code += "  if (matches != null) {";
                    code += "    var matchesMarker = document.location.href.match(/!3d(-?[0-9.]*)!4d(-?[0-9.]*)/);";
                    code += "    if (matchesMarker != null) {";
                    code += "      var url = '" + map_url + "?lat=' + matchesMarker[1] + '&lng=' + matchesMarker[2] + '#?ll=' + matches[1] + ',' + matches[2] + '&z=' + zoom;";
                    code += "    } else {";
                    code += "      var url = '" + map_url + "?lat=' + matches[1] + '&lng=' + matches[2] + '&z=' + zoom;";
                    code += "    }";
                    if (settings_switch_to_gc_map_in_same_tab) {
                        code += "  location = url;";
                    } else {
                        code += "  window.open(url);";
                    }
                    code += "  } else {";
                    code += "    alert('This map has no geographical coordinates in its link. Just zoom or drag the map, afterwards this will work fine.');";
                    code += "  }";
                    code += "}";
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
                } else {waitCount++; if (waitCount <= 50) setTimeout(function(){addGcButton(waitCount);}, 200);}
            }
            addGcButton(0);
        }
        // Hide left sidebar on Google Maps.
        if (settings_hide_left_sidebar_on_google_maps) {
            function hideLeftSidebar(waitCount) {
                if ($('#gbsfw')[0] && $('.widget-pane-toggle-button')[0] && $('.widget-pane')[0]) {
                    if (!$('.widget-pane')[0].className.match("widget-pane-collapsed")) $('.widget-pane-toggle-button')[0].click();
                } else {waitCount++; if (waitCount <= 60) setTimeout(function(){hideLeftSidebar(waitCount);}, 250);}
            }
            hideLeftSidebar(0);
        }
    } catch(e) {gclh_error("mainGMaps:",e);}
};

//////////////////////////////
// Openstreetmap
//////////////////////////////
var mainOSM = function() {
    try {
        // Add link to GC Map on Openstreetmap.
        function addGCButton(waitCount) {
            if (document.location.href.match(/^https?:\/\/www\.openstreetmap\.org\/(.*)#map=/) && $(".control-key").length) {
                if (settings_add_link_gc_map_on_osm) {
                    var code = '<div class="control-gc leaflet-control"><a class="control-button" href="#" data-original-title="geocaching.com" style="outline: medium none;"><span class="icon" title="Geocaching Map" style="margin: 5px; display: inline-block; vertical-align: middle; height: 32px; width: 32px; background-image: url(\''+global_gc_icon_sw+'\'); background-size: 25px 25px;  background-position: center; background-repeat: no-repeat;"></span></a></div>';
                    $(".control-share").after(code);
                    $(".control-gc").click(function() {
                        var matches = document.location.href.match(/=([0-9]+)\/(-?[0-9.]*)\/(-?[0-9.]*)/);
                        if (matches != null) {
                            var url = map_url + '?lat=' + matches[2] + '&lng=' + matches[3] + '#?ll=' + matches[2] + ',' + matches[3] + '&z=' + matches[1];
                            if (settings_switch_from_osm_to_gc_map_in_same_tab) location = url;
                            else window.open(url);
                        } else alert('This map has no geographical coordinates in its link. Just zoom or drag the map, afterwards this will work fine.');
                    });
                }
            } else {waitCount++; if (waitCount <= 50) setTimeout(function(){addGCButton(waitCount);}, 1000);}
        }
        addGCButton(0);
    } catch(e) {gclh_error("mainOSM:",e);}
};

//////////////////////////////
// GClh Main
//////////////////////////////
var mainGC = function() {

// Hide Facebook.
    if (settings_hide_facebook && (document.location.href.match(/\.com\/(play|account\/register|login|account\/login|seek\/log\.aspx?(.*))/))) {
        try {
            if ($('.btn.btn-facebook')[0]) $('.btn.btn-facebook')[0].style.display = "none";
            if ($('.divider-flex')[0]) $('.divider-flex')[0].style.display = "none";
            if ($('.divider')[0]) $('.divider')[0].style.display = "none";
            if ($('.disclaimer')[0]) $('.disclaimer')[0].style.display = "none";
            if ($('.login-with-facebook')[0]) $('.login-with-facebook')[0].style.display = "none";
            if ($('.horizontal-rule')[0]) $('.horizontal-rule')[0].style.display = "none";
        } catch(e) {gclh_error("Hide Facebook:",e);}
    }

// Wenn nicht angeloggt, dann aussteigen.
   if (!$('.li-user-info')[0]) return;

// Run after redirect.
    if (typeof(unsafeWindow.__doPostBack) == "function") {
        try {
            var splitter = document.location.href.split("#");
            if (splitter && splitter[1] && splitter[1] == "gclhpb" && splitter[2] && splitter[2] != "") {
                var postbackValue = splitter[2];
                // Home coords in GClh übernehmen.
                if (postbackValue == "errhomecoord") {
                    var mess = "To use this link, GClh has to know your home coordinates. \n"
                             + "Do you want to go to the special area and let GClh save \n"
                             + "your home coordinates automatically?\n\n"
                             + "GClh will save it automatically. You have nothing to do at the\n"
                             + "following page \"Home Location\", except, to choose your link again.\n"
                             + "(But, please wait until page \"Home Location\" is loading complete.)";
                    if (window.confirm(mess)) document.location.href = "/account/settings/homelocation";
                    else document.location.href = document.location.href.replace("?#"+splitter[1]+"#"+splitter[2]+"#", "");
                // uid, own trackables in GClh übernehmen.
                } else if (postbackValue == "errowntrackables") {
                    var mess = "To use this link, GClh has to know the identification of \n"
                             + "your trackables. Do you want to go to your dashboard and \n"
                             + "let GClh save the identification (uid) automatically?\n\n"
                             + "GClh will save it automatically. You have nothing to do at the\n"
                             + "following page \"Dashboard\", except, to choose your link again.\n"
                             + "(But, please wait until page \"Dashboard\" is loading complete.)";
                    if (window.confirm(mess)) document.location.href = "/my/default.aspx";
                    else  document.location.href = document.location.href.replace("?#"+splitter[1]+"#"+splitter[2], "");
                // Postbacks.
                } else {
                    if (is_page("publicProfile")) {
                        $('html').css("background-color", "white");
                        $('#divContentSide').css("height", "1000px");
                        $('#ProfileTabs').css("display", "none");
                        $('footer').remove();
                    }
                    document.location.href = "";
                    $('#'+postbackValue)[0].click();
                }
            }
        } catch(e) {gclh_error("Run after redirect",e);}
    }

// After change of a bookmark go automatically from confirmation screen to to bookmark list.
   if (settings_bm_changed_and_go && document.location.href.match(/\.com\/bookmarks\/mark\.aspx\?(guid=|ID=)/) && $('#divContentMain')[0] && $('p.Success a[href*="/bookmarks/view.aspx?guid="]')[0]) {
       $('#divContentMain').css("visibility", "hidden");
       document.location.href = $('p.Success a')[0].href;
   }

// Set language to default language.
    if (settings_set_default_langu) {
        try {
            var la = $('.language-list > li > a:contains(' + settings_default_langu + ')');
            if (!la[0]) var la = $('.dropdown-menu > li > a:contains(' + settings_default_langu + ')');
            if (la[0]) {
                if (la[0].className == "selected" || la[0].parentNode.className == "selected");
                else {
                    var event = document.createEvent("MouseEvent");
                    event.initEvent("click", true, true);
                    la[0].dispatchEvent(event);
                }
            }
        } catch(e) {gclh_error("Set language to default language:",e);}
    }

// Faster loading trackables without images.
    if (settings_faster_profile_trackables && is_page("publicProfile") && $('#ctl00_ContentBody_ProfilePanel1_lnkCollectibles.Active')[0]) {
        try {
            window.stop();
            $('table.Table tbody tr td a img').each(function() {this.src = "/images/icons/16/watch.png"; this.title = ""; this.style.paddingLeft = "15px";});
        } catch(e) {gclh_error("Faster loading trackables without images:",e);}
    }

// Migration: Installationszähler. Migrationsaufgaben erledigen.
    var declaredVersion = getValue("declared_version");
    if (declaredVersion != scriptVersion) {
        try {
            instCount(declaredVersion);
            migrationTasks();
        } catch(e) {gclh_error("Migration:",e);}
    }

// Redirect to Map (von Search Liste direkt in Karte springen).
    if (settings_redirect_to_map && document.location.href.match(/\.com\/seek\/nearest\.aspx\?/)) {
        if (!document.location.href.match(/&disable_redirect=/) && !document.location.href.match(/key=/) && !document.location.href.match(/ul=/) && $('#ctl00_ContentBody_LocationPanel1_lnkMapIt')[0]) {
            $('#ctl00_ContentBody_LocationPanel1_lnkMapIt')[0].click();
        }
    }

// F2, F4, F10 keys.
    try {
        // F2 key.
        if (settings_submit_log_button) {
            // Log abschicken (Cache und TB).
            if (document.location.href.match(/\.com\/(seek|track)\/log\.aspx\?(id|wid|guid|ID|wp|LUID|PLogGuid)\=/)) var id = "ctl00_ContentBody_LogBookPanel1_btnSubmitLog";
            // PQ speichern | "Bookmark Pocket Query", aus BM PQ erzeugen | PQ zu Routen.
            if (document.location.href.match(/\.com\/pocket\/(gcquery|bmquery|urquery)\.aspx/)) var id = "ctl00_ContentBody_btnSubmit";
            // "Create a Bookmark" entry, "Edit a Bookmark" entry.
            if (document.location.href.match(/\.com\/bookmarks\/mark\.aspx/)) var id = "ctl00_ContentBody_Bookmark_btnCreate";
            // Hide cache process speichern.
            if (document.location.href.match(/\.com\/hide\//)) {
                if ($('#btnContinue')[0]) var id = "btnContinue";
                else if ($('#ctl00_ContentBody_btnSaveAndPreview')[0]) var id = "ctl00_ContentBody_btnSaveAndPreview";
                else if ($('#btnSubmit')[0]) var id = "btnSubmit";
                else if ($('#btnNext')[0]) var id = "btnNext";
                else if ($('#ctl00_ContentBody_btnSubmit')[0]) var id = "ctl00_ContentBody_btnSubmit";
                else if ($('#ctl00_ContentBody_Attributes_btnUpdate')[0]) var id = "ctl00_ContentBody_Attributes_btnUpdate";
                else if ($('#ctl00_ContentBody_WaypointEdit_uxSubmitIt')[0]) var id = "ctl00_ContentBody_WaypointEdit_uxSubmitIt";
            }
            if (id && document.getElementById(id)) {
                function keydownF2(e) {
                    if (e.keyCode == 113 && noSpecialKey(e) && !check_config_page()) document.getElementById(id).click();
                }
                document.getElementById(id).value += " (F2)";
                window.addEventListener('keydown', keydownF2, true);
            }
        }
        // Aufruf GClh Config per F4 Taste. Nur auf erlaubten Seiten. Nicht im GClh Config.
        if (settings_f4_call_gclh_config && !check_config_page()) {
            function keydownF4(e) {
                if (e.keyCode == 115 && noSpecialKey(e) && !check_config_page()) {
                    if (checkTaskAllowed("GClh Config", false) == true) gclh_showConfig();
                    else document.location.href = defaultConfigLink;
                }
            }
            window.addEventListener('keydown', keydownF4, true);
        }
        // Aufruf GClh Sync per F10 Taste. Nur auf erlaubten Seiten. Nicht im GClh Sync. Nicht im Config Reset Modus.
        if (settings_f10_call_gclh_sync && !check_sync_page()) {
            function keydownF10(e) {
                if (e.keyCode == 121 && noSpecialKey(e) && !check_sync_page() && !global_mod_reset) {
                    if (checkTaskAllowed("GClh Sync", false) == true) gclh_showSync();
                    else document.location.href = defaultSyncLink;
                }
            }
            window.addEventListener('keydown', keydownF10, true);
        }
    } catch(e) {gclh_error("F2, F4, F10 keys:",e);}

// Set global data.
    if ($('.li-user-info')[0] && $('.li-user-info')[0].children[1]) var global_me = decode_innerHTML($('.li-user-info')[0].children[1]);

// Change Header layout.
    change_header_layout:
    try {
        if (settings_change_header_layout) {
            if (isMemberInPmoCache()) {
                if ($('#ctl00_siteHeader')[0]) $('#ctl00_siteHeader')[0].remove();
                break change_header_layout;
            }
            // Alle Seiten: Grundeinstellungen:
            // ----------
            var css = "";
            // Font-Size für Menüs, Font-Size für Untermenüs in Pixel.
            var font_size_menu = parseInt(settings_font_size_menu);
            if ((font_size_menu == 0) || (font_size_menu < 0) || (font_size_menu > 16)) font_size_menu = 16;
            var font_size_submenu = parseInt(settings_font_size_submenu);
            if ((font_size_submenu == 0) || (font_size_submenu < 0) || (font_size_submenu > 16)) font_size_submenu = 15;
            // Abstand zwischen Menüs, Abstand zwischen Untermenüs in Pixel.
            var distance_menu = parseInt(settings_distance_menu);
            if ((distance_menu < 0) || (distance_menu > 99)) distance_menu = (50 / 2);
            else distance_menu = (distance_menu / 2);
            if (settings_bookmarks_top_menu == false && settings_menu_show_separator == true) distance_menu = (distance_menu / 2);
            var distance_submenu = parseInt(settings_distance_submenu);
            if ((distance_submenu < 0) || (distance_submenu > 32)) distance_submenu = (8);  // (8/2)
            else distance_submenu = (distance_submenu);  // (.../2)
            // Font-Color in Menüs, Untermenüs.
            var font_color_menu = settings_font_color_menu;
            if (font_color_menu == "") font_color_menu = "93B516";
            var font_color_submenu = settings_font_color_submenu;
            if (font_color_submenu == "") font_color_submenu = "93B516";
            // Menüweite berechnen.
            var new_width = 950;
            var new_width_menu = 950;
            var new_width_menu_cut_old = 0;
            var new_padding_right = 0;
            if (getValue("settings_new_width") > 0) new_width = parseInt(getValue("settings_new_width"));
            new_padding_right = 261 - 14;
            if (settings_show_smaller_gc_link) {
                new_width_menu = new_width - 261 + 20 - 28;
                new_width_menu_cut_old = 28;
            } else {
                new_width_menu = new_width - 261 + 20 - 190;
                new_width_menu_cut_old = 190;
            }
            // Member Upgrade Button entfernen.
            $('.li-upgrade').remove();
            if ($('.li-membership')[0]) $('.li-membership')[0].remove();
            // Im neuen Dashboard Upgrade Erinnerung entfernen.
            $('.sidebar-upsell').remove();
            // Icons aus Play Menü entfernen.
            $('.charcoal').remove();
            $('.li-attention').removeClass('li-attention').addClass('li-attention_gclh');
            css +=
                // Schriftfarbe Menü.
                ".#m li a, .#m li a:link, .#m li a:visited, .#m li {color: #" + font_color_menu + " !important;}" +
                ".#m li a:hover, .#m li a:focus {color: #FFFFFF !important; outline: unset !important;}" +
                // Menü nicht flex.
                ".#m {display: unset;}" +
                // Submenü im Vordergrund.
                ".#m .#sm {z-index: 1001;}" +
                // Schriftfarbe Untermenü.
                ".#m .#sm li a, .#m .#sm li a:link, .#m .#sm li a:visited, .#m .#sm li {color: #" + font_color_submenu + " !important;}" +
                // Schriftgröße Menü.
                ".#m {font-size: 16px !important;}" +
                ".#m li, .#m li a, .#m li input {font-size: " + font_size_menu + "px !important;}" +
                // Abstände Menü.
                "ul.#m > li {margin-left: " + distance_menu + "px !important; margin-right: " + distance_menu + "px !important;} ul.#m li a {padding: .25em .25em .25em 0 !important;}" +
                // Schriftgröße Untermenü.
                ".#m ul.#sm, .#m ul.#sm li {font-size: 16px !important;}" +
                ".#m ul.#sm li a {font-size: " + font_size_submenu + "px !important;}" +
                // Abstände Untermenü.
                ".#m ul.#sm li a {margin: " + (distance_submenu / 2) + "px 1em !important; padding: 0 0.5em !important;} .#m .#sm a {line-height: unset;} .#m a {overflow: initial}" +
                // Menühöhe.
                ".#m {height: 35px !important;}" +
                // Verschieben Submenüs unterbinden.
                ".#m .#sm {margin-left: 0 !important}";
            // Vertikales Menü ausrichten.
            if (settings_bookmarks_top_menu) {
                // Menüzeilenhöhe.
                css += "ul.#m {line-height: 16px;}";
                // Zwischen Menüname und Submenü keine Lücke lassen, sonst klappts nicht mit einfachem Aufklappen.
                css += ".#m li a, .#m li a:link, .#m li a:visited {margin-bottom: 10px;} .#m ul.#sm {margin-top: -6px;}";
                // Menü, Searchfield ausrichten in Abhängigkeit von Schriftgröße.
                css += "ul.#m > li {margin-top: " + (3 + (16 - font_size_menu) / 2) + "px;}";
            // Horizontales Menü ausrichten.
            } else {
                // Menüzeilenhöhe.
                css += "ul.#m {line-height: 16px !important;}";
                // Zeilenabstand in Abhängigkeit von Anzahl Zeilen.
                if      (settings_menu_number_of_lines == 2) css += "ul.#m li a {padding-top: 4px !important; padding-bottom: 4px !important;}";
                else if (settings_menu_number_of_lines == 3) css += "ul.#m li a {padding-top: 1px !important; padding-bottom: 1px !important;}";
            }
            // Message Center Icon entfernen.
            if (settings_remove_message_in_header) $('.messagecenterheaderwidget').remove();
            // Geocaching Logo ersetzen, verschieben oder entfernen.
            if ($('.logo')[0]) {
                var side = $('.logo')[0];
                changeGcLogo(side);
            }
            css +=
                "#l {flex: unset; overflow: unset; margin-left: -32px} #newgclogo {width: 30px !important;}" +
                ".#m {width: " + new_width_menu + "px !important; margin-left: 6px !important;}" +
                "nav .wrapper {min-width: " + (new_width + 40) + "px !important; max-width: unset;}";
            // Bereich links ausrichten in Abhängigkeit davon, ob Logo geändert wird und ob GC Tour im Einsatz ist.
            if      (!settings_show_smaller_gc_link && !settings_gc_tour_is_working) css += "#l {margin-top:   0px; fill: #ffffff;}";
            else if (!settings_show_smaller_gc_link && settings_gc_tour_is_working)  css += "#l {margin-top: -47px; fill: #ffffff;}";
            else if (settings_show_smaller_gc_link  && !settings_gc_tour_is_working) css += "#l {margin-top:   6px; width: 30px;}";
            else if (settings_show_smaller_gc_link  && settings_gc_tour_is_working)  css += "#l {margin-top: -41px; width: 30px;}";

            // Account Settings, Message Center, Cache suchen, Cache verstecken, Geotours, Karten, account/dashboard und track:
            // ----------
            if (is_page("settings") || is_page("messagecenter") || is_page("find_cache") || is_page("hide_cache") || is_page("geotours") || is_page("map") || is_page("dashboard") || is_page("track")) {
                css += "nav .wrapper {padding-right: " + new_padding_right + "px !important; width: unset;}";
                // Fehler bei Plazierung Videos verursacht durch neues Logo korrigieren.
                if (is_page("hide_cache")) css += ".video iframe {width: 90%;}";
                // Vertikales Menü ausrichten.
                if (settings_bookmarks_top_menu) {
                    css += ".#m ul.#sm {margin-top: 0px; margin-left: 32px !important;} .#m .submenu::after {left: 4px; width: 26px;}";
                    // Menü nicht flex.
                    if (settings_menu_float_right) css += ".#m {display: block;} ul.#m > li {top: 0px;}";
                    // Menü in Karte ausrichten.
                    if (is_page("map") && !settings_menu_float_right) css += ".#m {height: unset !important;}";
                    if (is_page("map") && settings_menu_float_right) css += "#navi_search {margin: 0 !important;}";
                }
                // Bereich rechts ausrichten.
                css += ".profile-panel {margin-right: -15.25em}";

            // Altes Seiten Design und restliche Seiten:
            // ----------
            } else {
                if (settings_fixed_header_layout) {
                    css += "nav .wrapper {width: " + new_width + "px !important; padding-left: 50px; padding-right: 30px; min-width: unset}";
                    if (settings_remove_logo && settings_show_smaller_gc_link) css += ".#m {margin-left: -28px !important;}";
                }
                // Vertikales Menü  ausrichten.
                if (settings_bookmarks_top_menu) {
                    css += ".#m ul.#sm {margin-top: 15px; margin-left: 32px !important;} .#m .submenu::after {left: 4px; width: 26px;}";
                    // Zwischen Menüname und Submenü keine Lücke lassen, sonst klappt das nicht mit dem einfachen Aufklappen.
                    css += ".#m > li .dropdown {padding-bottom: 14px !important;}";
                    if (settings_menu_float_right) css += "ul.#m > li {margin-top: 8px !important}";
                // Horizontales Menü ausrichten in Abhängigkeit von Anzahl Zeilen.
                } else {
                    if      (settings_menu_number_of_lines == 1) css += "ul.#m {top:   4px !important;}";
                    else if (settings_menu_number_of_lines == 2) css += "ul.#m {top:  -8px !important;}";
                    else if (settings_menu_number_of_lines == 3) css += "ul.#m {top: -13px !important;}";
                }
            }
            // Alle Seiten: Platzhalter umsetzen:
            // ----------
            css = css.replace(/#m/gi, "menu").replace(/#sm/gi, "submenu").replace(/#l/gi, "nav .logo");
            appendCssStyle(css);
        }
    } catch(e) {gclh_error("Change header layout:",e);}
    // GC Logo.
    function changeGcLogo(side) {
        if (settings_show_smaller_gc_link && side && side.children[0]) {
            side.children[0].remove();
            if (!settings_remove_logo) {
                var gc_link = document.createElement("a");
                var gc_img = document.createElement("img");
                gc_img.setAttribute("style", "clip: unset; width: 35px; margin-top: -3px;");
                gc_img.setAttribute("title", "Geocaching");
                gc_img.setAttribute("id", "newgclogo");
                gc_img.setAttribute("src", global_gc_icon);
                gc_link.appendChild(gc_img);
                gc_link.setAttribute("href", "/");
                side.appendChild(gc_link);
            }
        }
    }

// New Width. (Menüweite wird bei Change Header Layout gesetzt.)
    new_width:
    try {
        // Keine Anpassungen.
        if (is_page("messagecenter") || is_page("settings") || is_page("hide_cache") || is_page("find_cache") || is_page("geotours") || is_page("map") || is_page("dashboard") || is_page("track")) break new_width;

        if (getValue("settings_new_width") > 0) {
            var new_width = parseInt(getValue("settings_new_width"));
            var css = "";
            // Header- und Fußbereich:
            css += "header, nav, footer {min-width: " + (new_width + 40) + "px !important;}";
            css += "header .container, nav .container {max-width: unset;}";
            // Keine weiteren Anpassungen.
            if (document.location.href.match(/\.com\/pocket\/gcquery\.aspx/) ||  // Pocket Query: Einstellungen zur Selektion
                 document.location.href.match(/\.com\/pocket\/bmquery\.aspx/));  // Pocket Query aus Bockmarkliste: Einstellungen zur Selektion
            else {
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
                css += "#uxBookmarkListName {width: " + (new_width - 470 - 5) + "px !important;}";
                css += "table.TrackableItemLogTable div {width: " + (new_width - 160) + "px !important; max-width: unset;}";
                css += ".UserSuppliedContent {max-width: unset;}";
                // Besonderheiten:
                if (!is_page("cache_listing")) css += ".UserSuppliedContent {width: " + (new_width - 200) + "px;}";
                if (is_page("publicProfile")) css += ".container .profile-panel {width: " + (new_width - 160) + "px;}";
                if (is_page("cache_listing")) css += ".span-9 {width: " + (new_width - 300 - 270 - 13 - 13 - 10) + "px !important;}";
                else if (document.location.href.match(/\.com\/my\/statistics\.aspx/) || (is_page("publicProfile") && $('#ctl00_ContentBody_ProfilePanel1_lnkStatistics.Active')[0])) {
                    css += ".span-9 {width: " + ((new_width - 280) / 2) + "px !important; margin-right: 30px;} .last {margin-right: 0px;}";
                    css += ".StatsTable {width: " + (new_width - 250) + "px !important;}";
                } else if (is_page("publicProfile")) {
                    if ($('#ctl00_ContentBody_ProfilePanel1_lnkCollectibles.Active')[0]) {
                        css += ".span-9 {width: " + ((new_width - 220) / 2) + "px !important;} .prepend-1 {padding-left: 10px;}";
                    } else {
                        css += ".span-9 {width: " + ((new_width - 250) / 2) + "px !important;}";
                        css += ".StatsTable {width: " + (new_width - 250 - 30) + "px !important;}";
                    }
                }
            }
            appendCssStyle(css);
        }
    } catch(e) {gclh_error("New width:",e);}

// Remove GC Menüs.
    try {
        var m = $('ul.(Menu|menu) li a.dropdown');
        for (var i = 0; i < m.length; i++) {
            if ((m[i].href.match(/\/play\/search/) && getValue('remove_navi_play')) ||
                (m[i].href.match(/\/forums\/$/) && getValue('remove_navi_community')) ||
                (m[i].href.match(/shop\.geocaching\.com/) && getValue('remove_navi_shop'))) {
                m[i].parentNode.remove();
            }
        }
    } catch(e) {gclh_error("Remove GC Menüs:",e);}

// Linklist on top.
    try {
        if (settings_bookmarks_on_top) {
            // Auch ohne Change Header Layout zwischen Menüname und Submenü keine Lücke lassen, sonst klappts nicht mit einfachem Aufklappen.
            if (!settings_change_header_layout) {
                if (is_page("map")) {
                    appendCssStyle(".menu > li, .Menu > li {height: 100%; padding-top: 2.0em;} .submenu, .SubMenu {margin-top: 1.9em;}");
                } else if (is_page("find_cache") || is_page("hide_cache") || is_page("geotours") || is_page("dashboard") || is_page("track")) {
                    appendCssStyle(".menu > li, .Menu > li {height: 100%; padding-top: 2.1em;} .submenu, .SubMenu {margin-top: 2.0em;}");
                } else {
                    appendCssStyle(".menu > li, .Menu > li {height: 100%; padding-top: 2.0em;} .submenu, .SubMenu {margin-top: 2.0em;}");
                }
            }
        }
        if (settings_bookmarks_on_top && $('.Menu, .menu').length > 0) {
            var nav_list = $('.Menu, .menu')[0];
            var menu = document.createElement("li");
            var headline = document.createElement("a");
            if (settings_bookmarks_top_menu || settings_change_header_layout == false) {  // Navi vertikal
                headline.setAttribute("href", "#");
                headline.setAttribute("class", "Dropdown dropdown");
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
            } else {  // Navi horizontal
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
                code += "  var search = document.getElementById('navi_search').value;";
                code += "  if(search.match(/^GC[A-Z0-9]{1,10}\\b/i) || search.match(/^TB[A-Z0-9]{1,10}\\b/i)) document.location.href = 'http://coord.info/'+search;";
                code += "  else if(search.match(/^[A-Z0-9]{6}\\b$/i)) document.location.href = '/track/details.aspx?tracker='+search;";
                code += "  else document.location.href = '/seek/nearest.aspx?navi_search='+search;";
                code += "}";
                insertScript(code, "body");
                var searchfield = "<li><input onKeyDown='if(event.keyCode==13 && event.ctrlKey == false && event.altKey == false && event.shiftKey == false) {gclh_search_logs(); return false;}' type='text' size='6' name='navi_search' id='navi_search' style='padding: 1px; font-weight: bold; font-family: sans-serif; border: 2px solid #778555; border-radius: 7px 7px 7px 7px; background-color:#d8cd9d' value='" + settings_bookmarks_search_default + "'></li>";
                $(".Menu, .menu").append(searchfield);
            }
            // Hover für alle Dropdowns aufbauen.
            buildHover();

            if (settings_menu_show_separator) {
                if (settings_bookmarks_top_menu || settings_change_header_layout == false);  // Navi vertikal
                else {  // Navi horizontal
                    var menuChilds = $('ul.Menu, ul.menu')[0].children;
                    for (var i = 1; i < menuChilds.length; i += 2) {
                        var separator = document.createElement("li");
                        separator.appendChild(document.createTextNode("|"));
                        menuChilds[i].parentNode.insertBefore(separator, menuChilds[i]);
                    }
                }
            }
            // Vertikale Menüs rechts ausrichten.
            if (settings_bookmarks_top_menu && settings_menu_float_right && settings_change_header_layout) {
                if ($('ul.Menu, ul.menu')[0]) {
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
    } catch(e) {gclh_error("Linklist on top",e);}
    // Hover aufbauen. Muss nach Menüaufbau erfolgen.
    function buildHover() {
        $('ul.Menu, ul.menu').children().hover(function() {
                $(this).addClass('hover');
                $(this).addClass('open');
                $('ul:first', this).css('visibility', 'visible');
            },
            function() {
                $(this).removeClass('hover');
                $(this).removeClass('open');
                $('ul:first', this).css('visibility', 'hidden');
            }
        );
    }

// Show draft indicator in header
    if(settings_show_draft_indicator){
        try{
            $.get('https://www.geocaching.com/account/dashboard', null, function(text){

                // Look for drafts in old layout
                draft_list = $(text).find('#uxDraftLogs span');
                if(draft_list != null){
                    drafts = draft_list[0];
                }else{
                    drafts = false;
                }

                if(!drafts){
                    // if not found, Look for drafts in new layout
                    draft_list = $(text).find("nav a[href='/my/fieldnotes.aspx']");
                    if(draft_list != null){
                        drafts = draft_list[0];
                    }else{
                        drafts = false;
                    }
                }

                if(drafts){
                    draft_count = parseInt(drafts.innerHTML.match(/\d+/));
                    if(Number.isInteger(draft_count) && draft_count > 0){
                        // we found drafts, so show them in the header
                        appendCssStyle('.draft-indicator{ background-color: #e0b70a;font-weight:bold;position: absolute;padding: 0 5px;border-radius: 15px;top: -7px;left: -7px; } .draft-indicator a{width: auto !important; font-size: 14px;min-width: 10px; display: block; text-align: center;}');
                        $('.li-user-info .user-avatar').prepend('<span class="draft-indicator"><a href="/my/fieldnotes.aspx" title="Go to Drafts">' + draft_count + '</a></span>');
                    }else{
                        // No drafts found
                    }
                }else{
                    // Non of the content was found
                    // This should not happen, only if GC changes something
                }
            });
        }catch(e) {gclh_error("Show draft indicator in header:",e);}
    }

// Disabled and archived ...
    if (is_page("cache_listing")) {
        try {
            if ($('#ctl00_ContentBody_uxGalleryImagesLink')[0]) $('#ctl00_ContentBody_uxGalleryImagesLink')[0].innerHTML = $('#ctl00_ContentBody_uxGalleryImagesLink')[0].innerHTML.replace("View the ", "");
            if ($('#ctl00_ContentBody_archivedMessage')[0] && $('#ctl00_ContentBody_CacheName')[0]) $('#ctl00_ContentBody_CacheName')[0].style.color = '#8C0B0B';
            if (settings_strike_archived && $('#ctl00_ContentBody_CacheName')[0] && ($('#ctl00_ContentBody_archivedMessage')[0] || $('#ctl00_ContentBody_disabledMessage')[0])) {
                $('#ctl00_ContentBody_CacheName')[0].style.textDecoration = 'line-through';
            }
            if ($('.more-cache-logs-link')[0] && $('.more-cache-logs-link')[0].href) $('.more-cache-logs-link')[0].href = "#logs_section";
        } catch(e) {gclh_error("Disabled and archived:",e);}
    }

// Improve calendar link in events. (Im Google Link den Cache Link von &location nach &details verschieben.)
    if (is_page("cache_listing") && document.getElementById("calLinks")) {
        try {
            function impCalLink(waitCount) {
                if ($('#calLinks').find('a[title*="Google"]')[0]) {
                    var calL = $('#calLinks').find('a[title*="Google"]')[0];
                    if (calL && calL.href) calL.href = calL.href.replace(/&det(.*)&loc/, "&loc").replace(/%20\(http/, "&details=http").replace(/\)&spr/, "&spr");
                }
                waitCount++;
                if (impCalLink <= 20) setTimeout(function(){impCalLink(waitCount);}, 100);
            }
            impCalLink(0);
        } catch(e) {gclh_error("Improve calendar link",e);}
    }

// Show eventday beside date.
    if (settings_show_eventday && is_page("cache_listing") && $('#cacheDetails img')[0] && $('#cacheDetails img')[0].src.match(/\/images\/WptTypes\/(6|453|13|7005).gif/)) {  // Event, MegaEvent, Cito, GigaEvent
        try {
            var match = $('meta[name="og:description"]')[0].content.match(/([0-9]{2})\/([0-9]{2})\/([0-9]{4})/);
            var date = new Date(match[3], match[1]-1, match[2]);
            if (date != "Invalid Date") {
                var weekday = new Array(7);
                weekday[0] = "Sunday"; weekday[1] = "Monday"; weekday[2] = "Tuesday"; weekday[3] = "Wednesday"; weekday[4] = "Thursday"; weekday[5] = "Friday"; weekday[6] = "Saturday";
                var name = " (" + weekday[date.getDay()] + ") ";
                var elem = document.createTextNode(name);
                var side = $('#ctl00_ContentBody_mcd2')[0];
                side.insertBefore(elem, side.childNodes[1]);
            }
        } catch(e) {gclh_error("Show eventday beside date:",e);}
    }

// Show real owner.
    if (is_page("cache_listing") && $('#ctl00_ContentBody_mcd1')) {
        try {
            var real_owner = get_real_owner();
            var link_owner = $('#ctl00_ContentBody_mcd1 a[href*="/profile/?guid="]')[0];
            if (link_owner && real_owner) {
                var pseudo = link_owner.innerText;
                link_owner.innerHTML = (settings_show_real_owner ? real_owner : pseudo);
                link_owner.title = (settings_show_real_owner ? pseudo : real_owner);
            }
        } catch(e) {gclh_error("Show real owner:",e);}
    }

// Hide disclaimer on cache listing and print page.
    if (settings_hide_disclaimer && (is_page("cache_listing") || document.location.href.match(/\.com\/seek\/cdpf\.aspx/))) {
        try {
            var d = ($('.Note.Disclaimer')[0] || $('.DisclaimerWidget')[0] || $('.TermsWidget.no-print')[0]);
            if (d) d.remove();
        } catch(e) {gclh_error("Hide disclaimer:",e);}
    }

// Highlight related web page link.
    if (is_page("cache_listing") && $('#ctl00_ContentBody_uxCacheUrl')[0]) {
        try {
            var lnk = $('#ctl00_ContentBody_uxCacheUrl')[0];
            var html = "<fieldset class=\"DisclaimerWidget\"><legend class=\"warning\">Please note</legend><p class=\"NoBottomSpacing\">"+lnk.parentNode.innerHTML+"</p></fieldset>";
            lnk.parentNode.innerHTML = html;
        } catch(e) {gclh_error("Highlight related web page link:",e);}
    }

// Show the latest logs symbols.
    if (is_page("cache_listing") && settings_show_latest_logs_symbols && settings_load_logs_with_gclh) {
        try {
            function showLatestLogsSymbols(waitCount) {
                var gcLogs = false;
                if (waitCount == 0) {
                    var logs = $('#cache_logs_table tbody tr.log-row').clone();  // GC Logs
                    if (logs.length >= settings_show_latest_logs_symbols_count) gcLogs = true;
                }
                if (!gcLogs) var logs = $('#cache_logs_table2 tbody tr.log-row');  // GClh Logs
                if (logs.length > 0) {
                    var lateLogs = new Array();
                    for (var i = 0; i < logs.length; i++) {
                        if (settings_show_latest_logs_symbols_count == i) break;
                        var lateLog = new Object();
                        lateLog['user'] = $(logs[i]).find('.logOwnerProfileName a[href*="/profile/?guid="]').text();
                        lateLog['id'] = $(logs[i]).find('.logOwnerProfileName a[href*="/profile/?guid="]').attr('id');
                        lateLog['src'] = $(logs[i]).find('.LogType img[src*="/images/logtypes/"]').attr('src');
                        lateLog['type'] = $(logs[i]).find('.LogType img[src*="/images/logtypes/"]').attr('title');
                        lateLog['date'] = $(logs[i]).find('.LogDate').text();
                        if (gcLogs) lateLog['log'] = $(logs[i]).find('.LogText').children().clone();
                        else lateLog['log'] = $(logs[i]).find('.LogContent').children().clone();
                        lateLogs[i] = lateLog;
                    }
                    if (lateLogs.length > 0 && $('#ctl00_ContentBody_mcd1')[0].parentNode) {
                        var side = $('#ctl00_ContentBody_mcd1')[0].parentNode;
                        side.style.display = "initial";
                        var div = document.createElement("div");
                        var divTitle = "";
                        div.id = "gclh_latest_logs";
                        div.setAttribute("style", "float: right; padding-right: 0; padding-top: 2px;");
                        div.appendChild(document.createTextNode("Latest logs:"));
                        for (var i = 0; i < lateLogs.length; i++) {
                            var a = document.createElement("a");
                            a.className = "gclh_latest_log";
                            if (gcLogs) {
                                a.href = "#";
                                a.style.cursor = "unset";
                            } else a.href = "#" + lateLogs[i]['id'];
                            var img = document.createElement("img");
                            img.src = lateLogs[i]['src'];
                            img.setAttribute("style", "padding-left: 2px; vertical-align: bottom; ");
                            img.title = img.alt = "";
                            var log_text = document.createElement("span");
                            log_text.title = "";
                            log_text.innerHTML = "<img src='" + lateLogs[i]['src'] + "'> <b>" + lateLogs[i]['user'] + " - " + lateLogs[i]['date'] + "</b><br>";
                            a.appendChild(img);
                            for (var j = 0; j < lateLogs[i]['log'].length; j++) {
                                if (j == 0 && !gcLogs) continue;
                                log_text.appendChild(lateLogs[i]['log'][j]);
                            }
                            a.appendChild(log_text);
                            div.appendChild(a);
                            divTitle += (divTitle == "" ? "" : "\n" ) + lateLogs[i]['type'] + " - " + lateLogs[i]['date'] + " - " + lateLogs[i]['user'];
                        }
                        div.title = divTitle;
                        side.appendChild(div);
                        if (getValue("settings_new_width") > 0) var new_width = parseInt(getValue("settings_new_width")) - 310 - 180;
                        else var new_width = 950 - 310 - 180;
                        var css = "a.gclh_latest_log:hover {position: relative;}"
                                + "a.gclh_latest_log span {display: none; position: absolute; left: -" + new_width + "px; width: " + new_width + "px; padding: 5px; text-decoration:none; text-align:left; vertical-align:top; color: #000000;}"
                                + "a.gclh_latest_log:hover span {font-size: 13px; display: block; top: 16px; border: 1px solid #8c9e65; background-color:#dfe1d2; z-index:10000;}";
                        appendCssStyle(css);

                        // In den GC Logs ist die Id für die Logs immer die Gleiche ..., ja doch ..., is klar ne ..., GS halt.
                        // Deshalb müssen die Ids der Latest logs nachträglich in den GClh Logs ermittelt werden.
                        function corrLatestLogsIds(waitCount) {
                            if ($('#cache_logs_table2 tbody tr.log-row').length > 0) {
                                var logsIds = $('#cache_logs_table2 tbody tr.log-row .logOwnerProfileName a');
                                var latestLogsIds = $('#gclh_latest_logs .gclh_latest_log');
                                for (var i = 0; i < 10; i++) {
                                    if (!logsIds[i] || !latestLogsIds[i]) break;
                                    latestLogsIds[i].href = '#'+logsIds[i].id;
                                    latestLogsIds[i].style.cursor = "pointer";
                                }
                            } else {waitCount++; if (waitCount <= 250) setTimeout(function(){corrLatestLogsIds(waitCount);}, 200);}
                        }
                        if (gcLogs) corrLatestLogsIds(0);
                    }
                } else {waitCount++; if (waitCount <= 250) setTimeout(function(){showLatestLogsSymbols(waitCount);}, 200);}
            }
            showLatestLogsSymbols(0);
        } catch(e) {gclh_error("Show the latest logs symbols:",e);}
    }

// Show favorite percentage.
    if (settings_show_fav_percentage && is_page("cache_listing") && $('#uxFavContainerLink')[0]) {
        try {
            function gclh_load_score(waitCount) {
                unsafeWindow.showFavoriteScore();
                if ($('.favorite-container')[0] && $('.favorite-score')[0].innerHTML.match("%") && $('.favorite-dropdown')[0]) {
                    var fav = $('.favorite-container')[0];
                    var score = $('.favorite-score')[0].innerHTML.match(/(.*%)\.*/);
                    if (score && score[1]) {
                        // Eigener Favoritenpunkt. Class hideMe -> kein Favoritenpunkt. Keine class hideMe -> Favoritenpunkt.
                        var myfav = $('#pnlFavoriteCache')[0];
                        var myfavHTML = "";
                        if (myfav) {
                            if (myfav.className.match("hideMe")) myfavHTML = '&nbsp;<img src="/images/icons/reg_user.gif" />';
                            else myfavHTML = '&nbsp;<img src="/images/icons/prem_user.gif" />';
                        }
                        fav.getElementsByTagName('span')[0].nextSibling.remove();
                        fav.innerHTML += score[1] + myfavHTML;
                        var dd = $('.favorite-dropdown')[0];
                        dd.style.borderTop = "1px solid #f0edeb";
                        dd.style.borderTopLeftRadius = "5px";
                        dd.style.minWidth = "190px";
                    }
                } else {waitCount++; if (waitCount <= 100) setTimeout(function(){gclh_load_score(waitCount);}, 100);}
            }
            gclh_load_score(0);
        } catch(e) {gclh_error("Show favorite percentage:",e);}
    }

// Highlight usercoords.
    if (is_page("cache_listing")) {
        try {
            var css = (settings_highlight_usercoords ? ".myLatLon {color: #FF0000; " : ".myLatLon {color: unset; ")
                    + (settings_highlight_usercoords_bb ? "border-bottom: 2px solid #999; " : "border-bottom: unset; ")
                    + (settings_highlight_usercoords_it ? "font-style: italic;}" : "font-style: unset;}");
            appendCssStyle(css);
        } catch(e) {gclh_error("Highlight usercoords:",e);}
    }

// Show other coord formats listing, print page.
    if (is_page("cache_listing") && $('#uxLatLon')[0]) {
        try {
            var box = $('#ctl00_ContentBody_LocationSubPanel')[0];
            box.innerHTML = box.innerHTML.replace("<br>", "");
            var coords = $('#uxLatLon')[0].innerHTML;
            otherFormats(" - ");
            box.innerHTML = "<font style='font-size: 10px;'>" + box.innerHTML + "</font><br>";
        } catch(e) {gclh_error("Show other coord formats listing:",e);}
    }
    if (document.location.href.match(/\.com\/seek\/cdpf\.aspx/)) {
        try {
            var box = document.getElementsByClassName("UTM Meta")[0];
            var coords = document.getElementsByClassName("LatLong Meta")[0];
            if (box && coords) {
                var match = coords.innerHTML.match(/((N|S) [0-9][0-9]. [0-9][0-9]\.[0-9][0-9][0-9] (E|W) [0-9][0-9][0-9]. [0-9][0-9]\.[0-9][0-9][0-9])/);
                if (match && match[1]) {
                    coords = match[1];
                    otherFormats("<br>");
                }
            }
        } catch(e) {gclh_error("Show other coord formats print page:",e);}
    }
    function otherFormats(trenn) {
        var dec = toDec(coords);
        var lat = dec[0];
        var lng = dec[1];
        if (lat < 0) lat = "S "+(lat * -1);
        else lat = "N "+lat;
        if (lng < 0) lng = "W "+(lng * -1);
        else lng = "E "+lng;
        box.innerHTML += trenn+"Dec: "+lat+" "+lng;
        var dms = DegtoDMS(coords);
        box.innerHTML += trenn+"DMS: "+dms;
    }

// Map this Location.
    if (is_page("cache_listing") && $('#uxLatLon')[0]) {
        try {
            var coords = toDec($('#uxLatLon')[0].innerHTML);
            if ($('#uxLatLonLink')[0] != null) var link = $('#uxLatLonLink')[0].parentNode;
            else var link = $('#uxLatLon')[0].parentNode;
            var small = document.createElement("small");
            small.innerHTML = '<a href="'+map_url+'?ll='+coords[0]+','+coords[1]+'">Map this Location</a>';
            link.append(small);
        } catch(e) {gclh_error("Map this Location:",e);}
    }

// Stop ignoring.
    if (is_page("cache_listing") && settings_show_remove_ignoring_link) {
        try {
            var bmLs = $('.BookmarkList').last().find('li a[href*="/bookmarks/view.aspx?guid="], li a[href*="/profile/?guid="]');
            for (var i=0; (i+1) < bmLs.length; i=i+2) {
                if (bmLs[i].innerHTML.match(/^Ignore List$/) && bmLs[i+1] && bmLs[i+1].innerHTML == global_me) {
                    $('#ctl00_ContentBody_GeoNav_uxIgnoreBtn a')[0].innerHTML = "Stop Ignoring";
                    $('#ctl00_ContentBody_GeoNav_uxIgnoreBtn a')[0].style.backgroundImage = "url("+global_stop_ignore_icon+")";
                    break;
                }
            }
        } catch(e) {gclh_error("Stop ignoring:",e);}
    }

// Improve Add to list in cache listing.
    if (is_page("cache_listing") && settings_improve_add_to_list && $('.btn-add-to-list')[0]) {
        try {
            var height = ((parseInt(settings_improve_add_to_list_height) < 100) ? parseInt(100) : parseInt(settings_improve_add_to_list_height));
            var css = ".loading {background: url(/images/loading2.gif) no-repeat center !important;}"
                    + ".add-list {max-height: " + height + "px !important;}"
                    + ".add-list li {padding: 4px 0 !important;}"
                    + ".add-list li button {font-size: 14px !important; margin: 0 !important; height: 18px !important;}"
                    + ".status {font-size: 14px !important; margin: 0 !important; top: 8px !important; width: unset !important; right: 0px !important;}"
                    + ".status .loading {top: -6px !important; right: 0px !important; padding: 0 2px !important; background-color: white !important; background: url(/images/loading2.gif) no-repeat center;}"
                    + ".status.success, .success-message {right: 2px !important; padding: 0 5px !important; background-color: white !important; color: #E0B70A !important;}";
            appendCssStyle(css);
            $('.btn-add-to-list')[0].addEventListener("click", function() {window.scroll(0, 0);});
        } catch(e) {gclh_error("Improve Add to list:",e);}
    }

// Add link to waypoint list and cache logs to right sidebar.
    if (is_page("cache_listing") && $("#cache_logs_container")[0]) {
        try {
            if (getWaypointTable().length > 0) {
                $(".CacheDetailNavigation:first > ul:first").append('<li><a href="#ctl00_ContentBody_bottomSection">Go to Waypoint list</a></li>');
            }
            $("#cache_logs_container").prev("div").attr('id','logs_section');
            $(".CacheDetailNavigation:first > ul:first").append('<li><a href="#logs_section">Go to logs</a></li>');
            var css = "";
            css += '.CacheDetailNavigation a[href*="#ctl00_ContentBody_bottomSection"]{background-image:url(/images/icons/16/waypoints.png);}';
            css += '.CacheDetailNavigation a[href*="#logs_section"]{background-image:url(' + global_logs_icon + ');}';
            appendCssStyle(css);
        } catch(e) {gclh_error("Add link to waypoint list and cache logs:",e);}
    }

// Show links which open Flopp's Map with all waypoints of a cache.
    if (settings_show_flopps_link && is_page("cache_listing") || document.location.href.match(/\.com\/hide\/wptlist.aspx/)) {
        try {
            // Add Flopps map link to the right sidebar.
            var linklist_for_flopps = $('.CacheDetailNavigation ul').first();
            linklist_for_flopps.append('<li><div class="GClhdropdown"><a id="ShowWaypointsOnFloppsMap_linklist" class="GClhdropbtn">Show on Flopp\'s Map</a><div id="FloppsMapLayers_linklist" class="GClhdropdown-content"></div></div></li>');
            buildFloppsMapLayers("FloppsMapLayers_linklist", "ShowWaypointsOnFloppsMap_linklist");
            // Add Flopps map link under waypoints.
            var tbl = getWaypointTable();
            if (tbl.length > 0) {
                tbl = tbl.next("p");
                if ($('#ctl00_ContentBody_Waypoints_uxShowHiddenCoordinates')) tbl.append('<br>');
                tbl.append('<div class="GClhdropdown"><div id="ShowWaypointsOnFloppsMap" class="GClhdropbtn"><a>Show waypoints on Flopp\'s Map with &#8230;</a></div><div id="FloppsMapLayers" class="GClhdropdown-content"></div></div>');
                buildFloppsMapLayers("FloppsMapLayers", "ShowWaypointsOnFloppsMap");
                var status = {};
                var waypoints = extractWaypointsFromListing();
                var link = buildFloppsMapLink(waypoints, 'OSM', false, status);
                if (status.limited == true) $(".floppsmap-warning").show();
                else $(".floppsmap-warning").hide();
            }
            $('.FloppsMap-content-layer').click(function() {
                var map = $(this).data('map');
                openFloppsMap(map);
            });
        } catch(e) {gclh_error("Show Flopp's Map links:",e);}
    }
    // Flopp's Map link.
    function buildFloppsMapLayers(id, openId) {
        var div = '<div class="FloppsMap-content-layer" data-map=';
        $('#'+id).append('<div class="GClhdropdown-content-info floppsmap-warning"><b>WARNING:</b> There are too many waypoints in the listing. Flopp\'s Map allows only a limited number of waypoints. Not all waypoints are shown.</div>');
        $('#'+id).append(div+'"OSM">Openstreetmap</div>');
        $('#'+id).append(div+'"OSM/DE">German Style</div>');
        $('#'+id).append(div+'"OCM">OpenCycleMap</div>');
        $('#'+id).append(div+'"TOPO">OpenTopMap</div>');
        $('#'+id).append(div+'"roadmap">Google Maps</div>');
        $('#'+id).append(div+'"satellite">Google Maps Satellite</div>');
        $('#'+id).append(div+'"hybrid">Google Maps Hybrid</div>');
        $('#'+id).append(div+'"terrain">Google Maps Terrain</div>');
        $('#'+openId).click(function() {openFloppsMap("");});
    }
    function openFloppsMap(map) {
        var waypoints = extractWaypointsFromListing();
        var link = buildFloppsMapLink(waypoints, map, false, {});
        window.open(link);
    }
    // Convert string to Flopp's Map specification.
    function floppsMapWaypoint(waypoint, id, radius, name) {
        name = name.replace(/[^a-zA-Z0-9_\-]/g,'_');  // A–Z, a–z, 0–9, - und _
        return id+':'+waypoint.latitude+':'+waypoint.longitude+':'+radius+':'+name;
    }
    // Creates permanent link to Flopp's Map.
    function buildFloppsMapLink(waypoints, map, shortnames, status) {
        var url = "";
        var floppsWaypoints = [];
        var Latmax = -90.0;
        var Latmin = 90.0;
        var Lonmax = -180.0;
        var Lonmin = 180.0;
        var count = 0;
        for (var i=0; i<waypoints.length; i++) {
            var waypoint = waypoints[i];
            if (waypoint !== undefined && waypoint.visible == true) {
                if (waypoint.type == "waypoint") {
                    var id = String.fromCharCode(65+Math.floor(count%26))+Math.floor(count/26+1);  // create Flopp's Map id: A1-A9 B1-B9 ....
                    var radius = ((waypoint.subtype == "Physical Stage" || waypoint.subtype == "Final Location") ? "161" : "");
                    floppsWaypoints.push(floppsMapWaypoint(waypoint, id, radius, waypoint.name));
                    count++;
                } else if (waypoint.type == "listing" && waypoint.subtype == "origin") {
                    var radius = 0;
                    if (waypoint.cachetype == "Traditional Cache") radius = 161;
                    else if (waypoint.cachetype == "Mystery Cache") radius = 3000;
                    floppsWaypoints.push(floppsMapWaypoint(waypoint, "O", radius, waypoint.lookup+'_ORIGIN'));
                } else if (waypoint.type == "listing" && waypoint.subtype == "changed") {
                    floppsWaypoints.push(floppsMapWaypoint(waypoint, "C", 161, waypoint.lookup+'_CHANGED'));
                }
                Latmax = Math.max(Latmax, waypoint.latitude);
                Latmin = Math.min(Latmin, waypoint.latitude);
                Lonmax = Math.max(Lonmax, waypoint.longitude);
                Lonmin = Math.min(Lonmin, waypoint.longitude);
            }
        }
        var browserZoomLevel = window.devicePixelRatio;
        var floppsMapWidth = Math.round(window.innerWidth*browserZoomLevel)-280;  // minus width of sidebar
        var floppsMapHeigth = Math.round(window.innerHeight*browserZoomLevel)-50;  // minus height of header
        var zoom=-1;
        for (zoom=23; zoom>=0; zoom--) {
            // Calculate tile boundary box.
            var tileY_min = lat2tile(Latmin,zoom);
            var tileY_max = lat2tile(Latmax,zoom);
            var tiles_Y = Math.abs(tileY_min-tileY_max+1);  // boundary box heigth in number of tiles
            var tileX_min = long2tile(Lonmin,zoom);
            var tileX_max = long2tile(Lonmax,zoom);
            var tiles_X = Math.abs(tileX_max-tileX_min+1);  // boundary box width in  number of tiles
            // Calculate width and height of boundary rectangle (in pixel).
            var latDelta = Math.abs(tile2lat(tileY_max,zoom)-tile2lat(tileY_min+1,zoom));
            var latPixelPerDegree = tiles_Y*256/latDelta;
            var boundaryHeight = latPixelPerDegree*(Latmax-Latmin);
            var longDelta = Math.abs(tile2long(tileX_max+1,zoom)-tile2long(tileX_min,zoom));
            var longPixelPerDegree = tiles_X*256/longDelta;
            var boundaryWidth = longPixelPerDegree*(Lonmax-Lonmin);
            if ((boundaryHeight < floppsMapHeigth) && (boundaryWidth < floppsMapWidth)) break;
        }
        var url = "";
        status.limited = false;
        for (var i=0; i<floppsWaypoints.length; i++) {
            var nextWaypoint = floppsWaypoints[i];
            // Limited the waypoint part to 2000 (+3) characters.
            if ((url.length+nextWaypoint.length+1)>2003) {
                status.limited = true;
                status.numbers = i;
                break;
            }
            url += ((i == 0) ? '&m=' : '*');
            url += nextWaypoint;
        }
        var center_latitude = ((Latmax+90.0)+(Latmin+90.0))/2-90.0;
        var center_longitude = ((Lonmax+180.0)+(Lonmin+180.0))/2-180.0;
        var maxZoom = {'OSM': 18, 'OSM/DE': 18, 'OCM': 17, 'MQ': 17, 'OUTD': 17, 'TOPO': 15, 'roadmap':20, 'terrain':20, 'hybrid': 20};
        zoom = Math.min(zoom,maxZoom[map]);
        var url = 'http://flopp.net/'+'?c='+center_latitude+':'+center_longitude+'&z='+zoom+'&t='+map+url;
        url += '&d=O:C';
        return encodeURI(url);
    }

// Show links which open BRouter with all waypoints of a cache.
    if (settings_show_brouter_link && is_page("cache_listing") || document.location.href.match(/\.com\/hide\/wptlist.aspx/)) {
        try {
            // Add BRouter map link to the right sidebar.
            var linklist_for_brouter = $('.CacheDetailNavigation ul').first();
            linklist_for_brouter.append('<li><div class="GClhdropdown"><a id="ShowWaypointsOnBRouter_linklist" class="GClhdropbtn">Show Route on BRouter</a><div id="BRouterMapLayers_linklist" class="GClhdropdown-content"></div></div></li>');
            buildBRouterMapLayers("BRouterMapLayers_linklist", "ShowWaypointsOnBRouter_linklist");
            // Add BRouter map link under waypoints.
            var tbl = getWaypointTable();
            if (tbl.length > 0) {
                tbl = tbl.next("p");
                tbl.append('<br><div class="GClhdropdown"><div id="ShowWaypointsOnBRouter" class="GClhdropbtn"><a>Show Route on BRouter with &#8230;</a></div><div id="BRouterMapLayers" class="GClhdropdown-content"></div></div>');
                buildBRouterMapLayers("BRouterMapLayers", "ShowWaypointsOnBRouter");
            }
            $('.BRouter-content-layer').click(function() {
                var map = $(this).data('map');
                openBRouter(map);
            });
        } catch(e) {gclh_error("Show button BRouter and open BRouter:",e);}
    }
    // BRouter Map link.
    function buildBRouterMapLayers(id, openId) {
        var div = '<div class="BRouter-content-layer" data-map=';
        $('#'+id).append(div+'"OpenStreetMap">OpenStreetMap</div>');
        $('#'+id).append(div+'"OpenStreetMap.de">OpenStreetMap.de</div>');
        $('#'+id).append(div+'"OpenTopoMap">OpenTopoMap</div>');
        $('#'+id).append(div+'"OpenCycleMap (Thunderf.)">OpenCycleMap</div>');
        $('#'+id).append(div+'"Outdoors (Thunderforest)">Outdoors</div>');
        $('#'+id).append(div+'"Esri World Imagery">Esri World Imagery</div>');
        $('#'+openId).click(function() {openBRouter("OpenStreetMap");});
    }
    function openBRouter(map) {
        var waypoints = extractWaypointsFromListing();
        var link = buildBRouterMapLink(waypoints, map, false);
        window.open(link);
    }
    // Convert string to BRouter specification.
    function brouterMapWaypoint(waypoint) {return waypoint.longitude+','+waypoint.latitude;}
    // Build BRouter link.
    function buildBRouterMapLink(waypoints, map, shortnames) {
        var url = "";
        var brouterWaypoints = [];
        var Latmax = -90.0;
        var Latmin = 90.0;
        var Lonmax = -180.0;
        var Lonmin = 180.0;
        var count = 0;
        for (var i=0; i<waypoints.length; i++) {
            var waypoint = waypoints[i];
            if (waypoint !== undefined && waypoint.visible == true) {
                if (waypoint.type == "listing" || waypoint.type == "waypoint") {
                    brouterWaypoints.push(brouterMapWaypoint(waypoint));
                    count++;
                }
                Latmax = Math.max(Latmax, waypoint.latitude);
                Latmin = Math.min(Latmin, waypoint.latitude);
                Lonmax = Math.max(Lonmax, waypoint.longitude);
                Lonmin = Math.min(Lonmin, waypoint.longitude);
            }
        }
        var browserZoomLevel = window.devicePixelRatio;
        var brouterMapWidth = Math.round(window.innerWidth*browserZoomLevel);
        var brouterMapHeigth = Math.round(window.innerHeight*browserZoomLevel);
        var zoom=-1;
        for (zoom=23; zoom>=0; zoom--) {
            // Calculate tile boundary box.
            var tileY_min = lat2tile(Latmin,zoom);
            var tileY_max = lat2tile(Latmax,zoom);
            var tiles_Y = Math.abs(tileY_min-tileY_max+1);  // boundary box heigth in number of tiles
            var tileX_min = long2tile(Lonmin,zoom);
            var tileX_max = long2tile(Lonmax,zoom);
            var tiles_X = Math.abs(tileX_max-tileX_min+1);  // boundary box width in  number of tiles
            // Calculate width and height of boundary rectangle (in pixel).
            var latDelta = Math.abs(tile2lat(tileY_max,zoom)-tile2lat(tileY_min+1,zoom));
            var latPixelPerDegree = tiles_Y*256/latDelta;
            var boundaryHeight = latPixelPerDegree*(Latmax-Latmin);
            var longDelta = Math.abs(tile2long(tileX_max+1,zoom)-tile2long(tileX_min,zoom));
            var longPixelPerDegree = tiles_X*256/longDelta;
            var boundaryWidth = longPixelPerDegree*(Lonmax-Lonmin);
            if ((boundaryHeight < brouterMapHeigth) && (boundaryWidth < brouterMapWidth)) break;
        }
        var url = "";
        for (var i=0; i<brouterWaypoints.length; i++) {
            var nextWaypoint = brouterWaypoints[i];
            url += ((i == 0) ? '&lonlats=' : '|');
            url += nextWaypoint;
        }
        var center_latitude = ((Latmax+90.0)+(Latmin+90.0))/2-90.0;
        var center_longitude = ((Lonmax+180.0)+(Lonmin+180.0))/2-180.0;
        var maxZoom = {'OpenStreetMap': 18, 'OpenStreetMap.de': 17, 'OpenTopoMap': 17, 'OpenCycleMap (Thunderf.)': 18, 'Outdoors (Thunderforest)': 18, 'Esri World Imagery': 18};
        zoom = Math.min(zoom,maxZoom[map]) - 1;
        var url = 'http://brouter.de/brouter-web/#zoom='+zoom+'&lat='+center_latitude+'&lon='+center_longitude+'&layer='+map+url+'&nogos=&profile=trekking&alternativeidx=0&format=geojson';
        return encodeURI(url);
    }

// CSS for BRouter and Flopp's Map links.
    if ((settings_show_brouter_link || settings_show_flopps_link) && (is_page("cache_listing") || document.location.href.match(/\.com\/hide\/wptlist.aspx/))) {
        var css = "";
        css += ".GClhdropbtn {";
        css += "  cursor: pointer;}";
        css += ".GClhdropdown {";
        css += "  position: relative;";
        css += "  display: inline-block;}";
        css += ".GClhdropdown-content {";
        css += "  display: none;";
        css += "  position: absolute;";
        css += "  background-color: #f9f9f9;";
        css += "  min-width: 170px;";
        css += "  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);";
        css += "  z-index: 1;}";
        css += ".GClhdropdown-content-info {";
        css += "  color: black;";
        css += "  background-color: #ffffa5;";
        css += "  padding: 5px 16px 5px 16px;";
        css += "  text-decoration: none;";
        css += "  display: none;}";
        css += ".GClhdropdown-content-info:hover {";
        css += "  background-color: #ffffa5;";
        css += "  cursor: default;}";
        css += ".GClhdropdown:hover .GClhdropdown-content {";
        css += "  display: block;}";
        if (settings_show_flopps_link) {
            css += ".FloppsMap-content-layer {";
            css += "  color: black;";
            css += "  padding: 5px 16px 5px 16px;";
            css += "  text-decoration: none;";
            css += "  display: block;}";
            css += ".FloppsMap-content-layer:hover {";
            css += "  background-color: #e1e1e1;";
            css += "  cursor: pointer;}";
            css += "#ShowWaypointsOnFloppsMap_linklist{";
            css += "  background-image: url(" + global_flopps_map_icon + ")}";
        }
        if (settings_show_brouter_link) {
            css += ".BRouter-content-layer {";
            css += "  color: black;";
            css += "  padding: 5px 16px 5px 16px;";
            css += "  text-decoration: none;";
            css += "  display: block;}";
            css += ".BRouter-content-layer:hover {";
            css += "  background-color: #e1e1e1;";
            css += "  cursor: pointer;}";
            css += "#ShowWaypointsOnBRouter_linklist{";
            css += "  background-image: url(" + global_brouter_icon + ")}";
        }
        appendCssStyle(css);
    }

// Build map overview.
    if (settings_map_overview_build && is_page("cache_listing") && $('#ctl00_ContentBody_detailWidget')[0]) {
        try {
            var side = $('#ctl00_ContentBody_detailWidget')[0];
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
            [map.style.backgroundImage, map.value] = buildMapValues(settings_map_overview_zoom);
            zoomControl.setAttribute("style", "padding: 3px 0px 0px 3px; width: 16px; float: left;");
            zoomPlus.setAttribute("style", "opacity: 0.75; cursor: pointer;");
            zoomPlus.setAttribute("title", "Zoom in");
            zoomPlus.src = "/images/zoom_in.png";
            zoomPlus.addEventListener('click', mapZoomIn, false);
            zoomMinus.setAttribute("style", "opacity: 0.75; cursor: pointer;");
            zoomMinus.setAttribute("title", "Zoom out");
            zoomMinus.src = "/images/zoom_out.png";
            zoomMinus.addEventListener('click', mapZoomOut, false);
            zoomControl.appendChild(zoomPlus);
            zoomControl.appendChild(zoomMinus);
            map.appendChild(zoomControl);
            body.appendChild(map);
            box.appendChild(body);
            side.parentNode.insertBefore(box, side);
        } catch(e) {gclh_error("Build map overview:",e);}
    }
    // Url und Zoomwert aufbauen.
    function buildMapValues(zoom_value) {
        var coords = new Array("", "");
        var gc_type = "";
        if (zoom_value < 1) zoom_value = 1;
        if (zoom_value > 19) zoom_value = 19;
        if ($('#uxLatLon')[0]) var coords = toDec($('#uxLatLon')[0].innerHTML);
        if ($(".cacheImage").find("img").attr("src")) {
            var src_arr = $(".cacheImage").find("img").attr("src").split("/");
            var gc_type = src_arr[src_arr.length - 1].split(".")[0];
        }
        var url = 'url(' + http + '://maps.google.com/maps/api/staticmap?zoom=' + zoom_value + '&size=248x248' + '&maptype=roadmap&'
                + 'markers=icon:http://www.geocaching.com/images/wpttypes/pins/' + gc_type + '.png' + '|' + coords[0] + ',' + coords[1] + ')';
        return [url, zoom_value];
    }
    // Reinzoomen.
    function mapZoomIn() {
        if ($('#gclh_map_static_values')[0]) {
            var map = $('#gclh_map_static_values')[0];
            [map.style.backgroundImage, map.value] = buildMapValues(parseInt(map.value) + 1);
        }
    }
    // Rauszoomen.
    function mapZoomOut() {
        if ($('#gclh_map_static_values')[0]) {
            var map = $('#gclh_map_static_values')[0];
            [map.style.backgroundImage, map.value] = buildMapValues(parseInt(map.value) - 1);
        }
    }

// Hide complete and Show/Hide Cache Note.
    if (is_page("cache_listing")) {
        try {
            var note = ($('.Note.PersonalCacheNote')[0] || $('.NotesWidget')[0]);
            if (settings_hide_cache_notes && note) note.remove();
            if (settings_hide_empty_cache_notes && !settings_hide_cache_notes && note) {
                var desc = decode_innerHTML(note.getElementsByTagName("strong")[0]).replace(":", "");
                var noteText = $('#cache_note')[0].innerHTML;
                var link = document.createElement("font");
                link.setAttribute("style", "font-size: 12px;");
                link.innerHTML = "<a id='gclh_hide_note' href='javascript:void(0);' onClick='gclhHideNote();'>Hide "+desc+"</a>";
                note.setAttribute("id", "gclh_note");
                note.parentNode.insertBefore(link, note);
                if (noteText != null && (noteText == "" || noteText == "Click to enter a note" || noteText == "Klicken zum Eingeben einer Notiz" || noteText == "Pro vložení poznámky klikni sem")) {
                    note.style.display = "none";
                    if ($('#gclh_hide_note')[0]) $('#gclh_hide_note')[0].innerHTML = 'Show '+desc;
                }
                var code =
                    "function gclhHideNote() {" +
                    "  if(document.getElementById('gclh_note').style.display == 'none') {" +
                    "    document.getElementById('gclh_note').style.display = 'block';" +
                    "    if (document.getElementById('gclh_hide_note')) {" +
                    "      document.getElementById('gclh_hide_note').innerHTML = 'Hide "+desc+"'" +
                    "    }" +
                    "  } else {" +
                    "    document.getElementById('gclh_note').style.display = 'none';" +
                    "    if (document.getElementById('gclh_hide_note')) {" +
                    "      document.getElementById('gclh_hide_note').innerHTML = 'Show "+desc+"'" +
                    "    }" +
                    "  }" +
                    "}";
                insertScript(code, 'body');
            }
        } catch(e) {gclh_error("Hide complete and Show/Hide Cache Note:",e);}
    }

// Show eMail and Message Center Link beside user. (Nicht in Cache Logs im Listing, das erfolgt später bei Log-Template.)
    show_mail_and_message_icon:
    try {
        // Cache, TB, Aktiv User Infos ermitteln.
        var [global_gc, global_tb, global_code, global_name, global_link, global_activ_username, global_founds, global_date, global_time, global_dateTime] = getGcTbUserInfo();
        // Nicht auf Mail, Message Seite ausführen.
        if ($('#ctl00_ContentBody_SendMessagePanel1_SendEmailPanel')[0] || $('#messageArea')[0]) break show_mail_and_message_icon;

        if ((settings_show_mail || settings_show_message)) {
            // Public Profile:
            if (is_page("publicProfile")) {
                if ($('#lnkSendMessage')[0] || $('#ctl00_ProfileHead_ProfileHeader_lnkSendMessage')[0]) {
                    var guid = ($('#lnkSendMessage')[0] || $('#ctl00_ProfileHead_ProfileHeader_lnkSendMessage')[0]).href.match(/https?:\/\/www\.geocaching\.com\/account\/messagecenter\?recipientId=(.*)/);
                    guid = guid[1];
                    if ($('#ctl00_ContentBody_ProfilePanel1_lblMemberName, #ctl00_ProfileHead_ProfileHeader_lblMemberName')[0]) {
                        var username = decode_innerHTML($('#ctl00_ContentBody_ProfilePanel1_lblMemberName, #ctl00_ProfileHead_ProfileHeader_lblMemberName')[0]);
                        var side = $('#ctl00_ContentBody_ProfilePanel1_lblMemberName, #ctl00_ProfileHead_ProfileHeader_lblStatusText')[0];
                    }
                    buildSendIcons(side, username, "per guid");
                }
            // Post Cache new log page:
            } else if (document.location.href.match(/\.com\/play\/geocache\/gc\w+\/log/)) {
                if ($('.muted')[0] && $('.muted')[0].children[1]) {
                    var id = $('.muted')[0].children[1].href.match(/^https?:\/\/www\.geocaching\.com\/profile\/\?id=(\d+)/);
                    if (id && id[1]) {
                        var idLink = "/p/default.aspx?id=" + id[1] + "&tab=geocaches";
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: idLink,
                            onload: function(response) {
                                if (response.responseText) {
                                    var [username, guid] = getUserGuidFromProfile(response.responseText);
                                    if (username && guid) {
                                        var side = $('.muted')[0].children[1];
                                        buildSendIcons(side, username, "per guid", guid);
                                    }
                                }
                            }
                        });
                    }
                }
            // Rest:
            } else {
                if (is_page("cache_listing")) var links = $('#divContentMain .span-17, #divContentMain .sidebar').find('a[href*="/profile/?guid="]');
                else var links = document.getElementsByTagName('a');
                for (var i = 0; i < links.length; i++) {
                    if (links[i].href.match(/https?:\/\/www\.geocaching\.com\/profile\/\?guid=/)) {
                        // Avatare haben auch mal guid, hier keine Icons erzeugen.
                        if (links[i].children[0] && (links[i].children[0].tagName == "IMG" || links[i].children[0].tagName == "img")) continue;
                        var guid = links[i].href.match(/https?:\/\/www\.geocaching\.com\/profile\/\?guid=(.*)/);
                        guid = guid[1];
                        var username = decode_innerHTML(links[i]);
                        buildSendIcons(links[i], username, "per guid");
                    }
                }
            }
        }
    } catch(e) {gclh_error("Show mail and message icon:",e);}

// Banner zu neuen Themen entfernen.
    if (settings_remove_banner) {
        try {
            if (settings_remove_banner_for_garminexpress) $('#Content').find('div.banner').find('#uxSendToGarminBannerLink').closest('div.banner').remove();
            if (settings_remove_banner_blue) {
                if ($('div.banner').length == 1 && $('div.banner').find('div.wrapper a.btn').length == 1) {
                    var styles = window.getComputedStyle($('div.banner')[0]);
                    if (styles && (styles.backgroundColor == "rgb(70, 135, 223)" || styles.backgroundColor == "rgb(61, 118, 197)")) $('div.banner').remove();
                }
                $('#activationAlert').find('div.container').find('a[href*="/my/lists.aspx"]').closest('#activationAlert').remove();
            }
        } catch(e) {gclh_error("Remove banner:",e);}
    }

// Activate fancybox for pictures in the description.
    if (is_page("cache_listing")) {
        try {
            if (typeof unsafeWindow.$.fancybox != "undefined") unsafeWindow.$('.CachePageImages a[rel="lightbox"]').fancybox();
        } catch(e) {gclh_error("Activate fancybox:",e);}
    }

// Link to bigger pictures for owner added images.
    if (settings_link_big_listing && is_page("cache_listing")) {
        try {
            var img = $('#ctl00_ContentBody_LongDescription, .CachePageImages').find('img[src*="geocaching.com/cache/large/"]');
            var a = $('#ctl00_ContentBody_LongDescription, .CachePageImages').find('a[href*="geocaching.com/cache/large/"]');
            for (var i = 0; i < img.length; i++) {img[i].src = img[i].src.replace("/large/", "/");}
            for (var i = 0; i < a.length; i++) {a[i].href = a[i].href.replace("/large/", "/");}
        } catch(e) {gclh_error("Link to bigger pictures for owner added images:",e);}
    }

// Decrypt hints.
    if (settings_decrypt_hint && !settings_hide_hint && is_page("cache_listing")) {
        try {
            if ($('#ctl00_ContentBody_EncryptionKey')[0]) {
                if (browser == "chrome") injectPageScript("(function(){dht();})()");
                else unsafeWindow.dht($('#ctl00_ContentBody_lnkDH')[0]);
                var decryptKey = $('#dk')[0];
                if (decryptKey) decryptKey.parentNode.removeChild(decryptKey);
            }
        } catch(e) {gclh_error("Decrypt hints:",e);}
    }
    if (settings_decrypt_hint && document.location.href.match(/\.com\/seek\/cdpf\.aspx/)) {
        try {
            if ($('#uxDecryptedHint')[0]) $('#uxDecryptedHint')[0].style.display = 'none';
            if ($('#uxEncryptedHint')[0]) $('#uxEncryptedHint')[0].style.display = '';
            if ($('.EncryptionKey')[0]) $('.EncryptionKey')[0].remove();
        } catch(e) {gclh_error("Decrypt cdpf hints:",e);}
    }

// Hide hints.
    if (settings_hide_hint && is_page("cache_listing")) {
        try {
            // Replace hints by a link which shows the hints dynamically.
            var hint = $('#div_hint')[0];
            var label = $('#ctl00_ContentBody_hints strong')[0];
            if (hint && label && trim(hint.innerHTML).length > 0) {
                var code =
                    "function hide_hint() {" +
                    "  var hint = document.getElementById('div_hint');" +
                    "  if(hint.style.display == 'none') {" +
                    "    hint.style.display = 'block';" +
                    "    if (document.getElementById('ctl00_ContentBody_lnkDH')) {" +
                    "      document.getElementById('ctl00_ContentBody_lnkDH').innerHTML = 'Hide'" +
                    "    }" +
                    "  } else {" +
                    "    hint.style.display = 'none';" +
                    "    if (document.getElementById('ctl00_ContentBody_lnkDH')) {" +
                    "      document.getElementById('ctl00_ContentBody_lnkDH').innerHTML = 'Show'" +
                    "    }" +
                    "  }" +
                    "    hint.innerHTML = convertROTStringWithBrackets(hint.innerHTML);" +
                    "  return false;" +
                    "}";
                insertScript(code, 'body');
                if ($('#ctl00_ContentBody_lnkDH')[0]) {
                    var link = $('#ctl00_ContentBody_lnkDH')[0];
                    link.setAttribute('onclick', 'hide_hint();');
                    link.setAttribute('title', 'Show/Hide ' + decode_innerHTML(label));
                    link.setAttribute('href', 'javascript:void(0);');
                    link.setAttribute('style', 'font-size: 12px;');
                    link.innerHTML = 'Show';
                }
                hint.style.marginBottom = '1.5em';
                hint.style.display = 'none';
            }
            // Remove hint description.
            var decryptKey = $('#dk')[0];
            if (decryptKey) decryptKey.parentNode.removeChild(decryptKey);
        } catch(e) {gclh_error("Hide hints:",e);}
    }

// Improve inventory list in cache listing.
    if (is_page("cache_listing")) {
        try {
            // Trackable Namen kürzen, damit nicht umgebrochen wird, und Title setzen.
            var inventory = $('#ctl00_ContentBody_uxTravelBugList_uxInventoryLabel').closest('.CacheDetailNavigationWidget').find('.WidgetBody span');
            for (var i = 0; i < inventory.length; i++) {noBreakInLine(inventory[i], 203, inventory[i].innerHTML);}
        } catch(e) {gclh_error("Improve inventory list:",e);}
    }

// Show Google-Maps Link on Cache Listing Page.
    if (settings_show_google_maps && is_page("cache_listing") && $('#ctl00_ContentBody_uxViewLargerMap')[0] && $('#uxLatLon')[0] && $('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode')[0]) {
        try {
            var ref_link = $('#ctl00_ContentBody_uxViewLargerMap')[0];
            var box = ref_link.parentNode;
            box.appendChild(document.createElement("br"));
            var link = document.createElement("a");
            link.setAttribute("class", "lnk");
            link.setAttribute("target", "_blank");
            link.setAttribute("title", "Show area on Google Maps");
            var matches = ref_link.href.match(/\?lat=(-?[0-9.]*)&lng=(-?[0-9.]*)/);
            var latlng = matches[1] + "," + matches[2];
            // &ll sorgt für Zentrierung der Seite beim Marker auch wenn linke Sidebar aufklappt. Zoom 18 setzen, weil GC Map eigentlich nicht mehr kann.
            link.setAttribute("href", "https://maps.google.de/maps?q=" + latlng + "&ll=" + latlng + "&z=18");
            var img = document.createElement("img");
            img.setAttribute("src", "/images/silk/map_go.png");
            link.appendChild(img);
            link.appendChild(document.createTextNode(" "));
            var span = document.createElement("span");
            span.appendChild(document.createTextNode("Show area on Google Maps"));
            link.appendChild(span);
            box.appendChild(link);
        } catch(e) {gclh_error("Show google maps link:",e);}
    }

// Hide spoilerwarning above the logs.
    if (settings_hide_spoilerwarning && is_page("cache_listing")) {
        try {
            if ($('.InformationWidget .NoBottomSpacing a[href*="/glossary.aspx#spoiler"]')[0]) {
                var sp = $('.InformationWidget .NoBottomSpacing a[href*="/glossary.aspx#spoiler"]')[0].closest('p');
                if (sp) {
                    sp.innerHTML = "&nbsp;";
                    sp.style.height = "0";
                    sp.className += " Clear";
                }
            }
        } catch(e) {gclh_error("Hide spoilerwarning:",e);}
    }

// Hide warning message.
    if (settings_hide_warning_message) {
        if ($('.WarningMessage')[0]) {
            try {
                var content = '"' + $('.WarningMessage')[0].innerHTML + '"';
                if (content == getValue("warningMessageContent")) {
                    warnMessagePrepareMouseEvents();
                } else {
                    // Button in Warnmeldung aufbauen, um Meldung erstes Mal zu verbergen.
                    var div = document.createElement("div");
                    div.setAttribute("class", "GoAwayWarningMessage");
                    div.setAttribute("title", "Go away message");
                    div.setAttribute("style", "float: right; width: 70px; color: rgb(255, 255, 255); box-sizing: border-box; border: 2px solid rgb(255, 255, 255); opacity: 0.7; cursor: pointer; border-radius: 3px; margin-right: 2px; margin-top: 2px; text-align: center;");
                    div.appendChild(document.createTextNode("Go away"));
                    div.addEventListener("click", warnMessageHideAndSave, false);
                    $('.WarningMessage')[0].parentNode.insertBefore(div, $('.WarningMessage')[0]);
                }
            } catch(e) {gclh_error("Hide warning message:",e);}
        }
    }
    // Warnmeldung verbergen und Inhalt sichern.
    function warnMessageHideAndSave() {
        $('.WarningMessage').fadeOut(1000, "linear");
        var content = '"' + $('.WarningMessage')[0].innerHTML + '"';
        setValue("warningMessageContent", content);
        $('.GoAwayWarningMessage')[0].style.display = "none";
        warnMessagePrepareMouseEvents();
    }
    // Mouse Events vorbereiten für show/hide Warnmeldung.
    function warnMessagePrepareMouseEvents() {
        // Balken im rechten Headerbereich zur Aktivierung der Warnmeldung.
        var divShow = document.createElement("div");
        divShow.setAttribute("class", "ShowWarningMessage");
        divShow.setAttribute("style", "z-index: 1004; float: right; right: 0px; width: 6px; background-color: rgb(224, 183, 10); height: 65px; position: absolute;");
        $('.WarningMessage')[0].parentNode.insertBefore(divShow, $('.WarningMessage')[0]);
        // Bereich für Mouseout Event, um Warnmeldung zu verbergen. Notwendig, weil eigentliche Warnmeldung nicht durchgängig da und zukünftiges Aussehen unklar.
        var divHide = document.createElement("div");
        divHide.setAttribute("class", "HideWarningMessage");
        divHide.setAttribute("style", "z-index: 1004; height: 110px; position: absolute; right: 0px; left: 0px;");
        $('.WarningMessage')[0].parentNode.insertBefore(divHide, $('.WarningMessage')[0]);
        warnMessageMouseOut();
    }
    // Show Warnmeldung.
    function warnMessageMouseOver() {
        $('.ShowWarningMessage')[0].style.display = "none";
        $('.WarningMessage')[0].style.display = "";
        $('.HideWarningMessage')[0].style.display = "";
        $('.HideWarningMessage')[0].addEventListener("mouseout", warnMessageMouseOut, false);
    }
    // Hide Warnmeldung.
    function warnMessageMouseOut() {
        $('.WarningMessage')[0].style.display = "none";
        $('.HideWarningMessage')[0].style.display = "none";
        $('.ShowWarningMessage')[0].style.display = "";
        $('.ShowWarningMessage')[0].addEventListener("mouseover", warnMessageMouseOver, false);
    }

// Driving direction for every waypoint.
    if (settings_driving_direction_link && (is_page("cache_listing") || document.location.href.match(/\.com\/hide\/wptlist.aspx/))) {
        try {
            var tbl = getWaypointTable();
            var length = tbl.find("tbody > tr").length;
            for (var i=0; i<length/2; i++) {
                var row1st = tbl.find("tbody > tr").eq(i*2);
                var name = row1st.find("td:eq(4)").text().trim();
                var icon = row1st.find("td:eq(1) > img").attr('src');
                var cellCoordinates = row1st.find("td:eq(5)");
                var tmp_coords = toDec(cellCoordinates.text().trim());
                if ((!settings_driving_direction_parking_area || icon.match(/pkg.jpg/g)) && typeof tmp_coords[0] !== 'undefined' && typeof tmp_coords[1] !== 'undefined') {
                    if (getValue("home_lat", 0) != 0 && getValue("home_lng") != 0) {
                        var link = "http://maps.google.com/maps?f=d&hl=en&saddr="+getValue("home_lat", 0)/10000000+","+getValue("home_lng", 0)/10000000+"%20(Home%20Location)&daddr=";
                        row1st.find("td:last").append('<a title="Driving Directions" href="'+link+tmp_coords[0]+","+tmp_coords[1]+" ("+name+')" target="_blank"><img src="/images/icons/16/directions.png"></a>');
                    } else {
                        var link = document.location + "&#gclhpb#errhomecoord";
                        row1st.find("td:last").append('<a title="Driving Directions" href="'+link+'"><img src="/images/icons/16/directions.png"></a>');
                    }
                }
            }
        } catch(e) {gclh_error("Driving direction for Waypoints:",e);}
    }

// Added elevation to every additional waypoint with shown coordinates.
    if (settings_show_elevation_of_waypoints && is_page("cache_listing") && !isMemberInPmoCache()) {
        try {
            function formatElevation(elevation) {
                return ((elevation>=0)?"+":"")+((settings_distance_units != "Imperial")?(Math.round(elevation) + "m"):(Math.round(elevation*3.28084) + "ft"));
            }
            elevationServicesData[1]['function'] = addElevationToWaypoints_GoogleElevation;
            elevationServicesData[2]['function'] = addElevationToWaypoints_OpenElevation;

            function addElevationToWaypoints_GoogleElevation(responseDetails) {
                try {
                    context = responseDetails.context;
                    json = JSON.parse(responseDetails.responseText);
                    if ( json.status != "OK") {
                        var mess = "\naddElevationToWaypoints_GoogleElevation():\n- Get elevations: retries: "+context.retries+"\n- json-status: "+json.status+"\n- json.error_message: "+json.error_message;
                        gclh_log(mess);
                        getElevations(context.retries+1,context.locations);
                        return;
                    }
                    var elevations = [];
                    for (var i=0; i<json.results.length; i++) {
                        if (json.results[i].location.lat != -90) elevations.push( json.results[i].elevation );
                        else elevations.push( undefined );
                    }
                    addElevationToWaypoints(elevations,context)
                } catch(e) {gclh_error("addElevationToWaypoints_GoogleElevation():",e);}
            }

            function addElevationToWaypoints_OpenElevation(responseDetails) {
                try {
                    context = responseDetails.context;
                    json = JSON.parse(responseDetails.responseText);
                    var elevations = [];
                    for (var i=0; i<json.results.length; i++) {
                        elevations.push( json.results[i].elevation );
                    }
                    addElevationToWaypoints(elevations,context)
                } catch(e) {gclh_error("addElevationToWaypoints_OpenElevation():",e);}
            }

            function addElevationToWaypoints(elevations,context) {
                try {
                    var text = "";
                    for (var i=0; i<elevations.length; i++) {
                        text = "n/a";
                        if (elevations[i] != undefined) text = formatElevation(elevations[i]);
                        $("#elevation-waypoint-"+i).html(text);
                        $("#elevation-waypoint-"+i).attr('title','Elevation data from '+context.serviceName);
                    }
                } catch(e) {gclh_error("addElevationToWaypoints():",e);}
            }

            function getLocations() {
                try {
                    var locations=[];
                    var tbl = getWaypointTable();
                    if (tbl.length > 0) {
                        tbl.find("thead > tr > th:eq(5)").after('<th scope="col">Elevation</th>');
                        var length = tbl.find("tbody > tr").length;
                        for (var i=0; i<length/2; i++) {
                            var cellNote = tbl.find("tbody > tr:eq("+(i*2+1)+") > td:eq(1)");
                            var colspan = cellNote.attr('colspan');
                            cellNote.attr('colspan',colspan+1);
                            var row1st = tbl.find("tbody > tr").eq(i*2);
                            var cellCoordinates = row1st.find("td:eq(5)");
                            var tmp_coords = toDec(cellCoordinates.text().trim());
                            row1st.find("td:eq(5)").after('<td><span class="waypoint-elevation" id="elevation-waypoint-'+(locations.length)+'" ></span></td>');
                            if (typeof tmp_coords[0] !== 'undefined' && typeof tmp_coords[1] !== 'undefined') {
                                locations.push(tmp_coords[0]+","+tmp_coords[1]);
                            } else {
                                locations.push("-90.0,-180.0"); // For waypoints without visible coordinates.
                            }
                        }
                    }
                    var waypoint = getListingCoordinates(false);
                    if (waypoint !== undefined) {
                        $("#uxLatLonLink").after('<span title="Elevation">&nbsp;&nbsp;&nbsp;Elevation:&nbsp;<span class="waypoint-elevation"  id="elevation-waypoint-'+(locations.length)+'" ></span></span>');
                        locations.push( waypoint.latitude+","+waypoint.longitude );
                    }
                    return locations;
                } catch(e) {gclh_error("getLocations():",e);}
            }

            var elevationServices = [];
            if ( settings_primary_elevation_service > 0 ) {
                elevationServices.push(elevationServicesData[settings_primary_elevation_service]);
            }
            if ( settings_secondary_elevation_service > 0 ) {
                elevationServices.push(elevationServicesData[settings_secondary_elevation_service]);
            }

            function getElevations(serviceIndex,locations) {
                if (serviceIndex >= elevationServices.length || elevationServices<0 ) {
                    $('.waypoint-elevation').each(function (index, value) {
                        $(this).html('<span title="Fail to load elevation data">???</span>');
                    });
                    return;
                }
                $('.waypoint-elevation').each(function (index, value) {
                    $(this).html('<img src="' + urlImages + 'ajax-loader.gif" title="Load elevation data for the waypoint from '+elevationServices[serviceIndex]['name']+'."/>');
                });
                var context = {
                    retries : serviceIndex,
                    serviceName : elevationServices[serviceIndex]['name'],
                    locations : locations
                }
                var locationsstring = locations.join('|');
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: elevationServices[serviceIndex].url.replace('{locations}',locationsstring),
                    context: context,
                    onload: elevationServices[serviceIndex]['function'],
                    onerror: function() {gclh_log("Elevation: ERROR: request elevation for waypoints failed!");}
                });
            }

            var locations = getLocations();
            getElevations(0,locations);
        } catch(e) {gclh_error("AddElevation",e);}
    }
    // Returns true in case of modified coordinates.
    function areListingCoordinatesModified() {
        if ((typeof(unsafeWindow.userDefinedCoords) != 'undefined') && (unsafeWindow.userDefinedCoords.data.isUserDefined==true)) return true;
        return false;
    }
    // Returns the listing coordinates as an array. In case of user changed listing coordinates, the changed coords are returned.
    // If the parameter original true, always the original listing coordinates are returned.
    function getListingCoordinates(original) {
        var waypoint = undefined;
        if (areListingCoordinatesModified()) {
            waypoint = {latitude : undefined, longitude : undefined};
            if ((typeof(original) != 'undefined') && original == true) {
                waypoint.latitude = unsafeWindow.userDefinedCoords.data.oldLatLng[0];
                waypoint.longitude = unsafeWindow.userDefinedCoords.data.oldLatLng[1];
            } else {
                waypoint.latitude = unsafeWindow.userDefinedCoords.data.newLatLng[0];
                waypoint.longitude = unsafeWindow.userDefinedCoords.data.newLatLng[1];
            }
        } else {
            var listingCoords = $('#ctl00_ContentBody_uxViewLargerMap');
            if (listingCoords.length > 0 && listingCoords.attr('href').length > 0) {
                var tmp_coords = listingCoords.attr('href').match(/(-)*(\d{1,3})(.(\d{1,6}))?/g);
                if (typeof(tmp_coords[0]) !== undefined && typeof(tmp_coords[1]) !== undefined) {
                    waypoint = {latitude : undefined, longitude : undefined};
                    waypoint.latitude = tmp_coords[0];
                    waypoint.longitude = tmp_coords[1];
                }
            }
        }
        return waypoint;
    }

// Hide greenToTopButton.
    if (settings_hide_top_button) $("#topScroll").attr("id", "_topScroll").hide();

// Show Smilies und Log Templates old log page.
    if ((document.location.href.match(/\.com\/seek\/log\.aspx\?(id|guid|ID|wp|LUID|PLogGuid)\=/) || document.location.href.match(/\.com\/track\/log\.aspx\?(id|wid|guid|ID|LUID|PLogGuid)\=/)) &&
        $('#litDescrCharCount')[0] && $('#ctl00_ContentBody_LogBookPanel1_WaypointLink')[0] && $('#ctl00_ContentBody_LogBookPanel1_uxLogInfo')[0] && $('#uxDateVisited')[0]) {
        try {
            var [aGCTBName, aGCTBLink, aGCTBNameLink, aLogDate] = getGCTBInfo();
            var aOwner = decode_innerHTML($('#ctl00_ContentBody_LogBookPanel1_WaypointLink')[0].nextSibling.nextSibling.nextSibling.nextSibling.nextSibling);
            insert_smilie_fkt("ctl00_ContentBody_LogBookPanel1_uxLogInfo");
            insert_tpl_fkt();
            var liste = "";
            if (settings_show_bbcode) build_smilies();
            build_tpls();
            var box = $('#litDescrCharCount')[0];
            box.innerHTML = liste;
        } catch(e) {gclh_error("Smilies and Log Templates old log page:",e);}
    }
// Show Smilies und Log Templates new log page.
    if (document.location.href.match(/\.com\/play\/geocache\/gc\w+\/log/) &&
        $('.muted')[0] && $('#LogDate')[0] && $('#logContent')[0] && $('#LogText')[0]) {
        try {
            var [aGCTBName, aGCTBLink, aGCTBNameLink, aLogDate] = getGCTBInfo(true);
            var aOwner = decode_innerHTML($('.muted')[0].children[1]);
            insert_smilie_fkt("LogText");
            insert_tpl_fkt(true);
            var liste = "";
            if (settings_show_bbcode) build_smilies(true);
            build_tpls(true);
            var box = document.createElement("div");
            box.innerHTML = liste;
            side = $('#logContent')[0];
            side.insertBefore(box, side.childNodes[0]);
            // --> Chrom
            // Chrome kann kein onClick auf einem option Element. Workaround über Click Event auf select und dann Zuordnung über selectedIndex.
            if (browser == "chrome") $('#gclh_log_tpls')[0].addEventListener("click", gclh_insert_tpl, false);
            // <-- Chrom
            var css = "";
            css += ".flatpickr-wrapper {left: 244px; float: unset !important;}";
            css += "#gclh_log_tpls {position: relative; float: right; bottom: 8px; margin-right: -1px; width: unset; border: 1px solid #9b9b9b; box-shadow: none; height: 40px; padding-top: 5px;}";
            css += "select:hover, select:focus, select:active {background-image: url(/play/app/ui-icons/icons/global/caret-down-hover.svg);}";
            appendCssStyle(css);
        } catch(e) {gclh_error("Smilies and Log Templates new log page:",e);}
    }
    // Script für insert Smilie by click.
    function insert_smilie_fkt(id) {
        var code = "function gclh_insert_smilie(aTag,eTag){";
        code += "  var input = document.getElementById('"+id+"');";
        code += "  if(typeof input.selectionStart != 'undefined'){";
        code += "    var start = input.selectionStart;";
        code += "    var end = input.selectionEnd;";
        code += "    var insText = input.value.substring(start, end);";
        code += "    input.value = input.value.substr(0, start) + aTag + insText + eTag + input.value.substr(end);";
        code += "    if (insText.length == 0) var pos = start + aTag.length;";
        code += "    else var pos = start + aTag.length + insText.length + eTag.length;";
        code += "    input.selectionStart = input.selectionEnd = pos;";
        code += "  }";
        code += "  input.focus();";
        code += "}";
        insertScript(code, 'body');
    }
    // Script für insert Log Template by click.
    function insert_tpl_fkt(newLogPage) {
        finds = get_my_finds();
        var [aDate, aTime, aDateTime] = getDateTime();
        var me = global_me;
        var code = "function gclh_insert_tpl(id){";
        if (newLogPage) {
            // --> Chrom
            code += "  if (id && id.path) {";
            code += "    if (this.selectedIndex <= 0) return;";
            code += "    else var id = 'gclh_template['+this.children[this.selectedIndex].value+']';";
            code += "  }";
            // <-- Chrom
            code += "  document.getElementById('gclh_log_tpls').value = -1;";
            code += "  var aLogDate = document.getElementById('LogDate').value;";
            code += "  var input = document.getElementById('LogText');";
        } else {
            code += "  var aLogDate = document.getElementById('uxDateVisited').value;";
            code += "  var input = document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo');";
        }
        code += "  var finds = '" + finds + "';";
        code += "  var aDate = '" + aDate + "';";
        code += "  var aTime = '" + aTime + "';";
        code += "  var aDateTime = '" + aDateTime + "';";
        code += "  var me = '" + me + "';";
        code += "  var aGCTBName = '" + aGCTBName + "';";
        code += "  var aGCTBLink = '" + aGCTBLink + "';";
        code += "  var aGCTBNameLink = '" + aGCTBNameLink + "';";
        code += "  var settings_replace_log_by_last_log = " + settings_replace_log_by_last_log + ";";
        code += "  var owner = '" + aOwner + "';";
        code += "  var inhalt = document.getElementById(id).innerHTML;";
        code += "  inhalt = inhalt.replace(/\\&amp\\;/g,'&');";
        code += "  if (finds) {";
        code += "    inhalt = inhalt.replace(/#found_no#/ig, finds);";
        code += "    finds++;";
        code += "    inhalt = inhalt.replace(/#found#/ig, finds);";
        code += "  }";
        code += "  if (aDate) inhalt = inhalt.replace(/#Date#/ig, aDate);";
        code += "  if (aTime) inhalt = inhalt.replace(/#Time#/ig, aTime);";
        code += "  if (aDateTime) inhalt = inhalt.replace(/#DateTime#/ig, aDateTime);";
        code += "  if (me) inhalt = inhalt.replace(/#me#/ig, me);";
        code += "  if (aGCTBName) inhalt = inhalt.replace(/#GCTBName#/ig, aGCTBName);";
        code += "  if (aGCTBLink) inhalt = inhalt.replace(/#GCTBLink#/ig, aGCTBLink);";
        code += "  if (aGCTBNameLink) inhalt = inhalt.replace(/#GCTBNameLink#/ig, aGCTBNameLink);";
        code += "  if (aLogDate) inhalt = inhalt.replace(/#LogDate#/ig, aLogDate);";
        if (!newLogPage || settings_show_pseudo_as_owner) {
            code += "  if (owner) inhalt = inhalt.replace(/#owner#/ig, owner);";
        }
        code += "  if (id.match(/last_logtext/) && settings_replace_log_by_last_log) {";
        code += "    input.value = inhalt;";
        code += "  }else{";
        code += "    if (typeof input.selectionStart != 'undefined' && inhalt) {";
        code += "      var start = input.selectionStart;";
        code += "      var end = input.selectionEnd;";
        code += "      var insText = input.value.substring(start, end);";
        code += "      input.value = input.value.substr(0, start) + inhalt + input.value.substr(end);";
        code += "      var pos = start + inhalt.length;";
        code += "      input.selectionStart = input.selectionEnd = pos;";
        code += "    }";
        code += "  }";
        code += "  input.focus();";
        code += "}";
        insertScript(code, 'body');
    }
    // Smilies aufbauen.
    function build_smilies(newLogPage) {
        var o = "<p style='margin: 5px;'>";
        if (newLogPage) liste += "<p style='float: right; margin-top: -60px; margin-right: -8px;'>";
        else liste += "<br>" + o;
        bs("[:)]", "");
        bs("[:D]", "_big");
        bs("[8D]", "_cool");
        bs("[:I]", "_blush");
        bs("[:P]", "_tongue");
        if (!newLogPage) liste += "</p>" + o;
        bs("[}:)]", "_evil");
        bs("[;)]", "_wink");
        bs("[:o)]", "_clown");
        bs("[B)]", "_blackeye");
        bs("[8]", "_8ball");
        if (newLogPage) liste += "<p style='float: right; margin-top: -40px; margin-right: -8px;'>";
        else liste += "</p>" + o;
        bs("[:(]", "_sad");
        bs("[8)]", "_shy");
        bs("[:O]", "_shock");
        bs("[:(!]", "_angry");
        bs("[xx(]", "_dead");
        if (!newLogPage) liste += "</p>" + o;
        bs("[|)]", "_sleepy");
        bs("[:X]", "_kisses");
        bs("[^]", "_approve");
        bs("[V]", "_dissapprove");
        bs("[?]", "_question");
        liste += "</p>";
        function bs(s, n) {liste += "<a href='#' onClick='gclh_insert_smilie(\"" + s + "\",\"\"); return false;'" + (newLogPage ? "style='margin: -2px;'" : "") + "><img src='/images/icons/icon_smile" + n + ".gif' title='" + s + " " + n.replace("_", "") + "' border='0'></a>&nbsp;&nbsp;";}
    }
    // Log Templates aufbauen.
    function build_tpls(newLogPage) {
        var texts = ""; var logicOld = ""; var logicNew = "";
        for (var i = 0; i < anzTemplates; i++) {
            if (getValue("settings_log_template_name["+i+"]", "") != "") {
                texts += "<div id='gclh_template["+i+"]' style='display: none;'>" + getValue("settings_log_template["+i+"]", "") + "</div>";
                logicOld += "<a href='#' onClick='gclh_insert_tpl(\"gclh_template["+i+"]\"); return false;' style='color: #000000; text-decoration: none; font-weight: normal;'> - " + getValue("settings_log_template_name["+i+"]", "") + "</a><br>";
                logicNew += "<option value='"+i+"' onClick='gclh_insert_tpl(\"gclh_template["+i+"]\"); return false;' style='color: #4a4a4a;'>" + getValue("settings_log_template_name["+i+"]", "") + "</option>";
            }
        }
        if (getValue("last_logtext", "") != "") {
            texts += "<div id='gclh_template[last_logtext]' style='display: none;'>" + getValue("last_logtext", "") + "</div>";
            logicOld += "<a href='#' onClick='gclh_insert_tpl(\"gclh_template[last_logtext]\"); return false;' style='color: #000000; text-decoration: none; font-weight: normal;'> - [Last Cache-Log]</a><br>";
            logicNew += "<option value='last_logtext' onClick='gclh_insert_tpl(\"gclh_template[last_logtext]\"); return false;' style='color: #4a4a4a;'>[Last Cache-Log]</option>";
        }
        if (newLogPage) {
            liste += texts;
            liste += "<select id='gclh_log_tpls' class='gclh_form' style='color: #9b9b9b;'>";
            liste += "<option value='-1' selected='selected'" + "style='display: none; visibility: hidden;'>- Log Templates -</option>";
            liste += logicNew;
            liste += "</select>";
        } else liste += "<br><p style='margin: 0;'>Templates:</p>" + texts + logicOld;
    }
// Vorschau für Log, Log preview.
    if (document.location.href.match(/\.com\/play\/geocache\/gc\w+\/log/)) {
        try {
            var log_preview_wrapper =
                '<section class="region trackables-wrapper" id="log-previewPanel">' +
                    '<div>' +
                        '<button type="button" id="log-preview-button" class="btn btn-handle handle-open" data-open="false">Log Preview' +
                            '<svg height="24" width="24" class="icon icon-svg-fill sea">' +
                                '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/play/app/ui-icons/sprites/global.svg#icon-expand-svg-fill"></use>' +
                            '</svg>' +
                        '</button>' +
                        '<div class="inventory-panel" style="display: block;" id="log-preview-content">' +
                            '<div class="inventory-content mdd_preview markdown-output"></div>' +
                        '</div>' +
                    '</div>' +
                '</section>';

            // Add divs for Markdown Editor
            $('textarea.log-text').before('<div class="mdd_toolbar"></div>');
            $('textarea.log-text').after('<div class="mdd_resizer">');
            $('#trackablesPanel').before(log_preview_wrapper);

            var $mdEditor = $("textarea.log-text").MarkdownDeep({
                SafeMode :true,
                AllowInlineImages: false,
                ExtraMode: false,
                RequireHeaderClosingTag: true,
                disableShortCutKeys: true,
                DisabledBlockTypes: [
                    BLOCKTYPE_CONST.h4,
                    BLOCKTYPE_CONST.h5,
                    BLOCKTYPE_CONST.h6
                ],
                help_location: "/guide/markdown.aspx",
                active_modal_class: "modal-open",
                active_modal_selector: "html",
                additionalPreviewFilter: SmileyConvert()
            });

            $('#log-preview-button').click(function(){
                $('#log-preview-content').toggle();
                $('#log-previewPanel button').toggleClass('handle-open');
            });

            appendCssStyle('.markdown-output span.WaypointLog{color:#4a4a4a;display:block;font-weight:bold;margin-bottom:2em}.markdown-output{font-size:1.08em;line-height:1.375em;overflow:hidden;word-wrap:break-word}.markdown-output h1{color:#4a4a4a;font-size:1.285em;font-weight:bold;line-height:1.375em;margin:0}.markdown-output h2{color:#4a4a4a;font-size:1.285em;font-weight:normal;line-height:1.375em;margin:0}.markdown-output h3{color:#00b265;font-size:1.285em;font-weight:normal;line-height:1.375em;margin:0;text-transform:uppercase}.markdown-output hr{background:#d8d8d8;height:2px;margin:1.45em 0}.markdown-output p{color:#4a4a4a;margin:0 0 1.5em}.markdown-output li{list-style:inherit}.markdown-output ul{list-style-type:disc}.markdown-output ol{list-style-type:decimal}.markdown-output ul,.markdown-output ol{color:#4a4a4a;margin:0 1.5em 1.5em .75em;padding-left:1.5em}.markdown-output li ul{list-style-type:none;margin-left:0;margin-bottom:0;padding-left:0}.markdown-output li ul li::before{background-color:#e0b70a;border-radius:50%;content:"";display:inline-block;height:5px;margin-right:.75em;margin-top:-1px;width:5px;vertical-align:middle}.markdown-output li ol{margin-left:0;margin-bottom:0}.markdown-output blockquote{background:none;font-style:normal;margin:1.5em .75em;padding:0}.markdown-output blockquote p{color:#00b265;font-weight:bold}.markdown-output blockquote p::before{content:\'“\'}.markdown-output blockquote p::after{content:\'”\'}.markdown-output a,#bd .markdown-output a{color:#006cff;text-decoration:none}.markdown-output a:hover,.markdown-output a:focus{border-bottom:1px solid #006cff;color:#006cff}.markdown-output .AlignRight a{color:#00447c}.markdown-output .AlignRight a:visited{color:#00a0b0}.markdown-output .AlignRight a:hover,.markdown-output .AlignRight a:focus{border-bottom:none;color:#6c8e10}.markdown-output~.AlternatingRow,table .markdown-output~tr.AlternatingRow td{background:#fff}.markdown-output.BorderBottom td{border-bottom-color:#9b9b9b}.markdown-output.BorderBottom:last-child td{border-bottom:none}.markdown-output>td:last-child{padding-bottom:2.5em}');
        } catch(e) {gclh_error("Logpage Log Preview:",e);}
    }
// Replicate TB-Header to bottom
    if (document.location.href.match(/\.com\/play\/geocache\/gc\w+\/log/)) {
        try {
            var checkExistTBHeader = setInterval(function() {
               if ($('#tbHeader .trackables-header').length) {
                  $(".trackables-list").append('<li id="cloned_tb_header"></li>');
                  $("#tbHeader").clone().insertAfter("#cloned_tb_header");
                  clearInterval(checkExistTBHeader);
               }
            }, 500); // check every 500ms
        } catch(e) {gclh_error("Logpage Replicate TB-Header",e);}
    }

// Maxlength of logtext and unsaved warning.
    if ((document.location.href.match(/\.com\/seek\/log\.aspx\?(id|guid|ID|wp|LUID|PLogGuid)\=/) ||
         document.location.href.match(/\.com\/track\/log\.aspx\?(id|wid|guid|ID|LUID|PLogGuid)\=/)) && $('#litDescrCharCount')[0]) {
        try {
            var changed = false;
            function limitLogText(limitField) {
                changed = true;
                // Aus GC Funktion "checkLogInfoLength".
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
                } else counterelement.innerHTML = length + '/' + limitNum;
            }
            // Meldung bei ungespeichertem Log.
            window.onbeforeunload = function(e) {
                if (changed) {
                    var mess = "You have changed a log and haven't saved it yet. Do you want to leave this page and lose your changes?";
                    e.returnValue = mess;
                    return mess;
                }
            };
            $('#ctl00_ContentBody_LogBookPanel1_btnSubmitLog')[0].addEventListener("click", function() {changed = false;}, false);  // Keine Meldung beim Submit.
            var logfield = $('#ctl00_ContentBody_LogBookPanel1_uxLogInfo')[0];
            logfield.addEventListener("keyup", function() {limitLogText(logfield);}, false);
            logfield.addEventListener("change", function() {limitLogText(logfield);}, false);
            var counterpos = document.getElementById('litDescrCharCount').parentNode;
            var counterspan = document.createElement('p');
            counterspan.id = "logtextcounter";
            counterspan.innerHTML = "<b>Loglength:</b><br />";
            var counterelement = document.createElement('span');
            counterelement.innerHTML = "0/4000";
            counterspan.appendChild(counterelement);
            counterpos.appendChild(counterspan);
        } catch(e) {gclh_error("Maxlength of logtext and unsaved warning:",e);}
    }

// Autovisit Old Log Page.
    if (settings_autovisit && document.location.href.match(/\.com\/seek\/log\.aspx/) && !document.location.href.match(/\.com\/seek\/log\.aspx\?LUID=/) && !document.getElementById('ctl00_ContentBody_LogBookPanel1_CoordInfoLinkControl1_uxCoordInfoCode')) {
        try {
            var tbs = getTbsO();
            if (tbs.length != 0) {
                for (var i = 0; i < tbs.length; i++) {
                    var [tbC, tbN] = getTbO(tbs[i].parentNode);
                    if (!tbC || !tbN) continue;
                    var auto = document.createElement("input");
                    auto.setAttribute("type", "checkbox");
                    auto.setAttribute("id", "gclh_"+tbC);
                    auto.setAttribute("value", tbN);
                    auto.addEventListener("click", setAutoO, false);
                    tbs[i].appendChild(auto);
                    tbs[i].appendChild(document.createTextNode(" AutoVisit"));
                }
                $('#ctl00_ContentBody_LogBookPanel1_ddLogType')[0].addEventListener("input", buildAutosO, false);
                buildAutosO(true);
                window.addEventListener("load", function(){buildAutosO(true);}, false);
            }
            function buildAutosO(start) {
                var type = getTypeO();
                var tbs = getTbsO();
                for (var i = 0; i < tbs.length; i++) {
                    var [tbC, tbN] = getTbO(tbs[i].parentNode);
                    setAutoO(tbC, tbN, type, start, true);
                }
                if (unsafeWindow.setSelectedActions) unsafeWindow.setSelectedActions();
            }
            function setAutoO(tbC, tbN, type, start, allTbs) {
                if (!type) var type = getTypeO();
                if (!tbC || !tbN) var [tbC, tbN] = getTbO(this.parentNode.parentNode);
                var options = $('#gclh_'+tbC)[0].parentNode.getElementsByTagName('option');
                var select = $('#gclh_'+tbC)[0].parentNode.getElementsByTagName('select');
                var autos = $('#gclh_'+tbC)[0];
                if (!type || !tbC || !tbN || !select[0] || options.length < 2 || !autos) return;
                if (start) {
                    if (getValue("autovisit_"+tbC, false)) autos.checked = true;
                    else autos.checked = false;
                }
                if (options.length == 2 || (options.length == 3 && select[0].selectedIndex != 1)) {
                    if (autos.checked == true) {
                        if (type == 2 || type == 10 || type == 11) select[0].selectedIndex = options.length - 1;
                        else select[0].selectedIndex = 0;
                    } else {
                        if (allTbs != true && (type == 2 || type == 10 || type == 11)) select[0].selectedIndex = 0;
                    }
                }
                setValue("autovisit_"+tbC, (autos.checked ? true:false));
            }
            function getTypeO() {return $('#ctl00_ContentBody_LogBookPanel1_ddLogType')[0].value;}
            function getTbsO() {return $('#tblTravelBugs tbody tr td select').closest('td');}
            function getTbO(tb) {return [$(tb).find('td a')[0].innerHTML, $(tb).find('td select option')[0].value];}
        } catch(e) {gclh_error("Autovisit Old:",e);}
    }

// Default Log Type and Log Signature Old Log Page.
    // Cache:
    if (document.location.href.match(/\.com\/seek\/log\.aspx\?(id|guid|ID|PLogGuid|wp)\=/) && $('#ctl00_ContentBody_LogBookPanel1_ddLogType')[0] && $('#ctl00_ContentBody_LogBookPanel1_lbConfirm').length == 0) {
        try {
            if (!document.location.href.match(/\&LogType\=/) && !document.location.href.match(/PLogGuid/)) {
                var cache_type = document.getElementById("ctl00_ContentBody_LogBookPanel1_WaypointLink").nextSibling.childNodes[0].title;
                var select_val = "-1";
                if (cache_type.match(/event/i)) {
                    select_val = settings_default_logtype_event;
                } else if ($('.PostLogList').find('a[href*="https://www.geocaching.com/profile/?guid="]').text().trim() == global_me.trim()) {
                    select_val = settings_default_logtype_owner;
                } else select_val = settings_default_logtype;
                var select = document.getElementById('ctl00_ContentBody_LogBookPanel1_ddLogType');
                var childs = select.children;
                if (select.value == "-1") {
                    for (var i = 0; i < childs.length; i++) {
                        if (childs[i].value == select_val) select.selectedIndex = i;
                    }
                }
            }
            // Signature.
            if (document.location.href.match(/\.com\/seek\/log\.aspx\?PLogGuid\=/)) {
                if (settings_log_signature_on_fieldnotes) document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML += getValue("settings_log_signature", "");
            } else document.getElementById('ctl00_ContentBody_LogBookPanel1_uxLogInfo').innerHTML += getValue("settings_log_signature", "");
            replacePlaceholder();
        } catch(e) {gclh_error("Default Log-Type and Signature Old Log Page(CACHE):",e);}
    }
    // TB:
    if (document.location.href.match(/\.com\/track\/log\.aspx/) && $('#ctl00_ContentBody_LogBookPanel1_ddLogType')[0]) {
        try {
            if (settings_default_tb_logtype != "-1" && !document.location.href.match(/\&LogType\=/)) {
                var select = document.getElementById('ctl00_ContentBody_LogBookPanel1_ddLogType');
                var childs = select.children;
                for (var i = 0; i < childs.length; i++) {
                    if (childs[i].value == settings_default_tb_logtype) select.selectedIndex = i;
                }
            }
            // Signature.
            if ($('#ctl00_ContentBody_LogBookPanel1_uxLogInfo')[0] && $('#ctl00_ContentBody_LogBookPanel1_uxLogInfo')[0].innerHTML == "") $('#ctl00_ContentBody_LogBookPanel1_uxLogInfo')[0].innerHTML = getValue("settings_tb_signature", "");
            replacePlaceholder();
        } catch(e) {gclh_error("Default Log-Type and Signature (TB):",e);}
    }
// Log Signature New Log Page.
    if (document.location.href.match(/\.com\/play\/geocache\/gc\w+\/log/)) {
        try {
            checkLogType(0);
            function checkLogType(waitCount) {
                if ((!document.location.href.match(/log\?d\=/) && $('.selectric')[0]) ||  // Kein Draft
                    (document.location.href.match(/log\?d\=/) && document.getElementById('LogText').value != "" && settings_log_signature_on_fieldnotes)) {  // Draft
                    document.getElementById('LogText').innerHTML = getValue("settings_log_signature", "");
                    replacePlaceholder(true);
                    if (document.location.href.match(/log\?d\=/)) {
                        // 2 Zeilen sinngemäß von DieBatzen ausgeliehen, um "<" und ">" richtig darzustellen.
                        var textarea = document.createElement('textarea');
                        var value = $('<textarea>').html(document.getElementById('LogText').innerHTML).val();
                        document.getElementById('LogText').value += value;
                    }
                } else {waitCount++; if (waitCount <= 100) setTimeout(function(){checkLogType(waitCount);}, 100);}
            }
        } catch(e) {gclh_error("Signature New Log Page(CACHE):",e);}
    }
    function replacePlaceholder(newLogPage) {
        if (newLogPage) var id = "LogText";
        else var id = "ctl00_ContentBody_LogBookPanel1_uxLogInfo";
        window.addEventListener("load", gclh_setFocus, false);
        var finds = get_my_finds();
        var me = global_me;
        if (newLogPage) var owner = $('.muted')[0].children[1].innerHTML;
        else var owner = document.getElementById('ctl00_ContentBody_LogBookPanel1_WaypointLink').nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerHTML;
        document.getElementById(id).innerHTML = document.getElementById(id).innerHTML.replace(/#found_no#/ig, finds);
        finds++;
        if (!newLogPage || settings_show_pseudo_as_owner) document.getElementById(id).innerHTML = document.getElementById(id).innerHTML.replace(/#owner#/ig, owner);
        document.getElementById(id).innerHTML = document.getElementById(id).innerHTML.replace(/#found#/ig, finds).replace(/#me#/ig, me);
        var [aDate, aTime, aDateTime] = getDateTime();
        document.getElementById(id).innerHTML = document.getElementById(id).innerHTML.replace(/#Date#/ig, aDate).replace(/#Time#/ig, aTime).replace(/#DateTime#/ig, aDateTime);
        var [aGCTBName, aGCTBLink, aGCTBNameLink, aLogDate] = getGCTBInfo(newLogPage);
        document.getElementById(id).innerHTML = document.getElementById(id).innerHTML.replace(/#GCTBName#/ig, aGCTBName).replace(/#GCTBLink#/ig, aGCTBLink).replace(/#GCTBNameLink#/ig, aGCTBNameLink).replace(/#LogDate#/ig, aLogDate);
        // Set Cursor to Pos1.
        function gclh_setFocus() {
            var input = document.getElementById(id);
            if (input) {
                try {
                    input.selectionStart = 0;
                    input.selectionEnd = 0;
                    input.focus();
                } catch(e) {}
            }
        }
    }

// Last Log-Text speichern.
    if (document.location.href.match(/\.com\/seek\/log\.aspx/) || document.location.href.match(/\.com\/play\/geocache\/gc\w+\/log/)) {
        try {
            function sendOldLog(e) {setValue("last_logtext", $('#ctl00_ContentBody_LogBookPanel1_uxLogInfo')[0].value);}
            if ($('#ctl00_ContentBody_LogBookPanel1_btnSubmitLog')[0]) $('#ctl00_ContentBody_LogBookPanel1_btnSubmitLog')[0].addEventListener('click', sendOldLog, true);
            function sendNewLog(e) {setValue("last_logtext", $('#LogText')[0].value);}
            if ($('.btn-submit')[0] && $('.btn-submit')[0].parentNode) $('.btn-submit')[0].parentNode.addEventListener('click', sendNewLog, true);
        } catch(e) {gclh_error("Last Log-Text speichern:",e);}
    }

// Hide socialshare.
    if (settings_hide_socialshare && document.location.href.match(/\.com\/seek\/log\.aspx?(.*)/)) {
        try {
            if ($('#sharing_container')[0]) $('#sharing_container')[0].style.display = "none";
            if ($('#uxSocialSharing')[0]) $('#uxSocialSharing')[0].style.display = "none";
        } catch(e) {gclh_error("Hide socialshare1:",e);}
    }
    if (settings_hide_socialshare && document.location.href.match(/\.com\/play\/friendleague/)) {
        try {
            if ($('.btn.btn-facebook')[0]) {
                $('.btn.btn-facebook')[0].parentNode.style.display = "none";
                $('.btn.btn-facebook')[0].parentNode.previousElementSibling.style.display = "none";
                if ($('.share-button-group')[0]) $('.share-button-group')[0].style.marginBottom = "0";
            }
        } catch(e) {gclh_error("Hide socialshare2:",e);}
    }

// Remove advertisement link.
    if (settings_hide_advert_link) {
        try {
            $('a[href*="advertising.aspx"]').remove();
        } catch(e) {gclh_error("Hide advertisement link:",e);}
    }

// Improve Mail.
    if (settings_show_mail && document.location.href.match(/\.com\/email\//) && $('#ctl00_ContentBody_SendMessagePanel1_tbMessage')[0]) {
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
            // Set focus.
            $('#ctl00_ContentBody_SendMessagePanel1_tbMessage')[0].setAttribute("onfocus", "");
            // Default settings.
            $('#ctl00_ContentBody_SendMessagePanel1_chkSendAddress')[0].checked = getValue("email_sendaddress", "checked");
            $('#ctl00_ContentBody_SendMessagePanel1_chkEmailCopy')[0].checked = getValue("email_mailcopy", "checked");
            function chgDefaultSendaddress() {setValue("email_sendaddress", $('#ctl00_ContentBody_SendMessagePanel1_chkSendAddress')[0].checked);}
            function chgDefaultMailcopy() {setValue("email_mailcopy", $('#ctl00_ContentBody_SendMessagePanel1_chkEmailCopy')[0].checked);}
            $('#ctl00_ContentBody_SendMessagePanel1_chkSendAddress')[0].addEventListener("click", chgDefaultSendaddress, false);
            $('#ctl00_ContentBody_SendMessagePanel1_chkEmailCopy')[0].addEventListener("click", chgDefaultMailcopy, false);
            // Grab mail template from URL.
            var matches = document.location.href.match(/&text=(.*)/);
            if (matches && matches[1]) {
                $('#ctl00_ContentBody_SendMessagePanel1_tbMessage')[0].innerHTML = decodeURIComponent(matches[1]);
            // Build mail template.
            } else {
                template = buildSendTemplate().replace(/#Receiver#/ig, $('#ctl00_ContentBody_SendMessagePanel1_lblEmailInfo')[0].children[0].innerHTML);
                $('#ctl00_ContentBody_SendMessagePanel1_tbMessage')[0].innerHTML = template;
            }
        } catch(e) {gclh_error("Improve Mail:",e);}
    }

// Improve Message.
    if (settings_show_message && is_page("messagecenter")) {
        try {
            var val = "";
            var matches = document.location.href.match(/&text=(.*)/);
            if (matches && matches[1]) val = decodeURIComponent(matches[1]);
            updateMessage(0);
            function updateMessage(waitCount) {
                if ($('textarea')[0] && $('textarea')[0].value == "" && $('#cpMsgLogHead .h5')[0].innerHTML != "") {
                    if (val == "") {
                        var rec = decode_innerHTML($('#cpMsgLogHead .h5')[0]);
                        rec = rec.replace(/^(\s*)/,'').replace(/(\s*)$/,'');
                        val = buildSendTemplate().replace(/#Receiver#/ig, rec);
                    }
                    $('textarea')[0].value = val;
                }
                waitCount++;
                if (waitCount <= 600) setTimeout(function(){updateMessage(waitCount);}, 100);
            }
        } catch(e) {gclh_error("Improve Message:",e);}
    }

// Improve list of pocket queries (list of PQs).
    if (document.location.href.match(/\.com\/pocket/) && document.getElementById("uxCreateNewPQ") && $('table.Table')[0]) {
        try {
            var css = "";
            // Compact layout.
            if (settings_compact_layout_list_of_pqs) {
                function lastGen(elem) {
                    elem.title = trim(elem.innerHTML);
                    elem.innerHTML = "Last Generated";
                    elem.style.whiteSpace = "nowrap";
                }
                // Header:
                css += ".pq-info-wrapper {margin: 0; padding: 10px 0 0 0; background-color: unset; box-shadow: unset;} .pq-info-wrapper p:last-child {padding: 0;}";
                css += "#Content .ui-tabs {margin-top: 3.4em;} .ui-tabs-active {box-shadow: 2px 0px 0 rgba(0,0,0,.2);} .ui-tabs .ui-tabs-nav li {margin-right: 4px;}";
                css += ".Success {margin: 5px 0 0 0;} #Tabs {box-shadow: 2px 2px 0 rgba(0,0,0,.2);}";
                css += ".BreadcrumbWidget p {margin-top: 0;}";
                if ($('#ctl00_ContentBody_lbHeading').length > 0 && $('#divContentMain h2').length > 0) {
                    var h3 = document.createElement("h3");
                    $('#ctl00_ContentBody_lbHeading')[0].parentNode.parentNode.insertBefore(h3, $('#ctl00_ContentBody_lbHeading')[0].parentNode);
                    $('#divContentMain h3').closest('h3').append($('#ctl00_ContentBody_lbHeading').remove().get().reverse());
                    $('#divContentMain h2')[0].closest('h2').remove();
                }
                if ($('.pq-info-wrapper')[0] && $('.pq-info-wrapper')[0].children.length > 2) {
                    for (var i = 0; i <= 2; i++) {$('.pq-info-wrapper')[0].children[0].remove();}
                }
                $('#ActivePQs, #DownloadablePQs').each(function() {this.children[0].setAttribute("style", "margin: -25px 2px 0 0; float: right;");});
                // Table active PQs:
                css += "table {margin-bottom: 0;} table.Table, table.Table th, table.Table td {padding: 5px; border: 1px solid #fff;}";
                css += "table.Table tr {line-height: 16px;} table.Table th img, table.Table td img {vertical-align: sub;}";
                if ($('#pqRepeater thead tr').length > 0 && $('#pqRepeater thead tr')[0].children.length > 12) {
                    lastGen($('#pqRepeater thead tr')[0].children[12]);
                    $('#pqRepeater thead tr th').each(function() {this.style.width = "unset";});
                }
                if ($('#pqRepeater tbody tr').length > 0 && $('#pqRepeater tbody tr')[0] && $('#pqRepeater tbody tr')[0].children.length > 0) {
                    for (var i = 0; i < $('#pqRepeater tbody tr').length; i++) {
                        if ($('#pqRepeater tbody tr')[i].className == "TableFooter") break;
                        for (var j = 0; j < $('#pqRepeater tbody tr')[0].children.length; j++) {
                            if (j != 3) $('#pqRepeater tbody tr')[i].children[j].style.whiteSpace = "nowrap";
                        }
                    }
                }
                // Table My Finds:
                css += "#ctl00_ContentBody_PQListControl1_tblMyFinds tbody tr th {border: unset;}";
                if ($('#ctl00_ContentBody_PQListControl1_tblMyFinds tbody tr').length > 1 && $('#pqRepeater thead tr')[0].children.length > 12) {
                    lastGen($('#ctl00_ContentBody_PQListControl1_tblMyFinds tbody tr')[0].children[1]);
                    var wo = ($('#pqRepeater thead tr')[0].children[12].clientWidth / $('#pqRepeater thead tr')[0].clientWidth * 100) + 0.96;
                    $('#ctl00_ContentBody_PQListControl1_tblMyFinds tbody tr')[0].children[1].style.width = wo + "%";
                    $('#ctl00_ContentBody_PQListControl1_tblMyFinds tbody tr')[1].children[0].children[1].remove();
                    $('#ctl00_ContentBody_PQListControl1_tblMyFinds tbody tr')[1].children[0].children[0].remove();
                    $('#ctl00_ContentBody_PQListControl1_tblMyFinds tbody tr')[1].children[0].children[0].style.margin = "0";
                }
                if ($('#ctl00_ContentBody_PQListControl1_btnScheduleNow').length > 0) {
                    if ($('#ctl00_ContentBody_PQListControl1_btnScheduleNow').prop("disabled")) {
                        $('#ctl00_ContentBody_PQListControl1_btnScheduleNow')[0].parentNode.parentNode.innerHTML = "<a style='opacity: 0.4; cursor: default' title='\"My Finds\" pocket query can only run once every 3 days'>Add to Queue</a>";
                    } else {
                        $('#ctl00_ContentBody_PQListControl1_btnScheduleNow')[0].parentNode.parentNode.innerHTML = "<a href='javascript:__doPostBack(\"ctl00$ContentBody$PQListControl1$btnScheduleNow\",\"\")' title='Add \"My Finds\" pocket query to Queue'>Add to Queue</a>";
                    }
                }
                // Table downloadable PQs (additional):
                if ($('#uxOfflinePQTable thead tr').length > 0) lastGen($('#uxOfflinePQTable thead tr')[0].children[5]);
                if ($('#uxOfflinePQTable tbody tr').length > 0) $('#uxOfflinePQTable tbody tr').each(function() {if (this.children[5]) this.children[5].style.whiteSpace = "nowrap";});
                if ($('#ctl00_ContentBody_PQListControl1_lbFoundGenerated').length > 0) {
                    $('#ctl00_ContentBody_PQListControl1_lbFoundGenerated')[0].innerHTML = $('#ctl00_ContentBody_PQListControl1_lbFoundGenerated')[0].innerHTML.replace(/\*/, "");
                }
                // Footer:
                if ($('.pq-legend').length > 0) {
                    for (var i = 0; i <= 4; i++) {$('.pq-legend')[0].nextElementSibling.remove();}
                    $('.pq-legend')[0].remove();
                }
            }
            // Refresh button.
            var refreshButton = document.createElement("p");
            refreshButton.innerHTML = "<a href='/pocket/default.aspx' title='Refresh Page'>Refresh Page</a>";
            if (settings_compact_layout_list_of_pqs) $('.TableFooter').each(function() {this.lastElementChild.innerHTML = refreshButton.innerHTML;});
            else document.getElementById('uxCreateNewPQ').parentNode.parentNode.parentNode.appendChild(refreshButton);
            // Highlight column of current day.
            var matches = document.getElementById('ActivePQs').childNodes[1].innerHTML.match(/([A-Za-z]*),/);
            if (matches) {
                var highlight = 0;
                switch (matches[1]) {
                    case "Sunday"   : highlight = 5; break;
                    case "Monday"   : highlight = 6; break;
                    case "Tuesday"  : highlight = 7; break;
                    case "Wednesday": highlight = 8; break;
                    case "Thursday" : highlight = 9; break;
                    case "Friday"   : highlight = 10; break;
                    case "Saturday" : highlight = 11; break;
                }
                if (highlight > 0) {
                    var trs = $('#pqRepeater tbody tr:not(.TableFooter)');
                    for (var i = 0; i < trs.length; i++) {trs[i].children[highlight].style.backgroundColor = "#ede5dc";}
                }
            }
            // Fixed header.
            if (settings_fixed_pq_header && document.getElementById("pqRepeater") && !settings_compact_layout_list_of_pqs) {
                // Scrolify based on http://stackoverflow.com/questions/673153/html-table-with-fixed-headers.
                function scrolify(tblAsJQueryObject, height) {
                    var oTbl = window.$(tblAsJQueryObject);
                    var oTblDiv = window.$("<div/>");
                    oTblDiv.css('height', height);
                    oTblDiv.css('overflow-y', 'auto');
                    oTblDiv.css("margin-bottom", oTbl.css("margin-bottom"));
                    oTbl.css("margin-bottom", "0px");
                    oTbl.wrap(oTblDiv);
                    // Width korrigieren.
                    oTbl.find('thead tr th')[1].style.width = '20px';
                    oTbl.find('thead tr th')[oTbl.find('thead tr th').length-1].style.width = '120px';
                    // Save original width.
                    oTbl.attr("data-item-original-width", oTbl.width());
                    oTbl.find('thead tr td').each(function() {
                        window.$(this).attr("data-item-original-width", (unsafeWindow || window).$(this).width());
                    });
                    oTbl.find('tbody tr:eq(0) td').each(function() {
                        window.$(this).attr("data-item-original-width", (unsafeWindow || window).$(this).width());
                    });
                    // Clone the original table.
                    var newTbl = oTbl.clone();
                    // Remove table header from original table.
                    oTbl.find('thead tr').remove();
                    // Remove table body from new table.
                    newTbl.find('tbody tr').remove();
                    // Integrate changes.
                    oTbl.parent().before(newTbl);
                    newTbl.wrap("<div/>");
                    // Replace ORIGINAL COLUMN width.
                    newTbl.width(newTbl.attr('data-item-original-width'));
                    newTbl.find('thead tr td').each(function() {
                        window.$(this).width(window.$(this).attr("data-item-original-width"));
                    });
                    oTbl.width(oTbl.attr('data-item-original-width'));
                    oTbl.find('tbody tr:eq(0) td').each(function() {
                        window.$(this).width(window.$(this).attr("data-item-original-width"));
                    });
                }
                scrolify(unsafeWindow.$('#pqRepeater'), 300);
                unsafeWindow.$('#ActivePQs').css("padding-right", "0px");
            }
            appendCssStyle(css);
        } catch(e) {gclh_error("Improve list of PQs:",e);}
    }

// Show Log It button.
    if (settings_show_log_it && document.location.href.match(/\.com\/(seek\/nearest\.aspx\?|my\/recentlyviewedcaches\.aspx)/)) {
        try {
            var links = document.getElementsByTagName("a");
            for (var i = 0; i < links.length; i++) {
                if (links[i].href.match(/^https?:\/\/www\.geocaching\.com\/seek\/cache_details\.aspx\?.*/) && links[i].innerHTML.match(/^<span>/)) {
                    links[i].parentNode.innerHTML = links[i].parentNode.innerHTML.replace("<br>", "<a title='Log it' href='" + links[i].href.replace("cache_details", "log") + "'><img src='/images/stockholm/16x16/add_comment.gif'></a><br>");
                } else if (links[i].href.match(/^https?:\/\/www\.geocaching\.com\/geocache\/.*/) && links[i].innerHTML.match(/^<span>/)) {
                    var match = links[i].href.match(/^https?:\/\/www\.geocaching\.com\/geocache\/([^_]*)/);
                    links[i].parentNode.innerHTML = links[i].parentNode.innerHTML.replace("<br>", "<a title='Log it' href='/seek/log.aspx?wp=" + match[1] + "'><img src='/images/stockholm/16x16/add_comment.gif'></a><br>");
                }
            }
        } catch(e) {gclh_error("Show Log It button:",e);}
    }

// Improve pocket queries, nearest lists, recently viewed. Compact layout, favorites percentage.
    if (settings_compact_layout_pqs && document.location.href.match(/\.com\/seek\/nearest\.aspx\?pq=/)) var li0 = "p";
    else if (settings_compact_layout_nearest && document.location.href.match(/\.com\/seek\/nearest\.aspx\?/)) var li0 = "n";
    else if (settings_compact_layout_recviewed && document.location.href.match(/\.com\/my\/recentlyviewedcaches\.aspx/)) var li0 = "r";
    if (li0) {
        try {
            var css = "";
            // Compact layout:
            // Header.
            css += ".InformationWidget ul#UtilityNav li {padding: 6px 0 0 0;} .InformationWidget ul#UtilityNav li a {padding: 0; border: none; margin: 0 0 0 5px;}";
            css += ".InformationWidget {margin: 0; line-height: 1em;} .left {margin: 0; padding: 4px 0;}";
            css += "#ctl00_ContentBody_LocationPanel1_OriginLabel span {font-weight: bold; color: #594a42; font-size: 1em; margin-right: 10px;}";
            css += "#ctl00_ContentBody_LocationPanel1_OriginLabel a {margin-right: 5px;}";
            css += "#ctl00_ContentBody_ResultsPanel > div:nth-child(1) {margin: 0 !important; padding: 4px 0;}";  // GC Tour
            var h3 = document.createElement("h3");
            h3.setAttribute("style", "padding-bottom: 8px");
            if ($('#ctl00_ContentBody_SearchResultText').length > 0 && $('#divContentMain h2').length > 0) {
                $('#ctl00_ContentBody_SearchResultText')[0].parentNode.parentNode.insertBefore(h3, $('#ctl00_ContentBody_SearchResultText')[0].parentNode);
                $('#divContentMain h3').closest('h3').append($('#ctl00_ContentBody_SearchResultText').remove().get().reverse());
                $('#divContentMain h2')[0].closest('h2').remove();
            }
            if (document.location.href.match(/recentlyviewed/) && $('.BottomSpacing')[0] && $('.BreadcrumbWidget')[0]) {
                css += ".TopSpacing, .TopSpacing p {margin-top: 4px; margin-bottom: 4px;} hr {margin-bottom: 15px;}";
                h3.innerHTML = $('.BottomSpacing')[0].innerHTML;
                $('.BottomSpacing')[0].parentNode.insertBefore(h3, $('.BottomSpacing')[0]);
                $('.BottomSpacing')[0].remove();
                $('.BreadcrumbWidget')[0].remove();
            }
            if ($('#ctl00_ContentBody_LocationPanel1_OriginLabel').length > 0) {
                var span = document.createElement("span");
                span.innerHTML = $('#ctl00_ContentBody_LocationPanel1_OriginLabel')[0].childNodes[0].data;
                if ($('#ctl00_ContentBody_LocationPanel1_OriginLabel')[0].children.length > 0) {
                    $('#ctl00_ContentBody_LocationPanel1_OriginLabel')[0].children[0].parentNode.insertBefore(span, $('#ctl00_ContentBody_LocationPanel1_OriginLabel')[0].children[0]);
                } else $('#ctl00_ContentBody_LocationPanel1_OriginLabel')[0].appendChild(span);
                $('#ctl00_ContentBody_LocationPanel1_OriginLabel')[0].childNodes[0].remove();
            }
            // Table.
            css += "table {margin-bottom: 0;} table.Table th, table.Table td {padding: 5px; border: 1px solid #fff; width: unset !important;}";
            css += "table.Table th, table.Table td:not(.Merge) {white-space: nowrap;} table.Table td.Merge {padding: 3px 5px;}";
            css += "table.Table tr {line-height: 14px;} table.Table img {vertical-align: sub;} table.Table .IconButton {display: unset; padding: 0;}";
            css += ".SearchResultsWptType {width: 24px; height: 24px;} .small {line-height: unset; margin-bottom: unset;}";
            css += ".gclh_empty {overflow: hidden; max-width: 9px;} .gclh_hideit {overflow: hidden; text-overflow: ellipsis; display: -moz-box;}";
            if (document.location.href.match(/recentlyviewed/)) {
                css += "table.Table tr:nth-child(1) {line-height: 19px;} .Success {background-color: #fff; color: #54b948 !important;}";
            }
            function newHeadcell(tr0, ch, desc) {
                var th = document.createElement("th");
                th.appendChild(document.createTextNode(desc));
                tr0.children[ch].parentNode.insertBefore(th, tr0.children[ch]);
            }
            if ($('table.SearchResultsTable tbody tr')[0] && $('table.SearchResultsTable tbody tr')[0].children.length > 8) {
                var tr0 = $('table.SearchResultsTable tbody tr')[0];
                newHeadcell(tr0, 9, "Y. Found");
                tr0.children[9].title = "Your Found";
                tr0.children[9].setAttribute("class", "gclh_empty");
                tr0.children[8].children[0].title = tr0.children[8].children[0].innerHTML;
                tr0.children[8].children[0].innerHTML = "Found";
                if (!document.location.href.match(/recentlyviewed/)) {
                    newHeadcell(tr0, 7, "Size");
                    tr0.children[7].setAttribute("class", "AlignCenter");
                }
                for (var i = 0; i <= 4; i += 2) {tr0.children[6].childNodes[i].data = tr0.children[6].childNodes[i].data.replace(/(\(|\))/g, "");}
                tr0.children[6].setAttribute("class", "AlignCenter");
            }
            function newContentcell(trDataNew, chil, content, clas, obj) {
                var td = document.createElement("td");
                if (obj) td.appendChild(content);
                else td.appendChild(document.createTextNode(content));
                td.setAttribute("class", clas);
                trDataNew.children[chil].parentNode.insertBefore(td, trDataNew.children[chil]);
            }
            if ($('table.SearchResultsTable tbody tr.Data').length > 0) {
                $('table.SearchResultsTable tbody tr.Data td:not(.Merge)').each(function() {
                    if (this.innerHTML.match(/<br>/i)) this.innerHTML = this.innerHTML.replace(/<br>/ig," ");
                });
                var trData = $('table.SearchResultsTable tbody tr.Data');
                for (var i = 0; i < trData.length; i++) {
                    // Last Found and new column Your Found.
                    if (trData[i].children[9].children[0].children[0] && trData[i].children[9].children[0].children[0].id.match("_uxUserLogDate")) {
                        newContentcell(trData[i], 10, trData[i].children[9].children[0].children[0], "small", true);
                    } else if (trData[i].children[9].children[0].children[1] && trData[i].children[9].children[0].children[1].id.match("_uxUserLogDate")) {
                        newContentcell(trData[i], 10, trData[i].children[9].children[0].children[1], "small", true);
                    } else newContentcell(trData[i], 10, "", "small", false);
                    // D/T and new column Size.
                    if (!document.location.href.match(/recentlyviewed/)) {
                        trData[i].children[7].childNodes[4].remove();
                        trData[i].children[7].childNodes[2].remove();
                        newContentcell(trData[i], 8, trData[i].children[7].children[1], "", true);
                        trData[i].children[8].children[0].setAttribute("style", "vertical-align: bottom;");
                    }
                    // Description.
                    trData[i].children[5].children[(settings_show_log_it ? 3:2)].setAttribute("class", "small gclh_hideit");
                    trData[i].children[5].children[(settings_show_log_it ? 3:2)].title = trData[i].children[5].children[(settings_show_log_it ? 3:2)].innerHTML.replace(/(\s{2,})/g, " ").replace(/^\s/, "");
                }
            }
            // Footer.
            css += "#ctl00_ContentBody_ResultsPanel > div:nth-child(5) {margin: 0 !important; padding: 4px 0;}";  // GC Tour
            css += ".span-10 {width: 100% !important;}";
            if ($('#ctl00_ContentBody_chkHighlightBeginnerCaches').length > 0 && $('#Download').length > 0 && $('#chkAll').length > 0) {
                $('#ctl00_ContentBody_chkHighlightBeginnerCaches')[0].parentNode.parentNode.parentNode.insertBefore($('#chkAll')[0].parentNode, $('#ctl00_ContentBody_chkHighlightBeginnerCaches')[0].parentNode.parentNode);
                $('#chkAll')[0].parentNode.appendChild($('#Download')[0]);
                $('#Download')[0].parentNode.className = "gclh_last_line";
                while ($('.gclh_last_line')[0].nextElementSibling) {$('.gclh_last_line')[0].nextElementSibling.remove();}
            }
            if ($('#ctl00_ContentBody_KeyPanel').length > 0) {
                while ($('#ctl00_ContentBody_KeyPanel')[0].nextElementSibling) {$('#ctl00_ContentBody_KeyPanel')[0].nextElementSibling.remove();}
                $('#ctl00_ContentBody_KeyPanel')[0].remove();
            }
            // Favorites percentage:
            if ((settings_fav_proz_pqs && li0 == "p") || (settings_fav_proz_nearest && li0 == "n") || (settings_fav_proz_recviewed && li0 == "r")) {
                var url = (li0 == "r" ? "recentlyviewedcaches.aspx/FavoriteScore" : "nearest.aspx/FavoriteScore");
                css += "span.favorite-rank, .gclh_favPerc {font-size: .85em; float: right;}";
                $('#ctl00_ContentBody_dlResults_ctl00_uxSort_Favorites, #ctl00_ContentBody_RecentlyViewedCachesList1_dlDetailResults_ctl00_uxSort_Favorites').closest('th').after('<th class="AlignCenter" title="Favorites percentage">%</th>');
                $('a.favoriteTotal').each(function() {
                    var fav = $(this);
                    fav[0].children[0].title = "Favorites";
                    fav.closest('td').after('<td class="AlignRight gclh_favPerc" title="Favorites percentage"></td>');
                    $.ajax({
                        url: url,
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({ dto: { data: fav.data("id"), ut: 2, p: $(fav.children().get(0)).html() } }),
                        dataType: 'json',
                        success: function (result) {
                            fav[0].closest('td').nextElementSibling.innerHTML = (result.d.score ? (result.d.score > 100 ? 100 : result.d.score) : 0);
                        }
                    })
                });
            }
            appendCssStyle(css);
        } catch(e) {gclh_error("Improve PQs ... :",e);}
    }

// Pocket query set default value for new one, set warning message.
    if (document.location.href.match(/\.com\/pocket\/gcquery\.aspx/)) {
        try {
            var idCB = "#ctl00_ContentBody_";
            var idOp = "#ctl00_ContentBody_cbOptions_";
            var idDa = "#ctl00_ContentBody_cbDays_";
            if (($("p.Success").length <= 0) && (document.location.href.match(/\.com\/pocket\/gcquery\.aspx$/) || document.location.href.match(/\.com\/pocket\/gcquery\.aspx\/ll=/))) {
                if (settings_pq_set_cachestotal) $(idCB+"tbResults").val(settings_pq_cachestotal);
                if (settings_pq_option_ihaventfound) {
                    $(idOp+"0").prop('checked', true);
                    $(idOp+"1").prop('checked', false);
                }
                if (settings_pq_option_idontown) {
                    $(idOp+"2").prop('checked', true);
                    $(idOp+"3").prop('checked', false);
                }
                if (settings_pq_option_ignorelist) $(idOp+"6").prop('checked', true);
                if (settings_pq_option_isenabled) {
                    $(idOp+"13").prop('checked', true);
                    $(idOp+"12").prop('checked', false);
                }
                if (settings_pq_option_filename) $(idCB+"cbIncludePQNameInFileName").prop('checked', true);
                if (settings_pq_set_difficulty) {
                    $(idCB+"cbDifficulty").prop('checked', true);
                    $(idCB+"ddDifficulty").val(settings_pq_difficulty);
                    $(idCB+"ddDifficultyScore").val(settings_pq_difficulty_score);
                }
                if (settings_pq_set_terrain) {
                    $(idCB+"cbTerrain").prop('checked', true);
                    $(idCB+"ddTerrain").val(settings_pq_terrain);
                    $(idCB+"ddTerrainScore").val(settings_pq_terrain_score);
                }
                if (settings_pq_automatically_day) {
                    var time = $(idCB+'QueryPanel legend').first().text();
                    if (time.match(/.*Sunday.*/))         $(idDa+"0").prop('checked', true);
                    else if (time.match(/.*Monday.*/))    $(idDa+"1").prop('checked', true);
                    else if (time.match(/.*Tuesday.*/))   $(idDa+"2").prop('checked', true);
                    else if (time.match(/.*Wednesday.*/)) $(idDa+"3").prop('checked', true);
                    else if (time.match(/.*Thursday.*/))  $(idDa+"4").prop('checked', true);
                    else if (time.match(/.*Friday.*/))    $(idDa+"5").prop('checked', true);
                    else if (time.match(/.*Saturday.*/))  $(idDa+"6").prop('checked', true);
                }
            }
            if (settings_pq_warning) {
                $(idCB+"cbOptions").after("<div id='warning' style='display: none; border: 1px solid #dfdf80; background-color: #ffffa5; padding: 10px;'><div style='float: left'><img src='/play/app/ui-icons/icons/global/attention.svg'></div><div>&nbsp;&nbsp;One or more options are in conflict and creates an empty result set. Please change your selection.</div></div>");
                for (var i=0; i<=13; i++) {$(idOp+i).change(verifyPqOpt);}
                verifyPqOpt();
            }
        } catch(e) {gclh_error("Pocket query set defaults, set warning:",e);}
    }
    // Marks two PQ options, which are in rejection.
    function markOptInRej(opt1, opt2) {
        var st = "ctl00_ContentBody_cbOptions_";
        if ($("#"+st+opt1).is(':checked') && $("#"+st+opt2).is(':checked')) {
            $("label[for='"+st+opt1+"'], label[for='"+st+opt2+"']").css('background-color','#ffff00');
            $("label[for='"+st+opt1+"'], label[for='"+st+opt2+"']").css('color','#ff0000');
            return true;
        } else {
            $("label[for='"+st+opt1+"'], label[for='"+st+opt2+"']").css('background-color','#ffffff');
            $("label[for='"+st+opt1+"'], label[for='"+st+opt2+"']").css('color','#000000');
            return false;
        }
    }
    // Find PQ options, which are in rejection.
    function verifyPqOpt() {
        var status = false;
        status = status | markOptInRej("0", "1");  // I haven't found / I have found
        status = status | markOptInRej("2", "3");  // I don't vs. own I own
        status = status | markOptInRej("4", "5");  // Are available to all users vs. Are for members only
        status = status | markOptInRej("8", "9");  // Found in the last 7 days vs. Have not been found
        status = status | markOptInRej("12", "13");  // Is Disabled vs. is Enabled
        if (status) $("#warning").show();
        else $("#warning").hide();
    }

// Map on create pocket query page.
    if (document.location.href.match(/\.com\/pocket\/gcquery\.aspx/)) {
        try {
            $('.LatLongTable').after('<img style="position:absolute;top: 8px; left: 300px;height:350px;width:470px;" id="gclh_map">').parent().css("style", "relative");
            $('#ctl00_ContentBody_rbOriginNone').closest('fieldset')[0].id = "gclh_Origin";
            $('.LatLongTable input, #gclh_Origin').change(function() {
                var coordType = document.getElementsByName("ctl00$ContentBody$LatLong")[0].value;
                var northField = $('#ctl00_ContentBody_LatLong\\:_selectNorthSouth')[0];
                var northSouth = $(northField.options[northField.selectedIndex]).text().replace('.', '');
                var westField = $('#ctl00_ContentBody_LatLong\\:_selectEastWest')[0];
                var westEast = $(westField.options[westField.selectedIndex]).text().replace('.', '');
                var lat = "";
                var lng = "";
                switch (coordType) {
                    case "2":  //DMS
                        lat = northSouth + " " + $('#ctl00_ContentBody_LatLong__inputLatDegs')[0].value + " " + $('#ctl00_ContentBody_LatLong__inputLatMins')[0].value + ' ' + $('#ctl00_ContentBody_LatLong__inputLatSecs')[0].value;
                        lng = westEast + " " + $('#ctl00_ContentBody_LatLong__inputLongDegs')[0].value + " " + $('#ctl00_ContentBody_LatLong__inputLongMins')[0].value + ' ' + $('#ctl00_ContentBody_LatLong__inputLongSecs')[0].value;
                        var converted = toDec(lat + " " + lng);
                        lat = converted[0];
                        lng = converted[1];
                        break;
                    case "1":  //MinDec
                        lat = northSouth + " " + $('#ctl00_ContentBody_LatLong__inputLatDegs')[0].value + " " + $('#ctl00_ContentBody_LatLong__inputLatMins')[0].value;
                        lng = westEast + " " + $('#ctl00_ContentBody_LatLong__inputLongDegs')[0].value + " " + $('#ctl00_ContentBody_LatLong__inputLongMins')[0].value;
                        var converted = toDec(lat + " " + lng);
                        lat = converted[0];
                        lng = converted[1];
                        break;
                    case "0":  //DegDec
                        lat = (northSouth == "S" ? "-" : "") + $('#ctl00_ContentBody_LatLong__inputLatDegs')[0].value;
                        lng = (westEast == "W" ? "-" : "") + $('#ctl00_ContentBody_LatLong__inputLongDegs')[0].value;
                        break;
                }
                if (!$('#ctl00_ContentBody_rbOriginWpt')[0].checked) lat = lng = "";
                $('#gclh_map').attr("src", 'http://staticmap.openstreetmap.de/staticmap.php?center=' + lat + ',' + lng + '&zoom=15&size=450x350&markers=' + lat + ',' + lng + ',ol-marker');
            });
            $('.LatLongTable input').change();
        } catch(e) {gclh_error("Map on create pocket query page:",e);}
    }

// Name for PQ from bookmark.
    if ((document.location.href.match(/\.com\/pocket\/bmquery\.aspx/)) && $('#ctl00_ContentBody_lnkListName')[0]) {
        try {
            if ($('#ctl00_ContentBody_tbName')[0].value == "") $('#ctl00_ContentBody_tbName')[0].value = $('#ctl00_ContentBody_lnkListName')[0].innerHTML;
            $('#ctl00_ContentBody_cbIncludePQNameInFileName')[0].checked = true;
        } catch(e) {gclh_error("Name for PQ from bookmark:",e);}
    }

// Improve list of bookmark lists.
    if (document.location.href.match(/\.com\/(bookmarks\/default|my\/lists)\.aspx/) && !document.location.href.match(/&WptTypeID=/) && $('table.Table')[0]) {
        try {
            var css = "";
            // Compact layout.
            if (settings_compact_layout_list_of_bm_lists) {
                // Header:
                css += ".ListManagementFavoritesWidget, .ListsManagemntWatchlistWidget {margin: 0 0 1.5em; padding: 0.5em;}";
                css += ".BreadcrumbWidget p {margin-top: 0;} .span-20.last p:nth-child(1) {margin-bottom: 0}";
                $('#divContentMain div h2').first().remove();
                $('#divContentMain p.NoBottomSpacing').first().remove();
                $('#divContentMain div h3').first().closest('div').remove();
                $('#ctl00_ContentBody_hlCreateNewBookmarkList').closest('p').prop("style", "margin: 0 0 0.5em");
                // Table:
                css += "table.Table tr {line-height: 16px;} table.Table th, table.Table td {border: 1px solid #fff;}";
                css += "table.Table td, table.Table td a {vertical-align: top !important;} table.Table td img {vertical-align: top !important; padding-right: 8px;}";
                $('table.Table thead tr')[0].children[1].innerHTML = "Status";
                $('table.Table thead tr')[0].children[5].innerHTML = "PQ";
                $('table.Table thead tr')[0].children[6].innerHTML = "KML";
                var lines = $('table.Table tbody tr');
                for (var i = 0; i < lines.length; i++) {
                    while (lines[i].children[2].childNodes[2]) {lines[i].children[2].childNodes[2].remove();}
                    lines[i].children[1].style.whiteSpace = "nowrap";
                    lines[i].children[4].style.whiteSpace = "nowrap";
                    lines[i].children[4].children[0].innerHTML = '<img src="/images/icons/16/edit.png" alt="Edit">';
                    lines[i].children[4].children[1].innerHTML = '<img src="/images/icons/16/watch.png" alt="View">';
                    lines[i].children[4].children[2].innerHTML = '<img src="/images/icons/16/delete.png" alt="Delete">';
                    lines[i].children[4].childNodes[4].remove();
                    lines[i].children[4].childNodes[2].remove();
                    lines[i].children[5].children[0].innerHTML = '<img src="/images/icons/16/bookmark_pq.png" alt="Create PQ">';
                    lines[i].children[6].children[0].innerHTML = '<img src="/images/icons/16/download.png" alt="Download">';
                }
                // Footer:
                $('#divContentMain div ul').first().remove();
            }
            appendCssStyle(css);
        } catch(e) {gclh_error("Improve list of bookmark lists:",e);}
    }

// Improve bookmark lists.
    if (document.location.href.match(/\.com\/bookmarks\/(view\.aspx\?guid=|bulk\.aspx\?listid=|view\.aspx\?code=)/) && document.getElementById('ctl00_ContentBody_ListInfo_cboItemsPerPage')) {
        try {
            var css = "";
            // Prepare button corrected coords.
            if ($('#ctl00_ContentBody_btnAddBookmark')[0]) var corrCoords = '<input type="button" id="gclh_linkCorrCoords" href="javascript:void(0);" title="Mark Caches with Corrected Coordinates" value="Mark Caches with Corr. Coords">';
            // Prepare link "Download as kml".
            if (document.location.href.match(/guid=([a-zA-Z0-9-]*)/)) {
                var matches = document.location.href.match(/guid=([a-zA-Z0-9-]*)/);
                if (matches && matches[1]) {
                    var uuidx = matches[1];
                    var kml = "<a title=\"Download Google Earth kml\" href='/kml/bmkml.aspx?bmguid=" + uuidx + "' style='vertical-align: bottom;'>Download as kml</a>";
                }
            }
            // Compact layout.
            if (settings_compact_layout_bm_lists) {
                // Prepare button hide longtext.
                if ($('#ctl00_ContentBody_btnAddBookmark')[0]) var hideLt = '<input type="button" id="gclh_hideLtBm" href="javascript:void(0);" title="Show/hide Longtext in Bookmark" value="Hide Text">';
                // Header:
                css += "#ctl00_ContentBody_lbHeading a {font-weight: normal; font-size: 13px; margin-left: 10px;}";
                css += "#ctl00_ContentBody_QuickAdd {margin-bottom: 1px; float: left; position: relative;} #ctl00_ContentBody_btnAddBookmark {margin-top: 1px; margin-left: -1px;}";
                css += "#ctl00_ContentBody_ListInfo_uxAbuseReport > div:nth-child(1) {margin: 0 !important; padding: 4px 0;}";  // GC Tour
                if ($('#ctl00_ContentBody_lbHeading').length > 0 && $('#divContentMain h2').length > 0) {
                    var h3 = document.createElement("h3");
                    $('#ctl00_ContentBody_lbHeading')[0].parentNode.parentNode.insertBefore(h3, $('#ctl00_ContentBody_lbHeading')[0].parentNode);
                    $('#divContentMain h3').closest('h3').append($('#ctl00_ContentBody_lbHeading').remove().get().reverse());
                    $('#divContentMain h2')[0].closest('h2').remove();
                }
                if ($('#ctl00_ContentBody_QuickAdd').length > 0) {
                    css += "#divContentMain div.span-20.last {margin-top: -18px;}";
                    $('#ctl00_ContentBody_QuickAdd')[0].children[0].childNodes[1].remove();
                    $('#ctl00_ContentBody_QuickAdd')[0].children[0].childNodes[0].remove();
                }
                if ($('#ctl00_ContentBody_ListInfo_uxListOwner').length > 0) {
                    var LO = $('#ctl00_ContentBody_ListInfo_uxListOwner')[0].parentNode;
                    if (LO.nextElementSibling.nextElementSibling.innerHTML == "") LO.nextElementSibling.nextElementSibling.remove();
                    else LO.nextElementSibling.nextElementSibling.style.marginBottom = "0";
                    if (LO.nextElementSibling.innerHTML == "") LO.nextElementSibling.remove();
                    else LO.nextElementSibling.style.marginBottom = "0";
                    LO.style.marginBottom = "0";
                    LO.innerHTML += "<span style='float: right; padding-right: 195px; margin-top: -7px;'>" + (uuidx ? kml+"&nbsp;" : "") + (corrCoords ? "&nbsp;"+corrCoords : "") + (hideLt ? "&nbsp;"+hideLt : "") + "</span>";
                }
                // Table:
                css += "table.Table tr {line-height: 16px;}";
                css += "table.Table th, table.Table td {border-left: 1px solid #fff; border-right: 1px solid #fff;} tr.BorderTop td {border-top: 1px solid #fff;}";
                css += "table.Table th {border-bottom: 2px solid #fff;} table.Table td, table.Table td img, table.Table td a {vertical-align: top !important;}";
                var lines = $('table.Table tbody').find('tr');
                for (var i = 0; i < lines.length; i += 2) {
                    if (!lines[i].className.match(/BorderTop/)) lines[i].className += " BorderTop";
                    lines[i].children[1].childNodes[3].outerHTML = "&nbsp;&nbsp;";
                    lines[i].children[1].style.whiteSpace = "nowrap";
                    if (lines[i].children[5]) lines[i].children[5].style.whiteSpace = "nowrap";
                    if (lines[i+1].children[1].innerHTML == "") lines[i+1].style.display = "table-column";
                }
                // Footer:
                $('#ctl00_ContentBody_ListInfo_btnDownload').closest('p').append($('#ctl00_ContentBody_btnCreatePocketQuery').remove().get().reverse());
                // Event, css hide longtext.
                if ($('#gclh_hideLtBm')[0]) $('#gclh_hideLtBm')[0].addEventListener("click", hideLtBm, false);
                css += ".gclh_hideBm {display: table-column;} .working {opacity: 0.3; cursor: default;}";
            // No compact layout, only build links.
            } else {
                $('#ctl00_ContentBody_lbHeading')[0].parentNode.parentNode.parentNode.childNodes[3].innerHTML += (uuidx ? "<br>"+kml : "") + (corrCoords ? "<br>"+corrCoords : "");
            }
            // Event, css corrected coords.
            if ($('#gclh_linkCorrCoords')[0]) $('#gclh_linkCorrCoords')[0].addEventListener("click", markCorrCoordForBm, false);
            css += ".cc_cell {text-align: center !important} .working {opacity: 0.3; cursor: default;}";
            appendCssStyle(css);
        } catch(e) {gclh_error("Improve bookmark lists:",e);}
    }
    // Mark caches with corrected coords.
    function markCorrCoordForBm() {
        if ($('#gclh_linkCorrCoords')[0].className == "working") return;
        $('#gclh_linkCorrCoords').addClass('working');
        var anzLines = $('table.Table tbody tr').length / 2;
        $('table.Table tbody tr').each(function() {
            if ($(this).find('td:nth-child(4) a')[0]) {
                var gccode = $(this).find('td:nth-child(4) a')[0].innerHTML;
                if (!$('#gclh_colCorrCoords')[0]) $(this).find('td:nth-child(5)').after('<td id="cc_'+gccode+'" class="cc_cell"></td>');
                else $('#cc_'+gccode)[0].innerHTML = "";
            } else {
                if (!$('#gclh_colCorrCoords')[0]) $(this).find('td:nth-child(2)').after('<td></td>');
                return;
            }
            $.get('https://www.geocaching.com/geocache/'+gccode, null, function(text){
                var corr_gccode = $(text).find('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode')[0].innerHTML;
                if (text.includes('"isUserDefined":true,"newLatLng"')) $('#cc_'+corr_gccode)[0].innerHTML = '<img title="Corrected Coordinates" alt="Corr. Coords" src="'+global_green_tick+'">';
                else $('#cc_'+corr_gccode)[0].innerHTML = '<img style="opacity: 0.8;" title="No Corrected Coordinates" alt="No Corr. Coords" src="'+global_red_tick+'">';
                anzLines--;
                if (anzLines == 0) $('#gclh_linkCorrCoords').removeClass('working');
            });
        });
        if (!$('#gclh_colCorrCoords')[0]) $('table.Table thead tr th:nth-child(5)').after('<th id="gclh_colCorrCoords" style="width: 90px;"><span title="Caches with Corrected Coordinates">Corr. Coords</span></th>');
    }
    // Show, hide Longtext.
    function hideLtBm() {
        if ($('#gclh_hideLtBm.working')[0]) return;
        $('#gclh_hideLtBm').addClass('working');
        setTimeout(function() {
            $('table.Table tbody tr[id$="_dataRow2"]').each(function() {
                if (!$('#gclh_hideLtBm.gclh_firstDone')[0] && !this.style.display) $(this).addClass('gclh_showHideBm');
                if (this.className.match("gclh_showHideBm")) this.classList.toggle('gclh_hideBm');
            });
            if (!$('#gclh_hideLtBm.gclh_firstDone')[0]) $('#gclh_hideLtBm').addClass('gclh_firstDone');
            $('#gclh_hideLtBm')[0].value = ($('.gclh_hideBm')[0] ? "Show Text" : "Hide Text");
            $('#gclh_hideLtBm').removeClass('working');
        }, 200);
    }

// Add buttons to bookmark lists and watchlist to select caches.
    var current_page;
    if (document.location.href.match(/\.com\/bookmarks/) && !document.location.href.match(/\.com\/bookmarks\/default/)) current_page = "bookmark";
    else if (document.location.href.match(/\.com\/my\/watchlist\.aspx/)) current_page = "watch";
    if (!!current_page) {
        try {
            var checkbox_selector = 'input[type=checkbox]';
            var table = $('table.Table').first();
            var rows = table.find('tbody tr');
            var checkboxes = table.find(checkbox_selector);
            if (table.length > 0 && rows.length > 0 && checkboxes.length > 0) {
                var button_wrapper = $('<td colspan="10">Select caches: </td>');
                var button_template = $('<a style="cursor:pointer; margin-right: 10px;" />');
                if (current_page == "bookmark") sums = sumsCreateFields(settings_show_sums_in_bookmark_lists);
                else sums = sumsCreateFields(settings_show_sums_in_watchlist);
                sumsCountAll();
                sumsSetEventsForCheckboxes(table.find('tbody tr').find(checkbox_selector));
                button_wrapper.append(button_template.clone().text('All').click(function() {
                    checkboxes.prop('checked', 'true');
                    sumsCountChecked_SelectionAll();
                }));
                sumsOutputFields(button_wrapper, "All");
                button_wrapper.append(button_template.clone().text('None').click(function() {
                    checkboxes.prop('checked', false);
                    sumsCountChecked_SelectionNone();
                }));
                button_wrapper.append(button_template.clone().text('Invert').click(function() {
                    checkboxes.each(function() {
                        this.checked = !this.checked;
                    });
                    sumsCountChecked_SelectionInvert();
                }));
                button_wrapper.append($('<span style="margin-right:10px">|</span>'));
                if (current_page !== "watch") {  // Hide on watchlist
                    button_wrapper.append(button_template.clone().text('Found').click(function() {
                        table.find('img[src*="found"]').closest('tr').find(checkbox_selector).each(function() {
                            this.checked = !this.checked;
                        });
                        sumsCountCheckedAll();
                    }));
                    sumsOutputFields(button_wrapper, "Found");
                }
                button_wrapper.append(button_template.clone().text('Archived').click(function() {
                    table.find('span.Strike.OldWarning,span.Strike.Warning').closest('tr').find(checkbox_selector).each(function() {
                        this.checked = !this.checked;
                    });
                    sumsCountCheckedAll();
                }));
                sumsOutputFields(button_wrapper, "Archived");
                button_wrapper.append(button_template.clone().text('Deactivated').click(function() {
                    table.find('span.Strike:not(.OldWarning,.Warning)').closest('tr').find(checkbox_selector).each(function() {
                        this.checked = !this.checked;
                    });
                    sumsCountCheckedAll();
                }));
                sumsOutputFields(button_wrapper, "Deactivated");
                var tfoot = $('<tfoot />').append($('<tr />').append(button_wrapper));
                table.append(tfoot);
                checkboxes.prop('checked', false);
                sumsChangeAllFields();
                if ($('#ctl00_ContentBody_WatchListControl1_uxWatchList_ctl00_uxChkAll')[0]) $('#ctl00_ContentBody_WatchListControl1_uxWatchList_ctl00_uxChkAll')[0].style.display = "none";
                if ($('#ctl00_ContentBody_ListInfo_uxUncheckAllImage')[0]) $('#ctl00_ContentBody_ListInfo_uxUncheckAllImage')[0].style.display = "none";
            }
        } catch(e) {gclh_error("Add buttons to bookmark list and watchlist:",e);}
    }
    // Summenfelder Anzahl Caches definieren, Configparameter setzen.
    function sumsCreateFields(configParameter) {
        var sums = new Object();
        sums["All"] = sums["chAll"] = sums["Found"] = sums["chFound"] = sums["Archived"] = sums["chArchived"] = sums["Deactivated"] = sums["chDeactivated"] = 0;
        sums["configParameter"] = configParameter;
      return sums;
    }
    // Anzahl Caches.
    function sumsCountAll() {
        if (sums["configParameter"] == false) return;
        sums["All"] = table.find('tbody tr').find(checkbox_selector).length;
        sums["Found"] = table.find('tbody tr').find('img[src*="found"]').length;
        sums["Archived"] = table.find('tbody tr').find('span.Strike.OldWarning,span.Strike.Warning').length;
        sums["Deactivated"] = table.find('tbody tr').find('span.Strike:not(.OldWarning,.Warning)').length;
    }
    // Events für Checkboxen setzen.
    function sumsSetEventsForCheckboxes(checkboxes) {
        if (sums["configParameter"] == false) return;
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].addEventListener("click", function() {sumsCountChecked_Click(this);} , false);
        }
    }
    // Platzhalter für Anzahl Caches.
    function sumsOutputFields(side, kind) {
        if (sums["configParameter"] == false) return;
        var out = document.createElement('span');
        out.setAttribute("style", "font-size: 85%; font-style: italic; margin-left: -6px; margin-right: 10px;");
        out.setAttribute("id", "sums_caches_" + kind);
        out.appendChild(document.createTextNode(""));
        side.append(out);
    }
    // Werte für Anzahl Caches ändern.
    function sumsChangeAllFields() {
        if (sums["configParameter"] == false) return;
        sumsChangeFields("All", sums["chAll"], sums["All"]);
        sumsChangeFields("Found", sums["chFound"], sums["Found"]);
        sumsChangeFields("Archived", sums["chArchived"], sums["Archived"]);
        sumsChangeFields("Deactivated", sums["chDeactivated"], sums["Deactivated"]);
    }
    function sumsChangeFields(kind, sums_ch, sums) {
        if (sums["configParameter"] == false) return;
        var outSums = "(" + sums_ch + "|" + sums + ")";
        var outTitle = sums_ch + " of " + sums + " caches selected";
        var outId = "sums_caches_" + kind;
        if (document.getElementById(outId)) {
            var side = document.getElementById(outId);
            side.setAttribute("title", outTitle);
            side.innerHTML = outSums;
        }
    }
    // Anzahl markierte Caches für Selektion All, None, Invert.
    function sumsCountChecked_SelectionAll() {
        if (sums["configParameter"] == false) return;
        sums["chAll"] = sums["All"];
        sums["chFound"] = sums["Found"];
        sums["chArchived"] = sums["Archived"];
        sums["chDeactivated"] = sums["Deactivated"];
        sumsChangeAllFields();
    }
    function sumsCountChecked_SelectionNone() {
        if (sums["configParameter"] == false) return;
        sums["chAll"] = sums["chFound"] = sums["chArchived"] = sums["chDeactivated"] = 0;
        sumsChangeAllFields();
    }
    function sumsCountChecked_SelectionInvert() {
        if (sums["configParameter"] == false) return;
        sums["chAll"] = sums["All"] - sums["chAll"];
        sums["chFound"] = sums["Found"] - sums["chFound"];
        sums["chArchived"] = sums["Archived"] - sums["chArchived"];
        sums["chDeactivated"] = sums["Deactivated"] - sums["chDeactivated"];
        sumsChangeAllFields();
    }
    // Anzahl markierte Caches für Click auf Checkbox.
    function sumsCountChecked_Click(checkbox) {
        if (checkbox.checked) sums["chAll"]++;
        else sums["chAll"]--;
        var cbId = checkbox.id;
        if ($('#'+cbId).closest('tr').find('img[src*="found"]').length > 0) {
            if (checkbox.checked) sums["chFound"]++;
            else sums["chFound"]--;
        }
        if ($('#'+cbId).closest('tr').find('span.Strike.OldWarning,span.Strike.Warning').length > 0) {
            if (checkbox.checked) sums["chArchived"]++;
            else sums["chArchived"]--;
        }
        if ($('#'+cbId).closest('tr').find('span.Strike:not(.OldWarning,.Warning)').length > 0) {
            if (checkbox.checked) sums["chDeactivated"]++;
            else sums["chDeactivated"]--;
        }
        sumsChangeAllFields();
    }
    // Anzahl markierter Caches für alles.
    function sumsCountCheckedAll() {
        if (sums["configParameter"] == false) return;
        sums["chAll"] = table.find('tbody tr').find(checkbox_selector + ':checked').length;
        sums["chFound"] = table.find('tbody tr').find('img[src*="found"]').closest('tr').find(checkbox_selector + ':checked').length;
        sums["chArchived"] = table.find('tbody tr').find('span.Strike.OldWarning,span.Strike.Warning').closest('tr').find(checkbox_selector + ':checked').length;
        sums["chDeactivated"] = table.find('tbody tr').find('span.Strike:not(.OldWarning,.Warning)').closest('tr').find(checkbox_selector + ':checked').length;
        sumsChangeAllFields();
    }

// Improve friends list.
    if (document.location.href.match(/\.com\/my\/myfriends\.aspx/)) {
        try {
            var friends = document.getElementsByClassName("FriendText");
            var day = new Date().getDate();
            var last_check = parseInt(getValue("friends_founds_last", "0"), 10);
            if (settings_automatic_friend_reset && last_check != day) {
                for (var i = 0; i < friends.length; i++) {
                    var friend = friends[i];
                    var name = friend.getElementsByTagName("a")[0];
                    if (getValue("friends_founds_new_" + name.innerHTML)) setValue("friends_founds_" + name.innerHTML, getValue("friends_founds_new_" + name.innerHTML));
                    if (getValue("friends_hides_new_" + name.innerHTML)) setValue("friends_hides_" + name.innerHTML, getValue("friends_hides_new_" + name.innerHTML));
                }
                setValue("friends_founds_last", day);
                var last_autoreset = getValue("friends_founds_last_autoreset");
                if (typeof(last_autoreset) != "undefined") setValue("friends_founds_last_reset", last_autoreset);
                setValue("friends_founds_last_autoreset", new Date().getTime());
            }
            var myf =
                 "a.myfriends:hover {" +
                 "  text-decoration:underline;}" +
                 "a.myfriends {" +
                 "  color:#00AA00;" +
                 "  text-decoration:none;}";
            appendCssStyle(myf);
            var sNewF = "";
            var sNewH = "";
            var myvips = getValue("vips", false);
            if (!myvips) myvips = new Array();
            else {
                myvips = myvips.replace(/, (?=,)/g, ",null");
                myvips = JSON.parse(myvips);
            }
            for (var i = 0; i < friends.length; i++) {
                var friend = friends[i];
                var name = friend.getElementsByTagName("a")[0];
                var add = "";
                // Founds.
                var founds = parseInt(trim(friend.getElementsByTagName("dd")[3].innerHTML).replace(/[,.]*/g, ""));
                if (isNaN(founds)) founds = 0;
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
                if (founds == 0) friend.getElementsByTagName("dd")[3].innerHTML = founds + "&nbsp;";
                else friend.getElementsByTagName("dd")[3].innerHTML = "<a href='/seek/nearest.aspx?ul=" + urlencode(name.innerHTML) + "&disable_redirect='>" + founds + "</a>&nbsp;" + add;
                // Hides.
                add = "";
                var hides = parseInt(trim(friend.getElementsByTagName("dd")[4].innerHTML).replace(/[,.]*/g, ""));
                if (isNaN(hides)) hides = 0;
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
                if (hides == 0) friend.getElementsByTagName("dd")[4].innerHTML = hides + "&nbsp;";
                else friend.getElementsByTagName("dd")[4].innerHTML = "<a href='/seek/nearest.aspx?u=" + urlencode(name.innerHTML) + "&disable_redirect='>" + hides + "</a>&nbsp;" + add;
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
                if (ld == 0) {
                   ld = new Date().getTime();
                   setValue("friends_founds_last_reset", ld);
                }
                spanT.className = "spanTclass";
                spanT.style.color = "gray";
                spanT.style.fontSize = "smaller";
                spanT.innerHTML = '<br>Last reset was ' + getDateDiffString(new Date().getTime(), ld) + ' ago (' + new Date(parseInt(ld, 10)).toLocaleString() + ')';
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
        } catch(e) {gclh_error("Improve friends list:",e);}
    }

// Improve drafts old page.
    if (document.location.href.match(/\.com\/my\/fieldnotes\.aspx/)) {
        try {
            // Mark duplicate drafts.
            var existingNotes = {};
            var link = null; var date = null; var type = null;
            $('.Table tr').each(function(i, e) {
                link = $(e).find('td a[href*="cache_details.aspx?guid"]');
                if (link.length > 0) {
                    date = $($(e).find('td')[2]).text();
                    type = $($(e).find('td')[3]).text();
                    if (existingNotes[link[0].href + date + type]) {
                        $(existingNotes[link[0].href + date + type]).find('td').css("background-color", "#FE9C9C");
                        $(e).find('td').css("background-color", "#FE9C9C");
                    } else existingNotes[link[0].href + date + type] = e;
                }
            });
            // Drafts auf alte Log Seite umbiegen.
            if (settings_fieldnotes_old_fashioned) {
                var link = $('table.Table tbody td a[href*="fieldnotes.aspx?composeLog=true"]');
                for (var i = 0; i < link.length; i++) {
                    var matches = link[i].href.match(/&draftGuid=(.*)&/i);
                    if (matches && matches[1]) link[i].href = "/seek/log.aspx?PLogGuid=" + matches[1];
                }
            }
            // Grüner Haken Kopfzeile.
            var desc = "Check/Uncheck all Items";
            var haken = '<a href="javascript:void(0);"><img id="#" src="/images/silk/tick.png" alt="'+desc+'" title="'+desc+'"></a>';
            $('table.Table thead th')[0].innerHTML = haken.replace("#","gclh_all_t");
            $('#gclh_all_t')[0].addEventListener("click", gclhSelAll, false);
            // Check/Uncheck all Items.
            var mark = false;
            function gclhSelAll() {
                mark = (mark == false ? true : false);
                var cbs = $('table.Table tbody tr input');
                for (var i = 0; i < cbs.length; i++) {cbs[i].checked = mark;}
            }
            // Summenzeile.
            function buildDraftSL() {
                var tr = document.createElement('tr');
                var t = '<td style="background-color: #DFE1D2;">';
                var html = t+ haken.replace("#","gclh_all_b") +'</td>'+t;
                for (src in types) {html += ' <img src="'+src+'"> '+types[src];}
                html += t+'<b>Statistics</b></td>'+t;
                for (src in stats) {html += ' <img src="'+src+'"> '+stats[src];}
                html += t+'Sum: '+count+'</td>';
                tr.innerHTML = html;
                return tr;
            }
            var imgs = $('table.Table tbody tr img');
            var stats = new Object();
            var types = new Object();
            var count = 0;
            for (var i = 0; i < imgs.length; i++) {
                if (imgs[i].src.match(/images\/logtypes/)) {
                    if (!stats[imgs[i].src]) stats[imgs[i].src] = 0;
                    stats[imgs[i].src]++;
                    count++;
                } else {
                    if (!types[imgs[i].src]) types[imgs[i].src] = 0;
                    types[imgs[i].src]++;
                }
            }
            tr = buildDraftSL();
            $('table.Table tbody')[0].append(tr);
            $('#gclh_all_b')[0].addEventListener("click", gclhSelAll, false);
        } catch(e) {gclh_error("Improve drafts old page:",e);}
    }

// Improve drafts new page.
    if ( settings_modify_new_drafts_page && is_page("drafts") ) {
        try {
            var css = "";
            css += '.gclh-draft-graphics {';
            css += '    top: 0px;';
            css += '    left: 0px;';
            css += '    position: relative;';
            css += '}';
            css += '.gclh-draft-icon {';
            css += '    width: 48px;';
            css += '    height: 48px;';
            css += '    left: 0px;';
            css += '    position: relative;';
            css += '    top: 0px;';
            css += '}';
            css += '.gclh-draft-badge {';
            css += '    width: 24px;';
            css += '    height: 24px;';
            css += '    left: -3px;';
            css += '    position: absolute;';
            css += '    top: -3px;';
            css += '    z-index: 2;';
            css += '}';
            appendCssStyle(css);

            var template = "";
            template = '';
            template += '<span class="draft-icon">';
            template += '    <a href="https://coords.info/{{geocache.referenceCode}}">';
            template += '       <div class="gclh-draft-graphics">';
            template += '           <svg class="gclh-draft-icon">';
            template += '               <use xlink:href="/account/app/ui-icons/sprites/cache-types.svg#icon-{{geocache.geocacheType.id}}{{#if disabled}}-disabled{{/if}}"></use>';
            template += '           </svg>';
            template += '           <svg class="gclh-draft-badge">';
            template += '               <use xlink:href="https://www.geocaching.com/account/app/ui-icons/sprites/log-types.svg#icon-{{logType}}"></use>';
            template += '           </svg>';
            template += '       </div>';
            template += '   </a>';
            template += '</span>';
            template += '<div class="draft-content">';
            template += '    <a href="/account/drafts/home/compose?gc={{geocache.referenceCode}}&d={{referenceCode}}&dGuid={{guid}}&lt={{logTypeId}}">';
            template += '       <dl class="meta">';
            template += '           {{#if geocache.state.isArchived}}';
            template += '           <dt class="state">';
            template += '               {{ localize "archivedLabel" }}';
            template += '           </dt>';
            template += '           <dd></dd>';
            template += '           {{else}}';
            template += '               {{#if geocache.state.isAvailable}}';
            template += '               {{else}}';
            template += '                   <dt class="state">';
            template += '                       {{ localize "disabledLabel" }}';
            template += '                   </dt>';
            template += '                   <dd></dd>';
            template += '               {{/if}}';
            template += '           {{/if}}';
            template += '           <dt>{{cacheLogType logType}}:</dt><dd><span class="date">{{happyDates logDate}}</span> <span class="timestamp">{{timestamp}}</span></dd>';
            template += '       </dl>';
            template += '       <h2 class="title">{{geocache.name}}</h2>';
            template += '       <p>{{notePreview}}</p>';
            template += '   </a>';
            template += '</div>';
            template += '<div class="draft-actions">';
            template += '    <button type="button" class="btn-icon" title="Open Listing" onclick="window.open(\'https://coords.info/{{geocache.referenceCode}}\');" style="padding-right:6px;">';
            template += '        <svg class="xicon" height="22" width="22" style="transform: rotate(135deg); ">';
            template += '            <use xlink:href="/account/app/ui-icons/sprites/global.svg#icon-back-svg-fill"></use>';
            template += '        </svg>';
            template += '    </button>';
            template += '    <button type="button" class="btn-icon js-delete" title="Delete">';
            template += '        <svg class="icon" height="24" width="24">';
            template += '            <use xlink:href="/account/app/ui-icons/sprites/global.svg#icon-delete"></use>';
            template += '        </svg>';
            template += '        <span class="visuallyhidden">{{ localize "deleteOne" }}</span>';
            template += '    </button>';
            template += '</div>';
            $("#draftItem").html(template);
        } catch(e) {gclh_error("New drafts page:",e);}
    }

// Linklist on old dashboard.
    if (settings_bookmarks_show && is_page("profile") && $('#ctl00_ContentBody_WidgetMiniProfile1_LoggedInPanel')[0]) {
        try {
            var side = $('#ctl00_ContentBody_WidgetMiniProfile1_LoggedInPanel')[0];
            var div0 = document.createElement("div");
            div0.setAttribute("class", "YourProfileWidget");
            div0.setAttribute("style", "margin-left: -1px; margin-right: -1px;");  // Wegen doppeltem Border 1px
            var head = document.createElement("h3");
            head.setAttribute("class", "WidgetHeader");
            head.setAttribute("title", "Linklist");
            head.appendChild(document.createTextNode(" Linklist"));
            var div = document.createElement("div");
            div.setAttribute("class", "WidgetBody");
            var ul = document.createElement("ul");
            buildBoxElementsLinklist(ul);
            div.appendChild(ul);
            div0.appendChild(head);
            div0.appendChild(div);
            side.appendChild(div0);
        } catch(e) {gclh_error("Linklist on old dashboard:",e);}
    }

// Linklist, Default Links on new dashboard.
    if (is_page("dashboard")) {
        try {
            buildDashboardCss();
            if (settings_bookmarks_show) {
                buildBoxDashboard("linklist", "Linklist", "Linklist");
                var box = document.getElementsByName("box_linklist")[0];
                box.innerHTML = "";
                buildBoxElementsLinklist(box);
            }
            if (settings_show_default_links) {
                bm_tmp = buildCopyOfBookmarks();
                sortBookmarksByDescription(true, bm_tmp);
                buildBoxDashboard("links", "Default Links", "Default Links for the Linklist");
                var box = document.getElementsByName("box_links")[0];
                box.innerHTML = "";
                buildBoxElementsLinks(box, bm_tmp);
            }
        } catch(e) {gclh_error("Linklist, Default Links on new dashboard:",e);}
    }

// Loggen über Standard "Log It" Icons zu PMO Caches für Basic Members.
    if (settings_logit_for_basic_in_pmo && document.getElementsByClassName('premium').length > 0) {
        try {
            var premiumTeile = document.getElementsByClassName('premium');
            for (var i = 0; i < premiumTeile.length; i++) {
                if (premiumTeile[i] && premiumTeile[i].href && premiumTeile[i].href.match(/\/seek\/log\.aspx\?ID=/)) {
                    premiumTeile[i].addEventListener("click", function() {buildLogItLink(this);}, false);
                }
            }
        } catch(e) {gclh_error("Log-It for basic in pmo:",e);}
    }
    // Link ausführen trotz Tool Tipp.
    function buildLogItLink(premiumTeil) {
        if (premiumTeil.href.match(/\/seek\/log\.aspx\?ID=/)) location = premiumTeil.href;
    }

// Show Profile-Link on display of Caches found or created by user. (Muß vor VIP laufen.)
    if (settings_show_nearestuser_profil_link && document.location.href.match(/\.com\/seek\/nearest\.aspx/) && document.location.href.match(/(ul|u)=/) && $('#ctl00_ContentBody_LocationPanel1_OriginLabel')[0]) {
        try {
            var user = getUrlUser();
            var link = document.createElement("a");
            link.href = "/profile/?u="+urlencode(user);
            link.innerHTML = user;
            var text = $('#ctl00_ContentBody_LocationPanel1_OriginLabel')[0];
            text.innerHTML = text.innerHTML.replace(/: (.*)/, ": ");
            text.appendChild(link);
        } catch(e) {gclh_error("Show Profile Link",e);}
    }

// VIP. VUP.
    try {
        if (settings_show_vip_list                                           &&
            !isMemberInPmoCache()                                            &&
            global_me                                                        &&
            !document.location.href.match(/\.com\/my\/geocaches\.aspx/)      &&          // Nicht bei eigenen Cache Logs
            !document.location.href.match(/\.com\/my\/travelbugs\.aspx/)     &&          // Nicht bei eigenen Travelbug Logs
            !document.location.href.match(/\.com\/my\/benchmarks\.aspx/)     &&          // Nicht bei eigenen Benchmark Logs
            !document.location.href.match(/\.com\/my\/favorites\.aspx/)      &&          // Nicht bei Eigene Favoriten, weil hier auch gegebenenfalls das Pseudonym steht
            (is_page("cache_listing")                                            ||      // Cache Listing (nicht in den Logs)
             is_page("publicProfile")                                            ||      // Öffentliches Profil
             document.location.href.match(/\.com\/track\/details\.aspx/)         ||      // TB Listing
             document.location.href.match(/\.com\/(seek|track)\/log\.aspx/)      ||      // Post, Edit, View Cache und TB Logs
             document.location.href.match(/\.com\/play\/geocache\/gc\w+\/log/)   ||      // Post Cache Logs neue Seite
             document.location.href.match(/\.com\/email\//)                      ||      // Mail schreiben
             document.location.href.match(/\.com\/my\/inventory\.aspx/)          ||      // TB Inventar
             document.location.href.match(/\.com\/my/)                           ||      // Profil
             document.location.href.match(/\.com\/map/)                          ||      // Map (For enhanced Popup Informations)
             document.location.href.match(/\.com\/my\/default\.aspx/)            ||      // Profil (Quicklist)
             document.location.href.match(/\.com\/account\/dashboard/)           ||      // Dashboard
             document.location.href.match(/\.com\/seek\/nearest\.aspx\?(u|ul)=/) ||      // Nearest Lists mit User
             document.location.href.match(/\.com\/bookmarks\/(view|bulk)/)       ||      // Bookmark Lists
             document.location.href.match(/\.com\/play\/friendleague/)           ||      // Friend League
             document.location.href.match(/\.com\/my\/myfriends\.aspx/)             )) { // Friends
            var myself = global_me;
            var gclh_build_vip_list = function() {};

            // Arrays für VIPs, VUPs aufbauen:
            // ----------
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
            // ----------
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
                                for (var k = 1; k < rows.length; k++) {rows[k].style.display = "none";}
                            }
                        }
                    }
                }
                if (in_array(user, delAry)) delAry = gclh_del_vipvup(user, delAry, delDesc);
                return [addAry, delAry];
            }

            // Del from VIPs, VUPs:
            // ----------
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
                                    for (var k = 1; k < rows.length; k++) {rows[k].style.display = "";}
                                }
                            }
                        }
                    }
                }
                return delAry;
            }

            // Build VIP, VUP Icons:
            // ----------
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

            // Build VIP, VUP, Mail Icons.
            // ----------
            function gclh_build_vipvupmail(side, user) {
                if (side && user && user != "") {
                    link = gclh_build_vipvup(user, global_vips, "vip");
                    side.appendChild(document.createTextNode(" "));
                    side.appendChild(link);
                    if (settings_process_vup && user != global_activ_username) {
                        link = gclh_build_vipvup(user, global_vups, "vup");
                        side.appendChild(document.createTextNode(" "));
                        side.appendChild(link);
                    }
                    buildSendIcons(side, user, "per u");
                }
            }

            // Listing: (nicht in den Logs)
            // ----------
            if (is_page("cache_listing")) {
                var all_users = new Array();
                var log_infos = new Object();
                var log_infos_long = new Array();
                var index = 0;
                var links = $('#divContentMain .span-17, #divContentMain .sidebar').find('a[href*="/profile/?guid="]');
                var owner = "";
                var owner_name = "";
                if ($('#ctl00_ContentBody_mcd1')[0]) {
                    owner = get_real_owner();
                    if (!owner) owner = urldecode($('#ctl00_ContentBody_mcd1')[0].childNodes[1].innerHTML);
                    owner_name = owner;
                }

                for (var i = 0; i < links.length; i++) {
                    if (links[i].parentNode.className != "logOwnerStats" && links[i].childNodes[0] && !links[i].childNodes[0].src) {
                        if (links[i].id) links[i].name = links[i].id; // To be able to jump to this location
                        var matches = links[i].href.match(/https?:\/\/www\.geocaching\.com\/profile\/\?guid=([a-zA-Z0-9]*)/);
                        var user = decode_innerHTML(links[i]);
                        if (links[i].parentNode.id == "ctl00_ContentBody_mcd1") user = owner;
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
                var map = $('#ctl00_ContentBody_detailWidget')[0];
                var box = document.createElement("div");
                var headline = document.createElement("h3");
                var body = document.createElement("div");
                box.setAttribute("class", "CacheDetailNavigationWidget NoPrint");
                headline.setAttribute("class", "WidgetHeader");
                body.setAttribute("class", "WidgetBody");
                body.setAttribute("id", "gclh_vip_list");
                headline.innerHTML = "<img width='16' height='16' style='margin-bottom: -2px;' title='Very important person List' alt='VIP-List' src='/images/icons/icon_attended.gif'> VIP-List";
                if (settings_make_vip_lists_hideable) {
                    headline.innerHTML = "<img id='lnk_gclh_vip_list' title='' src='' style='cursor: pointer'> " + headline.innerHTML;
                }
                box.appendChild(headline);
                box.appendChild(body);
                box.setAttribute("style", "margin-top: 1.5em;");
                map.parentNode.insertBefore(box, map);
                if (settings_make_vip_lists_hideable) {
                    showHideBoxCL("lnk_gclh_vip_list", true);
                    $('#lnk_gclh_vip_list')[0].addEventListener("click", function() {showHideBoxCL(this.id, false);}, false);
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
                    headline2.innerHTML = "<img width='16' height='16' style='margin-bottom: -2px;' title='Very important person List \"not found\"' alt='VIP-List \"not found\"' src='/images/icons/icon_attended.gif'> VIP-List \"not found\"";
                    if (settings_make_vip_lists_hideable) {
                        headline2.innerHTML = "<img id='lnk_gclh_vip_list_nofound' title='' src='' style='cursor: pointer'> " + headline2.innerHTML;
                    }
                    box2.appendChild(headline2);
                    box2.appendChild(body2);
                    box2.innerHTML = box2.innerHTML;
                    map.parentNode.insertBefore(box2, map);
                    if (settings_make_vip_lists_hideable) {
                        showHideBoxCL("lnk_gclh_vip_list_nofound", true);
                        $('#lnk_gclh_vip_list_nofound')[0].addEventListener("click", function() {showHideBoxCL(this.id, false);}, false);
                    }
                }

                var css =
                    "a.gclh_log:hover {" +
                    "  text-decoration:underline;" +
                    "  position: relative;}" +
                    "a.gclh_log span {" +
                    "  display: none;" +
                    "  position: absolute;" +
                    "  top:-310px;" +
                    "  left:-702px;" +
                    "  width: 700px;" +
                    "  padding: 5px;" +
                    "  text-decoration:none;" +
                    "  text-align:left;" +
                    "  vertical-align:top;" +
                    "  color: #000000;}" +
                    "a.gclh_log:hover span {" +
                    "  display: block;" +
                    "  top: 15px;" +
                    "  border: 1px solid #8c9e65;" +
                    "  background-color:#dfe1d2;" +
                    "  z-index:10000;}";
                appendCssStyle(css);

                gclh_build_vip_list = function() {
                    var show_owner = settings_show_owner_vip_list;
                    var list = document.getElementById("gclh_vip_list");
                    // Hier wird wohl Loading Icon entfernt.
                    list.innerHTML = "";

                    // Liste "not found"-VIPs.
                    var list_nofound = false;
                    if (document.getElementById("gclh_vip_list_nofound")) {
                        list_nofound = document.getElementById("gclh_vip_list_nofound");
                        list_nofound.innerHTML = "";
                    }
                    users_found = new Array();

                    function gclh_build_long_list() {
                        if (getValue("settings_load_logs_with_gclh") == false) return;
                        for (var i = 0; i < log_infos_long.length; i++) {
                            var user = log_infos_long[i]["user"];
                            if (in_array(user, global_vips) || user == owner_name) {
                                if (!log_infos_long[i]["date"]) continue;
                                if (log_infos_long[i]["icon"].match(/\/(2|10)\.png$/)) users_found.push(user);  // Für not found liste.
                                var span = document.createElement("span");
                                var profile = document.createElement("a");
                                profile.setAttribute("href", "/profile/?u=" + urlencode(user));
                                profile.innerHTML = user;
                                if (settings_show_mail_in_viplist && settings_show_mail && settings_show_vip_list) noBreakInLine(profile, 93, user);
                                else noBreakInLine(profile, 112, user);
                                if (owner_name && owner_name == user) profile.style.color = '#8C0B0B';
                                else if (user == myself) profile.style.color = 'rgb(91, 200, 51)';
                                span.appendChild(profile);
                                // Build VIP Icon. Wenn es Owner ist und Owner in VUP array, dann VUP Icon.
                                if (owner_name && owner_name == user && in_array(user, global_vups)) link = gclh_build_vipvup(user, global_vups, "vup");
                                else link = gclh_build_vipvup(user, global_vips, "vip");
                                // Log-Date and Link.
                                var log_text = document.createElement("span");
                                log_text.innerHTML = "<img src='" + log_infos_long[i]["icon"] + "'> <b>" + user + " - " + log_infos_long[i]["date"] + "</b><br>" + log_infos_long[i]["log"];
                                var log_img = document.createElement("img");
                                var log_link = document.createElement("a");
                                log_link.setAttribute("href", "#" + log_infos_long[i]["id"]);
                                log_link.className = "gclh_log";
                                log_link.addEventListener("click", function() {
                                    $('#gclh_load_all_logs')[0].click();
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
                                if (settings_show_mail_in_viplist && settings_show_mail && settings_show_vip_list) buildSendIcons(list, user, "per u");
                                list.appendChild(document.createElement("br"));
                            }
                        }
                    }

                    function gclh_build_list(user) {
                        if (getValue("settings_load_logs_with_gclh") == false) return;
                        if (!show_owner && owner_name && owner_name == user) return true;
                        if (in_array(user, all_users) || (owner_name == user)) {
                            var span = document.createElement("span");
                            var profile = document.createElement("a");
                            profile.setAttribute("href", "/profile/?u=" + urlencode(user));
                            profile.innerHTML = user;
                            if (show_owner && owner_name && owner_name == user) {
                                span.appendChild(document.createTextNode("Owner: "));
                                show_owner = false;
                            } else if (user == myself) span.appendChild(document.createTextNode("Me: "));
                            span.appendChild(profile);
                            // Build VIP Icon. Wenn es Owner ist und Owner in VUP array, dann VUP Icon.
                            if (owner_name && owner_name == user && in_array(user, global_vups)) link = gclh_build_vipvup(user, global_vups, "vup");
                            else link = gclh_build_vipvup(user, global_vips, "vip");
                            list.appendChild(span);
                            list.appendChild(document.createTextNode("   "));
                            list.appendChild(link);
                            if (settings_show_mail_in_viplist && settings_show_mail && settings_show_vip_list) buildSendIcons(list, user, "per u");

                            // Log-Links.
                            for (var x = 0; x < log_infos[user].length; x++) {
                                if (log_infos[user][x] && log_infos[user][x]["icon"] && log_infos[user][x]["id"]) {
                                    if (log_infos[user][x]["icon"].match(/\/(2|10)\.png$/)) users_found.push(user);  // Für not found liste.
                                    var image = document.createElement("img");
                                    var log_text = document.createElement("span");
                                    log_text.innerHTML = "<img src='" + log_infos[user][x]["icon"] + "'> <b>" + user + " - " + log_infos[user][x]["date"] + "</b><br>" + log_infos[user][x]["log"];
                                    image.setAttribute("src", log_infos[user][x]["icon"]);
                                    image.setAttribute("border", "0");
                                    if (log_infos[user][x]["date"]) {
                                        image.setAttribute("title", log_infos[user][x]["date"]);
                                        image.setAttribute("alt", log_infos[user][x]["date"]);
                                    }
                                    var a = document.createElement("a");
                                    a.setAttribute("href", "#" + log_infos[user][x]["id"]);
                                    a.className = "gclh_log";
                                    a.addEventListener("click", function() {
                                        $('#gclh_load_all_logs')[0].click();
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
                    if (settings_show_long_vip) gclh_build_long_list();
                    else {
                        if (!log_infos[owner_name]) log_infos[owner_name] = new Array();
                        gclh_build_list(owner_name);
                        for (var i = 0; i < global_vips.length; i++) {gclh_build_list(global_vips[i]);}
                    }

                    // "Not found"-Liste erstellen.
                    if ($('#gclh_vip_list_nofound')[0]) {
                        for (var i = 0; i < global_vips.length; i++) {
                            if (getValue("settings_load_logs_with_gclh") == false) break;
                            var user = global_vips[i];
                            if (in_array(user, users_found)) continue;
                            var span = document.createElement("span");
                            var profile = document.createElement("a");
                            profile.setAttribute("href", "/profile/?u=" + urlencode(user));
                            profile.innerHTML = user;
                            if (owner_name && owner_name == user) continue;
                            else if (user == myself) continue;
                            span.appendChild(profile);
                            // Build VIP Icon.
                            link = gclh_build_vipvup(user, global_vips, "vip");
                            list_nofound.appendChild(span);
                            list_nofound.appendChild(document.createTextNode("   "));
                            list_nofound.appendChild(link);
                            if (settings_show_mail_in_viplist && settings_show_mail && settings_show_vip_list) buildSendIcons(list_nofound, user, "per u");
                            list_nofound.appendChild(document.createElement("br"));
                        }
                    }
                };
                gclh_build_vip_list();

            // Old Dashboard:
            // ----------
            } else if (document.location.href.match(/\.com\/my\//) && $('#ctl00_ContentBody_uxBanManWidget')[0]) {
                function build_box_vipvup(desc) {
                    var widget = document.createElement("div");
                    var headline = document.createElement("h3");
                    var box = document.createElement("div");
                    widget.setAttribute("class", "YourProfileWidget");
                    headline.setAttribute("class", "WidgetHeader");
                    headline.setAttribute("title", "All my " + (desc == 'vip' ? 'very important persons':'very unimportant persons'));
                    headline.appendChild(document.createTextNode("All my " + desc.toUpperCase() + "s"));
                    var box2 = document.createElement("div");
                    box2.setAttribute("class", "WidgetBody");
                    box2.setAttribute("style", "padding: 0;");   // Wegen 2 WidgetBodys.
                    box.setAttribute("id", "box_" + desc + "s");
                    box.setAttribute("class", "WidgetBody");
                    widget.appendChild(headline);
                    widget.appendChild(box2);
                    box2.appendChild(box);
                    $('#ctl00_ContentBody_uxBanManWidget')[0].parentNode.insertBefore(widget, $('#ctl00_ContentBody_uxBanManWidget')[0]);
                }
                function fill_box_vipvup(ary, desc) {
                    var box = $('#box_' + desc + 's')[0];
                    if (!box) return false;
                    box.innerHTML = "";
                    for (var i = 0; i < ary.length; i++) {
                        var user = ary[i];
                        var span = document.createElement("span");
                        var profile = document.createElement("a");
                        profile.setAttribute("href", "/profile/?u=" + urlencode(user));
                        profile.innerHTML = user;
                        span.appendChild(profile);
                        // Build VIP, VUP Icon.
                        link = gclh_build_vipvup(user, ary, desc);
                        box.appendChild(span);
                        box.appendChild(document.createTextNode("   "));
                        box.appendChild(link);
                        if (settings_show_mail_in_allmyvips && settings_show_mail && settings_show_vip_list) buildSendIcons(box, user, "per u");
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
                gclh_build_vip_list = function() {
                    fill_box_vipvup(global_vips, "vip");
                    if (settings_process_vup) fill_box_vipvup(global_vups, "vup");
                };

            // New Dashboard:
            // ----------
            } else if (document.location.href.match(/\.com\/account\/dashboard/) && $('nav.sidebar-links').length > 1) {
                function build_box_vipvup(desc) {
                    buildBoxDashboard(desc, "All my " + desc.toUpperCase() + "s", "All my " + (desc == 'vip' ? 'very important persons':'very unimportant persons'));
                }
                function fill_box_vipvup(ary, desc) {
                    var box = document.getElementsByName("box_" + desc)[0];
                    if (!box) return false;
                    box.innerHTML = "";
                    for (var i = 0; i < ary.length; i++) {
                        var user = ary[i];
                        var li = document.createElement("li");
                        var profile = document.createElement("a");
                        profile.setAttribute("href", "/profile/?u=" + urlencode(user));
                        profile.innerHTML = user;
                        li.appendChild(profile);
                        // Build VIP, VUP Icon.
                        link = gclh_build_vipvup(user, ary, desc);
                        li.appendChild(link);
                        box.appendChild(li);
                        if (settings_show_mail_in_allmyvips && settings_show_mail && settings_show_vip_list) buildSendIcons(li, user, "per u");
                    }
                }
                build_box_vipvup("vip");
                fill_box_vipvup(global_vips, "vip");
                if (settings_process_vup) {
                    build_box_vipvup("vup");
                    fill_box_vipvup(global_vups, "vup");
                }
                gclh_build_vip_list = function() {
                    fill_box_vipvup(global_vips, "vip");
                    if (settings_process_vup) fill_box_vipvup(global_vups, "vup");
                };

            // Friends list:
            // ----------
            } else if (document.location.href.match(/\.com\/my\/myfriends\.aspx/)) {
                gclh_build_vip_list = function() {
                    // Delete VIP, VUP Icons. Sie werden bei Deaktivierung bzw. Aktivierung immer neu aufgebaut. Dadurch wird verhindert, dass
                    // das VUP Icon nicht stehen bleibt, wenn es als Ersatz für das VIP Icon eingebaut wurde und das VUP Icon nun deaktiviert wurde.
                    $('.gclh_vip').closest('a').remove();
                    $('.gclh_vup').closest('a').remove();
                    // VIP, VUP Icons aufbauen.
                    var links = $('a[href*="/profile/?guid="]');
                    for (var i = 0; i < links.length; i++) {
                        if (links[i].id) {
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

            // TB Listing. Post, Edit, View Cache und TB Logs. Mail schreiben, Bookmark lists, Trackable Inventory. (Nicht post cache log new page.)
            // ----------
            } else if (document.location.href.match(/\.com\/track\/details\.aspx/) ||
                       document.location.href.match(/\.com\/(seek|track)\/log\.aspx/) ||
                       document.location.href.match(/\.com\/email\//) ||
                       document.location.href.match(/\.com\/bookmarks\/(view\.aspx\?guid=|bulk\.aspx\?listid=|view\.aspx\?code=)/) ||
                       document.location.href.match(/\.com\/my\/inventory\.aspx/)) {
                var links = $('a[href*="/profile/?guid="]');
                for (var i = 0; i < links.length; i++) {
                    // Wenn es hier um User "In the hands of ..." im TB Listing geht, dann nicht weitermachen weil Username nicht wirklich bekannt ist.
                    if (links[i].id == "ctl00_ContentBody_BugDetails_BugLocation") continue;
                    var matches = links[i].href.match(/https?:\/\/www\.geocaching\.com\/profile\/\?guid=([a-zA-Z0-9]*)/);
                    var user = decode_innerHTML(links[i]);
                    // Build VUP Icon.
                    if (settings_process_vup && user != global_activ_username) {
                        link = gclh_build_vipvup(user, global_vups, "vup");
                        link.children[0].setAttribute("style", "margin-left: 0px; margin-right: 0px;");
                        link.setAttribute("style", "border-bottom: none;");
                        links[i].parentNode.insertBefore(link, links[i].nextSibling);
                        links[i].parentNode.insertBefore(document.createTextNode(" "), links[i].nextSibling);
                    }
                    // Build VIP Icon.
                    link = gclh_build_vipvup(user, global_vips, "vip");
                    link.children[0].setAttribute("style", "margin-left: 0px; margin-right: 0px;");
                    link.setAttribute("style", "border-bottom: none;");
                    links[i].parentNode.insertBefore(link, links[i].nextSibling);
                    links[i].parentNode.insertBefore(document.createTextNode(" "), links[i].nextSibling);
                }

            // Post cache log new page:
            // ----------
            } else if (document.location.href.match(/\.com\/play\/geocache\/gc\w+\/log/) && $('.muted')[0] && $('.muted')[0].children[1]) {
                var id = $('.muted')[0].children[1].href.match(/^https?:\/\/www\.geocaching\.com\/profile\/\?id=(\d+)/);
                if (id && id[1]) {
                    var idLink = "/p/default.aspx?id=" + id[1] + "&tab=geocaches";
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: idLink,
                        onload: function(response) {
                            if (response.responseText) {
                                [user, guid] = getUserGuidFromProfile(response.responseText);
                                if (user) {
                                    appendCssStyle(".gclh_vip {margin-left: 8px; margin-right: 4px;}");
                                    var side = document.getElementsByClassName('muted')[0].children[1];
                                    link = gclh_build_vipvup(user, global_vips, "vip");
                                    side.appendChild(link);
                                    if (settings_process_vup && user != global_activ_username) {
                                        link = gclh_build_vipvup(user, global_vups, "vup");
                                        side.appendChild(link);
                                    }
                                }
                            }
                        }
                    });
                }

            // Public Profile:
            // ----------
            } else if (is_page("publicProfile") && $('#ctl00_ContentBody_ProfilePanel1_lblMemberName, #ctl00_ProfileHead_ProfileHeader_lblMemberName')[0]) {
                var user = $('#ctl00_ContentBody_ProfilePanel1_lblMemberName, #ctl00_ProfileHead_ProfileHeader_lblMemberName')[0].innerHTML.replace(/&amp;/, '&');
                var side = $('#ctl00_ContentBody_ProfilePanel1_lblMemberName, #ctl00_ProfileHead_ProfileHeader_lblStatusText')[0];
                // Build VIP Icon.
                link = gclh_build_vipvup(user, global_vips, "vip");
                link.children[0].style.marginLeft = ($('#ctl00_ContentBody_ProfilePanel1_lblMemberName')[0] ? "0" : "14px");
                link.children[0].style.marginRight = "0";
                side.appendChild(document.createTextNode(" "));
                side.appendChild(link);
                // Build VUP Icon.
                if (settings_process_vup && user != global_activ_username) {
                    link = gclh_build_vipvup(user, global_vups, "vup");
                    link.children[0].setAttribute("style", "margin-left: 0px; margin-right: 0px");
                    side.appendChild(document.createTextNode(" "));
                    side.appendChild(link);
                }

            // Nearest lists:
            // ----------
            } else if (document.location.href.match(/\.com\/seek\/nearest\.aspx\?(u|ul)=/)) {
                var id = "ctl00_ContentBody_LocationPanel1_OriginLabel";
                if (document.getElementById(id)) {
                    appendCssStyle("#"+id+" a img {margin-right: -5px;}");
                    var side = document.getElementById(id);
                    var user = getUrlUser();
                    gclh_build_vipvupmail(side, user);
                }

            // Friend League:
            // ----------
            } else if (document.location.href.match(/\.com\/play\/friendleague/)) {
                // Click im Knoten mit Class summary klappt Details auf/zu. Beim Click auf Buttons das verhindern durch temporäre Änderung dieser Class.
                function doNotChangeDetailsByClick() {
                    this.parentNode.parentNode.parentNode.className = "gclh_summary";
                    setTimeout(function() {
                        var s = $('.gclh_summary')[0];
                        if (s) s.className = "summary";
                    }, 100);
                }
                function checkLeagueAvailable(waitCount) {
                    if ($('table.leaderboard-table tbody.leaderboard-item').length > 0) {
                        var side = $('table.leaderboard-table tbody.leaderboard-item .summary .profile-info');
                        var links = $('table.leaderboard-table tbody.leaderboard-item .details .profile-link');
                        if (!side || !links || side.length != links.length) return;
                        appendCssStyle(".leaderboard-item .profile-info a {display: table-cell;} .leaderboard-item .profile-info a img {margin-right: 5px;}");
                        for (var i = 0; i < links.length; i++) {
                            var span = document.createElement('span');
                            span.setAttribute("style", "min-width: 80px; padding-right: 20px; display: table-cell; vertical-align: middle;");
                            span.addEventListener("click", doNotChangeDetailsByClick, false);
                            side[i].appendChild(span);
                            var last = side[i].children.length - 1;
                            var user = links[i].href.match(/https?:\/\/www\.geocaching\.com\/profile\/\?u=(.*)/);
                            gclh_build_vipvupmail(side[i].children[last], user[1]);
                        }
                    } else {waitCount++; if (waitCount <= 50) setTimeout(function(){checkLeagueAvailable(waitCount);}, 200);}
                }
                checkLeagueAvailable(0);
            }
        }
    } catch(e) {gclh_error("VIP VUP:",e);}

// Log-Template (Logtemplate) definieren.
    if (is_page("cache_listing")) {
        try {
            global_MailTemplate = urlencode(buildSendTemplate().replace(/#Receiver#/ig, "__Receiver__"));
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
            if (settings_mail_icon_new_win) mailNewWin = 'target="_blank" ';
            var messageNewWin = "";
            if (settings_message_icon_new_win) messageNewWin = 'target="_blank" ';

            var new_tmpl = "";
            new_tmpl +=
                '{{' + vupHideCompleteLog  + '}}' +
                '<tr class="log-row display_none" data-encoded="${IsEncoded}" style="display:none" >' +
                '{{else}}' +
                '<tr class="log-row" data-encoded="${IsEncoded}" >' +
                '{{/if}}' +
                '  <td>' +
                '    <div class="FloatLeft LogDisplayLeft" >' +
                '      <p class="logOwnerProfileName">' +
                '        <strong>' +
                '          {{' + vupHideAvatarString  + '}}' +
                '          <a id="${LogID}" name="${LogID}" href="/profile/?guid=${AccountGuid}">${UserName}</a>' +
                '          {{else}}' +
                '          <a id="${LogID}" name="${LogID}" href="/profile/?guid=${AccountGuid}">V.U.P.</a>' +
                '          {{/if}}' +
                '        </strong>' +
                '      </p>' +
                '      <p class="logIcons">' +
                '        <strong>' +
                '          <a class="logOwnerBadge">' +
                '            {{if creator}}<img title="${creator.GroupTitle}" src="${creator.GroupImageUrl}" style="vertical-align: baseline;">{{/if}}</a>';
            if (settings_show_vip_list) new_tmpl +=
                '          <a href="javascript:void(0);" name="${UserName}" class="gclh_vip"><img class="gclh_vip" border=0 style="margin-left: 0px; margin-right: 0px"></a>';
            if (settings_process_vup) new_tmpl +=
                '          {{if UserName !== "' + global_activ_username + '" }}' +
                '          <a href="javascript:void(0);" name="${UserName}" class="gclh_vup"><img class="gclh_vup" border=0 style="margin-left: 0px; margin-right: 0px"></a>' +
                '          {{/if}}';
            if (settings_show_mail) new_tmpl +=
                '          {{if UserName !== "' + global_activ_username + '" }}' +
                '          <a ' + mailNewWin + 'href="/email/?guid=${AccountGuid}&text=' + global_MailTemplate + '"><img border=0 title="Send a mail to ${UserName}" src="' + global_mail_icon + '"></a>' +
                '          {{/if}}';
            if (settings_show_message) new_tmpl +=
                '          {{if UserName !== "' + global_activ_username + '" }}' +
                '          <a ' + messageNewWin + 'href="/account/messagecenter?recipientId=${AccountGuid}&text=' + global_MailTemplate + '"><img border=0 title="Send a message to ${UserName}" src="' + global_message_icon + '"></a>' +
                '          {{/if}}';
            new_tmpl +=
                '          &nbsp;&nbsp;' +
                '          <a title="Top" href="#gclh_top" style="color: #000000; text-decoration: none; float: right; padding-left: 6px;">↑</a>' +
                '        </strong>' +
                '      </p>' +
                '      <p class="logOwnerAvatar">' +
                '        <a href="/profile/?guid=${AccountGuid}">';
            if (!settings_hide_avatar) new_tmpl +=
                '          {{' + vupHideAvatarString  + ' && AvatarImage}}' +
                '          <img width="48" height="48" src="' + http + '://img.geocaching.com/user/avatar/${AvatarImage}">' +
                '          {{else}}' +
                '          <img width="48" height="48" src="/images/default_avatar.jpg">' +
                '          {{/if}}';
            new_tmpl +=
                '      </a></p>' +
                '      <p class="logOwnerStats">' +
                '        {{' + vupHideAvatarString  + ' && (GeocacheFindCount > 0) }}' +
                '        <img title="Caches Found" src="/images/icons/icon_smile.png"> ${GeocacheFindCount}' +
                '        {{/if}}' +
                '      </p>' +
                '    </div>' +
                '    <div class="FloatLeft LogDisplayRight">' +
                '      <div class="HalfLeft LogType">' +
                '         <strong>' +
                '           <img title="${LogType}" alt="${LogType}" src="/images/logtypes/${LogTypeImage}">&nbsp;${LogType}</strong><small class="gclh_logCounter"></small></div>' +
                '      <div class="HalfRight AlignRight">' +
                '        <span class="minorDetails LogDate">${Visited}</span></div>' +
                '      <div class="Clear LogContent markdown-output">' +
                '        {{if LatLonString.length > 0}}' +
                '        <strong>${LatLonString}</strong>' +
                '        {{/if}}' +
                '        {{' + vupUserString + '}}' +
                '        <p class="LogText">censored</p>' +
                '        {{else}}' +
                '        <p class="LogText">{{html LogText}}</p>' +
                '        {{/if}}' +
                '      </div>' +
                '      {{if Images.length > 0}}' +
                '      <div class="TableLogContent">' +
                '        <table cellspacing="0" cellpadding="3" class="LogImagesTable">';
            if (settings_show_thumbnails) new_tmpl +=
                '          <tr><td>';
            new_tmpl +=
                '            {{tmpl(Images) "tmplCacheLogImages"}}';
            if (settings_show_thumbnails) new_tmpl +=
                '            </td></tr>';
            new_tmpl +=
                '        </table>' +
                '      </div>' +
                '      {{/if}}' +
                '      <div class="AlignRight">' +
                '        <small><a title="View Log" href="/seek/log.aspx?LUID=${LogGuid}" target="_blank">' +
                '        {{if (userInfo.ID==AccountID)}}' +
                '        View / Edit Log / Images' +
                '        {{else}}' +
                '        View Log' +
                '        {{/if}}' +
                '        </a></small>&nbsp;' +
                '        {{if (userInfo.ID==AccountID)}}' +
                '        <small><a title="Upload Image" href="/seek/upload.aspx?LID=${LogID}" target="_blank">Upload Image</a></small>' +
                '        {{/if}}' +
                '      </div>' +
                '     </div>' +
                '   </td>' +
                '</tr>';

            var css = "";
            // Log Text noch etwas ausrichten, keinen Platz in der Höhe verlieren.
            css += ".LogDisplayRight .LogText {min-height: unset; padding-top: 1.5em;}";
            css += ".markdown-output {margin: unset;}";
            if (!settings_hide_avatar) css += ".markdown-output {min-height: 6em;}";
            // Bilderrahmen im Log noch etwas ausrichten und Trenner von Text und User auch hier einbauen.
            css += ".TableLogContent {padding-left: 0.5em; border-left: 1px solid #d7d7d7;}";
            // Länge der Usernamen in den Logs beschränken, damit sie nicht umgebrochen werden.
            css += ".logOwnerProfileName {max-width: 135px; display: inline-block; overflow: hidden; vertical-align: bottom; white-space: nowrap; text-overflow: ellipsis;}";
            appendCssStyle(css);
        } catch(e) {gclh_error("Define log-template:",e);}
    }

// Overwrite Log-Template (Logtemplate) and Log-Load-Function. (Muß unbedingt nach VIP laufen.)
    overwrite_log_template:
    if (settings_load_logs_with_gclh && is_page("cache_listing") && !document.getElementById("ctl00_divNotSignedIn") && document.getElementById('tmpl_CacheLogRow')) {
        try {
            // To Top Link.
            var a = document.createElement("a");
            a.setAttribute("href", "#");
            a.setAttribute("name", "gclh_top");
            $('body')[0].insertBefore(a, $('body')[0].childNodes[0]);
            var new_tmpl_block = document.createElement("script");
            new_tmpl_block.type = "text/x-jquery-tmpl";
            new_tmpl_block.innerHTML = new_tmpl;
            new_tmpl_block.setAttribute("id", "tmpl_CacheLogRow_gclh");
            $('body')[0].appendChild(new_tmpl_block);

            // Override standard templates.
            document.getElementById('tmpl_CacheLogRow').innerHTML = new_tmpl;
            var elem = unsafeWindow.$('#tmpl_CacheLogRow')[0];
            unsafeWindow.$.removeData(elem, "tmpl");
            unsafeWindow.$("#tmpl_CacheLogRow").template("tmplCacheLogRow");
            if (browser === "chrome" || browser === "firefox") {
                injectPageScriptFunction(function() {
                    var elem = window.$('#tmpl_CacheLogRow')[0];
                    window.$.removeData(elem, "tmpl");
                    window.$("#tmpl_CacheLogRow").template("tmplCacheLogRow");
                }, "()");
            }

            // Reinit initalLogs.
            if ((!document.getElementById("cache_logs_table") && !document.getElementById("cache_logs_table2")) ||
                (!document.getElementById("cache_logs_table").getElementsByTagName("tbody") && !document.getElementById("cache_logs_table2").getElementsByTagName("tbody")) ||
                (document.getElementById("cache_logs_table").getElementsByTagName("tbody").length == 0 && document.getElementById("cache_logs_table2").getElementsByTagName("tbody").length == 0)) break overwrite_log_template;
            var tbody = (document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table")).getElementsByTagName("tbody");
            if (tbody.length > 0) {
                tbody = tbody[0];
                if (tbody.children.length > 0 && isTM === false) {
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
            if (isTM === false) {
                window.addEventListener("message", function(ev) {
                    if (ev.origin !== "https://www.geocaching.com" && ev.origin !== "https://www.geocaching.com") return;
                    if (ev.data === "gclh_add_vip_icon") gclh_add_vip_icon();
                    if (ev.data === "setLinesColorInCacheListing") setLinesColorInCacheListing();
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
                    link = gclh_build_vipvup(link.name, global_vips, "vip", link);  // Ist oben bei VIP. VUP.
                    unsafeWindow.$(link).addClass("gclh_vip_hasIcon");
                }
                if (settings_process_vup) gclh_add_vup_icon();
            }
            // Build VUP Icons.
            function gclh_add_vup_icon() {
                var elements = $(document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table")).find("a.gclh_vup").not(".gclh_vup_hasIcon");
                for (var i = 0; i < elements.length; i++) {
                    var link = elements[i];
                    link = gclh_build_vipvup(link.name, global_vups, "vup", link);  // Ist oben bei VIP. VUP.
                    unsafeWindow.$(link).addClass("gclh_vup_hasIcon");
                }
            }

            // Dynamic load with full control.
            function gclh_dynamic_load(logs, num) {
                var isBusy = false;
                var gclh_currentPageIdx = 1, gclh_totalPages = 1;
                var logInitialLoaded = false;
                var browser = (typeof(chrome) !== "undefined") ? "chrome" : "firefox";
                var isTM = (typeof GM_info != "undefined" && typeof GM_info.scriptHandler != "undefined" && GM_info.scriptHandler == "Tampermonkey") ? true : false;
                unsafeWindow.$(window).endlessScroll({
                    fireOnce: true,
                    fireDelay: 500,
                    bottomPixels: (($(document).height() - $("#cache_logs_container").offset().top) + 50),
                    ceaseFire: function() {
                        // Stop scrolling if last page reached.
                        return (gclh_totalPages < gclh_currentPageIdx);
                    },
                    callback: function() {
                        if (!isBusy && !document.getElementById("gclh_all_logs_marker")) {
                            isBusy = true;
                            $("#pnlLazyLoad").show();
                            if (isTM === false) {
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
                                    num++;  // Num kommt vom vorherigen laden "aller" logs.
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
                    $('#gclh_load_all_logs').addClass("working");
                    setTimeout(function() {
                        if (logs) {
                            var tbodys = (document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table")).getElementsByTagName("tbody");
                            for (var i = 0; i < tbodys.length; i++) {
                                (document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table")).removeChild(tbodys[i]);
                            }
                            if (isTM === false) {
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
                        $('#gclh_load_all_logs').removeClass("working");
                    }, 100);
                }
                var para = document.getElementById('ctl00_ContentBody_lblFindCounts').nextSibling.nextSibling.nextSibling.nextSibling;
                if (para && para.nodeName == 'P') para.className = para.className + ' Clear';
                if (settings_show_all_logs_but) addButtonOverLogs(gclh_load_all_logs, "gclh_load_all_logs", false, "Show all logs", "");
                if (settings_show_bigger_avatars_but && !settings_hide_avatar && !isMemberInPmoCache() && settings_show_thumbnails) showBiggerAvatarsLink();
                if (settings_show_log_counter_but) showLogCounterLink();
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
                    if (isTM === false) {
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
                                unsafeWindow.$(document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table")).append(newBody.children());
                                injectPageScript("$('a.tb_images').fancybox({'type': 'image', 'titlePosition': 'inside'});");
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
                    if (e.keyCode != 13  || noSpecialKey(e) == false) return false;
                    if (!logs) return false;
                    var search_text = this.value;
                    if (!search_text) return false;
                    var regexp = new RegExp("(" + search_text + ")", "i");
                    var tbodys = (document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table")).getElementsByTagName("tbody");
                    for (var i = 0; i < tbodys.length; i++) {
                        (document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table")).removeChild(tbodys[i]);
                    }
                    if (isTM === false) {
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

            // Marker to disable dynamic log load.
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
                        onload: function(response) {
                            requestCount--;
                            var dataElement = JSON.parse(response.responseText);
                            data[dataElement.pageInfo.idx] = dataElement;
                            if (numPages == 1) {
                                numPages = data[count].pageInfo.totalPages;
                                for (curIdx = 2; curIdx <= numPages; curIdx++) {
                                    requestCount++;
                                    gclh_load_helper(curIdx);
                                }
                            }
                            if (requestCount <= 0) gclh_load_dataHelper();
                        }
                    });
                }

                function gclh_load_dataHelper() {
                    logs = new Array();
                    // Disable scroll Function on Page.
                    if (browser === "chrome" || browser === "firefox") injectPageScriptFunction(disablePageAutoScroll, "()");
                    else disablePageAutoScroll();
                    if (isTM === true) (document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table")).removeEventListener('DOMNodeInserted', loadListener);
                    // Hide initial Logs.
                    var tbodys = document.getElementById("cache_logs_table").getElementsByTagName("tbody");
                    if (tbodys.length > 0) {
                        var shownLogs = tbodys[0].children.length;
                        if (shownLogs > 0 && num < shownLogs) num = shownLogs;
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

                    if (isTM === false) {
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
                gclh_load_logs(logsCount);
            } else gclh_load_logs(30);
        } catch(e) {gclh_error("Replace Log-Loading function:",e);}
    }
    // Zeilen in Cache Listings in Zebra und für User, Owner, Reviewer und VIP einfärben.
    function setLinesColorInCacheListing() {
        if (is_page("cache_listing")) {
            // ('find("tr")' reicht hier nicht wegen der Bilder.)
            var lines = $(document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table")).find("tbody").find("tr.log-row:not(.gclh_colored,.display_none)");
            lines.addClass("gclh_colored");
            var owner = get_real_owner();
            setLinesColorInZebra(settings_show_cache_listings_in_zebra, lines, 1);
            setLinesColorUser("settings_show_cache_listings_color", "user,owner,reviewer,vips", lines, 1, owner);
        }
    }
    // Bei Click auf VIP Icon, Einfärbung für VIP neu machen.
    function setLinesColorVip(user) {
        if (is_page("cache_listing")) {
            var lines = $(document.getElementById("cache_logs_table2") || document.getElementById("cache_logs_table")).find("tbody").find("tr.log-row");
            var count = 1;
            var owner = get_real_owner();
            var paraStamm = "settings_show_cache_listings_color";
        } else if (document.location.href.match(/\.com\/track\/details\.aspx/)) {
            var lines = $("table.Table").find("tbody").find("tr");
            var count = 2;
            var owner = document.getElementById("ctl00_ContentBody_BugDetails_BugOwner").innerHTML;
            var paraStamm = "settings_show_tb_listings_color";
        }
        if (!lines) return;
        var linesNew = new Array();
        for (var i = 0; i < lines.length; i++) {
            var aTags = lines[i].getElementsByTagName("a");
            for (var j = 0; j < aTags.length; j++) {
                if (aTags[j].getAttribute("name") == user) {
                    for (var k = 0; k < count; k++) {linesNew.push(lines[i+k]);}
                }
            }
        }
        if (linesNew.length > 0) setLinesColorUser(paraStamm, "user,owner,reviewer,vips", linesNew, count, owner);
    }

// Farben für Zeilen in gewöhnlichen Listen und TB Listing setzen. Im Cache Listing wird nur css benötigt.
    try {
        var css = "table.Table tr.AlternatingRow td, .AlternatingRow, table.Table tr td.AlternatingRow {background-color: #" + getValue("settings_lines_color_zebra") + " !important;}"
                + "table.Table tr.TertiaryRow td, .TertiaryRow, table.Table tr td.TertiaryRow {background-color: #" + getValue("settings_lines_color_user") + " !important;}"
                + "table.Table tr.QuaternaryRow td, .QuaternaryRow, table.Table tr td.QuaternaryRow {background-color: #" + getValue("settings_lines_color_owner") + " !important;}"
                + "table.Table tr.QuinaryRow td, .QuinaryRow, table.Table tr td.QuinaryRow {background-color: #" + getValue("settings_lines_color_reviewer") + " !important;}"
                + "table.Table tr.SenaryRow td, .SenaryRow, table.Table tr td.SenaryRow {background-color: #" + getValue("settings_lines_color_vip") + " !important;}";
        appendCssStyle(css);
        // BMlisten: Zeilen in Zebra und Funde User einfärben. BMlisten scheinen einzige Listen, bei denen das nicht vorgesehen ist.
        if (document.location.href.match(/\.com\/bookmarks\/(view\.aspx\?guid=|bulk\.aspx\?listid=|view\.aspx\?code=)/) && document.getElementById('ctl00_ContentBody_ListInfo_cboItemsPerPage')) {
            var lines = $("table.Table").find("tbody").find("tr");
            setLinesColorInZebra(settings_show_common_lists_in_zebra, lines, 2);
            setLinesColorUser("settings_show_common_lists_color", "user", lines, 2, "", true);
        // TB Listing: Zeilen in Zebra, für User, Owner, Reviewer und VIP einfärben.
        } else if (document.location.href.match(/\.com\/track\/details\.aspx\?/)) {
            var lines = $("table.Table").find("tbody").find("tr");
            if (lines.length > 1) {
                var linesNew = lines.slice(0, -1);
                var owner = document.getElementById("ctl00_ContentBody_BugDetails_BugOwner").innerHTML;
                setLinesColorInZebra(settings_show_tb_listings_in_zebra, linesNew, 2);
                setLinesColorUser("settings_show_tb_listings_color", "user,owner,reviewer,vips", linesNew, 2, owner);
            }
        // Andere Listen: In Zeilen gegebenenfalls Einfärbung für Zebra oder User entfernen.
        } else if (!is_page("cache_listing")) {
            if (settings_show_common_lists_in_zebra == false){
                var lines = $("table").find("tbody").find("tr");
                var replaceSpec = /(AlternatingRow)(\s*)/g;
                setLinesColorNone(lines, replaceSpec);
            }
            if (settings_show_common_lists_color_user == false){
                var lines = $("table").find("tbody").find("tr");
                var replaceSpec = /(TertiaryRow)(\s*)/g;
                setLinesColorNone(lines, replaceSpec);
                // Wenn User nicht eingefärbt werden soll, Zebra aber ausgewählt ist, dann muss Zebra explizit gesetzt werden, weil nur ein Wert im Standard
                // gesetzt wurde, hier eben Wert für User.
                if (settings_show_common_lists_in_zebra) {
                    if (document.location.href.match(/\.com\/seek\/nearest\.aspx\?/) ||
                        document.location.href.match(/\.com\/my\/recentlyviewedcaches\.aspx/)) {
                        // Überschrift weglassen, einzeilig.
                        var lines = $("table.Table").find("tbody").find("tr").slice(1);
                        setLinesColorInZebra(settings_show_common_lists_in_zebra, lines, 1);
                    }
                }
            }
        }
    } catch(e) {gclh_error("Color lines in lists:",e);}

// Improve old dashboard. (Muß nach VIP laufen.)
    if (is_page("profile")) {
        try {
            var css = ".YourProfileWidget h3 {padding-left: 0.5em;} .YourProfileWidget h3 img {padding-right: 0.2em;}";
            // Show/Hide einbauen in rechter Spalte.
            var code = "function hide_box(i){";
            code += "  if(document.getElementById('box_'+i).style.display == 'none'){";
            code += "    document.getElementById('box_'+i).style.display = 'block';";
            code += "    document.getElementById('lnk_'+i).src = '/images/minus.gif';";
            code += "    document.getElementById('lnk_'+i).title = 'hide';";
            code += "  }else{";
            code += "    document.getElementById('box_'+i).style.display = 'none';";
            code += "    document.getElementById('lnk_'+i).src = '/images/plus.gif';";
            code += "    document.getElementById('lnk_'+i).title = 'show';";
            code += "  }";
            code += "}";
            insertScript(code, "body");
            var boxes = $('.WidgetHeader');
            function saveStates() {
                // Wenn Linklist angezeigt wird, dann mit Speicherindex "i" von Linklist beginnen, er ist 0. Ansonsten mit 1 beginnen.
                if (settings_bookmarks_show) var i = 0;
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
            if (settings_bookmarks_show) var i = 0;
            else var i = 1;
            // Alle gefundenen WidgetBody "wb" verarbeiten und ihnen den zugehörigen Speicherindex "i" zuordnen.
            for (var wb = 0; wb < boxes.length; wb++) {
                var box = boxes[wb].parentNode.getElementsByClassName('WidgetBody')[0];
                if (typeof(box) != "undefined") {
                    box.setAttribute("id", "box_" + i);
                    if (typeof(getValue("show_box[" + i + "]")) != "undefined") box.style.display = getValue("show_box[" + i + "]");
                    if (box.style.display == "none") {
                        boxes[wb].innerHTML = "<img id='lnk_" + i + "' src='/images/plus.gif' onClick='hide_box(\"" + i + "\");' title='show' style='cursor: pointer'> " + boxes[wb].innerHTML;
                    } else {
                        boxes[wb].innerHTML = "<img id='lnk_" + i + "' src='/images/minus.gif' onClick='hide_box(\"" + i + "\");' title='hide' style='cursor: pointer'> " + boxes[wb].innerHTML;
                    }
                    $('#lnk_' + i)[0].addEventListener("click", saveStates, false);
                }
                i++;
            }
            // Change link "Your lists" from ".../account/lists" to ".../my/lists.aspx".
            if (settings_my_lists_old_fashioned) $('#divContentMain').find('p').first().find('a[href*="/account/lists"]').prop("href", "/my/lists.aspx");
            if ($('#ctl00_ContentBody_WidgetMiniProfile1_LoggedInPanel').length > 0) {
                // Hide TBs/Coins.
                if (settings_hide_visits_in_profile) {
                    $(".Table.WordWrap tr").filter(function(index) {
                        return $(this).find("img[src$='logtypes/75.png']").length !== 0;
                    }).remove();
                }
                // Remove fixed column width in last 30 days logs for fewer linebreaks.
                if ($('.Table.WordWrap tr').length > 0) {
                    $('.Table.WordWrap')[0].setAttribute("style", "table-layout: unset;");
                    $('.Table.WordWrap tr td').each(function() {
                        this.setAttribute("style", "width: unset;" + (in_array(this.cellIndex, [0,1,4]) ? " white-space: nowrap;" : ""));
                    });
                }
            }
            appendCssStyle(css);
        } catch(e) {gclh_error("Improve old dashboard:",e);}
    }

// Improve new dashboard.
    if (is_page("dashboard")) {
        try {
            var css = '';
            // Compact layout (little bit narrower elements).
            if (settings_compact_layout_new_dashboard) {
                css += ".action-link a {padding: 5px 20px;}";
                css += ".bio-username {color: #02874D; font-size: 1.3em !important; word-break: break-all;}";
                css += ".bio-background {height: 90px !important; background-size: 100% 140% !important;}";
                css += ".bio-meta {padding: 16px 0px !important;}";
                css += ".activity-item, .panel-header {padding: 5px 15px;}";
                css += ".activity-tray {padding: 5px 40px;}";
                css += ".sidebar-links .link-header {padding: 6px 5px 6px 20px !important;}";
                css += ".alert {padding: 6px 16px !important; color: blue;}"
            }
            // Map and Search button in left sidebar.
            if (settings_but_search_map) {
                var target = (settings_but_search_map_new_tab ? "_blank" : "");
                var nav = document.querySelector('.sidebar-links');
                var ul = nav.querySelector('ul');
                var newmapbtn = document.createElement('li');
                newmapbtn.classList.add("action-link");
                newmapbtn.innerHTML = '<a class="gclh_svg_fill" href="/map/" target="'+target+'"><svg class="icon"><use xlink:href="/account/app/ui-icons/sprites/global.svg#icon-map-no-border"></use></svg>Map</a>';
                ul.insertBefore(newmapbtn, ul.childNodes[0]);
                var newsearchbtn = document.createElement('li');
                newsearchbtn.classList.add ("action-link");
                newsearchbtn.innerHTML = '<a class="gclh_svg_fill" href="/play/search" target="'+target+'"><svg class="icon" style="margin-left: -1px; margin-right: 9px; width: 24px;"><use xlink:href="/account/app/ui-icons/sprites/global.svg#icon-spyglass-svg-fill"></use></svg>Search</a>';
                ul.insertBefore(newsearchbtn, ul.childNodes[0]);
                css += "a.gclh_svg_fill {fill: #4a4a4a;} a.gclh_svg_fill:hover {fill: #02874d;}";
            }
            // Show/Hide einbauen in linker Spalte.
            var list = $('.sidebar-links .link-header:not(.gclh), .sidebar-links .link-block:not(.gclh)');
            var ident = 0;
            for (var i = 0; i < list.length; i=i+2) {
                ident++;
                $(list[i]).addClass(getValue("show_box_dashboard_" + ident, true) == true ? "gclh" : "gclh isHide");
                $(list[i+1]).addClass(getValue("show_box_dashboard_" + ident, true) == true ? "" : "isHide");
                list[i].setAttribute("name", "head_" + ident);
                list[i].innerHTML += "<svg><use xlink:href='/account/app/ui-icons/sprites/global.svg#icon-expand-svg-fill'></use></svg>";
                list[i].addEventListener("click", showHideBoxDashboard, false);
            }
            // Show trackables inventory.
            if (settings_show_tb_inv) {
                var side = $('.sidebar-links').last().find('ul.link-block li a[href*="/my/inventory.aspx"]').closest('li');
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "/my/inventory.aspx",
                    onload: function(response) {
                        if (response.responseText) {
                            var anzTbs = 0;
                            var li = document.createElement('li');
                            var ul = document.createElement('ul');
                            ul.setAttribute('class', 'gclh');
                            $(response.responseText).find('table.Table tbody tr').each(function() {
                                anzTbs++;
                                if (anzTbs <= 10) {
                                    var link = $(this).find('a.lnk')[0].href;
                                    var src = $(this).find('.lnk img')[0].src;
                                    var name = $(this).find('.lnk span')[0].innerHTML;
                                    var html = '<li><a href="'+link+'" title="'+name+'" target="_blank" rel="noopener noreferrer"><img src="'+src+'" width="16" height="16"><span>'+name+'</span></a></li>';
                                    ul.innerHTML += html;
                                } else {
                                    var html = '<li><a href="/my/inventory.aspx" style="margin-left: 34px;" target="_blank" rel="noopener noreferrer"><span>... more</span></a></li>';
                                    ul.innerHTML += html;
                                    return;
                                }
                            });
                            if (anzTbs != 0) {
                                li.append(ul);
                                side[0].parentNode.insertBefore(li, side[0].nextSibling);
                            }
                        }
                     }
                 });
                 css += ".link-block .gclh a {font-size: 14px; margin-left: 16px;} .link-block .gclh span:hover {text-decoration: underline; color: #02874d;}";
                 css += ".link-block .gclh span {overflow: hidden; vertical-align: top; white-space: nowrap; text-overflow: ellipsis; display: inline-block; margin-left: 2px; max-width: 220px;}";
            }
            // Change link "Your lists" from ".../account/lists" to ".../my/lists.aspx".
            if (settings_my_lists_old_fashioned) $('#DashboardSidebar ul li a[href*="/account/lists"]').prop("href", "/my/lists.aspx");
            appendCssStyle(css);
        } catch(e) {gclh_error("Improve new dashboard:",e);}
    }

// Show thumbnails.
    if (settings_show_thumbnails) {
        try {
            // my: Großes Bild; at: Kleines Bild; Man gibt an, wo sich beide berühren. Es scheint so, dass zuerst horizontal und dann vertikal benannt werden muss.
            function placeToolTip(element, stop) {
                $('a.gclh_thumb:hover span').position({
                    my: "center bottom",
                    at: "center top",
                    of: "a.gclh_thumb:hover",
                    collision: "flipfit flipfit"
                });
                if (!stop) {
                    $('a.gclh_thumb:hover span img').load(function() {
                        placeToolTip(element, true);
                    });
                }
            }
            function buildThumb(href, title, showName, topSp) {
                var hrefLarge = (href.match(/\/large\//) ? href : href.replace(/\/cache\//,"/cache/large/"));
                links[i].classList.add("gclh_thumb");
                links[i].href = hrefLarge.replace(/\/large\//,"/");
                links[i].onmouseover = placeToolTip;
                var html = '<img src="'+hrefLarge.replace(/\/large\//,"/thumb/")+'" title="'+title+'">';
                if (showName) html += '<br>'+title;
                html += '<span>#top#<img class="gclh_max" src="'+hrefLarge.replace(/\/large\//,"/thumb/large/")+'">#bot#</span>';
                if (settings_imgcaption_on_top) html = html.replace("#top#",title).replace("#bot#","");
                else html = html.replace("#top#","").replace("#bot#",title);
                links[i].innerHTML = html;
                if (topSp && settings_spoiler_strings != "" && title.match(regexp)) {
                    var div = document.createElement("div");
                    div.innerHTML = "Spoiler warning";
                    div.setAttribute("style", "transform: rotate(-30grad); width: 130px; position: relative; top: "+topSp+"; left: -5px; font-size: 11px; line-height: 0;");
                    links[i].childNodes[0].src = urlImages+"gclh_logo.png";
                    links[i].childNodes[0].style.opacity = "0.05";
                    if (showName) links[i].childNodes[3].remove();
                    else links[i].childNodes[1].remove();
                    links[i].parentNode.appendChild(div);
                }
            }
            var regexp = new RegExp(settings_spoiler_strings, "i");
            var css = "";

            // Cache Listing.
            if (is_page("cache_listing") && !isMemberInPmoCache()) {
                // Logs.
                if (settings_load_logs_with_gclh) {
                    var newImTpl = "<a class='tb_images lnk gclh_thumb' onmouseover='placeToolTip(this);' rel='fb_images_${LogID}' href='"+http+"://img.geocaching.com/cache/log/${FileName}' title='<span class=&quot;LogImgTitle&quot;>${Name} &nbsp;</span><span class=&quot;LogImgLink&quot;> <a target=&quot;_blank&quot; href=&quot;/seek/log.aspx?LID=${LogID}&amp;IID=${ImageGuid}&quot;>View Log</a></span><br><span class=&quot;LogImgDescription&quot;>${Descr}</span>'>"
                                 + "<img title='${Name}' alt='${Name}' src='"+http+"://img.geocaching.com/cache/log/thumb/${FileName}'/> "
                                 + "<span title=''>#top#<img title='${Descr}' class='gclh_max' src='"+http+"://img.geocaching.com/cache/log/thumb/large/${FileName}'>#bot#</span></a>";
                    if (settings_imgcaption_on_top) newImTpl = newImTpl.replace('#top#', '${Name}').replace('#bot#', '');
                    else  newImTpl = newImTpl.replace('#top#', '').replace('#bot#', '${Name}');
                    var code = "function gclh_updateTmpl() {"
                             + "  delete $.template['tmplCacheLogImages'];"
                             + "  $.template(\"tmplCacheLogImages\",\""+newImTpl+"\");"
                             + "}"
                             + "gclh_updateTmpl();"
                             + placeToolTip.toString();
                    insertScript(code, "body");
                }
                // Listing.
                css += ".CachePageImages li {margin-bottom: 12px; background: unset; padding-left: 0px;}";
                var links = $('.CachePageImages').find('a[href*="img.geocaching.com/cache/"]');
                for (var i = 0; i < links.length; i++) {
                    buildThumb(links[i].href, links[i].innerHTML, true, "-70px");
                }

            // Public Profile Avatar.
            } else if (is_page("publicProfile") && $('#ctl00_ContentBody_ProfilePanel1_uxProfilePhoto')[0]) {
                var image = $('#ctl00_ContentBody_ProfilePanel1_uxProfilePhoto')[0];
                var aPseudo = document.createElement("a");
                aPseudo.appendChild(image.cloneNode(true));
                image.parentNode.replaceChild(aPseudo, image);
                var link = $('#ctl00_ContentBody_ProfilePanel1_uxProfilePhoto').closest('a')[0];
                avatarThumbnail(link);

            // Galerien Public Profile, Cache, TB.
            } else if ((is_page("publicProfile") && $('#ctl00_ContentBody_ProfilePanel1_lnkGallery.Active')[0]) ||
                       document.location.href.match(/\.com\/(seek\/gallery\.aspx?|track\/gallery\.aspx?)/)) {
                var links = $('.Table.GalleryTable').find('a[href*="img.geocaching.com/track/"], a[href*="img.geocaching.com/cache/"]');
                for (var i = 0; i < links.length; i++) {
                    buildThumb(links[i].href, links[i].nextElementSibling.innerHTML, false, (document.location.href.match(/\.com\/seek\/gallery\.aspx?/) ? "-90px" : false));
                }

            // TB Listing.
            } else if (document.location.href.match(/\.com\/track\/details\.aspx?/)) {
                css += "a.gclh_thumb img {margin-bottom: unset !important; margin-right: unset;}";
                var links = $('.imagelist, table.Table .log_images').find('a[href*="img.geocaching.com/track/"]');
                for (var i = 0; i < links.length; i++) {
                    buildThumb(links[i].href, links[i].children[0].alt, (links[i].href.match(/log/) ? false : true), false);
                }
            }

            css +=
                "a.gclh_thumb:hover {" +
                "  position: relative;}" +
                "a.gclh_thumb {" +
                "  overflow: visible !important;" +
                "  max-width: none !important;}" +
                "a.gclh_thumb span {" +
                "  white-space: unset !important;" +
                "  visibility: hidden;" +
                "  position: absolute;" +
                "  top: -310px;" +
                "  left: 0px;" +
                "  padding: 2px;" +
                "  text-decoration: none;" +
                "  text-align: left;" +
                "  vertical-align: top;}" +
                "a.gclh_thumb:hover span {" +
                "  visibility: visible;" +
                "  z-index: 100;" +
                "  border: 1px solid #8c9e65;" +
                "  background-color: #dfe1d2;" +
                "  text-decoration: none !important;}" +
                "a.gclh_thumb:hover img {margin-bottom: -4px;}" +
                "a.gclh_thumb img {" +
                "  margin-bottom: -4px;" +
                "  height: 75px;}" +
                ".gclh_max {" +
                "  height: unset !important;" +
                "  vertical-align: unset !important;" +
                "  margin-right: 0 !important;" +
                "  max-height: " + settings_hover_image_max_size + "px;" +
                "  max-width:  " + settings_hover_image_max_size + "px;}";
            appendCssStyle(css);
        } catch(e) {gclh_error("Show Thumbnails:",e);}
    }
    function avatarThumbnail(link) {
        var thumb = link.children[0];
        thumb.setAttribute("style", "margin-bottom: 0px; height: 48px;");
        var img = document.createElement('img');
        img.src = thumb.src.replace(/img\.geocaching\.com\/user\/avatar/, "s3.amazonaws.com/gs-geo-images").replace(/img\.geocaching\.com\/user\/display/, "s3.amazonaws.com/gs-geo-images");;
        img.className = "gclh_max";
        img.setAttribute("style", "display: unset;");
        var span = document.createElement('span');
        span.appendChild(img);
        link.className += " gclh_thumb";
        link.onmouseover = placeToolTip;
        link.appendChild(span);
    }
    function showBiggerAvatarsLink() {
        addButtonOverLogs(showBiggerAvatars, "gclh_show_bigger_avatars", true, "Show bigger avatars", "Show bigger avatar images while hovering with the mouse");
    }
    function showBiggerAvatars() {
        try {
            $('#gclh_show_bigger_avatars').addClass("working");
            setTimeout(function() {
                var links = document.getElementsByClassName("logOwnerAvatar");
                for (var i = 0; i < links.length; i++) {
                    if (links[i].children[0] && links[i].children[0].children[0] && !links[i].children[0].children[1]) {
                        avatarThumbnail(links[i].children[0]);
                    }
                }
                $('#gclh_show_bigger_avatars').removeClass("working");
            }, 100);
        } catch(e) {gclh_error("showBiggerAvatars:",e);}
    }

// Show gallery images in 2 instead of 4 cols.
    if (settings_show_big_gallery && (is_page("publicProfile") || document.location.href.match(/\.com\/(seek\/gallery\.aspx?|track\/gallery\.aspx?)/))) {
        try {
            appendCssStyle("table.GalleryTable .imageLink {max-width: unset}");
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
            if ((document.location.href.match(/\.com\/(seek\/gallery\.aspx?|track\/gallery\.aspx?)/) && tds.length > 1 && $('#ctl00_ContentBody_GalleryItems_DataListGallery')[0]) ||
                 (is_page("publicProfile") && tds.length > 1 && $('#ctl00_ContentBody_ProfilePanel1_UserGallery_DataListGallery')[0])) {
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
                if (x != 0) {  // Einzelnes Bild übrig.
                    tr.appendChild(document.createElement("td"));
                    tbody.appendChild(tr);
                }
                if (is_page("publicProfile")) var dataListId = "ctl00_ContentBody_ProfilePanel1_UserGallery_DataListGallery";
                else var dataListId = "ctl00_ContentBody_GalleryItems_DataListGallery";
                document.getElementById(dataListId).removeChild(document.getElementById(dataListId).firstChild);
                document.getElementById(dataListId).appendChild(tbody);
            }
        } catch(e) {gclh_error("Show gallery images in 2 instead of 4 cols:",e);}
    }

// Add layers, control to map and set default layers.
    if (settings_use_gclh_layercontrol && document.location.href.match(/\.com\/map\//)) {
        try {
            // Auswahl nur bestimmter Layer.
            var map_layers = new Object();
            if (settings_map_layers == "" || settings_map_layers.length < 1) map_layers = all_map_layers;
            else {
                for (var i = 0; i < settings_map_layers.length; i++) map_layers[settings_map_layers[i]] = all_map_layers[settings_map_layers[i]];
            }
            // Layer Control aufbauen.
            function addLayerControl() {
                injectPageScriptFunction(function(map_layers, map_overlays, settings_map_default_layer, settings_show_hillshadow) {
                    window["GCLittleHelper_MapLayerHelper"] = function(map_layers, map_overlays, settings_map_default_layer, settings_show_hillshadow) {
                        if (!window.MapSettings.Map) {
                            setTimeout(function() {window["GCLittleHelper_MapLayerHelper"](map_layers, map_overlays, settings_map_default_layer, settings_show_hillshadow);}, 10);
                        } else {
                            var layerControl = new window.L.Control.Layers();
                            var layerToAdd = null;
                            var defaultLayer = null;
                            for (name in map_layers) {
                                layerToAdd = new L.tileLayer(map_layers[name].tileUrl, map_layers[name]);
                                layerControl.addBaseLayer(layerToAdd, name);
                                if (name == settings_map_default_layer) defaultLayer = layerToAdd;
                                else if (defaultLayer == null) defaultLayer = layerToAdd;
                            }
                            for (name in map_overlays) {
                                layerToAdd = new L.tileLayer(map_overlays[name].tileUrl, map_overlays[name]);
                                layerControl.addOverlay(layerToAdd, name);
                            }
                            window.MapSettings.Map.addControl(layerControl);
                            layerControl._container.className += " gclh_layers gclh_used";
                            window.MapSettings.Map.addLayer(defaultLayer);
                            if (settings_show_hillshadow) $('.leaflet-control-layers.gclh_layers .leaflet-control-layers-overlays').find('label input').first().click();
                            var side = $('.leaflet-control-layers')[0];
                            var div = document.createElement("div");
                            div.setAttribute("class", "gclh_dummy gclh_used");
                            var aTag = document.createElement("a");
                            aTag.setAttribute("class", "leaflet-control-layers dummy_for_gme gclh_dummy gclh_used");
                            div.appendChild(aTag);
                            side.parentNode.insertBefore(div, side);
                            // Defekte Layer entfernen. (GCVote verursacht hier gelegentlich einen Abbruch, weil der dort verwendete localStorageCache scheinbar unvollständige Layer belebt.)
                            try {
                                for (layerId in window.MapSettings.Map._layers) {
                                    if (window.MapSettings.Map._layers[layerId]._url !== -1) {
                                        window.MapSettings.Map.removeLayer(window.MapSettings.Map._layers[layerId]);
                                    }
                                }
                            } catch(e) {};
                        }
                    };
                    window["GCLittleHelper_MapLayerHelper"](map_layers, map_overlays, settings_map_default_layer, settings_show_hillshadow);
                }, "(" + JSON.stringify(map_layers) + "," + JSON.stringify(map_overlays) + ",'" + settings_map_default_layer + "'," + settings_show_hillshadow + ")");
            }
            // Layer Defaults setzen.
            function setDefaultsInLayer() {
                var defaultLayer = "";
                for (name in map_layers) {
                    if (name == settings_map_default_layer) defaultLayer = name;
                    else if (defaultLayer == "") defaultLayer = name;
                }
                var labels = $('.leaflet-control-layers.gclh_layers.gclh_used .leaflet-control-layers-base').find('label');
                if (labels) {
                    for (var i=0; i<labels.length; i++) {
                        if (labels[i].children[1].innerHTML.match(defaultLayer)) {
                            labels[i].children[0].click();
                            break;
                        }
                    }
                }
                var hs = ".gclh_layers.gclh_used .leaflet-control-layers-overlays";
                if ($(hs).find('label input')[0]) {
                    if ((settings_show_hillshadow == true && $(hs).find('label input')[0].checked != true) ||
                        (settings_show_hillshadow != true && $(hs).find('label input')[0].checked == true)) {
                        $(hs).find('label input').first().click();
                    }
                }
            }
            // Layer Controls überwachen.
            function loopAtLayerControls(waitCount) {
                if ($('.leaflet-control-layers').length != 0) {
                    var somethingDone = 0;
                    if ($('.leaflet-control-layers:not(".gclh_used")').find('img[title*="GCVote"]').length != 0) {
                        somethingDone++;
                        $('.leaflet-control-layers:not(".gclh_used")').find('img[title*="GCVote"]').closest('.leaflet-control-layers').addClass('gclh_used');
                    }
                    if ($('#gclh_geoservices_control.leaflet-control-layers:not(".gclh_used")').length != 0) {
                        somethingDone++;
                        $('#gclh_geoservices_control.leaflet-control-layers:not(".gclh_used")').addClass('gclh_used');
                    }
                    if (somethingDone == 0) {
                        if ($('.leaflet-control-layers:not(".gclh_used"):not(".gclh_layers")').length != 0) {
                            somethingDone++;
                            $('.leaflet-control-layers:not(".gclh_used"):not(".gclh_layers")').remove();
                        }
                    }
                    if (somethingDone != 0) setDefaultsInLayer();
                }
                waitCount++;
                if (waitCount <= 100) setTimeout(function(){loopAtLayerControls(waitCount);}, 50);
            }
            addLayerControl();
            loopAtLayerControls(0);
        } catch(e) {gclh_error("Add layers, control to map and set default layers:",e);}
    }

// Hide Map Header.
    if (document.location.href.match(/\.com\/map\//)) {
        try {
            function checkMapLeaflet(waitCount) {
                if ($('.leaflet-container')[0]) {
                    if (settings_hide_map_header) hide_map_header();
                    var sidebar = $('#searchtabs')[0];
                    var link = document.createElement("a");
                    link.appendChild(document.createTextNode("Hide/Show Header"));
                    link.href = "#";
                    link.addEventListener("click", hide_map_header, false);
                    // Link in Sidebar rechts orientieren wegen möglichem GC Tour script.
                    link.setAttribute("style", "float: right; padding-right: 3px;");
                    sidebar.appendChild(link);
                    // Link in Sidebar komplett anzeigen und auch nicht mehr überblenden, auch nicht durch GME.
                    appendCssStyle("#searchtabs {height: 63px !important; margin-top: 6px !important;} #searchtabs li a {padding: 0.625em 0.5em !important;}");
                } else {waitCount++; if (waitCount <= 50) setTimeout(function(){checkMapLeaflet(waitCount);}, 100);}
            }
            checkMapLeaflet(0);
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
        } catch(e) {gclh_error("Hide Map Header:",e);}
    }

// Change map parameter and add Homezone to map.
    if (document.location.href.match(/\.com\/map\//)) {
        try {
            function gclh_map_loaded() {
                if (settings_map_hide_sidebar) {
                    if (document.getElementById("searchtabs").parentNode.style.left != "-355px") {
                        var links = document.getElementsByTagName("a");
                        for (var i = 0; i < links.length; i++) {
                            if (links[i].className.match(/ToggleSidebar/)) {
                                links[i].click();
                                break;
                            }
                        }
                    }
                    function hideSidebarRest(waitCount) {
                        if ($('.groundspeak-control-findmylocation')[0] && $('.leaflet-control-scale')[0] && $('.leaflet-control-zoom')[0]) {
                            // Wenn externe Kartenfilter vorhanden, dann gibt es keinen Balken zur Sidebar.
                            if (document.location.href.match(/&asq=/)) var styleLeft = "15px";
                            else var styleLeft = "30px";
                            $('.groundspeak-control-findmylocation')[0].style.left = styleLeft;
                            $('.leaflet-control-scale')[0].style.left = styleLeft;
                            $('.leaflet-control-zoom')[0].style.left = styleLeft;
                        } else {waitCount++; if (waitCount <= 50) setTimeout(function(){hideSidebarRest(waitCount);}, 200);}
                    }
                    hideSidebarRest(0);
                }
                function addHomeZoneMap(unsafeWindow, home_lat, home_lng, settings_homezone_radius, settings_homezone_color, settings_homezone_opacity) {
                    settings_homezone_color = settings_homezone_color.replace("##", "#");
                    if (unsafeWindow == "none") unsafeWindow = window;
                    if (typeof home_lat == "undefined" || typeof home_lng == "undefined" || home_lat == null || home_lng == null) return;
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
                // Die Circles erst aufbauen wenn Karte fertig ist.
                function checkForAddHomeZoneMap(waitCount) {
                    if ($('.groundspeak-control-findmylocation')[0] && $('.leaflet-control-scale')[0]) {
                        if (settings_show_homezone) {
                            if (browser === "chrome" || browser === "firefox") {
                                injectPageScriptFunction(addHomeZoneMap, "('" + "none" + "', " + getValue("home_lat") + ", " + getValue("home_lng") + ", " + settings_homezone_radius + ", '#" + settings_homezone_color + "', " + settings_homezone_opacity + ")");
                            } else addHomeZoneMap(unsafeWindow, getValue("home_lat"), getValue("home_lng"), settings_homezone_radius, "#" + settings_homezone_color, settings_homezone_opacity);
                            for (var i in settings_multi_homezone) {
                                var curHz = settings_multi_homezone[i];
                                if (browser === "chrome" || browser === "firefox") {
                                    injectPageScriptFunction(addHomeZoneMap, "('" + "none" + "', " + curHz.lat + ", " + curHz.lng + ", " + curHz.radius + ", '#" + curHz.color + "', " + curHz.opacity + ")");
                                } else addHomeZoneMap(unsafeWindow, curHz.lat, curHz.lng, curHz.radius, "#" + curHz.color, curHz.opacity);
                            }
                        }
                    } else {waitCount++; if (waitCount <= 25) setTimeout(function(){checkForAddHomeZoneMap(waitCount);}, 200);}
                }
                checkForAddHomeZoneMap(0);
            }
            window.addEventListener("load", gclh_map_loaded, false);
            appendCssStyle(".leaflet-control-layers-base {min-width: 200px;}");
        } catch(e) {gclh_error("Change map parameter and add Homezone to map:",e);}
    }

// Add links to Google, OSM, Flopp's und GeoHack Map on GC Map.
    if (is_page("map") && (settings_add_link_google_maps_on_gc_map || settings_add_link_osm_on_gc_map || settings_add_link_flopps_on_gc_map || settings_add_link_geohack_on_gc_map)) {
        try {
            function getMapCooords() {
                // Mögliche url Zusammensetzungen, Beispiele: https://www.geocaching.com/map ...
                // 1. /default.aspx?lat=50.889233&lng=13.386967#?ll=50.89091,13.39551&z=14
                //    /default.aspx?lat=50.889233&lng=13.386967#clist?ll=50.89172,13.36779&z=14
                //    /default.aspx?lat=50.889233&lng=13.386967#pq?ll=50.89204,13.36667&z=14
                //    /default.aspx?lat=50.889233&lng=13.386967#search?ll=50.89426,13.35955&z=14
                // 2. /?ll=50.89093,13.38437#?ll=50.89524,13.35912&z=14
                // 3. /#?ll=50.95397,6.9713&z=15
                var matches = document.location.href.match(/\\?ll=(-?[0-9.]*),(-?[0-9.]*)&z=([0-9.]*)/); // Beispiel 1., 2. und 3. hinten
                var matchesMarker = document.location.href.match(/\\?lat=(-?[0-9.]*)&lng=(-?[0-9.]*)/);  // Beispiel 1. vorne
                if (matchesMarker == null) {
                    var matchesMarker = document.location.href.match(/\\?ll=(-?[0-9.]*),(-?[0-9.]*)#/);  // Beispiel 2. vorne
                    if (matchesMarker == null) {
                        var matchesMarker = matches;                                                     // Beispiel 3.
                    }
                }
                var coords = null;
                if (matches != null && matchesMarker != null) {
                    coords = new Object();
                    coords.zoom = matches[3];
                    coords.lat = matches[1];
                    coords.lon = matches[2];
                    coords.markerLat = matchesMarker[1];
                    coords.markerLon = matchesMarker[2];
                    var latd = coords.lat;
                    var lond = coords.lon;
                    sign = latd > 0 ? 1 : -1;
                    coords.latOrient = latd > 0 ? 'N' : 'S';
                    latd *= sign;
                    coords.latDeg = Math.floor(latd);
                    coords.latMin = Math.floor((latd - coords.latDeg) * 60);
                    coords.latSec = Math.floor((latd - coords.latDeg - coords.latMin / 60) * 3600);
                    sign = lond > 0 ? 1 : -1;
                    coords.lonOrient = lond > 0 ? 'E' : 'W';
                    lond *= sign;
                    coords.lonDeg = Math.floor(lond);
                    coords.lonMin = Math.floor((lond - coords.lonDeg) * 60);
                    coords.lonSec = Math.floor((lond - coords.lonDeg - coords.lonMin / 60) * 3600);
                }
                return coords;
            }
            var urlGoogleMaps = 'https://maps.google.de/maps?q={markerLat},{markerLon}&z={zoom}&ll={lat},{lon}';
            var urlOSM = 'https://www.openstreetmap.org/?#map={zoom}/{lat}/{lon}';
            var urlFlopps = 'http://flopp.net/?c={lat}:{lon}&z={zoom}&t=OSM&f=n&m=&d=';
            var urlGeoHack = "https://tools.wmflabs.org/geohack/geohack.php?pagename=Geocaching&params={latDeg}_{latMin}_{latSec}_{latOrient}_{lonDeg}_{lonMin}_{lonSec}_{lonOrient}";
            function replaceData(str, coords) {
                re = new RegExp("\{[a-zA-Z]+\}", "g");
                var replacements = str.match(re);
                if (replacements != null) {
                    for (var i=0; i<replacements.length; i++) {
                        var replacement = replacements[i];
                        var name = replacement.substring(1,replacement.length-1);
                        if (name in coords) str = str.replace(replacement, coords[name]);
                    }
                }
                return str;
            }
            function callGeoService(url, in_same_tab) {
                var coords = getMapCooords();
                if (coords != null) {
                    url = replaceData(url, coords);
                    if (in_same_tab) location = url;
                    else window.open(url);
                } else alert('This map has no geographical coordinates in its link. Just zoom or drag the map, afterwards this will work fine.');
            }
            function initGeoServiceControl() {
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
                var style = 'style="padding: 5px; cursor: pointer; color: #000;"';
                if (settings_add_link_google_maps_on_gc_map) $("#gclh_geoservices_list").append('<a id="gclh_geoservice_googlemaps"'+style+'>Google Maps</a>');
                if (settings_add_link_osm_on_gc_map) $("#gclh_geoservices_list").append('<a id="gclh_geoservice_osm"'+style+'>Openstreepmap</a>');
                if (settings_add_link_flopps_on_gc_map) $("#gclh_geoservices_list").append('<a id="gclh_geoservice_flopps"'+style+'>Flopp\'s Map</a>');
                if (settings_add_link_geohack_on_gc_map) $("#gclh_geoservices_list").append('<a id="gclh_geoservice_geohack"'+style+'>GeoHack</a>');
                $("#gclh_geoservice_googlemaps").click(function() {callGeoService(urlGoogleMaps, settings_switch_to_google_maps_in_same_tab);});
                $("#gclh_geoservice_osm").click(function() {callGeoService(urlOSM, settings_switch_to_osm_in_same_tab);});
                $("#gclh_geoservice_flopps").click(function() {callGeoService(urlFlopps, settings_switch_to_flopps_in_same_tab);});
                $("#gclh_geoservice_geohack").click(function() {callGeoService(urlGeoHack, settings_switch_to_geohack_in_same_tab);});
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
                // Damit auch mehr als 2 Buttons handlebar.
                appendCssStyle(".leaflet-control-layers + .leaflet-control {position: unset; right: unset;} .leaflet-control {clear: left}");
            }
            function attachGeoServiceControl(waitCount) {
                // Prüfen, ob Layers schon vorhanden sind, erst dann den Button hinzufügen.
                if ($('.leaflet-control-layers-base').find('input.leaflet-control-layers-selector')[0]) {
                    // Damit Button nicht ständig den Platz wechselt, um 1 Sekunden verzögern.
                    setTimeout(initGeoServiceControl, 1000);
                } else {waitCount++; if (waitCount <= 50) setTimeout(function(){attachGeoServiceControl(waitCount);}, 100);}
            }
            attachGeoServiceControl(0);
        } catch(e) {gclh_error("Add links to Google, OSM, Flopp's und GeoHack Map on GC Map:",e);}
    }

// Hide found/hidden Caches on Map. Add Buttons for hiding/showing all Caches.
    if (document.location.href.match(/\.com\/map\//) && !$('#uxGoogleMapsSelect')[0] &&  // Nicht bei Screen Map Preferences.
        !document.location.href.match(/\.com\/map\/default.aspx\?pq/)) {  // Nicht bei PQ-Anzeige.
        try {
            function hideFoundCaches() {
                // Kartenfilter bei externen Filtern (beispielsweise aus play/search) nicht verändern.
                if (document.location.href.match(/&asq=/)) return;
                var button = unsafeWindow.document.getElementById("m_myCaches").childNodes[1];
                if (button) button.click();
            }
            if (settings_map_hide_found) window.addEventListener("load", hideFoundCaches, false);
            function hideHiddenCaches() {
                if (document.location.href.match(/&asq=/)) return;
                var button = unsafeWindow.document.getElementById("m_myCaches").childNodes[3];
                if (button) button.click();
            }
            function getAllCachetypeButtons(){
                return ['Legend2', 'Legend9', 'Legend3', 'Legend6', 'Legend13', 'Legend453', 'Legend7005', 'Legend1304', 'Legend137', 'Legend4', 'Legend11', 'Legend8', 'Legend5', 'Legend1858'];
            }
            function hideAllCacheTypes(){
                var cacheTypes = getAllCachetypeButtons();
                cacheTypes.forEach(hideCacheType);
            }
            function hideCacheType(item){
                if (document.getElementById(item).className.indexOf('ct_untoggled') === -1) document.getElementById(item).click();
            }
            function showCacheType(item){
                if (document.getElementById(item).className.indexOf('ct_untoggled') !== -1) document.getElementById(item).click();
            }
            function showAllCacheTypes(){
                var cacheTypes = getAllCachetypeButtons();
                cacheTypes.forEach(showCacheType);
            }
            var ul = document.getElementById("m_cacheTypes");
            var li = document.createElement("li");
            var a = document.createElement('a');
            a.appendChild(document.createTextNode("Hide all Cachetypes"));
            a.title = "Hide all Caches";
            a.href = "#";
            li.appendChild(a);
            ul.appendChild(li);
            li.onclick = function() {hideAllCacheTypes();};
            li = document.createElement("li");
            a = document.createElement('a');
            a.appendChild(document.createTextNode("Show all Cachetypes"));
            a.title = "Show all Caches";
            a.href = "#";
            li.appendChild(a);
            ul.appendChild(li);
            li.onclick = function() {showAllCacheTypes();};
            if (settings_map_hide_hidden) window.addEventListener("load", hideHiddenCaches, false);
            // Apply Cache Type Filter.
            function hideCacheTypes() {
                if (document.location.href.match(/&asq=/)) return;
                // Cache Types auf hidden setzen.
                if (settings_map_hide_2    && $('#Legend2')[0])    {$('#Legend2')[0].click();    $('#Legend2')[0].setAttribute("class", "ct_toggle ct2 ct_untoggled");}
                if (settings_map_hide_9    && $('#Legend9')[0])    {$('#Legend9')[0].click();    $('#Legend9')[0].setAttribute("class", "ct_toggle ct9 ct_untoggled");}
                if (settings_map_hide_5    && $('#Legend5')[0])    {$('#Legend5')[0].click();    $('#Legend5')[0].setAttribute("class", "ct_toggle ct5 ct_untoggled");}
                if (settings_map_hide_3    && $('#Legend3')[0])    {$('#Legend3')[0].click();    $('#Legend3')[0].setAttribute("class", "ct_toggle ct3 ct_untoggled");}
                if (settings_map_hide_6    && $('#Legend6')[0])    {$('#Legend6')[0].click();    $('#Legend6')[0].setAttribute("class", "ct_toggle ct6 ct_untoggled");}
                if (settings_map_hide_453  && $('#Legend453')[0])  {$('#Legend453')[0].click();  $('#Legend453')[0].setAttribute("class", "ct_toggle ct453 ct_untoggled");}
                if (settings_map_hide_7005 && $('#Legend7005')[0]) {$('#Legend7005')[0].click(); $('#Legend7005')[0].setAttribute("class", "ct_toggle ct7005 ct_untoggled");}
                if (settings_map_hide_13   && $('#Legend13')[0])   {$('#Legend13')[0].click();   $('#Legend13')[0].setAttribute("class", "ct_toggle ct13 ct_untoggled");}
                if (settings_map_hide_1304 && $('#Legend1304')[0]) {$('#Legend1304')[0].click(); $('#Legend1304')[0].setAttribute("class", "ct_toggle ct1304 ct_untoggled");}
                if (settings_map_hide_4    && $('#Legend4')[0])    {$('#Legend4')[0].click();    $('#Legend4')[0].setAttribute("class", "ct_toggle ct4 ct_untoggled");}
                if (settings_map_hide_11   && $('#Legend11')[0])   {$('#Legend11')[0].click();   $('#Legend11')[0].setAttribute("class", "ct_toggle ct11 ct_untoggled");}
                if (settings_map_hide_137  && $('#Legend137')[0])  {$('#Legend137')[0].click();  $('#Legend137')[0].setAttribute("class", "ct_toggle ct137 ct_untoggled");}
                if (settings_map_hide_8    && $('#Legend8')[0])    {$('#Legend8')[0].click();    $('#Legend8')[0].setAttribute("class", "ct_toggle ct8 ct_untoggled");}
                if (settings_map_hide_1858 && $('#Legend1858')[0]) {$('#Legend1858')[0].click(); $('#Legend1858')[0].setAttribute("class", "ct_toggle ct1858 ct_untoggled");}
                // Gesamte Reihen zu den Cache Types auf hidden setzen.
                if (settings_map_hide_2) $('#LegendGreen')[0].childNodes[0].setAttribute("class", "a_cat_displayed cat_untoggled");
                if (settings_map_hide_3) $('#LegendYellow')[0].childNodes[0].setAttribute("class", "a_cat_displayed cat_untoggled");
                if (settings_map_hide_6 && settings_map_hide_453 && settings_map_hide_7005 && settings_map_hide_13) $('#LegendRed')[0].childNodes[0].setAttribute("class", "a_cat_displayed cat_untoggled");
                if (settings_map_hide_4 && settings_map_hide_11 && settings_map_hide_137) $('#chkLegendWhite')[0].childNodes[0].setAttribute("class", "a_cat_displayed cat_untoggled");
                if (settings_map_hide_8 && settings_map_hide_5 && settings_map_hide_1858) $('#chkLegendBlue')[0].childNodes[0].setAttribute("class", "a_cat_displayed cat_untoggled");
            }
            window.addEventListener("load", hideCacheTypes, false);
        } catch(e) {gclh_error("Hide found/hidden Caches / Cache Types on Map:",e);}
    }

// Display Google-Maps warning, wenn Leaflet-Map nicht aktiv ist.
    if (document.location.href.match(/\.com\/map\//)) {
        try {
            function checkMap(waitCount) {
                // Wenn Leaflet-Map aktiv, alles ok, Kz aktiv merken.
                if ($('.leaflet-container')[0]) {
                    setValue("gclhLeafletMapActive", true);
                    return;
                }
                // Wenn Screen "Set Map Preferences", Leaflet-Map wird nicht kommen, also nichts tun.
                if ($('.container')[0]) return;
                waitCount++;
                if (waitCount <= 5) setTimeout(function(){checkMap(waitCount);}, 1000);
                else {
                    // Wenn Leaflet-Map Kz aktiv und Screen "Set Map Preferences" nicht angezeigt wird, dann ist Google aktiv.
                    // Prüfen, ob zuvor Leaflet-Map aktiv war, Status sich also geändert hat, dann Meldung ausgeben, neuen Status "nicht aktiv" merken.
                    if (getValue("gclhLeafletMapActive", true)) {
                        var mess = "Please note, that GC little helper only supports\n"
                                 + "the Leaflet-Map. You are using the Google-Map.\n\n"
                                 + "You can change the map in the left sidebar with \n"
                                 + "the button \"Set Map Preferences\".";
                        alert(mess);
                        setValue("gclhLeafletMapActive", false);
                    }
                }
            }
            checkMap(0);
        } catch(e) {gclh_error("Display Google-Maps warning:",e);}
    }

// Display more informations on map popup for a cache
    if (document.location.href.match(/\.com\/map\//) && settings_show_enhanced_map_popup) {
        try {

            // select the target node
            var target = document.querySelector('.leaflet-popup-pane');

            var css = "div.popup_additional_info .loading_container{display: flex; min-height:68px; justify-content: center; align-items: center;}"
                    + "div.popup_additional_info .loading_container img{margin-right:5px;}"
                    + "div.popup_additional_info span.favi_points svg, div.popup_additional_info span.tackables svg{position: relative;top: 4px;}";
            appendCssStyle(css);

            // create an observer instance
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    gccode = $('#gmCacheInfo .code').html();
                    if(gccode == null) return;

                    // New Popup. This can contain more than one cache (if 2 or more are close together)
                    // so we have to load informations for all caches.
                    $('#gmCacheInfo .map-item').each(function () {
                        gccode = $(this).find('.code').html();

                        // Add Loading image
                        $(this).append('<div id="popup_additional_info_' + gccode +'" class="links Clear popup_additional_info"><div class="loading_container"><img src="' + urlImages + 'ajax-loader.gif" />Loading additional Data...</div></div>');

                        $.get('https://www.geocaching.com/geocache/'+gccode, null, function(text){

                            // We need to retriev the gc_code from the loaded page, because in the
                            // meantime the global varioable gc_code could (and will be ;-)) changed
                            var local_gc_code = $(text).find('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode').html();

                            // get the last logs
                            initalLogs_from_cachepage = text.substr(text.indexOf('initalLogs = {"status')+13, text.indexOf('} };') - text.indexOf('initalLogs = {"status') - 10);
                            var initalLogs = JSON.parse(initalLogs_from_cachepage);
                            var last_logs = document.createElement("div");
                            var last_logs_to_show = settings_show_latest_logs_symbols_count_map;
                            var lateLogs = new Array();
                            for (var i = 0; i < initalLogs['data'].length; i++) {
                                if (last_logs_to_show == i) break;
                                var lateLog = new Object();
                                lateLog['user'] = initalLogs['data'][i].UserName;
                                lateLog['src']  = '/images/logtypes/' + initalLogs['data'][i].LogTypeImage;
                                lateLog['type'] = initalLogs['data'][i].LogType;
                                lateLog['date'] = initalLogs['data'][i].Created;
                                lateLog['log']  = initalLogs['data'][i].LogText;
                                lateLogs[i]     = lateLog;
                            }
                            if (lateLogs.length > 0) {
                                var div = document.createElement("div");
                                div.id = "gclh_latest_logs";
                                div.setAttribute("style", "padding-right: 0; padding-top: 5px; padding-bottom: 5px; display: flex;");

                                var span = document.createElement("span");
                                span.setAttribute("style", "white-space: nowrap; margin-right: 5px; margin-top: 5px;");
                                span.appendChild(document.createTextNode('Latest logs:'));
                                div.appendChild(span);
                                var inner_div = document.createElement("div");
                                inner_div.setAttribute("style", "display: flex; flex-wrap: wrap;");
                                div.appendChild(inner_div);
                                for (var i = 0; i < lateLogs.length; i++) {
                                    var div_log_wrapper = document.createElement("div");
                                    div_log_wrapper.className = "gclh_latest_log";
                                    var img = document.createElement("img");
                                    img.src = lateLogs[i]['src'];
                                    img.setAttribute("style", "padding-left: 2px; vertical-align: bottom; float:left;");
                                    var log_text = document.createElement("span");
                                    log_text.title = "";
                                    log_text.innerHTML = "<img src='" + lateLogs[i]['src'] + "'> <b>" + lateLogs[i]['user'] + " - " + lateLogs[i]['date'] + "</b><br>" + lateLogs[i]['log'];
                                    div_log_wrapper.appendChild(img);
                                    div_log_wrapper.appendChild(log_text);
                                    inner_div.appendChild(div_log_wrapper);
                                }
                                last_logs.appendChild(div);
                                var css = "div.gclh_latest_log {margin-top:5px;}"
                                        + "div.gclh_latest_log:hover {position: relative;}"
                                        + "div.gclh_latest_log span {display: none; position: absolute; left: 0px; width: 500px; padding: 5px; text-decoration:none; text-align:left; vertical-align:top; color: #000000;}"
                                        + "div.gclh_latest_log:hover span {font-size: 13px; display: block; top: 16px; border: 1px solid #8c9e65; background-color:#dfe1d2; z-index:10000;}";
                                appendCssStyle(css);
                            }

                            // get all type of logs and their count
                            var all_logs = $(text).find('.LogTotals')[0].innerHTML;

                            // get the number of trackables in the cache
                            var trachables = 0;
                            // var tb_elements = $(text).find('.CacheDetailNavigationWidget').has('#ctl00_ContentBody_uxTravelBugList_uxInventoryLabel');
                            $(text).find('.CacheDetailNavigationWidget').each(function(){
                                tb_text = $(this).html();
                                if(tb_text.indexOf('ctl00_ContentBody_uxTravelBugList_uxInventoryLabel') !== -1){
                                    // There are two Container with .CacheDetailNavigationWidget so we are only processing the
                                    // one that contains the TB informations
                                    trachables = (tb_text.match(/<li>/g)||[]).length;
                                }
                            });

                            // get the total number of finds
                            var start = all_logs.indexOf('>',all_logs.indexOf('Found it')) + 1;
                            var end = all_logs.indexOf('&nbsp',start);

                            var total_finds_for_favi = all_logs.substr(start, end-start);
                            total_finds_for_favi = total_finds_for_favi.replace('.','');
                            total_finds_for_favi = total_finds_for_favi.replace(',','');

                            total_finds_for_favi = parseInt(total_finds_for_favi);

                            // get the number of favorite points
                            var fav_points = $(text).find('.favorite-value').html();
                            if(fav_points == null){
                                // couldn't get Number of Favorits. This happens with event caches for example
                                fav_points = 0;
                            }else{
                                fav_points = fav_points.replace('.','');
                                fav_points = fav_points.replace(',','');
                                fav_points = parseInt(fav_points);
                            }

                            var fav_percent = '-';
                            if(fav_points > 0){
                                fav_percent = Math.round((100 * fav_points) / total_finds_for_favi) + '%';
                            }

                            // get the place, where the cache was placed
                            var place = $(text).find('#ctl00_ContentBody_Location')[0].innerHTML;

                            // Put all together
                            var new_text = '<span style="margin-right: 5px;">Logs:</span>' + all_logs.replace(/&nbsp;/g, " ") + '<br>';
                            new_text += $(last_logs).prop('outerHTML');
                            new_text += 'Place: ' + place + ' | ';
                            new_text += '<span class="favi_points"><svg height="16" width="16"><image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/images/icons/fave_fill_16.svg" src="/images/icons/fave_fill_16.png" width="16" height="16" alt="Favorite points"></image></svg> ' + fav_percent + '</span> | ';
                            new_text += '<span class="tackables"><svg height="16" width="16" class="icon-sm"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/account/app/ui-icons/sprites/global.svg#icon-travelbug-default"></use></svg></span> ' + trachables + '<br>';

                            $('#popup_additional_info_' + local_gc_code).html(new_text);

                        });

                        // Improve Original Box Content
                        side = $(this).find('dl dd a');
                        guid = side.attr('href').substring(15,36+15);
                        username = side.text();

                        buildSendIcons(side[0], username, "per guid", guid);

                        var link = gclh_build_vipvup(username, global_vips, "vip");
                        link.children[0].style.marginLeft = "5px";
                        link.children[0].style.marginRight = "2px";
                        side[0].appendChild(document.createTextNode(" "));
                        side[0].appendChild(link);
                        // Build VUP Icon.
                        if (settings_process_vup && username != global_activ_username) {
                            link = gclh_build_vipvup(username, global_vups, "vup");
                            link.children[0].setAttribute("style", "margin-left: 0px; margin-right: 0px");
                            side[0].appendChild(document.createTextNode(" "));
                            side[0].appendChild(link);
                        }

                    });
                });
            });

            // configuration of the observer:
            var config = { attributes: true, childList: true, characterData: true }

            // pass in the target node, as well as the observer options
            observer.observe(target, config);

        } catch(e) {gclh_error("enhance cache popup",e);}
    }

// Leaflet Map für Trackables vergrößern und Zoom per Mausrad zulassen.
    if (document.location.href.match(/\.com\/track\/map/)) {
        try{
            $('#map_canvas').append('<div class="ui-resizable-handle ui-resizable-s" id="sgrip" style="width: 24px;height: 4px;background-color: transparent;border-top: 1px solid black;border-bottom: 1px solid black;bottom: 0px;left: 98%;transform: rotate(-45deg);"></div>');
            appendCssStyle('#map_canvas{ height: 450px;} .leaflet-bottom.leaflet-right {margin-right: 20px;}');
            var scriptText = "map.invalidateSize(); map.scrollWheelZoom.enable(); $('#map_canvas').resizable({handles: {'s': '#sgrip'}, minHeight: 300, maxHeight: 700, stop: function( event, ui ) {map.invalidateSize();}});";
            insertScript(scriptText, 'head');
        } catch(e) {gclh_error("tb_map_enhancement:",e);}
    }

// Improve cache matrix on statistics page and public profile page and handle cache search links in list or map.
    try {
        if ((settings_count_own_matrix || settings_count_own_matrix_show_next) && isOwnStatisticsPage()) {
            var own = true;
        } else if (settings_count_foreign_matrix && is_page("publicProfile") && $('#ctl00_ContentBody_lblUserProfile')[0] && !$('#ctl00_ContentBody_lblUserProfile')[0].innerHTML.match(": " + global_me)) {
            var own = false;
        } else var own = "";
        if (own !== "") {
            // Matrix ermitteln.
            if (document.getElementById('ctl00_ContentBody_StatsDifficultyTerrainControl1_uxDifficultyTerrainTable')) {
                var table = document.getElementById('ctl00_ContentBody_StatsDifficultyTerrainControl1_uxDifficultyTerrainTable');
            } else if (document.getElementById("ctl00_ContentBody_ProfilePanel1_StatsDifficultyTerrainControl1_uxDifficultyTerrainTable")) {
                var table = document.getElementById("ctl00_ContentBody_ProfilePanel1_StatsDifficultyTerrainControl1_uxDifficultyTerrainTable");
            }
            if (table) {
                // Matrixerfüllung berechnen.
                var smallest = parseInt(table.getElementsByClassName("stats_cellfooter_grandtotal")[0].innerHTML);
                var count = 0;
                var cells = table.getElementsByTagName('td');
                for (var i = 0; i < cells.length; i++) {
                    var cell = cells[i];
                    if (cell.id.match(/^([1-9]{1})(_{1})([1-9]{1})$/)) {
                        if (parseInt(cell.innerHTML) == smallest) count++;
                        else if (parseInt(cell.innerHTML) < smallest) {
                            smallest = parseInt(cell.innerHTML);
                            count = 1;
                        }
                    }
                }
                // Matrixerfüllung ausgeben.
                if ((own == true && settings_count_own_matrix == true) || (own == false && settings_count_foreign_matrix == true)) {
                    if (smallest > 0) var matrix = " (" + smallest + " complete and (" + (81 - count) + "/81))";
                    else var matrix = " (" + (81 - count) + "/81)";
                    if (document.getElementById('uxDifficultyTerrainHelp').previousSibling) {
                        var side = document.getElementById('uxDifficultyTerrainHelp').previousSibling;
                        side.nodeValue += matrix;
                    }
                }
                // Nächste mögliche Matrix farblich kennzeichnen und Search Link und Title setzen.
                if (own == true && settings_count_own_matrix_show_next == true) {
                    var from = smallest;
                    var to = smallest - 1 + parseInt(settings_count_own_matrix_show_count_next);
                    var color = "#" + settings_count_own_matrix_show_color_next;
                    for (var i = 0; i < cells.length; i++) {
                        var cell = cells[i];
                        if (cell.id.match(/^([1-9]{1})(_{1})([1-9]{1})$/)) {
                            if (from <= parseInt(cell.innerHTML) && parseInt(cell.innerHTML) <= to) {
                                cell.style.color = "black";
                                var diff = parseInt(cell.innerHTML) - from;
                                cell.style.backgroundColor = color;
                                switch (diff) {
                                    case 1: cell.style.backgroundColor = cell.style.backgroundColor.replace(/rgb/i, "rgba").replace(/\)/, ",0.6)"); break;
                                    case 2: cell.style.backgroundColor = cell.style.backgroundColor.replace(/rgb/i, "rgba").replace(/\)/, ",0.4)"); break;
                                    case 3: cell.style.backgroundColor = cell.style.backgroundColor.replace(/rgb/i, "rgba").replace(/\)/, ",0.25)"); break;
                                }
                                if (settings_count_own_matrix_links_radius != 0) {
                                    var terrain = parseInt(cell.id.match(/^([1-9]{1})(_{1})([1-9]{1})$/)[3]) * 0.5 + 0.5;
                                    var difficulty = parseInt(cell.id.match(/^([1-9]{1})(_{1})([1-9]{1})$/)[1]) * 0.5 + 0.5;
                                    var user = global_me;
                                    var aTag = document.createElement('a');
                                    aTag.href = "/play/search/?origin=" + DectoDeg(getValue("home_lat"), getValue("home_lng"))
                                              + "&radius=" + settings_count_own_matrix_links_radius + "km"
                                              + "&t=" + terrain + "&d=" + difficulty + "&nfb[0]=" + user + "&f=2&o=2&nfb\[1\]=GClh";
                                    if (settings_count_own_matrix_links == "map") aTag.href += "#GClhMap";
                                    else aTag.href += "#searchResultsTable";
                                    aTag.title = "Search D" + difficulty + "/T" + terrain + " radius " + settings_count_own_matrix_links_radius + " km from home";
                                    aTag.target = "_blank";
                                    aTag.style.color = "black";
                                    aTag.appendChild(document.createTextNode(cell.innerHTML));
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
        if (document.location.href.match(/\.com\/play\/search\/@(.*)&nfb\[1\]=GClh/)) {
            $('#map_container').remove();
            $('.selected-filters').remove();
            if (document.location.href.match(/#GClhMap/)) {
                if ($('.btn-map-these')[0]) {
                    location.replace($('.btn-map-these')[0].href);
                    $('.content-slide').remove();
                }
            }
        }
    } catch(e) {gclh_error("Improve cache matrix:",e);}

// Improve own statistics page and own profile page with own log statistic.
    if (settings_log_statistic && isOwnStatisticsPage()) {
        try {
            getLogSt("cache", "/my/logs.aspx?s=1");
            getLogSt("track", "/my/logs.aspx?s=2");
        } catch(e) {gclh_error("Improve own log statistic:",e);}
    }
    function getLogSt(type, url, manual) {
        var logsName = (type == "cache" ? "Cache":"Trackable") + " logs";
        var logsId = "gclh_" + type + "_logs_";
        var get_last = parseInt(getValue(logsId + "get_last"), 10);
        if (!get_last) get_last = 0;
        var reload_after = (settings_log_statistic_reload === "" ? "0" : parseInt(settings_log_statistic_reload, 10) * 60 * 60 * 1000);
        var time = new Date().getTime();
        if ((reload_after != 0 && (get_last + reload_after) < time) || manual == true) {
            if (manual != true) setLogStHF(type, logsName, logsId, url);
            setLogStClear(type, logsName, logsId);
            setLogStAddWait(type, logsName, logsId);
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    var logCount = new Array();
                    for (var i = 0; i < 101; i++) {
                        var count = response.responseText.match(new RegExp("/images/logtypes/" + i + ".png", "g"));
                        if (count) {
                            // Das "?" in "(.*?)" bedeutet "nicht gierig", das heißt es wird das erste Vorkommen verwendet.
                            var title = response.responseText.match('/images/logtypes/' + i + '.png"(.*?)title="(.*?)"');
                            if (title && title[2]) {
                                if (type == "track") {
                                    if      (i == 4)  var lt = "&lt=3";
                                    else if (i == 13) var lt = "&lt=5";
                                    else if (i == 14) var lt = "&lt=10";
                                    else if (i == 19) var lt = "&lt=2";
                                    else if (i == 48) var lt = "&lt=48";
                                    else if (i == 75) var lt = "&lt=75";
                                    else              var lt = "";
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
                    if (logCount.length > 0) setValue(logsId + "get_last", time);
                    setValue(logsId + "count", JSON.stringify(logCount));
                    var now = new Date().getTime();
                    var generated = Math.ceil((now - time) / (60 * 1000));  // In Minuten.
                    setLogStClear(type, logsName, logsId);
                    setLogSt(type, logsName, logsId, generated);
                }
            });
        } else if (reload_after == 0 && get_last == 0) {
            setLogStHF(type, logsName, logsId, url);
            setLogStDummy(type, logsName, logsId);
        } else {
            var generated = Math.ceil((time - get_last) / (60 * 1000));  // In Minuten.
            setLogStHF(type, logsName, logsId, url);
            setLogStClear(type, logsName, logsId);
            setLogSt(type, logsName, logsId, generated);
        }
    }
    function setLogStHF(type, logsName, logsId, url) {
        if ($('#ctl00_ContentBody_StatsChronologyControl1_YearlyBreakdown, #ctl00_ContentBody_ProfilePanel1_StatsChronologyControl1_YearlyBreakdown')[0]) {
            var side = $('#ctl00_ContentBody_StatsChronologyControl1_YearlyBreakdown, #ctl00_ContentBody_ProfilePanel1_StatsChronologyControl1_YearlyBreakdown')[0];
        }
        if (side) {
            var div = document.createElement("div");
            div.className = (type == "cache" ? "span-9":"span-9 last");
            var html = '';
            html += '<br> <h3> <a href="' + url + '" title="' + logsName + '" style="text-decoration: unset; color: rgb(89, 74, 66)" >Total ' + logsName + ':</a> </h3>';
            html += '<table class="Table">';
            html += '  <thead> <tr> <th scope="col"> Name </th> <th scope="col" class="AlignRight">' + (settings_log_statistic_percentage ? " % " : " ") + '</th> <th scope="col" class="AlignRight"> Count </th> </tr> </thead>';
            html += '  <tfoot style="font-style: normal;">';
            html += '    <tr><td><a href="' + url + '" title="' + logsName + '" style="text-decoration: unset; color: rgb(89, 74, 66)" >Total ' + logsName + ':</a></td>';
            html += '      <td id="' + logsId + 'percentage" class="AlignRight"></td>';
            html += '      <td id="' + logsId + 'total" class="AlignRight"></td></tr>';
            html += '    <tr><td style="background-color: unset; line-height: 1em;"><span id="' + logsId + 'generated" style="font-size: 11px;" ></span></td>';
            html += '      <td class="AlignRight" style="background-color: unset; line-height: 1em;"></td>';
            html += '      <td class="AlignRight" style="background-color: unset; line-height: 1em;"><a id="' + logsId + 'reload" href="javascript:void(0);" style="font-size: 11px;" ></a></td></tr>';
            html += '  </tfoot>';
            html += '  <tbody id="' + logsId + 'body"> </tbody>';
            html += '</table>';
            div.innerHTML = html;
            side.appendChild(div);
            $('#'+logsId+'reload')[0].addEventListener("click", function() {getLogSt(type, url, true);}, false);
        }
    }
    function setLogSt(type, logsName, logsId, generated) {
        var logCount = getValue(logsId + "count");
        if (logCount) logCount = JSON.parse(logCount.replace(/, (?=,)/g, ",null"));
        if (logCount.length > 0 && $('#'+logsId+'body')[0]) {
            var side = $('#'+logsId+'body')[0];
            logCount.sort(function(entryA, entryB) {
                if (entryA.count < entryB.count) return 1;
                if (entryA.count > entryB.count) return -1;
                return 0;
            });
            var total = 0;
            logCount.forEach(function(entry) {total += entry.count;});
            for (var i = 0; i < logCount.length; i++) {
                var tr = document.createElement("tr");
                var html = '';
                html += '<td class="AlignLeft">';
                html += '  <a title="' + logCount[i]["title"] + ' logs" href="' + logCount[i]["href"] + '" style="text-decoration: unset;" >';
                html += '    <img src="' + logCount[i]["src"] + '" style="vertical-align: sub;" >';
                html += '    <span style="text-decoration: underline; margin-left: 4px;" >' + logCount[i]["title"] + '</span>';
                html += '  </a>';
                html += '</td>';
                html += '<td class="AlignRight"> <span>' + (settings_log_statistic_percentage ? (Math.round(logCount[i]["count"] * 100 * 100 / total) / 100).toFixed(2) : "") + '</span> </td>';
                html += '<td class="AlignRight"> <span>' + logCount[i]["count"] + '</span> </td>';
                tr.innerHTML = html;
                side.appendChild(tr);
            }
            if ($('#'+logsId+'total')[0]) $('#'+logsId+'total')[0].innerHTML = total;
            if ($('#'+logsId+'generated')[0]) {
                $('#'+logsId+'generated')[0].innerHTML = "Generated " + buildTimeString(generated) + " ago";
                var reload_after = parseInt(settings_log_statistic_reload, 10) * 60;
                if (reload_after > 0) $('#'+logsId+'generated')[0].title = "Automated reload in " + buildTimeString(reload_after - generated);
            }
            if ($('#'+logsId+'reload')[0]) {
                $('#'+logsId+'reload')[0].innerHTML = "Reload";
                $('#'+logsId+'reload')[0].title = "Reload " + logsName;
            }
        } else setLogStDummy(type, logsName, logsId);
    }
    function buildTimeString(min) {
        if      (min < 2)    return (min + " minute");
        else if (min < 121)  return (min + " minutes");
        else if (min < 2881) return ("more than " + Math.floor(min / 60) + " hours");
        else                 return ("more than " + Math.floor(min / (60*24)) + " days");
    }
    function setLogStClear(type, logsName, logsId) {
        $('#'+logsId+'body').children().each(function() {this.remove();});
        if ($('#'+logsId+'total')[0]) $('#'+logsId+'total')[0].innerHTML = "";
        if ($('#'+logsId+'generated')[0]) $('#'+logsId+'generated')[0].innerHTML = $('#'+logsId+'generated')[0].title = "";
        if ($('#'+logsId+'reload')[0]) $('#'+logsId+'reload')[0].innerHTML = $('#'+logsId+'reload')[0].title = "";
    }
    function setLogStAddWait(type, logsName, logsId) {
        if ($('#'+logsId+'body')[0]) {
            var side = $('#'+logsId+'body')[0];
            var load = document.createElement("span");
            load.setAttribute("style", "line-height: 36px; margin-left: 5px;");
            load.innerHTML = '<img src="/images/loading2.gif" title="Loading" alt="Loading" style="vertical-align: sub;" />  Loading ' + logsName + ' ...';
            side.appendChild(load);
        }
    }
    function setLogStDummy(type, logsName, logsId) {
        if ($('#'+logsId+'body')[0]) {
            var side = $('#'+logsId+'body')[0];
            var dummy = document.createElement("span");
            dummy.setAttribute("style", "margin-left: 5px;");
            side.appendChild(dummy);
        }
        if ($('#'+logsId+'reload')[0]) {
            $('#'+logsId+'reload')[0].innerHTML = "Load";
            $('#'+logsId+'reload')[0].title = "Load " + logsName;
        }
    }

// Improve own statistic map page with links to caches for every country.
    if (settings_map_links_statistic && isOwnStatisticsPage()) {
        try {
            var countries = $('#StatsFlagLists table.Table tr');
            for (var i = 0; i < countries.length; i++) {
                var name = countries[i].children[0].childNodes[1].textContent;
                if (name) {
                    var country = $.grep(country_id, function(e){return e.n == name;});
                    if (country && country[0]) {
                        var a = document.createElement("a");
                        a.setAttribute("title", "Show caches you have found in " + country[0]["n"]);
                        a.setAttribute("href", "/play/search?ot=4&c=" + country[0]["id"] + "&f=1&sort=FoundDate&asc=True#myListsLink");
                        a.innerHTML = countries[i].children[0].innerHTML;
                        countries[i].children[0].innerHTML = "";
                        countries[i].children[0].appendChild(a);
                    }
                }
            }
        } catch(e) {gclh_error("Improve own statistic map page:",e);}
    }

// Post log from listing (inline).
    try {
        // iframe aufbauen und verbergen.
        if (settings_log_inline && is_page("cache_listing") && $('#ctl00_ContentBody_MapLinks_MapLinks')[0]) {
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
                    iframe.setAttribute("src", "/seek/log.aspx?ID=" + match[1] + "&gclh=small");
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
        // Im aufgebauten iframe, quasi nicht im Cache Listing. Nur auf old log page Veränderungen vornehmen.
        if (document.location.href.match(/\.com\/seek\/log\.aspx\?(.*)\&gclh\=small/)) hideForInlineLogging();
    } catch(e) {gclh_error("Post log from listing (inline):",e);}
// Post log from PMO-Listing as Basic Member (inline).
    try {
        // iframe aufbauen und verbergen.
        if (settings_log_inline_pmo4basic && is_page("cache_listing") && ($('#ctl00_ContentBody_memberComparePanel')[0] || $('.pmo-banner')[0] || $('.pmo-upsell')[0])) {
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
            iframe.setAttribute("src", "/seek/log.aspx?" + idParameter + "&gclh=small");
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
            var banner = $('.pmo-banner')[0];
            banner.parentNode.insertBefore(a, banner);
            banner.parentNode.insertBefore(iframe, banner);
        }
        // Im aufgebauten iframe, quasi nicht im Cache Listing. Nur auf old log page Veränderungen vornehmen.
        if (document.location.href.match(/\.com\/seek\/log\.aspx\?(.*)\&gclh\=small/)) hideForInlineLogging(true);
    } catch(e) {gclh_error("Post log from PMO-Listing as Basic Member (inline):",e);}
    // Hide for both inline loggings.
    function hideForInlineLogging(pmo) {
        if ($('html')[0]) $('html')[0].style.backgroundColor = "#FFFFFF";
        if ($('header')[0]) $('header')[0].style.display = "none";
        if ($('#ctl00_divBreadcrumbs')[0]) $('#ctl00_divBreadcrumbs')[0].style.display = "none";
        if ($('.BottomSpacing')[0]) $('.BottomSpacing')[0].style.display = "none";
        if ($('.BottomSpacing')[1]) $('.BottomSpacing')[1].style.display = "none";
        if ($('#divAdvancedOptions')[0]) $('#divAdvancedOptions')[0].style.display = "none";
        if (!settings_log_inline_tb && $('#ctl00_ContentBody_LogBookPanel1_TBPanel')[0]) $('#ctl00_ContentBody_LogBookPanel1_TBPanel')[0].style.display = "none";
        if ($('#ctl00_ContentBody_uxVistOtherListingLabel')[0]) $('#ctl00_ContentBody_uxVistOtherListingLabel')[0].style.display = "none";
        if ($('#ctl00_ContentBody_uxVistOtherListingGC')[0]) $('#ctl00_ContentBody_uxVistOtherListingGC')[0].style.display = "none";
        if ($('#ctl00_ContentBody_uxVisitOtherListingButton')[0]) $('#ctl00_ContentBody_uxVisitOtherListingButton')[0].style.display = "none";
        if ($('#ctl00_divContentSide')[0]) $('#ctl00_divContentSide')[0].style.display = "none";
        if ($('#UtilityNav')[0]) $('#UtilityNav')[0].style.display = "none";
        if ($('footer')[0]) $('footer')[0].style.display = "none";
        if ($('.container')[1]) $('.container')[1].style.display = "inline";
        var links = document.getElementsByTagName("a");
        for (var i = 0; i < links.length; i++) {
            if (!links[i].id.match(/(AllDroppedOff|AllVisited|AllClear)/i)) links[i].setAttribute("target", "_blank");
        }
        var css = "";
        if (pmo) css += "#Content, #Content .container, .span-20 {width: 780px;}";
        else {
            css += "#Content, #Content .container, .span-20 {width: " + (parseInt(getValue("settings_new_width")) - 60) + "px;}";
            if ($('#Navigation')[0]) $('#Navigation')[0].style.display = "none";
        }
        css += ".PostLogList .Textarea {height: 175px;}";
        appendCssStyle(css);
    }

// Show amount of different coins in public profile.
    if (is_page("publicProfile") && $('#ctl00_ContentBody_ProfilePanel1_lnkCollectibles.Active')[0]) {
        try {
            function gclh_coin_stats(table_id) {
                var table = $('#'+table_id+' table');
                var rows = table.find('tbody').first().find('tr');
                var sums = new Object();
                sums["tbs"] = sums["coins"] = sums["patches"] = sums["signal"] = sums["unknown"] = 0;
                var diff = new Object();
                diff["tbs"] = diff["coins"] = diff["patches"] = diff["signal"] = diff["unknown"] = 0;
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
                var tfoot = table.find('tfoot')[0];
                var tr = document.createElement("tr");
                var td = document.createElement("td");
                var new_table = "";
                td.colSpan = 3;
                new_table += "<table>";
                new_table += "  <tr><td></td>";
                new_table += "    <td><b>Sum</b></td>";
                new_table += "    <td><b>Different</b></td></tr>";
                new_table += "  <tr><td><b>Travel Bugs:</b></td>";
                new_table += "    <td style='text-align: center;'>" + sums["tbs"] + "</td>";
                new_table += "    <td style='text-align: center;'>" + diff["tbs"] + "</td></tr>";
                new_table += "  <tr><td><b>Geocoins:</b></td>";
                new_table += "    <td style='text-align: center;'>" + sums["coins"] + "</td>";
                new_table += "    <td style='text-align: center;'>" + diff["coins"] + "</td></tr>";
                new_table += "  <tr><td><b>Geopatches:</b></td>";
                new_table += "    <td style='text-align: center;'>" + sums["patches"] + "</td>";
                new_table += "    <td style='text-align: center;'>" + diff["patches"] + "</td></tr>";
                new_table += "  <tr><td><b>Signal Tags:</b></td>";
                new_table += "    <td style='text-align: center;'>" + sums["signal"] + "</td>";
                new_table += "    <td style='text-align: center;'>" + diff["signal"] + "</td></tr>";
                if (sums["unknown"] > 0 || diff["unknown"] > 0) {
                    new_table += "  <tr><td><b>Unknown:</b></td>";
                    new_table += "    <td style='text-align: center;'>" + sums["unknown"] + "</td>";
                    new_table += "    <td style='text-align: center;'>" + diff["unknown"] + "</td></tr>";
                    new_table += "</table>";
                }
                td.innerHTML = new_table;
                tr.appendChild(td);
                tfoot.appendChild(tr);
            }
            if ($('#ctl00_ContentBody_ProfilePanel1_dlCollectibles')[0]) gclh_coin_stats("ctl00_ContentBody_ProfilePanel1_dlCollectibles");
            if ($('#ctl00_ContentBody_ProfilePanel1_dlCollectiblesOwned')[0]) gclh_coin_stats("ctl00_ContentBody_ProfilePanel1_dlCollectiblesOwned");
        } catch(e) {gclh_error("Show Coin-Sums:",e);}
    }

// Show Coin Series in TB-Listing.
    if (document.location.href.match(/\.com\/track\/details\.aspx/)) {
        try {
            if ($('#ctl00_ContentBody_BugTypeImage')[0] && $('#ctl00_ContentBody_BugTypeImage')[0].alt && $('.BugDetailsList')[0]) {
                var dl = $('.BugDetailsList')[0];
                var dt = document.createElement("dt");
                var dd = document.createElement("dd");
                dt.innerHTML = "Series:";
                dd.innerHTML = $('#ctl00_ContentBody_BugTypeImage')[0].alt;
                dl.appendChild(dt);
                dl.appendChild(dd);
            }
        } catch(e) {gclh_error("Show Coin Series:",e);}
    }

// Count favorite points.
    if (document.location.href.match(/\.com\/my\/favorites\.aspx/) && $('table.Table tbody tr')[0]) {
        try {
            buildFavSum();
        } catch(e) {gclh_error("Count favorite points:",e);}
    }
// Sum up FP and BM entries, count favorite points.
    if (is_page("publicProfile") && $('#ctl00_ContentBody_ProfilePanel1_lnkLists.Active')[0] && $('table.Table tbody tr')[0]) {
        try {
            $('#ctl00_ContentBody_ProfilePanel1_pnlBookmarks h3').each(function(i, e) {
                $(e).text($(e).text() + ' (' + $(e).next().find('tbody tr').length + ')');
            });
            buildFavSum(true);
        } catch(e) {gclh_error("Sum up FP and BM entries, count favorite points:",e);}
    }
    function buildFavSum(pp) {
        function buildSL(tag) {
            var tr = document.createElement('tr');
            var t = '<'+tag+' style="background-color: #DFE1D2; font-weight: normal; font-size: 1em;">';
            if (pp) var html = t+'</'+tag+'>'+t;
            else var html = t+'</'+tag+'>'+t+'</'+tag+'>'+t;
            for (src in stats) {html += ' <img src="'+src+'"> '+stats[src];}
            html += '<span style="float: right">Sum: '+count+'</'+tag+'>'+t+'</'+tag+'>';
            tr.innerHTML = html;
            return tr;
        }
        var imgs = $('table.Table tbody').first().find('tr a:not([href*="mail"],[href*="message"])').find('img');
        var stats = new Object();
        var count = 0;
        for (var i = 0; i < imgs.length; i++) {
            if (imgs[i].src) {
                if (!stats[imgs[i].src]) stats[imgs[i].src] = 0;
                stats[imgs[i].src]++;
                count++;
            }
        }
        tr = buildSL("td", pp);
        $('table.Table tbody')[0].append(tr);
        tr = buildSL("th",pp);
        $('table.Table thead')[0].append(tr);
    }

// Hide side rights on print page.
    if (document.location.href.match(/\.com\/seek\/cdpf\.aspx/)) {
        try {
            if ($('#Footer')[0]) $('#Footer')[0].remove();
        } catch(e) {gclh_error("Hide side rights on print page:",e);}
    }

// Hide feedback icon.
    if (settings_hide_feedback_icon) {
        try {
            function hideFbIcon(waitCount) {
                if ($('#_hj_feedback_container')[0]) $('#_hj_feedback_container')[0].style.display = "none";
                waitCount++;
                if (waitCount <= 50) setTimeout(function(){hideFbIcon(waitCount);}, 200);
            }
            hideFbIcon(0);
        } catch(e) {gclh_error("Hide feedback icon:",e);}
    }

// Edit and Image Links to own caches in profile.
    if (document.location.href.match(/\.com\/my\/owned\.aspx/)) {
        try {
            var links = $('a');
            for (var i = 0; i < links.length; i++) {
                if (links[i].href.match(/\/seek\/cache_details\.aspx\?/)) {
                    if (!$(links[i]).find('img').length) {
                        var match = links[i].href.match(/\/seek\/cache_details\.aspx\?guid=(.*)/);
                        if (match[1]) {
                            links[i].parentNode.innerHTML += " <a href='/hide/report.aspx?guid=" + match[1] + "'><img src='/images/stockholm/16x16/page_white_edit.gif'></a>";
                            if (document.location.href.match(/\.com\/my\/owned\.aspx/)) {
                                links[i].parentNode.innerHTML += " <a href='/seek/gallery.aspx?guid=" + match[1] + "'><img src='/images/stockholm/16x16/photos.gif'></a>";
                            }
                        }
                    }
                }
            }
        } catch(e) {gclh_error("Edit and Image Links to own caches in profile:",e);}
    }

// Hide archived at own caches.
    if (settings_hide_archived_in_owned && document.location.href.match(/\.com\/my\/owned\.aspx/)) {
        try {
            var links = $('a');
            for (var i = 0; i < links.length; i++) {
                if (links[i].href.match(/\/seek\/cache_details\.aspx\?/)) {
                    var archived = links[i].classList.contains("OldWarning");
                    if (archived) links[i].parentNode.parentNode.style.display = 'none';
                }
            }
        } catch(e) {gclh_error("Hide archived at own caches:",e);}
    }

// Werden nicht alle eigenen Logs geladen, weil z.B. über Browser gestoppt, dann Anzahl Logs geladen und Datum letztes Log angeben.
    if (document.location.href.match(/\.com\/my\/logs\.aspx?/)) {
        if ($('#divContentMain')[0] && $('#divContentMain')[0].children[2] && $('tr')[0]) {
            try {
                var result = $('#divContentMain')[0].children[2];
                var count = result.innerHTML.match(/\s+(\d+)\s+/);
                if (count) {
                    var loaded = $('tr').length;
                    if (parseInt(count[1]) > loaded) {
                        if ($('tr')[loaded-1].children[2] && $('tr')[loaded-1].children[2].innerHTML.match(/(\S+)/)) var lastLog = loaded-1;
                        else if ($('tr')[loaded-2].children[2] && $('tr')[loaded-2].children[2].innerHTML.match(/(\S+)/)) var lastLog = loaded-2;
                        else var lastLog = "";
                        if (lastLog != "") var dateLastLog =  ". Last date is " + $('tr')[lastLog].children[2].innerHTML.replace(/\s/g, "");
                        else var dateLastLog = "";
                        result.innerHTML = result.innerHTML + " (Only " + loaded + " logs loaded" + dateLastLog + ".)";
                    }
                }
            } catch(e) {gclh_error("Stopped logs loading:",e);}
        }
    }

// Add selectable month and year in calendar of cache and trackable logs.
    function onChangeCalendarSelect(event) {
        const selectedYear = $("#selectYearEl").val();
        const selectedMonth = $("#selectMonthEl").val();
        const ONE_DAY = 1000 * 60 * 60 * 24;
        const GC_ERA_MS = new Date(2000, 0, 2).getTime();
        const selectedDate = new Date(selectedYear, selectedMonth, 1);
        const difference_ms = Math.abs(selectedDate.getTime() - GC_ERA_MS);
        const daysFromGCEra = Math.round(difference_ms/ONE_DAY) + 1;
        __doPostBack('ctl00$ContentBody$MyCalendar', 'V'+daysFromGCEra);
    }
    function appendOptionalEl(selectEl, value, text, isSelected) {
        const optEl = document.createElement("option");
        optEl.setAttribute("value", value);
        if (isSelected) optEl.setAttribute("selected", "selected");
        const textNode = document.createTextNode(text);
        optEl.appendChild(textNode);
        selectEl.appendChild(optEl);
    }
    if (document.location.href.match(/\.com\/my\/geocaches\.aspx/) || document.location.href.match(/\.com\/my\/travelbugs\.aspx/)) {
        try {
            const selectYearEl = document.createElement("select");
            selectYearEl.id = 'selectYearEl';
            selectYearEl.onchange = onChangeCalendarSelect;
            const selectMonthEl = document.createElement("select");
            selectMonthEl.id = 'selectMonthEl';
            selectMonthEl.onchange = onChangeCalendarSelect;
            var calendarHeaderElements = $("#ctl00_ContentBody_MyCalendar").find("tbody tr:first td table tbody tr td:nth-child(2)");
            if (calendarHeaderElements.length > 0) {
                var selectedCalendar = calendarHeaderElements.text().split(" ");
                var CURRENT_YEAR = selectedCalendar[0];
                var CURRENT_MONTH = selectedCalendar[1];
                calendarHeaderElements.empty();
                calendarHeaderElements.append(selectYearEl);
                calendarHeaderElements.append(document.createTextNode(" "));
                calendarHeaderElements.append(selectMonthEl);
                const LAST_YEAR = new Date().getFullYear();
                for(var year = 2000; year <= LAST_YEAR; year++) {
                    appendOptionalEl(selectYearEl, year, year, (year == CURRENT_YEAR));
                }
                for(var month = 0; month < 12; month++) {
                    var objDate = new Date();
                    objDate.setMonth(month);
                    var locale = "en-us";
                    var monthText = objDate.toLocaleString(locale, { month: "long" });
                    appendOptionalEl(selectMonthEl, month, monthText, (monthText == CURRENT_MONTH));
                }
            }
            appendCssStyle('select {color: #594a42;}');
        } catch(e) {gclh_error("Add selectable month and year in calendar:",e);}
    }

// Show warning for not available images.
    if (settings_img_warning && is_page("cache_listing")) {
        try {
            // Images in listing.
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
            // Background image.
            function checkBGImage(element, newUrl) {
                var img = new Image();
                if (element.background.length == 0) return;
                img.onerror =
                    function(){
                        element.background = newUrl;
                    };
                img.src = element.background;
            }
            // Check images in listing.
            var a = $('#ctl00_ContentBody_ShortDescription img, #ctl00_ContentBody_LongDescription img');
            for (var i = 0; i < a.length; i++) {
                checkImage(a[i], urlImagesSvg+'image_not_available.svg', a[i].src);
            }
            // Check background image.
            var a = $('body');
            for (var i = 0; i < a.length; i++) {
                checkBGImage(a[i], urlImagesSvg+'image_not_available_background.svg');
            }
        } catch(e) {gclh_error("Show warning for not available images:",e);}
    }

// Save home coords.
    if (document.location.href.match(/\.com\/account\/settings\/homelocation/)) {
        try {
            function saveHomeCoordsWait(waitCount) {
                if ($('#Query')[0]) {
                    saveHomeCoords();
                    $('#Query')[0].addEventListener('change', saveHomeCoords, false);
                } else {waitCount++; if (waitCount <= 20) setTimeout(function(){saveHomeCoordsWait(waitCount);}, 100);}
            }
            saveHomeCoordsWait(0);
        } catch(e) {gclh_error('Save Homecoords:',e);}
    }
    function saveHomeCoords() {
        var link = $('#Query')[0];
        if (link) {
            var match = link.value.match(/((N|S) ([0-9]+)° ([0-9]+)\.([0-9]+)′ (E|W) ([0-9]+)° ([0-9]+)\.([0-9]+)′)/);
            if (match && match[1]) {
                match[1] = match[1].replace(/′/g, '');
                var latlng = toDec(match[1]);
                if (getValue('home_lat', 0) != parseInt(latlng[0] * 10000000)) setValue('home_lat', parseInt(latlng[0] * 10000000));
                if (getValue('home_lng', 0) != parseInt(latlng[1] * 10000000)) setValue('home_lng', parseInt(latlng[1] * 10000000));
            }
        }
    }

// Save trackable uid from dashboard.
    if (is_page("profile") || is_page("dashboard")) {
       try {
            var link = $('a[href*="/track/search.aspx?o=1&uid="]')[0];
            if (link) {
                var uid = link.href.match(/\/track\/search\.aspx\?o=1\&uid=(.*)/);
                if (uid && uid[1]) {
                    if (getValue("uid", "") != uid[1]) setValue("uid", uid[1]);
                }
            }
        } catch(e) {gclh_error("Save uid:",e);}
    }

// Add mailto link to profilpage.
    if (is_page("publicProfile") && $('#ctl00_ContentBody_ProfilePanel1_lnkEmailUser')[0]) {
        try {
            var link = $('#ctl00_ContentBody_ProfilePanel1_lnkEmailUser')[0];
            if (link && link.innerHTML.match(/^.+@.+\..+$/)) {
                var mailto = document.createElement('a');
                mailto.href = "mailto:" + link.innerHTML + '?subject=[GC]';
                mailto.appendChild(document.createTextNode("(@)"));
                link.parentNode.appendChild(document.createTextNode(" "));
                link.parentNode.appendChild(mailto);
            }
        } catch(e) {gclh_error("Add mailto-link to profilepage:",e);}
    }

// Hide GC Avatar Option.
    if (settings_load_logs_with_gclh && document.location.href.match(/\.com\/account\/settings\/preferences/) && $('#ShowAvatarsInCacheLogs')[0]) {
        try {
            var check = $('#ShowAvatarsInCacheLogs')[0];
            check.checked = !settings_hide_avatar;
            check.disabled = true;
            var head = check.parentNode;
            head.style.cursor = "unset";
            head.style.opacity = "0.5";
            var link = document.createElement("a");
            link.setAttribute("href", "/my/default.aspx#GClhShowConfig#a#settings_hide_avatar");
            link.appendChild(document.createTextNode("here"));
            var hinweis = document.createElement("span");
            hinweis.setAttribute("class", "label");
            hinweis.appendChild(document.createTextNode("You are using \"" + scriptName + "\" - you have to change this option "));
            hinweis.appendChild(link);
            hinweis.appendChild(document.createTextNode("."));
            head.appendChild(hinweis);
            var units = $("#DistanceUnits:checked").val();
            if (units != settings_distance_units) {
                setValue('settings_distance_units', units);
                settings_distance_units = units;
            }
        } catch(e) {gclh_error("Hide GC Avatar Option:",e);}
    }

// Aufbau Links zum Aufruf von Config, Sync und Find Player. Und Changelog im Profile.
    try {
        // GClh Config, Sync und Find Player Aufrufe aus Linklist heraus.
        if (checkTaskAllowed("GClh Config", false) == true && document.getElementsByName("lnk_gclhconfig")[0]) {
            document.getElementsByName("lnk_gclhconfig")[0].href = "#GClhShowConfig";
            document.getElementsByName("lnk_gclhconfig")[0].addEventListener('click', gclh_showConfig, false);
        }
        if (checkTaskAllowed("GClh Sync", false) == true && document.getElementsByName("lnk_gclhsync")[0]) {
            document.getElementsByName("lnk_gclhsync")[0].href = "#GClhShowSync";
            document.getElementsByName("lnk_gclhsync")[0].addEventListener('click', gclh_showSync, false);
        }
        if (checkTaskAllowed("Find Player", false) == true && document.getElementsByName("lnk_findplayer")[0]) {
            document.getElementsByName("lnk_findplayer")[0].href = "#GClhShowFindPlayer";
            document.getElementsByName("lnk_findplayer")[0].addEventListener('click', createFindPlayerForm, false);
        }
        // GClh Config, Sync und Find Player Aufrufe mit Zusatz #GClhShowConfig bzw. #GClhShowSync bzw. #GClhShowFindPlayer.
        // 2. Schritt derzeit im Link bei Settings, Preferences Avatar, teils in den Links aus der Linklist, mit rechter Maustaste aus Links neben
        // Avatar auf Profile Seite und teils F4 bei Aufruf Config.
        if (document.location.href.match(/#GClhShowConfig/)) {
            document.location.href = clearUrlAppendix(document.location.href, true);
            setTimeout(gclh_showConfig, 5);
        }
        if (document.location.href.match(/#GClhShowSync/)) {
            document.location.href = clearUrlAppendix(document.location.href, true);
            setTimeout(gclh_showSync, 5);
        }
        if (document.location.href.match(/#GClhShowFindPlayer/)) {
            document.location.href = clearUrlAppendix(document.location.href, true);
            setTimeout(createFindPlayerForm, 5);
        }
        // Old Dashboard (Profile), Dashboard Seite.
        if ((is_page('profile') && $('#ctl00_ContentBody_WidgetMiniProfile1_memberProfileLink')[0]) || (is_page('dashboard') && $('.bio-meta'))) {
            // Config, Sync und Changelog Links beim Avatar in Profile, Dashboard.
            var lnk_config = "<a href='#GClhShowConfig' id='gclh_config_lnk' name='gclh_config_lnk' title='" + scriptShortNameConfig + " v" + scriptVersion + (settings_f4_call_gclh_config ? " / Key F4":"") + "' >" + scriptShortNameConfig + "</a>";
            var lnk_sync = " | <a href='#GClhShowSync' id='gclh_sync_lnk' name='gclh_sync_lnk' title='" + scriptShortNameSync + " v" + scriptVersion + (settings_f10_call_gclh_sync ? " / Key F10":"") + "' >" + scriptShortNameSync + "</a>";
            var lnk_changelog = " | <a href='"+urlChangelog+"' title='Documentation of changes and new features in GClh II on GitHub'>Changelog</a>";
            if (is_page('profile')) $('#ctl00_ContentBody_WidgetMiniProfile1_memberProfileLink')[0].parentNode.innerHTML += " | <br>" + lnk_config + lnk_sync + lnk_changelog;
            else $('.bio-meta')[0].innerHTML += lnk_config + lnk_sync + lnk_changelog;
            appendCssStyle(".bio-meta {font-size: 12px;} .bio-meta a:hover {color: #02874d;}");
            $('#gclh_config_lnk')[0].addEventListener('click', gclh_showConfig, false);
            $('#gclh_sync_lnk')[0].addEventListener('click', gclh_showSync, false);
            // Linklist Ablistung rechts im Profile.
            if (document.getElementsByName("lnk_gclhconfig_profile")[0]) {
                document.getElementsByName("lnk_gclhconfig_profile")[0].href = "#GClhShowConfig";
                document.getElementsByName("lnk_gclhconfig_profile")[0].addEventListener('click', gclh_showConfig, false);
            }
            if (document.getElementsByName("lnk_gclhsync_profile")[0]) {
                document.getElementsByName("lnk_gclhsync_profile")[0].href = "#GClhShowSync";
                document.getElementsByName("lnk_gclhsync_profile")[0].addEventListener('click', gclh_showSync, false);
            }
            if (document.getElementsByName("lnk_findplayer_profile")[0]) {
                document.getElementsByName("lnk_findplayer_profile")[0].href = "#GClhShowFindPlayer";
                document.getElementsByName("lnk_findplayer_profile")[0].addEventListener('click', createFindPlayerForm, false);
            }
        }
    } catch(e) {gclh_error("Aufbau Links zum Aufruf von Config, Sync und Find Player:",e);}

// Special Links aus Linklist bzw. Default Links versorgen.
    try {
        setSpecialLinks();
    } catch(e) {gclh_error("Special Links:",e);}
    function setSpecialLinks() {
        // Links zu Nearest Lists/Map in Linklist und Default Links setzen.
        if (getValue("home_lat", 0) != 0 && getValue("home_lng") != 0) {
            var link = "/seek/nearest.aspx?lat=" + (getValue("home_lat") / 10000000) + "&lng=" + (getValue("home_lng") / 10000000) + "&dist=25&disable_redirect=";
            setLnk("lnk_nearestlist", link);
            setLnk("lnk_nearestlist_profile", link);
            var link = map_url + "?lat=" + (getValue("home_lat") / 10000000) + "&lng=" + (getValue("home_lng") / 10000000);
            setLnk("lnk_nearestmap", link);
            setLnk("lnk_nearestmap_profile", link);
            var link = "/seek/nearest.aspx?lat=" + (getValue("home_lat") / 10000000) + "&lng=" + (getValue("home_lng") / 10000000) + "&dist=25&f=1&disable_redirect=";
            setLnk("lnk_nearestlist_wo", link);
            setLnk("lnk_nearestlist_wo_profile", link);
        }
        // Links zu den eigenen Trackables in Linklist und Default Links setzen.
        if (getValue("uid", "") != "") {
            var link = "/track/search.aspx?o=1&uid=" + getValue("uid");
            setLnk("lnk_my_trackables", link);
            setLnk("lnk_my_trackables_profile", link);
        }
    }
    function setLnk(lnk, link) {
        if (document.getElementsByName(lnk)[0]) document.getElementsByName(lnk)[0].href = link;
        if (document.getElementsByName(lnk)[1]) document.getElementsByName(lnk)[1].href = link;
    }

// Eingaben im Search Field verarbeiten.
    if (document.location.href.match(/\.com\/seek\/nearest\.aspx\?navi_search=/)) {
        try {
            var matches = document.location.href.match(/\?navi_search=(.*)/);
            if (matches && matches[1]) {
                $('#ctl00_ContentBody_LocationPanel1_OriginText')[0].value = urldecode(matches[1]).replace(/%20/g, " ");
                function clickSearch() {$('#ctl00_ContentBody_LocationPanel1_btnLocale')[0].click();}
                window.addEventListener("load", clickSearch, false);
            }
        } catch(e) {gclh_error("Eingaben im Search Field verarbeiten:",e);}
    }

// Append '&visitcount=1' to all geochecker.com links.
    if (settings_visitCount_geocheckerCom && is_page("cache_listing")) {
        try {
            $('#ctl00_ContentBody_LongDescription a[href^="http://www.geochecker.com/index.php?code="]').filter(':not([href*="visitcount=1"])').attr('href', function(i, str) {
                return str + '&visitcount=1';
            }).attr('rel', 'noreferrer');
        } catch(e) {gclh_error("Append '&visitcount=1' to all geochecker.com links:",e);}
    }

// Auto check checkbox on hide cache process.
    if (settings_hide_cache_approvals && document.location.href.match(/\.com\/hide\/(report|description|edit)\.aspx/)) {
        try {
            $("#ctl00_ContentBody_cbAgreement").prop('checked', true);
            $("#ctl00_ContentBody_chkUnderstand").prop('checked', true);
            $("#ctl00_ContentBody_chkDisclaimer").prop('checked', true);
            $("#ctl00_ContentBody_chkAgree").prop('checked', true);
        } catch(e) {gclh_error("Auto check checkbox on hide cache process:",e);}
    }

// Check for upgrade.
    try {
        function checkForUpgrade(manual) {
            var next_check = parseInt(getValue("update_next_check"), 10);
            if (!next_check) next_check = 0;
            var time = new Date().getTime();

            if (next_check < time || manual == true) {
                time += 1 * 60 * 60 * 1000;  // 1 Stunde warten, bis zum nächsten Check.
                setValue('update_next_check', time.toString());
                if (GM_xmlhttpRequest) {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: urlScript,
                        onload: function(result) {
                            try {
                                var version = result.responseText.match(/\/\/\s\@version(.*)/);
                                if (version) {
                                    var new_version = version[1].replace(/\s/g, "");
                                    if (new_version != scriptVersion) {
                                        var currVersion = "version " + scriptVersion;
                                        var text = "Version " + new_version + " of script \""+ scriptName + "\" is available.\n" +
                                                   "You are currently using " + currVersion + ".\n\n" +
                                                   "Click OK to upgrade.\n\n" +
                                                   "(After upgrade, please refresh your page.)";
                                        if (window.confirm(text)) {
                                            btnClose();
                                            document.location.href = urlScript;
                                        } else {
                                            time += 7 * 60 * 60 * 1000;  // 1+7 Stunden warten, bis zum nächsten Check.
                                            setValue('update_next_check', time.toString());
                                        }
                                    } else if (manual == true) {
                                        var text = "Version " + scriptVersion + " of script \""+ scriptName + "\" \n" +
                                                   "is the latest and actual version.\n";
                                        alert(text);
                                    }
                                }
                            } catch(e) {gclh_error("Check for upgrade, onload:",e);}
                        }
                    });
                }
            }
        }
        checkForUpgrade(false);
    } catch(e) {gclh_error("Check for upgrade:",e);}

// Souvenirs
    if ( is_page("souvenirs") || is_page("publicProfile") ) {
        try {
            SouvenirsDashboard = $(".ProfileSouvenirsList");
            if ( SouvenirsDashboard.length ) {
                var css = ".gclhSouvenirSortButton {";
                css += "color: #02874D;";
                css += "border: 2px solid #02874D;";
                css += "font-size: 150%;";
                css += "}";
                appendCssStyle(css);

                function dateFormatConversion(format) {
                    return format.replace(/yy/g,'y').replace(/M/g,'m').replace(/mmm/,'M');
                    /* GS dateformat to jqui datepicker dateformat:
                        https://www.geocaching.com/account/settings/preferences#SelectedDateFormat
                        http://api.jqueryui.com/datepicker/#utility-parseDate
                    GS --> jqui: d-->d,dd-->dd,M-->m,MM-->mm,MMM-->M,yy-->y,yyyy-->yy
                    "d. M. yyyy"  : "d. m. yy",   3. 1. 2017
                    "d.M.yyyy"    : "d.m.yy",     3.1.2017
                    "d.MM.yyyy"   : "d.mm.yy",    3.01.2017
                    "d/M/yy"      : "d/m/y",      3/1/17
                    "d/M/yyyy"    : "d/m/yy",     3/1/2017
                    "d/MM/yyyy"   : "d/mm/yy",    3/01/2017
                    "dd MMM yy"   : "dd M y",     03 Jan 17
                    "dd.MM.yy"    : "dd.mm.y",    03.01.17
                    "dd.MM.yyyy"  : "dd.mm.yy",   03.01.2017
                    "dd.MM.yyyy." : "dd.mm.yy.",  03.01.2017.
                    "dd.MMM.yyyy" : "dd.M.yy",    03.Jan.2017
                    "dd/MM/yy"    : "dd/mm/y",    03/01/17
                    "dd/MM/yyyy"  : "dd/mm/yy",   03/01/2017
                    "dd/MMM/yyyy" : "dd/M/yy",    03/Jan/2017
                    "dd-MM-yy"    : "dd-mm-y",    03-01-17
                    "dd-MM-yyyy"  : "dd-mm-yy",   03-01-2017
                    "d-M-yyyy"    : "d-m-yy",     3-1-2017
                    "M/d/yyyy"    : "m/d/yy",     1/3/2017
                    "MM/dd/yyyy"  : "mm/dd/yy",   01/03/2017
                    "MMM/dd/yyyy" : "M/dd/yy",    Jan/03/2017
                    "yyyy.MM.dd." : "yy.mm.dd.",  2017.01.03.
                    "yyyy/MM/dd"  : "yy/mm/dd",   2017/01/03
                    "yyyy-MM-dd"  : "yy-mm-dd"    2017-01-03 */
                }
                SouvenirsDashboard.before('<div id="gclhSouvenirsSortButtons" class="btn-group" style="justify-content: left;"></div><p></p>');
                $("#gclhSouvenirsSortButtons").append('<div style="width: 155px; padding: 10px;">                  <a href="#" id="actionSouvenirsSortAcquiredDateNewestTop" class="btn gclhSouvenirSortButton" style="display: none; color: #02874D;">Newest first</a></div>');
                $("#gclhSouvenirsSortButtons").append('<div style="width: 155px; padding: 10px; margin-left:12px;"><a href="#" id="actionSouvenirsSortAcquiredDateOldestTop" class="btn gclhSouvenirSortButton" style="display: none; color: #02874D;">Oldest first</a></div>');
                $("#gclhSouvenirsSortButtons").append('<div style="width: 155px; padding: 10px; margin-left:12px;"><a href="#" id="actionSouvenirsSortAcquiredTitleAtoZ" class="btn gclhSouvenirSortButton" style="color: #02874D;">Title A-Z</a></div>');
                $("#gclhSouvenirsSortButtons").append('<div style="width: 155px; padding: 10px; margin-left:12px;"><a href="#" id="actionSouvenirsSortAcquiredTitleZtoA" class="btn gclhSouvenirSortButton" style="color: #02874D;">Title Z-A</a></div>');
                var jqui_date_format = "";
                var accessTokenPromise = $.get('/account/settings/preferences');
                accessTokenPromise.done(function (response) {
                    response_div = document.createElement('div');
                    response_div.innerHTML = response;
                    date_format = $('select#SelectedDateFormat option:selected', response_div).val(); // 
                    jqui_date_format = dateFormatConversion(date_format);
                    $('#actionSouvenirsSortAcquiredDateNewestTop').show();
                    $('#actionSouvenirsSortAcquiredDateOldestTop').show();
                });
               
                function getSouvenirAcquiredDate( souvenirDiv ) { return $(souvenirDiv).text().match( /Acquired on (.*)/ )[1]; }
               
                function AcquiredDateNewestFirst(a, b) {
                    var ada = getSouvenirAcquiredDate(a);
                    var adb = getSouvenirAcquiredDate(b);
                    date1 = $.datepicker.parseDate(jqui_date_format, ada);
                    date2 = $.datepicker.parseDate(jqui_date_format, adb);
                    if(date1.getTime() == date2.getTime()) return TitleAtoZ(a, b);
                    return date1 < date2 ? 1 : -1;
                }
                function AcquiredDateOldestFirst(a, b) {
                    var ada = getSouvenirAcquiredDate(a);
                    var adb = getSouvenirAcquiredDate(b);
                    date1 = $.datepicker.parseDate(jqui_date_format, ada);
                    date2 = $.datepicker.parseDate(jqui_date_format, adb);
                    if(date1.getTime() == date2.getTime()) return TitleZtoA(a, b);
                    return date1 < date2 ? -1 : 1;
                    // return Date.parse(ada) < Date.parse(adb) ? -1 : 1;
                }
                function TitleAtoZ(a, b) {
                    var aT = $(a).children('a').attr('title');
                    var bT = $(b).children('a').attr('title');
                    return aT.localeCompare(bT);
                }
                function TitleZtoA(a, b) {
                    var aT = $(a).children('a').attr('title');
                    var bT = $(b).children('a').attr('title');
                    return bT.localeCompare(aT);
                }
                function ReorderSouvenirs( orderfunction ) {
                    SouvenirsDashboard = $(".ProfileSouvenirsList");
                    Souvenirs = SouvenirsDashboard.children('div');
                    Souvenirs.detach().sort(orderfunction);
                    SouvenirsDashboard.append(Souvenirs);
                }
                $("#actionSouvenirsSortAcquiredDateNewestTop").click( function() { ReorderSouvenirs(AcquiredDateNewestFirst) } );
                $("#actionSouvenirsSortAcquiredDateOldestTop").click( function() { ReorderSouvenirs(AcquiredDateOldestFirst) } );
                $("#actionSouvenirsSortAcquiredTitleAtoZ").click( function() { ReorderSouvenirs(TitleAtoZ) } );
                $("#actionSouvenirsSortAcquiredTitleZtoA").click( function() { ReorderSouvenirs(TitleZtoA) } );
            }
        } catch(e) {gclh_error("Souvenirs:",e);}
    }

// Special days.
    if (is_page("cache_listing")) {
        try {
            var now = new Date();
            var year = now.getYear() + 1900;
            var month = now.getMonth() + 1;
            var date = now.getDate();
            // Ostern 2018.
            if ((date >= 30 && date <= 31 && month == 3 && year == 2018) || (date >= 01 && date <= 02 && month == 4 && year == 2018)) {
                $(".CacheDetailNavigation:first > ul:first").append('<li><img src="'+urlImages+'easter_bunny_001.jpg" style="margin-bottom: -35px;" title="Happy Easter"></li>');
            }
            // Weihnachten 2018.
            if (month == 12 && year == 2018) {
                var max = 0;
                if      (date == 1 || date == 2) max = 64;
                else if (date == 5 || date == 6) max = 64;
                else if (date == 8 || date == 9) max = 48;
                else if (date == 15 || date == 16) max = 48;
                else if (date >= 22 && date <= 26) max = 16;
                if (max > 0) {
                    function checkChristmasData(waitCount) {
                        if ($('#gclh_vip_list span').length > 0 && $('#gclh_vip_list .StatusIcon').length == 0) {
                            setTimeout(function() {
                                var icons = $('#gclh_latest_logs,#gclh_vip_list').find('img[src*="/images/logtypes/2.png"]');
                                for (var i = 0; i < icons.length; i += 2) {
                                    var num = random(max, 1);
                                    if (num > 0 && num < 9) icons[i].src = urlImages+"nicolaus_head_0" + num + ".png";
                                }
                            }, 500);
                        } else {waitCount++; if (waitCount <= 40) setTimeout(function(){checkChristmasData(waitCount);}, 500);}
                    }
                    checkChristmasData(0);
                }
            }
        } catch(e) {gclh_error("Special days:",e);}
    }

//////////////////////////////
// GClh Functions
//////////////////////////////
    function in_array(search, arr) {
        for (var i = 0; i < arr.length; i++) {if (arr[i] == search) return true;}
        return false;
    }

    function caseInsensitiveSort(a, b) {
        var ret = 0;
        a = a.toLowerCase();
        b = b.toLowerCase();
        if (a > b) ret = 1;
        if (a < b) ret = -1;
        return ret;
    }

// Enkodieren in url und dekodieren aus url.
    function urlencode(s) {
        s = s.replace(/&amp;/g, "&");
        s = encodeURIComponent(s);  // Alles außer: A bis Z, a bis z und - _ . ! ~ * ' ( )
        s = s.replace(/~/g, "%7e");
        s = s.replace(/'/g, "%27");
        s = s.replace(/%26amp%3b/g, "%26");
        s = s.replace(/ /g, "+");
        return s;
    }
    function urldecode(s) {
        s = s.replace(/\+/g, " ");
        s = s.replace(/%252b/ig, "+");
        s = s.replace(/%7e/g, "~");
        s = s.replace(/%27/g, "'");
        s = decodeURIComponent(s);
        return s;
    }

// HTML dekodieren, zB: "&amp;" in "&" (zB: User "Rajko & Dominik".)
    function decode_innerHTML(v_mit_innerHTML) {
        var elem = document.createElement('textarea');
        elem.innerHTML = v_mit_innerHTML.innerHTML;
        v_decode = elem.value;
        v_new = v_decode.trim();
        return v_new;
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

// Change coordinates from N/S/E/W Deg Min.Sec to Dec.
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
            match = coords.match(/(N|S) ([0-9]+)°? ([0-9]+)\.([0-9]+)′?'? (E|W) ([0-9]+)°? ([0-9]+)\.([0-9]+)/);
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
                    } else return false;
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

// Close Overlays, Find Player, Config, Sync.
    function btnClose(clearUrl) {
        if (global_mod_reset) {
            rcClose();
            return;
        }
        if ($('#bg_shadow')[0]) $('#bg_shadow')[0].style.display = "none";
        if ($('#settings_overlay')[0]) $('#settings_overlay')[0].style.display = "none";
        if ($('#sync_settings_overlay')[0]) $('#sync_settings_overlay')[0].style.display = "none";
        if ($('#findplayer_overlay')[0]) $('#findplayer_overlay')[0].style.display = "none";
        if (clearUrl != false) document.location.href = clearUrlAppendix(document.location.href, false);
    }

// Get Finds out of login text box.
    function get_my_finds() {
        var finds = "";
        if ($('.cache-count').text()) finds = parseInt($('.cache-count').text().replace(/\s/g,'').match(/[0-9,\.]+/)[0].replace(/[,\.]/,""));
        return finds;
    }

// Sucht Original Usernamen des Owners aus Listing.
    function get_real_owner() {
        if ($('#ctl00_ContentBody_bottomSection')) {
            var links = $('#ctl00_ContentBody_bottomSection a[href*="/seek/nearest.aspx?u="]');
            for (var i = 0; i < links.length; i++) {
                var match = links[i].href.match(/\/seek\/nearest\.aspx\?u\=(.*)$/);
                if (match) return urldecode(match[1]);
            }
            return false;
        } else return false;
    }

// Hide header in map.
    function hide_map_header() {
        if ($('nav')[0].style.display != "none") {
            $('nav')[0].style.display = "none";
            $('#Content')[0].style.top = 0;
        } else {
            $('nav')[0].style.display = "block";
            $('#Content')[0].style.top = "80px";
        }
    }

// CSS Style hinzufügen.
    function appendCssStyle(css, name) {
        if (css == "") return;
        if (name) var tag = $(name)[0];
        else var tag = $('head')[0];
        var style = document.createElement('style');
        style.innerHTML = 'GClhII{} ' + css;
        style.type = 'text/css';
        tag.appendChild(style);
    }

// Zu lange Zeilen "kürzen", damit nicht umgebrochen wird.
    function noBreakInLine(n_side, n_maxwidth, n_title) {
        if (n_side == "" || n_side == undefined || n_maxwidth == 0) return;
        n_side.setAttribute("style", "max-width: " + n_maxwidth + "px; display: inline-block; overflow: hidden; vertical-align: bottom; white-space: nowrap; text-overflow: ellipsis;");
        if (n_title != "") n_side.setAttribute("title", n_title);
    }

// Mail Icons, Message Icons.
    // Cache, TB, Aktiv User Infos ermitteln.
    function getGcTbUserInfo() {
        var g_gc = false; var g_tb = false;
        var g_code = ""; var g_name = ""; var g_link = ""; var g_founds = ""; var g_date = ""; var g_time = ""; var g_dateTime = ""; var g_activ_username = "";
        if ((settings_show_mail || settings_show_message)) {
            // Cache Listing.
            if ($('#ctl00_ContentBody_CacheName')[0]) {
                g_gc = true;
                g_name = $('#ctl00_ContentBody_CacheName')[0].innerHTML;
                if ($('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode')[0]) g_code = $('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode')[0].innerHTML;
            // TB Listing.
            } else if ($('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode')[0]) {
                g_tb = true;
                g_code = $('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode')[0].innerHTML;
                if ($('#ctl00_ContentBody_lbHeading')[0]) g_name = $('#ctl00_ContentBody_lbHeading')[0].innerHTML;
            // Log view.
            } else if ($('#ctl00_ContentBody_LogBookPanel1_lbLogText')[0]) {
                // Cache.
                if ($('#ctl00_ContentBody_LogBookPanel1_lbLogText')[0].childNodes[4] &&
                     $('#ctl00_ContentBody_LogBookPanel1_lbLogText')[0].childNodes[4].href.match(/\/cache_details\.aspx\?guid=/)) {
                    g_gc = true;
                    g_name = $('#ctl00_ContentBody_LogBookPanel1_lbLogText')[0].childNodes[4].innerHTML;
                }
                // TB.
                if ($('#ctl00_ContentBody_LogBookPanel1_lbLogText')[0].childNodes[4] &&
                     $('#ctl00_ContentBody_LogBookPanel1_lbLogText')[0].childNodes[4].href.match(/\/track\/details\.aspx\?guid=/)) {
                    g_tb = true;
                    g_name = $('#ctl00_ContentBody_LogBookPanel1_lbLogText')[0].childNodes[4].innerHTML;
                }
            // Log post.
            } else if ($('#ctl00_ContentBody_LogBookPanel1_WaypointLink')[0]) {
                // Cache old log page.
                if ($('#ctl00_ContentBody_LogBookPanel1_WaypointLink')[0].parentNode.children[2] &&
                     $('#ctl00_ContentBody_LogBookPanel1_WaypointLink')[0].parentNode.children[2].href.match(/\/cache_details\.aspx\?guid=/)) {
                    g_gc = true;
                    g_name = $('#ctl00_ContentBody_LogBookPanel1_WaypointLink')[0].parentNode.children[2].innerHTML;
                }
                // TB.
                if ($('#ctl00_ContentBody_LogBookPanel1_WaypointLink')[0].parentNode.children[2] &&
                     $('#ctl00_ContentBody_LogBookPanel1_WaypointLink')[0].parentNode.children[2].href.match(/\/track\/details\.aspx\?guid=/)) {
                    g_tb = true;
                    g_name = $('#ctl00_ContentBody_LogBookPanel1_WaypointLink')[0].parentNode.children[2].innerHTML;
                }
            // Log post cache new log page.
            } else if ($('.muted')[0] && $('.muted')[0].children[0].innerHTML) {
                g_gc = true;
                g_name = $('.muted')[0].children[0].innerHTML;
            }
            if (g_code != "") {
                g_link = "(http://coord.info/" + g_code + ")";
                g_code = "(" + g_code + ")";
            }
            g_founds = get_my_finds();
            [g_date, g_time, g_dateTime] = getDateTime();
            g_activ_username = global_me;
        }
        return [g_gc, g_tb, g_code, g_name, g_link, g_activ_username, g_founds, g_date, g_time, g_dateTime];
    }
    // Message Icon, Mail Icon aufbauen.
    function buildSendIcons(b_side, b_username, b_art, guidSpecial) {
        if (b_art == "per guid") {
            // guid aus besonderen Proceduren (zB: post cache log new page).
            if (guidSpecial) guid = guidSpecial;
            if (guid == "" || guid == undefined) return;
            if (guid.match(/\#/)) return;
            // Keine Verarbeitung für Stat Bar.
            if (b_side.innerHTML.match(/https?:\/\/img\.geocaching\.com\/stats\/img\.aspx/)) return;
        } else {
            if (b_username == "") return;
        }
        if (b_side == "" || b_side == undefined || b_username == undefined || global_activ_username == "" || global_activ_username == undefined || b_username == global_activ_username) return;
        // Wenn Owner, dann echten Owner setzen und nicht gegebenenfalls abweichenden Owner aus Listing "A cache by".
        if (b_side.parentNode.id == "ctl00_ContentBody_mcd1") {
            var owner = get_real_owner();
            b_username = owner;
        }
        // Wenn User "In the hands of ..." im TB Listing, prüfen ob aktiver Username dort enthalten ist und Mail, Message nicht erzeugen.
        var username_send = b_username;
        if (b_side.id == "ctl00_ContentBody_BugDetails_BugLocation") {
            if (b_username.match(global_activ_username)) return;
            b_username = "";
            username_send = "user";
        }
        // Message, Mail Template aufbauen.
        template = urlencode(buildSendTemplate().replace(/#Receiver#/ig, b_username));
        // Message Icon erzeugen.
        if (settings_show_message && b_art == "per guid") {
            var mess_link = document.createElement("a");
            var mess_img = document.createElement("img");
            mess_img.setAttribute("style", "margin-left: 0px; margin-right: 0px");
            mess_img.setAttribute("title", "Send a message to " + username_send);
            mess_img.setAttribute("src", global_message_icon);
            mess_link.appendChild(mess_img);
            if (settings_message_icon_new_win) mess_link.setAttribute("target", "_blank");
            mess_link.setAttribute("href", "/account/messagecenter?recipientId=" + guid + "&text=" + template);
            b_side.parentNode.insertBefore(mess_link, b_side.nextSibling);
            b_side.parentNode.insertBefore(document.createTextNode(" "), b_side.nextSibling);
            // "Message this owner" und Icon entfernen.
            $('#ctl00_ContentBody_mcd1').find(".message__owner").remove();  // Cache Listing
            $('.BugDetailsList').find(".message__owner").remove();  // TB Listing
        }
        // Mail Icon erzeugen.
        if (settings_show_mail) {
            var mail_link = document.createElement("a");
            var mail_img = document.createElement("img");
            mail_img.setAttribute("style", "margin-left: 0px; margin-right: 0px");
            mail_img.setAttribute("title", "Send a mail to " + username_send);
            mail_img.setAttribute("src", global_mail_icon);
            mail_link.appendChild(mail_img);
            if (settings_mail_icon_new_win) mail_link.setAttribute("target", "_blank");
            if (b_art == "per guid") {
                mail_link.setAttribute("href", "/email/?guid=" + guid + "&text=" + template);
                b_side.parentNode.insertBefore(mail_link, b_side.nextSibling);
                b_side.parentNode.insertBefore(document.createTextNode(" "), b_side.nextSibling);
            } else {
                b_side.appendChild(document.createTextNode(" "));
                mail_link.setAttribute("href", "/email/?u=" + urlencode(b_username) + "&text=" + template);
                b_side.appendChild(mail_link);
                b_side.appendChild(document.createTextNode(" "));
            }
        }
    }
    // Message, Mail Template aufbauen, bis auf Empfänger.
    function buildSendTemplate() {
        var tpl = getValue("settings_mail_signature", "");
        var trimIt = (tpl.length == tpl.trim().length);
        tpl = tpl.replace(/#Found#/ig, global_founds+1).replace(/#Found_no#/ig, global_founds).replace(/#Me#/ig, global_activ_username);
        tpl = tpl.replace(/#Date#/ig, global_date).replace(/#Time#/ig, global_time).replace(/#DateTime#/ig, global_dateTime);
        tpl = tpl.replace(/#GCTBName#/ig, global_name).replace(/#GCTBCode#/ig, global_code).replace(/#GCTBLink#/ig, global_link);
        if (trimIt) tpl = tpl.trim();
        return tpl;
    }

// Zebra Look einfärben bzw. Einfärbung entfernen.
    function setLinesColorInZebra(para, lines, linesTogether) {
        if (lines.length == 0) return;
        var replaceSpec = /(AlternatingRow)(\s*)/g;
        var setSpec = "AlternatingRow";

        // Wenn Einfärbung nicht stattfinden soll.
        if (para == false) setLinesColorNone(lines, replaceSpec);
        // Wenn Einfärbung stattfinden soll.
        else {
            // Zeilen im ersten Zeilenbereich gegebenenfalls auf hell zurücksetzen.
            for (var i = 0; i < lines.length; i += (2 * linesTogether)) {
                for (var j = 0; j < linesTogether; j++) {
                    if (lines[i+j].className.match(replaceSpec)) {
                        var newClass = lines[i+j].className.replace(replaceSpec, "");
                        lines[i+j].setAttribute("class", newClass);
                    }
                }
            }
            // Zeilen im zweiten Zeilenbereich gegebenenfalls an erster Stelle auf dunkel setzen.
            for (var i = linesTogether; i < lines.length; i += (2 * linesTogether)) {
                for (var j = 0; j < linesTogether; j++) {
                    if (lines[i+j].className.match(replaceSpec));
                    else {
                        if (lines[i+j].getAttribute("class") == (undefined|null|"")) var oldClass = "";
                        else var oldClass = " " + lines[i+j].getAttribute("class");
                        lines[i+j].setAttribute("class", setSpec + oldClass);
                    }
                }
            }
        }
    }

// User, Owner einfärben bzw. Einfärbung entfernen.
    function setLinesColorUser(paraStamm, tasks, lines, linesTogether, owner, bookmarklist) {
        if (lines.length == 0) return;
        var user = global_me;
        if (owner == undefined) var owner = "";
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
        var para = new Array();
        if (tasks.match("user")) para["user"] = getValue(paraStamm + "_user");
        else para["user"] = "";
        if (tasks.match("owner")) para["owner"] = getValue(paraStamm + "_owner");
        else para["owner"] = "";
        if (tasks.match("reviewer")) para["reviewer"] = getValue(paraStamm + "_reviewer");
        else para["reviewer"] = "";
        if (tasks.match("vip")) para["vip"] = getValue(paraStamm + "_vip");
        else para["vip"] = "";

        // Wenn Einfärbung für User nicht stattfinden soll, entfernen.
        if (para["user"] == false) setLinesColorNone(lines, replaceSpecUser);
        // Wenn Einfärbung stattfinden soll.
        if (para["user"] == true || para["owner"] == true || para["reviewer"] == true || para["vip"] == true) {
            for (var i = 0; i < lines.length; i += linesTogether) {
                var newClass = "";
                var aTags = lines[i].getElementsByTagName("a");
                var imgTags = lines[i].getElementsByTagName("img");
                // Cache, TB Listing. Anhand guid prüfen, ob Einfärbung für User oder Owner notwendig ist.
                if (para["user"] || para["owner"]) {
                    for (var j = 0; j < aTags.length; j++) {
                        if (aTags[j].href.match(/\/profile\/\?guid=/)) {
                            if (decode_innerHTML(aTags[j]) == user && para["user"]) newClass = setSpecUser;
                            else if (decode_innerHTML(aTags[j]) == owner && para["owner"]) newClass = setSpecOwner;
                            break;
                        }
                    }
                    // Bookmark Listen. Anhand Found Icon prüfen, ob Einfärbung für User notwendig ist.
                    // (Originallogs würden wegen src mit found noch hier reingehen -> para bookmarklist.)
                    if (newClass == "" && para["user"] && bookmarklist) {
                        for (var j = 0; j < imgTags.length; j++) {
                            if (imgTags[j].src.match(/\/found\./)) {
                                newClass = setSpecUser;
                                break;
                            }
                        }
                    }
                }
                // Cache, TB Listing. Anhand Admin Icon prüfen, ob Einfärbung für Reviewer notwendig ist.
                // (Logs von ehemaligen Reviewern werden nicht mehr eingefärbt. Besser wäre wohl Icons abzufragen.)
                if (newClass == "" && para["reviewer"]) {
                    for (var j = 0; j < imgTags.length; j++) {
                        if (imgTags[j].src.match(/\/icon_admin\./)) {
                            newClass = setSpecReviewer;
                            break;
                        }
                    }
                }
                // Cache, TB Listing. Anhand titles zum VIP Icon und guid der VIP prüfen, ob Einfärbung für VIP notwendig ist. VIP kann sich während Seitendarstellung ändern.
                if (newClass == "" && para["vip"] && vips) {
                    // Farbe für VIP zurücksetzen.
                    for (var j = 0; j < linesTogether; j++) {
                        if (lines[i+j].className.match(replaceSpecVip)) {
                            var replaceClass = lines[i+j].className.replace(replaceSpecVip, "");
                            lines[i+j].setAttribute("class", replaceClass);
                        }
                    }
                    // Wenn VIP Icon gesetzt und guid in VIPS Area vorhanden, merken, dass Farbe für VIP gesetzt werden muss.
                    for (var j = 0; j < imgTags.length; j++) {
                        if (imgTags[j].title.match(/from VIP-List/)) {
                            for (var k = 0; k < aTags.length; k++) {
                                if (aTags[k].href.match(/\/profile\/\?guid=/)) {
                                    if (in_array(decode_innerHTML(aTags[k]), vips)) {
                                        newClass = setSpecVip;
                                    }
                                    break;
                                }
                            }
                            break;
                        }
                    }
                }

                // Wenn Einfärbung notwendig ist. Prüfen, ob Einfärbung nicht vorhanden ist, gegebenenfalls dann an erster Stelle einbauen.
                if (newClass != "") {
                    for (var j = 0; j < linesTogether; j++) {
                        if (lines[i+j].className.match(newClass));
                        else {
                            if (lines[i+j].getAttribute("class") == null) var oldClass = "";
                            else var oldClass = " " + lines[i+j].getAttribute("class");
                            lines[i+j].setAttribute("class", newClass + oldClass);
                        }
                    }
                }
            }
        }
    }

// Spezifikation für Einfärbung Zeile entfernen.
    function setLinesColorNone(lines, replSpez) {
        if (lines.length == 0) return;
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].className.match(replSpez)) {
                var newClass = lines[i].className.replace(replSpez, "");
                lines[i].setAttribute("class", newClass);
            }
        }
    }

// Neue Parameter im GClh Config hervorheben und Versions Info setzen.
    var d = "<div  style='background-color: rgba(240, 223, 198, #); width: 100%; height: 100%; padding: 2px 0px 2px 2px; margin-left: -2px;'>";
    var s = "<span style='background-color: rgba(240, 223, 198, #); float: right; padding-top: 25px; width: 100%; margin: -22px 2px 0px 0px;'></span>";
//--> $$001
    newParameterOn1 = d.replace("#", "0.3");
    newParameterOn2 = d.replace("#", "0.6");
    newParameterOn3 = d.replace("#", "1.0");
    newParameterLL1 = s.replace("#", "0.3");
    newParameterLL2 = s.replace("#", "0.6");
    newParameterLL3 = s.replace("#", "1.0");
//<-- $$001
    function newParameterVersionSetzen(version) {
        var newParameterVers = "<span style='font-size: 70%; font-style: italic; float: right; margin-top: -14px; margin-right: 4px;' ";
        if (version != "") newParameterVers += "title='Implemented with version " + version + "'>" + version + "</span>";
        else newParameterVers += "></span>";
        if (settings_hide_colored_versions) newParameterVers = "";
        return newParameterVers;
    }
    newParameterOff = "</div>";
    function newParameterLLVersionSetzen(version) {
        var newParameterVers = '<span style="font-size: 70%; font-style: italic; margin-top: 10px; margin-left: -192px; position: absolute; cursor: default;"';
        if (version != "") newParameterVers += 'title="Implemented with version ' + version + '">' + version + '</span>';
        else newParameterVers += '></span>';
        if (settings_hide_colored_versions) newParameterVers = "";
        return newParameterVers;
    }
    if (settings_hide_colored_versions) newParameterOn1 = newParameterOn2 = newParameterOn3 = newParameterLL1 = newParameterLL2 = newParameterLL3 = newParameterOff = "";

// Seite abdunkeln.
    function buildBgShadow() {
        var shadow = document.createElement("div");
        shadow.setAttribute("id", "bg_shadow");
        shadow.setAttribute("style", "z-index:1000; width: 100%; height: 100%; background-color: #000000; position:fixed; top: 0; left: 0; opacity: 0.5; filter: alpha(opacity=50);");
        $('body')[0].appendChild(shadow);
        $('#bg_shadow')[0].addEventListener("click", btnClose, false);
    }

// Ist Config aktiv?
    function check_config_page() {
        var config_page = false;
        if ($('#bg_shadow')[0] && $('#bg_shadow')[0].style.display == "" && $('#settings_overlay')[0] && $('#settings_overlay')[0].style.display == "") config_page = true;
        return config_page;
    }
// Ist Sync aktiv?
    function check_sync_page() {
        var sync_page = false;
        if ($('#bg_shadow')[0] && $('#bg_shadow')[0].style.display == "" && $('#sync_settings_overlay')[0] && $('#sync_settings_overlay')[0].style.display == "") sync_page = true;
        return sync_page;
    }

// Ist spezielle Verarbeitung auf aktueller Seite erlaubt?
    function checkTaskAllowed(task, doAlert) {
        if ((document.location.href.match(/^https?:\/\/(www\.wherigo|www\.waymarking|labs\.geocaching)\.com/) || isMemberInPmoCache()) ||
            (task != "Find Player" &&  document.location.href.match(/\.com\/map\//))) {
            if (doAlert != false) alert("This GC little helper functionality is not available at this page.\n\nPlease go to the \"Dashboard\" page, there is anyway all of these \nfunctionality available. ( www.geocaching.com/my )");
            return false;
        }
        return true;
    }

// Zusatz in url, eingeleitet durch "#", zurücksetzen bis auf "#".
    function clearUrlAppendix(url, onlyTheFirst) {
        var urlSplit = url.split('#');
        var newUrl = "";
        if (onlyTheFirst) newUrl = url.replace(urlSplit[1], "").replace("##", "#");
        else newUrl = urlSplit[0] + "#";
        return newUrl;
    }

// Ist Basic Member in PMO Cache?
    function isMemberInPmoCache() {
        if (is_page("cache_listing") && $('.pmo-banner')[0] && $('.pmo-upsell')[0]) return true;
        else return false;
    }

// Installationszähler simulieren.
    function instCount(declaredVersion) {
        var side = $('body')[0];
        var div = document.createElement("div");
        div.id = "gclh_simu";
        div.setAttribute("style", "margin-top: -50px;");
        var prop = ' style="border: none; visibility: hidden; width: 2px; height: 2px;" alt="">';
//--> $$002
        var code = '<img src="https://c.andyhoppe.com/1485103563"' + prop +
                   '<img src="https://c.andyhoppe.com/1485234890"' + prop +
                   '<img src="https://www.worldflagcounter.com/dN1"' + prop +
                   '<img src="https://s07.flagcounter.com/countxl/mHeY/bg_FFFFFF/txt_000000/border_CCCCCC/columns_6/maxflags_60/viewers_0/labels_1/pageviews_1/flags_0/percent_0/"' + prop;
//<-- $$002
        div.innerHTML = code;
        side.appendChild(div);
        setValue("declared_version", scriptVersion);
        setTimeout(function() {$("#gclh_simu").remove();}, 4000);
        setTimeout(function() {
            var url = urlChangelog;
            var text = "Version " + scriptVersion + " of  \"" + scriptName + "\"  was successfully installed.\n\n"
                     + "Do you want to open the changelog in a new tab, to have a quick\n"
                     + "look at changes and new features?\n";
//--> $$003
            if (browser === "firefox" && isTM === false) {
               var text = "Version " + scriptVersion + " of  \"" + scriptName + "\"  was successfully installed.\n\n"
                        + "DEAR FIREFOX USER, PLEASE CHECK THE CHANGELOG TO VERSION 0.8.10 AND HIGHER!\n\n"
                        + "Do you want to open the changelog in a new tab?\n";
            }
//<-- $$003
            if (window.confirm(text)) window.open(url, '_blank');
        }, 1000);
    }

// Migrationsaufgaben erledigen für neue Version.
    function migrationTasks() {
        // Migrate Mail signature to Mail template (zu v0.4).
        if (getValue("migration_task_01", false) != true) {
            if (settings_show_mail || settings_show_message) {
                var template = "Hi #Receiver#,";
                if (getValue("settings_show_mail_coordslink") == true || getValue("settings_show_message_coordslink") == true) template += "\n\n#GCTBName# #GCTBLink#";
                if (getValue("settings_mail_signature", "") != "") template += "\n\n" + getValue("settings_mail_signature");
                setValue("settings_mail_signature", template);
            }
            setValue("migration_task_01", true);
        }
    }

// Aktuelles Datum, Zeit.
    function getDateTime() {
        var now = new Date();
        var aDate = $.datepicker.formatDate('dd.mm.yy', now);
        var hrs = now.getHours();
        var min = now.getMinutes();
        hrs = ((hrs < 10) ? '0' + hrs : hrs);
        min = ((min < 10) ? '0' + min : min);
        var aTime = hrs+':'+min;
        var aDateTime = aDate+' '+aTime;
        return [aDate, aTime, aDateTime];
    }

// GC/TB Name, GC/TB Link, GC/TB Name Link, vorläufiges LogDate.
    function getGCTBInfo(newLogPage) {
        var GCTBName = ""; var GCTBLink = ""; var GCTBNameLink = ""; var LogDate = "";
        if (newLogPage) {
            if ($('#LogDate'[0])) var LogDate = $('#LogDate')[0].value;
            if ($('.muted')[0] && $('.muted')[0].children[0]) {
                var GCTBName = $('.muted')[0].children[0].innerHTML;
                GCTBName = GCTBName.replace(/'/g,"");
                var GCTBLink = $('.muted')[0].children[0].href;
                var GCTBNameLink = "[" + GCTBName + "](" + GCTBLink + ")";
            }
        } else {
            if ($('#uxDateVisited')[0]) var LogDate = $('#uxDateVisited')[0].value;
            if ($('#ctl00_ContentBody_LogBookPanel1_WaypointLink')[0].nextSibling.nextSibling) {
                var GCTBName = $('#ctl00_ContentBody_LogBookPanel1_WaypointLink')[0].nextSibling.nextSibling.nextSibling.innerHTML;
                GCTBName = GCTBName.replace(/'/g,"");
                var GCTBLink = $('#ctl00_ContentBody_LogBookPanel1_WaypointLink')[0].href;
                var GCTBNameLink = "[" + GCTBName + "](" + GCTBLink + ")";
            }
        }
        return [GCTBName, GCTBLink, GCTBNameLink, LogDate];
    }

// Show, hide Box. Z.B.: Beide VIP Boxen im Cache Listing.
    function showHideBoxCL(id_lnk, first) {
        if (id_lnk.match("lnk_gclh_config_")) var is_config = true;
        else is_config = false;
        var name_show_box = id_lnk.replace("lnk_", "show_box_");
        var id_box = id_lnk.replace("lnk_", "");
        var show_box = getValue(name_show_box, true);
        if (document.getElementById(id_lnk)) var lnk = document.getElementById(id_lnk);
        if (document.getElementById(id_box)) var box = $('#' + id_box);
        if (!box) {
            if (document.getElementsByClassName(id_box)) var box = $('.' + id_box);
        }
        if (lnk && box) {
            if ((show_box == true && first == true) || (show_box == false && first == false)) {
                setShowHide(lnk, "hide", is_config);
                box.show();
                var showHide = "hide";
                setValue(name_show_box, true);
                if (!first && is_config) {
                    document.getElementById(id_lnk).scrollIntoView();
                    window.scrollBy(0, -15);
                }
            } else {
                setShowHide(lnk, "show", is_config);
                box.hide();
                var showHide = "show";
                setValue(name_show_box, false);
            }
            return showHide;
        }
    }
    function setShowHide(row, whatToDo, is_config) {
        if (whatToDo == "show") {
            row.title = "show";
            if (is_config == true) {
                row.src = global_plus_config2;
                row.parentNode.className += " gclh_hide";
            } else row.src = "/images/plus.gif";
        } else {
            row.title = "hide";
            if (is_config == true) {
                row.src = global_minus_config2;
                row.parentNode.className = row.parentNode.className.replace(" gclh_hide","");
            } else row.src = "/images/minus.gif";
        }
        if (is_config == true) row.title += " topic\n(all topics with right mouse)";
    }

// Waypoint evaluations.
    function getWaypointTable() {
        var tbl = $("#ctl00_ContentBody_Waypoints");
        if (tbl.length <= 0) tbl = $("#ctl00_ContentBody_WaypointList");
        return tbl;
    }
    // Trim decimal value to a given number of digits.
    function roundTO(val, decimals) {return Number(Math.round(val+'e'+decimals)+'e-'+decimals);}
    // Get Additional Waypoints.
    function getAdditionalWaypoints() {
        try {
            var addWP = [];
            var tbl = document.getElementById('ctl00_ContentBody_Waypoints');
            if (tbl == null) tbl = document.getElementById('ctl00_ContentBody_WaypointList');
            if (tbl == null) return;
            if (tbl.getElementsByTagName('tbody')) {
                var tblbdy = tbl.getElementsByTagName('tbody')[0];
                var tr_list = tblbdy.getElementsByTagName('tr');
                for (var i=0; i < tr_list.length/2; i++) {
                    var td_list = tr_list[2*i].getElementsByTagName('td');
                    var td_list2nd = tr_list[2*i+1].getElementsByTagName('td');
                    var wayp = {};
                    if (td_list[3]) {
                        wayp.icon = td_list[1].getElementsByTagName("img")[0].getAttribute("src");
                        wayp.prefix = td_list[2].textContent.trim();
                        wayp.lookup = td_list[3].textContent.trim();
                        wayp.name = td_list[4].getElementsByTagName("a")[0].textContent;
                        var oDiv = td_list[4];
                        var firstText = "";
                        for (var j = 0; j < oDiv.childNodes.length; j++) {
                            var curNode = oDiv.childNodes[j];
                            if (curNode.nodeName === "#text") firstText += curNode.nodeValue.trim();
                        }
                        wayp.subtype_name = firstText;
                        wayp.link = td_list[4].getElementsByTagName("a")[0].getAttribute("href");
                        var subtype = "";
                        var icon = wayp.icon;
                        if (icon.match(/trailhead.jpg/g)) subtype = "Trailhead";
                        else if (icon.match(/flag.jpg/g)) subtype = "Final Location";
                        else if (icon.match(/pkg.jpg/g)) subtype = "Parking Area";
                        else if (icon.match(/stage.jpg/g)) subtype = "Physical Stage";
                        else if (icon.match(/puzzle.jpg/g)) subtype = "Virtual Stage";
                        else if (icon.match(/waypoint.jpg/g)) subtype = "Reference Point";
                        else gclh_log("ERROR: getAdditionalWaypoints(): problem with waypoint "+wayp.lookup+"/"+wayp.prefix+ " - unknown waypoint type ("+icon+")");
                        wayp.subtype = subtype;
                        wayp.visible = false;
                        tmp_coords = toDec(td_list[5].textContent.trim());
                        if (typeof tmp_coords[0] !== 'undefined' && typeof tmp_coords[1] !== 'undefined') {
                            wayp.latitude = tmp_coords[0];
                            wayp.longitude = tmp_coords[1];
                            wayp.visible = true;
                        }
                        wayp.note = td_list2nd[2].textContent.trim();
                        wayp.type = "waypoint";
                        addWP.push(wayp);
                    }
                }
            }
        } catch(e) {gclh_error("getAdditionalWaypoints:",e);}
        return addWP;
    }
    // Reads posted coordinates from listing.
    function getListingCoordinatesX() {
        var addWP = [];
        try {
            if (!$('#cacheDetails')[0]) return;
            var wayp = {};
            var gccode = "n/a";
            var gcname = "n/a";
            if ($('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode')[0]) gccode = $('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode')[0].textContent;
            if ($('#ctl00_ContentBody_CacheName')[0]) gcname = $('#ctl00_ContentBody_CacheName')[0].textContent;
            if ((typeof(unsafeWindow.userDefinedCoords) != 'undefined') && (unsafeWindow.userDefinedCoords.data.isUserDefined==true)) {
                wayp = {};
                wayp.visible = true;
                wayp.latitude = roundTO(unsafeWindow.userDefinedCoords.data.newLatLng[0],6);
                wayp.longitude = roundTO(unsafeWindow.userDefinedCoords.data.newLatLng[1],6);
                wayp.lookup = gccode;
                wayp.prefix = "";
                wayp.name = gcname;
                wayp.note = "";
                wayp.type = "listing";
                wayp.subtype = "changed";
                wayp.cachetype = $('#cacheDetails .cacheImage img')[0].getAttribute('title');
                wayp.link = document.location.href;
                addWP.push(wayp);
                wayp = {};
                wayp.latitude = roundTO(unsafeWindow.userDefinedCoords.data.oldLatLng[0],6);
                wayp.longitude = roundTO(unsafeWindow.userDefinedCoords.data.oldLatLng[1],6);
            } else if ($('#ctl00_ContentBody_uxViewLargerMap')[0]) {
                var tmp_coords = $('#ctl00_ContentBody_uxViewLargerMap')[0].getAttribute('href').match(/(-)*(\d{1,3})(.(\d{1,6}))?/g);
                wayp.latitude = tmp_coords[0];
                wayp.longitude = tmp_coords[1];
            } else gclh_log("ERROR: getListingCoordinatesX(): warning: listing coordinates are not found.");
            wayp.visible = true;
            wayp.lookup = gccode;
            wayp.prefix = "";
            wayp.name = gcname;
            wayp.note = "";
            wayp.type = "listing";
            wayp.subtype = "origin";
            wayp.link = document.location.href;
            wayp.cachetype = $('#cacheDetails .cacheImage img')[0].getAttribute('title');
            addWP.push(wayp);
            return addWP;
        } catch(e) {gclh_error("Reads the posted coordinates from the listing:",e);}
    }
    function extractWaypointsFromListing() {
        var wayps = [];
        wayps = wayps.concat(getListingCoordinatesX());
        wayps = wayps.concat(getAdditionalWaypoints());
        return wayps;
    }
    // Calculate tile numbers X/Y from latitude/longitude or reverse.
    function lat2tile(lat,zoom)  {return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)));}
    function long2tile(lon,zoom) {return (Math.floor((lon+180)/360*Math.pow(2,zoom)));}
    function tile2long(x,z) {return (x/Math.pow(2,z)*360-180);}
    function tile2lat(y,z) {var n=Math.PI-2*Math.PI*y/Math.pow(2,z); return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));}

// Build box for VIPS, VUPS, All Links, Linklist on dashboard.
    function buildDashboardCss() {
        var css = "";
        css += ".link-header.gclh {padding: 12px 20px !important; cursor: pointer; border-top: 1px solid #e4e4e4;}";
        css += ".link-header.gclh svg {height: 22px; width: 22px; fill: #777; float: right; padding-right: 1px; margin-top: -2px; transition: all .3s ease; transform-origin: 50% 50%;}";
        css += ".link-header.gclh.isHide svg {transform: rotate(90deg);}";
        css += ".link-block.gclh {padding-top: 0px; border-bottom: unset; display: block;}";
        css += ".link-block.gclh a:hover {text-decoration: underline; color: #02874d;} .link-block.gclh a {padding: 0 4px 0 0; font-size: 14px;}";
        css += ".link-block.isHide {display: none} .link-block {border-bottom: unset;}";
        appendCssStyle(css);
    }
    function buildBoxDashboard(ident, name, title) {
        if (!$("nav.sidebar-links")[1]) return;
        var head = document.createElement("h3");
        head.setAttribute("class", (getValue("show_box_dashboard_" + ident, true) == true ? "link-header gclh" : "link-header gclh isHide"));
        head.setAttribute("name", "head_" + ident);
        if (title) head.setAttribute("title", title);
        if (name) head.innerHTML = name + " <svg><use xlink:href='/account/app/ui-icons/sprites/global.svg#icon-expand-svg-fill'></use></svg>";
        head.addEventListener("click", showHideBoxDashboard, false);
        $("nav.sidebar-links")[1].appendChild(head);
        var box = document.createElement("ul");
        box.setAttribute("class", (getValue("show_box_dashboard_" + ident, true) == true ? "link-block gclh" : "link-block gclh isHide"));
        box.setAttribute("name", "box_" + ident);
        $("nav.sidebar-links")[1].appendChild(box);
    }
    function buildCopyOfBookmarks() {
        var bm_tmp = new Array();
        for (var i = 0; i < bookmarks.length; i++) {
            bm_tmp[i] = new Object();
            for (attr in bookmarks[i]) {bm_tmp[i][attr] = bookmarks[i][attr];}
        }
        return bm_tmp;
    }
    function buildBoxElementsLinklist(box) {
        for (var i = 0; i < settings_bookmarks_list.length; i++) {
            var x = settings_bookmarks_list[i];
            if (typeof(x) == "undefined" || x == "" || typeof(x) == "object") continue;
            var a = document.createElement("a");
            for (attr in bookmarks[x]) {
                if (attr == "custom" || attr == "title") continue;
                if (attr == "name" || attr == "id") a.setAttribute(attr, bookmarks[x][attr]+"_profile");
                else a.setAttribute(attr, bookmarks[x][attr]);
            }
            a.appendChild(document.createTextNode(bookmarks[x]['title']));
            var li = document.createElement("li");
            li.appendChild(a);
            box.appendChild(li);
        }
    }
    function buildBoxElementsLinks(box, bm_tmp) {
        for (var i = 0; i < bm_tmp.length; i++) {
            if (bm_tmp[i]['origTitle'] == "(empty)" || bm_tmp[i]['href'] == "" || bm_tmp[i]['href'] == "#") continue;
            var a = document.createElement("a");
            for (attr in bm_tmp[i]) {
                if (attr == "custom" || attr == "title" || attr == "origTitle") continue;
                if (attr == "name" || attr == "id") a.setAttribute(attr, bm_tmp[i][attr]+"_profile");
                else a.setAttribute(attr, bm_tmp[i][attr]);
            }
            a.appendChild(document.createTextNode(bm_tmp[i]['origTitle']));
            var li = document.createElement("li");
            li.appendChild(a);
            box.appendChild(li);
        }
    }

// Show, Hide box on dashboard.
    function showHideBoxDashboard() {
        if (!$(this.nextElementSibling)) return;
        var ident = this.getAttribute("name").replace("head_", "");
        (this.className.match("isHide") ? setValue("show_box_dashboard_" + ident, true) : setValue("show_box_dashboard_" + ident, false));
        (this.className.match("isHide") ? $(this.nextElementSibling).removeClass("isHide") : $(this.nextElementSibling).addClass("isHide"));
        (this.className.match("isHide") ? $(this).removeClass("isHide") : $(this).addClass("isHide"));
    }

// Show log counter.
    function showLogCounterLink() {
        addButtonOverLogs(showLogCounter, "gclh_show_log_counter", true, "Show log counter", "Show log counter for log type and total");
        appendCssStyle(".gclh_logCounter {font-size: 10px !important; padding-left: 6px; font-style: italic;}");
    }
    function showLogCounter() {
        try {
            $('#gclh_show_log_counter').addClass("working");
            setTimeout(function() {
                var logCounter = new Object();
                logCounter["all"] = 0;
                var logTypes = $('.LogTotals a');
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
                $('#gclh_show_log_counter').removeClass("working");
            }, 100);
        } catch(e) {gclh_error("showLogCounter:",e);}
    }

// Add button over logs in cache listing.
    function addButtonOverLogs(func, id, right, txt, title) {
        if (!$('#ctl00_ContentBody_uxLogbookLink')[0]) return;
        var span = document.createElement("span");
        span.id = id;
        span.innerHTML = '<input type="button" href="javascript:void(0);" title="'+title+'" value="'+txt+'">';
        span.addEventListener("click", func, false);
        if (right) span.className = "gclh_rlol";
        else span.className = "gclh_llol";
        if ($('.gclh_llol').length == 0 && $('.gclh_rlol').length == 0) {
            appendCssStyle(".gclh_llol {margin-right: 4px;} .gclh_rlol {float: right; margin-right: 4px;} .gclh_llol.working input, .gclh_rlol.working input {opacity: 0.3;}");
            $('#ctl00_ContentBody_uxLogbookLink')[0].parentNode.style.width = "100%";
            $('#ctl00_ContentBody_uxLogbookLink')[0].parentNode.style.margin = "0";
        }
        $('#ctl00_ContentBody_uxLogbookLink')[0].parentNode.append(span);
    }

// Ist Seite eigene Statistik?
    function isOwnStatisticsPage(){
        if ((document.location.href.match(/\.com\/my\/statistics\.aspx/)) ||
            (is_page("publicProfile") && $('#ctl00_ContentBody_lblUserProfile')[0].innerHTML.match(global_me) && $('#ctl00_ContentBody_ProfilePanel1_lnkStatistics.Active')[0])) {
            return true;
        } else return false;
    }

// Consideration of special keys ctrl, alt, shift on keyboard input.
    function noSpecialKey(e) {
        if (e.ctrlKey != false || e.altKey != false || e.shiftKey != false) return false;
        else return true;
    }

// User, guid aus nachgelesenem alten oder neuem Public Profile ermitteln.
    function getUserGuidFromProfile(respText) {
        var user = respText.match(/id="ctl00_(ProfileHead_ProfileHeader|ContentBody_ProfilePanel1)_lblMemberName">(.*?)<\/span>/);
        var guid = respText.match(/href="\/account\/messagecenter\?recipientId=(.*?)"/);
        if (user && user[1] && user[2] && guid && guid[1]) {
            var span = document.createElement('span');
            span.innerHTML = user[2];
            var username = decode_innerHTML(span);
            return [username, guid[1]];
        }
    }

// User aus url ermitteln.
    function getUrlUser() {
        var urluser = document.location.href.match(/\.com\/seek\/nearest\.aspx\?(ul|u)=(.*)/);
        urluser = urldecode(urluser[2].replace(/&([A-Za-z0-9]+)=(.*)/, ""));
        urluser = urluser.replace(/&disable_redirect=/, "");
        if (!urluser.match(/^#/)) urluser = urluser.replace(/#(.*)/, "");
        return urluser;
    }

//////////////////////////////
// User defined searchs Main
//////////////////////////////
    function create_config_css_search() {
        var html = "";
        html += ".btn-context {";
        html += "  border: 0;";
        html += "  height: 40px;";
        html += "  margin-top: -4px;";
        html += "  text-indent: -9999px;";
        html += "  width: 30px;";
        html += "  margin-left: -8px;";
        html += "  margin-right: 10px;}";
        html += ".btn-user {";
        html += "  background-color: transparent;";
        html += "  background-image: none;";
        html += "  border: 2px solid #00b265;";
        html += "  border-color: #fff;";
        html += "  border-radius: 4px;";
        html += "  clear: both;";
        html += "  color: #fff;";
        html += "  font-size: 16px;";
        html += "  margin-bottom: 0;";
        html += "  margin-top: 20px;";
        html += "  padding: .45em 24px;}";
        html += ".filters-toggle {";
        html += "  display: block;}";
        html += ".btn-user-active, .btn-user:hover, .btn-user:active {";
        html += "  background-color: #00b265;";
        html += "  border: 2px solid #00b265;}";
        html += ".btn-iconsvg svg {";
        html += "  width: 22px;";
        html += "  height: 22px;";
        html += "  margin-right: 3px;}";
        html += ".add-list li {";
        html += "  padding: 2px 0;}";
        appendCssStyle(html);
    }
    function saveFilterSet() {setValue("settings_search_data", JSON.stringify(settings_search_data));}
    function actionOpen(id) {
        for (var i = 0; i < settings_search_data.length; i++) {
            if (settings_search_data[i].id == id) {
                document.location.href = settings_search_data[i].url;
                break;
            }
        }
    }
    function actionRename(id, name) {
        for (var i = 0; i < settings_search_data.length; i++) {
            if (settings_search_data[i].id == id) {
                settings_search_data[i].name = name;
                saveFilterSet();
                break;
            }
        }
    }
    function actionUpdate(id, page) {
        for (var i = 0; i < settings_search_data.length; i++) {
            if (settings_search_data[i].id == id) {
                settings_search_data[i].url = page.split("#")[0];
                settings_search_data[i].url = settings_search_data[i].url.replace(/&MfsId=(\d+)/, "") + "&MfsId=" + settings_search_data[i].id;
                saveFilterSet();
                break;
            }
        }
    }
    function actionNew(name, page) {
        // Find latest id.
        var i = settings_search_data.length;
        var id = -1;
        for (var i = 0; i < settings_search_data.length; i++) {
            if (id < settings_search_data[i].id) id = settings_search_data[i].id;
        }
        settings_search_data[i] = {};
        settings_search_data[i].id = id+1;
        settings_search_data[i].name = name;
        settings_search_data[i].url = page.split("#")[0];
        settings_search_data[i].url = settings_search_data[i].url.replace(/&MfsId=(\d+)/, "") + "&MfsId=" + settings_search_data[i].id;
        saveFilterSet();
    }
    function actionSearchDelete(id) {
        var tmp = [];
        for (var i = 0; i < settings_search_data.length; i++) {
            if (settings_search_data[i].id != id) tmp[tmp.length] = settings_search_data[i];
        }
        settings_search_data = tmp;
        saveFilterSet();
    }
    function updateUI() {
        if ($("#searchContextMenu").length == 0) {
            var html = "";
            html += '<div id="searchContextMenu" class="pop-modal" style="top: 110px; left: 20%; width: 60%; position: absolute;">';
            html += '<div id="filter-new" class="add-menu" style="display: none;"><label for="newListName">Save current Filter Set</label>';
            html += '<div class="input-control active"><input id="nameSearch" name="newListName" maxlength="150" placeholder="New Name" type="text">';
            html += '<div class="add-list-status"><button id="btn-save" class="add-list-submit" type="button" style="display: inline-block;">Save</button></div></div></div>';
            html += '<div id="filter-edit" class="add-menu" style="display: none;"><label for="newListName">Edit Filter Set <i><span id="filterName"></span></i></label>';
            html += '<div class="input-control active"><input id="filter-name-rename" name="newListName" maxlength="150" placeholder="New Name" type="text">';
            html += '<div class="add-list-status"><button id= "btn-rename" class="add-list-submit" type="button" style="display: inline-block;">Rename</button></div>';
            html += '<div id="div-btn-update" class="add-list-status"><button id="btn-update" class="add-list-submit" type="button" style="display: inline-block;">Update</button></div></div></div><label class="add-list-label">Available Filter Sets</label><ul id="filterlist" class="add-list"></ul></div>';
            $("#ctxMenu").html(html);
            $('#btn-save').click(function() {
                var name = $("#nameSearch").val();
                if (name == "") {
                    alert("Insert name!");
                    $("#nameSearch").css('background-color', '#ffc9c9');
                    return;
                } else {
                    actionNew(name, document.location.href);
                    $("#nameSearch").css('background-color', '#ffffff');
                }
                hideCtxMenu();
            });
            $('#btn-rename').click(function() {
                var id = $(this).data('id');
                var name = $("#filter-name-rename").val();
                actionRename(id, name);
                updateUI();
            });
            $('#btn-update').click(function() {
                var id = $(this).data('id');
                var update = (document.location.href.indexOf("?")>=0?true:false);
                if (update) {
                    actionUpdate(id, document.location.href);
                    hideCtxMenu();
                }
            });
        }
        $("#filter-edit").hide();
        if ($(".results").length != 0) $("#filter-new").show();
        var html = "";
        if (settings_search_data.length) {
            settings_search_data.sort(function(a, b){return a.name.toUpperCase()>b.name.toUpperCase();});
        }
        for (var i = 0; i < settings_search_data.length; i++) {
            html += '<li data-id="'+settings_search_data[i].id+'">';
            var id = 'data-id="'+settings_search_data[i].id+'"';
            var t = (settings_search_data[i].url == document.location.href.split("#")[0])?true:false;
            html += '<button type="button" class="btn-item-action action-open" '+id+'>'+(t?'<b>':'')+settings_search_data[i].name+(t?'</b>':'')+'</button>';
            html += '<div type="button" title="Remove Filter Set" class="status btn-iconsvg action-delete" '+id+'><svg class="icon icon-svg-button" role="presentation"><use xlink:href="/account/app/ui-icons/sprites/global.svg#icon-delete"></use></svg></div>';
            html += '<div type="button" title="Change Filter Set" style="right: 50px;" class="status btn-iconsvg action-rename" '+id+'><svg class="icon icon-svg-button" role="presentation"><use xlink:href="/account/app/ui-icons/sprites/global.svg#icon-more"></use></svg></div>';
            html += '</li>';
        }
        $("#filterlist").html(html);
        $('.action-open').click(function() {
            var id = $(this).data('id');
            actionOpen(id);
        });
        $('.action-delete').click(function() {
            var id = $(this).data('id');
            actionSearchDelete(id);
            updateUI();
        });
        $('.action-rename').click(function() {
            var id = $(this).data('id');
            $('#filter-new').hide();
            $('#filter-edit').show();
            $('#btn-rename').data('id', id);
            $('#btn-update').data('id', id);
            var update = (document.location.href.indexOf("?")>=0?true:false);
            if (update) $('#div-btn-update').show();
            else $('#div-btn-update').hide();
            $("#filter-name-rename").val("n/a");
            for (var i = 0; i < settings_search_data.length; i++) {
                if (settings_search_data[i].id == id) {
                    $("#filter-name-rename").val(settings_search_data[i].name);
                    $('#filterName').text(settings_search_data[i].name);
                    break;
                }
            }
        });
    }
    function hideCtxMenu() {
        $('#ctxMenu').hide();
        $('#filterCtxMenu').removeClass('btn-user-active');
    }

    if (settings_search_enable_user_defined && is_page("find_cache")) {
        try {
            if (!($(".results").length || settings_search_data.length)) {
            } else {
                create_config_css_search();
                $(".filters-toggle").append('&nbsp;<button id="filterCtxMenu" class="btn btn-user" type="button">Manage Filter Sets</button>  ');
                $(".filters-toggle").append('<div id="ctxMenu" style="display:none;"></div>');
                $('#filterCtxMenu').click(function() {
                    var element = $('#ctxMenu');
                    if (element.css('display') == 'none'){
                       updateUI();
                       element.show();
                       $(this).addClass('btn-user-active');
                    } else {
                       element.hide();
                       $(this).removeClass('btn-user-active');
                    }
                });
                var currentFilter = "";
                for (var i = 0; i < settings_search_data.length; i++) {
                    if (settings_search_data[i].url == document.location.href.split("#")[0]) {
                        currentFilter = "Current Filter Set: "+settings_search_data[i].name;
                    }
                }
                $(".button-group-dynamic").append('<span>'+currentFilter+'</span>');
                // Close the dialog div if a mouse click outside.
                $(document).mouseup(function(e) {
                    var container = $('#ctxMenu');
                    if (container.css('display') != 'none') {
                        if (!container.is(e.target) && !($('#filterCtxMenu').is(e.target)) &&  // If the target of the click isn't the container...
                            container.has(e.target).length === 0) {  // ... nor a descendant of the container
                            container.hide();
                            $('#filterCtxMenu').removeClass('btn-user-active');
                        }
                    }
                    return false;
                });
            }
        } catch(e) {gclh_error("User defined search:",e);}
    }

//////////////////////////////
// Find Player Main
//////////////////////////////
// Create and hide the "Find Player" Form.
    function createFindPlayerForm() {
        btnClose();
        if (checkTaskAllowed("Find Player", true) == false) return;
        if ($('#bg_shadow')[0]) {
            if ($('#bg_shadow')[0].style.display == "none") $('#bg_shadow')[0].style.display = "";
        } else buildBgShadow();
        if ($('#findplayer_overlay')[0] &&$('#findplayer_overlay')[0].style.display == "none") $('#findplayer_overlay')[0].style.display = "";
        else {
            var html = "";
            html += "#findplayer_overlay {";
            html += "  background-color: #d8cd9d;";
            html += "  width:350px;";
            html += "  border: 2px solid #778555;";
            html += "  overflow: auto;";
            html += "  padding:10px;";
            html += "  position: absolute;";
            html += "  left:30%;";
            html += "  top:60px;";
            html += "  z-index:1001;";
            html += "  border-radius: 30px;";
            html += "  overflow: auto;}";
            html += ".gclh_form {";
            html += "  background-color: #d8cd9d !important;";
            html += "  border: 2px solid #778555 !important;";
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
            html += "  display: unset;}";
            appendCssStyle(html, "body");
            // Overlay erstellen
            var html = "";
            html += "<h3 style='margin:5px; font-weight: bold; font-size: 19.5px; line-height: 1; color: #594a42;'>Find Player</h3>";
            html += "<form style='text-align: unset;' action=\"/find/default.aspx\" method=\"post\" name=\"aspnetForm\" >";
            html += "<input class='gclh_form' type='hidden' name='__VIEWSTATE' value=''>";
            html += "<input style='width: 170px;' class='gclh_form' id='findplayer_field' class=\"Text\" type=\"text\" maxlength=\"100\" name=\"ctl00$ContentBody$FindUserPanel1$txtUsername\"/>";
            html += " <input style='cursor: pointer;' class='gclh_form' type=\"submit\" value=\"go\" name=\"ctl00$ContentBody$FindUserPanel1$GetUsers\"/>";
            html += " <input style='cursor: pointer;' class='gclh_form' id='btn_close1' type='button' value='close'>";
            html += "</form>";
            var side = $('body')[0];
            var div = document.createElement("div");
            div.setAttribute("id", "findplayer_overlay");
            div.setAttribute("align", "center");
            div.innerHTML = html;
            div.appendChild(document.createTextNode(""));
            side.appendChild(div);
            $('#btn_close1')[0].addEventListener("click", btnClose, false);
        }
        if ($('.hover.open')[0]) $('.hover.open')[0].className = "";
        $('#findplayer_field')[0].focus();
    }

//////////////////////////////
// Config Main
//////////////////////////////
    function checkboxy(setting_id, label) {
        // Hier werden auch gegebenenfalls "Clone" von Parametern verarbeitet. (Siehe Erläuterung weiter unten bei "setEvForDouPara".)
        var setting_idX = setting_id;
        setting_id = setting_idX.replace(/(X[0-9]*)/, "");
        return "<input type='checkbox' " + (getValue(setting_id) ? "checked='checked'" : "" ) + " id='" + setting_idX + "'><label for='" + setting_idX + "'>" + label + "</label>";
    }
    function show_help(text) {return " <a class='gclh_info'><b>?</b><span class='gclh_span'>" + text + "</span></a>";}
    function show_help2(text) {return " <a class='gclh_info gclh_info2'><b>?</b><span class='gclh_span'>" + text + "</span></a>";}
    function show_help3(text) {return " <a class='gclh_info gclh_info3'><b>?</b><span class='gclh_span'>" + text + "</span></a>";}
    function show_help_big(text) {return " <a class='gclh_info gclh_info_big'><b>?</b><span class='gclh_span'>" + text + "</span></a>";}
    function show_help_rc(text) {return " <a class='gclh_info gclh_info_rc'><b>?</b><span class='gclh_span'>" + text + "</span></a>";}

    function create_config_css() {
        var html = "";
        html += ".settings_overlay {";
        html += "  background-color: #d8cd9d;";
        html += "  width: 600px;";
        html += "  border: 2px solid #778555;";
        html += "  overflow: auto;";
        html += "  padding: 10px;";
        html += "  position: absolute;";
        html += "  left: 30%;";
        html += "  top: 10px;";
        html += "  z-index: 1001;";
        html += "  border-radius: 30px;";
        html += "  box-sizing: unset;}";
        html += ".gclh_headline {";
        html += "  height: 21px;";
        html += "  margin: 5px;";
        html += "  background-color: #778555;";
        html += "  color: #FFFFFF;";
        html += "  border-radius: 30px;";
        html += "  text-align: center;";
        html += "  line-height: 1;";
        html += "  font-size: 19.5px;}";
        html += ".gclh_headline2 {";
        html += "  margin: 12px 5px 5px -2px;";
        html += "  line-height: 1.25;";
        html += "  font-size: 1.2em;}";
        html += ".gclh_headline2.gclh_hide {margin-top: 5px;}";
        html += ".gclh_block {";
        html += "  margin-top: 5px;";
        html += "  margin-bottom: 12px;}";
        html += ".gclh_content {";
        html += "  padding: 2px 10px 10px 10px;";
        html += "  font-family: Verdana;";
        html += "  font-size: 14px;";
        html += "  line-height: 1.5;}";
        html += ".gclh_content input, .gclh_content input:focus, .gclh_content input:active, .gclh_content textarea, .gclh_content select, .gclh_content button, .gclh_content pre {";
        html += "  display: inline;";
        html += "  width: unset;";
        html += "  border: 2px solid #778555;";
        html += "  border-radius: 7px;";
        html += "  box-shadow: none;";
        html += "  background: unset;";
        html += "  background-color: #d8cd9d;";
        html += "  background-image: none;";
        html += "  margin: 0;}";
        html += ".gclh_content input, .gclh_content textarea, .gclh_content button, .gclh_content pre {padding: 1px 5px;}";
        html += ".gclh_content input, .gclh_content textarea, .gclh_content button, .gclh_content select {color: rgb(0, 0, 0) !important;}";
        html += ".gclh_content input[type='checkbox'], .gclh_content input:focus[type='checkbox'], .gclh_content input:active[type='checkbox'], .gclh_content input[type='radio'], .gclh_content input:focus[type='radio'], .gclh_content input:active[type='radio'] {";
        html += "  margin-left: 4px;";
        html += "  margin-right: 4px;}";
        html += ".gclh_content input[type='checkbox'] {";
        html += "  opacity: 1;";
        html += "  position: unset;";
        html += "  height: unset;}";
        html += ".gclh_content span::before {display: none !important;}";
        html += ".gclh_content input[type='text'][disabled] {background: unset;}";
        html += ".gclh_content button, .gclh_content input[type='button'] {";
        html += "  cursor: pointer;";
        html += "  box-shadow: 1px 1px 3px 0px rgb(119, 133, 85);}";
        html += ".gclh_content .shadowBig {box-shadow: 1px 1px 3px 1px rgb(119, 133, 85);}";
        html += ".gclh_content textarea, .gclh_content pre {resize: vertical;}";
        html += ".gclh_content select {";
        html += "  -moz-appearance: button;";
        html += "  -webkit-appearance: menulist-button;";  // Chrome
        html += "  cursor: default;";
        html += "  padding: 0;}";
        html += ".gclh_content label {";
        html += "  display: inline;";
        html += "  font-size: 14px;";
        html += "  text-transform: unset;}";
        html += ".gclh_content .gclh_prem {";
        html += "  height: 14px;";
        html += "  vertical-align: baseline;";
        html += "  margin-bottom: -2px;}";
        html += ".gclh_content a {";
        html += "  text-decoration: none;";
        html += "  color: #3d76c5;}";
        html += ".gclh_content a:hover, .gclh_content a:active, .gclh_content a:focus {";
        html += "  text-decoration: underline;";
        html += "  color: #3d76c5;}";
        html += ".gclh_content table {";
        html += "  margin-bottom: 0px;";
        html += "  font-size: 14px;}";
        html += ".gclh_content th {font-weight: bold;}";
        html += ".gclh_content td, .gclh_content th {";
        html += "  padding: 0px 0px 0px 5px;";
        html += "  vertical-align: middle;}";
        html += ".gclh_content table, .gclh_content thead, .gclh_content tbody, .gclh_content tr, .gclh_content td, .gclh_content th {box-sizing: unset;}";
        html += ".gclh_form {";
        html += "  font-size: 14px !important;";
        html += "  font-family: Verdana !important;";
        html += "  line-height: 18px !important;}";
        html += ".gclh_ref {";
        html += "  color: #000000 !important;";
        html += "  text-decoration: none !important;";
        html += "  border-bottom: dotted 1px black;}";
        html += ".gclh_small {font-size: 10px;}";
        html += "a.gclh_info {";
        html += "  color: #000000 !important;";
        html += "  text-decoration: none;";
        html += "  cursor: help;";
        html += "  white-space: normal;}";
        html += "a.gclh_info:hover {";
        html += "  position: relative;";
        html += "  padding-bottom: 10px;}";
        html += "a.gclh_info span {";
        html += "  visibility: hidden;";
        html += "  position: absolute; top:-310px; left:0px;";
        html += "  padding: 2px;";
        html += "  text-decoration: none;";
        html += "  text-align: left;";
        html += "  vertical-align: top;";
        html += "  font-size: 12px;";
        html += "  z-index: 105;}";
        html += "a.gclh_info:hover span {";
        html += "  width: 250px;";
        html += "  visibility: visible;";
        html += "  top: 20px;";
        html += "  left: -125px;";
        html += "  font-weight: normal;";
        html += "  border: 1px solid #000000;";
        html += "  background-color: #d8cd9d;}";
        html += "a.gclh_info2:hover span {left: -80px !important;}";
        html += "a.gclh_info3:hover span {";
        html += "  left: -200px !important;}";
        html += "a.gclh_info_big:hover span {width: 350px !important;}";
        html += "table.multi_homezone_settings {";
        html += "  margin: -2px 0 5px 10px;;";
        html += "  width: 550px;";
        html += "  text-align: left;";
        html += "  vertical-align: baseline;";
        html += "  white-space: nowrap;}";
        html += ".multi_homezone_settings .remove {";
        html += "  height: 20px;";
        html += "  margin-left: 0px;";
        html += "  vertical-align: top;";
        html += "  cursor: pointer;}";
        html += ".multi_homezone_settings .disabled {";
        html += "  cursor: unset !important;";
        html += "  opacity: 0.5;}";
        html += ".multi_homezone_settings .addentry {margin-top: 2px;}";
        html += "a.gclh_info_rc:hover span {";
        html += "  width: 500px !important;";
        html += "  left: -245px !important;}";
        html += ".gclh_rc_area {";
        html += "  z-index: 1001;";
        html += "  border: 1px solid #778555;";
        html += "  border-radius: 30px;";
        html += "  padding: 20px;";
        html += "  margin-top: 15px;}";
        html += ".gclh_rc_area_button {margin-left: 185px;}";
        html += ".gclh_rc_form {";
        html += "  margin-bottom: 15px !important;";
        html += "  margin-left: 15px !important;}";
        html += ".ll_heading {";
        html += "  margin-top: 0px;";
        html += "  margin-bottom: 0px;";
        html += "  font-family: Verdana;";
        html += "  font-size: 14px;";
        html += "  font-style: normal;";
        html += "  font-weight: bold;}";
        appendCssStyle(html, "body");
    }

    var t_reqChl = "T
