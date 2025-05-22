import { IsString, IsNumber, IsArray, IsBoolean, IsOptional, Min, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({ example: 'Smartphone XYZ' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'The latest smartphone with amazing features.' })
    @IsString()
    description: string;

    @ApiProperty({ example: 999.99 })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({ example: 100 })
    @IsNumber()
    @Min(0)
    stock: number;

    @ApiProperty({ example: ['image1.jpg', 'image2.jpg'] })
    @IsOptional()
    @IsArray()
    images?: string[];

    @ApiProperty({ example: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiProperty({ example: ['electronics', 'smartphones'] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    categories?: string[];
}
