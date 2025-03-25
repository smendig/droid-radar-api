

import { ScanPoint } from '../../domain/scan-data';
import { ProtocolEnum } from '../../domain/protocol-types';
import { calculateDistance } from '../../utils/geom';

interface ProtocolHandler {
  name: string;
  type: 'filter' | 'sorter';
  apply: (scans: ScanPoint[]) => ScanPoint[];
}

const AvoidMechProtocol: ProtocolHandler = {
  name: 'avoid-mech',
  type: 'filter',
  apply: (scans) => scans.filter(s => s.enemies.type !== 'mech')
};

const ClosestEnemiesProtocol: ProtocolHandler = {
  name: ProtocolEnum.ClosestEnemies,
  type: 'sorter',
  apply: (scans) => [...scans].sort((a, b) =>
    calculateDistance(a.coordinates.x, a.coordinates.y) - calculateDistance(b.coordinates.x, b.coordinates.y)
  )
};

const PrioritizeMechProtocol: ProtocolHandler = {
  name: ProtocolEnum.PrioritizeMech,
  type: 'filter',
  apply: (scans) => {
    const hasMech = scans.some(s => s.enemies.type === 'mech');
    return hasMech ? scans.filter(s => s.enemies.type === 'mech') : scans;
  }
};

const AvoidCrossfireProtocol: ProtocolHandler = {
  name: ProtocolEnum.AvoidCrossfire,
  type: 'filter',
  apply: (scans) => scans.filter(scan =>
    (scan.allies ?? 0) === 0
  )
};

const FurthestEnemiesProtocol: ProtocolHandler = {
  name: ProtocolEnum.FurthestEnemies,
  type: 'sorter',
  apply: (scans) => {
    return [...scans].sort((a, b) =>
      calculateDistance(b.coordinates.x, b.coordinates.y) - calculateDistance(a.coordinates.x, a.coordinates.y)
    );
  }
};

const AssistAlliesProtocol: ProtocolHandler = {
  name: ProtocolEnum.AssistAllies,
  type: 'filter',
  apply: (scans) => scans.filter(scan =>
    (scan.allies ?? 0) > 0
  )
};

export const PROTOCOL_REGISTRY: Record<string, ProtocolHandler> = {
  [ProtocolEnum.AvoidMech]: AvoidMechProtocol,
  [ProtocolEnum.AvoidCrossfire]: AvoidCrossfireProtocol,
  [ProtocolEnum.PrioritizeMech]: PrioritizeMechProtocol,
  [ProtocolEnum.ClosestEnemies]: ClosestEnemiesProtocol,
  [ProtocolEnum.FurthestEnemies]: FurthestEnemiesProtocol,
  [ProtocolEnum.AssistAllies]: AssistAlliesProtocol
};