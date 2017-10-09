import { CHANGE_LAYOUTS } from './Grid.constants';

export function changeLayouts(action) {
  return {
    type: CHANGE_LAYOUTS,
    layouts: action.layouts,
    id: action.id
  };
}
