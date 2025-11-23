import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const policies = await prisma.policy.findMany({
        include: {
            minister: {
                select: {
                    fullName: true,
                    portfolio: true
                }
            }
        }
    })

    if (policies.length === 0) {
        console.log('No policies found in the database.')
    } else {
        console.log(`Found ${policies.length} policies:`)
        policies.forEach(p => {
            console.log(`- "${p.title}" by ${p.minister.fullName} (${p.minister.portfolio})`)
            console.log(`  Status: ${p.status}, Impact: ${p.impact}`)
        })
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
