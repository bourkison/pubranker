export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json }
    | Json[];

export interface Database {
    graphql_public: {
        Tables: {
            [_ in never]: never;
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            graphql: {
                Args: {
                    operationName?: string;
                    query?: string;
                    variables?: Json;
                    extensions?: Json;
                };
                Returns: Json;
            };
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
    public: {
        Tables: {
            beers: {
                Row: {
                    brewery: string;
                    created_at: string | null;
                    id: number;
                    name: string;
                    type: string;
                };
                Insert: {
                    brewery: string;
                    created_at?: string | null;
                    id?: number;
                    name: string;
                    type: string;
                };
                Update: {
                    brewery?: string;
                    created_at?: string | null;
                    id?: number;
                    name?: string;
                    type?: string;
                };
            };
            opening_hours: {
                Row: {
                    close_day: number;
                    close_hour: string;
                    id: number;
                    open_day: number;
                    open_hour: string;
                    pub_id: number;
                };
                Insert: {
                    close_day: number;
                    close_hour: string;
                    id?: number;
                    open_day: number;
                    open_hour: string;
                    pub_id: number;
                };
                Update: {
                    close_day?: number;
                    close_hour?: string;
                    id?: number;
                    open_day?: number;
                    open_hour?: string;
                    pub_id?: number;
                };
            };
            pub_photos: {
                Row: {
                    admin: boolean;
                    created_at: string | null;
                    id: number;
                    key: string;
                    pub_id: number;
                    user_id: string | null;
                };
                Insert: {
                    admin?: boolean;
                    created_at?: string | null;
                    id?: number;
                    key: string;
                    pub_id: number;
                    user_id?: string | null;
                };
                Update: {
                    admin?: boolean;
                    created_at?: string | null;
                    id?: number;
                    key?: string;
                    pub_id?: number;
                    user_id?: string | null;
                };
            };
            pubs: {
                Row: {
                    address: string | null;
                    beer_garden: boolean | null;
                    created_at: string | null;
                    dart_board_amount: number | null;
                    dog_friendly: boolean | null;
                    foosball_table_amount: number | null;
                    free_wifi: boolean | null;
                    google_id: string | null;
                    google_overview: string | null;
                    google_photos: string[] | null;
                    google_rating: number | null;
                    google_ratings_amount: number | null;
                    hidden: boolean;
                    id: number;
                    is_brewery: boolean | null;
                    kid_friendly: boolean | null;
                    latitude: number | null;
                    live_sport: boolean | null;
                    location: unknown | null;
                    longitude: number | null;
                    menu: Json | null;
                    name: string | null;
                    phone_number: string | null;
                    pool_table_amount: number | null;
                    reservable: boolean | null;
                    rooftop: boolean | null;
                    updated_at: string | null;
                    website: string | null;
                    wheelchair_accessible: boolean | null;
                };
                Insert: {
                    address?: string | null;
                    beer_garden?: boolean | null;
                    created_at?: string | null;
                    dart_board_amount?: number | null;
                    dog_friendly?: boolean | null;
                    foosball_table_amount?: number | null;
                    free_wifi?: boolean | null;
                    google_id?: string | null;
                    google_overview?: string | null;
                    google_photos?: string[] | null;
                    google_rating?: number | null;
                    google_ratings_amount?: number | null;
                    hidden?: boolean;
                    id?: number;
                    is_brewery?: boolean | null;
                    kid_friendly?: boolean | null;
                    latitude?: number | null;
                    live_sport?: boolean | null;
                    location?: unknown | null;
                    longitude?: number | null;
                    menu?: Json | null;
                    name?: string | null;
                    phone_number?: string | null;
                    pool_table_amount?: number | null;
                    reservable?: boolean | null;
                    rooftop?: boolean | null;
                    updated_at?: string | null;
                    website?: string | null;
                    wheelchair_accessible?: boolean | null;
                };
                Update: {
                    address?: string | null;
                    beer_garden?: boolean | null;
                    created_at?: string | null;
                    dart_board_amount?: number | null;
                    dog_friendly?: boolean | null;
                    foosball_table_amount?: number | null;
                    free_wifi?: boolean | null;
                    google_id?: string | null;
                    google_overview?: string | null;
                    google_photos?: string[] | null;
                    google_rating?: number | null;
                    google_ratings_amount?: number | null;
                    hidden?: boolean;
                    id?: number;
                    is_brewery?: boolean | null;
                    kid_friendly?: boolean | null;
                    latitude?: number | null;
                    live_sport?: boolean | null;
                    location?: unknown | null;
                    longitude?: number | null;
                    menu?: Json | null;
                    name?: string | null;
                    phone_number?: string | null;
                    pool_table_amount?: number | null;
                    reservable?: boolean | null;
                    rooftop?: boolean | null;
                    updated_at?: string | null;
                    website?: string | null;
                    wheelchair_accessible?: boolean | null;
                };
            };
            reviews: {
                Row: {
                    beer: number | null;
                    content: string | null;
                    created_at: string | null;
                    editors_review: boolean;
                    food: number | null;
                    id: number;
                    location: number | null;
                    music: number | null;
                    pub_id: number | null;
                    service: number | null;
                    updated_at: string | null;
                    user_id: string | null;
                    vibe: number | null;
                };
                Insert: {
                    beer?: number | null;
                    content?: string | null;
                    created_at?: string | null;
                    editors_review?: boolean;
                    food?: number | null;
                    id?: number;
                    location?: number | null;
                    music?: number | null;
                    pub_id?: number | null;
                    service?: number | null;
                    updated_at?: string | null;
                    user_id?: string | null;
                    vibe?: number | null;
                };
                Update: {
                    beer?: number | null;
                    content?: string | null;
                    created_at?: string | null;
                    editors_review?: boolean;
                    food?: number | null;
                    id?: number;
                    location?: number | null;
                    music?: number | null;
                    pub_id?: number | null;
                    service?: number | null;
                    updated_at?: string | null;
                    user_id?: string | null;
                    vibe?: number | null;
                };
            };
            saves: {
                Row: {
                    created_at: string | null;
                    id: number;
                    pub_id: number;
                    user_id: string;
                };
                Insert: {
                    created_at?: string | null;
                    id?: number;
                    pub_id: number;
                    user_id?: string;
                };
                Update: {
                    created_at?: string | null;
                    id?: number;
                    pub_id?: number;
                    user_id?: string;
                };
            };
            users: {
                Row: {
                    created_at: string | null;
                    id: string;
                    name: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    id: string;
                    name?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    id?: string;
                    name?: string | null;
                };
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            nearby_pubs: {
                Args: {
                    order_lat: number;
                    order_long: number;
                    dist_lat: number;
                    dist_long: number;
                };
                Returns: {
                    id: number;
                    google_rating: number;
                    name: string;
                    address: string;
                    phone_number: string;
                    google_overview: string;
                    google_ratings_amount: number;
                    reservable: boolean;
                    website: string;
                    dog_friendly: boolean;
                    live_sport: boolean;
                    pool_table_amount: number;
                    dart_board_amount: number;
                    menu: Json;
                    beer_garden: boolean;
                    kid_friendly: boolean;
                    free_wifi: boolean;
                    rooftop: boolean;
                    foosball_table_amount: number;
                    wheelchair_accessible: boolean;
                    location: string;
                    dist_meters: number;
                }[];
            };
            pubs_in_polygon: {
                Args: {
                    geojson: string;
                    dist_long: number;
                    dist_lat: number;
                };
                Returns: {
                    id: number;
                    google_rating: number;
                    name: string;
                    address: string;
                    phone_number: string;
                    google_overview: string;
                    google_ratings_amount: number;
                    reservable: boolean;
                    website: string;
                    dog_friendly: boolean;
                    live_sport: boolean;
                    pool_table_amount: number;
                    dart_board_amount: number;
                    menu: Json;
                    beer_garden: boolean;
                    kid_friendly: boolean;
                    free_wifi: boolean;
                    rooftop: boolean;
                    foosball_table_amount: number;
                    wheelchair_accessible: boolean;
                    location: string;
                    dist_meters: number;
                }[];
            };
            saved_pubs: {
                Args: {
                    input_id: string;
                    dist_long: number;
                    dist_lat: number;
                };
                Returns: {
                    id: number;
                    google_rating: number;
                    name: string;
                    address: string;
                    phone_number: string;
                    google_overview: string;
                    google_ratings_amount: number;
                    reservable: boolean;
                    website: string;
                    dog_friendly: boolean;
                    live_sport: boolean;
                    pool_table_amount: number;
                    dart_board_amount: number;
                    menu: Json;
                    beer_garden: boolean;
                    kid_friendly: boolean;
                    free_wifi: boolean;
                    rooftop: boolean;
                    foosball_table_amount: number;
                    wheelchair_accessible: boolean;
                    pub_photos: string[];
                    opening_hours: Json;
                    location: string;
                    dist_meters: number;
                }[];
            };
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
    storage: {
        Tables: {
            buckets: {
                Row: {
                    created_at: string | null;
                    id: string;
                    name: string;
                    owner: string | null;
                    public: boolean | null;
                    updated_at: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    id: string;
                    name: string;
                    owner?: string | null;
                    public?: boolean | null;
                    updated_at?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    id?: string;
                    name?: string;
                    owner?: string | null;
                    public?: boolean | null;
                    updated_at?: string | null;
                };
            };
            migrations: {
                Row: {
                    executed_at: string | null;
                    hash: string;
                    id: number;
                    name: string;
                };
                Insert: {
                    executed_at?: string | null;
                    hash: string;
                    id: number;
                    name: string;
                };
                Update: {
                    executed_at?: string | null;
                    hash?: string;
                    id?: number;
                    name?: string;
                };
            };
            objects: {
                Row: {
                    bucket_id: string | null;
                    created_at: string | null;
                    id: string;
                    last_accessed_at: string | null;
                    metadata: Json | null;
                    name: string | null;
                    owner: string | null;
                    path_tokens: string[] | null;
                    updated_at: string | null;
                };
                Insert: {
                    bucket_id?: string | null;
                    created_at?: string | null;
                    id?: string;
                    last_accessed_at?: string | null;
                    metadata?: Json | null;
                    name?: string | null;
                    owner?: string | null;
                    path_tokens?: string[] | null;
                    updated_at?: string | null;
                };
                Update: {
                    bucket_id?: string | null;
                    created_at?: string | null;
                    id?: string;
                    last_accessed_at?: string | null;
                    metadata?: Json | null;
                    name?: string | null;
                    owner?: string | null;
                    path_tokens?: string[] | null;
                    updated_at?: string | null;
                };
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            extension: {
                Args: {
                    name: string;
                };
                Returns: string;
            };
            filename: {
                Args: {
                    name: string;
                };
                Returns: string;
            };
            foldername: {
                Args: {
                    name: string;
                };
                Returns: string[];
            };
            get_size_by_bucket: {
                Args: Record<PropertyKey, never>;
                Returns: {
                    size: number;
                    bucket_id: string;
                }[];
            };
            search: {
                Args: {
                    prefix: string;
                    bucketname: string;
                    limits?: number;
                    levels?: number;
                    offsets?: number;
                    search?: string;
                    sortcolumn?: string;
                    sortorder?: string;
                };
                Returns: {
                    name: string;
                    id: string;
                    updated_at: string;
                    created_at: string;
                    last_accessed_at: string;
                    metadata: Json;
                }[];
            };
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
}
