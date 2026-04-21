import { NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

const GA_PROPERTY_ID = process.env.GA_PROPERTY_ID;
const GA_CREDS = process.env.GOOGLE_APPLICATION_CREDENTIALS;

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: GA_CREDS ? JSON.parse(GA_CREDS) : undefined,
});

export async function GET() {
  try {
    if (!GA_PROPERTY_ID) {
      return NextResponse.json(
        { error: "GA_PROPERTY_ID not configured" },
        { status: 500 }
      );
    }

    const [realtimeReport] = await analyticsDataClient.runRealtimeReport({
      property: `properties/${GA_PROPERTY_ID}`,
      dimensions: [
        {
          name: "unifiedPageScreen",
        },
      ],
      metrics: [
        {
          name: "activeUsers",
        },
      ],
      limit: 10,
    });

    const realtimeUsers =
      realtimeReport.totals?.[0]?.metricValues?.[0]?.value || "0";

    const activePages =
      realtimeReport.rows?.map((row) => ({
        page: row.dimensionValues?.[0].value || "/",
        users: row.metricValues?.[0]?.value || "0",
      })) || [];

    return NextResponse.json({
      activeUsers: parseInt(realtimeUsers),
      activePages,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Real-time Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch real-time analytics" },
      { status: 500 }
    );
  }
}