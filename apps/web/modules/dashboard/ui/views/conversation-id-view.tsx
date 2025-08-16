"use client";

import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { useAction, useMutation, useQuery } from "convex/react";
import { MoreHorizontalIcon, Wand2Icon } from "lucide-react";
import React from "react";
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";
import {
  AIInput,
  AIInputButton,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@workspace/ui/components/ai/input";
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";
import { AIResponse } from "@workspace/ui/components/ai/response";
import { Form, FormField } from "@workspace/ui/components/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useThreadMessages, toUIMessages } from "@convex-dev/agent/react";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { ConversationStatusButton } from "../components/conversation-status-button";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { cn } from "@workspace/ui/lib/utils";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface ConversationIdViewProps {
  conversationId: Id<"conversations">;
}

const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export const ConversationIdView = ({
  conversationId,
}: ConversationIdViewProps) => {
  const conversation = useQuery(api.private.conversations.getOne, {
    conversationId,
  });

  const messages = useThreadMessages(
    api.private.messages.getMany,
    conversation?.threadId
      ? {
          threadId: conversation.threadId,
        }
      : "skip",
    { initialNumItems: 10 }
  );

  const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } =
    useInfiniteScroll({
      status: messages.status,
      loadMore: messages.loadMore,
      loadSize: 10,
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: "" },
  });

  const [isEnhancing, setIsEnhancing] = React.useState(false);
  const enhanceResponse = useAction(api.private.messages.enhanceResponse);
  const handleEnhanceResponse = async () => {
    setIsEnhancing(true);
    const currentValue = form.getValues("message");

    try {
      const response = await enhanceResponse({
        prompt: currentValue,
      });

      form.setValue("message", response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const createMessage = useMutation(api.private.messages.create);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!conversation || isEnhancing) {
      return;
    }

    try {
      await createMessage({
        conversationId: conversationId,
        prompt: values.message,
      });

      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState(false);
  const updateConversationStatus = useMutation(
    api.private.conversations.updateStatus
  );
  const handleToggleStatus = async () => {
    if (!conversation) {
      return;
    }

    setIsUpdatingStatus(true);

    let newStatus: "unresolved" | "resolved" | "escalated";

    // Cycle through states: unresolved -> escalated -> resolved -> unresolved
    if (conversation.status === "unresolved") {
      newStatus = "escalated";
    } else if (conversation.status === "escalated") {
      newStatus = "resolved";
    } else {
      newStatus = "unresolved";
    }

    try {
      await updateConversationStatus({
        conversationId,
        status: newStatus,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (conversation === undefined || messages.status === "LoadingFirstPage") {
    return <ConversationIdViewLoading />;
  }

  return (
    <div className="flex h-full flex-col bg-muted">
      <header className="flex items-center justify-between border-b bg-background p-2.5">
        <Button size="sm" variant="ghost">
          <MoreHorizontalIcon />
        </Button>

        {!!conversation && (
          <ConversationStatusButton
            disabled={isUpdatingStatus}
            status={conversation?.status}
            onClick={handleToggleStatus}
          />
        )}
      </header>

      <AIConversation className="max-h-[calc(100vh-180px)]">
        <AIConversationContent>
          <InfiniteScrollTrigger
            canLoadMore={canLoadMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
            ref={topElementRef}
          />
          {toUIMessages(messages.results ?? [])?.map((message) => (
            <AIMessage
              key={message.id}
              //   In reverse, because we are watching from "assistance" perspective
              from={message.role === "user" ? "assistant" : "user"}
            >
              <AIMessageContent>
                <AIResponse>{message.content}</AIResponse>
              </AIMessageContent>

              {message.role === "user" && (
                <DicebearAvatar
                  seed={conversation?.contactSessionId ?? "user"}
                  badgeImageUrl={"/logo.svg"}
                  size={32}
                />
              )}
            </AIMessage>
          ))}
        </AIConversationContent>
        <AIConversationScrollButton />
      </AIConversation>

      <div className="p-2">
        <Form {...form}>
          <AIInput
            className="rounded-none border-x-0 border-b-0"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              disabled={conversation?.status === "resolved"}
              name="message"
              render={({ field }) => (
                <AIInputTextarea
                  disabled={
                    conversation?.status === "resolved" ||
                    form.formState.isSubmitting ||
                    isEnhancing
                  }
                  onChange={field.onChange}
                  value={field.value}
                  placeholder={
                    conversation?.status === "resolved"
                      ? "This conversation has been resolved."
                      : "Type your response as an operator..."
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)();
                    }
                  }}
                />
              )}
            />
            <AIInputToolbar>
              <AIInputTools>
                <AIInputButton
                  onClick={handleEnhanceResponse}
                  disabled={
                    conversation?.status === "resolved" ||
                    !form.formState.isValid ||
                    isEnhancing
                  }
                >
                  <Wand2Icon className={cn(isEnhancing && "animate-pulse")} />
                  {isEnhancing ? "Enhancing..." : "Enhance"}
                </AIInputButton>
              </AIInputTools>

              <AIInputSubmit
                status="ready"
                type="submit"
                disabled={
                  conversation?.status === "resolved" ||
                  !form.formState.isValid ||
                  form.formState.isSubmitting ||
                  isEnhancing
                }
              />
            </AIInputToolbar>
          </AIInput>
        </Form>
      </div>
    </div>
  );
};

const ConversationIdViewLoading = () => (
  <div className="flex h-full flex-col bg-muted">
    <header className="flex items-center justify-between border-b bg-background p-2.5">
      <Button disabled size="sm" variant="ghost">
        <MoreHorizontalIcon />
      </Button>
      <Button disabled size="sm">
        Loading...
      </Button>
    </header>

    <AIConversation className="max-h-[calc(100vh-180px)]">
      <AIConversationContent>
        {Array.from({ length: 8 }).map((_, i) => {
          const isUser = i % 2 === 0;
          const widths = ["w-48", "w-60", "w-72"];
          const width = widths[i % widths.length];

          return (
            <div
              key={i}
              className={cn(
                "group flex w-full justify-end gap-2 py-2 [&>div]:max-w-[80%]",
                isUser ? "is-user" : "is-assistant flex-row-reverse"
              )}
            >
              <Skeleton className={`h-9 ${width} rounded-lg`} />
              <Skeleton className="size-8 rounded-full" />
            </div>
          );
        })}
      </AIConversationContent>
    </AIConversation>

    <div className="p-2">
      <AIInput className="rounded-none border-x-0 border-b-0">
        <AIInputTextarea
          disabled
          placeholder="Type your response as an operator..."
        />
        <AIInputToolbar>
          <AIInputTools>
            <AIInputButton disabled>
              <Wand2Icon />
              Enhance
            </AIInputButton>
          </AIInputTools>
          <AIInputSubmit disabled status="ready" />
        </AIInputToolbar>
      </AIInput>
    </div>
  </div>
);
