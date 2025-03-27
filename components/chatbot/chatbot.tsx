"use client";

import Chatbot from "@/registry/chatbot";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ChatbotDemo() {
  const [state, setState] = useState<any>();

  const customMessage = (
    <div className="flex flex-col gap-2">
      <p>Here&apos;s a custom message with components:</p>
      <Card className="p-2">
        <p>This is a card component</p>
        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          And this is a badge
        </span>
      </Card>
    </div>
  );

  const customOptions = [
    "Regular option",
    <div key="badge-option" className="flex items-center gap-2">
      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
        New
      </span>
      <span>Option with badge</span>
    </div>,
    <div key="button-option" className="flex items-center gap-2">
      <Button size="sm">Click me</Button>
      <span>Option with button</span>
    </div>,
  ];

  return (
    <Chatbot
      config={{
        name: "Chatbot",
        image: "https://shadfinity.sanjaybora.in/images/chatbot.png",
        initialStep: "start",
        tooltip: "Hello",
        flow: {
          start: {
            delay: 500,
            message: "Hi, How may I help you?",
            options: ["What can you do?", "Form example", "Custom components"],
            inputboxDisabled: true,
            next: (value: any) => {
              if (value == "What can you do?") {
                return "what_can_you_do";
              } else if (value == "Form example") {
                return "form_start";
              } else if (value == "Custom components") {
                return "custom_components";
              } else {
                return "start";
              }
            },
          },
          what_can_you_do: {
            delay: 500,
            message: "I can do anything",
            autoNext: true,
            next: "start",
          },
          custom_components: {
            delay: 500,
            message: customMessage,
            options: customOptions,
            inputboxDisabled: true,
            next: (value: any) => {
              if (value === "Regular option") {
                return "regular_option_response";
              } else if (value === "option-1") {
                return "badge_option_response";
              } else if (value === "option-2") {
                return "button_option_response";
              }
              return "start";
            },
          },
          regular_option_response: {
            delay: 500,
            message: "You selected the regular option",
            autoNext: true,
            next: "start",
          },
          badge_option_response: {
            delay: 500,
            message: "You selected the option with badge",
            autoNext: true,
            next: "start",
          },
          button_option_response: {
            delay: 500,
            message: "You selected the option with button",
            autoNext: true,
            next: "start",
          },
          //form
          form_start: {
            delay: 500,
            message: "What is your name?",
            validation: (value: any) => {
              if (value.length < 3) {
                return "⚠️ Name must be atleast three characters long";
              } else {
                setState((prev: any) => ({ ...prev, name: value }));
                return true;
              }
            },
            next: "ask_age",
          },
          ask_age: {
            delay: 500,
            message: "What is your age?",
            validation: (value: any) => {
              if (isNaN(value)) {
                return "⚠️ Age must be numeric";
              } else if (value < 1 || value > 100) {
                return "⚠️ Age can't be less than 1 or more than 100";
              } else {
                setState((prev: any) => ({ ...prev, age: value }));
                return true;
              }
            },
            next: "form_finish",
          },
          form_finish: {
            delay: 500,
            message: `Thank you ${state?.name} for your response.\n Your age - ${state?.age} has been recorded`,
            autoNext: true,
            next: () => {
              window.alert(`Name:${state?.name}\nAge:${state?.age}`);
              return "start";
            },
          },
        },
      }}
    />
  );
}
