import { WebContainer } from "@webcontainer/api";
import { useEffect, useState } from "react";

const useWebContainers = () => {
  const [webContainerInstance, setWebContainerInstance] =
    useState<WebContainer>();
  async function bootWebContainer() {
    setWebContainerInstance(await WebContainer.boot());
  }
  async function installDependencies() {
    // Install dependencies
    const installProcess = await webContainerInstance?.spawn("npm", [
      "install",
    ]);
    // Wait for install command to exit
    return installProcess?.exit;
  }
  async function startApp() {
    // Install dependencies
    const installProcess = await webContainerInstance?.spawn("npm", [
      "run dev",
    ]);
    // Wait for install command to exit
    return installProcess?.exit;
  }
  useEffect(() => {
    bootWebContainer();
  }, []);
  return { webContainerInstance, installDependencies, startApp };
};

export default useWebContainers;
