"use client"
import { Heading } from "@/components/heading"
import { AlertModal } from "@/components/modal/alert-modal"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { storage } from "@/lib/firebase"
import { Order, Product } from "@/types-db"
import emailjs from 'emailjs-com';
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { deleteObject, ref } from "firebase/storage"
import { Phone, Redo, Trash, Package, PackageCheck, Truck, CheckCircle, DollarSign, AlertCircle } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import React, { MouseEventHandler, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { number, z } from "zod"
import Checkbox from "./checkbox"
import { ProductModal } from "@/components/modal/product-modal"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DeleteModal } from "@/components/modal/delete-modal"
import { DeliveryModal } from "@/components/modal/delivery-modal"
import { DeliveredModal } from "@/components/modal/deliver-modal"
import { PaidModal } from "@/components/modal/paidmodal"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible"
import { OrderColumns } from "@/app/(dashboard)/(routes)/orders/components/columns"
import { PhoneModal } from "@/components/modal/phone-modal"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface OrderFormProps {
    initialData: Order[];
    userId: string;
}

const schema = z.object({
    product_collected: z.boolean().refine(val => val === true, {
      message: "You must collect all the products",
    }),
    delivering: z.boolean(),
    delivered: z.boolean(),
    declined: z.boolean(),
    paid: z.boolean(),
    product: z.boolean(),
});

interface ProductSummary {
    name: string;
    store_name: string;
    store_address: string;
    quantity: number;
    image: string;
    make: string;
    model: string;
    year: number;
    orderId: string,
    productId: string,
    storeaddress: string,
    price: number,
    isPaid: boolean,
    dnumber: string
}

export const OrderPage = ({initialData, userId}: OrderFormProps) => {
    if(!initialData || initialData.length == 0){
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
                    <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No Pending Orders For this Client</h3>
                    <p className="mt-2 text-sm text-gray-500">This client currently has no active orders to manage.</p>
                </div>
            </div>
        )
    }

    const name = initialData[0].clientName || ""
    const email = initialData[0].clientEmail || ""

    // State declarations (unchanged from original)
    const [open, setOpen] = useState(false);
    const [Dopen, setDOpen] = useState(false);
    const [Deliveringopen, setDeliveringOpen] = useState(false);
    const [Deliveredopen, setDeliveredOpen] = useState(false);
    const [Paidopen, setPaidOpen] = useState(false);
    const [isLoading, setIsloading] = useState(false);
    const [isDelivering, setIsDelivering] = useState(false);
    const [isDelivered, setIsDelivered] = useState(false);
    const [isDeclined, setIsDeclined] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const [allProducts, setAllProducts] = useState<ProductSummary[]>([]);
    const [checkedProducts, setCheckedProducts] = useState(allProducts.map(() => false));
    const [Phoneopen, setPhoneOpen] = useState(false);
    const [dnumber, setdnumber] = useState('');

    const params = useParams()
    const router = useRouter()

    // Calculate total and populate allProducts (unchanged from original)
    let total = 0;
    initialData.forEach(order => {
        order.orderItems.forEach(product => {
            const quantity = product.qty || 0;
            const productTotal = product.price * quantity;
            total += productTotal;
            const productExists = allProducts.some(p => p.productId === product.id);

            if (!productExists) {
                allProducts.push({
                    name: product.name,
                    store_name: order.store_name,
                    store_address: order.store_address,
                    quantity: product.qty || 0,
                    image: product.images[0]?.url || '',
                    make: product.OEM,
                    model: product.model,
                    year: product.year,
                    orderId: order.id,
                    productId: product.id,
                    storeaddress: order.store_address,
                    price: product.price,
                    isPaid: order.isPaid,
                    dnumber: order.dnumber
                });
            }
        });
    });

    let orderIds: string[] = [];
    for(const x of allProducts){
        if(!orderIds.includes(x.orderId)){
            orderIds.push(x.orderId)
        }
    }

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            product_collected: false,
            delivering: false,
            delivered: false,
            declined: false,
            paid: false,
            product: false,
        },
    });




      useEffect(() => {
        let allChecked = checkedProducts.every(Boolean);
        form.setValue('product_collected', allChecked);
      }, [checkedProducts, form]);

      const handleCheckboxChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
  
        const newCheckedProducts = [...checkedProducts];
        newCheckedProducts[index] = event.target.checked;
        setCheckedProducts(newCheckedProducts);

      };





      const handleDeliveryChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
        const allChecked = checkedProducts.every(product => product === true);

        setDeliveringOpen(allChecked);
        
        if (!allChecked){
            toast.error("Collect all products first")
        }
       

      };










      const handleDeliveredChange = () => async (event: React.ChangeEvent<HTMLInputElement>) => {
        const allChecked = checkedProducts.every(product => product === true);



            setDeliveredOpen(allChecked);


           

            if(!allChecked){
            toast.error("Collect All products or decline order")
        }
        
        

      };

      const handlePaidChange = () => async (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("Anything");
        const allChecked = checkedProducts.every(product => product === true);

        setPaidOpen(allChecked);
        if(!allChecked) {
            toast.error("Please Collect all Products first")
        }
        

      };

      const delivering = async (status: string) => {
        let data = {}
        data = {
            order_status: status,
            isPaid: false,
            
        }

        try {
            
            await axios.patch(`/api/orders/${initialData[0].id}`, data);

            toast.success("Order Status Updated")

            emailjs.send("service_miw5uzq", "template_pclaerv", {
                to_email: email,
                message: "Your order is now being Delivered. Track your order online, or contact us for assistance",
                from_name: "Carspian Auto",
                to_name: name
              }, 'NgwZzNEQN_63SAnSw')
              .then((result) => {
              }, (error) => {
                console.log(error.text);
                toast.error('Failed to complete Order. Please contact admin.')})

            setDeliveringOpen(false)
            setIsDelivering(true);
        }
         catch (error) {
            console.log(error)
        }
      }

      const delivered = async (status: string) => {
        let data = {}
        data = {
            order_status: status,
            isPaid: false,
        }

        try {
            
            await axios.patch(`/api/orders/${userId}`, data);

            toast.success("Order Status Updated")

            emailjs.send("service_miw5uzq", "template_pclaerv", {
                to_email: email,
                message: "Your order has been successfully delivered. Please feel free to leave a review for each product you purchased!",
                from_name: "Carspian Auto",
                to_name: name
              }, 'NgwZzNEQN_63SAnSw')
              .then((result) => {
              }, (error) => {
                console.log(error.text);
                toast.error('Failed to complete Order. Please contact admin.')})

            setDeliveredOpen(false)
            setIsDelivered(true);
        }
         catch (error) {
            console.log(error)
        }
      }

      const paid = async (status: string) => {
        let data = {}
        if(isDelivered && isDelivering){
            data = {
                order_status: 'Delivered',
                isPaid: true,
                
            }
        }
        else {
            data = {
                order_status: 'Processing', 
                isPaid: true,
                
            }
        }

        if(isDelivered){
            try {
            
                await axios.patch(`/api/orders/${userId}`, data);
    
                toast.success("Order Status Updated")
    
                setPaidOpen(false)
                setIsPaid(true);
            }
             catch (error) {
                console.log(error)
            }
        }
        else{
            toast.error("Please check Delivered box first")
        }


      }



    // const productsCollected = watch('products').every(product => product.collected);

  



    const completeOrder =async()=>{
        setIsloading(true);



        let data = {
            order_status: "Complete",
            isPaid:  isPaid,
        }

        try {
            
            await axios.patch(`/api/orders/${userId}`, data);

            toast.success("Order Complete")

            emailjs.send("service_miw5uzq", "template_pclaerv", {
                to_email: email,
                message: "Your order has been successfully delivered, paid for and completed. You can still view it under completed orders if you would like to reorder it. ",
                from_name: "Carspian Auto",
                to_name: name
              }, 'NgwZzNEQN_63SAnSw')
              .then((result) => {
                setIsloading(false)
              }, (error) => {
                console.log(error.text);
                toast.error('Failed to complete Order. Please contact admin.')})


            setIsloading(false)
            router.refresh();
        }
         catch (error) {
            console.log(error)
        }


    }


    const onSubmit = async () => {
        event?.preventDefault()
        setIsloading(true)
        console.log("Big Me");
        if(isPaid){
            completeOrder();
        }
       
            else{
                toast.error("Please confirm products are collected and invoice is paid.")
            }

    }


    const onDeleteOrder = async () => {
        event?.preventDefault();



            setDOpen(true);
    }

    const completeDelete = async () => {
        console.log("Hey!!!!");
        try {

            await axios.delete(`../../api/decline/${userId}`)
            .catch(error => {
                console.error('Error:', error.message);
            });

            // event?.preventDefault();
 

            setDOpen(false)
            router.refresh();
            toast.success("Order deleted Successfully")
            // router.push(`/new`);
            // router.refresh();
            // toast.success("Order Declined");

        } catch (error) {
            toast.error("Problem with declining order")
            console.log(error)
        }
        
    };

    const removeProd = async (id: string, order : string) => {
        event?.preventDefault()
        try {
            setIsloading(true)
            const updatedProducts = allProducts.filter(product => product.productId !== id);
            console.log(allProducts)

            const { data: orderData } = await axios.get(`../../api/orders/single2/${order}`);
            
            // Filter out the product with the matching productId

            const updatedOrderItems = orderData.orderItems.filter((item : Product)  => item.id !== id);

            
            // Update the order with the new orderItems array
            const response = await axios.patch(`../../api/orders/single2/${order}`, {
                orderItems: updatedOrderItems
            });
            if(response.status == 200){
                setAllProducts(updatedProducts);
                setIsloading(false)
                toast.success("Product Removed")
                router.refresh();
                
            }

        } catch (error) {
            console.log(error)
        }


    } 

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id)
        toast.success("Phone number copied to clipboard")
     }


     const phone = async (id: string) => {
        try {
            setIsloading(true)
            console.log(id)
            for (const x of orderIds){
                console.log(x)
                const response = await axios.patch(`../../api/orders/single3/${x}`, {
                    dnumber: id
                });
            }
            setdnumber(id);
            setPhoneOpen(false);
            setIsloading(false);
            toast.success("Number Updated");
            router.refresh
              
        } catch (error) {
            
        }

     }

     const completionPercentage = Math.round(
        (checkedProducts.filter(Boolean).length / allProducts.length) * 100
    );

    

     return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Order Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
                    <p className="text-sm text-gray-500">Client: {name} ({email})</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                        onClick={() => onCopy(initialData[0].number)}
                    >
                        <Phone className="h-4 w-4" />
                        Call Client
                    </Button>
                    
                    <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                        onClick={() => setPhoneOpen(true)}
                    >
                        <Redo className="h-4 w-4" />
                        Set Driver Number
                    </Button>
                </div>
            </div>

            {/* Progress Tracker */}
            <div className="mb-8 bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-500" />
                    Order Progress
                </h2>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Products Collected</span>
                            <span className="text-sm text-gray-500">
                                {checkedProducts.filter(Boolean).length}/{allProducts.length}
                            </span>
                        </div>
                        <Progress value={completionPercentage} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`p-3 rounded-lg border ${isDelivering ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                            <div className="flex items-center gap-2">
                                <Truck className={`h-5 w-5 ${isDelivering ? 'text-green-500' : 'text-gray-400'}`} />
                                <span className={`font-medium ${isDelivering ? 'text-green-700' : 'text-gray-600'}`}>
                                    Delivering
                                </span>
                            </div>
                        </div>
                        
                        <div className={`p-3 rounded-lg border ${isDelivered ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                            <div className="flex items-center gap-2">
                                <PackageCheck className={`h-5 w-5 ${isDelivered ? 'text-green-500' : 'text-gray-400'}`} />
                                <span className={`font-medium ${isDelivered ? 'text-green-700' : 'text-gray-600'}`}>
                                    Delivered
                                </span>
                            </div>
                        </div>
                        
                        <div className={`p-3 rounded-lg border ${isPaid ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                            <div className="flex items-center gap-2">
                                <DollarSign className={`h-5 w-5 ${isPaid ? 'text-green-500' : 'text-gray-400'}`} />
                                <span className={`font-medium ${isPaid ? 'text-green-700' : 'text-gray-600'}`}>
                                    Payment
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Section */}
            <div className="mb-8">
                <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-500" />
                    Products ({allProducts.length})
                </h2>
                
                <Form {...form}>
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {allProducts.map((product, index) => (
                                <Controller
                                    key={product.productId}
                                    disabled={isLoading}
                                    name={`product`}
                                    control={form.control}
                                    render={({ field }) => (
                                        <Card className="hover:shadow-md transition-shadow">
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <Checkbox
                                                                checked={checkedProducts[index]}
                                                                onChange={handleCheckboxChange(index)}
                                                            />
                                                            <FormLabel className="font-medium">
                                                                {product.name}
                                                            </FormLabel>
                                                        </div>
                                                        <Badge variant="outline" className="text-xs">
                                                            {product.make} {product.model} ({product.year})
                                                        </Badge>
                                                    </div>
                                                    
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="text-red-500 hover:text-red-700"
                                                        onClick={() => removeProd(product.productId, product.orderId)}
                                                    >
                                                        <Trash className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                
                                                <Collapsible>
                                                    <CollapsibleTrigger className="w-full mt-3">
                                                        <div className="flex items-center justify-between text-sm text-gray-500 hover:text-blue-500 cursor-pointer">
                                                            <span>View details</span>
                                                            <svg className="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                            </svg>
                                                        </div>
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent className="mt-3 space-y-2 text-sm">
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div>
                                                                <p className="text-gray-500">Store</p>
                                                                <p className="font-medium">{product.store_name}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-500">Address</p>
                                                                <p className="font-medium">{product.store_address}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-500">Quantity</p>
                                                                <p className="font-medium">{product.quantity}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-500">Unit Price</p>
                                                                <p className="font-medium">${product.price}</p>
                                                            </div>
                                                        </div>
                                                        <div className="pt-2">
                                                            <p className="text-gray-500">Total</p>
                                                            <p className="font-medium text-lg">
                                                                ${(product.price * product.quantity).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </CollapsibleContent>
                                                </Collapsible>
                                            </CardContent>
                                        </Card>
                                    )}
                                />
                            ))}
                        </div>
                    </form>
                </Form>
            </div>

            {/* Order Summary and Actions */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-blue-500" />
                    Order Summary
                </h2>
                
                <div className="space-y-6">
                    <div className="flex justify-between items-center border-b pb-4">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">${total.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center border-b pb-4">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium">$0.00</span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-4">
                        <span className="text-lg font-medium">Total</span>
                        <span className="text-lg font-bold">${total.toFixed(2)}</span>
                    </div>
                    
                    <Form {...form}>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField 
                                    control={form.control} 
                                    name="delivering"
                                    render={({field}) => (
                                        <FormItem className="space-y-0">
                                            <div className="flex items-center space-x-2">
                                                <FormControl>
                                                    <Checkbox 
                                                        checked={isDelivering}
                                                        onChange={handleDeliveryChange()}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal flex items-center gap-2">
                                                    <Truck className="h-4 w-4" />
                                                    Delivering
                                                </FormLabel>
                                            </div>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                
                                <FormField 
                                    control={form.control} 
                                    name="delivered"
                                    render={({field}) => (
                                        <FormItem className="space-y-0">
                                            <div className="flex items-center space-x-2">
                                                <FormControl>
                                                    <Checkbox 
                                                        checked={isDelivered}
                                                        onChange={handleDeliveredChange()}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal flex items-center gap-2">
                                                    <PackageCheck className="h-4 w-4" />
                                                    Delivered
                                                </FormLabel>
                                            </div>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                
                                <FormField 
                                    control={form.control} 
                                    name="paid"
                                    render={({field}) => (
                                        <FormItem className="space-y-0">
                                            <div className="flex items-center space-x-2">
                                                <FormControl>
                                                    <Checkbox 
                                                        checked={isPaid}
                                                        onChange={handlePaidChange()}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal flex items-center gap-2">
                                                    <DollarSign className="h-4 w-4" />
                                                    Invoice Paid
                                                </FormLabel>
                                            </div>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <Button 
                                    variant="destructive" 
                                    className="flex-1 gap-2"
                                    onClick={onDeleteOrder}
                                    disabled={isLoading}
                                >
                                    <AlertCircle className="h-4 w-4" />
                                    Decline Order
                                </Button>
                                
                                <Button 
                                    className="flex-1 gap-2"
                                    disabled={isLoading} 
                                    onClick={() => onSubmit}
                                >
                                    <CheckCircle className="h-4 w-4" />
                                    Complete Order
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-12 text-center text-sm text-gray-500">
                © 2025 Developed by <a href="https://gorillaresearch.net" className="hover:text-blue-600">Niakazi Technology Solutions</a>
            </footer>

            {/* Modals (unchanged from original) */}
            <DeleteModal 
                isOpen={Dopen} 
                onClose={() => setDOpen(false)}
                onConfirm={() => completeDelete()} 
                loading={isLoading} 
                useriD={userId} 
            />
            
            <DeliveryModal 
                isOpen={Deliveringopen} 
                onClose={() => setDeliveringOpen(false)}
                onConfirm={() => delivering("Delivering")} 
                loading={isLoading}
            />
            
            <DeliveredModal 
                isOpen={Deliveredopen} 
                onClose={() => setDeliveredOpen(false)}
                onConfirm={() => delivered("Delivered")} 
                loading={isLoading}
            />
            
            <PaidModal 
                isOpen={Paidopen} 
                onClose={() => setPaidOpen(false)}
                onConfirm={() => paid("Paid")} 
                loading={isLoading}
            />
            
            <PhoneModal 
                isOpen={Phoneopen} 
                onClose={() => setPhoneOpen(false)}
                onConfirm={phone} 
                loading={isLoading}
            />
        </div>
    )
}