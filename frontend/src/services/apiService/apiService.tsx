import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AdminPostResourceRequestTypes, AdminPostResourceResponseTypes, GetBotTokenResponseTypes, GetCheckResultsRequestTypes, GetCheckResultsResponseTypes, GetDodosRequestTypes, ReportRequestPatchTypes, ReportRequestTypes, ReportResponseTypes, ResourceNode, ReviewGetTypes, ReviewRequestTypes, SocialReporGetTypes, SourceGetRequestTypes, SourceGetTypes, SubscriptionGetResponseTypes, SubscriptionPatchTypes, SubscriptionPostResponseTypes, SubscriptionPostTypes, UserLoginResponseTypes, UserRegistrRequestTypes, UserRegistrResponseTypes } from './apiServiceTypes';

const baseUrl = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/api/`

class CreateRequest {
  constructor (public url: string, public body: string | FormData, public method?: string, public headers?: {[key: string]: string | undefined}) {
    this.method = method ?? 'POST'
    this.url = baseUrl + url;
    this.body = body;
    this.headers = {'Content-Type': 'application/json', ...headers}
  }
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    prepareHeaders(headers, {getState}) {
      const token = localStorage.getItem('token')

      if (token) {
        headers.set('Authorization', token)
      }

      return headers
    }
  }),
  tagTypes: ['User', 'Source'],
  endpoints: (builder) => ({
    registerUser: builder.mutation<UserRegistrResponseTypes, UserRegistrRequestTypes>({
      query: (user) => new CreateRequest('auth/users/', JSON.stringify(user))
    }),
    loginUser: builder.mutation<UserLoginResponseTypes, FormData>({
      query: (user) => new CreateRequest('auth/login/access-token', user, 'POST', {'Content-Type': undefined})
    }),
    checkUser: builder.mutation<UserRegistrResponseTypes, void>({
      query: () => ({url: baseUrl + 'auth/users/me'})
    }),
    getSource: builder.query<SourceGetTypes, string>({
      query: (sourceUuid) => ({ url: baseUrl + `resources/${sourceUuid}` })
    }),
    getAllSources: builder.query<SourceGetTypes[], SourceGetRequestTypes>({
      query: (params) => ({ 
        url: baseUrl + `resources/`,
        params
      })
    }),
    getAllSocialReports: builder.query<SocialReporGetTypes[], string>({
      query: (sourceUuid) => ({ url: baseUrl + `resources/${sourceUuid}/social_reports`})
    }),
    getAllReviews: builder.query<ReviewGetTypes[], string>({
      query: (sourceUuid) => ({ url: baseUrl + `resources/${sourceUuid}/reviews` })
    }),
    postSubscriptions: builder.mutation<SubscriptionPostResponseTypes, SubscriptionPostTypes>({
      query: (subs) => new CreateRequest('subscriptions/', JSON.stringify(subs))
    }),
    patchSubscriptions: builder.mutation<void, SubscriptionPatchTypes>({
      query: ({uuid, ...subs}) => new CreateRequest(`subscriptions/${uuid}`, JSON.stringify(subs), 'PATCH')
    }),
    getSubscriptions: builder.mutation<SubscriptionGetResponseTypes[], string>({
      query: (resource_uuid) => ({ 
        url: baseUrl + `auth/users/me/subscriptions`,
        params: {resource_uuid}
      })
    }),
    postReview: builder.mutation<void, ReviewRequestTypes>({
      query: (review) => new CreateRequest('reviews/', JSON.stringify(review))
    }),
    postReport: builder.mutation<void, ReportRequestTypes>({
      query: (report) => new CreateRequest('reports/', JSON.stringify(report))
    }),
    getAllReports: builder.query<ReportResponseTypes[], void>({
      query: () => ({
        url: baseUrl + 'reports/'
      })
    }),
    getSourceReports: builder.query<ReportResponseTypes[], string>({
      query: (sourceUuid) => ({
        url: baseUrl + `resources/${sourceUuid}/reports`
      })
    }),
    adminPatchReport: builder.mutation<void, ReportRequestPatchTypes>({
      query: ({uuid, ...body}) => new CreateRequest(`reports/${uuid}`, JSON.stringify(body), 'PATCH')
    }),
    adminDeleteReport: builder.mutation<void, string>({
      query: (uuid) => ({
        method: 'DELETE',
        url: baseUrl + `reports/${uuid}`
      })
    }),
    getAllCheckResults: builder.query<GetCheckResultsResponseTypes[], GetCheckResultsRequestTypes>({
      query: ({source_uuid, ...params}) => ({
        params,
        url: baseUrl + `resources/${source_uuid}/stats/checks`
      })
    }),
    getBotToken: builder.mutation<GetBotTokenResponseTypes, void>({
      query: () => ({
        url: baseUrl + 'auth/users/telegram/generate_token'
      })
    }),
    adminPostResource: builder.mutation<AdminPostResourceResponseTypes, AdminPostResourceRequestTypes>({
      query: (source) => new CreateRequest('resources/', JSON.stringify(source))
    }),
    adminPostResourceNode: builder.mutation<void, ResourceNode>({
      query: (data) => new CreateRequest('resources/nodes/', JSON.stringify(data))
    }),
    adminDeleteResource: builder.mutation<void, string>({
      query: (uuid) => ({
        method: 'DELETE',
        url: baseUrl + `resources/${uuid}`
      })
    }),

    getAllResourceNodes: builder.query<ResourceNode[], string>({
      query: (resourseUuid) => ({
        url: baseUrl + `resources/${resourseUuid}/nodes`,
      })
    }),
    getDdos: builder.mutation<GetDodosRequestTypes, void>({
      query: () => ({url: baseUrl + 'resources/is_ddos'})
    })
  })
})

export const { useRegisterUserMutation } = api
export const { useLoginUserMutation } = api
export const { useGetAllSourcesQuery } = api
export const { useGetSourceQuery } = api
export const { useCheckUserMutation } = api
export const { useGetAllSocialReportsQuery } = api
export const { useGetAllReviewsQuery } = api
export const { usePostSubscriptionsMutation } = api
export const { useGetSubscriptionsMutation } = api
export const { usePatchSubscriptionsMutation } = api
export const { usePostReportMutation } = api
export const { usePostReviewMutation } = api
export const { useGetAllCheckResultsQuery } = api
export const { useGetBotTokenMutation } = api
export const { useAdminPostResourceMutation } = api
export const { useAdminDeleteResourceMutation } = api
export const { useGetAllResourceNodesQuery } = api
export const { useGetAllReportsQuery } = api
export const { useAdminDeleteReportMutation } = api
export const { useGetDdosMutation } = api
export const { useAdminPostResourceNodeMutation } = api
export const { useAdminPatchReportMutation } = api
export const { useGetSourceReportsQuery } = api