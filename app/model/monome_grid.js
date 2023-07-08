const fs        = require("fs");
const path      = require("path");
const yaml      = require("js-yaml");
const serialosc = require("serialosc");


const CONFIG_DIRECTORY = path.resolve(__dirname, "../../config");
const blank16x1Row = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


class MonomeGrid {
  device = undefined;
  daw = undefined;
  melodyRecording = 0;
  queuedMelody = new Array();


  constructor(abletonLive) {
    this.daw = abletonLive;
  }


  /**
    * This is fundamentally the same code as the monome website's grid studies.
    */
  async connect() {
    const config = yaml.load(
      fs.readFileSync(
        path.resolve(CONFIG_DIRECTORY, "grid.yml"),
        "utf8"
      )
    );

    return new Promise((resolve, reject) => {
      let addEvent = config.serial + ":add";

      serialosc.start({ startDevices: false });

      serialosc.on(addEvent, (device) => {
        if (this.device)           return;
        if (device.type != 'grid') return;

        this.device = device;
        this.device.on('initialized', () => this.device.on('key', (press) => this.keyPress(press)));
        this.device.start();

        resolve(`Connected to ${this.device.model} ${this.device.id} on ${this.device.deviceHost}:${this.device.devicePort}`);
      });
    });
  }


  keyPress(press) {

    // Ignore button releases
    if (press.s == 0) return;

    if (press.y == 0) {

      // Row 1 (Row Index 0): Update the rhythm for the active track
      this.daw.getActiveTrack().updateRhythm(press.x);

    } else if (press.y == 7 && press.x >= 0 && press.x <= 3) {

      // Row 8 (Row Index 7), Buttons 1-4: select active track
      this.#activateTrack(press.x);

    } else if (press.y == 7 && press.x == 14) {

      // Flush Melody to Live
      if (this.queuedMelody.length > 0) {
        this.daw.getActiveTrack().setMelody(this.queuedMelody);
      }

    } else if (press.y == 7 && press.x == 15) {

      // Toggle Melody Recording Mode
      this.melodyRecording = !this.melodyRecording;
      this.levelSet(15, 7, this.melodyRecording ? 10 : 0);

      if (this.melodyRecording) this.queuedMelody = new Array();

    } else if (press.y >= 1 && press.y <= 6 && press.x <= 11) {

      // Rows 2-7, Buttons 1-12: Chromatic Keyboard
      if (this.melodyRecording) {
        // Store the current key press in the currently accumulating melody as a number pair:
        // press.x = MIDI note index within a single octave (e.g., C = 0, C# = 1...)
        // press.y = MIDI octave number, oriented so Row 1 (highest vertically on grid) is octave 6
        //           and Row 7 (lowest vertically on the grid) is octave 1
        this.queuedMelody.push([press.x, 6 - press.y + 1]);
      }

    } else if (press.y == 6 && press.x == 15) {

      // Toggle self-replicating melody algorithm
      this.daw.getActiveTrack().selfReplicatingMelody = !this.daw.getActiveTrack().selfReplicatingMelody;
      this.levelSet(press.x, press.y, this.daw.getActiveTrack().selfReplicatingMelody ? 10 : 0);

    }
  }


  #activateTrack(trackIndex) {
    // First, turn off the button for the current track, then turn on the button for the newly selected track
    this.levelSet(this.daw.activeTrack, 7, 0);
    this.levelSet(trackIndex, 7, 10);

    // Then, activate the track and refresh the grid and UI displays
    this.daw.activeTrack = trackIndex;
    this.levelSet(15, 6, this.daw.getActiveTrack().selfReplicatingMelody ? 10 : 0);
    this.displayTransport();
    this.daw.electronUi.webContents.send(
      "update-track",
      // Note that due to the Electron security model, the AbletonTrack object cannot be serialized. Creating
      // a simple object that is passed thru the context bridge.
      {
        name: this.daw.getActiveTrack().name,
        rhythm: this.daw.getActiveTrack().rhythm,
        melody: this.daw.getActiveTrack().displayMelody,
        melodyType: this.daw.getActiveTrack().selfReplicatingMelody ? "Self-replicating" : "Simple"
      }
    );
  }


  clearGridDisplay(rowCount = 7) {
    for (let y = 0; y < rowCount; y++) {
      this.levelRow(0, y, blank16x1Row.slice(0, 8));
      this.levelRow(8, y, blank16x1Row.slice(8, 16));
    }
  }


  displayTransport(highlightIndex) {
    let row = this.daw.getActiveTrack().rhythm.map(step => step == 1 ? 10 : 0);
    if (highlightIndex != undefined) row[highlightIndex] = 15;

    this.levelRow(0, 0, row.slice(0, 8));
    this.levelRow(8, 0, row.slice(8, 16));
  }


  levelSet(x, y, s) {
    this.device.levelSet(x, y, s);
  }


  levelRow(xOffset, y, row) {
    this.device.levelRow(xOffset, y, row);
  }
}


module.exports = MonomeGrid;
