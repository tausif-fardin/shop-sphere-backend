import { OrderStatus } from '../schemas/order.schema';
export declare class OrderItemDto {
    product: string;
    name: string;
    price: number;
    quantity: number;
}
export declare class ShippingAddressDto {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}
export declare class PaymentDetailsDto {
    method: string;
    transactionId?: string;
    status: string;
}
export declare class CreateOrderDto {
    items: OrderItemDto[];
    totalAmount: number;
    status?: OrderStatus;
    shippingAddress: ShippingAddressDto;
    paymentDetails: PaymentDetailsDto;
    notes?: string;
}
