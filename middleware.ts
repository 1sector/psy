import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })
  
  // Обновляем сессию если она существует
  const { data: { session } } = await supabase.auth.getSession()

  // Проверяем доступ к админ-роутам
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Проверяем роль пользователя
    const isAdmin = user?.user_metadata?.role === 'admin'
    
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return response
}

// Указываем для каких путей срабатывает middleware
export const config = {
  matcher: ['/admin/:path*']
} 