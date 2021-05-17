<a href="#de" title=""><img src="../images/flag_de.png"></a> &nbsp;<a href="#en" title=""><img src="../images/flag_en.png"></a>

---
## <a id="de"></a>Tipps für die Migration
<br>

###  <a id="1de"></a>1. Nach der Installation ist auf den Geocaching Seiten alles durcheinander oder doppelt:
Es darf immer nur ein Script zum "GC little helper" aktiviert sein, ansonsten gibt es ein großes Durcheinander auf den Geocaching Seiten. Im Tampermonkey Menü kann man prüfen, welche Scripte gerade aktiv sind.<br>
<br>

### <a id="2de"></a>2. Wie kann man den "GC little helper Config II" aufrufen:
Einen Link zum "GC little helper Config II" gibt es im <a href="http://www.geocaching.com/my/">eigenen Dashboard</a> beim Avatar. Außerdem kann man ihn von allen Geocaching Seiten aus mit der Taste F4 aufrufen, sofern man diese Funktion nicht deaktiviert hat. <br>
<br>

### <a id="3de"></a>3. Konfiguration des "GC little helper" im "GC little helper II" zur Verfügung stellen:
Anstatt mit der Startkonfiguration des "GC little helper II" zu beginnen, kann man die Konfiguration des "GC little helper" exportieren und im "GC little helper II" importieren.<br>
<ul>
<li>Aktiviert im Tampermonkey Menü den "GC little helper" und deaktiviert den "GC little helper II".</li>
<li>Geht ins <a href="http://www.geocaching.com/my/">eigene Dashboard</a> und wählt beim Avatar den "GClh Sync" aus, wählt dann "Manual" und den Button "export". Im Fenster dann mit rechter Maustaste "Alles markieren" und anschließend mit rechter Maustaste "kopieren" und dann Button "close". </li>
<li>Aktiviert nun im Tampermonkey Menü den "GC little helper II" und deaktiviert den "GC little helper".</li>
<li><a href="http://www.geocaching.com/my/">Eigenes Dashboard</a> neu laden.</li>
<li>Wählt im eigenen Profil beim Avatar den "GClh Sync II" aus und wählt "Manual". Im Fenster dann mit rechter Maustaste "Einfügen" und anschließend den Button "import" wählen.</li>
</ul>
Sollte irgendetwas schiefgehen oder möchte man mit der Startkonfiguration des "GC little helper II" neu beginnen, kann man im Tampermonkey Menü die "Übersicht" wählen, dann auf "GC little helper II" klicken und anschließend oben den Reiter "Speicher" auswählen. Hier dann alles mit der Maus markieren und entfernen bis auf die beiden Klammern "{" und "}" und anschließend "Speichern" wählen. Beim nächsten Start einer Geocaching Seite wird dann die Startkonfiguration geladen. Es wird dann auch eine Meldung ausgegeben dass Version ... of  GC little helper II installiert wurde, weil in der Konfiguration auch eben diese Version hinterlegt war. Dieser Meldung muß keine Beachtung geschenkt werden.<br>
<br>

### <a id="4de"></a>4. Wie kann man die eigenen Systemdaten ermitteln:
<ul>
<li>Ermittlung Betriebssystem: Programm "msinfo32.exe" im Startmenü ausführen.</li>
<li>Ermittlung Tampermonkey Version: Im Tampermonkey Menü "Übersicht" wählen. Die Version finden man oben links.</li>
<li>Ermittlung Firefox Version: Menü "Hilfe / Über Firefox".</li>
</ul>
<br>

### <a id="5de"></a>5. Wie kann man den "GC little helper Sync II" aufrufen:
Einen Link zum "GC little helper Sync II" gibt es im <a href="http://www.geocaching.com/my/">eigenen Dashboard</a> beim Avatar. Außerdem kann man ihn von allen Geocaching Seiten aus mit der Taste F10 aufrufen, sofern man diese Funktion nicht deaktiviert hat. <br>
<br>

### <a id="6de"></a>6. Konfiguration des "GC little helper II" in Firefox von Greasemonkey nach Tampermonkey bzw. Violentmonkey kopieren:
Der GC little helper II ist ab Firefox Version 57 unter dem Scriptmanager Greasemonkey 4 nicht mehr lauffähig. Deshalb bitte den Scriptmanager [Tampermonkey](https://addons.mozilla.org/de/firefox/addon/tampermonkey/) oder [Violentmonkey](https://addons.mozilla.org/firefox/addon/violentmonkey/) installieren.<br>
<br>
Die Konfiguration muß unbedingt vor den Upgrades auf Firefox 57 und Greasemonkey 4 kopiert werden, weil die dazu notwendige Funktionalität des GClhs mit diesen Upgrades nicht mehr funktioniert.
<ul>
<li>Aktiviert Scriptmanager Greasemonkey und deaktiviert Scriptmanager Tampermonkey bzw. Violentmonkey.</li>
<li>Geht ins <a href="http://www.geocaching.com/my/">eigene Dashboard</a> und wählt beim Avatar den "GClh Sync II" aus oder wählt alternativ folgenden <a href="https://www.geocaching.com/geocache/GC40#GClhShowSync">Link</a>.</li>
<li>Wählt dann "Manual" und den Button "export". Im Fenster dann mit rechter Maustaste "Alles markieren" und anschließend mit rechter Maustaste "kopieren" und dann Button "close".</li>
<li>Deaktiviert Scriptmanager Greasemonkey und aktiviert Scriptmanager Tampermonkey bzw. Violentmonkey.</li>
<li>Geht ins <a href="http://www.geocaching.com/my/">eigene Dashboard</a> und wählt neben dem Avatar den "GClh Sync II" aus oder wählt alternativ folgenden <a href="https://www.geocaching.com/geocache/GC40#GClhShowSync">Link</a>.</li>
<li>Wählt dann "Manual". Im Fenster dann mit rechter Maustaste "Einfügen" und anschließend den Button "import" wählen.</li>
</ul>
<br>

---
## <a id="en"></a>Tips for migration
<br>

### <a id="6en"></a>6. Copy configuration of "GC little helper II" in Firefox from Greasemonkey to Tampermonkey or Violentmonkey:
The GC little helper II can not run from Firefox version 57 with script manager Greasemonkey 4. Therefore please install the script manager [Tampermonkey](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/) oder [Violentmonkey](https://addons.mozilla.org/firefox/addon/violentmonkey/).<br>
<br>
The configuration must necessarily be copied before upgrading to Firefox 57 and Greasemonkey 4, because the necessary functionality of the GClh will no longer work with these upgrades.
<ul>
<li>Enable script manager Greasemonkey and disable script manager Tampermonkey or Violentmonkey.</li>
<li>Go into <a href="http://www.geocaching.com/my/">your own dashboard</a> and select next to the avatar the "GClh Sync II" or select alternatively the following <a href="https://www.geocaching.com/geocache/GC40#GClhShowSync">link</a>.</li>
<li>Then select "Manual" and the button "export". In the window then with the right mouse button "mark all" and then with right mouse button "copy" and then button "close".</li>
<li>Disable script manager Greasemonkey and enable script manager Tampermonkey or Violentmonkey.</li>
<li>Go into <a href="http://www.geocaching.com/my/">your own dashboard</a> and select next to the avatar the "GClh Sync II" or select alternatively the following <a href="https://www.geocaching.com/geocache/GC40#GClhShowSync">link</a>.</li>
<li>Then select "Manual". In the window then right-click "paste" and then select the button "import".</li>
</ul>
