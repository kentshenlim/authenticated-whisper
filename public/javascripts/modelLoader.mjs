import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';

const { GLTFLoader } = THREE; // From loaded script in HTML

// Load gltf file (3D model)
(() => {
  function loadModel({
    model,
    rendererWidth,
    rendererHeight,
    cameraPositionZ,
  }) {
    // Init
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      100,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    let object; // 3D object
    let controls; // OrbitControls
    const loader = new GLTFLoader(); // Loader for gltf

    // Load the file
    loader.load(
      model,
      (gltf) => {
        // If the file is loaded, add it to the scene
        object = gltf.scene;
        scene.add(object); // Add this loaded object into scene to be rendered later
      },
      () => {
        // While it is loading, log the progress
        // console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        // If there is an error, log it
        console.error(error);
      },
    );

    // Instantiate a new renderer and set its size
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(rendererWidth, rendererHeight);

    // Camera and light
    camera.position.z = cameraPositionZ;
    // camera.position.y += 1;
    // camera.position.x += 3;
    camera.fov = 50; // Zoom in
    camera.zoom = 0.5;
    const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
    topLight.position.set(500, 500, 500); // top-left-ish
    topLight.castShadow = true;
    scene.add(topLight);
    const ambientLight = new THREE.AmbientLight(0x333333, 1);
    scene.add(ambientLight);

    // Allows orbit controls
    controls = new OrbitControls(camera, renderer.domElement);

    // Render the scene
    function animate() {
      requestAnimationFrame(animate);
      if (object) object.rotation.y += 0.01;
      renderer.render(scene, camera);
    }

    // Camera and window responsive
    function handleResize() {
      const container = document.getElementById('model');
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', handleResize);
    handleResize(); // First run

    // Cleanup function for React effect
    function cleanUp() {
      renderer.dispose();
      window.removeEventListener('resize', handleResize);
    }

    // Start the 3D rendering
    animate();

    return { domElement: renderer.domElement, cleanUp };
  }

  const container = document.getElementById('model');
  container.appendChild(
    loadModel({
      model: '/images/earth_hologram.glb',
      rendererWidth: window.innerWidth * 0.8,
      rendererHeight: window.innerHeight * 0.8,
      cameraPositionZ: 1,
    }).domElement,
  );
})();
