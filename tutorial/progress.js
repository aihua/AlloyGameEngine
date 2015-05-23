; (function () {
    //先把要使用类的赋给临时变量，以后就不用打点了:)
    var Stage = ARE.Stage, Container = ARE.Container, Graphics = ARE.Graphics;
    //文本框集成自容器
    ARE.Progress = Container.extend({
        //构造函数
        ctor: function (option) {
            //把容器的属性和方法搞给自己
            this._super();
            //文本框的边框
            this.box = new Graphics()
         
            //直接根据传进的宽和高画个矩形
            this.box.lineWidth(2).strokeStyle(option.borderColor || "black").strokeRect(0, 0, option.width, option.height);
            //把边框添加到自身（因为自身就是容器，继承自Container，所以有了add方法）
            this.add(this.box);
            this.width= option.width;
            this.value = 0;
            var barWidth = this.value * option.width - 4;
            
            this.bar = new Graphics()
            this.add(this.bar);
            this.bar.fillStyle(option.fillColor || "green").fillRect(2, 2, barWidth < 0 ? 0 : barWidth, option.height - 4);
            this.pilot = new ARE.ParticleSystem({
                emitX: 0,
                emitY:0,
                speed:10,
                angle: 180,
                angleRange: 90,
                emitArea: [1, option.height],         
                texture: "data:image/png;base64\,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJkSURBVHjaxJeJbusgEEW94S1L//83X18M2MSuLd2pbqc4wZGqRLrKBsyZhQHny7Jk73xVL8xpVhWrcmiB5lX+6GJ5YgQ2owbAm8oIwH1VgKZUmGcRqKGGPgtEQQAzGR8hQ59fAmhJHSAagigJ4E7GPWRXOYC6owAd1JM6wDQPADyMWUqZRMqmAojHp1Vn6EQQEgUNMJLnUjMyJsM49wygBkAPw9dVFwXRkncCIIW3GRgoTQUZn6HxCMAFEFd8TwEQ78X4rHbILoAUmeT+RFG4UhQ6MiIAE4W/UsYFjuVjAIa2nIY4q1R0GFtQWG3E84lqw2GO2QOoCKBVu0BAPgDSU0eUDjjQenNkV/AW/pWChhpMTelo1a64AOKM30vk18GzTHXCNtI/Knz3DFBgsUqBGIjTInXRY1yA9xkVoqW5tVq3pDR9A0hfF5BSARmVnh7RMDCaIdcNgbPBkgzn1Bu+SfIEFSpSBmkxyrMicb0fAEuCZrWnN89veA/4XcakrPcjBWzkTuLjlbfTQPOlBhz+HwkqqPXmPQDdrQItxE1moGof1S74j/8txk8EHhTQrAE8qlwfqS5yukm1x/rAJ9Jiaa6nyATqD78aUVBhFo8b1V4DdTXdCW+IxA1zB4JhiOhZMEWO1HqnvdoHZ4FAMIhV9REF8FiUm0jsYPEJx/Fm/N8OhH90HI9YRHesWbXXZwAShU8qThe7H8YAuJmw5yOd989uRINKRTJAhoF8jbqrHKfeCYdIISZfSq26bk/K+yO3YvfKrVgiwQBHnwt8ynPB25+M8hceTt/ybPhnryJ78+tLgAEAuCFyiQgQB30AAAAASUVORK5CYII=",
                filter: [0.63, 0.35, 0.18, 1],
                emitCount: 1,
                maxCount: 50
            });
            this.pilot.y = option.height / 2;
            this.pilot.scale = 0.4;
            this.add(this.pilot);
            this.height = option.height;
            this.fillColor = option.fillColor;

            ARE.Observe(this, "value", function (name, value) {
             
                if (value >= 1) {
                    this.pilot.maxCount = 0;
                    this.value = 1;
                } else {
                    this.pilot.maxCount = 50;
                    this.value = value;
                }
                
                this.pilot.x = this.value * this.width;
                var barWidth = this.value * this.width - 4;
                this.bar.clear().fillStyle(this.fillColor || "green").fillRect(2, 2, barWidth < 0 ? 0 : barWidth, this.height - 4);
              
            })
        }
    });
})();

