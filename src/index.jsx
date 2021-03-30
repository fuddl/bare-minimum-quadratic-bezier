import React, { useState, useEffect, useRef } from 'react'

const collides = (first, second) => {
  return first.x < second.x + second.width &&
         first.x + first.width > second.x &&
         first.y < second.y + second.height &&
         first.y + first.height > second.y
}


const TextMarker = ({
    x,
    y,
    color,
    fontFamily,
    gap,
    i,
    id,
    label,
    opacity,
    pointer,
    size,
    transforms,
    yOffset,
    layouts,
  }) => {
  opacity ||= 1
  size ||= 16
  pointer ||= '•'
  gap ||= size/2
  yOffset ||= size/3
  layouts ||= ['east', 'west', 'south', 'north']
  const domId = `${id}-${i}`

  const markerRef = useRef()

  let refs = {}
  for (let layout of layouts) {
    refs[layout] = useRef()
  }

  const debuger = (expr) => {
    if (domId === "Luyten's Star-0") {
      //console.debug(expr)
    }
  }

  const [ visible, setVisible ] = useState(false)

  const checkOverlab = () => {
    const allTexts = markerRef.current.viewportElement.querySelectorAll(`[data-layout] > [data-text-marker-label]:not([opacity="0"])`)
    debuger('checking overlab --------------------------------')
    for (let layout of layouts) {
      debuger('tring layout ' + layout)
      let noCollision = true
      let thisBox = refs[layout].current.getBBox()
      for(let text of allTexts) {
        if (noCollision && text.parentNode.getAttribute('id') === domId) {
          // if we get to this point, it means there was no collision above 
          // so we can set the current layout to visible.
          setVisible(layout)
          debuger('found myself')
          return
        }
        let otherBox = text.getBBox()
        debuger('other id ' + text.parentNode.getAttribute('id'))
        if (collides(thisBox, otherBox) && text.parentNode.getAttribute('id') !== domId) {
          debuger('collision detected with ' + text.parentNode.getAttribute('id'))
          debuger(refs[layout].current)
          debuger(text)
          noCollision = false
        }
      }
      if (noCollision) {
        debuger('no collision detected')
        debuger('enabling layout ' + layout)
        setVisible(layout)
        return
      }
    }
    debuger('no layout suitable')
    setVisible(false)
  }

  useEffect(() => {
    checkOverlab()
  }, [x,y])

  const tx = transforms.tx(x)
  const ty = transforms.ty(y)+yOffset

  let labelX, labelAnchor

  const metrics = {
    east: {
      x: tx + gap,
      y: ty,
      anchor: 'start',
    },
    west: {
      x: tx - gap,
      y: ty,
      anchor: 'end',
    },
    north: {
      x: tx,
      y: ty - gap,
      anchor: 'middle',
    },
    south: {
      x: tx,
      y: ty + gap,
      anchor: 'middle',
    },
  }

  return (
    <g
      fill={color}
      fontSize={size}
      fontFamily={fontFamily}
      id={domId}
      ref={markerRef}
      data-layout={visible}
    >
      <text
        x={tx}
        y={ty}
        textAnchor="middle"
        data-text-marker-pointer={true}
      >
        {pointer}
      </text>
      {layouts.map((layout) => (
        <text
          x={metrics[layout].x}
          y={metrics[layout].y}
          ref={refs[layout]}
          key={layout}
          opacity={visible === layout ? opacity : 0}
          textAnchor={metrics[layout].anchor}
          data-text-marker-label={true}
        >
          {label}
        </text> 
      ))}
    </g>
  )
}

const textMarkerPlugin = {
  textMarker: (element, transforms) => {
    const {
      size,
      color,
      opacity,
      id,
      label,
      pointer,
      fontFamily,
      yOffset,
      layout,
    } = element
    return element.x.map((x, i) => (
      <TextMarker
        {...{
          x,
          y: element.y[i],
          color,
          fontFamily,
          i,
          id,
          label,
          opacity,
          pointer,
          size,
          transforms,
          yOffset,
          layout,
        }}
        key={`${id}-${i}`}
      />
    ))
  }
}

export default textMarkerPlugin
