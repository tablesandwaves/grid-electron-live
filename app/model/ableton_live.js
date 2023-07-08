const OscEmitter   = require("osc-emitter");
const easymidi     = require("easymidi");
const MonomeGrid   = require("./monome_grid");
const AbletonTrack = require("./ableton_track");


class AbletonLive {
  // For a sequencer with a 16th note pulse, 4 measures will be one "super measure" to enable a 64 step sequence
  superMeasure = 4;
  // this instance variable is set to an Electron BrowserWindow object and provides the communication channel
  // for updating the UI
  electronUi = undefined;
  // this instance variable is set to a MonomeGrid object and provides the communication channel to the hardware
  controller = undefined;
  // Store the tracks
  tracks = new Array();
  // Keep track of the active track
  activeTrack = 0;
  // 16n step count
  step = 0;


  constructor() {
    // Communication to the grid hardware
    this.controller = new MonomeGrid(this);

    // Communication from Live for MIDI clock
    this.midiIn     = new easymidi.Input("monome in", true);

    // Communication to Live for sending notes
    this.emitter = new OscEmitter();
    this.emitter.add("localhost", 44444);

    ["Kick", "Snare", "HiHat", "Bass"].forEach(trackName => {
      this.tracks.push( new AbletonTrack(trackName, this) );
    });
  }


  getActiveTrack() {
    return this.tracks[this.activeTrack];
  }


  async connectToGrid() {
    const msg = await this.controller.connect();
    return msg;
  }


  async follow() {
    this.midiIn.on("clock", () => {
      this.ticks++;
      // 6 MIDI clock ticks equals a 16th note.
      if (this.ticks % 6 != 0) return;

      this.electronUi.webContents.send("transport", this.step % 16);
      this.controller.displayTransport(this.step % 16);
      this.step = this.step == this.superMeasure * 16 - 1 ? 0 : this.step + 1;
    });

    this.midiIn.on("start", () => {
    });

    this.midiIn.on("position", (data) => {
      if (data.value != 0) return;

      this.ticks = 0;
      this.step  = 0;
    });
  }


  setNotes(track) {
    const clipIndex = 0;
    const notes     = track.abletonNotes();

    try {
      this.emitter.emit(
        `/tracks/${this.activeTrack}/clips/${clipIndex}/notes`,
        ...notes.flatMap(note => note.toOscNote())
      );
    } catch (e) {
      console.error(e.name, e.message, "while sending notes to Live:");
      console.error("input notes:", notes);
      console.error("OSC mapped notes", ...notes.flatMap(note => note.toOscAddedNote()));
      console.error("trackIndex", trackIndex);
    }
  }
}


module.exports = AbletonLive;
