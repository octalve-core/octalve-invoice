import type {ReactNode} from "react";
import {PreviewShell} from "@/src/features/experience-preview/PreviewShell";
export default function PlatformLayout({children}:{children:ReactNode}){
 return <PreviewShell experience="admin">{children}</PreviewShell>;
}
