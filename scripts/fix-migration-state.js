const { PrismaClient } = require('@prisma/client')
const { execSync } = require('child_process')

const prisma = new PrismaClient()

async function fixMigrationState() {
  try {
    console.log('🔧 Исправление состояния миграций...')
    
    // Удаляем запись о неудачной миграции
    await prisma.$executeRaw`
      DELETE FROM "_prisma_migrations" 
      WHERE migration_name = '20251006093314_init' 
      AND finished_at IS NULL
    `
    
    console.log('✅ Запись о неудачной миграции удалена')
    
    // Помечаем миграцию как примененную вручную
    await prisma.$executeRaw`
      INSERT INTO "_prisma_migrations" (migration_name, started_at, finished_at, applied_steps_count)
      VALUES ('20251006093314_init', NOW(), NOW(), 1)
      ON CONFLICT (migration_name) DO NOTHING
    `
    
    console.log('✅ Миграция помечена как примененная')
    console.log('✅ Состояние миграций исправлено!')
    
  } catch (error) {
    console.error('❌ Ошибка:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

fixMigrationState()

