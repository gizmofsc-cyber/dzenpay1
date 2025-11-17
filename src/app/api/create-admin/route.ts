import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Создание администратора...')

    // Проверяем, есть ли уже админ
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })
    
    if (existingAdmin) {
      console.log('✅ Админ уже существует:', existingAdmin.email)
      return NextResponse.json({
        success: true,
        message: 'Admin already exists',
        admin: {
          email: existingAdmin.email,
          status: existingAdmin.status
        }
      })
    }

    // Создаем админа
    const hashedPassword = await bcrypt.hash('datmuf-Bajjyk-6wupde', 12)
    
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

    return NextResponse.json({
      success: true,
      message: 'Admin created successfully',
      admin: {
        email: admin.email,
        password: 'datmuf-Bajjyk-6wupde',
        role: admin.role,
        status: admin.status
      }
    })

  } catch (error: any) {
    console.error('❌ Ошибка создания админа:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create admin',
        message: error.message 
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// GET для простого вызова через браузер
export async function GET(request: NextRequest) {
  return POST(request)
}

