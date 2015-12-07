ARAC = {
	version: {
		major: "1",
		minor: "1",
		revision: "0",
		build: "20140825-1452",
		complete: "1.1.0.20140825-1452",
		delimitier: ".",
		delimitierbuild: "-"
	},
	namespace: function(a, b) {
		for (var c = ARAC,
		e = a.split(b || "."), d = 1; d < e.length; d += 1)"undefined" === typeof c[e[d]] && (c[e[d]] = {}),
		c = c[e[d]];
		return c
	},
	inherit: function(a, b, c) {
		function e() {}
		e.prototype = b.prototype;
		a.prototype = new e;
		a.prototype.constructor = a;
		a._superInit = b;
		a._super = b.prototype;
		c && ARAC.override(a, c)
	},
	override: function(a, b) {
		if (b) {
			var c = a.prototype,
			e;
			for (e in b) c[e] = b[e]
		}
	},
	core: {
		EMPTY_ARRAY: [],
		stringSplit: function(a, b) {
			var c = a.split(b),
			e;
			for (e = 0; e < c.length; e++) c[e] = this.stringTrim(c[e]);
			return c
		},
		stringTrim: function(a) {
			return a.replace(/^\s\s*/, "").replace(/\s\s*$/, "")
		},
		arrayFind: function(a, b) {
			for (var c = 0; c < a.length; c++) if (a[c] == b) return ! 0;
			return ! 1
		},
		arrayIndexOf: function(a, b) {
			for (var c = 0; c < a.length; c++) if (a[c] == b) return c;
			return - 1
		},
		arrayAddAll: function(a, b) {
			for (var c = 0; c < b.length; c++) a.push(b[c])
		},
		arrayRemove: function(a, b) {
			for (var c = 0; c < a.length; c++) if (a[c] == b) return a.splice(c, 1),
			!0;
			return ! 1
		},
		arrayCopy: function(a) {
			return ARAC.core.EMPTY_ARRAY.concat(a)
		},
		arraySortNumberAs: function(a, b) {
			return a - b
		},
		arraySortNumberDs: function(a, b) {
			return b - a
		},
		_scripts: [],
		_scriptIdx: 0,
		load: function(a, b) {
			function c() {
				ARAC.core._scriptIdx < ARAC.core._scripts.length ? ARAC.core._loadScript(ARAC.core._scripts[ARAC.core._scriptIdx++], c) : void 0 != b && b()
			}
			for (var e = 0; e < a.length; e++) this._scripts.push(a[e]);
			c()
		},
		_loadScript: function(a, b) {
			var c = document.createElement("script");
			c.type = "application/javascript";
			c.charset = "UTF-8";
			c.readyState ? c.onreadystatechange = function() {
				if ("loaded" == c.readyState || "complete" == c.readyState) c.onreadystatechange = null,
				b()
			}: c.onload = function() {
				b()
			};
			c.src = a;
			document.getElementsByTagName("head")[0].appendChild(c)
		}
	},
	Coord: function(a, b) {
		"object" == typeof a ? (this.x = a.x, this.y = a.y) : (this.x = a || 0, this.y = b || 0)
	}
};
ARAC.Coord.prototype = {
	hits: function(a, b) {
		var c = null != b ? b: 1;
		return Math.abs(this.x - a.x) <= c && Math.abs(this.y - a.y) <= c
	},
	copy: function() {
		return new ARAC.Coord(this.x, this.y)
	},
	toString: function() {
		return this.x + "," + this.y
	}
};
ARAC.CoordParser = {
	parseSingle: function(a) {
		return (a = a.split(",")) && 1 < a.length ? new ARAC.Coord(parseFloat(a[0]), parseFloat(a[1])) : null
	}
};
ARAC.BBox = function(a, b, c, e) {
	this.x1 = a ? a: 0;
	this.y1 = b ? b: 0;
	this.x2 = c ? c: 0;
	this.y2 = e ? e: 0
};
ARAC.BBox.prototype = {
	isEmpty: function() {},
	isInverted: function() {},
	getWidth: function(a) {
		return a ? Math.abs(this.x2 - this.x1) : this.x2 - this.x1
	},
	setWidth: function(a) {
		this.x2 = this.x1 + a
	},
	getHeight: function(a) {
		return a ? Math.abs(this.y2 - this.y1) : this.y2 - this.y1
	},
	setHeight: function(a) {
		this.y2 = this.y1 + a
	},
	getCenter: function() {
		return {
			x: (this.x1 + this.x2) / 2,
			y: (this.y1 + this.y2) / 2
		}
	},
	getCenterX: function() {
		return (this.x1 + this.x2) / 2
	},
	getCenterY: function() {
		return (this.y1 + this.y2) / 2
	},
	setCenter: function(a, b) {
		var c = Math.round(a - (this.x1 + this.x2) / 2),
		e = Math.round(b - (this.y1 + this.y2) / 2);
		this.x1 += c;
		this.x2 += c;
		this.y1 += e;
		this.y2 += e
	},
	setCenterX: function(a) {
		a = Math.round(a - (this.x1 + this.x2) / 2);
		this.x1 += a;
		this.x2 += a
	},
	setCenterY: function(a) {
		a = Math.round(a - (this.y1 + this.y2) / 2);
		this.y1 += a;
		this.y2 += a
	},
	getCoords: function() {
		return [new ARAC.Coord(this.x1, this.y1), new ARAC.Coord(this.x2, this.y2)]
	},
	contains: function(a, b) {
		return this.x1 <= a && this.y1 <= b && this.x2 >= a && this.y2 >= b ? !0 : !1
	},
	containsBox: function(a) {
		return this.x1 <= a.x1 && this.y1 <= a.y1 && this.x2 >= a.x2 && this.y2 >= a.y2 ? !0 : !1
	},
	offset: function(a, b) {
		this.x1 += a;
		this.x2 += a;
		this.y1 += b;
		this.y2 += b
	},
	union: function(a) {
		this.minmax4(a.x1, a.y1, a.x2, a.y2)
	},
	union2: function(a, b) {
		this.minmax2(a, b)
	},
	union4: function(a, b, c, e) {
		this.minmax4(a, b, c, e)
	},
	minmaxBox: function() {
		this.y1 = this.x1 = Number.MIN_VALUE;
		this.y2 = this.x2 = Number.MAX_VALUE
	},
	maxmin2: function(a, b) {
		this.x1 = Math.max(this.x1, a);
		this.y1 = Math.max(this.y1, b);
		this.x2 = Math.min(this.x2, a);
		this.y2 = Math.min(this.y2, b)
	},
	maxmin4: function(a, b, c, e) {
		this.x1 = Math.max(this.x1, a);
		this.y1 = Math.max(this.y1, b);
		this.x2 = Math.min(this.x2, c);
		this.y2 = Math.min(this.y2, e)
	},
	maxminBox: function() {
		this.y1 = this.x1 = Number.MAX_VALUE;
		this.y2 = this.x2 = Number.MIN_VALUE
	},
	minmax2: function(a, b) {
		this.x1 = Math.min(this.x1, a);
		this.y1 = Math.min(this.y1, b);
		this.x2 = Math.max(this.x2, a);
		this.y2 = Math.max(this.y2, b)
	},
	minmax4: function(a, b, c, e) {
		this.x1 = Math.min(this.x1, a);
		this.y1 = Math.min(this.y1, b);
		this.x2 = Math.max(this.x2, c);
		this.y2 = Math.max(this.y2, e)
	},
	toString: function() {
		sb = new String;
		sb = sb.concat("BBox [");
		sb = sb.concat("x1:");
		sb = sb.concat(this.x1);
		sb = sb.concat(", y1:");
		sb = sb.concat(this.y1);
		sb = sb.concat(", x2:");
		sb = sb.concat(this.x2);
		sb = sb.concat(", y2:");
		sb = sb.concat(this.y2);
		return sb = sb.concat("]")
	}
};
ARAC.BBoxOp = {
	fromCoord: function(a) {
		return new ARAC.BBox(a.x, a.y, a.x, a.y)
	},
	posFromString: function(a) {
		a = a.split(",");
		var b = new ARAC.BBoxPos;
		switch (a[0]) {
		case "Left":
			b.posX = ARAC.BBoxPosition.LEFT;
			break;
		case "Center":
			b.posX = ARAC.BBoxPosition.CENTER;
			break;
		case "Right":
			b.posX = ARAC.BBoxPosition.RIGHT
		}
		switch (a[1]) {
		case "Top":
			b.posY = ARAC.BBoxPosition.TOP;
			break;
		case "Center":
			b.posY = ARAC.BBoxPosition.CENTER;
			break;
		case "Bottom":
			b.posY = ARAC.BBoxPosition.BOTTOM
		}
		return b
	}
};
ARAC.BBoxPosition = {
	CENTER: 1,
	LEFT: 2,
	TOP: 3,
	RIGHT: 4,
	BOTTOM: 5
};
ARAC.BBoxPos = function(a, b) {
	this.posX = a;
	this.posY = b
};
ARAC.BBoxPos.prototype = {
	resolve: function(a, b) {
		var c = new ARAC.Coord(a.x1, a.y1),
		e = ARAC.BBoxPosition;
		switch (this.posX) {
		case e.CENTER:
			c.x = a.getCenterX();
			break;
		case e.RIGHT:
			c.x = a.x2
		}
		switch (this.posY) {
		case e.CENTER:
			c.y = a.getCenterY();
			break;
		case e.BOTTOM:
			c.y = a.y2
		}
		b && (c.x -= a.x1, c.y -= a.y1);
		return c
	},
	toString: function() {
		var a = "";
		switch (this.posX) {
		case ARAC.BBoxPosition.LEFT:
			a += "Left";
			break;
		case ARAC.BBoxPosition.CENTER:
			a += "Center";
			break;
		case ARAC.BBoxPosition.RIGHT:
			a += "Right"
		}
		a += ",";
		switch (this.posy) {
		case ARAC.BBoxPosition.TOP:
			a += "Top";
			break;
		case ARAC.BBoxPosition.CENTER:
			a += "Center";
			break;
		case ARAC.BBoxPosition.BOTTOM:
			a += "Bottom"
		}
		return a
	}
};
ARAC.Error = function(a) {
	this.message = a
};
ARAC.tools = {};
ARAC.tools.constraint = {};
ARAC.tools.constraint.Constraint = function() {};
ARAC.tools.constraint.Constraint.prototype = {
	validate: function(a) {
		return ! 0
	},
	validateValue: function(a) {
		return a
	},
	intern: function() {
		var a = this.trace(),
		b = null;
		if (null != (b = ARAC.tools.constraint.ConstraintPool.get(a))) return b;
		ARAC.tools.constraint.ConstraintPool.pool(this);
		return this
	},
	trace: function() {
		return ""
	},
	toString: function() {
		var a = new String("Constraint [");
		return a = a.concat("]")
	}
};
ARAC.tools.constraint.ConstraintPool = {
	init: function() {
		null == this.keys && (this.keys = []);
		null == this.pool && (this.pool = {})
	},
	get: function(a) {
		this.init();
		return this.pool[a]
	},
	pool: function(a) {
		this.init();
		var b = a.trace();
		this.keys.push(b);
		this.pool[b] = a
	},
	clear: function() {
		this.keys = [];
		this.pool = {}
	},
	size: function() {
		return null == this.keys ? 0 : this.keys.length
	}
};
ARAC.tools.constraint.ConstraintParser = function() {};
ARAC.tools.constraint.ConstraintParser.prototype = {
	check: function() {
		var a = this.parse("value typeof Double \x26\x26 value \x3e\x3d 1.1 \x26\x26 value \x3c\x3d 2.1");
		alert("constraint:\n" + a.trace() + "\n\nvalue 1.0:" + a.validate(1) + "  validValue:" + a.validateValue(1) + "\nvalue 1.5:" + a.validate(1.5) + "  validValue:" + a.validateValue(1.5) + "\nvalue 2.2:" + a.validate(2.2) + "  validValue:" + a.validateValue(2.2) + '\nvalue "n":' + a.validate("n") + "  validValue:" + a.validateValue("n") + '\nvalue "1.3":' + a.validate("1.3") + "  validValue:" + a.validateValue("1.3"));
		a = this.parse("(value \x3e\x3d 1.1 \x26\x26 value \x3c\x3d 2.1) || (value \x3e\x3d 4.5 \x26\x26 value \x3c\x3d 5.5)");
		alert("constraint:\n" + a.trace() + "\n\nvalue 1.0:" + a.validate(1) + "  validValue:" + a.validateValue(1) + "\nvalue 1.5:" + a.validate(1.5) + "  validValue:" + a.validateValue(1.5) + "\nvalue 2.2:" + a.validate(2.2) + "  validValue:" + a.validateValue(2.2) + "\n\nvalue 4.4:" + a.validate(4.4) + "  validValue:" + a.validateValue(4.4) + "\nvalue 5:" + a.validate(5) + "  validValue:" + a.validateValue(5) + "\nvalue 5.6:" + a.validate(5.6) + "  validValue:" + a.validateValue(5.6) + '\nvalue "n":' + a.validate("n") + "  validValue:" + a.validateValue("n") + '\nvalue "1.3":' + a.validate("1.3") + "  validValue:" + a.validateValue("1.3"));
		a = this.parse("value in ('Rom' | 'Paris' | 'Moskau')");
		alert("constraint:\n" + a.trace() + '\n\nvalue "K\ufffdln":' + a.validate("K\ufffdln") + "  validValue:" + a.validateValue("K\ufffdln") + '\nvalue "Rom":' + a.validate("Rom") + "  validValue:" + a.validateValue("Rom") + '\nvalue "Moskau":' + a.validate("Moskau") + "  validValue:" + a.validateValue("Moskau") + "\nvalue 1.5:" + a.validate(1.5) + "  validValue:" + a.validateValue(1.5));
		a = this.parse("value in (1 | 2 | 3)");
		alert("constraint:\n" + a.trace() + "\n\nvalue 2:" + a.validate(2) + "  validValue:" + a.validateValue(2) + "\nvalue 4:" + a.validate(4) + "  validValue:" + a.validateValue(4) + '\n\nvalue "2":' + a.validate("2") + "  validValue:" + a.validateValue("2") + '\nvalue "4":' + a.validate("4") + "  validValue:" + a.validateValue("4") + '\nvalue "Herbert":' + a.validate("Herbert") + "  validValue:" + a.validateValue("Herbert"))
	},
	parse: function(a) {
		this.input = a;
		this.rpn = [];
		this.rpnCurr = null;
		this.inputCursor = 0;
		this.token = {
			ival: 0,
			dval: 0,
			sval: ""
		};
		this.init();
		this.rpnCurr = this.nextToken();
		this.expr();
		this.match(ARAC.tools.constraint.ConstraintParser.SYMBOL.EOF);
		return this.createConstraint()
	},
	init: function() {
		this.advance()
	},
	match: function(a) {
		this.rpnCurr != ARAC.tools.constraint.ConstraintParser.SYMBOL.EOF && this.rpnCurr == a && (this.rpnCurr = this.nextToken())
	},
	expr: function() {
		this.term();
		this.rest()
	},
	term: function() {
		switch (this.rpnCurr) {
		case ARAC.tools.constraint.ConstraintParser.SYMBOL.ID:
			this.match(ARAC.tools.constraint.ConstraintParser.SYMBOL.ID);
			this.rpn.push(this.token.sval);
			break;
		case ARAC.tools.constraint.ConstraintParser.SYMBOL.INTEGER:
			this.match(ARAC.tools.constraint.ConstraintParser.SYMBOL.INTEGER);
			this.rpn.push(this.token.ival);
			break;
		case ARAC.tools.constraint.ConstraintParser.SYMBOL.DOUBLE:
			this.match(ARAC.tools.constraint.ConstraintParser.SYMBOL.DOUBLE);
			this.rpn.push(this.token.dval);
			break;
		case ARAC.tools.constraint.ConstraintParser.SYMBOL.STRING:
			this.match(ARAC.tools.constraint.ConstraintParser.SYMBOL.STRING);
			this.rpn.push(this.token.sval);
			break;
		case ARAC.tools.constraint.ConstraintParser.SYMBOL.NOT:
			this.match(ARAC.tools.constraint.ConstraintParser.SYMBOL.NOT);
			this.expr();
			this.rpn.push(ARAC.tools.constraint.ConstraintParser.OP.NOT);
			break;
		case ARAC.tools.constraint.ConstraintParser.SYMBOL.LPAREN:
			this.match(ARAC.tools.constraint.ConstraintParser.SYMBOL.LPAREN),
			this.expr(),
			this.match(ARAC.tools.constraint.ConstraintParser.SYMBOL.RPAREN)
		}
	},
	rest: function() {
		switch (this.rpnCurr) {
		case ARAC.tools.constraint.ConstraintParser.SYMBOL.AND:
			this.match(ARAC.tools.constraint.ConstraintParser.SYMBOL.AND);
			this.term();
			this.rest();
			this.rpn.push(ARAC.tools.constraint.ConstraintParser.OP.AND);
			break;
		case ARAC.tools.constraint.ConstraintParser.SYMBOL.OR:
			this.match(ARAC.tools.constraint.ConstraintParser.SYMBOL.OR);
			this.term();
			this.rest();
			this.rpn.push(ARAC.tools.constraint.ConstraintParser.OP.OR);
			break;
		case ARAC.tools.constraint.ConstraintParser.SYMBOL.EQ:
			this.match(ARAC.tools.constraint.ConstraintParser.SYMBOL.EQ);
			this.term();
			this.rpn.push(ARAC.tools.constraint.ConstraintParser.OP.EQ);
			this.rest();
			break;
		case ARAC.tools.constraint.ConstraintParser.SYMBOL.NE:
			this.match(ARAC.tools.constraint.ConstraintParser.SYMBOL.NE);
			this.term();
			this.rpn.push(ARAC.tools.constraint.ConstraintParser.OP.NE);
			this.rest();
			break;
		case ARAC.tools.constraint.ConstraintParser.SYMBOL.LT:
			this.match(ARAC.tools.constraint.ConstraintParser.SYMBOL.LT);
			this.term();
			this.rpn.push(ARAC.tools.constraint.ConstraintParser.OP.LT);
			this.rest();
			break;
		case ARAC.tools.constraint.ConstraintParser.SYMBOL.LE:
			this.match(ARAC.tools.constraint.ConstraintParser.SYMBOL.LE);
			this.term();
			this.rpn.push(ARAC.tools.constraint.ConstraintParser.OP.LE);
			this.rest();
			break;
		case ARAC.tools.constraint.ConstraintParser.SYMBOL.GT:
			this.match(ARAC.tools.constraint.ConstraintParser.SYMBOL.GT);
			this.term();
			this.rpn.push(ARAC.tools.constraint.ConstraintParser.OP.GT);
			this.rest();
			break;
		case ARAC.tools.constraint.ConstraintParser.SYMBOL.GE:
			this.match(ARAC.tools.constraint.ConstraintParser.SYMBOL.GE);
			this.term();
			this.rpn.push(ARAC.tools.constraint.ConstraintParser.OP.GE);
			this.rest();
			break;
		case ARAC.tools.constraint.ConstraintParser.SYMBOL.TYPE:
			this.match(ARAC.tools.constraint.ConstraintParser.SYMBOL.TYPE);
			this.term();
			this.rpn.push(ARAC.tools.constraint.ConstraintParser.OP.TYPE);
			this.rest();
			break;
		case ARAC.tools.constraint.ConstraintParser.SYMBOL.IN:
			this.match(ARAC.tools.constraint.ConstraintParser.SYMBOL.IN);
			this.match(ARAC.tools.constraint.ConstraintParser.SYMBOL.LPAREN);
			var a = [];
			this.inlist(a);
			this.match(ARAC.tools.constraint.ConstraintParser.SYMBOL.RPAREN);
			this.rpn.push(a);
			this.rpn.push(ARAC.tools.constraint.ConstraintParser.OP.IN)
		}
	},
	inlist: function(a) {
		switch (this.rpnCurr) {
		case ARAC.tools.constraint.ConstraintParser.SYMBOL.STRING:
			a.push(this.token.sval);
			this.match(ARAC.tools.constraint.ConstraintParser.SYMBOL.STRING);
			this.inlistseparator();
			this.inlist(a);
			break;
		case ARAC.tools.constraint.ConstraintParser.SYMBOL.INTEGER:
			a.push(this.token.ival);
			this.match(ARAC.tools.constraint.ConstraintParser.SYMBOL.INTEGER);
			this.inlistseparator();
			this.inlist(a);
			break;
		case ARAC.tools.constraint.ConstraintParser.SYMBOL.DOUBLE:
			a.push(this.token.dval),
			this.match(ARAC.tools.constraint.ConstraintParser.SYMBOL.DOUBLE),
			this.inlistseparator(),
			this.inlist(a)
		}
	},
	inlistseparator: function() {
		switch (this.rpnCurr) {
		case ARAC.tools.constraint.ConstraintParser.SYMBOL.BINOR:
			this.match(ARAC.tools.constraint.ConstraintParser.SYMBOL.BINOR)
		}
	},
	advance: function() {
		this.inputChar = this.inputCursor < this.input.length ? this.input.charAt(this.inputCursor++) : -1
	},
	nextToken: function() {
		for (;;) {
			if ("#" == this.inputChar) {
				do this.advance();
				while ("\n" != this.inputChar && -1 != this.inputChar)
			}
			if ("a" <= this.inputChar && "z" >= this.inputChar || "A" <= this.inputChar && "Z" >= this.inputChar) {
				var a = new String;
				do a = a.concat(this.inputChar),
				this.advance();
				while ("a" <= this.inputChar && "z" >= this.inputChar || "A" <= this.inputChar && "Z" >= this.inputChar || "0" <= this.inputChar && "9" >= this.inputChar || "." == this.inputChar || "_" == this.inputChar);
				if (0 < a.length) {
					if ("in" == a) return ARAC.tools.constraint.ConstraintParser.SYMBOL.IN;
					if ("typeof" == a) return ARAC.tools.constraint.ConstraintParser.SYMBOL.TYPE;
					this.token.sval = a;
					return ARAC.tools.constraint.ConstraintParser.SYMBOL.ID
				}
			}
			switch (this.inputChar) {
			default:
				this.advance();
				break;
			case "\x26":
				this.advance();
				if ("\x26" == this.inputChar) return this.advance(),
				ARAC.tools.constraint.ConstraintParser.SYMBOL.AND;
				break;
			case "|":
				return this.advance(),
				"|" == this.inputChar ? (this.advance(), ARAC.tools.constraint.ConstraintParser.SYMBOL.OR) : ARAC.tools.constraint.ConstraintParser.SYMBOL.BINOR;
			case "!":
				return this.advance(),
				"\x3d" == this.inputChar ? (this.advance(), ARAC.tools.constraint.ConstraintParser.SYMBOL.NE) : ARAC.tools.constraint.ConstraintParser.SYMBOL.NOT;
			case "\x3d":
				this.advance();
				if ("\x3d" == this.inputChar) return this.advance(),
				ARAC.tools.constraint.ConstraintParser.SYMBOL.EQ;
				break;
			case "\x3c":
				return this.advance(),
				"\x3d" == this.inputChar ? (this.advance(), ARAC.tools.constraint.ConstraintParser.SYMBOL.LE) : ARAC.tools.constraint.ConstraintParser.SYMBOL.LT;
			case "\x3e":
				return this.advance(),
				"\x3d" == this.inputChar ? (this.advance(), ARAC.tools.constraint.ConstraintParser.SYMBOL.GE) : ARAC.tools.constraint.ConstraintParser.SYMBOL.GT;
			case "(":
				return this.advance(),
				ARAC.tools.constraint.ConstraintParser.SYMBOL.LPAREN;
			case ")":
				return this.advance(),
				ARAC.tools.constraint.ConstraintParser.SYMBOL.RPAREN;
			case ",":
				return this.advance(),
				ARAC.tools.constraint.ConstraintParser.SYMBOL.RPAREN;
			case '"':
				break;
			case "'":
				this.advance();
				if ("\\" == this.inputChar) break;
				a = new String;
				if ("'" == this.inputChar) return this.advance(),
				this.token.sval = a,
				ARAC.tools.constraint.ConstraintParser.SYMBOL.STRING;
				do a = a.concat(this.inputChar),
				this.advance();
				while ("'" != this.inputChar);
				this.advance();
				var b = parseFloat(a);
				if (!isNaN(b)) return this.token.dval = b,
				ARAC.tools.constraint.ConstraintParser.SYMBOL.DOUBLE;
				b = parseInt(a);
				if (!isNaN(b)) return this.token.ival = b,
				ARAC.tools.constraint.ConstraintParser.SYMBOL.INTEGER;
				this.token.sval = a;
				return ARAC.tools.constraint.ConstraintParser.SYMBOL.STRING;
			case "0":
			case "1":
			case "2":
			case "3":
			case "4":
			case "5":
			case "6":
			case "7":
			case "8":
			case "9":
			case "-":
			case ".":
				a = new String;
				b = !1;
				do b = b || "." == this.inputChar,
				a = a.concat(this.inputChar),
				this.advance();
				while ("0" <= this.inputChar && "9" >= this.inputChar || "." == this.inputChar || "-" == this.inputChar);
				if (b) return this.token.dval = parseFloat(a),
				ARAC.tools.constraint.ConstraintParser.SYMBOL.DOUBLE;
				this.token.ival = parseInt(a);
				return ARAC.tools.constraint.ConstraintParser.SYMBOL.INTEGER;
			case - 1 : return ARAC.tools.constraint.ConstraintParser.SYMBOL.EOF
			}
		}
	},
	createConstraint: function() {
		for (var a = [], b = ARAC.tools.constraint.ConstraintParser.SYMBOL.EOF, c = 0, e = 0; 0 < this.rpn.length;) {
			for (var d = e = c = 0; d < this.rpn.length; d++) {
				var f = this.rpn[d];
				c++;
				if ((b = this.isOp2(f)) != ARAC.tools.constraint.ConstraintParser.SYMBOL.EOF) {
					e = 2;
					break
				}
				if ((b = this.isOp1(f)) != ARAC.tools.constraint.ConstraintParser.SYMBOL.EOF) {
					e = 1;
					break
				}
				a.push(f)
			}
			if (b == ARAC.tools.constraint.ConstraintParser.SYMBOL.EOF) break;
			this.rpn = this.rpn.slice(c);
			switch (e) {
			case 1:
				b == ARAC.tools.constraint.ConstraintParser.SYMBOL.NOT && a.push((new ARAC.tools.constraint.Negate(a.pop())).intern());
				break;
			case 2:
				b == ARAC.tools.constraint.ConstraintParser.SYMBOL.OR ? (c = a.pop(), e = a.pop(), a.push((new ARAC.tools.constraint.Or(e, c)).intern())) : b == ARAC.tools.constraint.ConstraintParser.SYMBOL.AND ? (c = a.pop(), e = a.pop(), a.push((new ARAC.tools.constraint.And(e, c)).intern())) : b == ARAC.tools.constraint.ConstraintParser.SYMBOL.EQ ? (c = a.pop(), a.pop(), a.push((new ARAC.tools.constraint.Number(ARAC.tools.constraint.Number.TYPE.EQUAL, c)).intern())) : b == ARAC.tools.constraint.ConstraintParser.SYMBOL.NE ? (c = a.pop(), a.pop(), a.push((new ARAC.tools.constraint.Number(ARAC.tools.constraint.Number.TYPE.NOTEQUAL, c)).intern())) : b == ARAC.tools.constraint.ConstraintParser.SYMBOL.LT ? (c = a.pop(), a.pop(), a.push((new ARAC.tools.constraint.Number(ARAC.tools.constraint.Number.TYPE.LESS, c)).intern())) : b == ARAC.tools.constraint.ConstraintParser.SYMBOL.LE ? (c = a.pop(), a.pop(), a.push((new ARAC.tools.constraint.Number(ARAC.tools.constraint.Number.TYPE.LESSOREQUAL, c)).intern())) : b == ARAC.tools.constraint.ConstraintParser.SYMBOL.GT ? (c = a.pop(), a.pop(), a.push((new ARAC.tools.constraint.Number(ARAC.tools.constraint.Number.TYPE.GREATER, c)).intern())) : b == ARAC.tools.constraint.ConstraintParser.SYMBOL.GE ? (c = a.pop(), a.pop(), a.push((new ARAC.tools.constraint.Number(ARAC.tools.constraint.Number.TYPE.GREATEROREQUAL, c)).intern())) : b == ARAC.tools.constraint.ConstraintParser.SYMBOL.TYPE ? (c = a.pop(), a.pop(), a.push((new ARAC.tools.constraint.Type(c)).intern())) : b == ARAC.tools.constraint.ConstraintParser.SYMBOL.IN && (c = a.pop(), a.pop(), a.push((new ARAC.tools.constraint.Enum(c)).intern()))
			}
		}
		return a.pop()
	},
	isOp1: function(a) {
		return a == ARAC.tools.constraint.ConstraintParser.OP.NOT ? ARAC.tools.constraint.ConstraintParser.SYMBOL.NOT: ARAC.tools.constraint.ConstraintParser.SYMBOL.EOF
	},
	isOp2: function(a) {
		return a == ARAC.tools.constraint.ConstraintParser.OP.OR ? ARAC.tools.constraint.ConstraintParser.SYMBOL.OR: a == ARAC.tools.constraint.ConstraintParser.OP.AND ? ARAC.tools.constraint.ConstraintParser.SYMBOL.AND: a == ARAC.tools.constraint.ConstraintParser.OP.EQ ? ARAC.tools.constraint.ConstraintParser.SYMBOL.EQ: a == ARAC.tools.constraint.ConstraintParser.OP.NE ? ARAC.tools.constraint.ConstraintParser.SYMBOL.NE: a == ARAC.tools.constraint.ConstraintParser.OP.LT ? ARAC.tools.constraint.ConstraintParser.SYMBOL.LT: a == ARAC.tools.constraint.ConstraintParser.OP.LE ? ARAC.tools.constraint.ConstraintParser.SYMBOL.LE: a == ARAC.tools.constraint.ConstraintParser.OP.GT ? ARAC.tools.constraint.ConstraintParser.SYMBOL.GT: a == ARAC.tools.constraint.ConstraintParser.OP.GE ? ARAC.tools.constraint.ConstraintParser.SYMBOL.GE: a == ARAC.tools.constraint.ConstraintParser.OP.TYPE ? ARAC.tools.constraint.ConstraintParser.SYMBOL.TYPE: a == ARAC.tools.constraint.ConstraintParser.OP.IN ? ARAC.tools.constraint.ConstraintParser.SYMBOL.IN: ARAC.tools.constraint.ConstraintParser.SYMBOL.EOF
	},
	toString: function() {
		var a = new String("TConstraintParser [");
		return a = a.concat("]")
	}
};
ARAC.tools.constraint.ConstraintParser.OP = {
	OR: "||",
	AND: "\x26\x26",
	NOT: "!",
	EQ: "\x3d\x3d",
	NE: "!\x3d",
	LT: "\x3c",
	LE: "\x3c\x3d",
	GT: "\x3e",
	GE: "\x3e\x3d",
	TYPE: "type",
	IN: "in"
};
ARAC.tools.constraint.ConstraintParser.SYMBOL = {
	EOF: -1,
	ID: 4294967293,
	LPAREN: 4294967290,
	RPAREN: 4294967289,
	OR: 4294967288,
	AND: 4294967287,
	NOT: 4294967286,
	BINOR: 4294967277,
	INTEGER: 4294967292,
	DOUBLE: 4294967291,
	STRING: 4294967276,
	EQ: 4294967285,
	NE: 4294967284,
	LT: 4294967283,
	LE: 4294967282,
	GT: 4294967281,
	GE: 4294967280,
	TYPE: 4294967279,
	IN: 4294967278
};
ARAC.tools.constraint.And = function(a, b) {
	this.a = a;
	this.b = b
};
ARAC.inherit(ARAC.tools.constraint.And, ARAC.tools.constraint.Constraint, {
	validate: function(a) {
		return this.a.validate(a) && this.b.validate(a)
	},
	validateValue: function(a) {
		return this.b.validateValue(this.a.validateValue(a))
	},
	trace: function() {
		return "(" + this.a.trace() + " \x26\x26 " + this.b.trace() + ")"
	},
	toString: function() {
		var a = new String("And ["),
		a = a.concat(this.trace());
		return a = a.concat("]")
	}
});
ARAC.tools.constraint.Enum = function(a) {
	this.enumeration = a
};
ARAC.inherit(ARAC.tools.constraint.Enum, ARAC.tools.constraint.Constraint, {
	getAlternatives: function() {
		return this.enumeration
	},
	validate: function(a) {
		return ARAC.core.arrayFind(this.enumeration, a)
	},
	validateValue: function(a) {
		return ARAC.core.arrayFind(this.enumeration, a) ? a: this.enumeration[0]
	},
	trace: function() {
		for (var a = new String,
		a = a.concat("value in ("), b = 0; b < this.enumeration.length; b++) a = a.concat("'"),
		a = a.concat(this.enumeration[b]),
		a = a.concat("'"),
		b < this.enumeration.length - 1 && (a = a.concat(" | "));
		return a = a.concat(")")
	},
	toString: function() {
		var a = new String("Enum ["),
		a = a.concat(this.trace());
		return a = a.concat("]")
	}
});
ARAC.tools.constraint.Negate = function(a) {
	this.a = a
};
ARAC.inherit(ARAC.tools.constraint.Negate, ARAC.tools.constraint.Constraint, {
	validate: function(a) {
		return ! this.a.validate(a)
	},
	trace: function() {
		return "(!" + this.a.trace() + ")"
	},
	toString: function() {
		var a = new String("Negate ["),
		a = a.concat(this.trace());
		return a = a.concat("]")
	}
});
ARAC.tools.constraint.Number = function(a, b) {
	this.type = a;
	this.number = b
};
ARAC.inherit(ARAC.tools.constraint.Number, ARAC.tools.constraint.Constraint, {
	validate: function(a) {
		var b = ARAC.tools.constraint.Number.TYPE;
		switch (this.type) {
		case b.EQUAL:
			return a == this.number;
		case b.NOTEQUAL:
			return a != this.number;
		case b.LESS:
			return a < this.number;
		case b.LESSOREQUAL:
			return a <= this.number;
		case b.GREATER:
			return a > this.number;
		case b.GREATEROREQUAL:
			return a >= this.number
		}
		return ! 1
	},
	validateValue: function(a) {
		var b = ARAC.tools.constraint.Number.TYPE;
		switch (this.type) {
		case b.EQUAL:
			return a == this.number ? a: this.number;
		case b.NOTEQUAL:
			return a != this.number ? a: this.number + 1;
		case b.LESS:
			return a < this.number ? a: this.number - 1;
		case b.LESSOREQUAL:
			return a <= this.number ? a: this.number;
		case b.GREATER:
			return a > this.number ? a: this.number + 1;
		case b.GREATEROREQUAL:
			return a >= this.number ? a: this.number
		}
	},
	trace: function() {
		var a = ARAC.tools.constraint.Number.TYPE;
		switch (this.type) {
		case a.EQUAL:
			return "(value \x3d\x3d " + this.number + ")";
		case a.NOTEQUAL:
			return "(value !\x3d " + this.number + ")";
		case a.LESS:
			return "(value \x3c " + this.number + ")";
		case a.LESSOREQUAL:
			return "(value \x3c\x3d " + this.number + ")";
		case a.GREATER:
			return "(value \x3e " + this.number + ")";
		case a.GREATEROREQUAL:
			return "(value \x3e\x3d " + this.number + ")"
		}
		return ""
	},
	toString: function() {
		var a = new String("Number ["),
		a = a.concat(this.trace());
		return a = a.concat("]")
	}
});
ARAC.tools.constraint.Number.TYPE = {
	EQUAL: 1,
	NOTEQUAL: 2,
	LESS: 3,
	LESSOREQUAL: 4,
	GREATER: 5,
	GREATEROREQUAL: 6
};
ARAC.tools.constraint.Or = function(a, b) {
	this.a = a;
	this.b = b
};
ARAC.inherit(ARAC.tools.constraint.Or, ARAC.tools.constraint.Constraint, {
	validate: function(a) {
		return this.a.validate(a) || this.b.validate(a)
	},
	validateValue: function(a) {
		var b = this.a.validateValue(a),
		c = this.b.validateValue(a);
		return b == a || c == a ? a: b
	},
	trace: function() {
		return "(" + this.a.trace() + " || " + this.b.trace() + ")"
	},
	toString: function() {
		var a = new String("Or ["),
		a = a.concat(this.trace());
		return a = a.concat("]")
	}
});
ARAC.tools.constraint.Type = function(a) {
	this.type = a
};
ARAC.inherit(ARAC.tools.constraint.Type, ARAC.tools.constraint.Constraint, {
	validate: function(a) {
		var b = typeof a,
		c = !1;
		switch (this.type) {
		case "Boolean":
			c = "boolean" == b ? !0 : !1;
			break;
		case "Integer":
			(c = "number" == b ? !0 : !1) && (c = a.isFloat() ? !1 : !0);
			break;
		case "Double":
			c = "number" == b ? !0 : !1;
			break;
		case "String":
			c = "string" == b ? !0 : !1
		}
		return c
	},
	validateValue: function(a) {
		var b = typeof a;
		switch (this.type) {
		case "Boolean":
			return "boolean" == b ? a: !0;
		case "Integer":
			return "number" == b ? a.isFloat() ? Math.round(a) : a: 1;
		case "Double":
			return "number" == b ? a: 1;
		case "String":
			return "string" == b ? a: "string"
		}
	},
	trace: function() {
		return "value typeof " + this.type
	},
	toString: function() {
		var a = new String("Type ["),
		a = a.concat(this.trace());
		return a = a.concat("]")
	}
});
ARAC.tools.attribute = {};
ARAC.tools.attribute.Attribute = function(a, b, c, e) {
	this.name = a;
	this.value = b;
	this.mutable = e || !0;
	this.cs = c
};
ARAC.tools.attribute.Attribute.prototype = {
	getName: function() {
		return this.name
	},
	isMutable: function() {
		return this.mutable
	},
	setMutable: function(a) {
		this.mutable = a
	},
	getValue: function() {
		return this.value
	},
	setValue: function(a) {
		this.mutable && (this.valid(a) ? this.value = a: this.value = this.cs.validateValue(a))
	},
	getConstraint: function() {
		return this.cs
	},
	valid: function(a) {
		return null == this.cs ? !0 : this.cs.validate(a)
	},
	clone: function() {},
	toString: function() {
		var a = new String("Attribute ["),
		a = a.concat(this.name),
		a = a.concat(" "),
		a = a.concat(this.value),
		a = a.concat(" "),
		a = a.concat(this.cs);
		return a = a.concat("]")
	}
};
ARAC.tools.attribute.AttributeCollection = function() {};
ARAC.tools.attribute.AttributeCollection.prototype = {
	size: function() {},
	depth: function() {},
	getNames: function() {},
	contains: function(a) {},
	get: function(a) {},
	add: function(a) {},
	remove: function(a) {
		this.remove(a.getName())
	},
	removeByName: function(a) {},
	clear: function() {},
	find: function(a) {},
	findRemove: function(a) {},
	clone: function() {},
	toString: function() {
		var a = new String("AttributeCollection [");
		return a = a.concat("]")
	}
};
ARAC.tools.attribute.AttributeCollection.SEPARATOR = ":";
ARAC.tools.attribute.AttributeSet = function() {
	this.names = [];
	this.atts = {}
};
ARAC.inherit(ARAC.tools.attribute.AttributeSet, ARAC.tools.attribute.AttributeCollection, {
	size: function() {
		return this.names.length
	},
	depth: function() {},
	getNames: function() {
		return this.names
	},
	contains: function(a) {
		return null != this.atts[a]
	},
	get: function(a) {
		return this.atts[a]
	},
	add: function(a) {
		var b = a.getName();
		this.names.push(b);
		this.atts[b] = a
	},
	removeByName: function(a) {
		ARAC.core.arrayRemove(this.names, a);
		delete this.atts[a]
	},
	clear: function() {},
	find: function(a) {},
	findRemove: function(a) {},
	clone: function() {},
	toString: function() {
		for (var a = new String("AttributeSet ["), b = 0; b < this.names.length; b++) a = 0 < b ? a.concat(" " + this.atts[this.names[b]]) : a.concat(this.atts[this.names[b]]);
		return a = a.concat("]")
	}
});
ARAC.layout = {
	defaultConfigStore: null,
	_forceInstance: null,
	_treeInstance: null,
	_flowInstance: null,
	_gridInstance: null,
	_edgeInstance: null,
	initDefaultConfigStore: function() {
		this.defaultConfigStore = new ARAC.layout.ConfigStore
	},
	applyFromStore: function(a, b, c, e) {
		e = null != e ? e: this.defaultConfigStore;
		if (!e) throw new ARAC.Error("no configuration store available");
		e = e.get(b);
		if (!e) throw new ARAC.Error("no configuration with the given name[" + b + "] stored. name:");
		this.apply(a, e, c)
	},
	_applyFromStore: function(a, b, c, e, d) {
		d = null != d ? d: this.defaultConfigStore;
		if (!d) throw new ARAC.Error("no configuration store available");
		d = d.get(c);
		if (!d) throw new ARAC.Error("no configuration with the given name[" + c + "] stored. name:");
		this._apply(a, b, d, e)
	},
	apply: function(a, b, c) {
		var e = new ARAC.layout.model.Results;
		a = new ARAC.layout.model.LGraph(a);
		if (b) {
			switch (b._layoutType) {
			case "force":
				this._applyForce(e, a, b, c);
				break;
			case "tree":
				this._applyTree(e, a, b, c);
				break;
			case "flow":
				this._applyFlow(e, a, b, c);
				break;
			case "grid":
				this._applyGrid(e, a, b, c);
				break;
			case "chain":
				this._applyChain(e, a, b, c);
				break;
			default:
				throw new ARAC.Error("given layout type not supported. type:" + b._layoutType);
			}
			if (b.recordResults) return e
		}
	},
	_apply: function(a, b, c, e) {
		switch (c._layoutType) {
		case "force":
			this._applyForce(a, b, c, e);
			break;
		case "tree":
			this._applyTree(a, b, c, e);
			break;
		case "flow":
			this._applyFlow(a, b, c, e);
			break;
		case "grid":
			this._applyGrid(a, b, c, e);
			break;
		case "chain":
			this._applyChain(a, b, c, e);
			break;
		default:
			throw new ARAC.Error("given layout type not supported. type:" + c._layoutType);
		}
	},
	applyForce: function(a, b, c) {
		a = new ARAC.layout.model.LGraph(a);
		var e = new ARAC.layout.model.Results;
		this._applyForce(e, a, b, c)
	},
	_applyForce: function(a, b, c, e) {
		this._forceInstance || (this._forceInstance = new ARAC.layout.force.ForceLayout(null, null));
		this._forceInstance.apply(a, b, c, e); (void 0 == c.doEdge || c.doEdge) && this._applyEdge(a, b, c, e)
	},
	applyTree: function(a, b, c) {
		a = new ARAC.layout.model.LGraph(a);
		var e = new ARAC.layout.model.Results;
		this._applyTree(e, a, b, c)
	},
	_applyTree: function(a, b, c, e) {
		this._treeInstance || (this._treeInstance = new ARAC.layout.tree.TreeLayout);
		this._treeInstance.apply(a, b, c, e); (void 0 == c.doEdge || c.doEdge) && this._applyEdge(a, b, c, e)
	},
	applyFlow: function(a, b, c) {
		a = new ARAC.layout.model.LGraph(a);
		var e = new ARAC.layout.model.Results;
		this._applyFlow(e, a, b, c)
	},
	_applyFlow: function(a, b, c, e) {
		this._flowInstance || (this._flowInstance = new ARAC.layout.flow.FlowLayout);
		this._flowInstance.apply(a, b, c, e); (void 0 == c.doEdge || c.doEdge) && this._applyEdge(a, b, c, e)
	},
	applyGrid: function(a, b, c) {
		a = new ARAC.layout.model.LGraph(a);
		var e = new ARAC.layout.model.Results;
		this._applyGrid(e, a, b, c)
	},
	_applyGrid: function(a, b, c, e) {
		this._gridInstance || (this._gridInstance = new ARAC.layout.grid.GridLayout);
		this._gridInstance.apply(a, b, c, e); (void 0 == c.doEdge || c.doEdge) && this._applyEdge(a, b, c, e)
	},
	_applyChain: function(a, b, c, e) {
		this._chainInstance || (this._chainInstance = new ARAC.layout.chain.Chain);
		this._chainInstance.apply(a, b, c, e)
	},
	_applyEdge: function(a, b, c, e) {
		this._edgeInstance || (this._edgeInstance = new ARAC.layout.edge.Simple(null, null));
		this._edgeInstance.apply(a, b, c, e)
	}
};
ARAC.layout.EdgeAdapter = function() {};
ARAC.layout.EdgeAdapter.prototype = {
	getID: function() {
		throw new ARAC.Error("EdgeAdapter.getID() not implemented");
	},
	getTags: function() {
		throw new ARAC.Error("EdgeAdapter.getTags() not implemented");
	},
	getType: function() {
		throw new ARAC.Error("EdgeAdapter.getType() not implemented");
	},
	setType: function(a, b) {
		throw new ARAC.Error("EdgeAdapter.setType() not implemented");
	},
	getSource: function() {
		throw new ARAC.Error("EdgeAdapter.getSource() not implemented");
	},
	getSourcePort: function() {
		throw new ARAC.Error("EdgeAdapter.getSourcePort() not implemented");
	},
	setSourcePort: function(a) {
		throw new ARAC.Error("EdgeAdapter.setSourcePort() not implemented");
	},
	getTarget: function() {
		throw new ARAC.Error("EdgeAdapter.getTarget() not implemented");
	},
	getTargetPort: function() {
		throw new ARAC.Error("EdgeAdapter.getTargetPort() not implemented");
	},
	setTargetPort: function(a) {
		throw new ARAC.Error("EdgeAdapter.setTargetPort() not implemented");
	},
	getCoordinates: function() {
		throw new ARAC.Error("EdgeAdapter.getCoordinates() not implemented");
	},
	setCoordinates: function(a, b) {
		throw new ARAC.Error("EdgeAdapter.setCoordinates() not implemented");
	},
	setCoordinatesArr: function(a) {
		throw new ARAC.Error("EdgeAdapter.setCoordinatesArr() not implemented");
	}
};
ARAC.layout.GraphAdapter = function() {};
ARAC.layout.GraphAdapter.prototype = {
	getNodes: function() {
		throw new ARAC.Error("GraphAdapter.getNodes() not implemented");
	},
	getEdges: function() {
		throw new ARAC.Error("GraphAdapter.getEdges() not implemented");
	}
};
ARAC.layout.NodeAdapter = function() {};
ARAC.layout.NodeAdapter.prototype = {
	getID: function() {
		throw new ARAC.Error("NodeAdapter.getID() not implemented");
	},
	getTags: function() {
		throw new ARAC.Error("NodeAdapter.getTags() not implemented");
	},
	getIndegree: function() {
		throw new ARAC.Error("NodeAdapter.getIndegree() not implemented");
	},
	getOutdegree: function() {
		throw new ARAC.Error("NodeAdapter.getOutdegree() not implemented");
	},
	getInboundEdges: function() {
		throw new ARAC.Error("NodeAdapter.getInboundEdges() not implemented");
	},
	getOutboundEdges: function() {
		throw new ARAC.Error("NodeAdapter.getOutboundEdges() not implemented");
	},
	getInboundNodes: function() {
		throw new ARAC.Error("NodeAdapter.getInboundNodes() not implemented");
	},
	getOutboundNodes: function() {
		throw new ARAC.Error("NodeAdapter.getOutboundNodes() not implemented");
	},
	isInboundNode: function(a) {
		throw new ARAC.Error("NodeAdapter.isInboundNode() not implemented");
	},
	isOutboundNode: function(a) {
		throw new ARAC.Error("NodeAdapter.isOutboundNode() not implemented");
	},
	getPorts: function() {
		throw new ARAC.Error("NodeAdapter.getPorts() not implemented");
	},
	getPortAt: function(a) {
		throw new ARAC.Error("NodeAdapter.getPortAt() not implemented");
	},
	getCenter: function() {
		throw new ARAC.Error("NodeAdapter.getCenter() not implemented");
	},
	setCenter: function(a) {
		throw new ARAC.Error("NodeAdapter.setCenter() not implemented");
	},
	setCenterXY: function(a, b) {
		throw new ARAC.Error("NodeAdapter.setCenterXY() not implemented");
	},
	getBBox: function() {
		throw new ARAC.Error("NodeAdapter.getBBox() not implemented");
	},
	setBBox: function(a) {
		throw new ARAC.Error("NodeAdapter.setBBox() not implemented");
	},
	getAttribute: function(a) {
		throw new ARAC.Error("NodeAdapter.getAttribute() not implemented");
	}
};
ARAC.layout.PortAdapter = function() {};
ARAC.layout.PortAdapter.prototype = {
	getID: function() {
		throw new ARAC.Error("PortAdapter.getID() not implemented");
	},
	getName: function() {
		throw new ARAC.Error("PortAdapter.getName() not implemented");
	},
	getCoordinate: function() {
		throw new ARAC.Error("PortAdapter.getCoordinate() not implemented");
	}
};
ARAC.layout.ConfigStore = function() {
	this._layoutstore = {}
};
ARAC.layout.ConfigStore.prototype = {
	getSize: function() {
		var a = 0,
		b;
		for (b in this._layoutstore) void 0 != this._layoutstore[b] && a++;
		return a
	},
	getNames: function() {
		var a = [],
		b;
		for (b in this._layoutstore) a.push(b);
		return a
	},
	isStored: function(a) {
		return null != this._layoutstore[a]
	},
	get: function(a) {
		return this._layoutstore[a]
	},
	store: function(a, b) {
		if (null != this._layoutstore[a]) throw new ARAC.Error("configuration name already in use");
		this._layoutstore[a] = b
	},
	remove: function(a) {
		delete this._layoutstore[a]
	},
	loadXML: function(a) {
		var b = {},
		c = a.getElementsByTagName("edgemappingset"),
		e,
		d,
		f = {},
		g,
		h,
		k,
		q;
		for (h = 0; h < c.length; h++) {
			g = c[h].getAttribute("name");
			q = [];
			e = c[h].getElementsByTagName("edgemapping");
			for (k = 0; k < e.length; k++)(d = ARAC.layout.config.ReadEdgeMapping(e[k])) && q.push(d);
			b[g] = q
		}
		f.edgeMappingSets = b;
		this._loadConfig(a, f, new ARAC.layout.force.ForceLayoutConfig, "force");
		this._loadConfig(a, f, new ARAC.layout.tree.TreeLayoutConfig, "tree");
		this._loadConfig(a, f, new ARAC.layout.flow.FlowLayoutConfig, "flow");
		this._loadConfig(a, f, new ARAC.layout.grid.GridLayoutConfig, "grid");
		this._loadConfig(a, f, new ARAC.layout.edge.SimpleConfig, "edge");
		this._loadConfig(a, f, new ARAC.layout.chain.ChainLayoutConfig, "chain")
	},
	_loadConfig: function(a, b, c, e) {
		a = a.getElementsByTagName(e);
		var d, f;
		for (e = 0; e < a.length; e++) d = a[e].getAttribute("name"),
		f = c.copy(),
		f.fromXML(a[e], b),
		this._layoutstore[d] = f
	}
};
ARAC.layout.LayoutWatch = function() {};
ARAC.layout.LayoutWatch.prototype = {
	startLayout: function() {},
	stopLayout: function() {},
	layoutProgress: function(a) {},
	edgeTypeChange: function(a, b) {}
};
ARAC.layout.Attributes = {
	names: {
		treeStyle: "Tree Style",
		parentBalancing: "Parent Balancing",
		pathBalancing: "Path Balancing",
		layoutOrientation: "Orientation",
		nodeDistance: "Node Distance",
		layerDistance: "Layer Distance",
		attraction: "Attraction",
		rejection: "Rejection",
		gravitation: "Gravitation",
		iterations: "Iterations",
		gridType: "Grid Type",
		flowDirection: "Flow Direction",
		xAscending: "X Ascending",
		yAscending: "Y Ascending",
		rowGap: "Row Gap",
		colGap: "Column Gap",
		cellCount: "Cell Count",
		cellExtend: "Cell Extend",
		cellWidth: "Cell Width",
		cellHeight: "Cell Height",
		xNodeScaling: "X Node Scaling",
		yNodeScaling: "Y Node Scaling"
	},
	constraint: {
		nodeDistance: (new ARAC.tools.constraint.ConstraintParser).parse("value \x3e\x3d 0"),
		layerDistance: (new ARAC.tools.constraint.ConstraintParser).parse("value \x3e\x3d 0"),
		rowGap: (new ARAC.tools.constraint.ConstraintParser).parse("value \x3e\x3d 0"),
		colGap: (new ARAC.tools.constraint.ConstraintParser).parse("value \x3e\x3d 0"),
		cellCount: (new ARAC.tools.constraint.ConstraintParser).parse("value \x3e 0"),
		cellExtend: (new ARAC.tools.constraint.ConstraintParser).parse("value \x3e\x3d -1"),
		cellWidth: (new ARAC.tools.constraint.ConstraintParser).parse("value \x3e\x3d 0"),
		cellHeight: (new ARAC.tools.constraint.ConstraintParser).parse("value \x3e\x3d 0")
	},
	idx: {
		treeStyle: 1,
		layoutOrientation: 10,
		parentBalancing: 30,
		pathBalancing: 31,
		layerDistance: 50,
		nodeDistance: 70,
		gridType: 1,
		flowDirection: 2,
		xAscending: 3,
		yAscending: 4,
		rowGap: 5,
		colGap: 6,
		cellCount: 10,
		cellExtend: 11,
		cellWidth: 12,
		cellHeight: 13,
		xNodeScaling: 20,
		yNodeScaling: 21
	},
	hidden: {
		_layoutType: !0,
		submitIntermediateResults: !0,
		layoutOriginProcessor: !0,
		layoutOriginAnchor: !0,
		layoutOriginNode: !0,
		xArea: !0,
		yArea: !0
	},
	getAttributes: function(a) {
		var b, c = new ARAC.tools.attribute.AttributeSet,
		e;
		for (e in a) a.hasOwnProperty(e) && ("object" != typeof a[e] && !this.hidden[e]) && (b = new ARAC.tools.attribute.Attribute(e, a[e], this.constraint[e]), b.displayName = void 0 != this.names[e] ? this.names[e] : e, c.add(b));
		c.names.sort(function(a, b) {
			return ARAC.layout.Attributes.idx[a] && ARAC.layout.Attributes.idx[b] ? ARAC.layout.Attributes.idx[a] - ARAC.layout.Attributes.idx[b] : 0
		});
		return c
	},
	applyAttribute: function(a, b) {
		void 0 != a[b.getName()] && (a[b.getName()] = b.getValue())
	},
	applyAttributes: function(a, b) {}
};
ARAC.layout.config = {};
ARAC.layout.config.LayoutOriginAnchor = {
	CENTER: 1,
	LEFT_TOP: 2,
	fromString: function(a) {
		switch (a) {
		case "Center":
			return this.CENTER;
		case "LeftTop":
			return this.LEFT_TOP
		}
	},
	toString: function(a) {
		switch (a) {
		case this.CENTER:
			return "Center";
		case this.LEFT_TOP:
			return "LeftTop"
		}
	}
};
ARAC.layout.config.LayoutOriginProcessor = {
	NONE: 0,
	NODES_LEFTTOP: 1,
	NODES_CENTER: 2,
	ROOT_LEFTTOP: 10,
	CNODE_LEFTTOP: 20,
	fromString: function(a) {
		switch (a) {
		case "None":
			return this.NONE;
		case "NodesLeftTop":
			return this.NODES_LEFTTOP;
		case "NodesCenter":
			return this.NODES_CENTER;
		case "RootLeftTop":
			return this.ROOT_LEFTTOP;
		case "CustomNodeLeftTop":
			return this.CNODE_LEFTTOP
		}
	},
	toString: function(a) {
		switch (a) {
		case this.NONE:
			return "None";
		case this.NODES_LEFTTOP:
			return "NodesLeftTop";
		case this.NODES_CENTER:
			return "NodesCenter";
		case this.ROOT_LEFTTOP:
			return "RootLeftTop";
		case this.CNODE_LEFTTOP:
			return "CustomNodeLeftTop"
		}
	}
};
ARAC.layout.config.LayoutOrientation = {
	TOP_TO_BOTTOM: 1,
	BOTTOM_TO_TOP: 2,
	LEFT_TO_RIGHT: 3,
	RIGHT_TO_LEFT: 4,
	fromString: function(a) {
		switch (a) {
		case "TopToBottom":
			return this.TOP_TO_BOTTOM;
		case "BottomToTop":
			return this.BOTTOM_TO_TOP;
		case "LeftToRight":
			return this.LEFT_TO_RIGHT;
		case "RightToLeft":
			return this.RIGHT_TO_LEFT
		}
	},
	toString: function(a) {
		switch (a) {
		case this.TOP_TO_BOTTOM:
			return "TopToBottom";
		case this.BOTTOM_TO_TOP:
			return "BottomToTop";
		case this.LEFT_TO_RIGHT:
			return "LeftToRight";
		case this.RIGHT_TO_LEFT:
			return "RightToLeft"
		}
	}
};
ARAC.layout.config.ParentBalancing = {
	HEAD: 1,
	MEDIAN: 2,
	TAIL: 3,
	fromString: function(a) {
		switch (a) {
		case "Head":
			return this.HEAD;
		case "Median":
			return this.MEDIAN;
		case "Tail":
			return this.TAIL
		}
	},
	toString: function(a) {
		switch (a) {
		case this.HEAD:
			return "Head";
		case this.MEDIAN:
			return "Median";
		case this.TAIL:
			return "Tail"
		}
	}
};
ARAC.layout.config.PathBalancing = {
	BALANCE_NORMAL: 1,
	BALANCE_LONGEST_PATH: 2,
	BALANCE_SHORTEST_PATH: 3,
	fromString: function(a) {
		switch (a) {
		case "Normal":
			return this.BALANCE_NORMAL;
		case "LongestPath":
			return this.BALANCE_LONGEST_PATH;
		case "ShortestPath":
			return this.BALANCE_SHORTEST_PATH
		}
	},
	toString: function(a) {
		switch (a) {
		case this.BALANCE_NORMAL:
			return "Normal";
		case this.BALANCE_LONGEST_PATH:
			return "LongestPath";
		case this.BALANCE_SHORTEST_PATH:
			return "ShortestPath"
		}
	}
};
ARAC.layout.config.TreeStyle = {
	TREE_NORMAL: 1,
	TREE_LIST_SINGLE: 2,
	TREE_LIST_DOUBLE: 4,
	TREE_HV: 5,
	fromString: function(a) {
		switch (a) {
		case "TreeNormal":
			return this.TREE_NORMAL;
		case "TreeListSingle":
			return this.TREE_LIST_SINGLE;
		case "TreeListDouble":
			return this.TREE_LIST_DOUBLE;
		case "TreeHV":
			return this.TREE_HV
		}
	},
	toString: function(a) {
		switch (a) {
		case this.TREE_NORMAL:
			return "TreeNormal";
		case this.TREE_LIST_SINGLE:
			return "TreeListSingle";
		case this.TREE_LIST_DOUBLE:
			return "TreeListDouble";
		case this.TREE_HV:
			return "TreeHV"
		}
	}
};
ARAC.layout.config.GridType = {
	GRID_FLOW_DISTANCE: 1,
	GRID_FLOW_RASTER: 2,
	GRID_FLOW_GRIDBACK: 3,
	GRID_RASTER: 4,
	fromString: function(a) {
		switch (a) {
		case "GridFlowDistance":
			return this.GRID_FLOW_DISTANCE;
		case "GridFlowRaster":
			return this.GRID_FLOW_RASTER;
		case "GridFlowGridback":
			return this.GRID_FLOW_GRIDBACK;
		case "GridRaster":
			return this.GRID_RASTER
		}
	},
	toString: function(a) {
		switch (a) {
		case this.GRID_FLOW_DISTANCE:
			return "GridFlowDistance";
		case this.GRID_FLOW_RASTER:
			return "GridFlowRaster";
		case this.GRID_FLOW_GRIDBACK:
			return "GridFlowGridback";
		case this.GRID_RASTER:
			return "GridRaster"
		}
	}
};
ARAC.layout.config.FlowDirection = {
	ROW_FLOW: 1,
	COL_FLOW: 2,
	fromString: function(a) {
		switch (a) {
		case "RowFlow":
			return this.ROW_FLOW;
		case "ColFlow":
			return this.COL_FLOW
		}
	},
	toString: function(a) {
		switch (a) {
		case this.ROW_FLOW:
			return "RowFlow";
		case this.COL_FLOW:
			return "ColFlow"
		}
	}
};
ARAC.layout.config.NodeScaling = {
	NONE: 1,
	MAX_CELL_EXTEND: 3,
	AREA_EXTEND: 4,
	PROPORTIONAL_AREA_EXTEND: 5,
	fromString: function(a) {
		switch (a) {
		case "None":
			return this.NONE;
		case "MaxCellExtend":
			return this.MAX_CELL_EXTEND;
		case "AreaExtend":
			return this.AREA_EXTEND;
		case "ProportionalAreaExtend":
			return this.PROPORTIONAL_AREA_EXTEND
		}
	},
	toString: function(a) {
		switch (a) {
		case this.NONE:
			return "None";
		case this.MAX_CELL_EXTEND:
			return "MaxCellExtend";
		case this.AREA_EXTEND:
			return "AreaExtend";
		case this.PROPORTIONAL_AREA_EXTEND:
			return "ProportionalAreaExtend"
		}
	}
};
ARAC.layout.config.EdgeType = {
	STRAIGHT: 1,
	ELBOW: 10,
	ORTHOGONAL: 20,
	fromString: function(a) {
		switch (a) {
		case "Straight":
			return this.STRAIGHT;
		case "Elbow":
			return this.ELBOW;
		case "Orthogonal":
			return this.ORTHOGONAL
		}
	},
	toString: function(a) {
		switch (a) {
		case this.STRAIGHT:
			return "Straight";
		case this.ELBOW:
			return "Elbow";
		case this.ORTHOGONAL:
			return "Orthogonal"
		}
	}
};
ARAC.layout.config.LayoutConfig = function(a, b) {
	this._layoutType = a;
	this.submitIntermediateResults = this.recordResults = !1;
	this.resultUpdate = null
};
ARAC.layout.config.LayoutConfig.prototype = {
	fromXML: function(a, b) {
		var c = a.getAttribute("layoutType");
		c && (this._layoutType = c)
	},
	toXML: function(a) {
		a.writeAttributeString("layoutType", this._layoutType)
	}
};
ARAC.layout.config.NLConfig = function(a, b) {
	ARAC.layout.config.NLConfig._superInit.call(this, a, b);
	this.layoutOrigin = b && b.layoutOrigin || new ARAC.Coord(0, 0);
	this.layoutOriginAnchor = b && b.layoutOriginAnchor || ARAC.layout.config.LayoutOriginAnchor.LEFT_TOP;
	this.layoutOriginProcessor = b && b.layoutOriginProcessor || ARAC.layout.config.LayoutOriginProcessor.NONE;
	this.layoutOriginNode = void 0;
	this.edgeType = b && b.edgeType || ARAC.layout.config.EdgeType.STRAIGHT;
	this.edgeTypeDesc = new ARAC.layout.config.EdgeDesc(b && b.edgeTypeDesc || void 0);
	this.forceEdgeType = b && b.forceEdgeType || !0;
	this.edgeMappings = void 0;
	if (b && b.edgeMappings) {
		this.edgeMappings = [];
		for (var c = 0; c < b.edgeMappings.length; c++) this.edgeMappings[c] = b.edgeMappings[c].copy()
	}
	this.tags = b && b.tags ? ARAC.core.arrayCopy(b.tags) : [];
	this.careAnnex = b && b.careAnnex || !0;
	this.tagsNAnnex = b && b.tagsNAnnex ? ARAC.core.arrayCopy(b.tagsNAnnex) : []
};
ARAC.inherit(ARAC.layout.config.NLConfig, ARAC.layout.config.LayoutConfig, {
	isNode: function(a) {
		if (!this.tags || 0 == this.tags.length) return ! 0;
		a = a.getTags();
		var b;
		for (b = 0; b < a.length; b++) if (ARAC.core.arrayFind(this.tags, a[b])) return ! 0;
		return ! 1
	},
	isNonAnnex: function(a) {
		a = a.getTags();
		var b;
		for (b = 0; b < a.length; b++) if (ARAC.core.arrayFind(this.tagsNAnnex, a[b])) return ! 0;
		return ! 1
	},
	edgeMapping: function() {
		if (void 0 != this.edgeMappings) for (var a = 0; a < this.edgeMappings.length; a++) if (this.edgeMappings[a].met(this)) return this.edgeMappings[a];
		return null
	},
	fromXML: function(a, b) {
		ARAC.layout.config.NLConfig._super.fromXML.call(this, a, b);
		var c = a.getAttribute("layoutOrigin");
		c && (this.layoutOrigin = ARAC.CoordParser.parseSingle(c));
		if (c = a.getAttribute("layoutOriginProcessor")) this.layoutOriginProcessor = ARAC.layout.config.LayoutOriginProcessor.fromString(c);
		if (c = a.getAttribute("layoutOriginAnchor")) this.layoutOriginAnchor = ARAC.layout.config.LayoutOriginAnchor.fromString(c);
		if (c = a.getAttribute("edgeType")) this.edgeType = ARAC.layout.config.EdgeType.fromString(c); (c = a.getAttribute("edgeTypeDesc")) && this.edgeTypeDesc.fromString(c);
		this.tags = this._readSepArr(a, this.tags, "tags", ",");
		if (c = a.getAttribute("careAnnex")) this.careAnnex = "true" == c ? !0 : !1;
		this.tagsNAnnex = this._readSepArr(a, this.tagsNAnnex, "tagsNonAnnex", ",");
		if (c = a.getAttribute("forceEdgeType")) this.forceEdgeType = "true" == c ? !0 : !1;
		var e = a.getElementsByTagName("edgemapping");
		if (null != e && 0 < e.length) {
			this.edgeMappings = [];
			for (var d = 0; d < e.length; d++)(c = ARAC.layout.config.ReadEdgeMapping(e[d])) && this.edgeMappings.push(c)
		} else this.edgeMappings = void 0;
		e = a.getElementsByTagName("edgemappingset");
		if (null != e && 0 < e.length && b && b.edgeMappingSets) for (this.edgeMappings || (this.edgeMappings = []), d = 0; d < e.length; d++) {
			if (c = e[d].getAttribute("name"), b.edgeMappingSets[c]) for (var f = 0; f < b.edgeMappingSets[c].length; f++) this.edgeMappings.push(b.edgeMappingSets[c][f])
		} else this.edgeMappings = void 0
	},
	toXML: function(a) {
		ARAC.layout.config.NLConfig._super.toXML.call(this, a);
		a.writeAttributeString("layoutOrigin", this.layoutOrigin.toString());
		a.writeAttributeString("layoutOriginProcessor", ARAC.layout.config.LayoutOriginProcessor.toString(this.layoutOriginProcessor));
		a.writeAttributeString("layoutOriginAnchor", ARAC.layout.config.LayoutOriginAnchor.toString(this.layoutOriginAnchor));
		a.writeAttributeString("edgeType", ARAC.layout.config.EdgeType.toString(this.edgeType));
		a.writeAttributeString("edgeTypeDesc", ARAC.layout.config.EdgeDesc.toString());
		this._writeSepArr(a, this.tags, "tags", ",");
		a.writeAttributeString("careAnnex", this.careAnnex ? "true": "false");
		this._writeSepArr(a, this.tagsNAnnex, "tagsNonAnnex", ",");
		a.writeAttributeString("forceEdgeType", this.forceEdgeType ? "true": "false");
		if (this.edgeMappings && 0 < this.edgeMappings.length) for (var b = 0; b < this.edgeMappings.length; b++) this.edgeMappings[b].toXML(a)
	},
	_readSepArr: function(a, b, c, e) {
		if (a = a.getAttribute(c)) for (e = a.split(e), b || (b = []), a = 0; a < e.length; a++) b.push(ARAC.core.stringTrim(e[a]));
		return b
	},
	_writeSepArr: function(a, b, c, e) {
		void 0 != b && 0 < b.length && a.writeAttributeString(c, b.join(e))
	}
});
ARAC.layout.config.NLConfigDistanceBased = function(a, b) {
	ARAC.layout.config.NLConfigDistanceBased._superInit.call(this, a, b);
	this.nodeDistance = b && b.nodeDistance || 40
};
ARAC.inherit(ARAC.layout.config.NLConfigDistanceBased, ARAC.layout.config.NLConfig, {
	fromXML: function(a, b) {
		ARAC.layout.config.NLConfigDistanceBased._super.fromXML.call(this, a, b);
		var c = a.getAttribute("nodeDistance");
		c && (this.nodeDistance = parseFloat(c))
	},
	toXML: function(a) {
		ARAC.layout.config.NLConfigDistanceBased._super.toXML.call(this, a);
		a.writeAttributeNumber("nodeDistance", this.nodeDistance)
	}
});
ARAC.layout.config.NLConfigLayerBased = function(a, b) {
	ARAC.layout.config.NLConfigLayerBased._superInit.call(this, a, b);
	this.layerDistance = b && b.layerDistance || 30
};
ARAC.inherit(ARAC.layout.config.NLConfigLayerBased, ARAC.layout.config.NLConfigDistanceBased, {
	fromXML: function(a, b) {
		ARAC.layout.config.NLConfigLayerBased._super.fromXML.call(this, a, b);
		var c = a.getAttribute("layerDistance");
		c && (this.layerDistance = parseFloat(c))
	},
	toXML: function(a) {
		ARAC.layout.config.NLConfigLayerBased._super.toXML.call(this, a);
		a.writeAttributeNumber("layerDistance", this.layerDistance)
	}
});
ARAC.layout.config.NLConfigHVOrientationBased = function(a, b) {
	ARAC.layout.config.NLConfigHVOrientationBased._superInit.call(this, a, b);
	this.layoutOrientation = b && b.layoutOrientation || ARAC.layout.config.LayoutOrientation.TOP_TO_BOTTOM
};
ARAC.inherit(ARAC.layout.config.NLConfigHVOrientationBased, ARAC.layout.config.NLConfigDistanceBased, {
	fromXML: function(a, b) {
		ARAC.layout.config.NLConfigHVOrientationBased._super.fromXML.call(this, a, b);
		var c = a.getAttribute("layoutOrientation");
		c && (this.layoutOrientation = ARAC.layout.config.LayoutOrientation.fromString(c))
	},
	toXML: function(a) {
		ARAC.layout.config.NLConfigHVOrientationBased._super.toXML.call(this, a);
		a.writeAttributeString("layoutOrientation", ARAC.layout.config.LayoutOrientation.toString(this.layoutOrientation))
	}
});
ARAC.layout.config.NLConfigHVLayerBased = function(a, b) {
	ARAC.layout.config.NLConfigHVLayerBased._superInit.call(this, a, b);
	this.layerDistance = b && b.layerDistance || 30
};
ARAC.inherit(ARAC.layout.config.NLConfigHVLayerBased, ARAC.layout.config.NLConfigHVOrientationBased, {
	fromXML: function(a, b) {
		ARAC.layout.config.NLConfigHVLayerBased._super.fromXML.call(this, a, b);
		var c = a.getAttribute("layerDistance");
		c && (this.layerDistance = parseFloat(c))
	},
	toXML: function(a) {
		ARAC.layout.config.NLConfigHVLayerBased._super.toXML.call(this, a);
		a.writeAttributeNumber("layerDistance", this.layerDistance)
	}
});
ARAC.layout.config.EdgeMapping = function(a, b, c, e) {
	this.props = a;
	this.settings = b;
	this.config = c;
	this.alternatives = e
};
ARAC.layout.config.EdgeMapping.prototype = {
	met: function(a) {
		var b, c, e;
		for (b = 0; b < this.props.length; b++) if (this.settings[b].length) {
			e = !1;
			for (c = 0; c < this.settings[b].length && !e; c++) a[this.props[b]] == this.settings[b][c] && (e = !0);
			if (!e) return ! 1
		} else if (a[this.props[b]] != this.settings[b]) return ! 1;
		return ! 0
	},
	applySource: function(a, b) {
		var c = null;
		"string" !== typeof b.srcPort && (b.srcPort instanceof String || (c = a.getSource().getPortAt(b.srcPort.resolve(a.getSource().getBBox(), !0))));
		null != c && a.setSourcePort(c);
		return null != c ? c: void 0
	},
	applyTarget: function(a, b) {
		var c = null;
		"string" !== typeof b.tgtPort && (b.tgtPort instanceof String || (c = a.getTarget().getPortAt(b.tgtPort.resolve(a.getTarget().getBBox(), !0))));
		null != c && a.setTargetPort(c);
		return null != c ? c: void 0
	},
	copy: function() {
		for (var a = [], b = 0; b < this.settings.length; b++) a[b] = this.settings[b].length ? ARAC.core.arrayCopy(this.settings[b]) : this.settings[b];
		var c = void 0;
		if (this.alternatives) for (c = [], b = 0; b < this.alternatives.length; b++) c[b] = this.alternatives[b].copy();
		return new ARAC.layout.config.EdgeMapping(ARAC.core.arrayCopy(this.props), a, this.config.copy(), c)
	},
	toXML: function(a) {
		a.writeStartElement("edgemapping");
		var b, c, e;
		for (b = 0; b < this.props.length; b++) {
			a.writeStartElement("propval");
			a.writeAttributeString("prop", this.props[b]);
			if (this.settings[b].length) {
				e = "";
				for (c = 0; c < this.settings[b].length; c++) switch (this.props[b]) {
				case "layoutOrientation":
					e += ARAC.layout.config.LayoutOrientation.toString(this.settings[b][c]);
					c < this.settings[b].length - 1 && (e += ",");
					break;
				case "treeStyle":
					e += ARAC.layout.config.TreeStyle.toString(this.settings[b][c]);
					c < this.settings[b].length - 1 && (e += ",");
					break;
				case "parentBalancing":
					e += ARAC.layout.config.ParentBalancing.toString(this.settings[b][c]),
					c < this.settings[b].length - 1 && (e += ",")
				}
				a.writeAttributeString("value", e)
			} else switch (this.props[b]) {
			case "layoutOrientation":
				a.writeAttributeString("value", ARAC.layout.config.LayoutOrientation.toString(this.settings[b]));
				break;
			case "treeStyle":
				a.writeAttributeString("value", ARAC.layout.config.TreeStyle.toString(this.settings[b]));
				break;
			case "parentBalancing":
				a.writeAttributeString("value", ARAC.layout.config.ParentBalancing.toString(this.settings[b]))
			}
			a.writeEndElement("propval")
		}
		this.config && this.config.toXML(a);
		if (this.alternatives) {
			a.writeStartElement("alternatives");
			for (c = 0; c < this.alternatives.length; c++) this.alternatives[c].toXML(a);
			a.writeEndElement("alternatives")
		}
		a.writeEndElement("edgemapping")
	},
	_writeSepArr: function(a, b, c, e) {
		void 0 != b && 0 < b.length && a.writeAttributeString(c, b.join(e))
	}
};
ARAC.layout.config.ReadEdgeMapping = function(a) {
	var b = function(a, b, c) {
		if (0 <= a.indexOf(",")) {
			a = a.split(",");
			for (var d = [], e = 0; e < a.length; e++) d[e] = c.fromString(a[e].trim());
			b.push(d)
		} else b.push(c.fromString(a))
	};
	a = a.childNodes;
	var c = [],
	e = [],
	d = null,
	f = void 0,
	g,
	h,
	k;
	if (a) for (var q = 0; q < a.length; q++) switch (a[q].tagName) {
	case "propval":
		g = a[q].getAttribute("prop");
		h = a[q].getAttribute("value");
		switch (g) {
		case "layoutOrientation":
			c.push(g);
			b(h, e, ARAC.layout.config.LayoutOrientation);
			break;
		case "treeStyle":
			c.push(g);
			b(h, e, ARAC.layout.config.TreeStyle);
			break;
		case "parentBalancing":
			c.push(g),
			b(h, e, ARAC.layout.config.ParentBalancing)
		}
		break;
	case "config":
		g = a[q].getAttribute("srcPortPos");
		h = a[q].getAttribute("tgtPortPos");
		d = new ARAC.layout.config.EdgeMappingConfig(ARAC.BBoxOp.posFromString(g), ARAC.BBoxOp.posFromString(h));
		break;
	case "alternatives":
		if (k = a[q].getElementsByTagName("config")) for (var f = [], p = 0; p < k.length; p++) g = k[p].getAttribute("srcPortPos"),
		h = k[p].getAttribute("tgtPortPos"),
		f[p] = new ARAC.layout.config.EdgeMappingConfig(ARAC.BBoxOp.posFromString(g), ARAC.BBoxOp.posFromString(h))
	}
	if (null != d) return new ARAC.layout.config.EdgeMapping(c, e, d, f)
};
ARAC.layout.config.WriteEdgeMapping = function(a) {};
ARAC.layout.config.EdgeMappingConfig = function(a, b, c, e) {
	this.srcPort = a;
	this.tgtPort = b;
	this.edgeType = c;
	this.edgeTypeDesc = e
};
ARAC.layout.config.EdgeMappingConfig.prototype = {
	copy: function() {
		return new ARAC.layout.config.EdgeMappingConfig(this.srcPort, this.tgtPort, this.edgeType, this.edgeTypeDesc ? this.edgeTypeDesc.copy() : void 0)
	},
	toXML: function(a) {
		a.writeStartElement("config");
		a.writeAttributeString("srcPortPos", this.srcPort.toString());
		a.writeAttributeString("tgtPortPos", this.tgtPort.toString());
		a.writeEndElement("config")
	}
};
ARAC.layout.config.ElbowType = {
	SRC: 1,
	TGT: 2,
	fromString: function(a) {
		switch (a) {
		case "Source":
			return this.SRC;
		case "Target":
			return this.TGT
		}
	},
	toString: function(a) {
		switch (a) {
		case this.SRC:
			return "Source";
		case this.TGT:
			return "Target"
		}
	}
};
ARAC.layout.config.CrosslineType = {
	SRCORG: 1,
	TGTORG: 2,
	FAKTOR: 3,
	fromString: function(a) {
		switch (a) {
		case "SrcOrg":
			return this.SRCORG;
		case "TgtOrg":
			return this.TGTORG;
		case "Faktor":
			return this.FAKTOR
		}
	},
	toString: function(a) {
		switch (a) {
		case this.SRCORG:
			return "SrcOrg";
		case this.TGTORG:
			return "TgtOrg";
		case this.FAKTOR:
			return "Faktor"
		}
	}
};
ARAC.layout.config.EdgeDesc = function(a) {
	this.lineCorners = a && a.lineCorners || 0;
	this.elbow = a && a.elbow || ARAC.layout.config.ElbowType.SRC;
	this.srcSlope = a && a.srcSlope || 0;
	this.tgtSlope = a && a.tgtSlope || 0;
	this._clType = a && a.clType || ARAC.layout.config.CrosslineType.FAKTOR;
	this._clValue = 0.5
};
ARAC.layout.config.EdgeDesc.prototype = {
	copy: function() {
		return new ARAC.layout.config.EdgeDesc(this)
	},
	toString: function() {
		var a = "";
		0 != this.lineCorners && (a += "lineCorners:" + this.lineCorners);
		this.elbow != ARAC.layout.config.ElbowType.SRC && (0 < a.length && (a += ";"), a += "elbow:" + ARAC.layout.config.ElbowType.toString(this.elbow));
		0 != this.srcSlope && (0 < a.length && (a += ";"), a += "srcSlope:" + this.srcSlope);
		0 != this.tgtSlope && (0 < a.length && (a += ";"), a += "tgtSlope:" + this.tgtSlope);
		return a
	},
	fromString: function(a) {
		this.fromToken(ARAC.core.stringSplit(a, ";"))
	},
	fromToken: function(a) {
		for (var b = 0; b < a.length; b++) 0 <= a[b].indexOf("lineCorners") ? this.lineCorners = parseInt(ARAC.core.stringSplit(a[b], ":")[1]) : 0 <= a[b].indexOf("elbow") ? this.elbow = ARAC.layout.config.ElbowType.fromString(ARAC.core.stringSplit(a[b], ":")[1]) : 0 <= a[b].indexOf("srcSlope") ? this.srcSlope = parseInt(ARAC.core.stringSplit(a[b], ":")[1]) : 0 <= a[b].indexOf("tgtSlope") && (this.tgtSlope = parseInt(ARAC.core.stringSplit(a[b], ":")[1]))
	}
};
ARAC.layout.model = {};
ARAC.layout.model.Annex = function(a, b, c, e) {
	var d = a.getBBox(),
	f = e[a.getID()];
	f && d.setCenter(f.x, f.y);
	this.nodes = [];
	this.bboxAll = new ARAC.BBox(d.x1, d.y1, d.x2, d.y2);
	b && 0 < b.length ? (this.visited = {},
	this.visited[a.getID()] = a, this._sink(d.getCenter(), a, b, c, e), this.mxl = Math.max(0, d.x1 - this.bboxAll.x1), this.mxu = Math.max(0, this.bboxAll.x2 - d.x2), this.myl = Math.max(0, d.y1 - this.bboxAll.y1), this.myu = Math.max(0, this.bboxAll.y2 - d.y2), delete this.visited) : this.mxl = this.mxu = this.myl = this.myu = 0
};
ARAC.layout.model.Annex.prototype = {
	move: function(a, b, c) {
		this.bboxAll.setCenter(a.x, a.y);
		if (this.nodes) for (var e = 0; e < this.nodes.length; e++) c || this.nodes[e].n.setCenter(new ARAC.Coord(a.x + this.nodes[e].ox, a.y + this.nodes[e].oy)),
		b && (b[this.nodes[e].n.getID()] = new ARAC.Coord(a.x + this.nodes[e].ox, a.y + this.nodes[e].oy))
	},
	union: function(a) {
		a.mxl = Math.max(a.mxl, this.mxl);
		a.mxu = Math.max(a.mxu, this.mxu);
		a.myl = Math.max(a.myl, this.myl);
		a.myu = Math.max(a.myu, this.myu);
		a.bboxAll.x1 = Math.min(a.bboxAll.x1, this.bboxAll.x1);
		a.bboxAll.y1 = Math.min(a.bboxAll.y1, this.bboxAll.y1);
		a.bboxAll.x2 = Math.max(a.bboxAll.x2, this.bboxAll.x2);
		a.bboxAll.y2 = Math.max(a.bboxAll.y2, this.bboxAll.y2)
	},
	_sink: function(a, b, c, e, d) {
		b = b.getAdjacentNodes();
		var f, g, h;
		for (f = 0; f < b.length; f++) this.visited[b[f].getID()] || (this.visited[b[f].getID()] = b[f], (h = 1 == c.length && 0 == c[0].length ? !1 : c && 0 < c.length ? this._lookup(b[f], c) : !0) || (h = e && 0 < e.length ? this._lookup(b[f], e) : !1), h || (h = b[f].getBBox(), (g = d[b[f].getID()]) && h.setCenter(g.x, g.y), g = h.getCenter(), this.bboxAll.union(h), this.nodes.push({
			n: b[f],
			ox: g.x - a.x,
			oy: g.y - a.y
		}), this._sink(a, b[f], [""], e, d)))
	},
	_lookup: function(a, b) {
		var c = a.getTags(),
		e,
		d = !1;
		for (e = 0; e < c.length && !d; e++) ARAC.core.arrayFind(b, c[e]) && (d = !0);
		return d
	}
};
ARAC.layout.model.DEdge = function(a, b, c) {
	ARAC.layout.model.DEdge._superInit.call(this);
	this.dummy = !0;
	this.id = c;
	this.source = a;
	this.target = b;
	this.source.addOutboundEdge(this);
	this.target.addInboundEdge(this)
};
ARAC.inherit(ARAC.layout.model.DEdge, ARAC.layout.EdgeAdapter, {
	getID: function() {
		return this.id
	},
	getTags: function() {
		return []
	},
	getSource: function() {
		return this.source
	},
	setSource: function(a) {
		this.source = a
	},
	getSourcePort: function() {
		return this.sourcePort
	},
	setSourcePort: function(a) {
		this.sourcePort = a
	},
	getTarget: function() {
		return this.target
	},
	setTarget: function(a) {
		this.target = a
	},
	getTargetPort: function() {
		return this.targetPort
	},
	setTargetPort: function(a) {
		this.targetPort = a
	},
	update: function() {},
	getCoordinates: function() {},
	setCoordinates: function(a, b) {},
	setCoordinatesArr: function(a) {}
});
ARAC.layout.model.DNode = function(a, b, c) {
	ARAC.layout.model.DNode._superInit.call(this);
	this.dummy = !0;
	this.id = c;
	this.edgesIn = [];
	this.edgesOut = [];
	this.setCenterXY(a, b)
};
ARAC.inherit(ARAC.layout.model.DNode, ARAC.layout.NodeAdapter, {
	getID: function() {
		return this.id
	},
	getTags: function() {
		return []
	},
	addInboundEdge: function(a) {
		this.edgesIn.push(a)
	},
	removeInboundEdge: function(a) {
		ARAC.core.arrayRemove(this.edgesIn, a)
	},
	addOutboundEdge: function(a) {
		this.edgesOut.push(a)
	},
	removeOutboundEdge: function(a) {
		ARAC.core.arrayRemove(this.edgesOut, a)
	},
	getIndegree: function() {
		return this.edgesIn.length
	},
	getOutdegree: function() {
		return this.edgesOut.length
	},
	getInboundEdges: function() {
		return this.edgesIn
	},
	getOutboundEdges: function() {
		return this.edgesOut
	},
	isInboundNode: function(a) {
		for (var b = 0; b < this.edgesIn.length; b++) if (this.edgesIn[b].getSource() == a) return ! 0;
		return ! 1
	},
	isOutboundNode: function(a) {
		for (var b = 0; b < this.edgesOut.length; b++) if (this.edgesOut[b].getTarget() == a) return ! 0;
		return ! 1
	},
	getInboundNodes: function() {
		for (var a = [], b = 0; b < this.edgesIn.length; b++) a.push(this.edgesIn[b].getSource());
		return a
	},
	getOutboundNodes: function() {
		for (var a = [], b = 0; b < this.edgesOut.length; b++) a.push(this.edgesOut[b].getTarget());
		return a
	},
	getCenter: function() {
		return new ARAC.Coord(this.location.x, this.location.y)
	},
	setCenter: function(a) {
		this.setCenterXY(a.x, a.y)
	},
	setCenterXY: function(a, b) {
		this.location = new ARAC.Coord(a, b)
	},
	getBBox: function() {
		return new ARAC.BBox(this.location.x, this.location.y, this.location.x, this.location.y)
	},
	setBBox: function(a) {
		this.setCenter(a.getCenter())
	}
});
ARAC.layout.model.EdgeLayout = function(a, b) {
	this.config = b;
	this.lgraph = null != a ? new ARAC.layout.model.LGraph(a) : null
};
ARAC.layout.model.EdgeLayout.prototype.apply = function(a, b, c, e) {
	throw new ARAC.Error("EdgeLayout.apply() not implemented");
};
ARAC.layout.model.LEdge = function(a) {
	ARAC.layout.model.LEdge._superInit.call(this);
	this.edge = a
};
ARAC.inherit(ARAC.layout.model.LEdge, ARAC.layout.EdgeAdapter, {
	getID: function() {
		return this.edge.getID()
	},
	getTags: function() {
		return this.edge.getTags()
	},
	getType: function() {
		return this.edge.getType()
	},
	setType: function(a, b) {
		return this.edge.setType(a, b)
	},
	getSource: function() {
		return this.source
	},
	setSource: function(a) {
		this.source = a
	},
	getSourcePort: function() {
		return this.edge.getSourcePort()
	},
	setSourcePort: function(a) {
		this.edge.setSourcePort(a)
	},
	getTarget: function() {
		return this.target
	},
	setTarget: function(a) {
		this.target = a
	},
	getTargetPort: function() {
		return this.edge.getTargetPort()
	},
	setTargetPort: function(a) {
		this.edge.setTargetPort(a)
	},
	getCoordinates: function() {
		return this.edge.getCoordinates()
	},
	setCoordinates: function(a, b) {
		this.edge.setCoordinates(a, b)
	},
	setCoordinatesArr: function(a) {
		this.edge.setCoordinatesArr(a)
	},
	update: function() {
		this.edge.update()
	},
	captureLNode: function(a) {
		this.source = a.mapNode(this.edge.getSource());
		this.target = a.mapNode(this.edge.getTarget())
	}
});
ARAC.layout.model.EdgeDirection = {
	X: 0,
	Y: 1,
	XY: 2
};
ARAC.layout.model.EdgeInfo = function(a, b, c, e, d, f) {
	this.direction = a;
	this.type = b;
	this.typeDesc = c;
	this.coords = e;
	this.edgeMapping = d;
	this.idxAlter = void 0 != f ? f: -1
};
ARAC.layout.model.EdgeInfo.prototype = {
	findConfig: function() {
		return 0 <= this.idxAlter && this.edgeMapping && this.edgeMapping.alternatives && this.edgeMapping.alternatives.length > this.idxAlter ? this.edgeMapping.alternatives[this.idxAlter] : this.edgeMapping ? this.edgeMapping.config: void 0
	}
};
ARAC.layout.model.LGraph = function(a) {
	ARAC.layout.model.LGraph._superInit.call(this);
	this.graph = a;
	a = this.graph.getNodes();
	var b = this.graph.getEdges();
	this.nodes = Array(a.length);
	this.nodeMap = [];
	this.edges = Array(b.length);
	this.edgeMap = [];
	for (var c = 0; c < a.length; c++) this.nodes[c] = new ARAC.layout.model.LNode(a[c]),
	this.nodeMap[a[c].getID()] = this.nodes[c];
	for (c = 0; c < b.length; c++) this.edges[c] = new ARAC.layout.model.LEdge(b[c]),
	this.edgeMap[b[c].getID()] = this.edges[c],
	this.edges[c].captureLNode(this);
	for (c = 0; c < this.nodes.length; c++) this.nodes[c].captureLEdge(this)
};
ARAC.inherit(ARAC.layout.model.LGraph, ARAC.layout.GraphAdapter, {
	getNodes: function() {
		return this.nodes
	},
	addNode: function(a) {
		this.nodes.push(a)
	},
	removeNode: function(a) {
		ARAC.core.arrayRemove(this.nodes, a)
	},
	getEdges: function() {
		return this.edges
	},
	addEdge: function(a) {
		this.edges.push(a)
	},
	removeEdge: function(a) {
		ARAC.core.arrayRemove(this.edges, a)
	},
	mapNode: function(a) {
		return this.nodeMap[a.getID()]
	},
	mapEdge: function(a) {
		return this.edgeMap[a.getID()]
	}
});
ARAC.layout.model.LNode = function(a) {
	ARAC.layout.model.LNode._superInit.call(this);
	this.node = a
};
ARAC.inherit(ARAC.layout.model.LNode, ARAC.layout.NodeAdapter, {
	getID: function() {
		return this.node.getID()
	},
	getTags: function() {
		return this.node.getTags()
	},
	getIndegree: function() {
		return this.edgesIn.length
	},
	addInboundEdge: function(a) {
		this.edgesIn.push(a)
	},
	removeInboundEdge: function(a) {
		ARAC.core.arrayRemove(this.edgesIn, a)
	},
	getInboundEdges: function() {
		return ARAC.core.arrayCopy(this.edgesIn)
	},
	isInboundNode: function(a) {
		for (var b = 0; b < this.edgesIn.length; b++) if (this.edgesIn[b].getSource() == a) return ! 0;
		return ! 1
	},
	getInboundNodes: function() {
		for (var a = [], b = 0; b < this.edgesIn.length; b++) a.push(this.edgesIn[b].getSource());
		return a
	},
	getOutdegree: function() {
		return this.edgesOut.length
	},
	addOutboundEdge: function(a) {
		this.edgesOut.push(a)
	},
	removeOutboundEdge: function(a) {
		ARAC.core.arrayRemove(this.edgesOut, a)
	},
	getOutboundEdges: function() {
		return ARAC.core.arrayCopy(this.edgesOut)
	},
	isOutboundNode: function(a) {
		for (var b = 0; b < this.edgesOut.length; b++) if (this.edgesOut[b].getTarget() == a) return ! 0;
		return ! 1
	},
	getOutboundNodes: function() {
		for (var a = [], b = 0; b < this.edgesOut.length; b++) a.push(this.edgesOut[b].getTarget());
		return a
	},
	getAdjacentEdges: function() {
		return this.getInboundEdges().concat(this.getOutboundEdges())
	},
	getAdjacentNodes: function() {
		return this.getInboundNodes().concat(this.getOutboundNodes())
	},
	getPortAt: function(a) {
		return this.node.getPortAt(a)
	},
	getCenter: function() {
		return this.node.getCenter()
	},
	setCenter: function(a) {
		this.node.setCenter(a)
	},
	setCenterXY: function(a, b) {
		this.node.setCenter(a, b)
	},
	getBBox: function() {
		return this.node.getBBox()
	},
	setBBox: function(a) {
		this.node.setBBox(a)
	},
	getAttribute: function(a) {
		return this.node.getAttribute(a)
	},
	captureLEdge: function(a) {
		this.edgesIn = [];
		for (var b = this.node.getInboundEdges(), c = 0; c < b.length; c++) this.edgesIn.push(a.mapEdge(b[c]));
		this.edgesOut = [];
		b = this.node.getOutboundEdges();
		for (c = 0; c < b.length; c++) this.edgesOut.push(a.mapEdge(b[c]))
	}
});
ARAC.layout.model.NodeLayout = function(a) {};
ARAC.layout.model.NodeLayout.prototype = {
	applicable: function(a, b) {
		return ! 0
	},
	apply: function(a, b, c, e) {
		throw new ARAC.Error("NodeLayout.apply() not implemented");
	},
	filterZeroDegree: function(a) {
		for (var b = [], c = 0; c < a.length; c++) 0 != a[c].getIndegree() + a[c].getOutdegree() && b.push(a[c]);
		return b
	},
	filterTags: function(a, b) {
		if (void 0 == b.tags || 0 == b.tags.length) return a;
		for (var c = [], e = 0; e < a.length; e++) this.approved(a[e], b) && c.push(a[e]);
		return c
	},
	approved: function(a, b) {
		var c = a.getTags();
		if (void 0 == c) return ! 1;
		for (var e = 0; e < c.length; e++) if (ARAC.core.arrayFind(b.tags, c[e])) return ! 0
	},
	applyLayoutOrigin: function(a, b, c) {
		if (! (0 >= a.length)) {
			var e = this.results.mapCenters,
			d = this.results.mapBBox,
			f = new ARAC.BBox,
			g = null != d ? d[a[0].getID()] : null,
			h = this.results.mapCenters[a[0].getID()];
			if (null != g && null != g.rotation && 0 != g.rotation) {
				var k = this.computeRotatedBBox(g);
				f.x1 = null != k ? k.x1: h.x;
				f.x2 = null != k ? k.x2: h.x;
				f.y1 = null != k ? k.y1: h.y;
				f.y2 = null != k ? k.y2: h.y
			} else k = a[0].getBBox(),
			f.x1 = null != g ? g.x1: h.x - k.getWidth() / 2,
			f.x2 = null != g ? g.x2: h.x + k.getWidth() / 2,
			f.y1 = null != g ? g.y1: h.y - k.getHeight() / 2,
			f.y2 = null != g ? g.y2: h.y + k.getHeight() / 2;
			for (var q = 1; q < a.length; q++) if (void 0 != c && !c || 0 != a[q].getIndegree() + a[q].getOutdegree()) g = null != d ? d[a[q].getID()] : null,
			null != g ? null != g.rotation && 0 != g.rotation ? f.union(this.computeRotatedBBox(g)) : f.union(g) : (k = a[q].getBBox(), h = e[a[q].getID()], f.minmax4(h.x - k.getWidth() / 2, h.y - k.getHeight() / 2, h.x + k.getWidth() / 2, h.y + k.getHeight() / 2));
			var p = k = 0;
			switch (b.layoutOriginProcessor) {
			case ARAC.layout.config.LayoutOriginProcessor.NONE:
				switch (b.layoutOriginAnchor) {
				case ARAC.layout.config.LayoutOriginAnchor.LEFT_TOP:
					k = b.layoutOrigin.x - f.x1;
					p = b.layoutOrigin.y - f.y1;
					break;
				case ARAC.layout.config.LayoutOriginAnchor.CENTER:
					h = f.getCenter(),
					k = b.layoutOrigin.x - h.x,
					p = b.layoutOrigin.y - h.y
				}
				if (0 != k || 0 != p) {
					for (q = 0; q < a.length; q++) if (void 0 != c && !c || 0 != a[q].getIndegree() + a[q].getOutdegree()) if ((g = null != d ? d[a[q].getID()] : null) && g.offset(k, p), h = e[a[q].getID()]) h.x += k,
					h.y += p,
					(f = this.results.mapAnnex ? this.results.mapAnnex[a[q].getID()] : void 0) && f.move(h, e, b.recordResults);
					if (this.results.edgeInfo) for (var r in this.results.edgeInfo) if (b = this.results.edgeInfo[r].coords) for (q = 0; q < b.length; q++) b[q].x += k,
					b[q].y += p
				}
				break;
			case ARAC.layout.config.LayoutOriginProcessor.NODES_LEFTTOP:
			case ARAC.layout.config.LayoutOriginProcessor.NODES_CENTER:
				k = b.layoutOrigin.x - f.x1;
				p = b.layoutOrigin.y - f.y1;
				if (0 != k || 0 != p) {
					for (q = 0; q < a.length; q++) if (void 0 != c && !c || 0 != a[q].getIndegree() + a[q].getOutdegree()) if ((g = null != d ? d[a[q].getID()] : null) && g.offset(k, p), h = e[a[q].getID()]) h.x += k,
					h.y += p,
					(f = this.results.mapAnnex ? this.results.mapAnnex[a[q].getID()] : void 0) && f.move(h, e, b.recordResults);
					if (this.results.edgeInfo) for (r in this.results.edgeInfo) if (b = this.results.edgeInfo[r].coords) for (q = 0; q < b.length; q++) b[q].x += k,
					b[q].y += p
				}
				break;
			case ARAC.layout.config.LayoutOriginProcessor.ROOT_LEFTTOP:
			case ARAC.layout.config.LayoutOriginProcessor.CNODE_LEFTTOP:
				for ((r = this.results.roots) || (r = [a[0]]), a = 0; a < r.length; a++) {
					if (b.layoutOriginNode && this.findCmp(this.results.cmpnodes[r[a].getID()], b.layoutOriginNode)) {
						if (d = b.layoutOriginNode.getBBox(), h = e[b.layoutOriginNode.getID()]) d.setCenter(h.x, h.y),
						(h = this.results.mapLayoutOrigin[b.layoutOriginNode.getID()]) ? (k = h.x1 - d.x1, p = h.y1 - d.y1) : (k = b.layoutOrigin.x - d.x1, p = b.layoutOrigin.y - d.y1)
					} else if (d = r[a].getBBox(), h = e[r[a].getID()]) d.setCenter(h.x, h.y),
					(h = this.results.mapLayoutOrigin[r[a].getID()]) ? (k = h.x1 - d.x1, p = h.y1 - d.y1) : (k = b.layoutOrigin.x - d.x1, p = b.layoutOrigin.y - d.y1);
					this.moveCmp(b, this.results.cmpnodes[r[a].getID()], this.results.cmpedges[r[a].getID()], k, p, c)
				}
			}
		}
	},
	findCmp: function(a, b) {
		for (var c = 0; c < a.length; c++) if (a[c].getID() == b.getID()) return ! 0;
		return ! 1
	},
	moveCmp: function(a, b, c, e, d, f) {
		if (0 != e || 0 != d) {
			for (var g = this.results.mapCenters,
			h = this.results.mapBBox,
			k, q = 0; q < b.length; q++) if (void 0 != f && !f || 0 != b[q].getIndegree() + b[q].getOutdegree()) if ((k = null != h ? h[b[q].getID()] : null) && k.offset(e, d), k = g[b[q].getID()]) {
				k.x += e;
				k.y += d;
				var p = this.results.mapAnnex ? this.results.mapAnnex[b[q].getID()] : void 0;
				p && p.move(k, g, a.recordResults)
			}
			if (this.results.edgeInfo) for (q = 0; q < c.length; q++) if (a = this.results.edgeInfo[c[q].getID()].coords) for (q = 0; q < a.length; q++) a[q].x += e,
			a[q].y += d
		}
	},
	computeRotatedBBox: function(a) {
		var b = [Math.cos(a.rotation), Math.sin(a.rotation), -Math.sin(a.rotation), Math.cos(a.rotation)];
		pRx = a.getCenterX();
		pRy = a.getCenterY();
		p1x = (a.x1 - pRx) * b[0] + (a.y1 - pRy) * b[1];
		p1y = (a.x1 - pRx) * b[2] + (a.y1 - pRy) * b[3];
		p2x = (a.x2 - pRx) * b[0] + (a.y1 - pRy) * b[1];
		p2y = (a.x2 - pRx) * b[2] + (a.y1 - pRy) * b[3];
		p3x = (a.x2 - pRx) * b[0] + (a.y2 - pRy) * b[1];
		p3y = (a.x2 - pRx) * b[2] + (a.y2 - pRy) * b[3];
		p4x = (a.x1 - pRx) * b[0] + (a.y2 - pRy) * b[1];
		p4y = (a.x1 - pRx) * b[2] + (a.y2 - pRy) * b[3];
		return new ARAC.BBox(Math.min(Math.min(p1x + pRx, p2x + pRx), Math.min(p3x + pRx, p4x + pRx)), Math.min(Math.min(p1y + pRy, p2y + pRy), Math.min(p3y + pRy, p4y + pRy)), Math.max(Math.max(p1x + pRx, p2x + pRx), Math.max(p3x + pRx, p4x + pRx)), Math.max(Math.max(p1y + pRy, p2y + pRy), Math.max(p3y + pRy, p4y + pRy)))
	},
	submitLayering: function(a) {
		if (this.results.resultLayering) for (var b = this.results.mapCenters,
		c = this.results.resultLayering.getLayeredNodes(), e = 0; e < c.length; e++) for (var d = 0; d < c[e].length; d++) {
			var f = b[c[e][d].getID()];
			switch (a.layoutOrientation) {
			case ARAC.layout.config.LayoutOrientation.TOP_TO_BOTTOM:
				f.x = (d + 1) * a.nodeDistance;
				f.y = (e + 1) * a.layerDistance;
				break;
			case ARAC.layout.config.LayoutOrientation.LEFT_TO_RIGHT:
				f.x = (e + 1) * a.layerDistance;
				f.y = -(d + 1) * a.nodeDistance;
				break;
			case ARAC.layout.config.LayoutOrientation.BOTTOM_TO_TOP:
				f.x = (d + 1) * a.nodeDistance;
				f.y = -(e + 1) * a.layerDistance;
				break;
			case ARAC.layout.config.LayoutOrientation.RIGHT_TO_LEFT:
				f.x = -(e + 1) * a.layerDistance,
				f.y = -(d + 1) * a.nodeDistance
			}
		}
	},
	submitOrdering: function(a) {
		if (this.results.resultOrdering && !this.results.resultBalancing) for (var b = this.results.mapCenters,
		c = this.results.resultOrdering.layersOrdered,
		e = 0; e < c.length; e++) if (null != c[e]) for (var d = 0; d < c[e].length; d++) {
			var f = b[c[e][d].getID()];
			switch (a.layoutOrientation) {
			case ARAC.layout.config.LayoutOrientation.TOP_TO_BOTTOM:
			case ARAC.layout.config.LayoutOrientation.BOTTOM_TO_TOP:
				f.x = (d + 1) * a.nodeDistance;
				break;
			case ARAC.layout.config.LayoutOrientation.LEFT_TO_RIGHT:
			case ARAC.layout.config.LayoutOrientation.RIGHT_TO_LEFT:
				f.y = -(d + 1) * a.nodeDistance
			}
		}
	},
	submitBalancing: function(a) {
		if (this.results.resultBalancing) for (var b = this.results.mapCenters,
		c = this.results.resultOrdering.layersOrdered,
		e = this.results.resultBalancing.layersBalanced,
		d = 0; d < e.length; d++) for (var f = 0; f < e[d].length; f++) {
			var g = b[c[d][f].getID()];
			switch (a.layoutOrientation) {
			case ARAC.layout.config.LayoutOrientation.TOP_TO_BOTTOM:
			case ARAC.layout.config.LayoutOrientation.BOTTOM_TO_TOP:
				g.x = e[d][f].coord * a.nodeDistance;
				break;
			case ARAC.layout.config.LayoutOrientation.LEFT_TO_RIGHT:
			case ARAC.layout.config.LayoutOrientation.RIGHT_TO_LEFT:
				g.y = -e[d][f].coord * a.nodeDistance
			}
		}
	},
	submitBalancing2: function() {
		if (this.results.resultBalancing) for (var a = this.results.mapCenters,
		b = this.results.resultOrdering.layersOrdered,
		c = this.results.resultBalancing.layersBalanced,
		e = 0; e < c.length; e++) for (var d = 0; d < c[e].length; d++) {
			var f = a[b[e][d].getID()];
			f.x = c[e][d].x;
			f.y = c[e][d].y
		}
	}
};
ARAC.layout.model.Results = function() {};
ARAC.layout.model.Results.prototype = {
	isReturnEdge: function(a) {
		return this.resultReturns && ARAC.core.arrayFind(this.resultReturns.returnEdges, a)
	}
};
ARAC.layout.tools = {};
ARAC.layout.tools.ACyclicGraph = function() {};
ARAC.layout.tools.ACyclicGraph.prototype = {
	apply: function(a) {
		var b = {};
		this.applyM2(a, b);
		return b
	},
	applyM2: function(a, b) {
		this.nodes = a;
		this.indexmap = ARAC.layout.tools.graphtools.nodeIndexMap(a);
		this.visited = Array(a.length);
		this.left = Array(a.length);
		for (var c = 0; c < this.visited.length; c++) this.visited[c] = !1;
		for (c = 0; c < this.left.length; c++) this.left[c] = !1;
		b.returnEdges = [];
		for (c = 0; c < a.length; c++) ! 1 == this.visited[c] && this.cycleLookup(c, b.returnEdges);
		for (c = 0; c < b.returnEdges.length; c++) {
			var e = b.returnEdges[c].getSource(),
			d = b.returnEdges[c].getTarget();
			b.returnEdges[c].setSource(d);
			d.removeInboundEdge(b.returnEdges[c]);
			d.addOutboundEdge(b.returnEdges[c]);
			b.returnEdges[c].setTarget(e);
			e.removeOutboundEdge(b.returnEdges[c]);
			e.addInboundEdge(b.returnEdges[c])
		}
		b.restore = function() {
			for (var a = 0; a < this.returnEdges.length; a++) {
				var b = this.returnEdges[a].getSource(),
				c = this.returnEdges[a].getTarget();
				this.returnEdges[a].setSource(c);
				c.removeInboundEdge(this.returnEdges[a]);
				c.addOutboundEdge(this.returnEdges[a]);
				this.returnEdges[a].setTarget(b);
				b.removeOutboundEdge(this.returnEdges[a]);
				b.addInboundEdge(this.returnEdges[a])
			}
		};
		delete this.nodes;
		delete this.indexmap;
		delete this.visited;
		delete this.left
	},
	cycleLookup: function(a, b) {
		this.visited[a] = !0;
		for (var c = this.nodes[a].getOutboundEdges(), e = 0; e < c.length; e++) {
			var d = this.indexmap[c[e].getTarget().getID()]; ! 1 == this.visited[d] ? this.cycleLookup(d, b) : !1 == this.left[d] && b.push(c[e])
		}
		this.left[a] = !0
	}
};
ARAC.layout.tools.BarycenterSequencer = function() {};
ARAC.layout.tools.BarycenterSequencer.prototype = {
	apply: function(a) {
		var b = {};
		this.result = b;
		this.result.layers = a.getLayeredNodes();
		a = this.result;
		a.layerMtx = Array(a.layers.length - 1);
		for (var c = 0; c < a.layers.length - 1; c++) {
			a.layerMtx[c] = new ARAC.layout.tools.LayerMatrix(a.layers[c].length, a.layers[c + 1].length);
			for (var e = 0; e < a.layerMtx[c].m; e++) {
				a.layerMtx[c].rowNodes[e] = 0 < c ? a.layerMtx[c - 1].colNodes[e] : a.layers[c][e];
				for (var d = 0; d < a.layerMtx[c].n; d++) a.layerMtx[c].colNodes[d] = a.layers[c + 1][d];
				if (0 < c) for (d = 0; d < a.layerMtx[c].n; d++) a.layerMtx[c].matrix[e][d] = a.layerMtx[c - 1].colNodes[e].isOutboundNode(a.layers[c + 1][d]) ? 1 : 0;
				else for (d = 0; d < a.layerMtx[c].n; d++) a.layerMtx[c].matrix[e][d] = a.layers[c][e].isOutboundNode(a.layers[c + 1][d]) ? 1 : 0
			}
			a.layerMtx[c].computeBarycenter();
			this.orderLayersCrossingReduction1(a.layerMtx, 0 != c, !1, c, !1, 0, c);
			this.orderLayersSubmitResults()
		}
		a.indexOf = function(a) {
			for (var b = 0; b < this.layersOrdered.length; b++) for (var c = 0; c < this.layersOrdered[b].length; c++) if (this.layersOrdered[b][c] == a) return {
				layer: b,
				idx: c
			};
			return {
				layer: -1,
				idx: -1
			}
		};
		a.longestPaths = function() {
			for (var a = Array(this.layerMtx[this.layerMtx.length - 1].n), b = 0; b < this.layerMtx[this.layerMtx.length - 1].n; b++) {
				a[b] = [];
				var c = {
					node: this.layerMtx[this.layerMtx.length - 1].colNodes[b],
					next: [],
					length: 1
				};
				a[b].push(c);
				this.longestPathSink(c, this.layerMtx.length - 1, b, 1)
			}
			c = 1;
			for (b = 0; b < a.length; b++) for (var d = 0; d < a[b].length; d++) c = Math.max(c, a[b][d].length);
			for (var e = [], b = 0; b < a.length; b++) for (d = 0; d < a[b].length; d++) if (a[b][d].length == c) {
				var p = [];
				e.push(p);
				this.pathSeek(a[b][d], p, c)
			}
			return e
		};
		a.longestPathSink = function(a, b, c, d) {
			if (! (0 > b)) for (var e = 0; e < this.layerMtx[b].m; e++) if (1 == this.layerMtx[b].matrix[e][c]) {
				var p = {
					node: this.layerMtx[b].rowNodes[e],
					next: [],
					length: this.layerMtx[b].rowNodes[e].dummy ? d: d + 1
				};
				a.next.push(p);
				this.longestPathSink(p, b - 1, e, p.node.dummy ? d: d + 1);
				a.length = Math.max(a.length, p.length)
			}
		};
		a.shortestPaths = function() {
			for (var a = Array(this.layerMtx[this.layerMtx.length - 1].n), b = 0; b < this.layerMtx[this.layerMtx.length - 1].n; b++) {
				a[b] = [];
				var c = {
					node: this.layerMtx[this.layerMtx.length - 1].colNodes[b],
					next: [],
					length: 1
				};
				a[b].push(c);
				this.shortestPathSink(c, this.layerMtx.length - 1, b, 1)
			}
			c = Number.MAX_VALUE;
			for (b = 0; b < a.length; b++) for (var d = 0; d < a[b].length; d++) c = Math.min(c, a[b][d].length);
			for (var e = [], b = 0; b < a.length; b++) for (d = 0; d < a[b].length; d++) if (a[b][d].length == c) {
				var p = [];
				e.push(p);
				this.pathSeek(a[b][d], p, c)
			}
			return e
		};
		a.shortestPathSink = function(a, b, c, d) {
			if (! (0 > b)) {
				for (var e = 0; e < this.layerMtx[b].m; e++) if (1 == this.layerMtx[b].matrix[e][c]) {
					var p = {
						node: this.layerMtx[b].rowNodes[e],
						next: [],
						length: this.layerMtx[b].rowNodes[e].dummy ? d: d + 1
					};
					a.next.push(p);
					this.shortestPathSink(p, b - 1, e, p.node.dummy ? d: d + 1)
				}
				if (0 < a.next.length) for (a.length = a.next[0].length, e = 1; e < a.next.length; e++) a.length = Math.min(a.length, a.next[e].length)
			}
		};
		a.pathSeek = function(a, b, c) {
			b.push(a.node);
			for (var d = a.next.length - 1; 0 <= d; d--) if (a.next[d].length == c) {
				this.pathSeek(a.next[d], b, c);
				break
			}
		};
		delete this.result;
		return b
	},
	orderLayersSubmitResults: function() {
		this.result.layersOrdered = Array(this.result.layers.length);
		for (var a = 0; a < this.result.layersOrdered.length; a++) if (null != this.result.layerMtx[a]) {
			if (0 == a) {
				this.result.layersOrdered[a] = [];
				for (var b = 0; b < this.result.layerMtx[a].m; b++) this.result.layersOrdered[a].push(this.result.layerMtx[a].rowNodes[b])
			}
			this.result.layersOrdered[a + 1] = [];
			for (b = 0; b < this.result.layerMtx[a].n; b++) this.result.layersOrdered[a + 1].push(this.result.layerMtx[a].colNodes[b])
		}
	},
	orderLayersSubmitSingleResult: function(a, b, c) {
		this.result.layersOrdered = Array(this.result.layers.length);
		if (null != this.result.layerMtx[a]) {
			if (b) for (this.result.layersOrdered[a] = [], b = 0; b < this.result.layerMtx[a].m; b++) this.result.layersOrdered[a].push(this.result.layerMtx[a].rowNodes[b]);
			if (c) for (this.result.layersOrdered[a + 1] = [], b = 0; b < this.result.layerMtx[a].n; b++) this.result.layersOrdered[a + 1].push(this.result.layerMtx[a].colNodes[b])
		}
	},
	orderLayersCheckMinCrossingsAndPermute: function(a, b, c, e, d) {
		var f = a[b].copy();
		this.orderLayersCrossingReduction2(f);
		if (f.computeCrossings() < a[b].computeCrossings()) if (a[b] = f, this.orderLayersSubmitSingleResult(b, !0, !0), !1 == c) for (b += 1; b <= d; b++) a[b].reorderRows(a[b - 1].colNodes),
		a[b].computeBarycenter(),
		this.orderLayersCrossingReduction1(a, !0, !1, b, c, e, d),
		this.orderLayersSubmitResults();
		else for (b -= 1; b >= e; b--) a[b].reorderCols(a[b + 1].rowNodes),
		a[b].computeBarycenter(),
		this.orderLayersCrossingReduction1(a, !1, !0, b, c, e, d),
		this.orderLayersSubmitResults()
	},
	orderLayersCrossingReduction1: function(a, b, c, e, d, f, g) {
		var h = 0,
		k = !0,
		q = -1;
		do {
			var p = this.orderLayersPHASE1(a[e], b, c);
			0 != p.crossings && a[e].rowPermsAv && a[e].colPermsAv ? (k = this.orderLayersPHASE2(a[e], b, c), q = k.crossings, 0 != k.crossings && a[e].rowPermsAv && a[e].colPermsAv ? p.crossings == k.crossings ? (this.orderLayersCheckMinCrossingsAndPermute(a, e, !d, f, g), k = !0) : k = !1 : k = !0) : (k = !0, q = p.crossings)
		} while (! k && 100 > h ++);
		return q
	},
	orderLayersCrossingReduction2: function(a) {
		var b = 0,
		c = !0,
		e = -1;
		do {
			var d = this.orderLayersPHASE1(a, !1, !1);
			0 != d.crossings && a.rowPermsAv && a.colPermsAv ? (c = this.orderLayersPHASE2(a, !1, !1), e = c.crossings, c = 0 != c.crossings && !1 != c.changed && a.rowPermsAv && a.colPermsAv ? d.crossings == c.crossings ? !0 : !1 : !0) : (c = !0, e = d.crossings)
		} while (! c && 100 > b ++);
		return e
	},
	orderLayersPHASE1: function(a, b, c) {
		var e = 0,
		d = {
			changed: !1
		};
		if (!1 == b || !1 == c) {
			var f = !0 == b ? !1 : a.BOR(),
			g = !0 == c ? "BOR": "BOC"; ! 1 == f && !1 == c && (f = a.BOC(), d.changed |= f, b ? f = !1 : g = "BOR");
			for (; f && 50 > e++;) {
				switch (g) {
				case "BOR":
					f = a.BOR();
					c ? f = !1 : g = "BOC";
					break;
				case "BOC":
					f = a.BOC(),
					b ? f = !1 : g = "BOR"
				}
				d.changed |= f
			}
		}
		d.crossings = a.computeCrossings();
		d.iterations = e;
		return d
	},
	orderLayersPHASE2: function(a, b, c) {
		b = !0 == b ? !1 : a.ROR(); ! 1 == b && !1 == c && (b = a.ROC());
		c = {};
		c.changed = b;
		c.crossings = a.computeCrossings();
		return c
	}
};
ARAC.layout.tools.edgetools = {
	removeNeedlessPts: function(a, b) {
		if (a) {
			var c = [];
			c.push(a[0]);
			for (var e = 1; e < a.length - 1; e++) Math.abs(a[e].x - a[e - 1].x) <= b && Math.abs(a[e].x - a[e + 1].x) <= b ? a[e + 1].x = a[e - 1].x: Math.abs(a[e].y - a[e - 1].y) <= b && Math.abs(a[e].y - a[e + 1].y) <= b ? a[e + 1].y = a[e - 1].y: c.push(a[e]);
			c.push(a[a.length - 1]);
			return c
		}
	},
	dBow: function(a, b, c, e, d, f) {
		if (a.x == b.x || a.y == b.y) return [new ARAC.Coord(a.x, a.y), new ARAC.Coord(b.x, b.y)];
		switch (f.elbow) {
		case ARAC.layout.config.ElbowType.SRC:
			return this.dBowSrcC(a, f.srcSlope, b, f.tgtSlope, d);
		case ARAC.layout.config.ElbowType.TGT:
			return this.dBowTgtC(a, f.srcSlope, b, f.tgtSlope, d)
		}
	},
	dBowSrcC: function(a, b, c, e, d) {
		var f = ARAC.layout.model.EdgeDirection;
		switch (d) {
		default:
		case f.XY:
			return this.xyBowSrcC(a, b, c, e);
		case f.X:
			return this.xBowSrcC(a, b, c, e);
		case f.Y:
			return this.yBowSrcC(a, b, c, e)
		}
	},
	xyBowSrcC: function(a, b, c, e) {
		return Math.abs(a.x - c.x) > Math.abs(a.y - c.y) ? this.xBowSrcC(a, b, c, e) : this.yBowSrcC(a, b, c, e)
	},
	xBowSrcC: function(a, b, c, e) {
		var d = [];
		d[0] = new ARAC.Coord(a.x, a.y);
		d[2] = new ARAC.Coord(c.x, c.y);
		d[1] = new ARAC.Coord(a.x, c.y);
		d[1].x = d[2].x <= d[0].x ? d[1].x - b: d[1].x + b;
		d[1].y = d[2].y <= d[0].y ? d[1].y - e: d[1].y + e;
		return d
	},
	yBowSrcC: function(a, b, c, e) {
		var d = [];
		d[0] = new ARAC.Coord(a.x, a.y);
		d[2] = new ARAC.Coord(c.x, c.y);
		d[1] = new ARAC.Coord(c.x, a.y);
		d[1].y = d[2].y <= d[0].y ? d[1].y - b: d[1].y + b;
		d[1].x = d[2].x <= d[0].x ? d[1].x + e: d[1].x - e;
		return d
	},
	dBowTgtC: function(a, b, c, e, d) {
		var f = ARAC.layout.model.EdgeDirection;
		switch (d) {
		default:
		case f.XY:
			return this.xyBowTgtC(a, b, c, e);
		case f.X:
			return this.xBowTgtC(a, b, c, e);
		case f.Y:
			return this.yBowTgtC(a, b, c, e)
		}
	},
	xyBowTgtC: function(a, b, c, e) {
		return Math.abs(a.x - c.x) > Math.abs(a.y - c.y) ? this.xBowTgtC(a, b, c, e) : this.yBowTgtC(a, b, c, e)
	},
	xBowTgtC: function(a, b, c, e) {
		var d = [];
		d[0] = new ARAC.Coord(a.x, a.y);
		d[2] = new ARAC.Coord(c.x, c.y);
		d[1] = new ARAC.Coord(c.x, a.y);
		d[1].y = d[2].y <= d[0].y ? d[1].y - b: d[1].y + b;
		d[1].x = d[2].x <= d[0].x ? d[1].x + e: d[1].x - e;
		return d
	},
	yBowTgtC: function(a, b, c, e) {
		var d = [];
		d[0] = new ARAC.Coord(a.x, a.y);
		d[2] = new ARAC.Coord(c.x, c.y);
		d[1] = new ARAC.Coord(a.x, c.y);
		d[1].x = d[2].x <= d[0].x ? d[1].x - b: d[1].x + b;
		d[1].y = d[2].y <= d[0].y ? d[1].y + e: d[1].y - e;
		return d
	},
	dBowSrcSlopedS: function(a, b, c) {
		var e = ARAC.layout.model.EdgeDirection;
		switch (c) {
		default:
		case e.XY:
			return this.xyBowSrcSlopedS(a, b);
		case e.X:
			return this.xBowSrcSlopedS(a, b);
		case e.Y:
			return this.yBowSrcSlopedS(a, b)
		}
	},
	xyBowSrcSlopedS: function(a, b) {
		var c = a.getCenter(),
		e = b.getCenter();
		return Math.abs(c.x - e.x) > Math.abs(c.y - e.y) ? this.xBowSrcSlopedS(a, b) : this.yBowSrcSlopedS(a, b)
	},
	xBowSrcSlopedS: function(a, b) {
		var c = [];
		c[0] = a.getCenter();
		c[2] = b.getCenter();
		c[1] = c[2].x <= c[0].x ? new ARAC.Coord(a.x1, c[2].y) : new ARAC.Coord(a.x2, c[2].y);
		return c
	},
	yBowSrcSlopedS: function(a, b) {
		var c = [];
		c[0] = a.getCenter();
		c[2] = b.getCenter();
		c[1] = c[2].y <= c[0].y ? new ARAC.Coord(c[2].x, a.y1) : new ARAC.Coord(c[2].x, a.y2);
		return c
	},
	dBowSrcSlopedT: function(a, b, c) {
		var e = ARAC.layout.model.EdgeDirection;
		switch (c) {
		default:
		case e.XY:
			return this.xyBowSrcSlopedT(a, b);
		case e.X:
			return this.xBowSrcSlopedT(a, b);
		case e.Y:
			return this.yBowSrcSlopedT(a, b)
		}
	},
	xyBowSrcSlopedT: function(a, b) {
		var c = a.getCenter(),
		e = b.getCenter();
		return Math.abs(c.x - e.x) > Math.abs(c.y - e.y) ? this.xBowSrcSlopedT(a, b) : this.yBowSrcSlopedT(a, b)
	},
	xBowSrcSlopedT: function(a, b) {
		var c = [];
		c[0] = a.getCenter();
		c[2] = b.getCenter();
		c[1] = c[2].y <= c[0].y ? new ARAC.Coord(c[0].x, b.y1) : new ARAC.Coord(c[0].x, b.y2);
		return c
	},
	yBowSrcSlopedT: function(a, b) {
		var c = [];
		c[0] = a.getCenter();
		c[2] = b.getCenter();
		c[1] = c[2].x <= c[0].x ? new ARAC.Coord(b.x2, c[0].y) : new ARAC.Coord(b.x1, c[0].y);
		return c
	},
	dBowTgtSlopedS: function(a, b, c) {
		var e = ARAC.layout.model.EdgeDirection;
		switch (c) {
		default:
		case e.XY:
			return this.xyBowTgtSlopedS(a, b);
		case e.X:
			return this.xBowTgtSlopedS(a, b);
		case e.Y:
			return this.yBowTgtSlopedS(a, b)
		}
	},
	xyBowTgtSlopedS: function(a, b) {
		var c = a.getCenter(),
		e = b.getCenter();
		return Math.abs(c.x - e.x) > Math.abs(c.y - e.y) ? this.xBowTgtSlopedS(a, b) : this.yBowTgtSlopedS(a, b)
	},
	xBowTgtSlopedS: function(a, b) {
		var c = [];
		c[0] = a.getCenter();
		c[2] = b.getCenter();
		c[1] = c[2].y <= c[0].y ? new ARAC.Coord(c[2].x, a.y2) : new ARAC.Coord(c[2].x, a.y1);
		return c
	},
	yBowTgtSlopedS: function(a, b) {
		var c = [];
		c[0] = a.getCenter();
		c[2] = b.getCenter();
		c[1] = c[2].x <= c[0].x ? new ARAC.Coord(a.x1, c[2].y) : new ARAC.Coord(a.x2, c[2].y);
		return c
	},
	dBowTgtSlopedT: function(a, b, c) {
		var e = ARAC.layout.model.EdgeDirection;
		switch (c) {
		default:
		case e.XY:
			return this.xyBowTgtSlopedT(a, b);
		case e.X:
			return this.xBowTgtSlopedT(a, b);
		case e.Y:
			return this.yBowTgtSlopedT(a, b)
		}
	},
	xyBowTgtSlopedT: function(a, b) {
		var c = a.getCenter(),
		e = b.getCenter();
		return Math.abs(c.x - e.x) > Math.abs(c.y - e.y) ? this.xBowTgtSlopedT(a, b) : this.yBowTgtSlopedT(a, b)
	},
	xBowTgtSlopedT: function(a, b) {
		var c = [];
		c[0] = a.getCenter();
		c[2] = b.getCenter();
		c[1] = c[2].x <= c[0].x ? new ARAC.Coord(b.x2, c[0].y) : new ARAC.Coord(b.x1, c[0].y);
		return c
	},
	yBowTgtSlopedT: function(a, b) {
		var c = [];
		c[0] = a.getCenter();
		c[2] = b.getCenter();
		c[1] = c[2].y <= c[0].y ? new ARAC.Coord(c[0].x, b.y2) : new ARAC.Coord(c[0].x, b.y1);
		return c
	},
	dOrthC: function(a, b, c, e) {
		var d = ARAC.layout.model.EdgeDirection;
		switch (c) {
		default:
		case d.XY:
			return this.xyOrthC(a, b, e);
		case d.X:
			return this.xOrthC(a, b, e);
		case d.Y:
			return this.yOrthC(a, b, e)
		}
	},
	xyOrthC: function(a, b, c) {
		return Math.abs(a.x - b.x) > Math.abs(a.y - b.y) ? this.xOrthC(a, b, c) : this.yOrthC(a, b, c)
	},
	xOrthC: function(a, b, c) {
		var e = [];
		e[0] = a;
		switch (c._clType) {
		case ARAC.layout.config.CrosslineType.SRCORG:
			e[1] = new ARAC.Coord(a.x + c._clValue, a.y);
			e[2] = new ARAC.Coord(a.x + c._clValue, b.y);
			break;
		case ARAC.layout.config.CrosslineType.TGTORG:
			e[1] = new ARAC.Coord(b.x - c._clValue, a.y);
			e[2] = new ARAC.Coord(b.x - c._clValue, b.y);
			break;
		case ARAC.layout.config.CrosslineType.FAKTOR:
			e[1] = new ARAC.Coord(a.x + (b.x - a.x) * c._clValue, a.y),
			e[2] = new ARAC.Coord(a.x + (b.x - a.x) * c._clValue, b.y)
		}
		e[3] = b;
		return e
	},
	yOrthC: function(a, b, c) {
		var e = [];
		e[0] = a;
		switch (c._clType) {
		case ARAC.layout.config.CrosslineType.SRCORG:
			e[1] = new ARAC.Coord(a.x, a.y + c._clValue);
			e[2] = new ARAC.Coord(b.x, a.y + c._clValue);
			break;
		case ARAC.layout.config.CrosslineType.TGTORG:
			e[1] = new ARAC.Coord(a.x, b.y - c._clValue);
			e[2] = new ARAC.Coord(b.x, b.y - c._clValue);
			break;
		case ARAC.layout.config.CrosslineType.FAKTOR:
			e[1] = new ARAC.Coord(a.x, a.y + (b.y - a.y) * c._clValue),
			e[2] = new ARAC.Coord(b.x, a.y + (b.y - a.y) * c._clValue)
		}
		e[3] = b;
		return e
	}
};
ARAC.layout.tools.graphgen = {};
ARAC.layout.tools.graphgen.FlowGenContext = function(a) {
	this.nodeCount = a && a.nodeCount || 10;
	this.nodePostProc = a && a.nodePostProc || [];
	this.endConCount = a && a.endConCount || 1E5
};
ARAC.layout.tools.graphgen.GridGenContext = function(a) {
	this.nodeCount = a && a.nodeCount || 10;
	this.nodePostProc = a && a.nodePostProc || []
};
ARAC.layout.tools.graphgen.TreeGenContext = function(a) {
	this.nodeCount = a && a.nodeCount || 10;
	this.nodePostProc = a && a.nodePostProc || [];
	this.levelMin = a && a.levelMin || 2;
	this.levelAdd = a && a.levelAdd || 3;
	this.leafMin = a && a.leafMin || 2;
	this.leafAdd = a && a.leafAdd || 2
};
ARAC.layout.tools.graphgen.TreeGenContext.prototype = {
	getLevels: function() {
		return this.levelMin + Math.round(Math.random() * this.levelAdd)
	},
	getLeafs: function() {
		return this.leafMin + Math.round(Math.random() * this.leafAdd)
	}
};
ARAC.layout.tools.graphgen.GEdge = function() {};
ARAC.layout.tools.graphgen.GEdge.prototype = {};
ARAC.layout.tools.graphgen.GNode = function() {};
ARAC.layout.tools.graphgen.GNode.prototype = {
	getSize: function() {
		throw new ARAC.Error("GNode.getSize() not implemented");
	},
	setSize: function(a) {
		throw new ARAC.Error("GNode.setSize() not implemented");
	}
};
ARAC.layout.tools.graphgen.NodePostProc = function() {};
ARAC.layout.tools.graphgen.NodePostProc.prototype = {
	modifyNode: function(a) {
		throw new ARAC.Error("NodePostProc.modifyNode() not implemented");
	}
};
ARAC.layout.tools.graphgen.proc = {};
ARAC.layout.tools.graphgen.proc.NodeSizeProc = function(a, b, c, e) {
	this.widthVariation = a;
	this.widthRandomShift = b;
	this.heightVariation = c;
	this.heightRandomShift = e
};
ARAC.inherit(ARAC.layout.tools.graphgen.proc.NodeSizeProc, ARAC.layout.tools.graphgen.NodePostProc, {
	modifyNode: function(a) {
		var b = a.getSize();
		0 < this.widthVariation && (b.x += Math.round((Math.random() - this.widthRandomShift) * this.widthVariation));
		0 < this.heightVariation && (b.y += Math.round((Math.random() - this.heightRandomShift) * this.heightVariation));
		a.setSize(b)
	}
});
ARAC.layout.tools.graphgen.Support = function() {};
ARAC.layout.tools.graphgen.Support.prototype = {
	createNode: function() {
		throw new ARAC.Error("Support.createNode() not implemented");
	},
	createEdge: function(a, b) {
		throw new ARAC.Error("Support.createEdge() not implemented");
	}
};
ARAC.namespace("ARAC.layout.tools");
ARAC.layout.tools.GraphGenerator = function() {};
ARAC.layout.tools.GraphGenerator.prototype = {
	genGrid: function(a, b) {
		for (var c = [], e = 0; e <= b.nodeCount; e++) c.push(a.createNode());
		this._nodePostProc(c, b)
	},
	genTree: function(a, b) {
		var c = [];
		for (c.push(a.createNode()); c.length < b.nodeCount;) this._genTreeSink(a, c, b.nodeCount, b.nodeCount, b, b.getLevels(), 1, c[0]);
		this._nodePostProc(c, b)
	},
	_genTreeSink: function(a, b, c, e, d, f, g, h) {
		if (! (g > f)) for (var k = d.getLeafs(), q = b.length, p = 0; p < k && !(b.length - q >= e || b.length >= c); p++) {
			b.push(a.createNode());
			a.createEdge(h, b[b.length - 1]);
			for (var r = Math.round(4 * Math.random()), m = 0; m < r && !(0 <= Math.random() - 0.5 && this._genTreeSink(a, b, c, Math.round(e / 10 * Math.random()), d, f, g + 1, b[b.length - 1]), b.length - q >= e || b.length >= c); m++);
			if (b.length - q >= e || b.length >= c) break;
			this._genTreeSink(a, b, c, Math.round(e / k), d, f, g + 1, b[b.length - 1]);
			if (b.length - q >= e || b.length >= c) break;
			r = Math.round(4 * Math.random());
			for (m = 0; m < r && !(0 <= Math.random() - 0.5 && this._genTreeSink(a, b, c, Math.round(e / 10 * Math.random()), d, f, g + 1, b[b.length - 1]), b.length - q >= e || b.length >= c); m++);
		}
	},
	genFlow: function(a, b) {
		var c = [];
		b.nodeCount = Math.max(2, b.nodeCount);
		var e = a.createNode(),
		d = a.createNode();
		c.push(e);
		c.push(d);
		this._genFlowSink(a, c, 0, 1, b.nodeCount - 2, b);
		this._nodePostProc(c, b)
	},
	_genFlowSink: function(a, b, c, e, d, f) {
		if (0 == d) a.createEdge(b[c], b[e]);
		else if (1 == d) b.push(a.createNode()),
		a.createEdge(b[c], b[b.length - 1]),
		a.createEdge(b[b.length - 1], b[e]);
		else {
			for (var g = 0; 4 < d;) {
				var h = Math.round(0.29 * d);
				0 < h && (d -= h + 2, b.push(a.createNode()), b.push(a.createNode()), a.createEdge(b[c], b[b.length - 2]), g < f.endConCount && (a.createEdge(b[b.length - 1], b[e]), g++), this._genFlowSink(a, b, b.length - 2, b.length - 1, h, f))
			}
			h = Math.max(Math.round(d / Math.round(35 * Math.random())), 3);
			for (g = 0; 0 < d;) {
				var k = Math.round(123 * Math.random()) % Math.min(d, h) + 1;
				d -= k;
				for (var q = 0; q < k; q++) b.push(a.createNode());
				a.createEdge(b[c], b[b.length - k]);
				g < f.endConCount && (a.createEdge(b[b.length - 1], b[e]), g++);
				for (q = 0; q < k - 1; q++) a.createEdge(b[b.length - k + q], b[b.length - k + q + 1])
			}
		}
	},
	_nodePostProc: function(a, b) {
		if (void 0 != b.nodePostProc && 0 < b.nodePostProc.length) for (var c = 0; c < a.length; c++) for (var e = 0; e < b.nodePostProc.length; e++) b.nodePostProc[e].modifyNode(a[c])
	}
};
ARAC.layout.tools.graphtools = {
	nodeIndexMap: function(a) {
		for (var b = {},
		c = 0; c < a.length; c++) b[a[c].getID()] = c;
		return b
	}
};
ARAC.layout.tools.LayerMatrix = function(a, b) {
	this.m = a;
	this.n = b;
	this.matrix = Array(a);
	for (var c = 0; c < a; c++) this.matrix[c] = Array(b);
	this.rowNodes = Array(a);
	this.colNodes = Array(b);
	this.crossings = -1;
	this.rowPermutation = new ARAC.layout.tools.Permutation(this.rowNodes);
	this.colPermutation = new ARAC.layout.tools.Permutation(this.colNodes);
	this.colPermsAv = this.rowPermsAv = !0
};
ARAC.layout.tools.LayerMatrix.prototype = {};
ARAC.layout.tools.LayerMatrix.prototype.copy = function() {
	for (var a = new ARAC.layout.tools.LayerMatrix(this.m, this.n), b = 0; b < this.m; b++) for (var c = 0; c < this.n; c++) a.matrix[b][c] = this.matrix[b][c];
	for (b = 0; b < this.m; b++) a.rowNodes[b] = this.rowNodes[b];
	for (b = 0; b < this.n; b++) a.colNodes[b] = this.colNodes[b];
	a.rowPermutation = this.rowPermutation;
	a.colPermutation = this.colPermutation;
	return a
};
ARAC.layout.tools.LayerMatrix.prototype.equals = function(a) {
	if (null == a.m || (null == a.n || this.m != a.m || this.n != a.n) || null == a.matrix) return ! 1;
	for (var b = 0; b < this.m; b++) for (var c = 0; c < this.n; c++) if (this.matrix[b][c] != a.matrix[b][c]) return ! 1;
	if (null == a.rowNodes || null == a.colNodes) return ! 1;
	for (b = 0; b < this.m; b++) if (this.rowNodes[b] != a.rowNodes[b]) return ! 1;
	for (b = 0; b < this.n; b++) if (this.colNodes[b] != a.colNodes[b]) return ! 1;
	return ! 0
};
ARAC.layout.tools.LayerMatrix.prototype.computeBarycenter = function() {
	this.rowBarycenter = Array(this.m);
	for (var a = 0; a < this.rowBarycenter.length; a++) {
		for (var b = 0,
		c = 0,
		e = 0; e < this.n; e++) b += e * this.matrix[a][e],
		c += this.matrix[a][e];
		this.rowBarycenter[a] = 0 != c ? b / c: 0
	}
	this.colBarycenter = Array(this.n);
	for (a = 0; a < this.colBarycenter.length; a++) {
		for (e = c = b = 0; e < this.m; e++) b += e * this.matrix[e][a],
		c += this.matrix[e][a];
		this.colBarycenter[a] = 0 != c ? b / c: 0
	}
};
ARAC.layout.tools.LayerMatrix.prototype.computeCrossings = function() {
	if (0 > this.crossings) for (var a = this.crossings = 0; a < this.m; a++) for (var b = a + 1; b < this.m; b++) for (var c = 0; c < this.n - 1; c++) for (var e = c + 1; e < this.n; e++) this.crossings += this.matrix[a][e] * this.matrix[b][c];
	return this.crossings
};
ARAC.layout.tools.LayerMatrix.prototype.reorderRows = function(a) {
	for (var b = !1,
	c = 0; c < this.m; c++) if (this.rowNodes[c] != a[c]) for (var e = c + 1; e < this.m; e++) if (this.rowNodes[e] == a[c]) {
		this.swapRows(c, e);
		b = !0;
		break
	}
	b && (this.rowPermutation.stored() ? this.rowPermsAv = !1 : (this.rowPermutation.store(), this.crossings = -1))
};
ARAC.layout.tools.LayerMatrix.prototype.reorderCols = function(a) {
	for (var b = 0; b < this.n; b++) if (this.colNodes[b] != a[b]) for (var c = b + 1; c < this.n; c++) if (this.colNodes[c] == a[b]) {
		this.swapCols(b, c);
		break
	}
};
ARAC.layout.tools.LayerMatrix.prototype.BOR = function() {
	this.rowBarycenter || this.computeBarycenter();
	for (var a = !1,
	b = 0; b < this.m; b++) for (var c = b + 1; c < this.m; c++) this.rowBarycenter[b] > this.rowBarycenter[c] && (this.swapRows(b, c), a = !0); ! 0 == a && (this.rowPermutation.stored() ? this.rowPermsAv = !1 : (this.rowPermutation.store(), this.computeBarycenter(), this.crossings = -1));
	return a
};
ARAC.layout.tools.LayerMatrix.prototype.BOC = function() {
	this.colBarycenter || this.computeBarycenter();
	for (var a = !1,
	b = 0; b < this.n; b++) for (var c = b + 1; c < this.n; c++) this.colBarycenter[b] > this.colBarycenter[c] && (this.swapCols(b, c), a = !0); ! 0 == a && (this.colPermutation.stored() ? this.colPermsAv = !1 : (this.colPermutation.store(), this.computeBarycenter(), this.crossings = -1));
	return a
};
ARAC.layout.tools.LayerMatrix.prototype.ROR = function() {
	this.rowBarycenter || this.computeBarycenter();
	for (var a = !1,
	b = 0; b < this.m; b++) for (var c = b + 1; c < this.m; c++) this.rowBarycenter[b] == this.rowBarycenter[c] && (this.swapRows(b, c), a = !0); ! 0 == a && (this.rowPermutation.stored() ? this.rowPermsAv = !1 : (this.rowPermutation.store(), this.computeBarycenter(), this.crossings = -1));
	return a
};
ARAC.layout.tools.LayerMatrix.prototype.ROC = function() {
	this.colBarycenter || this.computeBarycenter();
	for (var a = !1,
	b = 0; b < this.n; b++) for (var c = b + 1; c < this.n; c++) this.colBarycenter[b] == this.colBarycenter[c] && (this.swapCols(b, c), a = !0); ! 0 == a && (this.colPermutation.stored() ? this.colPermsAv = !1 : (this.colPermutation.store(), this.computeBarycenter(), this.crossings = -1));
	return a
};
ARAC.layout.tools.LayerMatrix.prototype.rowSequence = function(a) {
	for (var b = "",
	c = 0; c < this.rowNames.length; c++) b += this.rowNames[c],
	c < this.rowNames.length - 1 && (b += a);
	return b
};
ARAC.layout.tools.LayerMatrix.prototype.colSequence = function(a) {
	for (var b = "",
	c = 0; c < this.colNames.length; c++) b += this.colNames[c],
	c < this.colNames.length - 1 && (b += a);
	return b
};
ARAC.layout.tools.LayerMatrix.prototype.swapRows = function(a, b) {
	var c = this.matrix[a];
	this.matrix[a] = this.matrix[b];
	this.matrix[b] = c;
	c = this.rowNodes[a];
	this.rowNodes[a] = this.rowNodes[b];
	this.rowNodes[b] = c;
	this.rowBarycenter && (c = this.rowBarycenter[a], this.rowBarycenter[a] = this.rowBarycenter[b], this.rowBarycenter[b] = c)
};
ARAC.layout.tools.LayerMatrix.prototype.swapCols = function(a, b) {
	for (var c = 0; c < this.m; c++) {
		var e = this.matrix[c][a];
		this.matrix[c][a] = this.matrix[c][b];
		this.matrix[c][b] = e
	}
	c = this.colNodes[a];
	this.colNodes[a] = this.colNodes[b];
	this.colNodes[b] = c;
	this.colBarycenter && (c = this.colBarycenter[a], this.colBarycenter[a] = this.colBarycenter[b], this.colBarycenter[b] = c)
};
ARAC.layout.tools.LayerMatrixString = {
	ALL: 1,
	ROW: 2,
	COL: 3,
	ROWCOL: 4,
	SHORT: 5
};
ARAC.layout.tools.LayerMatrix.prototype.toString = function(a) {
	var b = ARAC.layout.tools.LayerMatrixString,
	c = "";
	switch (a || b.ROWCOL) {
	case b.ALL:
		c += "m:" + this.m + " n:" + this.n + "\n";
		c += "   \t\t";
		for (a = 0; a < this.colNodes.length; a++) c += this.colNodes[a].getID() + ": ";
		c += "\n";
		for (a = 0; a < this.matrix.length; a++) {
			c += "   " + this.rowNodes[a].getID() + ":";
			c = 4 >= (this.rowNodes[a].getID() + ":").length ? c + "\t\t": c + "\t";
			for (b = 0; b < this.matrix[a].length; b++) c += this.matrix[a][b] + " ";
			this.rowBarycenter && (c += "\t:" + Math.round(10 * this.rowBarycenter[a]) / 10);
			c += "\n"
		}
		if (this.colBarycenter) {
			c += "   \t\t";
			for (a = 0; a < this.colBarycenter.length; a++) c += Math.round(10 * this.colBarycenter[a]) / 10 + ": ";
			c += "\n"
		}
		c += "crossings:" + this.computeCrossings();
		break;
	case b.SHORT:
		c += "m:" + this.m + " n:" + this.n + " cr:" + this.computeCrossings();
		break;
	case b.ROW:
		c += "m:" + this.m + " n:" + this.n + " cr:" + this.computeCrossings() + " rows:(";
		for (a = 0; a < this.rowNodes.length; a++) c += this.rowNodes[a].getID() + ":";
		c += ")";
		break;
	case b.COL:
		c += "m:" + this.m + " n:" + this.n + " cr:" + this.computeCrossings() + " cols:(";
		for (a = 0; a < this.colNodes.length; a++) c += this.colNodes[a].getID() + ":";
		c += ")";
		break;
	case b.ROWCOL:
		c += "m:" + this.m + " n:" + this.n + " cr:" + this.computeCrossings() + " rows:(";
		for (a = 0; a < this.rowNodes.length; a++) c += this.rowNodes[a].getID() + ":";
		c += ") cols:(";
		for (a = 0; a < this.colNodes.length; a++) c += this.colNodes[a].getID() + ":";
		c += ")"
	}
	return c
};
ARAC.layout.tools.Permutation = function(a) {
	this.src = a;
	this.pcount = 0;
	this.permutations = {}
};
ARAC.layout.tools.Permutation.prototype = {
	toString: function() {
		var a = "",
		b;
		for (b in this.permutations) a += 0 < a.length ? ", ": "",
		a += b;
		return a
	},
	store: function() {
		for (var a = "",
		b = 0; b < this.src.length; b++) a += 0 < a.length ? ":": "",
		a += this.src[b].getID();
		this.permutations[a] = 1
	},
	stored: function() {
		for (var a = "",
		b = 0; b < this.src.length; b++) a += 0 < a.length ? ":": "",
		a += this.src[b].getID();
		return null != this.permutations[a]
	},
	current: function() {
		for (var a = "",
		b = 0; b < this.src.length; b++) a += 0 < a.length ? ":": "",
		a += this.src[b].getID();
		return a
	},
	next: function() {
		var a = Array(this.src.length);
		switch (a.length) {
		case 1:
			0 == this.pcount++&&(a[0] = this.src[0]);
			break;
		case 2:
			switch (this.pcount++) {
			case 0:
				a[0] = this.src[0];
				a[1] = this.src[1];
				break;
			case 1:
				a[0] = this.src[1],
				a[1] = this.src[0]
			}
			break;
		case 3:
			switch (this.pcount++) {
			case 0:
				a[0] = this.src[0];
				a[1] = this.src[1];
				a[2] = this.src[2];
				break;
			case 1:
				a[0] = this.src[0];
				a[1] = this.src[2];
				a[2] = this.src[1];
				break;
			case 2:
				a[0] = this.src[1];
				a[1] = this.src[0];
				a[2] = this.src[2];
				break;
			case 3:
				a[0] = this.src[1];
				a[1] = this.src[2];
				a[2] = this.src[0];
				break;
			case 4:
				a[0] = this.src[2];
				a[1] = this.src[0];
				a[2] = this.src[1];
				break;
			case 5:
				a[0] = this.src[2],
				a[1] = this.src[1],
				a[2] = this.src[0]
			}
		}
		return a
	}
};
ARAC.layout.tools.PostOrderWalker = function() {};
ARAC.layout.tools.PostOrderWalker.prototype = {
	go: function(a, b, c) {
		a = a.getNodes();
		this.indexmap = ARAC.layout.tools.graphtools.nodeIndexMap(a);
		this.visited = Array(a.length);
		for (a = 0; a < this.visited.length; a++) this.visited[a] = !1;
		this._sink(b, c)
	},
	_sink: function(a, b) {
		var c = this.indexmap[a.getID()];
		if (!this.visited[c]) {
			this.visited[c] = !0;
			for (var c = a.getOutboundNodes(), e = c.length - 1; 0 <= e; e--) this._sink(c[e], b);
			b.visitNode(a)
		}
	}
};
ARAC.layout.tools.PreOrderWalker = function() {};
ARAC.layout.tools.PreOrderWalker.prototype = {
	go: function(a, b, c) {
		a = a.getNodes();
		this.indexmap = ARAC.layout.tools.graphtools.nodeIndexMap(a);
		this.visited = Array(a.length);
		for (a = 0; a < this.visited.length; a++) this.visited[a] = !1;
		this._sink(b, c)
	},
	_sink: function(a, b) {
		var c = this.indexmap[a.getID()];
		if (!this.visited[c]) {
			this.visited[c] = !0;
			b.visitNode(a);
			for (var c = a.getOutboundNodes(), e = c.length - 1; 0 <= e; e--) this._sink(c[e], b)
		}
	}
};
ARAC.layout.tools.ProperGraph = function() {};
ARAC.layout.tools.ProperGraph.prototype = {
	apply: function(a, b) {
		var c = {},
		e = ARAC.layout.tools.graphtools.nodeIndexMap(b.nodes);
		this.lgraph = a;
		this.resultLayering = b;
		this.dEdgeCounter = this.dNodeCounter = 0;
		this.result = c;
		this.result.nodes = b.nodes;
		this.result.dPath = Array(b.nodes.length);
		for (var d = 0; d < b.nodes.length; d++) this.result.dPath[d] = [],
		this.makeProperGraphSink(e, d);
		this.result.find = function(a) {
			for (var b = {
				path: null
			},
			c = 0; c < this.dPath.length && null == b.path; c++) for (var d = 0; d < this.dPath[c].length && null == b.path; d++) ARAC.core.arrayFind(this.dPath[c][d].edges, a) && (b.source = this.nodes[c], b.path = this.dPath[c][d]);
			b.getCoordinates = function() {
				var a = [];
				a.push(this.source.getCenter());
				for (var b = 0; b < this.path.nodes.length; b++) a.push(this.path.nodes[b].getCenter());
				a.push(this.path.target.getCenter());
				return a
			};
			return b
		};
		this.result.toString = function() {
			for (var a = "",
			b = 0; b < this.dPath.length; b++) if (! (0 >= this.dPath[b].length)) for (var a = a + ("\nsrc:" + this.nodes[b].getID()), c = 0; c < this.dPath[b].length; c++) {
				for (var a = a + (" tgt:" + this.dPath[b][c].target.getID()), a = a + " (", d = 0; d < this.dPath[b][c].nodes.length; d++) a += this.dPath[b][c].nodes[d].getID() + " ";
				a += ")"
			}
			return "makeProperGraph result" + a
		};
		delete this.lgraph;
		delete this.resultLayering;
		delete this.dNodeCounter;
		delete this.dEdgeCounter;
		delete this.result;
		return c
	},
	makeProperGraphSink: function(a, b) {
		for (var c = this.resultLayering.nodes[b].getOutboundEdges(), e = 0; e < c.length; e++) {
			var d = c[e].getTarget(),
			f = this.resultLayering.lambda[a[d.getID()]] - this.resultLayering.lambda[b];
			if (1 < f) {
				var g = this.resultLayering.nodes[b],
				h = d;
				this.lgraph.removeEdge(c[e]);
				g.removeOutboundEdge(c[e]);
				h.removeInboundEdge(c[e]);
				for (var h = [], k = [], q = g, g = 1; g < f; g++) {
					var p = new ARAC.layout.model.DNode(0, 0, "dn" + this.dNodeCounter++),
					r = new ARAC.layout.model.DEdge(q, p, "de" + this.dEdgeCounter++),
					q = q.getCenter();
					q.y = 0;
					p.setCenter(q);
					h.push(p);
					this.resultLayering.nodes.push(p);
					this.resultLayering.lambda.push(this.resultLayering.lambda[b] + g);
					a[p.getID()] = this.resultLayering.nodes.length - 1;
					k.push(r);
					this.lgraph.addNode(p);
					this.lgraph.addEdge(r);
					q = p
				}
				r = new ARAC.layout.model.DEdge(q, d, "de" + this.dEdgeCounter++);
				k.push(r);
				this.lgraph.addEdge(r);
				f = {};
				f.edge = c[e];
				f.target = d;
				f.nodes = h;
				f.edges = k;
				this.result.dPath[b].push(f)
			}
		}
	}
};
ARAC.layout.tools.TopologicalSort = function() {};
ARAC.layout.tools.TopologicalSort.prototype = {
	apply: function(a, b) {
		this.nodes = a;
		this.context = b;
		this.indexmap = ARAC.layout.tools.graphtools.nodeIndexMap(this.nodes);
		this.visited = Array(this.nodes.length);
		this.left = Array(this.nodes.length);
		var c = {};
		c.nodes = this.nodes;
		c.tree = this.treeCheck();
		c.acyclic = !this.cycleCheck();
		if (c.acyclic) {
			this.order = Array(this.nodes.length);
			this.n = this.nodes.length;
			for (var e = 0; e < this.visited.length; e++) this.visited[e] = !1;
			for (e = 0; e < this.nodes.length; e++) ! 1 == this.visited[e] && this.topsort(e);
			c.order = this.order;
			c.getOrderedNodes = function() {
				for (var a = Array(this.nodes.length), b = 0; b < this.order.length; b++) a[this.order[b] - 1] = this.nodes[b];
				return a
			};
			c.toString = function() {
				var a = "";
				if (this.acyclic) for (var b = 0; b < this.order.length; b++) a += b + "(" + this.order[b] + ") ";
				return "toposort result\ntree:" + this.tree + "\nacyclic:" + this.acyclic + "\norder:" + a
			}
		}
		return c
	},
	topsort: function(a) {
		this.visited[a] = !0;
		for (var b = this.nodes[a].getOutboundNodes(), c = 0; c < b.length; c++) if (!this.context || this.context.nodeAllowed(b[c])) {
			var e = this.indexmap[b[c].getID()];
			e && !1 == this.visited[e] && this.topsort(e)
		}
		this.order[a] = this.n--
	},
	treeCheck: function() {
		for (var a = 0; a < this.visited.length; a++) this.visited[a] = !1;
		for (var b = !0,
		a = 0; a < this.nodes.length && b; a++) ! 1 == this.visited[a] && (b &= this.treeLookup(a));
		return b
	},
	treeLookup: function(a) {
		this.visited[a] = !0;
		a = this.nodes[a].getOutboundNodes();
		for (var b = !0,
		c = 0; c < a.length && b; c++) if (!this.context || this.context.nodeAllowed(a[c])) {
			var e = this.indexmap[a[c].getID()];
			e && (b = !1 == this.visited[e] ? b & this.treeLookup(e) : !1)
		}
		return b
	},
	cycleCheck: function() {
		for (var a = 0; a < this.visited.length; a++) this.visited[a] = !1;
		for (a = 0; a < this.left.length; a++) this.left[a] = !1;
		for (var b = !1,
		a = 0; a < this.nodes.length && !b; a++) ! 1 == this.visited[a] && (b |= this.cycleLookup(a));
		return b
	},
	cycleLookup: function(a) {
		this.visited[a] = !0;
		for (var b = this.nodes[a].getOutboundNodes(), c = !1, e = 0; e < b.length; e++) if (!this.context || this.context.nodeAllowed(b[e])) {
			var d = this.indexmap[b[e].getID()];
			d && (!1 == this.visited[d] ? c |= this.cycleLookup(d) : !1 == this.left[d] && (c = !0))
		}
		this.left[a] = !0;
		return c
	}
};
ARAC.layout.tools.TopoSortLayering = function() {};
ARAC.layout.tools.TopoSortLayering.prototype = {
	apply: function(a, b) {
		this.context = b;
		var c = {};
		c.nodes = a.getOrderedNodes();
		c.nodesIdx = ARAC.layout.tools.graphtools.nodeIndexMap(c.nodes);
		c.lambda = Array(c.nodes.length);
		for (var e = 0; e < c.lambda.length; e++) c.lambda[e] = 1;
		for (e = 0; e < c.nodes.length; e++) this._sink(c, c.nodesIdx, e, 1);
		for (var d = 1,
		e = 0; e < c.lambda.length; e++) d = Math.max(d, c.lambda[e]);
		c.height = d;
		c.getLayeredNodes = function() {
			for (var a = Array(this.height), b = 0; b < this.height; b++) {
				a[b] = [];
				for (var c = 0; c < this.lambda.length; c++) this.lambda[c] == b + 1 && a[b].push(this.nodes[c]);
				a[b].reverse()
			}
			return a
		};
		c.toString = function() {
			for (var a = "",
			b = this.getLayeredNodes(), c = 0; c < b.length; c++) {
				for (var a = a + ("\n" + c + " ("), d = 0; d < b[c].length; d++) a += b[c][d].getID() + " ";
				a += ")"
			}
			return "layeringTopoSort result\nlayer-count:" + this.height + "\nlayers:" + a
		};
		return c
	},
	_sink: function(a, b, c, e) {
		a.lambda[c] = Math.max(a.lambda[c], e);
		for (var d = a.nodes[c].getOutboundNodes(), f = 0; f < d.length; f++) ! b[d[f].getID()] || this.context && !this.context.nodeAllowed(d[f]) || b[a.nodes[c].getID()] > b[d[f].getID()] || this._sink(a, b, b[d[f].getID()], e + 1)
	}
};
ARAC.namespace("ARAC.layout.force");
ARAC.layout.force.ForceLayout = function() {
	ARAC.layout.force.ForceLayout._superInit.call(this)
};
ARAC.inherit(ARAC.layout.force.ForceLayout, ARAC.layout.model.NodeLayout, {
	apply: function(a, b, c, e) {
		e && e.startLayout();
		this.results = a;
		this.results.mapCenters = {};
		this.results.mapNeighbours = {};
		this.results.mapNeiNeighbours = {};
		a = this.filterTags(b.getNodes(), c);
		for (var d = 0; d < a.length; d++) {
			var f = [];
			ARAC.core.arrayAddAll(f, a[d].getInboundNodes());
			ARAC.core.arrayAddAll(f, a[d].getOutboundNodes());
			for (var g = [], h = 0; h < f.length; h++) ARAC.core.arrayAddAll(g, f[h].getInboundNodes()),
			ARAC.core.arrayAddAll(g, f[h].getOutboundNodes());
			this.results.mapNeighbours[a[d].getID()] = f;
			null == this.results.mapNeiNeighbours[a[d].getID()] ? this.results.mapNeiNeighbours[a[d].getID()] = g: ARAC.core.arrayAddAll(this.results.mapNeiNeighbours[a[d].getID()], g)
		}
		for (d = 0; d < a.length; d++) this.results.mapCenters[a[d].getID()] = a[d].getCenter();
		for (var f = 0.1 * c.rejection,
		g = 0.0010 * c.attraction,
		k = 0.0010 * c.gravitation,
		d = c.nodeDistance,
		q = 0,
		p = 0,
		r = 0.365 * d,
		m = ARAC.core,
		l = 0.365 * d,
		s = 0; s < c.iterations; s++) {
			for (d = 0; d < a.length; d++) {
				for (var n = this.results.mapCenters[a[d].getID()], h = 0; h < a.length; h++) if (d != h) {
					var t = this.results.mapCenters[a[h].getID()],
					u = t.x - n.x,
					t = t.y - n.y,
					v = Math.sqrt(u * u + t * t);
					if (0 != v) {
						var w = f / (v * v / (l * l));
						m.arrayFind(this.results.mapNeighbours[a[d].getID()], a[h]) ? w -= g * v * v / (l * l) : m.arrayFind(this.results.mapNeiNeighbours[a[d].getID()], a[h]) && (w *= 2);
						Math.abs(w) < k || (q -= u * w, p -= t * w)
					}
				}
				n.x += Math.min(Math.max(q, -r), r);
				n.y += Math.min(Math.max(p, -r), r);
				q = p = 0
			}
			c.submitIntermediateResults && this.submitResults(a, c)
		}
		this.results.edgeInfo = {};
		b = b.getEdges();
		for (d = 0; d < b.length; d++) ARAC.core.arrayFind(a, b[d].getSource()) && ARAC.core.arrayFind(a, b[d].getTarget()) && (this.results.edgeInfo[b[d].getID()] = new ARAC.layout.model.EdgeInfo(ARAC.layout.model.EdgeDirection.XY, c.edgeType, c.edgeTypeDesc, void 0, c.edgeMapping()));
		this.submitResults(a, c);
		e && e.stopLayout()
	},
	submitResults: function(a, b) {
		var c = this.results.mapCenters;
		this.applyLayoutOrigin(a, b);
		for (var e = 0; e < a.length; e++) a[e].setCenter(c[a[e].getID()])
	},
	lookup: function(a, b, c) {
		return a && a[b.getID()] ? ARAC.core.arrayFind(a[b.getID()], c) : !1
	}
});
ARAC.layout.force.ForceLayoutConfig = function(a) {
	ARAC.layout.force.ForceLayoutConfig._superInit.call(this, "force", a);
	this.attraction = a && a.attraction || 9;
	this.rejection = a && a.rejection || 4;
	this.gravitation = a && a.gravitation || 1;
	this.iterations = a && a.iterations || 30
};
ARAC.inherit(ARAC.layout.force.ForceLayoutConfig, ARAC.layout.config.NLConfigDistanceBased, {
	copy: function() {
		return new ARAC.layout.force.ForceLayoutConfig(this)
	},
	fromXML: function(a, b) {
		ARAC.layout.force.ForceLayoutConfig._super.fromXML.call(this, a, b);
		var c = a.getAttribute("attraction");
		c && (this.attraction = parseFloat(c));
		if (c = a.getAttribute("rejection")) this.rejection = parseFloat(c);
		if (c = a.getAttribute("gravitation")) this.gravitation = parseFloat(c);
		if (c = a.getAttribute("iterations")) this.iterations = parseInt(c)
	},
	toXML: function(a) {
		a.writeStartElement("force");
		ARAC.layout.force.ForceLayoutConfig._super.toXML.call(this, a);
		a.writeAttributeNumber("attraction", this.attraction);
		a.writeAttributeNumber("rejection", this.rejection);
		a.writeAttributeNumber("gravitation", this.gravitation);
		a.writeAttributeNumber("iterations", this.iterations);
		a.writeEndElement("force")
	},
	generateName: function() {
		return "Force_a-" + this.attraction + "_r-" + this.rejection
	}
});
ARAC.namespace("ARAC.layout.grid");
ARAC.layout.grid.GridLayout = function() {
	ARAC.layout.grid.GridLayout._superInit.call(this)
};
ARAC.inherit(ARAC.layout.grid.GridLayout, ARAC.layout.model.NodeLayout, {
	apply: function(a, b, c, e) {
		e && e.startLayout();
		this.results = a;
		this.results.mapCenters = {};
		this.results.mapBBox = {};
		b = this.filterTags(b.getNodes(), c);
		var d = ARAC.layout.config.GridType;
		switch (c.gridType) {
		case d.GRID_FLOW_DISTANCE:
			0 < c.cellExtend ? this.gridFlowDistanceExtend(a, b, c, e) : this.gridFlowDistance(a, b, c, e);
			break;
		case d.GRID_FLOW_RASTER:
			0 < c.cellExtend ? this.gridFlowRasterExtend(a, b, c, e) : this.gridFlowRaster(a, b, c, e);
			break;
		case d.GRID_FLOW_GRIDBACK:
			0 < c.cellExtend ? this.gridFlowGridBackExtend(a, b, c, e) : this.gridFlowGridBack(a, b, c, e);
			break;
		case d.GRID_RASTER:
			this.gridRaster(a, b, c, e)
		}
		this.submitResults(b, c);
		e && e.stopLayout()
	},
	submitResults: function(a, b) {
		var c = this.results.mapCenters,
		e = this.results.mapBBox;
		this.applyLayoutOrigin(a, b, !1);
		for (var d = 0; d < a.length; d++) {
			var f = null != e ? e[a[d].getID()] : null;
			null != f ? a[d].setBBox(f) : a[d].setCenter(c[a[d].getID()])
		}
	},
	gridFlowDistance: function(a, b, c, e) {
		var d = ARAC.layout.config.FlowDirection,
		f = e = a = 0;
		switch (c.flowDirection) {
		case d.ROW_FLOW:
			for (var g = d = 0; d < b.length; d++) {
				var h = b[d].getBBox();
				this.results.mapCenters[b[d].getID()] = new ARAC.Coord(c.xAscending ? a + h.getWidth() / 2 : a - h.getWidth() / 2, c.yAscending ? e + h.getHeight() / 2 : e - h.getHeight() / 2);
				a = c.xAscending ? a + (h.getWidth() + c.colGap) : a - (h.getWidth() + c.colGap);
				f = Math.max(f, h.getHeight());
				g++;
				g == c.cellCount && (a = g = 0, e = c.yAscending ? e + (f + c.rowGap) : e - (f + c.rowGap))
			}
			break;
		case d.COL_FLOW:
			for (g = d = 0; d < b.length; d++) h = b[d].getBBox(),
			this.results.mapCenters[b[d].getID()] = new ARAC.Coord(c.xAscending ? a + h.getWidth() / 2 : a - h.getWidth() / 2, c.yAscending ? e + h.getHeight() / 2 : e - h.getHeight() / 2),
			e = c.yAscending ? e + (h.getHeight() + c.rowGap) : e - (h.getHeight() + c.rowGap),
			f = Math.max(f, h.getWidth()),
			g++,
			g == c.cellCount && (g = 0, a = c.xAscending ? a + (f + c.colGap) : a - (f + c.colGap), e = 0)
		}
	},
	gridFlowDistanceExtend: function(a, b, c, e) {
		var d = ARAC.layout.config.FlowDirection,
		f = e = a = 0;
		switch (c.flowDirection) {
		case d.ROW_FLOW:
			for (d = 0; d < b.length; d++) {
				var g = b[d].getBBox();
				Math.abs(a) + g.getWidth() > c.cellExtend && !(g.getWidth() > c.cellExtend) && (a = 0, e = c.yAscending ? e + (f + c.rowGap) : e - (f + c.rowGap));
				this.results.mapCenters[b[d].getID()] = new ARAC.Coord(c.xAscending ? a + g.getWidth() / 2 : a - g.getWidth() / 2, c.yAscending ? e + g.getHeight() / 2 : e - g.getHeight() / 2);
				a = c.xAscending ? a + (g.getWidth() + c.colGap) : a - (g.getWidth() + c.colGap);
				f = Math.max(f, g.getHeight())
			}
			break;
		case d.COL_FLOW:
			for (d = 0; d < b.length; d++) g = b[d].getBBox(),
			Math.abs(e) + g.getHeight() > c.cellExtend && !(g.getHeight() > c.cellExtend) && (a = c.xAscending ? a + (f + c.colGap) : a - (f + c.colGap), e = 0),
			this.results.mapCenters[b[d].getID()] = new ARAC.Coord(c.xAscending ? a + g.getWidth() / 2 : a - g.getWidth() / 2, c.yAscending ? e + g.getHeight() / 2 : e - g.getHeight() / 2),
			e = c.yAscending ? e + (g.getHeight() + c.rowGap) : e - (g.getHeight() + c.rowGap),
			f = Math.max(f, g.getWidth())
		}
	},
	gridFlowRaster: function(a, b, c, e) {
		var d = ARAC.layout.config.FlowDirection;
		e = a = 0;
		switch (c.flowDirection) {
		case d.ROW_FLOW:
			for (var f = d = 0; d < b.length; d++) this.results.mapCenters[b[d].getID()] = new ARAC.Coord(c.xAscending ? a + c.cellWidth / 2 : a - c.cellWidth / 2, c.yAscending ? e + c.cellHeight / 2 : e - c.cellHeight / 2),
			a = c.xAscending ? a + (c.cellWidth + c.colGap) : a - (c.cellWidth + c.colGap),
			f++,
			f == c.cellCount && (a = f = 0, e = c.yAscending ? e + (c.cellHeight + c.rowGap) : e - (c.cellHeight + c.rowGap));
			break;
		case d.COL_FLOW:
			for (f = d = 0; d < b.length; d++) this.results.mapCenters[b[d].getID()] = new ARAC.Coord(c.xAscending ? a + c.cellWidth / 2 : a - c.cellWidth / 2, c.yAscending ? e + c.cellHeight / 2 : e - c.cellHeight / 2),
			e = c.yAscending ? e + (c.cellHeight + c.rowGap) : e - (c.cellHeight + c.rowGap),
			f++,
			f == c.cellCount && (f = 0, a = c.xAscending ? a + (c.cellWidth + c.colGap) : a - (c.cellWidth + c.colGap), e = 0)
		}
	},
	gridFlowRasterExtend: function(a, b, c, e) {
		var d = ARAC.layout.config.FlowDirection;
		e = a = 0;
		switch (c.flowDirection) {
		case d.ROW_FLOW:
			for (d = 0; d < b.length; d++) Math.abs(a) + c.cellWidth > c.cellExtend && !(c.cellWidth > c.cellExtend) && (a = 0, e = c.yAscending ? e + (c.cellHeight + c.rowGap) : e - (c.cellHeight + c.rowGap)),
			this.results.mapCenters[b[d].getID()] = new ARAC.Coord(c.xAscending ? a + c.cellWidth / 2 : a - c.cellWidth / 2, c.yAscending ? e + c.cellHeight / 2 : e - c.cellHeight / 2),
			a = c.xAscending ? a + (c.cellWidth + c.colGap) : a - (c.cellWidth + c.colGap);
			break;
		case d.COL_FLOW:
			for (d = 0; d < b.length; d++) Math.abs(e) + c.cellHeight > c.cellExtend && !(c.cellHeight > c.cellExtend) && (a = c.xAscending ? a + (c.cellWidth + c.colGap) : a - (c.cellWidth + c.colGap), e = 0),
			this.results.mapCenters[b[d].getID()] = new ARAC.Coord(c.xAscending ? a + c.cellWidth / 2 : a - c.cellWidth / 2, c.yAscending ? e + c.cellHeight / 2 : e - c.cellHeight / 2),
			e = c.yAscending ? e + (c.cellHeight + c.rowGap) : e - (c.cellHeight + c.rowGap)
		}
	},
	gridFlowGridBack: function(a, b, c, e) {
		var d = ARAC.layout.config.FlowDirection;
		a = ARAC.layout.config.NodeScaling;
		var f = e = 0,
		g = [],
		h = [],
		k = 0,
		q = 0,
		p = 0,
		r = Math.PI / 2;
		switch (c.flowDirection) {
		case d.ROW_FLOW:
			for (var m = d = 0,
			l = 0; d < b.length; d++) {
				var s = b[d].getBBox(),
				n = s.getWidth(),
				t = s.getHeight(),
				p = s.rotation ? Math.abs(s.rotation) : 0;
				switch (c.xNodeScaling) {
				case a.AREA_EXTEND:
					n = c.xArea
				}
				g[l] || (g[l] = 0);
				if (null == s.rotation || 0 == s.rotation) g[l] = Math.max(g[l], t);
				else if (1E-5 > Math.abs(p - r)) g[l] = Math.max(g[l], n);
				else {
					var u = p < r ? p: Math.PI - p,
					v = p < r ? r - p: r - Math.PI - p,
					v = n / Math.sin(v) - t * Math.sin(p) / Math.sin(v);
					g[l] = Math.max(g[l], v * Math.sin(u) + t * Math.cos(u))
				}
				h[m] || (h[m] = 0);
				null == s.rotation || 0 == s.rotation ? h[m] = Math.max(h[m], n) : (u = p < r ? p: Math.PI - p, v = p < r ? r - p: r - Math.PI - p, v = n / Math.sin(v) - t * Math.sin(p) / Math.sin(v), h[m] = Math.max(h[m], v * Math.cos(u) + t * Math.sin(u)));
				m++;
				m == c.cellCount && (m = 0, l++)
			}
			switch (c.yNodeScaling) {
			case a.PROPORTIONAL_AREA_EXTEND:
				if (null != c.yArea) for (d = 0; d < g.length; d++) k += g[d]
			}
			for (l = m = d = 0; d < b.length; d++) {
				s = b[d].getBBox();
				p = s.rotation ? Math.abs(s.rotation) : 0;
				switch (c.yNodeScaling) {
				case a.PROPORTIONAL_AREA_EXTEND:
					null != c.yArea && (0 == m && (g[l] = c.yArea * g[l] / k), s.setHeight(g[l]))
				}
				if (c.xNodeScaling != a.NONE || c.yNodeScaling != a.NONE) {
					n = new ARAC.BBox(s.x1, c.yAscending ? f + g[l] / 2 - s.getHeight() / 2 : f - g[l] / 2 - s.getHeight() / 2, s.x2, c.yAscending ? f + g[l] / 2 + s.getHeight() / 2 : f - g[l] / 2 + s.getHeight() / 2);
					switch (c.xNodeScaling) {
					case a.MAX_CELL_EXTEND:
						n.x1 = c.xAscending ? e: e - h[m];
						n.x2 = c.xAscending ? e + h[m] : e;
						break;
					case a.AREA_EXTEND:
						null == s.rotation || 0 == s.rotation ? (n.x1 = c.xAscending ? e: e - c.xArea, n.x2 = c.xAscending ? e + c.xArea: e) : 1E-5 > Math.abs(p - r) ? (n.x1 = c.xAscending ? e: e - c.xArea, n.x2 = c.xAscending ? e + c.xArea: e) : (u = p < r ? r - p: r - Math.PI - p, v = c.xArea / 2 / Math.sin(u) - s.getHeight() / 2 * Math.sin(p) / Math.sin(u), n.x1 = c.xAscending ? e + c.xArea / 2 - v: e - c.xArea, n.x2 = c.xAscending ? e + c.xArea / 2 + v: e)
					}
					switch (c.yNodeScaling) {
					case a.MAX_CELL_EXTEND:
						n.y1 = c.yAscending ? f: f - g[l],
						n.y2 = c.yAscending ? f + g[l] : f
					}
					s.rotation && (n.rotation = s.rotation);
					this.results.mapBBox[b[d].getID()] = n
				} else this.results.mapCenters[b[d].getID()] = new ARAC.Coord(c.xAscending ? e + h[m] / 2 : e - h[m] / 2, c.yAscending ? f + g[l] / 2 : f - g[l] / 2);
				e = c.xAscending ? e + (h[m] + c.colGap) : e - (h[m] + c.colGap);
				m++;
				m == c.cellCount && (e = m = 0, f = c.yAscending ? f + (g[l] + c.rowGap) : f - (g[l] + c.rowGap), l++)
			}
			break;
		case d.COL_FLOW:
			for (l = m = d = 0; d < b.length; d++) {
				s = b[d].getBBox();
				n = s.getWidth();
				t = s.getHeight();
				p = s.rotation ? Math.abs(s.rotation) : 0;
				switch (c.yNodeScaling) {
				case a.AREA_EXTEND:
					t = c.yArea
				}
				g[l] || (g[l] = 0);
				null == s.rotation || 0 == s.rotation ? g[l] = Math.max(g[l], t) : (u = p < r ? p: Math.PI - p, v = p < r ? r - p: r - Math.PI - p, v = t / Math.sin(v) - n * Math.sin(p) / Math.sin(v), g[l] = Math.max(g[l], v * Math.cos(u) + n * Math.sin(u)));
				h[m] || (h[m] = 0);
				null == s.rotation || 0 == s.rotation ? h[m] = Math.max(h[m], n) : 1E-5 > Math.abs(p - r) ? h[m] = Math.max(h[m], t) : (u = p < r ? p: Math.PI - p, v = p < r ? r - p: r - Math.PI - p, v = t / Math.sin(v) - n * Math.sin(p) / Math.sin(v), h[m] = Math.max(h[m], v * Math.sin(u) + n * Math.cos(u)));
				l++;
				l == c.cellCount && (l = 0, m++)
			}
			switch (c.xNodeScaling) {
			case a.PROPORTIONAL_AREA_EXTEND:
				if (null != c.xArea) for (d = 0; d < h.length; d++) q += h[d]
			}
			for (l = m = d = 0; d < b.length; d++) {
				s = b[d].getBBox();
				p = s.rotation ? Math.abs(s.rotation) : 0;
				switch (c.xNodeScaling) {
				case a.PROPORTIONAL_AREA_EXTEND:
					null != c.xArea && (0 == l && (h[m] = c.xArea * h[m] / q), s.setWidth(h[m]))
				}
				if (c.xNodeScaling != a.NONE || c.yNodeScaling != a.NONE) {
					n = new ARAC.BBox(c.xAscending ? e + h[m] / 2 - s.getWidth() / 2 : e - h[m] / 2 - s.getWidth() / 2, s.y1, c.xAscending ? e + h[m] / 2 + s.getWidth() / 2 : e - h[m] / 2 + s.getWidth() / 2, s.y2);
					switch (c.xNodeScaling) {
					case a.MAX_CELL_EXTEND:
						n.x1 = c.xAscending ? e: e - h[m],
						n.x2 = c.xAscending ? e + h[m] : e
					}
					switch (c.yNodeScaling) {
					case a.MAX_CELL_EXTEND:
						n.y1 = c.yAscending ? f: f - g[l];
						n.y2 = c.yAscending ? f + g[l] : f;
						break;
					case a.AREA_EXTEND:
						null == s.rotation || 0 == s.rotation ? (n.y1 = c.yAscending ? f: f - c.yArea, n.y2 = c.yAscending ? f + c.yArea: f) : 1E-5 > Math.abs(p - r) ? (n.y1 = c.yAscending ? f: f - c.yArea, n.y2 = c.yAscending ? f + c.yArea: f) : (u = p < r ? r - p: r - Math.PI - p, v = c.yArea / 2 / Math.sin(u) - s.getWidth() / 2 * Math.sin(p) / Math.sin(u), n.y1 = c.yAscending ? f + c.yArea / 2 - v: f - c.yArea, n.y2 = c.yAscending ? f + c.yArea / 2 + v: f)
					}
					s.rotation && (n.rotation = s.rotation);
					this.results.mapBBox[b[d].getID()] = n
				} else this.results.mapCenters[b[d].getID()] = new ARAC.Coord(c.xAscending ? e + h[m] / 2 : e - h[m] / 2, c.yAscending ? f + g[l] / 2 : f - g[l] / 2);
				f = c.yAscending ? f + (g[l] + c.rowGap) : f - (g[l] + c.rowGap);
				l++;
				l == c.cellCount && (f = l = 0, e = c.xAscending ? e + (h[m] + c.colGap) : e - (h[m] + c.colGap), m++)
			}
		}
	},
	gridFlowGridBackExtend: function(a, b, c, e) {
		var d = ARAC.layout.config.FlowDirection;
		e = a = 0;
		var f = [],
		g = [];
		switch (c.flowDirection) {
		case d.ROW_FLOW:
			for (var h = d = 0,
			k = 0; d < b.length; d++) {
				var q = b[d].getBBox();
				Math.abs(a) + q.getWidth() > c.cellExtend && (h = a = 0, k++);
				f[k] || (f[k] = 0);
				f[k] = Math.max(f[k], q.getHeight());
				g[h] || (g[h] = 0);
				g[h] = Math.max(g[h], q.getWidth());
				a = c.xAscending ? a + (g[h] + c.colGap) : a - (g[h] + c.colGap);
				h++
			}
			for (k = h = d = a = 0; d < b.length; d++) this.results.mapCenters[b[d].getID()] = new ARAC.Coord(c.xAscending ? a + g[h] / 2 : a - g[h] / 2, c.yAscending ? e + f[k] / 2 : e - f[k] / 2),
			a = c.xAscending ? a + (g[h] + c.colGap) : a - (g[h] + c.colGap),
			h++,
			h == g.length && (a = h = 0, e = c.yAscending ? e + (f[k] + c.rowGap) : e - (f[k] + c.rowGap), k++);
			break;
		case d.COL_FLOW:
			for (k = h = d = 0; d < b.length; d++) q = b[d].getBBox(),
			Math.abs(e) + q.getHeight() > c.cellExtend && (k = e = 0, h++),
			f[k] || (f[k] = 0),
			f[k] = Math.max(f[k], q.getHeight()),
			g[h] || (g[h] = 0),
			g[h] = Math.max(g[h], q.getWidth()),
			e = c.yAscending ? e + (f[k] + c.rowGap) : e - (f[k] + c.rowGap),
			k++;
			for (k = h = d = e = 0; d < b.length; d++) this.results.mapCenters[b[d].getID()] = new ARAC.Coord(c.xAscending ? a + g[h] / 2 : a - g[h] / 2, c.yAscending ? e + f[k] / 2 : e - f[k] / 2),
			e = c.yAscending ? e + (f[k] + c.rowGap) : e - (f[k] + c.rowGap),
			k++,
			k == f.length && (e = 0, a = c.xAscending ? a + (g[h] + c.colGap) : a - (g[h] + c.colGap), k = 0, h++)
		}
	},
	gridBackExtend: function(a, b) {},
	gridRaster: function(a, b, c, e) {}
});
ARAC.layout.grid.GridLayoutConfig = function(a) {
	ARAC.layout.grid.GridLayoutConfig._superInit.call(this, "grid", a);
	this.gridType = a && (a.gridType || a.type) || ARAC.layout.config.GridType.GRID_FLOW_DISTANCE;
	this.flowDirection = a && (a.flowDirection || a.direction) || ARAC.layout.config.FlowDirection.ROW_FLOW;
	this.cellCount = a && a.cellCount || 10;
	this.cellExtend = a && a.cellExtend || -1;
	this.cellWidth = a && a.cellWidth || 30;
	this.cellHeight = a && a.cellHeight || 30;
	this.colGap = a && a.colGap || 0;
	this.rowGap = a && a.rowGap || 0;
	this.xAscending = a && null != a.xAscending ? a.xAscending: !0;
	this.yAscending = a && null != a.yAscending ? a.yAscending: !0;
	this.xNodeScaling = a && a.xNodeScaling || ARAC.layout.config.NodeScaling.NONE;
	this.yNodeScaling = a && a.yNodeScaling || ARAC.layout.config.NodeScaling.NONE;
	this.xArea = a && a.xArea || -1;
	this.yArea = a && a.yArea || -1
};
ARAC.inherit(ARAC.layout.grid.GridLayoutConfig, ARAC.layout.config.NLConfig, {
	copy: function() {
		return new ARAC.layout.grid.GridLayoutConfig(this)
	},
	fromXML: function(a, b) {
		ARAC.layout.grid.GridLayoutConfig._super.fromXML.call(this, a, b);
		var c = a.getAttribute("gridType");
		if (c) this.gridType = ARAC.layout.config.GridType.fromString(c);
		else if (c = a.getAttribute("type")) this.gridType = ARAC.layout.config.GridType.fromString(c);
		if (c = a.getAttribute("flowDirection")) this.flowDirection = ARAC.layout.config.FlowDirection.fromString(c);
		else if (c = a.getAttribute("direction")) this.flowDirection = ARAC.layout.config.FlowDirection.fromString(c);
		if (c = a.getAttribute("cellCount")) this.cellCount = parseInt(c);
		if (c = a.getAttribute("cellExtend")) this.cellExtend = parseFloat(c);
		if (c = a.getAttribute("cellWidth")) this.cellWidth = parseFloat(c);
		if (c = a.getAttribute("cellHeight")) this.cellHeight = parseFloat(c);
		if (c = a.getAttribute("colGap")) this.colGap = parseFloat(c);
		if (c = a.getAttribute("rowGap")) this.rowGap = parseFloat(c);
		if (c = a.getAttribute("xAscending")) this.xAscending = "true" == c ? !0 : !1;
		if (c = a.getAttribute("yAscending")) this.yAscending = "true" == c ? !0 : !1;
		if (c = a.getAttribute("xNodeScaling")) this.xNodeScaling = ARAC.layout.config.NodeScaling.fromString(c);
		if (c = a.getAttribute("yNodeScaling")) this.yNodeScaling = ARAC.layout.config.NodeScaling.fromString(c);
		if (c = a.getAttribute("xArea")) this.xArea = parseFloat(c);
		if (c = a.getAttribute("yArea")) this.yArea = parseFloat(c)
	},
	toXML: function(a) {
		a.writeStartElement("grid");
		ARAC.layout.grid.GridLayoutConfig._super.toXML.call(this, a);
		a.writeAttributeString("gridType", ARAC.layout.config.GridType.toString(this.gridType));
		a.writeAttributeString("flowDirection", ARAC.layout.config.FlowDirection.toString(this.flowDirection));
		a.writeAttributeNumber("cellCount", this.cellCount);
		a.writeAttributeNumber("cellExtend", this.cellExtend);
		a.writeAttributeNumber("cellWidth", this.cellWidth);
		a.writeAttributeNumber("cellHeight", this.cellHeight);
		a.writeAttributeNumber("colGap", this.colGap);
		a.writeAttributeNumber("rowGap", this.rowGap);
		a.writeAttributeString("xAscending", this.xAscending ? "true": "false");
		a.writeAttributeString("yAscending", this.yAscending ? "true": "false");
		a.writeAttributeString("xNodeScaling", ARAC.layout.config.NodeScaling.toString(this.xNodeScaling));
		a.writeAttributeString("yNodeScaling", ARAC.layout.config.NodeScaling.toString(this.yNodeScaling));
		a.writeAttributeNumber("xArea", this.xArea);
		a.writeAttributeNumber("yArea", this.yArea);
		a.writeEndElement("grid")
	},
	generateName: function() {
		var a = ARAC.layout.config.GridType,
		b = ARAC.layout.config.FlowDirection;
		switch (this.gridType) {
		case a.GRID_FLOW_DISTANCE:
			switch (this.flowDirection) {
			case b.ROW_FLOW:
				return this.xAscending && this.yAscending ? "GridDistance-RowPxPy": this.xAscending ? "GridDistance-RowPxNy": this.yAscending ? "GridDistance-RowNxPy": "GridDistance-RowNxNy";
			case b.COL_FLOW:
				return this.xAscending && this.yAscending ? "GridDistance-ColPxPy": this.xAscending ? "GridDistance-ColPxNy": this.yAscending ? "GridDistance-ColNxPy": "GridDistance-ColNxNy"
			}
			break;
		case a.GRID_FLOW_RASTER:
			switch (this.flowDirection) {
			case b.ROW_FLOW:
				return this.xAscending && this.yAscending ? "GridRaster-RowPxPy": this.xAscending ? "GridRaster-RowPxNy": this.yAscending ? "GridRaster-RowNxPy": "GridRaster-RowNxNy";
			case b.COL_FLOW:
				return this.xAscending && this.yAscending ? "GridRaster-ColPxPy": this.xAscending ? "GridRaster-ColPxNy": this.yAscending ? "GridRaster-ColNxPy": "GridRaster-ColNxNy"
			}
			break;
		case a.GRID_FLOW_GRIDBACK:
			switch (this.flowDirection) {
			case b.ROW_FLOW:
				return this.xAscending && this.yAscending ? "GridGridback-RowPxPy": this.xAscending ? "GridGridback-RowPxNy": this.yAscending ? "GridGridback-RowNxPy": "GridGridback-RowNxNy";
			case b.COL_FLOW:
				return this.xAscending && this.yAscending ? "GridGridback-ColPxPy": this.xAscending ? "GridGridback-ColPxNy": this.yAscending ? "GridGridback-ColNxPy": "GridGridback-ColNxNy"
			}
		}
	}
});
ARAC.namespace("ARAC.layout.tree");
ARAC.layout.tree.TreeLayout = function() {
	ARAC.layout.tree.TreeLayout._superInit.call(this)
};
ARAC.inherit(ARAC.layout.tree.TreeLayout, ARAC.layout.model.NodeLayout, {
	applicable: function(a, b) {
		var c = this.filterTags(a.getNodes(), b);
		return (new ARAC.layout.tools.TopologicalSort).apply(c).tree ? !0 : !1
	},
	apply: function(a, b, c, e) {
		e && (e.startLayout(), e.layoutProgress(0));
		this.mainConfig = this.rootConfig = c;
		b = this.filterZeroDegree(b.getNodes());
		b = this.filterTags(b, c);
		b = this.orderNodes(b);
		this.results = a;
		this.results.nodes = ARAC.core.arrayCopy(b);
		this.results.idmap = ARAC.layout.tools.graphtools.nodeIndexMap(b);
		this.results.mapCenters || (this.results.mapCenters = {});
		this.results.resultToposort = (new ARAC.layout.tools.TopologicalSort).apply(b, {
			results: this.results,
			config: this.mainConfig,
			nodeAllowed: function(a) {
				return this.results.idmap[a.getID()] && !this.config.hasNDesc(a)
			}
		});
		if (!this.results.resultToposort.tree) throw new ARAC.Error("TreeLayout cannot be used \x3d\x3e graph is not a tree");
		e && e.layoutProgress(0.25);
		this.results.resultLayering = (new ARAC.layout.tools.TopoSortLayering).apply(this.results.resultToposort, {
			results: this.results,
			config: this.mainConfig,
			nodeAllowed: function(a) {
				return this.results.idmap[a.getID()] && !this.config.hasNDesc(a)
			}
		});
		e && e.layoutProgress(0.5);
		c.submitIntermediateResults && this.submitResults();
		this.results.resultOrdering = {};
		this.results.resultOrdering.layersOrdered = this.results.resultLayering.getLayeredNodes();
		this.results.resultOrdering.indexOf = function(a) {
			for (var b = 0; b < this.layersOrdered.length; b++) for (var c = 0; c < this.layersOrdered[b].length; c++) if (this.layersOrdered[b][c] == a) return {
				layer: b,
				idx: c
			};
			return {
				layer: -1,
				idx: -1
			}
		};
		e && e.layoutProgress(0.75);
		this.balanceTree(c);
		e && e.layoutProgress(1);
		this.submitResults(b);
		e && e.stopLayout();
		delete this.rootConfig;
		delete this.mainConfig
	},
	orderNodes: function(a) {
		var b = [],
		c;
		for (c = 0; c < a.length; c++) 0 == a[c].getIndegree() && b.push(a[c]);
		for (c = 0; c < b.length; c++) ARAC.core.arrayRemove(a, b[c]);
		return b.concat(a)
	},
	submitResults: function(a) {
		for (var b = this.results.mapCenters,
		c = this.results.mapAnnex,
		e = 0; e < a.length; e++) b[a[e].getID()] || (b[a[e].getID()] = a[e].getCenter());
		this.applyLayoutOrigin(a, this.mainConfig);
		for (e = 0; e < a.length; e++) if (0 != a[e].getIndegree() + a[e].getOutdegree()) {
			var d = b[a[e].getID()];
			this.mainConfig.recordResults || a[e].setCenter(d);
			c[a[e].getID()] && c[a[e].getID()].move(d, b, this.mainConfig.recordResults)
		}
	},
	balanceTree: function(a) {
		var b = this.results.resultOrdering.layersOrdered,
		c = this.results.mapCenters;
		this.results.resultBalancing = {};
		this.results.resultBalancing.layersBalanced = Array(b.length);
		for (var e = this.results.resultBalancing.layersBalanced,
		d = ARAC.layout.config.LayoutOrientation,
		f = 0; f < b.length; f++) {
			e[f] = Array(b[f].length);
			for (var g = 0; g < b[f].length; g++) c[b[f][g].getID()] || (c[b[f][g].getID()] = b[f][g].getBBox().getCenter()),
			e[f][g] = c[b[f][g].getID()]
		}
		this.results.edgeInfo || (this.results.edgeInfo = {});
		this.results.mapAnnex || (this.results.mapAnnex = {});
		this.results.roots = [];
		this.results.cmpnodes = {};
		this.results.cmpedges = {};
		for (f = 0; f < b[0].length; f++) {
			var e = [],
			g = [],
			h = new ARAC.Coord;
			this.results.roots[f] = b[0][f];
			switch (a.layoutOrientation) {
			case d.TOP_TO_BOTTOM:
			case d.BOTTOM_TO_TOP:
				c = this.balanceSubtree(b[0][f], h, 0, 0, e, g);
				h.x = c.bboxAll.x2 + 1E3;
				break;
			case d.LEFT_TO_RIGHT:
			case d.RIGHT_TO_LEFT:
				c = this.balanceSubtree(b[0][f], h, 0, 0, e, g),
				h.y = c.bboxAll.y2 + 1E3
			}
			this.results.cmpnodes[b[0][f].getID()] = e;
			this.results.cmpedges[b[0][f].getID()] = g
		}
		d = ARAC.layout.config.LayoutOriginProcessor;
		switch (a.layoutOriginProcessor) {
		case d.CNODE_LEFTTOP:
			void 0 != a.layoutOriginNode && (this.results.mapLayoutOrigin = {},
			this.results.mapLayoutOrigin[a.layoutOriginNode.getID()] = a.layoutOriginNode.getBBox());
		case d.ROOT_LEFTTOP:
			for (this.results.mapLayoutOrigin || (this.results.mapLayoutOrigin = {}), f = 0; f < b[0].length; f++) this.results.mapLayoutOrigin[b[0][f].getID()] = b[0][f].getBBox()
		}
	},
	balanceSubtree: function(a, b, c, e, d, f) {
		var g = a.getAttribute("TreeConfig"),
		g = g ? g.getValue() : void 0;
		if (void 0 == g && this.mainConfig.nodeDescriptor) for (var h = a.getTags(), k = 0; k < h.length; k++) if (this.mainConfig.nodeDescriptor[h[k]]) {
			g = this.mainConfig.nodeDescriptor[h[k]].config;
			break
		}
		if (g) {
			k = this.rootConfig;
			this.rootConfig = g;
			try {
				return this.balanceSubtreeCfg(g, a, b, c, e, d, f)
			} finally {
				this.rootConfig = k
			}
		} else if (null != this.mainConfig.levelDescriptor) for (k = this.mainConfig.levelDescriptor.length - 1; 0 <= k; k--) if (g = this.mainConfig.levelDescriptor[k], g.level <= c && g.config) return this.balanceSubtreeCfg(g.config, a, b, c, e, d, f);
		return this.balanceSubtreeCfg(this.rootConfig, a, b, c, e, d, f)
	},
	balanceSubtreeCfg: function(a, b, c, e, d, f, g) {
		var h = ARAC.layout.config.TreeStyle;
		switch (a.treeStyle) {
		case h.TREE_NORMAL:
			return this.balanceTreeNormal(b, c, e, d, a, f, g);
		case h.TREE_LIST_SINGLE:
			return this.balanceTreeListSingle(b, c, e, d, a, f, g);
		case h.TREE_LIST_DOUBLE:
			return this.balanceTreeListDouble(b, c, e, d, a, f, g);
		case h.TREE_HV:
			return this.balanceTreeHV(b, c, e, d, a, f, g)
		}
	},
	balanceTreeNormal: function(a, b, c, e, d, f, g) {
		var h = ARAC.layout.config.LayoutOrientation,
		k = a.getOutboundEdges(),
		q = d.careAnnex ? new ARAC.layout.model.Annex(a, d.tags, d.tagsNAnnex, this.results.mapCenters) : void 0,
		p = a.getBBox(),
		r = new ARAC.Coord(b.x, b.y),
		m = {};
		m.bboxRoot = new ARAC.BBox;
		q && (this.results.mapAnnex[a.getID()] = q);
		f.push(a);
		switch (d.layoutOrientation) {
		case h.TOP_TO_BOTTOM:
			m.bboxRoot.x1 = b.x;
			m.bboxRoot.x2 = b.x + p.getWidth();
			m.bboxRoot.y1 = b.y;
			m.bboxRoot.y2 = b.y + p.getHeight();
			r.y += p.getHeight() + (q ? q.myu: 0) + d.layerDistance;
			break;
		case h.BOTTOM_TO_TOP:
			m.bboxRoot.x1 = b.x;
			m.bboxRoot.x2 = b.x + p.getWidth();
			m.bboxRoot.y1 = b.y - p.getHeight();
			m.bboxRoot.y2 = b.y;
			r.y -= p.getHeight() + d.layerDistance;
			break;
		case h.LEFT_TO_RIGHT:
			m.bboxRoot.x1 = b.x;
			m.bboxRoot.x2 = b.x + p.getWidth();
			m.bboxRoot.y1 = b.y;
			m.bboxRoot.y2 = b.y + p.getHeight();
			r.x += p.getWidth() + d.layerDistance;
			break;
		case h.RIGHT_TO_LEFT:
			m.bboxRoot.x1 = b.x - p.getWidth(),
			m.bboxRoot.x2 = b.x,
			m.bboxRoot.y1 = b.y,
			m.bboxRoot.y2 = b.y + p.getHeight(),
			r.x -= p.getWidth() + d.layerDistance
		}
		m.bboxAll = new ARAC.BBox(m.bboxRoot.x1, m.bboxRoot.y1, m.bboxRoot.x2, m.bboxRoot.y2);
		for (var l = new ARAC.BBox(m.bboxRoot.x1, m.bboxRoot.y1, m.bboxRoot.x2, m.bboxRoot.y2), s = [], n = 0, t = 0, u = 0; u < k.length; u++) if (this.results.idmap[k[u].getTarget().getID()] && d.isNode(k[u].getTarget())) {
			g.push(k[u]);
			s[u] = this.balanceSubtree(k[u].getTarget(), r, c + 1, e + 1, f, g);
			switch (d.layoutOrientation) {
			case h.TOP_TO_BOTTOM:
				n = Math.max(0, s[u].mxl);
				t = Math.max(0, s[u].myl);
				r.x = Math.max(s[u].bboxAll.x2, s[u].bboxRoot.x2 + (s[u].anx ? s[u].anx.mxu: 0)) + d.nodeDistance + n;
				this.moveSubtree(d, k[u].getTarget(), n, t, c + 1);
				s[u].bboxRoot.offset(n, t);
				s[u].bboxAll.offset(n, t);
				n = new ARAC.layout.model.EdgeInfo(ARAC.layout.model.EdgeDirection.Y, d.edgeType, d.edgeTypeDesc.copy(), void 0, d.edgeMapping());
				n.typeDesc._clType = ARAC.layout.config.CrosslineType.SRCORG;
				n.typeDesc._clValue = (q ? q.myu: 0) + d.layerDistance / 2;
				this.results.edgeInfo[k[u].getID()] = n;
				break;
			case h.BOTTOM_TO_TOP:
				n = Math.max(0, s[u].mxl);
				t = -Math.max(0, s[u].myu);
				r.x = s[u].bboxAll.x2 + d.nodeDistance + n;
				this.moveSubtree(d, k[u].getTarget(), n, t, c + 1);
				s[u].bboxRoot.offset(n, t);
				s[u].bboxAll.offset(n, t);
				this.results.edgeInfo[k[u].getID()] = new ARAC.layout.model.EdgeInfo(ARAC.layout.model.EdgeDirection.Y, d.edgeType, d.edgeTypeDesc, void 0, d.edgeMapping());
				break;
			case h.LEFT_TO_RIGHT:
				n = Math.max(0, s[u].mxl);
				t = Math.max(0, s[u].myl);
				r.y = s[u].bboxAll.y2 + d.nodeDistance + t;
				this.moveSubtree(d, k[u].getTarget(), n, t, c + 1);
				s[u].bboxRoot.offset(n, t);
				s[u].bboxAll.offset(n, t);
				n = new ARAC.layout.model.EdgeInfo(ARAC.layout.model.EdgeDirection.X, d.edgeType, d.edgeTypeDesc, void 0, d.edgeMapping());
				n.typeDesc._clType = ARAC.layout.config.CrosslineType.SRCORG;
				n.typeDesc._clValue = (q ? q.mxu: 0) + d.layerDistance / 2;
				this.results.edgeInfo[k[u].getID()] = n;
				break;
			case h.RIGHT_TO_LEFT:
				n = -Math.max(0, s[u].mxu),
				t = Math.max(0, s[u].myl),
				r.y = s[u].bboxAll.y2 + d.nodeDistance + t,
				this.moveSubtree(d, k[u].getTarget(), n, t, c + 1),
				s[u].bboxRoot.offset(n, t),
				s[u].bboxAll.offset(n, t),
				this.results.edgeInfo[k[u].getID()] = new ARAC.layout.model.EdgeInfo(ARAC.layout.model.EdgeDirection.X, d.edgeType, d.edgeTypeDesc, void 0, d.edgeMapping())
			}
			m.bboxAll.union(s[u].bboxAll);
			0 == u ? (l.x1 = s[u].bboxRoot.x1, l.x2 = s[u].bboxRoot.x2, l.y1 = s[u].bboxRoot.y1, l.y2 = s[u].bboxRoot.y2) : l.union(s[u].bboxRoot)
		}
		g = this.results.resultOrdering.layersOrdered;
		e = this.results.resultBalancing.layersBalanced;
		m.mxl = 0;
		m.mxu = 0;
		m.myl = 0;
		for (f = m.myu = 0; f < g[c].length; f++) if (g[c][f] == a) {
			a = ARAC.layout.config.ParentBalancing;
			switch (d.layoutOrientation) {
			case h.TOP_TO_BOTTOM:
				switch (d.parentBalancing) {
				case a.HEAD:
					e[c][f].x = l.x1 + m.bboxRoot.getWidth() / 2;
					break;
				case a.MEDIAN:
					e[c][f].x = l.getCenterX();
					break;
				case a.TAIL:
					e[c][f].x = l.x2 - m.bboxRoot.getWidth() / 2
				}
				e[c][f].y = b.y + p.getHeight() / 2;
				break;
			case h.BOTTOM_TO_TOP:
				switch (d.parentBalancing) {
				case a.HEAD:
					e[c][f].x = l.x1 + m.bboxRoot.getWidth() / 2;
					break;
				case a.MEDIAN:
					e[c][f].x = l.getCenterX();
					break;
				case a.TAIL:
					e[c][f].x = l.x2 - m.bboxRoot.getWidth() / 2
				}
				e[c][f].y = b.y - p.getHeight() / 2;
				break;
			case h.LEFT_TO_RIGHT:
				e[c][f].x = b.x + p.getWidth() / 2;
				switch (d.parentBalancing) {
				case a.HEAD:
					e[c][f].y = l.y1 + m.bboxRoot.getHeight() / 2;
					break;
				case a.MEDIAN:
					e[c][f].y = l.getCenterY();
					break;
				case a.TAIL:
					e[c][f].y = l.y2 - m.bboxRoot.getHeight() / 2
				}
				break;
			case h.RIGHT_TO_LEFT:
				switch (e[c][f].x = b.x - p.getWidth() / 2, d.parentBalancing) {
				case a.HEAD:
					e[c][f].y = l.y1 + m.bboxRoot.getHeight() / 2;
					break;
				case a.MEDIAN:
					e[c][f].y = l.getCenterY();
					break;
				case a.TAIL:
					e[c][f].y = l.y2 - m.bboxRoot.getHeight() / 2
				}
			}
			m.bboxRoot.setCenter(e[c][f].x, e[c][f].y);
			m.bboxAll.union(m.bboxRoot);
			switch (d.layoutOrientation) {
			case h.TOP_TO_BOTTOM:
				m.mxl = 0;
				m.mxu = m.bboxAll.x2 - m.bboxRoot.x2 + m.bboxRoot.getWidth() + (m.bboxAll.getWidth() - m.bboxRoot.getWidth()) / 2;
				m.myl = m.bboxRoot.y1 - m.bboxAll.y1;
				m.myu = m.bboxAll.y2 - m.bboxRoot.y2 + m.bboxRoot.getHeight();
				break;
			case h.BOTTOM_TO_TOP:
				m.mxl = 0;
				m.mxu = m.bboxAll.x2 - m.bboxRoot.x2 + m.bboxRoot.getWidth() + (m.bboxAll.getWidth() - m.bboxRoot.getWidth()) / 2;
				m.myl = m.bboxRoot.y1 - m.bboxAll.y1 + m.bboxRoot.getHeight();
				m.myu = m.bboxAll.y2 - m.bboxRoot.y2;
				break;
			case h.LEFT_TO_RIGHT:
				m.mxl = m.bboxRoot.x1 - m.bboxAll.x1;
				m.mxu = m.bboxAll.x2 - m.bboxRoot.x2 + m.bboxRoot.getWidth();
				m.myl = 0;
				m.myu = m.bboxAll.y2 - m.bboxRoot.y2 + m.bboxRoot.getHeight() + (m.bboxAll.getHeight() - m.bboxRoot.getHeight()) / 2;
				break;
			case h.RIGHT_TO_LEFT:
				m.mxl = m.bboxRoot.x1 - m.bboxAll.x1 + m.bboxRoot.getWidth(),
				m.mxu = m.bboxAll.x2 - m.bboxRoot.x2,
				m.myl = 0,
				m.myu = m.bboxAll.y2 - m.bboxRoot.y2 + m.bboxRoot.getHeight() + (m.bboxAll.getHeight() - m.bboxRoot.getHeight()) / 2
			}
			q && (q.move(m.bboxRoot.getCenter(), this.results.mapCenters, this.mainConfig.recordResults), m.anx = q);
			break
		}
		return m
	},
	balanceTreeListSingle: function(a, b, c, e, d, f, g) {
		var h = ARAC.layout.config.LayoutOrientation,
		k = ARAC.layout.config.ParentBalancing,
		q = a.getOutboundEdges(),
		p = d.careAnnex ? new ARAC.layout.model.Annex(a, d.tags, d.tagsNAnnex, this.results.mapCenters) : void 0,
		r = a.getBBox(),
		m = new ARAC.Coord(b.x, b.y),
		l = {};
		l.bboxRoot = new ARAC.BBox(0, 0, r.getWidth(), r.getHeight());
		p && (this.results.mapAnnex[a.getID()] = p);
		f.push(a);
		switch (d.layoutOrientation) {
		case h.TOP_TO_BOTTOM:
			switch (d.parentBalancing) {
			case k.HEAD:
			case k.MEDIAN:
				m.x += l.bboxRoot.getWidth() + (p ? p.mxl: 0) + d.layerDistance;
				break;
			case k.TAIL:
				m.x -= l.bboxRoot.getWidth() + d.layerDistance
			}
			m.y += l.bboxRoot.getHeight() + (p ? p.myl + p.myu: 0) + d.nodeDistance;
			break;
		case h.BOTTOM_TO_TOP:
			switch (d.parentBalancing) {
			case k.HEAD:
			case k.MEDIAN:
				m.x += l.bboxRoot.getWidth() + d.layerDistance;
				break;
			case k.TAIL:
				m.x -= l.bboxRoot.getWidth() + d.layerDistance
			}
			m.y -= l.bboxRoot.getHeight() + d.nodeDistance;
			break;
		case h.LEFT_TO_RIGHT:
			m.x += l.bboxRoot.getWidth() + d.nodeDistance;
			switch (d.parentBalancing) {
			case k.HEAD:
			case k.MEDIAN:
				m.y += l.bboxRoot.getHeight() + d.layerDistance;
				break;
			case k.TAIL:
				m.y -= l.bboxRoot.getHeight() + d.layerDistance
			}
			break;
		case h.RIGHT_TO_LEFT:
			switch (m.x -= l.bboxRoot.getWidth() + d.nodeDistance, d.parentBalancing) {
			case k.HEAD:
			case k.MEDIAN:
				m.y += l.bboxRoot.getHeight() + d.layerDistance;
				break;
			case k.TAIL:
				m.y -= l.bboxRoot.getHeight() + d.layerDistance
			}
		}
		for (var s = this.results.resultOrdering.layersOrdered,
		n = this.results.resultBalancing.layersBalanced,
		t = 0; t < s[c].length; t++) if (s[c][t] == a) {
			switch (d.layoutOrientation) {
			case h.TOP_TO_BOTTOM:
				switch (d.parentBalancing) {
				case k.HEAD:
				case k.MEDIAN:
					n[c][t].x = b.x + (p ? p.mxl: 0) + r.getWidth() / 2;
					break;
				case k.TAIL:
					n[c][t].x = b.x - r.getWidth() / 2
				}
				n[c][t].y = b.y + (p ? p.myl: 0) + r.getHeight() / 2;
				break;
			case h.BOTTOM_TO_TOP:
				switch (d.parentBalancing) {
				case k.HEAD:
				case k.MEDIAN:
					n[c][t].x = b.x + r.getWidth() / 2;
					break;
				case k.TAIL:
					n[c][t].x = b.x - r.getWidth() / 2
				}
				n[c][t].y = b.y - r.getHeight() / 2;
				break;
			case h.LEFT_TO_RIGHT:
				n[c][t].x = b.x + r.getWidth() / 2;
				switch (d.parentBalancing) {
				case k.HEAD:
				case k.MEDIAN:
					n[c][t].y = b.y + r.getHeight() / 2;
					break;
				case k.TAIL:
					n[c][t].y = b.y - r.getHeight() / 2
				}
				break;
			case h.RIGHT_TO_LEFT:
				switch (n[c][t].x = b.x - r.getWidth() / 2, d.parentBalancing) {
				case k.HEAD:
				case k.MEDIAN:
					n[c][t].y = b.y + r.getHeight() / 2;
					break;
				case k.TAIL:
					n[c][t].y = b.y - r.getHeight() / 2
				}
			}
			l.bboxRoot.setCenter(n[c][t].x, n[c][t].y);
			break
		}
		l.bboxAll = new ARAC.BBox(l.bboxRoot.x1, l.bboxRoot.y1, l.bboxRoot.x2, l.bboxRoot.y2);
		l.mxl = 0;
		l.mxu = 0;
		l.myl = 0;
		l.myu = 0;
		a = [];
		for (n = s = r = b = 0; n < q.length; n++) if (this.results.idmap[q[n].getTarget().getID()] && d.isNode(q[n].getTarget())) {
			g.push(q[n]);
			a[n] = this.balanceSubtree(q[n].getTarget(), m, c + 1, e + 1, f, g);
			switch (d.layoutOrientation) {
			case h.TOP_TO_BOTTOM:
				s = Math.max(s, a[n].mxl);
				switch (d.parentBalancing) {
				case k.HEAD:
				case k.MEDIAN:
					b = Math.max(0, a[n].mxl);
					break;
				case k.TAIL:
					b = -Math.max(0, a[n].mxu)
				}
				r = Math.max(0, a[n].myl);
				m.y = a[n].bboxAll.y2 + d.nodeDistance + r;
				this.moveSubtree(d, q[n].getTarget(), b, r, c + 1);
				a[n].bboxRoot.offset(b, r);
				a[n].bboxAll.offset(b, r);
				this.results.edgeInfo[q[n].getID()] = new ARAC.layout.model.EdgeInfo(ARAC.layout.model.EdgeDirection.Y, d.edgeType, d.edgeTypeDesc, void 0, d.edgeMapping());
				break;
			case h.BOTTOM_TO_TOP:
				s = Math.max(s, a[n].mxl);
				switch (d.parentBalancing) {
				case k.HEAD:
				case k.MEDIAN:
					b = Math.max(0, a[n].mxl);
					break;
				case k.TAIL:
					b = -Math.max(0, a[n].mxu)
				}
				r = -Math.max(0, a[n].myu);
				m.y = a[n].bboxAll.y1 - d.nodeDistance + r;
				this.moveSubtree(d, q[n].getTarget(), b, r, c + 1);
				a[n].bboxRoot.offset(b, r);
				a[n].bboxAll.offset(b, r);
				this.results.edgeInfo[q[n].getID()] = new ARAC.layout.model.EdgeInfo(ARAC.layout.model.EdgeDirection.Y, d.edgeType, d.edgeTypeDesc, void 0, d.edgeMapping());
				break;
			case h.LEFT_TO_RIGHT:
				s = Math.max(s, a[n].myl);
				b = Math.max(0, a[n].mxl);
				switch (d.parentBalancing) {
				case k.HEAD:
				case k.MEDIAN:
					r = Math.max(0, a[n].myl);
					break;
				case k.TAIL:
					r = -Math.max(0, a[n].myu)
				}
				m.x = a[n].bboxAll.x2 + d.nodeDistance + b;
				this.moveSubtree(d, q[n].getTarget(), b, r, c + 1);
				a[n].bboxRoot.offset(b, r);
				a[n].bboxAll.offset(b, r);
				this.results.edgeInfo[q[n].getID()] = new ARAC.layout.model.EdgeInfo(ARAC.layout.model.EdgeDirection.X, d.edgeType, d.edgeTypeDesc, void 0, d.edgeMapping());
				break;
			case h.RIGHT_TO_LEFT:
				s = Math.max(s, a[n].myl);
				b = -Math.max(0, a[n].mxu);
				switch (d.parentBalancing) {
				case k.HEAD:
				case k.MEDIAN:
					r = Math.max(0, a[n].myl);
					break;
				case k.TAIL:
					r = -Math.max(0, a[n].myu)
				}
				m.x = a[n].bboxAll.x1 - d.nodeDistance + b;
				this.moveSubtree(d, q[n].getTarget(), b, r, c + 1);
				a[n].bboxRoot.offset(b, r);
				a[n].bboxAll.offset(b, r);
				this.results.edgeInfo[q[n].getID()] = new ARAC.layout.model.EdgeInfo(ARAC.layout.model.EdgeDirection.X, d.edgeType, d.edgeTypeDesc, void 0, d.edgeMapping())
			}
			l.bboxAll.union(a[n].bboxAll)
		}
		switch (d.layoutOrientation) {
		case h.TOP_TO_BOTTOM:
			switch (d.parentBalancing) {
			case k.HEAD:
			case k.MEDIAN:
				l.mxl = 0;
				l.mxu = l.bboxAll.x2 - l.bboxRoot.x2 + l.bboxRoot.getWidth();
				break;
			case k.TAIL:
				l.mxl = l.bboxRoot.x1 - l.bboxAll.x1 + l.bboxRoot.getWidth(),
				l.mxu = 0
			}
			l.myl = l.bboxRoot.y1 - l.bboxAll.y1;
			l.myu = l.bboxAll.y2 - l.bboxRoot.y2 + l.bboxRoot.getHeight();
			break;
		case h.BOTTOM_TO_TOP:
			switch (d.parentBalancing) {
			case k.HEAD:
			case k.MEDIAN:
				l.mxl = 0;
				l.mxu = l.bboxAll.x2 - l.bboxRoot.x2 + l.bboxRoot.getWidth();
				break;
			case k.TAIL:
				l.mxl = l.bboxRoot.x1 - l.bboxAll.x1 + l.bboxRoot.getWidth(),
				l.mxu = 0
			}
			l.myl = l.bboxRoot.y1 - l.bboxAll.y1 + l.bboxRoot.getHeight();
			l.myu = l.bboxAll.y2 - l.bboxRoot.y2;
			break;
		case h.LEFT_TO_RIGHT:
			l.mxl = l.bboxRoot.x1 - l.bboxAll.x1;
			l.mxu = l.bboxAll.x2 - l.bboxRoot.x2 + l.bboxRoot.getWidth();
			switch (d.parentBalancing) {
			case k.HEAD:
			case k.MEDIAN:
				l.myl = 0;
				l.myu = l.bboxAll.y2 - l.bboxRoot.y2 + l.bboxRoot.getHeight();
				break;
			case k.TAIL:
				l.myl = l.bboxRoot.y1 - l.bboxAll.y1 + l.bboxRoot.getHeight(),
				l.myu = 0
			}
			break;
		case h.RIGHT_TO_LEFT:
			switch (l.mxl = l.bboxRoot.x1 - l.bboxAll.x1 + l.bboxRoot.getWidth(), l.mxu = l.bboxAll.x2 - l.bboxRoot.x2, d.parentBalancing) {
			case k.HEAD:
			case k.MEDIAN:
				l.myl = 0;
				l.myu = l.bboxAll.y2 - l.bboxRoot.y2 + l.bboxRoot.getHeight();
				break;
			case k.TAIL:
				l.myl = l.bboxRoot.y1 - l.bboxAll.y1 + l.bboxRoot.getHeight(),
				l.myu = 0
			}
		}
		p && (p.move(l.bboxRoot.getCenter(), this.results.mapCenters, this.mainConfig.recordResults), l.anx = p);
		return l
	},
	balanceTreeListDouble: function(a, b, c, e, d, f, g) {
		var h = ARAC.layout.config.LayoutOrientation,
		k = a.getOutboundEdges(),
		q = d.careAnnex ? new ARAC.layout.model.Annex(a, d.tags, d.tagsNAnnex, this.results.mapCenters) : void 0,
		p = a.getBBox(),
		r = new ARAC.Coord(b.x, b.y),
		m = {};
		m.bboxRoot = new ARAC.BBox;
		q && (this.results.mapAnnex[a.getID()] = q);
		f.push(a);
		for (var l = k.length - 1; 0 <= l; l--) this.results.idmap[k[l].getTarget().getID()] && d.isNode(k[l].getTarget()) && !this.mainConfig.hasNDesc(k[l].getTarget()) || ARAC.core.arrayRemove(k, k[l]);
		switch (d.layoutOrientation) {
		case h.TOP_TO_BOTTOM:
			m.bboxRoot.x1 = b.x;
			m.bboxRoot.x2 = b.x + p.getWidth();
			m.bboxRoot.y1 = b.y;
			m.bboxRoot.y2 = b.y + p.getHeight();
			r.y += p.getHeight() + (q ? q.myu: 0) + d.nodeDistance;
			break;
		case h.BOTTOM_TO_TOP:
			m.bboxRoot.x1 = b.x;
			m.bboxRoot.x2 = b.x + p.getWidth();
			m.bboxRoot.y1 = b.y - p.getHeight();
			m.bboxRoot.y2 = b.y;
			r.y -= p.getHeight() + d.nodeDistance;
			break;
		case h.LEFT_TO_RIGHT:
			m.bboxRoot.x1 = b.x;
			m.bboxRoot.x2 = b.x + p.getWidth();
			m.bboxRoot.y1 = b.y;
			m.bboxRoot.y2 = b.y + p.getHeight();
			r.x += p.getWidth() + (q ? q.mxu: 0) + d.nodeDistance;
			break;
		case h.RIGHT_TO_LEFT:
			m.bboxRoot.x1 = b.x - p.getWidth(),
			m.bboxRoot.x2 = b.x,
			m.bboxRoot.y1 = b.y,
			m.bboxRoot.y2 = b.y + p.getHeight(),
			r.x -= p.getWidth() + d.nodeDistance
		}
		m.bboxAll = new ARAC.BBox(m.bboxRoot.x1, m.bboxRoot.y1, m.bboxRoot.x2, m.bboxRoot.y2);
		for (var s = new ARAC.BBox(m.bboxRoot.x1, m.bboxRoot.y1, m.bboxRoot.x2, m.bboxRoot.y2), n = [], t = 0, l = 0; l < Math.round(k.length / 2); l++) switch (g.push(k[l]), n[l] = this.balanceSubtree(k[l].getTarget(), r, c + 1, e + 1, f, g), d.layoutOrientation) {
		case h.TOP_TO_BOTTOM:
			cx = Math.max(0, n[l].mxl);
			cy = Math.max(0, n[l].myl);
			this.moveSubtree(d, k[l].getTarget(), cx, cy, c + 1);
			n[l].bboxRoot.offset(cx, cy);
			n[l].bboxAll.offset(cx, cy);
			r.y = Math.max(n[l].bboxAll.y2, n[l].bboxRoot.y2 + (n[l].anx ? n[l].anx.myu: 0)) + d.nodeDistance;
			t = Math.max(t, n[l].bboxRoot.x1 - n[l].bboxAll.x1);
			break;
		case h.BOTTOM_TO_TOP:
			cx = Math.max(0, n[l].mxl);
			cy = -Math.max(0, n[l].myu);
			this.moveSubtree(d, k[l].getTarget(), cx, cy, c + 1);
			n[l].bboxRoot.offset(cx, cy);
			n[l].bboxAll.offset(cx, cy);
			r.y = n[l].bboxAll.y1 - d.nodeDistance;
			t = Math.max(t, n[l].bboxRoot.x1 - n[l].bboxAll.x1);
			break;
		case h.LEFT_TO_RIGHT:
			cx = Math.max(0, n[l].mxl);
			cy = Math.max(0, n[l].myl);
			this.moveSubtree(d, k[l].getTarget(), cx, cy, c + 1);
			n[l].bboxRoot.offset(cx, cy);
			n[l].bboxAll.offset(cx, cy);
			r.x = Math.max(n[l].bboxAll.x2, n[l].bboxRoot.x2 + (n[l].anx ? n[l].anx.mxu: 0)) + d.nodeDistance;
			t = Math.max(t, n[l].bboxRoot.y1 - n[l].bboxAll.y1);
			break;
		case h.RIGHT_TO_LEFT:
			cx = -Math.max(0, n[l].mxu),
			cy = Math.max(0, n[l].myl),
			this.moveSubtree(d, k[l].getTarget(), cx, cy, c + 1),
			n[l].bboxRoot.offset(cx, cy),
			n[l].bboxAll.offset(cx, cy),
			r.x = n[l].bboxAll.x1 - d.nodeDistance,
			t = Math.max(t, n[l].bboxRoot.y1 - n[l].bboxAll.y1)
		}
		for (l = 0; l < Math.round(k.length / 2); l++) {
			switch (d.layoutOrientation) {
			case h.TOP_TO_BOTTOM:
			case h.BOTTOM_TO_TOP:
				cx = t - (n[l].bboxRoot.x1 - n[l].bboxAll.x1);
				this.moveSubtree(d, k[l].getTarget(), cx, 0, c + 1);
				n[l].bboxRoot.offset(cx, 0);
				n[l].bboxAll.offset(cx, 0);
				break;
			case h.LEFT_TO_RIGHT:
			case h.RIGHT_TO_LEFT:
				cy = t - (n[l].bboxRoot.y1 - n[l].bboxAll.y1),
				this.moveSubtree(d, k[l].getTarget(), 0, cy, c + 1),
				n[l].bboxRoot.offset(0, cy),
				n[l].bboxAll.offset(0, cy)
			}
			0 == l ? (s.x1 = n[l].bboxAll.x1, s.x2 = n[l].bboxAll.x2, s.y1 = n[l].bboxAll.y1, s.y2 = Math.max(n[l].bboxAll.y2, n[l].bboxRoot.y2 + (n[l].anx ? n[l].anx.myu: 0))) : s.union(n[l].bboxAll);
			m.bboxAll.union(n[l].bboxAll)
		}
		var u = 0;
		switch (d.layoutOrientation) {
		case h.TOP_TO_BOTTOM:
			r.x = s.x2 + d.layerDistance + p.getWidth() + d.layerDistance;
			r.y = b.y + p.getHeight() + (q ? q.myu: 0) + d.nodeDistance;
			u = 0 < k.length ? s.x2 + d.layerDistance: b.x;
			break;
		case h.BOTTOM_TO_TOP:
			r.x = s.x2 + d.layerDistance + p.getWidth() + d.layerDistance;
			r.y = b.y - (p.getHeight() + d.nodeDistance);
			u = 0 < k.length ? s.x2 + d.layerDistance: b.x;
			break;
		case h.LEFT_TO_RIGHT:
			r.x = b.x + p.getWidth() + (q ? q.mxu: 0) + d.nodeDistance;
			r.y = s.y2 + d.layerDistance + p.getHeight() + d.layerDistance;
			u = 0 < k.length ? s.y2 + d.layerDistance: b.y;
			break;
		case h.RIGHT_TO_LEFT:
			r.x = b.x - (p.getWidth() + d.nodeDistance),
			r.y = s.y2 + d.layerDistance + p.getHeight() + d.layerDistance,
			u = 0 < k.length ? s.y2 + d.layerDistance: b.y
		}
		t = 0;
		for (l = Math.round(k.length / 2); l < k.length; l++) switch (g.push(k[l]), n[l] = this.balanceSubtree(k[l].getTarget(), r, c + 1, e + 1, f, g), d.layoutOrientation) {
		case h.TOP_TO_BOTTOM:
			cx = Math.max(0, n[l].mxl);
			cy = Math.max(0, n[l].myl);
			this.moveSubtree(d, k[l].getTarget(), cx, cy, c + 1);
			n[l].bboxRoot.offset(cx, cy);
			n[l].bboxAll.offset(cx, cy);
			r.y = n[l].bboxAll.y2 + d.nodeDistance;
			t = Math.max(t, n[l].bboxRoot.x1 - n[l].bboxAll.x1);
			break;
		case h.BOTTOM_TO_TOP:
			cx = Math.max(0, n[l].mxl);
			cy = -Math.max(0, n[l].myu);
			this.moveSubtree(d, k[l].getTarget(), cx, cy, c + 1);
			n[l].bboxRoot.offset(cx, cy);
			n[l].bboxAll.offset(cx, cy);
			r.y = n[l].bboxAll.y1 - d.nodeDistance;
			t = Math.max(t, n[l].bboxRoot.x1 - n[l].bboxAll.x1);
			break;
		case h.LEFT_TO_RIGHT:
			cx = Math.max(0, n[l].mxl);
			cy = Math.max(0, n[l].myl);
			this.moveSubtree(d, k[l].getTarget(), cx, cy, c + 1);
			n[l].bboxRoot.offset(cx, cy);
			n[l].bboxAll.offset(cx, cy);
			r.x = Math.max(n[l].bboxAll.x2, n[l].bboxRoot.x2 + (n[l].anx ? n[l].anx.mxu: 0)) + d.nodeDistance;
			t = Math.max(t, n[l].bboxRoot.y1 - n[l].bboxAll.y1);
			break;
		case h.RIGHT_TO_LEFT:
			cx = -Math.max(0, n[l].mxu),
			cy = Math.max(0, n[l].myl),
			this.moveSubtree(d, k[l].getTarget(), cx, cy, c + 1),
			n[l].bboxRoot.offset(cx, cy),
			n[l].bboxAll.offset(cx, cy),
			r.x = n[l].bboxAll.x1 - d.nodeDistance,
			t = Math.max(t, n[l].bboxRoot.y1 - n[l].bboxAll.y1)
		}
		for (l = Math.round(k.length / 2); l < k.length; l++) {
			switch (d.layoutOrientation) {
			case h.TOP_TO_BOTTOM:
			case h.BOTTOM_TO_TOP:
				cx = t - (n[l].bboxRoot.x1 - n[l].bboxAll.x1);
				this.moveSubtree(d, k[l].getTarget(), cx, 0, c + 1);
				n[l].bboxRoot.offset(cx, 0);
				n[l].bboxAll.offset(cx, 0);
				break;
			case h.LEFT_TO_RIGHT:
			case h.RIGHT_TO_LEFT:
				cy = t - (n[l].bboxRoot.y1 - n[l].bboxAll.y1),
				this.moveSubtree(d, k[l].getTarget(), 0, cy, c + 1),
				n[l].bboxRoot.offset(0, cy),
				n[l].bboxAll.offset(0, cy)
			}
			m.bboxAll.union(n[l].bboxAll)
		}
		e = this.results.resultOrdering.layersOrdered;
		f = this.results.resultBalancing.layersBalanced;
		m.mxl = 0;
		m.mxu = 0;
		m.myl = 0;
		for (g = m.myu = 0; g < e[c].length; g++) if (e[c][g] == a) {
			switch (d.layoutOrientation) {
			case h.TOP_TO_BOTTOM:
				f[c][g].x = u + m.bboxRoot.getWidth() / 2;
				f[c][g].y = b.y + p.getHeight() / 2;
				break;
			case h.BOTTOM_TO_TOP:
				f[c][g].x = u + m.bboxRoot.getWidth() / 2;
				f[c][g].y = b.y - p.getHeight() / 2;
				break;
			case h.LEFT_TO_RIGHT:
				f[c][g].x = b.x + p.getWidth() / 2;
				f[c][g].y = u + m.bboxRoot.getHeight() / 2;
				break;
			case h.RIGHT_TO_LEFT:
				f[c][g].x = b.x - p.getWidth() / 2,
				f[c][g].y = u + m.bboxRoot.getHeight() / 2
			}
			m.bboxRoot.setCenter(f[c][g].x, f[c][g].y);
			m.bboxAll.union(m.bboxRoot);
			switch (d.layoutOrientation) {
			case h.TOP_TO_BOTTOM:
				m.mxl = 0;
				m.mxu = m.bboxAll.getWidth();
				m.myl = m.bboxRoot.y1 - m.bboxAll.y1;
				m.myu = m.bboxAll.y2 - m.bboxRoot.y2 + m.bboxRoot.getHeight();
				break;
			case h.BOTTOM_TO_TOP:
				m.mxl = 0;
				m.mxu = m.bboxAll.getWidth();
				m.myl = m.bboxRoot.y1 - m.bboxAll.y1 + m.bboxRoot.getHeight();
				m.myu = m.bboxAll.y2 - m.bboxRoot.y2;
				break;
			case h.LEFT_TO_RIGHT:
				m.mxl = m.bboxRoot.x1 - m.bboxAll.x1;
				m.mxu = m.bboxAll.x2 - m.bboxRoot.x2 + m.bboxRoot.getWidth();
				m.myl = 0;
				m.myu = m.bboxAll.getHeight();
				break;
			case h.RIGHT_TO_LEFT:
				m.mxl = m.bboxRoot.x1 - m.bboxAll.x1 + m.bboxRoot.getWidth(),
				m.mxu = m.bboxAll.x2 - m.bboxRoot.x2,
				m.myl = 0,
				m.myu = m.bboxAll.getHeight()
			}
			switch (d.layoutOrientation) {
			case h.TOP_TO_BOTTOM:
			case h.BOTTOM_TO_TOP:
				for (l = 0; l < Math.round(k.length / 2); l++) this.results.edgeInfo[k[l].getID()] = new ARAC.layout.model.EdgeInfo(ARAC.layout.model.EdgeDirection.Y, d.edgeType, d.edgeTypeDesc, void 0, d.edgeMapping());
				for (l = Math.round(k.length / 2); l < k.length; l++) this.results.edgeInfo[k[l].getID()] = new ARAC.layout.model.EdgeInfo(ARAC.layout.model.EdgeDirection.Y, d.edgeType, d.edgeTypeDesc, void 0, d.edgeMapping(), 0);
				break;
			case h.LEFT_TO_RIGHT:
			case h.RIGHT_TO_LEFT:
				for (l = 0; l < Math.round(k.length / 2); l++) this.results.edgeInfo[k[l].getID()] = new ARAC.layout.model.EdgeInfo(ARAC.layout.model.EdgeDirection.X, d.edgeType, d.edgeTypeDesc, void 0, d.edgeMapping());
				for (l = Math.round(k.length / 2); l < k.length; l++) this.results.edgeInfo[k[l].getID()] = new ARAC.layout.model.EdgeInfo(ARAC.layout.model.EdgeDirection.X, d.edgeType, d.edgeTypeDesc, void 0, d.edgeMapping(), 0)
			}
			q && (q.move(m.bboxRoot.getCenter(), this.results.mapCenters, this.mainConfig.recordResults), m.anx = q)
		}
		return m
	},
	balanceTreeHV: function(a, b, c, e, d, f, g) {
		var h = ARAC.layout.config.LayoutOrientation,
		k = ARAC.layout.config.ParentBalancing,
		q = a.getOutboundEdges(),
		p = a.getBBox(),
		r = new ARAC.Coord(b.x, b.y),
		m = {};
		f.push(a);
		m.bboxRoot = new ARAC.BBox;
		switch (d.layoutOrientation) {
		case h.TOP_TO_BOTTOM:
			m.bboxRoot.x1 = b.x - p.getWidth();
			m.bboxRoot.x2 = b.x;
			m.bboxRoot.y1 = b.y;
			m.bboxRoot.y2 = b.y + p.getHeight();
			switch (d.parentBalancing) {
			case k.HEAD:
			case k.MEDIAN:
				r.x += m.bboxRoot.getWidth() + d.layerDistance;
				break;
			case k.TAIL:
				r.x -= m.bboxRoot.getWidth() + d.layerDistance
			}
			r.y += m.bboxRoot.getHeight() + d.layerDistance;
			break;
		case h.BOTTOM_TO_TOP:
			m.bboxRoot.x1 = b.x;
			m.bboxRoot.x2 = b.x + p.getWidth();
			m.bboxRoot.y1 = b.y - p.getHeight();
			m.bboxRoot.y2 = b.y;
			switch (d.parentBalancing) {
			case k.HEAD:
			case k.MEDIAN:
				r.x += m.bboxRoot.getWidth() + d.layerDistance;
				break;
			case k.TAIL:
				r.x -= m.bboxRoot.getWidth() + d.layerDistance
			}
			r.y -= p.getHeight() + d.layerDistance;
			break;
		case h.LEFT_TO_RIGHT:
			m.bboxRoot.x1 = b.x - p.getWidth();
			m.bboxRoot.x2 = b.x;
			m.bboxRoot.y1 = b.y;
			m.bboxRoot.y2 = b.y + p.getHeight();
			r.x += p.getWidth() + d.layerDistance;
			switch (d.parentBalancing) {
			case k.HEAD:
			case k.MEDIAN:
				r.y += p.getHeight() + d.layerDistance;
				break;
			case k.TAIL:
				r.y -= p.getHeight() + d.layerDistance
			}
			break;
		case h.RIGHT_TO_LEFT:
			switch (m.bboxRoot.x1 = b.x - p.getWidth(), m.bboxRoot.x2 = b.x, m.bboxRoot.y1 = b.y, m.bboxRoot.y2 = b.y + p.getHeight(), r.x -= p.getWidth() + d.layerDistance, d.parentBalancing) {
			case k.HEAD:
			case k.MEDIAN:
				r.y += p.getHeight() + d.layerDistance;
				break;
			case k.TAIL:
				r.y -= p.getHeight() + d.layerDistance
			}
		}
		for (var l = this.results.resultOrdering.layersOrdered,
		s = this.results.resultBalancing.layersBalanced,
		n = 0; n < l[c].length; n++) if (l[c][n] == a) {
			switch (d.layoutOrientation) {
			case h.TOP_TO_BOTTOM:
				switch (d.parentBalancing) {
				case k.HEAD:
				case k.MEDIAN:
					s[c][n].x = b.x + p.getWidth() / 2;
					break;
				case k.TAIL:
					s[c][n].x = b.x - p.getWidth() / 2
				}
				s[c][n].y = b.y + p.getHeight() / 2;
				break;
			case h.BOTTOM_TO_TOP:
				switch (d.parentBalancing) {
				case k.HEAD:
				case k.MEDIAN:
					s[c][n].x = b.x + p.getWidth() / 2;
					break;
				case k.TAIL:
					s[c][n].x = b.x - p.getWidth() / 2
				}
				s[c][n].y = b.y - p.getHeight() / 2;
				break;
			case h.LEFT_TO_RIGHT:
				s[c][n].x = b.x + p.getWidth() / 2;
				switch (d.parentBalancing) {
				case k.HEAD:
				case k.MEDIAN:
					s[c][n].y = b.y + p.getHeight() / 2;
					break;
				case k.TAIL:
					s[c][n].y = b.y - p.getHeight() / 2
				}
				break;
			case h.RIGHT_TO_LEFT:
				switch (s[c][n].x = b.x - p.getWidth() / 2, d.parentBalancing) {
				case k.HEAD:
				case k.MEDIAN:
					s[c][n].y = b.y + p.getHeight() / 2;
					break;
				case k.TAIL:
					s[c][n].y = b.y - p.getHeight() / 2
				}
			}
			m.bboxRoot.setCenter(s[c][n].x, s[c][n].y);
			break
		}
		m.bboxAll = new ARAC.BBox(m.bboxRoot.x1, m.bboxRoot.y1, m.bboxRoot.x2, m.bboxRoot.y2);
		a = new ARAC.BBox(m.bboxRoot.x1, m.bboxRoot.y1, m.bboxRoot.x2, m.bboxRoot.y2);
		l = [];
		for (n = s = 2 < q.length ? Math.floor(q.length / 2) : q.length; n < q.length; n++) if (this.results.idmap[q[n].getTarget().getID()]) {
			g.push(q[n]);
			l[n] = this.balanceSubtree(q[n].getTarget(), r, c + 1, e + 1, f, g);
			switch (d.layoutOrientation) {
			case h.TOP_TO_BOTTOM:
				r.y = l[n].bboxAll.y2 + d.nodeDistance;
				this.results.edgeInfo[q[n].getID()] = new ARAC.layout.model.EdgeInfo(ARAC.layout.model.EdgeDirection.Y, d.edgeType, d.edgeTypeDesc, void 0, d.edgeMapping());
				break;
			case h.BOTTOM_TO_TOP:
				r.y = l[n].bboxAll.y1 - d.nodeDistance;
				this.results.edgeInfo[q[n].getID()] = new ARAC.layout.model.EdgeInfo(ARAC.layout.model.EdgeDirection.Y, d.edgeType, d.edgeTypeDesc, void 0, d.edgeMapping());
				break;
			case h.LEFT_TO_RIGHT:
				r.x = l[n].bboxAll.x2 + d.nodeDistance;
				this.results.edgeInfo[q[n].getID()] = new ARAC.layout.model.EdgeInfo(ARAC.layout.model.EdgeDirection.X, d.edgeType, d.edgeTypeDesc, void 0, d.edgeMapping());
				break;
			case h.RIGHT_TO_LEFT:
				r.x = l[n].bboxAll.x1 - d.nodeDistance,
				this.results.edgeInfo[q[n].getID()] = new ARAC.layout.model.EdgeInfo(ARAC.layout.model.EdgeDirection.X, d.edgeType, d.edgeTypeDesc, void 0, d.edgeMapping())
			}
			m.bboxAll.union(l[n].bboxAll);
			0 == n ? (a.x1 = l[n].bboxAll.x1, a.x2 = l[n].bboxAll.x2, a.y1 = l[n].bboxAll.y1, a.y2 = l[n].bboxAll.y2) : a.union(l[n].bboxAll)
		}
		switch (d.layoutOrientation) {
		case h.TOP_TO_BOTTOM:
			switch (d.parentBalancing) {
			case k.HEAD:
			case k.MEDIAN:
				r.x = s != q.length ? a.x2 + d.nodeDistance: b.x + p.getWidth() + d.layerDistance;
				break;
			case k.TAIL:
				r.x = s != q.length ? a.x1 - d.nodeDistance: b.x - p.getWidth() - d.layerDistance
			}
			r.y = b.y + p.getHeight() + d.layerDistance;
			break;
		case h.BOTTOM_TO_TOP:
			switch (d.parentBalancing) {
			case k.HEAD:
			case k.MEDIAN:
				r.x = s != q.length ? a.x2 + d.nodeDistance: b.x + p.getWidth() + d.layerDistance;
				break;
			case k.TAIL:
				r.x = s != q.length ? a.x1 - d.nodeDistance: b.x - p.getWidth() - d.layerDistance
			}
			r.y = b.y - p.getHeight() - d.layerDistance;
			break;
		case h.LEFT_TO_RIGHT:
			r.x = b.x + p.getWidth() + d.layerDistance;
			switch (d.parentBalancing) {
			case k.HEAD:
			case k.MEDIAN:
				r.y = s != q.length ? a.y2 + d.nodeDistance: b.y + p.getHeight() + d.layerDistance;
				break;
			case k.TAIL:
				r.y = s != q.length ? a.y1 - d.nodeDistance: b.y - p.getHeight() - d.layerDistance
			}
			break;
		case h.RIGHT_TO_LEFT:
			switch (r.x = b.x - p.getWidth() - d.layerDistance, d.parentBalancing) {
			case k.HEAD:
			case k.MEDIAN:
				r.y = s != q.length ? a.y2 + d.nodeDistance: b.y + p.getHeight() + d.layerDistance;
				break;
			case k.TAIL:
				r.y = s != q.length ? a.y1 - d.nodeDistance: b.y - p.getHeight() - d.layerDistance
			}
		}
		for (n = 0; n < s; n++) if (this.results.idmap[q[n].getTarget().getID()]) {
			g.push(q[n]);
			l[n] = this.balanceSubtree(q[n].getTarget(), r, c + 1, e + 1, f, g);
			switch (d.layoutOrientation) {
			case h.TOP_TO_BOTTOM:
				switch (d.parentBalancing) {
				case k.HEAD:
				case k.MEDIAN:
					r.x = l[n].bboxAll.x2 + d.nodeDistance;
					break;
				case k.TAIL:
					r.x = l[n].bboxAll.x1 - d.nodeDistance
				}
				s != q.length ? this.results.edgeInfo[q[n].getID()] = new ARAC.layout.model.EdgeInfo(ARAC.layout.model.EdgeDirection.X, d.edgeType, d.edgeTypeDesc, void 0, d.edgeMapping(), 0) : 0 == n ? this.results.edgeInfo[q[n].getID()] = new ARAC.layout.model.EdgeInfo(ARAC.layout.model.EdgeDirection.Y, d.edgeType, d.edgeTypeDesc, void 0, d.edgeMapping(), 0) : this.results.edgeInfo[q[n].getID()] = new ARAC.layout.model.EdgeInfo(ARAC.layout.model.EdgeDirection.X, d.edgeType, d.edgeTypeDesc, void 0, d.edgeMapping(), 0);
				break;
			case h.BOTTOM_TO_TOP:
				switch (d.parentBalancing) {
				case k.HEAD:
				case k.MEDIAN:
					r.x = l[n].bboxAll.x2 + d.nodeDistance;
					break;
				case k.TAIL:
					r.x = l[n].bboxAll.x1 - d.nodeDistance
				}
				s != q.length ? this.results.edgeInfo[q[n].getID()] = new ARAC.layout.model.EdgeInfo(ARAC.layout.model.EdgeDirection.X, d.edgeType, d.edgeTypeDesc, void 0, d.edgeMapping(), 0) : 0 == n ? this.results.edgeInfo[q[n].getID()] = new ARAC.layout.model.EdgeInfo(ARAC.layout.model.EdgeDirection.Y, d.edgeType, d.edgeTypeDesc, void 0, d.edgeMapping(), 0) : this.results.edgeInfo[q[n].getID()] = new ARAC.layout.model.EdgeInfo(ARAC.layout.model.EdgeDirection.X, d.edgeType, d.edgeTypeDesc, void 0, d.edgeMapping(), 0);
				break;
			case h.LEFT_TO_RIGHT:
				switch (d.parentBalancing) {
				case k.HEAD:
				case k.MEDIAN:
					r.y = l[n].bboxAll.y2 + d.nodeDistance;
					break;
				case k.TAIL:
					r.y = l[n].bboxAll.y1 - d.nodeDistance
				}
				s != q.length ? this.results.edgeInfo[q[n].getID()] = new ARAC.layout.model.EdgeInfo(ARAC.layout.model.EdgeDirection.Y, d.edgeType, d.edgeTypeDesc, void 0, d.edgeMapping(), 0) : 0 == n ? this.results.edgeInfo[q[n].getID()] = new ARAC.layout.model.EdgeInfo(ARAC.layout.model.EdgeDirection.X, d.edgeType, d.edgeTypeDesc, void 0, d.edgeMapping(), 0) : this.results.edgeInfo[q[n].getID()] = new ARAC.layout.model.EdgeInfo(ARAC.layout.model.EdgeDirection.Y, d.edgeType, d.edgeTypeDesc, void 0, d.edgeMapping(), 0);
				break;
			case h.RIGHT_TO_LEFT:
				switch (d.parentBalancing) {
				case k.HEAD:
				case k.MEDIAN:
					r.y = l[n].bboxAll.y2 + d.nodeDistance;
					break;
				case k.TAIL:
					r.y = l[n].bboxAll.y1 - d.nodeDistance
				}
				s != q.length ? this.results.edgeInfo[q[n].getID()] = new ARAC.layout.model.EdgeInfo(ARAC.layout.model.EdgeDirection.Y, d.edgeType, d.edgeTypeDesc, void 0, d.edgeMapping(), 0) : 0 == n ? this.results.edgeInfo[q[n].getID()] = new ARAC.layout.model.EdgeInfo(ARAC.layout.model.EdgeDirection.X, d.edgeType, d.edgeTypeDesc, void 0, d.edgeMapping(), 0) : this.results.edgeInfo[q[n].getID()] = new ARAC.layout.model.EdgeInfo(ARAC.layout.model.EdgeDirection.Y, d.edgeType, d.edgeTypeDesc, void 0, d.edgeMapping(), 0)
			}
			m.bboxAll.union(l[n].bboxAll)
		}
		m.mxl = 0;
		m.mxu = 0;
		m.myl = 0;
		m.myu = 0;
		return m
	},
	moveSubtree: function(a, b, c, e, d) {
		if (0 != c || 0 != e) {
			for (var f = b.getOutboundEdges(), g = 0; g < f.length; g++) if (this.results.idmap[f[g].getTarget().getID()] && a.isNode(f[g].getTarget())) {
				this.moveSubtree(a, f[g].getTarget(), c, e, d + 1);
				var h = this.results.edgeInfo[f[g].getID()].coords;
				if (null != h) for (var k = 0; k < h.length; k++) h[k].x += c,
				h[k].y += e
			}
			a = this.results.resultOrdering.layersOrdered;
			f = this.results.resultBalancing.layersBalanced;
			for (k = 0; k < a[d].length; k++) a[d][k] == b && (f[d][k].x += c, f[d][k].y += e)
		}
	}
});
ARAC.layout.tree.TreeLayoutConfig = function(a) {
	ARAC.layout.tree.TreeLayoutConfig._superInit.call(this, "tree", a);
	this.parentBalancing = a && a.parentBalancing || ARAC.layout.config.ParentBalancing.MEDIAN;
	this.treeStyle = a && a.treeStyle || ARAC.layout.config.TreeStyle.TREE_NORMAL;
	this.levelDescriptor = null;
	if (a && a.levelDescriptor) {
		this.levelDescriptor = [];
		for (var b = 0; b < a.levelDescriptor.length; b++) this.levelDescriptor[b] = a.levelDescriptor[b].copy()
	}
	this.nodeDescriptor = null;
	if (a && a.nodeDescriptor) for (this.nodeDescriptor = {},
	b = 0; b < a.nodeDescriptor.length; b++) this.nodeDescriptor[a.nodeDescriptor[b].tag] = a.nodeDescriptor[b].copy()
};
ARAC.inherit(ARAC.layout.tree.TreeLayoutConfig, ARAC.layout.config.NLConfigHVLayerBased, {
	hasNDesc: function(a) {
		if (!this.nodeDescriptor) return ! 1;
		a = a.getTags();
		var b;
		for (b = 0; b < a.length; b++) if (this.nodeDescriptor[a[b]] && !this.nodeDescriptor[a[b]].subsequent) return ! 0;
		return ! 1
	},
	copy: function() {
		return new ARAC.layout.tree.TreeLayoutConfig(this)
	},
	fromXML: function(a, b) {
		ARAC.layout.tree.TreeLayoutConfig._super.fromXML.call(this, a, b);
		var c = a.getAttribute("parentBalancing");
		c && (this.parentBalancing = ARAC.layout.config.ParentBalancing.fromString(c));
		if (c = a.getAttribute("treeStyle")) this.treeStyle = ARAC.layout.config.TreeStyle.fromString(c);
		var e = a.getElementsByTagName("treelevel");
		if (null != e && 0 < e.length) for (this.levelDescriptor = [], c = 0; c < e.length; c++) {
			var d = new ARAC.layout.tree.TreeLayoutConfig;
			d.fromXML(e[c], b);
			this.levelDescriptor[c] = new ARAC.layout.tree.TreeLevelConfig(parseInt(e[c].getAttribute("level")), d)
		} else this.levelDescriptor = null;
		e = a.getElementsByTagName("node");
		if (null != e && 0 < e.length) for (this.nodeDescriptor = {},
		c = 0; c < e.length; c++) {
			var d = new ARAC.layout.tree.TreeLayoutConfig,
			f = e[c].getAttribute("tag"),
			g = e[c].getAttribute("subsequent");
			d.fromXML(e[c], b);
			this.nodeDescriptor[f] = new ARAC.layout.tree.TreeNodeConfig(f, g && "false" == g ? !1 : !0, d)
		} else this.nodeDescriptor = null
	},
	toXML: function(a, b) { (void 0 == b || b) && a.writeStartElement("tree");
		ARAC.layout.tree.TreeLayoutConfig._super.toXML.call(this, a);
		a.writeAttributeString("parentBalancing", ARAC.layout.config.ParentBalancing.toString(this.parentBalancing));
		a.writeAttributeString("treeStyle", ARAC.layout.config.TreeStyle.toString(this.treeStyle));
		if (this.levelDescriptor && 0 < this.levelDescriptor.length) for (var c = 0; c < this.levelDescriptor.lengt; c++) this.levelDescriptor[c].toXML(a);
		if (this.nodeDescriptor) for (var e in this.nodeDescriptor) this.nodeDescriptor[e].toXML(a); (void 0 == b || b) && a.writeEndElement("tree")
	},
	generateName: function() {
		var a = this.generateConfigName(this);
		if (void 0 != this.levelDescriptor && 0 < this.levelDescriptor.length) for (var b = 0; b < this.levelDescriptor.length; b++) a += "-L" + this.levelDescriptor[b].level,
		a += "_" + this.generateConfigName(this.levelDescriptor[b].config);
		return a
	},
	generateConfigName: function(a) {
		var b = ARAC.layout.config.TreeStyle,
		c = ARAC.layout.config.LayoutOrientation,
		e = ARAC.layout.config.ParentBalancing,
		d = "";
		switch (a.parentBalancing) {
		case e.HEAD:
			d = "-Head";
			break;
		case e.MEDIAN:
			d = "-Median";
			break;
		case e.TAIL:
			d = "-Tail"
		}
		e = "";
		switch (a.treeStyle) {
		case b.TREE_NORMAL:
			switch (a.layoutOrientation) {
			case c.TOP_TO_BOTTOM:
				e = "TreeNormal-TTB" + d;
				break;
			case c.BOTTOM_TO_TOP:
				e = "TreeNormal-BTT" + d;
				break;
			case c.LEFT_TO_RIGHT:
				e = "TreeNormal-LTR" + d;
				break;
			case c.RIGHT_TO_LEFT:
				e = "TreeNormal-RTL" + d;
				break;
			default:
				e = "TreeNormal-..." + d
			}
			break;
		case b.TREE_LIST_SINGLE:
			switch (a.layoutOrientation) {
			case c.TOP_TO_BOTTOM:
				e = "TreeListS-TTB" + d;
				break;
			case c.BOTTOM_TO_TOP:
				e = "TreeListS-BTT" + d;
				break;
			case c.LEFT_TO_RIGHT:
				e = "TreeListS-LTR" + d;
				break;
			case c.RIGHT_TO_LEFT:
				e = "TreeListS-RTL" + d;
				break;
			default:
				e = "TreeListS-..." + d
			}
			break;
		case b.TREE_LIST_DOUBLE:
			switch (a.layoutOrientation) {
			case c.TOP_TO_BOTTOM:
				e = "TreeListD-TTB";
				break;
			case c.BOTTOM_TO_TOP:
				e = "TreeListD-BTT";
				break;
			case c.LEFT_TO_RIGHT:
				e = "TreeListD-LTR";
				break;
			case c.RIGHT_TO_LEFT:
				e = "TreeListD-RTL";
				break;
			default:
				e = "TreeListD-..."
			}
			break;
		case b.TREE_HV:
			switch (a.layoutOrientation) {
			case c.TOP_TO_BOTTOM:
				e = "TreeHV-TTB" + d;
				break;
			case c.BOTTOM_TO_TOP:
				e = "TreeHV-BTT" + d;
				break;
			case c.LEFT_TO_RIGHT:
				e = "TreeHV-LTR" + d;
				break;
			case c.RIGHT_TO_LEFT:
				e = "TreeHV-RTL" + d;
				break;
			default:
				e = "TreeHV-..." + d
			}
		}
		return e
	}
});
ARAC.layout.tree.TreeLevelConfig = function(a, b) {
	this.level = a;
	this.config = b
};
ARAC.layout.tree.TreeLevelConfig.prototype = {
	copy: function() {
		return new ARAC.layout.tree.TreeLevelConfig(this.level, this.config.copy())
	},
	toXML: function(a) {
		a.writeStartElement("treelevel");
		a.writeAttributeNumber("level", this.level);
		this.config.toXML(a, !1);
		a.writeEndElement("treelevel")
	}
};
ARAC.layout.tree.TreeNodeConfig = function(a, b, c) {
	this.ntag = a;
	this.subsequent = b;
	this.config = c
};
ARAC.layout.tree.TreeNodeConfig.prototype = {
	copy: function() {
		return new ARAC.layout.tree.TreeNodeConfig(this.ntag, this.config.copy())
	},
	toXML: function(a) {
		a.writeStartElement("node");
		a.writeAttributeString("tag", this.ntag);
		a.writeAttributeBoolean("subsequent", this.subsequent);
		this.config.toXML(a, !1);
		a.writeEndElement("node")
	}
};
ARAC.namespace("ARAC.layout.flow");
ARAC.layout.flow.FlowLayout = function() {
	ARAC.layout.flow.FlowLayout._superInit.call(this)
};
ARAC.inherit(ARAC.layout.flow.FlowLayout, ARAC.layout.model.NodeLayout);
ARAC.layout.flow.FlowLayout.prototype.apply = function(a, b, c, e) {
	e && e.startLayout();
	this.config = c;
	var d = this.filterTags(b.getNodes(), c);
	this.results = a;
	this.results.mapCenters = {};
	this.results.resultReturns = (new ARAC.layout.tools.ACyclicGraph).apply(d);
	this.results.resultToposort = (new ARAC.layout.tools.TopologicalSort).apply(d);
	if (this.results.resultToposort && this.results.resultToposort.acyclic) {
		this.results.resultLayering = (new ARAC.layout.tools.TopoSortLayering).apply(this.results.resultToposort);
		this.config.submitIntermediateResults && this.submitResults(d, b.getEdges(), c);
		this.results.resultProperGraph = (new ARAC.layout.tools.ProperGraph).apply(b, this.results.resultLayering);
		this.config.submitIntermediateResults && this.submitResults(d, b.getEdges(), c);
		this.results.resultOrdering = (new ARAC.layout.tools.BarycenterSequencer).apply(this.results.resultLayering);
		this.config.submitIntermediateResults && this.submitResults(d, b.getEdges(), c);
		this.balanceLayers(b);
		this.submitResults(d, b.getEdges(), c);
		this.positionNodes(c);
		this.results.edgeInfo = {};
		a = b.getEdges();
		for (var f = 0; f < a.length; f++) if (ARAC.core.arrayFind(d, a[f].getSource()) && ARAC.core.arrayFind(d, a[f].getTarget())) switch (c.layoutOrientation) {
		case ARAC.layout.config.LayoutOrientation.TOP_TO_BOTTOM:
		case ARAC.layout.config.LayoutOrientation.BOTTOM_TO_TOP:
			this.results.edgeInfo[a[f].getID()] = new ARAC.layout.model.EdgeInfo(ARAC.layout.model.EdgeDirection.Y, c.edgeType, c.edgeTypeDesc, void 0, c.edgeMapping());
			break;
		case ARAC.layout.config.LayoutOrientation.LEFT_TO_RIGHT:
		case ARAC.layout.config.LayoutOrientation.RIGHT_TO_LEFT:
			this.results.edgeInfo[a[f].getID()] = new ARAC.layout.model.EdgeInfo(ARAC.layout.model.EdgeDirection.X, c.edgeType, c.edgeTypeDesc, void 0, c.edgeMapping())
		}
		this.submitResults(d, b.getEdges(), c, !1)
	}
	e && e.stopLayout();
	delete this.config
};
ARAC.layout.flow.FlowLayout.prototype.submitResults = function(a, b, c, e) {
	void 0 == e && (e = !0);
	b = this.results.mapCenters;
	for (var d = this.results.mapBBox,
	f = 0; f < a.length; f++) b[a[f].getID()] = a[f].getCenter();
	this.submitLayering(c);
	this.submitOrdering(c);
	this.submitBalancing(c); ! 1 == e && this.applyLayoutOrigin(a, c);
	if (!c.recordResults) for (f = 0; f < a.length; f++) c = null != d ? d[a[f].getID()] : null,
	null != c ? a[f].setBBox(c) : a[f].setCenter(b[a[f].getID()]);
	null != this.config && null != this.config.resultUpdate && this.config.resultUpdate.update()
};
ARAC.layout.flow.FlowLayout.prototype.positionNodes = function(a) {
	var b = this.results.resultOrdering.layersOrdered,
	c = this.results.resultBalancing.layersBalanced;
	this.results.mapBBox = {};
	for (var e = [], d = {},
	f = 0; f < b.length; f++) for (var g = e[f] = 0; g < b[f].length; g++) {
		var h = b[f][g].getBBox();
		switch (a.layoutOrientation) {
		case ARAC.layout.config.LayoutOrientation.TOP_TO_BOTTOM:
		case ARAC.layout.config.LayoutOrientation.BOTTOM_TO_TOP:
			e[f] = Math.max(e[f], h.getHeight());
			d[c[f][g].coord] = void 0 == d[c[f][g].coord] ? h.getWidth() : Math.max(d[c[f][g].coord], h.getWidth());
			break;
		case ARAC.layout.config.LayoutOrientation.LEFT_TO_RIGHT:
		case ARAC.layout.config.LayoutOrientation.RIGHT_TO_LEFT:
			e[f] = Math.max(e[f], h.getWidth()),
			d[c[f][g].coord] = void 0 == d[c[f][g].coord] ? h.getHeight() : Math.max(d[c[f][g].coord], h.getHeight())
		}
	}
	var k = 0,
	q = {},
	g = [],
	p;
	for (p in d) ARAC.core.arrayFind(g, p) || g.push(p);
	g.sort(ARAC.core.arraySortNumberAs);
	for (f = 0; f < g.length; f++) q[g[f]] = k,
	k += d[g[f]],
	k += a.nodeDistance;
	for (f = k = 0; f < b.length; f++) {
		for (g = 0; g < b[f].length; g++) switch (h = b[f][g].getBBox(), a.layoutOrientation) {
		case ARAC.layout.config.LayoutOrientation.TOP_TO_BOTTOM:
			p = q[c[f][g].coord];
			p += d[c[f][g].coord] / 2;
			p -= h.getWidth() / 2;
			this.results.mapBBox[b[f][g].getID()] = new ARAC.BBox(p, k + e[f] / 2 - h.getHeight() / 2, p + h.getWidth(), k + e[f] / 2 - h.getHeight() / 2 + h.getHeight());
			break;
		case ARAC.layout.config.LayoutOrientation.BOTTOM_TO_TOP:
			p = q[c[f][g].coord];
			p += d[c[f][g].coord] / 2;
			p -= h.getWidth() / 2;
			this.results.mapBBox[b[f][g].getID()] = new ARAC.BBox(p, k - e[f] / 2 - h.getHeight() / 2, p + h.getWidth(), k - e[f] / 2 - h.getHeight() / 2 + h.getHeight());
			break;
		case ARAC.layout.config.LayoutOrientation.LEFT_TO_RIGHT:
			p = q[c[f][g].coord];
			p += d[c[f][g].coord] / 2;
			p -= h.getHeight() / 2;
			this.results.mapBBox[b[f][g].getID()] = new ARAC.BBox(k + e[f] / 2 - h.getWidth() / 2, p, k + e[f] / 2 - h.getWidth() / 2 + h.getWidth(), p + h.getHeight());
			break;
		case ARAC.layout.config.LayoutOrientation.RIGHT_TO_LEFT:
			p = q[c[f][g].coord],
			p += d[c[f][g].coord] / 2,
			p -= h.getHeight() / 2,
			this.results.mapBBox[b[f][g].getID()] = new ARAC.BBox(k - e[f] / 2 - h.getWidth() / 2, p, k - e[f] / 2 - h.getWidth() / 2 + h.getWidth(), p + h.getHeight())
		}
		switch (a.layoutOrientation) {
		case ARAC.layout.config.LayoutOrientation.TOP_TO_BOTTOM:
		case ARAC.layout.config.LayoutOrientation.LEFT_TO_RIGHT:
			k += e[f];
			k += a.layerDistance;
			break;
		case ARAC.layout.config.LayoutOrientation.BOTTOM_TO_TOP:
		case ARAC.layout.config.LayoutOrientation.RIGHT_TO_LEFT:
			k -= e[f],
			k -= a.layerDistance
		}
	}
};
ARAC.layout.flow.FlowLayout.prototype.balanceLayers = function(a) {
	var b = this.results.resultOrdering.layersOrdered;
	this.results.resultBalancing = {};
	this.results.resultBalancing.layersBalanced = Array(b.length);
	var c = ARAC.layout.config.PathBalancing,
	e = this.results.resultBalancing.layersBalanced;
	switch (this.config.pathBalancing) {
	case c.BALANCE_NORMAL:
		c = [];
		break;
	case c.BALANCE_LONGEST_PATH:
		c = this.results.resultOrdering.longestPaths();
		break;
	case c.BALANCE_SHORTEST_PATH:
		c = this.results.resultOrdering.shortestPaths();
		break;
	default:
		c = []
	}
	for (var d = 0; d < b.length; d++) {
		e[d] = Array(b[d].length);
		for (var f = 0; f < b[d].length; f++) {
			e[d][f] = {};
			e[d][f].coord = f + 1;
			e[d][f].inDeg = b[d][f].getIndegree();
			e[d][f].outDeg = b[d][f].getOutdegree();
			e[d][f].oneToOne = !b[d][f].dummy && 1 == e[d][f].inDeg && 1 == e[d][f].outDeg;
			var g = this.isBackbone(c, b[d][f]);
			e[d][f].prioUp = g ? 2E5: b[d][f].dummy || e[d][f].oneToOne ? 1E5: 100 + b[d][f].getIndegree();
			e[d][f].prioDown = g ? 2E5: b[d][f].dummy || e[d][f].oneToOne ? 1E5: b[d][f].getOutdegree()
		}
	}
	this.balanceLayersCalculateBaryCenters(c);
	this.balanceLayersSink(a, c, !0, 200001);
	this.balanceLayersSink(a, c, !1, 200001);
	this.balanceLayersStraightenEdges(a, c, 1E5);
	this.config.submitIntermediateResults && this.submitResults(a.getNodes(), a.getEdges(), this.config)
};
ARAC.layout.flow.FlowLayout.prototype.balanceLayersSink = function(a, b, c, e) {
	var d = this.results.resultOrdering.layersOrdered,
	f = this.results.resultBalancing.layersBalanced;
	if (c) for (c = 1; c < f.length; c++) {
		for (var g = this.orderByPrio(f[c], !0, e), h = 0; h < g.length; h++) for (var k = f[c].length - 1; 0 <= k; k--) if (f[c][k].prioUp == g[h] && f[c][k].prioUp <= e && (f[c][k].inDeg >= f[c][k].outDeg || this.isBackbone(b, d[c][k]))) {
			var q = f[c][k].baryUp - f[c][k].coord;
			0 < q && this._moveToRight(q, c, k, !0);
			this.config.submitIntermediateResults && this.submitResults(a.getNodes(), a.getEdges(), this.config)
		}
		this.balanceLayersCalculateSingleLayerBaryCenters(b, c);
		this.config.submitIntermediateResults && this.submitResults(a.getNodes(), a.getEdges(), this.config)
	} else for (c = f.length - 2; 0 <= c; c--) {
		g = this.orderByPrio(f[c], !1, e);
		for (h = 0; h < g.length; h++) for (k = f[c].length - 1; 0 <= k; k--) f[c][k].prioDown == g[h] && (f[c][k].prioDown <= e && (f[c][k].outDeg >= f[c][k].inDeg || this.isBackbone(b, d[c][k]))) && (q = f[c][k].baryDown - f[c][k].coord, 0 < q && this._moveToRight(q, c, k, !1), this.config.submitIntermediateResults && this.submitResults(a.getNodes(), a.getEdges(), this.config));
		this.balanceLayersCalculateSingleLayerBaryCenters(b, c);
		this.config.submitIntermediateResults && this.submitResults(a.getNodes(), a.getEdges(), this.config)
	}
};
ARAC.layout.flow.FlowLayout.prototype.balanceLayersStraightenEdges = function(a, b, c) {
	for (var e = this.results.resultOrdering.layersOrdered,
	d = this.results.resultBalancing.layersBalanced,
	f = 1; f < d.length; f++) {
		for (var g = 0; g < d[f].length; g++) if (d[f][g].prioUp != c || d[f][g].oneToOne) d[f][g].prioUp < c && (!d[f][g].oneToOne && 101 < d[f][g].prioUp && !this.isBackbone(b, e[f][g])) && (h = d[f][g].baryUp - d[f][g].coord, 0 < h ? this._moveToRight(h, f, g, !0) && (g = -1) : 0 > h && this._moveToLeft(h, f, g, !0), this.config.submitIntermediateResults && this.submitResults(a.getNodes(), a.getEdges(), this.config));
		else {
			var h = d[f][g].baryUp - d[f][g].coord;
			0 < h ? this._moveToRight(h, f, g, !0, !0) && (g = -1) : 0 > h && this._moveToLeft(h, f, g, !0, !0);
			this.config.submitIntermediateResults && this.submitResults(a.getNodes(), a.getEdges(), this.config)
		}
		this.balanceLayersCalculateSingleLayerBaryCenters(b, f)
	}
};
ARAC.layout.flow.FlowLayout.prototype.orderByPrio = function(a, b, c) {
	for (var e = [], d = 0; d < a.length; d++) {
		var f = b ? a[d].prioUp: a[d].prioDown; ! ARAC.core.arrayFind(e, f) && f <= c && e.push(f)
	}
	e.sort(ARAC.core.arraySortNumberDs);
	return e
};
ARAC.layout.flow.FlowLayout.prototype.balanceLayersCalculateBaryCenters = function(a) {
	for (var b = this.results.resultOrdering.layersOrdered,
	c = this.results.resultBalancing.layersBalanced,
	e = 0; e < b.length; e++) for (var d = 0; d < b[e].length; d++) {
		var f = [b[e][d]];
		if (0 < e) for (var g = 0; g < b[e - 1].length; g++) {
			var h = b[e - 1][g].getOutboundNodes();
			if (ARAC.core.arrayFind(h, b[e][d])) {
				f = h;
				f.sort(function(a, c) {
					return ARAC.core.arrayIndexOf(b[e], a) - ARAC.core.arrayIndexOf(b[e], c)
				});
				break
			}
		}
		g = this.balanceLayersCalculateSingleBaryCenter(a, c[e][d], b[e][d].getInboundNodes());
		1 < f.length && !this.isBackbone(a, b[e][d]) && (g -= Math.round((f.length - 1) / 2), g += ARAC.core.arrayIndexOf(f, b[e][d]));
		c[e][d].baryUp = g;
		f = [b[e][d]];
		if (e < b.length - 1) for (g = 0; g < b[e + 1].length; g++) if (h = b[e + 1][g].getInboundNodes(), ARAC.core.arrayFind(h, b[e][d])) {
			f = h;
			f.sort(function(a, c) {
				return ARAC.core.arrayIndexOf(b[e], a) - ARAC.core.arrayIndexOf(b[e], c)
			});
			break
		}
		g = this.balanceLayersCalculateSingleBaryCenter(a, c[e][d], b[e][d].getOutboundNodes());
		1 < f.length && !this.isBackbone(a, b[e][d]) && (g -= Math.round((f.length - 1) / 2), g += ARAC.core.arrayIndexOf(f, b[e][d]));
		c[e][d].baryDown = g
	}
};
ARAC.layout.flow.FlowLayout.prototype.balanceLayersCalculateSingleLayerBaryCenters = function(a, b) {
	var c = this.results.resultOrdering.layersOrdered,
	e = this.results.resultBalancing.layersBalanced;
	if (0 <= b - 1) for (var d = 0; d < c[b - 1].length; d++) {
		for (var f = [c[b - 1][d]], g = 0; g < c[b].length; g++) {
			var h = c[b][g].getInboundNodes();
			if (ARAC.core.arrayFind(h, c[b - 1][d])) {
				f = h;
				f.sort(function(a, d) {
					return ARAC.core.arrayIndexOf(c[b - 1], a) - ARAC.core.arrayIndexOf(c[b - 1], d)
				});
				break
			}
		}
		g = this.balanceLayersCalculateSingleBaryCenter(a, e[b - 1][d], c[b - 1][d].getOutboundNodes());
		1 < f.length && !this.isBackbone(a, c[b - 1][d]) && (g -= Math.round((f.length - 1) / 2), g += ARAC.core.arrayIndexOf(f, c[b - 1][d]));
		e[b - 1][d].baryDown = g
	}
	if (b + 1 < c.length) for (d = 0; d < c[b + 1].length; d++) {
		f = [c[b + 1][d]];
		for (g = 0; g < c[b].length; g++) if (h = c[b][g].getOutboundNodes(), ARAC.core.arrayFind(h, c[b + 1][d])) {
			f = h;
			f.sort(function(a, d) {
				return ARAC.core.arrayIndexOf(c[b + 1], a) - ARAC.core.arrayIndexOf(c[b + 1], d)
			});
			break
		}
		g = this.balanceLayersCalculateSingleBaryCenter(a, e[b + 1][d], c[b + 1][d].getInboundNodes());
		1 < f.length && !this.isBackbone(a, c[b + 1][d]) && (g -= Math.round((f.length - 1) / 2), g += ARAC.core.arrayIndexOf(f, c[b + 1][d]));
		e[b + 1][d].baryUp = g
	}
};
ARAC.layout.flow.FlowLayout.prototype.balanceLayersCalculateSingleBaryCenter = function(a, b, c) {
	for (var e = this.results.resultBalancing.layersBalanced,
	d = 0,
	f = 0,
	g = 0,
	h = 0; h < c.length; h++) {
		var k = this.results.resultOrdering.indexOf(c[h]);
		0 <= k.layer && 0 <= k.idx && (this.isBackbone(a, c[h]) ? (g += e[k.layer][k.idx].coord, d++) : f += e[k.layer][k.idx].coord)
	}
	return 0 < c.length ? 0 < d ? Math.floor(g / d) : Math.floor(f / c.length) : b.coord
};
ARAC.layout.flow.FlowLayout.prototype.isBackbone = function(a, b) {
	for (var c = !1,
	e = 0; e < a.length && !c; e++) c = ARAC.core.arrayFind(a[e], b);
	return c
};
ARAC.layout.flow.FlowLayout.prototype._moveToLeft = function(a, b, c, e, d) {
	for (var f = this.results.resultBalancing.layersBalanced,
	g = -1,
	h = [], k = f[b][c].coord, q = c - 1; 0 <= q && 0 > g && !(f[b][q].coord < f[b][c].coord + a - h.length); q--)(e ? d ? f[b][q].prioUp > f[b][c].prioUp: f[b][q].prioUp >= f[b][c].prioUp: d ? f[b][q].prioDown > f[b][c].prioDown: f[b][q].prioDown >= f[b][c].prioDown) ? g = q: h.push(q);
	if (0 <= g) if (0 < h.length) {
		a = f[b][g].coord + 1;
		for (e = h.length - 1; 0 <= e; e--) f[b][h[e]].coord = a,
		a++;
		f[b][c].coord = a
	} else f[b][c].coord = f[b][g].coord + 1;
	else if (0 < h.length) for (f[b][c].coord += a, a = f[b][c].coord - 1, e = 0; e < h.length; e++) f[b][h[e]].coord = a,
	a--;
	else f[b][c].coord += a;
	return k != f[b][c].coord
};
ARAC.layout.flow.FlowLayout.prototype._moveToRight = function(a, b, c, e, d) {
	d = this.results.resultBalancing.layersBalanced;
	for (var f = -1,
	g = [], h = d[b][c].coord, k = c + 1; k < d[b].length && 0 > f && !(d[b][k].coord > d[b][c].coord + a + g.length); k++)(e ? d[b][k].prioUp > d[b][c].prioUp: d[b][k].prioDown > d[b][c].prioDown) ? f = k: g.push(k);
	if (0 <= f) if (0 < g.length) {
		a = d[b][f].coord - 1;
		for (e = g.length - 1; 0 <= e; e--) d[b][g[e]].coord = a,
		a--;
		d[b][c].coord = a
	} else d[b][c].coord = d[b][f].coord - 1;
	else if (0 < g.length) for (d[b][c].coord += a, a = d[b][c].coord + 1, e = 0; e < g.length; e++) d[b][g[e]].coord = a,
	a++;
	else d[b][c].coord += a;
	return h != d[b][c].coord
};
ARAC.layout.flow.FlowLayoutConfig = function(a) {
	ARAC.layout.flow.FlowLayoutConfig._superInit.call(this, "flow", a);
	this.pathBalancing = a && a.pathBalancing || ARAC.layout.config.PathBalancing.BALANCE_NORMAL
};
ARAC.inherit(ARAC.layout.flow.FlowLayoutConfig, ARAC.layout.config.NLConfigHVLayerBased, {
	copy: function() {
		return new ARAC.layout.flow.FlowLayoutConfig(this)
	},
	fromXML: function(a, b) {
		ARAC.layout.flow.FlowLayoutConfig._super.fromXML.call(this, a, b);
		var c = a.getAttribute("pathBalancing");
		c && (this.pathBalancing = ARAC.layout.config.PathBalancing.fromString(c))
	},
	toXML: function(a) {
		a.writeStartElement("flow");
		ARAC.layout.flow.FlowLayoutConfig._super.toXML.call(this, a);
		a.writeAttributeString("pathBalancing", ARAC.layout.config.PathBalancing.toString(this.pathBalancing));
		a.writeEndElement("flow")
	},
	generateName: function() {
		var a = "Flow";
		switch (this.layoutOrientation) {
		case ARAC.layout.config.LayoutOrientation.TOP_TO_BOTTOM:
			a += "-TTB";
			break;
		case ARAC.layout.config.LayoutOrientation.BOTTOM_TO_TOP:
			a += "-BTT";
			break;
		case ARAC.layout.config.LayoutOrientation.LEFT_TO_RIGHT:
			a += "-LTR";
			break;
		case ARAC.layout.config.LayoutOrientation.RIGHT_TO_LEFT:
			a += "-RTL";
			break;
		default:
			a += "-..."
		}
		switch (this.pathBalancing) {
		case ARAC.layout.config.PathBalancing.BALANCE_NORMAL:
			a += "-Normal";
			break;
		case ARAC.layout.config.PathBalancing.BALANCE_LONGEST_PATH:
			a += "-LongestPath";
			break;
		case ARAC.layout.config.PathBalancing.BALANCE_SHORTEST_PATH:
			a += "-ShortestPath";
			break;
		default:
			a += "-..."
		}
		return a
	}
});
ARAC.namespace("ARAC.layout.edge");
ARAC.layout.edge.Simple = function(a, b) {
	ARAC.layout.edge.Simple._superInit.call(this, a, b ? b: new ARAC.layout.edge.SimpleConfig)
};
ARAC.inherit(ARAC.layout.edge.Simple, ARAC.layout.model.EdgeLayout, {
	apply: function(a, b, c, e) {
		e && e.startLayout();
		null != b && (this.lgraph = b);
		null != c && (this.config = c);
		this.results = a;
		for (var d = this.results.mapCenters,
		f = this.results.mapBBox,
		g = this.lgraph.getEdges(), h = [], k = 0; k < g.length; k++) if (!ARAC.core.arrayFind(h, g[k])) {
			var q = null;
			this.results.resultProperGraph && (q = this.results.resultProperGraph.find(g[k]));
			if (null != q && null != q.path) {
				var p = this.results.edgeInfo ? this.results.edgeInfo[g[k].getID()] : null;
				if (a.isReturnEdge(q.path.edge)) {
					var r = q.getCoordinates();
					r.reverse();
					q.path.edge.setCoordinatesArr(this._routeEdgePoly(q.path.edge, p, r))
				} else q.path.edge.setCoordinatesArr(this._routeEdgePoly(q.path.edge, p, q.getCoordinates()));
				h = h.concat(q.path.edges)
			} else {
				if (r = (p = this.results.edgeInfo ? this.results.edgeInfo[g[k].getID()] : null) ? p.coords: null) a.isReturnEdge(g[k]) && r.reverse(),
				2 == r.length && (r = this._routeEdge(g[k], p, new ARAC.BBoxOp.fromCoord(r[0]), new ARAC.BBoxOp.fromCoord(r[1])));
				else {
					var m = g[k].getSource(),
					q = g[k].getTarget(),
					l = null != f ? f[m.getID()] : null,
					s = null != f ? f[q.getID()] : null;
					null != l && null != s ? r = a.isReturnEdge(g[k]) ? this._routeEdge(g[k], p, s, l) : this._routeEdge(g[k], p, l, s) : (s = d[m.getID()], l = d[q.getID()], null != s && null != l && (r = m.getBBox(), r.setCenter(s.x, s.y), q = q.getBBox(), q.setCenter(l.x, l.y), r = a.isReturnEdge(g[k]) ? this._routeEdge(g[k], p, q, r) : this._routeEdge(g[k], p, r, q)))
				}
				r && g[k].setCoordinatesArr(r)
			}
		}
		null != b && (this.lgraph = null);
		null != c && (this.config = null);
		e && e.stopLayout()
	},
	_routeEdge: function(a, b, c, e) {
		var d = b ? b.findConfig() : void 0,
		f = b && b.edgeMapping ? b.edgeMapping.applySource(a, d) : a.getSourcePort(),
		g = b && b.edgeMapping ? b.edgeMapping.applyTarget(a, d) : a.getTargetPort(),
		h = null != f ? f.getCoord() : c.getCenter(),
		k = null != g ? g.getCoord() : e.getCenter();
		null != f && (h.x += c.x1, h.y += c.y1);
		null != g && (k.x += e.x1, k.y += e.y1);
		if (!b) return [h, k];
		f = d && void 0 != d.edgeType ? d.edgeType: b.type;
		d = d && void 0 != d.edgeTypeDesc ? d.edgeTypeDesc: b.typeDesc;
		g = ARAC.layout.config.EdgeType;
		a.setType(f, d);
		switch (f) {
		default:
		case g.STRAIGHT:
			return [h, k];
		case g.ELBOW:
			return ARAC.layout.tools.edgetools.dBow(h, k, c, e, b.direction, d);
		case g.ORTHOGONAL:
			return ARAC.layout.tools.edgetools.dOrthC(h, k, b.direction, d)
		}
	},
	_routeEdgePoly: function(a, b, c) {
		var e = b ? b.findConfig() : void 0,
		d = b && b.edgeMapping ? b.edgeMapping.applySource(a, e) : a.getSourcePort(),
		f = b && b.edgeMapping ? b.edgeMapping.applyTarget(a, e) : a.getTargetPort(),
		g = null != d ? d.getCoord() : c[0],
		h = null != f ? f.getCoord() : c[c.length - 1];
		null != d && (d = a.getSource().getBBox(), g.x += d.x1, g.y += d.y1);
		null != f && (f = a.getTarget().getBBox(), h.x += f.x1, h.y += f.y1);
		if (!b) return ARAC.layout.tools.edgetools.removeNeedlessPts(c, 25);
		h = b.edgeMapping && b.edgeMapping.edgeType ? b.edgeMapping.edgeType: b.type;
		e = e && void 0 != e.edgeTypeDesc ? e.edgeTypeDesc: b.typeDesc;
		f = ARAC.layout.config.EdgeType;
		a.setType(h, e);
		switch (h) {
		default:
		case f.STRAIGHT:
			return ARAC.layout.tools.edgetools.removeNeedlessPts(c, 25);
		case f.ELBOW:
			a = [];
			for (h = 0; h < c.length - 2; h++) a[h] = c[h];
			a = a.concat(ARAC.layout.tools.edgetools.dBow(c[c.length - 2], c[c.length - 1], void 0, void 0, b.direction, e));
			return ARAC.layout.tools.edgetools.removeNeedlessPts(a, 25);
		case f.ORTHOGONAL:
			a = [];
			for (h = 0; h < c.length - 2; h++) a[h] = c[h];
			a = a.concat(ARAC.layout.tools.edgetools.dOrthC(c[c.length - 2], c[c.length - 1], b.direction, e));
			return ARAC.layout.tools.edgetools.removeNeedlessPts(a, 25)
		}
	}
});
ARAC.layout.edge.SimpleConfig = function(a) {};
ARAC.layout.edge.SimpleConfig.prototype = {
	copy: function() {
		return new ARAC.layout.edge.SimpleConfig(this)
	},
	fromXML: function(a, b) {},
	toXML: function(a) {
		a.writeStartElement("edge");
		a.writeEndElement("edge")
	}
};
ARAC.layout.chain = {};
ARAC.layout.chain.Chain = function() {
	ARAC.layout.chain.Chain._superInit.call(this)
};
ARAC.inherit(ARAC.layout.chain.Chain, ARAC.layout.model.NodeLayout, {
	apply: function(a, b, c, e) {
		var d, f, g, h = null != this.store ? this.store: ARAC.layout.defaultConfigStore;
		for (f = 0; f < c.configs.length; f++) {
			if ("string" === typeof c.configs[f] || c.configs[f] instanceof String) if (h) {
				if (!h) throw new ARAC.Error("no configuration store available");
				g = h.get(c.configs[f]);
				if (!g) throw new ARAC.Error("no configuration with the given name[" + name + "] stored. name:");
			} else g = void 0;
			else g = c.configs[f];
			if (void 0 != g) {
				var k = g.layoutOriginProcessor,
				q = g.layoutOriginNode;
				g.layoutOriginProcessor = f == c.configs.length - 1 ? c.layoutOriginProcessor: ARAC.layout.config.LayoutOriginProcessor.NONE;
				g.layoutOriginNode = f == c.configs.length - 1 ? c.layoutOriginNode: void 0;
				g.doEdge = !1;
				g.recordResults = !0;
				d = new ARAC.layout.model.Results;
				d.mapCenters = this._copyObj(a.mapCenters, d.mapCenters);
				d.mapBBox = this._copyObj(a.mapBBox, d.mapBBox);
				ARAC.layout._apply(d, b, g, e);
				if (d.nodes) {
					a.nodes || (a.nodes = []);
					for (var p = 0; p < d.nodes.length; p++) ARAC.core.arrayFind(a.nodes, d.nodes[p]) || a.nodes.push(d.nodes[p])
				}
				if (d.roots) for (a.roots || (a.roots = []), p = 0; p < d.roots.length; p++) ARAC.core.arrayFind(a.roots, d.roots[p]) || a.roots.push(d.roots[p]);
				a.idmap = this._copyObj(d.idmap, a.idmap);
				a.mapAnnex = this._copyObj(d.mapAnnex, a.mapAnnex);
				a.mapLayoutOrigin = this._copyObj(d.mapLayoutOrigin, a.mapLayoutOrigin);
				a.mapCenters = this._copyObj(d.mapCenters, a.mapCenters);
				a.mapBBox = this._copyObj(d.mapBBox, a.mapBBox);
				a.edgeInfo = this._copyObj(d.edgeInfo, a.edgeInfo);
				delete g.recordResults;
				delete g.doEdge;
				g.layoutOriginProcessor = k;
				g.layoutOriginNode = q
			}
		}
		a.mapLayoutOrigin || (a.mapLayoutOrigin = {});
		for (p = 0; p < a.roots.length; p++) a.mapLayoutOrigin[a.roots[p]] || (a.mapLayoutOrigin[a.roots[p].getID()] = a.roots[p].getBBox());
		for (var r in a.mapAnnex) for (p = 0; p < a.mapAnnex[r].nodes.length; p++) ARAC.core.arrayRemove(a.nodes, a.mapAnnex[r].nodes[p].n);
		this.results = a;
		if (!c.recordResults) for (p = 0; p < a.nodes.length; p++) if ((c = null != a.mapBBox ? a.mapBBox[a.nodes[p].getID()] : null) ? a.nodes[p].setBBox(c) : a.nodes[p].setCenter(a.mapCenters[a.nodes[p].getID()]), d = a.mapAnnex ? a.mapAnnex[a.nodes[p].getID()] : void 0) for (f = 0; f < d.nodes.length; f++)(c = null != a.mapBBox ? a.mapBBox[d.nodes[f].n.getID()] : null) ? d.nodes[f].n.setBBox(c) : d.nodes[f].n.setCenter(a.mapCenters[d.nodes[f].n.getID()]);
		delete this.results;
		ARAC.layout._applyEdge(a, b, null, e)
	},
	_copyObj: function(a, b) {
		if (a) {
			b || (b = {});
			for (var c in a) b[c] = a[c]
		}
		return b
	}
});
ARAC.layout.chain.ChainLayoutConfig = function(a) {
	ARAC.layout.chain.ChainLayoutConfig._superInit.call(this, "chain", a);
	this.configs = a && a.configs || []
};
ARAC.inherit(ARAC.layout.chain.ChainLayoutConfig, ARAC.layout.config.NLConfig, {
	copy: function() {
		return new ARAC.layout.chain.ChainLayoutConfig(this)
	},
	fromXML: function(a, b) {
		ARAC.layout.chain.ChainLayoutConfig._super.fromXML.call(this, a, b);
		var c = a.getAttribute("configs");
		c && (this.configs = ARAC.core.stringSplit(c, ","))
	},
	toXML: function(a) {
		a.writeStartElement("chain");
		ARAC.layout.chain.ChainLayoutConfig._super.toXML.call(this, a);
		var b = "",
		c;
		for (c = 0; c < this.configs.length; c++) b += this.configs[c],
		c < this.configs.length - 1 && (b += ",");
		a.writeAttributeString("configs", b);
		a.writeEndElement("chain")
	},
	generateName: function() {
		return "Chain-" + new Date
	}
});
ARAC.layout.anim = {};
ARAC.layout.anim.Step = function(a, b, c, e) {
	this.aconfig = a;
	this.lgraph = b;
	this.lconfig = c;
	this.display = e
};
ARAC.layout.anim.Step.prototype = {
	perform: function(a) {
		var b = this.lgraph.getNodes();
		this.nCenter1 = {};
		for (var c = 0; c < b.length; c++) this.nCenter1[b[c].getID()] = b[c].getBBox().getCenter();
		this.lconfig.recordResults = !0;
		var e = ARAC.layout.apply(this.lgraph, this.lconfig);
		this.lconfig.recordResults = !1;
		this.nCenter2 = {};
		for (c = 0; c < b.length; c++) {
			var d = e.mapBBox ? e.mapBBox[b[c].getID()] : void 0,
			d = d ? d.getCenter() : e.mapCenters[b[c].getID()];
			this.nCenter2[b[c].getID()] = d
		}
		var f = this,
		g = new Date;
		this._timer = setInterval(function() {
			var b = (new Date - g) / (1E3 * a);
			1 <= b && (b = 1, f.stop());
			for (var c = f.lgraph.getNodes(), d = new ARAC.Coord, e, r, m = 0; m < c.length; m++) e = f.nCenter1[c[m].getID()],
			r = f.nCenter2[c[m].getID()],
			d.x = e.x + (r.x - e.x) * b,
			d.y = e.y + (r.y - e.y) * b,
			c[m].setCenter(d);
			f.display.invalidate()
		},
		40)
	},
	stop: function() {
		clearInterval(this._timer);
		delete this._timer
	}
};
JSG.namespace("aracadapter");
JSG.aracadapter.NodeEdgeMap = function() {
	this._edgemap = new JSG.commons.Map;
	this._nodemap = new JSG.commons.Map
};
JSG.aracadapter.NodeEdgeMap.prototype.size = function() {
	return this._edgemap.size() + this._nodemap.size()
};
JSG.aracadapter.NodeEdgeMap.prototype.mapEdge = function(a) {
	var b = new JSG.aracadapter.AracEdgeAdapter(a);
	this._edgemap.put(a.getId(), b);
	return b
};
JSG.aracadapter.NodeEdgeMap.prototype.mapNode = function(a) {
	var b = new JSG.aracadapter.AracNodeAdapter(a);
	this._nodemap.put(a.getId(), b);
	return b
};
JSG.aracadapter.NodeEdgeMap.prototype.getEdgeAdapter = function(a) {
	return this._edgemap.get(a.getId())
};
JSG.aracadapter.NodeEdgeMap.prototype.getNodeAdapter = function(a) {
	return this._nodemap.get(a.getId())
};
JSG.namespace("aracadapter");
JSG.aracadapter.AracPortAdapter = function(a) {
	JSG.aracadapter.AracPortAdapter._super.constructor.apply(this, arguments);
	this._port = a
};
ARAC.inherit(JSG.aracadapter.AracPortAdapter, ARAC.layout.PortAdapter, {
	getID: function() {
		return this._port.getId()
	},
	getCoord: function() {
		var a = this._port.getConnectionCoordinate().toPoint();
		this._port.translateToParent(a);
		return new ARAC.Coord(a.x, a.y)
	}
});
JSG.namespace("aracadapter");
JSG.aracadapter.AracEdgeAdapter = function(a) {
	JSG.aracadapter.AracEdgeAdapter._super.constructor.apply(this, arguments);
	this._edge = a;
	this._target = this._source = void 0
};
ARAC.inherit(JSG.aracadapter.AracEdgeAdapter, ARAC.layout.EdgeAdapter);
JSG.aracadapter.AracEdgeAdapter.prototype.getModel = function() {
	return this._edge
};
JSG.aracadapter.AracEdgeAdapter.prototype.getID = function() {
	return this._edge.getId()
};
JSG.aracadapter.AracEdgeAdapter.prototype.getTags = function() {
	return []
};
JSG.aracadapter.AracEdgeAdapter.prototype.setType = function(a, b) {
	switch (a) {
	case ARAC.layout.config.EdgeType.STRAIGHT:
		this._edge.setShapeTo(new JSG.graph.model.shapes.LineShape);
		break;
	case ARAC.layout.config.EdgeType.ELBOW:
		this._edge.setShapeTo(new JSG.graph.model.shapes.OrthoLineShape);
		break;
	case ARAC.layout.config.EdgeType.ORTHOGONAL:
		this._edge.setShapeTo(new JSG.graph.model.shapes.OrthoLineShape)
	}
	this._edge.getFormat().setLineCorner(b && b.lineCorners || 0)
};
JSG.aracadapter.AracEdgeAdapter.prototype.getSource = function() {
	return this._source
};
JSG.aracadapter.AracEdgeAdapter.prototype.getSourcePort = function() {
	return new JSG.aracadapter.AracPortAdapter(this._edge.getSourcePort())
};
JSG.aracadapter.AracEdgeAdapter.prototype.setSourcePort = function(a) {
	this._edge.setSourcePort(a._port)
};
JSG.aracadapter.AracEdgeAdapter.prototype.getTarget = function() {
	return this._target
};
JSG.aracadapter.AracEdgeAdapter.prototype.getTargetPort = function() {
	return new JSG.aracadapter.AracPortAdapter(this._edge.getTargetPort())
};
JSG.aracadapter.AracEdgeAdapter.prototype.setTargetPort = function(a) {
	this._edge.setTargetPort(a._port)
};
JSG.aracadapter.AracEdgeAdapter.prototype.setSourceAndTarget = function(a, b) {
	this._source = a;
	this._target = b;
	this._source.addOutboundEdge(this);
	this._target.addInboundEdge(this)
};
JSG.aracadapter.AracEdgeAdapter.prototype.getCoordinates = function() {
	for (var a = this._edge.getPoints(), b = [], c = 0; c < a.length; c++) b[c] = new ARAC.Coord(a[c].x, a[c].y);
	return b
};
JSG.aracadapter.AracEdgeAdapter.prototype.setCoordinates = function(a, b) {
	var c = new JSG.geometry.Point(a.x, a.y),
	e = new JSG.geometry.Point(b.x, b.y);
	this._edge.setStartPointTo(c);
	this._edge.setEndPointTo(e)
};
JSG.aracadapter.AracEdgeAdapter.prototype.setCoordinatesArr = function(a) {
	for (var b = [], c = 0; c < a.length; c++) b.push(new JSG.geometry.Point(a[c].x, a[c].y));
	this._edge.setPoints(b)
};
JSG.namespace("aracadapter");
JSG.aracadapter.AracNodeAdapter = function(a) {
	JSG.aracadapter.AracNodeAdapter._super.constructor.apply(this, arguments);
	this._node = a;
	this._inboundEdges = [];
	this._inboundNodes = [];
	this._outboundEdges = [];
	this._outboundNodes = []
};
ARAC.inherit(JSG.aracadapter.AracNodeAdapter, ARAC.layout.NodeAdapter);
JSG.aracadapter.AracNodeAdapter.prototype.getID = function() {
	return this._node.getId()
};
JSG.aracadapter.AracNodeAdapter.prototype.getTags = function() {
	return [this._node.getType().getValue()]
};
JSG.aracadapter.AracNodeAdapter.prototype.getIndegree = function() {
	return this._inboundEdges.length
};
JSG.aracadapter.AracNodeAdapter.prototype.getOutdegree = function() {
	return this._outboundEdges.length
};
JSG.aracadapter.AracNodeAdapter.prototype.addInboundEdge = function(a) {
	this._inboundEdges.contains(a) || (this._inboundEdges.push(a), this._inboundNodes.push(a.getSource()))
};
JSG.aracadapter.AracNodeAdapter.prototype.getInboundEdges = function() {
	return this._inboundEdges
};
JSG.aracadapter.AracNodeAdapter.prototype.addOutboundEdge = function(a) {
	this._outboundEdges.contains(a) || (this._outboundEdges.push(a), this._outboundNodes.push(a.getTarget()))
};
JSG.aracadapter.AracNodeAdapter.prototype.getOutboundEdges = function() {
	return this._outboundEdges
};
JSG.aracadapter.AracNodeAdapter.prototype.getInboundNodes = function() {
	return this._inboundNodes
};
JSG.aracadapter.AracNodeAdapter.prototype.getOutboundNodes = function() {
	return this._outboundNodes
};
JSG.aracadapter.AracNodeAdapter.prototype.isInboundNode = function(a) {
	return this._inboundNodes.contains(a)
};
JSG.aracadapter.AracNodeAdapter.prototype.isOutboundNode = function(a) {
	return this._outboundNodes.contains(a)
};
JSG.aracadapter.AracNodeAdapter.prototype.getPortAt = function(a) {
	a = new JSG.geometry.Point(a.x, a.y);
	var b = this._node.getPortAtLocation(a);
	void 0 == b && (b = this._node.addPortAtLocation(new JSG.graph.model.Port, a));
	return new JSG.aracadapter.AracPortAdapter(b)
};
JSG.aracadapter.AracNodeAdapter.prototype.getCenter = function() {
	var a = this._node.getCenter();
	return new ARAC.Coord(a.x, a.y)
};
JSG.aracadapter.AracNodeAdapter.prototype.setCenter = function(a) {
	this.setCenterXY(a.x, a.y)
};
JSG.aracadapter.AracNodeAdapter.prototype.setCenterXY = function(a, b) {
	this._node.setCenter(a, b)
};
JSG.aracadapter.AracNodeAdapter.prototype.getBBox = function() {
	var a = this._node.getBoundingBox(),
	b = new ARAC.BBox(a.getLeft(), a.getTop(), a.getLeft() + a.getWidth(), a.getTop() + a.getHeight());
	b.rotation = a.getRotationMatrix().getAngle();
	return b
};
JSG.aracadapter.AracNodeAdapter.prototype.setBBox = function(a) {
	var b = new JSG.geometry.BoundingBox(a.getWidth(), a.getHeight());
	b.setTopLeft(a.x1, a.y1);
	b.rotateAroundPoint(a.getCenter(), this._node.getBoundingBox().getRotationMatrix().getAngle());
	this._node.setBoundingBoxTo(b)
};
JSG.aracadapter.AracNodeAdapter.prototype.getAttribute = function(a) {
	return this._node.getLayoutAttributes().getAttribute(a)
};
JSG.namespace("aracadapter");
JSG.aracadapter.AracGraphAdapter = function(a) {
	JSG.aracadapter.AracGraphAdapter._super.constructor.apply(this, arguments);
	this._graph = a;
	this._nodeAdapters = [];
	this._edgeAdapters = [];
	this._item2adapter = new JSG.aracadapter.NodeEdgeMap;
	this.setup()
};
ARAC.inherit(JSG.aracadapter.AracGraphAdapter, ARAC.layout.GraphAdapter);
JSG.aracadapter.AracGraphAdapter.prototype.setup = function() {
	for (var a = this._graph.getItems(), b = 0; b < a.length; b++) {
		var c = a[b];
		c instanceof JSG.graph.model.LineConnection ? void 0 != c.sourceNode && void 0 != c.targetNode && c.sourceNode.getParent() == this._graph && c.targetNode.getParent() == this._graph && this._edgeAdapters.push(this._item2adapter.mapEdge(c)) : this._nodeAdapters.push(this._item2adapter.mapNode(c))
	}
	for (b = 0; b < this._edgeAdapters.length; b++) {
		var a = this._edgeAdapters[b],
		e = a.getModel(),
		c = e.getSourceNode(),
		e = e.getTargetNode();
		c && e && (c = this._item2adapter.getNodeAdapter(c), e = this._item2adapter.getNodeAdapter(e), c && e && a.setSourceAndTarget(c, e))
	}
};
JSG.aracadapter.AracGraphAdapter.prototype.getNodes = function() {
	return this._nodeAdapters
};
JSG.aracadapter.AracGraphAdapter.prototype.getEdges = function() {
	return this._edgeAdapters
};
JSG.namespace("aracadapter");
JSG.aracadapter.GNode = function(a) {
	JSG.aracadapter.GNode._super.constructor.apply(this, arguments);
	this.jsgnode = a
};
ARAC.inherit(JSG.aracadapter.GNode, ARAC.layout.tools.graphgen.GNode, {
	getSize: function() {
		var a = this.jsgnode.getBoundingBox();
		return {
			x: a.getWidth(),
			y: a.getHeight()
		}
	},
	setSize: function(a) {
		var b = JSG.graph.expr.NumberExpression;
		this.jsgnode.setSize(new b(a.x), new b(a.y))
	}
});
JSG.namespace("aracadapter");
JSG.aracadapter.GEdge = function(a) {
	JSG.aracadapter.GEdge._super.constructor.apply(this, arguments);
	this._edge = a
};
ARAC.inherit(JSG.aracadapter.GEdge, ARAC.layout.tools.graphgen.GEdge, {});
JSG.namespace("aracadapter");
JSG.aracadapter.GraphGenSupport = function(a, b, c) {
	JSG.aracadapter.GraphGenSupport._super.constructor.apply(this, arguments);
	this.graph = a;
	this.nodes = [];
	this.type = b;
	this.edgetype = c
};
ARAC.inherit(JSG.aracadapter.GraphGenSupport, ARAC.layout.tools.graphgen.Support, {
	createNode: function() {
		var a;
		this.type ? a = JSG.graphItemFactory.createShape(this.type)[0] : (a = new JSG.graph.model.shapes.RectangleShape, a = new JSG.graph.model.Node(a));
		var b = JSG.graph.expr.NumberExpression,
		c = new JSG.graph.model.Port;
		a.addPortAtCoordinate(c, new JSG.graph.Coordinate(new b(0, "Parent!WIDTH * 0.5"), new b(0, "Parent!HEIGHT * 0.5")));
		a.getPin().setLocalCoordinate(new JSG.graph.expr.NumberExpression(0, "WIDTH * 0.5"), new JSG.graph.expr.NumberExpression(0, "HEIGHT * 0.5"));
		a.setOrigin(1E3 + 1E3 * this.nodes.length % 2E4, 1E3 + 1E3 * Math.round(this.nodes.length / 20 - 0.5));
		this.type || (a.setSize(new b(2E3), new b(1E3)), a.getFormat().setFillColorRGB(128 + Math.round(96 * Math.random()), 128 + Math.round(96 * Math.random()), 128 + Math.round(96 * Math.random())));
		this.graph.addItem(a);
		a = new JSG.aracadapter.GNode(a);
		this.nodes.push(a);
		return a
	},
	createEdge: function(a, b) {
		var c;
		c = this.edgetype ? JSG.graphItemFactory.createItemFromString(this.edgetype) : new JSG.graph.model.Edge;
		c.getLayoutAttributes().setLineBehavior(JSG.graph.model.shapes.OrthoLineBehavior.DISABLED);
		c.setSourcePort(a.jsgnode.getPortAt(0));
		c.setTargetPort(b.jsgnode.getPortAt(0));
		this.edgetype || c.getFormat().setLineArrowEnd(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWNARROWFILLEDSMALL);
		this.graph.addItem(c);
		return new JSG.aracadapter.GEdge(c)
	}
});
JSG.namespace("aracadapter");
JSG.aracadapter.PropertyProvider = {
	addCustomEditors: function() {
		if (grid = Ext.getCmp("general")) grid.customEditors.treeStyle = Ext.create("PropertyGridComboBoxEditor", {
			data: [{
				type: "Normal",
				value: ARAC.layout.config.TreeStyle.TREE_NORMAL
			},
			{
				type: "List Single",
				value: ARAC.layout.config.TreeStyle.TREE_LIST_SINGLE
			},
			{
				type: "List Double",
				value: ARAC.layout.config.TreeStyle.TREE_LIST_DOUBLE
			},
			{
				type: "HV",
				value: ARAC.layout.config.TreeStyle.TREE_HV
			}]
		}),
		grid.customRenderers.treeStyle = grid.customEditors.treeStyle.renderer,
		grid.customEditors.layoutOrientation = Ext.create("PropertyGridComboBoxEditor", {
			data: [{
				type: "Top To Bottom",
				value: ARAC.layout.config.LayoutOrientation.TOP_TO_BOTTOM
			},
			{
				type: "Left To Right",
				value: ARAC.layout.config.LayoutOrientation.LEFT_TO_RIGHT
			},
			{
				type: "Right To Left",
				value: ARAC.layout.config.LayoutOrientation.RIGHT_TO_LEFT
			},
			{
				type: "Bottom To Top",
				value: ARAC.layout.config.LayoutOrientation.BOTTOM_TO_TOP
			}]
		}),
		grid.customRenderers.layoutOrientation = grid.customEditors.layoutOrientation.renderer,
		grid.customEditors.parentBalancing = Ext.create("PropertyGridComboBoxEditor", {
			data: [{
				type: "Head",
				value: ARAC.layout.config.ParentBalancing.HEAD
			},
			{
				type: "Median",
				value: ARAC.layout.config.ParentBalancing.MEDIAN
			},
			{
				type: "Tail",
				value: ARAC.layout.config.ParentBalancing.TAIL
			}]
		}),
		grid.customRenderers.parentBalancing = grid.customEditors.parentBalancing.renderer,
		grid.customEditors.pathBalancing = Ext.create("PropertyGridComboBoxEditor", {
			data: [{
				type: "Normal",
				value: ARAC.layout.config.PathBalancing.BALANCE_NORMAL
			},
			{
				type: "Longest Path",
				value: ARAC.layout.config.PathBalancing.BALANCE_LONGEST_PATH
			},
			{
				type: "Shortest Path",
				value: ARAC.layout.config.PathBalancing.BALANCE_SHORTEST_PATH
			}]
		}),
		grid.customRenderers.pathBalancing = grid.customEditors.pathBalancing.renderer,
		grid.customEditors.gridType = Ext.create("PropertyGridComboBoxEditor", {
			data: [{
				type: "Grid Flow Distance",
				value: ARAC.layout.config.GridType.GRID_FLOW_DISTANCE
			},
			{
				type: "Grid Flow Raster",
				value: ARAC.layout.config.GridType.GRID_FLOW_RASTER
			},
			{
				type: "Grid Flow Gridback",
				value: ARAC.layout.config.GridType.GRID_FLOW_GRIDBACK
			}]
		}),
		grid.customRenderers.gridType = grid.customEditors.gridType.renderer,
		grid.customEditors.flowDirection = Ext.create("PropertyGridComboBoxEditor", {
			data: [{
				type: "Row Flow",
				value: ARAC.layout.config.FlowDirection.ROW_FLOW
			},
			{
				type: "Column Flow",
				value: ARAC.layout.config.FlowDirection.COL_FLOW
			}]
		}),
		grid.customRenderers.flowDirection = grid.customEditors.flowDirection.renderer,
		grid.customEditors.xNodeScaling = Ext.create("PropertyGridComboBoxEditor", {
			data: [{
				type: "None",
				value: ARAC.layout.config.NodeScaling.NONE
			},
			{
				type: "Max Cell Extend",
				value: ARAC.layout.config.NodeScaling.MAX_CELL_EXTEND
			},
			{
				type: "Area Extend",
				value: ARAC.layout.config.NodeScaling.AREA_EXTEND
			},
			{
				type: "Proportional Area Extend",
				value: ARAC.layout.config.NodeScaling.PROPORTIONAL_AREA_EXTEND
			}]
		}),
		grid.customRenderers.xNodeScaling = grid.customEditors.xNodeScaling.renderer,
		grid.customEditors.yNodeScaling = grid.customEditors.xNodeScaling,
		grid.customRenderers.yNodeScaling = grid.customRenderers.xNodeScaling
	}
};
JSG.namespace("aracadapter");
JSG.aracadapter.viewutil = {
	LAYOUT_ORIENTATION_STORE: Ext.create("Ext.data.Store", {
		fields: ["value", "name"],
		data: [{
			value: ARAC.layout.config.LayoutOrientation.TOP_TO_BOTTOM,
			name: "Top down"
		},
		{
			value: ARAC.layout.config.LayoutOrientation.LEFT_TO_RIGHT,
			name: "Left to right"
		},
		{
			value: ARAC.layout.config.LayoutOrientation.BOTTOM_TO_TOP,
			name: "Bottom up"
		},
		{
			value: ARAC.layout.config.LayoutOrientation.RIGHT_TO_LEFT,
			name: "Right to left"
		}]
	}),
	PARENT_BALANCING_STORE: Ext.create("Ext.data.Store", {
		fields: ["value", "name"],
		data: [{
			value: ARAC.layout.config.ParentBalancing.HEAD,
			name: "Head"
		},
		{
			value: ARAC.layout.config.ParentBalancing.MEDIAN,
			name: "Median"
		},
		{
			value: ARAC.layout.config.ParentBalancing.TAIL,
			name: "Tail"
		}]
	}),
	TREE_STYLE_STORE: Ext.create("Ext.data.Store", {
		fields: ["value", "name"],
		data: [{
			value: ARAC.layout.config.TreeStyle.TREE_NORMAL,
			name: "Normal"
		},
		{
			value: ARAC.layout.config.TreeStyle.TREE_LIST_SINGLE,
			name: "List Single"
		},
		{
			value: ARAC.layout.config.TreeStyle.TREE_LIST_DOUBLE,
			name: "List Double"
		},
		{
			value: ARAC.layout.config.TreeStyle.TREE_HV,
			name: "HV"
		}]
	}),
	EDGE_TYPE_STORE: Ext.create("Ext.data.Store", {
		fields: ["value", "name"],
		data: [{
			value: ARAC.layout.config.EdgeType.STRAIGHT,
			name: "Straight"
		},
		{
			value: ARAC.layout.config.EdgeType.ELBOW,
			name: "Elbow"
		},
		{
			value: ARAC.layout.config.EdgeType.ORTHOGONAL,
			name: "Orthogonal"
		}]
	}),
	ELBOW_TYPE: Ext.create("Ext.data.Store", {
		fields: ["value", "name"],
		data: [{
			value: ARAC.layout.config.ElbowType.SRC,
			name: "Source bow"
		},
		{
			value: ARAC.layout.config.ElbowType.TGT,
			name: "Target bow"
		}]
	})
};