import type { Meta, StoryObj } from "@storybook/react";
import ProductCard from "../ProductCard";

const meta = {
    title: "Product/ProductCard",
    component: ProductCard,
    tags: ["autodocs"],
} satisfies Meta<typeof ProductCard>;

export default meta;

type Story = StoryObj<typeof meta>;

const mockProduct = {
    id: "1",
    name: "Premium Cotton Shirt",
    productCode: "SHIRT-001",
    description: "High quality cotton shirt",
    media: [
        {
            id: "m1",
            url: "https://via.placeholder.com/300",
            isPrimary: true,
        },
    ],
    variants: [
        {
            id: "v1",
            retailGross: 1499,
            stock: 25,
            size: "L",
            color: "White",
        },
    ],
};

export const Default: Story = {
    args: {
        product: mockProduct,
    },
};

export const NoImage: Story = {
    args: {
        product: {
            ...mockProduct,
            media: [],
        },
    },
};