import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Проверка секретного ключа
    const authHeader = request.headers.get('authorization')
    const secretKey = process.env.INIT_DB_SECRET || 'init-secret-key-change-in-production'
    
    if (authHeader !== `Bearer ${secretKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('🔧 Исправление состояния миграций...')
    
    // Удаляем запись о неудачной миграции
    const result = await prisma.$executeRaw`
      DELETE FROM "_prisma_migrations" 
      WHERE migration_name = '20251006093314_init' 
      AND finished_at IS NULL
    `
    
    console.log('✅ Запись о неудачной миграции удалена')
    
    return NextResponse.json({
      success: true,
      message: 'Migration state fixed. You can now redeploy.'
    })

  } catch (error: any) {
    console.error('❌ Ошибка:', error)
    
    // Если таблица не существует, это нормально
    if (error.code === 'P2021') {
      return NextResponse.json({
        success: true,
        message: 'Migration table does not exist, all good'
      })
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fix migrations',
        message: error.message 
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

