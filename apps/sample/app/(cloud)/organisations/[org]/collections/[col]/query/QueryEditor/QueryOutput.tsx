import { JSONExplorer } from "@rafty/corp";

export type QueryOutput = {
  queryData: [];
};

export function QueryOutput({ queryData }: QueryOutput) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <p className="dark:text-secondary-400 text-secondary-500">
          PIPELINE OUTPUT
        </p>
        <p className="text-sm dark:text-secondary-400 text-secondary-500">
          Sample of {queryData?.length ?? 0} document
        </p>
      </div>
      {queryData?.map((item, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={i}
          className="p-2 rounded-md border border-secondary-200 dark:border-secondary-800"
        >
          <JSONExplorer data={item} />
        </div>
      ))}
    </div>
  );
}
