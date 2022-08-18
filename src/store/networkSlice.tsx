import { 
    createAsyncThunk, 
    createSlice             }   from    '@reduxjs/toolkit';
import { ILNNode, ILNChannel}   from    '../Interface';
import { nodeHash, processNodes}from    '../Utils';

const serviceBase               =   'https://api.lnlighthouse.online/graph/nodes';

export interface ISlide {
    root                        :   ILNNode | null;
    error?                      :   string;
    status                      :   'loading' | 'loaded' | 'failed';
    peers                       :   ILNNode[];
    selectedBuckets             :   string[];
}

const initialState: ISlide = {
        root                    :   null,
        error                   :   '',
        status                  :   'loading',
        peers                   :   [],
        selectedBuckets         :   []
};

export const networkSlice = createSlice({

    name: 'network',
    initialState,

    reducers: {

        slideLoaded: (state: ISlide, action) => {
            return {
                ...state,
                root: action.payload,
                status: 'loaded'
            }
        },

        slideFailed: (state: ISlide, action) => {
            return {
                ...state,
                error: action.payload,
                status: 'failed',
            }
        },

        addAndShowHex: (state: ISlide, action) => {

            debugger;

            const newPeers = action.payload.children;
            const finalPeers = [...state.peers];

            /*
            if (finalPeers.length > 100) return state;

            for (let peer of newPeers) {
                const index = finalPeers.findIndex((p: ILNNode) => p.id == peer.id);
                peer = {
                    ...peer,
                    show: true
                };
                //if (index == -1) {
                    finalPeers.push(peer);
                //}
            }
             */

            return {
                ...state,
                peers: finalPeers,
                selectedBuckets: [
                    ...state.selectedBuckets,
                    action.payload.id
                ]
            }

        },

        hideHex: (state: ISlide, action) => {
            return state;
        },

        removeHex: (state: ISlide, action) => {
            return state;
        },

        removeAllHex: (state: ISlide) => {
            return state;
        },

    },

    extraReducers(builder: any) {

        builder.addCase(fetchNetwork.pending, (state: any, action: any) => {
            console.log('extraReducers :: pending', state, action);
        }).addCase(fetchNetwork.fulfilled, (state: any, action: any) => {
            console.log('extraReducers :: fulfilled', state, action);

            if ( action.payload.nodes.length == 0) {
                return state;
            }

            const sortParams = state.sortParams;

            const nodes: ILNNode[] = action.payload.nodes.map((n: any) => {
                return {
                    ...n,
                    alias       :   n.alias || n.public_key.substring(0, 20),
                    channel_capacity    :   0,
                    channel     :   null,
                    updated_at  :   n.updated_at,

                    id          :   n.public_key,
                    children    :   [],
                    isBucket    :   false,
                    isLastBucket:   false,
                    level       :   1,
                    show        :   false,
                    description :   n.alias,
                    minCapacity :   0,
                    maxCapacity :   0,
                    rad         :   10,
                    minChannelCapacity  :   0,
                    maxChannelCapacity  :   0,
                    totalChildCount     :   0,

                };
            });

            const rootNode: ILNNode = nodes[0];
            nodeHash[rootNode.id] = {};
            nodeHash[rootNode.id][rootNode.id] = rootNode;

            rootNode.isBucket = nodes.length > 8;
            rootNode.isLastBucket = nodes.length <= 8;
            rootNode.rad = 45;
            rootNode.show = true;

            const obj: any = {};
            obj[rootNode.id] = nodes;

            const children = processNodes(nodes.slice(1), 2, 'network' + '-r', sortParams, rootNode.public_key)
            const totalChildCount = children.reduce((prev, curr) => prev + (curr.totalChildCount || 1), 0);

            return {
                ...state,
                root: {
                    ...nodes[0],
                    children,
                    totalChildCount,
                },
                status: 'loaded'
            }

        }).addCase(fetchNetwork.rejected, (state: any, action: any) => {
            // Remove the slide here
            console.log('extraReducers :: rejected', state, action);
        });
    }

});

export const { 
    slideFailed,
    slideLoaded,
    addAndShowHex,
    hideHex,
    removeHex,
    removeAllHex,
} = networkSlice.actions;

export const fetchNetwork = createAsyncThunk('fetchNetwork',
    async () => {

        try {

            const apiRawResp    =   await fetch(serviceBase, {
                method          :   "GET",
                headers         :   { 'Content-Type': 'application/json' },
            });
            const data          =   await apiRawResp.json();

            return Promise.resolve(data);

        } catch (error) {

            return Promise.reject(error);

        }

});

export default networkSlice.reducer;
