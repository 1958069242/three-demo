<template>
    <div class="webGl-page">
        <div id="container"></div>
         <!-- 场景切换点 -->
        <div class="switch">
            <span class="button" v-for="(room, index) in rooms" :key="index" @click="handleSwitch(room.key)" v-show="room.key !== currentRoom">
                <b class="text">{{ room.name }}</b>
                <i class="icon"></i>
            </span>
        </div>

        <!-- 交互点 -->
        <div  class="point"  v-for="(point, index) in interactivePoints" :key="index" 
            :class="[`point-${index}`, `point-${point.key}`]"
            @click="handlePoint(point)"
           >
            <div class="label" :class="[`label-${index}`, `label-${point.key}`]">
                <div class="label-tips">
                    <div class="cover">
                        <i  class="icon" :style="{ 'background': `url(${point.cover}) no-repeat center`, 'background-size': 'contain'}"></i>
                    </div>
                    <div class="info">
                        <p class="p1">{{ point.value }}</p>
                        <p class="p2">{{ point.description }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as Three from 'three'
import TWEEN from '@tweenjs/tween.js'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { VRButton } from 'three/addons/webxr/VRButton.js';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
export default {
    data(){
        return{
            renderer: '', //渲染器
            scene: '', //场景
            light: '', //光源
            camera: '', //相机
            controls: '', //控制器
            mesh:null,
            currentRoom: 'living-room',
            rooms:[
                {
                    name: '客厅',
                    key: 'living-room',
                    map: require('../../assets/images/map/map_living_room.jpg'),
                    showSwitch: true,
                    position: new Three.Vector3(0, 0, 0),
                    interactivePoints: [
                        {
                            key: 'tv',
                            value: '电视机',
                            description: '智能电视',
                            cover: require('../../assets/images/home/cover_living_room_tv.png'),
                            // cover: new URL('@/assets/images/home/cover_living_room_tv.png', import.meta.url).href,
                            position: new Three.Vector3(-6, 2, -8),
                        },
                        {
                            key: 'fridge',
                            value: '冰箱',
                            description: '豪华冰箱',
                            cover: require('../../assets/images/home/cover_living_room_fridge.png'),
                            // cover: new URL('@/assets/images/home/cover_living_room_fridge.png', import.meta.url).href,
                            position: new Three.Vector3(-12, 4, 9),
                        },
                        {
                            key: 'sofa',
                            value: '沙发',
                            description: '舒适沙发',
                            cover: require('../../assets/images/home/cover_living_room_sofa.png'),
                            // cover: new URL('@/assets/images/home/cover_living_room_sofa.png', import.meta.url).href,
                            position: new Three.Vector3(6, 0, -8),
                        },
                    ],
                },
                {
                    name: '卧室',
                    key: 'bed-room',
                    map: require('../../assets/images/map/map_bed_room.jpg'),
                    showSwitch: true,
                    position: new Three.Vector3(-32, 0, 0),
                    interactivePoints: [
                        {
                            key: 'bed',
                            value: '床',
                            description: '温暖的床',
                            cover: require('../../assets/images/home/cover_bed_room_bed.png'),
                            // cover: new URL('@/assets/images/home/cover_bed_room_bed.png', import.meta.url).href,
                            position: new Three.Vector3(-38, 2, -14),
                        },
                    ],
                },
                {
                    name: '书房',
                    key: 'study-room',
                    map: require('../../assets/images/map/map_study_room.jpg'),
                    showSwitch: true,
                    position: new Three.Vector3(32, 0, 0),
                    interactivePoints: [
                        {
                            key: 'art',
                            value: '艺术品',
                            description: '绝版作品',
                            cover: require('../../assets/images/home/cover_study_room_art.png'),
                            // cover: new URL('@/assets/images/home/cover_study_room_art.png', import.meta.url).href,
                            position: new Three.Vector3(42, 6, -8),
                        },
                    ]
                },
            ]
        }
    },
    created(){
        
    },
    mounted(){
        this.init()
        this.animate()
        this.initPoint()
          // 页面重绘时调用自身
        // window.requestAnimationFrame(this.initPoint);
    },
    computed:{
        interactivePoints(){
            const res = [];
            this.rooms.forEach((room) => {
                if (room.interactivePoints && room.interactivePoints.length > 0) {
                    room.interactivePoints.forEach((point) => {
                        point = {
                            room: room.key,
                            ...point,
                        };
                        res.push(point);
                    })
                }
            })
            return res;
        }
    },
    methods:{
        animate(time){
            requestAnimationFrame(this.animate)
            TWEEN.update(time)
            // this.initPoint()
            this.renderer.render(this.scene, this.camera); //执行渲染操作
        },

        initPoint(){
            const tick = ()=>{
                    // 添加交互点
                const raycaster = new Three.Raycaster();
                // 室内悬浮标记物
                const _points = this.interactivePoints.map((item, index) => ({
                    ...item,
                    element: document.querySelector(`.point-${index}`),
                }))
                console.log('_points',_points);
                if (this.renderer) {
                    for (const point of _points) {
                        const screenPosition = point.position.clone();
                        const pos = screenPosition.project(this.camera);
                        raycaster.setFromCamera(screenPosition, this.camera);
                        const intersects = raycaster.intersectObjects(this.scene.children, true);
                        console.log('intersects',intersects);
                        point.element.classList.add('visible');
                        if (intersects.length === 0) {
                            // 未找到相交点，显示
                            point.element.classList.add('visible');
                        } else {
                            // 获取相交点的距离和点的距离
                            const intersectionDistance = intersects[0].distance;
                            const pointDistance = point.position.distanceTo(this.camera.position);
                            // 相交点距离比点距离近，隐藏；相交点距离比点距离远，显示
                            intersectionDistance < pointDistance
                                ? point.element.classList.remove("visible")
                                : point.element.classList.add("visible");
                        }
                        // 物体转动到背面时隐藏，否则显示
                        pos.z > 1
                            ? point.element.classList.remove("visible")
                            : point.element.classList.add("visible");

                        const translateX = screenPosition.x * window.innerWidth * 0.5;
                        const translateY = -screenPosition.y * window.innerHeight * 0.5;
                        point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
                    }
                    this.controls && this.controls.update()
                    TWEEN && TWEEN.update()
                    // 更新渲染器
                    this.renderer.render(this.scene, this.camera)
                }
            }
            tick()
            // window.requestAnimationFrame(tick);
        },

        handlePoint(key){
            let start = {
                x1: key.position.x, // 相机x
                y1: key.position.y, // 相机y
                z1: key.position.z, // 相机z
                x2: this.controls.target.x, // 控制点的中心点x
                y2: this.controls.target.y, // 控制点的中心点y
                z2: this.controls.target.z, // 控制点的中心点z
            }
            let end ={
                x1: 0,
                y1: 0,
                z1: 0,
                x2: 0,
                y2: 0,
                z2: 2,
            }
            let tween = new TWEEN.Tween(start).to(end,2000).easing(TWEEN.Easing.Quadratic.Out)
            tween.onUpdate((that)=>{
                this.camera.position.set(that.x1,that.y1,that.z1)
                this.controls.target.set(that.x2,that.y2,that.z2)
                this.controls.update();
            })
            tween.start()
            this.animate()
        },

        handleSwitch(key){
            this.scene.children = []
            const room = this.rooms.filter((item) => item.key === key)[0]
            this.createRoom(room.key, room.position, room.map);
            this.currentRoom = room.key;
            const x = room.position.x;
            const y = room.position.y;
            // const z = room.position.z;
            let start = {
                x1: this.camera.position.x, // 相机x
                y1: this.camera.position.y, // 相机y
                z1: this.camera.position.z, // 相机z
                x2: this.controls.target.x, // 控制点的中心点x
                y2: this.controls.target.y, // 控制点的中心点y
                z2: this.controls.target.z, // 控制点的中心点z
            }
            let end ={
                x1: x,
                y1: y,
                z1: 0,
                x2: x,
                y2: y,
                z2: 2,
            }
            let tween = new TWEEN.Tween(start).to(end,2000).easing(TWEEN.Easing.Quadratic.Out)
            tween.onUpdate((that)=>{
                this.camera.position.set(that.x1,that.y1,that.z1)
                this.controls.target.set(that.x2,that.y2,that.z2)
                this.controls.update();
            })
            tween.start()
            this.animate()
            this.initPoint()
        },


        // 球形贴图
        init(){
            let container = document.getElementById('container');
            this.camera = new Three.PerspectiveCamera(65, container.clientWidth / container.clientHeight, 0.1, 1000);
            this.camera.position.set(0,0,2)
            this.scene = new Three.Scene();
            this.renderer = new Three.WebGLRenderer({
                antialias: true
            });
            //指定渲染器的高宽(和画布框的大小一致)
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(container.clientWidth, container.clientHeight);

            container.appendChild(this.renderer.domElement);
            this.controls = new OrbitControls(this.camera, this.renderer.domElement); // 初始化控制器
            this.controls.target.set(0, 0, 8);
            this.controls.enableDamping = true;
            this.controls.enablePan = false;
            // 缩放限制
            this.controls.minDistance = 12;
            this.controls.maxDistance = 20;
            // this.rooms.map(item=>{
            //     const room = this.createRoom(item.key, item.position, item.map);
            //     console.log(room);
            //     return room;
            // })
            this.handleSwitch(this.currentRoom)
        },
        createRoom(name,position,map){
            let sphereGeometry = new Three.SphereGeometry(200, 60, 60);
            sphereGeometry.scale(-1, 1, 1);
            var textureLoader = new Three.TextureLoader();
            const texture = textureLoader.load(map);
            const material = new Three.MeshBasicMaterial(
                {
                    map: texture,
                    side: Three.DoubleSide
                })
            const room = new Three.Mesh(sphereGeometry, material);
            room.name = name;
            room.position.set(position.x, position.y, position.z);
            room.rotation.y = Math.PI / 2;
            this.scene.add(room);
            return room;
        },
    }
}
</script>

<style lang="less">
    #container {
		width: 100%;
        height: 1080px;
	}
    .switch{
        position: fixed;
        right: 24px;
        top: 40%;
        z-index: 100;
        .button{
            width: 80px;
            color: #fff;
            display: block;
            background-color: rgba(27, 25, 24, .3);
            border-radius: 6px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            text-align: center;
            padding: 12px 8px 12px 24px;
            cursor: pointer;
        }
    }

    .point{
        // background-color: antiquewhite;
        position: fixed;
        top: 50%;
        left: 50%;
        z-index:10;
    }
 
      
    .label-sofa{
        .label-tips
         {
            display: flex;
            justify-content: space-between;
            left: -220px;
            flex-direction: row-reverse;
         }
    }
       
    .label{
        transform: scale(0, 0);
        width: 120px;
        height: 60px;
        background: rgba(255, 255, 255, .6);
        border-radius: 10px;
        padding: 10px;
        text-align: center;
        line-height: 32px;
        font-weight: 100;
        font-size: 14px;
        cursor: help;
        .label-tips{
            display: flex;
            justify-content: space-between;
            .info{
                .p1{
                    font-size: 16px;
                    font-weight: bold;
                }
            }
            .cover{
                width:20%;
                height: 60px;
                .icon{
                    display: block;
                    width: 100%;
                    height: 100%;
                }
            }
            
        }
    }
    .visible .label{
        transform: scale(1, 1);
    }
</style>