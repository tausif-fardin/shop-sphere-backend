import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({
    timestamps: true,
})
export class Product extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true, min: 0 })
    price: number;

    @Prop({ required: true, min: 0, default: 0 })
    stock: number;

    @Prop({ default: [] })
    images: string[];

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: [] })
    categories: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
