import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q') || searchParams.get('query')
  
  if (!query) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Redirect to the main page with the search query
  const homeUrl = new URL('/', request.url)
  homeUrl.searchParams.set('q', query)
  
  return NextResponse.redirect(homeUrl)
}

// Also handle POST requests for form submissions
export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const query = formData.get('q') || formData.get('query')
  
  if (!query) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Redirect to the main page with the search query
  const homeUrl = new URL('/', request.url)
  homeUrl.searchParams.set('q', query.toString())
  
  return NextResponse.redirect(homeUrl)
}