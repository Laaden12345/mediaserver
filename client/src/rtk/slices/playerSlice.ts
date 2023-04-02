import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface PlayerState {
  playing: boolean
  media: string
  currentTime: number
  duration: number
}

const initialState: PlayerState = {
  playing: false,
  media: "",
  currentTime: 0,
  duration: 0,
}

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    play: (state, action: PayloadAction<string>) => {
      state.playing = true
      state.media = action.payload
    },
    pause: (state) => {
      state.playing = false
    },
    stop: (state) => {
      state.playing = false
      state.media = ""
    },
    setMedia: (state, action) => {
      state.media = action.payload
    },
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload
    },
    setDuration: (state, action) => {
      state.duration = action.payload
    },
  },
})

export const { play, pause, setMedia, setCurrentTime, setDuration } =
  playerSlice.actions

export default playerSlice.reducer
