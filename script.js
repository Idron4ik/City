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
  scene.fog = new THREE.FogExp2(0x000000, 0.00035);

  var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 20000);
  camera.position.set(0, 500, 0); 


  var controls = new THREE.FirstPersonControls( camera );
  controls.movementSpeed = 600;
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

  var skyGeo = new THREE.SphereGeometry( 3500, 320, 15 );
  var skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide } );

  var sky = new THREE.Mesh( skyGeo, skyMat );
  scene.add( sky );

  for (var i=0;i<600; i++){
    var color = new THREE.Color("hsl("+Math.random(i)*360+", 100%, 70%)");
    var starMat = new THREE.MeshBasicMaterial({
      color: color, fog: false
    });
    var size = 0.5 + Math.random(i)*1;
    var starGeo = new THREE.PlaneGeometry( size, size, 1 , 1);
    var star = new THREE.Mesh(starGeo,starMat);
    var beta = Math.random(i-39482)*Math.PI*0.96-Math.PI/2*0.96
    var teta = Math.random(i+38403)*Math.PI
    var rad = 740;

    star.position.x = Math.sin(beta)*Math.cos(teta)*rad;
    star.position.z = Math.sin(beta)*Math.sin(teta)*rad;
    star.position.y = Math.cos(beta)*rad+800;

    star.lookAt(new THREE.Vector3( 0, 1, 0 ));
    sky.add( star );
  }
  var plane = new THREE.Mesh(
    new THREE.PlaneGeometry(62000, 62000),
    new THREE.MeshBasicMaterial({ color: "#333" })
  );

  plane.rotation.x = -90 * Math.PI / 180;
  scene.add(plane);


scene.add( new THREE.AxesHelper( 1000,1000,1000 ) );

  var loader = new THREE.TextureLoader();

  var geometry = new THREE.BoxBufferGeometry(1, 1, 1);


  var groupBuild = new THREE.Object3D();
  
  geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 1, 0.5, 1 ) );
  
  var buildOneTexture = loader.load("img/house1.jpg", function(texture){
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
    texture.repeat.set(1,1);     
  });


   var buildTwoTexture = loader.load("img/house1.jpg", function(texture){
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
    texture.repeat.set(1,1);     
  });

  var textureMesh       = new THREE.Texture( generateTexture() );
  textureMesh.needsUpdate    = true;

  var material, build;



var textureLoader = new THREE.TextureLoader();


var light = new THREE.PointLight( 0xffffff, 1.5, 2000 );
var textureFlare0 = textureLoader.load( "texture/lensflare.png" );






  function myMaterial(cubeSide){
    var material = [cubeSide,cubeSide,
      new THREE.MeshBasicMaterial({color: "black" }),
      new THREE.MeshBasicMaterial({color: "black" }),
      cubeSide,cubeSide,
    ];
    return material;
  }

  var size = 7000;
  var count = 0;
  for(var i=0;i<size;i+=1000){
    for(var j=0;j<size;j+=1000){
      var obj = new THREE.MeshBasicMaterial({map: textureMesh});
      var height = [500,200];

      if(  (i>=1000 && i<=5000) && (j>=1000 && j<=5000) ){
        obj = new THREE.MeshBasicMaterial({map: textureMesh, color: "green"});        
        height = [800, 400]; 
      }

      if(  (i>=2000 && i<=4000) && (j>=2000 && j<=4000) ){
        obj = new THREE.MeshBasicMaterial({map: textureMesh, color: "blue"});        
        height = [1100, 700]; 
      }
      if( i == 3000 && j == 3000){
        obj = new THREE.MeshBasicMaterial({map: textureMesh, color: "red"}); 
        height = [1800, 1000];       
      }

      groupBuild.add( smallBuild(130, height, 130, i*0.85, j*0.85, obj));
      count++; 
      addLight(i*0.85, 0, j*0.85);
    }
  }

  groupBuild.position.x = -3000;
  groupBuild.position.z = -3000;
  light.position.x = -3000;
  light.position.z = -3000;

  scene.add(groupBuild);
  scene.add(light);




function smallBuild(width, height, depth, posX, posZ, tex){
  var smallBuildGroup = new THREE.Object3D();

  // console.log(texSide);

  var side  =  tex || new THREE.MeshBasicMaterial({map: textureMesh });
  
  var size = 4;
  
  for(var i=0;i<size;i++){
    for(var j=0;j<size;j++){
      // var side  = new THREE.ShaderMaterial({fragmentShader:shaderCode});
      
      var material = myMaterial(side);
      build = new THREE.Mesh(geometry, material);

      var scaleY =  Math.random() * Math.random() * Math.random() * Math.random() * height[0] + height[1];
      
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

function addLight(x,y,z){
    var lensflare = new THREE.Lensflare();
    lensflare.addElement( new THREE.LensflareElement( textureFlare0, 60,  0 ) );
    // lensflare.addElement( new THREE.LensflareElement( textureFlare0, 170, 0 ) );
    // lensflare.addElement( new THREE.LensflareElement( textureFlare0, 220, 0 ) );
    lensflare.addElement( new THREE.LensflareElement( textureFlare0, 80,  0 ) );
    lensflare.addElement( new THREE.LensflareElement( textureFlare0, 70,  0 ) );

    // lensflare.addElement( new THREE.LensflareElement( textureFlare0, 70,  0 ) );
    // lensflare.addElement( new THREE.LensflareElement( textureFlare0, 220, 0 ) );
    // lensflare.addElement( new THREE.LensflareElement( textureFlare0, 100, 0 ) );
    // lensflare.addElement( new THREE.LensflareElement( textureFlare0, 90,  0 ) );
    // lensflare.addElement( new THREE.LensflareElement( textureFlare0, 80,  0 ) );

    lensflare.position.set(x, y, z);
    // lensflare.customUpdateCallback = lensFlareUpdateCallback;

    light.add( lensflare );
}






  // buildOfCirckle(400, 8, 100, 150, 125, -500, -500, -25);
  // buildOfCirckle(150, 4, 100, 150, 125, -550, -500);

  //buildOfCirckle(r,countOfBuild, width, height, depth, posX){



  function buildOfCirckle(r,countOfBuild, width, height, depth, posX, posZ,ry){
    var circleBuild = new THREE.Object3D();
    var countOfBuild = countOfBuild || 4;
    var wrap = 0;
    var radius = r || 100;
    var posX = posX || 0;
    var ry = ry || 0;

    var count = 0;
    for(var i=0; i<countOfBuild; i++){
      height =  Math.random() * Math.random() * Math.random() * Math.random() * 700 + 200;
      var side  = new THREE.MeshBasicMaterial({map: textureMesh });
      if(count == 0){
        side =   new THREE.MeshBasicMaterial({map: textureMesh, color: "red" });
      }
      var material = myMaterial(side);
      build = new THREE.Mesh(geometry, material);
      
      build.scale.x = width;
      build.scale.y = height;
      build.scale.z = depth;

      var angle = 2 / countOfBuild * i * Math.PI;

      build.position.x = wrap + radius * Math.sin(angle);
      build.position.z = wrap + radius * Math.cos(angle);
     
      if(count == 0 || count == (countOfBuild/2) ){
        build.rotation.y = 90 * Math.PI / 180;
        build.position.z = wrap + radius * Math.cos(angle) + depth+width;
        build.position.x = wrap + radius * Math.sin(angle) - depth+width;
      }


      count++;
      circleBuild.add(build);
      circleBuild.position.x  = posX - 50;
      circleBuild.position.z  = posZ - 125;

      circleBuild.rotation.y  = ry * Math.PI/180;

    } 
      scene.add(circleBuild);
  }



  // lineCity(100,100,100);

  function lineCity(width, height, depth){
  var lineBuild = new THREE.Object3D();
  lenght = 40;
  var x = 0;
  var j=0;
  while(j!=2){

    for(var i=0;i<lenght;i++){
      if(i==lenght-1){x=200;}
      var side  = new THREE.MeshBasicMaterial({map: textureMesh });
      var material = myMaterial(side);
      build = new THREE.Mesh(geometry, material);

      height = Math.random() * Math.random() * Math.random() * Math.random() * 700 + 30;

      if(height <= 40) continue;
      build.scale.x = width;
      build.scale.y = height;
      build.scale.z = depth;

      // build.position.x = i * width - 1000;
      build.position.set(x, 0, i*(width) - 1000);
      lineBuild.add(build);

    }
    
    j++;
  }

  scene.add(lineBuild);
  }




  lastTime = performance.now();
 function generateTexture() {
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
        // var value = Math.floor(Math.random() * 128);
        var value = "255"; 
        ctx.fillStyle = "rgb(" + [value, value, value].join(",") + ")";
        ctx.fillRect(x+2, y+2, 4, 8);
      }
    }

    context.imageSmoothingEnabled = false;
    context.drawImage(canvas, 0, 0, width, height);
    context.lineWidth=10;



    context.strokeStyle = "red";
    context.strokeRect( 0, 0, width , height);

    return canvas2;

    
  }



	function loop(){
        stats.update();
    var time = performance.now() / 1000;
    controls.update(time - lastTime );
    console.log(camera.position.y);
    if(camera.position.y <= 300 ) {camera.position.y = 300};

    renderer.render(scene, camera);
    sky.position.x = camera.position.x;
    sky.position.z = camera.position.z;

    star.position.y = camera.position.y;
    star.position.x = camera.position.x;
    star.position.z = camera.position.z;
    lastTime = time;
		requestAnimationFrame(function(){loop();});
	}

	loop();
}
