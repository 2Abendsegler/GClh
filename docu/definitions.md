<a href="#user-content-branch" title="Branch">Branch</a> &nbsp; 
<a href="#user-content-issue" title="Issue">Issue</a> &nbsp; 
<a href="#user-content-dokumentation" title="Dokumentation Programmänderungen">Dokumentation</a> &nbsp; 
<a href="#user-content-links" title="Links">Links</a> &nbsp; 

---
## Branch:  

Unsere Branches unterteilen sich in die vier Stufen *User*, *Collector*, *Projects* und *Developer*.

Beispielsweise könnten in den vier Stufen folgende Branches vorhanden sein.  

| 1. User | 2. Collector        | 3. Projects | 4. Developer   |
| :------ | :------------------ | :---------- | :------------- |
| master  | collector (default) | v0.2.2.4    | dev_bug_fe     |
|         |                     | v0.2.3      | dev_CF         |
|         |                     |             | dev_v0.2.3_fe  |
|         |                     |             | dev_LittleJohn |
|         |                     | translation | dev_trans_CF   |

### 1. User:  
Hier gibt es genau eine Branch *master*. Sie enthält die aktuelle Version für die User und dient den Usern zum Abrufen neuer Versionen.

### 2. Collector:  
Hier gibt es derzeit genau eine Branch *collector*. Sie dient als Sammler aller Bestandteile für eine Version vor der Auslieferung an die User, dem Transport in den “master”.  

Der *collector* ist die standard (default) Branch. Er wird beim Transportieren automatisch als Empfänger vorgeschlagen. Damit wird unter anderem sichergestellt, dass nicht aus versehen in den “master” transportiert wird.  

Außerdem kann zeitunkritisch, auch gegebenenfalls aus mehreren Branches, in den *collector* transportiert werden, die Sammlung nachbearbeitet werden und gegebenenfals auch ein Kompletttest durchgeführt werden, bevor die Sammlung als neue Version den Usern zur Verfügung gestellt wird.  

**Beispiel:** In der Branch *collector* könnten beispielsweise die nächste Version *v0.2.3*, die nächste kleine Bugfixing Version *v0.2.2.4*, die es nicht mehr eigenständig geschafft hat ausgeliefert zu werden, und eine langfristige Entwicklung *translation* eingesammelt werden.  

### 3. Projects:  
Die Stufe Projects soll Raum dafür bieten, dass gleichzeitig im Rahmen mehrerer Projekte entwickelt werden kann. Das ist insbesondere für das Bugfixing zur aktuellen Version (kleine Version) und für die eigentliche Weiterentwicklung zur nächsten Version notwendig. Die Namen der Branches sind in der Regel so gewählt, dass sie der nächsten Version entsprechen.

Diese Stufe kommt aber auch gegebenenfalls zum Einsatz, wenn langfristige Projekte entwickelt werden, für die eine Version noch gar nicht abgeschätzt werden kann.

Nach dem Transport in die Branch *collector* und der Auslieferung an die User über den *master* wird die entsprechende Branch gelöscht.

**Beispiel:** Hier sollten zumindest immer die nächste Version *v0.2.3* und die nächste kleine Bugfixing Version *v0.2.2.4* enthalten sein. Das langfristige Projekt *translation* wäre hier dann auch enthalten.  

### 4. Developer:  
In dieser Stufe sollen die Namen der Branches der Contributoren (Mitarbeiter) auf dem GitHub von 2Abendsegler mit *dev_* beginnen und folgend einen beliebigen Qualifier für Projekt und Entwickler erhalten, den der Entwickler selbst bestimmen kann. Eine Branche für einen Entwickler soll mit Referenz zu demjenigen Projekt erzeugt werden, für welches der Entwickler entwickelt.

Referenziert und transportiert (forked) der Entwickler die Arbeiten auf seinen eigenen GitHub Account, ist er in der Namensgebung natürlich frei. Auch hier sollte mit Bezug zum jeweiligen Projekt geforked werden, für welches er entwickeln möchte. 

**Beispiel:** Hilft man beim Bugfixing der aktuellen Version *V0.2.2*, und wurden bereits 3 Bugfixing Versionen transportiert, dann forked man vom Projekt *v0.2.2.4*. Die drei vorgegangenen Bugfixing Versionen *v0.2.2.1*, *2* und *3*, stehen dann auch schon nicht mehr zur Auswahl zur Verfügung. Entwickelt man für die nächste Version, dann forked man von *v0.2.3*.  
<br>
<br>

---
## Issue:  

Unter Issues finden wir die Tickets und das Ticketsystem. Ein Issue durchläuft bis zu seiner Schließung in der Regel mehrere Stationen. Die Aufgaben und die Einstellungen der Issues werden im folgenden kurz erläutert.  

Sprache: Englisch wo nötig, ansonsten auch deutsch.  

* **Neues Issue:**
  * Kategorie (Label) setzen: *bug*, *enhancement*, *improvement*, *help wanted*, *question* ... 
  * Priorität (Label) setzen, zumindest wenn sie absehbar hoch ist. 
    * Die Kategorie *bug* hat in der Regel mindestens die Priorität *high*.
    * *help wanted* und *question* haben in der Regel nicht mehr als Priorität *middle*.
  * Handelt es sich um einen Wunsch der User, dann den Tag (Label) *wish* setzen.  
<br>
* **Issue in Arbeit nehmen:**
  * Issue entsprechend der Person zuordnen/assignen.
  * Status (Label) *in progress* setzen.  
<br>
* **Issue zurück an User geben:**
  * Aktion (Label) *user action* setzen.  
<br>
* **Issue auf erledigt setzen:**
  * Spätestens jetzt grob beschreiben, was man gemacht hat oder zu welchem Ergebnis man aus welchem Grund gekommen ist.
  * Spätestens jetzt alle Beiträge auf echte Mail-Adressen prüfen und diese entfernen, auch in den Beiträgen anderer. 
  * Entsprechenden Status (Label) setzen: *fixed*, *completed*, *rejected* ...  
<br>
* **Issue schließen:**
  * Handelt es sich um Entwicklung, dann das Issue spätestens jetzt in die Milestones integrieren.
  * Issue auf *close* setzen.  
<br>
<br>

---
## Dokumentation:  

Eine *Änderungsdokumentation im Programmkopf* ist nicht erforderlich. Möchte jemand solche Dokumenation erfassen, dann kann er dies aber tun. Von Zeit zu Zeit wird solche Dokumentation aber entfernt, um das Programm nicht aufzublähen.  

Eine *Änderungsdokumentation im Programmcode* ist nicht erforderlich. Bei komplexen Zusammenhängen oder wenn besondere Beachtung geboten ist, dann sollte eine Dokumentation an der entsprechenden Programmstelle erfolgen. Ob eine solche Dokumentation sinnvoll ist, entscheidet der jeweilige Entwickler.  

Es sollte eine aussagekräftige *Änderungsdokumentation im Changelog* (changelog.txt) erfolgen. Diese Datei dient lediglich zu unseren/internen Zwecken. Diese Dokumentation wird insbesondere verwendet, um ein (User) Changelog (changelog.md) zum Zeitpunkt der Auslieferung an die User vorzubefüllen. Dieses Changelog wird dann gegebenenfalls noch um Screens und andere Dinge erweitert und etwas aufbereitet , bevor es an die User geht.  

Außerdem sollte eine aussagekräftige *Dokumentation im Issue* erfolgen.  
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
https://github.com/2Abendsegler/GClh/blob/master/docu/changelog.md
* License auf GitHub anzeigen:  
https://github.com/2Abendsegler/GClh/blob/master/docu/license.md
* Warranty auf GitHub anzeigen:  
https://github.com/2Abendsegler/GClh/blob/master/docu/warranty.md
* Tips Migration auf GitHub anzeigen:  
https://github.com/2Abendsegler/GClh/blob/master/docu/tips%20migration.md  
<br>
* Geoclub Forum, Help (Greasemonkey-Scripte):  
http://geoclub.de/forum/viewforum.php?f=117  
* Geoclub Forum, alter Sammelthread:  
http://geoclub.de/forum/viewtopic.php?f=117&t=46168  
* Geoclub Forum, neuer Sammelthread::  
http://geoclub.de/forum/viewtopic.php?f=117&t=79372  
<br>
* Deutsche Übersetzung der Lizence:  
http://www.gnu.de/documents/gpl-2.0.de.html
* Markdown Syntax (deutsch) als PDF:  
https://www.heise.de/mac-and-i/downloads/65/1/1/6/7/1/0/3/Markdown-CheatSheet-Deutsch.pdf
* Markdown Editor:  
https://github.com/mike-ward/Markdown-Edit/releases  
<br>
<br>
