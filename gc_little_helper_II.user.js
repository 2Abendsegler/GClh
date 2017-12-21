// ==UserScript==
// @name             GC little helper II
// @namespace        http://www.amshove.net
//--> $$000
// @version          0.9
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
// @connect          maps.googleapis.com
// @connect          raw.githubusercontent.com
// @description      Some little things to make life easy (on www.geocaching.com).
// @copyright        2010-2016 Torsten Amshove, 2017 2Abendsegler
// @author           Torsten Amshove; 2Abendsegler
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
    if (window.name.substring(0, 18) !== 'google_ads_iframe_') quitOnAdFramesDeref.resolve();
    else quitOnAdFramesDeref.reject();
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
    c.defaultConfigLink = "https://www.geocaching.com/my/default.aspx#GClhShowConfig";
    c.defaultSyncLink = "https://www.geocaching.com/my/default.aspx#GClhShowSync";
    c.defaultFindPlayerLink = "https://www.geocaching.com/my/default.aspx#GClhShowFindPlayer";
    // Define bookmarks:
    c.bookmarks = new Array();
    // WICHTIG: Die Reihenfolge darf hier auf keinen Fall geändert werden, weil dadurch eine falsche Zuordnung zu den gespeicherten Userdaten erfolgen würde!
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
    bookmark("Drafts Upload", "https://www.geocaching.com/my/uploadfieldnotes.aspx", c.bookmarks);
    bookmark("Pocket Queries", "https://www.geocaching.com/pocket/default.aspx", c.bookmarks);
    bookmark("Pocket Queries Saved", "https://www.geocaching.com/pocket/default.aspx#DownloadablePQs", c.bookmarks);
    bookmark("Bookmarks", "https://www.geocaching.com/bookmarks/default.aspx", c.bookmarks);
    bookmark("Notifications", "https://www.geocaching.com/notify/default.aspx", c.bookmarks);
    profileSpecialBookmark("Find Player", defaultFindPlayerLink, "lnk_findplayer", c.bookmarks);
    bookmark("E-Mail", "https://www.geocaching.com/email/default.aspx", c.bookmarks);
    bookmark("Statbar", "https://www.geocaching.com/my/statbar.aspx", c.bookmarks);
    bookmark("Guidelines", "https://www.geocaching.com/about/guidelines.aspx", c.bookmarks);
    profileSpecialBookmark(c.scriptShortNameConfig, "https://www.geocaching.com/my/default.aspx#GClhShowConfig", "lnk_gclhconfig", c.bookmarks);
    externalBookmark("Forum Groundspeak", "http://forums.groundspeak.com/", c.bookmarks);
    externalBookmark("Blog Groundspeak", "https://www.geocaching.com/blog/", c.bookmarks);
    bookmark("Favorites", "https://www.geocaching.com/my/favorites.aspx", c.bookmarks);
    externalBookmark("Geoclub", "http://www.geoclub.de/", c.bookmarks);
    profileSpecialBookmark("Public Profile Geocaches", "https://www.geocaching.com/profile/default.aspx?#gclhpb#ctl00_ContentBody_ProfilePanel1_lnkUserStats", "lnk_profilegeocaches", c.bookmarks);
    profileSpecialBookmark("Public Profile Trackables", "https://www.geocaching.com/profile/default.aspx?#gclhpb#ctl00_ContentBody_ProfilePanel1_lnkCollectibles", "lnk_profiletrackables", c.bookmarks);
    profileSpecialBookmark("Public Profile Gallery", "https://www.geocaching.com/profile/default.aspx?#gclhpb#ctl00_ContentBody_ProfilePanel1_lnkGallery", "lnk_profilegallery", c.bookmarks);
    profileSpecialBookmark("Public Profile Lists", "https://www.geocaching.com/profile/default.aspx?#gclhpb#ctl00_ContentBody_ProfilePanel1_lnkLists", "lnk_profilebookmarks", c.bookmarks);
    bookmark("Dashboard", "https://www.geocaching.com/my/", c.bookmarks);
    profileSpecialBookmark("Nearest List", "https://www.geocaching.com/seek/nearest.aspx?#gclhpb#errhomecoord", "lnk_nearestlist", c.bookmarks);
    profileSpecialBookmark("Nearest Map", "https://www.geocaching.com/seek/nearest.aspx?#gclhpb#errhomecoord", "lnk_nearestmap", c.bookmarks);
    profileSpecialBookmark("Nearest List (w/o Founds)", "https://www.geocaching.com/seek/nearest.aspx?#gclhpb#errhomecoord", "lnk_nearestlist_wo", c.bookmarks);
    profileSpecialBookmark("Own Trackables", "https://www.geocaching.com/track/search.aspx?#gclhpb#errowntrackables", "lnk_my_trackables", c.bookmarks);
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
    profileSpecialBookmark("Public Profile Souvenirs", "https://www.geocaching.com/profile/default.aspx?#gclhpb#ctl00_ContentBody_ProfilePanel1_lnkSouvenirs", "lnk_profilesouvenirs", c.bookmarks);
    bookmark("Statistics", "https://www.geocaching.com/my/statistics.aspx", c.bookmarks);
    bookmark("Drafts", "https://www.geocaching.com/my/fieldnotes.aspx", c.bookmarks);
    profileSpecialBookmark("Public Profile Statistics", "https://www.geocaching.com/profile/default.aspx?#gclhpb#ctl00_ContentBody_ProfilePanel1_lnkStatistics", "lnk_profilestatistics", c.bookmarks);
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
    bookmark("Map", "https://www.geocaching.com/map/", c.bookmarks);
    profileSpecialBookmark(scriptShortNameSync, defaultSyncLink, "lnk_gclhsync", c.bookmarks);
    externalBookmark("Forum Geoclub", "http://geoclub.de/forum/index.php", c.bookmarks);
    externalBookmark("Changelog GClh II", "https://github.com/2Abendsegler/GClh/blob/master/docu/changelog.md#readme", c.bookmarks);
    bookmark("Lists", "https://www.geocaching.com/my/lists.aspx", c.bookmarks);
    bookmark("Souvenirs", "https://www.geocaching.com/my/souvenirs.aspx", c.bookmarks);
    bookmark("Friend League", "https://www.geocaching.com/play/friendleague", c.bookmarks);
    bookmark("Trackables", "https://www.geocaching.com/track/", c.bookmarks);
    bookmark("GeoTours", "https://www.geocaching.com/play/geotours", c.bookmarks);
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
    c.global_imageGallery = false;
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
                    if (window.confirm(mess)) document.location.href = http + "://www.geocaching.com/account/settings/homelocation";
                    else document.location.href = document.location.href.replace("?#"+splitter[1]+"#"+splitter[2]+"#", "");
                // uid, own trackables in GClh übernehmen.
                } else if (postbackValue == "errowntrackables") {
                    var mess = "To use this link, GClh has to know the identification of \n"
                             + "your trackables. Do you want to go to your dashboard and \n"
                             + "let GClh save the identification (uid) automatically?\n\n"
                             + "GClh will save it automatically. You have nothing to do at the\n"
                             + "following page \"Dashboard\", except, to choose your link again.\n"
                             + "(But, please wait until page \"Dashboard\" is loading complete.)";
                    if (window.confirm(mess)) document.location.href = http + "://www.geocaching.com/my/default.aspx";
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
    if (settings_faster_profile_trackables && is_page("publicProfile") && $('#ctl00_ContentBody_ProfilePanel1_lnkCollectibles')[0] && $('#ctl00_ContentBody_ProfilePanel1_lnkCollectibles')[0].className == "Active") {
        try {
            window.stop();
            $('table.Table').find('tbody tr td a img').each(function() {this.src = "/images/icons/16/watch.png"; this.title = ""; this.style.paddingLeft = "15px";});
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
            // Log abschicken new log page.
            if (document.location.href.match(/\.com\/play\/geocache\/gc\w+\/log/)) {
                function checkNewLogPage(waitCount) {
                    if ($('.btn-submit')[0] && $('.btn-submit')[0].children[0]) {
                        $('.btn-submit')[0].children[0].innerHTML += " (F2)";
                        window.addEventListener('keydown', keydownF2_2, true);
                    } else {waitCount++; if (waitCount <= 20) setTimeout(function(){checkNewLogPage(waitCount);}, 100);}
                }
                checkNewLogPage(0);
                function keydownF2_2(e) {
                    if (e.keyCode == 113 && noSpecialKey(e) && !check_config_page()) $('.btn-submit')[0].children[0].click();
                }
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
                ".#sm {z-index: 1001;}" +
                // Schriftfarbe Untermenü.
                ".#sm li a, .#sm li a:link, .#sm li a:visited, .#sm li {color: #" + font_color_submenu + " !important;}" +
                // Schriftgröße Menü.
                ".#m {font-size: 16px !important;}" +
                ".#m li, .#m li a, .#m li input {font-size: " + font_size_menu + "px !important;}" +
                // Abstände Menü.
                "ul.#m > li {margin-left: " + distance_menu + "px !important; margin-right: " + distance_menu + "px !important;} ul.#m li a {padding: .25em .25em .25em 0 !important;}" +
                // Schriftgröße Untermenü.
                "ul.#sm, ul.#sm li {font-size: 16px !important;}" +
                "ul.#sm li a {font-size: " + font_size_submenu + "px !important;}" +
                "ul.#sm li a {font-size: " + font_size_submenu + "px !important;}" +
                // Abstände Untermenü.
                "ul.#sm li a {margin: " + (distance_submenu / 2) + "px 1em !important; padding: 0 0.5em !important;} .#sm a {line-height: unset;} .#m a {overflow: initial}" +
                // Menühöhe.
                ".#m {height: 35px !important;}" +
                // Verschieben Submenüs unterbinden.
                ".#sm {margin-left: 0 !important}";
            // Vertikales Menü ausrichten.
            if (settings_bookmarks_top_menu) {
                // Menüzeilenhöhe.
                css += "ul.#m {line-height: 16px;}";
                // Zwischen Menüname und Submenü keine Lücke lassen, sonst klappts nicht mit einfachem Aufklappen.
                css += ".#m li a, .#m li a:link, .#m li a:visited {margin-bottom: 10px;} ul.#sm {margin-top: -6px;}";
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
                    css += "ul.#sm {margin-top: 0px; margin-left: 32px !important;} .submenu::after {left: 4px; width: 26px;}";
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
                    css += "ul.#sm {margin-top: 15px; margin-left: 32px !important;} .submenu::after {left: 4px; width: 26px;}";
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
                gc_link.setAttribute("href", http + "://www.geocaching.com");
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
                else if (document.location.href.match(/\.com\/my\/statistics\.aspx/) ||
                         (is_page("publicProfile") && $('#ctl00_ContentBody_ProfilePanel1_lnkStatistics')[0] && $('#ctl00_ContentBody_ProfilePanel1_lnkStatistics')[0].className == "Active")) {
                    css += ".span-9 {width: " + ((new_width - 280) / 2) + "px !important; margin-right: 30px;} .last {margin-right: 0px;}";
                    css += ".StatsTable {width: " + (new_width - 250) + "px !important;}";
                } else if (is_page("publicProfile")) {
                    if ($('#ctl00_ContentBody_ProfilePanel1_lnkCollectibles')[0] && $('#ctl00_ContentBody_ProfilePanel1_lnkCollectibles')[0].className == "Active") {
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
        if (settings_bookmarks_on_top && (document.getElementsByClassName("Menu").length > 0 || document.getElementsByClassName("menu").length > 0)){
            if (document.getElementsByClassName("Menu").length > 0) var nav_list = document.getElementsByClassName("Menu")[0];
            else var nav_list = document.getElementsByClassName("menu")[0];
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
                code += "  else if(search.match(/^[A-Z0-9]{6}\\b$/i)) document.location.href = 'https://www.geocaching.com/track/details.aspx?tracker='+search;";
                code += "  else document.location.href = 'https://www.geocaching.com/seek/nearest.aspx?navi_search='+search;";
                code += "}";
                var script = document.createElement("script");
                script.innerHTML = code;
                document.getElementsByTagName("body")[0].appendChild(script);
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

// Disabled and archived ...
    if (is_page("cache_listing")) {
        try {
            // Rename the link to image gallery.
            if ($('#ctl00_ContentBody_uxGalleryImagesLink')[0]) $('#ctl00_ContentBody_uxGalleryImagesLink')[0].innerHTML = $('#ctl00_ContentBody_uxGalleryImagesLink')[0].innerHTML.replace("View the ", "");
            // Archived in red.
            if ($('#ctl00_ContentBody_archivedMessage')[0] && $('#ctl00_ContentBody_CacheName')[0]) $('#ctl00_ContentBody_CacheName')[0].style.color = '#8C0B0B';
            // Archived, disabled strike through.
            if (settings_strike_archived && $('#ctl00_ContentBody_CacheName')[0] && ($('#ctl00_ContentBody_archivedMessage')[0] || $('#ctl00_ContentBody_disabledMessage')[0])) {
                $('#ctl00_ContentBody_CacheName')[0].style.textDecoration = 'line-through';
            }
            // Link more verbessern.
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
    if (settings_show_eventday && is_page("cache_listing") && $('#cacheDetails')[0] && $('#cacheDetails').find('img')[0] && $('#cacheDetails').find('img')[0].src.match(/.*\/images\/WptTypes\/(6|453|13|7005).gif/)) {  // Event, MegaEvent, Cito, GigaEvent
        if (document.getElementById('cacheDetails').getElementsByTagName("span")) {
            try {
                var spanelem = document.getElementById("ctl00_ContentBody_mcd2");
                var datetxt = spanelem.innerHTML.substr(spanelem.innerHTML.indexOf(":") + 2).replace(/^\s+|\s+$/g, '');
                var month_names = new Object();
                month_names["Jan"] = 1; month_names["Feb"] = 2; month_names["Mrz"] = 3; month_names["Mar"] = 3; month_names["Apr"] = 4; month_names["May"] = 5; month_names["Jun"] = 6; month_names["Jul"] = 7; month_names["Aug"] = 8; month_names["Sep"] = 9; month_names["Oct"] = 10; month_names["Nov"] = 11; month_names["Dec"] = 12;
                var day = 0; var month = 0; var year = 0;
                switch (settings_date_format) {
                    case "yyyy-MM-dd":
                        var match = datetxt.match(/([0-9]{4})-([0-9]{2})-([0-9]{2})/);
                        if (match) {day = match[3]; month = match[2]; year = match[1];}
                        break;
                    case "yyyy/MM/dd":
                        var match = datetxt.match(/([0-9]{4})\/([0-9]{2})\/([0-9]{2})/);
                        if (match) {day = match[3]; month = match[2]; year = match[1];}
                        break;
                    case "MM/dd/yyyy":
                        var match = datetxt.match(/([0-9]{2})\/([0-9]{2})\/([0-9]{4})/);
                        if (match) {day = match[2]; month = match[1]; year = match[3];}
                        break;
                    case "dd/MM/yyyy":
                        var match = datetxt.match(/([0-9]{2})\/([0-9]{2})\/([0-9]{4})/);
                        if (match) {day = match[1]; month = match[2]; year = match[3];}
                        break;
                    case "dd.MM.yyyy":
                        var match = datetxt.match(/([0-9]{1,2})\.([0-9]{1,2})\.([0-9]{4})/);
                        if (match) {day = match[1]; month = match[2]; year = match[3];}
                        break;
                    case "dd/MMM/yyyy":
                        var match = datetxt.match(/([0-9]{2})\/([A-Za-z]{3})\/([0-9]{4})/);
                        if (match) {day = match[1]; month = month_names[match[2]]; year = match[3];}
                        break;
                    case "MMM/dd/yyyy":
                        var match = datetxt.match(/([A-Za-z]{3})\/([0-9]{2})\/([0-9]{4})/);
                        if (match) {day = match[2]; month = month_names[match[1]]; year = match[3];}
                        break;
                    case "dd MMM yy":
                        var match = datetxt.match(/([0-9]{2}) ([A-Za-z]{3}) ([0-9]{2})/);
                        if (match) {day = match[1]; month = month_names[match[2]]; year = parseInt(match[3]) + 2000;}
                        break;
                }
                if (month != 0) month--;
                var d = new Date(year, month, day);
                if (d != "Invalid Date" && !(day == 0 && month == 0 && year == 0)) {
                    var weekday = new Array(7);
                    weekday[0] = "Sunday"; weekday[1] = "Monday"; weekday[2] = "Tuesday"; weekday[3] = "Wednesday"; weekday[4] = "Thursday"; weekday[5] = "Friday"; weekday[6] = "Saturday";
                    var text = " (" + weekday[d.getDay()] + ") ";
                } else var text = " (date format mismatch - see settings) ";
                var text_elem = document.createTextNode(text);
                spanelem.insertBefore(text_elem, spanelem.childNodes[1]);
            } catch(e) {gclh_error("Show eventday beside date:",e);}
        }
    }

// Show real owner.
    if (is_page("cache_listing") && $('#ctl00_ContentBody_mcd1')) {
        try {
            var real_owner = get_real_owner();
            var owner_link = false;
            var links = $('#ctl00_ContentBody_mcd1').find('a');
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
                        lateLog['user'] = $(logs[i]).find('.logOwnerProfileName').find('a[href*="/profile/?guid="]').text();
                        lateLog['id'] = $(logs[i]).find('.logOwnerProfileName').find('a[href*="/profile/?guid="]').attr('id');
                        lateLog['src'] = $(logs[i]).find('.LogType').find('img[src*="/images/logtypes/"]').attr('src');
                        lateLog['type'] = $(logs[i]).find('.LogType').find('img[src*="/images/logtypes/"]').attr('title');
                        lateLog['date'] = $(logs[i]).find('.LogDate').text();
                        if (gcLogs) lateLog['log'] = $(logs[i]).find('.LogText').children().clone();
                        else lateLog['log'] = $(logs[i]).find('.LogContent').children().clone();
                        lateLogs[i] = lateLog;
                    }
                    if (lateLogs.length > 0 && document.getElementById("ctl00_ContentBody_mcd1").parentNode) {
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
                            log_text.innerHTML = "<img src='" + lateLogs[i]['src'] + "'> <b>" + lateLogs[i]['user'] + " - " + lateLogs[i]['date'] + "</b><br/>";
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
                    // Box mit Schleifchen, Anzahl Favoriten, Text "Favorites", Drop-Down-Pfeil.
                    var fav = $('.favorite-container')[0];
                    if (fav) {
                        // Prozentzahl, Text.
                        var score = $('.favorite-score')[0].innerHTML.match(/(.*%)\.*/);
                        if (score && score[1]) {
                            // Eigener Favoritenpunkt. Class hideMe -> kein Favoritenpunkt. Keine class hideMe -> Favoritenpunkt.
                            var myfav = $('#pnlFavoriteCache')[0];
                            var myfavHTML = "";
                            if (myfav) {
                                if (myfav.className.match("hideMe")) myfavHTML = '&nbsp;<img src="' + http + '://www.geocaching.com/images/icons/reg_user.gif" />';
                                else myfavHTML = '&nbsp;<img src="' + http + '://www.geocaching.com/images/icons/prem_user.gif" />';
                            }
                            // Favoritenbox ändern.
                            fav.getElementsByTagName("span")[0].nextSibling.remove();  // Text Favoriten
                            fav.innerHTML += score[1] + myfavHTML;
                            // Dropdown anpassen.
                            if ($('.favorite-dropdown')[0]) {
                                var dd = $('.favorite-dropdown')[0];
                                dd.style.borderTop = "1px solid #f0edeb";
                                dd.style.borderTopLeftRadius = "5px";
                                dd.style.minWidth = "190px";
                            }
                        }
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

// Show other coord formats in listing.
    if (is_page("cache_listing") && document.getElementById('uxLatLon')) {
        try {
            var box = document.getElementById('ctl00_ContentBody_LocationSubPanel');
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
        } catch(e) {gclh_error("Show other coord formats in listing",e);}
    }

// Show other coord formats on print page.
    if (document.location.href.match(/\.com\/seek\/cdpf\.aspx/)) {
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
        } catch(e) {gclh_error("Show other coord formats on print page:",e);}
    }

// Button Map this Location at cache listing.
    if (is_page("cache_listing") && $('#uxLatLon')[0]) {
        try {
            var coords = toDec($('#uxLatLon')[0].innerHTML);
            var link;
            if (document.getElementById("uxLatLonLink") != null) link = $('#uxLatLonLink')[0].parentNode;
            else link = $('#uxLatLon')[0].parentNode;
            var a = document.createElement("a");
            var small = document.createElement("small");
            a.setAttribute("href", map_url + "?ll=" + coords[0] + "," + coords[1]);
            a.appendChild(document.createTextNode("Map this Location"));
            small.appendChild(document.createTextNode(" - "));
            small.appendChild(a);
            link.appendChild(small);
        } catch(e) {gclh_error("Button Map this Location at cache listing:",e);}
    }

// Stop ignoring.
    if (is_page("cache_listing") && settings_show_remove_ignoring_link) {
        // Bookmark Listen Bereiche.
        if (document.getElementsByClassName("BookmarkList").length > 0) {
            try {
                var listenBereiche = document.getElementsByClassName("BookmarkList");
                for (var i = 0; i < listenBereiche.length; i++) {
                    // Bookmark Listen, in denen der Cache gelistet ist.
                    var listen = listenBereiche[i].getElementsByTagName("a");
                    for (var j = 0; (j+1) < listen.length; j++) {
                        // Ignore Bookmark Liste des Users. (Heißt auch in anderen Sprachen so.)
                        if ((listen[j].href.match(/geocaching\.com\/bookmarks\/view\.aspx\?guid=/)) &&
                             (listen[j].text == "Ignore List") &&
                             (listen[j+1].href.match(/geocaching\.com\/profile\/\?guid=/)) &&
                             (listen[j+1].text == global_me)) {
                            // Navigations Details links "Watch", Ignore" ... .
                            var cdnLinksBereich = document.getElementsByClassName("CacheDetailNavigation NoPrint");
                            for (var k = 0; k < cdnLinksBereich.length; k++) {
                                // Liste der Links "Watch", Ignore" ... .
                                var cdnLinks = cdnLinksBereich[k].getElementsByTagName("a");
                                for (var m = 0; m < cdnLinks.length; m++) {
                                    // Bei "Ignore" Link Linkbezeichnung in Stop Ignoring ändern und Icon ersetzen.
                                    if (cdnLinks[m].href.match(/\/bookmarks\/ignore\.aspx\?guid/)) {
                                        cdnLinks[m].innerHTML = "Stop Ignoring";
                                        var css = '.CacheDetailNavigation a[href*="ignore.aspx"]{background-image: url(' + global_stop_ignore_icon + ');}';
                                        appendCssStyle(css);
                                    }
                                }
                            }
                        }
                    }
                }
            } catch(e) {gclh_error("Stop ignoring:",e);}
        }
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

// Add link to waypoint list and cache logs in cache detail navigation (sidebar).
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

// Show button, which open Flopp's Map with all waypoints of a cache and open Flopp's Map.
    if (settings_show_flopps_link && is_page("cache_listing") || document.location.href.match(/\.com\/hide\/wptlist.aspx/)) {
        try {
            // Append Flopps map link to the right, top navigation.
            var linklist_for_flopps = $('.CacheDetailNavigation ul').first();
            linklist_for_flopps.append('<li><div class="GClhdropdown"><a id="ShowWaypointsOnFloppsMap_linklist" class="GClhdropbtn">Show on Flopp\'s Map</a><div id="FloppsMapLayers_linklist" class="GClhdropdown-content"></div></div></li>');
            buildFloppsMapLayers("FloppsMapLayers_linklist", "ShowWaypointsOnFloppsMap_linklist");
            // Append Flopps map link under waypoints.
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
        } catch(e) {gclh_error("Show button Flopp's Map and open Flopp's Map:",e);}
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
    // Convert string to the Flopp's Map specification.
    function floppsMapWaypoint(waypoint, id, radius, name) {
        name = name.replace(/[^a-zA-Z0-9_\-]/g,'_');  // A–Z, a–z, 0–9, - und _
        return id+':'+waypoint.latitude+':'+waypoint.longitude+':'+radius+':'+name;
    }
    // Creates from a list of waypoints an permanent link to Flopps Map.
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

// Show button, which open BRouter with all waypoints of a cache and open BRouter.
    if (settings_show_brouter_link && is_page("cache_listing") || document.location.href.match(/\.com\/hide\/wptlist.aspx/)) {
        try {
            // Append BRouter map link to the right, top navigation.
            var linklist_for_brouter = $('.CacheDetailNavigation ul').first();
            linklist_for_brouter.append('<li><div class="GClhdropdown"><a id="ShowWaypointsOnBRouter_linklist" class="GClhdropbtn">Show Route on BRouter</a><div id="BRouterMapLayers_linklist" class="GClhdropdown-content"></div></div></li>');
            buildBRouterMapLayers("BRouterMapLayers_linklist", "ShowWaypointsOnBRouter_linklist");
            // Append BRouter map link under waypoints.
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
    // Convert string to the BRouter specification.
    function brouterMapWaypoint(waypoint) {return waypoint.longitude+','+waypoint.latitude;}
    // Build BRouter Link.
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

// CSS for BRouter and Flopp's Map Buttons.
    if (settings_show_flopps_link || settings_show_brouter_link) {
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
                if ($('#ctl00_ContentBody_ProfilePanel1_lnkEmailUser')[0] || $('#ctl00_ProfileHead_ProfileHeader_lnkSendEmailByWesite')[0]) {
                    var guid = ($('#ctl00_ContentBody_ProfilePanel1_lnkEmailUser')[0] || $('#ctl00_ProfileHead_ProfileHeader_lnkSendEmailByWesite')[0]).href.match(/https?:\/\/www\.geocaching\.com\/email\/\?guid=(.*)/);
                    guid = guid[1];
                    if ($('#ctl00_ContentBody_ProfilePanel1_lblMemberName')[0] || $('#ctl00_ProfileHead_ProfileHeader_lblMemberName')[0]) {
                        var username = decode_innerHTML($('#ctl00_ContentBody_ProfilePanel1_lblMemberName')[0] || $('#ctl00_ProfileHead_ProfileHeader_lblMemberName')[0]);
                        var side = ($('#ctl00_ContentBody_ProfilePanel1_lblMemberName')[0] || $('#ctl00_ProfileHead_ProfileHeader_lblStatusText')[0]);
                    }
                    buildSendIcons(side, username, "per guid");
                }
            // Post Cache new log page:
            } else if (document.location.href.match(/\.com\/play\/geocache\/gc\w+\/log/)) {
                if ($('.muted')[0] && $('.muted')[0].children[1]) {
                    var id = $('.muted')[0].children[1].href.match(/^https?:\/\/www\.geocaching\.com\/profile\/\?id=(\d+)/);
                    if (id && id[1]) {
                        var idLink = "https://www.geocaching.com/p/default.aspx?id=" + id[1] + "&tab=geocaches";
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
            if (typeof unsafeWindow.$.fancybox != "undefined") unsafeWindow.$('a[rel="lightbox"]').fancybox();
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
            link.setAttribute("title", "Show area at Google Maps");
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
            if ($('a[href*="glossary.aspx#spoiler"]')[0]) {
                var sp = $('a[href*="glossary.aspx#spoiler"]')[0].closest('p');
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
            function addElevationToWaypoints(responseDetails) {
                try {
                    json = JSON.parse(responseDetails.responseText);
                    if (json.status != "OK") {
                        if (counter >= 10 || json.status == "INVALID_REQUEST") {
                            var mess = "\naddElevationToWaypoints():\n- Get elevations counter: "+counter+"\n- json-status: "+json.status+"\n- json.error_message: "+json.error_message;
                            gclh_log(mess);
                        } else {
                            counter++;
                            getElevations(counter);
                        }
                        return;
                    }
                    var tbl = getWaypointTable();
                    if (tbl.length > 0) {
                        var length = tbl.find("tbody > tr").length;
                        for (var i=0; i<length/2; i++) {
                            var heightString = "";
                            var title = "Elevation not available!";
                            var json = JSON.parse(responseDetails.responseText);
                            if (typeof json.results[i].elevation !== "number") {
                                heightString = "n/a";
                                title = "Elevation not available - no answer";
                            } else {
                                heightString = formatElevation(json.results[i].elevation);
                                title = "Elevation";
                                if (json.results[i].location.lat == -90) {
                                    heightString = "???";  // For waypoints with hidden coordinates.
                                    title = "Elevation not available - unknown location";
                                }
                            }
                            tbl.find("tbody > tr:eq("+(i*2)+") > td:eq(6)").html('<span title="'+title+'">'+heightString+'</span>');
                        }
                    }
                    var index = json.results.length-1;
                    if ($("#uxLatLonLinkElevation").length > 0) {
                        if (index >= 0) $("#uxLatLonLinkElevation").html(formatElevation(json.results[index].elevation));
                        else gclh_log("addElevationToWaypoints(): Error: index out of range");
                    }
                } catch(e) {gclh_error("addElevationToWaypoints():",e);}
            }
            var locations="";
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
                    if (typeof tmp_coords[0] !== 'undefined' && typeof tmp_coords[1] !== 'undefined') {
                        locations += (locations.length == 0 ? "" : "|") + tmp_coords[0]+","+tmp_coords[1];
                    } else {
                        locations += (locations.length == 0 ? "" : "|") + "-90.0,-180.0";  // For waypoints without visible coordinates.
                    }
                    row1st.find("td:eq(5)").after('<td>???</td>');
                }
            }
            var waypoint = getListingCoordinates(false);
            if (waypoint !== undefined) {
                $("#uxLatLonLink").after('<span title="Elevation">&nbsp;&nbsp;&nbsp;Elevation:&nbsp;<span id="uxLatLonLinkElevation">???</span></span>');
                locations += (locations.length == 0 ? "" : "|") + waypoint.latitude+","+waypoint.longitude;
            }
            function getElevations(counter) {
                if (counter > 10) return;
                else if (counter == 0) var wait = 0;
                else var wait = 250;
                setTimeout(function() {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: "https://maps.googleapis.com/maps/api/elevation/json?sensor=false&locations=" + locations,
                        onload: addElevationToWaypoints,
                        onerror: function() {gclh_log("Elevation: ERROR: request elevation for waypoints failed!");}
                    });
                }, wait);
            }
            var counter = 0;
            getElevations(counter);
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

// Autovisit new log page.
    if (settings_autovisit && document.location.href.match(/\.com\/play\/geocache\/gc\w+\/log/)) {
        try {
            checkTbList(0);
            function checkTbList(waitCount) {
                var tbs = getTbs();
                if (tbs.length > 0) {
                    for (var i = 0; i < tbs.length; i++) {
                        var [tbC, tbN] = getTb(tbs[i]);
                        if (!tbC || !tbN) continue;
                        var auto = document.createElement("div");
                        auto.className = "radio-toggle-group gclh_auto";
                        auto.addEventListener("click", setAuto, false);
                        var c = "<label><input name='gclh_"+tbN+"' type='radio'><span class='label'>No action</span></label>";
                        auto.innerHTML = c + c.replace("No action","AutoVisit");
                        tbs[i].appendChild(auto);
                    }
                    $('.selectric-input')[0].addEventListener('blur', buildAutos, false);
                    buildAutos(true);
                    appendCssStyle(".radio-toggle-group {margin-top: -24px;} .gclh_auto {margin-top: -29px; float: right;}");
                } else {waitCount++; if (waitCount <= 100) setTimeout(function(){checkTbList(waitCount);}, 100);}
            }
            function buildAutos(start) {
                var type = getType();
                var tbs = getTbs();
                for (var i = 0; i < tbs.length; i++) {
                    var [tbC, tbN] = getTb(tbs[i]);
                    setAuto(tbC, tbN, type, start, true);
                }
            }
            function setAuto(tbC, tbN, type, start, allTbs) {
                if (!type) var type = getType();
                if (!tbC || !tbN) var [tbC, tbN] = getTb(this.parentNode);
                var actions = document.getElementsByName("actions-"+tbN);
                var autos = document.getElementsByName("gclh_"+tbN);
                if (!type || !tbC || !tbN || actions.length < 2 || autos.length != 2) return;
                if (start) {
                    if (getValue("autovisit_"+tbC, false)) autos[1].checked = true;
                    else autos[0].checked = true;
                }
                if (!actions[2] || actions[2].checked != true) {
                    if (autos[1].checked == true) {
                        if (type == 2 || type == 10 || type == 11) actions[1].checked = "true";
                        else actions[0].checked = "true";
                    } else {
                        if (allTbs != true && (type == 2 || type == 10 || type == 11)) actions[0].checked = "true";
                    }
                }
                setValue("autovisit_"+tbC, (autos[0].checked ? false:true));
            }
            function getType() {
                var type = $('.selectric .icon')[0].innerHTML.match(/svg#icon-(\d+?)">/);
                if (type || type[1]) return type[1];
            }
            function getTbs() {return $('ul.trackables-list li .details').closest('li');}
            function getTb(tb) {return [$(tb).find('.details .stats')[0].lastElementChild.innerHTML, $(tb).find('.actions input')[0].name.replace("actions-","")];}
        } catch(e) {gclh_error("Autovisit New:",e);}
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
                    (document.location.href.match(/log\?d\=/) && document.getElementById('LogText').value != "")) {  // Draft
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

// Hide socialshare.
    if (settings_hide_socialshare && document.location.href.match(/\.com\/seek\/log\.aspx?(.*)/)) {
        try {
            if ($('#sharing_container')[0]) $('#sharing_container')[0].style.display = "none";
            if ($('#uxSocialSharing')[0]) $('#uxSocialSharing')[0].style.display = "none";
        } catch(e) {gclh_error("Hide socialshare1:",e);}
    }
    if (settings_hide_socialshare && document.location.href.match(/\.com\/play\/friendleague/)) {
        try {
            if ($('.btn-facebook-share')[0]) {
                $('.btn-facebook-share')[0].parentNode.style.display = "none";
                $('.btn-facebook-share')[0].parentNode.previousElementSibling.style.display = "none";
                if ($('.btn-primary')[0]) $('.btn-primary')[0].parentNode.style.marginBottom = "0";
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
    if (settings_show_mail && document.location.href.match(/\.com\/email\//) && document.getElementById("ctl00_ContentBody_SendMessagePanel1_tbMessage")) {
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
        } catch(e) {gclh_error("Improve Mail:",e);}
    }

// Improve Message.
    if (settings_show_message && is_page("messagecenter") && document.location.href.match(/&text=(.*)/)) {
        try {
            var val = "";
            var matches = document.location.href.match(/&text=(.*)/);
            if (matches && matches[1]) {
                var val = decodeURIComponent(matches[1]);
                updateMessage(0);
            }
            function updateMessage(waitCount) {
                if (document.getElementsByTagName("textarea")[0] && document.getElementsByTagName("textarea")[0].value == "") {
                    document.getElementsByTagName("textarea")[0].value = val;
                }
                waitCount++;
                if (waitCount <= 100) setTimeout(function(){updateMessage(waitCount);}, 100);
            }
        } catch(e) {gclh_error("Improve Message:",e);}
    }

// Improve list of pocket queries (list of PQs).
    if (document.location.href.match(/\.com\/pocket/) && document.getElementById("uxCreateNewPQ") && $('table.Table')[0]) {
        try {
            // Compact layout.
            if (settings_compact_layout_list_of_pqs) {
                function lastGen(elem) {
                    elem.title = trim(elem.innerHTML);
                    elem.innerHTML = "Last Generated";
                    elem.style.whiteSpace = "nowrap";
                }
                var css = "";
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
                appendCssStyle(css);
            }
            // Refresh button.
            var refreshButton = document.createElement("p");
            refreshButton.innerHTML = "<a href='" + http + "://www.geocaching.com/pocket/default.aspx' title='Refresh Page'>Refresh Page</a>";
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
                    links[i].parentNode.innerHTML = links[i].parentNode.innerHTML.replace("<br>", "<a title='Log it' href='" + http + "://www.geocaching.com/seek/log.aspx?wp=" + match[1] + "'><img src='/images/stockholm/16x16/add_comment.gif'></a><br>");
                }
            }
        } catch(e) {gclh_error("Show Log It button:",e);}
    }

// Improve pocket queries, nearest lists, recently viewed. Compact layout.
    if ((settings_compact_layout_pqs && document.location.href.match(/\.com\/seek\/nearest\.aspx\?pq=/)) ||
        (settings_compact_layout_nearest && document.location.href.match(/\.com\/seek\/nearest\.aspx\?/) && !document.location.href.match(/aspx\?pq=/)) ||
        (settings_compact_layout_recviewed && document.location.href.match(/\.com\/my\/recentlyviewedcaches\.aspx/))) {
        try {
            var css = "";
            // Header:
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
            // Table:
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
            // Footer:
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
            appendCssStyle(css);
        } catch(e) {gclh_error("Improve PQs:",e);}
    }

// Pocket query mark elements, set default value for new one, set warning message.
    if (document.location.href.match(/\.com\/pocket\/gcquery\.aspx/)) {
        try {
            // Mark all elements for an easier access.
            var pqelements = [
                {index: 0, id: "gclhpq_QueryName", child: "#ctl00_ContentBody_tbName"},
                {index: 1, id: "gclhpq_DaysOfGenerate", child: "#ctl00_ContentBody_cbDays"},
                {index: 2, id: "gclhpq_CachesTotal", child: "#ctl00_ContentBody_tbResults"},
                {index: 3, id: "gclhpq_AnyType", child: "#ctl00_ContentBody_rbTypeAny"},
                {index: 4, id: "gclhpq_Types", child: "#ctl00_ContentBody_cbTaxonomy"},
                {index: 5, id: "gclhpq_AnyContainer", child: "#ctl00_ContentBody_rbContainerAny"},
                {index: 6, id: "gclhpq_Container", child: "#ctl00_ContentBody_rbContainerSelect"},
                {index: 7, id: "gclhpq_Options", child: "#ctl00_ContentBody_cbOptions"},
                {index: 8, id: "gclhpq_", child: ""},  // And
                {index: 9, id: "gclhpq_Difficulty", child: "#ctl00_ContentBody_cbDifficulty"},
                {index: 10, id: "gclhpq_Terrain", child: "#ctl00_ContentBody_cbTerrain"},
                {index: 11, id: "gclhpq_Within", child: "#ctl00_ContentBody_rbNone"},
                {index: 12, id: "gclhpq_Origin", child: "#ctl00_ContentBody_rbOriginNone"},
                {index: 13, id: "gclhpq_Radius", child: "#ctl00_ContentBody_tbRadius"},
                {index: 14, id: "gclhpq_PlacedDuring", child: "#ctl00_ContentBody_rbPlacedNone"},
                {index: 15, id: "gclhpq_AttributesIncludes", child: "#ctl00_ContentBody_ctlAttrInclude_dtlAttributeIcons"},
                {index: 16, id: "gclhpq_AttributesExcludes", child: "#ctl00_ContentBody_ctlAttrExclude_dtlAttributeIcons"},
                {index: 17, id: "gclhpq_Output", child: ".PQOutputList"},
                {index: 18, id: "gclhpq_SubmitDelete", child: "#ctl00_ContentBody_btnSubmit"},
            ];

            $("#ctl00_ContentBody_QueryPanel > *[class!='Validation']").each(function(index) {
                for (var i=0; i<pqelements.length; i++) {
                    if (pqelements[i].child.length > 0) {
                        if ($(this).find(pqelements[i].child).length > 0) {
                            $(this).attr('id',pqelements[i].id);
                            break;
                        }
                    }
                }
            });
            $("#gclhpq_Options").next().attr('id',"gclhpq_And");

            if (($("p.Success").length <= 0) && (document.location.href.match(/\.com\/pocket\/gcquery\.aspx$/) ||
                document.location.href.match(/\.com\/pocket\/gcquery\.aspx\/ll=/))) {
                if (settings_pq_set_cachestotal) {
                    $("#ctl00_ContentBody_tbResults").val(settings_pq_cachestotal);
                }
                if (settings_pq_option_ihaventfound) {
                    $("#ctl00_ContentBody_cbOptions_0").prop('checked', true);
                    $("#ctl00_ContentBody_cbOptions_1").prop('checked', false);  // avoid conflicts
                }
                if (settings_pq_option_idontown) {
                    $("#ctl00_ContentBody_cbOptions_2").prop('checked', true);
                    $("#ctl00_ContentBody_cbOptions_3").prop('checked', false);  // avoid conflicts
                }
                if (settings_pq_option_ignorelist) {
                    $("#ctl00_ContentBody_cbOptions_6").prop('checked', true);
                }
                if (settings_pq_option_isenabled) {
                    $("#ctl00_ContentBody_cbOptions_13").prop('checked', true);
                    $("#ctl00_ContentBody_cbOptions_12").prop('checked', false);  // avoid conflicts
                }
                if (settings_pq_option_filename) {
                    $("#ctl00_ContentBody_cbIncludePQNameInFileName").prop('checked', true);
                }
                if (settings_pq_set_difficulty) {
                    $("#ctl00_ContentBody_cbDifficulty").prop('checked', true);
                    $("#ctl00_ContentBody_ddDifficulty").val(settings_pq_difficulty);
                    $("#ctl00_ContentBody_ddDifficultyScore").val(settings_pq_difficulty_score);
                }
                if (settings_pq_set_terrain) {
                    $("#ctl00_ContentBody_cbTerrain").prop('checked', true);
                    $("#ctl00_ContentBody_ddTerrain").val(settings_pq_terrain);
                    $("#ctl00_ContentBody_ddTerrainScore").val(settings_pq_terrain_score);
                }
                if (settings_pq_automatically_day) {
                    var servertime = $("#gclhpq_DaysOfGenerate").find("legend").text();
                    if (servertime.match(/.*Sunday.*/))         $("#ctl00_ContentBody_cbDays_0").prop('checked', true);
                    else if (servertime.match(/.*Monday.*/))    $("#ctl00_ContentBody_cbDays_1").prop('checked', true);
                    else if (servertime.match(/.*Tuesday.*/))   $("#ctl00_ContentBody_cbDays_2").prop('checked', true);
                    else if (servertime.match(/.*Wednesday.*/)) $("#ctl00_ContentBody_cbDays_3").prop('checked', true);
                    else if (servertime.match(/.*Thursday.*/))  $("#ctl00_ContentBody_cbDays_4").prop('checked', true);
                    else if (servertime.match(/.*Friday.*/))    $("#ctl00_ContentBody_cbDays_5").prop('checked', true);
                    else if (servertime.match(/.*Saturday.*/))  $("#ctl00_ContentBody_cbDays_6").prop('checked', true);
                }
            }
            if (settings_pq_warning) {
                $("#ctl00_ContentBody_cbOptions").after("<div id='warning' style='display: none; border: 1px solid #dfdf80; background-color: #ffffa5; padding: 10px;'><div style='float: left'><img src='https://www.geocaching.com/play/Content/ui-icons/icons/global/attention.svg'></div><div>&nbsp;&nbsp;One or more options are in conflict and creates an empty result set. Please change your selection.</div></div>");
                for (var i=0; i<=13; i++) {
                    $("#ctl00_ContentBody_cbOptions_"+i).change(verifyPqOptions);
                }
                verifyPqOptions();
            }
        } catch(e) {gclh_error("Pocket query mark, set defaults, set warning:",e);}
    }
    // Marks two PQ options, which are in rejection.
    function markPqOptionsAreInRejection(idOption1, idOption2) {
        var status = false;
        if ($("#"+idOption1).is(':checked') && $("#"+idOption2).is(':checked')) {
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
    // Find PQ options, which are in rejection.
    function verifyPqOptions() {
        var status = false;
        status = status | markPqOptionsAreInRejection("ctl00_ContentBody_cbOptions_0", "ctl00_ContentBody_cbOptions_1");  // I haven't found / I have found
        status = status | markPqOptionsAreInRejection("ctl00_ContentBody_cbOptions_2", "ctl00_ContentBody_cbOptions_3");  // I don't vs. own I own
        status = status | markPqOptionsAreInRejection("ctl00_ContentBody_cbOptions_4", "ctl00_ContentBody_cbOptions_5");  // Are available to all users vs. Are for members only
        status = status | markPqOptionsAreInRejection("ctl00_ContentBody_cbOptions_8", "ctl00_ContentBody_cbOptions_9");  // Found in the last 7 days vs. Have not been found
        status = status | markPqOptionsAreInRejection("ctl00_ContentBody_cbOptions_12", "ctl00_ContentBody_cbOptions_13");  // Is Disabled vs. is Enabled
        if (status) $("#warning").show();
        else $("#warning").hide();
    }

// Map on create pocket query page.
    if (document.location.href.match(/\.com\/pocket\/gcquery\.aspx/)) {
        try {
            $('.LatLongTable').after('<img style="position:absolute;top: 8px; left: 300px;height:350px;width:470px;" id="gclh_map">').parent().css("style", "relative");
            $('.LatLongTable input, #gclhpq_Origin').change(function() {
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
    if (document.location.href.match(/\.com\/(bookmarks\/default|my\/lists)\.aspx/) && $('table.Table')[0]) {
        try {
            // Compact layout.
            if (settings_compact_layout_list_of_bm_lists) {
                var css = "";
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
                appendCssStyle(css);
            }
        } catch(e) {gclh_error("Improve list of bookmark lists:",e);}
    }

// Improve bookmark lists.
    if (document.location.href.match(/\.com\/bookmarks\/(view\.aspx\?guid=|bulk\.aspx\?listid=|view\.aspx\?code=)/) && document.getElementById('ctl00_ContentBody_ListInfo_cboItemsPerPage')) {
        try {
            // Prepare link corrected coords.
            if ($('#ctl00_ContentBody_btnAddBookmark')[0]) var corrCoords = '<input type="button" id="gclh_linkCorrCoords" href="javascript:void(0);" title="Mark Caches with Corrected Coordinates" value="Mark Caches with Corr. Coords">';
            // Prepare link "Download as kml".
            if (document.location.href.match(/guid=([a-zA-Z0-9-]*)/)) {
                var matches = document.location.href.match(/guid=([a-zA-Z0-9-]*)/);
                if (matches && matches[1]) {
                    var uuidx = matches[1];
                    var kml = "<a title=\"Download Google Earth kml\" href='" + http + "://www.geocaching.com/kml/bmkml.aspx?bmguid=" + uuidx + "' style='vertical-align: bottom;'>Download as kml</a>";
                }
            }
            // Compact layout.
            if (settings_compact_layout_bm_lists) {
                var css = "";
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
                    $('#ctl00_ContentBody_QuickAdd')[0].children[1].childNodes[1].remove();
                    $('#ctl00_ContentBody_QuickAdd')[0].children[1].childNodes[0].remove();
                    $('#ctl00_ContentBody_QuickAdd')[0].children[0].remove();
                }
                if ($('#ctl00_ContentBody_ListInfo_uxListOwner').length > 0) {
                    var LO = $('#ctl00_ContentBody_ListInfo_uxListOwner')[0].parentNode;
                    if (LO.nextElementSibling.nextElementSibling.innerHTML == "") LO.nextElementSibling.nextElementSibling.remove();
                    else LO.nextElementSibling.nextElementSibling.style.marginBottom = "0";
                    if (LO.nextElementSibling.innerHTML == "") LO.nextElementSibling.remove();
                    else LO.nextElementSibling.style.marginBottom = "0";
                    LO.style.marginBottom = "0";
                    LO.innerHTML += "<span style='float: right; padding-right: 195px; margin-top: -7px;'>" + (uuidx ? kml : "") + (corrCoords ? "&nbsp;&nbsp;"+corrCoords : "") + "</span>";
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
                if ($('#ctl00_ContentBody_uxAboutPanel')) $('#ctl00_ContentBody_uxAboutPanel')[0].remove();
                appendCssStyle(css);
            // No compact layout, only build links.
            } else {
                $('#ctl00_ContentBody_lbHeading')[0].parentNode.parentNode.parentNode.childNodes[3].innerHTML += (uuidx ? "<br>"+kml : "") + (corrCoords ? "<br>"+corrCoords : "");
            }
            // Event, css corrected coords.
            if ($('#gclh_linkCorrCoords')[0]) $('#gclh_linkCorrCoords')[0].addEventListener("click", markCorrCoordForBm, false);
            appendCssStyle('.cc_cell {text-align: center !important} .working {opacity: 0.3; cursor: default;}');
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

// Add buttons to bookmark lists and watchlist to select caches.
    var current_page;
    if (document.location.href.match(/\.com\/bookmarks/) &&
        !document.location.href.match(/\.com\/bookmarks\/default/)) current_page = "bookmark";
    else if (document.location.href.match(/\.com\/my\/watchlist\.aspx/)) current_page = "watch";
    if (!!current_page) {
        try {
            var checkbox_selector = 'input[type=checkbox]';
            var table = $('table.Table').first();
            var rows = table.find('tbody tr');
            var checkboxes = table.find(checkbox_selector);
            if (table.length > 0 && rows.length > 0 && checkboxes.length > 0) {
                // Add section to table.
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
                // Standard Checkbox zur Selektion aller Caches ausblenden.
                if (document.getElementById('ctl00_ContentBody_WatchListControl1_uxWatchList_ctl00_uxChkAll')) {
                    document.getElementById('ctl00_ContentBody_WatchListControl1_uxWatchList_ctl00_uxChkAll').style.display = "none";
                }
            }
        } catch(e) {gclh_error("Add buttons to bookmark list and watchlist:",e);}
    }
    // Funktionen für die Ermittlung und Ausgabe der Anzahl Caches und der Anzahl der selektierten Caches in Bookmark Listen, Watchlist ...
    // Summenfelder für Anzahl Caches definieren und Configparameter setzen.
    function sumsCreateFields(configParameter) {
        var sums = new Object();
        sums["All"] = sums["chAll"] = sums["Found"] = sums["chFound"] = sums["Archived"] = sums["chArchived"] = sums["Deactivated"] = sums["chDeactivated"] = 0;
        sums["configParameter"] = configParameter;
      return sums;
    }
    // Anzahl Caches ermitteln.
    function sumsCountAll() {
        if (sums["configParameter"] == false) return;
        sums["All"] = table.find('tbody tr').find(checkbox_selector).length;
        sums["Found"] = table.find('tbody tr').find('img[src*="found"]').length;
        sums["Archived"] = table.find('tbody tr').find('span.Strike.OldWarning,span.Strike.Warning').length;
        sums["Deactivated"] = table.find('tbody tr').find('span.Strike:not(.OldWarning,.Warning)').length;
    }
    // Events für die Checkboxen setzen.
    function sumsSetEventsForCheckboxes(checkboxes) {
        if (sums["configParameter"] == false) return;
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].addEventListener("click", function() {sumsCountChecked_Click(this);} , false);
        }
    }
    // Platzhalter für die Anzahl Caches aufbauen.
    function sumsOutputFields(side, kind) {
        if (sums["configParameter"] == false) return;
        var out = document.createElement('span');
        out.setAttribute("style", "font-size: 85%; font-style: italic; margin-left: -6px; margin-right: 10px;");
        out.setAttribute("id", "sums_caches_" + kind);
        out.appendChild(document.createTextNode(""));
        side.append(out);
    }
    // Werte für die Anzahl Caches ändern.
    function sumsChangeAllFields() {
        if (sums["configParameter"] == false) return;
        sumsChangeFields("All", sums["chAll"], sums["All"]);
        sumsChangeFields("Found", sums["chFound"], sums["Found"]);
        sumsChangeFields("Archived", sums["chArchived"], sums["Archived"]);
        sumsChangeFields("Deactivated", sums["chDeactivated"], sums["Deactivated"]);
    }
    // Werte für die Anzahl Caches ändern.
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
    // Anzahl markierte Caches für Selektion All ermitteln und setzen.
    function sumsCountChecked_SelectionAll() {
        if (sums["configParameter"] == false) return;
        sums["chAll"] = sums["All"];
        sums["chFound"] = sums["Found"];
        sums["chArchived"] = sums["Archived"];
        sums["chDeactivated"] = sums["Deactivated"];
        sumsChangeAllFields();
    }
    // Anzahl markierte Caches für Selektion None ermitteln und setzen.
    function sumsCountChecked_SelectionNone() {
        if (sums["configParameter"] == false) return;
        sums["chAll"] = sums["chFound"] = sums["chArchived"] = sums["chDeactivated"] = 0;
        sumsChangeAllFields();
    }
    // Anzahl markierte Caches für Selektion Invert ermitteln und setzen.
    function sumsCountChecked_SelectionInvert() {
        if (sums["configParameter"] == false) return;
        sums["chAll"] = sums["All"] - sums["chAll"];
        sums["chFound"] = sums["Found"] - sums["chFound"];
        sums["chArchived"] = sums["Archived"] - sums["chArchived"];
        sums["chDeactivated"] = sums["Deactivated"] - sums["chDeactivated"];
        sumsChangeAllFields();
    }
    // Anzahl markierte Caches für Click auf Checkbox ermitteln.
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
    // Anzahl markierter Caches für alles ermitteln.
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

// Improve drafts.
    if (document.location.href.match(/\.com\/my\/fieldnotes\.aspx/)) {
        try {
            function gclh_select_all() {
                var state = document.getElementById("gclh_all").checked;
                var all = document.getElementsByTagName("input");
                for (var i = 0; i < all.length; i++) {
                    if (all[i].id.match(/ctl00_ContentBody_LogList/)) all[i].checked = state;
                }
            }
            // Mark duplicate drafts.
            var existingNotes = {};
            var link = null;
            var date = null;
            var type = null;
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
                a.addEventListener("click", function() {document.getElementById("gclh_all").click();}, false);
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
        } catch(e) {gclh_error("Improve drafts:",e);}
    }

// Drafts auf alte Log Seite umbiegen.
    if (settings_fieldnotes_old_fashioned && document.location.href.match(/\.com\/my\/fieldnotes\.aspx/)) {
        try {
            var link = $('a[href*="fieldnotes.aspx?composeLog=true"]');
            for (var i = 0; i < link.length; i++) {
                var matches = link[i].href.match(/&draftGuid=(.*)&/i);
                if (matches && matches[1]) link[i].href = "https://www.geocaching.com/seek/log.aspx?PLogGuid=" + matches[1];
            }
        } catch(e) {gclh_error("Drafts auf alte Log Seite umbiegen:",e);}
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

// Linklist, Default Links on dashboard.
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
        } catch(e) {gclh_error("Linklist, Default Links on dashboard:",e);}
    }

// Improve old dashboard.
    if (is_page("profile")) {
        try {
            // Show/Hide einbauen in rechter Spalte.
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
            if (document.getElementsByTagName("body")[0]) document.getElementsByTagName("body")[0].appendChild(script);
            var boxes = document.getElementsByClassName("WidgetHeader");
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
                        boxes[wb].innerHTML = "<img id='lnk_" + i + "' src='" + http + "://www.geocaching.com/images/plus.gif' onClick='hide_box(\"" + i + "\");' title='show' style='cursor: pointer'> " + boxes[wb].innerHTML;
                    } else {
                        boxes[wb].innerHTML = "<img id='lnk_" + i + "' src='" + http + "://www.geocaching.com/images/minus.gif' onClick='hide_box(\"" + i + "\");' title='hide' style='cursor: pointer'> " + boxes[wb].innerHTML;
                    }
                    document.getElementById("lnk_" + i).addEventListener("click", saveStates, false);
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
        } catch(e) {gclh_error("Improve old dashboard:",e);}
    }

// Improve dashboard.
    if (is_page("dashboard")) {
        try {
            // Map and Search button in left sidebar.
            if (settings_but_search_map) {
                var target = (settings_but_search_map_new_tab ? "_blank" : "");
                var nav = document.querySelector('.sidebar-links');
                var ul = nav.querySelector('ul');
                var newmapbtn = document.createElement('li');
                newmapbtn.classList.add("action-link");
                newmapbtn.innerHTML = '<a class="gclh_svg_fill" href="/map/" target="'+target+'"><svg class="icon" height="36" width="36"><use xlink:href="/account/app/ui-icons/sprites/global.svg#icon-map-no-border"></use></svg>Map</a>';
                ul.insertBefore(newmapbtn, ul.childNodes[0]);
                var newsearchbtn = document.createElement('li');
                newsearchbtn.classList.add ("action-link");
                newsearchbtn.innerHTML = '<a class="gclh_svg_fill" href="/play/search" target="'+target+'"><svg class="icon" height="36" width="36" style="margin-left:3px; margin-right:19px; margin-top:5px; margin-bottom:5px; width:26px !important;height:auto !important;"><use xlink:href="/account/app/ui-icons/sprites/global.svg#icon-spyglass-svg-fill"></use></svg>Search</a>';
                ul.insertBefore(newsearchbtn, ul.childNodes[0]);
                appendCssStyle("a.gclh_svg_fill {fill: #4a4a4a;} a.gclh_svg_fill:hover {fill: #02874d;}");
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
                    url: "https://www.geocaching.com/my/inventory.aspx",
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
                 var css = '';
                 css += ".link-block .gclh a {font-size: 14px; margin-left: 16px;} .link-block .gclh span:hover {text-decoration: underline; color: #02874d;}";
                 css += ".link-block .gclh span {overflow: hidden; vertical-align: top; white-space: nowrap; text-overflow: ellipsis; display: inline-block; margin-left: 2px; max-width: 220px;}";
                 appendCssStyle(css);
            }
            // Change link "Your lists" from ".../account/lists" to ".../my/lists.aspx".
            if (settings_my_lists_old_fashioned) $('#DashboardSidebar ul li a[href*="/account/lists"]').prop("href", "/my/lists.aspx");
        } catch(e) {gclh_error("Improve dashboard:",e);}
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
        if (premiumTeil.href.match(/\/seek\/log\.aspx\?ID=/)) {
            if (premiumTeil.href.match(/www\.geocaching\.com\//)) {var href = premiumTeil.href;}
            else {var href = "https://www.geocaching.com" +  premiumTeil.href;}
            location = href;
        }
    }

// Show Profile-Link on display of Caches found or created by user. (Muß vor VIP laufen.)
    if (settings_show_nearestuser_profil_link && document.location.href.match(/\.com\/seek\/nearest\.aspx/) && document.location.href.match(/(ul|u)=/)) {
        if (document.getElementById("ctl00_ContentBody_LocationPanel1_OriginLabel")) {
            try {
                var urluser = getUrlUser();
                var linkelement = document.createElement("a");
                linkelement.href = "/profile/?u=" + urluser;
                linkelement.innerHTML = urluser;
                var textelement = document.getElementById("ctl00_ContentBody_LocationPanel1_OriginLabel");
                textelement.innerHTML = textelement.innerHTML.replace(/: (.*)/, ": ");
                textelement.appendChild(linkelement);
            } catch(e) {gclh_error("Show Profile Link",e);}
        }
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
             document.location.href.match(/\.com\/email\/\?guid=/)               ||      // Mail schreiben
             document.location.href.match(/\.com\/my\/inventory\.aspx/)          ||      // TB Inventar
             document.location.href.match(/\.com\/my/)                           ||      // Profil
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
                if (document.getElementById('ctl00_ContentBody_mcd1')) {
                    owner = get_real_owner();
                    if (!owner) owner = urldecode(document.getElementById('ctl00_ContentBody_mcd1').childNodes[1].innerHTML);
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
                var map = document.getElementById("ctl00_ContentBody_detailWidget");
                var box = document.createElement("div");
                var headline = document.createElement("h3");
                var body = document.createElement("div");
                box.setAttribute("class", "CacheDetailNavigationWidget NoPrint");
                headline.setAttribute("class", "WidgetHeader");
                body.setAttribute("class", "WidgetBody");
                body.setAttribute("id", "gclh_vip_list");
                headline.innerHTML = "<img width='16' height='16' style='margin-bottom: -2px;' title='Very important person List' alt='VIP-List' src='" + http + "://www.geocaching.com/images/icons/icon_attended.gif\'> VIP-List";
                if (settings_make_vip_lists_hideable) {
                    headline.innerHTML = "<img id='lnk_gclh_vip_list' title='' src='' style='cursor: pointer'> " + headline.innerHTML;
                }
                box.appendChild(headline);
                box.appendChild(body);
                box.setAttribute("style", "margin-top: 1.5em;");
                map.parentNode.insertBefore(box, map);
                if (settings_make_vip_lists_hideable) {
                    showHideBoxCL("lnk_gclh_vip_list", true);
                    document.getElementById("lnk_gclh_vip_list").addEventListener("click", function() {showHideBoxCL(this.id, false);}, false);
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
                    if (settings_make_vip_lists_hideable) {
                        headline2.innerHTML = "<img id='lnk_gclh_vip_list_nofound' title='' src='' style='cursor: pointer'> " + headline2.innerHTML;
                    }
                    box2.appendChild(headline2);
                    box2.appendChild(body2);
                    box2.innerHTML = box2.innerHTML;
                    map.parentNode.insertBefore(box2, map);
                    if (settings_make_vip_lists_hideable) {
                        showHideBoxCL("lnk_gclh_vip_list_nofound", true);
                        document.getElementById("lnk_gclh_vip_list_nofound").addEventListener("click", function() {showHideBoxCL(this.id, false);}, false);
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
                                profile.setAttribute("href", http + "://www.geocaching.com/profile/?u=" + urlencode(user));
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
                                log_text.innerHTML = "<img src='" + log_infos_long[i]["icon"] + "'> <b>" + user + " - " + log_infos_long[i]["date"] + "</b><br/>" + log_infos_long[i]["log"];
                                var log_img = document.createElement("img");
                                var log_link = document.createElement("a");
                                log_link.setAttribute("href", "#" + log_infos_long[i]["id"]);
                                log_link.className = "gclh_log";
                                log_link.addEventListener("click", function() {
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
                            profile.setAttribute("href", http + "://www.geocaching.com/profile/?u=" + urlencode(user));
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
                                    a.addEventListener("click", function() {
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
                    if (settings_show_long_vip) gclh_build_long_list();
                    else {
                        if (!log_infos[owner_name]) log_infos[owner_name] = new Array();
                        gclh_build_list(owner_name);
                        for (var i = 0; i < global_vips.length; i++) {gclh_build_list(global_vips[i]);}
                    }

                    // "Not found"-Liste erstellen.
                    if (document.getElementById("gclh_vip_list_nofound")) {
                        for (var i = 0; i < global_vips.length; i++) {
                            if (getValue("settings_load_logs_with_gclh") == false) break;
                            var user = global_vips[i];
                            if (in_array(user, users_found)) continue;
                            var span = document.createElement("span");
                            var profile = document.createElement("a");
                            profile.setAttribute("href", http + "://www.geocaching.com/profile/?u=" + urlencode(user));
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
            } else if (document.location.href.match(/\.com\/my\//) && document.getElementById("ctl00_ContentBody_uxBanManWidget")) {
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
                        profile.setAttribute("href", http + "://www.geocaching.com/profile/?u=" + urlencode(user));
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
                       document.location.href.match(/\.com\/email\/\?guid=/) ||
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
                    var idLink = "https://www.geocaching.com/p/default.aspx?id=" + id[1] + "&tab=geocaches";
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
            } else if (is_page("publicProfile") && (document.getElementById("ctl00_ContentBody_ProfilePanel1_lblMemberName") || document.getElementById("ctl00_ProfileHead_ProfileHeader_lblMemberName"))) {
                var user = (document.getElementById("ctl00_ContentBody_ProfilePanel1_lblMemberName") || document.getElementById("ctl00_ProfileHead_ProfileHeader_lblMemberName")).innerHTML.replace(/&amp;/, '&');
                var side = (document.getElementById("ctl00_ContentBody_ProfilePanel1_lblMemberName") || document.getElementById("ctl00_ProfileHead_ProfileHeader_lblStatusText"));
                // Build VIP Icon.
                link = gclh_build_vipvup(user, global_vips, "vip");
                link.children[0].style.marginLeft = (document.getElementById("ctl00_ContentBody_ProfilePanel1_lblMemberName") ? "0" : "14px");
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
                '          <a ' + mailNewWin + 'href="' + http + '://www.geocaching.com/email/?guid=${AccountGuid}&text=' + global_MailTemplate + '"><img border=0 title="Send a mail to ${UserName}" src="' + global_mail_icon + '"></a>' +
                '          {{/if}}';
            if (settings_show_message) new_tmpl +=
                '          {{if UserName !== "' + global_activ_username + '" }}' +
                '          <a ' + messageNewWin + 'href="' + http + '://www.geocaching.com/account/messagecenter?recipientId=${AccountGuid}&text=' + global_MailTemplate + '"><img border=0 title="Send a message to ${UserName}" src="' + global_message_icon + '"></a>' +
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

            // Rebuild function - but with full control.
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
                        // Stop the scrolling if the last page is reached.
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
                addButtonOverLogs(gclh_load_all_logs, "gclh_load_all_logs", false, "Show all logs", "");
                showLogCounterLink();
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
                        onload: function(response) {
                            requestCount--;
                            var dataElement = JSON.parse(response.responseText);
                            data[dataElement.pageInfo.idx] = dataElement;
                            // gclh_log("Loading Logs Status: " + response.statusText + " - idx: " + dataElement.pageInfo.idx);
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
    // Zeilen in Cache Listings in Zebra und für User, für Owner, für Reviewer und für VIP einfärben.
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
            var parameterStamm = "settings_show_cache_listings_color";
        } else if (document.location.href.match(/\.com\/track\/details\.aspx/)) {
            var lines = $("table.Table").find("tbody").find("tr");
            var count = 2;
            var owner = document.getElementById("ctl00_ContentBody_BugDetails_BugOwner").innerHTML;
            var parameterStamm = "settings_show_tb_listings_color";
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
        if (linesNew.length > 0) setLinesColorUser(parameterStamm, "user,owner,reviewer,vips", linesNew, count, owner);
    }

// Farben für Zeilen in gewöhnlichen Listen und im TB Listing setzen. Im Cache Listing wird nur css benötigt.
    try {
        // Hintergrund der Tabellenzeilen/Listzeilen einheitlich einfärben.
        var css = "table.Table tr.AlternatingRow td, .AlternatingRow, table.Table tr td.AlternatingRow {background-color: #" + getValue("settings_lines_color_zebra") + " !important;}"
                + "table.Table tr.TertiaryRow td, .TertiaryRow, table.Table tr td.TertiaryRow {background-color: #" + getValue("settings_lines_color_user") + " !important;}"
                + "table.Table tr.QuaternaryRow td, .QuaternaryRow, table.Table tr td.QuaternaryRow {background-color: #" + getValue("settings_lines_color_owner") + " !important;}"
                + "table.Table tr.QuinaryRow td, .QuinaryRow, table.Table tr td.QuinaryRow {background-color: #" + getValue("settings_lines_color_reviewer") + " !important;}"
                + "table.Table tr.SenaryRow td, .SenaryRow, table.Table tr td.SenaryRow {background-color: #" + getValue("settings_lines_color_vip") + " !important;}";
        appendCssStyle(css);
        // Bookmarklisten: Zeilen in Bookmarklisten in Zebra einfärben und die Funde des Users einfärben.
        // Die Bookmarklisten scheinen die einzigen Listen, bei denen das nicht vorgesehen ist.
        if (document.location.href.match(/\.com\/bookmarks\/(view\.aspx\?guid=|bulk\.aspx\?listid=|view\.aspx\?code=)/) && document.getElementById('ctl00_ContentBody_ListInfo_cboItemsPerPage')) {
            var lines = $("table.Table").find("tbody").find("tr");
            setLinesColorInZebra(settings_show_common_lists_in_zebra, lines, 2);
            setLinesColorUser("settings_show_common_lists_color", "user", lines, 2, "", true);
        // TB Listing: Zeilen in TB Listings in Zebra, für User, für Owner, für Reviewer und für VIP einfärben.
        } else if (document.location.href.match(/\.com\/track\/details\.aspx\?/)) {
            var lines = $("table.Table").find("tbody").find("tr");
            if (lines.length > 1) {
                var linesNew = lines.slice(0, -1);
                var owner = document.getElementById("ctl00_ContentBody_BugDetails_BugOwner").innerHTML;
                setLinesColorInZebra(settings_show_tb_listings_in_zebra, linesNew, 2);
                setLinesColorUser("settings_show_tb_listings_color", "user,owner,reviewer,vips", linesNew, 2, owner);
            }
        // Andere Listen: Bei Zeilen in anderen Listen gegebenenfalls Einfärbung für Zebra oder User entfernen.
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
                // Wenn der User nicht eingefärbt werden soll, Zebra aber ausgewählt ist, dann muss Zebra leider explizit
                // gesetzt werden, weil nur ein Wert im Standard gesetzt wurde, hier eben der Wert für User - blöd.
                if (settings_show_common_lists_in_zebra) {
                    if (document.location.href.match(/\.com\/seek\/nearest\.aspx\?/) ||           // - Pocket Query, Nearest
                        document.location.href.match(/\.com\/my\/recentlyviewedcaches\.aspx/)) {  //   oder Recently Viewed,
                        var lines = $("table.Table").find("tbody").find("tr").slice(1);           //   dann Überschrift weglassen.
                        setLinesColorInZebra(settings_show_common_lists_in_zebra, lines, 1);      //   Einzeilig.
                    }
                }
            }
        }
    } catch(e) {gclh_error("Color lines in lists:",e);}

// Show thumbnails.
    if (settings_show_thumbnails && ((is_page("cache_listing") && !isMemberInPmoCache()) || is_page("publicProfile") || document.location.href.match(/\.com\/(seek\/gallery\.aspx?|track\/details\.aspx?|track\/gallery\.aspx?)/))) {
        try {
            // my: Großes Bild; at: Kleines Bild; Man gibt an, wo sich die beiden berühren. Es scheint so, dass zuerst horizontal und
            // anschließend vertikal benannt werden muss. "top left" erzeugt dem entsprechend nur den default, also center. Das legt
            // zumindest die Ausrichtung aus den Tests nahe. Ein Arbeiten mit plus oder minus an zwei Stellen oder an einer in Verbindung
            // mit einem center führen zu Randerweiterungen und Verschiebung der Bildnamen. Da die kleinen Bilder im zugehörigen Bereich
            // links angeordnet sind und, rechts also ein großer Bereich leer ist, kann mit einem rechten Rand für die Bildberührung
            // nicht gearbeitet werden.
            // Änderungen bei "collision" haben keine einschlägigen Verbesserungen gebracht hinsichtlich der Erreichbarkeit aller Bilder.
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

            // Um Profile Foto herum pseudo a Tag aufbauen. Nur altes Profile.
            var profileFoto = false;
            if (is_page("publicProfile") &&
                document.getElementById("ctl00_ContentBody_ProfilePanel1_lnkProfile") &&
                document.getElementById("ctl00_ContentBody_ProfilePanel1_lnkProfile").className == "Active" &&
                document.getElementById("ctl00_ContentBody_ProfilePanel1_uxProfilePhoto")) {
                var profileFoto = true;
                var image = (document.getElementById("ctl00_ContentBody_ProfilePanel1_uxProfilePhoto") || document.getElementById("ctl00_ProfileHead_ProfileHeader_uxProfilePhoto"));
                var aPseudo = document.createElement("a");
                aPseudo.appendChild(image.cloneNode(true));
                image.parentNode.replaceChild(aPseudo, image);
            }

            var links = document.getElementsByTagName("a");

            var css = "";
            css += "a.gclh_thumb:hover {" +
                   "  text-decoration:underline;" +
                   "  position: relative;}" +
                   "a.gclh_thumb {" +
                   "  overflow: visible !important;" +
                   "  max-width: none !important;}" +
                   "a.gclh_thumb span {" +
                   "  white-space: unset !important;" +
                   "  visibility: hidden;" +
                   "  position: absolute;" +
                   "  top:-310px;" +
                   "  left:0px;" +
                   "  padding: 2px;" +
                   "  text-decoration:none;" +
                   "  text-align:left;" +
                   "  vertical-align:top;}" +
                   "a.gclh_thumb:hover span {" +
                   "  visibility: visible;" +
                   "  z-index: 100;" +
                   "  border: 1px solid #8c9e65;" +
                   "  background-color:#dfe1d2;" +
                   "  text-decoration: none !important;}" +
                   "a.gclh_thumb:hover img {margin-bottom: -4px;}" +
                   "a.gclh_thumb img {margin-bottom: -4px;}" +
                   ".gclh_max {" +
                   "  max-height: " + settings_hover_image_max_size + "px;" +
                   "  max-width:  " + settings_hover_image_max_size + "px;}";
            appendCssStyle(css);

            // Cache Listing: Logs, nicht die Beschreibung im Listing.
            if (is_page("cache_listing") && settings_load_logs_with_gclh) {
                var newImageTmpl =  "<a class='tb_images lnk gclh_thumb' onmouseover='placeToolTip(this);' rel='fb_images_${LogID}' href='" + http + "://img.geocaching.com/cache/log/${FileName}' title='<span class=&quot;LogImgTitle&quot;>${Name} &nbsp;</span><span class=&quot;LogImgLink&quot;> <a target=&quot;_blank&quot; href=&quot;/seek/log.aspx?LID=${LogID}&amp;IID=${ImageGuid}&quot;>View Log</a></span><br><span class=&quot;LogImgDescription&quot;>${Descr}</span>'>"
                                 +  "  <img title='${Name}' alt='${Name}' src='" + http + "://img.geocaching.com/cache/log/thumb/${FileName}'/>";
                if (settings_imgcaption_on_top) {
                    newImageTmpl += "  <span title='${Name}'>${Name}<img title='${Descr}' class='gclh_max' src='" + http + "://img.geocaching.com/cache/log/thumb/large/${FileName}'></span>";
                } else {
                    newImageTmpl += "  <span title='${Name}'><img title='${Descr}' class='gclh_max' src='" + http + "://img.geocaching.com/cache/log/thumb/large/${FileName}'>${Name}</span>";
                }
                newImageTmpl     += "</a>&nbsp;&nbsp;";
                var code = "function gclh_updateTmpl() {"
                         + "  delete $.template['tmplCacheLogImages'];"
                         + "  $.template(\"tmplCacheLogImages\",\"" + newImageTmpl + "\");"
                         + "}"
                         + "gclh_updateTmpl();"
                         + placeToolTip.toString();
                var script = document.createElement("script");
                script.innerHTML = code;
                document.getElementsByTagName("body")[0].appendChild(script);
                if (!settings_hide_avatar) showBiggerAvatarsLink();
            }

            var regexp = new RegExp(settings_spoiler_strings, "i");
            for (var i = 0; i < links.length; i++) {
                // Cache Listing: Listing Beschreibung, nicht die Logs.
                if (is_page("cache_listing") && links[i].href.match(/^https?:\/\/img\.geocaching\.com\/cache/)) {
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
                    if (settings_spoiler_strings != "" && links[i].innerHTML.match(regexp)) {  // Spoiler String
                        var div = document.createElement("div");
                        div.innerHTML = "Spoiler warning";
                        div.setAttribute("style", "transform: rotate(-30grad); width: 130px; position: relative; top: -90px; left: -5px; font-size: 15px;");
                        links[i].childNodes[0].src = "https://raw.githubusercontent.com/2Abendsegler/GClh/master/images/gclh_logo.png";
                        links[i].childNodes[0].style.opacity = "0.05";
                        links[i].childNodes[3].remove();
                        links[i].parentNode.appendChild(div);
                    }

                // Bilder Gallery Cache, TB und Public Profil:
                } else if ((is_page("publicProfile") || document.location.href.match(/\.com\/(seek\/gallery\.aspx?|track\/gallery\.aspx?)/)) &&
                            links[i].href.match(/^https?:\/\/img\.geocaching\.com\/(cache|track)\//) && links[i].childNodes[1] && links[i].childNodes[1].tagName == 'IMG') {
                    global_imageGallery = true;
                    var thumb = links[i].childNodes[1];
                    var span = document.createElement('span');
                    var img = document.createElement('img');
                    img.src = thumb.src.replace(/thumb\//, "/thumb/large/");
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
                    links[i].href = links[i].href.replace(/large\//, "");
                    links[i].appendChild(span);
                    if (document.location.href.match(/\.com\/seek\/gallery\.aspx?/)) {
                        if (settings_spoiler_strings != "" && links[i].dataset.title && links[i].dataset.title.match(regexp)) {  // Spoiler String
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
                } else if (document.location.href.match(/\.com\/track\/details\.aspx?/) &&
                           links[i].href.match(/^https?:\/\/img\.geocaching\.com\/track/)) {
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
                        span.appendChild(document.createTextNode(imgDesc));
                        span.appendChild(big_img);
                    } else {
                        span.appendChild(big_img);
                        span.appendChild(document.createTextNode(imgDesc));
                    }
                    // Neues img und neues span einbauen.
                    links[i].appendChild(span);

                // Profile Foto:
                } else if (profileFoto && links[i].childNodes[0] && links[i].childNodes[0].tagName == 'IMG' &&
                           (links[i].childNodes[0].src.match(/^https?:\/\/img\.geocaching\.com\/user\/avatar/) ||
                            links[i].childNodes[0].src.match(/^https?:\/\/img\.geocaching\.com\/user\/display/))) {
                    avatarThumbnail(links[i]);
                }
            }
        } catch(e) {gclh_error("Show Thumbnails:",e);}
    }
    function avatarThumbnail(link) {
        var thumb = link.children[0];
        thumb.setAttribute("style", "margin-bottom: 0px;");
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
            if ((document.location.href.match(/\.com\/(seek\/gallery\.aspx?|track\/gallery\.aspx?)/) && tds.length > 1 && document.getElementById("ctl00_ContentBody_GalleryItems_DataListGallery")) ||
                 (is_page("publicProfile") && tds.length > 1 && document.getElementById("ctl00_ContentBody_ProfilePanel1_UserGallery_DataListGallery"))) {
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
                if (document.getElementsByClassName("leaflet-container")[0]) {
                    // Map Header verbergen.
                    if (settings_hide_map_header) hide_map_header();
                    // Button in Sidebar aufbauen "Hide/Show Header".
                    var sidebar = document.getElementById("searchtabs");
                    var link = document.createElement("a");
                    link.appendChild(document.createTextNode("Hide/Show Header"));
                    link.href = "#";
                    link.addEventListener("click", hide_map_header, false);
                    // Link in der Sidebar rechts orientieren wegen möglichem GC Tour script.
                    link.setAttribute("style", "float: right; padding-right: 3px;");
                    sidebar.appendChild(link);
                    // Link in der Sidebar der Karten komplett anzeigen und auch nicht mehr überblenden, auch nicht durch GME.
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
                            // Wenn externe Kartenfilter vorhanden sind, dann gibt es keinen Balken zur Sidebar.
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
                // Die Circles erst aufbauen wenn die Karte fertig ist, sonst verschwinden sie wieder.
                function checkForAddHomeZoneMap(waitCount) {
                    if ($('.groundspeak-control-findmylocation')[0] && $('.leaflet-control-scale')[0]) {
                        // Show Homezone-Circle on Map
                        if (settings_show_homezone) {
                            if (browser === "chrome" || browser === "firefox") {
                                injectPageScriptFunction(addHomeZoneMap, "('" + "none" + "', " + getValue("home_lat") + ", " + getValue("home_lng") + ", " + settings_homezone_radius + ", '#" + settings_homezone_color + "', " + settings_homezone_opacity + ")");
                            } else addHomeZoneMap(unsafeWindow, getValue("home_lat"), getValue("home_lng"), settings_homezone_radius, "#" + settings_homezone_color, settings_homezone_opacity);
                            // Show Multi-Homezone-Circle on Map
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
                // Damit auch mehr als 2 Buttons handlebar sind.
                appendCssStyle(".leaflet-control-layers + .leaflet-control {position: unset; right: unset;} .leaflet-control {clear: left}");
            }
            function attachGeoServiceControl(waitCount) {
                // Prüfen, ob die Layers schon vorhanden sind, erst dann den Button hinzufügen.
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
        // Soll eigene Statistik gepimpt werden.
        if ((settings_count_own_matrix || settings_count_own_matrix_show_next) && isOwnStatisticsPage()) {
            var own = true;
        // Soll fremde Statistik gepimpt werden.
        } else if (settings_count_foreign_matrix && is_page("publicProfile") && $('#ctl00_ContentBody_lblUserProfile')[0] && !$('#ctl00_ContentBody_lblUserProfile')[0].innerHTML.match(": " + global_me)) {
            var own = false;
        } else var own = "";
        // Wenn Statistik gepimpt werden soll.
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
            getLogStatistic("cache", "https://www.geocaching.com/my/logs.aspx?s=1");
            getLogStatistic("track", "https://www.geocaching.com/my/logs.aspx?s=2");
        } catch(e) {gclh_error("Improve own log statistic:",e);}
    }
    function getLogStatistic(type, url, manual) {
        var logsName = (type == "cache" ? "Cache":"Trackable") + " logs";
        var logsId = "gclh_" + type + "_logs_";
        var get_last = parseInt(getValue(logsId + "get_last"), 10);
        if (!get_last) get_last = 0;
        var reload_after = (settings_log_statistic_reload === "" ? "0" : parseInt(settings_log_statistic_reload, 10) * 60 * 60 * 1000);
        var time = new Date().getTime();
        if ((reload_after != 0 && (get_last + reload_after) < time) || manual == true) {
            if (manual != true) outputLogStatisticHeaderFooter(type, logsName, logsId, url);
            outputLogStatisticClear(type, logsName, logsId);
            outputLogStatisticAddWait(type, logsName, logsId);
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
                    outputLogStatisticClear(type, logsName, logsId);
                    outputLogStatistic(type, logsName, logsId, generated);
                }
            });
        } else if (reload_after == 0 && get_last == 0) {
            outputLogStatisticHeaderFooter(type, logsName, logsId, url);
            outputLogStatisticDummy(type, logsName, logsId);
        } else {
            var generated = Math.ceil((time - get_last) / (60 * 1000));  // In Minuten.
            outputLogStatisticHeaderFooter(type, logsName, logsId, url);
            outputLogStatisticClear(type, logsName, logsId);
            outputLogStatistic(type, logsName, logsId, generated);
        }
    }
    function outputLogStatisticHeaderFooter(type, logsName, logsId, url) {
        if (($('#ctl00_ContentBody_StatsChronologyControl1_YearlyBreakdown')[0] || $('#ctl00_ContentBody_ProfilePanel1_StatsChronologyControl1_YearlyBreakdown')[0])) {
            var side = ($('#ctl00_ContentBody_StatsChronologyControl1_YearlyBreakdown')[0] || $('#ctl00_ContentBody_ProfilePanel1_StatsChronologyControl1_YearlyBreakdown')[0]);
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
            $('#'+logsId+'reload')[0].addEventListener("click", function() {getLogStatistic(type, url, true);}, false);
        }
    }
    function outputLogStatistic(type, logsName, logsId, generated) {
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
        } else outputLogStatisticDummy(type, logsName, logsId);
    }
    function buildTimeString(min) {
        if      (min < 2)    return (min + " minute");
        else if (min < 121)  return (min + " minutes");
        else if (min < 2881) return ("more than " + Math.floor(min / 60) + " hours");
        else                 return ("more than " + Math.floor(min / (60*24)) + " days");
    }
    function outputLogStatisticClear(type, logsName, logsId) {
        $('#'+logsId+'body').children().each(function() {this.remove();});
        if ($('#'+logsId+'total')[0]) $('#'+logsId+'total')[0].innerHTML = "";
        if ($('#'+logsId+'generated')[0]) $('#'+logsId+'generated')[0].innerHTML = $('#'+logsId+'generated')[0].title = "";
        if ($('#'+logsId+'reload')[0]) $('#'+logsId+'reload')[0].innerHTML = $('#'+logsId+'reload')[0].title = "";
    }
    function outputLogStatisticAddWait(type, logsName, logsId) {
        if ($('#'+logsId+'body')[0]) {
            var side = $('#'+logsId+'body')[0];
            var span_loading = document.createElement("span");
            span_loading.setAttribute("style", "line-height: 36px; margin-left: 5px;");
            span_loading.innerHTML = '<img src="/images/loading2.gif" title="Loading" alt="Loading" style="vertical-align: sub;" />  Loading ' + logsName + ' ...';
            side.appendChild(span_loading);
        }
    }
    function outputLogStatisticDummy(type, logsName, logsId) {
        if ($('#'+logsId+'body')[0]) {
            var side = $('#'+logsId+'body')[0];
            var span_dummy = document.createElement("span");
            span_dummy.setAttribute("style", "margin-left: 5px;");
            side.appendChild(span_dummy);
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
    if (is_page("publicProfile") && document.getElementById('ctl00_ContentBody_ProfilePanel1_lnkCollectibles') && document.getElementById('ctl00_ContentBody_ProfilePanel1_lnkCollectibles').className == "Active") {
        try {
            function gclh_coin_stats(table_id) {
                var table = document.getElementById(table_id).getElementsByTagName("table");
                table = table[0];
                var rows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
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
                var tfoot = table.getElementsByTagName("tfoot")[0];
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
            if (document.getElementById("ctl00_ContentBody_ProfilePanel1_dlCollectibles")) gclh_coin_stats("ctl00_ContentBody_ProfilePanel1_dlCollectibles");
            if (document.getElementById("ctl00_ContentBody_ProfilePanel1_dlCollectiblesOwned")) gclh_coin_stats("ctl00_ContentBody_ProfilePanel1_dlCollectiblesOwned");
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

// Count Fav-points.
    if (document.location.href.match(/\.com\/my\/favorites\.aspx/)) {
        try {
            var table = $('.Table.BottomSpacing')[0];
            if (table) {
                var imgs = table.getElementsByTagName("img");
                var stats = new Object();
                var count = 0;
                if (imgs) {
                    for (var i = 0; i < imgs.length; i++) {
                        // Mail, Message und VIP Icons beim Zählen nicht beachten.
                        if (imgs[i].title.match(/Send a m/) || imgs[i].title.match(/VIP/)) continue;
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
        } catch(e) {gclh_error("Count Fav-Points:",e);}
    }

// Sum up all FP and BM entries on public profile pages.
    if (is_page("publicProfile")) {
        try {
            $('#ctl00_ContentBody_ProfilePanel1_pnlBookmarks h3').each(function(i, e) {
                $(e).text($(e).text() + ' (' + $(e).next().find('tbody tr').length + ')');
            });
        } catch(e) {gclh_error("Sum up all FP and BM entries on public profile pages:",e);}
    }

// Hide side rights on print page.
    if (document.location.href.match(/\.com\/seek\/cdpf\.aspx/)) {
        try {
            document.getElementById("pnlDisplay").removeChild(document.getElementById("Footer"));
        } catch(e) {gclh_error("Hide side rights on print page:",e);}
    }

// Edit and Image Links to own caches in profile.
    if (document.location.href.match(/\.com\/my\/owned\.aspx/)) {
        try {
            var links = document.getElementsByTagName("a");
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
            var links = document.getElementsByTagName("a");
            for (var i = 0; i < links.length; i++) {
                if (links[i].href.match(/\/seek\/cache_details\.aspx\?/)) {
                    var archived = links[i].classList.contains("OldWarning");
                    if (archived) links[i].parentNode.parentNode.style.display = 'none';
                }
            }
        } catch(e) {gclh_error("Hide archived at own caches:",e);}
    }

// Werden nicht alle eigenen Logs geladen, weil z.B. Laden Seite über Browser gestoppt, dann Anzahl Logs geladen und Datum letztes Log angeben.
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

// Add mailto-link to profilpage.
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
            var lnk_changelog = " | <a href='https://github.com/2Abendsegler/GClh/blob/master/docu/changelog.md#readme' title='Documentation of changes and new features in GClh II on GitHub'>Changelog</a>";
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
            var link = http + "://www.geocaching.com/seek/nearest.aspx?lat=" + (getValue("home_lat") / 10000000) + "&lng=" + (getValue("home_lng") / 10000000) + "&dist=25&disable_redirect=";
            setLnk("lnk_nearestlist", link);
            setLnk("lnk_nearestlist_profile", link);
            var link = map_url + "?lat=" + (getValue("home_lat") / 10000000) + "&lng=" + (getValue("home_lng") / 10000000);
            setLnk("lnk_nearestmap", link);
            setLnk("lnk_nearestmap_profile", link);
            var link = http + "://www.geocaching.com/seek/nearest.aspx?lat=" + (getValue("home_lat") / 10000000) + "&lng=" + (getValue("home_lng") / 10000000) + "&dist=25&f=1&disable_redirect=";
            setLnk("lnk_nearestlist_wo", link);
            setLnk("lnk_nearestlist_wo_profile", link);
        }
        // Links zu den eigenen Trackables in Linklist und Default Links setzen.
        if (getValue("uid", "") != "") {
            var link = http + "://www.geocaching.com/track/search.aspx?o=1&uid=" + getValue("uid");
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

// Append '&visitcount=1' to all geochecker.com links (on listing pages).
    if (settings_visitCount_geocheckerCom && is_page("cache_listing")) {
        try {
            $('a[href^="http://www.geochecker.com/index.php?code="]').filter(':not([href*="visitcount=1"])').attr('href', function(i, str) {
                return str + '&visitcount=1';
            }).attr('rel', 'noreferrer');
        } catch(e) {gclh_error("Append '&visitcount=1' to all geochecker.com links:",e);}
    }

// Auto check checkbox on hide cache process.
    try {
        if (settings_hide_cache_approvals && document.location.href.match(/\.com\/hide\/(report|description|edit)\.aspx/)) {
            $("#ctl00_ContentBody_cbAgreement").prop('checked', true);
            $("#ctl00_ContentBody_chkUnderstand").prop('checked', true);
            $("#ctl00_ContentBody_chkDisclaimer").prop('checked', true);
            $("#ctl00_ContentBody_chkAgree").prop('checked', true);
        }
    } catch(e) {gclh_error("Auto check checkbox on hide cache process:",e);}

// Check for upgrade.
    try {
        function checkForUpgrade(manual) {
            var next_check = parseInt(getValue("update_next_check"), 10);
            if (!next_check) next_check = 0;
            var time = new Date().getTime();

            if (next_check < time || manual == true) {
                var url = "https://raw.githubusercontent.com/2Abendsegler/GClh/master/gc_little_helper_II.user.js";
                time += 1 * 60 * 60 * 1000;  // 1 Stunde warten, bis zum nächsten Check.
                setValue('update_next_check', time.toString());

                if (GM_xmlhttpRequest) {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
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
                                            document.location.href = url;
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
            // Weihnachten 2017.
            if (month == 12 && year == 2017) {
                var max = 0; var kerze = 0;
                if (date == 2 || date == 3) {max = 32; kerze = 1;}
                else if (date == 5 || date == 6) {max = 64;}
                else if (date == 9 || date == 10) {max = 48; kerze = 2;}
                else if (date == 16 || date == 17) {max = 32; kerze = 3;}
                else if (date == 24 || date == 25 || date == 26) {max = 16; kerze = 4;}
                if (kerze > 0) {}
                if (max > 0) {
                    function checkChristmasData(waitCount) {
                        if ($('#gclh_vip_list span').length > 0 && $('#gclh_vip_list .StatusIcon').length == 0) {
                            setTimeout(function() {
                                var icons = $('#gclh_latest_logs,#gclh_vip_list').find('img[src*="/images/logtypes/2.png"]');
                                for (var i = 0; i < icons.length; i += 2) {
                                    var num = random(max, 1);
                                    if (num > 0 && num < 9) icons[i].src = "https://raw.githubusercontent.com/2Abendsegler/GClh/master/images/nicolaus_head_0" + num + ".png";
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
        s = encodeURIComponent(s);  // Kodiert alle außer folgende Zeichen: A bis Z und a bis z und - _ . ! ~ * ' ( )
        s = s.replace(/~/g, "%7e");
        s = s.replace(/'/g, "%27");
        s = s.replace(/%26amp%3b/g, "%26");
        s = s.replace(/ /g, "+");
        return s;
    }
    function urldecode(s) {
        s = s.replace(/\+/g, " ");
        s = s.replace(/%7e/g, "~");
        s = s.replace(/%27/g, "'");
        s = decodeURIComponent(s);
        return s;
    }

// HTML dekodieren, zB: "&amp;" in "&" (zB: User "Rajko & Dominik".)
    function decode_innerHTML(variable_mit_innerHTML) {
        var elem = document.createElement('textarea');
        elem.innerHTML = variable_mit_innerHTML.innerHTML;
        variable_decode = elem.value;
        variable_new = variable_decode.trim();
        return variable_new;
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
        if (document.getElementById('bg_shadow')) document.getElementById('bg_shadow').style.display = "none";
        if (document.getElementById('settings_overlay')) document.getElementById('settings_overlay').style.display = "none";
        if (document.getElementById('sync_settings_overlay')) document.getElementById('sync_settings_overlay').style.display = "none";
        if (document.getElementById('findplayer_overlay')) document.getElementById('findplayer_overlay').style.display = "none";
        if (clearUrl != false) document.location.href = clearUrlAppendix(document.location.href, false);
    }

// Get Finds out of login text box.
    function get_my_finds() {
        var finds = "";
        if ($('.cache-count').text()) finds = parseInt($('.cache-count').text().match(/[0-9,\.]+/)[0].replace(/[,\.]/,""));
        return finds;
    }

// Sucht Original Usernamen des Owners aus Listing.
    function get_real_owner() {
        if (document.getElementById("ctl00_ContentBody_bottomSection")) {
            var links = document.getElementById("ctl00_ContentBody_bottomSection").getElementsByTagName("a");
            for (var i = 0; i < links.length; i++) {
                var match = links[i].href.match(/\/seek\/nearest\.aspx\?u\=(.*)$/);
                if (match) return urldecode(match[1]);
            }
            return false;
        } else return false;
    }

// Versteckt Header in Map-Ansicht.
    function hide_map_header() {
        var header = document.getElementsByTagName("nav");
        if (header[0].style.display != "none") {
            header[0].style.display = "none";
            document.getElementById("Content").style.top = 0;
        } else {
            header[0].style.display = "block";
            document.getElementById("Content").style.top = "80px";
        }
    }

// CSS Style hinzufügen.
    function appendCssStyle(css, name) {
        var tagname = 'head';
        if (name) tagname = name;
        var tag = document.getElementsByTagName(tagname)[0];
        var style = document.createElement('style');
        style.innerHTML = 'GClhII{} ' + css;
        style.type = 'text/css';
        tag.appendChild(style);
    }

// Zu lange Zeilen "kürzen", damit nicht umgebrochen wird.
    function noBreakInLine(n_side, n_maxwidth, n_title) {
        if (n_side == "" || n_side == undefined) return;
        if (n_maxwidth == 0) return;
        n_side.setAttribute("style", "max-width: " + n_maxwidth + "px; display: inline-block; overflow: hidden; vertical-align: bottom; white-space: nowrap; text-overflow: ellipsis;");
        if (n_title != "") n_side.setAttribute("title", n_title);
        return;
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
            if (b_username == "" || b_username == undefined) return;
        }
        if (b_side == "" || b_side == undefined) return;
        if (b_username == undefined) return;
        if (global_activ_username == "" || global_activ_username == undefined) return;
        if (b_username == global_activ_username) return;
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
            var message_link = document.createElement("a");
            var message_img = document.createElement("img");
            message_img.setAttribute("style", "margin-left: 0px; margin-right: 0px");
            message_img.setAttribute("title", "Send a message to " + username_send);
            message_img.setAttribute("src", global_message_icon);
            message_link.appendChild(message_img);
            if (settings_message_icon_new_win) message_link.setAttribute("target", "_blank");
            message_link.setAttribute("href", http + "://www.geocaching.com/account/messagecenter?recipientId=" + guid + "&text=" + template);
            b_side.parentNode.insertBefore(message_link, b_side.nextSibling);
            b_side.parentNode.insertBefore(document.createTextNode(" "), b_side.nextSibling);
            // "Message this owner" und das Icon entfernen, falls es da ist.
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

// Zebra Look einfärben bzw. Einfärbung entfernen.
    function setLinesColorInZebra(parameter, lines, linesTogether) {
        if (lines.length == 0) return;
        var replaceSpec = /(AlternatingRow)(\s*)/g;
        var setSpec = "AlternatingRow";

        // Wenn Einfärbung nicht stattfinden soll.
        if (parameter == false) setLinesColorNone(lines, replaceSpec);
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
    function setLinesColorUser(parameterStamm, tasks, lines, linesTogether, owner, bookmarklist) {
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
        var parameter = new Array();
        if (tasks.match("user")) parameter["user"] = getValue(parameterStamm + "_user");
        else parameter["user"] = "";
        if (tasks.match("owner")) parameter["owner"] = getValue(parameterStamm + "_owner");
        else parameter["owner"] = "";
        if (tasks.match("reviewer")) parameter["reviewer"] = getValue(parameterStamm + "_reviewer");
        else parameter["reviewer"] = "";
        if (tasks.match("vip")) parameter["vip"] = getValue(parameterStamm + "_vip");
        else parameter["vip"] = "";

        // Wenn Einfärbung für User nicht stattfinden soll, dann entfernen.
        if (parameter["user"] == false) setLinesColorNone(lines, replaceSpecUser);
        // Wenn Einfärbung stattfinden soll.
        if (parameter["user"] == true || parameter["owner"] == true || parameter["reviewer"] == true || parameter["vip"] == true) {
            for (var i = 0; i < lines.length; i += linesTogether) {
                var newClass = "";
                var aTags = lines[i].getElementsByTagName("a");
                var imgTags = lines[i].getElementsByTagName("img");
                // Cache, TB Listing. Anhand guid prüfen, ob Einfärbung für User oder Owner notwendig ist.
                if (parameter["user"] || parameter["owner"]) {
                    for (var j = 0; j < aTags.length; j++) {
                        if (aTags[j].href.match(/\/profile\/\?guid=/)) {
                            if (decode_innerHTML(aTags[j]) == user && parameter["user"]) newClass = setSpecUser;
                            else if (decode_innerHTML(aTags[j]) == owner && parameter["owner"]) newClass = setSpecOwner;
                            break;
                        }
                    }
                    // Bookmark Listen. Anhand Found Icon prüfen, ob Einfärbung für User notwendig ist.
                    // (Originallogs würden wegen src mit found noch hier reingehen -> Parameter bookmarklist.)
                    if (newClass == "" && parameter["user"] && bookmarklist) {
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
                if (newClass == "" && parameter["reviewer"]) {
                    for (var j = 0; j < imgTags.length; j++) {
                        if (imgTags[j].src.match(/\/icon_admin\./)) {
                            newClass = setSpecReviewer;
                            break;
                        }
                    }
                }
                // Cache, TB Listing. Anhand titles zum VIP Icon und guid der VIP prüfen, ob Einfärbung fürVIP notwendig ist. VIP kann sich während Seitendarstellung ändern.
                if (newClass == "" && parameter["vip"] && vips) {
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
//--> $$000                                                                 | Hier, v0.9 done
    newParameterOn1 = "<div  style='background-color: rgba(240, 223, 198, 0.3); width: 100%; height: 100%; padding: 2px 0px 2px 2px; margin-left: -2px;'>";
    newParameterOn2 = "<div  style='background-color: rgba(240, 223, 198, 0.6); width: 100%; height: 100%; padding: 2px 0px 2px 2px; margin-left: -2px;'>";
    newParameterOn3 = "<div  style='background-color: rgba(240, 223, 198, 1.0); width: 100%; height: 100%; padding: 2px 0px 2px 2px; margin-left: -2px;'>";
    newParameterLL1 = '<span style="background-color: rgba(240, 223, 198, 0.3); float: right; padding-top: 25px; width: 100%; margin: -22px 2px 0px 0px;"></span>';
    newParameterLL2 = '<span style="background-color: rgba(240, 223, 198, 0.6); float: right; padding-top: 25px; width: 100%; margin: -22px 2px 0px 0px;"></span>';
    newParameterLL3 = '<span style="background-color: rgba(240, 223, 198, 1.0); float: right; padding-top: 25px; width: 100%; margin: -22px 2px 0px 0px;"></span>';
//<-- $$000
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
        document.getElementsByTagName('body')[0].appendChild(shadow);
        document.getElementById('bg_shadow').addEventListener("click", btnClose, false);
    }

// Ist GClh Config aktiv?
    function check_config_page() {
        var config_page = false;
        if ($('#bg_shadow')[0] && $('#bg_shadow')[0].style.display == "" && $('#settings_overlay')[0] && $('#settings_overlay')[0].style.display == "") config_page = true;
        return config_page;
    }
// Ist GClh Sync aktiv?
    function check_sync_page() {
        var sync_page = false;
        if ($('#bg_shadow')[0] && $('#bg_shadow')[0].style.display == "" && $('#sync_settings_overlay')[0] && $('#sync_settings_overlay')[0].style.display == "") sync_page = true;
        return sync_page;
    }

// Ist spezielle Verarbeitung auf aktueller Seite erlaubt?
    function checkTaskAllowed(task, doAlert) {
        if ((document.location.href.match(/^https?:\/\/www\.wherigo\.com/) ||
             document.location.href.match(/^https?:\/\/www\.waymarking\.com/) ||
             document.location.href.match(/^https?:\/\/labs\.geocaching\.com/) ||
             isMemberInPmoCache()) ||
            (task != "Find Player" &&  document.location.href.match(/\.com\/map\//))) {
            if (doAlert != false) {
                var mess = "This GC little helper functionality is not available at this page.\n\n"
                         + "Please go to the \"Dashboard\" page, there is anyway all of these \n"
                         + "functionality available. ( www.geocaching.com/my )";
                alert(mess);
            }
            return false;
        }
        return true;
    }

// Zusatz in  url, eingeleitet durch "#", zurücksetzen bis auf "#".
    function clearUrlAppendix(url, onlyTheFirst) {
        var urlSplit = url.split('#');
        var newUrl = "";
        if (onlyTheFirst) newUrl = url.replace(urlSplit[1], "").replace("##", "#");
        else newUrl = urlSplit[0] + "#";
        return newUrl;
    }

// Ist Basic Member in PMO Cache?
    function isMemberInPmoCache() {
        if (is_page("cache_listing") && document.getElementsByClassName("pmo-banner")[0] && document.getElementsByClassName("pmo-upsell")[0]) return true;
        else return false;
    }

// Installationszähler simulieren.
    function instCount(declaredVersion) {
        var side = $('body')[0];
        var div = document.createElement("div");
        div.id = "gclh_simu";
        div.setAttribute("style", "margin-top: -50px;");
        var prop = ' style="border: none; visibility: hidden; width: 2px; height: 2px;" alt="">';
//--> $$000
        var code = '<img src="https://c.andyhoppe.com/1485103563"' + prop +
                   '<img src="https://c.andyhoppe.com/1485234890"' + prop +
                   '<img src="https://s07.flagcounter.com/countxl/mHeY/bg_FFFFFF/txt_000000/border_CCCCCC/columns_6/maxflags_60/viewers_0/labels_1/pageviews_1/flags_0/percent_0/"' + prop;
//<-- $$000
        div.innerHTML = code;
        side.appendChild(div);
        setValue("declared_version", scriptVersion);
        setTimeout(function() {$("#gclh_simu").remove();}, 4000);
        setTimeout(function() {
            var url = "https://github.com/2Abendsegler/GClh/blob/master/docu/changelog.md#readme";
            var text = "Version " + scriptVersion + " of  \"" + scriptName + "\"  was successfully installed.\n\n"
                     + "Do you want to open the changelog in a new tab, to have a quick\n"
                     + "look at changes and new features?\n";
//--> $$000
            if (browser === "firefox" && isTM === false) {
               var text = "Version " + scriptVersion + " of  \"" + scriptName + "\"  was successfully installed.\n\n"
                        + "DEAR FIREFOX USER, PLEASE CHECK THE CHANGELOG TO VERSION 0.8.10 AND HIGHER!\n\n"
                        + "Do you want to open the changelog in a new tab?\n";
            }
//<-- $$000
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

// Aktuelles Datum, Zeit ermitteln, aufbereiten.
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

// GC/TB Name, GC/TB Link, GC/TB Name Link, vorläufiges LogDate ermitteln.
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
                    var waypoint = {};
                    if (td_list[3]) {
                        waypoint.icon = td_list[1].getElementsByTagName("img")[0].getAttribute("src");
                        waypoint.prefix = td_list[2].textContent.trim();
                        waypoint.lookup = td_list[3].textContent.trim();
                        waypoint.name = td_list[4].getElementsByTagName("a")[0].textContent;
                        var oDiv = td_list[4];
                        var firstText = "";
                        for (var j = 0; j < oDiv.childNodes.length; j++) {
                            var curNode = oDiv.childNodes[j];
                            if (curNode.nodeName === "#text") firstText += curNode.nodeValue.trim();
                        }
                        waypoint.subtype_name = firstText;
                        waypoint.link = td_list[4].getElementsByTagName("a")[0].getAttribute("href");
                        var subtype = "";
                        var icon = waypoint.icon;
                        if (icon.match(/trailhead.jpg/g)) subtype = "Trailhead";
                        else if (icon.match(/flag.jpg/g)) subtype = "Final Location";
                        else if (icon.match(/pkg.jpg/g)) subtype = "Parking Area";
                        else if (icon.match(/stage.jpg/g)) subtype = "Physical Stage";
                        else if (icon.match(/puzzle.jpg/g)) subtype = "Virtual Stage";
                        else if (icon.match(/waypoint.jpg/g)) subtype = "Reference Point";
                        else gclh_log("ERROR: getAdditionalWaypoints(): problem with waypoint "+waypoint.lookup+"/"+waypoint.prefix+ " - unknown waypoint type ("+icon+")");
                        waypoint.subtype = subtype;
                        waypoint.visible = false;
                        tmp_coords = toDec(td_list[5].textContent.trim());
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
        } catch(e) {gclh_error("getAdditionalWaypoints:",e);}
        return addWP;
    }
    // Reads posted coordinates from listing.
    function getListingCoordinatesX() {
        var addWP = [];
        try {
            if (!document.getElementById('cacheDetails')) return;
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
                var tmp_coords = document.getElementById('ctl00_ContentBody_uxViewLargerMap').getAttribute('href').match(/(-)*(\d{1,3})(.(\d{1,6}))?/g);
                waypoint.latitude = tmp_coords[0];
                waypoint.longitude = tmp_coords[1];
            } else gclh_log("ERROR: getListingCoordinatesX(): warning: listing coordinates are not found.");
            waypoint.visible = true;
            waypoint.lookup = gccode;
            waypoint.prefix = "";
            waypoint.name = gcname;
            waypoint.note = "";
            waypoint.type = "listing";
            waypoint.subtype = "origin";
            waypoint.link = document.location.href;
            waypoint.cachetype = document.getElementById('cacheDetails').getElementsByClassName('cacheImage')[0].getElementsByTagName('img')[0].getAttribute('title');
            addWP.push(waypoint);
            return addWP;
        } catch(e) {gclh_error("Reads the posted coordinates from the listing:",e);}
    }
    function extractWaypointsFromListing() {
        var waypoints = [];
        waypoints = waypoints.concat(getListingCoordinatesX());
        waypoints = waypoints.concat(getAdditionalWaypoints());
        return waypoints;
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
        css += ".link-header.gclh svg {height: 22px; width: 22px; fill: #777; float: right; padding-right: 1px; margin-top: -2px; transition: all .3s ease;}";
        css += ".link-header.gclh.isHide svg {transform: rotate(180deg);}";
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
            (is_page("publicProfile") && $('#ctl00_ContentBody_lblUserProfile')[0].innerHTML.match(global_me) &&
             $('#ctl00_ContentBody_ProfilePanel1_lnkStatistics')[0] && $('#ctl00_ContentBody_ProfilePanel1_lnkStatistics')[0].className == "Active")) {
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
        var settings_search_data_tmp = [];
        for (var i = 0; i < settings_search_data.length; i++) {
            if (settings_search_data[i].id != id) settings_search_data_tmp[settings_search_data_tmp.length] = settings_search_data[i];
        }
        settings_search_data = settings_search_data_tmp;
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

        if (document.getElementById('bg_shadow')) {
            if (document.getElementById('bg_shadow').style.display == "none") document.getElementById('bg_shadow').style.display = "";
        } else buildBgShadow();

        if (document.getElementById('findplayer_overlay') && document.getElementById('findplayer_overlay').style.display == "none") {
            document.getElementById('findplayer_overlay').style.display = "";
        } else {
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
            var form_side = document.getElementsByTagName('body')[0];
            var form_style = document.createElement("style");
            form_style.appendChild(document.createTextNode(html));
            form_side.appendChild(form_style);

            // Overlay erstellen
            var html = "";
            html += "<h3 style='margin:5px; font-weight: bold; font-size: 19.5px; line-height: 1; color: #594a42;'>Find Player</h3>";
            html += "<form style='text-align: unset;' action=\"/find/default.aspx\" method=\"post\" name=\"aspnetForm\" >";
            html += "<input class='gclh_form' type='hidden' name='__VIEWSTATE' value=''>";
            html += "<input style='width: 170px;' class='gclh_form' id='findplayer_field' class=\"Text\" type=\"text\" maxlength=\"100\" name=\"ctl00$ContentBody$FindUserPanel1$txtUsername\"/>";
            html += " <input style='cursor: pointer;' class='gclh_form' type=\"submit\" value=\"go\" name=\"ctl00$ContentBody$FindUserPanel1$GetUsers\"/>";
            html += " <input style='cursor: pointer;' class='gclh_form' id='btn_close1' type='button' value='close'>";
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

//////////////////////////////
// Config Main
//////////////////////////////
    function checkboxy(setting_id, label) {
        // Hier werden auch gegebenenfalls "Clone" von Parametern verarbeitet. (Siehe Erläuterung weiter unten bei "setEventsForDoubleParameters".)
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

    var t_reqChl = "This option requires \"Change header layout\".";
    var t_reqLlwG = "This option requires \"Load logs with GClh\".";
    var t_reqSVl = "This option requires \"Show VIP list\".";
    var t_reqMDTc = "This option requires \"Mark D/T combinations for your next possible cache matrix\".";
    var t_reqChlSLoT = "This option requires \"Change header layout\" and \"Show Linklist on top\".";
    var t_reqSLoT = "This option requires \"Show Linklist on top\".";
    var prem = " <img class='gclh_prem' title='The underlying feature of GC is a premium feature.' src='" + global_premium_icon + "'> ";
    var dt_display = [ ["greater than or equal to",">="], ["equal to","="], ["less than or equal to","<="] ];
    var dt_score = [ ["1","1"], ["1.5","1.5"], ["2","2"], ["2.5","2.5"], ["3","3"], ["3.5","3.5"], ["4","4"], ["4.5","4.5"], ["5","5"] ];

    function gclh_createSelectOptionCode(id, data, selectedValue) {
        var html = "";
        html += '<select class="gclh_form" id="'+id+'">';
        for (var i = 0; i < data.length; i++) {
            html += "  <option value='" + data[i][1] + "' " + (selectedValue == data[i][1] ? "selected='selected'" : "") + "> " + data[i][0] + "</option>";
        }
        html += '</select>';
        return html;
    }

// Configuration Menü.
    function gclh_showConfig() {
        btnClose(false);
        if (checkTaskAllowed("GClh Config", true) == false) return;
        window.scroll(0, 0);

        if (document.getElementById('bg_shadow')) {
            if (document.getElementById('bg_shadow').style.display == "none") document.getElementById('bg_shadow').style.display = "";
        } else buildBgShadow();
        // Hauptbereiche im Config gegebenenfalls hideable machen.
        if (settings_make_config_main_areas_hideable && !document.location.href.match(/#a#/i)) {
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
            html += "<a href='http://geoclub.de/forum/viewforum.php?f=117' title='Help is available on the Geoclub forum' target='_blank'>Help</a> | ";
            html += "<a href='https://github.com/2Abendsegler/GClh/issues?q=is:issue is:open sort:created-desc' title='Show open issues on GitHub' target='_blank'>Open issues</a> | ";
            html += "<a href='https://github.com/2Abendsegler/GClh/blob/master/docu/changelog.md#readme' title='Documentation of changes and new features in GClh II on GitHub' target='_blank'>Changelog</a> | ";
            html += "<a id='check_for_upgrade' href='#' style='cursor: pointer' title='Check for upgrade GClh II'>Check for upgrade</a> | ";
            html += "<a href='https://github.com/2Abendsegler/GClh/tree/master' title='Development plattform and issue system of GClh II' target='_blank'>GitHub</a> | ";
            html += "<a id='rc_link' href='#' style='cursor: pointer' title='Reset some configuration data'>Reset</a></font>";
            html += "</div>";

            html += "<div id='gclh_config_content2'>";
            html += "<div id='rc_area' class='gclh_rc_area'>";
            html += "<input type='radio' name='rc' id='rc_standard' class='gclh_rc'><label for='rc_standard'>Reset to standard configuration</label>" + show_help_rc("This option should help you to come back to an efficient configuration set, after some experimental or other motivated changes. This option load a reasonable standard configuration and overwrite your configuration data in parts. <br><br>The following data are not overwrited: Home coords; Homezone circle and multi Homezone circles; date format; log templates; cache log, TB log and other signatures; friends data; links in Linklist and differing description and custom links. <br>Dynamic data, like for example autovisits for named trackables, are not overwrited too.<br><br>After reset, choose button \"close\" and go to Config to skim over the set of data.") + "<br>";
            html += "<input type='radio' name='rc' checked='checked' id='rc_temp' class='gclh_rc'><label for='rc_temp'>Reset dynamic and unused data</label>" + show_help_rc("This option reorganize the configuration set. Unused parameters of older script versions are deleted. And the dynamic data like the autovisit settings for every TB, the seen friends data of founds and hides and the DropBox token are deleted too. Especially the VIPs, VUPs and Linklist settings are not deleted of course.<br><br>After reset, choose button \"close\".") + "<br><br>";
            html += "<input type='radio' name='rc' id='rc_homecoords' class='gclh_rc'><label for='rc_homecoords'>Reset your own home coords</label>" + show_help_rc("This option could help you with problems around your home coords, like for example with your main Homezone, with nearest lists or with your home coords itself. Your home coords are not deleted at GC, but only in GClh. <br><br>After reset, you have to go to the account settings page of GC to the area \"Home Location\", so that GClh can save your home coords again automatically. You have only to go to this page, you have nothing to do at this page, GClh save your home coords automatically. <br>Or you enter your home coords manually in GClh. <br><br>At last, choose button \"close\".");
            html += "<font class='gclh_small'> (After reset, go to <a href='https://www.geocaching.com/account/settings/homelocation' target='_blank'>Home Location</a> )</font>" + "<br>";
            html += "<input type='radio' name='rc' id='rc_uid' class='gclh_rc'><label for='rc_uid'>Reset your own id for your trackables</label>" + show_help_rc("This option could help you with problems with your own trackables lists, which based on an special id, the uid. The uid are not deleted at GC, but only in GClh. <br><br>After reset, you have to go to your dashboard, so that GClh can save your uid again automatically. You have only to go to this page, you have nothing to do at this page, GClh save the uid automatically. <br><br>At last, choose button \"close\".");
            html += "<font class='gclh_small'> (After reset, go to <a href='https://www.geocaching.com/my/' target='_blank'>Dashboard</a> )</font>" + "<br><br>";
            html += "<div class='gclh_rc_area_button'>";
            html += "<img id='rc_doing' src='' title='' alt='' style='margin-top: 4px; margin-left: -25px; position: absolute;' /><input class='gclh_rc_form' type='button' value='reset' id='rc_reset_button'> <input style='cursor: pointer;' class='gclh_rc_form' type='button' value='close' id='rc_close_button'>";
            html += "</div>";
            html += "<pre class='gclh_form' style='display: block; height: 220px; overflow: auto; margin-bottom: 0px; font-size: 12px;' type='text' value='' id='rc_configData' contenteditable='true'></pre>";
            html += "</div>";
            html += "</div>";

            html += "<div id='gclh_config_content3'>";
            html += "<br>";
            html += "<h4 class='gclh_headline2'>"+prepareHideable.replace("#name#","global")+"Global</h4>";
            html += "<div id='gclh_config_global' class='gclh_block'>";
            html += "<label for='settings_home_lat_lng'>&nbsp;Home coords: </label><input class='gclh_form' type='text' size='25' id='settings_home_lat_lng' value='" + DectoDeg(getValue("home_lat"), getValue("home_lng")) + "'>" + show_help("The home coords are filled automatically if you update your home coords on GC page. If it doesn\'t work you can insert them here. These coords are used for some special links (nearest list, nearest map, ...) and for the main Homezone circle on the map.") + "<br>";
            html += checkboxy('settings_set_default_langu', 'Set default language ');
            html += "<select class='gclh_form' id='settings_default_langu'>";
            for (var i = 0; i < langus.length; i++) {
                html += "  <option value='" + langus[i] + "' " + (settings_default_langu == langus[i] ? "selected='selected'" : "") + "> " + langus[i] + "</option>";
            }
            html += "</select>" + show_help("Here you can change the default language to set on GC pages, in the case, apps changed the language.<br><br>In distant, very very distant future is planned to make the GClh multilingual. Until that is realized, the GClh is only in english.") + "<br>";
            html += checkboxy('settings_change_header_layout', "Change header layout") + show_help("This option redesines the header layout on GC pages to save some vertical space.") + "<br>";
            html += " &nbsp; " + checkboxy('settings_show_smaller_gc_link', 'Show smaller GC logo top left') + show_help("With this option you can choose a smaller display of the GC logo top left on GC pages.<br><br>" + t_reqChl) + "<br>";
            html += " &nbsp; &nbsp; " + checkboxy('settings_remove_logo', 'Remove GC logo top left') + show_help_big("With this option you can remove the GC logo top left on GC pages.<br><br>This feature is not fully integrated in the diverse possibilities of the header layout and the navigation menus.<br><br>This option require \"Change header layout\" and \"Show smaller GC logo top left\".") + "<br>";
            html += " &nbsp; " + checkboxy('settings_remove_message_in_header', 'Remove message center icon top right') + show_help_big("With this option you can remove the message center icon top right on GC pages. You will not be informed longer about new messages.<br><br>" + t_reqChl) + "<br>";
            html += " &nbsp; " + checkboxy('settings_gc_tour_is_working', 'Reserve a place for GC Tour icon') + show_help("If the script GC Tour is running, you can reserve a place top left on GC pages for the GC Tour icon.<br><br>" + t_reqChl) + "<br>";
            html += " &nbsp; " + checkboxy('settings_fixed_header_layout', 'Arrange header layout on content') + show_help_big("With this option you can arrange the header width on the width of the content of GC pages. This is an easy feature with some restrictions, like for example the available place, especially for horizontal navigation menues.<br><br>This feature is available on GC pages in the oldest design like for example cache and TB listings, bookmarks, pocket queries, nearest lists, old dashboards (profiles), statistics, watchlists and drafts, to name just a few. <br><br>On map page and on pages in the newer and newest design it is not available, partly because the content on these pages are not yet in an accurate width, like the newer search cache page or the message center page. Also this feature is not fully integrated in the diverse possibilities of the header layout and the navigation menus. But we hope the friends of this specific header design can deal with it.<br><br>" + t_reqChl) + "<br>";
			html += checkboxy('settings_bookmarks_on_top', "Show <a class='gclh_ref' href='#gclh_linklist' title='Link to topic \"Linklist / Navigation\"' id='gclh_linklist_link_1'>Linklist</a> on top") + show_help_big("Show the Linklist on the top of GC pages, beside the other links. You can configure the links in the Linklist at the end of this configuration page.<br><br>Some of the features of the Linklist on top, like for example the font size or the distance between drop-down links, requires \"Change header layout\". Details you can see at the end of this configuration page by the features of the Linklist.") + "<br>";
            html += checkboxy('settings_hide_advert_link', 'Hide link to advertisement instructions') + "<br>";
            html += "&nbsp;" + "Page width: <input class='gclh_form' type='text' size='2' id='settings_new_width' value='" + getValue("settings_new_width", 1000) + "'> px" + show_help("With this option you can expand the small layout on GC pages. The default value on GC pages is 950 pixel.") + "<br>";
            html += checkboxy('settings_hide_facebook', 'Hide Facebook login') + "<br>";
            html += checkboxy('settings_hide_socialshare', 'Hide social sharing Facebook and Twitter') + "<br/>";
            html += checkboxy('settings_hide_warning_message', 'Hide warning message') + show_help_big("With this option you can choose the possibility to hide a potential warning message of the masters of the GC pages.<br><br>One example is the down time warning message which comes from time to time and is placed unnecessarily a lot of days at the top of pages. You can hide it except for a small line in the top right side of the pages. You can activate the warning message again if your mouse goes to this area.<br><br>If the warning message is deleted of the masters, this small area is deleted too.") + "<br>";
            html += newParameterOn2;
            html += checkboxy('settings_remove_banner', 'Remove banner') + "<br>";
            html += " &nbsp; " + checkboxy('settings_remove_banner_for_garminexpress', 'for \"Garmin Express\"') + "<br>";
            html += " &nbsp; " + checkboxy('settings_remove_banner_blue', 'Try to remove all blue banner to new designed pages') + "<br>";
            html += newParameterVersionSetzen(0.8) + newParameterOff;
            html += "<table style='width: 550px; text-align: left; margin-top: 9px;'>";
            html += "  <thead>";
            html += "    <tr><th><span>Show lines in</span></th>";
            html += "      <th><span>lists </span>" + show_help("Lists are all common lists but not the TB listing and not the cache listing.") + "</th>";
            html += "      <th><span>cache listings</span>" + show_help(t_reqLlwG) + "</th>";
            html += "      <th><span>TB listings</span></th>";
            html += "      <th><span>in color</span></th></tr>";
            html += "  </thead>";
            html += "  <tbody>";
            html += "    <tr><td><span>for zebra:</span>" + show_help2("With this options you can color every second line in the specified lists in the specified \"alternating\" color.") + "</td>";
            html += "      <td><input type='checkbox'" + (getValue('settings_show_common_lists_in_zebra') ? "checked='checked'" : "" ) + " id='settings_show_common_lists_in_zebra'></td>";
            html += "      <td><input type='checkbox'" + (getValue('settings_show_cache_listings_in_zebra') ? "checked='checked'" : "" ) + " id='settings_show_cache_listings_in_zebra'></td>";
            html += "      <td><input type='checkbox'" + (getValue('settings_show_tb_listings_in_zebra') ? "checked='checked'" : "" ) + " id='settings_show_tb_listings_in_zebra'></td>";
            html += "      <td><input class='gclh_form color' type='text' size=5 id='settings_lines_color_zebra' value='" + getValue("settings_lines_color_zebra", "EBECED") + "'><img src=" + global_restore_icon + " id='restore_settings_lines_color_zebra' title='back to default' style='width: 12px; cursor: pointer;'></td></tr>";
            html += "    <tr><td><span>for you:</span>" + show_help2("With this options you can color your logs respectively your founds in the specified lists in the specified color.") + "</td>";
            html += "      <td><input type='checkbox'" + (getValue('settings_show_common_lists_color_user') ? "checked='checked'" : "" ) + " id='settings_show_common_lists_color_user'></td>";
            html += "      <td><input type='checkbox'" + (getValue('settings_show_cache_listings_color_user') ? "checked='checked'" : "" ) + " id='settings_show_cache_listings_color_user'></td>";
            html += "      <td><input type='checkbox'" + (getValue('settings_show_tb_listings_color_user') ? "checked='checked'" : "" ) + " id='settings_show_tb_listings_color_user'></td>";
            html += "      <td><input class='gclh_form color' type='text' size=5 id='settings_lines_color_user' value='" + getValue("settings_lines_color_user", "C2E0C3") + "'><img src=" + global_restore_icon + " id='restore_settings_lines_color_user' title='back to default' style='width: 12px; cursor: pointer;'></td></tr>";
            html += "    <tr><td><span>for owners:</span></td><td></td>";
            html += "      <td><input type='checkbox'" + (getValue('settings_show_cache_listings_color_owner') ? "checked='checked'" : "" ) + " id='settings_show_cache_listings_color_owner'></td>";
            html += "      <td><input type='checkbox'" + (getValue('settings_show_tb_listings_color_owner') ? "checked='checked'" : "" ) + " id='settings_show_tb_listings_color_owner'></td>";
            html += "      <td><input class='gclh_form color' type='text' size=5 id='settings_lines_color_owner' value='" + getValue("settings_lines_color_owner", "E0E0C3") + "'><img src=" + global_restore_icon + " id='restore_settings_lines_color_owner' title='back to default' style='width: 12px; cursor: pointer;'></td></tr>";
            html += "    <tr><td><span>for reviewers:</span></td><td></td>";
            html += "      <td><input type='checkbox'" + (getValue('settings_show_cache_listings_color_reviewer') ? "checked='checked'" : "" ) + " id='settings_show_cache_listings_color_reviewer'></td>";
            html += "      <td><input type='checkbox'" + (getValue('settings_show_tb_listings_color_reviewer') ? "checked='checked'" : "" ) + " id='settings_show_tb_listings_color_reviewer'></td>";
            html += "      <td><input class='gclh_form color' type='text' size=5 id='settings_lines_color_reviewer' value='" + getValue("settings_lines_color_reviewer", "EAD0C3") + "'><img src=" + global_restore_icon + " id='restore_settings_lines_color_reviewer' title='back to default' style='width: 12px; cursor: pointer;'></td></tr>";
            html += "    <tr><td><span>for VIPs:</span></td><td></td>";
            html += "      <td><input type='checkbox'" + (getValue('settings_show_cache_listings_color_vip') ? "checked='checked'" : "" ) + " id='settings_show_cache_listings_color_vip'></td>";
            html += "      <td><input type='checkbox'" + (getValue('settings_show_tb_listings_color_vip') ? "checked='checked'" : "" ) + " id='settings_show_tb_listings_color_vip'></td>";
            html += "      <td><input class='gclh_form color' type='text' size=5 id='settings_lines_color_vip' value='" + getValue("settings_lines_color_vip", "F0F0A0") + "'><img src=" + global_restore_icon + " id='restore_settings_lines_color_vip' title='back to default' style='width: 12px; cursor: pointer;'></td></tr>";
            html += "  </tbody>";
            html += "</table>";
            html += "</div>";

            html += "<h4 class='gclh_headline2' title='this page'>"+prepareHideable.replace("#name#","config")+"GClh Config / Sync</h4>";
            html += "<div id='gclh_config_config' class='gclh_block'>";
            html += checkboxy('settings_f4_call_gclh_config', 'Call GClh Config on F4') + show_help("With this option you are able to call the GClh Config page (this page) by pressing key F4 from all GC pages.") + "<br>";
            html += checkboxy('settings_f2_save_gclh_config', 'Save GClh Config on F2') + show_help("With this option you are able to save the GClh Config page (this page) by pressing key F2 instead of scrolling to the bottom and choose the save button.") + "<br>";
            html += newParameterOn2;
            html += checkboxy('settings_esc_close_gclh_config', 'Close GClh Config on ESC') + show_help("With this option you are able to close the GClh Config page (this page) by pressing ESC.") + "<br>";
            html += newParameterVersionSetzen(0.8) + newParameterOff;
            html += checkboxy('settings_f10_call_gclh_sync', 'Call GClh Sync on F10') + show_help("With this option you are able to call the GClh Sync page by pressing key F10.") + "<br>";
            html += checkboxy('settings_sync_autoImport', 'Auto apply DB Sync') + show_help("If you enable this option, settings from DropBox will be applied automatically about GClh Sync every 10 hours.") + "<br>";
            html += checkboxy('settings_show_save_message', 'Show info message if GClh data are saved') + show_help("With this option an info message is displayed if the GClh Config data are saved respectively if the GClh Sync data are imported.") + "<br>";
            html += checkboxy('settings_sort_default_bookmarks', 'Sort default links for the Linklist') + show_help("With this option you can sort the default links for the Linklist by description. You can configure these default links to use in your Linklist at the end of this configuration page.<br><br>A change at this option evolute its effect only after a save.") + "<br>";
            html += checkboxy('settings_hide_colored_versions', 'Hide colored illustration of versions') + show_help("With this option the colored illustration of the versions and the version numbers in GClh Config (this page) are selectable.<br><br>A change at this option evolute its effect only after a save.") + "<br>";
            html += checkboxy('settings_make_config_main_areas_hideable', 'Make main areas in GClh Config hideable') + show_help("With this option you can hide and show the main areas in GClh Config (this page) with a left mouse click. With a right mouse click you can hide and show all the main areas in GClh Config together.<br><br>A change at this option evolute its effect only after a save.") + "<br>";
            html += "</div>";

            html += "<h4 class='gclh_headline2'>"+prepareHideable.replace("#name#","nearestlist")+"Nearest list</h4>";
            html += "<div id='gclh_config_nearestlist' class='gclh_block'>";
            html += checkboxy('settings_redirect_to_map', 'Redirect cache search lists to map display') + show_help("If you enable this option, you will be automatically redirected from the older cache search lists (nearest lists) to map display. This is only possible in search lists with a link to the map display.<br><br>Please note that a display of the search list is no longer possible, because it is always redirected to the map display.") + "<br>";
            html += checkboxy('settings_show_nearestuser_profil_link', 'Show profile link at search lists for caches created or found by') + show_help("This option adds an link to the public user profile when searching for caches created or found by a certain user.") + "<br>";
            var content_settings_show_log_it = checkboxy('settings_show_log_it', 'Show GClh \"Log it\" icon on nearest lists, PQs, recently viewed caches list') + show_help3("The GClh \"Log it\" icon is displayed beside cache titles in nearest lists, pocket queries and the recently viewed caches list. If you click it, you will be redirected directly to the log form. <br><br>You can use it too as basic member to log Premium Member Only (PMO) caches.") + "<br>";
            html += content_settings_show_log_it;
            html += newParameterOn2;
            html += checkboxy('settings_compact_layout_nearest', 'Show compact layout in all nearest lists (without PQ)') + show_help("For pocket queries, please go to the section \"Pocket query\", there is a special parameter for pocket queries.") + "<br>";
            html += newParameterVersionSetzen(0.8) + newParameterOff;
            html += "</div>";

            html += "<h4 class='gclh_headline2'>"+prepareHideable.replace("#name#","pq")+"Pocket query" + prem + "</h4>";
            html += "<div id='gclh_config_pq' class='gclh_block'>";
            html += checkboxy('settings_fixed_pq_header', 'Show fixed header in list of pocket queries') + show_help("With this option the header in list of pocket queries is fixed and the list of pocket queries can be scrolled.<br><br>This option evolute its effect not with the compact layout in list of pocket queries.") + "<br>"
            html += content_settings_show_log_it.replace("show_log_it","show_log_itX0");
            var content_settings_submit_log_button = checkboxy('settings_submit_log_button', 'Submit log, pocket query, bookmark or hide cache on F2') + show_help("With this option you are able to submit your log by pressing key F2 instead of scrolling to the bottom and move the mouse to the button. <br><br>This feature also works to submit pocket queries and bookmarks. <br><br>And it works on the whole hide cache process with all of the buttons of the create and the change functionality.") + "<br>";
            html += content_settings_submit_log_button;
            html += newParameterOn2;
            html += checkboxy('settings_compact_layout_list_of_pqs', 'Show compact layout in list of pocket queries') + "<br>";
            html += checkboxy('settings_compact_layout_pqs', 'Show compact layout in pocket queries') + "<br>";
            html += newParameterVersionSetzen(0.8) + newParameterOff;
            html += checkboxy('settings_pq_warning', "Get a warning in case of empty pocket queries") + show_help("Show a message if one or more options are in conflict. This helps to avoid empty pocket queries.") + "<br>";
            html += "<div style='margin-top: 9px; margin-left: 5px'><b>Default values for new pocket query</b></div>";
            html += checkboxy('settings_pq_set_cachestotal', "Set number of caches to ") + "<input class='gclh_form' size=3 type='text' id='settings_pq_cachestotal' value='" + settings_pq_cachestotal + "'><br>";
            html += checkboxy('settings_pq_option_ihaventfound', "Enable option \"I haven't found\"") + "<br>";
            html += checkboxy('settings_pq_option_idontown', "Enable option \"I don't own\"") + "<br>";
            html += checkboxy('settings_pq_option_ignorelist', "Enable option \"Are not on my ignore list\"") + "<br>";
            html += checkboxy('settings_pq_option_isenabled', "Enable option \"Is Enabled\"") + "<br>";
            html += checkboxy('settings_pq_option_filename', "Enable option \"Include pocket query name in download file name\"") + "<br>";
            html += checkboxy('settings_pq_set_difficulty', "Set difficulity ") + gclh_createSelectOptionCode("settings_pq_difficulty", dt_display, settings_pq_difficulty) + '&nbsp;' + gclh_createSelectOptionCode("settings_pq_difficulty_score", dt_score, settings_pq_difficulty_score) + "<br>";
            html += checkboxy('settings_pq_set_terrain', "Set terrain ") + gclh_createSelectOptionCode("settings_pq_terrain", dt_display, settings_pq_terrain) + '&nbsp;' + gclh_createSelectOptionCode("settings_pq_terrain_score", dt_score, settings_pq_terrain_score) + "<br>";
            html += checkboxy('settings_pq_automatically_day', "Generate pocket query today") + show_help("Use the server time to set the week day for creation.") + "<br>";
            html += "</div>";

            html += "<h4 class='gclh_headline2'>"+prepareHideable.replace("#name#","bm")+"Bookmark list" + prem + "</h4>";
            html += "<div id='gclh_config_bm' class='gclh_block'>";
            html += checkboxy('settings_show_sums_in_bookmark_lists', 'Show number of caches in bookmark lists') + show_help("With this option the number of caches and the number of selected caches in the categories \"All\", \"Found\", \"Archived\" and \"Deactivated\", corresponding to the select buttons, are shown in bookmark lists at the end of the list.") + "<br>";
            html += content_settings_submit_log_button.replace("log_button","log_buttonX0");
            html += newParameterOn2;
            html += checkboxy('settings_compact_layout_list_of_bm_lists', 'Show compact layout in list of bookmark lists') + "<br>";
            html += checkboxy('settings_compact_layout_bm_lists', 'Show compact layout in bookmark lists') + "<br>";
            html += newParameterVersionSetzen(0.8) + newParameterOff;
            html += newParameterOn3;
            html += checkboxy('settings_bm_changed_and_go', 'After bookmark change go to bookmark list automatically') + show_help("With this option you can switch to the bookmark list automatically after a change of a bookmark. The confirmation page of this change will skip.") + "<br>";
            html += newParameterVersionSetzen(0.9) + newParameterOff;
            html += "</div>";

            html += "<h4 class='gclh_headline2'>"+prepareHideable.replace("#name#","recview")+"Recently viewed caches list" + "</h4>";
            html += "<div id='gclh_config_recview' class='gclh_block'>";
            html += newParameterOn3;
            html += content_settings_show_log_it.replace("show_log_it","show_log_itX1");
            html += checkboxy('settings_compact_layout_recviewed', 'Show compact layout in your recently viewed caches list') + "<br>";
            html += newParameterVersionSetzen(0.9) + newParameterOff;
            html += "</div>";

            html += "<h4 class='gclh_headline2'>"+prepareHideable.replace("#name#","friends")+"Friends list" + "</h4>";
            html += "<div id='gclh_config_friends' class='gclh_block'>";
            html += checkboxy('settings_automatic_friend_reset', 'Reset difference counter on friends list automatically') + show_help("If you enable this option, the difference counter at friends list will automatically reset if you have seen the difference and if the day changed.") + "<br>";
            html += checkboxy('settings_friendlist_summary', 'Show summary for new finds/hides in friends list') + show_help("With this option you can show a summary of all new finds/hides of your friends on the friends list page") + "<br>";
            html += " &nbsp; " + checkboxy('settings_friendlist_summary_viponly', 'Show summary only for friends in VIP list') + show_help("With this option you can choose to show the summary only for friends who are also marked as VIP.") + "<br>";
            html += checkboxy('settings_show_vup_friends', 'Show VUP icons on friends list') + show_help_big("With this option you can choose if VUP icons are shown addional on friends list or not. If you deactivate this option and a friend is a VUP, then the VIP icon is replaced by the VUP icon anyway.<br>(VUP: Very unimportant person)<br>(VIP: Very important person)<br><br>This option requires \"Process VUPs\" and \"Show VIP list\".") + "<br>";
            html += "</div>";

            html += "<h4 class='gclh_headline2'>"+prepareHideable.replace("#name#","hide")+"Hide cache" + "</h4>";
            html += "<div id='gclh_config_hide' class='gclh_block'>";
            html += checkboxy('settings_hide_cache_approvals', 'Auto set approval in hide cache process') + show_help("This option activates the checkbox for approval the \"terms of use agreement\" and the \"geocache hiding guidelines\" in the hide cache process.") + "<br>";
            html += content_settings_submit_log_button.replace("log_button","log_buttonX1");
            html += "</div>";


            html += "<h4 class='gclh_headline2'>"+prepareHideable.replace("#name#","others")+"Others" + "</h4>";
            html += "<div id='gclh_config_others' class='gclh_block'>";
            html += checkboxy('settings_search_enable_user_defined', 'Enable user defined filter sets for geocache searchs') + show_help("This features enables you to store favourites filter settings in the geocache search and call them quickly.") + prem + "<br>";
            html += checkboxy('settings_show_sums_in_watchlist', 'Show number of caches in your watchlist') + show_help("With this option the number of caches and the number of selected caches in the categories \"All\", \"Archived\" and \"Deactivated\", corresponding to the select buttons, are shown in your watchlist at the end of the list.") + "<br>";
            html += checkboxy('settings_hide_archived_in_owned', 'Hide archived caches in owned list') + "<br>";
            html += "</div>";

            html += "<h4 class='gclh_headline2'>"+prepareHideable.replace("#name#","maps")+"Map</h4>";
            html += "<div id='gclh_config_maps' class='gclh_block'>";
            html += "<div style='margin-left: 5px'><b>Homezone circels</b></div>";
            html += checkboxy('settings_show_homezone', 'Show Homezone circles') + show_help("This option allows to draw Homezone circles around coordinates on the map.") + "<br>";
            html += "<div id='ShowHomezoneCircles' style='display: " + (settings_show_homezone ? "block":"none") + ";'>";
            html += "<table class='multi_homezone_settings'>";
            html += "  <thead><tr>";
            html += "      <th><span>Radius</span>" + show_help2("Here you can specify the radius in kilometers of your Homezone circles.") + "</th>";
            html += "      <th><span>Color</span>" + show_help("Here you can specify the color of your Homezone circles.<br>Default is \"0000FF\".") + "</th>";
            html += "      <th><span>Opacity</span>" + show_help("Here you can specify the opacity in percent of your Homezone circles. Higher number, darker.<br>Default is \"10\".") + "</th>";
            html += "      <th><span>Coordinates</span>" + show_help("Here you can specify the coordinates of the midpoint of your Homezone circles.") + "</th>";
            html += "      <th><span></span></th>";
            html += "  </tr></thead>";
            html += "  <tbody>";
            // Template.
            var hztp = "<tr class='multi_homezone_element'>";
            hztp += "      <td><input class='gclh_form radius' type='text' size='1' value='" + settings_homezone_radius + "'><span> km</span></td>";
            hztp += "      <td><input class='gclh_form color' type='text' size='5' value='" + settings_homezone_color + "'></td>";
            hztp += "      <td><input class='gclh_form opacity' type='text' size='1' value='" + settings_homezone_opacity + "'><span> %</span></td>";
            hztp += "      <td><input class='gclh_form coords' type='text' size='25' value='" + DectoDeg(getValue("home_lat"), getValue("home_lng")) + "'></td>";
            hztp += "      <td><img title ='Delete Homezone circle' class='remove' src='" + global_del_it_icon + "'/></td></tr>";
            // Homezone circle.
            var newHzEl = $('<tr>').append($(hztp));
            newHzEl.find('tr').attr('class', 'homezone_element');
            newHzEl.find('.radius').attr('id', 'settings_homezone_radius');
            newHzEl.find('.color').attr('id', 'settings_homezone_color');
            newHzEl.find('.opacity').attr('id', 'settings_homezone_opacity');
            newHzEl.find('.coords').attr('disabled', '');
            newHzEl.find('.coords').attr('class', 'gclh_form coords disabled');
            newHzEl.find('.remove').attr('title', '');
            newHzEl.find('.remove').attr('disabled', '');
            newHzEl.find('.remove').attr('class', 'remove disabled');
            html += newHzEl.html();
            // Multi Homezone circles.
            for (var i in settings_multi_homezone) {
                var hzel = settings_multi_homezone[i];
                var newHzEl = $('<tr>').append($(hztp));
                newHzEl.find('.radius').attr('value', hzel.radius);
                newHzEl.find('.color').attr('value', hzel.color);
                newHzEl.find('.opacity').attr('value', hzel.opacity);
                newHzEl.find('.coords').attr('value', DectoDeg(hzel.lat, hzel.lng));
                html += newHzEl.html();
            }
            html += "  </tbody>";
            html += "  <tfoot><tr><td colspan='5'><button type='button' class='gclh_form addentry' title='Create further Homezone circle'>create</button></td></tr></tfoot>";
            html += "</table></div>";

            html += "<div style='margin-top: 9px; margin-left: 5px'><b>Hide map elements</b></div>";
            html += checkboxy('settings_map_hide_sidebar', 'Hide sidebar by default') + show_help("If you want to hide the sidebar on the map, just select this option.") + "<br>";
            html += checkboxy('settings_hide_map_header', 'Hide header by default') + show_help("If you want to hide the header of the map, just select this option.") + "<br>";
            html += checkboxy('settings_map_hide_found', 'Hide found caches by default') + show_help("It enables automatically the option to hide your found caches on map.") + prem + "<br>";
            html += checkboxy('settings_map_hide_hidden', 'Hide own caches by default') + show_help("It enables automatically the option to hide your caches on map.") + prem + "<br>";
            html += "&nbsp;" + "Hide cache types by default: " + show_help("It enables automatically the option to hide the specific cache type.") + prem + "<br>";

            var imgStyle = "style='padding-top: 4px; vertical-align: bottom;'";
            var imageBaseUrl = http + "://www.geocaching.com/map/images/mapicons/";
            html += " &nbsp; " + checkboxy('settings_map_hide_2', "<img "+imgStyle+" src='" + imageBaseUrl + "2.png' title='Traditional'>") + "<br>";
            html += " &nbsp; " + checkboxy('settings_map_hide_3', "<img "+imgStyle+" src='"  + imageBaseUrl + "3.png' title='Multi-Cache'>") + "<br>";
            html += " &nbsp; " + checkboxy('settings_map_hide_6', "<img "+imgStyle+" src='" + imageBaseUrl + "6.png' title='Event'>");
            html += " &nbsp; " + checkboxy('settings_map_hide_13', "<img "+imgStyle+" src='" + imageBaseUrl + "13.png' title='Cache In Trash Out'>");
            html += " &nbsp; " + checkboxy('settings_map_hide_453', "<img "+imgStyle+" src='" + imageBaseUrl + "453.png' title='Mega-Event'>");
            html += " &nbsp; " + checkboxy('settings_map_hide_7005', "<img "+imgStyle+" src='" + imageBaseUrl + "7005.png' title='Giga-Event'>") + "<br>";
            html += " &nbsp; " + checkboxy('settings_map_hide_137', "<img "+imgStyle+" src='" + imageBaseUrl + "137.png' title='EarthCache'>");
            html += " &nbsp; " + checkboxy('settings_map_hide_4', "<img "+imgStyle+" src='" + imageBaseUrl + "4.png' title='Virtual'>");
            html += " &nbsp; " + checkboxy('settings_map_hide_11', "<img "+imgStyle+" src='" + imageBaseUrl + "11.png' title='Webcam'>") + "<br>";
            html += " &nbsp; " + checkboxy('settings_map_hide_8', "<img "+imgStyle+" src='" + imageBaseUrl + "8.png' title='Mystery'>");
            html += " &nbsp; " + checkboxy('settings_map_hide_5', "<img "+imgStyle+" src='" + imageBaseUrl + "5.png' title='Letterbox'>");
            html += " &nbsp; " + checkboxy('settings_map_hide_1858', "<img "+imgStyle+" src='" + imageBaseUrl + "1858.png' title='Wherigo'>") + "<br>";

            html += "<div style='margin-top: 9px; margin-left: 5px'><b>Layers in map</b>" + show_help("Here you can select the map layers which should be added into the layer menu with the map. With this option you can reduce the long list to the layers you really need. If the right list of layers is empty, all will be displayed. If you use other scripts like \"Geocaching Map Enhancements\" GClh will overwrite its layercontrol. With this option you can disable GClh layers to use the layers for example from GC or GME.") + "</div>";
            html += checkboxy('settings_use_gclh_layercontrol', 'Replace layers by GClh') + show_help_big("GClh will replace the layers. With this option you can disable this replacement to use the layers from GC or other scripts like GME (Geocaching Map Enhancements). But you can use too the layers of GClh together with the functionality of GME.<br><br>It is important, that GClh run at first, particularly in front of other layer used scripts like GME or GCVote.<br><br>If there are problems with the layers by using GCVote at once, you have to clear the local storage of GCVote. You can do it about your dashboard. If that does not help, deinstall and install GCVote again. (GCVote use a local storage for its data. This storage can include incomplete layers which influence the layer control.)") + "<br>";
            html += "<div id='MapLayersConfiguration' style='display: " + (settings_use_gclh_layercontrol ? "block":"none") + ";'>";
            html += "<table cellspacing='0' cellpadding='0' border='0'><tbody>";
            html += "<tr>";
            html += "<td><select class='gclh_form' style='width: 250px;' id='settings_maplayers_unavailable' multiple='single' size='7'></select></td>";
            html += "<td><input style='padding-left: 2px; padding-right: 2px; cursor: pointer;' class='gclh_form' type='button' value='>' id='btn_map_layer_right'><br><br><input style='padding-left: 2px; padding-right: 2px; cursor: pointer;' class='gclh_form' type='button' value='<' id='btn_map_layer_left'></td>";
            html += "<td><select class='gclh_form' style='width: 250px;' id='settings_maplayers_available' multiple='single' size='7'></select></td>";
            html += "</tr>";
            html += "<tr><td colspan='3'>Default layer: <code><span id='settings_mapdefault_layer'>" + (settings_map_default_layer ? settings_map_default_layer:"<i>not available</i>") +"</span></code>";
            html += "&nbsp;" + show_help("Here you can select the map source you want to use as default in the map. Mark a layer from the right list and push the button \"Set default layer\".");
            html += "<span style='float: right; margin-top: 0px;' ><input class='gclh_form' type='button' value='Set default layer' id='btn_set_default_layer'></span><br><span style='margin-left: -4px'></span>";
            html += checkboxy('settings_show_hillshadow', 'Show Hillshadow by default') + show_help("If you want 3D-like-Shadow to be displayed by default, activate this function.") + "<br>";
            html += "</td></tr>";
            html += "</tbody></table></div>";
            html += "<div style='margin-top: 9px; margin-left: 5px'><b>Google Maps page</b></div>";
            html += checkboxy('settings_hide_left_sidebar_on_google_maps', 'Hide left sidebar on Google Maps by default') + show_help("With this option you can blended out the left sidebar on the Google Maps page.") + "<br>";
            html += checkboxy('settings_add_link_gc_map_on_google_maps', 'Add link to GC Map on Google Maps') + show_help("With this option an icon are placed on the Google Maps page to link to the same area in GC Map.") + "<br>";
            html += " &nbsp; " + checkboxy('settings_switch_to_gc_map_in_same_tab', 'Switch to GC Map in same browser tab') + show_help("With this option you can switch from Google Maps to GC Map in the same browser tab.<br><br>This option requires \"Add link to GC Map on Google Maps\".") + "<br>";
            html += checkboxy('settings_add_link_google_maps_on_gc_map', 'Add link to Google Maps on GC Map') + show_help("With this option an icon are placed on the GC Map page to link to the same area in Google Maps.") + "<br>";
            html += " &nbsp; " + checkboxy('settings_switch_to_google_maps_in_same_tab', 'Switch to Google Maps in same browser tab') + show_help("With this option you can switch from GC Map to Google Maps in the same browser tab.<br><br>This option requires \"Add link to Google Maps on GC Map\".") + "<br>";
            html += "<div style='margin-top: 9px; margin-left: 5px'><b>Openstreetmap page</b></div>";
            html += checkboxy('settings_add_link_gc_map_on_osm', 'Add link to GC Map on Openstreetmap') + show_help("With this option an icon are placed on the OpenstreetMap page to link to the same area in GC Map.") + "<br>";
            html += " &nbsp; " + checkboxy('settings_switch_from_osm_to_gc_map_in_same_tab', 'Switch to GC Map in same browser tab') + show_help("With this option you can switch from Openstreetmap to GC Map in the same browser tab.<br><br>This option requires \"Add link to GC Map on OpenstreetMap\".") + "<br>";
            html += checkboxy('settings_add_link_osm_on_gc_map', 'Add link to Openstreetmap on GC Map') + show_help("With this option an icon are placed on the GC Map page to link to the same area in Openstreetmap.") + "<br>";
            html += " &nbsp; " + checkboxy('settings_switch_to_osm_in_same_tab', 'Switch to Openstreetmap in same browser tab') + show_help("With this option you can switch from GC Map to Openstreetmap in the same browser tab.<br><br>This option requires \"Add link to Openstreetmap on GC Map\".") + "<br>";
            html += "<div style='margin-top: 9px; margin-left: 5px'><b>Flopp's Map page</b></div>";
            html += checkboxy('settings_add_link_flopps_on_gc_map', 'Add link to Flopp\'s Map on GC Map') + show_help("With this option an icon are placed on the GC Map page to link to the same area in Flopp\'s Map.") + "<br>";
            html += " &nbsp; " + checkboxy('settings_switch_to_flopps_in_same_tab', 'Switch to Flopp\'s Map in same browser tab') + show_help("With this option you can switch from GC Map to Flopp\'s Map in the same browser tab.<br><br>This option requires \"Add link to Flopp\'s Map on GC Map\".") + "<br>";
            html += "<div style='margin-top: 9px; margin-left: 5px'><b>GeoHack page</b></div>";
            html += checkboxy('settings_add_link_geohack_on_gc_map', 'Add link to GeoHack on GC Map') + show_help("With this option an icon are placed on the GC Map page to link to the same area in GeoHack.") + "<br>";
            html += " &nbsp; " + checkboxy('settings_switch_to_geohack_in_same_tab', 'Switch to GeoHack in same browser tab') + show_help("With this option you can switch from GC Map to GeoHack in the same browser tab.<br><br>This option requires \"Add link to GeoHack on GC Map\".") + "<br>";
            html += "</div>";

            html += "<h4 class='gclh_headline2'>"+prepareHideable.replace("#name#","profile")+"Public profile</h4>";
            html += "<div id='gclh_config_profile' class='gclh_block'>";
            html += "<div style='margin-left: 5px'><b>Trackables</b></div>";
            html += checkboxy('settings_faster_profile_trackables', 'Load trackables faster without images') + show_help("With this option you can stop the load on the trackable pages after the necessary datas are loaded. You disclaim of the lengthy load of the images of the trackables. This procedure is much faster as load all datas, because every image is loaded separate and not in a bigger bundle like it is for the non image data.") + "<br>";

            html += "<div style='margin-top: 9px; margin-left: 5px'><b>Gallery</b></div>";
            var content_settings_show_thumbnails = checkboxy('settings_show_thumbnails', 'Show thumbnails of images') + show_help_big("With this option the images are displayed as thumbnails to have a preview. If you hover with your mouse over a thumbnail, you can see the big one.<br><br>This works in cache and TB logs, in the cache and TB image galleries, in public profile for the avatar and in the profile image gallery. <br><br>And after pressing button \"Show bigger avatars\" in cache listing, it works too for the avatars in the shown logs.") + "&nbsp; Max size of big image: <input class='gclh_form' size=2 type='text' id='settings_hover_image_max_size' value='" + settings_hover_image_max_size + "'> px <br>";
            html += content_settings_show_thumbnails;
            html += "&nbsp; " + checkboxy('settings_imgcaption_on_top', 'Show caption on top') + show_help("This option requires \"Show thumbnails of images\".");
            var content_geothumbs = "<font class='gclh_small' style='margin-left: 130px; margin-top: 4px; position: absolute;'> (Alternative: <a href='http://benchmarks.org.uk/greasemonkey/geothumbs.php' target='_blank'>Geothumbs</a> " + show_help("A great alternative to the GClh bigger image functionality with \"Show thumbnails of images\" and \"Show bigger images in gallery\", provides the script Geothumbs (Geocaching Thumbnails). <br><br>The script works like GClh with Firefox, Google Chrome and Opera as Tampermonkey script. <br><br>If you use Geothumbs, you have to uncheck both GClh bigger image functionality \"Show thumbnails of images\" and \"Show bigger images in gallery\".") + ")</font>" + "<br>";
            html += content_geothumbs;
            html += checkboxy('settings_show_big_gallery', 'Show bigger images in gallery') + show_help("With this option the images in the galleries of caches, TBs and public profiles are displayed bigger and not in 4 columns, but in 2 columns.");

            html += "<div style='margin-top: 9px; margin-left: 5px'><b>Statistic</b>" + prem + "</div>";
            html += checkboxy('settings_count_own_matrix', 'Calculate your cache matrix') + show_help("With this option the count of found difficulty and terrain combinations and the count of complete matrixes are calculated and shown above the cache matrix on your statistic page.") + "<br>";
            html += checkboxy('settings_count_foreign_matrix', 'Calculate other users cache matrix') + show_help("With this option the count of found difficulty and terrain combinations and the count of complete matrixes are calculated and shown above the cache matrix on other users statistic page.") + "<br>";
            html += checkboxy('settings_count_own_matrix_show_next', 'Mark D/T combinations for your next possible cache matrix') + show_help("With this option the necessary difficulty and terrain combinations to reach the next possible complete matrixes are marked in your cache matrix on your statistic page.") + "<br>";
            html += " &nbsp; &nbsp;" + "Highlight next <select class='gclh_form' id='settings_count_own_matrix_show_count_next' >";
            for (var i = 1; i < 5; i++) {
                html += "  <option value='" + i + "' " + (settings_count_own_matrix_show_count_next == i ? "selected=\"selected\"" : "") + ">" + i + "</option>";
            }
            html += "</select> matrixes in color <input class='gclh_form color' type='text' size=5 id='settings_count_own_matrix_show_color_next' style='margin-left: 0px;' value='" + getValue("settings_count_own_matrix_show_color_next", "5151FB") + "'>";
            html += "<img src=" + global_restore_icon + " id='restore_settings_count_own_matrix_show_color_next' title='back to default' style='width: 12px; cursor: pointer;'>" + show_help("With this option you can choose the count and the color of highlighted next possible complete matrixes in your cache matrix on your statistic page.<br><br>" + t_reqMDTc) + "<br>";
            html += " &nbsp; &nbsp;" + "Generate cache search links with radius <select class='gclh_form' id='settings_count_own_matrix_links_radius' >";
            for (var i = 0; i < 501; i++) {
                html += "  <option value='" + i + "' " + (settings_count_own_matrix_links_radius == i ? "selected=\"selected\"" : "") + ">" + i + "</option>";
            }
            html += "</select> km" + show_help("With this option cache search links with the inserted radius in km are generated for the highlighted difficulty and terrain combinations. With a radius of 0 km there are no links generated. The default radius is 25 km.<br><br>" + t_reqMDTc) + "<br>";
            html += " &nbsp; &nbsp;" + "Show the searched caches in a <select class='gclh_form' id='settings_count_own_matrix_links'>";
            html += "  <option value='map' " + (settings_count_own_matrix_links == "map" ? "selected=\"selected\"" : "") + ">map</option>";
            html += "  <option value='list' " + (settings_count_own_matrix_links == "list" ? "selected=\"selected\"" : "") + ">list</option>";
            html += "</select>" + show_help("With this option the searched caches are shown in a map or in a list.<br><br>" + t_reqMDTc) + "<br>";
            html += checkboxy('settings_log_statistic', 'Calculate number of cache and trackable logs for each logtype') + show_help("With this option, you can build a statistic for your own cache and trackable logs for each logtype on your own statistic pages.") + "<br>";
            html += "&nbsp; " + checkboxy('settings_log_statistic_percentage', 'Show percentage column') + "<br>";
            html += " &nbsp; &nbsp;" + "Automated load/reload after <select class='gclh_form' id='settings_log_statistic_reload' >";
            html += "  <option value='' " + (settings_log_statistic_reload == '' ? "selected=\"selected\"" : "") + "></option>";
            for (var i = 1; i < 49; i++) {
                html += "  <option value='" + i + "' " + (settings_log_statistic_reload == i ? "selected=\"selected\"" : "") + ">" + i + "</option>";
            }
            html += "</select> hours" + show_help("Choose no hours, if you want to load/reload only manual.") + "<br>";
            html += newParameterOn2;
            html += checkboxy('settings_map_links_statistic', 'Show links to found caches for every country on statistic map') + show_help("With this option, you can improve your own statistic maps page for you with links to caches you have found for every country.") + "<br>";
            html += newParameterVersionSetzen(0.8) + newParameterOff;
            html += "</div>";

            html += "<h4 class='gclh_headline2'>"+prepareHideable.replace("#name#","db")+"Dashboard</h4>";
            html += "<div id='gclh_config_db' class='gclh_block'>";
            html += checkboxy('settings_bookmarks_show', "Show <a class='gclh_ref' href='#gclh_linklist' title='Link to topic \"Linklist / Navigation\"' id='gclh_linklist_link_2'>Linklist</a> on your dashboard") + show_help("Show the Linklist at the sidebar on your dashboard. You can configure the links in the Linklist at the end of this configuration page.") + "<br>";
            html += checkboxy('settings_show_mail_in_allmyvips', 'Show mail link beside user in "All my VIPs/VUPs" list on your dashboard') + show_help3("With this option there will be an small mail icon beside every user in the list with all your VIPs (All my VIPs) on your dashboard page. With this icon you get directly to the mail page to mail to this user.<br>(VIP: Very important person)<br><br>If VUP processing is activated, this also applies to your VUPs (All my VUPs).<br>(VUP: Very unimportant person)<br><br>This option requires \"Show mail link beside user\" and \"Show VIP list\".") + "<br>";
            html += newParameterOn2;
            html += checkboxy('settings_my_lists_old_fashioned', 'Change link \"Lists\" and \"Your lists\" to old-fashioned lists page') + show_help("This option changes the link \"Lists\" on your old dashboard and the link \"Your lists\" on your new dashboard from the new lists page \".../account/lists\" to the old-fashioned lists page \".../my/lists\".<br>The page includes the list of your bookmark lists, your ignore list and the links to your favorites and your watchlist.") + "<br>";
            html += newParameterVersionSetzen(0.8) + newParameterOff;

            html += "<div style='margin-top: 9px; margin-left: 5px'><b>New dashboard only</b></div>";
            html += newParameterOn3;
            html += checkboxy('settings_show_default_links', 'Show all default links on your dashboard') + show_help("Show all the default links for the Linklist sorted at the sidebar on your dashboard.") + "<br>";
            html += checkboxy('settings_show_tb_inv', 'Show trackables inventory on your dashboard') + show_help("With this option a maximum of ten trackables of your trackables inventory is shown on your new dashboard. (On old dashboard it is GC standard to show it.)") + "<br>";
            html += checkboxy('settings_but_search_map', 'Show buttons "Search" and "Map" on your dashboard') + "<br>";
            html += " &nbsp; " + checkboxy('settings_but_search_map_new_tab', 'Open links in new tab') + "<br>";
            html += newParameterVersionSetzen(0.9) + newParameterOff;

            html += "<div style='margin-top: 9px; margin-left: 5px'><b>Old dashboard only</b></div>";
            html += checkboxy('settings_hide_visits_in_profile', 'Hide TB/Coin visits on your dashboard') + "<br>";
            var content_settings_logit_for_basic_in_pmo = checkboxy('settings_logit_for_basic_in_pmo', 'Log PMO caches by standard \"Log It\" icon (for basic members)') + show_help3("With this option basic members are able to choose the standard \"Log It\" icon to call the logging screen for Premium Member Only caches (PMO). The tool tipp blocked not longer this call. You can have the same result by using the right mouse across the \"Log It\" icon and then new tab. <br>The \"Log It\" icon is besides the caches for example in the \"Recently viewed caches list\" and next to the caches on your old dashboard.") + "<br>";
            html += content_settings_logit_for_basic_in_pmo;
            html += "</div>";

            html += "<h4 class='gclh_headline2'>"+prepareHideable.replace("#name#","listing")+"Listing</h4>";
            html += "<div id='gclh_config_listing' class='gclh_block'>";
            html += checkboxy('settings_log_inline', 'Log cache from listing (inline)') + show_help("With the inline log you can open a log form inside the listing, without loading a new page.") + "<br>";
            var content_settings_log_inline_tb = "&nbsp; " + checkboxy('settings_log_inline_tb', 'Show TB list') + show_help("With this option you can select, if the TB list should be shown in inline logs.<br><br>This option requires \"Log cache from listing (inline)\" or \"Log cache from listing for PMO (for basic members)\".") + "<br>";
            html += content_settings_log_inline_tb;
            html += checkboxy('settings_log_inline_pmo4basic', 'Log cache from listing for PMO (for basic members)') + show_help("With this option you can select, if inline logs should appear for Premium Member Only (PMO) caches althought you are a basic member.") + "<br>";
            html += content_settings_log_inline_tb.replace("settings_log_inline_tb", "settings_log_inline_tbX0");
            html += checkboxy('settings_hide_empty_cache_notes', 'Hide cache notes if empty') + show_help("You can hide the personal cache notes if they are empty. There will be a link to show them to add a note.") + prem + "<br>";
            html += checkboxy('settings_hide_cache_notes', 'Hide cache notes completely') + show_help("You can hide the personal cache notes completely, if you don't want to use them.") + prem + "<br>";
            html += checkboxy('settings_hide_disclaimer', 'Hide disclaimer') + "<br>";
            html += checkboxy('settings_hide_spoilerwarning', 'Hide spoiler warning') + "<br>";
            html += checkboxy('settings_hide_top_button', 'Hide the green "To Top" button') + show_help("Hide the green \"To Top\" button, which appears if you are reading logs.") + "<br>";
            html += checkboxy('settings_show_all_logs', 'Show at least ') + " <input class='gclh_form' type='text' size='2' id='settings_show_all_logs_count' value='" + settings_show_all_logs_count + "'> logs (0 = all)" + show_help("With this option you can choose how many logs should be shown at least if you load the listing - if you type 0, all logs are shown by default.") + "<br>";
            html += checkboxy('settings_hide_hint', 'Hide hints behind a link') + show_help("This option hides the hints behind a link. You have to click it to display the hints (already decrypted). This option remove also the description of the decryption.") + "<br>";
            html += checkboxy('settings_decrypt_hint', 'Decrypt hints') + show_help("This option decrypt the hints on cache listing and print page and remove also the description of the decryption.") + "<br>";
            html += checkboxy('settings_visitCount_geocheckerCom', 'Show statistic on geochecker.com pages') + show_help("This option adds '&visitCount=1' to all geochecker.com links. This will show some statistics on geochecker.com page like the count of page visits and the count of right and wrong attempts.") + "<br>";
            html += checkboxy('settings_show_eventday', 'Show weekday of an event') + show_help("With this option the day of the week will be displayed next to the evemt date.") + " Date format: <select class='gclh_form' id='settings_date_format'>";
            html += "  <option " + (settings_date_format == "yyyy-MM-dd" ? "selected='selected'" : "") + " value='yyyy-MM-dd'> 2016-12-31</option>";
            html += "  <option " + (settings_date_format == "yyyy/MM/dd" ? "selected='selected'" : "") + " value='yyyy/MM/dd'> 2016/12/31</option>";
            html += "  <option " + (settings_date_format == "MM/dd/yyyy" ? "selected='selected'" : "") + " value='MM/dd/yyyy'> 12/31/2016</option>";
            html += "  <option " + (settings_date_format == "dd/MM/yyyy" ? "selected='selected'" : "") + " value='dd/MM/yyyy'> 31/12/2016</option>";
            html += "  <option " + (settings_date_format == "dd.MM.yyyy" ? "selected='selected'" : "") + " value='dd.MM.yyyy'> 31.12.2016</option>";
            html += "  <option " + (settings_date_format == "dd/MMM/yyyy" ? "selected='selected'" : "") + " value='dd/MMM/yyyy'> 31/Dec/2016</option>";
            html += "  <option " + (settings_date_format == "MMM/dd/yyyy" ? "selected='selected'" : "") + " value='MMM/dd/yyyy'> Dec/31/2016</option>";
            html += "  <option " + (settings_date_format == "dd MMM yy" ? "selected='selected'" : "") + " value='dd MMM yy'> 31 Dec 16</option>";
            html += "</select>" + show_help("If you have changed the date format on GC, you have to change it here to. Instead the day of week may be wrong.") + "<br>";
            html += checkboxy('settings_show_mail', 'Show mail link beside user') + show_help("With this option there will be an small mail icon beside every user. With this icon you get directly to the mail form to mail to this user. If you click it for example when you are in a listing, the cachename or GC code can be inserted into the mail form about placeholder in the mail / message form template.") + "<br>";
            var content_settings_show_mail_in_viplist = "&nbsp; " + checkboxy('settings_show_mail_in_viplist', 'Show mail link beside user in "VIP-List" in listing') + show_help("With this option there will be an small mail icon beside every user in the VIP lists on the cache listing page. With this icon you get directly to the mail page to mail to this user. <br>(VIP: Very important person)<br><br>This option requires \"Show mail link beside user\", \"Show VIP list\" and \"Load logs with GClh\".") + "<br>";
            html += content_settings_show_mail_in_viplist;
            html += "&nbsp; " + checkboxy('settings_mail_icon_new_win', 'Open mail form in new tab')  + show_help("If you enable this option, the mail form will open in a new tab.<br><br>This option requires \"Show mail link beside user\".")+ "<br>";
            html += checkboxy('settings_show_message', 'Show message link beside user') + show_help("With this option there will be an small message icon beside every user. With this icon you get directly to the message form to send a message to this user. If you click it for example when you are in a listing, the cachename or GC code can be inserted into the message form about placeholder in the mail / message form template.") + "<br>";
            html += "&nbsp; " + checkboxy('settings_message_icon_new_win', 'Open message form in new tab')  + show_help("If you enable this option, the message form will open in a new tab.<br><br>This option requires \"Show message link beside user\".")+ "<br>";
            html += checkboxy('settings_show_google_maps', 'Show link to Google Maps') + show_help("This option shows a link at the top of the second map in the listing. With this link you get directly to Google Maps in the area, where the cache is.") + "<br>";
            html += checkboxy('settings_strike_archived', 'Strike through title of archived/disabled caches') + "<br>";
            html += "&nbsp;" + "Highlight user changed coords with " + checkboxy('settings_highlight_usercoords', 'red textcolor ') + checkboxy('settings_highlight_usercoords_bb', 'underline ') + checkboxy('settings_highlight_usercoords_it', 'italic') + "<br>";
            html += checkboxy('settings_show_fav_percentage', 'Show percentage of favourite points') + show_help("This option loads the favourite stats of a cache in the backround and display the percentage under the amount of favourites a cache got.") + "<br>";
            html += checkboxy('settings_show_latest_logs_symbols', 'Show the ');
            html += "<select class='gclh_form' id='settings_show_latest_logs_symbols_count'>";
            for (var i = 1; i < 11; i++) {
                html += "  <option value='" + i + "' " + (settings_show_latest_logs_symbols_count == i ? "selected=\"selected\"" : "") + ">" + i + "</option>";
            }
            html += "</select> latest logs symbols at the top" + show_help("With this option, the choosen count of the latest logs symbols is shown at the top of the cache listing.<br><br>" + t_reqLlwG) + "<br>";
            html += checkboxy('settings_show_remove_ignoring_link', 'Show \"Stop Ignoring\", if cache is already ignored') + show_help("This option replace the \"Ignore\" link description with the \"Stop Ignoring\" link description in the cache listing, if the cache is already ignored.") + prem + "<br>";
            html += checkboxy('settings_map_overview_build', 'Show cache location in overview map') + show_help("With this option there will be an additional map top right in the cache listing as an overview of the cache location. This was available earlier on GC standard.") + "<br>";
            html += " &nbsp; &nbsp;" + "Map zoom value: <select class='gclh_form' id='settings_map_overview_zoom'>";
            for (var i = 1; i < 20; i++) {
                html += "  <option value='" + i + "' " + (settings_map_overview_zoom == i ? "selected=\"selected\"" : "") + ">" + i + "</option>";
            }
            html += "</select>" + show_help("With this option you can choose the zoom value to start in the map. \"1\" is the hole world and \"19\" is the maximal enlargement. Default is \"11\". <br><br>This option requires \"Show cache location in overview map\".") + "<br>";
            html += checkboxy('settings_show_vip_list', 'Show VIP list') + show_help("The VIP list is a list, displayed at the right side on a cache listing. You can add any user to your VIP list by clicking the little VIP icon beside the user. If it is green, this person is a VIP. The VIP list only shows VIPs and the logs of VIPs, which already posted a log to this cache. With this option you are able to see which of your VIPs already found this cache. On your dashboard page there is an overview of all your VIPs.<br>(VIP: Very important person)") + "<br>";
            html += "&nbsp; " + checkboxy('settings_show_owner_vip_list', 'Show owner in VIP list')  + show_help("If you enable this option, the owner is a VIP for the cache, so you can see, what happened with the cache (disable, maint, enable, ...). Then the owner is shown not only in VIP list but also in VIP logs.<br>(VIP: Very important person)<br><br>" + t_reqSVl)+ "<br>";
            html += "&nbsp; " + checkboxy('settings_show_long_vip', 'Show long VIP list (one row per log)') + show_help("This is another type of displaying the VIP list. If you disable this option you get the short list, one row per VIP and the logs as icons beside the VIP. If you enable this option, there is a row for every log.<br>(VIP: Very important person)<br><br>" + t_reqSVl) + "<br>";
            html += "&nbsp; " + checkboxy('settings_vip_show_nofound', 'Show a list of VIPs who have not found the cache') + show_help("This option enables an additional VIP list with VIPs who have not found the cache.<br>(VIP: Very important person)<br><br>" + t_reqSVl) + "<br>";
            html += "&nbsp; " + checkboxy('settings_make_vip_lists_hideable', 'Make VIP lists in listing hideable') + show_help("With this option you can hide and show the VIP lists \"VIP-List\" and \"VIP-List not found\" in cache listing with one click.<br>(VIP: Very important person)<br><br>" + t_reqSVl) + "<br>";
            html += content_settings_show_mail_in_viplist.replace("in_viplist", "in_viplistX0");
            html += "&nbsp; " + checkboxy('settings_process_vup', 'Process VUPs') + show_help("With this option you can activate the processing to add any user to a VUP list by clicking the little VUP icon beside the user. If it is red, this person is a VUP. For such persons in cache logs will only shown \"censored\" instead of the log text. On your dashboard page there is an overview of all your VUPs.<br>(VUP: Very unimportant person)<br><br>" + t_reqSVl) + "<br>";
            html += " &nbsp; &nbsp; " + checkboxy('settings_vup_hide_avatar', 'Also hide name, avatar and counter from log') + show_help("With this option you can also hide the cacher name, his avatar and his found counter in listing.<br><br>This option requires \"Process VUPs\" and \"Show VIP list\".") + "<br>";
            html += " &nbsp; &nbsp; &nbsp; " + checkboxy('settings_vup_hide_log', 'Hide complete log') + show_help("With this option you can hide the complete log of the cacher.<br><br>This option requires \"Also hide name, avatar and counter from log\", \"Process VUPs\" and \"Show VIP list\".") + "<br>";
            html += checkboxy('settings_link_big_listing', 'Replace image links in cache listing to bigger image') + show_help("With this option the links of owner images in the cache listing points to the bigger, original image.") + "<br>";
            html += content_settings_show_thumbnails.replace("show_thumbnails", "show_thumbnailsX0").replace("max_size", "max_sizeX0");
            html += " &nbsp; &nbsp;" + "Spoiler filter: <input class='gclh_form' type='text' id='settings_spoiler_strings' value='" + settings_spoiler_strings + "'> " + show_help("If one of these words is found in the caption of the image, there will be no real thumbnail. It is to prevent seeing spoilers. Words have to be divided by |. If the field is empty, no checking is done. Default is \"spoiler|hinweis\".<br><br>This option requires \"Show thumbnails of images\".") + "<br>";
            html += "&nbsp; " + checkboxy('settings_imgcaption_on_topX0', 'Show caption on top') + show_help("This option requires \"Show thumbnails of images\".");
            html += content_geothumbs;
            html += checkboxy('settings_hide_avatar', 'Hide avatars in listing') + show_help("This option hides the avatars in logs. This prevents loading the hundreds of images. You have to change the option here, because GClh overrides the log-load-logic of GC, so the avatar option of GC doesn't work with GClh.") + "<br>";
            html += checkboxy('settings_load_logs_with_gclh', 'Load logs with GClh') + show_help("This option should be enabled. <br><br>You just should disable it, if you have problems with loading the logs. <br><br>If this option is disabled, there are no VIP-, VUP-, mail-, message- and top icons, no line colors and no mouse activated big images at the logs. Also the VIP and VUP lists, hide avatars, log filter and log search won't work.") + "<br>";
            html += checkboxy('settings_show_real_owner', 'Show real owner name') + show_help("If the option is enabled, GClh will replace the pseudonym a owner took to publish the cache with the real owner name.") + "<br>";
            html += newParameterOn1;
            html += checkboxy('settings_img_warning', 'Show warning for unavailable images') + show_help("With this option the images in the cache listing will be checked for existence before trying to load it. If an image is unreachable or dosen't exists, a placeholder is shown. The mouse over the placeholder will shown the image link. A mouse click to the placeholder will open the link in a new tab.") + "<br>";
            html += checkboxy('settings_driving_direction_link', 'Show link to Google driving direction for every waypoint') + show_help("Shows for every waypoint in the waypoint list a link to Google driving direction from home location to coordinates of the waypoint.") + "<br>";
            html += "&nbsp; " + checkboxy('settings_driving_direction_parking_area', 'Only for parking area waypoints') + show_help("Shows only a link to the Google driving direction for waypoints of type parking area.") + "<br>";
            html += checkboxy('settings_show_elevation_of_waypoints', 'Show elevations for waypoints and listing coordinates') + show_help("Shows the elevation of every additional waypoint and the (changed) listing coordinates.") + "<br>";
            html += " &nbsp; &nbsp;" + "Measure unit can be set in <a href=\"https://www.geocaching.com/account/settings/preferences\">Preferences</a>" + "<br>";
            html += newParameterVersionSetzen(0.7) + newParameterOff;
            html += newParameterOn2;
            html += checkboxy('settings_improve_add_to_list', 'Show compact layout in \"Add to list\" popup to bookmark a cache') + prem + "<br>";
            html += " &nbsp; &nbsp;" + "Height of popup: <select class='gclh_form' id='settings_improve_add_to_list_height' >";
            for (var i = 100; i < 521; i++) {
                html += "  <option value='" + i + "' " + (settings_improve_add_to_list_height == i ? "selected=\"selected\"" : "") + ">" + i + "</option>";
            }
            html += "</select> px" + show_help("With this option you can choose the height of the \"Add to list\" popup to bookmark a cache from 100 up to 520 pixel. The default is 205 pixel, similar to the standard.<br><br>This option requires \"Show compact layout in \"Add to list\" popup to bookmark a cache\".") + prem + "<br>";
            html += checkboxy('settings_show_flopps_link', 'Show Flopp\'s Map links in sidebar and under the "Additional Waypoints"') + show_help3("If there are no additional waypoints only the link in the sidebar is shown.") + "<br>";
            html += checkboxy('settings_show_brouter_link', 'Show BRouter links in sidebar and under the "Additional Waypoints"') + show_help3("If there are no additional waypoints only the link in the sidebar is shown.") + "<br>";
            html += newParameterVersionSetzen(0.8) + newParameterOff;
            html += "</div>";

            html += "<h4 class='gclh_headline2'>"+prepareHideable.replace("#name#","logging")+"Logging</h4>";
            html += "<div id='gclh_config_logging' class='gclh_block'>";
            html += checkboxy('settings_show_bbcode', 'Show smilies') + show_help("This option displays smilies options beside the log form. If you click on a smilie, it is inserted into your log.") + "<br>";
            html += checkboxy('settings_autovisit', 'Enable \"AutoVisit\" feature for trackables') + show_help("With this option you are able to select trackables which should be automatically set from \"No action\" to \"Visited\" on every log, if the logtype is \"Found It\", \"Webcam Photo Taken\" or \"Attended\". For other logtypes trackables are automatically set from \"Visited\" to \"No action\". You can select \"AutoVisit\" for each trackable in the list on the bottom of the log form.") + "<br>";
            html += checkboxy('settings_replace_log_by_last_log', 'Replace log by last log template') + show_help("If you enable this option, the last log template will replace the whole log. If you disable it, it will be appended to the log.") + "<br>";
            html += content_settings_show_log_it.replace("show_log_it", "show_log_itX2");
            html += content_settings_logit_for_basic_in_pmo.replace("basic_in_pmo","basic_in_pmoX0");
            html += content_settings_submit_log_button.replace("log_button","log_buttonX2");
            html += newParameterOn1;
            html += checkboxy('settings_fieldnotes_old_fashioned', 'Logging drafts old-fashioned') + show_help("This option deactivates on old drafts page the logging of drafts by the new log page and activates logging of drafts by the old-fashioned log page.") + "<br>";
            html += newParameterVersionSetzen(0.7) + newParameterOff;
            html += newParameterOn3;
            html += checkboxy('settings_show_pseudo_as_owner', 'Take also owner pseudonym to replace placeholder owner') + show_help("If you enable this option, the placeholder for the owner is replaced possibly by the pseudonym of the owner if the real owner is not known.<br><br>On the new designed log page there is shown as owner of the cache not the real owner but possibly the pseudonym of the owner for the cache as it is shown in the cache listing under \"A cache by\". The real owner is not available in this cases.") + "<br>";
            html += newParameterVersionSetzen(0.9) + newParameterOff;
            var placeholderDescription = "Possible placeholder:<br>&nbsp; #Found# : Your founds + 1<br>&nbsp; #Found_no# : Your founds<br>&nbsp; #Me# : Your username<br>&nbsp; #Owner# : Username of the owner<br>&nbsp; #Date# : Actual date<br>&nbsp; #Time# : Actual time in format hh:mm<br>&nbsp; #DateTime# : Actual date actual time<br>&nbsp; #GCTBName# : GC or TB name<br>&nbsp; #GCTBLink# : GC or TB link<br>&nbsp; #GCTBNameLink# : GC or TB name as a link<br>&nbsp; #LogDate# : Content of field \"Date Logged\"<br>(Upper and lower case is not required in the placeholder name.)";
            html += "&nbsp;" + "Log templates:" + show_help("Log templates are predefined texts. All your templates are shown beside the log form. You just have to click to a template and it will be placed in your log. <br><br>Also you are able to use placeholder for variables which will be replaced in the log. The smilies option has to be enabled. <br><br>Note: You have to set a title and a text. Click to the edit icon beside the template to edit the text.") + " &nbsp; (Possible placeholder:" + show_help_big(placeholderDescription) + ")<br>";
            html += "<font class='gclh_small' style='font-style: italic; margin-left: 240px; margin-top: 25px; width: 320px; position: absolute; z-index: -1;' >Bitte beachte, dass Logtemplates nützlich sind, um automatisiert die Fundzahl, das Funddatum und ähnliches im Log einzutragen, dass aber Cache Owner Menschen sind, die sich über individuelle Logs zu ihrem Cache freuen. Beim Geocachen geht es nicht nur darum, die eigene Statistik zu puschen, sondern auch darum, etwas zu erleben. Bitte nimm dir doch etwas Zeit, den Ownern etwas wiederzugeben, indem du ihnen von Deinen Erlebnissen berichtest und ihnen gute Logs schreibst. Dann wird es auch in Zukunft Cacher geben, die sich gerne die Mühe machen, neue Caches auszulegen. Die Logtemplates sind also nützlich, können aber niemals ein vollständiges Log ersetzen.</font>";
            for (var i = 0; i < anzTemplates; i++) {
                html += "&nbsp;" + "<input class='gclh_form' type='text' size='15' id='settings_log_template_name[" + i + "]' value='" + getValue('settings_log_template_name[' + i + ']', '') + "'> ";
                html += "<a onClick=\"if(document.getElementById(\'settings_log_template_div[" + i + "]\').style.display == \'\') document.getElementById(\'settings_log_template_div[" + i + "]\').style.display = \'none\'; else document.getElementById(\'settings_log_template_div[" + i + "]\').style.display = \'\'; return false;\" href='#'><img src='" + http + "://www.geocaching.com/images/stockholm/16x16/page_white_edit.gif' border='0'></a><br>";
                html += "<div id='settings_log_template_div[" + i + "]' style='display: none;'>&nbsp;&nbsp;&nbsp;&nbsp;<textarea class='gclh_form' rows='4' cols='54' id='settings_log_template[" + i + "]'>&zwnj;" + getValue("settings_log_template[" + i + "]", "") + "</textarea></div>";
            }
            html += "&nbsp;" + "Cache log signature:" + show_help("The signature will automatically be inserted into your logs. <br><br>Also you are able to use placeholder for variables which will be replaced in the log.") + " &nbsp; (Possible placeholder:" + show_help_big(placeholderDescription) + ")<br>";
            html += "&nbsp;" + "<textarea class='gclh_form' rows='3' cols='56' id='settings_log_signature'>&zwnj;" + getValue("settings_log_signature", "") + "</textarea><br>";
            html += checkboxy('settings_log_signature_on_fieldnotes', 'Add log signature on drafts logs') + show_help('If this option is disabled, the log signature will not be used by logs out of drafts. You can use it, if you already have an signature in your drafts.') + "<br>";
            html += "&nbsp;" + "TB log signature:" + show_help("The signature will automatically be inserted into your TB logs. <br><br>Also you are able to use placeholder for variables which will be replaced in the log.") + " &nbsp; (Possible placeholder:" + show_help_big(placeholderDescription) + ")<br>";
            html += "&nbsp;" + "<textarea class='gclh_form' rows='3' cols='56' id='settings_tb_signature' style='margin-top: 2px;'>&zwnj;" + getValue("settings_tb_signature", "") + "</textarea><br>";

            html += "<div style='margin-top: 9px; margin-left: 5px'><b>Old log page only</b></div>";
            var t_logTyp = "If you set this option, the selected value will be set automatically, if you open a log page.";
            html += "<table><tbody>";
            html += "  <tr><td>Default log type:</td>";
            html += "    <td><select class='gclh_form' id='settings_default_logtype'>";
            html += "    <option value=\"-1\" " + (settings_default_logtype == "-1" ? "selected=\"selected\"" : "") + ">- Select type of log -</option>";
            html += "    <option value=\"2\" " + (settings_default_logtype == "2" ? "selected=\"selected\"" : "") + ">Found it</option>";
            html += "    <option value=\"3\" " + (settings_default_logtype == "3" ? "selected=\"selected\"" : "") + ">Didn't find it</option>";
            html += "    <option value=\"4\" " + (settings_default_logtype == "4" ? "selected=\"selected\"" : "") + ">Write note</option>";
            html += "    <option value=\"7\" " + (settings_default_logtype == "7" ? "selected=\"selected\"" : "") + ">Needs archived</option>";
            html += "    <option value=\"45\" " + (settings_default_logtype == "45" ? "selected=\"selected\"" : "") + ">Needs maintenance</option>";
            html += "    </select>" + show_help(t_logTyp) + "</td>";
            html += "  <tr><td>Default event log type:</td>";
            html += "    <td><select class='gclh_form' id='settings_default_logtype_event'>";
            html += "    <option value=\"-1\" " + (settings_default_logtype_event == "-1" ? "selected=\"selected\"" : "") + ">- Select type of log -</option>";
            html += "    <option value=\"4\" " + (settings_default_logtype_event == "4" ? "selected=\"selected\"" : "") + ">Write note</option>";
            html += "    <option value=\"7\" " + (settings_default_logtype_event == "7" ? "selected=\"selected\"" : "") + ">Needs archived</option>";
            html += "    <option value=\"9\" " + (settings_default_logtype_event == "9" ? "selected=\"selected\"" : "") + ">Will attend</option>";
            html += "    <option value=\"10\" " + (settings_default_logtype_event == "10" ? "selected=\"selected\"" : "") + ">Attended</option>";
            html += "    </select>" + show_help(t_logTyp+" And if it is an event.") + "</td>";
            html += "  <tr><td>Default owner log type:</td>";
            html += "    <td><select class='gclh_form' id='settings_default_logtype_owner'>";
            html += "    <option value=\"-1\" " + (settings_default_logtype_owner == "-1" ? "selected=\"selected\"" : "") + ">- Select type of log -</option>";
            html += "    <option value=\"4\" " + (settings_default_logtype_owner == "4" ? "selected=\"selected\"" : "") + ">Write note</option>";
            html += "    <option value=\"5\" " + (settings_default_logtype_owner == "5" ? "selected=\"selected\"" : "") + ">Archive</option>";
            html += "    <option value=\"23\" " + (settings_default_logtype_owner == "23" ? "selected=\"selected\"" : "") + ">Enable listing</option>";
            html += "    <option value=\"18\" " + (settings_default_logtype_owner == "18" ? "selected=\"selected\"" : "") + ">Post reviewer note</option>";
            html += "    </select>" + show_help(t_logTyp+" And if it is your own cache.") + "</td>";
            html += "  <tr><td>Default TB log type:</td>";
            html += "    <td><select class='gclh_form' id='settings_default_tb_logtype'>";
            html += "    <option value=\"-1\" " + (settings_default_tb_logtype == "-1" ? "selected=\"selected\"" : "") + ">- Select type of log -</option>";
            html += "    <option value=\"13\" " + (settings_default_tb_logtype == "13" ? "selected=\"selected\"" : "") + ">Retrieve from ..</option>";
            html += "    <option value=\"19\" " + (settings_default_tb_logtype == "19" ? "selected=\"selected\"" : "") + ">Grab it from ..</option>";
            html += "    <option value=\"4\" " + (settings_default_tb_logtype == "4" ? "selected=\"selected\"" : "") + ">Write note</option>";
            html += "    <option value=\"48\" " + (settings_default_tb_logtype == "48" ? "selected=\"selected\"" : "") + ">Discovered it</option>";
            html += "    </select>" + show_help(t_logTyp) + "</td>";
            html += "</tbody></table>";
            html += "</div>";

            html += "<h4 class='gclh_headline2'>"+prepareHideable.replace("#name#","mail")+"Mail / Message form</h4>";
            html += "<div id='gclh_config_mail' class='gclh_block'>";
            var placeholderDescriptionMail = "Possible placeholder Mail / Message form:<br>&nbsp; #Found# : Your founds + 1<br>&nbsp; #Found_no# : Your founds<br>&nbsp; #Me# : Your username<br>&nbsp; #Receiver# : Username of the receiver<br>&nbsp; #Date# : Actual date<br>&nbsp; #Time# : Actual time in format hh:mm<br>&nbsp; #DateTime# : Actual date actual time<br>&nbsp; #GCTBName# : GC or TB name<br>&nbsp; #GCTBCode# : GC or TB code in brackets<br>&nbsp; #GCTBLink# : GC or TB link in brackets<br>(Upper and lower case is not required in the placeholder name.)";
            html += "&nbsp;" + "Template:" + show_help2("The template will automatically be inserted into your mails and messages. <br><br>Also you are able to use placeholder for variables which will be replaced in the mail and in the message.") + " &nbsp; (Possible placeholder:" + show_help_big(placeholderDescriptionMail) + ")<br>";
            html += "&nbsp;" + "<textarea class='gclh_form' rows='7' cols='56' id='settings_mail_signature'>&zwnj;" + getValue("settings_mail_signature", "") + "</textarea><br>";
            html += "</div>";

            html += "<h4 class='gclh_headline2'><a name='gclh_linklist'></a>"+prepareHideable.replace("#name#","linklist")+"Linklist / Navigation <span style='font-size: 14px'>" + show_help("In this section you can configure your personal Linklist which is shown on the top of the page and/or on your dashboard. You can activate it in the \"Global\" or \"Dashboard\" section.") + "</span></h4>";
            html += "<div id='gclh_config_linklist' class='gclh_block'>";
            html += "&nbsp;" + "Remove from navigation:" + show_help("Here you can select, which of the original GC drop-down lists should be removed.") + "<br>";
            html += "<input type='checkbox' " + (getValue('remove_navi_play') ? "checked='checked'" : "" ) + " id='remove_navi_play'>Play<br>";
            html += "<input type='checkbox' " + (getValue('remove_navi_community') ? "checked='checked'" : "" ) + " id='remove_navi_community'>Community<br>";
            html += "<input type='checkbox' " + (getValue('remove_navi_shop') ? "checked='checked'" : "" ) + " id='remove_navi_shop'>Shop<br><br>";
            html += "<input type='checkbox' " + (settings_bookmarks_search ? "checked='checked'" : "" ) + " id='settings_bookmarks_search'>Show searchfield. Default value: <input class='gclh_form' type='text' id='settings_bookmarks_search_default' value='" + settings_bookmarks_search_default + "' size='4'>" + show_help("If you enable this option, there will be a searchfield on the top of the page. In this field you can search for GC Ids, TB Ids, tracking numbers, coordinates, ... . Also you can define a default value if you want (like GC ...).<br><br>" + t_reqSLoT) + "<br>";

            html += "<input type='radio' " + (settings_bookmarks_top_menu ? "checked='checked'" : "" ) + " name='top_menu' id='settings_bookmarks_top_menu' style='margin-top: 9px;'>Show Linklist at menu as drop-down list" + show_help("With this option your Linklist will be shown at the navigation menu as a drop-down list beside the others.") + "<br>";
            html += "<div id='box_top_menu_v' style='margin-left: 16px; margin-bottom: 2px; height: 141px;' >";
            html += checkboxy('settings_menu_float_right', 'Arrange the menu right') + show_help("With this option you can arrange the navigation menu with the Linklist and the other drop-down lists in the right direction. The default is an orientation in the left direction.<br><br>" + t_reqChlSLoT) + "<br>";
            html += "&nbsp;" + "Font color at menu: <input class='gclh_form color' type='text' size=5 id='settings_font_color_menu' value='" + getValue("settings_font_color_menu", "93B516") + "'>";
            html += "<img src=" + global_restore_icon + " id='restore_settings_font_color_menu' title='back to default' style='width: 12px; cursor: pointer;'>" + show_help("With this option you can choose the font color at the navigation menu. The default font color is 93B516 (lime green).<br><br>" + t_reqChl) + "<br>";
            html += "&nbsp;" + "Font size at menu: <select class='gclh_form' id='settings_font_size_menu'>";
            for (var i = 6; i < 17; i++) {
                html += "  <option value='" + i + "' " + (settings_font_size_menu == i ? "selected=\"selected\"" : "") + ">" + i + "</option>";
            }
            html += "</select> px" + show_help("With this option you can choose the font size at the navigation menu in pixel. The default font size is 16 pixel.<br><br>" + t_reqChl) + "<br>";
            html += "&nbsp;" + "Distance between menu entries: <select class='gclh_form' id='settings_distance_menu'>";
            for (var i = 0; i < 100; i++) {
                html += "  <option value='" + i + "' " + (settings_distance_menu == i ? "selected=\"selected\"" : "") + ">" + i + "</option>";
            }
            html += "</select> px" + show_help("With this option you can choose the distance between the navigation menu entries in horizontal direction in pixel.<br><br>" + t_reqChl) + "<br>";
            html += "&nbsp;" + "Font color at drop-down lists: <input class='gclh_form color' type='text' size=5 id='settings_font_color_submenu' value='" + getValue("settings_font_color_submenu", "93B516") + "'>";
            html += "<img src=" + global_restore_icon + " id='restore_settings_font_color_submenu' title='back to default' style='width: 12px; cursor: pointer;'>" + show_help("With this option you can choose the font color at the drop-down lists. The default font color is 93B516 (lime green).<br><br>" + t_reqChl) + "<br>";
            html += "&nbsp;" + "Font size at drop-down lists: <select class='gclh_form' id='settings_font_size_submenu'>";
            for (var i = 6; i < 17; i++) {
                html += "  <option value='" + i + "' " + (settings_font_size_submenu == i ? "selected=\"selected\"" : "") + ">" + i + "</option>";
            }
            html += "</select> px" + show_help("With this option you can choose the font size at the drop-down lists in pixel. The default font size is 15 pixel.<br><br>" + t_reqChl) + "<br>";
            html += "&nbsp;" + "Distance between drop-down links: <select class='gclh_form' id='settings_distance_submenu'>";
            for (var i = 0; i < 33; i++) {
                html += "  <option value='" + i + "' " + (settings_distance_submenu == i ? "selected=\"selected\"" : "") + ">" + i + "</option>";
            }
            html += "</select> px" + show_help("With this option you can choose the distance between the drop-down links in vertical direction in pixel.<br><br>" + t_reqChl) + "<br>";
            html += "</div>";

            html += "<input type='radio' " + (settings_bookmarks_top_menu ? "" : "checked='checked'" ) + " name='top_menu' id='settings_bookmarks_top_menu_h'>Show Linklist in horizontal direction" + show_help("If you enable this option, the links in your Linklist will be shown direct on the top of the page, side by side.<br><br>" + t_reqChlSLoT) + "<br>";
            html += "<div id='box_top_menu_h' style='margin-left: 16px; height: 188px;' >";
            html += "&nbsp;" + "Font color at menu: <input class='gclh_form color' type='text' size=5 id='settings_font_color_menuX0' value='" + getValue("settings_font_color_menu", "93B516") + "'>";
            html += "<img src=" + global_restore_icon + " id='restore_settings_font_color_menuX0' title='back to default' style='width: 12px; cursor: pointer;'>" + show_help("With this option you can choose the font color at the links. The default font color is 93B516 (lime green).<br><br>" + t_reqChlSLoT) + "<br>";
            html += "&nbsp;" + "Font size at the links: <select class='gclh_form' id='settings_font_size_menuX0'>";
            for (var i = 6; i < 17; i++) {
                html += "  <option value='" + i + "' " + (settings_font_size_menu == i ? "selected=\"selected\"" : "") + ">" + i + "</option>";
            }
            html += "</select> px" + show_help("With this option you can choose the font size at the links in pixel. The default font size is 16 pixel.<br><br>" + t_reqChlSLoT) + "<br>";
            html += "&nbsp;" + "Distance between the links: <select class='gclh_form' id='settings_distance_menuX0'>";
            for (var i = 0; i < 100; i++) {
                html += "  <option value='" + i + "' " + (settings_distance_menu == i ? "selected=\"selected\"" : "") + ">" + i + "</option>";
            }
            html += "</select> px" + show_help("With this option you can choose the distance between the links in horizontal direction in pixel. <br><br>" + t_reqChlSLoT) + "<br>";
            html += "&nbsp;" + "Number of lines for all links: <select class='gclh_form' id='settings_menu_number_of_lines'>";
            html += "  <option value=\"1\" " + (settings_menu_number_of_lines == "1" ? "selected=\"selected\"" : "") + ">1</option>";
            html += "  <option value=\"2\" " + (settings_menu_number_of_lines == "2" ? "selected=\"selected\"" : "") + ">2</option>";
            html += "  <option value=\"3\" " + (settings_menu_number_of_lines == "3" ? "selected=\"selected\"" : "") + ">3</option>";
            html += "</select>" + show_help("With this option you can choose the number of lines which are necessary to include all the links of the Linklist in the header of the page.<br><br>" + t_reqChlSLoT) + "<br>";
            html += "<input type='checkbox' " + (getValue('settings_menu_show_separator') ? "checked='checked'" : "" ) + " id='settings_menu_show_separator'>Show separator between the links" + show_help(t_reqChlSLoT) + "<br>";
            html += "&nbsp;" + "Font color at GC drop-down lists: <input class='gclh_form color' type='text' size=5 id='settings_font_color_submenuX0' value='" + getValue("settings_font_color_submenu", "93B516") + "'>";
            html += "<img src=" + global_restore_icon + " id='restore_settings_font_color_submenuX0' title='back to default' style='width: 12px; cursor: pointer;'>" + show_help("With this option you can choose the font color at the GC drop-down lists. The default font color is 93B516 (lime green).<br><br>" + t_reqChlSLoT) + "<br>";
            html += "&nbsp;" + "Font size at GC drop-down lists: <select class='gclh_form' id='settings_font_size_submenuX0'>";
            for (var i = 6; i < 17; i++) {
                html += "  <option value='" + i + "' " + (settings_font_size_submenu == i ? "selected=\"selected\"" : "") + ">" + i + "</option>";
            }
            html += "</select> px" + show_help("With this option you can only choose the font size at the remaining GC drop-down lists in pixel. The default font size is 15 pixel.<br><br>" + t_reqChlSLoT) + "<br>";
            html += "&nbsp;" + "Distance between GC drop-down links: <select class='gclh_form' id='settings_distance_submenuX0'>";
            for (var i = 0; i < 33; i++) {
                html += "  <option value='" + i + "' " + (settings_distance_submenu == i ? "selected=\"selected\"" : "") + ">" + i + "</option>";
            }
            html += "</select> px" + show_help("With this option you can only choose the distance between the remaining GC drop-down links in vertical direction in pixel. <br><br>" + t_reqChlSLoT) + "<br>";
            html += "</div>";
            html += "<br>";

            // Linklist: Rechte Spalte mit den ausgewählten BMs.
            // ---------
            var firstCust = 0;
            for (var j = 0; j < bookmarks.length; j++) {
                if (bookmarks[j].custom) {
                    firstCust = j;
                    break;
                }
            }
            html += "<div style='float:right; width:197px;margin-left:10px;' div>";
            // Überschrift, rechte Spalte.
            html += "<p class='ll_heading'>Linklist" + show_help("In this column you can organize your Linklist. With the left button you can grab and move an element forwards or backwards. With the right button you can delete an element from the Linklist. You delete the element only from the Linklist, in the left columns the element is preserved.<br><br>The Linklist requires \"Show Linklist on top\" or \"Show Linklist on your dashboard\".") + "</p>";
            html += "<table class='gclh_form' style='width:100%; border: 2px solid #778555; border-radius: 7px; border-collapse: inherit;'>";
            // Ausgewählte BMs für Linklist, rechte Spalte.
            html += "  <tbody id='gclh_LinkListTop'>";
            var order = JSON.parse(getValue("settings_bookmarks_list", "[]").replace(/, (?=,)/g, ",null"));
            // Platzhalter, falls keine BMs ausgewählt.
            if (order.length == 0) {
                html += "    <tr style='height: 25px;' class='gclh_LinkListPlaceHolder'>";
                html += "      <td>Drop here...</td></tr>";
            } else {
                for (var i = 0; i < order.length; i++) {
                    if (typeof(order[i]) == "undefined") continue;
                    if (typeof(order[i]) == "object") continue;
                    if (typeof(bookmarks[order[i]]) == "undefined") continue;
                    if (bookmarks[order[i]].custom) {
                        var text = (typeof(bookmarks_orig_title[order[i]]) != "undefined" && bookmarks_orig_title[order[i]] != "" ? bookmarks_orig_title[order[i]] : bookmarks[order[i]]['title']);
                        var textTitle = "Custom" + (order[i] - firstCust);
                        if (!text.match(/(\S+)/)) text = textTitle;
                    } else {
                        var text = bookmarks[order[i]]['title'];
                        var textTitle = (typeof(bookmarks_orig_title[order[i]]) != "undefined" && bookmarks_orig_title[order[i]] != "" ? bookmarks_orig_title[order[i]] : bookmarks[order[i]]['title']);
                    }
                    var textName = textTitle;
                    html += "    <tr style='height: 25px;' class='gclh_LinkListInlist' id='gclh_LinkListTop_" + order[i] + "' name='" + textName + "' title='" + textTitle + "'>";
                    html += "      <td style='vertical-align: top; text-overflow: ellipsis; max-width: 166px; overflow: hidden; white-space: nowrap;'>";
                    html += "        <img style='height: 12px; margin-right: 3px; cursor: grab;' title='Grab it' src='" + global_grab_it_icon + "'/>";
                    html +=          text;
                    html += "      </td>";
                    html += "      <td><img style='height: 20px; margin-left: 0px; vertical-align: top; cursor: pointer;' title ='Delete it' class='gclh_LinkListDelIcon' src='" + global_del_it_icon + "'/></td></tr>";
                }
            }
            html += "  </tbody>";
            html += "</table>";
            html += "</div>";

            // Linklist: Beide linken Spalten mit möglichen BMs und abweichenden Bezeichnungen und Seitenbuttons.
            // ---------
            // BMs nach Bezeichnung sortieren.
            sortBookmarksByDescription(settings_sort_default_bookmarks, bookmarks);

            html += "<table>";
            // Überschrift.
            html += "  <thead>";
            html += "    <tr><td><span class='ll_heading' title='Default links for the Linklist'>Default links</span>" + show_help2("In this column are the default links for the Linklist. There are standard links and custom links.<br><br>You can choose the standard links you want to use in your Linklist.<br><br>If there is a text field, then it is a custom link. In this text field you can type any URL you want to be added to the Linklist. The checkbox behind defines, if the link should be opened in a new window.<br><br>With the left button you can grab and move an element to the Linklist.<br><br>If you have problems to drag & drop the lower links because the Linklist area is not on the screen, then use the arrow high key on your keyboard during you hold the mouseclick.") + "</td>";
            html += "      <td><span class='ll_heading' title='Differing description / description'>Description</span>" + show_help("In this column you can type a differing description for the standard link, if it is a standard link. <br><br>If it is a custom link, you have to type a decription for the custom link. <br><br>If you have problems to drag & drop the lower links because the Linklist area is not on the screen, then use the arrow high key on your keyboard during you hold the mouseclick.") + "</td></tr>";
            html += "  </thead>";
            // Beide linken Spalten.
            html += "  <tbody>";
            var cust = 0;
            for (var i = 0; i < bookmarks.length; i++) {
                var num = bookmarks[i]['number'];
                html += "<tr>";
                // Erste linke Spalte mit möglichen BMs:
                html += "  <td style='width: 202px; z-index: 1004;' align='left' class='gclh_LinkListElement' id='gclh_LinkListElement_" + num + "' >";
                html += "    <img style='height: 12px; margin-right: 3px; cursor: grab;' title='' src='"+global_grab_it2_icon+"' />";
                if (typeof(bookmarks[i]['custom']) != "undefined" && bookmarks[i]['custom'] == true) {
                    html += "<input style='padding-left: 2px !important; padding-right: 2px !important;' class='gclh_form' type='text' title='Custom link' id='settings_custom_bookmark[" + cust + "]' value='" + bookmarks[i]['href'] + "' size='15'> ";
                    html += "<input type='checkbox' style='margin-left: 1px;' title='Open in new window' " + (bookmarks[i]['target'] == "_blank" ? "checked='checked'" : "" ) + " id='settings_custom_bookmark_target[" + cust + "]'>";
                    cust++;
                } else {
                    html += "<a class='gclh_ref' title='Standard link with description' ";
                    for (attr in bookmarks[i]) {
                        if (attr != "title") {
                            html +=      attr + "='" + bookmarks[i][attr] + "' ";
                        }
                    }
                    var outTitle = (typeof(bookmarks_orig_title[num]) != "undefined" && bookmarks_orig_title[num] != "" ? bookmarks_orig_title[num] : bookmarks[i]['title']);
                    html += ">" + outTitle + "</a>";
                    if (num >= 69 && num <= 69) html += newParameterLL2;
                    if (num >= 70 && num <= 73 || num == 25) html += newParameterLL3;
                }
                html += "  </td>";
                // Zweite linke Spalte mit abweichenden Bezeichnungen:
                html += "  <td align='left' style='padding: 0px 2px 1px 2px;'>";
                if (typeof(bookmarks[i]['custom']) != "undefined" && bookmarks[i]['custom'] == true) {
                    html += "<input style='padding-left: 2px !important; padding-right: 2px !important;' class='gclh_form' title='Description for custom link' id='bookmarks_name[" + num + "]' type='text' size='15' value='" + getValue("settings_bookmarks_title[" + num + "]", "") + "'>";
                } else {
                    html += "<input style='padding-left: 2px !important; padding-right: 2px !important;' class='gclh_form' title='Differing description for standard link' id='bookmarks_name[" + num + "]' type='text' size='15' value='" + getValue("settings_bookmarks_title[" + num + "]", "") + "'>";
                    if (num >= 69 && num <= 69) html += newParameterLLVersionSetzen(0.8);
                    if (num >= 70 && num <= 73 || num == 25) html += newParameterLLVersionSetzen(0.9);
                }
                html += "  </td></tr>";
            }
            html += "  </tbody>";
            html += "</table>";
            html += "</div>";

            html += "<br><br><br>";
            html += "&nbsp;" + "<input class='gclh_form' type='button' value='" + setValueInSaveButton() + "' id='btn_save'> <input class='gclh_form' type='button' value='save & upload' id='btn_saveAndUpload'> <input class='gclh_form' type='button' value='" + setValueInCloseButton() + "' id='btn_close2'>";
            html += "<div width='450px' align='right' class='gclh_small' style='float: right; margin-top: -5px;'>Copyright © <a href='https://www.geocaching.com/profile/?u=Torsten-' target='_blank'>Torsten Amshove</a>, <a href='https://www.geocaching.com/profile/?u=2Abendsegler' target='_blank'>2Abendsegler</a></div>";
            html += "<div width='400px' align='right' class='gclh_small' style='float: right; margin-top: -15px;'>License: <a href='https://github.com/2Abendsegler/GClh/blob/master/docu/license.md#readme' target='_blank' title='GNU General Public License Version 2'>GPLv2</a>, Warranty: <a href='https://github.com/2Abendsegler/GClh/blob/master/docu/warranty.md#readme' target='_blank' title='GC little helper comes with ABSOLUTELY NO WARRANTY'>NO</a></div>";
            html += "</div></div>";

            // Config Content: Aufbauen, Reset Area verbergen, Special Links Nearest List/Map, Own Trackables versorgen.
            // ---------------
            div.innerHTML = html;
            document.getElementsByTagName('body')[0].appendChild(div);
            $('#gclh_config_content2').hide();
            $('#settings_show_homezone,#settings_use_gclh_layercontrol,#settings_bookmarks_top_menu,#settings_bookmarks_top_menu_h').addClass('shadowBig');
            setSpecialLinks();

            // Config Content: Hauptbereiche hideable machen.
            // ---------------
            function makeConfigAreaHideable(configArea) {
                if (document.getElementById("lnk_gclh_config_" + configArea)) {
                    showHideBoxCL("lnk_gclh_config_" + configArea, true);
                    document.getElementById("lnk_gclh_config_" + configArea).addEventListener("click", function() {showHideBoxCL(this.id, false);}, false);
                    // Show, hide all areas in config with one click with the right mouse.
                    document.getElementById("lnk_gclh_config_" + configArea).oncontextmenu = function(){return false;};
                    $('#lnk_gclh_config_' + configArea).bind('contextmenu.new', function() {showHideConfigAll(this.id, false);});
                }
            }
            // Anfangsbestand, Events setzen.
            if (settings_make_config_main_areas_hideable && !document.location.href.match(/#a#/i)) {
                makeConfigAreaHideable("global");
                makeConfigAreaHideable("config");
                makeConfigAreaHideable("nearestlist");
                makeConfigAreaHideable("pq");
                makeConfigAreaHideable("bm");
                makeConfigAreaHideable("recview");
                makeConfigAreaHideable("friends");
                makeConfigAreaHideable("hide");
                makeConfigAreaHideable("others");
                makeConfigAreaHideable("maps");
                makeConfigAreaHideable("profile");
                makeConfigAreaHideable("db");
                makeConfigAreaHideable("listing");
                makeConfigAreaHideable("logging");
                makeConfigAreaHideable("mail");
                makeConfigAreaHideable("linklist");
            }

            // Linklist: Events, Anfangsbestand aufbauen.
            // ---------
            for (var i = 0; i < bookmarks.length; i++) {
                // Input Events aufbauen, Spalte 2, abweichende Bezeichnungen.
                document.getElementById('bookmarks_name[' + i + ']').addEventListener("input", updateByInputDescription, false);
                // Anfangsbestand aufbauen. Prüfen, ob BM in Linklist. Cursor, Opacity entsprechend setzen.
                if (document.getElementById('gclh_LinkListTop_' + i)) {
                    flagBmInLl(document.getElementById('gclh_LinkListElement_' + i), false, "not-allowed", "0.4", "Already available in Linklist");
                } else {
                    flagBmInLl(document.getElementById('gclh_LinkListElement_' + i), false, "grab", "1", "Grab it");
                }
            }
            var elem = document.getElementsByClassName('gclh_LinkListInlist');
            for (var i = 0; i < elem.length; i++) {
                // Mousedown, Mouseup Events aufbauen, rechte Spalte, Move Icon und Bezeichnung.(Nicht Delete Icon.)
                elem[i].children[0].children[0].addEventListener("mousedown", function(event){changeAttrMouse(event, this, "move");}, false); // Move Icon
                elem[i].children[0].addEventListener("mousedown", function(event){changeAttrMouse(event, this, "desc");}, false);             // Description
                elem[i].children[0].children[0].addEventListener("mouseup", function(event){changeAttrMouse(event, this, "move");}, false);   // Move Icon
                elem[i].children[0].addEventListener("mouseup", function(event){changeAttrMouse(event, this, "desc");}, false);               // Description
            }

            // Linklist: Delete Icon rechte Spalte.
            // ---------
            $(".gclh_LinkListDelIcon").click(function() {
                var row = this.parentNode.parentNode;
                var tablebody = row.parentNode;
                $(row).remove();
                if (tablebody.children.length == 0) $('<tr class="gclh_LinkListPlaceHolder"><td>Drop here...</td></tr>').appendTo(tablebody);
                // BM als nicht vorhanden in Linklist kennzeichnen.
                var index = this.parentNode.parentNode.id.replace("gclh_LinkListTop_", "");
                flagBmInLl(document.getElementById("gclh_LinkListElement_" + index), false, "grab", "1", "Grab it");
            });

            // Linklist: Drag and Drop von linker Spalte in rechte Spalte und sortieren in rechter Spalte.
            // ---------
            $(".gclh_LinkListElement").draggable({
                revert: "invalid",
                helper: "clone",
                start: function(event, ui) {
                    $(ui.helper).addClass("gclh_form");
                },
                stop: function(event, ui) {
                    $(ui.helper).removeClass("gclh_form");
                }
            });

            $("#gclh_LinkListTop").droppable({
                accept: function(d) {
                    if (!d.hasClass("gclh_LinkListInlist") && d.hasClass("gclh_LinkListElement")) {
                        // Wenn dragging stattfindet, Cursor und Opacity passend setzen.
                        if ($('.gclh_LinkListElement.ui-draggable-dragging').length != 0) {
                            var index = d[0].id.replace("gclh_LinkListElement_", "");
                            if (document.getElementById("gclh_LinkListTop_" + index)) {
                                flagBmInLl(d[0].parentNode.children[2], true, "not-allowed", "1", "");
                            } else {
                                flagBmInLl(d[0].parentNode.children[2], true, "grabbing", "1", "");
                                return true;
                            }
                        }
                    }
                },
                drop: function(event, ui) {
                    // Platzhalter entfernen.
                    $(this).find(".gclh_LinkListPlaceHolder").remove();
                    // Index ermitteln.
                    var index = ui.draggable[0].id.replace("gclh_LinkListElement_", "");
                    // Custom BM?
                    if (ui.draggable[0].children[1].id.match("custom")) {
                        var textTitle = "Custom" + ui.draggable[0].children[1].id.replace("settings_custom_bookmark[", "").replace("]", "");
                    } else var textTitle = ui.draggable[0].children[1].innerHTML;
                    // Abweichende Bezeichnung ermitteln. Falls leer, default nehmen.
                    var text = document.getElementById("bookmarks_name["+index+"]").value;
                    if (!text.match(/(\S+)/)) text = textTitle;
                    var textName = textTitle;
                    // BM in Linklist aufbauen.
                    var htmlRight = "";
                    htmlRight += "<td style='vertical-align: top; text-overflow: ellipsis; max-width: 166px; overflow: hidden; white-space: nowrap;'>";
                    htmlRight += "  <img style='height: 12px; margin-right: 3px; cursor: grab;' title ='Grab it' src='"+global_grab_it_icon+"' />";
                    htmlRight +=    text;
                    htmlRight += "</td>";
                    htmlRight += "<td>";
                    htmlRight += " <img class='gclh_LinkListDelIcon' style='height: 20px; margin-left: 0px; vertical-align: top; cursor: pointer;' title ='Delete it' src='" + global_del_it_icon + "' />";
                    htmlRight += "</td>";
                    var row = $("<tr style='height: 25px;' class='gclh_LinkListInlist' id='gclh_LinkListTop_" + index + "' name='" + textName + "' title='" + textTitle + "'></tr>").html(htmlRight);
                    // Entsprechende Bookmark als vorhanden in Linklist kennzeichnen.
                    flagBmInLl(document.getElementById("gclh_LinkListElement_" + index), false, "not-allowed", "0.4", "Already available in Linklist");
                    // Click Event für Delete Icon aufbauen.
                    row.find(".gclh_LinkListDelIcon").click(function() {
                        var row = this.parentNode.parentNode;
                        var tablebody = row.parentNode;
                        $(row).remove();
                        if (tablebody.children.length == 0) $('<tr class="gclh_LinkListPlaceHolder"><td>Drop here...</td></tr>').appendTo(tablebody);
                    });
                    $(row).appendTo(this);
                }
            }).sortable({
                items: "tr:not(.gclh_LinkListPlaceHolder)"
            });

            // Map / Layers:
            // -------------
            function layerOption(name, selected) {
                return "<option value='" + name + "' " + (selected ? "selected='selected'" : "") + ">" + name + "</option>";
            }
            $("#btn_map_layer_right").click(function() {
                var source = "#settings_maplayers_unavailable";
                var destination = "#settings_maplayers_available";
                $(source+" option:selected").each(function() {
                    var name = $(this).html();
                    if (name == settings_map_default_layer) $("#settings_mapdefault_layer").html(name);
                    $(destination).append(layerOption(name, (settings_map_default_layer == name)));
                });
                $(source+" option:selected").remove();
            });
            $("#btn_map_layer_left").click(function() {
                var source = "#settings_maplayers_available";
                var destination = "#settings_maplayers_unavailable";
                $(source+" option:selected").each(function() {
                    var name = $(this).html();
                    if (name == settings_map_default_layer) {
                        $("#settings_mapdefault_layer").html("<i>not available</i>");
                        settings_map_default_layer = "";
                    }
                    $(destination).append(layerOption(name, false));
                });
                $(source+" option:selected").remove();
            });
            $("#btn_set_default_layer").click(function() {
                $("#settings_maplayers_available option:selected").each(function() {
                    var name = $(this).html();
                    $("#settings_mapdefault_layer").html(name);
                    settings_map_default_layer = name;
                });
            });
            // Fill layer lists.
            var layerListAvailable="";
            var layerListUnAvailable="";

            // Wenn bisher keine Layer ausgewählt, alle auswählen.
            if (settings_map_layers == "" || settings_map_layers.length < 1) {
                for (name in all_map_layers) {
                    $("#settings_maplayers_available").append(layerOption(name, (settings_map_default_layer == name)));
                }
            } else {
                for (name in all_map_layers) {
                    if (settings_map_layers.indexOf(name) != -1) $("#settings_maplayers_available").append(layerOption(name, (settings_map_default_layer == name)));
                    else $("#settings_maplayers_unavailable").append(layerOption(name, false));
                }
            }
            // Show/Hide Einstellungen zu Layers in Map.
            $("#settings_use_gclh_layercontrol").click(function() {
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
                $el.find('.remove').click(function() {
                    $(this).closest('.multi_homezone_element').remove();
                });
            }
            // Initialize remove listener for present elements.
            gclh_init_multi_homecoord_remove_listener($('.multi_homezone_settings'));
            // Initialize add listener for multi homecoord entries.
            $('.multi_homezone_settings .addentry').click(function() {
                var $newEl = $(hztp);
                $('.multi_homezone_settings tbody').append($newEl);
                // Initialize remove listener for new element.
                gclh_init_multi_homecoord_remove_listener($newEl);
                // Reinit jscolor.
                if (typeof(chrome) != "undefined") {
                    $('.gclh_form.color:not(.withPicker)').each(function(i, e) {
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
            // Show/Hide Einstellungen zu Homezone circels.
            $("#settings_show_homezone").click(function() {
                $("#ShowHomezoneCircles").toggle();
            });

            // Rest:
            // -----
            function gclh_show_linklist() {
                if (document.getElementById('lnk_gclh_config_linklist').title == "show") document.getElementById('lnk_gclh_config_linklist').click();
            }

            $('#check_for_upgrade')[0].addEventListener("click", function() {checkForUpgrade(true);}, false);
            $('#rc_link')[0].addEventListener("click", rcPrepare, false);
            $('#rc_reset_button')[0].addEventListener("click", rcReset, false);
            $('#rc_close_button')[0].addEventListener("click", rcClose, false);
            $('#gclh_linklist_link_1')[0].addEventListener("click", gclh_show_linklist, false);
            $('#gclh_linklist_link_2')[0].addEventListener("click", gclh_show_linklist, false);
            $('#btn_close2')[0].addEventListener("click", btnClose, false);
            $('#btn_save')[0].addEventListener("click", function() {btnSave("normal");}, false);
            $('#btn_saveAndUpload')[0].addEventListener("click", function() {btnSave("upload");}, false);
            $('#settings_bookmarks_on_top')[0].addEventListener("click", handleRadioTopMenu, false);
            $('#settings_bookmarks_top_menu')[0].addEventListener("click", handleRadioTopMenu, false);
            $('#settings_bookmarks_top_menu_h')[0].addEventListener("click", handleRadioTopMenu, false);
            handleRadioTopMenu(true);
            $('#settings_load_logs_with_gclh')[0].addEventListener("click", alert_settings_load_logs_with_gclh, false);
            $('#restore_settings_lines_color_zebra')[0].addEventListener("click", restoreField, false);
            $('#restore_settings_lines_color_user')[0].addEventListener("click", restoreField, false);
            $('#restore_settings_lines_color_owner')[0].addEventListener("click", restoreField, false);
            $('#restore_settings_lines_color_reviewer')[0].addEventListener("click", restoreField, false);
            $('#restore_settings_lines_color_vip')[0].addEventListener("click", restoreField, false);
            $('#restore_settings_font_color_menu')[0].addEventListener("click", restoreField, false);
            $('#restore_settings_font_color_menuX0')[0].addEventListener("click", restoreField, false);
            $('#restore_settings_font_color_submenu')[0].addEventListener("click", restoreField, false);
            $('#restore_settings_font_color_submenuX0')[0].addEventListener("click", restoreField, false);
            $('#restore_settings_count_own_matrix_show_color_next')[0].addEventListener("click", restoreField, false);
            $('#settings_process_vup')[0].addEventListener("click", alert_settings_process_vup, false);

            // Events setzen für Parameter, die im GClh Config mehrfach ausgegeben wurden, weil sie zu mehreren Themen gehören. Es handelt sich hier um den Parameter selbst.
            // In der Function werden Events für den Parameter selbst (ZB: "settings_show_mail_in_viplist") und dessen Clone gesetzt, die hinten mit "X" und Nummerierung
            // von 0-9 enden können (ZB: "settings_show_mail_in_viplistX0").
            setEventsForDoubleParameters("settings_show_mail_in_viplist", "click");
            setEventsForDoubleParameters("settings_log_inline_tb", "click");
            setEventsForDoubleParameters("settings_font_color_menu", "input");
            setEventsForDoubleParameters("settings_font_color_menu", "change");
            setEventsForDoubleParameters("settings_font_color_submenu", "input");
            setEventsForDoubleParameters("settings_font_color_submenu", "change");
            setEventsForDoubleParameters("settings_font_size_menu", "input");
            setEventsForDoubleParameters("settings_distance_menu", "input");
            setEventsForDoubleParameters("settings_font_size_submenu", "input");
            setEventsForDoubleParameters("settings_distance_submenu", "input");
            setEventsForDoubleParameters("settings_show_log_it", "click");
            setEventsForDoubleParameters("settings_logit_for_basic_in_pmo", "click");
            setEventsForDoubleParameters("settings_show_thumbnails", "click");
            setEventsForDoubleParameters("settings_hover_image_max_size", "input");
            setEventsForDoubleParameters("settings_imgcaption_on_top", "click");
            setEventsForDoubleParameters("settings_submit_log_button", "click");

            // Events setzen für Parameter, die im GClh Config eine Abhängigkeit derart auslösen, dass andere Parameter aktiviert bzw. deaktiviert werden müssen.
            // ZB. können Mail Icons in VIP List (Parameter "settings_show_mail_in_viplist") nur aufgebaut werden, wenn Mail Icons überhaupt erzeugt werden (Parameter
            // "settings_show_mail"). Clone auch berücksichtigen.
            setEventsForDependentParameters("settings_change_header_layout", "settings_show_smaller_gc_link");
            setEventsForDependentParameters("settings_change_header_layout", "settings_remove_logo");
            setEventsForDependentParameters("settings_show_smaller_gc_link", "settings_remove_logo");
            setEventsForDependentParameters("settings_change_header_layout", "settings_remove_message_in_header");
            setEventsForDependentParameters("settings_change_header_layout", "settings_gc_tour_is_working");
            setEventsForDependentParameters("settings_change_header_layout", "settings_fixed_header_layout");
            setEventsForDependentParameters("settings_change_header_layout", "settings_font_color_menu");
            setEventsForDependentParameters("settings_change_header_layout", "restore_settings_font_color_menu");
            setEventsForDependentParameters("settings_change_header_layout", "settings_font_color_submenu");
            setEventsForDependentParameters("settings_change_header_layout", "restore_settings_font_color_submenu");
            setEventsForDependentParameters("settings_change_header_layout", "settings_bookmarks_top_menu_h");
            setEventsForDependentParameters("settings_change_header_layout", "settings_menu_float_right");
            setEventsForDependentParameters("settings_change_header_layout", "settings_font_size_menu");
            setEventsForDependentParameters("settings_change_header_layout", "settings_distance_menu");
            setEventsForDependentParameters("settings_change_header_layout", "settings_font_size_submenu");
            setEventsForDependentParameters("settings_change_header_layout", "settings_distance_submenu");
            setEventsForDependentParameters("settings_change_header_layout", "settings_menu_number_of_lines");
            setEventsForDependentParameters("settings_change_header_layout", "settings_menu_show_separator");
            setEventsForDependentParameters("settings_bookmarks_on_top", "settings_bookmarks_top_menu_h");
            setEventsForDependentParameters("settings_bookmarks_on_top", "settings_bookmarks_search");
            setEventsForDependentParameters("settings_bookmarks_on_top", "settings_bookmarks_search_default");
            setEventsForDependentParameters("settings_bookmarks_on_top", "settings_menu_float_right");
            setEventsForDependentParameters("settings_bookmarks_on_top", "settings_menu_number_of_lines");
            setEventsForDependentParameters("settings_bookmarks_on_top", "settings_menu_show_separator");
            setEventsForDependentParameters("settings_load_logs_with_gclh", "settings_show_mail_in_viplist");
            setEventsForDependentParameters("settings_load_logs_with_gclh", "settings_show_cache_listings_in_zebra");
            setEventsForDependentParameters("settings_load_logs_with_gclh", "settings_show_cache_listings_color_user");
            setEventsForDependentParameters("settings_load_logs_with_gclh", "settings_show_cache_listings_color_owner");
            setEventsForDependentParameters("settings_load_logs_with_gclh", "settings_show_cache_listings_color_reviewer");
            setEventsForDependentParameters("settings_load_logs_with_gclh", "settings_show_cache_listings_color_vip");
            setEventsForDependentParameters("settings_show_vip_list", "settings_show_cache_listings_color_vip");
            setEventsForDependentParameters("settings_show_vip_list", "settings_show_tb_listings_color_vip");
            setEventsForDependentParameters("settings_show_vip_list", "settings_lines_color_vip");
            setEventsForDependentParameters("settings_show_vip_list", "restore_settings_lines_color_vip");
            setEventsForDependentParameters("settings_show_vip_list", "settings_show_owner_vip_list");
            setEventsForDependentParameters("settings_show_vip_list", "settings_show_long_vip");
            setEventsForDependentParameters("settings_show_vip_list", "settings_vip_show_nofound");
            setEventsForDependentParameters("settings_show_vip_list", "settings_show_mail_in_viplist");
            setEventsForDependentParameters("settings_show_vip_list", "settings_show_mail_in_allmyvips");
            setEventsForDependentParameters("settings_show_vip_list", "settings_make_vip_lists_hideable");
            setEventsForDependentParameters("settings_show_vip_list", "settings_process_vup");
            setEventsForDependentParameters("settings_show_vip_list", "settings_show_vup_friends");
            setEventsForDependentParameters("settings_show_vip_list", "settings_vup_hide_avatar");
            setEventsForDependentParameters("settings_show_vip_list", "settings_vup_hide_log");
            setEventsForDependentParameters("settings_process_vup", "settings_show_vup_friends");
            setEventsForDependentParameters("settings_process_vup", "settings_vup_hide_avatar");
            setEventsForDependentParameters("settings_process_vup", "settings_vup_hide_log");
            setEventsForDependentParameters("settings_vup_hide_avatar", "settings_vup_hide_log");
            setEventsForDependentParameters("settings_log_inline", "settings_log_inline_tb", false);
            setEventsForDependentParameters("settings_log_inline_pmo4basic", "settings_log_inline_tb", false);
            setEventsForDependentParameters("settings_show_mail", "settings_show_mail_in_viplist");
            setEventsForDependentParameters("settings_show_mail", "settings_show_mail_in_allmyvips");
            setEventsForDependentParameters("settings_show_mail", "settings_mail_icon_new_win");
            setEventsForDependentParameters("settings_show_message", "settings_message_icon_new_win");
            setEventsForDependentParameters("settings_show_thumbnails", "settings_hover_image_max_size");
            setEventsForDependentParameters("settings_show_thumbnails", "settings_spoiler_strings");
            setEventsForDependentParameters("settings_show_thumbnails", "settings_imgcaption_on_top");
            setEventsForDependentParameters("settings_show_thumbnailsX0", "settings_hover_image_max_size");
            setEventsForDependentParameters("settings_show_thumbnailsX0", "settings_spoiler_strings");
            setEventsForDependentParameters("settings_show_thumbnailsX0", "settings_imgcaption_on_top");
            setEventsForDependentParameters("settings_map_overview_build", "settings_map_overview_zoom");
            setEventsForDependentParameters("settings_count_own_matrix_show_next", "settings_count_own_matrix_show_count_next");
            setEventsForDependentParameters("settings_count_own_matrix_show_next", "settings_count_own_matrix_show_color_next");
            setEventsForDependentParameters("settings_count_own_matrix_show_next", "restore_settings_count_own_matrix_show_color_next");
            setEventsForDependentParameters("settings_count_own_matrix_show_next", "settings_count_own_matrix_links_radius");
            setEventsForDependentParameters("settings_count_own_matrix_show_next", "settings_count_own_matrix_links");
            setEventsForDependentParameters("settings_add_link_gc_map_on_google_maps", "settings_switch_to_gc_map_in_same_tab");
            setEventsForDependentParameters("settings_add_link_google_maps_on_gc_map", "settings_switch_to_google_maps_in_same_tab");
            setEventsForDependentParameters("settings_add_link_gc_map_on_osm", "settings_switch_from_osm_to_gc_map_in_same_tab");
            setEventsForDependentParameters("settings_add_link_osm_on_gc_map", "settings_switch_to_osm_in_same_tab");
            setEventsForDependentParameters("settings_add_link_flopps_on_gc_map", "settings_switch_to_flopps_in_same_tab");
            setEventsForDependentParameters("settings_add_link_geohack_on_gc_map", "settings_switch_to_geohack_in_same_tab");
            setEventsForDependentParameters("settings_show_latest_logs_symbols", "settings_show_latest_logs_symbols_count");
            setEventsForDependentParameters("settings_load_logs_with_gclh", "settings_show_latest_logs_symbols");
            setEventsForDependentParameters("settings_log_statistic", "settings_log_statistic_reload");
            setEventsForDependentParameters("settings_log_statistic", "settings_log_statistic_percentage");
            setEventsForDependentParameters("settings_friendlist_summary", "settings_friendlist_summary_viponly");
            setEventsForDependentParameters("settings_remove_banner", "settings_remove_banner_for_garminexpress");
            setEventsForDependentParameters("settings_remove_banner", "settings_remove_banner_blue");
            setEventsForDependentParameters("settings_driving_direction_link", "settings_driving_direction_parking_area");
            setEventsForDependentParameters("settings_improve_add_to_list", "settings_improve_add_to_list_height");
            setEventsForDependentParameters("settings_set_default_langu", "settings_default_langu");
            setEventsForDependentParameters("settings_pq_set_cachestotal", "settings_pq_cachestotal");
            setEventsForDependentParameters("settings_pq_set_difficulty", "settings_pq_difficulty");
            setEventsForDependentParameters("settings_pq_set_difficulty", "settings_pq_difficulty_score");
            setEventsForDependentParameters("settings_pq_set_terrain", "settings_pq_terrain");
            setEventsForDependentParameters("settings_pq_set_terrain", "settings_pq_terrain_score");
            setEventsForDependentParameters("settings_show_all_logs", "settings_show_all_logs_count");
            setEventsForDependentParameters("settings_show_eventday", "settings_date_format");
            setEventsForDependentParameters("settings_strike_archived", "settings_highlight_usercoords");
            setEventsForDependentParameters("settings_strike_archived", "settings_highlight_usercoords_bb");
            setEventsForDependentParameters("settings_strike_archived", "settings_highlight_usercoords_it");
            setEventsForDependentParameters("settings_but_search_map", "settings_but_search_map_new_tab");
            // Abhängigkeiten der Linklist Parameter.
            for (var i = 0; i < 100; i++) {
                // 2. Spalte: Links für Custom BMs.
                if (document.getElementById("gclh_LinkListElement_" + i)) {
                    setEventsForDependentParameters("settings_bookmarks_on_top", "gclh_LinkListElement_" + i, false);
                    setEventsForDependentParameters("settings_bookmarks_show", "gclh_LinkListElement_" + i, false);
                }
                if (document.getElementById("settings_custom_bookmark[" + i + "]")) {
                    setEventsForDependentParameters("settings_bookmarks_on_top", "settings_custom_bookmark[" + i + "]", false);
                    setEventsForDependentParameters("settings_bookmarks_show", "settings_custom_bookmark[" + i + "]", false);
                }
                // 3. Spalte: Target für Links für Custom BMs.
                if (document.getElementById("settings_custom_bookmark_target[" + i + "]")) {
                    setEventsForDependentParameters("settings_bookmarks_on_top", "settings_custom_bookmark_target[" + i + "]", false);
                    setEventsForDependentParameters("settings_bookmarks_show", "settings_custom_bookmark_target[" + i + "]", false);
                }
                // 4. Spalte: Bezeichnungen.
                if (document.getElementById("bookmarks_name[" + i + "]")) {
                    setEventsForDependentParameters("settings_bookmarks_on_top", "bookmarks_name[" + i + "]", false);
                    setEventsForDependentParameters("settings_bookmarks_show", "bookmarks_name[" + i + "]", false);
                } else break;
            }
            // 5. Spalte: Linklist.
            setEventsForDependentParameters("settings_bookmarks_on_top", "gclh_LinkListTop", false);
            setEventsForDependentParameters("settings_bookmarks_show", "gclh_LinkListTop", false);

            // Anfangsbesetzung herstellen bei Abhängigkeiten.
            setStartForDependentParameters();

            // Save, Close Buttons dynamisch mit F2 bzw. ESC Beschriftung versehen.
            document.getElementById('settings_f2_save_gclh_config').addEventListener("click", setValueInSaveButton, false);
            document.getElementById('settings_esc_close_gclh_config').addEventListener("click", setValueInCloseButton, false);

            // Positionierung innerhalb des GClh Config bei Aufrufen.
            if (document.location.href.match(/#a#/i)) {
                document.location.href = document.location.href.replace(/#a#/i, "#");
                var diff = 4;
                if (document.location.href.match(/#llb#/i)) {
                    if (document.getElementById('settings_bookmarks_top_menu').checked) diff += 141 - 6;
                    else diff += 165 - 25;
                }
                if (document.location.href.match(/#(ll|llb)#/i)) {
                    document.location.href = document.location.href.replace(/#(ll|llb)#/i, "#");
                    gclh_show_linklist();
                }
                if (document.location.href.match(/#(\S+)/)) {
                    var arg = document.location.href.match(/#(.*)/);
                    if (arg) {
                        document.location.href = clearUrlAppendix(document.location.href, false);
                        $('html,body').animate({scrollTop: ($('#'+arg[1]).offset().top) - diff}, 1500, "swing");
                    }
                }
            }
        }

        // Fokusierung auf Verarbeitung, damit Menüs einklappen.
        document.getElementById("settings_overlay").click();

        // Bei F2 Save, bei ESC Close im Config durchführen.
        if (check_config_page()) window.addEventListener('keydown', keydown, true);
        function keydown(e) {
            if (check_config_page()) {
                if (document.getElementById("settings_f2_save_gclh_config").checked && !global_mod_reset) {
                    if (e.keyCode == 113 && noSpecialKey(e)) document.getElementById("btn_save").click();
                }
                if (document.getElementById("settings_esc_close_gclh_config").checked && !global_mod_reset) {
                    if (e.keyCode == 27 && noSpecialKey(e)) document.getElementById("btn_close2").click();
                }
            }
        }

        // Save Button.
        function btnSave(type) {
            window.scroll(0, 0);
            $("#settings_overlay").fadeOut(400);
            document.location.href = clearUrlAppendix(document.location.href, false);
            if (document.getElementById("settings_show_save_message").checked) showSaveForm();
            var settings = {};

            function setValue(key, value) {settings[key] = value;}

            var value = document.getElementById("settings_home_lat_lng").value;
            var latlng = toDec(value);
            if (latlng) {
                if (getValue("home_lat", 0) != parseInt(latlng[0] * 10000000)) setValue("home_lat", parseInt(latlng[0] * 10000000));  // * 10000000 because GM don't know float.
                if (getValue("home_lng", 0) != parseInt(latlng[1] * 10000000)) setValue("home_lng", parseInt(latlng[1] * 10000000));
            }
            setValue("settings_bookmarks_search_default", document.getElementById('settings_bookmarks_search_default').value);
            setValue("settings_show_all_logs_count", document.getElementById('settings_show_all_logs_count').value);

            // Homezone circle.
            setValue("settings_homezone_radius", document.getElementById('settings_homezone_radius').value);
            setValue("settings_homezone_color", document.getElementById('settings_homezone_color').value);
            if (document.getElementById('settings_homezone_opacity').value <= 100 && document.getElementById('settings_homezone_opacity').value >= 0) setValue("settings_homezone_opacity", document.getElementById('settings_homezone_opacity').value);
            // Multi Homezone circles.
            var settings_multi_homezone = {};
            var $hzelements = $('.multi_homezone_element');
            for (var i = 0; i < $hzelements.length; i++) {
                var $curEl = $hzelements.eq(i);
                settings_multi_homezone[i] = {};
                var latlng = toDec($curEl.find('.coords:eq(0)').val());
                settings_multi_homezone[i].lat = parseInt(latlng[0] * 10000000);
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
            setValue("settings_mail_signature", document.getElementById('settings_mail_signature').value.replace(/‌/g, ""));  // Entfernt Steuerzeichen.
            setValue("settings_log_signature", document.getElementById('settings_log_signature').value.replace(/‌/g, ""));
            setValue("settings_tb_signature", document.getElementById('settings_tb_signature').value.replace(/‌/g, ""));
            setValue("settings_map_default_layer", settings_map_default_layer);
            setValue("settings_hover_image_max_size", document.getElementById('settings_hover_image_max_size').value);
            setValue("settings_spoiler_strings", document.getElementById('settings_spoiler_strings').value);
            setValue("settings_font_size_menu", document.getElementById('settings_font_size_menu').value);
            setValue("settings_font_size_submenu", document.getElementById('settings_font_size_submenu').value);
            setValue("settings_distance_menu", document.getElementById('settings_distance_menu').value);
            setValue("settings_distance_submenu", document.getElementById('settings_distance_submenu').value);
            setValue("settings_font_color_menu", document.getElementById('settings_font_color_menu').value);
            setValue("settings_font_color_submenu", document.getElementById('settings_font_color_submenu').value);
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
            setValue("settings_improve_add_to_list_height", document.getElementById('settings_improve_add_to_list_height').value);

            // Map Layers in vorgegebener Reihenfolge übernehmen.
            var new_map_layers_available = document.getElementById('settings_maplayers_available');
            var new_settings_map_layers = new Array();
            for (name in all_map_layers) {
                for (var i = 0; i < new_map_layers_available.options.length; i++) {
                    if (name == new_map_layers_available.options[i].value) {
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
                'settings_esc_close_gclh_config',
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
                'settings_show_google_maps',
                'settings_show_log_it',
                'settings_show_nearestuser_profil_link',
                'settings_show_homezone',
                'settings_show_hillshadow',
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
                'settings_my_lists_old_fashioned',
                'settings_remove_banner',
                'settings_remove_banner_for_garminexpress',
                'settings_remove_banner_blue',
                'settings_compact_layout_bm_lists',
                'settings_compact_layout_list_of_bm_lists',
                'settings_compact_layout_pqs',
                'settings_compact_layout_list_of_pqs',
                'settings_compact_layout_nearest',
                'settings_compact_layout_recviewed',
                'settings_map_links_statistic',
                'settings_improve_add_to_list',
                'settings_show_flopps_link',
                'settings_show_brouter_link',
                'settings_show_default_links',
                'settings_bm_changed_and_go',
                'settings_show_tb_inv',
                'settings_but_search_map',
                'settings_but_search_map_new_tab',
                'settings_show_pseudo_as_owner'
            );
            for (var i = 0; i < checkboxes.length; i++) {
                if (document.getElementById(checkboxes[i])) setValue(checkboxes[i], document.getElementById(checkboxes[i]).checked);
            }

            // Save Log-Templates.
            for (var i = 0; i < anzTemplates; i++) {
                var name = document.getElementById('settings_log_template_name[' + i + ']');
                var text = document.getElementById('settings_log_template[' + i + ']');
                if (name && text) {
                    setValue('settings_log_template_name[' + i + ']', name.value);
                    setValue('settings_log_template[' + i + ']', text.value.replace(/‌/g, ""));  // Entfernt das Steuerzeichen.
                }
            }

            // Save Linklist Rechte Spalte.
            var queue = $("#gclh_LinkListTop tr:not(.gclh_LinkListPlaceHolder)");
            var tmp = new Array();
            for (var i = 0; i < queue.length; i++) {tmp[i] = queue[i].id.replace("gclh_LinkListTop_", "");}
            setValue("settings_bookmarks_list", JSON.stringify(tmp));

            // Save Linklist Abweichende Bezeichnungen, 2. Spalte.
            for (var i = 0; i < bookmarks.length; i++) {
                if (document.getElementById('bookmarks_name[' + i + ']') && document.getElementById('bookmarks_name[' + i + ']') != "") {  // Set custom name.
                    setValue("settings_bookmarks_title[" + i + "]", document.getElementById('bookmarks_name[' + i + ']').value);
                }
            }

            // Save Linklist Custom Links, URL, target, linke Spalte.
            for (var i = 0; i < anzCustom; i++) {
                setValue("settings_custom_bookmark[" + i + "]", document.getElementById("settings_custom_bookmark[" + i + "]").value);
                if (document.getElementById('settings_custom_bookmark_target[' + i + ']').checked) setValue('settings_custom_bookmark_target[' + i + ']', "_blank");
                else setValue('settings_custom_bookmark_target[' + i + ']', "");
            }

            setValueSet(settings).done(function() {
                if (type === "upload") {
                    gclh_sync_DB_CheckAndCreateClient()
                        .done(function(){
                            // Means the connection to Dropbox stands, so we can make calls.
                            gclh_sync_DBSave().done(function() {
                                window.location.reload(false);
                            });
                        })
                        .fail(function(){
                            // Means something went wrong or the Dropbox is not authenticated, so we display the Auth Link.
                            alert('GClh is not authorized to use your Dropbox. Please go to the Sync page and \nauthenticate your Dropbox first. Nevertheless your config is saved localy.');
                            window.location.reload(false);
                        });
                } else window.location.reload(false);
            });
            if (getValue("settings_show_save_message")) {
                document.getElementById("save_overlay_h3").innerHTML = "saved";
                if (type === "upload") $("#save_overlay").fadeOut(400);
            }
        }
    }

//////////////////////////////
// Config Functions
//////////////////////////////
// Radio Buttons zur Linklist.
    function handleRadioTopMenu(first) {
        if (first == true) {
            var time = 0;
            var timeShort = 0;
        } else {
            var time = 500;
            var timeShort = 450;
        }
        // Wenn Linklist nicht on top angezeigt werden soll, dann muss unbedingt vertikales Menü aktiv sein, falls nicht vertikales Menü setzen.
        if (!document.getElementById("settings_bookmarks_on_top").checked && !document.getElementById("settings_bookmarks_top_menu").checked) {
            document.getElementById("settings_bookmarks_top_menu").click();
        }
        if (document.getElementById('settings_bookmarks_top_menu').checked) {
            if (document.getElementById('box_top_menu_v').style.display != "block") {
                $("#box_top_menu_v").animate({height: "164px"}, time);
                document.getElementById('box_top_menu_v').style.display = "block";
                setTimeout(function() {
                    $("#box_top_menu_h").animate({height: "0px"}, time);
                    setTimeout(function() {document.getElementById('box_top_menu_h').style.display = "none";}, timeShort);
                }, time);
            }
        }
        if (document.getElementById('settings_bookmarks_top_menu_h').checked) {
            if (document.getElementById('box_top_menu_h').style.display != "block") {
                $("#box_top_menu_h").animate({height: "188px"}, time);
                document.getElementById('box_top_menu_h').style.display = "block";
                setTimeout(function() {
                    $("#box_top_menu_v").animate({height: "0px"}, time);
                    setTimeout(function() {document.getElementById('box_top_menu_v').style.display = "none";}, timeShort);
                }, time);
            }
        }
    }

// Events setzen für Parameter, die im GClh Config mehrfach ausgegeben wurden, weil sie zu mehreren Themen gehören. Es handelt sich hier um den Parameter selbst. Hier
// werden Events für den Parameter selbst (ZB: "settings_show_mail_in_viplist") und dessen Clone gesetzt, die hinten mit einem "X" und Nummerierung von 0-9 enden können
// (ZB: "settings_show_mail_in_viplistX0").
    function setEventsForDoubleParameters(parameterName, event) {
        var paId = parameterName;
        if (document.getElementById(paId)) {
            document.getElementById(paId).addEventListener(event, function() {handleEventsForDoubleParameters(this);}, false);
            for (var i = 0; i < 10; i++) {
                var paIdX = paId + "X" + i;
                if (document.getElementById(paIdX)) {
                    document.getElementById(paIdX).addEventListener(event, function() {handleEventsForDoubleParameters(this);}, false);
                }
            }
        }
    }

// Handling von Events zu Parametern, die im GClh Config mehrfach ausgegeben wurden, weil sie zu mehreren Themen gehören. Es kann sich hier um den Parameter selbst handeln
// (ZB: "settings_show_mail_in_viplist"), oder um dessen Clone, die hinten mit "X" und Nummerierung von 0-9 enden können (ZB: "settings_show_mail_in_viplistX0"). Hier wird
// Wert des eventauslösenden Parameters, das kann auch Clone sein, an den eigentlichen Parameter und dessen Clone weitergereicht.
    function handleEventsForDoubleParameters(parameter) {
        var paId = parameter.id.replace(/(X[0-9]*)/, "");
        if (document.getElementById(paId)) {
            if (document.getElementById(paId).type == "checkbox") {
                document.getElementById(paId).checked = parameter.checked;
                for (var i = 0; i < 10; i++) {
                    var paIdX = paId + "X" + i;
                    if (document.getElementById(paIdX)) document.getElementById(paIdX).checked = parameter.checked;
                }
            } else if (parameter.id.match(/_color_/)) {
                document.getElementById(paId).value = parameter.value;
                document.getElementById(paId).style.backgroundColor = "#" + parameter.value;
                document.getElementById(paId).style.color = parameter.style.color;
                for (var i = 0; i < 10; i++) {
                    var paIdX = paId + "X" + i;
                    if (document.getElementById(paIdX)) {
                        document.getElementById(paIdX).value = parameter.value;
                        document.getElementById(paIdX).style.backgroundColor = "#" + parameter.value;
                        document.getElementById(paIdX).style.color = parameter.style.color;
                    }
                }
            } else {
                document.getElementById(paId).value = parameter.value;
                for (var i = 0; i < 10; i++) {
                    var paIdX = paId + "X" + i;
                    if (document.getElementById(paIdX)) document.getElementById(paIdX).value = parameter.value;
                }
            }
        }
    }

// Events setzen für Parameter, die im GClh Config eine Abhängigkeit derart auslösen, dass andere Parameter aktiviert bzw. deaktiviert
// werden müssen. ZB: können Mail Icons in VIP List (Parameter "settings_show_mail_in_viplist") nur dann aufgebaut werden, wenn Mail Icons
// überhaupt erzeugt werden (Parameter "settings_show_mail"). Clone müssen hier auch berücksichtigt werden.
    function setEventsForDependentParameters(parameterName, parameterNameDependent, allActivated) {
        var paId = parameterName;
        var paIdDep = parameterNameDependent;
        var countDep = global_dependents.length;
        if (allActivated != false) allActivated = true;

        // Wenn Parameter und abhängiger Parameter existieren, dann für Parameter Event setzen, falls nicht vorhanden und Parameter, abhängigen Parameter merken.
        if (document.getElementById(paId) && document.getElementById(paIdDep)) {
            var available = false;
            for (var i = 0; i < countDep; i++) {
                if (global_dependents[i]["paId"] == paId) {
                    available = true;
                    break;
                }
            }
            if (available == false) {
                document.getElementById(paId).addEventListener("click", function() {handleEventsForDependentParameters(this);}, false);
            }
            global_dependents[countDep] = new Object();
            global_dependents[countDep]["paId"] = paId;
            global_dependents[countDep]["paIdDep"] = paIdDep;
            global_dependents[countDep]["allActivated"] = allActivated;

            // Alle möglichen Clone zum abhängigen Parameter suchen.
            for (var i = 0; i < 10; i++) {
                var paIdDepX = paIdDep + "X" + i;
                // Wenn Clone zum abhängigen Parameter existiert, dann Parameter und Clone zum abhängigen Parameter merken.
                if (document.getElementById(paIdDepX)) {
                    countDep++;
                    global_dependents[countDep] = new Object();
                    global_dependents[countDep]["paId"] = paId;
                    global_dependents[countDep]["paIdDep"] = paIdDepX;
                    global_dependents[countDep]["allActivated"] = allActivated;
                } else break;
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
            if (paIdCompare != copy_global_dependents[i]["paId"]) {
                if (document.getElementById(copy_global_dependents[i]["paId"])) {
                    var parameter = document.getElementById(copy_global_dependents[i]["paId"]);
                    handleEventsForDependentParameters(parameter);
                }
                paIdCompare = copy_global_dependents[i]["paId"];
            }
        }
    }
    // Handling Events.
    function handleEventsForDependentParameters(parameter) {
        var paId = parameter.id;
        var countDep = global_dependents.length;
        var copy_global_dependents = global_dependents;

        // Wenn Parameter existiert, dann im Array der abhängigen Parameter nachsehen, welche abhängigen Parameter es dazu gibt.
        if (document.getElementById(paId)) {
            for (var i = 0; i < countDep; i++) {
                if (global_dependents[i]["paId"] == paId) {

                    // Wenn abhängige Parameter existiert.
                    if (document.getElementById(global_dependents[i]["paIdDep"])) {
                        // Wenn Parameter markiert, dann soll abhängiger Parameter aktiviert werden. Zuvor prüfen, ob alle Parameter zu diesem abhängigen Parameter aktiviert
                        // werden sollen. Nur dann darf abhängiger Parameter aktiviert werden. (ZB: Abh. Parameter "settings_show_mail_in_viplist", ist von zwei Parametern abhängig.
                        if (parameter.checked) {
                            if (checkDisabledForDependentParameters(global_dependents[i]["paIdDep"])) {
                                var activate = true;
                                if (global_dependents[i]["allActivated"]) {
                                    for (var k = 0; k < countDep; k++) {
                                        if (copy_global_dependents[k]["paIdDep"] == global_dependents[i]["paIdDep"] &&
                                            copy_global_dependents[k]["paId"] != global_dependents[i]["paId"]) {
                                            if (document.getElementById(copy_global_dependents[k]["paId"]) &&
                                                document.getElementById(copy_global_dependents[k]["paId"]).checked);
                                            else {
                                                activate = false;
                                                break;
                                            }
                                        }
                                    }
                                }
                                if (activate) disableDependentParameters(global_dependents[i]["paIdDep"], false);
                            }

                        // Wenn Parameter nicht markiert, dann soll abhängiger Parameter deaktiviert werden. Zuvor prüfen, ob alle Parameter zu diesem abhängigen Parameter deaktiviert
                        // werden sollen. Nur dann darf abhängiger Parameter deaktiviert werden. (ZB: Abhängiger Parameter Linklistparameter, sind von zwei Parametern abhängig.)
                        } else {
                            if (!checkDisabledForDependentParameters(global_dependents[i]["paIdDep"])) {
                                var deactivate = true;
                                if (global_dependents[i]["allActivated"] != true) {
                                    for (var k = 0; k < countDep; k++) {
                                        if (copy_global_dependents[k]["paIdDep"] == global_dependents[i]["paIdDep"] &&
                                            copy_global_dependents[k]["paId"] != global_dependents[i]["paId"]) {
                                            if (document.getElementById(copy_global_dependents[k]["paId"]) &&
                                                document.getElementById(copy_global_dependents[k]["paId"]).checked) {
                                                deactivate = false;
                                                break;
                                            }
                                        }
                                    }
                                }
                                if (deactivate) disableDependentParameters(global_dependents[i]["paIdDep"], true);
                            }
                        }
                    }
                }
            }
        }
    }
    // Prüfen, ob disabled.
    function checkDisabledForDependentParameters(id) {
        var elem = document.getElementById(id);
        var elem$ = $("#"+id);
        if ((elem.disabled) ||
            (elem$.hasClass("ui-droppable") && elem$.hasClass("ui-droppable-disabled")) ||
            (elem$.hasClass("ui-draggable") && elem$.hasClass("ui-draggable-disabled"))) {
            return true;
        } else return false;
    }
    // Disabled setzen bzw. entfernen.
    function disableDependentParameters(id, set) {
        var elem = document.getElementById(id);
        var elem$ = $("#"+id);
        if (elem$.hasClass("ui-droppable")) {
            elem$.droppable("option", "disabled", set);
            elem$.sortable("option", "disabled", set);
            if (set == true) elem.parentNode.style.opacity = "0.5";
            else elem.parentNode.style.opacity = "1";
        } else if (elem$.hasClass("ui-draggable")) {
            elem$.draggable("option", "disabled", set);
            if (set == true) elem.parentNode.style.opacity = "0.5";
            else elem.parentNode.style.opacity = "1";
        } else {
            elem.disabled = set;
            if (set == true) elem.style.opacity = "0.5";
            else elem.style.opacity = "1";
            // Alle möglichen Clone zum abhängigen Parameter suchen und ebenfalls verarbeiten.
            for (var j = 0; j < 10; j++) {
                var paIdDepX = id + "X" + j;
                if (document.getElementById(paIdDepX)) {
                    document.getElementById(paIdDepX).disabled = set;
                    if (set == true) document.getElementById(paIdDepX).style.opacity = "0.5";
                    else document.getElementById(paIdDepX).style.opacity = "1";
                } else break;
            }
        }
    }

// Warnung, wenn Logs nicht durch GClh geladen werden sollen.
    function alert_settings_load_logs_with_gclh() {
        if (!document.getElementById("settings_load_logs_with_gclh").checked) {
            var mess = "If this option is disabled, there are no VIP-, VUP-, mail-, message-\n"
                     + "and top icons, no line colors and no mouse activated big images \n"
                     + "at the logs. Also the VIP and VUP lists, hide avatars, log filter and \n"
                     + "log search and the latest logs won't work.";
            alert(mess);
        }
    }

// Wenn VUPs im Config deaktiviert wird und es sind VUPs vorhanden, dann Confirm Meldung, dass die VUPs gelöscht werden.
// Ansonsten können Konstellationen mit Usern entstehen, die gleichzeitig VIP und VUP sind.
    function alert_settings_process_vup() {
        if (!document.getElementById("settings_process_vup").checked && getValue("vups")) {
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
                }
            }
        }
    }

// Feldinhalt auf default zurücksetzen.
    function restoreField() {
        if (document.getElementById(this.id).disabled) return;
        var fieldId = this.id.replace(/restore_/, "");
        var field = document.getElementById(fieldId);
        if (this.id.match(/_color/)) {
            field.value = "93B516";
            field.style.color = "black";
            switch (fieldId) {
                case "settings_lines_color_zebra": field.value = "EBECED"; break;
                case "settings_lines_color_user": field.value = "C2E0C3"; break;
                case "settings_lines_color_owner": field.value = "E0E0C3"; break;
                case "settings_lines_color_reviewer": field.value = "EAD0C3"; break;
                case "settings_lines_color_vip": field.value = "F0F0A0"; break;
                case "settings_font_color_menu": restoreColor("settings_font_color_menuX0", "restore_settings_font_color_menuX0", field.value); break;
                case "settings_font_color_menuX0": restoreColor("settings_font_color_menu", "restore_settings_font_color_menu", field.value); break;
                case "settings_font_color_submenu": restoreColor("settings_font_color_submenuX0", "restore_settings_font_color_submenuX0", field.value); break;
                case "settings_font_color_submenuX0": restoreColor("settings_font_color_submenu", "restore_settings_font_color_submenu", field.value); break;
                case "settings_count_own_matrix_show_color_next": field.value = "5151FB"; field.style.color = "white"; break;
            }
            field.style.backgroundColor = "#" + field.value;
        }
    }
    function restoreColor(p, r, v) {
        if (document.getElementById(r) && document.getElementById(p).value != v) document.getElementById(r).click();
    }

// Bezeichnung Save Button setzen.
    function setValueInSaveButton() {
        var content = "save";
        // Nach Aufbau Config.
        if (document.getElementById("settings_f2_save_gclh_config")) {
            if (document.getElementById("settings_f2_save_gclh_config").checked) content += " (F2)";
            document.getElementById('btn_save').setAttribute("value", content);
        // Vor Aufbau Config.
        } else {
            if (settings_f2_save_gclh_config) content += " (F2)";
            return content;
        }
    }
// Bezeichnung Close Button setzen.
    function setValueInCloseButton() {
        var content = "close";
        // Nach Aufbau Config.
        if (document.getElementById("settings_esc_close_gclh_config")) {
            if (document.getElementById("settings_esc_close_gclh_config").checked) content += " (ESC)";
            document.getElementById('btn_close2').setAttribute("value", content);
        // Vor Aufbau Config.
        } else {
            if (settings_esc_close_gclh_config) content += " (ESC)";
            return content;
        }
    }

// Info ausgeben, dass gespeichert wurde.
    function showSaveForm() {
        if (document.getElementById('save_overlay')) {
        } else {
            var html = "";
            html += "#save_overlay {background-color: #d8cd9d; width:560px; margin-left: 20px; border: 2px solid #778555; overflow: auto; padding:10px; position: absolute; left:30%; top:70px; z-index:1004; border-radius: 10px;}";
            html += ".gclh_form {background-color: #d8cd9d; border: 2px solid #778555; padding-left: 5px; padding-right: 5px;}";
            html += "h3 {margin: 0;}";
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
        // Ids ermitteln für linke und rechte Spalte.
        var idColLeft = this.id.replace("bookmarks_name[", "gclh_LinkListElement_").replace("]", "");
        var idColRight = this.id.replace("bookmarks_name[", "gclh_LinkListTop_").replace("]", "");
        // Bezeichnung ermitteln.
        if (this.value.match(/(\S+)/)) var description = this.value;
        else {
            if (document.getElementById(idColLeft).children[1].id.match("custom")) {
                var description = "Custom" + document.getElementById(idColLeft).children[1].id.replace("settings_custom_bookmark[", "").replace("]", "");
                this.value = description;
            } else var description = document.getElementById(idColLeft).children[1].innerHTML;
        }
        // Update.
        if (document.getElementById(idColRight) && document.getElementById(idColRight).children[0].childNodes[2]) {
            document.getElementById(idColRight).children[0].childNodes[2].nodeValue = description;
        }
    }

// Attribute ändern bei Mousedown, Mouseup in rechter Spalte, Move Icon und Bezeichnung.
    function changeAttrMouse(event, elem, obj) {
        if (event.type == "mousedown") elem.style.cursor = "grabbing";
        else {
            if (obj == "move") elem.style.cursor = "grab";
            else if (obj == "desc") elem.style.cursor = "unset";
        }
    }

// BM kennzeichnen wenn sie in Linklist ist.
    function flagBmInLl(tdBmEntry, doDragging, setCursor, setOpacity, setTitle) {
        if (doDragging) {
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
    function sortBookmarksByDescription(sort, bm) {
        // BMs für Sortierung aufbereiten. Wird immer benötigt, auch wenn nicht sortiert wird.
        var cust = 0;
        for (var i = 0; i < bm.length; i++) {
            bm[i]['number'] = i;
            if (typeof(bm[i]['custom']) != "undefined" && bm[i]['custom'] == true) {
                bm[i]['origTitle'] = "Custom" + cust + ": " + bm[i]['title'];
                bm[i]['sortTitle'] = cust;
                cust++;
            } else {
                bm[i]['origTitle'] = bm[i]['sortTitle'] = (typeof(bookmarks_orig_title[i]) != "undefined" && bookmarks_orig_title[i] != "" ? bookmarks_orig_title[i] : bm[i]['title']);
                bm[i]['sortTitle'] = bm[i]['sortTitle'].toLowerCase().replace(/ä/g,"a").replace(/ö/g,"o").replace(/ü/g,"u").replace(/ß/g,"s");
            }
        }
        // BMs nach sortTitle sortieren.
        if (sort) {
            bm.sort(function(a, b){
                if ((typeof(a.custom) != "undefined" && a.custom == true) && !(typeof(b.custom) != "undefined" && b.custom == true)) {
                    // a nach hinten, also a > b.
                    return 1;
                } else if (!(typeof(a.custom) != "undefined" && a.custom == true) && (typeof(b.custom) != "undefined" && b.custom == true)) {
                    // b nach hinten, also a < b.
                    return -1;
                }
                if (a.sortTitle < b.sortTitle) return -1;
                if (a.sortTitle > b.sortTitle) return 1;
                return 0;
            });
        }
        return bm;
    }

// Show, hide all areas in config with one click of right mouse.
    function showHideConfigAll(id_lnk) {
        showHide = showHideBoxCL(id_lnk, false);
        setShowHideConfigAll("gclh_config_global", showHide);
        setShowHideConfigAll("gclh_config_config", showHide);
        setShowHideConfigAll("gclh_config_nearestlist", showHide);
        setShowHideConfigAll("gclh_config_pq", showHide);
        setShowHideConfigAll("gclh_config_bm", showHide);
        setShowHideConfigAll("gclh_config_recview", showHide);
        setShowHideConfigAll("gclh_config_friends", showHide);
        setShowHideConfigAll("gclh_config_hide", showHide);
        setShowHideConfigAll("gclh_config_others", showHide);
        setShowHideConfigAll("gclh_config_maps", showHide);
        setShowHideConfigAll("gclh_config_profile", showHide);
        setShowHideConfigAll("gclh_config_db", showHide);
        setShowHideConfigAll("gclh_config_listing", showHide);
        setShowHideConfigAll("gclh_config_logging", showHide);
        setShowHideConfigAll("gclh_config_mail", showHide);
        setShowHideConfigAll("gclh_config_linklist", showHide);
        if (showHide == "show") window.scroll(0, 0);
        else {
            document.getElementById(id_lnk).scrollIntoView();
            window.scrollBy(0, -15);
        }
    }
    function setShowHideConfigAll(stamm, whatToDo) {
        $('#lnk_'+stamm)[0].title = (whatToDo == "show" ? "show topic\n(all topics with right mouse)" : "hide topic\n(all topics with right mouse)");
        $('#lnk_'+stamm)[0].src = (whatToDo == "show" ? global_plus_config2 : global_minus_config2);
        $('#lnk_'+stamm)[0].parentNode.className = $('#lnk_'+stamm)[0].parentNode.className.replace(" gclh_hide","");
        if (whatToDo == "show") {
            $('#'+stamm).hide();
            $('#lnk_'+stamm)[0].parentNode.className += " gclh_hide";
        } else {
            $('#'+stamm).show();
        }
        setValue("show_box_"+stamm, (whatToDo == "show" ? false : true));
    }

//////////////////////////////
// Config Reset Functions
//////////////////////////////
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
//--> $$000
                // Neue Parameter in Datei aufnehmen?
                rcGetData("https://raw.githubusercontent.com/2Abendsegler/GClh/master/data/config_standard.txt", "st");
//<-- $$000
            }
            if (document.getElementById("rc_temp").checked) {
                rcGetData("https://raw.githubusercontent.com/2Abendsegler/GClh/master/gc_little_helper_II.user.js", "js");
            }
        } catch(e) {gclh_error("Reset config data:",e);}
    }
    function rcGetData(url, name) {
        global_rc_data = global_rc_status = "";
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                global_rc_status = parseInt(response.status);
                global_rc_data = response.responseText;
            }
        });
        function rcCheckDataLoad(waitCount, name) {
            if (global_rc_data == "" || global_rc_status != 200) {
                waitCount++;
                if (waitCount <= 25) setTimeout(function(){rcCheckDataLoad(waitCount, name);}, 200);
                else {
                    alert("Can not load file with " + (name == "st" ? "standard configuration data":"script data") + ".\nNothing changed.");
                    if (document.getElementById("rc_doing")) setTimeout(function(){document.getElementById("rc_doing").src = "";}, 500);
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
            if (!del) config_tmp[key] = CONFIG[key];
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
//--> $$000
        // Benötigen neue Parameter Ausnahmeregel?
//<-- $$000
        var config_tmp = {};
        var changed = false;
        for (key in CONFIG) {
            var kkey = key.split("[");
            var kkey = kkey[0];
            if (kkey.match(/^(show_box)/) ||
                kkey.match(/^gclh_(.*)(_logs_get_last|_logs_count)$/)) {
                config_tmp[key] = CONFIG[key];
            } else if (kkey.match(/autovisit_(\d+)/) ||
                       kkey.match(/^(friends_founds_|friends_hides_)/) ||
                       kkey.match(/^(settings_DB_auth_token|new_version|class|token)$/)) {
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
        setTimeout(function(){
            if (document.getElementById("rc_doing")) document.getElementById("rc_doing").src = "";
            if (document.getElementById("rc_reset_button")) document.getElementById("rc_reset_button").disabled = false;
        }, 500);
        if (changed) {
            var defer = $.Deferred();
            GM_setValue("CONFIG", JSON.stringify(CONFIG));
            defer.resolve();
            return defer.promise();
        } else document.getElementById('rc_configData').innerText += "(nothing to change)\n";
    }
    function rcClose() {
        window.scroll(0, 0);
        $("#settings_overlay").fadeOut(400);
        document.location.href = clearUrlAppendix(document.location.href, false);
        window.location.reload(false);
    }

//////////////////////////////
// Sync Main
//////////////////////////////
    function sync_getConfigData() {
        var data = {};
        var value = null;
        for (key in CONFIG) {
            if (!gclhConfigKeysIgnoreForBackup[key]) {
                value = getValue(key, null);
                if (value != null) data[key] = value;
            }
        }
        return JSON.stringify(data, undefined, 2);
    }

    function sync_setConfigData(data) {
        var parsedData = JSON.parse(data);
        var settings = {};
        for(key in parsedData){
            if (!gclhConfigKeysIgnoreForBackup[key]) settings[key] = parsedData[key];
        }
        setValueSet(settings).done(function() {
        });
    }

    var dropbox_client = null;
    var dropbox_save_path = '/GCLittleHelperSettings.json';

// Dropbox auth token bereitstellen.
    (function(window){
        window.utils = {
            parseQueryString: function(str) {
                var ret = Object.create(null);
                if (typeof str !== 'string') return ret;
                str = str.trim().replace(/^(\?|#|&)/, '');
                if (!str) return ret;
                str.split('&').forEach(function(param) {
                    var parts = param.replace(/\+/g, ' ').split('=');
                    // Firefox (pre 40) decodes `%3D` to `=` (https://github.com/sindresorhus/query-string/pull/37)
                    var key = parts.shift();
                    var val = parts.length > 0 ? parts.join('=') : undefined;
                    key = decodeURIComponent(key);
                    // missing `=` should be `null`: (http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters)
                    val = val === undefined ? null : decodeURIComponent(val);
                    if (ret[key] === undefined) ret[key] = val;
                    else if (Array.isArray(ret[key])) ret[key].push(val);
                    else ret[key] = [ret[key], val];
                });
                return ret;
            }
        };
    })(window);

// Save dropbox auth token if one is passed (from Dropbox).
    var DB_token = utils.parseQueryString(window.location.hash).access_token;
    if (DB_token) {
        // gerade von DB zurück, also Show config.
        setValue('settings_DB_auth_token', DB_token);
        document.getElementById('gclh_sync_lnk').click();
        document.getElementById('syncDBLabel').click();
    } else {
        // Maybe the user denies Access (this is mostly an unwanted click), so show him, that he
        // has refused to give us access to his dropbox and that he can re-auth if he want to.
        error = utils.parseQueryString(window.location.hash).error_description;
        if (error) alert('We received the following error from dropbox: "' + error + '" If you think this is a mistake, you can try to re-authenticate in the sync menue of GClh.');
    }

// Created the Dropbox Client with the given auth token from config.
    function gclh_sync_DB_CheckAndCreateClient() {
        var deferred = $.Deferred();
        token = getValue('settings_DB_auth_token');

        if (token) {
            // Try to create an instance and test it with the current token
            dropbox_client = new Dropbox({accessToken: token});

            dropbox_client.usersGetCurrentAccount()
                .then(function(response) {
                    deferred.resolve();
                })
                .catch(function(error) {
                    console.error('gclh_sync_DB_CheckAndCreateClient: Error while creating Dropbox Client:');
                    console.error(error);
                    deferred.reject();
                });
        } else {
            // No token was givven, user has to (re)auth GClh for dropbox
            dropbox_client = null;
            deferred.reject();
        }
        return deferred.promise();
    }

// If the Dropbox Client could not be instantiated (because of wrong token, App deleted or not authenticated at all), this will show the Auth link.
    function gclh_sync_DB_showAuthLink() {
        var APP_ID = 'zp4u1zuvtzgin6g';
        // If client could not created, try to get a new Auth token. Set the login anchors href using dropbox_client.getAuthenticationUrl()
        dropbox_auth_client = new Dropbox({clientId: APP_ID});
        authlink = document.getElementById('authlink');
        authlink.href = dropbox_auth_client.getAuthenticationUrl('https://www.geocaching.com/my/default.aspx');

        $(authlink).show();
        $('#btn_DBSave').hide();
        $('#btn_DBLoad').hide();
        $('#syncDBLoader').hide();
    }

// If the Dropbox Client is instantiated and the connection stands, this funciton shows the load and save buttons.
    function gclh_sync_DB_showSaveLoadLinks() {
        $('#btn_DBSave').show();
        $('#btn_DBLoad').show();
        $('#syncDBLoader').hide();
        $('#authlink').hide();
    }

// Saves the current config to dropbox.
    function gclh_sync_DBSave() {
        var deferred = $.Deferred();

        gclh_sync_DB_CheckAndCreateClient()
            .fail(function(){
                // Should not be reached, because we checked the client earlier
                alert('Something went wrong. Please reload the page and try again.');
                deferred.reject();
                $('#syncDBLoader').hide();
                return deferred.promise();
            });

        $('#syncDBLoader').show();

        dropbox_client.filesUpload({
            path: dropbox_save_path,
            contents: sync_getConfigData(),
            mode: 'overwrite',
            autorename: false,
            mute: false
        })
            .then(function(response) {
                deferred.resolve();
                $('#syncDBLoader').hide();
            })
            .catch(function(error) {
                console.error('gclh_sync_DBSave: Error while uploading config file:');
                console.error(error);
                deferred.reject();
                $('#syncDBLoader').hide();
            });
        return deferred.promise();
    }

// Loads the config from dropbox and replaces the current configuration with it.
    function gclh_sync_DBLoad() {
        var deferred = $.Deferred();

        gclh_sync_DB_CheckAndCreateClient()
            .fail(function(){
                // Should not be reached, because we checked the client earlier
                alert('Something went wrong. Please reload the page and try again.');
                deferred.reject();
                return deferred.promise();
            });

        $('#syncDBLoader').show();

        dropbox_client.filesDownload({path: dropbox_save_path})
            .then(function(data) {
                var blob = data.fileBlob;
                var reader = new FileReader();
                reader.addEventListener("loadend", function() {
                    sync_setConfigData(reader.result);
                    deferred.resolve();
                });
                reader.readAsText(blob);
                $('#syncDBLoader').hide();
            }).catch(function(error) {
                console.error('gclh_sync_DBLoad: Error while downloading config file:');
                console.error(error);
                deferred.reject();
                $('#syncDBLoader').hide();
            });
        return deferred.promise();
    }

// Gets the hash of the saved config, so we can determine if we have to apply the config loaded from dropbox via autosync.
    function gclh_sync_DBHash() {
        var deferred = $.Deferred();

        gclh_sync_DB_CheckAndCreateClient()
            .fail(function(){
                deferred.reject('Dropbox client is not initiated.');
                return deferred.promise();
            });

        dropbox_client.filesGetMetadata({
            "path": dropbox_save_path,
            "include_media_info": false,
            "include_deleted": false,
            "include_has_explicit_shared_members": false
        })
        .then(function(response) {
            console.log('content_hash:' + response.content_hash);
            if (response != null && response != "") {
                deferred.resolve(response.content_hash);
            }else{
                deferred.reject('Error: response had no file or file was empty.');
            }
        })
        .catch(function(error) {
            console.log('gclh_sync_DBHash: Error while getting hash for config file:');
            console.log(error);
            deferred.reject(error);
        });
        return deferred.promise();
    }

    function gclh_showSync() {
        btnClose();
        scroll(0, 0);

        if (document.getElementById('bg_shadow')) {
            if (document.getElementById('bg_shadow').style.display == "none") document.getElementById('bg_shadow').style.display = "";
        } else buildBgShadow();

        if (document.getElementById('sync_settings_overlay') && document.getElementById('sync_settings_overlay').style.display == "none") {
            document.getElementById('sync_settings_overlay').style.display = "";
        } else {
            create_config_css();

            var div = document.createElement("div");
            div.setAttribute("id", "sync_settings_overlay");
            div.setAttribute("class", "settings_overlay");
            var html = "";
            html += "<h3 class='gclh_headline' title='Some little things to make life easy (on www.geocaching.com).' >" + scriptNameSync + " <font class='gclh_small'>v" + scriptVersion + "</font></h3>";
            html += "<div class='gclh_content'>";
            html += "<h4 class='gclh_headline2' id='syncDBLabel' style='cursor: pointer;'>DropBox <font class='gclh_small'>(click to hide/show)</font></h4>";
            html += "<div style='display:none;' id='syncDB' >";
            html += "<div id='syncDBLoader'><img style='height: 40px;' src='"+global_syncDBLoader_icon+"'> working...</div>";
            html += "<a href='#' class='gclh_form' style='display: none;' id='authlink' class='button'>authenticate</a>";
            html += "<input class='gclh_form' type='button' value='save to DropBox' id='btn_DBSave' style='display: none;'> ";
            html += "<input class='gclh_form' type='button' value='load from DropBox' id='btn_DBLoad' style='display: none;'>";
            html += "</div>";
            html += "<h4 class='gclh_headline2' id='syncManualLabel' style='cursor: pointer;'>Manual <font class='gclh_small'>(click to hide/show)</font></h4>";
            html += "<div style='display:none;' id='syncManual' >";
            html += "<pre class='gclh_form' style='display: block; width: 550px; height: 300px; overflow: auto; margin-top: 0; margin-bottom: 6px !important' type='text' value='' id='configData' size='28' contenteditable='true'></pre>";
            html += "<input class='gclh_form' type='button' value='export' id='btn_ExportConfig'> ";
            html += "<input class='gclh_form' type='button' value='import' id='btn_ImportConfig'>";
            html += "</div>";
            html += "<br>";
            html += "<br>";
            html += "<input class='gclh_form' type='button' value='close' id='btn_close3'>";
            html += "</div>";
            div.innerHTML = html;

            document.getElementsByTagName('body')[0].appendChild(div);
            document.getElementById('btn_close3').addEventListener("click", btnClose, false);
            document.getElementById('btn_ExportConfig').addEventListener("click", function() {
                document.getElementById('configData').innerText = sync_getConfigData();
            }, false);
            document.getElementById('btn_ImportConfig').addEventListener("click", function() {
                var data = document.getElementById('configData').innerText;
                if (data == null || data == "" || data == " ") {
                    alert("No data");
                    return;
                }
                try {
                    sync_setConfigData(data);
                    window.scroll(0, 0);
                    $("#sync_settings_overlay").fadeOut(400);
                    if (settings_show_save_message) {
                        showSaveForm();
                        document.getElementById("save_overlay_h3").innerHTML = "imported";
                    }
                    // Reload page
                    if (document.location.href.indexOf("#") == -1 || document.location.href.indexOf("#") == document.location.href.length - 1) {
                        $('html, body').animate({scrollTop: 0}, 0);
                        document.location.reload(true);
                    } else document.location.replace(document.location.href.slice(0, document.location.href.indexOf("#")));
                } catch(e) {
                    alert("Invalid format");
                }
            }, false);

            document.getElementById('btn_DBSave').addEventListener("click", function() {
                gclh_sync_DBSave();
            }, false);

            document.getElementById('btn_DBLoad').addEventListener("click", function() {
                gclh_sync_DBLoad().done(function() {
                    // Reload page
                    if (document.location.href.indexOf("#") == -1 || document.location.href.indexOf("#") == document.location.href.length - 1) {
                        $('html, body').animate({scrollTop: 0}, 0);
                        document.location.reload(true);
                    } else document.location.replace(document.location.href.slice(0, document.location.href.indexOf("#")));
                });
            }, false);

            $('#syncDBLabel').click(function() {
                $('#syncDB').toggle();
                gclh_sync_DB_CheckAndCreateClient()
                  .done(function(){
                    // Means the connection to Dropbox stands, so we can make calls
                    gclh_sync_DB_showSaveLoadLinks();
                  })
                  .fail(function(){
                    // Means something went wrong or the Dropbox is not authenticated, so we display the Auth Link.
                    gclh_sync_DB_showAuthLink();
                  });
            });
            $('#syncManualLabel').click(function() {
                $('#syncManual').toggle();
            });
        }
        // Fokusierung auf Verarbeitung, damit Menüs einklappen.
        document.getElementById("sync_settings_overlay").click();
    } // <-- gclh_showSync

    if (settings_sync_autoImport && (settings_sync_last.toString() === "Invalid Date" || (new Date() - settings_sync_last) > settings_sync_time) && document.URL.indexOf("#access_token") === -1) {
        gclh_sync_DBHash().done(function(hash) {
            if (hash != settings_sync_hash) {
                gclh_sync_DBLoad().done(function() {
                    settings_sync_last = new Date();
                    settings_sync_hash = hash;
                    setValue("settings_sync_last", settings_sync_last.toString()).done(function(){
                        setValue("settings_sync_hash", settings_sync_hash).done(function(){
                            if (is_page("profile")) {
                                // Reload page
                                if (document.location.href.indexOf("#") == -1 || document.location.href.indexOf("#") == document.location.href.length - 1) {
                                    $('html, body').animate({scrollTop: 0}, 0);
                                    document.location.reload(true);
                                } else document.location.replace(document.location.href.slice(0, document.location.href.indexOf("#")));
                            }
						});
                    });
                });
            } else {
                // Hashes are equal so nothing has changed. We do not need to update
            }
        })
        .fail(function(error){
            console.log('Autosync: Hash function was not successful:');
            console.log(error);
        });
    }  // Sync
};  // end of mainGC

//////////////////////////////
// Global Functions
//////////////////////////////
// Create bookmark to GC page.
function bookmark(title, href, bookmarkArray) {
    var bm = new Object();
    bookmarkArray[bookmarkArray.length] = bm;
    bm['href'] = href;
    bm['title'] = title;
    return bm;
}
// Create BM to external page.
function externalBookmark(title, href, bookmarkArray) {
    var bm = bookmark(title, href, bookmarkArray);
    bm['rel'] = "external";
    bm['target'] = "_blank";
}
// Create BM to a profile sub page.
function profileBookmark(title, id, bookmarkArray) {
    var bm = bookmark(title, "#", bookmarkArray);
    bm['id'] = id;
    bm['name'] = id;
}
// Create BM mit doppeltem Link.
function profileSpecialBookmark(title, href, name, bookmarkArray) {
    var bm = bookmark(title, href, bookmarkArray);
    bm['name'] = name;
}

// Matched the current document location the given path?
function isLocation(path) {
    path = path.toLowerCase();
    if (path.indexOf("http") != 0) {
        if (path.charAt(0) != '/') path = "/" + path;
        path = http + "://www.geocaching.com" + path;
    }
    return document.location.href.toLowerCase().indexOf(path) == 0;
}

// Logging.
function gclh_log(log) {
    var txt = "GClh_LOG - " + document.location.href + ": " + log;
    if (typeof(console) != "undefined") console.info(txt);
    else if (typeof(GM_log) != "undefined") GM_log(txt);
}

// Error Logging.
function gclh_error(modul, err) {
    var txt = "GClh_ERROR - " + modul + " - " + document.location.href + ": " + err.message + "\nStacktrace:\n" + err.stack + (err.stacktrace ? ("\n" + err.stacktrace) : "");
    if (typeof(console) != "undefined") console.error(txt);
    if (typeof(GM_log) != "undefined") GM_log(txt);
}

// Zufallszahl zwischen max und min.
function random(max, min) {return Math.floor(Math.random() * (max - min + 1)) + min;}

// Set Get Values.
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
    if (CONFIG[name] === undefined) {  // Zum Migrieren aus alten Speicherformat
        CONFIG[name] = GM_getValue(name, defaultValue);
        if (defaultValue === undefined) return undefined;
        setValue(name, CONFIG[name]);
    }
    return CONFIG[name];
}

// Auf welcher Seite bin ich?
function is_link(name, url) {
	var status = false;
    switch (name) {
        case "cache_listing":
            if (url.match(/\.com\/(seek\/cache_details\.aspx|geocache\/)/) && !document.getElementById("cspSubmit") && !document.getElementById("cspGoBack")) status = true;
            break;
        case "profile":
            if (url.match(/\.com\/my(\/default\.aspx)?/)) status = true;
            break;
        case "publicProfile":
            if (url.match(/\.com\/(profile|p\/)/)) status = true;
            break;
        case "map":
            if (url.match(/\.com\/map/)) status = true;
            break;
        case "find_cache":
            if (url.match(/\.com\/play\/(search|geocache)/)) status = true;
            break;
        case "hide_cache":
            if (url.match(/\.com\/play\/(hide|friendleague)/)) status = true;
            break;
        case "geotours":
            if (url.match(/\.com\/play\/geotours/)) status = true;
            break;
        case "settings":
            if (url.match(/\.com\/account\/(settings|lists|drafts)/)) status = true;
            break;
        case "messagecenter":
            if (url.match(/\.com\/account\/messagecenter/)) status = true;
            break;
        case "dashboard":
            if (url.match(/\.com\/account\/dashboard/)) status = true;
            break;
        case "track":
            if (url.match(/\.com\/track\/($|#$)/)) status = true;
            break;
        default:
            gclh_error("is_link", "is_link("+name+", ... ): unknown name");
            break;
    }
    return status;
}
function is_page(name) {return is_link(name, document.location.href);}

// Inject script into site context.
function injectPageScript(scriptContent) {
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.innerHTML = scriptContent;
    var pageHead = document.getElementsByTagName("head")[0];
    pageHead.appendChild(script);
}
function insertScript(code, TagName) {
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.innerHTML = code;
    var side = document.getElementsByTagName(TagName)[0];
    side.appendChild(script);
}
function injectPageScriptFunction(funct, functCall) {injectPageScript("(" + funct.toString() + ")" + functCall + ";");}

// Meta Info hinzufügen.
function appendMetaId(id) {
    var head = document.getElementsByTagName('head')[0];
    var meta = document.createElement('meta');
    meta.id = id;
    head.appendChild(meta);
}

// Zeitdifferenzen.
function adjustPlural(singularWord, timesNumber) {return singularWord + ((Math.abs(timesNumber) != 1) ? "s" : "");}

// Calculates difference between two dates and returns it as a "humanized" string (borrowed from http://userscripts.org/scripts/show/36353).
function getDateDiffString(dateNew, dateOld) {
    var dateDiff = new Date(dateNew - dateOld);
    dateDiff.setUTCFullYear(dateDiff.getUTCFullYear() - 1970);
    var strDateDiff = "", timeunitValue = 0;
    var timeunitsHash = {year: "getUTCFullYear", month: "getUTCMonth", day: "getUTCDate",
                         hour: "getUTCHours", minute: "getUTCMinutes", second: "getUTCSeconds", millisecond: "getUTCMilliseconds"};
    for (var timeunitName in timeunitsHash) {
        timeunitValue = dateDiff[timeunitsHash[timeunitName]]() - ((timeunitName == "day") ? 1 : 0);
        if (timeunitValue !== 0) {
            if ((timeunitName == "millisecond") && (strDateDiff.length !== 0)) continue;  // Milliseconds won't be added unless difference is less than 1 second.
            strDateDiff += ((strDateDiff.length === 0) ? "" : ", ") +  // Adds comma as separator if another time unit has already been added.
                            timeunitValue + " " + adjustPlural(timeunitName, timeunitValue);
        }
    }
    // Replaces last comma with "and" to humanize the string
    strDateDiff = strDateDiff.replace(/,([^,]*)$/, " and$1");
    return strDateDiff;
}

start(this);
