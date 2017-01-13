# GClh
GC little helper II


Branches: 
=========
  Ebenen:               Beispiel
  1. Kunde   2. Collector   3. Projekte   4. Development   
  ---------------------------------------------------------
  master     collector      v0.2.2.4      develop_fe
                                          develop_2
                            v0.2.3        develop_fe
                                          develop_LittleJohn
                                          develop_CF
                            translation   develop_hugo

4. Ebene Development: Die Namen der Development Branches der Contributoren (Mitarbeiter) auf dem GitHub von 2Abendsegler beginnen mit "develop_" und enthalten folgend einen beliebigen Qualifier für den User. Forked der Entwickler auf seinen eigenen GitHub Account, ist man in der Namensgebung natürlich frei. Geforked wird von der 3. Ebene, der Projektebene je nachdem, für welches Projekt man entwickelt. Für unser Beispiel unten: Hilft man beim Bugfixing der aktuellen Version V0.2.2, forked man vom Projekt v0.2.32.4. Entwickelt man für die nächste Version, dann forked man von v0.2.3.  

3. Ebene Projekt: Die nächste Ebene ist die Projektebene. Sie soll Raum dafür bieten, dass gleichzeitig in Rahmen mehrerer Projekte entwickelt werden kann. Das ist insbesondere für das Bugfixing zur aktuellen Version (kleine Version) und für die eigentliche Weiterentwicklung zur nächsten Version notwendig. Kommt aber auch gegebenenfalls zum Einsatz, wenn längerfristige Projekte entwickelt werden, für die eine Version noch gar nicht feststeht.


2. Ebene Collector: Die branch Collector dient als Sammler aller Bestandteile für die nächste Version bzw. für die nächste kleine Bugfixing Version. Der Collector ist der default, er wird beim mergen automatisch vorgeschlagen. Damit wird verhindert, dass aus versehen in den master gemerged wird, der im standard den default bildet. Zudem kann zeitunkritisch auch gegebenenfalls aus mehreren Branches hier gemered und nachgearbeitet werden und nochmal ein Kompletttest durchgeführt werden. 
Beispiel: Im Collector könnten beispielsweise die nächste Version v0.2.3, die nächste kleine Bugfixing Version, die es nicht mehr eigenständig geschafft hat, und eine größere längerfristige Entwicklung eingesammelt werden.

1. Die branch master enthält die aktuelle Version beim Kunden und dient auch zum Abruf durch den Kunden.



	

