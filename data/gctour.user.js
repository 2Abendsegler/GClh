// ==UserScript==
// @name         GC Tour 
// @namespace    https://gist.github.com/DieBatzen/5814dc7368c1034470c8/
// @version      4.1.3
// @description  Cachetour planning made easy. Pick some Caches, sort the list and print it out. Free for all users of geocaching.com!
// @run-at       document-end
// @include      http*://www.geocaching.com/*
// @include      https://gctour.geocaching.cx/map/show*#gui
// @exclude      /^https?://www\.geocaching\.com/(login|jobs|brandedpromotions|blog)/
// @updateURL    https://gist.github.com/DieBatzen/5814dc7368c1034470c8/raw/gctour.version.js
// @downloadURL  https://gist.github.com/DieBatzen/5814dc7368c1034470c8/raw/gctour.user.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        unsafeWindow
// @icon         https://gctour.geocaching.cx/i/icon.png
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js
// @require      https://raw.githubusercontent.com/eligrey/FileSaver.js/master/FileSaver.min.js
// ==/UserScript==

/*****************************************************************************
 * Copyright (C) 2008 - 2014 Martin Georgi, 2015 - 2017 Die Batzen
 *
 * This is free software; you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 3 of the License, or (at your option) any later
 * version.
 *
 * This is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * To obtain a copy of the GNU General Public License, please see
 * <https://www.gnu.org/licenses>
 *****************************************************************************/
/* Changelog:
 *
 * version 4.1.3
 *   - FIX: GPX: GSAK did not handle additional cache waypoints as child waypoints during import of GPX files
 *   - FIX: GPX: dollar sign in cache descriptions could cause ill formatted GPX files
 *
 * version 4.1.2
 *   - FIX: preview tour on map: changed cache coordinates were not always updated in map preview
 *   - FIX: GPX: ASCII control codes in logs resulted in invalid GPX files; they are now removed from logs
 *
 * version 4.1.1
 *   - FIX: Map: adding caches from the map to a tour didn't work any more due to the new cache icons 
 *
 * version 4.1
 *   - NEW: printview: favorite points available as both, absolute and relative value
 *   - NEW: printview settings: option to enable/disable printing for all cache listings and own waypoints 
 *   - FIX: sendToGPS: GS layout change
 *
 * version 4.0.2
 *   - FIXED: tour upload: did not work due to changes in 4.0.1
 *
 * version 4.0.1
 *   - FIXED: printview: did not work for tours with (approx.) more than 40 caches
 *
 * version 4.0
 *   - NEW: printview: favorite points available
 *   - NEW: most data now fetched in parallel (as opposed to one by one) --> much faster
 *          print preview, GPX download, send to GPS, upload tour, map preview
 *   - FIXED: printview: prevent cache table getting too wide for large font sizes
 *   - MISC: exchanged positions of GCTour Home and Save Settings Info buttons
 *
 * version 3.2
 *   - FIXED: Main menu: GCTour settings now work on new search page
 *   - FIXED: Main menu: immediate numbering update when deleting a cache from a tour
 *   - FIXED: info dialogs were not displayed properly on map and new search page (stylesheet was missing)
 *   - FIXED: GPX: German umlauts, 'ß' and '-' now allowed in file names
 *   - FIXED: autoTour: now works on new search page
 *   - NEW: autoTour: check/uncheck all switch for filters
 *   - NEW: Main menu: new info button on how to backup the complete GCTour settings, all tours and moved coordinates
 *   - NEW: Main settings menu: layout change to jQuery UI dialog
 *   - NEW: Main settings menu: theme roller (individual layout for all dialogs)
 *
 * version 3.1
 *   - FIXED: autoTour: map preview with circle now works on southern hemisphere, too
 *   - FIXED: Main menu: immediate numbering update when adding new cache(s)
 *   - FIXED: GPX: coord.info links reset to http from https
 *   - FIXED: GPX: "<sym>Geocache Found</sym>" for Geocaches already found (thanks to Vasek)
 *   - FIXED: printview: closing the progress bar now opens a confirmation dialog to cancel the print process
 *   - UPDATED: autoTour: all filters are now enabled on first use
 *   - UPDATED: Upload/Download Tour: new confirmation dialogs
 *   - NEW: autoTour: filter option for Giga events
 *   - NEW: GPX: new attribute "Geotour"
 *
 * version 3.0.1
 *   - FIXED: icons of own waypoints not displayed on downloaded tour
 *   - FIXED: when editing own waypoints they lost their position inside the tour
 *   - FIXED: when sorting a tour by drag and drop numbering did not update automatically
 *   - NEW: check and notification for Chrome browser which is currently not supported
 *
 * version 3.0
 *   - FIXED: in printview, description formatting (line breaks etc) is preserved for additional cache waypoints
 *   - FIXED: pm only caches for non-pm member are now detected properly
 *   - FIXED: missing translations for "reload map" in printview
 *   - UPDATED: switch of external Web server (preservation of main GCTour functionality); credits to Mark
 *   - UPDATED: size of GCTour main window increased slightly
 *   - UPDATED: update of get/post methods
 *   - NEW: in printview, own waypoints can be added to cache table as opposed to a separate table (user option in main printview menu)
 *   - MISC: new main version
 *   - MISC: some code review
 *
 * version 2.3.14271, revision 9
 *   - FIXED: GPX file download was broken (missing file on external Web server); now independent of an external Web server
 *   - NEW: update notifier for Gist repository; update check once a day
 *   - MISC: some code review
 *
 * version 2.3.14271, revision 8
 *   - FIXED: display of last 4 logs in print preview is now independent of max. number of logs
 *   - MISC: option "all" in Settings - Printview - Number of logs... disabled (didn't work anyway)
 *   - MISC: some code review
 *
 * version 2.3.14271, revision 7
 *   - FIXED: autoTour didn't work from map when called from http (as opposed to https)
 *   - NEW: automatic updates from Gist repository (probably checked once a week)
 *   - MISC: improved code readability by applying a code beautifier
 *
 * version 2.3.14271, revision 6
 *   - FIXED: print issue in Firefox
 *   - FIXED: number of logs in print preview was dependent of max. number of logs in GPX files
 *   - NEW: GCTour now supports unpublished listings
 *   - NEW: revision number in GPX files
 *
 * version 2.3.14271, revision 5
 *   - FIXED: adding caches to tour from bookmark and search lists: single, marked, all
 *   - FIXED: completion of autoTour re-design part: German translations in dialog were missing
 *   - FIXED: on GS public profile page boxes with owned caches/trackables were shown at the bottom of the page
 *   - FIXED: route menu from "show caches on map" page removed (not working as expected)
 *   - UPDATED: most links now use https instead of http
 *   - UPDATED: improved visibility of buttons for adding all or marked caches from search/bookmark lists
 *   - UPDATED: autoTour dialog now shows a center point on all pages (cache coordinates on cache pages and home coordinates from GS profile settings else)
 *   - NEW: GitHub link to GCTour footer added
 *   - NEW: revision to GCTour identifier added
 *   - NEW: changelog for revisions added
 *
 * version 2.3.14271, revision 4
 *   - FIXED: GS layout changes
 *
 * version 2.3.14271, revision 3
 *   - FIXED: GS layout changes
 *   - FIXED: send to GPS
 *   - FIXED: change coordinates didn't work due to a conflict with script "Geocaching.com + Project-GC 1.4.9"
 *   - FIXED: now all GS date formats work
 *
 * version 2.3.14271, revision 2
 *   - FIXED: GS layout changes
 *
 * version 2.3.14271, revision 1
 *   - MISC: initial import to https://gist.github.com/DieBatzen/5814dc7368c1034470c8
 *
 * version 2.3.14271
 *   - FIXED: "Add to tour" is now working from the map
 *   - FIXED: Setting the default width of the print view
 * 	 - FIXED: Printview is now working again if you generate it from the gc.com map
 *   - UPDATED: autoTour dialog -> Coordinates are taken from geocache detail page
 *   - UPDATED: autoTour dialog -> special filter extended with "Only PM cache"
 *
 * version 2.3.14249
 *   - FIXED: Printview is now working _AGAIN_
 *   - FIXED: Printview now contains travelbugs again
 *   - NEW: "send message to the author" now contains a response email address
 *
 * version 2.3.14198
 *   - FIXED: Printview is now working again
 * version 2.3.13263
 *   - FIXED: gc.com update
 *
 * version 2.3.13241
 *   - NEW: Notifications with proper localisations and look
 *   - FIXED: Issue 50 (Send to GPS always sends GC14PCD)
 *
 * version  2.3.13239
 *   - FIXED: Issue 45, 47 and 49
 *
 * version 2.3.13018
 *   - FIXED: Tour upload is working again
 *
 * version 2.3.12356
 *   - FIXED: Issue 31
 *   - FIXED: wrong geocaches size in languages other than english
 *   - FIXED: wrong geocache location in languages other than english/german
 *   - FIXED: Bug on map that you need to log in
 *   - FIXED: Issue 42 "Add to tour" button on map
 *   - FIXED: Some minor CSS glitches
 *
 * version 2.3.12147
 *   - FIXED: Issue 37 and 39
 *   - UPDATED: buttons of searchpage and bookmarkpage adjusted
 *   - UPDATED: jquery to 1.7.2 and jquery-ui to 1.8.18
 *   - UPDATED: GPX -> cache-attributes to log settings, default = false
 *   - NEW: printview -> icon to add and underline if user has changed the coordinates
 *
 * version 2.2.12059
 *   - FIXED: autoTour menu button
 *   - NEW: maps show now details if you click on a marker
 *
 * version 2.2.12058
 *   - FIXED: new geocaching.com maps are now supported again
 *
 * version 2.2.12043
 *   - FIXED: autoTour - but still issues with GCVote, please disable this to use autoTour!
 *   - FIXED: OwnWaypoints and moveCoordinates
 *   - REMOVED: annoying alert on search page
 *
 * version 2.2.12042
 *   - FIXED: printview -> Bug with GCComment version
 *   - FIXED: searchpage in-use with Userscript GCVote
 *   - FIXED: Issue 22, 32 and 33
 *   - REMOVED: dojo completely removed
 *
 * version 2.2.12003
 *   - FIXED: GPX -> ALL caches were either not found or found
 *   - FIXED: printview -> Unsupported type for GM_setValue (Your Account Details -> Date Format)
 *
 * version 2.2.12002
 *   - FIXED: Map issues
 *   - FIXED: Upload Tour
 *   - FIXED: exception SyntaxError JSON.parse unexpected character by download tour
 *   - FIXED: exception TypeError progressBar is undefined
 *   - FIXED: function getlogs
 *   - FIXED: GPX found Caches from "<sym>Geocache</sym>" to "<sym>Geocache Found</sym>" (big thanks to Vasek)
 *   - UPDATED: French translation - thanks pascal
 *   - UPDATED: css adjustments
 *   - NEW: Map height is now variable
 *   - REMOVED: geocaching.com.au Type -> Groundspeak is now the only GPX Type
 *
 * version 2.1.11313
 *   - FIXED: GPX Download bug "...ctl00_hlSignOut... is undefined"
 *   - FIXED: Issue 18
 *   - FIXED: Update bug
 *   - NEW: Update added link in the error-Dialog
 *   - NEW: User can write a message in the error-Dialog
 *
 * version 2.1.11293
 *   - FIXED: <=3 Logs in printout -> "Last4Logs" (L4L) in the printout
 *   - FIXED: Logs in GPX (Unicode hexadez.)
 *   - UPDATED: dutch translation
 *   - Add jQuery (1.6.4) and jQuery-ui (1.8.16)
 *
 * version 2.1.11285
 *   - FIXED: autoTour
 *   - FIXED: GCTour on the search page
 *   - FIXED: Logs in printout
 *   - FIXED: Logs in GPX
 *   - UPDATED: french translation
 *   - GPX: New Groundspeak implementation to prevent XML errors
 *   - NEW: Titlepage in the printview now contains coordinates and basic informations
 *   - NEW: printview contains now the PM cache note!
 *   - NEW: delete button for current tour
 *   - NEW: "Last4Logs" (L4L) has been added to the printout - similar to http://www.gsak.net/help/hs11980.htm
 *
 * version 2.0.11280
 *   - FIXED: silent update changes from gc.com
 *
 * version 2.0.11239
 *   - FIXED: GPX bug
 *
 * version 2.0.11206
 *   - FIXED: GPX bug after gc.com update
 *   - FIXED: Printview after gc.com update
 *
 * version 2.0.11158
 *   - FIXED: scrollbar bug Firefox 3.6
 *   - FIXED: "Search For Geocaches" page in Firefox 3.6
 *   - FIXED: Bug with new GCComment version
 *   - FIXED: bug in popup after uploading an tour
 *   - UPDATED: french translation
 *
 * version 2.0.11158
 *   - FIXED: Event-Cache bug
 *   - FIXED: Printout need some work
 *   - FIXED: Update dialog bug
 *   - FIXED: autoTour dialog
 *   - FIXED: Layout modifications from gc.com
 *   - FIXED: autoTour find now earthcaches
 *   - FIXED: own waypoints coordinates were sometimes wrong rounded
 *   - GPX: Logs does now have an unique id
 *   - GPX: Archived/Unavailable geocaches are marked so
 *   - MAP: Tweak code on the map site. The use of the map will now be much faster.
 *   - NEW: Coordinates of geocaches can now be moved.
 *   - NEW: Added a dialog to send me a message.
 *   - NEW: Geocaches can now printed directly from their detailspage
 *   - NEW: Tour upload has been completly redesigned
 *   - NEW: Support for the new beta Maps
 *   - NEW: Dutch translation (thanks to searchjaunt)
 *   - NEW: Portuguese translation (thanks to Ruben)
 *   - NEW: French translation (thanks to flashmoon)
 *   - NEW: Added support for all GC.com date formats
 *   - NEW: GCComment print view implementation
 *   - ... and much more i already forgot
 *
 * version 1.97.11033
 *   - FIXED: gccom layout change.
 *
 * version 1.97.10361
 *   - FIXED: autotour with new OCR program
 *   - FIXED: GPX/Print now contains correct hidden date
 *   - FIXED: geocaches lists now are shown correctly again
 *   - NEW: Google-Appengine program to decode D/T/Size images
 *
 * version 1.97.10356
 *   - FIXED: GCTour is now working after gc.com update #2
 *
 * version 1.97.10313
 *   - FIXED: GCTour is now working after gc.com update
 *
 * version 1.97
 *   - GPX: add <groundspeak:name> to GPX
 *   - GPX: Additional Waypoints now named - Waypoint.Prefix + (GCID without leading GC)
 *   - GPX: changed Groundspeak "Multi-Cache" to "Multi-cache"
 *   - GPX: fixed earthcache type
 *   - GPX: changed log id to a usable value - Issue3
 *   - GPX: added attributes to Groundspeak GPX
 *   - FIXED: caches can remain in watchlist without error
 *   - FIXED: that a tour remains in list after deleting
 *   - FIXED: autoTour is working after update 7/28/10
 *   - FIXED: superscript text is now shown correct in printview
 *   - NEW: Bookmark Lists now have "add to tour" buttons
 *   - NEW: Tour can now sorted via drag n' drop
 *   - NEW: Add check on Firefox >= 3.5
 *   - NEW: Minimal-printview containing cacheheader, hint and spoiler images
 *   - NEW: Recode the complete update routine
 *   - NEW: Add check whether the script is still logged on when scraping data
 *   - CHANGED: Renew the buttons
 *   - MISC: Code Review
 *   - MISC: Create repository at http://code.google.com/p/gctour/
 *   - MISC: Start implementing http://gctour-spot.appspot.com/
 *
 * version 1.96
 *   - gc.com layout update 6/29/10 fixed
 *   - new groundspeak GPX implementation
 *   - close-window-button get a function in printview
 *   - removing annoying debug messages on maps
 *   - add an check after 20sec if gctour is loaded - important for no script users
 *   - caches on printview are now numbered
 *   - own waypoints are now uploaded again
 *   - tour uploads had now a map on gctour.madd.in
 *   - autoTour gets an option to filter PM-Only caches
 *   - update to dojo 1.4
 *
 * version 1.95
 *   - gc.com layout fixes
 *   - repair the "add selected caches"-to-tour button
 *
 * version 1.94
 *   - hints are now in the printout again
 *
 * version 1.93
 *   - fixed major functions after layout update
 *   - new code for the printview
 *   - remove the download-complete-map-button from maps page - please use autotour instead
 *   - some minor bugfixes
 *
 * version 1.92
 *   - add gpx option - old groundspeak schema or new geocaching.com.au schema
 *   - autoTour now part of GcTour
 *   - GUI improvements - now every tab is up-to-date
 *   - strip 'GC'-Option for GPX-Files
 *   - add OSM-Maps to the overview maps
 *   - append OSM and Topo Germany to default Maptype-Option
 *
 * version 1.91
 *   - Fast GPX-File bugfix! Type of caches is now correctly set!
 *
 * version 1.9
 *   - New-GcTour-GPX with geocaching.com.au/opencaching.de schema! Contains now logs and description for _ALL_ users.
 *   - Add dojo to make some DOM operations MUCH faster. Printview e.g. is now MUCH faster.
 *   - GUI improvments
 *   - Attributes are now shown in the printview
 *
 * version 1.85
 *   - fixed bug that own marker have wrong coordinates in printview
 *   - redesign of the cache list
 *   - redesign of "create new marker"-dialog
 *   - adding preview map to "create new marker"-dialog
 *   - adding "move to top/bottom" button to cache list - thanks to adam r
 *   - adding map size control in printview maps
 *
 * version 1.8
 *   - adding overview page to printpage
 *   - creating map with all caches on it
 *   - outline map for every cache + additional waypoints
 *   - adding costum waypoints
 *   - the GPX contains now the current date
 *   - adding information button to show which cache is in tour before loading
 *
 * version 1.7
 *   - adding upload feature
 *   - removed bug, that gctour is not able to handle multiple tabs
 *   - implement sorting
 *   - adding text size option for the printview
 *
 * version 1.6
 *   - fixed downloaded gpxfile - html-/ no-html-mode
 *   - add some fancy sliding effects
 *   - add multiple tour function
 *   - add trackables to printview
 *   - some minor bugfix (e.g. extended table on gc.com map)
 *
 * version 1.5
 *   - add download GPX-button
 *   - add additional waypoints to printview
 *   - add an add all button to the map. thx atornedging
 *   - fixed some mutated vowel bugs in GPX
 *   - tweak update function
 *   - adding changelog to updatedialog
 *
 * version 1.4
 *   - fixing bug, that premiummembers dont have coordinates in the printview
 *   - adding logcounter to printview
 *
 * version 1.3
 *   - adding buttons to the search tables
 *   - progress is now displayed in the print view and GPS Export
 *   - adding language support
 *
 * version 1.2
 *   - optimizing printview
 *   - add the possibility to export the spoiler images to the printview
 *   - add an add-to-tour-button in the GC-Table on the right side of the map view
 *   - fixed minor bug in the settings
 *
 * version 1.1
 *   - extended printview - it is now possible export logs and remove images/logs
 *   - update function is now working ...
 *
 * version 1.0
 *   - initial release
 *
 */

// don't run on frames or iframes, except on "send to GPS" page
if (window.top !== window.self && window.location.href.indexOf("/seek/sendtogps.aspx") <= 0) {
	ThisFunctionDoesNotExistButStopsExecution(); // ugly but works
}

/* globals */
var
VERSION = GM_info.script.version, // will be checked once a day
SCRIPTID = 'gctour',
DEBUG_MODE = false,
GCTOUR_HOST = 'https://gctour.geocaching.cx/',

HTTP = window.location.protocol, // http or https
GS_HOST = HTTP + '//www.geocaching.com/',
GS_WPT_IMAGE_PATH = 'images/wpttypes/sm/',

// set $ to jQuery local (Greasemonkey)
$ = window.jQuery,

// are jQuery and UI loaded
isjQuery = (
	(typeof $ !== "undefined") && (typeof $ === "function") &&
	(typeof $.fn === "object") && (typeof $.ui === "object")),

isOpera = (((isjQuery === true) && $.browser.opera) || (typeof opera !== "undefined")),

tours,
currentTour,
userName,
rot13array,
timeout,
sticky = GM_getValue('sticky', false),

wptArray = [{
		wptTypeId : "2",
		hash : "32bc9333-5e52-4957-b0f6-5a2c8fc7b257",
		name : "Traditional Cache"
	}, {
		wptTypeId : "3",
		hash : "a5f6d0ad-d2f2-4011-8c14-940a9ebf3c74",
		name : "Multi-cache"
	}, {
		wptTypeId : "8",
		hash : "40861821-1835-4e11-b666-8d41064d03fe",
		name : "Unknown Cache"
	}, {
		wptTypeId : "5",
		hash : "4bdd8fb2-d7bc-453f-a9c5-968563b15d24",
		name : "Letterbox Hybrid"
	}, {
		wptTypeId : "11",
		hash : "31d2ae3c-c358-4b5f-8dcd-2185bf472d3d",
		name : "Webcam Cache"
	}, {
		wptTypeId : "4",
		hash : "294d4360-ac86-4c83-84dd-8113ef678d7e",
		name : "Virtual Cache"
	}, {
		wptTypeId : "1858",
		hash : "0544fa55-772d-4e5c-96a9-36a51ebcf5c9",
		name : "Wherigo Cache"
	}, {
		wptTypeId : "137",
		hash : "c66f5cf3-9523-4549-b8dd-759cd2f18db8",
		name : "Earthcache"
	}, {
		wptTypeId : "6",
		hash : "69eb8534-b718-4b35-ae3c-a856a55b0874",
		name : "Event Cache"
	}, {
		wptTypeId : "13",
		hash : "57150806-bc1a-42d6-9cf0-538d171a2d22",
		name : "Cache In Trash Out Event"
	}, {
		wptTypeId : "453",
		hash : "69eb8535-b718-4b35-ae3c-a856a55b0874",
		name : "Mega-Event Cache"
	}, {
		wptTypeId : "7005",
		hash : "",
		name : "Giga-Event Cache"
	}, {
		wptTypeId : "3653",
		hash : "3ea6533d-bb52-42fe-b2d2-79a3424d4728",
		name : "Lost and Found Event Cache"
	}
	// {wptTypeId: "4738",  hash: "", name: ""}
	// {wptTypeId: "3773",  hash: "", name: "Groundspeak Headquarters Cache"} // HQ_32.gif
	// {wptTypeId: "mega",  hash: "", name: "Mega-Event Cache"}
	// {wptTypeId: "earthcache",  hash: "", name: "EarthCache"}
	// {wptTypeId: "1304",  hash: "", name: "GPS Adventures Maze Exhibit"}
	// {wptTypeId: "12",    hash: "", name: "Locationless (Reverse) Cache"}
],

sizesArray = [{
		sizeTypeId : "micro",
		name : "Micro"
	}, {
		sizeTypeId : "small",
		name : "Small"
	}, {
		sizeTypeId : "regular",
		name : "Regular"
	}, {
		sizeTypeId : "large",
		name : "Large"
	}, {
		sizeTypeId : "other",
		name : "Other"
	}, {
		sizeTypeId : "not_chosen",
		name : "Not chosen"
	}, {
		sizeTypeId : "virtual",
		name : "Virtual"
	}
],

attributes_array = [
	// Attribute: [array ID, image, name]
	['1', 'dogs', 'Dogs'],
	['2', 'fee', 'Access or parking fee'],
	['3', 'rappelling', 'Climbing gear'],
	['4', 'boat', 'Boat'],
	['5', 'scuba', 'Scuba gear'],
	['6', 'kids', 'Recommended for kids'],
	['7', 'onehour', 'Takes less than an hour'],
	['8', 'scenic', 'Scenic view'],
	['9', 'hiking', 'Significant hike'],
	['10', 'climbing', 'Difficult climbing'],
	['11', 'wading', 'May require wading'],
	['12', 'swimming', 'May require swimming'],
	['13', 'available', 'Available at all times'],
	['14', 'night', 'Recommended at night'],
	['15', 'winter', 'Available during winter'],
	['17', 'poisonoak', 'Poison plants'],
	['18', 'dangerousanimals', 'Dangerous Animals'],
	['19', 'ticks', 'Ticks'],
	['20', 'mine', 'Abandoned mines'],
	['21', 'cliff', 'Cliff / falling rocks'],
	['22', 'hunting', 'Hunting'],
	['23', 'danger', 'Dangerous area'],
	['24', 'wheelchair', 'Wheelchair accessible'],
	['25', 'parking', 'Parking available'],
	['26', 'public', 'Public transportation'],
	['27', 'water', 'Drinking water nearby'],
	['28', 'restrooms', 'Public restrooms nearby'],
	['29', 'phone', 'Telephone nearby'],
	['30', 'picnic', 'Picnic tables nearby'],
	['31', 'camping', 'Camping available'],
	['32', 'bicycles', 'Bicycles'],
	['33', 'motorcycles', 'Motorcycles'],
	['34', 'quads', 'Quads'],
	['35', 'jeeps', 'Off-road vehicles'],
	['36', 'snowmobiles', 'Snowmobiles'],
	['37', 'horses', 'Horses'],
	['38', 'campfires', 'Campfires'],
	['39', 'thorn', 'Thorns'],
	['40', 'stealth', 'Stealth required'],
	['41', 'stroller', 'Stroller accessible'],
	['42', 'firstaid', 'Needs maintenance'],
	['43', 'cow', 'Watch for livestock'],
	['44', 'flashlight', 'Flashlight required'],
	['45', 'landf', 'Lost And Found Tour'],
	['46', 'rv', 'Truck Driver/RV'],
	['47', 'field_puzzle', 'Field Puzzle'],
	['48', 'UV', 'UV Light Required'],
	['49', 'snowshoes', 'Snowshoes'],
	['50', 'skiis', 'Cross Country Skis'],
	['51', 'tools', 'Special Tool Required'], // meanwhile image is 's-tool', but the minus would cause problems...
	['52', 'nightcache', 'Night Cache'],
	['53', 'parkngrab', 'Park and Grab'],
	['54', 'abandonedbuilding', 'Abandoned structure'],
	['55', 'hike_short', 'Short hike (less than 1km)'],
	['56', 'hike_med', 'Medium hike (1km-10km)'],
	['57', 'hike_long', 'Long hike (+10km)'],
	['58', 'fuel', 'Fuel Nearby'],
	['59', 'food', 'Food Nearby'],
	// liste von http://forums.groundspeak.com/GC/index.php?s=5a098c310648d9f536ab03a85432e70d&showtopic=282652&view=findpost&p=4855718
	['60', 'wirelessbeacon', 'Wireless Beacon'],
	['61', 'partnership', 'Partnership cache'],
	['62', 'seasonal', 'Seasonal Access'],
	['63', 'tourist', 'Tourist Friendly'],
	['64', 'treeclimbing', 'Tree Climbing'],
	['65', 'frontyard', 'Front Yard (Private Residence)'],
	['66', 'teamwork', 'Teamwork Required'],
	['67', 'geotour', 'GeoTour']
];

// TEST Anfang
/*
// TEST wir als 3. ausgeführt
jQuery(function($){
alert("3. jQuery(function($){: " + $.fn.jquery);
});

// TEST wir als 2. ausgeführt
unsafeWindow.jQuery(function($){
alert("2. unsafeWindow.jQuery(function($){: " + $.fn.jquery);
});

// TEST wir als 1. ausgeführt
alert("0 $: " + $.fn.jquery);

 */
// TEST ENDE

/* greasemonkey settings and functions */
// debug output functions
function toLog(typ, msg) {
	if (DEBUG_MODE) {
		msg = 'GCTour: ' + msg;
		//var console = unsafeWindow.console; //firebug console - http://getfirebug.com/wiki/index.php/Console_API
		if (console && console[typ.toLowerCase()]) {
			console[typ.toLowerCase()](msg);
		} else {
			GM_log(typ + ": " + msg.toString());
		}
	}
}

function log(msg) {
	toLog("Log", msg);
}

function debug(msg) {
	toLog("Debug", msg);
}

function warn(msg) {
	toLog("Warn", msg);
}

function error(msg) {
	toLog("Error", msg);
}

function info(msg) {
	toLog("Info", msg);
}

function log_exception(ex) {
	toLog("Exception", ex);
}

// wrapper functions for persistence
function saveValue(name, value) {
	return (GM_setValue(name, JSON.stringify(value)));
}

function loadValue(name, defaultValue) {

	//debug("loadValue: '" + name + "', with default '" + defaultValue + "' (typeof " + (typeof defaultValue) + ")");

	var result = GM_getValue(name, "");
	//debug("loadValue: result -> '" + result.substr(0, 20) + "...'");
	try {
		return result != "" ? JSON.parse(result) : defaultValue;
	} catch (e) { // fallback eval
		//debug("loadValue: FALLBACK :-(");
		return eval(result);
	}
}

// GM_xmlhttpRequest response info
function responseInfo(r) {
	debug([	"",
			"finalUrl: \t\t" + (r.finalUrl || "-"),
			"status: \t\t" + (r.status || "-"),
			"statusText: \t\t" + (r.statusText || "-"),
			"readyState: \t\t" + (r.readyState || "-"),
			"responseHeaders: \n\t" + (r.responseHeaders || "-"),
			"responseXML: \t\t" + (r.responseXML || "-"),
			"responseText: \t\t" + (r.responseText || "-")
		].join("\n"));
}

// set jquery and ui
(function () {

	var str = "";
	str += "jQuery und UI geladen = " + isjQuery;
	if (isjQuery) {
		str += "\n\tjQuery Version    = " + $.fn.jquery;
		str += "\n\tjQueryUI Version  = " + $.ui.version;
	}
	//  str += "\n\tisunsafeWindow.jQuery = " + isjQueryWindow;
	//  str += "\n\tunsafeWindow.jQuery Version = " + ((isjQueryWindow) ? unsafeWindow.jQuery.fn.jquery : "");
	// debug(str);

	// init gctour object
	$.gctour = $.gctour || {};

	// init language object
	$.gctour.i18n = $.gctour.i18n || {};

	// set default Language
	$.gctour.defaultLang = 'en';

	// init current language = default language
	$.gctour.currentLang = $.gctour.defaultLang;

	// jquery ui dialog (default setting)
	$.gctour.dialog = $.gctour.dialog || {};

	// default dialogs (http://api.jqueryui.com/dialog/)
	$.extend($.gctour.dialog, {

		buttons : {

			'OK' : {
				//text: $.gctour.lang('btn.OK') || 'OK',
				text : 'OK',
				disabled : false,
				click : function () {
					// $(this).dialog("close");
					$(this).dialog("destroy");
				}
			},

			'Schliessen' : {
				//text: $.gctour.lang('btn.Schliessen') || 'Schliessen',
				text : 'Schliessen',
				disabled : false,
				icons : {
					primary : 'ui-icon-closethick'
				},
				click : function () {
					// $(this).dialog("close");
					$(this).dialog("destroy");
				}
			},

			'Abbrechen' : {
				//text: $.gctour.lang('btn.Abbrechen') || 'Abbrechen',
				text : 'Abbrechen',
				disabled : false,
				click : function () {
					// $(this).dialog("close");
					$(this).dialog("destroy");
				}
			}
		},

		/*
		 *  Standard Optionen für ein Dialog
		 */
		basis : function () {
			return ({
				autoOpen : false,
				resizable : true,
				closeOnEscape : true,
				modal : true,
				closeText : $.gctour.lang('btn.Schliessen') || 'Schliessen',
				show : 'drop', // blind, drop, scale
				buttons : {
					'Schliessen' : this.buttons.Schliessen
				},
				width : 700,
				height : 500,
				minWidth : 300,
				minHeight : 200,
				maxWidth : 1000,
				maxHeight : 700,
				title : 'GCTour',
				dialogClass : 'gct gct_dialog',
				open : function (event, ui) {
					//$(".ui-dialog-titlebar-close").hide();
					// $(this).dialog( "widget" ).find(".ui-dialog-titlebar-close").hide(); // x oben rechts ausblenden
					//$(".ui-widget-overlay").wrap('<div class="gct"></div>'); // wrap für bessere Trennung zu gc.com
				},
				beforeClose : function (event, ui) {
					//if ( $(".ui-widget-overlay").parent().hasClass( "gct" ) ) {
					//  $(".ui-widget-overlay").unwrap();
					//}
				},
				close : function (event, ui) {
					$(this).dialog("destroy"); // diesen Dialog killen, weil immer ein neuer erstellt wird
				}
			});
		},

		/*
		 *  Info Optionen für ein Dialog
		 */
		info : function () {
			return ({
				autoOpen : true,
				resizable : true,
				closeOnEscape : true,
				modal : true,
				closeText : $.gctour.lang('close'),
				show : true, // true, false, 'blind', 'drop', 'scale'
				hide : true,
				height : 'auto',
				title : 'GCTour Info',
				dialogClass : 'gct gct_dialog',
				open : addJqUiTheme(GM_getValue('theme', 'smoothness')),
				close : function (event, ui) {
					$("head link#gct-ui-theme-link").remove();
					$(this).dialog("destroy"); // diesen Dialog killen, weil immer ein neuer erstellt wird
				}
			});
		}

	});

	$.fn.addShadowEffect = function () {
		return this.each(function () {
			$(this).bind({
				mouseenter : function () {
					$(this).addClass("imgShadow");
				},
				mouseleave : function () {
					$(this).removeClass("imgShadow");
				}
			});
		});
	};

	$.fn.addOpacityEffect = function () {
		return this.each(function () {
			var $this = $(this);
			$this
			.css({
				opacity : "0.5"
			})
			.bind({
				mouseenter : function () {
					$this.stop().animate({
						opacity : '1'
					}, 300);
				},
				mouseleave : function () {
					$this.stop().animate({
						opacity : '0.5'
					}, 300);
				}
			});
		});
	};

})();

/* images */
$.gctour.img = {
	addToTour : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAAAd0SU1FB9kFFAUXKNiDRngAAAJmSURBVDjLjZPPS1RRFMc%2F972n1qiUpqMRaj8UXPVj46Igw0WrKIKkwEWSCC4jjKLoX5BoU5GUJg6KFrVpFYiBEAouAkH0Of4endHRKSSY53v3tHgzbyxddFb3Xu753O%2F3nHMVwOBw5LpSvBQtFQIggpAJkV1lGCOe53a13Ln7lYNicKg%2FtrWdlIMinU7LenxNPn4e%2Ft0%2F8P7Jv7kGgOu6x48eKWEzmWA9ESMWX2FlbYml1XnimzF%2BplLcuHbzcEW48mlfpOfxPoAWQRBcz2XWnsWetbFtmzl7jpmZWaILUQzD4MrlplBB%2FqFn73q7G7MAC0C0BgHPc6mprvaBotGiEa1ZXl7hw6ch8q0Czp09H%2Fo%2BPtYJjAYArTUArreLbUcR0YgIon2QJ5q8vDzCleUopXB33atv3r6y2u91uFbWgg%2FQVFdXAeIDBH5cbMTZ2AQgXV5GQzzB6LcRU0RbgJuzkGnfQnQeUf4awNnY5FJbGyjFWHc3%2FoMa0cI%2BC0opTp05jVIqqPJGVqEEk4FoHajOAPyNaZoszi%2BSuHUbN7nlXwiFfIVKkVdYSMQwKAJTGcYiUGFlJfkAi9q6WmLJLRpaW4MXdUbRhebm4Gy8pyf8dxsVWIaJPb8AwK%2BpKf4nAgsKMAyTuro61sNhpicmAMgvKuJkfT0AC9PTODs7mRE0EmjNHgsK0zQBaJqeyhRS8aXkWFAwZ2eHFtE8f9HliUgN9x%2F6AMu0Vre2kydKS8vI1T%2B30ns6kEqlsCwznk476cCC4zjtA4OR147jVOV%2BsZ9UXlxMdHLSBxUX09vXs%2BJ5bkfng0cC8AdIoVh%2Ffv3rlAAAAABJRU5ErkJggg%3D%3D',
	autoTour : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAFMAIwADJfKnZwAAAAlwSFlzAAALEQAACxEBf2RfkQAAAAd0SU1FB9kKEg8hB1Dip48AAAJvSURBVDjLjdNLSFVBHMfx73%2FOued4r14wpSLQNj0JokUtFIKCgqIXPQgikqSijUrqoqA21lIkywoiCAqyRUZRFBGFoIEkFdHGoPcLF75S79Nz7sy0UK6kIf03s5j%2FfGZ%2BzIwwR7UecLYrl91a0yOiuxpu82Vmj8wFXDzopPedeRrtf98V9r24lRsf%2BpkRpbpzob43tlK3NzVhBODK0ZILYSZRa612ZiI1NzMEqRGUDciO%2FmDwUw8f3z7na9%2BLz3U3s0tdgCAzXlfV%2Bk3F4vPwPD%2B%2F%2BFKVB0B65DvhyAeYGKE4HqNy23E%2BvutcAuACYI1y%2FRjZbIZsNjOdTzlYnaMgXoprFhEMjRIM90GYAGuZBgCbHsCEKbBmatKwbN0ueu%2BcpGxFJb5fgHKL8OML0clf%2BU3yAAMvMalB%2FPmriC1aizgRNh1upvPaETrfPCOdGsOGKUoXLGbL9j0UFcWBsWlATyTo%2F9DL4KtuhpPwO4gxmnWpPtTAhtIyQAhTAwTj%2FSCQTCZmRLCa4iKX4rjHcnEQ16Oh%2FjqvO9r%2FupXmlmpiC1fPjqBzOYJsCqNDrMlhTI6zp9ajdci5ll5On1iD0SFDX3ooceOzAQuIAjGKx9eeA7D12EYcNfnWnIiP47oYrXFcfzagRCGiUI6ws2YHVmseXX3CtuObAYh4UazRWNf8G0AEpSIYDA%2Fb7k03RKKTo1%2BItQZrNK4XnQ2ICCKKB2132duwHwvcb%2B3A8QsmT%2BAXIlNRI35sBiBickFaxcorOHS%2BgluNjfmGwrJKoIPC8sopQNBhGkRM%2FjdeqY5eCIOg1lrr8B8lIjrieZdrbmTq%2FwA8AAC7ufHXbAAAAABJRU5ErkJggg%3D%3D',
	bg : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAoCAYAAAAPOoFWAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAPZJREFUeNq81tsOgjAMANB2ov7/7ypaN7IlIwi9rGuT8QSc9EIDAsAznxvY4pXPKr05RUE5MEVB+TyWfCEl9LZApYopCmo9C4FKSMtYoI8Bwv79aQJU4l6hXXCZrQbokJEksxHo9KMOgc6w1atHXM8K9DVC7FQnJ0i8iK3QooGgbnyKgMDygBWyYFZoqx4qS27KqLZJjA1D0jK6QJcYEQEiWv9PGkTsbqxQ8oT+ZtZB6AkdsJnQDnMoHXHLGKOgDYuCWmYhEERCI5gaamW0bnHdA3k2ltlIN+2qKRyCND0bhqSYCyTB3CAOc4WusBEIpkeBuPgJMAAX8Hs1NfqHRgAAAABJRU5ErkJggg==',
	bottomArrow : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAOCAMAAADKSsaaAAAAAXNSR0IArs4c6QAAAKtQTFRFHwAWEnMAFXUAIncAHXoDHnoHIHsAInwGI30AKH4TK4AAM4UGMYYLO4oQQ44VRI4XSZAbUZYhVpcnWpooYZ0wXZ45Yp4wW587ZJ4wXqBCZ6A0ZqA4YaJFaqI2baI4ZaRHZ6RFbaQ%2BbqQ8c6pOe65UgLJZf7JggbRmhLVlhLVpiLdqjbluj7tzlcB%2FlsGBl8GCncSHoMWJoMeJpMiMqMqPp8uPqcuQrM2Tr86VhHe%2ByAAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsRAAALEQF%2FZF%2BRAAAAB3RJTUUH2ggZCg4FgW6a6gAAAGBJREFUCNdjYGAQFBaTVWIAAQETcws5MIvPWNtcCsziNdQyEwHS7DyiBhqmKtKKDCySuppqOmaqEgwMnDJ66kbKQiB1rPL6CvxgdYxs4txcEHVMHMy41AEBUB0DFHCACADfrAlJwjTUvQAAAABJRU5ErkJggg%3D%3D',
	closebutton : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAPCAYAAADphp8SAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAFPwAABT8BE2RkrAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAK9SURBVDiNfZNLaBNRFIb%2FO5lJJjGSNtO0lNAm0xZaWxeCpMG4KSrUirpxI0TduLIIPkAQBXEhSBe6EEHQhYoNWKuID%2BgLfODGUrCIGlsKtmBfE1MjQ5Kaedzjog%2FGRjzwcy%2Fn3P%2FjHC4HRASnBurrz77Zvv11L%2BDfWCMiDKrq5Vfbto30Al5nXoQjBiORi2oicV6yLL9LkkZSjHUmifS1%2BnBDw1U1Hj8l2rbXJYrDKca6kkR5AGBEtAKpq7sU2bHjvJDJeEEEV2UlFjVtbHZsbO9hy%2Fo5pKrXou3t3dA0GURwKQpmZ2bez42P704SFdc7Mg1DM02z6GbMS7YNvrSE6lAohlhsZCAS%2BRCNxY7y%2BXmPYwBulUpZAMZfHQHAs2DwcF0icd2Tz9eSaQIAXIEASJaJaxpbeyeEQvb3dPpRdmrqSJKIl4EA4GlFxb5wLHbLZ1n1vFRCWSjK77nPn%2B92TU93O9NlIADo93p3qx0d%2FeKvX5Vw1KWaGnwbHX1wYHHx2EaPsDGRYkyuiEYviLZdaXMOm2hdRi6HYFPTzsc%2BX8t%2FQSnGPFVNTS%2BU2tpdZi4HzvmKAHDOYS0vQxaEBqW5uf%2BhJFX%2FE5RizB1U1WdKOLzH1HVwInAikN9vmm53hgQBnAhWsYjNgcDWYGPj8xRjvjKQv6rqnhKNdhq6Dptz2JyDb9pkLE5M3F74%2BPF4SRA0DsDmHIauoyIcjvtDoftlIKNQ6NGz2UmIIjjnIJ%2BvpH39evPgwsLJQ7r%2B8kc6fc50uXKcCJAk6JnMpJHPX1mfzbkvfbLcOtzWln6XSBSeKEoPAAmAZ1XuvkDgzNt4XB9qafnSJ8utTu%2F69zPGPADk06K4pdnj2X%2BiULgHwL0KEwBwAOYNny%2F5yTCG7ljWBIASgN9EVHKCGABx1bwmz%2BopALAAmFhZCcNxN4mI%2FgBbEHoE%2FKbG8wAAAABJRU5ErkJggg%3D%3D',
	copy : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAATdEVYdFRpdGxlAE9wdGljYWwgRHJpdmU%2BZ7oMAAABg0lEQVQ4jZWSy2oUQRSGv6qucaXuRFwqvorOmB7fIgR0J0iDZCUowoCCFxS84EJ8BS%2BTCT6NqCE7jWZyTtfvonvGMd2LSUFBURTfOf9XJ7x7%2F%2Fa%2B1V4pK0lCEsqZxTlLSHgqisnW5o1tjq9Xb16Y1liPnz60ZYGVncw9AXz78ZUQQrsBAgCSOH%2FuAkdmqVMdSG7eHFJiNp1BCLQEAIZXrwCweNcBmFsLGLBRbhBCJKwAJAFgZv2ABbkoCqafp00EYpNAMLo2agDuvHz9XMfFLjsoYkFZlhSxIMZICLH5hVy3EYytzZv%2FFX%2Fy7FGVVrN9%2FPCJGCMxBsbj681lG8fc2dv%2F3hGbFtlyzgxHwyXA3RBCWTBoOtjd%2FdIRm%2BqcHUhnTp%2FtlbSUCYzLsiM2hRgmt6tbVV3X6Z%2BgpvJiWGIMXLp4mZ2dWUdsZ7Ikce%2FBXUnSr4Of%2Bv3nQPP5ocyO5O4yM83nh5KkO9uVeqfrJGJ7AScR2wtYV2yds%2FcC1hEbAj4YnJr8Bf6RZNsaEpA%2FAAAAAElFTkSuQmCC',
	danger : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAIwSURBVDiNjdO9T5NRHMXx7%2B%2Fe573tU%2FoUCpTy1kjlTTExIRol0ZiY4OTE0iZuuhgHIxvRuGhcUAeMcXNwcwH%2FARcHjUpYTExUEsWQ6CAEWiiFXhc1QYvhLHc593OXc8UYQ6MsXJACyn4mZqdcM%2FXzRx%2Bbz416quFtQDnBk47j431to%2BdGHMt5uGev4eslORvrOTIUtmQk2ZpRXnbw1EJRRvcHiIhOJGda%2BoZ98SOUl6Tl4CFPfP%2FBvoC3RSYSPSNZ11WojiFUtp%2FAtyWWGxiYL8n4f4Hnp8Vy48l7UbY9EMtBpbKo5jxYFs1dXYH2%2FRluitoTaOrgYjzXFzpSRbUXmJyeZXJ6Ft3ej6drxNvymfmPFBsCby5JoILErSgdBOIGqGQLzaFNpslBRR2I45LOhDFl%2B9Mfroj7D6A2uNaUydh2vYLuHMRsb5BN2WQjG7Ozie4cxmWDMJ32yytc3gW8m5DIcrzJVIJAEhESC2G7QnezTb7Vhe0KEqYRSxM5qzED11%2BWJPwD1DxuJELXsswGunsQamWorjHWH3CsV8P6EpS%2FojsL2PU1wgDLF6YAZKFIzmje53Nu4OQK2IfP%2FB4E%2BuRdAHZeXAVjwNTZej3H1vIin5ap7BgOWGjuNMWxtami23upb64iokAUS09LgGCq64DBmDq6awDr2yKpOPrHGrctYCzuYQNsvZrbNZLUr7P693qAwMNdKXPCMoZHX74zZQxug97eETaV4b7s9Z33m5%2BP5JF%2FA6jokgAAAABJRU5ErkJggg%3D%3D',
	del : 'data:image/gif;base64,R0lGODlhEgASANUlAJaWluXl5dfX197e3pSUlNnZ2aampre3t3p6eubm5qioqLW1taenp9zc3LOzs7a2toGBgdra2t3d3YuLi3x8fKSkpHV1dc%2FPz%2BHh4ZiYmH5%2BfpeXl4qKioyMjMXFxaKior%2B%2Fv8vLy9DQ0LS0tDs7OwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAACUALAAAAAASABIAAAZ4wJJwSCwaj8gjaZkcLp9QJOkhGHgACM2EQzJCv9EiaQSKBEQGAiHT9Y5IGFKBpCAB2uJ3gNQgOUgfeEQkCyR7EmN0gk4PJAl8iQyLQiQHjnKRkyWEhiQCfiQbmiQVJAMkFyQGJBSjCAAHISMAHRAWmptgTE28vUdBADs%3D',
	dialogMask : 'data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%08%00%00%00%08%08%06%00%00%00%C4%0F%BE%8B%00%00%00%01sRGB%00%AE%CE%1C%E9%00%00%00%06bKGD%00%FF%00%FF%00%FF%A0%BD%A7%93%00%00%00%09pHYs%00%00%0E%C4%00%00%0E%C4%01%95%2B%0E%1B%00%00%00%07tIME%07%DB%03%17%0C%03%0F%8C%CB%E4%8C%00%00%00%19tEXtComment%00Created%20with%20GIMPW%81%0E%17%00%00%00%26IDAT%18%D3c%F8%FF%FF%FF%FFMW%3E%FF%C7E3%FC%87%02%98%20%3A%9F%81%A0%09%B8t%C2%00%C3%20p%03%00%DA%B4%F2%A1%8A%CD%18%A3%00%00%00%00IEND%AEB%60%82',
	downArrow : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAOCAMAAADKSsaaAAAAAXNSR0IArs4c6QAAAKhQTFRFEnMAFXUAIncAHXoDHnoHIHsAInwGI30AKH4TK4AAM4UGMYYLO4oQQ44VRI4XSZAbUZYhVpcnWpooYZ0wXZ45Yp4wW587ZJ4wXqBCZ6A0ZqA4YaJFaqI2baI4ZaRHZ6RFbaQ%2BbqQ8c6pOe65UgLJZf7JggbRmhLVlhLVpiLdqjbluj7tzlcB%2FlsGBl8GCncSHoMWJoMeJpMiMqMqPp8uPqcuQrM2Tr86VayLUTgAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsRAAALEQF%2FZF%2BRAAAAB3RJTUUH2ggZCiMw9%2FcEJgAAAFZJREFUCNdjYGAQEBKVUWQAAX5jM3NZMIvXSMtMEsziMdA0FQbSbNwi%2BuomylIKDMwSOhqq2qYq4gwMHNK6aoZKgiB1LHJ68nxgHQysYlwMUMDOQAIAAGnkBmRhpsy5AAAAAElFTkSuQmCC',
	download : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEQAACxEBf2RfkQAAAAd0SU1FB9oIGQorAW7wjhQAAAMSSURBVDjLnZNNaFxlFIaf797v3tvMTOd%2FJjOZ%2FHSGhAyZmh%2FIlEhjSS00gihxoUatQqXqxoWFRkHBlVTcCi5ciBFLXQiiq0oRQw0qpoS0IaFiiyGJSabJOBPNZO783s%2BFaDBLHzibw%2Fs%2BiwNHcIjJ16dfAV7WpexTYCnH2VeKOU3Xrly9fO7jw3nxb%2FGNTwZNXfu6JxlrHenvIpkI4bIsiiWbe%2Bs7zC%2Bvc3dt%2B6YQ4sLVy%2BcW%2FyN46uJHWbe35aeJ0wNioCdKsWSzs7mG9EShJQDlHRKtIeaWN7g2u%2Fw7Qjz8j0QChEKeb86ezIgHUkEK%2BRzhzgy%2BcJxypU5u%2FVekU0Nr2pzJpmg6KnT9hzsfAg8CaC%2B%2B9ek7sWjAezrbjaE5NKQHNIEhJaYhcVmS1tBR4tEIEb%2BbbKadrrbgyLNvXjkPoHl9rgvDmU52i3nuV11E246hFDgKEBrCqbFV2OfLG0tcn53HZyn6utsAngSQe%2BV6pCsWYO7uNqmeKI46uGxpt8CJwQxCCJRSbGzdp2LbxCM%2BgGEAWak1NMsy0TxRdksVmo7CY%2Bk0m01qpR2ECANwa3wczeNh5aVXiXT0AgQBpK5rzh%2F7Fc1d2cQjLbb3w%2BQNk0bToVJoMFivc2t0FO%2FwMPbKCscSEbbtGkABQBqallv5Ld821B0j1RFndX2D2Xt%2FUsPErrn5dmSE9nSaowMDqGoV%2B%2BJrRAyDKdOMTE1MKH3ooSeSpWr9RKY7Qdjvxu%2Fz0hHQmVncou3tp0l1dhI4dYrq5ibuvj48x4%2F%2FPZkMpcVF9IXvvrjWnX3sktB10%2Bc2aDF1fpxfojb1Av3xOIGxMSqrqzTLZRrFIvVCgUaxiBEMsnf7NjpAsm%2FsztauPekgkVLj8%2B%2FX%2BaX%2FcZwbn9Fq27jTaZxKhSPt7UifDyMYBKXYW1g4%2BIVHz7%2F3TGeqY9rr85vpVIxY2ItlGSxNnuVkMol%2FdJTizAxr%2BTxHNA0JeKQ8EAD4g0lz%2FPlL07rlegRd%2BkEIpZzGma%2FelUOJBD%2Fncjy3tCT4P7zf26s%2BSKfV4f1fpUgaHTdq5X0AAAAASUVORK5CYII%3D',
	downloadGPX : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEQAACxEBf2RfkQAAAAd0SU1FB9oIGQotDqgVNAMAAAG4SURBVDjLlZPPaxNBFMc%2Fs41CD1oMlVp1FUIPBhR6UxCPestucvIiqPtn%2BAOyET2I5yoUAmL%2FgMwS9OTBH%2FGgqHgT%2FAF1QTwYLG01yezsjKeN3TS25J3mveH74715I5rN5qM4ji8xQbiuSxAEAoAwDO2kEYahzcgK2aHb7WKMAUAIMVRzHCenXiwWc%2FmQwBhDu90eXnieRxRFw9z3%2FbHtOKOFSqWC53m7ArcRZLaFEDllKeWOBIXRQgbOCHdzkCPIrI8D15%2FU6Kl1lq%2B%2B%2F38LURQhhEBKmXsJgIFWHJ0tc%2FHBiZ0dSCnxfZ%2F6Yw9rNMpoVKo5fGCB8vxpNvq%2FedFbGk%2BwdZDaKM6fvExqDalJMVi%2Br8Wccs%2ByqXr8uv3Mvr2uRGErWEpJtVql1WrRR5Faw%2BrPTyRGo01CkiasDzZYdM%2Bxmfxh7WbH5vYgG1qtVqOv%2B%2BhUMzdzjEP7jzM%2FU2LP1DQH9x3hXdyh87nDl1v8czC6oj094OGreyij6OuE0myZM6ULvFl9ydOPz%2Fl2BwFQcF13pdFobPuNi1zJ5a0fdxHONK%2B%2FfqC%2BcH8pIGCiKN3Ya91rU3a0%2FheAk99ghKc72QAAAABJRU5ErkJggg%3D%3D',
	edit : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAKQ2lDQ1BJQ0MgcHJvZmlsZQAAeNqdU3dYk%2FcWPt%2F3ZQ9WQtjwsZdsgQAiI6wIyBBZohCSAGGEEBJAxYWIClYUFRGcSFXEgtUKSJ2I4qAouGdBiohai1VcOO4f3Ke1fXrv7e371%2Fu855zn%2FM55zw%2BAERImkeaiagA5UoU8Otgfj09IxMm9gAIVSOAEIBDmy8JnBcUAAPADeXh%2BdLA%2F%2FAGvbwACAHDVLiQSx%2BH%2Fg7pQJlcAIJEA4CIS5wsBkFIAyC5UyBQAyBgAsFOzZAoAlAAAbHl8QiIAqg0A7PRJPgUA2KmT3BcA2KIcqQgAjQEAmShHJAJAuwBgVYFSLALAwgCgrEAiLgTArgGAWbYyRwKAvQUAdo5YkA9AYACAmUIszAAgOAIAQx4TzQMgTAOgMNK%2F4KlfcIW4SAEAwMuVzZdL0jMUuJXQGnfy8ODiIeLCbLFCYRcpEGYJ5CKcl5sjE0jnA0zODAAAGvnRwf44P5Dn5uTh5mbnbO%2F0xaL%2Ba%2FBvIj4h8d%2F%2BvIwCBAAQTs%2Fv2l%2Fl5dYDcMcBsHW%2Fa6lbANpWAGjf%2BV0z2wmgWgrQevmLeTj8QB6eoVDIPB0cCgsL7SViob0w44s%2B%2FzPhb%2BCLfvb8QB7%2B23rwAHGaQJmtwKOD%2FXFhbnauUo7nywRCMW735yP%2Bx4V%2F%2FY4p0eI0sVwsFYrxWIm4UCJNx3m5UpFEIcmV4hLpfzLxH5b9CZN3DQCshk%2FATrYHtctswH7uAQKLDljSdgBAfvMtjBoLkQAQZzQyefcAAJO%2F%2BY9AKwEAzZek4wAAvOgYXKiUF0zGCAAARKCBKrBBBwzBFKzADpzBHbzAFwJhBkRADCTAPBBCBuSAHAqhGJZBGVTAOtgEtbADGqARmuEQtMExOA3n4BJcgetwFwZgGJ7CGLyGCQRByAgTYSE6iBFijtgizggXmY4EImFINJKApCDpiBRRIsXIcqQCqUJqkV1II%2FItchQ5jVxA%2BpDbyCAyivyKvEcxlIGyUQPUAnVAuagfGorGoHPRdDQPXYCWomvRGrQePYC2oqfRS%2Bh1dAB9io5jgNExDmaM2WFcjIdFYIlYGibHFmPlWDVWjzVjHVg3dhUbwJ5h7wgkAouAE%2BwIXoQQwmyCkJBHWExYQ6gl7CO0EroIVwmDhDHCJyKTqE%2B0JXoS%2BcR4YjqxkFhGrCbuIR4hniVeJw4TX5NIJA7JkuROCiElkDJJC0lrSNtILaRTpD7SEGmcTCbrkG3J3uQIsoCsIJeRt5APkE%2BS%2B8nD5LcUOsWI4kwJoiRSpJQSSjVlP%2BUEpZ8yQpmgqlHNqZ7UCKqIOp9aSW2gdlAvU4epEzR1miXNmxZDy6Qto9XQmmlnafdoL%2Bl0ugndgx5Fl9CX0mvoB%2Bnn6YP0dwwNhg2Dx0hiKBlrGXsZpxi3GS%2BZTKYF05eZyFQw1zIbmWeYD5hvVVgq9ip8FZHKEpU6lVaVfpXnqlRVc1U%2F1XmqC1SrVQ%2BrXlZ9pkZVs1DjqQnUFqvVqR1Vu6k2rs5Sd1KPUM9RX6O%2BX%2F2C%2BmMNsoaFRqCGSKNUY7fGGY0hFsYyZfFYQtZyVgPrLGuYTWJbsvnsTHYF%2Bxt2L3tMU0NzqmasZpFmneZxzQEOxrHg8DnZnErOIc4NznstAy0%2FLbHWaq1mrX6tN9p62r7aYu1y7Rbt69rvdXCdQJ0snfU6bTr3dQm6NrpRuoW623XP6j7TY%2Bt56Qn1yvUO6d3RR%2FVt9KP1F%2Brv1u%2FRHzcwNAg2kBlsMThj8MyQY%2BhrmGm40fCE4agRy2i6kcRoo9FJoye4Ju6HZ%2BM1eBc%2BZqxvHGKsNN5l3Gs8YWJpMtukxKTF5L4pzZRrmma60bTTdMzMyCzcrNisyeyOOdWca55hvtm82%2FyNhaVFnMVKizaLx5balnzLBZZNlvesmFY%2BVnlW9VbXrEnWXOss623WV2xQG1ebDJs6m8u2qK2brcR2m23fFOIUjynSKfVTbtox7PzsCuya7AbtOfZh9iX2bfbPHcwcEh3WO3Q7fHJ0dcx2bHC866ThNMOpxKnD6VdnG2ehc53zNRemS5DLEpd2lxdTbaeKp26fesuV5RruutK10%2FWjm7ub3K3ZbdTdzD3Ffav7TS6bG8ldwz3vQfTw91jicczjnaebp8LzkOcvXnZeWV77vR5Ps5wmntYwbcjbxFvgvct7YDo%2BPWX6zukDPsY%2BAp96n4e%2Bpr4i3z2%2BI37Wfpl%2BB%2Fye%2Bzv6y%2F2P%2BL%2FhefIW8U4FYAHBAeUBvYEagbMDawMfBJkEpQc1BY0FuwYvDD4VQgwJDVkfcpNvwBfyG%2FljM9xnLJrRFcoInRVaG%2FowzCZMHtYRjobPCN8Qfm%2Bm%2BUzpzLYIiOBHbIi4H2kZmRf5fRQpKjKqLupRtFN0cXT3LNas5Fn7Z72O8Y%2BpjLk722q2cnZnrGpsUmxj7Ju4gLiquIF4h%2FhF8ZcSdBMkCe2J5MTYxD2J43MC52yaM5zkmlSWdGOu5dyiuRfm6c7Lnnc8WTVZkHw4hZgSl7I%2F5YMgQlAvGE%2Flp25NHRPyhJuFT0W%2Boo2iUbG3uEo8kuadVpX2ON07fUP6aIZPRnXGMwlPUit5kRmSuSPzTVZE1t6sz9lx2S05lJyUnKNSDWmWtCvXMLcot09mKyuTDeR55m3KG5OHyvfkI%2Flz89sVbIVM0aO0Uq5QDhZML6greFsYW3i4SL1IWtQz32b%2B6vkjC4IWfL2QsFC4sLPYuHhZ8eAiv0W7FiOLUxd3LjFdUrpkeGnw0n3LaMuylv1Q4lhSVfJqedzyjlKD0qWlQyuCVzSVqZTJy26u9Fq5YxVhlWRV72qX1VtWfyoXlV%2BscKyorviwRrjm4ldOX9V89Xlt2treSrfK7etI66Trbqz3Wb%2BvSr1qQdXQhvANrRvxjeUbX21K3nShemr1js20zcrNAzVhNe1bzLas2%2FKhNqP2ep1%2FXctW%2Fa2rt77ZJtrWv913e%2FMOgx0VO97vlOy8tSt4V2u9RX31btLugt2PGmIbur%2Fmft24R3dPxZ6Pe6V7B%2FZF7%2BtqdG9s3K%2B%2Fv7IJbVI2jR5IOnDlm4Bv2pvtmne1cFoqDsJB5cEn36Z8e%2BNQ6KHOw9zDzd%2BZf7f1COtIeSvSOr91rC2jbaA9ob3v6IyjnR1eHUe%2Bt%2F9%2B7zHjY3XHNY9XnqCdKD3x%2BeSCk%2BOnZKeenU4%2FPdSZ3Hn3TPyZa11RXb1nQ8%2BePxd07ky3X%2FfJ897nj13wvHD0Ivdi2yW3S609rj1HfnD94UivW2%2FrZffL7Vc8rnT0Tes70e%2FTf%2FpqwNVz1%2FjXLl2feb3vxuwbt24m3Ry4Jbr1%2BHb27Rd3Cu5M3F16j3iv%2FL7a%2FeoH%2Bg%2Fqf7T%2BsWXAbeD4YMBgz8NZD%2B8OCYee%2FpT%2F04fh0kfMR9UjRiONj50fHxsNGr3yZM6T4aeypxPPyn5W%2F3nrc6vn3%2F3i%2B0vPWPzY8Av5i8%2B%2Frnmp83Lvq6mvOscjxx%2B8znk98ab8rc7bfe%2B477rfx70fmSj8QP5Q89H6Y8en0E%2F3Pud8%2Fvwv94Tz%2B4A5JREAAAAGYktHRADVAJ8AvxXHGoYAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfZBwcIASdkENZ8AAABgUlEQVQ4y5VTvUtCURT%2FmUmSWCqaSUtbEA1R4GRfFARBNfV%2FRNYUjY1JTY0N4VAiDdEgSNIQTUVDtgZBiPmBVkrq8%2FwaHj6VZ6%2B8cOGcc%2Fl9nHPvBbpckeAWW%2FOebsHjE6ttJKZGcH4WphHYVn3EqLKi5c9Pl9g4CJk0MEmKkPV6nYqisFarslqpsFL55tXpDpXXMJMnCSZPEmx10NvUINLplE75IX6I5blJpLNFjC0CF0f3CGwHgYNQO4EI4fEMgUKQ6o5H9jSw1z2I2M0j6J9GxyEKBZnMO7K5DHL5bEdwYH1X57B5C0K4XG44nS7V9oK%2FHby2C4p%2Bzs0WSOTzWe0g%2FZ6B1zuM2PUdppY2US6XYO2zGhCIwOFwQkhEo7dqMfmiKpMgBWLkABQUigUAwP5xRCuXyyUttlgsvxOQhN0%2BoN0AKZBGLKLVDVogPr8%2BDJ%2By2Ww2ciCw9dtUVaiqQgKi5oqigCI6gn%2F%2FhcaamZ2Hzzdi0hEAQCr19idJKxgAfgDG6PPJecMc5gAAAABJRU5ErkJggg%3D%3D',
	gctourLogo : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIcAAAAYCAYAAADQ1%2B6cAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oIGQo6LQ%2FxwecAAAAdaVRYdENvbW1lbnQAAAAAAENyZWF0ZWQgd2l0aCBHSU1QZC5lBwAAEBBJREFUaN7tW2tUVFeW%2Fu6jHlRB8S5eIo8SRFAQFaKxfSW2qBgjMmpixkfSJplMllkaku6OkzG2vZJxTDR20tMmrCahk8YsO3REDGjHFyrYohGiRsQSQZRnBSwKq6iqW3Xrzo%2Bcq8ebinavNT8GV%2B5aZ91bt86rzv7O3t%2Fe%2BxQDckmSxODOxQDgAKgAqAFoAGjJsxoAT75nSX0RgADABcBJ7m7yTgQgMQwjUf0rx%2FvBpax%2Fvzb%2FF%2F3%2FdCnWSLGQDBE4RwCgAaADoCclgAKJDBCGAscQADuAQQC3yGc3AK8MEMVY9P22XBX3H8z3n2hzL4BIPwHl3hdPhEWDQgaGmoBBDyDw1JtP5vdfOvVzdVConeVVrMdhCx%2F6riOJ5VWCPia5ZcTUxX9Pe%2BLX5xiOsxFAqUi%2FPrlIkkQDkC4MJTAfuYvkLinaMD%2FSRllfWY8GhUTNS5IkifkJIH52oiRJLAGDijIbKlI0AHRfPZe5Xh0UJjy0YdeRgPBY2cxwouDmzH%2Fdnta2v%2BQRR%2FfV0dqw6I7Uf3nls9FLik4D6AXQA%2BAmAAfRHrLAeGoc2jzJQvaQ%2Bl5K2Dw1T568k4Xspdr4KLOoNH%2ByCaTHEClA%2FlMmyJ%2FpepBAxkiSpFKYDy0lNO7o%2BmlLw9Ieupb1%2FDtXARiuH%2F1s9K0Oc0zGijeayOICAH%2F1yw%2FGXCp783FnX0ecccLsAzP%2B%2B%2BBOAJ0EJINEGBylkWgTxVGC8xDO4qI4C0fxHnp%2BEqnvJlzHTc1JBrGGApNP0b%2BTfJYB4s80SfcyyT9mrh4EkLBkoQMABAOIxMUDY%2FDJLxYCCDOXb09X6YOdWc%2B%2Fc44somegpTH86t7%2FWUgtsgOA07Tg38x5HzUVB8aOumZpODSv%2FXDZGACBFABkAIYAiAQQDSAOQJwgCPGCIMSTz7EAYgAYAYSTEgkginwXByDO5XLFezweum4kgFAABqqEkfcxVL9yvSAyHy0FIo0f7UlzK4bSShylyeh6HNl0zP1I8f97zkHKHaH9ZX0RHl1XBSDkRs3uvFm%2Fqy0mu8ELwGta%2BGLTlYr3g31eQWJ5tUjeswB8qoAgccrG8orrRz%2BLGzGtUOYeOgIiiTyHAQi5fPlyfHl5eUFHR8ckl8tlBACtVmuJi4trWLRo0d6xY8feIO188hzPnj2buG%2FfvkU9PT3j3W53KACfXq%2B%2FkZCQcGzlypXlUVFRfYQE%2BwCo1q5dWyyKYgTDMCxD2LAkST6DwdC4ZcuWN8i8XRRf8fm5eynzIykIuz%2BT6KW0kTTcwSFrDgOOf5iNXnMucp7cfe3gJxkBEXF2llNpyI%2FkAHD6qAQh1JTd0Fm7Jz5%2B5rI2SvvwADjDyDGu2MkLer67cDw%2BeuKcfmKqPKQPA4DwL7744mfV1dXrQkND22bNmrU7MzOzjed578WLF0eePn16xo4dO3bk5eX9YcmSJV%2BTdvyuXbsePnz48Jro6Ohz%2Bfn5Jenp6ddcLhfT0NCQfObMmQWbNm16dNWqVa9Onjy5lZgjdvr06R%2FxPB%2Fe39%2BfXFdXt2rJkiXveDyeIZ1O1000h1pBZH2KQpssgbzjKG0je23y5nETsDGySZQkadiaGP4ul%2FXUp7MQZLQgwKC9fmTX1JRFaw8S0yDzAh0AbfrKN05c%2B1tpZvzMZRar%2BWxga3Vx5kDr%2BVRHT9tIwdYXLvlEVmcc2Z5f1n6FtPcQEIXU1dWNq6qqenXChAl7XnjhhS9ZlnWQhZRGjRrV8fjjjzcUFxfn7d%2B%2Ff21iYuKbOTk5lhMnTiQfOnTouenTp5etXr36IHGX3QDEjIyMK0uXLj20cePG9aWlpb9NT09fYTAYvADEJUuWNAKIqK2tZevq6jB%2F%2FvwW0tZOwBFImQp%2F3pKL1LUR8%2Bkja6GnzJKa1HcR932Q0iK%2B4aw9%2BLtsZ0%2FzGESP7gagGeptT4jOmSsQM%2BDFd616BEcz8Lj0hoQMceBq45ivnh9v4hhIQRExAyHJmZbIzBm9nCYAnErraan8fa6rtzVCG5U8SHkqQRUVFStHjBhx9sUXX6wiiz5IdqYkg%2FS5556rioiI6Jd3aWVl5eLk5OT61atXHwZgJUUWFqvRaFQvvfTS5urq6rTu7m6vwWAYojiVSxRFjyK4FwBAe%2F78eWN5eXlhb2%2FvWFEUA%2FR6fU9GRsaxZ5555jjP8%2BK6deteXbx48dvTp0%2F%2FhjIxAVu3bl1qt9uzNm%2FevPvll1%2FePGXKlL0nT57MY1m2e9u2bS%2BT38PeJ84yLMBxJ%2FbAMAxC4gYBqCXRq2VYLhCA1nNqV8zA0Y8noevbUb1OlrkZnnEjMHbUTXVQ2FBuSswtXK4ZhcK3ziM%2B2wmAh3OQMx77r1nMe3OfxZvm3xBhMC0tLcb%2B%2Fv6MwsLC31C7cpDiJLdV9%2BLFixsAGNra2mL6%2BvqSly9f%2FikBhBVAH3mWPRlVXFwc9%2Byzz3bKxJkyd4IkSSIFFjUArra2Nqm0tLQoJibmXEFBQXFERMTghQsXRtfX1y%2Fu6uoat3HjxjKbzZYhCEIExZtYABqXyzXSbrenAgixWq1jDh48ODI%2BPv7o%2BPHj9yi00LDnHHfsLcP60NU0AoBKkny85PMFXvrsrdTmXW%2FlZxlc2oRglSd01ppj%2FNJt57w%2BH75akfiMqMu9yvW1xmLQ8r35%2BNMzD6G%2BLCfMJ%2FBuZ4CDsstobm5OYFnWnZub26Egej6K1NGBLO7KlSsxHMcJWVlZXZR35FCAg1e4w%2FJ7D7H7Eg0OURSZ3bt3%2F8JkMp167bXXPpWJ76RJkzpyc3Ovvvvuu69XVlZOBACO4%2BiUAQCoOY7jWZZlCegxevTo40VFRX8C0PWPxk6GCzjk2IKAxJyz%2BPbAPBzaYdKEGG%2FdNJ%2BJDEudZA9OzmwPmfpIG5%2B%2FzowvXpuA10et4tdW7dHGploua9MG0vlvRGTk2WC9ocPFA2kQBR4AOMGuozSTJIoiyzCM%2BP26fi%2F87du3z7NarZEMwzAsy3JqtVqj0WgC1Gp1gEqlCtDpdD6GYXwsyzL3iT3cKxIqXxwAtr6%2BPt5ut8esWrVqGwHGIFmHgIyMjE6TyXSmoaFhPACwLMtT7i0LQMNxHM8wjKyZkJWVdYEioy6ynsMeHCwVr7BjxR8roAvpx%2BcvF07RdIYO%2FnVTTnTOXOuj75%2FaH%2F7EW5cQZBTx5O8b4HFq0N8eFJY6qaf73IkkMCxQ91EizlfFwtYdKnfuSp19ilLzYnJycocoirrm5mYjYfwBLpdrpMvlSnU6nSlOpzPF4XCYbDZbQk9PT1p9ff2CiIgIh9fr1VJtdFSeR0dIpRzXCCLfqanYhBJAbHd3d7hGo7kVGxt76%2FbGoJKFRqOx69atW6FEcyiDhDqO41QEHCwAqNXqIQocbipSO6yDYTxZHAcAG4Kju%2FHGhY344%2FJ%2F1ZmPTU0avBEl%2FWpELDPz389gzi9bwPES9r0xFiwvImthX6wUJF0%2Fsisbr2w7is%2BLZsH%2BnUHuuMWh8iQ99d4hatHYcePGdQUHB7fu27dvRlpa2ucAxA0bNuyXXU8ihEAAhp07dy6w2%2B1ReXl55gMHDli%2B%2FPLLmWlpaddJAEsi4PDJYX5RFPn6%2BvqwpKSkzpiYmH7SJ6PQND4ACAkJuSUIgs5ut6sDAwNld17WLIzdbg%2FSaDRDLMv6vF5vAJmT7N7qJEkKIuDgSRjdR8YTFDERPAiaY4gQPQuCY9pRdPRDbLq4YcA0p85t6zOg4j%2Fm49cjVuDzoiycKH4IQUY7vt1vNPIubnxach%2F2vv4zGhj9YoD7Zubyo1x4vI0wd6fME2bPnl126dKlR%2Fbu3ZtNFj2YCDyEPOtrampSvv7669lz5szZx3Gcffbs2dVNTU0zKysrJxHvKUoR9YzasmXL2tLS0hKn0xlMhdcZkliTBeUFIEyePLmF53nX7t27pxCQBZGxAx0Oh85sNk80mUzNer2%2Bv7W1NYHMM5REa0MsFstowjk4Ag7RD9eQhnsIXeYcTmqHfR%2F4iRnjDvnl3%2F58%2FsOiHt%2BpP8%2FKFFwa9tD2mQAAp02P9%2BcvBYCRfkx%2Fv6h2T3h6099h7%2FciMNxFwCcBQH5%2B%2Fpne3t6SysrKZ5ubm2see%2ByxI%2Bnp6X0A0NnZadizZ8%2F0xsbGednZ2ZX5%2BfknAYgLFy480d7ebqioqHjBbDYnFxQUfGUymfoBSGfOnImtqKhY1NvbO76goGBDcnKyg%2BIbIgCRcmWdALx6vZ6ZNm1aWU1NzdMMw4hPPPFEnU6nE8xmc3hJSckKhmHEZcuW1bjdbpw%2BfXpuWlpa28MPP9w6NDTEl5SUzLVarUlGo7FNzuOQ%2FkVKuzwwiTc6gynb9GAq%2FxHVWlU88fIn%2F7lwaoSgMngHAv32xKm8Xaq474asluCECTMaVH3mcCTmHsGaXWXE9fSQ%2FkMBhB4%2FfnxsdXX1UovFksXzvIthGFEQBENwcHDrjBkzygsKCk7LwpTD53v37p147NixQqvVmqJSqQYlSWJFUdQZjcazhYWFH%2BXk5JgB9BMt6CZmKqyqqmpyeXn5Bx9%2F%2FHEBlenVlJWVTa2trX3K7XaHqVQqhyAIQdHR0Y1r1qwpNZlMNrfbrX777beXt7a2zuJ53i6KoiYkJKQ9Kiqqra%2BvL37r1q3vPf30039YtmzZS3Pnzq0FYCGxGzcA33DXHHRyiKWipYEAIm4nutyOGC%2BYoBvFL05N%2BrZ0qoUNHdRqtG6OESFIvKdP4MTrNi%2BrMU26NNkUfZO%2FejwNLGfDUx%2B8h5RpZkpYHCF1MoHUWa1W%2FYULF2IFQeBTUlIsCQkJVsoMDZEdyRP1HwhA29nZabh8%2BXI0y7K%2BjIyMrsjISBupayPFTkCgIeOEEGDKsRRJzg6LoqhtbGyMs1qtgSkpKT2JiYlWilByAFSdnZ2GpqammLCwMEd2draFZVmaw7jImP1UcE54EMyK8iSY7J7pAYRD9Mah69tUHP%2FwETy18yKGBrQoinxF2GrZ1NtwKMjrsnsCwmJtoaMn9WsM4e7bUcShAREttTwyF7SSBRukhKL1k7JnFSl1OgVPp%2BzlNjxpI7uqAqk%2FhDunz2SyqiPt1FSUU6L6VKb0vRQ4WCrFwCpC7LQZdhJAOqg5PxjgoADCULs0FDe%2BScJf1q%2FB1ZMFSJh4FppAJ9x2FX51skSxGN57JKwclO8v4e6TZjwlGIbiCbL7qxSSSkk2cfcBIQ91BgSKsVhFck1Or6sU4KRPldEn5FiKy9BCF6lx5TlLD8J5Dv42Sr7PaNOpZwHx4%2FuQMLEeEUmdMI4axLwNTZTA7WSXCpQQ7yKClMA8ioSWl3JfWT%2FBK3%2FH%2FgRKSMr4hU8hWCiA4KXA9GNHD3%2Fg8lIbiFGMKfmZr%2B9BcWH9RhWJ9mApdRxEipYIRs5UOnH3ySufQtX6S4Hf64CxUjjSPaKgyvYS7n0oGfdJgNH9%2BevH33jwA5QH5gTYDzSH4seKVDLMTal%2B%2BjCLQGkI6Ud21A8WTb7fCT34F%2BiP%2FDXhXgC411lPv3UIUO8nzH9I2A%2FiAeX%2FBUPhQRLDQ08NAAAAAElFTkSuQmCC',
	gctourLogoSmall : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAQCAYAAADwMZRfAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sDGQg7CZXhIq0AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAD30lEQVQ4yy3M2W8UBRwH8O9vjj2ms92rpUsPutClLdjVQi0WS%2BHBNCq2QCKJhoemLxhr9QlTEhIjPIgxKiRINKSiQEKEBINIsVpSSRpQMLZKCU3tfQBdeyzda3Z3ZnZ%2Bvvj5Az5kWZaLiOwAFAAeZl6z%2BNevNRM%2FnGoB4JEUl5ReeuRNRaY9joKSZFnT%2Fpny5rYRu7tgEsA%2FAMaImSsBuP5P8mb7L25%2BfPvqzuo3D8%2F5qupVQ0sUyoqLLNPgse9Pls%2FevFCua3E5tOedBxWtHX2ykn9HAlDFM39uIFESkjZveuH367X1Xed%2FkZ15%2Fid3e8omrp1%2Brul47z1BklPVb3TFK%2FZ0LE799HVo%2BMz729jQ9eoDR2YkTixtxc3PX%2BP2s7cfnuiorDvUfUNyKGlmThc3tDy5d%2FzAbiLKAkgBEGWnyxXa%2B%2B5TpaAUeYGgJYhSoUBDVxqxMh2MR6MVzoISu%2Bx0qUTkJCKZmaXSptdnouNDfmZWcnpG1RNR1UhEHe4NYcHQ4r6ckQ2Q9UnjAoVeNEesYi0QbpzyVdWPA0gDUAEEsvGVwgfdh4Nrt7dGVifv58dnR%2FypyJRLj6%2BIejrFzWeGr0mIRVQE65%2Fqg4MeW76%2FAIDAc0OO5G%2BXS1aXI66Et9LKrC45kyMDtuJsxFa2721NKgpZDn%2BxOH%2BqzS5c%2F2CrBLaAlVkHBMkm2hyF030XSsa%2F6ija5taENTvbk4H9h%2BKr44P68qUjHq8tKiDPyXD7BZxvz1s3elk2fEESEN49hzvfuFQzJqXmR92e0BZ74KX2jHpiftn27KuWfLS6SFFdtmTx85wmhVASlhAZdfAfl2RiE5RNigL2fnSLFa9W8fCcU%2FiuU%2FUaS1K483RW8pWKqN1ngS2SVa%2FIVk7U3OsIfZ8pfOsLG1kGMjnAbO6akEhx3%2Bf3eon%2BvvqCMnCu0jz5ikuq3GFy01smhm%2FI8Ach%2B0ul4vUbybaQIP75Y5GMDHIWMO8OZ8sb26eImRuYOQSgiixz8%2FjFYw3ywJeBYD4IWpwgiIBdZTZ1gpEBLBNEQEwHzLZv53y72vqJmQPMXARgIxHVAtgy1tNdZ%2FR%2BWrCJZ0XkTBAIAMMCYAl2XvDWZO2ymCtSZY2D9UPEzA4AbgBBAHVs6ttJT4ZTpuB3HK1aG9vUkhB0zQDYyNjcmccJy%2FLW7Fhab08amLwro%2FXYFQmAwcwZIkrC1OP48cMAj%2FSVKU0Hl1BYHvMdPNuvJVZXQMKKR81PBACdmU0iymJXZ4yZ%2F5WYmYnIYGYNorwI1TeGZ142UBKOoLMnAuCRU3VHAESZWQNgEpHFzCYAnYhS%2FwF8odAV4EB4aAAAAABJRU5ErkJggg%3D%3D',
	globe : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEQAACxEBf2RfkQAAAAd0SU1FB9oLCAk1NEFBgZsAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAC40lEQVQoz12ST2hbdQDHP7%2F3Xt5rmixpmj9Nm7VdQ8vGimsrqyieVNTJULwoFbrDxnAguwjDHbxKQRTvO4gVpSDiPMlEvOhgamctK%2B1WtqyzaZtmeVn%2B5yXvveT9dhDn5vf8%2BXwPX76C%2F2Xug8VzwLuqph2VYEjPa0rJsqIqXy8tzH%2FxOCseSRe%2FnNZV5ceJseTAs8dGGUtF6TUMyo0WmR2TlY0d7mQL14UQZ5cW5tceyW%2B%2F%2F%2FlsIOT%2F480XpsTURIJyo4WZy6IFE%2BCPgGWSGoiyvLHHlasbDxDixaWF%2BTUNIBoN%2FvzK85PiqXQ%2FpWKe2Mgk4dggVtslv7OF5jko3RYvzabpejL607Vbl4Dn1DMffvXRwVTs5bkTM3Rsi5qrEgxHUBUFKcG1qsTCPaQGk4SCfnp6fGTzlYMj069ltVC49%2BzxyREq5SJFJ0BiaAgpQQIIBeE57Jc8VjLrRPySqSOHODo%2BxHau9JZWt9z4aDLC8p0C6YkEnvxvxUalxDPTkwghkFKyt3%2BfdqvFYDwMcFxpOx3FMHSUYIJKo41Zd7DsLnXLwWmYCPFPlRCCgXiUtc27GD4NoF9TVcWrNttKoJ0jqBkUmjGKPp1O16Nd6jDtuti2w4FgAMuyOJSKU2g5ACXNpyj5e7vFoZnxJOnhQbZ39riaqeGg03ICfPrdDQzR5b03jlGv11m9eRcOjAL8qchu9%2FLq5i6OpwEwOpzi5Eyc%2FUKJB9UmVVuwXfYwTZNqtUpPJMXmVh7gW3X118tXxmdfvyBUVQ8HfPh1ld9W1lnPS%2BpNm1rTpmbZzA6rFGoOu2WPm5nc70sL8%2Bc1gEqheOqX6973ngdPHx7ghxtVyo6O0%2BliOx0MnyBbkfxdcLn2V6YshDj3xLdPnv74nZH08GIo3KcfSSdJxkIYhg%2Br7bJvVrh9L89urnhLqNrcE9%2F%2BN339Y%2Fqrpy4sqkbvCVStD4SQ0uvIjrslhfLZN5%2BcvvQ4%2FxDbSUHA5o8CrwAAAABJRU5ErkJggg%3D%3D',
	loader2 : 'data:image/gif;base64,R0lGODlh0AANAKUAAP///wAAAL6+vqamppycnLi4uLKyssjIyNjY2MTExNTU1Nzc3ODg4OTk5LCwsLy8vOjo6Ozs7MrKyvLy8vT09M7Ozvb29sbGxtDQ0O7u7tbW1sLCwqqqqvj4+KCgoJaWlv///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCgAfACwAAAAA0AANAAAG/sCPYEAoGo/IpHLJbDqf0Kh0Sq1anwOBsGBwGB5gQWHA8Zq92Y16PSyf0Y+EfL5xd++ONF1Oxt/1e3Z+gHSCZ4Rzhn9xe3Vvi40bfX4GiHyKlYyBj3BiYQVDAl8SFRgKCp6pAhugGq4IsAgbX2xqrbGxCbS1t7iyu2y9uLq1tg++sMTFwrnAtci/xazHyMq81L7WwdjDzqu9GKQIRAYJCgsMDRALBQek7xIXD+oQ9fXs7vDx8/b2DJr6+PVbBxCewH7/8gWkh7Dgu4P+HO5jGFHfQ4r3JMrDSFChQY4JLSaAmA5DEQHn+skxxfKUgAUTYsrMsPKUTVQwZ8aseROn/s6d4nq+/DmB582hP43aRKpTqcucTYMehTrTqc+kUpdSlWmVadUiBxZAkCnrlVlSFtKqtbDAnFlXaNembfsWbgW5c92+jSuXbl2+a/3uvYtX8FnCffUexstW8SvAag0/RhzYsV3GbcEyiEDBAs2erzbI7EC6w+e6qEaXPl1XdOnVG0C7cv3adGzUtF+zfpsbtuzUtW3/7k16t1niwnGrLn679XLPsTVztpA1NAPG1Wdfx5tdQ4Ktabt/x559PPfy2+WKB08dPXnc7Ne/b51+rTjpFCSfgkyagWUF/HXgn2wBDghagf8hSKAEwQmYIIPBGdiTggdCWJuEN1E4oYWvmBkoHQQoyYZcUS0dlUGDCY7YnFAnBpdii7qtaCKKJS4Fo28i3shcjS7pmBxoKvKIQZCnEDAALBDEI2J8Byw5n1BMOnmelOo1CWSUVz45lZZacfmUl1dVaVMWBTSAipAHYCbjfmkWtiaAbSaGZmdyVkhnZXO6mWedG94Z2Zvx+JnXnnjaqadLWgxxxaKMNuroo5BGGkUWHwQBACH5BAkKAAEALAAAAADQAA0AAAb+wIBgQCgaj8ikcslsOp/QqHRKrVqfA4Gw4Pg4HmDBZjzgOAyOc3pQGLvJHHTaQGcn7olxgmNG0+sPdxt5g3x+ag4DgYKEZYdydnhujoiAeJeGan+Rg3h8c4h2g3p7fWd0iQWXjXF+qIqSnmaaawZhBUMCHhwSFRgKwBobBgUPAmJjxRoIzM3DY8h5ts3UCQZuYtIP1M3Wb8jF3MzPyG7h4t4b0cPb4s9veefc3uXJ7fPX0KPy1O/6G/y65VO3rwACDL0QENlVYQGDBhAiLihwoJeEixcfQIzIccGDAxUwJsi4kSMEBoEsYryg0WRElCMtxmzpEuXFkBgl0DTpseL+zZklOcLMeZFlUIkfMeLUefRkSpESjLp0qlTCSKk1kxLF+hBBEQ8bFnCcQPbOr1/MMAhYQLZtWQnA4jJLwHZCBrd34gJjttau2wx59SJQ0PcuXriCEfT1SxYwYrmE6zKeMFKvgrmSDQNOYJmvZMaBIS82bDd0XA2L/1ZOnNouhCIOxLqdgGADAg3LliFIUMGCb99kd+fGPbf3798LEtzGrRuD8d8TLCQnTlzBxePIEwzXzRt7cO3Di3uXDj63+ONkp1NP+/y4euKDe3mf8F43guvoaZeH73x+kQsMRECBBY1xpoEC1RFGVgcMRgcYgswxoyCDDZaG4HJpbZABhR3+FHjaMsBoyKGHy+mmgIgUOrgBhLcNNmGKFmSw4oHM4YZihQ8G09wGC+I4I3wH8TiihSW6eGOHHTwYXog9EthBBEUcEOCAvl2ko4QCMIBdlYhFqNgCW1pgJYQg0tXWcWPWKIyW+a3G4m5gtvkYfGuFmSZ8ZpIFnJhzlskmdHyWCGFYZ/52J3Mb/ImmBNt5Nl8CUU7pGwPl7aXASL9xSGmNl+32XIMdUPohe5l2SJ5eNOJngab7XWbdpx34ltyHwFzEIYWbMheXrbeGylliqrKKanG9+mpZrRKUyqCogl0qwa2yQkqAlALG+GswEh6pYmdBTjBijD8eaKS3KVpomQbZEhzZYAIY6JohuT7+AtmJ8JoqI7cnblhujsEEI4C+8SaGgZApPrlis/QOKaO8liZccAQbYEDAAMxAQBYGB4x6KQOFcqlxlnY+tteXhV6c8ZVwzofxqF+ONya2cJbcwcqnDQZyfjSjWueWOY+8M6Av+xwndBP0HNfPiyqQRQEQTUApw8GkG2ZyUA82EpV7Un1uulgTSB+7x0pwQNfeMnAwzBd1PenZll6d325QI6s2eXFbN/bbYMt1UAVzPx323diZjSqCXOOtlhZDXKH44ow37vjjkEeRRQBBAAAh+QQJCgAfACwAAAAA0AANAAAG/sCPYEAoGo/IpHLJbDqf0Kh0Sq1anwOBsODwEA0PwWY8HnAcDgMaPSiQ32a0YZ5uJxLje4JznvsNAw8beGR7a2p+gXiEg3yIh3aMZRxqaYkPeneTiH+Bg5l7lGlygAWEmWeWnZiaZHyqlnafmmaPaBweDgIFQ0N8BRgKwhoKGhsGAmJvBQ8Izs4KCMfKi8fNz8/HG2LVzNjPCQZjymNg387ab3jm2NHh1IMb3u0I4YVk89/pb/LX3/bcyLD7J27bMn/YAMZbZ0BCBQREBjgoYGBBAwgYMS4ocECCx48SHlzMqPFBRwkJUHoUSRIjgwcVQHq8wLLlS4cqU4YcSfJl/kyZNHlmXPDAY4WUKYO2hPDypMyaPYvi/KjUptScEqqSJIpTZ1aoGZuC1CmSQQMERTgUKKAB44S3b+8Eg4YAg4AFcOFmuCMsGgJ3CzLkjZugb0K8g/cWFvb3793BcSUYBhc4cUrDjBPgFZz3MmPKEzjD9ezXmea3oifwZTzsburQpIs5Rpx3r+TPphFngFBkTgLIE6RpQDAcXAULyPPW08CcboLjyJNPWJCAeXHT0C1M0D49AfHhfp9Hl768ufHoeal/f6bAI3ruy4k7z668uvzz49+Wp9ue/lsL1JnXmHjSvRWggPX411sBEFDAHWqFNeeXAgK81cF2qG1QzHXC/lTYwYV6aWheNBhskMGHtYkIXjEUToBiiBs6Q0yLKGpnwV7RrFjXBhZieKOKI5r4YoYxNlaiiyASeR00QiYZmop/kcgjiiBmAOWEQmp3YVoSROBgchZ4NCJg43EnJoKalfnWmeARc9p7YUpg3ZwbMIDeaJKZx1yaBaqW55J83skme49Jh5xHMYa3wHvbnblhMW8KKuecuakZp3UyKpCAnQUW4QADXkoXIGvuHPfhiwdOqEFKFlD5IQMRFleMezW+uhgxxYl36oUWwMpcNJmZ2gGYsD7al0e7nurrjMdKkKytk2HX6qkG3ppQBclW29dnulLb62LA/uXQqdIVUWeo/kTKBo0CTWL4ZLTCtGujlRgQE+WOSML1YzDDSIlkjX7aa+SUIKLoWWN/yZuuqnadmKR2GrIILLsOpzhZMSVWzCu9rDFZ8X8chxuvxqgRMIAzEPxnAQYHJDrbdney7HI9i5a5csufQYqXoTcXSWafErQ8ogZ33YmczOp2uDN3R+MMXqU8I9qXvYGCGfTFmtZs45o4l0az0T1vC7WgWRRw0QQOLhBxvwlaysDaUa4qwZfuUsevus/R/R+sdwPrEN28vh2MrHJ/KWoC/MYdtN7I8b2tMIvn113fpTIO4AaJR+mR4dE5LnbektvNYq4V6G1gMkIQccXqrLfu+uuwxw5FBBYfBAEAIfkECQoAHwAsAAAAANAADQAABv7Aj2BAKBqPyKRyyWw6n9CodEqtWp8DgbDg8AwGnoJgQyYPOQ6DY70eFMrwAdpATzvcCXJin+Bw6IB0eHB5aHaAdw8beWV9c2xqAw+McYaBBnh8ZXJpl5l8eQNrap2YiouaopeRk5SLc3V1kqh7r49rHGAPYllyagUKwRoKGhobBmOEBQ8IzQgKzcd6i2TLztfHY3mM1tfRBhvJet3e0o3VzM7QCObb6NfrCeDUZQbp3vJw9ffX8tqN5PqBE0fGnrdv//I8SFMBARFRDwQUYAChosUFBQ5I2MjxwoMGFi8W2JhAQskEHkGGhLDgAceXKVeyfFDBpE0JMVe2fEkyZ/5IBi4rnNzo86JLnig/ygQqoSbHpCpD7rRZEqfSlUBrViV6VeoDjSQlVGPQAEERDgUSMIMwoW3bDCXXrcMgYIFbt3AlBGu2boPdu23jrnOW4O/dvHuhQfMLOLDewc/qNkasGJqGuhkaC4aHGTBlfHYz390sDIFkz4KJPbtsGO9mbKEhFBkoofEEdgg04KtgwQLgBQmK8W2GgXdv322BC+9nfALyCcp1y216HLmF6N6K9/4dXPfwBM2fA889XAP158kTkL+m/bhb5cOhgd/etjf8+Oe5L29mvvmE2eFEgN4EcKk2GAYbTNCBc66pNhyCCt5lQYHeVSZABgseloCBxP4Ek2CGDXo3zDAXLuibbxQ+I1eJDPaWwQbELDfMhxK+6KBcNB4G40EQgvjWhtKtiGGEb8EonToJ+rbgbAVoQIF7vpVUYTwMVOeWlN4RtoCVjgnXITtbbnfcRsWUWcwGVaJnAZkiFpNAmoBhCRqXa0qwn3xh1ucbm89oKSaDZMaoml9cTsCmjG9auaedIuJJ338EcPBABE8i1wEDG1bWTE0ddJrhdcHJpVtJnSroKabLdbhRqRacCqSDCIDnqYnQhariM5x28Gd0wewl66wLxjpMr8GsCuylmcKTa6npwfpMU7O+l+leuUHrKYPAJdZnrvSdpQCllqb4II3W2TgYNP49tkggjJoikG596/Y6jIobYMjqhOzGp0C9GZZaoGJ80TXkc+byNSy/brloZGIzDqkjBqK6S6OJHRS8TsMgophsZQIvCCIBAzTElnOtYnCAlyrWVajJKDdTWHXHmUztoHmSPAHLFeam8oA4G6zAznrefMCN0ABNcgcyH+lyzTEPLYxiO4tpgcxyEQP0c1R7Y/R2VFMba5j0WZBFASBNUOkC7H6JAE6K1gqxisM09SSD6UHsYH9z6wmc3QBLcMDctO5d4agSVPpcrG8/bXLe2+1N7GJ/u+ec471GE7meyL6togI4GX4c2nwr5rfh0mIwojMbXH6XAFoMccXrsMcu+wnstNceRRYfBAEAIfkECQoAHwAsAAAAANAADQAABv7Aj2BAKBqPyKRyyWw6n9CodEqtWp8DgbDg8Aw4YE9hQy5vvhyHej0Ym8lfg8Exnw8em4R+H5fL6W1lCXkJA2p+h4GCeYZrdQZ3b3pgfn+QD3pmhRyVf217g4yOlXeghJSIcopke2mHdQ6lmWVfa2AcBQVDQ5wPDwYPChrCGsUbwIsJBQ8ICArNzcd4oXnL0NcJyKGDwNfQ0ovS3tEGrKzKzM7Y2mbW6tDZ1ITu3tmS6OMI8cn063hv3cYdGzQITwEOB4gY8nUhwQMGECJKXFDggISLGCU8lDgRk4QEHy86bMAxIoMCGUNqJFnyJEiQHxNc2FhywYOMe2ZCbOkRJv7GByw5MriJEebIkhCG4tQzM2jHlzhpCvVYVCZQpEMtgswj4ZiGIrgaVhCwYILZsxP0vGuGgSzasyCbPYNX9m3aBPncvs2g9tlcBXrfqoWmoHDgs3zxFkZQDHBdwRKuzU3wGHHccYfhRi6sQW7mCXwlCHM2zLHd0OPaIoBQpJzICnYtINiQLwFsuwvwrtVXwYIFtBZy14b9G63wv2x7Fy8uPPVt4M3fKbg4objZ4LqfdeZtd0J0udMl+H57fK3ts+O9Z1c3/blx3c0aU5/Q2nbb7hk2LCYMGH+CxX4ZBpxZ+RXmV2kC4KcfZ8T0d5p+jI2GAAYbZPCbdQXuV4wGFf5eWFyB221HYQboEQjhXGxV+CCK4Km414IoFraBXR3wtR80I3ZAHwEGXDDWAuMV18FFzvw1HQPpaebNMBIgaZ1ZRAqj3ZEeXnjRhlhuwMCAExDJWJaVVWeBl9AUk4CT100wZGRyfanldctFWSaHZV143ZXDbKcPkE+mJUEx8TVDWZBneTnMl2ee1Roe4gnZQQcMKGbkRY9e92ikcul53qOVQprdoRMSx6lZuUmIYwWVWnecX4IqV52anhoYIKWjXvqfrIXRyqmtkjkjAao6ovfdXBgAS96tgfKWKqyYstpqeosWAIGQJiJnYIdpgrYBBm2maOGrJmJw44QuUgvSofDEVqijb5XGxaqMZlVa7V+lYXuWjraRli6JYj6aIWlFzrgiwNdmsG6w+YkbKLzZaqswruoqOoAEBigA57py7kdWktXJSdjGvoU85gGZFtkknHeyOeWR3WFAsr5MbinmWS6DZ3Jd7PpWM4sYJCpmcS5LqU7PfP5sQc1FIljnW2TiSBnKHYuGYszpWZAFShBMQEGQpYLqq6uqJiCu0O1tfSwGISZHAdS5PWzyARSse1bbADMJd59tM/j12knmDeB0d6cJKYzgSQB3v6SKXaSUhm8tsgWRjr1443iLrafaaAmgxRBXdO7556CHLvroUWTxQRAAIfkECQoAHwAsAAAAANAADQAABv7Aj2BAKBqPyKRyyWw6n9CodEqtWp8DgbDA8Qw4YEe3sCmbN1+Hes0ZkM2JOEdtcNTVnEd8X/4a/nZqbhsJhIUJfnd1BoOEjohzi3+MD3CHkYB3A5WWkJN3DptxZYeJn2J6h6UcmZONe3GJgXZuhWdDc2AcBQVDBX4PqQYPChrGxggbw4+EBcQI0NHKnIYJw9HY06SO19jQytukzt7fy4ZlwwrkyrZwzure1pyjG+PrBpbND+QI8szT/MCdidPNm7ZKBQxIIOLB2YMLex4wgECx4oIHByRo3ChBYkWLeiQk4HjB40cIDB5sHLnxQYOTKEOKZFly4smUGvdoLPny5P5Flhw79vyIUyRJk0RVzmSZwCXMn0E1Or2pdObOqUkzEpr5oMguiBjCClgwoazZCXHIYRh71uxIeNjYtkWbgJ/csxnSwlPA9+7ZtAj4FlPgt2zeBOqMqSNMdu5IaHCTNcb7GFvfyX8lFIOsgfFctBICd4ZXeELe0NEwVKjQlQA+jXw1nrUwwUIyfrLnLkBMTkKF2bV34/7d1oLwwNhUl6Vt9ni02BKATxC+F5pys7SN89aAzfdn53yhedddF25n2RaY1+63GLmC3G2PK4ZexECCCpsTfM4bPrBgAXNZwN9i8GCwwXKULTYaXwfOlcEGgh3T134QbgYZYbW19SA8yP4gYCCCE3TQAX8IcFcigyAaVmE03GFY3IbPCbZBBg5C+Jx1DZbVgYqRyZhBfRfg9x4DGYZY1lsXfoPZchqxmB+Rc2nU2YnGJLBAetmVJeUxx1iZogVbctkPlLVl1yQ0HW7QGG07goZch2OlB2JlJY4mAZHMmamZiXV6ORuYqJlYJVnq1SZlYiayVZ9SF0QXoogiMsCbf9AtB2kHkloYjW+QGmlBplOmVkGnzdWl1m+FTsdbZN6x2eZu4Qn2ngQiPhopYrJCdymkkkJGKXy13eqrf8AuJ19yqD5aW69wVTpBfQVIRWObPBKIY4qmrXihAjOmCqOT3GbA3I4CbhDWXvkMimtBreVi4N611Nb2oLuD+WhWm3mdi2a66dWaLV8tjjZjjZvFym2w2M1bomj8zjavrP4N/OwAEghwQJzrFinBAf5deCdwgFoWGwNYyjkBBgcUPBjGy6W3cWJ84VfaBC93tuCdJjOpGYGdYdyBnCGLqoCVWJ6FcnsYXFYm0C/Xy5efbW2cnJImMyf1vtDIZUEW0ZZBAdDBTfprdKnupq8C+CVwAAXkucunhxV8XajZ9Aqm0dezSRrWibGt3faUdkuA91l0Uzor22ymp3fdfX8dr9kAFxh3yWWZTel5fuedgLveqMb2BAJoMcQVpJdu+umop656FFl8EAQAIfkECQoAHwAsAAAAANAADQAABv7Aj2BAKBqPyKRyyWw6n9CodEqtWp8DgbBQIHg4YIfY4SlszujNgDN2sMmPc2I+fxvahsGDvqGD73dieXFzfQlqdg6BeoeNfWEGkYuEjXUcgGODcnQJbJFtDnpyhp2KkoKihYVrpp+DnI2sgZKiaRtDYBxcQ52XD3t0Bg8axBoIxBvCfcsJBQ8I0NEICcqwwtLR1HvLZwLP2AjJcZvi4OHChWje5tRphc7sBoaj8ODJ8+/f2MmOy/XY2siVs+cgTgEDEoiE+nWBjoQEDxhAmEhxwYMDEjJmTHAhIsWKezRu7CjxIwQGDx6KfOjRJMqHCURCbGDyJLCYKjvSNGlxZf5MkjVR4twoQWdNiw41zjyaUuacBzs/MigAU6RRlwUOxKRTZICBhhjCIsAgYMGEs2gnzMGmgKzZtBMyrGVbFu7ZmODc2lUrAZqCv2Pr2p3zV4GGv3rhyk1ATAECxILhEpZ2ODJauX39OlZgGS3ex4f/do4bM3S0xJIzY6hQQULXDRkBh6tw1sIE2xammZNA2+6CBLt74z77O3ha3L8dS1PA2/bx4pof866dFrryv9Nva5/w21g07L3hFpdtOLt44NBCa2iO1nnyx6CZh6/OODTiIgYSVDDcWMBeuW0VZhhnx50FoGyPEWhXBhsE+Fdo/i2YAH/2KajYhN8NuEEGC/42SEyGG57VQQcGNojBMfwpEKJiJh5zDDIcUhdXgwkKuGJaDG7m12EbiIhjiw9qgAF+F+zH3wYM+IgWbwmmpwGSBfKFojHlJWkXk4cV8yQDw9XGm5bFJMBle2d9WcyLCZhlAW5rYukdMWnaRqKXfX2IogRvOddmneptSR1uGUVj5wZv3bamBV86CWeh2wVqJzL4NdUWbyNWOiIDwAmImAQWWHobdNhQOgGJ7mEYagVz0mecb6ZKM92IqgoIzauWdoCpprOiWqutGGqaXaeV3hodAubddiljbNGqnQWgAiYfflRh0JYAMf5YGIjVXkZjk3/dqK1yhyUYIqklXmdjBumwOsfgieaqWK26Hmrq7qjWpvegiqOmOuNm6uHb4bUDzlsbrHgNKO675Tpb2IYEDCCBAAdU4Ba5dJr7mGDDIZqZrwscWhuiByRoH54fAypBaEauZ+Vxsdl3GMlkaiwyZAt0sOaygY5lJGcdw6WxY9IWJqbHJlf4V5o+gwzNiUtjnJajygXWcRZU6XfAARkThx7AxaL1G7spS3AABawyba/YZJ8XtLO8pb3d1/ZJV4HbXifAroBtl60pBmiPejN3dsubt9rhgob231oHbR/fbh+KqdkJPkSBAFoMccXlmGeu+eacdx5FFh8EAQAh+QQJCgAfACwAAAAA0AANAAAG/sCPYEAoGo/IpHLJbDqf0Kh0Sq1anwOBsFBwGDwDjmM8/hY26PQmPBaTB4+EfJ4QG8iGvCe+mfc5HHdlenxyfXWBXmQOcAl9h2uBeYuNh3Nhgl55jXR/i5SFfnaCeQaVdIilmqZxhoZ2q5sPagIJD2BcQwkGAl2tfgUPGhoIw8MbvI+OCcEIzs8Iu7V0D83QzruPaI7W19KQaN3Qu45p3A/X2MmuyOjp5NuP4s/whn3z6uX6+AjI02r86hQwIIEILwm85khYKOFBAwgQIy54cIBhgoUXHEaU+IChhIsSMj7cCIFBR48MNZKcCHIhSJUbTYK8SBNmRAYFLHq0CdGk/k6MPCGwRBkyKE6Lcj4aLdCSoUiSQn8lKCIAA0UMWBFgcLZhwYSvYCfIeabAmVWvYSdkGEvWmQC0admaRaDgbdqvFxXo1coVbti8GvRu7ef361oJZQW7LYxXwrPAi+8eppu4712xCRQE1qvXbtq1mZ9hCOw5LGgMFSpIKHLAFuKyzzZUsDCBtu1o6RAsvGthQYLcEmbXDusbeIWvtmsXb6v1OFjaE4rvhY0a+nPfsPfqFm49+m9n03ffxQ6e2PbLxTcH1iC+O3nNsIPzjsZZAQaqBDUPgy/gcoYN9RHTGXKmZZYdfBvwthZn6w0oGYABkqYghHoZo0GCkoUGnlkJ/nbQgWkArmceBhtkkKFmxQioAIbWWfBfffrVlZaHC5bHoYmfGRhjEQ48UEGF5iXAwIdhWbAQbPtpICSBYB0p4H5LpmUkYhZqlsAC3VkwpYXGbMAAk40Nk2JgV9pm5kLmWeglkcNt6QxkhEGnZW1oAnkMA8nZtlCKb174pZZzTjmmeZ51h2afGhQBx5GDoebho19hV59ZFUAK3XLXODoccgx8R5YC4oHlYafGzdgBqeloKuqpOpK10KOwdsoZeKBKAOujssJYqwW3skpZeRchF6undDkT3Ie2jfrbdM7wmBMG1JX4IGzF6iXtZxRSFti1z70IWbQmtvjipNaGW+CB9Zux+JWHYkE7q1bcTsBuAqNVSFm8hoUIZLlhzbsVfAiGy65amX2rlwTqyvshvZRRR8AAEghwQAXuSoBlkRZgcMCvsL2V51caw9iXnLx2EPJmHWMZKJ2I/YgiYRhnfACDiVnMpJYnKwbqxXkuhNqsOxf5lc+TxtmmlkcW3dVzgGo8mFZWXlzkkaJZmUVOCVAM6gHJcZotdc4x3enPMSZwAAXjMVwMZwijnZZv7jYswdmb1sbABnGzLYHb655KYXh7Y3x3fdAqufectVkQjbv1zc03WHDb2NzjWo6NMqVoAxqp2uEJoMUQV4Qu+uikl2766VFk8UEQACH5BAkKAB8ALAAAAADQAA0AAAb+wI9gQCgaj8ikcslsOp/QqHRKrVqfA4GwUHAYCp6BYzw2ODyFjXo95DjcZMfgkajbExy418Cfb+x/eHp8fQ+Bh3lecXKGCYGOeXyLfnd1A4OSc3d/G4mLBpSACWJme2ahd5FmhKB0joCJrIVsdQUDX0MJBgISDw6VagUPGggaxsYbBpyvG8IIz9AIupV0ztHP02uv1te6h2oJ3NHe2sEP19jKdcvi0OTM4efo3uucAvLdypyc7en14P0Q+DIggcguBQoMXKgjoaEERw0gSJy4oMCBhgkcXngQcaLEBQ8uPsS4gaNHiQweOFyZwOTJlCwfbuzoESTGkQlmnoRQ8Sb+Rp0nQV7M+NOlR5grGwI9qvIhQwlLJyJNGvWjqwRFBChIeQEDBgRfEQpYMKGs2QyOnimAhmGs2bMZoa3FRvZt2bTPwgqs+xbtBoRg1bq1OyGjBoRfnz3gC3cDAsTPNAy2i/cwtMlwJQCeqwCzWUeHEQL2PAGtBLaWEzAui/ZChQoSihxY0BbwuAoTLOTObUEaOmm431qwsCDB7wS4db8tfjz5bt3M1boLvrts8c3T7Q6PbluBBOfLjT9eq0DDd8LExZfPTrh46MOHzys3y7z8XATnhU+4jriIBA0bYHDMehgkQFhpCYhGjGgbVAfXZuUd1qB+aCEE31oFZkBYhQr+EpMhhQlaaAxCE9pVoXTFKNBgByb+FaFcJfaVYDELPtbgfLpl4KKIYCWgYVkdsKijgjAeOGSECvhHB4/PCMCAdhY8FBl80pA1313/PTZildpN8NAxVKomnG5fgnmYW1dGmeWAklmp23BeimfmZG+qGdl9YvK2W0YiGoOAk8/t+R8xNFY5HJzDNQSmO1ZSdhqNGhQhTEMKJOZdBUEGWVZ6ouGJKYvzRdcNeLuJOh5wb2nKgHjRKFCBgWapyqpcr6bK4qq2PQZcpplOgCtnCDXEq6ydAobcsEH+qhYxyOXG636sevpcpsrOVcQcEmAwl4Q/9vWXdAx2e1aA5Nmnorj+OYaoq1o3mqVcAtpuxu2VCJYbWmcZKKfpBDsCu0G3mh65nn3/brjjlufGymJh2r7XY777lkbueBj6qO/C5OZKwAAJCHBABfEqkOemw2FwAHbFoOmgyZ0ySrKmJt/LKKK7mVyBhYLxdegELNunK6DKHRozZOWp/CbPH4v285Obbtpzdxs0eqgFT98HKG9wmszWeiM3rXVe62VRwEMgB2sgjpySp1Z+JEMb75YPUdAevCkaW4HcdhWnLcXeHUABjm6XazbeE2iqt9LB3u2ubqvG23Dff7d9eKfm+T13WIQCRzick98ngd87W0c3dg9oMcQVqKeu+uqst+56FFl8EAQAIfkEAQoAHwAsAAAAANAADQAABv7Aj2BAKBqPyKRyyWw6n9CodEqtWp8DgbBQcBge4AHHQTaQHZ7CZs3eiM9wzyNBr7vHhrx+ME9s6H8ceHp5fH6AfoJwZ3x/iAmKZ3t9j4p6XgaGh2sJb5KFlI6Qg2ZkmnWJpJOidYKEe2oCdGAbBUMJBgISFRi4dn8CthrDwwgIGwZ/yn+2xs7GyHWUzc/GuJyOtQLV1gZ+2NrcCNfLCcHb3L7KhwUP4tHr5u3i6vHz3PDl99XknPLuzzBIsEUkl4IFDBAUOCChoUMJDxpAmEhxwYMDCRxKk0hxokUJGUE2vBCx40QGFx86LGnyo8gEAiFy7Igyo02BJGdSrKlxpf5Oj3M04mTZ0SLDnjJNQqhJ52FOpShVNvSjs0EDDbmKCFDAYKIfBBgQKFCAc8GEs2gnZFTwjKwAs2knZMgo1hkGBW/jnqUblq3YvHr5GiOLF27ctWGdFdY7VwJZYxr+Gk6bUYPfwYAPS6hbd3Fgx2P9ek7bGKxlzJPPNpZQ5MACCBOO0aswwUJt27E3cFPQEK0F3ONm642dQLht3BMWFL8sdlftuMo5D+599vdZ5WMHW6OtFztbBZHHca9+PQH4ts71jgPPvvn4tMpPK07/vDzZIhIYRICwgXD4sQIMN9dj2QEooHljFWMgear1155YCmyQAWMOFgOhhAzK1R8Gw/6IFiBjCEJ2oYD9hTdYhBPGlcGGdRGDYX0aklWMixN20AFaK56nWIR6dTCgZfjp15CFmDHgG25DWvafAEbq1RB48o3TJIyVKelMAnBZN0EHSXY4zAZT1tcllBokwMBxyHVJjAZgPqflkMyNs4B1aKqJwDBmuolWQ5BFhuecaP6WpDN4holWlRrgtwBej3GWQAU2ktcBAyE+kxGMNlIqnKSTFgfhdNxFWl5bZFEXaaaenljqWaISp9h0Eth4aqeqjtWQrDeiGtplj+Iqq6Zi/bcLrqxqepmtEtTmq7HGtIZXBX5FNtaLpDn46bQkhnYathnmyBy3MHob7IgUJlggiuVb3thgdp2h22qO0v5HLatqSdDhiRuwqm6MCeK7pYoOsjttjfuK2+wAKD3AS2h3AfbbwwJxpkHDZiF31pPfvvVbqxjbtdhxezr2n2S3ISfQtqhV9+YBBErLpJ4Xg8YZXkbihqTMnb388M3sFrlzyGDpSLNvaGFwQNCRZbHQo3cRRt1tqM7cXLK3pctAiVFmREF3MIUG69bQde01bweAjZxyTbOrdbpoof3dd7tsrWWnGNxlWallV11e2tI2BDZ8MJnYXN50WkDpXTsKRAFyvx3+HQIPaDHEFZRXbvnlmGeueRRZfBAEADs=',
	loader3 : 'data:image/gif;base64,R0lGODlhEAALAPQAAP///wAAANra2tDQ0Orq6gYGBgAAAC4uLoKCgmBgYLq6uiIiIkpKSoqKimRkZL6+viYmJgQEBE5OTubm5tjY2PT09Dg4ONzc3PLy8ra2tqCgoMrKyu7u7gAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCwAAACwAAAAAEAALAAAFLSAgjmRpnqSgCuLKAq5AEIM4zDVw03ve27ifDgfkEYe04kDIDC5zrtYKRa2WQgAh+QQJCwAAACwAAAAAEAALAAAFJGBhGAVgnqhpHIeRvsDawqns0qeN5+y967tYLyicBYE7EYkYAgAh+QQJCwAAACwAAAAAEAALAAAFNiAgjothLOOIJAkiGgxjpGKiKMkbz7SN6zIawJcDwIK9W/HISxGBzdHTuBNOmcJVCyoUlk7CEAAh+QQJCwAAACwAAAAAEAALAAAFNSAgjqQIRRFUAo3jNGIkSdHqPI8Tz3V55zuaDacDyIQ+YrBH+hWPzJFzOQQaeavWi7oqnVIhACH5BAkLAAAALAAAAAAQAAsAAAUyICCOZGme1rJY5kRRk7hI0mJSVUXJtF3iOl7tltsBZsNfUegjAY3I5sgFY55KqdX1GgIAIfkECQsAAAAsAAAAABAACwAABTcgII5kaZ4kcV2EqLJipmnZhWGXaOOitm2aXQ4g7P2Ct2ER4AMul00kj5g0Al8tADY2y6C+4FIIACH5BAkLAAAALAAAAAAQAAsAAAUvICCOZGme5ERRk6iy7qpyHCVStA3gNa/7txxwlwv2isSacYUc+l4tADQGQ1mvpBAAIfkECQsAAAAsAAAAABAACwAABS8gII5kaZ7kRFGTqLLuqnIcJVK0DeA1r/u3HHCXC/aKxJpxhRz6Xi0ANAZDWa+kEAA7AAAAAAAAAAAA',
	locateMe : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAQCAYAAAAmlE46AAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9kKGwgzGjNX4ooAAAJcSURBVCjPhZE%2FaBNxFMe%2Fd7mUpnfpL71LQkg9IVr%2FZCikf9SC7WAJSRRrrUPpoMEiSRdxcwnoJOggRboIWhIc2qLE4iTYDqU4WB38Q6HqItKKtZfalMsld81d8nOqBGrqg7d9P%2B%2FzHo%2FBf6o6N3oF5tYY7LwflvUMHH%2BHjWQ0Zl%2Fo5cVJprx6DfJ5oNELUAY09%2BknTPOYbR9TO7P95jGkEMA2ALQKMCwYu%2BCEtm5ydXXU7MfOOlDeBsABpgFwRcDGA%2FrGhfpgefMkKmVAWwMcVcBWAmwaUMoBDJuvD1a046AA8l8AQwXsImDqgFEA5Ni9%2BqBVbAUFUK0AhTWgugY0eEB9fXfZSGZ%2BF2xvaWmZNgwjwPN8ibMxm9TSvQwFsNvC4Qp1d8fZc0%2BnAYAjhBwslUrvOzo6fg8MDFyfmZlx9ncf8rHW6xQoAMYO6u5SQIJRNpL5%2BHejzs7ORx6Pp5JOp0Wfz%2FdWkqSdG5fDOZpxUvrERxfHzxaDbQce7DklEok8F0VRBwBCiDUyMjJenRu9amVPa2OXThR6e3tHA4GA6na7T9VybDAYnFVVtdHv9%2Ff19PSsLiwsnPmxWfzONh9tXf5l%2F6AoSiIUCr0SBOHhHmssFlsnhGwkk8muaDSaFwRhixDymeO4yuDg4Gw4HL7t9Xq1WoYDgOHh4T5N05anpqbmnU5ncmJionllZWWI5%2FlFVVVvZbPZdy6Xq6goyt63pdPptng8%2Fk2SJMPhcOREUXwhiuJiU1NTgRBCE4nEzdo8848BQ0tLS6l8Pn9E13Uiy%2FJXWZbvp1KpydrcHyPz5blPQjIYAAAAAElFTkSuQmCC',
	map : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEQAACxEBf2RfkQAAAAd0SU1FB9sBEQ0rMteXYLwAAAKiSURBVDjLlZPLaxRBEIe%2F3Z11N%2FvMxpFoXgfRQDBCRGIEEQQfIOJBEERRFG8eQvCg%2FgMiHjzpQcQHBvTiTRAVMSpqVAxEgxoMxmiMT5KY7EzPTM9Mz4yHmCwqItalmh%2FFr7%2FqroqtWrsqam5dipZI8L8xOPAarbl1KedOnftnsaOcP7TOg51oszfHgsuIW88o9diMH2kim88xNPSIQXGWrxMG2Vyeb5MGCS2JYUn2bYlIaSnis25GeZJyq4YhBPaNQYT4gmkKYm4%2Fjm1gCRPPETiOQElrjkKbPRSK84kin0yXDsf6SW3Xqa2rI%2BO%2FxVHN5Et50sk4WnIewpYkEhKgQlCe%2Fo6wppnSFUZJ4VwZhiAksh%2FguwJpOfiujSOm8Vz7T4Jidf3PXINxQFI6PYlat4iU7tLkTpDMN5LWYiRTSUzLA4wZgkRsxkNKF0vYGOVJzGzAVDPI7pGZIu86115s5fbIFqQQhF7lDeZaqKqqRq%2FWKRQbyOcWkNzTRtWoRtqrpV7%2FhKs8GvQWrg5vpq3%2BPMl4%2FNcWzLKFISQ6U%2FR9%2BsrNV31EGxTe42G8QFFXWkLLog5MaXG4p5uTO3b%2B9gvVCzGUy2Nh895No0KPja17CaKQIAwIifg8PcbyxjUIz2HPxQ7a2F0xeDL2jr6PQxRyGSxbIJVHEIWMTrzBDxUq9PEDH8M1aWtci%2FBt7skLMwaOchgPfLKpLKV0AS%2BjkEqiAkVtsQkVBARRyJfyB2pyC%2Bkf66V3uJf1xv4KQZ4CTsomEWXJxFwc5dL96ARe6CGVz2K9hdWLN9E3%2BpCe1%2Ffp6XrO8aMn0YJIAdBQs5KGmsqidCzZ9svi7DrTTixexdORAe4cGpjTY%2B1r2qNlK1qYnYe%2Fxd3iJfwwYJO5d057%2BewFPwAsnUE8ZPBqbQAAAABJRU5ErkJggg%3D%3D',
	mapToAutoTour : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAeCAYAAADTsBuJAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAExgAABMYBQzIXCgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAA1rSURBVGiB7Zp5lFT1lcc%2F9%2Fdevdp6q%2B4GekGWRhYbg6IYCBqJo4i44IwBVBSPxkCjTkbHMzOZjMlxOjNzJqPRURmNoMQcF1yYk8kxGeMSd0QQjIqgLAo0SyM00NB7d9X73fnjVRfVbTXKYpyj%2BZ7zTr3ffn%2F3vt%2FdfiWqypHi6X86bl9jU8fSLa17Zt76kHYc8URfY5ijGdxv4MjY%2Bd%2B77cLhA6rX3jFLRh0ror5OOCwB1NaKqZ0pXndZ%2FC4Tsu0y5ZKaqlMmXrxswdzS6489iV9tuJ%2FV4e7ZMjLkFV0YjRVOP3XQeVWtQ9c3AcMBsF2qfhdd%2BzZSfcKoRFnl0DsXXVd%2BQefeTy69%2Filt%2BaKJ%2FyrgUwKYf6UMFDc2JRJLXJaXKB81burfxo8bdUZRUf8hEooW8tL9l2aMhvWtqigiQqq1gbho%2BOwLZk5989Vn1tw127vkpke6%2Fvin3c5BiIgBilV1z5dFw%2BeBZBvhB68re6B44Il%2FWVI1IVE2uNqJxIpAFQVc1yVW2J8Vj3y%2Fs6Gxc4%2FjiFaVRctGTrzcTe7fjJ%2FsINXVTirVgarDmjVrGj%2FeuHbCzU%2Fohi9lYyJFwC9U9fIvY%2F3Pi8wJmH%2B%2BhBPVw6cOGnN%2B6bpN9exqWkc4EscLR%2FHCEaKxGOUSo6ioODzsWxdXFhXE2f7WIlRcjBvG%2Bl2IcRAMNtXGiOHHJ3btqr8W%2BGHvRUXkBGATMAn4WFU%2FFpGzgKSqLu3V9xtAGbAUGK6qq0VkDLAdmAisVtWtvcbkAWcA%2FUXkNFVdma4fDFSq6rJjx8KjQ8YIayJ89pARYws%2B2bUT1wHPFbyQIew5hMMeYc%2FDcR38rmY6m7bS1bSV0iGnUffWYppbWnGipYgxwSMORjsJh9xpfax7C7AI6A%2FMF5HFwDTgVBF5HEBEEiLyG%2BAi4BvA48D89PglwKMEgrleRB7sNb8HDALiQKUE%2BCUwFzhJRP5HRI4%2FevYdPTInIJof%2F35Z5ZD8uvUHiMXi5Id9wmGLFxG8iCEaDeGFHEyqDduykyQRHGMoHTSGtsY66rYsp2jgaYQdxZouRITyivIBd8%2BSATcu1l051r5bVVeKyHvAXao6C0BEqkWkHJgOLFLV36brVwL%2FlR5bCUxU1b3ptr8TkUmq%2BiqAqu5LC%2FXbqvobEZkMvKuq96T7LyUQxj98ATw9LAQnQERcxxnbkVRcx%2BC4EdQrxomX4eVXgAitu99nxxv34RPGiRQRySsmmh88JYPGUDrsTPbu%2BJCdDY2kJA8xDhUDygtD4dh3%2B1h7U%2Fp3M1CfVb8NqABOB17Pql8JdKXfP%2BxmfhqvAd85xD7PBN7IKq8BRh%2Bi%2F58MLsB%2FzuK0EwZWFTTs78JxPaxN0tawgdYt29HWHdhkB0mTTzi%2FH4mikWiqHU2C2qwwwk%2FiFg1j375GdjRsIy8%2FweAExguHZwP3HQFtjwPXAneky5cTqBaAk0VktKquTZevAO49xFyPEXzxb6fL5wJ%2FOAKajjlcgLx40ayqquHFO%2FfvpsDvwvg%2BGAP5CSjsjxgH14sQj%2BWRlxcnFovhxeMYMYAP1iccbaMg1IIbLSHW2kxrcxPEBlBc3H9Iba2YW29Ve5i0%2FQ74qYg8SaDL64BuVbYS%2BHcRaQcUWKrat7elqutEZEtaLSWBZuAnh0nPFwIXwBgpi4ZdqgY4gAfiYETAcRHHQ4yHOB4YD3EMOBab7MCKA4C1KQQlHjHEXZfieBRbLBgxFCaKonyAB2RyRap6ZdZ7CzA7q%2FyvWfTdIiIOEFbVtqz6JlWdJiL5qtqca2Oqup%2Fg1HSX7wHuEZGoqrYfBc%2BOKTJG2KpF1KLWR9WSsj5kYgTFVxBVFEXTsQGqCIqqDR7ro9bH%2BinUphCvgGR76%2BF%2B%2BT2gqj7Q1qt6W7qtJ%2FOvkjhRdgATWKDr%2BpivB%2FOfPkPyO6M8krOvsHDm8%2FrMkdL%2BeZARgIigvo%2Bqj1qLtTbr3Wftig3U7WolFHbxW9vgQDMdrsfoCUM4riwOHBRe929IPFTtkadb%2B4CqzsnZkI%2BQohDF%2Bbxz%2BRE84OJcbaJfvJ3ICEAxWHtQAKoWTXahRli%2FegtN4TwmTxnI2ne2UT1pKDaV4q3ldex4%2FQPejCaYPnUwaLcAAuGBpJ%2F%2Fv4h4tLSkuAYAZT6QB9yO8IERln%2FR62cJQNJfbloAfor6FavJHzmUT1otp5%2BaQNVSt76e46v74znKN8dXsm9wHiue3c6Blk4KYhKcnO7TAxxSAHNlGvDXCGOBZpTluPwYnwsRjuN%2B%2FXvmyBgMC2nkdJ5Sv8f4GpkFTKKR60nwBhm3msXUSDtwdUYVzZOLsdyAcAqBEV6JUjv1GV0L%2FApgyWS5HchTeH7m83rw6xeRJecwB7gMOBHYJMLzkQg%2Fu%2FDpwDY9NVnmCFyB8vSMP%2Bid3UOfOkceEGE48OMPzmBZ9VJeAg4QRPY%2FOOhHiknr8ECFtK3byJY9nbzzdh0nVfdDsGAt5YOK%2Bai%2Bma6OLprq99JU38ikwQ6NLcngBGWEmOaV9KGB5sntCIsRXsFwAcLVGHbj8zpwAcrI9CeSD4xndE5JlqOMZgkW5S407e4qj6DchZP2mmrkbpSHEV7AMgX4HrAPYRVz5a9yExigtlbMknP4HbAAOAvoB4xX5Sft7ax%2B%2FBwZEMicKmCSGkZkjxdhHDBJldLqtQhB%2BuUi4Dag4mA2VAyqPtZarO%2BTrN%2BJFvajqaGFeNhAZyep%2FU1UloRY8%2FYmGsMOO1uVPV1ChZuk44%2B7qDy7LEsNBb%2FkunGbK%2Bcg3IhhPL%2FQd7JaXqNG3iLw2397KMb0QJBRfIIbJI8UDwG%2FZ2E6Rpgn5wHzgHEs0PezRr3MXPkQYSE18joLcmdNT1jKzcD5QKMI%2F6YuD5NkMvDPwHBXWEgfNuQQEIRlKvwoK5IymS%2FYaoqOpFLqKamUz56tu2l8aSX23Q9ZtqmdlBi%2BU5KkPRLhxskJbhiWZEhnM%2B2dyYwnpNZH%2FRQ5bbBwDfBoL%2BYHWKCLgRWHuaG%2BocwGHu3F%2FACVzCeIC87ta7gIVwfTcM%2F05%2FWOGc9ow4wXdLEoN6e7XPTY%2BVJw2GQJP5v5nL6WEYCIk2Ec1rI5WsrY1m2MCHfSLg4PNyZ4s6SKiV4TgwcX8H4jlISV4k92U%2BT47G6z7G1KBS5q%2BrF%2BirTD2hsnEwRTfeG9w93QIXASmomAe%2BJWtWjfaYmF4ySEcgKAwpPZbVrM74EmQNwk1SrpjWomWu9GONfcFt6F7CtJ4wbLAEaEseOrWNTYj6JUG6dt%2F4Cbxkf5i6ooWCXev5CdLcp1xY2U%2Bh2sbIDH6sNU9ovhuF7mMY5BVHNde%2B5CqcjJlABlmbdUOk%2B0m9Ic%2FUbkqOsJpR6hX5%2FtQgLIqX7mrtIksAPA9M41HeBkoAAg5FCHsjmYjhO7u9TWigGG5prb6wqYbQCsqjFOCMRBxAFjcF2H704bjf32t%2Fj5xgj1a3cw6uM1nFHYwaRd6%2FnBsE4KHEtzEpZsNfxo%2BkBCoTBOyMNxw7ihCMZxEEGWvEphr%2FWXIszkGol8irJrpYLszT6gm4HtJBmbYx9n5trcp9aCS6iVT1%2B%2F1sgwYAyHcDcF%2Fjf9euOSKXIqwJLJMgjlX9L1717yrO4UzST7xvz6PCmvrRVT%2FQZXAZ%2FeYxYMgG9xcUI4xoAxGONijItjHCpKYlxx9QRe0AEs2234uAnW77P8ehPUvufwq7owkyocNm9pwRLCdSO4XiAA13goxhxoIT99RRjA5TYghMejXC%2BJTP0cGYjLfwM9o2fhVYSbuErimbp5ciXdd9OHQog7gUJ2sIhrJT9Tf50MAZ5AeZr79c2%2Bhiv8I7AVGIll1ZLJshbYhDIV6LBOYCNmvMiHwF4g7Ptsrl7KRpSHPou8bgE4BoIckNN9ChyM6yImRKJ5PzUnehRWlHDLxiLu2l%2FJc94QuqqGMejMk9gxZBRVoyqIxmI44SiuF8ONxHE8DwySTBGFrOj0Xm3B51yUEnzqqJFXqJHXMWwAXkX5ZQ8qU9wC9CfKNmrkOWrkfZQfovz8MwVwr7bgMAXDUFy2MU9epEaWYVkHbCBJ7qg6jRkv6AFCjJMgO9sJVKebXrZwyqXPamCvVFUs0whUVpjALX0ZeOVQ8wfHUhFVP7jNUkUNGEl7d6Is225ZtbqN8hEDueLiGNWDCzGGwMUUGDX4YM6ILKNrXA%2FXGKzi0jsie1A%2FAs5ijoxBOAVDCljB%2FbqRGhmGIZrVt46%2FkQm0800MJyJsQHkTpRg3yzg20E4JZ2EDfZzBfboekUnUMAbL2CCBxaqMq3qQ2TltxYxntAGYtXCchBJFDO9wqJv9nLb27jf9RV0GDHzybBlmLK0zXtZPckzXgw%2BiqtwxO3%2F%2B9MuuvcExQaNaRcUiNtAEyVSKxqYOSgvDqAUxmvbvFVUfUVD8QB6ablMFo6x6a%2FmBa%2B7eMrGli42qmsy1wa8zXICnlrf8R370kQuKi4ti1oqAIt1yEjBWsaJs0qCc%2BdBFMYCKilXIqPn0IejoTJrVHzUubOmiBeiZRvgzgPQJEJEwUEJw43RU6eNeiBPcAzSm8%2FN%2FRi9k%2FhckIlEgBKSO4fwxgnvcZj2afwF%2FhfF%2F%2BkeeoREnKEoAAAAASUVORK5CYII%3D',
	newTour : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABmJLR0QA%2FADpAE8017ENAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH1QISDiYc07YZKQAAAWpJREFUOMutkE9LW1EQxX9z741WJH0lgtDKWxbc1O5cZqkb8w2ycVm%2FRd6y3XcjBMSC38BNN90qhVJKslJKSVqEEP9FYpved8eFJsYYk1R6NjMMc%2BacM1Iul7drtVqREZid%2FcvcXJtn0W%2Fyy5%2Ff5aJvH%2BHPvmTDGaVSScfh%2FHhTL0%2FfaOe8oJcnK52LxuKutrLr2jIzrqvSbDYJIQAgIj31jNlj2n4h474iZgnrTCbY9mrHt1tTzld7BwbJ3WrkCGvqiHmFuAJgMSpG01%2BL4F66%2FqyD5OtebzoLTIE4EAuCABduNFkIOk%2FQ59hQRdNpQNC0ot6besamFffQ57uHAq%2Fx4SfgsVoBFO9f6OlZ69PM%2FPeDkRFEBOUpHV1DdYE0%2FQE8YWvn0GxsbL8FcKPItzWL1zwiQhRFNBpJT9QwIfp%2F0497EYY5eIh8x8GwpcHZsB0zqd2xEXK5HI%2BBi%2BP4Q5IkxX8hxXH8nv%2BFK8w9mWB7rBTJAAAAAElFTkSuQmCC',
	openTour : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABmJLR0QA%2FwD%2FAP%2BgvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH1QsVETINEBVQCwAAAaZJREFUOMulkb9PU1EUxz8vfajv0QYLDE1MNxlgc0ITIwODfwAIRgYkDBIQHNwMBAYXBxY2E34OBNQwA9FBRwYTEgxshGhMhCZtbeC95%2B279zi0aa15TTF%2BcpN7T8493%2FO951oPBvtmU6nUHH%2BhlCrtv9TYyvLaa%2BpgTT6bkJHh0chkEPgsrSxSKBQevXuztREpMP50TAb6Bzk8OgTAboqRSMRpRC6ffTn%2BZGrG1lrjOC7XW5IlxZjh4cBQQ4HNt%2BvTwIytlML3PfI%2FcwAkW1sA8LyLusWu21w522EY1jgAU0kelZ%2F1J52dXTWxDUQ6iLocxaUdxOMJ0ul0tIDve7z%2Fcs5BxgVg%2FsN6nX6fa6LeiSWxARzH5SDjsvD8PoHSXIZrV2JMze9WZwDwIxdwfHbRsFhrQ7rdrQ7RcUqBACKCZVmICCJgRNBGCLVQ1AYVGkIttCWu1v7CzaRP9lzxPeuDWBiE8kIEBEGkLAwERVMVOM2ccevOXfZP8uWiUncRMAiCBSIVV90drexu75AMvq1a9x6%2F%2Bug13ejhH2kuft37tPriNv%2FLbzdmyosZb3GLAAAAAElFTkSuQmCC',
	pin : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89%2BbN%2FrXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz%2FSMBAPh%2BPDwrIsAHvgABeNMLCADATZvAMByH%2Fw%2FqQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf%2BbTAICd%2BJl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA%2Fg88wAAKCRFRHgg%2FP9eM4Ors7ONo62Dl8t6r8G%2FyJiYuP%2B5c%2BrcEAAAOF0ftH%2BLC%2BzGoA7BoBt%2FqIl7gRoXgugdfeLZrIPQLUAoOnaV%2FNw%2BH48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl%2FAV%2F1s%2BX48%2FPf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H%2FLcL%2F%2Fwd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s%2BwM%2B3zUAsGo%2BAXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93%2F%2B8%2F%2FUegJQCAZkmScQAAXkQkLlTKsz%2FHCAAARKCBKrBBG%2FTBGCzABhzBBdzBC%2FxgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD%2FphCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8%2BQ8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8%2BxdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR%2BcQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI%2BksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG%2BQh8lsKnWJAcaT4U%2BIoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr%2Bh0uhHdlR5Ol9BX0svpR%2BiX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK%2BYTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI%2BpXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q%2FpH5Z%2FYkGWcNMw09DpFGgsV%2FjvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY%2FR27iz2qqaE5QzNKM1ezUvOUZj8H45hx%2BJx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4%2FOBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up%2B6Ynr5egJ5Mb6feeb3n%2Bhx9L%2F1U%2FW36p%2FVHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm%2Beb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw%2B6TvZN9un2N%2FT0HDYfZDqsdWh1%2Bc7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc%2BLpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26%2FuNu5p7ofcn8w0nymeWTNz0MPIQ%2BBR5dE%2FC5%2BVMGvfrH5PQ0%2BBZ7XnIy9jL5FXrdewt6V3qvdh7xc%2B9j5yn%2BM%2B4zw33jLeWV%2FMN8C3yLfLT8Nvnl%2BF30N%2FI%2F9k%2F3r%2F0QCngCUBZwOJgUGBWwL7%2BHp8Ib%2BOPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo%2Bqi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt%2F87fOH4p3iC%2BN7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi%2FRNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z%2Bpn5mZ2y6xlhbL%2BxW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a%2FzYnKOZarnivN7cyzytuQN5zvn%2F%2FtEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1%2B1dT1gvWd%2B1YfqGnRs%2BFYmKrhTbF5cVf9go3HjlG4dvyr%2BZ3JS0qavEuWTPZtJm6ebeLZ5bDpaql%2BaXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO%2FPLi8ZafJzs07P1SkVPRU%2BlQ27tLdtWHX%2BG7R7ht7vPY07NXbW7z3%2FT7JvttVAVVN1WbVZftJ%2B7P3P66Jqun4lvttXa1ObXHtxwPSA%2F0HIw6217nU1R3SPVRSj9Yr60cOxx%2B%2B%2Fp3vdy0NNg1VjZzG4iNwRHnk6fcJ3%2FceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w%2B0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb%2B%2B6EHTh0kX%2Fi%2Bc7vDvOXPK4dPKy2%2BUTV7hXmq86X23qdOo8%2FpPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb%2F1tWeOT3dvfN6b%2FfF9%2FXfFt1%2Bcif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v%2B3Njv3H9qwHeg89HcR%2FcGhYPP%2FpH1jw9DBY%2BZj8uGDYbrnjg%2BOTniP3L96fynQ89kzyaeF%2F6i%2FsuuFxYvfvjV69fO0ZjRoZfyl5O%2FbXyl%2FerA6xmv28bCxh6%2ByXgzMV70VvvtwXfcdx3vo98PT%2BR8IH8o%2F2j5sfVT0Kf7kxmTk%2F8EA5jz%2FGMzLdsAAAAGYktHRAD%2FAP8A%2F6C9p5MAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfbBQcMJyOQosv2AAAD4UlEQVRYw8WXzU9cVRiHn3PuvXOH%2BWLK8FmhkDZltEAqdeHCnbGbmqgJqfEvcOMsTFyw6ca4mhgTE9HEhf9BiV8JqyZGo4AYDCpCIY0x6IAQmDIznZl758651wUXuWmwDJQpJ3lzc3PevOc5v%2Fc9X3DGTRzHeXAsG9E0%2BZ6uaa8p1015HniAEGLHVeq253nvrk6OV5oCMDiW7WwJh%2B4%2B%2B8xA4vLFPq2ORqFSp1Cpky9W%2BGd9QxV2NsuqXr%2B8Ojm%2B1WhcvVFHTZPLAz1t525ef45CVVGoOBiGg6bXkbqBGYlp24ab2NjY%2FBp4vtG4smFSTeb%2B%2BHubuYUVUlHJhY4Il7pjpJ%2BKMdIboVVts76xiRBi%2FjgpaFgBIdixanW%2B%2Bn6JL7%2F7HV3XEAKkAM%2F1qNoOSrkgZakpAHhsADiuIHVpiO4L%2FVzrj%2FFCH6hiiTezn6NJiXLd6nEAGk6Bo9wNKQ9qNhRuIRqL0tYaPQgmhQ0UmgKglLula7J%2BRJoU0BwFgLw%2Fw0esaeE2E6AoEMYRCoQA1RQAwzDeDptGKB4xD%2B1vT0aJtZghAR8OjmWTp7oKht744JNUZ%2BdQSNdIhBQXB2K0dxn0JjQcq8J2sUo8YrK5XcSQJBXiG2D0VLbiwbHs1Ugs9u2LN260SilZWfyNrfUcxUIJ8AjpGoYmcewauq9nte4VFXy0cnv81mMrEDaNt4bTA1Ep96Knh0cYuTZKe3sc6SpWfl3k55mf8ALJjIS0RM0TrwC3HrsGLNt5Z35hyes2ykTNPfdarU7%2Bfhl0jfTVYa6Mjvzn33EuxoXzKQdYbOiMOcphZ%2FlOre3plz69e2%2FtZVW%2BH073Js3z7XHCGkR0SUfCZHCgi85kC8loiJ2SXfhrq7hg1eo3d5bvOKd6H7jy%2BvvZSEvo1dIDKx2PHqyGUtnGNI2SFOLHilX7eHVy%2FIumXEj228TExG5rqqe15jjYtoVrP1jLZDL9J4klOVmbT0R0OpIRYnt1MXPSK9lJAeYcx8E0TTzPOxOAedu2MU0Tx3HOBGChWq1iGAaWZVWBhScKkMlk7lmWlbdtG2Auk8nUnrQCAPPlchlg7qSr6aitWPgblQyY2DfLshZLpdL13d3dX4A4e0%2BEh831j2fXt4YB9gcPAWH%2FawSBcrncn%2FF4nKmpqTWgJzCQB9R9s32rBaCOBWACUd%2FCPoQOyJmZmc2%2Bvr7c9PS0DnQFABTgABaw%2F0pSvnmN1oAX%2BD4sqQt4s7Oz6%2Fl8%2FofArIP9buCfwwZupAaUL5%2FwZxRMgQDk0tLSZ8B6YLBg3oMpUP8HIY4oQnlIERIoxsMU4xA13EepcKbtX%2BRcieZqbkRNAAAAAElFTkSuQmCC',
	pinned : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89%2BbN%2FrXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz%2FSMBAPh%2BPDwrIsAHvgABeNMLCADATZvAMByH%2Fw%2FqQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf%2BbTAICd%2BJl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA%2Fg88wAAKCRFRHgg%2FP9eM4Ors7ONo62Dl8t6r8G%2FyJiYuP%2B5c%2BrcEAAAOF0ftH%2BLC%2BzGoA7BoBt%2FqIl7gRoXgugdfeLZrIPQLUAoOnaV%2FNw%2BH48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl%2FAV%2F1s%2BX48%2FPf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H%2FLcL%2F%2Fwd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s%2BwM%2B3zUAsGo%2BAXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93%2F%2B8%2F%2FUegJQCAZkmScQAAXkQkLlTKsz%2FHCAAARKCBKrBBG%2FTBGCzABhzBBdzBC%2FxgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD%2FphCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8%2BQ8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8%2BxdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR%2BcQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI%2BksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG%2BQh8lsKnWJAcaT4U%2BIoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr%2Bh0uhHdlR5Ol9BX0svpR%2BiX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK%2BYTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI%2BpXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q%2FpH5Z%2FYkGWcNMw09DpFGgsV%2FjvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY%2FR27iz2qqaE5QzNKM1ezUvOUZj8H45hx%2BJx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4%2FOBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up%2B6Ynr5egJ5Mb6feeb3n%2Bhx9L%2F1U%2FW36p%2FVHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm%2Beb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw%2B6TvZN9un2N%2FT0HDYfZDqsdWh1%2Bc7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc%2BLpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26%2FuNu5p7ofcn8w0nymeWTNz0MPIQ%2BBR5dE%2FC5%2BVMGvfrH5PQ0%2BBZ7XnIy9jL5FXrdewt6V3qvdh7xc%2B9j5yn%2BM%2B4zw33jLeWV%2FMN8C3yLfLT8Nvnl%2BF30N%2FI%2F9k%2F3r%2F0QCngCUBZwOJgUGBWwL7%2BHp8Ib%2BOPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo%2Bqi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt%2F87fOH4p3iC%2BN7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi%2FRNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z%2Bpn5mZ2y6xlhbL%2BxW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a%2FzYnKOZarnivN7cyzytuQN5zvn%2F%2FtEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1%2B1dT1gvWd%2B1YfqGnRs%2BFYmKrhTbF5cVf9go3HjlG4dvyr%2BZ3JS0qavEuWTPZtJm6ebeLZ5bDpaql%2BaXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO%2FPLi8ZafJzs07P1SkVPRU%2BlQ27tLdtWHX%2BG7R7ht7vPY07NXbW7z3%2FT7JvttVAVVN1WbVZftJ%2B7P3P66Jqun4lvttXa1ObXHtxwPSA%2F0HIw6217nU1R3SPVRSj9Yr60cOxx%2B%2B%2Fp3vdy0NNg1VjZzG4iNwRHnk6fcJ3%2FceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w%2B0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb%2B%2B6EHTh0kX%2Fi%2Bc7vDvOXPK4dPKy2%2BUTV7hXmq86X23qdOo8%2FpPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb%2F1tWeOT3dvfN6b%2FfF9%2FXfFt1%2Bcif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v%2B3Njv3H9qwHeg89HcR%2FcGhYPP%2FpH1jw9DBY%2BZj8uGDYbrnjg%2BOTniP3L96fynQ89kzyaeF%2F6i%2FsuuFxYvfvjV69fO0ZjRoZfyl5O%2FbXyl%2FerA6xmv28bCxh6%2ByXgzMV70VvvtwXfcdx3vo98PT%2BR8IH8o%2F2j5sfVT0Kf7kxmTk%2F8EA5jz%2FGMzLdsAAAAGYktHRAD%2FAP8A%2F6C9p5MAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfbBQcMJy13GubxAAADKElEQVRYw%2B2Wz4tbVRTHP%2Ffe915%2BvWTSJJNW7XTCDM0o08G2LlwIKoILuyozCP4F7irShbPppnSVhSAI%2FQNcSjv%2BWrhQFEWoWBTRtppBFH9M0kwzMyQxP9%2B797no04m2dDLYgGAOHC7cczn3e7%2Ffc857MLGJTWxiE%2Fu%2Fm9jP4eJKKa6UvGApdVobkw0CCAAhxJbR%2BlIQBOfXL692xgKguFLKx6LO98cfKaSOzs0oH0Wj49Po%2BGw3O9ysVHVjq9bWvn90%2FfLq5qh5rVEPKiW%2FKzyQOfD8s4%2FR6GoaHQ%2Fb9lCWj7RsInFX1W2TqlZr7wGPj5pXjoxUyY0ff6vzxddlsgnJkek484dcFh5yWTocZ0rXqVRrCCG%2B3I8EIzMgBFu9gc%2B7n93gnU%2BvY1kKIUAKCExAt%2B%2BhtQEpW2MBQEAVwDOC7Pwih47McnLW5YkZ0M0WL5beQkmJNqa7HwAjS%2BBpU5Vyt2adaIyEmyAzldhNJkUfaIwFgNZm01LS30MmDYyHAWA7fOE9elqYcQJoCoS9BwMOoMcCwLbtl6MR20nGI3eN59IJ3FjEEfBacaWUvq9dsPjCqxez%2BfyiYylSjmau4JI7aHM4pfB6HerNLsl4hFq9iS1Ja8THwIn7MoqLK6VH4677yTOnTk1JKSlf%2B5bNygbNRgsIcCyFrSRef4AV8tn1g6aG18uXVs%2F9GwYEoCK2OnNsoZCQ8nb2hWNLLJ08QS6XRBpN%2BZtrfHXlKsGQmHFHpfomOA1cCGvChH7niL%2FX5YAz6LavtmT2pSePF1RgR%2FF0gNYGzzfE3Qi5%2FDRGa2qVmwBMH3DJZpJ%2Bfafx%2Ba0bH73%2F1xi77SMDkCE7sd7Or86gtf32L83I0357J%2FLwTMZ%2BMJckqiBuSaZTEYqFg%2BTTMdIJh3qj%2B%2FvP1VvlHz68eFb3WiZk4E8WglFrQAAOEANcIAFE55975exUZvqpds%2FMJhO73dBq93Fs1Qn83vXtjfU3K1fe%2BADoA%2B0h9%2B4mg9hDAhuIhmDscE%2BGcbm8vDy3trb2U%2FgyM7RqwA9B9IFBuBfspwtEeNmwi6GY%2BNun6s7V%2FMOD%2F%2BQ%2F4R%2FRviSbeGCJRgAAAABJRU5ErkJggg%3D%3D',
	plus : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFQSURBVDiNpZM7SwNBFIXPTB47TYioMAErLSz9BYJFIJ2FheA%2FEO2CTTB1go2ktrMSxFIQjFgIgkU6SxtthAyIGC0yz10LzSaz7AYlt7pzOXzcc7hDoijCLJVPG9aa5b5zIZ%2Bc5XJUdFuDyp8AzoW8tXvszZonBzxNmwoAAGMVnt%2FuAQDLi%2BtZsikAp2CdjfupgNphue%2FCsWcWBNIYxZx1PwCjwIJAVhulOPEcpaLbHlTyAODCkNd36pNgltxgb2ufAQB%2BEZ3zDvcsGKPw%2Bv6YuuaL6Hnvpfk13wIAaCNhrc30OlnayBSAlVgorXhC8fEEAOBzqz7AJgCUEnF6dRaHWCwU5PbG5jhELXFxdym1MWykoZSIGHDT%2FvQurNooRcqOQ1RWQRvDbo%2B%2BSNJO5h1oPcRoA62HWbJsgDJDsGI57v8FoISI694DT87StGTW7%2FwNezmaY41c7QEAAAAASUVORK5CYII%3D',	
	printer : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEQAACxEBf2RfkQAAAAd0SU1FB9oIGQopDsx58QcAAAHySURBVDjLpZNNaxNRFIafuWYRQRCLoCnTQIsfFAwxGFGQLBVRXPqJQfFHCEqd2iIupK6q7lwIfiVZ6EKrVkRGjQUDlRJQIVqoRd0Ixk7aTGbm3uuqTYbUVPDC4XIOnOe897xc%2BM9jtCb5Qm4IsP6hb%2FjI4aODbdV8IacbjUbHcF1X5ws5vdgTWQ5fKpX%2BOjqdTofyZQGJRKL5RsMI3VrrzgClFOVyGQAhRBsolUqtrMA0TYQQGIbRFisq0Fpj2%2FbSRCEEmUyGkddZ6t4co8cn2m28YA0MAVY0GmXL5q0opULyAZ7PX6W7q5cP3yZJ%2Fsriui7A8KICa9C6iJQS3%2FcBOP9wP1oFeCrAkwHd6zbRH9uF487zsj7K7TNTXL9xzYq0LqlSqRCLxbBtm0B57N12CqkVUkkUmu%2FVWRI9e6h5dQ7ejHOAs80dOI6DW69TrVZJJpM8sj2kVsz8rOCrgED5%2BNJnruGwvSdDzV%2Fg7vSlJkAIwZzjMD7%2BjFqthtvrEsiADWvjBFIiteLH7690rdnI5GyR4uci2VUDYReklOxI7wTg45cct96O4CkPN%2FDpW9%2FP7r59lGbe8OLTK3KHJhh78rgJ8DwP0zSX7LscHwu5cOJBGkOs5t30FE9PvkcpFbLxHnCs0%2Fe7o67gK8npyLnW8v0%2F5Gb7fMJoZowAAAAASUVORK5CYII%3D',
	refresh : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTAw9HKhAAAAyElEQVQ4T72TbQ+CIBSF67e3rFbO1GhiDNGROntxzfrSn7uJm2VCshaL7Xw5ynPPvcAYAEZGlgCZkBFI05WJNFrQLr8CSkrg5b3+9zUC4fUDKBOFaQU+O0lCyfnpaUGYX8ClB6liVNwav5UW5JBcgohNwu9qEBTUvds4lUDC62sQZOM9rAKuTKQ73bdhI3aEOYp/B4mqlkfNgJbbGKZrooR5JPtYRHmPZhsKEyeUtEDRd6B2sD7NwHIJsKLStvuft6Y78u53Y4keAkWNbhTM7xIAAAAASUVORK5CYII=',
	save : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEQAACxEBf2RfkQAAAAd0SU1FB9sDHAwxAVECGvsAAAJVSURBVDjLpZBNS1RRGICfO15HZ1BsphDHclHYLoXA0NBqkdQu6EMNEvoiSDI37SpJaBERbSRCyMrIXT%2FAjLKwUMfEFMMPJL8tU9FRcu54557zthgdKTKIHg6czXue8%2FAap0pP3AoEAjX8hm3bsTuyejm0732dx0wi2Uwm2XRjutzUln8wAMxAIFBz%2FuxF%2FkQkYvH4aX1dxLYpy6vCTDBJMFy0fH4en3EppVheXqIj2E5HsJ2u7k6GhvsZGu5nfHKU4uLD2NrG0Yrx%2BWGUaGzt8LCu9jaAqZTC4%2FGyJc0HgJGgOV165peSB%2FcqcZQiqh2UVtjKwefz3wSqTdu2sawwoaVFAHz%2BNADC4RVy7vhJ8yayJyMXJRpHR9EImb5s3i4%2F4GrjQXE5jhMvWK9YJ6oVOZn5FOw6wrelCaIqykxoitysIjL9O7HsZVxAvGC9Yp3BG0t0jvTSNdGGPyUDl8uNLyWdztEW%2Bqe7qb%2FQY%2Fy1YGCgn8ZjTbwZbOXTZBvpqTto%2F%2FKa3qkgx%2F3VsZ2VlJ2UKxWVPHs1TN%2Bcl82YTy%2BnMLuQwa8fMcaeAJDmXsUE8Hi89M15qb12lIitNlHMcOlFBo9KZgBIdidQdb85JrCscGxkMcLI7MqmFRV5g3SPhlBKk7UtVhsvABBARDAMAxFBBLQISguOEqJKYzsaRwlbU5M2BJYVJttnsfDDZnrBAjHQCGsHERAEkTUxEInqDcH3uVn27i%2BiZyy09ij2uwhoBMEAkXhV%2Fm4%2FzU0v8YUnGowD5%2B6%2BsxK3H%2BIf8UYngq0N1wv4X34Ck8Uv%2BymvOfsAAAAASUVORK5CYII%3D',
	send2cgeo : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AwZFBk3CuNDjQAAArlJREFUOMudk0tMlGcUhp/v//+ZYaDMKNQRSAcL6iBiS9MYbWy5aFK7VRfujFHX7kzbtCqZBSZtohsTFybddNW4oDZNSEvTNiDTi5naoIkC441BBBxu0xlm/tv3fW6kQejGvrtzkvPkPW/yimQyqfkf6unpEQAWQM3BG1USPnKlOGBLcdRRxDwFrgL5Am8KMR22xCcbauQ1+/oH9grIAogEzbijdJ+vFAFDoDVgCAQaBQgBpkG9s+x/nStUjlavcmIAjIz9tBiRMTYEKzCFImBC0NBUWIIKS4AtmcnmmRnXfHvp5qbVr1gAn+6fSM8WxvWsPSBMcZ+ck8cUBl7ZY2mhhFeM0ll3DB2MLO856pzJ56ZeduCPXY5bpZDY2XCM9kg3icomQssl1HyA3dHjnNp7kY5dhyhnhqo6o6n96xxoZ5Hsn1dpqb3I5uouxiczbA2eZHt7N1q4ZLMT/Pr9BULPfqF66z7WAUKVEcKlQQa+6eXIiR46dpwnNzfL0+kMvw/2Mz/Sh3+okbwbIxAKrwcQ3kLi7U7m/vibH/q+ouaNBGO3h1l4cotEg0nru438qH3q69r4eCpNG4k1AGcOig/YvUWRetDP8J0hinsW0A0+w8rHlT4N0W201u+lYC9zo3xlTQblKVRxAsol9jVV0toW42pphg93HUdqhVQShebp0iRvxd+n6JZZ7B30//rctSwAq7Ydo+pNAkaE0MY4jbWbsL87jdSKibkMnvLxlYcnPf5xCrwT76Dolcylc6mCBTD0KHZtPJN/dud2av7uvdFCy44WU3fZX/jSZ3O0EV9KpFZM57PUvFbHrckUqfup4uNeqkUymdQrxVitw1eatO26uMrF9j2aX2/lveaDpLO/8fPoUCl7wan6N4P/bGTu5fH6zJcII8zNhyP2yvErqflsMB3/zEyv3T8H2P86Vd9nqzEAAAAASUVORK5CYII=',
	sendGPS : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEQAACxEBf2RfkQAAAAd0SU1FB9oIGQooOW3fZUkAAAFtSURBVDjLrZPLK0RhGMZ%2Fx62UEimSo0wihSxphhXKwsLGdsrextKt2fAnsJGVlX%2FAwqXIIRPCSpHLjEjJdcJ857vYOBhzjhRPfX3f4n1%2Bve%2FT%2B1l8ynx5W%2FxSOfxRQQDzHx38CmJ9L3aTXQDk24tBtf4Az%2Bind5gvIM%2BnMEM%2FgbMAALHxGJG2MACdPZ%2FmwbkO8yIemRnYs34M0TN%2FV1oKqsoa6J%2BuN4EZ5NuLxMZjANzWLWG0RGiJUJLKklqa7Qjx0xX2L7ZYGrq2fEeItIVZ33SQWtDVGEUZjdIKjeHyPkmTHSYlXribWDU7I8LKAnhzD8y2oIzm%2FOYIV0ukdnGVy2P6iRa7nZT7zP2YY%2FKCEo8uJJFKUl5cjVQKZTRXDwlKiyrYTTo4xw5nE1hZGXh331QNr0IgtOBVuoTKGmgNdbOd2GD5cI3EZDozA8%2Fsab63NmM3nicPsHIKiZ%2Fsf5j9dj%2FoEBotMPZwbtb%2FeAM%2Bw7BUpUnjdQAAAABJRU5ErkJggg%3D%3D',
	settings : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABmJLR0QA%2FwD%2FAP%2BgvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH1QkaDBM5i2PCSAAAAfBJREFUOMulkktoE2EUhb%2BZ%2BEyKTRQKgkqwzMaFtt1FrC40FGJm60JwIVSkqLUtElICFQNDQqBrQXRlQIriwomN0GJXgtI2iUkXFYJVadOXhiBERDozbmaGMR3rwrP7ueece%2B%2B5P%2FwnBOcjnVGigArI8Vgi9xdNNJ1RbI7YUlT7r%2FYDqKaZq%2Fj6tQHNbLQd6YxiNBp1I51RDPdaw6pFAcR0RolaZKur19vmZhwFePDwPvFYQgZyACKgDt4cMp4%2BmzAA9fatETbX15A6Jer1r%2Fdas4ndGRUsMYBgFW8MDBqatiXoum7oukZhfk4ovC8CyDsFK7R0sBHpu0i5UmG59gUgGY8l7v7zjE68yr80SpUS3Sd7KJYLmBNMArqrQTCSOgzUrPeVkE7XCYmjR47RbDZ5N%2FcWtzU8TvH4cJi%2BUCcdAS%2FZmU2Ot39LLn1eOtd9qoeAP8BKbfnyhfD5%2Bemp11XAABCDkVQXUHs0JjNbXmS2vEjHQR8A5t5yLv8CSZI4e7rX%2BmR2HiJQHB8OM%2FWmxJamI%2B7zs1Fv2iOaI8vZJ4850O7nTKgXYMxpAMDuXR72%2BA7x88cvsvkFgHCrSS6vUv1Y%2FSNsEWBl4zv7fQHa9np4PvMBIPxpcnTaSTRNkmvrqwtA0r5CMJK6BEw4uNvEO%2BE3N%2BLV9uq8VLwAAAAASUVORK5CYII%3D',
	startAutoTour : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAAAcCAYAAAAZSVOEAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAKTgAACk4BGCrFqwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAiJSURBVGiB7Zl%2FjFxVFcc%2F571582t3ZnZ39vcWWnZpKW3X8qMtCogCIhUBoURChEIUAYEGY43aAEIwEPwRqbEICpGQ4h8qqIhGBBpsEEpLoKTQ1ha32x%2B7bEt32w77a3Zm3rvHP2aWvp3OtrNlIUH4JjeZe%2B455577nfvOvec9UVU%2BQWn86ZbELeHaaXd1dfVc%2Bq2He1ePp2d9iDF95GAFrGnzF95cdc4l1z%2B98tutP0NESupNxmQislREtvhacDL8HkUc04riuGIi9vddITMeWTLl1se%2Bc9wDABgv446kSAQz4fMWfXPpE7fPe2XF5VJXbBeYpPjrgRN8%2FZL%2F2IeAYFEc1YdT%2FsViaYpG6y%2BOV9ctSh479%2Fjzr7u%2Frv6Y2bGOl1buAW7yVEc818U2WUx%2Fp%2FXpz5w%2Bb0tNzYYHb6q%2F9sYH9j496meySPzIYeV3p6%2BeftrVsxqPOylZ3dBqWXYARfHUAvXif7jz9E3hxNQ4eACIWLjpPlqb4k3x6GmP3%2F%2BN5GVLHtn3DHxMSVxxlcyae9bX2rvSNTUDO3uJ9I4QilQSikSpq4dgwI6e%2FNnLZlXYwwz1dhBubMN4exDLBpRE2KuoqU4sAZ6BMnKiiIREZLaIJCZzIZJHm4i0vE8%2FSRFpmohNNFF3fTzZUoPnUulkiIVcYmFDLCyEg4JmD5Deuxl3aA%2B2pfRsepbBkSy2E0EsG8uyqK%2Btnjt60IxLooicICLPAkPARuCAiGwVkQt8Op8TkR3AjUXmW0Vkh4i0lvB7rYi8BPQDHUC3iOwVkb%2BKSLOILCjYjrZwwe48n2yriLSIyOtAH3CNiLwCPF803d0F%2FR%2F4heFQ6MyhdBbHAStUTSBaSyTRTLS6GZM%2BgJsZIBRNUFFZQ6J2Ki0nno2bHmB3Txc5qUQsm7ramsYVVzqnwTiPs4i0A%2BuAiF8MzAD%2BLiLLVPWnhfGpJVyMyhyfz0bgYeDCEvp1wMXAKcBPinyOHlJRn9wDVgPH%2B%2FSmAMU7ssbXAFh%2BubScePKC5v0DORwngpdNMdDdQf%2BWbnKDe7CClcRqmollBjBZ7z1H4cokqRGHjs7tWOEqjquOOPGa5A3A2vFy4krGEuiHAPeIyFPjjB9qIBIAngXaj6A6BfhlGS5txhJYNqJV8UVtx5%2FQ2N3XB54LBqxQBURasZpmEolUUBmLU1kZw4lGUQH1XILpYZLBdwnF6uhP7cOLVlCb3DEPSuzEQo46ySd6GrgZuBT4eUEWAM4FngS%2BDnwVuMBncx3gArsL%2Fe8xlsBh4E7guYLOp4BbgIuY2PXoDWBFwU8n0Arc6xtfCfwLeHNUYEugLuRY0tYQAkKIJfnUJgaxDNgZxDoAI0MMZwKICKoG4%2BWIkCUUyVAdCCCSIxQOx0fJKEZxHntZVbeLyHLgJd8i31bVt4FHRWQmY0l8TFUzkE%2F8wB2%2BsUFggar%2BxydbBawSkR8DY%2FLXYbAVmK%2Bq2UJ%2Fp4jMYCyJa1X10WJDNQbURY3B5DzU5JvxXN56Yye9qRFyQ2kCToD2eS2EQwKeh6ceeC7G87DDcbKZdA5Kk7gVUA6SdZuIRIE%2Fquq6MhfoxylA2Nf%2FURGBftwBLAKml%2BH3IR%2BBE4NYGPcgeWo8jHqsX%2FtfrOo4ba0hqmuaeWXdTlY%2F8SpespqF5xyD6kFdC0F1nNNZVfcCv%2FWJQsAyYL2IvCgiF8k4NeQ4KM6DfxlPsUDK38r0u30CMYydB0GNixoXY1x61m%2Bmq2M38eYkc1rjrP13J1nXZf6CZs5d1E5%2FKs07B9IYz8V4Luq5AIyyMN4V5yZgCdBbJD8DeAp4XkScQ6xKw1%2BGueRz1%2BGwuUy%2F6TL1SkAwxsMYj5HuHrq6U3TuPMC0xjDqucyeXc%2BWbfvo27aHTWu20RrOsmv3oI94D%2F%2FLr5IkqmpOVX8FtAH3AKkilc8DPywz4m7f7wBQewT993X5LgtioYVd1bvrHax4BdmRLJn9KYbWbmDX2yn2buwi1b2P3ZEEzS0x6Op9j%2Fj3iCTP5GErFlUdUNXbCwtbWjS8sMyQNxT1zzqC%2Fnll%2Bj1qqFgFMjyGIjGah%2FdjeS6rXtjJk1szJDVLLBFm34DLuVOFL9l9BIfSZLO5%2FCNtXNTL5g8oSpAoIneJyD8L7XERCarqsKouB172qTaXGfPrgP%2FN730iUlVKUUQuAc4s0%2B9RQ2wbUYOitM1q4i27ii84fSycarH48hM5NuSSaIhR40BbTxe7BmDlDodgMIgVcLDtICIWaowFpU%2Fnd4Dzff0OEbmX%2FInpPyReLSdgVe0SkYeAGwqiY4ANIrIUeAHYR%2F7ifBVw60TIOFqIhFCxsAC1lDPPnsH6znp612xk0eAbtDmG2ZlhYg2GzgF4rVdYfMEUHCeEUYMaDzsQALFsEYmWIvHP5C%2Bwo7t0GfB9Dt21v59A3MuArwCNhf6xwBOF3zl85eEHjUxOg5btYFkBjBosFYwqc9uSDNbO5%2FFVm5gjKbb1K9vSDsNOhFMTWbZ3j3DyrHosFNRgOxHUpAJA1SEkquqews67zSc%2BhEBVLZtEVU2JyIXA74CZRcN%2BAvcDDxbNPalwjQZAEUuwsVEVLMDyPDIb32LO9CQvdlVx6hebaQ3aNFWHAKU95%2BIE5eBh4oRQy7KBcMnaWVVvF5GN5Ms8f%2B4bLdeWTzR4VX1NRE4B7gauBBr8awPWANeQ36UfIIluP8bDqWhA8UBBUIwa3p05n%2Bb6Sq4%2BwyH%2FAc8UsrkSVs3nUQGMQSwb9VwDIEf62leopecCPcDmo64SDvXbWPC7H3hTVUcmw%2B%2BRcE67NFz%2F5RlrGmrrKgyIZRRPEEERLZSElqJGUdX8hVo1T7aQ34kKOdfV59Z1%2Fmb5PwZ%2FfUQS%2Fx9ReImbf0199IiSz%2Be9H1cSLfJ53rwPN0HAqGr2Y0niZOOTj%2FeTgE9InAT8D1d5WQk3kn0aAAAAAElFTkSuQmCC',
	tabBg : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEcAAABWCAYAAACdOoshAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oKAwcSHqDAeZMAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAArElEQVR42u3XMQ5AUBRFwU9ESEgIlmn%2F5bMBt9Ap5ixhutNVVTXpa11V3RjeG1prF4aMc2LIOAeGjLNjyDgbhoyzYsg4C4aMM2PIOBOGjDNiyPtgPEM9Ajhw4MCBAwcOHDiCAwcOHDhw4MCBA0dw4MCBAwcOHDhwBAcOHDhw4MCBAweO4MCBAwcOHDhw4AgOHDhw4MCBAwcOHMGBAwcOHDhw4MARHDhw4MD5TQ9jZAyriwnP2QAAAABJRU5ErkJggg%3D%3D',
	topArrow : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAOCAMAAADKSsaaAAAAAXNSR0IArs4c6QAAAKtQTFRFOwAWEnMAFXUAIncAHXoDHnoHIHsAInwGI30AKH4TK4AAM4UGMYYLO4oQQ44VRI4XSZAbUZYhVpcnWpooYZ0wXZ45Yp4wW587ZJ4wXqBCZ6A0ZqA4YaJFaqI2baI4ZaRHZ6RFbaQ%2BbqQ8c6pOe65UgLJZf7JggbRmhLVlhLVpiLdqjbluj7tzlcB%2FlsGBl8GCncSHoMWJoMeJpMiMqMqPp8uPqcuQrM2Tr86Vse9UEgAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsRAAALEQF%2FZF%2BRAAAAB3RJTUUH2ggZChAKxZC4pAAAAF9JREFUCNdjYAACDgYoYBPnhjBY5fUV%2BEEMThk9dSNlIQYGFkldJg5mM1UJBnYeRqA6LmlFXOo01XQg6kQNNExVwOp4DbXMRMAm8xlrm0uBWQIm5hZyYJagsJisEgMDAC4YCUlXya0PAAAAAElFTkSuQmCC',
	upArrow : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAOCAMAAADKSsaaAAAAAXNSR0IArs4c6QAAAKhQTFRFEnMAFXUAIncAHXoDHnoHIHsAInwGI30AKH4TK4AAM4UGMYYLO4oQQ44VRI4XSZAbUZYhVpcnWpooYZ0wXZ45Yp4wW587ZJ4wXqBCZ6A0ZqA4YaJFaqI2baI4ZaRHZ6RFbaQ%2BbqQ8c6pOe65UgLJZf7JggbRmhLVlhLVpiLdqjbluj7tzlcB%2FlsGBl8GCncSHoMWJoMeJpMiMqMqPp8uPqcuQrM2Tr86VayLUTgAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsRAAALEQF%2FZF%2BRAAAAB3RJTUUH2ggZCiUstaz%2F7wAAAFNJREFUCNdjYCABsMMYrGJcEAaLnJ48H4jBIa2rZqgkyMDALKGjoaptqiLOwMYtoq9uoiylAJTmMdA0FQbr4DXSMpMEs%2FiNzcxlwSwBIVEZRQYGABF%2FBmSnRdN1AAAAAElFTkSuQmCC',
	upload : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEQAACxEBf2RfkQAAAAd0SU1FB9oIGQoqEWpcrzEAAAMVSURBVDjLlZPfa1t1AMU%2F33tvE5pmSZvfSZfWXlNnF7sfsrjqnqq4OUUQRFHZkJWhD4ooDIXpg4gWhPkH%2BCBWHJtPUwYyGSpspdN1raOyYqWlW5N2bZqmTdsk9%2Fbm3vv1ycn65ufxcM55OHAE23jl%2FaE3gTdUTdstwStdtyYlo4qqnD03eOzr7X5xL%2FjBN%2Fs8qvJTd1ci3renk672MD6vl7WqwUyhxPhkgen88g0hxMlzg8f%2BvK%2Fg5fe%2ByrUEmq%2B%2F0L9X7O2OsVY1KN3No%2Flj0NwG9RLt8TCjkwtcGp4sI8ST%2F5ZoAOGw%2F%2BfDh7KiVw%2BxurJEpCNLMJKkbjZYKsyiuRaKY%2FBUTsdxZfjytb%2B%2BBB4HUAY%2B%2FPbTRKwt0J%2FL0KS42JofFEGTpuFp0vB5NeLhHSRjUaKtLeSyO%2BlMhfpeO332BIASCPpOHsh2UFlbobjlI5Z6ACnBlYBQEK7F4mqNH67c4vLwOEGvZHcmBfASgLZZb0Q7E22MTi%2Bjd8dw5X%2FLViurPLYvixACKSULi0VMwyAZDQIcANBMy1a8Xg%2BKP0alauK4Er9XxXEcrGoJISIAvHu%2BH8Pa4Nn4GaLpXQAhAEVVFXe9ZtJizuM38iyX1rhT3OB2cZO5so3VaLBZrbFlW%2ByM9PBd%2Fi1qhgWwCqA1KcrS7fmV1P5MAj2dZK6wwPDMBmOLA0jX5tfzNpZjk2rL0JM8yKZZ48zIE8T4YgxAk45z4ebU%2FNtZPQZAZ7qdwI51fl%2BwePqR13Gki%2BM6uEjuVgr0pg9RtQzGjIGjAOrNqxcuZXLPnxKq6gm2NNHsUflt%2FBYTqxfJxPcztzJNuVaiXC1St6psmBs8GO2lbhvU9xQ%2B1gAqyyvHr9xwv3ddeHRXnB8n1jF9JrZjEw92YDsOjnRZXM8T8if4ozDCyMwIdz5D3PvCcyc%2Bf7VDTw8Fgq2eh%2FUEF%2FMvYloWlmth2g30SA99%2BmHG8tf4Zeoq%2BcEtcd%2BZAFpDXZ4jx08NqV7fM6haKwghpWtLuzH7d%2Bidh3pTBxmdnWDqk7Lg%2F6J%2F5JHp06rcrv8D001PzAwk7SYAAAAASUVORK5CYII%3D',
	userscript : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAALZSURBVBgZBcFLiFVlAADg7zzuPLzjzDjOMINMitIie5gF+UAkIZSgRQuXLZIWrY021dYIggJdJURElJsoqlWRYA9GshGFCNQeOjoTk6bjeOd5zzn/f07flzRNA459ObcHJ3cM9+1fq2prVa2qa+uh7mAZ9xCxiAV8iu9zgDqEvU9ODOx//dkxALBa1kNrZT202I2TZcVyEd28t+Lb66uHcTwHqEMYH+xJwNyDqJUk8oQsp7eV2tqbytJUK+OpyX5bhtojH07Pv58CxKoabOeEmuUy0al4UNDp0umysM5/KxG8eWbW/u1tj4+2xnKAWFUjG3tSqwWr3ShNEzmyjDQjk8gSaiRxyYUbiy7PduZzgFiW40P9mc56sFY00rSRpaQxkaVkGlmGJnNnqXDq7N9LOJYDhLLcNj7Y0uk2AjRkMZE2iGQaeZOqG2IrCmXY/s1rB+6nALEstk0M9VotG0lKliRSpEjw+YUjPjq3RxkKoSjEsoiQwvMnvusXQ09vK1VGUg1qjVrUqDWKUJoc3emVj3dbWeuEUJZLkEMoyrF2u0+aUEPD19OHNXVQ1kEZgy2bHrZzYq/l7qr766/m3VC0ub+SQyyLDXm7R56SpYlYJ0JdOvzYy2JTi3VUa8x35jwxecBKue7S7E+dXW+nI/nB42dGcWLPI1vdXmrcvBO1++iGUmxqtxb+UtVBqCtVrCwVy3Y/dNBKtZb+OjO1kMeyfA4vXLo6Y3E9t1I0qtjo6goxGB/cKtRRbGr/dmaNDEy4PHfe+etTd8vgSB6r6ukXD+3qf+ulfQDg6OnCJ7+8p6xL3VDaMfqofTuOuHhryrk/fl4tokPz7zRX8lhVM7fvdXx29qrhgX7Dg32G271OHv3dxg09entSvXnqmXcHJGm/6Ru/ad89dmrm9AdXIK9D+GLq4rXJqYvXtmEzNmMTNmGor6fV6utr6YxWfvjzR0P/vDGTh7GvAP4H2uh1wse2x/0AAAAASUVORK5CYII%3D',
	add_comment : GS_HOST + 'images/stockholm/16x16/add_comment.gif',
	attribute_blank : GS_HOST + 'images/attributes/attribute-blank.gif',
	bearing : GS_HOST + 'images/icons/compass/###BEARING###.gif',
	cache_size : GS_HOST + 'images/icons/container/###SIZE###.gif',
	coord_update : GS_HOST + 'images/icons/coord_update.gif',
	fav : GS_HOST + 'images/icons/icon_fav.png',
	stars_d : GS_HOST + 'images/stars/stars###DIFFICULTY###.gif',
	stars_t : GS_HOST + 'images/stars/stars###TERRAIN###.gif',
	tb_coin : GS_HOST + GS_WPT_IMAGE_PATH + 'tb_coin.gif',
	wpt_type : GS_HOST + GS_WPT_IMAGE_PATH + '###TYPE###.gif',
	zoom_in : GS_HOST + 'images/zoom_in.png',
	zoom_out : GS_HOST + 'images/zoom_out.png',
	sad : HTTP + '//forums.groundspeak.com/GC/public/style_emoticons/default/sad.gif'

	// not used
	//closedHand:  'data:image/x-icon;base64,AAACAAEAICACAAcABQAwAQAAFgAAACgAAAAgAAAAQAAAAAEAAQAAAAAAAAEAAAAAAAAAAAAAAgAAAAAAAAAAAAAA%2F%2F%2F%2FAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8AAAA%2FAAAAfwAAAP%2BAAAH%2FgAAB%2F8AAAH%2FAAAB%2FwAAA%2F0AAANsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FgH%2F%2F%2F4B%2F%2F%2F8Af%2F%2F%2BAD%2F%2F%2FAA%2F%2F%2FwAH%2F%2F%2BAB%2F%2F%2FwAf%2F%2F4AH%2F%2F%2BAD%2F%2F%2FyT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8%3D',
	//mail:		   'data:image/gif,GIF89a%0F%00%0D%00%C6f%00PR%A4SS%9Dae%BAdh%B8nl%AAwv%B3uw%C2%7B%7D%CB~~%BC%7B~%CE%82%81%BE%7F%81%C8%87%87%C3%8B%8B%CA%8A%8C%D1%8C%8D%C6%90%8E%CF%90%8F%CD%8F%90%D5%8F%92%CF%91%94%D5%90%96%CF%93%96%D7%97%98%DE%97%99%D9%9D%A0%DC%A8%A7%D5%AE%B0%E4%A9%B2%EC%B3%B2%DC%B1%B3%E8%B0%B5%E3%AC%B6%E5%B7%B6%E4%B7%B9%E3%B7%B9%E4%B9%B9%E3%B9%BC%EC%BC%BE%EF%BF%BF%E8%C0%C3%F0%C4%C3%E9%C2%C4%EE%BF%C4%F8%C0%C6%F9%C7%C8%F6%C3%CB%F6%CD%CC%F3%CF%CE%F0%CE%CF%F6%CF%D0%F7%D2%D1%EF%D2%D1%F4%CB%D3%FC%D3%D3%EF%D3%D3%F8%D4%D4%F7%CF%D6%FC%D6%D5%F3%D5%D6%F4%D7%D6%F5%D7%D7%F8%D5%D8%FA%D9%D9%F4%D6%D9%FD%D9%DB%FA%DD%DD%F5%DA%DD%FE%DA%DD%FF%DD%E0%FA%DE%E0%FD%DF%E0%FC%E1%E2%FF%E4%E4%F8%E3%E4%FE%E5%E5%FF%E6%E6%FA%E6%E7%FA%E7%E7%FB%E8%E8%FA%E8%E8%FF%E9%E8%FE%EA%EB%FE%EC%EC%FF%ED%ED%FE%ED%ED%FF%ED%EE%FE%EE%EE%FE%F0%F0%FE%F0%F0%FF%F1%F1%FF%F2%F2%FE%F2%F2%FF%F2%F3%FD%F3%F3%FE%F3%F3%FF%F4%F4%FF%F5%F5%FE%F5%F5%FF%F6%F6%FE%F8%F8%FD%F9%F9%FE%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00!%FE%11Created%20with%20GIMP%00!%F9%04%01%0A%00%7F%00%2C%00%00%00%00%0F%00%0D%00%00%07%85%80%7F%82%83%84%85%86%83%0E%17%09%87%83%12%1E1%2B%1C%03%86%06%18%25AR2%2C5%14%84%0B%19(FVbL-%40C%26%93%7F%0F%22%3BM%5Ded47JKG%16%82%15%20%1F%23)30%2FQSUW*%02%7F%13.9%3E%3D%3C%3ANY%5C_%5EE%07%82%1BDHPTX_bcO\'%0D%00%82%108PUZ%60aI%24%0C%01%85!U%5B%5BB%1D%08%8C%11%3F6%1A%05%8C%83%0A%08%FC%0B%04%00%3B',
	//preview:     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQoAAAB4CAYAAAAKVry3AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAKbAAACmwB9fwntgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAACAASURBVHic7L15jKRnft%2F3%2FT3P895v3X0fczSHQ84MzyV3V1RE7W68sODE3iQOZq1AkJHDIATIGyQIEgQI4plBBERBpChZO3KWsOFAtuCEYzgRvJEcaANRkiWvY2kpc3nskHP23V131Xu%2Fz5E%2Fqqs5wz14zCx3FqkP8KKqp4vset%2B369u%2F%2B0fGGMyYMWPGD4L9qN%2FAjBkzHn5mQjFjxowPZCYUM2bM%2BEBmQjFjxowPRPyo38BHgYju%2BfL7ve7y5csAgEuXLhkiwixgO2PG%2FUE%2FLh%2BiK1euULPZpDfeeIPeeadPQJuCIECv18NoNDp6VRXVahXN0y2shqERQmBhYUEDMJcuXfrxONEZMx5CHmqhICK88sorFMcx7e3tidFoZG1ubvLt7Q6XUgrNBIujlJIkgVIKnm%2BjWqmiWQtMELg6rFdks1otHMcpHceR58%2BfN1%2F%2B8pfNw3zOM2Y8jDzUQnHlyhU2GAx4UZCdq8IrktzfP%2Bw5%2B%2B2BJSW3DRgvckNpKaGVhutwVEIbtdA2FV8oP7Rz33UTxigGeLq6Olc6jiMxszBmzPhIPHRCMbUi3nrrLXbz5r6VpokXp3kYp0WlKHk4HBt7EJEolCM0bKYUI6UJMARLGFR8Qj00phZo7bmy5JSnWuWx4%2FCo2awknPMky7J8Z2dHvfrqqzPrYsaMD8FDFcwkIly%2BfJlu3rzJDw8H7mDQD9v9pDYcm0qc2X6uA6dQNZ6qOlM6JEMODAQMYyAAJQNgDAQUHFZAYGgp1bON7nsmz8N%2BP4kNU0NVqJHneelLL71UEtFMLGbM%2BAAeKqG4ePEiDQYQqdrxOp1hrd1LGwc9Ux0mVTfVi5bEPNOsBc3qZJgLkIA5yvASAZqAFAArAVaUgEh4xR0wl7UFyQM3y7teWUSulJnNuelvbW1FFy9elESkZ2IxY8b356ERiitXrtCFCxf41ta%2B2%2BkP6wftrHXY49VePOclepVLtk6GNWGYD5CFSQnIexlSQ4ABoVAEnQHSeCh0CM0aZFXmeeg3mcq2mFK3ucoLVhQ5OC8BIL58%2BXIJQP9oznzGjIefh0YoAFAcx%2FYozmoH7bS132a1frbgJvoUl3yVDG8A5GIiDhowJQA1eQ4CDANIQBuOEgw6Y5BKoJQC0jhYbfpUq1a54%2FjOoHcDabIPrRlz3ZAARK%2B%2B%2Bmrx%2Bc9%2FfmZWzJjxPXgohOLq1auU27bob7eDwSCr9wa8Okibbmw2uBInyfAaAAuAAUwK0jGgY5DJDUEBAAwsGPLIsADGeFDGQWo4pGKQmsOgArHgYb7hk23bTq9NpNSQiEgrpeRbb72lfv%2F3f1%2FNsiEzZnw3P3KhmAYw%2B%2Fv7Yu%2Bg6x20i2CQVJ1Er3ElVsiw%2BsTVMBKkIzDdBtcHhqm%2B5izXjBSMAZTmJI1PhtdJs3kyfIG0CVEYC8N44qYI7sB1FqleMVRXuR2NboV5rorBYBy7rpt97nOfUz%2Fq6zFjxsPIj1woAOD27du4s7fHuweZdTAMxKhsMMmXybAGwCzAGJCOwdUOPHZb%2B85hyfUoA%2FKCCNpoQCrDtbEsaUI7V0tWaVKu%2BBoZ1FBKC6MY2OkQbEvAWpqDXzlJZTGy4njXbbe7HmN29O1vf7v8whe%2BMMuCzJjxPh4Kofj2t79N3W5GUSZYrCqstBqkRR0gB5OgZQHSQ9jYMi1%2Fv1xqyrHgrB%2BNy1jKUpZSEhdCcCa9oiwqoyyvjAvlpkpwRRYZqqCQhGGksdMhVDwHJ%2BfmyXaa1O9tiiQZiDwvGGPl9%2B0fmTHj%2F888FEKxt7eHwQAkWZ2k5cDYIcBcgDgAgKAgKIXPh7peyYr1ldpovrXQGwy60e7urhoOOZaXQy6E6yW5Ltq9gkzvkJdFlWldI8NcGDAUUmMUE3pjjqW6CyYClCUwGPVpNBrQ5ub1H%2FGVmDHj4eShEIrd3V3AmgezBDS8SXaDBAACESCYgcslfCFN4EIFnpW3WvP5yZNr5dmzZ9Wbb76JCxcuyPF4rAZxDM8d28pIr%2Bj2bKV6kLoKMAvGcJTSICuAQnE4sKANkEQJtE5Qq9V%2B1JdixoyHkodsHgUDGOHu%2BghGgGNxVHwblcAmwcDTNHY6nT17a2tLAKALFy7g0qVL%2BrOf%2Fax89NSpdGV1MVmaC%2FLQyxTHyJDJMC2TmAQ%2BDZQy0MbAGEBDoyx%2FJCc8Y8aPBQ%2BFUKysrMAPLNhCQyADmRQwEoABQOBcwPcrqFbmmWVV7Sgqq7u7nWa73a9sb2%2Fbb775JhER3nrrLVOtVmWtHua%2BxzPBc0kmNjDF0f8LIDKAUZAyQ1mkIDIIfd80m01j2%2FaP8jLMmPHQ8okIxXTgDBF913H58mVaXl7G6dUF02o4xrEyMDOc1EoYCWMMlOEAb8CtnCG%2FsmGBVcMkka3xOG4Oh7HfaDTY5cuX6dKlS8YYY7gRUikplZLaGDkxI2BAZMDIgEyKIm2bNOkYzrVqNOpyfX1JP%2F%2F887N0x4wZ34Mfeozi1Vdfpd%2F%2B7d%2BmX%2Fu1X6OXXnoJe3t7x99bXl4GALz44otsb6%2BDrZ2uFocw3bRnUt2F0j4MVVBKjrjwkZsVtAKXCUfYQ1VQnvdK2y4ix3GS5eVldfXqVSIiUkoK4kIwEoxIAEQgEBgZ2LwE033E403Y%2BlDaNqVhUM9arXrZarVmqdEZM74HPzShuHr1KsVxTMYYobW2RqMRL4oCaZpSURSwbRtRFJnRaISFhQUTBAFz3VALdyyxF5lOvGtS7ZEhASldjFOBXuxirjaHMEwpT%2Fe5kpFbrVa8%2Bfl5C0C5v79vksSIKEqdNC1daVxhKCCQDZABpwI2G4OpHVOk24qLURaEPG42a%2BnKyoo6f%2F48rly58ommSGeVoDN%2BHHjgQnHlyhU6efIkxXEsdnZ2LMuyPK213%2B127SiKmNaToKLWGkmSYDAY6CzLJICy0agwJixpzEDq%2FQPWjQXLlSFtGihyH%2BPYwiiW8FkJrTU4J7Ish1lWwJaWlujGjRtsPB65h72%2B3%2B5lTpy1uKIagSyQycHNGFztGZR3lCUGWRjyaH6%2BGZ85c1ouLy%2FzarVKP3H%2B%2FIO%2BJPcwuuu57%2Ft4%2BeWXTRzHZm1tTc%2Bmb814WHmgQnH16lXa2NhgeZ47%2FX7f73Q6QZZlAec81FrbQghqNBrHw26FEEjT1IxGoyLLstzzPFOp1PhSi6uyiLSWt6ifRijUEhk0UMQWhv3MWPmO0VlPGp1mSRKnUiZlFEWUZZl7cNCptDvjSm9EdiJrpFkVMAqkBuBmB7a1ZTw%2BLGsVipcXW8n6%2BjwqFSfQZYSD3RFpfXfY5kFUdPN7vlIAlAKM0Tg8hCnLVI5Gcf6nf%2Fqn2cWLFxWmUdcZMx4iHphQXLlyhc6fP8%2F39vbcOI6ro9GoURRFyBhzK5WKHQQBdxyHhBAgIpRliSzLkCSJGQ6HqixLGUWRLkvJLMvmjUphsjRSZCKK8i6VZQUm5SbuF8YpRtLh49iy1DDPkzhNUzUYDOxeL60c9sb1bt%2BEcV63pGmRMQQyHTjYNlV3H63KWM81TVmr2lKwmMejvMbUoR3bnDNDZBQApR%2BMRkzhADiDZoBUQJRqJKlBWRhdlGWW5%2BUgjmOdJEk2G6Qz42HkgQgFEeGrX%2F0qvf7663aSJNU4jueIqDY%2FP%2B8tLy%2Fz5eVl1mg04Hkecc5hjEGe54iiCMPh0PR6Pd7pdKxer2dGoxGSJIFWha74heasVJU8V3nR0wYwwmjJQVkYWmPXrQ6DwE2JiG5u7vh7B4PG%2FmFZ7458N5HzXEMQ04dwsGsa3r5ZbuZYmuPGt0sm856XmsTzmBRGMItpzqk0pBMNnWiYEtDG3N%2Ffd8KkNMRigE8oOcMwNdhra3T72qS51kWh47wo86KQ0WAQz0rIZzyUPBChuHz5Mn3zm9%2FknHPPGFNzXbe2srLinz17VjzyyCO0uLiIIAggxOTHaa0hpUSapoiiiIbDIXq9Hu3v72NnZwe7u7um0%2BlAykJxpot6jSWW5WTSUImyzG2b8larklWr1TzLuLmxuekOB2W121PV3a7rDrOmUMYljg4c2jMVa980%2FNiENiOSmpV6YHvW0Kr7BVttGbbQAHOYgUk08lKihIJSBuY%2BHQEiABbBMAbJGEaaoUw00rFCHhsUGdQ41mIwVjxPDNqD%2BEHcjhkzHjj3LRREhM9%2F%2FvMUhqGttQ4rlUpldXXVfeKJJ8T58%2BdpcXERYRhi6nIAgDEGWmsopVAUBbIsw2g0wtzcHBqNBur1Om1tbbHt7W3e7w8ZI2kaNSutVptjLZDKhJXz855mjFEU9dzOYVTbb2e1ztDzRnkoSuOC09D4%2FAAV5wCB3SOBFFlUktAZNasJa1VLzNeBekjkWgShDUqjYIyCIgXFAHO%2F4QJGMIJQGsIoInQSoB8Z2NxgdZFMXhD2D7VJM2WKWWhixkPMfQvFxYsXSUop8jz3hRDVer0ebGxsWI8%2B%2BigtLS3Bdd3j1zI2nW852d4lhIBlWbBt%2B%2Fi54zjwPA%2Bu65IQggO33eFwqEajUSaEGK%2BtrZXOvCOr1Srt7e3ZozitDcdlqz8W1XFatUvjEmcRQqurW2HX1IIxc%2FmIuBkR5zlVfYlmVaMaAowTxjEhywCjAJlpZJlBYQiaAYbu0xOgSbhjNDI4GChEGWDbhErA4ToMRKRcRxSVUJTccbRft83t27fv72fOmPFD4L6Egojwla98hba2toSU0guCwF9ZWbEfeeQRWlhYABFhOBxCKQXf9xEEASzLOhYMYwzKskQURUiSBMYYNBqNYyFRSrE8z0VRFH6WZWVZlnGWZempU6fUO%2B%2B8w7vdKBiO8vpgLKpRFrqFqXBGOXzRlY1gWDYrqamHidWqplYtyMh3FDzXIPAYHAcQnMDYkXfBAeYy2IKBazMt5rwvDICiNJBtjUEM5CWD69lQxkJ7yPU4oiJTVhw2qvFi0CxPnjxnvva1r93fD50x44fAfQnFxYsXiXPOhRAOEflBEDirq6tsdXWVgiBAlmXY29tDp9NBEARYXl7G%2FPw8fN%2BHMQZJkqDdbmNvbw9JkmB%2Bfh7z8%2FNoNps4Ks7CeDxmw%2BFQ9Ho9X2tdybIsvnPnjjw46Fv7hz3%2FoK2DfhS4mapzRkBoD1WzEmfzdSSepYhREvp2wZs18NAXsG0GwSddqUTv0wIOcAawadbBHLkf5uO5IcYA0mhoKJSKoIwPZrXAnIopU2OiIs3zwkTVaj1dWDglV1ZW7ud2zJjxQ%2BNDC8Xd8YUpX%2FziF7G5uSkcx%2FGMMV6z2bQWFxep0WjAcRwURYHRaIS33noLWZZhY2MD58%2Bfx9raGowx2NrawhtvvIE7d%2B4gCAJ4nofV1VVwzlGv1zEajdBqtTA3N8fiOLaTJPGIyDHGFGmauYNhHvbGrhsXdaaNC5f3VS1MspVFa9Sqh1GZKyuLbHHQFXycGKoEDgtDH7Ztv3c%2BdwvB0eM0hiKlRFmUUGrSc2ImF%2BD4%2FN%2F%2F9fTfaHLBYLRBlit0%2BxKDiKNaX0Fr6Rxac0sIupGRd7ZVp9Mu8nxcbm1t6d%2F4jd%2BYBSpmPJR8KKG4evUqvfLKK7S%2Fv4%2BXX37Z7O3t4dKlS2Zvb4%2FiOOaMMcf3fbfRaIhGo0Gu6x7HHIgIBwcHePfdd3Hnzh1kWXbsWnzrW9%2FCH%2F%2FxH6Pb7eLxxx8HANi2DcuyEIYhKpUKarUams0mHRwcsMFgYAFwwjAs81KFubKCXFVtaerMkDQWG8uqW8ZzjfpgebEVjfqwD4qMuiNjemMZLC0t2tWFUyys1cA5hwFgtD5qN38vwFqWJYo0wXDcR6%2FXQRyPoVT5nkjebWEcC8jxl9AGMIaglEFeEPKCYNkVtOY3cObRT2FhcQnb29sYjTMzHsem1%2BvpN9989UHe1xkzHigfKBRXr14lALzb7dpSSjoqt5Zf%2FvKXdaPRoOFwyJRSolariUajQZVKhaYCwRgDESFJEty%2BfRtbW1twXRetVgsA8Nprr%2BG1116DMQbr6%2BsAAM45LMuC67rwfR%2Be5x0%2FMsa4UsaO08KL08JPc%2BGVuiIMeWC6YyyWlraNOKh441otjJUqOOv1yrQQ0verfHHlgnjq2c%2Bw1dVV2JY1iYNoDa0UlFLIiwJxHKHf7%2BHwYBdFoWGPOyhFDk0FYI5mWtxzhd4TCq0nMYk8M4gSICsmcy8Ajjnfw9zcElbXTqLZbGA0iuA4Nji%2Ft3JzxoyHkQ9jUbDxeOwmSVLpdrsiSZKUiKKlpaXi2rVr0FqTEILq9TqCICDf948FArg3YJllGXZ3d9Hv9wEA%2B%2Fv7ODw8hOd5KIri%2BC82YwxCiOPjKCtCRMS0VjzLUitLczfPHavUjMEU4BQbS0jp2nZe8cLcsqxSKVUcHnZVFGVWszlfW1hYNo9sPGpOb2yQ4zjvuRdlgSRJ0Ot1kWcJ8nSIIt5BwHdRW%2BrDZjEEkwDdNVKH3js0AVIDaWbQ7Wts7yuUpYFWBpoRtHFgWwxhGKBarSIIQliWBc4figFjM2Z8ID%2FwN%2FXKlSt05swZStPUHg6H1YODA28wGERaayWEUJxzk6YpgIklME1zTrMaU44yGBOTvihQHo2TKooCUkoopSYxgLv8%2FffPrTgSHzLGcKOMgNGCKOc2hhA8gyeGphIYaXGW57ksl5eX1Ztvvon9%2FX0lhFCMcW3bNjzfRxiGcBwHUkokSYzxKEX7cA%2FbW9exdecNDNvvwlY7WKv1sFJNUXclLGZwnC2lo3GeNoOyCDkIw9TgoGsguEGWGRA0SkkoJTBOCLbNYNuT9O%2FUvSKimUUx48eCD%2FUnLc9z6vf71u7urt%2Fr9TjnvKzX66pWqxV5ntPUgrjbkvhevF8MpkzF4O7Xaa2PYwZHBxERc13X9n2P1UtjSSMp8BOAcoQeTKteV3MNX3leqL%2FxjW%2Fg6tWrqFarptlsHv8cYFIZWhQFxuMR9na3cfv2O9jdehvj3jtAdhvLdhvLTowVN0eLKbi5mWRCCCBGgAUYwaBsYCwYDlKD4digN5hYEtUKg2VxJBnDMBIolAfLciCEBcuyji2lmUjM%2BHHhBwrFpUuXzMsvv2yKopC9Xq%2FodDo0HA4D13W153kQQozn5uZ4mqZsMjBGQWv9XZbBNO4w%2FZBwzkFEsG0bruvCdd3j%2Bop7Mg5libIskSQJ0jQlrbXgnPvC4qZRDx3HlawoQYxxE%2Fi%2BaTRC02pUUK1W2RNPfBFXr16953wmlaA5BoM%2B4jjCzvZt3L75bRzsfBsmu4U5p42VxhgLPEe9LOEnElauwcqJSEAQyCNojyNjQE8ZbKcKt7oGB32DtACIJpZDoRyUsQ1pbAjHg%2BOGEGJyjh8kqDNmPGx8GItCt9vtot%2Fvp3mel0opVylVK8uSyrJ0ms2miqLIAcCmbsVULIwxsCwL9Xodi4uLSNMUrVbruO9jdXUV%2FX4fnudhYWHhuIpTSok8z6fdpRgMBuj3%2B4iiyNLGMCkVDARTmpFSDCCaBCPTnI%2BF5SilnDRN1UsvvSS%2F%2FvWvE2Ps2M042N%2FDaNjBwd4d7Gy%2BhWTwHVT4FlarI6z7OeZNCS%2BVEJECpZMuUnPUs6EFQbocscNxUBBuDgzu9AwGMQBiEJaA1C4KXYXhTQjPgW0AoRkcxz8%2BtzRNkaapUUrNBGPGjwUfKBR7e3sYDocSQOb7fk5Eoeu6juu6dQCelFIaY0SWZWI8HlOWZZMPbZ4jTVMIIbCxsQEAKMsSp0%2BfxurqKmzbxmc%2B8xmsrq5CCIETJ07A8zykaQrGGJIkQZIkGA6HODw8RKfToSiKUJZKjMYlcukhVwEZOPBcgYqneBxH3mA0qvuupcLQ0ysrK9kzzzzDd3Y2RRKP%2Bc72bVQCDc%2FKkAxvQcW3sczbOFlNsOqWqJUKViRBsQbKo2G8LsG4DIXNMBIMXcPQiQj7MbDbN%2BiNAA0Bz%2FchnAaI5uHaK3C8RYzjEocHXcRJDMY4kiTB3t4eiMjs7%2B%2Broiik7%2Ftqfn7%2Bh3mPZ8y4bz5QKC5fvmx%2B%2Fud%2FXgdBUBRFkdq2XVQqFWt%2Bft5xHMdOkkSPRiMwxni326UoipDnOYqiwPb2NobDIVZXV7G%2Bvg7bttFoNLCwsADOOarVKs6ePTvJeGiN0WiEOI7huu5RDGF8bE1Mxue5ZGBhMOYYpDXkZhXcnkOdu%2BQFKVc4cONoH0UWac6hiqKgtbUlKx73vWjcsfa236BQ3KKTiwVWvAGa3ggtnaKhJYKhAs80kE2sCLIABBymypF6DG3JcHtgsDUA%2BrmBBCAVA7gFKavQbAVh8wyac6dRb67BdkJsb%2B8gSQpkeY48z7GzswMAWilVDgaDFEDSarXKtbU18%2Bqrr86KrWY8tHygUBhjcOXKFbO1tVUURRELIZJKpeIsLi46tVqN9ft9XpYlRqMRBoMBjcdjZFmGfr%2BPa9eu4eDgAM1mE6dOnsTiwgIq1Sosa7JP1HNdFFmG0WCAnZ0dtDsd2I6D1dVVeJ6H8XiM8XgMYwzm5uYgLBf9kUE68jGWGyjZBgSa8JgD5pdUCatCJtIr8wOtlFGjUdcusp5dCbKaZ8XOUn3IVqsMZ%2Boa675ETRZwIgmeKlCmATmJRRifQVcYyorAyGbYLwi3ewZbXWCYGGgwMC6gjQvwJsLwFJbWzuORRy5gcWkNQViFLCVGowicc0gpMRqNTBzHut%2Fvl5ZlxUKIQa1WGy4sLOSj0UjPhtXMeJj5UFmPN99806yurso8zxPOeUxEAefcWlpa4idOnKBWq4Xr169Da42pUOR5jm63i7fefBMEYH9rC6dPnUKr2cS0hiGJInQODnD7zh3c2tpCUpY4ceoUqtUqiAhxHCNNU1QqFSwtLaMogX4cIdMtlLQOxRYB4yNXApoRwioR7BEfD2NPyqQx7LUDI%2FfFcqvvLTZL%2B8yaoo0FYNE2qBQSItEgBzBggEswADQjlDZD5DB0DMNOH9jsaRwODbKCwC0LnLmQpgrDF9FonMbaiQvYOHMBa6sn4Pn%2B8Xt3HAdlWZo4jk0URcoYUxhj4nq9PnBdtx8EQfzYY48VN2%2FenKnEjIeaD1vCbb761a8qIUQ%2BGAziNE3T4XDoJEnC19fX0Wq1IITA%2Fv4%2BxuMx0jSF53loNpsgALffeQedd97BTqOBVq02EQqlUEQRhv0%2Bdns9tJVCfX0dtWr1eLVfmqYoy3Liriwuot2JoIxEaSowrApDDrThKBVBagHLDmGxGmWJLbQ8CAQ78JqNDltfzPmJFU3ri4waHuAUGjpjKAQBgQH0pPTaGCBTQCcFNsfA7tCgHwNRBuSlgDI2YKrg9hJqlZNotDawtHIa6yc2sLKyimq1BmMMpJSQUkIIYcqyVHEcF8aYzLbtuFarjefm5oZBEMT1er28efOmBvChpn9funTJTMvfZ8z4JPlQQmGMwdWrV41SqgQQF0UxHgwG7vb2tlhYWOArKyu0srKC0Wh0fCwvL2NjYwM7m5vo376N7Pp1ZNevQwkBcA6uNURZgpUlGOeora%2FjzMYGzp07h4WFBfR6PRRFAaUU6vU6ms0m0tRAiP5k2xfuPo7fKIxRIJTMFin5boKKl8G1JUlJOOwBfcLExVAANMGY9z6fSgPjxGC3q7HT0UgKgmVxMG6DWSEMzcGvnsTS8lksr57B%2FMIKGo0W6vU6qtUabNuGlBIAjiovuTHGSK11HIbhqNFoRK1WK6lUKnmapubmzZs8TdMPtYQpCAL84i%2F%2BovnKV76ir1y5YmZj%2Fmd8knzoGuKLFy%2BaK1euKMdxUtu2h1EUOQcHB%2Fz69ese55xblkW%2B72M8HqPdbmNpaQmrKyt48oknMNrawt7%2BPha3t3Euz7FkDAhAF8C7to10cRHh2bP41PPP47HHHoNl2xgOh8c1FUQEwQUc10LoGbh8hLjsQ2sfjBkIJsBRosgHKLI2jO4j8BNy7RxlqXDYVeiPJntMCXhPW%2B7WGABSGgwjg3ZPI84YbNtGEIbwnHlUKifRaJ3B0sqjWFk9iVZr0i5v2w5c14XjOJjOAz2e3lUWAADXdeB5PizH4lEauXE8spVSRv%2Bg1KhSk%2Fm%2BCtCkjZRSK1LlQnMhD4KguHLlip6JxYxPio%2FUbHDp0iV95cqVMgzDSEpppWnKb926RQDcVqvFjTE0Ho9xeHiINE2xtLSEM2fPor%2B%2FD7mzAzEcoprnWJcSBkBsWZDVKqqPPorHPvMZXHjySSwtLSFOkuPCJGMMRqMRDg8PkUSJca3chE6EcWKRNiU41WBpGzpXNOofgMk7CKwOWtUh6mE%2BWSEIOrJC3sdxM%2BhkMIUyBKk1klwgzV1wZw5OeApLq49h%2FeQ5rKxtoNVaQBiGsCz7%2BD06jjMJ0B4hpZxka3o90kYJr%2BL6xDRPyqjyl5qv%2FVWfkj%2FfTdzf%2Bcbw2b%2F%2Fva7zpORdQxYKZT5pcbdtR0olU4usgWVZY9d1ZxO7Z3xifOSupPPnz%2BubN29mSqlhkiTU7%2FehtaZer%2BeWZcmiKKJGo4EkSWBZFuYXFrBx7hwO79xB5%2FAQB0mCufEYkgg7YYj05EksPfssHnvmGaysr8MPAuRFcdxByhjD%2Fv4%2But2uFsKSDIWs%2B6mJoltcp10GXSWkFrJBScOyR4HbZjU3JUY5YEoIbiDEUZn4XedhcDSVXwLGTLIYgjiEDXBLwOELWFy9gHPnP4VHzpzD8soaarU6bNu5p%2BGNMXZcVTpdQdDr9XBn8w6297dI8ZwHTcstUTjnxdbptUr2C0VJnCN%2B9N9gf%2FxTf1Sc%2FW9HrDqevjutDXSpkCcF4jRFOiqgtTGO4yilytRxHZqbm5PLy8vylVdeKTHbAzLjE%2BAjC8WXv%2Fxlc%2FnyZcU5TznnUEpRv9%2FnvV6PsiyzjTG82WzStFnMDwKsnjiBjaeeQrS7i61%2BH6oooBjD3tISKk8%2FjbPPP48TGxuoVCrHnaOO4yAMQ3iehzt37pgoispKpRI3Gs24VWdqOOqJPG3zorBJJZwKh4SytaPt0k0y4tv7INdSaFQ06lXAsSd9GoSjyVNq0go%2BGDGUykNYacEPZYk5YQAAIABJREFUaoDF4FU55isn8eTTL%2BCppz%2BFlZUVBEEAzsVxxem0%2BnRajp3nOfr9PnZ2d7C1tYl3b15De7QHCgvyfcYVY1jKozMOZ%2FzxL%2FwCxv0D%2FKvf%2F4ef%2Binz9te2qmu%2FvN967C2jgSItEQ9TZEpCsQJK5CAiKA6Ry5S0VgVjLAaQhmE4Xfk%2BY8YPlY8sFMYYEJG5fPmyHAwGqeM4LMsy3uv1TKfTCRljzmg0soqiIK01hBBoNJs4%2FdhjaO%2Fs4K2dHXTiGMyyUHnsMZx67jmcOXcOzVYLtm1j%2Bt94nodarYZGowHXdU2%2F35dpmibNJgaNWpDV%2Fb4ZDvusVIANl9XCmuv7Vr0sc9bJtGsUqO4D1QCohgyVkMCPwoZaA3EGRAnDOPWh2RrmahewvHoSpTQIezFqjUU8evYcTpw4iWq1etwRO21Wu7thbVo3cvPWTVx7521s722in7SRsiG0l0HZEppKSKmVZRGEcHDuJ%2F89LJ56Bt%2F4B5caq%2F07v1wvx%2F%2Fg9snP%2FqM8y02eFZBlCeEwVN1JulXlxjADmMkqM0az2u8ZnyAfayDC3WIBIDk8PMR4PC6llAVjrF6WJSvLkmutiYjgeR6WVlZw%2BsIF7Gxt4Xqew%2FN9nH3uOTz65JNYXF6G67rHXaS2bSMMQ9TrdczNzWFpaYnSNOVFUVhRFPGFhQX59NNnskajIW%2FcaJu1tZCdOrUajIddZ3e%2FH6ZJYjhJBDYDYwKMT%2F7qEwMAgtGA0hzgIWqtE2guPIPzFz6N1dV1RHGCra1tOI6HRqN5PBB4mpacfj6nAtHr93BwcICd3W3c2bqFzb1b6CdtSCuBclIUMkFZZFBaITOFtHwGLTMAGo3F0%2Fi3%2F%2FrL9Af%2Fx%2F%2BAW9%2F5k7965u3fffJfmlO%2FGo%2BsoTEGjjcZ2SdzbaRWCsQyECJpZJrnuVpYWJhZEzM%2BET725JSpWHzta18rB4NBDEBKKbUQQiil7LIsmdaagMmsimqlgpOPPILOpz8N43kIfB%2Fnnn8e6ydPIgzD445SxibZhkqlgmaziaWlJYxGIxRFYR0cHIR5nqs4jun06dPjRx99NH7hhaQAaqosO%2FJaNFBlKY2UBpbnwzAHvbGG2gIcm8DYZHWXNgzS%2BLDcNTxy9lmcffwz2Ng4iyCs4PDwEIPB%2BNgFmgYs70YphfF4jJ3dHVy%2F%2Fi5u3LqOdv8AiRwhwQC520emI%2BR5glLnkEdj9ApHlwCgZAEYIG%2B%2FDea38IWL%2FwWdeP338Pu%2F9beffYFu%2FK13ndZ%2F%2F6ZaeZ0ZDl0QirQwyFG6FX%2Fs2s6QNMW1Wq38%2Bte%2Fjueee%2B4%2Bbv%2BMGR%2BO%2BxqxNBWLixcvys3NTYzH47RSqeRaayWlxHRzOWMMtuNgYWEBTz%2F7LOaXluDYNtZPnECtXr9nORARQQiBIAjQarWQpimO3BhGRE673a5nWeYcHBx4URQNGGPjeh0lY4w5joNarYaFhTnMzzdQDS0w5ChMCaUJnDg4F%2BDCQuBVsbR8Cmcfewobj5xFq9mCPup2nc6JeP9A4Wnn5zRY%2BZ1rb%2BP6rXdw0N9FhjHglihYhNgMkZYxpCqgjT4%2BJwNWAhpa5jDQ0OUYstMGd1s49fjzWFj%2Fn%2FBP%2Fu7fqD1m2r%2B0wNL%2F%2FQ322X9ohTUdicSMh2NZqzby%2Bfm5JAiCwnXdWXp0xifGfc9im4rFhQsXjOM4xrZtY1mWmVoIUxhjCIIA6ydOYG5%2BHowx%2BL4Px3G%2Bq9WaMQbXdVGv16HUZFuwEII459y2bbfb7Vq9Xs%2Fu9%2FuWEMKO4zheWFigSqXCGWO0vr6Oxx9%2FDGHoI4knO0MAMxkcY1twHRd%2BEKLVmsPS0goajSZsx0ZRlHef0%2FHzaTfsYDDA%2Fv4%2B7mzexo1b13F7%2BwZ68SEYa7vrxZ0L9WT4dIXKZwUn823j%2FO0%2FE97bQgjYlg3H8cA1SSAGtAQMQCBAFSijHah8ANufx8Wv%2FCr9s3%2Fydwze%2FubP%2Fmv8m0%2BoUxd%2FZTdeO9za3DKe5%2BkwrOsgCPTFixdnIjHjE%2BOBDW0MwxBhGLIgCITv%2B9y2bdwtFtMBNr7v3xOPeL9Zf%2FdrPc9Dq9U6rlVwHIeCIKDNzU3a39%2F3hsMhH4%2FHdpIkjuM4hWVZolar0draGs6dO4dms3W0CHmAspTgnN01LMdDEARH2QwOY3A8rk8pBc45tNbI8xxxHOPw8BA3b93AjVs3sLd7k%2FPOH5xdzneePq2jZywtHwcMt4SFhbXHTDrYoqfK4kvfcby3XceFa3sQ5EBGeQnE0Hqa1ZwsFyFjoLIhVJmCJR385J%2F%2FK3Ty7Kfw6m%2F9%2BhPi9m%2F%2BzbXm87%2FSCx75PcbYcdftjBmfJA9EKI7WCrIoioTrupbnedxxHHq%2FCPwgcXg%2FU3N9OqzXdV0EQYBarYZWq0W3bt3i77zzjrOzs0NRFJnxeBz7vs8450ci46PRaCAIAjiOgzRNobU%2Bnu3pOM6xyzPNYEwH5uR5DsuyMB6PIaVEr92m7%2FzR3z05vPPNpyk7fHrJZE%2BS0S4RQ6W1ajae%2BRlaP%2F8i5taegO1V6eu%2F%2FDnkcT%2BsVxuwhQuUHPlQIk50iRpgtDya6P3eEE4igpYpZJlCFREWWjX85b%2F2S%2Fid%2F%2B1XQt3%2B55fPs7fP3eJ%2F7r95EPdrxoyPygMRihdffJFef%2F11IaV0LMuyfN9nnufdY1G8fzzeh%2BFuy8K2bXied7zrw7Is6vf7rNfrMaUUAVB5nsMYo%2BI4NtP9IUEQHA%2FCKcvyuPZhGoeY1kQA703WStMUg5t%2FsND55mvPlIPbT5t8%2BLTRZc0G4FWa5sS5n6H1Jz6HxVPPImwsE%2BMWcFwwJcEBCMaZywIUY4N0kCMZ5RhbsgAAo9Sk%2BOEua2uy55QAI6HyMajMQayLv%2FhX%2Fjp961%2F8P%2BbGG%2F%2F8Z8%2Fmv3VO7b7281j7z9%2B633s2Y8ZH4b6F4uWXX6bxeGxxzn3XdYMgCJxWq8XCMKT39z5orY8%2FpB92buRULO5%2BfZqm04YrZVlW4ft%2B4nlePB6PRVEU4eHhodnd3TWtVovq9frxZrC7J35Pmbob7dt%2FUn3z9%2F7OUwc3%2FuUz%2BfjgGah8EQCE7WP5sc%2Bak%2Bc%2Fh8Uzz6O%2BcJqE5QLEYIyCLlOofAStJIRbBUiAMw1OxKLDEnE%2FQ56WgCGUllUCgFbl8Y6Qo5PE1KowRCBMrAsDgipu4sknn6Sl9TP4o9%2F5%2B0%2Bz5PYfJX%2F4H%2F%2BHeOmlf3S%2F927GjA%2FLxxaKK1eu0Pnz52lvb09sb2%2F7cRzXhBDVpaUlZ319ndWOtnEppZCmKfr9PrIsg%2Bu6qFar8DzvnoXFHzS9ezo5ezAYYHt729y%2BfVv1er1Maz3inA9834%2BklL4xRnY6HfX2229zzjlWVlbo%2FQHTu4Wic%2F2ftV7%2FP%2F%2FL%2F6pMB2cAEOMW5pbPmPVzP4mVR57H3OpjsLwaEWOA0TA6h0zjI%2FcBALH31gpgYlEIBjBVnP3C6E%2F%2FF3AA4eR7jBEDAhgjj376va7HVCSOrQstoY0GkgINS%2BMv%2FLv%2FEf7gd%2F9xEI%2F6V%2F%2FHn%2BNX%2FpPfVJc%2F7v2bMeOj8LGE4tVXX6UXXniB3bx50zo8PPTa7XZNSllfWFgI1tfXrfX1dQqCAEopRFGE3d1dvPvuu%2Bh2u6jVajh58iQWFxdRrVbhuu49FsP7BWM6kTtJEnQ6Hdy8edO8%2Ffbb%2Btq1a3mv1xsbY%2Fqc86her8tarYZ2u60Gg4G8du0aH4%2FHfH5%2BnqY9I1P3RQhhABhjDPb%2B6aV%2FX%2BXRo49%2F%2Bt%2FE0sanYNdPw6%2B2jtwJYDSOoYdDaDX5cBPjIGJHjwQifvz%2BPQoAGFiWgOtW7XrLW2UEsKNiLzIawAhG6e%2FaWYq7RGJ6HQwRSBtoLUHGgCV7%2BOnPfZ79qz97HbtbN%2F7rv%2Fll%2Bp%2B%2F8oppf5x7OGPGR%2BEjC8XVq1fpxIkTvNvtuoeHh2Gv16sMh8Oq4ziVMAztRqNBQghEUYR%2Bv492u43vfOc75s033zSHh4emUqng1KlTdPr0aVpZWaF6vQ7P846Di9O4xt1pyWnr%2BtbWFm7duoXNzU3ZbrdTrXXseV6plBIHBwdOpVLxAYiiKEy%2F39e9Xo95nmcmW8YYXNdBo9EwlUpF2bYtKXq3YsXtn1p99Dn8xF%2F4a3j3ziFu3dyD1ttQSgIgcCEmtRdcgPHJ%2B2NcgHEOzjgY53AcG7ZlowkPtsXhh01U1x%2FBk4%2F%2FJTi2BdsWsC0BBok3XvkFeMFEUHBXUPdukTDTbAgIhhiINLRWMNBAEeHcufPY3brBpOB%2FEcDfe2C%2FDTNmfB8%2BslBsbGwgyzIRx7Hf6%2FXqnU6nHkWR7ziOzRjjw%2BEQN27cMIwxjMdj7O3t6c3NTbm%2Fv1%2FGcax6vR4bDodid3fXWlhYYM1mkyqVCgVBcLzfYxpPyPMcURSh2%2B2i3W5jMBggiiITRZGSUmqttYjjuHK0Nd2uVqs%2BY8w1xliWZXHGGFNK0WTqlMJoNES32zNB4KtarZaujf%2FvnzZGi0effBFGFrjx7jVIZcCFBc6tiUgQgTMCZwyMEThnYHxSrck4g%2BACnHFwzkDEJjUScgxTJijTAbgS4MqCVhaIGYAI2WAP0BIiXIGRKXSZAMC9IkHfQziOnttUgBgDtPoSZkIx4xPgY7kew%2BHQHBwcmE6nw6Io4lmWUZZlutfr6WvXrtH169eRZZlJksQkSVKWZZkyxuJms1lorXmSJN7m5mawu7vr2LYtbNsm27anYkEAaLrTI01TJElyNIV7soPUGCMA%2BFJK58iloCNhEJ7vi2azRZ7nket6k%2FgEY0jTFLs7O7h16yZtbt6B53nlydX9F7mwzPKJx2g07KMsS3BhgxGBcToKvLIjcZgEVadWBGNHVZ78veAsYwRjJIyMoVWBMu6CSwtcWRDaAnGGxtqz6G99C9%2F5p7%2BE9U%2F%2FHPz5J1AM7kCnHRit7hGEux%2Fvfq6VxMYjj%2BPGu2%2F%2FzJX%2FgNxLf89kD%2FbXYsaMe%2FnIQvHcc8%2Fh13%2F919XBwUE2Ho%2BHR0t%2F3OFwyHZ2dtButyGlnC4d1o7jFLVaLWk2m9Hi4qI0xohut%2Bt3u91iNBr5eZ47eZ4LYwxzHIdXq1XOGGNJktBRuvO4psLzfQS%2BT7ZtW47jcCGEcV2PXNeF53nkBwEFfkC%2BH8DzffieD9txwbhAEidgzMbNW7ewt7dPdSdxxar6yaWTT5CwLRzu7k3iCMwcicTkIIbjfg%2FGCWwqHEcWxcQNYRPxIDYZcKEng3mMLmE03juIYeHcF2GHLXTe%2FUO887v%2FHeqnPoO1p%2F4dcLcGObgFUyYwR1O9zF1BzknAk8HQ5Hsrq6u48e5bXi3jfw7A%2F%2FXAfzNmzLiLjywUR12jqiiKVGutjTFpWZaWUoqUUrAsC1prMsbQUfBQMcbKoihKzjlzXdc6yl6UZVnmRxvBdFEUvCxLc%2FSaSXDwKHYxPVzXhe8HCIKAgiDgvu9jKgquO3FdbMeFbTuwLRuWPdn3CeIYDgcI7myCMQ4pJb14dvyCgbFPPPIUoCX2DrtgIHAiMCJwAjgDOCMwAsSRePCjYyoYnE%2FcEcEnFoVWJYzRIC1hZArDJDQroZkFrSYxidrSOYTNU%2Bjc%2FCMM7vy%2FGG19C0tPfgmt05%2BFGWzCJIcw5v0icW9WJHCm8Q3zJcyEYsYPmY89j%2BLixYsqiqLUtu1cSklaa9RqNVpYWJiKgVWWpSAiPhwO3U6n48VxbDebzUBr7eZ5Lhhj7Mj14JzzqUVBlUoVnufC8%2Fzjkm%2FHORIN18ORBTH5t6Pv2bYH23EghH3kCkxcBAIhLwp0e30kSQatDSzbxnJd%2FTSIsHryLMosQRSlYMKaiAQzqPIBOHfAhQ3ObTBugwsLTNhHQU0LjFtgXEEwDU4KHAWMjCdDfvMeZP8d5BaH4hylxcDfl9HxaosQtofhwTvY%2FbN%2FjIPvfAMrT%2F9lVBqPoOjdgNIKPyh1urS0ag72d78Eol%2BYjeae8cPkY8%2BjAGBoMojyuBb5i1%2F8Irmu60ZR5JVlGZZl6TLGbGOMMMaw0WgkjDGO67rC931WqVTIsiw4jkue55HneQiCkIIwIM%2BbuA6OOxEI23Zh2e5RnMKGZdkQlgUhJgfn7wkEsaMPEwhKSYyjGJ32ITqdQwAazYrPQ4debC2uwvN87Hf7IBgwmiQiGGNQvAJwG2D25JFbIG6DuAUzPYQAuAVYFogLMMuDpqO6EBGAe3OwLH6U9ZgEPN%2BPW11EZfEMxoc30d9%2BHVv%2F4n%2BFt3AeK0%2F8DETRRxm17xGJu1Onp06fov39naVf%2B1k8958Cf%2FKxfgNmzPgQ3Heb%2BfQpEeH27dvctm27KIq6lLJhjHF937dc12W2bZPrehRWQhYGIYVhiCAI4Pk%2Bea4Hz%2FPhupOYguO6sKxJylFYk8G1wrJhWc4kG8GPAorEQcf1F%2B9Vbk4eJinWolAYDPrY2d7CcNCF53l44XT0BEFXTp46C9ISh53hRCCmNQ%2FEoEQdsCxAWCBhgYQ9eeQCJCxA2OC2N3m%2FR7EQLgQMJqXhzG3Aqp2A41hwbAHXsWAJ%2Fn2vZTh3BvWTL2D%2FnVcR730bt%2F94H9VH%2FnW05jcgB7egtPqu1GmtEkzOF%2BxLmAnFjB8iD6x7FADdvn2bOOcWEfmO4wSVSsURQjDf91GtVlGvN2h%2BfgH1RhOVShW%2BH8BxXNiOc%2BQ%2BTOIL%2FH3uA2PvZRuI7i7MomNR%2BF4opRDHMQ72d7G3twWtJFqtJlbz0U8CwNrJR2GMQneUgJg4DmAyRiBdgLQBaYAMgdOkFsJxA1iOB8v2wIQFGI20exv93jXknWuQnUkbhjYGOulAKQElJwcTP7gZzhQS1eWnIIJljHdew%2BD676G%2Fu4T5k8%2Bh4hcoosN7C7O0RBhUTJzE%2FxaAv%2FEA7%2BWMGffwIIUCvV4PjDHuuq7gnAvOOdNaU5qmIGJwPR%2FEBCrVBubmllCt1uC4HizLPhoYYx8VNrG7hOBeQfhBwnA3RmuUZYFet43trTsYDvoIwgCVSgXBbvZCENRMrblAwyiHVICwpm7LJO0pLAHL9eE4Piw3gGVPrJkijxAdvIW88y7U6Dp4vAnkXZij3g3DbOjgNLg7D6MLGKUnTWBKwdAHCIVSMFqC2QHs5Z9APtqGivax%2BfYfwqqdwNrqOkSxd491cebsWfqz1%2F70qV%2F9OTr5n%2F2muXOft3DGjO%2FJAxWK0WiESqUCy7LQaDRoeXkZnudBSomyLNHpdEFkgcgCFx5cr4IgdOC4PizLBr8rvvBhBeF7YYyBVArR%2F9femUdJltV1%2FnPfEntERkRm5L7U1lU0DfbC1mw9MpA6CCo6Js4cR9QGqpoeRT3qoCJ094jogAe0W6CrwWlGxeN0DnOG0TMKyYwCHqSBXqC32pesrNyXWDK2t9w7f9wXkZFrZWVXdQGV3zpR8d6N%2B27c9yLf9%2F3uby2VmJycYGryAkIourt6SFWf2CeU2zm07xBgsFAoaf8I08YORwmF49iRKJYdBgWV4iz1iWnc0gSydAHbncOUZWzhYiApyxh1owtppTHCaaxwnEho88uqVDNodPX%2B2lMVQLQbV2SQ5RnKS5M8Ob9IR88e%2BtJhRH0JIQS5jnYALIwfB%2F5sRxdsF7u4BK4oUaSCSuWJRILu7m72799PJpPB8zwKhSL5QoFCfpETtRr5QoGlxSV6%2BwbIdXaRTmeIRGJYwnpeJAGaKGq1KrOz04yPn6VUypPJZOgf2EPtsb%2B%2B3QcG9h0CIZgvOIElw8R16tQqRdxqEbc8j3CWMGQFizohoZPNVKRFnU5qKkZNauVlNGQTMSyiwsLc0Paggpz6CkOIVfn1DdGYc3Pyq%2BuPCBPH7sSTVZRfZHx8nDMXYrxoMEVntITpu9iWrVzP%2BQl2iWIXVwlXlCiAZmKYeDxOR0cHPT19WLZNrVpjcVG7Yi8tLXFx4izzc7NcuHCOwcG9DAzuobOrh1QyRTgSwTR3Thie51Es5BkfP8vU5AVMw6Cnt4%2Be3n7O%2FvPk7eFwRHXk%2BoRTqzI5NYnv1nFdB6UkJh4WLrZw0GVKbSoihqtC%2BCrIpcmKqUcggkRVBhgGhhkoP4N3ww5hhCzMkI1hN45fe04KocDAxVAuQrkIz0WYrq5FYoA0I9SEia%2BqOG6VJ0%2B5DN9%2BCNud49CNN4pnnv7uDz%2FwH0TqV%2F5KFXf%2B6%2B1iFxvjihMFrOSQsO0Q8USSZLINw7DIdfbQ2TnP9Mw0M9NTLOULTEycJZ9fYGZ2ioGBPfT3D9KR6yKRSOrlSOAevV3ocPQa8%2FOzTFw4x3KpQGdnJ319g1iV01nfWd43dMOL8WpLLFfq7G1XoEIII6LvfAUYhjaFaldNwGwSgTBsMEwwTAxMlGEG1pmQNtU2zLaB6da2Q1imhWXbmKYRSA5Kh6w3XTZ9lPSxPRfh1gk5LhHHwfM0gbmui%2Bc0th2UV0f6EtcXZLpvpMs1efqp79o%2B1iuBL1%2BN33QX1zeuClGA0Ux5p8mijVgshVKKdKaDTDZHLtfJ3OwMs3Oz5PMFzp4%2BxtzsFFOTE%2FQPDNHd3Ud7Ry6oEh5elS1rM%2BjgL5dCPs%2FFiXFmZ6ewbYve3j66unpZPv3tNEBPbz%2FSrRO1FQf7E0F8hYkwLRA2hmmCYQMWwjIRwgbT0uRh2Ppl2tCyLQxzZd%2BwwLAQwYvG2BiArjCG1OSA9JDSQ0mXkHSxPTdoc1C%2BB76jtz0H6dfB95B%2BHeXXQSo8CfFEqnH%2BfVfn99zF9Y6rRBQBhMAwTEKhCNF4EsuyicVTJJJp0pkOOnJd5OZmmJmeYnZ2hkKxyMkTzzA5eYHu7j6G9uyjv19XDo%2B3FAbejDCklFQqFSanJjh%2F7jS1apme7h56%2BwZIZzqoWTrHRMi2tdYgKA8olEIKCb6LEBWkEs1UdUIRKBKChYZhBtrH4F1o709laOlDYATthj5GBPvK2HAVpaWK1RKGUlKTiJKggrIHyteSh%2B8HfTwQFrbK4tWLjcu9Wz1sF1cFV5coIHhaG8FSJIxtay%2FLSDROPJEklcqQzXbQkcsxPTXJzMwMxdISZ8olFhfnmJmeon9giL6%2BATLZdqLRWOCJuVrCUEriOHUWFuY4d%2FY0U1MT2LZFd08fuVw3sXhCLx9ALy8CkkApJAqkWmeRECh8QEgR3OyBfiGoOKaJAWSDGIL4DBqOUc0s2wSu1wpU8C5AyYYGU%2BqPlNQEJmXQ10dJpWehJMiARJSvtw0Lw0uCriu0i11cNVx9omhCE4Z2aNLRliE7TDSaIJlM05bOks3m6OicZm52loX5OQr5eQr5RaamLjDZP0R%2F%2FxCdnd1ksx3EE8lVqfQa%2BSbOnz%2FDqRPPMT8%2FS39%2FP23pDPF4CtsOtZDACkm0Shag9I2p5Ko%2BND09QQiFaEoczf8aw2oe0HGfemyhjzMaSs9G1xUzRyBR6LkoJUHquUhkQGB%2BUBRZ6iWLkkhfYpg2WHHc%2Bm6U%2BS6uLq44UegsVcYWSwQRKDsFpmFi2SFC4SiRaJxEMk0m20Fnbp65uWmmJi8yMzPD1OQ4kxcvcPLEMYaG9rFv%2Fw309w9pk2o02syyPT11kZPHn%2BPcudMslwq0Z9upVKrUHSdIqqtnoIJ5KBqi%2FmrSWEckcoVIpFrfRyqF9CWO5%2BO4Pq6vcF0fJTTxCCWwbYjYAtvUPiJGMBMhFFKuIQqlaQKplyQyUH6unaOwohixGr6%2FK1Hs4uriihNFKBRqJJjRZLFJv4aIbqIlDMu0CIUjRKMJEok2Um0ZUqk0kUiU6vHnOHfuPJOTEyzMz7KwMMvs7DR9fYPkcl2EwiHyS4ucPPEcFy6cxXVq2CGb5eUS58%2BfJdWWxbJCeJ7XOoHgYb6xZLFKythC%2BvB9SbnmMH12hvL0ArJSBddFSU1APgauYeGFIphtceJdbaTjFpm4RSSkQ9i17LHxd66VOFr7CKVAmKvXSz%2BI%2BGXRjsvPAyB4lAfVv1zjGV13uOIOV7q4jo7wNI1LWypaJQxhmFimrfNJhKMoJVhYWNDmRdMAE3y%2FzvTkeQr5RSYunCOX6yYSiVAoLDExcR7XqTIw0E8oHKZWqzEzfRHDMHFdl3CpEHwjgbKRjQlgA6lhoz6eL5mbWmL60aeo%2BjATSkG8nXB7GMsAWakiCyXilRLZahEKUD5v8pSdJDrUyWB3jFzKIhoyAserLUhrozk2z%2BMHnCgcuhF8HADFHwBXnShGh8X%2FBgZ3cOj7R8bUD1x%2BkKvicKVf26vb0USQMEYIXUzHtBzqjsdSvki1ViOTzdLZ2Uk6ncZxHAqFItNT48xMTyCEgfQ9DFPQ29tNX%2B8A0VicxcUFLk5cYGpynFqtxoA9CbCiaGxIFBsSQkOhuLFk4XsrJHEh2oGfTNGTDZNN2rpyugAlU9TdDpZKLhcm85gzs%2FRQYa%2BXp3yyyBPn2mjfm%2BNAb5T2pEXIFGjN53YlGwIl6hX%2BEXcBcCNwYAfHZa70RL4XcNUcri6LJFqgQ8MdlhYXGR8%2Fz%2BTFCVAwODDEgRtuIJNpx3HqzM%2FPMT8%2Fx3KphOd7hOw4mWyWvv5BensGiEZjFIp5otEop0%2BfYn5uCtuYpLPxPSJQNrJeR7HuxlRKVyVXgNDLjfxSmZnHjzHduYdsW4T%2BXJRs0sYrV1maL2JlU7TFLCIhm55MiKFcmLlimonxAsbkFF1GjZv8JS48u8zXZru49WCK%2FlyYiNXw%2BmqVbDaZowjMND%2FoS49dXHO8gFaPS0NKSa1WZW5uhpMnj3Hq5HNUKiU6Ozs5cPBF7N93kFRbBt93yXX2UiwuUSkv43kelmWTSqXItneRznQQCkVIpfW7ZdmcOnWC%2BnQl%2BCaFwNC6QrX1U1tKRd31MJcW8NIZQpagVveZfPwYi7k%2BOrNxBjujpGIWAsX587NUjp%2FlZNc%2Bbr2xnb72MCFLYCUs4hGDzpTNzECC6ROz5BZnGAi5FCdn%2BGdX8sZb0vRmbUzBpXUmwbvA2OWJXVx1fM8QhVJKh4UvLnDq1DGee%2Fa7LC7MkkmnOXDDQfbtO0hXTz%2FRWAKlFG3pDuo76P5%2FAAAb7UlEQVS1Ko5Tx%2Fe9oOJ5hEgsQSQSwzQswpFYy1LIZLL8bSgATR8HLkkSjucjzp2lvlylYidIxiymT0xQCsVJpGMM5KK0xS1MoXUWJGIAzE%2FmmetN0JW2CFnaWGqbimTMIBqKkI33MP6UJDY7R1%2FY4%2FGZGkvLLl0pC2EFCs5L6kxAlza8Rj%2FaDza%2BCpxu2Q8DP7ymz0Xg6TVtk1dxTtcM3xNEoUnCpVDIc%2F7caY4fe5qZmYskE3H27NvPnr030NnVSyKRxrZDIAThcIxYLIUvvWbWap3oxmr6VpiYRKJxMpkcfX1VqmezqELwpcHafisdhZSS%2FGKJl82c4n8yRGfdxcCndH6SWv9e9rWFSMUMDBE83QXE25PkTZuE51JYdqk7Esswmje%2BQGGZkI6ZGC%2Ft5eSzFo9O%2BexPWzphrlABf11asUrDT%2BMHXZl5DTAypt7Zuj86LPqAiTXd%2FmFkTL3rhZvVtcM1J4oGSRQLec6fO8PxY08zPTVBNBJmz5697Nt3A13d%2FSSSaexQuCXDlfb2tJSNCqSCRo1S13XwXAfHqVOtVigW8pSWS0gpV26pwFNyM6WlkopK3SNz%2FgQRPC44IbqA2dOTFEJxUjGLdNLCNMQqM2YiYiBzWXIzRUpVj5rrEw0LDFaPrQTEIgZ7D3WQ6tWRqtmEGZAOG%2BhM5CaWGaHNpJeLI%2BKlKG4HbgNuQ3AQmEPfDF%2FC4G%2F4lDrX7H9Y3IlgEChwVH181ViHxZsQvC7Y%2BzhHm3S8nXm8C%2BhHscRD6k%2BD8V6B4C3NPga5psJWcAdHxL0tIzgcVR%2Fe8jvuEq8GXo7iVuBWoA8tCTyJ4gkkX%2BUzVz%2Fpz%2BiwiKCv9yuC1w8B54DH0KkMvzUypmYvMcbLgmNb8RcjY6qySX8DOLym%2BbsjY%2BrrLX3eAgy0fP4t4HHgncAdwK3XlCgaZQOXl0uMj5%2FluWe%2Fy4XxM9i2wZ6hPezff5Ce3kFSbVlCoUjTBVsFTlJSyqBSuofnujhOjWq1SrVaZrlUpFQqUCzmVX5pkaWlBZid8bUyUwArkZwbPbV9JSkUq9xem%2BeiY2GGLUBRuzBNsa2H3phJxDZWLREECtsSZPf3IOYWWXQl1bpPOmbgB%2FN2PUl5qUJ5aZl6qYZfriPrDrV4glpPmv4Om0TYQIj15LWhZNE4ne3iXSKLyZ8AP7%2FBcWngBuANSD7MXeJ%2BYvwOH1NVBO8EXgNcAD6%2B5rg3Ae8DwOdhggXedmcEvArBOeBPg%2FN5JXBPs0crDypeD7y%2BpaUMbEwU7xb9GDwILaSzgjcAb0CH7dQ5LO4jz0d4RPmXMfdtY3RYDAOfYb3J9aXAjwfb7uiw%2BCPgQyNjytlkqLcA961p%2BwKwIVGghYFPrWm7H%2Fh6y%2F57gR9p2b8HeEfQDqCuKVFI6VOtlJmamuD4sWc4d%2B4UKJ%2F%2BviH2BSSRTGaw7RCNyFDp%2B3i%2B15QY6vUa1WqF8nJJk0J%2BkWKhIPP5JUqlgqrXqsrzXOW6jt%2FuLFVpuB0EGsC1yszGtudJrJlposLnxHKYtqxFveoga3WMzhCxSMvTv%2BlRqT0tM202%2BUyKSL3CciVKUbgsTy1RnS2iiuUglkPDCF6lgse3puHNt7WxtyuEbcL65dAaxWZDktiuQHFEvA2TTwHdLa0TKB5DcArBIRS3Ab1oNcmvUuaN3C3ueB4%2F805QZzXZGECy5bNWn%2FXyuqOFEBzmMAYfAVJBqwJOIXgCxUX0DXobkAXCCD5Mhp%2FmPeKX%2BJRaq3fYMUaHRRL4KHBkG91t4APAT40OiztHxtS3rtQ8LhOH0VJXE9eMKHzfp1KpMDU1yYnjz3L2zHE8p0Z%2Ffx979x%2Bgp3eAeCKFAqrVCq7jrJBCeZlKucTyclGVl0uUSgVVKpVUoVCQhcKiVyqVvGql6rtu3bdty89ksjKdbnPTFZWgTlMJCGxqDq3UXJLFRQDOOTbxsEFtsUBFaI%2FKiL2y5PCVQvl%2B04piG4JQT5ae58apPpVn2nNwQmHmXYOCF6XqQt1T1H39qrmKt%2BXqzM05zORderO65umlPDZVoEtRyI0u8WocESPAIy0tX0JyF59WZ9f1PSwOIngI%2BFfAS5B8AYjs9Le%2BbBxVn0E%2FfRvzuQnRVBr%2BMUfV7215%2FGF%2BhYZ0ovEZfN7HZ9Tiur7vFq%2FH4GFgP%2FByJF%2FhPeJGPrX1EmA7GB0WFjo%2FyCsv89CXAP8yOixeNzKmvvF857EDrEtX8IITRWPJUK1WmJme5Pixpzlx%2FGkq5SK5XI7%2BgUHa23OYpsXycgnHWaBSXqZUKlAo5FWxkKdYLFAo5GW5vCyrtYqsV6u%2B73uelNKt1ar1SqVS8zzpAK5hRN1YLCp7enq8xPhykjqrgrnUBjEUUknqjg%2BuDzbMyCgHQwbOXI2abwQxG%2FpcPF9Sq7lkpiYo1iWFsstiwcGvO5iey4lKhFA8Qc6EiAlG1MKxonRFDUKWJhtDSQ6VL%2FLRzir%2FdS7KQIdFb8ZCJ%2B1ukINcNcdmm%2FKDILItcKfIYfOJYM9B8Cs8qB7atP9D6gRCvCG44T4WiPvfH7hL3AD8YbA3D%2FwcR9WXNu3%2FafU1%2FqO4BZdPIHgHkEVyP%2FDvrsBsfpeNSeI08H%2FReoAh4Ha0RaV1MWgCnx0dFreMjF3T2rLPAE9eNaJYUTBKpPSRvo%2FveUglqVarzM5Mcey5p3n2mSdZWJihLZUkk0ljmib5%2FBIL84tquVymWFxSxUJBFUsFVSmXlefWleM6frVScSqVsuO6ruv7yg2HbTcejzupVKpmWVZdCOEqpbxIJOKHw2HV2dkpa6fmKxK0scDQ6sXNRHspZfP%2B64jq4kC%2Bpy0sZmBZrSzXsE6dob1cYCjsMV%2BH%2FHKIR2ttyHAbabNEt1nmrBfmzu4SUUPywEI7PRmbAz0hEpYkWS6TKpfYF1I40uPpZ6v0t1tkYoJERDTns%2BnyQ25DorD4JJDTPwz3cnQLkmj9AeF%2Bjoge4Ld39EfwQuM%2BYSB5GEEsaLl7S5Jo4BNqmbeLO8nwUrSy82c5LP6Kh9Tf7XQqgdLxA2uaJfDHwAfW6iBGh8W%2FAT4LdLU0HwI%2BBPzmTufxPFAG3jkypv47XCWJoqFg9H1drLhWLWNaYYRRoby8zOzsDKdOHefZZ55kemqCcMgiEY%2BqQiFPpVrF96SqVGtyebnoFwsFr1qt%2BI7n%2BgLlJeIJP5VKupaZqHqeX%2FV931HK92zb9hOJhN%2Fe3u5Vq1XP9325tLSkAJXL5Th8%2BLD6k68ckWAEuSEC8%2BhGFg%2BltId3oMc4ZFWYcn2kYWLj4%2FmK4kKJ%2BW88A57PvhSUDUHRFXxj0aIeM3lRd4SQGSF1vEgmWmXZE1SVYLlQI9EeI2wJBktLdBaXiEqtPwsZMJ93WSh5uL5EKgNjy%2BWHTnCjtpIo7hKvRvAzACi%2BSZ6PXNaPGeZe6rwNeNHl%2Fh284LjIWxG8Ntj7W46q0W0f%2B4jyuUscRvENwETwYWDHRIHWS6y9v353ZEz9l406j4ypfxgdFncA32H1Mu%2FXR4fF%2FSNjavx5zGUn%2BMMGScBVIArf93Ech0qlokqlIouL89RqdSx7jlrdYWZmmrNnTnP27Ck1M30Rz3VUMpmUvu%2BpxcUFhRBSSeUJYfhK%2BfXl5eWq67p10zQ90zSdUMj2crmcF4vF3IWFBWd8fNyv1WoynU6rbDbLoUOH5Je%2F%2FGUeeeQRJYRgo5Kc64LCNlAaWgacJslrWOLWWJWpfAHXsokrj7zjUVRhqpi4nuJCVfDOJ6K8phvetcfhpsQMX0VRTGUpRyPkix5fdm1%2BtL3OsbLFkA1Jt0quVGiSBEDdh6GIT6Xua%2Bct1XAz33iOUiqU9EBtIVFIXtkUaAUfuGyt%2Fv2qzhHx%2B8DnLuu4awHBy5vbRovVZLt4UH2bI%2BILwE8DN3FExDi6sdlxK4wOCxN41Zrmx9DSxKYYGVMnRofFB2EVmRtoc%2BgLTRRHW3euKFFkMhkMw1Ce58mFhQV55swZf35%2BQRiGvqHK5bLOLzF1UeWXlpQQUkYiEa9cXq67ruNGIhEVDoc90zSdtrY2N5Foc2KxWNVxnHokEvFd1%2FXi8bhMp9Myk8morq4umclkuPfee5tsoJTi8OHDze3N0eJHseYGNIQiEhLUMxm%2BemGGOzJ1fso9wz%2B5WfKGol6o4GfDzPXv4bFTRUQN3vKqCD2ZEF%2Bq%2BVQqU9wSmuez0zHa4zG6qwt8sxymo1eSiJpEbJO22jKxNXkkFh24WIF%2BX%2BBLE53Ut%2BGoJbUzVjBXIXRyHKRCiC2IQnBr49IAj%2B7oh935cS80bgve68h1HpPbxeNoojDQlpGdnPtN0Fz%2BNPBXI2PbIuk%2Fh3VS323A53cwj52iODKm5lsbriRRqP7%2BfuU4juu6bnVxcXE5n8%2FbQhhI6eP72rxZr9epVCo%2BKD%2BdTnupVKruum65Xq%2FXfd%2F3bduW4XDYS6fTfjab9S3L8mZnZ%2F3Ozs7AMwpqtRqHDx9ussA991zew0MIAYYZFP8FpVqSTRp6PxKyGMzF%2BMpEN%2B3FCW5K%2BfxIaIH6IDxbnuJCNcKNgwkGuyJYpqAtahENC5arHv3npni6YDPpuGQyMQQL1B1JwlTc3V3EqfgIf%2F3fzIeeENQNi2xSh54LQye50S4VJg3JokkWhvbkbKTB2QS3BO8nL8sRqhVH1WmOiCW%2B9yMjNSkKnuZBtbNsPoqnWlSKt7AzothIgfn4dg4cGVOLo8PiPFrJ2cBtm%2FXfBnbitruwtuGKShQHDhyQCwsLtUKhsDgzM1NfWloyy%2BWykFJiGAaxWIx4PK7a2lKeUsrNZDJeR0eH47puvVQqeUIIGeTCVJ7nqc7OTrW4uKg6Ozu599571dYSwvahQGfdFiY6Ya5CqUbYuTZLGoZBR1uYQzfkeOAJePH8LEf2VAkbcGvS4ZbScc5V00zn%2BjAzSUKWwDAUycoyQ6LC54ppYimTeEcUf8IgbiruO5fmrdkyrzWXoCWHTt2Hx%2Bbh8xdMXnUozL7uKPGojWmuxHzod1ZIQgVE0eJE4csNGWNv8D79PC%2FbJFeDKNQGZU52gvuEAXQEY%2B483kJxbiVfYfPaXS7SG7RdzhJmLaH3XKL%2FWumlFfHL%2BN5NccWIQinFfffdp8LhcF0IIYvFYmVqakoUi0UBOvNVMplUHR0dJJNJ6bquF4lE5ODgoKxWq3J6elrddNNNAOuWEnD5UsNG8HxdJ1in5jdbEuGuwAhuSENAKCzY2x3jR17eyZOnw%2Fzis4vsVyXeMeRwMKXY6%2BXZM5XnwlyKqc4%2BRDzKSy6eAeCpZZvX7gnTkYkylUyS9hyyMcWN8fWSxNNL8NGnBB1tIV66J05fe5hwyGp6ZzbJIlC%2BNsjCMBsJ9fQZOJ6yhRCmUqtE3OPoNe7NbKa0uRTeLkJkOLjp54Jqc9skelljC9ovez4b4R4lOSKeRUsBN%2B14HJO9zT8Ig5M7HGWjyvK3bNK%2BCqPDIozOhdGKJ1q2SxsclmV1AFsrUpu0XxauqERxzz33qPvuu0%2FG4%2FG6aZqOUkpUKppI0%2Bk0qVSKjo4Ouru7VXt7u2ocs%2Fbv90qQwkYo1bEy0Ua%2BDCuo8tXIkt0MJtXvAixMEjGT%2FX0m2VSI%2Fb1xTl5c5n3nS7w1PMdrOySH0opBr8jgZJEaJhH0Pfq7%2FXmSskJ00uAlHS6d7TVMUV03J1fCN2bg0SWLV78oyqH%2BOKlYCFOvNJrKzBVdxQppaOX8SkiY42MBIaD1i55AE0Ub72Q%2FcOqyL1yaF6O9BjeGYrLlKdwFHLuM0bsv3WWbEDyJ4hZgL%2B8VKe7fQdU0xUta9r6zw5k8hjaFtkp4b6LViWxz3MH6a926%2FJlnPbJbjNexje%2B8JK641eOee%2B5RAEKIVU%2BuyclJJicneeyxx4DVisYrtaTYCkII8z%2F9GDbRFR1F0%2FIhdNCWJEilqYJ6HsF%2BJGSRazNoS4QY6orzooEk3zoWZXJighcvuRzKCl7SppokAfBDKRdwoWEt30C8lgqqHnzutGBvZ4Tb98foyUawbFOLNA1igI0lCyNYOgVmXC8gCiGEp1SwRtcuyxomP8pOiELwxkv0mGrZvpSYvIJfEmlCV0Y0BkDyZHCdBXVeD1x%2BSjrFK4IxfOo7U4iOjKnS6LA4Bry4pflnR4fFQyNj6v9tdlwgTdy%2FwUffbNme2%2BDz1wNf3GTYt15qvtvB9mv1XSZaIzo3el0D2DVXE6NecegKXga6aI8K3lFBdKqhSwgqYaAQmJZJOGTRmYlw05423viyLpYH9vK1Yoyn5xVfmd7%2BQnuxBn97Hp5agotV6EpZfPw2l9tSPlKCVFp%2FYhgmhmFhNrdNTMMK3s0gJylBBXjwJBb6abTyAJB8DZoeWR8KHKi2j%2FeIPuCDW%2FYRLToBwfC2xw7x7y9rLpeCwT%2Bxcq4f45fE5bmd3yXuQPATACge4%2BHn5RH5iQ3aHh4dFi%2FfoJ3RYZEC%2FoL1%2FirfZLVkM7PB4e8cHRbr9BSjw%2BIlwF3bm%2B7WuOZh5i8gTNdHVwlGE4GWLLQSExXEiRmAXKnJIRrrEpTOPCUFkbBgsDOObRo8HrP4wvE59hTz3JB06d3k%2BaiA00U4tgTLLkzXBN9eMvjVG30%2B8xoPw5T8fcGl4FXZN2SRS9pYVnAgLTkq1MpSwzAtTWoB3%2FsSE%2F2bWkIIQykleUg9wxHxceA3gDSKTwFv2%2FZV8%2FkE4hLr3CW%2BQ4ZxdGTkCO8Vv35Jsf%2FtwiTDL297HtvBg%2Bo7HBH3A78GHCTEB4D3b%2BvY94owiofQsp9ENCMnd4rGdW4lzkHg66PD4mPoGJDvAv3opeFvA3vWjFEBfn6NWfVJ4CQ6yreB7mDc3wzGHEBLGfewsWL1snFdEIXQ5o0mUQRGUbS5UW8bwVMZia7H0VTGN%2ByTIlAgaj1GNGTQn4vSqSrk0gM8eTrJgxOz%2FOdDy3z6GGRCEA6uri9hugJTVcFMTXC2anHRD3NzTvD5GY%2BapzjuRakg6O7yyVUk2YTAFtqPAlaUmKvOK5AoGnMPrB4WOk5AFzoFcPg9QrwZeDGCn%2BSI%2BDvg3RxVU2wGnSL%2FKIKfDFpcNtNTPKJ8DosHEHwUSFLnyxwRP8ZRtdF6Gt4rUmR5BLVKNL9SeD86bHs%2F8NscETYOH9xSOjgiBtHu04cAEDzAg%2Bp5%2BY6MjCk1OizuBJ5i9c1qo0Py37eNYX5rZEyd2GDcP2N10BvAzcDY85jylrguiAJ905ieDCQKwUqot7Gij2j2bDyjFYGrdEuJr%2BCGNdw6hlRk3TI37umjtyPGubMh4BgPnovhWTaxsBkoTrXgYhgC0xa0pS3e0BFlsDNKXsDUTBnLEPRGLPpyETKpCHbIxjADpzDYMDmNCCSKholUKX2ewWtlLfSwqvFu8Q4Mvoo2pb0FeJq7xPsx%2BEe6OMk9gXvnu8QQFq9H8RFW9A2fQNvyX73pFRZ8Gp2%2FYAD9hPwad4nfQPHNJmG8S2QxeBWCj6AjJGfQWvydZLveGEdVhbvEnSi%2BiHaF%2Fi1CvJW7xO%2Fg8i3%2BXOllkg5F3xcslf4IaAtGOEllm1LIJTAypiZGh8XbgL9kdWKYS8EDPjIypj65yecPA7%2FA9v0rgj%2FineN6IQoBiEaCq2b9TqFL%2Fa1YPETTiiAb4n5AJKppXRD4nkd08gLZpTlS9RLp%2BSmkbXN7yKXsmOwdynLzgTayiRCuJ1GAbQnCtkE0bBIJGSSjNsmoiQLyQylcT2Fb0Ba1ScZNbNNoropYRxJ6X5gmhhCoYOkhVTO9RZAUtAWfVo9xt3gpPkfRGvgsik%2FhA5OUOSKOA0OYtLP66%2F6SXt7LJF%2Fb8gofVQXeLV6B4PNBvMWLUIEy8Yg4CziYHGyZl4%2FgThQf5EoSBcCD6qvcLW7B5zPA64AbUfwvLOCImAfOcZiDQGrNuT5MmF%2FjqFqf42KHGBlTXwl0BR9DZ4y6FL4D3DkypjZ10AqUpa9H6zT%2B7RZjuegkN6%2BEQPeyQ1xXRLGyY6zcfEIQ5KkKOgmUUEFhYu3wJAyaegqkoK4EeTdEuRonUvE5rtooZrpQyufCYoUDfRa33dBOVyYCSuIrgSnAsgwsi6B%2BiX5XSpJJRPCDUoKG0ahvorTeBLXps8BYs%2FRQK%2Be58RGfVGeAYY6IX0DHHTRMZ3HWP50WgN%2FgqPpvABzZxgPp02qGt4t%2FTYYH0JmrGsrytY5LU8DP8aD6R46IrRWlO8Un1XGEuIPD3A38ASsSQwfrTYYXgSMc3bJwTx34ypq249uZysiYKgLvGh0Wf42%2BYV%2BG9qtIAD7wHNqk%2BnXg4ZGxS3uVjoypyuiwGAHuRmenehUrkafTaF3F%2B0fG1LdHh8Xvs3L%2BwDr%2FkO%2Bikwc3sM5hTVwjC8QLCiFEGEi847W88tZB4%2F8Mv%2FlnaB%2B6GSd%2FDrc8H%2FRp4Q7V0FOo5j40nu6CmuuxeHGBR8%2BUiCxMM2skSHdliUVNpIRsMsSBviRtCTuoBcKK74PRiDJZj0aC3vUSxCbnZZgYoQT1coEvfukfOLfAB%2F70S%2FJzwDJQUGrTdGpa9D7CgcDv4GYEL0ZSQjCNzkD9JY62%2FMG%2BR9wKtOFR49PbSKbyDhEnzG0YvBydr1JgcBHJVxB8sTn2EXEbBikkVY5uohc4ImIYgVu0x%2FkNk%2B1sBa04vQHFLQhuRnEAwSngcXye4M85%2FUKb4oJclnuAqZExtd7BZmdjDgDlkbENEvQ8T1wvRBECEr%2FwOl55y4Dx929880%2BTG7yZen4cWVkEoYJCwATOi40I00CJKVTz5lVK4Lo%2BS8sOZ6eXmVqokorZ9HZEScVDhExBOGwSC5mYho7XWM1Aq2ZGUwfRbGsoLzd%2Fgjd8SYUwwY5qovji33N%2Bgd%2F7kxWiKG5JFLvYxWXgell6SEDWHZ1f0fddUD5mNI1pR2m9WfU9HSg61cpTvqkrUBJTQXvcI9rmMlRxiYZN4tEQIbtRdFgvW5p6jYaJs5ljszEWTduECv6teFq2MopqjtG0gUiauT9VEKrueiw3znXlJHaxi%2BeP64ko%2FL%2F5JidfsU%2FMnj3%2BTK5z8KXCNCMoK6xjJ4IbsXHL0uIB2Ug%2F14AhFVZYEYlJ2lI%2BpiEwgkhPPYxs%2Bj00ZYZgOWOimiZYoUA2dBGqlSBWTKI0UnIpQEgtTShQhp6XUpK52WkA%2BehZ%2BS9ojbnPLlHs4griuiAKpZQUQniAV66p%2F3H%2B%2FJm7q3%2F7WTq7OoMq4q1ifsPBClByJfCjISGoRn%2FVekTz%2F8YnQptOgixZLRILjYhQmqUAN7RdrZpCoGxdiaegobosFIqMj49Trat%2F%2BvZZZtFE4Sm1VTabXezi8nBd6CgAhC6THo9B7H0%2FZdybivCLVyS8%2BXsAlbr65wf%2BUf3y9CIFtDdfRSlVv9bz2sUPDq4bogAQQsSAKNoRJ8xWEZHf%2B1Do%2Bftoe7mDrndRRRPFrkSxiyuG62Lp0QKHFa9FBc1wz%2B9XtvTQuggPfW51wNkliV1caVxXRKGU8oQQDZG8lSi%2BH28sgf79%2FODlAPVdk%2Bgurgauq6VHA4Ffhc1K8NRVqTd5ldFw125IFO4uSeziauG6JAoAoSseW%2Bgn8%2FcjUTSWUBLw16S%2F28Uurij%2BP4dVQiup8F5NAAAAAElFTkSuQmCC',
	//send:		   'data:image/gif;base64,R0lGODlhEgASAIQDADs7OxBpAI6OjjH%2FAMLCwtHR0dbW1tvb29zc3OLi4uPj4%2Bbm5urq6uzs7O%2Fv7%2FDw8PLy8vX19fb29vf39%2Fj4%2BPn5%2Bfr6%2Bvv7%2B%2Fz8%2FP39%2Ff7%2B%2Fv%2F%2F%2FzH%2FADH%2FADH%2FADH%2FACH%2BEUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAB8ALAAAAAASABIAAAV74CeOZGmeaAqsq8pGDqMA53oojERVEkSXAANi4ZhcBEjM5jdaMZDIzUYjZTYll4wUKsBYRQAMd2ORLk0AqtmCDLi%2FH8BmvAkMAvC0emu%2FB4ATAm6DbgN%2BJAAPE32GjYZ%2FiAyEg4%2BQTQcJDWUAfW5oBAUsH3aWQKIigyMhADs%3D',
	//sendMessage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAKLSURBVDiNfZPNbxNXFMV%2Fd2bMjDtYiZMYJRhivgoxiRtACV8SXXRLhdQdUrsICzb9D5DYVwWxqopYtkLdFLGBVt1WbVWh7mhiywgFMFEkKLKdEI8%2F5uPdLpwEVTE90tu8d9%2B595zznqgqg9BqncqJRCcskmlgHEbVUK84sf2nO7S4vFUngwiC4KMSxlwU0QNgJrq16iUAt1D8TdA1FetH3y%2F%2FAODs7Dw7I8bkxTJvgdlurXo2e7yDiEejLB97halVUd0TbMyk%2FMzSd%2F%2BZoNmcG3JTncvdWuXO1t7Q1F9q2%2FMCoLqmzUpWts52FYolVHV7tVrTJ%2BpLaBz%2B%2FMyY0Oj%2FIImfhPUl7smNWzc%2BtYW7URwNFyZXye99zfTIfbLHI0R2KNxGoyxE2flHjkmi7xeuXB3OjeUIw19Q85hg%2BT5h7zq73K8QkR2Xk6TSN7vjzVnGmBHPdXn40wNsywdsvAOfEyx%2FjZrmwO7r1WncQokg8BzLsiw%2B8H0OHTrMr78vYVkZRDL9jK3MeyUIWV79k8MCEBH25fPkxk7yePEltjXeL5IUqh0aZaFRFkzy5h2BTPCilt98Bwq2Y7M3f4SVlZNUqn9QnLpGo9zX7xVKQMRadQ8A7uSXWM4nNBpP%2BgSqSpzE9LodOt1xDk5%2Bxt%2BL99jtf4HrbuDUOwwP%2BcRjR0mlRuhF53DTl4CbmwQo7aBFc73J%2BTMXaLcDPG8%2FIk%2Bx5DnQwLY9RvwPefrMJZ0%2BQmbTnj6BUZLEMFOc5e3GOiZJQLIop0l0vh9dDL0IisdGeV5bRtX0CZyUU0%2BSeHT%2FvgJRFJL20ttG7fxmShj2OFg4TLvTxkk5dccYWfj29jd34yQefm9mA%2BDYzppBFv4FO4Au%2FTAT%2FmYAAAAASUVORK5CYII%3D',
	
};

/* translations */
$.gctour.i18n.de = {
	'name' : 'Deutsch',
	'language' : 'Sprache',
	'addToTour' : 'Zur Tour hinzufügen',
	'addToCurrentTour' : 'zur <b>aktuellen</b> Tour hinzufügen',
	'addToNewTour' : 'zu <b>neuer</b> Tour hinzufügen',
	'directPrint' : 'Drucke diesen Geocache',
	'moveGeocache' : 'Verschiebe die Koordinaten',
	'movedGeocache' : 'Die Koordinaten zu diesem Geocache wurden verschoben!',
	'moveGeocacheHelp' : 'Hier hast du die Möglichkeit die original Koordinaten dieses Geocaches durch Neue zu ersetzen. Diese werden dann in der Druckansicht wie auch in der GPX verwendet. Praktisch bei der Lösung eines Mystery.',
	'originalCoordinates' : 'Original Koordinaten',
	'newCoordinates' : "Neue Koordinaten",
	'showCaches' : '<b>Angezeigte</b> Caches:',
	'markedCaches' : '<b>Markierte</b> Caches:',
	'removeTourDialog' : "Soll die Tour wirklich gelöscht werden?",
	'logYourVisit' : "Logge deinen Besuch",
	'removeFromList' : "aus Liste entfernen",
	'emptyList' : 'Die Liste ist leer.',
	'notLogedIn' : 'Sie müssen sich auf einer Seite von geocaching.com befinden und dort angemeldet sein.',
	'printviewTitle' : 'GCTour - ' + GCTOUR_HOST,
	'pleaseWait' : 'Bitte warten - Daten werden geladen...',
	'newList' : 'Neue Tour erstellen',
	'sendToGps' : 'an GPS senden',
	'makeMap' : 'auf Karte anzeigen',
	'makeMapWait' : 'Verfügbarkeit der Karte wird getestet.',
	'reloadMap' : 'Karte neu laden',
	'printview' : 'Druckansicht',
	'print' : 'Druck starten',
	'downloadGpx' : 'GPX downloaden',
	'showSettings' : 'Einstellungen anzeigen',
	'settings_caption' : 'Einstellungen',
	'settingsSelectLanguage' : 'Sprache wählen',
	'settingsSelectTheme' : 'Theme wählen',
	'settingsPrintMinimal' : 'Minimierte Druckansicht',
	'settingsLogCount' : 'Anzahl der Logs in Druckansicht',
	'settingsLogCountNone' : 'keine',
	'settingsLogCountAll' : 'alle',
	'settingsLogCountShow' : 'anzeigen',
	'settingsEditDescription' : 'Beschreibung editierbar',
	'settingsRemoveImages' : 'Bilder bei Klick entfernen',
	'settingsShowSpoiler' : 'Spoiler Bilder anzeigen',
	'settingsAdditionalWaypoints' : 'Eigene Wegpunkte anzeigen',
	'settingsAdditionalWaypoints2' : 'Eigene Wegpunkte auf Titelseite einsortieren',
	'settingsLoggedVisits' : 'Log-Counter anzeigen',
	'settingsAttributes' : 'Attributes anzeigen',
	'settingsDecryptHints' : 'Hints entschl&uuml;sseln',
	'settingsSendToGPS' : 'An GPS senden',
	'settingsShowGPX' : 'GPX anzeigen',
	'settingsDownladGPX' : 'GPX download<br/>',
	'settingsGPX' : 'GPX',
	'settingsGPXHtml' : 'Beschreibung mit HTML',
	'settingsUploadTour' : 'Tour upload',
	'settingsGPXStripGC' : 'Entferne "GC" in GC-Code',
	'settingsGPXWpts' : 'Additional-Waypoints exportieren',
	'settingsGPXAttributestoLog' : 'Cache-Attribute als erster Logeintrag',
	'settingsFontSize' : 'Schriftgr&ouml;&szlig;e',
	'settingsPageBreak' : 'Seitenumbruch nach Geocache',
	'settingsPageBreakAfterMap' : 'Seitenumbruch nach Übersichtskarte',
	'settingsFrontPage' : 'Titelseite',
	'settingsOutlineMap' : 'Übersichtskarte für alle Caches',
	'settingsOutlineMapSingle' : 'Übersichtskarte für jeden Cache',
	'settingsShowCacheDetails' : 'Cache-Listings und eigene Wegpunkte drucken',
	'settingsDecryptHintsDesc' : 'Die Hinweise werden schon mittels Rot13 auf der Druckansicht entschlüsselt.',
	'settingsPrintMinimalDesc' : 'Beinhaltet nur noch Hint und Spoiler zu jedem Geocache.',
	'settingsEditDescriptionDesc' : 'Die Beschreibung lässt sich komplett nach eigenem Belieben anpassen.',
	'settingsShowSpoilerDesc' : 'Es werden die Spoiler mitgedruckt.',
	'settingsAdditionalWaypointsDesc' : 'In der Druckansicht findet sich eine Tabelle mit allen "eigenen Wegpunkten".',
	'settingsAdditionalWaypoints2Desc' : 'Eigene Wegpunkte werden auf der Titelseite in die Cache-Tabelle einsortiert. Ansonsten wird eine eigene Tabelle angelegt.',
	'settingsLoggedVisitsDesc' : 'Eine Übersicht wie oft der Geocache schon gefunden wurde.',
	'settingsPageBreakDesc' : 'Es wird nach jedem Geocache eine neue Seite angefangen. Sieht man erst beim Ausdrucken.',
	'settingsPageBreakAfterMapDesc' : 'Es wird ein Seitenumbruch nach der Übersichtseite gemacht, um das Deckblatt abzuheben.',
	'settingsFrontPageDesc' : 'Es wird eine Titelseite erzeugt mit allen Geocaches, Index und Platz für Notizen.',
	'settingsOutlineMapDesc' : 'Auf der Titelseite wird eine Karte mit allen Geocaches in der Tour angezeigt.',
	'settingsOutlineMapSingleDesc' : 'Unter jedem Geocache erscheint eine Karte mit seinen "Additional Waypoints".',
	'settingsShowCacheDetailsDesc' : 'Alle Geocache-Listings und eigene Wegpunkte der Tour werden mitgedruckt.',
	'settingsGPXHtmlDesc' : 'Manche Geräte/Programme haben Probleme beim Anzeigen eines Geocaches mit HTML-Formatierung. Wenn du nur noch kryptische Beschreibungen siehst, dann Bitte diese Option deaktivieren.',
	'settingsGPXWptsDesc' : 'Additional-Waypoints werden als extra Wegpunkt mit in die GPX exportiert. Damit hat man jeden Parkplatz direkt auf dem Gerät.',
	'settingsGPXStripGCDesc' : 'Alte Geräte haben Probleme mit Wegpunkten deren Name länger als 8 Zeichen sind. Wenn du so ein altes Garmin hast, dann bitte diese Option anwählen!',
	'settingsGPXAttributestoLogDesc' : 'Cache Attribute werden zusätzlich als erster Log eingetragen.',
	'settings_map' : 'Karten',
	'settings_map_geocacheid' : 'Geocache Code anzeigen',
	'settings_map_geocacheindex' : 'Geocache Index anzeigen',
	'settings_map_geocachename' : 'Geocache Namen anzeigen',
	'settings_map_awpts' : 'Additional Waypoints anzeigen',
	'settings_map_awpt_name' : 'Additional Waypoints Namen einblenden',
	'settings_map_awpt_lookup' : 'Additional Waypoints Lookup einblenden',
	'settings_map_owpts' : 'Eigene Wegpunkte einblenden',
	'settings_map_owpt_name' : 'Eigener Wegpunkt Name anzeigen',
	'settings_map_geocacheidDesc' : 'Es wird immer der GCCode (z.B. GC0815) mit auf der Karte angezeigt.',
	'settings_map_geocacheindexDesc' : 'Die Postion innerhalb der Tour wird mit angezeigt.',
	'settings_map_geocachenameDesc' : 'Der Name eines Geocache wird zusätzlich mit eingeblendet.',
	'settings_map_awptsDesc' : 'Wenn aktiviert, dann werden die "Additional Waypoints" eines Geocaches mit angezeigt.',
	'settings_map_awpt_nameDesc' : 'Der Name eines "Additional Waypoints" wird mit angezeigt.',
	'settings_map_awpt_lookupDesc' : 'Der Lookupcode eines "Additional Waypoints" wird mit angezeigt.',
	'settings_map_owptsDesc' : 'Wenn du "Eigene Wegpunkte" mit in deiner Tour hast, so werden diese auch mit auf der Karte angezeigt.',
	'settings_map_owpt_nameDesc' : 'Zusätzlich kann man sich noch den Namen zu jedem Wegpunkt anzeigen lassen.',
	'settings_map_gcdeDesc' : 'Wenn das aktiviert wurde, wird automatisch zusätzlich zu deiner Tour, die Karte von Geocaching.de mit eingeblendet.',
	'loadTour' : 'Tour laden:<br/>',
	'openTour' : 'Eine Tour laden',
	'load' : 'laden',
	'removeTour' : 'diese Tour löschen',
	'deleteCoordinates' : 'Koordinaten löschen',
	'copyTour' : 'Tour kopieren',
	'copy' : 'Kopie',
	'newTourDialog' : 'Bitte gib einen Namen für die neue Tour ein ...',
	'rename' : 'umbenennen',
	'upload' : 'Tour hochladen',
	'onlineTour' : 'Tour runterladen',
	'webcodeDownloadHelp' : 'Bitte gib hier den Webcode an, den du von deinem Freund bekommen hast und drücke dann auf "Tour runterladen".',
	'webcodeDownloadButton' : 'Tour runterladen',
	'findMe' : 'Finde mich!',
	'webcodeerror' : 'Der angegebene Webcode existiert leider nicht!',
	'tourUploaded1' : '<br>Die Tour wurde erfolgreich hochgeladen! Der Webcode lautet:<br><b>',
	'tourUploaded2' : '</b><br><br>Die Onlineabfrage kann unter <a href="' + GCTOUR_HOST + 'tour" target="_blank">' + GCTOUR_HOST + 'tour</a> geschehen.<br>Wichtig: Bitte Webcode notieren um die Tour wieder aufzurufen!!',
	'webcodePrompt' : 'Tour download\nBitte gib einen gültigen Webcode ein,\num die dazu passende Tour zu laden:',
	'webcodesuccess' : ' wurde erfolgreich geladen!',
	'webcodeOld' : '\n    !!ACHTUNG!!\nEs handelt sich bei diesem Webcode um eine alte Tour. Um sie auch mit den Vorzügen von GCTour 2.0 nutzen zu können musst du sie bitte jetzt erneut hochladen.',
	'printviewCache' : 'Geocache',
	'printviewFound' : 'Fund',
	'printviewNote' : 'Notiz',
	'printviewMarker' : "Eigene Wegpunkte",
	'printviewAdditionalWaypoint' : "Zusätzliche Wegpunkte",
	'printviewRemoveMap' : "Karte entfernen",
	'printviewZoomMap' : "Diese Karte in einem neuem Tab öffnen.",
	'settingsMapType' : 'Standard Kartentyp',
	'settingsMapSize' : 'Standard Kartengröße',
	'addOwnWaypoint' : 'eigenen Wegpunkt hinzufügen',
	"markerCoordinate" : "Koordinaten",
	"markerContent" : "Inhalt",
	"markerType" : "Typ",
	"markerContentHint" : "wird in Druckansicht angezeigt",
	"markerCaption" : "Beschriftung",
	"save" : "Speichern",
	"cancel" : "Abbrechen",
	"close" : "Schließen",
	'install' : 'Installieren',
	"edit" : "bearbeiten",
	"example" : "Beispiel:",
	"exampleCoords" : "<i>N51° 12.123 E010° 23.123</i> oder <i>40.597 -75.542</i>",
	"dontPrintHint" : "<b>Hinweis:</b><br/>Elemente in einem solchen Kasten werden <u>nicht</u> mit gedruckt!",
	"SCRIPT_ERROR" : "Es sieht so aus, als blockierst du benötigte Javascript-Quellen (z.B. durch das Firefox-Addon NoScript). Bitte lasse 'geocaching.com' dauerhaft zu, um GCTour zu nutzen!",
	"mapHeight" : "Höhe",
	'mapTypes' :
	[{
			"caption" : "Google Karte",
			"value" : "roadmap"
		}, {
			"caption" : "Google Satellit",
			"value" : "satellite"
		}, {
			"caption" : "Google Hybrid",
			"value" : "hybrid"
		}, {
			"caption" : "Google Gelände",
			"value" : "terrain"
		}, {
			"caption" : "Topo Deutschland",
			"value" : "oda"
		}, {
			"caption" : "OSM Mapnik",
			"value" : "mapnik"
		}, {
			"caption" : "OSM DE",
			"value" : "osmde"
		}, {
			"caption" : "OSM Fahrrad",
			"value" : "osmaC"
		}, {
			"caption" : "OSM ÖPNV",
			"value" : "osmaP"
		}
	],
	'updateDialog' : "<div><p>Es ist eine neue Version von <a target='_blank' href='https://gist.github.com/DieBatzen/5814dc7368c1034470c8'><b>GCTour</b></a> verf&uuml;gbar.</p><p>Du benutzt Version <b>###VERSION_OLD###</b>. Die aktuellste Version ist <b>###VERSION_NEW###</b>.</p><div class='dialogFooter'></div>",
	'updateCurrently' : 'GCTour ' + VERSION + ' ist aktuell!',
	'switchSite' : 'Um diese Funktion zu verwenden, bitte auf eine der anderen Seiten wechseln, z.B.',
	'saveSettings' : 'Touren und Einstellungen sichern',
	'saveSettingsDesc' : 'Sicherung / Wiederherstellung aller Touren, Einstellungen und durch GCTour geänderter Koordinaten:<ol><li>Im Firefox-Adressfeld folgendes eingeben: <u>about:support</u></li><li>Bei <u>Allgemeine Informationen - Profilordner</u> auf <u>Ordner anzeigen</u> klicken</li><li>In den Ordner <u>gm_scripts</u> wechseln</li><li>Wichtig: Firefox jetzt schließen</li><li>Die Datei <u>GC_Tour.db</u> sichern / wiederherstellen</li></ol>',

	// redesign begin 05.2012
	'settings' : {
		'gpx' : {
			'maxLogCount' : 'Max. Anzahl der Logs'
		}
	},
	'autoTour' : {
		'title' : 'autoTour',
		'wait' : 'Bitte warten - autoTour wird erzeugt!',
		'radius' : 'Radius',
		'center' : 'Mittelpunkt',
		'help' : 'Koordinaten oder Adresse: <i>N51° 12.123 E010° 23.123</i> oder <i>40.597 -75.542</i> oder <i>Berlin Ernst-Reuter-Platz</i>',
		'refresh' : 'Berechne eine autoTour mit diesen Werten!',
		'cacheCounts' : 'Geschätzte <i>gesamt</i> Anzahl Caches in dieser Region:',
		'duration' : 'Geschätzte Dauer der Erzeugung dieser autoTour:',
		'filter' : {
			'type' : 'Typ',
			'size' : 'Größe',
			'difficulty' : 'Schwierigkeit',
			'terrain' : 'Gelände',
			'special' : {
				'caption' : 'Spezial',
				'pm' : {
					'not' : 'Ist kein PM Cache',
					'ignore' : 'Ist PM oder kein PM Cache',
					'only' : 'Ist PM Cache'
				},
				'notfound' : 'Nicht gefunden',
				'isActive' : 'Aktiv',
				'minFavorites' : 'Mindestzahl Favoriten'
			}
		}
	},
	'dlg' : {
		'sendMessage' : {
			'caption' : 'Sende eine Nachricht an den Entwickler.',
			'content' : 'Du hast einen Fehler gefunden? Du möchtest eine Verbesserung vorschlagen oder deine Meinung zu GCTour loswerden? Dann schreibe mir eine <b>Nachricht:</b>',
			'submit' : 'Schicke diese Nachricht ab!',
			'response' : 'Deine Mail Adresse: '
			// old: 'sendMessageTitle', 'sendMessage', 'sendMessageSubmit'
		},
		'newVersion' : {
			'caption' : 'Neue Version verfügbar',
			'content' : 'Es gibt eine neue Version von GCTour.\nZum update gehen? \n\n' //ohne Anwendung
			// old: 'newVersionDialog', 'newVersionTitle'
		},
		'error' : {
			'content' : '<img src="' + $.gctour.img.sad + '">&nbsp;&nbsp;Leider ist ein Fehler aufgetreten!<br/>' +
			'Versuch es einfach noch einmal oder suche nach einem <a href="#" id="gctour_update_error_dialog">Update</a>!<br/><br/>'
			/* +
			'Wenn dieser Fehler öfter auftritt, dann schicke bitte einen Fehlerbericht.<br/>' +
			'<u>Notizen</u><br/>' +
			'<textarea id="gctour_error_note" rows="4" style="width:99%"></textarea>',
			'send' : 'Fehlerbericht abschicken'
			 */
			// old: 'ERROR_DIALOG', 'ERROR_DIALOG_SEND'
		}
	},
	'notifications' : {
		'addgeocache' : {
			'success' : {
				'caption' : '{0} wurde hinzugefügt!',
				'content' : '<b>{0}</b> enthält jetzt auch <b>{1}</b>.'
			},
			'contains' : {
				'caption' : '{0} wurde <i>nicht</i> hinzugefügt!',
				'content' : '<b>{0}</b> enthält <b>{1}</b> schon.'
			}
		}
	},
	'units' : {
		'km' : 'Kilometer',
		'mi' : 'Meilen'
	},
	'send2cgeo' : {
		'title' : 'an c:geo senden',
		'noWP'  : 'ohne eigene Wegpunkte',
		'usage' : '<li>c:geo auf dem Mobilgerät starten und in eine Cacheliste wechseln</li>' +
				  '<li><i>Menü → Importieren → Importiere von send2cgeo</i></li>' +
				  '<li>Die Tour (ohne eigene Wegpunkte) wird automatisch in die ausgewählte Liste geladen</li>' +
			      '<li>c:geo wartet noch 3 Minuten, um weitere Caches herunterzuladen</li>',
		'overview'  : 'Übersicht',
		'setup' : {
			'header' : 'Setup',
			'registerBrowser' : 'Hier klicken um den Browser für Send2cgeo zu registrieren',
			'desc1' : '<li>c:geo auf dem Androidgerät starten, dann <i>Menu → Einstellungen → Dienste → Send to c:geo</i></li>' +
					  '<li><i>Registrierung anfordern</i> wählen, es öffnet sich ein Fenster mit einer fünfstelligen PIN</li>',
			'desc2' : 'PIN hier eingeben:',
			'desc3' : 'PIN senden und damit Gerät hinzufügen'
		},
		'register' : 'Browser noch nicht für Send2cgeo registriert - bitte zum "Setup" Tab wechseln und den Browser registrieren.',
		'senderror' : 'Ein Fehler ist aufgetreten, bitte später noch einmal versuchen.'
	}

};
$.gctour.i18n.en = {
	'name' : 'English',
	'language' : 'Language',
	'addToTour' : 'Add to Tour',
	'addToCurrentTour' : "to <b>current</b> tour",
	'addToNewTour' : 'to <b>new</b> tour',
	'directPrint' : 'Print this geocache',
	'moveGeocache' : 'Move the coordinates',
	'movedGeocache' : 'The coordinates to this geocaches are moved.',
	'moveGeocacheHelp' : 'You have the chance to change the original coordinates of this geocache. These will than used in the printview and also in the GPX file. This is quiet handy if you solve a mystery.',
	'originalCoordinates' : 'Original coordinates',
	'newCoordinates' : "New coordinates",
	'showCaches' : 'Add <b>shown</b> geocaches:',
	'markedCaches' : 'Add <b>marked</b> geocaches:',
	'removeTourDialog' : "Are you sure to remove this tour?",
	'logYourVisit' : "Log your visit",
	'removeFromList' : "Remove from list",
	'emptyList' : 'The list is empty.',
	'notLogedIn' : 'You need to be on a geocaching.com page and logged in.',
	'printviewTitle' : 'GCTour - ' + GCTOUR_HOST,
	'pleaseWait' : 'Please wait - loading data ...',
	'newList' : 'New Tour',
	'sendToGps' : 'Send to GPS',
	'makeMap' : 'View on map',
	'makeMapWait' : 'Testing availablity of this map',
	'reloadMap' : 'Reload map',
	'printview' : 'Printview',
	'print' : 'Start printing',
	'downloadGpx' : 'Download GPX',
	'showSettings' : 'Show settings',
	'settings_caption' : 'Settings',
	'settingsSelectLanguage' : 'Select language',
	'settingsSelectTheme' : 'Select Theme',
	'settingsPrintMinimal' : 'Minimal printview',
	'settingsLogCount' : 'Number of logs in printview',
	'settingsLogCountNone' : 'none',
	'settingsLogCountAll' : 'all',
	'settingsLogCountShow' : 'show',
	'settingsEditDescription' : 'Description editable',
	'settingsRemoveImages' : 'Remove images on click',
	'settingsShowSpoiler' : 'Display spoiler',
	'settingsAdditionalWaypoints' : 'Show additional waypoints',
	'settingsAdditionalWaypoints2' : 'Add own waypoints to cache table',
	'settingsLoggedVisits' : 'Show log counter',
	'settingsAttributes' : 'Show attributes',
	'settingsDecryptHints' : 'Decrypt hints',
	'settingsSendToGPS' : 'Send to GPS',
	'settingsShowGPX' : 'Show the GPX-File',
	'settingsDownladGPX' : 'GPX download<br/>',
	'settingsGPX' : 'GPX',
	'settingsGPXHtml' : 'Description with HTML',
	'settingsUploadTour' : 'Tour upload',
	'settingsGPXStripGC' : 'Strip "GC" in GC-Code',
	'settingsGPXWpts' : 'Export additional waypoints',
	'settingsGPXAttributestoLog' : 'Create log with cache attributes',
	'settings_map' : 'Map',
	'settings_map_geocacheid' : 'Show geocache id',
	'settings_map_geocacheindex' : 'Show geocache index',
	'settings_map_geocachename' : 'Show geocache name',
	'settings_map_awpts' : 'Display addtional waypoints',
	'settings_map_awpt_name' : 'Show name of the additional waypoints',
	'settings_map_awpt_lookup' : 'Show lookup code of additional waypoints',
	'settings_map_owpts' : 'Display own waypoints',
	'settings_map_owpt_name' : 'Show name of own waypoints',
	'loadTour' : 'Load tour:<br/>',
	'openTour' : 'Load a tour',
	'load' : 'load',
	'removeTour' : 'Delete this tour',
	'deleteCoordinates' : 'Delete coordinates',
	'copyTour' : 'Copy tour',
	'copy' : 'Copy',
	'newTourDialog' : 'Please enter a name for the new tour ...',
	'rename' : 'Rename',
	'upload' : 'Upload Tour',
	'onlineTour' : 'Download Tour',
	'webcodeDownloadHelp' : 'Please enter here the webcode you receive from your friend and click on "Download tour".',
	'webcodeDownloadButton' : 'Download tour',
	'findMe' : 'Find me!',
	'webcodeerror' : 'The choosen webcode does not exist!',
	'tourUploaded1' : '<br>Uploading tour was successful! Webcode:<br><b>',
	'tourUploaded2' : '</b><br><br>You can view the tour at <a href="' + GCTOUR_HOST + 'tour" target="_blank">' + GCTOUR_HOST + 'tour</a>.<br>Important: Please note webcode in order to retrieve the tour!!',
	'settingsFontSize' : 'Fontsize',
	'settingsPageBreak' : 'Page break after cache',
	'settingsPageBreakAfterMap' : 'Page break after map',
	'webcodePrompt' : 'Download tour\nPlease enter a valid webcode, to load the tour',
	'webcodesuccess' : ' was successfully loaded!',
	'webcodeOld' : '\n    !!ATTENTION!!\nThis webcode is connected with an old tour. To get all benefits of GCTour 2.0 you must upload this tour again.',
	'printviewCache' : 'Geocache',
	'printviewFound' : 'Found',
	'printviewNote' : 'Note',
	'printviewMarker' : "Own waypoint",
	'printviewAdditionalWaypoint' : "Additional waypoints",
	'printviewRemoveMap' : "remove map",
	'printviewZoomMap' : "Open this map in a new tab.",
	'settingsFrontPage' : 'Front page',
	'settingsOutlineMap' : 'Outline map for all caches',
	'settingsOutlineMapSingle' : 'Outline map for every cache',
	'settingsShowCacheDetails' : 'Print cache listings and own waypoints',
	'settingsDecryptHintsDesc' : 'Hints will be already decrypted in the printout.',
	'settingsPrintMinimalDesc' : 'This contains only the hint and spoiler of a geocache.',
	'settingsEditDescriptionDesc' : 'The description can be edited in the way you want it.',
	'settingsShowSpoilerDesc' : 'Spoiler images will be on the printout.',
	'settingsAdditionalWaypointsDesc' : 'The printview will contain a table with all "Additional waypoints" from a geocache.',
	'settingsAdditionalWaypoints2Desc' : 'Own waypoints will be added to the cache table on front page. Otherwise an extra table will be added.',
	'settingsLoggedVisitsDesc' : 'This will show the "Find counts" overview.',
	'settingsPageBreakDesc' : 'After each geocache there will be a page break. Visiable after printing.',
	'settingsPageBreakAfterMapDesc' : 'It will be a page break after the overview to separate it from the geocaches.',
	'settingsFrontPageDesc' : 'An overview will be generated containing the complete list of geocaches including index and space to take notes. ',
	'settingsOutlineMapDesc' : 'The overview will contain a map with all geocaches.',
	'settingsOutlineMapSingleDesc' : 'After each geocache a map containing the geocache and its "Additional waypoints" will be shown.',
	'settingsShowCacheDetailsDesc' : 'All geocache listings and own waypoints will be printed.',
	'settingsGPXHtmlDesc' : 'Some programs/GPSr have problems to show geocaches when their description is HTML formated. If you only see scrabbled descriptions then please disable this option.',
	'settingsGPXWptsDesc' : 'Additional waypoints will be exported as extra waypoint to the GPX. You will see every parking place on your unit.',
	'settingsGPXStripGCDesc' : 'Older GPSr still have problems with waypoints having their name longer than 8 characters. Please use this option if you own such an unit.',
	'settingsGPXAttributestoLogDesc' : 'Cache attributes are also registered as a first sign.',
	'settings_map_geocacheidDesc' : 'The GCCode (eg. GC0815) will be shown on the map.',
	'settings_map_geocacheindexDesc' : 'The position of each waypoint in the current tour will be shown on the map.',
	'settings_map_geocachenameDesc' : 'The name of an geocache will be shown on the map.',
	'settings_map_awptsDesc' : 'If enabled, additional waypoints will be shown on the map.',
	'settings_map_awpt_nameDesc' : 'The name of the additional waypoints will be shown on the map.',
	'settings_map_awpt_lookupDesc' : 'The lookup code of the additional waypoints will be shown on the map.',
	'settings_map_owptsDesc' : 'Own waypoints in the current tour will be shown on the map.',
	'settings_map_owpt_nameDesc' : 'Display the name of your own waypoints',
	'settings_map_gcdeDesc' : 'You will see the geocaching.de map in addition to your tour.',
	'settingsMapType' : 'Default map type',
	'settingsMapSize' : 'Default map size',
	'addOwnWaypoint' : 'Add own waypoint',
	"markerCoordinate" : "Coordinates",
	"markerContent" : "Content",
	"markerType" : "Type",
	"markerContentHint" : "Will be shown in the printview",
	"markerCaption" : "Caption",
	"save" : "Save",
	"cancel" : "Cancel",
	"close" : "Close",
	'install' : 'Install',
	"edit" : "edit",
	"example" : "eg. ",
	"exampleCoords" : "<i>N51° 12.123 E010° 23.123</i> or <i>40.597 -75.542</i>",
	"dontPrintHint" : "<b>Information :</b><br/>Elements in such a box will <u>not</u> be printed!",
	"SCRIPT_ERROR" : "It appears, that you are blocking some javascript sources (e.g. NoScript). Please allow 'geocaching.com' permanently to use GCTour!",
	"mapHeight" : "Height",
	'mapTypes' :
	[{
			"caption" : "Google Map",
			"value" : "roadmap"
		}, {
			"caption" : "Google Satellite",
			"value" : "satellite"
		}, {
			"caption" : "Google Hybrid",
			"value" : "hybrid"
		}, {
			"caption" : "Google Terrain",
			"value" : "terrain"
		}, {
			"caption" : "Topo Germany",
			"value" : "oda"
		}, {
			"caption" : "OSM Mapnik",
			"value" : "mapnik"
		}, {
			"caption" : "OSM Osma",
			"value" : "osma"
		}, {
			"caption" : "OSM Cycle",
			"value" : "osmaC"
		}, {
			"caption" : "OSM Public Transport",
			"value" : "osmaP"
		}
	],
	'updateDialog' : "<div><p>There is a new version of <a target='_blank' href='https://gist.github.com/DieBatzen/5814dc7368c1034470c8'><b>GCTour</b></a> available for installation.</p><p>You currently have installed version <b>###VERSION_OLD###</b>. The latest version is <b>###VERSION_NEW###</b>.</p><div class='dialogFooter'></div>",
	'updateCurrently' : 'GCTour ' + VERSION + ' is up to date!',
	'switchSite' : 'To use this function please switch to any other site, e.g.',
	'saveSettings' : 'Backup tours and settings',
	'saveSettingsDesc' : 'Backup / restore all tours, settings and moved coordinates:<ol><li>insert the following into the Firefox address line: <u>about:support</u></li><li>next to <u>Application Basics - Profile Directory</u> click on <u>Open Directory</u></li><li>switch to folder <u>gm_scripts</u></li><li>important: close Firefox now</li><li>save / restore the file <u>GC_Tour.db</u></li></ol>',

	// redesign begin 05.2012
	'settings' : {
		'gpx' : {
			'maxLogCount' : 'max number of logs'
		}
	},
	'autoTour' : {
		'title' : 'autoTour',
		'wait' : 'Please wait - generating autoTour!',
		'radius' : 'Radius',
		'center' : 'Center',
		'help' : 'Coordinates or address:<i>N51° 12.123 E010° 23.123</i> or <i>40.597 -75.542</i> or <i>Paris Eiffel Tower</i>',
		'refresh' : 'Calculate an autoTour with these values!',
		'cacheCounts' : 'Estimated <i>total number</i> of caches in this region:',
		'duration' : 'Estimated time to generate this autoTour:',
		'filter' : {
			'type' : 'Type',
			'size' : 'Size',
			'difficulty' : 'Difficulty',
			'terrain' : 'Terrain',
			'special' : {
				'caption' : 'Special',
				'pm' : {
					'not' : 'Is not a PM cache',
					'ignore' : 'Is PM or not PM cache',
					'only' : 'Is PM cache'
				},
				'notfound' : 'I haven\'t found ',
				'isActive' : 'is Active',
				'minFavorites' : 'min. Favorites'
			}
		}
	},
	'dlg' : {
		'sendMessage' : {
			'caption' : 'Send a message to the author.',
			'content' : 'You have found a bug? Do you have suggestion on GCTour? I would like to hear your opinion.<br/>Feel free to send me a <b>message</b>:',
			'submit' : 'Submit this message!',
			'response' : 'Your mail address: '

			// old: 'sendMessageTitle', 'sendMessage', 'sendMessageSubmit'
		},
		'newVersion' : {
			'caption' : 'New version available',
			'content' : 'There is a new version of GCTour.\nDo you want to update? \n\n'
			// old: 'newVersionDialog', 'newVersionTitle'
		},
		'error' : {
			'content' : '<img src="' + $.gctour.img.sad + '">&nbsp;&nbsp;I\'m sorry but an error occurs.<br/>' +
			'Please just try again, or look for an <a href="#" id="gctour_update_error_dialog">update</a>!<br/><br/>'
			/* +
			'If this error comes every time, please send this error report.<br/>' +
			'<u>Notes</u><br/>' +
			'<textarea id="gctour_error_note" rows="4" style="width:99%"></textarea>',
			'send' : 'Send report'
			 */
			// old: 'ERROR_DIALOG', 'ERROR_DIALOG_SEND'
		}
	},
	'notifications' : {
		'addgeocache' : {
			'success' : {
				'caption' : '{0} added successfully!',
				'content' : '<b>{0}</b> now also contains <b>{1}</b>.'
			},
			'contains' : {
				'caption' : '{0} was <i>not</i> added!',
				'content' : '<b>{0}</b> contains <b>{1}</b>.'
			}
		}
	},
	'units' : {
		'km' : 'Kilometer',
		'mi' : 'Miles'
	},
	'send2cgeo' : {
		'title' : 'Send to c:geo',
		'noWP'  : 'no own waypoints',
		'usage' : '<li>Start c:geo on your device and go to a list of saved caches</li>' +
				  '<li>Select Menu → Import → Import from send2cgeo</li>' +
				  '<li>The tour (without own waypoints) will automatically be downloaded from geocaching.com to the list of saved caches</li>' +
			      '<li>c:geo will continue to wait for more caches to be downloaded for 3 minutes</li>',
		'overview'  : 'Overview',
		'setup' : {
			'header' : 'Setup',
			'registerBrowser' : 'Click to register this browser for Send2cgeo',
			'desc1' : '<li>Run c:geo on your android device and select <i>Menu → Settings → Services → Send to c:geo</i></li>' +
					  '<li>Select <i>Request Registration</i>, you will get an info window showing a five digit PIN</li>',
			'desc2' : 'Enter PIN here:',
			'desc3' : 'Send PIN and add device'
		},
		'register' : 'Browser is not registered for Send2cgeo yet - please switch to "Setup" tab and register your browser.',
		'senderror' : 'An error occurred, please try again later.'
	}

};
$.gctour.i18n.fr = {
	'name' : 'Français',
	'language' : 'Langue',
	'addToTour' : 'Ajouter au Tour',
	'addToCurrentTour' : "au tour <b>actuel</b>",
	'addToNewTour' : 'à un <b>nouveau</b> Tour',
	'directPrint' : 'Imprimer cette cache',
	'moveGeocache' : 'Ajuster les coordonnées',
	'movedGeocache' : 'Les coordonnées de cette cache ont été ajustées.',
	'moveGeocacheHelp' : 'Vous avez la possibilité d\'ajuster les coordonnées de cette cache. Ces coordonnées seront utilisées dans la version imprimable et dans le fichier GPX . Très utile pour la saisie des solutions des caches Mystery.',
	'originalCoordinates' : 'Coordonnées initiales',
	'newCoordinates' : "Nouvelles coordonnées",
	'showCaches' : 'Ajouter les caches affichées:',
	'markedCaches' : 'Add <b>marked</b> geocaches:', // ToDo
	'removeTourDialog' : "Etes-vous sûrs de vouloir supprimer ce Tour?",
	'logYourVisit' : "Loguer votre visite",
	'removeFromList' : "Supprimer de la liste",
	'emptyList' : 'La liste est vide.',
	'notLogedIn' : 'Vous devez être connecté à geocaching.com, merci de vous connecter ...',
	'printviewTitle' : 'GCTour - ' + GCTOUR_HOST,
	'pleaseWait' : 'Veuillez patienter...',
	'newList' : 'Nouveau Tour',
	'sendToGps' : 'Transférer vers le GPS',
	'makeMap' : 'Voir sur la carte',
	'makeMapWait' : 'Vérification de la disponibilité et création de la carte... ',
	'reloadMap' : 'Reload map',
	'printview' : 'Générer la version imprimable',
	'print' : 'Lancez l\'impression',
	'downloadGpx' : 'Télécharger le GPX',
	'showSettings' : 'Configurer',
	'settings_caption' : 'Configuration',
	'settingsSelectLanguage' : 'Choisir langue',
	'settingsSelectTheme' : 'Choisir Theme',
	'settingsPrintMinimal' : 'Version imprimable minimaliste',
	'settingsLogCount' : 'Nombre de logs à inclure dans la version imprimable',
	'settingsLogCountNone' : 'aucun',
	'settingsLogCountAll' : 'tous',
	'settingsLogCountShow' : 'afficher',
	'settingsEditDescription' : 'Description éditable',
	'settingsRemoveImages' : 'Suppression des images par simple clic',
	'settingsShowSpoiler' : 'Affichage des spoilers',
	'settingsAdditionalWaypoints' : 'Affichage des Waypoints additionnels',
	'settingsAdditionalWaypoints2' : 'Add own waypoints to cache table',
	'settingsLoggedVisits' : 'Affichage du nombre de logs',
	'settingsAttributes' : 'Affichage des attributs',
	'settingsDecryptHints' : 'Decryptage des hints',
	'settingsSendToGPS' : 'Envoyer vers le GPS',
	'settingsShowGPX' : 'Afficher le fichier GPX',
	'settingsDownladGPX' : 'Téléchargement du fichier GPX<br/>',
	'settingsGPX' : 'GPX',
	'settingsGPXHtml' : 'Description des caches au format HTML',
	'settingsUploadTour' : 'Soumettre un Tour',
	'settingsGPXStripGC' : 'Tronquer le préfixe "GC" dans le GC-Code',
	'settingsGPXWpts' : 'Exporter les Waypoints additionnels',
	'settingsGPXAttributestoLog' : 'Créer connecter avec les attributs du cache',
	'settings_map' : 'Carte',
	'settings_map_geocacheid' : 'Afficher l\'Id de la cache sur la carte',
	'settings_map_geocacheindex' : 'Afficher les Waypoints des caches sur la vue générale',
	'settings_map_geocachename' : 'Afficher le nom des caches sur la vue générale',
	'settings_map_awpts' : 'Afficher les Waypoints',
	'settings_map_awpt_name' : 'Afficher les noms des Waypoints additionnels',
	'settings_map_awpt_lookup' : 'Afficher les codes lookup des Waypoints additionnels',
	'settings_map_owpts' : 'Afficher les Waypoints personnels',
	'settings_map_owpt_name' : 'Afficher le nom des Waypoints personnels',
	'loadTour' : 'Charger un Tour:<br/>',
	'openTour' : 'Ouvrir un Tour',
	'load' : 'charger',
	'removeTour' : 'Supprimer ce Tour',
	'deleteCoordinates' : 'Supprimer les coordonnées',
	'copyTour' : 'Dupliquer le Tour',
	'copy' : 'Dupliquer',
	'newTourDialog' : 'Veuillez saisir un nom pour ce nouveau Tour ...',
	'rename' : 'Renommer',
	'upload' : 'Soumettre un Tour',
	'onlineTour' : 'Télécharger un Tour',
	'webcodeDownloadHelp' : 'Entrer ici le webcode que vous avez reçu et cliquer sur "Télécharger le Tour".',
	'webcodeDownloadButton' : 'Télécharger le Tour',
	'findMe' : 'Localisez-moi!',
	'webcodeerror' : 'Le webcode saisi est inexistant!',
	'tourUploaded1' : '<br>Le Tour a été correctement transféré! Webcode:<br><b>',
	'tourUploaded2' : '</b><br><br>Vous pouvez visualiser ce Tour sur <a href="' + GCTOUR_HOST + 'tour" target="_blank">' + GCTOUR_HOST + 'tour</a>.<br>Important: Notez bien le webcode pour une utilisation ultérieure!!',
	'settingsFontSize' : 'Taille des caractères',
	'settingsPageBreak' : 'Saut de page entre les caches',
	'settingsPageBreakAfterMap' : 'Saut de page après la carte',
	'webcodePrompt' : 'Téléchargement du Tour\nMerci de sasir le webcode du Tour à télécharger:',
	'webcodesuccess' : ' a été chargé avec succès!',
	'webcodeOld' : '\n    !!ATTENTION!!\nCe webcode corrrespond à un ancien tour. Pour profiter pleinement de GCTour 2.0 vous devez soumettre de nouveau ce Tour.',
	'printviewCache' : 'Geocache',
	'printviewFound' : 'Trouvée',
	'printviewNote' : 'Note',
	'printviewMarker' : "Waypoint personnel",
	'printviewAdditionalWaypoint' : "Waypoints Additionnels",
	'printviewRemoveMap' : "Supprimer la carte",
	'printviewZoomMap' : "Ouvrir la carte dans un nouvel onglet.",
	'settingsFrontPage' : 'Page d\'accueil',
	'settingsOutlineMap' : 'Vue d\'ensemble de toutes les caches du Tour',
	'settingsOutlineMapSingle' : 'Vue d\'ensemble pour chaque cache',
	'settingsShowCacheDetails' : 'Print cache listings and own waypoints',
	'settingsDecryptHintsDesc' : 'Les indices seront décryptés dans la version imprimable.',
	'settingsPrintMinimalDesc' : 'Ne contient que l\'indice et le spoiler de la cache.',
	'settingsEditDescriptionDesc' : 'La description est éditable comme bon vous semble.',
	'settingsShowSpoilerDesc' : 'Les images Spoiler seront visibles dans la version imprimables.',
	'settingsAdditionalWaypointsDesc' : 'La version imprimable contiendra un tableau avec tous les "Waypoints additionnels" de la cache.',
	'settingsAdditionalWaypoints2Desc' : 'Own waypoints will be added to the cache table on front page. Otherwise an extra table will be added.',
	'settingsLoggedVisitsDesc' : 'Affiche un récapitulatif des "Trouvé(s)".',
	'settingsPageBreakDesc' : 'Il y aura un saut de page après chaque cache. Visible seulement à l\'impression.',
	'settingsPageBreakAfterMapDesc' : 'Il y aura un saut de page après la vue globale du Tour pour la séparer des pages de caches qui suivent.',
	'settingsFrontPageDesc' : 'Une vue d\'ensemble sera générée et incluera un index avec des cases dédiées à la prise de notes. ',
	'settingsOutlineMapDesc' : 'La vue d\'ensemble incluera une carte avec toutes les caches.',
	'settingsOutlineMapSingleDesc' : 'Après chaque cache, une carte indiquant l\'emplacement de la cache et de ses Waypoints additionnels sera affichée.',
	'settingsShowCacheDetailsDesc' : 'All geocache listings and own waypoints will be printed.',
	'settingsGPXHtmlDesc' : 'Certains programmes/GPSr ont des problèmes pour afficher les descriptions au format HTML. Si vous ne voyez qu\'une description tronquée de la cache, désactivez cette option.',
	'settingsGPXWptsDesc' : 'Les Waypoints additionnels seront exportés vers votres GPS. Les parkings conseillés seront visibles sur votre GPS.',
	'settingsGPXStripGCDesc' : 'Les anciens GPSr ont parfois des problèmes avec les noms de Waypoints de plus de 8 caractères. Dans ce cas cochez cette option.',
	'settingsGPXAttributestoLogDesc' : 'Attributs de mise en cache sont également enregistrés comme un premier signe.',
	'settings_map_geocacheidDesc' : 'Les codes GC (eg. GC1S5ZE) seront affichés sur la carte.',
	'settings_map_geocacheindexDesc' : 'Les Waypoints seront affichés sur la carte.',
	'settings_map_geocachenameDesc' : 'Les noms des caches seront affichés sur la carte.',
	'settings_map_awptsDesc' : 'Si cette option est cochée les Waypoints associées aux caches seront affichés sur la carte.',
	'settings_map_awpt_nameDesc' : 'Les noms des Waypoints additionnels seront affichés sur la carte.',
	'settings_map_awpt_lookupDesc' : 'Les codes lookup des Waypoints seront affichés sur la carte.',
	'settings_map_owptsDesc' : 'Les Waypoints personnels seront visibles sur la carte.',
	'settings_map_owpt_nameDesc' : 'Affiche le nom des Waypoints personnels sur la carte',
	'settings_map_gcdeDesc' : 'La carte de geocaching.de sera ajoutée à la version imprimable de votre Tour.',
	'settingsMapType' : 'Type de carte par défaut',
	'settingsMapSize' : 'Taille de carte par défaut',
	'addOwnWaypoint' : 'Ajouter un Waypoint personnel',
	"markerCoordinate" : "Coordonnées",
	"markerContent" : "Description",
	"markerType" : "Type",
	"markerContentHint" : "sera visble dans la version imprimable",
	"markerCaption" : "Légende",
	"save" : "Enregistrer",
	"cancel" : "Abandonner",
	"close" : "Fermer",
	'install' : 'Installer',
	"edit" : "Editer",
	"example" : "Ex. ",
	"exampleCoords" : "<i>N51° 12.123 E010° 23.123</i> ou <i>40.597 -75.542</i>",
	"dontPrintHint" : "<b>Information :</b><br/>Les éléménts ayant cette apparence ne seront <u>pas</u> imprimés!",
	"SCRIPT_ERROR" : "Il semble que des javascripts ne puissent pas s'exécuter sur votre ordinateur (e.g. NoScript). Merci d'autoriser 'geocaching.com' à utiliser GCTour de manière permanente!",
	"mapHeight" : "Height",
	'mapTypes' :
	[{
			"caption" : "Google Plan",
			"value" : "roadmap"
		}, {
			"caption" : "Google Satellite",
			"value" : "satellite"
		}, {
			"caption" : "Google Hybride",
			"value" : "hybrid"
		}, {
			"caption" : "Google Terrain",
			"value" : "terrain"
		}, {
			"caption" : "Topo Germany",
			"value" : "oda"
		}, {
			"caption" : "OSM Mapnik",
			"value" : "mapnik"
		}, {
			"caption" : "OSM Osma",
			"value" : "osma"
		}, {
			"caption" : "OSM Cycle",
			"value" : "osmaC"
		}, {
			"caption" : "OSM Public Transport",
			"value" : "osmaP"
		}
	],
	'updateDialog' : "<div><p>Une nouvelle version de <a target='_blank' href='https://gist.github.com/DieBatzen/5814dc7368c1034470c8'><b>GCTour</b></a> est disponible.</p><p>Version installée: <b>###VERSION_OLD###</b>. Version la plus récente disponible: <b>###VERSION_NEW###</b>.</p><div class='dialogFooter'></div>",
	'updateCurrently' : 'GCTour ' + VERSION + ' est à jour! ',
	'switchSite' : 'To use this function please switch to any other site, e.g.',
	'saveSettings' : 'Backup tours and settings',
	'saveSettingsDesc' : 'Backup / restore all tours, settings and moved coordinates:<ol><li>insert the following into the Firefox address line: <u>about:support</u></li><li>next to <u>Application Basics - Profile Directory</u> click on <u>Open Directory</u></li><li>switch to folder <u>gm_scripts</u></li><li>important: close Firefox now</li><li>save / restore the file <u>GC_Tour.db</u></li></ol>',

	// redesign begin 05.2012
	'settings' : {
		'gpx' : {
			'maxLogCount' : 'nombre maximum de journaux'
		}
	},
	'autoTour' : {
		'title' : 'autoTour',
		'wait' : 'Veuillez patienter pendant la génération automatique du Tour ...',
		'radius' : 'Rayon',
		'center' : 'Centre',
		'help' : 'Coordonnées ou adresse:<i>N51° 12.123 E010° 23.123</i> ou <i>40.597 -75.542</i> ou <i>Paris Tour Eiffel</i>',
		'refresh' : 'Continuer pour cette zone !',
		'cacheCounts' : 'Estimation du<i>nombre total</i> de cache dans cette zone:',
		'duration' : 'Durée estimée de création de cet autoTour:',
		'filter' : {
			'type' : 'Type',
			'size' : 'Taille',
			'difficulty' : 'Difficulté',
			'terrain' : 'Terrain',
			'special' : {
				'caption' : 'Spécial',
				'pm' : {
					'not' : 'Is not a PM cache',
					'ignore' : 'Is PM or not PM cache',
					'only' : 'Is PM cache'
				},
				'notfound' : 'I haven\'t found ',
				'isActive' : 'is Active',
				'minFavorites' : 'min. Favorites'
			}
		}
	},
	'dlg' : {
		'sendMessage' : {
			'caption' : 'Contacter l\'auteur',
			'content' : 'Vous avez trouvé un bug ? Vous avez une suggestion à propos de GCTour? Votre opinion m\'intéresse.<br/>Envoyez-moi un<b>message</b>:',
			'submit' : 'Envoyer le message'
			// old: 'sendMessageTitle', 'sendMessage', 'sendMessageSubmit'
		},
		'newVersion' : {
			'caption' : 'Nouvelle version disponible',
			'content' : 'Une nouvelle version de GCTour est disponible.\n Voulez-vous mettre à jour? \n\n'
			// old: 'newVersionDialog', 'newVersionTitle'
		},
		'error' : {
			'content' : '<img src="' + $.gctour.img.sad + '">&nbsp;&nbsp;Désolé une erreur est survenue.<br/>' +
			'Réessayez SVP, ou vérifier les <a href="#" id="gctour_update_error_dialog">mises à jour</a> du script!<br/><br/>'
			/* +
			'Si cette erreur se reproduit, merci d\'envoyer le rapport d\'erreur.<br/>' +
			'<u>Notes</u><br/>' +
			'<textarea id="gctour_error_note" rows="4" style="width:99%"></textarea>',
			'send' : 'envoi du rapport'
			 */
			// old: 'ERROR_DIALOG', 'ERROR_DIALOG_SEND'
		}
	},
	'notifications' : {
		'addgeocache' : {
			'success' : {
				'caption' : '{0} a été ajouté',
				'content' : '<b>{0}</b> contient désormais aussi <b>{1}</b>.'
			},
			'contains' : {
				'caption' : '{0} n\'a pas été ajouté',
				'content' : '<b>{0}</b> contient <b>{1}</b>.'
			}
		}
	},
	'units' : {
		'km' : 'Kilomètre',
		'mi' : 'Miles'
	},
	'send2cgeo' : {
		'title' : 'Transférer vers le c:geo',
		'noWP'  : 'no own waypoints',
		'usage' : '<li>Start c:geo on your device and go to a list of saved caches</li>' +
				  '<li>Select Menu → Import → Import from send2cgeo</li>' +
				  '<li>The tour (without own waypoints) will automatically be downloaded from geocaching.com to the list of saved caches</li>' +
			      '<li>c:geo will continue to wait for more caches to be downloaded for 3 minutes</li>',
		'overview'  : 'Overview',
		'setup' : {
			'header' : 'Setup',
			'registerBrowser' : 'Click to register this browser for Send2cgeo',
			'desc1' : '<li>Run c:geo on your android device and select <i>Menu → Settings → Services → Send to c:geo</i></li>' +
					  '<li>Select <i>Request Registration</i>, you will get an info window showing a five digit PIN</li>',
			'desc2' : 'Enter PIN here:',
			'desc3' : 'Send PIN and add device'
		},
		'register' : 'Browser is not registered for Send2cgeo yet - please switch to "Setup" tab and register your browser.',
		'senderror' : 'An error occurred, please try again later.'
	}

};
$.gctour.i18n.nl = {
	'name' : 'Nederlands',
	'language' : 'Taal',
	'addToTour' : 'Aan toer toevoegen',
	'addToCurrentTour' : "aan <b>huidige</b> toer",
	'addToNewTour' : 'aan <b>nieuwe</b> toer',
	'directPrint' : 'Deze geocache afdrukken',
	'moveGeocache' : 'Verplaats de coördinaten',
	'movedGeocache' : 'De coördinaten voor deze geocache zijn verplaatst.',
	'moveGeocacheHelp' : 'Je kan de originele coördinaten van deze geocache verplaatsen. Deze worden dan gebruikt in de afdrukweergave en in het GPX bestand. Dit kan handig zijn bij een opgeloste mystery.',
	'originalCoordinates' : 'Originele coördinaten',
	'newCoordinates' : "Nieuwe coördinaten",
	'showCaches' : 'Getoonde geocaches toevoegen:',
	'markedCaches' : 'Add <b>marked</b> geocaches:', // ToDo
	'removeTourDialog' : "Weet je zeker dat je deze toer wil verwijderen?",
	'logYourVisit' : "Log je bezoek",
	'removeFromList' : "Van lijst verwijderen",
	'emptyList' : 'De lijst is leeg.',
	'notLogedIn' : 'U dient ingelogd te zijn, gelieve in te loggen ...',
	'printviewTitle' : 'GCTour - ' + GCTOUR_HOST,
	'pleaseWait' : 'Even geduld  - gegevens worden geladen ...',
	'newList' : 'Nieuwe toer',
	'sendToGps' : 'Naar GPS versturen',
	'makeMap' : 'Bekijk op de kaart',
	'makeMapWait' : 'Beschikbaarheid kaart wordt getest',
	'reloadMap' : 'Reload map',
	'printview' : 'Afdrukweergave',
	'print' : 'Begin met afdrukken',
	'downloadGpx' : 'GPX downloaden',
	'showSettings' : 'Instellingen tonen',
	'settings_caption' : 'Instellingen',
	'settingsSelectLanguage' : 'Taal kiezen',
	'settingsSelectTheme' : 'Theme kiezen',
	'settingsPrintMinimal' : 'Minimale afdrukweergave',
	'settingsLogCount' : 'Aantal logs in afdrukweergave',
	'settingsLogCountNone' : 'geen',
	'settingsLogCountAll' : 'alle',
	'settingsLogCountShow' : 'tonen',
	'settingsEditDescription' : 'Beschrijving wijzigbaar',
	'settingsRemoveImages' : 'Verwijder afbeeldingen met een klik',
	'settingsShowSpoiler' : 'Spoiler tonen',
	'settingsAdditionalWaypoints' : 'Additional waypoints tonen',
	'settingsAdditionalWaypoints2' : 'Add own waypoints to cache table',
	'settingsLoggedVisits' : 'Log teller tonen',
	'settingsAttributes' : 'Attributen tonen',
	'settingsDecryptHints' : 'Decodeer hints',
	'settingsSendToGPS' : 'Naar GPS versturen',
	'settingsShowGPX' : 'GPX bestand tonen',
	'settingsDownladGPX' : 'GPX downloaden<br/>',
	'settingsGPX' : 'GPX',
	'settingsGPXHtml' : 'Beschrijving met HTML',
	'settingsUploadTour' : 'Toer uploaden',
	'settingsGPXStripGC' : '"GC" in GC-Code verwijderen',
	'settingsGPXWpts' : 'Exporteer additional waypoints',
	'settingsGPXAttributestoLog' : 'Maken te loggen met cache attributen',
	'settings_map' : 'Kaart',
	'settings_map_geocacheid' : 'Toon geocache id',
	'settings_map_geocacheindex' : 'Toon geocache index',
	'settings_map_geocachename' : 'Toon geocache naam',
	'settings_map_awpts' : 'Toon additional waypoints',
	'settings_map_awpt_name' : 'Toon naam additional waypoints',
	'settings_map_awpt_lookup' : 'Toon lookup code additional waypoints',
	'settings_map_owpts' : 'Toon eigen waypoints',
	'settings_map_owpt_name' : 'Toon naam eigen waypoints',
	'loadTour' : 'Laad toer:<br/>',
	'openTour' : 'Een toer laden',
	'load' : 'laden',
	'removeTour' : 'Deze toer wissen',
	'deleteCoordinates' : 'Verwijderen coördinaten',
	'copyTour' : 'Toer kopiëren',
	'copy' : 'Kopiëren',
	'newTourDialog' : 'Gelieve de naam van de nieuwe toer in te vullen ...',
	'rename' : 'Hernoem',
	'upload' : 'Toer uploaden',
	'onlineTour' : 'Toer downloaden',
	'webcodeDownloadHelp' : 'Gelieve de ontvangen webcode in te vullen en klik op "Toer downloaden".',
	'webcodeDownloadButton' : 'Download toer',
	'findMe' : 'Vind me!',
	'webcodeerror' : 'De gekozen webcode bestaat niet!',
	'tourUploaded1' : '<br>Uploaden toer was succesvol! Webcode:<br><b>',
	'tourUploaded2' : '</b><br><br>Je kan de toer bekijken op <a href="' + GCTOUR_HOST + 'tour" target="_blank">' + GCTOUR_HOST + 'tour</a>.<br>Belangrijk gelieve de webcode te noteren om deze later op te kunnen opvragen!!',
	'settingsFontSize' : 'Fontgrootte',
	'settingsPageBreak' : 'Pagina einde achter cache',
	'settingsPageBreakAfterMap' : 'Pagina einde achter kaart',
	'webcodePrompt' : 'Toer downloaden.\nGelieve een geldige webcode in te vullen om een toer te laden:',
	'webcodesuccess' : ' is succesvol geladen!',
	'webcodeOld' : '\n    !!AANDACHT!!\nDeze webcode bevat een oude toer. Om alle voordelen van GCTour 2.0 te benutten moet deze toer opnieuw worden geüpload worden.',
	'printviewCache' : 'geocache',
	'printviewFound' : 'gevonden',
	'printviewNote' : 'note',
	'printviewMarker' : "eigen waypoint",
	'printviewAdditionalWaypoint' : "additional waypoints",
	'printviewRemoveMap' : "kaart verwijderen",
	'printviewZoomMap' : "Open deze kaart in een nieuwe tab.",
	'settingsFrontPage' : 'Frontpagina',
	'settingsOutlineMap' : 'Kaart maken voor alle geocaches',
	'settingsOutlineMapSingle' : 'Kaart maken voor elke cache afzonderlijk',
	'settingsShowCacheDetails' : 'Print cache listings and own waypoints',
	'settingsDecryptHintsDesc' : 'Hints worden  gedecodeerd bij het afdrukken.',
	'settingsPrintMinimalDesc' : 'Dit bevat enkel de hint en spoiler van een geocache.',
	'settingsEditDescriptionDesc' : 'De beschrijving van de geocache kan aangepast worden.',
	'settingsShowSpoilerDesc' : 'Spoilers worden afgedrukt.',
	'settingsAdditionalWaypointsDesc' : 'De afdrukweergave zal een tabel met de "additional waypoints" van een geocache bevatten.',
	'settingsAdditionalWaypoints2Desc' : 'Own waypoints will be added to the cache table on front page. Otherwise an extra table will be added.',
	'settingsLoggedVisitsDesc' : 'Dit toont een "Find Counts" overzicht.',
	'settingsPageBreakDesc' : 'Bij het afdrukken komt achter elke geocache een nieuwe pagina.',
	'settingsPageBreakAfterMapDesc' : 'Er komt een nieuwe pagina tussen het overzicht en de geocaches.',
	'settingsFrontPageDesc' : 'Een overzicht wordt gemaakt met de volledige lijst van de geocaches met een index en plaats voor notities. ',
	'settingsOutlineMapDesc' : 'Het overzicht  zal een kaart met alle geocaches bevatten.',
	'settingsOutlineMapSingleDesc' : 'Na iedere geocache komt een kaart met de geocache en de additional waypoints.',
	'settingsShowCacheDetailsDesc' : 'All geocache listings and own waypoints will be printed.',
	'settingsGPXHtmlDesc' : 'Sommige programma\'s en GPS toestellen hebben problemen met geocache beschrijvingen in HTML. Indien dit het geval is, kan je best deze optie afzetten.',
	'settingsGPXWptsDesc' : 'Additional waypoints worden geëxporteerd als extra waypoint naar GPX. Alle paarkeerplaatsen zullen zichtbaar zijn op je toestel.',
	'settingsGPXStripGCDesc' : 'Oudere GPS toestellen kunnen problemen hebben met waypoints waarvan de naam langer is dan 8 tekens. Gebruik deze optie indien dit het geval is.',
	'settingsGPXAttributestoLogDesc' : 'Cache attributen worden ook geregistreerd als een eerste teken.',
	'settings_map_geocacheidDesc' : 'De GCCode (eg. GC2NTTG) wordt getoond op de kaart.',
	'settings_map_geocacheindexDesc' : 'De volgorde binnen de toer wordt getoond op de kaart.',
	'settings_map_geocachenameDesc' : 'De naam van de geocache wordt getoond op de kaart.',
	'settings_map_awptsDesc' : 'Additional waypoints worden getoond op de kaart.',
	'settings_map_awpt_nameDesc' : 'De naam van het additional waypoint wordt getoond op de kaart.',
	'settings_map_awpt_lookupDesc' : 'De lookup code van het additional waypoints wordt getoond op de kaart.',
	'settings_map_owptsDesc' : 'Eigen waypoints worden getoond op de kaart.',
	'settings_map_owpt_nameDesc' : 'De naam van het eigen waypoint wordt getoond op de kaart.',
	'settings_map_gcdeDesc' : 'Met deze optie kan je ook de geocaching.de  kaart in de toer zetten.',
	'settingsMapType' : 'Standaard kaarttype',
	'settingsMapSize' : 'Standaard kaartgrootte',
	'addOwnWaypoint' : 'Eigen waypoint toevoegen',
	"markerCoordinate" : "Coördinaten",
	"markerContent" : "Inhoud",
	"markerType" : "Type",
	"markerContentHint" : "zal getoond worden in afdrukweergave",
	"markerCaption" : "Onderschrift",
	"save" : "Bewaren",
	"cancel" : "Annuleren",
	"close" : "Sluiten",
	'install' : 'Installeren',
	"edit" : "Bewerken",
	"example" : "bv. ",
	"exampleCoords" : "<i>N50°53.692 E004° 20.478</i> or <i>50.894867 4.341300</i>",
	"dontPrintHint" : "<b>Ter info :</b><br/>Gegevens in dit kader worden <u>niet</u> afgedrukt!",
	"SCRIPT_ERROR" : "Blijkbaar blokkeer je javascript functionaliteiten (bv. NoScript). Gelieve 'geocaching.com' niet te filteren om gebruik te kunnen maken van GCTour!",
	"mapHeight" : "Height",
	'mapTypes' :
	[{
			"caption" : "Google Map",
			"value" : "roadmap"
		}, {
			"caption" : "Google Satellite",
			"value" : "satellite"
		}, {
			"caption" : "Google Hybrid",
			"value" : "hybrid"
		}, {
			"caption" : "Google Terrain",
			"value" : "terrain"
		}, {
			"caption" : "Topo Germany",
			"value" : "oda"
		}, {
			"caption" : "OSM Mapnik",
			"value" : "mapnik"
		}, {
			"caption" : "OSM Osma",
			"value" : "osma"
		}, {
			"caption" : "OSM Cycle",
			"value" : "osmaC"
		}, {
			"caption" : "OSM Public Transport",
			"value" : "osmaP"
		}
	],
	'updateDialog' : "<div><p>Er is een nieuwe versie van <a target='_blank' href='https://gist.github.com/DieBatzen/5814dc7368c1034470c8'><b>GCTour</b></a> beschikbaar voor installatie.</p><p>Versie <b>###VERSION_OLD###</b> is momenteel geïnstalleerd. De recentste versie is <b>###VERSION_NEW###</b>.</p><div class='dialogFooter'></div>",
	'updateCurrently' : 'GCTour ' + VERSION + ' is op dit moment!',
	'switchSite' : 'To use this function please switch to any other site, e.g.',
	'saveSettings' : 'Backup tours and settings',
	'saveSettingsDesc' : 'Backup / restore all tours, settings and moved coordinates:<ol><li>insert the following into the Firefox address line: <u>about:support</u></li><li>next to <u>Application Basics - Profile Directory</u> click on <u>Open Directory</u></li><li>switch to folder <u>gm_scripts</u></li><li>important: close Firefox now</li><li>save / restore the file <u>GC_Tour.db</u></li></ol>',

	// redesign begin 05.2012
	'settings' : {
		'gpx' : {
			'maxLogCount' : 'max aantal logs'
		}
	},
	'autoTour' : {
		'title' : 'autoTour',
		'wait' : 'Even geduld – autoTour wordt aangemaakt!',
		'radius' : 'Radius',
		'center' : 'Middelpunt',
		'help' : 'coördinaten of adres:<i>N50° 53.692 E004° 20.478</i> of <i>50.894867 4.341300</i> of <i>Atomium</i>',
		'refresh' : 'Bereken een autoTour aan met deze waarden!',
		'cacheCounts' : 'Geschat <i>aantal</i> geocaches in deze regio:',
		'duration' : 'Geschatte tijd om deze autoTour aan te maken:',
		'filter' : {
			'type' : 'Type',
			'size' : 'Grootte',
			'difficulty' : 'Moeilijkheid',
			'terrain' : 'Terrein',
			'special' : {
				'caption' : 'Speciaal',
				'pm' : {
					'not' : 'Is not a PM cache',
					'ignore' : 'Is PM or not PM cache',
					'only' : 'Is PM cache'
				},
				'notfound' : 'I haven\'t found ',
				'isActive' : 'is Active',
				'minFavorites' : 'min. Favorites'
			}
		}
	},
	'dlg' : {
		'sendMessage' : {
			'caption' : 'Bericht naar auteur versturen.',
			'content' : 'Heb je een bug gevonden? Suggesties betreffende GCTour? Ik had graag je mening gehoord.<br/>Stuur me gerust een <b>bericht</b>:',
			'submit' : 'Bericht versturen!'
			// old: 'sendMessageTitle', 'sendMessage', 'sendMessageSubmit'
		},
		'newVersion' : {
			'caption' : 'Nieuwe versie beschikbaar',
			'content' : 'Er is een nieuwe versie van GCTour beschikbaar.\nWil je upgraden? \n\n'
			// old: 'newVersionDialog', 'newVersionTitle'
		},
		'error' : {
			'content' : '<img src="' + $.gctour.img.sad + '">&nbsp;&nbsp;Spijtig genoeg is er een fout gebeurd.<br/>' +
			'Probeer het opnieuw proberen, of kijk voor <a href="#" id="gctour_update_error_dialog">update</a>!<br/><br/>'
			/* +
			'Als de fout blijft voorkomen, gelieve dan een foutenrapport te versturen.<br/>' +
			'<u>Noot</u><br/>' +
			'<textarea id="gctour_error_note" rows="4" style="width:99%"></textarea>',
			'send' : 'foutenrapport versturen'
			 */
			// old: 'ERROR_DIALOG', 'ERROR_DIALOG_SEND'
		}
	},
	'notifications' : {
		'addgeocache' : {
			'success' : {
				'caption' : '{0} werd toegevoegd',
				'content' : '<b>{0}</b> bevat nu <b>{1}</b>.'
			},
			'contains' : {
				'caption' : '{0} werd <i>niet</i> toegevoegd',
				'content' : '<b>{0}</b> bevat <b>{1}</b> reeds.'
			}
		}
	},
	'units' : {
		'km' : 'Kilometer',
		'mi' : 'Miles'
	},
	'send2cgeo' : {
		'title' : 'Naar c:geo versturen',
		'noWP'  : 'no own waypoints',
		'usage' : '<li>Start c:geo on your device and go to a list of saved caches</li>' +
				  '<li>Select Menu → Import → Import from send2cgeo</li>' +
				  '<li>The tour (without own waypoints) will automatically be downloaded from geocaching.com to the list of saved caches</li>' +
			      '<li>c:geo will continue to wait for more caches to be downloaded for 3 minutes</li>',
		'overview'  : 'Overview',
		'setup' : {
			'header' : 'Setup',
			'registerBrowser' : 'Click to register this browser for Send2cgeo',
			'desc1' : '<li>Run c:geo on your android device and select <i>Menu → Settings → Services → Send to c:geo</i></li>' +
					  '<li>Select <i>Request Registration</i>, you will get an info window showing a five digit PIN</li>',
			'desc2' : 'Enter PIN here:',
			'desc3' : 'Send PIN and add device'
		},
		'register' : 'Browser is not registered for Send2cgeo yet - please switch to "Setup" tab and register your browser.',
		'senderror' : 'An error occurred, please try again later.'
	}

};
$.gctour.i18n.pt = {
	'name' : 'Português',
	'language' : 'Idioma',
	'addToTour' : 'Adicionar &#224; rota',
	'addToCurrentTour' : "para a rota <b>seleccionada</b>",
	'addToNewTour' : 'para uma <b>nova</b> rota',
	'directPrint' : 'Imprimir esta Geocache',
	'moveGeocache' : 'Mover as coordenadas',
	'movedGeocache' : 'As coordenadas desta geocache foram mudadas.',
	'moveGeocacheHelp' : 'Tens a oportunidade de mudar as coordenadas originais desta geocache. Ser&#227;o usadas no modo de impress&#227;o e tamb&#233;m no ficheiro GPX. &#201; util se resolver o enigma.',
	'originalCoordinates' : 'Coordenadas Originais',
	'newCoordinates' : "Novas Coordenadas",
	'showCaches' : 'Adicionar Geocaches vis&#237;veis:',
	'markedCaches' : 'Add <b>marked</b> geocaches:', // ToDo
	'removeTourDialog' : "Deseja mesmo remover esta rota?",
	'logYourVisit' : "Registe a sua visita",
	'removeFromList' : "Remover da lista",
	'emptyList' : 'A lista est&#225; vazia.',
	'notLogedIn' : 'Você precisa estar logado, faça o login ...',
	'printviewTitle' : 'GCTour - ' + GCTOUR_HOST,
	'pleaseWait' : 'Por favor aguarde - a carregar conte&#250;do ...',
	'newList' : 'Nova Rota',
	'sendToGps' : 'Enviar para o GPS',
	'makeMap' : 'Visualizar no mapa',
	'makeMapWait' : 'A testar disponibilidade deste mapa',
	'reloadMap' : 'Reload map',
	'printview' : 'Modo de impress&#227;o',
	'print' : 'iniciar a impressão',
	'downloadGpx' : 'Transferir GPX',
	'showSettings' : 'Mostrar Configurações',
	'settings_caption' : 'Configurações',
	'settingsSelectLanguage' : 'Escolha idioma',
	'settingsSelectTheme' : 'Escolha Theme',
	'settingsPrintMinimal' : 'Modo de Impress&#227;o m&#237;nimo',
	'settingsLogCount' : 'N&#250;mero de logs no modo de impress&#227;o',
	'settingsLogCountNone' : 'nenhum',
	'settingsLogCountAll' : 'tudo',
	'settingsLogCountShow' : 'mostrar',
	'settingsEditDescription' : 'Descri&#231;&#227;o edit&#225;vel',
	'settingsRemoveImages' : 'remover imagem no clique',
	'settingsShowSpoiler' : 'Mostrar spoiler',
	'settingsAdditionalWaypoints' : 'Mostrar Waypoints Adicionais',
	'settingsAdditionalWaypoints2' : 'Add own waypoints to cache table',
	'settingsLoggedVisits' : 'Mostrar contador de log',
	'settingsAttributes' : 'mostrar Atributos',
	'settingsDecryptHints' : 'Decifrar dicas',
	'settingsSendToGPS' : 'enviar para o GPS',
	'settingsShowGPX' : 'mostrar o ficheiro GPX',
	'settingsDownladGPX' : 'transferir GPX<br />',
	'settingsGPX' : 'GPX',
	'settingsGPXHtml' : 'Descri&#231;&#227;o com HTML',
	'settingsUploadTour' : 'Enviar Rota',
	'settingsGPXStripGC' : 'Remover "GC" no GC-Code',
	'settingsGPXWpts' : 'Exportar waypoints adicionais',
	'settingsGPXAttributestoLog' : 'Criar login com atributos de cache',
	'settings_map' : 'Mapa',
	'settings_map_geocacheid' : 'Mostrar id da Geocache',
	'settings_map_geocacheindex' : 'Mostrar ind&#237;ce da Geocache',
	'settings_map_geocachename' : 'Mostrar nome da Geocache',
	'settings_map_awpts' : 'Mostrar Waypoints Adicionais',
	'settings_map_awpt_name' : 'Mostrar o nome dos Waypoints Adicionais',
	'settings_map_awpt_lookup' : 'Mostrar c&#243;digo dos Waypoints Adicionais',
	'settings_map_owpts' : 'Mostrar os nossos waypoints',
	'settings_map_owpt_name' : 'Mostrar o nome dos nossos waypoints',
	'loadTour' : 'Carregar Rota:<br />',
	'openTour' : 'Carregar uma Rota',
	'load' : 'carregar',
	'removeTour' : 'Apagar esta Rota',
	'deleteCoordinates' : 'Coordenadas para deletar',
	'copyTour' : 'Copiar Rota',
	'copy' : 'Copiar',
	'newTourDialog' : 'Introduza um nome para a nova rota ...',
	'rename' : 'Renomear',
	'upload' : 'Enviar rota',
	'onlineTour' : 'Transferir Rota',
	'webcodeDownloadHelp' : 'Por favor introduza aqui o c&#65533;digo que recebeu e clique em "Transferir Rota".',
	'webcodeDownloadButton' : 'Transferir Rota',
	'findMe' : 'Encontra-me!',
	'webcodeerror' : 'O C&#243;digo escolhido n&#227;o existe!',
	'tourUploaded1' : '<br>Rota enviada com sucesso! C&#243;digo:<br><b>',
	'tourUploaded2' : '</b><br><br>Pode ver a rota em <a href="' + GCTOUR_HOST + 'tour" target="_blank">' + GCTOUR_HOST + 'tour</a>.<br>Importante: Por favor anote o c&#243;digo para retirar a rota!!',
	'settingsFontSize' : 'Tamanho da letra',
	'settingsPageBreak' : 'Espa&#231;o na pagina depois da cache',
	'settingsPageBreakAfterMap' : 'Espa&#231;o na p&#225;gina depois do mapa',
	'webcodePrompt' : 'Transferir rota\nIntroduza um c&#243;digo v&#225;lido, para carregar a rota',
	'webcodesuccess' : ' foi carregada!',
	'webcodeOld' : '\n    !!ATEN&#199;&#195;O!!\nEste c&#243;digo est&#225; conectado com uma rota antiga. Para obter todos os benef&#237;cios do GCTour 2.0, tem de enviar a rota novamente.',
	'printviewCache' : 'geocache',
	'printviewFound' : 'encontrada',
	'printviewNote' : 'nota',
	'printviewMarker' : "waypoint pr&#243;prio",
	'printviewAdditionalWaypoint' : "waypoints adicionais",
	'printviewRemoveMap' : "remover mapa",
	'printviewZoomMap' : "Abrir este mapa num novo separador.",
	'settingsFrontPage' : 'Primeira p&#225;gina',
	'settingsOutlineMap' : 'Mapa com todas as caches',
	'settingsOutlineMapSingle' : 'Mapa para todas as caches',
	'settingsShowCacheDetails' : 'Print cache listings and own waypoints',
	'settingsDecryptHintsDesc' : 'As dicas v&#227;o estar decifradas no modo de impress&#227;o.',
	'settingsPrintMinimalDesc' : 'Cont&#233;m apenas a dica e o spoiler da geocache.',
	'settingsEditDescriptionDesc' : 'A descri&#231;&#227;o pode ser editada da forma como quiser.',
	'settingsShowSpoilerDesc' : 'Imagens de spoiler v&#227;o estar no modo de impress&#227;o.',
	'settingsAdditionalWaypointsDesc' : 'O modo de impress&#227;o vai conter uma tabela com todos os "Waypoints Adicionais" de uma geocache.',
	'settingsAdditionalWaypoints2Desc' : 'Own waypoints will be added to the cache table on front page. Otherwise an extra table will be added.',
	'settingsLoggedVisitsDesc' : 'Vai mostrar um resumo do "Contador de Visitas".',
	'settingsPageBreakDesc' : 'Depois de cada geocache vai existir uma espa&#231;amento. Vis&#237;vel depois da impress&#227;o.',
	'settingsPageBreakAfterMapDesc' : 'Vai existir um espa&#231;amento depois do resumo para separar as geocaches.',
	'settingsFrontPageDesc' : 'Um resumo vai ser gerado incluindo uma lista completa de todas as geocaches com um &#237;ndice e um espa&#231;o para colocar notas. ',
	'settingsOutlineMapDesc' : 'O resumo vai conter um mapa com todas as geocaches.',
	'settingsOutlineMapSingleDesc' : 'Depois de cada geocache est&#225; um mapa contendo a geocache e os seus "Waypoints Adicionais".',
	'settingsShowCacheDetailsDesc' : 'All geocache listings and own waypoints will be printed.',
	'settingsGPXHtmlDesc' : 'Alguns programas/GPSr tem problemas em mostrar as geocaches se a descri&#231;&#227;o estiver no formato HTML. Se a descri&#231;&#227;o estiver confusa, desactive este op&#231;&#227;o.',
	'settingsGPXWptsDesc' : 'Os waypoints-adicionais v&#227;o ser exportados como waypoint extra no GPX. Ir&#225; ver cada lugar de estacionamento na sua unidade.',
	'settingsGPXStripGCDesc' : 'GPSr antigos tem problemas com os waypoints com nome maior que 8 caracteres. Use esta op&#231;&#227;o se tem uma unidade destas.',
	'settingsGPXAttributestoLogDesc' : 'Atributos de cache também são registrados como um primeiro sinal.',
	'settings_map_geocacheidDesc' : 'O c&#243;digo GCCode (eg. GC0815) estar&#225; visivel no mapa.',
	'settings_map_geocacheindexDesc' : 'A posi&#231;&#227;o de cada waypoint estar&#225; vis&#237;vel na rota seleccionada.',
	'settings_map_geocachenameDesc' : 'O nome da geocache estar&#225; visivel.',
	'settings_map_awptsDesc' : 'Se seleccionada, os Waypoints-Adicionais v&#227;o estar vis&#237;veis.',
	'settings_map_awpt_nameDesc' : 'O nome dos Waypoints-Adicionais v&#227;o estar no mapa.',
	'settings_map_awpt_lookupDesc' : 'Os c&#243;digos dos Waypoints-Adicionais v&#227;o estar vis&#237;veis.',
	'settings_map_owptsDesc' : 'Se tem Waypoints seus na rota seleccionada e se esta op&#231;&#227;o estiver marcada, v&#227;o estar vis&#237;veis no mapa.',
	'settings_map_owpt_nameDesc' : 'Mostrar o nome dos seus Waypoints',
	'settings_map_gcdeDesc' : 'Se esta op&#231;&#227;o estiver marcada, ir&#225; ver no mapa do geocaching.de.',
	'settingsMapType' : 'Tipo de Mapa padr&#227;o',
	'settingsMapSize' : 'Tamanho de Mapa padr&#227;o',
	'addOwnWaypoint' : 'Adicionar o seu Waypoint',
	"markerCoordinate" : "Coordenadas",
	"markerContent" : "Conte&#250;do",
	"markerType" : "Tipo",
	"markerContentHint" : "estar&#225; visivel no modo de impress&#227;o",
	"markerCaption" : "captura",
	"save" : "Guardar",
	"cancel" : "Cancelar",
	"close" : "Fechar",
	'install' : 'Instalar',
	"edit" : "editar",
	"example" : "ex. ",
	"exampleCoords" : "<i>N51&#186; 12.123 E010&#186; 23.123</i> ou <i>40.597 -75.542</i>",
	"dontPrintHint" : "<b>Informa&#231;&#227;o :</b><br />Elementos na caixa <u>n&#227;o</u> v&#227;o ser impressos!",
	"SCRIPT_ERROR" : "Aparenta que est&#225; a bloquear algumas fontes de javascript (ex. NoScript). Por favor permita 'geocaching.com' permanentemente para usar GCTour!",
	"mapHeight" : "Height",
	'mapTypes' :
	[{
			"caption" : "Google Map",
			"value" : "roadmap"
		}, {
			"caption" : "Google Satellite",
			"value" : "satellite"
		}, {
			"caption" : "Google Hybrid",
			"value" : "hybrid"
		}, {
			"caption" : "Google Terrain",
			"value" : "terrain"
		}, {
			"caption" : "Topo Germany",
			"value" : "oda"
		}, {
			"caption" : "OSM Mapnik",
			"value" : "mapnik"
		}, {
			"caption" : "OSM Osma",
			"value" : "osma"
		}, {
			"caption" : "OSM Cycle",
			"value" : "osmaC"
		}, {
			"caption" : "OSM Public Transport",
			"value" : "osmaP"
		}
	],
	'updateDialog' : "<div><p>Existe uma nova vers&#227;o de <a target='_blank' href='https://gist.github.com/DieBatzen/5814dc7368c1034470c8'><b>GCTour</b></a> dispon&#237;vel para instalar.</p><p>Tem a versão <b>###VERSION_OLD###</b> instalada. A &#250;ltima versão &#233; <b>###VERSION_NEW###</b>.</p><div class='dialogFooter'></div>",
	'updateCurrently' : 'GCTour ' + VERSION + ' está atualmente!',
	'switchSite' : 'To use this function please switch to any other site, e.g.',
	'saveSettings' : 'Backup tours and settings',
	'saveSettingsDesc' : 'Backup / restore all tours, settings and moved coordinates:<ol><li>insert the following into the Firefox address line: <u>about:support</u></li><li>next to <u>Application Basics - Profile Directory</u> click on <u>Open Directory</u></li><li>switch to folder <u>gm_scripts</u></li><li>important: close Firefox now</li><li>save / restore the file <u>GC_Tour.db</u></li></ol>',

	// redesign begin 05.2012
	'settings' : {
		'gpx' : {
			'maxLogCount' : 'Número máximo de logs'
		}
	},
	'autoTour' : {
		'title' : 'autoRota',
		'wait' : 'Por favor aguarde - criando a autoRota!',
		'radius' : 'Raio',
		'center' : 'Centro',
		'help' : 'Coordenadas ou Endere&#231;o:<i>N51&#186; 12.123 E010&#186; 23.123</i> ou <i>40.597 -75.542</i> ou <i>Paris Eiffel Tower</i>',
		'refresh' : 'Oblicz autoRota com estes valores!',
		'cacheCounts' : '<i>N&#250;mero</i> estimado de caches na regi&#227;o:',
		'duration' : 'Previs&#227;o do tempo de cria&#231;&#227;o desta autoRota:',
		'filter' : {
			'type' : 'Typ',
			'size' : 'Rozmiar',
			'difficulty' : 'Trudność',
			'terrain' : 'Teren',
			'special' : {
				'caption' : 'Specjalne',
				'pm' : {
					'not' : 'Is not a PM cache',
					'ignore' : 'Is PM or not PM cache',
					'only' : 'Is PM cache'
				},
				'notfound' : 'I haven\'t found ',
				'isActive' : 'is Active',
				'minFavorites' : 'min. Favorites'
			}
		}
	},
	'dlg' : {
		'sendMessage' : {
			'caption' : 'Enviar uma mensagem para o autor.',
			'content' : 'Encontrou um erro? Deseja sugerir algo para o GCTour? Desejamos ouvir a sua opini&#227;o.<br />Envie uma <b>mensagem</b>:',
			'submit' : 'Submeter a mensagem!'
			// old: 'sendMessageTitle', 'sendMessage', 'sendMessageSubmit'
		},
		'newVersion' : {
			'caption' : 'Nova versão dispon&#xED;vel',
			'content' : 'Existe uma nova vers&#227;o de GCTour.\nDeseja actualizar? \n\n'
			// old: 'newVersionDialog', 'newVersionTitle'
		},
		'error' : {
			'content' : '<img src="' + $.gctour.img.sad + '">&nbsp;&nbsp;Lamento mas ocorreu um erro.<br/>' +
			'Por favor tente outra vez, ou procure por uma <a href="#" id="gctour_update_error_dialog">atualização</a>!<br/><br/>'
			/*+
			'Se este erro voltar a aparecer, por favor envie um relat&#243;rio.<br/>' +
			'<u>Nota</u><br/>' +
			'<textarea id="gctour_error_note" rows="4" style="width:99%"></textarea>',
			'send' : 'enviar relatório'
			 */
			// old: 'ERROR_DIALOG', 'ERROR_DIALOG_SEND'
		}
	},
	'notifications' : {
		'addgeocache' : {
			'success' : {
				'caption' : '{0} foi adicionada!',
				'content' : '<b>{0}</b> agora inclui <b>{1}</b>.'
			},
			'contains' : {
				'caption' : '{0} não foi adicionada',
				'content' : '<b>{0}</b> contém <b>{1}</b> já.'
			}
		}
	},
	'units' : {
		'km' : 'Quilometros',
		'mi' : 'Milhas'
	},
	'send2cgeo' : {
		'title' : 'Enviar para o c:geo',
		'noWP'  : 'no own waypoints',
		'usage' : '<li>Start c:geo on your device and go to a list of saved caches</li>' +
				  '<li>Select Menu → Import → Import from send2cgeo</li>' +
				  '<li>The tour (without own waypoints) will automatically be downloaded from geocaching.com to the list of saved caches</li>' +
			      '<li>c:geo will continue to wait for more caches to be downloaded for 3 minutes</li>',
		'overview'  : 'Overview',
		'setup' : {
			'header' : 'Setup',
			'registerBrowser' : 'Click to register this browser for Send2cgeo',
			'desc1' : '<li>Run c:geo on your android device and select <i>Menu → Settings → Services → Send to c:geo</i></li>' +
					  '<li>Select <i>Request Registration</i>, you will get an info window showing a five digit PIN</li>',
			'desc2' : 'Enter PIN here:',
			'desc3' : 'Send PIN and add device'
		},
		'register' : 'Browser is not registered for Send2cgeo yet - please switch to "Setup" tab and register your browser.',
		'senderror' : 'An error occurred, please try again later.'
	}

};
// init translations
(function () {
	/*
	$.each( $.gctour.i18n, function( l, o ) {
	alert( ((o.name) || "unbekannt") );
	//$.each( o, function( key, trans ) {
	//  alert( key  + " : "  + trans );
	//});
	});
	 */

	/*
	return translate from [language][str]
	is language or str undefined = return ""
	 */
	$.gctour.lang = function (str) {
		var i18n = $.gctour.i18n,
		cur = $.gctour.currentLang,
		def = $.gctour.defaultLang,
		i,
		arr,
		lang,
		trans,
		cur_trans,
		def_trans;

		// Übersetzungssuchstring ggf. splitten für Objekte
		arr = str.split(".");

		cur_trans = i18n[cur] || false;
		def_trans = i18n[def] || false;

		// Versuch die Übersetzung zu holen
		// 'boolean' : false => wird richtig ausgegeben
		for (i = 0; i < arr.length; i++) {
			cur_trans = (cur_trans && (cur_trans[arr[i]] !== undefined)) ? cur_trans[arr[i]] : undefined;
			def_trans = (def_trans && (def_trans[arr[i]] !== undefined)) ? def_trans[arr[i]] : undefined;
		}

		// Check ob Übersetzung erfolgreich geholt werden konnte
		trans = (cur_trans !== undefined) ? cur_trans :
		(def_trans !== undefined) ? def_trans :
		((DEBUG_MODE === true) ? "NO LANGUAGE" : "");

		// debug info current language
		if (!i18n[cur]) {
			debug("ERROR: language '" + cur + "' is undefined");
		} else if (cur_trans === undefined) {
			debug("ERROR: active language (" + cur + "), search '" + str + "' is undefined");
		}

		// debug info default language
		if (!i18n[def]) {
			debug("ERROR: language '" + def + "' is undefined");
		} else if (def_trans === undefined) {
			debug("ERROR: default language (" + def + "), search '" + str + "' is undefined");
		}

		return trans;
	};

})();

/* styles: CSS Container, run before init() */
function initStyle() {
	// adding styles:
	GM_addStyle(("" +
			"/* GCTour - Container */" +
			"" +
			"#gctourButtonWrapper {" +
			"  height: 32px !important;" +
			"  padding: 0 !important;" +
			"  position: fixed !important;" +
			"  top: 30px !important;" +
			"  width: 35px !important;" +
			"  background-color: #fff;" +
			"  z-index: 1001 !important;" +
			"  border: 1px solid #333;" +
			"  border-width: 1px 1px 1px 0;" +
			"  border-radius: 0 5px 5px 0;" +
			"  -moz-user-select: none;" +
			"}" +
			"" +
			"#gctourButtonWrapper img {" +
			"  position: relative;" +
			"  top: 8px;" +
			"  left: 8px;" +
			"}" +
			"" +
			"#gctourContainer {" +
			"  background-color: #fff;" +
			"  overflow: hidden;" +
			"  left: -210px;" +
			"  padding: 0 !important;" +
			"  position: fixed !important;" +
			"  top: 15px !important;" +
			"  width: 200px;" +
			"  z-index: 1002 !important;" +
			"  border: 1px solid #333;" +
			"  border-left: 0px;" +
			"  border-radius: 0 5px 5px 0;" +
			"  font-size: 12px;" +
			"  font-family: Arial;" +
			"  line-height: 1.5;" +
			"}" +
			"" +
			"#gctourContainer .cachelist {" +
			"  width: 100%;" +
			"  margin: 0;" +
			"  padding:0;" +
			"  font-size:80%;" +
			"  list-style-type:none;" +
			"}" +
			"" +
			"#gctourContainer .cachelist li {" +
			"  color:#000;" +
			"  margin:0.5em;" +
			"  padding:3px;" +
			"  width:120px;" +
			"  min-height:44px;" +
			"  list-style-position:inside;" +
			"  border:1pt dashed gray;" +
			"  background-color:#FFF;" +
			"  -moz-background-clip:border;" +
			"  -moz-background-inline-policy:continuous;" +
			"  -moz-background-origin:padding;" +
			"  -moz-border-radius:8px 0 8px 0;" +
			"  border-radius:8px 0 8px 0;" +
			"}" +
			"" +
			"#gctourContainer img.imgShadow {" +
			"  -moz-box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.2);" +
			"  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.2);" +
			"  background-color: lightgray;" +
			"}" +
			"" +
			"#gctourContainer img.tourImage {" +
			"  cursor: pointer;" +
			"  margin: 0 2px 0 2px;" +
			"}" +
			"" +
			"/* Styling the placeholder for when the user starts dragging an item */" +
			"" +
			"#gctourContainer li.ui-sortable-placeholder {" +
			"  min-height:50px;" +
			"  max-height:80px;" +
			"  width: 90%;" +
			"  background-color: rgba(0, 0, 0, 0.03);" +
			"}" +
			"/* GCTour - Grand */" +
			"" +
			".gctour-grand-default {" +
			"  /* http://www.colorzilla.com/gradient-editor/#a7cfef+0,c9dded+3,ffffff+10;gctour-grand-default" +
			"  *  http://css3please.com/" +
			"  */" +
			"  background: rgb(167,207,239); /* Old browsers */" +
			"  background: -moz-linear-gradient(top,  rgba(167,207,239,1) 0%, rgba(201,221,237,1) 3px, rgba(255,255,255,1) 10px); /* FF3.6+ */" +
			"  background: -webkit-linear-gradient(top,  rgba(167,207,239,1) 0%,rgba(201,221,237,1) 3px,rgba(255,255,255,1) 10px); /* Chrome10+,Safari5.1+ */" +
			"  background: -o-linear-gradient(top,  rgba(167,207,239,1) 0%,rgba(201,221,237,1) 3px,rgba(255,255,255,1) 10px); /* Opera 11.10+ */" +
			"  background: linear-gradient(top,  rgba(167,207,239,1) 0%,rgba(201,221,237,1) 3px,rgba(255,255,255,1) 10px); /* W3C */" +
			"}" +
			"" +
			".gctour-grand-hover {" +
			"  /* http://www.colorzilla.com/gradient-editor/#ffad32+0,ffd699+3,ffffff+10;gctour-grand-hover */" +
			"  background: rgb(255,173,50); /* Old browsers */" +
			"  background: -moz-linear-gradient(top,  rgba(255,173,50,1) 0%, rgba(255,214,153,1) 3px, rgba(255,255,255,1) 10px); /* FF3.6+ */" +
			"  background: -webkit-linear-gradient(top,  rgba(255,173,50,1) 0%,rgba(255,214,153,1) 3px,rgba(255,255,255,1) 10px); /* Chrome10+,Safari5.1+ */" +
			"  background: -o-linear-gradient(top,  rgba(255,173,50,1) 0%,rgba(255,214,153,1) 3px,rgba(255,255,255,1) 10px); /* Opera 11.10+ */" +
			"  background: linear-gradient(top,  rgba(255,173,50,1) 0%,rgba(255,214,153,1) 3px,rgba(255,255,255,1) 10px); /* W3C */" +
			"}" +
			"" +
			".gctour-grand-highlight {" +
			"  /*  http://www.colorzilla.com/gradient-editor/#ffe000+0,ffee7f+3,ffffff+10;gctour-grand-highlight */" +
			"  background: rgb(255,224,0); /* Old browsers */" +
			"  background: -moz-linear-gradient(top,  rgba(255,224,0,1) 0%, rgba(255,238,127,1) 3px, rgba(255,255,255,1) 10px); /* FF3.6+ */" +
			"  background: -webkit-linear-gradient(top,  rgba(255,224,0,1) 0%,rgba(255,238,127,1) 3px,rgba(255,255,255,1) 10px); /* Chrome10+,Safari5.1+ */" +
			"  background: -o-linear-gradient(top,  rgba(255,224,0,1) 0%,rgba(255,238,127,1) 3px,rgba(255,255,255,1) 10px); /* Opera 11.10+ */" +
			"  background: linear-gradient(top,  rgba(255,224,0,1) 0%,rgba(255,238,127,1) 3px,rgba(255,255,255,1) 10px); /* W3C */" +
			"}" +
			"" +
			".gctour-grand-active {" +
			"  /* Grün http://www.colorzilla.com/gradient-editor/#3dff32+0,9eff99+3,ffffff+10;gctour-grand-active */" +
			"  background: rgb(61,255,50); /* Old browsers */" +
			"  background: -moz-linear-gradient(top,  rgba(61,255,50,1) 0%, rgba(158,255,153,1) 3px, rgba(255,255,255,1) 10px); /* FF3.6+ */" +
			"  background: -webkit-linear-gradient(top,  rgba(61,255,50,1) 0%,rgba(158,255,153,1) 3px,rgba(255,255,255,1) 10px); /* Chrome10+,Safari5.1+ */" +
			"  background: linear-gradient(top,  rgba(61,255,50,1) 0%,rgba(158,255,153,1) 3px,rgba(255,255,255,1) 10px); /* W3C */$$$$" +
			"  background: -o-linear-gradient(top,  rgba(61,255,50,1) 0%,rgba(158,255,153,1) 3px,rgba(255,255,255,1) 10px); /* Opera 11.10+ */" +
			"}" +
			"" +
			".gctour-grand-error {" +
			"  /* http://www.colorzilla.com/gradient-editor/#ff3232+0,ff9999+3,ffffff+10;gctour-grand-error */" +
			"  background: rgb(255,50,50); /* Old browsers */" +
			"  background: -moz-linear-gradient(top,  rgba(255,50,50,1) 0%, rgba(255,153,153,1) 3px, rgba(255,255,255,1) 10px); /* FF3.6+ */" +
			"  background: -webkit-linear-gradient(top,  rgba(255,50,50,1) 0%,rgba(255,153,153,1) 3px,rgba(255,255,255,1) 10px); /* Chrome10+,Safari5.1+ */" +
			"  background: -o-linear-gradient(top,  rgba(255,50,50,1) 0%,rgba(255,153,153,1) 3px,rgba(255,255,255,1) 10px); /* Opera 11.10+ */" +
			"  background: linear-gradient(top,  rgba(255,50,50,1) 0%,rgba(255,153,153,1) 3px,rgba(255,255,255,1) 10px); /* W3C */" +
			"}" +
			"" +
			"/* GCTour Slider */" +
			"" +
			".gct_scrollbar {" +
			"  background-color:pink;" +
			"  height: 20px;" +
			"  left: 0;" +
			"  position: absolute;" +
			"  top: 0;" +
			"  width: 100%;" +
			"}" +
			"" +
			".gct_scroller{" +
			"  background-color:lime;" +
			"  height: 20px;" +
			"  left: 0;" +
			"  position: absolute;" +
			"  top: 0;" +
			"  width: 20px;  " +
			"}" +
			"" +
			"" +
			"/* GCTour Pop-Up */" +
			"" +
			".gct_popup{" +
			"  position:absolute;" +
			"  z-index:10;   " +
			"  width:172px;" +
			"  height:102px;" +
			"  text-align:center;" +
			"  color:#FF0000;" +
			"  font: 14px Verdana, Arial, Helvetica, sans-serif;" +
			"  background-color:lime;" +
			"  border-radius: 5px;" +
			"}" +
			"" +
			".gct_popup_header{" +
			"  border-radius: 5px 5px 0px 0px;" +
			"}" +
			"" +
			".dialogMask {" +
			"  background-image:url(##dialogMaskImage##);" +
			"  height:100%;" +
			"  left:0;" +
			"  opacity:0.7;" +
			"  position:fixed;" +
			"  top:0;" +
			"  width:100%;" +
			"  z-index:1100;" +
			"}" +
			"" +
			".dialogBody {" +
			"  -moz-border-radius:5px;" +
			"  border-radius:5px;" +
			"  background:none repeat scroll 0 0 #fff;" +
			"  border:1px solid #333333;" +
			"  color:#333333;" +
			"  cursor:default;" +
			"  font-family:Arial;" +
			"  font-size:12px;" +
			"  left:50%;" +
			"  margin-left:-250px;" +
			"  margin-top:20px;" +
			"  padding:0 0 1em;" +
			"  position:fixed;" +
			"  text-align:left;" +
			"  top:0;" +
			"  width:600px;" +
			"  z-index:1101;" +
			"  max-height:85%;" +
			"  min-height:440px;" +
			"  overflow:auto;" +
			"}" +
			"" +
			".dialogBody p {" +
			"  font-size:12px;" +
			"  font-weight:normal;" +
			"  margin:1em 0;" +
			"}" +
			"" +
			".dialogBody button {" +
			"  background: none no-repeat scroll 4px center #eeeeee;" +
			"  border: 1px outset #666666" +
			"}" +
			"" +
			".dialogBody button:hover {" +
			"  background-color: #f9f9f9;" +
			"}" +
			"" +
			".header h1 {" +
			"  background-color:#B2D4F3;" +
			"  background-repeat:repeat-x;" +
			"  font-size:110% !important;" +
			"  font-family:Helvetica Neue,Arial,Helvetica,sans-serif;" +
			"  margin-bottom:0.2em;" +
			"  margin-top:0;" +
			"  padding:0.5em;" +
			"  -moz-border-radius: 5px 5px 0 0;" +
			"  border-radius: 5px 5px 0 0;" +
			"  color:#333333;" +
			"  background-image:url(##tabBgImage##)" +
			"}" +
			"" +
			"/*" +
			".dialogBody h1 {" +
			"  background-color:#7A7A7A;" +
			"  border-bottom:1px solid #333333;" +
			"  font-size:110%;" +
			"  font-family:Helvetica Neue,Arial,Helvetica,sans-serif;" +
			"  margin-bottom:0.2em;" +
			"  padding:0.5em;" +
			"  -moz-border-radius:5px 5px 0px 0px;" +
			"  border-radius:5px 5px 0px 0px;" +
			"  color:#fff;" +
			"}" +
			"*/" +
			"" +
			".dialogHistory {" +
			"  border:1px inset #999999;" +
			"  margin:0 1em 1em;" +
			"  padding-bottom: 1em;" +
			"  max-height: 200px;" +
			"  overflow-y:auto;" +
			"  width:518px;" +
			"  padding-left:1em;" +
			"}" +
			"" +
			".dialogHistory ul {" +
			"  margin-left:2em;" +
			"}" +
			"" +
			".dialogHistory li {" +
			"  list-style-type:circle;" +
			"}" +
			"" +
			".dialogFooter input {" +
			"  -moz-border-radius:3px;" +
			"  border-radius:3px;" +
			"  background:none no-repeat scroll 4px center #EEEEEE;" +
			"  border:1px outset #666666;" +
			"  cursor:pointer;" +
			"  float:right;" +
			"  margin-left:0.5em;" +
			"  padding:3px 5px 5px 20px;" +
			"  min-width:100px;" +
			"  font-size: 12px;" +
			"}" +
			"" +
			".dialogFooter input:hover {" +
			"  background-color:#f9f9f9;" +
			"}" +
			"" +
			".dialogContent {" +
			"  padding:0 10px 0 10px;" +
			"}" +
			"" +
			".dialogMin {" +
			"  min-height:0 !important" +
			"}" +
			"" +
			"" +
			"/* neuer Dialog-Style mit jQuery-ui + gcTour Header (.gct_dialog) */" +
			"" +
			".gct_dialog {" +
			"  font-size: 100% !important;" +
			"  font-family: Arial !important;" +
			"}" +
			".gct_dialog .ui-widget {" +
			"}" +
			".gct_dialog.ui-dialog {" +
			"  padding: 0;" +
			"}" +
			".gct_dialog.ui-dialog .ui-widget-header {" +
			"  border: 0;" +
			"}" +
			".gct_dialog.ui-dialog .ui-dialog-titlebar {" +
			"  padding: 0.2em 0.1em;" +
			"  background: -moz-linear-gradient(center top, #A7CFEF 0%, #C9DDED 3px, #FFFFFF 10px) repeat scroll 0 0 transparent;" +
			"  color: #000;" +
			"}" +
			".gct_dialog.ui-dialog .ui-dialog-title {" +
			"  padding-top: 4px;" +
			"  text-align: left;" +
			"  padding-left: 120px;" +
			"  width: 75%;" +
			"  background: url(##gctourLogo##) 2px 2px no-repeat;" +
			"}" +
			".gct_dialog.ui-dialog .ui-dialog-buttonpane {" +
			"  padding: 0 0.4em 0 0.4em;" +
			"}" +
			".gct_dialog .ui-button-text-only .ui-button-text {" +
			"  padding: 0.2em 0.8em;" +
			"}" +
			".gct_dialog .ui-progressbar .ui-progressbar-value {" +
			"  margin: 0;" +
			"}" +
			".gct_dialog .progressbar-label {" +
			"  width: 80%;" +
			"  text-align: center;" +
			"}" +
			"" +
			"#dialogDetails {" +
			"  height:364px;" +
			"  padding:3px;" +
			"  overflow:auto;" +
			"  background-color:#eff4f9;" +
			"  border:1px solid #C0CEE3;" +
			"  -moz-border-radius: 0 5px 5px 0;" +
			"  width:424px;" +
			"  position: absolute;" +
			"  right: 10px;" +
			"}" +
			"" +
			".dialogList li {" +
			"  font-size:10px;" +
			"  padding:3px;" +
			"  clear:both;" +
			"  list-style-type: none;" +
			"}" +
			"" +
			".dialogList {" +
			"  margin:0;" +
			"  padding:0" +
			"}" +
			"" +
			".activeTour {" +
			"  border: 1px solid #C0CEE3;" +
			"  -moz-border-radius: 5px 0 0 5px;" +
			"  border-radius: 5px 0 0 5px;" +
			"  background-color:#eff4f9;" +
			"  padding:1px;" +
			"}" +
			"#dialogListContainer {" +
			"  height:374px;" +
			"  overflow:auto;" +
			"  width:146px;" +
			"  position: absolute;" +
			"  left: 10px;" +
			"}" +
			"" +
			".unselectable {" +
			"  -o-user-select: none;" +
			"  -webkit-user-select: none;" +
			"  -moz-user-select: -none;" +
			"  -khtml-user-select: none;" +
			"  user-select: none;" +
			"}" +
			"" +
			"#cacheList .counter {" +
			"  position:absolute;" +
			"  right:4px;" +
			"  bottom: 0;" +
			"  z-index:0;" +
			"  overflow:hidden;" +
			"  font: normal 24px arial,sans-serif;" +
			"  color: #d5d5d5;" +
			"  text-align:right;" +
			"  text-shadow: 1px 1px 1px #C0C0C0;" +
			"  vertical-align: text-bottom;" +
			"  background-color: transparent;" +
			"  margin-right:0;" +
			"  margin-bottom:0;" +
			"  padding: 0;" +
			"}" +
			"" +
			"#gctour-notification-box {" +
			"  position: fixed;" +
			"  right: 4px;" +
			"  bottom: 2%;" +
			"  width: 220px;" +
			"  height: auto;" +
			"  max-height: 96%;" +
			"  overflow: hidden;" +
			"  overflow-y: auto;" +
			"  list-style-type: none;" +
			"  margin: 0;" +
			"  padding: 0;" +
			"  z-index: 1100;" +
			"}" +
			"" +
			"#gctour-notification-box li {" +
			"  overflow: hidden;" +
			"  background-image: url('" + $.gctour.img.bg + "');" +
			"  background-repeat: repeat-x;" +
			"  background-attachment: scroll;" +
			"  background-position: left top;" +
			"  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);" +
			"  width: 220px;" +
			"  cursor: pointer;" +
			"}" +
			"" +
			".gctour-notification-green {" +
			"  background-color: lightgreen;" +
			"  color: #000000;" +
			"  border: 1px solid #50C24E;" +
			"  text-shadow: 0 1px 0 #FFFFFF;" +
			"}" +
			"" +
			".gctour-notification-red {" +
			"  background-color: red;" +
			"  border: 1px solid #8B0000;" +
			"  color: #FFFFFF;" +
			"  text-shadow: 0 1px 0 #000000;" +
			"}" +
			"" +
			".gctour-notification-blue {" +
			"  background-color: #57B7E2;" +
			"  border: 1px solid #0B90C4;" +
			"  color: #000000;" +
			"  text-shadow: 0 1px 0 #FFFFFF;" +
			"}" +
			"" +
			".gctour-notification-yellow {" +
			"  background-color: #FFFC00;" +
			"  border: 1px solid #FFC237;" +
			"  color: #000000;" +
			"  text-shadow: 0 1px 0 #FFFFFF;" +
			"}" +
			"" +
			"/* jquery ui overwrite */" +
			"" +
			".ui-front {" +
			"  z-index: 1100 !important;" +
			"}" +
			"" +
			".ui-button-icon-only .ui-icon {" +
			"  margin-top: -8px !important;" +
			"  margin-left: -8px !important;" +
			"}" +
			"" +
			".gct .ui-widget-content {" +
			"  background: #FFFFFF;" +
			"  /* border: 0; */" +
			"}" +
			"" +
			".gct .ui-widget-content a {" +
			"  color: #00447c;" + // blue color
			"  text-decoration: underline;" + // underline text
			"}" +
			"" +
			".ui-button-text-only .ui-button-text {" +
			"  padding: .2em .6em;" +
			"}" +
			"" +
			"input.ui-button {" +
			"  padding: .2em .6em;" +
			"}" +
			"" +
			".ui-dialog .ui-dialog-buttonpane {" +
			"  margin-top: 0;" +
			"}" +
			"" +
			"/* Handling of Groundspeak's stylesheets: different sites use different stylesheets */" +
			"" +
			".gctour-input-checkbox {" +
			"  position: relative !important;" +
			"  opacity: 1 !important;" +
			"  width: 14px !important;" +
			"  height: 14px !important;" +
			"}" +
			"" +
			".gctour-input-text {" +
			"  padding: unset !important;" +
			"  font-size: 1em !important;" +
			"  font-family: inherit !important;" +
			"  border: 1px solid #ccc !important;" +
			"  border-radius: 3px !important;" +
			"}" +
			"" +
			".gctour-label {" +
			"  display: unset !important;" +
			"}" +
			"" +
			".gctour-small {" +
			"  font-size: 0.6875rem !important;" +
			"}" +
			"")
		.replace("##gctourLogo##", $.gctour.img.gctourLogo)
		.replace("##dialogMaskImage##", $.gctour.img.dialogMask)
		.replace("##tabBgImage##", $.gctour.img.tabBg));

}

/* utilities */
// Read all GET URL variables and return them as an associative array.
function getUrlVars(url) {
	var vars = [],
	hash;
	var hashes = url.slice(url.indexOf('?') + 1).split('&');
	for (var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}

// USAGE: createElement('table',{style:"border-collapse:separate;"});append(image_table,dummy_images);
function createElement(type, attributes) {
	var node = document.createElement(type),
	attr;
	for (attr in attributes) {
		if (attributes.hasOwnProperty(attr)) {
			node.setAttribute(attr, attributes[attr]);
		}
	}
	return node;
}

function append(thisElement, toThis) {
	return toThis.appendChild(thisElement);
}

function fillTemplate(mapping, template) {
	var j,
	dummy;
	for (j = 0; j < mapping.length; j++) {
		template = template.replaceAll("###" + mapping[j][0] + "###", mapping[j][1]);
	}

	dummy = createElement('div');
	dummy.innerHTML = template;
	return dummy.firstChild;
}

// rot13.js from gc.com
function createROT13array() {
	var A = 0,
	C = [],
	D = "abcdefghijklmnopqrstuvwxyz",
	B = D.length;
	for (A = 0; A < B; A++) {
		C[D.charAt(A)] = D.charAt((A + 13) % 26);
	}
	for (A = 0; A < B; A++) {
		C[D.charAt(A).toUpperCase()] = D.charAt((A + 13) % 26).toUpperCase();
	}
	return C;
}

function convertROT13Char(A) {
	return (A >= "A" && A <= "Z" || A >= "a" && A <= "z" ? rot13array[A] : A);
}

function convertROT13String(C) {
	var A = 0,
	B = C.length,
	D = "";
	if (!rot13array) {
		rot13array = createROT13array();
	}
	for (A = 0; A < B; A++) {
		D += convertROT13Char(C.charAt(A));
	}
	return D;
}

function convertROTStringWithBrackets(C) {
	var F = "",
	D = "",
	E = true,
	A = 0,
	B = C.length;

	if (!rot13array) {
		rot13array = createROT13array();
	}

	for (A = 0; A < B; A++) {
		F = C.charAt(A);

		if (A < (B - 4)) {
			if (C.toLowerCase().substr(A, 4) == "<br/>") {
				D += "<br/>";
				A += 3;
				continue;
			}
		}

		if (F == "[" || F == "<") {
			E = false;
		} else {
			if (F == "]" || F == ">") {
				E = true;
			} else {
				if ((F === " ") || (F === "&dhbg;")) {}
				else {
					if (E) {
						F = convertROT13Char(F);
					}
				}
			}
		}

		D += F;
	}
	return D;
}

// Replace all  &,< and > with their HTML tag
function escapeHTML(htmlString) {
	return (!htmlString) ? "" : htmlString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// strip all ASCII control codes (range 0-31) from a string, except LF and CR
function stripASCIIcodes(s) {
	return s.split('').filter(function(x) {
		var n = x.charCodeAt(0);
		return n==10 || n==13 || n>31; // keep LF and CR
	}).join('');
}

function xsdDateTime(date) {
	function pad(n) {
		var s = n.toString();
		return (s.length < 2) ? '0' + s : s;
	}

	var yyyy = date.getFullYear(),
	mm1 = pad(date.getMonth() + 1),
	dd = pad(date.getDate()),
	hh = pad(date.getHours()),
	mm2 = pad(date.getMinutes()),
	ss = pad(date.getSeconds());

	return yyyy + '-' + mm1 + '-' + dd + 'T' + hh + ':' + mm2 + ':' + ss + 'Z';
}

function getAsync(url, cb) {
	if (DEBUG_MODE) {console.trace();}
	log([
			"---GET ASYNC---",
			"\turl: " + url,
			"---/GET ASYNC/---"
		].join("\n"));

	GM_xmlhttpRequest({
		method : "GET",
		url : url,
		onload : function (xhr) {
			//responseInfo(xhr);
			cb(xhr);
		}
	});
}

function getSync(url) {
	if (DEBUG_MODE) {console.trace();}
	log(["---GET SYNC---",
			"\turl: " + url,
			"---/GET SYNC/---"
		].join("\n"));

	var result = GM_xmlhttpRequest({
			method : "GET",
			url : url,
			synchronous : true
		});

	return result;
}

function postAsync(url, data, cb) {
	if (DEBUG_MODE) {console.trace();}
	log([
			"---POST ASYNC---",
			"\turl: " + url,
			"\tdata: " + data,
			"---/POST ASYNC/---"
		].join("\n"));

	GM_xmlhttpRequest({
		method : "POST",
		url : url,
		headers : {
			'Content-type' : 'application/x-www-form-urlencoded'
		},
		data : encodeURI(data),
		onload : function (xhr) {
			//responseInfo(xhr);
			cb(xhr);
		}
	});
}

function postSync(url, data) {
	if (DEBUG_MODE) {console.trace();}
	log([
			"---POST SYNC---",
			"\turl: " + url,
			"\tdata: " + data,
			"---/POST SYNC/---"
		].join("\n"));

	var result = GM_xmlhttpRequest({
			method : "POST",
			url : url,
			headers : {
				'Content-type' : 'application/x-www-form-urlencoded'
			},
			data : encodeURI(data),
			synchronous : true
		});

	return result;
}

function getPromise(url) {
	log(["---GET PROMISE---",
			"\turl: " + url,
			"---/GET PROMISE/---"
		].join("\n"));

	// return a promise
	return new Promise(function (resolve, reject) {
		GM_xmlhttpRequest({
			method : "GET",
			url : url,
			onload : function (result) {
				resolve(result);
			}
		});
	});
}

function postPromise(url, data) {
	log(["---POST PROMISE---",
			"\turl: " + url,
			"\tdata: " + data,
			"---/POST PROMISE/---"
		].join("\n"));

	// return a promise
	return new Promise(function (resolve, reject) {
		GM_xmlhttpRequest({
			method : "POST",
			url : url,
			headers : {
				'Content-type' : 'application/x-www-form-urlencoded'
			},
			data : encodeURI(data),
			onload : function (result) {
				//responseInfo(result);
				resolve(result);
			}
		});
	});
}

// inspiration: dojo.date.difference (http://jsfiddle.net/fr4Na/)
function DateDiff(date1, date2, einheit) {
	var ms = date1.getTime() - date2.getTime(); // milliseconds
	var diff;

	switch (einheit) {
	case "second":
		diff = ms / 1000;
		break;
	case "minute":
		diff = ms / 60000; // 1000 * 60
		break;
	case "hour":
		diff = ms / 3600000; // 1000 * 60 * 60
		break;
	case "day":
		diff = ms / 86400000; // 1000 * 60 * 60 * 24
		break;
	case "week":
		diff = ms / 604800000; // 1000 * 60 * 60 * 24 * 7
		break;
	default:
		diff = ms;
		break;
	}

	return diff;
}

function getDateFormat(force) {
	var myUrl = GS_HOST + 'account/settings/preferences',
	response_div,
	date_format;

	// clear unneeded storage from previous versions
	if (GM_getValue('date_format_update')) {
		GM_deleteValue("date_format_update");
	}

	// update locally stored date format, but only if necessary
	if (force || !GM_getValue('date_format')) {
		// get data
		var response = getSync(myUrl);
		// parse date format
		response_div = createElement('div');
		response_div.innerHTML = response.responseText;
		date_format = $('select#SelectedDateFormat option:selected', response_div).val();

		if (date_format !== "undefined") {
			// store date format locally
			GM_setValue('date_format', date_format);
			debug("fn getDateFormat - GM_setValue: 'date_format' = " + date_format);
		} else {
			error("fn getDateFormat - select#SelectedDateFormat is undefined");
		}
	}

	return GM_getValue('date_format');
}

function dateFormatConversion(format) {
	return format.replace(/yy/g,'y').replace(/M/g,'m').replace(/mmm/,'M');
	/* GS dateformat to jqui datepicker dateformat:
        https://www.geocaching.com/account/settings/preferences#SelectedDateFormat
        http://api.jqueryui.com/datepicker/#utility-parseDate
	GS --> jqui: d-->d,dd-->dd,M-->m,MM-->mm,MMM-->M,yy-->y,yyyy-->yy
	"d. M. yyyy" 	: "d. m. yy",	3. 1. 2017	
	"d.M.yyyy" 		: "d.m.yy",    	3.1.2017
	"d.MM.yyyy" 	: "d.mm.yy",    3.01.2017
	"d/M/yy" 		: "d/m/y",     	3/1/17
	"d/M/yyyy" 		: "d/m/yy",    	3/1/2017
	"d/MM/yyyy" 	: "d/mm/yy",    3/01/2017
	"dd MMM yy" 	: "dd M y",     03 Jan 17
	"dd.MM.yy" 		: "dd.mm.y",    03.01.17
	"dd.MM.yyyy" 	: "dd.mm.yy",   03.01.2017
	"dd.MM.yyyy." 	: "dd.mm.yy.",  03.01.2017.
	"dd.MMM.yyyy" 	: "dd.M.yy",    03.Jan.2017
	"dd/MM/yy" 		: "dd/mm/y",    03/01/17
	"dd/MM/yyyy" 	: "dd/mm/yy",   03/01/2017
	"dd/MMM/yyyy" 	: "dd/M/yy",    03/Jan/2017
	"dd-MM-yy" 		: "dd-mm-y",    03-01-17
	"dd-MM-yyyy" 	: "dd-mm-yy",   03-01-2017
	"d-M-yyyy" 		: "d-m-yy",    	3-1-2017
	"M/d/yyyy" 		: "m/d/yy",    	1/3/2017
	"MM/dd/yyyy" 	: "mm/dd/yy",   01/03/2017
	"MMM/dd/yyyy" 	: "M/dd/yy",    Jan/03/2017
	"yyyy.MM.dd."	: "yy.mm.dd.",  2017.01.03.
	"yyyy/MM/dd" 	: "yy/mm/dd",   2017/01/03
	"yyyy-MM-dd" 	: "yy-mm-dd"    2017-01-03 */
}

function parseDate(date_string) {
	var gs_date_format = getDateFormat(),
	jqui_date_format = dateFormatConversion(gs_date_format),
	date,
	debugStr = "date to parse: '" + date_string + "'\nGS format: '" + gs_date_format + "'\njqui format: '" + jqui_date_format;

	try {
		date = $.datepicker.parseDate(jqui_date_format, date_string);
		debug(debugStr + "'\nParsed date: " + date + "'");
	} catch (e) {
		getDateFormat(true); // force internal update of GS date format
		throw 'Date format mismatch: "' + e + '"<br>&nbsp;&nbsp;date format: ' + gs_date_format + '<br>&nbsp;&nbsp;date to parse: ' + date_string;
	}

	return date;
}

function formatDate(date) {
	var gs_date_format = getDateFormat(),
	jqui_date_format = dateFormatConversion(gs_date_format),
	date_string = $.datepicker.formatDate(jqui_date_format, date);

	debug("format date: '" + date + "'\nGS format: '" + gs_date_format + "'\njqui format: '" + jqui_date_format + "'\nDatestring: '" + date_string + "'");

	return date_string;
}

/* geo utilities*/
/** Orientiert an Geodesy representation conversion functions (c) Chris Veness 2002-2011  **/
var Geo = {}; // Geo namespace, representing static class
/**
 * Interpretiert einen String als Gradzahl. Diese Funktion verarbeitet alle 3 möglichen Formate (d, dm, dms)
 * Limitiert auf eine Komponente pro Aufruf.
 *
 * @param   {String} dmsStr: Koordinaten String
 * @returns {Number} deg: Degrees
 */
Geo.parseDMS = function (dmsStr) {
	// entferne alle nicht Zahlen (Regex:[^\d.\s]) und teile den String an den verbleibenden Leerzeichen (Regex:[^0-9.,])
	var dms = dmsStr.replace(/[^\d.\s]/g, ' ').trim().split(/[^0-9.,]+/);
	var deg;

	// wenn nix mehr übrig bleibt -> keine Koordinate
	if (dms == '') {
		return NaN;
	}

	// Anhand der Länge von dms wird ermittelt im welchem Format die Koordinaten vorliegen
	switch (dms.length) {
	case 3: // interpret 3-part result as d/m/s
		deg = dms[0] / 1 + dms[1] / 60 + dms[2] / 3600;
		break;
	case 2: // interpret 2-part result as d/m
		deg = dms[0] / 1 + dms[1] / 60;
		break;
	case 1: // just d (possibly decimal) or non-separated dddmmss
		deg = dms[0];
		break;
	default:
		return NaN;
	}

	// anschließend negiere Wert wenn der String ein S oder W beinhaltet
	if (/^-|^[WS]/i.test(dmsStr.trim())) {
		deg = -deg;
	}
	return deg;
};

/**
 * Konvertiert dezimal Gradzahlen zu dem festgelgegten Format ('d', 'dm', 'dms') - Vorangestellt N/S
 *
 * @param   {Number} deg: Degrees
 * @param   {String} [format=dms]: Return value as 'd', 'dm', 'dms'
 * @param   {Number} [dp=0|2|4]: No of decimal places to use - default 0 for dms, 2 for dm, 4 for d
 * @returns {String} Deg/min/seconds
 */
Geo.toLat = function (deg, format) {
	var lat = Geo.toDMS(deg, format);
	return lat == '' ? '' : (deg < 0 ? 'S' : 'N') + " " + lat.slice(1); // erste '0' abschneiden für Lat
};

/**
 * Konvertiert dezimal Gradzahlen zu dem festgelgegten Format ('d', 'dm', 'dms') - Vorangestellt E/W
 *
 * @param   {Number} deg: Degrees
 * @param   {String} [format=dms]: Return value as 'd', 'dm', 'dms'
 * @returns {String} Deg/min/seconds
 */
Geo.toLon = function (deg, format) {
	var lon = Geo.toDMS(deg, format);
	return lon == '' ? '' : (deg < 0 ? 'W' : 'E') + " " + lon;
};

/**
 * Konvertiert dezimal Gradzahlen in das "deg°"(d), "deg° min" (dm) oder "deg°min'sec''"(dms) Format
 *
 * @private
 * @param   {Number} deg: Degrees
 * @param   {String} [format=dm]: Return Format 'd', 'dm', 'dms'
 * @returns {String} Koordinaten String in dem festgelegten Format
 * @throws  {TypeError} wenn deg ein Object ist
 */
Geo.toDMS = function (deg, format) {
	if (typeof deg == 'object') {
		throw new TypeError('Geo.toDMS - deg is an object');
	}
	if (isNaN(deg)) {
		return 'NaN';
	} // give up here if we can't make a number from deg

	// default value of format = dms
	if (typeof format == 'undefined') {
		format = 'dm';
	}
	deg = Math.abs(deg); // (unsigned result ready for appending NS|WE)

	var dms,
	d,
	m,
	s,
	min,
	sec,
	tmpD,
	tmpM;

	switch (format) {
	case 'd':
		d = deg.toFixed(8); // round degrees
		tmpD = d;
		if (d < 100) {
			tmpD = '0' + tmpD;
		} // pad with leading zeros
		if (d < 10) {
			tmpD = '0' + tmpD;
		}
		dms = tmpD; // add ° symbol
		break;
	case 'dm':
		min = (deg * 60).toFixed(8); // convert degrees to minutes & round
		d = Math.floor(min / 60); // get component deg/min
		m = (min % 60).toFixed(3); // pad with trailing zeros
		tmpD = d;
		tmpM = m;
		if (d < 100) {
			tmpD = '0' + tmpD;
		} // pad with leading zeros
		if (d < 10) {
			tmpD = '0' + tmpD;
		}
		if (m < 10) {
			tmpM = '0' + tmpM;
		}
		dms = tmpD + '\u00B0' + tmpM; // add ° symbols
		break;
	case 'dms':
		sec = (deg * 3600).toFixed(0); // convert degrees to seconds & round
		d = Math.floor(sec / 3600); // get component deg/min/sec
		m = Math.floor(sec / 60) % 60;
		s = (sec % 60).toFixed(0); // pad with trailing zeros
		if (d < 100) {
			d = '0' + d;
		} // pad with leading zeros
		if (d < 10) {
			d = '0' + d;
		}
		if (m < 10) {
			m = '0' + m;
		}
		if (s < 10) {
			s = '0' + s;
		}
		dms = d + '\u00B0' + m + '\u2032' + s + '\u2033'; // add °, ', " symbols
		break;
	}

	return dms;
};

/**
 * Erzeugt einen Punkt mit den gegebenen Latitude und Longitude
 * @constructor
 * @param {Number} lat: latitude in numeric degrees
 * @param {Number} lon: longitude in numeric degrees
 */
function LatLon(lat, lon) {
	// only accept numbers or valid numeric strings
	this._lat = typeof(lat) == 'number' ? lat : typeof(lat) == 'string' && lat.trim() != '' ? +lat : NaN;
	this._lon = typeof(lon) == 'number' ? lon : typeof(lon) == 'string' && lon.trim() != '' ? +lon : NaN;
}

/**
 * Gibt einen String mit "lat() lon()" von diesem Punkt zurück
 *
 * @param   {String} [format]: Return value als 'd', 'dm', 'dms'
 * @returns {String} Space-separated latitude/longitude
 *
 */
LatLon.prototype.toString = function (format) {
	if (typeof format == 'undefined') {
		format = 'dm';
	}
	if (isNaN(this._lat) || isNaN(this._lon)) {
		return '-,-';
	}
	return Geo.toLat(this._lat, format) + ' ' + Geo.toLon(this._lon, format);
};

/**
 * Interpretiert eine Koordinaten Eingabe des Formats "N51° 12.123 E010° 23.123" oder "51.123 10.123" bzw. benutzt Googles Geocoding API um die Koordinaten zu finde.
 *
 * @param   {String} coord_string: Koordinaten in einem Format
 * @param   {Boolean} [force_Geocoding=false]: Wenn gesetzt sucht die Methode bei nicht numerischer Eingabe mittels Geocoding nach den Koordinaten
 * @returns {LatLon} Koordinaten Object
 */

function parseCoordinates(coord_string, force_Geocoding) {

	// entferne alle "," in Koordinaten String
	if (typeof coord_string == "string") {
		coord_string = coord_string.replace(/,/g, ".");
	}

	var lat,
	lon;

	// regex for N51° 12.123 E12° 34.123
	var regex_coord_ns = new RegExp(/(N|S)\s*(\d{0,2})\s*°\s*(\d{0,2}[\.,]\d+)/);
	var regex_coord_ew = new RegExp(/(E|W)\s*(\d{0,3})\s*°\s*(\d{0,2}[\.,]\d+)/);

	//regex for 51.123 12.123
	var regex_coord_dec = new RegExp(/(-{0,1}\d{0,2}[\.,]\d+)\s*(-{0,1}\d{0,3}[\.,]\d+)/);

	var result_coord_ns = regex_coord_ns.exec(coord_string);
	var result_coord_ew = regex_coord_ew.exec(coord_string);
	var result_coord_dec = regex_coord_dec.exec(coord_string);

	// Koordinate ist keins der beiden numerischen Formate
	if (!(result_coord_ns && result_coord_ew) && !result_coord_dec) {

		// ... jetzt hilft nur noch Google ...
		if (force_Geocoding) {
			// sende einen synchronen request an die geocoding api von google - Doc: http://code.google.com/apis/maps/documentation/javascript/services.html#GeocodingRequests
			var geocoding_obj = JSON.parse(
					getSync("https://maps.googleapis.com/maps/api/geocode/json?address=" + coord_string).responseText);

			if (geocoding_obj.status === "ZERO_RESULTS") { // noch nicht einmal Google kann mit der eingabe etwas anfangen
				return false;
			}

			lat = geocoding_obj.results[0].geometry.location.lat;
			lon = geocoding_obj.results[0].geometry.location.lng;
			return new LatLon(lat, lon);
		} else {
			return false;
		}
	} else if (result_coord_ns && result_coord_ew) {
		// result_coord_ns[0] = "N51° 12.123"
		// result_coord_ew[0] = "E010° 23.123"
		lat = Geo.parseDMS(result_coord_ns[0]);
		lon = Geo.parseDMS(result_coord_ew[0]);
		return new LatLon(lat, lon);

	} else {
		// result enthält beide Teile der Koordinate
		lat = Geo.parseDMS(result_coord_dec[1]);
		lon = Geo.parseDMS(result_coord_dec[2]);

		return new LatLon(lat, lon);
	}
}

function distanceBetween(lat1, lon1, lat2, lon2) {
	var R = 6371000; // meters (change this constant to get miles)
	var dLat = (lat2 - lat1) * Math.PI / 180;
	var dLon = (lon2 - lon1) * Math.PI / 180;
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;
	return d;
}

/*function addSwitchSiteDialog() {
	$('<div>' + $.gctour.lang('switchSite') + '<br><br>' +
		'<a href="'+GS_HOST+'my/">'+GS_HOST+'my/</a><br>' +
		'<a href="'+GS_HOST+'map/">'+GS_HOST+'map/</a></div>')
	.dialog($.gctour.dialog.info());
}*/

/* helpers */
// for map page: googleMap center and radius: return object center and radius
var getMapCenterAndRadius = function () {

	var googleMap = unsafeWindow.MapSettings ? unsafeWindow.MapSettings.Map : undefined,
	ret = {},
	bounds;

	ret.center = "";
	ret.radius = "";

	if (typeof(googleMap) !== "undefined") {

		bounds = googleMap.getBounds();
		ret.center = googleMap.getCenter();

		ret.radius = Math.floor(
				distanceBetween(
					ret.center.lat, ret.center.lng,
					bounds.getNorthEast().lat,
					bounds.getNorthEast().lng - (bounds.getNorthEast().lng - bounds.getSouthWest().lng) / 2)) / 1000;
	}

	return ret;
};

// is string json, isJSON(response.responseText)
// fn from js-Framework prototype v1.7
var isJSON = function (str) {
	if (str.length === 0) {
		return false;
	}
	str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
		.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
		.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
	return (/^[\],:{}\s]*$/).test(str);
};

// is String a GCCode ?
// begin with 'GC' + 1 to 6 chars, current is 5 (01.2017)
// return Boolean
var isGCCode = function (gccode) {
	return (/^\s*(GC[0-9A-Z]{1,6})\s*$/).test(gccode);
};

// find GCID (GCCode) in String
// first 'GC' + 1 to 6 chars in a string, current is 5 (01.2017)
// return String
// example: http://jsfiddle.net/NUFGq/15/
var findGCCodeFromString = function (str) {
	if (!str || str.length === 0) {
		return false;
	}
	var treffer = str.match(/\bGC([0-9A-Z]{1,6})\b/) || [];
	return (treffer[0] || "");
};

/* initialize */
// init core variables
function initCore() {
	debug("init_core()");

	// setting up the language (style from 10.2011)
	var l = GM_getValue('language', $.gctour.defaultLang);

	// ToDO: switch in der "übernächsten" Veröffentlichung wieder entfernen !
	// Nur um ggf. von alter zur neuer Version zu wechseln
	// START: switch from old to new style
	if (typeof(l) === "number") {
		l = ['de', 'en', 'fr', 'nl', 'pt'][parseInt(l, 10)] || $.gctour.defaultLang;
		debug("current language:" + l);
		GM_setValue('language', l);
	}
	// END: switch from old to new style

	$.gctour.currentLang = l;

	// getting all tours
	tours = loadValue('tours', []);

	// go get the current tour from the tour list
	currentTourId = GM_getValue('currentTour', -1);
	currentTour = getTourById(currentTourId);

	// oh - there is no current tour!? create one!
	if (!currentTour) {
		currentTour = {};
		currentTour.id = getNewTourId();
		currentTour.name = "Tour " + currentTour.id;
		currentTour.geocaches = [];
		tours.push(currentTour);
		log("found no currentTour! Creating new one: " + currentTour.id + " ; " + currentTour.name);
		saveCurrentTour();
	}
}

function init() {
	debug("init()");

	var i;

	// set Styles (GM_addStyle)
	initStyle();

	// add global styles
	var head = document.getElementsByTagName('head')[0],
	style = document.createElement('style');

	style.type = 'text/css';

	head.appendChild(style);

	// first filter blacklist
	// process "add to GCTour"-link from GCTOUR_HOST
	if (document.URL.search("webcode") >= 0) {
		document.title = "GCTour";
		document.getElementsByTagName('body')[0].innerHTML = "<div align='center'><a href='" + GS_HOST + "'><img border='0' src='" + $.gctour.img.gctourLogo + "'/></a></div>";
		downloadTourFunction(document.URL.split("webcode/")[1]);
		return;
	}

	// start special script on send-to-gps page
	if (document.URL.search("sendtogps.aspx") >= 0) {
		// show the GPX box, if the option is set
		if (GM_getValue('showGpx', false)) {
			document.getElementById('dataString').parentNode.style.visibility = 'visible';
			document.getElementById('dataString').style.width = '100%';
		}

		// see, whether this window is opened by the tour or by something else
		var qsParm = [];
		var query = window.location.search.substring(1);
		var parms = query.split('&');
		for (i = 0; i < parms.length; i++) {
			var pos = parms[i].indexOf('=');
			if (pos > 0) {
				var key = parms[i].substring(0, pos);
				var val = parms[i].substring(pos + 1);
				qsParm[key] = val;
			}
		}

		if (qsParm['tour']) {
			sendToGPS();
		}

		return;
	}

	$(window).bind({
		// update the complete gui if the tab gets focus
		'focus' : function (e) {
			updateTour();
		},
		'resize' : function (e) {
			handleResize(e);
		}
	});

	// process autoTour
	if (GM_getValue('tq_url')) {

		// if the cancelbutton is presssed
		if (GM_getValue("stopTask", false)) {
			GM_deleteValue('tq_url');
			GM_deleteValue('tq_caches');
			GM_setValue('stopTask', false);
			document.location.href = GM_getValue('tq_StartUrl', GS_HOST);
			return; // then return!
		}

		var tq_url = GM_getValue('tq_url');

		// remove protocols when comparing URLs
		// (autoTour didn't work from map called with http, now it does)
		if (tq_url.replace(/^https?\:\/\//i, "") == document.location.href.replace(/^https?\:\/\//i, "")) {

			addProgressbar({
				caption : $.gctour.lang('autoTour.wait'),
				closeCallback : function () {
					return function () {
						GM_setValue("stopTask", true);
						closeOverlayRemote(document)();
					};
				}
			});

			var tq_caches = loadValue('tq_caches', []),
			tq_typeFilter = JSON.parse(GM_getValue('tq_typeFilter')),
			tq_sizeFilter = JSON.parse(GM_getValue('tq_sizeFilter')),
			tq_dFilter = JSON.parse(GM_getValue('tq_dFilter')),
			tq_tFilter = JSON.parse(GM_getValue('tq_tFilter')),
			tq_specialFilter = JSON.parse(GM_getValue('tq_specialFilter')),

			pagesSpan = $("td.PageBuilderWidget > span:first"),
			pagesSpanBolds = $('b', pagesSpan),
			entries = getEntriesFromOldSearchpage(),
			addBool;

			if (pagesSpan.length <= 0) {
				alert("no caches here :-(");
				GM_deleteValue('tq_url');
				GM_deleteValue('tq_caches');
				document.location.href = GM_getValue('tq_StartUrl', GS_HOST);
				return;
			}

			setProgress(
				parseFloat(pagesSpanBolds.eq(1).text()) - 1,
				parseFloat(pagesSpanBolds.eq(2).text()),
				document);

			log("entries: " + JSON.stringify(entries));

			// BEGIN for each cache
			$.each(entries, function (i, entry) {

				debug("entry[" + i + "]: " + JSON.stringify(entry));
				debug("##### 0 " +
					"type:\t" + tq_typeFilter[entry.type] + "\n" +
					"size:\t" + tq_sizeFilter[entry.size] + "\n" +
					"difficulty: " + tq_dFilter[entry.difficulty] + "\n" +
					"terrain:\t" + tq_tFilter[entry.terrain]);

				// autoTour magic starts here (filter)
				// check whether the caches match against the given type, size and D/T values
				addBool = tq_typeFilter[entry.type] &&
					tq_sizeFilter[entry.size] &&
					tq_dFilter[entry.difficulty] &&
					tq_tFilter[entry.terrain];

				if (tq_specialFilter['is Active']) {
					log("Check if " + entry.name + " is active:\n" +
						"available: " + entry.available);
					addBool = addBool && (entry.available); // only add if active!
				}

				if (tq_specialFilter['pm'] == "only") { // PM only
					addBool = addBool && entry.pm_only;
				} else {
					if (tq_specialFilter['pm'] == "not") { // not PM
						addBool = addBool && !entry.pm_only;
					}
				}

				// autoTour parameter "haven't found" is not checked here because of URL parameter

				addBool = addBool &&
					(parseInt(((tq_specialFilter['minFavorites']) ? tq_specialFilter['minFavorites'] : 0), 10) <= parseInt(entry.favorites, 10)); // minimal Favorites

				// if all parameters match - add the cache
				if (addBool) {
					// 8.gif --> https://www.geocaching.com/images/wpttypes/sm/8.gif
					entry.image = GS_HOST + GS_WPT_IMAGE_PATH + entry.image;
					tq_caches.push(entry);
				}

				debug(entry.id + " " + entry.name + " filter:" +
					"\n\ttype:" + entry.type + " = " + tq_typeFilter[entry.type] +
					"\n\tsize:" + entry.size + " = " + tq_sizeFilter[entry.size] +
					"\n\tdifficulty:" + entry.difficulty + " = " + tq_dFilter[entry.difficulty + ""] +
					"\n\tterrain:" + entry.terrain + " = " + tq_tFilter[entry.terrain + ""] +
					"\n\tavailable:" + entry.available +
					"\n\tpm only:" + entry.pm_only +
					"\n\t ==> Add to tour: " + addBool);

			}); // END for each cache

			GM_setValue('tq_caches', JSON.stringify(tq_caches));

			var gcComLinks = $("td.PageBuilderWidget > a", document),
			nextLink = false;

			// next Link finden
			gcComLinks.each(function (index) {
				if ($(this).html() == "<b>&gt;&gt;</b>") {
					nextLink = gcComLinks.eq(index + 1);
					return false; // each schleife verlassen
				}
			});

			// check if there are some caches on this page (next link is not there)
			if (!nextLink) {
				alert("no caches here :-(");
				GM_deleteValue('tq_url');
				GM_deleteValue('tq_caches');
				document.location.href = GM_getValue('tq_StartUrl', GS_HOST);
				return;
			}

			// action finden aus next link
			var action = (nextLink.attr("href")) ? nextLink.attr("href").split("'")[1] : false;
			if (action) {
				var u = 500,
				l = 2000,
				waitingTime = Math.floor((Math.random() * (u - l + 1)) + l);
				// wait between 0.5 -> 2 seconds to do the next request
				window.setTimeout(function () {
					unsafeWindow.__doPostBack(action, '');
				}, waitingTime);
			} else {

				currentTour = {};
				currentTour.id = getNewTourId();
				currentTour.name = "autoTour " + currentTour.id;
				currentTour.geocaches = tq_caches;
				tours.push(currentTour);
				log("autoTour done - create new Tour: " + currentTour.id + " ; " + currentTour.name);
				saveCurrentTour();

				document.location.href = GM_getValue('tq_StartUrl', GS_HOST);
			}

		} else {
			GM_deleteValue('tq_url');
			GM_deleteValue('tq_caches');
		}
	}

	// maps - map/default.aspx
	if (document.URL.search("\/map\/") >= 0) {
		$("<div>", {
			"class" : "header",
			"css" : {
				'width' : 100,
				'height' : 30,
				'margin-top' : 10,
				'overflow' : "hidden",
				'border-radius' : 5,
				'background-color' : "#FFF",
				'border' : "4px solid #999",
				'cursor' : 'pointer',
				'float' : 'right'
			},
			"html" : $("<h1>", {
				"css" : {
					'padding' : 0
				},
				click : function (e) {
					var gooMap = getMapCenterAndRadius();
					showAutoTourDialog(gooMap.center, gooMap.radius);
				},
				"html" : $("<img>", {
					"src" : $.gctour.img.mapToAutoTour
				})
			})
			.hover(
				function () {
				$(this).css({
					'backgroundColor' : 'orange'
				});
			},
				function () {
				$(this).css({
					'backgroundColor' : '#B2D4F3'
				});
			})
		}).prependTo($("div:first", "header:first"));

		// ToDo: Template erweitern bzw. anpassen mit Add2Tour Button
		$('#cacheDetailsTemplate').text(
			function (index, text) {
			var tmpAddToTour = '{{#if $ctx.userIsLoggedIn() }}' +
				'<a class="lnk" id="attKnopf" href="javascript:add2tour();">' +
				'<img src="' + $.gctour.img.addToTour + '">&nbsp;<span>' + $.gctour.lang('addToTour') + '</span>' +
				'</a>';
			return text.replace(/\{\{\#if \$ctx.userIsLoggedIn\(\) \}\}/g, tmpAddToTour);
		});

		var add2tour = function () {
			setTimeout(function () {
				var gccode = $('#gmCacheInfo div[class="code"]:visible:first').text().trim();
				var name = $("#gmCacheInfo a[href*='cache_details.aspx']:visible:first").text().trim();
				var guid = getUrlVars($("#gmCacheInfo a[href*='/seek/log.aspx?guid']:visible:first").attr("href"))["guid"];

				var imageUrl = $("#gmCacheInfo img[src*='images/mapicons/']:visible:first").attr("src") ||
							   $("#gmCacheInfo img[src*='"+GS_WPT_IMAGE_PATH+"']:visible:first").attr("src");
				var cacheTypeImage = imageUrl.split('/').pop();
				
				debug("map add2tour: gccode:'" + gccode + "' name:'" + name + "' image:'" + cacheTypeImage + "' guid:'" + guid + "'");
				addElementFunction(gccode, guid, name, cacheTypeImage)();
			}, 0);
		};

		exportFunction(add2tour, unsafeWindow, {
			defineAs : "add2tour"
		});
	}

	// add buttons to Bookmark site
	if (document.URL.search("\/bookmarks\/view.aspx") >= 0) {
		var k,
		bookmarkLine,
		entry;
		var bookmarkLines = $('tr[id$="Row"]'); // id muss mit Row enden

		debug("bookmarkLines.length = " + bookmarkLines.length);

		for (k = 0; k < bookmarkLines.length; k++) {
			bookmarkLine = $("td", bookmarkLines[k]);
			entry = getEntryFromBookmarkTd(bookmarkLine);

			$("<img>", {
				"alt" : $.gctour.lang('addToTour'),
				"title" : $.gctour.lang('addToTour'),
				"src" : $.gctour.img.addToTour,
				"css" : {
					"cursor" : "pointer",
					"margin" : "0 0 0 15px"
				}
			})
			.bind('click', {
				entry : entry
			}, function (e) {
				addElementFunction(e.data.entry.id, e.data.entry.guid, e.data.entry.name, e.data.entry.image)();
			})
			.appendTo(bookmarkLine[bookmarkLine.length - 1]); // add buttons to last column

		}

		// helper function
		var addEntryFromBookmark = function (e) {
			var ck = e.data.checkedOnly || false;
			var nt = e.data.newTour || false;
			var listName = nt ? $("span#ctl00_ContentBody_lbHeading").text() : "";

			if (!nt || (nt && newTourFunction(listName)())) { // ggf. neue Tour
				$.each(e.data.bLs, function (i, v) {
					var bookmarkLine = $("td", v);
					var entry = getEntryFromBookmarkTd(bookmarkLine);
					if ((entry) && (!ck || (ck && entry.checked))) {
						addElementFunction(entry.id, entry.guid, entry.name, entry.image)();
					}
				});
			}
		};

		// buttons to add all caches in list to current and new tour
		$("<div>", {
			"css" : {
				"margin" : '10px 0 10px 0'
			},
			html : $.gctour.lang('showCaches')
		})
		.append(
			// button to add all caches in list to current tour
			$("<button>", {
				"css" : {
					"margin-left" : 10,
					"cursor" : "pointer",
					"background-color" : "#EEE"
				},
				"html" : "<img src='" + $.gctour.img.addToTour + "'/>&nbsp;" + $.gctour.lang('addToCurrentTour')
			})
			.bind('click', {
				bLs : bookmarkLines,
				checkedOnly : false,
				newTour : false
			}, function (e) {
				e.preventDefault();
				addEntryFromBookmark(e);
			}))
		.append(
			// button to add all caches in list to a new tour
			$("<button>", {
				"css" : {
					"margin-left" : 10,
					"cursor" : "pointer",
					"background-color" : "#EEE"
				},
				"html" : "<img src='" + $.gctour.img.newTour + "'/>&nbsp;+&nbsp;<img src='" + $.gctour.img.addToTour + "'/>&nbsp;" + $.gctour.lang('addToNewTour')
			})
			.bind('click', {
				bLs : bookmarkLines,
				checkedOnly : false,
				newTour : true
			}, function (e) {
				e.preventDefault();
				addEntryFromBookmark(e);
			}))
		.appendTo('div#ctl00_ContentBody_ListInfo_uxAbuseReport');

		// buttons to add all checked caches in list to current and new tour
		$("<div>", {
			"css" : {
				'margin' : '2px 0 20px 0'
			},
			html : $.gctour.lang('markedCaches')
		})
		.append(
			// button to add all checked caches in list to current tour
			$("<button>", {
				"css" : {
					"margin-left" : 10,
					"cursor" : "pointer",
					"background-color" : "#EEE"
				},
				"html" : "<img src='" + $.gctour.img.addToTour + "'/>&nbsp;" + $.gctour.lang('addToCurrentTour')
			})
			.bind('click', {
				bLs : bookmarkLines,
				checkedOnly : true,
				newTour : false
			}, function (e) {
				e.preventDefault();
				addEntryFromBookmark(e);
			}))
		.append(
			// button to add all checked caches in list to new tour
			$("<button>", {
				"css" : {
					"margin-left" : 10,
					"cursor" : "pointer",
					"background-color" : "#EEE"
				},
				"html" : "<img src='" + $.gctour.img.newTour + "'/>&nbsp;+&nbsp;<img src='" + $.gctour.img.addToTour + "'/>&nbsp;" + $.gctour.lang('addToNewTour')
			})
			.bind('click', {
				bLs : bookmarkLines,
				checkedOnly : true,
				newTour : true
			}, function (e) {
				e.preventDefault();
				addEntryFromBookmark(e);
			}))
		.insertBefore("input#ctl00_ContentBody_ListInfo_btnDownload");

	}

	// add the buttons to the search table
	if (document.URL.search("\/seek\/nearest.aspx") >= 0) {
		var entry_i,
		entry;
		var entries = getEntriesFromOldSearchpage();

		// helper function
		var addEntryFromSearchpage = function (e) {
			var i,
			entry,
			entries;
			var ck = e.data.checkedOnly || false;
			var nt = e.data.newTour || false;
			entries = getEntriesFromOldSearchpage();

			if (!nt || (nt && newTourFunction()())) { // ggf. neue Tour
				for (i = 0; i < entries.length; i++) {
					entry = entries[i];
					if ((entry) && (!ck || (ck && entry.checked))) { // alle oder nur ausgewählte
						addElementFunction(entry.id, entry.guid, entry.name, entry.image)(); ;
					}
				}
			}
		};

		for (entry_i = 0; entry_i < entries.length; entry_i++) {
			entry = entries[entry_i];

			$("<img>", {
				"alt" : $.gctour.lang('addToTour'),
				"title" : $.gctour.lang('addToTour'),
				"src" : $.gctour.img.addToTour,
				"css" : {
					"cursor" : "pointer",
					"margin" : "0 5px 0 0"
				}
			})
			.bind('click', {
				entry : entry
			}, function (e) {

				addElementFunction(e.data.entry.id, e.data.entry.guid, e.data.entry.name, e.data.entry.image)();
			})
			.appendTo(entry.addBtnPosition);

		}

		// buttons to add all caches in list to current and new tour
		$("<div>", {
			"css" : {
				"margin" : '10px 0 10px 0'
			},
			html : $.gctour.lang('showCaches')
		})
		.append(
			// button to add show caches in list to current tour
			$("<button>", {
				"css" : {
					"margin-left" : 10,
					"cursor" : "pointer",
					"background-color" : "#EEE"
				},
				"html" : "<img src='" + $.gctour.img.addToTour + "'/>&nbsp;" + $.gctour.lang('addToCurrentTour')
			})
			.bind('click', {
				checkedOnly : false,
				newTour : false
			}, function (e) {
				e.preventDefault();
				addEntryFromSearchpage(e);
			}))
		.append(
			// button to add show caches in list to new tour
			$("<button>", {
				"css" : {
					"margin-left" : 10,
					"cursor" : "pointer",
					"background-color" : "#EEE"
				},
				"html" : "<img src='" + $.gctour.img.newTour + "'/>&nbsp;+&nbsp;<img src='" + $.gctour.img.addToTour + "'/>&nbsp;" + $.gctour.lang('addToNewTour')
			})
			.bind('click', {
				checkedOnly : false,
				newTour : true
			}, function (e) {
				e.preventDefault();
				addEntryFromSearchpage(e);
			}))
		.prependTo("div#ctl00_ContentBody_ResultsPanel");

		/*
		if (DEBUG_MODE) {

		$("<div>", {
		"css" : {
		"margin-left" : 10,
		"cursor" : "pointer",
		"background-color" : "#EEE"
		},
		"html" : "Test 'getEntriesFromSearchPage'!"
		})
		.bind('click', function (e) {
		getEntriesFromOldSearchpage();
		})
		.prependTo("div#ctl00_ContentBody_ResultsPanel");
		}*/

		//


		// buttons to add all checked caches in list to current and new tour
		$("<div>", {
			"css" : {
				'margin' : '2px 0 20px 0'
			},
			html : $.gctour.lang('markedCaches')
		})
		.append(
			// button to add all checked caches in list to current tour
			$("<button>", {
				"css" : {
					"margin-left" : 10,
					"cursor" : "pointer",
					"background-color" : "#EEE"
				},
				"html" : "<img src='" + $.gctour.img.addToTour + "'/>&nbsp;" + $.gctour.lang('addToCurrentTour')
			})
			.bind('click', {
				checkedOnly : true,
				newTour : false
			}, function (e) {
				e.preventDefault();
				addEntryFromSearchpage(e);
			}))
		.append(
			// button to add all checked caches in list to new tour
			$("<button>", {
				"css" : {
					"margin-left" : 10,
					"cursor" : "pointer",
					"background-color" : "#EEE"
				},
				"html" : "<img src='" + $.gctour.img.newTour + "'/>&nbsp;+&nbsp;<img src='" + $.gctour.img.addToTour + "'/>&nbsp;" + $.gctour.lang('addToNewTour')
			})
			.bind('click', {
				checkedOnly : true,
				newTour : true
			}, function (e) {
				e.preventDefault();
				addEntryFromSearchpage(e);
			}))
		.insertAfter($('table.SearchResultsTable:first').next('table'));

	}

	// don't display the list on the sendtogpx page
	if (document.URL.search("sendtogps.aspx") <= 0) {
		initComponents();

		// add buttons to the cache details page
		if (document.URL.search(GS_HOST + "geocache\/GC") >= 0 || document.URL.search("cache_details.aspx") >= 0) {
			initButton();
		}

		window.setTimeout(function () { // wichtig da die MAP Seite verzögert gestartet wird
			// get proper user name
			userName = $('span.cache-count').prev().text();
			/*if (userName) {
			debug("Username: " + userName);
			} else {
			debug("Username not found");
			}*/
		}, 0);
	}

	// remove route menu from "show caches on map" page
	if (document.URL.search(GCTOUR_HOST + "map/show/h/") >= 0) {
		window.setTimeout(function () { // page must be loaded first, 5s should suffice
			$(".controlText:contains('Route')").remove();
		}, 5000);
	}
	
	// ensure that the correct Groundspeak date format will be used (user setting in Groundspeak profile)
	//   - can only be changed by users here: https://www.geocaching.com/account/settings/preferences
	//   - if the site is called, simply update the locally stored date format 
	if (document.URL.search("\/account\/settings\/preferences") >= 0) {
		getDateFormat(true);
	}
}

/* init gui */
function initButton() {

	// if we are on a cache page the buttonGroup != null - so add the 'to tour'-button
	var cacheControl = $("div.CacheInformationTable:first");
	if (cacheControl.length > 0) {

		var div_element = createElement('div', {
				style : "border-top: 1px solid rgb(192, 206, 227);"
			});
		cacheControl.append(div_element);

		var gcTourFieldset = createElement('fieldset', {
				style : "background-color: #EFF4F9;border-color: #C0CEE3 !important;margin-top:0;padding: 0.5em;"
			});
		append(gcTourFieldset, div_element);

		gcTourFieldset.setAttribute('class', 'dialogFooter');
		gcTourFieldset.innerHTML = "<legend class='note' style='background:url(\"" + $.gctour.img.gctourLogoSmall + "\") no-repeat scroll 0 0 transparent;padding-left:20px;'>GCTour</legend>";

		// 1) add to tour button
		var newButton = createElement('input', {
				type : "button",
				value : $.gctour.lang('addToTour'),
				style : "float:left;background-image:url(" + $.gctour.img.addToTour + ")"
			});
		append(newButton, gcTourFieldset);

		newButton.setAttribute('onclick', 'return false;');

		//~ var newButton = document.createElement("button");
		//~ newButton.name = 'btnGPXDL';
		//~ newButton.type = 'submit';
		//~ newButton.innerHTML = "<img src='"+$.gctour.img.addToTour+"'/>&nbsp;"+$.gctour.lang('addToTour');
		//~ newButton.id = 'btnGPXDL';

		// locate the values and save it
		var minimal_geocache = getMinimalGeocacheDetails(document.getElementsByTagName('html')[0]);
		var cacheId = minimal_geocache.gccode;
		var guidId = minimal_geocache.guid;
		var cacheName = minimal_geocache.name;
		var cacheTypeImage = minimal_geocache.type;

		// on click add an element
		newButton.addEventListener('click', addElementFunction(cacheId, guidId, cacheName, cacheTypeImage), false);

		// add it to the group
		//~ append(newButton,add_button)
		//~ append(newButton,gcTourFieldset)

		// 2) direct print button
		newButton = createElement('input', {
				type : "button",
				value : $.gctour.lang('directPrint'),
				style : "float:left;background-image:url(" + $.gctour.img.printer + ")"
			});
		append(newButton, gcTourFieldset);
		newButton.setAttribute('onclick', 'return false;');

		// on click add an element
		newButton.addEventListener('click', function () {
			var entry = {};
			entry.id = cacheId;
			entry.name = cacheName;
			entry.guid = guidId;
			entry.image = GS_HOST + GS_WPT_IMAGE_PATH + cacheTypeImage;

			temp_tour = {};
			temp_tour.name = entry.name;
			temp_tour.geocaches = [entry];

			printPageFunction(temp_tour);

		}, false);

		append(newButton, gcTourFieldset);

		// 3) change coordinates button
		newButton = createElement('input', {
				type : "button",
				value : $.gctour.lang('moveGeocache'),
				style : "float:left;background-image:url(" + $.gctour.img.coord_update + ")"
			});
		append(newButton, gcTourFieldset);
		newButton.setAttribute('onclick', 'return false;');
		newButton.addEventListener('click', openChangeCoordinates, false);
		append(newButton, gcTourFieldset);

		// update the coordinates if it is already changed:

		if (GM_getValue('coords_' + cacheId, "null") != "null") {
			var coords_cacheId = GM_getValue('coords_' + cacheId);
			changeCoordinates(new LatLon(coords_cacheId.split('#')[0], coords_cacheId.split('#')[1]).toString());
		}

	}
}

// the tour list under main navigation
function initComponents() {
	// gcTour Button +++++++++++++++++++++++++++++++++++
	$("<div>", {
		id : "gctourButtonWrapper",
		"class" : "header gctour-grand-default",
		"html" :
		$("<img>", {
			"src" : $.gctour.img.gctourLogoSmall
		})
	})
	.hover(
		function () {
		$(this).addClass('gctour-grand-hover');
		$("#gctourContainer").animate({
			left : 0
		}, 500);
	},
		function () {
		$(this).removeClass('gctour-grand-hover');
	})
	.appendTo("body");

	// gcTour Container +++++++++++++++++++++++++++++++++++
	$("<div>", {
		id : "gctourContainer",
		"css" : {
			left : (sticky) ? 0 : -210
		}
	})
	.hover(
		function () {
		clearTimeout(timeout);
	},
		function () {
		if (!sticky) {
			timeout = setTimeout(function () {
					$("#gctourContainer").animate({
						left : -210
					}, 500);
				}, 1000);
		}
	})
	.appendTo("body");

	var $geocacheList = $('<div>', {
			id : "gctour_geocacheList",
			"css" : {
				overflow : 'auto',
				height : '80%',
				width : '100%'
			},
			"html" :
			$('<ul>', {
				id : "cacheList",
				'class' : 'cachelist'
			})
			.sortable({
				axis : 'y',
				placeholder : 'ui-sortable-placeholder',
				opacity : 0.8,
				revert : true,
				start : function (e, ui) {
					// save old position
					$(this).data('old-pos', ui.item.index());
				},
				stop : function (e, ui) {

					// init
					var newPos = ui.item.index();
					var oldPos = $(this).data('old-pos');
					$(this).removeData('old-pos');

					debug("Drag n Drop in progress:\n" +
						"\tMove " + currentTour.geocaches[oldPos].name + "(=" + ui.item.attr('id') + ") from '" + oldPos + "' to '" + newPos + "'");

					// ignore the same position
					if (oldPos === newPos) {
						return;
					}

					// determine positions
					var insertPos = (oldPos > newPos) ? newPos : newPos + 1;
					var removePos = (oldPos < newPos) ? oldPos : oldPos + 1;

					// changing the position
					currentTour.geocaches.splice(insertPos, 0, currentTour.geocaches[oldPos]);
					currentTour.geocaches.splice(removePos, 1);

					// ... and save the new tour object
					setTimeout(function () { // hack to prevent "access violation" from Greasemonkey
						saveCurrentTour();
					}, 0);
					move(ui.item.attr('id'), 0); // force numbering update

					return;
				}
			})
			.disableSelection()
		});

	var webcodelink = GCTOUR_HOST + 'tour/' + $.trim(currentTour.webcode);
	var $tourHeader = $("<div>", {
			id : "gctour_tourHeader",
			"css" : {},
			"html" : '<img id="inconsistentTour" src="' + $.gctour.img.danger + '" style="float:right;padding:3px;display:none"/>' +
			'<u id="tourName">' + currentTour.name + '</u>&nbsp;<span style="font-size:66%" id="cachecount">(' + currentTour.geocaches.length + ')</span>' +
			'<span id="webcode" style="display:' + ((!currentTour.webcode) ? "none" : "inline") + ';"><br/>' +
			'Webcode: <b><a href="' + webcodelink + '" title="' + $.gctour.lang('makeMap') + '" target="_blank">' + currentTour.webcode + '</a></b>&nbsp;</span><br/>'
		});

	$tourHeader.append(

		// rename
		$('<img>', {
			'class' : 'tourImage',
			src : $.gctour.img.edit,
			title : $.gctour.lang('rename'),
			alt : $.gctour.lang('rename'),
			click : function () {
				var newTourName = prompt($.gctour.lang('newTourDialog'), currentTour.name);
				if (!newTourName) {
					return;
				}
				currentTour.name = newTourName;
				saveCurrentTour();
				updateTour();
			}
		}),

		// print
		$('<img>', {
			'class' : 'tourImage',
			src : $.gctour.img.printer,
			title : $.gctour.lang('printview'),
			alt : $.gctour.lang('printview'),
			click : function () {
				printPageFunction(currentTour);
			}
		}),

		// sendGPS
		$('<img>', {
			'class' : 'tourImage',
			src : $.gctour.img.sendGPS,
			title : $.gctour.lang('sendToGps'),
			alt : $.gctour.lang('sendToGps'),
			click : function () {
				openSend2GpsDialog();
			}
		}),

		// downloadGPX
		$('<img>', {
			'class' : 'tourImage',
			src : $.gctour.img.downloadGPX,
			title : $.gctour.lang('downloadGpx'),
			alt : $.gctour.lang('downloadGpx'),
			click : function () {
				downloadGPXFunction();
			}
		}),

		// send2cgeo
		$('<img>', {
			'class' : 'tourImage',
			src : $.gctour.img.send2cgeo,
			title : $.gctour.lang('send2cgeo.title'),
			alt : $.gctour.lang('send2cgeo.title'),
			'style' : (DEBUG_MODE) ? '' : 'display:none;', // Testphase
			click : function () {
				openGcTour2cgeoDialog();
			}
		}),

		// makeMap
		$('<img>', {
			'class' : 'tourImage',
			src : $.gctour.img.map,
			title : $.gctour.lang('makeMap'),
			alt : $.gctour.lang('makeMap'),
			click : function () {
				makeMapFunction();
			}
		}),

		// uploadTour
		$('<img>', {
			'class' : 'tourImage',
			src : $.gctour.img.upload,
			title : $.gctour.lang('upload'),
			alt : $.gctour.lang('upload'),
			click : function () {
				uploadTourFunction(currentTour.id);
			}
		}),

		// addWaypoint
		$('<img>', {
			'class' : 'tourImage',
			src : $.gctour.img.plus,
			title : $.gctour.lang('addOwnWaypoint'),
			alt : $.gctour.lang('addOwnWaypoint'),
			click : function () {
				showNewMarkerDialog();
			}
		}),

		// deleteTour
		$('<img>', {
			id : 'gctourDeleteButton',
			'class' : 'tourImage',
			src : $.gctour.img.del,
			title : $.gctour.lang('removeTour'),
			alt : $.gctour.lang('removeTour'),
			css : {
				'display' : (tours.length <= 1) ? 'none' : 'inline'
			},
			click : function () {
				deleteCurrentTour();
			}
		})).find("img.tourImage").addShadowEffect().addOpacityEffect();

	var $toolbar = $("<div>", {
			id : "gctour_toolbar",
			"css" : {
				height : 20,
				'-moz-user-select' : "none"
			}
		});

	$toolbar.append(
		// newTourButton
		$('<img>', {
			'class' : 'tourImage',
			src : $.gctour.img.newTour,
			title : $.gctour.lang('newList'),
			alt : $.gctour.lang('newList'),
			click : function () {
				newTourFunction()();
			}
		}),

		// toggleTourListButton
		$('<img>', {
			'class' : 'tourImage',
			src : $.gctour.img.openTour,
			title : $.gctour.lang('openTour'),
			alt : $.gctour.lang('openTour'),
			click : function () {
				openTourDialog();
			}
		}),

		// downloadButton
		$('<img>', {
			'class' : 'tourImage',
			src : $.gctour.img.download,
			title : $.gctour.lang('onlineTour'),
			alt : $.gctour.lang('onlineTour'),
			click : function () {
				downloadTourDialog();
			}
		}),

		// autoTourButton
		$('<img>', {
			'class' : 'tourImage',
			src : $.gctour.img.autoTour,
			title : $.gctour.lang('autoTour.title'),
			alt : $.gctour.lang('autoTour.title'),
			click : function () {
				var gooMap = getMapCenterAndRadius();
				showAutoTourDialog(gooMap.center, gooMap.radius);
			}
		}),

		// toggleSettingsButton
		$('<img>', {
			'class' : 'tourImage',
			src : $.gctour.img.settings,
			title : $.gctour.lang('showSettings'),
			alt : $.gctour.lang('showSettings'),
			click : function () {
				openSettingsDialog();
			}
		}),
		
		// GCTour Home
		$('<img>', {
			'class' : 'tourImage',
			src : $.gctour.img.globe,
			title : 'GCTour Home',
			alt : 'GCTour Home',
			style : "float: right; margin-right: 11px;",
			click : function () {
				GM_openInTab(GCTOUR_HOST);
			}
		}),

		// save settings info
		$('<img>', {
			'class' : 'tourImage',
			src : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAACOElEQVR42mWOS0hUcRTGv7kzjdM44fuJ1SJE27RqFbUwirBCcFEtyowEwWrhqkXrSoiQFqYoEQyJllEmFC0qSCzIwsRoMjMfjc6DGWduM/feuf/7v4/T4obOjL/NOd/5znc4oCx+r8VEKbMpZaZPfflJucAu4XhKkdN2P/11/ljT5fFXH21pEQWWozmBYGRDTCQ2Ry3neoG2xuND2YefvZvbCoRC60TEiSSd7Gbkk5a0iIiiCon8f6ZnYJyInM1nLtVUVwpul6TCW4CZXxH/6KSbra8shRv275U4JBWWCwVOSFQ4ODTqUqQUd+wxNOgGMhZKdu18MLYQnFrYd7jhfOsRboCbSMrgPlSUFwMQuE4qBzPATCQk1NcU3715Eigtq6vlADPBLWgWZAZV47ENUVBNKEw3bM+ADMSSKmCCSAO4Dm7AtMA0iBIDBCEtZdLyX2bAAJgODjicAqA7HEQAJxgAB2Rmvn0/XeLzuAS3G0AsKhZXlTgEKMDMbAjwzv6Ifw+zAo+Hc6QSmfVw6Mmj5/Fvw0LbiYOri3/cTh4JJ00TgXktIfo67nefbW95PRllHElRWVoJ9t4ZbD16AICDiAA8fPwGgFFUXVReUVVb6dkheIsQXM6sBtfm5gITIxPNhxr8/Te2Ajad1/sionqhs62wtBrAxNMXY/6Rxrqyxvrd9jYA0DZOXe3vGfv8QaWmjr6LXbfyXBe28bKv6/S1gaji8lVUIZXKc3Neyqb9ym3T7R2+1503/wcT3Lkk5CgrKAAAAABJRU5ErkJggg==',
			title : $.gctour.lang('saveSettings'),
			alt : $.gctour.lang('saveSettings'),
			style : "float: right;",
			click : function () {
				$('<div>' + $.gctour.lang('saveSettingsDesc') + '</div>').dialog($.gctour.dialog.info(), {
					title : $.gctour.lang('saveSettings'),
					width : 550
				});
			}
		})
		);

	var $header = $("<div>", {
			id : "gctour_header",
			"class" : "header gctour-grand-default" + ((sticky) ? " gctour-grand-hover" : ""),
			"css" : {
				height : 40,
				'cursor' : "pointer",
				'-moz-user-select' : "none"
			},
			"html" : "<img src='" + $.gctour.img.gctourLogo + "' style='margin: 6px 0px 0px;'/><small style='font-size: 75%;color:gray'>v " + VERSION + "</small>" +
			"<img id='gcTourPin' style='float:right;margin: 6px 2px 0 0;' src='" + ((sticky) ? $.gctour.img.pinned : $.gctour.img.pin) + "'>",
			click : function (e) {
				sticky = !sticky;
				GM_setValue('sticky', sticky);
				$("img#gcTourPin").attr("src", ((sticky) ? $.gctour.img.pinned : $.gctour.img.pin));
			}
		})
		.hover(
			function () {
			$(this).addClass('gctour-grand-hover');
		},
			function () {
			if (!sticky) {
				$(this).removeClass('gctour-grand-hover');
			}
		});

	var $footer = $('<div>', {
			id : "gctour_footer",
			"css" : {
				position : "absolute",
				bottom : -10,
				"font-size" : "75%",
				width : "100%",
				height : "30"
			},
			"html" :
			$("<div>", {
				"css" : {
					'width' : '100%'
				}
			}).append(
				$("<a>", {
					"css" : {
						'padding-left' : 5
					},
					href : GCTOUR_HOST,
					title : "GCTour Home",
					text : "GCTour Home"
				})
				.click(function () {
					window.open(this.href);
					return false;
				})).append(
				$("<div>", {
					"css" : {
						'float' : 'right',
						'margin-right' : 5
					},
					"html" : "v " + VERSION
				}))
		});

	$("#gctourContainer").append(
		$header,
		$toolbar,
		$tourHeader,
		$geocacheList /*,
		$footer*/
	);

	// populate the current list on load
	for (var i = 0; i < currentTour.geocaches.length; i++) {
		addNewTableCell(currentTour.geocaches[i], false);
	}

	if (currentTour.geocaches.length <= 0) {
		var table = document.getElementById('cacheList');
		table.innerHTML = $.gctour.lang('emptyList');
	}

	//finally: set new heights and layout!
	handleResize();

}

/* init gui utilities*/
function getEntryFromBookmarkTd(bmLine) {
	/*
	http://code.google.com/p/gctour/issues/detail?id=31
	own bookmark list - Tabellenstruktur
	1. checkbox
	2. Richtung und Entfernung
	3. Found
	4. GC Code
	5. Cache Name
	6. "extra Feld"
	other bookmark list - Tabellenstruktur
	1. checkbox
	2. Richtung und Entfernung
	3. GC Code
	4. Cache Name
	5. "extra Feld"
	 */

	var entry = {},
	colID = 2, // if this column is GC Code then other bookmark list
	nameSpan = $("span", bmLine.eq(colID)).eq(0);

	if ($.trim(bmLine.eq(colID).text()).length == 0) {
		colID++; // own bookmark list
	}
	entry.id = $.trim(bmLine.eq(colID).text());
	entry.name = (nameSpan.length > 0) ? nameSpan.parent().html().replace(/<img.*?>/, "") : $.trim(bmLine.eq(colID + 1).text());
	entry.guid = bmLine.eq(colID + 1).find('a:first').attr("href").split('guid=')[1];
	entry.image = bmLine.eq(colID + 1).find('img:first').attr('src').split("/")[4]; // index changed from 6 to 4
	entry.checked = bmLine.eq(0).find("input:checkbox:first").is(':checked');

	debug("Bookmarklist cache row" +
		"\n id: '" + entry.id + "'" +
		"\n Name: '" + entry.name + "'" +
		"\n Guid: '" + entry.guid + "'" +
		"\n image: '" + entry.image + "'" +
		"\n checked: '" + entry.checked + "'");

	return entry;
}

// get entries from old search page: https://www.geocaching.com/seek/nearest.aspx
function getEntriesFromOldSearchpage() {
	// Data Rows without header and without GCVote tr
	// <tr class="SolidRow Data BorderTop"> and
	// <tr class="AlternatingRow Data BorderTop">
	var q = $("table.SearchResultsTable tbody tr.Data");

	var entries = [];

	entries = q.map(function () {
			// ToDo: in 099... bei process autoTour ~ Zeile 172 fast gleich ~~ beide zusammenlegen ?!

			var entryTds = $(this).find('td');
			var entry = {};
			var lnk,
			checkbox,
			dt;

			// RegEx gc-id
			entryTds.eq(5).find("span").eq(1).text().search(/\|\s*GC(\S{2,9})\s*\|/);
			entry.id = "GC" + RegExp.$1;

			lnk = entryTds.eq(5).find("a.lnk:first");
			entry.name = $.trim(lnk.text());
			entry.available = (lnk.css('text-decoration') !== "line-through");

			entry.guid = entryTds.eq(4).find("a:first").attr("href").split('guid=')[1];
			
			entry.image = entryTds.eq(4).find("img:first").attr("src").replace(/wpttypes\//, "wpttypes/sm/");
			// remove image path
			entry.image = entry.image.split('/').pop();

			entry.type = entry.image.split('.')[0];
			// type Korrektur
			entry.type = (entry.type == "earthcache") ? 137 : entry.type;

			entry.pm_only = (entryTds.eq(6).find("img[src$='premium_only.png']").length > 0);

			dt = $.trim(entryTds.eq(7).find('img[src*="/images/icons/container/"]:first').closest('td').find('span.small').text());
			entry.difficulty = dt.split("/")[0];
			entry.terrain = dt.split("/")[1];

			entry.size = $.trim(entryTds.eq(7).find('img[src*="/images/icons/container/"]:first').attr("src").split("/")[4].split(".")[0]);

			entry.addBtnPosition = entryTds.eq(10);

			entry.checked = entryTds.eq(0).find("input:checkbox:first").is(':checked');

			entry.favorites = entryTds.eq(2).find("span[id$='FavoritesValue']").text();

			/*
			debug(
				"getEntriesFromOldSearchpage cache row: " + "\n" +
				"\tid:\t\t" + entry.id + "\n" +
				"\tname:\t\t" + entry.name + "\n" +
				"\tguid:\t\t" + entry.guid + "\n" +
				"\tavailable:\t" + entry.available + "\n" +
				"\timage:\t\t" + entry.image + "\n" +
				"\tsize:\t\t" + entry.size + "\n" +
				"\ttype:\t\t" + entry.type + "\n" +
				"\tdifficulty:\t" + entry.difficulty + "\n" +
				"\tterrain:\t" + entry.terrain + "\n" +
				"\tfavorites:\t" + entry.favorites + "\n" +
				"\tpm_only:\t" + entry.pm_only + "\n" +
				"\tchecked:\t" + entry.checked + "\n");
				*/

			return entry;
		}).get();

	return entries;
}

/* gui functions */
function isLogedIn() {
	if (userName) {
		return true;
	} else {
		$('<div>' + $.gctour.lang('notLogedIn') + '</div>').dialog($.gctour.dialog.info());
		return false;
	}
}

function isNotEmptyList() {
	if (currentTour.geocaches.length > 0) {
		return true;
	} else {
		$('<div>' + $.gctour.lang('emptyList') + '</div>').dialog($.gctour.dialog.info());
		return false;
	}
}

function showGeocacheNotification(geocache, event) {
	if (event.type == "success") {
		$.gctour.notification.add({
			title : $.gctour.lang('notifications.addgeocache.success.caption').format(geocache.id),
			text : $.gctour.lang('notifications.addgeocache.success.content').format(currentTour.name, geocache.name),
			icon : GS_HOST + GS_WPT_IMAGE_PATH + geocache.image,
			style : "green"
		});
	} else if (event.type == "contains") {
		$.gctour.notification.add({
			title : $.gctour.lang('notifications.addgeocache.contains.caption').format(geocache.id),
			text : $.gctour.lang('notifications.addgeocache.contains.content').format(currentTour.name, geocache.name),
			icon : GS_HOST + GS_WPT_IMAGE_PATH + geocache.image,
			style : "yellow"
		});
	} else {
		$.gctour.notification.add({
			title : "ERROR",
			text : "Event '" + event + "' is not supported!",
			style : "red"
		});
	}

	return;
	/*
	var popup = $("<div>", {
	"class": "gct_popup gctourContainer"
	}).appendTo("body");


	popup.html("<div class='gctour-grand-default gct_popup_header'>"+geocache.name+"</div>");


	//getting height and width of the message box
	var height = popup.height();
	var width = popup.width();
	//calculating offset for displaying popup message
	leftVal=event.pageX-(width/2)+"px";
	topVal=event.pageY-(height/2)+"px";
	//show the popup message and hide with fading effect
	//  popup.css({left:leftVal,top:topVal}).show().fadeOut(1500);
	popup.css({left:leftVal,top:topVal});

	setTimeout(function() {popup.fadeOut("slow");}, 1000 );

	 */
}

function handleResize(e) {
	// Change the height of the container and Cache List
	var container = $(window).height() - 30,
	header = $("#gctourContainer #gctour_header").height(), // 40
	toolbar = $("#gctourContainer #gctour_toolbar").height(), // 20;
	tourheader = $("#gctourContainer #gctour_tourHeader").height(),
	footer = $("#gctourContainer #gctour_footer").height(), // 14;
	minus = header + toolbar + tourheader + footer,
	cachelist = container - minus;

	// set the container height
	$('#gctourContainer').css("height", container);

	// set the cachelist height
	$('#cacheList').parent().css("height", cachelist);

	/*log(
	"handleResize change height:\n" +
	"\tcontainer:  " + container + "\n" +
	"\theader:     " + header + "\n" +
	"\ttoolbar:    " + toolbar + "\n" +
	"\ttourheader: " + tourheader + "\n" +
	"\tfooter:     " + footer + "\n" +
	"\t => cachelist:   " + cachelist)*/
}

function updateGUI() {
	var cacheList,
	i,
	table;

	// update the cache count
	updateCacheCount(currentTour.geocaches.length);
	// update tourName
	$("#tourName").html(currentTour.name);

	// update webcode
	var webcode = $("#webcode");

	if (currentTour.webcode) {
		webcode
		.find("a:first")
		.attr('href', GCTOUR_HOST + 'tour/' + $.trim(currentTour.webcode))
		.text(currentTour.webcode)
		.end()
		.show();
	} else {
		webcode.hide();
	}

	cacheList = $('#cacheList');
	cacheList.html("");

	// populate the current list on load
	for (i = 0; i < currentTour.geocaches.length; i++) {
		addNewTableCell(currentTour.geocaches[i], false);
	}

	if (currentTour.geocaches.length <= 0) {
		cacheList.html($.gctour.lang('emptyList'));
	}

	handleResize();

	var deleteButton = $('#gctourDeleteButton');
	if (tours.length == 1 && deleteButton) {
		deleteButton.hide();
	} else {
		deleteButton.show();
	}

}

// ToDo: switch to $.fn.addOpacityEffects
var addOpacityEffects = function (elem) {
	$(elem)
	.css({
		opacity : "1"
	})
	.bind({
		mouseenter : function () {
			$(this).stop().animate({
				opacity : '0.4'
			}, 200);
		},
		mouseleave : function () {
			$(this).stop().animate({
				opacity : '1'
			}, 300);
		}
	});
};

function addClickEffect(element) {
	return function () {
		element.style.background = '#a9b2bf';
	};
}

function removeClickEffect(element) {
	return function () {
		element.style.background = '#cdd8e8';
	};
}

function addHoverEffect(element) {
	return function () {
		element.style.margin = '0px';
		element.style.border = '1px solid lightgray';
		element.style.background = '#cdd8e8';
	};
}

function removeHoverEffect(element) {
	return function () {
		element.style.margin = '1px';
		element.style.border = '0px solid lightgray';
		element.style.background = '';
	};
}

function addHoverEffects(element) {
	element.addEventListener('mouseover', addHoverEffect(element), false);
	element.addEventListener('mouseout', removeHoverEffect(element), false);
	element.addEventListener('mousedown', addClickEffect(element), false);
	element.addEventListener('mouseup', removeClickEffect(element), false);
	element.style.margin = '1px';
}

function sendToGPS() {
	spawn(function* () {
		var dataStringElement,
		tourName,
		d,
		currentDateString;

		// add the overlay while loading
		addProgressbar();

		// fix width and height of the header
		$("div#dialogBody").find("h1").css({
			width : 486,
			height : 14
		});

		// first time send to GPS is clicked: Accept the License
		var accept_input = document.getElementById('chkAccept');
		if (accept_input) {
			accept_input.checked = "checked";
			document.getElementById('btnSubmit').click();
			return;
		}

		// change ALWAYS to Garmin
		var garmin_tab = document.getElementById('uxGPSProviderTabs').getElementsByTagName('li')[2];
		if (garmin_tab.getElementsByTagName('a')[0].className.toLowerCase().indexOf('selected') ===  -1) {
			unsafeWindow.__doPostBack('uxGPSProviderTabs', '2');
			return;
		}

		$('#uxGPSProviderTabs').html("<tbody><tr><td>GCTour: GARMIN ONLY</td></tr></tbody>");
		// remove PM nag screen for basic members
		$('#premiumUpsellMessage').remove();
		
		// change obsolete Garmin communicator links to signed mozilla communicator add-on
		$(document).ready(function() {
			$('#uxSendToGps a[href^="http://www.garmin.com/products/communicator"]').each(function() {	
				this.href = "https://addons.mozilla.org/de/firefox/addon/garmin-communicator/";
			})
		})

		try {
			dataStringElement = document.getElementById('dataString');
			dataStringElement.value = $.gctour.lang('pleaseWait');
			dataStringElement.value = yield getGPX();

			tourName = currentTour.name.replace(/\s+/g, "_").replace(/[^A-Za-z0-9_]*/g, "");

			d = new Date();
			currentDateString = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() +
				"_" + d.getHours() + "-" + d.getMinutes() + "-" + d.getSeconds();

			$('#cacheID').val('GCTour.' + tourName + '.' + currentDateString + '.gpx');

			// all done - remove the overlay
			closeOverlay();
		} catch (e) {
			addErrorDialog({
				caption : "Send to GPSr error",
				_exception : e
			});
		}
	})
}

function getMapGeocache(gcid) {
	return spawn(function* () {
		var geocache = yield getGeocache(gcid, 0);

		if (geocache !== "pm only") {
			var mapCache = {};
			mapCache.gcid = geocache.gcid;
			mapCache.guid = geocache.guid;
			mapCache.image = geocache.image;
			mapCache.name = geocache.name;
			mapCache.difficulty = geocache.difficulty;
			mapCache.terrain = geocache.terrain;
			mapCache.latitude = geocache.lat;
			mapCache.longitude = geocache.lon;

			// save additional waypoints
			var additional_waypoints = geocache.additional_waypoints;
			for (waypoint_i = 0; waypoint_i < additional_waypoints.length; waypoint_i++) {
				additional_waypoints[waypoint_i].note = "";
			}

			mapCache.additional_waypoints = additional_waypoints;
			return Promise.resolve(mapCache);
		}
	})
}

function getMapMarker(markerId) {
	var position = getPositionsOfId(markerId),
	marker = currentTour.geocaches[position];
	marker.index = position;
	return marker;
}

function uploadMap(markerObj, callback) {
	var jsonMap = JSON.stringify(markerObj).replace(/&/g, " and "); // IMPORTANT! prevents critical errors in webapplication
	postAsync(GCTOUR_HOST + 'map/save', "map=" + jsonMap, callback);
}

// to be removed later
function makeMapFunction_OLD() {
	if (!isNotEmptyList() || !isLogedIn()) {
		return;
	}

	spawn(function* () {
		var gcIds = [],
		wptIds = [],
		allIds = [],
		i,
		result;

		// add the overlay while loading
		addProgressbar({
			caption : $.gctour.lang('makeMapWait')
		});

		for (i = 0; i < currentTour.geocaches.length; ++i) {
			var marker = currentTour.geocaches[i];

			if (marker.id) {
				gcIds.push(marker.id);
				allIds.push(marker.id);
			} else if (marker.wptcode) {
				wptIds.push(marker.wptcode);
				allIds.push(marker.wptcode);
			}
		}

		var response = yield postPromise(GCTOUR_HOST + 'map/check/', "gcIds=" + gcIds.join(",") + "&wptIds=" + wptIds.join(","));
		try {
			result = JSON.parse(response.responseText);

			if (result.missing_wptIds.length === 0 && result.missing_gcIds.length === 0) { // map is completly available in appengine
				var mapUrl = yield getMapUrl_promise(allIds.join(","));
				GM_openInTab(mapUrl + "#gui");
				closeOverlay();
			} else {
				var geocaches = [];
				var costumMarkers = [];

				if (result.missing_gcIds.length > 0) {
					// fetch all caches in parallel, not one by one
					var promises = [];
					for (i = 0; i < result.missing_gcIds.length; i++) {
						promises.push(getMapGeocache(result.missing_gcIds[i]));
					}
					saveValue("progressBar", {"progress" : 0,"total" : result.missing_gcIds.length + result.missing_wptIds.length}); // for progress bar update
					var cache_objects = yield Promise.all(promises);
					GM_deleteValue("progressBar"); // progress bar update finished

					for (i = 0; i < result.missing_gcIds.length; i++) {
						var temp = cache_objects[i];
						if (temp) {
							geocaches.push(temp);
						}
					}
				}

				if (result.missing_wptIds.length > 0) {
					for (i = 0; i < result.missing_wptIds.length; i++) {
						costumMarkers.push(getMapMarker(result.missing_wptIds[i]));
						setProgress(i + result.missing_gcIds.length,
							result.missing_gcIds.length + result.missing_wptIds.length,
							document);
					}
				}

				var cacheObject = {};
				cacheObject.geocaches = geocaches;
				cacheObject.costumMarkers = costumMarkers;

				uploadMap(cacheObject, makeMapFunction);

			}

		} catch (e) {
			addErrorDialog({
				caption : "Temporary map error",
				_exception : e
			});
		}
	});
}

function makeMapFunction() {
	if (!isNotEmptyList() || !isLogedIn()) {
		return;
	}

	spawn(function* () {
		var gcIds = [],
		wptIds = [],
		allIds = [],
		i;

		// add the overlay while loading
		addProgressbar({
			caption : $.gctour.lang('makeMapWait')
		});

		// cache and custom marker IDs
		for (i = 0; i < currentTour.geocaches.length; ++i) {
			var marker = currentTour.geocaches[i];
			if (marker.id) {
				gcIds.push(marker.id);
				allIds.push(marker.id);
			} else if (marker.wptcode) {
				wptIds.push(marker.wptcode);
				allIds.push(marker.wptcode);
			}
		}

		try {
			// fetch all caches in parallel, not one by one
			var promises = [];
			for (i = 0; i < gcIds.length; i++) {
				promises.push(getMapGeocache(gcIds[i]));
			}
			saveValue("progressBar", {"progress" : 0,"total" : gcIds.length + wptIds.length}); // for progress bar update
			var cache_objects = yield Promise.all(promises);
			GM_deleteValue("progressBar"); // progress bar update finished

			// store map specific cache information in array
			var geocaches = [];
			for (i = 0; i < gcIds.length; i++) {
				geocaches.push(cache_objects[i]);
			}
			// store custom markers in array
			var costumMarkers = [];
			for (i = 0; i < wptIds.length; i++) {
				costumMarkers.push(getMapMarker(wptIds[i]));
				setProgress(i + gcIds.length, gcIds.length + wptIds.length, document);
			}
			// store caches and custom markers in object
			var cacheObject = {};
			cacheObject.geocaches = geocaches;
			cacheObject.costumMarkers = costumMarkers;

			// upload map content to server
			uploadMap(cacheObject, function(){});
			
			// open map content from server in new tab (request hash value according to tour content) 
			var mapUrl = yield getMapUrl_promise(allIds.join(","));
			GM_openInTab(mapUrl + "#gui");
			closeOverlay();

		} catch (e) {
			addErrorDialog({
				caption : "Temporary map error",
				_exception : e
			});
		}
	});
}

function upload(tour) {
	spawn(function* () {
		if (!tour.password) {
			tour.password = "not yet implemented";
		}
		var jsonTour = JSON.stringify(tour).replace(/&/g, " and "); // IMPORTANT! prevents critical errors in web application
		var response = yield postPromise(GCTOUR_HOST + 'tour/save', "tour=" + jsonTour);
		try {
			var tourServer = JSON.parse(response.responseText);
			// after an error you get this result, e.g.
			// {"message":"wrong password","type":"error"}

			// only if the result is a message
			if (tourServer.message && tourServer.type == "error") {
				var pw = prompt("falsches Passwort - bitte richtiges eingeben"); // TODO !!! LANGUAGES!!

				//if pw is empty or dialog closed
				if (!pw) {
					closeOverlay();
					return;
				}
				tour.password = pw;
				upload(tour);
			} else if (tourServer.message && tourServer.type == "info") {
				alert(tourServer.message);
				closeOverlay();
			} else { // result is a tour and could be saved - all done

				// remain to local id!!
				tourServer.id = tour.id;

				// and the password
				tourServer.password = tour.password;

				currentTour = tourServer;
				saveCurrentTour();
				updateTour();
				closeOverlay();

				var str = $.gctour.lang('tourUploaded1') + currentTour.webcode + $.gctour.lang('tourUploaded2');
				$('<div>' + str + '</div>').dialog($.gctour.dialog.info());
			}
		} catch (e) {
			addErrorDialog({
				caption : "Upload online tour error",
				_exception : e
			});
		}
	})
}

function uploadTourFunction(id) {
	if (!isNotEmptyList() || !isLogedIn()) {
		return;
	}

	var i,
	tour,
	geocaches,
	cache_i,
	costumMarker,
	geocache,
	mapCache,
	waypoint_i,
	codeString,
	costumMarkers;

	try {
		i = tours.map(function (tour) {
				return tour.id
			}).indexOf(id);
		if (i == -1) {
			throw ('uploadTourFunction(), line ' + new Error().lineNumber + ': tour for index "' + id + '" not found');
		}
		tour = tours[i];
		var nCaches = tour.geocaches.length;

		// add the overlay while loading
		addProgressbar({
			_document : document,
			closeCallback : function (_document) {
				return function () {
					if (confirm($.gctour.lang('cancel') + "?") == true) {
						GM_setValue("stopTask", true);
					}
				};
			}
		});

		//create the overview map
		geocaches = [];
		costumMarkers = [];

		// fetch all caches in parallel, not one by one
		var promises = [];
		var prog = 0;
		for (i = 0; i < nCaches; i++) {
			costumMarker = (typeof(tour.geocaches[i].latitude) != "undefined");
			if (costumMarker) {
				promises.push(tour.geocaches[i]);
				setProgress(prog++, nCaches, document)
			} else {
				promises.push(getMapGeocache(tour.geocaches[i].id));
			}
		}
		saveValue("progressBar", {
			"progress" : prog,
			"total" : nCaches
		}); // for progress bar update
		Promise.all(promises).then( function(cache_objects) {
			GM_deleteValue("progressBar"); // progress bar update finished
			for (i = 0; i < nCaches; ++i) {

				if (GM_getValue("stopTask", false)) {
					GM_setValue("stopTask", false);
					closeOverlay();
					return;
				}
				costumMarker = (typeof(tour.geocaches[i].latitude) != "undefined");
				if (!costumMarker) {
					mapCache = cache_objects[i];
					if (mapCache) {
						geocaches.push(mapCache);
					}
				} else {
					var cm = cache_objects[i];
					cm.index = i;
					costumMarkers.push(cm);
				}
			}

			// create request
			var tourObject = currentTour;
			tourObject.geocaches = geocaches;
			tourObject.costumMarkers = costumMarkers;
			tourObject.password = currentTour.password;
			upload(tourObject);
		})

	} catch (e) {
		addErrorDialog({
			caption : "uploadTourFunction error",
			_exception : e
		});
	}
}

function openSend2GpsDialog() {
	if (!isNotEmptyList() || !isLogedIn()) {
		return;
	}
	var overlay = getOverlay({
			caption : "Send to GPS",
			minimized : true
		});
	// Groundspeak pages "/seek/nearest.aspx*" hide contents of iframes --> Send to GPS does not work
	overlay.innerHTML = "<iframe src='" + GS_HOST + "seek/sendtogps.aspx?guid=3f26d17b-5fde-40c7-bbfb-3539964d0d31&tour=1' width='450px' height='350' scrolling='no' marginheight='0' marginwidth='0' frameborder='0'><p>Your browser does not support iframes.</p></iframe>";
}

function openSettingsDialog() {
	if (DEBUG_MODE && console && console.time) {
		console.time('show settings menu');
	}

	var settings = new Settings_jqUI();
	settings.show();

	if (DEBUG_MODE && console && console.time) {
		console.timeEnd('show settings menu');
	}
}

function populateTours() {
	var tour,
	tourListLi,
	tourLink,
	tourIt;

	var tourList = $('#dialogListContainer');
	tourList.html("");

	var tourListUl = $('<ul>', {
			"class" : "dialogList"
		});
	tourList.append(tourListUl);

	// construct tour list
	for (tourIt = 0; tourIt < tours.length; tourIt++) {
		tour = tours[tourIt];
		tourListLi = $('<li>', {
				id : "tour" + tour.id
			});
		tourListUl.append(tourListLi);

		tourLink = $('<a>', {
				"css" : {
					"cursor" : "pointer",
					"font-size" : 10,
					"color" : "#003399"
				},
				html : tour.name + "&nbsp;<small>(" + tour.geocaches.length + ")</small>"
			})
			.bind('click', {
				tour : tour
			}, function (e) {
				showCacheList(e.data.tour)();
			});

		// make the current Tour not clickable nor deletable!
		if (tour.id == currentTour.id) {
			//~ tourListLi.setAttribute("class", "activeTour");
			tourLink.css({
				'font-weight' : 'bolder'
			});
		} else {
			var deleteButton = $('<img>', {
					title : $.gctour.lang('removeTour'),
					src : $.gctour.img.del,
					"css" : {
						"cursor" : 'pointer',
						"margin-right" : 3,
						"float" : 'right'
					}
				})
				.bind('click', {
					tour : tour
				}, function (e) {
					deleteTourFunction(e.data.tour.id)();
				});

			tourListLi.append(deleteButton);
		}

		if (tour.webcode) {
			var webImage = $('<img>', {
					src : $.gctour.img.globeImage,
					"css" : {
						"float" : "left",
						"margin-right" : 3
					}
				});
			tourLink.append(webImage);
		}

		tourListLi.append(tourLink);
	}
}

function showCacheList(tour) {
	return function () {
		var cacheList = document.getElementById('dialogDetails');
		cacheList.scrollTop = 0;
		cacheList.setAttribute("tourid", tour.id);

		cacheList.innerHTML = "<u><b>" + tour.name + "</b>";
		if (tour.webcode) {
			cacheList.innerHTML += "&nbsp;&nbsp;&nbsp;<i>Webcode: <a href='" + GCTOUR_HOST + "tour/" + $.trim(tour.webcode) + "' title='" + $.gctour.lang('makeMap') + "' target='_blank'>" + tour.webcode + "</a></i>";
		}
		cacheList.innerHTML += "</u><br/>";

		var copyButton = document.createElement('img');
		copyButton.title = $.gctour.lang('copyTour');
		copyButton.src = $.gctour.img.copy;
		copyButton.style.cursor = 'pointer';
		copyButton.style.marginRight = '5px';
		copyButton.style.cssFloat = 'right';
		copyButton.addEventListener('click', function () {

			var newTour = JSON.parse(JSON.stringify(tour));
			newTour.id = getNewTourId();

			newTour.name = newTour.name + " - " + $.gctour.lang('copy');

			tours.push(newTour);
			log("Creating copy tour: " + newTour.id + " ; " + newTour.name);

			saveTour(newTour, true);

			populateTours();

			showCacheList(newTour)();
		}, false);

		var deleteButton = document.createElement('img');
		deleteButton.title = $.gctour.lang('removeTour');
		deleteButton.src = $.gctour.img.del;
		deleteButton.style.cursor = 'pointer';
		deleteButton.style.marginRight = '5px';
		deleteButton.style.cssFloat = 'right';
		deleteButton.addEventListener('click', deleteTourFunction(tour.id), false);

		var renameButton = document.createElement('img');
		renameButton.src = $.gctour.img.edit;
		renameButton.title = $.gctour.lang('rename');
		renameButton.alt = $.gctour.lang('rename');
		renameButton.style.cursor = 'pointer';
		renameButton.style.marginRight = '5px';
		renameButton.style.cssFloat = 'right';
		renameButton.addEventListener('click',

			function () {
			var newTourName = prompt($.gctour.lang('newTourDialog'), tour.name);
			if (!newTourName) {
				return;
			}
			tour.name = newTourName;
			saveTour(tour, true);
			populateTours();

			showCacheList(tour)();
		}, false);

		if (tour.id != currentTour.id) {
			cacheList.insertBefore(deleteButton, cacheList.firstChild);
		}

		cacheList.insertBefore(renameButton, cacheList.firstChild);
		cacheList.insertBefore(copyButton, cacheList.firstChild);

		var cacheListUl = createElement('ul');
		cacheListUl.setAttribute("class", "dialogList");

		for (var cacheIt = 0; cacheIt < tour.geocaches.length; cacheIt++) {
			var geocache = tour.geocaches[cacheIt];

			var cacheListLi = createElement('li', {
					style : "b"
				});
			append(cacheListLi, cacheListUl);
			cacheListLi.innerHTML = "<img src='" + geocache.image + "' style='margin-left=10px'> " + geocache.name + '&nbsp;<small style="font-size: 90%;">' + ((geocache.id !== undefined) ? '('+geocache.id+')' : '') + "</small>";

		}
		append(cacheListUl, cacheList);

		// make loadButton available


		var loadButton = document.getElementById('loadButton');
		loadButton.value = '"' + tour.name + '"';
		loadButton.removeAttribute('disabled');

		// first remove all active tour css classes
		$("ul.dialogList > li").removeClass("activeTour");
		//and then set it to the clicked
		$('#tour' + tour.id).addClass("activeTour");
	};
}

function openTourDialog() {
	var overLay = getOverlay({
			caption : $.gctour.lang('openTour')
		});
	var tourList = createElement('div', {
			id : "dialogListContainer"
		});
	append(tourList, overLay);
	var cacheList = createElement('div', {
			id : "dialogDetails"
		});
	append(cacheList, overLay);

	populateTours();

	// load,close buttons
	var buttonsDiv = createElement('div', {
			style : "width:580px;position: absolute; bottom: 10px;"
		});
	append(buttonsDiv, overLay);
	buttonsDiv.setAttribute('class', 'dialogFooter');

	var closeButton = createElement('input', {
			type : "button",
			value : $.gctour.lang('cancel'),
			style : "background-image:url(" + $.gctour.img.closebutton + ")"
		});
	append(closeButton, buttonsDiv);
	closeButton.addEventListener('click', closeOverlay, false);

	var loadButton = createElement('input', {
			type : "button",
			value : $.gctour.lang('load'),
			disabled : "",
			id : "loadButton",
			style : "background-image:url(" + $.gctour.img.openTour + ")"
		});
	append(loadButton, buttonsDiv);
	loadButton.addEventListener('click', function () {
		var id = $("#dialogDetails").attr("tourid"); // ToDo: to $().data
		loadTour(id)();
		closeOverlay();
	}, false);

	// load currentTour
	showCacheList(currentTour)();

	loadButton.setAttribute("disabled", "disabled");
}

function downloadTourFunction(webcode, _url) {
	var url,
	onlineTour;

	// add the overlay while loading
	addProgressbar();

	url = GCTOUR_HOST + 'tour/' + $.trim(webcode) + '/json';
	if (typeof _url !== "undefined") { // url to old server
		url = _url;
	}
	getAsync(url, function (response) {
		var responseObject;
		var booResponse = (response.status === 200); // only status 200
		var booIsJson = isJSON(response.responseText); // is response json ?

		if (!booResponse || !booIsJson) {
			alert("Webcode '" + webcode + "' could not be loaded.\n" +
				response.status + ", " + response.statusText + ((booIsJson) ? "" : ", format is not valid"));
			closeOverlay();
			return false;
		}

		try {
			responseObject = JSON.parse(response.responseText);

			if (responseObject.type == "error" && responseObject.message == "no tour") {
				// if webcode was not found on new server, try old server
				if (response.finalUrl.indexOf(GCTOUR_HOST) >= 0) {
					downloadTourFunction(webcode, 'http://gctour.madd.in/tour/' + $.trim(webcode) + '/json');
					closeOverlay();
					return false;
				}
				// neither on new nor on old server
				$('<div>' + $.gctour.lang('webcodeerror') + '</div>').dialog($.gctour.dialog.info());
			} else if (responseObject.type == "oldtour") {
				onlineTour = JSON.parse(responseObject.message);
				onlineTour.id = getNewTourId();

				tours.push(onlineTour);
				saveCurrentTour();

				log("Download of an old online tour successful: " + onlineTour.id + " ; " + onlineTour.name);
				closeOverlay();
				alert("tour '" + onlineTour.name + "'\n" + $.gctour.lang('webcodesuccess') + "\n" + $.gctour.lang('webcodeOld'));
				loadTour(onlineTour.id)();

			} else {
				onlineTour = responseObject;
				onlineTour.id = getNewTourId();

				tours.push(onlineTour);
				saveCurrentTour();
				closeOverlay();

				var str = "<br>Tour <u>" + onlineTour.name + "</u> " + $.gctour.lang("webcodesuccess");
				$('<div>' + str + '</div>').dialog($.gctour.dialog.info());

				loadTour(onlineTour.id)();
			}
		} catch (e) {
			addErrorDialog({
				caption : "Download tour error",
				_exception : e
			});
		}
	});
}

function downloadTourDialog() {
	var overlay = getOverlay({
			caption : $.gctour.lang('webcodeDownloadButton'),
			minimized : true
		});

	var divEbene = createElement('div');
	append(divEbene, overlay);

	divEbene.innerHTML = '<b>Webcode:</b>&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" id="webcodeInput" class="gctour-input-text" style="width:300px;"><br/>' + $.gctour.lang('webcodeDownloadHelp');

	divEbene = createElement('div');
	append(divEbene, overlay);
	divEbene.setAttribute('class', 'dialogFooter');

	var downloadButton = createElement('input', {
			type : "button",
			value : $.gctour.lang('webcodeDownloadButton'),
			style : "background-image:url(" + $.gctour.img.download + ")"
		});
	append(downloadButton, divEbene);
	downloadButton.addEventListener('click', function () {
		var webcode = $.trim($('#webcodeInput').val());
		if (webcode == "") {
			return;
		}
		downloadTourFunction(webcode);
	}, false);

}

/* BETA begin GCTour send2cgeo */
// TODO: move style definition to function "initStyle()"
GM_addStyle("" +
	"#gctour_send2cgeo_progressbar {" +
	"  margin: 2px 0;" +
	"}" +
	"" +
	".hide {" +
	"  display: none;" +
	"}" +
	".ui-progressbar {" +
	"  position: relative;" +
	//"  width: 60%;" +
	"}" +
	"" +
	".ui-progressbar-value {" +
	"}" +
	".progress-label {" +
	"  position: absolute;" +
	"  width: 100%;" +
	"  text-align: center;" +
	"  top: 4px;" +
	"  font-weight: bold;" +
	"}" +
	"ol li {" +
	"  padding: 2px;" +
	"}" +
	"ul {" +
	"  list-style-type: disc;" +
	"}" +
	"ul, ol {" +
	"  padding-left: 1.5em;" +
	"  margin-bottom: 0.5em;" +
	"  margin-left: 1.5em;" +
	"}" +
	"");

function send2cgeo() {

	var cacheIDs = [],
	caches = currentTour.geocaches,
	cacheIDsCount = 0, // number of caches
	group = 1, // number of IDs to submit simultaneously
	url = "https://send2.cgeo.org/add.html",

	$pBar = $("#gctour_send2cgeo_progressbar"),
	$btn = $("#btnSend2cgeo"),

	txtReg = "Register first!", // response from Send2cgeo if browser is not registered
	txtSuc = "Success!", // response from Send2cgeo if submission was successful

	// cache IDs
	cacheIDs = $.map(caches, function (n, i) {
			return ((n.id !== undefined) ? n.id : null);
		});
	cacheIDsCount = cacheIDs.length;

	// set progress bar options
	$pBar
	.progressbar("option", {
		"value" : 0,
		"max" : cacheIDsCount
	})
	.removeClass("hide");

	// disable Send2cgeo button
	$btn.button("disable");

	// send cacheIDs recursively
	function sendRequests(fromPos) {

		group = cacheIDsCount; // instead one by one, send all cacheIDs by one call
		var toPos = fromPos + group,
		param = "",
		res = "",
		boo = true;

		toPos = (toPos > cacheIDsCount) ? cacheIDsCount : toPos;
		// cacheIDs to send
		param = cacheIDs.slice(fromPos, toPos).join(",");

		// submit and wait for response
		res = getSync(url + "?cache=" + param); // https://send2.cgeo.org/add.html?cache=GC123,GC345
		res = res.responseText;
		$pBar.progressbar("option", "value", toPos);

		if (res.indexOf(txtReg) !== -1) { // browser not registered
			boo = false;
			$('<div>' + $.gctour.lang('send2cgeo.register') + '</div>').dialog();
			$pBar.addClass("hide");
			$btn.button("enable");
		} else if (res.indexOf(txtSuc) === -1) { // response not ok (cache probably could not be added to the queue)
			boo = false;
			$('<div>' + $.gctour.lang('send2cgeo.senderror') + '</div>').dialog();
			$pBar.addClass("hide");
			$btn.button("enable");
		}

		fromPos = toPos;
		if (cacheIDsCount > fromPos && boo) {
			sendRequests(fromPos);
		}

	};

	// start recursion by sending first cacheID
	if (cacheIDsCount > 0) {
		sendRequests(0);
	}
}

var openGcTour2cgeoDialog = function () {

	if (!DEBUG_MODE) {
		return;
	}
	
	if (!isNotEmptyList() || !isLogedIn()) {
		return;
	}

	var cacheIDsCount = $.grep(currentTour.geocaches, function (n, i) {
			return (n.id !== undefined);
		}).length,
	waypointCount = currentTour.geocaches.length - cacheIDsCount,
	noWP = (waypointCount > 0 ? ' (' + $.gctour.lang('send2cgeo.noWP') + ')' : ''),
	btnText = $.gctour.lang('send2cgeo.title') + noWP,

	/*
	$content = $('<div id="dlgsendtocgeo">' +
		'<br>' +
		'<ol>' +
			'<li>' +
				'<div><button id="btnSend2cgeo">' + btnText + '</button></div>' + 
				'<div id="gctour_send2cgeo_progressbar" class="hide"><div class="progress-label">Sending...</div></div>'+
			'</li>' +
			$.gctour.lang('send2cgeo.usage') +
		'</ol>' +
		'<hr>' +

		'<div>' +
		'<strong>Send2cgeo</strong>' +
		'<ul>' +
			'<li><a target="_blank" href="https://send2.cgeo.org/home.html">' + $.gctour.lang('send2cgeo.overview') + '</a></li>' +
			'<li><a target="_blank" href="http://www.cgeo.org/faq.html#send2cgeo">FAQ</a></li>' +
		'</ul>' +
		'</div>' +
		'<div>' +
		'<strong>' + $.gctour.lang('send2cgeo.setup.header') + '</strong>' +
		'<ol>' +
			'<li><a href="https://send2.cgeo.org/api/browser.html" target="_blank" title="https://send2.cgeo.org/api/browser.html">' + $.gctour.lang('send2cgeo.setup.registerBrowser') + '</a></li>' +
			$.gctour.lang('send2cgeo.setup.desc1') +
			'<li>' +
				'<form name="device" action="https://send2.cgeo.org/pin.html" target="_blank" method="post">' +
				'<label for="pin" class="gctour-label">' + $.gctour.lang('send2cgeo.setup.desc2') + ' </label> ' +
				'<input name="pin" type="text" value="" maxlength="5" class="gctour-input-text" style="width: 5em; text-align: center;"/>' +
				'<input name="button" type="submit" value="' + $.gctour.lang('send2cgeo.setup.desc3') + '" class="ui-button" style="margin-left: 10px;"/>' +
				'</form>' +
			'</li>' +
		'</ol>' +
		'</div>' +
		'</div>');

	// event create zuweisen (unabhängig ob es schon ein create event existiert)
	$content.on("dialogcreate", function (event, ui) {
		var $thisDlg = $(this).dialog("widget"),
		$progressbar = $thisDlg.find("#gctour_send2cgeo_progressbar"),
		$pl = $thisDlg.find(".progress-label");

		$thisDlg.find("input[type=submit], button").button();

		$progressbar.progressbar({
			value : false,
			max : currentTour.geocaches.length,
			change : function (e, ui) {
				var $pBar = $(this),
				value = $pBar.progressbar("value"),
				max = $pBar.progressbar("option", "max");

				$pl.text(value + " / " + max);
			},
			complete : function () {
				$pl.text($pl.text() + " Complete!");
			}
		});

		$thisDlg.find("#btnSend2cgeo").on('click', {}, function (e) {
			send2cgeo();
		});
	});
	
	var $overLay = $content.dialog($.gctour.dialog.info(), {
			title : $.gctour.lang('send2cgeo.title'),
			width : '75%',
			maxHeight : $(window).height() - 20,
			resizable : false,
			dialogClass : 'gct_dialog',
			buttons : [{
					text : $.gctour.lang("close"),
					icons : {
						primary : "ui-icon-closethick"
					},
					click : function () {
						$(this).dialog("close");
					}
				}
			]
	});
	*/

	send = 
	'<div id="dlgsendtocgeo">' +
	'<br>' +
	'<ol>' +
		'<li>' +
			'<div><button id="btnSend2cgeo">' + btnText + '</button></div>' + 
			'<div id="gctour_send2cgeo_progressbar" class="hide">' + // hide progress bar
				'<div class="progress-label"></div>' +
			'</div>'+
		'</li>' +
		$.gctour.lang('send2cgeo.usage') +
	'</ol>' + 
	'</div>',
		
	setup =
	'<div>' +
		'<strong>' + $.gctour.lang('send2cgeo.setup.header') + '</strong>' +
		'<ol>' +
			'<li><a href="https://send2.cgeo.org/api/browser.html" target="_blank" title="https://send2.cgeo.org/api/browser.html">' + $.gctour.lang('send2cgeo.setup.registerBrowser') + '</a></li>' +
			$.gctour.lang('send2cgeo.setup.desc1') +
			'<li>' +
				'<form name="device" action="https://send2.cgeo.org/pin.html" target="_blank" method="post">' +
				'<label for="pin" class="gctour-label">' + $.gctour.lang('send2cgeo.setup.desc2') + '</label> ' +
				'<input name="pin" type="text" placeholder="12345" maxlength="5" class="gctour-input-text" style="width: 5em; text-align: center;"/>' +
				'<input name="button" type="submit" value="' + $.gctour.lang('send2cgeo.setup.desc3') + '" class="ui-button" style="margin-left: 10px;"/>' +
				'</form>' +
			'</li>' +
		'</ol>' +
	'</div>' +
	'<br>' +
	'<hr>' +
	'<div>' +
		'<strong>Send2cgeo</strong>' +
		'<ul>' +
			'<li><a target="_blank" href="https://send2.cgeo.org/home.html">' + $.gctour.lang('send2cgeo.overview') + '</a></li>' +
			'<li><a target="_blank" href="http://www.cgeo.org/faq.html#send2cgeo">FAQ</a></li>' +
		'</ul>' +
	'</div>',
	
	// dialog tabs structure
	$tabs = $(
		'<div id="tabs">' +
		'  <ul>' +
		'    <li><a href="#tabs-1">Send</a></li>' +
		'    <li><a href="#tabs-2">Setup</a></li>' +
		'  </ul>' +
		'  <div id="tabs-1">' + send + '</div>' +
		'  <div id="tabs-2">' + setup + '</div>' +
		'</div>'
	);

	$tabs.on("dialogcreate", function () {
		var $thisDlg = $(this).dialog("widget"),
		$progressbar = $thisDlg.find("#gctour_send2cgeo_progressbar"),
		$pl = $thisDlg.find(".progress-label");

		$thisDlg.find("input[type=submit], button").button();

		$progressbar.progressbar({
			value: false,
			max: currentTour.geocaches.length,
			change: function() {
				var $pBar = $(this),
				value = $pBar.progressbar("value"),
				max = $pBar.progressbar("option", "max");
				$pl.text(value + " / " + max);
			},
			complete: function () {
				$pl.text($pl.text() + " Complete!");
			}
		});

		$thisDlg.find("#btnSend2cgeo").on('click', {}, function () {
			send2cgeo();
		});
	});

	// tabs menu
	$tabs.dialog($.gctour.dialog.info(), {
		title: $.gctour.lang('send2cgeo.title'),
		width: '75%',
		maxHeight: $(window).height() - 20,
		resizable: false,
		dialogClass: 'gct_dialog',
		buttons: [{
				text: $.gctour.lang("close"),
				icons: {
					primary: "ui-icon-closethick"
				},
				click: function () {
					$(this).dialog("close");
				}
			}]
	});
	// different font size on new search page necessary
	if (document.URL.search("\/play\/search") >= 0) {
		var $elem = $("div.ui-widget");
		$elem.attr('style', $elem.attr('style') + ';font-size: 0.8em !important');
	}
	$("div#tabs").tabs({
		heightStyle: "content"
	});
	
	//-----------------------------------

};
/* BETA end GcTour send2cgeo */

/* overlays */
/* usage:
var options = {
caption: "Test Beschriftung",
color: 'red',
_document: document,
minimized: true,
closeCallback : function(_document){alert('oioio');}
}
getOverlay(options);
 */
function closeOverlayRemote(theDocument) {
	return function () {
		$(theDocument)
		.find("#dialogMask").remove().end()
		.find("#dialogBody").remove().end()
		.find("#progressOverlay").remove();
	};
}

function getOverlay(options) {
	var bodyNew,
	verLay,
	overlayMarker,
	title,
	closeDiv,
	closeButton,
	caption,
	theDocument,
	background_color;

	caption = options.caption;
	localDocument = options._document || document;
	background_color = options.color || "#B2D4F3";

	bodyNew = localDocument.getElementsByTagName('body')[0];

	// first - close all old overlays
	closeOverlayRemote(localDocument)();

	overLay = localDocument.createElement('div');
	overLay.align = 'center';
	overLay.className = 'dialogMask';
	overLay.id = "dialogMask";

	var dialogBody = localDocument.createElement('div');
	dialogBody.id = "dialogBody";
	dialogBody.className = "dialogBody header";
	if (options.minimized) {
		dialogBody.className += " dialogMin";
	}

	var dialogHead = localDocument.createElement('h1');
	append(dialogHead, dialogBody);
	dialogHead.style.backgroundColor = background_color;

	var icon = "<img style='float:left;position:relative;top:-3px;' src='" + $.gctour.img.gctourLogo + "'>";
	dialogHead.innerHTML = icon + caption;

	closeButton = createElement('img', {
			style : "cursor:pointer;"
		});
	append(closeButton, dialogHead);
	closeButton.style.cssFloat = "right";
	closeButton.src = $.gctour.img.closebutton;

	var closeFunction = options.closeCallback || closeOverlayRemote;
	closeButton.addEventListener('click', closeFunction(localDocument), false);
	//addOpacityEffects(closeButton);

	var dialogContent = localDocument.createElement('div');
	append(dialogContent, dialogBody);
	dialogContent.className = "dialogContent";

	bodyNew.appendChild(overLay);
	bodyNew.appendChild(dialogBody);

	return dialogContent;
}

function closeOverlay() {
	closeOverlayRemote(document)();
}

function getListOverlay(options) {
	var overlay = getOverlay(options);
	var list = createElement('div', {
			id : "dialogListContainer"
		});
	append(list, overlay);

	var listUl = createElement('ul');
	listUl.setAttribute("class", "dialogList");
	append(listUl, list);

	var details = createElement('div', {
			id : "dialogDetails"
		});
	append(details, overlay);

	var dialogFooter = createElement('div', {
			style : "width:580px;position: absolute; bottom: 10px;"
		});
	append(dialogFooter, overlay);
	dialogFooter.setAttribute('class', 'dialogFooter');

	var close = createElement('input', {
			type : "button",
			value : $.gctour.lang('close'),
			style : "background-image:url(" + $.gctour.img.save + ")"
		});
	append(close, dialogFooter);
	close.addEventListener('click', closeOverlay, false);

	return [listUl, details];
}

function addErrorDialog(options) {
	var localDocument,
	post_data;
	localDocument = options._document || document;

	closeOverlay();
	options.minimized = true;
	options.color = "#f00";
	options.caption = options.caption || 'Error'; 

	//log the exception:
	log_exception(options._exception);

	var overlay = getOverlay(options);
	$(overlay).append(

		$('<div/>')
		.css('border', '1px dashed red')
		.css('clear', 'both')
		.css('margin', '3px').css('padding', '5px')
		.html('<b>' + options._exception + '</b>'),
		//.html(GM_getValue("debug_lastgcid", "") + ': <b>' + options._exception + '</b>'),

		$('<div/>')
		.html($.gctour.lang('dlg.error.content')),

		$('<div/>')
		.addClass('dialogFooter')
		.append(

			$('<input/>')
			.attr('onclick', 'return false;')
			.attr('type', 'button')
			.attr('value', $.gctour.lang('close'))
			.css('background-image', 'url(' + $.gctour.img.closebutton + ')')
			.bind('click', function () {

				if (localDocument == document) {
					closeOverlayRemote(localDocument)();
				} else { // if we are on the printview - close the whole window
					localDocument.defaultView.close();
				}
			})
			// suppressing send message button
			/*,

			$('<input/>')
			.attr('onclick', 'return false;')
			.attr('type', 'button')
			.attr('value', $.gctour.lang('dlg.error.send'))
			.css('background-image', 'url(' + $.gctour.img.sendMessage + ')')
			.bind('click', function () {
			post_data = [
			"version=" + VERSION,
			"exception=" + options._exception,
			"username=" + userName,
			"gccode=" + GM_getValue("debug_lastgcid", ""),
			"errorSource=" + options.caption,
			"userAgent=" + unsafeWindow.navigator.userAgent,
			"lastTour=" + JSON.stringify(currentTour),
			"userNote=" + $('#gctour_error_note').val()
			].join("&");

			// expects a post with these fields:
			//    - version: 2.1.11293
			//    - exception: TypeError: span#ctl00_ContentBody_LatLon is undefined
			//    - gccode: GC2W6GG
			//    - errorSource: Upload tour error
			//    - username: MOKA28
			//    - userAgent: Mozilla/5.0 (Windows NT 6.1; rv:7.0.1) Gecko/20100101 Firefox/7.0.1
			//    - lastTour:  {"id":43,"name":"Limes","geocaches":[{"id":"GC2W6GG","name":"Limesturm","guid":"61e421f5-c68b-43be-9257-648648c0deac","image":"http://www.geocaching.com/images/wpttypes/sm/3.gif"},{"id":"GC1TN89","name":"Brunnencache - im Strütbachtal","guid":"badf0b94-9986-406e-a809-531d8289421a","image":"http://www.geocaching.com/images/wpttypes/sm/2.gif"},{"id":"GC15YWV","name":"Porta Caracalla","guid":"606441b0-1988-4ca4-8c50-cc202fed92bb","image":"http://www.geocaching.com/images/wpttypes/sm/2.gif"},{"id":"GC2QF45","name":"Strütbachreiter I","guid":"ff785a18-7ea3-4dc8-8608-ccb5f143bedd","image":"http://www.geocaching.com/images/wpttypes/sm/3.gif"},{"id":"GC2EPR0","name":"Rainau-Buch - Nähe Grill/Spielplatz","guid":"8c84156d-3969-4663-a878-2b5da0163bd9","image":"http://www.geocaching.com/images/wpttypes/sm/2.gif"}]}

			postAsync(GCTOUR_HOST + "errors/send", post_data, function (response) {
			//log('response from server: ' + response.responseText);
			});

			if (localDocument == document) {
			closeOverlayRemote(localDocument)();
			} else { // if we are on the printview - close the whole window
			localDocument.defaultView.close();
			}
			})*/
		)).find("#gctour_update_error_dialog").bind('click', function () {
		update(true);
	});
}

function addProgressbar(options) {
	var overlay;
	if (options) {
		var theDocument = options._document || document;
		var theCaption = options.caption || $.gctour.lang('pleaseWait');

		if (options.closeCallback) {
			overlay = getOverlay({
					caption : theCaption,
					minimized : true,
					_document : theDocument,
					closeCallback : options.closeCallback
				});
		} else {
			overlay = getOverlay({
					caption : theCaption,
					minimized : true,
					_document : theDocument
				});
		}

	} else {
		overlay = getOverlay({
				caption : $.gctour.lang('pleaseWait'),
				minimized : true,
				_document : document
			});
	}

	var progressBarContainer = document.createElement('div');
	append(progressBarContainer, overlay);
	progressBarContainer.style.marginLeft = "135px";

	var progressBar = document.createElement('div');
	append(progressBar, progressBarContainer);
	progressBar.style.border = '1px solid lightgray';
	progressBar.style.height = '13px';
	progressBar.style.width = '208px';
	progressBar.style.cssFloat = 'left';
	progressBar.style.margin = '10px';
	progressBar.style.align = 'center';
	progressBar.style.lineHeight = '13px';
	progressBar.style.verticalAlign = 'middle';
	progressBar.style.background = "url(" + $.gctour.img.loader2 + ")";
	progressBar.style.setProperty("-moz-border-radius", "4px", "");
	progressBar.style.setProperty("border-radius", "4px", "");

	var progressBarElement = document.createElement('div');
	append(progressBarElement, progressBarContainer);
	progressBarElement.id = 'progressbar';
	progressBarElement.style.opacity = '0.6';
	progressBarElement.style.width = '0px';
	progressBarElement.style.height = '13px';
	progressBarElement.style.fontSize = '10px';
	progressBarElement.style.backgroundColor = '#E78F08';
	progressBarElement.style.position = 'absolute';
	progressBarElement.style.margin = '11px';
	progressBarElement.align = 'center';
	progressBarElement.style.setProperty("-moz-border-radius", "4px", "");
	progressBarElement.style.setProperty("border-radius", "4px", "");

}

function setProgress(i, count, theDocument) {
	var width = ((208 * (i + 1)) / count);
	$("#progressbar", theDocument)
	.css('width', width)
	.html("<b>" + (i + 1) + "/" + count + "</b>");
}

function updateProgressBar() {
	var progBar = loadValue("progressBar", false);
	if (progBar !== false) {
		setProgress(progBar.progress, progBar.total, document)
		progBar.progress = progBar.progress + 1;
		saveValue("progressBar", progBar);
	}
}

/* gui notifications */
$.gctour.notification = $.gctour.notification || {};

$.gctour.notification.init = function () {

	var $noteBlock = $('<ul>', {
			id : "gctour-notification-box"
		}).appendTo('body');

};

$.gctour.notification.add = function (options) {

	//~ var content = (options.title != null)?:"nix title"s;
	var content = (options.icon) ? "<img style='float:left;padding-right:6px;'src='" + options.icon + "'/>" : "";
	content += (options.title) ? "<span style='font-size:18px'><b>" + options.title + "</b></span><br/>" : "";
	content += (options.text) ? options.text : "";

	var $note = $('<li>', {
			"class" : "gctour-notification-" + ((options.style) ? options.style : "green"),
			click : function () {
				$(this).animate({
					height : 0
				}, 300, "linear", function () {
					$(this).remove();
				});
			}
		})
		.disableSelection()
		.append(
			$('<div>', {
				html : content,
				css : {
					'font-size' : '13px',
					'line-height' : '16px',
					'padding' : '8px 10px 9px',
					'position' : 'relative',
					'text-align' : 'left',
					'width' : 'auto'
				}
			}))
		//~ .prependTo(  $('#gctour-notification-box') ).show('fast');
		.prependTo($('#gctour-notification-box'));

	setTimeout(function () {
		$note.animate({
			height : 0
		}, 600, "linear", function () {
			$note.remove();
		});
	}, 6000);

};

$.gctour.notification.init();

// TEST AREA BEGIN
/*if (DEBUG_MODE) {
	var dummyNote = [{
			title : "test",
			icon : GS_HOST + GS_WPT_IMAGE_PATH + "2.gif",
			text : "1. eine test Nachricht!",
			style : "yellow"
		}, {
			title : "test",
			icon : GS_HOST + GS_WPT_IMAGE_PATH + "3.gif",
			text : "2. eine test Nachricht! mit längeren Text",
			style : "red"
		}, {
			title : "test",
			icon : GS_HOST + GS_WPT_IMAGE_PATH + "4.gif",
			text : "3. eine test Nachricht! mit wirlich sehr langem langem Text, oder ?",
			style : "blue"
		}, {
			title : "test",
			icon : GS_HOST + GS_WPT_IMAGE_PATH + "2.gif",
			text : "4. eine test Nachricht!"
		}
	],
	dummyNoteZaehler = 0,
	dummyNoteLength = dummyNote.length,
	dummyNoteInterval,

	foo = function () {
		if ((0 <= dummyNoteZaehler) && (dummyNoteZaehler <= dummyNote.length)) {
			$.gctour.notification.add(dummyNote[dummyNoteZaehler]);
		}
		dummyNoteZaehler++;
		if (dummyNoteZaehler >= dummyNoteLength) {
			clearInterval(dummyNoteInterval);
			dummyNoteZaehler = 0;
		}
	};

	$('#ctl00_uxLoginStatus_hlHeaderAvatar').hover(function () {
		clearInterval(dummyNoteInterval);
		dummyNoteZaehler = 0;
		dummyNoteInterval = window.setInterval(foo, 500);
	});

}*/
// TEST AREA END

/* own-marker */
function changeType(value, table, typeArray, staticMap) {
	return function () {
		var trElement,
		i,
		tdElement;

		document.getElementById('typeInput').value = value[0];
		document.getElementById('typeInputSym').value = value[1];

		staticMap.setIcon(value[0]);

		table.innerHTML = "";

		trElement = createElement('tr', {
				style : "height:27px"
			});
		table.appendChild(trElement);
		for (i = 0; i < typeArray.length; i++) {
			tdElement = createElement('td', {
					style : "width:25px;"
				});
			tdElement.style.cursor = 'pointer';
			tdElement.style.padding = '0px';
			tdElement.style.border = '1px solid silver';
			tdElement.style.background = "url(" + typeArray[i][0] + ") center center no-repeat";
			if (typeArray[i][0] == value[0]) {
				tdElement.style.backgroundColor = '#B2D4F3';
			}
			tdElement.addEventListener('click', changeType(typeArray[i], table, typeArray, staticMap), false);

			trElement.appendChild(tdElement);
		}
	};
}

function showNewMarkerDialog(marker) {
	var overlayMarker,
	dangerDanger,
	anTable,
	tr,
	td,
	nameInput,
	cordsInputLat,
	cordsInputLon,
	cordsInput,
	exampleCoords,
	staticGMap,
	staticGMapControl,
	zoomPlusButton,
	zoomMinusButton,
	contentTextarea,
	markerTypeTable,
	typeInput,
	trElement,
	i,
	tdElement,
	cancel,
	submit,
	errors,
	makerName,
	markerContent,
	markerType,
	markerTypeSym,
	latitude,
	longitude,
	markerPosition,
	markerPositionDelta,
	entry,
	latArray,
	lonArray,
	latOrigin,
	lonOrigin;

	overlayMarker = getOverlay({
			caption : '<b>' + $.gctour.lang('printviewMarker') + '</b>',
			minimized : true
		});

	dangerDanger = document.createElement('div');
	dangerDanger.id = "dangerdanger";
	dangerDanger.style.visibility = "hidden";
	dangerDanger.style.cssFloat = "right";
	dangerDanger.innerHTML = "<img src='" + $.gctour.img.danger + "'>";
	overlayMarker.appendChild(dangerDanger);

	anTable = document.createElement('table');
	overlayMarker.appendChild(anTable);
	anTable.style.width = '100%';
	anTable.style.clear = 'both';
	anTable.align = 'center';

	tr = document.createElement('tr');
	anTable.appendChild(tr);
	td = document.createElement('td');
	tr.appendChild(td);
	td.style.width = '20%';
	td.textContent = 'Name';

	td = document.createElement('td');
	tr.appendChild(td);
	nameInput = document.createElement('input');
	td.appendChild(nameInput);
	nameInput.type = 'text';
	nameInput.id = 'markerName';
	nameInput.className = "gctour-input-text";
	nameInput.style.width = '450px';

	tr = document.createElement('tr');
	anTable.appendChild(tr);
	td = document.createElement('td');
	tr.appendChild(td);
	td.textContent = $.gctour.lang('markerCoordinate');

	td = document.createElement('td');
	tr.appendChild(td);

	cordsInputLat = document.createElement('input');
	td.appendChild(cordsInputLat);
	cordsInputLat.type = "hidden";
	cordsInputLat.id = 'cordsInputLat';
	cordsInputLon = document.createElement('input');
	td.appendChild(cordsInputLon);
	cordsInputLon.type = "hidden";
	cordsInputLon.id = 'cordsInputLon';

	cordsInput = document.createElement('input');
	td.appendChild(cordsInput);
	cordsInput.type = 'text';
	cordsInput.id = 'markerCoords';
	cordsInput.className = "gctour-input-text";
	cordsInput.style.width = '450px';
	cordsInput.style.marginRight = '5px';
	cordsInput['placeholder'] = 'N51° 12.123 E010° 23.123';

	var wptcodeInput = document.createElement('input');
	td.appendChild(wptcodeInput);
	wptcodeInput.type = "hidden";
	wptcodeInput.id = 'wptcodeInput';

	exampleCoords = document.createElement('div');
	exampleCoords.innerHTML = $.gctour.lang('example') + ' <i>N51° 12.123 E010° 23.123, 51.123 10.123</i>';

	td.appendChild(exampleCoords);

	tr = document.createElement('tr');
	anTable.appendChild(tr);
	td = document.createElement('td');
	tr.appendChild(td);
	td = document.createElement('td');
	tr.appendChild(td);
	td.align = 'left';

	staticGMap = document.createElement('div');

	var staticMap = new StaticMap($(staticGMap), {
			width : 450,
			height : 300
		});

	var checkMarkerCoord = function (input) {
		return function () {
			var coords = parseCoordinates(input.value);

			if (coords === false) {
				cordsInput.style.backgroundColor = "#FF8888";
			} else {
				cordsInput.style.backgroundColor = "#88DC3B";
				cordsInputLat.value = coords._lat;
				cordsInputLon.value = coords._lon;

				staticMap.setCoordinates(coords._lat, coords._lon);
			}
		};
	};

	cordsInput.addEventListener('keyup', checkMarkerCoord(cordsInput), false);
	cordsInput.addEventListener('paste', checkMarkerCoord(cordsInput), false);

	td.appendChild(staticGMap);

	tr = document.createElement('tr');
	anTable.appendChild(tr);
	td = document.createElement('td');
	tr.appendChild(td);
	td.innerHTML = $.gctour.lang('markerContent') + '<br/><div style="font-size:xx-small">(' + $.gctour.lang('markerContentHint') + ')</div>';

	td = document.createElement('td');
	tr.appendChild(td);
	contentTextarea = document.createElement('textarea');
	td.appendChild(contentTextarea);
	contentTextarea.style.width = '450px';
	contentTextarea.style['border'] = '1px solid #ccc';
	contentTextarea.style['border-radius'] = '3px';
	contentTextarea.id = 'markerContent';
	contentTextarea.rows = '5';

	// type buttons

	tr = document.createElement('tr');
	anTable.appendChild(tr);
	td = document.createElement('td');
	tr.appendChild(td);
	td.style.width = '20%';
	td.textContent = $.gctour.lang('markerType');

	td = document.createElement('td');
	tr.appendChild(td);
	markerTypeTable = createElement('table', {
			style : "width:auto;"
		});
	td.appendChild(markerTypeTable);
	markerTypeTable.id = 'markerType';

	typeArray = [
		[GCTOUR_HOST + 'i/RedFlag.png', 'Red Flag'],
		[GCTOUR_HOST + 'i/BlueFlag.png', 'Blue Flag'],
		[GCTOUR_HOST + 'i/GreenFlag.png', 'Green Flag'],
		[GCTOUR_HOST + 'i/Geocache.png', 'Geocache'],
		[GCTOUR_HOST + 'i/GeocacheFound.png', 'Geocache Found'],
		[GCTOUR_HOST + 'i/Information.png', 'Information'],
		[GCTOUR_HOST + 'i/Park.png', 'Park'],
		[GCTOUR_HOST + 'i/ParkingArea.png', 'Parking'],
		[GCTOUR_HOST + 'i/SkullAndBones.png', 'Skull And Crossbones']
	];
	// if we are editing a marker - so please set the right type
	typeInput = document.createElement('input');
	typeInput.id = 'typeInput';
	typeInput.type = 'hidden';
	if (!marker) {
		typeInput.value = typeArray[0][0];
	} else {
		typeInput.value = marker.image;
	}
	overlayMarker.appendChild(typeInput);

	typeInput = document.createElement('input');
	typeInput.id = 'typeInputSym';
	typeInput.type = 'hidden';
	if (!marker) {
		typeInput.value = typeArray[0][1];
	} else {
		typeInput.value = marker.symbol;
	}
	overlayMarker.appendChild(typeInput);

	trElement = createElement('tr', {
			style : "height:27px;"
		});
	markerTypeTable.appendChild(trElement);
	for (i = 0; i < typeArray.length; i++) {
		tdElement = createElement('td', {
				style : "width:25px;"
			});

		tdElement.style.background = "url(" + typeArray[i][0] + ") center center no-repeat";
		if (!marker) {
			if (i === 0) {
				tdElement.style.backgroundColor = '#B2D4F3';
			}
			staticMap.setIcon(typeArray[0][0]);
		} else {
			if (typeArray[i][0] == marker.image) {
				tdElement.style.backgroundColor = '#B2D4F3';
				staticMap.setIcon(marker.image);
			}
		}
		tdElement.style.cursor = 'pointer';
		tdElement.style.padding = '0px';
		tdElement.style.border = '1px solid silver';
		//~ tdElement.innerHTML = "<img src='"+typeArray[i][0]+"'>";
		tdElement.addEventListener('click', changeType(typeArray[i], markerTypeTable, typeArray, staticMap), false);

		trElement.appendChild(tdElement);
	}

	staticMap.hide();

	// in the end please add a save and cancel button
	tr = document.createElement('tr');
	anTable.appendChild(tr);
	td = document.createElement('td');
	tr.appendChild(td);
	td.colSpan = '2';
	td.align = 'right';

	var buttonsDiv = createElement('div');
	append(buttonsDiv, overlayMarker);
	buttonsDiv.setAttribute('class', 'dialogFooter');

	cancel = createElement('input', {
			type : "button",
			value : $.gctour.lang('cancel'),
			style : "background-image:url(" + $.gctour.img.closebutton + ")"
		});
	append(cancel, buttonsDiv);
	cancel.addEventListener('click', closeOverlay, false);

	submit = createElement('input', {
			type : "button",
			value : $.gctour.lang('save'),
			style : "background-image:url(" + $.gctour.img.save + ")"
		});
	append(submit, buttonsDiv);

	submit.addEventListener('click', function () {
		errors = 0;
		markerName = document.getElementById('markerName');
		if (markerName.value != "") {
			markerName.style.backgroundColor = "#FFFFFF";
		} else {
			markerName.style.backgroundColor = "#FF8888";
			errors++;
		}
		markerCoords = document.getElementById('markerCoords');

		if (markerCoords.style.backgroundColor != "rgb(136, 220, 59)") {
			markerCoords.style.backgroundColor = "#FF8888";
			errors++;
		}
		markerContent = document.getElementById('markerContent');

		markerType = document.getElementById('typeInput');
		markerTypeSym = document.getElementById('typeInputSym');
		if (errors !== 0) {
			document.getElementById('dangerdanger').style.visibility = "visible";
			return;
		}

		latitude = document.getElementById('cordsInputLat').value * 1;
		longitude = document.getElementById('cordsInputLon').value * 1;
		if (marker) {
			markerPosition = getPositionsOfId(marker.wptcode);
			markerPositionDelta = markerPosition - currentTour.geocaches.length + 1;
			deleteElementFunction((marker.id) ? marker.id : marker.wptcode)();
		} else {
			markerPositionDelta = 0;
		}

		var wptCode = document.getElementById('wptcodeInput').value;

		entry = addCustomMarker(markerName.value, latitude, longitude, markerContent.value, markerType.value, markerTypeSym.value, wptCode);
		move(entry.wptcode, markerPositionDelta);

		closeOverlay();

	}, false);

	// now set all previous values IF a marker is given
	if (marker) {
		nameInput.value = marker.name;
		cordsInputLat.value = marker.latitude; // 51.123123
		cordsInputLon.value = marker.longitude; // 123.12333
		wptcodeInput.value = marker.wptcode; // 123.12333#12312412312

		var latLon = new LatLon(marker.latitude, marker.longitude);
		cordsInput.value = latLon.toString("dm");
		cordsInput.style.backgroundColor = "#88DC3B";
		contentTextarea.innerHTML = marker.content;
		checkMarkerCoord(cordsInput)();
	}

	// set the focus to the maker name input
	nameInput.focus();
}

/* change coordinates */
// static map object
function StaticMap(container, options) {
	this._options = options;
	this._container = container; // jQuery object
	this._zoom = 13;
	this._minZoom = 0;
	this._maxZoom = 19;

	this.build();
	this.update();
}

StaticMap.prototype.zoomIn = function (thiz) {
	return function () {
		thiz._zoom = thiz._zoom + 1;
		thiz.update();
	};
};

StaticMap.prototype.zoomOut = function (thiz) {
	return function () {
		thiz._zoom = thiz._zoom - 1;
		thiz.update();
	};
};

StaticMap.prototype.hide = function () {
	this._staticGMap.style.display = "none";
};

StaticMap.prototype.show = function () {
	this._staticGMap.style.display = "block";
};

StaticMap.prototype.setNewCoordinates = function (lat, lon) {
	this._options.newLat = lat;
	this._options.newLon = lon;
	this.update();
};

StaticMap.prototype.setCoordinates = function (lat, lon) {
	this._options.lat = lat;
	this._options.lon = lon;
	this.update();
};

StaticMap.prototype.setIcon = function (icon) {
	this._options.icon = icon;
	this.update();
};

StaticMap.prototype.update = function () {
	if (this._zoom < this._minZoom || this._zoom > this._maxZoom) {
		return;
	}

	if (this._options.radius) {

		var pathString = "";
		// to draw a circle - add 24 edges und combine them
		for (var i = 0; i <= 360; i = i + 15) {
			var waypoint = CalcPrjWP(this._options.lat, this._options.lon, this._options.radius, i);
			pathString += waypoint[0] + "," + waypoint[1];

			if (i != 360) {
				pathString += "|";
			}

		}

		this._staticGMap.style.backgroundImage = 'url(' + HTTP + '//maps.google.com/maps/api/staticmap?path=color:0xB2D4F3FF|weight:5|fillcolor:0xB2D4F366|' + pathString + '&size=' + ((this._options.width) ? this._options.width : '350') + 'x' + ((this._options.height) ? this._options.height : '200');
		this.show();

	} else {
		var markerString = "markers=";

		if (this._options.geocache_type) {
			// do not change icon to https here, otherwise geocache marker will not be displayed
			markerString += "icon:http://www.geocaching.com/images/wpttypes/pins/" + this._options.geocache_type + ".png";
		} else if (this._options.icon) {
			markerString += "icon:" + this._options.icon;
		} else {
			markerString += "color:blue";
		}
		markerString += "|" + this._options.lat + "," + this._options.lon;

		if (this._options.newLat && this._options.newLon) {
			markerString += "&markers=color:green|" + (this._options.newLat) + "," + (this._options.newLon);
			markerString += "&center=" + (this._options.newLat) + "," + (this._options.newLon);
		}

		this._staticGMap.style.backgroundImage = 'url(' + HTTP + '//maps.google.com/maps/api/staticmap?zoom=' + this._zoom + '&size=' + ((this._options.width) ? this._options.width : '350') + 'x' + ((this._options.height) ? this._options.height : '200') + '&maptype=roadmap&' + markerString;
		this.show();
	}
};

StaticMap.prototype.build = function () {
	var staticGMap = document.createElement('div');
	staticGMap.style.display = "none";
	//~ staticGMap.id = 'staticGMap2';
	staticGMap.style.border = '2px solid gray';
	staticGMap.style.height = (this._options.height) ? this._options.height + 'px' : '200px';
	staticGMap.style.width = (this._options.width) ? this._options.width + 'px' : '350px';
	staticGMap.style.backgroundRepeat = 'no-repeat';
	this._staticGMap = staticGMap;

	if (!this._options.radius) { // just make marker maps zoomable
		var staticGMapControl = document.createElement('div');
		staticGMap.appendChild(staticGMapControl);
		staticGMapControl.style.padding = '3px 0px 0px 3px';
		staticGMapControl.style.width = '16px';
		staticGMapControl.style.cssFloat = 'left';

		var zoomPlusButton = document.createElement('img');
		zoomPlusButton.style.opacity = '0.75';
		zoomPlusButton.style.cursor = 'pointer';
		zoomPlusButton.src = $.gctour.img.zoom_in;
		zoomPlusButton.addEventListener('click', this.zoomIn(this), false);
		staticGMapControl.appendChild(zoomPlusButton);

		var zoomMinusButton = document.createElement('img');
		zoomMinusButton.style.opacity = '0.75';
		zoomMinusButton.style.cursor = 'pointer';
		zoomMinusButton.src = $.gctour.img.zoom_out;
		zoomMinusButton.addEventListener('click', this.zoomOut(this), false);
		staticGMapControl.appendChild(zoomMinusButton);
	}

	this._container.append(staticGMap);
};

function changeCoordinates(coordinates) {
	var coordinates_org,
	showLink;
	var coordinates_ele = $('#uxLatLon');

	try {
		coordinates_org = coordinates_ele.text().split("(")[1].split(")")[0];
	} catch (e) {
		coordinates_org = coordinates_ele.text();
	}

	if (!coordinates) {
		coordinates_ele.html(coordinates_org);
	} else {
		coordinates_ele.html(
			"<div style='font-weight:bold;'><small>" + coordinates +
			"&nbsp;&nbsp;-&nbsp;&nbsp;changed by GCTour<a style='cursor:pointer'></a></small>" +
			"</div><small>(" + coordinates_org + ")</small>");

		showLink = coordinates_ele.find('a:first');

		showLink.bind('click', function () {
			var overlay = getOverlay({
					caption : $.gctour.lang('settings_map'),
					minimized : true
				});

			var origCoordinates = parseCoordinates(coordinates_org);
			var newCoordinates = parseCoordinates(coordinates);

			var srcArr = $("img:first", "a[href='/about/cache_types.aspx']").attr("src").split("/");
			var gc_type = srcArr[srcArr.length - 1].split(".")[0];
			var staticMap = new StaticMap($(overlay), {
					lat : origCoordinates._lat,
					lon : origCoordinates._lon,
					newLat : newCoordinates._lat,
					newLon : newCoordinates._lon,
					width : 577,
					height : 300,
					geocache_type : gc_type
				});
		});
	}
}

function openChangeCoordinates() {
	var overlayMarker,
	dangerDanger,
	anTable,
	tr,
	td,
	nameInput,
	cordsInputLat,
	cordsInputLon,
	cordsInput,
	exampleCoords,
	staticGMap,
	staticGMapControl,
	zoomPlusButton,
	zoomMinusButton,
	contentTextarea,
	markerTypeTable,
	typeInput,
	trElement,
	i,
	tdElement,
	cancel,
	submit,
	errors,
	makerName,
	markerContent,
	markerType,
	markerTypeSym,
	latitude,
	longitude,
	markerPosition,
	markerPositionDelta,
	entry,
	latArray,
	lonArray,
	latOrigin,
	lonOrigin,
	latlng;

	overlayMarker = getOverlay({
			caption : $.gctour.lang('moveGeocache'),
			minimized : true
		});

	anTable = createElement('table', {
			style : "clear:both;"
		});
	overlayMarker.appendChild(anTable);
	anTable.style.width = '100%';
	anTable.align = 'center';

	tr = document.createElement('tr');
	anTable.appendChild(tr);
	td = document.createElement('td');
	tr.appendChild(td);
	td.colSpan = 2;
	td.innerHTML = $.gctour.lang('moveGeocacheHelp');

	tr = document.createElement('tr');
	anTable.appendChild(tr);
	td = document.createElement('td');
	tr.appendChild(td);
	td.style.width = '20%';
	td.textContent = $.gctour.lang('originalCoordinates');

	// get original coordinates
	var coordinates = $('#uxLatLon').text();
	try {
		// if coordinates were already changed by GCTour, extract original coordinates
		coordinates = coordinates.split("(")[1].split(")")[0];
	} catch (e) {
		// no previous changes by GCTour
		coordinates = coordinates;
	}

	var mapTd = document.createElement('td');
	mapTd.align = 'left';
	var minimal_geocache = getMinimalGeocacheDetails(document.getElementsByTagName('html')[0]);
	var gc_type = minimal_geocache.type;

	var coords = parseCoordinates(coordinates);

	var staticMap = new StaticMap($(mapTd), {
			lat : coords._lat,
			lon : coords._lon,
			geocache_type : gc_type.split(".")[0]
		});

	var cacheId = minimal_geocache.gccode;

	td = document.createElement('td');
	tr.appendChild(td);
	nameInput = document.createElement('input');
	td.appendChild(nameInput);
	nameInput.type = 'text';
	nameInput.id = 'markerName';
	nameInput.className = "gctour-input-text";
	nameInput.value = coords;
	nameInput.style.width = '350px';
	nameInput.style.marginRight = '5px';
	nameInput.disabled = 'disabled';

	tr = document.createElement('tr');
	anTable.appendChild(tr);
	td = document.createElement('td');
	tr.appendChild(td);
	td.textContent = $.gctour.lang('newCoordinates');

	td = document.createElement('td');
	tr.appendChild(td);

	cordsInputLat = document.createElement('input');
	td.appendChild(cordsInputLat);
	cordsInputLat.type = "hidden";
	cordsInputLat.id = 'cordsInputLat';
	cordsInputLon = document.createElement('input');
	td.appendChild(cordsInputLon);
	cordsInputLon.type = "hidden";
	cordsInputLon.id = 'cordsInputLon';

	cordsInput = document.createElement('input');
	td.appendChild(cordsInput);
	cordsInput.type = 'text';
	cordsInput.id = 'markerCoords';
	cordsInput.className = "gctour-input-text";
	cordsInput.style.width = '350px';
	cordsInput.style.marginRight = '5px';

	var checkMarkerCoord = function (input) {
		return function () {
			var coords = parseCoordinates(input.value);

			if (coords === false) {
				cordsInput.style.backgroundColor = "#FF8888";
			} else {
				cordsInput.style.backgroundColor = "#88DC3B";
				cordsInputLat.value = coords._lat;
				cordsInputLon.value = coords._lon;

				staticMap.setNewCoordinates(coords._lat, coords._lon);

			}
		};
	};

	cordsInput.addEventListener('keyup', checkMarkerCoord(cordsInput), false);
	cordsInput.addEventListener('paste', checkMarkerCoord(cordsInput), false);

	exampleCoords = document.createElement('div');
	exampleCoords.innerHTML = "<small>" + $.gctour.lang('example') + " " + $.gctour.lang('exampleCoords') + "</small>";

	td.appendChild(exampleCoords);

	tr = document.createElement('tr');
	anTable.appendChild(tr);
	td = document.createElement('td');
	tr.appendChild(td);
	tr.appendChild(mapTd);

	// in the end please add a save and cancel button

	var buttonsDiv = createElement('div');
	append(buttonsDiv, overlayMarker);
	buttonsDiv.setAttribute('class', 'dialogFooter');

	cancel = createElement('input', {
			type : "button",
			value : $.gctour.lang('cancel'),
			style : "background-image:url(" + $.gctour.img.closebutton + ")"
		});
	append(cancel, buttonsDiv);
	cancel.addEventListener('click', closeOverlay, false);

	var delete_btn = createElement('input', {
			type : "button",
			value : $.gctour.lang('deleteCoordinates'),
			style : "background-image:url(" + $.gctour.img.closebutton + ")"
		});
	append(delete_btn, buttonsDiv);
	delete_btn.addEventListener('click', function () {
		GM_deleteValue('coords_' + cacheId);

		changeCoordinates();
		updateGUI();
		closeOverlay();

	}, false);

	submit = createElement('input', {
			type : "button",
			value : $.gctour.lang('save'),
			style : "background-image:url(" + $.gctour.img.save + ")"
		});
	append(submit, buttonsDiv);
	submit.addEventListener('click', function () {
		GM_setValue('coords_' + cacheId, cordsInputLat.value + '#' + cordsInputLon.value);

		changeCoordinates(new LatLon(cordsInputLat.value, cordsInputLon.value).toString());
		closeOverlay();
	}, false);

	// now set all previous values IFF a marker is given

	if (GM_getValue('coords_' + cacheId, "null") != "null") {
		var coords_cacheId = GM_getValue('coords_' + cacheId);
		latlng = new LatLon(coords_cacheId.split('#')[0], coords_cacheId.split('#')[1]);

		cordsInputLat.value = latlng._lat; // 51.123123
		cordsInputLon.value = latlng._lon; // 123.12333

		cordsInput.value = latlng.toString();
		cordsInput.style.backgroundColor = "#88DC3B";

		staticMap.setNewCoordinates(cordsInputLat.value, cordsInputLon.value);

	} else {
		latlng = parseCoordinates(coordinates);
		cordsInputLat.value = latlng._lat; // 51.123123
		cordsInputLon.value = latlng._lon; // 123.12333
		cordsInput.value = latlng.toString();
		cordsInput.style.backgroundColor = "#88DC3B";

		staticMap.setNewCoordinates(cordsInputLat.value, cordsInputLon.value);
	}

}

/* tour functions */
function getTourById(id) {
	var currentTourId = GM_getValue('currentTour', -1);
	var tours = loadValue('tours', []);
	for (var i = 0; i < tours.length; i++) {
		if (tours[i].id == currentTourId) {
			return tours[i];
		}
	}
	return;
}

function getNewTourId() {
	var tourId = 0;
	for (var i = 0; i < tours.length; i++) {
		if (tours[i].id >= tourId) {
			tourId = tours[i].id + 1;
		}
	}
	return tourId;
}

function isIdInTable(gcId) {
	for (var i = 0; i < currentTour.geocaches.length; i++) {
		if (currentTour.geocaches[i].id == gcId) {
			return true;
		}
	}
	return false;
}

function getPositionsOfId(theId) {
	var id = -1;
	$.each(currentTour.geocaches, function (i, obj) {
		if (obj.id == theId || obj.wptcode == theId) {
			id = i;
			return false; // break each
		}
	});
	return id;
}

function saveTour(tour, notLoad) {
	var i;
	for (i = 0; i < tours.length; ++i) {
		if (tours[i].id == tour.id) {
			tours[i] = tour;
		}
	}

	GM_setValue('tours', JSON.stringify(tours));
	if (notLoad === undefined) {
		GM_setValue('currentTour', tour.id);
		log("updating " + tour.name);
	}
}

function saveCurrentTour() {
	saveTour(currentTour);
}

function addNewTableCell(theEntry, effects) {
	var costumMarker = (typeof(theEntry.latitude) !== "undefined");

	// if this is a custom marker user other id
	var theId = (!costumMarker) ? theEntry.id : theEntry.wptcode;

	var entryLi = createElement('li', {
			id : theId,
			style : "position:relative;opacity:0;width:90%;list-style-image='url('" + theEntry.image + "');background-color:pink;"
		});

	// set the background image
	//~ entryLi.style.background = "transparent url(http://stats.madd.in/counter/digit.php?digit="+(getPositionsOfId(theEntry.id || theEntry.wptcode)+1)+") fixed no-repeat bottom right";
	//entryLi.style.backgroundImage = "url(http://stats.madd.in/counter/digit.php?digit="+(getPositionsOfId(theEntry.id || theEntry.wptcode)+1)+")";
	//entryLi.style.backgroundRepeat = "no-repeat";
	//entryLi.style.backgroundPosition = "bottom right";

	//set the type
	entryLi.style.listStyleImage = "url('" + theEntry.image + "')";

	// make the gcid link
	var nameCite = createElement('span', {
			style : "vertical-align:top"
		});

	//~ var indexDiv = createElement('span',{style:"margin-right: 6px;"});
	//~ indexDiv.innerHTML = "<b>"+(getPositionsOfId(theEntry.id || theEntry.wptcode)+1)+"</b>";
	//~ append(indexDiv,nameCite);

	if (!costumMarker) {
		var coordinates = GM_getValue('coords_' + theId, "null"); // changed by GCTour
		if (coordinates != "null") {
			var moveCoords = createElement('img', {
					src : $.gctour.img.coord_update,
					height : "12",
					style : "float:right;margin-right:5px;margin-top:2px",
					alt : $.gctour.lang('movedGeocache'),
					title : $.gctour.lang('movedGeocache')
				});
			nameCite.appendChild(moveCoords);
		}
		var linkElement = document.createElement('a');
		//linkElement.style.fontSize = '9px'; to small!
		linkElement.style.fontFamily = 'arial,sans-serif';
		linkElement.href = 'http://coord.info/' + theId;

		linkElement.target = '_self';
		linkElement.textContent = theId;
		nameCite.appendChild(linkElement);

	} else {
		nameCite.innerHTML += theEntry.name;
		nameCite.style.textDecoration = "underline";
	}

	// the log/edit button and the delete button
	var functionButtonsDiv = document.createElement('div');
	functionButtonsDiv.style.cssFloat = 'right';
	functionButtonsDiv.setAttribute("class", "controls");

	if (!costumMarker) {
		var logVisitImage = document.createElement('img');
		logVisitImage.alt = $.gctour.lang('logYourVisit');
		logVisitImage.title = $.gctour.lang('logYourVisit');
		logVisitImage.style.cursor = 'pointer';
		logVisitImage.src = $.gctour.img.add_comment;
		logVisitImage.addEventListener('click', function () {
			window.location.href = GS_HOST + 'seek/log.aspx?wp=' + theId;
		}, true);
		addOpacityEffects(logVisitImage);
		functionButtonsDiv.appendChild(logVisitImage);
	} else {
		var editMarkerButton = document.createElement('img');
		editMarkerButton.alt = $.gctour.lang('edit');
		editMarkerButton.title = $.gctour.lang('edit');
		editMarkerButton.style.cursor = 'pointer';
		editMarkerButton.src = $.gctour.img.edit;
		editMarkerButton.addEventListener('click', function () {
			showNewMarkerDialog(theEntry);
		}, false);
		addOpacityEffects(editMarkerButton);
		functionButtonsDiv.appendChild(editMarkerButton);
	}

	var deleteImage = document.createElement('img');
	deleteImage.alt = $.gctour.lang('removeFromList');
	deleteImage.title = $.gctour.lang('removeFromList');
	deleteImage.style.cursor = 'pointer';
	deleteImage.src = $.gctour.img.del;
	deleteImage.addEventListener('click', deleteElementFunction(theId), true);
	addOpacityEffects(deleteImage);
	functionButtonsDiv.appendChild(deleteImage);

	// thanks to adam r
	/* unneeded  since the list uses drag and drop
	var upDownDiv = document.createElement('div');
	upDownDiv.align = "right";

	var topButton = document.createElement('img');
	topButton.alt = "top";
	topButton.title = "top";
	topButton.style.cursor = 'pointer';
	topButton.src = $.gctour.img.topArrow;
	topButton.addEventListener('click', moveTop(theId), true);
	addOpacityEffects(topButton);

	var upButton = document.createElement('img');
	upButton.alt = "up";
	upButton.title = "up";
	upButton.style.marginRight = '5px';
	upButton.style.cursor = 'pointer';
	upButton.src = $.gctour.img.upArrow;
	upButton.addEventListener('click', moveUp(theId), true);
	addOpacityEffects(upButton);

	var downButton = document.createElement('img');
	downButton.alt = "down";
	downButton.title = "down";
	downButton.style.cursor = 'pointer';
	downButton.style.marginRight = '5px';
	downButton.src = $.gctour.img.downArrow;
	downButton.addEventListener('click', moveDown(theId), true);
	addOpacityEffects(downButton);

	var bottomButton = document.createElement('img');
	bottomButton.alt = "bottom";
	bottomButton.title = "bottom";
	bottomButton.style.cursor = 'pointer';
	bottomButton.src = $.gctour.img.bottomArrow;
	bottomButton.addEventListener('click', moveBottom(theId), true);
	addOpacityEffects(bottomButton);

	functionButtonsDiv.appendChild(document.createElement('br'));
	upDownDiv.appendChild(upButton);
	upDownDiv.appendChild(topButton);
	upDownDiv.appendChild(document.createElement('br'));
	upDownDiv.appendChild(downButton);
	upDownDiv.appendChild(bottomButton);
	functionButtonsDiv.appendChild(upDownDiv);*/

	entryLi.appendChild(functionButtonsDiv);
	entryLi.appendChild(nameCite);

	var nameDiv = document.createElement('div');
	nameDiv.style.clear = 'left';
	nameDiv.style.position = 'relative';
	nameDiv.style.zIndex = 2;

	if (!costumMarker) {
		nameDiv.innerHTML += theEntry.name;
	} else {
		nameDiv.innerHTML += new LatLon(theEntry.latitude, theEntry.longitude).toString() + " " + theEntry.content;
	}
	entryLi.appendChild(nameDiv);

	var counterDiv = document.createElement('div');
	counterDiv.className = 'counter unselectable';
	counterDiv.innerHTML = (getPositionsOfId(theEntry.id || theEntry.wptcode) + 1);
	entryLi.appendChild(counterDiv);
	/*
	// todo: jquery
	var counterDiv = $('<div>', {
	"class": 'counter unselectable',
	html: (getPositionsOfId(theEntry.id +3|| theEntry.wptcode) + 1)
	});
	 */

	$('#cacheList').append(entryLi);
	if (unsafeWindow.draglist) {
		unsafeWindow.draglist.sync(); // needed to function properly
	}

	if (effects) {
		$("#" + theId).fadeTo(1000, 1);
	} else {
		$("#" + theId).css({
			opacity : 1
		});
	}

}

// function to move a cache to a given position in the list
function move(id, positionDelta) {
	var i;

	// locate the selected cache in the list
	var position = getPositionsOfId(id);

	// return if we are at the end or at top of the list!
	if ((position === 0 && positionDelta < 0) || (position == currentTour.geocaches.length - 1 && positionDelta > 0)) {
		return;
	}

	// save clicked cache
	var geoCache = currentTour.geocaches[position];

	// remove it from the current geocaches
	currentTour.geocaches.splice(position, 1);

	var tempCaches = [];

	// first push all caches in front of the selected in the new array
	for (i = 0; i < position + positionDelta; i++) {
		tempCaches.push(currentTour.geocaches[i]);
	}

	// then the selected
	tempCaches.push(geoCache);

	// and now the rest
	for (i = position + positionDelta; i < currentTour.geocaches.length; i++) {
		tempCaches.push(currentTour.geocaches[i]);
	}

	// ... and make it persistent
	currentTour.geocaches = tempCaches;
	saveCurrentTour();

	// redraw the list:
	var cacheList = document.getElementById('cacheList');

	// just clear the list
	while (cacheList.firstChild) {
		cacheList.removeChild(cacheList.firstChild);
	}
	for (i = 0; i < currentTour.geocaches.length; i++) {
		addNewTableCell(currentTour.geocaches[i], false);
	}
}

function moveUp(id) {
	return function () {
		move(id, -1);
	};
}

function moveDown(id) {
	return function () {
		move(id, 1);
	};
}

function moveTop(id) {
	return function () {
		var position = getPositionsOfId(id);
		move(id, -position);
	};
}

function moveBottom(id) {
	return function () {
		var position = getPositionsOfId(id);
		move(id, currentTour.geocaches.length - position - 1);
	};
}

function redrawCurrentTour() {
	var cacheList = document.getElementById('cacheList');
	while (cacheList.firstChild) { // clear the list
		cacheList.removeChild(cacheList.firstChild);
	}
	for (i = 0; i < currentTour.geocaches.length; i++) { // redraw the list
		addNewTableCell(currentTour.geocaches[i], false);
	}
}

function saveNewCache(entry) {
	currentTour = getTourById(currentTourId);
	currentTour.geocaches.push(entry);
	saveCurrentTour();
	redrawCurrentTour(); // update numbering
	log("saving " + entry.id + " to " + currentTour.name);
}

function updateCacheCount(count) {
	$("#cachecount")
	.html('(' + count + ')')
	.stop(true, true)
	.animate({
		backgroundColor : '#ffe000'
	}, 800)
	.animate({
		backgroundColor : '#ffffff'
	}, 700);

	if (!sticky) { // nur wenn sichtbar
		$("#gctourButtonWrapper")
		.stop(true, true)
		.toggleClass("gctour-grand-highlight", 300)
		.toggleClass("gctour-grand-highlight", 1200);
	}
}

function addCustomMarker(name, lat, lon, content, typeImage, typeSymbol, wptcode) {

	if (!isNotEmptyList) {
		var table = document.getElementById('cacheList');
		table.innerHTML = '';
	}

	// customMarker:                e.g.:
	//    name  ->  the cachename    parking area
	//    image  ->  the typeimage    https://gctour.geocaching.cx/i/ParkingArea.png
	//    lat    ->  latitude    51.12342
	//    lon    ->  longitude    -12.33456
	//    content  ->  the content    "Test\nLINEBREAK"
	//    symbol  ->  GPX symbol name "Red Flag"

	var entry = {};

	entry.wptcode = (wptcode) ? wptcode : (new Date().getTime() - Math.round(lat + lon * 1000)).toString(16);
	entry.name = name;
	entry.latitude = lat;
	entry.longitude = lon;
	entry.image = typeImage;
	entry.content = content;
	entry.symbol = typeSymbol;

	log("New custom marker: " + entry.name + " lat:" + entry.latitude + " lon:" + entry.longitude + " Type:" + entry.symbol + " content:" + entry.content);

	// add the newbie
	addNewTableCell(entry, true);

	// and make it persistence
	saveNewCache(entry);

	// update the cache count
	updateCacheCount(currentTour.geocaches.length);

	return entry;
}

function addElementFunction(theId, theGuId, theName, theTypeImage) {
	return function (event) {

		if (!isNotEmptyList) {
			var table = document.getElementById('cacheList');
			table.innerHTML = '';
		}

		if (!isIdInTable(theId)) {
			// entry:                e.g.:
			//    id    ->  the gc.com id    GC00815
			//    guid  ->  the guid      6e974919-2b47-46e2-8661-3fc62a5a9650
			//    name  ->  the cachename    Echo the tomcat
			//    image  ->  the typeimage    2.gif
			var entry = {};
			entry.id = theId;
			//~ entry.name = theName.textContent;
			entry.name = theName;
			entry.guid = theGuId;
			entry.image = GS_HOST + GS_WPT_IMAGE_PATH + theTypeImage;

			// split the src an take only x.gif
			//var typeGif = theTypeImage.replace(GS_HOST + GS_WPT_IMAGE_PATH, ""); // ggf. schon komplette url kürzen
			//entry.image = GS_HOST + GS_WPT_IMAGE_PATH + typeGif;

			// add the newbie
			addNewTableCell(entry, true);

			// and make it persistence
			saveNewCache(entry);

			// update the cache count
			updateCacheCount(currentTour.geocaches.length);

			showGeocacheNotification({
				id : theId,
				name : theName,
				image : theTypeImage
			}, {
				type : "success"
			});

		} else {
			showGeocacheNotification({
				id : theId,
				name : theName,
				image : theTypeImage
			}, {
				type : "contains"
			});
		}
	};
}

function deleteElementFunction(theId) {
	return function () {
		// effect
		$("#" + theId)
		.fadeOut(500, function () {
			$(this).remove();
		});

		// locate the element to delete
		for (var i = 0; i < currentTour.geocaches.length; i++) {
			if (currentTour.geocaches[i].id == theId || currentTour.geocaches[i].wptcode == theId) {
				// array in js are dumb - where is removeAt ??
				currentTour.geocaches.splice(i, 1);
				log("removing '" + theId + "' from '" + currentTour.name + "'");
				break;
			}
		}

		saveCurrentTour();

		// update the cache count
		updateCacheCount(currentTour.geocaches.length);

		redrawCurrentTour(); // update numbering

		if (!isNotEmptyList) {
			$('#cacheList').html($.gctour.lang('emptyList'));
		}
	};
}

function removeElementsFunction(descriptionElement, id, tagName) {
	return function () {
		var elements = descriptionElement.getElementsByTagName(tagName);
		for (var x = 0; x < elements.length; x++) {
			if (elements[x].id == id) {
				elements[x].style.display = "none";
			}
		}
	};
}

function updateTour() {
	initCore();
	updateGUI();
}

function loadTour(id) {
	return function () {
		GM_setValue('currentTour', id);
		if (document.getElementById("inconsistentTour")) {
			document.getElementById("inconsistentTour").style.display = "none";
		}

		if (document.URL.search("webcode") >= 0) {
			window.location = GS_HOST;
		} else {
			updateTour();
		}

	};
}

function newTourFunction(preset) {
	return function () {
		var newTour = {};
		newTour.id = getNewTourId();

		var tourName = (preset) ? preset : "Tour " + newTour.id;
		newTour.name = prompt($.gctour.lang('newTourDialog'), tourName);
		newTour.geocaches = [];
		if (!newTour.name) {
			return false;
		}

		tours.push(newTour);
		log("Creating new tour: " + newTour.id + " ; " + newTour.name);

		saveTour(newTour);

		//~ window.location.reload();
		updateTour();

		return true;
	};
}

function deleteTourFunction(id, force) {
	return function () {
		if (force || confirm($.gctour.lang('removeTourDialog'))) {

			for (var i = 0; i < tours.length; i++) {
				if (tours[i].id == id) {
					log("removing '" + tours[i].name + "'");
					// array in js are dumb - where is removeAt ??

					var cachelist = $('#dialogDetails');

					if (cachelist.length > 0 && cachelist.attr("tourid") == tours[i].id) {
						showCacheList(currentTour)();
						$('#loadButton').attr("disabled", "disabled");
					}

					$("#tour" + id).remove();

					tours.splice(i, 1);
					saveCurrentTour();

					//updateTour();

					break;
				}
			}
		}
	};
}

function deleteCurrentTour() {
	if (confirm($.gctour.lang('removeTourDialog'))) {
		var tableId;
		for (tableId = 0; tableId < tours.length; tableId++) {
			if (tours[tableId].id == currentTour.id) {
				break;
			}
		}

		var nextTourId = tours[(tableId + 1) % tours.length].id;
		var currentTourId = currentTour.id;

		loadTour(nextTourId)();
		deleteTourFunction(currentTourId, true)();
	}
}

/* printpage functions */
function printPageFunction(currentTour) {
	if (!isNotEmptyList() || !isLogedIn()) {
		return;
	}

	var i,
	tr,
	td,
	nCaches = currentTour.geocaches.length,
	minimal = GM_getValue('printMinimal', false);

	var cacheDetailTemplate =
		//'<div class="cacheDetail" id="###GUID###">' +
		'<div class="cacheDetail ###HIDDENSTYLE###" id="###GUID###">' +
		'  <div class="geocache_count ###HIDDENSTYLE###"><span>###CACHECOUNT###</span></div>' +
		'  <div class="geocache_id">###GCID###</div>' +
		'  <div>' +
		'    <img src="' + $.gctour.img.wpt_type + '">' +
		'    <span style="font-weight: bold;">###CACHENAME###</span>' +
		'    <span style="margin-right: 3px;"> (###OWNER### - ###HIDDEN###)</span>' +
		'  </div>' +
		'  <div class="details">' +
		'    <span><img src="' + $.gctour.img.coord_update + '" heigth="12px" class="###COORDINATESISEDIT###"/> ###COORDINATES###</span>' +
		'    <span><img src="' + $.gctour.img.bearing + '"/>###DISTANCE###&nbsp;</span>' +
		'    <span>D:<img src="' + $.gctour.img.stars_d + '"/></span>' +
		'    <span>T:<img src="' + $.gctour.img.stars_t + '"/></span>' +
		'    <span>S:<img src="' + $.gctour.img.cache_size + '"/></span>' +
		'  </div>' +
		'  <div>' +
		'    <span>###ATTRIBUTES###</span>' +
		'    <span><img alt="Inventory" style="padding-left: 10px;" src="' + $.gctour.img.tb_coin + '"/>Inventory:</span>' +
		'    <span>###INVENTORY###</span>' +
		'    <span><img src="' + $.gctour.img.fav + '" style="padding-left: 10px;"/>Favorites: ###FAV### ###FAVSCORE###</span>' +
		'  </div>' +
		'  <div class="content">' +
		'    <div class="short ###HIDDENSTYLE###">###SHORT_DESCRIPTION###</div>' +
		'    <div class="long ###HIDDENSTYLE###">###LONG_DESCRIPTION###</div>' +
		'    <div>###GCCOMMENT###</div>' +
		'	 <div class="removable">###CACHENOTE###</div>' +
		'	 <div contenteditable="true"><b><u>Hint:</u></b>###HINT###</div>' +
		'    <div class="waypoints ###HIDDENSTYLE###">###ADDITIONAL_WAYPOINTS###</div>' +
		'    <div class="images">###IMAGES###</div>' +
		'    <div id = "###MAPID###" class="map ###HIDDENSTYLE###">###MAP###</div>' +
		'    <div class="removable ###HIDDENSTYLE###">###LOGCOUNTER###</div>' +
		'    <div class="logs ###HIDDENSTYLE###">###LOGS###</div>' +
		'    <div style="clear:both">&nbsp;</span>' +
		'  </div>' +
		'</div>';
	var ownMarkerTemplate =
		//'<div class="cacheDetail">' +
		'<div class="cacheDetail ###HIDDENSTYLE###">' +
		'  <div class="geocache_count ###HIDDENSTYLE###" style="padding:5px !important"><span>###CACHECOUNT###</span></div>' +
		'  <div class="wpt_id">###GCID###</div>' +
		'  <div>' +
		'    <img src="###TYPE###">' +
		'    <span style="font-weight: bold;">###NAME###</span><br/>' +
		'    <span>###COORDINATES###</span>' +
		'  </div>' +
		'  <div>' +
		'    <div class="long">###CONTENT###</div>' +
		'  </div>' +
		'</div>';

	// show/hide cache and own marker details
	if (GM_getValue('showCacheDetails', true)) {
		cacheDetailTemplate = cacheDetailTemplate.replace("###HIDDENSTYLE###", "");
		ownMarkerTemplate = ownMarkerTemplate.replace("###HIDDENSTYLE###", "");
	} else {
		cacheDetailTemplate = cacheDetailTemplate.replace("###HIDDENSTYLE###", "hidden");
		ownMarkerTemplate = ownMarkerTemplate.replace("###HIDDENSTYLE###", "hidden");
	}

	// clear content
	$('html').html(""); // result: <html><head></head><body></body></html>

	// title of print preview page
	$('html').append('<title>' + $.gctour.lang('printview') + '</title>');

	var bodyTag = document.getElementsByTagName('body')[0];
	bodyTag.style.background = 'none';
	bodyTag.style.backgroundColor = "white";
	bodyTag.innerHTML = '';

	// add styles to body tag
	$('head').remove(); // presence of head tag causes problems when printing in Firefox --> add styles to body tag
	var jqCss = $('<link/>').attr("href", GS_HOST + "css/jqueryui1104/jqUI").attr("rel", "stylesheet").appendTo($(bodyTag));

	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = '*{ font-size:' + GM_getValue("printFontSize", "x-small") + ' } .cacheDetail{ border: 1px solid lightgray; width: 100%; text-align: left;padding:5px; -moz-box-sizing: border-box; } .wpt_id{ position:relative; padding:5px !important; float:right;  font-size:medium; font-weight:bold; } .geocache_id{ position:relative; padding:20px !important; float:right;  font-size:medium; font-weight:bold; }  .content{ clear:both; border-top:2px dashed lightgray; margin-top:10px; padding-top:10px; }  img{ vertical-align:middle; }  #details span{ margin-left: 10px } .images{clear:both;height:auto}' +
		'.map{clear:both} .logs{clear:both} .hidden{display:none} .highlight{background-color:pink}' +
		'.geocache_count{ position:relative; padding:20px !important; float:right;  font-size:medium; font-weight:bold; } .geocache_count span{padding: 5px; font-weight: bold; font-size: 18px; -moz-border-radius: 5px; border-radius: 5px; border:2px dotted black;}' +
		'sup {vertical-align:baseline;font-size:77%;position:relative;top:-5px;}' +
		'.dialogMask {background-image:url(' + $.gctour.img.dialogMask + ');height:100%;left:0;opacity:0.7;position:fixed;top:0;width:100%;z-index:1100;}' +
		'.dialogBody{-moz-border-radius:5px; border-radius:5px; background:none repeat scroll 0 0 #fff;border:1px solid #333333;color:#333333;cursor:default;font-family:Arial;font-size:12px;left:50%;margin-left:-250px;margin-top:20px;padding:0 0 1em;position:fixed;text-align:left;top:0;width:500px;z-index:1101;max-height:85%;min-height:370px;overflow:auto;}' +
		'.dialogBody p {font-size:12px;font-weight:normal;margin:1em 0em;}' +
		'.dialogBody h1{background-color:#B2D4F3;font-size:110%;font-family:Helvetica Neue,Arial,Helvetica,sans-serif;margin-bottom:0.2em;padding:0.5em;-moz-border-radius:5px 5px 0px 0px;border-radius:5px 5px 0px 0px;color:#333333;background-image:url("' + $.gctour.img.tabBg + '");margin:0px;}' +
		'.dialogHistory {border:1px inset #999999;margin:0 1em 1em;height:200px;overflow-y:auto;width:448px;padding-left:1em;}' +
		'.dialogHistory ul{margin-left:2em;}' +
		'.dialogHistory li{list-style-type:circle;}' +
		'.dialogFooter input{-moz-border-radius:3px;border-radius:3px;background:none no-repeat scroll 4px center #EEEEEE;border:1px outset #666666;cursor:pointer;float:right;margin-left:0.5em;padding:3px 5px 5px 20px;min-width:100px;}' +
		'.dialogFooter input:hover { background-color:#f9f9f9; }' +
		'.dialogContent {padding:0px 10px 0px 10px;}' +
		'.dialogMin {min-height:0px !important}' +
		'.noprint {padding:2px;border: 1px solid #c0cee3;z-index: 10000;background-color: #eff4f9; text-align: left;margin-top:10px} .noprint>div {margin-top:2px} ' +
		'.noprint>input {border: 1px outset #666666;cursor: pointer;margin:5px;padding: 3px 5px 5px 25px;background: none no-repeat scroll 4px center #eeeeee;float:left;clear:both;} ' +
		'.noprint>input:hover {background-color:#f9f9f9}';

	// limit the font size of the cache table to "small"; for bigger sizes the table most likely gets too wide
	var fs = GM_getValue("printFontSize", "x-small");
	if ((fs != "xx-small") && (fs != "x-small") && (fs != "small")) {
		fs = "small";
	}
	style.innerHTML += 'div#printTitle>table * {font-size:' + fs + ';}' +
	'fieldset.noprint * {font-size:' + fs + ';}';

	bodyTag.appendChild(style);

	style = document.createElement('style');
	style.media = 'print';
	style.type = 'text/css';
	//hide the map control in print
	style.innerHTML = '.noprint   { display: none; } body {margin: 0;padding: 0;color: black;background: transparent;width:99%}';
	bodyTag.appendChild(style);

	var body = document.createElement('div');
	$(body).width("648px");
	$(body).css("margin", "30px auto");

	bodyTag.appendChild(body);

	addProgressbar({
		_document : document,
		closeCallback : function (_document) {
			return function () {
				if (confirm($.gctour.lang('cancel') + "?") == true) {
					location.reload();
				}
			};
		}
	});

	var printInfo = document.createElement('div');
	printInfo.className = 'noprint';
	printInfo.innerHTML = $.gctour.lang('dontPrintHint');

	body.appendChild(printInfo);

	$("<fieldset/>", {
		'class' : 'noprint'
	})
	.css('right', '50px')
	.css('position', 'fixed')

	.append(
		$("<legend/>").html($.gctour.lang('printview'))
		.css('background', "url(\"" + $.gctour.img.gctourLogoSmall + "\") no-repeat scroll 0 0 transparent")
		.css('padding-left', '20px'),

		$("<input/>").attr("type", "input").attr("value", $.gctour.lang('print')).css("background-image", "url(" + $.gctour.img.printer + ")").click(function () {
			self.print()
		}),
		$("<input/>").attr("type", "input").attr("value", $.gctour.lang('close')).css("background-image", "url(" + $.gctour.img.closebutton + ")").click(function () {
			location.reload();
		})).appendTo($(body));

	// front page
	if (GM_getValue('printFrontpage', true) && !minimal) {
		var title = $('<div>', {
				id : 'printTitle',
				css : {
					width : "100%",
					textAlign : 'center',
					"page-break-after" : ((GM_getValue('printPageBreakAfterMap', true)) ? 'always' : 'never')
				},
				html : "<h1>" + currentTour.name + "</h1>"
			});
		$(body).append(title);

		var coverTable = document.createElement('table');
		coverTable.style.width = "100%";
		coverTable.style.border = '1px solid lightgray';

		coverTable.innerHTML =
			'<thead><tr>           ' +
			'  <th colspan="2" style="border-bottom:1px solid lightgray;"><b>' + $.gctour.lang('printviewCache') + '</b></th>    ' +
			'  <th style="border-bottom:1px solid lightgray;">&nbsp;</th>    ' +
			'  <th style="border-bottom:1px solid lightgray;">&nbsp;</th>    ' +
			'  <th style="border-bottom:1px solid lightgray;" align="center"><b>D</b></th>    ' +
			'  <th style="border-bottom:1px solid lightgray;" align="center"><b>T</b></th>    ' +
			'  <th style="border-bottom:1px solid lightgray;" align="center"><b>S</b></th>    ' +
			'  <th style="border-bottom:1px solid lightgray;" align="center"><b>L4L</b>&nbsp;</th>    ' +
			'  <th colspan="2" style="border-bottom:1px solid lightgray;" align="center"><b>Fav</b>&nbsp;</th>    ' +
			'  <th style="border-bottom:1px solid lightgray;"><b>' + $.gctour.lang('markerCoordinate') + '</b></th>    ' +
			'  <th style="border-bottom:1px solid lightgray;"><b>' + $.gctour.lang('printviewFound') + '</b></th>    ' +
			'  <th style="border-bottom:1px solid lightgray;">&nbsp;&nbsp;<b>' + $.gctour.lang('printviewNote') + '</b></th>    ' +
			'</tr><thead>';

		var tbody = createElement('tbody');
		append(tbody, coverTable);

		// table of caches
		var isCostumMarker = false,
		id,
		coords;
		for (i = 0; i < nCaches; ++i) {
			var costumMarker = (typeof(currentTour.geocaches[i].latitude) != "undefined");
			if (costumMarker) {
				id = "WP";
				coords = "'coords_WP" + (i + 1) + "'>" + new LatLon(currentTour.geocaches[i].latitude, currentTour.geocaches[i].longitude).toString();
			} else {
				id = currentTour.geocaches[i].id;
				coords = "'coords_" + currentTour.geocaches[i].id + "'>";
			}

			if (GM_getValue('addCustomMarkerToCacheTable', true) === true) {
				costumMarker = false; // add custom marker to cache table
			}

			if (!costumMarker) {

				tr = createElement('tr');
				tbody.appendChild(tr);
				
				// numbering
				td = createElement('td');
				tr.appendChild(td);
				td.innerHTML = "<b style='margin:0 6px'>" + (i + 1) + "</b>";

				// image
				td = createElement('td', {
						style : "border-bottom:1px solid lightgray;"
					});
				tr.appendChild(td);
				td.innerHTML = "<img src='" + currentTour.geocaches[i].image + "'>";

				// name
				td = createElement('td', {
						style : "text-align:left;border-bottom:1px solid lightgray;white-space:nowrap;"
					});
				tr.appendChild(td);
				td.innerHTML = "<a style='color:#000000;text-decoration: none'  target='_blank' href='http://coord.info/" + currentTour.geocaches[i].id + "'>" + currentTour.geocaches[i].name + "</a>";

				// id
				td = createElement('td', {
						style : "text-align:left;border-bottom:1px solid lightgray;border-right:1px dashed lightgray;"
					});
				tr.appendChild(td);
				td.innerHTML = "<span style='margin:0 2px'>" + id + "</span>";

				// difficulty
				td = createElement('td', {
						style : "border-bottom:1px solid lightgray;border-right:1px dashed lightgray;"
					});
				tr.appendChild(td);
				td.innerHTML = "<span style='margin:0 2px' id='d_" + currentTour.geocaches[i].id + "'></span>";

				// terrain
				td = createElement('td', {
						style : "border-bottom:1px solid lightgray;border-right:1px dashed lightgray;"
					});
				tr.appendChild(td);
				td.innerHTML = "<span style='margin:0 2px' id='t_" + currentTour.geocaches[i].id + "'></span>";

				// size
				td = createElement('td', {
						style : "border-bottom:1px solid lightgray;border-right:1px dashed lightgray;"
					});
				tr.appendChild(td);
				td.innerHTML = "<span style='margin:0 2px' id='s_" + currentTour.geocaches[i].id + "'></span>";

				// last 4 logs
				td = createElement('td', {
						style : "border-bottom:1px solid lightgray;white-space:nowrap;"
					});
				tr.appendChild(td);
				td.innerHTML = "<canvas id='l4l_" + currentTour.geocaches[i].id + "' width='17' height='17' style='margin-left: 2px;position: relative;top: 2px;'/>";

				// favorite points
				td = createElement('td', {
						style : "text-align:left;border-bottom:1px solid lightgray;border-left:1px dashed lightgray;"
					});
				tr.appendChild(td);
				td.innerHTML = "<span id='fp_" + currentTour.geocaches[i].id + "'></span>";
				
				// favorite score
				td = createElement('td', {
						style : "text-align:right;border-bottom:1px solid lightgray;border-right:1px dashed lightgray;"
					});
				tr.appendChild(td);
				td.innerHTML = "<span id='fs_" + currentTour.geocaches[i].id + "'></span>";

				// coords
				td = createElement('td', {
						style : "border-bottom:1px solid lightgray;white-space:nowrap;"
					});
				tr.appendChild(td);
				td.innerHTML = "<span style='margin:0 2px' id=" + coords + "</span>";

				// found checkbox
				td = createElement('td');
				tr.appendChild(td);
				td.style.verticalAlign = "middle";
				td.innerHTML = "<div style='margin-left:auto;margin-right:auto;width:10px;height:10px;border:1px solid lightgray;'>&nbsp;</div>";

				// note
				td = createElement('td', {
						style : "border-bottom:1px solid lightgray;"
					});
				tr.appendChild(td);
				td.style.verticalAlign = "middle";
				td.style.width = "100%";
				td.innerHTML = "&nbsp;";
			} else {
				if (GM_getValue('addCustomMarkerToCacheTable', false) === false) { // custom marker in separate table
					isCostumMarker = costumMarker;
					continue;
				}
			}
		}

		// table of custom marker
		if (isCostumMarker) {
			tbody.innerHTML +=
			'<tr>           ' +
			'  <td colspan="11" style="border-bottom:1px solid lightgray;"><b>' + $.gctour.lang('printviewMarker') + '</b></td>    ' +
			'</tr>';

			for (i = 0; i < nCaches; ++i) {
				var costumMarker = (typeof(currentTour.geocaches[i].latitude) != "undefined");

				if (costumMarker) {
					tr = document.createElement('tr');
					tbody.appendChild(tr);
					td = document.createElement('td');
					tr.appendChild(td);

					td.innerHTML = "<b style='margin:0 10px'>" + (i + 1) + "</b>";

					td = document.createElement('td');
					tr.appendChild(td);
					td.innerHTML = "<img src='" + currentTour.geocaches[i].image + "'>";

					td = document.createElement('td');
					tr.appendChild(td);
					td.style.verticalAlign = "middle";
					td.style.width = "30%";
					td.colSpan = "9";
					td.style.borderBottom = '1px solid lightgray';
					td.innerHTML = currentTour.geocaches[i].name;
					td.innerHTML += " - " + new LatLon(currentTour.geocaches[i].latitude, currentTour.geocaches[i].longitude).toString();
				}
			}

		}

		$(title).append($(coverTable));

		var overview_map = createElement('div', {
				id : "overview_map"
			});
		$(title).append($(overview_map));
	}

	var geocaches = [];
	var costumMarkers = [];
	var maxPrintLogs = parseInt(GM_getValue('maxPrintLogs', 3), 10);

	// fetch all caches in parallel, not one by one
	var promises = [];
	var prog = 0;
	for (i = 0; i < nCaches; i++) {
		costumMarker = (typeof(currentTour.geocaches[i].latitude) != "undefined");
		if (costumMarker) {
			promises.push(currentTour.geocaches[i]);
			setProgress(prog++, nCaches, document)
		} else {
			promises.push(getGeocache(currentTour.geocaches[i].id, Math.max(4,maxPrintLogs)));
		}
	}
	saveValue("progressBar", {
		"progress" : prog,
		"total" : nCaches
	}); // for progress bar update
	Promise.all(promises).then(function (cache_objects) {
		GM_deleteValue("progressBar"); // progress bar update finished
		for (i = 0; i < nCaches; ++i) {
			var costumMarker = (typeof(currentTour.geocaches[i].latitude) != "undefined");
			if (!costumMarker) {
				// retrieve at least 4 logs (if available) in order to display Last4Logs status, independent of maxPrintLogs parameter
				var geocache = cache_objects[i];

				if (geocache == "pm only") {
					var pmOnlyDiv = createElement('div');
					pmOnlyDiv.setAttribute('class', 'cacheDetail');
					pmOnlyDiv.innerHTML = "<b><img src='" + currentTour.geocaches[i].image + "'>" + currentTour.geocaches[i].name + " (" + currentTour.geocaches[i].id + ") is PM ONLY!</b>";
					body.appendChild(pmOnlyDiv);
					body.appendChild(document.createElement('br'));
					$(document).find("span#coords_" + currentTour.geocaches[i].id)
					.html("PM ONLY");
				} else {

					//logs
					var logs_div = createElement('div');
					var logs = geocache.logs;
					// if maxprintlogs is <= -1, export all logs to the print overview
					if (maxPrintLogs <= -1) {
						maxPrintLogs = logs.length;
					}
					maxPrintLogs = maxPrintLogs;
					for (var log_i = 0; (log_i < logs.length && (log_i < maxPrintLogs)); log_i++) {
						var log_div = createElement('div', {
								style : "width:100%;page-break-inside:avoid;"
							});
						log_div.setAttribute("class", "removable");

						var log_type_img = createElement('img', {
								src : GS_HOST + 'images/logtypes/' + logs[log_i].LogTypeImage
							});
						log_div.appendChild(log_type_img);
						log_div.innerHTML += " " + logs[log_i].Created + " - " + logs[log_i].UserName + " (" + logs[log_i].GeocacheFindCount + ")<br/>";
						log_div.innerHTML += logs[log_i].LogText;

						log_div.style.borderBottom = "1px dashed lightgray";
						append(log_div, logs_div);
					}

					var dummy_additional_waypoints = createElement('div');
					if (GM_getValue('printAdditionalWaypoints', true)) {
						var wpts_table = createElement('table', {
								style : "width:100%;border-collapse:separate;"
							});
						append(wpts_table, dummy_additional_waypoints);
						wpts_table.setAttribute("class", "removable");
						var content = "<tr>";
						for (var waypoints_i = 0; waypoints_i < geocache.additional_waypoints.length; waypoints_i++) {

							if (waypoints_i % 2 === 0 || waypoints_i == geocache.additional_waypoints.length - 1) {
								if (waypoints_i !== 0 && waypoints_i != 1) {
									content += "</tr>";
								}
								if (waypoints_i == geocache.additional_waypoints.length - 1 && waypoints_i !== 1) {
									content += "<tr>";
								}
							}

							content += "<td style='width:50%;'>";
							content += "<img src='" + geocache.additional_waypoints[waypoints_i].symbol + "'>";
							content += "<b>" + geocache.additional_waypoints[waypoints_i].name + "</b>";
							content += " | " + geocache.additional_waypoints[waypoints_i].coordinates + "<br/>";
							content += "<i>" + geocache.additional_waypoints[waypoints_i].note + "</i><br/>";
						}
						content += "</tr>";

						wpts_table.innerHTML = content;
					}

					//images
					var dummy_images = createElement('div');
					if (GM_getValue('printSpoilerImages', true)) {
						var image_table = createElement('table', {
								style : "border-collapse:separate;border-spacing:2px;width:100%"
							});
						append(image_table, dummy_images);
						var content = "<tr>";
						for (var images_i = 0; images_i < geocache.images.length; images_i++) {
							if (images_i % 2 === 0 || images_i == geocache.images.length - 1) {
								if (images_i !== 0 && images_i !== 1) {
									content += "</tr>";
								}
								if (images_i == geocache.images.length - 1 && images_i != 1) {
									content += "<tr>";
								}
							}
							content += "<td class='removable'>";
							content += "<img style='max-width:8cm;' src='" + geocache.images[images_i].href + "'><br/>";
							content += "<b>" + geocache.images[images_i].textContent + "</b>";
							content += "</td>";
						}
						content += "</tr>";
						image_table.innerHTML = content;
					}

					// inventory
					var inventory = createElement('span');
					for (var inventory_i = 0; inventory_i < geocache.inventory.length; inventory_i++) {
						var image = createElement('img');
						image.src = geocache.inventory[inventory_i].src;
						append(image, inventory);
					}
					if (geocache.inventory.length === 0) {
						var empty_inventory = createElement('span');
						empty_inventory.innerHTML = "empty";
						append(empty_inventory, inventory);
					}

					//attributes
					var attributes = createElement('span');
					for (var attributes_i = 0; attributes_i < geocache.attributes.length; attributes_i++) {
						var attribute = geocache.attributes[attributes_i];
						attribute.style.width = "16px";
						attribute.style.height = "16px";
						attribute.style.marginRight = "3px";
						if (attribute.src != $.gctour.img.attribute_blank) {
							append(attribute, attributes);
						}
					}

					var map_element_dummy = createElement('div');
					var map_element = createElement('div');
					append(map_element, map_element_dummy);

					// map the geocache to uploadable version
					var mapCache = {};
					mapCache.gcid = geocache.gcid;
					mapCache.guid = geocache.guid;
					mapCache.image = geocache.image;
					mapCache.name = geocache.name;
					mapCache.difficulty = geocache.difficulty;
					mapCache.terrain = geocache.terrain;
					mapCache.latitude = geocache.lat;
					mapCache.longitude = geocache.lon;
					// save additional waypoints
					var additional_waypoints = geocache.additional_waypoints;
					for (waypoint_i = 0; waypoint_i < additional_waypoints.length; waypoint_i++) {
						additional_waypoints[waypoint_i].note = "";
					}
					mapCache.additional_waypoints = additional_waypoints;
					geocaches.push(mapCache);
					// map the geocache to uploadable version - END -

					// export from GCComment script
					var gcComment = "";
					if (geocache.comment) {
						gcComment = "<b><u>GCComment:</u></b><br/>";
						if (geocache.comment.lat) {
							var parsedCoords = new LatLon(geocache.comment.lat, geocache.comment.lng).toString();
							gcComment += "<b>Final Coordinates:</b> " + parsedCoords + "<br/>";
						}
						gcComment += "<b>Comment:</b> (" + geocache.comment.state + ") " + geocache.comment.commentValue;
					}

					// cache note from Groundspeak
					var cache_note = "";
					if (geocache.cache_note) {
						cache_note = "<b><u>Cache Note:</u></b><br/>";
						cache_note += geocache.cache_note;
					}

					if (GM_getValue('printFrontpage', true) && !minimal) {

						$(document)
						// setting real coordinates on titlepage
						.find("span#coords_" + geocache.gcid)
						.html(geocache.coordinates)
						.css({
							'border-bottom' : (geocache.coordinatesisedit === true ? '2px solid gray' : 'none')
						})
						.end()
						// setting D, T, size and favorite points on titlepage
						.find("span#d_" + geocache.gcid).html(geocache.difficulty).end()
						.find("span#t_" + geocache.gcid).html(geocache.terrain).end()
						.find("span#s_" + geocache.gcid).html(geocache.size.substring(0, 1)).end()
						.find("span#fp_" + geocache.gcid).html(geocache.fav).end()
						.find("span#fs_" + geocache.gcid).html(geocache.favScore).end();
						
						// set the last 4 logs icon:
						getLast4Logs(geocache.logs, $("canvas#l4l_" + geocache.gcid, document));
					}

					var geocacheMapping = [
						['GCID', geocache.gcid],
						['CACHECOUNT', i + 1],
						['GUID', geocache.guid],
						['TYPE', geocache.type],
						['CACHENAME', (geocache.available) ? geocache.name : "<span style='text-decoration: line-through !important;'>" + geocache.name + "</span>"],
						['CACHESYM', geocache.cacheSym],
						['OWNER', geocache.owner],
						['HIDDEN', formatDate(geocache.hidden)],
						['ATTRIBUTES', attributes.innerHTML],
						['BEARING', geocache.bearing],
						['DISTANCE', geocache.distance],
						['INVENTORY', inventory.innerHTML],
						['COORDINATESISEDIT', (geocache.coordinatesisedit === true) ? '' : 'hidden'],
						['COORDINATES', geocache.coordinates],
						['DIFFICULTY', geocache.difficulty.replace(/\./, "_")],
						['TERRAIN', geocache.terrain.replace(/\./, "_")],
						['SIZE', geocache.size.toLowerCase().replace(/ /, "_")],
						['SHORT_DESCRIPTION', (geocache.short_description.length === 1) ? geocache.short_description.html() : ""],
						['LONG_DESCRIPTION', (geocache.long_description.length === 1) ? geocache.long_description.html() : ""],
						['GCCOMMENT', gcComment],
						['CACHENOTE', cache_note],
						['HINT', (GM_getValue('decryptPrintHints', true)) ? geocache.hint : convertROTStringWithBrackets(geocache.hint)],
						['ADDITIONAL_WAYPOINTS', dummy_additional_waypoints.innerHTML],
						['IMAGES', dummy_images.innerHTML],
						['MAP', map_element_dummy.innerHTML],
						['MAPID', "MAP_" + geocache.gcid],
						['LOGCOUNTER', (GM_getValue('printLoggedVisits', false)) ? geocache.find_counts.html() : ""],
						['LOGS', logs_div.innerHTML],
						['FAV', geocache.fav ? geocache.fav : 'none'],
						['FAVSCORE', geocache.favScore]
					];

					if (minimal) {
						geocacheMapping.push(['HIDDENSTYLE', "hidden"]);
					} else {
						geocacheMapping.push(['HIDDENSTYLE', ""]);
					}

					var cacheDetailTemp = fillTemplate(geocacheMapping, cacheDetailTemplate);

					// class "removable" elements and removable images in description
					$(".removable, div[class*='long'] img", cacheDetailTemp)
					.click(function (e) {
						e.stopPropagation();
						$(this).remove();
					})
					.hover(
						function () {
						$(this).css({
							"opacity" : "0.5",
							"cursor" : "url('" + $.gctour.img.del + "'),pointer"
						});
					},
						function () {
						$(this).css({
							"opacity" : 1
						});
					});

					// remove href attribute from links in "*=long" class
					$("div[class*='long'] a", cacheDetailTemp).removeAttr("href");

					// add editable mode
					if (GM_getValue('printEditMode', true)) {
						$("div[class*='long'], div[class*='short']", cacheDetailTemp).attr('contenteditable', 'true');
					}

					if (GM_getValue('printPageBreak', false)) {
						if (i < nCaches - 1) {
							cacheDetailTemp.style.pageBreakAfter = 'always';
						}
					}

					body.appendChild(cacheDetailTemp);
					body.appendChild(document.createElement('br'));

				}

			} else {

				// map custom marker to uploadable version
				var cm = cache_objects[i];
				cm.index = i;
				costumMarkers.push(cm);
				// map custom marker to uploadable version - END -

				var markerMapping = [
					['GCID', $.gctour.lang('printviewMarker')],
					['CACHECOUNT', (i + 1)],
					['TYPE', currentTour.geocaches[i].image],
					['NAME', currentTour.geocaches[i].name],
					['COORDINATES', new LatLon(currentTour.geocaches[i].latitude, currentTour.geocaches[i].longitude).toString()],
					['CONTENT', currentTour.geocaches[i].content.replace(/\n/g, "<br />")]
				];

				if (minimal) {
					markerMapping.push(['HIDDENSTYLE', "hidden"]);
				} else {
					markerMapping.push(['HIDDENSTYLE', ""]);
				}

				var cacheDetailTemp = fillTemplate(markerMapping, ownMarkerTemplate);
				body.appendChild(cacheDetailTemp);
				body.appendChild(document.createElement('br'));
			}
		}

		closeOverlayRemote(document)(); // close old overlay (scraping data)
		
		//maps
		addProgressbar({
			caption : $.gctour.lang('makeMapWait'),
			_document : document,
			closeCallback : function (_document) {
				return function () {
					if (confirm($.gctour.lang('cancel') + "?") == true) {
						location.reload();
					}
				};
			}
		});
		var cacheObject = {};
		cacheObject.geocaches = geocaches;
		cacheObject.costumMarkers = costumMarkers;
		uploadMap(cacheObject, function (result) {
			try {
				var overviewMapQuery = "";
				var geocacheCodes = [];

				for (var i = 0; i < nCaches; ++i) {
					var marker = currentTour.geocaches[i];

					if (marker.wptcode) {
						overviewMapQuery += marker.wptcode;
					} else {
						overviewMapQuery += (marker.id) ? marker.id : marker.gcid;
						geocacheCodes.push((marker.id) ? marker.id : marker.gcid);
					}

					if (i < nCaches - 1) {
						overviewMapQuery += ",";
					}
				}

				// overview map
				var printOverviewMap = (
					GM_getValue('printOutlineMap', true) &&
					GM_getValue('printFrontpage', true) &&
					!GM_getValue('printMinimal', false));
				var mapCount = (printOverviewMap) ? 1 : 0;
				mapCount += (GM_getValue('printOutlineMapSingle', false)) ? geocacheCodes.length : 0;
				if (printOverviewMap) {
					$("div#overview_map", document).first().append(getMapElement(overviewMapQuery, document));
					setProgress(0, mapCount, document);
				}

				// map for each geocache
				var printMapForEachCache = (
					GM_getValue('showCacheDetails', true) &&
					GM_getValue('printOutlineMapSingle', false));
				if (printMapForEachCache) {
					for (var i = 0; i < geocacheCodes.length; ++i) {
						var geocacheCode = geocacheCodes[i];
						var mapElement = $("div#MAP_" + geocacheCode, document).first();
						if (mapElement) {
							mapElement.append(getMapElement(geocacheCode, document));
						}
						setProgress(i + 1, mapCount, document);
					}
				}
				closeOverlayRemote(document)();
			} catch (e) {
				addErrorDialog({
					caption : "Print error maps",
					_document : document,
					_exception : e
				});
			}

		});
	})
}

// funktion ähnlich http://www.gsak.net/help/hs11980.htm
function getLast4Logs(logs, canvas_element) {

	var getColor = function (log4Logs) {
		if ((typeof(log4Logs)) === 'undefined') {
			return "LightGray";
		}
		switch (log4Logs.LogType) {
		case "Found it":
			return "green";
		case "Didn't find it":
			return "red";
		case "Needs Maintenance":
			return "blue";
		case "Temporarily Disable Listing":
			return "black";
		case "Needs Archived":
			return "yellow";
		default:
			return "LightGray";
		}
	};

	var ctx = canvas_element.get(0).getContext('2d');
	ctx.fillStyle = "black";
	//~ ctx.fillRect(0,0,17,17);
	ctx.clearRect(1, 1, 15, 15);

	var pos = [[2, 2], [9, 2], [2, 9], [9, 9]];
	var dim = [6, 6];
	for (var i = 0; i < pos.length; i++) {
		ctx.fillStyle = getColor(logs[i]);
		ctx.fillRect(pos[i][0], pos[i][1], dim[0], dim[1]);
	}

}

/* printpage maps */
function updateMapSize(newDocument, mapId, factor) {
	return function () {
		var map = newDocument.getElementById(mapId).getElementsByTagName('iframe')[0];
		map.style.width = (factor * 20) + "cm";
		map.style.height = (1 * 500) + "px";
	};
}

function getMapType() {
	return GM_getValue('printOutlineMapType', 'roadmap');
}

function getMapSettings() {
	var settings = [];
	// settings String:
	// 1 - Geocache GCID
	// 2 - Geocache Name
	// 3 - Waypoint Hide all
	// 4 - Waypoint Name
	// 5 - Waypoint Lookup
	// 6 - Own Waypoint show
	// 7 - Own Waypoints name
	// 8 - Show gc.de maps overlay
	// 9 - Show Geocache Index

	settings.push(GM_getValue('settings_map_geocacheid', true));
	settings.push(GM_getValue('settings_map_geocachename', true));
	settings.push(GM_getValue('settings_map_awpts', true));
	settings.push(GM_getValue('settings_map_awpt_name', true));
	settings.push(GM_getValue('settings_map_awpt_lookup', true));
	settings.push(GM_getValue('settings_map_owpts', true));
	settings.push(GM_getValue('settings_map_owpt_name', true));
	settings.push(GM_getValue('settings_map_geocacheindex', true));

	return settings.join("").replace(/true/g, "1").replace(/false/g, "0");
}

function getMapUrl(mapQuery) {

	var hash_value = postSync(GCTOUR_HOST + "map/make", "ids=" + mapQuery).responseText;
	debug("Hash '" + hash_value + "' for this query '" + mapQuery + "'");
	return GCTOUR_HOST + "map/show/h/" + hash_value + "/" + getMapSettings() + "/" + getMapType();
}

function getMapUrl_promise(mapQuery) {
	return spawn(function* () {
		var response = yield postPromise(GCTOUR_HOST + "map/make", "ids=" + mapQuery),
		hash_value = response.responseText;
		debug("Hash '" + hash_value + "' for this query '" + mapQuery + "'");
		return Promise.resolve(GCTOUR_HOST + "map/show/h/" + hash_value + "/" + getMapSettings() + "/" + getMapType());
	})
}

function getMap(mapQuery) {
	var map_size_px,
	mapId = mapQuery.replace(/,/g, ""),
	map_frame = document.createElement('iframe');

	switch (GM_getValue('defaultMapSize', 'large')) {
	case "medium":
		map_size_px = 375;
		break;
	case "small":
		map_size_px = 250;
		break;
	default:
		map_size_px = 500;
		break;
	}

	map_frame.className = 'cacheMap';
	map_frame.id = mapId;
	map_frame.style.width = "100%";
	map_frame.style.height = map_size_px + 'px';
	$(map_frame).css("border", '1px solid lightgray');
	$(map_frame).css("box-sizing", "border-box");

	map_frame.src = getMapUrl(mapQuery);
	return map_frame;
}

function getMapControl(mapQuery, map_frame, newDocument) {

	var mapId = mapQuery.replace(/,/g, ""),
	control_container = createElement('div'),
	map_size_px;

	control_container.className = 'noprint';

	switch (GM_getValue('defaultMapSize', 'large')) {
	case "medium":
		map_size_px = 375;
		break;
	case "small":
		map_size_px = 250;
		break;
	default:
		map_size_px = 500;
		break;
	}
	/*
	// todo - default noch selektieren! und alten code löschen
	$(control_container).append(
	$('<div/>').append(
	$('<div/>').text($.gctour.lang('settingsMapSize')).append(
	$("<div/>").gct_slider({
	min:100,
	max:1000,
	value:map_size_px,
	document: newDocument,
	slide:function(values){map_frame.style.height=values.value+"px";}
	})
	),
	$('<div/>').append(
	$("<div/>").gct_slider({
	min:20,
	max:100,
	value:100,
	document: newDocument,
	slide:function(values){map_frame.style.width=values.value+"%";}
	})
	),
	$('<div>'+$.gctour.lang('printviewRemoveMap')+'</div>')
	.css('background','url("'+$.gctour.img.del+'") top left no-repeat')
	.css('padding-left','18px')
	.click(function(){map_frame.parentNode.style.display = "none";}),
	$('<siv>Karte neu laden!</li>')
	.css('background','url("'+$.gctour.img.refresh+'") top left no-repeat')
	.css('padding-left','18px')
	.css('clear','both')
	.click(function(){map_frame.src = map_frame.src;})
	)
	).find("div").addShadowEffect().addOpacityEffect();*/


	$(control_container).append(
		$('<div>'+$.gctour.lang("mapHeight")+'</div>')
		.css('float', 'left')
		.css('margin-right', '5px'),
		$("<div/>").gct_slider({
			min : 100,
			max : 1000,
			value : map_size_px,
			document : newDocument,
			slide : function (values) {
				map_frame.style.height = values.value + "px";
			}
		})
		.css('float', 'left')
		.css('width', '250px'),
		$('<img>', {
			'class' : 'tourImage',
			src : $.gctour.img.del,
			title : $.gctour.lang('printviewRemoveMap'),
			alt : $.gctour.lang('printviewRemoveMap'),
			click : function () {
				map_frame.parentNode.style.display = "none";
			}
		})
		.css('float', 'right'),
		$('<img>', {
			'class' : 'tourImage',
			src : $.gctour.img.refresh,
			title : $.gctour.lang('reloadMap'),
			alt : $.gctour.lang('makeMap'),
			click : function () {
				map_frame.src = map_frame.src;
			}
		})
		.css('float', 'right'),
		$('<img>', {
			'class' : 'tourImage',
			src : $.gctour.img.map,
			title : $.gctour.lang('printviewZoomMap'),
			alt : $.gctour.lang('printviewZoomMap'),
			click : function () {
				GM_openInTab(getMapUrl(mapQuery));
			}
		})
		.css('float', 'right'),
		$('<div/>')
		.css('clear', 'both')).find("img.tourImage").addShadowEffect().addOpacityEffect().css('margin-left', '5px');
	/*
	float:left;margin-right:5px




	$('<div>Karte neu laden!</div>')
	.css('background','url("'+$.'") top left no-repeat')
	.css('padding-left','18px')
	.css('clear','both')
	.click(function(){map_frame.src = map_frame.src;})

	.append(,
	$('<div/>').append(
	$("<div/>").gct_slider({
	min:20,
	max:100,
	value:100,
	document: newDocument,
	slide:function(values){map_frame.style.width=values.value+"%";}
	})
	)
	),
	$('<div>'+$.gctour.lang('printviewRemoveMap')+'</div>')
	.css('background','url("'+$.gctour.img.del+'") top left no-repeat')
	.css('padding-left','18px')
	.click(function(){map_frame.parentNode.style.display = "none";}),
	$('<div>Karte neu laden!</div>')
	.css('background','url("'+$.gctour.img.refresh+'") top left no-repeat')
	.css('padding-left','18px')
	.css('clear','both')
	.click(function(){map_frame.src = map_frame.src;})
	);


	/*
	var factor = 1;
	var inputElement = document.createElement('input');control_container.appendChild(inputElement);
	inputElement.name = 'mapSize'+mapId;
	inputElement.type = 'radio';
	if(GM_getValue('defaultMapSize', 'large') === "large"){
	inputElement.checked = 'checked';
	factor = 1;
	}
	inputElement.addEventListener('click',function(){var factor = 1;map_frame.style.width=(1 * 20) +"cm";map_frame.style.height=(factor*500)+"px";}, false);
	control_container.appendChild(document.createTextNode("large"));

	inputElement = document.createElement('input');control_container.appendChild(inputElement);
	inputElement.name = 'mapSize'+mapId;
	inputElement.type = 'radio';
	if(GM_getValue('defaultMapSize', 'large') === "medium"){
	inputElement.checked = 'checked';
	factor = 0.75;
	}
	inputElement.addEventListener('click',function(){var factor = 0.75;map_frame.style.width=(1 * 20) +"cm";map_frame.style.height=(factor*500)+"px";}, false);
	control_container.appendChild(document.createTextNode("medium"));

	inputElement = document.createElement('input');control_container.appendChild(inputElement);
	inputElement.name = 'mapSize'+mapId;
	inputElement.type = 'radio';
	if(GM_getValue('defaultMapSize', 'large') === "small"){
	inputElement.checked = 'checked';
	factor = 0.5;
	}
	inputElement.addEventListener('click',function(){var factor = 0.5;map_frame.style.width=(1 * 20) +"cm";map_frame.style.height=(factor*500)+"px";}, false);
	control_container.appendChild(document.createTextNode("small"));

	control_container.appendChild(createElement('br'));

	// delete map button
	var divElement = document.createElement('div');control_container.appendChild(divElement);
	divElement.style.border = '1px solid lightgray';
	divElement.style.marginRight = '10px';
	divElement.style.display = "inline";
	divElement.style.cursor = "pointer";
	divElement.addEventListener('click', function(){map_frame.parentNode.style.display = "none";}, true);

	addOpacityEffects(divElement);

	var deleteImage = document.createElement('img');
	deleteImage.style.cursor = 'pointer';
	deleteImage.src = $.gctour.img.del;

	divElement.appendChild(deleteImage);
	divElement.appendChild(document.createTextNode($.gctour.lang('printviewRemoveMap')));

	// var refresh_link = document.getElementById(FrameID).contentDocument.location.reload(true);

	control_container.appendChild(createElement('br'));

	var map_link = createElement('a',{style:"font-size:80%"});
	map_link.href = getMapUrl(mapQuery);
	map_link.target = "_blank";

	//  map_link.addEventListener('click', function(){GM_openInTab(getMapUrl(mapQuery))}, true);
	map_link.innerHTML = "("+$.gctour.lang('printviewZoomMap')+")";
	control_container.appendChild(map_link);


	 */
	return control_container;

	//~ var updateMapSize = function (mapfactor){
	//~ return function(){
	//~ map_frame.style.width = (factor * 20) +"cm";
	//~ map_frame.style.height = (factor * 500) +"px";
	//~ }
	//~ };
	//~
	//~ return function(){
	//~ var map = newDocument.getElementById(mapId).getElementsByTagName('iframe')[0];
	//~ map.style.width = (factor * 20) +"cm";
	//~ map.style.height = (factor * 500) +"px";
	//~ }
	//~ }
	//~
	//~ var size_control_div = createElement('div');
	//~ size_control_div.innerHTML =
	//~ '<input type="radio" name="mapSize'+mapId+'">large</input>\
	//~ <input type="radio" name="mapSize'+mapId+'">medium</input>\
	//~ <input type="radio" name="mapSize'+mapId+'">small</input>';
	//~
	//~ var size_control_inputs = $('input',size_control_div);
	//~ alert(size_control_inputs.length);
	//~ var factor = 1;
	//~ /* large */
	//~ if(GM_getValue('defaultMapSize', 'large') == "large"){size_control_inputs[0] = 'checked';factor = 1;}
	//~ size_control_inputs[0].addEventListener('click',updateMapSize(1), false);
	//~ /* medium */
	//~ if(GM_getValue('defaultMapSize', 'large') == "medium"){size_control_inputs[1] = 'checked';factor = 0.75;}
	//~ size_control_inputs[1].addEventListener('click',updateMapSize(0.75), false);
	//~
	//~ /* small */
	//~ if(GM_getValue('defaultMapSize', 'large') == "small"){size_control_inputs[2] = 'checked';factor = 0.5;}
	//~ size_control_inputs[2].addEventListener('click',updateMapSize(0.5), false);
	//~
	//~ map_container.appendChild(size_control_div);
	//~ map_container.appendChild(map_frame);
	//~
	//~ return map_container;
}

(function ($) {

	var methods = {
		init : function (options) {
			var settings = $.extend({
					'min' : '0',
					'max' : '100',
					'document' : document,
					'value' : 0
				}, options),
			scroller_element = $("<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>")
				.appendTo(this),
			dragged = false,
			slider_width = 0,
			slider_offset = 0,
			percentage = 0,
			self = this;

			// set start value
			percentage = (100 * settings.value) / settings.max;

			scroller_element
			.css("left", (percentage) + "%")
			.click(function (event) {
				event.preventDefault();
			})
			.hover(
				function () {
				$(this).addClass("ui-state-hover");
			},
				function () {
				$(this).removeClass("ui-state-hover");
			})
			.focus(function () {
				$(".ui-slider .ui-state-focus").removeClass("ui-state-focus");
				$(this).addClass("ui-state-focus");
			})
			.blur(function () {
				$(this).removeClass("ui-state-focus");
			})
			.mousedown(function (e) {
				e.preventDefault();
				dragged = true;

				slider_width = parseInt(self.css("width"), 10);
				slider_offset = parseInt(self.offset().left, 10);

				scroller_element.addClass("ui-state-active");
				methods["trigger"].apply(self, ["start", methods["calculate"].apply(self, [percentage])]);
			});

			this.addClass('ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all')
			.append(scroller_element);

			$('*', settings.document).mousemove(function (e) {
				if (dragged) {
					e.preventDefault();
					percentage = (100 * (e.pageX - slider_offset)) / (slider_width);
					percentage = (percentage < 0) ? 0 : percentage;
					percentage = (percentage > 100) ? 100 : percentage;

					//            debug("MousePos:"+e.pageX+"\tSliderWidth:"+slider_width+"\tSliderOffset:"+slider_offset+"\tMove to:"+percentage);


					scroller_element.css("left", (percentage) + "%");

					methods["trigger"].apply(self, ["slide", methods["calculate"].apply(self, [percentage])]);
				}
			});

			$('*', settings.document).mouseup(function () {
				if (dragged) {
					dragged = false;
					scroller_element.removeClass("ui-state-active");
					methods["trigger"].apply(self, ["stop", methods["calculate"].apply(self, [percentage])]);
					//    			  methods["trigger"].apply( self, {value:percentage});
				}
			});

			this.data('gct_slider', {
				target : $(this),
				settings : settings
			});

			return this;
		},
		calculate : function (percentage) {
			var $data = $(this).data('gct_slider'),
			max = $data.settings.max,
			min = $data.settings.min,
			relative_value = (percentage * (max - min)) / 100,
			value = min + relative_value;
			//       log("relative_value"+ relative_value+ "\tvalue:"+value);
			return {
				percentage : percentage,
				value : value
			};
		},
		trigger : function (type, data) {
			var $data = $(this).data('gct_slider');
			callback = $data.settings[type],
			data = data || {};

			return !($.isFunction(callback) &&
				callback.apply(this, [data]) === false);
		}
	};

	$.fn.gct_slider = function (method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.tooltip');
		}
	};

})($);

function getMapElement(mapQuery, newDocument) {

	var map_container = createElement('div', {
			style : "text-align: center; margin-left: auto; margin-right: auto;"
		});

	var map_frame = getMap(mapQuery);
	map_container.appendChild(getMapControl(mapQuery, map_frame, newDocument));
	map_container.appendChild(map_frame);

	return map_container;
}

/* cache scraper */
// source of all evil asking groundspeak
function getGeocacheFromElement(element, maxLogsCount) {
	var coordinates,
	logLink,
	minimal_geocache,
	$divCacheDetails,
	$lnkConversions;
	var geocache = {};

	/*~
	geocache
	.gcid
	.cacheid
	.guid
	.name
	.type
	.owner
	.hidden
	.coordinates
	.coordinatesisedit // custom edit boolean
	.lat
	.lon
	.location
	.state
	.country
	.bearing
	.distance
	.inventory
	.attributes
	.size
	.difficulty
	.terrain
	.attributes
	.short_description
	.long_description
	.hint
	.images
	.additional_waypoints
	.find_counts
	.logs
	.fav
	.favScore
	 */

	// first check if really logged in
	// default, Challenges + Account + Membership ,Login
	logLink = $(element).find('a.SignedInProfileLink, a.CommonUsername, .LoginUsername');
	if (logLink.length === 0) {
		throw $.gctour.lang('notLogedIn');
	}

	if ($("a#ctl00_hlBecomePremium", element).length > 0) {
		return "pm only";
	}

	minimal_geocache = getMinimalGeocacheDetails(element);

	geocache.gcid = minimal_geocache.gccode;
	geocache.cacheid = minimal_geocache.cacheid;
	geocache.guid = minimal_geocache.guid;
	geocache.name = minimal_geocache.name;
	geocache.type = minimal_geocache.type.split(".")[0];
	geocache.image = GS_HOST + "images/wpttypes/" + geocache.type + ".gif";

	geocache.sym = "Geocache";
	if (($('a#ctl00_ContentBody_hlFoundItLog', element).length >= 1) || ($('strong#ctl00_ContentBody_GeoNav_logText', element).length >= 1)) {
		geocache.sym = "Geocache Found";
	}

	geocache.owner = $.trim($('a[href*="' + GS_HOST + 'profile/?guid="]', element).first().text());

	if (unsafeWindow.getGCComment) {
		var comment = unsafeWindow.getGCComment(geocache.guid);
		if (comment) {
			geocache.comment = comment;
		}
	}

	var usernote = $("#cache_note", element).first();
	if (usernote.length > 0) {
		geocache.cache_note = usernote.html();
	}

	// check availability
	var warning_element = $("ul.OldWarning", element).first(); // contains text like
	//This cache is temporarily unavailable. Read the logs below to read the status for this cache.
	//This cache has been archived, but is available for viewing for archival purposes.

	if (warning_element.length > 0) {
		geocache.archived = (warning_element.text().indexOf("archived") != -1);
		geocache.available = false;
	} else {
		geocache.archived = false;
		geocache.available = true;
	}

	$divCacheDetails = $('#ctl00_ContentBody_mcd2', element).first();
	geocache.hidden = parseDate($.trim($divCacheDetails.text().split(':').pop()));

	/* (01.2012)
	event caches =>
	LogedIn => okay, Example: 01/08/2012
	notLogedIn => unfortunately has an other format => Example: Wednesday, February 29, 2012
	solution approach => $.datepicker.parseDate("DD, MM d, yy", date_string)
	(http://docs.jquery.com/UI/Datepicker/parseDate)
	 */

	geocache.difficulty = $.trim($("span#ctl00_ContentBody_uxLegendScale > img", element).first().attr("alt").split(" out of ")[0]);
	geocache.terrain = $.trim($("span#ctl00_ContentBody_Localize12 > img", element).first().attr("alt").split(" out of ")[0]);
	geocache.size = $.trim($('img[src*="/images/icons/container/"]', element).first().attr("src").split("/")[4].split(".")[0]);
	geocache.coordinates = $('span#uxLatLon', element).first().text();

	// hole die userDefinedCoords aus GC Javascript
	// ExampleString: var userDefinedCoords = {"status":"success","data":{"isUserDefined":false,"oldLatLngDisplay":"N 52° 31.268' E 013° 21.255'"}};
	// var userDefinedCoordsString = element.innerHTML.split("var userDefinedCoords = {")[1].split("};")[0];
	//var userDefinedCoordsString = element.innerHTML.split("var userDefinedCoords = {") || "";
	//userDefinedCoordsString = userDefinedCoordsString[1] || "";
	//userDefinedCoordsString = userDefinedCoordsString.split("};") || "";
	//userDefinedCoordsString = userDefinedCoordsString[0] || "";
	var patt = /var userDefinedCoords = {*([\s\S]*?)}[;]+/; // suche nach "var userDefinedCoords = {"    bis    "};"
	var r;
	var userDefinedCoordsString = ((r = patt.exec($(element).text())) != null) ? r[1] : "";

	var userDefinedCoords = jQuery.parseJSON('{' + userDefinedCoordsString + '}');
	geocache.coordinatesisedit = (userDefinedCoords && userDefinedCoords.status == "success" && userDefinedCoords.data.isUserDefined == true); // false = original

	$lnkConversions = $('a#ctl00_ContentBody_uxViewLargerMap', element).first().attr("href");
	geocache.lat = $lnkConversions.split("lat=")[1].split("&")[0];
	geocache.lon = $lnkConversions.split("lng=")[1].split("&")[0];

	// if the user moved the coordinates of this geocache by GCTour
	if (GM_getValue('coords_' + geocache.gcid, "null") != "null") { // use it
		coordinates = GM_getValue('coords_' + geocache.gcid, "null").split("#");
		geocache.lat = coordinates[0];
		geocache.lon = coordinates[1];
		geocache.coordinates = new LatLon(geocache.lat, geocache.lon).toString();
		geocache.coordinatesisedit = true;
	}

	geocache.location = $("span#ctl00_ContentBody_Location", element).first().text();

	try {
		// get the country and (if exists) the state!
		if (geocache.location.indexOf(",") < 0) { // if the index of "," < 0 then the state is not given!

			geocache.state = "";
			geocache.country = $.trim(geocache.location.split("In ")[1]);
		} else {
			geocache.state = $.trim(geocache.location.split("In ")[1].split(',')[0]);
			geocache.country = $.trim(geocache.location.split("In ")[1].split(',')[1]);
		}
	} catch (e) { // somthing went wrong - write the whole location to country
		geocache.state = "";
		geocache.country = $.trim(geocache.location);
	}

	try {

		// ToDo check distance
		geocache.bearing = $('span#lblDistFromHome > img', element).first().attr("alt");
		var distanceTemp = $('span#lblDistFromHome', element).first().text().split(" ");
		geocache.distance = distanceTemp[0] + " " + distanceTemp[1];

	} catch (e) {
		// if homecoordinates are not set
		geocache.bearing = "";
		geocache.distance = "";
	}

	geocache.inventory = $('ul > li > a > img', $('div.WidgetBody', element).eq(1));

	geocache.attributes = $('div.CacheDetailNavigationWidget > div.WidgetBody > img', element);
	geocache.attributes_array = [];

	geocache.attributes.each(function (index, Element) {
		//  remove garbage from source address and split it at the "-"
		var attribute_array = this.src.replace(GS_HOST + "images/attributes/", "").replace(".gif", "").split("-");

		// iterate over every attributes defined in the global attributes array
		for (var attributesDef_i = 0; attributesDef_i < attributes_array.length; attributesDef_i++) {
			// ... and check whether the image is equal to the definition
			if (attribute_array[0] == attributes_array[attributesDef_i][1]) {
				// add this attribute as array with id-0, image-1, name-2 and yes/no-4
				geocache.attributes_array.push([attributes_array[attributesDef_i][0], attributes_array[attributesDef_i][1], attributes_array[attributesDef_i][2], ((attribute_array[1] == "yes") ? 1 : 0)]);
			}
		}
	});

	geocache.short_description = $('span#ctl00_ContentBody_ShortDescription', element).first();
	geocache.long_description = $('span#ctl00_ContentBody_LongDescription', element).first();
	geocache.images = $('a[rel="lightbox"]', element);

	geocache.additional_waypoints = [];

	var additional_waypoints = $('table.Table > tbody > tr', element);

	for (var i = 0; i < additional_waypoints.length; i = i + 2) {

		var row1 = additional_waypoints[i];
		var row2 = additional_waypoints[i + 1];

		var row1_tds = row1.getElementsByTagName('td');
		var row2_tds = row2.getElementsByTagName('td');

		coordinates = parseCoordinates(row1_tds[6].textContent);
		var waypoint = {};
		waypoint.symbol = row1_tds[2].childNodes[1].src;
		waypoint.prefix = $.trim(row1_tds[3].textContent);
		waypoint.lookup = $.trim(row1_tds[4].textContent);
		waypoint.name = row1_tds[5].childNodes[1].textContent;
		waypoint.coordinates = $.trim(row1_tds[6].textContent);
		waypoint.latitude = coordinates._lat;
		waypoint.longitude = coordinates._lon;
		waypoint.note = $.trim(row2_tds[2].innerHTML); // HTML in waypoint description
		// waypoint.note = $.trim(row2_tds[2].textContent); // pure text only, no line breaks etc

		// Final Location          https://www.geocaching.com/images/wpttypes/sm/flag.jpg
		// Parking Area            https://www.geocaching.com/images/wpttypes/sm/pkg.jpg
		// Question to Answer      https://www.geocaching.com/images/wpttypes/sm/puzzle.jpg
		// Stages of a Multicache  https://www.geocaching.com/images/wpttypes/sm/stage.jpg
		// Trailhead               https://www.geocaching.com/images/wpttypes/sm/trailhead.jpg
		// Reference Point         https://www.geocaching.com/images/wpttypes/sm/waypoint.jpg
		sym = waypoint.symbol.split(GS_HOST + GS_WPT_IMAGE_PATH)[1];
		switch (sym) {
		case "flag.jpg":
			waypoint.symbol_groundspeak = "Final Location";
			waypoint.type_groundspeak = "Waypoint|Final Location";
			break;
		case "pkg.jpg":
			waypoint.symbol_groundspeak = "Parking Area";
			waypoint.type_groundspeak = "Waypoint|Parking Area";
			break;
		case "puzzle.jpg":
			waypoint.symbol_groundspeak = "Question to Answer";
			waypoint.type_groundspeak = "Waypoint|Question to Answer";
			break;
		case "stage.jpg":
			waypoint.symbol_groundspeak = "Stages of a Multicache";
			waypoint.type_groundspeak = "Waypoint|Stages of a Multicache";
			break;
		case "trailhead.jpg":
			waypoint.symbol_groundspeak = "Trailhead";
			waypoint.type_groundspeak = "Waypoint|Trailhead";
			break;
		case "waypoint.jpg":
			waypoint.symbol_groundspeak = "Reference Point";
			waypoint.type_groundspeak = "Waypoint|Reference Point";
			break;
		default:
			waypoint.symbol_groundspeak = "Unknown Type";
			waypoint.type_groundspeak = "Waypoint|Unknown Type";
			break;
		}

		geocache.additional_waypoints.push(waypoint);
	}

	var hints_element = $('div#div_hint', element).first();
	geocache.hint = (hints_element.length > 0) ? convertROTStringWithBrackets($.trim(hints_element.text())) : "";

	geocache.find_counts = $('span#ctl00_ContentBody_lblFindCounts > p', element).first();

	// hole den UserToken und benutze ihn um die Logs einzusammeln
	var userToken = element.innerHTML.split("userToken = '")[1].split("'")[0];
	
	// favorite points
	geocache.fav = $('span.favorite-value', element).text().trim();
	
	// favorite score
	geocache.favScore = '';
	if(geocache.fav) { // only if favorite points available (e.g. not for events)
		postPromise(GS_HOST + 'datastore/favorites.svc/score?u=' + userToken,"").then( function(response) {
			var favScore = response.responseText;
			if (favScore>100) {
				favScore = '(100%)';
			} else if (favScore<1) {
				favScore = '(<1%)';
			} else {
				favScore = '('+favScore+'%)';
			}
			geocache.favScore = favScore;
		})
	}

	return getLogs(userToken, maxLogsCount).then(function(logs) {
		geocache.logs = logs;	
		log("fn getGeocacheFromElement - geocache.logs.length: " + geocache.logs.length);
		return geocache;
	})
}

function getGeocache(gcid, maxLogsCount) {
	return spawn(function* () {
		var response = yield getPromise(GS_HOST + 'seek/cache_details.aspx?log=y&wp=' + gcid);
		// after execution parse the result
		var response_div = createElement('div');
		response_div.innerHTML = response.responseText;

		GM_setValue("debug_lastgcid", gcid);
		GM_setValue("debug_lastcachesite", response.responseText);

		updateProgressBar();

		return Promise.resolve(getGeocacheFromElement(response_div, maxLogsCount));
	});
}

/* cache scraper utilities */
// return an object with this attributes: gcid, cacheid, guid, typeimage, name
function getMinimalGeocacheDetails(detailsPage) {
	/* gcid, cacheid, guid, typeimage, name */

	var geocache_details = {};
	var $obj = {}; // temp jquery container

	/* GCCode Stand 07.10.2011, update 16.05.2012
	 * <span id="ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode" class="CoordInfoCode">GC2HFRB</span>
	 * Fallback#1: steht im TITLE: <title>GC3JQEQ Pikaflow ...</title>
	 * Fallback#2: NUR WENN EINGELOGGT: <input type="submit" name="ctl00$ContentBody$btnSendToPhone" value="Send to My Phone" onclick="s2phone(&#39;GC2HFRB&#39;);return false;" id="ctl00_ContentBody_btnSendToPhone" />
	 */
	$obj.gcc = [
		$('.CoordInfoCode', detailsPage).first().text(),
		$('title', detailsPage).first().text(), // Fallback #1
		$('input#ctl00_ContentBody_btnSendToPhone', detailsPage).first().attr('onclick') // Fallback #2
	];

	// Validierung
	// example: http://jsfiddle.net/NUFGq/15/
	geocache_details.gccode =
		(findGCCodeFromString($obj.gcc[0])) ||
	(findGCCodeFromString($obj.gcc[1])) ||
	(findGCCodeFromString($obj.gcc[2])) ||
	null;

	if (!geocache_details.gccode) {
		throw error("Fatal: Error getting GCCode! (getMinimalGeocacheDetails)");
	} else {
		/*debug("getMinimalGeocacheDetails - GCCode: " + geocache_details.gccode);
		$.each($obj.gcc, function (i, n) {
		debug("\t" + i + ": " + findGCCodeFromString(n) + " = " + isGCCode(findGCCodeFromString(n)));
		});*/
	}

	/* CacheId aus einer diesen Quellen:
	 *  HTML          REGEXP          Quelle
	ccid=1957539"      ccid=(\d+)        "View all Trackables" Link
	"CacheID":1957539  \"CacheID\":(\d+) teil der vorgeladenen Logs
	w=1957539"         \Ww=(\d+)         "Watch Listing" link
	 */
	try {
		var cacheid_regex = /ccid=\d+|\"CacheID\":\d+|\Ww=\d+/;
		var cacheid_arr = cacheid_regex.exec(detailsPage.innerHTML);
		geocache_details.cacheid = cacheid_arr[0].split(/:|=/)[1];
		//debug("getMinimalGeocacheDetails - CacheID:" + geocache_details.cacheid);
	} catch (e) {
		throw "Error getting 'cacheid' from " + geocache_details.gccode;
	}

	/* Cachename:
	 *  <span id="ctl00_ContentBody_CacheName">3, 2, 1 ... Lift-Off</span></h2>
	 *  <meta name="og:title" content="3, 2, 1 ... Lift-Off" property="og:title" />
	 */
	$obj.name = [
		$('span#ctl00_ContentBody_CacheName', detailsPage).first().text(),
		$('meta[name="og:title"]', detailsPage).first().attr('content') // Fallback #1
	];

	geocache_details.name =
		($obj.name[0] && $.trim($obj.name[0])) ||
	($obj.name[1] && $.trim($obj.name[1])) ||
	null;

	if (!geocache_details.name) {
		throw "Error getting 'cacheName' from " + geocache_details.gccode;
	} else {
		/*debug(
		"getMinimalGeocacheDetails - Name: " + geocache_details.name + "\n" +
		"\t1: " + (($obj.name[0]) ? $obj.name[0] : "null") + "\n" +
		"\t2: " + (($obj.name[1]) ? $obj.name[1] : "null"));*/
	}

	/* Hole guid
	 *  <form name="aspnetForm" method="post" action="cache_details.aspx?guid=712fed16-77ab-48f4-a269-18cc27bb2a14" onsubmit="javascript:return WebForm_OnSubmit();" id="aspnetForm">
	 *  <a id="ctl00_ContentBody_lnkPrintFriendly5Logs" href="cdpf.aspx?guid=712fed16-77ab-48f4-a269-18cc27bb2a14&amp;lc=5" target="_blank">5 Logs</a>&nbsp;
	 *  <a id="ctl00_ContentBody_uxTravelBugList_uxTrackableItemsHistory" href="../track/search.aspx?wid=712fed16-77ab-48f4-a269-18cc27bb2a14">View past Trackables</a>
	 *  <a id="ctl00_ContentBody_uxLogbookLink" href="cache_logbook.aspx?guid=712fed16-77ab-48f4-a269-18cc27bb2a14">View Logbook</a>
	 *  lat=51.167083; lng=10.533383; guid='712fed16-77ab-48f4-a269-18cc27bb2a14';
	 */
	$obj.guid = [
		$("form[name='aspnetForm'][action*='guid=']", detailsPage).first().attr("action"),
		$("a#ctl00_ContentBody_lnkPrintFriendly5Logs[href*='guid=']", detailsPage).first().attr("href"),
		$("a#ctl00_ContentBody_uxTravelBugList_uxTrackableItemsHistory[href*='wid=']", detailsPage).first().attr("href"),
		$("a#ctl00_ContentBody_uxLogbookLink[href*='guid=']", detailsPage).first().attr("href")
	];

	//alert($("form[name='aspnetForm']", detailsPage).first().attr("action"));

	geocache_details.guid =
		($obj.guid[0] && $.trim($obj.guid[0].split("guid=")[1].split("&")[0])) ||
	($obj.guid[1] && $.trim($obj.guid[1].split("guid=")[1].split("&")[0])) ||
	($obj.guid[2] && $.trim($obj.guid[2].split("wid=")[1].split("&")[0])) ||
	($obj.guid[3] && $.trim($obj.guid[3].split("guid=")[1].split("&")[0])) ||
	null;

	if (!geocache_details.guid) {
		throw "Error getting 'guid' from " + geocache_details.gccode;
	} else {
		/*debug(
		"getMinimalGeocacheDetails - Guid: " + geocache_details.guid + "\n" +
		"\t1: " + (($obj.guid[0]) ? $obj.guid[0].split("guid=")[1].split("&")[0] : "null") + "\n" +
		"\t2: " + (($obj.guid[1]) ? $obj.guid[1].split("guid=")[1].split("&")[0] : "null") + "\n" +
		"\t3: " + (($obj.guid[2]) ? $obj.guid[2].split("wid=")[1].split("&")[0] : "null") + "\n" +
		"\t4: " + (($obj.guid[3]) ? $obj.guid[3].split("guid=")[1].split("&")[0] : "null"));*/
	}

	/* Hole type
	 *  <a href="/about/cache_types.aspx" target="_blank" title="About Cache Types"><img src="/images/wpttypes/2.gif" alt="Traditional Cache" title="Traditional Cache" /></a>
	 */
	$obj.type = [
		$('a[title="About Cache Types"] > img', detailsPage).first().attr("src")
	];

	geocache_details.type = ($obj.type[0] && $.trim($obj.type[0].split("/")[3])) || null;

	if (!geocache_details.type) {
		throw "Error getting 'type' from " + geocache_details.gccode;
	} else {
		/*debug(
		"getMinimalGeocacheDetails - Type: " + geocache_details.type + "\n" +
		"\t1: " + (($obj.type[0]) ? $obj.type[0].split("/")[3] : "null"));*/
	}

	return geocache_details;
}

function getLogs(userToken, maxLogsCount) {
	return spawn(function*() {
		maxLogsCount = $.isNumeric(maxLogsCount) ? maxLogsCount : 25; // optionaler Parameter default = 25, kann auch 0 sein
		var i = 1,
		numLogsPages = (maxLogsCount < 100) ? 25 : 100, // wieviel Logs je Request
		logs = [],
		urlTemplate = GS_HOST + 'seek/geocache.logbook?tkn=' + userToken + '&idx=#PAGE#&num=#NUM#&decrypt=false',
		url,
		n,
		log_obj = {},
		booA,
		booB;

		if (maxLogsCount <= 0) {
			return Promise.resolve(logs);
		}

		do {
			url = urlTemplate.replace("#PAGE#", i).replace("#NUM#", numLogsPages);		
			var response = yield getPromise(url);

			// after execution parse the result
			log_obj = JSON.parse(response.responseText);

			// füge alle ankommenden logs an das bestehende Array einfach hinten dran!
			logs = logs.concat(log_obj.data);

			//~ LogID               273160821
			//~ CacheID             2436701
			//~ LogGuid             "8fd33a36-bb44-40ed-9b8b-41737e2d0c6a"
			//~ Latitude            null
			//~ Longitude           null
			//~ LatLonString        ""
			//~ LogType             "Found it"
			//~ LogTypeImage        "2.png"
			//~ LogText             "Schönes Versteck, süße ...>Lisa, Yvonne und Frank"
			//~ Created             "10/14/2012"
			//~ Visited             "10/14/2012"
			//~ UserName            "sweet cats"
			//~ MembershipLevel     "1"
			//~ AccountID           6385212
			//~ AccountGuid         "0260fb1b-7cf1-4ef5-a3b6-6257276e3962"
			//~ Email               ""
			//~ AvatarImage         "99ff8cf2-7b7a-49a9-bb90-a38448158223.jpg"
			//~ GeocacheFindCount   33
			//~ GeocacheHideCount   0
			//~ ChallengesCompleted 0
			//~ IsEncoded           false
			//~ creator             Object { GroupTitle="Member", GroupImageUrl="/images/icons/reg_user.gif"}
			//~ GroupTitle          "Member"
			//~ GroupImageUrl       "/images/icons/reg_user.gif"
			//~ Images              []
			//~ debug(logs[0].UserName);

			i++;
			booA = (i <= log_obj.pageInfo.totalPages); // gibt es noch eine Seite danach ?
			booB = (logs.length < maxLogsCount); // maximale gewünschte Anzahl Logs noch nicht erreicht ?
		} while (booA && booB); // nächster Request ?

		// LogArray ggf. kürzen
		if (logs.length > maxLogsCount) {
			n = maxLogsCount - logs.length;
			logs = logs.slice(0, n);
		}
		return Promise.resolve(logs);
	})
}

/* gpx geocache */
function getAttributeXML(attribute_a) {
	return '    <groundspeak:attribute id="' + attribute_a[0] + '" inc="' + attribute_a[3] + '">' + attribute_a[2] + '</groundspeak:attribute>\n';
}

function getGPXfromMarker(marker) {
	var gpx = '';
	gpx += ' <wpt lat="' + marker.latitude + '" lon="' + marker.longitude + '">\n';
	gpx += '  <time>' + xsdDateTime(new Date()) + '</time>\n';
	gpx += '  <name>' + escapeHTML(marker.name) + '</name>\n';
	gpx += '  <cmt>' + escapeHTML(marker.content) + '</cmt>\n';
	gpx += '  <sym>' + marker.symbol + '</sym>\n';
	gpx += ' </wpt>';
	return gpx;
}

function getWaypointsGPXFromGeocache(waypoint, geocache) {
	var waypointName = waypoint.prefix + geocache.gcid.replace(/GC/, '');
	var gpx = '';
	gpx += ' <wpt lat="' + waypoint.latitude + '" lon="' + waypoint.longitude + '">\n';
	gpx += '  <time>' + xsdDateTime(geocache.dateHidden) + '</time>\n';
	gpx += '  <name>' + escapeHTML(waypointName) + '</name>\n';
	gpx += '  <cmt>' + escapeHTML(waypoint.note) + '</cmt>\n';
	gpx += '  <desc>' + escapeHTML(waypoint.name) + '</desc>\n';
	gpx += '  <sym>' + waypoint.symbol_groundspeak + '</sym>\n';
	gpx += '  <type>' + waypoint.type_groundspeak + '</type>\n';
	gpx += ' </wpt>';
	return gpx;
}

function getGPXGeoCache(gcid) {
	return spawn(function* () {
		var i, // for ()
		geocache = {},
		maxGPXLogs = parseInt(GM_getValue('maxGPXLogs', 10), 10),
		geocache_obj = yield getGeocache(gcid, maxGPXLogs);

		if (geocache_obj === "pm only") { // basic member and pm only cache
			return Promise.resolve(geocache_obj);
		}

		/*
		geocache.gcid
		.guid
		.cacheid
		.name
		.type
		.owner
		.hidden
		.coordinates
		.lat
		.lon
		.location
		.state
		.country
		.bearing
		.distance
		.inventory
		.size
		.difficulty
		.terrain
		.attributes
		.short_description
		.long_description
		.hint
		.images
		.additional_waypoints
		.find_counts
		.logs
		.fav
		 */

		geocache.gcid = geocache_obj.gcid;
		if (GM_getValue('gpxstripgc', false)) {
			geocache.gcid = geocache.gcid.replace(/GC/, '');
		}

		geocache.guid = geocache_obj.guid;

		geocache.cacheid = geocache_obj.cacheid;
		geocache.archived = (geocache_obj.archived) ? "True" : "False";
		geocache.available = (geocache_obj.available) ? "True" : "False";

		geocache.cacheName = geocache_obj.name;
		geocache.cacheOwner = geocache_obj.owner;
		geocache.cacheSym = geocache_obj.sym;

		switch (geocache_obj.size) {
		case "micro":
			geocache.cacheSize = "Micro";
			break;
		case "small":
			geocache.cacheSize = "Small";
			break;
		case "regular":
			geocache.cacheSize = "Regular";
			break;
		case "large":
			geocache.cacheSize = "Large";
			break;
		case "other":
			geocache.cacheSize = "Other";
			break;
		case "not_chosen":
			geocache.cacheSize = "Not chosen";
			break;
		case "virtual":
			geocache.cacheSize = "Virtual";
			break;
		default:
			geocache.cacheSize = "";
			break;
		}

		for (i = 0; i < wptArray.length; i++) {
			if (wptArray[i].wptTypeId == geocache_obj.type) {
				geocache.cacheType = wptArray[i].name;
			}
		}

		geocache.attributes_array = geocache_obj.attributes_array;
		geocache.difficulty = geocache_obj.difficulty;
		geocache.terrain = geocache_obj.terrain;

		var summary = geocache_obj.short_description,
		description = geocache_obj.long_description;
		if (GM_getValue('gpxhtml', true)) {
			geocache.longDescription = (description.length === 1) ? description.html() : "";
			geocache.shortDescription = (summary.length === 1) ? summary.html() : "";
		} else {
			geocache.longDescription = (description.length === 1) ? description.text() : "";
			geocache.shortDescription = (summary.length === 1) ? summary.text() : "";
		}

		geocache.hint = geocache_obj.hint;
		geocache.state = geocache_obj.state;
		geocache.country = geocache_obj.country;
		geocache.dateHidden = geocache_obj.hidden;

		// logs
		geocache.logs = [];
		for (i = 0; i < geocache_obj.logs.length; i++) {
			var logObj = {};

			// from: "user"
			// type: "Found It", "Didn't find it", "Temporarily Disable Listing", "Write note", "Enable Listing",...
			//  text: "Netter Log eintrag."
			// logdate: "August 18" oder "February 17, 2007"
			// id: 12345679

			var gc_log = geocache_obj.logs[i];
			logObj.cacherName = gc_log.UserName;
			logObj.type = gc_log.LogType;
			logObj.foundDate = parseDate(gc_log.Created);
			logObj.content = $(gc_log.LogText).text(); // no HTML in logs
			logObj.id = gc_log.LogID;

			geocache.logs.push(logObj);
		}

		geocache.additionalWaypoints = geocache_obj.additional_waypoints;
		geocache.latitude = geocache_obj.lat;
		geocache.longitude = geocache_obj.lon;

		/*
		log([
		"--------------[START " + geocache.gcid + "]-------------",
		"gcid: \t\t" + geocache.gcid,
		"guid: \t\t" + geocache.guid,
		"cacheid: \t" + geocache.cacheid,
		"archived: \t" + geocache.archived,
		"available: \t" + geocache.available,
		"cacheName:\t" + geocache.cacheName,
		"cacheSym (GPX):\t" + geocache.cacheSym,
		"cacheOwner:\t" + geocache.cacheOwner,
		"dateHidden:\t" + geocache.dateHidden,
		"cacheType:\t" + geocache.cacheType,
		"cacheSize:\t" + geocache.cacheSize,
		"difficulty:\t" + geocache.difficulty,
		"terrain:\t" + geocache.terrain,
		"latitude:\t" + geocache.latitude,
		"longitude:\t" + geocache.longitude,
		"state:\t\t" + geocache.state,
		"country:\t" + geocache.country,
		"favorites:\t" + geocache_obj.fav,
		"shortDescription:\n\n" + geocache.shortDescription,
		"longDescription:\n\n" + geocache.longDescription,
		"hint:\t\t" + geocache.hint,
		"--------------[END " + geocache.gcid + "]--------------"
		].join("\n"));
		 */

		return Promise.resolve(geocache);
	});
}

function getGPX() {
	var i, ii, iii; // for ()

	var gpxHeader =
		'<?xml version="1.0" encoding="utf-8"?>\n' +
		'<gpx xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" version="1.0" creator="GCTour" xsi:schemaLocation="http://www.topografix.com/GPX/1/0 http://www.topografix.com/GPX/1/0/gpx.xsd http://www.groundspeak.com/cache/1/0/1 http://www.groundspeak.com/cache/1/0/1/cache.xsd" xmlns="http://www.topografix.com/GPX/1/0">\n' +
		' <name>' + escapeHTML(currentTour.name) + '</name>\n' +
		// do not change <desc> content, otherwise GSAK does not handle additional cache waypoints as child waypoints during GPX import
		' <desc>This is an individual cache generated from Geocaching.com</desc>\n' +
		' <author>GCTour ' + VERSION + '</author>\n' +
		' <url>' + GS_HOST + '</url>\n' +
		' <urlname>Geocaching - High Tech Treasure Hunting</urlname>\n' +
		' <time>' + xsdDateTime(new Date()) + '</time>\n' +
		' <bounds minlat="##MINLAT##" minlon="##MINLON##" maxlat="##MAXLAT##" maxlon="##MAXLON##" />\n' +
		'##GEOCACHES##\n' +
		'##WAYPOINTS##\n' +
		'</gpx>';

	var geocacheTemplate =
		' <wpt lat="##LAT##" lon="##LON##">\n' +
		'  <time>##TIME##</time>\n' +
		'  <name>##GCID##</name>\n' +
		'  <desc>##CACHENAME## by ##OWNER##, ##TYPE## (##DIFFICULTY##/##TERRAIN##)</desc>\n' +
		'  <url>http://coord.info/##GCID##</url>\n' +
		'  <urlname>##CACHENAME##</urlname>\n' +
		'  <sym>##CACHESYM##</sym>\n' +
		'  <type>Geocache|##TYPE##</type>\n' +
		'  <groundspeak:cache id="##CACHEID##" available="##AVAILABLE##" archived="##ARCHIVED##" xmlns:groundspeak="http://www.groundspeak.com/cache/1/0/1">\n' +
		'   <groundspeak:name>##CACHENAME##</groundspeak:name>\n' +
		'   <groundspeak:placed_by>##OWNER##</groundspeak:placed_by>\n' +
		'   <groundspeak:owner>##OWNER##</groundspeak:owner>\n' +
		'   <groundspeak:type>##TYPE##</groundspeak:type>\n' +
		'   <groundspeak:container>##CONTAINER##</groundspeak:container>\n' +
		'   <groundspeak:attributes>\n##ATTRIBUTES##   </groundspeak:attributes>\n' +
		'   <groundspeak:difficulty>##DIFFICULTY##</groundspeak:difficulty>\n' +
		'   <groundspeak:terrain>##TERRAIN##</groundspeak:terrain>\n' +
		'   <groundspeak:country>##COUNTRY##</groundspeak:country>\n' +
		'   <groundspeak:state>##STATE##</groundspeak:state>\n' +
		'   <groundspeak:short_description html="True">##SUMMARY##   </groundspeak:short_description>\n' +
		'   <groundspeak:long_description html="True">##DESCRIPTION##   </groundspeak:long_description>\n' +
		'   <groundspeak:encoded_hints>##HINT##</groundspeak:encoded_hints>\n' +
		'   <groundspeak:logs>\n##LOGS##\n   </groundspeak:logs>\n' +
		'  </groundspeak:cache>\n' +
		' </wpt>';

	var geocacheLogTemplate =
		'    <groundspeak:log id="##LOGID##">\n' +
		'     <groundspeak:date>##TIME##</groundspeak:date>\n' +
		'     <groundspeak:type>##LOGTYPE##</groundspeak:type>\n' +
		'     <groundspeak:finder>##CACHERNAME##</groundspeak:finder>\n' +
		'     <groundspeak:text encoded="False">##LOGTEXT##</groundspeak:text>\n' +
		'    </groundspeak:log>';

	var gcStrArray = [],
	wptStrArray = [],
	minLat,
	minLon,
	maxLat,
	maxLon,
	nCaches = currentTour.geocaches.length;

	// fetch all caches in parallel, not one by one
	var promises = [];
	var prog = 0;
	for (i = 0; i < nCaches; i++) {
		var costumMarker = (typeof(currentTour.geocaches[i].latitude) != "undefined");
		if (costumMarker) {
			wptStrArray.push(getGPXfromMarker(currentTour.geocaches[i]));
			setProgress(prog++, nCaches, document)
		} else {
			promises.push(getGPXGeoCache(currentTour.geocaches[i].id));
		}
	}
	saveValue("progressBar", {
		"progress" : prog,
		"total" : nCaches
	}); // for progress bar update
	return Promise.all(promises).then(function (cache_objects) {
		GM_deleteValue("progressBar"); // progress bar update finished
		for (i = 0; i < cache_objects.length; i++) {

			// if the cancel button is pressed...
			if (GM_getValue("stopTask", false)) {
				GM_setValue("stopTask", false);
				return "canceled"; // ...then return!
			}

			var geocache = cache_objects[i];
			if (geocache !== "pm only") {
				//debug("GS GPX: geocache.dateHidden:'" + geocache.dateHidden + "' -> xsd:'" + xsdDateTime(geocache.dateHidden) + "'");
				var logs = geocache.logs,
				logsStringArray = [],
				attributeLog,
				attributeLogtext;

				// create log with attributes!
				if (GM_getValue('gpxattributestolog', false)) {
					attributeLogtext = $.map(geocache.attributes_array, function (row, i) {
							return row[2] + ": " + ((row[3] === 1) ? "yes" : "no");
						}).join("\n");

					attributeLog = geocacheLogTemplate
						.replace('##LOGID##', geocache.cacheid)
						.replace('##TIME##', xsdDateTime(new Date()))
						.replace('##CACHERNAME##', "GCTour")
						.replace('##LOGTYPE##', "Write note")
						.replace('##LOGTEXT##', attributeLogtext);
					logsStringArray.push(attributeLog);
				}

				// for removing all emoji codes in logs
				var emoji_ranges = [
				  '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
				  '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
				  '\ud83d[\ude80-\udeff]'  // U+1F680 to U+1F6FF
				];
				
				// max 200 logs in gpx
				for (ii = 0; (ii < logs.length && ii < 200); ii++) {				
					var geocacheLogMapping = [
						['LOGID', logs[ii].id],
						['TIME', xsdDateTime(logs[ii].foundDate)],
						['CACHERNAME', escapeHTML(logs[ii].cacherName)],
						['LOGTYPE', logs[ii].type],
						// remove ASCII control codes
						['LOGTEXT', escapeHTML(stripASCIIcodes(logs[ii].content))]
						// for removing all emoji codes in logs
						//['LOGTEXT', escapeHTML( stripASCIIcodes(logs[ii].content).replaceAll(emoji_ranges.join('|'),'') )]
					];

					var cacheWaypointLog = geocacheLogTemplate;
					for (iii = 0; iii < geocacheLogMapping.length; iii++) {
						cacheWaypointLog = cacheWaypointLog.replaceAll("##" + geocacheLogMapping[iii][0] + "##", geocacheLogMapping[iii][1]);
					}

					logsStringArray.push(cacheWaypointLog);
				}

				var attributesString = "";
				for (ii = 0; (ii < geocache.attributes_array.length); ii++) {
					attributesString += getAttributeXML(geocache.attributes_array[ii]);
				}

				var geocacheMapping = [
					['LAT', geocache.latitude],
					['LON', geocache.longitude],
					['TIME', xsdDateTime(geocache.dateHidden)],
					['GCID', geocache.gcid],
					['CACHEID', geocache.cacheid],
					['GUID', geocache.guid],
					['AVAILABLE', geocache.available],
					['ARCHIVED', geocache.archived],
					['CACHENAME', escapeHTML(geocache.cacheName)],
					['CACHESYM', geocache.cacheSym],
					['OWNER', escapeHTML(geocache.cacheOwner)],
					['STATE', escapeHTML(geocache.state)],
					['COUNTRY', escapeHTML(geocache.country)],
					['TYPE', geocache.cacheType],
					['CONTAINER', geocache.cacheSize],
					['ATTRIBUTES', attributesString],
					['DIFFICULTY', geocache.difficulty],
					['TERRAIN', geocache.terrain],
					['SUMMARY', escapeHTML(geocache.shortDescription)],
					['DESCRIPTION', escapeHTML(geocache.longDescription)],
					['HINT', escapeHTML(geocache.hint)],
					['LOGS', logsStringArray.join("\n")]
				];

				// bounds for caches
				minLat = (!minLat) ? geocache.latitude  : Math.min(geocache.latitude, minLat);
				maxLat = (!maxLat) ? geocache.latitude  : Math.max(geocache.latitude, maxLat);
				minLon = (!minLon) ? geocache.longitude : Math.min(geocache.longitude, minLon);
				maxLon = (!maxLon) ? geocache.longitude : Math.max(geocache.longitude, maxLon);

				var cacheWaypoint = geocacheTemplate;
				for (ii = 0; ii < geocacheMapping.length; ii++) {
					cacheWaypoint = cacheWaypoint.replaceAll('##' + geocacheMapping[ii][0] + '##', geocacheMapping[ii][1]);
				}
				gcStrArray.push(cacheWaypoint);

				if (GM_getValue('gpxwpts', true)) {
					for (iii = 0; iii < geocache.additionalWaypoints.length; iii++) {
						if (geocache.additionalWaypoints[iii].coordinates != "???") {
							wptStrArray.push(getWaypointsGPXFromGeocache(geocache.additionalWaypoints[iii], geocache));
						}
					}
				}
			} // pm only check for basic members
			else {
				str = 'pm only cache "' + currentTour.geocaches[i].name + '" will be skipped';
				$('<div>' + str + '</div>').dialog($.gctour.dialog.info());
			}
		} // iteration end

		// bounds for cache waypoints + custom waypoints
		for (i = 0; i < wptStrArray.length; ++i) {
			var lat = wptStrArray[i].split('lat="')[1].split('"')[0];
			lon = wptStrArray[i].split('lon="')[1].split('"')[0];
			minLat = (!minLat) ? lat : Math.min(lat, minLat);
			maxLat = (!maxLat) ? lat : Math.max(lat, maxLat);
			minLon = (!minLon) ? lon : Math.min(lon, minLon);
			maxLon = (!maxLon) ? lon : Math.max(lon, maxLon);
		}

		var str = gpxHeader
			.replaceAll('##GEOCACHES##', gcStrArray.join("\n"))
			.replaceAll('##WAYPOINTS##', wptStrArray.join("\n"))
			.replaceAll('##MINLAT##', minLat)
			.replaceAll('##MINLON##', minLon)
			.replaceAll('##MAXLAT##', maxLat)
			.replaceAll('##MAXLON##', maxLon);

		return Promise.resolve(str);
	})
}

function downloadGPXFunction() {
	if (!isNotEmptyList() || !isLogedIn()) {
		return;
	}

	spawn(function* () {
		var tourName,
		currentDate,
		currentDateString,
		gpxString,
		filename,
		blob;

		// add progressbar while loading
		addProgressbar({
			closeCallback : function () {
				return function () {
					if (confirm($.gctour.lang('cancel') + "?") == true) {
						GM_setValue("stopTask", true);
					}
				};
			}
		});

		tourName = currentTour.name.replace(/\s+/g, "_").replace(/[^A-Za-z0-9_ÄäÖöÜüß-]*/g, "");
		currentDate = new Date();
		currentDateString = currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate() + "_" + currentDate.getHours() + "-" + currentDate.getMinutes() + "-" + currentDate.getSeconds();
		filename = 'GCTour.' + tourName + '.' + currentDateString + '.gpx';

		try {
			gpxString = yield getGPX();

			//if the cancel button is pressed the gpxString just contains canceled
			if (gpxString == "canceled") {
				closeOverlay();
				return;
			}

			// open save file dialog
			blob = new Blob([gpxString], {
					type : "application/gpx;charset=utf-8"
				});
			saveAs(blob, filename);

			// all done - remove the overlay
			closeOverlay();

		} catch (e) {
			addErrorDialog({
				caption : "GPX error",
				_exception : e
			});
		}
	})
}

/* setting utilities */
function setLanguage(l) {
	return function () {
		GM_setValue('language', l);
		window.location.reload();
	};
}

function toggleBoolValue(valueName, defaultValue) {
	return function () {
		GM_setValue(valueName, !GM_getValue(valueName, defaultValue));
	};
}

function setPrintFontSize(fontSize) {
	return function () {
		GM_setValue('printFontSize', fontSize);
	};
}

function setPrintMapType(mapType) {
	return function () {
		GM_setValue('printOutlineMapType', mapType);
	};
}

function setPrintMapSize(mapSize) {
	return function () {
		GM_setValue('defaultMapSize', mapSize);
	};
}

/* settings jqUI prototype: properties and methods  */
function Settings_jqUI() {
	// checkbox settings
	this.settings_printview_cb = [
		['settingsPrintMinimal', 'printMinimal', false],
		['settingsDecryptHints', 'decryptPrintHints', true],
		['settingsEditDescription', 'printEditMode', true],
		['settingsShowSpoiler', 'printSpoilerImages', true],
		['settingsAdditionalWaypoints', 'printAdditionalWaypoints', true],
		['settingsAdditionalWaypoints2', 'addCustomMarkerToCacheTable', true],
		['settingsLoggedVisits', 'printLoggedVisits', false],
		['settingsPageBreak', 'printPageBreak', false],
		['settingsPageBreakAfterMap', 'printPageBreakAfterMap', true],
		['settingsFrontPage', 'printFrontpage', true],
		['settingsOutlineMap', 'printOutlineMap', true],
		['settingsOutlineMapSingle', 'printOutlineMapSingle', false],
		['settingsShowCacheDetails', 'showCacheDetails', true]
	];
	this.settings_map_cb = [
		['settings_map_geocacheid', 'settings_map_geocacheid', true],
		['settings_map_geocachename', 'settings_map_geocachename', true],
		['settings_map_geocacheindex', 'settings_map_geocacheindex', true],
		['settings_map_awpts', 'settings_map_awpts', true],
		['settings_map_awpt_name', 'settings_map_awpt_name', true],
		['settings_map_awpt_lookup', 'settings_map_awpt_lookup', true],
		['settings_map_owpts', 'settings_map_owpts', true],
		['settings_map_owpt_name', 'settings_map_owpt_name', true]
	];
	this.settings_gpx_cb = [
		['settingsGPXHtml', 'gpxhtml', true],
		['settingsGPXWpts', 'gpxwpts', true],
		['settingsGPXAttributestoLog', 'gpxattributestolog', false],
		['settingsGPXStripGC', 'gpxstripgc', false]
	];

	// menu structure
	this.tabs =
		'<div id="tabs">' +
		'  <ul>' +
		'    <li><a href="#tabs-1">' + $.gctour.lang("language") + '</a></li>' +
		'    <li><a href="#tabs-2">' + $.gctour.lang("printview") + '</a></li>' +
		'    <li><a href="#tabs-3">' + $.gctour.lang("settings_map") + '</a></li>' +
		'    <li><a href="#tabs-4">' + $.gctour.lang("settingsGPX") + '</a></li>' +
		'    <li><a href="#tabs-5">Themes</a></li>' +
		'  </ul>' +
		'  <div id="tabs-1">' + this.getLanguage() + '</div>' +
		'  <div id="tabs-2">' + this.getPrintview() + '</div>' +
		'  <div id="tabs-3">' + this.getMap() + '</div>' +
		'  <div id="tabs-4">' + this.getGpx() + '</div>' +
		'  <div id="tabs-5">' + this.getThemes() + '</div>' +
		'</div>';
}

Settings_jqUI.prototype.getLanguage = function () {
	var language =
		'<div id="lang">' +
		'  <label for="selLang" class="gctour-label ui-widget-header ui-corner-all" style="padding: .1em .5em;">' + $.gctour.lang("settingsSelectLanguage") + '</label>' +
		'  <select name="selLang" id="selLang" class="ui-widget ui-corner-all">';
	$.each($.gctour.i18n, function (l, o) {
		language += '    <option value="' + l + '">' + o.name + '</option>';
	});
	language +=
	'  </select>' +
	'</div>';
	return language;
};

Settings_jqUI.prototype.getPrintview = function () {
	var printview =
		this.cbLayout(this.settings_printview_cb[0][0]) +
		'<div style="border-bottom:1px solid;padding-bottom:10px;padding-top:10px">' +
		'  <b>' + $.gctour.lang("settingsLogCount") + '</b><br>' +
		'  <div id="settingsLogCount">' +
		'	 <input type="radio" name="radio-1" id="radio-1" value="0">' +
		'	 <label for="radio-1" class="ui-button ui-widget-header ui-corner-all" style="margin: 2px; padding: .1em .5em;">' + $.gctour.lang('settingsLogCountNone') + '</label><br>' +
		'	 <input type="radio" name="radio-1" id="radio-2" value="3">' +
		'    <input  type="text" style="width: 2em;" class="gctour-input-text" maxlength="3">' +
		'	 <label for="radio-2" class="ui-button ui-widget-header ui-corner-all" style="margin: 2px; padding: .1em .5em;">' + $.gctour.lang('settingsLogCountShow') + '</label><br>' +
		'  </div>' +
		'</div>' +
		'<div id="selectmenu" style="border-bottom:1px solid;padding-bottom:10px;padding-top:10px">' +
		'  <b>' + $.gctour.lang("settingsFontSize") + '</b><br>' +
		'  <select name="settingsFontSize" id="settingsFontSize" class="ui-widget ui-corner-all">';
	var sizeArray = ["xx-small", "x-small", "small", "medium", "large", "x-large", "xx-large"];
	$.each(sizeArray, function (i, size) {
		printview += '    <option value="' + size + '">' + size + '</option>';
	});
	printview +=
	'  </select>' +
	'</div>';
	for (i = 1; i < this.settings_printview_cb.length; i++) { // checkboxes
		printview += this.cbLayout(this.settings_printview_cb[i][0]);
	}
	return printview;
};

Settings_jqUI.prototype.getMap = function () {
	var map =
		'<div style="border-bottom:1px solid;padding-bottom:10px;padding-top:10px">' +
		'  <b>' + $.gctour.lang("settingsMapType") + '</b><br>' +
		'  <select name="settingsMapType" id="settingsMapType" class="ui-widget ui-corner-all">';
	$.each($.gctour.lang("mapTypes"), function (i, type) {
		map += '    <option value="' + type.value + '">' + type.caption + '</option>';
	});
	map +=
	'  </select>' +
	'</div>' +
	'<div style="border-bottom:1px solid;padding-bottom:10px;padding-top:10px">' +
	'  <b>' + $.gctour.lang("settingsMapSize") + '</b><br>' +
	'  <select name="settingsMapSize" id="settingsMapSize" class="ui-widget ui-corner-all">' +
	'    <option value="large">large</option>' +
	'    <option value="medium">medium</option>' +
	'    <option value="small">small</option>' +
	'  </select>' +
	'</div>';
	for (i = 0; i < this.settings_map_cb.length; i++) { // checkboxes
		map += this.cbLayout(this.settings_map_cb[i][0]);
	}
	return map;
};

Settings_jqUI.prototype.getGpx = function () {
	var gpx = '';
	for (i = 0; i < this.settings_gpx_cb.length - 1; i++) { // checkboxes
		gpx += this.cbLayout(this.settings_gpx_cb[i][0]);
	}
	gpx +=
	'<div id="maxLogCount" style="border-bottom:1px solid;padding-bottom:10px;padding-top:10px">' +
	'  <b>' + $.gctour.lang("settings.gpx.maxLogCount") + '</b><br>' +
	'  <input type="text" style="width: 2em;" class="gctour-input-text" maxlength="3">' +
	'</div>';
	gpx += this.cbLayout(this.settings_gpx_cb[this.settings_gpx_cb.length - 1][0]);
	return gpx;
};

Settings_jqUI.prototype.getThemes = function () {
	var themes =
		'<div id="ThemeSwitcher">' +
		'	<label for="selTheme" class="gctour-label ui-widget-header ui-corner-all" style="padding: .1em .5em;">' + $.gctour.lang("settingsSelectTheme") + '</label>' +
		'	<select id="selTheme" name="selTheme" class="ui-widget ui-corner-all">';
	var themeArray = ["black-tie", "blitzer", "cupertino", "dark-hive", "dot-luv", "eggplant",
		"excite-bike", "flick", "hot-sneaks", "humanity", "le-frog", "mint-choc", "overcast",
		"pepper-grinder", "redmond", "smoothness", "south-street", "start", "sunny", "swanky-purse",
		"trontastic", "ui-darkness", "ui-lightness", "vader"];
	$.each(themeArray, function (i, theme) {
		themes += '    <option value="' + theme + '">' + theme + '</option>';
	});
	themes +=
	'	</select>' +
	'</div>';
	return themes;
};

Settings_jqUI.prototype.show = function () {
	// jQuery UI new settings menu
	$(this.tabs).dialog($.gctour.dialog.info(), {
		title : $.gctour.lang('settings_caption'),
		width : '75%',
		maxHeight : $(window).height() - 20,
		resizable : false,
		dialogClass : 'gct_dialog',
		buttons : [{
				text : $.gctour.lang("close"),
				icons : {
					primary : "ui-icon-closethick"
				},
				click : function () {
					$(this).dialog("close");
				}
			}
		]
	});

	// different font size on new search page necessary
	if (document.URL.search("\/play\/search") >= 0) {
		var $elem = $("div.ui-widget");
		$elem.attr('style', $elem.attr('style') + ';' + 'font-size: 0.8em !important');
	}

	// tabs menu
	$("div#tabs").tabs({
		heightStyle : "content"
	});

	// pre-selections
	this.getCurrentSettings();
};

// pre-selection of current settings
Settings_jqUI.prototype.getCurrentSettings = function () {
	var thiz = this;

	// language
	$("select#selLang").change(function (e) {
		GM_setValue('language', $(this).val());
		window.location.reload();
	}).children("[value=" + GM_getValue('language', $.gctour.defaultLang) + "]").prop("selected", true);

	// printview
	var $radio = $('div#settingsLogCount input[type="radio"]'),
	$text = $('div#settingsLogCount input[type="text"]'),
	nLogs = GM_getValue('maxPrintLogs', 3);
	if (nLogs === 0) { // no logs
		$radio.eq(0).prop("checked", true);
	} else { // fixed number of logs
		$radio.eq(1).prop("checked", true);
		$text.prop("value", nLogs);
	}
	$radio.eq(0).click(function (e) {
		GM_setValue('maxPrintLogs', 0);
	});
	$radio.eq(1).click(function (e) {
		GM_setValue('maxPrintLogs', $text.prop("value"));
	});
	$text.click(function (e) {
		$radio.eq(1).prop("checked", true);
	});
	$text.keyup(function (e) {
		thiz.checkInput($(this), 'maxPrintLogs');
	});

	$("select#settingsFontSize").change(function (e) {
		GM_setValue('printFontSize', $(this).val());
	}).children("[value=" + GM_getValue('printFontSize', 'x-small') + "]").prop("selected", true);

	// maps
	$("select#settingsMapType").change(function (e) {
		GM_setValue('printOutlineMapType', $(this).val());
	}).children("[value=" + GM_getValue('printOutlineMapType', 'roadmap') + "]").prop("selected", true);

	$("select#settingsMapSize").change(function (e) {
		GM_setValue('defaultMapSize', $(this).val());
	}).children("[value=" + GM_getValue('defaultMapSize', 'large') + "]").prop("selected", true);

	// gpx
	var $text1 = $('div#maxLogCount input[type="text"]');
	$text1.prop("value", GM_getValue('maxGPXLogs', 10));
	$text1.keyup(function (e) {
		thiz.checkInput($(this), 'maxGPXLogs');
	});

	// themes
	$("select#selTheme").change(function (e) {
		addJqUiTheme($(this).val());
		GM_setValue('theme', $(this).val());
	}).children("[value=" + GM_getValue('theme', 'smoothness') + "]").prop("selected", true);

	// checkboxes
	settings_array = this.settings_printview_cb.concat(this.settings_map_cb).concat(this.settings_gpx_cb);
	var thiz = this;
	$("input.gct-ui-checkbox").each(function (i) {
		var item = settings_array[i];
		thiz.createCheckBox($(this), item[0], item[1], item[2]);
		// pre-selection	
		if (GM_getValue(item[1], item[2])) { // is checked
			$(this).prop('checked', true)
			.button("option", {
				icons : {
					primary : "ui-icon-check"
				}
			}).button("refresh");
		}
	});
	$("input.gct-ui-checkbox+label").css({
		'float' : 'right',
		'border-radius' : '3px',
		'width' : '1em',
		'height' : '1em',
		'vertical-align' : 'middle'
	});
};

// create checkboxes in jQuery UI style
Settings_jqUI.prototype.createCheckBox = function (elem, id, gmValue, dValue) {
	elem.attr({
		"id" : id
	})
	.prop({
		"type" : "checkbox",
		"checked" : false
	})
	.after($("<label>").attr({
			for  : id
	}))
.button({
	text : false
})
.click(function () {
	var isChecked = GM_getValue(gmValue, dValue);
	GM_setValue(gmValue, !isChecked); // toggle value
	$(this).button("option", {
		icons : {
			primary : !isChecked ? "ui-icon-check" : ""
		}
	})
});
};

// layout template for checkboxes
Settings_jqUI.prototype.cbLayout = function (setting) {
	return '<div style="border-bottom:1px solid;padding-bottom:10px;padding-top:10px">' +
	'  <input class="gct-ui-checkbox">' +
	'  <b>' + $.gctour.lang(setting) + '</b><br>' +
	$.gctour.lang(setting + "Desc") +
	'</div>'
};

// check for int values in input fields
Settings_jqUI.prototype.checkInput = function (elem, ident) {
	var value = elem.prop("value"),
	intOnly = new RegExp(/^\d+$/);
	if (intOnly.test(value)) {
		elem.css("backgroundColor", '');
		GM_setValue(ident, value);
	} else {
		elem.css("backgroundColor", '#ff7f7f');
	}
};

// adding a jQuery UI theme to the end of document's head section
function addJqUiTheme(theme) {
	var thmURL = "https://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/" + theme + "/jquery-ui.css",
	thmLink = $("<link>", {
			id : "gct-ui-theme-link",
			href : thmURL,
			rel : "stylesheet",
			type : "text/css"
		});
	$("head link#gct-ui-theme-link").remove(); // remove other theme(s) first
	$("head").append(thmLink);
}

/* autoTour */
// autoTour gui
function updateAutoTourMap(lat, lon) {

	//make the container visible
	$('#autoTourContainer').show();

	var radiusOrg = $.trim($("input#markerRadius").val());
	if (isNaN(radiusOrg) || radiusOrg == "") { // please break if radius is no number
		return;
	}

	var meterMiles = $("select#markerRadiusUnit").prop("selectedIndex");
	// 0: meter, 1: miles
	var radiusMiles = parseFloat(radiusOrg) * ((meterMiles == 1) ? 1 : 0.621371);

	if (radiusMiles == "") {
		return;
	}

	var staticGMap = $('div#staticGMap');
	staticGMap.html("");

	// create new static map with changed coordinates
	var SM = new StaticMap(staticGMap, {
			'lat' : lat,
			'lon' : lon,
			radius : radiusMiles,
			width : 570
		});

	var url = GS_HOST + "seek/nearest.aspx?lat=" + lat + "&lng=" + lon + "&dist=" + radiusMiles;
	log("url: " + url);

	$('b#markerCoordsPreview').empty().append(
		$("<a>", {
			href : url,
			title : url,
			text : new LatLon(lat, lon).toString()
		})
		.click(function () {
			window.open(this.href);
			return false;
		}));

	$('b#markerRadiusPreview').html(radiusOrg + " " + ((meterMiles == 1) ? "mi" : "km"));

	$("b#markerCoordsPreview, b#markerRadiusPreview")
	.css("background-color", "#FFE000")
	.animate({
		"background-color" : "transparent"
	}, 2000);

	// get how many caches are in this area

	loadingTime1 = new Date();

	getAsync(url, function (response) {
		var dummyDiv = $(response.responseText),
		color,
		pagesSpan = $("td.PageBuilderWidget", dummyDiv).first();

		if (pagesSpan.length > 0) {
			var cacheCount = $("b", pagesSpan).first().text(),
			pageCount = $("b", pagesSpan).last().text();

			color = "#FFE000";

			var miliseconds = new Date() - loadingTime1;
			var seconds = Math.floor((miliseconds * parseFloat(pageCount)) / 1000);
			seconds = seconds + parseFloat(pageCount) * 2;

			var secondsMod = seconds % 60;
			var minutes = (seconds - secondsMod) / 60;

			$("b#markerCountPreview").html(cacheCount);
			$("b#markerDurationMin").html(minutes);
			$("b#markerDurationSec").html(secondsMod);
		} else {
			$("b#markerCountPreview, b#markerDurationMin, b#markerDurationSec").html("0");
			color = "#FF0000";
		}

		$("b#markerCountPreview")
		.css("background-color", color)
		.animate({
			"background-color" : "transparent"
		}, 2000);
	});

	// last, save the values
	$('input#coordsDivLat').val(lat);
	$('input#coordsDivLon').val(lon);
	$('input#coordsDivRadius').val(radiusMiles);
	$('b#markerCountPreview, b#markerDurationMin, b#markerDurationSec').html("<img src='" + $.gctour.img.loader3 + "'>");

	// enable the startQuery button
	$('button#startQuery').removeAttr('disabled').css({
		"opacity" : 1,
		"cursor" : "pointer"
	});
}

function startAutoTour() {
	var i,
	typeFilter = {},
	sizeFilter = {},
	difficultyFilter = {},
	terrainFilter = {},
	specialFilter = {},
	ele = $("#autoTourContainer"),
	lat,
	lon,
	radius,
	url;

	ele.find("input[name='type']").each(function (index) {
		typeFilter[$(this).val()] = $(this).is(':checked');
	});

	ele.find("input[name='size']").each(function (index) {
		sizeFilter[$(this).val()] = $(this).is(':checked');
	});

	ele.find("input[name='Difficulty']").each(function (index) {
		difficultyFilter[$(this).val()] = $(this).is(':checked');
	});

	ele.find("input[name='Terrain']").each(function (index) {
		terrainFilter[$(this).val()] = $(this).is(':checked');
	});

	ele.find("input[name='special']").each(function (index) {
		specialFilter[$(this).val()] = $(this).is(':checked');
	});

	ele.find("select[id^='special_']").each(function (index) {
		var p = $(this).attr('id').replace("special_", "");
		specialFilter[p] = $(this).val();
	});

	specialFilter['minFavorites'] = ele.find("input[id='special_favorites']").val();

	lat = ele.find("input#coordsDivLat").val();
	lon = ele.find("input#coordsDivLon").val();
	radius = ele.find("input#coordsDivRadius").val();
	url = GS_HOST + "seek/nearest.aspx?lat=" + lat + "&lon=" + lon + "&dist=" + radius;

	if (specialFilter["I haven't found "]) {
		url += "&f=1";
	}

	specialFilter["minFavorites"] = specialFilter["minFavorites"] || 0;

	GM_setValue('tq_url', url);
	GM_setValue('tq_typeFilter', JSON.stringify(typeFilter));
	GM_setValue('tq_sizeFilter', JSON.stringify(sizeFilter));
	GM_setValue('tq_dFilter', JSON.stringify(difficultyFilter));
	GM_setValue('tq_tFilter', JSON.stringify(terrainFilter));
	GM_setValue('tq_specialFilter', JSON.stringify(specialFilter));
	GM_setValue('tq_StartUrl', document.location.href);

	debug("fn startAutoTour GM_setValue: " +
		"\n\tq_url:" + url +
		"\n\tq_typeFilter:" + JSON.stringify(typeFilter) +
		"\n\tq_sizeFilter:" + JSON.stringify(sizeFilter) +
		"\n\tq_dFilter:" + JSON.stringify(difficultyFilter) +
		"\n\tq_tFilter:" + JSON.stringify(terrainFilter) +
		"\n\tq_specialFilter:" + JSON.stringify(specialFilter) +
		"\n\tq_StartUrl:" + document.location.href);

	document.location.href = url;
}

function getMarkerCoord() {
	var markerCoords = $("input#markerCoords").val();
	var coords = parseCoordinates(markerCoords, true);
	if (coords) {
		updateAutoTourMap(coords._lat, coords._lon);
	} else { // Sehr seltener Fall wenn auch die google geolocate API versagt.
		alert("'" + markerCoords + "' is not an address!");
	}
}

function addCheckUncheckAllLinks($div) {
	var checkboxes = $div.find('input[type=checkbox]');
	$all_none = $('<span>')
		.append(
			$('<a style="cursor:pointer;">').html('<i>' + $.gctour.lang('settingsLogCountAll') + '</i>').click(function () {
				checkboxes.prop('checked', true);
			}))
		.append(' / ')
		.append(
			$('<a style="cursor:pointer;">').html('<i>' + $.gctour.lang('settingsLogCountNone') + '</i>').click(function () {
				checkboxes.prop('checked', false);
			}))
		.append($('<br>'));
	$all_none.insertBefore($div.find('span:first'));

	$div.find('a')
	.css({
		'color' : '#00447c',
		'text-decoration' : 'underline'
	})
	.hover(function () {
		$(this).css("color", "#6c8e10");
	}, function () {
		$(this).css("color", "#00447c");
	});
}

function getSpecialFilter() {
	var $div,
	$checkbox,
	$selectbox,
	$favorites,
	opt,
	attributs,
	select_specials = $.gctour.lang('autoTour.filter.special.pm'),
	checkbox_specials = {
		'I haven\'t found ' : $.gctour.lang('autoTour.filter.special.notfound'),
		'is Active' : $.gctour.lang('autoTour.filter.special.isActive')
	},
	initial = '{"I haven\'t found ":false,"is Active":false,"pm":"ignore","minFavorites":"0"}',
	tq_filter = JSON.parse(GM_getValue('tq_specialFilter', initial));

	// Beginn für Umstellung des Filters
	// => Kann bei übernächster Version wieder entfernt werden
	if (tq_filter["is not a PM cache"]) {
		tq_filter["pm"] = "not";
	}
	// End

	$div = $('<div>')
		.html("<b>" + $.gctour.lang('autoTour.filter.special.caption') + "</b><br/>")
		.css({
			"text-align" : "left",
			"padding-left" : "10px",
			"padding-right" : "10px",
			"float" : "left",
			"background-color" : "#ffe"
		});

	//begin PM
	$selectbox = $('<select/>', {
			id : "special_pm"
		})
		.css({
			"margin" : "0 0 6px 0",
			"width" : "150px"
		});

	$.each(select_specials, function (key, value) {
		opt = $('<option value="' + key + '">' + value + '</option>');
		if (tq_filter["pm"] == key) {
			opt.prop('selected', true);
		}
		$selectbox.append(opt);
	});

	$div.append(
		$selectbox,
		$('<br>'));
	//end PM

	$.each(checkbox_specials, function (key, value) {

		attributs = {
			type : 'checkbox',
			name : "special",
			class : "gctour-input-checkbox",
			id : "special" + key,
			value : key,
			checked : tq_filter[key] ? 'checked' : false
		};

		$checkbox = $('<span>')
			.css({
				"margin" : "2px",
				"vertical-align" : "middle"
			})
			.append(
				$('<input/>', attributs).css({
					"margin" : "0 4px 0 0"
				}),
				$('<label>')
				.attr({
					"for" : "special" + key,
					"class" : "gctour-label"
				})
				.text(value));

		$div.append(
			$checkbox,
			$('<br>'));

	});

	$favorites = $('<input>', {
			type : 'text',
			id : 'special_favorites',
			class : 'gctour-input-text',
			value : tq_filter['minFavorites']
		}).css({
			'margin' : '4px 0 0 4px',
			'width' : '40px'
		});

	$div.append(
		$('<span>').text($.gctour.lang('autoTour.filter.special.minFavorites')),
		$favorites,
		$('<br>'));

	return $div;
}

function getDtFiler(boxName) {
	var $div,
	$checkbox,
	attributs,
	tq_filter,
	initial = '{"1":true,"2":true,"3":true,"4":true,"5":true,"1.5":true,"2.5":true,"3.5":true,"4.5":true}',
	title;

	if (boxName == 'Difficulty') {
		tq_filter = JSON.parse(GM_getValue('tq_dFilter', initial));
		title = $.gctour.lang('autoTour.filter.difficulty');
	} else { // terrain
		tq_filter = JSON.parse(GM_getValue('tq_tFilter', initial));
		title = $.gctour.lang('autoTour.filter.terrain');
	}

	$div = $('<div>')
		.html("<b>" + title + "</b><br/>")
		.css({
			"text-align" : "left",
			"padding-left" : "10px",
			"padding-right" : "10px",
			"float" : "left",
			"background-color" : "#ffe"
		});

	for (var i = 1; i <= 5; i = i + 0.5) {

		attributs = {
			type : 'checkbox',
			name : boxName,
			class : "gctour-input-checkbox",
			id : boxName + "" + i,
			value : i,
			checked : tq_filter["" + i] ? 'checked' : false
		};

		$checkbox = $('<span>')
			.css({
				"margin" : "2px",
				"vertical-align" : "middle"
			})
			.append(
				$('<input/>', attributs).css({
					"margin" : "0 2px 0 0"
				}),
				$('<label>').attr({
					"for" : boxName + "" + i,
					"class" : "gctour-label"
				})
				.append(
					$('<img>').attr("src", GS_HOST + "images/stars/stars" + ("" + i).replace(/\./g, "_") + ".gif").css({
						"vertical-align" : "unset"
					})));

		$div.append(
			$checkbox,
			$('<br>'));

	}

	addCheckUncheckAllLinks($div);

	return $div;
}

function getSizeFilter() {
	var $div,
	$checkbox,
	attributs,
	initial = '{"micro":true,"small":true,"regular":true,"large":true,"other":true,"not_chosen":true,"virtual":true}',
	tq_filter = JSON.parse(GM_getValue('tq_sizeFilter', initial));

	$div = $('<div>')
		.html("<b>" + $.gctour.lang('autoTour.filter.size') + "</b><br/>")
		.css({
			"text-align" : "left",
			"padding-left" : "10px",
			"padding-right" : "10px",
			"float" : "left",
			"background-color" : "#ffe"
		});

	$.each(sizesArray, function (index, size) {

		attributs = {
			type : 'checkbox',
			name : "size",
			class : "gctour-input-checkbox",
			id : "size" + size.sizeTypeId,
			value : size.sizeTypeId,
			checked : tq_filter[size.sizeTypeId] ? 'checked' : false
		};

		$checkbox = $('<span>')
			.css({
				"margin" : "2px",
				"vertical-align" : "middle"
			})
			.append(
				$('<input/>', attributs).css({
					"margin" : "0 2px 0 0"
				}),
				$('<label>').attr({
					"for" : "size" + size.sizeTypeId,
					"class" : "gctour-label"
				})
				.append(
					$('<img>').attr("src", GS_HOST + 'images/icons/container/' + size.sizeTypeId + '.gif').css({
						"vertical-align" : "unset"
					})));

		$div.append(
			$checkbox,
			$('<br>'));

	});

	addCheckUncheckAllLinks($div);

	return $div;
}

function getTypeFilter() {
	var $div,
	$checkbox,
	attributs,
	boo,
	initial = '{"2":true,"3":true,"4":true,"5":true,"6":true,"8":true,"11":true,"13":true,"1858":true,"137":true,"453":true,"7005":true}',
	tq_filter = JSON.parse(GM_getValue('tq_typeFilter', initial));

	$div = $('<div>')
		.html("<b>" + $.gctour.lang('autoTour.filter.type') + "</b><br/>")
		.css({
			"text-align" : "left",
			"padding-left" : "10px",
			"padding-right" : "10px",
			"float" : "left",
			"background-color" : "#ffe"
		});

	wptArray_autoTour = wptArray.slice(0, -1); // omit Lost and Found Events (last entry)
	$.each(wptArray_autoTour, function (index, wpt) {

		attributs = {
			type : 'checkbox',
			name : "type",
			class : "gctour-input-checkbox",
			id : "type" + wpt.wptTypeId,
			value : wpt.wptTypeId,
			checked : tq_filter[wpt.wptTypeId] ? 'checked' : false
		};

		boo = ((index + 1) % 2 === 0); // letzter in seiner Spalte ?

		$checkbox = $('<span>')
			.css("padding-left", boo ? "10px" : "0px")
			.append(
				$('<input/>', attributs).css({
					"margin" : "0 2px 0 0"
				}),
				$('<label>').attr({
					"for" : "type" + wpt.wptTypeId,
					"class" : "gctour-label"
				})
				.append(
					$('<img>').attr("src", GS_HOST + GS_WPT_IMAGE_PATH + wpt.wptTypeId + '.gif').css({
						"vertical-align" : "unset"
					})));

		$div.append(
			$checkbox,
			(boo ? $('<br>') : ""));

	});

	addCheckUncheckAllLinks($div);

	return $div;
}

function getLocateMeButton() {
	var button = $("<button>", {
			css : {
				"margin-left" : 10,
				"font-size" : 12,
				"cursor" : "pointer"
			},
			html : "<img id='locateImage' src='" + $.gctour.img.locateMe + "'><span style='vertical-align:top;margin-left:3px;'>" + $.gctour.lang('findMe') + "</span>"
		})

		.click(function () {
			if (navigator.geolocation) {
				$('locateImage').attr("src", $.gctour.img.loader3);
				navigator.geolocation.getCurrentPosition(
					function (position) {
					$('locateImage').attr("src", $.gctour.img.locateMe);
					var latitude = position.coords.latitude;
					var longitude = position.coords.longitude;

					$("input#markerCoords").val(new LatLon(latitude, longitude).toString());
					$("input#markerRadius").val(2);
					getMarkerCoord();
				},

					function (error) {
					$('locateImage').attr("src", $.gctour.img.locateMe);
					log('Unable to get current location: ' + error);
				}, {
					timeout : 10000
				});
			} else {
				alert("Firefox 3.5? Please update to use this!");
			}
		});

	return button;
}

function getCoordinatesTab() {
	var coordsDiv = $("<div>", {
			id : "coordsDiv",
			css : {
				"clear" : "both",
				"align" : "left"
			}
		});

	var findMeButton = getLocateMeButton();
	findMeButton.css("cssFloat", "right");
	coordsDiv.append(findMeButton);

	var divEbene = createElement('div', {
			className : 'ebene'
		});

	var placeholder = 'N51° 12.123 E010° 23.123';
	divEbene.innerHTML = '<b>' + $.gctour.lang('autoTour.center') + '</b>&nbsp;&nbsp;&nbsp;&nbsp;' +
		'<input type="text" id="markerCoords" class="gctour-input-text" style="width:350px;" placeholder="' + placeholder + '"><br/>' +
		'<small class="gctour-small">' + $.gctour.lang('autoTour.help') + '</small>';

	coordsDiv.append(divEbene);
	$("body").css("line-height", "1.5");

	divEbene = createElement('div', {
			className : 'ebene'
		});
	divEbene.innerHTML = '<b>' +
		$.gctour.lang('autoTour.radius') +
		'</b>&nbsp;&nbsp;&nbsp;&nbsp;' +
		'<input type="text" id="markerRadius" class="gctour-input-text" maxlength="4" value="2" style="width:40px;margin-right:5px;">' +
		'<select id="markerRadiusUnit">' +
		'<option value="km" selected="selected">' + $.gctour.lang('units.km') + '</option>' +
		'<option value="sm">' + $.gctour.lang('units.mi') + '</option>' +
		'</select>';
	coordsDiv.append(divEbene);

	divEbene = createElement('div');
	divEbene.setAttribute('class', 'dialogFooter');

	var useButton = createElement('input', {
			type : "button",
			value : $.gctour.lang('autoTour.refresh'),
			style : "background-image:url(" + $.gctour.img.autoTour + ");margin-top:-24px;"
		});
	append(useButton, divEbene);
	useButton.addEventListener('click', getMarkerCoord, false);

	coordsDiv.append(divEbene);

	return coordsDiv;
}

function getMapPreviewTab() {
	var coordsDiv = createElement('div');
	coordsDiv.align = "left";
	coordsDiv.style.clear = "both";

	var cordsInputLat = createElement('input', {
			type : 'hidden',
			id : "coordsDivLat"
		});
	coordsDiv.appendChild(cordsInputLat);

	var cordsInputLon = createElement('input', {
			type : 'hidden',
			id : "coordsDivLon"
		});
	coordsDiv.appendChild(cordsInputLon);

	var cordsInputRadius = createElement('input', {
			type : 'hidden',
			id : "coordsDivRadius"
		});
	coordsDiv.appendChild(cordsInputRadius);

	var coordsLabel = createElement('div');
	append(coordsLabel, coordsDiv);
	coordsLabel.innerHTML = $.gctour.lang('markerCoordinate') + ": <b id='markerCoordsPreview'>???</b>&nbsp;&nbsp;&nbsp;" + $.gctour.lang('autoTour.radius') + ": <b id='markerRadiusPreview'>???km</b>";

	// previewMap
	var staticGMap = createElement('div');
	staticGMap.id = 'staticGMap';

	//~ staticGMap.style.border = '2px solid gray';
	//~ staticGMap.style.backgroundImage = "url("+$.gctour.img.preview+")";
	//~ staticGMap.style.backgroundPosition = "center";
	//~ staticGMap.style.backgroundRepeat = "no-repeat";
	//~
	//~ staticGMap.style.height = '200px';
	//~ staticGMap.style.width = '400px';
	//~ staticGMap.style.backgroundRepeat = 'no-repeat';

	coordsDiv.appendChild(staticGMap);

	var cacheCountLabel = createElement('div');
	append(cacheCountLabel, coordsDiv);
	cacheCountLabel.innerHTML = $.gctour.lang('autoTour.cacheCounts') + " <b id='markerCountPreview'>???</b>";
	var tourDurationLabel = createElement('div');
	append(tourDurationLabel, coordsDiv);
	tourDurationLabel.innerHTML = $.gctour.lang('autoTour.duration') + " <b id='markerDurationMin'>???</b> min <b id='markerDurationSec'>???</b> sec";

	return coordsDiv;
}

function getAutoTourSubmit() {
	var $submit = $("<div>").append(
			$("<button>", {
				id : "startQuery",
				css : {
					"margin" : "15px 0 0 15px",
					"opacity" : "0.4"
				},
				"disabled" : "disabled",
				html : "<img src ='" + $.gctour.img.startAutoTour + "'>"
			})
			.on('click', startAutoTour));

	return $submit;
}

function showAutoTourDialog(center, radius) {
	var overLay = getOverlay({
			caption : '<b>' + $.gctour.lang('autoTour.title') + '</b>',
			minimized : true
		});

	$(overLay).append(
		getCoordinatesTab(),
		$("<div>", {
			id : "autoTourContainer",
			css : {
				"display" : "none",
				"clear" : "both",
				"border-top" : "2px dashed #B2D4F3",
				"margin-top" : 12
			}
		}).append(
			getMapPreviewTab(),
			$('<div>').append(
				getTypeFilter(),
				getSizeFilter(),
				getDtFiler('Difficulty'),
				getDtFiler('Terrain'),
				getSpecialFilter()),
			getAutoTourSubmit()));

	if (center && radius) {
		$("input#markerCoords").val(new LatLon(center.lat, center.lng).toString());
		$("input#markerRadius").val(radius);
	} else {
		$("input#markerRadius").val(2);
		// on cache page get center point from cache coordinates, else from profile settings
		if (!(latlon = $('span#uxLatLon').text()))
			latlon = getHoomeCoords();

		$('input#markerCoords')
		.val(latlon)
		.focus()
		.select();
	}
	getMarkerCoord();
}

// waypoint projection, earth approx. as sphere (now working in northern and southern hemisphere)
function CalcPrjWP(lat, lon, dist, angle) {
	var lat1 = parseFloat(lat), // degree
	lon1 = parseFloat(lon), // degree
	Dist = parseFloat(dist), // miles
	Angle = parseFloat(angle), // degree
	d,
	R,
	mile,
	lat2,
	lon2;
	while (Angle > 360) {
		Angle = Angle - 360;
	}
	while (Angle < 0) {
		Angle = Angle + 360;
	}

	// calculations in rad
	lat1 = lat1 / 180 * Math.PI;
	lon1 = lon1 / 180 * Math.PI;
	Angle = Angle / 180 * Math.PI;

	R = 6371.0; // mean earth radius in km
	mile = 1.609344;
	d = Dist * mile / R; // distance in km

	lat2 = Math.asin(Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(-Angle));
	if (Math.cos(lat1) == 0) {
		lon2 = lon1;
	} else {
		lon2 = (lon1 - Math.asin(Math.sin(-Angle) * Math.sin(d) / Math.cos(lat1)) + Math.PI) % (2 * Math.PI) - Math.PI;
	}
	// results in deg
	lat2 = lat2 / Math.PI * 180;
	lon2 = lon2 / Math.PI * 180;

	return [Math.round(lat2 * 100000) / 100000, Math.round(lon2 * 100000) / 100000];
}

// get home coordinates from profile settings
function getHoomeCoords() {
	var myUrl = GS_HOST + 'account/settings/homelocation',
	response_div;

	// get home coords
	var response = getSync(myUrl);
	response_div = createElement('div');
	response_div.innerHTML = response.responseText;

	homeCoords = $('input#Query', response_div).val();
	return homeCoords;
}

// update notifier for Gist repository
function update(force) {
	var updateURL = GM_info.scriptMetaStr.split('updateURL')[1].split('// @')[0].trim();
	var downloadURL = GM_info.scriptMetaStr.split('downloadURL')[1].split('// @')[0].trim();
	var updateDate = new Date(GM_getValue('updateDate'));
	if (!updateDate || updateDate == "Invalid Date") {
		updateDate = new Date();
		GM_setValue('updateDate', updateDate.toString());
	}

	var currentDate = new Date();
	// if the last updateDate is more than 86 400 000 msec (1 day) ago - check for updates
	if ((currentDate.getTime() - updateDate.getTime() > 86400000) || (force === true)) {
		// set the new updateDate
		GM_setValue('updateDate', currentDate.toString());

		var response = getSync(updateURL);

		var text = response.responseText;
		var ver_gist = text.split("version")[1].split("//")[0].trim();
		if (VERSION >= ver_gist) { // no update available
			log("update check: version " + VERSION + " is up to date");
			if (force === true) {
				alert($.gctour.lang('updateCurrently'));
			}
			return;
		}

		var overlayBody = getOverlay({
				caption : $.gctour.lang('dlg.newVersion.caption'),
				minimized : true
			});

		var updateMapping = [
			['VERSION_OLD', VERSION],
			['VERSION_NEW', ver_gist]
		];

		var confirmString = $.gctour.lang('updateDialog');
		var update_dom = fillTemplate(updateMapping, confirmString);
		var footer = update_dom.getElementsByTagName('div')[update_dom.getElementsByTagName('div').length - 1];

		// if install is pressed set the document.location to the update url
		var install_button = document.createElement('input');
		install_button.type = "button";
		install_button.value = $.gctour.lang('install');
		install_button.style.backgroundImage = "url(" + $.gctour.img.userscript + ")";
		install_button.addEventListener('click', function () {
			setTimeout(closeOverlay, 500);
			document.location = downloadURL;
		}, true);

		var close_button = document.createElement('input');
		close_button.type = "button";
		close_button.value = $.gctour.lang('cancel');
		close_button.style.backgroundImage = "url(" + $.gctour.img.closebutton + ")";
		close_button.addEventListener('click', closeOverlay, false);

		footer.appendChild(close_button);
		footer.appendChild(install_button);

		overlayBody.appendChild(update_dom);
	}
}

/*function parseUpdateXMLResponse(xmlString) {
var i,
j; // for
var updateNode;
var xmlDoc = (new DOMParser()).parseFromString(xmlString, "application/xml");
var string = '';

var scriptElements = xmlDoc.getElementsByTagName('script');

for (i = 0; i < scriptElements.length; i++) {
if (scriptElements[i].getAttribute('id') === SCRIPTID) {
var versions = scriptElements[i].getElementsByTagName('version');
var currentVersion = 0;
var currentVersionIndex;
for (j = 0; j < versions.length; j++) {
if (versions[j].getAttribute('number') > currentVersion) {
currentVersion = versions[j].getAttribute('number');
currentVersionIndex = j;
}
}

if (currentVersion > VERSION) {
updateNode = versions[currentVersionIndex];
}
}
}

if (updateNode) {
var confirmString = 'There is a new version of GcTour.\n\t' + VERSION + ' -> ' + updateNode.getAttribute('number') + '\nChanges:\n';

var changes = updateNode.getElementsByTagName('change');
for (j = 0; j < changes.length; j++) {
confirmString += '\t+ ' + changes[j].textContent + '\n';
}
confirmString += '\nDo you want to update?';
if (confirm(confirmString)) {
GM_openInTab(GCTOUR_HOST + 'gm/update.php?scriptId=' + SCRIPTID + '&fromVersion=' + VERSION + '&toVersion=' + updateNode.getAttribute('number'));
}
}
}*/

/* helper */
/*String.prototype.escapeHTML = function() { // useful snippet to escape HTML
return this.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}*/

/*String.prototype.hashCode = function(){ // setting hashcode to all strings
var hash = 0;
if (this.length === 0) { return code; }
for (i = 0; i < this.length; i++) {
character = this.charCodeAt(i);
hash = 31 * hash + character;
hash = hash & hash; // Convert to 32bit integer
}
return hash;
};*/

/*String.prototype.hashCode = function () {
for (var ret = 0, i = 0, len = this.length; i < len; i++) {
ret = (31 * ret + this.charCodeAt(i)) << 0;
}
return ret;
}*/

// Funktion, die in einem String die Wildcard {0},{1},{2}... mit den Paramtern von String.format ersetzt!
String.prototype.format = function () {
	var s = this;
	for (var i = 0; i < arguments.length; i++) {
		var reg = new RegExp("\\{" + i + "\\}", "gm");
		s = s.replace(reg, arguments[i]);
	}

	return s;
}

/*String.prototype.endsWith = function (suffix) {
return (this.substr(this.length - suffix.length) === suffix);
}*/

/*String.prototype.startsWith = function (prefix) {
return (this.substr(0, prefix.length) === prefix);
}*/

// Convert HTML breaks to spaces
String.prototype.br2space = function () {
	return this.replace(/<br\s*\/?>/mg, " ");
}

// Return a new string without leading and trailing whitespace
// Double spaces whithin the string are removed as well
String.prototype.trimAll = function () {
	return this.replace(/^\s+|(\s+(?!\S))/mg, "");
}

// replace all occurrences of str1 by str2 inside a string; optionally ignore case 
// 	(http://dumpsite.com/forum/index.php?topic=4.msg29#msg29)
String.prototype.replaceAll = function(str1, str2, ignoreCase) {
	return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignoreCase?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}

// wrapper function to write asynchronous code as it were synchronous!
// (see: http://www.html5rocks.com/en/tutorials/es6/promises/ , section "Promises and Generators")
//
// usage:
// spawn(function* () {
//	 var result = yield promise_function();
// }
//
function spawn(generatorFunc) {
	function continuer(verb, arg) {
		var result;
		try {
			result = generator[verb](arg);
		} catch (err) {
			return Promise.reject(err);
		}
		if (result.done) {
			return result.value;
		} else {
			return Promise.resolve(result.value).then(onFulfilled, onRejected);
		}
	}
	var generator = generatorFunc();
	var onFulfilled = continuer.bind(continuer, "next");
	var onRejected = continuer.bind(continuer, "throw");
	return onFulfilled();
}

/* start */
// main
(function () {
	// check for Chrome which is currently not supported
	if ($.browser.chrome) {
		var str = "'Chrome' wird leider aktuell von GCTour nicht unterstützt.<br>Um GCTour zu nutzen, bitte eine aktuelle Version von 'Firefox' verwenden.<br><br>" +
			"Sorry, but you are running 'Chrome' which is currently not supported by GCTour.<br>Please use 'Firefox' for GCTour.";
		$('<div>' + str + '</div>').dialog($.gctour.dialog.info());
		return;
	}

	// load time
	if (DEBUG_MODE && console && console.time) {
		console.time('GCTour load time');
	}

	// still necessary to check for Opera???
	if (isOpera) {
		// wait until document is loaded and init the core components (first tour, current tour)
		window.addEventListener('DOMContentLoaded', function () {
			initCore();
			init();
		}, true);
	} else {
		// init the core components (first tour, current tour) and check for script update
		initCore();
		init();

		// load time
		if (DEBUG_MODE && console && console.timeEnd) {
			console.timeEnd('GCTour load time');
		}

		update();
	}

})();
