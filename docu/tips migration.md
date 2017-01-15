## Tipps für die Migration vom "GC little helper" zum "GC little helper II"
<br>
### 1. Nach der Installation ist auf den Geocaching Seiten alles durcheinander:
Es darf immer nur ein Script zum "GC little helper" aktiviert sein, ansonsten gibt es ein großes Durcheinander auf den Geocaching Seiten. Im Greasemonkey Menü kann man prüfen welche Scripte gerade aktiv sind.<br>
<br>
### 2. Wie kann man den "GC little helper Config II" aufrufen:
Den "GC little helper Config II" gibt es im <a href="http://www.geocaching.com/my/">eigenen Profil</a> neben dem Avatar, im Greasemonkey Menü unter Benutzerscript-Befehle oder per F4 Taste auf den Geocaching Seiten. <br>
<br>
### 3. Konfiguration des "GC little helper" im "GC little helper II" zur Verfügung stellen:
Anstatt mit der Startkonfiguration des "GC little helper II" zu beginnen, kann man die Konfiguration des "GC little helper" exportieren und im "GC little helper II" importieren.<br>
<ul>
<li>Aktiviert im Greasemonkey Menü den "GC little helper" und deaktiviert den "GC little helper II".</li>
<li>Geht ins <a href="http://www.geocaching.com/my/">eigene Profil</a> und wählt im Greasemonkey Menü unter Benutzerscript-Befehle den "little helper config sync" aus, wählt dort "Manual" und den Button "Export". Im Fenster dann mit rechter Maustaste "Alles markieren" und anschließend mit rechter Maustaste "kopieren" und dann Button "close". </li>
<li>Aktiviert nun im Greasemonkey Menü den "GC little helper II" und deaktiviert den "GC little helper".</li>
<li><a href="http://www.geocaching.com/my/">Eigenes Profil</a> neu laden.</li>
<li>Wählt im eigenen Profil neben dem Avatar den "GClh Sync II" aus und wählt "Manual". Im Fenster dann mit rechter Maustaste "Einfügen" und anschließend den Button "import" wählen.</li>
</ul>
<br>Alternativ könnt ihr auch die Datei "...\gm_scripts\GC_little_helper.db" aus eurem Firefox Profil kopieren und in "...\gm_scripts\GC_little_helper_II.db" umbenennen, zuvor gegebenenfalls eine vorhandene Datei "...\gm_scripts\GC_little_helper_II.db" löschen. Firefox muß dazu geschlossen sein.<br>
<br>
Sollte irgendetwas schiefgehen oder möchte man mit der Startkonfiguration des "GC little helper II" neu beginnen, dann kann man die Datei "...\gm_scripts\GC_little_helper_II.db" im Firefox Profil löschen. Firefox muß dazu geschlossen sein. Beim nächsten Start einer Geocaching Seite wird dann die Datei "...\gm_scripts\GC_little_helper_II.db" mit der Startkonfiguration automatisch angelegt. <br>
<br>
### 4. Wie kann man die eigenen Systemdaten ermitteln:
<ul>
<li>Ermittlung Betriebssystem: Programm "msinfo32.exe" im Startmenü ausführen.</li>
<li>Ermittlung Greasemonkey Version: Maus ungedrückt über das Äffchen stellen.</li>
<li>Ermittlung Firefox Version: Menü "Hilfe / Über Firefox".</li>
<li>Ermittlung Firefox Profil:<br>
<ul>
<li>Im Firefox-Adressfeld "about:support" eingeben.</li>
<li>Bei "Allgemeinen Informationen / Profilordner" den Button "Ordner anzeigen" wählen.</li>
<li>Im Ordner "gm_scripts" befinden sich dann die ".db" Dateien.</li>
</ul></li>
