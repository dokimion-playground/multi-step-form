"use client";

import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/app/onboarding/store";
import { useEffect } from "react";
import { OnboardingSchema } from "../schema";
import { z } from "zod";
import {
  ONBOARDING_STEPS,
  OnboardingStep,
  OnboardingState,
  OnboardingStepProps,
  OnboardingStepReturn,
  ZodSchemaShape,
  StoreValue,
  ValidStoreValue,
} from "../types";

const STEP_ORDER = {
  [ONBOARDING_STEPS.NAME]: 0,
  [ONBOARDING_STEPS.PASSWORD]: 1,
  [ONBOARDING_STEPS.USERNAME]: 2,
  [ONBOARDING_STEPS.COMPLETE]: 3,
} as const;

// Utility functions
function getPreviousStep(currentStep: keyof typeof STEP_ORDER): OnboardingStep {
  const currentIndex = STEP_ORDER[currentStep];
  const previousIndex = currentIndex - 1;
  const previousStep = Object.entries(STEP_ORDER).find(
    ([_, index]) => index === previousIndex
  );
  return (
    previousStep ? previousStep[0] : ONBOARDING_STEPS.NAME
  ) as OnboardingStep;
}

function isValidStoreValue<T>(
  value: StoreValue<T>
): value is ValidStoreValue<T> {
  return value !== undefined && typeof value !== "function";
}

// Hooks
function useOnboardingValidation(requiredFields: (keyof OnboardingState)[]) {
  const hasRequiredFields = requiredFields.every(
    (field) => useOnboardingStore.getState()[field]
  );

  return { hasRequiredFields };
}

function useOnboardingNavigation(
  nextStep: OnboardingStep,
  currentStep: OnboardingStep
) {
  const router = useRouter();
  const setData = useOnboardingStore((state) => state.setData);

  const handleSubmit = (data: Partial<OnboardingSchema>) => {
    setData(data);
    router.push(nextStep);
  };

  return { handleSubmit, router };
}

function useOnboardingHydration() {
  const hasHydrated = useOnboardingStore.persist?.hasHydrated;
  return { hasHydrated };
}

function useOnboardingFormData<T extends z.ZodObject<any>>(schema: T) {
  const store = useOnboardingStore();

  const defaultValues = Object.keys(schema.shape).reduce((acc, key) => {
    const value = store[key as keyof typeof store];
    if (isValidStoreValue(value)) {
      acc[key as keyof ZodSchemaShape<T>] =
        value as ZodSchemaShape<T>[keyof ZodSchemaShape<T>];
    }
    return acc;
  }, {} as ZodSchemaShape<T>);

  return { defaultValues };
}

// Main hook
export function useOnboardingStep(
  props: OnboardingStepProps
): OnboardingStepReturn {
  const { hasRequiredFields } = useOnboardingValidation(props.requiredFields);
  const { handleSubmit, router } = useOnboardingNavigation(
    props.nextStep,
    props.currentStep
  );
  const { hasHydrated } = useOnboardingHydration();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!hasRequiredFields) {
      const previousStep = getPreviousStep(
        props.currentStep as keyof typeof STEP_ORDER
      );
      router.push(previousStep);
    }
  }, [hasHydrated, hasRequiredFields, router, props.currentStep]);

  return {
    handleSubmit,
    hasRequiredFields,
  };
}

export { useOnboardingFormData as useOnboardingForm };
