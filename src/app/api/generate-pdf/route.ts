import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { ReportPDF } from '@/components/questionnaire/ReportPDF'
import { questionnaireSchema } from '@/validations/questionnaire'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const rateLimitResponse = checkRateLimit(request, 'generate-pdf')
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  try {
    const body = await request.json()
    
    // Validate the data
    const validatedData = questionnaireSchema.parse(body.data)
    
    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      ReportPDF({ data: validatedData, userName: body.userName || 'Patient' })
    )
    
    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="sleep-report-${Date.now()}.pdf"`,
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}
