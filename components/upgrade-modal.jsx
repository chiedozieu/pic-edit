import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Crown, Zap } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { PricingTable } from "@clerk/nextjs";
import { Button } from "./ui/button";

const UpgradeModal = ({ isOpen, onClose, restrictedTool, reason }) => {
  const getToolName = (toolId) => {
    const toolNames = {
      background: "AI Background Tools",
      ai_extender: "AI Image Extender",
      ai_edit: "AI Editor",
      projects: "More than 3 projects",
    };
    return toolNames[toolId] || "Premium Feature";
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl bg-slate-800 border-white/10 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Crown className="size-6 " color="gold" />
            <DialogTitle className="text-2xl font-bold text-white">
              Upgrade to Pro
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-6">
          {restrictedTool && (
            <Alert className="bg-amber-500/10 border-amber-500/20">
              <Zap className="h-5 w-5" color="yellow" />
              <AlertDescription className="text-amber-300/80">
                <div className="font-semibold text-amber-400 mb-1">
                  {getToolName(restrictedTool)} - Pro Feature
                </div>
                {reason ||
                  ` ${getToolName(restrictedTool)} is only available to Pro users. Please consider upgrading to unlock this feature.`}
              </AlertDescription>
            </Alert>
          )}
          <PricingTable
            checkoutProps={{
              appearance: {
                elements: {
                  drawerRoot: {
                    zIndex: "20000",
                  },
                },
              },
            }}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            className="cursor-pointer text-white/70"
            onClick={onClose}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
