import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/proxy';

const protectedRoutes = [/^\/dashboard(\/|$)/, /^\/admin(\/|$)/];

export async function proxy(req: NextRequest) {
  const { supabase, response } = createClient(req);

  const { data: { user } } = await supabase.auth.getUser();

  const isProtected = protectedRoutes.some((re) => re.test(req.nextUrl.pathname));

  if (isProtected && !user) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
