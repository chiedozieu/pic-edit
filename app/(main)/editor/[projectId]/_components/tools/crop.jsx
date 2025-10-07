"use client";

import { useCanvas } from '@/context/context';
import { Maximize, RectangleHorizontal, RectangleVertical, Smartphone, Square } from 'lucide-react';
import React, { useState } from 'react'

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
    const {canvasEditor, activeTool} = useCanvas()
    const [selectedImage, setSelectedImage] = useState(null)
    const [isCropMode, setIsCropMode] = useState(false)
    const [selectedRatio, setSelectedRatio] = useState(null)
    const [cropReact, setCropRect] = useState(null)
    const [originalProps, setOriginalProps] = useState(null)


  return (
    <div>CropContent</div>
  )
}

export default CropContent