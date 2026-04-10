/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
        "./pages/**/*.{js,jsx,ts,tsx}",
    ],
    safelist: [
        "bg-dangerSoft",
        "text-danger",
        "bg-warningSoft",
        "text-warning",
        "bg-successSoft",
        "text-success",
        "bg-textMuted",
        "bg-success",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--bg-main)",
                card: "var(--bg-card)",
                cardMuted: "var(--bg-card-muted)",
                elevated: "var(--bg-elevated)",
                sidebar: "var(--bg-sidebar)",
                topbar: "var(--bg-topbar)",
                inputBg: "var(--bg-input)",
                overlay: "var(--bg-overlay)",

                tableHeader: "var(--bg-table-header)",
                tableFooter: "var(--bg-table-footer)",
                tableRowHover: "var(--bg-table-row-hover)",
                tableRowSelected: "var(--bg-table-row-selected)",
                disabledBg: "var(--bg-disabled)",

                borderColorCustom: "var(--border-color)",
                borderSoft: "var(--border-soft)",
                borderStrong: "var(--border-strong)",
                borderFocus: "var(--border-focus)",

                primary: "var(--color-primary)",
                primaryHover: "var(--color-primary-hover)",

                success: "var(--color-success)",
                successSoft: "var(--color-success-soft)",
                warning: "var(--color-warning)",
                warningSoft: "var(--color-warning-soft)",
                danger: "var(--color-danger)",
                dangerSoft: "var(--color-danger-soft)",
                info: "var(--color-info)",
                infoSoft: "var(--color-info-soft)",

                textPrimary: "var(--text-primary)",
                textSecondary: "var(--text-secondary)",
                textMuted: "var(--text-muted)",
                textDisabled: "var(--text-disabled)",
                textInverse: "var(--text-inverse)",
                textSidebar: "var(--text-sidebar)",
                textSidebarMuted: "var(--text-sidebar-muted)",

                sidebarActive: "var(--sidebar-active)",
                sidebarHover: "var(--sidebar-hover)",
            },
            boxShadow: {
                card: "var(--shadow-card)",
                sm: "var(--shadow-sm)",
                md: "var(--shadow-md)",
                lg: "var(--shadow-lg)",
            },
            borderRadius: {
                sm: "var(--radius-sm)",
                md: "var(--radius-md)",
                lg: "var(--radius-lg)",
                xl: "var(--radius-xl)",
            },
            transitionDuration: {
                fast: "var(--duration-fast)",
                base: "var(--duration-base)",
            },
        },
    },
    plugins: [],
};