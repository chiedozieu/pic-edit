"use client";

import { CanvasContext } from "@/context/context";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { Loader2, Monitor } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { RingLoader } from "react-spinners";
import CanvasEditor from "./_components/canvas";

const Editor = () => {
  const [canvasEditor, setCanvasEditor] = useState(null);
  const [processingMessage, setProcessingMessage] = useState(null);
  const [activeTool, setActiveTool] = useState("resize");
  const params = useParams();
  const projectId = params.projectId;

  const {
    data: project,
    isLoading,
    error,
  } = useConvexQuery(api.projects.getProject, {
    projectId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-cyan-400" />
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!project || error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-white text-2xl font-bold mb-2">
            Project not found
          </h1>
          <p className="text-white/70">
            The project you are looking for does not exist or you do not have
            permission to view it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <CanvasContext.Provider
      value={{
        canvasEditor,
        setCanvasEditor,
        processingMessage,
        setProcessingMessage,
        onToolChange: activeTool,
        setActiveTool,
      }}
    >
      <div className="lg:hidden min-h-screen flex items-center justify-center">
        <div className="text-center mx-w-md">
          <Monitor className="size-16 text-cyan-400 mb-6 mx-auto" />
          <h1 className="text-4xl font-bold text-white mb-4">
            Desktop Required
          </h1>
          <p className="text-white/70 text-lg mb-2">
            {" "}
            To edit this project, you need to open this page on your desktop.
          </p>
        </div>
      </div>
      <div className="hidden lg:block min-h-screen bg-slate-900">
        <div className="flex flex-col h-screen">
          {processingMessage && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center">
              <div className="rounded-lg p-6 flex flex-col items-center gap-4">
                <RingLoader color="white" size={40} />
                <div className="text-center">
                  <p className="text-white font-medium">{processingMessage}</p>
                  <p className="text-white/70 text-sm mt-1">
                    Please wait do not close this window
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* top bar */}
          <div className="flex flex-1 overflow-hidden">
            {/* sidebar */}
            <div className="flex-1 bg-slate-800">
              {/* canvas */}
              <CanvasEditor project={project} />
            </div>
          </div>
        </div>
      </div>
    </CanvasContext.Provider>
  );
};

export default Editor;
