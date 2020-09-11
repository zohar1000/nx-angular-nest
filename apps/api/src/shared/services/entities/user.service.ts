import { ZArray, ZObj } from 'zshared';
import { Injectable }         from '@nestjs/common';
// import { InjectModel }         from '@nestjs/mongoose';
import { BaseEntityService } from './base-entity.service';
import { EncryptionService } from '../encryption.service';
import { AddUserDto } from '../../../routes/user/dtos/add-user.dto';
import { UserDoc } from '../../models/db/user-doc.model';
import { ZMongoService } from 'zshared-server';
import { UpdateUserDto } from '../../../routes/user/dtos/update-user.dto';

@Injectable()
export class UserService extends BaseEntityService {
  readonly FIRST_USER_ID = 101;

  constructor(mongoService: ZMongoService, private readonly encryptionService: EncryptionService) {
    super('user', mongoService, 'users', [{ _id: { renameTo: 'id' }}, 'email', 'firstName', 'lastName', 'role', 'lastLoginTime', 'status']);
  }

  async addUser(dto: AddUserDto): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let userDoc: UserDoc = await this.findByEmail(dto.email);
        if (userDoc) {
          this.throw('The email address is already being used');
        } else {
          userDoc = {
            firstName: dto.firstName || '',
            lastName: dto.lastName || '',
            email: dto.email,
            role: dto.role,
            status: dto.status,
            password: this.encryptionService.getHashedPassword(dto.password),
            lastLoginTime: 0
          };
          await this.mongoService.insertOneAutoIncrement(this.FIRST_USER_ID, this.collectionName, userDoc);
          resolve({ isSuccess: true, data: this.getProfileFromDoc(userDoc) });
        }
      } catch (e) {
        this.logw('error adding user', e);
        reject(e);
      }
    });
  }

  async updateUser(userId, dto: UpdateUserDto) {
    return new Promise(async (resolve, reject) => {
      try {
        const fields: any = ZObj.clone(dto);
        if (fields.password) {
          fields.password = this.encryptionService.getHashedPassword(fields.password);
        } else {
          delete fields.password;
        }
        await this.updateById(userId, fields);
        resolve();
      } catch (e) {
        this.loge('error trying to update user record', e, userId, dto);
        reject(e);
      }
    });
  }


  /**********************/
  /*   U T I L S        */
  /**********************/

  async findByEmail(email: string): Promise<any | null> {
    let doc;
    try {
      doc = await this.findOne({ email });
    } catch(e) {}
    return doc;
  }
}
