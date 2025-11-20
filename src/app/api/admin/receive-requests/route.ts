import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'


// Получить все запросы приема
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

    const receiveRequests = await prisma.receiveRequest.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            telegram: true
          }
        },
        wallet: {
          select: {
            id: true,
            address: true,
            network: true,
            type: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ receiveRequests })
  } catch (error) {
    console.error('Get admin receive requests error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// Обновить статус запроса приема
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

    const { requestId, action, amount } = await request.json()

    if (!requestId || !action) {
      return NextResponse.json(
        { error: 'ID запроса и действие обязательны' },
        { status: 400 }
      )
    }

    // Получаем запрос
    const receiveRequest = await prisma.receiveRequest.findUnique({
      where: { id: requestId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            telegram: true
          }
        },
        wallet: {
          select: {
            id: true,
            address: true,
            network: true,
            type: true,
            status: true,
            balance: true
          }
        }
      }
    })

    if (!receiveRequest) {
      return NextResponse.json(
        { error: 'Запрос не найден' },
        { status: 404 }
      )
    }

    if (action === 'credit') {
      // Начисление баланса
      const creditAmount = amount || receiveRequest.amount

      if (!creditAmount || parseFloat(creditAmount.toString()) <= 0) {
        return NextResponse.json(
          { error: 'Укажите корректную сумму для начисления' },
          { status: 400 }
        )
      }

      // Обновляем баланс кошелька
      await prisma.wallet.update({
        where: { id: receiveRequest.walletId },
        data: {
          balance: {
            increment: parseFloat(creditAmount.toString())
          }
        }
      })

      // Обновляем баланс пользователя
      await prisma.user.update({
        where: { id: receiveRequest.userId },
        data: {
          balance: {
            increment: parseFloat(creditAmount.toString())
          }
        }
      })

      // Обновляем статус запроса
      const updatedRequest = await prisma.receiveRequest.update({
        where: { id: requestId },
        data: { status: 'COMPLETED' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              telegram: true
            }
          },
          wallet: {
            select: {
              id: true,
              address: true,
              network: true,
              type: true,
              status: true
            }
          }
        }
      })

      return NextResponse.json({
        message: 'Баланс успешно начислен',
        receiveRequest: updatedRequest
      })
    } else if (action === 'reject') {
      // Отклонение запроса
      const updatedRequest = await prisma.receiveRequest.update({
        where: { id: requestId },
        data: { status: 'REJECTED' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              telegram: true
            }
          },
          wallet: {
            select: {
              id: true,
              address: true,
              network: true,
              type: true,
              status: true
            }
          }
        }
      })

      return NextResponse.json({
        message: 'Запрос отклонен',
        receiveRequest: updatedRequest
      })
    } else {
      return NextResponse.json(
        { error: 'Неизвестное действие' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Update receive request error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
