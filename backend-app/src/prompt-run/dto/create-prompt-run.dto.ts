import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreatePromptRunDto {
  @IsUUID()
  promptId: string;

  @IsString()
  model: string;

  @IsOptional()
  @IsString()
  input?: string;
}
