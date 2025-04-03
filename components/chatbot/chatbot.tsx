"use client"

import Chatbot from "@/registry/chatbot"
import { useState } from "react"
import { Button } from "@/components/ui/button"

function RickRoll({ onSubmit }: { onSubmit: any }) {
    const [state,setState] = useState({
        disabled:false
    })
    return (
        <div>
                <img src="https://gifdb.com/images/featured/rickroll-n9ut8v7peqq8bnen.gif" className="h-44" />
                <div className="mt-2">
                    <div>I can do anything</div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                    <Button onClick={() => { onSubmit('start');setState({disabled:true}) }} disabled={state.disabled}>Start Again</Button>
                    </div>
                </div>
        </div>
    )
}

export default function ChatbotDemo() {
    const [state, setState] = useState<any>()
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
                        else if (value == "Form example") {
                            return "form_start"
                        }
                        else {
                            return "start"
                        }
                    }
                },
                what_can_you_do: {
                    delay: 500,
                    render: (onSubmit)=><RickRoll onSubmit={onSubmit}/>,
                    next: 'start'
                },
                //form
                form_start: {
                    delay: 500,
                    message: "What is your name?",
                    validation: (value: any) => {
                        if (value.length < 3) {
                            return "⚠️ Name must be atleast three characters long"
                        } else {
                            setState((prev: any) => ({ ...prev, name: value }))
                            return true
                        }
                    },
                    next: "ask_age"
                },
                ask_age: {
                    delay: 500,
                    message: "What is your age?",
                    validation: (value: any) => {
                        if (isNaN(value)) {
                            return "⚠️ Age must be numeric"
                        } else if (value < 1 || value > 100) {
                            return "⚠️ Age can't be less than 1 or more than 100"
                        } else {
                            setState((prev: any) => ({ ...prev, age: value }))
                            return true
                        }
                    },
                    next: 'form_finish'
                },
                form_finish: {
                    delay: 500,
                    message: `Thank you ${state?.name} for your response.\n Your age - ${state?.age} has been recorded`,
                    autoNext: true,
                    next: () => {
                        window.alert(`Name:${state?.name}\nAge:${state?.age}`)
                        return 'start'
                    }
                }
            }
        }} />
    )
}