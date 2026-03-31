import { api } from "@/lib/http";
import type {
    Customer,
    CustomerFormData,
    CustomerGroup,
    CustomerListParams,
    CustomerListResponse,
    CustomerBusinessFormData,
    CustomerAddressFormData,
} from "@/modules/customers/types/customer";

function cleanParams(params: CustomerListParams = {}) {
    return Object.fromEntries(
        Object.entries(params).filter(
            ([, value]) => value !== "" && value !== undefined && value !== null
        )
    );
}

export async function getCustomers(
    params: CustomerListParams = {}
): Promise<CustomerListResponse> {
    const response = await api.get("/customers", {
        params: cleanParams(params),
    });

    return response.data;
}

export async function getCustomerById(customerId: string): Promise<Customer> {
    const response = await api.get(`/customers/${customerId}`);
    return response.data?.data ?? response.data;
}

export async function createCustomer(data: CustomerFormData): Promise<Customer> {
    const response = await api.post("/customers", data);
    return response.data?.data ?? response.data;
}

export async function updateCustomer(
    customerId: string,
    data: Partial<CustomerFormData>
): Promise<Customer> {
    const response = await api.patch(`/customers/${customerId}`, data);
    return response.data?.data ?? response.data;
}

export async function archiveCustomer(customerId: string): Promise<Customer> {
    const response = await api.patch(`/customers/${customerId}/archive`);
    return response.data?.data ?? response.data;
}

export async function getCustomerGroups(): Promise<CustomerGroup[]> {
    const response = await api.get("/customer-groups");
    return response.data || [];
}

export async function createCustomerBusiness(
    customerId: string,
    data: CustomerBusinessFormData
) {
    const response = await api.post(`/customers/${customerId}/businesses`, data);
    return response.data?.data ?? response.data;
}

export async function updateCustomerBusiness(
    customerId: string,
    businessId: string,
    data: CustomerBusinessFormData
) {
    const response = await api.patch(
        `/customers/${customerId}/businesses/${businessId}`,
        data
    );
    return response.data?.data ?? response.data;
}

export async function deleteCustomerBusiness(
    customerId: string,
    businessId: string
) {
    const response = await api.delete(
        `/customers/${customerId}/businesses/${businessId}`
    );
    return response.data?.data ?? response.data;
}

export async function createCustomerAddress(
    customerId: string,
    data: CustomerAddressFormData
) {
    const response = await api.post(`/customers/${customerId}/addresses`, data);
    return response.data?.data ?? response.data;
}

export async function updateCustomerAddress(
    customerId: string,
    addressId: string,
    data: CustomerAddressFormData
) {
    const response = await api.patch(
        `/customers/${customerId}/addresses/${addressId}`,
        data
    );
    return response.data?.data ?? response.data;
}

export async function deleteCustomerAddress(
    customerId: string,
    addressId: string
) {
    const response = await api.delete(
        `/customers/${customerId}/addresses/${addressId}`
    );
    return response.data?.data ?? response.data;
}

export async function createCustomerGroup(data: {
    name: string;
    description?: string;
}) {
    const response = await api.post("/customer-groups", data);
    return response.data?.data ?? response.data;
}

export async function updateCustomerGroup(
    groupId: string,
    data: {
        name?: string;
        description?: string;
    }
) {
    const response = await api.patch(`/customer-groups/${groupId}`, data);
    return response.data?.data ?? response.data;
}

export async function deleteCustomerGroup(groupId: string) {
    const response = await api.delete(`/customer-groups/${groupId}`);
    return response.data?.data ?? response.data;
}

export async function addCustomersToGroup(
    groupId: string,
    customerIds: string[]
) {
    const response = await api.post(`/customer-groups/${groupId}/members`, {
        customerIds,
    });
    return response.data?.data ?? response.data;
}

export async function removeCustomerFromGroup(
    groupId: string,
    customerId: string
) {
    const response = await api.delete(
        `/customer-groups/${groupId}/members/${customerId}`
    );
    return response.data?.data ?? response.data;
}

export async function getCustomerGroupById(groupId: string): Promise<CustomerGroup> {
    const response = await api.get(`/customer-groups/${groupId}`);
    return response.data?.data ?? response.data;
}