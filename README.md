# Grid + Electron + Live

A reference implementation app that connects a monome grid to Ableton Live. This app is a companion to the [Monome Grid + Electron + Live Tutorial](https://tablesandwaves.github.io/grid-electron-live/). Note that for this app to run you need Ableton Live with Max for Live and the Monome grid hardware.

While you can technically install this app and its related Max for Live component (see below), you will probably need to review the tutorial to understand how the grid's tactile interface has been programmed and see how to set up a Live set with the required tracks.

## Installing

Clone this repository and run `npm install` from the root directory. Be sure to configure your grid's serial number.

```bash
$ cp config/grid.yml.example config/grid.yml
```

Then you will also need to create and save the simple (3 object) the Max for Live device into your Ableton Live presets. See [step 5 instructions](https://tablesandwaves.github.io/grid-electron-live/step-5-live-note-integration.html) from the tutorial for how to create the Max for Live device, including the JavaScript file it uses.

## Running the App in Development Mode

Run the app in development mode using the `start` command:

```bash
$ npm start
```

Once the app is running for the first time, you will need to configure the "monome in" MIDI port it establishes to send MIDI clock data from Live. See the tutorial's [step 3 instructions](https://tablesandwaves.github.io/grid-electron-live/step-3-connect-to-live.html). After configuration is setup in Live it is recommended that you quit the Electron app and restart it.

## License

The code is available as open source under the terms of the [ISC License](https://opensource.org/license/isc-license-txt/).
