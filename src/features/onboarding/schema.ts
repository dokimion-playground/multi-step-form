import { z } from "zod";

export const onboardingSchema = z.object({
  username: z
    .string()
    .min(3, "아이디를 입력해주세요")
    .max(20, "아이디는 최대 20자입니다"),
  lastName: z
    .string()
    .min(3, "성을 입력해주세요")
    .max(20, "성은 최대 20자입니다"),
  firstName: z
    .string()
    .min(3, "이름을 입력해주세요")
    .max(20, "이름은 최대 20자입니다"),
  password: z
    .string()
    .min(8, "비밀번호를 입력해주세요")
    .max(20, "비밀번호는 최대 20자입니다"),
  repeatPassword: z
    .string()
    .min(8, "비밀번호를 입력해주세요")
    .max(20, "비밀번호는 최대 20자입니다"),
  terms: z.boolean().refine((data) => data, "약관에 동의해주세요"),
});

export type OnboardingSchema = z.infer<typeof onboardingSchema>;
