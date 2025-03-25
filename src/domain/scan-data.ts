import { z } from 'zod';

export interface ScanPoint {
  coordinates: {
    x: number;
    y: number;
  };
  enemies: {
    type: 'soldier' | 'mech';
    number: number;
  };
  allies?: number;
}

export const scanDataSchema: z.ZodSchema<ScanPoint[]> = z.array(z.object({
  coordinates: z.object({
    x: z.number(),
    y: z.number(),
  }).required(),
  enemies: z.object({
    type: z.enum(['soldier', 'mech']),
    number: z.number().int().positive(),
  }).required(),
  allies: z.number().int().positive().optional(),
})).nonempty();

