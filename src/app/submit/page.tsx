import type { Metadata } from "next";
import { SubmitForm } from "./SubmitForm";

export const metadata: Metadata = {
  title: "Leave a review",
  description:
    "Share your honest experience of a UK rental property. Anonymous, free, and takes about 5 minutes.",
};

export default function SubmitPage() {
  return <SubmitForm />;
}
