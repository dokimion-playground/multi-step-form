import { z } from "zod";
import { OnboardingSchema } from "./schema";

// Base types
export type OnboardingState = Partial<OnboardingSchema> & {
  setData: (data: Partial<OnboardingSchema>) => void;
};

// Hook props and returns
export type OnboardingStepProps = {
  requiredFields: (keyof OnboardingState)[];
  nextStep: OnboardingStep;
  currentStep: OnboardingStep;
};

export type OnboardingStepReturn = {
  handleSubmit: (data: Partial<OnboardingSchema>) => void;
  hasRequiredFields: boolean;
};

// Constants
export const ONBOARDING_STEPS = {
  NAME: "/onboarding/name",
  PASSWORD: "/onboarding/password",
  USERNAME: "/onboarding/username",
  COMPLETE: "/onboarding/complete",
} as const;

export type OnboardingStep =
  (typeof ONBOARDING_STEPS)[keyof typeof ONBOARDING_STEPS];

// Utility types for form data
export type ZodSchemaShape<T extends z.ZodObject<any>> = z.infer<T>;

export type StoreValue<T> =
  | T
  | undefined
  | ((data: Partial<OnboardingSchema>) => void);

export type ValidStoreValue<T> = Exclude<
  StoreValue<T>,
  undefined | ((data: Partial<OnboardingSchema>) => void)
>;
