<template>
    <div class="webGl-page">
        <div id="container"></div>
    </div>
</template>

<script>
import * as Three from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
export default {
    data() {
		return {
			renderer: '', //渲染器
			scene: '', //场景
			light: '', //光源
			camera: '', //相机
			controls: '', //控制器
			mesh:null,
            group:null,
            sprite:null
		}
	},
	mounted(){
		this.init()
		this.animate()
        
	},
	methods: {
		animate(){
			requestAnimationFrame(this.animate)
            this.loop()
			this.renderer.render(this.scene, this.camera); //执行渲染操作
		},
		init(){
			let container = document.getElementById('container');
			this.camera = new Three.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
			this.camera.position.set(0, 1,10)
			this.camera.position.z = 10
			this.scene = new Three.Scene();
			this.scene.background = new Three.Color("#fff")
			this.renderer = new Three.WebGLRenderer({
				antialias: true
			});
            this.renderer.setClearColor(0xCCFFFF, 1); //设置背景颜色
			this.renderer.setSize(container.clientWidth, container.clientHeight);
			container.appendChild(this.renderer.domElement);


            const texture = new Three.TextureLoader().load(require('../../assets/star.png'));
            const spriteMaterial = new Three.SpriteMaterial({
                map: texture, 
            });
            this.group = new Three.Group();
            for (let i = 0; i < 1600; i++) {
                // 精灵模型共享材质
                this.sprite = new Three.Sprite(spriteMaterial);
                this.group.add(this.sprite);
                this.sprite.scale.set(2, 2, 2);
                // 设置精灵模型位置，在长方体空间上上随机分布
                const x = 1000 * (Math.random() - 0.5);
                const y = 600 * Math.random();
                const z = 1000 * (Math.random() - 0.5);
                this.sprite.position.set(x, y, z)
            }
            this.scene.add(this.group);
			this.controls = new OrbitControls(this.camera, this.renderer.domElement); 
		},

        loop() {
            // loop()每次执行都会更新雨滴的位置，进而产生动画效果
            this.group.children.forEach(sprite => {
                // 雨滴的y坐标每次减1
                sprite.position.y -= 1;
                if (sprite.position.y < 0) {
                    // 如果雨滴落到地面，重置y，从新下落
                    this.sprite.position.y = 600;
                }
            });
        }
	}
}
</script>

<style>
    #container {
		width: 100%;
        height: 1080px;
        background-color: khaki;
	}

</style>