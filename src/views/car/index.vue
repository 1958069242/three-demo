<template>
    <div class="webGl-page">
        <div id="container"></div>
    </div>
</template>

<script>
import * as Three from 'three'
import GUI from 'lil-gui'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import TWEEN from '@tweenjs/tween.js'
// const TWEEN = require('@tweenjs/tween.js')
export default {
    data(){
        return{
            renderer: '', //渲染器
            scene: '', //场景
            light: '', //光源
            camera: '', //相机
            controls: '', //控制器
            mesh:null,
            doors:[],
            carSatatus:false,
        }
    },
    created(){

    },
    mounted(){
        this.init3()
        this.initSpotLight()
        // this.initCylineder()
        this.animate()
        this.initFloor()
        this.loadImage()
        // this.createLights()
        window.addEventListener('click',this.onClick)
    },
    methods:{
        animate(time){
            requestAnimationFrame(this.animate)
            this.renderer.render(this.scene, this.camera); //执行渲染操作
            this.controls.update()
            this.renderer.shadowMap.enabled = true   //支持阴影
            //定义阴影贴图类型 减少马赛克阴影
            TWEEN.update(time)
            this.renderer.shadowMap.type = Three.PCFSoftShadowMap
        },

        initCylineder(){
            const geometry = new Three.BoxGeometry(200,400,500)
            const material = new Three.MeshPhysicalMaterial({
                color:0x6c6c6c,
                side:Three.DoubleSide,
            })
            const mesh = new Three.Mesh(geometry,material)
            this.scene.add(mesh)
        },


        // tween 补间动画，由开始位置和结束位置自动计算中间动画
        setAmimateCamera(start,end){
            let tween = new TWEEN.Tween(start).to(end,3000).easing(TWEEN.Easing.Quadratic.Out)
            tween.onUpdate((that)=>{
                this.camera.position.set(that.cx,that.cy,that.cz)
                this.controls.target.set(that.ox,that.oy,that.oz)
            })
            tween.start()
        },

        // 聚光灯
        initSpotLight(){
            const spot = new Three.SpotLight('#fff',2)    //颜色，强度    
            spot.angle = Math.PI / 8
            spot.penumbra = 0.2  //横向  锥型半影衰减百分比
            spot.decay = 2   //纵向
            spot.distance = 30
            spot.shadow.radius = 10
            spot.position.set(-5,10,1)
            spot.castShadow = true
            this.scene.add(spot)
        },

        // 地板
        initFloor(){
            let floorGeometry = new Three.PlaneGeometry(30,30)  //平面几何
            const material = new Three.MeshPhysicalMaterial({
                color:0xffffff,
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



        openCar(){
            this.doors.map(res=>{
                res.rotation.x = - Math.PI/2
            })
        },
        closeCar(){
            this.doors.map(res=>{
                res.rotation.x = 0
            })
        },
        carIn(){
            this.setAmimateCamera(
                {
                    cx:4.25,
                    cy:1.4,
                    cz:-4.5,
                    ox:0,
                    oy:0.5,
                    oz:0,
                },
                {
                    cx:-0.27,
                    cy:0.83,
                    cz:0.6,
                    ox:0,
                    oy:0.5,
                    oz:-3,
                }
            )
        },
        carOut(){
            this.setAmimateCamera(
                {
                    cx:-0.27,
                    cy:0.83,
                    cz:0.6,
                    ox:0,
                    oy:0.5,
                    oz:-3,
                },
                {
                    cx:4.25,
                    cy:1.4,
                    cz:-4.5,
                    ox:0,
                    oy:0.5,
                    oz:0,
                }
            )
        },
        onClick(e){
            let pointer = {}
            pointer.x = (e.clientX / window.innerWidth) * 2 - 1
            pointer.y = -(e.clientY / window.innerHeight) * 2  + 1

            let vector = new Three.Vector2(pointer.x,pointer.y)
            let raycaster = new Three.Raycaster()   //用于鼠标交互捕捉到点击了什么位置
            raycaster.setFromCamera(vector,this.camera)
            let intersects = raycaster.intersectObjects(this.scene.children);
            intersects.forEach(res=>{
                if(res.object.name == 'Object_32'){
                    if(!this.carSatatus){
                        this.openCar()
                        this.carSatatus = true
                    }else{
                        this.closeCar()
                        this.carSatatus = false
                    } 
                }
            })
        },


        // 模型加载
        init3(){
            let container = document.getElementById('container');
            this.camera = new Three.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
            this.camera.position.set(0,1,10)
            // this.camera.position.z = 2;
            // this.camera.lookAt(new Three.Vector3(10, 10, 1)); // 相机看向

            this.scene = new Three.Scene();
            this.scene.background = new Three.Color("#ccc")
            this.scene.environment = new Three.Color("#ccc")

            // 网格
            const grid = new Three.GridHelper(10,10)
            grid.material.opacity = 0.2
            grid.material.transparent = true
            this.scene.add(grid);

            // var ambient = new Three.AmbientLight(0x444444, 3); //添加光源  颜色和光照强度
            // var axisHelper = new Three.AxesHelper(600); //添加辅助坐标系
            // this.scene.add(ambient, axisHelper);

            this.renderer = new Three.WebGLRenderer({
                antialias: true
            });
            this.renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(this.renderer.domElement);

            // 初始化控制器
            this.controls = new OrbitControls(this.camera, this.renderer.domElement); 
            this.controls.enableDamping = true    //渲染函数调用update 重新计算
            this.controls.target.set(0, 0, 0); // 设置控制器的焦点，使控制器围绕这个焦点进行旋转
            this.controls.minDistance = 0; // 设置移动的最短距离（默认为零）
            this.controls.maxDistance = 15; // 设置移动的最长距离（默认为无穷）
            this.controls.maxPolarAngle = 80 / 360 *2 * Math.PI; //绕垂直轨道的距离（范围是0-Math.PI,默认为Math.PI）
            this.controls.minPolarAngle = 0; 
            this.controls.enablePan = false; //禁用右键功能

            
           
            const glassMaterial = new Three.MeshPhysicalMaterial({
                color:"#793e3e",
                metalness:0.25,  //金属度  ，0代表非金属
                roughness:0,  //粗糙度  越小越光滑
                transmission:1.0   //透光度，玻璃变得真实
            })

            let bodyMaterial = new Three.MeshPhysicalMaterial({
                color:"yellow",
                metalness:0,  //金属度  ，0代表非金属
                roughness:0.1,  //粗糙度  越小越光滑
                clearcoat: 1.0  //喷漆
            })
            const wheelMaterial = new Three.MeshPhysicalMaterial({
                color:"#793e3e",
                metalness:0.25,  //金属度  ，0代表非金属
                roughness:0,  //粗糙度  越小越光滑
                transmission:1.0   //透光度，玻璃变得真实
            })
            const openCar = this.openCar
            const closeCar = this.closeCar
            const carIn = this.carIn
            const carOut = this.carOut
            const gui = new GUI()
            let obj = {
                bodyColor : '#6e2121',
                glassColor:'#aaa',
                wheel:'#000',
                openCar,
                closeCar,
                carIn,
                carOut,
            }
           

            gui.addColor(obj,"bodyColor").name('车声颜色').onChange(val=>{
                bodyMaterial.color.set(val)
            })
            gui.addColor(obj,"glassColor").name('玻璃颜色').onChange(val=>{
                glassMaterial.color.set(val)
            })
            gui.addColor(obj,"glassColor").name('轮胎颜色').onChange(val=>{
                wheelMaterial.color.set(val)
            })

            gui.add(obj,"openCar").name('开车门')
            gui.add(obj,"closeCar").name('关闭车门')
            gui.add(obj,"carIn").name('车内视角')
            gui.add(obj,"carOut").name('车外视角')


            // 汽车
            let loader = new GLTFLoader();
            loader.load('car.glb',  ( gltf )=> {
                const { scene: object } = gltf
                object.traverse((obj)=>{
                    if(obj.name =='Object_32'){
                        this.doors.push(obj)
                    }
                    if(obj.name =='Object_32' || obj.name =='Object_33'){
                        obj.material = bodyMaterial
                        
                    }else if(obj.name =='Object_28'){
                        obj.material = glassMaterial
                    }else if(obj.name =='Object_41' || obj.name =='Object_42' || obj.name =='Object_43' || obj.name =='Object_44'){
                        obj.material = wheelMaterial
                    }
                    // 车模型产生阴影
                    obj.castShadow = true
                })
                this.scene.add(gltf.scene);
            });


            // 添加灯光
            const ambientLight = new Three.AmbientLight(0xe0ffff, 0.6)
            this.scene.add(ambientLight)

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

        loadImage() {
            for (let index = 0; index < 4; index++) {
                let url = require('../../assets/img/c80feff5e075efffc915dfceca2a2692(1).jpg')
                new Three.TextureLoader().load(url,
                    (texture) => {
                        const SIZE = 30;
                        const img = texture.image;
                        let height = (img && img.height) || SIZE;
                        let width = (img && img.width) || SIZE;
                        height = (SIZE / width) * height;
                        width = SIZE;
                        const mat = new Three.MeshBasicMaterial({ map: texture, side: Three.DoubleSide, transparent: true });
                        const geom = new Three.PlaneGeometry(width, height);
                        const mesh = new Three.Mesh(geom, mat);
                       
                        if(index == 0){
                            mesh.position.set(0,height/2,15)
                        }else if(index == 1){
                            mesh.rotateY(-Math.PI / 2)
                            mesh.position.set(15,height/2,0)
                        }
                        else if(index == 2){
                            mesh.rotateY(Math.PI / 2)
                            mesh.position.set(-15,height/2,0)
                        }
                        else if(index == 3){
                            mesh.position.set(0,height/2,-15)
                        }
                        else if(index == 4){
                            mesh.position.set(0,0,0)
                            mesh.rotateX(Math.PI / 2)
                        }else{
                            console.log(99999999999999999);
                        }
                        this.scene.add(mesh);
                    }
                );
            } 
        },

        // 点光源
        createLights() {
            // const ambientLight = new Three.AmbientLight(0xe0ffff, 0.6)
            // this.scene.add(ambientLight)

            // 前后
            const pointLight1 = new Three.PointLight(0xe0ffff, 0.1, 20) 
            pointLight1.position.set(0, 15, -8)
            this.scene.add(pointLight1)
            const pointLightHelper1 = new Three.PointLightHelper(pointLight1, 1)
            this.scene.add(pointLightHelper1)


            const pointLight2 = new Three.PointLight(0xe0ffff, 0.1, 20) 
            // pointLight2.position.set(0, 3, -6)
            this.scene.add(pointLight2)
            const pointLightHelper2 = new Three.PointLightHelper(pointLight2, 1)
            this.scene.add(pointLightHelper2)


            // const pointLight3 = new Three.PointLight(0xe0ffff, 0.1, 20) 
            // pointLight3.position.set(-12, 3, 6)
            // this.scene.add(pointLight3)
            // const pointLightHelper3 = new Three.PointLightHelper(pointLight3, 1)
            // this.scene.add(pointLightHelper3)


            // const pointLight4 = new Three.PointLight(0xe0ffff, 0.1, 20) 
            // pointLight4.position.set(-12, 4, -4)
            // this.scene.add(pointLight4)
            // const pointLightHelper4 = new Three.PointLightHelper(pointLight4, 1)
            // this.scene.add(pointLightHelper4)


            // const pointLight5 = new Three.PointLight(0xe0ffff, 0.1, 20) 
            // pointLight5.position.set(12, 4, -8)
            // this.scene.add(pointLight5)
            // const pointLightHelper5 = new Three.PointLightHelper(pointLight5, 1)
            // this.scene.add(pointLightHelper5)


            // const pointLight6 = new Three.PointLight(0xe0ffff, 0.1, 20) 
            // pointLight6.position.set(12, 4, 0)
            // this.scene.add(pointLight6)
            // const pointLightHelper6 = new Three.PointLightHelper(pointLight6, 1)
            // this.scene.add(pointLightHelper6)


            // const pointLight7 = new Three.PointLight(0xe0ffff, 0.1, 20) 
            // pointLight7.position.set(12, 4, 8)
            // this.scene.add(pointLight7)
            // const pointLightHelper7 = new Three.PointLightHelper(pointLight7, 1)
            // this.scene.add(pointLightHelper7)

            // const pointLight8 = new Three.PointLight(0xe0ffff, 0.1, 20) 
            // pointLight8.position.set(12, 4, 8)
            // this.scene.add(pointLight8)
            // const pointLightHelper8 = new Three.PointLightHelper(pointLight8, 1)
            // this.scene.add(pointLightHelper8)

        },
    }
}
</script>

<style lang="less" scoped>
    #container {
		width: 100%;
        height: 1080px;
	}
    .popup{
        width: 400px;
        height: 400px;
        // background-color: #fff;
        span{
            display: block;
            background-color: aqua;
        }
    }


</style>