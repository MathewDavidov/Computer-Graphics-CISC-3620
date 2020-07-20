// Object for scene parameters
var sceneParams = {
  wallColor: 0x9ce9f0,
  ceilingColor: 0x9ce9f0,
  floorColor: 0xffffff,

  ambLightColor: 0x838383,

  directionalLightColor: 0xffffff,
  directionalLightIntensity: 1,
  directionalLightX: 0.1,
  directionalLightY: 0.2,
  directionalLightZ: 0.5,

  spotlightColor: 0xffffff,
  spotlightIntensity: 0.25,
  spotlightDistance: 0,
  spotlightAngle: Math.PI / 12,
  spotlightPenumbra: 0,
  spotlightDecay: 1,

  sconceColor: 0x535961, //BEBEA0,
  sconceSpecular: 0xffffff,
  sconceRadiusTop: 0.01,
  sconceRadiusBottom: 1,
  sconceHeight: 3,
  sconceOpenEnded: true,
  sconceRotationBottom: 0,
  sconceRotationTop: Math.PI,
  sconceOffSet: 4,

  boxWidth: 40,
  boxHeight: 25,
  boxDepth: 25,

  backWallThickness: 0.25,
  backWallRotationY: Math.PI / 2,
  backWallColor: 0x053582,

  poleRadius: 0.5,
  poleHeight: 10,

  poleExtensionRadius: 0.5,
  poleExtensionHeight: 2,
  poleExtensionRotationZ: Math.PI / 2,

  backBoardWidth: 5,
  backBoardHeight: 5,
  backBoardDepth: 1,
  backBoardRotationY: Math.PI / 2,

  rimRadiusTop: 1.2,
  rimRadiusBottom: 1.2,
  rimHeight: 0.5,
  rimSegments: 32,
  rimOpenEnded: true,
  rimOffSet: 0.7,
};

// Parameters of the scene and animation
var guiParams = {
  ballRadius: 1, // radius of the ball
  ballBouncePeriod: 3, // time to bounce once, in arbitrary time units
  maxBallHeight: 0, // max y position of the center of the ball
  deltaT: 0.035, // time between steps, in arbitrary time units
  ballVelocityX: 3, // movement per frame in X direction
  ballInitialX: 0, // initial X position,
  mode: "showNets", // which floor texture is used
};

// We need a scene.
var scene = new THREE.Scene();

// Ambient light for the scene using a shade of gray.
ambLight = new THREE.AmbientLight(sceneParams.ambLightColor);
ambLight.name = "ambient";
scene.add(ambLight);

// Directional light placed in a certain position to shine on the back of the "box"
var directionalLight = new THREE.DirectionalLight(
  sceneParams.directionalLightColor,
  sceneParams.directionalLightIntensity
);
directionalLight.position.set(
  sceneParams.directionalLightX,
  sceneParams.directionalLightY,
  sceneParams.directionalLightZ
);
scene.add(directionalLight);

// Global texture array to access the list of textures any time
// after loading the page. This done so we don't load textures every time
// the dropdown is modified.
var texturesG = [];

// Global color variables
var white = 0xffffff;
var black = 0x000000;
var red = 0xff0000;

// Variable for animation state
var animationState;

// resets the animationState to its initial setting
function resetAnimationState() {
  animationState = {
    time: 0,
    ballHeight: guiParams.maxBallHeight, // fall from maximum height
    ballPositionX: guiParams.ballInitialX, // reset to initial X position
  };
}
resetAnimationState();

var box;

function drawBox(mode) {
  scene.remove(box);
  // Create a box for the scene
  var boxGeometry = new THREE.BoxGeometry(
    sceneParams.boxWidth,
    sceneParams.boxHeight,
    sceneParams.boxDepth
  );

  // Add texture coordinates to the box
  addTextureCoords(boxGeometry);

  // Create an array of materials for each of the six faces, because some are different materials.
  var cubeMaterials;

  // Depending on the mode, display a different floor texture; otherwise, the boxes are the same.
  switch (mode) {
    case "showNets":
      cubeMaterials = [
        new THREE.MeshPhongMaterial({
          color: sceneParams.wallColor,
          shading: THREE.SmoothShading,
          side: THREE.BackSide,
          map: texturesG[0],
        }),
        new THREE.MeshPhongMaterial({
          color: sceneParams.wallColor,
          shading: THREE.SmoothShading,
          side: THREE.BackSide,
          map: texturesG[0],
        }),
        new THREE.MeshPhongMaterial({
          color: sceneParams.ceilingColor,
          shading: THREE.SmoothShading,
          side: THREE.BackSide,
        }),
        new THREE.MeshPhongMaterial({
          color: sceneParams.floorColor,
          shading: THREE.SmoothShading,
          side: THREE.DoubleSide,
          map: texturesG[3],
        }),
        new THREE.MeshPhongMaterial({
          color: sceneParams.wallColor,
          shading: THREE.SmoothShading,
          side: THREE.BackSide,
          map: texturesG[0],
        }),
        new THREE.MeshPhongMaterial({
          color: sceneParams.wallColor,
          shading: THREE.SmoothShading,
          side: THREE.BackSide,
          map: texturesG[0],
        }),
      ];
      break;
    case "showStandard":
      cubeMaterials = [
        new THREE.MeshPhongMaterial({
          color: sceneParams.wallColor,
          shading: THREE.SmoothShading,
          side: THREE.BackSide,
          map: texturesG[0],
        }),
        new THREE.MeshPhongMaterial({
          color: sceneParams.wallColor,
          shading: THREE.SmoothShading,
          side: THREE.BackSide,
          map: texturesG[0],
        }),
        new THREE.MeshPhongMaterial({
          color: sceneParams.ceilingColor,
          shading: THREE.SmoothShading,
          side: THREE.BackSide,
        }),
        new THREE.MeshPhongMaterial({
          color: sceneParams.floorColor,
          shading: THREE.SmoothShading,
          side: THREE.DoubleSide,
          map: texturesG[2],
        }),
        new THREE.MeshPhongMaterial({
          color: sceneParams.wallColor,
          shading: THREE.SmoothShading,
          side: THREE.BackSide,
          map: texturesG[0],
        }),
        new THREE.MeshPhongMaterial({
          color: sceneParams.wallColor,
          shading: THREE.SmoothShading,
          side: THREE.BackSide,
          map: texturesG[0],
        }),
      ];
      break;
    default:
      throw "unknown: " + mode;
  }

  var boxMaterial = new THREE.MeshFaceMaterial(cubeMaterials);

  box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.name = "box";

  // The box can recieve shadows from the light onto the ball
  box.receiveShadow = true;

  console.log(JSON.stringify(boxGeometry.faceVertexUvs));

  scene.add(box);
}

function addTextureCoords(boxGeom) {
  if (!boxGeom instanceof THREE.Geometry) {
    throw "not a THREE.Geometry: " + boxGeom;
  }
  // array of face descriptors
  var UVs = [];
  function faceCoords(as, at, bs, bt, cs, ct) {
    UVs.push([
      new THREE.Vector2(as, at),
      new THREE.Vector2(bs, bt),
      new THREE.Vector2(cs, ct),
    ]);
  }

  //right
  faceCoords(0, 1, 0, 0, 1, 1);
  faceCoords(0, 0, 1, 0, 1, 1);

  // left
  faceCoords(0, 1, 0, 0, 1, 1);
  faceCoords(0, 0, 1, 0, 1, 1);

  // ceiling
  faceCoords(0, 1, 0, 0, 1, 1);
  faceCoords(0, 0, 1, 0, 1, 1);

  // floor
  faceCoords(0, 1, 0, 0, 1, 1);
  faceCoords(0, 0, 1, 0, 1, 1);

  // front
  faceCoords(0, 1, 0, 0, 1, 1);
  faceCoords(0, 0, 1, 0, 1, 1);

  // back
  faceCoords(0, 1, 0, 0, 1, 1);
  faceCoords(0, 0, 1, 0, 1, 1);

  // Finally, attach this to the geometry
  boxGeom.faceVertexUvs = [UVs];
}

var ball;

function drawBall() {
  // Remove the old ball and draw a new one with a basketball texture
  scene.remove(ball);
  ball = new THREE.Mesh(
    new THREE.SphereGeometry(guiParams.ballRadius, 64, 64),
    new THREE.MeshLambertMaterial({ color: white, map: texturesG[1] })
  );

  // Place ball centered at origin with height specified by the gui params
  ball.position.set(
    animationState.ballPositionX,
    -sceneParams.boxHeight / 2 + animationState.ballHeight,
    0
  );

  // Let the ball cast shadows onto the floor
  ball.castShadow = true;
  scene.add(ball);
}

function drawSconce(side) {
  // Create a "sconce" like in previous assignment using a cylinder and spotlight
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

  // There are two "sides" of the sconce, spaced evenly apart on the ceiling of the box (basically halves of the sconce)
  sconce.position.set(
    (sceneParams.boxWidth / 2) * side +
      (-sceneParams.boxWidth / sceneParams.sconceOffSet) * side,
    sceneParams.boxHeight / 2 - sceneParams.sconceHeight / 2,
    0
  );

  scene.add(sconce);

  drawSpotLight(side);
}

function drawSpotLight(side) {
  // Add a spotlight to each light source sconce
  spotLight = new THREE.SpotLight(
    sceneParams.spotlightColor,
    sceneParams.spotlightIntensity,
    sceneParams.spotlightDistance,
    sceneParams.spotlightAngle /*, sceneParams.spotlightPenumbra, sceneParams.spotlightDecay*/
  );
  spotLight.name = "spot " + side;

  // Spotlight placed at the same location of the sconce itself on each side
  spotLight.position.set(
    (sceneParams.boxWidth / 2) * side +
      (-sceneParams.boxWidth / sceneParams.sconceOffSet) * side,
    sceneParams.boxHeight / 2,
    0
  );

  // The spotlight can cast shadows (used to cast shadows from ball onto the floor)
  spotLight.castShadow = true;

  var spotLightTarget = new THREE.Object3D();

  // Target positioned at the floor directly underneath each light source
  spotLightTarget.position.set(
    (sceneParams.boxWidth / 2) * side +
      (-sceneParams.boxWidth / sceneParams.sconceOffSet) * side,
    0,
    0
  );
  spotLight.target = spotLightTarget;
  scene.add(spotLight);
  scene.add(spotLight.target);
}

/**
 * Add a "backwall" to behind the basketball hoop which is akin to a mat behind an actual basketball hoop in a gym
 */
function drawBackWall() {
  var backWall = new THREE.Mesh(
    new THREE.BoxGeometry(
      sceneParams.boxWidth / 3,
      sceneParams.boxHeight / 5,
      sceneParams.backWallThickness
    ),
    new THREE.MeshBasicMaterial({ color: sceneParams.backWallColor })
  );

  // Position the backwall behind the hoop and perform 90 degree rotation
  backWall.position.set(
    sceneParams.boxWidth / 2 - sceneParams.backWallThickness / 2,
    -sceneParams.boxHeight / 2 + sceneParams.boxHeight / 10,
    0
  );
  backWall.rotation.y = sceneParams.backWallRotationY;

  scene.add(backWall);
}

// Global hoop variable
var hoop;

/**
 * Builds a hoop using nested materials
 * @param {*} params the scene params object
 */
function drawHoop(params) {
  hoop = new THREE.Object3D();

  createPole(params, hoop);

  return hoop;
}

function createPole(params, hoop) {
  // Create a "pole" for the structure of the basketball hoop which is a cylinder
  var pole = new THREE.Object3D();
  var poleGeom = new THREE.CylinderGeometry(
    params.poleRadius,
    params.poleRadius,
    params.poleHeight,
    32,
    32
  );
  var poleMaterial = new THREE.MeshPhongMaterial({ color: black });

  var poleMesh = new THREE.Mesh(poleGeom, poleMaterial);

  // Position the pole on the floor and hugging the wall of the box
  pole.position.x = params.boxWidth / 2 - params.poleRadius;
  pole.position.y = -params.boxHeight / 2 + params.poleHeight / 2;

  pole.add(poleMesh);

  hoop.add(pole);

  addPoleExtension(params, pole);

  return hoop;
}

function addPoleExtension(params, pole) {
  // Add a "pole extension" which is connected to the pole and rotated 90 degrees towards the center of the box
  var poleExtension = new THREE.Object3D();
  var poleExtensionGeom = new THREE.CylinderGeometry(
    params.poleExtensionRadius,
    params.poleExtensionRadius,
    params.poleExtensionHeight,
    32,
    32
  );
  var poleExtensionMaterial = new THREE.MeshPhongMaterial({ color: black });

  var poleExtensionMesh = new THREE.Mesh(
    poleExtensionGeom,
    poleExtensionMaterial
  );

  // Position the extension at the top of pole and rotate in z 90 degrees
  poleExtensionMesh.position.y = params.poleHeight / 2;
  poleExtensionMesh.position.x = -params.poleExtensionHeight / 2;
  poleExtensionMesh.rotation.z = params.poleExtensionRotationZ;

  poleExtension.add(poleExtensionMesh);

  pole.add(poleExtension);

  addBackBoard(params, poleExtension);

  return pole;
}

function addBackBoard(params, poleExtension) {
  // Add a backboard to the extension
  var backBoard = new THREE.Object3D();
  var backBoardGeom = new THREE.BoxGeometry(
    params.backBoardWidth,
    params.backBoardHeight,
    params.backBoardDepth
  );
  var backBoardMaterial = new THREE.MeshPhongMaterial({ color: white });

  var backBoardMesh = new THREE.Mesh(backBoardGeom, backBoardMaterial);

  // Position the backboard on the side of the extension and center it. The box has to be rotated 90 degrees.
  backBoardMesh.position.y = params.poleHeight / 2;
  backBoardMesh.position.x = -params.poleExtensionHeight;
  backBoardMesh.rotation.y = params.backBoardRotationY;

  backBoard.add(backBoardMesh);

  poleExtension.add(backBoard);

  addRim(params, backBoard);

  return poleExtension;
}

function addRim(params, backBoard) {
  // Add a rim to the backboard
  var rim = new THREE.Object3D();
  var rimGeom = new THREE.CylinderGeometry(
    params.rimRadiusTop,
    params.rimRadiusBottom,
    params.rimHeight,
    params.rimSegments,
    params.rimSegments,
    params.rimOpenEnded
  );
  var rimMaterial = new THREE.MeshPhongMaterial({
    color: red,
    side: THREE.DoubleSide,
  });

  var rimMesh = new THREE.Mesh(rimGeom, rimMaterial);

  // The rim is at the center of the backboard
  rimMesh.position.y = params.poleHeight / 2;
  rimMesh.position.x =
    -params.poleExtensionHeight - params.backBoardDepth - params.rimOffSet;

  rim.add(rimMesh);

  backBoard.add(rim);

  return backBoard;
}

// ============ Animation functions ============
// Using an animation similar to Mandel's positional animation of a ball

function linearMap(x, minx, maxx, miny, maxy) {
  // t is in the range [0,1]
  t = (x - minx) / (maxx - minx);
  y = t * (maxy - miny) + miny;
  return y;
}

// sets the position of the ball based on current time

function setBallPosition(time) {
  // rescale the time dimension so that the period of bouncing maps to pi
  var angle = (time * Math.PI) / guiParams.ballBouncePeriod;
  var abs_cos = Math.abs(Math.sin(angle));
  var ballHeight = linearMap(
    abs_cos,
    0,
    1,
    guiParams.ballRadius - sceneParams.boxHeight / 2,
    guiParams.maxBallHeight
  );
  ball.position.y = ballHeight;
  var ballX = guiParams.ballInitialX + guiParams.ballVelocityX * time;
  ball.position.x = ballX;
  return [ballX, ballHeight];
}

// resets the ball to the initial state and renders the scene

function firstState() {
  resetAnimationState();
  var state = setBallPosition(animationState.time);
  animationState.ballPositionX = state[0];
  animationState.ballHeight = state[1];
  TW.render();
}

// updates the state of the animation (time and ballHeight)

function updateState() {
  animationState.time += guiParams.deltaT;
  var state = setBallPosition(animationState.time);
  animationState.ballPositionX = state[0];
  animationState.ballHeight = state[1];
}

function oneStep() {
  updateState();
  TW.render();
}

var animationId = null;

function animate(timestamp) {
  oneStep();

  // If the ball exits the bounds of the box in x or y OR hits the pole, the animation will stop.
  if (
    ball.position.x >
      sceneParams.boxWidth / 2 -
        guiParams.ballRadius -
        sceneParams.poleRadius * 2 ||
    ball.position.x < -sceneParams.boxWidth / 2 + guiParams.ballRadius ||
    ball.position.y > sceneParams.boxHeight / 2 - guiParams.ballRadius ||
    ball.position.y < -sceneParams.boxHeight / 2 + guiParams.ballRadius
  ) {
    stopAnimation();
  } else {
    animationId = requestAnimationFrame(animate);
  }
}

function stopAnimation() {
  if (animationId != null) {
    cancelAnimationFrame(animationId);
    console.log("Cancelled animation using " + animationId);
  }
}

// Renderer for the scene and initialization.
// Set antiaias to true and enable shadow maps.
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
TW.mainInit(renderer, scene);

// Set a camera for the scene
var state = TW.cameraSetup(renderer, scene, {
  minx: -5,
  maxx: 5,
  miny: -15,
  maxy: 15,
  minz: 0,
  maxz: 5,
});

/**
 * The function loads the textures first before the anonymous function is called.
 * Once they are loaded, set the first texture in the array to mirror, repeat, and apply mapping.
 * All the textures have mapping enabled.
 * The scene gets built in this function.
 */
TW.loadTextures(
  [
    "https://thumbs.dreamstime.com/b/wood-parquet-background-wooden-floor-texture-154981448.jpg",
    "https://thumbs.dreamstime.com/b/basketball-textures-bumps-26719344.jpg",
    "https://static.vecteezy.com/system/resources/previews/000/183/860/non_2x/basketball-court-vector.png",
    "https://www.trbimg.com/img-56705102/turbine/ct-ranking-new-nba-court-designs-photos",
  ],
  function (textures) {
    for (let i = 0; i < textures.length; i++) {
      textures[i].mapping = THREE.UVMapping;
    }
    textures[0].wrapS = THREE.MirroredRepeatWrapping;
    textures[0].wrapT = THREE.RepeatWrapping;
    textures[0].repeat.set(2, 2);

    // Assign global variable the textures for future use.
    texturesG = textures;

    // Build the entire scene:
    drawBox(guiParams.mode);
    drawBall();
    drawSconce(-1);
    drawSconce(1);
    drawBackWall();
    hoop = drawHoop(sceneParams);
    scene.add(hoop);

    firstState();
    TW.render();
  }
);

// Add callback functions to keyboard
TW.setKeyboardCallback("0", firstState, "reset animation");
TW.setKeyboardCallback("1", oneStep, "advance by one step");
TW.setKeyboardCallback("g", animate, "go:  start animation");
TW.setKeyboardCallback(" ", stopAnimation, "stop animation");

// Function to redraw the scene based on the gui parameter.
function redoScene() {
  drawBox(guiParams.mode);
  TW.render();
}

// Gui initialization and adding a gui drop down.
var gui = new dat.GUI();

// GUI for changing the change in time (speed of animation)
gui.add(guiParams, "deltaT", 0.01, 0.25).step(0.01).listen();

// GUI for modifying the radius of the ball
gui.add(guiParams, "ballRadius", 0.25, 1).onChange(function () {
  drawBall();
  TW.render();
});

// GUI for changing between different floor textures
gui.add(guiParams, "mode", ["showNets", "showStandard"]).onChange(redoScene);
