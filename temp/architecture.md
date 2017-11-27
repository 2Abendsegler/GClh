# Architecture and Development GUIDE of GClh

Dokumenten Status:  **DRAFT** :exclamation:

---

## Startup Sequenze
Nach dem Laden des Skripts wird die Funktion ```start()``` (Einsprungspunkt) aufgerufen. Der Aufruf der Funktion ```start()``` befindet sich in der letzten Zeile des Skripts. Anschließend werden einige Start- und Initalisierungsfunktionen durchlaufen. Am Schluß wird entschieden, ob Modifikationen für Geocaching.com oder andere Seiten durchgeführt werden sollen.

Neben der Funktion ```start()```  gibt es eine Reihe weiterer Funktionen, die sich auf der obersten Ebene befinden. Diese können in drei Kategorien unterteilt werden:
* Start- und Initialisierungfunktionen
* Hauptfunktionen
* Hilfsfunktionen

### Start- und Initialisierungfunktionen
* ```start``` - Einsprungsfunktion
* ```quitOnAdFrames``` - Hilfsfunktion, damit das Skript nicht in Google Ads Frame gestartet wird
* ```jqueryInit``` - jQuery wird initalisiert
* ```browserInit``` - Hilfsroutinen für die verschiedenen Browsers und Workarounds
* ```constInit```  - Initialisierung von Konstanten
* ```variablesInit``` - Laden der Einstellungen

### Hauptfunktionen
Die Hauptfunktionen werden am Ende der Initalisierungsroutine aufgerufen:
* ```mainGMaps()```
* ```mainOSM()```
* ```mainGC()``` - Modifikationen für Geocaching.com - Enthält den größten Teil des Codes (~10,000 lines of code)

### Hilfsfunktionen
Etliche Funktionen auf der obersten Ebene sind Hilfsfunktionen. Die meisten der Funktionen erledigen kleine spezialisierte Aufgaben.

## Persistenz
:question:
### Bool'sche Optionen
=> Checkboxes
### Other
=>

## Debugging
:question:

## Modifikationen mit zeitlicher Verzögerung
:question:
