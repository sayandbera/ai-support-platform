"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import React, { useEffect, useState } from "react";
import {
  contactSessionIdAtomFamily,
  errorMessageAtom,
  loadingMessageAtom,
  orgIdAtom,
  screenAtom,
  widgetSettingsAtom,
} from "../../atoms/widget-atoms";
import { WidgetHeader } from "../components/widget-header";
import { LoaderIcon } from "lucide-react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

type InitStep = "org" | "session" | "settings" | "vapi" | "done";

interface Props {
  orgId: string | null;
}
export const WidgetLoadingScreen = ({ orgId }: Props) => {
  const [step, setStep] = useState<InitStep>("org");
  const [sessionValid, setSessionValid] = useState(false);

  const [loadingMessage, setLoadingMessage] = useAtom(loadingMessageAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const setOrgId = useSetAtom(orgIdAtom);
  const setScreen = useSetAtom(screenAtom);
  const setWidgetSettings = useSetAtom(widgetSettingsAtom);

  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(orgId || "")
  );

  // Step 1: validate organization
  const validateOrganization = useAction(api.public.organizations.validate);
  useEffect(() => {
    if (step !== "org") {
      return;
    }

    setLoadingMessage("Finding organization ID...");

    if (!orgId) {
      setErrorMessage("Organization ID is required!");
      setScreen("error");
      return;
    }

    setLoadingMessage("Verifying organization...");

    validateOrganization({ orgId })
      .then((result) => {
        if (result.valid) {
          setOrgId(orgId);
          setStep("session");
        } else {
          setErrorMessage(result.reason || "Invalid organization");
          setScreen("error");
        }
      })
      .catch(() => {
        setErrorMessage("Unable to verify organization!");
        setScreen("error");
      });
  }, [
    step,
    orgId,
    setErrorMessage,
    setLoadingMessage,
    setScreen,
    setOrgId,
    setStep,
    validateOrganization,
  ]);

  // Step 2: Validate session (if exists)
  const validateContactSession = useMutation(
    api.public.contactSessions.validate
  );
  useEffect(() => {
    if (step !== "session") {
      return;
    }

    setLoadingMessage("Finding contact session ID...");

    if (!contactSessionId) {
      setSessionValid(false);
      setStep("settings");
      return;
    }

    setLoadingMessage("Validating session...");

    validateContactSession({ contactSessionId })
      .then((result) => {
        setSessionValid(result.valid);
        setStep("settings");
      })
      .catch(() => {
        setSessionValid(false);
        setStep("settings");
      });
  }, [step, contactSessionId, validateContactSession, setLoadingMessage]);

  // STEP 3: Load widget settings
  const widgetSettings = useQuery(
    api.public.widgetSettings.getByOrgId,
    orgId ? { orgId } : "skip"
  );
  useEffect(() => {
    if (step !== "settings") {
      return;
    }

    setLoadingMessage("Loading widget settings...");

    if (widgetSettings !== undefined) {
      setWidgetSettings(widgetSettings);
      setStep("done");
    }
  }, [step, setStep, widgetSettings, setWidgetSettings, setLoadingMessage]);

  useEffect(() => {
    if (step !== "done") {
      return;
    }

    const hasValidSession = contactSessionId && sessionValid;
    setScreen(hasValidSession ? "selection" : "auth");
  }, [step, contactSessionId, sessionValid, setScreen]);

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
          <p className="text-3xl">Hi there! 👋</p>
          <p className="text-lg">Let&apos;s get you started</p>
        </div>
      </WidgetHeader>

      <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-muted-foreground">
        <LoaderIcon className="animate-spin" />
        <p className="text-sm">{loadingMessage || "Loading..."}</p>
      </div>
    </>
  );
};
