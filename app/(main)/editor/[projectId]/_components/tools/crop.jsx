"use client";

import { Button } from "@/components/ui/button";
import { useCanvas } from "@/context/context";
import { FabricImage, Rect } from "fabric";
import {
  CheckCheck,
  Crop,
  Maximize,
  RectangleHorizontal,
  RectangleVertical,
  Scissors,
  Smartphone,
  Square,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";

const ASPECT_RATIOS = [
  { label: "Freeform", value: null, icon: Maximize },
  { label: "Square", value: 1, icon: Square, ratio: "1:1" },
  {
    label: "Widescreen",
    value: 16 / 9,
    icon: RectangleHorizontal,
    ratio: "16:9",
  },
  { label: "Portrait", value: 4 / 5, icon: RectangleVertical, ratio: "4:5" },
  { label: "Story", value: 9 / 16, icon: Smartphone, ratio: "9:16" },
];
const CropContent = () => {
  const { canvasEditor, activeTool } = useCanvas();

  const [selectedImage, setSelectedImage] = useState(null); // the image being cropped
  const [isCropMode, setIsCropMode] = useState(false); // whether crop mode is active
  const [selectedRatio, setSelectedRatio] = useState(null); // currently selected aspect ratio
  const [cropRect, setCropRect] = useState(null); // the crop rectangle object
  const [originalProps, setOriginalProps] = useState(null); // store original image properties for reset

  const getActiveImage = () => {
    if (!canvasEditor) return null;
    const activeObject = canvasEditor.getActiveObject();
    if (activeObject && activeObject.type === "image") {
      return activeObject;
    }
    const objects = canvasEditor.getObjects();
    return objects.find((obj) => obj.type === "image") || null;
  };

  useEffect(() => {
    if (activeTool === "crop" && canvasEditor && isCropMode) {
      const image = getActiveImage();

      if (image) {
        initializeCropMode(image);
      }
    } else if (activeTool !== "crop" && isCropMode) {
      exitCropMode();
    }
  }, [activeTool, canvasEditor]);

  useEffect(() => {
    return () => {
      if (isCropMode) {
        exitCropMode();
      }
    };
  }, []);

  const exitCropMode = () => {
    if (!isCropMode) return;
    removeAllCropRectangles();

    setIsCropMode(null);
    if (selectedImage && originalProps) {
      selectedImage.set({
        selectable: originalProps.selectable,
        evented: originalProps.evented,
        // restore position and transformation
        left: originalProps.left,
        top: originalProps.top,
        scaleX: originalProps.scaleX,
        scaleY: originalProps.scaleY,
        angle: originalProps.angle,
        // width: originalProps.width,
        // height: originalProps.height,
      });
      canvasEditor.setActiveObject(selectedImage);
    }
    setIsCropMode(null);
    setSelectedImage(null);
    setOriginalProps(null);
    setSelectedRatio(null);

    if (canvasEditor) {
      canvasEditor.requestRenderAll();
    }
  };

  const createCropRectangle = (image) => {
    const bounds = image.getBoundingRect();
    const cropRectangle = new Rect({
      left: bounds.left + bounds.width * 0.1,
      top: bounds.top + bounds.height * 0.1,
      width: bounds.width * 0.8,
      height: bounds.height * 0.8,
      fill: "transparent",
      stroke: "#00bcd4",
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      selectable: true,
      evented: true,
      name: "cropRect",
      // visual styles for crop handle
      cornerColor: "#00bcd4",
      cornerSize: 12,
      cornerStrokeColor: "#00bcd4",
      cornerStyle: "circle",
      borderColor: "#00bcd4",
      borderScaleFactor: 1,

      // custom property to identify crop rectangle
      isCropRectangle: true,
    });
    cropRectangle.on("scaling", (e) => {
      const rect = e.target;

      if (selectedRatio & (selectedRatio !== null)) {
        const currentRatio =
          (rect.width * rect.scaleX) / (rect.height * rect.scaleY);

        if (Math.abs(currentRatio - selectedRatio) > 0.01) {
          const newHeight =
            (rect.width * rect.scaleX) / selectedRatio / rect.scaleY;
          rect.set("height", newHeight);
        }
      }
      canvasEditor.requestRenderAll();
    });
    canvasEditor.add(cropRectangle);
    canvasEditor.setActiveObject(cropRectangle);
    setCropRect(cropRectangle);
  };
  const removeAllCropRectangles = () => {
    if (!canvasEditor) return;

    const objects = canvasEditor.getObjects();
    const rectsToRemove = objects.filter((obj) => obj.type === "rect");
    rectsToRemove.forEach((rect) => {
      canvasEditor.remove(rect);
    });
    canvasEditor.requestRenderAll();
  };

  const initializeCropMode = (image) => {
    if (!image || isCropMode) return; // prevent double-initialization

    removeAllCropRectangles();
    const original = {
      left: image.left,
      top: image.top,
      width: image.width,
      height: image.height,
      scaleX: image.scaleX,
      scaleY: image.scaleY,
      angle: image.angle || 0,
      selectable: image.selectable,
      evented: image.evented,
    };
    setOriginalProps(original);
    setSelectedImage(image);
    setIsCropMode(true);

    // Make image non-selectable while cropping
    image.set({
      selectable: false,
      evented: false,
    });
    createCropRectangle(image);
    canvasEditor.requestRenderAll();
  };
  const applyAspectRatio = (ratio) => {
    setSelectedRatio(ratio);

    if (!cropRect || ratio === null) return;
    const currentWidth = cropRect.width * cropRect.scaleX;
    const newHeight = currentWidth / ratio;

    cropRect.set({
      height: newHeight / cropRect.scaleY,
      scaleY: cropRect.scaleX, // keep scaling uniform
    });

    canvasEditor.requestRenderAll();
  };
  const applyCrop = (ratio) => {
    if (!selectedImage || !cropRect) return;
    try {
      const cropBounds = cropRect.getBoundingRect();
      const imageBounds = selectedImage.getBoundingRect();

      const cropX = Math.max(0, cropBounds.left - imageBounds.left);
      const cropY = Math.max(0, cropBounds.top - imageBounds.top);
      const cropWidth = Math.min(cropBounds.width, imageBounds.width - cropX);
      const cropHeight = Math.min(
        cropBounds.height,
        imageBounds.height - cropY
      );
      const imageScaleX = selectedImage.scaleX || 1;
      const imageScaleY = selectedImage.scaleY || 1;

      const actualCropX = cropX / imageScaleX;
      const actualCropY = cropY / imageScaleY;
      const actualCropWidth = cropWidth / imageScaleX;
      const actualCropHeight = cropHeight / imageScaleY;

      const croppedImage = new FabricImage(selectedImage._element, {
        left: cropBounds.left + cropBounds.width / 2,
        top: cropBounds.top + cropBounds.height / 2,

        originX: "center",
        originY: "center",
        selectable: true,
        evented: true,

        // apply crop using Fabric.js crop properties

        cropX: actualCropX,
        cropY: actualCropY,
        width: actualCropWidth,
        height: actualCropHeight,
        scaleX: imageScaleX,
        scaleY: imageScaleY,
      });
      canvasEditor.remove(selectedImage);
      canvasEditor.add(croppedImage);

      canvasEditor.setActiveObject(croppedImage);
      canvasEditor.requestRenderAll();

      exitCropMode();
    } catch (error) {
      toast.error("Error applying crop, please try again " );
      console.error("Error applying crop:", error);
      exitCropMode();
    }
  };

  if (!canvasEditor)
    return (
      <div className="p-4">
        <p className="text-sm text-white/70">Canvas not ready...</p>
      </div>
    );
  const activeImage = getActiveImage();
  return (
    <div className="space-y-6">
      {isCropMode && (
        <div className="bg-cyan-500/10 border border-cyan-500 p-3 rounded-lg">
          <p className="text-cyan-400 text-sm font-medium">
            <Scissors className="size-4 inline-block mr-2 text-red-500" /> Crop
            Mode Active
          </p>
          <p className="text-cyan-300/80 text-xs mt-1 ">
            Drag the corners of the crop box to adjust.
          </p>
        </div>
      )}
      {!isCropMode && activeImage && (
        <Button
          onClick={() => initializeCropMode(activeImage)}
          className="w-full mt-48"
          variant="primary"
        >
          <span className="flex items-center justify-center ">
            <Crop className="size-4 mr-2" />
            Start Cropping
          </span>
        </Button>
      )}
      {isCropMode && (
        <div className="">
          <h3 className="text-sm font-medium text-white mb-3">
            Crop Aspect Ratios
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {ASPECT_RATIOS.map((ratio) => {
              const IconComponent = ratio.icon;

              return (
                <button
                  className={`text-center p-3 border rounded-lg transition-colors cursor-pointer ${selectedRatio === ratio.value ? "border-cyan-400 bg-cyan-400/10" : "border-white/20 hover:bg-white/5"}`}
                  key={ratio.label}
                  onClick={() => applyAspectRatio(ratio.value)}
                >
                  <IconComponent className="size-6 mx-auto mb-2 text-white" />
                  <div className="text-xs text-white">{ratio.label}</div>
                  {ratio.ratio && (
                    <div className="text-2xs text-white/70">{ratio.ratio}</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {isCropMode && (
        <div className="space-y-3 pt-4 border-t border-white/10">
          <Button onClick={applyCrop} className="w-full" variant="primary">
            <CheckCheck className="size-4 mr-2" /> Apply Crop
          </Button>
          <Button
            onClick={() => exitCropMode()}
            className="w-full cursor-pointer"
            variant="outline"
          >
            <X className="size-4 mr-2" /> Cancel
          </Button>
        </div>
      )}
      <div className="bg-slate-800/50 p-4 rounded-lg">
        <p className="text-xs text-white/70">
          <strong>How to Crop</strong>
          <br />
          1. Click "Start Cropping"
          <br />
          2. Drag the corners of the crop box to adjust the crop area.
          <br />
          3. Choose aspect ratio (optional)
          <br />
          4. Click "Apply Crop" to finalize
        </p>
      </div>
    </div>
  );
};

export default CropContent;
