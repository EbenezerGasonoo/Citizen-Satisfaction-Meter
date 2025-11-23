import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('--- Auditing Actions ---')
    const actions = await prisma.action.findMany({
        select: { id: true, date: true, title: true, minister: { select: { fullName: true } } }
    })

    const actionsByYear: Record<number, number> = {}
    const non2025Actions: any[] = []

    actions.forEach(a => {
        const year = a.date.getFullYear()
        actionsByYear[year] = (actionsByYear[year] || 0) + 1
        if (year !== 2025) {
            non2025Actions.push({ ...a, year })
        }
    })

    console.log('Actions by Year:', actionsByYear)
    if (non2025Actions.length > 0) {
        console.log('Non-2025 Actions:')
        non2025Actions.forEach(a => console.log(` - [${a.year}] ${a.title} (${a.minister.fullName})`))
    } else {
        console.log('All actions are from 2025.')
    }

    console.log('\n--- Auditing Policies ---')
    const policies = await prisma.policy.findMany({
        select: { id: true, date: true, title: true, minister: { select: { fullName: true } } }
    })

    const policiesByYear: Record<number, number> = {}
    const non2025Policies: any[] = []

    policies.forEach(p => {
        const year = p.date.getFullYear()
        policiesByYear[year] = (policiesByYear[year] || 0) + 1
        if (year !== 2025) {
            non2025Policies.push({ ...p, year })
        }
    })

    console.log('Policies by Year:', policiesByYear)
    if (non2025Policies.length > 0) {
        console.log('Non-2025 Policies:')
        non2025Policies.forEach(p => console.log(` - [${p.year}] ${p.title} (${p.minister.fullName})`))
    } else {
        console.log('All policies are from 2025.')
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
