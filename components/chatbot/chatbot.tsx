"use client"

import Chatbot from "@/registry/chatbot"
import { useState } from "react"

export default function ChatbotDemo(){
    const [state,setState] = useState<any>()
    return (
        <Chatbot config={{
            name: "Chatbot",
            image: "https://shadfinity.sanjaybora.in/images/chatbot.png",
            initialStep: 'start',
            tooltip: 'Hello',
            flow: {
                start: {
                    delay: 500,
                    message: 'Hi, How may I help you?',
                    options: ['What can you do?','Form example'],
                    inputboxDisabled:true,
                    next:(value:any)=>{
                        if(value=="What can you do?"){
                            return "what_can_you_do"
                        }
                        else if(value=="Form example"){
                            return "form_start"
                        }
                        else{
                            return "start"
                        }
                    }
                },
                what_can_you_do:{
                    delay:500,
                    message: "I can do anything",
                    autoNext:true,
                    next: 'start'
                },
                //form
                form_start:{
                    delay:500,
                    message:"What is your name?",
                    validation: (value:any)=>{
                        if(value.length<3){
                            return "⚠️ Name must be atleast three characters long"
                        }else{
                            setState((prev:any)=>({...prev,name:value}))
                            return true
                        }
                    },
                    next: "ask_age"
                },
                ask_age:{
                    delay:500,
                    message: "What is your age?",
                    validation: (value:any)=>{
                        if(isNaN(value)){
                            return "⚠️ Age must be numeric"
                        }else if(value<1||value>100){
                            return "⚠️ Age can't be less than 1 or more than 100"
                        }else{
                            setState((prev:any)=>({...prev,age:value}))
                            return true
                        }
                    },
                    next: 'form_finish'
                },
                form_finish:{
                    delay:500,
                    message: `Thank you ${state?.name} for your response.\n Your age - ${state?.age} has been recorded`,
                    autoNext:true,
                    next: ()=>{
                        window.alert(`Name:${state?.name}\nAge:${state?.age}`)
                        return 'start'
                    }
                }
            }
        }} />
    )
}