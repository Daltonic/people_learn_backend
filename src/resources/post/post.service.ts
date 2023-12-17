import User from "@/resources/user/user.model";
import {
  CreatePostInterface,
  UpdatePostInterface,
} from "@/resources/post/post.interface";
import Post, { IPost } from "@/resources/post/post.model";
import log from "@/utils/logger";
import { Schema } from "mongoose";

class PostService {
  private postModel = Post;
  private userModel = User;

  public async createPost(
    postInput: CreatePostInterface,
    userId: string
  ): Promise<object | Error> {
    const { name, description, overview, imageUrl, parentId } = postInput;

    try {
      // Ensure that this is a valid user
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // If there is parentId, ensure that the Parent Post exists
      let parentPost: IPost | null = null;
      if (parentId) {
        parentPost = await this.postModel.findById(parentId);
        if (!parentPost) {
          throw new Error("Parent Post not found");
        }
      }

      // Create the post
      const post = await this.postModel.create({
        name,
        description,
        overview,
        userId,
        parentId: parentId || null,
        imageUrl: imageUrl || null,
      });

      return post;
    } catch (e: any) {
      log.error(e.message);
      throw new Error(e.message || "Error creating Post");
    }
  }

  public async updatePost(
    postInput: UpdatePostInterface["body"],
    postId: string,
    userId: string
  ): Promise<object | Error> {
    const { name, overview, description, imageUrl } = postInput;
    try {
      if (!name && !overview && !description && !imageUrl) {
        throw new Error("No data to update");
      }

      // Ensure that the user exists
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Ensure that the post exists
      const post = await this.postModel.findById(postId);
      if (!post) {
        throw new Error("Post not found");
      }

      // Ensure that current user is either the post creator or an admin
      if (user.userType !== "admin" && userId !== String(post.userId)) {
        throw new Error("You are not permitted to update this Post");
      }

      const updatedPost = await this.postModel.findByIdAndUpdate(
        postId,
        {
          name: name || post.name,
          description: description || post.description,
          overview: overview || post.overview,
          imageUrl: imageUrl || post.imageUrl,
          published: user.userType === "admin",
        },
        { new: true }
      );

      return updatedPost!;
    } catch (e: any) {
      log.error(e.message);
      throw new Error(e.message || "Error updating Post");
    }
  }

  public async publishPost(
    postId: string,
    userId: string
  ): Promise<string | Error> {
    try {
      // Ensure that this user is an admin
      const user = await this.userModel.findById(userId);
      if (!user || user.userType !== "admin") {
        throw new Error("You are not permitted to publish this post");
      }

      // Ensure that the post exists
      const post = await this.postModel.findById(postId);
      if (!post) {
        throw new Error("Post not found");
      }

      // If the post is already published, return;
      if (post.published) {
        return "Post already published";
      }

      // Now publish the post
      post.published = true;
      await post.save();

      await this.postModel.findByIdAndUpdate(
        post.parentId,
        {
          $push: { comments: post._id },
          $inc: { commentsCount: 1 },
        },
        { new: true }
      );

      return "Post has been successfully approved";
    } catch (e: any) {
      log.error(e.message);
      throw new Error(e.message || "Error approving Post");
    }
  }

  public async fetchPost(postId: string): Promise<object | Error> {
    try {
      // Ensure that the post exists
      const post = await this.postModel.findById(postId).populate({
        path: "comments",
        model: this.postModel,
        select: "_id name description overview",
      });
      if (!post) {
        throw new Error("Post not found");
      }
      return post;
    } catch (e: any) {
      log.error(e.message);
      throw new Error(e.message || "Error fetching Post");
    }
  }

  public async fetchUserPosts(userId: string): Promise<object | Error> {
    try {
      const user = await this.userModel.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      // Todo: Pagination and searching
      const posts = await this.postModel.find({ userId }).populate({
        path: "comments",
        model: this.postModel,
        select: "_id name description overview",
      });
      return posts;
    } catch (e: any) {
      log.error(e);
      throw new Error(e.message || "Error fetching User's Posts");
    }
  }

  public async fetchPosts(
    parentsOnly: boolean,
    publishedOnly: boolean
  ): Promise<object | Error> {
    try {
      // todo: pagination, sorting, filter
      const posts = await this.postModel
        .find({ published: publishedOnly })
        .populate({
          path: "userId",
          model: this.userModel,
          select: "_id username firstName lastName",
        })
        .populate({
          path: "comments",
          model: this.postModel,
          select: "_id name description overview",
        });
      return posts;
    } catch (e: any) {
      log.error(e.message);
      throw new Error(e.message || "Error fetching Posts");
    }
  }

  public async deletePost(
    postId: string,
    userId: string,
    deleteWithChildren: boolean
  ): Promise<string | Error> {
    try {
      // Ensure that the post exists
      const post = await this.postModel.findById(postId);
      if (!post) {
        throw new Error("Post not found");
      }

      // Ensure that the user exists
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Ensure that this is either an admin or the post creator
      if (user.userType !== "admin" && userId !== String(post.userId)) {
        throw new Error("You are not permitted to delete this Post");
      }

      if (deleteWithChildren) {
        await Promise.all(
          post.comments.map((comment: Schema.Types.ObjectId) =>
            this.postModel.findByIdAndDelete(comment)
          )
        );
      } else {
        await Promise.all(
          post.comments.map((comment: Schema.Types.ObjectId) =>
            this.postModel.findByIdAndUpdate(comment, {
              parentId: null,
              deleted: true,
            })
          )
        );
      }

      await this.postModel.findByIdAndDelete(postId);

      return "Post has been successfully deleted";
    } catch (e: any) {
      log.error(e.message);
      throw new Error(e.message || "Error deleting Post");
    }
  }
}

export default PostService;
