import { FileExplorer, IFileFolder } from "@/components/FileExplorer";
import Steps, { IStep } from "@/components/Steps";
import { Textarea } from "@/components/ui/textarea";
import { BACKEND_API_URL } from "@/config";
import useWebContainers from "@/hooks/useWebContainers";
import { parseXml } from "@/lib/parseSteps";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Builder = () => {
  const location = useLocation();
  const { webContainerInstance } = useWebContainers();
  const { userInitialPrompt } = (location.state as {
    userInitialPrompt: string;
  }) ?? {
    userInitialPrompt: "",
  };
  const [steps, setSteps] = useState<IStep[]>([]);
  const [files, setFiles] = useState<IFileFolder[]>([]);

  const [fileContent, setFileContent] = useState<string>("");

  async function getInitialFiles() {
    const templateResponse = await axios.post(`${BACKEND_API_URL}/template`, {
      prompt: userInitialPrompt.trim(),
    });
    const { prompts, uiPrompts } = templateResponse.data;
    setSteps(parseXml(uiPrompts[0]));
    const chatResponse = await axios.post(`${BACKEND_API_URL}/chat`, {
      messages: [...prompts, userInitialPrompt].map((prompt) => ({
        role: "user",
        content: prompt,
      })),
    });
    setSteps((step) => [...step, ...parseXml(chatResponse?.data?.response)]);
  }

  useEffect(() => {
    if (!steps.length) getInitialFiles();
  }, []);

  useEffect(() => {
    if (!steps.some(({ status }) => status === "pending")) {
      return; // Exit early if no pending steps
    }

    // Create a shallow copy of the file structure
    const updatedFiles = [...files];

    for (const step of steps) {
      if (step.status !== "pending" || !step.path) continue;

      const parsedPath = step.path.split("/");
      let currentFolder = updatedFiles;

      for (let i = 0; i < parsedPath.length; i++) {
        const currentName = parsedPath[i];
        const isLast = i === parsedPath.length - 1;
        const currentPath = parsedPath.slice(0, i + 1).join("/");

        // Find the node in the current folder
        let node = currentFolder.find((item) => item.name === currentName);

        if (!node) {
          // Create a new folder or file
          node = {
            name: currentName,
            type: isLast ? "file" : "folder",
            path: currentPath,
            ...(isLast ? { content: step.code ?? "" } : { children: [] }),
          };

          currentFolder.push(node); // Add the node to the current folder
        }

        if (isLast) {
          // Update content for files
          node.content = step.code ?? "";
        } else {
          // Navigate to the children array for folders
          if (!node.children) {
            node.children = [];
          }
          currentFolder = node.children;
        }
      }
    }

    // Update the state
    setFiles(updatedFiles);
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.status === "pending" ? { ...step, status: "completed" } : step
      )
    );
  }, [steps, files]);

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-3 bg-gray-800">
        <Steps steps={steps ?? []} />
        <Textarea
          className="fixed bottom-4 mx-2 w-[24vw] "
          placeholder="Type your message here."
        />
      </div>
      <div className="col-span-3 bg-gray-800 px-2">
        <FileExplorer
          onFileSelect={(content) => setFileContent(content)}
          files={files}
        />
      </div>
      <div className="col-span-6">
        <Editor
          height="100vh"
          theme="vs-dark"
          defaultLanguage="typescript"
          value={fileContent ?? ""}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: "on",
            scrollBeyondLastLine: false,
            codeLens: true,
          }}
        />
      </div>
    </div>
  );
};

export default Builder;
