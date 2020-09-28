import { ZArray, ZObj } from 'zshared';
import { Injectable }         from '@nestjs/common';
// import { InjectModel }         from '@nestjs/mongoose';
import { BaseEntityService } from '../../base-classes/base-entity.service';
import { EncryptionService } from '../encryption.service';
import { AddUserDto } from '../../../routes/user/dtos/add-user.dto';
import { UserDoc } from '@shared/models/user-doc.model';
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
          const response = await this.mongoService.insertOneAutoIncrement(this.FIRST_USER_ID, this.collectionName, userDoc);
          resolve({ isSuccess: true, data: this.getProfileFromDoc(userDoc), insertedId: response['insertedId'] });
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

  async temp1() {
    return new Promise(async (resolve, reject) => {
      try {
        const users = this.temp1GetUsers();
        for (const user of users) {
          await this.insertOneAutoIncrement(this.FIRST_USER_ID, user);
        }
        resolve();
      } catch (e) {
        this.loge('error temp1', e);
        reject(e);
      }
    });
  }

  temp1GetUsers() {
    const users = [
      {
        "id": 1,
        "name": "Leanne Graham",
        "username": "Bret",
        "email": "Sincere@april.biz",
        "address": {
          "street": "Kulas Light",
          "suite": "Apt. 556",
          "city": "Gwenborough",
          "zipcode": "92998-3874",
          "geo": {
            "lat": "-37.3159",
            "lng": "81.1496"
          }
        },
        "phone": "1-770-736-8031 x56442",
        "website": "hildegard.org",
        "company": {
          "name": "Romaguera-Crona",
          "catchPhrase": "Multi-layered client-server neural-net",
          "bs": "harness real-time e-markets"
        }
      },
      {
        "id": 2,
        "name": "Ervin Howell",
        "username": "Antonette",
        "email": "Shanna@melissa.tv",
        "address": {
          "street": "Victor Plains",
          "suite": "Suite 879",
          "city": "Wisokyburgh",
          "zipcode": "90566-7771",
          "geo": {
            "lat": "-43.9509",
            "lng": "-34.4618"
          }
        },
        "phone": "010-692-6593 x09125",
        "website": "anastasia.net",
        "company": {
          "name": "Deckow-Crist",
          "catchPhrase": "Proactive didactic contingency",
          "bs": "synergize scalable supply-chains"
        }
      },
      {
        "id": 3,
        "name": "Clementine Bauch",
        "username": "Samantha",
        "email": "Nathan@yesenia.net",
        "address": {
          "street": "Douglas Extension",
          "suite": "Suite 847",
          "city": "McKenziehaven",
          "zipcode": "59590-4157",
          "geo": {
            "lat": "-68.6102",
            "lng": "-47.0653"
          }
        },
        "phone": "1-463-123-4447",
        "website": "ramiro.info",
        "company": {
          "name": "Romaguera-Jacobson",
          "catchPhrase": "Face to face bifurcated interface",
          "bs": "e-enable strategic applications"
        }
      },
      {
        "id": 4,
        "name": "Patricia Lebsack",
        "username": "Karianne",
        "email": "Julianne.OConner@kory.org",
        "address": {
          "street": "Hoeger Mall",
          "suite": "Apt. 692",
          "city": "South Elvis",
          "zipcode": "53919-4257",
          "geo": {
            "lat": "29.4572",
            "lng": "-164.2990"
          }
        },
        "phone": "493-170-9623 x156",
        "website": "kale.biz",
        "company": {
          "name": "Robel-Corkery",
          "catchPhrase": "Multi-tiered zero tolerance productivity",
          "bs": "transition cutting-edge web services"
        }
      },
      {
        "id": 5,
        "name": "Chelsey Dietrich",
        "username": "Kamren",
        "email": "Lucio_Hettinger@annie.ca",
        "address": {
          "street": "Skiles Walks",
          "suite": "Suite 351",
          "city": "Roscoeview",
          "zipcode": "33263",
          "geo": {
            "lat": "-31.8129",
            "lng": "62.5342"
          }
        },
        "phone": "(254)954-1289",
        "website": "demarco.info",
        "company": {
          "name": "Keebler LLC",
          "catchPhrase": "User-centric fault-tolerant solution",
          "bs": "revolutionize end-to-end systems"
        }
      },
      {
        "id": 6,
        "name": "Mrs. Dennis Schulist",
        "username": "Leopoldo_Corkery",
        "email": "Karley_Dach@jasper.info",
        "address": {
          "street": "Norberto Crossing",
          "suite": "Apt. 950",
          "city": "South Christy",
          "zipcode": "23505-1337",
          "geo": {
            "lat": "-71.4197",
            "lng": "71.7478"
          }
        },
        "phone": "1-477-935-8478 x6430",
        "website": "ola.org",
        "company": {
          "name": "Considine-Lockman",
          "catchPhrase": "Synchronised bottom-line interface",
          "bs": "e-enable innovative applications"
        }
      },
      {
        "id": 7,
        "name": "Kurtis Weissnat",
        "username": "Elwyn.Skiles",
        "email": "Telly.Hoeger@billy.biz",
        "address": {
          "street": "Rex Trail",
          "suite": "Suite 280",
          "city": "Howemouth",
          "zipcode": "58804-1099",
          "geo": {
            "lat": "24.8918",
            "lng": "21.8984"
          }
        },
        "phone": "210.067.6132",
        "website": "elvis.io",
        "company": {
          "name": "Johns Group",
          "catchPhrase": "Configurable multimedia task-force",
          "bs": "generate enterprise e-tailers"
        }
      },
      {
        "id": 8,
        "name": "Nicholas Runolfsdottir V",
        "username": "Maxime_Nienow",
        "email": "Sherwood@rosamond.me",
        "address": {
          "street": "Ellsworth Summit",
          "suite": "Suite 729",
          "city": "Aliyaview",
          "zipcode": "45169",
          "geo": {
            "lat": "-14.3990",
            "lng": "-120.7677"
          }
        },
        "phone": "586.493.6943 x140",
        "website": "jacynthe.com",
        "company": {
          "name": "Abernathy Group",
          "catchPhrase": "Implemented secondary concept",
          "bs": "e-enable extensible e-tailers"
        }
      },
      {
        "id": 9,
        "name": "Glenna Reichert",
        "username": "Delphine",
        "email": "Chaim_McDermott@dana.io",
        "address": {
          "street": "Dayna Park",
          "suite": "Suite 449",
          "city": "Bartholomebury",
          "zipcode": "76495-3109",
          "geo": {
            "lat": "24.6463",
            "lng": "-168.8889"
          }
        },
        "phone": "(775)976-6794 x41206",
        "website": "conrad.com",
        "company": {
          "name": "Yost and Sons",
          "catchPhrase": "Switchable contextually-based project",
          "bs": "aggregate real-time technologies"
        }
      },
      {
        "id": 10,
        "name": "Clementina DuBuque",
        "username": "Moriah.Stanton",
        "email": "Rey.Padberg@karina.biz",
        "address": {
          "street": "Kattie Turnpike",
          "suite": "Suite 198",
          "city": "Lebsackbury",
          "zipcode": "31428-2261",
          "geo": {
            "lat": "-38.2386",
            "lng": "57.2232"
          }
        },
        "phone": "024-648-3804",
        "website": "ambrose.net",
        "company": {
          "name": "Hoeger LLC",
          "catchPhrase": "Centralized empowering task-force",
          "bs": "target end-to-end models"
        }
      }
    ].map(user => {
      const tokens = user.name.split(' ');
      const firstName = tokens[0];
      const lastName = tokens[1];
      return {
        "status" : 1,
        "firstName" : firstName,
        "lastName" : lastName,
        "email" : user.email,
        "role" : "Member",
        "lastLoginTime" : Date.now(),
        "password" : {
          "hash" : "121ca303f10f003859295c4b36f8e633d0c75eafd869e66f299243f668478e10dde745f810a0beee4c03dc6df367d67ab72a144d378fa3dea03679d241561ed2",
          "salt" : "09e3a6e286f74a97"
        }
      }
    })
    return users;
  }
}
