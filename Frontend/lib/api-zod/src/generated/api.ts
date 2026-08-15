import * as zod from 'zod';

export const HealthCheckResponse = zod.object({
  "status": zod.string()
})

export const registerBodyPasswordMin = 6;

export const RegisterBody = zod.object({
  "email": zod.string(),
  "password": zod.string().min(registerBodyPasswordMin)
})

export const RegisterResponse = zod.object({
  "userId": zod.number(),
  "email": zod.string(),
  "token": zod.string(),
  "refreshToken": zod.string(),
  "role": zod.enum(['CUSTOMER', 'ADMIN'])
})

export const loginBodyPasswordMin = 6;

export const LoginBody = zod.object({
  "email": zod.string(),
  "password": zod.string().min(loginBodyPasswordMin)
})

export const LoginResponse = zod.object({
  "userId": zod.number(),
  "email": zod.string(),
  "token": zod.string(),
  "refreshToken": zod.string(),
  "role": zod.enum(['CUSTOMER', 'ADMIN'])
})

export const GetMeResponse = zod.object({
  "userId": zod.number(),
  "email": zod.string(),
  "role": zod.enum(['CUSTOMER', 'ADMIN'])
})

export const ListCategoriesResponseItem = zod.object({
  "id": zod.number(),
  "name": zod.string()
})
export const ListCategoriesResponse = zod.array(ListCategoriesResponseItem)

export const ListProductsQueryParams = zod.object({
  "search": zod.coerce.string().optional(),
  "categoryId": zod.coerce.number().optional(),
  "sort": zod.enum(['price_asc', 'price_desc', 'newest']).optional(),
  "page": zod.coerce.number().optional(),
  "limit": zod.coerce.number().optional()
})

export const ListProductsResponse = zod.object({
  "products": zod.array(zod.object({
  "id": zod.number(),
  "name": zod.string(),
  "description": zod.string(),
  "price": zod.number(),
  "imageUrl": zod.string(),
  "category": zod.object({
  "id": zod.number(),
  "name": zod.string()
})
})),
  "total": zod.number(),
  "page": zod.number(),
  "limit": zod.number()
})

export const GetProductParams = zod.object({
  "id": zod.coerce.number()
})

export const GetProductResponse = zod.object({
  "id": zod.number(),
  "name": zod.string(),
  "description": zod.string(),
  "price": zod.number(),
  "imageUrl": zod.string(),
  "category": zod.object({
  "id": zod.number(),
  "name": zod.string()
})
})

export const GetRelatedProductsParams = zod.object({
  "id": zod.coerce.number()
})

export const GetRelatedProductsResponseItem = zod.object({
  "id": zod.number(),
  "name": zod.string(),
  "description": zod.string(),
  "price": zod.number(),
  "imageUrl": zod.string(),
  "category": zod.object({
  "id": zod.number(),
  "name": zod.string()
})
})
export const GetRelatedProductsResponse = zod.array(GetRelatedProductsResponseItem)

export const GetFeaturedProductsResponseItem = zod.object({
  "id": zod.number(),
  "name": zod.string(),
  "description": zod.string(),
  "price": zod.number(),
  "imageUrl": zod.string(),
  "category": zod.object({
  "id": zod.number(),
  "name": zod.string()
})
})
export const GetFeaturedProductsResponse = zod.array(GetFeaturedProductsResponseItem)

export const GetCartResponse = zod.object({
  "id": zod.number(),
  "items": zod.array(zod.object({
  "id": zod.number(),
  "productId": zod.number(),
  "productName": zod.string(),
  "price": zod.number(),
  "quantity": zod.number(),
  "imageUrl": zod.string()
})),
  "total": zod.number()
})

export const ClearCartResponse = zod.object({
  "id": zod.number(),
  "items": zod.array(zod.object({
  "id": zod.number(),
  "productId": zod.number(),
  "productName": zod.string(),
  "price": zod.number(),
  "quantity": zod.number(),
  "imageUrl": zod.string()
})),
  "total": zod.number()
})

export const addCartItemBodyQuantityMax = 10;

export const AddCartItemBody = zod.object({
  "productId": zod.number(),
  "quantity": zod.number().min(1).max(addCartItemBodyQuantityMax)
})

export const AddCartItemResponse = zod.object({
  "id": zod.number(),
  "items": zod.array(zod.object({
  "id": zod.number(),
  "productId": zod.number(),
  "productName": zod.string(),
  "price": zod.number(),
  "quantity": zod.number(),
  "imageUrl": zod.string()
})),
  "total": zod.number()
})

export const UpdateCartItemParams = zod.object({
  "id": zod.coerce.number()
})

export const updateCartItemBodyQuantityMax = 10;

export const UpdateCartItemBody = zod.object({
  "quantity": zod.number().min(1).max(updateCartItemBodyQuantityMax)
})

export const UpdateCartItemResponse = zod.object({
  "id": zod.number(),
  "items": zod.array(zod.object({
  "id": zod.number(),
  "productId": zod.number(),
  "productName": zod.string(),
  "price": zod.number(),
  "quantity": zod.number(),
  "imageUrl": zod.string()
})),
  "total": zod.number()
})

export const RemoveCartItemParams = zod.object({
  "id": zod.coerce.number()
})

export const RemoveCartItemResponse = zod.object({
  "id": zod.number(),
  "items": zod.array(zod.object({
  "id": zod.number(),
  "productId": zod.number(),
  "productName": zod.string(),
  "price": zod.number(),
  "quantity": zod.number(),
  "imageUrl": zod.string()
})),
  "total": zod.number()
})

export const ListOrdersResponseItem = zod.object({
  "id": zod.number(),
  "userId": zod.number(),
  "status": zod.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  "items": zod.array(zod.object({
  "id": zod.number(),
  "productId": zod.number(),
  "productName": zod.string(),
  "priceAtPurchase": zod.number(),
  "quantity": zod.number(),
  "imageUrl": zod.string()
})),
  "total": zod.number(),
  "createdAt": zod.coerce.date(),
  "updatedAt": zod.coerce.date()
})
export const ListOrdersResponse = zod.array(ListOrdersResponseItem)

export const CheckoutBody = zod.object({
  "shippingAddress": zod.string().optional()
})

export const CheckoutResponse = zod.object({
  "id": zod.number(),
  "userId": zod.number(),
  "status": zod.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  "items": zod.array(zod.object({
  "id": zod.number(),
  "productId": zod.number(),
  "productName": zod.string(),
  "priceAtPurchase": zod.number(),
  "quantity": zod.number(),
  "imageUrl": zod.string()
})),
  "total": zod.number(),
  "createdAt": zod.coerce.date(),
  "updatedAt": zod.coerce.date()
})

export const GetOrderParams = zod.object({
  "id": zod.coerce.number()
})

export const GetOrderResponse = zod.object({
  "id": zod.number(),
  "userId": zod.number(),
  "status": zod.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  "items": zod.array(zod.object({
  "id": zod.number(),
  "productId": zod.number(),
  "productName": zod.string(),
  "priceAtPurchase": zod.number(),
  "quantity": zod.number(),
  "imageUrl": zod.string()
})),
  "total": zod.number(),
  "createdAt": zod.coerce.date(),
  "updatedAt": zod.coerce.date()
})

export const CancelOrderParams = zod.object({
  "id": zod.coerce.number()
})

export const CancelOrderResponse = zod.object({
  "id": zod.number(),
  "userId": zod.number(),
  "status": zod.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  "items": zod.array(zod.object({
  "id": zod.number(),
  "productId": zod.number(),
  "productName": zod.string(),
  "priceAtPurchase": zod.number(),
  "quantity": zod.number(),
  "imageUrl": zod.string()
})),
  "total": zod.number(),
  "createdAt": zod.coerce.date(),
  "updatedAt": zod.coerce.date()
})

export const CreatePaymentIntentBody = zod.object({
  "orderId": zod.number()
})

export const CreatePaymentIntentResponse = zod.object({
  "clientSecret": zod.string(),
  "amount": zod.number(),
  "currency": zod.string()
})

export const ConfirmPaymentBody = zod.object({
  "orderId": zod.number(),
  "paymentIntentId": zod.string()
})

export const ConfirmPaymentResponse = zod.object({
  "id": zod.number(),
  "userId": zod.number(),
  "status": zod.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  "items": zod.array(zod.object({
  "id": zod.number(),
  "productId": zod.number(),
  "productName": zod.string(),
  "priceAtPurchase": zod.number(),
  "quantity": zod.number(),
  "imageUrl": zod.string()
})),
  "total": zod.number(),
  "createdAt": zod.coerce.date(),
  "updatedAt": zod.coerce.date()
})

export const GetStoreSummaryResponse = zod.object({
  "totalProducts": zod.number(),
  "totalCategories": zod.number(),
  "totalOrders": zod.number(),
  "recentOrders": zod.array(zod.object({
  "id": zod.number(),
  "userId": zod.number(),
  "status": zod.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  "items": zod.array(zod.object({
  "id": zod.number(),
  "productId": zod.number(),
  "productName": zod.string(),
  "priceAtPurchase": zod.number(),
  "quantity": zod.number(),
  "imageUrl": zod.string()
})),
  "total": zod.number(),
  "createdAt": zod.coerce.date(),
  "updatedAt": zod.coerce.date()
}))
})

