import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import waterVertexShader from './shaders/water/vertex.glsl'
import waterfragmentShader from './shaders/water/fragment.glsl'
import { UnzipPassThrough } from 'three/examples/jsm/libs/fflate.module.js'
 console.log(waterVertexShader)
 console.log(waterfragmentShader)
/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })
const debugObject = {}
// Canvas
const canvas = document.querySelector('canvas.webgl')


const scene = new THREE.Scene()
//color
debugObject.depthColor = '#186691'
debugObject.surfaceColor = '#9bd8ff'
/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(20,20,412,412)

scene.background = new THREE.Color( 0x87CEEB );
// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader:waterVertexShader,
    fragmentShader:waterfragmentShader,
    uniforms:{
        uTime:{value:0},
       uBigWavesElevation:{value :0.2},
        uBigWavesfrequency:{value:new THREE.Vector2(4,1.5)},
        uBigWavesspeed:{value:0.75},

        uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
        uColorOffset: { value: 0.08 },
        uColorMultiplier: { value: 5 },
        uSmallWavesElevation: { value: 0.15 },
        uSmallWavesFrequency: { value: 2 },
        uSmallWavesSpeed: { value: 0.3 },
        uSmallIterations: { value: 23},
    }
})
gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).onChange('uBigWavesElevation')
gui.add(waterMaterial.uniforms.uBigWavesfrequency.value, 'x').min(0).max(1).step(0.001).name('uBigWavesfrequency')
gui.add(waterMaterial.uniforms.uBigWavesfrequency.value, 'y').min(0).max(1).step(0.001).name('uBigWavesfrequency')
gui.add(waterMaterial.uniforms.uBigWavesspeed, 'value').min(0).max(4).step(0.001).name('uBigWavesspeed')
gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001).name('uSmallWavesElevation')
gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value').min(0).max(30).step(0.001).name('uSmallWavesFrequency')
gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.001).name('uSmallWavesSpeed')
gui.add(waterMaterial.uniforms.uSmallIterations, 'value').min(0).max(5).step(1).name('uSmallIterations')
gui.addColor(debugObject, 'depthColor').onChange(() => { waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor) })
gui.addColor(debugObject, 'surfaceColor').onChange(() => { waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor) })
// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
// water
    
    waterMaterial.uniforms.uTime.value=elapsedTime
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
