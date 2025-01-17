"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const localDepot = yield prisma.depot.create({
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
                users: {
                    create: [{
                            displayName: 'Harun Daloglu',
                            profilePhoto: '/default-profile.jpg',
                            email: 'harund@gmail.com'
                        }]
                },
                shelves: {
                    create: [
                        { name: 'Shelf A' },
                        { name: 'Shelf B' },
                        { name: 'Shelf C' },
                        { name: 'Shelf D' },
                        { name: 'Shelf E' },
                        { name: 'Shelf F' },
                        { name: 'Shelf G' },
                        { name: 'Shelf H' },
                    ]
                }
            },
            include: { shelves: true },
        });
        yield prisma.category.createMany({
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
        });
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
