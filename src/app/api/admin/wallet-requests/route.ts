import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'


// Получить все запросы кошельков для админа
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

    if (!user) {
      return NextResponse.json(
        { error: 'Недействительная сессия' },
        { status: 401 }
      )
    }

    // Проверяем, что пользователь - админ
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    // Строим фильтр
    const where: any = {}
    if (status && status !== 'all') {
      where.status = status
    }

    // Получаем все запросы кошельков с информацией о пользователях
    const walletRequests = await prisma.walletRequest.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            telegram: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ walletRequests })
  } catch (error) {
    console.error('Admin wallet requests fetch error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// Обработать запрос кошелька (одобрить/отклонить)
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

    if (!user) {
      return NextResponse.json(
        { error: 'Недействительная сессия' },
        { status: 401 }
      )
    }

    // Проверяем, что пользователь - админ
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      )
    }

    const { requestId, action, walletAddress } = await request.json()

    if (!requestId || !action) {
      return NextResponse.json(
        { error: 'Неверные параметры' },
        { status: 400 }
      )
    }

    if (!['APPROVED', 'REJECTED'].includes(action)) {
      return NextResponse.json(
        { error: 'Неверное действие' },
        { status: 400 }
      )
    }

    // Получаем запрос кошелька
    const walletRequest = await prisma.walletRequest.findUnique({
      where: { id: requestId },
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

    if (!walletRequest) {
      return NextResponse.json(
        { error: 'Запрос не найден' },
        { status: 404 }
      )
    }

    if (walletRequest.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Запрос уже обработан' },
        { status: 400 }
      )
    }

    // Обновляем статус запроса
    const updatedRequest = await prisma.walletRequest.update({
      where: { id: requestId },
      data: { status: action },
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

    // Если запрос одобрен, создаем кошелек
    if (action === 'APPROVED') {
      // Для кошельков пополнения и приема адрес должен быть передан отдельно (назначает админ)
      const finalWalletAddress = (walletRequest.type === 'DEPOSIT' || walletRequest.type === 'RECEIVE')
        ? walletAddress 
        : walletRequest.address

      if (!finalWalletAddress) {
        return NextResponse.json(
          { error: 'Адрес кошелька обязателен' },
          { status: 400 }
        )
      }

      // Извлекаем данные из description для RECEIVE типа
      let dailyLimit: number | null = null
      let minAmount: number | null = null
      let maxAmount: number | null = null
      
      if (walletRequest.type === 'RECEIVE' && walletRequest.description) {
        // Парсим описание: "Тип: Для пополнения, Минимальная сумма: 111 USDT, Максимальная сумма: 111 USDT, Дневной лимит: 111 USDT"
        const minMatch = walletRequest.description.match(/Минимальная сумма:\s*([\d.]+)/)
        const maxMatch = walletRequest.description.match(/Максимальная сумма:\s*([\d.]+)/)
        const dailyMatch = walletRequest.description.match(/Дневной лимит:\s*([\d.]+)/)
        
        if (minMatch) minAmount = parseFloat(minMatch[1])
        if (maxMatch) maxAmount = parseFloat(maxMatch[1])
        if (dailyMatch) dailyLimit = parseFloat(dailyMatch[1])
      }

      // Создаем базовый объект данных для кошелька
      const walletData: any = {
        address: finalWalletAddress,
        network: walletRequest.network,
        type: walletRequest.type,
        userId: walletRequest.userId,
        status: 'ACTIVE',
        balance: 0
      }

      // Добавляем dailyLimit если есть
      if (dailyLimit !== null) {
        walletData.dailyLimit = dailyLimit
      }

      // Пытаемся создать кошелек с новыми полями
      let newWallet
      try {
        // Добавляем новые поля только если они извлечены
        if (minAmount !== null && !isNaN(minAmount)) {
          walletData.minAmount = minAmount
        }
        if (maxAmount !== null && !isNaN(maxAmount)) {
          walletData.maxAmount = maxAmount
        }

        newWallet = await prisma.wallet.create({
          data: walletData
        })
      } catch (error: any) {
        // Если ошибка связана с отсутствием полей в БД, создаем кошелек без них
        const errorMessage = String(error?.message || '')
        const errorCode = String(error?.code || '')
        
        const isFieldError = errorMessage.includes('minAmount') || 
                            errorMessage.includes('maxAmount') || 
                            errorMessage.includes('Unknown column') ||
                            (errorMessage.includes('column') && (errorMessage.includes('minAmount') || errorMessage.includes('maxAmount')))
        
        if (isFieldError) {
          console.log('⚠️ Поля minAmount/maxAmount еще не существуют в БД, создаем кошелек без них')
          console.log('Ошибка:', errorMessage)
          
          // Удаляем новые поля и создаем кошелек без них
          const walletDataWithoutNewFields = { ...walletData }
          delete walletDataWithoutNewFields.minAmount
          delete walletDataWithoutNewFields.maxAmount
          
          newWallet = await prisma.wallet.create({
            data: walletDataWithoutNewFields
          })
        } else {
          // Если это другая ошибка, пробрасываем её дальше
          console.error('❌ Ошибка создания кошелька:', error)
          throw error
        }
      }

      return NextResponse.json({ 
        message: 'Запрос одобрен и кошелек создан',
        walletRequest: updatedRequest,
        wallet: newWallet
      })
    }

    return NextResponse.json({ 
      message: 'Запрос отклонен',
      walletRequest: updatedRequest
    })
  } catch (error: any) {
    console.error('Admin wallet request update error:', error)
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta
    })
    
    // Возвращаем более детальную ошибку для отладки
    return NextResponse.json(
      { 
        error: 'Внутренняя ошибка сервера',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    )
  }
}
