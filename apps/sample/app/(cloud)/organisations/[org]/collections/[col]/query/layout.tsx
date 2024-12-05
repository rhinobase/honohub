"use client";
import { jsonValidator as schema } from "@honohub/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PropsWithChildren } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type z from "zod";

export default function QueryLayout(props: PropsWithChildren) {
  const methods = useForm<z.infer<typeof schema>>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: {
      editor: "[]",
    },
  });

  return <FormProvider {...methods}>{props.children}</FormProvider>;
}
