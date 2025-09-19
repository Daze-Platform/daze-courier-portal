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

    // Enhanced materials with better visibility
    const buildingMaterial = new THREE.MeshLambertMaterial({ 
      color: '#E8F4FD',
      transparent: false
    });
    const accentMaterial = new THREE.MeshLambertMaterial({ color: '#1E90FF' });
    const poolMaterial = new THREE.MeshLambertMaterial({ 
      color: '#0066CC',
      transparent: true,
      opacity: 0.9
    });
    const deckMaterial = new THREE.MeshLambertMaterial({ color: '#E6D7B3' });
    const beachMaterial = new THREE.MeshLambertMaterial({ color: '#F4A460' });
    const roofMaterial = new THREE.MeshLambertMaterial({ color: '#CC0000' });

    // SpringHill Suites Main Building Complex
    // Based on typical SpringHill Suites 6-8 story layout with wings
    
    // Central main tower (8 floors)
    const centralTower = new THREE.Mesh(
      new THREE.BoxGeometry(0.025, 0.048, 0.015),
      buildingMaterial
    );
    centralTower.position.set(0, 0.024, -0.008);
    this.world.add(centralTower);

    // Left wing (6 floors)
    const leftWing = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.036, 0.012),
      buildingMaterial
    );
    leftWing.position.set(-0.022, 0.018, -0.005);
    this.world.add(leftWing);

    // Right wing (6 floors)
    const rightWing = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.036, 0.012),
      buildingMaterial
    );
    rightWing.position.set(0.022, 0.018, -0.005);
    this.world.add(rightWing);

    // Red tile roofs
    const centralRoof = new THREE.Mesh(
      new THREE.BoxGeometry(0.027, 0.003, 0.017),
      roofMaterial
    );
    centralRoof.position.set(0, 0.0495, -0.008);
    this.world.add(centralRoof);

    const leftRoof = new THREE.Mesh(
      new THREE.BoxGeometry(0.022, 0.003, 0.014),
      roofMaterial
    );
    leftRoof.position.set(-0.022, 0.0375, -0.005);
    this.world.add(leftRoof);

    const rightRoof = new THREE.Mesh(
      new THREE.BoxGeometry(0.022, 0.003, 0.014),
      roofMaterial
    );
    rightRoof.position.set(0.022, 0.0375, -0.005);
    this.world.add(rightRoof);

    // Ground floor lobby and entrance
    const lobby = new THREE.Mesh(
      new THREE.BoxGeometry(0.035, 0.006, 0.02),
      new THREE.MeshLambertMaterial({ color: '#FFFFFF' })
    );
    lobby.position.set(0, 0.003, 0.005);
    this.world.add(lobby);

    // Entrance canopy
    const canopy = new THREE.Mesh(
      new THREE.BoxGeometry(0.025, 0.002, 0.015),
      accentMaterial
    );
    canopy.position.set(0, 0.008, 0.015);
    this.world.add(canopy);

    // Pool Complex Area
    // Large pool deck platform
    const mainDeck = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.002, 0.08),
      deckMaterial
    );
    mainDeck.position.set(0, -0.001, 0.05);
    this.world.add(mainDeck);

    // Large L-shaped infinity pool
    const mainPoolSection = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.004, 0.025),
      poolMaterial
    );
    mainPoolSection.position.set(0.01, 0.002, 0.045);
    this.world.add(mainPoolSection);

    const poolExtension = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.004, 0.015),
      poolMaterial
    );
    poolExtension.position.set(-0.025, 0.002, 0.032);
    this.world.add(poolExtension);

    // Lazy river connecting section
    const lazyRiver = new THREE.Mesh(
      new THREE.BoxGeometry(0.025, 0.003, 0.012),
      poolMaterial
    );
    lazyRiver.position.set(-0.015, 0.0015, 0.065);
    this.world.add(lazyRiver);

    // Kids pool area
    const kidsPool = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.002, 16),
      poolMaterial
    );
    kidsPool.position.set(0.035, 0.001, 0.025);
    this.world.add(kidsPool);

    // Hot tub/spa area
    const hotTub1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.005, 0.005, 0.003, 16),
      new THREE.MeshLambertMaterial({ color: '#FF6B35', transparent: true, opacity: 0.9 })
    );
    hotTub1.position.set(0.025, 0.0015, 0.065);
    this.world.add(hotTub1);

    const hotTub2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.005, 0.005, 0.003, 16),
      new THREE.MeshLambertMaterial({ color: '#FF6B35', transparent: true, opacity: 0.9 })
    );
    hotTub2.position.set(0.035, 0.0015, 0.065);
    this.world.add(hotTub2);

    // Tiki Bar structure
    const tikiBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.015, 0.008, 0.008),
      new THREE.MeshLambertMaterial({ color: '#8B4513' })
    );
    tikiBar.position.set(-0.045, 0.004, 0.04);
    this.world.add(tikiBar);

    // Tiki Bar roof
    const tikiRoof = new THREE.Mesh(
      new THREE.ConeGeometry(0.012, 0.006, 8),
      new THREE.MeshLambertMaterial({ color: '#DEB887' })
    );
    tikiRoof.position.set(-0.045, 0.011, 0.04);
    this.world.add(tikiRoof);

    // Beach Area - wider and more realistic
    const beachArea = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.001, 0.06),
      beachMaterial
    );
    beachArea.position.set(0, -0.0005, 0.12);
    this.world.add(beachArea);

    // Boardwalk/walkway to beach
    const boardwalk = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.001, 0.008),
      new THREE.MeshLambertMaterial({ color: '#DEB887' })
    );
    boardwalk.position.set(0, 0, 0.095);
    this.world.add(boardwalk);

    // Landscaping elements
    // Palm trees around pool area
    this.addPalmTrees();
    
    // Add resort umbrellas and loungers
    this.addResortUmbrellas();

    // Enhanced lighting system
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene!.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
    sunLight.position.set(0.1, 0.15, 0.1);
    sunLight.castShadow = true;
    this.scene!.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x87CEEB, 0.3);
    fillLight.position.set(-0.1, 0.1, -0.05);
    this.scene!.add(fillLight);
  }

  private addPalmTrees() {
    if (!this.world) return;

    const palmPositions = [
      [-0.06, 0, 0.02], [0.06, 0, 0.02],
      [-0.08, 0, 0.07], [0.08, 0, 0.07],
      [-0.03, 0, 0.09], [0.03, 0, 0.09]
    ];

    palmPositions.forEach(pos => {
      // Palm tree trunk
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0008, 0.001, 0.012, 8),
        new THREE.MeshLambertMaterial({ color: '#8B4513' })
      );
      trunk.position.set(pos[0], 0.006, pos[2]);
      this.world!.add(trunk);

      // Palm fronds
      for (let i = 0; i < 6; i++) {
        const frond = new THREE.Mesh(
          new THREE.BoxGeometry(0.006, 0.001, 0.002),
          new THREE.MeshLambertMaterial({ color: '#228B22' })
        );
        frond.position.set(pos[0], 0.012, pos[2]);
        frond.rotation.y = (Math.PI * 2 / 6) * i;
        frond.rotation.z = -0.3;
        this.world!.add(frond);
      }
    });
  }

  private addResortUmbrellas() {
    if (!this.world) return;

    const umbrellaPositions = [
      // Pool deck umbrellas - around main pool
      { id: 'P1', pos: [-0.025, 0, 0.035], type: 'premium' },
      { id: 'P2', pos: [-0.015, 0, 0.035], type: 'standard' },
      { id: 'P3', pos: [-0.005, 0, 0.035], type: 'premium' },
      { id: 'P4', pos: [0.005, 0, 0.035], type: 'standard' },
      { id: 'P5', pos: [0.015, 0, 0.035], type: 'premium' },
      { id: 'P6', pos: [0.025, 0, 0.035], type: 'standard' },
      // Pool deck second row
      { id: 'P7', pos: [-0.035, 0, 0.055], type: 'premium' },
      { id: 'P8', pos: [-0.02, 0, 0.055], type: 'standard' },
      { id: 'P9', pos: [-0.005, 0, 0.055], type: 'premium' },
      { id: 'P10', pos: [0.01, 0, 0.055], type: 'standard' },
      { id: 'P11', pos: [0.025, 0, 0.055], type: 'premium' },
      { id: 'P12', pos: [0.04, 0, 0.055], type: 'standard' },
      // Beach umbrellas - first row  
      { id: 'B1', pos: [-0.06, 0, 0.115], type: 'standard' },
      { id: 'B2', pos: [-0.045, 0, 0.115], type: 'premium' },
      { id: 'B3', pos: [-0.03, 0, 0.115], type: 'standard' },
      { id: 'B4', pos: [-0.015, 0, 0.115], type: 'premium' },
      { id: 'B5', pos: [0, 0, 0.115], type: 'standard' },
      { id: 'B6', pos: [0.015, 0, 0.115], type: 'premium' },
      { id: 'B7', pos: [0.03, 0, 0.115], type: 'standard' },
      { id: 'B8', pos: [0.045, 0, 0.115], type: 'premium' },
      { id: 'B9', pos: [0.06, 0, 0.115], type: 'standard' },
      // Beach umbrellas - second row
      { id: 'B10', pos: [-0.05, 0, 0.135], type: 'premium' },
      { id: 'B11', pos: [-0.035, 0, 0.135], type: 'standard' },
      { id: 'B12', pos: [-0.02, 0, 0.135], type: 'premium' },
      { id: 'B13', pos: [-0.005, 0, 0.135], type: 'standard' },
      { id: 'B14', pos: [0.01, 0, 0.135], type: 'premium' },
      { id: 'B15', pos: [0.025, 0, 0.135], type: 'standard' },
      { id: 'B16', pos: [0.04, 0, 0.135], type: 'premium' },
      // VIP Beach umbrellas - premium beachfront
      { id: 'VIP1', pos: [-0.025, 0, 0.15], type: 'premium' },
      { id: 'VIP2', pos: [-0.01, 0, 0.15], type: 'premium' },
      { id: 'VIP3', pos: [0.005, 0, 0.15], type: 'premium' },
      { id: 'VIP4', pos: [0.02, 0, 0.15], type: 'premium' },
    ];

    umbrellaPositions.forEach(umbrella => {
      const umbrellaGroup = new THREE.Group();
      
      // Umbrella pole - taller and more visible
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0005, 0.0008, 0.012, 8),
        new THREE.MeshLambertMaterial({ color: '#8B4513' })
      );
      pole.position.set(0, 0.006, 0);
      umbrellaGroup.add(pole);

      // Umbrella canopy - larger and more colorful
      const canopyColor = umbrella.type === 'premium' ? '#FF6B35' : '#4A90E2';
      const canopy = new THREE.Mesh(
        new THREE.ConeGeometry(0.006, 0.004, 12),
        new THREE.MeshLambertMaterial({ 
          color: canopyColor,
          transparent: true,
          opacity: 0.9
        })
      );
      canopy.position.set(0, 0.014, 0);
      umbrellaGroup.add(canopy);

      // Umbrella ribs for realism
      for (let i = 0; i < 8; i++) {
        const rib = new THREE.Mesh(
          new THREE.BoxGeometry(0.0002, 0.005, 0.0002),
          new THREE.MeshLambertMaterial({ color: '#666666' })
        );
        rib.position.set(
          Math.cos(i * Math.PI / 4) * 0.003,
          0.012,
          Math.sin(i * Math.PI / 4) * 0.003
        );
        rib.rotation.y = i * Math.PI / 4;
        rib.rotation.z = 0.3;
        umbrellaGroup.add(rib);
      }

      // Premium loungers (better design)
      const loungerColor = umbrella.type === 'premium' ? '#FFFFFF' : '#F5F5DC';
      const loungerMaterial = new THREE.MeshLambertMaterial({ color: loungerColor });
      
      // Lounger 1 - with backrest
      const lounger1Base = new THREE.Mesh(
        new THREE.BoxGeometry(0.0015, 0.0003, 0.004),
        loungerMaterial
      );
      lounger1Base.position.set(-0.003, 0.0015, 0);
      umbrellaGroup.add(lounger1Base);

      const lounger1Back = new THREE.Mesh(
        new THREE.BoxGeometry(0.0015, 0.002, 0.0003),
        loungerMaterial
      );
      lounger1Back.position.set(-0.003, 0.003, -0.0015);
      lounger1Back.rotation.x = 0.2;
      umbrellaGroup.add(lounger1Back);

      // Lounger 2 - with backrest  
      const lounger2Base = new THREE.Mesh(
        new THREE.BoxGeometry(0.0015, 0.0003, 0.004),
        loungerMaterial
      );
      lounger2Base.position.set(0.003, 0.0015, 0);
      umbrellaGroup.add(lounger2Base);

      const lounger2Back = new THREE.Mesh(
        new THREE.BoxGeometry(0.0015, 0.002, 0.0003),
        loungerMaterial
      );
      lounger2Back.position.set(0.003, 0.003, -0.0015);
      lounger2Back.rotation.x = 0.2;
      umbrellaGroup.add(lounger2Back);

      // Side table between loungers
      const sideTable = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0008, 0.0008, 0.002, 8),
        new THREE.MeshLambertMaterial({ color: '#FFFFFF' })
      );
      sideTable.position.set(0, 0.002, 0);
      umbrellaGroup.add(sideTable);

      // Selection ring for interactivity
      if (this.selectedUmbrella === umbrella.id) {
        const selectionRing = new THREE.Mesh(
          new THREE.RingGeometry(0.008, 0.01, 16),
          new THREE.MeshBasicMaterial({ color: '#FFD700', transparent: true, opacity: 0.8 })
        );
        selectionRing.position.set(0, 0.0001, 0);
        selectionRing.rotation.x = -Math.PI / 2;
        umbrellaGroup.add(selectionRing);
      }

      // Premium umbrellas get extra features
      if (umbrella.type === 'premium') {
        // Umbrella base weight
        const base = new THREE.Mesh(
          new THREE.CylinderGeometry(0.002, 0.002, 0.001, 8),
          new THREE.MeshLambertMaterial({ color: '#333333' })
        );
        base.position.set(0, 0.0005, 0);
        umbrellaGroup.add(base);

        // Premium flag
        const flag = new THREE.Mesh(
          new THREE.BoxGeometry(0.002, 0.001, 0.0002),
          new THREE.MeshLambertMaterial({ color: '#FF6B35' })
        );
        flag.position.set(0, 0.016, 0);
        umbrellaGroup.add(flag);
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