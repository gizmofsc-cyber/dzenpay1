import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Проверка секретного ключа для безопасности
    const authHeader = request.headers.get('authorization')
    const secretKey = process.env.INIT_DB_SECRET || 'init-secret-key-change-in-production'
    
    if (authHeader !== `Bearer ${secretKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('🔄 Начинаем инициализацию базы данных...')

    // 0. Исправляем состояние миграций (если есть неудачные)
    try {
      await prisma.$executeRaw`
        DELETE FROM "_prisma_migrations" 
        WHERE migration_name = '20251006093314_init' 
        AND finished_at IS NULL
      `
      console.log('✅ Исправлено состояние миграций')
    } catch (error: any) {
      // Игнорируем ошибки, если таблица не существует или уже исправлена
      console.log('ℹ️ Состояние миграций:', error.message)
    }

    // 1. Проверяем, есть ли уже админ
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })
    
    if (existingAdmin) {
      console.log('✅ Админ уже существует:', existingAdmin.email)
      return NextResponse.json({
        success: true,
        message: 'Database already initialized',
        admin: existingAdmin.email
      })
    }

    // 2. Создаем админа
    const hashedPassword = await bcrypt.hash('datmuf-Bajjyk-6wupde', 10)
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin10@gmail.com',
        password: hashedPassword,
        token: 'admin-token-' + Date.now(),
        role: 'ADMIN',
        status: 'ACTIVE'
      }
    })

    console.log('✅ Админ создан:', admin.email)

    // 3. Создаем базовые сети
    const networks = [
      { name: 'TRC20', displayName: 'TRC20 (TRON)', isActive: true },
      { name: 'BEP20', displayName: 'BEP20 (BSC)', isActive: true },
      { name: 'ERC20', displayName: 'ERC20 (Ethereum)', isActive: true },
      { name: 'POLYGON', displayName: 'POLYGON', isActive: true }
    ]

    const createdNetworks = []
    for (const network of networks) {
      const existingNetwork = await prisma.network.findFirst({
        where: { name: network.name }
      })
      
      if (!existingNetwork) {
        const created = await prisma.network.create({
          data: network
        })
        createdNetworks.push(created)
        console.log('✅ Сеть создана:', network.name)
      } else {
        createdNetworks.push(existingNetwork)
        console.log('✅ Сеть уже существует:', network.name)
      }
    }

    // 4. Создаем сетевые пары
    const networkPairs = [
      {
        fromNetworkId: createdNetworks.find(n => n.name === 'TRC20')!.id,
        toNetworkId: createdNetworks.find(n => n.name === 'BEP20')!.id,
        profitPercent: 2.5,
        isActive: true,
      },
      {
        fromNetworkId: createdNetworks.find(n => n.name === 'BEP20')!.id,
        toNetworkId: createdNetworks.find(n => n.name === 'ERC20')!.id,
        profitPercent: 3.2,
        isActive: true,
      },
      {
        fromNetworkId: createdNetworks.find(n => n.name === 'ERC20')!.id,
        toNetworkId: createdNetworks.find(n => n.name === 'POLYGON')!.id,
        profitPercent: 1.8,
        isActive: true,
      },
    ]

    for (const pair of networkPairs) {
      const existing = await prisma.networkPair.findFirst({
        where: {
          fromNetworkId: pair.fromNetworkId,
          toNetworkId: pair.toNetworkId
        }
      })

      if (!existing) {
        await prisma.networkPair.create({
          data: pair
        })
        const fromNetwork = createdNetworks.find(n => n.id === pair.fromNetworkId)
        const toNetwork = createdNetworks.find(n => n.id === pair.toNetworkId)
        console.log(`✅ Создана сетевая пара: ${fromNetwork?.displayName} ↔ ${toNetwork?.displayName}`)
      }
    }

    console.log('✅ Инициализация завершена!')

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      admin: {
        email: admin.email,
        password: 'datmuf-Bajjyk-6wupde'
      },
      networks: createdNetworks.length,
      networkPairs: networkPairs.length
    })

  } catch (error: any) {
    console.error('❌ Ошибка инициализации:', error)
    return NextResponse.json(
      { 
        error: 'Initialization failed',
        message: error.message 
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

