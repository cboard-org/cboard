import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import shortid from 'shortid';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import CircularProgress from '@material-ui/core/CircularProgress';

import messages from './TileEditor.messages';
import SymbolSearch from '../SymbolSearch';
import Symbol from '../Symbol';
import Tile from '../Tile';
import FullScreenDialog, {
  FullScreenDialogContent
} from '../../UI/FullScreenDialog';
import InputImage from '../../UI/InputImage';
import IconButton from '../../UI/IconButton';
import ColorSelect from '../../UI/ColorSelect';
import VoiceRecorder from '../../VoiceRecorder';
import './TileEditor.css';
import EditIcon from '@material-ui/icons/Edit';
import ImageEditor from '../ImageEditor';

import API from '../../../api';
import {
  isAndroid,
  isCordova,
  requestCvaPermissions,
  writeCvaFile
} from '../../../cordova-util';
import { convertImageUrlToCatchable, resolveBoardName } from '../../../helpers';
import PremiumFeature from '../../PremiumFeature';
import LoadBoardEditor from './LoadBoardEditor/LoadBoardEditor';
import { Typography } from '@material-ui/core';
import { LostedFolderForLoadBoardAlert } from './LostedFolderForLoadBoardAlert';
import { SHORT_ID_MAX_LENGTH } from '../Board.constants';

const NONE_VALUE = 'none';

const defaultTileColors = {
  folder: '#bbdefb',
  button: '#fff176',
  board: '#999999'
};
const defaultTile = {
  label: '',
  labelKey: '',
  vocalization: '',
  image: '',
  loadBoard: '',
  sound: '',
  type: 'button',
  backgroundColor: defaultTileColors.button,
  linkedBoard: false
};

const defaultImageUploadedData = {
  isUploaded: false,
  fileName: '',
  blobHQ: null,
  blob: null
};

function TileEditor(props) {
  const {
    intl,
    open,
    onClose,
    editingTiles = [],
    onEditSubmit,
    onAddSubmit,
    boards,
    userData,
    folders,
    onAddApiBoard
  } = props;

  const [activeStep, setActiveStep] = useState(0);
  const [tilesToEdit, setTilesToEdit] = useState(editingTiles);
  const [isSymbolSearchOpen, setIsSymbolSearchOpen] = useState(false);
  const [autoFill, setAutoFill] = useState('');
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState('');
  const [tile, setTile] = useState(defaultTile);
  const [linkedBoard, setLinkedBoard] = useState('');
  const [imageUploadedData, setImageUploadedData] = useState([]);
  const [isEditImageBtnActive, setIsEditImageBtnActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openImageEditor, setOpenImageEditor] = useState(false);

  const getCurrentlyEditingTile = useCallback(
    () => {
      return tilesToEdit[activeStep];
    },
    [tilesToEdit, activeStep]
  );

  const currentTileProp = useCallback(
    prop => {
      const currentTile = getCurrentlyEditingTile();
      return currentTile ? currentTile[prop] : tile[prop];
    },
    [getCurrentlyEditingTile, tile]
  );

  const updateEditingTile = useCallback((id, property, value) => {
    setTilesToEdit(prevState => {
      const updatedTilesToEdit = prevState.map(b =>
        b.id === id ? { ...b, [property]: value } : b
      );
      return updatedTilesToEdit;
    });
  }, []);

  const updateNewTile = useCallback((property, value) => {
    return setTile(prevState => ({ ...prevState, [property]: value }));
  }, []);

  const updateTileProperty = useCallback(
    (property, value) => {
      if (getCurrentlyEditingTile()) {
        updateEditingTile(getCurrentlyEditingTile().id, property, value);
      } else {
        updateNewTile(property, value);
      }
    },
    [getCurrentlyEditingTile, updateEditingTile, updateNewTile]
  );

  const blobToBase64 = async blob => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  };

  const updateTileImgURL = async (blob, fileName) => {
    const user = userData.email ? userData : null;
    if (user) {
      try {
        const imageUrl = await API.uploadFile(blob, fileName);
        return convertImageUrlToCatchable(imageUrl) || imageUrl;
      } catch (error) {
        return await blobToBase64(blob);
      }
    } else {
      if (isAndroid()) {
        const filePath = '/Android/data/com.unicef.cboard/files/' + fileName;
        const fEntry = await writeCvaFile(filePath, blob);
        return fEntry.nativeURL;
      } else {
        return await blobToBase64(blob);
      }
    }
  };

  const handleSubmit = useCallback(
    async () => {
      if (getCurrentlyEditingTile()) {
        if (imageUploadedData.length) {
          let tilesToAdd = JSON.parse(JSON.stringify(tilesToEdit));
          await Promise.all(
            imageUploadedData.map(async (obj, index) => {
              if (obj.isUploaded) {
                tilesToAdd[index].image = await updateTileImgURL(
                  obj.blob,
                  obj.fileName
                );
              }
            })
          );
          onEditSubmit(tilesToAdd);
        } else {
          onEditSubmit(tilesToEdit);
        }
      } else {
        const tileToAdd = { ...tile };
        const currentImageUploadedData = imageUploadedData[activeStep];
        if (currentImageUploadedData && currentImageUploadedData.isUploaded) {
          tileToAdd.image = await updateTileImgURL(
            currentImageUploadedData.blob,
            currentImageUploadedData.fileName
          );
        }
        if (selectedBackgroundColor) {
          tileToAdd.backgroundColor = selectedBackgroundColor;
        }
        onAddSubmit(tileToAdd);
      }

      setActiveStep(0);
      setSelectedBackgroundColor('');
      setTile(defaultTile);
      setImageUploadedData([]);
      setIsEditImageBtnActive(false);
      setLinkedBoard('');
    },
    // Excluding updateTileImgURL() because it's a utility function that doesn't change
    /* eslint-disable react-hooks/exhaustive-deps */
    [
      getCurrentlyEditingTile,
      imageUploadedData,
      tilesToEdit,
      onEditSubmit,
      tile,
      activeStep,
      selectedBackgroundColor,
      onAddSubmit
    ]
    /* eslint-enable react-hooks/exhaustive-deps */
  );

  const handleCancel = useCallback(
    () => {
      setActiveStep(0);
      setSelectedBackgroundColor('');
      setTile(defaultTile);
      setImageUploadedData([]);
      setIsEditImageBtnActive(false);
      setLinkedBoard('');
      onClose();
    },
    [onClose]
  );

  const updateImageUploadedData = useCallback(
    (isUploaded, fileName, blobHQ = null, blob = null) => {
      setImageUploadedData(prevState => {
        return prevState.map((item, index) => {
          if (index === activeStep) {
            return {
              ...item,
              isUploaded,
              fileName,
              blobHQ,
              blob
            };
          } else {
            return item;
          }
        });
      });
    },
    [activeStep]
  );

  const handleInputImageChange = useCallback(
    (blob, fileName, blobHQ) => {
      updateImageUploadedData(true, fileName, blobHQ, blob);
      setIsEditImageBtnActive(true);
      const image = URL.createObjectURL(blob);
      updateTileProperty('image', image);
    },
    [updateImageUploadedData, updateTileProperty]
  );

  const handleLoadingStateChange = useCallback(isLoading => {
    setIsLoading(isLoading);
  }, []);

  const handleSymbolSearchChange = useCallback(
    ({ image, labelKey, label, keyPath }) => {
      return new Promise(resolve => {
        updateTileProperty('labelKey', labelKey);
        updateTileProperty('label', label);
        updateTileProperty('image', image);
        if (keyPath) updateTileProperty('keyPath', keyPath);
        if (imageUploadedData.length) {
          updateImageUploadedData(false, '');
        }
        resolve();
      });
    },
    [updateTileProperty, updateImageUploadedData, imageUploadedData.length]
  );

  const handleSymbolSearchClose = useCallback(
    () => {
      setIsSymbolSearchOpen(false);
      if (imageUploadedData[activeStep]?.isUploaded) {
        setIsEditImageBtnActive(true);
      }
    },
    [imageUploadedData, activeStep]
  );

  const handleLabelChange = useCallback(
    event => {
      updateTileProperty('label', event.target.value);
      updateTileProperty('labelKey', '');
    },
    [updateTileProperty]
  );

  const handleVocalizationChange = event => {
    updateTileProperty('vocalization', event.target.value);
  };

  const handleSoundChange = useCallback(
    sound => {
      updateTileProperty('sound', sound);
    },
    [updateTileProperty]
  );

  const handleTypeChange = (event, type) => {
    let loadBoard = '';
    if (type === 'folder' || type === 'board') {
      loadBoard = shortid.generate();
    }
    let backgroundColor = defaultTileColors.button;
    if (type === 'board') {
      backgroundColor = defaultTileColors.board;
    }
    if (type === 'folder') {
      backgroundColor = defaultTileColors.folder;
    }
    setTile(prevTile => ({
      ...prevTile,
      linkedBoard: false,
      backgroundColor,
      loadBoard,
      type
    }));
    setLinkedBoard('');
    setSelectedBackgroundColor(backgroundColor);
  };

  const setLinkedBoardState = useCallback(
    updatedLoadBoardId => {
      const loadBoard =
        updatedLoadBoardId ??
        (currentTileProp('linkedBoard') || getCurrentlyEditingTile()
          ? currentTileProp('loadBoard')
          : null);
      const foundBoard = boards.find(board => board.id === loadBoard);
      setLinkedBoard(foundBoard ?? NONE_VALUE);
    },
    [boards, currentTileProp, getCurrentlyEditingTile]
  );

  // In class components, `this.setState` takes a second parameter that is a callback
  // that is called after the state has been updated. Functional components don't support this,
  // but we can use useRef paired with useEffect to track if the state change was triggered by a
  // navigation action (back or next button click).
  const isNavigationAction = useRef(false);

  const handleBack = useCallback(() => {
    isNavigationAction.current = true;
    setActiveStep(prevState => prevState - 1);
    setSelectedBackgroundColor('');
    setIsEditImageBtnActive(false);
  }, []);

  const handleNext = useCallback(() => {
    isNavigationAction.current = true;
    setActiveStep(prevState => prevState + 1);
    setSelectedBackgroundColor('');
    setIsEditImageBtnActive(false);
  }, []);

  useEffect(
    () => {
      if (isNavigationAction.current) {
        setLinkedBoardState();
        isNavigationAction.current = false;
      }
    },
    [activeStep, setLinkedBoardState]
  );

  const handleSearchClick = (event, currentLabel) => {
    setIsSymbolSearchOpen(true);
    setAutoFill(currentLabel || '');
    setIsEditImageBtnActive(false);
  };

  const getDefaultColor = () => {
    if (currentTileProp('type') === 'folder') {
      return defaultTileColors.folder;
    }
    if (currentTileProp('type') === 'button') {
      return defaultTileColors.button;
    }
    if (currentTileProp('type') === 'board') {
      return defaultTileColors.board;
    }
  };

  const getOriginalTileBackground = () => {
    return editingTiles?.[activeStep]?.backgroundColor || getDefaultColor();
  };

  const handleColorChange = useCallback(
    event => {
      const color = event?.target?.value || '';
      setSelectedBackgroundColor(color);

      const backgroundColor =
        color ||
        (editingTiles.length ? getOriginalTileBackground() : getDefaultColor());

      updateTileProperty('backgroundColor', backgroundColor);
    },
    // Don't need getOriginalTileBackground or getDefaultColor because they are pure functions
    // and are not passed as props.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editingTiles.length, updateTileProperty]
  );

  const handleBoardsChange = useCallback(
    event => {
      const board = event ? event.target.value : '';
      setLinkedBoard(board);
      if (board && board !== NONE_VALUE) {
        updateTileProperty('linkedBoard', true);
        updateTileProperty('loadBoard', board.id);
      } else {
        updateTileProperty('linkedBoard', false);
        updateTileProperty('loadBoard', shortid.generate());
      }
    },
    [updateTileProperty]
  );

  const handleLoadBoardChange = useCallback(
    ({ boardId }) => {
      if (boardId) {
        onAddApiBoard(boardId);
        updateTileProperty('loadBoard', boardId);
        setLinkedBoardState(boardId);
      }
    },
    [onAddApiBoard, updateTileProperty, setLinkedBoardState]
  );

  const handleOnClickImageEditor = () => {
    setOpenImageEditor(true);
  };

  const onImageEditorClose = () => {
    setOpenImageEditor(false);
  };

  const onImageEditorDone = useCallback(
    blob => {
      setImageUploadedData(prevState => {
        const newArray = [...prevState];
        if (newArray[activeStep]) {
          newArray[activeStep].blob = blob;
        }
        return newArray;
      });
      const image = URL.createObjectURL(blob);
      updateTileProperty('image', image);
    },
    [activeStep, updateTileProperty]
  );

  // This useEffect is for parity with the previous UNSAFE_componentWillReceiveProps behavior.
  useEffect(
    () => {
      setTilesToEdit(editingTiles);
      if (!getCurrentlyEditingTile()) {
        updateTileProperty('id', shortid.generate());
      }
    },
    // The dependency array should not include the functions invoked in the useEffect, as they
    // would re-run this effect on every change to tilesToEdit, reseting any local state updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editingTiles]
  );

  // The following pairing of useRef and useEffect is for parity with the previous
  // componentDidUpdate behavior.
  const prevOpen = useRef(open);

  useEffect(
    () => {
      if (open && !prevOpen.current) {
        if (getCurrentlyEditingTile()) {
          setLinkedBoardState();
        }
        if (isAndroid()) {
          requestCvaPermissions();
        }
      }
      prevOpen.current = open;
    },
    [open, getCurrentlyEditingTile, setLinkedBoardState]
  );

  // This effect runs when TileEditor opens or closes
  // Open: Initialize imageUploadedData state based on the number of tiles to edit
  // Close: reset all states to their defaults
  useEffect(
    () => {
      if (open) {
        if (getCurrentlyEditingTile()) {
          if (imageUploadedData.length !== tilesToEdit.length) {
            const initialArray = new Array(tilesToEdit.length).fill(
              defaultImageUploadedData
            );
            setImageUploadedData(initialArray);
          }
        } else {
          if (imageUploadedData.length === 0) {
            setImageUploadedData([defaultImageUploadedData]);
          }
        }
      } else {
        setImageUploadedData([]);
        setActiveStep(0);
        setTile(defaultTile);
        setIsEditImageBtnActive(false);
        setLinkedBoard('');
        setSelectedBackgroundColor('');
      }
    },
    [
      open,
      getCurrentlyEditingTile,
      tilesToEdit.length,
      imageUploadedData.length
    ]
  );

  const currentLabel = currentTileProp('labelKey')
    ? intl.formatMessage({ id: currentTileProp('labelKey') })
    : currentTileProp('label');
  const buttons = (
    <IconButton
      label={intl.formatMessage(messages.symbolSearch)}
      onClick={e => handleSearchClick(e, currentLabel)}
    >
      <SearchIcon />
    </IconButton>
  );

  const selectBoardElement = (
    <div style={{ marginTop: '16px' }}>
      <FormControl fullWidth>
        <InputLabel id="boards-input-label">
          {intl.formatMessage(messages.existingBoards)}
        </InputLabel>
        <Select
          labelId="boards-select-label"
          id="boards-select"
          autoWidth={true}
          value={linkedBoard}
          onChange={handleBoardsChange}
        >
          {!getCurrentlyEditingTile() && (
            <MenuItem value={NONE_VALUE}>
              <em>{intl.formatMessage(messages.none)}</em>
            </MenuItem>
          )}
          {boards.map(
            board =>
              !board.hidden && (
                <MenuItem key={board.id} value={board}>
                  {board.name}
                </MenuItem>
              )
          )}
        </Select>
      </FormControl>
    </div>
  );
  const tileInView = getCurrentlyEditingTile()
    ? getCurrentlyEditingTile()
    : tile;

  const loadBoard = currentTileProp('loadBoard');
  const haveLoadBoard = loadBoard?.length > 0;

  const loadBoardData = haveLoadBoard
    ? folders?.find(({ id }) => id === loadBoard)
    : null;

  const loadBoardName = loadBoardData && resolveBoardName(loadBoardData, intl);
  const isLocalLoadBoard = loadBoard?.length < SHORT_ID_MAX_LENGTH;

  return (
    <div className="TileEditor">
      <FullScreenDialog
        disableSubmit={!currentLabel}
        buttons={buttons}
        open={open}
        title={
          <FormattedMessage
            {...(getCurrentlyEditingTile()
              ? messages.editTile
              : messages.createTile)}
          />
        }
        onClose={handleCancel}
        onSubmit={handleSubmit}
      >
        <Paper>
          <FullScreenDialogContent className="TileEditor__container">
            <div className="TileEditor__row">
              <div className="TileEditor__main-info">
                <div className="TileEditor__picto-fields">
                  <div className="TileEditor__preview">
                    <Tile
                      backgroundColor={
                        selectedBackgroundColor || tileInView.backgroundColor
                      }
                      variant={
                        Boolean(tileInView.loadBoard) ? 'folder' : 'button'
                      }
                    >
                      {isLoading ? (
                        <CircularProgress />
                      ) : (
                        <Symbol
                          image={tileInView.image}
                          label={currentLabel}
                          keyPath={tileInView.keyPath}
                        />
                      )}
                    </Tile>
                  </div>
                  {isEditImageBtnActive && (
                    <>
                      <ImageEditor
                        intl={intl}
                        open={openImageEditor}
                        onImageEditorClose={onImageEditorClose}
                        onImageEditorDone={onImageEditorDone}
                        image={URL.createObjectURL(
                          imageUploadedData[activeStep].blobHQ
                        )}
                      />
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<EditIcon />}
                        onClick={handleOnClickImageEditor}
                        style={{ marginBottom: '6px' }}
                      >
                        {intl.formatMessage(messages.editImage)}
                      </Button>
                    </>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SearchIcon />}
                    onClick={e => handleSearchClick(e, currentLabel)}
                  >
                    {intl.formatMessage(messages.symbols)}
                  </Button>
                  <div className="TileEditor__input-image">
                    <InputImage
                      onChange={handleInputImageChange}
                      setIsLoadingImage={handleLoadingStateChange}
                    />
                  </div>
                </div>
                <div className="TileEditor__form-fields">
                  <TextField
                    id="label"
                    label={
                      currentTileProp('type') === 'board'
                        ? intl.formatMessage(messages.boardName)
                        : intl.formatMessage(messages.label)
                    }
                    value={currentLabel}
                    onChange={handleLabelChange}
                    fullWidth
                    required
                  />

                  <TextField
                    multiline
                    id="vocalization"
                    disabled={currentTileProp('type') === 'board'}
                    label={intl.formatMessage(messages.vocalization)}
                    value={currentTileProp('vocalization') || ''}
                    onChange={handleVocalizationChange}
                    fullWidth
                  />
                  {!getCurrentlyEditingTile() && (
                    <div className="TileEditor__radiogroup">
                      <FormControl fullWidth>
                        <FormLabel>
                          {intl.formatMessage(messages.type)}
                        </FormLabel>
                        <RadioGroup
                          row={true}
                          aria-label={intl.formatMessage(messages.type)}
                          name="type"
                          value={currentTileProp('type')}
                          onChange={handleTypeChange}
                        >
                          <FormControlLabel
                            value="button"
                            control={<Radio />}
                            label={intl.formatMessage(messages.button)}
                          />
                          <FormControlLabel
                            className="TileEditor__radiogroup__formcontrollabel"
                            value="folder"
                            control={<Radio />}
                            label={intl.formatMessage(messages.folder)}
                          />
                          <FormControlLabel
                            className="TileEditor__radiogroup__formcontrollabel"
                            value="board"
                            control={<Radio />}
                            label={intl.formatMessage(messages.board)}
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                  )}
                  {currentTileProp('type') === 'folder' && selectBoardElement}

                  {haveLoadBoard &&
                    !isLocalLoadBoard &&
                    !isCordova() &&
                    getCurrentlyEditingTile() && (
                      <>
                        <FormLabel
                          id="boards-input-label"
                          style={{ marginTop: '16px' }}
                        >
                          {intl.formatMessage(messages.loadFolderBoard)}
                        </FormLabel>
                        <div className="TileEditor__loadBoard_section">
                          {loadBoardName ? (
                            linkedBoard === NONE_VALUE && (
                              <Typography variant="body1">
                                {loadBoardName}
                              </Typography>
                            )
                          ) : (
                            <LostedFolderForLoadBoardAlert intl={intl} />
                          )}
                          <LoadBoardEditor
                            intl={intl}
                            onLoadBoardChange={handleLoadBoardChange}
                            isLostedFolder={loadBoardName === undefined}
                          />
                        </div>
                      </>
                    )}
                </div>
              </div>
            </div>
            <div className="TileEditor__row">
              <div className="TileEditor__form-fields">
                <div className="TileEditor__colorselect">
                  <ColorSelect
                    selectedColor={
                      selectedBackgroundColor || tileInView.backgroundColor
                    }
                    onChange={handleColorChange}
                    defaultColor={
                      getCurrentlyEditingTile()
                        ? getOriginalTileBackground()
                        : getDefaultColor()
                    }
                  />
                </div>
                {currentTileProp('type') !== 'board' && (
                  <div className="TileEditor__voicerecorder">
                    <FormLabel>
                      {intl.formatMessage(messages.voiceRecorder)}
                    </FormLabel>
                    <PremiumFeature>
                      <VoiceRecorder
                        src={currentTileProp('sound')}
                        onChange={handleSoundChange}
                      />
                    </PremiumFeature>
                  </div>
                )}
              </div>
            </div>
          </FullScreenDialogContent>

          {tilesToEdit.length > 1 && (
            <MobileStepper
              variant="progress"
              steps={tilesToEdit.length}
              position="static"
              activeStep={activeStep}
              nextButton={
                <Button
                  onClick={handleNext}
                  disabled={activeStep === tilesToEdit.length - 1}
                >
                  {intl.formatMessage(messages.next)} <KeyboardArrowRightIcon />
                </Button>
              }
              backButton={
                <Button onClick={handleBack} disabled={activeStep === 0}>
                  <KeyboardArrowLeftIcon />
                  {intl.formatMessage(messages.back)}
                </Button>
              }
            />
          )}
        </Paper>

        <SymbolSearch
          open={isSymbolSearchOpen}
          autoFill={autoFill}
          onChange={handleSymbolSearchChange}
          onClose={handleSymbolSearchClose}
        />
      </FullScreenDialog>
    </div>
  );
}

TileEditor.propTypes = {
  intl: PropTypes.object.isRequired,
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  editingTiles: PropTypes.array,
  onEditSubmit: PropTypes.func.isRequired,
  onAddSubmit: PropTypes.func.isRequired,
  boards: PropTypes.array,
  userData: PropTypes.object,
  folders: PropTypes.array,
  onAddApiBoard: PropTypes.func
};

export default injectIntl(TileEditor);
