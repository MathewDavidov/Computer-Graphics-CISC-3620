// Color values for the clown body parts
var blue = 0x00b0ff; // body, hat, and arm
var greenBlue = 0xb9faf0; // haed
var green = 0x19efb2; // feet and hand
var pink = 0xf030d8; // leg and shoulder
var purple = 0x420857; // eye, nose, and ear
var smileColor = 0xf3b9fa; // smile
var yellow = 0xffff00; // origin

// Mesh material for the clown using pre-defined colors and making them double-sided
var bodyMaterial = new THREE.MeshBasicMaterial({
  color: blue,
  side: THREE.DoubleSide,
});
var headMaterial = new THREE.MeshBasicMaterial({
  color: greenBlue,
  side: THREE.DoubleSide,
});
var facialMaterial = new THREE.MeshBasicMaterial({
  color: purple,
  side: THREE.DoubleSide,
});
var legShoulderMaterial = new THREE.MeshBasicMaterial({
  color: pink,
  side: THREE.DoubleSide,
});
var footHandMaterial = new THREE.MeshBasicMaterial({
  color: green,
  side: THREE.DoubleSide,
});
var smileMaterial = new THREE.MeshBasicMaterial({
  color: smileColor,
  side: THREE.DoubleSide,
});

function createHatCrown(params) {
  var height = params.hatHeight;
  var radiusTop = params.hatRadiusTop;
  var radiusBottom = params.hatRadiusBottom;
  var cd = params.cylinderDetail;
  var topHatGeometry = new THREE.CylinderGeometry(
    radiusTop,
    radiusBottom,
    height,
    cd,
    cd
  );
  var topHat = new THREE.Mesh(topHatGeometry, bodyMaterial);

  return topHat;
}

function createHatBrim(params) {
  var rd = params.ringDetail;
  var innerRadius = params.hatInnerRadius;
  var outerRadius = params.hatOuterRadius;
  var hatGeometry = new THREE.RingGeometry(innerRadius, outerRadius, rd, rd);
  var hat = new THREE.Mesh(hatGeometry, bodyMaterial);

  return hat;
}

function addHat(head, params) {
  var hatframe = new THREE.Object3D();
  var hatBrim = createHatBrim(params);
  var hatCrown = createHatCrown(params);

  var radius = params.headRadius;
  var height = params.hatHeight;
  var hatBrimRotationX = params.hatBrimRotationX;
  var hatframeRotationX = params.hatframeRotationX;
  var hatframeRotationZ = params.hatframeRotationZ;
  var hatCrownRadiusOffset = params.hatCrownRadiusOffset;
  var hatBrimRadiusOffset = params.hatBrimRadiusOffset;

  // Position hat on top of head
  hatBrim.rotation.x = hatBrimRotationX;
  hatCrown.position.y = height / 2 + radius * hatCrownRadiusOffset;
  hatBrim.position.y = radius * hatBrimRadiusOffset;

  hatframe.add(hatBrim);
  hatframe.add(hatCrown);

  // Rotate hat on x and z axes to position correctly
  hatframe.rotation.x = hatframeRotationX;
  hatframe.rotation.z = hatframeRotationZ;

  head.add(hatframe);

  return head;
}

function createEar(params) {
  var sd = params.sphereDetail || 10;
  var radius = params.earRadius || 0.6;
  var earGeometry = new THREE.SphereGeometry(radius, sd, sd);
  var ear = new THREE.Mesh(earGeometry, facialMaterial);

  return ear;
}

function addEar(head, params, side) {
  var earframe = new THREE.Object3D();
  var ear = createEar(params);
  var radius = params.headRadius || 2;
  var angle = params.earAngle || Math.PI / 4;

  // Position ear on correct side using side parameter
  ear.position.x = side * radius;
  earframe.rotation.z = side * angle;
  earframe.add(ear);
  head.add(earframe);

  return head;
}

function createEye(params) {
  var sd = params.sphereDetail || 10;
  var radius = params.eyeRadius || 0.3;
  var eyeGeometry = new THREE.SphereGeometry(radius, sd, sd);
  var eyeMesh = new THREE.Mesh(eyeGeometry, facialMaterial);

  return eyeMesh;
}

function addEye(head, params, side) {
  var eyeframe = new THREE.Object3D();
  var eye = createEye(params);
  var radius = params.headRadius || 2;

  // Position eye in the center of head
  eye.position.z = radius;
  var angleX = params.eyeAngleX || -Math.PI / 6;
  var angleY = params.eyeAngleY || Math.PI / 6;

  // Rotate eye based on side to match actual eyes
  eyeframe.rotation.x = angleX;
  eyeframe.rotation.y = side * angleY;
  eyeframe.add(eye);
  head.add(eyeframe);

  return head;
}

function createNose(params) {
  var sd = params.sphereDetail || 10;
  var radius = params.noseRadius || 0.6;
  var noseGeometry = new THREE.SphereGeometry(radius, sd, sd);
  var noseMesh = new THREE.Mesh(noseGeometry, facialMaterial);

  return noseMesh;
}

function addNose(head, params) {
  var noseframe = new THREE.Object3D();
  var nose = createNose(params);
  var radius = params.headRadius || 2;
  nose.position.z = radius;
  noseframe.add(nose);
  var angle = params.noseRotation || TW.degrees2radians(10);

  // Rotate nose in the x axis to lower its position relative to the eyes
  noseframe.rotation.x = angle;

  head.add(noseframe);

  return head;
}

function addSmile(head, params) {
  var smileframe = new THREE.Object3D();
  var smileRadius = params.smileRadius;
  var smileArc = params.smileArc;
  var smileGeometry = new THREE.TorusGeometry(
    smileRadius,
    0.1,
    30,
    30,
    smileArc
  );
  var smileMesh = new THREE.Mesh(smileGeometry, smileMaterial);

  // Rotate smile to below the nose
  smileMesh.rotation.z = -Math.PI / 1.5;

  var radius = params.headRadius || 2;

  // Position smile on the head radius
  smileMesh.position.z = radius;
  var angleX = params.eyeAngleX || -Math.PI / 6;

  // smileMesh.rotation.x = angleX;

  smileframe.add(smileMesh);
  head.add(smileframe);

  return head;
}

function createHead(params) {
  var head = new THREE.Object3D();
  var sd = params.sphereDetail || 10;
  var radius = params.headRadius || 2;
  var headGeometry = new THREE.SphereGeometry(radius, sd, sd);
  var headMesh = new THREE.Mesh(headGeometry, headMaterial);
  head.add(headMesh);

  if (params.smile) {
    addSmile(head, params);
  }
  if (params.nose) {
    addNose(head, params);
  }
  if (params.eyes) {
    addEye(head, params, 1);
    addEye(head, params, -1);
  }
  if (params.ears) {
    addEar(head, params, 1);
    addEar(head, params, -1);
  }
  if (params.hat) {
    addHat(head, params);
  }

  return head;
}

function addFoot(leg, params, side) {
  var foot = new THREE.Object3D();
  var sd = params.sphereDetail;
  var radius = params.footRadius;
  var footGeometry = new THREE.SphereGeometry(
    radius,
    sd,
    sd,
    0,
    Math.PI * 2,
    0,
    params.footThetaLength
  );
  var footMesh = new THREE.Mesh(footGeometry, footHandMaterial);

  // Places the foot below the leg and additional offset to appear natural
  footMesh.position.y = -params.legHeight * 2;
  footMesh.position.x = params.legSideOffset * side;
  foot.add(footMesh);

  leg.add(foot);

  return leg;
}

function addLeg(body, params, side) {
  var legs = new THREE.Object3D();
  var rs = params.radialSegments;
  var legRadius = params.legRadius;
  var legHeight = params.legHeight;
  var legGeometry = new THREE.CylinderGeometry(
    legRadius,
    legRadius,
    legHeight,
    rs
  );
  var legMesh = new THREE.Mesh(legGeometry, legShoulderMaterial);

  // Places the leg below the body and then places the leg on the correct side
  legMesh.position.y = -params.bodyRadius - params.legBodyOffset;
  legMesh.position.x = params.legSideOffset * side;
  legs.add(legMesh);

  body.add(legs);

  if (params.feet) {
    addFoot(legs, params, side);
  }

  return body;
}

function addHand(arms, params, side) {
  var hand = new THREE.Object3D();
  var sd = params.sphereDetail;
  var radius = params.handRadius;
  var handGeometry = new THREE.SphereGeometry(radius, sd, sd);
  var handMesh = new THREE.Mesh(handGeometry, footHandMaterial);

  // Places the hand to connect to the arm + additional offset to appear natural
  handMesh.position.y =
    -params.armHeight - params.handRadius + params.handOffset;

  hand.add(handMesh);
  arms.add(hand);

  return arms;
}

function addArm(shoulder, params, side) {
  var arms = new THREE.Object3D();
  var rs = params.radialSegments;
  var armRadius = params.armRadius;
  var armHeight = params.armHeight;
  var armGeometry = new THREE.CylinderGeometry(
    armRadius,
    armRadius,
    armHeight,
    rs
  );
  var armMesh = new THREE.Mesh(armGeometry, bodyMaterial);

  // Places the arm to connect to the shoulder
  armMesh.position.y = -params.armHeight / 2;
  arms.add(armMesh);

  shoulder.add(arms);

  if (params.hands) {
    addHand(arms, params, side);
  }

  return shoulder;
}

function addShoulder(body, params, side) {
  var shoulder = new THREE.Object3D();
  var sd = params.sphereDetail;
  var radius = params.shoulderRadius;
  var shoulderGeometry = new THREE.SphereGeometry(radius, sd, sd);
  var shoulderMesh = new THREE.Mesh(shoulderGeometry, legShoulderMaterial);

  // Places the shoulder on the upper portion of the body
  // then moves them to the correct side on the x axis
  shoulder.position.y = params.bodyRadius + params.shoulderOffSet;
  shoulder.position.x = params.shoulderWidth * side;
  shoulder.add(shoulderMesh);

  // Rotates the mesh to allow the arms to be angle-d
  shoulderMesh.rotation.z = side * params.shoulderAngle;

  body.add(shoulder);

  if (params.arms) {
    addArm(shoulderMesh, params, side);
  }

  return body;
}

function createBody(params) {
  var body = new THREE.Object3D();
  var radius = params.bodyRadius || 3;
  var sd = params.sphereDetail || 20;
  var bodyGeom = new THREE.SphereGeometry(radius, sd, sd);
  var bodyMesh = new THREE.Mesh(bodyGeom, bodyMaterial);
  var scale = params.bodyScaleY || 2;

  // Creates a less spherical object to resemble a body
  bodyMesh.scale.y = scale;

  // Sets the position higher on the y axis to fit room for legs
  body.position.y = params.bodyPosition;

  body.add(bodyMesh);
  if (params.shoulders) {
    addShoulder(body, params, 1);
    addShoulder(body, params, -1);
  }
  if (params.legs) {
    addLeg(body, params, 1);
    addLeg(body, params, -1);
  }

  return body;
}

function createClown(params) {
  var clown = new THREE.Object3D();
  var body = createBody(params);
  clown.add(body);

  if (params.head) {
    var head = createHead(params);
    var bs = params.bodyScaleY || 2;
    var br = params.bodyRadius || 3;
    var hr = params.headRadius || 1;
    // Calculate position for the center of the head
    head.position.y =
      bs * br + hr + params.bodyPosition - params.headPositionOffSet; // !!! ADDED BODY POSITION
    clown.add(head);
  }

  return clown;
}

var params = {
  wireframe: false,
  sphereDetail: 20,
  radialSegments: 32,
  ringDetail: 30,
  torusDetail: 20,
  cylinderDetail: 64,
  head: true,
  headRadius: 2,
  bodyRadius: 3,
  bodyScaleY: 1.2,
  bodyPosition: 7.5, // how high above origin?
  headPositionOffSet: 0.5,
  eyes: true,
  eyeRadius: 0.275,
  eyeAngleX: Math.PI / 180,
  eyeAngleY: +Math.PI / 7,
  nose: true,
  noseRadius: 0.2,
  noseRotation: TW.degrees2radians(0),
  smile: true,
  smileRadius: 1,
  smileArc: 1.6,
  ears: true,
  earRadius: 0.6,
  earScale: 0.5,
  earAngle: Math.PI,
  hat: true,
  hatInnerRadius: 0.01,
  hatOuterRadius: 3.25,
  hatRadiusTop: 2,
  hatRadiusBottom: 1.5,
  hatAngle: Math.PI / 4,
  hatHeight: 2.5,
  hatBrimRotationX: -Math.PI / 2,
  hatframeRotationX: -Math.PI / 8,
  hatframeRotationZ: -Math.PI / 12,
  hatCrownRadiusOffset: 0.8,
  hatBrimRadiusOffset: 0.8,
  shoulders: true,
  shoulderRadius: 1,
  shoulderAngle: Math.PI / 8,
  shoulderOffSet: -0.5,
  shoulderWidth: 2.1,
  arms: true,
  armRadius: 0.5,
  armHeight: 5,
  armAngle: Math.PI / 6,
  hands: true,
  handRadius: 0.75,
  handOffset: 0.1,
  legs: true,
  legRadius: 0.5,
  legHeight: 3.75,
  legSideOffset: 1,
  legBodyOffset: 2,
  feet: true,
  footRadius: 0.9,
  footThetaLength: Math.PI / 2,
};

var renderer = new THREE.WebGLRenderer();

var scene = new THREE.Scene();

// Sphere for yellow origin
var originGeometry = new THREE.SphereGeometry(0.25, 32, 32);
var originMaterial = new THREE.MeshBasicMaterial({ color: yellow });
var originPoint = new THREE.Mesh(originGeometry, originMaterial);
scene.add(originPoint);

// Creates the entire clown using nested objects and then adds it to the scene
var clown = createClown(params);
scene.add(clown);

TW.cameraSetup(renderer, scene, {
  minx: -5,
  maxx: 5,
  miny: -5,
  maxy: 15,
  minz: -5,
  maxz: 5,
});
TW.toggleAxes("show");
// TW.viewFromAboveFrontSide();
