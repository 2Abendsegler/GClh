
## <a id="de"></a>Go live Dokumentation:

####  <a id="1de"></a>1. Prüfen ob alle Issues gemäß Milestones enthalten sind.

####  <a id="2de"></a>2. Alle Änderungen in branch collector transportieren und testen.

####  <a id="3de"></a>3. changelog.md für neue Version erzeugen.

####  <a id="4de"></a>4. Temporäres Coding entfernen.

####  <a id="5de"></a>5. $$ im Coding prüfen und gegebenenfalls ändern.

<ul><li>$$000<br>
Version setzen.</li>
<li>$$001<br>
Bei neuer Hauptversion Opacity überall um eine Zeile weiter nach unten reichen und letzte nach oben.<br>
Das jeweils für ...On1 bis 3 und ...LL1 bis 3.</li>
<li>$$002<br>
Wenn für neue Version neue Counter Auswertung erfolgen soll, müssen die Counter bearbeitet werden.<br>
X vor dem Counter Link verhindert das Auswählen.<br>
<ul><li>Zählt alle Installationen:<br>
Maßnahme: <a href="http://www.andyhoppe.com/counter/counter-konfiguration.htm">Counter zurücksetzen</a> (eifra)<br>
Counter: Xhttp://c.andyhoppe.com/1485103563<br>
Auswertung: http://c.andyhoppe.com/1485103563?output=static#InstallAlle<br>
<li>Zählt Installation je Adresse nur einmal:<br>
Maßnahme: <a href="http://www.andyhoppe.com/counter/counter-konfiguration.htm">Counter zurücksetzen</a> (eifra)<br>
Counter: Xhttp://c.andyhoppe.com/1485234890<br>
Auswertung: http://c.andyhoppe.com/1485234890?output=static#InstallEinmal<br>
<li>Zählt Installation je Adresse nur einmal innerhalb von 8 Stunden: <br>
Reset setzt 8 Stunden nicht zurück, deshalb Flagcounter 1 und 2 abwechselnd verwenden.<br>
Maßnahme: Counter zurücksetzen über Auswertung.<br>
<ul><li>Flagcounter 1:<br>
Counter: Xhttps://s07.flagcounter.com/countxl/mHeY ...<br>
Auswertung: http://info.flagcounter.com/mHeY (99737)<br>
<li>Flagcounter 2:<br>
Counter: Xhttps://s09.flagcounter.com/count2/Mf9D ...<br>
Auswertung: http://info.flagcounter.com/Mf9D (99473)</li></ul>
<li>Zählt alle Installationen:<br>
Kein Reset möglich, also immer neuen Counter erzeugen.<br>
Counter: Xwww.worldflagcounter.com/dCV<br>
Auswertung: https://www.worldflagcounter.com/details/dCV</li></ul>
<li>$$003<br>
Temporärer Austausch der Vollzugsmeldung mit Hinweis auf Notwendigkeit von Tampermonkey. Kann irgendwann raus.</li>
<li>$$004<br>
Beachten, dass neue Config Parameter sehr wahrscheinlich in der Standardkonfiguration aufgenommen werden müssen. Sie dient bei einem Reset für eine korrekte Konfiguration, ohne die Arbeitsdaten zu entfernen. Entfernte Config Parameter sollten auch in der Standardkonfiguration entfernt werden.<br>
https://raw.githubusercontent.com/2Abendsegler/GClh/master/data/config_standard.txt</li>
<li>$$005 Beachten, dass neue Config Parameter vielleicht eine neue Ausnahmeregeln hervorrufen, die in function rcConfigDataNotInUseDel aufgenommen werden muß.</li></ul>
<li>$$006 Hier werden die Contributers und Bugreporter eingetragen. Sollte jemand neues einen Bug gemeldet/gefixt haben, dann ihn hier noch hinzufügen.</li>

####  <a id="6de"></a>6. Auf branch master transportieren.
Es kann einige Minuten dauern, bis die neue Version auf dem RAW Link angekommen ist.

####  <a id="7de"></a>7. Für branch master ein neues Release erzeugen
Folgendes Vorgehen ist empfehlenswert:
<ul>
	<li>Code => release => Draft a new release</li>
	<li>Tag Version: Aktuelle Version, zum Beispiel v0.9.13</li>
	<li>Target: Master</li>
	<li>Release Title: Aktuelle Version, zum Beispiel v0.9.13</li>
	<li>Description kann leer bleiben, da wir unser Changelog haben</li>
</ul>

####  <a id="8de"></a>8. Forumsbeitrag für neue Version.

Bisher in folgenden Foren:
<ul><li>Geoclub: http://geoclub.de/forum/viewforum.php?f=117</li>
<li>Groundspeak Forum: https://forums.geocaching.com/GC/index.php?/topic/343005-gc-little-helper-ii/</li>
<li>Swissgeocacheforum: http://www.swissgeocacheforum.ch/forum/topic/12872-gc-little-helper-ii/</li></ul>

Vorschlag Posting:<br>
<br>
Die neue Version 0.9.1 zum GC little helper II steht [url=https://github.com/2Abendsegler/GClh/raw/master/gc_little_helper_II.user.js]hier[/url] zur Verfügung. Sie kommt auch per automatischem Update. 

Details zu den Anpassungen gibt es wie immer im [url=https://github.com/2Abendsegler/GClh/blob/master/docu/changelog.md#readme]Changelog[/url].

Liebe Grüße

Ps.: Mehr informationen gibt es in der Ursprünglichen Issue: https://github.com/2Abendsegler/GClh/issues/564
