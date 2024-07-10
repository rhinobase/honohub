import Link from "next/link";

const DATA = [
  {
    label: "List",
    href: "/sample/list",
  },
  {
    label: "Create",
    href: "/sample/create",
  },
];

export function AdminPage() {
  return (
    <div className="h-full space-y-5">
      <h1 className="text-3xl font-bold">Collections</h1>
      <div className="grid grid-cols-3 gap-4">
        {DATA.map(({ label, href }, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <Link key={index} href={href} className="p-4 border rounded-md">
            <p>{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
