# Grid + Electron + Live

A reference implementation app that connects a monome grid to Ableton Live. This app is a companion to the [Monome Grid + Electron + Live Tutorial](https://tablesandwaves.github.io/grid-electron-live/). Note that for this app to run you need Ableton Live with Max for Live and the Monome grid hardware.

## Installing

Clone this repository and run `npm install` from the root directory. Be sure to configure your grid's serial number.

```bash
$ cp config/grid.yml.example config/grid.yml
```

## Running the App in Development Mode

Run the app in development mode using the `start` command:

```bash
$ npm start
```

Once the app is running for the first time, you will need to configure the "monome in" MIDI port it establishes to send MIDI clock data from Live. See the tutorial's [step 3 instructions](https://tablesandwaves.github.io/grid-electron-live/step-3-connect-to-live.html). After configuration is setup in Live it is recommended that you quit the Electron app and restart it.

## License

The gem is available as open source under the terms of the [ISC License](https://opensource.org/license/isc-license-txt/).
