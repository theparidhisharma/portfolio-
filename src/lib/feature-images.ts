import retargetiq from "@/assets/feature-retargetiq.jpg";
import autoiq from "@/assets/feature-autoiq.jpg";
import studentPortal from "@/assets/feature-student-portal.jpg";
import retargetiqLight from "@/assets/feature-retargetiq-light.jpg";
import autoiqLight from "@/assets/feature-autoiq-light.jpg";
import studentPortalLight from "@/assets/feature-student-portal-light.jpg";

export const FEATURE_IMAGES: Record<string, string> = {
  retargetiq,
  autoiq,
  "student-portal": studentPortal,
};

/** Paper-toned counterparts: same drawing, ink on stock instead of light on black. */
export const FEATURE_IMAGES_LIGHT: Record<string, string> = {
  retargetiq: retargetiqLight,
  autoiq: autoiqLight,
  "student-portal": studentPortalLight,
};

export const getFeatureImage = (slug: string, mode: "dark" | "light" = "dark") =>
  (mode === "light" ? FEATURE_IMAGES_LIGHT[slug] : FEATURE_IMAGES[slug]) ?? FEATURE_IMAGES[slug];
