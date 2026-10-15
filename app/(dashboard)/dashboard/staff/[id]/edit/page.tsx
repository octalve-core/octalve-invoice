"use client";
import {useParams} from "next/navigation";
import {StaffEditor} from "@/src/features/catalog/StaffEditor";
export default function EditStaffPage(){const {id}=useParams<{id:string}>();return <StaffEditor editId={id}/>;}
