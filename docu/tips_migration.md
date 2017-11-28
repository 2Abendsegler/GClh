<a href="#de" title=""><img src="../images/flag_de.png"></a> &nbsp;<a href="#en" title=""><img src="../images/flag_en.png"></a>

---
## <a id="de"></a>Tipps für die Migration
<br>

###  <a id="1"></a>1. Nach der Installation ist auf den Geocaching Seiten alles durcheinander oder doppelt:
Es darf immer nur ein Script zum "GC little helper" aktiviert sein, ansonsten gibt es ein großes Durcheinander auf den Geocaching Seiten. Im Greasemonkey Menü kann man prüfen, welche Scripte gerade aktiv sind.<br>
<br>

### <a id="2"></a>2. Wie kann man den "GC little helper Config II" aufrufen:
Den "GC little helper Config II" gibt es im <a href="http://www.geocaching.com/my/">eigenen Profil</a> neben dem Avatar, im Greasemonkey Menü unter Benutzerscript-Befehle oder per F4 Taste auf den Geocaching Seiten. <br>
<br>

### <a id="3"></a>3. Konfiguration des "GC little helper" im "GC little helper II" zur Verfügung stellen:
Anstatt mit der Startkonfiguration des "GC little helper II" zu beginnen, kann man die Konfiguration des "GC little helper" exportieren und im "GC little helper II" importieren.<br>
<ul>
<li>Aktiviert im Greasemonkey Menü den "GC little helper" und deaktiviert den "GC little helper II".</li>
<li>Geht ins <a href="http://www.geocaching.com/my/">eigene Profil</a> und wählt neben dem Avatar den "GClh Sync" aus, wählt dann "Manual" und den Button "export". Im Fenster dann mit rechter Maustaste "Alles markieren" und anschließend mit rechter Maustaste "kopieren" und dann Button "close". </li>
<li>Aktiviert nun im Greasemonkey Menü den "GC little helper II" und deaktiviert den "GC little helper".</li>
<li><a href="http://www.geocaching.com/my/">Eigenes Profil</a> neu laden.</li>
<li>Wählt im eigenen Profil neben dem Avatar den "GClh Sync II" aus und wählt "Manual". Im Fenster dann mit rechter Maustaste "Einfügen" und anschließend den Button "import" wählen.</li>
</ul>
<br>Alternativ könnt ihr auch die Datei "*...\gm_scripts\GC_little_helper.db*" aus eurem Firefox Profil kopieren und in "*...\gm_scripts\GC_little_helper_II.db*" umbenennen, zuvor gegebenenfalls eine vorhandene Datei "*...\gm_scripts\GC_little_helper_II.db*" löschen. Firefox muß dazu geschlossen sein.<br>
<br>
Sollte irgendetwas schiefgehen oder möchte man mit der Startkonfiguration des "GC little helper II" neu beginnen, dann kann man die Datei "*...\gm_scripts\GC_little_helper_II.db*" im Firefox Profil löschen. Firefox muß dazu geschlossen sein. Beim nächsten Start einer Geocaching Seite wird die Datei "*...\gm_scripts\GC_little_helper_II.db*" dann mit der Startkonfiguration automatisch angelegt. <br>
<br>

### <a id="4"></a>4. Wie kann man die eigenen Systemdaten ermitteln:
<ul>
<li>Ermittlung Betriebssystem: Programm "msinfo32.exe" im Startmenü ausführen.</li>
<li>Ermittlung Greasemonkey Version: Maus ungedrückt über das Äffchen stellen.</li>
<li>Ermittlung Firefox Version: Menü "Hilfe / Über Firefox".</li>
<li>Ermittlung Firefox Profil:<br>
<ul>
<li>Im Firefox-Adressfeld "about:support" eingeben.</li>
<li>Bei "Allgemeinen Informationen / Profilordner" den Button "Ordner anzeigen" wählen.<br>
Nun befindet man sich im Firefox Profil.</li>
<li>Im Ordner "*gm_scripts*" befinden sich dann beispielsweise die "*.db*" Dateien.</li>
</ul>
</li>
</ul>
<br>

### <a id="5"></a>5. Wie kann man den "GC little helper Sync II" aufrufen:
Den "GC little helper Sync II" gibt es im <a href="http://www.geocaching.com/my/">eigenen Profil</a> neben dem Avatar, im Greasemonkey Menü unter Benutzerscript-Befehle oder per F10 Taste auf den Geocaching Seiten. Falls gar nichts mehr geht, könnte noch folgender <a href="https://www.geocaching.com/geocache/GC40#GClhShowSync">Link</a> funktionieren.<br>
<br>

### <a id="6de"></a>6. Konfiguration des "GC little helper II" in Firefox von Greasemonkey nach Tampermonkey kopieren:
Die Konfiguration muß unbedingt vor den Upgrades auf Firefox 57 und Greasemonkey 4 kopiert werden, weil die dazu notwendige Funktionalität des GClhs mit diesen Upgrades nicht mehr funktioniert. Falls die Konfiguration nicht vorher kopiert wurde, ihr sie aber benötigt, dann meldet euch bitte per <a href="https://www.geocaching.com/email/?guid=7bb977ac-bc8d-45d9-ac63-99564937357a">Mail</a>.
<ul>
<li>Aktiviert Script-Manager Greasemonkey und deaktiviert Script-Manager Tampermonkey.</li>
<li>Geht ins <a href="http://www.geocaching.com/my/">eigene Profil</a> und wählt neben dem Avatar den "GClh Sync II" aus oder wählt alternativ folgenden <a href="https://www.geocaching.com/geocache/GC40#GClhShowSync">Link</a>.</li>
<li>Wählt dann "Manual" und den Button "export". Im Fenster dann mit rechter Maustaste "Alles markieren" und anschließend mit rechter Maustaste "kopieren" und dann Button "close".</li>
<li>Deaktiviert Script-Manager Greasemonkey und aktiviert Script-Manager Tampermonkey.</li>
<li>Geht ins <a href="http://www.geocaching.com/my/">eigene Profil</a> und wählt neben dem Avatar den "GClh Sync II" aus oder wählt alternativ folgenden <a href="https://www.geocaching.com/geocache/GC40#GClhShowSync">Link</a>.</li>
<li>Wählt dann "Manual". Im Fenster dann mit rechter Maustaste "Einfügen" und anschließend den Button "import" wählen.</li>
</ul>
<br>

---
## <a id="en"></a>Tips for migration
<br>

### <a id="6en"></a>6. Copy configuration of "GC little helper II" in Firefox from Greasemonkey to Tampermonkey:
The configuration must necessarily be copied before upgrading to Firefox 57 and Greasemonkey 4, because the necessary functionality of the GClh will no longer work with these upgrades. If the configuration has not been copied before, but you need it, then please call via <a href="https://www.geocaching.com/email/?guid=7bb977ac-bc8d-45d9-ac63-99564937357a">mail</a>.
<ul>
<li>Enable script manager Greasemonkey and disable script manager Tampermonkey.</li>
<li>Go into <a href="http://www.geocaching.com/my/">your own profile</a> and select next to the avatar the "GClh Sync II" or select alternatively the following <a href="https://www.geocaching.com/geocache/GC40#GClhShowSync">link</a>.</li>
<li>Then select "Manual" and the button "export". In the window then with the right mouse button "mark all" and then with right mouse button "copy" and then button "close".</li>
<li>Disable script manager Greasemonkey and enable script manager Tampermonkey.</li>
<li>Go into <a href="http://www.geocaching.com/my/">your own profile</a> and select next to the avatar the "GClh Sync II" or select alternatively the following <a href="https://www.geocaching.com/geocache/GC40#GClhShowSync">link</a>.</li>
<li>Then select "Manual". In the window then right-click "paste" and then select the button "import".</li>
</ul>
