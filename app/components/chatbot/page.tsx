import Chatbot from "@/components/chatbot";
import { Metadata } from "next";

export const metadata:Metadata = {
    title: "Shadcn Chatbot Component",
    description: "Chatbot component for shadcn with customisable flow"
}

export default function Page(){
    return (
        <Chatbot/>
    )
}