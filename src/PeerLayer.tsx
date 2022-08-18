import { RootState          }   from    './store';
import { useAppSelector     }   from    './store/hooks';

import { ILNNode            }   from    './Interface';
import PeerHex                  from    './PeerHex';
import PeerHex2                 from    './PeerHex2';
import PeerHex3                 from    './PeerHex3';

import { size               }   from    './GraphController';

function PeerLayer() {

    const peers: ILNNode[]      =   useAppSelector((state: RootState) => state.slide.items[state.slide.currentIndex].peers);

    return <>
        { peers && peers.map((peer: ILNNode, index: number) => (

        <PeerHex3
            key={peer.channel? peer.channel.channel_id : peer.id}
            node={peer}
            total={peers.length}
            index={index} />

        )) }
    </>;

    /*
    if (size.width > 640) {
        return <>
            { peers && peers.map((peer: ILNNode, index: number) => (

            <PeerHex3
                key={peer.channel? peer.channel.channel_id : peer.id}
                node={peer}
                total={peers.length}
                index={index} />

        )) }
        </>;
    } else {
        return <>
            { peers && peers.map((peer: ILNNode, index: number) => (

            <PeerHex2 
                key={peer.id + index}
                node={peer}
                index={index} />

        )) }
        </>;
    }
     */

}

export default PeerLayer;
