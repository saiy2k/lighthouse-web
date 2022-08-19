import { 
    useEffect, 
    useRef, 
    useMemo, 
    useState                }   from    'react';
import styled                   from    'styled-components';

import { RootState          }   from    './store';
import { 
    useAppSelector, 
    useAppDispatch          }   from    './store/hooks';
import {
    updateL2,
    updateL3,
    updateL4                }   from    './store/uiSlice';
import {
    ISlide,
    prevSlide,
    nextSlide,
    fetchNetwork            }   from    './store/slideSlice';

import { ILNNode, ILNChannel}   from    './Interface';
import LNCanvas                 from    './LNCanvas';
import InfoBox                  from    './InfoBox';
import MobileWarning            from    './MobileWarning';
import { MOBILE_WIDTH       }   from    './Constants';
//import FilterModal              from    './FilterModal';

import loaderImg    from './assets/thunder-bolt.gif';

export const size = {
    width: 0,
    height: 0
};

const Loader = styled.div`
    position: fixed;
`;
const Button = styled.button<{plain?: boolean, mtopmargin?: boolean}>`
    background: linear-gradient(170.08deg, #1673FF 8.21%, #6000FE 92.51%);
    border: none;
    color: white;
    padding-left: 24px;
    padding-right: 24px;
    font-size: 0.8rem;

    @media (max-width: 576px) {
        width: 100%;
    }


    &:hover {
        background: linear-gradient(170.08deg, #6000FE 8.21%, #1673FF 92.51%);
        font-weight: bold;
    }

    ${props => props.mtopmargin && `
        @media (max-width: 576px) {
            margin-top: 8px;
        }
    `};


    ${props => props.plain && `
        background: none;
    `};

    ${props => props.disabled && `
        background: linear-gradient(170.08deg, #aaa 8.21%, #666 92.51%);
    `};
`;

/**
 * SVG panning Ref: https://css-tricks.com/creating-a-panning-effect-for-svg/
 */

function GraphController() {
    // console.log('GraphController load');

    const [showFilter, setShowFilter]   = useState<boolean>(false);

    const svgRef                =   useRef<SVGSVGElement>(null);
    const [svgSize, setSvgSize] =   useState<any>({width: 1024, height: 0});
    const [svgH, setSvgH]       =   useState<number>(100);
    const dispatch              =   useAppDispatch();
    const currentIndex: number  =   useAppSelector((state: RootState) => state.slide.currentIndex);
    const slides: ISlide[]      =   useAppSelector((state: RootState) => state.slide.items);
    const currentSlideStatus: string  =   useAppSelector((state: RootState) => state.slide.items[currentIndex].status);
    const sortShow: boolean     =   useAppSelector((state: RootState) => state.slide.sortShow);
    const sortIndex: number     =   useAppSelector((state: RootState) => state.slide.sortIndex);
    const infoPeer: ILNNode | null     =   useAppSelector((state: RootState) => state.ui.infoPeer);

    const [isPointerDown, setIsPointerDown] = useState<boolean>(false);
    const [pointerOrigin, setPointerOrigin] = useState<{x: number, y: number}>({ x: 0, y: 0 });
    const [vb, setVb] = useState<any>({ x: 0, y: 0 , width: 800, height: 600 });
    const [newVb, setNewVb] = useState<any>({ x: 0, y: 0 , width: 800, height: 600 });
    const [vbString, setVbString] = useState<string>('0 0 800 600');

    useEffect(() => {

        size.width= (svgRef?.current as any).clientWidth;

        if (size.width > MOBILE_WIDTH) {
            size.height= (svgRef?.current as any).clientHeight;
        } else {
            setSvgH(100);
            size.height= (svgRef?.current as any).clientHeight;
        }
        setSvgSize(size);
        // console.log('svgSize: ', size);
        setVb({x: 0, y: 0, width: size.width, height: size.height});
        setVbString(`0 0 ${size.width} ${size.height}`);



    }, []);

    useMemo(() => {
        // console.log('GraphController :: dispatch fetchNode');
        dispatch(fetchNetwork());
    }, []);

    const modalCloseHandler = () => {
        setShowFilter(false);
    }

    const onPointerUp = (_e: any) => {

        setIsPointerDown(false);
        setVb({
            x: newVb.x,
            y: newVb.y,
            width: vb.width,
            height: vb.height
        });
        svgRef.current!.style.cursor = 'default';
    }

    const onPointerDown = (e: any) => {
        setIsPointerDown(true);
        setPointerOrigin(getPointFromEvent(e));

        svgRef.current!.style.cursor = 'move';
    }

    const onPointerMove = (e: any) => {
        if (!isPointerDown) {
            return;
        }
        e.preventDefault();

        var pointerPosition = getPointFromEvent(e);
        const newX = vb.x - (pointerPosition.x - pointerOrigin.x);
        const newY = vb.y - (pointerPosition.y - pointerOrigin.y);

        setNewVb({
            x: newX,
            y: newY,
            width: vb.width,
            height: vb.height
        });
        setVbString(`${newX} ${newY} ${vb.width} ${vb.height}`);
    }

    const prevButton = () => {
        dispatch(prevSlide());
        dispatch(updateL2(null));
        dispatch(updateL3(null));
        dispatch(updateL4(null));
    }

    const nextButton = () => {
        dispatch(nextSlide());
        dispatch(updateL2(null));
        dispatch(updateL3(null));
        dispatch(updateL4(null));
    }

    return (

    <>

        { size.width > MOBILE_WIDTH ?
        <svg 
            viewBox={vbString}
            ref={svgRef} 
            id='renderBox'
            style={{ 'width': '100%', 'height': `${svgH}%`, 'transition': 'transform 1s, viewBox 1s', 'position': 'absolute', 'left': '0px', 'overflow': 'hidden', 'background': 'radial-gradient(circle at 30% 40%, rgb(7,35,45) 12%, rgb(8,9,29) 75%)' }}
            onPointerDown={(e: any) => onPointerDown(e) }
            onPointerUp={(e: any) => onPointerUp(e) }
            onPointerLeave={(e: any) => onPointerUp(e) }
            onPointerMove={(e: any) => onPointerMove(e) }
            onMouseDown={(e: any) => onPointerDown(e) }
            onMouseUp={(e: any) => onPointerUp(e) }
            onMouseLeave={(e: any) => onPointerUp(e) }
            onMouseMove={(e: any) => onPointerMove(e) }
            onTouchStart={(e: any) => onPointerDown(e) }
            onTouchEnd={(e: any) => onPointerUp(e) }
            onTouchMove={(e: any) => onPointerMove(e) }
        >

            { currentSlideStatus === 'loaded'?
            <LNCanvas />: null }

        </svg>: null }

        { size.width <= MOBILE_WIDTH ?
        <>
            <svg 
                viewBox={vbString}
                ref={svgRef} 
                id='renderBox'
                style={{ 'width': '100%', 'height': `${svgH}%`, 'transition': 'transform 1s, viewBox 1s', 'position': 'absolute', 'left': '0px', 'overflow': 'hidden' }}
                onPointerDown={(e: any) => onPointerDown(e) }
                onPointerUp={(e: any) => onPointerUp(e) }
                onPointerLeave={(e: any) => onPointerUp(e) }
                onPointerMove={(e: any) => onPointerMove(e) }
                onMouseDown={(e: any) => onPointerDown(e) }
                onMouseUp={(e: any) => onPointerUp(e) }
                onMouseLeave={(e: any) => onPointerUp(e) }
                onMouseMove={(e: any) => onPointerMove(e) }
                onTouchStart={(e: any) => onPointerDown(e) }
                onTouchEnd={(e: any) => onPointerUp(e) }
                onTouchMove={(e: any) => onPointerMove(e) }
            >

            { currentSlideStatus === 'loaded'?
            <LNCanvas />: null }

            </svg>

            { svgSize.width <= MOBILE_WIDTH ? <MobileWarning />: null }
        </>: null }

        { /*
        <FilterModal show={ sortShow } index={ sortIndex } onClose={ modalCloseHandler } />
           */ }

        { infoPeer ?
        <InfoBox 
            node={infoPeer} 
            channel={infoPeer.channel as ILNChannel} 
        />: null }

        <div className='container' style={{ 'position': 'absolute', 'bottom': '64px', 'width': '90%' }} >

            <div className='row'>
                <div className="col-12 col-sm-6 text-start">
                    <Button className="btn" 
                        onClick={() => prevButton() }
                        disabled={ currentIndex === 0 }
                        type="submit"> 
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="bi bi-chevron-left" viewBox="0 0 16 16">
                            <path fill="white" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                        </svg>
                        { currentIndex === 0 ? 'Prev' : `${slides[currentIndex - 1].root?.alias }` }
                    </Button>
                </div>
                <div className="col-12 col-sm-6 text-end">
                    <Button className="btn me-4" 
                        mtopmargin
                        style={{ 'right': '0px' }}
                        onClick={() => nextButton() }
                        disabled={ currentIndex === slides.length - 1 }
                        type="submit"> 
                        { currentIndex === slides.length - 1 ? 'Next' : `${slides[currentIndex + 1].root?.alias } ` }
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="bi bi-chevron-right" viewBox="0 0 16 16">
                            <path fill="white" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                    </Button>

                </div>
            </div>

        </div>

        { currentSlideStatus === 'loading' ? <Loader style={{ 'left': size.width * 0.5 - 100, 'top': size.height * 0.5 - 100 }}> 
            <img src={ loaderImg } />
        </Loader>: null }

   </>

    );
}

export default GraphController;

export function getPointFromEvent(event: any) {
    var point = {x:0, y:0};
    if (event.targetTouches) {
        point.x = event.targetTouches[0].clientX;
        point.y = event.targetTouches[0].clientY;
    } else {
        point.x = event.clientX;
        point.y = event.clientY;
    }

    return point;
}

