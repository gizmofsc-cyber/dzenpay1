import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

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

    // Получаем кошельки пользователя
    let wallets
    try {
      wallets = await prisma.wallet.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      })
    } catch (error) {
      console.error('Ошибка при получении кошельков:', error)
      return NextResponse.json(
        { error: 'Ошибка при загрузке кошельков', wallets: [] },
        { status: 500 }
      )
    }

    // Обрабатываем кошельки и добавляем minAmount/maxAmount
    // Сначала пытаемся получить из самого кошелька, если нет - из WalletRequest
    const walletsWithLimits = await Promise.allSettled(wallets.map(async (wallet) => {
      try {
        // Пытаемся получить minAmount и maxAmount из самого кошелька
        let minAmount = (wallet as any).minAmount || null
        let maxAmount = (wallet as any).maxAmount || null

        // Если полей нет и это RECEIVE кошелек, пытаемся извлечь из WalletRequest
        if ((!minAmount || !maxAmount) && wallet.type === 'RECEIVE') {
          try {
            const walletRequest = await prisma.walletRequest.findFirst({
              where: {
                userId: user.id,
                network: wallet.network,
                type: 'RECEIVE',
                status: 'APPROVED'
              },
              orderBy: { createdAt: 'desc' }
            })

            if (walletRequest?.description) {
              const minMatch = walletRequest.description.match(/Минимальная сумма:\s*([\d.]+)/)
              const maxMatch = walletRequest.description.match(/Максимальная сумма:\s*([\d.]+)/)
              
              if (minMatch && !minAmount) minAmount = parseFloat(minMatch[1])
              if (maxMatch && !maxAmount) maxAmount = parseFloat(maxMatch[1])
            }
          } catch (requestError) {
            console.error('Ошибка при извлечении данных из WalletRequest:', requestError)
            // Продолжаем без этих данных
          }
        }

        return {
          ...wallet,
          minAmount,
          maxAmount
        }
      } catch (error) {
        console.error('Ошибка при обработке кошелька:', error)
        // В случае ошибки возвращаем кошелек как есть
        return {
          ...wallet,
          minAmount: null,
          maxAmount: null
        }
      }
    }))

    // Фильтруем успешно обработанные кошельки
    const processedWallets = walletsWithLimits
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map(result => result.value)

    // Вычисляем общую статистику
    const totalBalance = processedWallets.reduce((sum, wallet) => sum + wallet.balance, 0)
    const activeWallets = processedWallets.filter(wallet => wallet.status === 'ACTIVE').length

    return NextResponse.json({
      wallets: processedWallets,
      statistics: {
        totalBalance,
        activeWallets,
        totalWallets: processedWallets.length
      }
    })
  } catch (error) {
    console.error('Get user wallets error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session-token')?.value
    if (!sessionToken) {
      return NextResponse.json({ error: 'Сессия не найдена' }, { status: 401 })
    }

    const user = await validateSession(sessionToken)
    if (!user) {
      return NextResponse.json({ error: 'Недействительная сессия' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const walletId = searchParams.get('id')

    if (!walletId) {
      return NextResponse.json({ error: 'ID кошелька не указан' }, { status: 400 })
    }

    // Проверяем, что кошелек принадлежит пользователю
    const wallet = await prisma.wallet.findFirst({
      where: {
        id: walletId,
        userId: user.id
      }
    })

    if (!wallet) {
      return NextResponse.json({ error: 'Кошелек не найден' }, { status: 404 })
    }

    // Проверяем, нет ли активных запросов на вывод для этого кошелька
    const activeWithdrawalRequests = await prisma.withdrawalRequest.findMany({
      where: {
        walletId: walletId,
        status: {
          in: ['PENDING', 'PROCESSING']
        }
      }
    })

    if (activeWithdrawalRequests.length > 0) {
      return NextResponse.json({ 
        error: 'Невозможно удалить кошелек с активными запросами на вывод' 
      }, { status: 400 })
    }

    // Удаляем кошелек
    await prisma.wallet.delete({
      where: { id: walletId }
    })

    return NextResponse.json({ message: 'Кошелек успешно удален' })
  } catch (error) {
    console.error('Delete user wallet error:', error)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}