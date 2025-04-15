<a href="#en" title=""><img src="../images/flag_en.png"></a> &nbsp;<a href="#de" title=""><img src="../images/flag_de.png"></a>

---
# <a id="en"></a>GC little helper II — Development with Tampermonkey

## Abstract

Tampermonkey is managing Userscripts and their resources internally, and don't save them on the filesystem like Greasemonkey. That's why the Userscripts are not directly editable with a direct fileaccess by other developers. You can use the internal Tampermonkey editor, if you want to change something on a userscript. The backside of this is, you can't use tools like Git to keep track of changes and different versions.

This article describes, how you can save an external copy of the GC little helper II userscript and modify it on the filesystem directly. This simplyfies the development of the userscript, because you can use an external editor of you choise and systems for versioning like Git.

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
Only one GClh should run at the same time. Avoid conflict between to instances of GClh the original GClh script have to be deactivated. If not there will be a warning that GClh is running more than once.

 - In the Tampermonkey Menue choose *Dashboard*
 - Choose the tab *Installed scripts*
 - Use the switch to deactivate the original GClh script

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
- An updates overwrites your stub with the original GClh. Always dismiss an update over the build-in mechanism. Update your script manually in your local file system by Git.
- If the version number of the script changes, you have to change the stub to the new verison, otherwise Tampermonkey (or the build-in update mechanism) shows the update info popup and tries to update your script 

---
# <a id="de"></a>GC little helper II - Entwicklung mit Tampermonkey

## Abstrakt

Tampermonkey verwaltet Userskripte und deren Resourcen, im Gegensatz zu Greasemonkey, intern und legt diese nicht direkt zugänglich im Dateisystem ab. Somit sind die Userskripte nicht per Dateizugriff für Drittprogramme erreichbar. Für die Entwicklung muss der interne Editor verwendet werden. Versionsverwaltungstools wie Git können nicht verwendet werden.

Dieser Artikel beschreibt, wie man das GC little helper II Userskript (GClh) außerhalb vom Tampermonkey als lokale Kopie ablegen und bearbeiten kann. Dies erleichtert die Entwicklung, ermöglicht den Einsatz eines externen Editors nach Wahl und die Verwendung eines Versionskontrollsystems.

Dieser Artikel bezieht sich auf den Einsatz von Tampermonkey im Mozilla Firefox bzw. Google Chrome Browser. 

## Schritt-für-Schritt Anleitung
Im weiteren Verlauf wird davon ausgegangen, dass eine lokale Kopie vom GClh und dessen Resourcen besteht, z.B. ein geklontes Git Repository.

### Schritt 1: Vorbereitung
Damit Tampermonkey auf lokale Dateien zugreifen kann, muss die Konfiguration angepasst werden.
**Achtung:** Diese Einstellungen gelten für alle Userscripte und stellen ein allgemeines Sicherheitsrisiko dar!

#### Mozilla Firefox:
 - Im Tampermonkey Menü den Punkt *Übersicht* auswählen.
 - Den Tab *Einstellungen* auswählen
 - Die Sektion *Sicherheit* auswählen
 - Beim Punkt *Das Lesen von lokalen Dateien durch Scripte erlauben* in der Dropdown-Box `Externals @require and @resource` auswählen.

#### Google Chrome:
 - Gehe zur Seite der Chrome Extensions: chrome://extensions/ (einfach in die Adresszeile eintippen)
 - Suche die Extension "Tampermonkey" und klicke auf *Details*
 - Aktiviere den Punkt *Zugriff auf Datei-URLs zulassen*

### Schritt 2: Original GClh deaktivieren
Um einen reibungslosen Betrieb zu gewährleisten darf nur eine Instanz von GClh aktiv sein. Das Original GClh muss deaktivieren werden. Sollte doch mehr als eine Instanz von GClh aktiv sein, wird eine Warnmeldung ausgegeben.

 - Im Tampermonkey Menü den Punkt Übersicht auswählen.
 - Den Tab "Installierte Userscripts" auswählen
 - Original "GC little helper II" über Schieberegler deaktivieren
 
### Schritt 3: Stub erstellen
- Ein neues Userskript erstellen, z.B. mit dem Namen `GC little helper II (Dev)`
- Den Header vom Original GClh in den Stub kopieren

### Schritt 4: Einfügen des Verweises auf die lokale Kopie
Ans Ende des Headers des Stubs muss ein Verweis auf die lokale Kopie vom GClh eingefügt werden.
```
// @require          file:///C://GClh-dev/gc_little_helper_II.user.js
```

### Schritt 5: Header Update
Sollte sich in der lokale Kopie der Header ändern, muss dies auch im Stub nachgezogen werden.

## Externe Resourcen lokal laden
Möchte man externe Resourcen lokal bearbeiten müssen entsprechende Verweise im Stub angepasst werden

```
// @require          https://raw.githubusercontent.com/2Abendsegler/GClh/master/data/gclh_defi.js
```
zu
```
// @require          file:///C:/projects/gclh/GClh/data/gclh_defi.js
```

## Einschränkungen und Probleme
- Ein Update überschreibt den erstellten Stub mit dem Original GClh. Daher sollte auf das Update über den eingebauten Update-Mechanismus verzichtet werden und das Script im lokalen Dateisystem per Git aktualisiert werden.
- Wenn sich die Versionsnummer ändern, muss auch die Versionsnummer im Stub angepasst werden, da sonst Tampermonkey (bzw. der eingebaute Update-Mechanismus) eine neue Version des Scripts meldet und zu aktualisieren versucht.
