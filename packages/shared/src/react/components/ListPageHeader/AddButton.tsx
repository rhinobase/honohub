"use client";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@rafty/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type AddButton = { name: string };

export function AddButton(props: AddButton) {
  const pathname = usePathname();

  const icon = <PlusIcon className="size-4 stroke-[3]" />;

  return (
    <Link href={`${pathname}/create`}>
      <Button
        colorScheme="primary"
        leftIcon={icon}
        className="hidden md:flex"
        title={`Create ${props.name}`}
      >
        Create {props.name}
      </Button>
      <Button colorScheme="primary" size="icon" className="md:hidden">
        {icon}
      </Button>
    </Link>
  );
}
