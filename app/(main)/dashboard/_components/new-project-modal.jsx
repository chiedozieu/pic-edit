import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { usePlanAccess } from "@/hooks/use-plan-access";
import { Crown, ImageIcon, Loader2, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

const NewProjectModal = ({ isOpen, onClose }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const router = useRouter();

  const { isFree, canCreateProject } = usePlanAccess();
  const { data: projects } = useConvexQuery(api.projects.getUserProjects);
  const { mutate: createProject } = useConvexMutation(api.projects.create);

  const currentProjectCount = projects?.length || 0;

  const canCreate = canCreateProject(currentProjectCount);

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setProjectTitle("");
    setIsUploading(false);
    onClose();
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));

      const nameWithOutExtension = file.name.replace(/\.[^/.]+$/, "");
      
      setProjectTitle(nameWithOutExtension || "Untitled Project");
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024, // 20MB
  });

  const handleCreateProject = async () => {
    if (!canCreate) {
      setShowUpgradeModal(true);
      return;
    }
    if (!selectedFile || !projectTitle.trim()) {
      toast.error("Please select an image and enter a project title.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("filename", selectedFile.name);

      const uploadResponse = await fetch("/api/imagekit/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();
      if (!uploadData.success) {
        throw new Error(uploadData.error || "Failed to upload image");
      }

      const projectId = await createProject({
        title: projectTitle.trim(),
        originalImageUrl: uploadData.url,
        currentImageUrl: uploadData.url,
        thumbnailUrl: uploadData.thumbnailUrl,
        width: uploadData.width || 800,
        height: uploadData.height || 600,
        canvasState: null,
      });

      toast.success("Project created successfully!");

      router.push(`/editor/${projectId}`);

    } catch (error) {
      console.error("Error creating project:", error);
      toast.error(
        error.message || "Failed to create project please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Create New Project
            </DialogTitle>
            {isFree && (
              <Badge variant="secondary" className="bg-slate-700 text-white/70">
                {currentProjectCount}/3 Projects
              </Badge>
            )}
          </DialogHeader>
          <div className="space-y-6">
            {isFree && currentProjectCount >= 2 && (
              <Alert className="bg-amber-500/10 border border-amber-500/20">
                <Crown className="w-5 h-5" color="gold" />
                <AlertDescription className={"text-amber-300/80"}>
                  <div className="font-semibold text-amber-400 mb-1">
                    {currentProjectCount === 2
                      ? "Last free project."
                      : "Project limit reached."}
                    {currentProjectCount === 2
                      ? " This is your last free project. Upgrade to Pro to create unlimited projects."
                      : " Free plan is limited to 3 projects. Upgrade to Pro to create unlimited projects."}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            {/* Upload area */}
            {!selectedFile ? (
              <div
                {...getRootProps()}
                className={`flex flex-col items-center justify-center border border-dashed border-white/20 rounded-md p-4 transition-all ${isDragActive ? "border-cyan-400 bg-cyan-400/5" : "border-white/20 hover:border-white/40"} ${!canCreate ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <input {...getInputProps()} />
                <Upload className="size-12 text-white/50 mx-auto mb-4 cursor-pointer" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {isDragActive ? "Drop your image here" : "Upload an image"}
                </h3>
                <p className="text-white/70 mb-4">
                  {canCreate
                    ? "Drag and drop or click to upload an image"
                    : "Upgrade to Pro to create unlimited projects."}
                </p>{" "}
                <p className="text-xs text-white/50">
                  Supports JPEG, PNG, and WebP. Max 20MB.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-xl border border-white/0"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setPreviewUrl(null);
                      setSelectedFile(null);
                      setProjectTitle("");
                    }}
                    className="absolute top-2 right-2 text-white/70 hover:text-white cursor-pointer"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-title" className="text-white">
                    Project Title
                  </Label>
                  <Input
                    id="project-title"
                    value={projectTitle}
                    placeholder="Enter project name"
                    onChange={(e) => setProjectTitle(e.target.value)}
                    className="bg-slate-700 border border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400"
                  />
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="size-5 text-cyan-400" />
                    <div className="">
                      <p className="text-white font-medium">
                        {selectedFile?.name}
                      </p>
                      <p className="text-white/70 text-sm">
                        {(selectedFile?.size / 1024 / 1024).toFixed(2)}MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={handleClose}
              className="text-white/70 hover:text-white cursor-pointer"
              disabled={isUploading}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              onClick={handleCreateProject}
              className="text-white/70 hover:text-white cursor-pointer"
              disabled={!selectedFile || isUploading || !projectTitle.trim()}
            >
              {isUploading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewProjectModal;
