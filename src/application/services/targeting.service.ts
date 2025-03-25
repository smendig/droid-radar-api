import { ProtocolEnum } from '../../domain/protocol-types';
import { ScanPoint } from '../../domain/scan-data';
import { PROTOCOL_REGISTRY } from '../protocols/index';
import { calculateDistance } from '../../utils/geom';

const filterByDistance = (scans: ScanPoint[]): ScanPoint[] => {
  return scans.filter(scan => calculateDistance(scan.coordinates.x, scan.coordinates.y) <= 100);
};

export class TargetingService {
  calculateTarget(requestedProtocols: ProtocolEnum[], scanPoint: ScanPoint[]): { x: number, y: number } | null {
    let candidates = filterByDistance(scanPoint);
    
    const { filters, sorters } = this.groupProtocols(requestedProtocols);
    candidates = filters.reduce((acc, filter) => filter.apply(acc), candidates);
    candidates = sorters.reduce((acc, sorter) => sorter.apply(acc), candidates);

    return candidates[0]?.coordinates;
  }

  private groupProtocols(requestedProtocols: ProtocolEnum[]) {
    if (!requestedProtocols) {
      return { filters: [], sorters: [] };
    }
    const handlers = requestedProtocols
      .map(name => PROTOCOL_REGISTRY[name])
      .filter((handler => Boolean(handler)));

    return {
      filters: handlers.filter(h => h.type === 'filter'),
      sorters: handlers.filter(h => h.type === 'sorter')
    };
  }
}