export interface InflectionOption {
  id?: string;
  shorthandLabel: string;
  outputLabel: string;
  vocalization: string;
  sound?: string;
}
export interface TileItem {
  id: string;
  label?: string;
  labelKey?: string;
  vocalization?: string;
  image: string;
  loadBoard?: string;
  sound?: string;
  type?: string;
  backgroundColor: string;
  linkedBoard?: boolean;
  inflectionOptions?: InflectionOption[];
}
