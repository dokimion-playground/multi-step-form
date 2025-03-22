"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  FormField,
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useOnboardingStep, useOnboardingForm } from "../hooks/useOnboarding";
import { ONBOARDING_STEPS } from "../types";
import { onboardingSchema, OnboardingSchema } from "../schema";

type OnboardingState = Partial<OnboardingSchema> & {
  setData: (data: Partial<OnboardingSchema>) => void;
};

const onboardingNameSchema = onboardingSchema.pick({
  lastName: true,
  firstName: true,
});

type OnboardingNameSchema = z.infer<typeof onboardingNameSchema>;

export default function OnboardingNameForm() {
  const { handleSubmit } = useOnboardingStep({
    requiredFields: [] as (keyof OnboardingState)[],
    nextStep: ONBOARDING_STEPS.PASSWORD,
    currentStep: ONBOARDING_STEPS.NAME,
  });

  const { defaultValues } = useOnboardingForm(onboardingNameSchema);

  const form = useForm<OnboardingNameSchema>({
    resolver: zodResolver(onboardingNameSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-[300px] space-y-8"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormDescription>This is your first name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormDescription>This is your last name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Next</Button>
      </form>
    </Form>
  );
}
