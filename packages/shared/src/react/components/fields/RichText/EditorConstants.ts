// @ts-expect-error
import CheckList from "@editorjs/checklist";
import Code from "@editorjs/code";
import Delimiter from "@editorjs/delimiter";
import Embed from "@editorjs/embed";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import InlineCode from "@editorjs/inline-code";
// @ts-expect-error
import LinkTool from "@editorjs/link";
import List from "@editorjs/list";
// @ts-expect-error
import Marker from "@editorjs/marker";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import Underline from "@editorjs/underline";
import Warning from "@editorjs/warning";
import axios from "axios";
import { endpoint } from "../../../utils";

export function editorJsTools(org: string | string[]) {
  return {
    embed: Embed,
    table: Table,
    marker: Marker,
    list: List,
    warning: Warning,
    code: Code,
    linkTool: {
      class: LinkTool,
      config: {
        endpoint: "/editor/link",
      },
    },
    image: {
      class: ImageTool,
      config: {
        endpoints: {
          byFile: "/editor/link",
          byUrl: "/editor/link",
        },
        uploader: {
          uploadByFile: async (file: File) => {
            try {
              const filename = file.name.split(".");
              filename.pop();

              const signature = await endpoint
                .get(`/spaces/${org}/signature?filename=${filename.join("-")}`)
                .then((res) => res.data)
                .catch((err) => console.error(err));

              if (!signature) return null;

              // Adding the data
              const form = new FormData();
              form.set("file", file);
              form.set("api_key", signature.apikey);
              form.set("timestamp", signature.timestamp);
              form.set("signature", signature.signature);
              form.set("public_id", signature.public_id);

              // Sending the request to upload the data and returning the response
              return axios
                .post(
                  `https://api.cloudinary.com/v1_1/${signature.cloudname}/auto/upload`,
                  form,
                )
                .then((res) => ({
                  success: 1,
                  file: {
                    ...res.data,
                    url: res.data.secure_url,
                  },
                }));
            } catch (error) {
              console.error(error);
            }
          },
        },
      },
    },
    header: {
      class: Header,
      config: {
        placeholder: "Enter a header",
        levels: [1, 2, 3],
        defaultLevel: 3,
      },
    },
    quote: Quote,
    checklist: CheckList,
    delimiter: Delimiter,
    inlineCode: InlineCode,
    underline: Underline,
  };
}
