# <img src="../images/flag_de.png"> GC little helper II — Entwicklung mit Tampermonkey

## Abstrakt

Tampermonkey verwaltet Userskripte und deren Resourcen intern und legt diese nicht im Dateisystem ab. Somit sind die Userskripte nicht per Dateizugriff für Drittprogramme erreichbar. Für die Entwicklung muss der interne Editor verwendet werden. Versionsverwaltungstools wie Git können nicht verwendet werden.

Dieser Artikel beschreibt, wie man das GC little helper Userskript außerhalb vom Tampermonkey als lokale Kopie ablegen und bearbeiten kann. Dies erleichtert die Entwicklung, ermöglicht den Einsatz einen Editor nach Wahl und die Verwendung eines Versionskontrollsystems.

Dieser Artikel bezieht sich auf den Einsatz von Tampermonkey im Mozilla Firefox oder Google Chrome Browser. 

## Schritt-für-Schritt Anleitung
Im weiteren Verlauf wird davon ausgegangen, dass eine lokale Kopie von GClh und dessen Resourcen besteht, z.B. ein geklontes Git Repository.

### Schritt 1: Vorbereitung
Damit Tampermonkey auf lokale Dateien zugreifen kann, muss die Konfiguration angepasst werden.
**Achtung:** Diese Einstellungen gilt für alle Script und stellt ein allgemeines Sicherheitsrisiko da!

#### Firefox:
 - Im Tampermonkey Menü den Punkt *Übersicht* auswählen.
 - Den Tab *Einstellungen* auswählen
 - Die Sektion *Sicherheit* auswählen
 - Beim Punkt *Das Lesen von lokalen Dateien durch Scripte erlauben* in der Dropdown-Box `Externals @require and @resource` auswählen.

#### Chrome:
 - Gehe zur Seite der Chrome Extensions: chrome://extensions/ (einfach in die Adresszeile eintippen)
 - Suche die Extension "Tampermonkey" und klicke auf *Details*
 - Aktiviere den Punkt *Zugriff auf Datei-URLs zulassen*

### Schritt 2: Altes GClh deaktivieren
- Das originale GC little helper II Userskript deaktivieren. 
- Es sollten nicht beide GClh Skripte aktiv sein (Sollte das doch der Fall sein, dann gibt GClh eine Warnung aus)

### Schritt 3: Skript Stub erstellen
- Ein neues Userskript erstellen, z.B. mit dem Namen `GC little helper II (Dev)`
- Den Header vom original GClh Skript in den Stub kopieren

### Schritt 4: Einfügen des Verweises auf die lokale Kopie
Ans Ende des Headers des Stubs muss ein Verweis auf die lokale Kopie von GCLh eingefügt werden.
```
// @require          file:///C://GClh-dev/gc_little_helper_II.user.js
```

### Schritt 5: Header Update
Sollte sich in der lokale Kopie der Header ändern, muss dies auch im Stub nachgezogen werden. **Achtung:** Der Header des Stubs muss aktuell zum Header der lokalen Kopie gehalten werden!

## Externe Resourcen lokal laden
Möchte man externe Resourcen lokal bearbeiten müssen entsprechende Verweise im Stub angepasst werden

```
// @require          https://raw.githubusercontent.com/2Abendsegler/GClh/master/data/gclh_defi.js
```

```
// @require          file:///C:/projects/gclh/GClh/data/gclh_defi.js
```

## Einschränkungen und Probleme
*Muss noch ausgefühlt werden*
- Update Info Popup wird immer angezeigt. Die Versionsnummer muss auch im Stub angepasst werden. Ansonsten erscheint immer die Updatemeldung von Tampermonkey und es kann passieren, dass bei einem Update der erstellte Stub mit dem originalen Script überschrieben wird!
- ...




# <img src="../images/flag_en.png"> GC little helper II — Development with Tampermonkey

## Abstract

Tampermonkey is managing Userscripts and their resources internally, and don't save them on the filesystem. That's why the Userscripts are not directly editable with a direct fileaccess by other developers. You can use the internal tampermonkey editor, if you want to change something on a userscript. The backside of this is, you can't use tools like Git to keep track of changes and different versions.

This article describes, how you can save an external copy of the GC little helper II userscript and modify it on the filesystem directly. This simplyfies the development of the userscript, because you can use the editor of you choise and systems for versioning like Git.

The scope of this article are the browsers Mozilla Firefox and Google Chrome.

## Step-by-Step Instruction
In the further course it is assumed that there is a local copy of GClh and its resources, e.g. a cloned git repository.

### Step 1: Preparation
With a standard configuration, Tampermonkey is not allowed to access the local file system. This need to be changed.
**Warning:** This configuration is a global one, so it will be used for **all** userscripts and poses a general security risk!

#### Firefox
 - In the Tampermonkey Menue choose *Dashboard*
 - Choose the tab *Settings*
 - Go to section *Security*
 - Go to the point *Allow scripts to access local files:* and choose `Externals (@require and @resource)`

#### Chrome
 - Go to the site of Chrome Extensions: chrome://extensions/ (just type it in the address bar)
 - Look for the *Tampermonkey* Extension and click on *details*
 - Activate *Allow access to file URLs*
 

### Step 2: Deactivate old GC little helper II userscript
- deactivate the old userscript GC little helper II
- only one GClh should run at the same time (if not there will be a warning that GClh is running more than once)

### Step 3: create a script stub
- create a new (blank) userscript, for example with the name `GC little helper II (Dev)`
- copy the header of the original GCKlh script in the stub

### Step 4: Modifying the links in the local copy
Add a link to the local resource of the userscript to the end of the stub
```
// @require          file:///C://GClh-dev/gc_little_helper_II.user.js
```

### Step 5: Header Update
If the header of the original script changes through the development, this changes has to be mirrored to the new stub.

## Load External Resources from local
If you have external resources in your header, you should change them to local ones.
For example change

```
// @require          https://raw.githubusercontent.com/2Abendsegler/GClh/master/data/gclh_defi.js
```
to

```
// @require          file:///C:/projects/gclh/GClh/data/gclh_defi.js
```

## Limitations and problems
*This list is not complete yet*
- If the version number of the script changes, you have to change the stub to the new verison, otherwise tampermonkey tries to update your script (and eventually overwrites your stub with the original script). So always dismiss an update!
- ...







