import { IsString } from 'class-validator';

export class CompleteRunDto {
  @IsString()
  output: string;
}
