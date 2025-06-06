"use client"
import { Heading } from "@/components/heading"
import { AlertModal } from "@/components/modal/alert-modal"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { storage } from "@/lib/firebase"
import { Billboards, Category } from "@/types-db"

import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { deleteObject, ref } from "firebase/storage"
import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

interface CategoryFormProps {
    initialData: Category;
    billboards: Billboards[];
}

const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1),
});



export const CategoryForm = ({initialData, billboards}: CategoryFormProps) => {



    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });

    const [isLoading, setIsloading] = useState(false);
    const [open, setOpen] = useState(false);
    const params = useParams()
    const router = useRouter()
  

    const title = initialData ? "Edit Category" : "Create Category";
    const description = initialData ? "Edit a Category" : "Create a new Category";
    const toastMessage = initialData ? "Category Updated" : "Created Category";
    const action = initialData ? "Save Changes" : "Create Category";


    const onSubmit = async (data : z.infer<typeof formSchema>) => {
        try {
            setIsloading(true);


            const {billboardId: formBillId} = form.getValues()
            const matchingBillboard = billboards.find((item) => item.id === formBillId)

            if(initialData){
                await axios.patch(`/api/categories/${params.categoryId}`, {
                    ...data,
                    billboardLabel: matchingBillboard?.label,
                });
            }
            else {
                await axios.post(`/api/categories`, {
                    ...data,
                    billboardLabel: matchingBillboard?.label,
                });

            }
            toast.success("Store Updated");
            router.refresh();
            router.push(`/categories`)



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

            await axios.delete(`/api/category/${params.categoryId}`);


            toast.success("Category Removed");
            router.refresh();
            router.push(`/api/categories`);


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
                                <FormLabel>Label</FormLabel>
                                <FormControl>
                                    <Input disabled={isLoading}
                                    placeholder="Your Category Name"
                                    {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>

                        <FormField control={form.control} name="billboardId"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Billboard</FormLabel>
                                <FormControl>
                                    <Select
                                    disabled={isLoading}
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                defaultValue={field.value}
                                                placeholder="Select a Billboard" />
                                            </SelectTrigger>
                                        </FormControl>
                                            <SelectContent>
                                                {billboards.map(billboard => (
                                                    <SelectItem
                                                    key={billboard.id}
                                                    value={billboard.id}>
                                                        {billboard.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>


                        </div>
                            <Button disabled={isLoading} type="submit" size={"sm"}
                            >Save Changes
                            </Button>

                    </form>
                </Form>
                


  </>
}
