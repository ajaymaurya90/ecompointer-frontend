import type { Meta, StoryObj } from "@storybook/react";
import DashboardGrid from "../components/DashboardGrid";
import type { Product } from "@/modules/products/types/product";

const mockProducts: Product[] = [
    {
        id: "1",
        name: "T-Shirt",
        productCode: "TSH-001",
        description: "Classic cotton t-shirt",
        media: [
            {
                id: "m1",
                url: "https://via.placeholder.com/300x300?text=T-Shirt",
                isPrimary: true,
            },
        ],
        variants: [
            {
                id: "v1",
                retailGross: 20,
                stock: 12,
                size: "M",
                color: "Black",
            },
        ],
    },
    {
        id: "2",
        name: "Jeans",
        productCode: "JNS-001",
        description: "Slim fit blue jeans",
        media: [
            {
                id: "m2",
                url: "https://via.placeholder.com/300x300?text=Jeans",
                isPrimary: true,
            },
        ],
        variants: [
            {
                id: "v2",
                retailGross: 45,
                stock: 8,
                size: "32",
                color: "Blue",
            },
        ],
    },
    {
        id: "3",
        name: "Sneakers",
        productCode: "SNK-001",
        description: "Comfort casual sneakers",
        media: [
            {
                id: "m3",
                url: "https://via.placeholder.com/300x300?text=Sneakers",
                isPrimary: true,
            },
        ],
        variants: [
            {
                id: "v3",
                retailGross: 80,
                stock: 5,
                size: "42",
                color: "White",
            },
        ],
    },
    {
        id: "4",
        name: "Jacket",
        productCode: "JKT-001",
        description: "Winter padded jacket",
        media: [
            {
                id: "m4",
                url: "https://via.placeholder.com/300x300?text=Jacket",
                isPrimary: true,
            },
        ],
        variants: [
            {
                id: "v4",
                retailGross: 120,
                stock: 3,
                size: "L",
                color: "Olive",
            },
        ],
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