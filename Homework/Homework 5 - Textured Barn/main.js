// Object for scene parameters
var sceneParams = {
  ambLightColor: 0x838383,
  directionalLightColor: 0xffffff,
  directionalLightIntensity: 1,
  directionalLightX: 0.1,
  directionalLightY: 0.2,
  directionalLightZ: 0.5,

  barnWidth: 10,
  barnHeight: 5,
  barnDepth: 30,
  barnMaterialColor: 0xc0c2c4, //0xb0b5b1
};

// We need a scene.
var scene = new THREE.Scene();

// Ambient light for the scene using a shade of gray.
ambLight = new THREE.AmbientLight(sceneParams.ambLightColor);
ambLight.name = "ambient";
scene.add(ambLight);

// Directional light placed in a certain position to mimick the solution.
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

// Global variable for the barn to add and remove from the scence.
var barn;

// Global texture array to access the list of textures any time
// after loading the page. This done so we don't load textures every time
// the dropdown is modified.
var texturesG = [];

// Variable for barn material color in light mode
var white = 0xffffff;

/**
 * drawBarn() takes the loaded textures, mode (result or lighting), and dimensions.
 * The function works using a switch case based on the type parameter.
 */
function drawBarn(textures, type, barnWidth, barnHeight, barnDepth) {
  switch (type) {
    case "showResult":
      // Create barn geometry using given dimensions through the TW function createBarnMultipleMaterials().
      var barnGeometry = TW.createBarnMultipleMaterials(
        barnWidth,
        barnHeight,
        barnDepth
      );

      // Call addTextureCoords() to place correct texture coordinates.
      addTextureCoords(barnGeometry);

      // Depending on the face, using the stone brick texture or the wood texture. (stone brick for roof only, rest is wooden material).
      // Lambert material is used throughout.
      var barnMaterials = new THREE.MeshFaceMaterial([
        new THREE.MeshLambertMaterial({
          color: sceneParams.barnMaterialColor,
          map: textures[0],
        }),
        new THREE.MeshLambertMaterial({
          color: sceneParams.barnMaterialColor,
          map: textures[0],
        }),
        new THREE.MeshLambertMaterial({
          color: sceneParams.barnMaterialColor,
          map: textures[1],
        }),
        new THREE.MeshLambertMaterial({
          color: sceneParams.barnMaterialColor,
          map: textures[0],
        }),
      ]);

      barn = new THREE.Mesh(barnGeometry, barnMaterials);
      scene.add(barn);

      break;

    case "showLighting":
      var barnGeometry = TW.createBarnMultipleMaterials(
        barnWidth,
        barnHeight,
        barnDepth
      );

      addTextureCoords(barnGeometry);

      // In lighting mode, the barn color is all white to display lighting.
      // Lambert material is used throughout.
      var barnMaterials = new THREE.MeshFaceMaterial([
        new THREE.MeshLambertMaterial({ color: white }),
        new THREE.MeshLambertMaterial({ color: white }),
        new THREE.MeshLambertMaterial({ color: white }),
        new THREE.MeshLambertMaterial({ color: white }),
      ]);

      barn = new THREE.Mesh(barnGeometry, barnMaterials);
      scene.add(barn);
      break;

    default:
      throw "unknown: " + type;
  }
}

function addTextureCoords(barnGeom) {
  if (!barnGeom instanceof THREE.Geometry) {
    throw "not a THREE.Geometry: " + barnGeom;
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

  /**
   * The follwing texture coordinates have been modified depending on the triangles created by the faces.
   * Mostly modify the s coordinate to allow for horizontal texture repetition.
   * This was done on paper first to map out which coordinates must be changed.
   * The values were chosen through testing and determined to be fitted.
   */

  // Front - modify c's s and t coordinate to 0.5 to display a smooth texture.
  faceCoords(0, 0, 1, 0, 1, 1);
  faceCoords(0, 0, 1, 1, 0, 1);
  faceCoords(0, 1, 1, 1, 0.5, 0.5); // special for the upper triangle

  // Back - Vertices are not quite analogous to the front, alas - modify c's s and t coordinate to both 0.5 to display a smooth texture.
  faceCoords(1, 0, 0, 1, 0, 0);
  faceCoords(1, 0, 1, 1, 0, 1);
  faceCoords(0, 1, 1, 1, 0.5, 0.5); // special for upper triangle

  // Roof - Modify the follwing coordinates:
  // a's s and b's s coordinate to 2 (repeat texture twice along horizontal)
  faceCoords(2, 0, 2, 1, 0, 0);
  // a's s coordinate to 2 (this call and the above call to faceCoords does one side of the roof).
  // The three coordinates modified represent 3 vertices on one side of the face to allow for repetition.
  faceCoords(2, 1, 0, 1, 0, 0);
  // Similar logic is used for the opposite side of the roof in a different oriention depending on the coordinate layout.
  faceCoords(0, 0, 2, 0, 2, 1);
  faceCoords(0, 1, 0, 0, 2, 1);

  // Sides - Repeat s coordinate 4 times for smooth repetition and mirroring of texture.
  // Similar to the previous coordinate alteration.
  faceCoords(4, 0, 0, 1, 0, 0);
  faceCoords(4, 1, 0, 1, 4, 0);
  faceCoords(4, 0, 4, 1, 0, 0);
  faceCoords(4, 1, 0, 1, 0, 0);

  // Floor - Repeat s coordinate 4 times similar to sides.
  faceCoords(0, 0, 4, 0, 0, 1);
  faceCoords(4, 0, 4, 1, 0, 1);

  // Finally, attach this to the geometry.
  barnGeom.faceVertexUvs = [UVs];
}

// Param object for the gui - between showResult and showLighting.
// Set to showResult so that the result is shown on page load.
var guiParams = {
  mode: "showResult",
};

// Renderer for the scene and initialization.
var renderer = new THREE.WebGLRenderer();
TW.mainInit(renderer, scene);

// Set a camera for the scene
var state = TW.cameraSetup(renderer, scene, {
  minx: 0,
  maxx: 15,
  miny: 0,
  maxy: 5,
  minz: -35,
  maxz: 5,
});

/**
 * The function loads the textures first before the anonymous function is called.
 * Once they are loaded, set each texture in the array to mirror, repeat, and apply mapping.
 */
TW.loadTextures(
  [
    "https://thumbs.dreamstime.com/b/wood-parquet-background-wooden-floor-texture-154981448.jpg",
    "https://i2.wp.com/www.thearcadecorner.com/wp-content/uploads/2019/12/minecraft-stone-brick-texture.jpg",
  ],
  function (textures) {
    for (let i = 0; i < textures.length; i++) {
      textures[i].wrapS = THREE.MirroredRepeatWrapping;
      textures[i].wrapT = THREE.RepeatWrapping;
      textures[i].repeat.set(1, 1);
      textures[i].mapping = THREE.UVMapping;
    }
    // Assign global variable the textures for future use.
    texturesG = textures;

    // Draw the barn (used on page load).
    drawBarn(
      textures,
      guiParams.mode,
      sceneParams.barnWidth,
      sceneParams.barnHeight,
      sceneParams.barnDepth
    );
    TW.render();
  }
);

// Function to redraw the scene based on the gui parameter.
function redoScene() {
  scene.remove(barn);
  drawBarn(
    texturesG,
    guiParams.mode,
    sceneParams.barnWidth,
    sceneParams.barnHeight,
    sceneParams.barnDepth
  );
  TW.render();
}

// Gui initialization and adding a gui drop down.
var gui = new dat.GUI();
// Switch between two gui paramters, showLighting and showResult.
gui.add(guiParams, "mode", ["showLighting", "showResult"]).onChange(redoScene);
