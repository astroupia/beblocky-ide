"use client";

import { redirect } from "next/navigation";
import { useParams } from "next/navigation";

export default function HomePage() {
  const params = useParams();
  const email = params.email as string;
  // Redirect to the learn page with a default course and guest user
  redirect(`/courses/1/learn/user/${email}`);
}
