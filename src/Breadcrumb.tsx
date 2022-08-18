import React from 'react';

import { RootState } from './store';
import { useAppSelector, useAppDispatch } from './store/hooks';

import {
    ISlide,
} from './store/slideSlice';


function Breadcrumb() {

    const slides: ISlide[] = useAppSelector((state: RootState) => state.slide.items);

    const reset = (index: number) => {
    }

    return (
        <>

            { slides.map((slide: ISlide) => <React.Fragment key={ slide.root?.alias }>
                <u> { slide.root?.alias || '' } </u> &nbsp;
            </React.Fragment>) }

            { slides.length > 0 ?
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={(e: any) => reset(0)}> x </button>: null }

            &nbsp;

        </>

    );

}

export default Breadcrumb;
