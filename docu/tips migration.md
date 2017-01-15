## Tipps für die Migration vom "GC little helper" zum "GC little helper II"
<strong>1. Nach der Installation ist auf den Geocaching Seiten alles durcheinander:</strong><br>
Es darf immer nur ein Script zum "GC little helper" aktiviert sein, ansonsten gibt es ein großes Durcheinander auf den Geocaching Seiten. Im Greasemonkey Menü, oben rechts, kann man prüfen, welche Scripte gerade aktiv sind.<br><br>
<strong>2. Wie kann man den "GC little helper Config II" aufrufen:</strong><br>
Den "GC little helper Config II" gibt es wie gewohnt im <a href="http://www.geocaching.com/my/"><span style="text-decoration: underline">eigenen Profil</span></a> neben dem Avatar, im Greasemonkey Menü unter Benutzerscript-Befehle oder per F4 Taste auf den Geocaching Seiten. <br><br>
<strong>3. Konfiguration des "GC little helper" im "GC little helper II" zur Verfügung stellen:</strong><br>
Anstatt mit der Startkonfiguration des "GC little helper II" zu beginnen, kann man die Konfiguration des "GC little helper" exportieren und im "GC little helper II" wieder importieren.<br><br>
Die Vorgehensweise ist einfach: <br>
<ul>
<li>Aktiviert im Greasemonkey Menü den "GC little helper" und deaktiviert den "GC little helper II".</li>
<li>Geht ins <a href="http://www.geocaching.com/my/"><span style="text-decoration: underline">eigene Profil</span></a> und wählt im Greasemonkey Menü unter Benutzerscript-Befehle "little helper config sync" aus, wählt dort "Manual" und den Button "Export". Im Fenster dann mit rechter Maustaste "Alles markieren" und anschließend mit rechter Maustaste "kopieren" und dann Button "close". </li>
<li>Aktiviert nun im Greasemonkey Menü den "GC little helper II" und deaktiviert den "GC little helper".</li>
<li><a href="http://www.geocaching.com/my/" class="postlink"><span style="text-decoration: underline">Eigenes Profil</span></a> neu laden.</li>
<li>Wählt im eigenen Profil neben dem Avatar den "GClh Sync II" aus und wählt "Manual". Im Fenster dann mit rechter Maustaste "Einfügen" und anschließend den Button "import" wählen.</li>
</ul>
<br>Alternativ könnt ihr auch die Datei "...\gm_scripts\GC_little_helper.db" aus eurem Firefox Profil kopieren und in "...\gm_scripts\GC_little_helper_II.db" umbenennen, zuvor gegebenenfalls eine vorhandene Datei "...\gm_scripts\GC_little_helper_II.db" löschen. Firefox muß dazu geschlossen sein.<br><br>
Sollte irgendetwas schiefgehen oder möchte man mit der Startkonfiguration des "GC little helper II" neu beginnen, dann kann man die Datei "...\gm_scripts\GC_little_helper_II.db" löschen. Firefox muß dazu geschlossen sein. Beim nächsten Start einer Geocaching Seite wird dann die Startkonfiguration automatisch angelegt. <br><br>
<strong>4. Wie kann man die eigenen Systemdaten ermitteln:</strong><br>
Ermittlung Betriebssystem: Programm "msinfo32.exe" im Startmenü ausführen.<br>
Ermittlung Greasemonkey Version: Maus ungedrückt über das Äffchen stellen.<br>
Ermittlung Firefox Version: Menü "Hilfe / Über Firefox".</div>
Ermittlung Firefox Profil: 
<li>Im Firefox-Adressfeld "about:support" eingeben.</li>
<li>Bei "Allgemeinen Informationen / Profilordner" Button "Ordner anzeigen" wählen.</li>
<li>In Ordner "gm_scripts" befinden sich dann die .db Dateien.</li>
