import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class ImproveResumeDto {
  @IsString({ message: 'The CV must be a valid text' })
  @IsNotEmpty({ message: 'The CV is required' })
  @MaxLength(15000, { message: 'The CV cannot exceed 15000 characters' })
  cv: string;

  @IsString({ message: 'The form must be a valid text' })
  @IsOptional()
  @MaxLength(10000, {
    message: 'The form cannot exceed 10000 characters',
  })
  form?: string;

  @IsString({ message: 'The goal must be a valid text' })
  @IsNotEmpty({ message: 'The professional goal is required' })
  @MaxLength(500, { message: 'The goal cannot exceed 500 characters' })
  goal: string;
}
