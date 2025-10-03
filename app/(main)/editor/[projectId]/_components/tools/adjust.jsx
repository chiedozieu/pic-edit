"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useCanvas } from "@/context/context";
import { filters } from "fabric";
import { Loader2, RotateCcw } from "lucide-react";

import React, { useState } from "react";

// Filter configurations
const FILTER_CONFIGS = [
  {
    key: "brightness",
    label: "Brightness",
    min: -100,
    max: 100,
    step: 1,
    defaultValue: 0,
    filterClass: filters.Brightness,
    valueKey: "brightness",
    transform: (value) => value / 100,
  },
  {
    key: "contrast",
    label: "Contrast",
    min: -100,
    max: 100,
    step: 1,
    defaultValue: 0,
    filterClass: filters.Contrast,
    valueKey: "contrast",
    transform: (value) => value / 100,
  },
  {
    key: "saturation",
    label: "Saturation",
    min: -100,
    max: 100,
    step: 1,
    defaultValue: 0,
    filterClass: filters.Saturation,
    valueKey: "saturation",
    transform: (value) => value / 100,
  },
  {
    key: "vibrance",
    label: "Vibrance",
    min: -100,
    max: 100,
    step: 1,
    defaultValue: 0,
    filterClass: filters.Vibrance,
    valueKey: "vibrance",
    transform: (value) => value / 100,
  },
  {
    key: "blur",
    label: "Blur",
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 0,
    filterClass: filters.Blur,
    valueKey: "blur",
    transform: (value) => value / 100,
  },
  {
    key: "hue",
    label: "Hue",
    min: -180,
    max: 180,
    step: 1,
    defaultValue: 0,
    filterClass: filters.HueRotation,
    valueKey: "rotation",
    transform: (value) => value * (Math.PI / 180),
    suffix: "°",
  },
];

const DEFAULT_VALUES = FILTER_CONFIGS.reduce((acc, config) => {
  acc[config.key] = config.defaultValue;
  return acc;
}, {});

const AdjustControls = () => {
  const [filterValues, setFilterValues] = useState(DEFAULT_VALUES);
  const [isApplying, setIsApplying] = useState(false);

  const { canvasEditor } = useCanvas();
  const resetFilters = () => {};

  const getActiveImage = () => {
    if (!canvasEditor) return null;
    const activeObject = canvasEditor.getActiveObject();
    if (activeObject && activeObject.type === "image") {
      return activeObject;
    }
    const objects = canvasEditor.getObjects();
    return objects.find((obj) => obj.type === "image") || null;
  };
  const applyFilters = async (newValues) => {
    const imageObject = getActiveImage();
    if (!imageObject || isApplying) return;

    setIsApplying(true);
    try {
      const filtersToApply = [];

      FILTER_CONFIGS.forEach((config) => {
        const value = newValues[config.key];
        if (value !== config.defaultValue) {
          const transformedValue = config.transform(value);
          filtersToApply.push(
            new config.filterClass({
              [config.valueKey]: transformedValue,
            })
          );
        }
      });

      imageObject.filters = filtersToApply;
      await new Promise((resolve) => {
        imageObject.applyFilters();
        canvasEditor.requestRenderAll();
        setTimeout(resolve, 50);
      });
    } catch (error) {
      console.error("Error applying filters:", error);
    } finally {
      setIsApplying(false);
    }
  };

  const handleValueChange = (filterKey, value) => {
    const newValues = {
      ...filterValues,
      [filterKey]: Array.isArray(value) ? value[0] : value,
    };

    setFilterValues(newValues);
    applyFilters(newValues);
  };

  if (!true) {
    return (
      <div className="p-4">
        <p className="text-white/70 text-sm">
          Load an image first to start adjusting
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* reset  */}
      <div className="flex justify-between items-center">
        <h3 className="text-white text-sm font-medium">Image Adjustments</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="text-white/70 hover:text-white"
        >
          <RotateCcw className="size-4 mr-2" />
          Reset
        </Button>
      </div>
      {/* filters */}
      {FILTER_CONFIGS.map((config) => (
        <div key={config.key} className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm text-white">{config.label}</label>
            <span className="text-xs text-white/70">
              {filterValues[config.key]}
              {config.suffix || ""}
            </span>
          </div>
          <Slider
            value={[filterValues[config.key]]}
            onValueChange={(value) => handleValueChange(config.key, value)}
            max={config.max}
            min={config.min}
            step={config.step}
            className="w-full"
          />
        </div>
      ))}

      {isApplying && (
        <div className="flex items-center justify-center py-2">
          <Loader2 className="size-4 animate-spin" />
          <span className="text-xs text-white/70 ml-2">
            Applying Filters...
          </span>
        </div>
      )}
    </div>
  );
};

export default AdjustControls;
