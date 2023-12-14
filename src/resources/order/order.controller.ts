import Controller from "@/utils/interfaces/controller.interface";
import { NextFunction, Request, Response, Router } from "express";
import OrderService from "@/resources/order/order.service";
import {
  CreateOrderInterface,
  FetchOrderInterface,
} from "@/resources/order/order.interface";
import { StatusCodes } from "http-status-codes";
import HttpException from "@/utils/exceptions/HttpException";
import { isAdmin, loggedIn, validateResource } from "@/middlewares/index";
import {
  createOrderSchema,
  fetchOrderSchema,
} from "@/resources/order/order.validation";

class OrderController implements Controller {
  public path = "/orders";
  public router = Router();
  private orderService = new OrderService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes() {
    this.router.post(
      `${this.path}/create`,
      [loggedIn, validateResource(createOrderSchema)],
      this.createOrder
    );

    this.router.get(
      `${this.path}/:orderId`,
      [loggedIn, validateResource(fetchOrderSchema)],
      this.fetchOrder
    );

    this.router.get(`${this.path}`, isAdmin, this.fetchOrders);
  }

  private createOrder = async (
    req: Request<{}, {}, CreateOrderInterface>,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const orderInput = req.body;
    const { _id: userId } = res.locals.user;
    try {
      const order = await this.orderService.createOrder(orderInput, userId);
      res.status(StatusCodes.CREATED).json(order);
    } catch (e: any) {
      next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
    }
  };

  private fetchOrder = async (
    req: Request<FetchOrderInterface>,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { orderId } = req.params;
    const { _id: userId } = res.locals.user;

    try {
      const order = await this.orderService.fetchOrder(orderId, userId);
      res.status(StatusCodes.OK).json(order);
    } catch (e: any) {
      next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
    }
  };

  private fetchOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const orders = await this.orderService.fetchOrders();
      res.status(StatusCodes.OK).json(orders);
    } catch (e: any) {
      next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
    }
  };
}

export default OrderController;
