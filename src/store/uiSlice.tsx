import { createSlice } from '@reduxjs/toolkit';
import { ILNNode } from '../Interface';

export interface UIState {
    hoverNode                   :   ILNNode | null;
    l2                          :   ILNNode | null;
    l3                          :   ILNNode | null;
    l4                          :   ILNNode | null;
    l5                          :   ILNNode | null;
    infoPeer                    :   ILNNode | null;
}

const initialState: UIState = {
    hoverNode                   :   null,
    l2                          :   null,
    l3                          :   null,
    l4                          :   null,
    l5                          :   null,
    infoPeer                    :   null,
};
export const uiSlice = createSlice({

    name: 'ui',
    initialState,

    reducers: {

        updateHoverNode: (state: UIState, action) => {
            return {
                ...state,
                hoverNode: action.payload
            };
        },

        updateL2: (state: UIState, action) => {
            return {
                ...state,
                l2: action.payload
            };
        },


        updateL3: (state: UIState, action) => {
            return {
                ...state,
                l3: action.payload
            };
        },

        updateL4: (state: UIState, action) => {
            return {
                ...state,
                l4: action.payload
            };
        },

        updateL5: (state: UIState, action) => {
            return {
                ...state,
                l5: action.payload
            };
        },

        updateInfoPeer: (state: UIState, action) => {
            return {
                ...state,
                infoPeer: action.payload
            };
        },
    },

});

export const { 
    updateHoverNode,
    updateL2,
    updateL3,
    updateL4,
    updateL5,
    updateInfoPeer,
} = uiSlice.actions;

export default uiSlice.reducer;
