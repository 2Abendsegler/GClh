# FAQ

| <img src="../images/flag_en.png">  | <img src="../images/flag_de.png"> |
| ------------- | ------------- |
| <a href="#1-en">1. What can I do if the Warning is displayed "GClh is running more than once"?</a>| <a href="#1-de">1. Was kann ich tun wenn die Warnung angezeigt wird, dass GClh mehr als einmal läuft?</a>|

---
<img src="../images/flag_en.png">
<a id="1-en"></a>

## 1. What can I do if the Warning is displayed "GClh is running more than once"?
*GC little helper II* is only working correctly, if it's just running once at a time. Because of that, the script 
itself checks if it's the only GClh running.<br>
If this warning is displayed, it is mostly true. So you can check some points:
<ol>
	<li>
		Please check if you have more than one Scriptmanger (i.e. Tampermonkey and Greasemonkey) installed. Maybe GClh 
		is installed in both of the Scriptmanager. In this case you just have to uninstall GClh in one of this 
		Scriptmanagers. Since we only support Tampermonkey, you should uninstall it in Greasemonkey.
	</li>
	<li>
		Maybe GClh is installed more than once in your Scriptmanger. You can check this for example in Tampermonkey 
		by viewing the Scriptoverview. If this is the case, just uninstall all but one instance of GClh.
	</li>
</ol>
If you still get the warning, please leave a bugreport <a href="//github.com/2Abendsegler/GClh/issues">here</a> and we 
will try to assist you.
<br>

---
<img src="../images/flag_de.png">
<a id="1-de"></a>

## 1. Was kann ich tun wenn die Warnung angezeigt wird, dass GClh mehr als einmal läuft?

*GC little helper II* funktioniert nur richtig, wenn es nur einmal im Browser ausgeführt wird. Deshalb prüft das 
Script selbst, ob dies der Fall ist.<br>
Wenn die Meldung angezeigt wird, dass GClh mehr als einmal läuft, dann ist das auch meist der Fall. Daher sollten 
folgende Sachen geprüft werden:
<ol>
	<li>
		Bitte prüfe, ob mehr als ein Scriptmanager installiert ist (zum Beispiel neben Tampermonkey auch noch 
		Greasemonkey). Wahrscheinlich ist GClh in beiden Scriptmanagern installiert. GClh muss in diesem Fall in einem 
		der Scriptmanager deinstalliert werden. Da wir nur Tampermonkey unterstützen, deinstalliere GClh bitte in allen 
		anderen Scriptmanagern.
	</li>
	<li>
		Eventuell ist GClh mehr als einmal installiert. Dies kann zum Beispiel bei Tampermonkey in der Scritpübersicht 
		geprüft werden. Wenn dies der Fall ist, dann deinstalliere alle Versionen bis auf eine und das Problem 
		sollte behoben sein.
	</li>
</ol>
Sollte die Warnung dann immer noch auftauchen, dann erstelle bitte 
<a href="//github.com/2Abendsegler/GClh/issues">hier</a> einen Bugreport und wir werden versuchen dir zu helfen.
<br>