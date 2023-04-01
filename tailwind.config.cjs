/** @type {import('tailwindcss').Config} */

function OpacityHandler(variableName) {
    return ({ opacityValue }) => {
        if (opacityValue !== undefined) {
            return `rgba(var(${variableName}), ${opacityValue})`;
        }
        return `rgb(var(${variableName}))`;
    };
}

module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            gridTemplateRows: {
                7: "repeat(7, minmax(0, 1fr))",
                8: "repeat(8, minmax(0, 1fr))",
                9: "repeat(9, minmax(0, 1fr))",
            },
            gridTemplateColumns: {
                9: "repeat(9, minmax(0, 1fr))",
            },
            textColor: {
                skin: {
                    base: OpacityHandler("--text-color-base"),
                    muted: OpacityHandler("--text-color-muted"),
                    secondary: OpacityHandler("--text-color-secondary"),
                    secondaryhover: OpacityHandler("--text-color-secondary-hover"),
                    accent: OpacityHandler("--accent"),
                    accenthover: OpacityHandler("--accent-hover"),
                },
            },
            backgroundColor: {
                skin: {
                    base: OpacityHandler("--bg-base"),
                    secondary: OpacityHandler("--bg-secondary"),
                    secondaryhover: OpacityHandler("--bg-secondary-hover"),
                    basebackground: OpacityHandler("--bg-base-background"),
                    accent: OpacityHandler("--accent"),
                    accenthover: OpacityHandler("--accent-hover"),
                },
            },
            borderColor: {
                skin: {
                    base: OpacityHandler("--border-color"),
                    secondary: OpacityHandler("--border-color-secondary"),
                    accent: OpacityHandler("--accent"),
                },
            },
            accentColor: {
                skin: {
                    accent: OpacityHandler("--accent"),
                },
            },
            ringColor: {
                skin: {
                    accent: OpacityHandler("--accent"),
                },
            },
            fillColor: {
                skin: {
                    accent: OpacityHandler("--accent"),
                },
            },
        },
    },
    plugins: [
        require("prettier-plugin-tailwindcss"),
        require("@tailwindcss/line-clamp"),
        require("tailwind-scrollbar"),
        require("@tailwindcss/forms"),
    ],
};
