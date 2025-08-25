import { components } from "../../_generated/api";
import { RAG } from "@convex-dev/rag";
import { google } from "@ai-sdk/google";

const rag = new RAG(components.rag, {
  textEmbeddingModel: google.textEmbeddingModel("text-embedding-004"),
  embeddingDimension: 768,
});

export default rag;
