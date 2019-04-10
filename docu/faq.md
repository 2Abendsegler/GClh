# FAQ

<a href="#en" title=""><img src="../images/flag_en.png"></a> | <a href="#de" title=""><img src="../images/flag_de.png"></a>
--- | --- 
<a href="#1-en">1. What can I do if the Warning is displayed "GClh is running more than once"?</a> | <a href="#1-de">1. Was kann ich tun wenn die Warnung angezeigt wird, dass GClh mehr als einmal läuft?</a>
<a href="#2-en">2. In the Config I can't add new links to the Linklist because it is out of the view.</a> | <a href="#2-de">2. Ich kann in der Konfiguration keine neuen Links zur Linkliste hinzufügen, da die Linkliste außerhalb des Bildschirms ist.</a>
<a href="#3-en">3. GClh doesn't start.</a> | <a href="#3-de">3. GClh startet nicht.</a>
<a href="#4-en">4. Hints for using on Android devices.</a> | <a href="#4-de">4. Hinweise für die Nutzung auf Android Geräten.</a>

---
<a id="en"></a><img src="../images/flag_en.png">

<a id="1-en"></a>
## 1. What can I do if the Warning is displayed "GClh is running more than once"?
*GC little helper II* is only working correctly, if it's just running once at a time. Because of that, the script itself checks if it's the only GClh running.<br>
If this warning is displayed, it is mostly true. So you can check some points:<br>
<ol>
	<li>
		Please check if you have more than one Scriptmanger (i.e. Tampermonkey and Greasemonkey) installed. Maybe GClh is installed in both of the Scriptmanager. In this case you just have to uninstall GClh in one of this Scriptmanagers. Since we only support Tampermonkey, you should uninstall it in Greasemonkey.<br>
	</li>
	<li>
		Maybe GClh is installed more than once in your Scriptmanger. You can check this for example in Tampermonkey by viewing the Scriptoverview. If this is the case, just uninstall all but one instance of GClh.<br>
	</li>
</ol>
If you still get the warning, please leave a bugreport <a href="https://github.com/2Abendsegler/GClh/issues">here</a> and we will try to assist you.<br>
<br>

<a id="2-en"></a>
## 2. In the Config I can't add new links to the Linklist because it is out of the view.
If you have problems to drag & drop the lower links because the Linklist area is not on the screen, then use the arrow high key on your keyboard during you hold the mouseclick.<br>
<br>

<a id="3-en"></a>
## 3. GClh doesn't start.
If a script does not start, these are usually matching problems between the browser and the script manager Tampermonkey. These problems mainly occur when a tab in a browser passes beyond a session. This can be caused by the user by leaving tabs in the browser, for example, when hibernating. It can also be caused by the browser, for example, when restoring tabs after a cancellation.<br>

*Resolve problems:* Problems can be resolved depending on the situation regularly with one of the following points.<br>
<ul>
	<li>
		Close tabs in browser, re-select tabs.<br>
	</li>
	<li>
		Close tabs in browser, close browser, start browser, re-select tabs.<br>
	</li>
	<li>
		Deactivate the script manager Tampermonkey and reactivate it after a few seconds (unless you have deactivated "Automatic page reload" in Tampermonkey).<br>
	</li>
</ul>

*Prevent problems:* <br>
<ul>
	<li>
		Close tabs in the browser before hibernating the computer, so that the tabs no longer exist when reactivated.<br>
	</li>
	<li>
		(Android) Close tabs in the browser before closing the browser, so that the tabs are no longer available the next time you start the browser.<br>
	</li>
</ul>
<br>

<a id="4-en"></a>
## 4. Hints for using on Android devices.
<ul>
	<li>
		Drag & drop operations do not work.<br>
		<ul>
			<li>
				GClh Config: In chapter "Linklist / Navigation", no new entries can be placed in the right column "Linklist" from the left column <a href="https://www.geocaching.com/my/#GClhShowConfig#a#ll#settings_bookmarks_top_menu_h" title="Link to your GClh Config">Default links</a>.<br>
			</li>
			<li>
				GClh Config: In chapter "Linklist / Navigation" the order can not be changed in the right column <a href="https://www.geocaching.com/my/#GClhShowConfig#a#ll#settings_bookmarks_top_menu_h" title="Link to your GClh Config">Linklist</a>.<br>
			</li>
		</ul>
		<br>
	</li>
	<li>
		Field activations by moving a mouse over a field usually works by touching.<br>
		<ul>
			<li>
				Icons on map: The icon "Go to Map" can not be selected in the map. All other icons in the map work.<br>
			</li>
			<li>
				Preview pictures (thumbnails) in Listings and Galleries: They work by touching, but at the same time touching also activates the normal display of the large picture. The <a href="https://www.geocaching.com/my/#GClhShowConfig#a#settings_show_thumbnailsX0" title="Link to your GClh Config">preview of the pictures</a> should be deactivated.<br>
				<br/>
			</li>
		</ul>
	</li>
	<li>
		Right mouse works usually by touching and holding.<br>
		<br/>
	</li>
	<li>
		Linklist and usual menu are not always visible. It is then hidden at the top right in a side menu, for example on the pages Dashboard, Geocache Search or Map. If you activate "Desktop Page" in the browser, the Linklist and the menu are displayed as usual.<br>
		<br/>
	</li>
	<li>
		There are no function keys / F-keys with the standard Android keyboard.<br>
		<ul>
			<li>
				F2 to save ... does not work (GClh config, bookmark lists, PQ, hide ...).<br>
			</li>
			<li>
				F4 or F10 to call the GClh Config or GClh Sync will not work.<br>
			</li>
		</ul>
	</li>
</ul>
<br>

---
<a id="de"></a><img src="../images/flag_de.png">

<a id="1-de"></a>
## 1. Was kann ich tun wenn die Warnung angezeigt wird, dass GClh mehr als einmal läuft?
*GC little helper II* funktioniert nur richtig, wenn es nur einmal im Browser ausgeführt wird. Deshalb prüft das Script selbst, ob dies der Fall ist.<br>
Wenn die Meldung angezeigt wird, dass GClh mehr als einmal läuft, dann ist das auch meist der Fall. Daher sollten folgende Sachen geprüft werden:<br>
<ol>
	<li>
		Bitte prüfe, ob mehr als ein Scriptmanager installiert ist (zum Beispiel neben Tampermonkey auch noch Greasemonkey). Wahrscheinlich ist GClh in beiden Scriptmanagern installiert. GClh muss in diesem Fall in einem der Scriptmanager deinstalliert werden. Da wir nur Tampermonkey unterstützen, deinstalliere GClh bitte in allen anderen Scriptmanagern.<br>
	</li>
	<li>
		Eventuell ist GClh mehr als einmal installiert. Dies kann zum Beispiel bei Tampermonkey in der Scritpübersicht geprüft werden. Wenn dies der Fall ist, dann deinstalliere alle Versionen bis auf eine und das Problem sollte behoben sein.<br>
	</li>
</ol>
Sollte die Warnung dann immer noch auftauchen, dann erstelle bitte <a href="https://github.com/2Abendsegler/GClh/issues">hier</a> einen Bugreport und wir werden versuchen dir zu helfen.<br>
<br>

<a id="2-de"></a>
## 2. Ich kann im GClh Config keine neuen Links zur Linkliste hinzufügen, da die Linkliste außerhalb des Bildschirms ist.
Wenn du Probleme mit dem Drag & Drop hast beim Hinzufügen neuer Links zur Linkliste, da die Links zu tief sind und die Liste aus dem sichtbaren Bereich rausscollt, dann nutze einfach die Pfeiltasten (Pfeiltaste nach oben) während du das neue Element weiter fest hälst.<br>
<br>

<a id="3-de"></a>
## 3. GClh startet nicht.
Startet ein Script nicht, so handelt es sich in der Regel um Abstimmungsprobleme zwischen dem Browser und dem Script-Manager Tampermonkey. Diese Probleme treten hauptsächlich dann auf, wenn ein Tab in einem Browser über eine Session hinaus besteht. Das kann durch den User veranlaßt sein indem er Tabs im Browser beispielsweise im Ruhezustand bestehen läßt. Es kann aber auch durch den Browser veranlaßt sein beispielweise bei einer Wiederherstellung von Tabs nach einem Abbruch.<br>

*Probleme beheben:* Probleme können je nach Sachlage regelmäßig mit einem der folgenden Punkte behoben werden.<br>
<ul>
	<li>
		Tabs im Browser schließen, Tabs neu anwählen.<br>
	</li>
	<li>
		Tabs im Browser schließen, Browser schließen, Browser starten, Tabs neu anwählen.<br>
	</li>
	<li>
		Script-Manager Tampermonkey deaktivieren und nach einigen Sekunden wieder aktivieren (sofern man "Automatisches Seiten-Neu-Laden" in Tampermonkey nicht deaktiviert hat).<br>
	</li>
</ul>

*Problemen vorbeugen:* <br>
<ul>
	<li>
		Tabs im Browser schließen bevor man den Rechner in den Ruhezustand schickt, damit bei der Reaktivierung die Tabs nicht mehr vorhanden sind.<br>
	</li>
	<li>
		(Android) Tabs im Browser schließen bevor man den Browser schließt damit beim nächsten Aufruf des Browsers die Tabs nicht mehr vorhanden sind.<br>
	</li>
</ul>
<br>

<a id="4-de"></a>
## 4. Hinweise für die Nutzung auf Android Geräten.
<ul>
	<li>
		Drag & Drop Operationen funktionieren nicht.<br>
		<ul>
			<li>
				GClh Config: Im Kapitel "Linklist / Navigation" können von der linken Spalte <a href="https://www.geocaching.com/my/#GClhShowConfig#a#ll#settings_bookmarks_top_menu_h" title="Link zu deinem GClh Config">Default links</a> keine neuen Einträge in die rechte Spalte "Linklist" gehängt werden.<br>
			</li>
			<li>
				GClh Config: Im Kapitel "Linklist / Navigation" kann in der rechten Spalte <a href="https://www.geocaching.com/my/#GClhShowConfig#a#ll#settings_bookmarks_top_menu_h" title="Link zu deinem GClh Config">Linklist</a> die Reihenfolge nicht geändert werden.<br>
				<br/>
			</li>
		</ul>
	</li>
	<li>
		Feldaktivierungen durch Mausbewegung über ein Feld funktionieren in der Regel durch antippen.<br>
		<ul>
			<li>
				Icons auf Karte: In der Karte läßt sich das Icon "Go to Map" nicht anwählen. Alle anderen Icons in der Karte funktionieren.<br>
			</li>
			<li>
				Vorschau der Bilder (thumbnails) in Listings and Gallerien: Sie funktionieren durch antippen, gleichzeitig wird durchs Antippen jedoch auch die normale Anzeige des Bildes in groß aktiviert. Die <a href="https://www.geocaching.com/my/#GClhShowConfig#a#settings_show_thumbnailsX0" title="Link zu deinem GClh Config">Vorschau der Bilder</a> sollte deaktiviert werden.<br>
				<br/>
			</li>
		</ul>
	</li>
	<li>
		Rechte Maustaste funktioniert regelmäßig durch antippen und halten.<br>
		<br/>
	</li>
	<li>
		Linklist und gewohntes Menü sind nicht immer sichtbar. Sie verstecken sich dann rechts oben in einem seitlichen Menü, beispielsweise auf den Seiten Dashboard, Geocache Suche oder Karte. Aktiviert man im Browser "Desktop-Seite", wird die Linklist und das Menü wie gewohnt angezeigt.<br>
		<br/>
	</li>
	<li>
		Es gibt keine Funktionstasten / F-Tasten mit der Standard Android Tastatur.<br>
		<ul>
			<li>
				F2 zum Speichern ... funktioniert nicht (GClh Config, Bookmarklisten, PQ, Verstecken ...).<br>
			</li>
			<li>
				F4 bzw. F10 zum Aufrufen des GClh Config bzw. GClh Sync funktionieren nicht.<br>
			</li>
		</ul>
	</li>
</ul>
<br>
