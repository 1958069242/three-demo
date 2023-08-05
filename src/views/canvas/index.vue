<template>
    <div class="index-page">
		<button @click="drawLine">线条</button>
		<button @click="drawRect">矩形</button>
		<button @click="drawText">文本</button>
		<button @click="drawCircle">圆形</button>
		<button @click="gradRect">渐变矩形</button>
		<button @click="shadowRect">阴影</button>
		<button @click="drawImage">图片</button>
		<button @click="animate">动画</button>
		<button @click="write">签名</button>
		<!-- <Vrmodel></Vrmodel> -->
		<!-- <Vrvideo :modelUrl="mp4"></Vrvideo> -->
        <canvas id="myCanvas" width="1000" height="600"></canvas>
    </div>
</template>
<script>
export default {
	components: {
	},
	created () {
	},
	data () {
		return {
			// mp4:require('../../assets/img/huozhongpian.mp4'),
			canvas:null,
			ctx:null,
			startX: 0, 
			startY: 0,
			isDrawing :false,
			hasDraw :false
		}
	},
	mounted(){
		this.canvas = document.getElementById('myCanvas')
		this.ctx = this.canvas.getContext('2d')
		
	},
	methods: {
		drawLine(){
			this.ctx.beginPath(); // 开始路径绘制
			this.ctx.moveTo(0, 20); // 设置路径起点，坐标为(20,20)
			this.ctx.lineTo(200, 20); // 绘制一条到(200,20)的直线
			this.ctx.lineWidth = 1.0; // 设置线宽
			this.ctx.strokeStyle = '#CC0000'; // 设置线的颜色
			this.ctx.stroke(); // 进行线的着色，这时整条线才变得可见
		},
		drawRect(){
			this.ctx.fillStyle="yellow"
			this.ctx.fillRect(120, 20, 200, 200); 
			// this.ctx.strokeRect(10,10,200,100);    //空心矩形
		},
		drawText(){
			// 设置字体
			this.ctx.font = "Bold 20px Arial"; 
			// 设置对齐方式
			this.ctx.textAlign = "left";
			// 设置填充颜色
			this.ctx.fillStyle = "#008600"; 
			// 设置字体内容，以及在画布上的位置
			this.ctx.fillText("Hello!", 10, 50); 

			// 绘制空心字
			// this.ctx.strokeText("Hello!", 10, 100); 
		},
		drawCircle(){
			this.ctx.beginPath()
			this.ctx.fillStyle = 'red'
			this.ctx.arc(200,200,100,0,Math.PI*2,true)   //ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
			this.ctx.fill()

			// 绘制空心
			// ctx.strokeStyle = "#000"; 
			// ctx.stroke();	               
		},
		gradRect(){
			let myGradient = this.ctx.createLinearGradient(0, 0, 0, 160);   //createLinearGradient方法的参数是(x1, y1, x2, y2)，其中x1和y1是起点坐标，x2和y2是终点坐标。通过不同的坐标值，可以生成从上至下、从左到右的渐变等等。
			myGradient.addColorStop(0, "yellow"); 
			myGradient.addColorStop(1, "red");
			this.ctx.fillStyle = myGradient
			this.ctx.fillRect(10,10,200,100);
		},
		shadowRect(){
			this.ctx.shadowOffsetX = 10; // 设置水平位移
			this.ctx.shadowOffsetY = 10; // 设置垂直位移
			this.ctx.shadowBlur = 5; // 设置模糊度
			this.ctx.shadowColor = "rgba(0,0,0,0.5)"; // 设置阴影颜色
			this.ctx.fillStyle = "#CC0000"; 
			this.ctx.fillRect(10,10,200,100);
		},
		drawImage(){
			let img = new Image()
			img.src = require('../../assets/avatar1.jpg')
			this.ctx.drawImage(img, 120, 120); // 设置对应的图像对象，以及它在画布上的位置
		},
		animate(){
			let posX = 20
			let posY = 100
			setInterval(()=> {
				this.ctx.fillStyle = "black";
				this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
				posX += 1;
				posY += 0.25;
				this.ctx.beginPath();
				this.ctx.fillStyle = "white";
				this.ctx.arc(posX, posY, 10, 0, Math.PI*2, true); 
				this.ctx.closePath();
				this.ctx.fill();
			}, 30);
		},


		// 签名实现
		drawStart(size) {
			const x = size.x, y = size.y;
			this.ctx.beginPath();
			this.ctx.moveTo(x, y);  
			this.ctx.lineTo(x, y);
			this.ctx.strokeStyle = '#000';
			this.ctx.lineWidth ='20';
			this.ctx.stroke();
			this.ctx.closePath();
			this.startY = y;
			this.startX = x;
		},
		drawMove(size) {
			const x = size.x, y = size.y;
			this.ctx.beginPath();
			this.ctx.moveTo(this.startX, this.startY);
			this.ctx.lineTo(x, y);
			this.ctx.strokeStyle = '#000';
			this.ctx.lineWidth ='20';
			this.ctx.stroke();
			this.ctx.closePath();
			this.startY = y;
			this.startX = x;
		},
		drawEnd(size) {
			this.ctx.beginPath();
			this.ctx.moveTo(this.startX, this.startY);
			this.ctx.lineTo(size.x , size.y);
			this.ctx.stroke();
			this.ctx.closePath();
		},

		onMouseDown(e) {
			e.preventDefault();
			this.isDrawing = true;
			this.hasDraw = true;
			this.drawStart({
				x: e.offsetX,
				y: e.offsetY
			})
		},
		onMouseMove(e) {
			e.preventDefault();
			if (!this.isDrawing) return;
			this.drawMove({
				x: e.offsetX,
				y: e.offsetY
			})
		},

		onMouseUp(e) {
			e.preventDefault();
			if (!this.isDrawing) return;
			this.drawEnd({
				x: e.offsetX,
				y: e.offsetY
			})
			this.isDrawing = false;
		},

		write(){
			// let ratio = window.devicePixelRatio;
			// this.canvas.style.width = "100%";
			// this.canvas.style.height = "100%";
			this.ctx.lineCap = "round";
			this.ctx.lineJoin = "round";
			this.ctx.fillStyle ="yellow";
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
			this.canvas.addEventListener("mousedown", this.onMouseDown)
			this.canvas.addEventListener("mousemove", this.onMouseMove)
			this.canvas.addEventListener("mouseup", this.onMouseUp)
		}
	}
}
</script>
<style lang="less">
// @import "../index/index.less";
body {

}

</style>