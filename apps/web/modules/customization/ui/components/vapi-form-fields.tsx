import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  useVapiAssistants,
  useVapiPhoneNumbers,
} from "@/modules/plugins/hooks/use-vapi-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { FormSchema } from "../../types";

interface VapiFormFieldsProps {
  form: UseFormReturn<FormSchema>;
}

export const VapiFormFields = ({ form }: VapiFormFieldsProps) => {
  const { data: assistants, isLoading: assistantsLoading } =
    useVapiAssistants();
  const { data: phoneNumbers, isLoading: phoneNumbersLoading } =
    useVapiPhoneNumbers();

  const disabled = form.formState.isSubmitting;

  return (
    <>
      <FormField
        name="vapiSettings.assistantId"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Voice Assistant</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={disabled || assistantsLoading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      assistantsLoading
                        ? "Loading assistants..."
                        : "Select a voice assistant"
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {assistants?.map((assistant) => (
                  <SelectItem key={assistant.id} value={assistant.id}>
                    {assistant.name || "Unnamed assistant"}
                    {" - "}
                    {assistant.model?.model || "Unknown model"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              The Vapi assistant to use for voice calls
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="vapiSettings.phoneNumber"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Display Phone Numbers</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={disabled || phoneNumbersLoading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      phoneNumbersLoading
                        ? "Loading phone numbers..."
                        : "Select a phone number"
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {phoneNumbers?.map((phoneNumber) => (
                  <SelectItem
                    key={phoneNumber.id}
                    value={phoneNumber.number || phoneNumber.id}
                  >
                    {phoneNumber.number || "Unknown"}
                    {" - "}
                    {phoneNumber.name || "Unnamed"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Phone number to display in the widget
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
