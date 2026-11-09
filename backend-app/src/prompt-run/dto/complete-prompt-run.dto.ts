import { IsNotEmpty, IsString } from 'class-validator';

export class CompletePromptRunDto {
  @IsString()
  @IsNotEmpty()
  output: string;
}
