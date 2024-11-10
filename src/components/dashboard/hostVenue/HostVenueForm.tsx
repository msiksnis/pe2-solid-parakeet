import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ImageIcon, LoaderCircle, PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import Loader from "@/components/loader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { fetchVenueById } from "@/components/venueById/queries/fetchVenueById";
import { useAuthData } from "@/hooks/useAuthData";
import { useVenueStore } from "@/hooks/useVenueStore";
import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { Input } from "../../ui/input";
import { AutosizeTextarea } from "../../ui/textarea";
import { useFocusStates } from "./hooks/useFocusStates";
import { useImagePreview } from "./hooks/useImagePreview";
import { useVenueMutation } from "./mutations/useVenueMutation";
import { defaultValues, Venue, VenueSchema } from "./VenueValidation";
import { useDeleteVenueMutation } from "./mutations/useDeleteVenueMutation";
import AlertModal from "@/components/alert-modal";

export default function HostVenueForm() {
  const [openAlertModal, setOpenAlertModal] = useState(false);

  const { id } = useParams({
    from: "/_authenticated/manage-venues/host-venue/$id",
  });
  const navigate = useNavigate();

  const { selectedVenue } = useVenueStore();

  const { userName } = useAuthData();
  const isCreating = id === "new-venue";

  const { focusStates, handleFocus } = useFocusStates<
    | "name"
    | "description"
    | `media-${number}-url`
    | `media-${number}-alt`
    | "price"
    | "maxGuests"
    | "address"
    | "zip"
    | "city"
    | "country"
    | "continent"
    | "lat"
    | "lng"
  >();

  const form = useForm<Venue>({
    resolver: zodResolver(VenueSchema),
    defaultValues,
  });

  const { control, handleSubmit, formState, reset } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "media",
  });

  // React Query for fetching venue
  const { data: venue, isPending: isFetchingData } = useQuery<Venue>({
    queryKey: ["venue", id],
    queryFn: () =>
      id && id !== "new-venue"
        ? fetchVenueById(id)
        : Promise.reject(new Error("No valid ID provided")),
    enabled: !isCreating, // Only fetch if editing mode
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (venue && !isCreating) {
      reset({
        ...venue,
        location: {
          ...venue.location,
          lat: venue.location?.lat === 0 ? null : venue.location?.lat,
          lng: venue.location?.lng === 0 ? null : venue.location?.lng,
        },
      });
    } else if (isCreating) {
      reset(defaultValues);
    }
  }, [venue, isCreating, reset]);

  const mutation = useVenueMutation();
  const { mutate: deleteVenue, isPending: isDeleting } =
    useDeleteVenueMutation();

  const onSubmit = (data: Venue) => {
    mutation.mutate(
      {
        isUpdate: !isCreating,
        venueId: !isCreating ? id : undefined,
        data,
      },
      {
        onSuccess: () => {
          navigate({ to: "/manage-venues" });
        },
      },
    );
  };

  // Prevent unauthorized access
  if (!isCreating && selectedVenue && selectedVenue?.owner?.name !== userName) {
    return (
      <div className="my-24 flex justify-center text-2xl">
        You are not the owner of this venue!
      </div>
    );
  }

  if (!isCreating && isFetchingData) return <Loader className="mt-24" />;

  const handleDelete = () => {
    deleteVenue(id, {
      onSuccess: () => {
        setOpenAlertModal(false);
        navigate({ to: "/manage-venues" });
      },
    });
  };

  return (
    <>
      <AlertModal
        isOpen={openAlertModal}
        onClose={() => setOpenAlertModal(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
      />
      <div className="mx-auto my-10 max-w-2xl px-4 md:px-0">
        <h1 className="text-3xl font-semibold">
          {isCreating ? "Create Venue" : "Edit Venue"}
        </h1>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="my-6 space-y-6">
            <div className="space-y-8">
              {/* Name Field */}
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem
                    className={cn(
                      "relative h-14 space-y-0 rounded-md border border-gray-400 transition-all duration-300",
                      {
                        "border-primary ring-2 ring-primary ring-offset-2 ring-offset-card":
                          focusStates["name"],
                      },
                      {
                        "border-destructive": formState.errors.name,
                      },
                      {
                        "ring-2 ring-destructive ring-offset-2":
                          formState.errors.name && focusStates["name"],
                      },
                    )}
                  >
                    <FormLabel
                      className={cn(
                        "absolute left-3 text-lg text-muted-foreground transition-all",
                        focusStates["name"] || field.value
                          ? "top-1.5 text-sm"
                          : "top-3.5",
                      )}
                    >
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onFocus={() => handleFocus("name", true)}
                        onBlur={() => handleFocus("name", false)}
                        className="h-full rounded-md border-transparent pt-5 text-lg shadow-none focus-visible:ring-0"
                      />
                    </FormControl>
                    <FormMessage className="absolute -bottom-6 left-0 pl-1 pt-0.5" />
                  </FormItem>
                )}
              />

              {/* Description Field */}
              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem
                    className={cn(
                      "relative space-y-0 rounded-md border border-gray-400 transition-all duration-300",
                      {
                        "border-primary ring-2 ring-primary ring-offset-2 ring-offset-card":
                          focusStates["description"],
                      },
                      {
                        "border-destructive": formState.errors.description,
                      },
                      {
                        "ring-2 ring-destructive ring-offset-2":
                          formState.errors.description &&
                          focusStates["description"],
                      },
                    )}
                  >
                    <FormLabel
                      className={cn(
                        "absolute left-3 text-lg text-muted-foreground transition-all",
                        focusStates["description"] || field.value
                          ? "top-1.5 text-sm"
                          : "top-3.5",
                      )}
                    >
                      Description
                    </FormLabel>
                    <FormControl>
                      <AutosizeTextarea
                        {...field}
                        onFocus={() => handleFocus("description", true)}
                        onBlur={() => handleFocus("description", false)}
                        className="min-h-14 resize-none rounded-md border-transparent pt-5 !text-lg !leading-6 shadow-none focus-visible:ring-0"
                      />
                    </FormControl>
                    <FormMessage className="absolute -bottom-6 left-0 pl-1 pt-0.5" />
                  </FormItem>
                )}
              />

              {/* Dynamic Media Fields */}
              <div>
                <h2 className="mb-2 text-lg font-medium">Images</h2>
                <div className="space-y-4">
                  {fields.map((mediaField, index) => (
                    <div
                      key={mediaField.id}
                      className="flex w-full flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0"
                    >
                      {/* URL Field */}
                      <div className="flex-1">
                        <FormField
                          control={control}
                          name={`media.${index}.url`}
                          render={({ field }) => {
                            const {
                              imagePreview,
                              isLoading,
                              handleImageChange,
                            } = useImagePreview(field.value);

                            return (
                              <FormItem
                                className={cn(
                                  "relative mr-[4.25rem] flex items-center space-x-4 rounded-md border border-gray-400 transition-all duration-300",
                                  {
                                    "border-primary ring-2 ring-primary ring-offset-2 ring-offset-card":
                                      focusStates[`media-${index}-url`],
                                  },
                                )}
                              >
                                <div className="flex-1">
                                  <FormLabel
                                    className={cn(
                                      "absolute left-3 text-lg text-muted-foreground transition-all",
                                      focusStates[`media-${index}-url`] ||
                                        field.value
                                        ? "top-1.5 text-sm"
                                        : "top-3.5",
                                    )}
                                  >
                                    Image URL
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      value={field.value ?? ""}
                                      onChange={(e) =>
                                        handleImageChange(
                                          e.target.value,
                                          field.onChange,
                                        )
                                      }
                                      onFocus={() =>
                                        handleFocus(`media-${index}-url`, true)
                                      }
                                      onBlur={() =>
                                        handleFocus(`media-${index}-url`, false)
                                      }
                                      className="h-14 rounded-md border-none pt-5 text-lg shadow-none focus-visible:ring-0"
                                    />
                                  </FormControl>
                                </div>

                                {/* Placeholder or Image Preview with Loader */}
                                <div
                                  className={cn(
                                    "absolute -right-[4.5rem] -top-[9px] size-[58px] flex-shrink-0 overflow-hidden rounded-md border border-gray-400 transition-all duration-300",
                                    {
                                      "border-primary ring-2 ring-primary ring-offset-2 ring-offset-card":
                                        focusStates[`media-${index}-url`],
                                    },
                                  )}
                                >
                                  {isLoading ? (
                                    <div className="flex h-full w-full items-center justify-center">
                                      <LoaderCircle className="animate-spin opacity-50" />
                                    </div>
                                  ) : imagePreview ? (
                                    <div className="group relative cursor-pointer">
                                      <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="size-14 object-cover"
                                      />
                                      {/* Hover Popup */}
                                      <div className="absolute -left-16 -top-52 hidden size-48 items-center justify-center rounded-md shadow-lg group-hover:flex group-hover:cursor-pointer">
                                        <img
                                          src={imagePreview}
                                          alt="Preview Enlarged"
                                          className="h-full w-full rounded-md object-cover"
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex size-14 items-center justify-center">
                                      <ImageIcon
                                        className="size-10 text-gray-400"
                                        strokeWidth={1}
                                      />
                                    </div>
                                  )}
                                </div>
                              </FormItem>
                            );
                          }}
                        />
                      </div>

                      {/* Alt Field */}
                      <div className="flex items-center space-x-4">
                        <FormField
                          control={control}
                          name={`media.${index}.alt`}
                          render={({ field }) => (
                            <FormItem
                              className={cn(
                                "relative h-14 flex-1 space-y-0 rounded-md border border-gray-400 transition-all duration-300",
                                {
                                  "border-primary ring-2 ring-primary ring-offset-2 ring-offset-card":
                                    focusStates[`media-${index}-alt`],
                                },
                              )}
                            >
                              <FormLabel
                                className={cn(
                                  "absolute left-3 text-lg text-muted-foreground transition-all",
                                  focusStates[`media-${index}-alt`] ||
                                    field.value
                                    ? "top-1.5 text-sm"
                                    : "top-3.5",
                                )}
                              >
                                Alt Text
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  onFocus={() =>
                                    handleFocus(`media-${index}-alt`, true)
                                  }
                                  onBlur={() =>
                                    handleFocus(`media-${index}-alt`, false)
                                  }
                                  className="h-full rounded-md border-transparent pt-5 text-lg shadow-none focus-visible:ring-0"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        {/* Remove Button */}
                        <Button
                          type="button"
                          variant={"destructive"}
                          size={"icon"}
                          onClick={() => remove(index)}
                          className="size-14 border border-destructive bg-red-200 text-primary transition-all duration-200 hover:bg-red-300 hover:underline"
                        >
                          <Trash2Icon className="size-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Image Button */}
                <Button
                  type="button"
                  variant={"linkHover2"}
                  onClick={() => append({ url: "", alt: "" })}
                  className="mt-4 px-0 after:w-full"
                >
                  <span className="flex items-center gap-x-2 text-base">
                    <PlusIcon className="mb-0.5 size-5" />
                    Add Image
                  </span>
                </Button>
              </div>
            </div>

            <div className="flex w-full gap-4">
              {/* Price Field */}
              <FormField
                control={control}
                name="price"
                render={({ field }) => (
                  <FormItem
                    className={cn(
                      "relative h-14 flex-1 space-y-0 rounded-md border border-gray-400 transition-all duration-300",
                      {
                        "border-primary ring-2 ring-primary ring-offset-2 ring-offset-card":
                          focusStates["price"],
                      },
                      {
                        "border-destructive": formState.errors.price,
                      },
                      {
                        "ring-2 ring-destructive ring-offset-2":
                          formState.errors.price && focusStates["price"],
                      },
                    )}
                  >
                    <FormLabel
                      className={cn(
                        "absolute left-3 text-lg text-muted-foreground transition-all",
                        focusStates["price"] || field.value
                          ? "top-1.5 text-sm"
                          : "top-3.5",
                      )}
                    >
                      Price
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : parseFloat(e.target.value),
                          )
                        }
                        onFocus={() => handleFocus("price", true)}
                        onBlur={() => handleFocus("price", false)}
                        className="h-full rounded-md border-transparent pt-5 text-lg shadow-none focus-visible:ring-0"
                      />
                    </FormControl>
                    <FormMessage className="absolute -bottom-6 left-0 pl-1 pt-0.5" />
                  </FormItem>
                )}
              />

              {/* MaxGuests Field */}
              <FormField
                control={control}
                name="maxGuests"
                render={({ field }) => (
                  <FormItem
                    className={cn(
                      "relative h-14 flex-1 space-y-0 rounded-md border border-gray-400 transition-all duration-300",
                      {
                        "border-primary ring-2 ring-primary ring-offset-2 ring-offset-card":
                          focusStates["maxGuests"],
                      },
                      {
                        "border-destructive": formState.errors.maxGuests,
                      },
                      {
                        "ring-2 ring-destructive ring-offset-2":
                          formState.errors.maxGuests &&
                          focusStates["maxGuests"],
                      },
                    )}
                  >
                    <FormLabel
                      className={cn(
                        "absolute left-3 text-lg text-muted-foreground transition-all",
                        focusStates["maxGuests"] || field.value
                          ? "top-1.5 text-sm"
                          : "top-3.5",
                      )}
                    >
                      Max Guests
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : parseFloat(e.target.value),
                          )
                        }
                        onFocus={() => handleFocus("maxGuests", true)}
                        onBlur={() => handleFocus("maxGuests", false)}
                        className="h-full rounded-md border-transparent pt-5 text-lg shadow-none focus-visible:ring-0"
                      />
                    </FormControl>
                    <FormMessage className="absolute -bottom-6 left-0 pl-1 pt-0.5" />
                  </FormItem>
                )}
              />
            </div>

            {/* Location */}
            <div className="space-y-8 pt-6">
              <FormField
                control={control}
                name="location.address"
                render={({ field }) => (
                  <FormItem
                    className={cn(
                      "relative h-14 space-y-0 rounded-md border border-gray-400 transition-all duration-300",
                      {
                        "border-primary ring-2 ring-primary ring-offset-2 ring-offset-card":
                          focusStates["address"],
                      },
                      {
                        "border-destructive":
                          formState.errors.location?.address,
                      },
                      {
                        "ring-2 ring-destructive ring-offset-2":
                          formState.errors.location?.address &&
                          focusStates["address"],
                      },
                    )}
                  >
                    <FormLabel
                      className={cn(
                        "absolute left-3 text-lg text-muted-foreground transition-all",
                        focusStates["address"] || field.value
                          ? "top-1.5 text-sm"
                          : "top-3.5",
                      )}
                    >
                      Street Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? null : e.target.value,
                          )
                        }
                        onFocus={() => handleFocus("address", true)}
                        onBlur={() => handleFocus("address", false)}
                        className="h-full rounded-md border-transparent pt-5 text-lg shadow-none focus-visible:ring-0"
                      />
                    </FormControl>
                    <FormMessage className="absolute -bottom-6 left-0 pl-1 pt-0.5" />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-4">
                <FormField
                  control={control}
                  name="location.zip"
                  render={({ field }) => (
                    <FormItem
                      className={cn(
                        "relative h-14 space-y-0 rounded-md border border-gray-400 transition-all duration-300",
                        {
                          "border-primary ring-2 ring-primary ring-offset-2 ring-offset-card":
                            focusStates["zip"],
                        },
                        {
                          "border-destructive": formState.errors.location?.zip,
                        },
                        {
                          "ring-2 ring-destructive ring-offset-2":
                            formState.errors.location?.zip &&
                            focusStates["zip"],
                        },
                      )}
                    >
                      <FormLabel
                        className={cn(
                          "absolute left-3 text-lg text-muted-foreground transition-all",
                          focusStates["zip"] || field.value
                            ? "top-1.5 text-sm"
                            : "top-3.5",
                        )}
                      >
                        Zip
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === "" ? null : e.target.value,
                            )
                          }
                          onFocus={() => handleFocus("zip", true)}
                          onBlur={() => handleFocus("zip", false)}
                          className="h-full rounded-md border-transparent pt-5 text-lg shadow-none focus-visible:ring-0"
                        />
                      </FormControl>
                      <FormMessage className="absolute -bottom-6 left-0 pl-1 pt-0.5" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="location.city"
                  render={({ field }) => (
                    <FormItem
                      className={cn(
                        "relative h-14 flex-1 space-y-0 rounded-md border border-gray-400 transition-all duration-300",
                        {
                          "border-primary ring-2 ring-primary ring-offset-2 ring-offset-card":
                            focusStates["city"],
                        },
                        {
                          "border-destructive": formState.errors.location?.city,
                        },
                        {
                          "ring-2 ring-destructive ring-offset-2":
                            formState.errors.location?.city &&
                            focusStates["city"],
                        },
                      )}
                    >
                      <FormLabel
                        className={cn(
                          "absolute left-3 text-lg text-muted-foreground transition-all",
                          focusStates["city"] || field.value
                            ? "top-1.5 text-sm"
                            : "top-3.5",
                        )}
                      >
                        City
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === "" ? null : e.target.value,
                            )
                          }
                          onFocus={() => handleFocus("city", true)}
                          onBlur={() => handleFocus("city", false)}
                          className="h-full rounded-md border-transparent pt-5 text-lg shadow-none focus-visible:ring-0"
                        />
                      </FormControl>
                      <FormMessage className="absolute -bottom-6 left-0 pl-1 pt-0.5" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center gap-4">
                <FormField
                  control={control}
                  name="location.country"
                  render={({ field }) => (
                    <FormItem
                      className={cn(
                        "relative h-14 flex-1 space-y-0 rounded-md border border-gray-400 transition-all duration-300",
                        {
                          "border-primary ring-2 ring-primary ring-offset-2 ring-offset-card":
                            focusStates["country"],
                        },
                        {
                          "border-destructive":
                            formState.errors.location?.country,
                        },
                        {
                          "ring-2 ring-destructive ring-offset-2":
                            formState.errors.location?.country &&
                            focusStates["country"],
                        },
                      )}
                    >
                      <FormLabel
                        className={cn(
                          "absolute left-3 text-lg text-muted-foreground transition-all",
                          focusStates["country"] || field.value
                            ? "top-1.5 text-sm"
                            : "top-3.5",
                        )}
                      >
                        Country
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === "" ? null : e.target.value,
                            )
                          }
                          onFocus={() => handleFocus("country", true)}
                          onBlur={() => handleFocus("country", false)}
                          className="h-full rounded-md border-transparent pt-5 text-lg shadow-none focus-visible:ring-0"
                        />
                      </FormControl>
                      <FormMessage className="absolute -bottom-6 left-0 pl-1 pt-0.5" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="location.continent"
                  render={({ field }) => (
                    <FormItem
                      className={cn(
                        "relative h-14 flex-1 space-y-0 rounded-md border border-gray-400 transition-all duration-300",
                        {
                          "border-primary ring-2 ring-primary ring-offset-2 ring-offset-card":
                            focusStates["continent"],
                        },
                        {
                          "border-destructive":
                            formState.errors.location?.continent,
                        },
                        {
                          "ring-2 ring-destructive ring-offset-2":
                            formState.errors.location?.continent &&
                            focusStates["continent"],
                        },
                      )}
                    >
                      <FormLabel
                        className={cn(
                          "absolute left-3 text-lg text-muted-foreground transition-all",
                          focusStates["continent"] || field.value
                            ? "top-1.5 text-sm"
                            : "top-3.5",
                        )}
                      >
                        Continent
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === "" ? null : e.target.value,
                            )
                          }
                          onFocus={() => handleFocus("continent", true)}
                          onBlur={() => handleFocus("continent", false)}
                          className="h-full rounded-md border-transparent pt-5 text-lg shadow-none focus-visible:ring-0"
                        />
                      </FormControl>
                      <FormMessage className="absolute -bottom-6 left-0 pl-1 pt-0.5" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center gap-x-4">
                <FormField
                  control={control}
                  name="location.lat"
                  render={({ field }) => (
                    <FormItem
                      className={cn(
                        "relative h-14 flex-1 space-y-0 rounded-md border border-gray-400 transition-all duration-300",
                        {
                          "border-primary ring-2 ring-primary ring-offset-2 ring-offset-card":
                            focusStates["lat"],
                        },
                        {
                          "border-destructive": formState.errors.location?.lat,
                        },
                        {
                          "ring-2 ring-destructive ring-offset-2":
                            formState.errors.location?.lat &&
                            focusStates["lat"],
                        },
                      )}
                    >
                      <FormLabel
                        className={cn(
                          "absolute left-3 text-lg text-muted-foreground transition-all",
                          focusStates["lat"] || field.value
                            ? "top-1.5 text-sm"
                            : "top-3.5",
                        )}
                      >
                        Latitude
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? null
                                : parseFloat(e.target.value),
                            )
                          }
                          onFocus={() => handleFocus("lat", true)}
                          onBlur={() => handleFocus("lat", false)}
                          className="h-full rounded-md border-transparent pt-5 text-lg shadow-none focus-visible:ring-0"
                        />
                      </FormControl>
                      <FormMessage className="absolute -bottom-6 left-0 pl-1 pt-0.5" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="location.lng"
                  render={({ field }) => (
                    <FormItem
                      className={cn(
                        "relative h-14 flex-1 space-y-0 rounded-md border border-gray-400 transition-all duration-300",
                        {
                          "border-primary ring-2 ring-primary ring-offset-2 ring-offset-card":
                            focusStates["lng"],
                        },
                        {
                          "border-destructive": formState.errors.location?.lng,
                        },
                        {
                          "ring-2 ring-destructive ring-offset-2":
                            formState.errors.location?.lng &&
                            focusStates["lng"],
                        },
                      )}
                    >
                      <FormLabel
                        className={cn(
                          "absolute left-3 text-lg text-muted-foreground transition-all",
                          focusStates["lng"] || field.value
                            ? "top-1.5 text-sm"
                            : "top-3.5",
                        )}
                      >
                        Longitude
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? null
                                : parseFloat(e.target.value),
                            )
                          }
                          onFocus={() => handleFocus("lng", true)}
                          onBlur={() => handleFocus("lng", false)}
                          className="h-full rounded-md border-transparent pt-5 text-lg shadow-none focus-visible:ring-0"
                        />
                      </FormControl>
                      <FormMessage className="absolute -bottom-6 left-0 pl-1 pt-0.5" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/*  Amenities */}
            <div className="pt-2">
              <h2 className="mb-2 text-lg font-medium">Choose Amenities</h2>
              <FormField
                control={control}
                name="meta.breakfast"
                render={({ field }) => (
                  <FormItem className="ml-2 flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="breakfast"
                      />
                    </FormControl>
                    <FormLabel htmlFor="breakfast" className="pb-1.5 text-base">
                      Breakfast
                    </FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="meta.parking"
                render={({ field }) => (
                  <FormItem className="ml-2 flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="parking"
                      />
                    </FormControl>
                    <FormLabel htmlFor="parking" className="pb-1.5 text-base">
                      Parking
                    </FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="meta.wifi"
                render={({ field }) => (
                  <FormItem className="ml-2 flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="wifi"
                      />
                    </FormControl>
                    <FormLabel htmlFor="wifi" className="pb-1.5 text-base">
                      Wifi
                    </FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="meta.pets"
                render={({ field }) => (
                  <FormItem className="ml-2 flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="pets"
                      />
                    </FormControl>
                    <FormLabel htmlFor="pets" className="pb-1.5 text-base">
                      Pets
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-x-4">
              {!isCreating && (
                <Button
                  type="button"
                  variant={"gooeyLeft"}
                  size={"lg"}
                  onClick={() => setOpenAlertModal(true)}
                  className="h-14 rounded-lg border border-red-500 bg-red-200 from-red-100 text-base text-primary after:duration-700 hover:bg-red-300 md:min-w-40"
                >
                  Delete
                </Button>
              )}
              <Button
                type="submit"
                variant={"gooeyLeft"}
                size={"lg"}
                disabled={mutation.isPending}
                className="h-14 rounded-lg text-base after:duration-700 md:min-w-40"
              >
                {isCreating ? (
                  mutation.isPending ? (
                    <span className="flex items-center">
                      Creating <LoaderCircle className="ml-2 size-5" />
                    </span>
                  ) : (
                    "Create Venue"
                  )
                ) : mutation.isPending ? (
                  <span className="flex items-center">
                    Updating <LoaderCircle className="ml-2 size-5" />
                  </span>
                ) : (
                  "Update Venue"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
