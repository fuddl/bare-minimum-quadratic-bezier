# Bare minimum text marker

A plugin for [bare-minimum-2d](https://www.npmjs.com/package/bare-minimum-2d) for plotting points with text labals.

![](./example/public/favicon.svg)

## How to use it

```jsx

import BareMinimum2d from 'bare-minimum-2d'
import textMarker from 'bare-minimum-text-marker'

function Space() {

  let points = [{
    x: [496],
    y: [1014],
    label: 'Alpha Centauri',
    id: 'alpha-cent',
    type: 'textMarker',
    size: 1,
    opacity: 1,
    color: 'white',
    size: 2,
  }]

  return (
    <BareMinimum2d
      data={points}
      plugins={[textMarker]}
    />
  )
}

```
