import { 
    useMemo, 
    useRef                  }   from    'react';
import styled                   from    'styled-components';
import * as bootstrap           from    'bootstrap';

const Link = styled.a`color: white; text-decoration: none`;

function MobileWarning() {

    const modalRef  =   useRef(null);

    useMemo(() => {

        setTimeout(() => {
            if (!modalRef.current) return;

            const modalEle      =   modalRef.current;
            const bsModal       =   new bootstrap.Modal(modalEle!, {
                keyboard: true,
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

        /*
        setTimeout(() => {
            dispatch(updateInfoPeer(null));
        });
         */
    }


    return <div className="modal" ref={modalRef} tabIndex={-1} >
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content" style={{ 'background': 'rgba(33, 35, 73, 0.9)', 'border': '1px solid #56598D', 'borderRadius': '25px' }}>
                    <div className="modal-header" style={{ 'borderBottom': '1px solid #56598D' }}>
                        <h6 className="modal-title">
                            Desktop please
                        </h6>

                        <button type="button" className="mb-2 btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={ (_e: any) => handleClose() }>
                        </button>
                    </div>

                    <div className="text-start modal-body">
                        <div className="modal-body text-center" style={{ 'overflowWrap': 'anywhere' }}>
                            This experience is designed for Desktop.<br/>
                            Please check the link in your Desktop.
                        </div>
                    </div>

                </div>
            </div>
        </div>

}

export default MobileWarning;
