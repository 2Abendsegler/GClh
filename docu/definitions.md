<a href="#user-content-branch" title="Branch">Branch</a> &nbsp; 
<a href="#user-content-issue" title="Issue">Issue</a> &nbsp; 
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

### 1. User  
Hier gibt es genau eine Branch *master*. Sie enthält die aktuelle Version für die User und dient den Usern zum Abrufen neuer Versionen.

### 2. Collector  
Hier gibt es derzeit genau eine Branch *collector*. Sie dient als Sammler aller Bestandteile für eine Version vor der Auslieferung an die User, dem Transport in den “master”.  

Der *collector* ist die standard (default) Branch. Er wird beim Transportieren automatisch als Empfänger vorgeschlagen. Damit wird unter anderem sichergestellt, dass nicht aus versehen in den “master” transportiert wird.  

Außerdem kann zeitunkritisch, auch gegebenenfalls aus mehreren Branches, in den *collector* transportiert werden, die Sammlung nachbearbeitet werden und gegebenenfals auch ein Kompletttest durchgeführt werden, bevor die Sammlung als neue Version den Usern zur Verfügung gestellt wird.  



---
