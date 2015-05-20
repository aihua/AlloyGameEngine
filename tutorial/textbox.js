/// <reference path="are.js" />
; (function () {
    var Stage = ARE.Stage,  Container = ARE.Container, Graphics = ARE.Graphics, Text = ARE.Text;

    ARE.Textbox = Container.extend({
        ctor: function (option) {
            this._super();

            this.box = new Graphics()
            this.box.strokeRect(0, 0, option.width, option.height);         
            this.box.fillStyle("rgba(255,255,255,0.1)").fillRect(0, 0, option.width, option.height);
            this.add(this.box);
                     
            this._bindEvent();
          
            this.option = {
                fontSize:   option.fontSize || 12, 
                fontFamily:option.fontFamily || "arial",
                color: option.color || "black",
                width:option.width
            };
            //鼠标移上去指针的形状
            this.cursor = "text";
            this.cursorText = new Text("|", this.option.fontSize + "px " + this.option.fontFamily,"black");

            this.realTextbox = document.createElement("input");
            this.realTextbox.type = "text";
            this.realTextbox.style.position = "fixed";
            this.realTextbox.style.left = "-2200px"
            this.realTextbox.style.top = "0px"
            document.body.appendChild(this.realTextbox);
         
            this.text = new Text("", this.option.fontSize+"px " +this.option.fontFamily,this.option.color);
      
            this.measureCtx = document.createElement("canvas").getContext("2d");
            this.measureCtx.font = this.option.fontSize + "px " + this.option.fontFamily;
       
            this.add(this.text,this.cursorText);
        
            this.tickFPS = 20;
        },
        focus: function () {
            var self = this;
            this.realTextbox.focus();
            this.loop = setInterval(function () {
                self.cursorText.visible = !self.cursorText.visible;
            }, 500);
        },
        blur: function () {         
            clearInterval(this.loop);
            this.realTextbox.blur();
            this.cursorText.visible = false;
        },
        _bindEvent: function () {
            var self = this;
            this.onClick(function (evt) {             
                self.realTextbox.focus();
                self.cursorText.visible = true;
                self.focus();
                //阻止冒泡
                evt.stopPropagation();
            });

            document.addEventListener("mousedown", function () {
                self.blur();
            }, false);
        },
        getFitStr: function (str,index) {
           var width= this.measureCtx.measureText(str.substring(index, str.length - 1)).width;
           if (width < this.option.width-this.option.fontSize) {
               return this.getFitStr(str, --index);
           } else {
               return str.substring(index++, str.length - 1)
           }
        },
        tick: function () {
           this.cursorText.x = this.measureCtx.measureText(this.realTextbox.value).width;
           if (this.cursorText.x > this.option.width) {
               this.text.value = this.getFitStr(this.realTextbox.value, this.realTextbox.value.length - 2);
               this.cursorText.x = this.measureCtx.measureText(this.text.value).width;
            } else {             
                this.text.value = this.realTextbox.value;
            }
        }
    });

})();