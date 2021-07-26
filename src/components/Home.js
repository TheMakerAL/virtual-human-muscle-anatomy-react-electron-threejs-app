/**
 * MakerAL.com 2021
 **/

import React from "react";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { Page } from "./base/Page";

const path = require("path");

export class Home extends Page {
  constructor(props) {
    super(props);

    // Initial states
    this.state = {
      rotate: true,
      background: false
    };
  }

  // Set background
  setBackground(status) {
    console.log("Set background: " + status);

    // Show/hide background
    if (status) {
      this.backgroundScene.background = new THREE.CubeTextureLoader()
        .setPath(path.join(this.resourceDir, "backgrounds", path.sep))
        .load([
          "main.jpg",
          "main.jpg",
          "main.jpg",
          "main.jpg",
          "main.jpg",
          "main.jpg"
        ]);
    } else {
      this.backgroundScene.background = new THREE.Color("black");
    }

    this.setState({
      background: status
    });
  }

  // Set rotate
  setRotate(status) {
    console.log("Set rotate: " + status);
    this.setState({
      rotate: status
    });
  }

  // Reset model
  resetModel() {
    this.mainMesh.scale.set(2, 2, 2);
    this.mainMesh.position.set(0, 0, 0);
    this.mainMesh.rotation.set(0, 0, 0);

    this.camera.position.set(0, 0, 50);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.controls.reset();
    this.controls.update();
  }

  startAnimation() {
    if (!this.animationRequest) {
      this.animationRequest = requestAnimationFrame(this.animate);
    }
  }

  stopAnimation() {
    if (this.animationRequest) {
      cancelAnimationFrame(this.animationRequest);
    }
  }

  // Callback
  renderScene = () => {
    this.renderer.clear();
    this.renderer.render(this.backgroundScene, this.backgroundCamera);
    this.renderer.render(this.scene, this.camera);
  };

  componentWillUnmount() {
    this.stopAnimation();
    document.getElementById("scene").removeChild(this.renderer.domElement);
  }

  updateCanvasSize() {
    this.canvasWidth = window.innerWidth;
    this.canvasHeight =
      window.innerHeight -
      document.getElementsByTagName("header")[0].clientHeight -
      document.getElementsByTagName("footer")[0].clientHeight;
    console.log("Canvas width: " + this.canvasWidth);
    console.log("Canvas height: " + this.canvasHeight);
  }

  setupKeyControls() {
    document.onkeydown = event => {
      switch (event.keyCode) {
        case 37:
          this.mainMesh.rotation.x += 0.1;
          break;
        case 38:
          this.mainMesh.rotation.z -= 0.1;
          break;
        case 39:
          this.mainMesh.rotation.x -= 0.1;
          break;
        case 40:
          this.mainMesh.rotation.z += 0.1;
          break;
      }
    };
  }

  updateMouse(event) {
    let canvasBounds = this.renderer.domElement.getBoundingClientRect();

    this.mousePos.x =
      ((event.clientX - canvasBounds.left) /
        (canvasBounds.right - canvasBounds.left)) *
        2 -
      1;
    this.mousePos.y =
      -(
        (event.clientY - canvasBounds.top) /
        (canvasBounds.bottom - canvasBounds.top)
      ) *
        2 +
      1;
  }

  // Callback
  onWindowResize = () => {
    this.updateCanvasSize();
    this.camera.aspect = this.canvasWidth / this.canvasHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvasWidth, this.canvasHeight);
  };

  // Callback
  onMouseClick = event => {
    this.updateMouse(event);

    this.raycaster.setFromCamera(this.mousePos, this.camera);

    let intersects = this.raycaster.intersectObjects(this.scene.children, true);
    if (intersects.length > 0) {
      let object = intersects[0].object;

      // Walk up to get parent object (if you want to only trigger callback for parent
      //while (!object.userData.isContainer) {
      //object = object.parent;
      //}

      // Trigger callback
      if (object.callback) {
        object.callback();
      }
    }
  };

  // Callback
  onMouseMove = event => {
    this.updateMouse(event);
  };

  // Callback
  animate = () => {
    // Rotate main mesh
    if (this.mainMesh && this.state.rotate) {
      this.mainMesh.rotation.y += 0.01;
    }

    // Rotate spot light
    if (this.spotLight) {
      this.spotLight.position.set(
        this.camera.position.x + 10,
        this.camera.position.y + 10,
        this.camera.position.z + 10
      );
    }

    // Update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera(this.mousePos, this.camera);

    // Calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects(
      this.scene.children,
      true
    );

    if (intersects.length > 0) {
      // A new intersect is found
      if (this.intersected != intersects[0].object) {
        if (this.intersected) {
          // Reset current intersect mesh color
          this.intersected.material.color.setHex(this.intersected.currentHex);
          // Remove box helper
          if (this.intersected.boxHelper) {
            this.scene.remove(this.intersected.boxHelper);
          }
          // Hide annotation
          this.hideAnnotation(this.intersected.userData.label);
        }

        this.intersected = intersects[0].object;
        if (this.intersected.isMesh) {
          this.intersected.currentHex = this.intersected.material.color.getHex();
          this.intersected.material.color.setHex(0x00ff00);
          document.body.style.cursor = "pointer";

          // Show box helper
          /*const box = new THREE.Box3().setFromObject(this.intersected);
            const boxHelper = new THREE.Box3Helper(box, 0xffff00);
            this.scene.add(boxHelper);
            this.intersected.boxHelper = boxHelper;
            */

          // Create annotation
          const canvas = this.renderer.domElement;
          const vector = new THREE.Vector3(250, 250, 250);
          //const vector = intersects[0].point;
          vector.project(this.camera);
          vector.x = Math.round(
            (0.5 + vector.x / 2) * (canvas.width / window.devicePixelRatio)
          );
          vector.y = Math.round(
            (0.5 - vector.y / 2) * (canvas.height / window.devicePixelRatio)
          );
          // Show annotation
          this.showAnnotation(this.intersected.userData.label, vector);
        }
      }
    } else {
      if (this.intersected) {
        // Reset current intersect mesh color
        this.intersected.material.color.setHex(this.intersected.currentHex);
        // Remove box helper
        if (this.intersected.boxHelper) {
          this.scene.remove(this.intersected.boxHelper);
        }
        // Hide annotation
        this.hideAnnotation(this.intersected.userData.label);
      }
      this.intersected = null;
      document.body.style.cursor = "default";
    }

    this.renderScene();
    // https://css-tricks.com/using-requestanimationframe/
    this.animationRequest = requestAnimationFrame(this.animate);
  };

  showAnnotation(partName, vector) {
    const annotation = document.querySelector("#" + partName);
    if (annotation) {
      console.log("Annotation found for " + partName);

      // Invalid
      annotation.style.topx = `${vector.y}px`;
      annotation.style.leftx = `${vector.x}px`;

      annotation.style.opacity = 1;
      annotation.style.visibility = "visible";
    } else {
      console.log("Annotation not found for " + partName);
    }
  }

  hideAnnotation(partName) {
    const annotation = document.querySelector("#" + partName);
    if (annotation) {
      annotation.style.opacity = 0;
      annotation.style.visibility = "hidden";
    }
  }

  // Runs after the first render() lifecycle
  componentDidMount() {
    const env = process.env.NODE_ENV;
    this.resourceDir = "resources";

    console.log("Env: " + env);
    console.log("URL: " + window.location.href);
    console.log("Resource dir: " + this.resourceDir);

    this.updateCanvasSize();

    // Setup scene
    this.scene = new THREE.Scene();

    // Setup camera
    this.camera = new THREE.PerspectiveCamera(
      100,
      this.canvasWidth / this.canvasHeight,
      0.1,
      2000
    );
    this.camera.position.set(0, 0, 50);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Setup background scene
    this.backgroundScene = new THREE.Scene();

    // Setup background camera
    this.backgroundCamera = new THREE.PerspectiveCamera(
      100,
      this.canvasWidth / this.canvasHeight,
      0.1,
      2000
    );
    this.backgroundCamera.position.set(0, 0, 50);
    this.backgroundCamera.lookAt(new THREE.Vector3(0, 0, 0));

    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.canvasWidth, this.canvasHeight);
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.renderer.toneMappingExposure = 2.3;
    this.renderer.shadowMap.enabled = true;
    this.renderer.autoClear = false;
    document.getElementById("scene").appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.addEventListener("change", this.renderScene);

    let hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 5);
    this.scene.add(hemiLight);

    this.spotLight = new THREE.SpotLight(0xffa95c, 4);
    this.spotLight.position.set(-50, 50, 50);
    this.spotLight.castShadow = true;
    this.spotLight.shadow.bias = -0.0001;
    this.spotLight.shadow.mapSize.width = 1024 * 4;
    this.spotLight.shadow.mapSize.height = 1024 * 4;
    this.scene.add(this.spotLight);

    // Load GLTF
    let loader = new GLTFLoader();
    let gltfPath = path.join(this.resourceDir, "gltf", "body", "scene.gltf");
    console.log("Main path: " + gltfPath);

    loader.load(gltfPath, gltf => {
      this.mainMesh = gltf.scene;
      this.mainMesh.name = "Main";
      this.mainMesh.userData.isContainer = true;
      this.mainMesh.scale.set(2, 2, 2);
      this.mainMesh.position.set(0, 0, 0);
      this.mainMesh.rotation.set(0, 0, 0);

      let labelCount = 0;

      this.mainMesh.traverse(n => {
        if (n.isMesh) {
          // Lighting
          n.castShadow = true;
          n.receiveShadow = true;
          if (n.material.map) {
            n.material.map.anisotropy = 16;
          }

          // Custom data, assign a label
          n.userData.label = "part-" + ++labelCount;

          n.callback = () => {
            console.log(n.userData.label);
          };
        }
      });

      console.log("Total parts: " + labelCount);

      //const box = new THREE.Box3().setFromObject(this.mainMesh);
      //const boxHelper = new THREE.Box3Helper(box, 0xffff00);
      //this.scene.add(boxHelper);

      this.scene.add(this.mainMesh);

      // After main mesh is loaded
      this.setupKeyControls();

      // On click call back
      this.mainMesh.callback = () => {
        console.log("Main clicked");
      };

      // Initialize raycaster intersection detection
      this.raycaster = new THREE.Raycaster();
      this.mousePos = new THREE.Vector2();
      this.intersected = null;

      // Showing all
      document.querySelector("#scene").style.display = "block";
      document.querySelector("#instructions").style.display = "block";
      document.querySelector("#controls").style.display = "block";
      document.querySelector("#disclaimer").style.display = "block";
      document.querySelector(".loading").style.display = "none";

      // Register events
      this.renderer.domElement.addEventListener(
        "click",
        this.onMouseClick,
        false
      );
      this.renderer.domElement.addEventListener(
        "mousemove",
        this.onMouseMove,
        false
      );
      window.addEventListener("resize", this.onWindowResize);

      this.startAnimation();
    });
  }

  render() {
    return (
      <div className="page home">
        <div className="loading">
          <i className="fas fa-spin fa-sync" />
        </div>
        <div id="scene"></div>
        <div id="instructions">
          <p>
            <strong>How to use:</strong>
          </p>
          <ul>
            <li>Hover over the model to reveal muscle name</li>
            <li>Use mouse to zoom and drag the model</li>
            <li>Hold CTL key and drag mouse to rotate the model</li>
          </ul>
        </div>
        <div id="controls">
          <button onClick={() => this.setRotate(!this.state.rotate)}>
            {this.state.rotate ? "Stop Rotate" : "Start Rotate"}
          </button>
          <button onClick={() => this.setBackground(!this.state.background)}>
            {this.state.background ? "Hide Background" : "Show Background"}
          </button>
          <button onClick={() => this.resetModel()}>Reset Model</button>
        </div>
        <div id="disclaimer">
          Disclaimer: This application is used for demo and learning purposes of{" "}
          <a href="https://www.electronjs.org/" target="_blank">
            Electron
          </a>
          ,{" "}
          <a href="https://reactjs.org/" target="_blank">
            React
          </a>{" "}
          and{" "}
          <a href="https://reactjs.org/" target="_blank">
            Three.js
          </a>
          .
        </div>
        <div className="part" id="part-1">
          Gluteus maximus
        </div>
        <div className="part" id="part-2">
          Deltoid
          <br />
          Rhomboid
          <br />
          Teres Major
        </div>
        <div className="part" id="part-3">
          Gastrocnemius
          <br />
          Soleus
        </div>
        <div className="part" id="part-4">
          Semitendinosis
          <br />
          Biceps Femoris
        </div>
        <div className="part" id="part-5">
          Vastus Latera
        </div>
        <div className="part" id="part-6">
          Trapezius
          <br />
          Thoraco-lumbar Fascia
          <br />
          Latissimus Dorsi
        </div>
        <div className="part" id="part-7">
          Frontalis
          <br />
          Orbicularis Oculi
          <br />
          Zygomaticus
          <br />
          Masseter
          <br />
          Orbicularis Oris
        </div>
        <div className="part" id="part-8">
          Rectus Femoris
          <br />
          Pectineus
          <br />
          Sartorius
          <br />
          Adductor Longus
          <br />
          Gracilis
        </div>
        <div className="part" id="part-9">
          Sternocleidomastoid
          <br />
          Trapezius
        </div>
        <div className="part" id="part-10">
          Lubrical
        </div>
        <div className="part" id="part-11">
          Pectoralis Major
          <br />
          Rectus Abdominus
          <br />
          Serratus Anterior
          <br />
          External Oblique
        </div>
        <div className="part" id="part-12">
          Peroneus Longus
          <br />
          Extensor Digitorum Brevis
          <br />
          Extensor Hallucis Brevis
          <br />
          Tibialis Anterior
        </div>
        <div className="part" id="part-13">
          Gracilis
          <br />
          Semimembranosus
        </div>
        <div className="part" id="part-14">
          Gastrocnemius
          <br />
          Soleus
        </div>
        <div className="part" id="part-15">
          Extensor Carpi Radialis
          <br />
          Extensor Digitorum
          <br />
          Extensor Capri Ulnaris
          <br />
          Extensor Digiti Minimi
        </div>
        <div className="part" id="part-16">
          Triceps
        </div>
      </div>
    );
  }
}
