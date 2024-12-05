"use client";
import { useParams } from "next/navigation";
import { useAuth, useCollection } from "../../providers";
import { CopyButton } from "../CopyButton";

export function IDCopyButton() {
  const { col } = useParams();
  const { profile } = useAuth();
  const { current: currentCollection } = useCollection();

  if (profile?.dev && col)
    return (
      <CopyButton
        data={currentCollection._id}
        tooltipContent="Copy Collection ID"
        className="p-1.5 md:p-2 [&>*]:stroke-[2.5] [&>*]:md:size-5"
      />
    );
}
