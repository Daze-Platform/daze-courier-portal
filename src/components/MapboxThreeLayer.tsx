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

    console.log('Adding SpringHill resort...');
    
    // SpringHill Suites Panama City Beach coordinates
    const modelOrigin: [number, number] = [-85.8764, 30.1766];
    const modelAltitude = 0;
    
    // Convert to Mapbox coordinate system
    const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
      modelOrigin,
      modelAltitude
    );

    // Use a fixed large scale instead of calculated
    const scale = 10; // Fixed large scale
    console.log('Resort scale (fixed):', scale);
    console.log('Mercator coordinate:', modelAsMercatorCoordinate);

    // Position the world at the resort location
    this.world.position.set(
      modelAsMercatorCoordinate.x,
      modelAsMercatorCoordinate.y,
      modelAsMercatorCoordinate.z || 0
    );
    console.log('World position:', this.world.position);
    
    // Set scale and rotation - try different rotation
    this.world.scale.set(scale, scale, scale); // No negative scale
    this.world.rotation.set(0, 0, 0); // No rotation initially
    console.log('World scale (fixed):', this.world.scale);

    // Create a simple test cube first to see if anything renders
    this.createTestObjects();
    console.log('Test objects created, total children:', this.world.children.length);
  }

  private createTestObjects() {
    if (!this.world) return;

    // Create a HUGE, bright red cube that should be very visible
    const testCube = new THREE.Mesh(
      new THREE.BoxGeometry(1000, 1000, 1000),  // Massive cube
      new THREE.MeshBasicMaterial({ color: '#FF0000' })  // Bright red, no lighting needed
    );
    testCube.position.set(0, 500, 0);  // Elevated so it's above ground
    this.world.add(testCube);
    console.log('Added HUGE test cube at position:', testCube.position);

    // Add bright ambient light to make sure everything is visible
    const ambientLight = new THREE.AmbientLight(0xffffff, 3.0);  // Very bright
    this.scene!.add(ambientLight);
    console.log('Added bright ambient light');
  }

  private createResortComplex() {
    if (!this.world) return;

    // SpringHill Suites specific materials - white building with blue accents
    const buildingMaterial = new THREE.MeshLambertMaterial({ 
      color: '#FFFFFF'  // Pure white building
    });
    const blueAccentMaterial = new THREE.MeshLambertMaterial({ 
      color: '#0066CC'  // Blue balcony railings and accents
    });
    const glassMaterial = new THREE.MeshLambertMaterial({ 
      color: '#87CEEB',
      transparent: true,
      opacity: 0.6
    });
    const poolMaterial = new THREE.MeshLambertMaterial({ 
      color: '#0088FF',
      transparent: true,
      opacity: 0.8
    });
    const deckMaterial = new THREE.MeshLambertMaterial({ color: '#F5F5DC' });
    const beachMaterial = new THREE.MeshLambertMaterial({ color: '#F4A460' });
    const garageMaterial = new THREE.MeshLambertMaterial({ color: '#E0E0E0' });

    // MAIN HOTEL TOWER - 12 story white tower
    const mainTower = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.072, 0.02),  // Tall main tower
      buildingMaterial
    );
    mainTower.position.set(0, 0.036, -0.015);
    this.world.add(mainTower);

    // Add blue accent stripes on the building
    for (let floor = 2; floor < 12; floor += 2) {
      const blueStripe = new THREE.Mesh(
        new THREE.BoxGeometry(0.041, 0.002, 0.021),
        blueAccentMaterial
      );
      blueStripe.position.set(0, 0.006 * floor, -0.015);
      this.world.add(blueStripe);
    }

    // Balcony railings - blue horizontal lines
    for (let floor = 1; floor < 12; floor++) {
      const railing = new THREE.Mesh(
        new THREE.BoxGeometry(0.041, 0.001, 0.0005),
        blueAccentMaterial
      );
      railing.position.set(0, 0.006 * floor + 0.003, -0.0045);
      this.world.add(railing);
    }

    // PARKING GARAGE STRUCTURE - lower white structure attached to main tower
    const parkingGarage = new THREE.Mesh(
      new THREE.BoxGeometry(0.045, 0.024, 0.025),  // 4-story parking structure
      garageMaterial
    );
    parkingGarage.position.set(0, 0.012, 0.005);
    this.world.add(parkingGarage);

    // Parking garage horizontal bands
    for (let level = 1; level < 4; level++) {
      const band = new THREE.Mesh(
        new THREE.BoxGeometry(0.046, 0.001, 0.026),
        blueAccentMaterial
      );
      band.position.set(0, 0.006 * level, 0.005);
      this.world.add(band);
    }

    // "PCB" SIGNAGE on the building
    const pcbSign = new THREE.Mesh(
      new THREE.BoxGeometry(0.008, 0.006, 0.001),
      blueAccentMaterial
    );
    pcbSign.position.set(0.015, 0.018, 0.0175);
    this.world.add(pcbSign);

    // CURVED POOL COMPLEX - kidney/curved shape like in the photos
    const poolDeck = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.001, 0.05),
      deckMaterial
    );
    poolDeck.position.set(0, 0.0005, 0.045);
    this.world.add(poolDeck);

    // Main curved pool - create kidney shape with multiple sections
    const pool1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.003, 16),
      poolMaterial
    );
    pool1.position.set(-0.01, 0.0015, 0.04);
    this.world.add(pool1);

    const pool2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.003, 16),
      poolMaterial
    );
    pool2.position.set(0.005, 0.0015, 0.045);
    this.world.add(pool2);

    const pool3 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.018, 0.003, 16),
      poolMaterial
    );
    pool3.position.set(0.02, 0.0015, 0.055);
    this.world.add(pool3);

    // Central island feature in the pool
    const poolIsland = new THREE.Mesh(
      new THREE.CylinderGeometry(0.004, 0.004, 0.002, 12),
      deckMaterial
    );
    poolIsland.position.set(0.005, 0.002, 0.048);
    this.world.add(poolIsland);

    // Pool bar structure
    const poolBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.012, 0.004, 0.008),
      new THREE.MeshLambertMaterial({ color: '#8B4513' })
    );
    poolBar.position.set(-0.025, 0.002, 0.035);
    this.world.add(poolBar);

    // BEACH AREA
    const beachArea = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.001, 0.04),
      beachMaterial
    );
    beachArea.position.set(0, -0.0005, 0.085);
    this.world.add(beachArea);

    // Beach boardwalk
    const boardwalk = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.001, 0.006),
      new THREE.MeshLambertMaterial({ color: '#DEB887' })
    );
    boardwalk.position.set(0, 0, 0.075);
    this.world.add(boardwalk);

    // Add palm trees
    this.addPalmTrees();
    
    // Add realistic umbrella layouts
    this.addResortUmbrellas();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene!.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(0.1, 0.2, 0.1);
    sunLight.castShadow = true;
    this.scene!.add(sunLight);
  }

  private addPalmTrees() {
    if (!this.world) return;

    const palmPositions = [
      // Around pool area - matching the satellite image layout
      [-0.05, 0, 0.015], [0.05, 0, 0.015],  // Pool sides
      [-0.04, 0, 0.03], [0.04, 0, 0.03],    // Pool corners
      [-0.03, 0, 0.065], [0.03, 0, 0.065],  // Pool deck outer edge
      // Between pool and beach
      [-0.02, 0, 0.075], [0.02, 0, 0.075],
      // Beach area landscaping
      [-0.06, 0, 0.095], [0.06, 0, 0.095],
      [-0.04, 0, 0.105], [0.04, 0, 0.105]
    ];

    palmPositions.forEach(pos => {
      // Palm tree trunk - taller and more realistic
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0005, 0.0008, 0.015, 8),
        new THREE.MeshLambertMaterial({ color: '#8B4513' })
      );
      trunk.position.set(pos[0], 0.0075, pos[2]);
      this.world!.add(trunk);

      // Palm fronds - more realistic
      for (let i = 0; i < 8; i++) {
        const frond = new THREE.Mesh(
          new THREE.BoxGeometry(0.008, 0.0008, 0.002),
          new THREE.MeshLambertMaterial({ color: '#228B22' })
        );
        frond.position.set(pos[0], 0.015, pos[2]);
        frond.rotation.y = (Math.PI * 2 / 8) * i;
        frond.rotation.z = -0.4;
        this.world!.add(frond);
      }
    });
  }

  private addResortUmbrellas() {
    if (!this.world) return;

    const umbrellaPositions = [
      // POOL DECK UMBRELLAS - organized rows around the curved pool
      // First row - closest to pool
      { id: 'P1', pos: [-0.035, 0, 0.025], type: 'premium' },
      { id: 'P2', pos: [-0.025, 0, 0.025], type: 'standard' },
      { id: 'P3', pos: [-0.015, 0, 0.025], type: 'premium' },
      { id: 'P4', pos: [-0.005, 0, 0.025], type: 'standard' },
      { id: 'P5', pos: [0.005, 0, 0.025], type: 'premium' },
      { id: 'P6', pos: [0.015, 0, 0.025], type: 'standard' },
      { id: 'P7', pos: [0.025, 0, 0.025], type: 'premium' },
      { id: 'P8', pos: [0.035, 0, 0.025], type: 'standard' },
      
      // Second row - pool deck
      { id: 'P9', pos: [-0.04, 0, 0.035], type: 'standard' },
      { id: 'P10', pos: [-0.03, 0, 0.035], type: 'premium' },
      { id: 'P11', pos: [-0.02, 0, 0.035], type: 'standard' },
      { id: 'P12', pos: [-0.01, 0, 0.035], type: 'premium' },
      { id: 'P13', pos: [0, 0, 0.035], type: 'standard' },
      { id: 'P14', pos: [0.01, 0, 0.035], type: 'premium' },
      { id: 'P15', pos: [0.02, 0, 0.035], type: 'standard' },
      { id: 'P16', pos: [0.03, 0, 0.035], type: 'premium' },
      { id: 'P17', pos: [0.04, 0, 0.035], type: 'standard' },

      // Third row - outer pool deck
      { id: 'P18', pos: [-0.035, 0, 0.055], type: 'premium' },
      { id: 'P19', pos: [-0.025, 0, 0.055], type: 'standard' },
      { id: 'P20', pos: [-0.015, 0, 0.055], type: 'premium' },
      { id: 'P21', pos: [-0.005, 0, 0.055], type: 'standard' },
      { id: 'P22', pos: [0.005, 0, 0.055], type: 'premium' },
      { id: 'P23', pos: [0.015, 0, 0.055], type: 'standard' },
      { id: 'P24', pos: [0.025, 0, 0.055], type: 'premium' },
      { id: 'P25', pos: [0.035, 0, 0.055], type: 'standard' },

      // BEACH UMBRELLAS - organized rows on the beach
      // First beach row - closest to hotel
      { id: 'B1', pos: [-0.05, 0, 0.08], type: 'standard' },
      { id: 'B2', pos: [-0.04, 0, 0.08], type: 'premium' },
      { id: 'B3', pos: [-0.03, 0, 0.08], type: 'standard' },
      { id: 'B4', pos: [-0.02, 0, 0.08], type: 'premium' },
      { id: 'B5', pos: [-0.01, 0, 0.08], type: 'standard' },
      { id: 'B6', pos: [0, 0, 0.08], type: 'premium' },
      { id: 'B7', pos: [0.01, 0, 0.08], type: 'standard' },
      { id: 'B8', pos: [0.02, 0, 0.08], type: 'premium' },
      { id: 'B9', pos: [0.03, 0, 0.08], type: 'standard' },
      { id: 'B10', pos: [0.04, 0, 0.08], type: 'premium' },
      { id: 'B11', pos: [0.05, 0, 0.08], type: 'standard' },

      // Second beach row
      { id: 'B12', pos: [-0.05, 0, 0.09], type: 'premium' },
      { id: 'B13', pos: [-0.04, 0, 0.09], type: 'standard' },
      { id: 'B14', pos: [-0.03, 0, 0.09], type: 'premium' },
      { id: 'B15', pos: [-0.02, 0, 0.09], type: 'standard' },
      { id: 'B16', pos: [-0.01, 0, 0.09], type: 'premium' },
      { id: 'B17', pos: [0, 0, 0.09], type: 'standard' },
      { id: 'B18', pos: [0.01, 0, 0.09], type: 'premium' },
      { id: 'B19', pos: [0.02, 0, 0.09], type: 'standard' },
      { id: 'B20', pos: [0.03, 0, 0.09], type: 'premium' },
      { id: 'B21', pos: [0.04, 0, 0.09], type: 'standard' },
      { id: 'B22', pos: [0.05, 0, 0.09], type: 'premium' },

      // Third beach row
      { id: 'B23', pos: [-0.05, 0, 0.1], type: 'standard' },
      { id: 'B24', pos: [-0.04, 0, 0.1], type: 'premium' },
      { id: 'B25', pos: [-0.03, 0, 0.1], type: 'standard' },
      { id: 'B26', pos: [-0.02, 0, 0.1], type: 'premium' },
      { id: 'B27', pos: [-0.01, 0, 0.1], type: 'standard' },
      { id: 'B28', pos: [0, 0, 0.1], type: 'premium' },
      { id: 'B29', pos: [0.01, 0, 0.1], type: 'standard' },
      { id: 'B30', pos: [0.02, 0, 0.1], type: 'premium' },
      { id: 'B31', pos: [0.03, 0, 0.1], type: 'standard' },
      { id: 'B32', pos: [0.04, 0, 0.1], type: 'premium' },
      { id: 'B33', pos: [0.05, 0, 0.1], type: 'standard' },

      // Fourth beach row (beachfront)
      { id: 'B34', pos: [-0.045, 0, 0.11], type: 'premium' },
      { id: 'B35', pos: [-0.035, 0, 0.11], type: 'premium' },
      { id: 'B36', pos: [-0.025, 0, 0.11], type: 'premium' },
      { id: 'B37', pos: [-0.015, 0, 0.11], type: 'premium' },
      { id: 'B38', pos: [-0.005, 0, 0.11], type: 'premium' },
      { id: 'B39', pos: [0.005, 0, 0.11], type: 'premium' },
      { id: 'B40', pos: [0.015, 0, 0.11], type: 'premium' },
      { id: 'B41', pos: [0.025, 0, 0.11], type: 'premium' },
      { id: 'B42', pos: [0.035, 0, 0.11], type: 'premium' },
      { id: 'B43', pos: [0.045, 0, 0.11], type: 'premium' },
    ];

    umbrellaPositions.forEach(umbrella => {
      const umbrellaGroup = new THREE.Group();
      
      // Umbrella pole - realistic size
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0003, 0.0005, 0.01, 8),
        new THREE.MeshLambertMaterial({ color: '#8B4513' })
      );
      pole.position.set(0, 0.005, 0);
      umbrellaGroup.add(pole);

      // Umbrella canopy - beach style colors
      const canopyColor = umbrella.type === 'premium' ? '#FF6B35' : '#4A90E2';
      const canopy = new THREE.Mesh(
        new THREE.ConeGeometry(0.004, 0.003, 12),
        new THREE.MeshLambertMaterial({ 
          color: canopyColor,
          transparent: true,
          opacity: 0.9
        })
      );
      canopy.position.set(0, 0.0115, 0);
      umbrellaGroup.add(canopy);

      // Beach chair 1
      const chair1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.001, 0.0005, 0.002),
        new THREE.MeshLambertMaterial({ color: '#FFFFFF' })
      );
      chair1.position.set(-0.002, 0.00025, 0);
      umbrellaGroup.add(chair1);

      // Beach chair backrest 1
      const backrest1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.001, 0.0015, 0.0003),
        new THREE.MeshLambertMaterial({ color: '#FFFFFF' })
      );
      backrest1.position.set(-0.002, 0.0015, -0.0008);
      backrest1.rotation.x = 0.3;
      umbrellaGroup.add(backrest1);

      // Beach chair 2
      const chair2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.001, 0.0005, 0.002),
        new THREE.MeshLambertMaterial({ color: '#FFFFFF' })
      );
      chair2.position.set(0.002, 0.00025, 0);
      umbrellaGroup.add(chair2);

      // Beach chair backrest 2
      const backrest2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.001, 0.0015, 0.0003),
        new THREE.MeshLambertMaterial({ color: '#FFFFFF' })
      );
      backrest2.position.set(0.002, 0.0015, -0.0008);
      backrest2.rotation.x = 0.3;
      umbrellaGroup.add(backrest2);

      // Selection ring
      if (this.selectedUmbrella === umbrella.id) {
        const selectionRing = new THREE.Mesh(
          new THREE.RingGeometry(0.006, 0.008, 16),
          new THREE.MeshBasicMaterial({ color: '#FFD700', transparent: true, opacity: 0.8 })
        );
        selectionRing.position.set(0, 0.0001, 0);
        selectionRing.rotation.x = -Math.PI / 2;
        umbrellaGroup.add(selectionRing);
      }

      umbrellaGroup.position.set(umbrella.pos[0], umbrella.pos[1], umbrella.pos[2]);
      umbrellaGroup.userData = { id: umbrella.id, type: umbrella.type };
      
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
    if (!this.camera || !this.scene || !this.renderer) {
      console.log('Render called but missing components:', {
        camera: !!this.camera,
        scene: !!this.scene,
        renderer: !!this.renderer
      });
      return;
    }

    // Log render calls occasionally to confirm it's working
    if (Math.random() < 0.01) { // Log ~1% of renders to avoid spam
      console.log('Render method called, scene children:', this.scene.children.length);
    }

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