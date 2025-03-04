import { Timestamp } from "firebase/firestore";

export interface Store {
    id: string;
    name: string;
    userId: string;
    address: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    store_owner: string;
    tax_clearance: string;
    ownerID: string;
    number: string;
}




export interface Billboards {
    id: string;
    label: string;
    imageUrl: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}


export interface Category {
    id: string;
    billboardId: string;
    billboardLabel: string;
    name: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface Model {
    id: string;
    brandId: string;
    brandLabel: string;
    name: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}


export interface Industry {
    id: string;
    name: string;
    value: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface Brand {
    id: string;
    name: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface Product {
    id: string;
    name: string;
    OEM: string;
    price: number;
    qty?: number;
    images: {url: string}[];
    isFeatured?: boolean;
    isArchived: boolean;
    category: string;
    industry: string;
    brand: string;
    model: string;
    year: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    inventory: number;
}

export interface Order {
    id: string;
    isPaid: boolean;
    number: string,
    orderItems: Product[],
    address: string,
    order_status: string,
    clientName: string,
    clientEmail: string,
    createdAt: Timestamp;
    updatedAt: Timestamp;
    method: string;
    store_name: string;
    store_address: string;
    store_id: string;
    userID: string;
    deliveryInstructions: string;
    dnumber: string
}


export interface Part {
    id: string,
    Name: string,
    part_code: string,
    Category: string,
    Make: string,
    Model: string,
    Year: number,
    createdAt: Timestamp;
    updatedAt: Timestamp;

}

export interface Review {
    id: string;
    comment: string;
    userID: string;
    userName: string;
    productID: string;
    createdAt: Timestamp;

}

export interface Wishlist {
    product: string,
    userId: string,
    createdAt: Timestamp;
    updatedAt: Timestamp;
}