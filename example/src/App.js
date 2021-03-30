import React, { useState } from 'react'
import BareMinimum2d from 'bare-minimum-2d'
import renderScene from '@mithi/bare-minimum-3d'
import catalog from './catalog.json'
import textMarker from 'bare-minimum-text-marker'

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

    const labelSize = 16

    points.push({
      ...data[0],
      label: star.name,
      id: star.name,
      pointer: star.symbol ? star.symbol : null,
      type: 'textMarker',
      opacity: 1,
      size: labelSize, 
      yOffset: star.symbol !== '☉' ? labelSize/2.8 : labelSize/4, 
      color: 'white',
      layouts: data[0].x > 0 ? ['east', 'north', 'south', 'west'] : ['west', 'south', 'north', 'east'],
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
        setRotateY(-e.clientX/3)
        setRotateX(e.clientY/3)
      }}
    >
      <div className="intro">
        <p>
          This is a demo application of the 
          {' '}
          <a href="https://www.npmjs.com/package/bare-minimum-text-marker">bare-minimum-text-marker</a>
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
        <p>
          It allows you to place a text next to a point. The component
          makes sure that text does not overlap. 
        </p> 
        <p>
          This demo visualises the stellar neigborhood of the sun (☉). 
        </p> 
        <p>
          Data extracted from 
          {' '}
          <a href="https://www.wikidata.org/">wikidata</a>
          {' '}
          <small>(<a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0 License</a>)</small>
        </p> 
      </div>
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
