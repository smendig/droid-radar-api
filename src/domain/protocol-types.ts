import { z } from 'zod';

export enum ProtocolEnum {
  ClosestEnemies = 'closest-enemies',
  FurthestEnemies = 'furthest-enemies',
  AssistAllies = 'assist-allies',
  AvoidCrossfire = 'avoid-crossfire',
  PrioritizeMech = 'prioritize-mech',
  AvoidMech = 'avoid-mech',
}

export const protocolsSchema = z.array(z.nativeEnum(ProtocolEnum));

