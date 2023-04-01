import z from "zod";

export const ColorBases = [
    "neutral",
    "red",
    "orange",
    "amber",
    "yellow",
    "lime",
    "green",
    "emerald",
    "teal",
    "cyan",
    "sky",
    "blue",
    "indigo",
    "violet",
    "purple",
    "fuchsia",
    "pink",
    "rose",
] as const;

export const ColorGradients = [
    "50",
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
] as const;

export const Gradients = z.enum(ColorGradients);
export const Bases = z.enum(ColorBases);
export type ColorGradient = z.infer<typeof Gradients>;
export type ColorBase = z.infer<typeof Bases>;
export type ColorDecorator = "text" | "bg" | "border" | "ring";
export const ColorSchema = z.object({
    base: Bases,
    gradient: Gradients,
});
export type ColorType = z.infer<typeof ColorSchema>;

export const getColorClass = (color: ColorType, type: ColorDecorator): string => {
    return `${type}-${color.base}-${color.gradient}`;
};

export const getGradientSliderIndex = (gradient: ColorGradient) => {
    if (gradient.length < 3) return 0;
    else return parseInt(gradient[0]);
};
