export const getUsersPipeline = () => {
  return [
    {
      $match: { deletedAt: null },
    },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: "transactions",
        localField: "_id",
        foreignField: "userId",
        as: "transactions",
      },
    },
    {
      $lookup: {
        from: "shops",
        localField: "assignedShop",
        foreignField: "_id",
        as: "assignedShop",
      },
    },
    {
      $addFields: {
        totalOrders: { $size: "$transactions" },
        totalSell: { $sum: "$transactions.amount" },
        assignedShop: {
          $first: "$assignedShop",
        },
      },
    },
    {
      $project: {
        transactions: 0, // remove full trx list, keep only totals
        // other fields...
      },
    },
  ];
};
