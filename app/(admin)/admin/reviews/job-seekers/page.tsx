import { redirect } from "next/navigation";

export default function JobSeekersRedirect() {
  redirect("/admin/reviews/candidates");
}
