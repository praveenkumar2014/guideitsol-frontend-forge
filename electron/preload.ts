import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  getTheme: () => ipcRenderer.invoke("get-theme"),
  platform: process.platform,
  isElectron: true,
});
