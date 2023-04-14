import { Schema, Document, model } from "mongoose";
import { Stock } from "./stock";
import { Dunnage } from "./dunnage";
import { Product } from "./product";

export type CycleCheckForm = {
  departmentId: string;
  departmentName: string;
  dunnage: typeof Dunnage[];
  stockList: typeof Stock[];
}

export type SubAssemblyForm = {
  departmentId: string;
  departmentName: string;
  stockList: typeof Stock[];
}

export type ProductionCountForm = {
  departmentId: string;
  departmentName: string;
  productList: typeof Product[];
}


export type EventDocument = Document & {
  plantId: string;
  departmentId: string;
  eventDate: string;
  eventTime: string;
  userId: string;
  operationType: string;
  modelType: string;
  userName: string;
  userEmailAddress: string;
  itemId: string;
  itemName: string;
  cycleCheckForm: CycleCheckForm[];
  subAssemblyForm: SubAssemblyForm[];
  productionCountForm: ProductionCountForm[];
};

const EventSchema = new Schema<EventDocument>(
  {
    plantId: {
      type: String,
      required: true,
    },
    departmentId: {
      type: String,
      required: false,
    },
    eventDate: {
      type: String,
      required: true,
    },
    eventTime: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    operationType: {
      type: String,
      required: true,
    },
    modelType: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmailAddress: {
      type: String,
      required: true,
    },
    itemId: {
      type: String,
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    cycleCheckForm: {
      type: [new Schema<CycleCheckForm>({
        departmentId: {
          type: String,
          required: true,
        },
        departmentName: {
          type: String,
          required: true,
        },
        dunnage: {
          type: [Dunnage.schema],
          required: true,
        },
        stockList: {
          type: [Stock.schema],
          required: true,
        },
      })],
      required: false,
    },
    subAssemblyForm: {
      type: [new Schema<SubAssemblyForm>({
        departmentId: {
          type: String,
          required: true,
        },
        departmentName: {
          type: String,
          required: true,
        },
        stockList: {
          type: [Stock.schema],
          required: true,
        },
      })],
      required: false,
    },
    productionCountForm: {
      type: [new Schema<ProductionCountForm>({
        departmentId: {
          type: String,
          required: true,
        },
        departmentName: {
          type: String,
          required: true,
        },
        productList: {
          type: [Product.schema],
          required: true,
        },
      })],
      required: false,
    },
  },
  { timestamps: true }
);


export const Event = model<EventDocument>("Event", EventSchema);
