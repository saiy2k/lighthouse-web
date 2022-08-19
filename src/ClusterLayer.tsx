import React from 'react';
import { 
    useEffect, 
    useState                }   from    'react';

import { RootState          }   from    './store';
import { 
    useAppSelector,
    useAppDispatch          }   from    './store/hooks';
import {
    updateL2,
    updateL3,
    updateL4,
    updateL5                }   from './store/uiSlice';

import { ILNNode            }   from    './Interface';
import ClusterSegment           from    './ClusterSegment';

function ClusterLayer({ root, show }: { root: ILNNode, show: boolean }) {

    // console.log('ClusterLayer load', root);

    const dispatch              =   useAppDispatch();
    const l2                    =   useAppSelector((state: RootState) => state.ui.l2);
    const l3                    =   useAppSelector((state: RootState) => state.ui.l3);
    const l4                    =   useAppSelector((state: RootState) => state.ui.l4);
    const l5                    =   useAppSelector((state: RootState) => state.ui.l5);
    const [l2Index, setL2Index] =   useState<number>(0);
    const [l3Index, setL3Index] =   useState<number>(0);
    const [l4Index, setL4Index] =   useState<number>(0);
    const [l5Index, setL5Index] =   useState<number>(0);

    let userAgent = navigator.userAgent;
    let browserName;
    let isSafari = false;

    if (userAgent.match(/chrome|chromium|crios/i)) {
        browserName = "chrome";
    } else if (userAgent.match(/firefox|fxios/i)) {
        browserName = "firefox";
    } else if (userAgent.match(/safari/i)) {
        browserName = "safari";
        isSafari = true;
    } else if (userAgent.match(/opr\//i)) {
        browserName = "opera";
    } else if (userAgent.match(/edg/i)) {
        browserName = "edge";
    } else {
        browserName = "No browser detection";
    }

    useEffect(() => {

        // console.log('ClusterLayer useEffect', show);

        setTimeout(() => {

            if (!show) {
                setTimeout(() => {
                    dispatch(updateL2(null));
                    dispatch(updateL3(null));
                    dispatch(updateL4(null));
                    dispatch(updateL5(null));
                }, 1000);
            }
        });
    }, [show]);

    if (!root.isBucket) {
        return <div> peers </div>;
    }

    const handleClick = ({ node, index }: { node: ILNNode, index: number }) => {

        if ( !node.isBucket ) return;

        const level = node.level;
        // console.log('selected: ', node, node.level);

        if (level === 2) {
            setL2Index(index);
            dispatch(updateL2(node));

            setL3Index(-1);
            setL4Index(-1);
            setL5Index(-1);

            if (l3) {
                setTimeout(() => {
                    dispatch(updateL3(null));
                }, 1000);
            }

            if (l4) {
                setTimeout(() => {
                    dispatch(updateL4(null));
                }, 1000);
            }


        } else if (level === 3) {
            setL3Index(index);
            dispatch(updateL3(node));

            setL4Index(-1);
            setL5Index(-1);

            if (l4) {
                setTimeout(() => {
                    dispatch(updateL4(null));
                }, 1000);
            }


        } else if (level === 4) {
            setL4Index(index);
            dispatch(updateL4(node));
        }
    }


    /**
     * TODO: 
     * BAD PRACTISE
     * Not deliberately adding 'key' to the ClusterSegment
     * so as to get the text floating animation.
     * But this is breaking text animation in safari, so adding key only for Safari
     * Have to find a proper workaround for this.
     */
    return (
        <g>
            <ErrorBoundary>

        <g> {
            root.children.map((n1: ILNNode, i1: number) => 
            <ClusterSegment 
                key={ isSafari ? n1.id : null }
                node={n1} 
                index={i1} 
                arcDegree={45}
                baseAngle={0}
                angle={i1 * 45} 
                selected={l2?.id === n1.id}
                show={true}
                onClick={ (e: any) => handleClick(e) } />
            )
        } </g>

        { l2 && !l2.isLastBucket ? <g> {

            l2.children.map((n2: ILNNode, i2: number) =>
            <ClusterSegment 
                key={ isSafari ? n2.id : null }
                node={n2} 
                index={i2} 
                arcDegree={30}
                baseAngle={l2Index * 45}
                angle={l2Index * 45 + i2 * 30} 
                selected={l3?.id === n2.id}
                show={true}
                onClick={ (e: any) => handleClick(e) } />
            )

        } </g>: null } 

        { l3 && !l3.isLastBucket ? <g> {

            l3.children.map((n3: ILNNode, i3: number) => 
            <ClusterSegment 
                key={ isSafari ? n3.id : null }
                node={n3} 
                index={i3} 
                arcDegree={24}
                baseAngle={l2Index * 45 + l3Index * 30}
                angle={l2Index * 45 + l3Index * 30 + i3 * 24} 
                selected={l4?.id === n3.id}
                show={l3Index !== -1}
                onClick={ (e: any) => handleClick(e) } />
            )

        } </g>: null } 

        { l4 && !l4.isLastBucket ? <g> {

            l4.children.map((n4: ILNNode, i4: number) => 
            <ClusterSegment 
                key={ isSafari ? n4.id : null }
                node={n4} 
                index={i4} 
                arcDegree={20}
                baseAngle={l4Index === -1 ? 0 : l2Index * 45 + l3Index * 30 + l4Index * 24}
                angle={l4Index === -1 ? 0 : l2Index * 45 + l3Index * 30 + l4Index * 24 + i4 * 20} 
                selected={l4?.id === n4.id}
                show={l4Index !== -1}
                onClick={ (e: any) => handleClick(e) } />
            )

        } </g>: null } 

        </ErrorBoundary>

        </g>
    );
};

export default ClusterLayer;

class ErrorBoundary extends React.Component {
    constructor(props: any) {
        super(props);
    }

    static getDerivedStateFromError(_error: any) {
        return { hasError: true };
    }

    componentDidCatch(_error: any, _errorInfo: any) {
        // You can also log the error to an error reporting service
        // logErrorToMyService(error, errorInfo);
    }

    render() {
        return (this.props as any).children; 
    }
}
