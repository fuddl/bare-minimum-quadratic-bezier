import React, { useState, useEffect, useRef } from 'react';

const TextMarker = ({ x, y, transforms, size, color, opacity, id, i, label }) => {
  const labelRef = useRef()
  const opacity ||= 1

  const [ visible, setVisible ] = useState(false)

  useEffect(() => {
    const allTexts = document.querySelectorAll('text')
    let rect1 = labelRef.current.getBBox()
    for(let text of allTexts) {
      if (labelRef.current === text) {
        setVisible(true)
        return
      }
      let rect2 = text.getBBox()
      let opacity = text.getAttribute('opacity')
      if (opacity != 0 && rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y) {
        setVisible(false)
        return
      }
    }
    setVisible(true)
  }, [x,y]);

  return (
    <g id={`${id}-${i}`}>
      <circle
        {...{
          opacity,
          cx: transforms.tx(x),
          cy: transforms.ty(y),
          r: size,
          fill: color
        }}
      />
      <text ref={labelRef} x={transforms.tx(x)} y={transforms.ty(y)} fill={color} opacity={visible ? opacity : 0}>
        <tspan dx={6} dy={5}>{label}</tspan>
      </text>
    </g>
  )
}

const textMarkerPlugin = {
  textMarker: (element, transforms) => {
    const { size, color, opacity, id, label } = element
    return element.x.map((x, i) => (
      <TextMarker
        {...{
          x,
          y: element.y[i],
          size,
          color,
          opacity,
          id,
          label,
          i,
          transforms
        }}
        key={`${id}-${i}`}
      />
    ))
  }
}


export default textMarkerPlugin