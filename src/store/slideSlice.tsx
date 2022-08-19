import { 
    createAsyncThunk, 
    createSlice             }   from    '@reduxjs/toolkit';
import { ILNNode, ILNChannel}   from    '../Interface';
import { 
    getNodeFromRootById,
    nodeHash, 
    processNodes            }   from    '../Utils';

const serviceBase               =   'https://api.lnlighthouse.online/graph/nodes';
//const serviceBase               =   'https://7047-2401-4900-1c29-6ed5-2c98-ad5f-c5be-d7f4.in.ngrok.io' + '/graph/nodes';
//const serviceBase               =   'http://127.0.0.1:8089/graph/nodes';

export interface ISlide {
    index                       :   number;
    pubkey                      :   string;
    root                        :   ILNNode | null;
    error?                      :   string;
    status                      :   'loading' | 'loaded' | 'failed';
    peers                       :   ILNNode[];
    selectedBuckets             :   string[];
}

export interface SlideState {
    currentIndex                :   number;
    items                       :   ISlide[];
    sortParams                  :   string[];
    sortIndex                   :   number;
    sortShow                    :   boolean; // Todo: to be moved to uiSlice
    rawNodes                    :   { [key: string]: ILNNode[] }; // Todo: to be moved to network slice
}

const initialState: SlideState = {
    currentIndex                :   0,
    sortParams                  :   ['nodeCapacity', 'nodeCapacity', 'nodeCapacity', 'nodeCapacity'],
    sortIndex                   :   0,
    sortShow                    :   false,
    items: [{
        index                   :   0,
        //ACINQ (3000)
        //pubkey                  :   '03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f',
        //Globee (100)
        //pubkey                  :   '022c699df736064b51a33017abfc4d577d133f7124ac117d3d9f9633b6297a3b6a',
        //Enigma (11)
        //pubkey                  :   '03e0a6ca370edef2ad74b7a4bd1f14a338853c931de6038fe43bf4593cecb341f6',
        pubkey                  :   'root',
        root                    :   null,
        error                   :   '',
        status                  :   'loading',
        peers                   :   [],
        selectedBuckets         :   []
    }],
    rawNodes                    :   {
        '022c699df736064b51a33017abfc4d577d133f7124ac117d3d9f9633b6297a3b6a': []
    },
};

export const slideSlice = createSlice({

    name: 'slide',
    initialState,

    reducers: {

        goToSlide: (state: SlideState, action) => {
            if (action.payload.index >= state.items.length || action.payload.index < 0) return state;

            return {
                ...state,
                currentIndex: action.payload.index
            };
        },

        nextSlide: (state: SlideState) => {
            if (state.currentIndex >= state.items.length - 1 || state.currentIndex === 9) return state;
            return {
                ...state,
                currentIndex: state.currentIndex + 1
            };
        },

        prevSlide: (state: SlideState) => {
            if (state.currentIndex === 0) return state;
            return {
                ...state,
                currentIndex: state.currentIndex - 1
            };
        },

        addSlide: (state: SlideState, action) => {
            if (state.currentIndex === 49) return state;

            // pubkey already exists
            const slideIndex = state.items.findIndex((slide: ISlide) => slide.pubkey === action.payload.pubkey);
            if ( slideIndex !== -1 ) {
                return {
                    ...state,
                    currentIndex: slideIndex,
                }
            }

            return {
                ...state,
                items: [
                    ...state.items,
                    {
                        ...action.payload,
                        index: state.items.length,
                        root: action.payload.root || null,
                        peers: action.payload.peers || [],
                        selectedBuckets: action.payload.selectedBuckets || [],
                    }
                ],
                currentIndex: state.items.length
            }

        },

        slideLoaded: (state: SlideState, action) => {
            return {
                ...state,
                items: [
                    ...state.items,
                    {
                        ...state.items[action.payload.index],
                        root: action.payload.data[0],
                        status: 'loaded'
                    }

                ]
            }
        },

        slideFailed: (state: SlideState, action) => {
            return {
                ...state,
                items: [
                    ...state.items,
                    {
                        ...state.items[action.payload.index],
                        error: action.payload.error,
                        status: 'failed',
                    }

                ]
            }
        },

        turnOffSortShow: (state: SlideState) => {
            return {
                ...state,
                sortShow: false
            }
        },

        updateSortIndex: (state: SlideState, action) => {
            return {
                ...state,
                sortIndex: action.payload,
                sortShow: true
            }
        },

        sortParamsChanged: (state: SlideState, action) => {

            const sortParams = [
                ...state.sortParams
            ];
            sortParams[action.payload.index] = action.payload.param;
            if (action.payload.index === 0) {
                sortParams[0] = action.payload.param;
                sortParams[1] = action.payload.param;
                sortParams[2] = action.payload.param;
                sortParams[3] = action.payload.param;
            } else if (action.payload.index === 1) {
                sortParams[1] = action.payload.param;
                sortParams[2] = action.payload.param;
                sortParams[3] = action.payload.param;
            } else if (action.payload.index === 2) {
                sortParams[2] = action.payload.param;
                sortParams[3] = action.payload.param;
            } else if (action.payload.index === 3) {
                sortParams[3] = action.payload.param;
            }

            const slide = state.items[state.currentIndex];
            const rootNode: ILNNode = slide.root as ILNNode;
            const nodes: ILNNode[] = [
                ...state.rawNodes[rootNode.public_key]
            ];

            const children = processNodes(nodes.slice(1), 2, state.currentIndex + '-r', sortParams, rootNode.public_key)
            const totalChildCount = children.reduce((prev, curr) => prev + (curr.totalChildCount || 1), 0);

            state.sortParams = sortParams;
            (state.items[state.currentIndex] as any).root.children = children;
            (state.items[state.currentIndex] as any).root.totalChildCount = totalChildCount;

        },

        addAndShowHex: (state: SlideState, action) => {

            const newPeers = action.payload.children;
            const currentItem = state.items[state.currentIndex];
            const finalPeers = [...state.items[state.currentIndex].peers];
            const finalBuckets = [...state.items[state.currentIndex].selectedBuckets];

            for (let peer of newPeers) {
                const index = finalPeers.findIndex((p: ILNNode) => p.id === peer.id);
                peer = {
                    ...peer,
                    show: true
                };
                //if (index === -1) {
                    finalPeers.push(peer);
                //}
            }

            return {
                ...state,
                items: state.items.map((item: ISlide, index: number) => {
                    if (index === state.currentIndex) {
                        return {
                            ...item,
                            peers: finalPeers,
                            selectedBuckets: [
                                ...finalBuckets,
                                action.payload.id
                            ]
                        }
                    } else {
                        return item;
                    }
                })
            }

        },

        hideHex: (state: SlideState, action) => {

            const newPeers = action.payload.children;
            const finalPeers = [...state.items[state.currentIndex].peers];
            const selectedBuckets = [...state.items[state.currentIndex].selectedBuckets];
            const bucketIndex = selectedBuckets.findIndex((id: string) => id === action.payload.id);

            if (bucketIndex != -1) {
                selectedBuckets.splice(bucketIndex, 1);
            }
            for (let peer of newPeers) {
                const index = finalPeers.findIndex((p: ILNNode) => p.id === peer.id);
                if (index != -1) {
                    finalPeers[index] = {
                        ...finalPeers[index],
                        show : false
                    }
                }
            }

            return {
                ...state,
                items: state.items.map((item: ISlide, index: number) => {
                    if (index === state.currentIndex) {
                        return {
                            ...item,
                            peers: finalPeers,
                            selectedBuckets: selectedBuckets
                        }
                    } else {
                        return item;
                    }
                })
            }



        },

        removeHex: (state: SlideState, action) => {

            const newPeers = action.payload.children;
            const finalPeers = [...state.items[state.currentIndex].peers];
            for (let peer of newPeers) {
                const index = finalPeers.findIndex((p: ILNNode) => p.id === peer.id);
                if (index != -1) {
                    finalPeers.splice(index, 1);
                }
            }

            return {
                ...state,
                items: state.items.map((item: ISlide, index: number) => {
                    if (index === state.currentIndex) {
                        return {
                            ...item,
                            peers: finalPeers
                        }
                    } else {
                        return item;
                    }
                })
            }

        },

        removeAllHex: (state: SlideState) => {

            return {
                ...state,
                items: state.items.map((item: ISlide, index: number) => {
                    if (index === state.currentIndex) {
                        return {
                            ...item,
                            peers: []
                        }
                    } else {
                        return item;
                    }
                })
            }

        },



    },

    extraReducers(builder: any) {

        builder.addCase(fetchNode.pending, (state: any, action: any) => {
            // console.log('extraReducers :: pending', state, action);
        }).addCase(fetchNode.fulfilled, (state: any, action: any) => {
            // console.log('extraReducers :: fulfilled', state, action);

            if ( action.payload.data.nodes.length === 0) {
                const newItems = [...state.items];
                newItems.splice(action.payload.index, 1);

                return {
                    ...state,
                    items: newItems,
                    currentIndex: state.currentIndex - 1
                }
            }

            const sortParams = state.sortParams;
            const channelHash: Record<string, ILNChannel[]> = {};
            action.payload.data.channels.map((c: any) => {
                if (channelHash[c.n1_public_key]) {
                    channelHash[c.n1_public_key].push({
                        ...c,
                        n0_base_fee_mtokens: parseInt(c.n0_base_fee_mtokens),
                        n1_base_fee_mtokens: parseInt(c.n1_base_fee_mtokens),
                        n0_min_htlc_mtokens: parseInt(c.n0_min_htlc_mtokens),
                        n1_min_htlc_mtokens: parseInt(c.n1_min_htlc_mtokens),
                        n0_max_htlc_mtokens: parseInt(c.n0_max_htlc_mtokens),
                        n1_max_htlc_mtokens: parseInt(c.n1_max_htlc_mtokens),
                        n0_updated_at: c.n0_updated_at,
                        n1_updated_at: c.n1_updated_at,
                    });
                } else {
                    channelHash[c.n1_public_key] = [{
                        ...c,
                        n0_base_fee_mtokens: parseInt(c.n0_base_fee_mtokens),
                        n1_base_fee_mtokens: parseInt(c.n1_base_fee_mtokens),
                        n0_min_htlc_mtokens: parseInt(c.n0_min_htlc_mtokens),
                        n1_min_htlc_mtokens: parseInt(c.n1_min_htlc_mtokens),
                        n0_max_htlc_mtokens: parseInt(c.n0_max_htlc_mtokens),
                        n1_max_htlc_mtokens: parseInt(c.n1_max_htlc_mtokens),
                        n0_updated_at: c.n0_updated_at,
                        n1_updated_at: c.n1_updated_at,
                    }]
                }
            });


            const nodes: ILNNode[] = action.payload.data.nodes.map((n: any) => {

                const nChannels = channelHash[n.public_key];

                if (nChannels) {
                    return nChannels.map((ch: any) => {
                        return {
                            ...n,
                            alias       :   n.alias || n.public_key.substring(0, 20),
                            channel_capacity    :   ch.capacity || 0,
                            channel     :   ch,
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
                } else {
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
                }
            }).flat();

            const rootNode: ILNNode = nodes[0];
            nodeHash[rootNode.id] = {};
            nodeHash[rootNode.id][rootNode.id] = rootNode;

            rootNode.isBucket = nodes.length > 9;
            rootNode.isLastBucket = nodes.length <= 9;
            rootNode.rad = 45;
            rootNode.show = true;

            const obj: any = {};
            obj[rootNode.id] = nodes;

            return {
                ...state,
                items: [
                    ...state.items.map((slide: ISlide, index: number) => {

                        if(index === action.payload.index) {
                            const children = processNodes(nodes.slice(1), 2, index + '-r', sortParams, rootNode.public_key)
                            const totalChildCount = children.reduce((prev, curr) => prev + (curr.totalChildCount || 1), 0);
                            const s = {
                                ...slide,
                                root: {
                                    ...nodes[0],
                                    children,
                                    totalChildCount,
                                },
                                status: 'loaded'

                            }
                            return s;
                        } else {
                            return slide;
                        }

                    })
                ],
                rawNodes: {
                    ...state.rawNodes,
                    ...obj
                }
            }

        }).addCase(fetchNode.rejected, (state: any, action: any) => {
            // Remove the slide here
            // console.log('extraReducers :: rejected', state, action);
        }).addCase(fetchNetwork.pending, (state: any, action: any) => {
            // console.log('extraReducers :: fetchNetwork :: pending', state, action);
        }).addCase(fetchNetwork.fulfilled, (state: any, action: any) => {
            // console.log('extraReducers :: fetchNetwork :: fulfilled', state, action);

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

            const rootNode: ILNNode = {
                rad             :   10,

                alias           :   'Lightning network',
                capacity        :   4000,
                channel_count   :   0,
                public_key      :   'lightning',
                channel_capacity:   0,

                id              :   'lightning',
                children        :   [],
                isBucket        :   true,
                isLastBucket    :   false,
                level           :   1,
                show            :   true,
                minCapacity     :   0,
                maxCapacity     :   0,
                minChannelCapacity: 0,
                maxChannelCapacity: 0,
                totalChildCount: 0,

            };
            nodeHash[rootNode.id] = {};
            nodeHash[rootNode.id][rootNode.id] = rootNode;

            rootNode.isBucket = nodes.length > 9;
            rootNode.isLastBucket = nodes.length <= 9;
            rootNode.rad = 25;
            rootNode.show = true;

            const obj: any = {};
            obj[rootNode.id] = nodes;

            const children = processNodes(nodes, 2, 'lightning' + '-r', sortParams, rootNode.public_key)
            const totalChildCount = children.reduce((prev, curr) => prev + (curr.totalChildCount || 1), 0);

            return {
                ...state,
                items: [{
                    ...state.items[0],
                    root: {
                        ...nodes[0],
                        children,
                        totalChildCount,
                        capacity: 4500 * 100000000,
                        channel_count: '84,000+',
                        public_key: 'lightning',
                        alias: 'lightning network',
                        updated_at: new Date().getTime(),
                        id: 'lightning',
                        rad: 45,
                        isBucket: true,
                    },
                    status: 'loaded'
                }],
                rawNodes: {
                    ...state.rawNodes,
                    ...obj
                }
            }


        }).addCase(fetchNetwork.rejected, (state: any, action: any) => {
            // console.log('extraReducers :: fetchNetwork :: rejected', state, action);
        });
    }

});

export const { 
    addSlide,
    goToSlide,
    nextSlide,
    prevSlide,
    slideFailed,
    slideLoaded,
    sortParamsChanged,
    turnOffSortShow,
    updateSortIndex,
    addAndShowHex,
    hideHex,
    removeHex,
    removeAllHex,
} = slideSlice.actions;

export const fetchNode = createAsyncThunk('fetchNodes',
    async ({ pubkey, index } : { pubkey: string, index: number}) => {

        try {

            const apiRawResp    =   await fetch(serviceBase, {
                method          :   "POST",
                headers         :   { 'Content-Type': 'application/json' },
                body            :   JSON.stringify({ "public_keys": [pubkey] })
            });
            const data          =   await apiRawResp.json();

            return Promise.resolve({
                index,
                data
            });

        } catch (error) {

            return Promise.reject({
                index,
                error
            });

        }

});

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

export default slideSlice.reducer;
