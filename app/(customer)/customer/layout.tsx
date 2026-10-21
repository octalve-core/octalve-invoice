import type {ReactNode} from "react";
import {PreviewShell} from "@/src/features/experience-preview/PreviewShell";
export default function CustomerLayout({children}:{children:ReactNode}){
 return <PreviewShell experience="customer">{children}</PreviewShell>;
}
