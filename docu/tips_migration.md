<a href="#6de" title=""><img src="../images/flag_de.png"></a> &nbsp;<a href="#6en" title=""><img src="../images/flag_en.png"></a>

## Tipps für die Migration
<br>

### 1. Nach der Installation ist auf den Geocaching Seiten alles durcheinander oder doppelt: <a id="1"></a>
Es darf immer nur ein Script zum "GC little helper" aktiviert sein, ansonsten gibt es ein großes Durcheinander auf den Geocaching Seiten. Im Greasemonkey Menü kann man prüfen, welche Scripte gerade aktiv sind.<br>
<br>

### 2. Wie kann man den "GC little helper Config II" aufrufen:<a id="2"></a>
Den "GC little helper Config II" gibt es im <a href="http://www.geocaching.com/my/">eigenen Profil</a> neben dem Avatar, im Greasemonkey Menü unter Benutzerscript-Befehle oder per F4 Taste auf den Geocaching Seiten. <br>
<br>

### 3. Konfiguration des "GC little helper" im "GC little helper II" zur Verfügung stellen:<a id="3"></a>
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

### 4. Wie kann man die eigenen Systemdaten ermitteln:<a id="4"></a>
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

### 5. Wie kann man den "GC little helper Sync II" aufrufen:<a id="5"></a>
Den "GC little helper Sync II" gibt es im <a href="http://www.geocaching.com/my/">eigenen Profil</a> neben dem Avatar, im Greasemonkey Menü unter Benutzerscript-Befehle oder per F10 Taste auf den Geocaching Seiten. Falls gar nichts mehr geht, könnte noch folgender <a href="https://www.geocaching.com/geocache/GC40#GClhShowSync">Link</a> funktionieren.<br>
<br>
<br>


<br>
### 6.<a id="6de"></a> Konfiguration des "GC little helper II" in Firefox von Greasemonkey nach Tampermonkey kopieren:
Die Konfiguration sollte unbedingt vor den Upgrades auf Firefox 57 und Greasemonkey 4 kopiert werden, weil nicht sichergestellt ist, dass die dazu notwendige Funktionalität des GClhs mit diesen Upgrades noch funktioniert.   
<ul>
<li>Aktiviert Script-Manager Greasemonkey und deaktiviert Script-Manager Tampermonkey.</li>
<li>Geht ins <a href="http://www.geocaching.com/my/">eigene Profil</a> und wählt neben dem Avatar den "GClh Sync II" aus oder wählt alternativ folgenden <a href="https://www.geocaching.com/geocache/GC40#GClhShowSync">Link</a>.</li>
<li>Wählt dann "Manual" und den Button "export". Im Fenster dann mit rechter Maustaste "Alles markieren" und anschließend mit rechter Maustaste "kopieren" und dann Button "close".</li>
<li>Deaktiviert Script-Manager Greasemonkey und aktiviert Script-Manager Tampermonkey.</li>
<li>Geht ins <a href="http://www.geocaching.com/my/">eigene Profil</a> und wählt neben dem Avatar den "GClh Sync II" aus oder wählt alternativ folgenden <a href="https://www.geocaching.com/geocache/GC40#GClhShowSync">Link</a>.</li>
<li>Wählt dann "Manual". Im Fenster dann mit rechter Maustaste "Einfügen" und anschließend den Button "import" wählen.</li>
</ul>
<br>

### 6.<a id="6en"></a> Copy configuration of "GC little helper II" in Firefox from Greasemonkey to Tampermonkey:
The configuration should necessarily be copied before upgrading to Firefox 57 and Greasemonkey 4, because it is not certain that the necessary functionality of the GClh will still work with these upgrades.   
<ul>
<li>Enable script manager Greasemonkey and disable script manager Tampermonkey.</li>
<li>Go into <a href="http://www.geocaching.com/my/">your own profile</a> and select next to the avatar the "GClh Sync II" or select alternatively the following <a href="https://www.geocaching.com/geocache/GC40#GClhShowSync">link</a>.</li>
<li>Then select "Manual" and the button "export". In the window then with the right mouse button "mark all" and then with right mouse button "copy" and then button "close".</li>
<li>Disable script manager Greasemonkey and enable script manager Tampermonkey.</li>
<li>Go into <a href="http://www.geocaching.com/my/">your own profile</a> and select next to the avatar the "GClh Sync II" or select alternatively the following <a href="https://www.geocaching.com/geocache/GC40#GClhShowSync">link</a>.</li>
<li>Then select "Manual". In the window then right-click "paste" and then select the button "import".</li>
</ul>
