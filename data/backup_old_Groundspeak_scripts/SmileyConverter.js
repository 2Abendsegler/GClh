var SmileyConvert = function() {
    var escape = function(str) {
        return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };

    var smileys = {};
    smileys["[:(!]"] = "<img src=\"/images/icons/icon_smile_angry.gif\" border=\"0\" align=\"middle\">";
    smileys["[B)]"] = "<img src=\"/images/icons/icon_smile_blackeye.gif\" border=\"0\" align=\"middle\">";
    smileys["[XX(]"] = "<img src=\"/images/icons/icon_smile_dead.gif\" border=\"0\" align=\"middle\">";
    smileys["[:I]"] = "<img src=\"/images/icons/icon_smile_blush.gif\" border=\"0\" align=\"middle\">";
    smileys["[:(]"] = "<img src=\"/images/icons/icon_smile_sad.gif\" border=\"0\" align=\"middle\">";
    smileys["[:O]"] = "<img src=\"/images/icons/icon_smile_shock.gif\" border=\"0\" align=\"middle\">";
    smileys["[:0]"] = "<img src=\"/images/icons/icon_smile_shock.gif\" border=\"0\" align=\"middle\">";
    smileys["[|)]"] = "<img src=\"/images/icons/icon_smile_sleepy.gif\" border=\"0\" align=\"middle\">";
    smileys["[:)]"] = "<img src=\"/images/icons/icon_smile.gif\" border=\"0\" align=\"middle\">";
    smileys["[:D]"] = "<img src=\"/images/icons/icon_smile_big.gif\" border=\"0\" align=\"middle\">";
    smileys["[}:)]"] = "<img src=\"/images/icons/icon_smile_evil.gif\" border=\"0\" align=\"middle\">";
    smileys["[:O)]"] = "<img src=\"/images/icons/icon_smile_clown.gif\" border=\"0\" align=\"middle\">";
    smileys["[:0)]"] = "<img src=\"/images/icons/icon_smile_clown.gif\" border=\"0\" align=\"middle\">";
    smileys["[8)]"] = "<img src=\"/images/icons/icon_smile_shy.gif\" border=\"0\" align=\"middle\">";
    smileys["[8D]"] = "<img src=\"/images/icons/icon_smile_cool.gif\" border=\"0\" align=\"middle\">";
    smileys["[:P]"] = "<img src=\"/images/icons/icon_smile_tongue.gif\" border=\"0\" align=\"middle\">";
    smileys["[;)]"] = "<img src=\"/images/icons/icon_smile_wink.gif\" border=\"0\" align=\"middle\">";
    smileys["[8]"] = "<img src=\"/images/icons/icon_smile_8ball.gif\" border=\"0\" align=\"middle\">";
    smileys["[?]"] = "<img src=\"/images/icons/icon_smile_question.gif\" border=\"0\" align=\"middle\">";
    smileys["[^]"] = "<img src=\"/images/icons/icon_smile_approve.gif\" border=\"0\" align=\"middle\">";
    smileys["[V]"] = "<img src=\"/images/icons/icon_smile_dissapprove.gif\" border=\"0\" align=\"middle\">";
    smileys["[:X]"] = "<img src=\"/images/icons/icon_smile_kisses.gif\" border=\"0\" align=\"middle\">";

    var smileysEscaped = [];
    for (var smiley in smileys) {
        if (smileys.hasOwnProperty(smiley)) {
            smileysEscaped.push(escape(smiley));
        }
    }

    var regexGlobal = new RegExp("(" + smileysEscaped.join("|") + ")", "gi");

    return (function(input) {
        return input.replace(regexGlobal, function(matched) {
            var replacement = smileys[matched.toUpperCase()];
            // if it can't find the replacement, the smiley property must be uppercased above ^
            return replacement ? replacement : matched;
        });
    });
};
 