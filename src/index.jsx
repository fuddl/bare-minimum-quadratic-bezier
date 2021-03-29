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
    layout,
  }) => {
  const labelRef = useRef()
  opacity ||= 1
  size ||= 16
  pointer ||= '•'
  gap ||= size/2
  yOffset ||= size/3
  layout ||= 'east'

  const [ visible, setVisible ] = useState(false)

  const checkOverlab = () => {
    const allTexts = labelRef.current.viewportElement.querySelectorAll('[data-text-marker-label]')
    let thisBox = labelRef.current.getBBox()
    for(let text of allTexts) {
      if (labelRef.current === text) {
        setVisible(true)
        return
      }
      let otherBox = text.getBBox()
      if (collides(thisBox, otherBox)) {
        setVisible(false)
        return
      }
    }
    setVisible(true)
  }

  useEffect(() => {
    checkOverlab()
  }, [x,y])

  const tx = transforms.tx(x)
  const ty = transforms.ty(y)+yOffset

  let labelX, labelAnchor

  switch (layout) {
    case 'east':
      labelX = tx + gap
      labelAnchor = 'start'
      break;
    case 'west':
      labelX = tx - gap
      labelAnchor = 'end'
      break;
  }

  return (
    <g
      fill={color}
      fontSize={size}
      fontFamily={fontFamily}
      id={`${id}-${i}`}
    >
      <text
        x={tx}
        y={ty}
        textAnchor="middle"
        data-text-marker-pointer={true}
      >
        {pointer}
      </text>
      <text
        x={labelX}
        y={ty}
        ref={labelRef}
        opacity={visible ? opacity : 0}
        textAnchor={labelAnchor}
        data-text-marker-label={true}
      >
        {label}
      </text>
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
