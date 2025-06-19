import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Face3DProps {
  emotion: 'neutral' | 'happy' | 'sad' | 'anxious';
  isSpeaking: boolean;
}

const Face3D: React.FC<Face3DProps> = ({ emotion, isSpeaking }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const faceRef = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.MeshPhongMaterial | null>(null);
  const leftEyeRef = useRef<THREE.Mesh | null>(null);
  const rightEyeRef = useRef<THREE.Mesh | null>(null);
  const mouthRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create a simple face geometry
    const geometry = new THREE.SphereGeometry(2, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: 0xffcc99,
      specular: 0x111111,
      shininess: 30
    });
    materialRef.current = material;
    const face = new THREE.Mesh(geometry, material);
    scene.add(face);
    faceRef.current = face;

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.18, 16, 16);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.6, 0.5, 1.7);
    rightEye.position.set(0.6, 0.5, 1.7);
    face.add(leftEye);
    face.add(rightEye);
    leftEyeRef.current = leftEye;
    rightEyeRef.current = rightEye;

    // Mouth (ellipse/arc)
    const mouthShape = new THREE.Shape();
    mouthShape.absarc(0, 0, 0.6, 0, Math.PI, false);
    const mouthGeometry = new THREE.ShapeGeometry(mouthShape, 32);
    const mouthMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    mouth.position.set(0, -0.7, 1.7);
    mouth.rotation.x = Math.PI;
    face.add(mouth);
    mouthRef.current = mouth;

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (faceRef.current) {
        faceRef.current.rotation.y += 0.005;
        if (isSpeaking && mouthRef.current) {
          mouthRef.current.scale.y = 1 + Math.abs(Math.sin(Date.now() * 0.02)) * 0.5;
        } else if (mouthRef.current) {
          mouthRef.current.scale.y = 1;
        }
      }
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      scene.clear();
    };
  }, []);

  // Update face expression based on emotion
  useEffect(() => {
    if (!materialRef.current || !mouthRef.current || !leftEyeRef.current || !rightEyeRef.current) return;
    // Reset
    mouthRef.current.scale.set(1, 1, 1);
    mouthRef.current.position.set(0, -0.7, 1.7);
    leftEyeRef.current.scale.set(1, 1, 1);
    rightEyeRef.current.scale.set(1, 1, 1);
    leftEyeRef.current.position.set(-0.6, 0.5, 1.7);
    rightEyeRef.current.position.set(0.6, 0.5, 1.7);
    switch (emotion) {
      case 'happy':
        materialRef.current.color.setHex(0xffe0b2);
        mouthRef.current.rotation.z = 0;
        mouthRef.current.scale.y = 1.2;
        mouthRef.current.position.y = -0.5;
        break;
      case 'sad':
        materialRef.current.color.setHex(0xcc9999);
        mouthRef.current.rotation.z = Math.PI;
        mouthRef.current.scale.y = 0.8;
        mouthRef.current.position.y = -0.9;
        break;
      case 'anxious':
        materialRef.current.color.setHex(0x99cc99);
        mouthRef.current.rotation.z = 0;
        mouthRef.current.scale.y = 0.5;
        mouthRef.current.position.y = -0.7;
        leftEyeRef.current.scale.y = 0.7;
        rightEyeRef.current.scale.y = 0.7;
        break;
      default:
        materialRef.current.color.setHex(0xffcc99);
        mouthRef.current.rotation.z = 0;
        mouthRef.current.scale.y = 1;
        mouthRef.current.position.y = -0.7;
    }
  }, [emotion]);

  return (
    <div className="aspect-square w-full bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default Face3D;