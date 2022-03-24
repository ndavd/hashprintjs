<p align="center">
  <img src=".github/hashprintjs_SHA256.png" width="150" />
  <img src=".github/hashprintjs_SHA384.png" width="150" />
  <img src=".github/hashprintjs_SHA512.png" width="150" />
</p>

<h1 align="center">HashprintJS</h1>

HashprintJS is a small npm package written in TypeScript that generates
customizable [identicons](https://en.wikipedia.org/wiki/Identicon).

Provide a username, wallet address, IP address or really any `string` you want
and you'll get the `Data URL` of its **hashprint** - _a pretty 7x7 bi-color
image that allows you to easily distinguish and identify a piece of data._

Supports both client and server (making use of the **Canvas API** and
**node-canvas**, respectively).

### Installation
```
$ yarn add hashprintjs
```

### Usage
```js
const hashprint = require("hashprintjs");
const dataURL = await hashprint({ data: "hashprint", size: 40 });
```
You can then take the `dataURL` and assign it to an image src for example.

### Customization
The function takes an object as argument which has the following properties:
| Properties    | Description                                                                                                                                                                                                                                                   |
|---------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `data`        | `string` - The data that generates the hashprint.                                                                                                                                                                                                             |
| `size?`       | `number` (_default:_ **140**) - The dimensions of the hashprint, in px.                                                                                                                                                                                       |
| `bg?`         | `string` (_default:_ **"#00000000"**) - The background color of the hashprint, CSS color format.                                                                                                                                                              |
| `saturation?` | `number` (_default:_ **0.7**) - The saturation value of the hashprint colors, from 0 to 1.                                                                                                                                                                    |
| `lightness?`  | `number` (_default:_ **0.5**) - The lightness value of the hashprint colors, from 0 to 1.                                                                                                                                                                     |
| `likeness?`   | `[number, number]` (_default:_ **[0.50, 0.25]**) - The probability of a cell to get color 1 and color 2 respectively. From 0 to 1, the sum can't be greater than 1 (the remaining value corresponds to the probability of getting an empty cell, background). |
| `algorithm?`  | `string` (_default:_ **"SHA-256"**) - The algorithm used to get the hash of the data. The supported algorithms are SHA-256, SHA-384 and SHA-512.                                                                                                              |
