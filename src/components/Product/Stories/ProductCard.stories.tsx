import type { Meta, StoryObj } from "@storybook/react";
import ProductCard from "../ProductCard";

const meta = {
    title: "Product/ProductCard",
    component: ProductCard,
    tags: ["autodocs"],
} satisfies Meta<typeof ProductCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        name: "T-Shirt",
        price: 20,
        image: "https://via.placeholder.com/150",
    },
};

export const NoImage: Story = {
    args: {
        name: "Jeans",
        price: 45,
    },
};