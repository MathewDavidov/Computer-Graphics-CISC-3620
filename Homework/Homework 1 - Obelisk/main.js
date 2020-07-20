/**
 * Function for creating the obelisk geometry object
 * @param {*} baseWidth The width of the obelisk base
 * @param {*} topWidth  The width of the obelisk upper rectangle
 * @param {*} mainHeight The height from the obelisk base to upper rectangle
 * @param {*} pointHeight The height from the upper rectangle to the vertex of the point
 * returns the geometry object
 */
function createObelisk(baseWidth, topWidth, mainHeight, pointHeight) {
  var geom = new THREE.Geometry();
  var center = baseWidth * 0.5;
  var topCenter = topWidth * 0.5;

  // Base vertices
  geom.vertices.push(new THREE.Vector3(+center, 0, center));
  geom.vertices.push(new THREE.Vector3(+center, 0, -center));
  geom.vertices.push(new THREE.Vector3(-center, 0, -center));
  geom.vertices.push(new THREE.Vector3(-center, 0, +center));

  // Top vertices
  geom.vertices.push(new THREE.Vector3(+topCenter, mainHeight, topCenter));
  geom.vertices.push(new THREE.Vector3(+topCenter, mainHeight, -topCenter));
  geom.vertices.push(new THREE.Vector3(-topCenter, mainHeight, -topCenter));
  geom.vertices.push(new THREE.Vector3(-topCenter, mainHeight, +topCenter));

  // Top of entire obelisk (point) vertex
  geom.vertices.push(new THREE.Vector3(0, mainHeight + pointHeight, 0));

  // All the faces of the main body (front, right, back, left)
  geom.faces.push(new THREE.Face3(5, 2, 1));
  geom.faces.push(new THREE.Face3(5, 6, 2));

  geom.faces.push(new THREE.Face3(6, 3, 2));
  geom.faces.push(new THREE.Face3(6, 7, 3));

  geom.faces.push(new THREE.Face3(7, 0, 3));
  geom.faces.push(new THREE.Face3(7, 4, 0));

  geom.faces.push(new THREE.Face3(4, 1, 0));
  geom.faces.push(new THREE.Face3(4, 5, 1));

  // Faces that connect to the top vertex
  geom.faces.push(new THREE.Face3(8, 6, 5));
  geom.faces.push(new THREE.Face3(8, 7, 6));
  geom.faces.push(new THREE.Face3(8, 4, 7));
  geom.faces.push(new THREE.Face3(8, 5, 4));

  geom.computeFaceNormals();
  geom.computeVertexNormals(true);

  return geom;
}

var scene = new THREE.Scene();

// Global variables for original obelisk that is generated on page opening/reload
var bWidth = 55;
var tWidth = 34;
var mHeight = 500;
var tHeight = 55;

// Object that contains the obelisk paramters
var sceneParams = {
  bWidth: bWidth,
  tWidth: tWidth,
  mHeight: mHeight,
  tHeight: tHeight,
};

var half = tWidth * 0.5;

// Construction of original obelisk using paramters specified above
// Create a geometry, mesh, and then add it to the scene
var obeliskGeom = createObelisk(55, 34, 500, 55);
var obeliskMesh = TW.createMesh(obeliskGeom);
obeliskMesh.position.set(bWidth * 0.5, 0, -(bWidth * 0.5));
scene.add(obeliskMesh);

// Create a rendering and then provide paramters for the camera for a full range of view
// The camera range is based on the largest possible inputs for the GUI
var renderer = new THREE.WebGLRenderer();
TW.mainInit(renderer, scene);
TW.cameraSetup(renderer, scene, {
  minx: 0,
  maxx: bWidth + 20,
  miny: 0,
  maxy: mHeight + 200 + tHeight + 15,
  minz: -bWidth - 15,
  maxz: 0,
});

/**
 * Function for placing an obelisk
 */
function placeObelisk(baseWidth, topWidth, mainHeight, pointHeight) {
  half = tWidth * 0.5;
  var obeliskGeom = createObelisk(baseWidth, topWidth, mainHeight, pointHeight);
  obeliskMesh = TW.createMesh(obeliskGeom);
  // obeliskMesh.position.set(bWidth * 0.5,
  //     0,
  //     -half);
  scene.add(obeliskMesh);
}

// Four functions for each GUI slide change
function redrawObeliskBaseWidth() {
  scene.remove(obeliskMesh);
  bWidth++;
  placeObelisk(
    sceneParams.bWidth,
    sceneParams.tWidth,
    sceneParams.mHeight,
    sceneParams.tHeight
  );
  TW.render();
}

function redrawObeliskTopWidth() {
  scene.remove(obeliskMesh);
  tWidth++;
  placeObelisk(
    sceneParams.bWidth,
    sceneParams.tWidth,
    sceneParams.mHeight,
    sceneParams.tHeight
  );
  TW.render();
}

function redrawObeliskMainHeight() {
  scene.remove(obeliskMesh);
  mHeight++;
  placeObelisk(
    sceneParams.bWidth,
    sceneParams.tWidth,
    sceneParams.mHeight,
    sceneParams.tHeight
  );
  TW.render();
}

function redrawObeliskTopHeight() {
  scene.remove(obeliskMesh);
  tHeight++;
  placeObelisk(
    sceneParams.bWidth,
    sceneParams.tWidth,
    sceneParams.mHeight,
    sceneParams.tHeight
  );
  TW.render();
}

// Variable that initializes a GUI
var gui = new dat.GUI();

// 4 GUI slide controls for the four paramters that create an obelisk
gui.add(sceneParams, "bWidth", 30, 70).onChange(redrawObeliskBaseWidth);
gui.add(sceneParams, "tWidth", 10, 50).onChange(redrawObeliskTopWidth);
gui.add(sceneParams, "mHeight", 10, 700).onChange(redrawObeliskMainHeight);
gui.add(sceneParams, "tHeight", 10, 70).onChange(redrawObeliskTopHeight);
