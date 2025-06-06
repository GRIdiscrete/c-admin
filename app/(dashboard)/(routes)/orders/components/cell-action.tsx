"use client"

import { useRouter } from "next/navigation"
import { OrderColumns } from "./columns"
import { useParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Car, Copy, Edit, Home, MoreVertical, Phone, Trash } from "lucide-react"
import { DropdownMenuContent,  DropdownMenu, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import toast from "react-hot-toast"
import axios from "axios"
import { AlertModal } from "@/components/modal/alert-modal"
import { useOrigin } from "@/hooks/use-origin"
import emailjs from 'emailjs-com';

interface CellActionProps {
    data: OrderColumns
}

export const    CellAction = ({data}: CellActionProps) => {
    const router = useRouter()
    const params = useParams()
    const origin = useOrigin()

    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(false)

     const onCopy = (id: string) => {
        navigator.clipboard.writeText(id)
        toast.success("Phone number copied to clipboard")
     }
     const onCopyUrl = (id: string) => {
        navigator.clipboard.writeText(id)
        toast.success("Order Link copied to clipboard")
     }

     const onDelete = async() => {

        try {
            setIsLoading(true);

            const response = await axios.delete(`/api/orders/single/${data.id}`);

            console.log(response)
            toast.success("Order Removed");
            router.push(`/orders`);
            router.refresh();


        } catch (error) {
            toast.error("Something went wrong");
        }
        finally{
            setIsLoading(false)
            setOpen(false);
        }
    }
    const onUpdate = async (data: any, email: string, name: string) => {
        try {
            setIsLoading(true);
            const response = await axios.patch(`/api/orders/single/${data.id}`, data);
            
            // Only show success toast if the PATCH request was successful
            toast.success("Order Updated");
            
            // Optional: You might want to check response.status or response.data here
            // if you need to verify specific success conditions
            
            router.push(`/orders`);
    
            // EmailJS code commented out as in your original
            // if you uncomment it, you might want to handle its success/error separately

                        // emailjs.send("service_miw5uzq", "template_pclaerv", {
            //     to_email: email,
            //     message: `Your order is now  ${data.order_status}. Track your order online, or contact us for assistance`,
            //     from_name: "Carspian Auto",
            //     to_name: name
            //   }, 'NgwZzNEQN_63SAnSw')
            //   .then((result) => {
            //   }, (error) => {
            //     console.log(error.text);
            //     toast.error('Failed to complete Order. Please contact admin.')})

    
        } catch (error) {
            toast.error("Something Went Wrong");
        } finally {
            router.refresh();
            setIsLoading(false);
        }
    }


  
  
    return <>
        <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isLoading} />
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="h-8 w-8 p-0" variant={"ghost"}>
                    <span className="sr-only">Open</span>
                    <MoreVertical className="h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onCopy(data.number)}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call Client
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                    console.log(data)
                    onCopyUrl(`${origin}/${data.id}/driver-portal`)
                }}>
                    <Phone className="h-4 w-4 mr-2" />
                    Copy Driver Link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdate({id: data.id, 
                    order_status: 'Delivering',
                    store_id: data.store_id
                },data.clientName, data.clientEmail,)}>
                    <Car className="h-4 w-4 mr-2" />
                    Delivering
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdate({id: data.id, 
                    order_status: 'Delivered',
                    store_id: data.store_id
                },data.clientName, data.clientEmail,)}>
                    <Home className="h-4 w-4 mr-2" />
                    Delivered
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdate({id: data.id, 
                    order_status: 'Processing',
                    store_id: data.store_id
                },data.clientName, data.clientEmail,)}>
                    <Home className="h-4 w-4 mr-2" />
                    Processing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpen(true)}>
                    <Trash className="h-4 w-4 mr-2" />
                    Decline
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </>
}
