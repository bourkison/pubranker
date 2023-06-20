export type Json = string;

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
            beer_pub_relationships: {
                Row: {
                    beer_id: number;
                    created_at: string | null;
                    id: number;
                    pub_id: number;
                };
                Insert: {
                    beer_id: number;
                    created_at?: string | null;
                    id?: number;
                    pub_id: number;
                };
                Update: {
                    beer_id?: number;
                    created_at?: string | null;
                    id?: number;
                    pub_id?: number;
                };
            };
            beers: {
                Row: {
                    brewery: string;
                    created_at: string | null;
                    id: number;
                    logo: string | null;
                    name: string;
                    type: string;
                };
                Insert: {
                    brewery: string;
                    created_at?: string | null;
                    id?: number;
                    logo?: string | null;
                    name: string;
                    type: string;
                };
                Update: {
                    brewery?: string;
                    created_at?: string | null;
                    id?: number;
                    logo?: string | null;
                    name?: string;
                    type?: string;
                };
            };
            comment_likes: {
                Row: {
                    comment_id: number;
                    created_at: string;
                    id: number;
                    user_id: string;
                };
                Insert: {
                    comment_id: number;
                    created_at?: string;
                    id?: number;
                    user_id?: string;
                };
                Update: {
                    comment_id?: number;
                    created_at?: string;
                    id?: number;
                    user_id?: string;
                };
            };
            comments: {
                Row: {
                    content: string;
                    created_at: string;
                    id: number;
                    review_id: number;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    content: string;
                    created_at?: string;
                    id?: number;
                    review_id: number;
                    updated_at?: string;
                    user_id?: string;
                };
                Update: {
                    content?: string;
                    created_at?: string;
                    id?: number;
                    review_id?: number;
                    updated_at?: string;
                    user_id?: string;
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
            pub_schema: {
                Row: {
                    address: string;
                    beer_garden: boolean | null;
                    dart_board: boolean | null;
                    dist_meters: number;
                    dog_friendly: boolean | null;
                    foosball_table: boolean | null;
                    free_wifi: boolean | null;
                    google_id: string;
                    google_overview: string;
                    google_rating: number;
                    google_ratings_amount: number;
                    id: number;
                    kid_friendly: boolean | null;
                    live_sport: boolean | null;
                    location: string;
                    name: string;
                    num_reviews: number;
                    opening_hours: Json;
                    phone_number: string;
                    photos: string[];
                    pool_table: boolean | null;
                    reservable: boolean | null;
                    review_beer: number;
                    review_food: number;
                    review_location: number;
                    review_music: number;
                    review_service: number;
                    review_vibe: number;
                    rooftop: boolean | null;
                    saved: boolean;
                    website: string;
                    wheelchair_accessible: boolean | null;
                };
                Insert: {
                    address: string;
                    beer_garden?: boolean | null;
                    dart_board?: boolean | null;
                    dist_meters: number;
                    dog_friendly?: boolean | null;
                    foosball_table?: boolean | null;
                    free_wifi?: boolean | null;
                    google_id: string;
                    google_overview: string;
                    google_rating: number;
                    google_ratings_amount: number;
                    id: number;
                    kid_friendly?: boolean | null;
                    live_sport?: boolean | null;
                    location: string;
                    name: string;
                    num_reviews: number;
                    opening_hours: Json;
                    phone_number: string;
                    photos: string[];
                    pool_table?: boolean | null;
                    reservable?: boolean | null;
                    review_beer: number;
                    review_food: number;
                    review_location: number;
                    review_music: number;
                    review_service: number;
                    review_vibe: number;
                    rooftop?: boolean | null;
                    saved: boolean;
                    website: string;
                    wheelchair_accessible?: boolean | null;
                };
                Update: {
                    address?: string;
                    beer_garden?: boolean | null;
                    dart_board?: boolean | null;
                    dist_meters?: number;
                    dog_friendly?: boolean | null;
                    foosball_table?: boolean | null;
                    free_wifi?: boolean | null;
                    google_id?: string;
                    google_overview?: string;
                    google_rating?: number;
                    google_ratings_amount?: number;
                    id?: number;
                    kid_friendly?: boolean | null;
                    live_sport?: boolean | null;
                    location?: string;
                    name?: string;
                    num_reviews?: number;
                    opening_hours?: Json;
                    phone_number?: string;
                    photos?: string[];
                    pool_table?: boolean | null;
                    reservable?: boolean | null;
                    review_beer?: number;
                    review_food?: number;
                    review_location?: number;
                    review_music?: number;
                    review_service?: number;
                    review_vibe?: number;
                    rooftop?: boolean | null;
                    saved?: boolean;
                    website?: string;
                    wheelchair_accessible?: boolean | null;
                };
            };
            pubs: {
                Row: {
                    address: string | null;
                    beer_garden: boolean | null;
                    brewery: boolean | null;
                    created_at: string | null;
                    dart_board: boolean | null;
                    dog_friendly: boolean | null;
                    foosball_table: boolean | null;
                    free_wifi: boolean | null;
                    google_id: string | null;
                    google_overview: string | null;
                    google_rating: number | null;
                    google_ratings_amount: number | null;
                    hidden: boolean;
                    id: number;
                    kid_friendly: boolean | null;
                    live_sport: boolean | null;
                    location: unknown | null;
                    name: string | null;
                    phone_number: string | null;
                    pool_table: boolean | null;
                    reservable: boolean | null;
                    rooftop: boolean | null;
                    updated_at: string | null;
                    website: string | null;
                    wheelchair_accessible: boolean | null;
                };
                Insert: {
                    address?: string | null;
                    beer_garden?: boolean | null;
                    brewery?: boolean | null;
                    created_at?: string | null;
                    dart_board?: boolean | null;
                    dog_friendly?: boolean | null;
                    foosball_table?: boolean | null;
                    free_wifi?: boolean | null;
                    google_id?: string | null;
                    google_overview?: string | null;
                    google_rating?: number | null;
                    google_ratings_amount?: number | null;
                    hidden?: boolean;
                    id?: number;
                    kid_friendly?: boolean | null;
                    live_sport?: boolean | null;
                    location?: unknown | null;
                    name?: string | null;
                    phone_number?: string | null;
                    pool_table?: boolean | null;
                    reservable?: boolean | null;
                    rooftop?: boolean | null;
                    updated_at?: string | null;
                    website?: string | null;
                    wheelchair_accessible?: boolean | null;
                };
                Update: {
                    address?: string | null;
                    beer_garden?: boolean | null;
                    brewery?: boolean | null;
                    created_at?: string | null;
                    dart_board?: boolean | null;
                    dog_friendly?: boolean | null;
                    foosball_table?: boolean | null;
                    free_wifi?: boolean | null;
                    google_id?: string | null;
                    google_overview?: string | null;
                    google_rating?: number | null;
                    google_ratings_amount?: number | null;
                    hidden?: boolean;
                    id?: number;
                    kid_friendly?: boolean | null;
                    live_sport?: boolean | null;
                    location?: unknown | null;
                    name?: string | null;
                    phone_number?: string | null;
                    pool_table?: boolean | null;
                    reservable?: boolean | null;
                    rooftop?: boolean | null;
                    updated_at?: string | null;
                    website?: string | null;
                    wheelchair_accessible?: boolean | null;
                };
            };
            review_helpfuls: {
                Row: {
                    created_at: string | null;
                    id: number;
                    is_helpful: boolean;
                    review_id: number;
                    user_id: string;
                };
                Insert: {
                    created_at?: string | null;
                    id?: number;
                    is_helpful: boolean;
                    review_id: number;
                    user_id?: string;
                };
                Update: {
                    created_at?: string | null;
                    id?: number;
                    is_helpful?: boolean;
                    review_id?: number;
                    user_id?: string;
                };
            };
            reviews: {
                Row: {
                    beer: number;
                    content: string | null;
                    created_at: string;
                    editors_review: boolean;
                    food: number;
                    id: number;
                    location: number;
                    music: number;
                    pub_id: number;
                    service: number;
                    updated_at: string | null;
                    user_id: string;
                    vibe: number;
                };
                Insert: {
                    beer: number;
                    content?: string | null;
                    created_at?: string;
                    editors_review?: boolean;
                    food: number;
                    id?: number;
                    location: number;
                    music: number;
                    pub_id: number;
                    service: number;
                    updated_at?: string | null;
                    user_id?: string;
                    vibe: number;
                };
                Update: {
                    beer?: number;
                    content?: string | null;
                    created_at?: string;
                    editors_review?: boolean;
                    food?: number;
                    id?: number;
                    location?: number;
                    music?: number;
                    pub_id?: number;
                    service?: number;
                    updated_at?: string | null;
                    user_id?: string;
                    vibe?: number;
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
            users_public: {
                Row: {
                    created_at: string | null;
                    id: string;
                    name: string;
                };
                Insert: {
                    created_at?: string | null;
                    id: string;
                    name: string;
                };
                Update: {
                    created_at?: string | null;
                    id?: string;
                    name?: string;
                };
            };
        };
        Views: {
            formatted_pubs: {
                Row: {
                    address: string | null;
                    beer_garden: boolean | null;
                    dart_board: boolean | null;
                    dog_friendly: boolean | null;
                    foosball_table: boolean | null;
                    free_wifi: boolean | null;
                    google_id: string | null;
                    google_overview: string | null;
                    google_rating: number | null;
                    google_ratings_amount: number | null;
                    id: number | null;
                    kid_friendly: boolean | null;
                    live_sport: boolean | null;
                    location: string | null;
                    name: string | null;
                    num_reviews: number | null;
                    opening_hours: Json | null;
                    phone_number: string | null;
                    photos: string[] | null;
                    pool_table: boolean | null;
                    reservable: boolean | null;
                    review_beer: number | null;
                    review_food: number | null;
                    review_location: number | null;
                    review_music: number | null;
                    review_service: number | null;
                    review_vibe: number | null;
                    rooftop: boolean | null;
                    saved: boolean | null;
                    website: string | null;
                    wheelchair_accessible: boolean | null;
                };
            };
            user_comments: {
                Row: {
                    content: string | null;
                    created_at: string | null;
                    id: number | null;
                    liked: boolean | null;
                    likes_amount: number | null;
                    review_id: number | null;
                    updated_at: string | null;
                    user_id: string | null;
                    user_name: string | null;
                };
            };
            user_reviews: {
                Row: {
                    beer: number | null;
                    content: string | null;
                    created_at: string | null;
                    editors_review: boolean | null;
                    food: number | null;
                    id: number | null;
                    is_helpfuls: number | null;
                    location: number | null;
                    music: number | null;
                    pub_id: number | null;
                    service: number | null;
                    total_helpfuls: number | null;
                    updated_at: string | null;
                    user_id: string | null;
                    user_name: string | null;
                    vibe: number | null;
                };
            };
        };
        Functions: {
            get_pub: {
                Args: {
                    dist_long: number;
                    dist_lat: number;
                };
                Returns: {
                    address: string;
                    beer_garden: boolean | null;
                    dart_board: boolean | null;
                    dist_meters: number;
                    dog_friendly: boolean | null;
                    foosball_table: boolean | null;
                    free_wifi: boolean | null;
                    google_id: string;
                    google_overview: string;
                    google_rating: number;
                    google_ratings_amount: number;
                    id: number;
                    kid_friendly: boolean | null;
                    live_sport: boolean | null;
                    location: string;
                    name: string;
                    num_reviews: number;
                    opening_hours: Json;
                    phone_number: string;
                    photos: string[];
                    pool_table: boolean | null;
                    reservable: boolean | null;
                    review_beer: number;
                    review_food: number;
                    review_location: number;
                    review_music: number;
                    review_service: number;
                    review_vibe: number;
                    rooftop: boolean | null;
                    saved: boolean;
                    website: string;
                    wheelchair_accessible: boolean | null;
                }[];
            };
            nearby_pubs: {
                Args: {
                    order_lat: number;
                    order_long: number;
                    dist_lat: number;
                    dist_long: number;
                };
                Returns: {
                    address: string;
                    beer_garden: boolean | null;
                    dart_board: boolean | null;
                    dist_meters: number;
                    dog_friendly: boolean | null;
                    foosball_table: boolean | null;
                    free_wifi: boolean | null;
                    google_id: string;
                    google_overview: string;
                    google_rating: number;
                    google_ratings_amount: number;
                    id: number;
                    kid_friendly: boolean | null;
                    live_sport: boolean | null;
                    location: string;
                    name: string;
                    num_reviews: number;
                    opening_hours: Json;
                    phone_number: string;
                    photos: string[];
                    pool_table: boolean | null;
                    reservable: boolean | null;
                    review_beer: number;
                    review_food: number;
                    review_location: number;
                    review_music: number;
                    review_service: number;
                    review_vibe: number;
                    rooftop: boolean | null;
                    saved: boolean;
                    website: string;
                    wheelchair_accessible: boolean | null;
                }[];
            };
            pubs_in_polygon: {
                Args: {
                    geojson: string;
                    dist_long: number;
                    dist_lat: number;
                };
                Returns: {
                    address: string;
                    beer_garden: boolean | null;
                    dart_board: boolean | null;
                    dist_meters: number;
                    dog_friendly: boolean | null;
                    foosball_table: boolean | null;
                    free_wifi: boolean | null;
                    google_id: string;
                    google_overview: string;
                    google_rating: number;
                    google_ratings_amount: number;
                    id: number;
                    kid_friendly: boolean | null;
                    live_sport: boolean | null;
                    location: string;
                    name: string;
                    num_reviews: number;
                    opening_hours: Json;
                    phone_number: string;
                    photos: string[];
                    pool_table: boolean | null;
                    reservable: boolean | null;
                    review_beer: number;
                    review_food: number;
                    review_location: number;
                    review_music: number;
                    review_service: number;
                    review_vibe: number;
                    rooftop: boolean | null;
                    saved: boolean;
                    website: string;
                    wheelchair_accessible: boolean | null;
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
