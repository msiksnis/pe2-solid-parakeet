// import { axiosInstance } from "@/lib/axiosInstance";
// import { Venue } from "@/lib/types";

// interface FetchVenuesParams {
//   pageParam?: number;
//   limit?: number;
// }

// export const fetchVenues = async ({
//   pageParam = 1,
//   limit = 100,
// }: FetchVenuesParams): Promise<{ data: Venue[]; nextPage: number | null }> => {
//   try {
//     const { data } = await axiosInstance.get("/venues", {
//       params: {
//         limit,
//         page: pageParam,
//       },
//     });

//     // Assuming the API response contains information about the total pages or total items
//     const hasNextPage = data.totalPages > pageParam;

//     return {
//       data: data.data,
//       nextPage: hasNextPage ? pageParam + 1 : null,
//     };
//   } catch (error: any) {
//     if (error.code === "ECONNABORTED") {
//       console.error("Request timed out");
//     } else {
//       console.error("An error occurred", error);
//     }
//     throw error;
//   }
// };

import { axiosInstance } from "@/lib/axiosInstance";
import { Venue } from "@/lib/types";

export const fetchVenues = async (): Promise<Venue[]> => {
  try {
    const { data } = await axiosInstance.get("/venues");
    return data.data;
  } catch (error: any) {
    if (error.code === "ECONNABORTED") {
      console.error("Request timed out");
    } else {
      console.error("An error occurred", error);
    }
    throw error;
  }
};
