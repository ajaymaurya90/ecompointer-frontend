import type { Meta, StoryObj } from "@storybook/react";
import TopNav from "../TopNav";

const meta = {
    title: "Layout/TopNav",
    component: TopNav,
    tags: ["autodocs"],
} satisfies Meta<typeof TopNav>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};