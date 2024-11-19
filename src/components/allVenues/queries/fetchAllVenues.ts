import { axiosInstance } from "@/lib/axiosInstance";
import { AllVenuesProps, Venue, VenuesApiResponse } from "@/lib/types";

export const fetchAllVenues = async (
  page: number,
  limit: number,
): Promise<AllVenuesProps> => {
  try {
    const response = await axiosInstance.get<VenuesApiResponse>("/venues", {
      params: {
        limit,
        page,
        sort: "created",
        sortOrder: "desc",
      },
    });

    const venues: Venue[] = response.data.data;

    const hasMore = !response.data.meta.isLastPage;
    const nextPage = hasMore ? response.data.meta.nextPage : null;

    return {
      data: venues,
      nextPage,
    };
  } catch (error: any) {
    if (error.code === "ECONNABORTED") {
      console.error("Request timed out");
    } else {
      console.error("An error occurred", error);
    }
    throw error;
  }
};
