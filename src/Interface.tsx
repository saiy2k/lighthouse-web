interface IVisualElement {
    rad                         :   number;
}

export interface ILNNode extends IVisualElement {

    // if doesn't exist, assign first 20 chars of public_key
    alias                       :   string;
    capacity                    :   number;
    channel_count               :   number;
    public_key                  :   string;
    color?                      :   string;
    sockets?                    :   string[];
    updated_at?                 :   Date;
    channel_capacity            :   number;

    // for peers, public_key; for buckets, bucket hierarchy
    id                          :   string;
    children                    :   ILNNode[];
    isBucket                    :   boolean;
    isLastBucket                :   boolean;
    level                       :   number;
    show                        :   boolean;
    minCapacity                 :   number;
    maxCapacity                 :   number;
    minChannelCapacity          :   number;
    maxChannelCapacity          :   number;
    totalChildCount             :   number;

    channel?                    :   ILNChannel;
}

export interface ILNChannel {
    capacity                    :   number;
    channel_id                  :   string;
    channel_point               :   string;
    updated_at                  :   Date;

    n0_base_fee_mtokens         :   number;
    n0_cltv_delta               :   number;
    n0_fee_rate                 :   number;
    n0_is_disabled              :   boolean;
    n0_max_htlc_mtokens         :   number;
    n0_min_htlc_mtokens         :   number;
    n0_public_key               :   string;
    n0_updated_at               :   Date;

    n1_base_fee_mtokens         :   number;
    n1_cltv_delta               :   number;
    n1_fee_rate                 :   number;
    n1_is_disabled              :   boolean;
    n1_max_htlc_mtokens         :   number;
    n1_min_htlc_mtokens         :   number;
    n1_public_key               :   string;
    n1_updated_at               :   Date;

}
