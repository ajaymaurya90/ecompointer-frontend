/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
        './app/**/*.{js,jsx,ts,tsx}',
        './components/**/*.{js,jsx,ts,tsx}',
        './pages/**/*.{js,jsx,ts,tsx}'
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--bg-main)",
                card: "var(--bg-card)",
                cardMuted: "var(--bg-card-muted)",
                sidebar: "var(--bg-sidebar)",
                topbar: "var(--bg-topbar)",
                inputBg: "var(--bg-input)",

                borderColorCustom: "var(--border-color)",
                borderSoft: "var(--border-soft)",

                primary: "var(--color-primary)",
                primaryHover: "var(--color-primary-hover)",

                textPrimary: "var(--text-primary)",
                textSecondary: "var(--text-secondary)",
                textSidebar: "var(--text-sidebar)",
                textSidebarMuted: "var(--text-sidebar-muted)",

                sidebarActive: "var(--sidebar-active)",
                sidebarHover: "var(--sidebar-hover)",
            },
            boxShadow: {
                card: "var(--shadow-card)",
            },
        },
    },
    plugins: [],
};