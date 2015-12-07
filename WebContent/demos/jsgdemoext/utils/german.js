JSGDemo.namespace("JSGDemo");

/**
 * German implementation of strings. Here we simply fill the array items. The translated
 * items are stored by its English identifier. This way the base class can retrieve
 * the translated string using the identifier. 
 *
 * @class JSGDemo.German
 * @constructor
 */
JSGDemo.German = function() {
    JSGDemo.German._super.constructor.apply(this, arguments);

    this.strings["Add"]="Zufügen";
    this.strings["Add Label"]="Text zufügen";
    this.strings["Add to container"]="Zum Container hinzufügen";
    this.strings["Align by Column"]="Nach Spalten anordnen";
    this.strings["Align by Column, x ascending"]="Nach Spalten anordnen, X Aufsteigend";
    this.strings["Align by Column, x/y ascending"]="Nach Spalten anordnen, X/Y Aufsteigend";
    this.strings["Align by Column, y ascending"]="Nach Spalten anordnen, Y Aufsteigend";
    this.strings["Align by Row"]="Nach Zeilen anordnen";
    this.strings["Align by Row x/y ascending), "]="Nach Zeilen anordnen, X/Y Aufsteigend";
    this.strings["Align by Row, x ascending"]="Nach Zeilen anordnen, X Aufsteigend";
    this.strings["Align by Row, y ascending"]="Nach Zeilen anordnen, Y Aufsteigend";
    this.strings["Align:"]="Ausrichten:";
    this.strings["Apply"]="Anwenden";
    this.strings["Apply Flow Layout"]="Flow Layout anwenden";
    this.strings["Apply Grid Layout"]="Grid Layout anwenden";
    this.strings["Arrow End"]="Pfeil Ende";
    this.strings["Arrow Start"]="Pfeil Anfang";
    this.strings["Arrow Styles"]="Pfeilspitzen";
    this.strings["Arrows"]="Pfeile";
    this.strings["Attraction:"]="Anziehung";
    this.strings["Blur"]="Weich zeichnen";
    this.strings["Bottom"]="Unten";
    this.strings["Bottom (mm):"]="Unten (mm):";
    this.strings["Cancel"]="Abbrechen";
    this.strings["Center"]="Zentrieren";
    this.strings["Center Footer:"]="Fußzeile Mitte:";
    this.strings["Center Header:"]="Kopfzeile Mitte:";
    this.strings["Change"]="Ändern";
    this.strings["Close"]="Schließen";
    this.strings["Close Shape"]="Form schließen";
    this.strings["Column Gap:"]="Spaltenabstand";
    this.strings["Container"]="Container";
    this.strings["Coordinates (mm):"]="Koordinaten (mm):";
    this.strings["Copy"]="Kopieren";
    this.strings["Copy Format"]="Format kopieren";
    this.strings["Copy Shapes"]="Form kopieren";
    this.strings["Create"]="Erzeugen";
    this.strings["Create Curved Polygon"]="Bezier erzeugen";
    this.strings["Create Edge"]="Verbindung erzeugen";
    this.strings["Create Ellipse"]="Ellipse erzeugen";
    this.strings["Create Graph for Force Layout"]="Graph für Force Layout erzeugen";
    this.strings["Create Graph for Tree Layout"]="Graph für Baum Layout erzeugen";
    this.strings["Create Grid"]="Grid erzeugen";
    this.strings["Create Hierchical Graph"]="Hierarchischen Graph erzeugen";
    this.strings["Create Line"]="Linie erzeugen";
    this.strings["Create Orthogonal Edge"]="Orthogonale Linie erzeugen";
    this.strings["Create Polygon"]="Polygon erzeugen";
    this.strings["Create Polyline"]="Polylinie erzeugen";
    this.strings["Create Rectangle"]="Rechteck erzeugen";
    this.strings["Create Scrollable Container"]="Scrollbaren Container erzeugen";
    this.strings["Create Shape"]="Form erzeugen";
    this.strings["Create Text"]="Text erzeugen";
    this.strings["Curve"]="Kurve";
    this.strings["Custom Width"]="Breite";
    this.strings["Custom Zoom"]="Zoom";
    this.strings["Custom:"]="Benutzerdefiniert:";
    this.strings["Cut"]="Ausschneiden";
    this.strings["Cut items"]="Ausschneiden";
    this.strings["Default Link"]="Standardverbinder";
    this.strings["Define Default Link"]="Standardverbinder festlegen";
    this.strings["Define Font Format"]="Schriftart festlegen";
    this.strings["Define Line"]="Linie festlegen";
    this.strings["Define Text Format"]="Textformat festlegen";
    this.strings["Delete"]="Löschen";
    this.strings["Delete Point"]="Punkt löschen";
    this.strings["Delete selected items"]="Ausgewählte Objekte löschen";
    this.strings["Depth"]="Tiefe";
    this.strings["Direction"]="Richtung";
    this.strings["Direction:"]="Richtung:";
    this.strings["Double List bottom up (Centered)"]="Doppelte zentrierte Liste (von unten)";
    this.strings["Double List left to right (Centered)"]="Doppelte zentrierte Liste (von links)";
    this.strings["Double List right to left (Centered)"]="Doppelte zentrierte Liste (von rechts)";
    this.strings["Double List top down (Centered)"]="Doppelte zentrierte Liste (von oben)";
    this.strings["Down"]="Nach unten";
    this.strings["Drawings"]="Zeichnungen";
    this.strings["Edge Type:"]="Verbindungstyp:";
    this.strings["Edit"]="Bearbeiten";
    this.strings["Edit Points"]="Punkte bearbeiten";
    this.strings["Edit Points Menu"]="Punkte bearbeiten";
    this.strings["Ellipse"]="Ellipse";
    this.strings["Endless Paper"]="Endlospapier";
    this.strings["Enter url of svg file..."]="URL der SVG Datei eingeben...";
    this.strings["Execute"]="Ausführen";
    this.strings["Fill"]="Füllung";
    this.strings["Fill Format"]="Füllmuster";
    this.strings["Filter"]="Filter";
    this.strings["Filter Settings"]="Filtereinstellungen";
    this.strings["Flow bottom up"]="Hierarchisches Layout (von unten)";
    this.strings["Flow Layouts"]="Hierarchische Layouts";
    this.strings["Flow layouts using predefined configuration"]="Hierarchisches Layout (Benutzerdefiniert)";
    this.strings["Flow left to right"]="Hierarchisches Layout (von links)";
    this.strings["Flow right left"]="Hierarchisches Layout (von rechts)";
    this.strings["Flow top down"]="Hierarchisches Layout (von oben)";
    this.strings["Font"]="Schrift";
    this.strings["Font Color"]="Schriftfarbe";
    this.strings["Font Name:"]="Schriftname:";
    this.strings["Font Size:"]="Schriftgröße:";
    this.strings["Footer"]="Fußzeile";
    this.strings["Footer (mm):"]="Fußzeile (mm):";
    this.strings["Force:"]="Force:";
    this.strings["Format"]="Format";
    this.strings["General"]="Standard";
    this.strings["Gradient"]="Verlauf";
    this.strings["Gravitation:"]="Anziehung:";
    this.strings["Grid"]="Raster";
    this.strings["Grid Style"]="Rasterstil";
    this.strings["Crosses"]="Kreuze";
    this.strings["Dots"]="Punkte";
    this.strings["Grid Layouts"]="Grid Layout";
    this.strings["Grid layouts using predefined configuration"]="Grid Layout (Benutzerdefiniert)";
    this.strings["Grid:"]="Grid:";
    this.strings["Group"]="Gruppe";
    this.strings["Header"]="Kopfzeile";
    this.strings["Header (mm):"]="Kopfzeile (mm):";
    this.strings["Height (mm):"]="Höhe (mm):";
    this.strings["Height:"]="Höhe:";
    this.strings["Hierarchical:"]="Hierarchisch:";
    this.strings["Highest"]="Höchste";
    this.strings["Horizontal"]="Horizontal";
    this.strings["Horizontal Alignment"]="Horizontale Ausrichtung";
    this.strings["Horizontal Position"]="Horizontale Position";
    this.strings["HV Line"]="HV Linie";
    this.strings["HV Tree bottom up"]="HV Baum (von unten)";
    this.strings["HV Tree left to right"]="HV Baum (von links)";
    this.strings["HV Tree right to left"]="HV Baum (von rechts)";
    this.strings["HV Tree top down"]="HV Baum (von oben)";
    this.strings["Hyperlink"]="Hyperlink";
    this.strings["Image"]="Bild";
    this.strings["Insert"]="Einfügen";
    this.strings["Items per Line:"]="Objekte pro Zeile";
    this.strings["Label"]="Label";
    this.strings["Landscape"]="Horizonal";
    this.strings["Large Graph"]="Großer Graph";
    this.strings["Large Tree"]="Großer Baum";
    this.strings["Layer Distance:"]="Ebenenabstand:";
    this.strings["Layout"]="Layout";
    this.strings["Layout Tree using predefined configuration"]="Benutzerdefiniertes Baumlayout";
    this.strings["Left"]="Links";
    this.strings["Left (mm):"]="Links (mm):";
    this.strings["Left Footer:"]="Linke Fußzeile:";
    this.strings["Left Header:"]="Linke Kopfzeile:";
    this.strings["Libraries"]="Bibliotheken";
    this.strings["Line"]="Linie";
    this.strings["Line Format"]="Linienformat";
    this.strings["Linear 135 degrees"]="Linear 135 Grad";
    this.strings["Linear 225 degrees"]="Linear 225 Grad";
    this.strings["Linear 315 degrees"]="Linear 315 Grad";
    this.strings["Linear 45 degrees"]="Linear 45 Grad";
    this.strings["Linear Bottom Top"]="Linear (von unten)";
    this.strings["Linear Left Right"]="Linear (von links)";
    this.strings["Linear Right Left"]="Linear (von rechts)";
    this.strings["Linear Top Bottom"]="Linear (von oben)";
    this.strings["Lines"]="Linien";
    this.strings["List bottom up (Centered)"]="Zentrierte Liste (von unten)";
    this.strings["List left to right (Centered)"]="Zentrierte Liste (von links)";
    this.strings["List right to left (Centered)"]="Zentrierte Liste (von rechts)";
    this.strings["List top down (Centered)"]="Zentrierte Liste (von oben)";
    this.strings["Margins"]="Ränder";
    this.strings["Medium Graph"]="Mittelgroßer Graph";
    this.strings["Medium Tree"]="Mittelgroßer Baum";
    this.strings["Middle"]="Mitte";
    this.strings["Move down"]="Weiter unten";
    this.strings["Move Down"]="Weiter unten";
    this.strings["Move to Bottom"]="Nach unten";
    this.strings["Move to Top"]="Nach oben";
    this.strings["Move up"]="Weiter oben";
    this.strings["n Items per row"]="n Formen pro Zeile";
    this.strings["n Items per row, x ascending"]="n Formen pro Zeile, X Aufsteigend";
    this.strings["n Items per row, x/y ascending"]="n Formen pro Zeile, X/Y Aufsteigend";
    this.strings["n Items per row, y ascending"]="n Formen pro Zeile, Y Aufsteigend";
    this.strings["Name"]="Name";
    this.strings["New"]="Neu";
    this.strings["New Diagram "]="Neues Diagramm";
    this.strings["New Drawing"]="Neues Diagramm";
    this.strings["New Folder"]="Neuer Ordner";
    this.strings["No Gradient"]="Kein Verlauf";
    this.strings["Node Distance:"]="Knotenabstand";
    this.strings["None"]="Keine";
    this.strings["OK"]="OK";
    this.strings["Open"]="Öffnen";
    this.strings["Open Shape"]="Form öffnen";
    this.strings["Order:"]="Reihenfolge:";
    this.strings["OrgChart Layouts"]="Layout Organisationsdiagramm";
    this.strings["OrgCharts using predefined configuration"]="Benutzerdefiniertes Layout Organisationsdiagramm";
    this.strings["Orientation"]="Ausrichtung";
    this.strings["Orthogonal"]="Orthogonal";
    this.strings["Orthogonal Connection"]="Orthogonale Verbindung";
    this.strings["Orthogonal Connection with Arrow"]="Orthogonale Verbindung mit Pfeil";
    this.strings["Page Size"]="Seitengröße";
    this.strings["Paste"]="Einfügen";
    this.strings["Paste Format"]="Format einfügen";
    this.strings["Paste Shapes"]="Formen einfügen";
    this.strings["Please enter the URL and then create the hyperlink object by using the mouse:"]="Bitte eine URL eingeben und dann den Hyperlink durch Aufziehen mit der Maus erzeugen:";
    this.strings["Please enter the URL of the image and then create the image by using the mouse:"]="Bitte eine URL eingeben und dann das Bild durch Aufziehen mit der Maus erzeugen:";
    this.strings["Please enter the URL of the svg file to import."]="Bitte die URL der zu importierenden SVG Datei eingeben.";
    this.strings["Please Wait…"]="Einen Augenblick bitte…";
    this.strings["Polygon"]="Polygon";
    this.strings["Polyline"]="Polylinie";
    this.strings["Portrait"]="Vertikal";
    this.strings["Ports"]="Ports";
    this.strings["Predefined Width"]="Vordefinierte Breite";
    this.strings["Print"]="Drucken";
    this.strings["Print Drawing"]="Diagramm drucken";
    this.strings["Process"]="Prozess";
    this.strings["Radial Bottom Left"]="Radial von unten/links";
    this.strings["Radial Bottom Right"]="Radial von unten/rechts";
    this.strings["Radial from Center"]="Radial vom Zentrum";
    this.strings["Radial Top Left"]="Radial von oben/links";
    this.strings["Radial Top Right"]="Radial von unten/rechts";
    this.strings["Ready"]="Bereit";
    this.strings["Rectangle"]="Rechteck";
    this.strings["Rectangles"]="Rechtecke";
    this.strings["Redo"]="Wiederholen";
    this.strings["Redo last undo command"]="Letzten Befehl wiederholen";
    this.strings["Rejection:"]="Abstoßung:";
    this.strings["Resize:"]="Vergrößern:";
    this.strings["Right"]="Rechts";
    this.strings["Right (mm):"]="Rechts (mm):";
    this.strings["Right Footer:"]="Rechte Fußzeile";
    this.strings["Right Header:"]="Rechte Kopfzeile";
    this.strings["Rounded Orthogonal Connection"]="Abgerundete orthogonale Verbindung";
    this.strings["Rounded Orthogonal Connection with Arrow"]="Abgerundete orthogonale Verbindung mit Pfeil";
    this.strings["Row Gap:"]="Zeilenabstand:";
    this.strings["Save"]="Speichern";
    this.strings["Save Changes?"]="Änderungen speichern?";
    this.strings["Save Drawing"]="Diagramm speichern";
    this.strings["Scale"]="Skalieren";
    this.strings["Scales"]="Lineal";
    this.strings["Selectable"]="Auswählbar";
    this.strings["Settings"]="Einstellungen";
    this.strings["Shadow"]="Schatten";
    this.strings["Shadow Color"]="Schattenfarbe";
    this.strings["Shapes"]="Formen";
    this.strings["Should the image only contain the selection objects?"]="Soll das Bild nur die ausgewählten Formen enthalten";
    this.strings["Show Pages"]="Seiten anzeigen";
    this.strings["Size to Max"]="An größte anpassen";
    this.strings["Size to Min"]="An kleinste anpassen";
    this.strings["Small Graph"]="Kleiner Graph";
    this.strings["Small Tree"]="Kleiner Baum";
    this.strings["Smallest"]="Kleinste";
    this.strings["Space:"]="Abstand:";
    this.strings["Stars"]="Sterne";
    this.strings["Start"]="Start";
    this.strings["Straight"]="Gerade";
    this.strings["Straight Connection"]="Gerade Verbindung";
    this.strings["Straight Connection with Arrow"]="Gerade Verbindung mit Pfeil";
    this.strings["Style"]="Stil";
    this.strings["Style:"]="Stil:";
    this.strings["Styles"]="Stile";
    this.strings["Target Color"]="Zielfarbe";
    this.strings["Text"]="Text";
    this.strings["The application has to be reloaded to change the language. There are unsaved changes. Would like to save these?"]="Für das Ändern der Sprache muss die Anwendung neu geladen werden. Es gibt ungespeicherte Änderungen. Sollen diese gespeichert werden?";
    this.strings["The selected diagrams will permanently deleted. Continue anyway?"]="Die ausgewählten Diagramme werden gelöscht. Fortfahren?";
    this.strings["There are unsaved changes. These will not be reflected in the export file, unless they are saved. Would like to save these?"]="Es gibt ungespeicherte Änderungen. Diese werden beim Export nicht berücksichtigt, wenn sie nicht gespeichert werden. Sollen diese gespeichert werden?";
    this.strings["To Bottom"]="Nach Unten";
    this.strings["To Top"]="Nach Oben";
    this.strings["Top"]="Oben";
    this.strings["Top (mm):"]="Oben (mm):";
    this.strings["Transparency"]="Transparenz";
    this.strings["Tree bottom up (Centered)"]="Baum (von unten, zentriert)";
    this.strings["Tree bottom up (Left aligned)"]="Baum (von unten, links)";
    this.strings["Tree bottom up (Right aligned)"]="Baum (von unten, rechts)";
    this.strings["Tree Layouts"]="Baum Layouts";
    this.strings["Tree left to right (Centered)"]="Baum (von links, zentriert)";
    this.strings["Tree left to right (Left aligned)"]="Baum (von links, links)";
    this.strings["Tree left to right (Right aligned)"]="Baum (von links, rechts)";
    this.strings["Tree left to right / Double list top down"]="Baum (von links, doppelte Liste)";
    this.strings["Tree left to right / List left to right"]="Baum (von links, Liste von links)";
    this.strings["Tree left to right / List top down"]="Baum (von links, Liste von oben)";
    this.strings["Tree right to left (Centered)"]="Baum (von rechts, zentriert)";
    this.strings["Tree right to left (Left aligned)"]="Baum (von rechts, links)";
    this.strings["Tree right to left (Right aligned)"]="Baum (von rechts, rechts)";
    this.strings["Tree top down (Centered)"]="Baum (von oben, zentriert)";
    this.strings["Tree top down (Left aligned)"]="Baum (von oben, links)";
    this.strings["Tree top down (Right aligned)"]="Baum (von oben, rechts)";
    this.strings["Tree top down / Double list top down"]="Baum (von oben, doppelte Liste)";
    this.strings["Tree top down / List left to right"]="Baum (von oben, Liste von links)";
    this.strings["Tree top down / List top down"]="Baum (von oben, Liste von rechts)";
    this.strings["Tree:"]="Baum:";
    this.strings["Two Graphs"]="Zwei Graphen";
    this.strings["Two Trees"]="Zwei Bäume";
    this.strings["Type:"]="Typ:";
    this.strings["Undo"]="Rückgängig";
    this.strings["Undo last command"]="Letzten Befehl rückgängig machen";
    this.strings["Ungroup"]="Gruppe aufheben";
    this.strings["Up"]="Nach oben";
    this.strings["URL"]="URL";
    this.strings["Vertical"]="Vertikal";
    this.strings["Vertical Position"]="Vertikale Position";
    this.strings["View"]="Ansicht";
    this.strings["View Mode"]="Ansicht";
    this.strings["Visible"]="Sichtbar";
    this.strings["Warning"]="Warnung";
    this.strings["Widest"]="Breiteste";
    this.strings["Width"]="Breite";
    this.strings["Width (mm):"]="Breite (mm):";
    this.strings["Width:"]="Breite:";
    this.strings["x Items per column"]="X Objekte pro Spalte";
    this.strings["x Items per column, x ascending"]="X Objekte pro Spalte, X Aufsteigend";
    this.strings["x Items per column, x/y ascending"]="X Objekte pro Spalte, X/Y Aufsteigend";
    this.strings["x Items per column, y ascending"]="X Objekte pro Spalte, Y Aufsteigend";
    this.strings["X:"]="X:";
    this.strings["Y:"]="Y:";
    this.strings["You are closing a Diagram that has unsaved changes. Would you like to save your changes?"]="Sie möchten ein Diagramm mit ungespeicherten Änderungen schließen. Möchten Sie diese zuerst speichern?";
    this.strings["Zoom"]="Vergrößerung";
    this.strings["Zoom to Fit"]="Vergrößerung anpassen";
    this.strings["Tree Left</br>Aligned"] = "Baum links</br>ausgerichtet";  
    this.strings["Tree Center</br>Aligned"] = "Baum zentriert</br>ausgerichtet";  
    this.strings["Tree Right</br>Aligned"] = "Baum rechts</br>ausgerichtet";  
    this.strings["Single List"] = "Einfache Liste";  
    this.strings["Double List"] = "Doppelte Liste";  
    this.strings["Horizontal</br>Vertical</br>Tree"] = "Horizontaler</br>Vertikaler</br>Baum";  
    this.strings["Tree (TB) combined</br>with List"] = "Baum (von oben)</br>kombiniert mit</br>Liste";  
    this.strings["Tree (LR) combined</br>with List"] = "Baum (von links)</br>kombiniert mit</br>Liste";  
    this.strings["Tree combined</br>with Double List"] = "Baum kombiniert</br>mit doppelter</br>Liste";  
    this.strings["Generic Flow"] = "Hierarchisch";  
    this.strings["Generic Flow (LongestPath)"] = "Hierarchisch</br>L&#228;ngster Pfad";  
    this.strings["n Items per row"] = "X Objekte pro Zeile";  
    this.strings["n Items per column"] = "X Objekte pro Spalte";  
    this.strings["Matrix Align by Row"] = "Matrix Anordung nach Zeile";  
    this.strings["Matrix Align by Column"] = "Matrix Anordung nach Spalte";
    this.strings["New Organizational Chart"] = "Neues Organigramm";
    this.strings["Change to Edge"] = "Eckig machen";
    this.strings["Change to Curve"] = "Abrunden";
    this.strings["Finish editing"] = "Punktbearbeitung beenden";
    this.strings["Names"] = "Namen";
    this.strings["Show or hide name of Objects"] = "Namen einblenden oder ausblenden";
    this.strings["Page Borders"] = "Seitenränder";
    this.strings["Show:"] = "Anzeigen:";
    this.strings["Line Cap"] = "Linienabschluss";
    this.strings["Watermark"] = "Wasserzeichen";
    this.strings["Please enter the watermark text:"] = "Bitte geben Sie den Text für das Wasserzeichen ein";
};
JSG.extend(JSGDemo.German, JSGDemo.Default);
