"use client";
import {
  CopyButton,
  LoadingComponent,
  type jsonValidator as schema,
} from "@honohub/shared";
import { Editor, type OnMount } from "@monaco-editor/react";
import { eventHandler } from "@rafty/ui";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import type z from "zod";
import { FormatCodeButton } from "./FormatCodeButton";

export const FORM_ID = "Editor";

export type QueryEditorForm = {
  onSubmit: (values: z.infer<typeof schema>) => void;
};

export function QueryEditorForm({ onSubmit }: QueryEditorForm) {
  const { resolvedTheme } = useTheme();
  const [editorInstance, setEditorInstance] =
    useState<Parameters<OnMount>[0]>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useFormContext<z.infer<typeof schema>>();

  const handleEditorMount: OnMount = (editor) => setEditorInstance(editor);

  // format code function
  const handleFormat = eventHandler(() => {
    if (editorInstance)
      editorInstance.getAction("editor.action.formatDocument")?.run();
  });

  return (
    <form
      id={FORM_ID}
      onSubmit={handleSubmit(onSubmit, console.error)}
      className="h-full relative max-h-[400px] md:max-h-none"
    >
      <Controller
        name="editor"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Editor
            className="h-full"
            language="json"
            value={value}
            theme={resolvedTheme === "light" ? "vs-light" : "vs-dark"}
            onMount={handleEditorMount}
            onChange={onChange}
            loading={<LoadingComponent>Loading Editor...</LoadingComponent>}
            options={{
              minimap: {
                enabled: false,
              },
            }}
          />
        )}
      />
      {errors.editor && (
        <div className="absolute bottom-0 p-2 bg-red-500 dark:bg-red-400 left-0 w-full text-white text-sm">
          {String(errors.editor.message)}
        </div>
      )}
      <UtilityButtons onFormat={handleFormat} />
    </form>
  );
}

function UtilityButtons(props: { onFormat: ReturnType<typeof eventHandler> }) {
  const { control } = useFormContext();
  const query = useWatch({ control, name: "editor" });

  return (
    <div className="absolute top-2 right-4 flex items-center gap-2">
      <CopyButton data={query} />
      <FormatCodeButton isDisabled={!query} onFormat={props.onFormat} />
    </div>
  );
}
