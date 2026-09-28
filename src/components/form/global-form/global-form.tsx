import React, { useEffect, useRef, useState } from "react";
import { useNetwork } from "@/hooks/use-network";
import { DEFAULT_OFFLINE_MESSAGE } from "@/lib/network/offline";
import { toast } from "@/lib/toast";
import {
  FormProvider,
  useForm,
  type DefaultValues,
  type SubmitHandler,
} from "react-hook-form";
import {
  KeyboardAwareScrollView,
  type KeyboardAwareScrollViewRef,
} from "react-native-keyboard-controller";
import { Button } from "../../ui/button";
import { Dialog } from "../../ui/dialog";
import { ProgressBar } from "./progress-bar/progress-bar";
import { View } from "@/components/ui/view";

interface FormProps<T> {
  children?: React.ReactNode;
  steps?: string[];
  initialData?: T;
  scrollable?: boolean;
  buttonTitle?: string;
  resetOnSubmit?: boolean;
  showDialog?: boolean;
  isUpdate?: boolean;
  onSubmit: SubmitHandler<any>;
  onValuesChange?: (values: T) => void;
  requiresConnection?: boolean;
}

export function GlobalForm<T extends Record<string, any>>({
  children,
  steps = [],
  initialData,
  scrollable = false,
  buttonTitle = "Finalizar",
  resetOnSubmit = false,
  showDialog = false,
  isUpdate = false,
  onSubmit,
  onValuesChange,
  requiresConnection = true,
}: FormProps<T>) {
  const { status } = useNetwork();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const scrollViewRef = useRef<KeyboardAwareScrollViewRef>(null);

  const methods = useForm({
    mode: "all",
    defaultValues: (initialData as DefaultValues<T>) || {},
    shouldUnregister: false,
  });

  useEffect(() => {
    if (!onValuesChange) return;

    onValuesChange(methods.getValues() as T);
    const subscription = methods.watch((values) => {
      onValuesChange(values as T);
    });

    return () => subscription.unsubscribe();
  }, [methods, onValuesChange]);

  useEffect(() => {
    if (!scrollable) return;

    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollTo({
        x: 0,
        y: 0,
        animated: false,
      });
    });
  }, [currentStep, scrollable]);

  const goToPreviousStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleNextStep = async () => {
    setIsLoading(true);
    const isValid = await methods.trigger();
    if (!isValid) {
      setIsLoading(false);
      return;
    }
    if (isValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        if (showDialog) setDialogVisible(true);
        else await handleSubmitForm();
      }
    }

    setIsLoading(false);
  };

  const handleSubmitForm = async () => {
    if (requiresConnection && status !== "online") {
      toast.warning(DEFAULT_OFFLINE_MESSAGE);
      return;
    }

    setIsLoading(true);
    try {
      await methods.handleSubmit(onSubmit)();
    } finally {
      setIsLoading(false);
      if (resetOnSubmit) methods.reset();
    }
  };

  const handleSimpleSubmit = async () => {
    const isValid = await methods.trigger();
    if (!isValid) return;
    if (showDialog) setDialogVisible(true);
    else await handleSubmitForm();
  };

  const submitDisabled = isLoading || (isUpdate && !methods.formState.isDirty);

  return (
    <View className="flex-1 flex-col">
      {steps.length > 0 && (
        <ProgressBar
          totalSteps={steps.length}
          currentStep={currentStep}
          steps={steps}
        />
      )}

      <FormProvider {...methods}>
        <View className="flex-1">
          <KeyboardAwareScrollView
            ref={scrollViewRef}
            style={{ flex: 1 }}
            className="bg-background"
            contentContainerClassName="gap-6"
            scrollEnabled={scrollable}
            showsVerticalScrollIndicator={false}
          >
            {React.Children.toArray(children)[currentStep]}
          </KeyboardAwareScrollView>

          <View className="flex-row justify-between gap-6 pb-6">
            {/* 🔹 Com steps */}
            {steps.length > 0 ? (
              <>
                {currentStep > 0 && (
                  <Button
                    onPress={goToPreviousStep}
                    variant="secondary"
                    className="flex-1"
                    disabled={isLoading}
                    loading={isLoading}
                  >
                    Voltar
                  </Button>
                )}

                {currentStep < steps.length - 1 ? (
                  <Button
                    onPress={handleNextStep}
                    className="flex-1"
                    disabled={isLoading}
                    loading={isLoading}
                  >
                    Próximo
                  </Button>
                ) : (
                  <Button
                    onPress={handleNextStep}
                    className="flex-1"
                    loading={isLoading}
                    disabled={submitDisabled}
                  >
                    {buttonTitle}
                  </Button>
                )}
              </>
            ) : (
              // 🔹 Sem steps
              <Button
                onPress={handleSimpleSubmit}
                className="flex-1"
                loading={isLoading}
                disabled={submitDisabled}
              >
                {buttonTitle}
              </Button>
            )}
          </View>
        </View>
      </FormProvider>

      {/* 🔹 Diálogo de confirmação */}
      {showDialog && (
        <Dialog
          show={dialogVisible}
          onCancel={() => setDialogVisible(false)}
          onConfirm={async () => {
            setDialogVisible(false);
            await handleSubmitForm();
          }}
          title="Confirmar envio"
          description="Você confirma que todos os campos foram revisados e estão corretos?"
          confirmText="Sim, confirmar"
          cancelText="Voltar"
        />
      )}
    </View>
  );
}
