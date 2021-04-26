import React, { useState, useEffect, useRef } from 'react'

const QuadraticBezier = {
  QuadraticBezier: (element, transforms) => {
    const {
      size,
      color,
      opacity,
      id,
      attributes,
    } = element
    let points = element.x.map((x, i) => {
      const currentX = transforms.tx(x)
      const currentY = transforms.ty(element.y[i])
      if (i == 0) {
        return `M ${currentX},${currentY}`
      }
      if (i % 2 == 0) {
        return `${currentX},${currentY}`
      } else {
        return `S ${currentX},${currentY}`
      }
    }).join(' ')
    return (
      <path
        d={points}
        key={id}
        stroke={color}
        fill="transparent"
        strokeWidth={size}
        {...attributes}
      />
    )
  }
}

export default QuadraticBezier
