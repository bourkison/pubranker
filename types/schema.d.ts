export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      beer_pub_relationships: {
        Row: {
          beer_id: number
          created_at: string | null
          id: number
          pub_id: number
        }
        Insert: {
          beer_id: number
          created_at?: string | null
          id?: number
          pub_id: number
        }
        Update: {
          beer_id?: number
          created_at?: string | null
          id?: number
          pub_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "beer_pub_relationships_beer_id_fkey"
            columns: ["beer_id"]
            isOneToOne: false
            referencedRelation: "beers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beer_pub_relationships_pub_id_fkey"
            columns: ["pub_id"]
            isOneToOne: false
            referencedRelation: "formatted_pubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beer_pub_relationships_pub_id_fkey"
            columns: ["pub_id"]
            isOneToOne: false
            referencedRelation: "pubs"
            referencedColumns: ["id"]
          },
        ]
      }
      beers: {
        Row: {
          brewery: string
          created_at: string | null
          id: number
          logo: string | null
          name: string
          type: string
        }
        Insert: {
          brewery: string
          created_at?: string | null
          id?: number
          logo?: string | null
          name: string
          type: string
        }
        Update: {
          brewery?: string
          created_at?: string | null
          id?: number
          logo?: string | null
          name?: string
          type?: string
        }
        Relationships: []
      }
      collection_follows: {
        Row: {
          collection_id: number
          created_at: string
          id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          collection_id: number
          created_at?: string
          id?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          collection_id?: number
          created_at?: string
          id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_follows_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_follows_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_public"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_items: {
        Row: {
          collection_id: number
          created_at: string
          id: number
          pub_id: number
          user_id: string
        }
        Insert: {
          collection_id?: number
          created_at?: string
          id?: number
          pub_id?: number
          user_id?: string
        }
        Update: {
          collection_id?: number
          created_at?: string
          id?: number
          pub_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_items_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_items_pub_id_fkey"
            columns: ["pub_id"]
            isOneToOne: false
            referencedRelation: "formatted_pubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_items_pub_id_fkey"
            columns: ["pub_id"]
            isOneToOne: false
            referencedRelation: "pubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_public"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          collaborative: boolean
          created_at: string
          description: string | null
          id: number
          name: string
          public: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          collaborative?: boolean
          created_at?: string
          description?: string | null
          id?: number
          name: string
          public?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          collaborative?: boolean
          created_at?: string
          description?: string | null
          id?: number
          name?: string
          public?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collections_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_public"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_likes: {
        Row: {
          comment_id: number
          created_at: string
          id: number
          user_id: string
        }
        Insert: {
          comment_id: number
          created_at?: string
          id?: number
          user_id?: string
        }
        Update: {
          comment_id?: number
          created_at?: string
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: number
          review_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: number
          review_id: number
          updated_at?: string
          user_id?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: number
          review_id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_public"
            referencedColumns: ["id"]
          },
        ]
      }
      opening_hours: {
        Row: {
          close_day: number
          close_hour: string
          id: number
          open_day: number
          open_hour: string
          pub_id: number
        }
        Insert: {
          close_day: number
          close_hour: string
          id?: number
          open_day: number
          open_hour: string
          pub_id: number
        }
        Update: {
          close_day?: number
          close_hour?: string
          id?: number
          open_day?: number
          open_hour?: string
          pub_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "opening_hours_pub_id_fkey"
            columns: ["pub_id"]
            isOneToOne: false
            referencedRelation: "formatted_pubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opening_hours_pub_id_fkey"
            columns: ["pub_id"]
            isOneToOne: false
            referencedRelation: "pubs"
            referencedColumns: ["id"]
          },
        ]
      }
      pub_photos: {
        Row: {
          admin: boolean
          created_at: string | null
          id: number
          key: string
          pub_id: number
          user_id: string | null
        }
        Insert: {
          admin?: boolean
          created_at?: string | null
          id?: number
          key: string
          pub_id: number
          user_id?: string | null
        }
        Update: {
          admin?: boolean
          created_at?: string | null
          id?: number
          key?: string
          pub_id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pub_photos_pub_id_fkey"
            columns: ["pub_id"]
            isOneToOne: false
            referencedRelation: "formatted_pubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pub_photos_pub_id_fkey"
            columns: ["pub_id"]
            isOneToOne: false
            referencedRelation: "pubs"
            referencedColumns: ["id"]
          },
        ]
      }
      pub_schema: {
        Row: {
          address: string
          beer_garden: boolean | null
          dart_board: boolean | null
          description: string
          dist_meters: number
          dog_friendly: boolean | null
          foosball_table: boolean | null
          free_wifi: boolean | null
          google_id: string
          id: number
          kid_friendly: boolean | null
          live_sport: boolean | null
          location: string
          name: string
          num_reviews: number
          opening_hours: Json
          phone_number: string
          photos: string[]
          pool_table: boolean | null
          rating: number
          reservable: boolean | null
          review_beer_amount: number
          review_eights: number
          review_fives: number
          review_food_amount: number
          review_fours: number
          review_location_amount: number
          review_music_amount: number
          review_negative_beer_amount: number
          review_negative_food_amount: number
          review_negative_location_amount: number
          review_negative_music_amount: number
          review_negative_service_amount: number
          review_negative_vibe_amount: number
          review_nines: number
          review_ones: number
          review_service_amount: number
          review_sevens: number
          review_sixes: number
          review_tens: number
          review_threes: number
          review_twos: number
          review_vibe_amount: number
          rooftop: boolean | null
          saved: boolean
          website: string
          wheelchair_accessible: boolean | null
        }
        Insert: {
          address: string
          beer_garden?: boolean | null
          dart_board?: boolean | null
          description: string
          dist_meters: number
          dog_friendly?: boolean | null
          foosball_table?: boolean | null
          free_wifi?: boolean | null
          google_id: string
          id: number
          kid_friendly?: boolean | null
          live_sport?: boolean | null
          location: string
          name: string
          num_reviews: number
          opening_hours: Json
          phone_number: string
          photos: string[]
          pool_table?: boolean | null
          rating: number
          reservable?: boolean | null
          review_beer_amount: number
          review_eights: number
          review_fives: number
          review_food_amount: number
          review_fours: number
          review_location_amount: number
          review_music_amount: number
          review_negative_beer_amount: number
          review_negative_food_amount: number
          review_negative_location_amount: number
          review_negative_music_amount: number
          review_negative_service_amount: number
          review_negative_vibe_amount: number
          review_nines: number
          review_ones: number
          review_service_amount: number
          review_sevens: number
          review_sixes: number
          review_tens: number
          review_threes: number
          review_twos: number
          review_vibe_amount: number
          rooftop?: boolean | null
          saved: boolean
          website: string
          wheelchair_accessible?: boolean | null
        }
        Update: {
          address?: string
          beer_garden?: boolean | null
          dart_board?: boolean | null
          description?: string
          dist_meters?: number
          dog_friendly?: boolean | null
          foosball_table?: boolean | null
          free_wifi?: boolean | null
          google_id?: string
          id?: number
          kid_friendly?: boolean | null
          live_sport?: boolean | null
          location?: string
          name?: string
          num_reviews?: number
          opening_hours?: Json
          phone_number?: string
          photos?: string[]
          pool_table?: boolean | null
          rating?: number
          reservable?: boolean | null
          review_beer_amount?: number
          review_eights?: number
          review_fives?: number
          review_food_amount?: number
          review_fours?: number
          review_location_amount?: number
          review_music_amount?: number
          review_negative_beer_amount?: number
          review_negative_food_amount?: number
          review_negative_location_amount?: number
          review_negative_music_amount?: number
          review_negative_service_amount?: number
          review_negative_vibe_amount?: number
          review_nines?: number
          review_ones?: number
          review_service_amount?: number
          review_sevens?: number
          review_sixes?: number
          review_tens?: number
          review_threes?: number
          review_twos?: number
          review_vibe_amount?: number
          rooftop?: boolean | null
          saved?: boolean
          website?: string
          wheelchair_accessible?: boolean | null
        }
        Relationships: []
      }
      pubs: {
        Row: {
          address: string
          beer_garden: boolean | null
          brewery: boolean | null
          created_at: string
          dart_board: boolean | null
          description: string
          dog_friendly: boolean | null
          foosball_table: boolean | null
          free_wifi: boolean | null
          google_id: string
          hidden: boolean
          id: number
          kid_friendly: boolean | null
          live_sport: boolean | null
          location: unknown
          name: string
          phone_number: string | null
          pool_table: boolean | null
          primary_photo: string | null
          reservable: boolean | null
          rooftop: boolean | null
          updated_at: string
          website: string
          wheelchair_accessible: boolean | null
        }
        Insert: {
          address: string
          beer_garden?: boolean | null
          brewery?: boolean | null
          created_at?: string
          dart_board?: boolean | null
          description: string
          dog_friendly?: boolean | null
          foosball_table?: boolean | null
          free_wifi?: boolean | null
          google_id: string
          hidden?: boolean
          id?: number
          kid_friendly?: boolean | null
          live_sport?: boolean | null
          location: unknown
          name: string
          phone_number?: string | null
          pool_table?: boolean | null
          primary_photo?: string | null
          reservable?: boolean | null
          rooftop?: boolean | null
          updated_at?: string
          website: string
          wheelchair_accessible?: boolean | null
        }
        Update: {
          address?: string
          beer_garden?: boolean | null
          brewery?: boolean | null
          created_at?: string
          dart_board?: boolean | null
          description?: string
          dog_friendly?: boolean | null
          foosball_table?: boolean | null
          free_wifi?: boolean | null
          google_id?: string
          hidden?: boolean
          id?: number
          kid_friendly?: boolean | null
          live_sport?: boolean | null
          location?: unknown
          name?: string
          phone_number?: string | null
          pool_table?: boolean | null
          primary_photo?: string | null
          reservable?: boolean | null
          rooftop?: boolean | null
          updated_at?: string
          website?: string
          wheelchair_accessible?: boolean | null
        }
        Relationships: []
      }
      review_likes: {
        Row: {
          created_at: string
          id: number
          review_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          review_id: number
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          review_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_likes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          beer: boolean | null
          content: string | null
          created_at: string
          editors_review: boolean
          food: boolean | null
          id: number
          location: boolean | null
          music: boolean | null
          pub_id: number
          rating: number
          service: boolean | null
          updated_at: string | null
          user_id: string
          vibe: boolean | null
        }
        Insert: {
          beer?: boolean | null
          content?: string | null
          created_at?: string
          editors_review?: boolean
          food?: boolean | null
          id?: number
          location?: boolean | null
          music?: boolean | null
          pub_id: number
          rating: number
          service?: boolean | null
          updated_at?: string | null
          user_id?: string
          vibe?: boolean | null
        }
        Update: {
          beer?: boolean | null
          content?: string | null
          created_at?: string
          editors_review?: boolean
          food?: boolean | null
          id?: number
          location?: boolean | null
          music?: boolean | null
          pub_id?: number
          rating?: number
          service?: boolean | null
          updated_at?: string | null
          user_id?: string
          vibe?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_pub_id_fkey"
            columns: ["pub_id"]
            isOneToOne: false
            referencedRelation: "formatted_pubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_pub_id_fkey"
            columns: ["pub_id"]
            isOneToOne: false
            referencedRelation: "pubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_public"
            referencedColumns: ["id"]
          },
        ]
      }
      saves: {
        Row: {
          created_at: string | null
          id: number
          pub_id: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          pub_id: number
          user_id?: string
        }
        Update: {
          created_at?: string | null
          id?: number
          pub_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saves_pub_id_fkey"
            columns: ["pub_id"]
            isOneToOne: false
            referencedRelation: "formatted_pubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saves_pub_id_fkey"
            columns: ["pub_id"]
            isOneToOne: false
            referencedRelation: "pubs"
            referencedColumns: ["id"]
          },
        ]
      }
      users_public: {
        Row: {
          created_at: string | null
          id: string
          name: string
          profile_photo: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          id: string
          name: string
          profile_photo?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          profile_photo?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      formatted_pubs: {
        Row: {
          address: string | null
          beer_garden: boolean | null
          dart_board: boolean | null
          description: string | null
          dog_friendly: boolean | null
          foosball_table: boolean | null
          free_wifi: boolean | null
          google_id: string | null
          id: number | null
          kid_friendly: boolean | null
          live_sport: boolean | null
          location: string | null
          name: string | null
          negative_review_beer_amount: number | null
          negative_review_food_amount: number | null
          negative_review_location_amount: number | null
          negative_review_music_amount: number | null
          negative_review_service_amount: number | null
          negative_review_vibe_amount: number | null
          num_reviews: number | null
          opening_hours: Json | null
          phone_number: string | null
          photos: string[] | null
          pool_table: boolean | null
          rating: number | null
          reservable: boolean | null
          review_beer_amount: number | null
          review_eights: number | null
          review_fives: number | null
          review_food_amount: number | null
          review_fours: number | null
          review_location_amount: number | null
          review_music_amount: number | null
          review_nines: number | null
          review_ones: number | null
          review_service_amount: number | null
          review_sevens: number | null
          review_sixes: number | null
          review_tens: number | null
          review_threes: number | null
          review_twos: number | null
          review_vibe_amount: number | null
          rooftop: boolean | null
          saved: boolean | null
          website: string | null
          wheelchair_accessible: boolean | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_user: {
        Args: {
          email: string
          password: string
        }
        Returns: string
      }
      get_pub: {
        Args: {
          dist_long: number
          dist_lat: number
        }
        Returns: {
          address: string
          beer_garden: boolean | null
          dart_board: boolean | null
          description: string
          dist_meters: number
          dog_friendly: boolean | null
          foosball_table: boolean | null
          free_wifi: boolean | null
          google_id: string
          id: number
          kid_friendly: boolean | null
          live_sport: boolean | null
          location: string
          name: string
          num_reviews: number
          opening_hours: Json
          phone_number: string
          photos: string[]
          pool_table: boolean | null
          rating: number
          reservable: boolean | null
          review_beer_amount: number
          review_eights: number
          review_fives: number
          review_food_amount: number
          review_fours: number
          review_location_amount: number
          review_music_amount: number
          review_negative_beer_amount: number
          review_negative_food_amount: number
          review_negative_location_amount: number
          review_negative_music_amount: number
          review_negative_service_amount: number
          review_negative_vibe_amount: number
          review_nines: number
          review_ones: number
          review_service_amount: number
          review_sevens: number
          review_sixes: number
          review_tens: number
          review_threes: number
          review_twos: number
          review_vibe_amount: number
          rooftop: boolean | null
          saved: boolean
          website: string
          wheelchair_accessible: boolean | null
        }[]
      }
      get_pub_list_item: {
        Args: {
          lat: number
          long: number
        }
        Returns: {
          id: number
          name: string
          address: string
          saved: boolean
          rating: number
          num_reviews: number
          dist_meters: number
          photos: string[]
          primary_photo: string
        }[]
      }
      nearby_pubs: {
        Args: {
          order_lat: number
          order_long: number
          dist_lat: number
          dist_long: number
        }
        Returns: {
          address: string
          beer_garden: boolean | null
          dart_board: boolean | null
          description: string
          dist_meters: number
          dog_friendly: boolean | null
          foosball_table: boolean | null
          free_wifi: boolean | null
          google_id: string
          id: number
          kid_friendly: boolean | null
          live_sport: boolean | null
          location: string
          name: string
          num_reviews: number
          opening_hours: Json
          phone_number: string
          photos: string[]
          pool_table: boolean | null
          rating: number
          reservable: boolean | null
          review_beer_amount: number
          review_eights: number
          review_fives: number
          review_food_amount: number
          review_fours: number
          review_location_amount: number
          review_music_amount: number
          review_negative_beer_amount: number
          review_negative_food_amount: number
          review_negative_location_amount: number
          review_negative_music_amount: number
          review_negative_service_amount: number
          review_negative_vibe_amount: number
          review_nines: number
          review_ones: number
          review_service_amount: number
          review_sevens: number
          review_sixes: number
          review_tens: number
          review_threes: number
          review_twos: number
          review_vibe_amount: number
          rooftop: boolean | null
          saved: boolean
          website: string
          wheelchair_accessible: boolean | null
        }[]
      }
      pubs_in_polygon: {
        Args: {
          geojson: string
          dist_long: number
          dist_lat: number
        }
        Returns: {
          address: string
          beer_garden: boolean | null
          dart_board: boolean | null
          description: string
          dist_meters: number
          dog_friendly: boolean | null
          foosball_table: boolean | null
          free_wifi: boolean | null
          google_id: string
          id: number
          kid_friendly: boolean | null
          live_sport: boolean | null
          location: string
          name: string
          num_reviews: number
          opening_hours: Json
          phone_number: string
          photos: string[]
          pool_table: boolean | null
          rating: number
          reservable: boolean | null
          review_beer_amount: number
          review_eights: number
          review_fives: number
          review_food_amount: number
          review_fours: number
          review_location_amount: number
          review_music_amount: number
          review_negative_beer_amount: number
          review_negative_food_amount: number
          review_negative_location_amount: number
          review_negative_music_amount: number
          review_negative_service_amount: number
          review_negative_vibe_amount: number
          review_nines: number
          review_ones: number
          review_service_amount: number
          review_sevens: number
          review_sixes: number
          review_tens: number
          review_threes: number
          review_twos: number
          review_vibe_amount: number
          rooftop: boolean | null
          saved: boolean
          website: string
          wheelchair_accessible: boolean | null
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      operation: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

