import { db } from "@/lib/firebase";
import fs from 'fs';
import path from 'path';
import {  Category } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export const POST = async (reQ: Request,
) => {
    try {
        const {userId} = auth()
        const body = await reQ.json()
    
        if(!userId){
            return new NextResponse("Unauthorized", {status: 400})
        }
    


        const sample =     [
            {
                "Name": "Oxygen Sensor",
                "Ref No": null,
                "Condition": null,
                "Category": "Air Intake",
                "Make": "Toyota",
                "Model": "Camry,",
                "part_code": "89465-39105",
                "Price": "$99.61",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-oxygen-sensor-8946539105?c=bD0xJm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//s3.amazonaws.com/static.revolutionparts.com/assets/images/toyota.png",
                "Year": "1984"
            },
            {
                "Name": "Air Filter",
                "Ref No": null,
                "Condition": null,
                "Category": "Air Intake",
                "Make": "Toyota",
                "Model": "Land Cruiser",
                "part_code": "17801-61010",
                "Price": "$21.24",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-air-filter-1780161010?c=bD0yJm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//s3.amazonaws.com/static.revolutionparts.com/assets/images/toyota.png",
                "Year": "1984"
            },
            {
                "Name": "Air Filter",
                "Ref No": null,
                "Condition": null,
                "Category": "Air Intake",
                "Make": "Toyota",
                "Model": "Corolla,",
                "part_code": "17801-15010",
                "Price": "$21.24",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-air-filter-1780115010?c=bD0zJm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//dz310nzuyimx0.cloudfront.net/strapr1/8b4e38a7e05375b473f1dd191328cf5f/c1f2b5efaeeb3cf765eb8c63b7fef007.png",
                "Year": "1984"
            },
            {
                "Name": "Air Filter",
                "Ref No": null,
                "Condition": null,
                "Category": "Air Intake",
                "Make": "Toyota",
                "Model": "Celica,",
                "part_code": "17801-64010",
                "Price": "$21.24",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-air-filter-1780164010?c=bD00Jm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//dz310nzuyimx0.cloudfront.net/strapr1/f99a7831c4861d970f976d0d94fd40de/ed36f85d6bb80185a00fe91f62fa34af.png",
                "Year": "1984"
            },
            {
                "Name": "Air Filter",
                "Ref No": null,
                "Condition": null,
                "Category": "Air Intake",
                "Make": "Toyota",
                "Model": "4Runner,",
                "part_code": "17801-70010",
                "Price": "$21.24",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-air-filter-1780170010?c=bD01Jm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//dz310nzuyimx0.cloudfront.net/strapr1/249c5836bb0c6d945c1fb0c91bedd887/07061a9196eb1bd70dc165379ab7c641.png",
                "Year": "1984"
            },
            {
                "Name": "Engine Air Filter",
                "Ref No": null,
                "Condition": null,
                "Category": "Air Intake",
                "Make": "Toyota",
                "Model": "Camry,",
                "part_code": "17801-55010",
                "Price": "$21.24",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-engine-air-filter-1780155010?c=bD02Jm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//dz310nzuyimx0.cloudfront.net/strapr1/76d0241fb0b37c4b58553efe436f3dc9/07d60849dff9a53f15a2d0e8785b0113.png",
                "Year": "1984"
            },
            {
                "Name": "Engine Air Filter",
                "Ref No": null,
                "Condition": null,
                "Category": "Air Intake",
                "Make": "Toyota",
                "Model": "4Runner,",
                "part_code": "17801-41090",
                "Price": "$21.24",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-engine-air-filter-1780141090?c=bD03Jm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//dz310nzuyimx0.cloudfront.net/strapr1/0fb9774c72b3b0a04e2f168feb6be604/7c0719e4809d5c4c82b5962ff24e4cca.png",
                "Year": "1984"
            },
            {
                "Name": "Engine Air Filter",
                "Ref No": null,
                "Condition": null,
                "Category": "Air Intake",
                "Make": "Toyota",
                "Model": "Celica",
                "part_code": "17801-41110",
                "Price": "$21.24",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-engine-air-filter-1780141110?c=bD04Jm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//s3.amazonaws.com/static.revolutionparts.com/assets/images/toyota.png",
                "Year": "1984"
            },
            {
                "Name": "Alternator",
                "Ref No": null,
                "Condition": null,
                "Category": "Alternators",
                "Make": "Toyota",
                "Model": "4Runner,",
                "part_code": "27060-35060-84",
                "Price": "$125.58",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-alternator-270603506084?c=bD0xJm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//dz310nzuyimx0.cloudfront.net/strapr1/a6f090276934ddaab93b5fb88e243727/1ed28009a59615c6fcd23a1e7f8c1e93.png",
                "Year": "1984"
            },
            {
                "Name": "Alternator Belt",
                "Ref No": null,
                "Condition": null,
                "Category": "Alternators",
                "Make": "Toyota",
                "Model": "4Runner,",
                "part_code": "99331-10870-83",
                "Price": "$7.28",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-alternator-belt-993311087083?c=bD0yJm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//s3.amazonaws.com/static.revolutionparts.com/assets/images/toyota.png",
                "Year": "1984"
            },
            {
                "Name": "Alternator Belt",
                "Ref No": null,
                "Condition": null,
                "Category": "Alternators",
                "Make": "Toyota",
                "Model": "Celica,",
                "part_code": "99365-20970-83",
                "Price": "$16.36",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-alternator-belt-993652097083?c=bD0zJm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//s3.amazonaws.com/static.revolutionparts.com/assets/images/toyota.png",
                "Year": "1984"
            },
            {
                "Name": "Alternator Mount Bracket",
                "Ref No": null,
                "Condition": null,
                "Category": "Alternators",
                "Make": "Toyota",
                "Model": "Pickup",
                "part_code": "12311-54091",
                "Price": "$161.27",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-alternator-mount-bracket-1231154091?c=bD00Jm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//s3.amazonaws.com/static.revolutionparts.com/assets/images/toyota.png",
                "Year": "1984"
            },
            {
                "Name": "AC Belt",
                "Ref No": null,
                "Condition": null,
                "Category": "Alternators",
                "Make": "Toyota",
                "Model": "Camry,",
                "part_code": "99365-51110-83",
                "Price": "$19.84",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-ac-belt-993655111083?c=bD01Jm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//s3.amazonaws.com/static.revolutionparts.com/assets/images/toyota.png",
                "Year": "1984"
            },
            {
                "Name": "Radiator Cap",
                "Ref No": null,
                "Condition": null,
                "Category": "Radiators",
                "Make": "Toyota",
                "Model": "Corolla,",
                "part_code": "16401-15210",
                "Price": "$18.99",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-radiator-cap-1640115210?c=bD0xJm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//dz310nzuyimx0.cloudfront.net/strapr1/9673673ab9cdb4914402d72f821ff8a9/f0f1bcdd707f6929c726e50521628d6a.png",
                "Year": "1984"
            },
            {
                "Name": "Radiator Cap",
                "Ref No": null,
                "Condition": null,
                "Category": "Radiators",
                "Make": "Toyota",
                "Model": "4Runner,",
                "part_code": "16401-36011",
                "Price": "$18.99",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-radiator-cap-1640136011?c=bD0yJm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//dz310nzuyimx0.cloudfront.net/strapr1/1c0b37825fac4543c77740963cea3654/b342d4f72e431d748dc287f108c72e2a.png",
                "Year": "1984"
            },
            {
                "Name": "Radiator Cap",
                "Ref No": null,
                "Condition": null,
                "Category": "Radiators",
                "Make": "Toyota",
                "Model": "4Runner,",
                "part_code": "16401-63010",
                "Price": "$18.99",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-radiator-cap-1640163010?c=bD0zJm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//dz310nzuyimx0.cloudfront.net/strapr1/9673673ab9cdb4914402d72f821ff8a9/f0f1bcdd707f6929c726e50521628d6a.png",
                "Year": "1984"
            },
            {
                "Name": "Hose,  Radiator,  Outlet",
                "Ref No": null,
                "Condition": null,
                "Category": "Radiators",
                "Make": "Toyota",
                "Model": "4Runner,",
                "part_code": "16572-35030",
                "Price": "$28.36",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-hose-radiator-outlet-1657235030?c=bD00Jm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//dz310nzuyimx0.cloudfront.net/strapr1/2bb671a4223a82baa61c42236dd7caa2/34e2a9cf59c54275933c9230a77cde8d.png",
                "Year": "1984"
            },
            {
                "Name": "Hose,  Radiator,  Inlet",
                "Ref No": null,
                "Condition": null,
                "Category": "Radiators",
                "Make": "Toyota",
                "Model": "4Runner,",
                "part_code": "16571-35180",
                "Price": "$36.41",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-hose-radiator-inlet-1657135180?c=bD01Jm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//dz310nzuyimx0.cloudfront.net/strapr1/2bb671a4223a82baa61c42236dd7caa2/34e2a9cf59c54275933c9230a77cde8d.png",
                "Year": "1984"
            },
            {
                "Name": "Pipe,  Radiator,  No. 7",
                "Ref No": null,
                "Condition": null,
                "Category": "Radiators",
                "Make": "Toyota",
                "Model": "4Runner,",
                "part_code": "16577-35070",
                "Price": "$95.39",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-pipe-radiator-no-7-1657735070?c=bD02Jm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//dz310nzuyimx0.cloudfront.net/strapr1/767f1f98c4e155b369da5c5b61c5b93f/79677b05bae624aed7cae80794ca1a94.png",
                "Year": "1984"
            },
            {
                "Name": "Radiator Support Brace",
                "Ref No": null,
                "Condition": null,
                "Category": "Radiators",
                "Make": "Toyota",
                "Model": "Corolla",
                "part_code": "53915-12060",
                "Price": "$18.84",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-radiator-support-brace-5391512060?c=bD03Jm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//dz310nzuyimx0.cloudfront.net/strapr1/738c0ce297f3c527d47bc86a777928c5/dd265628e743414bda603b2dc7c4ce60.png",
                "Year": "1984"
            },
            {
                "Name": "Upper Hose",
                "Ref No": null,
                "Condition": null,
                "Category": "Radiators",
                "Make": "Toyota",
                "Model": "Pickup",
                "part_code": "16571-54130",
                "Price": "$21.96",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-upper-hose-1657154130?c=bD04Jm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//dz310nzuyimx0.cloudfront.net/strapr1/2bb671a4223a82baa61c42236dd7caa2/34e2a9cf59c54275933c9230a77cde8d.png",
                "Year": "1984"
            },
            {
                "Name": "Lower Hose",
                "Ref No": null,
                "Condition": null,
                "Category": "Radiators",
                "Make": "Toyota",
                "Model": "Land Cruiser",
                "part_code": "90916-01056",
                "Price": "$18.99",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-lower-hose-9091601056?c=bD05Jm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//dz310nzuyimx0.cloudfront.net/strapr1/2bb671a4223a82baa61c42236dd7caa2/34e2a9cf59c54275933c9230a77cde8d.png",
                "Year": "1984"
            },
            {
                "Name": "Upper Hose",
                "Ref No": null,
                "Condition": null,
                "Category": "Radiators",
                "Make": "Toyota",
                "Model": "Land Cruiser",
                "part_code": "90916-01172",
                "Price": "$28.74",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-upper-hose-9091601172?c=bD0xMCZuPUR5bmFtaWMgU0VPIFBhZ2U%3D",
                "Photo": "//dz310nzuyimx0.cloudfront.net/strapr1/2bb671a4223a82baa61c42236dd7caa2/34e2a9cf59c54275933c9230a77cde8d.png",
                "Year": "1984"
            },
            {
                "Name": "Lower Hose",
                "Ref No": null,
                "Condition": null,
                "Category": "Radiators",
                "Make": "Toyota",
                "Model": "Land Cruiser",
                "part_code": "90916-01163",
                "Price": "$16.86",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-lower-hose-9091601163?c=bD0xMSZuPUR5bmFtaWMgU0VPIFBhZ2U%3D",
                "Photo": "//dz310nzuyimx0.cloudfront.net/strapr1/2bb671a4223a82baa61c42236dd7caa2/34e2a9cf59c54275933c9230a77cde8d.png",
                "Year": "1984"
            },
            {
                "Name": "Upper Hose",
                "Ref No": null,
                "Condition": null,
                "Category": "Radiators",
                "Make": "Toyota",
                "Model": "4Runner,",
                "part_code": "16571-35070",
                "Price": "$28.74",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-upper-hose-1657135070?c=bD0xMiZuPUR5bmFtaWMgU0VPIFBhZ2U%3D",
                "Photo": "//dz310nzuyimx0.cloudfront.net/strapr1/767f1f98c4e155b369da5c5b61c5b93f/79677b05bae624aed7cae80794ca1a94.png",
                "Year": "1984"
            },
            {
                "Name": "Lower Hose",
                "Ref No": null,
                "Condition": null,
                "Category": "Radiators",
                "Make": "Toyota",
                "Model": "Corolla",
                "part_code": "16572-16010",
                "Price": "$39.83",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-lower-hose-1657216010?c=bD0xMyZuPUR5bmFtaWMgU0VPIFBhZ2U%3D",
                "Photo": "//dz310nzuyimx0.cloudfront.net/strapr1/b30ef2d2ea96a6ec9fbf769cdcc34a02/4b2415bc3316b6a557a1606c1a31ab29.png",
                "Year": "1984"
            },
            {
                "Name": "Lower Hose",
                "Ref No": null,
                "Condition": null,
                "Category": "Radiators",
                "Make": "Toyota",
                "Model": "Pickup",
                "part_code": "16572-54120",
                "Price": "$55.27",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-lower-hose-1657254120?c=bD0xNCZuPUR5bmFtaWMgU0VPIFBhZ2U%3D",
                "Photo": "//dz310nzuyimx0.cloudfront.net/strapr1/2bb671a4223a82baa61c42236dd7caa2/34e2a9cf59c54275933c9230a77cde8d.png",
                "Year": "1984"
            },
            {
                "Name": "Upper Hose",
                "Ref No": null,
                "Condition": null,
                "Category": "Radiators",
                "Make": "Toyota",
                "Model": "Corolla",
                "part_code": "16571-16010",
                "Price": "$19.99",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-upper-hose-1657116010?c=bD0xNSZuPUR5bmFtaWMgU0VPIFBhZ2U%3D",
                "Photo": "//dz310nzuyimx0.cloudfront.net/strapr1/b30ef2d2ea96a6ec9fbf769cdcc34a02/4b2415bc3316b6a557a1606c1a31ab29.png",
                "Year": "1984"
            },
            {
                "Name": "Lower Hose",
                "Ref No": null,
                "Condition": null,
                "Category": "Radiators",
                "Make": "Toyota",
                "Model": "Pickup",
                "part_code": "16572-54100",
                "Price": "$35.35",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-lower-hose-1657254100?c=bD0xNiZuPUR5bmFtaWMgU0VPIFBhZ2U%3D",
                "Photo": "//dz310nzuyimx0.cloudfront.net/strapr1/2bb671a4223a82baa61c42236dd7caa2/34e2a9cf59c54275933c9230a77cde8d.png",
                "Year": "1984"
            },
            {
                "Name": "Lower Hose",
                "Ref No": null,
                "Condition": null,
                "Category": "Radiators",
                "Make": "Toyota",
                "Model": "Van",
                "part_code": "16572-71010",
                "Price": "$51.23",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-lower-hose-1657271010?c=bD0xNyZuPUR5bmFtaWMgU0VPIFBhZ2U%3D",
                "Photo": "//dz310nzuyimx0.cloudfront.net/strapr1/2bb671a4223a82baa61c42236dd7caa2/34e2a9cf59c54275933c9230a77cde8d.png",
                "Year": "1984"
            },
            {
                "Name": "Lower Hose",
                "Ref No": null,
                "Condition": null,
                "Category": "Radiators",
                "Make": "Toyota",
                "Model": "Corolla",
                "part_code": "16572-64050",
                "Price": "$18.35",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-lower-hose-1657264050?c=bD0xOCZuPUR5bmFtaWMgU0VPIFBhZ2U%3D",
                "Photo": "//dz310nzuyimx0.cloudfront.net/strapr1/9673673ab9cdb4914402d72f821ff8a9/f0f1bcdd707f6929c726e50521628d6a.png",
                "Year": "1984"
            },
            {
                "Name": "Lower Hose",
                "Ref No": null,
                "Condition": null,
                "Category": "Radiators",
                "Make": "Toyota",
                "Model": "4Runner,",
                "part_code": "16572-35060",
                "Price": "$23.86",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-lower-hose-1657235060?c=bD0xOSZuPUR5bmFtaWMgU0VPIFBhZ2U%3D",
                "Photo": "//dz310nzuyimx0.cloudfront.net/strapr1/767f1f98c4e155b369da5c5b61c5b93f/79677b05bae624aed7cae80794ca1a94.png",
                "Year": "1984"
            },
            {
                "Name": "Hose",
                "Ref No": null,
                "Condition": null,
                "Category": "Radiators",
                "Make": "Toyota",
                "Model": "4Runner,",
                "part_code": "16573-38020",
                "Price": "$19.86",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-hose-1657338020?c=bD0yMCZuPUR5bmFtaWMgU0VPIFBhZ2U%3D",
                "Photo": "//dz310nzuyimx0.cloudfront.net/strapr1/2bb671a4223a82baa61c42236dd7caa2/34e2a9cf59c54275933c9230a77cde8d.png",
                "Year": "1984"
            },
            {
                "Name": "Upper Support",
                "Ref No": null,
                "Condition": null,
                "Category": "Radiators",
                "Make": "Toyota",
                "Model": "Corolla",
                "part_code": "53216-12927",
                "Price": "$102.25",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-upper-support-5321612927?c=bD0xJm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//dz310nzuyimx0.cloudfront.net/strapr1/63301b417358e31400f4dfeda85da392/9b1ef930b798e3921ae34f815d65dabe.png",
                "Year": "1984"
            },
            {
                "Name": "Nameplate",
                "Ref No": null,
                "Condition": null,
                "Category": "Radiators",
                "Make": "Toyota",
                "Model": "Land Cruiser",
                "part_code": "75316-90A00",
                "Price": "$106.68",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-nameplate-7531690a00?c=bD0yJm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//s3.amazonaws.com/static.revolutionparts.com/assets/images/toyota.png",
                "Year": "1984"
            },
            {
                "Name": "Air Filter",
                "Ref No": null,
                "Condition": null,
                "Category": "Air Filters",
                "Make": "Toyota",
                "Model": "Corolla,",
                "part_code": "17801-15010",
                "Price": "$21.24",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-air-filter-1780115010?c=bD0xJm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//dz310nzuyimx0.cloudfront.net/strapr1/8b4e38a7e05375b473f1dd191328cf5f/c1f2b5efaeeb3cf765eb8c63b7fef007.png",
                "Year": "1984"
            },
            {
                "Name": "Air Filter",
                "Ref No": null,
                "Condition": null,
                "Category": "Air Filters",
                "Make": "Toyota",
                "Model": "Celica,",
                "part_code": "17801-64010",
                "Price": "$21.24",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-air-filter-1780164010?c=bD0yJm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//dz310nzuyimx0.cloudfront.net/strapr1/f99a7831c4861d970f976d0d94fd40de/ed36f85d6bb80185a00fe91f62fa34af.png",
                "Year": "1984"
            },
            {
                "Name": "Air Filter",
                "Ref No": null,
                "Condition": null,
                "Category": "Air Filters",
                "Make": "Toyota",
                "Model": "4Runner,",
                "part_code": "17801-70010",
                "Price": "$21.24",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-air-filter-1780170010?c=bD0zJm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//dz310nzuyimx0.cloudfront.net/strapr1/249c5836bb0c6d945c1fb0c91bedd887/07061a9196eb1bd70dc165379ab7c641.png",
                "Year": "1984"
            },
            {
                "Name": "Air Filter",
                "Ref No": null,
                "Condition": null,
                "Category": "Air Filters",
                "Make": "Toyota",
                "Model": "Land Cruiser",
                "part_code": "17801-61010",
                "Price": "$21.24",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-air-filter-1780161010?c=bD00Jm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//s3.amazonaws.com/static.revolutionparts.com/assets/images/toyota.png",
                "Year": "1984"
            },
            {
                "Name": "Engine Air Filter",
                "Ref No": null,
                "Condition": null,
                "Category": "Air Filters",
                "Make": "Toyota",
                "Model": "4Runner,",
                "part_code": "17801-41090",
                "Price": "$21.24",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-engine-air-filter-1780141090?c=bD01Jm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//dz310nzuyimx0.cloudfront.net/strapr1/0fb9774c72b3b0a04e2f168feb6be604/7c0719e4809d5c4c82b5962ff24e4cca.png",
                "Year": "1984"
            },
            {
                "Name": "Engine Air Filter",
                "Ref No": null,
                "Condition": null,
                "Category": "Air Filters",
                "Make": "Toyota",
                "Model": "Celica",
                "part_code": "17801-41110",
                "Price": "$21.24",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-engine-air-filter-1780141110?c=bD02Jm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//s3.amazonaws.com/static.revolutionparts.com/assets/images/toyota.png",
                "Year": "1984"
            },
            {
                "Name": "Engine Air Filter",
                "Ref No": null,
                "Condition": null,
                "Category": "Air Filters",
                "Make": "Toyota",
                "Model": "Camry,",
                "part_code": "17801-55010",
                "Price": "$21.24",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-engine-air-filter-1780155010?c=bD03Jm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//dz310nzuyimx0.cloudfront.net/strapr1/76d0241fb0b37c4b58553efe436f3dc9/07d60849dff9a53f15a2d0e8785b0113.png",
                "Year": "1984"
            },
            {
                "Name": "Spark Plug Wire Set",
                "Ref No": null,
                "Condition": null,
                "Category": "Spark Plugs",
                "Make": "Toyota",
                "Model": "4Runner,",
                "part_code": "90919-29055",
                "Price": "$80.87",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-spark-plug-wire-set-9091929055?c=bD0xJm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//s3.amazonaws.com/static.revolutionparts.com/assets/images/toyota.png",
                "Year": "1984"
            },
            {
                "Name": "AC Belt",
                "Ref No": null,
                "Condition": null,
                "Category": "AC System",
                "Make": "Toyota",
                "Model": "Camry,",
                "part_code": "99365-51110-83",
                "Price": "$19.84",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-ac-belt-993655111083?c=bD0xJm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//s3.amazonaws.com/static.revolutionparts.com/assets/images/toyota.png",
                "Year": "1984"
            },
            {
                "Name": "HVAC Pressure Switch",
                "Ref No": null,
                "Condition": null,
                "Category": "AC System",
                "Make": "Toyota",
                "Model": "4Runner,",
                "part_code": "88645-10020",
                "Price": "$24.89",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-hvac-pressure-switch-8864510020?c=bD0yJm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//s3.amazonaws.com/static.revolutionparts.com/assets/images/toyota.png",
                "Year": "1984"
            },
            {
                "Name": "HVAC Pressure Switch",
                "Ref No": null,
                "Condition": null,
                "Category": "AC System",
                "Make": "Toyota",
                "Model": "4Runner,",
                "part_code": "88645-12020",
                "Price": "$10.19",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-hvac-pressure-switch-8864512020?c=bD0zJm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//s3.amazonaws.com/static.revolutionparts.com/assets/images/toyota.png",
                "Year": "1984"
            },
            {
                "Name": "Pressure Cut-Off Switch",
                "Ref No": null,
                "Condition": null,
                "Category": "AC System",
                "Make": "Toyota",
                "Model": "Celica,",
                "part_code": "88645-30250",
                "Price": "$10.19",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-pressure-cut-off-switch-8864530250?c=bD00Jm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//s3.amazonaws.com/static.revolutionparts.com/assets/images/toyota.png",
                "Year": "1984"
            },
            {
                "Name": "Belt",
                "Ref No": null,
                "Condition": null,
                "Category": "AC System",
                "Make": "Toyota",
                "Model": "Tercel",
                "part_code": "99332-10985-83",
                "Price": "$9.28",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-belt-993321098583?c=bD01Jm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//s3.amazonaws.com/static.revolutionparts.com/assets/images/toyota.png",
                "Year": "1984"
            },
            {
                "Name": "Heater Control Valve",
                "Ref No": null,
                "Condition": null,
                "Category": "AC System",
                "Make": "Toyota",
                "Model": "Tercel",
                "part_code": "87240-16040",
                "Price": "$62.96",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-heater-control-valve-8724016040?c=bD02Jm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//s3.amazonaws.com/static.revolutionparts.com/assets/images/toyota.png",
                "Year": "1984"
            },
            {
                "Name": "Blower Motor",
                "Ref No": null,
                "Condition": null,
                "Category": "AC System",
                "Make": "Toyota",
                "Model": "4Runner,",
                "part_code": "87104-89110",
                "Price": "$126.36",
                "Link": "https://toyota.oempartsonline.com//oem-parts/toyota-blower-motor-8710489110?c=bD03Jm49RHluYW1pYyBTRU8gUGFnZQ%3D%3D",
                "Photo": "//dz310nzuyimx0.cloudfront.net/strapr1/90083ec4cb93e0403da72ac09eaa1d7f/26e10ca8748e08bd9791dab0d3c341e6.png",
                "Year": "1984"
            }
        ]
        for(const x of sample){

            const {Name, Category, part_code, Year,Make, Model, Photo} = x;

            console.log(Name)
            console.log(Category)
            console.log(part_code)
            console.log(Year)
            console.log(Make)
            console.log(Model)

            const NameData = {
                Name,
                Category,
                part_code,
                Year,
                Make,
                Model,
                Photo,
                createdAt: serverTimestamp()
            }




            const NameRef = await addDoc(
            collection(db,"data", "wModRJCDon6XLQYmnuPT", "parts2"),
            NameData
                );
            
            const id = NameRef.id;

            await updateDoc(doc(db, "data", "wModRJCDon6XLQYmnuPT", "parts2", id), 
            {...NameData,
                id,
                updatedAt: serverTimestamp()
            }
            );
        

        }

        // const CategoryRef = await addDoc(
        //     collection(db,"data", "wModRJCDon6XLQYmnuPT", "categories"),
        //     CategoryData
        // );


    return NextResponse.json(200)
    
    
    }
   

 catch (error) {
    console.log(`CATEGORIES_POST:${error}`);
    return new NextResponse("Internal Server Error", {status : 500})
}
};


export const GET = async (reQ: Request,
) => {
    try {

        const categoryData = (
            await getDocs(
                collection(doc(db, "data", "wModRJCDon6XLQYmnuPT"), "categories")
            )
        ).docs.map(doc => doc.data()) as Category[];

        return NextResponse.json(categoryData)
    
    
    }
   

 catch (error) {
    console.log(`CATEGORIESS_GET:${error}`);
    return new NextResponse("Internal Server Error", {status : 500})
}
};


