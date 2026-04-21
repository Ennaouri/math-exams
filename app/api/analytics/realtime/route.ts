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
        activeUsers: 0,
        activePages: [],
        error: "GA not configured"
      });
    }

    const [realtimeReport] = await analyticsDataClient.runRealtimeReport({
      property: `properties/${GA_PROPERTY_ID}`,
      metrics: [
        {
          name: "activeUsers",
        },
      ],
    });

    const realtimeUsers = realtimeReport.totals?.[0]?.metricValues?.[0]?.value || "0";

    return NextResponse.json({
      activeUsers: parseInt(realtimeUsers as string),
      activePages: [],
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Real-time Analytics API error:", error);
    return NextResponse.json({
      activeUsers: 0,
      activePages: [],
      error: "Unable to fetch real-time data"
    });
  }
}