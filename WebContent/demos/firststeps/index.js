'use strict';

var graphEditor;
var graph;
var sampleCode;

function insertCode() {
    var sections = document.getElementsByTagName('pre');
    var i;

    function getFunctionCode(obj, funcName) {
        var f;

        for (f in obj) {
            if ( typeof (obj[f]) === "function" && obj.hasOwnProperty(f) && f === funcName) {
                return obj[f].toString();
            }
        }
    }

    for ( i = 0; i < sections.length; i++) {
        var section = sections[i];
        if (section.attributes.source) {
            var attr = section.attributes.source;
            var code = getFunctionCode(sampleCode, attr.value);
            if (code === undefined) {
                code = attr.value.toString();
            } 

            code = code.replace(/\n    /g, '\n');
            code = code.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
            section.innerHTML = code;
            
        }
    }

    prettyPrint();
}

function onWindowLoaded() {
    function resizeCanvas() {
        var border = 15;
        var canvas = document.getElementById("canvas1");
        var graphDIV = document.getElementById("graph");
        var guideDIV = document.getElementById("guide");
        var toolsDIV = document.getElementById("tools");

        graphDIV.style.top = border + "px";
        graphDIV.style.height = window.innerHeight - border * 2 + "px";
        graphDIV.style.left = window.innerWidth / 2 + border / 2 + "px";
        graphDIV.style.width = window.innerWidth / 2 - border * 3 / 2 + "px";

        guideDIV.style.left = border + "px";
        guideDIV.style.top = border + "px";
        guideDIV.style.width = window.innerWidth / 2 - border * 3 / 2 + "px";
        guideDIV.style.height = window.innerHeight - border * 2 + "px";
        
        if (toolsDIV) {
            canvas.height = graphDIV.clientHeight - toolsDIV.clientHeight - 5;
        } else {
            canvas.height = graphDIV.clientHeight;
        }
        canvas.width = graphDIV.clientWidth;
        graphEditor.resizeContent(canvas.width, canvas.height);
    }

    insertCode();

    graphEditor = new JSG.ui.GraphEditor("canvas1");
    graph = new JSG.graph.model.Graph();
    graphEditor.setGraph(graph);

    resizeCanvas();

    setTimeout(resizeCanvas, 1000);

    window.onload = window.onresize = resizeCanvas;
}

var Samples = function() {

    this.createNode = function() {
        // create rectangular node
        var node = graph.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape()));

        node.getPin().setCoordinate(3000, 3000);
        node.setSize(2000, 3000);

        // create ellipsoid node
        node = graph.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.EllipseShape()));

        node.getPin().setCoordinate(3000, 8000);
        node.setSize(3000, 2000);

        graphEditor.invalidate();
    };

    this.createEdge = function() {
        // create straight edge
        var edge = graph.addItem(new JSG.graph.model.Edge());
        edge.setStartPointTo(new JSG.geometry.Point(8000, 2000));
        edge.setEndPointTo(new JSG.geometry.Point(9000, 6000));

        // create orthogonal edge
        edge = graph.addItem(new JSG.graph.model.Edge(new JSG.graph.model.shapes.OrthoLineShape()));
        edge.init(new JSG.geometry.Point(3000, 15000), new JSG.geometry.Point(5000, 12000));

        graphEditor.invalidate();
    };

    this.createLink = function() {
        // create two nodes with ellipsoid shape
        var node = graph.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.EllipseShape()));
        node.getPin().setCoordinate(12000, 3000);
        node.setSize(1000, 2000);
        var portSource = node.addCenterPort();

        node = graph.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.EllipseShape()));
        node.getPin().setCoordinate(12000, 8000);
        node.setSize(1000, 2000);
        var portTarget = node.addCenterPort();

        // create edge and attach it to the previously created ports
        var edge = graph.addItem(new JSG.graph.model.Edge());
        edge.setSourcePort(portSource);
        edge.setTargetPort(portTarget);

        graphEditor.invalidate();
    };

    this.createDrawing = function() {
        // start with clean editor
        graphEditor.clear();

        // add wheels
        var x = 2500, i, node;
        
        for (i = 0; i < 4; i++) {
            node = graph.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.EllipseShape()));
            node.getPin().setCoordinate(x, 6000);
            node.setSize(1500, 1500);
            node = graph.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.EllipseShape()));
            node.getPin().setCoordinate(x, 6000);
            node.setSize(750, 750);
            x += i === 1 ? 5000 : 3000;
        }

        // add truck
        node = graph.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.PolygonShape()));
        node.getPin().setCoordinate(4000, 3750);
        node.setSize(6500, 4000);
        // define polygon points of truck (as factor of node dimensions)
        node.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(0.15, 0));
        node.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(1, 0));
        node.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(1, 1));
        node.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(0, 1));
        node.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(0, 0.45));
        var portTarget = node.addCenterPort();

        // add trailer
        node = graph.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape()));
        node.getPin().setCoordinate(12000, 3750);
        node.setSize(6500, 4000);
        node.addLabel("Trailer");
        var portSource = node.addCenterPort();

        // add window
        node = JSG.graph.model.GraphItemFactory.prototype.createItemFromString("roundRect");
        node = graph.addItem(node);
        node.getPin().setCoordinate(4500, 2750);
        node.setSize(5000, 1500);

        var edge = graph.addItem(new JSG.graph.model.Edge());
        edge.setSourcePort(portSource);
        edge.setTargetPort(portTarget);

        graphEditor.invalidate();
    };

    this.formatDrawing = function() {
        // start with clean editor
        graphEditor.clear();

        // add wheels
        var x = 2500, i, node;
        
        for (i = 0; i < 4; i++) {
            node = graph.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.EllipseShape()));
            node.getPin().setCoordinate(x, 6000);
            node.setSize(1500, 1500);
            // set color
            node.getFormat().setFillColor("#5b0f00");
            // define shadow for tire
            node.getFormat().setShadowOffsetX(150);
            node.getFormat().setShadowOffsetY(150);
            node.getFormat().setShadowBlur(10);
            node.getFormat().setShadowColor("#333333");
            
            node = graph.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.EllipseShape()));
            node.getPin().setCoordinate(x, 6000);
            node.setSize(750, 750);
            node.getFormat().setFillColor("#CCCCCC");
            x += i === 1 ? 5000 : 3000;
        }

        // add truck
        node = graph.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.PolygonShape()));
        node.getPin().setCoordinate(4000, 3750);
        node.setSize(6500, 4000);
        // define polygon points of truck (as factor of node dimensions)
        node.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(0.15, 0));
        node.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(1, 0));
        node.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(1, 1));
        node.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(0, 1));
        node.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(0, 0.45));
        node.getFormat().setFillColor("#fff2cc");
        var portTarget = node.addCenterPort();

        // add trailer
        node = graph.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape()));
        node.getPin().setCoordinate(12000, 3750);
        node.setSize(6500, 4000);
        var label = node.addLabel("JS Graph");
        // text formatting
        label.getTextFormat().setFontSize(18);
        label.getTextFormat().setFontColor("#0000FF");
        node.getFormat().setFillColor("#fff2cc");
        var portSource = node.addCenterPort();

        // add window
        node = JSG.graph.model.GraphItemFactory.prototype.createItemFromString("roundRect");
        node = graph.addItem(node);
        node.getPin().setCoordinate(4500, 2750);
        node.setSize(5000, 1500);
        // define a linear gradient
        node.getFormat().setFillStyle(JSG.graph.attr.FormatAttributes.FillStyle.GRADIENT);
        node.getFormat().setFillColor("#cfe2f3");

        var edge = graph.addItem(new JSG.graph.model.Edge());
        edge.setSourcePort(portSource);
        edge.setTargetPort(portTarget);
        edge.getFormat().setLineColor("#CCFFCC");
        edge.getFormat().setLineWidth(150);
        // 1/100th mm

        graphEditor.invalidate();

        return label;
    };

    this.moveDrawing = function() {
        var label = this.formatDrawing();
        var animation = new JSG.anim.Animation(JSG.anim.AnimationType.LINEAR, this);

        function animate(progress) {
            var i, n;
            
            for (i = 0, n = graph.getItemCount(); i < n; i++) {
                var node = graph._subItems[i];
                // move object vertically by 0.5 cm
                node.translate(0, 50);
            }
            // rotate trailer label
            label.setAngle(progress * Math.PI * 2);
            graphEditor.invalidate();
        }

        // 2 sec animation...
        animation.start(animate, 2000);

    };

    this.pagePageSettings = function() {
        // set page to page mode and change page settings
        var page = graph.getSettings().getPage();
        page.setFormat(JSG.graph.model.settings.PageSize.A5);
        page.setOrientation(JSG.graph.model.settings.PageOrientation.LANDSCAPE);

        // create a node to generate pages
        var node = graph.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape()));
        node.getPin().setCoordinate(25000, 30000);
        node.setSize(3000, 3000);

        graphEditor.setZoom(0.5);
        graphEditor.setDisplayMode(JSG.ui.graphics.DisplayMode.PAGE);
        graphEditor.invalidate();
    };

    this.endlessPageSettings = function() {
        // create a node to generate pages
        var node = graph.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape()));
        node.getPin().setCoordinate(25000, 30000);
        node.setSize(3000, 3000);

        graphEditor.setZoom(0.5);
        graphEditor.setDisplayMode(JSG.ui.graphics.DisplayMode.ENDLESS);
        graphEditor.invalidate();
    };

    this.localPinAtCenter = function() {
        // start with clean editor
        this.clean();

        // create rectangular nodes
        // define size first and then set the pin
        var node = graph.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape()));
        node.setSize(3000, 3000);
        node.getPin().setCoordinate(5000, 2000);

        // define pin and a local pin and then set the size
        node = graph.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape()));
        node.getPin().setCoordinate(5000, 6000);
        node.getPin().setLocalCoordinate(0, 0);
        node.setSize(3000, 3000);

        // define pin and a local pin using formulas and then set the size
        node = graph.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape()));
        node.getPin().setCoordinate(5000, 13000);
        node.getPin().setLocalCoordinate(new JSG.graph.expr.NumberExpression(0, "WIDTH * 0.25"), new JSG.graph.expr.NumberExpression(0, "HEIGHT * 0.75"));
        node.getPin().evaluate();
        node.setSize(3000, 3000);

        graphEditor.invalidate();
    };

    this.nodesWithFormula = function() {
        // start with clean editor
        this.clean();

        // create rectangular node
        var nodeSource = graph.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape()));
        nodeSource.setSize(3000, 3000);
        nodeSource.getPin().setCoordinate(3000, 5000);
        var label = nodeSource.addLabel("Move me");
        label.setItemAttribute(JSG.graph.attr.ItemAttributes.SELECTIONMODE, JSG.graph.attr.consts.SelectionMode.NONE);

        // define the pin y coordinate to depend on the previous nodes y coordinates
        var nodeTarget = graph.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape()));
        nodeTarget.setSize(3000, 3000);
        nodeTarget.getPin().setCoordinate(new JSG.graph.expr.NumberExpression(0, "5000 + Item." + nodeSource.getId() + "!Pin_X"), new JSG.graph.expr.NumberExpression(0, "Item." + nodeSource.getId() + "!Pin_Y"));
        //changed nodes coordinate after node was added to graph, so we have to evaluate ourself
        nodeTarget.evaluate();
        // defines item as not moveable -> formula will not be overwritten
        nodeTarget.setItemAttribute(JSG.graph.attr.ItemAttributes.MOVEABLE, JSG.graph.attr.consts.Moveable.NONE);
        nodeTarget.setItemAttribute(JSG.graph.attr.ItemAttributes.SIZEABLE, false);

        graphEditor.invalidate();
    };

    this.lineWithFormula = function() {
        // start with clean editor
        this.clean();

        // create rectangular node
        var nodeSource = graph.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.EllipseShape()));
        nodeSource.setSize(1000, 1000);
        nodeSource.getPin().setCoordinate(2000, 2000);
        nodeSource.setItemAttribute(JSG.graph.attr.ItemAttributes.SIZEABLE, false);
        nodeSource.getFormat().setFillColor("#FF0000");
        nodeSource.getFormat().setBrightness(new JSG.graph.expr.NumberExpression(0, "PIN_Y / 150"));
        //changed format expression after node was added to graph, so we have to evaluate ourself
        nodeSource.evaluate();

        var label = nodeSource.addLabel("Move me");
        label.setItemAttribute(JSG.graph.attr.ItemAttributes.SELECTIONMODE, JSG.graph.attr.consts.SelectionMode.NONE);

        // define the pin y coordinate to depend on the previous nodes y coordinates
        // create straight edge
        var edge = graph.addItem(new JSG.graph.model.Edge());
        edge.setStartPointTo(new JSG.geometry.Point(8000, 2000));
        edge.setEndPointTo(new JSG.geometry.Point(9000, 6000));
        edge.getFormat().setLineWidth(new JSG.graph.expr.NumberExpression(0, "Item." + nodeSource.getId() + "!PIN_X / 50"));
        //changed format expression after edge was added to graph, so:
        edge.evaluate();

        label.setText(new JSG.graph.expr.Expression(0, "Item." + edge.getId() + "!LINEWIDTH"));
        label.setTextInfoCache(false);
        //changed label expression after label was added, so:
        label.evaluate();

        graphEditor.invalidate();
    };

    this.createSimpleContainer = function() {
        // start with clean editor
        this.clean();

        // create rectangular node
        var container = graph.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape()));
        container.setSize(6000, 6000);
        container.getPin().setCoordinate(8000, 8000);
        container.getFormat().setFillColor("#DDDDDD");

        // add label to container
        var label = container.addLabel("Container");
        label.setItemAttribute(JSG.graph.attr.ItemAttributes.SELECTIONMODE, JSG.graph.attr.consts.SelectionMode.NONE);
        // align it to the bottom
        label.getPin().setCoordinate(new JSG.graph.expr.NumberExpression(0, "Parent!WIDTH * 0.5"), new JSG.graph.expr.NumberExpression(0, "Parent!HEIGHT"));
        label.getPin().setLocalCoordinate(new JSG.graph.expr.NumberExpression(0, "WIDTH * 0.5"), new JSG.graph.expr.NumberExpression(0));
        label.getPin().evaluate();
        //changed pins expression, so evaluate it...

        var node = container.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape()));
        node.setSize(2000, 2000);
        node.getPin().setCoordinate(2000, 3000);

        graphEditor.invalidate();
    };

    this.createAdvancedContainer = function() {
        // start with clean editor
        this.clean();

        // create polygon node
        var container = graph.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.PolygonShape()));
        // define polygon points (as factor of node dimensions)
        container.setSize(6000, 6000);
        container.getPin().setCoordinate(8000, 8000);
        container.getFormat().setFillColor("#DDAADD");
        container.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(0.15, 0));
        container.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(1, 0.15));
        container.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(1, 0.8));
        container.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(0.3, 1));
        container.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(0, 0.45));

        var label = container.addLabel("Container");
        label.setItemAttribute(JSG.graph.attr.ItemAttributes.SELECTIONMODE, JSG.graph.attr.consts.SelectionMode.NONE);
        label.getPin().setCoordinate(new JSG.graph.expr.NumberExpression(0, "Parent!WIDTH * 0.5"), new JSG.graph.expr.NumberExpression(0, "Parent!HEIGHT"));
        label.getPin().setLocalCoordinate(new JSG.graph.expr.NumberExpression(0, "WIDTH * 0.5"), new JSG.graph.expr.NumberExpression(0));
        label.getPin().evaluate();
        //changed pins expression, so evaluate it...

        // add node to container
        var node = container.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape()));
        node.setSize(2000, 2000);
        node.getPin().setCoordinate(4000, 2000);
        label = node.addLabel("Static Node");

        // add node to container using formulas
        node = container.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.EllipseShape()));
        node.setSize(new JSG.graph.expr.NumberExpression(0, "Parent!WIDTH * 0.2"), new JSG.graph.expr.NumberExpression(0, "Parent!HEIGHT * 0.2"));
        node.getPin().setCoordinate(new JSG.graph.expr.NumberExpression(0, "Parent!WIDTH * 0.4"), new JSG.graph.expr.NumberExpression(0, "Parent!HEIGHT * 0.7"));
        node.evaluate();
        //changed some node expressions after adding node to graph, so evaluate it...
        label = node.addLabel("Resizing Node");

        graphEditor.invalidate();
    };

    this.createSymbol = function() {
        // start with clean editor
        this.clean();

        // create rectangular node
        var container = graph.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape()));
        container.setSize(4000, 2000);
        container.getPin().setCoordinate(8000, 8000);
        container.getFormat().setFillColor("#FFFFFF");
        var label = container.addLabel("Symbol");
        label.setItemAttribute(JSG.graph.attr.ItemAttributes.SELECTIONMODE, JSG.graph.attr.consts.SelectionMode.NONE);

        var node = container.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape()));
        node.setSize(600, 600);
        node.getPin().setCoordinate(new JSG.graph.expr.NumberExpression(0, "Parent!WIDTH - 200"), 200);
        node.getPin().setLocalCoordinate(new JSG.graph.expr.NumberExpression(0, "WIDTH * 1"), new JSG.graph.expr.NumberExpression(0));
        node.getPin().evaluate();
        //changed pins expression, so evaluate it...
        node.getFormat().setLineStyle(JSG.graph.attr.FormatAttributes.LineStyle.NONE);
        node.getFormat().setFillStyle(JSG.graph.attr.FormatAttributes.FillStyle.PATTERN);
        node.getFormat().setPattern("images/logo.png");

        graphEditor.invalidate();
    };

    this.clean = function() {
        graphEditor.clear();
        graphEditor.setZoom(1);
        var page = graph.getSettings().getPage();
        page.setFormat(JSG.graph.model.settings.PageSize.A4);
        page.setOrientation(JSG.graph.model.settings.PageOrientation.LANDSCAPE);
        graphEditor.setDisplayMode(JSG.ui.graphics.DisplayMode.PAGE);
    };

    this.formatLine = function() {
        // start with clean editor
        this.clean();

        // create edge
        var edge = graph.addItem(new JSG.graph.model.Edge());
        edge.setStartPointTo(new JSG.geometry.Point(1000, 1000));
        edge.setEndPointTo(new JSG.geometry.Point(6000, 5000));
        // format edges with dashed dotted line, color and line width
        edge.getFormat().setLineStyle(JSG.graph.attr.FormatAttributes.LineStyle.DASHDOTDOT);
        edge.getFormat().setLineWidth(120);
        edge.getFormat().setLineColor("#FFCC00");

        // create orthogonal edge
        edge = graph.addItem(new JSG.graph.model.Edge(new JSG.graph.model.shapes.OrthoLineShape()));
        edge.init(new JSG.geometry.Point(4000, 8000), new JSG.geometry.Point(12000, 12000));

        // format edges with dashed line, color and round corners
        edge.getFormat().setLineCorner(200);
        edge.getFormat().setLineStyle(JSG.graph.attr.FormatAttributes.LineStyle.DASH);
        edge.getFormat().setLineColor("#CC00FF");
        edge.getFormat().setLineWidth(150);

        // format border of rectangle with color and round corners
        var item = graph.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape()));
        item.setSize(4000, 2000);
        item.getPin().setCoordinate(4000, 15000);
        item.getFormat().setLineColor("#AAFFDD");
        item.getFormat().setLineCorner(300);
        item.getFormat().setLineWidth(300);

        graphEditor.invalidate();
    };

    this.formatLineArrow = function() {
        // start with clean editor
        this.clean();

        // create polyline
        var item = new JSG.graph.model.Node(new JSG.graph.model.shapes.PolygonShape());
        graph.addItem(item);

        item.getPin().setCoordinate(8000, 8000);
        item.setSize(5000, 5000);

        item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(0, 0));
        item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(0.5, 0));
        item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(0.5, 0.4));
        item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(1, 0.4));
        item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(1, 1));
        item.setItemAttribute(JSG.graph.attr.ItemAttributes.CLOSED, false);

        // apply line format using arrow
        item.getFormat().setLineWidth(50);
        item.getFormat().setLineArrowEnd(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWDOUBLEFILLED);
        item.getFormat().setLineArrowStart(JSG.graph.attr.FormatAttributes.ArrowStyle.CIRCLEARROWREVERSE);
        // within lines or polylines the fill color is used to fill the arrow heads
        item.getFormat().setFillColor("#FF0000");

        graphEditor.invalidate();
    };

    this.formatFillSolid = function() {
        // start with clean editor
        this.clean();

        var i, item;
        // create objects and fill them with solid colors and apply some transparency
        for (i = 0; i < 360; i += 20) {
            item = new JSG.graph.model.Node(new JSG.graph.model.shapes.EllipseShape());
            graph.addItem(item);
            item.getPin().setCoordinate(9000 + 3000 * Math.cos(Math.PI * i / 180), 6000 + 3000 * Math.sin(Math.PI * i / 180));
            item.setSize(1000, 1000);
            item.getFormat().setFillColorRGB(Math.min(i, 255), 128, 192);
            item.getFormat().setTransparency(i / 180 * 100);
        }

        graphEditor.invalidate();
    };

    this.formatFillGradient = function() {
        // start with clean editor
        this.clean();

        function createNode(x, y) {
            var item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
            graph.addItem(item);
            item.getPin().setCoordinate(x, y);
            item.setSize(2000, 2000);
            item.getFormat().setFillStyle(JSG.graph.attr.FormatAttributes.FillStyle.GRADIENT);
            item.getFormat().setFillColor("#AA00FF");
            item.getFormat().setGradientColor("#AADDFF");

            return item;
        }

        // create objects and fill them with gradients

        // linear gradient
        var item = createNode(2000, 2000);

        // linear gradient with angle
        item = createNode(5000, 2000);
        item.getFormat().setGradientAngle(45);

        // circular gradient
        item = createNode(2000, 6000);
        item.getFormat().setGradientType(JSG.graph.attr.FormatAttributes.GradientStyle.RADIAL);

        // circular gradient with offset
        item = createNode(5000, 6000);
        item.getFormat().setGradientType(JSG.graph.attr.FormatAttributes.GradientStyle.RADIAL);
        item.getFormat().setGradientOffsetX(30);
        item.getFormat().setGradientOffsetY(70);

        graphEditor.invalidate();
    };

    this.formatFillPattern = function() {
        // start with clean editor
        this.clean();

        // create objects and fill them with gradients
        var item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.getPin().setCoordinate(3000, 3000);
        item.setSize(3000, 3000);
        item.getFormat().setFillStyle(JSG.graph.attr.FormatAttributes.FillStyle.PATTERN);
        item.getFormat().setPattern("images/logo.png");

        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.getPin().setCoordinate(9000, 12000);
        item.setSize(15000, 10000);
        item.getFormat().setFillStyle(JSG.graph.attr.FormatAttributes.FillStyle.PATTERN);
        item.getFormat().setPattern("images/logo.png");
        item.getFormat().setPatternStyle(JSG.graph.attr.FormatAttributes.PatternStyle.REPEAT);

        graphEditor.invalidate();
    };

    this.formatShadow = function() {
        // start with clean editor
        this.clean();

        var item;
        // create object
        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.EllipseShape());
        graph.addItem(item);
        item.getPin().setCoordinate(3000, 3000);
        item.setSize(3000, 3000);
        
        // activate shadow by setting a shadow offset
        item.getFormat().setFillColor("#AAFFEE");
        item.getFormat().setShadowOffsetX(200);
        item.getFormat().setShadowOffsetY(200);

        // create object
        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.getPin().setCoordinate(7000, 7000);
        item.setSize(3000, 3000);
        
        // activate shadow by setting a shadow offset and change color and direction
        item.getFormat().setFillColor("#DDAAEE");
        item.getFormat().setShadowOffsetX(300);
        item.getFormat().setShadowOffsetY(300);
        item.getFormat().setShadowColor("#AAAAAA");
        item.getFormat().setShadowDirection(JSG.graph.attr.FormatAttributes.ShadowDirection.LEFTTOP);

        // create object
        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.getPin().setCoordinate(4000, 12000);
        item.setSize(3000, 3000);
        item.setAngle(Math.PI / 3);
        
        // assign a blur effect in addition
        item.getFormat().setFillColor("#FFAACC");
        item.getFormat().setShadowOffsetX(400);
        item.getFormat().setShadowOffsetY(400);
        item.getFormat().setShadowColor("#AAAAAA");
        item.getFormat().setShadowBlur(10);

        graphEditor.invalidate();
    };

    this.formatTextFont = function() {
        // start with clean editor
        this.clean();

        var item;
        var data = [{
            "name" : "Arial"
        }, {
            "name" : "Courier New"
        }, {
            "name" : "Georgia"
        }, {
            "name" : "Lucida"
        }, {
            "name" : "Tahoma"
        }, {
            "name" : "Times New Roman"
        }, {
            "name" : "Trebuchet MS"
        }];

        var i, label, tf;
        // format with different font names, size and style
        for (i = 0; i < 7; i++) {
            item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
            graph.addItem(item);
            item.getPin().setCoordinate(4000 + 1000 * i, 2000 + 2000 * i);
            item.setSize(8000, 1500);
            label = item.addLabel(data[i].name + " " + (10 + i * 2) + " pt");
            tf = label.getTextFormat();
            tf.setFontName(data[i].name);
            tf.setFontSize((10 + i * 2));
            tf.setFontStyle(i);
        }

        graphEditor.invalidate();
    };

    this.formatTextAlignment = function() {
        // start with clean editor
        this.clean();

        var item;
        var label, tf;

        // set text align left and red font color
        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.getPin().setCoordinate(4000, 3000);
        item.setSize(5000, 1500);
        label = item.addLabel("Left aligned\nText");
        tf = label.getTextFormat();
        tf.setHorizontalAlignment(JSG.graph.attr.TextFormatAttributes.TextAlignment.LEFT);
        tf.setFontColor("#FF0000");

        // set text align center and blue font color
        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.getPin().setCoordinate(4000, 6000);
        item.setSize(5000, 1500);
        label = item.addLabel("Center aligned\nText");
        tf = label.getTextFormat();
        tf.setHorizontalAlignment(JSG.graph.attr.TextFormatAttributes.TextAlignment.CENTER);
        tf.setFontColor("#0000FF");

        // set text align right and gray font color
        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.getPin().setCoordinate(4000, 9000);
        item.setSize(5000, 1500);
        label = item.addLabel("Right aligned\nText");
        tf = label.getTextFormat();
        tf.setHorizontalAlignment(JSG.graph.attr.TextFormatAttributes.TextAlignment.RIGHT);
        tf.setFontColor("#555555");

        graphEditor.invalidate();
    };

    this.formatTextPosition = function() {
        // start with clean editor
        this.clean();

        // create item
        var item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape()), label;
        graph.addItem(item);
        item.getPin().setCoordinate(9000, 5000);
        item.setSize(6000, 5000);

        var i, j;
        // add multiple labels to an item and assign different text positions to it.
        for (i = 1; i < 6; i++) {
            for (j = 1; j < 6; j++) {
                var text = "Here";
                if (i === 3 && j === 3) {
                    text = "Multiple Labels\nper Graphical\nObject";
                }
                label = item.addLabel(text);
                label.getTextFormat().setVerticalPosition(i);
                label.getTextFormat().setHorizontalPosition(j);
            }
        }

        // create item with label, that has custom coordinates
        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.EllipseShape());
        graph.addItem(item);
        item.getPin().setCoordinate(5000, 12000);
        item.setSize(4000, 4000);
        label = item.addLabel("Custom\nPosition");
        label.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.CUSTOM);
        label.getTextFormat().setHorizontalPosition(JSG.graph.attr.TextFormatAttributes.HorizontalTextPosition.CUSTOM);
        label.getPin().setCoordinate(1000, 1000);

        graphEditor.invalidate();
    };

    this.formatTextInheritance = function() {
        // start with clean editor
        this.clean();

        // create item
        var item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape()), label;
        graph.addItem(item);
        item.getPin().setCoordinate(9000, 5000);
        item.setSize(6000, 5000);
        var tf = item.getTextFormat();
        tf.setFontSize(14);
        tf.setFontStyle(JSG.graph.attr.TextFormatAttributes.FontStyle.BOLD);

        label = item.addLabel("Inherited");
        tf = label.getTextFormat();
        tf.setHorizontalPosition(JSG.graph.attr.TextFormatAttributes.HorizontalTextPosition.TOLEFT);

        label = item.addLabel("Inherited");
        tf = label.getTextFormat();
        tf.setHorizontalPosition(JSG.graph.attr.TextFormatAttributes.HorizontalTextPosition.CENTER);

        label = item.addLabel("Exception");
        tf = label.getTextFormat();
        tf.setHorizontalPosition(JSG.graph.attr.TextFormatAttributes.HorizontalTextPosition.TORIGHT);
        tf.setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.BELOWBOTTOM);
        tf.setFontStyle(JSG.graph.attr.TextFormatAttributes.FontStyle.ITALIC);

        tf = item.getTextFormat();
        tf.setFontSize(18);

        graphEditor.invalidate();
    };

    this.formatTextHTML = function() {
        // start with clean editor
        this.clean();

        // create item with 3 paragraphs with different text alignment 
        var item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.getPin().setCoordinate(5000, 4000);
        item.setSize(8000, 5000);
        var label = item.addLabel();
        label.getTextFormat().setFontSize(10);
        label.getTextFormat().setFontName("Verdana");
        label.setText("<p style='text-align:left;'>This is a rich text<br>with linebreak left aligned</p><p style='text-align:center;'>and paragraph<br>that is nicely centered</p><p style='text-align:right;'>and paragraph<br>right aligned</p>");

        // create item with inline text formatting 
        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.getPin().setCoordinate(15000, 4000);
        item.setSize(8000, 5000);
        label = item.addLabel();
        label.setText("<p style='text-align:left;'>This is a <b>bold text</b> with linebreak and <i>italic</i> text</p><p>changing <span style='font-family:Georgia;font-size:14pt'>font name and size</span> within text</p><p>or changing <span style='font-family:Georgia;font-size:12pt;color:#FF0000'>font color</span> within text</p>");

        // create item with ordered or numbered list 
        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.getPin().setCoordinate(5000, 12000);
        item.setSize(8000, 5000);
        label = item.addLabel();
        label.getTextFormat().setFontSize(10);
        label.getTextFormat().setFontName("Verdana");
        label.getTextFormat().setHorizontalAlignment(JSG.graph.attr.TextFormatAttributes.TextAlignment.LEFT);
        label.setText("<p>You can also have:</p><ol><li>an ordered list</li><li>with one item</li><li>or another</li><li>or another</li></ol>");

        // create item with unordered or bullet list 
        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.setBoundingBoxTo(new JSG.geometry.BoundingBox(8000, 5000));
        item.getPin().setCoordinate(15000, 12000);
        label = item.addLabel();
        label.getTextFormat().setFontSize(10);
        label.getTextFormat().setFontName("Verdana");
        label.getTextFormat().setHorizontalAlignment(JSG.graph.attr.TextFormatAttributes.TextAlignment.LEFT);
        label.setText("<p>You can also have:</p><ul><li>an unordered list</li><li>with one item</li><li>or another</li><li>or another</li></ul>");

        graphEditor.invalidate();
    };

    this.itemAttributesBehaviour = function() {
        // start with clean editor
        this.clean();

        // create item with label below
        function getItem(x, y, text) {
            var item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
            graph.addItem(item);
            item.getPin().setCoordinate(x, y);
            item.setSize(2000, 2000);
            var label = item.addLabel(text);
            label.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.BELOWBOTTOM);

            return item;
        }
    
        var ATTR = JSG.graph.attr.ItemAttributes;
        var CONSTS = JSG.graph.attr.consts;
        
        // now apply the item attributes
        var item = getItem(2000, 2000, "Not Moveable");
        item.setItemAttribute(ATTR.MOVEABLE, CONSTS.Moveable.NONE);

        item = getItem(5000, 2000, "Vertically\nMoveable");
        item.setItemAttribute(ATTR.MOVEABLE, CONSTS.Moveable.VERTICAL);
        
        item = getItem(8000, 2000, "Horizontally\nMoveable");
        item.setItemAttribute(ATTR.MOVEABLE, CONSTS.Moveable.HORIZONTAL);

        item = getItem(2000, 7000, "Not deletable");
        item.setItemAttribute(ATTR.DELETEABLE, false);
        
        item = getItem(5000, 7000, "No Rotation");
        item.setItemAttribute(ATTR.ROTATABLE, false);

        item = getItem(8000, 7000, "No Resizing");
        item.setItemAttribute(ATTR.SIZEABLE, false);

        item = getItem(2000, 12000, "Not Selectable");
        item.setItemAttribute(ATTR.SELECTIONMODE, CONSTS.SelectionMode.NONE);

        item = getItem(5000, 12000, "Select only at Border");
        item.setItemAttribute(ATTR.SELECTIONMODE, CONSTS.SelectionMode.BORDER);

        graphEditor.invalidate();
    };

    this.itemAttributesAppearance = function() {
        // start with clean editor
        this.clean();

        // create item with label below
        function getItem(x, y, text) {
            var item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
            graph.addItem(item);
            item.getPin().setCoordinate(x, y);
            item.setSize(2000, 2000);
            var label = item.addLabel(text);
            item.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.BELOWBOTTOM);

            return item;
        }

        // create polyline    
        function getPolyline(x, y, text) {
            var item  = graph.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.PolygonShape()));
            // define polygon points (as factor of node dimensions)
            item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(0.15, 0));
            item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(1, 0));
            item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(1, 1));
            item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(0, 1));
            graph.addItem(item);
            item.getPin().setCoordinate(x, y);
            item.setSize(2000, 2000);
            item.getFormat().setFillColor("#FFFF00");
            var label = item.addLabel(text);
            item.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.BELOWBOTTOM);

            return item;
        }
    
        var ATTR = JSG.graph.attr.ItemAttributes;
        var CONSTS = JSG.graph.attr.consts;
        
        // now apply the item attributes
        var item = getItem(2000, 2000, "Not Visible");
        item.setItemAttribute(ATTR.VISIBLE, false);

        // create polyline and set it open/closed
        item = getPolyline(5000, 2000, "Open");
        item.setItemAttribute(ATTR.CLOSED, false);

        item = getPolyline(8000, 2000, "Closed");
        item.setItemAttribute(ATTR.CLOSED, true);

        // create label with default top margin
        item = getItem(2000, 7000, "Default Margin");
        item.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.CENTER);

        var label = item.getItemAt(0);
        label.getFormat().setFillStyle(JSG.graph.attr.FormatAttributes.FillStyle.SOLID);
        label.getFormat().setLineStyle(JSG.graph.attr.FormatAttributes.LineStyle.SOLID);

        // create label with custom top margin
        item = getItem(5000, 7000, "Custom Margin");
        item.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.CENTER);
        item.getTextFormat().setHorizontalAlignment(JSG.graph.attr.TextFormatAttributes.TextAlignment.LEFT);

        label = item.getItemAt(0);
        label.getFormat().setFillStyle(JSG.graph.attr.FormatAttributes.FillStyle.SOLID);
        label.getFormat().setLineStyle(JSG.graph.attr.FormatAttributes.LineStyle.SOLID);
        label.setItemAttribute(ATTR.MARGINTOP, 300);
        label.setItemAttribute(ATTR.MARGINLEFT, 300);

        graphEditor.invalidate();
    };
    
    this.itemAttributesContainer = function() {
        // start with clean editor
        this.clean();

        // create item with label below
        function getItem(x, y, text) {
            var item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
            graph.addItem(item);
            item.getPin().setCoordinate(x, y);
            item.setSize(4000, 4000);
            var label = item.addLabel(text);
            item.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.BELOWBOTTOM);

            return item;
        }

        var ATTR = JSG.graph.attr.ItemAttributes;
        var CONSTS = JSG.graph.attr.consts;

        // create item to drag
        var item = getItem(3000, 2000, "Drag this item\ninto container");
        item.setSize(2000, 2000);
        item.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.CENTER);

        // create container
        item = getItem(3000, 7000, "Container");
        item.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.CENTER);

        // create item with disabled container attribute
        item = getItem(9000, 7000, "No Container");
        item.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.CENTER);
        item.setItemAttribute(ATTR.CONTAINER, false);

        // create item with clipping
        item = getItem(15000, 7000, "Container with Clipping");
        item.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.CENTER);
        item.setItemAttribute(ATTR.CLIPCHILDREN, true);

        // add item to container which is clipped partially
        var subitem = new JSG.graph.model.Node(new JSG.graph.model.shapes.EllipseShape());
        item.addItem(subitem);
        subitem.getPin().setCoordinate(3500, 900);
        subitem.setSize(2500, 1000);
        subitem.getFormat().setFillColor("#0000FF");

        // create collapsable container 
        item = getItem(3000, 12000, "Collapsable Container");
        item.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.CENTER);
        item.setItemAttribute(ATTR.COLLAPSABLE, CONSTS.Direction.BOTH);
        
        // add item to container
        subitem = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        item.addItem(subitem);
        subitem.getPin().setCoordinate(900, 900);
        subitem.setSize(1000, 1000);

        // create collapsable container, that only collapses in the horizontal direction
        var copy = item.copy();
        graph.addItem(copy);
        copy.getPin().setCoordinate(9000, 12000);
        copy.setItemAttribute(ATTR.COLLAPSABLE, CONSTS.Direction.HORIZONTAL);
        copy.getItemAt(0).setText("Collapse Container\nOnly Horizontal");

        // create collapsable container, that only collapses in the vertical direction
        copy = item.copy();
        graph.addItem(copy);
        copy.getPin().setCoordinate(15000, 12000);
        copy.setItemAttribute(ATTR.COLLAPSABLE, CONSTS.Direction.VERTICAL);
        copy.setItemAttribute(ATTR.COLLAPSEDBUTTON, CONSTS.ButtonPosition.BOTTOMCENTER);
        copy.getItemAt(0).setText("Collapse Container\nOnly Vertical\nwith another Button Position");


        graphEditor.invalidate();
    };

    this.saveXML = function() {
        // start with clean editor
        this.clean();

        var i, item;
        // create objects and fill them with solid colors and apply some transparency
        for (i = 0; i < 360; i += 90) {
            item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
            graph.addItem(item);
            item.getPin().setCoordinate(6000 + 3000 * Math.cos(Math.PI * i / 180), 6000 + 3000 * Math.sin(Math.PI * i / 180));
            item.setSize(2000, 2000);
            item.setAngle(Math.PI * i / 180);
            item.getFormat().setFillColorRGB(Math.min(i, 255), 128, Math.min(i, 255));
        }

        var edge = graph.addItem(new JSG.graph.model.Edge());
        edge.setStartPointTo(new JSG.geometry.Point(8000, 2000));
        edge.setEndPointTo(new JSG.geometry.Point(12000, 3000));
        
        graphEditor.invalidate();

        // now save to xml, which returns an XML string representing the graph        
        var xmlData = graphEditor.saveXML();

        // set content to dom element
        var xmlElement = document.getElementById("xmlsdata");
        xmlElement.innerText = xmlData;
    };

    this.readXML = function() {
        // start with clean editor
        this.clean();

        function saveTagAndAttribute(xml, tag, attribute, value) {
            xml.writeStartElement(tag);
            xml.writeAttributeString(attribute, value);
            xml.writeEndElement();
        }

        function saveGraphItem(xml, type, shape, id, x, y, w, h) {
            
            // write header
            xml.writeStartElement("graphitem");
            xml.writeAttributeString("type", type);
            xml.writeAttributeString("id", id);
            
            // write pin with x and y coordinate
            xml.writeStartElement("pin");
            xml.writeStartElement("p");
        
            saveTagAndAttribute(xml, "x", "v", x);
            saveTagAndAttribute(xml, "y", "v", y);

            xml.writeEndElement();  // p
            xml.writeEndElement();  // pin

            // write size with width and height
            xml.writeStartElement("size");

            saveTagAndAttribute(xml, "w", "v", w);
            saveTagAndAttribute(xml, "h", "v", h);

            xml.writeEndElement();  // size
    
            // save shape type
            saveTagAndAttribute(xml, "shape", "type", shape);

            if (type === "edge") {
                // define start and end point, coordinates are relative to pin
                xml.writeStartElement("start");
                saveTagAndAttribute(xml, "x", "v", 0);
                saveTagAndAttribute(xml, "y", "v", 0);
                xml.writeEndElement();  // start
                
                xml.writeStartElement("end");
                saveTagAndAttribute(xml, "x", "v", w);
                saveTagAndAttribute(xml, "y", "v", h);
                xml.writeEndElement();  // start
            }

            xml.writeEndElement();  // graphitem
        }

        var xml = new JSG.commons.XMLWriter('UTF-8', '1.0');

        xml.writeStartDocument();
        saveTagAndAttribute(xml, "document", "version", "1.0.0");

        xml.writeStartElement("graphitem");
        xml.writeAttributeString("type", "graph");
        
        saveGraphItem(xml, "node", "rectangle", 1, 3000, 3000, 2500, 1500);
        saveGraphItem(xml, "node", "ellipse", 2, 5000, 6000, 2500, 3500);
        saveGraphItem(xml, "edge", "line", 3, 1000, 10000, 2000, 4000);
        
        xml.writeEndElement();  // graphitem

        // get xml string and set it to dom element
        var xmlData = xml.flush();
        var xmlElement = document.getElementById("xmlrdata");
        xmlElement.innerText = xmlData;

        // parse xml string
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(xmlData, "text/xml");
        if (!xmlDoc) {
            return;
        }
        
        // read into current graph
        graphEditor.readXML(xmlDoc);
        graphEditor.invalidate();
    };


    this.addCustomAttributes = function() {
        // start with clean editor
        this.clean();

        var item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.getPin().setCoordinate(5000, 4000);
        item.setSize(8000, 5000);
        
        var attributes = new JSG.Tutorial.CustomAttributes();
        item.addAttribute(attributes);

        graphEditor.invalidate();
    };
    
    this.useCustomAttributes = function() {
        // start with clean editor
        this.clean();

        var item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.getPin().setCoordinate(5000, 4000);
        item.setSize(8000, 5000);
        
        var attributes = new JSG.Tutorial.CustomAttributes();
        item.addAttribute(attributes);

        function addLabel(name) {        
            var label = item.addLabel();
            label.getTextFormat().setFontSize(10);
            label.getTextFormat().setFontName("Verdana");
            label.setText(new JSG.graph.expr.Expression("", "Parent!" + JSG.Tutorial.CustomAttributes.PATH_ID + ":" + name));
            label.setTextInfoCache(false);
            label.evaluate();
            
            return label;
        }

        var label = addLabel('name');
        
        label = addLabel('author');
        label.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.TOP);
        label.getTextFormat().setHorizontalPosition(JSG.graph.attr.TextFormatAttributes.HorizontalTextPosition.CENTER);
        
        label = addLabel('date');
        label.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.BOTTOM);
        label.getTextFormat().setHorizontalPosition(JSG.graph.attr.TextFormatAttributes.HorizontalTextPosition.CENTER);

        graphEditor.invalidate();
    };
    
    this.changeCustomAttributes = function() {
        var item = graph.getItemAt(0);

        if (item !== undefined) {
            var path = JSG.graph.attr.AttributeUtils.createPath(JSG.Tutorial.CustomAttributes.PATH_ID, "name");
            item.setAttributeAtPath(path, "Tutorial");
            path = JSG.graph.attr.AttributeUtils.createPath(JSG.Tutorial.CustomAttributes.PATH_ID, "author");
            item.setAttributeAtPath(path, "Michael Smith");
            path = JSG.graph.attr.AttributeUtils.createPath(JSG.Tutorial.CustomAttributes.PATH_ID, "date");
            item.setAttributeAtPath(path, "28.4.2015");
        }

        graphEditor.invalidate();
    };

    this.commandFormat = function() {
        // start with clean editor
        this.clean();

        // create item 
        var item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.getPin().setCoordinate(5000, 5000);
        item.setSize(2000, 2000);

        // create attribute set for format
        var format = new JSG.graph.attr.FormatAttributes();
        // set fill color to red
        format.setFillColor("#FF0000");
        format.setLineColor("#00FFFF");
        format.setLineWidth(200);
        
        // create command
        var cmd = new JSG.graph.command.FormatItemCommand(item, format);
        graphEditor.getInteractionHandler().execute(cmd);
    };

    this.commandUndo = function() {
        graphEditor.getInteractionHandler().undo();
    };

    this.commandCompound = function() {
        // start with clean editor
        this.clean();

        // create item 
        var item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.getPin().setCoordinate(5000, 5000);
        item.setSize(2000, 2000);

        // create compound command
        var cmdCompound = new JSG.graph.command.CompoundCommand(true);
        
        // add a move command to move the item by 2 cm vertically und horizontally and add it to the compound command
        var cmd = new JSG.graph.command.RotateNodeCommand(item, Math.PI / 4, item.getBoundingBox().getCenter());
        cmdCompound.add(cmd);

        // add a move command to move the item to a new coordinate and add it to the compound command
        cmd = new JSG.graph.command.MoveNodeCommand(item, new JSG.geometry.Point(7000, 7000));
        cmdCompound.add(cmd);

        graphEditor.getInteractionHandler().execute(cmdCompound);
    };

    this.commandCustom = function() {
        // start with clean editor
        this.clean();

        // create item 
        var item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.getPin().setCoordinate(5000, 5000);
        item.setSize(4000, 4000);

        // add the custom command
        var cmd = new JSG.Tutorial.AddLabelAndBackgroundCommand(item, "Custom", "#FF00FF");

        graphEditor.getInteractionHandler().execute(cmd);
    };

    this.useTemplate = function() {
        // start with clean editor
        this.clean();

        function create(x, y) {
        // create item 
            var item = new JSG.graph.model.Node(new JSG.graph.model.shapes.EllipseShape());
            graph.addItem(item);
            item.getPin().setCoordinate(x, y);
            item.setSize(4000, 4000);
            return item;
        }
        
        // create default item 
        create(3000, 3000);
        
        // copy default format template attribute list
        var attrList = JSG.graph.attr.FormatAttributes.Template.toList();
        
        // set desired format
        attrList.setFillColor("#00FFCC");
        attrList.setLineColor("#DDFF00");
        attrList.setLineWidth(100);
        
        // convert to Template and add to global template store
        var newTemplate = attrList.toTemplate("myformat");
        JSG.TemplateStore.addTemplate(newTemplate);
        
        // create items with format template assigned
        create(5500, 5500).getFormat().setParent(newTemplate);
        create(4000, 8000).getFormat().setParent(newTemplate);
        
        // create item with template and specific setting for fill color
        var item = create(7000, 10000);
        item.getFormat().setParent(newTemplate);
        item.getFormat().setFillColor("#FFDDEE");

        
        graphEditor.invalidate();
    };

    this.changeTemplate = function() {

        // create a default format
        var attrList = JSG.graph.attr.FormatAttributes.Template.toList();
        
        // set desired format
        attrList.setFillColor("#DDFFDD");
        attrList.setLineWidth(100);

        // update template 
        JSG.TemplateStore.updateTemplate("myformat", attrList);
        
        graphEditor.invalidate();
    };

    this.createTemplate = function() {
        // start with clean editor
        this.clean();
        
        // create custom attribute list
        var customAttrList = new JSG.Tutorial.CustomAttributes();
        // derive template from it
        var template = customAttrList.toTemplate("custom");

        // add template to template store
        JSG.TemplateStore.addTemplate(template);
        
        // adding template to attribute list
        customAttrList.setParent(template);
        // reset attributes already defined, so they are retrieved from template 
        customAttrList.reset();

        // create item with attribute list
        var item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.getPin().setCoordinate(5000, 4000);
        item.setSize(4000, 3000);
        item.addAttribute(customAttrList);

        // add labels to show attribute
        var label = item.addLabel();
        label.setText(new JSG.graph.expr.Expression("", "Parent!" + JSG.Tutorial.CustomAttributes.PATH_ID + ":name"));
        label.setTextInfoCache(false);
        label.evaluate();

        label = item.addLabel();
        label.setText(new JSG.graph.expr.Expression("", "Parent!" + JSG.Tutorial.CustomAttributes.PATH_ID + ":name"));
        label.setTextInfoCache(false);
        label.evaluate();
            
        graphEditor.invalidate();
    };

    this.changeCustomTemplate = function() {

        // create a default format
        var attrList = JSG.TemplateStore.getTemplate("custom").toList();
        
        // change name
        attrList.setAttribute("name", "Jack Miller");

        // update template 
        JSG.TemplateStore.updateTemplate("custom", attrList);
        
        graphEditor.invalidate();
    };

    this.activateSelectionNotification = function() {
        JSG.graph.notifications.NotificationCenter.getInstance().register(this, JSG.graph.view.SelectionProvider.SELECTION_CHANGED_NOTIFICATION, "onSelectionChanged");
    };
    
    this.onSelectionChanged = function() {

        // get selection provider to retrieve selection  info        
        var selProvider = graphEditor.getSelectionProvider();
        // get first item in selection
        var selection = selProvider.hasSingleSelection() ? selProvider.getFirstSelection().getModel() : undefined;
        var i;
        
        // reset all fill colors
        for (i = 0; i < graph.getItemCount(); i++) {
            graph.getItemAt(i).getFormat().setFillColor('#FFFFFF');
        }
        
        // format first selected item pink
        if (selection) {
            selection.getFormat().setFillColor("#FFDDEE");
        }
    };
};

sampleCode = new Samples();

JSG.namespace("JSG.Tutorial");

JSG.Tutorial.CustomAttributes = function(mapExpr) {
    JSG.Tutorial.CustomAttributes._super.constructor.call(this, JSG.Tutorial.CustomAttributes.PATH_ID, mapExpr);

    this.addAttribute(JSG.graph.attr.StringAttribute.create("name", "Initial Name", "Name"));
    this.addAttribute(JSG.graph.attr.StringAttribute.create("author", "Initial Author", "Author"));
    this.addAttribute(JSG.graph.attr.StringAttribute.create("date", "1.1.2000", "Date"));

};
JSG.extend(JSG.Tutorial.CustomAttributes, JSG.graph.attr.AttributeList);

JSG.Tutorial.CustomAttributes.PATH_ID = "CUSTOM";

JSG.Tutorial.CustomAttributes.prototype.getClassString = function() {
    return "JSG.Tutorial.CustomAttributes";
};

JSG.Tutorial.AddLabelAndBackgroundCommand = function(item, label, backgroundColor) {
    JSG.Tutorial.AddLabelAndBackgroundCommand._super.constructor.apply(this, arguments);
    
    this._item = item;
    this._label = label;
    this._backgroundColor = backgroundColor;
   
    // save current color for undo
    this._oldBackgroundColor = this._item.getFormat().getFillColor().getExpression();
};
JSG.extend(JSG.Tutorial.AddLabelAndBackgroundCommand, JSG.graph.command.Command);
JSG.Tutorial.AddLabelAndBackgroundCommand.prototype.undo = function() {
    // remove label
    this._item.removeItem(this._labelItem);
    // set original color
    this._item.getFormat().setFillColor(this._oldBackgroundColor);
};

JSG.Tutorial.AddLabelAndBackgroundCommand.prototype.redo = function() {
    // save label to be able to remove it on undo
    this._labelItem = this._item.addLabel(this._label);
    this._item.getFormat().setFillColor(this._backgroundColor);
};

JSG.Tutorial.AddLabelAndBackgroundCommand.prototype.execute = function() {
    this.redo();
};

function copySelection() {
    graphEditor.getInteractionHandler().copySelection();
}

function cutSelection() {
    graphEditor.getInteractionHandler().cutSelection();
}

function paste() {
    graphEditor.getInteractionHandler().paste();
}

function deleteSelection() {
    graphEditor.getInteractionHandler().deleteSelection();
}

function undo() {
    graphEditor.getInteractionHandler().undo();
}

function redo() {
    graphEditor.getInteractionHandler().redo();
}

function createLine() {
    graphEditor.getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.CreateEdgeInteraction(new JSG.graph.model.Edge()));
}

function createRect() {
    graphEditor.getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.CreateNodeInteraction(new JSG.graph.model.shapes.RectangleShape()));
}

function createText() {
    graphEditor.getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.CreateNodeInteraction(new JSG.graph.model.shapes.RectangleShape(), "Label"));
}

function createEllipse() {
    graphEditor.getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.CreateNodeInteraction(new JSG.graph.model.shapes.EllipseShape()));
}

function createPolyline(closed) {
    var polynode = new JSG.graph.model.Node(new JSG.graph.model.shapes.PolygonShape());
    polynode.setItemAttribute(JSG.graph.attr.ItemAttributes.CLOSED, closed);
    graphEditor.getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.CreatePolyLineInteraction(polynode));
}

function createBezier(closed) {
    var polynode = new JSG.graph.model.Node(new JSG.graph.model.shapes.BezierShape());
    polynode.setItemAttribute(JSG.graph.attr.ItemAttributes.CLOSED, closed);
    graphEditor.getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.CreateBezierInteraction(polynode));
}

function edit() {
    graphEditor.getInteractionHandler().editSelection();
}

function align(flag) {
    graphEditor.getInteractionHandler().alignSelection(flag);
}

function order(flag) {
    graphEditor.getInteractionHandler().changeDrawingOrderSelection(flag);
}

function openGraph() {

    var xmlData = localStorage.getItem("JSGraphSample");
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xmlData, "text/xml");
    if (!xmlDoc) {
        return;
    }
    
    // read into current graph
    graphEditor.readXML(xmlDoc);
    graphEditor.invalidate();
}

function saveGraph() {
    var xmlData = graphEditor.saveXML();
    
    localStorage.setItem("JSGraphSample", xmlData);
}

