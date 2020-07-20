// We always need a scene.
var scene = new THREE.Scene();

// TW Barn
var barn = TW.createWireBarn(10, 10, 20);

scene.add(barn);

// object to store the desired camera parameters
var cameraParams = {
  near: 1,
  far: 200,
  fov: 90, // degrees
  aspectRatio: 800 / 500, // from dimensions of the canvas, see CSS
  atX: 0,
  atY: 0,
  atZ: 0,
  eyeX: 0,
  eyeY: 0,
  eyeZ: 30,
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

function cameraOne() {
  // Remove the current camera
  scene.remove(camera);

  // Adjust the parameters for new camera (same as orignal camera params, but needed once switched)
  cameraParams.fov = 90;
  cameraParams.eyeX = 0;
  cameraParams.eyeY = 0;
  cameraParams.eyeZ = 30;
  cameraParams.upX = 0;
  cameraParams.upY = 1;
  cameraParams.upZ = 0;

  // Create new camera using new parameters, add it to the scene, and render
  camera = setupCamera(cameraParams);
  scene.add(camera);
  render();

  document.getElementById("slidename").innerHTML = "Slide 1";
}

function cameraTwo() {
  // Remove the current camera
  scene.remove(camera);

  // Adjust the parameters for new camera
  // Change FOV to 60
  // Adjust 30 in X direction from previous camera, and 10 in Z
  // This sets the camera to the right of the barn (+X) and further back (+Z)
  cameraParams.fov = 60;
  cameraParams.eyeX = 30;
  cameraParams.eyeY = 0;
  cameraParams.eyeZ = 40;
  cameraParams.upX = 0;
  cameraParams.upY = 1;
  cameraParams.upZ = 0;

  // Create new camera using new parameters, add it to the scene, and render
  camera = setupCamera(cameraParams);
  scene.add(camera);
  render();

  document.getElementById("slidename").innerHTML = "Slide 2";
}

function cameraThree() {
  // Remove the current camera
  scene.remove(camera);

  // Adjust the parameters for new camera
  // Adjust -10 in X direction from previous camera, +20 Y, -20 Z.
  // This sets the camera a little less to right (-X), more from above (+Y), and closer (-Z)
  cameraParams.fov = 60;
  cameraParams.eyeX = 20;
  cameraParams.eyeY = 20;
  cameraParams.eyeZ = 20;
  cameraParams.upX = 0;
  cameraParams.upY = 1;
  cameraParams.upZ = 0;

  // Create new camera using new parameters, add it to the scene, and render
  camera = setupCamera(cameraParams);
  scene.add(camera);
  render();

  document.getElementById("slidename").innerHTML = "Slide 3";
}

function cameraFour() {
  // Remove the current camera
  scene.remove(camera);

  // Adjust the parameters for new camera
  // Adjust to only 50 in Y direction (X and Z are 0) and set the up vector to 1 in X and Y
  // This sets the camera from the Y direction and changes the up vector
  cameraParams.fov = 60;
  cameraParams.eyeX = 0;
  cameraParams.eyeY = 50;
  cameraParams.eyeZ = 0;
  cameraParams.upX = 1;
  cameraParams.upY = 1;
  cameraParams.upZ = 0;

  // Create new camera using new parameters, add it to the scene, and render
  camera = setupCamera(cameraParams);
  scene.add(camera);
  render();

  document.getElementById("slidename").innerHTML = "Slide 4";
}

function cameraFive() {
  // Remove the current camera
  scene.remove(camera);

  // Adjust the parameters for new camera
  // Only change the up vector Z to -2 from previous camera.
  // This changes the up vector
  cameraParams.fov = 60;
  cameraParams.eyeX = 0;
  cameraParams.eyeY = 50;
  cameraParams.eyeZ = 0;
  cameraParams.upX = 1;
  cameraParams.upY = 1;
  cameraParams.upZ = -2;

  // Create new camera using new parameters, add it to the scene, and render
  camera = setupCamera(cameraParams);
  scene.add(camera);
  render();

  document.getElementById("slidename").innerHTML = "Slide 5";
}

// 5 Keyboard callbacks
TW.setKeyboardCallback("1", cameraOne, "camera setup 1");
TW.setKeyboardCallback("2", cameraTwo, "camera setup 2");
TW.setKeyboardCallback("3", cameraThree, "camera setup 3");
TW.setKeyboardCallback("4", cameraFour, "camera setup 4");
TW.setKeyboardCallback("5", cameraFive, "camera setup 5");
