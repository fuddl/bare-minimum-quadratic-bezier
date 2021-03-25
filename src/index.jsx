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
    i,
    id,
    label,
    opacity,
    pointer,
    size,
    transforms,
  }) => {
  const labelRef = useRef()
  opacity ||= 1
  size ||= 16
  pointer ||= '•'

  const [ visible, setVisible ] = useState(false)

  useEffect(() => {
    const allTexts = document.querySelectorAll('text')
    let thisBox = labelRef.current.getBBox()
    for(let text of allTexts) {
      if (labelRef.current === text) {
        setVisible(true)
        return
      }
      let otherBox = text.getBBox()
      let opacity = text.getAttribute('opacity')
      if (opacity != 0 && collides(thisBox, otherBox)) {
        setVisible(false)
        return
      }
    }
    setVisible(true)
  }, [x,y])

  const tx = transforms.tx(x)
  const ty = transforms.ty(y)

  return (
    <text
      ref={labelRef}
      x={tx}
      y={ty}
      fill={color}
      fontSize={size}
      id={`${id}-${i}`}
    >
      <tspan dx={-size/4} dy={size/2}>{pointer}</tspan>
      {' '}
      <tspan
        fillOpacity={visible ? opacity : 0}
        strokeOpacity={visible ? opacity : 0}
      >
        {label}
      </tspan>
    </text>
  )
}

const textMarkerPlugin = {
  textMarker: (element, transforms) => {
    const { size, color, opacity, id, label, pointer } = element
    return element.x.map((x, i) => (
      <TextMarker
        {...{
          x,
          y: element.y[i],
          transforms,
          color,
          i,
          id,
          label,
          opacity,
          pointer,
          size,
        }}
        key={`${id}-${i}`}
      />
    ))
  }
}

export default textMarkerPlugin
