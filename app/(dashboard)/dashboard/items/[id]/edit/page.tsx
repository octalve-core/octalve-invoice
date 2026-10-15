"use client";
import {useParams} from "next/navigation";
import {ItemEditor} from "@/src/features/catalog/ItemEditor";
export default function EditItemPage(){const {id}=useParams<{id:string}>();return <ItemEditor editId={id}/>;}
