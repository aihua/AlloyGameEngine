
//begin-------------------AlloyPaper.Renderer---------------------begin

AlloyPaper.Renderer = Class.extend({
    "ctor": function (stage, openWebGL) {
        this.stage = stage;
        this.objs = [];
        this.width = this.stage.width;
        this.height = this.stage.height;
        this.mainCanvas = this.stage.canvas;
        var canvasSupport = !! window.CanvasRenderingContext2D,
            webglSupport = function() {
                try {
                    var canvas = document.createElement("canvas");
                    return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
                } catch (e) {
                    return false;
                }
            }();
        if (webglSupport && openWebGL) {
            this.renderingEngine = new AlloyPaper.WebGLRenderer(this.stage.canvas);
        } else {
            if (canvasSupport) {
                this.renderingEngine = new AlloyPaper.CanvasRenderer(this.stage.canvas);
            } else {
                throw "your browser does not support canvas and webgl ";
            }
        }
        this.mainCtx = this.renderingEngine.ctx;
    },
    "update": function() {
        var objs = this.objs,
            ctx = this.mainCtx,
            engine = this.renderingEngine;
        objs.length = 0;
        this.computeMatrix();
        engine.clear();
        var l = objs.length;
        for (var m = 0; m < l; m++) {
            engine.renderObj(ctx, objs[m]);
        }
    },
    "computeMatrix": function() {
        for (var i = 0, len = this.stage.children.length; i < len; i++) {
            this._computeMatrix(this.stage.children[i]);
        }
    },
    "initComplex": function(o) {
        o.complexCompositeOperation = this._getCompositeOperation(o);
        o.complexAlpha = this._getAlpha(o, 1);
    },
    "_computeMatrix": function(o, mtx) {
        if (!o.isVisible()) {
            return;
        }
        if (mtx) {
            o._matrix.initialize(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
        } else {
            o._matrix.initialize(1, 0, 0, 1, 0, 0);
        }
        if (o instanceof AlloyPaper.Shape) {
            o._matrix.appendTransform(o.x, o.y, 1, 1, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
        } else {
            o._matrix.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
        }
        if (o instanceof AlloyPaper.Container) {
            var list = o.children,
                len = list.length,
                i = 0;
            for (; i < len; i++) {
                this._computeMatrix(list[i], o._matrix);
            }
        } else {
            if (o instanceof AlloyPaper.Graphics || o instanceof AlloyPaper.Text) {
                this.objs.push(o);
                this.initComplex(o);
            } else {
                o.initAABB();
                if (this.isInStage(o)) {
                    this.objs.push(o);
                    this.initComplex(o);
                }
            }
        }
    },
    "_getCompositeOperation": function(o) {
        if (o.compositeOperation) return o.compositeOperation;
        if (o.parent) return this._getCompositeOperation(o.parent);
    },
    "_getAlpha": function(o, alpha) {
        var result = o.alpha * alpha;
        if (o.parent) {
            return this._getAlpha(o.parent, result);
        }
        return result;
    },
    "isInStage": function(o) {
        return this.collisionBetweenAABB(o.AABB, this.stage.AABB);
    },
    "collisionBetweenAABB": function(AABB1, AABB2) {
        var maxX = AABB1[0] + AABB1[2];
        if (maxX < AABB2[0]) return false;
        var minX = AABB1[0];
        if (minX > AABB2[0] + AABB2[2]) return false;
        var maxY = AABB1[1] + AABB1[3];
        if (maxY < AABB2[1]) return false;
        var minY = AABB1[1];
        if (minY > AABB2[1] + AABB2[3]) return false;
        return true;
    }
});

//end-------------------AlloyPaper.Renderer---------------------end
