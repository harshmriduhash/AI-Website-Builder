import {
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  FolderTree,
} from "lucide-react";
import React, { useState } from "react";

export interface IFileFolder {
  name: string;
  type: string;
  children?: IFileFolder[];
  path: string;
  content?: string;
  onFileSelect?: (content: string) => void;
}

interface IFileExplorer {
  onFileSelect: (content: string) => void;
  files: IFileFolder[];
}

function FileFolder({
  children,
  type,
  name,
  content,
  onFileSelect,
}: IFileFolder) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <>
      {type === "folder" ? (
        <div className="cursor-pointer">
          <h3
            className="text-sm mt-5 flex gap-2"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              setIsCollapsed(!isCollapsed);
            }}
          >
            {isCollapsed ? <ChevronDown /> : <ChevronRight />}
            <Folder color="lightblue" /> {name}
          </h3>
          {isCollapsed && (
            <div className="pl-6">
              {children?.map((child, index) => {
                return (
                  <FileFolder
                    key={`${child.path}-${index}`}
                    path={child.path}
                    name={child.name}
                    type={child.type}
                    children={child.children}
                    content={child.content}
                    onFileSelect={onFileSelect}
                  />
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div
          className="cursor-pointer"
          onClick={() => {
            onFileSelect && onFileSelect(content ?? "");
          }}
        >
          <h3 className="text-sm mt-5 flex gap-2 pl-7">
            <File color="orange" /> {name}
          </h3>
        </div>
      )}
    </>
  );
}

export const FileExplorer = ({ onFileSelect, files }: IFileExplorer) => {
  return (
    <div className="text-white shadow-xl h-[100vh] overflow-auto">
      <h2 className="text-md font-bold italic mt-5 flex gap-2">
        <FolderTree /> EXPLORER
      </h2>
      {files.map((file) => {
        return (
          <FileFolder
            key={file.path}
            path={file.path}
            children={file.children}
            type={file.type}
            name={file.name}
            content={file.content}
            onFileSelect={onFileSelect}
          />
        );
      })}{" "}
    </div>
  );
};
