import { NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

const GA_PROPERTY_ID = process.env.GA_PROPERTY_ID;
const GA_CREDS = process.env.GOOGLE_APPLICATION_CREDENTIALS;

let analyticsDataClient: BetaAnalyticsDataClient | null = null;

if (GA_CREDS) {
  try {
    analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: JSON.parse(GA_CREDS),
    });
  } catch (e) {
    console.error("Failed to parse GA credentials:", e);
  }
}

export async function GET() {
  try {
    if (!GA_PROPERTY_ID || !analyticsDataClient) {
      return NextResponse.json({
        pageViews: 0,
        activeUsers: 0,
        newUsers: 0,
        topPages: [],
        error: "GA not configured"
      });
    }

    const [report] = await analyticsDataClient.runReport({
      property: `properties/${GA_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: "7daysAgo",
          endDate: "today",
        },
      ],
      dimensions: [
        {
          name: "pagePath",
        },
      ],
      metrics: [
        {
          name: "screenPageViews",
        },
        {
          name: "activeUsers",
        },
      ],
      limit: 10,
    });

    const [totalsReport] = await analyticsDataClient.runReport({
      property: `properties/${GA_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: "7daysAgo",
          endDate: "today",
        },
      ],
      metrics: [
        {
          name: "screenPageViews",
        },
        {
          name: "activeUsers",
        },
        {
          name: "newUsers",
        },
      ],
    });

    const pageViews = totalsReport.rows?.[0]?.metricValues?.[0]?.value || "0";
    const activeUsers = totalsReport.rows?.[0]?.metricValues?.[1]?.value || "0";
    const newUsers = totalsReport.rows?.[0]?.metricValues?.[2]?.value || "0";

    const topPages =
      report.rows?.map((row) => ({
        path: row.dimensionValues?.[0].value,
        views: row.metricValues?.[0].value,
      })) || [];

    return NextResponse.json({
      pageViews: parseInt(pageViews),
      activeUsers: parseInt(activeUsers),
      newUsers: parseInt(newUsers),
      topPages,
    });
  } catch (error: any) {
    console.error("Analytics API error:", error);
    return NextResponse.json({
      pageViews: 0,
      activeUsers: 0,
      newUsers: 0,
      topPages: [],
      error: error.message
    });
  }
}