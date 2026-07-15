import { useFonts } from "expo-font";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { BarlowCondensed_600SemiBold } from "@expo-google-fonts/barlow-condensed";

/**
 * Loads the two type families the design system uses: Inter (everything) and
 * Barlow Condensed SemiBold (the big numbers). The family keys here MUST match
 * `fontFamily` in the typography tokens.
 */
export function useAppFonts(): boolean {
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    BarlowCondensed_600SemiBold,
  });
  return loaded;
}
