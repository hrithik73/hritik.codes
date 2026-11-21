import { permanentRedirect } from "next/navigation";

// /use is a common typo for /uses
export default function UseRedirect() {
  permanentRedirect("/uses");
}
