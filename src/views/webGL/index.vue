<template>
    <div class="webGl-page">
        <div id="container"></div>
    </div>
</template>

<script>
import * as Three from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { OBJLoader } from 'three-obj-mtl-loader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
// let OrbitControls = require('three-orbit-controls')(Three);
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
        this.init4()
        this.animate()
    },
    methods:{
        animate(){
            requestAnimationFrame(this.animate)
            this.renderer.render(this.scene, this.camera); //执行渲染操作
        },


        // 全景贴图
        init1(){
            let container = document.getElementById('container');
            this.camera = new Three.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
            this.camera.position.set(0, 0, 100)
            this.scene = new Three.Scene();
            this.camera.lookAt(this.scene.position);
            this.renderer = new Three.WebGLRenderer({
                antialias: true
            });
            this.renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(this.renderer.domElement);
            let urls = [
                require('../../assets/img/home.left.jpg'),
                require('../../assets/img/home.right.jpg'),
                require('../../assets/img/home.top.jpg'),
                require('../../assets/img/home.bottom.jpg'),
                require('../../assets/img/home.front.jpg'),
                require('../../assets/img/home.back.jpg')
            ]
            let cubeTexture = new Three.CubeTextureLoader().load(urls);
            this.scene.background = cubeTexture;
          
            this.controls = new OrbitControls(this.camera, this.renderer.domElement); // 初始化控制器
        },

        // 球形贴图

        init4(){
            let container = document.getElementById('container');
            this.camera = new Three.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
            this.camera.position.set(30, 20, 80)
            // this.camera.position.z = 1000;
            this.scene = new Three.Scene();
            let sphereGeometry = new Three.SphereGeometry(200, 60, 60);
            sphereGeometry.scale(-1, 1, 1);

            //添加材质     
            var textureLoader = new Three.TextureLoader();
            const texture = textureLoader.load(require('../../assets/img/sn.png'));
            // const texture = textureLoader.load(require('../../assets/img/brown_photostudio_02_4k.exr'));
            const material = new Three.MeshBasicMaterial(
                {
                    // color: 0x00ff00,
                    map: texture,
                    // //双面渲染  
                    side: Three.DoubleSide
                });

            this.mesh = new Three.Mesh(sphereGeometry, material);
            this.scene.add(this.mesh);
            this.renderer = new Three.WebGLRenderer({
                antialias: true
            });

            //指定渲染器的高宽(和画布框的大小一致)
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(container.clientWidth, container.clientHeight);
            //将指定的渲染器加入到Dom容器中
            container.appendChild(this.renderer.domElement);
            this.controls = new OrbitControls(this.camera, this.renderer.domElement); // 初始化控制器
        },


        // 立方体贴图

        init2(){
            //获取DOM容器
            let container = document.getElementById('container');
            //设置相机的角度  宽高比  近端面  远端面
            this.camera = new Three.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
            //设置相机在三维坐标的位置
            this.camera.position.set(0, 0, 2)
            this.camera.position.z = 5;
            //设置场景
            this.scene = new Three.Scene();
            //添加正方体  参数分别是长  宽  高
            let geometry = new Three.BoxGeometry(0.3, 0.3, 0.3);

            //添加材质     
            var textureLoader = new Three.TextureLoader();
            const texture = textureLoader.load('https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.mp.sohu.com%2Fupload%2F20170522%2Fce881ff0022548a5b591495d7daad683_th.png&refer=http%3A%2F%2Fimg.mp.sohu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1630716827&t=9e50342e5c8fbdf1cce7f010edfe348f');
            // let material = new Three.MeshNormalMaterial();
            const material = new Three.MeshBasicMaterial(
            {
                map: texture,
                //双面渲染  
                side: Three.DoubleSide
            });
            //将正方体以及材质放入网格中
            this.mesh = new Three.Mesh(geometry, material);
            //在场景中添加网格
            this.scene.add(this.mesh);
            //开启反锯齿
            this.renderer = new Three.WebGLRenderer({
                antialias: true
            });
            //指定渲染器的高宽(和画布框的大小一致)
            this.renderer.setSize(container.clientWidth, container.clientHeight);
            //将指定的渲染器加入到Dom容器中
            container.appendChild(this.renderer.domElement);
            this.controls = new OrbitControls(this.camera, this.renderer.domElement); // 初始化控制器
        },


        // 模型加载
        init3(){
            let container = document.getElementById('container');
            this.camera = new Three.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
            this.camera.position.set(0, 1, 2)
            this.camera.position.z = 5;
            this.scene = new Three.Scene();
            this.scene.background = new Three.Color("#ccc")
            this.scene.environment = new Three.Color("#ccc")
            

            const grid = new Three.GridHelper(10,10)
            grid.material.opacity = 0.2
            grid.material.transparent = true
            this.scene.add(grid);

            this.renderer = new Three.WebGLRenderer({
                antialias: true
            });
            this.renderer.setSize(container.clientWidth, container.clientHeight);


            container.appendChild(this.renderer.domElement);
            this.controls = new OrbitControls(this.camera, this.renderer.domElement); // 初始化控制器


            let loader = new GLTFLoader();

            // 机器狗
            // loader.load('robot_cat_-_high_poly/scene.gltf',  ( gltf )=> {
            //     this.scene.add(gltf.scene);
            // });

            // 汽车
            // loader.load('carglb.glb',  ( gltf )=> {
            //     this.scene.add(gltf.scene);
            // });


            // 汽车
            loader.load('ferrari.glb',  ( gltf )=> {
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

        init () {
            const container = document.getElementById('container')
            //场景
            this.scene = new Three.Scene();
            // var ambient = new Three.AmbientLight(0x444444, 3); //添加光源  颜色和光照强度
            // var axisHelper = new Three.AxesHelper(600); //添加辅助坐标系
            // this.scene.add(ambient, axisHelper);

            // 初始化相机
            this.camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)//使用透视相机
            this.camera.position.set(0, 0, 10); //设置相机位置
            this.camera.position.z = 1;
            // this.camera.lookAt(new Three.Vector3(0, 0, 0)); // 相机看向
            

            //添加正方体  参数分别是长  宽  高
			let geometry = new Three.BoxGeometry(0.3, 0.3, 0.3);

            // 渲染
            this.renderer = new Three.WebGLRenderer()
			// this.renderer.setClearColor(0xffffff); //添加背景颜色
			this.renderer.setSize(window.innerWidth, window.innerHeight); // 设定渲染器尺寸
            // this.renderer.setPixelRatio(window.devicePixelRatio) // 为了兼容高清屏幕
            // const container = document.getElementById('container')
            container.appendChild(this.renderer.domElement)

            // r添加光源
            // const color = 0xFFffFF;
            // const intensity = 1;
            // const spotLight = new Three.SpotLight(0xffffff);
            // const light = new Three.AmbientLight(color);
            // light.position.set(-1, 2, 4);
            // this.scene.add(light);

            // var textureLoader = new Three.TextureLoader(); //创建纹理贴图		
            // var img = textureLoader.load(require('../../assets/img/home3.jpeg'));
            // var geometry = new Three.SphereGeometry(130, 256, 256); // 球体网格模型
            // var material = new Three.MeshLambertMaterial({
                // map: img, //设置颜色贴图属性值
                // side: Three.DoubleSide, //双面渲染
            // });
            var material = new Three.MeshLambertMaterial();
            this.mesh= new Three.Mesh(geometry, material); //网格模型对象Mesh	
            this.scene.add(this.mesh);
            // this.controls = new OrbitControls(this.camera, this.renderer.domElement)
            // this.controls.target.set(0, 0, 0)
            // this.controls = new OrbitControls(this.camera, this.renderer.domElement); // 初始化控制器
            // this.controls.target.set(0, 0, 0); // 设置控制器的焦点，使控制器围绕这个焦点进行旋转
            // this.controls.minDistance = 10; // 设置移动的最短距离（默认为零）
            // this.controls.maxPolarAngle = Math.PI; //绕垂直轨道的距离（范围是0-Math.PI,默认为Math.PI）
            // this.controls.maxDistance = 30; // 设置移动的最长距离（默认为无穷）
            // this.controls.enablePan = false; //禁用右键功能
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