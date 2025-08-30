import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { Id } from "../_generated/dataModel";
import { StorageActionWriter } from "convex/server";
import { assert } from "convex-helpers";

const AI_MODELS = {
  image: google.chat("gemini-2.5-flash"),
  pdf: google.chat("gemini-2.5-flash"),
  html: google.chat("gemini-2.5-flash-lite"), // Use the model with the URL tool
} as const;

const SUPPORTED_IMAGE_TYPE = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

const SYSTEM_PROMPT = {
  image:
    "You turn images into text. If it is a photo of a document, transcribe it. If it is not a document, describe it.",
  pdf: "You transform the PDF files into text.",
  html: "You transform HTML content into markdown",
};

export type ExtractTextContentArgs = {
  storageId: Id<"_storage">;
  filename: string;
  bytes?: ArrayBuffer;
  mimeType: string;
};

export async function extractTextContent(
  ctx: { storage: StorageActionWriter },
  args: ExtractTextContentArgs
): Promise<string> {
  const { filename, mimeType, storageId, bytes } = args;

  const url = await ctx.storage.getUrl(storageId);
  assert(url, "Failed to get the storage URL");

  if (SUPPORTED_IMAGE_TYPE.some((type) => type === mimeType)) {
    return extractImageText(url);
  } else if (mimeType.toLocaleLowerCase().includes("pdf")) {
    return extractPdfText(url, mimeType, filename);
  } else if (mimeType.toLocaleLowerCase().includes("text")) {
    return extractTextFileContent(ctx, storageId, mimeType, bytes);
  }

  throw new Error(`Unsupported MIME type: ${mimeType}`);
}

async function extractImageText(url: string): Promise<string> {
  const result = await generateText({
    model: AI_MODELS.image,
    system: SYSTEM_PROMPT.image,
    messages: [
      {
        role: "user",
        content: [{ type: "image", image: new URL(url) }],
      },
    ],
  });

  return result.text;
}

async function extractPdfText(
  url: string,
  mimeType: string,
  filename: string
): Promise<string> {
  const result = await generateText({
    model: AI_MODELS.pdf,
    system: SYSTEM_PROMPT.pdf,
    messages: [
      {
        role: "user",
        content: [
          { type: "file", data: new URL(url), mimeType, filename },
          {
            type: "text",
            text: "Extract the text from the PDF and print it without explaining you'll do so.",
          },
        ],
      },
    ],
  });

  return result.text;
}

async function extractTextFileContent(
  ctx: {
    storage: StorageActionWriter;
  },
  storageId: Id<"_storage">,
  mimeType: string,
  bytes: ArrayBuffer | undefined
): Promise<string> {
  const arrayBuffer =
    bytes || (await (await ctx.storage.get(storageId))?.arrayBuffer());

  if (!arrayBuffer) {
    throw new Error("Failed to get file content");
  }

  const text = new TextDecoder().decode(arrayBuffer);

  if (mimeType.toLocaleLowerCase() !== "text/plain") {
    const result = await generateText({
      model: AI_MODELS.html,
      system: SYSTEM_PROMPT.html,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text },
            {
              type: "text",
              text: "Extract the text and print it in a markdown format without explaining you'll do so.",
            },
          ],
        },
      ],
    });

    return result.text;
  }

  return text;
}
