import * as actionTypes from '../actions/action-types'

import { IMediaGallery } from '../../types'

export const initialState: IMediaGallery = []

// TODO: Implement inversion of control for the reducer functions
// function setMediaValue<O extends IMediaItem, K extends keyof IMediaItem>(
//   state: IMediaGallery,
//   file: IMediaItem['file'],
//   key: K,
//   value: O[K]
// ) {
//   const newState = state.map(media => {
//     if (media.file === file) {
//       media[key] = value
//     }
//     return media
//   })

//   return newState
// }

export function reducer(state: IMediaGallery, action: any): IMediaGallery {
  switch (action.type) {
    case actionTypes.SET_GALLERY_ITEMS: {
      const { gallery } = action.payload
      return gallery
    }

    case actionTypes.TOGGLE_MEDIA_SELECTION: {
      const { file } = action.payload

      const newState = state.map(media => {
        if (media.file === file) {
          let selected = media.selected

          return { ...media, selected: !selected }
        }

        return media
      })

      return newState
    }

    case actionTypes.SET_MEDIA_NAME: {
      const { file, name } = action.payload

      const newState = state.map(media => {
        if (media.file === file) {
          return { ...media, name }
        }

        return media
      })

      return newState
    }

    case actionTypes.TOGGLE_GALLERY_SELECTION: {
      const { selected } = action.payload

      const newState = state.map(media => {
        return { ...media, selected }
      })

      return newState
    }

    case actionTypes.ADD_MEDIA: {
      const { file } = action.payload

      return [
        {
          file: file.name,
          src: file.preview,
          name: 'Description',
          order: 1,
          selected: false,
          isNew: true
        },
        ...state
      ]
    }

    case actionTypes.SET_MEDIA_AS_UPLOADED: {
      const { file } = action.payload

      const newState = state.map(media => {
        if (media.file === file) {
          return { ...media, isNew: false }
        }

        return media
      })

      return newState
    }

    case actionTypes.DELETE_MEDIA: {
      const { file } = action.payload

      const newState = state.filter(media => {
        return media.file !== file
      })

      return newState
    }

    case actionTypes.DELETE_MEDIAS: {
      const { files } = action.payload

      const newState = state.filter(media => {
        return files.indexOf(media.file) === -1
      })

      return newState
    }

    default:
      return state
  }
}
