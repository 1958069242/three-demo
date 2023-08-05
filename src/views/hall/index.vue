<template>
    <div class="webGl-page">
        <!-- 开启漫游 -->
        <!-- <div class="open" @click="open">开启漫游</div> -->
        <div id="container"></div>
        <!-- 交互点 -->
        <!-- <div class="point" v-for="(item, index) in points" :key="index"  @click="handlePoint(point)">
            <i class="icon" >{{ item.name }}</i>
        </div> -->
    </div>
</template>

<script>
import TWEEN from '@tweenjs/tween.js'
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
            mesh:null,
            points: [
                {
                    name:'点位1',
                    position: new Three.Vector3(-6, 2, -8),
                },
                {
                    name:'点位2',
                    position: new Three.Vector3(-12, 4, 9),
                },
                {
                    name:'点位3',
                    position: new Three.Vector3(6, 0, -8),
                },
                {
                    name:'点位4',
                    position: new Three.Vector3(8, 0, -8),
                },
                {
                    name:'点位5',
                    position: new Three.Vector3(12, 0, -8),
                },
                {
                    name:'点位6',
                    position: new Three.Vector3(20, 10, -8),
                },
            ],
            positionObj:null,
            mouse: new Three.Vector2(),
            raycaster: new Three.Raycaster(),
        }
    },
    created(){},
    mounted(){
        this.init()
        this.animate()
        window.onclick = this.onMouseClick;
    },
    open(){

    },
    methods:{
        handlePoint(){

        },
        animate(){
            requestAnimationFrame(this.animate)
            this.renderer.render(this.scene, this.camera); //执行渲染操作
            TWEEN.update()
        },
        init(){
            this.initCam()
            this.initLight()
            this.initSpotLight()
            // this.initFloor()
            this.initModel()
            this.initCylineder()
        },
        initCylineder(){
            // const geometry = new Three.BoxGeometry(200,400,500)
            // const material = new Three.MeshPhysicalMaterial({
            //     color:0x6c6c6c,
            //     side:Three.DoubleSide,
            // })
            // const mesh = new Three.Mesh(geometry,material)
            // this.scene.add(mesh)
        },
        // 空间坐标转二维坐标
        // transPosition(position) {
        //     let world_vector = new THREE.Vector3(position.x, position.y, position.z);
        //     let vector = world_vector.project(camera);
        //     let halfWidth = window.innerWidth / 2,
        //         halfHeight = window.innerHeight / 2;
        //     return {
        //         x: Math.round(vector.x * halfWidth + halfWidth),
        //         y: Math.round(-vector.y * halfHeight + halfHeight),
        //     };
        // },

        initPoint(){
            const tick = ()=>{
                const raycaster = new Three.Raycaster();
                if (this.renderer) {
                    for (const point of this.points) {
                        const screenPosition = point.position.clone();
                        // const pos = screenPosition.project(this.camera);
                        // 获得一条和相机朝向一直，从鼠标点射出去的射线
                        raycaster.setFromCamera(screenPosition, this.camera);
                        // 调用射线与物体相交的检测函数intersectObjects
                        const intersects = raycaster.intersectObjects(this.scene.children, true);
                        console.log('intersects',intersects);
                    //     point.element.classList.add('visible');
                    //     if (intersects.length === 0) {
                    //         // 未找到相交点，显示
                    //         point.element.classList.add('visible');
                    //     } else {
                    //         // 获取相交点的距离和点的距离
                    //         const intersectionDistance = intersects[0].distance;
                    //         const pointDistance = point.position.distanceTo(this.camera.position);
                    //         // 相交点距离比点距离近，隐藏；相交点距离比点距离远，显示
                    //         intersectionDistance < pointDistance
                    //             ? point.element.classList.remove("visible")
                    //             : point.element.classList.add("visible");
                    //     }
                    //     // 物体转动到背面时隐藏，否则显示
                    //     pos.z > 1
                    //         ? point.element.classList.remove("visible")
                    //         : point.element.classList.add("visible");

                    //     const translateX = screenPosition.x * window.innerWidth * 0.5;
                    //     const translateY = -screenPosition.y * window.innerHeight * 0.5;
                    //     point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
                    }
                    this.controls && this.controls.update()
                    TWEEN && TWEEN.update()
                    // 更新渲染器
                    this.renderer.render(this.scene, this.camera)
                }
            }
            tick()
        },
        initLight(){
            var point = new Three.PointLight(0xffffff);
            point.position.set(-5,10,1);
            this.scene.add(point);
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
            let floorGeometry = new Three.PlaneGeometry(100,100)  //平面几何
            const material = new Three.MeshPhysicalMaterial({
                color:0x808080,
                side:Three.DoubleSide,
                metalness:0,  //金属度  ，0代表非金属
                roughness:0.1   //粗糙度  越小越光滑
            })
            const mesh = new Three.Mesh(floorGeometry,material)
            mesh.rotation.x = Math.PI/2
            this.scene.add(mesh)
        },

        initCam(){
            let container = document.getElementById('container');
            this.camera = new Three.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
            this.camera.position.set(-100,10,80)

            this.scene = new Three.Scene();
            this.scene.background = new Three.Color("#ccc")
            this.scene.environment = new Three.Color("#ccc")

            const grid = new Three.GridHelper(100,100)
            grid.material.opacity = 0.2
            grid.material.transparent = true
            this.scene.add(grid);

            var ambient = new Three.AmbientLight(0x444444, 3); //添加光源  颜色和光照强度
            var axisHelper = new Three.AxesHelper(600); //添加辅助坐标系
            this.scene.add(ambient, axisHelper);

            this.renderer = new Three.WebGLRenderer({
                antialias: true
            });
            this.renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(this.renderer.domElement);

            // 初始化控制器
            this.controls = new OrbitControls(this.camera, this.renderer.domElement); 
            this.controls.minDistance = 1; // 设置移动的最短距离（默认为零）
            this.controls.maxDistance = 1000; // 设置移动的最长距离（默认为无穷）
            // this.controls.maxPolarAngle = 80 / 360 *2 * Math.PI; //绕垂直轨道的距离（范围是0-Math.PI,默认为Math.PI）
            // this.controls.minPolarAngle = 0; 
            // this.controls.enableDamping = true
            this.controls.minPolarAngle = 0;
            this.controls.maxPolarAngle = 1.5;
        },

        initModel(){
            let loader = new GLTFLoader();
            loader.load('hall1.glb',  ( gltf )=> {
                this.scene.add(gltf.scene);
            })
        },
        // 鼠标点击模型
        onMouseClick(event) {
           
            console.log(event);
            //通过鼠标点击的位置计算出raycaster所需要的点的位置，以屏幕中心为原点，值的范围为-1到1
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / (window.innerHeight - 50)) * 2 + 1;
            console.log('this.mouse',this.mouse);
            // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
            this.raycaster.setFromCamera(this.mouse, this.camera);
            // 获取raycaster直线和所有模型相交的数组集合
            let intersects = this.raycaster.intersectObjects(this.scene.children);
            if (!intersects[0]) {
                return;
            } else {
                this.positionObj = {
                    x: intersects[0].point.x,
                    y: intersects[0].point.y,
                    z: intersects[0].point.z,
                }
                this.initTween(
                    this.positionObj.x,
                    this.positionObj.y,
                    this.positionObj.z,
                )
            }
        },

        // 相机移动动画
        initTween(targetX, targetY, targetZ) {
            // 获取当前相机位置
            let initPosition = {
                x: this.camera.position.x,
                y: this.camera.position.y,
                z: this.camera.position.z,
            };
            //定义相机移动方法
            let tween = new TWEEN.Tween(initPosition)
                .to({ x: targetX, y: 10, z: targetZ }, 3000)
                .easing(TWEEN.Easing.Sinusoidal.Out);
            
            tween.onUpdate((that)=>{
                // if (that.z < 0) {
                //     this.camera.position.set(that.x, that.y, that.z);
                // } else {
                //     this.camera.position.set(that.x, that.y, 12);
                // }
                this.camera.position.set(that.x,that.y,that.z)
                // this.controls.target.set(that.x,that.y,-10) 
            })
            // this.controls.update();
            tween.start();
             //设置相机target位置（看向坐标轴零点的位置）
            this.controls.target.set(0, 0, 0);
            //相机返回原点后，开启模型自动旋转
            // this.controls.autoRotate = true;
        }
    }  
}
</script>

<style>
    #container {
        cursor: pointer;
		width: 100%;
        height: 1080px;
	}
.open{
    cursor: pointer;
    background-color: #fff;
    padding: 10px;
    /* color: #fff; */
    position: absolute;
    top: 20px;
    left: 20px;
}
</style>