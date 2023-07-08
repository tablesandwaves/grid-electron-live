const { contextBridge, ipcRenderer } = require("electron");


contextBridge.exposeInMainWorld("stepSequencer", {
  transport: (callback) => ipcRenderer.on("transport", callback),
  setRhythmDisplay: (callback) => ipcRenderer.on("update-rhythm", callback),
  setActiveTrack: (callback) => ipcRenderer.on("update-track", callback),
  setMelodyDisplay: (callback) => ipcRenderer.on("update-melody", callback)
});
