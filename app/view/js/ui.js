let previousStep = 15;


window.stepSequencer.transport((event, currentStep) => updateTransport(currentStep));
window.stepSequencer.setRhythmDisplay((event, rhythm) => updateRhythm(rhythm));
window.stepSequencer.setActiveTrack((event, track) => updateTrack(track));
window.stepSequencer.setMelodyDisplay((event, melody) => updateMelody(melody));


const updateTransport = (currentStep) => {
  document.querySelector(`#sequencer-steps .step-${previousStep}`).classList.remove("current");
  document.querySelector(`#sequencer-steps .step-${currentStep}`).classList.add("current");
  previousStep = currentStep;
}


const updateRhythm = (rhythm) => {
  rhythm.forEach((step, i) => {
    if (step == 0) {
      document.querySelector(`#sequencer-steps .step-${i} span`).classList.remove("on");
    } else {
      document.querySelector(`#sequencer-steps .step-${i} span`).classList.add("on");
    }
  });
}


const updateMelody = (melody) => {
  document.querySelector("#track-melody span").textContent = melody.join(" ");
}


const updateTrack = (track) => {
  document.querySelector("#track-name span").textContent = track.name;
  updateRhythm(track.rhythm);
  updateMelody(track.melody);
}
