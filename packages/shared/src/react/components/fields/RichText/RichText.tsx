"use client";
import type { GeneralWrapperProps } from "@duck-form/fields";
import EditorJS from "@editorjs/editorjs";
import { getValue, useBoolean } from "@rafty/ui";
import { useBlueprint, useDuckForm, useField } from "duck-form";
import { useParams } from "next/navigation";
import { useEffect, useId, useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { editorJsTools } from "./EditorConstants";
import "./style.css";
import type { RichTextProps } from "./type";

export function RichText() {
  const { org } = useParams();
  const props = useField<GeneralWrapperProps<RichTextProps>>();
  const { generateId } = useDuckForm();
  const { schema } = useBlueprint();

  const autoId = useId();
  const customId = useMemo(
    () => generateId?.(schema, props),
    [generateId, schema, props],
  );

  const id = customId ?? autoId;

  const { setValue, control } = useFormContext();

  const value = useWatch({ control, name: id });

  const [initialized, setInitialized] = useBoolean();

  const [_, setEditor] = useState<EditorJS>();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setInitialized(true);
  }, [value]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (initialized) {
      setEditor(
        new EditorJS({
          holder: "editorjs",
          // @ts-expect-error
          tools: editorJsTools(org),
          readOnly: getValue(props.readonly),
          // logLevel: LogLevels.ERROR,
          data: value ?? {
            time: new Date().getTime(),
            version: "2.25.0",
          },
          onChange: (api) =>
            api.saver.save().then((data) => setValue(id, data)),
        }),
      );
    }
  }, [initialized]);

  return (
    <div className="min-h-[400px] border border-secondary-300 dark:border-secondary-700 rounded-md px-3 py-1">
      <div id="editorjs" />
    </div>
  );
}
