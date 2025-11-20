import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Получаем только активные сетевые пары для пользователей с информацией о сетях
    const networkPairs = await prisma.networkPair.findMany({
      where: {
        isActive: true
      },
      include: {
        fromNetwork: true,
        toNetwork: true
      },
      orderBy: { createdAt: 'desc' }
    })

    const response = NextResponse.json({ networkPairs })
    
    // Отключаем кэширование
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('Ошибка получения сетевых пар:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
