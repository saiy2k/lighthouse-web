import { useEffect, useRef  }   from    'react';
import { ILNNode            }   from    './Interface';
import { RootState          }   from    './store';
import { 
    useAppSelector, 
    useAppDispatch          }   from    './store/hooks';
import { formatSats         }   from    './Utils';

import {
    UIState,
    updateL2,
    updateL3,
    updateL4
} from './store/uiSlice';

import {
    ISlide
} from './store/slideSlice';

import * as bootstrap from 'bootstrap';

import {
    turnOffSortShow,
    sortParamsChanged,
    removeAllHex
} from './store/slideSlice';

function FilterModal({ index, show, onClose } : { index: number, show: boolean, onClose: Function }) {

    const dispatch = useAppDispatch();
    const modalRef = useRef(null);
    const sortParams: string[]  =   useAppSelector((state: RootState) => state.slide.sortParams);
    const currentIndex: number  =   useAppSelector((state: RootState) => state.slide.currentIndex);
    const currentSlide: ISlide  =   useAppSelector((state: RootState) => state.slide.items[currentIndex]);
    const uiState: UIState      =   useAppSelector((state: RootState) => state.ui);
    const hoverNode: ILNNode | null    =   useAppSelector((state: RootState) => state.ui.hoverNode);

    let l2Text = '';
    let l2 = null;
    let l3Text = '';
    let l3 = null;
    let l4Text = '';
    let l4 = null;

    if (uiState.l2) {
        l2 = uiState.l2;
    } 

    if (uiState.l3) {
        l3 = uiState.l3;
    }

    if (uiState.l4) {
        l4 = uiState.l4;
    }

    if (hoverNode) {
        if (hoverNode.level == 2) {
            l2 = hoverNode;
        } else if (hoverNode.level == 3) {
            l3 = hoverNode;
        }
    }

    if (l2) {
        if (sortParams[0] === 'nodeCapacity') {
            l2Text = `${formatSats(l2.minCapacity)} to ${formatSats(l2.maxCapacity)}`;
        } else {
            l2Text = `${formatSats(l2.minChannelCapacity)} to ${formatSats(l2.maxChannelCapacity)}`;
        }
    }

    if (l3) {
        if (sortParams[1] === 'nodeCapacity') {
            l3Text = `${formatSats(l3.minCapacity)} to ${formatSats(l3.maxCapacity)}`;
        } else {
            l3Text = `${formatSats(l3.minChannelCapacity)} to ${formatSats(l3.maxChannelCapacity)}`;
        }
    }

    if (l4) {
        if (sortParams[2] === 'nodeCapacity') {
            l4Text = `${formatSats(l4.minCapacity)} to ${formatSats(l4.maxCapacity)}`;
        } else {
            l4Text = `${formatSats(l4.minChannelCapacity)} to ${formatSats(l4.maxChannelCapacity)}`;
        }
    }




    useEffect(() => {
        if (!show) return;

        const modalEle = modalRef.current;
        const bsModal = new bootstrap.Modal(modalEle as any, {
            backdrop: 'static',
            keyboard: false
        })
        bsModal.show();
    }, [show]);

    const hideModal = () => {
        const modalEle = modalRef.current;
        const bsModal= bootstrap.Modal.getInstance(modalEle as any);
        bsModal?.hide();

        dispatch(turnOffSortShow());

        setTimeout(() => {
            onClose();
        });
    }

    const sortParamChanged = (newIndex: number, sortParam: string) => {
        console.log('sortParamChanged: ', index, sortParam);
        dispatch(sortParamsChanged({
            index: newIndex,
            param: sortParam
        }));

        if ( index == 0 ) {
            dispatch(updateL2(null));
            dispatch(updateL3(null));
            dispatch(updateL4(null));
        }

        if ( index == 1 ) {
            dispatch(updateL2(null));
            dispatch(updateL3(null));
            dispatch(updateL4(null));
        }

        if ( index == 2 ) {
            dispatch(updateL3(null));
            dispatch(updateL4(null));
        }

        dispatch(removeAllHex());

        hideModal();
    }

    return <div className="modal" ref={modalRef} tabIndex={-1} >
            <div className="modal-dialog modal-dialog-centered">
                <div className="bg-black border-white modal-content" style={{ 'background': 'rgba(33, 35, 73, 0.9)', 'border': '1px solid #56598D', 'borderRadius': '25px' }}>
                    <div className="text-white modal-body">

                        <h4>
                            Sort options
                        </h4>
                        { /*
                        Group by &nbsp;
                        <button type="button" className="btn btn-outline-light" onClick={ (e: any) => sortParamChanged(index, 'nodeCapacity') } > Peer Capacity </button> &nbsp;
                        <button type="button" className="btn btn-outline-light" onClick={ (e: any) => sortParamChanged(index, 'channelCapacity') } > Channel Capacity </button> &nbsp;
                           */ }
                        <button type="button" className="btn btn-outline-light" onClick={hideModal} aria-label="Close"> Close </button>

                    <div className="bg-black card">
                            <div className="card-body">
                                <p className="card-text">

                                    <div style={{ 'fontSize': '12px' }}>
                                        { currentSlide.root?.alias } ( { currentSlide.root?.totalChildCount } )

                                        children sorted by <select value={ sortParams[0] } onChange={ (e: any) => sortParamChanged(0, e.target.value) }>
                                            <option value='nodeCapacity'> Peer capacity </option>
                                            <option value='channelCapacity'> Channel capacity </option>
                                        </select>
                                    </div>


                                    <div style={{ 'fontSize': '12px' }}>
                                        { l2 ? <>
                                            { l2Text } ( { l2.totalChildCount } ) children
                                        </>: currentSlide.root?.isLastBucket ? 'Peers': 'Cluster 1 children' }

                                        &nbsp; sorted by <select value={ sortParams[1] } onChange={ (e: any) => sortParamChanged(1, e.target.value) }>
                                            <option value='nodeCapacity'> Peer capacity </option>
                                            <option value='channelCapacity'> Channel capacity </option>
                                        </select>
                                    </div>


                                    { l2 ? (
                                        <div style={{ 'fontSize': '12px' }}>
                                            { l3 ? <>
                                                { l3Text } ( { l3.totalChildCount } ) children
                                            </>: l2.isLastBucket ? 'Peers': 'Cluster 2 children' }

                                            &nbsp; sorted by <select value={ sortParams[2] } onChange={ (e: any) => sortParamChanged(2, e.target.value) }>
                                                <option value='nodeCapacity'> Peer capacity </option>
                                                <option value='channelCapacity'> Channel capacity </option>
                                            </select>
                                        </div>

                                    ): null }

                                    { l3 && !l3.isLastBucket ? (
                                        <div style={{ 'fontSize': '12px' }}>
                                            { l4 ? <>
                                                { l4Text } ( { l4.totalChildCount } )
                                            </>: 'Cluster 3' }

                                            &nbsp; sorted by <select value={ sortParams[3] } onChange={ (e: any) => sortParamChanged(3, e.target.value) }>
                                                <option value='nodeCapacity'> Peer capacity </option>
                                                <option value='channelCapacity'> Channel capacity </option>
                                            </select>
                                        </div>
                                    ): null }



                                    { /*
                                    { sortParams.join(' > ') }
                                    <br />
                                    { hoverNode && <span>
                                        {formatSats(hoverNode?.minCapacity)} to {formatSats(hoverNode?.maxCapacity)}
                                        ({hoverNode.totalChildCount} peers)
                                        </span>
                                    }
                                       */ }
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
}

export default FilterModal;
