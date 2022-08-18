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
