import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api",
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Product", "Users", "Orders", "Coupons"],
  endpoints: (builder) => ({
    createUserInDB: builder.mutation({
      query: (payload) => {
        return {
          url: "/auth/create-user",
          method: "POST",
          body: payload,
        };
      },
    }),
    getToken: builder.mutation({
      query: (payload) => {
        return {
          url: "/auth/get-token",
          method: "POST",
          body: payload,
        };
      },
    }),
    getMydata: builder.query({
      query: () => `/user/me`,
    }),
    // USER
    getProductDetails: builder.query({
      query: (id) => `/user/products/${id}`,
    }),
    getFeaturedProducts: builder.query({
      query: () => "/user/featured-products",
    }),

    getOrderHistory: builder.query({
      query: () => "/user/order-history",
    }),

    createOrder: builder.mutation({
      query: (formData) => ({
        url: "/user/create-order",
        method: "POST",
        body: formData,
      }),
    }),
    // PAYMENT
    createPaymentIntent: builder.mutation({
      query: (payload) => ({
        url: "/payment/create-payment-intent",
        method: "POST",
        body: payload,
      }),
    }),

    saveOrder: builder.mutation({
      query: (order) => ({
        url: "/payment/save-order",
        method: "POST",
        body: order,
      }),
      invalidatesTags: ["Orders"],
    }),
    applyCoupon: builder.mutation({
      query: (payload) => ({
        url: "/payment/apply-coupon",
        method: "POST",
        body: payload,
      }),
    }),

    // ADMIN
    createProduct: builder.mutation({
      query: (formData) => ({
        url: "/admin/create-product",
        method: "POST",
        body: formData,
      }),
    }),
    updateProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/update-product/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Product", id }],
    }),
    toggleFeatured: builder.mutation({
      query: ({ featured, id }) => ({
        url: `/admin/products/${id}/toggle-featured`,
        method: "PATCH",
        body: { featured },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Product", id }],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/admin/delete-product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    getAdminProducts: builder.query({
      query: () => `/admin/`,
      providesTags: (result = [], error, arg) => [
        ...result.map(({ _id }) => ({ type: "Product", id: _id })),
        { type: "Product", id: "LIST" },
      ],
    }),

    getAllUsers: builder.query({
      query: () => "/admin/users",
      providesTags: (result = []) => [
        ...result.map((user) => ({ type: "Users", id: user._id })),
        { type: "Users", id: "LIST" },
      ],
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/admin/users/${id}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    getAllOrders: builder.query({
      query: () => `/admin/all-orders/`,
    }),
    getOrderDetails: builder.query({
      query: (id) => `/admin/order-details/${id}`,
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/update-status/${id}`,
        method: "PATCH",
        body: { status },
      }),
    }),

    // Banner
    getBanner: builder.query({
      query: () => `/admin/get-banner`,
    }),
    getBannerById: builder.query({
      query: (id) => `/admin/get-banner/${id}`,
    }),
    createBanner: builder.mutation({
      query: (formData) => ({
        url: "/admin/create-banner",
        method: "POST",
        body: formData,
      }),
    }),
    updateBanner: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/update-banner/${id}`,
        method: "PATCH",
        body: formData,
      }),
    }),
    deleteBanner: builder.mutation({
      query: (id) => ({
        url: `/admin/delete-banner/${id}`,
        method: "DELETE",
      }),
    }),

    // Coupon --> Admin
    getAllCoupons: builder.query({
      query: () => `/admin/coupons`,
      providesTags: (result = [], error) =>
        result
          ? [
              ...result.map((coupon) => ({ type: "Coupons", id: coupon._id })),
              { type: "Coupons", id: "LIST" },
            ]
          : [{ type: "Coupons", id: "LIST" }],
    }),
    createCoupon: builder.mutation({
      query: (payload) => ({
        url: `/admin/create-coupon`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Coupons", id: "LIST" }],
    }),
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `/admin/delete-coupon/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Coupons", id },
        { type: "Coupons", id: "LIST" },
      ],
    }),

    // Coupon --> User
    getActiveCoupon: builder.query({
      query: () => `/user/active-coupon`,
    }),
  }),
});

export const {
  useCreateUserInDBMutation,
  useGetTokenMutation,
  // USER
  useGetProductDetailsQuery,
  useGetFeaturedProductsQuery,
  useCreateOrderMutation,
  useGetMydataQuery,
  useGetOrderHistoryQuery,

  // ADMIN product
  useCreateProductMutation,
  useUpdateProductMutation,
  useToggleFeaturedMutation,
  useDeleteProductMutation,
  useGetAdminProductsQuery,

  useGetAllOrdersQuery,
  useGetOrderDetailsQuery,
  useUpdateOrderStatusMutation,
  // payment
  useCreatePaymentIntentMutation,
  useSaveOrderMutation,
  useApplyCouponMutation,
  // Users
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  // Banner
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useGetBannerQuery,
  useGetBannerByIdQuery,
  // Coupon admin
  useGetAllCouponsQuery,
  useCreateCouponMutation,
  useDeleteCouponMutation,
  // Coupon User
  useGetActiveCouponQuery,
} = apiSlice;
