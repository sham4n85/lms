import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateSectionDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class UpdateSectionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class ReorderSectionsDto {
  @IsInt({ each: true })
  sortOrders: { id: string; sortOrder: number }[];
}
