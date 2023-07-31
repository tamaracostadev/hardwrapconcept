<template>
  <div class="absolute w-full h-full top-0 z-20" id="scene">
    <div class="color-buttons absolute bottom-5 z-30 w-[100dvw] mx-auto">
      <div class="menu-wrap flex flex-col">
        <div class="menu-materials bg-zinc-950 border-solid border-2 border-secondary p-3 mb-2 rounded-md" :class="{ 'menu-materials': true, 'menu-aberto': menuAberto }">
          <h2 class="font-title  text-3xl mb-3 font-semibold text-secondary">Materiais</h2>
  
          <ul v-for="material in materialsMenu" :key="material.name" >
            <li class="material-item font-title  text-xl" @click="handleMaterialChange(material.type)">
              <button class="material-button font-semibold gradient-menu">{{ material.name }}</button>
            </li>
          </ul>
        </div>
        <div class="color-buttons button-list">
          <button @click="toggleMaterialList" class="color material-list relative bg-zinc-950" :class="{ abrir: menuAberto, fechar: !menuAberto }">
            <div></div>
            <div></div>
            <div></div>
          </button>
          <button @click="handleColorChange('#2516CF')" class="color blue-gradient"></button>
          <button @click="handleColorChange('#EE0F0F')" class="color red-gradient"></button>
          <button @click="handleColorChange('#A0A0A0')" class="color silver-gradient"></button>
          <button @click="handleColorChange('#FFD218')" class="color yellow-gradient"></button>
          <button @click="handleColorChange('#000000')" class="color black-gradient"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { PMREMGenerator } from 'three';
export default {
  name: "ThreeCar",
  components: {},
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      car: null,
      ground: null,
      controls:null,
      mouseX: 0,
      mouseY: 0,
      menuAberto:false,
      breakpoints: {
        mobile: 640,
        tablet: 1024,
        desktop: 1280,
        large: {
          width: 1536,
          fov: 70
        }
      },
      materials: {
        brilhante: { rugosidade: 0, metalicidade: 0.2 },
        cromo: { rugosidade: 0, metalicidade: 0.8 },
        fosco: { rugosidade: 0.15, metalicidade: 0 },
        especial: { rugosidade: 0.15, metalicidade: 1 },
      },

      materialsMenu:[
        {
          name: 'Brilhante',
          type: 'brilhante',
          active: true,
        },
        {
          name: 'Cromo',
          type: 'cromo',
          active: false,
        },
        {
          name: 'Fosco',
          type: 'fosco',
          active: false,
        },
        {
          name: 'Especial',
          type: 'especial',
          active: false,
        }
      ],
      baseCarMaterial: null,
    }
  },
  mounted() {
    this.init();
    this.addMouseEvents();
  },
  methods: {
    handleMaterialChange(materialType) {
      const selectedMaterial = this.materials[materialType];
      const newRoughness = selectedMaterial.rugosidade;
      const newMetalness = selectedMaterial.metalicidade;

      if (this.baseCarMaterial) {
        this.baseCarMaterial.roughness = newRoughness;
        this.baseCarMaterial.metalness = newMetalness;
      }
    },
    handleColorChange(color) {
      if (this.baseCarMaterial) {
        this.baseCarMaterial.color = new THREE.Color(color);
      }
    },

    toggleMaterialList(){
      this.menuAberto = !this.menuAberto;
    },



    init(){
      this.scene = new THREE.Scene();
      const loader = new RGBELoader();

      loader.setDataType(THREE.HalfFloatType);

      this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.x = 0.7486305342326428;
      this.camera.position.y = 0.6954217109842045;
      this.camera.position.z = 4.089570579673683;

      this.renderer = new THREE.WebGLRenderer({ alpha: true
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.toneMapping = THREE.LinearToneMapping;
      this.renderer.toneMappingExposure = 0.9;
      this.renderer.shadowMap.enabled = false;



      const container = document.getElementById('scene');
      container.appendChild(this.renderer.domElement);
      this.addbmw();
      this.addGroundMesh();
      loader.load('/footprint_court_2k.hdr', (texture) => {
        console.log('Textura HDR carregada:', texture);
        const pmremGenerator = new PMREMGenerator(toRaw(this.renderer));
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        console.log('Textura gerada pelo PMREMGenerator:', envMap);

        this.scene.environment = envMap;


        texture.dispose();
        pmremGenerator.dispose();
      }, undefined, (error) => {
        console.error('Erro ao carregar a textura HDR:', error);
      });
      this.addLights();
      this.animate();
    },
    animate() {
      requestAnimationFrame(this.animate);
      if(this.controls){
        this.controls.update();
      }
      this.renderer.render(toRaw(this.scene), this.camera);
    },
    addLights(){
      const ambientLight = new THREE.AmbientLight(0xffffff, 1);
      this.scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
      directionalLight.position.set(10, 10, -10);
      directionalLight.castShadow = true;
      directionalLight.shadow.camera.top = 2;
      directionalLight.shadow.camera.bottom = -2;
      this.scene.add(directionalLight);
      const punconLight = new THREE.PointLight(0x00ff00, 5, 10);
      punconLight.position.set(10, 10, 10);

      this.scene.add(punconLight);

    },
    addbmw(){
      const loader = new GLTFLoader();
      loader.load(
        '/model/bmwpreta.glb',
        (gltf) => {
          console.log(gltf.scene)
          this.car = gltf.scene;
          this.car.rotation.set(-0.02, -0.1, 0);
          this.car.position.set(0.5, -0.5, 0);
          this.car.traverse((o) => {
            if (o.isMesh) {
              if (o.material.name === "base_carro") {
                console.log(o.material)
                this.baseCarMaterial = o.material;
                o.material.metalness = 0.2000;
              }
              o.castShadow = true;
              o.receiveShadow = true;
              o.material.side = THREE.DoubleSide;
            }
          });
          this.scene.add(toRaw(this.car));
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
          console.log(error);
        }
      );
    },
    addGroundMesh(){
      const groundGeometry = new THREE.PlaneGeometry(100, 100);
      const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x000,
        metalness: 0,
        roughness: 1 ,
      });
      this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
      this.ground.rotation.x = (-Math.PI / 2)-0.02;
      this.ground.position.y = -0.47;
      this.ground.receiveShadow = true;
      this.scene.add(toRaw(this.ground));
    },
    addMouseEvents(){
      this.controls = new OrbitControls(toRaw(this.camera), this.renderer.domElement);
      this.controls.enableRotate = true; // Habilita a rotação com o mouse
      this.controls.enableZoom = true; // Habilita o zoom com o mouse
      this.controls.enablePan = true; // Habilita o pan com o mouse
      this.controls.rotateSpeed = 0.2; // Velocidade da rotação
      this.controls.minPolarAngle = (Math.PI / 2)-0.18;
      this.controls.maxPolarAngle = (Math.PI / 2)-0.18;
      this.controls.minAzimuthAngle = -Math.PI / 2; // Limita o ângulo mínimo de rotação da câmera
      this.controls.maxAzimuthAngle = Math.PI / 2; // Limita o ângulo máximo de rotação da câmera

      // Eventos do mouse para obter as coordenadas do mouse
      //this.renderer.domElement.addEventListener('mousemove', this.onDocumentMouseMove);
      //this.renderer.domElement.addEventListener('mousedown', this.onDocumentMouseDown);
      this.renderer.domElement.addEventListener('mouseup', this.onDocumentMouseUp);
    },
    onDocumentMouseMove(event) {
      event.preventDefault();
      // Obtém as coordenadas do mouse relativas ao elemento da cena (canvas)
      this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    },

    onDocumentMouseDown(event) {
      event.preventDefault();
      // Você pode adicionar lógica aqui caso queira realizar alguma ação quando o usuário clicar no objeto
    },

    onDocumentMouseUp(event) {
      event.preventDefault();
      /*console posicionamento da câmera e car rotation*/
      console.log("camera",this.camera.position)
      // Você pode adicionar lógica aqui caso queira realizar alguma ação quando o usuário soltar o clique do mouse
    },
  }
};
</script>
<style lang="scss">
.color-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  .color{
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: 2px solid #A79871;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover{
      transform: scale(1.2);
    }
  }
}


.black-gradient{
  background-image: linear-gradient(to right, #000000,#3d3629, #000000);
}
.yellow-gradient{
  background-image: linear-gradient(to right, #a98714, #ffd16c, #a98714);
}
.silver-gradient{
  background-image: linear-gradient(to right, #626262, #c5c5c5, #626262);
}
.red-gradient{
  background-image: linear-gradient(to right, #862a2a, #ff3d3d, #862a2a);
}
.blue-gradient{
  background-image: linear-gradient(to right, #1c3dab, #2c5cff, #1c3dab);
}

.material-item{
  padding-left:0;
  transition: all 0.4s ease;

  &:hover, &.active{
    padding-left: 16px;
  }
}

/* Estilo das bolinhas do botão */
.material-list div {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #c7b686;
  position: absolute;
  left: calc(50% - 2px);
  transition: all 0.3s ease;
}

/* Posições das bolinhas quando o menu está fechado */
.material-list.fechar div:nth-child(1) {
  top: 15%;
}

.material-list div:nth-child(2) {
  top: 50%;
  transform: translateY(-50%);
}

.material-list.fechar div:nth-child(3) {
  bottom: 15%;
}

/* Posições das bolinhas quando o menu está aberto */
.material-list.abrir div:nth-child(1) {
  top: 50%;
  left:75%;
  transform: translateY(-50%);
}
.material-list.abrir div:nth-child(3) {
  top: 50%;
  left: 15%;
  transform: translateY(-50%);
}
.menu-materials {
  height: 0;
  width:0;
  opacity:0;
  overflow: hidden;
  transition: all 0.5s ease;
}
.menu-aberto {
  height: 200px;
  width:250px;
  opacity:1; 
}
</style>
