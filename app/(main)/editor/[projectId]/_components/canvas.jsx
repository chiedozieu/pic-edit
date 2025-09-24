"use client";

import { useCanvas } from "@/context/context";
import { api } from "@/convex/_generated/api";
import { useConvexMutation } from "@/hooks/use-convex-query";
import { Canvas, FabricImage } from "fabric";
import { Loader, Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const CanvasEditor = ({ project }) => {
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef();
  const containerRef = useRef();

  const { canvasEditor, setCanvasEditor, activeTool, setActiveTool } =
    useCanvas();

  const { mutate: updateProject } = useConvexMutation(
    api.projects.updateProject
  );

  const calculateViewportScale = () => {
    if (!containerRef.current || !project) return 1;

    const container = containerRef.current;
    const containerWidth = container.clientWidth - 40; // 40px for padding
    const containerHeight = container.clientHeight - 40;

    const scaleX = containerWidth / project.width;
    const scaleY = containerHeight / project.height;

    // Use the smaller scale factor to ensure the canvas fits within the container
    // cap at 1 to prevent overflow
    return Math.min(scaleX, scaleY, 1);
  };
  useEffect(() => {
    if (!canvasRef.current || !project || canvasEditor) return;

    const initializeCanvas = async () => {
      setIsLoading(true);

      const viewportScale = calculateViewportScale();

      const canvas = new Canvas(canvasRef.current, {
        width: project.width,
        height: project.height,

        backgroundColor: "#ffffff",

        preserveObjectStacking: true, // maintains layer order
        controlsAboveOverlay: true, // places controls above image
        selection: true, //  object selection

        hoverCursor: "move", // cursor when hovering over an object
        moveCursor: "move", // cursor when moving an object
        defaultCursor: "default", // default cursor

        allowTouchScrolling: false, // disable touch scrolling

        renderOnAddRemove: true, // render canvas when an object is added or removed
        skipTargetFind: false, // allows object targeting for interaction
      });

      canvas.setDimensions(
        {
          width: project.width * viewportScale,
          height: project.height * viewportScale,
        },
        {
          backstoreOnly: true,
        }
      );
      canvas.setZoom(viewportScale); // apply zoom to scale the entire canvas content

      const scaleFactor = window.devicePixelRatio || 1;
      if (scaleFactor > 1) {
        // increase canvas resolution
        canvas.getElement().width = project.width * scaleFactor;
        canvas.getElement().height = project.height * scaleFactor;

        // scale the drawing context to match the increased resolution
        canvas.getContext().scale(scaleFactor, scaleFactor);
      }
      if (project.currentImageUrl || project.originalImageUrl) {
        try {
          // use current image if available (may have transformations applied), otherwise use original image
          const imageUrl = project.currentImageUrl || project.originalImageUrl;

          const fabricImage = await FabricImage.fromURL(imageUrl, {
            crossOrigin: "anonymous", // allow cross-origin requests for loading external images
          });

          // calculate scaling to fit image within canvas within canvas while maintaining aspect ratio
          const imageAspectRatio = fabricImage.width / fabricImage.height;
          const canvasAspectRatio = project.width / project.height;

          let scaleX;
          let scaleY;

          if (imageAspectRatio > canvasAspectRatio) {
            // image is wider than canvas- scale by width
            scaleX = project.width / fabricImage.width;
            scaleY = scaleX; // maintain aspect ratio
          } else {
            // image is taller than canvas- scale by height
            scaleY = project.height / fabricImage.height;
            scaleX = scaleY;
          }

          fabricImage.set({
            left: project.width / 2, // center the image, horizontally
            top: project.height / 2, // center the image, vertically
            originX: "center", // transform origin at center
            originY: "center", // transform origin at center
            scaleX, // horizontal scaling
            scaleY, // vertical scaling
            selectable: true, // enable select/move image
            evented: true, // enable mouse/touch events
          });
          // add image to canvas and ensure it's centered
          canvas.add(fabricImage);
          canvas.centerObject(fabricImage);
        } catch (error) {
          console.log("Error loading image:", error);
        }
      }
      if (project.canvasState) {
        try {
          // load json state- this will restore all objects and their properties
          await canvas.loadFromJSON(project.canvasState);
          canvas.requestRenderAll(); // force canvas to re-render after loading state
        } catch (error) {
          console.error("Error loading canvas state:", error);
        }
      }
      canvas.calcOffset();
      canvas.requestRenderAll();
      setCanvasEditor(canvas);

      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 500);

      setIsLoading(false);
    };

    initializeCanvas();

    return () => {
      if (canvasEditor) {
        canvasEditor.dispose();
        setCanvasEditor(null);
      }
    };
  }, [project]);

  const saveCanvasState = async () => {
    if (!canvasEditor || !project) return;
    try {
      const canvasJSON = canvasEditor.toJSON();
      await updateProject({
        projectId: project._id,
        canvasState: canvasJSON,
      });
    } catch (error) {
      console.error("Error saving canvas state:", error);
    }
  };

  useEffect(() => {
    if (!canvasEditor) return;
    let saveTimeout;
    // debounce save function to save canvas state every 5 seconds
    const handleCanvasChange = () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        saveCanvasState();
      }, 5000);
    };
    // listen for canvas changes events
    canvasEditor.on("object:modified", handleCanvasChange);
    canvasEditor.on("object:added", handleCanvasChange);
    canvasEditor.on("object:removed", handleCanvasChange);

    return () => {
      clearTimeout(saveTimeout);
      canvasEditor.off("object:modified", handleCanvasChange);
      canvasEditor.off("object:added", handleCanvasChange);
      canvasEditor.off("object:removed", handleCanvasChange);
    };
  }, [canvasEditor]);

  useEffect(() => {
    const handleResize = () => {
      if (!canvasEditor || !project) return;
      // recalculate optimal scale for new window size
      const newScale = calculateViewportScale();

      //update canvas display dimensions
      canvasEditor.setDimensions(
        {
          width: project.width * newScale,
          height: project.height * newScale,
        },
        {
          backstoreOnly: true,
        }
      );

      // update canvas zoom
      canvasEditor.setZoom(newScale);

      canvasEditor.calcOffset();
      canvasEditor.requestRenderAll();
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [canvasEditor, project]);

  useEffect(() => {
    if (!canvasEditor) return;

    switch (activeTool) {
      case "crop":
        canvasEditor.defaultCursor = "crosshair";
        canvasEditor.hoverCursor = "crosshair";

        break;

      default:
        canvasEditor.defaultCursor = "default";
        canvasEditor.hoverCursor = "default";
        break;
    }
  }, [canvasEditor, activeTool]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center bg-secondary w-full h-full overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(45deg, #64748b 25%, transparent 25%),
      linear-gradient(-45deg, #64748b 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #64748b 75%),
      linear-gradient(-45deg, transparent 75%, #64748b 75%)`,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-600/80 z-10">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="size-8 animate-spin text-cyan-400" />
            <p className="text-white/70 text-sm"> Loading...</p>
          </div>
        </div>
      )}
      <div className="px-5">
        <canvas id="canvas" className="border" ref={canvasRef} />
      </div>
    </div>
  );
};

export default CanvasEditor;
