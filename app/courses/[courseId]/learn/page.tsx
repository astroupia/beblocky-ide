"use client";

import { useParams } from "next/navigation";
import { redirect } from "next/navigation";

export default function LearnPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const email = params.email as string; // Get email from URL parameter

  // Redirect to the learn page with a default course and guest user
  redirect(`/courses/${courseId}/learn/user/${email}`);
}
