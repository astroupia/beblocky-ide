import { redirect } from "next/navigation";
import { encryptEmail } from "@/lib/utils";

export default function HomePage() {
  // Redirect to the learn page with a default course and guest user
  const guestEmail = encryptEmail("guest");
  redirect(`/courses/1/learn/user/${guestEmail}`);
}
