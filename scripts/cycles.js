'use strict'
var camera
  , scene
  , renderer
  , objects
  , mesh
  , loader = new THREE.JSONLoader ()
  , lasttimer = Date.now () * 0.0005
  , axes = [0,0,0,0]
  , heading = 0
  ;

(function () {

var ACode = 65
  , DCode = 68
  , WCode = 87
  , SCode = 83
  , LeftArrow = 37
  , RightArrow = 39
  , UpArrow = 38
  , DownArrow = 40
  , ks = [0,0,0,0,0,0,0,0]
  , akey  = 0
  , dkey  = 1
  , wkey  = 2
  , skey  = 3
  , leftkey  = 4
  , rightkey  = 5
  , upkey  = 6
  , downkey  = 7
  ;

function updateAxes () {
   axes[0] = ks[akey] + ks[dkey];
   axes[1] = ks[wkey] + ks[skey];
   axes[2] = ks[leftkey] + ks[rightkey];
   axes[3] = ks[upkey] + ks[downkey];
}

window.addEventListener ("keydown", function (e) {
   switch (e.keyCode) {
      case ACode: ks[akey] = -1; break;
      case DCode: ks[dkey] = 1; break;
      case WCode: ks[wkey] = -1; break;
      case SCode: ks[skey] = 1; break;
      case LeftArrow: ks[leftkey] = -1; break;
      case RightArrow: ks[rightkey] = 1; break;
      case UpArrow: ks[upkey] = 1; break;
      case DownArrow: ks[downkey] = -1; break;
   }
   updateAxes ();
}, false);

window.addEventListener ("keyup", function (e) {
    switch (e.keyCode) {
      case ACode: ks[akey] = 0; break;
      case DCode: ks[dkey] = 0; break;
      case WCode: ks[wkey] = 0; break;
      case SCode: ks[skey] = 0; break;
      case LeftArrow: ks[leftkey] = 0; break;
      case RightArrow: ks[rightkey] = 0; break;
      case UpArrow: ks[upkey] = 0; break;
      case DownArrow: ks[downkey] = 0; break;
   }
   updateAxes ();
}, false);

}) ();

loader.load ('./models/lightcycle-purple.json', function (node) {

   mesh = new THREE.Mesh (node, new THREE.MeshFaceMaterial ())

   init ();
   render ();

});

function init () {

   var container = document.createElement ('div');
   document.body.appendChild (container);

   scene = new THREE.Scene ();

   camera = new THREE.PerspectiveCamera (45, window.innerWidth / window.innerHeight, 1, 2000);
   camera.position.set (2, 2, 3);
   scene.add (camera);

   // Grid

   var line_material = new THREE.LineBasicMaterial ({ color: 0xcccccc, opacity: 0.2 }),
      geometry = new THREE.Geometry (),
      floor = -0.04, step = 1, size = 14;

   for (var i = 0; i <= size / step * 2; i ++) {

      geometry.vertices.push (new THREE.Vector3 (- size, floor, i * step - size));
      geometry.vertices.push (new THREE.Vector3 (size, floor, i * step - size));

      geometry.vertices.push (new THREE.Vector3 (i * step - size, floor, -size));
      geometry.vertices.push (new THREE.Vector3 (i * step - size, floor,  size));
   }

   var line = new THREE.Line (geometry, line_material, THREE.LinePieces);
   scene.add (line);

   scene.add (mesh);

   // Lights

   scene.add (new THREE.AmbientLight (0x1f1f1f));

   var directionalLight = new THREE.DirectionalLight (0xffffff);
   directionalLight.position.x = 100;
   directionalLight.position.y = 100;
   directionalLight.position.z = 0.0;
   scene.add (directionalLight);


   directionalLight = new THREE.DirectionalLight (0xffffff);
   directionalLight.position.x = -100.0;
   directionalLight.position.y = 100;
   directionalLight.position.z = 0.0;
   scene.add (directionalLight);


   renderer = new THREE.WebGLRenderer ();
   renderer.setSize (window.innerWidth, window.innerHeight);

   container.appendChild (renderer.domElement);

/*
   stats = new Stats ();
   stats.domElement.style.position = 'absolute';
   stats.domElement.style.top = '0px';
   container.appendChild (stats.domElement);
*/

}

function render () {

   requestAnimationFrame (render);

   var timer = Date.now () * 0.0005
     , delta = timer - lasttimer
     , TwoPi = 3.14159265 * 2
     ;

   // Move the camera
   heading -= 3.14159265 * delta * axes[2];
   if (heading > TwoPi) { heading -= TwoPi; }
   else if (heading < -TwoPi) { heading += TwoPi; }
   camera.rotation.y = heading;
   camera.position.x += delta * ((Math.cos (TwoPi - heading) * axes[0]) + (-Math.sin (heading) * axes[3])) * 10;
   camera.position.y -= delta * axes[1] * 10;
   camera.position.z += delta * ((Math.sin (TwoPi - heading) * axes[0]) + (-Math.cos (heading) * axes[3])) * 10;

   renderer.render (scene, camera);

   lasttimer = timer;
}
