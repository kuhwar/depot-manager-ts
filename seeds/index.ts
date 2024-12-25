import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main () {
  const localDepot = await prisma.depot.create({
    data: {
      displayName: 'Local Depot',
      logo: '/local-depot-logo.jpg',
      hosts: {
        create: [
          { name: 'localhost' },
          { name: 'demo.kuhwar.net' },
          { name: '127.0.0.1' },
        ]
      },
      shelves: {
        create: [
          {name:"Shelf A"},
          {name:"Shelf B"},
          {name:"Shelf C"},
          {name:"Shelf D"},
          {name:"Shelf E"},
          {name:"Shelf F"},
          {name:"Shelf G"},
          {name:"Shelf H"},
        ]
      }
    }
  })

  const defaultCategories = await prisma.category.createMany({
    data: [
      { name: 'Not Categorized' },
      { name: 'Appliances' },
      { name: 'Bed Room Furniture' },
      { name: 'Dining Room Furniture' },
      { name: 'Living Room Furniture' },
      { name: 'Rugs & Carpets' },
      { name: 'Tools' },
      { name: 'Household' },
      { name: 'Home Textile' },
      { name: 'Kitchen' },
      { name: 'Auto Parts' },
      { name: 'Office' },
      { name: 'Sports & Outdoors' },
      { name: 'Patio & Garden' },
      { name: 'Pet Supplies' },
      { name: 'Toys & Games' },
      { name: 'Bags & Luggage' },
      { name: 'Bicycles and Wearables' },
      { name: 'Baby & Kids' },
      { name: 'Electronics' },
      { name: 'Arts & Crafts' },
    ]
  })

  const product = await prisma.product.create({
    data: {
      description: 'a short product description',
      name: 'Sample Product',
      upc: '1234568790123',
      visuals: ['/default-product.png'],
      price: 20.00,
      category: { connect: defaultCategories[0] },
      items: {
        create: [{
          depot: { connect: localDepot },
          shelf: {
            create: {
              name: '01-A',
              depot: { connect: localDepot }
            }
          }
        }]
      }
    }
  })

  console.log({ localDepot })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })