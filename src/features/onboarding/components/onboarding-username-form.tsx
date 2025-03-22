"use client";

import { z } from "zod";
import { onboardingSchema } from "../schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useOnboardingStep, useOnboardingForm } from "../hooks/useOnboarding";
import { ONBOARDING_STEPS } from "../types";

const onboardingUsernameSchema = onboardingSchema.pick({
  username: true,
  terms: true,
});

type OnboardingUsernameSchema = z.infer<typeof onboardingUsernameSchema>;

export default function OnboardingUsernameForm() {
  const { handleSubmit } = useOnboardingStep({
    requiredFields: ["firstName", "lastName", "password", "repeatPassword"],
    nextStep: ONBOARDING_STEPS.COMPLETE,
    currentStep: ONBOARDING_STEPS.USERNAME,
  });

  const { defaultValues } = useOnboardingForm(onboardingUsernameSchema);

  const form = useForm<OnboardingUsernameSchema>({
    resolver: zodResolver(onboardingUsernameSchema),
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormDescription>This is your username.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>I agree to the terms of service.</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Next</Button>
      </form>
    </Form>
  );
}
