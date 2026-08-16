import { useQuery } from '@apollo/client/react';
import { Bytes, Duration } from '@repo/shared';
import type { CSSProperties } from 'react';

import { DOT_SEPARATOR } from '../../design-system/dot-separator/feature/dot-separator';
import { StorageCapacityDocument } from '../data-access/storage-capacity.generated';
import { getInkWaterline, getMeterColors } from '../util/storage-meter';

const STORAGE_CAPACITY_POLL_MS = Duration.toMs(Duration.MINUTE);

export interface StorageMeter {
  /** Compact label for tooltip / aria. */
  label: string;
  /** Wordmark fill CSS variables. */
  style: CSSProperties;
}

export interface UseStorageCapacityResult {
  meter: StorageMeter | null;
  loading: boolean;
}

export function useStorageCapacity(): UseStorageCapacityResult {
  const { data, loading } = useQuery(StorageCapacityDocument, {
    pollInterval: STORAGE_CAPACITY_POLL_MS,
  });

  const capacity = data?.storageCapacity;

  if (loading || !capacity) {
    return { loading, meter: null };
  }

  const uploadable = Bytes.uploadableFree(capacity.availableBytes);
  const usedLabel = Bytes.format(capacity.usedBytes);
  const totalLabel = Bytes.format(capacity.totalBytes);
  const freeLabel = Bytes.format(uploadable);
  const fillRatio = Bytes.usedRatio(capacity);
  const pressure = Bytes.pressure(capacity);
  const colors = getMeterColors(pressure);

  return {
    loading,
    meter: {
      label: capacity.uploadAllowed
        ? `${usedLabel} of ${totalLabel} used ${DOT_SEPARATOR} ${freeLabel} uploadable`
        : `${usedLabel} of ${totalLabel} used ${DOT_SEPARATOR} storage full`,
      style: {
        '--drop-meter-waterline': `${getInkWaterline(fillRatio) * 100}%`,
        '--drop-meter-from': colors.from,
        '--drop-meter-to': colors.to,
        '--drop-meter-empty': 'var(--text)',
      } as CSSProperties,
    },
  };
}
