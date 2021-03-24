import React, { useState } from 'react'
import BareMinimum2d from 'bare-minimum-2d'
import renderScene from '@mithi/bare-minimum-3d'
import catalog from './catalog.json'
import textMarker from 'bare-minimum-text-marker'

console.debug(textMarker)

const sceneSettings = {
  cubeRange: 20,
  cubeZoffset: 0,
  dataXoffset: 0,
  dataYoffset: 0,
  dataZoffset: .25,
  paperXrange: window.innerWidth,
  paperYrange: window.innerHeight,
}

const sceneOptions = {
  paper: false,
  xyPlane: false,
  sceneEdges: { color: "#607D8B", opacity: 1 },
  crossLines: false,
}

const emptySceneOptions = {
  paper: false,
  xyPlane: false,
  sceneEdges: false,
  crossLines: false,
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
    sceneOptions,
    [],
  )

  let points = [
    data[0]
  ]
  for (let star of catalog) {
    let { data } = renderScene(
      viewSettings,
      sceneSettings,
      emptySceneOptions,
      [{
        type: 'points',
        x: [star.location.x],
        y: [star.location.y],
        z: [star.location.z],
      }],
    )

    points.push({
      ...data[0],
      label: star.name,
      id: star.name,
      type: 'textMarker',
      size: 1,
      opacity: 1,
      color: 'white',
      size: 2,
    })
  }

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
        setRotateY(e.clientX/3)
        setRotateX(e.clientY/3)
      }}
    >
      <BareMinimum2d
        container={{
          color: 'black',
          opacity: 'black',
          xRange: 1000,
          yRange: 2000
        }}
        data={points}
        plugins={[textMarker]}
      />
    </div>
  )
}


export default App
