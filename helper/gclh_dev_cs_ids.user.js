// ==UserScript==
// @name             GC little helper II Countries/States Ids
// @namespace        http://www.amshove.net
// @version          0.0.1
// @include          http*://www.geocaching.com/pocket/gcquery.aspx*
// @require          http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @require          https://raw.githubusercontent.com/2Abendsegler/GClh/master/data/gclh_defi.js
// @connect          raw.githubusercontent.com
// @description      Development Helper to get country and state list from PQ page
// @copyright        2018 CachingFoX
// @author           CachingFoX
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
    quitOnAdFrames()
        .then(function() {return jqueryInit(c);})
        .then(function() {return constInit(c);})
        .done(function() {
            abc();
            // xyz();
        });
};

function abc() { // output Excel-compatible csv, sorted by id
    var code=""; 
    $("#ctl00_ContentBody_lbCountries").append('<option value="2">United States</option>');
    $("#ctl00_ContentBody_lbCountries").append('<option value="1">Unknown</option>');
    
    
    $("#ctl00_ContentBody_lbCountries").append($("#ctl00_ContentBody_lbCountries option").remove().sort(function(a, b) {
        var at = parseInt($(a).val()), bt = parseInt($(b).val());
        return (at > bt)?1:((at < bt)?-1:0);
    }));
    
    
    $("#ctl00_ContentBody_lbCountries option").each(function() {
        if (code != '') {
            code += '\n';
        }                
        code += $(this).val()+';'+$(this).text()+'';
    });
    $("#ctl00_ContentBody_lbCountries").after('<pre>'+code+'</pre>');            
   
    code="";   
    $("#ctl00_ContentBody_lbStates").append($("#ctl00_ContentBody_lbStates option").remove().sort(function(a, b) {
        var at = parseInt($(a).val()), bt = parseInt($(b).val());
        return (at > bt)?1:((at < bt)?-1:0);
    }));
    
    $("#ctl00_ContentBody_lbStates option").each(function() {
        if (code != '') {
            code += '\n';
        }
        code += $(this).val()+';'+$(this).text()+'';
    });
    $("#ctl00_ContentBody_lbStates").after('<pre>'+code+'</pre>');    
}

function xyz() { // output json object, sorted by country/state name
    var code=""; 
    $("#ctl00_ContentBody_lbCountries").append('<option value="2">United States</option>');
    $("#ctl00_ContentBody_lbCountries").append('<option value="1">Unknown</option>');
    
    
    $("#ctl00_ContentBody_lbCountries").append($("#ctl00_ContentBody_lbCountries option").remove().sort(function(a, b) {
        var at = $(a).text(), bt = $(b).text();
        return at.localeCompare(bt); // (at > bt)?1:((at < bt)?-1:0);
    }));
    
    
    $("#ctl00_ContentBody_lbCountries option").each(function() {
        if (code != '') {
            code += ',\n';
        }                
        code += '        {"n":"'+$(this).text()+'","id":"'+$(this).val()+'"}';
    });
    $("#ctl00_ContentBody_lbCountries").after("<pre>function country_idInit(c) {\n    c.country_id = [\n"+code+'\n    ];\n}</pre>');            
   
    code="";   
    $("#ctl00_ContentBody_lbStates").append($("#ctl00_ContentBody_lbStates option").remove().sort(function(a, b) {
        var at = $(a).text(), bt = $(b).text();
        return at.localeCompare(bt); // (at > bt)?1:((at < bt)?-1:0);
    }));    
    $("#ctl00_ContentBody_lbStates option").each(function() {
        if (code != '') {
            code += ',\n';
        }
        code += '        {"n":"'+$(this).text()+'","id":"'+$(this).val()+'"}';
    });
    $("#ctl00_ContentBody_lbStates").after("<pre>function states_idInit(c) {\n    c.states_id = [\n"+code+'\n    ];\n}</pre>');    
}


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

var constInit = function(c) {
    var constInitDeref = new jQuery.Deferred();

    country_idInit(c);
    states_idInit(c);
    
    constInitDeref.resolve();
    return constInitDeref.promise();
};

start(this);
