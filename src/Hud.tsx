import { ILNNode } from './Interface';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { RootState } from './store';
import { formatSats } from './Utils';

import {
    UIState
} from './store/uiSlice';

import {
    ISlide
} from './store/slideSlice';

function HUD() {

    const dispatch              =   useAppDispatch();
    const sortParams: string[]  =   useAppSelector((state: RootState) => state.slide.sortParams);
    const currentIndex: number  =   useAppSelector((state: RootState) => state.slide.currentIndex);
    const currentSlide: ISlide  =   useAppSelector((state: RootState) => state.slide.items[currentIndex]);
    const uiState: UIState      =   useAppSelector((state: RootState) => state.ui);
    const hoverNode: ILNNode | null    =   useAppSelector((state: RootState) => state.ui.hoverNode);

    let l2Text = '';
    let l2 = null;
    let l3Text = '';
    let l3 = null;

    if (uiState.l2) {
        l2 = uiState.l2;
    } 

    if (uiState.l3) {
        l3 = uiState.l3;
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


    return (
        <div className="bg-black card" style={{'width': '3rem;', 'position': 'absolute', 'bottom': '0px' }} >
            <div className="card-body">
                <h5 className="card-title">
                    { currentSlide.root?.alias } ( { currentSlide.root?.totalChildCount } )
                </h5>
                <p className="card-text">

                    &lt; &lt; &lt; by { sortParams[0] } &gt; &gt; &gt; <br/>

                    { l2 ? (
                        <>
                            { l2Text } ( { l2.totalChildCount } ) <br/>
                            &lt; &lt; &lt; { sortParams[1] } &gt; &gt; &gt;  <br/>
                        </>
                    ): null }

                    { l3 ? (
                        <>
                            { l3Text } ( { l3.totalChildCount } ) <br/>
                            &lt; &lt; &lt; { sortParams[2] } &gt; &gt; &gt;  <br/>
                        </>
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
        
    );
}

export default HUD;
