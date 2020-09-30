import { ZObj } from 'zshared';
import { ZMongoService, ZMongoReadOpts, ZMongoInsertOpts } from 'zshared-server';
// import { Role } from '../enums/role.enum';
import { BaseService } from './base.service';
import { AuthUser } from '../models/auth-user.model';
import { GetItemsResponse } from '@shared/models/get-items-response.model';

export abstract class BaseEntityService extends BaseService {
  protected constructor(protected entityName,
                        protected mongoService: ZMongoService,
                        protected collectionName,
                        protected profileKeys,
                        protected externalIdKey = 'id') {
    super();
  }

  /*********************/
  /*      F I N D      */
  /*********************/

  async findOne(query?, projection?): Promise<any> {
    return this.mongoService.findOne(this.collectionName, query, projection);
  }

  async findById(id, projection?): Promise<any | null> {
    return this.findOne({ _id: id }, projection);
  }

  async findByEmail(email, projection?): Promise<any[]> {
    return this.findOne({ email }, projection);
  }

  async findMany(query?, projection?, opts?: ZMongoReadOpts): Promise<any[]> {
    return this.mongoService.findMany(this.collectionName, query, projection, opts);
  }


  /************************/
  /*     I N S E R T      */
  /************************/

  async insertOne(doc: any): Promise<any> {
    return this.mongoService.insertOne(this.collectionName, doc);
  }

  async insertOneAutoIncrement(firstId: number, doc: any): Promise<any> {
    return this.mongoService.insertOneAutoIncrement(firstId, this.collectionName, doc);
  }

  async insertMany(docs: any[]): Promise<any> {
    return this.mongoService.insertMany(this.collectionName, docs);
  }

  /*************************/
  /*      U P D A T E      */
  /*************************/

  async updateOne(query, fields): Promise<any> {
    return this.mongoService.updateOne(this.collectionName, query, fields);
  }

  async updateById(id, fields): Promise<any> {
    return this.mongoService.updateOne(this.collectionName, {  _id: id }, fields);
  }

  /*************************/
  /*      D E L E T E      */
  /*************************/

  async deleteOne(query): Promise<any> {
    return this.mongoService.deleteOne(this.collectionName, query);
  }

  async deleteById(id): Promise<any> {
    return this.deleteOne({ _id: id });
  }

  async deleteMany(query): Promise<any> {
    return this.mongoService.deleteMany(this.collectionName, query);
  }


  /**********************/
  /*    P A G I N G     */
  /**********************/

  async getItemsPage(user: AuthUser, body): Promise<GetItemsResponse> {
    return new Promise<GetItemsResponse>(async (resolve, reject) => {
      try {
        let totalCount;
        const query: any = await this.getPageFilterQuery(body.filter);
        const opts: ZMongoReadOpts = {
          skip: body.paging.pageIndex * body.paging.pageSize,
          limit: body.paging.pageSize,
          sort: { [this.externalIdKey && this.getDbIdKey(body.sort.key)]: body.sort.order }
        }
        const reqs: Promise<any>[] = [this.mongoService.findMany(this.collectionName, query, {}, opts)];
        if (body.isTotalCount) reqs.push(this.mongoService.count(this.collectionName, query));
        const responses = await Promise.all(reqs);
        const items = responses[0].map(doc => this.getProfileFromDoc(doc));
        if (body.isTotalCount) totalCount = responses[1];
        resolve({ items, totalCount });
      } catch (e) {
        this.loge(`error getting ${this.entityName} page`, e, body);
        reject(e);
      }
    });
  }

  protected getPageFilterQuery(reqFilter: {}) {
    const query: any = {};
    for (const key in reqFilter) {
      if (reqFilter[key] !== '') {
        if (Array.isArray(reqFilter[key])) {
          query[this.getDbIdKey(key)] = { $in: reqFilter[key] };
        } else {
          query[this.getDbIdKey(key)] = reqFilter[key];
        }
      }
    }
    return query;
  }

  getDbIdKey(key) {
    return key === this.externalIdKey ? '_id' : key;
  }

  // aggregate(query) {
  //   return new Promise(async(resolve, reject) => {
  //     await this.model.aggregate(query).exec((err, result) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve(result);
  //       }
  //     });
  //   });
  // }


  /***********************/
  /*    P R O F I L E    */
  /***********************/

  getProfileFromDoc(doc): any {
    return ZObj.clone(doc, this.profileKeys);
  }

  async getAllProfiles(query?, projection?, opts?) {
    return new Promise<any[]>(async (resolve, reject) => {
      try {
        const docs: any[] = await this.findMany(query, projection, opts);
        const profiles = docs.map(doc => this.getProfileFromDoc(doc));
        resolve(profiles);
      } catch (e) {
        this.loge(`error getting all ${this.entityName}`, e);
        reject(e);
      }
    });
  }

  async getProfileById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = await this.findById(id);
        if (!doc) this.logiAndThrow(`${this.entityName} not found`, id);
        const profile = this.getProfileFromDoc(doc);
        resolve(profile);
      } catch (e) {
        this.loge(`error getting ${this.entityName} profile`, e, id);
        reject(e);
      }
    });
  }
}
