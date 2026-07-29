import { Gallery, Selection } from '@repo/shared';
import { useReducer } from 'react';

import type { FileExplorerItem } from '../types';

interface ReducerState {
  selected: ReadonlySet<string>;
  /** Uncontrolled lightbox id. Controlled mode uses the `activeImageId` prop instead. */
  imageId: string | null;
}

type Action =
  | { type: 'toggleOne'; id: string; selectableIds: readonly string[] }
  | { type: 'toggleAll'; selectableIds: readonly string[] }
  | { type: 'clearSelection' }
  | { type: 'setImageId'; id: string | null };

function reducer(state: ReducerState, action: Action): ReducerState {
  switch (action.type) {
    case 'toggleOne':
      return {
        ...state,
        selected: Selection.toggleOne(
          Selection.prune(state.selected, action.selectableIds),
          action.id,
        ),
      };

    case 'toggleAll':
      return {
        ...state,
        selected: Selection.toggleAll(
          Selection.prune(state.selected, action.selectableIds),
          action.selectableIds,
        ),
      };

    case 'clearSelection':
      return { ...state, selected: Selection.empty() };

    case 'setImageId':
      return state.imageId === action.id ? state : { ...state, imageId: action.id };

    default:
      return state;
  }
}

const initialState: ReducerState = {
  selected: Selection.empty(),
  imageId: null,
};

export interface UseFileExplorerOptions {
  files: readonly FileExplorerItem[];
  activeImageId?: string | null;
  onActiveImageIdChange?: (id: string | null) => void;
}

export interface UseFileExplorerResult {
  selected: ReadonlySet<string>;
  selectableIds: string[];
  allSelected: boolean;
  someSelected: boolean;
  viewableFiles: FileExplorerItem[];
  activeImage: FileExplorerItem | null;
  toggleAll: () => void;
  toggleOne: (id: string) => void;
  clearSelection: () => void;
  openImage: (id: string) => void;
  closeImage: () => void;
  goPrev: () => void;
  goNext: () => void;
}

/** Selection + lightbox state. Derives selectable / viewable ids from `files`. */
export function useFileExplorer(options: UseFileExplorerOptions): UseFileExplorerResult {
  const { files, activeImageId, onActiveImageIdChange } = options;
  const [state, dispatch] = useReducer(reducer, initialState);

  const controlled = typeof onActiveImageIdChange === 'function';
  const selectableIds = files.filter((file) => file.selectable !== false).map((file) => file.id);
  const viewableFiles = files.filter((file) => Boolean(file.viewUrl));
  const selected = Selection.prune(state.selected, selectableIds);
  const requestedId = controlled ? (activeImageId ?? null) : state.imageId;
  const activeImage = Gallery.item(viewableFiles, requestedId);

  const setImageId = (id: string | null) => {
    if (controlled) {
      onActiveImageIdChange(id);
      return;
    }

    dispatch({ type: 'setImageId', id });
  };

  return {
    selected,
    selectableIds,
    allSelected: Selection.allSelected(selected, selectableIds),
    someSelected: Selection.someSelected(selected, selectableIds),
    viewableFiles,
    activeImage,
    toggleAll: () => {
      dispatch({ type: 'toggleAll', selectableIds });
    },
    toggleOne: (id) => {
      dispatch({ type: 'toggleOne', id, selectableIds });
    },
    clearSelection: () => {
      dispatch({ type: 'clearSelection' });
    },
    openImage: (id) => {
      if (!Gallery.item(viewableFiles, id)) {
        return;
      }

      setImageId(id);
    },
    closeImage: () => {
      setImageId(null);
    },
    goPrev: () => {
      setImageId(Gallery.prevId(viewableFiles, activeImage?.id ?? null));
    },
    goNext: () => {
      setImageId(Gallery.nextId(viewableFiles, activeImage?.id ?? null));
    },
  };
}
