import { DocumentCollection, Database, EdgeCollection } from "arangojs";
import * as Joi from "joi";
import { BaseCollection } from "arangojs/lib/cjs/collection";

export default class BaseModel {
  public schema: Joi.Schema;
  public collection: DocumentCollection;
  public model: string;

  constructor(db: Database, model: string) {
    this.model = model;
    this.collection = db.collection(model);
  }
  save = async obj => {
    const value = await this.schema.validateAsync(obj);
    return this.collection.save(value);
  };
  get = async id => {
    try {
      const data = await this.collection.document(id);
      return data;
    } catch (err) {
      if (err.response.body.errorNum == 1202) {
        return null;
      }
      throw err;
    }
  };

  update = async (id, data) => {
    try {
      const result = await this.collection.update(id, data);
      return result;
    } catch (err) {
      if (err.response.body.errorNum == 1202) {
        return null;
      }
      throw err;
    }
  };
}
export class EdgeModel {
  public schema: Joi.Schema;
  public collection: EdgeCollection;
  public model: string;
  private _from: string;
  private _to: string;
  private _toCollection: BaseCollection;
  private _fromCollection: BaseCollection;

  constructor(db: Database, model: string, { _from, _to }) {
    this.model = model;
    this.collection = db.edgeCollection(model);
    this._from = _from;
    this._to = _to;
    this._fromCollection = db.collection(_from);
    this._toCollection = db.collection(_to);
  }
  link = async obj => {
    const value = await this.schema.validateAsync(obj);
    const savedEdge = await this.collection.save({
      _from: `${this._from}/${value[this._from]}`,
      _to: `${this._to}/${value[this._to]}`
    });
    console.log(savedEdge);
    return savedEdge;
  };
}
