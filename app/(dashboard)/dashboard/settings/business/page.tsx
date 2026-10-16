import {redirect} from "next/navigation";
/** Business editing is the same merchant setup journey; legacy links remain supported. */
export default function BusinessSettingsRedirect(){redirect("/dashboard/getting-started?step=business");}
