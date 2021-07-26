![Screenshot](/screenshot.jpg?raw=true "Screenshot")

Author:
- Alan Zhao, azhao6060@gmail.com
- https://www.MakerAL.com
- See article https://www.makeral.com/makes/virtual-human-muscle-anatomy-electron-react-threejs-app/ 

Prerequisites
- Node v14
- Run `yarn install && yarn build`

To start development in Electron
- Run `yarn dev`

To start development in browser. This is not possible if you're using modules like `fs` and `mysql`
- Run `yarn start`

To build
- Run `yarn build`

To test
- Run `yarn test`

To generate coverage report
- Run `yarn cover`

To package
- Run `yarn package`

How to use this project?
- Fork and clone
- Edit app info in package.json
- Edit port # in package.json
- Edit app info public/manifest.json
- Edit title in public/index.html
- Update src/images/logo.svg and splash screen design in public/index.html

License
- Licensed under GPL
