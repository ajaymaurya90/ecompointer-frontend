import type { Meta, StoryObj } from "@storybook/react";
import DashboardGrid from "../DashboardGrid";
import { Product } from "@/types";

const mockProducts: Product[] = [
    {
        id: "1",
        name: "T-Shirt",
        price: 20,
        image: "https://via.placeholder.com/150",
    },
    {
        id: "2",
        name: "Jeans",
        price: 45,
    },
    {
        id: "3",
        name: "Sneakers",
        price: 80,
    },
    {
        id: "4",
        name: "Jacket",
        price: 120,
    },
];

const meta = {
    title: "Dashboard/DashboardGrid",
    component: DashboardGrid,
} satisfies Meta<typeof DashboardGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithProducts: Story = {
    args: {
        products: mockProducts,
    },
};

export const EmptyState: Story = {
    args: {
        products: [],
    },
};

export const Loading: Story = {
    args: {
        products: [],
        loading: true,
    },
};