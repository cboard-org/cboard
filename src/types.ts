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
}
