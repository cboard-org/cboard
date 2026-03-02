import { SHORT_ID_MAX_LENGTH } from './Board.constants';

export const isLocalBoard = board => board.id.length < SHORT_ID_MAX_LENGTH;
export const isServerBoard = board => board.id.length >= SHORT_ID_MAX_LENGTH;
