import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export enum OrderStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

export class OrderItem {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
    product: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true, min: 1 })
    quantity: number;
}

@Schema({
    timestamps: true,
})
export class Order extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    user: User | string;

    @Prop({ required: true, type: [{ type: Object }] })
    items: OrderItem[];

    @Prop({ required: true })
    totalAmount: number;

    @Prop({
        required: true,
        enum: OrderStatus,
        default: OrderStatus.PENDING
    })
    status: OrderStatus;

    @Prop({ type: Object })
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };

    @Prop({ type: Object })
    paymentDetails: {
        method: string;
        transactionId?: string;
        status: string;
    };

    @Prop()
    notes: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
