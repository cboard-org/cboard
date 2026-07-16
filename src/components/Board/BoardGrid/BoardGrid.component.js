import React from 'react';
import PropTypes from 'prop-types';
import keycode from 'keycode';
import { Scannable } from 'react-scannable';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import classNames from 'classnames';

import FixedGrid from '../../FixedGrid';
import Grid from '../../Grid';
import Symbol from '../Symbol';
import Tile from '../Tile';
import EmptyBoard from '../EmptyBoard';
import NavigationButtons from '../../NavigationButtons';
import EditGridButtons from '../../EditGridButtons';
import ScrollButtons from '../../ScrollButtons';
import { DISPLAY_SIZE_GRID_COLS } from '../../Settings/Display/Display.constants';
import {
  DEFAULT_ROWS_NUMBER,
  DEFAULT_COLUMNS_NUMBER
} from '../Board.constants';
import { NAVIGATION_BUTTONS_STYLE_SIDES } from '../../Settings/Navigation/Navigation.constants';
import { resolveTileLabel } from '../../../helpers';

const BoardGrid = ({
  board,
  displaySettings,
  navigationSettings,
  scannerSettings,
  isSelecting,
  isSaving,
  isFixedBoard,
  selectedTileIds,
  intl,
  onTileClick,
  onFocusTile,
  onTileDrop,
  onLayoutChange,
  onAddRemoveRow,
  onAddRemoveColumn,
  onRequestPreviousBoard,
  onRequestToRootBoard,
  setIsScroll,
  isScroll,
  totalRows,
  boardContainerRef,
  fixedBoardContainerRef,
  navHistory
}) => {
  const cols = DISPLAY_SIZE_GRID_COLS[displaySettings.uiSize];
  const isNavigationButtonsOnTheSide =
    navigationSettings.navigationButtonsStyle === undefined ||
    navigationSettings.navigationButtonsStyle ===
      NAVIGATION_BUTTONS_STYLE_SIDES;

  const handleTileClickWithScroll = tile => {
    if (tile.loadBoard && !isSelecting) {
      const containerRef = board.isFixed
        ? fixedBoardContainerRef
        : boardContainerRef;
      if (containerRef?.current) {
        containerRef.current.scrollTop = 0;
      }
    }
    onTileClick(tile);
  };

  const renderTiles = tiles =>
    tiles.map(tileToRender => {
      const tile = {
        ...tileToRender,
        label: resolveTileLabel(tileToRender, intl)
      };
      const isSelected = selectedTileIds.includes(tile.id);
      const variant = Boolean(tile.loadBoard) ? 'folder' : 'button';

      return (
        <div key={tile.id}>
          <Tile
            backgroundColor={tile.backgroundColor}
            borderColor={tile.borderColor}
            variant={variant}
            onClick={e => {
              e.stopPropagation();
              handleTileClickWithScroll(tile);
            }}
            onFocus={() => {
              onFocusTile(tile.id);
            }}
          >
            <Symbol
              image={tile.image}
              label={tile.label}
              keyPath={tile.keyPath}
              labelpos={displaySettings.labelPosition}
            />
            {isSelecting && !isSaving && (
              <div className="CheckCircle">
                {isSelected && (
                  <CheckCircleIcon className="CheckCircle__icon" />
                )}
              </div>
            )}
          </Tile>
        </div>
      );
    });

  const renderTileFixedBoard = tileToRender => {
    const tile = {
      ...tileToRender,
      label: resolveTileLabel(tileToRender, intl)
    };
    const isSelected = selectedTileIds.includes(tile.id);
    const variant = Boolean(tile.loadBoard) ? 'folder' : 'button';

    return (
      <Tile
        backgroundColor={tile.backgroundColor}
        borderColor={tile.borderColor}
        variant={variant}
        onClick={e => {
          e.stopPropagation();
          handleTileClickWithScroll(tile);
        }}
        onFocus={() => {
          onFocusTile(tile.id);
        }}
        id={tile.id}
      >
        <Symbol
          image={tile.image}
          label={tile.label}
          keyPath={tile.keyPath}
          labelpos={displaySettings.labelPosition}
        />
        {isSelecting && !isSaving && (
          <div className="CheckCircle">
            {isSelected && <CheckCircleIcon className="CheckCircle__icon" />}
          </div>
        )}
      </Tile>
    );
  };

  const tiles = renderTiles(board.tiles);

  return (
    <div className="BoardSideButtonsContainer">
      {navigationSettings.caBackButtonActive && (
        <NavigationButtons
          active={
            navigationSettings.caBackButtonActive &&
            !isSelecting &&
            (!isSaving || isNavigationButtonsOnTheSide) &&
            !scannerSettings.active
          }
          navHistory={navHistory}
          previousBoard={onRequestPreviousBoard}
          toRootBoard={onRequestToRootBoard}
          isSaving={isSaving}
          isNavigationButtonsOnTheSide={isNavigationButtonsOnTheSide}
        />
      )}
      <Scannable>
        <div
          id="BoardTilesContainer"
          className={classNames('Board__tiles', {
            ScrollButtonsOnTheSides:
              navigationSettings.bigScrollButtonsActive &&
              isNavigationButtonsOnTheSide
          })}
          onKeyUp={e => {
            if (e.keyCode === keycode('esc')) {
              onRequestPreviousBoard();
            }
          }}
          ref={boardContainerRef}
        >
          {!board.isFixed &&
            (tiles.length ? (
              <Grid
                board={board}
                edit={isSelecting && !isSaving}
                cols={cols}
                onLayoutChange={onLayoutChange}
                setIsScroll={setIsScroll}
                isBigScrollBtns={navigationSettings.bigScrollButtonsActive}
              >
                {tiles}
              </Grid>
            ) : (
              <EmptyBoard />
            ))}

          {board.isFixed && (
            <FixedGrid
              order={board.grid ? board.grid.order : []}
              items={board.tiles}
              columns={board.grid ? board.grid.columns : DEFAULT_COLUMNS_NUMBER}
              rows={board.grid ? board.grid.rows : DEFAULT_ROWS_NUMBER}
              dragAndDropEnabled={isSelecting}
              renderItem={renderTileFixedBoard}
              onItemDrop={onTileDrop}
              fixedRef={fixedBoardContainerRef}
              setIsScroll={setIsScroll}
              isBigScrollBtns={navigationSettings.bigScrollButtonsActive}
              isNavigationButtonsOnTheSide={isNavigationButtonsOnTheSide}
            />
          )}

          <EditGridButtons
            active={isFixedBoard && isSelecting && !isSaving ? true : false}
            columns={board.grid ? board.grid.columns : DEFAULT_COLUMNS_NUMBER}
            rows={board.grid ? board.grid.rows : DEFAULT_ROWS_NUMBER}
            onAddRemoveRow={onAddRemoveRow}
            onAddRemoveColumn={onAddRemoveColumn}
            moveColsButtonToLeft={
              navigationSettings.bigScrollButtonsActive &&
              isNavigationButtonsOnTheSide
            }
          />
        </div>
      </Scannable>

      {navigationSettings.bigScrollButtonsActive && (
        <ScrollButtons
          active={
            navigationSettings.bigScrollButtonsActive &&
            (!isSaving || isNavigationButtonsOnTheSide) &&
            !scannerSettings.active &&
            (isScroll || isNavigationButtonsOnTheSide)
          }
          isScroll={isScroll}
          isSaving={isSaving}
          boardContainer={
            board.isFixed ? fixedBoardContainerRef : boardContainerRef
          }
          totalRows={totalRows}
          boardId={board.id}
          isNavigationButtonsOnTheSide={isNavigationButtonsOnTheSide}
        />
      )}
    </div>
  );
};

BoardGrid.propTypes = {
  board: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    isFixed: PropTypes.bool,
    tiles: PropTypes.arrayOf(PropTypes.object),
    grid: PropTypes.object
  }).isRequired,
  displaySettings: PropTypes.object,
  navigationSettings: PropTypes.object,
  scannerSettings: PropTypes.object,
  isSelecting: PropTypes.bool,
  isSaving: PropTypes.bool,
  isFixedBoard: PropTypes.bool,
  selectedTileIds: PropTypes.arrayOf(PropTypes.string),
  intl: PropTypes.object.isRequired,
  onTileClick: PropTypes.func.isRequired,
  onFocusTile: PropTypes.func,
  onTileDrop: PropTypes.func,
  onLayoutChange: PropTypes.func,
  onAddRemoveRow: PropTypes.func,
  onAddRemoveColumn: PropTypes.func,
  onRequestPreviousBoard: PropTypes.func,
  onRequestToRootBoard: PropTypes.func,
  setIsScroll: PropTypes.func,
  isScroll: PropTypes.bool,
  totalRows: PropTypes.number,
  boardContainerRef: PropTypes.object,
  fixedBoardContainerRef: PropTypes.object,
  navHistory: PropTypes.arrayOf(PropTypes.string)
};

BoardGrid.defaultProps = {
  displaySettings: {
    uiSize: 'Standard',
    labelPosition: 'Below'
  },
  navigationSettings: {},
  scannerSettings: { active: false },
  isSelecting: false,
  isSaving: false,
  isFixedBoard: false,
  selectedTileIds: [],
  onFocusTile: () => {},
  onTileDrop: () => {},
  onLayoutChange: () => {},
  onAddRemoveRow: () => {},
  onAddRemoveColumn: () => {},
  onRequestPreviousBoard: () => {},
  onRequestToRootBoard: () => {},
  setIsScroll: () => {},
  isScroll: false,
  totalRows: 0,
  navHistory: []
};

export default BoardGrid;
