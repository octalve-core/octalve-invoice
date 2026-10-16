import {redirect} from "next/navigation";
/** Existing saved links remain valid; Customize Invoices is the single settings authority. */
export default function ThemeSettingsRedirect(){redirect("/dashboard/settings/invoice");}
