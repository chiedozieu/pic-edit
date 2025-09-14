import { useAuth } from "@clerk/nextjs";

export function usePlanAccess() {
  const { has } = useAuth();

  const isPro = has?.({ plan: "pro" }) || false;
  const isFree = !isPro;

  const plansAccess = {
    // free plan tools
    resize: true,
    crop: true,
    adjust: true,
    text: true,

    // pro plan tools
    background: isPro,
    ai_extender: isPro,
    ai_edit: isPro,
  };
  // helper function to check access to a tool
  const hasAccess = (toolId) => {
    return plansAccess[toolId] === true;
  };

  const getRestrictedTools = () => {
    return object
      .entries(plansAccess)
      .filter(([_, hasAccess]) => !hasAccess)
      .map(([toolId]) => toolId);
  };
  const canCreateProject = (currentProjectCount) => {
    if (isPro) return true;
    return currentProjectCount < 3; // free plan can create 3 projects
  };
  const canExport = (currentExportsThisMonth) => {
    if (isPro) return true;
    return currentExportsThisMonth < 20; // free plan can export 20 times per month
  };

  return {
    userPlan: isPro ? "pro" : "free_user",
    isPro,
    isFree,
    plansAccess,
    hasAccess,
    getRestrictedTools,
    canCreateProject,
    canExport,
  };
}
