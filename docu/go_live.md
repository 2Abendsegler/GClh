
## <a id="de"></a>Go live Dokumentation:

####  <a id="1de"></a>1. Prüfen ob alle Issues gemäß Milestones enthalten sind.

####  <a id="2de"></a>2. Alle Änderungen in branch collector transportieren und testen.

####  <a id="3de"></a>3. Changelog.md für neue Version erzeugen

####  <a id="4de"></a>4. Temporäres Coding xxxx und console.log im Coding entfernen.

####  <a id="5de"></a>5. $$ im Coding prüfen und gegebenenfalls ändern:

<ul><li>$$000 Versionierung.</li>
<li>$$001 Bei neuer Hauptversion Opacity überall um eine Zeile weiter nach unten reichen und letzte nach oben. Das jeweils für ...On1 bis 3 und ...LL1 bis 3.</li>
<li>$$002 Wenn für neue Version neue Counter Auswertung erfolgen soll, müssen die Counter zurückgesetzt werden. Die Flagcounter müssen ausgetauscht werden.
<ul><li>Zählt alle Installationen: 
Counter: http://c.andyhoppe.com/1485103563
Info: http://c.andyhoppe.com/1485103563?output=static#InstallAlle</li>
<li>Zählt Installation je Adresse nur einmal: 
Counter: http://c.andyhoppe.com/1485234890
Info: http://c.andyhoppe.com/1485234890?output=static#InstallEinmal
<li>Zählt Installation je Adresse nur einmal innerhalb von 8 Stunden: Reset setzt 8 Stunden nicht zurück, deshalb im Wechsel austauschen.
Flagcounter 1, zuletzt v0.9
Counter: https://s07.flagcounter.com/countxl/mHeY ...
Info: http://info.flagcounter.com/mHeY
Passwort: 99737
Flagcounter 2, zuletzt v0.9.1
Counter: https://s09.flagcounter.com/count2/Mf9D ...
Info: http://info.flagcounter.com/Mf9D
Passwort: 99473</li>
<li>Zählt alle Installationen: Kein Reset möglich, also immer neuen Counter machen. v0.9.1
Counter: https://www.worldflagcounter.com/dCV
Info: https://www.worldflagcounter.com/details/dCV</li></ul></li>
<li>$$003 Temporärer Austausch der Vollzugsmeldung mit Hinweis auf Notwendigkeit von Tampermonkey. Kann irgendwann raus.</li>
<li>$$004 Beachten, dass neue Config Parameter sehr wahrscheinlich in der Standardkonfiguration aufgenommen werden müssen. Sie dient bei einem Reset für eine korrekte Konfiguration, ohne die Arbeitsdaten zu entfernen. Entfernte Config Parameter sollten auch in der Standardkonfiguration entfernt werden. 
https://raw.githubusercontent.com/2Abendsegler/GClh/master/data/config_standard.txt</li>
<li>$$005 Beachten, dass neue Config Parameter vielleicht eine neue Ausnahmeregeln hervorrufen, die in function rcConfigDataNotInUseDel aufgenommen werden muß.</li></ul>
<br>

####  <a id="6de"></a>6. Auf GitHub lokales Backup collector erzeugen.
<br>

####  <a id="7de"></a>7. Auf Master transportieren.
Es kann einige Minuten dauern, bis die neue Version auf dem RAW Link angekommen ist.
<br>

####  <a id="8de"></a>8. Forumsbeitrag für neue Version:

Bisher in folgenden Foren:
- Geoclub: http://geoclub.de/forum/viewforum.php?f=117
- Groundspeak Forum: https://forums.geocaching.com/GC/index.php?/topic/343005-gc-little-helper-ii/
- Swissgeocacheforum: http://www.swissgeocacheforum.ch/forum/topic/12872-gc-little-helper-ii/

GC little helper II (v0.9)

Die neue Version 0.9 zum GC little helper II steht [url=https://github.com/2Abendsegler/GClh/raw/master/gc_little_helper_II.user.js]hier[/url] zur Verfügung. Sie kommt auch per automatischem Update. 

Details zu den Anpassungen gibt es wie immer im [url=https://github.com/2Abendsegler/GClh/blob/master/docu/changelog.md#readme]Changelog[/url].

Liebe Grüße


