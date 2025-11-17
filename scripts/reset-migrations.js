const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function resetMigrations() {
  try {
    console.log('🔧 Сброс состояния миграций...')
    
    // Удаляем все записи о миграциях
    await prisma.$executeRaw`DELETE FROM "_prisma_migrations"`
    
    console.log('✅ Все записи о миграциях удалены')
    console.log('✅ Теперь можно применить миграции заново')
    
  } catch (error) {
    // Если таблица не существует, это нормально
    if (error.code === 'P2021') {
      console.log('ℹ️ Таблица миграций не существует, все в порядке')
    } else {
      console.error('❌ Ошибка:', error)
      throw error
    }
  } finally {
    await prisma.$disconnect()
  }
}

resetMigrations()

