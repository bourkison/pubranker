export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type Database = {
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
                Relationships: [
                    {
                        foreignKeyName: 'beer_pub_relationships_beer_id_fkey';
                        columns: ['beer_id'];
                        isOneToOne: false;
                        referencedRelation: 'beers';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'beer_pub_relationships_pub_id_fkey';
                        columns: ['pub_id'];
                        isOneToOne: false;
                        referencedRelation: 'formatted_pubs';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'beer_pub_relationships_pub_id_fkey';
                        columns: ['pub_id'];
                        isOneToOne: false;
                        referencedRelation: 'pubs';
                        referencedColumns: ['id'];
                    },
                ];
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
                Relationships: [];
            };
            collection_items: {
                Row: {
                    collection_id: number;
                    created_at: string;
                    created_by: string;
                    id: number;
                    pub_id: number;
                };
                Insert: {
                    collection_id: number;
                    created_at?: string;
                    created_by?: string;
                    id?: number;
                    pub_id: number;
                };
                Update: {
                    collection_id?: number;
                    created_at?: string;
                    created_by?: string;
                    id?: number;
                    pub_id?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: 'collection_items_collection_id_fkey';
                        columns: ['collection_id'];
                        isOneToOne: false;
                        referencedRelation: 'collections';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'collection_items_pub_id_fkey';
                        columns: ['pub_id'];
                        isOneToOne: false;
                        referencedRelation: 'formatted_pubs';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'collection_items_pub_id_fkey';
                        columns: ['pub_id'];
                        isOneToOne: false;
                        referencedRelation: 'pubs';
                        referencedColumns: ['id'];
                    },
                ];
            };
            collections: {
                Row: {
                    collaborative: boolean;
                    created_at: string;
                    id: number;
                    name: string;
                    public: boolean;
                    user_id: string;
                };
                Insert: {
                    collaborative?: boolean;
                    created_at?: string;
                    id?: number;
                    name: string;
                    public?: boolean;
                    user_id: string;
                };
                Update: {
                    collaborative?: boolean;
                    created_at?: string;
                    id?: number;
                    name?: string;
                    public?: boolean;
                    user_id?: string;
                };
                Relationships: [];
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
                Relationships: [
                    {
                        foreignKeyName: 'comment_likes_comment_id_fkey';
                        columns: ['comment_id'];
                        isOneToOne: false;
                        referencedRelation: 'comments';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'comment_likes_comment_id_fkey';
                        columns: ['comment_id'];
                        isOneToOne: false;
                        referencedRelation: 'user_comments';
                        referencedColumns: ['id'];
                    },
                ];
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
                Relationships: [
                    {
                        foreignKeyName: 'comments_review_id_fkey';
                        columns: ['review_id'];
                        isOneToOne: false;
                        referencedRelation: 'reviews';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'comments_review_id_fkey';
                        columns: ['review_id'];
                        isOneToOne: false;
                        referencedRelation: 'user_reviews';
                        referencedColumns: ['id'];
                    },
                ];
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
                Relationships: [
                    {
                        foreignKeyName: 'opening_hours_pub_id_fkey';
                        columns: ['pub_id'];
                        isOneToOne: false;
                        referencedRelation: 'formatted_pubs';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'opening_hours_pub_id_fkey';
                        columns: ['pub_id'];
                        isOneToOne: false;
                        referencedRelation: 'pubs';
                        referencedColumns: ['id'];
                    },
                ];
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
                Relationships: [
                    {
                        foreignKeyName: 'pub_photos_pub_id_fkey';
                        columns: ['pub_id'];
                        isOneToOne: false;
                        referencedRelation: 'formatted_pubs';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'pub_photos_pub_id_fkey';
                        columns: ['pub_id'];
                        isOneToOne: false;
                        referencedRelation: 'pubs';
                        referencedColumns: ['id'];
                    },
                ];
            };
            pub_schema: {
                Row: {
                    address: string;
                    beer_garden: boolean | null;
                    dart_board: boolean | null;
                    description: string;
                    dist_meters: number;
                    dog_friendly: boolean | null;
                    foosball_table: boolean | null;
                    free_wifi: boolean | null;
                    google_id: string;
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
                    rating: number;
                    reservable: boolean | null;
                    review_beer_amount: number;
                    review_eights: number;
                    review_fives: number;
                    review_food_amount: number;
                    review_fours: number;
                    review_location_amount: number;
                    review_music_amount: number;
                    review_negative_beer_amount: number;
                    review_negative_food_amount: number;
                    review_negative_location_amount: number;
                    review_negative_music_amount: number;
                    review_negative_service_amount: number;
                    review_negative_vibe_amount: number;
                    review_nines: number;
                    review_ones: number;
                    review_service_amount: number;
                    review_sevens: number;
                    review_sixes: number;
                    review_tens: number;
                    review_threes: number;
                    review_twos: number;
                    review_vibe_amount: number;
                    rooftop: boolean | null;
                    saved: boolean;
                    website: string;
                    wheelchair_accessible: boolean | null;
                };
                Insert: {
                    address: string;
                    beer_garden?: boolean | null;
                    dart_board?: boolean | null;
                    description: string;
                    dist_meters: number;
                    dog_friendly?: boolean | null;
                    foosball_table?: boolean | null;
                    free_wifi?: boolean | null;
                    google_id: string;
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
                    rating: number;
                    reservable?: boolean | null;
                    review_beer_amount: number;
                    review_eights: number;
                    review_fives: number;
                    review_food_amount: number;
                    review_fours: number;
                    review_location_amount: number;
                    review_music_amount: number;
                    review_negative_beer_amount: number;
                    review_negative_food_amount: number;
                    review_negative_location_amount: number;
                    review_negative_music_amount: number;
                    review_negative_service_amount: number;
                    review_negative_vibe_amount: number;
                    review_nines: number;
                    review_ones: number;
                    review_service_amount: number;
                    review_sevens: number;
                    review_sixes: number;
                    review_tens: number;
                    review_threes: number;
                    review_twos: number;
                    review_vibe_amount: number;
                    rooftop?: boolean | null;
                    saved: boolean;
                    website: string;
                    wheelchair_accessible?: boolean | null;
                };
                Update: {
                    address?: string;
                    beer_garden?: boolean | null;
                    dart_board?: boolean | null;
                    description?: string;
                    dist_meters?: number;
                    dog_friendly?: boolean | null;
                    foosball_table?: boolean | null;
                    free_wifi?: boolean | null;
                    google_id?: string;
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
                    rating?: number;
                    reservable?: boolean | null;
                    review_beer_amount?: number;
                    review_eights?: number;
                    review_fives?: number;
                    review_food_amount?: number;
                    review_fours?: number;
                    review_location_amount?: number;
                    review_music_amount?: number;
                    review_negative_beer_amount?: number;
                    review_negative_food_amount?: number;
                    review_negative_location_amount?: number;
                    review_negative_music_amount?: number;
                    review_negative_service_amount?: number;
                    review_negative_vibe_amount?: number;
                    review_nines?: number;
                    review_ones?: number;
                    review_service_amount?: number;
                    review_sevens?: number;
                    review_sixes?: number;
                    review_tens?: number;
                    review_threes?: number;
                    review_twos?: number;
                    review_vibe_amount?: number;
                    rooftop?: boolean | null;
                    saved?: boolean;
                    website?: string;
                    wheelchair_accessible?: boolean | null;
                };
                Relationships: [];
            };
            pubs: {
                Row: {
                    address: string;
                    beer_garden: boolean | null;
                    brewery: boolean | null;
                    created_at: string;
                    dart_board: boolean | null;
                    description: string;
                    dog_friendly: boolean | null;
                    foosball_table: boolean | null;
                    free_wifi: boolean | null;
                    google_id: string;
                    hidden: boolean;
                    id: number;
                    kid_friendly: boolean | null;
                    live_sport: boolean | null;
                    location: unknown;
                    name: string;
                    phone_number: string | null;
                    pool_table: boolean | null;
                    primary_photo: string | null;
                    reservable: boolean | null;
                    rooftop: boolean | null;
                    updated_at: string;
                    website: string;
                    wheelchair_accessible: boolean | null;
                };
                Insert: {
                    address: string;
                    beer_garden?: boolean | null;
                    brewery?: boolean | null;
                    created_at?: string;
                    dart_board?: boolean | null;
                    description: string;
                    dog_friendly?: boolean | null;
                    foosball_table?: boolean | null;
                    free_wifi?: boolean | null;
                    google_id: string;
                    hidden?: boolean;
                    id?: number;
                    kid_friendly?: boolean | null;
                    live_sport?: boolean | null;
                    location: unknown;
                    name: string;
                    phone_number?: string | null;
                    pool_table?: boolean | null;
                    primary_photo?: string | null;
                    reservable?: boolean | null;
                    rooftop?: boolean | null;
                    updated_at?: string;
                    website: string;
                    wheelchair_accessible?: boolean | null;
                };
                Update: {
                    address?: string;
                    beer_garden?: boolean | null;
                    brewery?: boolean | null;
                    created_at?: string;
                    dart_board?: boolean | null;
                    description?: string;
                    dog_friendly?: boolean | null;
                    foosball_table?: boolean | null;
                    free_wifi?: boolean | null;
                    google_id?: string;
                    hidden?: boolean;
                    id?: number;
                    kid_friendly?: boolean | null;
                    live_sport?: boolean | null;
                    location?: unknown;
                    name?: string;
                    phone_number?: string | null;
                    pool_table?: boolean | null;
                    primary_photo?: string | null;
                    reservable?: boolean | null;
                    rooftop?: boolean | null;
                    updated_at?: string;
                    website?: string;
                    wheelchair_accessible?: boolean | null;
                };
                Relationships: [];
            };
            review_likes: {
                Row: {
                    created_at: string;
                    id: number;
                    review_id: number;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    id?: number;
                    review_id: number;
                    user_id?: string;
                };
                Update: {
                    created_at?: string;
                    id?: number;
                    review_id?: number;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'review_likes_review_id_fkey';
                        columns: ['review_id'];
                        isOneToOne: false;
                        referencedRelation: 'reviews';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'review_likes_review_id_fkey';
                        columns: ['review_id'];
                        isOneToOne: false;
                        referencedRelation: 'user_reviews';
                        referencedColumns: ['id'];
                    },
                ];
            };
            reviews: {
                Row: {
                    beer: boolean | null;
                    content: string | null;
                    created_at: string;
                    editors_review: boolean;
                    food: boolean | null;
                    id: number;
                    location: boolean | null;
                    music: boolean | null;
                    pub_id: number;
                    rating: number;
                    service: boolean | null;
                    updated_at: string | null;
                    user_id: string;
                    vibe: boolean | null;
                };
                Insert: {
                    beer?: boolean | null;
                    content?: string | null;
                    created_at?: string;
                    editors_review?: boolean;
                    food?: boolean | null;
                    id?: number;
                    location?: boolean | null;
                    music?: boolean | null;
                    pub_id: number;
                    rating: number;
                    service?: boolean | null;
                    updated_at?: string | null;
                    user_id?: string;
                    vibe?: boolean | null;
                };
                Update: {
                    beer?: boolean | null;
                    content?: string | null;
                    created_at?: string;
                    editors_review?: boolean;
                    food?: boolean | null;
                    id?: number;
                    location?: boolean | null;
                    music?: boolean | null;
                    pub_id?: number;
                    rating?: number;
                    service?: boolean | null;
                    updated_at?: string | null;
                    user_id?: string;
                    vibe?: boolean | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'reviews_pub_id_fkey';
                        columns: ['pub_id'];
                        isOneToOne: false;
                        referencedRelation: 'formatted_pubs';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'reviews_pub_id_fkey';
                        columns: ['pub_id'];
                        isOneToOne: false;
                        referencedRelation: 'pubs';
                        referencedColumns: ['id'];
                    },
                ];
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
                Relationships: [
                    {
                        foreignKeyName: 'saves_pub_id_fkey';
                        columns: ['pub_id'];
                        isOneToOne: false;
                        referencedRelation: 'formatted_pubs';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'saves_pub_id_fkey';
                        columns: ['pub_id'];
                        isOneToOne: false;
                        referencedRelation: 'pubs';
                        referencedColumns: ['id'];
                    },
                ];
            };
            users_public: {
                Row: {
                    created_at: string | null;
                    id: string;
                    name: string;
                    profile_photo: string | null;
                    username: string;
                };
                Insert: {
                    created_at?: string | null;
                    id: string;
                    name: string;
                    profile_photo?: string | null;
                    username: string;
                };
                Update: {
                    created_at?: string | null;
                    id?: string;
                    name?: string;
                    profile_photo?: string | null;
                    username?: string;
                };
                Relationships: [];
            };
        };
        Views: {
            formatted_pubs: {
                Row: {
                    address: string | null;
                    beer_garden: boolean | null;
                    dart_board: boolean | null;
                    description: string | null;
                    dog_friendly: boolean | null;
                    foosball_table: boolean | null;
                    free_wifi: boolean | null;
                    google_id: string | null;
                    id: number | null;
                    kid_friendly: boolean | null;
                    live_sport: boolean | null;
                    location: string | null;
                    name: string | null;
                    negative_review_beer_amount: number | null;
                    negative_review_food_amount: number | null;
                    negative_review_location_amount: number | null;
                    negative_review_music_amount: number | null;
                    negative_review_service_amount: number | null;
                    negative_review_vibe_amount: number | null;
                    num_reviews: number | null;
                    opening_hours: Json | null;
                    phone_number: string | null;
                    photos: string[] | null;
                    pool_table: boolean | null;
                    rating: number | null;
                    reservable: boolean | null;
                    review_beer_amount: number | null;
                    review_eights: number | null;
                    review_fives: number | null;
                    review_food_amount: number | null;
                    review_fours: number | null;
                    review_location_amount: number | null;
                    review_music_amount: number | null;
                    review_nines: number | null;
                    review_ones: number | null;
                    review_service_amount: number | null;
                    review_sevens: number | null;
                    review_sixes: number | null;
                    review_tens: number | null;
                    review_threes: number | null;
                    review_twos: number | null;
                    review_vibe_amount: number | null;
                    rooftop: boolean | null;
                    saved: boolean | null;
                    website: string | null;
                    wheelchair_accessible: boolean | null;
                };
                Relationships: [];
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
                    user_profile_photo: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'comments_review_id_fkey';
                        columns: ['review_id'];
                        isOneToOne: false;
                        referencedRelation: 'reviews';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'comments_review_id_fkey';
                        columns: ['review_id'];
                        isOneToOne: false;
                        referencedRelation: 'user_reviews';
                        referencedColumns: ['id'];
                    },
                ];
            };
            user_reviews: {
                Row: {
                    beer: boolean | null;
                    content: string | null;
                    created_at: string | null;
                    editors_review: boolean | null;
                    food: boolean | null;
                    id: number | null;
                    liked: boolean | null;
                    likes: number | null;
                    location: boolean | null;
                    music: boolean | null;
                    pub_address: string | null;
                    pub_id: number | null;
                    pub_name: string | null;
                    pub_primary_photo: string | null;
                    rating: number | null;
                    service: boolean | null;
                    updated_at: string | null;
                    user_id: string | null;
                    user_name: string | null;
                    user_profile_photo: string | null;
                    username: string | null;
                    vibe: boolean | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'reviews_pub_id_fkey';
                        columns: ['pub_id'];
                        isOneToOne: false;
                        referencedRelation: 'formatted_pubs';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'reviews_pub_id_fkey';
                        columns: ['pub_id'];
                        isOneToOne: false;
                        referencedRelation: 'pubs';
                        referencedColumns: ['id'];
                    },
                ];
            };
        };
        Functions: {
            create_user: {
                Args: {
                    email: string;
                    password: string;
                };
                Returns: string;
            };
            get_pub: {
                Args: {
                    dist_long: number;
                    dist_lat: number;
                };
                Returns: {
                    address: string;
                    beer_garden: boolean | null;
                    dart_board: boolean | null;
                    description: string;
                    dist_meters: number;
                    dog_friendly: boolean | null;
                    foosball_table: boolean | null;
                    free_wifi: boolean | null;
                    google_id: string;
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
                    rating: number;
                    reservable: boolean | null;
                    review_beer_amount: number;
                    review_eights: number;
                    review_fives: number;
                    review_food_amount: number;
                    review_fours: number;
                    review_location_amount: number;
                    review_music_amount: number;
                    review_negative_beer_amount: number;
                    review_negative_food_amount: number;
                    review_negative_location_amount: number;
                    review_negative_music_amount: number;
                    review_negative_service_amount: number;
                    review_negative_vibe_amount: number;
                    review_nines: number;
                    review_ones: number;
                    review_service_amount: number;
                    review_sevens: number;
                    review_sixes: number;
                    review_tens: number;
                    review_threes: number;
                    review_twos: number;
                    review_vibe_amount: number;
                    rooftop: boolean | null;
                    saved: boolean;
                    website: string;
                    wheelchair_accessible: boolean | null;
                }[];
            };
            get_pub_list_item: {
                Args: {
                    lat: number;
                    long: number;
                };
                Returns: {
                    id: number;
                    name: string;
                    address: string;
                    saved: boolean;
                    rating: number;
                    num_reviews: number;
                    dist_meters: number;
                    photos: string[];
                    primary_photo: string;
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
                    description: string;
                    dist_meters: number;
                    dog_friendly: boolean | null;
                    foosball_table: boolean | null;
                    free_wifi: boolean | null;
                    google_id: string;
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
                    rating: number;
                    reservable: boolean | null;
                    review_beer_amount: number;
                    review_eights: number;
                    review_fives: number;
                    review_food_amount: number;
                    review_fours: number;
                    review_location_amount: number;
                    review_music_amount: number;
                    review_negative_beer_amount: number;
                    review_negative_food_amount: number;
                    review_negative_location_amount: number;
                    review_negative_music_amount: number;
                    review_negative_service_amount: number;
                    review_negative_vibe_amount: number;
                    review_nines: number;
                    review_ones: number;
                    review_service_amount: number;
                    review_sevens: number;
                    review_sixes: number;
                    review_tens: number;
                    review_threes: number;
                    review_twos: number;
                    review_vibe_amount: number;
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
                    description: string;
                    dist_meters: number;
                    dog_friendly: boolean | null;
                    foosball_table: boolean | null;
                    free_wifi: boolean | null;
                    google_id: string;
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
                    rating: number;
                    reservable: boolean | null;
                    review_beer_amount: number;
                    review_eights: number;
                    review_fives: number;
                    review_food_amount: number;
                    review_fours: number;
                    review_location_amount: number;
                    review_music_amount: number;
                    review_negative_beer_amount: number;
                    review_negative_food_amount: number;
                    review_negative_location_amount: number;
                    review_negative_music_amount: number;
                    review_negative_service_amount: number;
                    review_negative_vibe_amount: number;
                    review_nines: number;
                    review_ones: number;
                    review_service_amount: number;
                    review_sevens: number;
                    review_sixes: number;
                    review_tens: number;
                    review_threes: number;
                    review_twos: number;
                    review_vibe_amount: number;
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
                    allowed_mime_types: string[] | null;
                    avif_autodetection: boolean | null;
                    created_at: string | null;
                    file_size_limit: number | null;
                    id: string;
                    name: string;
                    owner: string | null;
                    owner_id: string | null;
                    public: boolean | null;
                    updated_at: string | null;
                };
                Insert: {
        