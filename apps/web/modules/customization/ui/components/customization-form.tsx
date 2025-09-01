import React from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Doc } from "@workspace/backend/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Separator } from "@workspace/ui/components/separator";
import { Button } from "@workspace/ui/components/button";
import { VapiFormFields } from "./vapi-form-fields";
import { FormSchema } from "../../types";
import { widgetSettingsFormSchema } from "../../schemas";

type WidgetSettings = Doc<"widgetSettings">;

interface CustomizationFormProps {
  initialData?: WidgetSettings | null;
  hasVapiPlugin: boolean;
}

export const CustomizationForm = ({
  initialData,
  hasVapiPlugin,
}: CustomizationFormProps) => {
  const upsertWidgetSettings = useMutation(api.private.widgetSettings.upsert);
  const form = useForm<FormSchema>({
    resolver: zodResolver(widgetSettingsFormSchema),
    defaultValues: {
      greetMessage:
        initialData?.greetMessage || "Hi! How can i help you today?",
      defaultSuggestions: {
        suggestion1: initialData?.defaultSuggestions.suggestion1 || "",
        suggestion2: initialData?.defaultSuggestions.suggestion2 || "",
        suggestion3: initialData?.defaultSuggestions.suggestion3 || "",
      },
      vapiSettings: {
        assistantId: initialData?.vapiSettings.assistantId || "",
        phoneNumber: initialData?.vapiSettings.phoneNumber || "",
      },
    },
  });

  const onSubmit = async (values: FormSchema) => {
    try {
      const vapiSettings: WidgetSettings["vapiSettings"] = {
        assistantId:
          values.vapiSettings.assistantId === "none"
            ? ""
            : values.vapiSettings.assistantId,
        phoneNumber:
          values.vapiSettings.phoneNumber === "none"
            ? ""
            : values.vapiSettings.phoneNumber,
      };

      await upsertWidgetSettings({
        greetMessage: values.greetMessage,
        defaultSuggestions: values.defaultSuggestions,
        vapiSettings,
      });

      toast.success("Widget settings saved");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>General Chat Settings</CardTitle>
            <CardDescription>
              Configure basic chat widget behavior and messages
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <FormField
              name="greetMessage"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Greeting Message</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Welcome message shown when chat open"
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    The first message customers see when they open chat
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className="space-y-4">
              <div>
                <h3 className="mb-4 text-sm">Default Suggestions</h3>
                <p className="mb-4 text-muted-foreground text-sm">
                  Quick reply suggestions shown to customers to help guide the
                  conversation
                </p>

                <div className="space-y-4">
                  <FormField
                    name="defaultSuggestions.suggestion1"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suggestion 1</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., Ho do I get started?"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="defaultSuggestions.suggestion2"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suggestion 2</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., What are your pricing plans?"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="defaultSuggestions.suggestion3"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suggestion 3</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., I need help with my account?"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {hasVapiPlugin && (
          <Card>
            <CardHeader>
              <CardTitle>Voice Assistant Settings</CardTitle>
              <CardDescription>
                Configure voice calling features powered by Vapi
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <VapiFormFields form={form} />
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end">
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
