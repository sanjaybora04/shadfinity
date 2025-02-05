"use client"

import Chatbot from "@/components/ui/chatbot"

export default function ChatbotDemo(){
    return (
        <Chatbot config={{
            name: "chatbot",
            image: "https://shadfinity.sanjaybora.in/images/chatbot.png",
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