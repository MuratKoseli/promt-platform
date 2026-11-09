import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePromptDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(10)
  content: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
