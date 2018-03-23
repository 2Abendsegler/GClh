# GC little helper II � Entwicklung mit Tampermonkey

## Abstrakt

Tampermonkey verwaltet Userskripte und deren Resourcen intern und legt diese nicht im Dateisystem ab. Somit sind die Userskripte nicht per Dateizugriff f�r Drittprogramme erreichbar. F�r die Entwicklung muss der interne Editor verwendet werden. Versionsverwaltungstools wie Git k�nnen nicht verwendet werden.

Dieser Artikel beschreibt, wie man das GC little helper Userskript au�erhalb vom Tampermonkey als lokale Kopie ablegen und bearbeiten kann. Dies erleichtert die Entwicklung, erm�glicht den Einsatz einen Editor nach Wahl und die Verwendung eines Versionskontrollsystems.

Dieser Artikel bezieht sich auf den Einsatz von Tampermonkey im Mozilla Firefox oder Google Chrome Browser. 

## Schritt-f�r-Schritt Anleitung
Im weiteren Verlauf wird davon ausgegangen, dass eine lokale Kopie von GClh und dessen Resourcen besteht, z.B. ein geklontes Git Repository.

### Schritt 1: Vorbereitung
Damit Tampermonkey auf lokale Dateien zugreifen kann, muss die Konfiguration angepasst werden.

 - Im Tampermonkey Men� den Punkt *�bersicht* ausw�hlen.
 - Den Tab *Einstellungen* ausw�hlen
 - Die Sektion *Sicherheit* ausw�hlen
 - Beim Punkt *Das Lesen von lokalen Dateien durch Scripte erlauben* in der Dropdown-Box `Externals @require and @resource` ausw�hlen.
 
**Achtung:** Diese Einstellungen gilt f�r alle Script und stellt ein allgemeines Sicherheitsrisiko da!

### Schritt 2: Altes GClh deaktivieren
- Das originale GC little helper II Userskript deaktivieren. 
- Es sollten nicht beide GClh Skripte aktiv sein!

### Schritt 3: Skript Stub erstellen
- Ein neues Userskript erstellen, z.B. mit dem Namen `GC little helper II (Dev)`
- Den Header vom original GClh Skript in den Stub kopieren

### Schritt 4: Einf�gen des Verweises auf die lokale Kopie
Ans Ende des Headers des Stubs muss ein Verweis auf die lokale Kopie von GCLh eingef�gt werden.
```
// @require          file:///C://GClh-dev/gc_little_helper_II.user.js
```
### Schritt 5: Header Update
Sollte sich in der lokale Kopie der Header �ndern, muss dies auch im Stub nachgezogen werden. **Achtung:** Der Header des Stubs muss aktuell zum Header der lokalen Kopie gehalten werden!

## Einschr�nkungen und Probleme
*Muss noch ausgef�hlt werden*
- Update Info Popup wird immer angezeigt. Versionnummer auch im Stub anpassen
- ...







