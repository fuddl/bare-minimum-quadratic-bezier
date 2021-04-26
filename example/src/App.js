import React, { useState } from 'react'
import BareMinimum2d from 'bare-minimum-2d'
import renderScene from '@mithi/bare-minimum-3d'
import quadraticBezier from 'bare-minimum-quadratic-bezier'

const sceneSettings = {
  cubeRange: 20,
  cubeZoffset: 0,
  dataXoffset: 0,
  dataYoffset: 0,
  dataZoffset: 0,
  paperXrange: window.innerWidth,
  paperYrange: window.innerHeight,
}

const sceneOptions = {
  paper: true,
  xyPlane: true,
  sceneEdges: { color: "#607D8B", opacity: 1 },
  crossLines: true,
}

const emptySceneOptions = {
  paper: { color: "#17212B", opacity: 1 },
  xyPlane: { color: "#0652DD", opacity: 0.1 },
  sceneEdges: { color: "#607D8B", opacity: 1 },
  crossLines: { color: "#795548", opacity: 1 },
}

const randomArray = (len) => {
  return Array.from({length: len}, () => Math.floor(Math.random() * 40) - 20)
} 

const random = {
  x: randomArray(18),
  y: randomArray(18),
  z: randomArray(18),
} 

function App() {
  const [zoom, setZoom] = useState(2);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const viewSettings = {
    camTx: 0,
    camTy: 0,
    camTz: 0,
    cubeRx: rotateX,
    cubeRy: 0,
    cubeRz: rotateY,
    camZoom: zoom,
    canvasToViewRatio: 300,
    defaultCamZoffset: 5,
    defaultCamOrientation: "z-forward-x-right",
  }

  let { data } = renderScene(
    viewSettings,
    sceneSettings,
    emptySceneOptions,
    [
      {
        opacity: 1.0,
        color: 'deepPink',
        size: 4,
        type: 'polygon',
        id: "random",
        fillColor: 'transparent',
        x: random.x,
        y: random.y,
        z: random.z,
        attributes: {
          strokeLinejoin: "round",
        }
      },
    ],
  )

  data[3].type = 'QuadraticBezier'

  return (
    <div
      style={{ width: '100%', height: window.innerHeight }}
      onWheel={(e) => {
        let destZoom = zoom + (e.deltaY/100)
        if (destZoom > 0) {
          setZoom(destZoom)
        }
      }}
      onMouseMove={(e) => {
        setRotateY(-e.clientX/3)
        setRotateX(e.clientY/3)
      }}
    >
      <div className="intro">
        <p>
          This is a demo application of the 
          {' '}
          <a href="https://www.npmjs.com/package/bare-minimum-quadratic-bezier">bare-minimum-quadratic-bezier</a>
          {' '}
          plugin for
          {' '}
          <a href="https://github.com/mithi/bare-minimum-2d">
            bare-minimum-2d
          </a>
          {' '}
          and 
          {' '}
          <a href="https://github.com/mithi/bare-minimum-3d">
            3d
          </a>
          .
        </p>
        <p><a href="https://fuddl.github.io/bare-bare-minimum-quadratic-bezier/" onClick={(e)=> { e.preventDefault(); window.location.reload()}}>Refresh the page</a> for a new random shape.</p>
      </div>
      <BareMinimum2d
        container={{
          color: 'black',
          opacity: 'black',
          xRange: 1000,
          yRange: 2000
        }}
        data={data}
        plugins={[quadraticBezier]}
      />
    </div>
  )
}

export default App
