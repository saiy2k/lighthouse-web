import { ILNNode            }   from    './Interface';
import { HEX_STROKE         }   from    './Constants';

export const nodeHash           :   any                 =   {};

let colorCounter                =   6;

export function processNodes(
    _nodes                      :   ILNNode[],
    level                       :   number,
    prefix                      :   string, 
    sortParams                  :   string[],
    key                         :   string
): ILNNode[] {

    if (_nodes.length === 0) return [];

    const newNodes              :   ILNNode[]           =   [];
    const bCount                :   number              =   8;
    const bSize                 =   Math.max(Math.ceil(_nodes.length / bCount), 8);

    const sortParam             =   sortParams[level - 2];
    _nodes.sort((a: ILNNode, b: ILNNode) => {
        if (sortParam === 'nodeCapacity') {
            return a.capacity - b.capacity;
        } else if (sortParam === 'channelCapacity') {
            return (a.channel_capacity || 0) - (b.channel_capacity || 0);
        } else {
            return 1;
        }
    });

    /*
    if (level === 4) {
        console.log("START", sortParam);
        _nodes.map((n: any) => console.log(n.capacity + ' --- ' + n.channel_capacity));
    }

    console.log('level: ', level);
    console.log(_nodes[0].id);
    _nodes.map((n: ILNNode) => console.log(n.channel_capacity));
    */

    if (_nodes.length > bCount) {

        for (let i = 0; i < bCount; i++) {

            const children= processNodes(_nodes.slice(i * bSize, i * bSize + bSize), level + 1, `${prefix}-${i}`, sortParams, key);
            const totalChildCount = children.reduce((prev, curr) => prev + (curr.totalChildCount || 1), 0);
            if (children.length === 0) continue;
            const _node: ILNNode = {
                alias           :   `${prefix}-${i}`,
                capacity        :   0,
                channel_count   :   0,
                public_key      :   `${prefix}-${i}`,
                channel_capacity:   0,

                id              :   `${prefix}-${i}`,
                children        :   children,
                isBucket        :   true,
                isLastBucket    :   children[0].isBucket === false,
                level           :   level,
                show            :   level === 2,
                minCapacity     :   getMinCapacity(children),
                maxCapacity     :   getMaxCapacity(children),
                minChannelCapacity: getMinChannelCapacity(children),
                maxChannelCapacity: getMaxChannelCapacity(children),
                totalChildCount :   totalChildCount,

                rad             :   10 + level * 40,
            };

            if (_node.isLastBucket) {
                _node.color = HEX_STROKE[colorCounter % 6];
                colorCounter = (colorCounter + 1) % 6;
                for (let i = 0; i < children.length; i++) {
                    children[i].color = _node.color;
                }
            }

            nodeHash[key][_node.id || ''] = _node;

            newNodes.push(_node);
        }

        newNodes.sort((a: ILNNode, b: ILNNode) => {
            if (sortParam === 'nodeCapacity') {
                return a.minCapacity - b.minCapacity;
            } else if (sortParam === 'channelCapacity') {
                return (a.minChannelCapacity || 0) - (b.minChannelCapacity || 0);
            } else {
                return 1;
            }
        });

        return newNodes;
    } else {
        const newNodes = _nodes.map((n: any, index: number) => {
            n.id                =   n.public_key + n.channel_capacity;
            n.children          =   [];
            n.isBucket          =   false;
            n.isLastBucket      =   false;
            n.level             =   level;
            n.show              =   level === 2;
            n.totalChildCount   =   1;
            n.rad               =   10 + level * 50;

            nodeHash[key][n.id] = n;

            if (level === 2) {
                n.color         =   'yellow';
            }

            return n;
        });

        return newNodes;

    }
}

function getMinCapacity(children: ILNNode[]): number {
    if (children.length > 0) {
        if (children[0].isBucket) {
            return children[0].minCapacity;
        } else {
            let minCapacity = Number.MAX_SAFE_INTEGER;
            for (let i = 0; i < children.length; i++) {
                if (children[i].capacity < minCapacity) {
                    minCapacity = children[i].capacity;
                }
            }
            return minCapacity;
        }
    } else {
        return 0;
    }
}

function getMaxCapacity(children: ILNNode[]): number {
    if (children.length > 0) {
        if (children[children.length - 1].isBucket) {
            return children[children.length - 1].maxCapacity;
        } else {
            let maxCapacity = 0;
            for (let i = 0; i < children.length; i++) {
                if (children[i].capacity > maxCapacity) {
                    maxCapacity = children[i].capacity;
                }
            }
            return maxCapacity;

        }
    } else {
        return 0;
    }
}

function getMinChannelCapacity(children: ILNNode[]): number {
    if (children.length > 0) {
        if (children[0].isBucket) {
            return children[0].minChannelCapacity;
        } else {
            let minCapacity = Number.MAX_VALUE;
            for (let i = 0; i < children.length; i++) {
                if (children[i].channel_capacity < minCapacity) {
                    minCapacity = children[i].channel_capacity;
                }
            }
            return minCapacity;
        }
    } else {
        return 0;
    }
}

function getMaxChannelCapacity(children: ILNNode[]): number {
    if (children.length > 0) {
        if (children[children.length - 1].isBucket) {
            return children[children.length - 1].maxChannelCapacity;
        } else {
            let maxCapacity = 0;
            for (let i = 0; i < children.length; i++) {
                if (children[i].channel_capacity > maxCapacity) {
                    maxCapacity = children[i].channel_capacity;
                }
            }
            return maxCapacity;
        }
    } else {
        return 0;
    }
}

export function formatSats(sats: number = 0, decimal: boolean = true): string {

    if (sats < 1000) {
        return sats.toString();
    } else if (sats < 1000000) {
        const no = sats / 1000;
        return (no < 10 && decimal ? no.toFixed(1): no.toFixed(0)) + 'K';
    } else if (sats < 100000000) {
        const no = sats / 1000000;
        return (no < 10 && decimal ? no.toFixed(1): no.toFixed(0)) + 'M';
    } else {
        const no = sats / 1000000000;
        return (no < 10 && decimal ? no.toFixed(1): no.toFixed(0)) + 'B';
    }

}

export function formatDate(date: Date) {
    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${month[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// https://stackoverflow.com/a/18473154/390150
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

export function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, depth: number = 0.25): string {

    depth = 1 - depth;

    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);
    
    var start1 = polarToCartesian(x, y, radius * depth, endAngle);
    var end1 = polarToCartesian(x, y, radius * depth, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        "L", end1.x, end1.y, 
        "A", radius * depth, radius * depth, 0, largeArcFlag, 1, start1.x, start1.y,
        "L", start.x, start.y,
    ].join(" ");

    return d;       
}

export function getNodeFromRootById(root: ILNNode, id: string) {
    const frags: string[] = id.split('-');
    frags.shift();
    frags.shift();

    let n = root;
    while(frags.length > 0) {
        const index = parseInt(frags.shift()!);
        n = n.children[index];
    }

    return n;
}

export function truncateText(str: string, maxLength: number = 10) {
    if (str.length > maxLength) {
        return str.substring(0, maxLength) + '...';
    } else {
        return str;
    }
}
