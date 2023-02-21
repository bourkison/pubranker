type OpeningHoursObject = {
    day: number;
    time: string;
};

export type PubType = {
    id: number;
    name: string;
    address: string;
    location: { lng: number; lat: number };
    opening_hours: { open: OpeningHoursObject; close: OpeningHoursObject }[];
    phone_number: string;
    google_overview: string;
    google_photos: string[];
    google_rating: number;
    google_ratings_amount: number;
    google_id: string;
    reservable: boolean;
    website: string;
    photos: string[];
};
