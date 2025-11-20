import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'


// Получить запросы приема пользователя
export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/user/receive-requests called')
    const sessionToken = request.cookies.get('session-token')?.value
    console.log('Session token:', sessionToken ? 'present' : 'missing')

    if (!sessionToken) {
      console.log('No session token found')
      return NextResponse.json(
        { error: 'Сессия не найдена' },
        { status: 401 }
      )
    }

    const user = await validateSession(sessionToken)

    if (!user) {
      return NextResponse.json(
        { error: 'Недействительная сессия' },
        { status: 401 }
      )
    }

    const receiveRequests = await prisma.receiveRequest.findMany({
      where: { userId: user.id },
      include: {
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
    console.error('Get receive requests error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// Создать запрос на готовность к приему
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/user/receive-requests called')
    const sessionToken = request.cookies.get('session-token')?.value
    console.log('Session token:', sessionToken ? 'present' : 'missing')

    if (!sessionToken) {
      console.log('No session token found')
      return NextResponse.json(
        { error: 'Сессия не найдена' },
        { status: 401 }
      )
    }

    const user = await validateSession(sessionToken)

    if (!user) {
      return NextResponse.json(
        { error: 'Недействительная сессия' },
        { status: 401 }
      )
    }

    const { walletId, amount } = await request.json()

    if (!walletId) {
      return NextResponse.json(
        { error: 'ID кошелька обязателен' },
        { status: 400 }
      )
    }

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return NextResponse.json(
        { error: 'Укажите корректную сумму пополнения' },
        { status: 400 }
      )
    }

    // Проверяем, что кошелек принадлежит пользователю и имеет тип RECEIVE
    const wallet = await prisma.wallet.findFirst({
      where: {
        id: walletId,
        userId: user.id,
        type: 'RECEIVE',
        status: 'ACTIVE'
      }
    })

    if (!wallet) {
      return NextResponse.json(
        { error: 'Кошелек не найден или недоступен' },
        { status: 400 }
      )
    }

    // Проверяем, нет ли уже активного запроса для этого кошелька
    const existingRequest = await prisma.receiveRequest.findFirst({
      where: {
        walletId,
        status: {
          in: ['PENDING', 'READY', 'PROCESSING']
        }
      }
    })

    if (existingRequest) {
      return NextResponse.json(
        { error: 'Для этого кошелька уже есть активный запрос' },
        { status: 400 }
      )
    }

    // Проверяем лимиты кошелька (если они есть в базе)
    let minAmount: number | null = null
    let maxAmount: number | null = null
    
    try {
      const walletWithLimits = await prisma.wallet.findFirst({
        where: { id: walletId },
        select: {
          minAmount: true,
          maxAmount: true
        }
      })
      
      if (walletWithLimits) {
        minAmount = (walletWithLimits as any)?.minAmount || null
        maxAmount = (walletWithLimits as any)?.maxAmount || null
      }
    } catch (limitError) {
      console.error('Ошибка при получении лимитов кошелька:', limitError)
      // Продолжаем без проверки лимитов, если поля не существуют в БД
    }

    const requestedAmount = parseFloat(amount.toString())

    if (minAmount !== null && requestedAmount < minAmount) {
      return NextResponse.json(
        { error: `Минимальная сумма пополнения: ${minAmount} USDT` },
        { status: 400 }
      )
    }

    if (maxAmount !== null && requestedAmount > maxAmount) {
      return NextResponse.json(
        { error: `Максимальная сумма пополнения: ${maxAmount} USDT` },
        { status: 400 }
      )
    }

    // Создаем запрос готовности к приему
    let receiveRequest
    try {
      receiveRequest = await prisma.receiveRequest.create({
        data: {
          walletId,
          userId: user.id,
          amount: requestedAmount,
          status: 'PENDING'
        },
        include: {
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
    } catch (createError: any) {
      console.error('Ошибка создания receive request:', createError)
      console.error('Детали ошибки:', {
        message: createError?.message,
        code: createError?.code,
        meta: createError?.meta
      })
      
      // Если ошибка связана с полем amount, пробуем создать без него
      if (createError?.message?.includes('amount') || createError?.code === 'P2002') {
        try {
          receiveRequest = await prisma.receiveRequest.create({
            data: {
              walletId,
              userId: user.id,
              status: 'PENDING'
            },
            include: {
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
          console.log('Created receive request without amount:', receiveRequest.id)
        } catch (retryError) {
          console.error('Ошибка при повторной попытке создания:', retryError)
          return NextResponse.json(
            { error: 'Ошибка создания запроса. Поле amount может быть недоступно в базе данных.' },
            { status: 500 }
          )
        }
      } else {
        return NextResponse.json(
          { error: `Внутренняя ошибка сервера: ${createError?.message || 'Неизвестная ошибка'}` },
          { status: 500 }
        )
      }
    }

    console.log('Created receive request:', receiveRequest.id)

    return NextResponse.json({
      message: 'Запрос на готовность к приему создан',
      receiveRequest
    })
  } catch (error: any) {
    console.error('Create receive request error:', error)
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name
    })
    return NextResponse.json(
      { error: `Внутренняя ошибка сервера: ${error?.message || 'Неизвестная ошибка'}` },
      { status: 500 }
    )
  }
}
