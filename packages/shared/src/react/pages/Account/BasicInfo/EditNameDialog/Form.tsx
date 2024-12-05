"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  DialogFooter,
  FieldWrapper,
  InputField,
  eventHandler,
} from "@rafty/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import type z from "zod";
import { useAuth } from "../../../../providers";
import { getProfileQueryKey } from "../../../../queries";
import { handleError } from "../../../../utils";
import { userValidation } from "../../../../validations";

const schema = userValidation.pick({ first_name: true, last_name: true });

export type EditNameForm = {
  onSubmit?: () => void;
};

export function EditNameForm(props: EditNameForm) {
  const queryClient = useQueryClient();
  const { profile, updateName } = useAuth();

  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: profile?.first_name,
      last_name: profile?.last_name,
    },
  });

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
    reset,
    setError,
  } = methods;

  const profileQueryKey = getProfileQueryKey();

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof schema>) => updateName(values),
    // TODO: Aditya please check if we should keep the commented code or not
    // onMutate: async (values): Promise<Profile | undefined> => {
    //   // Cancel current queries for the content list
    //   await queryClient.cancelQueries({ queryKey:profileQueryKey, exact: true });

    //   let previousData: Profile | undefined = undefined;

    //   queryClient.setQueryData<Profile>(profileQueryKey, (data) => {
    //     previousData = data;

    //     if (data) {
    //       data.first_name = values.first_name;
    //       data.last_name = values.last_name;
    //     }

    //     return data;
    //   });

    //   return previousData;
    // },
    onSuccess: () => {
      props.onSubmit?.();
    },
    onError: (err, _, previousData) => {
      // queryClient.setQueryData<Profile>(profileQueryKey, (data) => {
      //   if (data) {
      //     data.first_name = previousData?.first_name ?? "";
      //     data.last_name = previousData?.last_name ?? "";
      //   }
      //   return data;
      // });

      handleError(err, setError);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: profileQueryKey });
      reset();
    },
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(
          (values) => mutation.mutateAsync(values),
          console.error,
        )}
        className="space-y-2 md:space-y-3 w-full"
      >
        <FieldWrapper name="first_name" label="First Name" isRequired>
          <InputField {...register("first_name")} />
        </FieldWrapper>
        <FieldWrapper name="last_name" label="Last Name" isRequired>
          <InputField {...register("last_name")} />
        </FieldWrapper>
        <DialogFooter className="justify-end !mt-3 md:!mt-4 lg:!mt-5">
          <ResetButton />
          <Button
            type="submit"
            colorScheme="primary"
            loadingText="Saving"
            isLoading={isSubmitting}
          >
            Save
          </Button>
        </DialogFooter>
      </form>
    </FormProvider>
  );
}

function ResetButton() {
  const { profile } = useAuth();
  const { reset, control } = useFormContext<z.infer<typeof schema>>();
  const { first_name, last_name } = useWatch({ control });

  const handleResetForm = eventHandler(() =>
    reset({ first_name: profile?.first_name, last_name: profile?.last_name }),
  );

  return (
    <Button
      isDisabled={
        first_name === profile?.first_name && last_name === profile?.last_name
      }
      onClick={handleResetForm}
      onKeyDown={handleResetForm}
    >
      Reset
    </Button>
  );
}
