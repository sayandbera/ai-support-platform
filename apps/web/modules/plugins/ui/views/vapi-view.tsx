"use client";

import React from "react";
import { type Feature, PluginCard } from "../components/plugin-card";
import {
  GlobeIcon,
  PhoneCallIcon,
  PhoneIcon,
  WorkflowIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";

const vapiFeatures: Feature[] = [
  {
    icon: GlobeIcon,
    label: "Web voice calls",
    description: "Voice chat directly in your app",
  },
  {
    icon: PhoneIcon,
    label: "Phone numbers",
    description: "Get dedicated business line",
  },
  {
    icon: PhoneCallIcon,
    label: "Outbound calls",
    description: "Automated customer outreach",
  },
  {
    icon: WorkflowIcon,
    label: "Workflows",
    description: "Custom conversation flows",
  },
];

const formSchema = z.object({
  publicApiKey: z.string().min(1, { message: "Public API key is required" }),
  privateApiKey: z.string().min(1, { message: "Private API key is required" }),
});

const VapiPluginForm = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  const upsertSecret = useMutation(api.private.secrets.upsert);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      publicApiKey: "",
      privateApiKey: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await upsertSecret({
        service: "vapi",
        value: {
          publicApiKey: values.publicApiKey,
          privateApiKey: values.privateApiKey,
        },
      });

      setOpen(false);
      toast.success("Vapi secret created");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enable Vapi</DialogTitle>
          <DialogDescription>
            Your API keys are safely encrypted and stored using AWS Secrets
            Manager.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex flex-col gap-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              name="publicApiKey"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label>Public API key</Label>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Your public API key"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="privateApiKey"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label>Private API key</Label>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Your private API key"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button disabled={form.formState.isSubmitting} type="submit">
                {form.formState.isSubmitting ? "Connecting..." : "Connect"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export const VapiView = () => {
  const [connectDialogOpen, setConnectDialogOpen] = React.useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = React.useState(false);

  const vapiPlugin = useQuery(api.private.plugins.getOne, {
    service: "vapi",
  });

  const handleSUbmit = () => {
    if (vapiPlugin) {
      setRemoveDialogOpen(true);
    } else {
      setConnectDialogOpen(true);
    }
  };

  // Loading the vapi plugin
  if (vapiPlugin === undefined) {
    return null;
  }

  return (
    <>
      <VapiPluginForm open={connectDialogOpen} setOpen={setConnectDialogOpen} />

      <div className="flex min-h-screen flex-col bg-muted p-8">
        <div className="mx-auto w-full max-w-screen-md">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl">Vapi Plugin</h1>
            <p className="text-muted-foreground">
              Connect Vapi to enable AI voice calls and phone support
            </p>
          </div>

          <div className="mt-8">
            {vapiPlugin ? (
              <p>Connected!!</p>
            ) : (
              <PluginCard
                serviceName="Vapi"
                serviceImage="/vapi.jpg"
                features={vapiFeatures}
                isDisabled={vapiPlugin === undefined} // undefined means it is loading
                onSubmit={handleSUbmit}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
