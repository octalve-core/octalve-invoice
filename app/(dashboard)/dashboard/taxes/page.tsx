import {redirect} from "next/navigation";
/** Legacy route now resolves to the NRS-aware Tax Centre. Do not expose arbitrary tax presets or fake save callbacks. */
export default function TaxesPage(){redirect("/dashboard/tax-centre");}
