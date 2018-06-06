window.onload = function(){
var lastTime;
  var width = window.innerWidth;
  var height = window.innerHeight;
  var canvas = document.getElementById("canvas");

  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);

  var renderer = new THREE.WebGLRenderer({canvas: canvas,antialias: false, alpha: false });
  renderer.setClearColor(0x000000);

  var scene = new THREE.Scene();
  // scene.fog = new THREE.FogExp2(0x000000, 0.00035);

  var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 20000);
  camera.position.set(-500, 1500, -500); 


  var controls = new THREE.FirstPersonControls( camera );
  controls.movementSpeed = 4000;
  controls.lookSpeed = 0.15;

  var clock = new THREE.Clock();

  stats = new Stats();
  document.body.appendChild( stats.dom );


    


  var l_fogColor = 0x220052; //bottom fog, sky and light color
  var m_fogColor = 0x996060; //middle fog and sky color
  var h_fogColor = 0x331E28; //top fog and sky color

  var seed = Math.random();
  l_fogColor = "hsl("+Math.random(seed)*360+", 100%,32%)";
  m_fogColor = "hsl("+Math.random()*360+", 37%, 60%)";
  h_fogColor = "hsl("+Math.random()*360+", 41%, 20%)";
  mlt_Color  = "hsl("+Math.random(seed)*360+", 50%,20%)";


  var vertexShader = document.getElementById( 'vertexShader' ).textContent;
  var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
  var uniforms = {
    topColor:    { type: "c", value: new THREE.Color(h_fogColor) }, 
    middleColor: { type: "c", value: new THREE.Color(m_fogColor) },
    bottomColor: { type: "c", value: new THREE.Color(l_fogColor) },
    offset:    { type: "f", value: 0 },
    exponent:  { type: "f", value: 0.8 }
  };

  var skyGeo = new THREE.SphereGeometry( 7500, 320, 15 );
  var skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide } );

  var sky = new THREE.Mesh( skyGeo, skyMat );
  scene.add( sky );

  for (var i=0;i<600; i++){
    var color = new THREE.Color("hsl("+Math.random(i)*360+", 100%, 70%)");
    var starMat = new THREE.MeshBasicMaterial({
      color: color, fog: false
    });
    // var size = 0.5 + Math.random(i)*1;
    var size = 10;
    var starGeo = new THREE.PlaneGeometry( size, size, 1 , 1);
    var star = new THREE.Mesh(starGeo,starMat);
    var beta = Math.random(i-39482)*Math.PI*0.96-Math.PI/2*0.96
    var teta = Math.random(i+38403)*Math.PI
    var rad = 7400;

    star.position.x = Math.sin(beta)*Math.cos(teta)*rad;
    star.position.z = Math.sin(beta)*Math.sin(teta)*rad;
    star.position.y = Math.cos(beta)*rad;

    star.lookAt(new THREE.Vector3( 0, 1, 0 ));
    sky.add( star );
  }


  var plane = new THREE.Mesh(
    new THREE.PlaneGeometry(62000, 62000),
    new THREE.MeshBasicMaterial({ color: "black" })
  );

  plane.rotation.x = -90 * Math.PI / 180;
  scene.add(plane);


  scene.add( new THREE.AxesHelper( 10000,10000,10000 ) );

  var loader = new THREE.TextureLoader();

  var groupBuild = new THREE.Object3D();
  var geometry = new THREE.BoxBufferGeometry(1, 1, 1);

  geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 1, 0.5, 1 ) );
  
  var buildOneTexture = loader.load("img/house1.jpg", function(texture){
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
    texture.repeat.set(1,1);     
  });

   var buildTwoTexture = loader.load("img/house1.jpg", function(texture){
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
    texture.repeat.set(1,1);     
  });



  var color  = "hsl("+Math.random(seed)*360+", 50%,20%)";
  var textureMesh       = new THREE.Texture( generateTexture( color) );
  textureMesh.needsUpdate    = true;

  var material, build;

	var light = new THREE.PointLight( 0xffffff, 0, 0 );
	var textureFlare0 = loader.load( "texture/lensflare.png" );

	function addLight(x,y,z){
    var lensflare = new THREE.Lensflare();
    lensflare.addElement( new THREE.LensflareElement( textureFlare0, 100,  0 ) );
    // lensflare.addElement( new THREE.LensflareElement( textureFlare0, 170, 0 ) );
    // lensflare.addElement( new THREE.LensflareElement( textureFlare0, 220, 0 ) );
    // lensflare.addElement( new THREE.LensflareElement( textureFlare0, 80,  0 ) );
    // lensflare.addElement( new THREE.LensflareElement( textureFlare0, 70,  0 ) );

    // lensflare.addElement( new THREE.LensflareElement( textureFlare0, 70,  0 ) );
    // lensflare.addElement( new THREE.LensflareElement( textureFlare0, 220, 0 ) );
    // lensflare.addElement( new THREE.LensflareElement( textureFlare0, 100, 0 ) );
    // lensflare.addElement( new THREE.LensflareElement( textureFlare0, 90,  0 ) );
    // lensflare.addElement( new THREE.LensflareElement( textureFlare0, 80,  0 ) );

    lensflare.position.set(x, y, z);
    // lensflare.customUpdateCallback = lensFlareUpdateCallback;

    light.add( lensflare );
}





  var size = 9000;
  var count = 0;

  for(var i=0;i<size;i+=1000){
    for(var j=0;j<size;j+=1000){

      var obj = new THREE.MeshBasicMaterial({map: textureMesh});
      var height = [500,300];

      if(  (i>=2000 && i<=6000) && (j>=2000 && j<=6000) ){
        // obj = new THREE.MeshBasicMaterial({map: textureMesh, color: "green"});        
        height = [1000, 400]; 
        if(  (i>=3000 && i<=5000) && (j>=3000 && j<=5000) ){
          // obj = new THREE.MeshBasicMaterial({map: textureMesh, color: "blue"});        
          height = [1600, 900];
          if( i == 4000  && j ==4000){
            // obj = new THREE.MeshBasicMaterial({map: textureMesh, color: "red"}); 
            height = [2500, 1500];       
          }
        }
      }


      groupBuild.add( smallBuild(300, height, 300, i*1.2, j*1.2, obj));
      count++;
      if(i==0) continue;
	    addLight(i*1.2+50, 250, j*1.2+50);
	    // addLight(i*1.2+75, 100, j*1.2+50);
    }
  }

  groupBuild.position.x = -5500;
  groupBuild.position.z = -5500;

  light.position.x = -5500;
  light.position.z = -5500;

  scene.add(groupBuild);
  scene.add(light);


function myMaterial(cubeSide){
  var material = [cubeSide,cubeSide,
    new THREE.MeshBasicMaterial({color: "black" }),
    new THREE.MeshBasicMaterial({color: "black" }),
    cubeSide,cubeSide,
  ];
  return material;
}
function smallBuild(width, height, depth, posX, posZ, tex){
  var smallBuildGroup = new THREE.Object3D();

  
  var size = 3;
    
  for(var i=0;i<size;i++){
    for(var j=0;j<size;j++){

      color  = "hsl("+Math.random(j+i)*360+", 50%,20%)";

      textureMesh       = new THREE.Texture( generateTexture( color) );
      textureMesh.needsUpdate    = true;

      var side  =  tex || new THREE.MeshBasicMaterial({map: textureMesh});
      
      var material = myMaterial(side);
      build = new THREE.Mesh(geometry, material);

      var scaleY =  Math.random() * Math.random() * Math.random()  * height[0] + height[1];
      
      build.scale.x = width;
      build.scale.y = scaleY;
      build.scale.z = depth;

      build.position.x = i * (width + 50) + posX;
      build.position.z = j * (depth + 50) + posZ;

      smallBuildGroup.add(build);
      
      
    }
  }
      
 
    return smallBuildGroup;
}


  lastTime = performance.now();
 function generateTexture(color) {
  	var seed = Math.random();

    var width = 512;
    var height = 1024;


    var canvas  = document.createElement( 'canvas' );
    var canvas2 = document.createElement( 'canvas' );

    var sWidth = 32;
    var sHeight = 64;

    canvas.width = sWidth;
    canvas.height = sHeight;
    canvas2.width    = width;
    canvas2.height   = height;

    var ctx = canvas.getContext( '2d' );
    var context = canvas2.getContext( '2d' );

    context.fillStyle = "#000";
    context.fillRect( 0, 0, width , height);

    for (var x = 0; x < 32; x += 8) {
      for (var y = 2; y < 64; y += 12) {
        var value = Math.floor(Math.random() * 255);
        ctx.fillStyle = "rgb(" + [value, value, value].join(",") + ")";
        ctx.fillRect(x+2, y+1, 4, 8);
      }
    }

    context.imageSmoothingEnabled = false;
    context.drawImage(canvas, 0, 0, width, height);

    context.lineWidth = 80;
    context.strokeStyle = color;
    context.strokeRect( 0, 0, width , height);




    return canvas2;    
 }



	function loop(){
    stats.update();

    var time = performance.now() / 1000;
    controls.update(time - lastTime );

    if(camera.position.y >= 7000 ) {camera.position.y = 7000};
    if(camera.position.x >= 7000 ) {camera.position.x = 7000};
    if(camera.position.z >= 7000 ) {camera.position.z = 7000};

    if(camera.position.y <= 300 ) {camera.position.y = 300};

    if(camera.position.x <= -3500 ) {camera.position.x = -3500};
    if(camera.position.z <= -3500 ) {camera.position.z = -3500};

    renderer.render(scene, camera);

    sky.position.x = camera.position.x;
    sky.position.z = camera.position.z;

    lastTime = time;
		requestAnimationFrame(function(){loop();});
	}

	loop();
}

