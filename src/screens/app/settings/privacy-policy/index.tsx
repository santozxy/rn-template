import { ScrollableScreen } from "@/components/layout/screens/scrollable";
import { Text } from "@/components/ui/text";
import React from "react";
import { View } from "react-native";
import {
  type PolicyBlock,
  type PolicySection,
  privacyPolicySections,
} from "./content";

const LAST_UPDATED_AT = "28/07/2026";

export function PrivacyPolicy() {
  return (
    <ScrollableScreen title="Política de Privacidade">
      <View className="gap-7 pb-8">
        <Text
          selectable
          className="font-regular text-[15px] leading-7 text-secondary"
        >
          Nesta página você encontra todas as informações relacionadas à
          privacidade, ao tratamento de dados e aos termos de utilização da
          plataforma Meu e-Gov.
        </Text>

        {privacyPolicySections.map((section, index) => (
          <PolicySectionView
            key={section.number}
            section={section}
            showDivider={index > 0}
          />
        ))}

        <Text
          selectable
          className="text-center font-regular text-[11px] leading-4 text-label"
        >
          Última atualização: {LAST_UPDATED_AT}
        </Text>
      </View>
    </ScrollableScreen>
  );
}

function PolicySectionView({
  section,
  showDivider,
}: {
  section: PolicySection;
  showDivider: boolean;
}) {
  return (
    <View className="gap-6">
      {showDivider && <View className="mb-1 h-px bg-border" />}

      <View className="flex-row items-start gap-3.5">
        <View className="h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-primary">
          <Text className="font-bold text-[15px] text-white">
            {section.number}
          </Text>
        </View>
        <Text
          selectable
          className="flex-1 pt-0.5 font-bold text-xl leading-[27px] text-foreground"
        >
          {section.title}
        </Text>
      </View>

      <View className="gap-7">
        {section.subsections.map((subsection) => (
          <View key={subsection.title} className="gap-2.5">
            <Text
              selectable
              className="font-bold text-base leading-[23px] text-foreground"
            >
              {subsection.title}
            </Text>

            <View className="gap-3">
              {subsection.blocks.map((block, index) => (
                <PolicyBlockView
                  key={`${subsection.title}-${block.type}-${index}`}
                  block={block}
                />
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function PolicyBlockView({ block }: { block: PolicyBlock }) {
  if (block.type === "paragraph") {
    return (
      <Text
        selectable
        className="font-regular text-[15px] leading-7 text-secondary"
      >
        {block.text}
      </Text>
    );
  }

  return (
    <View className="gap-2.5 px-2">
      {block.items.map((item) => (
        <View key={item} className="flex-row items-start gap-2">
          <Text className="font-regular text-[15px] leading-7 text-secondary">
            •
          </Text>
          <Text
            selectable
            className="flex-1 font-regular text-[15px] leading-7 text-secondary"
          >
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}
