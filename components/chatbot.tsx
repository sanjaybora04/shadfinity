"use client"

import Chatbot from "@/registry/chatbot/chatbot"

export default function ChatbotDemo(){
    return (
        <Chatbot config={{
            name: "chatbot",
            image: "/images/chatbot.png",
            initialStep: 'start',
            tooltip: 'Hello',
            flow: {
                start: {
                    delay: 500,
                    message: 'Hi, How may I help you?'
                }
            }
        }} />
    )
}