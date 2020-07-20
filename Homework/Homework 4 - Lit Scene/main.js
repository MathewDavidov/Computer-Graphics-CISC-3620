// Object for scene parameters
var sceneParams = {
  wallColor: 0x30a0ce,
  ceilingColor: 0x2a5218,
  floorColor: 0xffce90,

  boxLength: 10,

  sconceColor: 0x535961, //BEBEA0,
  sconceSpecular: 0xffffff,
  sconceRadiusTop: 0.01,
  sconceRadiusBottom: 0.5,
  sconceHeight: 1,
  sconceOpenEnded: true,
  sconceRotationBottom: 0,
  sconceRotationTop: Math.PI,
  sconceOffSet: 1,

  ballRadius: 1,
  ballColor: 0x6a0dad,
  ballSpecular: 0xa0a0a0,

  detail: 64,

  spotlightColor: 0xffffff,
  spotlightIntensity: 1.5,
  spotlightDistance: 0,
  spotlightAngle: Math.PI / 6,
  spotlightPenumbra: 0,
  spotlightDecay: 1,

  ambLightColor: 0x808080,
  directionalLightColor: 0xffffff,
  directionalLightIntensity: 0.7,
  directionalXOffSet: 1.25,

  ambientOn: true,
  directionalOn: true,
  spotlightOn: true,
};

var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
TW.mainInit(renderer, scene);

/**
 * Helper function to call all the methods to draw the scene
 */
function drawScene() {
  drawBox();
  ambientLight();

  // Each call will draw one half of the sconce
  drawSconce(sceneParams.sconceRotationBottom, -1, spotDown);
  drawSconce(sceneParams.sconceRotationTop, 1, spotUp);

  drawBall();
  directionalLight();
}

function drawBox() {
  // Create a box for the scene
  // NOTE: boxLength/2 gives the "radius"
  var boxGeometry = new THREE.BoxGeometry(
    sceneParams.boxLength,
    sceneParams.boxLength,
    sceneParams.boxLength
  );

  // Create an array of materials for each of the six faces, because some are different materials.
  var cubeMaterials = [
    new THREE.MeshPhongMaterial({
      color: sceneParams.wallColor,
      shading: THREE.SmoothShading,
      side: THREE.BackSide,
    }),
    new THREE.MeshPhongMaterial({
      color: sceneParams.wallColor,
      shading: THREE.SmoothShading,
      side: THREE.BackSide,
    }),
    new THREE.MeshPhongMaterial({
      color: sceneParams.ceilingColor,
      shading: THREE.SmoothShading,
      side: THREE.BackSide,
    }),
    new THREE.MeshPhongMaterial({
      color: sceneParams.floorColor,
      shading: THREE.SmoothShading,
      side: THREE.BackSide,
    }),
    new THREE.MeshPhongMaterial({
      color: sceneParams.wallColor,
      shading: THREE.SmoothShading,
      side: THREE.BackSide,
    }),
    new THREE.MeshPhongMaterial({
      color: sceneParams.wallColor,
      shading: THREE.SmoothShading,
      side: THREE.BackSide,
    }),
  ];

  var boxMaterial = new THREE.MeshFaceMaterial(cubeMaterials);

  var box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.name = "box";

  scene.add(box);
}

function drawSconce(rotation, side, spotLight) {
  // A side of the sconce is a cylinder with one radius being near zero
  var sconceGeometry = new THREE.CylinderGeometry(
    sceneParams.sconceRadiusTop,
    sceneParams.sconceRadiusBottom,
    sceneParams.sconceHeight,
    sceneParams.detail,
    sceneParams.detail,
    sceneParams.sconceOpenEnded
  );

  var sconceMaterial = new THREE.MeshPhongMaterial({
    color: sceneParams.sconceColor,
    side: THREE.DoubleSide,
    shading: THREE.SmoothShading,
    specular: sceneParams.sconceSpecular,
  });

  var sconce = new THREE.Mesh(sconceGeometry, sconceMaterial);

  // Determine where the sconce is positioned
  // X coordinate is to the left side of the box, but offset by the larger radius of the sconce and some arbitrary offset
  var posX =
    -sceneParams.boxLength / 2 +
    sceneParams.sconceRadiusBottom +
    sceneParams.sconceOffSet;

  // Y coordinate is elevated by the height of the sconce, and then adjust based on which half
  var posY = (side * sceneParams.sconceHeight) / 2 + sceneParams.sconceHeight;

  // Z coordinate is away from the camera by the radius of the box and then offset by the larger radius to keep it inside the box
  var posZ = -sceneParams.boxLength / 2 + sceneParams.sconceRadiusBottom;

  // Rotation is passed in based on which side the half is (top or bottom)
  sconce.rotation.x = rotation;
  sconce.position.x = posX;
  sconce.position.y = posY;
  sconce.position.z = posZ;

  scene.add(sconce);

  // Each function call to sconce will have a spotlight for *that* side
  spotlight(spotLight, side, posX, posZ);
}

function spotlight(spotLight, side, posX, posZ) {
  if (sceneParams.spotlightOn) {
    //create a spotlight
    spotLight = new THREE.SpotLight(
      sceneParams.spotlightColor,
      sceneParams.spotlightIntensity,
      sceneParams.spotlightDistance,
      sceneParams.spotlightAngle,
      sceneParams.spotlightPenumbra,
      sceneParams.spotlightDecay
    );
    spotLight.name = "spot " + side;

    // Spotlight placed at same x and z coordinate as sconce, but y is based on the height of sconce.
    spotLight.position.set(posX, sceneParams.sconceHeight, posZ);

    var spotLightTarget = new THREE.Object3D();

    // Target positioned at:
    // x coordinate is the same
    // y coordinate is the ceiling of the box on the correct side
    // z coordinate is the same except subtract the larger radius (this aims it at the corner)
    spotLightTarget.position.set(
      posX,
      side * sceneParams.boxLength,
      posZ - sceneParams.sconceRadiusBottom
    );
    spotLight.target = spotLightTarget;
    scene.add(spotLight);
    scene.add(spotLight.target);
  }
}

function drawBall() {
  // Draw a ball
  var ballGeometry = new THREE.SphereGeometry(
    sceneParams.ballRadius,
    sceneParams.detail,
    sceneParams.detail
  );
  var ballMaterial = new THREE.MeshPhongMaterial({
    color: sceneParams.ballColor,
    specular: sceneParams.ballSpecular,
    side: THREE.DoubleSide,
    shading: THREE.SmoothShading,
  });
  var sphere = new THREE.Mesh(ballGeometry, ballMaterial);

  // x coordinate same as sconce
  var posX =
    -sceneParams.boxLength / 2 +
    sceneParams.sconceRadiusBottom +
    sceneParams.sconceOffSet;

  // y coordinate moves the ball to the floor and adjust based on radius so it sits on the floor
  var posY = -sceneParams.boxLength / 2 + sceneParams.ballRadius;

  // z coordinate moves the ball to the wall and adjust based on radius so its on the wall
  var posZ = -sceneParams.boxLength / 2 + sceneParams.ballRadius;

  sphere.position.x = posX;
  sphere.position.y = posY;
  sphere.position.z = posZ;

  scene.add(sphere);
}

// Create an ambient light for the scene
function ambientLight() {
  if (sceneParams.ambientOn) {
    ambLight = new THREE.AmbientLight(sceneParams.ambLightColor);
    ambLight.name = "ambient";
    scene.add(ambLight);
  }
}

// Create a directional light for the scene
function directionalLight() {
  if (sceneParams.directionalOn) {
    directionallight = new THREE.DirectionalLight(
      sceneParams.directionalLightColor,
      sceneParams.directionalLightIntensity
    );

    // to get the wall on the side of the sconce to be the brightest and the left following that, change position
    directionallight.position.set(
      sceneParams.boxLength / sceneParams.directionalXOffSet,
      sceneParams.boxLength / 2,
      sceneParams.boxLength
    );
    directionallight.name = "direction";
    scene.add(directionallight);
  }
}

// Begin drawing the scene
drawScene();

// Get references to the lights to enable visibility
var ambLight = scene.getObjectByName("ambient");
var directionallight = scene.getObjectByName("direction");
var spotDown = scene.getObjectByName("spot -1");
var spotUp = scene.getObjectByName("spot 1");

// Set a camera for the scene
TW.cameraSetup(renderer, scene, {
  minx: -5,
  maxx: 5,
  miny: -5,
  maxy: 5,
  minz: -5,
  maxz: 1,
});
//TW.toggleAxes("show");

// Three functions for toggling visibility
function changeAmbientOn() {
  ambLight.visible = sceneParams.ambientOn;
  TW.render();
}

function changeDirectionalOn() {
  directionallight.visible = sceneParams.directionalOn;
  TW.render();
}

function changeSpotlightOn() {
  spotDown.visible = sceneParams.spotlightOn;
  spotUp.visible = sceneParams.spotlightOn;
  TW.render();
}

// Variable that initializes a GUI
var gui = new dat.GUI();

// 3 GUI slide controls for the three paramters that change light
gui.add(sceneParams, "ambientOn").onChange(changeAmbientOn);
gui.add(sceneParams, "directionalOn").onChange(changeDirectionalOn);
gui.add(sceneParams, "spotlightOn").onChange(changeSpotlightOn);
