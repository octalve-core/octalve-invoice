"use client";
import {Suspense} from "react";
import {useSearchParams} from "next/navigation";
import {ItemEditor} from "@/src/features/catalog/ItemEditor";
function ItemPage(){const params=useSearchParams();return <ItemEditor editId={params.get("edit")||undefined}/>;}
export default function AddItemPage(){return <Suspense fallback={null}><ItemPage/></Suspense>;}
