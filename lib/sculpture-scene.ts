import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export type SculptureScene = {
  update: (angle: number, light: number) => void;
  dispose: () => void;
};

/** No animation loop: only input, resize and visibility request a frame. */
export async function mountSculpture(
  canvas: HTMLCanvasElement,
  signal: AbortSignal,
): Promise<SculptureScene> {
  signal.throwIfAborted();
  let renderer: THREE.WebGLRenderer | undefined;
  let environment: THREE.WebGLRenderTarget | undefined;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
  camera.position.set(5.1, 3.6, 8.3);
  camera.lookAt(0, 1.65, 0);
  const key = new THREE.DirectionalLight(0xffddbb, 4);
  key.position.set(3, 7, 5);
  const rim = new THREE.DirectionalLight(0x6faaff, 5);
  rim.position.set(-4, 3, -2);
  scene.add(key, rim, new THREE.HemisphereLight(0xdceeff, 0xd4947b, 2.2));
  let model: THREE.Group | undefined;
  let disposed = false;
  let frame = 0;
  let inView = true;
  const materials = new Set<THREE.Material>();
  const geometries = new Set<THREE.BufferGeometry>();
  const disposeModel = (root: THREE.Object3D) =>
    root.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      geometries.add(object.geometry);
      for (const material of Array.isArray(object.material)
        ? object.material
        : [object.material])
        materials.add(material);
    });
  const draw = () => {
    frame = 0;
    if (disposed || signal.aborted || !inView || document.hidden || !renderer)
      return;
    const { width, height } = canvas.getBoundingClientRect();
    if (width < 1 || height < 1) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    canvas.dataset.renderCount = String(
      Number(canvas.dataset.renderCount || 0) + 1,
    );
  };
  const request = () => {
    if (!disposed && !frame) frame = requestAnimationFrame(draw);
  };
  const resize = new ResizeObserver(request);
  const visibility = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    request();
  });
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    resize.disconnect();
    visibility.disconnect();
    document.removeEventListener("visibilitychange", request);
    signal.removeEventListener("abort", dispose);
    if (model) disposeModel(model);
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    environment?.dispose();
    renderer?.dispose();
    renderer?.forceContextLoss();
    delete canvas.dataset.renderCount;
  };
  signal.addEventListener("abort", dispose, { once: true });
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    let generator: THREE.PMREMGenerator | undefined;
    let room: RoomEnvironment | undefined;
    try {
      generator = new THREE.PMREMGenerator(renderer);
      room = new RoomEnvironment();
      environment = generator.fromScene(room, 0.04);
      scene.environment = environment.texture;
    } finally {
      room?.dispose();
      generator?.dispose();
    }
    const response = await fetch("/scene/coastal-sculpture.glb", { signal });
    if (!response.ok) throw new Error("Sculpture unavailable");
    const data = await response.arrayBuffer();
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");
    const asset = await new GLTFLoader().parseAsync(data, "");
    model = asset.scene;
    if (signal.aborted) {
      disposeModel(model);
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      throw new DOMException("Aborted", "AbortError");
    }
    model.rotation.y = -0.2;
    scene.add(model);
    resize.observe(canvas);
    visibility.observe(canvas);
    document.addEventListener("visibilitychange", request);
    request();
    return {
      update(angle, light) {
        if (disposed || !model) return;
        model.rotation.y = (angle * Math.PI) / 180 - 0.2;
        const colors = [
          [0xffddbb, 0x6faaff],
          [0xb8deff, 0x738fff],
          [0xffc8d9, 0xc95b94],
        ];
        const [a, b] = colors[light] || colors[0];
        key.color.setHex(a);
        rim.color.setHex(b);
        request();
      },
      dispose,
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
