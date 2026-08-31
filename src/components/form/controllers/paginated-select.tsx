"use client";

import type { ApiResponsePaginated } from "@/api/types";
import { ListPaginated } from "@/components/list/list-paginated";
import { Icon } from "@/components/ui/icon";
import { Modal } from "@/components/ui/modal";
import { Search } from "@/components/ui/search";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { usePaginatedList } from "@/hooks/use-paginated-list";
import type { QueryKey } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Controller,
  type FieldValues,
  UseControllerProps,
  useFormContext,
} from "react-hook-form";
import { TouchableOpacity, View } from "react-native";

/**
 * Estrutura base de uma opção do select.
 * Toda opção precisa ter um `id`, que será usado como valor.
 */
interface ControlledPaginatedSelectOption {
  /** Identificador único da opção */
  id: number | string;

  /** Propriedades adicionais da opção */
  [key: string]: any;
}

/**
 * Props do componente ControlledPaginatedSelect.
 *
 * @template TOption Tipo do item retornado pela API
 */
interface ControlledPaginatedSelectProps<
  TOption extends ControlledPaginatedSelectOption,
> {
  /**
   * Label exibido acima do campo
   */
  label: string;

  /**
   * Placeholder exibido quando nenhum item está selecionado
   * @default "Selecione uma opção"
   */
  placeholder?: string;

  /**
   * Desabilita o campo e impede a abertura do modal
   * @default false
   */
  disabled?: boolean;

  /**
   * Chave utilizada pelo React Query para cache e refetch
   * Pode incluir dependências externas
   */
  queryKey: QueryKey;

  /**
   * Função responsável por buscar os dados paginados
   *
   * @param params.pageParam Página atual
   * @param params.search Texto de busca
   * @param params.perPage Quantidade de itens por página
   */
  queryFn: (params: {
    pageParam: number;
    search?: string;
    perPage?: number;
  }) => Promise<ApiResponsePaginated<TOption[]>>;

  /**
   * Função que retorna o label exibido para uma opção
   */
  getOptionLabel: (option: TOption) => string;

  /**
   * Função que retorna o valor (id) de uma opção
   * Esse valor será salvo no formulário
   */
  getOptionValue: (option: TOption) => string | number;

  /**
   * Placeholder do campo de busca
   * @default "Pesquisar..."
   */
  searchPlaceholder?: string;

  /**
   * Texto exibido quando não houver resultados
   * @default "Nenhuma informação encontrada!"
   */
  emptyText?: string;

  /**
   * Quantidade de itens por página
   * @default 10
   */
  perPage?: number;

  /**
   * Título exibido no topo do modal
   * @default "Selecionar"
   */
  modalTitle?: string;

  /**
   * Indica carregamento externo (ex: edição)
   */
  loading?: boolean;

  /**
   * Valor inicial do select (usado principalmente em edição)
   *
   * - Preenche o valor do campo (`id`)
   * - Preenche o objeto (`${name}__object`)
   */
  defaultValue?: Partial<TOption>;

  /**
   * Item selecionado imperativamente de fora do componente
   * Útil quando a seleção vem de outro fluxo
   */
  selectedItem?: Partial<TOption>;

  /**
   * Callback disparado sempre que um item é selecionado ou removido
   */
  onSelectItem?: (item: TOption | null) => void;
}
/**
 * ControlledPaginatedSelect
 *
 * Componente de Select controlado integrado ao React Hook Form,
 * com suporte a:
 *
 * - Paginação infinita
 * - Busca com debounce
 * - Modal nativo
 * - Edição (defaultValue)
 * - Seleção externa imperativa (selectedItem)
 * - Sincronização de valor e objeto
 *
 * ### Estrutura de dados no formulário:
 * - `name`: armazena apenas o ID da opção selecionada
 * - `${name}__object`: armazena o objeto completo
 *
 * @example
 * ```tsx
 * <ControlledPaginatedSelect
 *   control={control}
 *   name="cityId"
 *   label="Cidade"
 *   queryKey={["cities"]}
 *   queryFn={fetchCities}
 *   getOptionLabel={(city) => city.name}
 *   getOptionValue={(city) => city.id}
 * />
 * ```
 */
export function ControlledPaginatedSelect<
  FormType extends FieldValues,
  TOption extends ControlledPaginatedSelectOption,
>({
  control,
  name,
  rules,
  label,
  placeholder = "Selecione uma opção",
  disabled = false,
  queryKey,
  searchPlaceholder = "Pesquisar...",
  emptyText = "Nenhuma informação encontrada!",
  perPage = 10,
  modalTitle = "Selecionar",
  loading = false,
  defaultValue,
  selectedItem,
  queryFn,
  getOptionLabel,
  getOptionValue,
  onSelectItem,
}: UseControllerProps<FormType> & ControlledPaginatedSelectProps<TOption>) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [search, setSearch] = useState("");

  const {
    items,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    refetch,
    total,
    currentTotal,
  } = usePaginatedList({
    queryKey: [...queryKey, search],
    queryFn: ({ pageParam: page }) =>
      queryFn({ pageParam: page, search, perPage }),
  });

  const { setValue, watch } = useFormContext<FormType>();
  const hasHydrated = useRef(false); // Controle de hidratação
  const lastSelectedItemId = useRef<string | number | null>(null); // Controle do selectedItem

  const valueFromForm = watch(name);
  const selectedOption = watch(`${name}__object` as any) as TOption | undefined;

  const openModal = useCallback(() => {
    if (!disabled) setIsModalVisible(true);
  }, [disabled]);

  const closeModal = useCallback(() => {
    setIsModalVisible(false);
    setSearch("");
  }, []);

  const toggleItem = useCallback(
    (item: TOption, onChange: (value: any) => void) => {
      const selectedValue = String(getOptionValue(item));
      if (
        selectedOption &&
        String(getOptionValue(selectedOption)) === selectedValue
      ) {
        onChange(null);
        setValue(`${name}__object` as any, null as any, {
          shouldDirty: false,
          shouldTouch: false,
        });
        if (onSelectItem) {
          onSelectItem(null);
        }
      } else {
        onChange(selectedValue);
        setValue(`${name}__object` as any, item as any, {
          shouldDirty: false,
          shouldTouch: false,
        });
        if (onSelectItem) {
          onSelectItem(item);
        }
      }
      lastSelectedItemId.current = null;
      closeModal();
    },
    [getOptionValue, selectedOption, closeModal, setValue, name, onSelectItem],
  );

  const renderItem = useCallback(
    ({
      item,
      onChange,
      value,
    }: {
      item: TOption;
      onChange: (value: any) => void;
      value: any;
    }) => {
      const isSelected = String(getOptionValue(item)) === String(value);

      return (
        <SelectItem
          item={item}
          isSelected={isSelected}
          onPress={() => toggleItem(item, onChange)}
          getOptionLabel={getOptionLabel}
        />
      );
    },
    [getOptionLabel, getOptionValue, toggleItem],
  );

  const selectedLabel = useMemo(() => {
    return selectedOption ? getOptionLabel(selectedOption) : null;
  }, [selectedOption, getOptionLabel]);

  useEffect(() => {
    if (hasHydrated.current) return;

    if (defaultValue && defaultValue.id != null) {
      const itemValue = getOptionValue(defaultValue as TOption);
      const formValue = valueFromForm;

      const valuesMatch = String(itemValue) === String(formValue);

      if (!formValue || valuesMatch) {
        hasHydrated.current = true;

        if (!formValue) {
          setValue(name as any, itemValue as any, {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
          });
        }

        setValue(`${name}__object` as any, defaultValue as any, {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false,
        });
      }
    }
  }, [defaultValue, valueFromForm, getOptionValue, name, setValue]);

  useEffect(() => {
    hasHydrated.current = false;
  }, [defaultValue]);

  useEffect(() => {
    if (!selectedItem || selectedItem.id == null) return;
    if (lastSelectedItemId.current === selectedItem.id) return;

    lastSelectedItemId.current = selectedItem.id;

    const newValue = getOptionValue(selectedItem as TOption);

    setValue(name as any, newValue as any, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    setValue(`${name}__object` as any, selectedItem as any, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
  }, [selectedItem, getOptionValue, name, setValue]);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View className="flex-col gap-1">
          <Text className="font-medium text-foreground">
            {label}
            {rules?.required && <Text className="text-destructive"> *</Text>}
          </Text>

          <TouchableOpacity
            className={`flex-row items-center justify-between rounded-xl border p-3 ${
              disabled ? "bg-input-disabled" : "bg-input"
            } ${error ? "border-destructive" : "border-border"}`}
            onPress={openModal}
            disabled={disabled}
          >
            {!selectedLabel && (
              <Text className="font-medium text-description">
                {loading ? "Carregando..." : placeholder}
              </Text>
            )}

            {selectedLabel && (
              <Text className="flex-1 text-foreground" numberOfLines={1}>
                {selectedLabel}
              </Text>
            )}

            <Icon name="chevron-down" size={16} className="color-primary" />
          </TouchableOpacity>

          {error?.message && (
            <Text className="text-sm text-destructive">{error.message}</Text>
          )}

          <Modal
            visible={isModalVisible}
            onClose={closeModal}
            type="full"
            title={modalTitle}
          >
            <View className="flex-1 gap-6">
              <Search
                value={search}
                loading={isLoading}
                placeholder={searchPlaceholder}
                onChangeText={setSearch}
                debounceDelay={200}
              />

              <Text className="text-label">
                Total: {currentTotal} de {total}
              </Text>

              <ListPaginated
                loadingComponent={<Loading />}
                data={items}
                renderItem={({ item }) => renderItem({ item, onChange, value })}
                emptyText={emptyText}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                isRefetching={isRefetching}
                fetchNextPage={fetchNextPage}
                onRefresh={refetch}
                isLoading={isLoading}
                initialNumToRender={perPage}
                keyExtractor={(item: TOption) => String(getOptionValue(item))}
              />
            </View>
          </Modal>
        </View>
      )}
    />
  );
}

/**
 * Item individual da lista de seleção
 *
 * @template TOption Tipo da opção
 */
function SelectItem<TOption>({
  item,
  isSelected,
  onPress,
  getOptionLabel,
}: {
  /** Item exibido */
  item: TOption;

  /** Indica se o item está selecionado */
  isSelected: boolean;

  /** Função chamada ao selecionar o item */
  onPress: () => void;

  /** Função que retorna o label do item */
  getOptionLabel: (option: TOption) => string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center justify-between  rounded-2xl border bg-secondary p-3 ${
        isSelected ? "border-primary" : "border-border"
      }`}
    >
      <Text
        className={`flex-1 ${
          isSelected ? "font-bold text-primary" : "text-foreground"
        }`}
      >
        {getOptionLabel(item)}
      </Text>

      {isSelected ? (
        <Icon name="check-circle" size={18} className="color-primary" />
      ) : (
        <Icon name="circle" size={18} className="color-border" />
      )}
    </TouchableOpacity>
  );
}

export function Loading() {
  return (
    <View className="flex-1 gap-6">
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} height={50} style={{ borderRadius: 6 }} />
      ))}
    </View>
  );
}
