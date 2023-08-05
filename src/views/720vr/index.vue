<template>
    <div class="webGl-page">
        <div id="container"></div>
    </div>
</template>

<script>
import * as Three from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
export default {
    data(){
        return{
            renderer: '', //渲染器
            scene: '', //场景
            light: '', //光源
            camera: '', //相机
            controls: '', //控制器
            mesh:null
        }
    },
    created(){

    },
    mounted(){
        this.init()
        this.animate()
    },
    methods:{
        animate(){
            requestAnimationFrame(this.animate)
            this.renderer.render(this.scene, this.camera); //执行渲染操作
        },

        // 模型加载
        init(){
            let container = document.getElementById('container');
            this.camera = new Three.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
            this.camera.position.set(1, 3, -6)
            this.camera.lookAt(0,1,0)
            this.scene = new Three.Scene();
            this.scene.background = new Three.Color("#fff")
            this.scene.environment = new Three.Color("#fff")
            
            const grid = new Three.GridHelper(10,10)
            grid.material.transparent = true
            this.scene.add(grid);

            this.renderer = new Three.WebGLRenderer({
                antialias: true
            });

            this.renderer.setSize(container.clientWidth, container.clientHeight);

            container.appendChild(this.renderer.domElement);
            this.controls = new OrbitControls(this.camera, this.renderer.domElement); // 初始化控制器

            let loader = new GLTFLoader();

            loader.load('room2.glb',  ( gltf )=> {
                this.scene.add(gltf.scene);
            });


            // 添加灯光
            const light1 = new Three.DirectionalLight(0xffffff,1)
            light1.position.set(0,0,1)
            this.scene.add(light1)

            const light2 = new Three.DirectionalLight(0xffffff,1)
            light2.position.set(0,2,10)
            this.scene.add(light2)

            const light3 = new Three.DirectionalLight(0xffffff,1)
            light3.position.set(0,0,-10)
            this.scene.add(light3)
        },
    }
}
</script>

<style>
    #container {
		width: 100%;
        height: 1080px;
	}

</style>