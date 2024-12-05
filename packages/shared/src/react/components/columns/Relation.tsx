import { useField } from "duck-form";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { ReferenceHeaderType } from "../../types";

type ReferenceHeaderProps = ReferenceHeaderType & {
  value: {
    _ref: string;
    _type: string;
    title: string;
  };
};

export function RelationCell() {
  const {
    value,
    to: { collection },
  } = useField<ReferenceHeaderProps>();
  const { org } = useParams();

  return (
    <Link
      href={`/organisations/${org}/collections/${collection}/${value._ref}`}
      className="truncate font-semibold text-primary-500 transition-all hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
    >
      {value.title}
    </Link>
  );
}
