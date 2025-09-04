# B2B SaaS AI Support Platform

This repository contains the code for a B2B SaaS AI-powered customer support platform. The platform provides real-time AI chat, voice support, knowledge base creation, and more.

## Key Features

- **Real-time AI Chat**: Engage with users in real-time using AI agents built with Convex.
- **Voice Support**: Integrated voice support using VAPI.
- **Knowledge Base**: Upload documents to build a knowledge base for the AI using embeddings and RAG.
- **Smart Escalation**: Configure the AI to escalate conversations to a human or auto-resolve them.
- **Multi-tenancy**: Support for workspaces and teams.
- **Authentication & Billing**: User authentication and billing managed by Clerk.
- **Embeddable Widget**: A chat widget that can be easily embedded into any website.
- **API Key Management**: Securely store API keys using AWS.
- **Error Tracking**: Monitor and track errors with Sentry.

## Tech Stack

- **Framework**: Next.js
- **Backend**: Convex
- **Authentication**: Clerk
- **Voice**: VAPI
- **Styling**: Tailwind CSS
- **UI**: shadcn/ui
- **Monorepo**: Turborepo, pnpm

## Project Structure

This project is a monorepo using pnpm workspaces and Turborepo.

- `apps/web`: The main web application dashboard.
- `apps/widget`: The customer-facing chat widget.
- `apps/embed`: The embeddable script for the chat widget.
- `packages/backend`: The Convex backend with schema, functions, and configuration.
- `packages/ui`: Shared UI components built with shadcn/ui.
- `packages/eslint-config`: Shared ESLint configurations.
- `packages/typescript-config`: Shared TypeScript configurations.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/ai-support-platform.git
    cd ai-support-platform
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the necessary API keys and environment variables for services like Convex, Clerk, VAPI, and AWS.

4.  **Run the development server:**
    ```bash
    pnpm dev
    ```

This will start the development servers for all the applications in the monorepo.