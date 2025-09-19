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

    console.log('Creating accurate SpringHill Suites resort based on reference images...');

    // Materials - SpringHill Suites specific colors from reference images
    const buildingMaterial = new THREE.MeshLambertMaterial({ color: '#FFFFFF' }); // White building
    const blueAccentMaterial = new THREE.MeshLambertMaterial({ color: '#4A90E2' }); // Blue balcony railings
    const poolMaterial = new THREE.MeshLambertMaterial({ 
      color: '#0088FF', 
      transparent: true, 
      opacity: 0.8 
    });
    const deckMaterial = new THREE.MeshLambertMaterial({ color: '#F5F5DC' }); // Pool deck
    const garageMaterial = new THREE.MeshLambertMaterial({ color: '#FFFFFF' }); // White parking garage
    const garageOpeningMaterial = new THREE.MeshLambertMaterial({ color: '#333333' }); // Dark openings
    const grassMaterial = new THREE.MeshLambertMaterial({ color: '#4CAF50' }); // Green lawn

    // MAIN HOTEL TOWER - 12 story white tower (positioned at center)
    const mainTower = new THREE.Mesh(
      new THREE.BoxGeometry(60, 90, 30), // Width, Height, Depth
      buildingMaterial
    );
    mainTower.position.set(0, 45, 0); // Center of the complex
    this.scene.add(mainTower);

    // Add blue balcony railings on each floor
    for (let floor = 1; floor <= 12; floor++) {
      // Front balconies
      const frontBalcony = new THREE.Mesh(
        new THREE.BoxGeometry(62, 1, 2),
        blueAccentMaterial
      );
      frontBalcony.position.set(0, floor * 7, 16);
      this.scene.add(frontBalcony);

      // Side balconies
      const sideBalcony1 = new THREE.Mesh(
        new THREE.BoxGeometry(2, 1, 32),
        blueAccentMaterial
      );
      sideBalcony1.position.set(31, floor * 7, 0);
      this.scene.add(sideBalcony1);

      const sideBalcony2 = new THREE.Mesh(
        new THREE.BoxGeometry(2, 1, 32),
        blueAccentMaterial
      );
      sideBalcony2.position.set(-31, floor * 7, 0);
      this.scene.add(sideBalcony2);
    }

    // PARKING GARAGE - multi-level white structure at base
    const parkingGarage = new THREE.Mesh(
      new THREE.BoxGeometry(80, 30, 40), // Wider than tower
      garageMaterial
    );
    parkingGarage.position.set(0, 15, -5);
    this.scene.add(parkingGarage);

    // Add dark openings to parking garage to show it's not solid
    for (let level = 0; level < 4; level++) {
      for (let i = 0; i < 8; i++) {
        const opening = new THREE.Mesh(
          new THREE.BoxGeometry(8, 6, 2),
          garageOpeningMaterial
        );
        opening.position.set(-28 + i * 8, 6 + level * 6, 15);
        this.scene.add(opening);
      }
    }

    // "PCB" SIGNAGE on the right side of building
    const pcbSign = new THREE.Mesh(
      new THREE.BoxGeometry(2, 15, 20),
      blueAccentMaterial
    );
    pcbSign.position.set(32, 25, 0);
    this.scene.add(pcbSign);

    // GREEN LAWN AREA (to the right of the building as seen in reference)
    const lawnArea = new THREE.Mesh(
      new THREE.BoxGeometry(40, 1, 60),
      grassMaterial
    );
    lawnArea.position.set(60, 0.5, 0);
    this.scene.add(lawnArea);

    // POOL COMPLEX - positioned to the LEFT of the main building
    const poolDeck = new THREE.Mesh(
      new THREE.BoxGeometry(70, 2, 50),
      deckMaterial
    );
    poolDeck.position.set(-55, 1, 10); // Left side of building
    this.scene.add(poolDeck);

    // Main curved pool - kidney shaped (using connected circular sections)
    const pool1 = new THREE.Mesh(
      new THREE.CylinderGeometry(12, 12, 3, 16),
      poolMaterial
    );
    pool1.position.set(-65, 2.5, 5);
    this.scene.add(pool1);

    const pool2 = new THREE.Mesh(
      new THREE.CylinderGeometry(15, 15, 3, 16),
      poolMaterial
    );
    pool2.position.set(-50, 2.5, 15);
    this.scene.add(pool2);

    const pool3 = new THREE.Mesh(
      new THREE.CylinderGeometry(10, 10, 3, 16),
      poolMaterial
    );
    pool3.position.set(-40, 2.5, 5);
    this.scene.add(pool3);

    // Small spa/hot tub
    const spa = new THREE.Mesh(
      new THREE.CylinderGeometry(4, 4, 3, 12),
      poolMaterial
    );
    spa.position.set(-35, 2.5, -5);
    this.scene.add(spa);

    // Add palm trees around the pool area
    this.addPalmTrees();
    
    // Add realistic umbrella layout matching the reference image
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
      // Around pool deck area - matching the reference layout
      [-75, 0, -10], [-45, 0, -15], // Left side of pool area
      [-65, 0, 25], [-35, 0, 30],   // Around pool perimeter
      [-80, 0, 5], [-25, 0, 20],    // Pool deck landscaping
      // Between main building and pool
      [-15, 0, -5], [15, 0, -10],   
      // Around the lawn area
      [45, 0, -20], [75, 0, -15], [85, 0, 15],
      // Front entrance area
      [25, 0, -35], [-25, 0, -35]
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
      // POOL DECK UMBRELLAS - organized around the curved pool (left side of building)
      // First row - closest to main pool
      { id: 'P1', pos: [-75, 0, 0], type: 'standard' },
      { id: 'P2', pos: [-70, 0, 5], type: 'premium' },
      { id: 'P3', pos: [-65, 0, 0], type: 'standard' },
      { id: 'P4', pos: [-60, 0, 10], type: 'premium' },
      { id: 'P5', pos: [-55, 0, 0], type: 'standard' },
      { id: 'P6', pos: [-50, 0, 8], type: 'premium' },
      { id: 'P7', pos: [-45, 0, 0], type: 'standard' },
      { id: 'P8', pos: [-40, 0, 12], type: 'premium' },
      
      // Second row - around pool perimeter
      { id: 'P9', pos: [-75, 0, 15], type: 'premium' },
      { id: 'P10', pos: [-70, 0, 20], type: 'standard' },
      { id: 'P11', pos: [-60, 0, 25], type: 'premium' },
      { id: 'P12', pos: [-50, 0, 25], type: 'standard' },
      { id: 'P13', pos: [-40, 0, 25], type: 'premium' },
      { id: 'P14', pos: [-35, 0, 15], type: 'standard' },
      { id: 'P15', pos: [-30, 0, 8], type: 'premium' },
      { id: 'P16', pos: [-25, 0, 0], type: 'standard' },

      // Third row - outer pool deck area
      { id: 'P17', pos: [-80, 0, 30], type: 'standard' },
      { id: 'P18', pos: [-70, 0, 35], type: 'premium' },
      { id: 'P19', pos: [-60, 0, 35], type: 'standard' },
      { id: 'P20', pos: [-50, 0, 35], type: 'premium' },
      { id: 'P21', pos: [-40, 0, 35], type: 'standard' },
      { id: 'P22', pos: [-30, 0, 30], type: 'premium' },
      { id: 'P23', pos: [-25, 0, 20], type: 'standard' },
      { id: 'P24', pos: [-20, 0, 10], type: 'premium' },

      // LAWN AREA UMBRELLAS (right side near green space)
      { id: 'L1', pos: [45, 0, -10], type: 'premium' },
      { id: 'L2', pos: [55, 0, -5], type: 'standard' },
      { id: 'L3', pos: [65, 0, 0], type: 'premium' },
      { id: 'L4', pos: [75, 0, 5], type: 'standard' },
      { id: 'L5', pos: [50, 0, 10], type: 'premium' },
      { id: 'L6', pos: [60, 0, 15], type: 'standard' },
      { id: 'L7', pos: [70, 0, 20], type: 'premium' },
      { id: 'L8', pos: [80, 0, 25], type: 'standard' }
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