import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsEnum,
    ValidateNested,
    IsArray,
    Min,
    IsOptional,
    IsObject
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../schemas/order.schema';

export class OrderItemDto {
    @ApiProperty({ example: '60d21b4667d0d8992e610c85' })
    @IsString()
    @IsNotEmpty()
    product: string;

    @ApiProperty({ example: 'Smartphone XYZ' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 999.99 })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({ example: 2 })
    @IsNumber()
    @Min(1)
    quantity: number;
}

export class ShippingAddressDto {
    @ApiProperty({ example: '123 Main St' })
    @IsString()
    @IsNotEmpty()
    street: string;

    @ApiProperty({ example: 'New York' })
    @IsString()
    @IsNotEmpty()
    city: string;

    @ApiProperty({ example: 'NY' })
    @IsString()
    @IsNotEmpty()
    state: string;

    @ApiProperty({ example: '10001' })
    @IsString()
    @IsNotEmpty()
    zipCode: string;

    @ApiProperty({ example: 'USA' })
    @IsString()
    @IsNotEmpty()
    country: string;
}

export class PaymentDetailsDto {
    @ApiProperty({ example: 'credit_card' })
    @IsString()
    @IsNotEmpty()
    method: string;

    @ApiProperty({ example: 'txn_1234567890', required: false })
    @IsString()
    @IsOptional()
    transactionId?: string;

    @ApiProperty({ example: 'completed' })
    @IsString()
    @IsNotEmpty()
    status: string;
}

export class CreateOrderDto {
    @ApiProperty({ type: [OrderItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @ApiProperty({ example: 1999.98 })
    @IsNumber()
    @Min(0)
    totalAmount: number;

    @ApiProperty({ enum: OrderStatus, example: OrderStatus.PENDING, required: false })
    @IsEnum(OrderStatus)
    @IsOptional()
    status?: OrderStatus;

    @ApiProperty({ type: ShippingAddressDto })
    @IsObject()
    @ValidateNested()
    @Type(() => ShippingAddressDto)
    shippingAddress: ShippingAddressDto;

    @ApiProperty({ type: PaymentDetailsDto })
    @IsObject()
    @ValidateNested()
    @Type(() => PaymentDetailsDto)
    paymentDetails: PaymentDetailsDto;

    @ApiProperty({ example: 'Please leave at the front door', required: false })
    @IsString()
    @IsOptional()
    notes?: string;
}
