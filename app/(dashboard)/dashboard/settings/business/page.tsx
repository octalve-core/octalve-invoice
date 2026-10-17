import {redirect} from "next/navigation";
/** Historical Settings link retains one canonical business editor. */
export default function BusinessSettingsRedirect(){redirect("/dashboard/getting-started/business");}
