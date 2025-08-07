import { useEffect, useState } from "react";
import Vapi from "@vapi-ai/web";

interface TranscriptMessage {
  role: "user" | "assistant";
  text: string;
}

export const useVapi = () => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);

  useEffect(() => {
    // For testing vapi api; otherwise customers will provide their own api key
    const vapiInstance = new Vapi("67478eb3-cd83-4edd-9914-91b542ae2dc8");
    setVapi(vapiInstance);

    vapiInstance.on("call-start", () => {
      setIsConnecting(false);
      setIsConnected(true);
      setTranscript([]);
    });
    vapiInstance.on("call-end", () => {
      setIsConnecting(false);
      setIsConnected(false);
      setIsSpeaking(false);
    });
    vapiInstance.on("speech-start", () => {
      setIsSpeaking(true);
    });
    vapiInstance.on("speech-end", () => {
      setIsSpeaking(false);
    });

    vapiInstance.on("error", (error) => {
      console.error("VAPI_ERROR:", error);
      setIsConnecting(false);
    });
    vapiInstance.on("message", (message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        setTranscript((prev) => [
          ...prev,
          {
            role: message.role === "user" ? "user" : "assistant",
            text: message.transcript,
          },
        ]);
      }
      setIsSpeaking(false);
    });

    return () => {
      vapiInstance?.stop();
    };
  }, []);

  const startCall = () => {
    setIsConnecting(true);

    // For testing vapi api calls; otherwise customers will provide their own assistance ids
    if (vapi) {
      vapi.start("c0654377-7db9-4a4b-a463-6346bc19f4c4");
    }
  };

  const endCall = () => {
    if (vapi) {
      vapi.stop();
    }
  };

  return {
    isConnected,
    isConnecting,
    isSpeaking,
    transcript,
    startCall,
    endCall,
  };
};
