import { 
    useEffect, 
    useRef, 
    useMemo, 
    useState,                
    ChangeEvent,             
    MouseEventHandler       }   from    'react';
import styled                   from    'styled-components';

import { RootState          }   from    './store';
import { 
    useAppSelector, 
    useAppDispatch          }   from    './store/hooks';
import {
    ISlide,
    addSlide,
    fetchNode               }   from    './store/slideSlice';

import { toggleMute         }   from    './store/uiSlice';

import AboutBox                 from    './AboutBox';
import StormCanvas              from    './StormCanvas';
import GraphController          from    './GraphController';

const Button = styled.button<{plain?: boolean}>`
    background: linear-gradient(170.08deg, #1673FF 8.21%, #6000FE 92.51%);
    border: none;
    color: white;
    font-size: 0.8rem;

    &:hover {
        background: linear-gradient(170.08deg, #6000FE 8.21%, #1673FF 92.51%);
        font-weight: bold;
    }

    ${props => props.plain && `
        background: none;
        border: 1px solid;
    `};

    ${props => props.disabled && `
        background: linear-gradient(170.08deg, #aaa 8.21%, #666 92.51%);
    `};
`;

function App() {

    console.log('App load');
    const dispatch              =   useAppDispatch();
    const slideLength: number   =   useAppSelector((state: RootState) => state.slide.items.length);
    const currentStatus: string =   useAppSelector((state: RootState) => state.slide.items[state.slide.currentIndex].status);
    const currentIndex: number  =   useAppSelector((state: RootState) => state.slide.currentIndex);
    const isMute: boolean       =   useAppSelector((state: RootState) => state.ui.isMute);
    const [pubkey, setPubkey]   =   useState<string>('');
    const [about, setAbout]     =   useState<boolean>(false);

    const handlePubkeyChange = (e: any) => {
        setPubkey(e.target.value);
    }

    const addNewPeer = () => {

        if (currentStatus === 'loading' || pubkey.length < 50) {
            return;
        }

        const newSlide: ISlide = {
            index: slideLength,
            pubkey: pubkey,
            root: null,
            status: 'loading',
            peers: [],
            selectedBuckets: []
        };
        dispatch(addSlide(newSlide));
        dispatch(fetchNode({
            pubkey: newSlide.pubkey,
            index: slideLength
        }));

        setPubkey("");

    }

    const showAboutBox = () => {
        setAbout(true);
    };

    const onAboutClose = () => {
        setAbout(false);
    }

    return (
        <>

            <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-transparent">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#" style={{ 'fontSize': '1.0rem' }} > Lighthouse - LN Explorer </a>
                    { /*
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                       */ }
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        <ul className="mb-2 navbar-nav me-auto mb-md-0">
                        </ul>
                            <input 
                                className="form-control me-2" 
                                type="search" 
                                placeholder="Enter node public key" 
                                aria-label="Search" 
                                value={pubkey}
                                onChange={ (e: ChangeEvent) => handlePubkeyChange(e) } 
                                style={{ 'height': '28px', 'fontSize': '0.8rem', 'width': '240px' }}/>
                            <Button className="btn btn-sm" 
                                disabled={ currentStatus === 'loading' }
                                onClick={ (e: any) => addNewPeer() }
                                type="button">
                                Search
                            </Button>
                        <ul className="mb-2 ms-2 navbar-nav mb-md-0">
                            <li className="nav-item">
                                <Button plain 
                                    className="btn btn-sm w-90" 
                                    onClick={ (e: any) => showAboutBox() }
                                    type="submit"> 
                                    Info 
                                </Button>
                            </li>
                            <li className="nav-item ms-2">
                                <Button plain 
                                    className="btn btn-sm w-90" 
                                    onClick={ (_e: any) => dispatch(toggleMute())}
                                    type="submit"> 

                                    { isMute ?
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-volume-off" viewBox="0 0 16 16">
                                        <path d="M10.717 3.55A.5.5 0 0 1 11 4v8a.5.5 0 0 1-.812.39L7.825 10.5H5.5A.5.5 0 0 1 5 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zM10 5.04 8.312 6.39A.5.5 0 0 1 8 6.5H6v3h2a.5.5 0 0 1 .312.11L10 10.96V5.04z"/>
                                    </svg>
                                    : 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-volume-up" viewBox="0 0 16 16">
                                        <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
                                        <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/>
                                        <path d="M10.025 8a4.486 4.486 0 0 1-1.318 3.182L8 10.475A3.489 3.489 0 0 0 9.025 8c0-.966-.392-1.841-1.025-2.475l.707-.707A4.486 4.486 0 0 1 10.025 8zM7 4a.5.5 0 0 0-.812-.39L3.825 5.5H1.5A.5.5 0 0 0 1 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 7 12V4zM4.312 6.39 6 5.04v5.92L4.312 9.61A.5.5 0 0 0 4 9.5H2v-3h2a.5.5 0 0 0 .312-.11z"/>
                                    </svg>
                                    }
                                </Button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <main style={{ "flexGrow": 1 }}>

                <StormCanvas />
                <GraphController />

            </main>

            { about ?
            <AboutBox onAboutClose={() => onAboutClose()} />: null }

        </>
    );

}

export default App;
