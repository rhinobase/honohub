"use client";
import { usePathname } from "next/navigation";
import { Header } from "../../Components";

export function CreatePage() {
  const pathname = usePathname();
  const slug = pathname.split("/")[2];

  return (
    <>
      <Header slug={slug} basepath="/sample" />
      <div className="space-y-5">
        <h1 className="text-3xl font-bold capitalize">{slug}</h1>
        <div className="w-full py-2 xl:py-5 max-w-4xl mx-auto" />
      </div>
    </>
  );
}
