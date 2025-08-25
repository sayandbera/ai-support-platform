import { components } from "../../_generated/api";
import { RAG } from "@convex-dev/rag";
import { google } from "@ai-sdk/google";

const rag = new RAG(components.rag, {
  textEmbeddingModel: google.embedding("models/embedding-001"),
  embeddingDimension: 1536,
});

export default rag;
