// Generated by Xata Codegen 0.30.1. Please do not edit.
import { buildClient } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";

const tables = [
  {
    name: "Events",
    checkConstraints: {
      Events_xata_id_length_xata_id: {
        name: "Events_xata_id_length_xata_id",
        columns: ["xata_id"],
        definition: "CHECK ((length(xata_id) < 256))",
      },
    },
    foreignKeys: {},
    primaryKey: [],
    uniqueConstraints: {
      Events__pgroll_new_itemId_key: {
        name: "Events__pgroll_new_itemId_key",
        columns: ["itemId"],
      },
      _pgroll_new_Events_xata_id_key: {
        name: "_pgroll_new_Events_xata_id_key",
        columns: ["xata_id"],
      },
    },
    columns: [
      {
        name: "Name",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "Price",
        type: "float",
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "company",
        type: "text",
        notNull: false,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "imageUrl",
        type: "text",
        notNull: false,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "itemId",
        type: "int",
        notNull: true,
        unique: true,
        defaultValue: null,
        comment: "",
      },
      {
        name: "xata_createdat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: "('rec_'::text || (xata_private.xid())::text)",
        comment: "",
      },
      {
        name: "xata_updatedat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_version",
        type: "int",
        notNull: true,
        unique: false,
        defaultValue: "0",
        comment: "",
      },
    ],
  },
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type Events = InferredTypes["Events"];
export type EventsRecord = Events & XataRecord;

export type DatabaseSchema = {
  Events: EventsRecord;
};

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL:
    "https://Jenn-A-s-workspace-55jt5r.us-east-1.xata.sh/db/events-database",
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (instance) return instance;

  instance = new XataClient();
  return instance;
};
