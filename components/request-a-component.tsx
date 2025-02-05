'use client'

import { useForm } from "react-hook-form"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { Textarea } from "./ui/textarea"
import { toast } from "sonner"
import axios from "axios"

const formSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email(),
    details: z.string().min(1,{message:"Required"})
  })

  type formType = z.infer<typeof formSchema>

export default function RequestAComponent() {

    const form = useForm<formType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          email: "",
          details:"",
        },
      }) 

      async function onSubmit(values: formType) {
        const id = toast.loading('Submitting...')
        const res = await axios.post('/api/request',values)
        if(res.status==200){
            toast.success('🎉We got your response!\nThanks for contributing, We will get back to you soon.',{id})
            form.reset()
        }else{
            toast.error("Error Submitting form, Please try again!!")
        }
      }

    return (
        <Dialog>
            <DialogTrigger className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 mt-2 text-white rounded">Request a component</DialogTrigger>
            <DialogContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="details"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Component details</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter the details of required component" className="h-20" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}