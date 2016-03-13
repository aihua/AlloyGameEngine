
//begin-------------------AlloyPaper.UID---------------------begin

AlloyPaper.UID = Class.extend({
    "statics": {
        "_nextID": 0,
        "_nextCacheID": 1,
        "get": function() {
            return this._nextID++;
        },
        "getCacheID": function() {
            return this._nextCacheID++;
        }
    }
});

//end-------------------AlloyPaper.UID---------------------end
