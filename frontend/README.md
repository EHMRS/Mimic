# ModernMimic

This is the web-based, fully javascript Modern Mimic display for EHMRS.

## Versioning
This project follows [semantic versioning v2.0.0](https://semver.org/spec/v2.0.0.html)

The most stable version will always be available under the `stable` branch.

## License
This project is licesed under the MIT license. See `LICENSE` for details.

## Building
The system is written in JavaScript and CSS, and built using Laravel Mix

To kick off a build, first install the node dependancies: `npm install`

Once those have been installed, run `npx mix --production`. This creates a
minified build of the system. Files will be created in the dist folder.
