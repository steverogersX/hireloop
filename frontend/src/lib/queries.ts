import { serverData, serverList } from "@/lib/server-api";
import type {
  ActivityItem,
  Application,
  ApplicationInsights,
  CompanyDetail,
  CompanyListItem,
  ConnectedAccount,
  DashboardStats,
  InterviewWithContext,
  JobAlert,
  JobDetail,
  NotificationPreference,
  ProfilePayload,
  SavedJob,
  SavedSearch,
  ScoredJob,
  MessageThread,
  MessageThreadDetail,
} from "@/types/api";

export async function getJobs(query: Record<string, string | number | undefined> = {}) {
  return serverList<ScoredJob>("/jobs", { query: { limit: 100, ...query } });
}

export async function getJob(slug: string) {
  return serverData<JobDetail>(`/jobs/${slug}`);
}

export async function getSimilarJobs(slug: string) {
  const { items } = await serverList<ScoredJob>(`/jobs/${slug}/similar`);
  return items;
}

export async function getCompanies(query: Record<string, string | number | undefined> = {}) {
  return serverList<CompanyListItem>("/companies", { query: { limit: 100, ...query } });
}

export async function getCompany(slug: string) {
  return serverData<CompanyDetail>(`/companies/${slug}`);
}

export async function getApplications() {
  const { items } = await serverList<Application>("/applications/me", {
    query: { limit: 100 },
  });
  return items;
}

export async function getSavedJobs() {
  const { items } = await serverList<SavedJob>("/saved-jobs", { query: { limit: 100 } });
  return items;
}

export async function getSavedSearches() {
  const { items } = await serverList<SavedSearch>("/saved-searches");
  return items;
}

export async function getAlerts() {
  const { items } = await serverList<JobAlert>("/alerts");
  return items;
}

export async function getThreads() {
  const { items } = await serverList<MessageThread>("/messages", { query: { limit: 50 } });
  return items;
}

export async function getThread(id: string) {
  return serverData<MessageThreadDetail>(`/messages/${id}`);
}

export async function getInterviews() {
  const { items } = await serverList<InterviewWithContext>("/interviews", {
    query: { upcoming: true, days: 30 },
  });
  return items;
}

export async function getActivity(limit = 8) {
  const { items } = await serverList<ActivityItem>("/activity", { query: { limit } });
  return items;
}

export async function getProfile() {
  return serverData<ProfilePayload>("/profile");
}

export async function getDashboardStats() {
  return serverData<DashboardStats>("/dashboard/stats");
}

export async function getApplicationInsights() {
  return serverData<ApplicationInsights>("/dashboard/insights");
}

export async function getNotificationPreferences() {
  const { items } = await serverList<NotificationPreference>("/settings/notifications");
  return items;
}

export async function getConnectedAccounts() {
  const { items } = await serverList<ConnectedAccount>("/settings/connected-accounts");
  return items;
}
