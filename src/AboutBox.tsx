import { 
    useMemo, 
    useRef                  }   from    'react';
import styled                   from    'styled-components';
import * as bootstrap           from    'bootstrap';

const Link = styled.a`color: white;`;

function AboutBox({ onAboutClose }: { onAboutClose: Function }) {

    const modalRef  =   useRef(null);

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

    const handleClose = () => {
        const modalEle          =   modalRef.current;
        const bsModal           =   new bootstrap.Modal(modalEle!, {
            keyboard: false
        })
        bsModal.hide();

        onAboutClose();

    }

    return <div className="modal" ref={modalRef} tabIndex={-1} >
            <div className="modal-dialog modal-md modal-dialog-centered">
                <div className="modal-content" style={{ 'background': 'rgba(33, 35, 73, 0.9)', 'border': '1px solid #56598D', 'borderRadius': '25px' }}>
                    <div className="modal-header" style={{ 'borderBottom': '1px solid #56598D' }}>
                        <h6 className="modal-title">
                            Info
                        </h6>

                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={ (_e: any) => handleClose() }>
                        </button>
                    </div>

                    <div className="text-start modal-body">
                        <div className="modal-body" style={{ 'overflowWrap': 'anywhere' }}>
                            To learn LN, we created this explorer. <br /> <br />
                            <b> How to use? </b>
                            <p>
                                - Peers are clustered by their node capactiy. <br/>
                                - Click on Hexagonal peer to explore their peers <br/>
                                - Longpress on root / LN nodes (hex) for additional info. <br/>
                            </p>
                            <b> Source code </b>
                            <p>
                                <Link target="_blank" href="https://github.com/saiy2k/lighthouse-web">https://github.com/saiy2k/lighthouse-web</Link> <br/>
                                <Link target="_blank" href="https://github.com/saravanan7mani/lighthouse">https://github.com/saravanan7mani/lighthouse</Link> <br/>
                            </p>

                            <b> Reach us at </b>
                            <p> <Link href="https://twitter.com/saravananmani_" target="_blank"> @saravananmani_</Link>, <Link href="https://twitter.com/saiy2k" target="_blank"> @saiy2k</Link> </p>

                            <b> To hire me </b>
                            <p>
                                - This app is my 'Proof of Work' <br/>
                                - Looking to quit my fiat job and take a bitcoin job. <br/>
                                - Contributed to <Link href='https://github.com/Ride-The-Lightning/RTL/pulls?q=is%3Apr+author%3Asaiy2k'> RTL Lightning node manager </Link> <br/>
                                - Participant of Chaincode lab's Bitcoin Protocol Developmnet course.
                                - To hire me, you can reach out to  <Link href='mailto:saiy2k@gmail.com'>saiy2k@gmail.com</Link>, <Link href='https://www.linkedin.com/in/saiy2k/'> Linkedin</Link>, <Link href='https://twitter.com/saiy2k'> Twitter </Link>
                            </p>

                            <b> Credits </b>
                            <p>
                                Thunder sound fx: <Link href='https://pixabay.com/sound-effects/' target='_blank'> Pixabay</Link>
                            </p>
                            <p className='text-center'> Hail Satoshi! </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>

}

export default AboutBox;
