document.addEventListener("DOMContentLoaded", () => {
    // Scene setup
    const container = document.getElementById("three-container");
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 100;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.insertBefore(renderer.domElement, container.firstChild); // Insert before the glow effect

    // Create a deep galaxy/nebula background mesh
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00ffcc, 2, 300);
    pointLight.position.set(0, 0, 50);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x7800ff, 2, 300);
    pointLight2.position.set(50, 50, 50);
    scene.add(pointLight2);

    // Create floating particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 800;

    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    const color1 = new THREE.Color(0x00ffcc); // Cyan
    const color2 = new THREE.Color(0x7800ff); // Purple
    const color3 = new THREE.Color(0x00c8ff); // Light Blue

    for (let i = 0; i < particlesCount * 3; i += 3) {
        // Spread particles across the screen
        posArray[i] = (Math.random() - 0.5) * 300;     // x
        posArray[i + 1] = (Math.random() - 0.5) * 300;   // y
        posArray[i + 2] = (Math.random() - 0.5) * 200;   // z

        // Randomize colors
        const rand = Math.random();
        let mixedColor = color1.clone();
        if (rand > 0.66) mixedColor = color2.clone();
        else if (rand > 0.33) mixedColor = color3.clone();

        colorArray[i] = mixedColor.r;
        colorArray[i + 1] = mixedColor.g;
        colorArray[i + 2] = mixedColor.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Rotate the entire particle system slowly
        particlesMesh.rotation.y += 0.0005;
        particlesMesh.rotation.x += 0.0002;

        // Make particles undulate (wave effect)
        const positions = particlesMesh.geometry.attributes.position.array;
        for (let i = 0; i < particlesCount; i++) {
            const i3 = i * 3;
            const x = particlesMesh.geometry.attributes.position.array[i3];
            // Update Y based on Sine wave and time
            particlesMesh.geometry.attributes.position.array[i3 + 1] += Math.sin(elapsedTime + x) * 0.02;
        }
        particlesMesh.geometry.attributes.position.needsUpdate = true;

        // Smooth mouse follow
        targetX = mouseX * 0.05;
        targetY = mouseY * 0.05;

        // Move camera slightly based on mouse
        camera.position.x += (targetX - camera.position.x) * 0.02;
        camera.position.y += (-targetY - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        // Move lights based on mouse to create dynamic shadows/glows
        pointLight.position.x = targetX;
        pointLight.position.y = -targetY;

        renderer.render(scene, camera);
    }

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // optimize for high DPI
    });
});
