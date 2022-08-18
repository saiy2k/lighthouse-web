import { 
    useEffect,
    useRef,
    useState                }   from    'react';

import useLongPress             from    './useLongPress';

import { 
    useAppSelector, 
    useAppDispatch          }   from    './store/hooks';
import { RootState          }   from    './store';
import { 
    addAndShowHex,
    hideHex,
    removeHex,
    updateSortIndex         }   from    './store/slideSlice';

import { ILNNode            }   from    './Interface';
import { 
    getNodeFromRootById,
    formatSats, 
    describeArc             }   from    './Utils';

import { 
    CLUSTER_FILL,
    CLUSTER_STROKE,
    MAX_HEX                 }   from    './Constants';

interface ClusterSegmentParams {
    node                        :   ILNNode;
    index                       :   number;
    arcDegree                   :   number;
    baseAngle                   :   number;
    angle                       :   number;
    selected                    :   boolean;
    show                        :   boolean;
    onClick                     :   Function;
};

function ClusterSegment({ node, index, arcDegree, baseAngle, angle, selected, show, onClick } : ClusterSegmentParams) {

    const dispatch              =   useAppDispatch();
    const sortParam: string     =   useAppSelector((state: RootState) => state.slide.sortParams[node.level - 2]);
    const peerLength: number    =   useAppSelector((state: RootState) => state.slide.items[state.slide.currentIndex].peers.length)
    const rootNode: ILNNode | null= useAppSelector((state: RootState) => state.slide.items[state.slide.currentIndex].root)
    const selBuckets: string[]  =   useAppSelector((state: RootState) => state.slide.items[state.slide.currentIndex].selectedBuckets)
    const groupRef              =   useRef<SVGGElement>(null);
    const circleRef             =   useRef<SVGCircleElement>(null);
    const aliasRef              =   useRef<SVGTextElement>(null);
    const alias1Ref             =   useRef<SVGTextElement>(null);
    const text1Ref              =   useRef<SVGTextElement>(null);
    const [hover, setHover]     =   useState<boolean>(false);
    const showPeers             =   useAppSelector((state: RootState) => state.slide.items[state.slide.currentIndex].selectedBuckets.findIndex((id: string) => id === node.id) !== -1);

    useEffect(() => {
        if (show) {
            setTimeout(() => {
                groupRef.current!.style.opacity = '1';
                groupRef.current!.style.transform = `rotate(${angle}deg)`;
            });
        } else {
            setTimeout(() => {
                groupRef.current!.style.opacity = '0';
                groupRef.current!.style.transform = `rotate(${0}deg)`;
                text1Ref.current!.style.opacity = '0';
                aliasRef.current!.style.opacity= '0';
                alias1Ref.current!.style.opacity= '0';
            });
        }
    }, [show, angle]);

    const handleMouseOver = () => {

        setHover(true);

        groupRef.current!.style.transform = `scale(${1 + (6 - node.level) * 0.01}) rotate(${angle}deg)`;
        circleRef.current!.style.strokeWidth = '2';
        text1Ref.current!.style.opacity = '1';
        aliasRef.current!.style.display= 'none';
        alias1Ref.current!.style.opacity= '1';

    }

    const handleMouseOut = () => {

        setHover(false);

        groupRef.current!.style.transform = `scale(1.0) rotate(${angle}deg)`;
        circleRef.current!.style.strokeWidth = '1';
        text1Ref.current!.style.opacity = '0';
        aliasRef.current!.style.display= 'block';
        alias1Ref.current!.style.opacity= '0';

    }

    let tx = 100, ty = 0, t1x = 0, t1y = 0, tangle = 0, tangleArr: number[] = [];

    if (node.level === 2) {
        tx = (node.rad * 0.78) * Math.cos((index * arcDegree - 68) * Math.PI / 180);
        ty = (node.rad * 0.78) * Math.sin((index * arcDegree - 68) * Math.PI / 180);

        tangle = angle + arcDegree / 2;
        tangle = tangle % 360;
        if (tangle > 90 && tangle < 270) tangle = tangle - 180;

        t1x = (node.rad * 0.9) * Math.cos((index * arcDegree - 68) * Math.PI / 180);
        t1y = (node.rad * 0.9) * Math.sin((index * arcDegree - 68) * Math.PI / 180);

    } else if (node.level === 3) {
        tx = (node.rad * 0.86) * Math.cos((index * arcDegree - 76 + baseAngle) * Math.PI / 180);
        ty = (node.rad * 0.86) * Math.sin((index * arcDegree - 76 + baseAngle) * Math.PI / 180);

        tangle = angle + arcDegree / 2;
        tangle = tangle % 360;
        if (tangle > 90 && tangle < 270) tangle = tangle - 180;

        t1x = (node.rad * 0.94) * Math.cos((index * arcDegree - 76 + baseAngle) * Math.PI / 180);
        t1y = (node.rad * 0.94) * Math.sin((index * arcDegree - 76 + baseAngle) * Math.PI / 180);

    } else if (node.level === 4) {
        tx = (node.rad * 0.88) * Math.cos((index * arcDegree - 79 + baseAngle) * Math.PI / 180);
        ty = (node.rad * 0.88) * Math.sin((index * arcDegree - 79 + baseAngle) * Math.PI / 180);

        tangle = angle + arcDegree * 0.4;
        tangle = tangle % 360;
        if (tangle > 90 && tangle < 270) tangle = tangle - 180;

        t1x = (node.rad * 0.95) * Math.cos((index * arcDegree - 79 + baseAngle) * Math.PI / 180);
        t1y = (node.rad * 0.95) * Math.sin((index * arcDegree - 79 + baseAngle) * Math.PI / 180);
 
    } else if (node.level === 5) {
        const deg = index * arcDegree - 81 + baseAngle;
        const radian = deg * Math.PI / 180;
        tx = (node.rad * 0.91) * Math.cos(radian);
        ty = (node.rad * 0.91) * Math.sin(radian);

        tangle = angle + arcDegree * 0.4;
        tangle = tangle % 360;
        if (tangle > 90 && tangle < 270) tangle = tangle - 180;

        t1x = (node.rad * 0.96) * Math.cos(radian);
        t1y = (node.rad * 0.96) * Math.sin(radian);
   }

    const longPressHandler = ({ node }: { node: ILNNode }) => {
        console.log('longpress is triggered', node);
        dispatch(updateSortIndex(node.level - 1));
    };

    const handleClick = () => {

        if (node.isLastBucket) {
            if ( showPeers ) {
                dispatch(hideHex(node));
                setTimeout(() => {
                    dispatch(removeHex(node));
                }, 500);
            } else {

                if (peerLength > MAX_HEX) {

                    const removedBucketId: string = [...selBuckets].shift()!;
                    const removedBucket: ILNNode = getNodeFromRootById(rootNode!, removedBucketId);
                    console.log('removedBucket: ', removedBucketId, removedBucket);

                    dispatch(hideHex(removedBucket));
                    setTimeout(() => {
                        dispatch(addAndShowHex(node));
                    }, 50);
                    setTimeout(() => {
                        dispatch(removeHex(removedBucket));
                    }, 500);

                } else {
                    dispatch(addAndShowHex(node));
                }
            }

            onClick({
                node: node,
                index: index
            });

            return;
        } else {
            onClick({
                node: node,
                index: index
            });
        }
    };

    let arcRad = 42;
    let arcDepth = 0.4;
    if (node.level === 3) {
        arcRad = arcDegree - 2;
        arcDepth = 0.25;
    } else if (node.level === 4) {
        arcRad = arcDegree - 2;
        arcDepth = 0.2;
    } else if (node.level === 5) {
        arcRad = arcDegree - 2;
        arcDepth = 0.16;
    }

    const getFillColor = () => {

        if (hover) {
            return 'url(#selGrad)';
        } else if (showPeers) {
            return node.color;
        } else if (!node.isLastBucket && selected) {
            return 'url(#selGrad)';
        } else if (node.isLastBucket && selected) {
            return node.color;
        } else {
            return CLUSTER_FILL[node.level - 2];
        }

    }

    const getStrokeColor = () => {
        if (showPeers) {
            return node.color;
        } else if (node.isLastBucket) {
            return '#ffffff' ;
        } else {
            return CLUSTER_STROKE[node.level - 2];
        }
    }

    const getTextColor = () => {
        if (showPeers && node.isLastBucket) {
            return '#444';
        } else {
            return '#eee';
        }
    }

    return (
        <>

            <g id={node.id}
                className='cursor-pointer'
                style={{ 'transition': 'transform 0.5s, opacity 1s' }}
                ref={groupRef}
                {...useLongPress({node: node, index: index}, longPressHandler, handleClick)}
                onMouseOver={ () => handleMouseOver() }
                onMouseOut={ () => handleMouseOut() }
            >

                <defs>
                    <linearGradient id="selGrad" x1="0%" y1="0%" x2="0%" y2="80%">
                        <stop offset="20%" stopColor='#1673FF' stopOpacity='100%' />
                        <stop offset="98%" stopColor='#6000FE' stopOpacity='100%' />
                    </linearGradient>
                </defs>

                <path d={ describeArc(0, 0, node.rad, 0, arcRad, arcDepth) }  
                    style={{ 'opacity': '1' }}
                    ref={circleRef}
                    stroke={ getStrokeColor() }
                    fill={ getFillColor() }
                    strokeWidth='1' />

            </g>

            <text 
                className='cursor-pointer animOpacityHalf'
                style={{ 'opacity': '0', 'transform': `translate(${t1x}px, ${t1y}px) rotate(${tangle}deg)` }}
                ref={alias1Ref}
                {...useLongPress({node: node, index: index}, longPressHandler, handleClick)}
                onMouseOver={ () => handleMouseOver() }
                onMouseOut={ () => handleMouseOut() }
                fill='white' fontSize='10px'
                dominantBaseline='middle'
                textAnchor='middle'>

                { sortParam === 'nodeCapacity' ? `${formatSats(node.minCapacity)} to ${formatSats(node.maxCapacity)}`
                : `${formatSats(node.minChannelCapacity)} to ${formatSats(node.maxChannelCapacity)}`
                }

            </text>

            <text 
                className='cursor-pointer animTransform1s'
                style={{ 'transform': `translate(${tx}px, ${ty}px) rotate(${tangle}deg)` }}
                ref={aliasRef}
                {...useLongPress({node: node, index: index}, longPressHandler, handleClick)}
                fill={ getTextColor() } fontSize='12px'
                dominantBaseline='middle'
                textAnchor='middle'>
                { sortParam === 'nodeCapacity' ? formatSats(node.maxCapacity): formatSats(node.maxChannelCapacity) }
            </text>

            <text 
                className='cursor-pointer animOpacityHalf'
                style={{ 'opacity': '0', 'transform': `translate(${tx}px, ${ty}px) rotate(${tangle}deg)` }}
                ref={text1Ref}
                {...useLongPress({node: node, index: index}, longPressHandler, handleClick)}
                onMouseOver={ () => handleMouseOver() }
                onMouseOut={ () => handleMouseOut() }
                fill='white'
                fontSize='10px'
                dominantBaseline='middle'
                textAnchor='middle'
            >
                ( { node.totalChildCount } )
            </text>

    </>

    );
}

export default ClusterSegment;
