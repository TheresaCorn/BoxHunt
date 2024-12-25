import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87CEEB);
document.getElementById('gameContainer').appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.x = 3;
scene.add(sphere);

const boxGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.x = -3;
scene.add(box);

// 创建粒子系统
const particleCount = 1000;
const particleGeometry = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 20;     // x
    particlePositions[i + 1] = (Math.random() - 0.5) * 20; // y
    particlePositions[i + 2] = (Math.random() - 0.5) * 20; // z
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

const particleMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.05,
    transparent: true,
    opacity: 0.8
});

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// 创建玩家
const playerGeometry = new THREE.ConeGeometry(0.3, 1, 8);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.set(0, -2, 0);
scene.add(player);

camera.position.z = 5;

// 玩家颜色切换
const playerColors = [0xffff00, 0xff0080, 0x80ff00, 0x00ffff, 0xff8000, 0x8000ff];
let currentColorIndex = 0;

function changePlayerColor() {
    currentColorIndex = (currentColorIndex + 1) % playerColors.length;
    playerMaterial.color.setHex(playerColors[currentColorIndex]);
}

// 键盘输入处理
const keys = {};
window.addEventListener('keydown', (event) => {
    keys[event.code] = true;
});
window.addEventListener('keyup', (event) => {
    keys[event.code] = false;
});

function animate() {
    requestAnimationFrame(animate);
    
    // 玩家移动逻辑
    const moveSpeed = 0.1;
    if (keys['KeyW'] || keys['ArrowUp']) {
        player.position.y += moveSpeed;
    }
    if (keys['KeyS'] || keys['ArrowDown']) {
        player.position.y -= moveSpeed;
    }
    if (keys['KeyA'] || keys['ArrowLeft']) {
        player.position.x -= moveSpeed;
    }
    if (keys['KeyD'] || keys['ArrowRight']) {
        player.position.x += moveSpeed;
    }
    
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    
    sphere.rotation.x += 0.02;
    sphere.rotation.y += 0.02;
    
    box.rotation.x += 0.015;
    box.rotation.y += 0.015;
    
    // 粒子动画
    particles.rotation.x += 0.001;
    particles.rotation.y += 0.002;
    
    // 相机跟随玩家
    camera.position.x = player.position.x;
    camera.position.y = player.position.y + 2;
    camera.lookAt(player.position);
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);

// 按钮点击事件
document.getElementById('colorButton').addEventListener('click', changePlayerColor);

animate();