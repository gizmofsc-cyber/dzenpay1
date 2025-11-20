import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// Получить все обращения
export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session-token')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Сессия не найдена' },
        { status: 401 }
      )
    }

    const user = await validateSession(sessionToken)

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      )
    }

    const tickets = await prisma.supportTicket.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            telegram: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ tickets })
  } catch (error) {
    console.error('Get admin support tickets error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// Обновить обращение (ответить)
export async function PATCH(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session-token')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Сессия не найдена' },
        { status: 401 }
      )
    }

    const user = await validateSession(sessionToken)

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      )
    }

    const { ticketId, response, status } = await request.json()

    if (!ticketId) {
      return NextResponse.json(
        { error: 'ID обращения обязателен' },
        { status: 400 }
      )
    }

    // Получаем текущее обращение
    const currentTicket = await prisma.supportTicket.findUnique({
      where: { id: ticketId }
    })

    if (!currentTicket) {
      return NextResponse.json(
        { error: 'Обращение не найдено' },
        { status: 404 }
      )
    }

    // Обновляем обращение
    const updatedTicket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        status: status || 'in_progress',
        message: response ? `${currentTicket.message}\n\n--- Ответ администратора ---\n${response}` : currentTicket.message
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            telegram: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Ответ отправлен',
      ticket: updatedTicket
    })
  } catch (error: any) {
    console.error('Update support ticket error:', error)
    
    // Если обращение не найдено, пробуем создать ответ
    if (error?.code === 'P2025') {
      return NextResponse.json(
        { error: 'Обращение не найдено' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

