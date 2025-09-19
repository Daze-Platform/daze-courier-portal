import * as THREE from 'three';
import mapboxgl from 'mapbox-gl';

interface MapboxThreeLayerOptions {
  id: string;
  onUmbrellaClick?: (id: string) => void;
  selectedUmbrella?: string;
}

export class MapboxThreeLayer implements mapboxgl.CustomLayerInterface {
  id: string;
  type: 'custom' = 'custom';
  renderingMode: '3d' = '3d';
  
  private map?: mapboxgl.Map;
  private camera?: THREE.Camera;
  private scene?: THREE.Scene;
  private renderer?: THREE.WebGLRenderer;
  private world?: THREE.Group;
  private onUmbrellaClick?: (id: string) => void;
  private selectedUmbrella?: string;
  private raycaster?: THREE.Raycaster;
  private mouse?: THREE.Vector2;
  private clickableObjects: THREE.Object3D[] = [];

  constructor(options: MapboxThreeLayerOptions) {
    this.id = options.id;
    this.onUmbrellaClick = options.onUmbrellaClick;
    this.selectedUmbrella = options.selectedUmbrella;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
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

    // Add the SpringHill Suites resort
    this.addSpringHillResort();
    
    // Add click handler
    map.getCanvasContainer().addEventListener('click', this.onClick.bind(this));
  }

  private addSpringHillResort() {
    if (!this.world) return;

    // SpringHill Suites Panama City Beach coordinates
    const modelOrigin: [number, number] = [-85.8764, 30.1766];
    const modelAltitude = 0;
    
    // Convert to Mapbox coordinate system
    const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
      modelOrigin,
      modelAltitude
    );

    // Calculate scale - use a much larger scale to make the resort visible
    const scale = modelAsMercatorCoordinate.meterInMercatorCoordinateUnits() * 1000;

    // Position the world at the resort location
    this.world.position.set(
      modelAsMercatorCoordinate.x,
      modelAsMercatorCoordinate.y,
      modelAsMercatorCoordinate.z || 0
    );
    
    // Set scale and rotation
    this.world.scale.set(scale, -scale, scale);
    this.world.rotation.set(Math.PI / 2, 0, 0);

    // Create the resort complex
    this.createResortComplex();
  }

  private createResortComplex() {
    if (!this.world) return;

    // Materials
    const buildingMaterial = new THREE.MeshLambertMaterial({ color: '#E8F4FD' });
    const poolMaterial = new THREE.MeshLambertMaterial({ 
      color: '#4A90E2',
      transparent: true,
      opacity: 0.8
    });
    const deckMaterial = new THREE.MeshLambertMaterial({ color: '#D4D4AA' });
    const beachMaterial = new THREE.MeshLambertMaterial({ color: '#F4A460' });

    // Main SpringHill Suites building (12-story tower)
    const mainBuilding = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.06, 0.02), // Smaller dimensions for better visibility
      buildingMaterial
    );
    mainBuilding.position.set(0, 0, -0.01);
    this.world.add(mainBuilding);

    // Ground floor lobby
    const lobby = new THREE.Mesh(
      new THREE.BoxGeometry(0.035, 0.008, 0.025),
      new THREE.MeshLambertMaterial({ color: '#FFFFFF' })
    );
    lobby.position.set(0, -0.026, 0);
    this.world.add(lobby);

    // Pool deck area
    const poolDeck = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.002, 0.05),
      deckMaterial
    );
    poolDeck.position.set(0, -0.03, 0.03);
    this.world.add(poolDeck);

    // Main infinity pool
    const mainPool = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.003, 0.015),
      poolMaterial
    );
    mainPool.position.set(0, -0.029, 0.035);
    this.world.add(mainPool);

    // Lazy river
    const lazyRiver = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.002, 0.008),
      poolMaterial
    );
    lazyRiver.position.set(-0.015, -0.029, 0.02);
    this.world.add(lazyRiver);

    // Hot tub/spa
    const hotTub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.006, 0.006, 0.003, 16),
      new THREE.MeshLambertMaterial({ color: '#FF6B35', transparent: true, opacity: 0.8 })
    );
    hotTub.position.set(0.025, -0.029, 0.025);
    this.world.add(hotTub);

    // Beach area
    const beach = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.001, 0.04),
      beachMaterial
    );
    beach.position.set(0, -0.031, 0.08);
    this.world.add(beach);

    // Add resort umbrellas and loungers
    this.addResortUmbrellas();

    // Enhanced lighting for better visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene!.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0.1, 0.1, 0.1);
    this.scene!.add(directionalLight);
  }

  private addResortUmbrellas() {
    if (!this.world) return;

    const umbrellaPositions = [
      // Pool deck umbrellas
      { id: 'P1', pos: [-0.02, 0, 0.045], type: 'premium' },
      { id: 'P2', pos: [-0.01, 0, 0.045], type: 'standard' },
      { id: 'P3', pos: [0, 0, 0.045], type: 'premium' },
      { id: 'P4', pos: [0.01, 0, 0.045], type: 'standard' },
      { id: 'P5', pos: [0.02, 0, 0.045], type: 'premium' },
      { id: 'P6', pos: [-0.015, 0, 0.025], type: 'standard' },
      { id: 'P7', pos: [-0.005, 0, 0.025], type: 'premium' },
      { id: 'P8', pos: [0.005, 0, 0.025], type: 'standard' },
      { id: 'P9', pos: [0.015, 0, 0.025], type: 'premium' },
      // Beach umbrellas  
      { id: 'B1', pos: [-0.03, 0, 0.08], type: 'standard' },
      { id: 'B2', pos: [-0.02, 0, 0.08], type: 'premium' },
      { id: 'B3', pos: [-0.01, 0, 0.08], type: 'standard' },
      { id: 'B4', pos: [0, 0, 0.08], type: 'premium' },
      { id: 'B5', pos: [0.01, 0, 0.08], type: 'standard' },
      { id: 'B6', pos: [0.02, 0, 0.08], type: 'premium' },
      { id: 'B7', pos: [0.03, 0, 0.08], type: 'standard' },
      { id: 'B8', pos: [-0.025, 0, 0.09], type: 'premium' },
      { id: 'B9', pos: [-0.015, 0, 0.09], type: 'standard' },
      { id: 'B10', pos: [-0.005, 0, 0.09], type: 'premium' },
      { id: 'B11', pos: [0.005, 0, 0.09], type: 'standard' },
      { id: 'B12', pos: [0.015, 0, 0.09], type: 'premium' },
      { id: 'B13', pos: [0.025, 0, 0.09], type: 'standard' },
    ];

    umbrellaPositions.forEach(umbrella => {
      const umbrellaGroup = new THREE.Group();
      
      // Umbrella pole
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0003, 0.0003, 0.006, 8),
        new THREE.MeshLambertMaterial({ color: '#8B4513' })
      );
      pole.position.set(0, -0.027, 0);
      umbrellaGroup.add(pole);

      // Umbrella canopy
      const canopyColor = umbrella.type === 'premium' ? '#FF6B35' : '#4A90E2';
      const canopy = new THREE.Mesh(
        new THREE.ConeGeometry(0.003, 0.002, 8),
        new THREE.MeshLambertMaterial({ 
          color: canopyColor,
          transparent: true,
          opacity: 0.9
        })
      );
      canopy.position.set(0, -0.024, 0);
      umbrellaGroup.add(canopy);

      // Loungers
      const loungerMaterial = new THREE.MeshLambertMaterial({ color: '#F5F5DC' });
      
      const lounger1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.001, 0.0002, 0.003),
        loungerMaterial
      );
      lounger1.position.set(-0.002, -0.03, 0);
      umbrellaGroup.add(lounger1);

      const lounger2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.001, 0.0002, 0.003),
        loungerMaterial
      );
      lounger2.position.set(0.002, -0.03, 0);
      umbrellaGroup.add(lounger2);

      // Selection ring for interactivity
      if (this.selectedUmbrella === umbrella.id) {
        const selectionRing = new THREE.Mesh(
          new THREE.RingGeometry(0.004, 0.005, 16),
          new THREE.MeshBasicMaterial({ color: '#FFD700', transparent: true, opacity: 0.6 })
        );
        selectionRing.position.set(0, -0.0299, 0);
        selectionRing.rotation.x = -Math.PI / 2;
        umbrellaGroup.add(selectionRing);
      }

      umbrellaGroup.position.set(umbrella.pos[0], umbrella.pos[1], umbrella.pos[2]);
      umbrellaGroup.userData = { id: umbrella.id, type: umbrella.type };
      
      // Make umbrellas clickable
      this.clickableObjects.push(umbrellaGroup);
      this.world.add(umbrellaGroup);
    });
  }

  private onClick(event: MouseEvent) {
    if (!this.map || !this.camera || !this.raycaster || !this.mouse) return;

    const rect = this.map.getCanvasContainer().getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.clickableObjects, true);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      let parent = clickedObject.parent;
      
      while (parent && !parent.userData.id) {
        parent = parent.parent;
      }
      
      if (parent && parent.userData.id) {
        this.onUmbrellaClick?.(parent.userData.id);
        event.stopPropagation();
      }
    }
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
    if (this.map) {
      this.map.getCanvasContainer().removeEventListener('click', this.onClick.bind(this));
    }
    if (this.world) {
      this.world.clear();
    }
  }

  updateSelection(selectedUmbrella?: string) {
    this.selectedUmbrella = selectedUmbrella;
    // Recreate umbrellas to update selection rings
    if (this.world) {
      // Remove old umbrellas
      const umbrellas = this.world.children.filter(child => child.userData.id);
      umbrellas.forEach(umbrella => this.world!.remove(umbrella));
      this.clickableObjects = [];
      
      // Re-add with updated selection
      this.addResortUmbrellas();
    }
  }
}