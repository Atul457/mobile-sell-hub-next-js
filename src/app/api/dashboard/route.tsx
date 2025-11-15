import { dbConfig } from '@/configs/dbConfig';
import CategoryModel from '@/models/category.model';
import ProductModel from '@/models/product.model';
import ProductCategoryModel from '@/models/product-category.model';
import TagModel from '@/models/tag.model';
import UserModel from '@/models/user.model';
import { middlewares } from '@/utils/middlewares';
import { utils } from '@/utils/utils';

export async function GET(request: Request) {
    return utils.errorHandler(async function () {
        await dbConfig();

        const authData = await middlewares.withUser(request);
        const { SHOP, ADMIN } = utils.CONST.USER.TYPES;
        const isShop = authData.type === SHOP;

        let stats: { key: string; value: number }[] = [];

        if (isShop) {
            const { shopId } = authData;
            const [tagsCount, productsCount, categoriesCount, productCategoriesCount] = await Promise.all([
                TagModel.countDocuments({
                    shopId: shopId
                }),
                ProductModel.countDocuments({
                    shopId: shopId
                }),
                CategoryModel.countDocuments({
                    shopId: shopId
                }),
                ProductCategoryModel.countDocuments({
                    shopId: shopId
                })
            ]);

            stats = [
                {
                    key: 'tags',
                    value: tagsCount
                },
                {
                    key: 'products',
                    value: productsCount
                },
                {
                    key: 'categories',
                    value: categoriesCount
                },
                {
                    key: 'product-categories',
                    value: productCategoriesCount
                }
            ];
        } else {
            const [adminsCount, shopsCount] = await Promise.all([
                UserModel.countDocuments({
                    type: ADMIN
                }),
                UserModel.countDocuments({
                    type: SHOP
                })
            ]);
            stats = [
                {
                    key: 'admins',
                    value: adminsCount
                },
                {
                    key: 'shops',
                    value: shopsCount
                }
            ];
        }

        return Response.json(
            utils.generateRes({
                status: true,
                data: {
                    stats
                }
            })
        );
    });
}
