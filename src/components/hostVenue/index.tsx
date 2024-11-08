import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ImageIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { AutosizeTextarea } from "../ui/textarea";
import { createVenueAction } from "./createVenueAction";
import { defaultValues, Venue, VenueSchema } from "./VenueValidation";
import { Checkbox } from "../ui/checkbox";
import { useImagePreview } from "./useImagePreview";

export default function HostVenue() {
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
  const [isPriceFocused, setIsPriceFocused] = useState(false);
  const [isMaxGuestsFocused, setIsMaxGuestsFocused] = useState(false);
  const [isAddressFocused, setIsAddressFocused] = useState(false);
  const [isZipFocused, setIsZipFocused] = useState(false);
  const [isCityFocused, setIsCityFocused] = useState(false);
  const [isCountryFocused, setIsCountryFocused] = useState(false);
  const [isContinentFocused, setIsContinentFocused] = useState(false);
  const [isLatFocused, setIsLatFocused] = useState(false);
  const [isLngFocused, setIsLngFocused] = useState(false);

  // Focus state for each field
  const [focusStates, setFocusStates] = useState<Record<string, boolean>>({});

  const handleFocus = (id: string, isFocused: boolean) => {
    setFocusStates((prev) => ({ ...prev, [id]: isFocused }));
  };

  const form = useForm<Venue>({
    resolver: zodResolver(VenueSchema),
    defaultValues,
  });

  const { control, handleSubmit, formState, reset } = form;

  // UseFieldArray for dynamic media fields
  const { fields, append, remove } = useFieldArray({
    control,
    name: "media", // The array name in your form state
  });

  const mutation = useMutation<Venue, Error, Venue>({
    mutationFn: createVenueAction,
    onSuccess: (data) => {
      console.log("Venue created successfully:", data);
      reset();
      toast.success("Venue created successfully!");
    },
    onError: (error) => {
      console.error("Error creating venue:", error);
      toast.error(error.message || "Failed to create venue. Please try again.");
    },
  });

  const onSubmit = (data: Venue) => mutation.mutate(data);

  return (
    <div className="mx-auto my-10 max-w-2xl px-4 md:px-0">
      <h1 className="text-3xl font-semibold">Create a Venue</h1>
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
                        isNameFocused,
                    },
                    {
                      "border-destructive": formState.errors.name,
                    },
                    {
                      "ring-2 ring-destructive ring-offset-2":
                        formState.errors.name && isNameFocused,
                    },
                  )}
                >
                  <FormLabel
                    className={cn(
                      "absolute left-3 text-lg text-muted-foreground transition-all",
                      isNameFocused || field.value
                        ? "top-1.5 text-sm"
                        : "top-3.5",
                    )}
                  >
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onFocus={() => setIsNameFocused(true)}
                      onBlur={() => setIsNameFocused(false)}
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
                        isDescriptionFocused,
                    },
                    {
                      "border-destructive": formState.errors.description,
                    },
                    {
                      "ring-2 ring-destructive ring-offset-2":
                        formState.errors.description && isDescriptionFocused,
                    },
                  )}
                >
                  <FormLabel
                    className={cn(
                      "absolute left-3 text-lg text-muted-foreground transition-all",
                      isDescriptionFocused || field.value
                        ? "top-1.5 text-sm"
                        : "top-3.5",
                    )}
                  >
                    Description
                  </FormLabel>
                  <FormControl>
                    <AutosizeTextarea
                      {...field}
                      onFocus={() => setIsDescriptionFocused(true)}
                      onBlur={() => setIsDescriptionFocused(false)}
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
                          const { imagePreview, handleImageChange } =
                            useImagePreview();

                          return (
                            <FormItem
                              className={cn(
                                "relative mr-[4.25rem] flex items-center space-x-4 rounded-md border border-gray-400 transition-all duration-300",
                                {
                                  "border-primary ring-2 ring-primary ring-offset-2 ring-offset-card":
                                    focusStates[mediaField.id],
                                },
                              )}
                            >
                              <div className="flex-1">
                                <FormLabel
                                  className={cn(
                                    "absolute left-3 text-lg text-muted-foreground transition-all",
                                    focusStates[mediaField.id] || field.value
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
                                      handleFocus(mediaField.id, true)
                                    }
                                    onBlur={() =>
                                      handleFocus(mediaField.id, false)
                                    }
                                    className="h-14 rounded-md border-none pt-5 text-lg shadow-none focus-visible:ring-0"
                                  />
                                </FormControl>
                              </div>

                              {/* Placeholder or Image Preview */}
                              <div
                                className={cn(
                                  "absolute -right-[4.5rem] -top-[9px] size-[58px] flex-shrink-0 overflow-hidden rounded-md border border-gray-400 transition-all duration-300",
                                  {
                                    "border-primary ring-2 ring-primary ring-offset-2 ring-offset-card":
                                      focusStates[mediaField.id],
                                  },
                                )}
                              >
                                {imagePreview ? (
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
                                  focusStates[`${mediaField.id}-alt`],
                              },
                            )}
                          >
                            <FormLabel
                              className={cn(
                                "absolute left-3 text-lg text-muted-foreground transition-all",
                                focusStates[`${mediaField.id}-alt`] ||
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
                                  handleFocus(`${mediaField.id}-alt`, true)
                                }
                                onBlur={() =>
                                  handleFocus(`${mediaField.id}-alt`, false)
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
                        isPriceFocused,
                    },
                    {
                      "border-destructive": formState.errors.price,
                    },
                    {
                      "ring-2 ring-destructive ring-offset-2":
                        formState.errors.price && isPriceFocused,
                    },
                  )}
                >
                  <FormLabel
                    className={cn(
                      "absolute left-3 text-lg text-muted-foreground transition-all",
                      isPriceFocused || field.value
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
                      onFocus={() => setIsPriceFocused(true)}
                      onBlur={() => setIsPriceFocused(false)}
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
                        isMaxGuestsFocused,
                    },
                    {
                      "border-destructive": formState.errors.maxGuests,
                    },
                    {
                      "ring-2 ring-destructive ring-offset-2":
                        formState.errors.maxGuests && isMaxGuestsFocused,
                    },
                  )}
                >
                  <FormLabel
                    className={cn(
                      "absolute left-3 text-lg text-muted-foreground transition-all",
                      isMaxGuestsFocused || field.value
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
                      onFocus={() => setIsMaxGuestsFocused(true)}
                      onBlur={() => setIsMaxGuestsFocused(false)}
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
                        isAddressFocused,
                    },
                    {
                      "border-destructive": formState.errors.location?.address,
                    },
                    {
                      "ring-2 ring-destructive ring-offset-2":
                        formState.errors.location?.address && isAddressFocused,
                    },
                  )}
                >
                  <FormLabel
                    className={cn(
                      "absolute left-3 text-lg text-muted-foreground transition-all",
                      isAddressFocused || field.value
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
                      onFocus={() => setIsAddressFocused(true)}
                      onBlur={() => setIsAddressFocused(false)}
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
                          isZipFocused,
                      },
                      {
                        "border-destructive": formState.errors.location?.zip,
                      },
                      {
                        "ring-2 ring-destructive ring-offset-2":
                          formState.errors.location?.zip && isZipFocused,
                      },
                    )}
                  >
                    <FormLabel
                      className={cn(
                        "absolute left-3 text-lg text-muted-foreground transition-all",
                        isZipFocused || field.value
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
                        onFocus={() => setIsZipFocused(true)}
                        onBlur={() => setIsZipFocused(false)}
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
                          isCityFocused,
                      },
                      {
                        "border-destructive": formState.errors.location?.city,
                      },
                      {
                        "ring-2 ring-destructive ring-offset-2":
                          formState.errors.location?.city && isCityFocused,
                      },
                    )}
                  >
                    <FormLabel
                      className={cn(
                        "absolute left-3 text-lg text-muted-foreground transition-all",
                        isCityFocused || field.value
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
                        onFocus={() => setIsCityFocused(true)}
                        onBlur={() => setIsCityFocused(false)}
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
                          isCountryFocused,
                      },
                      {
                        "border-destructive":
                          formState.errors.location?.country,
                      },
                      {
                        "ring-2 ring-destructive ring-offset-2":
                          formState.errors.location?.country &&
                          isCountryFocused,
                      },
                    )}
                  >
                    <FormLabel
                      className={cn(
                        "absolute left-3 text-lg text-muted-foreground transition-all",
                        isCountryFocused || field.value
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
                        onFocus={() => setIsCountryFocused(true)}
                        onBlur={() => setIsCountryFocused(false)}
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
                          isContinentFocused,
                      },
                      {
                        "border-destructive":
                          formState.errors.location?.continent,
                      },
                      {
                        "ring-2 ring-destructive ring-offset-2":
                          formState.errors.location?.continent &&
                          isContinentFocused,
                      },
                    )}
                  >
                    <FormLabel
                      className={cn(
                        "absolute left-3 text-lg text-muted-foreground transition-all",
                        isContinentFocused || field.value
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
                        onFocus={() => setIsContinentFocused(true)}
                        onBlur={() => setIsContinentFocused(false)}
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
                          isLatFocused,
                      },
                      {
                        "border-destructive": formState.errors.location?.lat,
                      },
                      {
                        "ring-2 ring-destructive ring-offset-2":
                          formState.errors.location?.lat && isLatFocused,
                      },
                    )}
                  >
                    <FormLabel
                      className={cn(
                        "absolute left-3 text-lg text-muted-foreground transition-all",
                        isLatFocused || field.value
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
                        onFocus={() => setIsLatFocused(true)}
                        onBlur={() => setIsLatFocused(false)}
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
                          isLngFocused,
                      },
                      {
                        "border-destructive": formState.errors.location?.lng,
                      },
                      {
                        "ring-2 ring-destructive ring-offset-2":
                          formState.errors.location?.lng && isLngFocused,
                      },
                    )}
                  >
                    <FormLabel
                      className={cn(
                        "absolute left-3 text-lg text-muted-foreground transition-all",
                        isLngFocused || field.value
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
                        onFocus={() => setIsLngFocused(true)}
                        onBlur={() => setIsLngFocused(false)}
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
                      id="venueManager"
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor="venueManager"
                    className="pb-1.5 text-base"
                  >
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
                      id="venueManager"
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor="venueManager"
                    className="pb-1.5 text-base"
                  >
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
                      id="venueManager"
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor="venueManager"
                    className="pb-1.5 text-base"
                  >
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
                      id="venueManager"
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor="venueManager"
                    className="pb-1.5 text-base"
                  >
                    Pets
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              variant={"gooeyLeft"}
              size={"lg"}
              disabled={mutation.isPending}
              className={cn("h-14 rounded-lg text-base after:duration-700", {
                "cursor-not-allowed opacity-50": mutation.isPending,
              })}
            >
              {mutation.isPending ? "Submitting..." : "Create Venue"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
