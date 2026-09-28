export type AwsMapColorScheme = "Light" | "Dark";
export type AwsMapStyle = "Standard" | "Satellite" | "Hybrid";

interface AwsMapStyleOptions {
  style?: AwsMapStyle;
  colorScheme: AwsMapColorScheme;
  traffic?: boolean;
}

const awsLocationApiKey = process.env.EXPO_PUBLIC_AWS_LOCATION_API_KEY?.trim();
const awsLocationRegion = process.env.EXPO_PUBLIC_AWS_LOCATION_REGION?.trim();

export function getAwsLocationConfigurationError() {
  if (!awsLocationApiKey) {
    return "Configure EXPO_PUBLIC_AWS_LOCATION_API_KEY para carregar o mapa.";
  }

  if (!awsLocationRegion) {
    return "Configure EXPO_PUBLIC_AWS_LOCATION_REGION para carregar o mapa.";
  }

  return null;
}

export function createAwsMapStyleUrl({
  style = "Standard",
  colorScheme,
  traffic = false,
}: AwsMapStyleOptions) {
  const configurationError = getAwsLocationConfigurationError();

  if (configurationError || !awsLocationApiKey || !awsLocationRegion) {
    return null;
  }

  const searchParams = new URLSearchParams({ key: awsLocationApiKey });

  if (style === "Standard") {
    searchParams.set("color-scheme", colorScheme);
  }

  if (style !== "Satellite") {
    searchParams.set("poi-density", "Sparse");
    if (traffic) searchParams.set("traffic", "All");
  }

  return `https://maps.geo.${awsLocationRegion}.amazonaws.com/v2/styles/${style}/descriptor?${searchParams.toString()}`;
}
