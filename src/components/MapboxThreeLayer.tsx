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

    // Create a HUGE, bright red cube that should be very visible
    const testCube = new THREE.Mesh(
      new THREE.BoxGeometry(100, 100, 100),  // Large cube in real world meters
      new THREE.MeshBasicMaterial({ color: '#FF0000' })  // Bright red, no lighting needed
    );
    testCube.position.set(0, 50, 0);  // Elevated so it's above ground
    this.scene.add(testCube);
    console.log('Added HUGE test cube at position:', testCube.position);

    // Add bright ambient light to make sure everything is visible
    const ambientLight = new THREE.AmbientLight(0xffffff, 3.0);  // Very bright
    this.scene.add(ambientLight);
    console.log('Added bright ambient light');
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