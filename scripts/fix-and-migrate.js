const { PrismaClient } = require('@prisma/client')
const { execSync } = require('child_process')

const prisma = new PrismaClient()

async function fixAndMigrate() {
  try {
    console.log('🔧 Исправление состояния миграций...')
    
    // Удаляем все записи о неудачных миграциях
    try {
      const result = await prisma.$executeRaw`
        DELETE FROM "_prisma_migrations" 
        WHERE finished_at IS NULL
      `
      console.log('✅ Записи о неудачных миграциях удалены')
    } catch (error) {
      if (error.code === 'P2021') {
        console.log('ℹ️ Таблица миграций не существует, создадим её при миграции')
      } else {
        console.log('ℹ️ Ошибка при удалении (возможно уже исправлено):', error.message)
      }
    }
    
    await prisma.$disconnect()
    
    console.log('🚀 Применение миграций...')
    execSync('npx prisma migrate deploy', { stdio: 'inherit' })
    
    console.log('✅ Миграции применены успешно!')
    
  } catch (error) {
    console.error('❌ Ошибка:', error)
    process.exit(1)
  }
}

fixAndMigrate()

