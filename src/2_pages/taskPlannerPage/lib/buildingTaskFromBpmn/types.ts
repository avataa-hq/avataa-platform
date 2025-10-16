export interface BPMNItem extends Record<string, unknown> {
  id: string;
  name?: string;
  source: string[] | null | undefined;
  target: string[] | null | undefined;
  durationInSec?: number | null;
  type: string;
}
