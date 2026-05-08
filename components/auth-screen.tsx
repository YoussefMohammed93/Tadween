"use client";

import { useState } from "react";
import Image from "next/image";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

const clerkAppearance = {
  layout: {
    socialButtonsVariant: "blockButton" as const,
  },
  variables: {
    colorPrimary: "oklch(0.488 0.243 264.376)",
    colorText: "oklch(0.145 0 0)",
    colorTextSecondary: "oklch(0.556 0 0)",
    colorBackground: "oklch(1 0 0)",
    colorInputBackground: "oklch(1 0 0)",
    colorInputText: "oklch(0.145 0 0)",
    borderRadius: "0.7rem",
    fontFamily: "var(--font-sans)",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "shadow-none w-full",
    card: "shadow-none border-none p-0 bg-transparent w-full",
    header: "hidden",
    footer: "hidden",
    socialButtonsBlockButton:
      "border border-border/80 bg-background shadow-none rounded-xl hover:bg-muted transition-colors font-medium text-foreground",
    socialButtonsBlockButtonText: "font-medium text-sm",
    socialButtonsProviderIcon: "w-[18px] h-[18px]",
    formFieldInput:
      "border border-border bg-background shadow-none rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10",
    formFieldLabel: "text-foreground font-medium text-[13px]",
    formButtonPrimary:
      "bg-primary hover:bg-primary/90 shadow-none border-none rounded-xl font-semibold",
    dividerLine: "bg-border",
    dividerText: "text-muted-foreground text-xs",
    footerActionLink: "text-primary font-medium",
    formFieldAction: "text-primary font-medium",
    identityPreview: "border-border",
    identityPreviewEditButton: "text-primary",
    otpCodeFieldInput: "border-border",
  },
};

export function AuthScreen() {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-muted">
      {/* Auth card */}
      <div
        className="relative z-10 flex w-[min(1080px,95vw)] min-h-[620px] overflow-hidden rounded-2xl bg-background border border-border"
      >
        {/* Left brand panel */}
        <div className="hidden min-[860px]:flex w-[420px] shrink-0 flex-col justify-between bg-primary p-10 text-primary-foreground">
          <div className="flex flex-col gap-8">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Tadween"
                width={60}
                height={60}
                className="brightness-0 invert"
              />
              <span className="font-heading text-2xl font-semibold tracking-tight">
                Tadween
              </span>
            </div>

            {/* Heading */}
            <h1 className="font-heading text-[clamp(1.5rem,2.2vw,1.875rem)] font-bold leading-tight tracking-tight">
              Your personal
              <br />
              productivity space
            </h1>

            {/* Description */}
            <p className="text-[0.938rem] leading-relaxed text-primary-foreground/80">
              Tasks, notes, projects, lectures — everything in one place.
              Organized. Synced. Yours.
            </p>

            {/* Feature list */}
            <div className="mt-2 flex flex-col gap-3.5">
              {[
                "Task management with Kanban boards",
                "Rich text notes & documents",
                "Real-time sync across devices",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2.5 text-sm text-primary-foreground/90"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15">
                    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                      <path
                        d="M3 9.5L7 13.5L15 5.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-primary-foreground/50">
            Built for focus. Designed for clarity.
          </p>
        </div>

        {/* Right auth panel */}
        <div className="flex flex-1 items-center justify-center p-8 md:p-10">
          <div className="flex w-full max-w-[400px] flex-col gap-7">
            {/* Clerk form */}
            <div className="flex justify-center">
              {mode === "sign-in" ? (
                <SignIn
                  routing="hash"
                  appearance={clerkAppearance}
                  signUpUrl="/#sign-up"
                />
              ) : (
                <SignUp
                  routing="hash"
                  appearance={clerkAppearance}
                  signInUrl="/#sign-in"
                />
              )}
            </div>

            {/* In-page Toggle */}
            <div className="text-center text-sm text-muted-foreground mt-2">
              {mode === "sign-in" ? (
                <p>
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => setMode("sign-up")}
                    className="text-primary font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <button
                    onClick={() => setMode("sign-in")}
                    className="text-primary font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
