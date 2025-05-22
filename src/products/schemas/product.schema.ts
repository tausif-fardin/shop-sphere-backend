import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({
    timestamps: true, // Automatically adds createdAt and updatedAt
})
export class Product {
    // _id is automatically added by Mongoose

    @Prop({ required: true, trim: true, index: true })
    name: string;

    @Prop({ required: true, trim: true })
    description: string;

    @Prop({ required: true, min: 0 })
    price: number;

    @Prop({ required: true, min: 0, default: 0 })
    stock: number;

    @Prop({ type: [String], default: [] }) // Explicit type for array of strings
    images: string[];

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ type: [String], default: [], index: true }) // Explicit type and index for categories
    categories: string[];

    // Example of a reference to another model (if you had a Category model):
    // @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Category' }] })
    // categoryRefs: MongooseSchema.Types.ObjectId[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// You can also define compound or text indexes here if needed:
// ProductSchema.index({ name: 'text', description: 'text' });
// ProductSchema.index({ price: 1, stock: -1 });
