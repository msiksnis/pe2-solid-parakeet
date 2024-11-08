import { z } from "zod";

const MediaSchema = z.object({
  url: z.string().url(),
  alt: z.string(),
});

const MetaSchema = z.object({
  wifi: z.boolean().optional().default(false),
  parking: z.boolean().optional().default(false),
  breakfast: z.boolean().optional().default(false),
  pets: z.boolean().optional().default(false),
});

const LocationSchema = z.object({
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  zip: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  continent: z.string().nullable().optional(),
  lat: z
    .number({ invalid_type_error: "Latitude must be a valid number" })
    .optional()
    .or(z.literal(null))
    .refine(
      (val) => val === undefined || val === null || (val >= -90 && val <= 90),
      {
        message: "Latitude must be between -90 and 90",
      },
    ),
  lng: z
    .number({ invalid_type_error: "Longitude must be a valid number" })
    .optional()
    .or(z.literal(null))
    .refine(
      (val) => val === undefined || val === null || (val >= -180 && val <= 180),
      {
        message: "Longitude must be between -180 and 180",
      },
    ),
});

export const VenueSchema = z.object({
  name: z.string().min(1, "Add a name for the venue"),
  description: z.string().trim().min(1, "Add a description"),
  media: z.array(MediaSchema).optional(),
  price: z
    .number({ invalid_type_error: "Price must be a valid number" })
    .positive("Price must be greater than 0")
    .optional()
    .refine((val) => val !== undefined, "Price is required"),
  maxGuests: z.coerce
    .number({ invalid_type_error: "Must be specified" })
    .min(1, "Specify the maximum number of guests"),
  rating: z.number().optional().default(0),
  meta: MetaSchema.optional(),
  location: LocationSchema.optional(),
});

export type Venue = z.infer<typeof VenueSchema>;

export const defaultValues = {
  name: "",
  description: "",
  media: [
    {
      url: "",
      alt: "",
    },
  ],
  price: undefined,
  maxGuests: undefined,
  meta: {
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false,
  },
  location: {
    address: "",
    city: "",
    zip: "",
    country: "",
    continent: "",
    lat: null,
    lng: null,
  },
};
