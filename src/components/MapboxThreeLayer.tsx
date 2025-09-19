import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { createRoot } from 'react-dom/client';
import SpringHillHotel from './3d/SpringHillHotel';
import mapboxgl from 'mapbox-gl';

interface MapboxThreeLayerOptions {
  id: string;
  onUmbrellaClick?: (id: string) => void;
  selectedUmbrella?: string;
}

export class MapboxThreeLayer implements mapboxgl.CustomLayerInterface {
  id: string;
  type: 'custom' = 'custom';
  renderingMode: '2d' | '3d' = '3d';
  
  private map?: mapboxgl.Map;
  private camera?: THREE.Camera;
  private scene?: THREE.Scene;
  private renderer?: THREE.WebGLRenderer;
  private world?: THREE.Group;
  private onUmbrellaClick?: (id: string) => void;
  private selectedUmbrella?: string;

  constructor(options: MapboxThreeLayerOptions) {
    this.id = options.id;
    this.onUmbrellaClick = options.onUmbrellaClick;
    this.selectedUmbrella = options.selectedUmbrella;
  }

  onAdd(map: mapboxgl.Map, gl: WebGLRenderingContext) {
    this.map = map;

    // Camera setup
    this.camera = new THREE.Camera();
    this.scene = new THREE.Scene();

    // Create renderer using existing WebGL context
    this.renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvasContainer().querySelector('canvas')!,
      context: gl,
      antialias: true
    });

    this.renderer.autoClear = false;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // World group for coordinate transformation
    this.world = new THREE.Group();
    this.scene.add(this.world);

    // Create a container for the React Three Fiber scene
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.pointerEvents = 'none';
    container.style.width = '100%';
    container.style.height = '100%';
    
    // We'll render our SpringHill hotel directly in the Three.js scene
    this.addHotelToScene();
  }

  private addHotelToScene() {
    if (!this.world) return;

    // Convert lat/lng to world coordinates
    const modelOrigin = [-85.8764, 30.1766] as [number, number];
    const modelAltitude = 0;
    const modelRotate = [Math.PI / 2, 0, 0];

    const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
      modelOrigin,
      modelAltitude
    );

    // Transformation parameters
    const modelTransform = {
      translateX: modelAsMercatorCoordinate.x,
      translateY: modelAsMercatorCoordinate.y,
      translateZ: modelAsMercatorCoordinate.z || 0,
      rotateX: modelRotate[0],
      rotateY: modelRotate[1],
      rotateZ: modelRotate[2],
      scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
    };

    // Create the hotel geometry manually since we can't use React components in raw Three.js
    this.createHotelGeometry(modelTransform);
  }

  private createHotelGeometry(transform: any) {
    if (!this.world) return;

    // Apply transformation
    this.world.scale.set(transform.scale, -transform.scale, transform.scale);
    this.world.rotation.set(transform.rotateX, transform.rotateY, transform.rotateZ);
    this.world.position.set(transform.translateX, transform.translateY, transform.translateZ);

    // Hotel building materials
    const buildingMaterial = new THREE.MeshStandardMaterial({ 
      color: '#E8F4FD',
      roughness: 0.3 
    });
    const accentMaterial = new THREE.MeshStandardMaterial({ 
      color: '#1E90FF',
      roughness: 0.2 
    });

    // Main hotel building
    const mainBuilding = new THREE.Mesh(
      new THREE.BoxGeometry(28, 38, 16),
      buildingMaterial
    );
    mainBuilding.position.set(0, 22, -2);
    mainBuilding.castShadow = true;
    mainBuilding.receiveShadow = true;
    this.world.add(mainBuilding);

    // Ground floor
    const groundFloor = new THREE.Mesh(
      new THREE.BoxGeometry(35, 5, 20),
      new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.3 })
    );
    groundFloor.position.set(0, 2.5, 0);
    groundFloor.castShadow = true;
    groundFloor.receiveShadow = true;
    this.world.add(groundFloor);

    // Pool deck
    const poolDeck = new THREE.Mesh(
      new THREE.BoxGeometry(50, 0.4, 35),
      new THREE.MeshStandardMaterial({ color: '#D4D4AA', roughness: 0.4 })
    );
    poolDeck.position.set(0, 0.2, 30);
    poolDeck.receiveShadow = true;
    this.world.add(poolDeck);

    // Main pool
    const poolWater = new THREE.Mesh(
      new THREE.BoxGeometry(25, 1, 12),
      new THREE.MeshStandardMaterial({ 
        color: '#4A90E2', 
        transparent: true, 
        opacity: 0.8,
        roughness: 0.1
      })
    );
    poolWater.position.set(0, 0.8, 35);
    poolWater.receiveShadow = true;
    this.world.add(poolWater);

    // Beach area
    const beach = new THREE.Mesh(
      new THREE.BoxGeometry(60, 0.2, 25),
      new THREE.MeshStandardMaterial({ color: '#F4A460', roughness: 0.8 })
    );
    beach.position.set(0, 0.1, 50);
    beach.receiveShadow = true;
    this.world.add(beach);

    // Add umbrellas
    this.addUmbrellas();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    this.scene!.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene!.add(directionalLight);
  }

  private addUmbrellas() {
    if (!this.world) return;

    const umbrellaPositions = [
      // Pool umbrellas
      { id: 'P1', pos: [-15, 0, 45], type: 'premium' },
      { id: 'P2', pos: [-8, 0, 45], type: 'standard' },
      { id: 'P3', pos: [-1, 0, 45], type: 'premium' },
      { id: 'P4', pos: [6, 0, 45], type: 'standard' },
      { id: 'P5', pos: [13, 0, 45], type: 'premium' },
      // Beach umbrellas
      { id: 'B1', pos: [-20, 0, 65], type: 'standard' },
      { id: 'B2', pos: [-12, 0, 65], type: 'premium' },
      { id: 'B3', pos: [-4, 0, 65], type: 'standard' },
      { id: 'B4', pos: [4, 0, 65], type: 'premium' },
      { id: 'B5', pos: [12, 0, 65], type: 'standard' },
      { id: 'B6', pos: [20, 0, 65], type: 'premium' },
    ];

    umbrellaPositions.forEach(umbrella => {
      const umbrellaGroup = new THREE.Group();
      
      // Umbrella pole
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.1, 3, 8),
        new THREE.MeshStandardMaterial({ color: '#8B4513' })
      );
      pole.position.set(0, 1.5, 0);
      umbrellaGroup.add(pole);

      // Umbrella canopy
      const canopyColor = umbrella.type === 'premium' ? '#FF6B35' : '#4A90E2';
      const canopy = new THREE.Mesh(
        new THREE.ConeGeometry(2.2, 1.2, 12),
        new THREE.MeshStandardMaterial({ 
          color: canopyColor,
          transparent: true,
          opacity: 0.9
        })
      );
      canopy.position.set(0, 3.2, 0);
      umbrellaGroup.add(canopy);

      // Loungers
      const loungerMaterial = new THREE.MeshStandardMaterial({ color: '#F5F5DC' });
      
      const lounger1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.1, 2),
        loungerMaterial
      );
      lounger1.position.set(-1.5, 0.3, 0);
      lounger1.rotation.x = -0.1;
      umbrellaGroup.add(lounger1);

      const lounger2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.1, 2),
        loungerMaterial
      );
      lounger2.position.set(1.5, 0.3, 0);
      lounger2.rotation.x = -0.1;
      umbrellaGroup.add(lounger2);

      umbrellaGroup.position.set(umbrella.pos[0], umbrella.pos[1], umbrella.pos[2]);
      umbrellaGroup.userData = { id: umbrella.id, type: umbrella.type };
      
      this.world.add(umbrellaGroup);
    });
  }

  render(gl: WebGLRenderingContext, matrix: number[]) {
    if (!this.camera || !this.scene || !this.renderer) return;

    const rotationX = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(1, 0, 0),
      Math.PI / 2
    );
    const rotationZ = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(0, 0, 1),
      Math.PI
    );

    const l = new THREE.Matrix4().fromArray(matrix);
    l.multiply(rotationX);
    l.multiply(rotationZ);

    this.camera.projectionMatrix = l;
    this.renderer.resetState();
    this.renderer.render(this.scene, this.camera);
    this.map!.triggerRepaint();
  }

  onRemove() {
    // Cleanup
    if (this.world) {
      this.world.clear();
    }
  }

  updateSelection(selectedUmbrella?: string) {
    this.selectedUmbrella = selectedUmbrella;
    // Update visual selection indicators if needed
  }
}