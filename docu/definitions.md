<a href="#user-content-branch" title="Branch">Branch</a> &nbsp; 
<a href="#user-content-coding_conventions" title="Coding Conventions">Coding Conventions</a> &nbsp; 
<a href="#user-content-issue" title="Issue">Issue</a> &nbsp; 
<a href="#user-content-documentation" title="Documentation">Documentation</a> &nbsp; 
<a href="#user-content-links" title="Links">Links</a> &nbsp; 

---
## Branch:  

Unsere Branches unterteilen sich in die drei Stufen *User*, *Collector* und *Projects / Developer*.

Beispiel:  

| 1. User | 2. Collector        | 3. Projects / Developer  |
| :------ | :------------------ | :----------------------- |
| master  | collector (default) | v0.5_f                   |
|         |                     | v0.5_cf_geoservices      |
|         |                     | VUP_Herr_Ma              |
|         |                     | translation              |

Anpassungen sollten mit den Resourcen der Branch *collector* erfolgen.  
Pull requests sollten in die Branch *collector* einfließen.  

### 1. User:  
Hier gibt es genau eine Branch *master*. Sie enthält die aktuelle Version für die User und dient den Usern zum Abrufen neuer Versionen.

### 2. Collector:  
Hier gibt es derzeit genau eine Branch *collector*. Sie dient als Sammler aller Bestandteile für eine Version vor der Auslieferung an die User, dem Transport in die Branch *master*.  

Die Branch *collector* ist die standard (default) Branch. Sie wird beim Transportieren automatisch als Empfänger vorgeschlagen. Damit wird unter anderem sichergestellt, dass nicht aus Versehen in die Branch *master* transportiert wird.  

Außerdem kann zeitunkritisch, auch gegebenenfalls aus mehreren Branches, in den *collector* transportiert werden, die Sammlung nachbearbeitet werden und gegebenenfalls auch ein Kompletttest durchgeführt werden, bevor die Sammlung als neue Version den Usern zur Verfügung gestellt wird.  

### 3. Projects / Developer:  
Diese Stufe soll Raum für unterschiedliche Projekte unterschiedlicher Entwickler bieten. Die Namen sollten einen beliebigen Qualifier für Projekt und Entwickler erhalten, den der Entwickler selbst bestimmen kann.
<br>
<br>

---
## Coding Conventions:  
* Favorisierter Einrückungsstil:
    if (x < 0) {
        negativ++;
    } else {
        positiv++;
    }
bzw.
    if (x < 0) { negativ++; }
bzw.
    if (x < 0) negativ++;
* Einrücken mit 4 Leerzeichen (nicht mit Tabulator).
* Keine Leerzeichen am Ende einer Zeile.
<br>
<br>

---
## Issue:  

Unter Issues finden wir die Tickets und das Ticketsystem. Ein Issue durchläuft bis zu seiner Schließung in der Regel mehrere Stationen. Die Aufgaben und die Einstellungen der Issues werden im Folgenden kurz erläutert.  

Sprache: Englisch wo nötig, ansonsten auch deutsch.  

* **Neues Issue:**
  * Kategorie (Label) setzen: *bug*, *enhancement*, *improvement*, *help wanted*, *question* ... 
  * Priorität (Label) setzen, zumindest wenn sie absehbar hoch ist. 
    * Die Kategorie *bug* hat in der Regel mindestens die Priorität *high*.
    * *help wanted* und *question* haben in der Regel nicht mehr als Priorität *middle*.
  * Handelt es sich um einen Wunsch der User, dann den Tag (Label) *wish* setzen.  
<br>
* **Issue in Arbeit nehmen:**
  * Issue einer Person zuordnen/assignen.
  * Status (Label) *in progress* setzen.  
<br>
* **Issue zurück an User geben:**
  * Aktion (Label) *user action* setzen.  
<br>
* **Issue auf erledigt setzen:**
  * Grob beschreiben, zu welchem Ergebnis man gekommen ist. (Beschreibung wird für Changelog verwendet.)
  * Entsprechenden Status (Label) setzen: *fixed*, *completed*, *rejected* ...  
<br>
* **Issue schließen:**
  * Sollen Objekte transportiert werden oder soll eine Dokumentation im Changelog erfolgen, dann Issue einem Milestone zuordnen.
  * Issue auf *close* setzen.
<br>
<br>

---
## Documentation:  

Eine *Änderungsdokumentation im Programmkopf* ist nicht erforderlich. Möchte jemand solche Dokumentation erfassen, dann kann er dies aber tun. Von Zeit zu Zeit wird solche Dokumentation aber entfernt, um das Programm nicht aufzublähen.  

Eine *Änderungsdokumentation im Programmcode* ist nicht erforderlich. Bei komplexen Zusammenhängen oder wenn besondere Beachtung geboten ist, dann sollte eine Dokumentation an der entsprechenden Programmstelle erfolgen. Ob eine solche Dokumentation sinnvoll ist, entscheidet der jeweilige Entwickler.  

Es sollte eine aussagekräftige *Dokumentation im Issue* bzw. im *Pull request* erfolgen. (Dokumentation wird für Changelog verwendet.)
<br>
<br>

---
## Links:  

* GitHub:  
https://github.com/2Abendsegler/GClh/tree/master
* Aktuelle Version des Script GClh installieren (User Installation):  
https://github.com/2Abendsegler/GClh/raw/master/gc_little_helper_II.user.js
* Testversion des Script GClh vom Collector installieren: (Abschluss-, Testinstallation):  
https://github.com/2Abendsegler/GClh/raw/collector/gc_little_helper_II.user.js
* License im Browser anzeigen:  
https://raw.githubusercontent.com/2Abendsegler/GClh/master/License
* Open Issues auf GitHub aufrufen:  
https://github.com/2Abendsegler/GClh/issues?q=is:issue%20is:open%20sort:created-desc
* Open Wishes auf GitHub aufrufen:  
https://github.com/2Abendsegler/GClh/issues?q=is:issue%20is:open%20label:%22tag:%20wish%22%20sort:created-desc
* Changelog auf GitHub anzeigen:  
https://github.com/2Abendsegler/GClh/blob/master/docu/changelog.md#readme
* License auf GitHub anzeigen:  
https://github.com/2Abendsegler/GClh/blob/master/docu/license.md#readme
* Warranty auf GitHub anzeigen:  
https://github.com/2Abendsegler/GClh/blob/master/docu/warranty.md#readme
* Tipps für die Migration auf GitHub anzeigen:  
https://github.com/2Abendsegler/GClh/blob/master/docu/tips_migration.md#readme  
* Tipps für die Installation auf GitHub anzeigen:  
https://github.com/2Abendsegler/GClh/blob/master/docu/tips_installation.md#readme  
<br>
* Geoclub Forum, Help (Greasemonkey-Scripte):  
http://geoclub.de/forum/viewforum.php?f=117  
* Geoclub Forum, alter Sammelthread für GC little helper:  
http://geoclub.de/forum/viewtopic.php?f=117&t=46168  
* Geoclub Forum, neuer Sammelthread für GC little helper II:  
http://geoclub.de/forum/viewtopic.php?f=117&t=79372  
<br>
* Deutsche Übersetzung der Lizence:  
http://www.gnu.de/documents/gpl-2.0.de.html
* Markdown Syntax (deutsch) als PDF:  
https://www.heise.de/mac-and-i/downloads/65/1/1/6/7/1/0/3/Markdown-CheatSheet-Deutsch.pdf
* Markdown Editor:  
https://github.com/mike-ward/Markdown-Edit/releases  
