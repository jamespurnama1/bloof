import type { PerspectiveCamera, Scene, Vector3, Object3D } from 'three';
//@ts-ignore
import { CSS3DObject, type CSS3DRenderer } from 'three/addons';


export const galleryInit = (images: media[], dom: HTMLElement) => {
  const {$CSS3DRenderer, $CSS3DObject, $THREE, $gsap} = useNuxtApp();
  let camera: PerspectiveCamera,
      scene: Scene,
      renderer: CSS3DRenderer,
      objects: CSS3DObject[] = [],
      vector: Vector3,
      original_rotation,
      disableMouse = false,
      frame = 0;
  
  const targets = { grid: [] as Object3D[] };

  (function init() {
      scene = new $THREE.Scene();
      camera = new $THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
      camera.position.z = 5000;
      original_rotation = camera.rotation;
      vector = new $THREE.Vector3();

      // Create images and possible transformations
      objects.push(...initImgObjects(scene, images));
      // defineSphereTransform(objects, vector);
      // defineHelixTransform(objects, vector);
      defineGridTransform(objects);
      // defineTableTransform(objects);

      // Render 3D images and user controls
      renderer = initRenderer(dom);
      // controls = initControls(renderer);
      document.body.addEventListener('mousemove', (e)=>{
        if (disableMouse) return
          $gsap.to(camera.position, {
            x: e.clientX - (window.innerWidth / 2),
            y: -e.clientY,
            delay: 0.1,
            ease: "circ",
            onUpdate: () => {
              render();
            }
          })
      });
    
      window.addEventListener('deviceorientation', (event) => {
        console.log(event)
          if (!event) return
          disableMouse = true
          const rot = (x: number) => (-Math.abs(x - 180) + 180)
          $gsap.to(camera.position, {
            x: rot(event.alpha!) * 5,
            y: Math.abs(event.beta!) * 5,
            duration: 1,
            ease: 'power1',
            onUpdate: () => {
              console.log({x: camera.position.x, y: camera.position.y})
              render();
            }
          })
        },
        false
      )
      // Bind 3D transformations to respective buttons
      // const buttonSphere = createTransformationButton('sphere', duration, targets.sphere, -199, 185, 2987, .5, .5, .5);
      // const buttonHelix = createTransformationButton('helix', duration, targets.helix, 55, 300, -4000, .5, .5, .5);
      // const buttonGrid = createTransformationButton('grid', duration, targets.grid, -297, 260, 6000);
      // const buttonTable = createTransformationButton('table', duration, targets.table, -199, 185, 6000)

      // Start the initial transformation
      transform(targets.grid, 1000, .5, .5, .5);
      window.addEventListener('resize', onWindowResize);
      galleryAnimate()
  })();

  // function initControls(renderer: CSS3DRenderer) {
  //     let controls = new $TrackballControls(camera, renderer.domElement);
  //     controls.minDistance = 500;
  //     controls.maxDistance = 6000;
  //     controls.dynamicDampingFactor = .1;
  //     controls.addEventListener('change', render);
  //     return controls
  // }

  function initRenderer(dom: HTMLElement) {
      let renderer = new $CSS3DRenderer();
      renderer.setSize(dom.clientWidth, dom.clientHeight);
      dom.appendChild(renderer.domElement);
      return renderer
  }

  function defineGridTransform(objects: CSS3DObject[]) {
      for (let i = 0; i < objects.length; i++) {
          const object = new $THREE.Object3D();

          object.position.x = ((i % 5) * 600) - 800;
          object.position.y = (- (Math.floor(i / 5) % 5) * 400) + 800;
          object.position.z = (Math.floor(i / 25)) * 1300 - 2000;

          targets.grid.push(object);
      }
  }

  // function defineHelixTransform(objects, vector) {
  //     for (let i = 0; i < objects.length; i++) {
  //         const theta = i * 0.175 + Math.PI;
  //         const y = - (i * 8) + 450;

  //         const object = new $THREE.Object3D();
  //         object.position.setFromCylindricalCoords(2000, theta, y);

  //         vector.x = object.position.x * 2;
  //         vector.y = object.position.y;
  //         vector.z = object.position.z * 2;

  //         object.lookAt(vector);

  //         targets.helix.push(object: CSS3DObject);
  //     }
  // }

  // function defineSphereTransform(objects, vector) {
  //     for (let i = 0; i < objects.length; i++) {
  //         let l = objects.length;
  //         const phi = Math.acos(- 1 + (2 * i) / l);
  //         const theta = Math.sqrt(l * Math.PI) * phi;

  //         const object = new $THREE.Object3D();
  //         object.position.setFromSphericalCoords(800, phi, theta);

  //         vector.copy(object.position).multiplyScalar(2);

  //         object.lookAt(vector);

  //         targets.sphere.push(object);
  //     }
  // }

  // function defineTableTransform(objects) {
  //     for (let i = 0; i < objects.length; i++) {
  //         const object = new $THREE.Object3D();

  //         object.position.x = ((i % 15) * 600) - 4000;
  //         object.position.y = (- (Math.floor(i / 15)) * 500) + 1600;
  //         object.position.z = -1000;

  //         targets.table.push(object);
  //     }
  // }

  // function createTransformationButton(id, duration, target, x, y, z, x_scale=1, y_scale=1, z_scale=1) {
  //     return document.getElementById(id).addEventListener('click', function () {
  //         transform(target, duration, x_scale, y_scale, z_scale);
  //         moveCameraPosition(x, y, z);
  //     });
  // }

  // function showImageModal(i, images) {
  //     var img = images[i];
  //     $('#photoDisplayModal img').attr("src", img.fpath);
  //     $('#photoDisplayModal h3').text(img.title);
  //     $('#photoDisplayModal h6').text(img.date);

  //     // Conditionally display Instagram link if it exists or not
  //     var instagramLink = $('#photoDisplayModal .col-md-6 .fa-instagram');
  //     img.instagram_link === null ? instagramLink.css("display", "none") : instagramLink.css("display", "block");
  //     instagramLink.attr("href", img.instagram_link);

  //     // Conditionally display previous/next buttons
  //     var previousButton = $(".fa-angle-left");
  //     var nextButton = $(".fa-angle-right");
  //     i === 0 ? previousButton.css("display", "none") : previousButton.css("display", "block");
  //     i === images.length - 1 ? nextButton.css("display", "none") : nextButton.css("display", "block");
      
  //     $('#photoDisplayModal .col-md-6 .fa-pencil').attr("href", window.location.href + "/" + img.id + "/edit");
  //     $('#photoDisplayModal').modal('show');
  //     insertUrlParam("id", img.id);
  // }

  function initImgObjects(scene: Scene, images: media[]) {
      /* Create 3D rendered img tags from a dynamically served array
      of img src's and add them to the scene */
      const objects = [];
      for (let i = 0; i < images.length; i += 1) {
        const img = document.createElement('img');

        img.src = images[i].imgix_url;
        img.alt = images[i].original_name as string;
        // img.id = "photo" + images[i].id;

        // HACK: Android Chromium browsers don't render properly if the <img>
        // is embedded in an <a> or if the <img> has certain CSS (border-radius, hover
        // effect, etc.)
        if (getOS() === "Android") {
            img.classList.add("rendered-img");
        } else {
            img.classList.add("fancy-rendered-img");
        }
        img.classList.add('galleryimg');
        $gsap.set(img, {
          opacity: 0,
          filter: 'blur(200px)'
        })

        img.onload = () => {
          $gsap.to(img, {
            opacity: 1,
            filter: 'blur(0px)',
            duration: 3
          })
        }

        img.addEventListener("click", function () {
            // window.open(img_src, photoDisplayModalblank");
            // showImageModal(i, images);
        });

          // // Touch screen compatibility for image clicking
          // let isSwiping = false;
          // img.addEventListener("touchstart", function() {
          //     isSwiping = false;
          // });
          // img.addEventListener("touchend", function() {
          //     if (!isSwiping) {
          //         // showImageModal(i, images);
          //     };
          // });
          // img.addEventListener("touchmove", function() {
          //     isSwiping = true;
          // });
          // $gsap.to(objects[i].element, {
          //   opacity: 0.0,
          //   duration: 10,
          // })

        const objectCSS = new $CSS3DObject(img);
        objectCSS.scale.set(0.5, 0.5, 0.5);
        objectCSS.position.x = Math.random() * 4000 - 2000;
        objectCSS.position.y = Math.random() * 4000 - 2000;
        objectCSS.position.z = Math.random() * 4000 - 5000;
        scene.add(objectCSS)
        objects.push(objectCSS)
      }
    return objects
  }

  function transform(targets: Object3D[], duration: number, x_scale=1, y_scale=1, z_scale=1) {
      // TWEEN.removeAll();

      // for (let i = 0; i < objects.length; i++) {

      //     const object = objects[i];
      //     const target = targets[i];

      //     new TWEEN.Tween(object.position)
      //         .to({ x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
      //         .easing(TWEEN.Easing.Exponential.InOut)
      //         .start();

      //     new TWEEN.Tween(object.rotation)
      //         .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
      //         .easing(TWEEN.Easing.Exponential.InOut)
      //         .start();
      //     new TWEEN.Tween(object.scale)
      //         .to({ x: x_scale, y: y_scale, z: z_scale })
      //         .easing(TWEEN.Easing.Exponential.InOut)
      //         .start();
      // }

      // new TWEEN.Tween(this)
      //     .to({}, duration * 2)
      //     .onUpdate(render)
      //     .start();
  }

  // function moveCameraPosition(x, y, z) {
  //     new TWEEN.Tween(camera.position)
  //         .to({x: x, y: y, z: z})
  //         .easing(TWEEN.Easing.Exponential.InOut)
  //         .start();
  //     new TWEEN.Tween(controls.object.up)
  //         .to(controls.up0)
  //         .easing(TWEEN.Easing.Exponential.InOut)
  //         .start();
  // }

  function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
      render();
  }

  function galleryAnimate() {
    requestAnimationFrame(galleryAnimate);
    frame++
    for (let i = 0; i < objects.length; i++) {
      objects[i].position.z = objects[i].position.z + 5

      if (objects[i].position.z > 4000) {
        $gsap.to(objects[i].element, {
          opacity: 0.0,
          filter: 'blur(50px)',
          duration: 15,
        })
      }

      if (objects[i].position.z > 7000) {
        scene.remove(objects[i])
        objects.splice(i, 1);
      }
    }

    if (frame % 500 === 0) {
      objects.push(...initImgObjects(scene, images));
    }

    render()
  }

  function render() {
      renderer.render(scene, camera);
  }

  function getOS() {
      var userAgent = window.navigator.userAgent,
          platform = window.navigator.platform,
          macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
          windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
          iosPlatforms = ['iPhone', 'iPad', 'iPod'],
          os = null;

      if (macosPlatforms.indexOf(platform) !== -1) {
          os = 'Mac OS';
      } else if (iosPlatforms.indexOf(platform) !== -1) {
          os = 'iOS';
      } else if (windowsPlatforms.indexOf(platform) !== -1) {
          os = 'Windows';
      } else if (/Android/.test(userAgent)) {
          os = 'Android';
      } else if (!os && /Linux/.test(platform)) {
          os = 'Linux';
      }

      return os;
  }
}