import { IsOptional, IsString, MinLength } from 'class-validator';

export class ForkPromptDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;
}
