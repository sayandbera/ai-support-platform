import { z } from "zod";
import { widgetSettingsFormSchema } from "./schemas";

export type FormSchema = z.infer<typeof widgetSettingsFormSchema>;
