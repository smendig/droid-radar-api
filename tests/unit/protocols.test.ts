import { ScanPoint } from '../../src/domain/scan-data';
import { ProtocolEnum } from '../../src/domain/protocol-types';
import { PROTOCOL_REGISTRY } from '../../src/application/protocols';
import { calculateDistance } from '../../src/utils/geom';

const baseScanPoint: ScanPoint = {
  coordinates: { x: 0, y: 0 },
  enemies: { type: 'soldier', number: 1 },
  allies: 0
};

describe('Protocol Handlers', () => {
  describe('AvoidMechProtocol', () => {
    const protocol = PROTOCOL_REGISTRY[ProtocolEnum.AvoidMech];
    
    test('filters out mech enemies', () => {
      const scans: ScanPoint[] = [
        { ...baseScanPoint, enemies: { type: 'mech', number: 2 } },
        { ...baseScanPoint, enemies: { type: 'soldier', number: 3 } }
      ];
      
      const result = protocol.apply(scans);
      expect(result).toHaveLength(1);
      expect(result[0].enemies.type).toBe('soldier');
    });

    test('returns all scans when no mechs present', () => {
      const scans: ScanPoint[] = [
        { ...baseScanPoint },
        { ...baseScanPoint }
      ];
      
      expect(protocol.apply(scans)).toEqual(scans);
    });
  });

  describe('ClosestEnemiesProtocol', () => {
    const protocol = PROTOCOL_REGISTRY[ProtocolEnum.ClosestEnemies];

    test('sorts by ascending distance', () => {
      const scans: ScanPoint[] = [
        { ...baseScanPoint, coordinates: { x: 30, y: 40 } },
        { ...baseScanPoint, coordinates: { x: 0, y: 30 } },
        { ...baseScanPoint, coordinates: { x: 0, y: 0 } }
      ];

      const result = protocol.apply(scans);
      expect(result.map(p => calculateDistance(p.coordinates.x, p.coordinates.y)))
        .toEqual([0, 30, 50]);
    });

    test('does not mutate original array', () => {
      const scans: ScanPoint[] = [
        { ...baseScanPoint, coordinates: { x: 10, y: 0 } },
        { ...baseScanPoint, coordinates: { x: 0, y: 0 } }
      ];
      
      const copy = [...scans];
      protocol.apply(scans);
      expect(scans).toEqual(copy);
    });
  });

  describe('PrioritizeMechProtocol', () => {
    const protocol = PROTOCOL_REGISTRY[ProtocolEnum.PrioritizeMech];

    test('filters to mechs when present', () => {
      const scans: ScanPoint[] = [
        { ...baseScanPoint, enemies: { type: 'mech', number: 2 } },
        { ...baseScanPoint, enemies: { type: 'soldier', number: 3 } },
        { ...baseScanPoint, enemies: { type: 'mech', number: 1 } }
      ];

      const result = protocol.apply(scans);
      expect(result).toHaveLength(2);
      expect(result.every(p => p.enemies.type === 'mech')).toBe(true);
    });

    test('returns all scans when no mechs present', () => {
      const scans: ScanPoint[] = [
        { ...baseScanPoint },
        { ...baseScanPoint }
      ];

      expect(protocol.apply(scans)).toEqual(scans);
    });
  });

  describe('AvoidCrossfireProtocol', () => {
    const protocol = PROTOCOL_REGISTRY[ProtocolEnum.AvoidCrossfire];

    test('removes scans with allies present', () => {
      const scans: ScanPoint[] = [
        { ...baseScanPoint, allies: 0 },
        { ...baseScanPoint, allies: 2 },
        { ...baseScanPoint }
      ];

      const result = protocol.apply(scans);
      expect(result).toHaveLength(2);
      expect(result.every(p => (p.allies ?? 0) === 0)).toBe(true);
    });
  });

  describe('FurthestEnemiesProtocol', () => {
    const protocol = PROTOCOL_REGISTRY[ProtocolEnum.FurthestEnemies];

    test('sorts by descending distance', () => {
      const scans: ScanPoint[] = [
        { ...baseScanPoint, coordinates: { x: 0, y: 0 } },
        { ...baseScanPoint, coordinates: { x: 30, y: 40 } },
        { ...baseScanPoint, coordinates: { x: 0, y: 30 } }
      ];

      const result = protocol.apply(scans);
      expect(result.map(p => calculateDistance(p.coordinates.x, p.coordinates.y)))
        .toEqual([50, 30, 0]);
    });
  });

  describe('AssistAlliesProtocol', () => {
    const protocol = PROTOCOL_REGISTRY[ProtocolEnum.AssistAllies];

    test('keeps only scans with allies', () => {
      const scans: ScanPoint[] = [
        { ...baseScanPoint, allies: 1 },
        { ...baseScanPoint, allies: 0 },
        { ...baseScanPoint }
      ];

      const result = protocol.apply(scans);
      expect(result).toHaveLength(1);
      expect(result[0].allies).toBe(1);
    });
  });
});

describe('Protocol Registry', () => {
  test('contains all required protocols', () => {
    const expectedProtocols = [
      ProtocolEnum.AvoidMech,
      ProtocolEnum.ClosestEnemies,
      ProtocolEnum.PrioritizeMech,
      ProtocolEnum.AvoidCrossfire,
      ProtocolEnum.FurthestEnemies,
      ProtocolEnum.AssistAllies
    ];

    expectedProtocols.forEach(protocolName => {
      expect(PROTOCOL_REGISTRY[protocolName]).toBeDefined();
    });
  });

  test('protocols have correct types', () => {
    const expectedTypes: Record<ProtocolEnum, 'filter' | 'sorter'> = {
      [ProtocolEnum.AvoidMech]: 'filter',
      [ProtocolEnum.ClosestEnemies]: 'sorter',
      [ProtocolEnum.PrioritizeMech]: 'filter',
      [ProtocolEnum.AvoidCrossfire]: 'filter',
      [ProtocolEnum.FurthestEnemies]: 'sorter',
      [ProtocolEnum.AssistAllies]: 'filter'
    };

    Object.entries(expectedTypes).forEach(([protocolName, expectedType]) => {
      expect(PROTOCOL_REGISTRY[protocolName as ProtocolEnum].type).toBe(expectedType);
    });
  });
});