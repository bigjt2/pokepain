import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(1, "Username is required.")
  .max(20, "Username must be a maximum of 20 characters.")
  .regex(
    /^[a-zA-Z0-9_-]*$/,
    "Username must be alphanumeric and only contain the following special characters: _, -."
  );

export const passSchema = z
  .string()
  .min(1, "Password is required.")
  .max(20, "Password must be a maximum of 20 characters.")
  .regex(
    /^[a-zA-Z0-9_#$]*$/,
    "Password must be alphanumeric and only contain the following special characters: _, -, $."
  );
