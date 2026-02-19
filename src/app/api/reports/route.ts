import { NextResponse } from "next/server"
import { getStats } from "@/lib/reports/getStats/reports"
import { getBorrowedReport } from "@/lib/reports/getBorrowedReport/reports"
import { getPaymentsPerBook } from "@/lib/reports/getPaymentsReport/reports"


export async function GET() {
  try {
    const stats = await getStats()
    const borrowed = await getBorrowedReport()
    const payments = await getPaymentsPerBook()

    return NextResponse.json({
      stats,
      borrowed,
      payments,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    )
  }
}
