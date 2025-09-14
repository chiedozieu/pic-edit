import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { usePlanAccess } from "@/hooks/use-plan-access";
import { Crown } from "lucide-react";
import React from "react";

const NewProjectModal = ({ isOpen, onClose }) => {
  const { isFree, canCreateProject } = usePlanAccess();
  const { data: projects } = useConvexQuery(api.projects.getUserProjects);

  const currentProjectCount = projects?.length || 0;

  const canCreate = canCreateProject(currentProjectCount);

  const handleClose = () => {
    onClose();
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
          </div>
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewProjectModal;
