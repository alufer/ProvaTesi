var main=function()
{
	var camera=null, scene=null, renderer=null, controls;
	var monkey=new Object();
	monkey.m=null;
	var cube=new Object();
	var torusKnot;
	var TUX2;
	var j=new Array();
	var objs=new Array();
	var angle=0.0;
	var light2;
	var obj_name="cube.obj";
	var sphereGeometry = new THREE.SphereGeometry( 7.5, 16, 8 );
	
	var clock = new THREE.Clock();
	var effect, controls, oculuscontrol;
	
	var position=
	{
		x:0.0,
		y:20.0,
		z:5.0
	};
	
	var scale=
	{
		x:8.0,
		y:8.0,
		z:8.0
	};
	
	var rotation=
	{
		x:.0,
		y:.45,
		z:.0
	};

	var position2=position;
	position2.x=8.0;
	
	var position3=
	{
		x:3.0,
		y:8.0,
		z:0.0
	};
	
	var rotation2=rotation;
	rotation2.z=180.0;
	//rotation2.x=45.0;
	
	
	var CANVAS=document.getElementById("your_canvas");

	CANVAS.width=window.innerWidth;
	CANVAS.height=window.innerHeight;
 
	initWebGL();
	animate();
 
	function initWebGL() 
	{
		// sezione di set-up di progetto
	
		renderer=new THREE.WebGLRenderer({antialias:true,canvas:CANVAS});
		renderer.setSize(CANVAS.width,CANVAS.height);
		document.body.appendChild(renderer.domElement);
		renderer.shadowMapEnabled = true;
		//renderer.shadowMapType = THREE.PCFShadowMapSoft;
		renderer.ShadowMapSoft=true;
		renderer.physicallyBasedShading=true;
		
		scene = new THREE.Scene();
		
		//OCULUS
		
		effect = new THREE.OculusRiftEffect( renderer, { worldScale: 1 } );
		effect.setSize( window.innerWidth, window.innerHeight );
		
		controls = new THREE.FirstPersonControls( camera );
		controls.movementSpeed = 4000;
		controls.lookSpeed = 3.0;
		controls.lookVertical = true;

		oculuscontrol = new THREE.OculusControls( camera );
		
		// add simple ground
		
		var woodMap = THREE.ImageUtils.loadTexture( "ressources/Texture parquet rovere seamless simo-3d.jpg",THREE.UVMapping );
		woodMap.wrapS = woodMap.wrapT = THREE.RepeatWrapping;
		woodMap.repeat.set( 1, 1 );
		woodMap.anisotropy = 16;
		
		var woodBumpMap = THREE.ImageUtils.loadTexture( "ressources/Texture parquet rovere seamless bump simo-3d.jpg",THREE.UVMapping );
		woodBumpMap.wrapS = woodBumpMap.wrapT = THREE.RepeatWrapping;
		woodBumpMap.repeat.set( 1, 1 );
		woodBumpMap.anisotropy = 16;
		
		var woodMaterial = new THREE.MeshPhongMaterial( { map: woodMap, specular: 0xffffff, shininess: 100, bumpMap: woodBumpMap } );
		
		var ground = new THREE.Mesh( new THREE.PlaneGeometry(1500, 1500, 10, 10), woodMaterial );
		ground.receiveShadow = true;
		ground.position.set(0, -10, 0);
		ground.rotation.x = -Math.PI / 2;
		scene.add(ground);
		
		var loader2=new THREE.OBJMTLLoader();
		
		loader2.load("ressources/monkey.obj","ressources/monkey.mtl",function(event)
		{
			var gr=event;
			gr.traverse( function( node ) { if ( node instanceof THREE.Mesh ) { node.castShadow = true; node.receiveShadow=true; } } );
			gr.scale.set(20,20,20);
			gr.position.set(100,10,0);
			scene.add(gr);
		});
		
		loader2.load("ressources/Mark 42.obj","ressources/Mark 42.mtl",function(event)
		{
			var gr=event;
			gr.traverse( function( node ) { if ( node instanceof THREE.Mesh ) { node.castShadow = true; node.receiveShadow=true; } } );
			gr.scale.set(350,350,350);
			gr.position.set(0,-5,0);
			scene.add(gr);
		});
		//ADD OBJECTS
		
		addObj("monkey1.obj",scale,position3,rotation2,objs);
		monkey.m=objs[objs.length];
		
		TUX=addCollada(j);
		addCollada(j);
		
		var geometry	= new THREE.TorusKnotGeometry(25, 8, 75, 20);/*
		var texture	= THREE.ImageUtils.loadTexture( "images/water.jpg" );
		texture.repeat.set( 0.7, 1 );
		texture.wrapS	= texture.wrapT = THREE.RepeatWrapping;*/
		var material	= new THREE.MeshPhongMaterial(
		{
			ambient		: 0x444444,
			color			: 0x111488,
			shininess	: 300, 
			specular	: 0xFFFFFF,
			shading		: THREE.SmoothShading
			//map		: texture
		});
		
		var material2	= new THREE.MeshPhongMaterial(
		{
			ambient		: 0xff0000,
			color			: 0x333488,
			shininess	: 100, 
			specular	: 0xFFFFFF,
			emissive	: 0x111111,
			shading		: THREE.SmoothShading
			//map		: texture
		});
		
		torusKnot	= new THREE.Mesh( geometry, material );
		torusKnot.scale.multiplyScalar(1/3);
		torusKnot.position.y		= 24;
		torusKnot.position.x		= -24;
		scene.add( torusKnot );
		torusKnot.castShadow		= true;
		torusKnot.receiveShadow	= true;
		/*
		var g=addObj(obj_name,scale,position,rotation);
		obj=new THREE.Mesh(g,material);
		*/
		addObj(obj_name,scale,position,rotation,objs);
		cube=objs[objs.length];
		
		var g2=new THREE.SphereGeometry(14,32,32);
		cube=new THREE.Mesh(g2,material2);
		cube.position.set(15,50,0);
		cube.castShadow=true;
		cube.receiveShadow=true;
		scene.add(cube);
		
		addLight();
		
		camera = new THREE.PerspectiveCamera( 90, CANVAS.width/ CANVAS.height, .1, 10000 );
		camera.position.set(0,50,100);
		camera.lookAt(scene.position);
		
		THREEx.WindowResize(renderer, camera);
		/*
		controls = new THREE.OrbitControls( camera, renderer.domElement );/*
		controls.addEventListener( 'change', render );
		controls.maxPolarAngle = Math.PI / 2;
		controls.minDistance = 2;
		controls.maxDistance = 500;
		
		//scene.add( camera );
		
		/*var posX=0, posZ=20;
		
		var speedX=0, speedZ=0; //camera speed
		window.onkeydown=function(event)
		{
			keyUpDown(event.keyCode, 0.1);
		};
		window.onkeyup=function(event)
		{
			keyUpDown(event.keyCode, 0);
		};

		var keyUpDown=function(keycode, sensibility) 
		{
			switch(keycode) 
			{

				case 37: //left arrow
					speedX=-1*sensibility*2;
					break;

				case 39: //right arrow
					speedX=1*sensibility*2;
					break;

				case 38: //up arrow
					speedZ=-1*sensibility*2;
					break;
	
				case 40: //down arrow
					speedZ=1*sensibility*2;
					break;

			} //end switch keycode
		};
		
		var drag=false, oldX, oldY, dX=0, dY=0, rotX=0, rotY=0;
		window.onmousedown=function(event) 
		{
			drag=true;
			oldX=event.clientX,
      oldY=event.clientY;
		};

		window.onmouseup=function() 
		{
			drag=false;
		};

		window.onmousemove=function(event) 
		{
			if (!drag) return false;

			dX=event.clientX-oldX,
      dY=event.clientY-oldY;

			oldX=event.clientX,
      oldY=event.clientY;
		};
		
		setInterval(function() 
		{
			var cos=Math.cos(rotY);
			sin=Math.sin(rotY);

			posX+=speedX*cos+speedZ*sin,
      posZ+=speedX*-sin+speedZ*cos;
			camera.position.set(posX, 5, posZ);
			rotY-=dX*0.0005,
			rotX-=dY*0.0005;

			camera.rotation.set(0,0,0);
			camera.rotateY(rotY);
			camera.rotateX(rotX);
			
			if (!drag) 
			{
				dX*=0.9, dY*=0.9;
			};
		
		}, 16);

    
		/*
		window.onkeyup=function(event)
		{
			if(obj_name=="monkey1.obj")
			{
				obj_name="cube.obj";
				position.x+=3.0;
			}
			else
			{
				obj_name="monkey1.obj";
				position.x-=3.0;
			}
			initWebGL();
		}*/
		
		
	}

	function animate() 
	{
		// sezione per l'aggiornamento e l'animazione
		
		var t = clock.getElapsedTime();
	
		requestAnimationFrame( animate );
		render();
		//controls.update();
		
		controls.update( clock.getDelta() );
		oculuscontrol.update( clock.getDelta() );
				
		effect.render( scene, camera );
	}
	
	
	
	function render() 
	{
		// sezione di disegno su canvas
		
		objs[0].rotation.y=-angle*2;
		//monkey.m.rotation.y=-angle*2;
		//torusKnot.rotation.set(angle,angle,angle);
		objs[1].rotation.y=angle;
		j[0].rotation.set(angle,angle,angle);
		j[1].rotation.set(-angle,angle,angle);
		angle+=0.05;
		
		renderer.render( scene, camera );
	}
	
	function addObj(obj_name,scale,position,rotation,objs)
	{
		var loader=new THREE.OBJLoader();
		loader.load("/Prove WebGL/ressources/"+obj_name,function(object)
		{
			object.traverse(function(child)
			{
				if (child instanceof THREE.Mesh)
				{
					// enable casting shadows
					child.castShadow = true;
					child.receiveShadow = true;
				}	
			});
		
			
			object.scale.x=scale.x;
			object.scale.y=scale.y;
			object.scale.z=scale.z;
			object.scale*=2;
			
			object.position.x=position.x;
			object.position.y=position.y;
			
			object.rotation.y=rotation.y*Math.PI;
			object.rotation.x=rotation.x*Math.PI;
			
			
			objs.push(object);
			scene.add(object);
			
		});
	}
	
	
	function addCollada(j)
	{
		//COLLADA MODEL
		var TUX;
		var loader = new THREE.ColladaLoader();
		loader.load( 'ressources/torus.dae', function ( collada ) 
		{/*
			collada.traverse(function(child)
			{
				if (child instanceof THREE.Mesh)
				{
					// enable casting shadows
					child.castShadow = true;
					child.receiveShadow = true;
				}	
			});
			*/
			collada.castShadow=true;
			collada.receiveShadow=true;
			
			TUX = collada.scene;

			TUX.scale.x = TUX.scale.y = TUX.scale.z = 5;
			TUX.position.set(-40,25,0);
			TUX.rotateX(.35*Math.PI);

			TUX.updateMatrix();
			
			TUX.children[0].children[0].castShadow = true;
			TUX.children[0].children[0].receiveShadow = true;
				
			j.push(TUX);
			scene.add(TUX);
			
		});
		return TUX;
	}
	
	function createEmitter( light )
	{

		var sphereMaterial = new THREE.MeshBasicMaterial( { color: light.color.getHex() } );
		var lightSphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
		lightSphere.position = light.position;

		return lightSphere;

	}
	
	function addLight()
	{
		light2=new THREE.PointLight(0xFFFFFF);
		light2.intensity=1.0;
		light2.position.set(10,30,20);
		//light2.castShadow=true;
		//scene.add(light2);
		//emmitter1=createEmitter(light2);
		//scene.add(emmitter1);
		
		var light=new THREE.DirectionalLight(0xFFFFFF);
		light.position.set(20,90,10);
		light.intensity=.5;
		light.castShadow=true;
		//scene.add(light);
		
		//light.shadowCameraVisible=true;
		
		var spotLight= new THREE.SpotLight( 0xAAAAAA );
		spotLight.intensity=5.0;
		spotLight.position.set( 0,500,10 );
		spotLight.rotation.set(.10*Math.PI,.50*Math.PI,.90*Math.PI);
		spotLight.castShadow = true;

		spotLight.shadowMapWidth = 1024;
		spotLight.shadowMapHeight = 1024;


		spotLight.shadowCameraNear = 20;
		spotLight.shadowCameraFar = 5000;
		spotLight.shadowCameraFov = 100;
		spotLight.shadowDarkness=0.7;
		
		//Debug spotLight
		//spotLight.shadowCameraVisible=true;
		
		var spotLightX=0, spotLightZ=0, spotLightTheta=0;
		setInterval(function() 
		{
			spotLightTheta+=0.15;
			spotLightX=1500*Math.cos(spotLightTheta),
      spotLightZ=1500*Math.sin(spotLightTheta),
      spotLight.position.set(spotLightX,1000,spotLightZ);
		}, 46);
		
		scene.add(spotLight);
	}
}