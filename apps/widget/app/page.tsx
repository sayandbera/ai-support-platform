"use client";

import { useVapi } from "@/modules/widget/hooks/use-vapi";
import { Button } from "@workspace/ui/components/button";

export default function Page() {
  const {
    isConnected,
    isConnecting,
    isSpeaking,
    transcript,
    startCall,
    endCall,
  } = useVapi();

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4 max-w-md mx-auto w-full">
        <h1 className="text-2xl font-bold">Widget App</h1>
        <Button
          disabled={isConnecting || isConnected}
          onClick={() => startCall()}
        >
          Start call
        </Button>
        <Button
          disabled={!isConnected}
          variant="destructive"
          onClick={() => endCall()}
        >
          End call
        </Button>

        <p>Is connected: {isConnected ? "Yes" : "No"}</p>
        <p>Is connecting: {isConnecting ? "Yes" : "No"}</p>
        <p>Is speaking: {isSpeaking ? "Yes" : "No"}</p>
        <p>Transcript: {JSON.stringify(transcript, null, 2)}</p>
      </div>
    </div>
  );
}
