import { 
    useEffect, 
    useRef, 
    useState                }   from    'react';

import useLongPress             from    './useLongPress';

import { RootState          }   from    './store';
import { 
    useAppSelector,
    useAppDispatch          }   from    './store/hooks';
import { 
    addAndShowHex,
    hideHex,
    removeHex,
    updateSortIndex         }   from    './store/slideSlice';
import { updateInfoPeer     }   from    './store/uiSlice';

import { ILNNode            }   from    './Interface';
import { 
    nodeHash,
    truncateText            }   from    './Utils';
import ClusterLayer             from    './ClusterLayer';
import PeerLayer                from    './PeerLayer';
import { size               }   from    './GraphController';
import { MOBILE_WIDTH       }   from    './Constants';

function LNCanvas() {

    let translateStr            =   `translate(${size.width * 0.5}px, ${size.height * 0.5}px)`;
    if (size.width <= MOBILE_WIDTH) {
        translateStr            =   `translate(${size.width * 0.5}px, ${size.height * 0.5}px)`;
    }

    const dispatch              =   useAppDispatch();
    const root                  =   useAppSelector((state: RootState) => state.slide.items[state.slide.currentIndex].root!);
    const prefix                =   useAppSelector((state: RootState) => state.slide.items[state.slide.currentIndex].index.toString() );

    const groupRef              =   useRef(null);
    const circleRef             =   useRef<SVGCircleElement>(null);
    const aliasRef              =   useRef<SVGTextElement>(null);
    const peerRef               =   useRef<SVGTextElement>(null);
    const clusterParentRef      =   useRef<SVGGElement>(null);
    const peerParentRef         =   useRef<SVGGElement>(null);
    //const filterRef             =   useRef(null);

    //const sortParams: string[]  =   useAppSelector((state: RootState) => state.slide.sortParams);
    const [clusterShow, setClusterShow] = useState<boolean>(false);
    const showPeers             =   useAppSelector((state: RootState) => {
        const currSlide = state.slide.items[state.slide.currentIndex];
        return currSlide.selectedBuckets.findIndex((id: string) => id == currSlide.root?.id) != -1;
    });

    // console.log('LNCanvas load', size, translateStr);

    useEffect(() => {
        setTimeout(() => {
            (groupRef as any).current.style.opacity = 1;
        });
    }, []);

    const handleMouseOver = (_n: ILNNode) => {
        circleRef.current!.style.strokeWidth = '1';
        aliasRef.current!.style.transform = 'translateY(-10px)';
        peerRef.current!.style.opacity = '0.75';
        //(filterRef as any).current.style.opacity = 0.75;
    }

    const handleMouseOut = (_n: ILNNode) => {
        circleRef.current!.style.strokeWidth = '0';
        aliasRef.current!.style.transform = 'translateY(-5px)';
        peerRef.current!.style.opacity = '0.4';
        //(filterRef as any).current.style.opacity = 0;
    }

    
    const longPressHandler = ({ node }: { node: ILNNode }) => {
        if (node.alias !== 'lightning') {
            dispatch(updateInfoPeer(node));
        }
        //dispatch(updateSortIndex(0));
    };

    const handleClick = ({ node }: { node: ILNNode }) => {
        if (node.isLastBucket) {

            if ( showPeers ) {
                dispatch(hideHex(node));
                setTimeout(() => {
                    dispatch(removeHex(node));
                }, 500);
            } else {
                dispatch(addAndShowHex(node));
            }
            return;

        }

        if (clusterShow) {
            setClusterShow(false);
            clusterParentRef.current!.style.transform = `${translateStr} scale(0.01)`;
            peerParentRef.current!.style.transform = `${translateStr} scale(0.01)`;
        } else {
            setClusterShow(true);
            clusterParentRef.current!.style.transform = `${translateStr} scale(1.0)`;
            peerParentRef.current!.style.transform = `${translateStr} scale(1.0)`;

        }

    }

    return <>

        <g ref={peerParentRef} style={{ 'transition': 'transform 1s', 'transform': `${translateStr}` }}>
            <PeerLayer />
        </g>
        <g ref={clusterParentRef} style={{ 'transition': 'transform 1s', 'transform': `${translateStr} scale(0.01)` }}>
            <ClusterLayer root={ root } show={ clusterShow } />
        </g>

        { /** ROOT Node */ }
        <g id={prefix + 'g-' + root.id} 
            className='cursor-pointer animOpacity'
            style={{ 'transform': translateStr, 'opacity': '0' }}
            ref={groupRef} 
            {...useLongPress({node: root, index: 0}, longPressHandler, handleClick)}
            onMouseOver={ () => handleMouseOver(root) }
            onMouseOut={ () => handleMouseOut(root) }
        >
            <defs>
                <linearGradient id="rootGrad" x1="0%" y1="0%" x2="0%" y2="120%">
                    <stop offset="20%" stopColor='#1673FF' stopOpacity='100%' />
                    <stop offset="92%" stopColor='#6000FE' stopOpacity='100%' />
                </linearGradient>
            </defs>

            <circle ref={circleRef} r={root.rad} stroke='#9cb8ed' strokeWidth={0} fill="url(#rootGrad)" style={{ 'filter': 'drop-shadow(0 0 10px #296FF2)' }} />
            <text ref={aliasRef} fill='white' textAnchor='middle' className='animTransform1s' style={{ 'transform': 'translateY(-5px)' }}>
                { root.alias == 'lightning network' ? root.alias : truncateText(root.alias) }
            </text>

            { /*
            <text ref={filterRef} fill='white' textAnchor='middle' dy='10' className='animOpacityHalf' style={{ 'opacity': '0', 'fontSize': '12px' }}>
                by { sortParams[0] == 'nodeCapacity' ? 'peer' : 'channel'  }
            </text>
               */ }
            <text ref={peerRef} fill='white' textAnchor='middle' dy='20' className='animOpacityHalf' style={{ 'opacity': '0.4', 'fontSize': '12px' }}>

                ({ root.totalChildCount }) { root.alias == 'lightning network' ? 'nodes' : 'peers' }
            </text>
        </g>
    </>;

}

export default LNCanvas;

