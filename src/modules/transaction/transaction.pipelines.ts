export const getFilteredTransactions = (
  matchStage: any,
  page: number,
  limit: number,
) => {
  const pipeline: any[] = [
    // Lookup customer
    {
      $lookup: {
        from: "customers", // collection name in MongoDB
        localField: "customerId",
        foreignField: "_id",
        as: "customerId",
      },
    },
    { $unwind: { path: "$customerId", preserveNullAndEmptyArrays: true } },

    // Lookup seller
    {
      $lookup: {
        from: "users",
        localField: "sellerId",
        foreignField: "_id",
        as: "sellerId",
      },
    },
    { $unwind: { path: "$sellerId", preserveNullAndEmptyArrays: true } },

    // Lookup shop
    {
      $lookup: {
        from: "shops",
        localField: "shopId",
        foreignField: "_id",
        as: "shopId",
      },
    },
    { $unwind: { path: "$shopId", preserveNullAndEmptyArrays: true } },

    // Match stage for search
    { $match: matchStage },

    // Sort by creation date descending
    { $sort: { createdAt: -1 } },

    // Pagination
    { $skip: (page - 1) * limit },
    { $limit: limit },

    // Project only the required fields
    {
      $project: {
        _id: 1,
        productsList: 1,
        flatDiscount: 1,
        paidAmount: 1,
        createdAt: 1,
        invoiceNumber: 1,
        actualAmount: 1,
        totalDiscount: 1,
        paymentType: 1,
        debt: 1,
        "customerId.name": 1,
        "customerId.phoneNumber": 1,
        "sellerId.name": 1,
        "shopId.name": 1,
      },
    },
  ];
  return pipeline;
};

export const getCountsPipeline = (matchStage: any) => {
  return [
    // Repeat lookups for accurate count with search
    {
      $lookup: {
        from: "costumers",
        localField: "customerId",
        foreignField: "_id",
        as: "customerId",
      },
    },
    { $unwind: { path: "$customerId", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "sellerId",
        foreignField: "_id",
        as: "sellerId",
      },
    },
    { $unwind: { path: "$sellerId", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "shops",
        localField: "shopId",
        foreignField: "_id",
        as: "shopId",
      },
    },
    { $unwind: { path: "$shopId", preserveNullAndEmptyArrays: true } },
    { $match: matchStage },
    { $count: "totalRecords" },
  ];
};
