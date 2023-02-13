## <a id="de"></a>Go live Dokumentation:

####  <a id="1de"></a>1. Prüfen ob alle Issues gemäß <a href="https://github.com/2Abendsegler/GClh/milestones" title="Link to 'Milestones'">Milestones</a> enthalten sind. 
<br>

####  <a id="2de"></a>2. Alle Änderungen in branch collector transportieren und testen.
<br>

####  <a id="3de"></a>3. Changelog für neue Version in <a href="../docu/changelog.md" title="Link to 'changelog.md'">changelog.md</a> erzeugen.
<br>

####  <a id="4de"></a>4. Temporäres Coding entfernen.
<br>

####  <a id="5de"></a>5. $$ im Coding prüfen und gegebenenfalls ändern.
<ul>
	<li>
		$$000<br>
		Version setzen.
	</li>
	<li>
		$$001<br>
		Bei neuer Hauptversion Opacity überall um eine Zeile weiter nach unten reichen und letzte nach oben.<br>
		Das jeweils für ...On1 bis 3 und ...LL1 bis 3.
	</li>
	<li>
		$$002<br>
		Wenn für neue Version neue Counter Auswertung erfolgen soll, müssen die Counter bearbeitet werden.<br>
		X vor dem Counter Link verhindert das Auswählen.<br>
		<ul>
			<li>
				Zählt Installation je Adresse nur einmal:<br>
				Maßnahme: <a href="http://www.andyhoppe.com/counter/counter-konfiguration.htm">Counter zurücksetzen</a> (eifra)<br>
				Counter: Xhttp://c.andyhoppe.com/1643060379<br>
				Auswertung: http://c.andyhoppe.com/1643060379?output=static<br>
			</li>
			<li>
				Zählt alle Installationen:<br>
				Maßnahme: <a href="http://www.andyhoppe.com/counter/counter-konfiguration.htm">Counter zurücksetzen</a> (eifra)<br>
				Counter: Xhttp://c.andyhoppe.com/1643060408<br>
				Auswertung: http://c.andyhoppe.com/1643060408?output=static<br>
			</li>
			<li>
				Flagcounter zählt Installation je Adresse nur einmal innerhalb von 8 Stunden: <br>
				Neuen Flagcounter unter https://flagcounter.com generieren und eintragen.<br>
				Counter: Xhttps://s11.flagcounter.com/count2/...<br>
				Auswertung: Xhttp://s11.flagcounter.com/countries/...<br>
			</li>
			<li>
				Worldlagcounter zählt alle Installationen:<br>
				Neuen Worldflagcounter unter https://worldflagcounter.com generieren und eintragen.<br>
				Counter: Xwww.worldflagcounter.com/...<br>
				Auswertung: Xhttps://worldflagcounter.com/details/...<br>
			</li>
		</ul>
	</li>
	<li>
		$$004<br>
		Beachten, dass neue Config Parameter sehr wahrscheinlich in der Standardkonfiguration aufgenommen werden müssen. Sie dient bei einem Reset für eine korrekte Konfiguration, ohne die Arbeitsdaten zu entfernen. Entfernte Config Parameter sollten auch in der Standardkonfiguration entfernt werden.<br>
<a href="../data/config_standard.txt" title="Link to 'config_standard.txt'">config_standard.txt</a>
	</li>
	<li>
		$$005<br>
		Beachten, dass neue Config Parameter vielleicht eine neue Ausnahmeregeln hervorrufen, die in function rcConfigDataNotInUseDel aufgenommen werden muß.<br>
	</li>
	<li>
		$$006<br>
		Hier werden die Contributers und Bugreporter eingetragen. Sollte jemand neues einen Bug gemeldet/gefixt haben, dann ihn hier noch hinzufügen.<br>
	</li>
	<li>
		$$007<br>
		Wenn weitere Einstellungen außerhalb von CONFIG bei Reset zurückgesetzt werden müssen, dann sind sie hier einzutragen.<br>
	</li>
</ul>
<br>

####  <a id="6de"></a>6. Aktuelle Version in der Datei <a href="../last_version.txt" title="Link to 'last_version.txt'">last_version.txt</a> setzen.
<br>

####  <a id="7de"></a>7. Von branch collector auf branch master transportieren.
Anschließend wieder von branch master auf branch collector transportieren.<br>
Es dauert in der Regel 5 Minuten, bis die neue Version auf dem RAW Link angekommen ist.<br>
<br>

####  <a id="8de"></a>8. Für branch master ein neues <a href="https://github.com/2Abendsegler/GClh/releases" title="Link to 'Releases'">Releases</a> erzeugen
Folgendes Vorgehen ist empfehlenswert:
<ul>
	<li>Button "Draft a new release"</li>
	<li>Choose a tag: Aktuelle Version, zum Beispiel v0.14.2</li>
	<li>Target: collector</li>
	<li>Release Title: Aktuelle Version, zum Beispiel v0.14.2</li>
	<li>Description: "GoLive " und aktuelle Version eintragen</li>
</ul>
<br>

####  <a id="9de"></a>9. Forumsbeitrag für neue Version.
Bisher in folgenden Foren:
<ul><li>Geoclub: https://www.geoclub.de/forum/t/gc-little-helper-ii-ab-v0-11.81650</li>
<li>Groundspeak Forum: https://forums.geocaching.com/GC/index.php?/topic/343005-gc-little-helper-ii</li>
<li>Swissgeocacheforum: http://www.swissgeocacheforum.ch/forum/topic/12872-gc-little-helper-ii</li></ul>

Vorschlag Posting:<br>
<br>
Die neue Version 0.14.2 zum GC little helper II steht hier (https://github.com/2Abendsegler/GClh/raw/master/gc_little_helper_II.user.js) zur Verfügung. Sie kommt auch per automatischem Update. 

Details zu den Anpassungen gibt es im Changelog (https://github.com/2Abendsegler/GClh/blob/master/docu/changelog.md#readme).

Liebe Grüße<br>
<br>

####  <a id="10de"></a>10. Weitere Informationen.
Weitere informationen gibt es im ursprünglichen Issue: https://github.com/2Abendsegler/GClh/issues/564
