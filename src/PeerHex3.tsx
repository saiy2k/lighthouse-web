import { 
    useEffect, 
    useRef, 
    useState                }   from    "react";

import useLongPress             from    './useLongPress';

import { RootState          }   from    './store';
import { useAppDispatch     }   from    './store/hooks';
import { useAppSelector     }   from    './store/hooks';

import { 
    addSlide,
    fetchNode               }   from    './store/slideSlice';
import { updateInfoPeer     }   from    './store/uiSlice';

import { ILNNode            }   from    './Interface';
import { 
    formatSats,
    truncateText            }   from    './Utils';

interface PeerHexParams {
    node                        :   ILNNode;
    index                       :   number;
    total                       :   number;
};


// TODO: Move to Constants;
/*
const width = 90;
const height = 56;
const delta = 15;
const gap = 6;
 */

const width = 110;
const height = 64;
const delta = 15;
const gap = 12;

/**
 *  ** Hex Points calculator **
 *  const width = 90;
 *  const height = 50;
 *  const delta = 15;
 *  const points = `${-width / 2} 0,
 *      ${delta - width / 2} ${-height / 2},
 *      ${width / 2 - delta} ${-height / 2},
 *      ${width / 2} 0,
 *      ${width / 2 - delta} ${height / 2},
 *      ${delta - width / 2} ${height / 2}`;
 *  console.log('points', points);
 *  // Copy this to <polygon points>
 */
function PeerHex3({ node, index, total }: PeerHexParams) {

    const dispatch              =   useAppDispatch();
    const currentSlideIndex: number   =   useAppSelector((state: RootState) => state.slide.currentIndex);
    const slideLength: number   =   useAppSelector((state: RootState) => state.slide.items.length);
    const groupRef              =   useRef<SVGGElement>(null);
    const aliasRef              =   useRef<SVGTextElement>(null);
    const nodeCapRef            =   useRef<SVGTextElement>(null);
    const chanCapRef            =   useRef<SVGTextElement>(null);
    //const [stroke, setStroke]   =   useState<string>(node.color || '#E6912D');
    const [stroke, setStroke]   =   useState<string>('rgba(255, 255, 255, 0.25)');
    const [textC, setTextC]     =   useState<string>(node.color || '#E6912D');
    const [aliasC, setAliasC]   =   useState<string>('#EEEEEE');
    const [fill, setFill]       =   useState<string>('#212349');

    let layer = Math.ceil((total + 2) / 6);
    let ind = 0;
    layer = Math.max(4, layer);

    if (index < 22) {
        layer = 4;
        ind = index;
    } else if (index < 22 + 28) {
        layer = 5;
        ind = index - 22;
    } else if (index < 22 + 28 + 34) {
        layer = 6;
        ind = index - (22 + 28);
    }

    const {x, y}: {x: number, y: number} = getHexPos(layer, ind);

    useEffect(() => {
        setTimeout(() => {
            if (node.show) {
                groupRef.current!.style.opacity         =   '1';
                groupRef.current!.style.transform       =   `translate(${x}px, ${y}px)`;
            } else {
                groupRef.current!.style.opacity         =   '0';
                groupRef.current!.style.transform       =   `translate(0px, 0px) scale(0.1)`;
            }
        });
    }, [node.show, index, total]);

    const handleMouseOver = () => {
        groupRef.current!.style.transform = `translate(${x}px, ${y}px) scale(1.0)`;
        //setStroke('#fff');
        setStroke(node.color || '#E6912D');
        //setTextC('#333333');
        //setAliasC('black');
        //setFill(node.color || '#E6912D');
    }

    const handleMouseOut = () => {
        groupRef.current!.style.transform = `translate(${x}px, ${y}px) scale(1.0)`;
        setStroke('rgba(255, 255, 255, 0.25)');
        //setTextC(node.color || '#E6912D');
        //setAliasC('#ffffff');
        //setFill('#212349');
    }

    const handleClick = () => {
        console.log('dispatch info peer: ', node.id);

        dispatch(addSlide({pubkey: node.public_key, status: 'loading', peers: [], selectedBuckets: []}));
        dispatch(fetchNode({pubkey: node.public_key, index: slideLength}));

    }

    const longPressHandler = ({ node }: { node: ILNNode }) => {
        console.log('longpress is triggered', node);
        dispatch(updateInfoPeer(node));
    };

    return (
        <>
            { /*
        <line x1={x} y1={y} x2="0" y2="0" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="2" />
        */ }
        <g style={{  'transform': `translate(0px, 0x) rotate(0deg) scale(0.1)`, 'opacity': 0, 'cursor': 'pointer' }} 
            className="animPeerHalf"
            ref={groupRef}
            onMouseOver={ () => handleMouseOver() }
            onMouseOut={ () => handleMouseOut() }
            {...useLongPress({node: node, index: index}, longPressHandler, handleClick)}
            >

            { renderHex(index, stroke, fill) }

            <text className='animTransform1s' fill={aliasC}
                ref={aliasRef}
                dominant-baseline='middle'
                textAnchor='middle'
                fontSize="12px"
                dy = {-4}
            > { truncateText(node.alias) } </text>

            <text fill={textC}
                ref={nodeCapRef}
                dominant-baseline='middle'
                textAnchor='middle'
                fontSize="10px"
                dx = {-14}
                dy = {14}
            > { formatSats(node.capacity) } </text>

            { node.channel ?
            <text fill={textC}
                ref={chanCapRef}
                dominant-baseline='middle'
                textAnchor='middle'
                fontSize="10px"
                dx = {14}
                dy = {14}
            > { formatSats(node.channel_capacity) } </text>: null }
        </g>
        </>
    );

}

function renderHex(index: number, stroke: string, fill: string) {

    let points;

    const w = width - gap;
    const h = height - gap;
    points = `${-w / 2} 0,
        ${delta - w / 2} ${-h / 2},
        ${w / 2 - delta} ${-h / 2},
        ${w / 2} 0,
        ${w / 2 - delta} ${h / 2},
        ${delta - w / 2} ${h / 2}`;

    return <polygon points={points} strokeWidth={1} stroke={stroke} fill={fill} />
}

function getHexPos(layer: number, index: number) {

    const minWidth              =   width - delta;
    const halfHeight            =   height * 0.5;
    const delX                  =   0;
    const delY                  =   -30;

    // Mid Top to Right pillar
    if (index < layer - 1) {
        let i = index;
        return {
            x: i * minWidth,
            y: -(height * layer - halfHeight) + i * halfHeight + delY
        }
    // Right pillar
    } else if (index >= layer - 1 && index < layer * 2) {
        let i = index - (layer - 1);
        return {
            x: (layer - 1) * minWidth,
            y: -(height * layer - halfHeight) + ((layer - 1) * halfHeight) + (i * height) + delY
        }
    // Right pillar to Mid Bottom
    } else if (index >= layer * 2 && index < (layer * 3)) {
        let i = index - (layer * 2);
        const diff = (layer * 3 - 1) - (layer * 2);
        i = Math.abs(diff - i);
        return {
            x: i * minWidth,
            y: (height * (layer + 1) - halfHeight) + -i * halfHeight + delY
        }
    // Mid Bottom to Left pillar
    } else if (index >= layer * 3 && index < (layer * 4) - 2) {
        let i = index - (layer * 3);
        const diff = ((layer * 4) - 2) - (layer * 3) - 1;
        i = Math.abs(diff - i);
        return {
            x: -((layer - 2) * minWidth) + i * minWidth,
            y: ((layer + 3) * halfHeight) + i * halfHeight + delY
        }
        /*
    } else if (index >= layer * 3 && index < (layer * 4) - 2) {
        let i = index - (layer * 3);
        return {
            x: -((layer - 2) * minWidth) + i * minWidth,
            y: ((layer + 3) * halfHeight) + i * halfHeight + delY
        }
            */
    // Left pillar
    } else if (index >= (layer * 4) - 2 && index < (layer * 5)) {
        let i = index - ((layer * 4) - 2);
        const diff = ((layer * 5) - 1) - ((layer * 4) - 2);
        i = Math.abs(diff - i);
        return {
            x: -(layer - 1) * minWidth,
            y: -(height * (layer) - halfHeight) + ((layer - 1) * halfHeight) + (i * height) + delY
        }
    // Left pillar to Mid Top
    } else if (index >= (layer * 5) && index < (layer * 6) - 2) {
        let i = index - (layer * 5);
        return {
            x: -((layer - 2) * minWidth) + i * minWidth,
            y: -((layer + 1) * halfHeight) + -i * halfHeight + delY
        }
    }

    return {
        x: 0,
        y: 0
    }

}

export default PeerHex3;
