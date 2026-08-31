import {
  QueryKey,
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";

import { handleApiError } from "@/api/handlers";
import type { ApiResponse } from "@/api/types";
import { useNetwork } from "@/hooks/use-network";
import {
  DEFAULT_OFFLINE_MESSAGE,
  isOfflineActionError,
  OfflineActionError,
} from "@/lib/network/offline";
import { invalidateQuery } from "@/lib/tanstack-query/methods";
import { toast } from "@/lib/toast";

export { isOfflineActionError, OfflineActionError };

interface UseActionProps<
  TVariables,
  TData = unknown,
  TContext = unknown,
> extends Omit<
  UseMutationOptions<ApiResponse<TData>, Error, TVariables, TContext>,
  "mutationFn"
> {
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>;
  successMessage?: string;
  errorMessage?: string;
  disableSuccessToast?: boolean;
  disableErrorToast?: boolean;
  disableOfflineToast?: boolean;
  offlineMessage?: string;
  requiresConnection?: boolean;
  invalidateQueries?: readonly QueryKey[];
}

export function useAction<
  TVariables = void,
  TData = unknown,
  TContext = unknown,
>({
  mutationFn,
  successMessage,
  errorMessage,
  disableSuccessToast,
  disableErrorToast,
  disableOfflineToast,
  offlineMessage = DEFAULT_OFFLINE_MESSAGE,
  requiresConnection = true,
  invalidateQueries,
  onSuccess,
  onError,
  ...options
}: UseActionProps<TVariables, TData, TContext>): UseMutationResult<
  ApiResponse<TData>,
  Error,
  TVariables,
  TContext
> {
  const { status } = useNetwork();

  return useMutation<ApiResponse<TData>, Error, TVariables, TContext>({
    ...options,
    networkMode: "always",
    mutationFn: async (variables) => {
      if (requiresConnection && status !== "online") {
        throw new OfflineActionError(offlineMessage);
      }

      return mutationFn(variables);
    },

    onSuccess: async (data, variables, onMutateResult, context) => {
      if (invalidateQueries?.length) {
        await Promise.all(
          invalidateQueries.map((queryKey) => invalidateQuery(queryKey)),
        );
      }
      await onSuccess?.(data, variables, onMutateResult, context);
      if (!disableSuccessToast) {
        toast.success(successMessage || data.message || "Sucesso");
      }
    },

    onError: async (error, variables, onMutateResult, context) => {
      if (isOfflineActionError(error)) {
        if (!disableOfflineToast) {
          toast.warning(error.message);
        }
      } else if (!disableErrorToast) {
        if (errorMessage) {
          toast.error(errorMessage);
        } else {
          handleApiError(error);
        }
      }

      await onError?.(error, variables, onMutateResult, context);
    },
  });
}
