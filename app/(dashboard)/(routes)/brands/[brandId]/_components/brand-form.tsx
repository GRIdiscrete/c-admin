"use client"
import { Heading } from "@/components/heading"
import { AlertModal } from "@/components/modal/alert-modal"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {  Brand} from "@/types-db"

import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { deleteObject, ref } from "firebase/storage"
import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

interface BrandFormProps {
    initialData: Brand;
}

const formSchema = z.object({
    name: z.string().min(1),
});



export const BrandForm = ({initialData}: BrandFormProps) => {



    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });

    const [isLoading, setIsloading] = useState(false);
    const [open, setOpen] = useState(false);
    const params = useParams()
    const router = useRouter()
  

    const title = initialData ? "Edit Brand" : "Create Brand";
    const description = initialData ? "Edit a Brand" : "Create a new Brand";
    const toastMessage = initialData ? "Brand Updated" : "Created Brand";
    const action = initialData ? "Save Changes" : "Create Brand";


    const onSubmit = async (data : z.infer<typeof formSchema>) => {
        try {
            setIsloading(true);




            if(initialData){
                console.log("-----------------AAAAAAAAAAA___________________")
                await axios.patch(`/api/brands/${params.brandId}`, data);
            }
            else {
                await axios.post(`/api/brands`, data);

            }
            toast.success("Brand Updated");
            router.refresh();
            router.push(`/brands`)



        } catch (error) {
            toast.error("Something went wrong");
        }
        finally{
            router.refresh();
            setIsloading(false)
        }
    }

    const onDelete = async() => {
        try {
            setIsloading(true);

            await axios.delete(`/api/brands/${params.brandId}`);


            toast.success("brand Removed");
            router.refresh();
            router.push(`/api/brands`);


        } catch (error) {
            toast.error("Something went wrong");
        }
        finally{
            setIsloading(false)
            setOpen(false);
        }
    }


  return <>
    <AlertModal isOpen={open} onClose={() => setOpen(false)}
        onConfirm={onDelete} loading={isLoading}/>
    <div className="flex items-center justify-center">
        <Heading title={title} description={description}/>
        {initialData && 
            <Button
            disabled={isLoading}
            variant={"destructive"} size={"icon"}
            onClick={()=>setOpen(true)}>
                <Trash className="h-4 w-4"/>
            </Button>
        }

    </div>

    <Separator/>

    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} 
                    className="w-full space-y-8">
                        
                        <div className="grid grid-cols-3 gap-8">
                        <FormField control={form.control} name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={isLoading}
                                    placeholder="Brand Name"
                                    {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>


                        {/* <FormField control={form.control} name="value"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Specification</FormLabel>
                                <FormControl>
                                    <Input disabled={isLoading}
                                    placeholder="Sub-Industry"
                                    {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/> */}

                        


                        </div>
                            <Button disabled={isLoading} type="submit" size={"sm"}
                            >Save Changes
                            </Button>

                    </form>
                </Form>
                


  </>
}
