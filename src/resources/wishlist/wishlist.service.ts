import WishList from "@/resources/wishlist/wishlist.model";
import User from "@/resources/user/user.model";
import {
  CreateWishlistInterface,
  FetchWishtListsInterface,
} from "@/resources/wishlist/wishlist.interface";
import log from "@/utils/logger";
import Course from "@/resources/course/course.model";
import Academy from "@/resources/academy/academy.model";
import { FilterQuery } from "mongoose";

class WishlistService {
  private wishlistModel = WishList;
  private userModel = User;
  private courseModel = Course;
  private academyModel = Academy;

  public async createWishlist(
    wishlistInput: CreateWishlistInterface,
    userId: string
  ): Promise<object | Error> {
    const { productId, productType } = wishlistInput;

    try {
      // Ensure that the product exists
      switch (productType) {
        case "Academy":
          const academy = await this.academyModel.findById(productId);
          if (!academy) {
            throw new Error("Academy not found");
          }
          break;
        case "Course":
          const course = await this.courseModel.findById(productId);
          if (!course) {
            throw new Error("Course not found");
          }
          break;
      }

      const wishlist = await this.wishlistModel.create({
        productType,
        productId,
        userId,
        productModelType: productType,
      });
      return wishlist;
    } catch (e: any) {
      log.error(e.message);
      throw new Error(e.message || "Error creating wishlist");
    }
  }

  public async deleteWishlist(
    userId: string,
    wishlistId: string
  ): Promise<string | Error> {
    try {
      // Verify that the wishlist exists
      const wishlist = await this.wishlistModel.findById(wishlistId);
      if (!wishlist) {
        throw new Error("Wishlist does not exist");
      }

      if (userId !== String(wishlist.userId)) {
        throw new Error("You are not authorised to delete this wishlist");
      }

      await this.wishlistModel.findByIdAndDelete(wishlistId);

      return "Wishlist has been successfully removed";
    } catch (e: any) {
      log.error(e.message);
      throw new Error(e.message || "Error deleting wishlist");
    }
  }

  public async fetchWishlists(
    userId: string,
    queryOptions: FetchWishtListsInterface
  ): Promise<object | Error> {
    const { productType } = queryOptions;
    const query: FilterQuery<typeof this.wishlistModel> = {};

    query.userId = userId;

    query.productType = productType;

    const model =
      productType === "Academy" ? this.academyModel : this.courseModel;

    try {
      const wishlists = await this.wishlistModel.find(query).populate({
        path: "productId",
        model: model,
        populate: {
          path: "userId",
          model: this.userModel,
          select: "firstName lastName username _id imgUrl",
        },
        select:
          "_id name imageUrl price description overview difficulty duration lessons courses rating reviewsCount requirements highlights approved submitted deleted type slug",
      });

      return wishlists;
    } catch (e: any) {
      log.error(e.message);
      throw new Error(e.message || "Error fetching wishlists");
    }
  }
}
export default WishlistService;
// _id name imageUrl price description overview difficulty duration lessons courses rating reviewsCount requirements highlights approved submitted deleted type slug