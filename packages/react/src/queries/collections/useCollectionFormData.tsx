import { FormMode } from "@honohub/shared";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useServer } from "../../providers";

export const getCollectionFormQueryKey = (options: {
  slug: string;
  id?: string;
}) => ["collections", options.slug, options.id];

export function useCollectionFormData(options: { slug: string }) {
  const { id } = useParams();
  const { endpoint } = useServer();
  const formType = id === "create" ? FormMode.CREATE : FormMode.UPDATE;

  const queryKey = getCollectionFormQueryKey({ id, slug: options.slug });

  return useQuery({
    queryKey,
    queryFn: () =>
      endpoint.get(`collections/${options.slug}/${id}`).then((res) => res.data),
    enabled: formType === FormMode.UPDATE,
  });
}
