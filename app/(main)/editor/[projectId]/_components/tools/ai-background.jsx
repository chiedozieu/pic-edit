import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCanvas } from "@/context/context";
import { FabricImage } from "fabric";
import { Download, Image, Loader2, Palette, Search, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { toast } from "sonner";

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
const UNSPLASH_API_URL = "https://api.unsplash.com";

const BackgroundControls = ({ project }) => {
  const { canvasEditor, processingMessage, setProcessingMessage } = useCanvas();

  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [searchQuery, setSearchQuery] = useState("");
  const [unsplashImages, setUnsplashImages] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(null);

  const getMainImage = () => {
    if (!canvasEditor) return null;
    const objects = canvasEditor.getObjects();
    return objects.find((obj) => obj.type === "image") || null;
  };
  const handleBackgroundRemoval = async () => {
    const mainImage = getMainImage();
    if (!mainImage || !project) return;
    setProcessingMessage("Removing background...");

    try {
      const currentImageUrl =
        project.currentImageUrl || project.originalImageUrl;

      const bgRemovedUrl = currentImageUrl.includes("ik.imagekit.io")
        ? `${currentImageUrl.split("?")[0]}?tr=e-bgremove`
        : currentImageUrl;

      const processedImage = await FabricImage.fromURL(bgRemovedUrl, {
        crossOrigin: "anonymous",
      });

      const currentProps = {
        left: mainImage.left,
        top: mainImage.top,
        scaleX: mainImage.scaleX,
        scaleY: mainImage.scaleY,
        angle: mainImage.angle,
        originX: mainImage.originX,
        originY: mainImage.originY,
      };

      canvasEditor.remove(mainImage);
      processedImage.set(currentProps);
      canvasEditor.add(processedImage);

      processedImage.setCoords();

      canvasEditor.setActiveObject(processedImage);
      canvasEditor.calcOffset();
      canvasEditor.requestRenderAll();
    } catch (error) {
      console.error("Error removing background:", error);
      toast.error("Error removing background, please try again.");
    } finally {
      setProcessingMessage(null);
    }
  };

  const handleColorBackground = () => {
    if(!canvasEditor) return;
    canvasEditor.backgroundColor = backgroundColor;
    canvasEditor.requestRenderAll();
  };

  const searchUnsplashImages = async () => {
    if (!searchQuery.trim()  || !UNSPLASH_ACCESS_KEY) return;
    setIsSearching(true);
    try {
      const response = await fetch(
        `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=12`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );
      if (!response.ok) toast.error("Error searching unsplash");
      const data = await response.json();
      setUnsplashImages(data.results || []);
    } catch (error) {
      console.error("Error searching unsplash:", error);
      toast.error("Error searching unsplash, please try again.");
    } finally {
      setIsSearching(false);
    }
  };

 

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      searchUnsplashImages();
    }
  };

  const handleImageBackground = async () => {

  }

  return (
    <div className="space-y-6 relative h-full">
      <div className="">
        <div className="">
          <h3 className="text-sm font-medium text-white mb-2">
            AI Background Removal
          </h3>
          <p className="text-xs text-white/70 mb-4">
            Remove the background from your image using AI.
          </p>
        </div>
        <Button
          className="w-full"
          variant="primary"
          onClick={handleBackgroundRemoval}
          disabled={processingMessage || !getMainImage()}
        >
          <Trash2 className="size-4 mr-2" />
          Remove Image Background
        </Button>
        {/* show warning if no image is available */}
        {!getMainImage() && (
          <p className="text-xs text-amber-400 mt-2">
            No image selected to remove background from.
          </p>
        )}
      </div>

      <Tabs defaultValue="color" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
          <TabsTrigger
            value="color"
            className="data-[state=active]:bg-cyan-500 dat-[state=active]:text-white"
          >
            <Palette className="size-4 mr-2" />
            Color
          </TabsTrigger>
          <TabsTrigger
            value="image"
            className="data-[state=active]:bg-cyan-500 dat-[state=active]:text-white"
          >
            <Image className="size-4 mr-2" />
            Image
          </TabsTrigger>
        </TabsList>
        <TabsContent value="color" className="space-y-4 mt-6">
          <div className="">
            <h3 className="text-sm font-medium text-white mb-2">
              Solid Color Background
            </h3>
            <p className="text-xs text-white/70 mb-4">
              Choose a solid color for the background.
            </p>
          </div>
          <div className="space-y-4">
            <HexColorPicker
              hex={backgroundColor}
              onChange={setBackgroundColor}
              style={{ width: "100%" }}
            />
            <div className="flex items-center gap-2">
              <Input
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                placeholder="#ffffff"
                className="flex-1 bg-slate-700 border-white/20 text-white"
              />
              {/* color preview square */}
              <div
                className="w-10 h-10 rounded border border-white/20"
                style={{ backgroundColor }}
              />
            </div>
            <Button
              onClick={handleColorBackground}
              variant="primary"
              className="w-full"
            >
              <Palette className="size-4 mr-2" />
              Apply Color
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="image" className="space-y-4 mt-6">
          <div className="">
            <h3 className="text-sm font-medium text-white mb-2"> Image Background</h3> 
            <p className="text-xs text-white/70 mb-4">
              Search and use high quality images from Unsplash as your background.
            </p>
          </div>
          <div className="flex gap-2">
            <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for an image"
            className="flex-1 bg-slate-700 border-white/20 text-white"
            onKeyPress={handleSearchKeyPress}

            />
            <Button
              onClick={searchUnsplashImages}
              variant="primary"
              disabled={isSearching || !searchQuery.trim()}
              // className="w-full"
            >
             {
              isSearching ? (
                <Loader2 className="animate-spin size-4" />
              ) : (
                <Search className="size-4" />
              )
             }
             
            </Button>
          </div>
          {
            unsplashImages?.length > 0 && (
              <div className="space-y-3">
              <h4 className="text-sm font-medium text-white">
                Search Results ({unsplashImages.length})
              </h4>
                <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {unsplashImages.map((image) => {
                    return (
                      <div
                      key={image.id}
                      className="relative cursor-pointer group rounded-lg overflow-hidden border border-white/10 hover:border-cyan-400 transition-colors"
                      onClick={() => handleImageBackground(image.urls.regular, image.id)}
                    >
                      <img
                        src={image.urls.small}
                        alt={image.alt_description || "Background Image"}
                        className="w-full h-24 object-cover"
                      />
                      {
                        selectedImageId === image.id && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Loader2 className="size-5 animate-spin text-white" />
                          </div>
                        )
                      }
                      {
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Download className="size-5 text-white" />
                        </div>
                      }
                    </div>
                    )
                  }
                    
                )}
                </div>
              </div>
            )
          }
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BackgroundControls;
