import { PrismaClient } from "@prisma/client";

import {
  Comment,
  InternalTransfers,
  InventoryAge,
  InventoryItem,
  ItemReturns,
  ItemsCategory,
  ItemsSubCategory,
  Location,
  LowStockAlert,
  Sale,
  Variation,
  Vendor,
} from "./inventoryItems";

import {
  brands,
  categories,
  model,
  modelCategory,
  series,
  services,
} from "./serviceItems";

const prisma = new PrismaClient();

async function main() {
  await prisma.brand.createMany({
    data: brands,
  });
  await prisma.service.createMany({
    data: services,
  });
  await prisma.series.createMany({
    data: series,
  });

  await prisma.model.createMany({
    data: model,
  });
  await prisma.modelCategory.createMany({
    data: modelCategory,
  });

  await prisma.category.createMany({
    data: categories,
  });

  await prisma.staff.create({
    data: {
      staff_id: 1,
      staff_name: "Allem",
      mobile_number: "634688444",
      email: "abdelaziz.allem@gmail.com",
      location: "hargeisa",
      role: "admin",
      password: "$2a$10$a.jPOyvDMEMw9/.jjo023.Wf794yqp9LJECZfWUSqoEP6S2HMtYSG",
    },
  });

  // // Todo: Insert new records
  // await prisma.itemsCategory.createMany({
  //    data: ItemsCategory,
  // });
  // await prisma.itemsSubCategory.createMany({
  //    data: ItemsSubCategory,
  // });
  // await prisma.vendor.createMany({
  //    data: Vendor,
  // });
  // await prisma.location.createMany({
  //    data: Location,
  // });
  // await prisma.inventoryItem.createMany({
  //    data: InventoryItem,
  // });
  // await prisma.variation.createMany({
  //    data: Variation,
  // });
  // await prisma.itemReturn.createMany({
  //    data: ItemReturns,
  // });
  // await prisma.comment.createMany({
  //    data: Comment,
  // });
  // await prisma.internalTransfer.createMany({
  //    data: InternalTransfers,
  // });
  // await prisma.sale.createMany({
  //    data: Sale,
  // });
  // await prisma.inventoryAge.createMany({
  //    data: InventoryAge,
  // });
  // await prisma.lowStockAlert.createMany({
  //    data: LowStockAlert,
  // });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
