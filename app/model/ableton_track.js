const AbletonNote = require("./ableton_note");


const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];


class AbletonTrack {
  daw = undefined;
  name = undefined;
  rhythm = [0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0];
  melody = [60];
  displayMelody = ["C4"];


  constructor(name, abletonLive) {
    this.name = name;
    this.daw  = abletonLive;
  }


  updateRhythm(stepIndex) {
    // Flip the step's current value. If currently 0, set to 1; if 1, set to 0;
    this.rhythm[stepIndex] = 1 - this.rhythm[stepIndex];

    // Update the MIDI clip in Live
    this.daw.setNotes(this);

    // Update the grid display
    this.daw.controller.displayTransport();

    // Update the Electron UI display
    this.daw.electronUi.webContents.send("update-rhythm", this.rhythm);
  }


  setMelody(queuedMelody) {
    // Translate the note data pairs that look like [0, 3], meaning 0=C in the third octave to MIDI note number 36
    this.melody        = queuedMelody.map(noteData => noteData[0] + (noteData[1] * 12) + 24);
    this.displayMelody = queuedMelody.map(noteData => noteNames[noteData[0]] + noteData[1]);

    // Update the MIDI clip in Live
    this.daw.setNotes(this);

    // Update the Electron UI display
    this.daw.electronUi.webContents.send("update-melody", this.displayMelody);

  }


  abletonNotes() {
    const notes = new Array();
    let melodyIndex = 0;

    for (let i = 0; i < this.daw.superMeasure; i++) {
      const measureOffset = i * 4;
      this.rhythm.forEach((step, i) => {
        if (step == 1) {
          let midiNoteNumber = this.melody[melodyIndex % this.melody.length];
          melodyIndex++;

          notes.push( new AbletonNote(midiNoteNumber, ((i * 0.25) + measureOffset), 0.25, 64) )
        }
      });
    }

    return notes;
  }
}


module.exports = AbletonTrack;
