<template>
    <div class="webGl-page">
        <div id="container"></div>
        <video id="videoContainer" style="position:absolute;top:0px;left:0px;z-index:100;visibility: hidden"></video>
        <div class="datalabel"  :style="{'top': labelStyle.top + 'px', 
                                    'left': labelStyle.left + 'px', 
                                    'display': labelStyle.isShow ? 'inline-block' : 'none' }">
            {{ labelStyle.name }}
        </div>
    </div>
</template>

<script>
import * as Three from 'three'
// import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import TWEEN from '@tweenjs/tween.js'
export default {
    data(){
        return{
            renderer: '', //渲染器
            scene: '', //场景
            light: '', //光源
            camera: '', //相机
            controls: '', //控制器
            mesh:null,
            videoStatus:true,
            labelStyle:{
                top:'',
                left:'',
                isShow:false,
                name:'机房四',
            }
        }
    },
    created(){

    },
    mounted(){
        this.init()
        this.animate()
        this.initLight()
    },
    methods:{
        animate(){
            TWEEN.update();
            requestAnimationFrame(this.animate)
            this.renderer.render(this.scene, this.camera); //执行渲染操作
            this.controls.update()  
        },

        init(){
            let container = document.getElementById('container');
            this.camera = new Three.PerspectiveCamera(65, container.clientWidth / container.clientHeight, 0.1, 1000);
            this.camera.position.set(0, 15, 100)
            this.scene = new Three.Scene();
            this.camera.lookAt(this.scene.position);
            this.renderer = new Three.WebGLRenderer({
                antialias: true
            });
            this.renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(this.renderer.domElement);
            this.controls = new OrbitControls(this.camera, this.renderer.domElement); // 初始化控制器
            this.controls.maxPolarAngle = 80 / 360 *2 * Math.PI; //绕垂直轨道的距离（范围是0-Math.PI,默认为Math.PI）
            this.controls.minPolarAngle = 0; 
            this.controls.enableDamping = true    //阻尼 渲染函数调用update 重新计算  
            this.controls.minDistance = 10; // 设置移动的最短距离（默认为零）
            this.controls.maxDistance = 100; // 设置移动的最长距离（默认为无穷）
            
            this.addGird()
            this.initFloor()
            this.initSkyBox()
            this.loadBoard()
            // this.loadBuilding()
            this.loadDataCenter()
            this.fly()
            this.passcar()
            this.renderer.domElement.addEventListener('click', (e) => {
                this.modelClick(e)
            })
        },

        addGird(size= 1000,divisions= 20,colorCenterLine = 0x888888,colorGrid = 0x888888) {
            const grid = new Three.GridHelper(size, divisions, colorCenterLine, colorGrid);
            this.scene.add(grid);
        },

        initLight(){
            // 添加灯光
            // const light1 = new Three.DirectionalLight(0xffffff,1)
            // light1.position.set(0,0,1)
            // this.scene.add(light1)

            // const light2 = new Three.DirectionalLight(0xffffff,1)
            // light2.position.set(0,2,10)
            // this.scene.add(light2)

            // const light3 = new Three.DirectionalLight(0xffffff,1)
            // light3.position.set(0,0,-10)
            // this.scene.add(light3)

            const light4 = new Three.HemisphereLight( 0xffffbb, 0x080820, 1 ); 
            this.scene.add( light4 );
        },

        //  天空
        initSkyBox(){
            let urls = [
                require('../../assets/sky/posx.jpg'),
                require('../../assets/sky/negx.jpg'),
                require('../../assets/sky/posy.jpg'),
                require('../../assets/sky/negy.jpg'),
                require('../../assets/sky/posz.jpg'),
                require('../../assets/sky/negz.jpg')
            ]
            let cubeTexture = new Three.CubeTextureLoader().load(urls);
            this.scene.background = cubeTexture;
        },

        // 广告牌
        loadBoard(){
            const _this = this
            let video = document.getElementById('videoContainer');
            video.src = require('../../assets/video/bi.mp4'); // 设置视频地址
            video.autoplay = "autoplay"; //要设置播放
            video.loop = "loop"; //要设置循环播放
            video.muted = "muted"; //要设置静音
            let texture = new Three.VideoTexture(video)
            let loader = new GLTFLoader();

            // 解决压缩模型
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('./draco/');
            loader.setDRACOLoader(dracoLoader);

            loader.load('billboard_-_lowpoly.glb', ( gltf ) => {
                // gltf.openCastShadow()
                gltf.scene.position.set(4, 2, -35)
                gltf.scene.rotateY(-Math.PI / 2)
                gltf.scene.scale.set(2.7, 2.7, 2.7)
                gltf.scene.name = '广告牌'
                let Object_6 = gltf.scene.getObjectByName('Object_6')
                Object_6.material = new Three.MeshBasicMaterial({
                    map: texture, // 设置纹理贴图
                    transparent: true,
                });
                _this.scene.add(gltf.scene);
            });

        },

        // // 实验楼模型
        // loadBuilding(){
        //     let loader = new GLTFLoader();
        //     loader.load('75.gltf', ( _model ) => {
        //         _model.scene.position.set(-30, 0, 5)
        //         _model.scene.name = '实验楼'
        //         this.scene.add(_model.scene);
        //     });
        // },

        fly(){
            let loader = new GLTFLoader();
            loader.load('wrj.glb', ( _model ) => {
                _model.scene.position.set(-200, 0, -100)
                this.scene.add(_model.scene);
                const end = { x:200, y:100, z:-100 }
                let tween = new TWEEN.Tween(_model.scene.position)
                    .to(end,10000)
                    .delay(100) //开始时的延迟
                    .yoyo(true) //是否开启yoyo循环
                    .easing(TWEEN.Easing.Quadratic.InOut) //运动曲线
                    .repeat(10) //重复次数
                tween.start() //开启动画
                tween.onUpdate((pos)=>{
                    _model.scene.position.set(pos.x,pos.y)
                })
            });
           
        },

        passcar(){
            let loader = new GLTFLoader();
            loader.load('passcar.gltf', ( _model ) => {
                _model.scene.scale.set(8, 8, 8)
                _model.scene.rotateY(-Math.PI)
                _model.scene.position.set(-80, 0, -10)
                _model.scene.name = '快递车'
                this.scene.add(_model.scene);
                const curve = new Three.CatmullRomCurve3([
                    new Three.Vector3(-80, 0, 0),
                    new Three.Vector3(-80, -100,0),
                    new Three.Vector3(180,-140,0),
                    // new Three.Vector3(-40,0, 40),
                    // new Three.Vector3(0, 0, 40),
                    // new Three.Vector3(40, 0, 40),
                ]);

                const points = curve.getPoints(50);
                const geometry = new Three.BufferGeometry().setFromPoints(points);
                const material = new Three.LineBasicMaterial({ color: 0x000000 });
                const splineObject = new Three.Line(geometry, material);
                splineObject.rotation.x = Math.PI * 0.5;
                splineObject.position.y = 0.05;
                this.scene.add(splineObject);
                this.moveOnCurve(curve,_model.scene)
            });  
        },

        moveOnCurve(curve,model) {
            console.log(curve,model);
            let progress = 0; // 物体运动时在运动路径的初始位置，范围0~1
            const velocity = 0.001; // 影响运动速率的一个值，范围0~1，需要和渲染频率结合计算才能得到真正的速率
            if (curve == null || model == null) {
                console.log("Loading")
            } else {
                if (progress <= 1 - velocity) {
                    const point = curve.getPointAt(progress); //获取样条曲线指定点坐标
                    const pointBox = curve.getPointAt(progress + velocity); //获取样条曲线指定点坐标
                    console.log(point);
                    if (point && pointBox) {
                        model.position.set(point.x, point.y, point.z);
                        model.lookAt(pointBox.x, pointBox.y, pointBox.z); //因为这个模型加载进来默认面部是正对Z轴负方向的，所以直接lookAt会导致出现倒着跑的现象，这里用重新设置朝向的方法来解决。
                        var targetPos = pointBox   //目标位置点
                        var offsetAngle = 0 //目标移动时的朝向偏移
                        // //以下代码在多段路径时可重复执行
                        var mtx = new Three.Matrix4()  //创建一个4维矩阵
                        // .lookAt ( eye : Vector3, target : Vector3, up : Vector3 ) : this,构造一个旋转矩阵，从eye 指向 target，由向量 up 定向。
                        mtx.lookAt(model.position, targetPos, model.up) //设置朝向
                        mtx.multiply(new Three.Matrix4().makeRotationFromEuler(new Three.Euler(0, offsetAngle, 0)))
                        var toRot = new Three.Quaternion().setFromRotationMatrix(mtx)  //计算出需要进行旋转的四元数值
                        model.quaternion.slerp(toRot, 0.2)
                    }
                    progress += velocity;
                } else {
                    progress = 0;
                }
            }
        },

        
        loadDataCenter(){
            const _this = this
            let loader = new GLTFLoader();
            loader.load('datacenter.glb', ( _model ) => {
                _model.scene.name = '数据中心'
                _model.scene.rotateY(-Math.PI /2)
                // _model.scene.position.set(30, 0, 5)
                _model.scene.scale.set(7, 7, 7)
                _this.scene.add(_model.scene);
            });
        },

        // initFloor() {
        //     let planeWidth = 1000;
        //     let planeHeight = 1000;
        //     const ground = new Three.Mesh(
        //         new Three.PlaneGeometry(planeWidth, planeHeight),
        //         new Three.MeshPhongMaterial({ color: 0xffffff, depthWrite: false })
        //     );
        //     ground.rotation.x = - Math.PI / 2;
        //     ground.receiveShadow = true;
        //     this.scene.add(ground);
        // },

        // 地板
        initFloor(){
            let floorGeometry = new Three.PlaneGeometry(1000,1000)  //平面几何
            const material = new Three.MeshPhysicalMaterial({
                color:0x808080,
                side:Three.DoubleSide,
                metalness:0,  //金属度  ，0代表非金属
                roughness:0.1   //粗糙度  越小越光滑
            })
            const mesh = new Three.Mesh(floorGeometry,material)
            mesh.rotation.x = Math.PI/2
            // 地板接受阴影
            mesh.receiveShadow = true
            this.scene.add(mesh) 
        },
        modelClick(e){
            const _this = this
            let pointer = {}
            pointer.x = (e.clientX / window.innerWidth) * 2 - 1
            pointer.y = -(e.clientY / window.innerHeight) * 2  + 1
            let vector = new Three.Vector2(pointer.x,pointer.y)
            let raycaster = new Three.Raycaster()   //用于鼠标交互捕捉到点击了什么位置
            raycaster.setFromCamera(vector,this.camera)
            let intersects = raycaster.intersectObjects(this.scene.children);
            intersects.forEach(res=>{
                if(res.object.name == 'Object_6'){
                    _this.playVideo()
                }else if(res.object.parent.name.includes('rack')){
                    this.labelStyle.top = e.y - 35
                    this.labelStyle.left = e.x - 35
                    this.labelStyle.isShow = true
                    this.labelStyle.name = res.object.parent.name
                    this.clickDataCenter(res.object)
                }else{
                    console.log('未拾取地址');
                }
            })
        },
            
        
        clickDataCenter(curClick){
            const material = new Three.MeshBasicMaterial({
                color:0x808080,
                transparent: true,
            });
            let parentModel = this.scene.getObjectByName(curClick.parent.parent.name)

            let rackList = parentModel.children.filter(res=>{
                return res.name.includes('rack')
            })
            rackList.map(item=>{
                item.children[0].material = material
            })

            let Object = this.scene.getObjectByName(curClick.parent.name)
            Object.children[0].material = new Three.MeshBasicMaterial({
                side: Three.DoubleSide,
                transparent: true,
                depthTest: false,
                depthWrite: true, // 无法被选择，鼠标穿透
                color: 'blue',
                opacity: 0.3,
            });
        },
        playVideo(){
            let video = document.getElementById('videoContainer');
            if(!this.videoStatus){
                video.play()
                this.videoStatus = true
            }else{
                this.videoStatus = false
                video.pause()
            } 
        },
    }
}
</script>

<style>
    #container {
		width: 100%;
        height: 1080px;
	}
    .datalabel{
        position: absolute;
        background-color: rgb(29 78 216 / 0.6);
        padding:20px 40px;
        border-radius: 20px;
        color: #fff;
    }
    .label{
        color: red;
        font-size: 30px;
    }

</style>