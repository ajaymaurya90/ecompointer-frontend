import React from "react";
import "../src/app/globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import mockRouter from "next-router-mock";

// Initialize fonts
const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

// Set initial route for Storybook (optional)
mockRouter.push("/");

export const decorators = [
    (Story: any) => (
        <div className={`${geistSans.variable} ${geistMono.variable}`}>
            <Story />
        </div>
    ),
];

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } },
};