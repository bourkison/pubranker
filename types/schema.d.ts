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
      collection_collaborations: {
        Row: {
          collection_id: number
          created_at: string
          id: number
          user_id: string
        }
        Insert: {
          collection_id: number
          created_at?: string
          id?: number
          user_id: string
        }
        Update: {
          collection_id?: number
          created_at?: string
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_collaborations_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_collaborations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_public"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_follows: {
        Row: {
          collection_id: number
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          collection_id: number
          created_at?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          collection_id?: number
          created_at?: string
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
          order: number
          pub_id: number
          user_id: string
        }
        Insert: {
          collection_id?: number
          created_at?: string
          id?: number
          order?: number
          pub_id?: number
          user_id?: string
        }
        Update: {
          collection_id?: number
          created_at?: string
          id?: number
          order?: number
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
      collection_likes: {
        Row: {
          collection_id: number
          created_at: string
          user_id: string
        }
        Insert: {
          collection_id: number
          created_at?: string
          user_id?: string
        }
        Update: {
          collection_id?: number
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_likes_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_likes_user_id_fkey"
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
          public: Database["public"]["Enums"]["collection_privacy_type"]
          ranked: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          collaborative?: boolean
          created_at?: string
          description?: string | null
          id?: number
          name: string
          public?: Database["public"]["Enums"]["collection_privacy_type"]
          ranked?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          collaborative?: boolean
          created_at?: string
          description?: string | null
          id?: number
          name?: string
          public?: Database["public"]["Enums"]["collection_privacy_type"]
          ranked?: boolean
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
      favourites: {
        Row: {
          created_at: string
          id: number
          order: number
          pub_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          order?: number
          pub_id: number
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          order?: number
          pub_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favourites_pub_id_fkey"
            columns: ["pub_id"]
            isOneToOne: false
            referencedRelation: "pubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favourites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_public"
            referencedColumns: ["id"]
          },
        ]
      }
      feed: {
        Row: {
          created_at: string
          follow_id: number | null
          id: number
          review_id: number | null
          review_like_id: number | null
          type: Database["public"]["Enums"]["feed_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          follow_id?: number | null
          id?: number
          review_id?: number | null
          review_like_id?: number | null
          type: Database["public"]["Enums"]["feed_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          follow_id?: number | null
          id?: number
          review_id?: number | null
          review_like_id?: number | null
          type?: Database["public"]["Enums"]["feed_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_follow_id_fkey"
            columns: ["follow_id"]
            isOneToOne: false
            referencedRelation: "follows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_review_like_id_fkey"
            columns: ["review_like_id"]
            isOneToOne: false
            referencedRelation: "review_likes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_public"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string
          created_by: string
          id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          id?: number
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_user_id_fkey"
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
            referencedRelation: "pubs"
            referencedColumns: ["id"]
          },
        ]
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
          updated_at: string
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
          updated_at?: string
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
          updated_at?: string
          user_id?: string
          vibe?: boolean | null
        }
        Relationships: [
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
            referencedRelation: "pubs"
            referencedColumns: ["id"]
          },
        ]
      }
      suggestions: {
        Row: {
          accepted: boolean
          created_at: string
          id: number
          pub_id: number
          type: Database["public"]["Enums"]["suggestion_type"]
          user_id: string
          value: boolean
        }
        Insert: {
          accepted?: boolean
          created_at?: string
          id?: number
          pub_id: number
          type: Database["public"]["Enums"]["suggestion_type"]
          user_id?: string
          value: boolean
        }
        Update: {
          accepted?: boolean
          created_at?: string
          id?: number
          pub_id?: number
          type?: Database["public"]["Enums"]["suggestion_type"]
          user_id?: string
          value?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "suggestions_pub_id_fkey"
            columns: ["pub_id"]
            isOneToOne: false
            referencedRelation: "pubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suggestions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_public"
            referencedColumns: ["id"]
          },
        ]
      }
      users_public: {
        Row: {
          bio: string
          created_at: string | null
          id: string
          location: string
          name: string
          profile_photo: string
          username: string
        }
        Insert: {
          bio?: string
          created_at?: string | null
          id: string
          location?: string
          name: string
          profile_photo?: string
          username: string
        }
        Update: {
          bio?: string
          created_at?: string | null
          id?: string
          location?: string
          name?: string
          profile_photo?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_user: {
        Args: {
          email: string
          password: string
        }
        Returns: string
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
          location: string
        }[]
      }
      get_pub_location: {
        Args: {
          pub: unknown
        }
        Returns: Json
      }
      get_pub_rating: {
        Args: {
          pub: unknown
        }
        Returns: number
      }
      get_pubs_in_polygon: {
        Args: {
          geojson: string
          dist_long: number
          dist_lat: number
        }
        Returns: {
          id: number
          name: string
          address: string
          primary_photo: string
          reservable: boolean
          dog_friendly: boolean
          live_sport: boolean
          pool_table: boolean
          dart_board: boolean
          beer_garden: boolean
          kid_friendly: boolean
          free_wifi: boolean
          rooftop: boolean
          foosball_table: boolean
          wheelchair_accessible: boolean
          rating: number
          location: string
          dist_meters: number
          num_reviews: number
        }[]
      }
      get_pubs_with_distances: {
        Args: {
          order_lat: number
          order_long: number
          dist_lat: number
          dist_long: number
        }
        Returns: {
          id: number
          name: string
          address: string
          phone_number: string
          website: string
          primary_photo: string
          location: string
          description: string
          reservable: boolean
          dog_friendly: boolean
          live_sport: boolean
          pool_table: boolean
          dart_board: boolean
          beer_garden: boolean
          kid_friendly: boolean
          free_wifi: boolean
          rooftop: boolean
          foosball_table: boolean
          wheelchair_accessible: boolean
          num_reviews: number
          saved: boolean
          dist_meters: number
          rating: number
          photos: string[]
        }[]
      }
      validate_favourites_limit_three: {
        Args: {
          u_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      collection_privacy_type: "PUBLIC" | "FRIENDS_ONLY" | "PRIVATE"
      feed_type: "REVIEW" | "REVIEW_LIKE" | "FOLLOW"
      suggestion_type:
        | "RESERVABLE"
        | "FREE_WIFI"
        | "DOG_FRIENDLY"
        | "KID_FRIENDLY"
        | "ROOFTOP"
        | "GARDEN"
        | "POOL_TABLE"
        | "DARTS"
        | "FOOSBALL"
        | "LIVE_SPORT"
        | "WHEELCHAIR_ACCESSIBLE"
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

