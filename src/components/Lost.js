/**
 * MakerAL.com 2021
 **/

import React from "react";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { Page } from "./base/Page";

const path = require("path");

export class Lost extends Page {
  constructor(props) {
    super(props);
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
      while (!object.userData.isContainer) {
        object = object.parent;
      }

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

  // Calback
  animate = () => {
    // Rotate main mesh
    if (this.mainMesh) {
      this.mainMesh.rotation.y += 0.01;
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
        }

        this.intersected = intersects[0].object;
        if (this.intersected.isMesh) {
          this.intersected.currentHex = this.intersected.material.color.getHex();
          this.intersected.material.color.setHex(0x00ff00);
          document.body.style.cursor = "pointer";
        }
      }
    } else {
      if (this.intersected) {
        // Reset current intersect mesh color
        this.intersected.material.color.setHex(this.intersected.currentHex);
      }
      this.intersected = null;
      document.body.style.cursor = "default";
    }

    this.renderScene();
    // https://css-tricks.com/using-requestanimationframe/
    this.animationRequest = requestAnimationFrame(this.animate);
  };

  // Runs after the first render() lifecycle
  componentDidMount() {
    const env = process.env.NODE_ENV;
    const resourceDir = "resources";

    console.log("Env: " + env);
    console.log("URL: " + window.location.href);
    console.log("Resource dir: " + resourceDir);

    this.updateCanvasSize();

    // Setup scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.CubeTextureLoader()
      .setPath(path.join(resourceDir, "backgrounds", path.sep))
      .load([
        "matrix.jpg",
        "matrix.jpg",
        "matrix.jpg",
        "matrix.jpg",
        "matrix.jpg",
        "matrix.jpg"
      ]);

    this.camera = new THREE.PerspectiveCamera(
      100,
      this.canvasWidth / this.canvasHeight,
      0.1,
      2000
    );
    this.camera.position.set(0, 0, 50);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.canvasWidth, this.canvasHeight);
    document.getElementById("scene").appendChild(this.renderer.domElement);

    let controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.addEventListener("change", this.renderScene);

    let directionalLight = new THREE.DirectionalLight(0xffffff, 5);
    directionalLight.position.set(0, 1, 0);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    let light = new THREE.PointLight(0xc4c4c4, 1);
    light.position.set(0, 300, 500);
    this.scene.add(light);

    let light2 = new THREE.PointLight(0xc4c4c4, 1);
    light2.position.set(500, 100, 0);
    this.scene.add(light2);

    let light3 = new THREE.PointLight(0xc4c4c4, 1);
    light3.position.set(0, 100, -500);
    this.scene.add(light3);

    let light4 = new THREE.PointLight(0xc4c4c4, 1);
    light4.position.set(-500, 300, 500);
    this.scene.add(light4);

    let loader = new GLTFLoader();
    let gltfPath = path.join(resourceDir, "gltf", "skull", "scene.gltf");
    console.log("Main path: " + gltfPath);

    loader.load(gltfPath, gltf => {
      this.mainMesh = gltf.scene;
      this.mainMesh.name = "Main";
      this.mainMesh.userData.isContainer = true;
      this.mainMesh.scale.set(15, 15, 15);
      this.mainMesh.position.set(0, 0, 0);
      this.mainMesh.rotation.set(0, 0, 0);

      //const box = new THREE.Box3().setFromObject(this.mainMesh);
      //const boxHelper = new THREE.Box3Helper(box, 0xffff00);
      //this.scene.add(boxHelper);

      this.scene.add(this.mainMesh);

      // On click call back
      this.mainMesh.callback = () => {
        console.log("Main clicked");
      };
    });

    // Add 3D text beveled and sized
    let fontLoader = new THREE.FontLoader();
    let fontPath = path.join(
      resourceDir,
      "fonts",
      "amble_regular.typeface.json"
    );
    console.log("Font path: " + fontPath);

    fontLoader.load(fontPath, font => {
      let textGeo = new THREE.TextGeometry("ARE YOU LOST?", {
        font: font,
        size: 10,
        height: 0.5,
        curveSegments: 10,
        bevelThickness: 0.5,
        bevelSize: 0.5,
        bevelEnabled: true
      });

      let material = new THREE.MeshPhongMaterial({
        color: 0xff0000
      });

      this.textMesh = new THREE.Mesh(textGeo, material);
      this.textMesh.name = "Text";
      this.textMesh.userData.isContainer = true;
      //this.textMesh.scale.set(0.5, 0.5, 0.5);

      textGeo.computeBoundingBox();
      const centerX =
        -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
      // To center Y
      //const centerY = -0.5 * ( textGeo.boundingBox.max.y - textGeo.boundingBox.min.y );
      const centerY =
        -3 * (textGeo.boundingBox.max.y - textGeo.boundingBox.min.y);

      this.textMesh.position.set(centerX, centerY, 0);
      this.textMesh.rotation.set(0, 0, 0);

      //const box = new THREE.Box3().setFromObject(this.textMesh);
      //const boxHelper = new THREE.Box3Helper(box, 0xffff00);
      //this.scene.add(boxHelper);

      this.scene.add(this.textMesh);

      // On click call back
      this.textMesh.callback = () => {
        console.log("Text clicked");
      };

      // Initialize raycaster intersection detection
      this.raycaster = new THREE.Raycaster();
      this.mousePos = new THREE.Vector2();
      this.intersected = null;

      // Showing all
      document.querySelector("#scene").style.display = "block";
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
      <div className="page lost">
        <div className="loading">
          <i className="fas fa-spin fa-sync" />
        </div>
        <div id="scene"></div>
      </div>
    );
  }
}
