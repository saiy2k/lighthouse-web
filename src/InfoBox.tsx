import { 
    useMemo, 
    useRef, 
    useState                }   from    'react';
import styled                   from    'styled-components';
import * as bootstrap           from    'bootstrap';

import { useAppDispatch     }   from    './store/hooks';
import { updateInfoPeer     }   from    './store/uiSlice';

import { ILNNode, ILNChannel}   from    './Interface';
import { 
    formatDate,
    formatSats              }   from    './Utils';

const Tab = styled.span<{selected?: boolean}>`
    color: #979797;
    font-size: 14px;
    padding-bottom: 6px;
    cursor: pointer;

    ${props => props.selected && `
      color: white;
      border-bottom: 2px solid #00EFFE;
    `};
`;

const GreenSpan     =   styled.span`color: #70EDA2; overflow-wrap: break-word`;
const YellowDiv     =   styled.div`color: #F9D423; overflow-wrap: break-word`;

function InfoBox({ node, channel }: { node: ILNNode, channel: ILNChannel }) {

    const dispatch  =   useAppDispatch();
    const modalRef  =   useRef(null);
    const [tabIndex, setTabIndex]=  useState<number>(0);

    useMemo(() => {

        setTimeout(() => {
            if (!modalRef.current) return;

            const modalEle      =   modalRef.current;
            const bsModal       =   new bootstrap.Modal(modalEle!, {
                keyboard: false,
                backdrop: 'static'
            })
            bsModal.show();
        });

    }, []);

    const tabChange = (newIndex: number) => {
        setTabIndex(newIndex);
    }

    const handleClose = () => {
        const modalEle          =   modalRef.current;
        const bsModal           =   new bootstrap.Modal(modalEle!, {
            keyboard: false
        })
        bsModal.hide();

        setTimeout(() => {
            dispatch(updateInfoPeer(null));
        });
    }

    return <div className="modal" ref={modalRef} tabIndex={-1} >
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content" style={{ 'background': 'rgba(33, 35, 73, 0.9)', 'border': '1px solid #56598D', 'borderRadius': '25px' }}>
                    <div className="modal-header" style={{ 'borderBottom': '1px solid #56598D', 'paddingBottom': '0px' }}>

                        <Tab selected={ tabIndex === 0 } onClick={ (_e: any) => tabChange(0) }>
                            Node Info
                        </Tab>

                        { channel ? 
                        <Tab selected={ tabIndex === 1 } className='ms-3' onClick={ (_e: any) => tabChange(1) }>
                            Channel Info
                        </Tab>: null }

                        <button type="button" className="mb-2 btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={ (_e: any) => handleClose() }>
                        </button>
                    </div>

                    { tabIndex === 0 ?
                    <div className="text-start modal-body">

                        <div className="mb-2 row">
                            <div className="col-12">
                                <div className="row">
                                    <div className='col-4 col-md-3 col-lg-2'>
                                        Pubkey:
                                    </div>
                                    <a href={`https://amboss.space/node/${node.public_key}`} target='_blank' style={{'textDecoration': 'none'}} className='col-8 col-md-9 col-lg-8'>
                                        <YellowDiv>
                                            { node.public_key }
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-link-45deg" viewBox="0 0 16 16">
                                              <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
                                              <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
                                            </svg>

                                        </YellowDiv>
                                    </a>
                                </div>

                            </div>
                        </div>

                        { renderGreenFullRow([
                            'Alias',
                            node.alias,
                        ]) }

                        { renderGreenFullRow([
                            'Capacity',
                            `${ formatSats(node.capacity) } sats`,
                        ]) }


                        { renderGreenFullRow([
                            'Channel count',
                            node.channel_count ? node.channel_count.toString() : 'N/A',
                        ]) }


                        { renderGreenFullRow([
                            'Socket',
                            node.sockets?.join()!
                        ]) }

                        { renderGreenFullRow([
                            'Updated at:',
                            node.updated_at ? formatDate(new Date(node.updated_at || 0)): 'N/A',
                        ]) }

                        { renderGreenFullRow(['','']) }
                        { renderGreenFullRow(['','']) }



                        <div className="mb-2 row">
                            <div className="col-12 col-md-6">
                                <div className="row">
                                    <div className='col-4'>
                                        &nbsp;
                                    </div>
                                    <GreenSpan className='col-8'>
                                    </GreenSpan>
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="row">
                                    <div className='col-4'>
                                    </div>
                                    <GreenSpan className='col-8'>
                                    </GreenSpan>
                                </div>
                            </div>
                        </div>


                        <div className="mb-2 row">
                            <div className="col-12 col-md-6">
                                <div className="row">
                                    <div className='col-4'>
                                        &nbsp;
                                    </div>
                                    <GreenSpan className='col-8'>
                                    </GreenSpan>
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="row">
                                    <div className='col-4'>
                                    </div>
                                    <GreenSpan className='col-8'>
                                    </GreenSpan>
                                </div>
                            </div>
                        </div>


                    </div>: null }


                    { tabIndex === 1 && channel?
                    <div className="text-start modal-body">

                        <div className="mb-2 row">
                            <div className="col-12">
                                <div className="row">
                                    <div className='col-4 col-md-2'>
                                        Channel Point:
                                    </div>
                                    <a href={`https://mempool.space/tx/${channel.channel_point}`} target='_blank' style={{'textDecoration': 'none'}} className='col-8 col-md-10'>
                                        <YellowDiv className='col-8 col-md-10'>
                                            { channel.channel_point }

                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-link-45deg" viewBox="0 0 16 16">
                                              <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
                                              <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
                                            </svg>
                                        </YellowDiv>
                                    </a>
                                </div>

                            </div>
                        </div>

                        <div className="mb-2 row">
                            <div className="col-12 col-md-6">
                                <div className="row">
                                    <div className='col-4'>
                                        Channel ID:
                                    </div>
                                    <a href={`https://amboss.space/edge/${channel.channel_id}`} target='_blank' style={{'textDecoration': 'none'}} className='col-8'>
                                        <YellowDiv>
                                            { channel.channel_id }

                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-link-45deg" viewBox="0 0 16 16">
                                              <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
                                              <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
                                            </svg>

                                        </YellowDiv>
                                    </a>
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="row">
                                    <div className='col-4'>
                                        Capacity:
                                    </div>
                                    <GreenSpan className='col-8'>
                                        { formatSats(channel.capacity) } sats
                                    </GreenSpan>
                                </div>
                            </div>
                        </div>

                        <div className="mb-2 row">
                            <div className="col-12">
                                <div className="row">
                                    <div className='col-4 col-md-2'>
                                        N1 Pubkey:
                                    </div>
                                    <a href={`https://amboss.space/node/${channel.n0_public_key}`} target='_blank' className='col-8 col-md-10' style={{'textDecoration': 'none'}}>
                                        <YellowDiv>
                                            { channel.n0_public_key }
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-link-45deg" viewBox="0 0 16 16">
                                              <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
                                              <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
                                            </svg>
                                        </YellowDiv>
                                    </a>
                                </div>

                            </div>
                        </div>

                        <div className="mb-2 row">
                            <div className="col-12">
                                <div className="row">
                                    <div className='col-4 col-md-2'>
                                        N2 Pubkey:
                                    </div>
                                    <a href={`https://amboss.space/node/${channel.n1_public_key}`} target='_blank' className='col-8 col-md-10' style={{'textDecoration': 'none'}}>
                                        <YellowDiv>
                                            { channel.n1_public_key }
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-link-45deg" viewBox="0 0 16 16">
                                              <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
                                              <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
                                            </svg>
                                        </YellowDiv>
                                    </a>
                                </div>

                            </div>
                        </div>

                        { renderGreenRow([
                            'N1 CLTV Delta:',
                            channel.n0_cltv_delta ? channel.n0_cltv_delta.toString() : 'N/A',
                            'N2 CLTV Delta:',
                            channel.n1_cltv_delta ? channel.n1_cltv_delta.toString() : 'N/A',
                        ]) }

                        { renderGreenRow([
                            'N1 Base Fee:',
                            `${ channel.n0_base_fee_mtokens } msats`,
                            'N2 Base Fee:',
                            `${ channel.n1_base_fee_mtokens } msats`,
                        ]) }

                        { renderGreenRow([
                            'N1 Fee Rate:',
                            `${ channel.n0_fee_rate } ppm`,
                            'N2 Fee Rate:',
                            `${ channel.n1_fee_rate } ppm`,
                        ]) }

                        { renderGreenRow([
                            'N1 Min HTLC:',
                            `${ formatSats(channel.n0_min_htlc_mtokens / 1000) } sats`,
                            'N2 Min HTLC:',
                            `${ formatSats(channel.n1_min_htlc_mtokens / 1000) } sats`,
                        ]) }

                        { renderGreenRow([
                            'N1 Max HTLC:',
                            `${ formatSats(channel.n0_max_htlc_mtokens / 1000) } sats`,
                            'N2 Max HTLC:',
                            `${ formatSats(channel.n1_max_htlc_mtokens / 1000) } sats`,
                        ]) }

                        { renderGreenRow([
                            'N1 updated at:',
                            formatDate(new Date(channel.n0_updated_at || 0)),
                            'N2 updated at:',
                            formatDate(new Date(channel.n1_updated_at || 0))
                        ]) }

                    </div>: null }

                </div>
            </div>
        </div>

}

export default InfoBox;

function renderGreenRow(props: string[]) {
    return (
        <div className="mb-2 row">
            <div className="col-12 col-md-6">
                <div className="row">
                    <div className='col-4'>
                        { props[0] }
                    </div>
                    <GreenSpan className='col-8'>
                        { props[1] }
                    </GreenSpan>
                </div>
            </div>

            <div className="col-12 col-md-6">
                <div className="row">
                    <div className='col-4'>
                        { props[2] }
                    </div>
                    <GreenSpan className='col-8'>
                        { props[3] }
                    </GreenSpan>
                </div>
            </div>
        </div>
    );
}

function renderGreenFullRow(props: string[]) {
    return (
        <div className="mb-2 row">
            <div className="col-12">
                <div className="row">
                    <div className='col-4 col-md-3 col-lg-2'>
                        { props[0] }
                    </div>
                    <GreenSpan className='col-8 col-md-9 col-lg-10'>
                        { props[1] }
                    </GreenSpan>
                </div>
            </div>
        </div>
    );
}
