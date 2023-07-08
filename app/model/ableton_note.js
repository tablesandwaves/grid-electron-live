class AbletonNote {

  constructor(midiNote, clipPosition, duration, velocity, probability) {
    this.midiNote = midiNote;
    this.clipPosition = clipPosition;
    this.duration = duration;
    this.velocity = velocity;
    this.probability = probability == undefined ? 1.0 : probability;
  }


  toOscNote() {
    return [
      {type: "integer", value: this.midiNote},
      {type: "float",   value: this.clipPosition},
      {type: "float",   value: this.duration},
      {type: "float",   value: this.velocity},
      {type: "float",   value: this.probability}
    ];
  }
}


module.exports = AbletonNote;
