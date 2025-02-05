import * as React from "react"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import RequestAComponent from "@/components/request-a-component"
import { Bot } from "lucide-react"

// This page displays items from the custom registry.
// You are free to implement this with your own design as needed.

export default function Home() {
  return (
    <div className="p-4 max-w-4xl w-full mx-auto">
      <section className="text-center py-16 px-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-500 dark:from-purple-400 to-blue-500 dark:to-blue-400 text-transparent bg-clip-text">
          Extend ShadCN with Advanced Components
        </h2>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          Shadfinity is built on top of <a href="https://ui.shadcn.com/docs" target="_blank" className=" text-primary font-semibold hover:underline">ShadCN</a>, offering advanced frontend components.
        </p>
      </section>

      <section id="components" className="py-14 px-8">
        <h3 className="text-3xl font-bold text-center">Featured Components</h3>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Link href='/components/chatbot'>
            <Card className="p-6">
              <h4 className="text-xl font-semibold flex gap-2 items-center"><Bot/>Chatbot</h4>
              <p className="text-muted-foreground mt-2">A simple chatbot component with customisable flow</p>
            </Card>
          </Link>
          <Card className="p-6">
            <h4 className="text-xl font-semibold">More Coming Soon...</h4>
            <p className="text-muted-foreground mt-2">Stay tuned for more innovative components.</p>
            <RequestAComponent/>
          </Card>
        </div>
      </section>

      <footer className="py-8 text-center text-muted-foreground border-t">
        <p>&copy; 2025 Shadfinity. Built with ❤️ on ShadCN.</p>
      </footer>
    </div>
  )
}
