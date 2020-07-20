// We always need a scene.
var scene = new THREE.Scene();

// Creates a fence using small pickets
function makeFence(numPickets) {
  var fence = new THREE.Object3D();

  var picketG = TW.createBarn(0.09, 1, 0.1);
  var picketM = new THREE.MeshNormalMaterial();
  var picket = new THREE.Mesh(picketG, picketM);
  var i;

  for (i = 0; i < numPickets; ++i) {
    picket = picket.clone();
    picket.translateX(0.1);
    fence.add(picket);
  }
  return fence;
}

// Create a barn, fence and ground
var barn = new TW.createMesh(TW.createBarn(5, 5, 10));
scene.add(barn);

fence = makeFence(40);
fence.translateX(5);

fence2 = fence.clone();
fence2.translateZ(-10);

fence3 = makeFence(100);
fence3.translateX(9.2);
fence3.rotation.y = Math.PI / 2;

scene.add(fence);
scene.add(fence2);
scene.add(fence3);

// ground will go from -10 to +10 in X and Z
var ground = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshBasicMaterial({ color: THREE.ColorKeywords.darkgreen })
);
ground.rotation.x = -Math.PI / 2;

scene.add(ground);

// object to store the desired camera parameters
var cameraParams = {
  near: 1,
  far: 1000,
  fov: 90, // degrees
  aspectRatio: 800 / 500, // from dimensions of the canvas, see CSS
  atX: 0,
  atY: 0,
  atZ: 0,
  eyeX: 0,
  eyeY: 45,
  eyeZ: 40,
  upX: 0,
  upY: 1,
  upZ: 0,
};

// setupCamera() function creates and returns a camera with the desired parameters
function setupCamera(cameraParameters) {
  // set up an abbreviation
  var cp = cameraParameters;
  // create an initial camera with the desired shape
  var camera = new THREE.PerspectiveCamera(
    cp.fov,
    cp.aspectRatio,
    cp.near,
    cp.far
  );
  // set the camera location and orientation
  camera.position.set(cp.eyeX, cp.eyeY, cp.eyeZ);
  camera.up.set(cp.upX, cp.upY, cp.upZ);
  camera.lookAt(new THREE.Vector3(cp.atX, cp.atY, cp.atZ));
  return camera;
}

// We always need a renderer
var renderer = new THREE.WebGLRenderer();

TW.mainInit(renderer, scene);

// create camera, add to scene, and render scene with new camera
var camera = setupCamera(cameraParams);
scene.add(camera);

function render() {
  // a render function; assume global variables scene, renderer, and camera
  renderer.render(scene, camera);
}
render();

/**
 * From every camera position to the next (1,2,3,4,5,6,7,8,9,0), the following pattern is established:
 * eyeY -= 4
 * eyeZ -= 3
 * atY += 1
 *
 * The first camera setting is:
 * eyeY = 45;
 * eyeZ = 40;
 * atY = 0;
 *
 * The last camera setting is:
 * eyeY = 9;
 * eyeZ = 13;
 * atY = 9;
 *
 * This was discovered by matching the last camera in the solution to the GUI provided
 * and then figuring out the second to last camera. The pattern was then immediately discovered.
 *
 * The camera is initally situated above (45), back (40), and looking at 0 (Y).
 * As the eye level above and to the back back mitigate at a linear rate, the effect is that of a plane landing.
 * Looking at a higher Y slowly gives the effect of the nose slowly ascending upon descent.
 */

function cameraOne() {
  // Remove the current camera
  scene.remove(camera);

  cameraParams.eyeY = 45;
  cameraParams.eyeZ = 40;
  cameraParams.atY = 0;

  // Create new camera using new parameters, add it to the scene, and render
  camera = setupCamera(cameraParams);
  scene.add(camera);
  render();

  document.getElementById("slidename").innerHTML = "Frame 1";
}

function cameraTwo() {
  // Remove the current camera
  scene.remove(camera);

  cameraParams.eyeY = 41;
  cameraParams.eyeZ = 37;
  cameraParams.atY = 1;

  // Create new camera using new parameters, add it to the scene, and render
  camera = setupCamera(cameraParams);
  scene.add(camera);
  render();

  document.getElementById("slidename").innerHTML = "Frame 2";
}

function cameraThree() {
  // Remove the current camera
  scene.remove(camera);

  cameraParams.eyeY = 37;
  cameraParams.eyeZ = 34;
  cameraParams.atY = 2;

  // Create new camera using new parameters, add it to the scene, and render
  camera = setupCamera(cameraParams);
  scene.add(camera);
  render();

  document.getElementById("slidename").innerHTML = "Frame 3";
}

function cameraFour() {
  // Remove the current camera
  scene.remove(camera);

  cameraParams.eyeY = 33;
  cameraParams.eyeZ = 31;
  cameraParams.atY = 3;

  // Create new camera using new parameters, add it to the scene, and render
  camera = setupCamera(cameraParams);
  scene.add(camera);
  render();

  document.getElementById("slidename").innerHTML = "Frame 4";
}

function cameraFive() {
  // Remove the current camera
  scene.remove(camera);

  cameraParams.eyeY = 29;
  cameraParams.eyeZ = 28;
  cameraParams.atY = 4;

  // Create new camera using new parameters, add it to the scene, and render
  camera = setupCamera(cameraParams);
  scene.add(camera);
  render();

  document.getElementById("slidename").innerHTML = "Frame 5";
}

function cameraSix() {
  // Remove the current camera
  scene.remove(camera);

  cameraParams.eyeY = 25;
  cameraParams.eyeZ = 25;
  cameraParams.atY = 5;

  // Create new camera using new parameters, add it to the scene, and render
  camera = setupCamera(cameraParams);
  scene.add(camera);
  render();

  document.getElementById("slidename").innerHTML = "Frame 6";
}

function cameraSeven() {
  // Remove the current camera
  scene.remove(camera);

  cameraParams.eyeY = 21;
  cameraParams.eyeZ = 22;
  cameraParams.atY = 6;

  // Create new camera using new parameters, add it to the scene, and render
  camera = setupCamera(cameraParams);
  scene.add(camera);
  render();

  document.getElementById("slidename").innerHTML = "Frame 7";
}

function cameraEight() {
  // Remove the current camera
  scene.remove(camera);

  cameraParams.eyeY = 17;
  cameraParams.eyeZ = 19;
  cameraParams.atY = 7;

  // Create new camera using new parameters, add it to the scene, and render
  camera = setupCamera(cameraParams);
  scene.add(camera);
  render();

  document.getElementById("slidename").innerHTML = "Frame 8";
}

function cameraNine() {
  // Remove the current camera
  scene.remove(camera);

  cameraParams.eyeY = 13;
  cameraParams.eyeZ = 16;
  cameraParams.atY = 8;

  // Create new camera using new parameters, add it to the scene, and render
  camera = setupCamera(cameraParams);
  scene.add(camera);
  render();

  document.getElementById("slidename").innerHTML = "Frame 9";
}

function cameraTen() {
  // Remove the current camera
  scene.remove(camera);

  cameraParams.eyeY = 9;
  cameraParams.eyeZ = 13;
  cameraParams.atY = 9;

  // Create new camera using new parameters, add it to the scene, and render
  camera = setupCamera(cameraParams);
  scene.add(camera);
  render();

  document.getElementById("slidename").innerHTML = "Frame 10";
}

// 10 Keyboard callbacks
TW.setKeyboardCallback("1", cameraOne, "camera setup 1");
TW.setKeyboardCallback("2", cameraTwo, "camera setup 2");
TW.setKeyboardCallback("3", cameraThree, "camera setup 3");
TW.setKeyboardCallback("4", cameraFour, "camera setup 4");
TW.setKeyboardCallback("5", cameraFive, "camera setup 5");
TW.setKeyboardCallback("6", cameraSix, "camera setup 6");
TW.setKeyboardCallback("7", cameraSeven, "camera setup 7");
TW.setKeyboardCallback("8", cameraEight, "camera setup 8");
TW.setKeyboardCallback("9", cameraNine, "camera setup 9");
TW.setKeyboardCallback("0", cameraTen, "camera setup 10");
