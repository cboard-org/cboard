# Changelog

## 1.7.1 (23/12/2020)

#### Bug Fixes:

- [**bug**] Shared boards have some titles of symbols translated back to English  [#794](https://github.com/cboard-org/cboard/issues/794)
- [**bug**] Edited positions of tiles are not remembered after logout [#774](https://github.com/cboard-org/cboard/issues/774)

---

## 1.7.0 (04/12/2020)

#### New Features

- [**feature**] New fixed board and grid  [#727](https://github.com/cboard-org/cboard/issues/727)

#### Bug Fixes:

- [**bug**] Importing boards from .json file gives warning "Nothing to import" [#789](https://github.com/cboard-org/cboard/issues/789)
- [**bug**] When font size large and extra large are used, some elements are overlaid with text [#775](https://github.com/cboard-org/cboard/issues/775)
- [**bug**] Imported board with folders (Cboard format) has "missed folders" [#773](https://github.com/cboard-org/cboard/issues/773)

---

## 1.6.0 (10/08/2020)

#### New Features

- [**feature**] Added analytics report on the web version [#766](https://github.com/cboard-org/cboard/issues/766)
- [**feature**] Keep embedded images when importing an OBF board that contains embedded images  [#756](https://github.com/cboard-org/cboard/issues/756)
- [**feature**] For Android app, add the Ability to record audio and save with tile [#726](https://github.com/cboard-org/cboard/issues/726)

#### Bug Fixes:

- [**bug**] Untraslated parts of the interface [#772](https://github.com/cboard-org/cboard/issues/772)
- [**bug**] SVG images won't display after import of an OBZ board  [#765](https://github.com/cboard-org/cboard/issues/765)
- [**bug**] Importing previously exported boards/folders from Cboard show with unknown/strange titles [#734](https://github.com/cboard-org/cboard/issues/734)
- [**bug**] Editing board title doesn't work on Android Cboard [#712](https://github.com/cboard-org/cboard/issues/712)
- [**bug**] Editing board title doesn't work on web Cboard [#710](https://github.com/cboard-org/cboard/issues/710)

---

## 1.5.1 (25/07/2020)

#### Bug Fixes:

- [**bug**] Revert react grid layout as it causes a bug on Android [#758](https://github.com/cboard-org/cboard/issues/758)

---

## 1.5.0 (23/07/2020)

#### New Features

- [**feature**][**good first issue**][**help wanted**] Using help file and returning to Cboard  [#737](https://github.com/cboard-org/cboard/issues/737)
- [**feature**][**help wanted**] Allow exporting just a single board using the obf file format  [#653](https://github.com/cboard-org/cboard/issues/653)

#### Bug Fixes:

- [**bug**] Fix to avoid withe screen on startup for some specific devices [#752](https://github.com/cboard-org/cboard/issues/752)
- [**bug**] Searching symbols from Global Symbols finds the symbols but without the picture [#733](https://github.com/cboard-org/cboard/issues/733)
- [**bug**] Firefox print/export to PDF is missing some symbols [#722](https://github.com/cboard-org/cboard/issues/722)
- [**bug**] Unexpected deletion of board upon folder tile removal [#629](https://github.com/cboard-org/cboard/issues/629)

---

## 1.4.0 (22/06/2020)

#### New Features

- [**feature**] Include Cyrillic script into Cboard using existing Alfanum Serbian voices  [#715](https://github.com/cboard-org/cboard/issues/715)
- [**feature**] Enhancement for the output bar in dark mode [#704](https://github.com/cboard-org/cboard/issues/704)

#### Bug Fixes:

- [**bug**] Fix layout direction for tile editor [#717](https://github.com/cboard-org/cboard/issues/717)
- [**bug**] Fix for UI, tile on hover has underline [#702](https://github.com/cboard-org/cboard/issues/702)
- [**bug**][**linux**] Fix for Firefox Linux Mint blank screen [#700](https://github.com/cboard-org/cboard/issues/700)
- [**bug**][**good first issue**][**help wanted**] When dark theme is on, when the output bar is clicked, it highlights the bar with white color so the text below the symbols can’t be seen because the text is also in white color. [#695](https://github.com/cboard-org/cboard/issues/695)
- [**bug**][**good first issue**][**help wanted**] When dark theme is on, the links that appear in the app are not visible because of the blue color [#694](https://github.com/cboard-org/cboard/issues/694)
- [**bug**] I tried to import the boards I previously exported from the Cboard, and most of them appeared with Unknown labels in the Boards menu [#693](https://github.com/cboard-org/cboard/issues/693)
- [**bug**][**help wanted**] When the option Above for Label position is selected, the exported board will have the label positioned below from the second page of the PDF [#692](https://github.com/cboard-org/cboard/issues/692)
- [**bug**] (Un)locking is not working properly after clicking Build option [#547](https://github.com/cboard-org/cboard/issues/547)

---

## 1.3.1 (28/04/2020)

#### Bug Fixes:

- [**bug**] Hotfix - Fix that Montenegrin is showed under Serbian language [#690](https://github.com/cboard-org/cboard/issues/690)

---

## 1.3.0 (23/04/2020)

#### New Features

- [**feature**] Review Material principles for colors [#686](https://github.com/cboard-org/cboard/issues/686)
- [**feature**][**good first issue**] Feature: Vocalizable folders [#611](https://github.com/cboard-org/cboard/issues/611)
- [**feature**] Dark Theme support [#112](https://github.com/cboard-org/cboard/issues/112)

#### Bug Fixes:

- [**bug**] Support for the new montenegrin TTS from Alfanum  [#688](https://github.com/cboard-org/cboard/issues/688)
- [**bug**] Filtered results are cancelled if click on LOAD MORE buttton  [#670](https://github.com/cboard-org/cboard/issues/670)
- [**bug**] For the boards that are published public with a description for the first time, it is not allowed to change the description [#669](https://github.com/cboard-org/cboard/issues/669)
- [**bug**] When downloading boards with more folders, not all folders are downloaded and visible in All my boards [#668](https://github.com/cboard-org/cboard/issues/668)
- [**bug**] Change filename for exported boards in case of cboard and open board option  [#667](https://github.com/cboard-org/cboard/issues/667)
- [**bug**] Store voiceURI setting on the database and read it at startup  [#666](https://github.com/cboard-org/cboard/issues/666)

---

## 1.2.0 (27/03/2020)

#### New Features

- [**feature**] Allow to export a single board [#663](https://github.com/cboard-org/cboard/issues/663)
- [**feature**][**help wanted**] add  linking the folder in editing mode as well  [#646](https://github.com/cboard-org/cboard/issues/646)
- [**feature**][**good first issue**][**help wanted**] Add a display setting of where the labels can be placed (above or below the symbol or even having no label) [#638](https://github.com/cboard-org/cboard/issues/638)

#### Bug Fixes:

- [**bug**] Fix for the Alfanum TTS Lite CRO engine  [#661](https://github.com/cboard-org/cboard/issues/661)
- [**bug**] Handle case of TTS engine returning no voices  [#658](https://github.com/cboard-org/cboard/issues/658)
- [**bug**] Not possible to edit a folder linking to a board  [#655](https://github.com/cboard-org/cboard/issues/655)
- [**bug**][**good first issue**][**help wanted**] Fix auto-generated user avatar to display one or two letters [#626](https://github.com/cboard-org/cboard/issues/626)

---

## 1.1.7 (11/03/2020)

#### New Features

- [**feature**] Allow to edit the board cover image from communicator builder  [#648](https://github.com/cboard-org/cboard/issues/648)

#### Bug Fixes:

- [**bug**] instead of board ID at the beginning of the PDF write board’s name (or nothing) [#645](https://github.com/cboard-org/cboard/issues/645)
- [**bug**] Some of the symbols are not represented with the same color background in the PDF as they are in the Cboard [#644](https://github.com/cboard-org/cboard/issues/644)
- [**bug**] Exporting two times a board overriddes the first one [#643](https://github.com/cboard-org/cboard/issues/643)
- [**bug**] When add more than one board from public boards, first (or first two) board is visible in Boards and All my boards [#642](https://github.com/cboard-org/cboard/issues/642)
- [**bug**] Board description at the time of publishing were not visible after clicking on information button for the board in the public boards [#641](https://github.com/cboard-org/cboard/issues/641)
- [**bug**][**help wanted**] Export to PDF losing some symbols in the case the symbol source is ARASAAC or Global symbols  X  [#639](https://github.com/cboard-org/cboard/issues/639)

---

## 1.1.6 (20/02/2020)

#### New Features

- [**feature**] Implement symbol sources filtering; Mulberry, Global symbols and ARASAAC  [#636](https://github.com/cboard-org/cboard/issues/636)
- [**feature**][**help wanted**] Ask for board description at the time of publish a board [#620](https://github.com/cboard-org/cboard/issues/620)

#### Bug Fixes:

- [**bug**] Fix bug on public boards become private after board edit [#635](https://github.com/cboard-org/cboard/issues/635)
- [**bug**] Fix Boards search from communicator builder [#634](https://github.com/cboard-org/cboard/issues/634)
- [**bug**] board change of the name cannot be saved [#633](https://github.com/cboard-org/cboard/issues/633)

---

## 1.1.5 (06/02/2020)

#### New Features

- [**feature**] Improve the color select component  [#624](https://github.com/cboard-org/cboard/issues/624)
- [**feature**][**good first issue**][**help wanted**] Add loading Circular progress when click LOAD MORE buttton  [#621](https://github.com/cboard-org/cboard/issues/621)
- [**feature**][**good first issue**][**help wanted**] Option for hiding the sentence bar available through the settings menu. [#608](https://github.com/cboard-org/cboard/issues/608)
- [**feature**][**help wanted**] Linking between existing boards: [#603](https://github.com/cboard-org/cboard/issues/603)

---

## 1.1.4 (31/01/2020)

#### New Features

- [**feature**] Migrate to material ui 4  [#616](https://github.com/cboard-org/cboard/issues/616)
- [**feature**] Added date to the board information display [#615](https://github.com/cboard-org/cboard/issues/615)

#### Bug Fixes:

- [**bug**] Copy boards recursively when get a public board [#618](https://github.com/cboard-org/cboard/issues/618)

---

## 1.1.3 (23/01/2020)

#### New Features

- [**feature**] Full Refactor communicator builder [#610](https://github.com/cboard-org/cboard/issues/610)
- [**feature**] Feature: Support importation of transparent images (alpha channel) [#604](https://github.com/cboard-org/cboard/issues/604)
- [**feature**] Implement Board removal [#602](https://github.com/cboard-org/cboard/issues/602)

#### Bug Fixes:

- [**bug**] Support importation of transparent images [#609](https://github.com/cboard-org/cboard/issues/609)

---

## 1.1.2 (17/12/2019)

#### Bug Fixes:

- [**bug**] restore the original size for the grid [#600](https://github.com/cboard-org/cboard/issues/600)

---

## 1.1.1 (16/12/2019)

#### New Features

- [**feature**] Improve display on tablet devices (better tile size) [#599](https://github.com/cboard-org/cboard/issues/599)

#### Bug Fixes:

- [**bug**] Navigation bar (buttons recent apps, home and back) visible after adding/editing new symbol [#591](https://github.com/cboard-org/cboard/issues/591)

---

## 1.1.0 (14/12/2019)

#### New Features

- [**feature**] Enable public boards to be displayed under public boards list on communicator builder  [#597](https://github.com/cboard-org/cboard/issues/597)
- [**feature**] Hiding voice recorder feature for Android app  [#595](https://github.com/cboard-org/cboard/issues/595)
- [**feature**] The voice recorder function in creating a Symbol is not work [#589](https://github.com/cboard-org/cboard/issues/589)
- [**feature**] Add Image Caching to Cordova application for API symbols [#542](https://github.com/cboard-org/cboard/issues/542)

#### Bug Fixes:

- [**bug**] Cboard version 1.0.12 -The Import and Export functions are not working well [#588](https://github.com/cboard-org/cboard/issues/588)
- [**bug**] Choosing multiple tiles to edit for colour changes etc - have to save individually [#583](https://github.com/cboard-org/cboard/issues/583)
- [**bug**] Fitzgerald colour code white or no background colour needs ring around the colour [#582](https://github.com/cboard-org/cboard/issues/582)

---

## 1.0.12 (07/12/2019)

#### Bug Fixes:

- [**bug**] Obz import from Coughdrop is not working for android  [#585](https://github.com/cboard-org/cboard/issues/585)
- [**bug**] Obz import from cboard is not working for android  [#584](https://github.com/cboard-org/cboard/issues/584)
- [**bug**] After finding the .obf file in the Downloads, the file is greyed and it is not allowed to be clicked and imported into Cboard [#540](https://github.com/cboard-org/cboard/issues/540)

---

## 1.0.11 (29/11/2019)

#### Bug Fixes:

- [**bug**] Editing a tile from default folder causes white screen with loading icon [#573](https://github.com/cboard-org/cboard/issues/573)
- [**bug**] Sharing via Facebook doesn't work and causes white screen [#568](https://github.com/cboard-org/cboard/issues/568)
- [**bug**] Sharing board via e-mail doesn't work [#567](https://github.com/cboard-org/cboard/issues/567)
- [**bug**] Not allowed to go back after editing tile from default folders in home board  [#560](https://github.com/cboard-org/cboard/issues/560)
- [**bug**] White screen situations [#559](https://github.com/cboard-org/cboard/issues/559)
- [**bug**] Navigation bar (buttons recent apps, home and back) and status bar visible after adding new symbol/folder [#541](https://github.com/cboard-org/cboard/issues/541)
- [**bug**] Fix for Exporting in OpenBoard format on Android app  [#538](https://github.com/cboard-org/cboard/issues/538)

---

## 1.0.10 (25/11/2019)

#### Bug Fixes:

- [**bug**] HOTFIX - Fix for  google analytics api update [#571](https://github.com/cboard-org/cboard/issues/571)

---

## 1.0.9 (23/11/2019)

#### New Features

- [**feature**] Update translations [#570](https://github.com/cboard-org/cboard/issues/570)

---

## 1.0.8 (22/11/2019)

#### Bug Fixes:

- [**bug**] All my boards available only when online and missing boards/symbols in offline mode [#565](https://github.com/cboard-org/cboard/issues/565)
- [**bug**] Blank page when try to get a local board from remote  [#562](https://github.com/cboard-org/cboard/issues/562)
- [**bug**] Some time the Audio stream is not working when the Alfanum TTS is selected [#549](https://github.com/cboard-org/cboard/issues/549)
- [**bug**] When user goes to online mode, check if there are new boards/folders/tiles and save them [#539](https://github.com/cboard-org/cboard/issues/539)
- [**bug**] The application often does not remember selected language in the settings [#511](https://github.com/cboard-org/cboard/issues/511)

---

## 1.0.7 (15/11/2019)

#### New Features

- [**feature**] Setup initial version for mobile analytics using Android System to store offline analytics  [#554](https://github.com/cboard-org/cboard/issues/554)

#### Bug Fixes:

- [**bug**] Fix for non standard language code like ME for Montenegrin language [#553](https://github.com/cboard-org/cboard/issues/553)
- [**bug**] Unable to load the image/symbol from the device  [#545](https://github.com/cboard-org/cboard/issues/545)
- [**bug**] Wrong Croatian User Help file in the settings [#544](https://github.com/cboard-org/cboard/issues/544)
- [**bug**] Issues for back navigation [#543](https://github.com/cboard-org/cboard/issues/543)

---

## 1.0.6 (07/11/2019)

#### New Features

- [**feature**] Update Montenegrin translation strings  [#518](https://github.com/cboard-org/cboard/issues/518)
- [**feature**] No option to change password if you forget it and you cannot log in [#513](https://github.com/cboard-org/cboard/issues/513)

#### Bug Fixes:

- [**bug**] After adding the new board, it appears at the bottom of the home board (like new tile) and it shouldn't (screenshot in the right cell - new board is colored grey) [#515](https://github.com/cboard-org/cboard/issues/515)
- [**bug**] Missing board after logging out and in [#514](https://github.com/cboard-org/cboard/issues/514)

---

## 1.0.5 (05/11/2019)

#### New Features

- [**feature**] Update serbian latin Strings [#524](https://github.com/cboard-org/cboard/issues/524)

#### Bug Fixes:

- [**bug**] Fix for Montenegrin translation showing in english [#525](https://github.com/cboard-org/cboard/issues/525)
- [**bug**] Fix for signup on Android app that prevented signup  [#523](https://github.com/cboard-org/cboard/issues/523)
- [**bug**] Support color Scheme [#522](https://github.com/cboard-org/cboard/issues/522)
- [**bug**] Fix for edition of remote boards [#521](https://github.com/cboard-org/cboard/issues/521)
- [**bug**] Fix for unstable empty Board creation [#520](https://github.com/cboard-org/cboard/issues/520)
- [**bug**] Important fix for remote boards synchronism [#519](https://github.com/cboard-org/cboard/issues/519)

---

## 1.0.3 (29/10/2019)

#### Bug Fixes:

- [**bug**] Update the board container to better online synchronism  [#535](https://github.com/cboard-org/cboard/issues/535)

---

## 1.0.2 (27/10/2019)

#### Bug Fixes:

- [**bug**]  fix for board caption on communicator toolbar [#533](https://github.com/cboard-org/cboard/issues/533)
- [**bug**] Fixes for backnavigation issues [#532](https://github.com/cboard-org/cboard/issues/532)

---

## 1.0.1 (27/10/2019)

#### New Features

- [**feature**] Global symbols integration [#531](https://github.com/cboard-org/cboard/issues/531)
- [**feature**] Added translation for Serbian 'sr-SR'.  [#529](https://github.com/cboard-org/cboard/issues/529)
- [**feature**] Added capabilities to create an empty board not linked to the current active board. [#528](https://github.com/cboard-org/cboard/issues/528)
- [**feature**] Support for the alfanum TTS engine. [#527](https://github.com/cboard-org/cboard/issues/527)
- [**feature**] Support for the Samsung TTS engine which is the default tts engine on Samsung devices. [#526](https://github.com/cboard-org/cboard/issues/526)

#### Bug Fixes:

- [**bug**] Remove social login buttons. [#530](https://github.com/cboard-org/cboard/issues/530)

---

## Fix speech provider for Android  (27/09/2019)

---

## fix for package json and index html  (16/09/2019)
