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
  private onUmbrellaClick?: (id: string) => void;
  private selectedUmbrella?: string;
  private raycaster?: THREE.Raycaster;
  private mouse?: THREE.Vector2;
  private clickableObjects: THREE.Object3D[] = [];
  private modelTransform: any;

  constructor(options: MapboxThreeLayerOptions) {
    this.id = options.id;
    this.onUmbrellaClick = options.onUmbrellaClick;
    this.selectedUmbrella = options.selectedUmbrella;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
  }

  onAdd(map: mapboxgl.Map, gl: WebGLRenderingContext) {
    this.map = map;

    // SpringHill Suites Panama City Beach coordinates
    const modelOrigin: [number, number] = [-85.8764, 30.1766];
    const modelAltitude = 0;
    const modelRotate = [Math.PI / 2, 0, 0];
    
    const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
      modelOrigin,
      modelAltitude
    );

    // Store transformation parameters (following official Mapbox pattern)
    this.modelTransform = {
      translateX: modelAsMercatorCoordinate.x,
      translateY: modelAsMercatorCoordinate.y,
      translateZ: modelAsMercatorCoordinate.z || 0,
      rotateX: modelRotate[0],
      rotateY: modelRotate[1], 
      rotateZ: modelRotate[2],
      scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
    };

    console.log('Model transform:', this.modelTransform);

    // Camera setup
    this.camera = new THREE.Camera();
    this.scene = new THREE.Scene();

    // Create renderer using the correct canvas reference
    this.renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl,
      antialias: true
    });

    this.renderer.autoClear = false;

    // Create test objects
    this.createTestObjects();
    
    // Add click handler
    map.getCanvasContainer().addEventListener('click', this.onClick.bind(this));
  }

  private createTestObjects() {
    if (!this.scene) return;

    this.createSpringHillResort();
  }

  private createSpringHillResort() {
    if (!this.scene) return;

    console.log('Creating SpringHill Suites resort...');

    // Materials - SpringHill Suites specific colors from reference images
    const buildingMaterial = new THREE.MeshLambertMaterial({ color: '#FFFFFF' }); // White building
    const blueAccentMaterial = new THREE.MeshLambertMaterial({ color: '#0066CC' }); // Blue accents
    const poolMaterial = new THREE.MeshLambertMaterial({ 
      color: '#0088FF', 
      transparent: true, 
      opacity: 0.8 
    });
    const deckMaterial = new THREE.MeshLambertMaterial({ color: '#F5F5DC' }); // Beige deck
    const beachMaterial = new THREE.MeshLambertMaterial({ color: '#F4A460' }); // Sandy beach
    const garageMaterial = new THREE.MeshLambertMaterial({ color: '#E0E0E0' }); // Light gray parking

    // MAIN HOTEL TOWER - 12 story white tower
    const mainTower = new THREE.Mesh(
      new THREE.BoxGeometry(40, 72, 20), // Width, Height, Depth in meters
      buildingMaterial
    );
    mainTower.position.set(0, 36, -15); // Positioned behind pool area
    this.scene.add(mainTower);

    // Add blue accent stripes on the building (balcony railings)
    for (let floor = 2; floor < 12; floor += 2) {
      const blueStripe = new THREE.Mesh(
        new THREE.BoxGeometry(41, 2, 21),
        blueAccentMaterial
      );
      blueStripe.position.set(0, 6 * floor, -15);
      this.scene.add(blueStripe);
    }

    // PARKING GARAGE STRUCTURE - lower structure attached to main tower
    const parkingGarage = new THREE.Mesh(
      new THREE.BoxGeometry(45, 24, 25), // 4-story parking structure
      garageMaterial
    );
    parkingGarage.position.set(0, 12, 5);
    this.scene.add(parkingGarage);

    // "PCB" SIGNAGE on the building
    const pcbSign = new THREE.Mesh(
      new THREE.BoxGeometry(8, 6, 1),
      blueAccentMaterial
    );
    pcbSign.position.set(15, 18, 17.5);
    this.scene.add(pcbSign);

    // CURVED POOL COMPLEX - kidney/curved shape
    const poolDeck = new THREE.Mesh(
      new THREE.BoxGeometry(80, 1, 50),
      deckMaterial
    );
    poolDeck.position.set(0, 0.5, 45);
    this.scene.add(poolDeck);

    // Main curved pool - create kidney shape with multiple sections
    const pool1 = new THREE.Mesh(
      new THREE.CylinderGeometry(15, 15, 3, 16),
      poolMaterial
    );
    pool1.position.set(-10, 1.5, 40);
    this.scene.add(pool1);

    const pool2 = new THREE.Mesh(
      new THREE.CylinderGeometry(12, 12, 3, 16),
      poolMaterial
    );
    pool2.position.set(5, 1.5, 45);
    this.scene.add(pool2);

    const pool3 = new THREE.Mesh(
      new THREE.CylinderGeometry(18, 18, 3, 16),
      poolMaterial
    );
    pool3.position.set(20, 1.5, 55);
    this.scene.add(pool3);

    // Central island feature in the pool
    const poolIsland = new THREE.Mesh(
      new THREE.CylinderGeometry(4, 4, 2, 12),
      deckMaterial
    );
    poolIsland.position.set(5, 2, 48);
    this.scene.add(poolIsland);

    // Pool bar structure
    const poolBar = new THREE.Mesh(
      new THREE.BoxGeometry(12, 4, 8),
      new THREE.MeshLambertMaterial({ color: '#8B4513' })
    );
    poolBar.position.set(-25, 2, 35);
    this.scene.add(poolBar);

    // BEACH AREA
    const beachArea = new THREE.Mesh(
      new THREE.BoxGeometry(120, 1, 40),
      beachMaterial
    );
    beachArea.position.set(0, -0.5, 85);
    this.scene.add(beachArea);

    // Beach boardwalk
    const boardwalk = new THREE.Mesh(
      new THREE.BoxGeometry(80, 1, 6),
      new THREE.MeshLambertMaterial({ color: '#DEB887' })
    );
    boardwalk.position.set(0, 0, 75);
    this.scene.add(boardwalk);

    // Add palm trees
    this.addPalmTrees();
    
    // Add umbrella layouts
    this.addResortUmbrellas();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(100, 200, 100);
    this.scene.add(sunLight);

    console.log('SpringHill resort created with', this.scene.children.length, 'total objects');
  }

  private addPalmTrees() {
    if (!this.scene) return;

    const palmPositions = [
      // Around pool area - matching the satellite image layout
      [-50, 0, 15], [50, 0, 15],  // Pool sides
      [-40, 0, 30], [40, 0, 30],    // Pool corners
      [-30, 0, 65], [30, 0, 65],  // Pool deck outer edge
      // Between pool and beach
      [-20, 0, 75], [20, 0, 75],
      // Beach area landscaping
      [-60, 0, 95], [60, 0, 95],
      [-40, 0, 105], [40, 0, 105]
    ];

    palmPositions.forEach(pos => {
      // Palm tree trunk - taller and more realistic
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.8, 15, 8),
        new THREE.MeshLambertMaterial({ color: '#8B4513' })
      );
      trunk.position.set(pos[0], 7.5, pos[2]);
      this.scene!.add(trunk);

      // Palm fronds - more realistic
      for (let i = 0; i < 8; i++) {
        const frond = new THREE.Mesh(
          new THREE.BoxGeometry(8, 0.8, 2),
          new THREE.MeshLambertMaterial({ color: '#228B22' })
        );
        frond.position.set(pos[0], 15, pos[2]);
        frond.rotation.y = (Math.PI * 2 / 8) * i;
        frond.rotation.z = -0.4;
        this.scene!.add(frond);
      }
    });
  }

  private addResortUmbrellas() {
    if (!this.scene) return;

    const umbrellaPositions = [
      // POOL DECK UMBRELLAS - organized rows around the curved pool
      // First row - closest to pool
      { id: 'P1', pos: [-35, 0, 25], type: 'premium' },
      { id: 'P2', pos: [-25, 0, 25], type: 'standard' },
      { id: 'P3', pos: [-15, 0, 25], type: 'premium' },
      { id: 'P4', pos: [-5, 0, 25], type: 'standard' },
      { id: 'P5', pos: [5, 0, 25], type: 'premium' },
      { id: 'P6', pos: [15, 0, 25], type: 'standard' },
      { id: 'P7', pos: [25, 0, 25], type: 'premium' },
      { id: 'P8', pos: [35, 0, 25], type: 'standard' },
      
      // Second row - pool deck
      { id: 'P9', pos: [-40, 0, 35], type: 'standard' },
      { id: 'P10', pos: [-30, 0, 35], type: 'premium' },
      { id: 'P11', pos: [-20, 0, 35], type: 'standard' },
      { id: 'P12', pos: [-10, 0, 35], type: 'premium' },
      { id: 'P13', pos: [0, 0, 35], type: 'standard' },
      { id: 'P14', pos: [10, 0, 35], type: 'premium' },
      { id: 'P15', pos: [20, 0, 35], type: 'standard' },
      { id: 'P16', pos: [30, 0, 35], type: 'premium' },
      { id: 'P17', pos: [40, 0, 35], type: 'standard' },

      // Third row - outer pool deck
      { id: 'P18', pos: [-35, 0, 55], type: 'premium' },
      { id: 'P19', pos: [-25, 0, 55], type: 'standard' },
      { id: 'P20', pos: [-15, 0, 55], type: 'premium' },
      { id: 'P21', pos: [-5, 0, 55], type: 'standard' },
      { id: 'P22', pos: [5, 0, 55], type: 'premium' },
      { id: 'P23', pos: [15, 0, 55], type: 'standard' },
      { id: 'P24', pos: [25, 0, 55], type: 'premium' },
      { id: 'P25', pos: [35, 0, 55], type: 'standard' },

      // BEACH UMBRELLAS - organized rows on the beach
      // First beach row - closest to hotel
      { id: 'B1', pos: [-50, 0, 80], type: 'standard' },
      { id: 'B2', pos: [-40, 0, 80], type: 'premium' },
      { id: 'B3', pos: [-30, 0, 80], type: 'standard' },
      { id: 'B4', pos: [-20, 0, 80], type: 'premium' },
      { id: 'B5', pos: [-10, 0, 80], type: 'standard' },
      { id: 'B6', pos: [0, 0, 80], type: 'premium' },
      { id: 'B7', pos: [10, 0, 80], type: 'standard' },
      { id: 'B8', pos: [20, 0, 80], type: 'premium' },
      { id: 'B9', pos: [30, 0, 80], type: 'standard' },
      { id: 'B10', pos: [40, 0, 80], type: 'premium' },
      { id: 'B11', pos: [50, 0, 80], type: 'standard' },

      // Second beach row
      { id: 'B12', pos: [-50, 0, 90], type: 'premium' },
      { id: 'B13', pos: [-40, 0, 90], type: 'standard' },
      { id: 'B14', pos: [-30, 0, 90], type: 'premium' },
      { id: 'B15', pos: [-20, 0, 90], type: 'standard' },
      { id: 'B16', pos: [-10, 0, 90], type: 'premium' },
      { id: 'B17', pos: [0, 0, 90], type: 'standard' },
      { id: 'B18', pos: [10, 0, 90], type: 'premium' },
      { id: 'B19', pos: [20, 0, 90], type: 'standard' },
      { id: 'B20', pos: [30, 0, 90], type: 'premium' },
      { id: 'B21', pos: [40, 0, 90], type: 'standard' },
      { id: 'B22', pos: [50, 0, 90], type: 'premium' },

      // Third beach row
      { id: 'B23', pos: [-50, 0, 100], type: 'standard' },
      { id: 'B24', pos: [-40, 0, 100], type: 'premium' },
      { id: 'B25', pos: [-30, 0, 100], type: 'standard' },
      { id: 'B26', pos: [-20, 0, 100], type: 'premium' },
      { id: 'B27', pos: [-10, 0, 100], type: 'standard' },
      { id: 'B28', pos: [0, 0, 100], type: 'premium' },
      { id: 'B29', pos: [10, 0, 100], type: 'standard' },
      { id: 'B30', pos: [30, 0, 100], type: 'premium' },
      { id: 'B31', pos: [30, 0, 100], type: 'standard' },
      { id: 'B32', pos: [40, 0, 100], type: 'premium' },
      { id: 'B33', pos: [50, 0, 100], type: 'standard' },

      // Fourth beach row (beachfront VIP)
      { id: 'B34', pos: [-45, 0, 110], type: 'premium' },
      { id: 'B35', pos: [-35, 0, 110], type: 'premium' },
      { id: 'B36', pos: [-25, 0, 110], type: 'premium' },
      { id: 'B37', pos: [-15, 0, 110], type: 'premium' },
      { id: 'B38', pos: [-5, 0, 110], type: 'premium' },
      { id: 'B39', pos: [5, 0, 110], type: 'premium' },
      { id: 'B40', pos: [15, 0, 110], type: 'premium' },
      { id: 'B41', pos: [25, 0, 110], type: 'premium' },
      { id: 'B42', pos: [35, 0, 110], type: 'premium' },
      { id: 'B43', pos: [45, 0, 110], type: 'premium' },
    ];

    umbrellaPositions.forEach(umbrella => {
      const umbrellaGroup = new THREE.Group();
      
      // Umbrella pole - realistic size
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.5, 10, 8),
        new THREE.MeshLambertMaterial({ color: '#8B4513' })
      );
      pole.position.set(0, 5, 0);
      umbrellaGroup.add(pole);

      // Umbrella canopy - beach style colors
      const canopyColor = umbrella.type === 'premium' ? '#FF6B35' : '#4A90E2';
      const canopy = new THREE.Mesh(
        new THREE.ConeGeometry(4, 3, 12),
        new THREE.MeshLambertMaterial({ 
          color: canopyColor,
          transparent: true,
          opacity: 0.9
        })
      );
      canopy.position.set(0, 11.5, 0);
      umbrellaGroup.add(canopy);

      // Beach chair 1
      const chair1 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 0.5, 2),
        new THREE.MeshLambertMaterial({ color: '#FFFFFF' })
      );
      chair1.position.set(-2, 0.25, 0);
      umbrellaGroup.add(chair1);

      // Beach chair backrest 1
      const backrest1 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1.5, 0.3),
        new THREE.MeshLambertMaterial({ color: '#FFFFFF' })
      );
      backrest1.position.set(-2, 1.5, -0.8);
      backrest1.rotation.x = 0.3;
      umbrellaGroup.add(backrest1);

      // Beach chair 2
      const chair2 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 0.5, 2),
        new THREE.MeshLambertMaterial({ color: '#FFFFFF' })
      );
      chair2.position.set(2, 0.25, 0);
      umbrellaGroup.add(chair2);

      // Beach chair backrest 2
      const backrest2 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1.5, 0.3),
        new THREE.MeshLambertMaterial({ color: '#FFFFFF' })
      );
      backrest2.position.set(2, 1.5, -0.8);
      backrest2.rotation.x = 0.3;
      umbrellaGroup.add(backrest2);

      // Selection ring
      if (this.selectedUmbrella === umbrella.id) {
        const selectionRing = new THREE.Mesh(
          new THREE.RingGeometry(6, 8, 16),
          new THREE.MeshBasicMaterial({ color: '#FFD700', transparent: true, opacity: 0.8 })
        );
        selectionRing.position.set(0, 0.1, 0);
        selectionRing.rotation.x = -Math.PI / 2;
        umbrellaGroup.add(selectionRing);
      }

      umbrellaGroup.position.set(umbrella.pos[0], umbrella.pos[1], umbrella.pos[2]);
      umbrellaGroup.userData = { id: umbrella.id, type: umbrella.type };
      
      this.clickableObjects.push(umbrellaGroup);
      this.scene.add(umbrellaGroup);
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

    // Apply transformations following official Mapbox pattern
    const rotationX = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(1, 0, 0),
      this.modelTransform.rotateX
    );
    const rotationY = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(0, 1, 0),
      this.modelTransform.rotateY
    );
    const rotationZ = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(0, 0, 1),
      this.modelTransform.rotateZ
    );

    const m = new THREE.Matrix4().fromArray(matrix);
    const l = new THREE.Matrix4()
      .makeTranslation(
        this.modelTransform.translateX,
        this.modelTransform.translateY,
        this.modelTransform.translateZ
      )
      .scale(
        new THREE.Vector3(
          this.modelTransform.scale,
          -this.modelTransform.scale,
          this.modelTransform.scale
        )
      )
      .multiply(rotationX)
      .multiply(rotationY)
      .multiply(rotationZ);

    this.camera.projectionMatrix = m.multiply(l);
    this.renderer.resetState();
    this.renderer.render(this.scene, this.camera);
    this.map!.triggerRepaint();
  }

  onRemove() {
    // Cleanup
    if (this.map) {
      this.map.getCanvasContainer().removeEventListener('click', this.onClick.bind(this));
    }
    if (this.scene) {
      this.scene.clear();
    }
  }

  updateSelection(selectedUmbrella?: string) {
    this.selectedUmbrella = selectedUmbrella;
    // For now, just store the selection - we'll implement visual updates later
  }
}