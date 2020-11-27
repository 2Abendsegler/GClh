<a href="#de" title=""><img src="../images/flag_de.png"></a> &nbsp;<a href="#en" title=""><img src="../images/flag_en.png"></a>

---
## <a id="de"></a>Wie kannst du etwas beitragen?
<br>
Am einfachsten ist es, wenn du direkt einen Pull Request einreichst. Falls du nicht weißt wie das geht, dann bist du hier genau richtig. Wir erklären dir Schritt für Schritt wie du Änderungen oder neue Features einreichen kannst. Wir prüfen diese Änderungen und lassen sie ggf. in die nächste Version vom GClh II einfließen.

###  <a id="1de"></a>1. Fork: Erstelle eine serverseitige Kopie des Codes in deinem Github Account
Änderungen am Code kannst du nicht direkt bei uns im Repository vornehmen. Du musst dafür eine Kopie des Codes in deinem Github Account erzeugen, einen sogenannten Fork.<br>
Das ist ganz einfach. Dafür loggst du dich bei Github ein und rufst unser Repository über <a href="https://github.com/2Abendsegler/GClh">diesen Link</a> auf.<br>
Auf dieser Seite ist oben Rechts der *Fork* Button. <br>
<br><img src="../images/how_to_contriubte/1_fork.jpg" /><br><br>
Sobald man diesen betätigt hat man eine serverseitige Kopie des Codes angelegt, in dem man nun arbeiten kann.
<br>

###  <a id="2de"></a>2. Branch: Erstelle einen lokalen Feature Branch
Damit deine Änderungen zusammenhängend sind und du ggf. auch an mehreren Sachen gleichzeitig arbeiten kannst, wird pro Feature / Änderung ein sogenannter Branch angelegt. Dies geschieht in deiner lokalen Kopie des Codes, also in deinem Repository.<br> 
Hierfür klickt man auf den Branch *collector* (1.), gibt einen neuen Namen für den Feature Branch ein (2.) und klickt anschließend auf *Create branch* (3.)<br>
<br><img src="../images/how_to_contriubte/2_branch.jpg" /><br>

###  <a id="3de"></a>3. Entwicklung: Implementierung der Änderungen
Nun kannst du die Änderungen über ein oder meherere Commits am Code durchführen.<br>
Entweder du installierst dir einen Git Client um die Änderungen auf deinem Computer durchzuführen, oder du führst die Änderungen direkt im Repository in deinem Github Account auf der Webseite durch. Wie du dir einen Lokalen Git Client einrichten kannst, haben wir hier beschrieben: <a href="https://github.com/2Abendsegler/GClh/blob/master/docu/development-tampermonkey.md">GC little helper II — Entwicklung mit Tampermonkey</a>

###  <a id="4de"></a>4. Pull Request: Änderungsantrag einreichen
Sind alle Änderungen gemacht, kannst du bei uns im Repository einen Änderungsantrag, einen sogenannten Pull Request, einreichen. Wir werden deine Änderungen dann prüfen. Entweder wir übernehmen die Änderungen in der nächsten Version vom GClh II, oder melden uns bei dir, falls noch Änderungsbedarf besteht.<br>
<br>
So reichst du den Pull Request ein:

- Dafür loggst du dich wieder bei Github ein und rufst unser Repository über <a href="https://github.com/2Abendsegler/GClh">diesen Link</a> auf.
- Du klickst auf den Reiter *Pull Requests* (1.) und dort auf *New pull request* (2.)<br>
<br><img src="../images/how_to_contriubte/4_Pull_1.jpg" /><br><br>
- Hier gibt es nun zwei Sachen zu beachten. Zuerst muss auf den Link *compare across forks* (1.) geklickt werden, da sonst nur ein Pull Request innerhalb unseres Repositorys möglich ist. Danach wird als *base repository* (2.) das Repository von *2Abendsegler/GClh* ausgewählt. Wichtig ist weiterhin den Branch *collector* zu wählen. In der Branch *collector* sammeln wir alle Änderungen, um sie dann später in einer neuen Version an die User auszuliefern. Als *head repository* (3.) wählst du nun dein eigenes Repository und den Branch in dem deine Änderungen zu finden sind. Zum Abschluss klickst du auf *Create pull request* (4.).<br>
<br><img src="../images/how_to_contriubte/4_Pull_2.jpg" /><br><br>
- Im letzten Schritt musst du deinem Pull Request einen Namen (1.) geben und eine Beschreibung (2.) zur Verfügung stellen. Mit dem Button *Create pull request* (3.) erstellst du den Pull Request und bist fertig.<br>
Die Felder auf der rechten Seite (4.) musst du nicht ausfüllen.<br>
Bitte erstelle für jedes Feature einen separaten Pull Request. Das macht mögliche Änderungen einfacher.<br>
<br><img src="../images/how_to_contriubte/4_Pull_3.jpg" /><br>



---
## <a id="en"></a>How to contribute
<br>

### <a id="1en"></a>1. Fork: Erstelle eine Serverseitige Kopie des Codes in deinem Github Account