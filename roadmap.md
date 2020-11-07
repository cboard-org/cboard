# Cboard Project Roadmap

This document outlines the development plan from a high level and will be updated as development progresses towards version 2.0. It should be noted that this roadmap applies to the project as a whole (frontend/backend).

## ✔️2020  Quarter 4 - Fixed boards support 
The quarter focuses on providing support boards that can be fixed in terms of rows and columns, and easily edited at the same time. This will allow to choose a position on the board to add a new tile, and when deleting a tile when locked, it deletes the tile and other tiles do not move position.

## 2021 Quarter 1 - Cloud TTS voices
The quarter deals mainly with adding the ability to use online services for the text to speech. There are many suitable cloud services (Azure?).
This will allow to speak more naturally, choosing from more voices and more languages and variants. We can customize voices, and access voices with different speaking styles and emotional tones.

## 2021 Quarter 2 - Improve navigation between tiles and folders
Implement machine learning algorithms to offer automated navigation across boards based on usage data, context (time and location), and text predictions.
Milestones are: 
- Platform updates and requirements gathering.
- Python and Sci-kit in our cloud.
- Cboard to support automated navigation on the code (UI updates ).


## 2021 Quarter 3 - Launch Machine learning

The third quarter continues some efforts from Q2, mainly setting up a ML model.
Milestones are: 
- Gathering Data.
- Define boards set.
- Implement data collect via Cboard API using anonymous data.
- Define the model. Decision Trees/Random Forest algorithms?
- Classification best fit

Launch to production and evaluate the model with production data.