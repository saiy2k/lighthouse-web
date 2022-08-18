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
import { formatSats         }   from    './Utils';

import { size               }   from    './GraphController';

interface PeerHexParams {
    node                        :   ILNNode;
    index                       :   number;
};

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
function PeerHex2({ node, index }: PeerHexParams) {

    const dispatch              =   useAppDispatch();
    const currentSlideIndex: number   =   useAppSelector((state: RootState) => state.slide.currentIndex);
    const slideLength: number   =   useAppSelector((state: RootState) => state.slide.items.length);
    const groupRef              =   useRef<SVGGElement>(null);
    const aliasRef              =   useRef<SVGTextElement>(null);
    const nodeCapRef            =   useRef<SVGTextElement>(null);
    const chanCapRef            =   useRef<SVGTextElement>(null);
    const [stroke, setStroke]   =   useState<string>(node.color || '#E6912D');
    const [textC, setTextC]     =   useState<string>(node.color || '#E6912D');
    const [aliasC, setAliasC]   =   useState<string>('#EEEEEE');
    const [fill, setFill]       =   useState<string>('#212349');

    let hexAngle = 0, hexRadius = 180, hexX = 0, hexY = 0, hexRot = 0;

    const diff = [
        0 + 0,      // 0
        15 - 1,     // 1
        30 - 2,     // 2
        45 - 2,     // 3
        60 + 0,     // 4
        75 + 4,     // 5
        90 + 11,    // 6
        120 - 0,    // 7
        135 + 2,    // 8
        150 + 2 ,   // 9
        165 + 1,    // 10
        180 + 0,    // 11
        195 - 1,    // 12
        210 - 2,    // 13
        225 - 2,    // 14
        240 + 0,    // 15
        255 + 4,    // 16
        270 + 11,   // 17
        300 + 0,    // 18
        315 + 2,    // 19
        330 + 2,    // 20
        345 + 1,    // 21

        0,      // 0-22
        10,     // 1-23
        20,     // 2-24
        30,     // 3-25
        40,     // 4-26
        50,     // 5-27
        60 + 1, // 6-28
        70 + 4, // 7-29
        90,     // 8-30
        110 - 4,// 9-31
        120 - 1,// 10-32
        130,    // 11-33
        140,    // 12-34
        150,    // 13-35
        160,    // 14-36
        170,    // 15-37
        180,    // 16-38
        190,    // 17-39
        200,    // 18-40
        210,    // 19-41
        220,    // 20-42
        230,    // 21-43
        240 + 1,// 22-44
        250 + 4,// 23-45
        270,    // 24-46
        290 - 4,// 25-47
        300 - 1,// 26-48
        310,    // 27-49
        320,    // 28-50
        330,    // 29-51
        340,    // 30-52
        350,    // 31-53
    ];

    if (currentSlideIndex === 0) {
        if (index < 22) {
            hexAngle                =   diff[index];
            hexRadius               =   260;
        } else if (index < 54) {
            //hexAngle                =   ((index - 24) * 10) % 360;
            hexAngle                =   diff[index];
            hexRadius               =   350;
        } else if (index < 111) {
            hexAngle                =   ((index - 54) * 7.05) % 360;
            hexRadius               =   435;
        } else if (index < 176) {
            hexAngle                =   ((index - 111) * 5.53) % 360;
            hexRadius               =   515;
        } else if (index < 248) {
            hexAngle                =   ((index - 176) * 5) % 360;
            hexRadius               =   605;
        }
    } else {
        if (index < 22) {
            hexAngle = diff[index];
            hexRadius               =   225;
        } else if (index < 54) {
            //hexAngle                =   ((index - 24) * 10) % 360;
            hexAngle = diff[index];
            hexRadius               =   315;
        } else if (index < 111) {
            hexAngle                =   ((index - 54) * 7.05) % 360;
            hexRadius               =   400;
        } else if (index < 176) {
            hexAngle                =   ((index - 111) * 5.53) % 360;
            hexRadius               =   480;
        } else if (index < 248) {
            hexAngle                =   ((index - 176) * 5) % 360;
            hexRadius               =   570;
        }

    }

    if (hexAngle <= 90) {
        hexRot                  = hexAngle * 0.25;
    } else if (hexAngle >= 270) {
        hexRot                  = -(360 - hexAngle) * 0.25;
    } else if (hexAngle > 90) {
        hexRot                  = -(180 - hexAngle) * 0.25;
    }

    if ( index === 30 || index === 46) {
        hexRot                  =   0;
    } 

    hexX = hexRadius * Math.cos(hexAngle * Math.PI /  180);
    hexY = hexRadius * Math.sin(hexAngle * Math.PI /  180);

    // { 90, 50 }, 15
    //hexX = (index % 4) * (90 - 15) - 120;
    //hexY = 240 + (index / 4) * (50 + 30);
    //hexRot = 0;

    const baseX = -size.width * 0.5 + 45;
    const width = size.width * 0.25;
    const height = width * 0.5;
    hexX = baseX + (index % 4) * width;
    hexY = 240 + Math.floor(index / 4) * height;
    hexRot = 0;

    useEffect(() => {
        setTimeout(() => {
            if (node.show) {
                groupRef.current!.style.opacity         =   '1';
                groupRef.current!.style.transform       =   `translate(${hexX}px, ${hexY}px) rotate(${hexRot}deg)`;
            } else {
                groupRef.current!.style.opacity         =   '0';
                groupRef.current!.style.transform       =   `translate(0px, 0px) rotate(0deg) scale(0.1)`;
            }
        });
    }, [node.show, index]);

    const handleMouseOver = () => {
        groupRef.current!.style.transform = `translate(${hexX}px, ${hexY}px) rotate(${hexRot}deg) scale(1.1)`;
        setStroke('#fff');
        setTextC('#333333');
        setAliasC('black');
        setFill(node.color || '#E6912D');
    }

    const handleMouseOut = () => {
        groupRef.current!.style.transform = `translate(${hexX}px, ${hexY}px) rotate(${hexRot}deg) scale(1.0)`;
        setStroke(node.color || '#E6912D');
        setTextC(node.color || '#E6912D');
        setAliasC('#ffffff');
        setFill('#212349');
    }

    const handleClick = () => {
        console.log('dispatch info peer: ', node.id);

        dispatch(addSlide({pubkey: node.public_key, status: 'loading', peers: [], selectedBuckets: []}));
        dispatch(fetchNode({pubkey: node.public_key, index: slideLength}));

        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 250);
    }

    const longPressHandler = ({ node }: { node: ILNNode }) => {
        console.log('longpress is triggered', node);
        dispatch(updateInfoPeer(node));
    };

    return (
        <g style={{  'transform': `translate(0px, 0x) rotate(0deg) scale(0.1)`, 'opacity': 0, 'cursor': 'pointer' }} 
            className="animPeerHalf"
            ref={groupRef}
            onMouseOver={ () => handleMouseOver() }
            onMouseOut={ () => handleMouseOut() }
            {...useLongPress({node: node, index: index}, longPressHandler, handleClick)}
            >

            { /*
            <polygon points="-45 0, -30 -25, 30 -25, 45 0, 30 25, -30 25" strokeWidth={2} stroke={stroke} fill={fill} />
               */}
            <rect width={width} height={height} strokeWidth={2} stroke={stroke} fill={fill} style={{ 'transform': `translate(-${width * 0.5}px, -${height * 0.5}px)` }} />

            <text className='animTransform1s' fill={aliasC}
                ref={aliasRef}
                dominant-baseline='middle'
                textAnchor='middle'
                fontSize="12px"
                dy = {-4}
            > { node.alias.substring(0, 10) } </text>

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
    );

}

export default PeerHex2;
